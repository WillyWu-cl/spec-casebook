// Tests for scripts/board-lint.ts (user, 2026-11-04): the coverage page's marks against the text of a board's committed
// Figma screenshot. A synthetic feature, library/zzlint/board-lint-fixture/, gets the coverage data as a file (--data)
// and an OCR cache newer than its screenshot, so no coverage build, Swift or Figma call runs; removed afterwards.
// Run: npm test
import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, utimesSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const ROOT = join(import.meta.dirname, '..', '..');
const F = 'zzlint/board-lint-fixture', FD = join(ROOT, 'library', 'zzlint'), FEAT = join(FD, 'board-lint-fixture');
const EX = join(FEAT, 'specs', '2026-01-01', 'extracted'), DATA = join(FEAT, 'data.json');
const put = (p: string, data: unknown) => { mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, typeof data === 'string' || Buffer.isBuffer(data) ? data : JSON.stringify(data, null, 1)); };
const read = (p: string) => JSON.parse(readFileSync(p, 'utf8'));
const lint = (...args: string[]) => {
  const r = spawnSync(process.execPath, [join(ROOT, 'scripts', 'board-lint.ts'), F, 'android', '--data', DATA, ...args], { cwd: ROOT, encoding: 'utf8' });
  return { status: r.status, out: `${r.stdout}${r.stderr}` };
};
const warnings = () => read(join(EX, 'board-lint-android.json')).warnings as any[];

before(() => {
  rmSync(FD, { recursive: true, force: true });
  // a phone with a Figma-read 「Save to library」, and two marks a review sheet added from the old PDF layout: a Gender
  // chip the redrawn board no longer has and a 「Discard」 pill on top of Save; a dialog beside it; no arrow read
  put(DATA, { spec_folder: 'specs/2026-01-01', notes: [
    { id: 'n1', board: 'pm-b', x: 900, y: 100, text: 'Only Save to library saves to Mine', reqs: ['R-001'], trace: 'R-001' },
    { id: 'n2', board: 'pm-b', x: 600, y: 40, text: 'Discard closes without saving', reqs: ['R-002'], trace: 'R-002' },
    { id: 'n3', board: 'pm-b', x: 600, y: 60, text: 'mockup status bar', reqs: [], trace: 'ui: OCR noise' }],
    boards: [{ name: 'pm-b', id: '1:2', title: 'PM board B', box: [0, 0, 1000, 1000] }],
    screens: [{ id: '2:1', board: 'pm-b', box: [100, 100, 375, 812] }, { id: '3:1', board: 'pm-b', box: [600, 300, 270, 148] }],
    groups: [{ group: 'C-chips', label: 'choice of 2: 「Female」 「Male」', rects: [[125, 531, 69, 28]] },
      { group: 'K-save', label: 'Save to library', rects: [[124, 800, 327, 44]] },
      { group: 'K-discard', label: 'Discard', rects: [[141, 815, 295, 43]] },
      { group: 'K-icon', label: 'Regenerate image', rects: [[300, 300, 24, 24]] }],
    arrows: [] });
  put(join(EX, 'inventory.json'), { screens: [{ id: '2:1', box: [100, 100, 375, 812] }], controls: [
    { label: 'Female', box: [25, 431, 69, 28], screens: ['2:1'] }, { label: 'Save to library', box: [24, 700, 327, 44], screens: ['2:1'] },
    { label: 'Discard', box: [41, 715, 295, 43], screens: ['2:1'] }, { label: 'Regenerate image', box: [200, 200, 24, 24], screens: ['2:1'] }] });
  put(join(EX, 'inventory-overrides.json'), { add: [{ screen: '2:1', label: 'Female', box: [25, 431, 69, 28] },
    { screen: '2:1', label: 'Discard', box: [41, 715, 295, 43] }, { screen: '2:1', label: 'Regenerate image', box: [200, 200, 24, 24] }] });
  put(join(EX, 'boards', 'pm-b.md'), '```\n 1  1  Female\n 2  2  Discard\n 3  3  Regenerate image\n```\n');
  put(join(EX, 'figma', 'shots.json'), { 'pm-b.png': { board: '1:2' } });
  // only the IHDR size is read: the OCR cache below is newer, so the image is never read
  const png = Buffer.alloc(24); png.writeUInt32BE(1000, 16); png.writeUInt32BE(1000, 20);
  put(join(EX, 'figma', 'pm-b.png'), png);
  put(join(EX, 'figma', 'ocr', 'pm-b.json'), { png: 'pm-b.png', box: [0, 0, 1000, 1000], lines: [
    { text: 'Save to library', x: 160, y: 812, w: 120, h: 20 }, { text: 'Gender: Female', x: 130, y: 650, w: 110, h: 18 },
    { text: 'Only Save to library saves to Mine', x: 600, y: 100, w: 200, h: 16 }, { text: '按 X → 跳確認', x: 600, y: 200, w: 100, h: 16 },
    { text: 'Discard closes', x: 610, y: 44, w: 90, h: 16 }] });
  const t = new Date(Date.now() - 60_000); utimesSync(join(EX, 'figma', 'pm-b.png'), t, t);
});
after(() => rmSync(FD, { recursive: true, force: true }));

test('flags review-sheet marks the image no longer shows, overlapping marks, a moved note and a step with no arrow', () => {
  const r = lint();
  assert.equal(r.status, 10, r.out);
  const ws = warnings(), of = (k: string) => ws.filter(w => w.kind === k);
  assert.deepEqual(of('stale-mark').map(w => w.group).sort(), ['C-chips', 'K-discard'], 'a Figma-read mark and an icon are not checked');
  assert.match(of('stale-mark').find(w => w.group === 'C-chips').text, /「Female」.*no such text/, 'a chip takes its own label');
  assert.deepEqual(of('overlap').map(w => w.groups.sort()), [['K-discard', 'K-save']]);
  assert.deepEqual(of('note-moved').map(w => w.id), ['pm-b|note-moved|n1'], 'a note whose words stand at its place is not moved');
  assert.equal(of('note-gone').length, 0, 'an untraced note is not checked');
  assert.equal(of('no-arrow').length, 1);
});

test('an acknowledged warning is left out', () => {
  assert.equal(lint('--ack', 'pm-b|no-arrow|board', '--why', 'the step is a toast').status, 0);
  lint();
  assert.equal(warnings().filter(w => w.kind === 'no-arrow').length, 0);
  assert.equal(read(join(EX, 'board-lint-acks.json'))['pm-b|no-arrow|board'], 'the step is a toast');
});
