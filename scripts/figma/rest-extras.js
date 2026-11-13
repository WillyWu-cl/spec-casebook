// PROTOTYPE (2026-11-11): the few things the Figma REST API does not give, read in ONE read-only use_figma call so a
// REST source read (scripts/figma-rest.ts) is complete. scripts/figma-rest.ts calls fills the placeholders:
//   __BOARDS__       board ids (one page): walked for the node facts below
//   __VARS__         variable ids REST returned (boundVariables): name, collection, type and remote flag, returned in
//                    the same order (no ids, to stay small; figma-rest.ts keeps the list it sent). Values per mode
//                    are left out (they alone are about 38 KB here); the MCP read does not have them either
//   __COLLECTIONS__  [collection id, mode id] pairs from REST explicitVariableModes: their names
//   __VECTORS__      the ids of shown stroked vectors REST gives no strokeJoin for (ids, not walk positions: the
//                    plugin walk and REST count hidden layers inside instances differently, 2026-11-12), packed as
//                    { s: [id segments], b: { board: "i.j,k" } }: an id is its segments (base-36 indexes, `.`) joined
//                    by `;`, with `I` in front when it has more than one: only a join other than MITER comes back. Caps need no list: REST leaves out
//                    strokeCap exactly when it is figma.mixed (vertex caps), so every mixed-cap vector is returned
// Node facts REST leaves out: a vector's caps and joins set per vertex (REST omits strokeCap / strokeJoin then; the
// plugin reports the node's value or figma.mixed, and source.js finds the arrowhead from the vertex caps), corner radius
// on boolean operations, and video fills (a loose TEXT label listed as a board has no findAll: 2026-11-12) (REST reports them as an IMAGE with the thumbnail).
const BOARDS = __BOARDS__, VARS = __VARS__, COLS = __COLLECTIONS__, VECTORS = __VECTORS__, BUDGET = 38000;
const t0 = Date.now(), MIXED = figma.mixed;
const r2 = n => Math.round(n * 100) / 100;
const hex = c => '#' + [c.r, c.g, c.b, c.a === undefined ? 1 : c.a].map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
const first = await figma.getNodeByIdAsync(BOARDS[0]);
if (!first) throw new Error(`node ${BOARDS[0]} not found`);
let page = first; while (page.type !== 'PAGE') page = page.parent;
await figma.setCurrentPageAsync(page);

// ---- variables and collections ------------------------------------------------------------------------------------
const colCache = new Map();
const col = async id => {
  if (!colCache.has(id)) { let c = null; try { c = await figma.variables.getVariableCollectionByIdAsync(id); } catch (e) {}
    colCache.set(id, c ? { name: c.name, modes: Object.fromEntries(c.modes.map(m => [m.modeId, m.name])) } : null); }
  return colCache.get(id);
};
const vars = [];
for (const id of VARS) {
  let v = null; try { v = await figma.variables.getVariableByIdAsync(id); } catch (e) {}
  if (!v) { vars.push(0); continue; }
  const c = await col(v.variableCollectionId);
  vars.push([v.name, c ? c.name : '', v.resolvedType, v.remote ? 1 : 0]);
}
const cols = [];
for (const [cid, mid] of COLS) { const c = await col(cid); cols.push([c ? c.name : null, c ? c.modes[mid] || null : null]); }

// ---- node facts per board -------------------------------------------------------------------------------------------
const isHead = c => c === 'ARROW_LINES' || c === 'ARROW_EQUILATERAL' || c === 'TRIANGLE_FILLED' || c === 'CIRCLE_FILLED' || c === 'DIAMOND_FILLED';
const absPt = (v, p) => { const t = v.absoluteTransform; return [t[0][0] * p.x + t[0][1] * p.y + t[0][2], t[1][0] * p.x + t[1][1] * p.y + t[1][2]]; };
// source.js's arrowPath for a vector network (tail to head)
const arrowPath = (v, net) => {
  const hi = net.vertices.findIndex(x => isHead(x.strokeCap));
  if (hi < 0 && !isHead(v.strokeCap) && !/-->|arrow/i.test(v.name)) return null;
  const adj = net.vertices.map(() => []);
  for (const s of net.segments) { adj[s.start].push(s.end); adj[s.end].push(s.start); }
  const head = hi >= 0 ? hi : adj.findIndex(a => a.length === 1);
  if (head < 0) return null;
  let tail = adj.findIndex((a, i) => a.length === 1 && i !== head); if (tail < 0) tail = 0;
  const order = [tail], seen = new Set([tail]);
  for (let cur = tail; cur !== head;) { const nx = adj[cur].find(j => !seen.has(j)); if (nx === undefined) break; order.push(nx); seen.add(nx); cur = nx; }
  if (order[order.length - 1] !== head) order.push(head);
  return order.map(i => absPt(v, net.vertices[i]));
};
const boards = [];
for (const id of BOARDS) {
  const bd = await figma.getNodeByIdAsync(id);
  if (!bd) { boards.push({ id, missing: true }); continue; }
  const o = bd.absoluteBoundingBox || { x: 0, y: 0 }, vec = [], bool = [], video = [];
  // the asked vectors by id, and every mixed-cap vector: [id, cap, join, arrow | 0]
  const joinAt = new Set(VECTORS.b[id] ? VECTORS.b[id].split(',').map(x => { const g = x.split('.').map(k => VECTORS.s[parseInt(k, 36)]); return (g.length > 1 ? 'I' : '') + g.join(';'); }) : []);
  const list = [];
  { const go = n => { if (n.type === 'VECTOR' && (joinAt.has(n.id) || n.strokeCap === MIXED)) list.push([n.id, n]); if ('children' in n) for (const c of n.children) go(c); }; go(bd); }
  for (const [i, v] of list) {
    if (!Array.isArray(v.strokes) || !v.strokes.length) continue;
    const join = v.strokeJoin === MIXED ? 'mixed' : v.strokeJoin;
    const c = v.strokeCap === MIXED ? 'mixed' : 0, j = joinAt.has(i) && join !== 'MITER' ? join : 0;
    if (!c && !j) continue;
    let pa = null; if (c) try { pa = arrowPath(v, v.vectorNetwork); } catch (e) {}
    vec.push([v.id, c, j, pa ? pa.map(([x, y]) => [r2(x - o.x), r2(y - o.y)]) : 0]);
  }
  for (const b of ('findAllWithCriteria' in bd ? bd.findAllWithCriteria({ types: ['BOOLEAN_OPERATION'] }) : [])) {
    if (!('cornerRadius' in b)) continue;
    const r = b.cornerRadius === MIXED ? [b.topLeftRadius, b.topRightRadius, b.bottomRightRadius, b.bottomLeftRadius].map(r2) : r2(b.cornerRadius);
    if (Array.isArray(r) ? r.some(x => x) : r) bool.push([b.id, r, 'cornerSmoothing' in b && b.cornerSmoothing ? r2(b.cornerSmoothing) : 0]);
  }
  for (const n of ('findAll' in bd ? bd.findAll(n => 'fills' in n && Array.isArray(n.fills) && n.fills.some(p => p.type === 'VIDEO')) : []))
    video.push([n.id, n.fills.map((p, i) => p.type === 'VIDEO' ? [i, p.videoHash || ''] : null).filter(Boolean)]);
  boards.push({ id, vec, bool, video });
}
const out = { mode: 'rest-extras', read_at: new Date().toISOString(), vars, cols, boards, took_ms: Date.now() - t0 };
const bytes = JSON.stringify(out).length;
if (bytes > BUDGET) return { mode: 'rest-extras', error: `return is ${bytes} bytes, over ${BUDGET}`, sizes: { vars: JSON.stringify(vars).length, boards: boards.map(b => [b.id, JSON.stringify(b).length, b.vec && b.vec.length]) } };
return { ...out, bytes };
