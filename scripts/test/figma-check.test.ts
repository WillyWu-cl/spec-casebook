// Tests for what is drawn over a board (user, 2026-11-04): scripts/figma/inventory.js reads loose arrows, connectors and
// notes over a board (run here on a small mock of the Figma plugin API), figma-check.ts --compare flags a board whose
// overlays changed or whose read lacks an arrow drawn over it and asks for a screenshot that shows them, and
// figma-text.ts compares a board's Figma text with its PDF OCR. A synthetic feature, library/zzcheck/figma-check-fixture/
// (its own product folder: the design tests remove library/zztest/), is built and removed afterwards; no Figma call.
// Run: npm test
import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const ROOT = join(import.meta.dirname, '..', '..');
const F = 'zzcheck/figma-check-fixture', FD = join(ROOT, 'library', 'zzcheck'), FEAT = join(FD, 'figma-check-fixture');
const EX = join(FEAT, 'specs', '2026-01-01', 'extracted');
const put = (p: string, data: unknown) => { mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, typeof data === 'string' ? data : JSON.stringify(data, null, 1)); };
const read = (p: string) => JSON.parse(readFileSync(p, 'utf8'));
const run = (script: string, args: string[]) => {
  const r = spawnSync(process.execPath, [join(ROOT, 'scripts', script), ...args], { cwd: ROOT, encoding: 'utf8' });
  return { status: r.status, out: `${r.stdout}${r.stderr}` };
};

// ---- a mock of the Figma plugin API: frames, instances, texts, vectors and connectors with absolute boxes ------------
type N = any;
const byId = new Map<string, N>();
const node = (o: any, kids: N[] = []): N => {
  const [x, y, w, h] = o.box;
  const n: N = { visible: true, opacity: 1, effects: [], fills: [], clipsContent: false, ...o, children: kids, width: w, height: h,
    absoluteBoundingBox: { x, y, width: w, height: h }, absoluteTransform: [[1, 0, x], [0, 1, y]] };
  for (const k of kids) k.parent = n;
  const desc = (m: N): N[] => m.children.flatMap((c: N) => [c, ...desc(c)]);
  n.findAll = (f: (m: N) => boolean) => desc(n).filter(f);
  n.findAllWithCriteria = ({ types }: { types: string[] }) => desc(n).filter(m => types.includes(m.type));
  n.findOne = (f: (m: N) => boolean) => desc(n).find(f) ?? null;
  byId.set(n.id, n);
  return n;
};
const text = (id: string, chars: string, box: number[]) => node({ id, type: 'TEXT', name: chars, characters: chars, box });
// the board frame holds a phone with a close button and a dialog beside it; the arrow from the close button to the
// dialog and a note are loose on the page, drawn over the board
const phone = node({ id: '2:1', type: 'FRAME', name: 'Phone', box: [100, 100, 375, 812] }, [
  node({ id: '2:2', type: 'INSTANCE', name: 'button/close', box: [110, 110, 24, 24] }),
  node({ id: '2:3', type: 'INSTANCE', name: 'button/primary', box: [124, 800, 327, 44] }, [text('2:4', 'Save to library', [130, 810, 200, 20])]),
]);
const dialog = node({ id: '3:1', type: 'FRAME', name: 'Dialog', box: [600, 300, 270, 148] }, [
  text('3:2', 'Discard this character?', [610, 310, 250, 20]),
  node({ id: '3:3', type: 'FRAME', name: 'Keep', box: [600, 402, 135, 46] }, [text('3:4', 'Keep', [640, 415, 40, 20])]),
]);
const board = node({ id: '1:2', type: 'FRAME', name: 'Update board', box: [0, 0, 1000, 1000] }, [phone, dialog]);
const arrow = node({ id: '9:9', type: 'VECTOR', name: 'Vector 12', box: [122, 50, 620, 250],
  vectorNetwork: { vertices: [{ x: 0, y: 70 }, { x: 0, y: 0 }, { x: 620, y: 0 }, { x: 620, y: 250, strokeCap: 'ARROW_LINES' }], segments: [{ start: 0, end: 1 }, { start: 1, end: 2 }, { start: 2, end: 3 }] } });
const conn = node({ id: '9:10', type: 'CONNECTOR', name: 'Connector', box: [735, 448, 10, 200], connectorStartStrokeCap: 'NONE', connectorEndStrokeCap: 'ARROW_EQUILATERAL',
  connectorStart: { endpointNodeId: '3:1', magnet: 'BOTTOM' }, connectorEnd: { position: { x: 735, y: 650 } } });
const note = text('9:11', '• The page has no Discard button', [900, 600, 300, 20]);
const far = text('9:12', 'Another board', [3000, 3000, 100, 20]);
const page = node({ id: '0:1', type: 'PAGE', name: 'Page', box: [0, 0, 0, 0] }, [board, arrow, conn, note, far]);
page.absoluteBoundingBox = null;
const figma = { getNodeByIdAsync: async (id: string) => byId.get(id) ?? null, setCurrentPageAsync: async () => {} };
const inventory = async (boards: unknown) => {
  const src = readFileSync(join(ROOT, 'scripts', 'figma', 'inventory.js'), 'utf8').replace('const PAGE = __PAGE__, BOARDS = __BOARDS__;', `const PAGE = '0:1', BOARDS = ${JSON.stringify(boards)};`);
  const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor;
  return new AsyncFunction('figma', src)(figma);
};

test('a group read takes the arrows, connectors and notes drawn over a board', async () => {
  const out = await inventory(['1:2']);
  const ids = out.arrows.map((a: any[]) => a[0]).sort();
  assert.deepEqual(ids, ['9:10', '9:9']);
  const a = out.arrows.find((x: any[]) => x[0] === '9:9');
  assert.equal(out.names[out.controls[a[4]][0]], 'button/close', 'the loose arrow starts on the close button');
  assert.equal(out.screens[a[5]][2], 'Dialog', 'and ends on the dialog');
  const c = out.arrows.find((x: any[]) => x[0] === '9:10');
  assert.deepEqual(c[2], [735, 448, 735, 650], 'a connector runs from its attached node side to its free end');
  assert.ok(out.overlay['1:2'], 'the overlays have a fingerprint');
  assert.deepEqual(out.overlay_box['1:2'], [0, 0, 1200, 1000]);
  const texts = out.texts.map((t: any[]) => t[5]);
  assert.ok(texts.includes('• The page has no Discard button') && texts.includes('Save to library') && !texts.includes('Another board'));
  assert.equal(out.texts.find((t: any[]) => t[5] === 'Save to library')[6], 1, 'a text in a phone is marked');
});

test('a check returns the overlay fingerprint, the arrows over the board and a holder', async () => {
  const res = await inventory({ hash: ['1:2'] });
  const [id, h, ov, arrows, box, holder] = res.boards[0];
  assert.equal(id, '1:2'); assert.ok(h && ov);
  assert.deepEqual([...arrows].sort(), ['9:10', '9:9']);
  assert.deepEqual(box, [0, 0, 1200, 1000]);
  assert.equal(holder, '', 'only the page holds a board with overlays on the page');
  const before = ov;
  note.characters = '• Changed note';
  const again = await inventory({ hash: ['1:2'] });
  assert.equal(again.boards[0][1], h, 'the board itself did not change');
  assert.notEqual(again.boards[0][2], before, 'its overlays did');
  note.characters = '• The page has no Discard button';
});

// ---- figma-check.ts --compare and figma-text.ts on a fixture feature --------------------------------------------------
before(() => {
  rmSync(FEAT, { recursive: true, force: true });
  put(join(FEAT, 'specs', '2026-01-01', 'spec-set.json'), { folder: '2026-01-01', received_at: '2026-01-01', files: [] });
  put(join(EX, 'figma-frames.json'), { files: { pm: { fileKey: 'PMKEY' } } });
  // a read from before overlays: no overlay hashes, no arrows, texts of the board only
  put(join(EX, 'figma-inventory-g1.json'), { file: 'PMKEY', page: '0:1', group: 'g1', boards: [['1:2', 'pm-board', 0, 0, 1000, 1000]], names: [], screens: [], controls: [],
    arrows: [], entries: ['1:2'], hash: { '1:2': 'aaaa0001' }, hashed_at: '2026-01-01T00:00:00.000Z',
    texts: [[0, 130, 810, 200, 20, 'Save to library', 1], [0, 130, 900, 200, 20, 'Gender: Female', 1], [0, 900, 600, 300, 20, '• Only Save to library saves to Mine', 0]] });
  put(join(EX, 'figma-hashes.json'), { boards: { '1:2': { hash: 'aaaa0001', at: '2026-01-01T00:00:00.000Z', group: 'g1' } }, files: {} });
  put(join(EX, 'figma', 'shots.json'), { 'pm-board.png': { board: '1:2', group: 'g1', hash: 'aaaa0001', captured_at: '2026-01-02T00:00:00.000Z' } });
  put(join(EX, 'figma', 'pm-board.png'), '');
  put(join(EX, 'figma-check', 'pm.json'), { mode: 'hash', hashed_at: '2026-02-01T00:00:00.000Z', others: [],
    boards: [['1:2', 'aaaa0001', 'bbbb0002', ['9:9'], [0, 0, 1200, 1000], '5:5']] });
  put(join(EX, 'boards', 'pm-board.md'), '# Board\n\n```\n\n 100  100  Save to library\n 120  100  Discard\n 140  100  • Only Save to library saves to Mine\n 160  100  9:41\n```\n');
});
after(() => { rmSync(FEAT, { recursive: true, force: true }); rmSync(FD, { recursive: true, force: true }); });

test('compare flags a board whose read lacks an arrow drawn over it and asks for a screenshot showing it', () => {
  const r = run('figma-check.ts', [F, '--compare']);
  assert.equal(r.status, 10, r.out);
  const rep = read(join(EX, 'figma-check.json'));
  assert.deepEqual(rep.missed_arrows.map((m: any) => m.arrows), [['9:9']]);
  assert.deepEqual(rep.changed.map((c: any) => [c.id, c.why]), [['1:2', ['missed arrows']]]);
  assert.deepEqual(rep.reread.map((r: any) => r.group), ['g1'], 'the group is re-read');
  // --plan packs it into a call with a description --save finds it by (2026-11-05)
  const p = run('figma-check.ts', [F, '--plan']);
  assert.match(p.out, /call-1: use_figma on figma-pm .*description "casebook figma-check [^"]+ call-1".*groups g1/);
  assert.ok(existsSync(join(EX, 'figma-check', 'call-1.js')));
  assert.deepEqual(Object.keys(read(join(EX, 'figma-check', 'todo.json')).calls[0].groups), ['g1']);
  assert.deepEqual(rep.shots, [{ png: 'pm-board.png', board: '1:2', box: [0, 0, 1200, 1000], holder: '5:5' }]);
  assert.match(r.out, /get_screenshot of 5:5, cut to --box 0,0,1200,1000/);
  const store = read(join(EX, 'figma-hashes.json'));
  assert.equal(store.boards['1:2'].overlay, 'bbbb0002', 'the first check with overlays keeps them as the baseline');
});

test('compare flags a board whose overlays changed, and is quiet once the re-read has them', () => {
  // the re-read now has the arrow and the overlay hash
  const g = read(join(EX, 'figma-inventory-g1.json'));
  put(join(EX, 'figma-inventory-g1.json'), { ...g, arrows: [['9:9', 'Vector 12', [122, 120, 742, 300], 0, 0, 1, '', '']], overlay: { '1:2': 'bbbb0002' }, hashed_at: '2026-02-02T00:00:00.000Z' });
  put(join(EX, 'figma-check', 'pm.json'), { mode: 'hash', hashed_at: '2026-02-03T00:00:00.000Z', others: [], boards: [['1:2', 'aaaa0001', 'bbbb0002', ['9:9'], [0, 0, 1200, 1000], '5:5']] });
  run('figma-check.ts', [F, '--shot', 'pm-board.png', '1:2', '--box', '0,0,1200,1000']);
  let r = run('figma-check.ts', [F, '--compare']);
  assert.equal(r.status, 0, r.out);
  put(join(EX, 'figma-check', 'pm.json'), { mode: 'hash', hashed_at: '2026-02-04T00:00:00.000Z', others: [], boards: [['1:2', 'aaaa0001', 'cccc0003', ['9:9'], [0, 0, 1200, 1000], '5:5']] });
  r = run('figma-check.ts', [F, '--compare']);
  assert.equal(r.status, 10, r.out);
  const rep = read(join(EX, 'figma-check.json'));
  assert.deepEqual(rep.changed.map((c: any) => c.why), [['overlay']]);
  assert.equal(rep.shots.length, 1, 'its screenshot is taken again');
});

test('figma-text compares a board with its PDF OCR, then with its accepted Figma text', () => {
  let r = run('figma-text.ts', [F, '--all']);
  assert.equal(r.status, 10, r.out);
  const b = read(join(EX, 'figma-text-diff.json')).boards[0];
  assert.equal(b.baseline, 'pdf-ocr');
  assert.deepEqual(b.added.map((l: any) => l.text), ['Gender: Female']);
  assert.deepEqual(b.removed.map((l: any) => l.text), ['Discard'], 'the status bar time is not a line');
  r = run('figma-text.ts', [F, '--all', '--accept']);
  assert.equal(r.status, 0, r.out);
  assert.ok(existsSync(join(EX, 'figma-text', 'pm-board.json')));
  r = run('figma-text.ts', [F, '--all']);
  assert.equal(r.status, 0, r.out);
});

// several groups in one call, and the check call cut from the same file (2026-11-05: the restructure for packed calls
// once left the check call cut inside the group reader, a syntax error)
test('one call reads several groups and returns each by name', async () => {
  const out = await inventory({ groups: { a: ['1:2'], b: ['1:2'] } });
  assert.equal(out.mode, 'groups');
  assert.deepEqual(Object.keys(out.groups), ['a', 'b']);
  assert.deepEqual(out.pending, []);
  assert.ok(out.groups.a.arrows.length && typeof out.groups.a.ms === 'number');
});

test('the check call is cut before the group reader and still runs', async () => {
  const src = readFileSync(join(ROOT, 'scripts', 'figma', 'inventory.js'), 'utf8');
  const cut = src.slice(0, src.indexOf('\nconst readGroup = ')).replace('const PAGE = __PAGE__, BOARDS = __BOARDS__;', `const PAGE = '0:1', BOARDS = ${JSON.stringify({ hash: ['1:2'] })};`);
  const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor;
  const out = await new AsyncFunction('figma', cut)(figma);
  assert.equal(out.mode, 'hash');
  assert.equal(out.boards[0][0], '1:2');
});
