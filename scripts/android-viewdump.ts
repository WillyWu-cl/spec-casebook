// Exact Android UI data for the design check (figma skill, references/conformance.md; user, 2026-11-04, REQ-085): a
// view dumper running inside the app reads what no outside dump holds, each view's text colour, size (px and sp),
// typeface and style, line count, alpha and visibility, background and outline (fill, corner radius, stroke),
// elevation and its layout attributes, for every window. It is the rdqe-spec-contract-agent's viewdump (agent.c +
// ViewDumper.java in .claude/skills/figma/assets/viewdump/, copied with the user's approval): a JVMTI agent loaded with
// `cmd activity attach-agent`, the mechanism Android Studio's Layout Inspector uses. That needs a debuggable app, so
// the installed release build is re-signed debuggable (lib/apk.ts) and installed in its place.
// Usage: node scripts/android-viewdump.ts <command> [--serial S] [--package P]
//   build                 javac + d8 → viewdumper.dex, NDK clang (aarch64-linux-android30) → libviewdump.so, into
//                         ~/.casebook/android/viewdump/ with the source digest they were built from (local: GitHub
//                         takes no binaries; a stale build is refused)
//   prepare [--apk <release.apk>] [--yes-uninstall]
//                         (--apk: re-sign that release APK, e.g. a newer TR build, instead of the installed one)
//                         pull the installed APK (kept as ~/.casebook/android/apks/<package>-<versionCode>-original.apk),
//                         re-sign it debuggable (the manifest edit proven the only change, the dex unchanged) and
//                         install it: over the app when it was signed with the same QA key, else only with
//                         --yes-uninstall, as an uninstall clears the app's data (sign-in, history). Then checks
//                         `run-as` and sets debug_view_attributes_application_package (layout attributes in dumps).
//   dump <out.json>       attach to the running app, write its view dump to <out.json> and the screenshot of the same
//                         moment beside it (<out>.png); the agent files go into the app's code_cache under their content
//                         hash (a library the app has loaded is never overwritten: it crashes the app)
//   restore [--yes-uninstall]
//                         put the original APK back (an uninstall again: the signatures differ)
// The re-sign key is the rdqe tool's shared QA keystore (~/.casebook/android/phd-qa-debug.jks, alias phdqa, password
// `android`; not committed: a phone re-signed by either tool then updates with `install -r`, data kept), or
// CASEBOOK_ANDROID_KEYSTORE / _ALIAS / _PASS. The SDK is found at ANDROID_HOME, ANDROID_SDK_ROOT or
// ~/Library/Android/sdk (build-tools with zipalign, apksigner and d8, a platform 31+, an NDK), the JDK at JAVA_HOME
// or on PATH. A debuggable build runs slower: no timing taken on it counts.
import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { basename, dirname, join } from 'node:path';
import { dexDigest, debuggableOnlyDiff, manifestSummary, parseAxml, replaceZipEntry, setApplicationDebuggable, sha256, zipEntry } from './lib/apk.ts';
import { VIEWDUMP_HOME, VIEWDUMP_OUT, VIEWDUMP_SRC, compactViews, dumpViews, secureShot, sourceDigest, viewdumpBuild } from './lib/android-views.ts';
import { blankShot } from './lib/design-watch.ts';

const argv = process.argv.slice(2), cmd = argv[0];
const opt = (k: string) => { const i = argv.indexOf(`--${k}`); return i > 0 ? argv[i + 1] : undefined; };
const HOME = VIEWDUMP_HOME, OUT = VIEWDUMP_OUT, APKS = join(HOME, 'apks'), SRC = VIEWDUMP_SRC;
const PKG = opt('package') ?? 'com.cyberlink.powerdirector.DRA140225_01';
const die = (msg: string, code = 1): never => { console.error(msg); process.exit(code); };

// ---- tools ---------------------------------------------------------------------------------------------------------
const run = (exe: string, args: string[], o: { env?: NodeJS.ProcessEnv; check?: boolean; input?: string } = {}) => {
  const r = spawnSync(exe, args, { encoding: 'buffer', env: { ...process.env, ...o.env }, input: o.input, maxBuffer: 1 << 30 });
  if (o.check !== false && r.status !== 0) die(`${basename(exe)} ${args.slice(0, 4).join(' ')} failed (${r.status}):\n${(r.stderr?.toString() || r.stdout?.toString() || '').trim().split('\n').slice(-12).join('\n')}`);
  return { status: r.status, out: r.stdout?.toString() ?? '', buf: r.stdout as Buffer, err: r.stderr?.toString() ?? '' };
};
const sdk = () => { for (const d of [process.env.ANDROID_HOME, process.env.ANDROID_SDK_ROOT, join(homedir(), 'Library', 'Android', 'sdk')]) if (d && existsSync(join(d, 'platform-tools'))) return d;
  return die('No Android SDK (ANDROID_HOME, ANDROID_SDK_ROOT or ~/Library/Android/sdk): install build-tools, a platform 31+ and an NDK with sdkmanager.'); };
const newest = (dir: string, ok: (d: string) => boolean) => existsSync(dir) ? readdirSync(dir).filter(d => ok(join(dir, d))).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).at(-1) : undefined;
const buildTools = () => { const d = join(sdk(), 'build-tools'), v = newest(d, p => ['zipalign', 'lib/apksigner.jar', 'lib/d8.jar'].every(f => existsSync(join(p, f))));
  return v ? join(d, v) : die(`No build-tools with zipalign, apksigner and d8 under ${d} (sdkmanager "build-tools;35.0.0").`); };
const androidJar = () => { const d = join(sdk(), 'platforms'), v = newest(d, p => +(basename(p).split('-')[1] ?? 0) >= 31 && existsSync(join(p, 'android.jar')));
  return v ? join(d, v, 'android.jar') : die(`No platform 31+ under ${d} (sdkmanager "platforms;android-35").`); };
const ndkClang = () => { const d = join(sdk(), 'ndk'), host = process.platform === 'darwin' ? 'darwin-x86_64' : 'linux-x86_64';
  const v = newest(d, p => existsSync(join(p, 'toolchains', 'llvm', 'prebuilt', host, 'bin', 'clang')));
  return v ? join(d, v, 'toolchains', 'llvm', 'prebuilt', host, 'bin', 'clang') : die(`No NDK under ${d} (sdkmanager "ndk;28.2.13676358").`); };
const jdk = (tool: string) => { const j = process.env.JAVA_HOME && join(process.env.JAVA_HOME, 'bin', tool); if (j && existsSync(j)) return j;
  const mac = spawnSync('/usr/libexec/java_home', ['-v', '17+'], { encoding: 'utf8' }); return mac.status === 0 ? join(mac.stdout.trim(), 'bin', tool) : tool; };
// the phone, looked up when a command first needs it (build needs none)
let found: string | undefined;
const phone = () => found ??= opt('serial') ?? (() => { const ds = run('adb', ['devices']).out.split('\n').slice(1).filter(l => /\tdevice$/.test(l)).map(l => l.split('\t')[0]);
  return ds.length === 1 ? ds[0] : ds.length ? die(`More than one phone (${ds.join(', ')}): pass --serial.`) : die('No phone on adb.', 75); })();
const adb = (args: string[], o: { check?: boolean } = {}) => run('adb', ['-s', phone(), ...args], o);
const sh = (cmdline: string, o: { check?: boolean } = {}) => adb(['shell', cmdline], o).out.trim();
const runAs = (cmdline: string, o: { check?: boolean } = {}) => sh(`run-as ${PKG} ${cmdline}`, o);
const KEY = { ks: process.env.CASEBOOK_ANDROID_KEYSTORE ?? join(HOME, 'phd-qa-debug.jks'), alias: process.env.CASEBOOK_ANDROID_KEYSTORE_ALIAS ?? 'phdqa', pass: process.env.CASEBOOK_ANDROID_KEYSTORE_PASS ?? 'android' };

// ---- build ---------------------------------------------------------------------------------------------------------
function build() {
  const work = join(tmpdir(), `casebook-viewdump-${process.pid}`), jar = androidJar(), bt = buildTools();
  rmSync(work, { recursive: true, force: true }); mkdirSync(join(work, 'classes'), { recursive: true }); mkdirSync(OUT, { recursive: true });
  run(jdk('javac'), ['-encoding', 'UTF-8', '-source', '8', '-target', '8', '-Xlint:-options', '-nowarn', '-bootclasspath', jar, '-d', join(work, 'classes'), join(SRC, 'ViewDumper.java')]);
  const classes: string[] = []; (function walk(d: string) { for (const e of readdirSync(d, { withFileTypes: true })) e.isDirectory() ? walk(join(d, e.name)) : e.name.endsWith('.class') && classes.push(join(d, e.name)); })(join(work, 'classes'));
  run(jdk('java'), ['-cp', join(bt, 'lib', 'd8.jar'), 'com.android.tools.r8.D8', '--release', '--min-api', '30', '--lib', jar, '--output', work, ...classes]);
  copyFileSync(join(work, 'classes.dex'), join(OUT, 'viewdumper.dex'));
  run(ndkClang(), ['--target=aarch64-linux-android30', '-shared', '-fPIC', '-O2', '-Wall', '-o', join(OUT, 'libviewdump.so'), join(SRC, 'agent.c'), '-llog']);
  const outputs = Object.fromEntries(['libviewdump.so', 'viewdumper.dex'].map(f => [f, sha256(readFileSync(join(OUT, f)))]));
  writeFileSync(join(OUT, 'build.json'), JSON.stringify({ built_at: new Date().toISOString(), source: sourceDigest(), outputs, android_jar: basename(dirname(jar)), build_tools: basename(bt), ndk: ndkClang().split('/ndk/')[1]?.split('/')[0] }, null, 1) + '\n');
  rmSync(work, { recursive: true, force: true });
  console.log(`built ${OUT}: libviewdump.so ${outputs['libviewdump.so'].slice(0, 12)}, viewdumper.dex ${outputs['viewdumper.dex'].slice(0, 12)}`);
}

// ---- prepare / restore ---------------------------------------------------------------------------------------------
const installed = () => { const d = sh(`dumpsys package ${PKG}`, { check: false });
  return d.includes(`Package [${PKG}]`) ? { versionCode: d.match(/versionCode=(\d+)/)?.[1] ?? '?', debuggable: /pkgFlags=\[[^\]]*DEBUGGABLE/.test(d), path: sh(`pm path ${PKG}`).split('\n')[0]?.replace(/^package:/, '') } : null; };
const runAsWorks = () => adb(['shell', `run-as ${PKG} id`], { check: false }).status === 0;
function install(apk: string, allowUninstall: boolean) {
  const r = adb(['install', '-r', '-d', apk], { check: false });
  if (r.status === 0 && /Success/.test(r.out)) return 'replaced';
  if (!/INSTALL_FAILED_UPDATE_INCOMPATIBLE|signatures do not match/i.test(r.out + r.err)) die(`adb install failed:\n${(r.out + r.err).trim()}`);
  if (!allowUninstall) die(`The installed ${PKG} is signed with another key, so it can only be replaced after an uninstall, which clears the app's data (sign-in, history). Run again with --yes-uninstall once that is agreed.`, 3);
  adb(['uninstall', PKG]);
  const again = adb(['install', apk], { check: false });
  if (again.status !== 0 || !/Success/.test(again.out)) die(`adb install failed after the uninstall:\n${(again.out + again.err).trim()}`);
  return 'uninstalled and installed';
}
function prepare() {
  const installed0 = installed(), given = opt('apk');
  if (!given && !installed0) die(`${PKG} is not installed on ${phone()}.`, 3);
  if (!given && installed0!.debuggable && runAsWorks()) { console.log(`${PKG} ${installed0!.versionCode} is already debuggable on ${phone()}: ready`); return settings(); }
  mkdirSync(APKS, { recursive: true });
  // --apk: a release APK from a TR (a newer build) instead of the one installed; kept under its own version code
  const givenSum = given ? manifestSummary(parseAxml(zipEntry(readFileSync(given), 'AndroidManifest.xml')!)) : undefined;
  const vc = givenSum?.version_code ?? installed0!.versionCode;
  const original = join(APKS, `${PKG}-${vc}-original.apk`);
  if (!existsSync(original)) {
    if (given) copyFileSync(given, `${original}.partial`); else adb(['pull', installed0!.path, `${original}.partial`]);
    renameSync(`${original}.partial`, original);
  }
  const rel = readFileSync(original), sum = manifestSummary(parseAxml(zipEntry(rel, 'AndroidManifest.xml')!));
  if (sum.package !== PKG) die(`${original} is ${sum.package}, not ${PKG}`);
  const out = join(APKS, `${PKG}-${vc}-debuggable.apk`);
  if (!existsSync(out)) {
    if (!existsSync(KEY.ks)) die(`No re-sign keystore at ${KEY.ks} (the rdqe tool's shared QA keystore, or set CASEBOOK_ANDROID_KEYSTORE).`, 3);
    const man = zipEntry(rel, 'AndroidManifest.xml')!, edited = setApplicationDebuggable(man), diff = debuggableOnlyDiff(parseAxml(man), parseAxml(edited));
    if (!diff.ok) die(`The manifest edit changed more than android:debuggable, refusing to re-sign:\n  ${diff.problems.join('\n  ')}`);
    const work = join(tmpdir(), `casebook-resign-${process.pid}`); mkdirSync(work, { recursive: true });
    writeFileSync(join(work, 'unsigned.apk'), replaceZipEntry(rel, 'AndroidManifest.xml', edited));
    const bt = buildTools();
    run(join(bt, 'zipalign'), ['-p', '-f', '4', join(work, 'unsigned.apk'), join(work, 'aligned.apk')]);
    run(jdk('java'), ['-jar', join(bt, 'lib', 'apksigner.jar'), 'sign', '--ks', KEY.ks, '--ks-key-alias', KEY.alias, '--ks-pass', 'env:CASEBOOK_KS_PASS', '--key-pass', 'env:CASEBOOK_KS_PASS',
      '--out', `${out}.partial`, join(work, 'aligned.apk')], { env: { CASEBOOK_KS_PASS: KEY.pass } });
    const signed = readFileSync(`${out}.partial`);
    if (dexDigest(signed) !== dexDigest(rel) || !manifestSummary(parseAxml(zipEntry(signed, 'AndroidManifest.xml')!)).debuggable) { rmSync(`${out}.partial`); die('The re-signed APK is not the release build made debuggable: refusing it.'); }
    renameSync(`${out}.partial`, out); rmSync(`${out}.partial.idsig`, { force: true }); rmSync(work, { recursive: true, force: true });
    writeFileSync(`${out}.json`, JSON.stringify({ made_at: new Date().toISOString(), package: PKG, version_code: sum.version_code, version_name: sum.version_name, original_sha256: sha256(rel), debuggable_sha256: sha256(signed), dex: dexDigest(signed), manifest_change: diff.diffs.map(d => `<${d.element}> ${d.name}: ${d.before ?? '∅'} → ${d.after}`) }, null, 1) + '\n');
    console.log(`re-signed: ${out} (manifest: only android:debuggable added; dex unchanged)`);
  }
  console.log(`installing on ${phone()}: ${install(out, argv.includes('--yes-uninstall'))}`);
  const after = installed();
  if (!after?.debuggable || !runAsWorks()) die(`${PKG} on ${phone()} is not debuggable after the install (run-as fails).`, 4);
  console.log(`${PKG} ${after!.versionCode} is debuggable on ${phone()}; the original is kept at ${original}`);
  settings();
}
// layout attributes in dumps are recorded only for views created after this is set: a cold launch follows
function settings() { sh(`settings put global debug_view_attributes_application_package ${PKG}`); sh('settings put global debug_view_attributes 1'); }
function restore() {
  const now = installed(), original = now ? join(APKS, `${PKG}-${now.versionCode}-original.apk`) : '';
  if (!original || !existsSync(original)) die(`No original APK kept for ${PKG}${now ? ` ${now.versionCode}` : ''} under ${APKS}.`, 3);
  console.log(`restoring ${original}: ${install(original, argv.includes('--yes-uninstall'))}`);
  sh('settings delete global debug_view_attributes_application_package', { check: false });
}

// ---- dump ----------------------------------------------------------------------------------------------------------
async function dump(outFile: string) {
  const b = viewdumpBuild(); if ('problem' in b) die(b.problem, 3);
  const now = installed();
  if (!now?.debuggable || !runAsWorks()) die(`${PKG} on ${phone()} is not debuggable: node scripts/android-viewdump.ts prepare`, 3);
  let doc: any; try { doc = await dumpViews({ serial: phone(), pkg: PKG }); } catch (e: any) { die(String(e.message ?? e)); }
  // the screenshot with the app's secure windows cleared for that moment, refused when it shows nothing
  let shot: { png: Buffer; secure?: string[] };
  try { shot = await secureShot({ serial: phone(), pkg: PKG }, async () => adb(['exec-out', 'screencap', '-p']).buf); } catch (e: any) { die(String(e.message ?? e), 5); }
  const blank = blankShot(shot!.png); if (blank) die(`${blank}; nothing written`, 5);
  const png = shot!.png; if (shot!.secure) doc.capture = { ...doc.capture, secure_cleared: shot!.secure };
  mkdirSync(dirname(outFile), { recursive: true });
  doc.capture = { ...doc.capture, version_code: now!.versionCode, wm_size: sh('wm size'), wm_density: sh('wm density') };
  writeFileSync(outFile, JSON.stringify(doc)); writeFileSync(outFile.replace(/\.json$/, '') + '.png', png);
  const v = compactViews(doc);
  console.log(`dumped ${outFile} (${(doc.capture.bytes / 1024).toFixed(0)} KB, ${v.texts.length} texts, ${v.fills.length} fills, font scale ${v.fontScale}, ${doc.capture.ms} ms) and ${basename(outFile.replace(/\.json$/, ''))}.png`);
}

if (cmd === 'build') build();
else if (cmd === 'prepare') prepare();
else if (cmd === 'restore') restore();
else if (cmd === 'dump' && argv[1] && !argv[1].startsWith('--')) await dump(argv[1]);
else die('Usage: node scripts/android-viewdump.ts build | prepare [--yes-uninstall] | dump <out.json> | restore [--yes-uninstall]  [--serial S] [--package P]', 2);
