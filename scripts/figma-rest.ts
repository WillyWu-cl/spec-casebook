// PROTOTYPE (2026-11-11): reads a feature's Design Figma boards through the Figma REST API instead of the chunked
// use_figma source read (scripts/figma-source.ts), to measure calls, bytes and parity before any rule changes. It does
// not replace figma-source.ts; the MCP route stays the rule (AGENTS.md › Figma access) until the user decides.
// Usage: node scripts/figma-rest.ts <product>/<feature> [<spec-set folder>] <command> [options]
//   fetch [ids…] [--images] [--scale 1] [--no-geometry]
//                 GET /v1/files/:key/nodes?ids=…&geometry=paths for the boards (default: every board scope.json
//                 lists as read) in ONE call, written straight to rest/nodes.json (never printed); --images also
//                 asks GET /v1/images/:key for one PNG per board and downloads each to rest/images/<board>.png.
//                 Every call is logged (URL without the token, status, bytes, ms) in rest/calls.jsonl.
//   calls         writes rest/calls/extras.js: ONE read-only use_figma call (scripts/figma/rest-extras.js) for what REST
//                 lacks: variable names, mode names, per-vertex caps and joins (arrowheads), boolean radius, video
//                 fills. Run it on figma-design with the printed description (~20 KB of code, ~19 KB back), then
//   save          copies its return from the session transcripts into rest/extras.json (ids put back from
//                 rest/calls/extras-input.json); convert uses it when present
//   convert [--vars <library.json>]
//                 turns rest/nodes.json into rest/out/<board>.json in the node format figma-source.ts merge writes
//                 (board + nodes: abs, box, render, drawn, fills, strokes, radius, effects, layout, child,
//                 constraints, text.runs, component, variables, styles, reactions, arrow, hidden…), plus
//                 screens.json, arrows.json, library.json, summary.json and <board>.metadata.xml derived with
//                 figma-source.ts's own functions (read from its source, not copied). Variable names: REST gives
//                 only ids (`/variables/local` is Enterprise-only); a library variable's id holds its key, so
//                 --vars names them from a library.json an earlier use_figma read wrote (the stand-in for one
//                 small use_figma call); unnamed ones stay `?/<id>`. With rest/extras.json (calls / save) the names
//                 come from the extras call instead, and nothing needs an earlier read.
// Routes (prototype): REST + one extras call is meant to become the default if adopted, with the use_figma-only read
// (figma-source.ts) kept as a choice the user can ask for (user, 2026-11-11).
// Token (never written to the repo or a log): FIGMA_TOKEN, else the macOS keychain item
// `com.cyberlink.figma-retrieval` (security add-generic-password -a "$USER" -s com.cyberlink.figma-retrieval -w),
// else ~/.casebook/figma-token. Folder: specs/<set>/extracted/figma-source/design/rest/ (git-ignored, local only).
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, appendFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import * as nodeModule from 'node:module';
import { arg, assertIds, featureDir, ROOT, writeJson } from './lib/library.ts';
import { listSpecSets } from './lib/specs.ts';
import { useFigmaReturns } from './lib/figma-returns.ts';

const argv = process.argv.slice(2).filter((a, i, all) => !a.startsWith('--') && !(i > 0 && ['--scale', '--vars'].includes(all[i - 1])));
const [feature] = argv;
const usage = 'Usage: node scripts/figma-rest.ts <product>/<feature> [<set>] list [page id] | fetch [ids…] [--no-geometry] | calls | save | publish [--no-extras] | images | convert [--vars <library.json>]';
if (!feature) { console.error(usage); process.exit(2); }
assertIds(feature, 'ios');
const specs = join(featureDir(feature), 'specs');
const sets = listSpecSets(feature).map(s => s.folder);
let pos = 1;
const hasDesign = (s: string) => { const f = join(specs, s, 'extracted', 'figma-frames.json'); return existsSync(f) && !!JSON.parse(readFileSync(f, 'utf8')).files?.design?.fileKey; };
const set = sets.includes(argv[1]) ? argv[pos++] : [...sets].reverse().find(hasDesign);
if (!set) { console.error('No spec set has extracted/figma-frames.json with files.design (figma-source.ts <feature> init <Design link> records one)'); process.exit(2); }
const cmd = argv[pos], ids0 = argv.slice(pos + 1);
const ex = join(specs, set, 'extracted'), src = join(ex, 'figma-source', 'design'), restDir = join(src, 'rest');
const read = (p: string): any => JSON.parse(readFileSync(p, 'utf8'));
const frames = read(join(ex, 'figma-frames.json')), scopePath = join(src, 'scope.json');
const scope = existsSync(scopePath) ? read(scopePath) : { file: frames.files.design.fileKey, page: null, listed: null, read: [], missing: [] };
const fileKey: string = frames.files.design.fileKey;
if (scope.file && scope.file !== fileKey) { console.error(`scope.json is for file ${scope.file}, figma-frames.json names ${fileKey}`); process.exit(2); }
const rel = (p: string) => p.slice(ROOT.length + 1);
const dash = (id: string) => id.replace(/[:;/]/g, '-');
const r2 = (n: number) => Math.round(n * 100) / 100;
const extrasDesc = 'casebook figma-rest design extras';
let summary_extras: any = null;

if (cmd === 'list') await list();
else if (cmd === 'fetch') await fetchAll();
else if (cmd === 'calls') extrasCall();
else if (cmd === 'publish') publish();
else if (cmd === 'images') await images();
else if (cmd === 'save') saveExtras();
else if (cmd === 'convert') convert();
else { console.error(usage); process.exit(2); }

// ---- token and calls ----------------------------------------------------------------------------------------------------
function token(): string {
  if (process.env.FIGMA_TOKEN) return process.env.FIGMA_TOKEN.trim();
  const k = spawnSync('security', ['find-generic-password', '-a', process.env.USER ?? '', '-s', 'com.cyberlink.figma-retrieval', '-w'], { encoding: 'utf8' });
  if (k.status === 0 && k.stdout.trim()) return k.stdout.trim();
  const f = join(process.env.HOME ?? '', '.casebook', 'figma-token');
  if (existsSync(f)) return readFileSync(f, 'utf8').trim();
  console.error('No Figma token: set FIGMA_TOKEN, or add the keychain item com.cyberlink.figma-retrieval, or write ~/.casebook/figma-token (chmod 600)');
  process.exit(2);
}
// writes a reply to a file (never to the console) and logs the call
async function get(url: string, to: string, auth = true) {
  const t0 = Date.now();
  const res = await fetch(url, { headers: auth ? { 'X-Figma-Token': token() } : {} });
  mkdirSync(join(to, '..'), { recursive: true });
  writeFileSync(to, Buffer.from(await res.arrayBuffer()));
  const bytes = existsSync(to) ? statSync(to).size : 0;
  appendFileSync(join(restDir, 'calls.jsonl'), JSON.stringify({ at: new Date().toISOString(), figma_api: auth, url: url.replace(/[?&]?token=[^&]*/g, ''), status: res.status, bytes, ms: Date.now() - t0, file: rel(to) }) + '\n');
  if (!res.ok) { console.error(`${res.status} from ${url.split('?')[0]}: ${readFileSync(to, 'utf8').slice(0, 300)}`); process.exit(1); }
  return { bytes, ms: Date.now() - t0 };
}

// ---- fetch ---------------------------------------------------------------------------------------------------------------
async function fetchAll() {
  const ids: string[] = ids0.length ? ids0 : scope.read.map((b: any) => b.id);
  if (!ids.length) { console.error('No boards read before: pass the board ids (`list` shows the page\'s boards)'); process.exit(2); }
  mkdirSync(restDir, { recursive: true });
  const q = new URLSearchParams({ ids: ids.join(',') });
  if (!process.argv.includes('--no-geometry')) q.set('geometry', 'paths');
  const n = await get(`https://api.figma.com/v1/files/${fileKey}/nodes?${q}`, join(restDir, 'nodes.json'));
  console.log(`nodes: 1 call, ${ids.length} board(s), ${(n.bytes / 1e6).toFixed(1)} MB in ${(n.ms / 1000).toFixed(1)} s → ${rel(join(restDir, 'nodes.json'))}`);
}

// ---- list: the page's sections and boards (1 REST call, depth 2) ------------------------------------------------------
async function list() {
  const page = ids0[0] ?? frames.files.design.page;
  if (!page) { console.error('list [page or section id]: figma-frames.json has no files.design.page'); process.exit(2); }
  mkdirSync(restDir, { recursive: true });
  await get(`https://api.figma.com/v1/files/${fileKey}/nodes?${new URLSearchParams({ ids: page, depth: '2' })}`, join(restDir, 'list.json'));
  const doc = read(join(restDir, 'list.json')).nodes?.[page]?.document;
  if (!doc) { console.error(`node ${page} not found in ${fileKey}`); process.exit(1); }
  const listed: any[] = [];
  for (const n of doc.children ?? []) {
    listed.push([n.id, String(n.name).trim().slice(0, 60), n.type]);
    if (n.type === 'SECTION') for (const c of n.children ?? []) listed.push([c.id, String(c.name).trim().slice(0, 60), c.type, n.id]);
  }
  writeJson(scopePath, { ...scope, written_at: new Date().toISOString(), file: fileKey, page: [doc.id, doc.name], listed });
  console.log(`${doc.name}: ${listed.length} node(s) listed in ${rel(scopePath)}`);
  for (const r of listed) console.log(`  ${r[3] ? '  ' : ''}${r[0]} ${r[2]} ${r[1]}`);
}

// ---- publish: the read becomes the feature's Figma source -------------------------------------------------------------
// convert, then: out/ (what design.ts and everyone reads) replaced by the conversion; rest/boards/<file>.gz, the
// committed copy another computer unpacks with no Figma call (design-plan.ts ensureSource); hashes.json and scope.json
// updated with the boards' fingerprints (the same fingerprint the use_figma plan gives, so either route sees the other's
// read as current); source.json names the route and read time.
function publish() {
  const nodesP = join(restDir, 'nodes.json'), callP = join(restDir, 'calls', 'extras.js'), exP = join(restDir, 'extras.json');
  if (!existsSync(nodesP)) { console.error('No rest/nodes.json: run `fetch` first'); process.exit(2); }
  const fresh = existsSync(callP) && existsSync(exP) && statSync(callP).mtimeMs >= statSync(nodesP).mtimeMs && statSync(exP).mtimeMs >= statSync(callP).mtimeMs;
  if (!fresh && !process.argv.includes('--no-extras')) {
    console.error('rest/extras.json is missing or older than this fetch: run `calls`, the use_figma call, `save` (or publish --no-extras: variable names, mixed caps, boolean radius and video fills then stay unknown)');
    process.exit(2);
  }
  if (!fresh) rmSync(exP, { force: true });
  convert();
  const restOut = join(restDir, 'out'), outDir = join(src, 'out'), boardsDir = join(restDir, 'boards');
  const files = readdirSync(restOut).filter(f => /\.(json|xml)$/.test(f));
  rmSync(boardsDir, { recursive: true, force: true }); mkdirSync(boardsDir, { recursive: true });
  for (const f of files) writeFileSync(join(boardsDir, `${f}.gz`), gzipSync(readFileSync(join(restOut, f)), { level: 9 }));
  mkdirSync(outDir, { recursive: true });
  for (const f of readdirSync(outDir)) if (/\.(json|xml)$/.test(f)) rmSync(join(outDir, f));
  for (const f of files) copyFileSync(join(restOut, f), join(outDir, f));
  const summary = read(join(restOut, 'summary.json')), raw = read(nodesP);
  const fetched = readFileSync(join(restDir, 'calls.jsonl'), 'utf8').trim().split('\n').map(l => JSON.parse(l)).filter(c => c.file?.endsWith('/nodes.json') && c.status === 200).at(-1)?.at ?? new Date().toISOString();
  const hashesPath = join(src, 'hashes.json'), hashes = existsSync(hashesPath) ? read(hashesPath) : {};
  const readList = new Map<string, any>((scope.read ?? []).map((r: any) => [r.id, r]));
  const changed = summary.boards.filter((b: any) => hashes[b.id]?.hash !== b.hash).map((b: any) => b.id);
  for (const b of summary.boards) {
    hashes[b.id] = { hash: b.hash, read_at: fetched, name: b.name, nodes: b.nodes };
    readList.set(b.id, { id: b.id, name: b.name, read_at: fetched, hash: b.hash, plan: 'rest' });
  }
  writeJson(hashesPath, hashes);
  writeJson(scopePath, { ...scope, written_at: new Date().toISOString(), file: fileKey, read: [...readList.values()] });
  writeJson(join(src, 'source.json'), { route: 'rest', read_at: fetched, file_version: raw.version, file_last_modified: raw.lastModified,
    boards: summary.boards.length, changed, calls: { rest: 1, use_figma: fresh ? 1 : 0 }, extras: fresh });
  const kb = files.reduce((s, f) => s + statSync(join(boardsDir, `${f}.gz`)).size, 0) / 1024;
  console.log(`${changed.length} board(s) new or changed since the last read${changed.length ? `: ${changed.join(', ')}` : ''}`);
  console.log(`published ${summary.boards.length} board(s) to ${rel(outDir)}; committed copy ${rel(boardsDir)} (${Math.round(kb)} KB); hashes.json, scope.json, source.json updated` +
    `\nnext: \`images\` (board images not current), then \`node scripts/figma-source.ts ${feature} ${set} crop design\``);
}

// ---- images: board images for boards whose shared image is not current ---------------------------------------------
// The shared image rule of figma-source.ts (one 1 px = 1 pt image per board in extracted/figma/, shots.json): current
// when shots.json gives it this fingerprint, or the casebook keeps it and the board did not change since. Others are
// rendered with ONE REST image call; an image Figma scaled down (very large boards) is left for get_screenshot (MCP).
// Both are listed in figma-source/design/calls/todo.json, which `figma-source.ts crop design` uses (shrink, record, crop).
async function images() {
  const restOut = join(restDir, 'out');
  if (!existsSync(join(restOut, 'summary.json'))) { console.error('Nothing published: run `publish` first'); process.exit(2); }
  const shotDir = join(ex, 'figma'), shotsP = join(shotDir, 'shots.json'), shots: Record<string, any> = existsSync(shotsP) ? read(shotsP) : {};
  const cb = existsSync(join(ex, 'figma-hashes.json')) ? read(join(ex, 'figma-hashes.json')).boards ?? {} : {};
  const changed = new Set<string>(existsSync(join(src, 'source.json')) ? read(join(src, 'source.json')).changed ?? [] : []);
  const slug = (name: string) => name.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'board';
  const shared = (id: string) => Object.entries(shots).find(([, v]) => v.board === id && !v.box && !v.tiles);
  // figma-source.ts coveringShot: a current image the casebook cut from a larger 1:1 render holding the whole board is
  // used as it is. REST renders only the node, never what is drawn over it (arrows, notes on the page: REQ-078), so such
  // an image is never rendered again here (2026-11-12, video-enhance: two boards lost their notes and arrows)
  const pngW = (p: string) => readFileSync(p).readUInt32BE(16);
  const covering = (box: number[]) => { const [x, y, w, h] = box;
    return Object.entries<any>(shots).find(([name, e]) => {
      if (!e.box || e.tiles || !e.hash || cb[e.board]?.hash !== e.hash) return false;
      const [bx, by, bw, bh] = e.box, p = join(shotDir, name);
      return x >= bx - 0.5 && y >= by - 0.5 && x + w <= bx + bw + 0.5 && y + h <= by + bh + 0.5 && existsSync(p) && Math.abs(pngW(p) - bw) <= 1;
    })?.[0] ?? null; };
  const want: any[] = [], covered: string[] = [], drawnOver: any[] = [], taken = new Set<string>();
  for (const b of read(join(restOut, 'summary.json')).boards) {
    const e = shared(b.id), file = e && join(shotDir, e[0]);
    const current = !!e && existsSync(file!) && (e[1].source_hash ? e[1].source_hash === b.hash : !!e[1].hash && cb[b.id]?.hash === e[1].hash && !changed.has(b.id));
    if (current) continue;
    const board = read(join(restOut, `${dash(b.id)}.json`)).board, max = Math.ceil(Math.max(...(board.render ?? board.box).slice(2)));
    // a board this read found changed is newer than any casebook image of it (2026-11-12, batch-editing: 6 redrawn
    // boards were about to be cropped from images taken before the redraw)
    if (!changed.has(b.id) && covering(board.box)) { covered.push(b.id); continue; }
    // something is drawn over the board (the casebook's change check fingerprints it): a REST image would miss it, so the
    // casebook re-captures it from its holder (figma-check.ts prints the get_screenshot and --shot commands)
    if (cb[b.id]?.overlay) { drawnOver.push({ nodeId: b.id, holder: cb[b.id].holder || null, box: cb[b.id].box ?? null }); continue; }
    const free = (n: string) => !(shots[n] && (shots[n].board !== b.id || shots[n].box || shots[n].tiles)) && !taken.has(n);
    const name = e?.[0] ?? (free(`${slug(b.name)}.png`) ? `${slug(b.name)}.png` : `${slug(b.name)}-${dash(b.id)}.png`);
    taken.add(name);
    want.push({ nodeId: b.id, maxDimension: max, fingerprint: b.hash, save_to: rel(join(shotDir, name)) });
  }
  const todoP = join(src, 'calls', 'todo.json');
  const kept = (covered.length ? `; ${covered.length} board(s) cropped from the casebook's current image of what holds them (with what is drawn over them): ${covered.join(', ')}` : '') +
    (drawnOver.length ? `\n${drawnOver.length} board(s) have marks drawn over them and no current image, which a REST render would leave out: ` +
      `${drawnOver.map(d => d.nodeId).join(', ')}; run \`node scripts/figma-check.ts ${feature} ${set}\` and take the re-captures it prints` : '');
  if (!want.length) { console.log(`every board image is current: nothing to render${kept}`); writeJson(todoP, { server: 'figma-design', fileKey, scale: 1, route: 'rest', chunk_calls: [], covered_shots: covered, drawn_over: drawnOver, screenshots: [] }); return; }
  const im = await get(`https://api.figma.com/v1/images/${fileKey}?${new URLSearchParams({ ids: want.map(w => w.nodeId).join(','), scale: '1', format: 'png' })}`, join(restDir, 'images.json'));
  const urls: Record<string, string | null> = read(join(restDir, 'images.json')).images ?? {};
  const mcp: any[] = [];
  for (const w of want) {
    const url = urls[w.nodeId], tmp = join(restDir, 'images', `${dash(w.nodeId)}.png`);
    if (url) await get(url, tmp, false);
    const size = url && existsSync(tmp) ? [readFileSync(tmp).readUInt32BE(16), readFileSync(tmp).readUInt32BE(20)] : null;
    if (size && Math.abs(Math.max(...size) - w.maxDimension) <= 1) { mkdirSync(shotDir, { recursive: true }); copyFileSync(tmp, join(ROOT, w.save_to)); w.via = 'rest'; }
    else { w.via = 'get_screenshot'; w.note = size ? `REST rendered ${size.join('×')}, not 1:1` : 'REST rendered nothing'; mcp.push(w); }
  }
  writeJson(todoP, { server: 'figma-design', fileKey, scale: 1, route: 'rest', chunk_calls: [], covered_shots: covered, drawn_over: drawnOver, screenshots: want });
  console.log(`images: 1 REST call (${(im.ms / 1000).toFixed(0)} s) for ${want.length} board(s); ${want.length - mcp.length} saved 1:1${kept}` +
    (mcp.length ? `; ${mcp.length} need get_screenshot on figma-design (nodeId, maxDimension; download to save_to): ${mcp.map(m => `${m.nodeId} ${m.maxDimension}px → ${m.save_to}`).join(', ')}` : '') +
    `\nthen: node scripts/figma-source.ts ${feature} ${set} crop design`);
}

// ---- extras: one use_figma call for what REST lacks ------------------------------------------------------------------
function extrasCall() {
  const text = readFileSync(join(restDir, 'nodes.json'), 'utf8'), raw = JSON.parse(text);
  const vars = [...new Set(text.match(/VariableID:[^"\\]+/g) ?? [])].sort();
  const cols = new Set<string>();
  const walk = (n: any) => { for (const [c, m] of Object.entries<any>(n.explicitVariableModes ?? {})) cols.add(JSON.stringify([c, m])); for (const k of n.children ?? []) walk(k); };
  for (const e of Object.values<any>(raw.nodes)) if (e) walk(e.document);
  const boards = Object.keys(raw.nodes);
  // the id of each shown stroked vector REST gives no strokeJoin for (ids: walk positions drifted where the plugin and
  // REST count hidden layers inside instances differently, 2026-11-12 video-enhance: 12 ROUND joins asked of the wrong
  // vectors)
  const segs: string[] = [], segAt = new Map<string, number>(), vectors: { s: string[]; b: Record<string, string> } = { s: segs, b: {} };
  const pack = (id: string) => id.replace(/^I/, '').split(';').map(g => { if (!segAt.has(g)) { segAt.set(g, segs.length); segs.push(g); } return segAt.get(g)!.toString(36); }).join('.');
  for (const [bid, e] of Object.entries<any>(raw.nodes)) {
    if (!e) continue;
    const join: string[] = [];
    const go = (n: any, hid: boolean, inInst: boolean) => {
      if (inInst && n.visible === false) return;
      const hidden = hid || n.visible === false;
      if (n.type === 'VECTOR' && !hidden && n.strokes?.length && !n.strokeJoin) join.push(n.id);
      if (n.type === 'INSTANCE' && hidden) return;
      for (const c of n.children ?? []) go(c, hidden, inInst || n.type === 'INSTANCE');
    };
    go(e.document, false, false);
    vectors.b[bid] = join.map(pack).join(',');
  }
  const code = readFileSync(join(ROOT, 'scripts', 'figma', 'rest-extras.js'), 'utf8').split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('//')).join('\n')
    .replace('__BOARDS__', JSON.stringify(boards)).replace('__VARS__', JSON.stringify(vars)).replace('__COLLECTIONS__', JSON.stringify([...cols].map(c => JSON.parse(c)))).replace('__VECTORS__', JSON.stringify(vectors));
  if (code.length > 50000) { console.error(`extras call is ${code.length} characters; use_figma takes at most 50000`); process.exit(1); }
  mkdirSync(join(restDir, 'calls'), { recursive: true });
  writeFileSync(join(restDir, 'calls', 'extras.js'), code);
  // what was sent, in order: the return lists variables and modes by position
  writeJson(join(restDir, 'calls', 'extras-input.json'), { vars, cols: [...cols].map(c => JSON.parse(c)) });
  console.log(JSON.stringify({ server: 'figma-design', fileKey, description: extrasDesc, call: rel(join(restDir, 'calls', 'extras.js')), save_to: rel(join(restDir, 'extras.json')), boards: boards.length, variables: vars.length, collections: cols.size, characters: code.length }, null, 1));
}
function saveExtras() {
  const call = join(restDir, 'calls', 'extras.js');
  if (!existsSync(call)) { console.error('No calls/extras.js: run `calls` first'); process.exit(2); }
  const got = useFigmaReturns(new Map([[extrasDesc, statSync(call).mtimeMs]])).get(extrasDesc);
  if (!got) { console.error(`No use_figma return with description "${extrasDesc}" newer than ${rel(call)} in the last two days' transcripts`); process.exit(1); }
  const t = got.text, a = t.indexOf('{'), b = t.lastIndexOf('}');
  let r: any; try { r = JSON.parse(t.slice(a, b + 1)); } catch { console.error(`The return is not JSON: ${t.slice(0, 200)}`); process.exit(1); }
  if (r.mode !== 'rest-extras' || r.error) { console.error(`Not saved: ${r.error ?? 'not a rest-extras return'}`); process.exit(1); }
  // put the ids back (the call returns variables and modes in the order they were sent)
  const sent = read(join(restDir, 'calls', 'extras-input.json'));
  if (r.vars.length !== sent.vars.length || r.cols.length !== sent.cols.length) { console.error('The return does not match calls/extras-input.json: run `calls` and the call again'); process.exit(1); }
  r.vars = r.vars.map((v: any, i: number) => v ? [sent.vars[i], ...v] : [sent.vars[i], null]);
  r.cols = r.cols.map((c: any[], i: number) => [sent.cols[i][0], c[0], sent.cols[i][1], c[1]]);
  writeJson(join(restDir, 'extras.json'), r);
  console.log(`saved ${rel(join(restDir, 'extras.json'))} (${t.length} bytes): ${r.vars.length} variables, ${r.cols.length} modes, ${r.boards.reduce((s: number, x: any) => s + (x.vec?.length ?? 0), 0)} vectors, ${r.boards.reduce((s: number, x: any) => s + (x.bool?.length ?? 0), 0)} boolean radii, ${r.boards.reduce((s: number, x: any) => s + (x.video?.length ?? 0), 0)} video fills, ${r.took_ms} ms`);
}

// ---- convert ------------------------------------------------------------------------------------------------------------
function convert() {
  const raw = read(join(restDir, 'nodes.json'));
  const outDir = join(restDir, 'out');
  mkdirSync(outDir, { recursive: true });
  // variable names by key from an earlier read's library.json (REST ids of library variables are VariableID:<key>/<id>)
  const varsFrom = arg('vars');
  const byKey = new Map<string, any>(varsFrom ? read(varsFrom).variables.map((v: any) => [v.key, v]) : []);
  // the use_figma extras (calls / save): variable names and values, mode names, per-vertex caps and joins, boolean
  // radius, video fills; they win over --vars
  const exPath = join(restDir, 'extras.json'), ex = existsSync(exPath) ? read(exPath) : null;
  const exVar = new Map<string, any[]>((ex?.vars ?? []).filter((v: any[]) => v[1]).map((v: any[]) => [v[0], v]));
  const exCol = new Map<string, any[]>((ex?.cols ?? []).map((c: any[]) => [`${c[0]}|${c[2]}`, c]));
  const exVec = new Map<string, any[]>(), exBool = new Map<string, any[]>(), exVideo = new Map<string, any[]>();
  for (const b of ex?.boards ?? []) { for (const v of b.vec ?? []) exVec.set(v[0], v); for (const x of b.bool ?? []) exBool.set(x[0], x); for (const x of b.video ?? []) exVideo.set(x[0], x[1]); }
  if (ex) summary_extras = { read_at: ex.read_at, vars: exVar.size, cols: exCol.size, vectors: exVec.size, booleans: exBool.size, videos: exVideo.size };
  const D = derived();
  const lib = { variables: new Map<string, any>(), styles: new Map<string, any>(), components: new Map<string, any>() };
  const vals = new Map<string, Map<string, number>>();
  const screens: any[] = [], arrows: any[] = [], summary: any = { source: 'rest', boards: [], incomplete: [], calls: { rest: 1 }, unnamed_variables: 0 };
  const unnamed = new Set<string>();
  for (const [boardId, entry] of Object.entries<any>(raw.nodes)) {
    if (!entry) { summary.incomplete.push({ board: boardId, missing: ['not in the REST reply'] }); continue; }
    const doc = entry.document, comps = entry.components ?? {}, sets = entry.componentSets ?? {}, styleMeta = entry.styles ?? {};
    const ob = doc.absoluteBoundingBox ?? { x: 0, y: 0 }, origin = [ob.x, ob.y];
    const V = (id: string) => {
      const e = exVar.get(id);
      if (e) { const k = e[1] + '|' + e[2]; if (!lib.variables.has(k)) lib.variables.set(k, { name: e[1], collection: e[2], type: e[3], remote: !!e[4], key: id.match(/^VariableID:([0-9a-f]{40})\//)?.[1] ?? '' }); return `${e[2]}/${e[1]}`; }
      const key = id.match(/^VariableID:([0-9a-f]{40})\//)?.[1], v = key ? byKey.get(key) : null;
      if (!v) { unnamed.add(id); return `?/${id}`; }
      lib.variables.set(v.name + '|' + v.collection, { name: v.name, collection: v.collection, type: v.type, remote: v.remote, key: v.key });
      return `${v.collection}/${v.name}`;
    };
    const S = (id: string) => { const s = styleMeta[id]; if (!s) return id; lib.styles.set(s.name + '|' + s.styleType, { name: s.name, type: s.styleType, remote: !!s.remote, key: s.key }); return s.name; };
    const hex = (c: any, a?: number) => '#' + [c.r, c.g, c.b, a === undefined ? (c.a ?? 1) : a].map((v: number) => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
    const paint = (p: any) => {
      const o: any = { type: p.type };
      if (p.type === 'SOLID') o.color = hex(p.color, p.opacity ?? 1);
      if (p.type !== 'SOLID' && p.opacity !== undefined && p.opacity !== 1) o.opacity = r2(p.opacity);
      if (p.visible === false) o.visible = false;
      if (p.blendMode && p.blendMode !== 'NORMAL') o.blend = p.blendMode;
      if (p.boundVariables?.color) o.variable = V(p.boundVariables.color.id);
      if (p.gradientStops) {
        o.stops = p.gradientStops.map((s: any) => ({ position: r2(s.position), color: hex(s.color), ...(s.boundVariables?.color ? { variable: V(s.boundVariables.color.id) } : {}) }));
        if (p.gradientHandlePositions) o.transform = gradientTransform(p.gradientHandlePositions, p.type === 'GRADIENT_LINEAR');
      }
      if (p.type === 'IMAGE' || p.type === 'VIDEO') { o.image = p.imageRef ?? p.videoRef ?? ''; o.scale_mode = p.scaleMode === 'STRETCH' && p.imageTransform ? 'CROP' : p.scaleMode; }
      return o;
    };
    const paints = (l: any[] | undefined) => Array.isArray(l) && l.length ? l.map(paint) : null;
    const aliases = (bv: any) => Object.fromEntries(Object.entries(bv).flatMap(([k, v]: [string, any]): any[] => {
      if (k === 'componentProperties') return Object.entries(v).map(([q, a]: [string, any]) => [`componentProperties.${q.replace(/#[^#]*$/, '')}`, V(a.id)]);
      if (Array.isArray(v)) return [[k, v.map((a: any) => V(a.id))]];
      if (v && typeof v === 'object' && v.id) return [[k, V(v.id)]];
      // REST nests some per-item maps (e.g. rectangleCornerRadii: {RECTANGLE_TOP_LEFT_CORNER_RADIUS: alias})
      return Object.entries(v ?? {}).map(([q, a]: [string, any]) => [q, V(a.id)]);
    }));
    const CON: Record<string, string> = { LEFT: 'MIN', TOP: 'MIN', RIGHT: 'MAX', BOTTOM: 'MAX', CENTER: 'CENTER', LEFT_RIGHT: 'STRETCH', TOP_BOTTOM: 'STRETCH', SCALE: 'SCALE' };
    const nodes: any[] = [];
    // absolute linear part (rotation / flip) of each node: REST's relativeTransform is relative to the parent, groups
    // included; the plugin's `rotation` is relative to the nearest ancestor that is not a group or boolean operation
    const go = (n: any, parent: any, depth: number, linParent: number[][], linCont: number[][], hid: boolean, inInst: boolean, skipped: boolean, instPrefix: string | null) => {
      const hidden = hid || n.visible === false;
      const skip = skipped || (inInst && n.visible === false);
      const b = n.absoluteBoundingBox;
      const o: any = { id: n.id, type: n.type, name: n.name };
      // a node with no bounds (an empty vector): the plugin gives a zero box at the canvas origin, REST null
      o.box = b ? [r2(b.x - origin[0]), r2(b.y - origin[1]), r2(b.width), r2(b.height)] : [r2(-origin[0]), r2(-origin[1]), 0, 0];
      const rt = n.relativeTransform as number[][] | undefined;
      const lin = rt ? mul(linParent, [[rt[0][0], rt[0][1]], [rt[1][0], rt[1][1]]]) : linParent;
      const contKids = n.type === 'GROUP' || n.type === 'BOOLEAN_OPERATION' ? linCont : lin;
      const m = mul(inv(linCont), lin);
      const rotDeg = rt ? r2(Math.atan2(-m[1][0], m[0][0]) * 180 / Math.PI) : n.rotation ? r2(-n.rotation * 180 / Math.PI) : 0;
      const at = b && n.size ? translation(lin, n.size, b) : null;
      if (rotDeg && !skip) { o.rotation = rotDeg; if (at) o.origin = [r2(at[0] - origin[0]), r2(at[1] - origin[1])]; }
      if (skip) {
        // a layer hidden inside an instance: figma-source reads these from the main component (hidden mode)
        o.hidden = true;
        if (instPrefix && n.id.startsWith(instPrefix)) { const s = n.id.slice(instPrefix.length); o.from_component = s.includes(';') ? 'I' + s : s; }
      } else if (hidden) o.hidden = true;
      else describe(n, o, parent, lin, at);
      o.parent = parent ? parent.id : null;
      o.index = nodes.length; o.depth = depth;
      o.abs = [r2(o.box[0] + origin[0]), r2(o.box[1] + origin[1]), o.box[2], o.box[3]];
      nodes.push(o);
      const isInst = n.type === 'INSTANCE';
      for (const c of n.children ?? []) go(c, n, depth + 1, lin, contKids, hidden, inInst || isInst, skip, isInst && !skip ? 'I' + n.id.replace(/^I/, '') + ';' : instPrefix);
    };
    const describe = (n: any, o: any, parent: any, lin: number[][], at: number[] | null) => {
      const b = n.absoluteBoundingBox, rb = n.absoluteRenderBounds;
      if (rb && b && (Math.abs(rb.x - b.x) > 0.5 || Math.abs(rb.y - b.y) > 0.5 || Math.abs(rb.width - b.width) > 0.5 || Math.abs(rb.height - b.height) > 0.5))
        o.render = [r2(rb.x - origin[0]), r2(rb.y - origin[1]), r2(rb.width), r2(rb.height)];
      const dr = drawn(n); if (dr < 0.999) o.drawn = r2(dr);
      if (n.opacity !== undefined && n.opacity !== 1) o.opacity = r2(n.opacity);
      if (n.blendMode && n.blendMode !== 'PASS_THROUGH' && n.blendMode !== 'NORMAL') o.blend = n.blendMode;
      if (n.isMask) o.mask = n.maskType ?? 1;
      if (n.clipsContent) o.clips = true;
      const grp = n.type === 'GROUP';
      if (n.type !== 'TEXT' && !grp) { const f = paints(n.fills); if (f) o.fills = f; }
      const s = grp ? null : paints(n.strokes);
      if (s) {
        o.strokes = s;
        const w = n.individualStrokeWeights;
        o.stroke_weight = w ? [w.top, w.right, w.bottom, w.left].map(r2) : r2(n.strokeWeight ?? 1);
        o.stroke_align = n.strokeAlign ?? 'INSIDE';
        if (n.strokeDashes?.length) o.dash = n.strokeDashes.map(r2);
        if (n.strokeCap && n.strokeCap !== 'NONE') o.stroke_cap = n.strokeCap === 'MIXED' ? 'mixed' : n.strokeCap;
        else if (!n.strokeCap && capVertex(n) >= 0) o.stroke_cap = 'mixed';
        if (n.strokeJoin && n.strokeJoin !== 'MITER') o.stroke_join = n.strokeJoin === 'MIXED' ? 'mixed' : n.strokeJoin;
      }
      const rr = grp ? undefined : n.rectangleCornerRadii as number[] | undefined;
      if (rr && !rr.every(x => x === rr[0])) o.radius = rr.map(r2);
      else if (n.cornerRadius && !grp) o.radius = r2(n.cornerRadius);
      else if (rr && rr[0]) o.radius = r2(rr[0]);
      if (o.radius !== undefined && n.cornerSmoothing) o.smoothing = r2(n.cornerSmoothing);
      if (n.effects?.length) o.effects = n.effects.map((e: any) => ({ type: e.type, ...(e.visible === false ? { visible: false } : {}), ...(e.color ? { color: hex(e.color) } : {}),
        ...(e.offset ? { offset: [r2(e.offset.x), r2(e.offset.y)] } : {}), ...(e.radius !== undefined ? { radius: r2(e.radius) } : {}), ...(e.spread ? { spread: r2(e.spread) } : {}),
        ...(e.blendMode && e.blendMode !== 'NORMAL' ? { blend: e.blendMode } : {}), ...(e.showShadowBehindNode ? { behind_node: true } : {}),
        ...(e.boundVariables && Object.keys(e.boundVariables).length ? { variables: aliases(e.boundVariables) } : {}) }));
      if (n.layoutMode && n.layoutMode !== 'NONE') {
        const wrap = n.layoutWrap === 'WRAP';
        o.layout = { mode: n.layoutMode, wrap, padding: [n.paddingTop ?? 0, n.paddingRight ?? 0, n.paddingBottom ?? 0, n.paddingLeft ?? 0].map(r2), gap: r2(n.itemSpacing ?? 0),
          ...(wrap && n.counterAxisSpacing != null ? { cross_gap: r2(n.counterAxisSpacing) } : {}),
          primary_align: n.primaryAxisAlignItems ?? 'MIN', cross_align: n.counterAxisAlignItems ?? 'MIN',
          primary_sizing: n.primaryAxisSizingMode ?? 'AUTO', cross_sizing: n.counterAxisSizingMode ?? 'AUTO', ...(n.strokesIncludedInLayout ? { strokes_in_layout: true } : {}) };
      }
      if (parent?.layoutMode && parent.layoutMode !== 'NONE') {
        o.child = { horizontal: n.layoutSizingHorizontal, vertical: n.layoutSizingVertical };
        if (n.layoutPositioning === 'ABSOLUTE') o.child.extra = 'ABSOLUTE'; else if (n.layoutGrow) o.child.extra = `grow:${n.layoutGrow}`;
      } else if (n.constraints && !grp && n.type !== 'BOOLEAN_OPERATION') {
        const c = [CON[n.constraints.horizontal] ?? n.constraints.horizontal, CON[n.constraints.vertical] ?? n.constraints.vertical];
        if (c[0] !== 'MIN' || c[1] !== 'MIN') o.constraints = c;
      }
      if (n.minWidth || n.maxWidth || n.minHeight || n.maxHeight) o.min_max = [n.minWidth ?? null, n.maxWidth ?? null, n.minHeight ?? null, n.maxHeight ?? null];
      const st: Record<string, string> = {};
      for (const k of ['fill', 'stroke', 'effect', 'text']) if (n.styles?.[k]) st[k] = S(n.styles[k]);
      if (n.styles?.fills && !st.fill) st.fill = S(n.styles.fills);
      if (n.styles?.strokes && !st.stroke) st.stroke = S(n.styles.strokes);
      if (n.styles?.effects && !st.effect) st.effect = S(n.styles.effects);
      if (Object.keys(st).length) o.styles = st;
      if (n.boundVariables && Object.keys(n.boundVariables).length) o.variables = aliases(n.boundVariables);
      if (n.explicitVariableModes && Object.keys(n.explicitVariableModes).length) o.modes = Object.fromEntries(Object.entries<any>(n.explicitVariableModes).map(([c, m]) => {
        const e = exCol.get(`${c}|${m}`); return e?.[1] ? [e[1], e[3] ?? m] : [`?/${c}`, `?/${m}`]; }));
      if (n.type === 'TEXT') { o.text = text(n, st); if (st.text && o.text.runs.some((r: any) => r.text_style !== st.text)) { delete st.text; if (!Object.keys(st).length) delete o.styles; } }
      if (n.type === 'INSTANCE' && n.componentId) {
        const m = comps[n.componentId];
        if (m) { o.component = { id: n.componentId, name: m.name, set: m.componentSetId ? sets[m.componentSetId]?.name ?? '' : '', key: m.key ?? '', remote: !!m.remote }; lib.components.set(n.componentId, o.component); }
      }
      if (n.componentProperties && Object.keys(n.componentProperties).length) o.component_props = Object.fromEntries(Object.entries<any>(n.componentProperties).map(([k, v]) => [k.replace(/#[^#]*$/, ''), v.value]));
      if (n.type === 'COMPONENT') o.key = comps[n.id]?.key; if (n.type === 'COMPONENT_SET') o.key = sets[n.id]?.key;
      const acts = n.interactions ?? n.reactions;
      if (acts?.length) o.reactions = acts.map((r: any) => ({ trigger: r.trigger?.type ?? '', actions: (r.actions ?? (r.action ? [r.action] : [])).filter(Boolean)
        .map((a: any) => ({ type: a.type, destination: a.destinationId ?? a.url ?? '', navigation: a.navigation ?? '', transition: a.transition?.type ?? '' })) }));
      if (n.type === 'VECTOR' || n.type === 'LINE') { const pa = arrowPath(n, lin, at); if (pa) o.arrow = pa.map(([x, y]) => [r2(x - origin[0]), r2(y - origin[1])]); }
      // what only the plugin knows (extras): the vertex caps and joins and the arrow they give, boolean radius, videos
      const ev = exVec.get(n.id);
      if (ev && o.strokes) {
        // 0 means "not asked" (the call asks caps only of mixed-cap vectors, joins only where REST gave none): REST's own
        // value stands then (2026-11-12, video-enhance: 15 ROUND joins and a ROUND cap were dropped)
        if (ev[1] && ev[1] !== 'NONE') o.stroke_cap = ev[1]; else if (ev[1] === 'NONE' || o.stroke_cap === 'mixed') delete o.stroke_cap;
        if (ev[2] && ev[2] !== 'MITER') o.stroke_join = ev[2]; else if (ev[2] === 'MITER') delete o.stroke_join;
        if (ev[3]) o.arrow = ev[3]; else delete o.arrow;
      } else if (ex && o.stroke_cap === 'mixed' && n.type === 'VECTOR') { delete o.stroke_cap; delete o.arrow; }
      const eb = exBool.get(n.id);
      if (eb) { o.radius = eb[1]; if (eb[2]) o.smoothing = eb[2]; }
      for (const [i, hash] of exVideo.get(n.id) ?? []) if (o.fills?.[i]) { o.fills[i].type = 'VIDEO'; o.fills[i].image = hash; }
    };
    const text = (n: any, st: Record<string, string>) => {
      const s = n.style ?? {}, ov: number[] = n.characterStyleOverrides ?? [], table = n.styleOverrideTable ?? {};
      const lh = (t: any) => t.lineHeightUnit === 'PIXELS' ? r2(t.lineHeightPx) : t.lineHeightUnit === 'FONT_SIZE_%' ? `${r2(t.lineHeightPercentFontSize)}%` : t.lineHeightUnit === 'INTRINSIC_%' ? 'auto' : r2(t.lineHeightPx);
      const runOf = (k: number) => {
        const t = { ...s, ...(k ? table[k] ?? {} : {}) }, fills = (k ? table[k]?.fills : undefined) ?? n.fills;
        const bv = k && table[k]?.boundVariables ? table[k].boundVariables : null;
        const r: any = { font_family: t.fontFamily, font_style: t.fontStyle, font_size: r2(t.fontSize), font_weight: t.fontWeight, line_height: lh(t), letter_spacing: t.letterSpacing ? r2(t.letterSpacing) : '0%' };
        if (t.textDecoration && t.textDecoration !== 'NONE') r.decoration = t.textDecoration;
        if (t.textCase && t.textCase !== 'ORIGINAL') r.case = t.textCase;
        const f = paints(fills); if (f) r.fills = f;
        // a run with its own text style: REST names it in the override's inheritTextStyleId (2026-11-12, video-enhance:
        // 15 runs such as "Caption/Large_01_SB" inside a "Caption/Large_01_R" text were read with no style)
        if (k && table[k]?.inheritTextStyleId) r.text_style = S(table[k].inheritTextStyleId);
        else if (st.text && !(k && table[k] && ['fontFamily', 'fontStyle', 'fontSize', 'fontWeight', 'lineHeightPx', 'lineHeightUnit', 'letterSpacing', 'textCase', 'textDecoration'].some(q => q in table[k] && table[k][q] !== s[q]))) r.text_style = st.text;
        if (st.fill && !(k && table[k]?.fills)) r.fill_style = st.fill;
        if (bv && Object.keys(bv).length) r.variables = aliases(bv);
        return r;
      };
      // one run per stretch of characters whose resolved style is the same (getStyledTextSegments' splitting);
      // the override array indexes UTF-16 code units like the plugin (shorter arrays mean "no override" after)
      const chars: string = n.characters ?? '', runs: any[] = [];
      let start = 0, prev = '';
      for (let i = 0; i <= chars.length; i++) {
        const key = i < chars.length ? JSON.stringify(runOf(ov[i] ?? 0)) : '';
        if (i > 0 && key !== prev) { runs.push({ start, end: i, ...JSON.parse(prev) }); start = i; }
        prev = key;
      }
      if (!runs.length) runs.push({ start: 0, end: 0, ...runOf(0) });
      return { characters: chars, align: [s.textAlignHorizontal ?? 'LEFT', s.textAlignVertical ?? 'TOP'], auto_resize: s.textAutoResize ?? 'NONE',
        ...(s.paragraphSpacing ? { paragraph_spacing: r2(s.paragraphSpacing) } : {}), ...(s.maxLines ? { max_lines: s.maxLines } : {}),
        ...(s.textTruncation && s.textTruncation !== 'DISABLED' ? { truncation: s.textTruncation } : {}), runs };
    };
    // ancestors for drawn(): REST nodes have no parent link, so keep one
    const parentOf = new Map<any, any>();
    const link = (n: any) => { for (const c of n.children ?? []) { parentOf.set(c, n); link(c); } };
    link(doc);
    const drawn = (n: any) => {
      const b = n.absoluteBoundingBox; if (!b || !b.width || !b.height) return 1;
      let x0 = b.x, y0 = b.y, x1 = b.x + b.width, y1 = b.y + b.height;
      const cut = (c: any) => { if (!c) return; x0 = Math.max(x0, c.x); y0 = Math.max(y0, c.y); x1 = Math.min(x1, c.x + c.width); y1 = Math.min(y1, c.y + c.height); };
      for (let q = n; q; q = parentOf.get(q)) {
        if (q.opacity !== undefined && q.opacity < 0.05) return 0;
        if (Array.isArray(q.effects) && q.effects.some((e: any) => e.visible !== false && e.type === 'LAYER_BLUR' && e.radius >= 4)) return 0;
        if (q !== n && q.clipsContent) cut(q.absoluteBoundingBox);
        const p = parentOf.get(q);
        if (p) { const i = p.children.indexOf(q); for (let k = 0; k < i; k++) { const m = p.children[k]; if (m.isMask && m.visible !== false) cut(m.absoluteBoundingBox); } }
      }
      return Math.max(0, x1 - x0) * Math.max(0, y1 - y0) / (b.width * b.height);
    };
    // REST leaves out a vector's strokeCap when its vertices have their own caps (the plugin's 'mixed'); such a vertex
    // carries a `meta` override index. The arrowhead is taken to be the free end whose override no other vertex shares.
    const capVertex = (v: any) => {
      const vs = v.vectorNetwork?.vertices, ss = v.vectorNetwork?.segments; if (!vs?.length || !ss) return -1;
      const deg = vs.map(() => 0); for (const g of ss) { deg[g.start]++; deg[g.end]++; }
      const uses = new Map<number, number>(); for (const x of vs) uses.set(x.meta ?? 0, (uses.get(x.meta ?? 0) ?? 0) + 1);
      let best = -1;
      vs.forEach((x: any, i: number) => { if (deg[i] === 1 && x.meta && uses.get(x.meta) === 1 && (best < 0 || x.meta > vs[best].meta)) best = i; });
      return best;
    };
    const isHead = (c: string) => ['ARROW_LINES', 'ARROW_EQUILATERAL', 'TRIANGLE_FILLED', 'CIRCLE_FILLED', 'DIAMOND_FILLED'].includes(c);
    // REST gives the vector network (with geometry=paths) but not each vertex's stroke cap: an arrow is found by the
    // node's cap, a vertex cap (capVertex) or its name, as source.js does
    const arrowPath = (v: any, lin: number[][], at: number[] | null) => {
      if (!at) return null;
      const P = (x: number, y: number) => [lin[0][0] * x + lin[0][1] * y + at[0], lin[1][0] * x + lin[1][1] * y + at[1]];
      const named = /-->|arrow/i.test(v.name);
      if (v.type === 'LINE') return isHead(v.strokeCap) || named ? [P(0, 0), P(v.size?.x ?? 0, 0)] : null;
      const net = v.vectorNetwork; if (!net) return null;
      const cv = v.strokeCap ? -1 : capVertex(v);
      if (!isHead(v.strokeCap) && !named && cv < 0) return null;
      const adj = net.vertices.map(() => [] as number[]);
      for (const s of net.segments) { adj[s.start].push(s.end); adj[s.end].push(s.start); }
      const head = cv >= 0 ? cv : adj.findIndex((a: number[]) => a.length === 1);
      if (head < 0) return null;
      let tail = adj.findIndex((a: number[], i: number) => a.length === 1 && i !== head); if (tail < 0) tail = 0;
      const order = [tail], seen = new Set([tail]);
      for (let cur = tail; cur !== head;) { const nx = adj[cur].find((j: number) => !seen.has(j)); if (nx === undefined) break; order.push(nx); seen.add(nx); cur = nx; }
      if (order[order.length - 1] !== head) order.push(head);
      return order.map(i => P(net.vertices[i].position.x, net.vertices[i].position.y));
    };
    const I = [[1, 0], [0, 1]];
    go(doc, null, 0, I, I, false, false, false, null);
    const rb = doc.absoluteRenderBounds;
    const board = { id: boardId, name: String(doc.name).trim(), type: doc.type, box: [r2(ob.x), r2(ob.y), r2(ob.width), r2(ob.height)],
      render: rb ? [r2(rb.x), r2(rb.y), r2(rb.width), r2(rb.height)] : null, parent: null, hash: fingerprint(doc, origin, exVideo), read_at: raw.lastModified, nodes: nodes.length };
    writeJson(join(outDir, `${dash(boardId)}.json`), { board, nodes });
    writeFileSync(join(outDir, `${dash(boardId)}.metadata.xml`), D.metadataXml(nodes, null));
    const sc = D.findScreens(nodes);
    screens.push(...sc.map((s: any) => ({ board: boardId, ...s })));
    arrows.push(...D.findArrows(nodes, sc).map((a: any) => ({ board: boardId, ...a })));
    D.collectValues(nodes, vals);
    summary.boards.push({ id: boardId, name: board.name, nodes: nodes.length, hidden_in_instances: nodes.filter(x => x.from_component !== undefined).length, screens: sc.length, hash: board.hash });
  }
  writeJson(join(outDir, 'screens.json'), screens);
  const styleKey = (a: any) => JSON.stringify(a.style), count = new Map<string, number>();
  for (const a of arrows) count.set(styleKey(a), (count.get(styleKey(a)) ?? 0) + 1);
  const flow = [...count].sort((a, b) => b[1] - a[1])[0]?.[0];
  for (const a of arrows) a.kind = styleKey(a) === flow ? 'flow' : 'pointer';
  writeJson(join(outDir, 'arrows.json'), arrows);
  const valued = (o: any, k: string) => {
    const m = vals.get(k); if (!m) return o;
    const e = [...m].sort((a, b) => b[1] - a[1]);
    return e.length === 1 ? { ...o, value: JSON.parse(e[0][0]) } : { ...o, values: e.map(([v, c]) => ({ value: JSON.parse(v), nodes: c })) };
  };
  writeJson(join(outDir, 'library.json'), { variables: [...lib.variables.values()].map(v => valued(v, `${v.collection}/${v.name}`)),
    styles: [...lib.styles.values()].map(s => valued(s, `style:${s.type}:${s.name}`)), components: [...lib.components.values()] });
  if (summary_extras) summary.extras = summary_extras;
  summary.unnamed_variables = unnamed.size; summary.unnamed_variable_ids = [...unnamed];
  writeJson(join(outDir, 'summary.json'), summary);
  console.log(`${summary.boards.length} board(s) converted (${summary.boards.reduce((s: number, b: any) => s + b.nodes, 0)} nodes, ${screens.length} screens, ${arrows.length} arrows); ${unnamed.size} variable id(s) without a name; out: ${rel(outDir)}`);
}

// the plan fingerprint source.js computes (figma-source.ts hashes.json), from the REST tree: the plugin walk skips layers
// hidden inside instances and everything inside a hidden instance, so they are left out here too
function fingerprint(doc: any, origin: number[], videos: Map<string, any[]> = new Map()) {
  let h = 0x811c9dc5;
  const feed = (s: string) => { for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } };
  const hex = (c: any, a: number) => '#' + [c.r, c.g, c.b, a].map((v: number) => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
  const paintKey = (ps: any) => Array.isArray(ps) ? ps.filter((f: any) => f.visible !== false).map((f: any) =>
    f.type === 'SOLID' ? hex(f.color, f.opacity === undefined ? 1 : f.opacity) : f.type === 'IMAGE' ? f.imageRef : f.type).join(';') : '';
  // video fills (from the extras call) read as VIDEO, as the plugin sees them; REST says IMAGE
  const videoFills = (n: any) => { const v = videos.get(n.id); if (!v || !Array.isArray(n.fills)) return n.fills;
    const f = n.fills.map((p: any) => ({ ...p })); for (const [i] of v) if (f[i]) f[i].type = 'VIDEO'; return f; };
  // a text's fills as the plugin reads them: the fills every character has, or figma.mixed when they differ
  const textPaint = (n: any) => {
    const ov: number[] = n.characterStyleOverrides ?? [], len = (n.characters ?? '').length, keys = new Set<string>();
    for (let i = 0; i < Math.max(len, 1); i++) { const k = ov[i] ?? 0; keys.add(paintKey((k && n.styleOverrideTable?.[k]?.fills) || n.fills)); }
    return keys.size > 1 ? 'mixed' : [...keys][0];
  };
  const go = (n: any, hid: boolean, inInst: boolean) => {
    if (inInst && n.visible === false) return;
    const hidden = hid || n.visible === false, a = n.absoluteBoundingBox, txt = n.type === 'TEXT' && !hidden ? n.characters : '';
    const line = `${n.id}|${n.type}|${n.name}|${hidden ? 0 : 1}|${a ? [r2(a.x - origin[0]), r2(a.y - origin[1]), r2(a.width), r2(a.height)] : [r2(-origin[0]), r2(-origin[1]), 0, 0]}|${txt}|${hidden || n.type === 'GROUP' ? '' : n.type === 'TEXT' ? textPaint(n) : paintKey(videoFills(n))}|${n.opacity ?? 1}\n`;
    feed(line); if (process.env.FIGMA_REST_FP_DUMP) appendFileSync(process.env.FIGMA_REST_FP_DUMP, JSON.stringify(line) + "\n");
    if (n.type === 'INSTANCE' && hidden) return; // the plugin walk does not enter a hidden instance either
    for (const c of n.children ?? []) go(c, hidden, inInst || n.type === 'INSTANCE');
  };
  go(doc, false, false);
  return h.toString(16).padStart(8, '0');
}

function inv(a: number[][]) { const d = a[0][0] * a[1][1] - a[0][1] * a[1][0] || 1; return [[a[1][1] / d, -a[0][1] / d], [-a[1][0] / d, a[0][0] / d]]; }
function mul(a: number[][], b: number[][]) { return [[a[0][0] * b[0][0] + a[0][1] * b[1][0], a[0][0] * b[0][1] + a[0][1] * b[1][1]], [a[1][0] * b[0][0] + a[1][1] * b[1][0], a[1][0] * b[0][1] + a[1][1] * b[1][1]]]; }
// absoluteTransform's translation: the absolute box is the box of the node's own rectangle (0,0)-(w,h) under its
// absolute linear part, so the translation is the box's corner minus the smallest mapped corner
function translation(lin: number[][], size: { x: number; y: number }, b: any) {
  const cs = [[0, 0], [size.x, 0], [0, size.y], [size.x, size.y]].map(([x, y]) => [lin[0][0] * x + lin[0][1] * y, lin[1][0] * x + lin[1][1] * y]);
  return [b.x - Math.min(...cs.map(c => c[0])), b.y - Math.min(...cs.map(c => c[1]))];
}
// the plugin's gradientTransform from REST's handle positions: the inverse of the map taking gradient space to the
// three handles — linear: (0,.5) start, (1,.5) end, (0,1) width; radial, diamond, angular: (.5,.5) centre, (1,.5) and
// (.5,1) the two radii
function gradientTransform(h: { x: number; y: number }[], linear: boolean) {
  const [p0, p1, p2] = h;
  const [a, b, d, e] = linear ? [p1.x - p0.x, 2 * (p2.x - p0.x), p1.y - p0.y, 2 * (p2.y - p0.y)] : [2 * (p1.x - p0.x), 2 * (p2.x - p0.x), 2 * (p1.y - p0.y), 2 * (p2.y - p0.y)];
  const c = linear ? p0.x - b / 2 : p0.x - a / 2 - b / 2, f = linear ? p0.y - e / 2 : p0.y - d / 2 - e / 2;
  const det = a * e - b * d; if (!det) return [[1, 0, 0], [0, 1, 0]];
  return [[e / det, -b / det, (b * f - c * e) / det], [-d / det, a / det, (c * d - a * f) / det]].map(r => r.map(r2));
}

// figma-source.ts's derived views (metadataXml, findScreens, findArrows, collectValues), loaded from its source so the
// prototype uses exactly the same rules without editing or copying that file
function derived(): { metadataXml: Function; findScreens: Function; findArrows: Function; collectValues: Function } {
  const s = readFileSync(join(ROOT, 'scripts', 'figma-source.ts'), 'utf8');
  const a = s.indexOf('// ---- derived views'), b = s.indexOf('// ---- crop');
  if (a < 0 || b < a) throw new Error('figma-source.ts: derived views section not found');
  const js = (nodeModule as any).stripTypeScriptTypes(s.slice(a, b) + '\nfunction r2(n: number) { return Math.round(n * 100) / 100; }');
  return new Function(`${js}\nreturn { metadataXml, findScreens, findArrows, collectValues };`)();
}
