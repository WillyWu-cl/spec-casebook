// The pages server's own upkeep: what it clears from disk, and which drafts the navigation page offers.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { listBoards } from '../lib/boards.ts';
import { housekeeping } from '../lib/housekeeping.ts';
import { attempts, hasSession, makePasscode, passcodeMatches, safeNext, sessionOf } from '../lib/passcode.ts';
import { cloneGroup, duplicates, logPulls, removeUnzipped, unpack } from '../lib/runs-storage.ts';

test('housekeeping clears only old page files', () => {
  const temp = mkdtempSync(join(tmpdir(), 'pages-temp-')), thumbs = mkdtempSync(join(tmpdir(), 'pages-thumbs-')), now = Date.now();
  const file = (dir: string, name: string, hoursOld: number) => { const p = join(dir, name), t = new Date(now - hoursOld * 3_600_000); writeFileSync(p, 'x'); utimesSync(p, t, t); return p; };
  const oldPage = file(temp, 'coverage-pdr-ai-mini-drama-android-123.html', 2), oldJobs = file(temp, 'coverage-jobs-55.json', 2);
  const fresh = file(temp, 'coverage-pdr-ai-mini-drama-ios-456.html', 0.1), other = file(temp, 'something-else.html', 99);
  const oldThumb = file(thumbs, 'a.jpg', 31 * 24), usedThumb = file(thumbs, 'b.jpg', 29 * 24);
  assert.deepEqual(housekeeping(temp, thumbs, now), { files: 3, bytes: 3 });
  assert.deepEqual([oldPage, oldJobs, oldThumb].map(existsSync), [false, false, false]);
  assert.deepEqual([fresh, other, usedThumb].map(existsSync), [true, true, true]);
  rmSync(temp, { recursive: true }); rmSync(thumbs, { recursive: true });
});

test('every listed table can be opened', () => {
  for (const product of listBoards()) for (const f of product.features as any[]) {
    assert.match(f.id, /^[a-z0-9-]+\/[a-z0-9-]+$/);
    for (const p of f.platforms) assert.ok(p.version || p.drafts.length, `${f.id} ${p.platform} has neither a table nor a draft`);
  }
});

test('passcode: made codes, sessions, tries and where sign-in may lead', () => {
  const code = makePasscode();
  assert.match(code, /^[a-z2-9]{4}-[a-z2-9]{4}$/);
  assert.ok(passcodeMatches(` ${code.toUpperCase()} `, code), 'spaces and capitals from copying do not matter');
  assert.ok(!passcodeMatches('wrong', code));
  const s = sessionOf(code);
  assert.ok(hasSession(`a=1; casebook_session=${s}`, s));
  assert.ok(!hasSession('casebook_session=nope', s) && !hasSession(undefined, s));
  assert.equal(safeNext('/pdr/x/ios/cases/?a=1'), '/pdr/x/ios/cases/?a=1');
  for (const bad of ['//evil.example', 'http://evil.example', '/\\\\evil.example', null]) assert.equal(safeNext(bad), '/');
  const t = attempts(3, 1000);
  t.failed('a', 0); t.failed('a', 0); assert.ok(!t.locked('a', 0));
  t.failed('a', 0); assert.ok(t.locked('a', 500) && !t.locked('b', 500) && !t.locked('a', 1500));
});

test('run storage: an unzipped copy goes only when the zips hold all of it, and comes back', () => {
  const run = mkdtempSync(join(tmpdir(), 'pages-run-')), pull = join(run, 'logs', 'p1'), un = join(pull, 'unzipped');
  mkdirSync(un, { recursive: true });
  writeFileSync(join(un, 'a.txt'), 'hello log');
  execFileSync('zip', ['-q', '-j', join(pull, 'Logs.zip'), join(un, 'a.txt')]);
  assert.deepEqual(logPulls(run).map(p => p.safe), [true]);
  writeFileSync(join(un, 'b.txt'), 'only here');
  assert.deepEqual(logPulls(run).map(p => p.safe), [false], 'a file the zips lack keeps the folder');
  removeUnzipped(logPulls(run)[0]);
  assert.ok(existsSync(join(un, 'b.txt')));
  rmSync(join(un, 'b.txt'));
  removeUnzipped(logPulls(run)[0]);
  assert.ok(!existsSync(un));
  assert.equal(unpack(run), 1);
  assert.equal(readFileSync(join(un, 'a.txt'), 'utf8'), 'hello log');
  rmSync(run, { recursive: true });
});

test('run storage: identical files become clones with their bytes and times', () => {
  const dir = mkdtempSync(join(tmpdir(), 'pages-dup-')), body = 'x'.repeat(70_000), a = join(dir, 'a.png'), b = join(dir, 'b.png'), c = join(dir, 'c.png');
  writeFileSync(a, body); writeFileSync(b, body); writeFileSync(c, 'y'.repeat(70_000));
  const t = new Date(1_700_000_000_000); utimesSync(b, t, t);
  const groups = duplicates(dir);
  assert.deepEqual(groups.map(g => g.files), [[a, b]]);
  assert.equal(cloneGroup(groups[0]), 70_000);
  assert.equal(readFileSync(b, 'utf8'), body);
  rmSync(dir, { recursive: true });
});
