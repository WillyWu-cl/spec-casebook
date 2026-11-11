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

/** The app's view dump now (the dumper runs on its main thread: a second or two). `args`: the dumper's comma-separated
 *  options (`secure=clear`, `secure=restore:<hash>.<hash>`; see secureShot). */
export async function dumpViews(a: Adb, timeoutMs = 30_000, args = ''): Promise<any> {
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
  const said = sh(a, `cmd activity attach-agent ${a.pkg} ${abs}/${names.so}=${abs}/${names.dex},${abs}/${name},${args}`).out;
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
/** An ImageView whose own background paints nothing, so only its drawable shows: the view's box and the box the drawable
 *  is painted in (its scaleType inside the padding), both in screen pixels. Only kept when the two differ. */
export type ViewImage = { box: [number, number, number, number]; painted: [number, number, number, number]; scale: string; id: string | null; window: number };
export type Views = { density: number; scaledDensity: number; fontScale: number; texts: ViewText[]; fills: ViewFill[]; images?: ViewImage[]; windows: { title: string; type: number }[] };

// What an ImageView shows (ported from rdqe-spec-contract-agent f6087bf, paintedImageBox, with the user's approval
// 2026-11-11): its drawable placed by the scaleType inside the padding, or null when the view's own background paints
// (then the view box is what shows) or the placement cannot be known (MATRIX, no intrinsic size). A 36 dp back button
// drawing a 24 dp icon with CENTER_INSIDE is Figma's 24 pt icon, not 12 pt too wide. CENTER_CROP and FIT_XY fill the
// content box; CENTER does not scale and is cut at it.
const SCALE_TYPES = new Set(['CENTER', 'CENTER_INSIDE', 'FIT_CENTER', 'FIT_START', 'FIT_END', 'FIT_XY', 'CENTER_CROP']);
function paintedBox(v: any, box: [number, number, number, number]): [number, number, number, number] | null {
  const d = v.image?.drawable; if (!d) return null;
  if (v.background || v.backgroundTint) {
    const f = fillOf(v.background), cls = String(v.background?.class ?? '');
    // a background that paints anything (a colour, a stroke, a bitmap or one not read) keeps the view box
    if (f || v.backgroundTint || !/ColorDrawable$|RippleDrawable$|StateListDrawable$/.test(cls)) return null;
  }
  const scale = String(v.image.scaleType ?? 'FIT_CENTER'); if (!SCALE_TYPES.has(scale)) return null;
  const find = (x: any): string | null => x && typeof x === 'object' ? (typeof x.intrinsic === 'string' ? x.intrinsic : find(x.current ?? x.wrapped ?? x.drawable ?? null)) : null;
  const m = /^(\d+)x(\d+)$/.exec(find(d) ?? ''); if (!m) return null;
  const iw = +m[1], ih = +m[2], pad = Array.isArray(v.padding) && v.padding.length === 4 ? v.padding.map(Number) : [0, 0, 0, 0];
  const c = [box[0] + pad[0], box[1] + pad[1], box[2] - pad[0] - pad[2], box[3] - pad[1] - pad[3]];
  if (!(iw > 0 && ih > 0 && c[2] > 0 && c[3] > 0)) return null;
  let out: number[];
  if (scale === 'FIT_XY' || scale === 'CENTER_CROP') out = c;
  else {
    const k = scale === 'CENTER' ? 1 : scale === 'CENTER_INSIDE' ? Math.min(1, c[2] / iw, c[3] / ih) : Math.min(c[2] / iw, c[3] / ih);
    const dw = iw * k, dh = ih * k, along = (start: number, size: number, drawn: number) => scale === 'FIT_START' ? start : scale === 'FIT_END' ? start + size - drawn : start + (size - drawn) / 2;
    const bx = along(c[0], c[2], dw), by = along(c[1], c[3], dh), l = Math.max(bx, c[0]), t = Math.max(by, c[1]);
    out = [l, t, Math.min(bx + dw, c[0] + c[2]) - l, Math.min(by + dh, c[1] + c[3]) - t];
  }
  const r = out.map(n => Math.round(n * 10) / 10) as [number, number, number, number];
  return r.every((n, i) => Math.abs(n - box[i]) < 0.5) ? null : r;
}

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
  const texts: ViewText[] = [], fills: ViewFill[] = [], images: ViewImage[] = [];
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
      const painted = v.image ? paintedBox(v, box) : null;
      if (painted) images.push({ box, painted, scale: String(v.image.scaleType ?? 'FIT_CENTER'), id: v.id ?? null, window: w });
    }
    for (const c of v.children ?? []) walk(c, a, w);
  };
  (doc.windows ?? []).forEach((win: any, i: number) => walk(win.root, 1, i));
  const density = doc.density ?? 1, scaledDensity = doc.scaledDensity ?? density;
  return { density, scaledDensity, fontScale: Math.round(scaledDensity / density * 100) / 100, texts, fills, images, windows: (doc.windows ?? []).map((w: any) => ({ title: w.title, type: w.type })) };
}

// ---- secure windows (ported from rdqe-spec-contract-agent, feat/figma-android-ui-conformance caf66e6, with the user's
// approval 2026-11-11) ---------------------------------------------------------------------------------------------------
// A window with FLAG_SECURE (0x2000) cannot be screenshotted: `screencap` returns nothing and UiAutomator2 a black
// image, so a design capture of it would compare Figma with black. PhotoDirector's editor sets it for free accounts
// only; any PowerDirector screen may too. secureShot takes the screenshot with the app's secure windows cleared for
// that moment through the view dumper (debuggable build only: android-viewdump.ts prepare) and puts the flag back;
// without the dumper it refuses. Only the app's own window attributes change, never a system setting.

/** The app's visible windows that carry FLAG_SECURE now, by title (`dumpsys window windows`). */
export function secureWindows(a: Adb): string[] {
  const out: string[] = [];
  let cur: { title: string; pkg: string | null; secure: boolean | null; visible: boolean | null } | null = null;
  const done = () => { if (cur && cur.pkg === a.pkg && cur.secure && cur.visible !== false) out.push(cur.title); };
  for (const line of sh(a, 'dumpsys window windows').out.split(/\r?\n/)) {
    const head = /^\s*Window #\d+ Window\{[0-9a-f]+ u\d+ ([^}]*)\}:?\s*$/.exec(line);
    if (head) { done(); cur = { title: head[1].trim(), pkg: null, secure: null, visible: null }; continue; }
    if (!cur) continue;
    const pkg = /\bpackage=(\S+)/.exec(line); if (pkg && cur.pkg === null) cur.pkg = pkg[1];
    // fl= is flag names (… SECURE …) or a hex word (#81812500); pfl= (private flags) never matches
    const fl = /(?:^|[\s{])fl=(\S.*)$/.exec(line);
    if (fl && cur.secure === null) { const w = fl[1].replace(/\}\s*$/, '').trim().split(/\s+/), hex = /^#?([0-9a-f]+)$/i.exec(w[0]);
      cur.secure = hex && !/^[A-Z_]+$/.test(w[0]) ? (parseInt(hex[1], 16) & 0x2000) !== 0 : w.includes('SECURE'); }
    const vis = /^\s*isVisible=(true|false)/.exec(line); if (vis) cur.visible = vis[1] === 'true';
  }
  done();
  return out;
}

const until = async (ok: () => boolean, ms = 5000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (ok()) return true; await new Promise(r => setTimeout(r, 100)); } return ok(); };

/** A screenshot of the app as it looks, its secure windows cleared for the moment it is taken. `secure` names the
 *  windows that were cleared (absent when there were none). Throws when the screenshot would be black: a secure
 *  window and no usable view dumper, a flag that will not clear, or one that will not come back (the app is then
 *  left without it: `adb shell am force-stop <package>` restores it). */
export async function secureShot(a: Adb, shot: () => Promise<Buffer>): Promise<{ png: Buffer; secure?: string[] }> {
  const before = secureWindows(a);
  if (!before.length) return { png: await shot() };
  const why = viewdumpProblem(a);
  if (why) throw new Error(`the app marks this screen secure (FLAG_SECURE: ${before.join(', ')}), so its screenshot is black; clearing it needs the view dumper, and ${why}`);
  const doc = await dumpViews(a, 30_000, 'noattrs,nofields,secure=clear');
  const cleared: { hash: string; title: string }[] = doc.secureFlag?.cleared ?? [];
  if (doc.secureFlag?.error || !cleared.length) throw new Error(`FLAG_SECURE could not be cleared (${doc.secureFlag?.error ?? 'the dumper found no secure window'})`);
  let png: Buffer | null = null, fail = '';
  try {
    if (!await until(() => secureWindows(a).length === 0)) fail = `FLAG_SECURE still set after clearing: ${secureWindows(a).join(', ')}`;
    else png = await shot();
  } finally {
    const back = await dumpViews(a, 30_000, `secure=restore:${cleared.map(c => c.hash).join('.')}`).catch((e: any) => ({ secureFlag: { error: String(e?.message ?? e) } }));
    const want = cleared.length - (back.secureFlag?.missing?.length ?? 0);
    if (back.secureFlag?.error || !await until(() => secureWindows(a).length >= Math.min(want, before.length)))
      throw new Error(`FLAG_SECURE was not put back on ${a.pkg} (${back.secureFlag?.error ?? 'dumpsys does not show it'}); run: adb -s ${a.serial} shell am force-stop ${a.pkg}`);
  }
  if (!png) throw new Error(fail);
  return { png, secure: cleared.map(c => c.title) };
}
