// The app's own view data on Android (user, 2026-11-04, REQ-085/086): the view dumper (scripts/android-viewdump.ts,
// .claude/skills/figma/assets/viewdump/) attached to the running, debuggable app. Shared by the CLI, the design
// captures (device-android.ts `design` and the automatic watch) and the design check (design.ts):
//   viewdumpProblem  why a dump cannot be taken now (no build of the current sources, app not debuggable), or null
//   dumpViews        attach, wait for the JSON, pull it; throws with the reason (the app's own error, or logcat)
//   compactViews     what the check reads, small enough to commit beside a capture: every shown text (its words,
//                    on-screen box in pixels, colour, size in px and sp, weight, style, family, lines) and every
//                    solid fill (box, colour, corner radius), with the display's density and font scale. A view that
//                    is GONE or INVISIBLE, or whose alpha (with its ancestors') is under 0.01, is left out with its
//                    subtree.
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

export const VIEWDUMP_HOME = join(homedir(), '.casebook', 'android');
export const VIEWDUMP_OUT = join(VIEWDUMP_HOME, 'viewdump');
export const VIEWDUMP_SRC = join(import.meta.dirname, '..', '..', '.claude', 'skills', 'figma', 'assets', 'viewdump');
const sha256 = (b: Buffer) => createHash('sha256').update(b).digest('hex');
const SOURCES = ['agent.c', 'ViewDumper.java'];
export const sourceDigest = () => createHash('sha256').update(SOURCES.map(f => `${f}:${sha256(Buffer.from(readFileSync(join(VIEWDUMP_SRC, f), 'utf8').replace(/\r\n/g, '\n')))}\n`).join('')).digest('hex');

type Adb = { serial: string; pkg: string };
const adbRun = (a: Adb, args: string[]) => { const r = spawnSync('adb', ['-s', a.serial, ...args], { encoding: 'buffer', maxBuffer: 1 << 30 });
  return { status: r.status ?? 1, out: (r.stdout ?? Buffer.alloc(0)).toString().trim(), buf: r.stdout ?? Buffer.alloc(0), err: (r.stderr ?? Buffer.alloc(0)).toString().trim() }; };
const sh = (a: Adb, c: string) => adbRun(a, ['shell', c]);
const runAs = (a: Adb, c: string) => sh(a, `run-as ${a.pkg} ${c}`);

/** The build this computer made of the current sources, else the reason it cannot be used. */
export function viewdumpBuild(): { build: any } | { problem: string } {
  const m = join(VIEWDUMP_OUT, 'build.json');
  if (!existsSync(m)) return { problem: 'the view dumper is not built on this computer (node scripts/android-viewdump.ts build)' };
  const b = JSON.parse(readFileSync(m, 'utf8'));
  if (b.source !== sourceDigest()) return { problem: 'the view dumper was built from older sources (node scripts/android-viewdump.ts build)' };
  for (const f of ['libviewdump.so', 'viewdumper.dex']) if (!existsSync(join(VIEWDUMP_OUT, f)) || sha256(readFileSync(join(VIEWDUMP_OUT, f))) !== b.outputs[f]) return { problem: `${f} is not the file the build wrote (build again)` };
  return { build: b };
}

/** Why the app's views cannot be dumped on this phone now, or null when they can. */
export function viewdumpProblem(a: Adb) {
  const b = viewdumpBuild(); if ('problem' in b) return b.problem;
  const d = sh(a, `dumpsys package ${a.pkg}`).out;
  if (!d.includes(`Package [${a.pkg}]`)) return `${a.pkg} is not installed`;
  if (!/pkgFlags=\[[^\]]*DEBUGGABLE/.test(d) || runAs(a, 'id').status !== 0) return `${a.pkg} is not debuggable (node scripts/android-viewdump.ts prepare)`;
  return null;
}

/** The app's view dump now (the dumper runs on its main thread: a second or two). */
export async function dumpViews(a: Adb, timeoutMs = 30_000): Promise<any> {
  const b = viewdumpBuild(); if ('problem' in b) throw new Error(b.problem);
  const dir = 'code_cache/viewdump', abs = `/data/data/${a.pkg}/${dir}`, tmp = '/data/local/tmp/casebook-viewdump';
  sh(a, `mkdir -p ${tmp}`); runAs(a, `mkdir -p ${dir}`);
  const names = { so: `libviewdump-${b.build.outputs['libviewdump.so'].slice(0, 12)}.so`, dex: `viewdumper-${b.build.outputs['viewdumper.dex'].slice(0, 12)}.dex` };
  const present = new Set(runAs(a, `ls ${dir}`).out.split(/\s+/));
  for (const [k, local] of [['so', 'libviewdump.so'], ['dex', 'viewdumper.dex']] as const) {
    const n = names[k]; if (present.has(n)) continue;   // a library the app has loaded is never overwritten: the app crashes
    if (adbRun(a, ['push', join(VIEWDUMP_OUT, local), `${tmp}/${n}`]).status !== 0) throw new Error(`could not push ${local}`);
    sh(a, `chmod 644 ${tmp}/${n}`);
    if (runAs(a, `cp ${tmp}/${n} ${dir}/${n}`).status !== 0) throw new Error(`could not copy ${n} into the app's folder`);
    sh(a, `rm -f ${tmp}/${n}`);
  }
  const name = `dump-${Date.now()}.json`, t0 = Date.now();
  const said = sh(a, `cmd activity attach-agent ${a.pkg} ${abs}/${names.so}=${abs}/${names.dex},${abs}/${name},`).out;
  while (Date.now() - t0 < timeoutMs) {
    await new Promise(r => setTimeout(r, 250));
    const ls = new Set(runAs(a, `ls ${dir}`).out.split(/\s+/));
    if (ls.has(`${name}.err`)) { const e = runAs(a, `cat ${dir}/${name}.err`).out; runAs(a, `rm -f ${dir}/${name}.err`); throw new Error(`the dumper failed inside the app: ${e.split('\n').slice(0, 6).join(' / ')}`); }
    if (!ls.has(name)) continue;
    const raw = adbRun(a, ['exec-out', 'run-as', a.pkg, 'cat', `${dir}/${name}`]).buf;
    let doc: any; try { doc = JSON.parse(raw.toString('utf8')); } catch { continue; }   // still being written
    runAs(a, `rm -f ${dir}/${name}`);
    doc.capture = { at: new Date().toISOString(), serial: a.serial, package: a.pkg, ms: Date.now() - t0, bytes: raw.length };
    return doc;
  }
  throw new Error(`no dump within ${timeoutMs / 1000} s${said ? ` (attach-agent: ${said})` : ''}: ${adbRun(a, ['logcat', '-d', '-t', '20', '-s', 'ViewDumpAgent', 'ViewDumper', 'AndroidRuntime']).out.split('\n').slice(-4).join(' / ')}`);
}

export type ViewText = { text: string; box: [number, number, number, number]; color: string | null; px: number | null; sp: number | null; weight: number | null; style: string | null; family: string | null; lines: number | null; id: string | null; window: number;
  /** the layout's colour resource (`@color/textPrimary`) and the views' combined alpha when below 1 */ res?: string; alpha?: number };
export type ViewFill = { box: [number, number, number, number]; color: string; radius: number | null; id: string | null; window: number; res?: string; alpha?: number;
  stroke?: { px: number; color: string | null; dashed?: boolean } };
export type Views = { density: number; scaledDensity: number; fontScale: number; texts: ViewText[]; fills: ViewFill[]; windows: { title: string; type: number }[] };

const argb = (c: unknown) => typeof c === 'string' && /^#[0-9a-f]{8}$/i.test(c) ? c : null;
// a drawable's solid fill as drawn: a ColorDrawable or a GradientDrawable with one colour, else the first layer that has one
// and its border: a GradientDrawable's stroke (width in px, colour, dashed or not; user, 2026-11-06)
function fillOf(d: any): { color: string; radius: number | null; stroke?: ViewFill['stroke'] } | null {
  if (!d || typeof d !== 'object') return null;
  if (/ColorDrawable$|GradientDrawable$|MaterialShapeDrawable$/.test(d.class ?? '') && argb(d.color) && !/^#00/i.test(d.color)) {
    const r = typeof d.cornerRadius === 'string' ? parseFloat(d.cornerRadius) : Array.isArray(d.cornerRadii) ? Math.max(...d.cornerRadii) : null;
    const w = parseFloat(String(d.stroke?.width ?? '')), sc = argb(d.stroke?.color);
    return { color: d.color, radius: Number.isFinite(r as number) ? r : null,
      ...(w > 0 && !/^#00/i.test(sc ?? '') ? { stroke: { px: w, color: sc, ...(d.stroke.dashWidth ? { dashed: true } : {}) } } : {}) };
  }
  for (const l of d.layers ?? []) { const f = fillOf(l.drawable ?? l); if (f) return f; }
  return fillOf(d.drawable ?? d.current ?? null);
}

/** The texts and fills the design check compares, in screen pixels (see the header). */
export function compactViews(doc: any): Views {
  const texts: ViewText[] = [], fills: ViewFill[] = [];
  const walk = (v: any, alpha: number, w: number) => {
    if (!v || typeof v !== 'object' || v.visibility === 'GONE' || v.visibility === 'INVISIBLE') return;
    const a = alpha * (typeof v.alpha === 'number' ? v.alpha : 1); if (a < 0.01) return;
    const extra = (res: unknown) => ({ ...(typeof res === 'string' && res.startsWith('@') ? { res } : {}), ...(a < 0.999 ? { alpha: Math.round(a * 100) / 100 } : {}) });
    const s = Array.isArray(v.screen) ? v.screen : null, box = s ? [s[0], s[1], s[2] - s[0], s[3] - s[1]] as [number, number, number, number] : null;
    if (box && box[2] > 0 && box[3] > 0) {
      const t = v.text;
      if (t && typeof t.text === 'string' && t.text.trim()) {
        const m = String(t.size ?? '').match(/([\d.]+)px \(([\d.]+)sp\)/);
        texts.push({ text: t.text, box, color: argb(t.color), px: m ? +m[1] : null, sp: m ? +m[2] : null, weight: t.typeface?.weight ?? null, style: t.typeface?.style ?? null,
          family: t.typeface?.family ?? null, lines: t.lineCount ?? null, id: v.id ?? null, window: w, ...extra(v.xmlAttrs?.textColor) });
      }
      const f = fillOf(v.background);
      if (f) fills.push({ box, color: f.color, radius: f.radius, id: v.id ?? null, window: w, ...(f.stroke ? { stroke: f.stroke } : {}), ...extra(v.xmlAttrs?.background) });
    }
    for (const c of v.children ?? []) walk(c, a, w);
  };
  (doc.windows ?? []).forEach((win: any, i: number) => walk(win.root, 1, i));
  const density = doc.density ?? 1, scaledDensity = doc.scaledDensity ?? density;
  return { density, scaledDensity, fontScale: Math.round(scaledDensity / density * 100) / 100, texts, fills, windows: (doc.windows ?? []).map((w: any) => ({ title: w.title, type: w.type })) };
}
