// Tests for lib/apk.ts (the debuggable re-sign of scripts/android-viewdump.ts): swapping one zip entry keeps every
// other entry byte for byte, and the manifest edit adds only android:debuggable, proven. The manifest test runs on a
// real release manifest when this computer has kept one (~/.casebook/android/apks/*-original.apk), else it is skipped.
// Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { join } from 'node:path';
import { debuggableOnlyDiff, manifestSummary, parseAxml, readZipDirectory, replaceZipEntry, setApplicationDebuggable, zipEntry } from '../lib/apk.ts';

test('replaceZipEntry: one entry swapped, a STORED entry left STORED and every other entry as it was', () => {
  const p = join(tmpdir(), `casebook-apk-test-${process.pid}.zip`);
  const py = `import zipfile,sys\nz=zipfile.ZipFile(sys.argv[1],'w')\nz.writestr(zipfile.ZipInfo('resources.arsc'),b'R'*500)\nz.writestr('AndroidManifest.xml',b'old manifest',zipfile.ZIP_DEFLATED)\nz.writestr('classes.dex',b'D'*900,zipfile.ZIP_DEFLATED)\nz.close()`;
  assert.equal(spawnSync('python3', ['-c', py, p]).status, 0);
  const before = readFileSync(p), after = replaceZipEntry(before, 'AndroidManifest.xml', Buffer.from('new manifest, longer than before'));
  assert.equal(zipEntry(after, 'AndroidManifest.xml')!.toString(), 'new manifest, longer than before');
  assert.equal(zipEntry(after, 'classes.dex')!.toString(), 'D'.repeat(900));
  const arsc = readZipDirectory(after).entries.find(e => e.name === 'resources.arsc')!;
  assert.equal(arsc.method, 0, 'resources.arsc stays STORED');
  const check = spawnSync('python3', ['-c', 'import zipfile,sys,io; z=zipfile.ZipFile(io.BytesIO(sys.stdin.buffer.read())); print(z.testzip() is None)'], { input: after });
  assert.equal(check.stdout.toString().trim(), 'True', 'a valid archive');
});

const kept = join(homedir(), '.casebook', 'android', 'apks'), original = existsSync(kept) ? readdirSync(kept).find(f => f.endsWith('-original.apk')) : undefined;
test('setApplicationDebuggable: only <application android:debuggable="true"> is added, order kept', { skip: !original && 'no release APK kept on this computer' }, () => {
  const man = zipEntry(readFileSync(join(kept, original!)), 'AndroidManifest.xml')!, edited = setApplicationDebuggable(man);
  assert.equal(manifestSummary(parseAxml(man)).debuggable, false);
  assert.equal(manifestSummary(parseAxml(edited)).debuggable, true);
  const d = debuggableOnlyDiff(parseAxml(man), parseAxml(edited));
  assert.ok(d.ok, d.problems.join('\n'));
  assert.deepEqual(manifestSummary(parseAxml(edited)), { ...manifestSummary(parseAxml(man)), debuggable: true }, 'package and version unchanged');
  assert.ok(!debuggableOnlyDiff(parseAxml(man), parseAxml(man)).ok, 'an unchanged manifest is not a valid re-sign');
});
