// Has the Figma changed since it was read? One small use_figma call per Figma file instead of re-reading every board
// group (Figma MCP has a small quota; user, 2026-10-29). Board fingerprints come from scripts/figma/inventory.js:
// every group read records one hash per board, and the check call returns the current hash of every board the saved
// groups cover, plus the boards on the page that no group covers yet.
// Usage: node scripts/figma-check.ts <product>/<feature> [<spec-set folder>] [command]
//   (none)            writes extracted/figma-check/<role>.js, one check call per Figma file (role = design / pm / mx
//                     from figma-frames.json), and prints which MCP server runs each; the agent passes the file as
//                     `code` to use_figma (read-only) with the description it prints; --save copies the replies
//   --compare         compares those results with extracted/figma-hashes.json (committed: the baseline everyone
//                     shares) and writes extracted/figma-check.json; prints FIGMA: UNCHANGED or FIGMA: CHANGED with
//                     the groups to re-read (read them with --plan / --save, below), the new
//                     boards and the screenshots to re-capture; exit 0 unchanged, 10 changed. A board also counts as
//                     changed when what is drawn over it changed (overlays: loose arrows, connectors, notes) or when
//                     an arrow drawn over it is missing from its group's read (user, 2026-11-04: reads before the
//                     overlays existed missed them; the first check finds those boards, no extra Figma call)
//   --plan [--add <group>=<id>[@name],…] / --save   re-read calls packed by expected reply size, saved from the
//                     transcripts, pending and dropped groups packed again (see readPlan at the end)
//   --ack <id,…>      new boards that are not part of the spec (scratch frames): stop reporting them
//   --shot <png> <board id> [--box x,y,w,h] [--tiles id,…]   shrinks a saved board screenshot (extracted/figma/<png>)
//                     to 256 colours and records it; --box is the canvas box the image covers when it is not exactly
//                     the board node (a board cut out of a larger frame, at any scale), --tiles the boards it was
//                     joined from (PM and MX sections read as tiles): a change to any of them re-captures it
//                     with the board's current hash
//   --prune [--dry-run]       deletes screenshots in extracted/figma/ that shots.json does not list (or every one when
//                     the set is SUPERSEDED), so a re-captured board leaves one file, never an old copy beside it
// Every run first takes the hashes of group files read after the baseline (a re-read clears its boards' change).
import { existsSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { arg, assertIds, featureDir, ROOT, writeJson } from './lib/library.ts';
import { listSpecSets } from './lib/specs.ts';
import { cutByHost, jsonOf, useFigmaReturns } from './lib/figma-returns.ts';

const [feature, maybeSet] = process.argv.slice(2);
if (!feature) { console.error('Usage: node scripts/figma-check.ts <product>/<feature> [<spec-set folder>] [--compare | --ack <ids> | --shot <png> <board> [--box x,y,w,h] [--tiles ids] | --prune]'); process.exit(2); }
assertIds(feature, 'ios');
const specs = join(featureDir(feature), 'specs');
const hasGroups = (set: string) => existsSync(join(specs, set, 'extracted')) && readdirSync(join(specs, set, 'extracted')).some(f => /^figma-inventory-.+\.json$/.test(f));
const set = maybeSet && !maybeSet.startsWith('--') ? maybeSet : listSpecSets(feature).map(s => s.folder).reverse().find(hasGroups);
if (!set) { console.log('FIGMA: NO BASELINE (no spec set has figma-inventory-<group>.json; read the Figma files first)'); process.exit(1); }
const ex = join(specs, set, 'extracted'), checkDir = join(ex, 'figma-check'), shotDir = join(ex, 'figma');
const read = (p: string) => JSON.parse(readFileSync(p, 'utf8'));
const has = (f: string) => process.argv.includes(`--${f}`);

// groups: what each board group file read, and the exact entries to read it again
type Group = { name: string; file: string; page: string; entries: any[]; ids: string[]; hash?: Record<string, string>; overlay?: Record<string, string>;
  hashed_at?: string; arrows: Set<string>; boxes: Map<string, number[]> };
const groups: Group[] = readdirSync(ex).filter(f => /^figma-inventory-.+\.json$/.test(f) && !f.endsWith('-boards.json')).sort().map(f => {
  const g = read(join(ex, f));
  // older reads lack `entries`: rebuild them from the boards (a region id is "<parent>/<name>", its box is saved)
  const entries = g.entries ?? g.boards.map((b: any[]) => b[0].includes('/') ? { name: b[1], parent: b[0].split('/')[0], box: b.slice(2, 6) } : { id: b[0], name: b[1] });
  return { name: f.replace(/^figma-inventory-|\.json$/g, ''), file: g.file, page: g.page, entries, ids: g.boards.map((b: any[]) => b[0]), hash: g.hash,
    overlay: g.overlay, hashed_at: g.hashed_at, arrows: new Set((g.arrows ?? []).map((a: any[]) => a[0])), boxes: new Map(g.boards.map((b: any[]) => [b[0], b.slice(2, 6)])) };
});
const groupOf = new Map(groups.flatMap(g => g.ids.map(id => [id, g.name] as [string, string])));
const groupByName = new Map(groups.map(g => [g.name, g]));

// which Figma file is which: figma-frames.json names the design / pm / mx file keys; design reads go through
// figma-design (qa-dm), the PM and MX files through figma-pm (qa1)
const frames = existsSync(join(ex, 'figma-frames.json')) ? read(join(ex, 'figma-frames.json')) : { files: {} };
const roleOf = (key: string) => Object.entries<any>(frames.files ?? {}).find(([, f]) => f.fileKey === key)?.[0] ?? key;
const serverOf = (role: string) => role === 'design' ? 'figma-design' : role === 'pm' || role === 'mx' ? 'figma-pm' : '(unknown: add the file to figma-frames.json files)';
const files = [...new Map(groups.map(g => [`${g.file} ${g.page}`, { key: g.file, page: g.page, role: roleOf(g.file) }])).values()];
const tag = (f: { role: string; page: string }) => files.filter(x => x.role === f.role).length > 1 ? `${f.role}-${f.page.replace(':', '-')}` : f.role;

const storePath = join(ex, 'figma-hashes.json');
const store: any = existsSync(storePath) ? read(storePath) : { boards: {}, files: {} };
// a group read after the stored hash replaces it (and settles a change the last check found)
let absorbed = 0;
for (const g of groups) if (g.hash && g.hashed_at) for (const [id, h] of Object.entries(g.hash)) {
  const b = store.boards[id];
  if (!b || b.at < g.hashed_at) { store.boards[id] = { hash: h, ...(g.overlay ? { overlay: g.overlay[id] ?? '' } : {}), at: g.hashed_at, group: g.name }; absorbed++; }
}
const shotsPath = join(shotDir, 'shots.json');
const shots: Record<string, any> = existsSync(shotsPath) ? read(shotsPath) : {};
// a check call stops after the hash block (the group-mode code below it is never reached), which keeps it small
const code = (page: string, boards: any) => {
  const src = readFileSync(join(ROOT, 'scripts', 'figma', 'inventory.js'), 'utf8')
    .replace('const PAGE = __PAGE__, BOARDS = __BOARDS__;', `const PAGE = ${JSON.stringify(page)}, BOARDS = ${JSON.stringify(boards)};`);
  return boards.hash ? src.slice(0, src.indexOf('\nconst readGroup = ')).split('\n').filter(l => !/^\s*\/\//.test(l)).join('\n') + '\n' : src;
};
const save = () => { if (Object.keys(store.boards).length) writeJson(storePath, store); };
const rel = (p: string) => p.slice(ROOT.length + 1);

if (has('ack')) {
  const ids = (arg('ack') ?? '').split(',').filter(Boolean);
  for (const f of Object.values<any>(store.files)) f.acked = [...new Set([...(f.acked ?? []), ...ids])];
  save(); console.log(`Acknowledged ${ids.length} board(s) as not part of the spec`);
} else if (has('shot')) {
  const i = process.argv.indexOf('--shot'), png = process.argv[i + 1], id = process.argv[i + 2];
  if (!png || !id || !existsSync(join(shotDir, png))) { console.error(`--shot <png in ${rel(shotDir)}> <board id>`); process.exit(2); }
  // committed images stay small (user, 2026-10-29): 256 colours, no dithering, keeps the size and 1 px = 1 pt
  // (a Figma board is flat UI; about a fifth of the size). Needs Python 3 with Pillow, else the file is kept as is.
  const before = statSync(join(shotDir, png)).size;
  const q = spawnSync('python3', ['-c', `import sys; from PIL import Image
im = Image.open(sys.argv[1]); a = im.getchannel('A').getextrema()[0] if im.mode in ('RGBA', 'LA') else 255
if im.mode != 'P': (im.convert('RGBA') if a < 255 else im.convert('RGB')).quantize(256, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.NONE).save(sys.argv[1], optimize=True)`, join(shotDir, png)], { encoding: 'utf8' });
  if (q.status !== 0) console.log(`${png}: not shrunk (python3 with Pillow needed: pip3 install pillow)`);
  else console.log(`${png}: ${Math.round(before / 1024)} KB → ${Math.round(statSync(join(shotDir, png)).size / 1024)} KB`);
  const box = arg('box')?.split(',').map(Number), tiles = arg('tiles')?.split(',').filter(Boolean);
  if (box && (box.length !== 4 || box.some(n => !Number.isFinite(n)))) { console.error('--box x,y,w,h (canvas points)'); process.exit(2); }
  shots[png] = { board: id, group: groupOf.get(id) ?? null, hash: store.boards[id]?.hash ?? null,
    ...(store.boards[id]?.overlay !== undefined ? { overlay: store.boards[id].overlay } : {}), captured_at: new Date().toISOString(),
    ...(box ? { box } : {}), ...(tiles ? { tiles: Object.fromEntries(tiles.map(t => [t, store.boards[t]?.hash ?? null])) } : {}) };
  writeJson(shotsPath, shots); console.log(`${png}: recorded for board ${id} (hash ${shots[png].hash ?? 'none yet'})`);
} else if (has('prune')) {
  const superseded = existsSync(join(specs, set, 'SUPERSEDED.md'));
  const extra = existsSync(shotDir) ? readdirSync(shotDir).filter(f => /\.(png|jpe?g)$/i.test(f) && (superseded || !shots[f])) : [];
  for (const f of extra) { if (!has('dry-run')) rmSync(join(shotDir, f)); console.log(`${has('dry-run') ? 'would delete' : 'deleted'} ${rel(join(shotDir, f))}`); }
  if (superseded && !has('dry-run') && existsSync(shotsPath)) rmSync(shotsPath);
  console.log(`${extra.length} screenshot(s) ${has('dry-run') ? 'to prune' : 'pruned'}${superseded ? ' (superseded set)' : ''}`);
} else if (has('plan') || has('save')) {
  readPlan();
} else if (has('compare')) {
  const report: any = { checked_at: '', set, unchanged: [], changed: [], removed: [], baseline: [], new_boards: [], missed_arrows: [], reread: [], shots: [] };
  const missing = files.filter(f => !existsSync(join(checkDir, `${tag(f)}.json`)));
  if (missing.length) { console.error(`No result for ${missing.map(tag).join(', ')}: run the figma-check/<role>.js calls first`); process.exit(2); }
  for (const f of files) {
    const res = read(join(checkDir, `${tag(f)}.json`));
    if (res.mode !== 'hash') { console.error(`${tag(f)}.json is not a check result (mode: hash)`); process.exit(2); }
    report.checked_at = res.hashed_at;
    for (const [id, h, ov, ovArrows, ubox, holder] of res.boards as [string, string | null, string?, string[]?, number[]?, string?][]) {
      const b = store.boards[id], row: any = { id, group: groupOf.get(id) };
      // an arrow drawn over the board that its group's read does not have (a read made before overlays were read)
      const missed = (ovArrows ?? []).filter(a => !groupByName.get(row.group)?.arrows.has(a));
      if (missed.length) report.missed_arrows.push({ ...row, arrows: missed });
      if (ubox) Object.assign(row, { box: ubox, holder: holder ?? '' });
      if (h === null) report.removed.push(row);
      else if (!b) { store.boards[id] = { hash: h, ...(ov !== undefined ? { overlay: ov } : {}), at: res.hashed_at, group: groupOf.get(id), from: 'check' }; (missed.length ? report.changed : report.baseline).push(row); if (missed.length) store.boards[id].changed = { hash: h, overlay: ov, at: res.hashed_at, missed }; }
      else {
        // the first check with overlays takes them as the baseline; the missed arrows still flag what was lost before
        if (ov !== undefined && b.overlay === undefined) b.overlay = ov;
        const why = [b.hash !== h && 'board', ov !== undefined && b.overlay !== ov && 'overlay', missed.length && 'missed arrows'].filter(Boolean);
        if (!why.length) { delete b.changed; report.unchanged.push(row); }
        else { b.changed = { hash: h, ...(ov !== undefined ? { overlay: ov } : {}), at: res.hashed_at, ...(missed.length ? { missed } : {}) }; report.changed.push({ ...row, why }); }
      }
      if (ubox) store.boards[id].box = ubox, store.boards[id].holder = holder ?? '';
    }
    const fs = store.files[tag(f)] ??= { key: f.key, page: f.page };
    const known = new Set([...(fs.others ?? []), ...(fs.acked ?? [])]);
    if (!fs.others) fs.others = (res.others as string[][]).map(([id]) => id); // first check: what is there now is the baseline
    // a board read into a group since the check is no longer new
    else report.new_boards.push(...(res.others as string[][]).filter(([id]) => !known.has(id) && !groupOf.has(id)).map(([id, name]) => ({ id, name, file: tag(f) })));
    fs.checked_at = res.hashed_at;
  }
  // re-read calls for every group with a changed or removed board
  const stale = new Set([...report.changed, ...report.removed].map((r: any) => r.group).filter(Boolean));
  for (const g of groups.filter(g => stale.has(g.name))) {
    report.reread.push({ group: g.name, server: serverOf(roleOf(g.file)), save_as: rel(join(ex, `figma-inventory-${g.name}.json`)) });
  }
  for (const [png, s] of Object.entries<any>(shots)) {
    const b = store.boards[s.board];
    const tileChanged = Object.entries<any>(s.tiles ?? {}).some(([t, h]) => store.boards[t]?.changed || (h && store.boards[t] && h !== store.boards[t].hash));
    // a board with something drawn over it, or over its edge, is cut from its holder's screenshot so the overlays show
    const own = groupByName.get(s.group ?? groupOf.get(s.board))?.boxes.get(s.board), ub = b?.box;
    const grows = !!(ub && own && (ub[0] < own[0] || ub[1] < own[1] || ub[0] + ub[2] > own[0] + own[2] || ub[1] + ub[3] > own[1] + own[3]));
    const overlayNew = s.overlay === undefined ? !!b?.overlay : b?.overlay !== undefined && s.overlay !== b.overlay;
    if (b?.changed || (s.hash && b && s.hash !== b.hash) || tileChanged || overlayNew)
      report.shots.push({ png, board: s.board, ...(grows || (b?.overlay && !s.box) ? { box: ub, holder: b.holder } : {}) });
  }
  const orphans = existsSync(shotDir) ? readdirSync(shotDir).filter(f => /\.(png|jpe?g)$/i.test(f) && !shots[f]) : [];
  save(); writeJson(join(ex, 'figma-check.json'), report);
  const changed = report.changed.length + report.removed.length + report.new_boards.length;
  console.log(`${changed ? 'FIGMA: CHANGED' : 'FIGMA: UNCHANGED'} — ${set}: ${report.unchanged.length} unchanged, ${report.changed.length} changed, ${report.removed.length} removed, ${report.new_boards.length} new, ${report.baseline.length} baselined now${absorbed ? `, ${absorbed} hash(es) taken from re-read groups` : ''}`);
  if (report.reread.length) console.log(`  re-read ${report.reread.length} group(s) (${report.reread.map((r: any) => r.group).join(', ')}): node scripts/figma-check.ts ${feature} ${set} --plan${report.new_boards.length ? ' [--add <group>=<id>[@name],…]' : ''}`);
  for (const n of report.new_boards) console.log(`  new board ${n.id} 「${n.name}」 in ${n.file}: add it to a group or --ack it`);
  for (const m of report.missed_arrows) console.log(`  board ${m.id} (${m.group}): ${m.arrows.length} arrow(s) drawn over it are not in its read (${m.arrows.join(', ')})`);
  for (const s of report.shots) console.log(s.box
    ? `  re-capture ${s.png} (board ${s.board}) with what is drawn over it: get_screenshot of ${s.holder || 'the board (only the page holds the overlays: those past the board edge are cut off)'}, cut to --box ${s.box.join(',')} with figma-cut.ts, then --shot ${s.png} ${s.board} --box ${s.box.join(',')}`
    : `  re-capture ${s.png} (board ${s.board}), then --shot ${s.png} ${s.board}`);
  if (report.changed.length || report.missed_arrows.length) console.log(`  after the re-reads: node scripts/figma-text.ts ${feature} ${set} (what the changed boards now say against the spec notes)`);
  if (orphans.length) console.log(`  ${orphans.length} screenshot(s) not in shots.json (${orphans.join(', ')}): record them with --shot or delete them with --prune`);
  if (report.baseline.length && !report.unchanged.length && !report.changed.length) console.log('  first check: the hashes are the baseline from now on; changes made before today were not compared');
  process.exit(changed ? 10 : 0);
} else {
  if (absorbed) save();
  mkdirSync(checkDir, { recursive: true });
  for (const f of files) {
    const entries = groups.filter(g => g.file === f.key && g.page === f.page).flatMap(g => g.entries);
    const p = join(checkDir, `${tag(f)}.js`);
    writeFileSync(p, code(f.page, { hash: entries }));
    console.log(`${tag(f)}: ${entries.length} boards — use_figma on ${serverOf(f.role)} (fileKey ${f.key}), description "${desc(tag(f))}", code ${rel(p)}`);
  }
  console.log(`Then: node scripts/figma-check.ts ${feature} ${set} --save (copies the replies from the transcripts), then --compare`);
}

// ---- re-read plan and saving (2026-11-05) -------------------------------------------------------------------------------
// Re-reads used to be one call per group, each retyped from its reply; long reads ran past the MCP connection's limit
// and came back as "transport dropped mid-call" with nothing saved, so a pass ended with 13 groups unread. Now:
//   --plan [--add <group>=<id>[@name],…]   packs the compare's stale groups (and new boards, as new groups) into a few
//            calls per Figma file, each kept under ~35 KB of expected reply and 5 groups (inventory.js stops a call at
//            its time budget or ~40 KB and returns the rest as `pending`, so a slow or large call loses nothing it
//            read). Writes figma-check/todo.json and call-<n>.js; run each with the description it prints, at most one
//            call at a time per server (two servers may run side by side).
//   --save   copies every reply from the transcripts (lib/figma-returns.ts): check calls → <tag>.json, re-read calls →
//            figma-inventory-<group>.json. Groups left pending, or calls with no reply (dropped), are packed again
//            into new calls; a group that ran out of time alone is split into one group per board (<group>-1, -2…,
//            the old group file is removed once every part is saved). Run it after every batch of calls.
function desc(name: string) { return `casebook figma-check ${set} ${name}`; }
function TODO() { return join(checkDir, 'todo.json'); }
type Todo = { set: string; made_at: string; calls: { name: string; key: string; page: string; groups: Record<string, any[]> }[]; split: Record<string, string[]>; next: number };
// a group's reply size: its last read, or three times that when the read predates the board texts (most of a reply)
function estimate(name: string) { const p = join(ex, `figma-inventory-${name}.json`); if (!existsSync(p)) return 15000;
  const n = statSync(p).size; return 'texts' in read(p) ? n : Math.max(3 * n, 12000); }
function pack(todo: Todo, want: Map<string, { key: string; page: string; entries: any[] }>) {
  const byFile = new Map<string, [string, any][]>();
  for (const [name, g] of want) { const k = `${g.key} ${g.page}`; if (!byFile.has(k)) byFile.set(k, []); byFile.get(k)!.push([name, g]); }
  todo.calls = [];
  for (const list of byFile.values()) {
    let cur: Todo['calls'][number] | null = null, size = 0;
    for (const [name, g] of list) {
      const est = Math.min(estimate(name), 35000);
      if (!cur || size + est > 35000 || Object.keys(cur.groups).length >= 5) { cur = { name: `call-${todo.next++}`, key: g.key, page: g.page, groups: {} }; todo.calls.push(cur); size = 0; }
      cur.groups[name] = g.entries; size += est;
    }
  }
  for (const f of readdirSync(checkDir)) if (/^(call-\d+|reread-.+)\.js$/.test(f)) rmSync(join(checkDir, f));
  for (const c of todo.calls) writeFileSync(join(checkDir, `${c.name}.js`), code(c.page, { groups: c.groups }).split('\n').filter(l => !/^\s*\/\//.test(l)).join('\n'));
  writeJson(TODO(), todo);
  if (!todo.calls.length) { console.log('Nothing left to read. Next: node scripts/inventory.ts ' + feature + ' (merge), then the change check again until FIGMA: UNCHANGED'); return; }
  console.log(`${todo.calls.length} call(s); one at a time per server, then: node scripts/figma-check.ts ${feature} ${set} --save`);
  for (const c of todo.calls) {
    const role = roleOf(c.key);
    console.log(`  ${c.name}: use_figma on ${serverOf(role)} (fileKey ${c.key}), description "${desc(c.name)}", code ${rel(join(checkDir, `${c.name}.js`))}; groups ${Object.keys(c.groups).join(', ')}`);
  }
}
function readPlan() {
  mkdirSync(checkDir, { recursive: true });
  if (has('plan')) {
    const rep = existsSync(join(ex, 'figma-check.json')) ? read(join(ex, 'figma-check.json')) : null;
    if (!rep) { console.error('No figma-check.json: run the check calls and --compare first'); process.exit(2); }
    const want = new Map<string, { key: string; page: string; entries: any[] }>();
    for (const r of rep.reread ?? []) { const g = groupByName.get(r.group); if (g && !(g.hashed_at && g.hashed_at > rep.checked_at)) want.set(g.name, { key: g.file, page: g.page, entries: g.entries }); }
    for (const a of (arg('add') ?? '').split(',').filter(Boolean)) {
      const m = a.match(/^(?:([\w.-]+)=)?([\d:]+)(?:@(.+))?$/);
      const name = m?.[1] ?? [...want.keys()].at(-1), nb = m && (rep.new_boards ?? []).find((n: any) => n.id === m[2]), fs = nb && store.files[nb.file];
      if (!m || !name || !nb || !fs) { console.error(`--add ${a}: not a new board of the last compare (give <group>=<id>[@name], the group name on the first)`); process.exit(2); }
      if (!want.has(name)) want.set(name, { key: fs.key, page: fs.page, entries: [] });
      want.get(name)!.entries.push({ id: m[2], name: m[3] ?? nb.name });
    }
    // call numbers carry on from the last plan, so a description is never reused within a set
    const last = existsSync(TODO()) ? read(TODO()).next ?? 1 : 1;
    pack({ set: set!, made_at: new Date().toISOString(), calls: [], split: {}, next: last }, want);
    return;
  }
  // --save
  const todo: Todo | null = existsSync(TODO()) ? read(TODO()) : null;
  const notBefore = new Map<string, number>();
  for (const f of files) { const p = join(checkDir, `${tag(f)}.js`); if (existsSync(p)) notBefore.set(desc(tag(f)), statSync(p).mtimeMs); }
  for (const c of todo?.calls ?? []) notBefore.set(desc(c.name), statSync(join(checkDir, `${c.name}.js`)).mtimeMs);
  const found = useFigmaReturns(notBefore, { marker: 'figma-check' });
  for (const f of files) {
    const r = found.get(desc(tag(f))), cut = r && cutByHost(r.text), j = r && !cut && jsonOf(r.text);
    if (cut) console.log(`check ${tag(f)}: the reply was ${cut}; not saved (check fewer boards per call)`);
    else if (j?.mode === 'hash') { writeJson(join(checkDir, `${tag(f)}.json`), j); console.log(`saved check ${tag(f)}.json (${j.boards.length} boards)`); }
  }
  if (!todo) return;
  const left = new Map<string, { key: string; page: string; entries: any[] }>(), today = new Date().toISOString().slice(0, 10);
  for (const c of todo.calls) {
    const r = found.get(desc(c.name)), cut = r && cutByHost(r.text), j = r && !cut && jsonOf(r.text);
    const keep = (names: string[]) => { for (const n of names) left.set(n, { key: c.key, page: c.page, entries: c.groups[n] }); };
    if (cut) { console.log(`${c.name}: the reply was ${cut}; nothing saved from it, packed again (if it is cut again, plan with a smaller --budget)`); keep(Object.keys(c.groups)); continue; }
    if (!j || j.mode !== 'groups') { console.log(`${c.name}: ${r ? `no inventory in the reply: ${r.text.slice(0, 200)}` : 'no reply found (dropped?)'}; packed again`); keep(Object.keys(c.groups)); continue; }
    for (const [name, g] of Object.entries<any>(j.groups)) {
      writeJson(join(ex, `figma-inventory-${name}.json`), { file: c.key, page: c.page, group: name, extracted_at: today, ...g });
      console.log(`saved figma-inventory-${name}.json (${g.screens.length} screens, ${g.controls.length} controls, ${g.arrows.length} arrows, ${g.ms ?? '?'} ms)`);
    }
    // a group that ran out of time with no other group before it: read its boards one per call
    const slow = j.stopped && j.pending[0] === j.stopped.split(':')[0] && !Object.keys(j.groups).length ? j.pending[0] : null;
    for (const n of j.pending) {
      if (n === slow && c.groups[n].length > 1) {
        todo.split[n] = c.groups[n].map((_: any, i: number) => `${n}-${i + 1}`);
        c.groups[n].forEach((e: any, i: number) => left.set(`${n}-${i + 1}`, { key: c.key, page: c.page, entries: [e] }));
        console.log(`${n}: ran out of time alone; split into ${todo.split[n].join(', ')}`);
      } else keep([n]);
    }
    if (j.stopped) console.log(`${c.name}: ${j.stopped}`);
  }
  // a split group's old file goes once every part is saved
  for (const [g, parts] of Object.entries(todo.split)) if (parts.every(p => !left.has(p) && existsSync(join(ex, `figma-inventory-${p}.json`)))) {
    if (existsSync(join(ex, `figma-inventory-${g}.json`))) rmSync(join(ex, `figma-inventory-${g}.json`));
    delete todo.split[g]; console.log(`${g}: replaced by ${parts.join(', ')}`);
  }
  pack(todo, left);
}
