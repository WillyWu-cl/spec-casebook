// Design check (figma skill, references/conformance.md): one command for every step after the Figma read.
// Usage: node scripts/design.ts <product>/<feature> <ios|android> <command> …
//   plan [--skip <board or screen ids> --skip-reason "<why>"]
//                     build design/plan.json (lib/design-plan.ts): each Design screen with the row that reaches it.
//                     Every other command builds it again first when the table, the traces or the Figma read changed.
//   scope [file]      apply a Plan-view scope block (sent by its Save, or pasted from a file or stdin): screens or boards
//                     excluded with a reason or included again, and the scope marked reviewed; `both` in its header
//                     applies it to every platform of the feature with a design plan
//   screens [TC-… | --left <run dir>]
//                     the screens a row reaches, to capture while it runs (id, name, fit); without a row, every
//                     routed screen in journey order with its row or Design path (what a design pass walks); --left:
//                     only those the run has not captured (a design pass after a casebook run walks just these).
//                     In a casebook run the device scripts capture a row's screens on their own (`case ID` arms
//                     lib/design-watch.ts); this list is for the ones they could not match.
//   check <run dir> [--screen <id,…>] [--recheck <earlier run>] [--build <version (build)>]
//                     measure every new capture (below) and draw its sheet
//   settle <run dir>  merge the two review passes into design/findings.json
//   decide [file]     apply a Design-tab decisions block (sent by its Save, or pasted from a file or stdin) to the runs' findings
//   ebugs <run dir>   write design/ebug-findings.md: the settled bugs ticked for filing (all bugs with --all), each with
//                     its row's steps, Figma vs app, the Figma link and the sheet, for spec-casebook references/ebugs.md
//   status [run dir]  where the design check stands and the next step (default: the newest run with captures)
// Run dirs may be given as a folder name under <table>/runs/.
//
// check: for every screen in <run dir>/design/captures.jsonl (device.ts design; the newest whole-screen capture per
// screen and the scrolled parts taken after it), compares the Figma screen (figma-source out/<board>.json, every
// visible node inside it) with the app's page source and screenshot, and writes <run dir>/design/compare.json
// (committed) with one candidate per difference. Exact data first (user, 2026-11-04): Figma's texts, fonts, colours
// and glyph bounds come from the source read; the app's texts, bounds and, on Android, layers (drawing order) and
// keyboard (its window) from the page source; on Android with the debuggable build, each text's colour, size (sp),
// weight and lines and each fill's colour and corner radius from the app's own view data taken with the capture
// (lib/android-views.ts, `src: app` on the candidate; REQ-086); otherwise the screenshot gives colours as drawn and, by OCR (macOS Vision,
// scripts/ocr-images.swift, cached in committed files), only what no dump holds: glyph bounds for lines, size and
// position, and a cross-check of the layers (details at measure() and ocrPass()). Every colour compared is also
// sampled as drawn on both images and listed beside the value set (`drawn`; user, 2026-11-05).
//   state     under 40 % of the frame's short texts were found (another state), the keyboard is up where the frame has
//             it down (or the other way), or the screen kept moving while it was captured                  major
//   appearance the frame is dark and the capture light (or the other way)                                     major
//   (no `copy` and no `position` since 2026-11-06, user: a text's words and its own place are not checked. A text
//   is paired by its words, else by its place: the app text on the same line where Figma draws it)
//   missing   a Figma text with no app text with its words nor on its line; long sample text (> 60 characters) is
//             `sample`, info                                                                                major
//   truncated the app text ends in an ellipsis Figma does not have, or runs past the screen edge           major
//   lines     the app text takes more (or fewer) lines than Figma: wrapping (lines read on the screenshot)  minor
//   size      the app's size in sp 6 % (and 0.5 sp) off Figma's points (view data), else a text wider or narrower
//             (same characters), or taller or shorter, than this platform draws Figma's font (sizeCands)      minor
//   weight    the app's font weight 100 or more from Figma's (view data)                                   minor
//   radius    a fill's corner radius over 2 dp from Figma's (view data)                                     minor
//   padding   a text's inset to the edge of its box (button, chip, card, tag) off Figma's (layoutCands)  minor
//   align     a text Figma centres in its box off centre (layoutCands)                                    minor
//   border    the box's border drawn differently (borderCands)                                            minor
//   spacing   the gap between neighbouring buttons off Figma's (layoutCands)                              minor
//   colour    a filled shape (button, chip, card, badge) ΔE > 12 from its Figma fill, or a text ΔE > 18   minor
//   control   an unlabelled control of the inventory (icon) with no tappable app element where it is drawn major
//   extra     short app text (≤ 40 characters) Figma does not draw on the screen                            info
// Scrolled parts (device.ts design <id> --part 2…) add their texts to copy / missing / extra only.
// Projection: Figma's frame width maps to the phone's window width (one scale for x and y); texts in the upper half
// are measured from the top and those in the lower half from the bottom, each half shifted by the median offset of its
// exactly matched texts (safe areas and status bars differ by phone), and across by the median offset of the
// left-aligned ones; the fit places shapes and icons (a text's own residual is kept on the pair, never an item). A half with under 2 anchors, or anchors spread over 6 pt, has no fit (shapes there take the nearest text's offset). System chrome (status bar,
// home indicator, keyboard instances) is left out. Candidate ids are `<kind>:<node>` (`extra:<text>`), so they stay
// the same when the check runs again and on the next build.
// Not measured (the reviewers look at the sheet): icons' drawing, images, font family, shadow; without view data, font
// weight and radius (only `size` hints at them).
// Each screen also gets screenshots/design/<id>-sheet.png (local): the Figma crop and the app screenshot side by side at
// the same width with every candidate numbered on both, the one image a reviewer reads per screen.
// --recheck <earlier run>: each bug settled there on a screen measured now is `fixed` (its candidate is gone), `still`
// or `check` (a visual item: the reviewers look again); kept in compare.json per screen, shown on the Design tab.
// The build comes from the run's run-state.md (or --build).
// settle: the same verdict on both passes stands; any disagreement, or an item one pass skipped, becomes `question`;
// a user decision already in findings.json is kept.
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { appendFileSync, copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { normLabel } from './lib/coverage.ts';
import { appElements, figmaScreen, keyboardInSource, type Box } from './lib/design-match.ts';
import type { ViewFill, ViewText, Views } from './lib/android-views.ts';
import { capturedScreens, darkFill, darkShot } from './lib/design-watch.ts';
import { planFresh, buildPlan, gapLine, kept, planPath, summary } from './lib/design-plan.ts';
import { ROOT, arg, assertIds, featureDir, readTable, tableDir, writeJson, writeJsonRows } from './lib/library.ts';

const [feature, platform, cmd, target] = process.argv.slice(2);
assertIds(feature, platform);
const table = tableDir(feature, platform), runsDir = join(table, 'runs');
const shown = (p: string) => p.startsWith(ROOT) ? p.slice(ROOT.length + 1) : p;
const read = (p: string): any => JSON.parse(readFileSync(p, 'utf8'));
const runOf = (r: string) => existsSync(r) ? r : join(runsDir, r);
const OTHER = /^n\/a:\s*other feature\b/i;
const KINDS = ['state', 'appearance', 'missing', 'truncated', 'lines', 'size', 'weight', 'radius', 'padding', 'align', 'border', 'spacing', 'colour', 'control', 'extra', 'sample'];
const USAGE = 'Usage: node scripts/design.ts <product>/<feature> <ios|android> plan | screens <TC-…> | check <run dir> | settle <run dir> | decide [file] | scope [file] | ebugs <run dir> | status [run dir]';
// the newest run folder holding design captures
const newestRun = () => existsSync(runsDir) ? readdirSync(runsDir).filter(d => existsSync(join(runsDir, d, 'design', 'captures.jsonl'))).sort().at(-1) : undefined;
const needsRun = ['check', 'settle', 'ebugs'].includes(cmd);
if (needsRun && !target) { console.error(USAGE); process.exit(2); }
// status with no run and none with captures has no run dir (runOf('') would be runs/ itself, and the activity log
// below would make a stray runs/design/ folder)
const statusRun = cmd === 'status' ? target ?? newestRun() : undefined;
const runDir = needsRun ? runOf(target) : statusRun ? runOf(statusRun) : '';
const designDir = join(runDir, 'design');
// design work on a run, for the Design tab's token use (design-page.ts): one line per command in design/activity.log
if (runDir && existsSync(runDir)) { mkdirSync(designDir, { recursive: true }); appendFileSync(join(designDir, 'activity.log'), `${new Date().toISOString()} ${cmd} ${process.argv.slice(5).join(' ').slice(0, 80)}\n`); }
// Shared captures (user, 2026-11-03): the full screenshot and page source stay local (screenshots/design/), and check
// commits a compact copy beside the results (design/captures/<id>.webp, 750 px wide, and <id>.xml), so a computer that
// pulls the run can check again, draw the sheets, review and show the Design tab without the phone's files.
const sharedOf = (local: string, ext: string) => join(designDir, 'captures', basename(local).replace(/\.(png|xml)$/, ext));
const imageOf = (rel: string) => existsSync(join(runDir, rel)) ? join(runDir, rel) : sharedOf(rel, '.webp');
const sourceOf = (rel: string) => existsSync(join(runDir, rel)) ? join(runDir, rel) : sharedOf(rel, '.xml');

if (cmd === 'plan') {
  const skip = arg('skip')?.split(',').filter(Boolean);
  const old = existsSync(join(table, 'design', 'plan.json')) ? read(join(table, 'design', 'plan.json')) : null;
  const reason = arg('skip-reason'), reasons = { ...(old?.skip_reasons ?? {}), ...(skip && reason ? Object.fromEntries(skip.map(id => [id, reason])) : {}) };
  const plan = buildPlan(feature, platform, { ...kept(old), skip: skip ?? old?.skip, skipReason: reason ?? old?.skip_reason ?? undefined, reasons });
  console.log(`${shown(join(table, 'design', 'plan.json'))}: ${summary(plan)}`);
  if (gapLine(plan.source_gaps)) console.log(`  SOURCE READ NOT COMPLETE: ${gapLine(plan.source_gaps)}`);
  for (const e of plan.screens.filter((e: any) => e.status === 'no-route').slice(0, 15)) console.log(`  no route: ${e.id} ${e.name} (${e.board_name}) — ${e.why}`);
} else if (cmd === 'screens' && (!target || target === '--left')) {
  // every routed screen in journey order: what a design pass walks (rows first, then the Design-arrow paths); with
  // --left <run>, only those that run has not captured (a casebook run's automatic captures already cover the rest)
  const plan = planFresh(feature, platform), left = target === '--left' ? process.argv[6] : '';
  if (target === '--left' && !left) { console.error('screens --left <run dir>'); process.exit(2); }
  const done = left ? capturedScreens(runOf(left)) : new Set<string>();
  if (left) console.log(`${done.size} screen(s) already captured in ${basename(runOf(left))}; the ${plan.screens.filter((x: any) => x.status === 'routed' && !done.has(x.id)).length} left:`);
  const st = frameState(plan);
  for (const s of plan.screens.filter((x: any) => x.status === 'routed' && !done.has(x.id)))
    console.log(`${s.id}  ${s.name} (${s.board_name}) · ${s.route.case ? `${s.route.case}, fit ${s.route.fit}` : `Design ${s.route.fit}: ${s.route.action}`}${s.gap ? ' · gap in the table' : ''} · ${st(s)}`);
} else if (cmd === 'screens') {
  const plan = planFresh(feature, platform);
  for (const id of plan.by_case[target ?? ''] ?? []) {
    const s = plan.screens.find((x: any) => x.id === id);
    console.log(`${s.id}  ${s.name} (${s.board_name}) · fit ${s.route.fit}${s.route.fit === 'low' ? ': bring about the state its name says' : ''} · ${frameState(plan)(s)}`);
  }
  if (!plan.by_case[target ?? '']) console.log(`${target}: no Design screen to capture`);
} else if (cmd === 'check') measure();
else if (cmd === 'settle') settle();
else if (cmd === 'decide') decide();
else if (cmd === 'scope') scope();
else if (cmd === 'ebugs') ebugs();
else if (cmd === 'status') status();
else { console.error(USAGE); process.exit(2); }

type Cand = { id: string; kind: string; severity: string; figma?: any; app?: any; delta?: any; note?: string; src?: string };

function measure() {
  const plan = planFresh(feature, platform);
  if (gapLine(plan.source_gaps ?? { unread: [], incomplete: [] })) console.error(`  WARNING source read not complete: ${gapLine(plan.source_gaps)}; captures of those boards' screens cannot be checked (design.ts … status)`);
  const ex = join(featureDir(feature), 'specs', plan.spec_set, 'extracted'), out = join(ex, 'figma-source', 'design', 'out');
  const inv = existsSync(join(ex, 'inventory.json')) ? read(join(ex, 'inventory.json')) : { controls: [] };
  // other features' controls (the trace's `n/a: other feature: …`): left out of the check with their areas
  const trace = join(table, 'control-trace.json');
  const otherFeature = new Set<string>(existsSync(trace) ? read(trace).entries.flatMap((e: any) => OTHER.test(e.press ?? '') ? e.controls : e.other ?? []) : []);
  const only = new Set((arg('screen') ?? '').split(',').filter(Boolean));
  const capFile = join(designDir, 'captures.jsonl');
  if (!existsSync(capFile)) { console.error(`${capFile}: no captures yet (device.ts <run dir> design <screen id>).`); process.exit(1); }
  // the newest whole-screen capture per screen, plus the scrolled parts taken after it
  const caps = new Map<string, any>(), parts = new Map<string, any[]>();
  for (const l of readFileSync(capFile, 'utf8').split('\n').filter(Boolean)) {
    const c = JSON.parse(l); if (only.size && !only.has(c.screen)) continue;
    if (c.part > 1) { if (caps.has(c.screen)) parts.get(c.screen)!.push(c); } else { caps.set(c.screen, c); parts.set(c.screen, []); }
  }
  const prev = existsSync(join(designDir, 'compare.json')) ? read(join(designDir, 'compare.json')).screens.filter((s: any) => !caps.has(s.id)) : [];
  const state = existsSync(join(runDir, 'run-state.md')) ? readFileSync(join(runDir, 'run-state.md'), 'utf8') : '';
  const build = state.match(/\b[A-Z][A-Za-z]+(?: iOS| Android)? (\d+\.\d+\.\d+ \(\d+\))/)?.[1] ?? arg('build') ?? '';
  const old = arg('recheck'), oldDir = old && (existsSync(old) ? old : join(table, 'runs', old));
  const oldFindings = oldDir && existsSync(join(oldDir, 'design', 'findings.json')) ? read(join(oldDir, 'design', 'findings.json')).screens : null;
  if (old && !oldFindings) { console.error(`--recheck ${old}: no design/findings.json there.`); process.exit(1); }
  const boards = new Map<string, any[]>();
  const nodesOf = (board: string) => {
    if (!boards.has(board)) { const f = join(out, `${board.replace(/[:;]/g, '-')}.json`);
      if (!existsSync(f)) { console.error(`${f} missing: run figma-source.ts merge design first.`); process.exit(1); }
      boards.set(board, read(f).nodes); }
    return boards.get(board)!;
  };
  const results: any[] = [], samples: any[] = [], sheets: any[] = [], shares: any[] = [], borders: any[] = [];
  const ocrDark = new Map<string, boolean | null>();
  const ocr = ocrPass(ocrDark, [...caps.values()].flatMap(cap => { const scr = plan.screens.find((s: any) => s.id === cap.screen);
    return scr && existsSync(imageOf(cap.png)) ? [{ cap, scr, figma: figmaCrop(scr, out), figCache: join(ex, 'figma', 'design-ocr', `${scr.id.replace(/[:;]/g, '-')}.json`) }] : []; }));
  for (const cap of caps.values()) {
    const scr = plan.screens.find((s: any) => s.id === cap.screen);
    if (!scr) { console.error(`  ${cap.screen}: not in design/plan.json, skipped`); continue; }
    const onScreen = inv.controls.filter((c: any) => c.screens?.includes(scr.inventory_screen ?? scr.id));
    const controlNodes = new Set<string>(onScreen.filter((c: any) => !c.label && !otherFeature.has(c.id)).map((c: any) => c.node));
    const ctl = (c: any) => ({ node: c.node, name: c.name, box: c.box });
    const fig = figmaScreen(nodesOf(scr.board), scr, controlNodes, { other: onScreen.filter((c: any) => otherFeature.has(c.id)).map(ctl), mine: onScreen.filter((c: any) => !otherFeature.has(c.id)).map(ctl) },
      new Set<string>(onScreen.filter((c: any) => !otherFeature.has(c.id) && c.node).map((c: any) => c.node)));
    for (const c of [cap, ...parts.get(cap.screen)!]) {
      if (!existsSync(sourceOf(c.xml)) || !existsSync(imageOf(c.png))) { console.error(`  ${c.screen}: its capture is on another computer (no ${c.xml} or shared copy), skipped`); continue; }
      if (existsSync(join(runDir, c.xml))) { mkdirSync(join(designDir, 'captures'), { recursive: true }); copyFileSync(join(runDir, c.xml), sharedOf(c.xml, '.xml')); }
      if (c.views && existsSync(join(runDir, c.views))) copyFileSync(join(runDir, c.views), join(designDir, 'captures', basename(c.views)));
      if (existsSync(join(runDir, c.png)) && (!existsSync(sharedOf(c.png, '.webp')) || statSync(sharedOf(c.png, '.webp')).mtimeMs < statSync(join(runDir, c.png)).mtimeMs)) shares.push({ src: join(runDir, c.png), dst: sharedOf(c.png, '.webp') });
    }
    if (!existsSync(sourceOf(cap.xml)) || !existsSync(imageOf(cap.png))) continue;
    const els = appElements(readFileSync(sourceOf(cap.xml), 'utf8'));
    // the app's own view data taken with this capture (Android, debuggable build: lib/android-views.ts, REQ-086): each
    // text's colour, size, weight and lines and each fill's colour and radius exactly, ahead of OCR and pixels
    const vFile = cap.views && [join(runDir, cap.views), join(designDir, 'captures', basename(cap.views))].find(f => existsSync(f));
    const V: Views | null = vFile ? read(vFile) : null;
    const [Wf, Hf] = [scr.abs[2], scr.abs[3]], k = Wf / cap.win.w, Ha = cap.win.h * k;
    const toFig = (b: Box): Box => [b[0] * k, b[1] * k, b[2] * k, b[3] * k];
    const cands: Cand[] = [], used = new Set<number>();
    const FAR: Box = [0, 1e6, 0, 0];
    // texts of the scrolled parts count for copy and missing only: their positions are not the frame's
    const appT = [...els.filter(e => e.text).map(a => ({ ...a, f: toFig(a.box), n: normLabel(a.text), part: 1 })),
      ...parts.get(cap.screen)!.flatMap(p => appElements(existsSync(sourceOf(p.xml)) ? readFileSync(sourceOf(p.xml), 'utf8') : '').filter(e => e.text).map(a => ({ ...a, f: FAR, n: normLabel(a.text), part: p.part })))];
    // What is on the screen (user, 2026-11-04): exact data first. Figma's side is exact from the source read: each
    // text's characters, font and drawn glyph bounds (`render`). The phone's page source is exact for texts, structure
    // and, on Android, for layers: a text another layer draws over (`covered`, from UiAutomator2's drawing order) or
    // that is only an icon's accessibility name (`name`) is left out (`hidden`, with why). The screenshot's OCR only
    // cross-checks that (a covered text it clearly reads is kept: a see-through scrim; `layers_disagree`) and gives
    // what no dump holds: glyph bounds, so lines, size and position. A source without layers (iOS, older captures):
    // a text no OCR line near it reads is left out. A Figma text without render bounds is read on its image the same
    // way. No OCR (not macOS, no cache): view boxes, and on Android the layers alone.
    const oA = ocr.get(`app:${scr.id}`) ?? null, oF = ocr.get(`fig:${scr.id}`) ?? null;
    const lineNs = (t: string) => t.split('\n').map(normLabel).filter(x => x.replace(/[#\W_]/g, '').length >= 2);
    // an OCR line reads part of a text when it is that text, holds it (an icon read beside a label) or is one of its
    // wrapped lines; whether the text is on the screen at all takes most of its characters read (`readMost`): a short
    // line inside a long one (「Maya Lin」 inside a paragraph behind a sheet) is not enough
    const readsAs = (o: OcrLine, n: string) => o.n === n || (n.length >= 3 && o.n.includes(n)) || (o.n.length >= 3 && n.includes(o.n)) || ratio(o.n, n) >= 0.6;
    const readMost = (g: OcrLine[] | null, text: string) => { if (!g) return false; const n = normLabel(text.replace(/\n/g, ' '));
      return g.reduce((t, o) => t + Math.min(o.n.length, n.length), 0) >= n.length * 0.6; };
    // a text's OCR lines; a line read with more than the text (an icon beside a label read as 「Et New Chat」) is cut
    // to the text's characters, in proportion
    const glyphs = (lines: OcrLine[] | null, box: Box, text: string) => { if (!lines) return null; const ns = lineNs(text);
      const g = lines.filter(o => overlap(o.box, box, 8) && ns.some(n => readsAs(o, n))).map(o => {
        const raw = o.text.toLowerCase(), part = text.split('\n').map(t => t.trim().toLowerCase()).find(t => t.length >= 2 && raw.includes(t) && raw.length > t.length);
        if (!part) return o; const at = raw.indexOf(part), cw = o.box[2] / raw.length;
        return { ...o, box: [o.box[0] + at * cw, o.box[1], part.length * cw, o.box[3]] as Box }; });
      return g.length ? g : null; };
    const hidden: any[] = [], sizes: any[] = [], disagree: any[] = [];
    const layered = /\sdrawing-order="/.test(readFileSync(sourceOf(cap.xml), 'utf8')), ocrOk = !!oA && oA.length >= 2;
    for (let i = appT.length - 1; i >= 0; i--) { const a: any = appT[i]; if (a.part !== 1) continue;
      // a covered text with an uncovered twin over it (the home page's greeting drawn over the chat's, same place) is
      // read through its twin: the screenshot cannot confirm it
      const twin = a.covered && appT.some((b: any) => b !== a && !b.covered && b.part === 1 && b.n === a.n && overlap(b.f, a.f, 2));
      const seen = ocrOk && lineNs(a.text).length && !twin ? readMost(glyphs(oA, a.f, a.text), a.text) : twin ? false : null;
      const why = layered ? (a.name ? 'name' : a.covered ? (seen ? null : 'layer') : null) : seen === false ? 'not on the screenshot' : null;
      if (layered && a.covered && seen) disagree.push({ text: a.text, box: r1(a.f) });
      if (why) { hidden.push({ text: a.text, box: r1(a.f), why }); appT.splice(i, 1); } }
    // pair texts, one to one over the whole screen: every exact pair first (nearest first), then containment, then the
    // most similar (copy), else missing. Pairing text by text let a longer Figma text take another's exact twin by
    // containment (「AI Mini Drama with Seedance 2.0」 took the tile label 「AI Mini Drama」, which was then missing; 2026-11-04)
    const pairs: { t: any; a: any; how: string }[] = [];
    const hitOf = new Map<number, { a: any; i: number; how: string }>();
    const fn = fig.texts.map((t: any) => normLabel(t.text));
    const assign = (how: string, test: (ti: number, a: any) => number | null) => {
      const opts: [number, number, number][] = [];
      fig.texts.forEach((t: any, ti: number) => { if (hitOf.has(ti)) return;
        appT.forEach((a, i) => { if (used.has(i)) return; const c = test(ti, a); if (c !== null) opts.push([c, ti, i]); }); });
      for (const [, ti, i] of opts.sort((x, y) => x[0] - y[0])) if (!hitOf.has(ti) && !used.has(i)) { hitOf.set(ti, { a: appT[i], i, how }); used.add(i); }
    };
    const dist = (ti: number, a: any) => Math.hypot(a.f[0] - fig.texts[ti].box[0], a.f[1] - fig.texts[ti].box[1]);
    assign('exact', (ti, a) => a.n === fn[ti] ? dist(ti, a) : null);
    assign('part', (ti, a) => fn[ti].length >= 6 && a.n.length >= 6 && (a.n.includes(fn[ti]) || fn[ti].includes(a.n)) ? dist(ti, a) : null);
    assign('copy', (ti, a) => { const r = ratio(a.n, fn[ti]); return r >= 0.7 ? -r : null; });
    // the words are not checked (user, 2026-11-06): an app text on the same line where Figma draws one (centres within
    // 12 pt or half its height down, overlapping or within 30 pt across) is that text, so different wording is neither
    // `missing` nor `extra`; its layout (padding, centring, size) is still measured
    assign('place', (ti, a) => { const t = fig.texts[ti].box, f = a.f, dy = Math.abs(f[1] + f[3] / 2 - (t[1] + t[3] / 2));
      const gx = Math.max(0, f[0] - (t[0] + t[2]), t[0] - (f[0] + f[2]));
      return a.part === 1 && dy <= Math.max(12, t[3] / 2) && gx <= 30 ? dy + gx : null; });
    for (const [ti, t] of fig.texts.entries()) {
      const n = fn[ti], got = hitOf.get(ti), hit = got, how = got?.how ?? '';
      if (!hit) { const sample = t.text.length > 60;
        cands.push({ id: `${sample ? 'sample' : 'missing'}:${t.node}`, kind: sample ? 'sample' : 'missing', severity: sample ? 'info' : 'major', figma: { node: t.node, text: t.text, box: r1(t.box) } }); continue; }
      pairs.push({ t, a: hit.a, how });
      const appBox = hit.a.part > 1 ? undefined : r1(hit.a.f);
      // no `copy` item: the words are not checked (user, 2026-11-06)
      // cut short: the app ends in an ellipsis Figma does not have, or runs past the window's edge
      if (/(…|\.\.\.)$/.test(hit.a.text) && !/(…|\.\.\.)$/.test(t.text)) cands.push({ id: `truncated:${t.node}`, kind: 'truncated', severity: 'major', figma: { node: t.node, text: t.text, box: r1(t.box) }, app: { text: hit.a.text, box: appBox } });
      else if (hit.a.part === 1 && (hit.a.f[0] < -1 || hit.a.f[0] + hit.a.f[2] > Wf + 1)) cands.push({ id: `truncated:${t.node}`, kind: 'truncated', severity: 'major', note: 'runs past the screen edge', figma: { node: t.node, text: t.text, box: r1(t.box) }, app: { text: hit.a.text, box: appBox } });
    }
    // arrival: a capture matching under 40 % of the frame's short texts is probably another state (Figma Agent's
    // arrival assertion); every candidate of it is then in doubt, which the reviewers settle (n/a or a real gap)
    const short = fig.texts.filter(t => t.text.length <= 60).length, hits = pairs.filter(p => (p.how === 'exact' || p.how === 'part') && p.t.text.length <= 60).length;
    const arrival = { matched: hits, of: short, ok: short < 3 || hits / short >= 0.4 };
    if (!arrival.ok) cands.unshift({ id: `state:${scr.id}`, kind: 'state', severity: 'major', note: `only ${hits} of ${short} Figma texts found: the capture may not be this frame's state` });
    // a capture whose screen kept moving (device.ts design): its page source may not be what the screenshot shows
    else if (cap.unsettled) cands.unshift({ id: `state:${scr.id}`, kind: 'state', severity: 'major', note: 'the screen kept changing while it was captured: the app boxes may not match the screenshot; capture it again once still' });
    // the frame's own state (user, 2026-11-04: a light capture with the keyboard up was taken for a dark frame without
    // one): dark or light, and the keyboard shown or not. A dark frame captured light is a bug when the phone was in
    // dark mode (`dark` in captures.jsonl, else the reviewers ask), else a capture to take again.
    // both read on their images (ocrPass), else the frame's fill and the PNG
    const frameDark = ocrDark.get(`fig:${scr.id}`) ?? darkFill(nodesOf(scr.board).find((n: any) => n.id === scr.id)),
      shot = ocrDark.get(`app:${scr.id}`) ?? (existsSync(join(runDir, cap.png)) ? darkShot(readFileSync(join(runDir, cap.png))) : null);
    if (frameDark !== null && shot !== null && frameDark !== shot)
      cands.unshift({ id: `appearance:${scr.id}`, kind: 'appearance', severity: 'major', note: `Figma draws this screen ${frameDark ? 'dark' : 'light'}, the capture is ${shot ? 'dark' : 'light'}` + (cap.dark === frameDark ? `: the phone was in ${frameDark ? 'dark' : 'light'} mode, so the app does not follow it` : cap.dark === undefined ? ': if the phone was in that mode the app does not follow it, else capture it again in that mode' : `: the phone was in ${cap.dark ? 'dark' : 'light'} mode, capture it again in ${frameDark ? 'dark' : 'light'} mode`) });
    // the keyboard: the source's own windows (Android capture with enableMultiWindows), else the phone's answer at capture
    // time (captures.jsonl `keyboard`), else the keys read on the screenshot
    const kbApp = keyboardInSource(readFileSync(sourceOf(cap.xml), 'utf8')) ?? cap.keyboard ?? keyboardShown(oA, Hf);
    if (kbApp !== null && kbApp !== fig.keyboard)
      cands.unshift({ id: `keyboard:${scr.id}`, kind: 'state', severity: 'major', note: kbApp ? 'the keyboard is up in the capture, Figma draws this screen without it: capture it again with the keyboard down' : 'Figma draws the keyboard up, the capture has it down: capture it again with the field focused' });
    // projection: each half shifted by the median offset of its exact pairs; a half with fewer than 2 anchors, or whose
    // anchors disagree by more than 6 pt (median absolute deviation), measures no positions (the Figma Agent refuses a
    // projection whose residual is over 6 px)
    const base = pairs.filter(p => p.a.part === 1);
    // each pair's glyph boxes: positions compare glyphs with glyphs when both sides were read, else the two boxes
    for (const p of base as any[]) { p.ga = glyphs(oA, p.a.f, p.a.text); p.gf = p.t.render ? renderLines(p.t) : glyphs(oF, p.t.box, p.t.text);
      [p.tb, p.ab] = p.ga && p.gf ? [union(p.gf), union(p.ga)] : [p.t.box, p.a.f]; }
    const half = (b: number[]) => b[1] + b[3] / 2 < Hf / 2 ? 'top' : 'bottom';
    const dyOf = (p: any) => half(p.t.box) === 'top' ? p.ab[1] - p.tb[1] : (Ha - p.ab[1] - p.ab[3]) - (Hf - p.tb[1] - p.tb[3]);
    const fit: Record<string, { dy: number; anchors: number; spread: number; ok: boolean }> = {};
    for (const h of ['top', 'bottom']) {
      const d = base.filter(p => p.how === 'exact' && half(p.t.box) === h).map(dyOf).sort((a, b) => a - b), med = d.length ? d[Math.floor(d.length / 2)] : 0;
      const dev = d.map(x => Math.abs(x - med)).sort((a, b) => a - b), spread = dev.length ? dev[Math.floor(dev.length / 2)] : 0;
      fit[h] = { dy: r1n(med), anchors: d.length, spread: r1n(spread), ok: d.length >= 2 && spread <= 6 };
    }
    // and across: the median offset of the left-aligned anchors (3 or more) on their left edges, as for the halves: Figma's
    // exact glyph bounds and an OCR box differ by a few points on every text alike (−5 pt on 37 texts, 2026-11-04)
    const lx = (base as any[]).filter(p => p.how === 'exact' && (p.t.align ?? 'LEFT') === 'LEFT').map(p => p.ab[0] - p.tb[0]).sort((a, b) => a - b);
    const fx = lx.length >= 3 ? lx[Math.floor(lx.length / 2)] : 0; (fit as any).x = { dx: r1n(fx), anchors: lx.length };
    for (const p of base.filter(p => p.how === 'exact')) {
      const [tb, ab] = [(p as any).tb, (p as any).ab], ga = (p as any).ga as OcrLine[] | null, gf = (p as any).gf as OcrLine[] | null;
      // the edge the text is aligned on (sample texts of other widths keep it), glyphs to glyphs when both were read: a
      // centred glyph box aligned on the left moved by its own width
      const ax = p.t.align === 'CENTER' ? [tb[0] + tb[2] / 2, ab[0] + ab[2] / 2] : p.t.align === 'RIGHT' ? [tb[0] + tb[2], ab[0] + ab[2]] : [tb[0], ab[0]];
      // a text after another on the same row (chips, tabs) is placed by the gap after it: the platform font narrows each
      // one, so absolute x drifts along the row (−5 to −19 pt over a row of language chips, 2026-11-04)
      const prevOnRow = p.t.align === 'LEFT' || !p.t.align ? (base as any[]).filter(q => q !== p && q.how === 'exact' && Math.abs((q.tb[1] + q.tb[3] / 2) - (tb[1] + tb[3] / 2)) < 4 && q.tb[0] + q.tb[2] <= tb[0] + 1)
        .sort((a, b) => (b.tb[0] + b.tb[2]) - (a.tb[0] + a.tb[2]))[0] : undefined;
      const dx = prevOnRow ? (ab[0] - (prevOnRow.ab[0] + prevOnRow.ab[2])) - (tb[0] - (prevOnRow.tb[0] + prevOnRow.tb[2])) : ax[1] - ax[0] - fx, dy = dyOf(p) - fit[half(p.t.box)].dy;
      // where a text sits on the screen is not an item (user, 2026-11-06: small offsets of a text's own place are not
      // checked); the offset is kept for the fit only. Padding and centring inside its box are (layoutCands).
      (p as any).off = { x: r1n(dx), y: r1n(dy) };
      // wrapping: the lines the OCR reads on each side (a text view's box is often taller than its lines: 「AI Mini⏎Drama」
      // drawn on one line passed on its box height, and a padded button read as two; user, 2026-11-04), else Figma's
      // box over its line height and the app's view box
      const lh = p.t.line_height || p.t.size * 1.2, vt = V ? viewTextOf(V, p.a) : null; (p as any).vt = vt;
      const fl = gf?.length ?? Math.max(1, Math.round(p.t.box[3] / lh)), al = vt?.lines ?? ga?.length ?? Math.max(1, Math.round(p.a.f[3] / lh));
      if ((vt?.lines || ga || lh > 0) && p.t.auto_resize !== 'TRUNCATE' && fl !== al)
        cands.push({ id: `lines:${p.t.node}`, kind: 'lines', severity: 'minor', ...(vt?.lines ? { src: 'app', note: scaleNote(V!) } : {}), figma: { node: p.t.node, text: p.t.text, box: r1(tb), lines: fl }, app: { box: r1(ab), lines: al } });
      // the app's own size and weight (exact; the measured width or height below only where there is none)
      if (vt) { cands.push(...exactText(p.t, vt, V!, r1(tb), r1(ab))); continue; }
      // text size and face (user, 2026-11-04: a bolder title of another width passed on its height), measured here and
      // judged after every screen (sizeCands): the glyph width when both sides read the same characters, else height
      if (ga && gf && ga.length === gf.length) { const med = (v: number[]) => v.sort((a, b) => a - b)[Math.floor(v.length / 2)];
        // compared on as many lines on both sides (a wrap is its own `lines` item); width when the characters are the same
        const flat = (t: string) => t.replace(/\s+/g, ' ').trim().toLowerCase(), same = flat(p.t.text) === flat(p.a.text);
        sizes.push({ node: p.t.node, text: p.t.text, app: p.a.text, font: p.t.font, tb: r1(tb), ab: r1(ab), by: same ? 'width' : 'height',
          r: Math.round((same ? ab[2] / tb[2] : med(ga.map(o => o.box[3])) / med(gf.map(o => o.box[3]))) * 1000) / 1000 }); }
    }
    // Figma box → window units through its half's fit (screenshot pixels in python)
    const toApp = (b: number[]): Box => { const y = half(b) === 'top' ? b[1] + fit.top.dy : Ha - (Hf - b[1] - b[3]) - fit.bottom.dy - b[3]; return [b[0] / k, y / k, b[2] / k, b[3] / k]; };
    // app text inside another feature's area is not this feature's either: an area is placed on the app by the offset
    // of the exactly matched text nearest to it (a shared screen's halves may have no anchors left), and an app text
    // equal to a Figma text drawn in such an area counts as in it wherever it is (CMS order)
    const near = (b: number[]) => base.filter(p => p.how === 'exact').sort((x, y) => Math.abs(x.t.box[1] - b[1]) - Math.abs(y.t.box[1] - b[1]))[0];
    const outApp = fig.out.map(o => { const p = near(o.box); return p ? [o.box[0] + p.a.f[0] - p.t.box[0], o.box[1] + p.a.f[1] - p.t.box[1], o.box[2], o.box[3]] : toFig(toApp(o.box)); });
    const inOut = (f: Box) => outApp.some(o => f[0] + f[2] / 2 >= o[0] && f[0] + f[2] / 2 <= o[0] + o[2] && f[1] + f[3] / 2 >= o[1] && f[1] + f[3] / 2 <= o[1] + o[3]);
    const figNorm = new Set(fig.texts.map(t => normLabel(t.text))), outNorm = new Set(fig.outTexts.map(normLabel));
    appT.forEach((a, i) => { if (!used.has(i) && a.text.length <= 40 && !figNorm.has(a.n) && !outNorm.has(a.n) && a.n.replace(/[#\W_]/g, '') && !(a.part === 1 && inOut(a.f)))
      cands.push({ id: `extra:${a.n}`, kind: 'extra', severity: 'info', app: { text: a.text, box: a.part > 1 ? undefined : r1(a.f) } }); });
    // controls without a label (icons: close, back, more): some app element must sit where Figma draws them
    for (const c of fig.controls) {
      const a = toApp(c.box), cx = a[0] + a[2] / 2, cy = a[1] + a[3] / 2;
      const hit = els.some(e => e.box[2] * e.box[3] < cap.win.w * cap.win.h * 0.5 && cx >= e.box[0] - 6 && cx <= e.box[0] + e.box[2] + 6 && cy >= e.box[1] - 6 && cy <= e.box[1] + e.box[3] + 6 && e.actionable);
      if (!hit) cands.push({ id: `control:${c.node}`, kind: 'control', severity: 'major', note: 'no tappable app element where Figma draws this control', figma: { node: c.node, name: c.name, box: r1(c.box) } });
    }
    // a shape is placed on the app by the offset of the nearest exactly matched text (within 150 pt), else its half's fit:
    // a tile's badge moves with the tile's label when the layout above it differs (the Launcher's banner)
    const anchorOf = (b: number[]) => base.filter(p => p.how === 'exact').map(p => ({ p, d: Math.hypot(p.t.box[0] - b[0], p.t.box[1] - b[1]) })).sort((a, c) => a.d - c.d)[0];
    const placed = (b: number[]): Box => { const a = anchorOf(b); return a && a.d <= 150 ? [(b[0] + a.p.a.f[0] - a.p.t.box[0]) / k, (b[1] + a.p.a.f[1] - a.p.t.box[1]) / k, b[2] / k, b[3] / k] : toApp(b); };
    // then onto the app element of about its size whose centre is within 12 pt (the badge's own image view), if any
    const snap = (w: Box): Box => { const c = [w[0] + w[2] / 2, w[1] + w[3] / 2], tol = 12 / k;
      const e = els.filter(e => !e.text && e.box[2] >= w[2] * 0.6 && e.box[2] <= w[2] * 1.6 && e.box[3] >= w[3] * 0.6 && e.box[3] <= w[3] * 1.6
        && Math.abs(e.box[0] + e.box[2] / 2 - c[0]) <= tol && Math.abs(e.box[1] + e.box[3] / 2 - c[1]) <= tol)
        .sort((a, b) => Math.hypot(a.box[0] + a.box[2] / 2 - c[0], a.box[1] + a.box[3] / 2 - c[1]) - Math.hypot(b.box[0] + b.box[2] / 2 - c[0], b.box[1] + b.box[3] / 2 - c[1]))[0];
      return e ? e.box : w; };
    // every colour compared is also sampled as drawn on both images (the Figma crop and the capture), so a candidate
    // lists the value set (Figma's fill and token, the app's own view data) beside the colour on screen (user, 2026-11-05)
    const fc = figmaCrop(scr, out), figImg = fc ? { png: fc.png, w: fc.box ? fc.board_w : scr.abs[2], dx: fc.box?.[0] ?? 0, dy: fc.box?.[1] ?? 0 } : null;
    for (const f of fig.fills) {
      const at = snap(placed(f.box)), vf = V ? viewFillOf(V, at, 40 / k) : null;
      // the app's own fill and corner radius where a view's background covers the shape's place
      if (vf) { cands.push(...exactFill(f, vf, V!));
        samples.push({ kind: 'fill', screen: scr.id, node: f.node, name: f.name, color: f.color, variable: f.variable, figBox: f.box, box: vf.box, set: vf.color, fig: figImg }); continue; }
      samples.push({ kind: 'fill', screen: scr.id, node: f.node, name: f.name, color: f.color, variable: f.variable, figBox: f.box, box: at, fig: figImg });
    }
    // a text's colour on its glyphs when read (a button's view box holds the button's fill too), else its view box
    for (const p of base.filter(p => p.how === 'exact' && p.t.color) as any[]) {
      // the app's own text colour when the view data has it
      const smp = { kind: 'text', screen: scr.id, node: p.t.node, name: p.t.text, color: p.t.color, variable: p.t.variable, figBox: p.t.box, box: p.ga ? union(p.ga).map((v: number) => v / k) : p.a.box, fig: figImg };
      if (p.vt?.color) { const d = deltaE(p.t.color, rgb(p.vt.color)); if (d > 6) cands.push({ id: `colour:${p.t.node}`, kind: 'colour', severity: 'minor', src: 'app', note: "text colour, the app's own value",
        figma: { node: p.t.node, name: p.t.text, color: p.t.color, box: r1(p.t.box) }, app: { color: p.vt.color, ...(p.vt.res ? { res: p.vt.res } : {}), ...(p.vt.alpha ? { alpha: p.vt.alpha } : {}) }, delta: { dE: Math.round(d) } });
        samples.push({ ...smp, set: p.vt.color }); continue; }
      samples.push(smp);
    }
    // padding, centring, borders and the gaps between buttons (user, 2026-11-06)
    const lay = layoutCands({ fig, base, els, V, k, Wf, cands, placed });
    cands.push(...lay.cands);
    for (const b of lay.borders) borders.push({ ...b, screen: scr.id, png: imageOf(cap.png), win: cap.win, k });
    // recheck: the bugs settled on an earlier build, still measured here or gone
    let recheck: any = null;
    if (oldFindings?.[scr.id]) {
      const now = new Set(cands.map(c => c.id));
      recheck = { run: basename(oldDir!), items: Object.entries<any>(oldFindings[scr.id]).filter(([, v]) => v.verdict === 'bug')
        .map(([id, v]) => ({ id, note: v.note ?? '', ...(v.note_zh ? { note_zh: v.note_zh } : {}), now: id.startsWith('visual:') ? 'check' : now.has(id) ? 'still' : 'fixed' })) };
    }
    results.push({ id: scr.id, name: scr.name, board: scr.board, board_name: scr.board_name, case: cap.case || scr.route?.case || '', captured_at: cap.t, png: cap.png,
      parts: parts.get(cap.screen)!.map(p => p.png), note: cap.note || '', build, win: cap.win, k: r3(k), fw: Wf, arrival, fit,
      ...(fig.out.length ? { out: fig.out.map(o => ({ name: o.name, box: r1(o.box) })) } : {}), ...(cap.unsettled ? { unsettled: true } : {}),
      ...(lay.unmatched ? { layout_unmatched: lay.unmatched } : {}),
      ...(hidden.length ? { hidden } : {}), ...(disagree.length ? { layers_disagree: disagree } : {}),
      ...(V ? { views: { texts: V.texts.length, fills: V.fills.length, font_scale: V.fontScale, matched: base.filter((p: any) => p.vt).length } } : {}), ...(sizes.length ? { sizes } : {}), ocr: { app: !!oA, figma: !!oF }, layers: layered,
      // every text of both sides as read, for the reviewers to quote (conformance.md §4: never read text off the image)
      texts: { figma: fig.texts.map(t => ({ node: t.node, text: t.text, box: r1(t.box) })), app: appT.filter(a => a.part === 1).map(a => ({ text: a.text, box: r1(a.f) })),
        ...(oA ? { app_ocr: oA.map(o => ({ text: o.text, box: r1(o.box) })) } : {}), ...(oF ? { figma_ocr: oF.map(o => ({ text: o.text, box: r1(o.box) })) } : {}) },
      counts: { figma_texts: fig.texts.length, app_texts: appT.length, matched: pairs.length, shapes: fig.fills.length, controls: fig.controls.length }, candidates: cands, recheck });
    sheets.push({ screen: scr.id, png: imageOf(cap.png), sheet: join(runDir, cap.png.replace(/\.png$/, '-sheet.png')), figma: figmaCrop(scr, out), win: cap.win, k, fw: Wf });
  }
  // one python call samples every shape (the most common colour inside it) and every text (the pixels farthest
  // from its background), and draws the sheets
  // each sample twice: on the capture (as the app draws it) and on the Figma crop (as Figma draws it)
  const py = python({ shares, borders: borders.map(b => ({ box: b.app, png: b.png, win: b.win, k: b.k })), samples: samples.flatMap(s => [{ kind: s.kind, box: s.box, png: imageOf(caps.get(s.screen).png), win: caps.get(s.screen).win },
    s.fig ? { kind: s.kind, box: [s.figBox[0] + s.fig.dx, s.figBox[1] + s.fig.dy, s.figBox[2], s.figBox[3]], png: s.fig.png, win: { w: s.fig.w } } : { kind: 'none' }]),
    sheets: sheets.map(s => ({ ...s, cands: results.find(r => r.id === s.screen).candidates })) });
  const drift: string[] = []; let setChecked = 0;
  for (const [i, s] of samples.entries()) {
    const got = py.colours?.[2 * i], figDrawn = py.colours?.[2 * i + 1], r = results.find(r => r.id === s.screen);
    // anti-aliased glyphs never reach the full colour, so texts get more room
    const room = s.kind === 'text' ? 18 : 12, c = r.candidates.find((c: Cand) => c.id === `colour:${s.node}`);
    const figma = { node: s.node, name: s.name, color: s.color, ...(s.variable ? { variable: s.variable } : {}), ...(figDrawn ? { drawn: figDrawn } : {}), box: r1(s.figBox) };
    if (s.set) {
      // the app's own value: the drawn colour is listed beside it, and a set value the screen does not show (alpha, a
      // layer over the view, or the wrong view matched) is named on the candidate and in the summary
      if (!got) continue; setChecked++;
      const off = deltaE(rgb(s.set), got) > room;
      if (off) drift.push(`${s.screen} ${JSON.stringify(s.name.replace(/\s+/g, ' ').slice(0, 30))} set ${s.set} drawn ${got}`);
      if (c) { c.figma = { ...figma, box: c.figma.box }; c.app = { ...c.app, drawn: got }; c.delta = { ...c.delta, dE_drawn: Math.round(deltaE(figDrawn ?? s.color, got)) };
        if (off) c.note = `${c.note}; drawn ${got} is not the value set (alpha, a layer over it, or another view)`; }
      continue;
    }
    if (!got) continue;
    const d = deltaE(s.color, got);
    if (d > room && !c)
      r.candidates.push({ id: `colour:${s.node}`, kind: 'colour', severity: 'minor', note: s.kind === 'text' ? 'text colour' : undefined, figma, app: { color: got }, delta: { dE: Math.round(d) } });
  }
  borderCands(borders, py.borders ?? [], results);
  if (setChecked) console.log(`app colours: ${setChecked} set values checked against the screen, ${drift.length} drawn differently${drift.length ? `:\n  ${drift.join('\n  ')}` : ''}`);
  const all = [...prev, ...results].sort((a, b) => plan.screens.findIndex((s: any) => s.id === a.id) - plan.screens.findIndex((s: any) => s.id === b.id));
  const fontWidth = sizeCands(all, results);
  // one screen per line (writeJsonRows): the file is rewritten on every check and committed with the run
  writeJsonRows(join(designDir, 'compare.json'), { built_at: new Date().toISOString(), spec_set: plan.spec_set, platform, build, recheck_of: old ? basename(oldDir!) : undefined,
    ...(fontWidth ? { font_width: fontWidth } : {}), screens: all });
  const n = (kind: string) => results.reduce((t, r) => t + r.candidates.filter((c: Cand) => c.kind === kind).length, 0);
  console.log(`${shown(join(designDir, 'compare.json'))}: ${results.length} screens measured (${all.length} in the file); ` +
    KINDS.map(k => `${n(k)} ${k}`).join(', '));
  const doubt = results.filter(r => !r.arrival.ok); if (doubt.length) console.log(`  arrival in doubt (another state?): ${doubt.map(r => `${r.id} ${r.name}`).join(', ')}`);
  if (old) { const it = results.flatMap(r => r.recheck?.items ?? []); console.log(`  recheck of ${basename(oldDir!)}: ${['fixed', 'still', 'check'].map(s => `${it.filter(i => i.now === s).length} ${s}`).join(', ')}`); }
  if (py.sheets?.length) console.log(`sheets: ${py.sheets.length} in ${shown(join(runDir, 'screenshots', 'design'))}/`);
  if (py.shared) console.log(`shared: ${py.shared} capture(s) in ${shown(join(designDir, 'captures'))}/ (commit them with the run)`);
}

type OcrLine = { text: string; n: string; box: Box };

// ---- the app's own view data (Android, REQ-086) -------------------------------------------------------------------
// A matched app text's view: the same words (normalised) where the page source puts it, the most overlap first.
function viewTextOf(V: Views, a: { text: string; box: Box }): ViewText | null {
  const n = normLabel(a.text);
  return V.texts.filter(v => normLabel(v.text) === n && overlap(v.box, a.box, 4))
    .map(v => ({ v, o: Math.max(0, Math.min(v.box[0] + v.box[2], a.box[0] + a.box[2]) - Math.max(v.box[0], a.box[0])) * Math.max(0, Math.min(v.box[1] + v.box[3], a.box[1] + a.box[3]) - Math.max(v.box[1], a.box[1])) }))
    .sort((x, y) => y.o - x.o)[0]?.v ?? null;
}
// A shape's view: a background over at least half of the place the shape is put on the app, else one of about its size
// (within a third either way) whose centre is within `near` pixels of it (a text view as wide as its button moved the
// place the shape was put by its anchor text), the closest first
function viewFillOf(V: Views, at: Box, near: number): ViewFill | null {
  const area = (b: number[]) => b[2] * b[3], inter = (a: number[], b: number[]) => Math.max(0, Math.min(a[0] + a[2], b[0] + b[2]) - Math.max(a[0], b[0])) * Math.max(0, Math.min(a[1] + a[3], b[1] + b[3]) - Math.max(a[1], b[1]));
  const over = V.fills.map(f => ({ f, iou: inter(f.box, at) / (area(f.box) + area(at) - inter(f.box, at)) })).filter(x => x.iou >= 0.5).sort((a, b) => b.iou - a.iou)[0]?.f;
  if (over) return over;
  const ok = (r: number) => r >= 0.75 && r <= 1.33, dist = (f: ViewFill) => Math.hypot(f.box[0] + f.box[2] / 2 - at[0] - at[2] / 2, f.box[1] + f.box[3] / 2 - at[1] - at[3] / 2);
  return V.fills.filter(f => ok(f.box[2] / at[2]) && ok(f.box[3] / at[3]) && dist(f) <= near).sort((a, b) => dist(a) - dist(b))[0] ?? null;
}
function rgb(argb: string) { return `#${argb.slice(3, 9)}`; }
// the phone's font scale changes every size and wrap: sizes are compared in sp (before it), lines say so
function scaleNote(V: Views) { return V.fontScale !== 1 ? `the phone's font scale is ${V.fontScale}: wrapping at 1.0 may differ` : undefined; }
// size in sp against Figma's points (6 % and 0.5 sp, twice that is major) and weight (100 apart), from the app's view
function exactText(t: any, vt: ViewText, V: Views, tb: number[], ab: number[]): Cand[] {
  const out: Cand[] = [], fam = `${vt.family ?? 'system font'} ${vt.weight ?? ''}`.trim();
  if (vt.sp && t.size) { const d = vt.sp / t.size - 1;
    if (Math.abs(d) > 0.06 && Math.abs(vt.sp - t.size) >= 0.5) out.push({ id: `size:${t.node}`, kind: 'size', severity: Math.abs(d) > 0.15 ? 'major' : 'minor', src: 'app',
      note: `the app sets ${vt.sp} sp (${fam}), Figma ${t.font ?? `${t.size} pt`}${V.fontScale !== 1 ? `; the phone's font scale ${V.fontScale} is not in this` : ''}`,
      figma: { node: t.node, text: t.text, box: tb }, app: { text: vt.text, box: ab }, delta: { sp: vt.sp, pt: t.size } } as Cand); }
  if (vt.weight && t.weight && Math.abs(vt.weight - t.weight) >= 100) out.push({ id: `weight:${t.node}`, kind: 'weight', severity: 'minor', src: 'app',
    note: `the app draws weight ${vt.weight} (${vt.family ?? 'system font'}), Figma ${t.weight} (${t.font ?? ''})`, figma: { node: t.node, text: t.text, box: tb }, app: { text: vt.text, box: ab }, delta: { app: vt.weight, figma: t.weight } } as Cand);
  return out;
}
// fill colour (ΔE over 6) and corner radius (over 2 dp; a fully round shape's radius only as round) from the app's view
function exactFill(f: any, vf: ViewFill, V: Views): Cand[] {
  const out: Cand[] = [], d = deltaE(f.color, rgb(vf.color)), box = r1(f.box), appBox = r1(vf.box); // view boxes are screen pixels, like every Android box here (not dp)
  if (d > 6) out.push({ id: `colour:${f.node}`, kind: 'colour', severity: 'minor', src: 'app', note: "fill, the app's own value", figma: { node: f.node, name: f.name, color: f.color, box }, app: { color: vf.color, ...(vf.res ? { res: vf.res } : {}), ...(vf.alpha ? { alpha: vf.alpha } : {}), box: appBox }, delta: { dE: Math.round(d) } } as Cand);
  if (typeof f.radius === 'number' && vf.radius !== null) { const r = vf.radius / V.density, round = (x: number, h: number) => x >= h / 2 - 0.5;
    if (Math.abs(r - f.radius) > 2 && !(round(r, vf.box[3] / V.density) && round(f.radius, f.box[3])))
      out.push({ id: `radius:${f.node}`, kind: 'radius', severity: 'minor', src: 'app', note: `corner radius ${Math.round(r * 10) / 10} dp in the app, ${f.radius} in Figma`, figma: { node: f.node, name: f.name, box }, app: { box: appBox }, delta: { app: Math.round(r * 10) / 10, figma: f.radius } } as Cand); }
  return out;
}

// a Figma text's lines from its render bounds: as many as its height holds at its line height (one line's glyphs are
// about 0.9 of the font size), stacked, each the glyph height of one line
function renderLines(t: any): OcrLine[] {
  const [x, y, w, h] = t.render as Box, lh = t.line_height || (t.size ?? 12) * 1.2, n = Math.max(1, 1 + Math.round((h - (t.size ?? 12) * 0.9) / lh)), gh = n > 1 ? h - (n - 1) * lh : h;
  return Array.from({ length: n }, (_, i) => ({ text: t.text, n: normLabel(t.text), box: [x, y + i * lh, w, gh] as Box }));
}

// Text size against the platform's own font (user, 2026-11-04): Android draws the Design's SF Pro in Roboto, about
// 12 % narrower at the same size, on every screen alike, so a text is judged against the run's typical ratio (the median
// over every screen in compare.json): 12 % off it in width (the middle 90 % of texts sit within ±8 %) (same characters on both sides) or 25 % in height is a
// `size` candidate (twice that is major). The platform's own ratio is returned and shown once, not per text.
function sizeCands(all: any[], results: any[]) {
  const w = all.flatMap(s => (s.sizes ?? []).filter((x: any) => x.by === 'width').map((x: any) => x.r)).sort((a: number, b: number) => a - b);
  const h = all.flatMap(s => (s.sizes ?? []).filter((x: any) => x.by === 'height').map((x: any) => x.r)).sort((a: number, b: number) => a - b);
  const mw = w.length >= 5 ? w[Math.floor(w.length / 2)] : 1, mh = h.length >= 5 ? h[Math.floor(h.length / 2)] : 1;
  for (const r of results) for (const x of r.sizes ?? []) {
    const base = x.by === 'width' ? mw : mh, lim = x.by === 'width' ? 0.12 : 0.25, d = x.r / base - 1;
    if (Math.abs(d) <= lim) continue;
    r.candidates.push({ id: `size:${x.node}`, kind: 'size', severity: Math.abs(d) > 2 * lim ? 'major' : 'minor',
      note: `text ${x.by === 'width' ? (d > 0 ? 'wider' : 'narrower') : (d > 0 ? 'taller' : 'shorter')} by ${Math.round(Math.abs(d) * 100)} % than this platform's texts draw Figma's (size, weight or font differs); Figma sets ${x.font ?? '?'}`,
      figma: { node: x.node, text: x.text, box: x.tb }, app: { text: x.app, box: x.ab }, delta: { [x.by]: x.r, platform: Math.round(base * 100) / 100 } });
  }
  return w.length >= 5 ? { width: Math.round(mw * 1000) / 1000, height: Math.round(mh * 1000) / 1000, texts: w.length } : null;
}
function union(g: { box: Box }[]): Box { const x = Math.min(...g.map(o => o.box[0])), y = Math.min(...g.map(o => o.box[1]));
  return [x, y, Math.max(...g.map(o => o.box[0] + o.box[2])) - x, Math.max(...g.map(o => o.box[1] + o.box[3])) - y]; }
// ---- layout (user, 2026-11-06) --------------------------------------------------------------------------------------
// What the check holds the app to beside sizes and colours: a text's padding inside its box (button, chip, card, tag)
// and its centring there, the box's border, and the gaps between buttons. Not where a text sits on the screen, and not
// its words. All in Figma points (app boxes through k). Glyph boxes when both sides were read (Figma's render bounds,
// the screenshot's OCR: ±2 pt), else the text boxes, with a point more of room.
//   padding  a side's inset from the text to its box edge more than 3 pt (4 pt on text boxes) off Figma's: the left
//            (right for a right-aligned text) and the top; the other two too where the box hugs its content (auto
//            layout) when the words are the same; top and bottom only for a single line on both sides. Down, the
//            inset is taken to the middle of the text's line: the platform font draws its letters higher or lower in
//            the same line. A box from edge to edge of the screen (a tab bar) is not measured across: there an inset
//            is only where the text sits on the screen
//   align    a text Figma centres in its box (centre alignment or equal insets) more than 3 pt (4) off centre
//   spacing  the gap (up to 32 pt in Figma) between two neighbouring buttons on a row or in a column more than 2 pt off
//            Figma's edge to edge, or 3 pt centre to centre when an app box is not the drawn size (a touch area);
//            buttons far apart are placed by the content between them (sample texts), not by a gap
// A padding, centring or gap over 24 pt off is another box or button taken for this one: no item, counted on the screen
// as `layout_unmatched`.
//   border   (borderCands) Figma's stroke against the border read on the screenshot at the middle of each side of the
//            box: one drawn and not the other, its colour ΔE > 18, or its width more than 1 pt off
type Lay = { fig: any; base: any[]; els: { text: string; box: Box; actionable: boolean }[]; V: Views | null; k: number; Wf: number; cands: Cand[]; placed: (b: number[]) => Box };
function layoutCands({ fig, base, els, V, k, Wf, cands, placed }: Lay) {
  const out: Cand[] = [], borders: any[] = []; let unmatched = 0;
  const toFig = (b: Box): Box => [b[0] * k, b[1] * k, b[2] * k, b[3] * k];
  const inside = (o: Box, i: Box, pad = 1) => i[0] >= o[0] - pad && i[1] >= o[1] - pad && i[0] + i[2] <= o[0] + o[2] + pad && i[1] + i[3] <= o[1] + o[3] + pad;
  const sameBox = (a: Box, b: Box, d = 1) => a.every((v, i) => Math.abs(v - b[i]) <= d);
  const fit = (a: Box, w: Box, lo: number, hi: number) => a[2] >= w[2] * lo && a[2] <= w[2] * hi && a[3] >= w[3] * lo && a[3] <= w[3] * hi;
  const sizeOff = (a: Box, w: Box) => Math.abs(Math.log(a[2] / w[2])) + Math.abs(Math.log(a[3] / w[3]));
  // the app's box around an app text: a view background (view data) or a page-source element of about the Figma box's
  // size (a quarter either way: a box of another size is another box) holding the text, the closest in size; the
  // text's own element only when its glyphs were read inside it
  const viewOf = new Map<Box, ViewFill>();
  const appBoxAround = (inner: Box, own: Box | null, want: Box): Box | null => {
    const opts = [...(V ? V.fills.map(f => { const b = toFig(f.box as Box); viewOf.set(b, f); return b; }) : []), ...els.map(e => toFig(e.box))]
      .filter(b => inside(b, inner) && fit(b, want, 0.75, 1.33) && !(own && sameBox(b, own)));
    return opts.sort((a, b) => sizeOff(a, want) - sizeOff(b, want) || (viewOf.has(b) ? 1 : 0) - (viewOf.has(a) ? 1 : 0))[0] ?? null;
  };
  const ins = (o: Box, i: Box) => [i[0] - o[0], i[1] - o[1], o[0] + o[2] - i[0] - i[2], o[1] + o[3] - i[1] - i[3]];
  const r1 = (v: number) => Math.round(v * 10) / 10, rb = (b: Box) => b.map(r1) as Box;
  const boxOf = new Map<string, any>(fig.boxes.map((b: any) => [b.node, b]));
  const appOf = new Map<string, Box>();
  for (const p of base) {
    const b = boxOf.get(p.t.container); if (!b || p.a.part !== 1) continue;
    const glyph = !!(p.ga && p.gf), tol = glyph ? 3 : 4, tb: Box = glyph ? p.tb : p.t.box, ab: Box = glyph ? p.ab : p.a.f;
    const ob = appOf.get(b.node) ?? appBoxAround(ab, glyph ? null : p.a.f, b.box); if (!ob) continue;
    appOf.set(b.node, ob);
    // down: to the middle of the line on both sides (a line's own height is Figma's on both)
    const mid = (x: Box, h: number): Box => [x[0], x[1] + x[3] / 2 - h / 2, x[2], h];
    const [fl, ft, fr, fb] = ins(b.box, tb), [al, at, ar, abm] = ins(ob, mid(ab, tb[3]));
    // one line on both sides (glyph lines read, else the box over the line height), and the same words
    const lh = p.t.line_height || p.t.size * 1.2 || 20, one = (g: any[] | null, h: number) => (g ? g.length : Math.max(1, Math.round(h / lh))) === 1;
    const single = one(p.gf, p.t.box[3]) && one(p.ga, p.a.f[3]) && !cands.some(c => c.id === `lines:${p.t.node}`), same = p.how === 'exact';
    const across = b.box[2] < Wf * 0.98;
    const cx = across && (p.t.align === 'CENTER' || Math.abs(fl - fr) <= 1.5), cy = single && Math.abs(ft - fb) <= 1.5;
    const ax = cx ? ((al - ar) - (fl - fr)) / 2 : 0, ay = cy ? ((at - abm) - (ft - fb)) / 2 : 0;
    const figma = { node: p.t.node, text: p.t.text, box: rb(tb), in: { node: b.node, name: b.name, box: rb(b.box) } }, app = { text: p.a.text, box: rb(ab), in: { box: rb(ob) } };
    if (Math.abs(ax) > tol || Math.abs(ay) > tol)
      if (Math.abs(ax) <= 24 && Math.abs(ay) <= 24) out.push({ id: `align:${p.t.node}`, kind: 'align', severity: 'minor', note: `not centred in its box as Figma draws it${glyph ? '' : ' (text boxes)'}`, figma, app,
        delta: { ...(Math.abs(ax) > tol ? { x: r1(ax) } : {}), ...(Math.abs(ay) > tol ? { y: r1(ay) } : {}) } });
    // insets compared: across, the aligned edge (both where the box hugs the text); down, the top (both when hugging)
    const sides: [string, number, number][] = [];
    if (across && !cx) { if (p.t.align === 'RIGHT') sides.push(['right', fr, ar]); else sides.push(['left', fl, al]);
      if (b.hugW && same && single) sides.push(p.t.align === 'RIGHT' ? ['left', fl, al] : ['right', fr, ar]); }
    if (single && !cy) { sides.push(['top', ft, at]); if (b.hugH && same) sides.push(['bottom', fb, abm]); }
    // over 24 pt off is another box taken for this one (a card around a question, a list row): counted, not an item
    if (sides.some(([, f, a]) => Math.abs(a - f) > 24) || Math.abs(ax) > 24 || Math.abs(ay) > 24) { unmatched++; continue; }
    const off = sides.filter(([, f, a]) => Math.abs(a - f) > tol);
    if (off.length) out.push({ id: `padding:${p.t.node}`, kind: 'padding', severity: 'minor', note: `${off.map(([s]) => s).join(', ')} padding differs${glyph ? '' : ' (text boxes)'}`,
      figma: { ...figma, padding: Object.fromEntries(off.map(([s, f]) => [s, r1(f)])) }, app: { ...app, padding: Object.fromEntries(off.map(([s, , a]) => [s, r1(a)])) },
      delta: Object.fromEntries(off.map(([s, f, a]) => [s, r1(a - f)])) });
  }
  // borders: every box placed on the app, read on the screenshot (window units for python)
  // the app's own stroke when the box is a view background of the view data (exact: its width in dp and colour)
  for (const [node, ob] of appOf) { const b = boxOf.get(node), vf = viewOf.get(ob);
    borders.push({ node, name: b.name, stroke: b.stroke, fill: b.fill, figBox: rb(b.box), appBox: rb(ob), app: ob.map(v => v / k),
      ...(vf && V ? { view: vf.stroke ? { width: Math.round(vf.stroke.px / V.density * 10) / 10, color: vf.stroke.color ? rgb(vf.stroke.color) : null, dashed: !!vf.stroke.dashed } : { width: 0 } } : {}) }); }
  // buttons on the app: one holding a Figma text takes the box around that text's app pair, an icon the tappable
  // element of about its size where it is drawn
  const btn = fig.buttons.flatMap((c: any) => {
    const p = base.find(p => p.a.part === 1 && inside(c.box, p.t.box));
    if (p) { const ob = appBoxAround(p.ga && p.gf ? p.ab : p.a.f, p.ga && p.gf ? null : p.a.f, c.box); return ob ? [{ ...c, app: ob }] : []; }
    const w = placed(c.box), cc = [w[0] + w[2] / 2, w[1] + w[3] / 2], tol = 12 / k;
    const e = els.filter(e => e.actionable && fit(e.box, w, 0.5, 2.2) && Math.abs(e.box[0] + e.box[2] / 2 - cc[0]) <= tol && Math.abs(e.box[1] + e.box[3] / 2 - cc[1]) <= tol)
      .sort((a, b) => Math.hypot(a.box[0] + a.box[2] / 2 - cc[0], a.box[1] + a.box[3] / 2 - cc[1]) - Math.hypot(b.box[0] + b.box[2] / 2 - cc[0], b.box[1] + b.box[3] / 2 - cc[1]))[0];
    return e ? [{ ...c, app: toFig(e.box) }] : [];
  });
  const lap = (a0: number, a1: number, b0: number, b1: number) => Math.min(a1, b1) - Math.max(a0, b0);
  for (const a of btn) for (const axis of [0, 1]) {
    const o = 1 - axis;   // the other axis: the two must overlap on it by half the smaller size
    const next = btn.filter((b: any) => b !== a && b.box[axis] >= a.box[axis] + a.box[axis + 2] - 1
      && lap(a.box[o], a.box[o] + a.box[o + 2], b.box[o], b.box[o] + b.box[o + 2]) >= Math.min(a.box[o + 2], b.box[o + 2]) / 2)
      .sort((x: any, y: any) => x.box[axis] - y.box[axis])[0];
    if (!next || inside(a.box, next.box) || inside(next.box, a.box)) continue;
    const drawn = [a, next].every((x: any) => fit(x.app, x.box, 0.85, 1.18));
    const gap = (x: any, y: any, s: 'box' | 'app') => drawn ? y[s][axis] - (x[s][axis] + x[s][axis + 2]) : (y[s][axis] + y[s][axis + 2] / 2) - (x[s][axis] + x[s][axis + 2] / 2);
    const gf = gap(a, next, 'box'), ga = gap(a, next, 'app'), edge = next.box[axis] - (a.box[axis] + a.box[axis + 2]);
    if (edge > 32) continue;
    if (Math.abs(ga - gf) <= (drawn ? 2 : 3)) continue;
    if (Math.abs(ga - gf) > 24) { unmatched++; continue; }
    const between = (x: Box, y: Box): Box => axis === 0 ? [x[0] + x[2], Math.min(x[1], y[1]), Math.max(1, y[0] - x[0] - x[2]), Math.max(x[1] + x[3], y[1] + y[3]) - Math.min(x[1], y[1])]
      : [Math.min(x[0], y[0]), x[1] + x[3], Math.max(x[0] + x[2], y[0] + y[2]) - Math.min(x[0], y[0]), Math.max(1, y[1] - x[1] - x[3])];
    out.push({ id: `spacing:${a.node}-${next.node}`, kind: 'spacing', severity: 'minor',
      note: `${axis ? 'vertical' : 'horizontal'} gap from 「${a.name}」 to 「${next.name}」${drawn ? '' : ' (centre to centre: an app box is not the drawn size)'}`,
      figma: { node: a.node, name: a.name, to: next.node, box: rb(between(a.box, next.box)), gap: r1(gf) }, app: { box: rb(between(a.app, next.app)), gap: r1(ga) }, delta: { gap: r1(ga - gf) } });
  }
  return { cands: out, borders, unmatched };
}
// borders against Figma's stroke: the app's own stroke (view data) where its box is a view background with one, else
// as read on the screenshot (python `borders`: width in window units and colour, none, or null when unclear: a shadow
// or gradient at the edge). A see-through Figma stroke is compared as drawn over the box's fill.
function borderCands(borders: any[], got: any[], results: any[]) {
  const hex = (c: number[]) => `#${c.map(v => Math.round(v).toString(16).padStart(2, '0')).join('')}`, parts = (c: string) => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  for (const [i, b] of borders.entries()) {
    const view = b.view?.width ? b.view : null, g = view ? { width: view.width / b.k, color: view.color } : got[i]; if (!g) continue;
    const r = results.find(r => r.id === b.screen); if (!r) continue;
    const wApp = g.width ? Math.round(g.width * b.k * 10) / 10 : 0, s0 = b.stroke;
    const under = b.fill ?? got[i]?.inner ?? null;
    const s = s0 && s0.color && s0.alpha < 0.99 && under ? { ...s0, color: hex(parts(s0.color).map((v, j) => v * s0.alpha + parts(under)[j] * (1 - s0.alpha))) } : s0;
    const figma = { node: b.node, name: b.name, box: b.figBox, border: s ? { color: s.color ?? s.paint, width: s.weight, ...(s0.alpha < 0.99 ? { set: s0.color, alpha: Math.round(s0.alpha * 100) / 100 } : {}), ...(s.variable ? { variable: s.variable } : {}) } : null };
    const app = { box: b.appBox, border: wApp ? { color: g.color, width: wApp, ...(view?.dashed ? { dashed: true } : {}) } : null };
    let note = '';
    if (s && !wApp) note = `Figma draws a ${s.weight} pt border, the app none`;
    else if (!s && wApp) note = `the app draws a ${wApp} pt border, Figma none`;
    else if (s && wApp && s.color && g.color && deltaE(s.color, g.color) > 18) note = `border colour ${g.color}, Figma ${s.color}`;
    else if (s && wApp && Math.abs(wApp - s.weight) > 1) note = `border ${wApp} pt wide, Figma ${s.weight} pt`;
    if (note) r.candidates.push({ id: `border:${b.node}`, kind: 'border', severity: 'minor', note, figma, app, ...(view ? { src: 'app' } : {}), ...(s && wApp ? { delta: { ...(s.color && g.color ? { dE: Math.round(deltaE(s.color, g.color)) } : {}), width: Math.round((wApp - s.weight) * 10) / 10 } } : {}) });
  }
}
function overlap(a: Box, b: Box, pad: number) { return a[0] < b[0] + b[2] + pad && b[0] < a[0] + a[2] + pad && a[1] < b[1] + b[3] + pad && b[1] < a[1] + a[3] + pad; }
// a keyboard on the capture: a dozen or more single keys read in the lower half
function keyboardShown(o: OcrLine[] | null, H: number) { return o ? o.filter(l => l.box[1] > H * 0.5 && /^[a-z0-9]$/i.test(l.text.trim())).length >= 12 : null; }

// OCR of both sides (scripts/ocr-images.swift, macOS Vision), cached in committed files so another computer needs
// neither macOS nor the local images: the app's next to its shared capture (design/captures/<id>.ocr.json), the Figma
// screen's in extracted/figma/design-ocr/<id>.json. Boxes are kept in Figma points. A Figma crop is read at 3× (its
// small text is a few pixels high at 1×). Keyed `app:<id>` / `fig:<id>`; a side not read is missing from the map.
// `dark` gets each image's appearance (most of it dark or light, else null), read on the same images.
function ocrPass(dark: Map<string, boolean | null>, jobs: { cap: any; scr: any; figma: any; figCache: string }[]): Map<string, OcrLine[]> {
  const got = new Map<string, OcrLine[]>(), todo: any[] = [];
  const load = (f: string, key: string, newer?: string) => { if (!existsSync(f) || (newer && existsSync(newer) && statSync(newer).mtimeMs > statSync(f).mtimeMs)) return false;
    const c = read(f); if (!('dark' in c)) return false;
    got.set(key, c.lines.map((l: any) => ({ ...l, n: normLabel(l.text) }))); dark.set(key, c.dark); return true; };
  for (const j of jobs) {
    const appCache = sharedOf(j.cap.png, '.ocr.json'), wf = j.scr.abs[2];
    if (!load(appCache, `app:${j.scr.id}`, join(runDir, j.cap.png))) todo.push({ key: `app:${j.scr.id}`, src: imageOf(j.cap.png), up: 1, wf, cache: appCache });
    if (!load(j.figCache, `fig:${j.scr.id}`) && j.figma) todo.push({ key: `fig:${j.scr.id}`, src: j.figma.png, box: j.figma.box, board_w: j.figma.board_w, up: 3, wf, cache: j.figCache });
  }
  if (!todo.length) return got;
  if (process.platform !== 'darwin') { console.error(`  OCR: ${todo.length} image(s) not read (macOS only): lines, size and hidden texts fall back to the view boxes`); return got; }
  const tmp = join(designDir, '.ocr'); mkdirSync(tmp, { recursive: true });
  // the images as read: a board screenshot cut to the screen, a Figma crop scaled up; the app's as they are
  const prep = spawnSync('python3', ['-c', String.raw`
import json, sys
from PIL import Image
jobs = json.load(sys.stdin); out = []
def dark(im):
    # the page's background shows in the upper half (below the status bar); a keyboard or sheet fills the lower one
    g = im.convert("L").crop((0, int(im.height * 0.06), im.width, int(im.height * 0.5))).resize((60, 70)); px = list(g.getdata()); d = sum(1 for v in px if v < 128) / len(px)
    return True if d > 0.6 else False if d < 0.4 else None
for i, j in enumerate(jobs):
    im = Image.open(j["src"]).convert("RGB")
    if j.get("box"):
        s = im.width / j["board_w"]; b = j["box"]; im = im.crop((int(b[0] * s), int(b[1] * s), int((b[0] + b[2]) * s), int((b[1] + b[3]) * s)))
    if j["up"] == 1 and not j.get("box"): out.append([j["src"], dark(im)]); continue
    p = sys.argv[1] + "/%d.png" % i; im.resize((im.width * j["up"], im.height * j["up"]), Image.LANCZOS).save(p); out.append([p, dark(im)])
print(json.dumps(out))`, tmp], { input: JSON.stringify(todo), encoding: 'utf8' });
  if (prep.status !== 0) { console.error(`  OCR: images not prepared (${prep.stderr.trim().split('\n').at(-1)})`); return got; }
  const prepared: [string, boolean | null][] = JSON.parse(prep.stdout), paths = prepared.map(x => x[0]); writeFileSync(join(tmp, 'job.json'), JSON.stringify(paths));
  const r = spawnSync('swift', [join(import.meta.dirname, 'ocr-images.swift'), join(tmp, 'job.json')], { encoding: 'utf8', maxBuffer: 64 << 20 });
  if (r.status !== 0) { console.error(`  OCR: not read (${(r.stderr || '').trim().split('\n').at(-1)})`); return got; }
  const res = JSON.parse(r.stdout); rmSync(tmp, { recursive: true, force: true });
  todo.forEach((j, i) => { const o = res[paths[i]]; if (!o) return;
    const s = j.wf / o.w;   // the image spans the screen's width in Figma points
    const lines = o.lines.filter((l: any) => l.conf >= 0.3).map((l: any) => ({ text: l.text, box: [l.x, l.y, l.w, l.h].map(v => r1n(v * s)) }));
    mkdirSync(join(j.cache, '..'), { recursive: true }); writeFileSync(j.cache, JSON.stringify({ read_at: new Date().toISOString(), dark: prepared[i][1], lines }) + '\n');
    got.set(j.key, lines.map((l: any) => ({ ...l, n: normLabel(l.text) }))); dark.set(j.key, prepared[i][1]); });
  console.log(`  OCR: ${todo.length} image(s) read`);
  return got;
}

// the state a screen is captured in (user, 2026-11-04): dark or light and the keyboard, as the frame draws them; the
// capture command refuses another (device.ts design)
function frameState(plan: any) {
  const out = join(featureDir(feature), 'specs', plan.spec_set, 'extracted', 'figma-source', 'design', 'out'), boards = new Map<string, any[]>();
  return (s: any) => { try {
    if (!boards.has(s.board)) { const f = join(out, `${s.board.replace(/[:;]/g, '-')}.json`); boards.set(s.board, existsSync(f) ? read(f).nodes : []); }
    const nodes = boards.get(s.board)!, crop = join(out, 'crops', s.board.replace(/[:;]/g, '-'), `${s.id.replace(/[:;]/g, '-')}.png`);
    const dark = darkFill(nodes.find((n: any) => n.id === s.id)) ?? (existsSync(crop) ? darkShot(readFileSync(crop)) : null);
    return `${dark === null ? 'dark or light: see the frame' : dark ? 'dark' : 'light'}, keyboard ${figmaScreen(nodes, s, new Set()).keyboard ? 'up' : 'down'}`;
  } catch { return 'state: see the frame'; } };
}

// the Figma side of a sheet: figma-source's crop when this machine has it, else the committed board screenshot
function figmaCrop(scr: any, out: string) {
  const crop = join(out, 'crops', scr.board.replace(/[:;]/g, '-'), `${scr.id.replace(/[:;]/g, '-')}.png`);
  if (existsSync(crop)) return { png: crop, box: null };
  const png = scr.board_png && join(featureDir(feature), scr.board_png);
  return png && existsSync(png) && scr.board_box ? { png, box: [scr.abs[0] - scr.board_box[0], scr.abs[1] - scr.board_box[1], scr.abs[2], scr.abs[3]], board_w: scr.board_box[2] } : null;
}

function python(input: unknown): any {
  const code = String.raw`
import json, sys
from statistics import median
from PIL import Image, ImageDraw, ImageFont
try: FONT = ImageFont.load_default(size=24)
except Exception: FONT = ImageFont.load_default()
job = json.load(sys.stdin); res = {"colours": [], "sheets": [], "shared": 0}; imgs = {}
import os
for sh in job.get("shares", []):
    im = Image.open(sh["src"]).convert("RGB"); w = 750; os.makedirs(os.path.dirname(sh["dst"]), exist_ok=True)
    im.resize((w, round(im.height * w / im.width)), Image.LANCZOS).save(sh["dst"], "WEBP", quality=78, method=6); res["shared"] += 1
def img(p):
    if p not in imgs: imgs[p] = Image.open(p).convert("RGB")
    return imgs[p]
def dist(a, b): return sum((a[i] - b[i]) ** 2 for i in range(3))
for s in job["samples"]:
    if s["kind"] == "none": res["colours"].append(None); continue
    try:
        im = img(s["png"]); r = im.width / s["win"]["w"]; x, y, w, h = [v * r for v in s["box"]]
        if s["kind"] == "text":
            # background: the box's edge pixels; text: the 3 % of pixels farthest from it (glyph cores, not their anti-aliased edges)
            box = im.crop((int(x), int(y), int(x + w), int(y + h))); px = list(box.getdata())
            if len(px) < 20: res["colours"].append(None); continue
            edge = [box.getpixel((i, j)) for i in range(box.width) for j in (0, box.height - 1)] + [box.getpixel((i, j)) for j in range(box.height) for i in (0, box.width - 1)]
            bg = tuple(median(c[i] for c in edge) for i in range(3)); far = sorted(px, key=lambda c: -dist(c, bg))[:max(5, len(px) * 3 // 100)]
            res["colours"].append("#%02x%02x%02x" % tuple(int(median(c[i] for c in far)) for i in range(3))); continue
        # a shape's fill: the most common colour of its inner part (user, 2026-11-04). An edge band read the rounded ends
        # of a badge as the background and an input's border glow as its fill; a label in the middle is outnumbered
        box = im.crop((int(x + w * 0.15), int(y + h * 0.2), int(x + w * 0.85), int(y + h * 0.8))); px = list(box.getdata())
        if not px: res["colours"].append(None); continue
        q = {}
        for c in px: q.setdefault(tuple(v // 24 for v in c), []).append(c)
        top = max(q.values(), key=len)
        res["colours"].append("#%02x%02x%02x" % tuple(int(median(c[i] for c in top)) for i in range(3)))
    except Exception: res["colours"].append(None)
# a box's border, read at the middle of each side from 4 px outside inward: past the outside colour, a run of pixels
# unlike the box's own colour (its most common inner one) that starts within 4 pt of the edge, is 0.8 pt (2 px at least)
# to 3 pt wide and
# ends in the box's colour (or the outside's, for a box with no fill of its own). Found on 3 of the 4 sides it is a
# border (a label inside meets only some of them); a clean step from outside into the box on 3 sides is no border;
# anything else is unclear (no item)
res["borders"] = []
def near(a, b): return dist(a, b) < 150
for b in job.get("borders", []):
    try:
        im = img(b["png"]); r = im.width / b["win"]["w"]; x, y, w, h = [v * r for v in b["box"]]; pt = r / b["k"]
        inner = im.crop((int(x + w * 0.15), int(y + h * 0.2), int(x + w * 0.85), int(y + h * 0.8))); q = {}
        for c in inner.getdata(): q.setdefault(tuple(v // 24 for v in c), []).append(c)
        top = max(q.values(), key=len); I = tuple(median(c[i] for c in top) for i in range(3))
        cx, cy = x + w / 2, y + h / 2; runs = []; cols = []
        for (px, py, dx, dy, depth) in ((x, cy, 1, 0, w), (x + w, cy, -1, 0, w), (cx, y, 0, 1, h), (cx, y + h, 0, -1, h)):
            line = []
            for t in range(-4, int(depth * 0.3)):
                X, Y = int(px + dx * t), int(py + dy * t)
                if 0 <= X < im.width and 0 <= Y < im.height: line.append(im.getpixel((X, Y)))
            if len(line) < 6: continue
            O = line[0]; i = 0; hollow = near(O, I)
            while i < len(line) and near(line[i], O) and (hollow or not near(line[i], I)): i += 1
            j = i
            while j < len(line) and not near(line[j], I) and (hollow or not near(line[j], O)): j += 1
            # a mix of the outside and the box's colour (anti-aliasing, a compressed copy's ringing) is no border
            own = [c for c in line[i:j] if dist(c, O) ** 0.5 + dist(c, I) ** 0.5 > dist(O, I) ** 0.5 * 1.15 + 8]
            if j < len(line) and near(line[j], I) and max(2, 0.8 * pt) <= len(own) <= 3 * pt + 1 and i <= 4 + 4 * pt: runs.append(len(own)); cols += own
            elif len(own) <= 1 and j < len(line) and near(line[j], I): runs.append(0)      # clean: outside straight into the box
            else: runs.append(None)                                                   # unclear: a shadow, a gradient, a label
        hit = [v for v in runs if v]; clean = [v for v in runs if v == 0]; inner = "#%02x%02x%02x" % tuple(int(v) for v in I)
        if len(hit) >= 3: res["borders"].append({"width": median(hit) / r, "color": "#%02x%02x%02x" % tuple(int(median(c[i] for c in cols)) for i in range(3)), "inner": inner})
        elif len(clean) >= 3: res["borders"].append({"width": 0, "inner": inner})
        else: res["borders"].append(None)
    except Exception: res["borders"].append(None)
COL = {"major": (220, 50, 50), "minor": (230, 150, 20), "info": (90, 120, 200), "cosmetic": (150, 150, 150)}
for sh in job["sheets"]:
    W = 750; app = img(sh["png"]); ar = W / app.width; appS = app.resize((W, int(app.height * ar)))
    fig = None
    if sh["figma"]:
        f = Image.open(sh["figma"]["png"]).convert("RGB")
        if sh["figma"]["box"]:
            s = f.width / sh["figma"]["board_w"]; bx = sh["figma"]["box"]; f = f.crop((int(bx[0] * s), int(bx[1] * s), int((bx[0] + bx[2]) * s), int((bx[1] + bx[3]) * s)))
        fig = f.resize((W, int(f.height * W / f.width)))
    H = max(appS.height, fig.height if fig else 0); out = Image.new("RGB", (W * 2 + 20, H), "white")
    if fig: out.paste(fig, (0, 0))
    out.paste(appS, (W + 20, 0)); d = ImageDraw.Draw(out)
    fs = (fig.width / sh["fw"]) if fig else 2; asc = W / (sh["win"]["w"] * sh["k"])
    for i, c in enumerate([c for c in sh["cands"] if c["kind"] not in ("sample", "extra")], 1):
        col = COL.get(c["severity"], (0, 0, 0))
        for side, sc, ox in (("figma", fs, 0), ("app", asc, W + 20)):
            bx = (c.get(side) or {}).get("box")
            if not bx or (side == "figma" and not fig): continue
            x, y, w, h = [v * sc for v in bx]; d.rectangle((ox + x, y, ox + x + w, y + h), outline=col, width=3)
            # the number beside the box, not above it: a tag above covered the text over it (「2026」 read as 「26」, 2026-11-04)
            tw = 16 + 14 * len(str(i)); tx = ox + x - tw - 2 if x >= tw + 2 else ox + x + w + 2; ty = y
            d.rectangle((tx, ty, tx + tw, ty + 28), fill=col); d.text((tx + 7, ty + 1), str(i), fill="white", font=FONT)
    p = sh["sheet"]; os.makedirs(os.path.dirname(p), exist_ok=True); out.save(p); res["sheets"].append(p)
print(json.dumps(res))`;
  const r = spawnSync('python3', ['-I', '-c', code], { input: JSON.stringify(input), encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  if (r.status !== 0) { console.error(`python3 (Pillow) failed: ${r.stderr.trim().split('\n').slice(-3).join(' ')}`); return {}; }
  return JSON.parse(r.stdout);
}

function status() {
  const plan = planFresh(feature, platform);
  // a board missing from the source read comes before everything else (REQ-080): its screens are not in the plan at all
  const gaps = gapLine(plan.source_gaps ?? { unread: [], incomplete: [] });
  if (gaps) {
    console.log(`Design check: source read not complete: ${gaps}.\n  next: read ${[...plan.source_gaps.unread, ...plan.source_gaps.incomplete].map((b: any) => b.id).join(', ')} ` +
      `(figma skill, references/source.md: calls plan design <ids>, calls chunks design, run the calls, save, merge, crop), or exclude the board on the Plan view with a reason`);
    return;
  }
  const listed = plan.source_gaps?.listed ?? [];
  if (listed.length) console.log(`  note: ${listed.length} board(s) on the Design page are neither read nor in the casebook (${listed.slice(0, 6).map((b: any) => b.name).join(', ')}${listed.length > 6 ? ', …' : ''}): read them if the spec covers them, else exclude them on the Plan view`);
  else if (plan.source_gaps && !plan.source_gaps.page_listed) console.log('  note: the Design page was never listed (figma-source.ts … calls list design), so boards neither read nor in the casebook are not known');
  const rv = plan.scope_review, fresh = rv ? plan.screens.filter((s: any) => !rv.ids?.includes(s.id)).length : 0;
  const scopeLine = rv ? `scope reviewed ${rv.at}${fresh ? `, ${fresh} screen(s) new since` : ''}` : 'scope not reviewed';
  if (!runDir || !existsSync(designDir)) {
    console.log(`Design check: ${summary(plan)}; ${scopeLine}; no run has captures yet.\n  next: ${!rv || fresh
      ? 'the user reviews the scope on the Design tab\'s Plan view and presses Save (design.ts … scope)'
      : 'capture during a run: `case ID` on the device script watches each row\'s screens and captures them (`design.ts … screens <TC-…>` lists them)'}`); return; }
  const capFile = join(designDir, 'captures.jsonl'), cmpFile = join(designDir, 'compare.json'), fFile = join(designDir, 'findings.json');
  const caps = existsSync(capFile) ? readFileSync(capFile, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l)) : [];
  const captured = new Set(caps.map(c => c.screen));
  const cmp = existsSync(cmpFile) ? read(cmpFile) : null, measured = new Set((cmp?.screens ?? []).map((s: any) => s.id));
  const found = existsSync(fFile) ? read(fFile) : null;
  const routed = plan.screens.filter((s: any) => s.status === 'routed'), left = routed.filter((s: any) => !captured.has(s.id));
  const at = (n: string) => existsSync(join(designDir, `${n}.json`)) ? statSync(join(designDir, `${n}.json`)).mtimeMs : 0;
  const cmpOf = new Map<string, any>((cmp?.screens ?? []).map((s: any) => [s.id, s]));
  const verdicts = Object.entries<any>(found?.screens ?? {}).flatMap(([sid, v]) => Object.entries<any>(v).filter(([id]) => !cmpOf.has(sid) || live(cmpOf.get(sid), id)).map(([, x]) => x));
  const open = verdicts.filter(v => v.verdict === 'question' && !v.decided).length, bugs = verdicts.filter(v => v.verdict === 'bug');
  const run = basename(runDir);
  const auto = new Set(caps.filter(c => c.auto).map(c => c.screen)).size;
  console.log(`Design check of ${run}: ${captured.size} of ${routed.length} routed screens captured${auto ? ` (${auto} automatically during the run)` : ''} (${plan.counts.no_route} no route), ${measured.size} measured, ` +
    (found ? `settled: ${bugs.length} bugs (${bugs.filter(v => v.ebug).length} ticked for eBugs), ${open} open questions` : 'not settled') + `; ${scopeLine}`);
  const unmeasured = [...captured].filter(s => !measured.has(s) || caps.filter(c => c.screen === s).at(-1).t > (cmp?.built_at ?? ''));
  const rows = new Map<string, number>(); for (const s of left) { const k = s.route.case || 'Design paths'; rows.set(k, (rows.get(k) ?? 0) + 1); }
  if (left.length) console.log(`  not captured: ${left.length} screens on ${rows.size} rows, e.g. ${[...rows].slice(0, 8).map(([c, n]) => `${c} (${n})`).join(', ')}`);
  const reviewed = cmp && at('builder') > Date.parse(cmp.built_at) && at('reviewer') > Date.parse(cmp.built_at);
  const next = unmeasured.length ? `check ${unmeasured.length} new capture(s): design.ts … check ${run}`
    : measured.size && !reviewed ? 'the two review passes over the sheets (conformance.md step 4), then settle'
    : reviewed && at('findings') < Math.max(at('builder'), at('reviewer')) ? `design.ts … settle ${run}`
    : open ? 'the user answers the questions on the Design tab and presses Save decisions (design.ts … decide)'
    : bugs.some(v => v.ebug) && !existsSync(join(designDir, 'ebug-findings.md')) ? `design.ts … ebugs ${run}, then the eBug drafts (spec-casebook references/ebugs.md)`
    : left.length ? `capture the remaining screens during the next rounds (\`case ID\` watches them), or a design pass over \`design.ts … screens --left ${run}\`` : 'done';
  console.log(`  next: ${next}`);
}

function settle() {
  const cmp = read(join(designDir, 'compare.json'));
  const pass = (n: string) => { const p = join(designDir, `${n}.json`); if (!existsSync(p)) { console.error(`${p} missing: run the ${n} pass first (conformance.md step 4).`); process.exit(1); } return read(p); };
  const b = pass('builder'), r = pass('reviewer');
  const before = existsSync(join(designDir, 'findings.json')) ? read(join(designDir, 'findings.json')).screens : {};
  const hash = (o: unknown) => createHash('sha256').update(JSON.stringify(o)).digest('hex').slice(0, 12);
  const screens: Record<string, Record<string, any>> = {};
  let agree = 0, ask = 0, kept = 0;
  for (const s of cmp.screens) {
    const bs = b.screens?.[s.id] ?? {}, rs = r.screens?.[s.id] ?? {};
    // every candidate is answered: one neither pass judged is a question too (info kinds only when a pass named them)
    // a pass's verdict on a candidate the check no longer makes (an area left out since) is dropped
    const ids = new Set([...s.candidates.filter((c: Cand) => c.severity !== 'info').map((c: Cand) => c.id), ...[...Object.keys(bs), ...Object.keys(rs)].filter(id => live(s, id))]);
    for (const id of ids) {
      const x = bs[id], y = rs[id], prev = before[s.id]?.[id];
      if (prev?.decided) { (screens[s.id] ??= {})[id] = prev; kept++; continue; }
      const same = x && y && x.verdict === y.verdict;
      const where = { kind: x?.kind ?? y?.kind, figma: x?.figma ?? y?.figma, app: x?.app ?? y?.app };
      // each pass's note in English (`note`) and Traditional Chinese (`note_zh`): the Design tab shows the page's language
      const notes = { note: x?.note ?? '', note_zh: x?.note_zh, reviewer: y?.note ?? '', reviewer_zh: y?.note_zh };
      (screens[s.id] ??= {})[id] = same ? { ...where, verdict: x.verdict, severity: x.severity ?? y.severity, ...notes }
        : { ...where, verdict: 'question', severity: x?.severity ?? y?.severity, ...notes, split: `builder ${x?.verdict ?? 'skipped'} · reviewer ${y?.verdict ?? 'skipped'}` };
      same ? agree++ : ask++;
    }
  }
  writeJsonRows(join(designDir, 'findings.json'), { settled_at: new Date().toISOString(), builder: hash(b), reviewer: hash(r), screens });
  console.log(`${shown(join(designDir, 'findings.json'))}: ${agree} agreed, ${ask} questions for the user${kept ? `, ${kept} user decisions kept` : ''}`);
}

// The Plan view's scope block: `DESIGN SCOPE <feature> <ios|android|both>`, then `exclude <screen or board
// id>: <reason>`, `include <id>` and `reviewed`. The Design screens are the same on both platforms, so `both` applies
// it to every platform of the feature that has a design plan.
function scope() {
  const lines = readFileSync(target && existsSync(target) ? target : 0, 'utf8').split('\n').map(l => l.trim()).filter(Boolean);
  const head = lines.findIndex(l => l.startsWith('DESIGN SCOPE'));
  if (head < 0) { console.error('No "DESIGN SCOPE" block in the input.'); process.exit(1); }
  const [, , f, p] = lines[head].split(/\s+/);
  if (f !== feature) { console.error(`The block is for ${f}, not ${feature}.`); process.exit(1); }
  const plats = p === 'both' ? ['ios', 'android'].filter(x => existsSync(planPath(feature, x))) : [p];
  const day = new Date().toISOString().slice(0, 10);
  for (const pl of plats) {
    const old = planFresh(feature, pl, true), skip = new Set<string>(old.skip ?? []), reasons: Record<string, string> = { ...(old.skip_reasons ?? {}) };
    const included = new Set<string>(old.scope_included ?? []);
    for (const id of skip) reasons[id] ??= old.skip_reason ?? 'skipped';
    const known = new Set(old.screens.flatMap((s: any) => [s.id, s.board]));
    let reviewed = false, n = 0;
    for (const l of lines.slice(head + 1)) {
      const m = l.match(/^(exclude|include) (\S+?)(?:: (.+))?$/);
      if (l === 'reviewed') { reviewed = true; continue; }
      if (!m || (m[1] === 'exclude' && !m[3])) { console.error(`  skipped: ${l}${m ? ' (an exclusion needs a reason)' : ''}`); continue; }
      if (!known.has(m[2])) { console.error(`  skipped: ${m[2]} is not a screen or board of the plan`); continue; }
      if (m[1] === 'exclude') { skip.add(m[2]); reasons[m[2]] = m[3]; included.delete(m[2]); } else { skip.delete(m[2]); delete reasons[m[2]]; included.add(m[2]); }
      n++;
    }
    const plan = buildPlan(feature, pl, { skip: [...skip], skipReason: old.skip_reason ?? undefined, reasons,
      review: reviewed ? { at: day, by: 'user', ids: old.screens.map((s: any) => s.id) } : old.scope_review, included: [...included] });
    console.log(`${pl}: ${n} change(s)${reviewed ? ', scope marked reviewed' : ''}; ${summary(plan)}`);
  }
}

// The Design tab's decisions block: `DESIGN DECISIONS <feature> <platform>`, then `<run> <screen> <id>: bug|ok|n/a|eBug|no eBug`,
// a verdict optionally followed by `: <why>` (the user's reason, user 2026-11-04: why a difference is not a problem), kept as `why`.
function decide() {
  const text = readFileSync(target && existsSync(target) ? target : 0, 'utf8');
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const head = lines.findIndex(l => l.startsWith('DESIGN DECISIONS'));
  if (head < 0) { console.error('No "DESIGN DECISIONS" block in the input.'); process.exit(1); }
  const [, , f, p] = lines[head].split(/\s+/);
  if (f !== feature || p !== platform) { console.error(`The block is for ${f} ${p}, not ${feature} ${platform}.`); process.exit(1); }
  const day = new Date().toISOString().slice(0, 10), files = new Map<string, any>();
  let n = 0;
  for (const l of lines.slice(head + 1)) {
    const m = l.match(/^(\S+) (\S+) (\S+): (bug|ok|n\/a|eBug|no eBug)(?:: (.+))?$/);
    if (!m) { console.error(`  skipped: ${l}`); continue; }
    const [, run, scr, id, v, why] = m, fp = join(runOf(run), 'design', 'findings.json');
    if (!files.has(fp)) files.set(fp, existsSync(fp) ? read(fp) : { settled_at: null, screens: {} });
    const cmp = existsSync(join(runOf(run), 'design', 'compare.json')) ? read(join(runOf(run), 'design', 'compare.json')) : { screens: [] };
    const cand = cmp.screens.find((s: any) => s.id === scr)?.candidates.find((c: Cand) => c.id === id);
    const item = ((files.get(fp).screens[scr] ??= {})[id] ??= { kind: cand?.kind, figma: cand?.figma, app: cand?.app, severity: cand?.severity, verdict: 'unreviewed' });
    if (v === 'eBug') item.ebug = true; else if (v === 'no eBug') delete item.ebug; else { item.verdict = v; if (v !== 'bug') delete item.ebug; }
    if (why?.trim()) item.why = why.trim(); else if (v !== 'eBug' && v !== 'no eBug') delete item.why;
    item.decided = `user ${day}`; n++;
  }
  for (const [fp, data] of files) writeJsonRows(fp, data);
  console.log(`${n} decision(s) written to ${[...files.keys()].map(shown).join(', ')}`);
}

// The settled bugs to file, one block each, in the shape spec-casebook's eBug drafting reads.
function ebugs() {
  const plan = planFresh(feature, platform, true);
  const cmp = read(join(designDir, 'compare.json')), found = read(join(designDir, 'findings.json')).screens;
  const all = process.argv.includes('--all'), key = plan.file?.fileKey ?? plan.file?.key ?? '';
  const out: string[] = [`# Design check bugs — ${basename(runDir)}`, '', `Build ${cmp.build || '(not recorded)'} · ${feature} · ${platform}. Drafted through spec-casebook references/ebugs.md: [UI], owner RD (Doc for copy), never [UX].`, ''];
  let n = 0;
  for (const s of cmp.screens) for (const [id, v] of Object.entries<any>(found[s.id] ?? {})) {
    if (v.verdict !== 'bug' || (!all && !v.ebug) || !live(s, id)) continue;
    const c = s.candidates.find((x: Cand) => x.id === id) ?? { kind: v.kind ?? id.split(':')[0], figma: v.figma, app: v.app };
    const route = plan.screens.find((x: any) => x.id === s.id)?.route, row = route?.case && existsSync(join(table, 'cases.csv')) ? readTable(join(table, 'cases.csv')).find(r => r.ID === route.case) : undefined;
    const what = (o: any) => o?.text ? `「${o.text}」` : o?.color ? o.color : o?.name ?? '';
    n++;
    out.push(`## ${n}. ${s.name} — ${c.kind}${v.severity ? ` (${v.severity})` : ''}`, '',
      `- Screen: ${s.name} (${s.board_name}), Figma ${s.id}${key ? ` — https://www.figma.com/design/${key}?node-id=${encodeURIComponent(s.id.replace(':', '-'))}` : ''}`,
      route?.how === 'figma' && !s.case ? `- Reached by the Design's arrows: ${route.action}` : `- Reached by: ${s.case || route?.case || '?'}${row ? ` — Precondition: ${row.Precondition || '–'}; Action: ${row.Action}` : ''}`,
      `- Figma: ${what(c.figma)}`, `- App: ${what(c.app)}${c.delta ? ` (${Object.entries(c.delta).map(([a, b]) => `${a} ${b}`).join(', ')})` : ''}`,
      `- Verdict: ${v.note ?? ''}${v.reviewer && v.reviewer !== v.note ? ` / ${v.reviewer}` : ''}${v.decided ? ` (${v.decided}${v.why ? `: ${v.why}` : ''})` : ''}`,
      `- Image: ${s.png.replace(/\.png$/, '-sheet.png')} (Figma left, app right)`, `- Finding id: ${s.id} ${id}`, '');
  }
  writeFileSync(join(designDir, 'ebug-findings.md'), out.join('\n'));
  console.log(`${shown(join(designDir, 'ebug-findings.md'))}: ${n} bug(s)${all ? '' : ' ticked for eBugs'}`);
}

// a verdict still about something the check measures: its candidate, or a reviewer's visual item
function live(s: any, id: string) { return id.startsWith('visual:') || s.candidates.some((c: Cand) => c.id === id); }

function ratio(a: string, b: string) {
  if (!a || !b) return 0;
  const m = a.length, n = b.length; let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) { const cur = [i]; for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); prev = cur; }
  return 1 - prev[n] / Math.max(m, n);
}
function deltaE(a: string, b: string) {
  const lab = (h: string) => { const [r, g, bl] = [1, 3, 5].map(i => { const c = parseInt(h.slice(i, i + 2), 16) / 255; return c > 0.04045 ? ((c + 0.055) / 1.055) ** 2.4 : c / 12.92; });
    const f = (t: number) => t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116;
    const [x, y, z] = [(r * 0.4124 + g * 0.3576 + bl * 0.1805) / 0.95047, r * 0.2126 + g * 0.7152 + bl * 0.0722, (r * 0.0193 + g * 0.1192 + bl * 0.9505) / 1.08883].map(f);
    return [116 * y - 16, 500 * (x - y), 200 * (y - z)]; };
  const p = lab(a), q = lab(b); return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
}
function r1n(n: number) { return Math.round(n * 10) / 10; }
function r1(b: number[]) { return b.map(r1n); }
function r3(n: number) { return Math.round(n * 1000) / 1000; }
