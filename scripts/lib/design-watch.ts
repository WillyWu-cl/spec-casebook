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
import { appendFileSync, existsSync, mkdirSync, readFileSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { normLabel } from './coverage.ts';
import { appElements, figmaScreen } from './design-match.ts';
import { featureOfRunDir } from './feature-config.ts';
import { featureDir } from './library.ts';

type Watch = { case: string; row: string[]; screens: Record<string, { name: string; texts: string[] }> };
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
export function saveCapture(runDir: string, screen: string, o: { part?: number; note?: string; png: Buffer; xml: string; win: { width: number; height: number }; extra?: object }) {
  const part = o.part ?? 1, dir = join(runDir, 'screenshots', 'design'), name = fileName(screen, part);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${name}.png`), o.png);
  writeFileSync(join(dir, `${name}.xml`), o.xml);
  const kase = existsSync(join(runDir, '.case')) ? readFileSync(join(runDir, '.case'), 'utf8').trim() : '';
  mkdirSync(join(runDir, 'design'), { recursive: true });
  appendFileSync(join(runDir, 'design', 'captures.jsonl'), JSON.stringify({ t: new Date().toISOString(), screen, ...(part > 1 ? { part } : {}), case: kase, note: o.note ?? '',
    png: `screenshots/design/${name}.png`, xml: `screenshots/design/${name}.xml`, win: { w: o.win.width, h: o.win.height }, ...o.extra }) + '\n');
  return { kase, png: `screenshots/design/${name}.png` };
}

// Short Figma texts of every routed screen, cached in the run folder until plan.json changes.
function screenTexts(runDir: string, plan: any, out: string): Record<string, string[]> {
  const cache = join(runDir, '.design-texts.json'), stamp = statSync(planFile(runDir)).mtimeMs;
  if (existsSync(cache)) { try { const c = read(cache); if (c.plan === stamp) return c.screens; } catch {} }
  const boards = new Map<string, any[]>(), screens: Record<string, string[]> = {};
  for (const s of plan.screens.filter((x: any) => x.status === 'routed')) {
    if (!boards.has(s.board)) { const f = join(out, `${s.board.replace(/[:;]/g, '-')}.json`); boards.set(s.board, existsSync(f) ? read(f).nodes : []); }
    const texts = figmaScreen(boards.get(s.board)!, s, new Set()).texts.filter((t: any) => t.text.length <= 60).map((t: any) => normLabel(t.text)).filter((t: string) => t && t !== '#');
    screens[s.id] = [...new Set<string>(texts)];
  }
  writeFileSync(cache, JSON.stringify({ plan: stamp, screens }));
  return screens;
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
    if (!caseId || !feature || !existsSync(planFile(runDir))) return lines;
    const plan = read(planFile(runDir));
    const out = join(featureDir(feature), 'specs', plan.spec_set, 'extracted', 'figma-source', 'design', 'out');
    if (!existsSync(join(out, 'screens.json'))) {
      lines.push(`design: no Figma data on this computer, so no automatic captures (\`node scripts/design.ts ${feature} <platform> status\` builds it); by hand: design.ts … screens ${caseId}`);
      return lines;
    }
    const done = capturedScreens(runDir), texts = screenTexts(runDir, plan, out);
    const byId = new Map<string, any>(plan.screens.map((s: any) => [s.id, s]));
    const screens: Watch['screens'] = {};
    for (const [id, t] of Object.entries(texts)) if (!done.has(id) && byId.has(id)) screens[id] = { name: byId.get(id).name, texts: t };
    const row = (plan.by_case?.[caseId] ?? []).filter((id: string) => screens[id]);
    writeFileSync(watchFile(runDir), JSON.stringify({ case: caseId, row, screens } satisfies Watch));
    if (row.length) {
      const hand = row.filter((id: string) => screens[id].texts.length < 3);
      lines.push(`design: watching ${row.length} screen(s) of ${caseId}, captured automatically when shown${hand.length ? `; by hand (too few texts to match): ${hand.map((id: string) => `${id} ${screens[id].name}`).join(', ')}` : ''}`);
    }
  } catch (e: any) { lines.push(`design: watch not armed (${String(e?.message ?? e).slice(0, 120)})`); }
  return lines;
}

/** A page source the device script just read: capture a watched screen it shows. Returns a line to print, if any. */
export async function watchSource(runDir: string, xml: string, png: () => Promise<Buffer>, win: () => Promise<{ width: number; height: number }>): Promise<string | undefined> {
  if (!xml || !existsSync(watchFile(runDir))) return;
  try {
    const w: Watch = read(watchFile(runDir)), w0 = Object.fromEntries(Object.entries(w.screens).map(([id, x]) => [id, x.name]));
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
    const ids = twins(hit, all.filter(x => own ? rowSet.has(x.id) : !rowSet.has(x.id))), shot = await png(), size = await win();
    let kase = '', rel = '';
    for (const id of ids) ({ kase, png: rel } = saveCapture(runDir, id, { png: shot, xml, win: size, extra: { auto: true, match: `${hit.hits}/${hit.of}`, ...(ids.length > 1 ? { same_texts: ids.filter(x => x !== id) } : {}) } }));
    for (const id of ids) delete w.screens[id];
    w.row = w.row.filter(id => !ids.includes(id));
    writeFileSync(watchFile(runDir), JSON.stringify(w));
    return `design: captured ${ids.map(id => `${id} ${w0[id]}`).join(', ')} automatically (${hit.hits}/${hit.of} texts${ids.length > 1 ? ', frames with the same texts' : ''}${kase && !rowSet.has(hit.id) ? `, not a screen of ${kase}` : ''}) → ${rel}`;
  } catch (e: any) { return `design: automatic capture failed (${String(e?.message ?? e).slice(0, 120)})`; }
}
