// Tests for the figma skill's design check (scripts/design.ts, lib/design-plan.ts, design-page.ts, device design
// captures' format) and figma-source's receipts (scope.json, stale returns, screenshot size). They build a small
// synthetic feature, library/zztest/design-fixture/, with planted differences of every kind, run the real commands
// on it and remove it afterwards, so they need no phone, no Figma call and no local Figma read.
// Run: npm test   (node --test scripts/test/; python3 with Pillow is needed, as for the commands themselves)
import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { appElements, figmaScreen, keyboardInSource } from '../lib/design-match.ts';

const ROOT = join(import.meta.dirname, '..', '..');
const F = 'zztest/design-fixture', FD = join(ROOT, 'library', 'zztest'), FEAT = join(FD, 'design-fixture');
const SET = join(FEAT, 'specs', '2026-01-01'), EX = join(SET, 'extracted'), OUT = join(EX, 'figma-source', 'design', 'out');
const T = join(FEAT, 'ios'), RUNS = join(T, 'runs');
const put = (p: string, data: unknown) => { mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, typeof data === 'string' ? data : JSON.stringify(data, null, 1)); };
const read = (p: string) => JSON.parse(readFileSync(p, 'utf8'));
const run = (script: string, args: string[], opt: { input?: string; env?: Record<string, string> } = {}) => {
  const r = spawnSync(process.execPath, [join(ROOT, 'scripts', script), ...args], { cwd: ROOT, encoding: 'utf8', input: opt.input, env: { ...process.env, ...opt.env } });
  return { status: r.status, out: `${r.stdout}${r.stderr}` };
};
const design = (...args: string[]) => run('design.ts', [F, 'ios', ...args]);
const cands = (runName: string, screen: string) => read(join(RUNS, runName, 'design', 'compare.json')).screens.find((s: any) => s.id === screen).candidates;
const ids = (c: any[]) => c.map(x => x.id).sort();

// ---- the fixture -----------------------------------------------------------------------------------------------------
const W = '#ffffffff';
const text = (id: string, parent: string, chars: string, box: number[], o: any = {}) => ({ id, parent, type: 'TEXT', name: chars, abs: box,
  text: { characters: chars, align: [o.align ?? 'LEFT', 'TOP'], auto_resize: 'HEIGHT', runs: [{ font_size: 16, font_weight: o.weight, line_height: o.lh ?? 20, fills: [{ type: 'SOLID', color: W }] }] } });
// screen 1:10 at the canvas origin, 1:20 beside it, 1:30 (no row reaches it) after that
const S1 = [
  { id: '1:10', parent: '1:1', type: 'FRAME', name: 'Home', abs: [0, 0, 375, 812] },
  text('1:11', '1:10', 'Create Your Drama', [20, 100, 200, 24], { lh: 24 }),
  text('1:13', '1:10', 'Pick a style for your story', [20, 140, 300, 20], { weight: 400 }),
  text('1:1a', '1:10', 'Choose a template', [20, 180, 200, 20]),
  text('1:1g', '1:10', 'See all', [300, 180, 60, 20]),
  text('1:1b', '1:10', 'Recently created dramas', [20, 220, 200, 20]),
  text('1:1c', '1:10', 'Two line text here', [20, 260, 200, 20]),
  text('1:1e', '1:10', 'Upgrade now', [20, 330, 120, 20]),
  text('1:17', '1:10', 'A lighthouse keeper finds a message in a bottle that was written by her own grandmother', [20, 360, 330, 40]),
  // the button has a 1 pt white border in Figma, none on the phone (planted border)
  { id: '1:15', parent: '1:10', type: 'FRAME', name: 'btn_start', abs: [120, 590, 140, 44], radius: 12, fills: [{ type: 'SOLID', color: '#3366ffff' }], strokes: [{ type: 'SOLID', color: '#ffffffff' }], stroke_weight: 1 },
  text('1:14', '1:15', 'Start', [150, 602, 80, 20], { align: 'CENTER' }),
  text('1:12', '1:10', 'Templates', [20, 700, 100, 20]),
  // a tag hugging its label (auto layout): 10 pt padding left in Figma, 4 on the phone (planted padding)
  { id: '1:1h', parent: '1:10', type: 'FRAME', name: 'tag_new', abs: [20, 420, 90, 24], radius: 4, fills: [{ type: 'SOLID', color: '#884400ff' }],
    layout: { mode: 'HORIZONTAL', padding: [6, 50, 6, 10], primary_sizing: 'AUTO', cross_sizing: 'AUTO' } },
  text('1:1i', '1:1h', 'NEW', [30, 426, 30, 12]),
  // three icons in a row 16 pt apart; on the phone share sits 4 pt further from more (planted spacing)
  { id: '1:1j', parent: '1:10', type: 'INSTANCE', name: 'ic_share', abs: [250, 50, 24, 24] },
  { id: '1:16', parent: '1:10', type: 'INSTANCE', name: 'ic_close', abs: [330, 50, 24, 24] },
  { id: '1:1d', parent: '1:10', type: 'INSTANCE', name: 'ic_more', abs: [290, 50, 24, 24] },
  { id: '1:18', parent: '1:10', type: 'INSTANCE', name: 'Status Bar', abs: [0, 0, 375, 44] },
  text('1:19', '1:18', '9:41', [20, 12, 40, 20]),
];
const S2 = [
  { id: '1:20', parent: '1:1', type: 'FRAME', name: 'Error_offline', abs: [400, 0, 375, 812] },
  ...["You're offline", 'Check your connection', 'Try again', 'Saved drafts', 'Settings'].map((t, i) => text(`1:2${i + 1}`, '1:20', t, [420, 100 + 40 * i, 250, 20])),
];
const S3 = [{ id: '1:30', parent: '1:1', type: 'FRAME', name: 'Orphan', abs: [800, 0, 375, 812] }, text('1:31', '1:30', 'Nobody comes here', [820, 100, 200, 20])];
// 1:40: an empty state drawn under Home, no arrow into it; 1:50: alone on another board, nothing leads to it
const S4 = [{ id: '1:40', parent: '1:1', type: 'FRAME', name: 'Home_empty', abs: [0, 900, 375, 812] }];
const S5 = [{ id: '2:50', parent: '2:1', type: 'FRAME', name: 'Island', abs: [3000, 0, 375, 812] }];
const SCREENS = [S1[0], S2[0], S3[0], S4[0]].map(s => ({ board: '1:1', id: s.id, name: s.name, box: s.abs, abs: s.abs })).concat({ board: '2:1', id: '2:50', name: 'Island', box: S5[0].abs, abs: S5[0].abs });
// the Design's flow arrows: Home's Start → offline (the casebook traces it too), offline's Try again → Orphan
const ARROWS = [{ board: '1:1', id: '1:98', path: [[200, 610], [420, 100]], from: '1:10', control: '1:15', to: '1:20', kind: 'flow' },
  { board: '1:1', id: '1:97', path: [[500, 200], [820, 100]], from: '1:20', control: { id: '1:23', name: 'next' }, to: '1:30', kind: 'flow' }];

// app page sources: iOS (points) for 1:10, UiAutomator2 (pixels, bounds) for 1:20
const st = (label: string, x: number, y: number, w: number, h: number, type = 'XCUIElementTypeStaticText', name = '') =>
  `<${type} type="${type}" name="${name}" label="${label}" visible="true" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
// planted: 「Choose the template」 (other words: not checked), 「Recently creat…」 cut short, 「Start」 7.5 pt right of the
// button's centre, the tag's label 6 pt off its padding, share 4 pt further from more
const iosHome = (recent = 'Recently creat…') => `<AppiumAUT><XCUIElementTypeApplication type="XCUIElementTypeApplication" name="PDR" label="" visible="true" x="0" y="0" width="375" height="812">
${st('Create Your Drama', 20, 110, 180, 24)}${st('Pick a style for your story', 32, 150, 250, 20)}${st('Choose the template', 20, 190, 180, 20)}
${st(recent, 20, 230, 150, 20)}${st('Two line text here', 20, 270, 150, 40)}${st('Beta', 200, 100, 40, 20)}
${st('Start', 120, 590, 140, 44, 'XCUIElementTypeButton')}${st('Start', 175, 602, 45, 20)}${st('Templates', 20, 700, 100, 20)}
${st('', 20, 430, 90, 24, 'XCUIElementTypeOther')}${st('NEW', 24, 436, 30, 12)}
${st('', 240, 48, 28, 28, 'XCUIElementTypeButton', 'share')}${st('', 288, 48, 28, 28, 'XCUIElementTypeButton', 'more')}</XCUIElementTypeApplication></AppiumAUT>`;
const androidOffline = `<hierarchy><android.widget.FrameLayout class="android.widget.FrameLayout" bounds="[0,0][1080,2338]" displayed="true">
<android.widget.TextView class="android.widget.TextView" text="You're offline" bounds="[58,317][634,386]" displayed="true"/>
<android.widget.TextView class="android.widget.TextView" text="Something else entirely" bounds="[58,500][900,560]" displayed="true"/>
</android.widget.FrameLayout></hierarchy>`;

// screenshots drawn with Pillow: dark background, a white block for each text, one text in red (planted text colour),
// the Start button green where Figma says blue (planted fill colour)
function png(path: string, w: number, h: number, blocks: [number[], string][]) {
  mkdirSync(dirname(path), { recursive: true });
  const py = `import json, sys
from PIL import Image, ImageDraw
j = json.load(sys.stdin); im = Image.new("RGB", (j["w"], j["h"]), "#101418"); d = ImageDraw.Draw(im)
for b, c in j["blocks"]: d.rectangle(b, fill=c)
im.save(j["path"])`;
  const r = spawnSync('python3', ['-c', py], { input: JSON.stringify({ path, w, h, blocks }), encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
}
const s3 = (b: number[], inset = 4) => [b[0] * 3 + inset, b[1] * 3 + inset, (b[0] + b[2]) * 3 - inset, (b[1] + b[3]) * 3 - inset];
// texts as white blocks, one per line (the check counts an app text's lines on the screenshot)
function homeShot(path: string) {
  png(path, 1125, 2436, [
    [s3([120, 590, 140, 44], 0), '#33cc66'], [s3([20, 430, 90, 24], 0), '#884400'],
    ...[[20, 110, 180, 24], [20, 190, 180, 20], [20, 230, 150, 20], [20, 271, 150, 16], [20, 291, 150, 16], [175, 602, 45, 20], [20, 700, 100, 20], [24, 436, 30, 12]].map(b => [s3(b), '#ffffff'] as [number[], string]),
    [s3([32, 150, 250, 20]), '#ff2020'],
  ]);
}
function capture(runName: string, screen: string, file: string, xml: string, win: any, extra: any = {}) {
  const dir = join(RUNS, runName);
  put(join(dir, 'screenshots', 'design', `${file}.xml`), xml);
  const line = { t: new Date().toISOString(), screen, case: extra.case ?? 'TC-001', png: `screenshots/design/${file}.png`, xml: `screenshots/design/${file}.xml`, win, ...extra };
  writeFileSync(join(dir, 'design', 'captures.jsonl'), (existsSync(join(dir, 'design', 'captures.jsonl')) ? readFileSync(join(dir, 'design', 'captures.jsonl'), 'utf8') : '') + JSON.stringify(line) + '\n');
}

function writeOut() {
  put(join(OUT, 'screens.json'), SCREENS);
  put(join(OUT, '1-1.json'), { board: { id: '1:1', name: 'Board', box: [0, 0, 1200, 1712] }, nodes: [{ id: '1:1', parent: null, type: 'FRAME', name: 'Board', abs: [0, 0, 1200, 1712] }, ...S1, ...S2, ...S3, ...S4] });
  put(join(OUT, '2-1.json'), { board: { id: '2:1', name: 'Other', box: [3000, 0, 375, 812] }, nodes: S5 });
  put(join(OUT, 'arrows.json'), ARROWS);
}

before(() => {
  rmSync(FD, { recursive: true, force: true });
  put(join(FD, 'product.json'), { name: 'Test' });
  put(join(SET, 'spec-set.json'), { feature: F, folder: '2026-01-01', received_at: '2026-01-01T00:00:00Z', spec_set_sha256: 'x', files: [] });
  put(join(EX, 'figma-frames.json'), { files: { design: { fileKey: 'KEY123', page: '0:1' } } });
  writeOut();
  put(join(EX, 'inventory.json'), {
    screens: [S1[0], S2[0], S3[0], S4[0], S5[0]].map(s => ({ id: s.id, board: 'Board', name: s.name, box: s.abs })),
    controls: [
      { id: 'K-1', group: 'G-close', kind: 'button', name: 'ic_close', label: '', node: '1:16', screens: ['1:10'] },
      { id: 'K-2', group: 'G-start', kind: 'button', name: 'btn_start', label: 'Start', node: '1:15', screens: ['1:10'] },
      { id: 'K-3', group: 'G-more', kind: 'button', name: 'ic_more', label: '', node: '1:1d', screens: ['1:10'] },
      { id: 'K-4', group: 'G-share', kind: 'button', name: 'ic_share', label: '', node: '1:1j', screens: ['1:10'] },
    ],
    arrows: [{ id: '1-99', to: '1:20', kind: 'flow' }],
  });
  put(join(EX, 'arrows.json'), { arrows: [{ arrow: '1-99', node: '1-99', edge: 'Home Start → offline', expected: 'Start offline shows the offline screen.' }] });
  put(join(T, 'cases.csv'), 'ID,Section,Precondition,Action,Expected Result,Priority,Spec Ref,Notes\n' +
    'TC-001,Home,Signed in,Tap Start,The drama composer opens,High,R-002,\nTC-002,Errors,Wi-Fi off,Tap Start,The offline screen shows,High,R-001,\n');
  put(join(T, 'requirements.md'), '- R-001 (DS: flow arrow 1-99 Home Start → offline) Start while offline shows the offline screen. Walked by: TC-002.\n- R-002 Start opens the composer.\n');
  put(join(T, 'control-trace.json'), { entries: [{ group: 'G-close', press: 'TC-001' }, { group: 'G-start', press: 'TC-001' }, { group: 'G-more', press: 'TC-001' }, { group: 'G-share', press: 'TC-001' }] });
  put(join(T, 'drafts', 'd1', 'phases.json'), { phases: [{ id: 'P1', segments: [{ id: 'P1-a', cases: ['TC-001', 'TC-002'] }] }] });
  // run r1: Home (iOS, with a scrolled part holding "See all") and the offline screen (Android-style source)
  put(join(RUNS, 'r1', 'run-state.md'), '# Run state — P1\nBuild: PowerDirector iOS 15.2.0 (190001)\n');
  mkdirSync(join(RUNS, 'r1', 'design'), { recursive: true });
  homeShot(join(RUNS, 'r1', 'screenshots', 'design', '1-10.png'));
  capture('r1', '1:10', '1-10', iosHome(), { w: 375, h: 812 });
  png(join(RUNS, 'r1', 'screenshots', 'design', '1-10.p2.png'), 1125, 2436, []);
  capture('r1', '1:10', '1-10.p2', `<A>${st('See all', 300, 100, 60, 20)}</A>`, { w: 375, h: 812 }, { part: 2 });
  png(join(RUNS, 'r1', 'screenshots', 'design', '1-20.png'), 1080, 2338, []);
  capture('r1', '1:20', '1-20', androidOffline, { w: 1080, h: 2338 }, { case: 'TC-002' });
});
after(() => { if (!process.env.KEEP_FIXTURE) rmSync(FD, { recursive: true, force: true }); });

// ---- plan ------------------------------------------------------------------------------------------------------------
test('plan: each screen gets the row that reaches it, or no route', () => {
  const r = design('plan');
  assert.equal(r.status, 0, r.out);
  const plan = read(join(T, 'design', 'plan.json')), by = (id: string) => plan.screens.find((s: any) => s.id === id);
  assert.equal(by('1:10').route.case, 'TC-001');
  assert.equal(by('1:10').route.how, 'on');
  assert.equal(by('1:10').route.fit, 'high');
  assert.equal(by('1:20').route.case, 'TC-002');
  assert.equal(by('1:20').route.how, 'arrow');
  // no row reaches these: the Design's own arrows do, marked as gaps in the casebook table
  assert.equal(by('1:30').route.how, 'figma'); assert.equal(by('1:30').route.fit, 'path'); assert.equal(by('1:30').gap, true);
  assert.deepEqual(by('1:30').route.steps.map((x: any) => x.screen), ['Home', 'Error_offline']);
  assert.equal(by('1:30').route.steps[0].control, 'btn_start');
  assert.equal(by('1:30').route.action, 'Home › btn_start › Error_offline › Try again', 'an arrow control written as {id, name} still reads as text');
  assert.equal(by('1:40').route.fit, 'variant', 'a state drawn beside Home takes Home\'s path');
  assert.deepEqual(by('1:40').flags, ['variant', 'gap'], 'the Plan view asks the user to look at it');
  assert.deepEqual(by('1:10').flags, []);
  assert.equal(by('2:50').status, 'no-route');
  assert.deepEqual(plan.by_case, { 'TC-001': ['1:10'], 'TC-002': ['1:20'] });
  assert.match(r.out, /2 by Design arrows only \(2 gaps in the table\), 1 no route/);
  assert.match(r.out, /no route: 2:50 Island/);
});

test('plan: a row whose Notes name a frame the inventory lacks reaches it (cited)', () => {
  const csv = join(T, 'cases.csv'), was = readFileSync(csv, 'utf8');
  try {
    writeFileSync(csv, was + 'TC-003,Island,Signed in,Open the island,The island shows,Low,R-002,Design 2:50 (not in the inventory)\n');
    assert.equal(design('plan').status, 0);
    const plan = read(join(T, 'design', 'plan.json')), by = (id: string) => plan.screens.find((s: any) => s.id === id);
    assert.equal(by('2:50').route.case, 'TC-003'); assert.equal(by('2:50').route.how, 'cited'); assert.ok(!by('2:50').gap);
  } finally { writeFileSync(csv, was); assert.equal(design('plan').status, 0); }
});

test('plan on its own: no casebook table, the Design arrows are the route', () => {
  const r = run('design.ts', [F, 'android', 'plan']);
  assert.equal(r.status, 0, r.out);
  const plan = read(join(FEAT, 'android', 'design', 'plan.json')), by = (id: string) => plan.screens.find((s: any) => s.id === id);
  assert.equal(plan.casebook, false);
  assert.equal(by('1:10').route.fit, 'entry');
  assert.equal(by('1:20').route.action, 'Home › btn_start');
  assert.equal(by('1:30').route.steps.length, 2);
  assert.ok(!by('1:30').gap, 'no table, no gap');
  assert.match(run('design.ts', [F, 'android', 'screens']).out, /1:20 {2}Error_offline \(Board\) · Design path: Home › btn_start/);
});

test('figma-source init: a feature with no spec set gets one holding the Design link', () => {
  const r = run('figma-source.ts', ['zztest/new-feature', 'init', 'https://www.figma.com/design/AbC123/Name?node-id=5-6&t=x']);
  assert.equal(r.status, 0, r.out);
  const dir = join(FD, 'new-feature', 'specs');
  const set = JSON.parse(readFileSync(join(dir, require_one(dir), 'spec-set.json'), 'utf8'));
  assert.deepEqual(set.files, []);
  assert.deepEqual(read(join(dir, set.folder, 'extracted', 'figma-frames.json')).files.design, { fileKey: 'AbC123', page: '5:6', url: 'https://www.figma.com/design/AbC123/Name?node-id=5-6&t=x' });
  assert.notEqual(run('figma-source.ts', ['zztest/new-feature', 'init', 'https://example.com']).status, 0);
});
const require_one = (dir: string) => { const d = readdirSync(dir); assert.equal(d.length, 1); return d[0]; };

test('plan: skip list kept, and built again when the table changes', () => {
  assert.equal(design('plan', '--skip', '1:30', '--skip-reason', 'superseded').status, 0);
  assert.equal(read(join(T, 'design', 'plan.json')).screens.find((s: any) => s.id === '1:30').status, 'excluded');
  const later = new Date(Date.now() + 5000);
  utimesSync(join(T, 'cases.csv'), later, later);
  const r = design('screens', 'TC-001');
  assert.match(r.out, /plan built again/);
  assert.match(r.out, /1:10 {2}Home \(Board\) · fit high/);
  assert.equal(read(join(T, 'design', 'plan.json')).screens.find((s: any) => s.id === '1:30').status, 'excluded', 'skip survives a rebuild');
  assert.match(design('screens', 'TC-999').out, /no Design screen/);
});

test('scope: the Plan view block excludes with a reason, includes again and marks the review', () => {
  const scope = (block: string) => run('design.ts', [F, 'ios', 'scope'], { input: block });
  assert.match(design('status').out, /; scope not reviewed\n/);
  const r = scope(`DESIGN SCOPE ${F} ios\nexclude 1:40: State cannot be brought about\nexclude 2:1: Other board\ninclude 1:30\nexclude 1:10\nexclude 9:99: nowhere\nnonsense\nreviewed\n`);
  assert.equal(r.status, 0, r.out);
  assert.match(r.out, /skipped: exclude 1:10 \(an exclusion needs a reason\)/);
  assert.match(r.out, /skipped: 9:99 is not a screen or board/);
  assert.match(r.out, /skipped: nonsense/);
  assert.match(r.out, /ios: 3 change\(s\), scope marked reviewed/);
  let plan = read(join(T, 'design', 'plan.json')), by = (id: string) => plan.screens.find((s: any) => s.id === id);
  assert.equal(by('1:40').status, 'excluded'); assert.equal(by('1:40').why, 'State cannot be brought about');
  assert.equal(by('2:50').why, 'Other board', 'a board\'s reason covers its screens');
  assert.equal(by('1:30').status, 'routed', 'included again');
  assert.equal(by('1:10').status, 'routed', 'an exclusion without a reason is not applied');
  assert.equal(plan.scope_review.ids.length, plan.screens.length);
  assert.deepEqual(plan.scope_included, ['1:30'], 'an include is kept, so the Plan view does not ask about the screen again');
  // a rebuild keeps the reasons and the review
  const later = new Date(Date.now() + 9000); utimesSync(join(T, 'cases.csv'), later, later);
  assert.match(design('screens', 'TC-001').out, /plan built again/);
  plan = read(join(T, 'design', 'plan.json'));
  assert.equal(plan.skip_reasons['1:40'], 'State cannot be brought about'); assert.ok(plan.scope_review);
  assert.match(design('status').out, /; scope reviewed \d{4}-\d\d-\d\d\n/);
  // `both` applies to every platform with a plan; then back to the skip list the later tests expect
  assert.equal(run('design.ts', [F, 'android', 'plan']).status, 0);
  assert.match(run('design.ts', [F, 'ios', 'scope'], { input: `DESIGN SCOPE ${F} both\nreviewed\n` }).out, /ios: 0 change[\s\S]*android: 0 change/);
  assert.ok(read(join(FEAT, 'android', 'design', 'plan.json')).scope_review);
  assert.equal(scope(`DESIGN SCOPE ${F} ios\nexclude 1:30: superseded\ninclude 1:40\ninclude 2:1\n`).status, 0);
  plan = read(join(T, 'design', 'plan.json'));
  assert.deepEqual(plan.skip, ['1:30']); assert.equal(plan.screens.find((s: any) => s.id === '1:30').why, 'superseded');
  assert.ok(plan.scope_included.includes('1:40') && !plan.scope_included.includes('1:30'), 'an exclusion drops the include');
  assert.equal(scope('DESIGN SCOPE other/feature ios\n').status, 1, 'a block for another feature is refused');
});

// ---- check -----------------------------------------------------------------------------------------------------------
test('check: every planted difference is found, and nothing else', () => {
  const r = design('check', 'r1');
  assert.equal(r.status, 0, r.out);
  const c = cands('r1', '1:10');
  assert.deepEqual(ids(c.filter((x: any) => x.severity !== 'info')), [
    'align:1:14',       // "Start" 7.5 pt right of the button's centre
    'border:1:15',      // Figma's 1 pt white border not drawn
    'colour:1:13',      // text drawn red, Figma white
    'colour:1:15',      // button green, Figma blue
    'control:1:16',     // close icon with nothing tappable there
    'lines:1:1c',       // two lines where Figma has one
    'missing:1:1e',     // "Upgrade now" not on the phone
    'padding:1:1i',     // the tag's label 4 pt from its left edge, Figma 10 (and the right edge, the tag hugging it)
    'spacing:1:1j-1:1d', // share 20 pt from more, Figma 16
    'truncated:1:1b',   // ends in an ellipsis
  ]);
  // not checked (user, 2026-11-06): the words (「Choose the template」) and where a text sits (「Pick a style…」 12 pt right)
  assert.ok(!c.some((x: any) => ['copy', 'position'].includes(x.kind) || x.id === 'extra:choose the template'), 'other words are neither copy, missing nor extra');
  const by = (id: string) => c.find((x: any) => x.id === id);
  assert.deepEqual(by('padding:1:1i').delta, { left: -6, right: 6 });
  assert.deepEqual(by('align:1:14').delta, { x: 7.5 });
  assert.deepEqual(by('spacing:1:1j-1:1d').delta, { gap: 4 });
  assert.match(by('border:1:15').note, /Figma draws a 1 pt border, the app none/);
  assert.ok(c.some((x: any) => x.id === 'sample:1:17' && x.severity === 'info'), 'long sample text is info');
  assert.ok(c.some((x: any) => x.id === 'extra:beta'), 'app text not in Figma is info');
  assert.ok(!c.some((x: any) => !['align:1:14', 'spacing:1:1j-1:1d'].includes(x.id) && /1:1d|1:19|1:1g|1:11|1:14|1:12/.test(x.id)), 'present icon, status bar, part-2 text and matched texts give nothing');
  const s = read(join(RUNS, 'r1', 'design', 'compare.json')).screens.find((x: any) => x.id === '1:10');
  assert.equal(s.fit.top.dy, 10); assert.equal(s.fit.top.ok, true); assert.equal(s.fit.bottom.ok, true);
  assert.equal(s.build, '15.2.0 (190001)');
  assert.equal(s.parts.length, 1);
  assert.ok(existsSync(join(RUNS, 'r1', 'screenshots', 'design', '1-10-sheet.png')), 'review sheet drawn');
});

test("check: the app's own view data (Android) gives size, weight, colour, lines and radius exactly", () => {
  // Home captured on Android (run a-views, named to sort before the runs the status test reads) with the debuggable build's view dump (lib/android-views.ts compact form), in pixels at 2.88
  const px = (b: number[]) => b.map(v => Math.round(v * 2.88));
  const tv = (t: string, b: number[]) => { const [x, y, w, h] = px(b); return `<android.widget.TextView class="android.widget.TextView" text="${t}" bounds="[${x},${y}][${x + w},${y + h}]" displayed="true"/>`; };
  const xml = `<hierarchy><android.widget.FrameLayout class="android.widget.FrameLayout" bounds="[0,0][1080,2338]" displayed="true">` +
    tv('Create Your Drama', [20, 100, 200, 24]) + tv('Pick a style for your story', [20, 140, 300, 20]) + tv('Choose a template', [20, 180, 200, 20]) +
    tv('Recently created dramas', [20, 220, 200, 20]) + tv('Two line text here', [20, 260, 200, 20]) + tv('Templates', [20, 700, 100, 20]) +
    `<android.widget.Button class="android.widget.Button" text="Start" clickable="true" bounds="[346,1699][749,1826]" displayed="true"/></android.widget.FrameLayout></hierarchy>`;
  const vt = (text: string, b: number[], o: any = {}) => ({ text, box: px(b), color: o.color ?? '#FFFFFFFF', px: (o.sp ?? 16) * 2.88, sp: o.sp ?? 16, weight: o.weight ?? null, style: 'normal', family: 'sans-serif', lines: o.lines ?? 1, id: null, window: 0 });
  const views = { density: 2.88, scaledDensity: 3.168, fontScale: 1.1, windows: [{ title: 'Home', type: 1 }], texts: [
    vt('Create Your Drama', [20, 100, 200, 24], { sp: 18 }), vt('Pick a style for your story', [20, 140, 300, 20], { weight: 700 }), vt('Choose a template', [20, 180, 200, 20]),
    vt('Recently created dramas', [20, 220, 200, 20]), vt('Two line text here', [20, 260, 200, 20], { lines: 2 }), vt('Templates', [20, 700, 100, 20], { color: '#FFFF0000' }), vt('Start', [150, 602, 80, 20])],
    fills: [{ box: px([120, 590, 140, 44]), color: '#FF3366FF', radius: 60, id: 'id/start', window: 0 }] };
  mkdirSync(join(RUNS, 'a-views', 'design'), { recursive: true });
  // the button is drawn in its own colour; no text is drawn, so every text's set colour differs from the screen
  png(join(RUNS, 'a-views', 'screenshots', 'design', '1-10.png'), 1080, 2338, [[[346, 1699, 749, 1826], '#3366ff']]);
  put(join(RUNS, 'a-views', 'screenshots', 'design', '1-10.views.json'), views);
  capture('a-views', '1:10', '1-10', xml, { w: 1080, h: 2338 }, { views: 'screenshots/design/1-10.views.json' });
  const r = design('check', 'a-views');
  assert.equal(r.status, 0, r.out);
  const c = cands('a-views', '1:10'), by = (id: string) => c.find((x: any) => x.id === id);
  assert.equal(by('size:1:11')?.src, 'app', '18 sp against 16 pt');
  assert.deepEqual(by('size:1:11')?.delta, { sp: 18, pt: 16 });
  assert.match(by('size:1:11')?.note, /font scale 1\.1 is not in this/, 'sizes are compared before the phone\'s font scale');
  assert.equal(by('weight:1:13')?.delta?.app, 700);
  assert.equal(by('colour:1:12')?.src, 'app', 'the red text from the app\'s own colour');
  assert.equal(by('lines:1:1c')?.app?.lines, 2);
  assert.equal(by('radius:1:15')?.delta?.figma, 12, 'the button\'s radius: 60 px / 2.88 = 20.8 dp');
  assert.ok(!by('colour:1:15'), 'the same fill colour is not a difference');
  assert.deepEqual(by('radius:1:15')?.app?.box, px([120, 590, 140, 44]), 'a view fill\'s box is in screen pixels like every Android box, not dp');
  assert.ok(by('colour:1:12')?.app?.drawn, 'the colour as drawn is listed beside the value set'); // (no Figma image for this synthetic screen)
  assert.match(by('colour:1:12')?.note, /is not the value set/, 'a set colour the screen does not show is named');
  assert.match(r.out, /set values checked against the screen/);
  assert.ok(!/set #FF3366FF/.test(r.out), 'the button drawn in its set colour is not listed as drawn differently');
  assert.ok(!c.some((x: any) => x.kind === 'size' && x.id !== 'size:1:11'), 'no other size item');
  assert.ok(existsSync(join(RUNS, 'a-views', 'design', 'captures', '1-10.views.json')), 'the view data is shared with the capture');
  const s = read(join(RUNS, 'a-views', 'design', 'compare.json')).screens.find((x: any) => x.id === '1:10');
  assert.deepEqual([s.views.font_scale, s.views.texts], [1.1, 7]);
});

test('check: an Android capture of another state is flagged on arrival', () => {
  const c = cands('r1', '1:20');
  assert.equal(c[0].id, 'state:1:20');
  assert.ok(!c.some((x: any) => x.id === 'missing:1:21'), "the one matching text (You're offline) pairs across pixel bounds");
  // 「Something else entirely」 sits where Figma draws 「Try again」: other words in its place, not missing
  assert.deepEqual(ids(c.filter((x: any) => x.kind === 'missing')), ['missing:1:22', 'missing:1:24', 'missing:1:25']);
  assert.ok(!c.some((x: any) => x.kind === 'extra'));
});

test('check: a half with too few anchors has no fit, and a text\'s own place is never an item', () => {
  // r0: the same Home screen with only one exact text in the top half and that one far off
  put(join(RUNS, 'r0', 'design', '.keep'), '');
  homeShot(join(RUNS, 'r0', 'screenshots', 'design', '1-10.png'));
  capture('r0', '1:10', '1-10', `<A>${st('Create Your Drama', 60, 160, 180, 24)}${st('Start', 165, 602, 45, 20)}${st('Templates', 20, 700, 100, 20)}</A>`, { w: 375, h: 812 });
  assert.equal(design('check', 'r0').status, 0);
  const s = read(join(RUNS, 'r0', 'design', 'compare.json')).screens[0];
  assert.equal(s.fit.top.ok, false);
  assert.ok(!s.candidates.some((x: any) => x.kind === 'position'));
});

// ---- review, decisions, eBugs ----------------------------------------------------------------------------------------
test('settle: agreement stands, a split or an unjudged candidate is a question', () => {
  put(join(RUNS, 'r1', 'design', 'builder.json'), { screens: { '1:10': {
    'truncated:1:1b': { verdict: 'bug', severity: 'major', note: 'title cut short', note_zh: '標題被截斷' },
    'align:1:14': { verdict: 'ok', note: 'within the button' },
    'visual:1': { kind: 'visual', verdict: 'bug', severity: 'cosmetic', figma: { box: [330, 50, 24, 24] }, note: 'icon differs' } } } });
  put(join(RUNS, 'r1', 'design', 'reviewer.json'), { screens: { '1:10': {
    'truncated:1:1b': { verdict: 'bug', note: 'cut', note_zh: '截斷' }, 'align:1:14': { verdict: 'bug', note: '7.5 pt' }, 'visual:1': { verdict: 'bug', note: 'icon' } } } });
  const r = design('settle', 'r1');
  assert.equal(r.status, 0, r.out);
  const f = read(join(RUNS, 'r1', 'design', 'findings.json')).screens;
  assert.deepEqual([f['1:10']['truncated:1:1b'].note, f['1:10']['truncated:1:1b'].note_zh, f['1:10']['truncated:1:1b'].reviewer_zh], ['title cut short', '標題被截斷', '截斷'], 'both languages of both passes are kept');
  assert.equal(f['1:10']['truncated:1:1b'].verdict, 'bug');
  assert.equal(f['1:10']['visual:1'].verdict, 'bug');
  assert.deepEqual(f['1:10']['visual:1'].figma, { box: [330, 50, 24, 24] }, 'a visual item keeps its box for the page');
  assert.equal(f['1:10']['align:1:14'].verdict, 'question');
  assert.equal(f['1:10']['missing:1:1e'].verdict, 'question', 'a candidate neither pass judged is not dropped');
  assert.equal(f['1:20']['state:1:20'].split, 'builder skipped · reviewer skipped');
});

test('decide: the Design tab block is applied, and settle keeps it', () => {
  const block = `DESIGN DECISIONS ${F} ios\nr1 1:10 align:1:14: bug\nr1 1:10 align:1:14: eBug\nr1 1:20 state:1:20: n/a\nr1 1:10 truncated:1:1b: eBug\nnonsense line\n`;
  assert.notEqual(run('design.ts', [F, 'ios', 'decide'], { input: '' }).status, 0, 'no block, no change');
  const ok = run('design.ts', [F, 'ios', 'decide'], { input: block });
  assert.equal(ok.status, 0, ok.out);
  assert.match(ok.out, /skipped: nonsense line/);
  let f = read(join(RUNS, 'r1', 'design', 'findings.json')).screens;
  assert.equal(f['1:10']['align:1:14'].verdict, 'bug'); assert.equal(f['1:10']['align:1:14'].ebug, true);
  assert.equal(f['1:20']['state:1:20'].verdict, 'n/a'); assert.match(f['1:20']['state:1:20'].decided, /^user /);
  assert.equal(design('settle', 'r1').status, 0);
  f = read(join(RUNS, 'r1', 'design', 'findings.json')).screens;
  assert.equal(f['1:10']['align:1:14'].verdict, 'bug', 'settling again keeps the user decision');
  assert.notEqual(run('design.ts', [F, 'ios', 'decide'], { input: 'DESIGN DECISIONS other/feature ios\n' }).status, 0, 'a block for another feature is refused');
  // a bug moved to OK with the user's reason, and an eBug tick taken back (user, 2026-11-04)
  const why = run('design.ts', [F, 'ios', 'decide'], { input: `DESIGN DECISIONS ${F} ios\nr1 1:10 truncated:1:1b: no eBug\nr1 1:20 state:1:20: ok: CMS banner, not fixed copy\n` });
  assert.equal(why.status, 0, why.out);
  f = read(join(RUNS, 'r1', 'design', 'findings.json')).screens;
  assert.equal(f['1:20']['state:1:20'].verdict, 'ok'); assert.equal(f['1:20']['state:1:20'].why, 'CMS banner, not fixed copy');
  assert.equal(f['1:10']['truncated:1:1b'].ebug, undefined);
  run('design.ts', [F, 'ios', 'decide'], { input: `DESIGN DECISIONS ${F} ios\nr1 1:10 truncated:1:1b: eBug\nr1 1:20 state:1:20: n/a\n` });
  assert.equal(read(join(RUNS, 'r1', 'design', 'findings.json')).screens['1:20']['state:1:20'].why, undefined, 'a verdict without a reason clears the old one');
});

test("figmaScreen: another feature's controls are left out with their area, this feature's stay", () => {
  // a shared screen: a header of other features' buttons, a grid with one tile of each, a tab bar of this feature
  const n = (id: string, parent: string, name: string, abs: number[], type = 'FRAME') => ({ id, parent, type, name, abs });
  const nodes = [n('s', 'b', 'Launcher', [0, 0, 375, 812]),
    n('hd', 's', 'header', [0, 44, 375, 48]), n('menu', 'hd', 'ic_menu', [20, 56, 24, 24]), text('hdT', 'hd', 'Try Pro+', [60, 60, 100, 16]),
    n('grid', 's', 'grid', [0, 300, 375, 200]), n('t1', 'grid', 'tile', [16, 300, 80, 96]), n('i1', 't1', 'ic_other', [40, 300, 28, 28]), text('l1', 't1', 'Video Enhance', [16, 340, 80, 16]),
    n('t2', 'grid', 'tile', [100, 300, 80, 96]), n('i2', 't2', 'ic_mine', [124, 300, 28, 28]), text('l2', 't2', 'AI Mini Drama', [100, 340, 80, 16]),
    n('tab', 's', 'tabs', [0, 730, 375, 56]), text('home', 'tab', 'Home', [8, 758, 68, 12])];
  const ctl = (node: string, name: string, box: number[]) => ({ node, name, box: box as any });
  const r = figmaScreen(nodes, { id: 's', abs: [0, 0, 375, 812] }, new Set(), {
    other: [ctl('menu', 'ic_menu', [20, 56, 24, 24]), ctl('i1', 'ic_other', [40, 300, 28, 28])],
    // this feature's tile added by hand: a box, no node
    mine: [ctl('', 'manual/button', [124, 300, 28, 28]), ctl('home', 'Home', [8, 730, 68, 40])] });
  assert.deepEqual(r.texts.map((t: any) => t.text).sort(), ['AI Mini Drama', 'Home']);
  assert.deepEqual(r.out.map(o => o.node).sort(), ['hd', 't1'], 'the header and the other tile, not the grid holding this feature\'s tile');
  assert.deepEqual(r.outTexts.sort(), ['Try Pro+', 'Video Enhance']);
});

test('ebugs: the ticked bugs with their row, Figma link and sheet', () => {
  const r = design('ebugs', 'r1');
  assert.equal(r.status, 0, r.out);
  const md = readFileSync(join(RUNS, 'r1', 'design', 'ebug-findings.md'), 'utf8');
  assert.match(md, /2 bug\(s\)|## 2\./);
  assert.match(md, /Home — truncated \(major\)/);
  assert.match(md, /Reached by: TC-001 — Precondition: Signed in; Action: Tap Start/);
  assert.match(md, /https:\/\/www\.figma\.com\/design\/KEY123\?node-id=1-10/);
  assert.match(md, /Image: screenshots\/design\/1-10-sheet\.png/);
  assert.match(md, /Build 15\.2\.0 \(190001\)/);
  assert.ok(!/visual/.test(md.split('## ').slice(1).map(b => b.split('\n')[0]).join()), 'an unticked bug is not listed');
  assert.match(design('ebugs', 'r1', '--all').out, /3 bug\(s\)$/m);
});

test('check --recheck: earlier bugs fixed, still there, or to look at again', () => {
  put(join(RUNS, 'r2', 'design', '.keep'), '');
  homeShot(join(RUNS, 'r2', 'screenshots', 'design', '1-10.png'));
  capture('r2', '1:10', '1-10', iosHome('Recently created dramas'), { w: 375, h: 812 });
  const r = design('check', 'r2', '--recheck', 'r1', '--build', '15.3.0 (190100)');
  assert.equal(r.status, 0, r.out);
  const s = read(join(RUNS, 'r2', 'design', 'compare.json')).screens[0];
  const now = Object.fromEntries(s.recheck.items.map((i: any) => [i.id, i.now]));
  assert.deepEqual(now, { 'truncated:1:1b': 'fixed', 'visual:1': 'check', 'align:1:14': 'still' });
  assert.equal(s.build, '15.3.0 (190100)');
});

test('shared captures: another computer checks and shows the run from the committed copies', () => {
  const shared = join(RUNS, 'r2', 'design', 'captures');
  assert.ok(existsSync(join(shared, '1-10.webp')) && existsSync(join(shared, '1-10.xml')), 'check wrote the compact copies');
  const before = read(join(RUNS, 'r2', 'design', 'compare.json')).screens[0].candidates.map((c: any) => c.id).sort();
  // the phone's files are gone (a computer that pulled the repo)
  rmSync(join(RUNS, 'r2', 'screenshots'), { recursive: true, force: true });
  const r = design('check', 'r2', '--recheck', 'r1');
  assert.equal(r.status, 0, r.out);
  const after = read(join(RUNS, 'r2', 'design', 'compare.json')).screens[0].candidates.map((c: any) => c.id).sort();
  assert.deepEqual(after, before, 'the same differences from the 750 px copy');
  assert.ok(existsSync(join(RUNS, 'r2', 'screenshots', 'design', '1-10-sheet.png')), 'the sheet is drawn again');
  const out = join(tmpdir(), `design-test-shared-${process.pid}.html`);
  assert.equal(run('design-page.ts', [F, 'ios', '--out', out]).status, 0);
  assert.match(readFileSync(out, 'utf8'), /design\/captures\/1-10\.webp/);
  rmSync(out);
});

test('status: names the next step as the check moves on', () => {
  assert.match(design('status', 'r2').out, /next: the two review passes/);
  assert.match(design('status', 'r1').out, /settled: 3 bugs \(2 ticked for eBugs\), \d+ open questions[\s\S]*next: the user answers the questions/);
  // the user answers every open question OK: then the ticked bugs are next
  const f = read(join(RUNS, 'r1', 'design', 'findings.json')).screens;
  const open = Object.entries<any>(f).flatMap(([scr, v]) => Object.entries<any>(v).filter(([, x]) => x.verdict === 'question').map(([id]) => `r1 ${scr} ${id}: ok`));
  assert.equal(run('design.ts', [F, 'ios', 'decide'], { input: `DESIGN DECISIONS ${F} ios\n${open.join('\n')}\n` }).status, 0);
  rmSync(join(RUNS, 'r1', 'design', 'ebug-findings.md'));
  assert.match(design('status', 'r1').out, /0 open questions[\s\S]*next: design\.ts … ebugs r1/);
  assert.match(design('status').out, /Design check of r2/, 'without a run: the newest run with captures');
});

// ---- the Design tab --------------------------------------------------------------------------------------------------
test('page: statuses, the newest capture per screen, and the app image', () => {
  const out = join(tmpdir(), `design-test-${process.pid}.html`);
  const r = run('design-page.ts', [F, 'ios', '--out', out]);
  assert.equal(r.status, 0, r.out);
  const data = JSON.parse(readFileSync(out, 'utf8').match(/(?:const|let) D = (\{.*\});\n/)![1]);
  const by = (id: string) => data.screens.find((s: any) => s.id === id);
  assert.equal(by('1:10').run, 'r2', 'the newest run that captured it');
  assert.equal(by('1:10').status, 'unreviewed');
  assert.equal(by('1:10').recheck.items.length, 3);
  assert.equal(by('1:20').status, 'matches', 'r1: the user called the state n/a and every other item OK');
  assert.equal(by('1:30').status, 'excluded');
  assert.ok(by('1:10').app?.endsWith('design/captures/1-10.webp'), 'r2\'s phone files are gone: the committed copy');
  assert.equal(data.file, 'KEY123');
  // the Plan view: the review mark, the skip list with its reason, and each screen's flags and board id
  assert.ok(data.review?.at); assert.deepEqual(data.review.fresh, []);
  assert.deepEqual(data.skip, ['1:30']); assert.equal(data.reasons['1:30'], 'superseded');
  assert.deepEqual(by('1:40').flags, ['variant', 'gap']); assert.equal(by('1:40').board_id, '1:1');
  rmSync(out);
});

// ---- automatic captures during a casebook run (lib/design-watch.ts) -------------------------------------------------
test('watch: `case` arms the row\'s screens, a matching page source is captured, leftovers are named', async () => {
  const { armWatch, watchSource } = await import('../lib/design-watch.ts');
  const dir = join(RUNS, 'r9'); mkdirSync(dir, { recursive: true });
  const shot = async () => Buffer.from('png'), win = async () => ({ width: 375, height: 812 });
  writeFileSync(join(dir, '.case'), 'TC-001');
  assert.match(armWatch(dir, 'TC-001').join('\n'), /watching 1 screen\(s\) of TC-001/);
  assert.equal(await watchSource(dir, androidOffline, shot, win), undefined, 'another screen with too few of its texts: nothing');
  assert.equal(await watchSource(dir, `<A>${st('Create Your Drama', 20, 110, 180, 24)}${st('Templates', 20, 700, 100, 20)}</A>`, shot, win), undefined, 'two texts of nine: nothing');
  assert.match(await watchSource(dir, iosHome('Choose a template'), shot, win) ?? '', /captured 1:10 Home automatically \(7\/10 texts\)/);
  assert.equal(await watchSource(dir, iosHome('Choose a template'), shot, win), undefined, 'captured once');
  const caps = readFileSync(join(dir, 'design', 'captures.jsonl'), 'utf8').trim().split('\n').map(l => JSON.parse(l));
  assert.deepEqual(caps.map(c => [c.screen, c.case, c.auto, c.match]), [['1:10', 'TC-001', true, '7/10']]);
  assert.ok(existsSync(join(dir, 'screenshots', 'design', '1-10.xml')));
  // the next row: nothing left of TC-001; leaving TC-002 without its screen names it
  assert.doesNotMatch(armWatch(dir, 'TC-002').join('\n'), /passed without/);
  assert.match(armWatch(dir, null).join('\n'), /TC-002 passed without 1:20 Error_offline/);
  assert.ok(!existsSync(join(dir, '.design-watch.json')), '`case -` disarms the watch');
  // a design pass after the run walks only what it left
  const left = design('screens', '--left', 'r9');
  assert.match(left.out, /1 screen\(s\) already captured in r9/); assert.doesNotMatch(left.out, /^1:10 /m); assert.match(left.out, /^1:20 /m);
  // the Design tab counts its captures and design work (no transcripts name r9 here, so no tokens)
  assert.equal(design('status', 'r9').status, 0);
  assert.ok(readFileSync(join(dir, 'design', 'activity.log'), 'utf8').includes(' status'), 'design.ts logs its work on the run');
  const out = join(tmpdir(), `design-usage-${process.pid}.html`);
  assert.equal(run('design-page.ts', [F, 'ios', '--out', out]).status, 0);
  const u = JSON.parse(readFileSync(out, 'utf8').match(/(?:const|let) D = (\{.*\});\n/)![1]).usage, r9 = u.runs.find((r: any) => r.id === 'r9');
  assert.deepEqual([r9.kind, r9.auto, r9.hand, r9.run], ['pass', 1, 0, null]);
  assert.equal(r9.design.tokens.messages, 0);
  rmSync(out); rmSync(dir, { recursive: true, force: true });
});

// a plain 8-bit RGB PNG of one colour (rows filtered Sub, then Paeth, so both unfilters are exercised)
const pngOf = async (rgb: [number, number, number], w = 40, h = 40) => {
  const { deflateSync } = await import('node:zlib');
  const chunk = (kind: string, data: Buffer) => { const b = Buffer.alloc(12 + data.length); b.writeUInt32BE(data.length, 0); b.write(kind, 4, 'latin1'); data.copy(b, 8); return b; };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2;
  const rows = Array.from({ length: h }, (_, y) => {
    const r = Buffer.alloc(1 + w * 3); r[0] = y % 2 ? 4 : 1;
    // Sub: the first pixel raw, the rest 0; Paeth on a uniform image predicts the left (or upper) pixel, so also 0
    if (y % 2 === 0) r.set(rgb, 1);
    return r;
  });
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(Buffer.concat(rows))), chunk('IEND', Buffer.alloc(0))]);
};

test('watch: a dark or light screenshot is told apart, and so is a frame by its background', async () => {
  const { darkShot, darkFill } = await import('../lib/design-watch.ts');
  assert.equal(darkShot(await pngOf([12, 12, 12])), true);
  assert.equal(darkShot(await pngOf([249, 251, 255])), false);
  assert.equal(darkShot(Buffer.from('png')), null, 'not a PNG: unknown, never filtered');
  assert.equal(darkFill({ fills: [{ type: 'SOLID', color: '#0c0c0cff' }] }), true);
  assert.equal(darkFill({ fills: [{ type: 'SOLID', color: '#f9fbffff' }] }), false);
  assert.equal(darkFill({ fills: [{ type: 'SOLID', color: '#808080ff' }] }), null, 'mid grey: unclear');
  assert.equal(darkFill({}), null);
});

test('watch: never saves over a hand capture, and takes only the frame drawn in the phone\'s appearance', async () => {
  const { armWatch, saveCapture, watchSource } = await import('../lib/design-watch.ts');
  const dir = join(RUNS, 'r8'); mkdirSync(dir, { recursive: true });
  const win = async () => ({ width: 375, height: 812 }), light = await pngOf([249, 251, 255]), dark = await pngOf([12, 12, 12]);
  const lines = () => readFileSync(join(dir, 'design', 'captures.jsonl'), 'utf8').trim().split('\n').map(l => JSON.parse(l));
  writeFileSync(join(dir, '.case'), 'TC-001');
  // a hand capture taken after `case` armed the watch: the next matching source leaves it alone
  armWatch(dir, 'TC-001');
  saveCapture(dir, '1:10', { png: dark, xml: iosHome('Choose a template'), win: await win(), note: 'by hand' });
  assert.equal(await watchSource(dir, iosHome('Choose a template'), async () => light, win), undefined);
  assert.deepEqual(lines().map(c => [c.screen, c.note, !!c.auto]), [['1:10', 'by hand', false]]);
  assert.equal(readFileSync(join(dir, 'screenshots', 'design', '1-10.png')).compare(dark), 0, 'the hand capture\'s image is kept');
  assert.ok(!JSON.parse(readFileSync(join(dir, '.design-watch.json'), 'utf8')).screens['1:10'], 'and the screen left the watch');
  // a frame drawn dark: a light screenshot is not taken for it, a dark one is
  rmSync(join(dir, 'design'), { recursive: true }); rmSync(join(dir, 'screenshots'), { recursive: true });
  armWatch(dir, 'TC-001');
  const wf = join(dir, '.design-watch.json'), w = JSON.parse(readFileSync(wf, 'utf8'));
  w.screens['1:10'].dark = true; writeFileSync(wf, JSON.stringify(w));
  assert.equal(await watchSource(dir, iosHome('Choose a template'), async () => light, win), undefined, 'light phone, dark frame: nothing');
  assert.ok(!existsSync(join(dir, 'design', 'captures.jsonl')));
  assert.match(await watchSource(dir, iosHome('Choose a template'), async () => dark, win) ?? '', /captured 1:10 Home automatically/);
  rmSync(dir, { recursive: true, force: true });
});

// ---- figma-source receipts -------------------------------------------------------------------------------------------
test('figma-source: scope.json records the list, boards read and ids not found', () => {
  const resp = join(EX, 'figma-source', 'design', 'responses');
  put(join(resp, 'list.json'), JSON.stringify({ mode: 'list', page: ['0:1', 'UI'], root: ['0:1', 'UI', 'PAGE'], sections: [['5:1', 'GM', 'SECTION', 0, 0, 1, 1, 0, 1, [['1:1', 'Board', 'FRAME', 0, 0, 1, 1, 0, 1]]]], nodes: [] }));
  put(join(resp, 'plan-1-1.json'), JSON.stringify({ mode: 'plan', page: ['0:1', 'UI'], read_at: '2026-01-01T00:00:00Z', boards: [{ id: '1:1', name: 'Board', hash: 'abc', box: [0, 0, 1200, 812] }], chunks: [], missing: ['9:9'] }));
  run('figma-source.ts', [F, 'merge', 'design']);
  const sc = read(join(EX, 'figma-source', 'design', 'scope.json'));
  assert.deepEqual(sc.page, ['0:1', 'UI']);
  assert.deepEqual(sc.listed.map((x: any) => x[0]), ['5:1', '1:1']);
  assert.equal(sc.read[0].id, '1:1');
  assert.deepEqual(sc.missing, [{ id: '9:9', plan: 'plan-1-1.json', error: 'node not found' }]);
});

test('source gaps: a Design board the casebook inventories but the read lacks stops the check until read or excluded', () => {
  writeOut(); rmSync(join(OUT, 'summary.json'), { force: true });
  const inv = join(EX, 'figma-inventory-d9.json');
  put(inv, { file: 'KEY123', group: 'd9', boards: [['1:1', 'Board', 0, 0, 1200, 1712], ['3:1', '1016_New board', 0, 2000, 800, 812]] });
  put(join(EX, 'figma-inventory-pm.json'), { file: 'PMKEY', group: 'pm', boards: [['8:1', 'PM board', 0, 0, 1, 1]] });
  const st = design('status');
  assert.match(st.out, /source read not complete: board 3:1 「1016_New board」 is not in the Design source read/);
  assert.match(st.out, /next: read 3:1 /);
  assert.doesNotMatch(st.out, /8:1/, 'a PM board is not a Design source gap');
  assert.match(design('plan').out, /SOURCE READ NOT COMPLETE/);
  // excluded on the Plan view: no longer a gap
  design('plan', '--skip', '3:1', '--skip-reason', 'superseded');
  assert.doesNotMatch(design('status').out, /source read not complete/);
  const pp = join(T, 'design', 'plan.json'), pl = read(pp); pl.skip = []; pl.skip_reasons = {}; put(pp, pl);
  // read: its board file is merged, so the gap closes
  put(join(OUT, '3-1.json'), { board: { id: '3:1', name: '1016_New board', box: [0, 2000, 800, 812] }, nodes: [] });
  assert.doesNotMatch(design('status').out, /source read not complete/);
  rmSync(join(OUT, '3-1.json')); rmSync(inv); rmSync(join(EX, 'figma-inventory-pm.json'));
  // a board merge left incomplete is a gap too
  put(join(OUT, 'summary.json'), { boards: [], incomplete: [{ board: '1:1', name: 'Board', missing: ['chunk-1-1_40'], changed_since_plan: [] }] });
  assert.match(design('status').out, /board 1:1 「Board」 read incompletely \(chunk-1-1_40\)/);
  rmSync(join(OUT, 'summary.json'));
});

test('source gaps: a region board is read once every board inside its box merged', () => {
  writeOut(); rmSync(join(OUT, 'summary.json'), { force: true });
  const inv = join(EX, 'figma-inventory-dr.json');
  put(inv, { file: 'KEY123', group: 'dr', boards: [['0:1/region-a', 'region-a', -10, -10, 2000, 2000], ['0:1/region-b', 'region-b', 5000, 0, 500, 500]] });
  put(join(OUT, '7-7.json'), { board: { id: '7:7', name: 'Inside', box: [0, 0, 375, 812] }, nodes: [] });
  put(join(OUT, 'summary.json'), { boards: [{ id: '7:7', name: 'Inside' }], incomplete: [] });
  const st = design('status').out;
  assert.doesNotMatch(st, /region-a/, 'every board inside region-a merged');
  assert.match(st, /board 0:1\/region-b 「region-b」 is not in the Design source read/, 'nothing merged inside region-b');
  // an incomplete board inside keeps the region unread
  put(join(OUT, 'summary.json'), { boards: [{ id: '7:7', name: 'Inside' }], incomplete: [{ board: '8:8', name: 'Half', missing: ['chunk-8-8_0'], box: [400, 0, 375, 812] }] });
  assert.match(design('status').out, /board 0:1\/region-a 「region-a」 is not in the Design source read/);
  rmSync(inv); rmSync(join(OUT, '7-7.json')); rmSync(join(OUT, 'summary.json'));
  writeOut();
});

test('figma-source merge: an incomplete board leaves no stale board file, and a casebook board not planned is named', () => {
  writeOut();
  const resp = join(EX, 'figma-source', 'design', 'responses');
  rmSync(resp, { recursive: true, force: true });
  put(join(resp, 'plan-1-1.json'), JSON.stringify({ mode: 'plan', read_at: '2026-01-01T00:00:00Z', boards: [{ id: '1:1', name: 'Board', hash: 'abc', box: [0, 0, 1200, 1712], nodes: 80 }], chunks: [['1:1', 0, 80, 0, '1:1', '1:99']], missing: [] }));
  put(join(EX, 'figma-inventory-d9.json'), { file: 'KEY123', boards: [['1:1', 'Board'], ['3:1', '1016_New board']] });
  const r = run('figma-source.ts', [F, 'merge', 'design']);
  assert.equal(r.status, 10);
  assert.match(r.out, /INCOMPLETE 1:1 Board: missing chunk-1-1_0/);
  assert.match(r.out, /NOT READ 3:1 1016_New board/);
  assert.ok(!existsSync(join(OUT, '1-1.json')), 'the earlier merge\'s file for the incomplete board is gone');
  assert.match(design('status').out, /source read not complete: board 3:1 [^\n]*; board 1:1 「Board」 read incompletely/);
  rmSync(join(EX, 'figma-inventory-d9.json')); rmSync(resp, { recursive: true, force: true }); rmSync(join(OUT, 'summary.json'), { force: true });
  writeOut();
});

test('figma-source merge: a later plan finding a board unchanged keeps its chunks', () => {
  const resp = join(EX, 'figma-source', 'design', 'responses');
  rmSync(resp, { recursive: true, force: true });
  const node = (i: string, p: number) => ({ i, t: 'FRAME', n: 'F', b: [0, 0, 375, 812], p });
  const tables = { V: [], S: [], P: [] };
  // z-named first plan, a-named re-check: order is by read time, not file name
  put(join(resp, 'plan-z.json'), JSON.stringify({ mode: 'plan', read_at: '2026-01-01T00:00:00Z', boards: [{ id: '7:1', name: 'B7', hash: 'h1', box: [0, 0, 375, 812], nodes: 2 }], chunks: [['7:1', 0, 2, 0, '7:1', '7:2']], missing: [] }));
  put(join(resp, 'chunk-7-1_0.json'), JSON.stringify({ mode: 'chunk', board: '7:1', read_at: '2026-01-01T00:01:00Z', from: 0, to: 2, first: 0, count: 2, bytes: 10, tables, nodes: [node('7:1', -1), node('7:2', 0)] }));
  put(join(resp, 'hidden-7-1_0.json'), JSON.stringify({ mode: 'hidden', board: '7:1', read_at: '2026-01-01T00:02:00Z', from: 0, count: 2, next: null, nodes: [] }));
  put(join(resp, 'plan-a.json'), JSON.stringify({ mode: 'plan', read_at: '2026-02-01T00:00:00Z', boards: [{ id: '7:1', name: 'B7', hash: 'h1', box: [0, 0, 375, 812], nodes: 2 }], chunks: [['7:1', 0, 2, 0, '7:1', '7:2']], missing: [] }));
  const r = run('figma-source.ts', [F, 'merge', 'design']);
  assert.doesNotMatch(r.out, /INCOMPLETE/, r.out);
  const sc = read(join(EX, 'figma-source', 'design', 'scope.json')).read[0];
  assert.equal(sc.plan, 'plan-z.json'); assert.equal(sc.checked_at, '2026-02-01T00:00:00Z');
  // a changed fingerprint needs its chunks again
  put(join(resp, 'plan-b.json'), JSON.stringify({ mode: 'plan', read_at: '2026-03-01T00:00:00Z', boards: [{ id: '7:1', name: 'B7', hash: 'h2', box: [0, 0, 375, 812], nodes: 2 }], chunks: [['7:1', 0, 2, 0, '7:1', '7:2']], missing: [] }));
  assert.match(run('figma-source.ts', [F, 'merge', 'design']).out, /INCOMPLETE 7:1 B7: missing chunk-7-1_0/);
  rmSync(resp, { recursive: true, force: true }); rmSync(join(OUT, 'summary.json'), { force: true }); rmSync(join(OUT, '7-1.json'), { force: true });
  rmSync(join(EX, 'figma-source', 'design', 'hashes.json'), { force: true });
  writeOut();
});

test('status without any run makes no runs/design folder', () => {
  const tmp = join(RUNS, '..', 'runs-hold');
  rmSync(tmp, { recursive: true, force: true });
  spawnSync('mv', [RUNS, tmp]); mkdirSync(RUNS);
  design('status');
  assert.ok(!existsSync(join(RUNS, 'design')));
  rmSync(RUNS, { recursive: true, force: true }); spawnSync('mv', [tmp, RUNS]);
});

test('figma-source: board images live in the shared folder, are size-checked and reused', () => {
  writeOut();
  const calls = join(EX, 'figma-source', 'design', 'calls'), shared = join(EX, 'figma');
  put(join(calls, 'todo.json'), { screenshots: [{ nodeId: '1:1', maxDimension: 1712, fingerprint: 'abc', save_to: 'library/zztest/design-fixture/specs/2026-01-01/extracted/figma/board.png' },
    { nodeId: '2:1', maxDimension: 812, fingerprint: 'def', save_to: 'library/zztest/design-fixture/specs/2026-01-01/extracted/figma/other.png' }] });
  png(join(shared, 'board.png'), 600, 856, []);
  png(join(shared, 'other.png'), 375, 812, []);
  const bad = run('figma-source.ts', [F, 'crop', 'design']);
  assert.match(bad.out, /not cropped: 1:1 \(screenshot is not the size asked for/);
  png(join(shared, 'board.png'), 1200, 1712, []);
  const good = run('figma-source.ts', [F, 'crop', 'design']);
  assert.match(good.out, /from 2 board screenshot\(s\)/);
  assert.match(good.out, /board image\(s\) added to .*extracted\/figma/);
  assert.ok(existsSync(join(OUT, 'crops', '1-1', '1-10.png')));
  const shots = read(join(shared, 'shots.json'));
  assert.equal(shots['board.png'].board, '1:1'); assert.equal(shots['board.png'].source_hash, 'abc');
  // the next read of an unchanged board takes no screenshot: the shared image is current for its fingerprint
  rmSync(join(EX, 'figma-source', 'design', 'hashes.json'), { force: true });
  const plan = join(EX, 'figma-source', 'design', 'responses', 'plan-1-1.json');
  put(plan, JSON.stringify({ mode: 'plan', page: ['0:1', 'UI'], read_at: '2026-01-02T00:00:00Z', boards: [{ id: '1:1', name: 'Board', hash: 'abc', box: [0, 0, 1200, 1712] }], chunks: [], missing: [] }));
  const ch = run('figma-source.ts', [F, 'calls', 'chunks', 'design']);
  assert.match(ch.out, /0 screenshot\(s\).*1 board image\(s\) already current/s);
  // a board the casebook captured (no source_hash) is current while its hash matches figma-hashes.json
  put(join(shared, 'shots.json'), { 'board.png': { board: '1:1', group: 'd1', hash: 'cb1', captured_at: '2026-01-01T00:00:00Z' } });
  put(join(EX, 'figma-hashes.json'), { boards: { '1:1': { hash: 'cb1' } }, files: {} });
  assert.match(run('figma-source.ts', [F, 'calls', 'chunks', 'design']).out, /already current/);
  put(join(EX, 'figma-hashes.json'), { boards: { '1:1': { hash: 'cb2' } }, files: {} });
  assert.match(run('figma-source.ts', [F, 'calls', 'chunks', 'design']).out, /1 screenshot\(s\)/);
  assert.equal(read(join(calls, 'todo.json')).screenshots[0].save_to, 'library/zztest/design-fixture/specs/2026-01-01/extracted/figma/board.png', 'saved over the shared image');
  // a board this read saw under another fingerprint changed since: the casebook's image is not trusted, even if its
  // own (older) check still matches
  put(join(EX, 'figma-hashes.json'), { boards: { '1:1': { hash: 'cb1' } }, files: {} });
  put(join(EX, 'figma-source', 'design', 'hashes.json'), { '1:1': { hash: 'old', read_at: '2026-01-01T00:00:00Z', name: 'Board', nodes: 1 } });
  assert.match(run('figma-source.ts', [F, 'calls', 'chunks', 'design']).out, /1 screenshot\(s\)/);
  rmSync(join(EX, 'figma-source', 'design', 'hashes.json'));
});

test('figma-source chunks: small boards share batch calls, instance-free boards need no hidden call, twins get their own image, a covering image is reused', () => {
  const src = join(EX, 'figma-source', 'design'), resp = join(src, 'responses'), calls = join(src, 'calls'), shared = join(EX, 'figma');
  rmSync(resp, { recursive: true, force: true }); rmSync(join(src, 'hashes.json'), { force: true });
  const shotsBefore = existsSync(join(shared, 'shots.json')) ? readFileSync(join(shared, 'shots.json'), 'utf8') : null;
  const hashesBefore = existsSync(join(EX, 'figma-hashes.json')) ? readFileSync(join(EX, 'figma-hashes.json'), 'utf8') : null;
  put(join(resp, 'list.json'), JSON.stringify({ mode: 'list', page: ['0:1', 'UI'], root: ['0:1', 'UI', 'PAGE'], sections: [],
    nodes: [['4:1', 'label a', 'TEXT', 0, 900, 100, 20, 0, 1], ['4:2', 'label b', 'TEXT', 0, 950, 100, 20, 0, 1], ['5:1', 'Same', 'FRAME', 0, 0, 375, 812, 0, 1], ['5:2', 'Same', 'FRAME', 400, 0, 375, 812, 3, 1]] }));
  put(join(resp, 'plan-0-1.json'), JSON.stringify({ mode: 'plan', page: ['0:1', 'UI'], read_at: '2026-01-03T00:00:00Z', missing: [],
    boards: [{ id: '4:1', name: 'label a', type: 'TEXT', hash: 'a', box: [0, 900, 100, 20], nodes: 1 }, { id: '4:2', name: 'label b', type: 'TEXT', hash: 'b', box: [0, 950, 100, 20], nodes: 1 },
      { id: '5:1', name: 'Same', type: 'FRAME', hash: 'c', box: [0, 0, 375, 812], nodes: 40 }, { id: '5:2', name: 'Same', type: 'FRAME', hash: 'd', box: [400, 0, 375, 812], nodes: 40 }],
    chunks: [['4:1', 0, 1, 300, '4:1', '4:1'], ['4:2', 0, 1, 300, '4:2', '4:2'], ['5:1', 0, 40, 30000, '5:1', '5:9'], ['5:2', 0, 40, 30000, '5:2', '5:9']] }));
  put(join(shared, 'shots.json'), { 'region.png': { board: '0:1/r', group: 'd', hash: 'rh', box: [0, 0, 800, 812], captured_at: '2026-01-01T00:00:00Z' } });
  png(join(shared, 'region.png'), 800, 812, []);
  put(join(EX, 'figma-hashes.json'), { boards: { '0:1/r': { hash: 'rh' } }, files: {} });
  const r = run('figma-source.ts', [F, 'calls', 'chunks', 'design']);
  const todo = read(join(calls, 'todo.json')), names = todo.chunk_calls.map((c: any) => c.call.split('/').pop());
  assert.ok(names.includes('chunk-batch-1.js'), r.out); assert.ok(!names.some((n: string) => /chunk-4-/.test(n)), 'labels go in the batch');
  assert.deepEqual(names.filter((n: string) => n.startsWith('hidden-')), ['hidden-5-2_0.js'], 'only the board with instances needs a hidden call');
  assert.match(readFileSync(join(calls, 'chunk-batch-1.js'), 'utf8'), /\[\["4:1",0,1,"4:1","4:1"\],\["4:2",0,1,"4:2","4:2"\]\]/);
  assert.deepEqual(todo.covered_shots, ['5:1', '5:2']);
  assert.deepEqual(todo.screenshots.map((x: any) => x.nodeId), ['4:1', '4:2']);
  // the region image no longer current: the two frames named alike are taken into two files
  put(join(EX, 'figma-hashes.json'), { boards: { '0:1/r': { hash: 'new' } }, files: {} });
  run('figma-source.ts', [F, 'calls', 'chunks', 'design']);
  const saves = read(join(calls, 'todo.json')).screenshots.filter((x: any) => x.nodeId.startsWith('5:')).map((x: any) => x.save_to.split('/').pop());
  assert.deepEqual(saves, ['same.png', 'same-5-2.png']);
  // a batch return is read as its boards' chunks
  const node = (i: string, p: number) => ({ i, t: 'TEXT', n: 'L', b: [0, 0, 100, 20], p });
  const part = (id: string) => ({ mode: 'chunk', board: id, read_at: '2026-01-03T00:01:00Z', from: 0, to: 1, first: 0, count: 1, bytes: 10, tables: { V: [], S: [], P: [] }, nodes: [node(id, -1)] });
  put(join(resp, 'chunk-batch-1.json'), JSON.stringify({ mode: 'batch', parts: [part('4:1'), part('4:2')] }));
  const m = run('figma-source.ts', [F, 'merge', 'design']);
  assert.doesNotMatch(m.out, /INCOMPLETE 4:/, m.out);
  assert.ok(existsSync(join(OUT, '4-1.json')) && existsSync(join(OUT, '4-2.json')));
  rmSync(resp, { recursive: true, force: true }); rmSync(calls, { recursive: true, force: true }); rmSync(join(src, 'hashes.json'), { force: true });
  rmSync(join(shared, 'region.png'), { force: true });
  for (const [f, v] of [[join(shared, 'shots.json'), shotsBefore], [join(EX, 'figma-hashes.json'), hashesBefore]] as const) v === null ? rmSync(f, { force: true }) : writeFileSync(f, v);
  for (const f of ['4-1', '4-2']) { rmSync(join(OUT, `${f}.json`), { force: true }); rmSync(join(OUT, `${f}.metadata.xml`), { force: true }); }
  rmSync(join(OUT, 'summary.json'), { force: true });
  writeOut();
});

test('figma-source: save refuses a return older than its call', () => {
  const calls = join(EX, 'figma-source', 'design', 'calls'), home = join(tmpdir(), `design-test-home-${process.pid}`);
  put(join(calls, 'plan-9-9.js'), '// call');
  const proj = join(home, '.claude', 'projects', ROOT.replace(/[^A-Za-z0-9]/g, '-'));
  const ret = JSON.stringify({ mode: 'plan', boards: [], chunks: [], missing: [] });
  const transcript = (at: string) => [
    { timestamp: at, message: { content: [{ type: 'tool_use', id: 'u1', name: 'mcp__figma-design__use_figma', input: { description: 'casebook figma-source design plan-9-9' } }] } },
    { timestamp: at, message: { content: [{ type: 'tool_result', tool_use_id: 'u1', content: [{ type: 'text', text: ret }] }] } },
  ].map(x => JSON.stringify(x)).join('\n') + '\n';
  put(join(proj, 's.jsonl'), transcript(new Date(Date.now() - 3600_000).toISOString()));
  const stale = run('figma-source.ts', [F, 'save', 'design', 'plan-9-9'], { env: { HOME: home } });
  assert.match(stale.out, /stale: plan-9-9/);
  put(join(proj, 's.jsonl'), transcript(new Date(Date.now() + 1000).toISOString()));
  const fresh = run('figma-source.ts', [F, 'save', 'design', 'plan-9-9'], { env: { HOME: home } });
  assert.match(fresh.out, /saved .*plan-9-9\.json/);
  rmSync(home, { recursive: true, force: true });
});

test("appElements: Android layers by drawing order, icon names, other windows", () => {
  const P = 'com.cyberlink.pdr', v = (cls: string, at: string, b: string, kids = '') => `<${cls} class="${cls}" package="${P}" ${at} displayed="true" bounds="${b}"${kids ? `>${kids}</${cls}>` : '/>'}`;
  const page = (sheet: string) => `<?xml version='1.0' encoding='UTF-8' standalone='yes' ?><hierarchy rotation="0">` +
    v('android.widget.FrameLayout', 'drawing-order="1"', '[0,0][1080,2400]',
      v('android.view.ViewGroup', 'resource-id="chat" drawing-order="5"', '[0,0][1080,2000]',
        v('android.widget.TextView', 'text="Behind" drawing-order="1"', '[40,500][600,560]') +
        v('android.view.View', 'resource-id="scrim" drawing-order="2"', '[0,0][1080,300]') +
        v('android.widget.TextView', 'text="Under scrim" drawing-order="1"', '[40,100][600,160]') +
        v('android.widget.ImageButton', 'content-desc="Record voice" drawing-order="3"', '[900,1900][990,1990]')) +
      sheet) + '</hierarchy>';
  const sheet = (inside: string) => v('android.widget.FrameLayout', 'resource-id="sheet" drawing-order="8"', '[0,88][1080,2265]', inside);
  // a sheet with content drawn after the chat covers it, gaps between its rows included
  let els = appElements(page(sheet(v('android.widget.TextView', 'text="Choose Character" drawing-order="1"', '[100,100][900,200]'))));
  const at = (t: string) => els.find(e => e.text === t)!;
  assert.equal(at('Behind').covered, true, 'under the sheet');
  assert.equal(at('Choose Character').covered, false);
  assert.equal(at('Record voice').name, true, "an icon's accessibility name is not drawn text");
  // an empty frame drawn last draws nothing; a plain View (scrim) is see-through
  els = appElements(page(sheet('')));
  assert.equal(at('Behind').covered, false, 'an empty layout covers nothing');
  assert.equal(at('Under scrim').covered, false, 'a scrim is see-through');
  // the keyboard's window (enableMultiWindows): its keys are not app texts, and it says the keyboard is up
  const kb = page('').replace('</hierarchy>', '<android.widget.FrameLayout class="android.widget.FrameLayout" package="com.samsung.android.honeyboard" window-id="9" displayed="true" bounds="[0,1500][1080,2400]"><android.widget.TextView class="android.widget.TextView" package="com.samsung.android.honeyboard" text="Q" displayed="true" bounds="[0,1600][100,1700]"/></android.widget.FrameLayout></hierarchy>');
  assert.equal(keyboardInSource(kb), true);
  assert.ok(!appElements(kb).some(e => e.text === 'Q'), "the keyboard's keys are left out");
  assert.equal(keyboardInSource(page('')), null, 'one window: not known');
});
