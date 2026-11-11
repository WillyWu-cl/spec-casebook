// PROTOTYPE (2026-11-11): compares the REST conversion (scripts/figma-rest.ts convert → rest/out/) with the use_figma
// source read (figma-source.ts merge → out/) board by board and lists every field that differs, so the user can judge
// whether REST could replace the MCP route. Read-only on both sides.
// Usage: node scripts/figma-rest-parity.ts <product>/<feature> [<spec-set folder>] [--examples 5] [--tol 0.011]
// Writes rest/parity.json (every differing field path with counts and examples) and prints a summary. Field paths
// collapse array positions (`fills[].color`, `text.runs[].letter_spacing`); numbers within --tol count as equal.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { arg, assertIds, featureDir, ROOT, writeJson } from './lib/library.ts';
import { listSpecSets } from './lib/specs.ts';

const argv = process.argv.slice(2).filter((a, i, all) => !a.startsWith('--') && !(i > 0 && ['--examples', '--tol'].includes(all[i - 1])));
const [feature] = argv;
if (!feature) { console.error('Usage: node scripts/figma-rest-parity.ts <product>/<feature> [<set>] [--examples 5] [--tol 0.011]'); process.exit(2); }
assertIds(feature, 'ios');
const specs = join(featureDir(feature), 'specs');
const sets = listSpecSets(feature).map(s => s.folder);
const set = sets.includes(argv[1]) ? argv[1] : [...sets].reverse().find(s => existsSync(join(specs, s, 'extracted', 'figma-source', 'design', 'rest', 'out')));
if (!set) { console.error('No spec set has figma-source/design/rest/out (run figma-rest.ts fetch and convert first)'); process.exit(2); }
const src = join(specs, set, 'extracted', 'figma-source', 'design'), mcpDir = join(src, 'out'), restDir = join(src, 'rest', 'out');
if (!existsSync(mcpDir)) { console.error(`${mcpDir} missing: run figma-source.ts merge design first`); process.exit(2); }
const EX = Number(arg('examples') ?? 5), TOL = Number(arg('tol') ?? 0.011);
const read = (p: string): any => JSON.parse(readFileSync(p, 'utf8'));
// figma-source bookkeeping that is not Figma data (copies the shrink step left in place)
const INTERNAL = new Set(['copy_of', 'copied', 'copied_drawn', 'inside_hash', 'index', 'depth']);

type Diff = { path: string; only_mcp: number; only_rest: number; differ: number; examples: any[] };
const fields = new Map<string, Diff>();
const note = (path: string, kind: 'only_mcp' | 'only_rest' | 'differ', ex: any) => {
  const d = fields.get(path) ?? { path, only_mcp: 0, only_rest: 0, differ: 0, examples: [] }; fields.set(path, d);
  d[kind]++; if (d.examples.length < EX) d.examples.push(ex);
};
const same = (a: any, b: any): boolean => typeof a === 'number' && typeof b === 'number' ? Math.abs(a - b) <= Math.max(TOL, Math.abs(a) * 1e-8) : a === b;
// values the plugin writes that carry no data (an empty boundVariables map, a mixed radius with no corner values):
// counted, not listed as differences
const empty = (x: any) => x && typeof x === 'object' && (Array.isArray(x) ? x.length > 0 && x.every(v => v === null) : Object.keys(x).length === 0);
const ignored = new Map<string, number>();
// leaf-by-leaf comparison; arrays of different length are one difference at their own path
const cmp = (a: any, b: any, path: string, id: string) => {
  const isObj = (x: any) => x && typeof x === 'object';
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) { note(path, 'differ', { id, mcp: a, rest: b }); return; }
    a.forEach((x, i) => cmp(x, b[i], `${path}[]`, id)); return;
  }
  if (isObj(a) && isObj(b) && !Array.isArray(a) && !Array.isArray(b)) {
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
      if (!path && INTERNAL.has(k)) continue;
      const p = path ? `${path}.${k}` : k;
      if (!(k in b) && empty(a[k])) ignored.set(p, (ignored.get(p) ?? 0) + 1);
      else if (!(k in b)) note(p, 'only_mcp', { id, mcp: a[k] });
      else if (!(k in a)) note(p, 'only_rest', { id, rest: b[k] });
      else cmp(a[k], b[k], p, id);
    }
    return;
  }
  if (!same(a, b)) note(path, 'differ', { id, mcp: a, rest: b });
};

const boards: any[] = [];
for (const f of readdirSync(restDir).filter(f => /^\d+-\d+\.json$/.test(f))) {
  const r = read(join(restDir, f)), mp = join(mcpDir, f);
  if (!existsSync(mp)) { boards.push({ board: r.board.id, name: r.board.name, error: 'no MCP out file' }); continue; }
  const m = read(mp);
  const mById = new Map<string, any>(m.nodes.map((n: any) => [n.id, n])), rById = new Map<string, any>(r.nodes.map((n: any) => [n.id, n]));
  const onlyM = m.nodes.filter((n: any) => !rById.has(n.id)), onlyR = r.nodes.filter((n: any) => !mById.has(n.id));
  const kind = (n: any) => `${n.type}${n.hidden ? n.from_component !== undefined ? ' hidden-in-instance' : ' hidden' : ''}${n.made_up_id ? ' made-up-id' : ''}`;
  const tally = (l: any[]) => Object.entries(l.reduce((s: any, n: any) => (s[kind(n)] = (s[kind(n)] ?? 0) + 1, s), {})).sort((a: any, b: any) => b[1] - a[1]);
  let order = 0, parent = 0, nodesDiffer = 0;
  // order: the relative order of the shared ids
  const shared = m.nodes.filter((n: any) => rById.has(n.id)).map((n: any) => n.id), rOrder = r.nodes.filter((n: any) => mById.has(n.id)).map((n: any) => n.id);
  shared.forEach((id: string, i: number) => { if (rOrder[i] !== id) order++; });
  const before = fields.size ? [...fields.values()].reduce((s, d) => s + d.only_mcp + d.only_rest + d.differ, 0) : 0;
  for (const id of shared) {
    const a = mById.get(id), b = rById.get(id);
    if (a.parent !== b.parent) parent++;
    const was = [...fields.values()].reduce((s, d) => s + d.only_mcp + d.only_rest + d.differ, 0);
    cmp(a, b, '', id);
    if ([...fields.values()].reduce((s, d) => s + d.only_mcp + d.only_rest + d.differ, 0) > was) nodesDiffer++;
  }
  const after = [...fields.values()].reduce((s, d) => s + d.only_mcp + d.only_rest + d.differ, 0);
  boards.push({ board: r.board.id, name: r.board.name, mcp_nodes: m.nodes.length, rest_nodes: r.nodes.length, shared: shared.length,
    nodes_identical: shared.length - nodesDiffer, out_of_order: order, parent_differs: parent, field_differences: after - before,
    mcp_hash: m.board.hash, rest_hash: r.board.hash, hash_equal: m.board.hash === r.board.hash, mcp_read_at: m.board.read_at,
    only_mcp: { count: onlyM.length, kinds: tally(onlyM), examples: onlyM.slice(0, EX).map((n: any) => [n.id, n.type, n.name]) },
    only_rest: { count: onlyR.length, kinds: tally(onlyR), examples: onlyR.slice(0, EX).map((n: any) => [n.id, n.type, n.name]) } });
}
// derived files: screens and arrows (what the design check walks)
const derived: any = {};
for (const f of ['screens.json', 'arrows.json']) {
  if (!existsSync(join(mcpDir, f)) || !existsSync(join(restDir, f))) continue;
  const a = read(join(mcpDir, f)), b = read(join(restDir, f)), key = (x: any) => `${x.board}|${x.id}`;
  const am = new Map<string, any>(a.map((x: any) => [key(x), x])), bm = new Map<string, any>(b.map((x: any) => [key(x), x]));
  const strip = (x: any) => { const { crop, ...rest } = x; return rest; };
  derived[f] = { mcp: a.length, rest: b.length, only_mcp: [...am.keys()].filter(k => !bm.has(k)), only_rest: [...bm.keys()].filter(k => !am.has(k)),
    differ: [...am.keys()].filter(k => bm.has(k) && JSON.stringify(strip(am.get(k))) !== JSON.stringify(strip(bm.get(k)))).slice(0, 50).map(k => ({ key: k, mcp: strip(am.get(k)), rest: strip(bm.get(k)) })) };
}
const list = [...fields.values()].sort((a, b) => (b.only_mcp + b.only_rest + b.differ) - (a.only_mcp + a.only_rest + a.differ));
const out = join(src, 'rest', 'parity.json');
writeJson(out, { compared_at: new Date().toISOString(), tolerance: TOL, boards, derived, fields: list, ignored_plugin_empty_values: Object.fromEntries(ignored) });
const tot = (k: string) => boards.reduce((s, b) => s + (b[k] ?? 0), 0);
console.log(`${boards.length} board(s): MCP ${tot('mcp_nodes')} nodes, REST ${tot('rest_nodes')}, shared ${tot('shared')}, identical ${tot('nodes_identical')}; out of order ${tot('out_of_order')}, parent differs ${tot('parent_differs')}`);
for (const b of boards) console.log(`  ${b.board} ${b.name}: ${b.error ?? `${b.nodes_identical}/${b.shared} identical, only MCP ${b.only_mcp.count}, only REST ${b.only_rest.count}, hash ${b.hash_equal ? 'equal' : `${b.mcp_hash} vs ${b.rest_hash}`}`}`);
for (const [f, d] of Object.entries<any>(derived)) console.log(`  ${f}: MCP ${d.mcp}, REST ${d.rest}, only MCP ${d.only_mcp.length}, only REST ${d.only_rest.length}, differ ${d.differ.length}${d.differ.length === 50 ? '+' : ''}`);
if (ignored.size) console.log(`plugin-only empty values ignored: ${[...ignored].map(([k, v]) => `${k} ${v}`).join(', ')}`);
console.log('fields (only MCP / only REST / differ):');
for (const d of list.slice(0, 60)) console.log(`  ${d.path}: ${d.only_mcp} / ${d.only_rest} / ${d.differ}`);
if (list.length > 60) console.log(`  … ${list.length - 60} more in ${out.slice(ROOT.length + 1)}`);
