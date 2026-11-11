// Automatic design captures during a casebook run (user, 2026-11-04): when the feature has a design plan, the device
// scripts watch every page source they already read (taps, els, texts, waitfor…) for the Design screens still to
// capture, and save a match as a design capture on their own: no extra call, navigation or tokens for the run.
//   `case ID`  arms the watch: the row's screens (design/plan.json › by_case) and every other routed screen this run
//              has not captured yet, each with its short Figma texts, in <run dir>/.design-watch.json (local). It also
//              names the screens the previous row passed without (capture those by hand if they did show).
//   a source   whose texts match a watched screen is saved like `device.ts design <id>` (screenshots/design/<id>.png
//              and .xml, a captures.jsonl line with `auto` and the match), and the screen leaves the watch.
// A match is the arrival rule of design.ts check made stricter: of the screen's short Figma texts (≤ 60 characters,
// normalised), the share found in the app texts, exactly or one containing the other (6+ characters). The row's own
// screens need 3+ texts and 60 %; any other screen 4+ texts and 80 % and a clear lead (0.15) over the next best, so a
// state drawn beside it (loading, failure) is not taken for it. Screens with fewer texts are listed at `case` for a
// capture by hand. The check's `state` candidate still catches a wrong state, and the reviewers settle it.
// Two guards from the first design pass (Android main flow, 2026-11-04): a match is not saved over a screen the run
// captured since `case` (a hand capture was overwritten by the next tap's source), and a frame whose background is dark
// or light (the board draws each screen in both) is only taken from a screenshot of the same appearance (light
// screens were saved for dark frames). A screenshot or frame whose appearance cannot be told is not filtered.
import { appendFileSync, existsSync, mkdirSync, readFileSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { inflateSync } from 'node:zlib';
import { normLabel } from './coverage.ts';
import { appElements, figmaScreen } from './design-match.ts';
import { featureOfRunDir } from './feature-config.ts';
import { featureDir } from './library.ts';

type Watch = { case: string; row: string[]; screens: Record<string, { name: string; texts: string[]; dark?: boolean | null; kb?: boolean }> };
const read = (p: string): any => JSON.parse(readFileSync(p, 'utf8'));
const watchFile = (runDir: string) => join(runDir, '.design-watch.json');
const planFile = (runDir: string) => join(dirname(dirname(resolve(runDir))), 'design', 'plan.json');
const fileName = (screen: string, part = 1) => screen.replace(/[:;]/g, '-') + (part > 1 ? `.p${part}` : '');

/** Whole-screen captures already in the run folder. */
export function capturedScreens(runDir: string) {
  const f = join(runDir, 'design', 'captures.jsonl');
  return new Set(existsSync(f) ? readFileSync(f, 'utf8').split('\n').filter(Boolean).flatMap(l => { try { const c = JSON.parse(l); return c.part > 1 ? [] : [c.screen]; } catch { return []; } }) : []);
}

/** Save the screen on the phone as a design capture of `screen` (both `design` commands and the watch). */
export function saveCapture(runDir: string, screen: string, o: { part?: number; note?: string; png: Buffer; xml: string; win: { width: number; height: number }; extra?: object;
  views?: { full: unknown; compact: unknown } | null }) {
  const part = o.part ?? 1, dir = join(runDir, 'screenshots', 'design'), name = fileName(screen, part);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${name}.png`), o.png);
  writeFileSync(join(dir, `${name}.xml`), o.xml);
  // the app's own view data (Android, debuggable build: lib/android-views.ts): the full dump stays local, the compact
  // texts and fills the check reads go with the capture (design.ts shares them like the page source)
  if (o.views) { writeFileSync(join(dir, `${name}.viewdump.json`), JSON.stringify(o.views.full)); writeFileSync(join(dir, `${name}.views.json`), JSON.stringify(o.views.compact)); }
  const kase = existsSync(join(runDir, '.case')) ? readFileSync(join(runDir, '.case'), 'utf8').trim() : '';
  mkdirSync(join(runDir, 'design'), { recursive: true });
  appendFileSync(join(runDir, 'design', 'captures.jsonl'), JSON.stringify({ t: new Date().toISOString(), screen, ...(part > 1 ? { part } : {}), case: kase, note: o.note ?? '',
    png: `screenshots/design/${name}.png`, xml: `screenshots/design/${name}.xml`, ...(o.views ? { views: `screenshots/design/${name}.views.json` } : {}), win: { w: o.win.width, h: o.win.height }, ...o.extra }) + '\n');
  return { kase, png: `screenshots/design/${name}.png` };
}

const luma = (r: number, g: number, b: number) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

/** A frame's appearance from its own background fill: true dark, false light, null none or unclear. */
export function darkFill(node: any): boolean | null {
  const f = (node?.fills ?? []).filter((x: any) => x.type === 'SOLID' && /^#[0-9a-f]{6}(ff)?$/i.test(x.color ?? '')).at(-1);
  if (!f) return null;
  const l = luma(...([1, 3, 5].map(i => parseInt(f.color.slice(i, i + 2), 16)) as [number, number, number]));
  return l < 0.35 ? true : l > 0.65 ? false : null;
}

// Plain 8-bit RGB / RGBA PNGs (what WDA, UiAutomator2 and screencap return): every 4th pixel of every 4th row whose
// y the filter keeps, as luma 0–1; null when the file is not one.
function sampleLuma(png: Buffer, keep: (y: number, h: number) => boolean): number[] | null {
  try {
    if (png.length < 33 || png.readUInt32BE(0) !== 0x89504e47) return null;
    const w = png.readUInt32BE(16), h = png.readUInt32BE(20), depth = png[24], type = png[25];
    if (depth !== 8 || (type !== 2 && type !== 6) || png[28] !== 0) return null;
    const idat: Buffer[] = [];
    for (let o = 8; o + 8 <= png.length;) {
      const len = png.readUInt32BE(o), kind = png.toString('latin1', o + 4, o + 8);
      if (kind === 'IDAT') idat.push(png.subarray(o + 8, o + 8 + len));
      if (kind === 'IEND') break;
      o += 12 + len;
    }
    const raw = inflateSync(Buffer.concat(idat)), bpp = type === 6 ? 4 : 3, stride = w * bpp, out: number[] = [];
    let prev = new Uint8Array(stride), cur = new Uint8Array(stride);
    for (let y = 0; y < h; y++) {
      const at = y * (stride + 1), filter = raw[at];
      for (let i = 0; i < stride; i++) {
        const x = raw[at + 1 + i], a = i >= bpp ? cur[i - bpp] : 0, b = prev[i], c = i >= bpp ? prev[i - bpp] : 0;
        let p = 0;
        if (filter === 1) p = a; else if (filter === 2) p = b; else if (filter === 3) p = (a + b) >> 1;
        else if (filter === 4) { const q = a + b - c, pa = Math.abs(q - a), pb = Math.abs(q - b), pc = Math.abs(q - c); p = pa <= pb && pa <= pc ? a : pb <= pc ? b : c; }
        cur[i] = (x + p) & 255;
      }
      if (y % 4 === 0 && keep(y, h)) for (let i = 0; i + 2 < stride; i += 4 * bpp) out.push(luma(cur[i], cur[i + 1], cur[i + 2]));
      [prev, cur] = [cur, prev];
    }
    return out;
  } catch { return null; }
}

/** A screenshot's appearance (its upper half): true when most of it is dark, false when most is light, null when unreadable or mixed. */
export function darkShot(png: Buffer): boolean | null {
  // the page's background shows in the upper half below the status bar; a keyboard or sheet fills the lower one
  const l = sampleLuma(png, (y, h) => y > h * 0.06 && y < h * 0.5);
  if (!l?.length) return null;
  const dark = l.filter(v => v < 0.5).length / l.length;
  return dark > 0.6 ? true : dark < 0.4 ? false : null;
}

/** Why a screenshot shows nothing, or null when it shows something: empty, not a PNG, or one flat colour below the
 *  status bar (a FLAG_SECURE window comes back black; ported from rdqe-spec-contract-agent caf66e6, 2026-11-11). */
export function blankShot(png: Buffer): string | null {
  if (!png.length) return 'the screenshot is empty';
  if (png.length < 8 || png.readUInt32BE(0) !== 0x89504e47) return 'the screenshot is not a PNG';
  const l = sampleLuma(png, (y, h) => y > h * 0.06);
  if (!l) return null;   // a PNG the sampler does not read (16-bit, palette): let it through
  let lo = 1, hi = 0; for (const v of l) { if (v < lo) lo = v; if (v > hi) hi = v; }
  if (l.length && hi - lo < 0.01) return `the screenshot is one flat colour (luma ${l[0].toFixed(2)}): a secure (FLAG_SECURE) screen, or nothing drawn yet`;
  return null;
}

// Short Figma texts and the background appearance of every routed screen, cached in the run folder until plan.json
// changes.
type Frame = { texts: string[]; dark: boolean | null; kb: boolean };
// a frame's appearance from its fill, else from its crop's pixels (a gradient or image background has no single fill:
// the template chat's dark frame passed a light capture, 2026-11-04); `kb`: the frame draws the keyboard up
function screenTexts(runDir: string, plan: any, out: string): Record<string, Frame> {
  const cache = join(runDir, '.design-texts.json'), stamp = statSync(planFile(runDir)).mtimeMs;
  if (existsSync(cache)) { try { const c = read(cache); if (c.plan === stamp && c.v === 3) return c.screens; } catch {} }
  const boards = new Map<string, any[]>(), screens: Record<string, Frame> = {};
  for (const s of plan.screens.filter((x: any) => x.status === 'routed')) {
    if (!boards.has(s.board)) { const f = join(out, `${s.board.replace(/[:;]/g, '-')}.json`); boards.set(s.board, existsSync(f) ? read(f).nodes : []); }
    const nodes = boards.get(s.board)!;
    const fs = figmaScreen(nodes, s, new Set()), texts = fs.texts.filter((t: any) => t.text.length <= 60).map((t: any) => normLabel(t.text)).filter((t: string) => t && t !== '#');
    const crop = join(out, 'crops', s.board.replace(/[:;]/g, '-'), `${s.id.replace(/[:;]/g, '-')}.png`);
    screens[s.id] = { texts: [...new Set<string>(texts)], dark: darkFill(nodes.find((n: any) => n.id === s.id)) ?? (existsSync(crop) ? darkShot(readFileSync(crop)) : null), kb: fs.keyboard };
  }
  writeFileSync(cache, JSON.stringify({ v: 3, plan: stamp, screens }));
  return screens;
}

/** A hand capture (`device.ts design <id>`) against its frame's state: the reasons it does not match (dark or light,
 * keyboard up or down), empty when it does or cannot be told. The capture is refused unless `--anyway "<why>"`. */
export function stateMismatch(runDir: string, screen: string, png: Buffer, kb: boolean | null): string[] {
  try {
    const feature = featureOfRunDir(runDir); if (!feature || !existsSync(planFile(runDir))) return [];
    const plan = read(planFile(runDir)), out = join(featureDir(feature), 'specs', plan.spec_set, 'extracted', 'figma-source', 'design', 'out');
    if (!existsSync(join(out, 'screens.json'))) return [];
    const f = screenTexts(runDir, plan, out)[screen]; if (!f) return [];
    const why: string[] = [], dark = darkShot(png);
    if (f.dark !== null && dark !== null && f.dark !== dark) why.push(`Figma draws it ${f.dark ? 'dark' : 'light'}, the phone shows it ${dark ? 'dark' : 'light'} (set the phone or app to ${f.dark ? 'dark' : 'light'} mode; if it is already, the app ignores it: capture with --anyway "app ignores ${f.dark ? 'dark' : 'light'} mode")`);
    if (kb !== null && kb !== f.kb) why.push(f.kb ? 'Figma draws the keyboard up, it is down (focus the field)' : 'the keyboard is up, Figma draws it down (hide it)');
    return why;
  } catch { return []; }
}

/** `case ID` / `case -`: report what the previous row left, then watch the new row's screens (and the rest). Lines to print. */
export function armWatch(runDir: string, caseId: string | null): string[] {
  const lines: string[] = [];
  try {
    const old: Watch | null = existsSync(watchFile(runDir)) ? read(watchFile(runDir)) : null;
    if (old) {
      const left = old.row.filter(id => old.screens[id]);
      if (left.length) lines.push(`design: ${old.case} passed without ${left.map(id => `${id} ${old.screens[id].name}`).join(', ')} (capture by hand if it showed them; else a later round does)`);
      unlinkSync(watchFile(runDir));
    }
    const feature = featureOfRunDir(runDir);
    // only a table row arms it: a bug recheck's own labels (`case bp`) are not casebook rows, and its folder must not
    // turn into a design pass (user, 2026-11-05: the DRA262610P0347 recheck showed on the Design tab)
    if (!caseId || !/^TC-\d+$/.test(caseId) || !feature || !existsSync(planFile(runDir))) return lines;
    const plan = read(planFile(runDir));
    const out = join(featureDir(feature), 'specs', plan.spec_set, 'extracted', 'figma-source', 'design', 'out');
    if (!existsSync(join(out, 'screens.json'))) {
      lines.push(`design: no Figma data on this computer, so no automatic captures (\`node scripts/design.ts ${feature} <platform> status\` builds it); by hand: design.ts … screens ${caseId}`);
      return lines;
    }
    const done = capturedScreens(runDir), texts = screenTexts(runDir, plan, out);
    const byId = new Map<string, any>(plan.screens.map((s: any) => [s.id, s]));
    const screens: Watch['screens'] = {};
    for (const [id, t] of Object.entries(texts)) if (!done.has(id) && byId.has(id)) screens[id] = { name: byId.get(id).name, texts: t.texts, dark: t.dark, kb: t.kb };
    const row = (plan.by_case?.[caseId] ?? []).filter((id: string) => screens[id]);
    writeFileSync(watchFile(runDir), JSON.stringify({ case: caseId, row, screens } satisfies Watch));
    if (row.length) {
      const hand = row.filter((id: string) => screens[id].texts.length < 3);
      lines.push(`design: watching ${row.length} screen(s) of ${caseId}, captured automatically when shown${hand.length ? `; by hand (too few texts to match): ${hand.map((id: string) => `${id} ${screens[id].name}`).join(', ')}` : ''}`);
    }
  } catch (e: any) { lines.push(`design: watch not armed (${String(e?.message ?? e).slice(0, 120)})`); }
  return lines;
}

// One moment for both files (user, 2026-11-04): the screenshot and the page source were read one after the other, and
// on a screen still moving (a chat scrolling in its new messages) the app's boxes landed on other things than the
// screenshot shows (AI Mini Drama_template, Android). A capture now reads the source again after the screenshot and
// keeps the pair only when the texts and their boxes did not move in between.
const sig = (xml: string) => appElements(xml).filter(e => e.text).map(e => `${e.text}@${e.box.join(',')}`).join('\n');

/** A screenshot and the page source of the same moment: up to 5 tries 0.8 s apart; `unsettled` when it never held still. */
export async function settledCapture(source: () => Promise<string>, shot: () => Promise<Buffer>) {
  let a = await source(), png = await shot();
  for (let i = 0; i < 5; i++) {
    const b = await source();
    if (sig(a) === sig(b)) return { png, xml: b, unsettled: false };
    await new Promise(r => setTimeout(r, 800)); a = await source(); png = await shot();
  }
  return { png, xml: a, unsettled: true };
}

/** A page source the device script just read: capture a watched screen it shows. Returns a line to print, if any.
 * `again` reads the source once more (without watching it): a screen that moved while its screenshot was taken is not
 * saved, and a later source of it, once still, is. */
export async function watchSource(runDir: string, xml: string, png: () => Promise<Buffer>, win: () => Promise<{ width: number; height: number }>, again?: () => Promise<string>,
  keyboard?: () => Promise<boolean | null>, views?: () => Promise<{ full: unknown; compact: unknown } | null>): Promise<string | undefined> {
  if (!xml || !existsSync(watchFile(runDir))) return;
  try {
    const w: Watch = read(watchFile(runDir)), w0 = Object.fromEntries(Object.entries(w.screens).map(([id, x]) => [id, x.name]));
    const drop = (ids: string[]) => { for (const id of ids) delete w.screens[id]; w.row = w.row.filter(id => !ids.includes(id)); };
    // screens captured since `case` (by hand: `design <id>`) leave the watch and are never saved over
    const done = capturedScreens(runDir), gone = Object.keys(w.screens).filter(id => done.has(id));
    if (gone.length) { drop(gone); writeFileSync(watchFile(runDir), JSON.stringify(w)); }
    const app = [...new Set(appElements(xml).flatMap(e => e.text ? e.text.split('\n').concat(e.text) : []).map(normLabel).filter(Boolean))];
    const has = new Set(app), long = app.filter(a => a.length >= 6);
    const score = (id: string) => {
      const t = w.screens[id].texts, hits = t.filter(x => has.has(x) || (x.length >= 6 && long.some(a => a.includes(x) || x.includes(a)))).length;
      return { id, hits, of: t.length, r: t.length ? hits / t.length : 0 };
    };
    const all = Object.keys(w.screens).map(score).sort((a, b) => b.r - a.r || b.hits - a.hits);
    const rowSet = new Set(w.row), key = (id: string) => [...w.screens[id].texts].sort().join('\n');
    // frames drawn with the same texts (copies of one screen) cannot be told apart: they share the capture; any other
    // tie at the top is left alone
    const twins = (x: { id: string }, pool: { id: string }[]) => pool.filter(y => key(y.id) === key(x.id)).map(y => y.id);
    const ownBest = all.find(x => rowSet.has(x.id) && x.of >= 3 && x.r >= 0.6);
    const ownTie = ownBest && all.filter(x => rowSet.has(x.id) && x.r === ownBest.r && x.hits === ownBest.hits);
    const own = ownBest && ownTie!.every(x => key(x.id) === key(ownBest.id)) ? ownBest : undefined;
    const top = all[0], rest = top ? all.filter(x => key(x.id) !== key(top.id)) : [];
    const other = !own && !ownBest && top && !rowSet.has(top.id) && top.of >= 4 && top.r >= 0.8 && (!rest[0] || top.r - rest[0].r >= 0.15) ? top : undefined;
    const hit = own ?? other;
    if (!hit) return;
    let ids = twins(hit, all.filter(x => own ? rowSet.has(x.id) : !rowSet.has(x.id)));
    // only the frames drawn in the appearance the phone shows (a board drawing each screen dark and light)
    const shot = await png(), dark = darkShot(shot);
    if (dark !== null) ids = ids.filter(id => w.screens[id].dark == null || w.screens[id].dark === dark);
    // and with the keyboard as the frame draws it (up or down)
    const kb = keyboard ? await keyboard().catch(() => null) : null;
    if (kb !== null) ids = ids.filter(id => (w.screens[id].kb ?? false) === kb);
    if (!ids.length) return;
    if (again && sig(await again()) !== sig(xml)) return;
    const size = await win();
    let kase = '', rel = '';
    const vd = views ? await views().catch(() => null) : null;
    for (const id of ids) ({ kase, png: rel } = saveCapture(runDir, id, { png: shot, xml, win: size, views: vd, extra: { auto: true, match: `${hit.hits}/${hit.of}`, ...(kb !== null ? { keyboard: kb } : {}), ...(ids.length > 1 ? { same_texts: ids.filter(x => x !== id) } : {}) } }));
    drop(ids);
    writeFileSync(watchFile(runDir), JSON.stringify(w));
    return `design: captured ${ids.map(id => `${id} ${w0[id]}`).join(', ')} automatically (${hit.hits}/${hit.of} texts${ids.length > 1 ? ', frames with the same texts' : ''}${kase && !rowSet.has(hit.id) ? `, not a screen of ${kase}` : ''}) → ${rel}`;
  } catch (e: any) { return `design: automatic capture failed (${String(e?.message ?? e).slice(0, 120)})`; }
}
