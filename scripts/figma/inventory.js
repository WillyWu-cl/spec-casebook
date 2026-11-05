// Figma inventory of one board group (REQ-038): phone screens, tappable controls and flow arrows, read in ONE use_figma
// call per group so a large file costs a handful of Figma MCP calls, not one per element (Figma MCP has a daily quota).
// Run by the agent: read this file, replace the two placeholders, pass it as `code` to use_figma (read-only), and save
// the returned JSON as specs/<set>/extracted/figma-inventory-<group>.json; then run scripts/inventory.ts.
//   __PAGE__    the page id, e.g. '116:7873' (Design), '2016:2' (PM), '989:8' (MX)
//   __BOARDS__  JSON array of board (top-level frame) ids in the page's section, e.g. ['2778:127318','2566:113114'];
//               [] lists the boards only (ids, names, boxes, a rough size) so the groups can be chosen.
//               An entry can also be { id, name } (the board under another name, e.g. the spec PDF's board id) or a
//               region { name, parent: id | [ids], box: [x, y, w, h] } for a file whose phones and arrows lie loose
//               in a page or frame (the PM and MX files): the board is the parents' visible children (sections
//               excluded) whose centre lies in the box (absolute canvas points).
// Output (compact; indices are local to this group, scripts/inventory.ts merges the groups):
//   section: [id, name, x, y, w, h]          absolute canvas box of the section holding the boards
//   boards:  [[id, name, x, y, w, h]]
//   names:   control layer names; controls refer to them by index
//   screens: [[id, board, name, x, y, w, h, 'panel'?]]  phone frames (300–450 wide; taller than 1000 = a long
//            scrolling page) and panels (dialogs, sheets, popups beside the phones), absolute boxes
//   controls:[[name, label, x, y, w, h, node, [screen…], parent]]  one per board + name + label + position (24-pt
//            buckets); x/y relative to the screen; node = first instance; parent = enclosing control or -1
//   hidden:  { screens, controls } skipped because the design does not draw them (hidden, opacity 0, layer blur,
//            or mostly outside a clipping frame or mask)
//   arrows:  [[id, name, [x,y,…], from, src, to, toNode, toName]]  vector points (absolute, tail first, head last);
//            from/to = screen index or -1, src = control under the tail or -1, toNode/toName = the smallest node under
//            the head when it is not a screen (popover, card). Vectors and lines with an arrowhead (or named 「-->」)
//            and connectors with an arrowhead, inside the board or drawn over it (overlays)
//   texts:   [[board, x, y, w, h, text, inPhone]]  every visible text of the board and its overlays (absolute box,
//            text cut at 4000 characters: a spec note is read whole, so figma-text.ts never finds its end gone;
//            inPhone 1 inside a phone screen), for scripts/figma-text.ts
//   entries, hash, hashed_at: the __BOARDS__ given, one fingerprint per board id and when it was taken (figma-check.ts)
//   overlay, overlay_box: per board id, the fingerprint of its overlays ('' = none) and the box of the board with them
// Overlays (user, 2026-11-04): what is drawn over a board without being inside its node — a loose arrow, connector,
//   note or shape on the page, a section or the board's parent (a region's parents) whose box reaches into the board.
//   A read of the board node alone misses them, and so did its fingerprint (PM board 11 lost its X → dialog arrow).
// Check mode (scripts/figma-check.ts writes the call): __BOARDS__ = { hash: [entries] } returns only
//   { mode: 'hash', hashed_at, boards: [[id, hash | null, overlay, [overlay arrow ids], box, holder]], others:
//   [[id, name]] }: the fingerprint of every board (null = gone) and of its overlays, the arrows drawn over it, the box
//   of board and overlays and the smallest section or frame holding that box ('' = only the page), and the boards on
//   the page that no entry covers, so a whole file is checked in one small call.
const PAGE = __PAGE__, BOARDS = __BOARDS__;
// Time budget (2026-11-05): a call that runs past the MCP connection's limit loses its whole reply ("transport dropped
// mid-call"), and loading a large page alone takes ~5 s. Past BUDGET ms the read stops with an error that does come
// back, naming the stage, so the group is split (figma-check.ts --split) instead of retried as it is.
const T0 = Date.now(), BUDGET = 40000;
const late = stage => { if (Date.now() - T0 > BUDGET) throw new Error(`INCOMPLETE after ${stage}: ${Date.now() - T0} ms; split this group into smaller reads`); };
const page = await figma.getNodeByIdAsync(PAGE);
await figma.setCurrentPageAsync(page);
const R = n => Math.round(n);
const box = n => { const b = n.absoluteBoundingBox; return b ? [R(b.x), R(b.y), R(b.width), R(b.height)] : null; };
const idOf = e => typeof e === 'string' ? e : e.id || [e.parent].flat()[0];
const first = BOARDS.length ? await figma.getNodeByIdAsync(idOf(BOARDS[0])) : null;
const sections = page.children.filter(n => n.type === 'SECTION' && 'children' in n).sort((a, b) => b.children.length - a.children.length);
const sec = first ? (typeof BOARDS[0] === 'object' && BOARDS[0].box ? first : first.parent) : sections[0] || page;
// a page has no box: use the union of what it draws
const secBox = n => box(n) || (() => { const bs = n.children.filter(c => c.visible !== false && c.absoluteBoundingBox).map(c => c.absoluteBoundingBox);
  const x0 = Math.min(...bs.map(b => b.x)), y0 = Math.min(...bs.map(b => b.y));
  return [R(x0), R(y0), R(Math.max(...bs.map(b => b.x + b.width)) - x0), R(Math.max(...bs.map(b => b.y + b.height)) - y0)]; })();
if (Array.isArray(BOARDS) && !BOARDS.length) {
  return { section: [sec.id, sec.name, ...secBox(sec)], boards: sec.children.filter(b => 'children' in b).map(b => [b.id, b.name.trim(), ...box(b), b.findAllWithCriteria({ types: ['INSTANCE'] }).length]) };
}
const SKIP = /^(Key|Keys|Keyboard|HomeIndicator|Home Indicator|iPhone X|Time|Status ?Bar|Background|bg)\b/i;
const TAP = /button|btn|^round\/ic_|^ic_|chip|tab\b|tabs|toggle|switch|link|select|thumb|card|imput|input|text ?field|search|scene|video|download|paycard|option|ViewMore|Launcher_|Free user|AI Smart Tools|checkbox|radio|slider|dropdown|menu|nav\/|Top\/|close|back/i;
// a phone frame: 300–450 wide, 600–1000 tall; a taller one is a long scrolling page unless it holds phone frames itself
const phoneSized = n => (n.type === 'FRAME' || n.type === 'INSTANCE' || n.type === 'COMPONENT') && n.width >= 300 && n.width <= 450 && n.height >= 600;
const isPhone = n => phoneSized(n) && (n.height <= 1000 || (n.height <= 6000 && !('findOne' in n && n.findOne(c => phoneSized(c) && c.height <= 1000))));
// how much of a node the design actually draws (0–1): hidden, transparent or layer-blurred ancestors draw nothing;
// clipping frames and masks above it cut its box (a screen parked outside its board, scroll content past the frame)
// Every ancestor's part is computed once and kept by node id (2026-11-05: walking every ancestor and searching each
// parent's child list per call took 4 s per 1,100 nodes, and the full read calls it several times per node, so reads
// of real boards ran past the MCP connection's time limit and their replies were lost).
const hiddenSelf = q => q.visible === false || ('opacity' in q && q.opacity < 0.05)
  || ('effects' in q && q.effects.some(e => e.visible !== false && e.type === 'LAYER_BLUR' && e.radius >= 4));
const meet = (r, c) => !c ? r : !r ? [c.x, c.y, c.x + c.width, c.y + c.height]
  : [Math.max(r[0], c.x), Math.max(r[1], c.y), Math.min(r[2], c.x + c.width), Math.min(r[3], c.y + c.height)];
const maskMemo = new Map(), inhMemo = new Map();
// the masks drawn before each child of p, as one cut per child id
const masksBefore = q => {
  const p = q.parent; if (!p || !('children' in p)) return null;
  let m = maskMemo.get(p.id);
  if (!m) { m = new Map(); let r = null; for (const c of p.children) { m.set(c.id, r); if ('isMask' in c && c.isMask && c.visible !== false) r = meet(r, c.absoluteBoundingBox); } maskMemo.set(p.id, m); }
  return m.get(q.id) ?? null;
};
// what q passes on to everything inside it: hidden, and the cut of its own clip, its ancestors' clips and masks
const inherit = q => {
  if (!q || q.type === 'PAGE') return { dead: false, rect: null };
  let v = inhMemo.get(q.id); if (v) return v;
  const up = inherit(q.parent), mb = masksBefore(q);
  let rect = up.rect; if (mb) rect = meet(rect, { x: mb[0], y: mb[1], width: mb[2] - mb[0], height: mb[3] - mb[1] });
  if (q.clipsContent) rect = meet(rect, q.absoluteBoundingBox);
  v = { dead: up.dead || hiddenSelf(q), rect }; inhMemo.set(q.id, v); return v;
};
const shown = n => {
  const b = n.absoluteBoundingBox; if (!b || !b.width || !b.height) return 0;
  if (hiddenSelf(n)) return 0;
  const up = inherit(n.parent); if (up.dead) return 0;
  let r = meet(up.rect, b); const mb = masksBefore(n);
  if (mb) r = [Math.max(r[0], mb[0]), Math.max(r[1], mb[1]), Math.min(r[2], mb[2]), Math.min(r[3], mb[3])];
  return Math.max(0, r[2] - r[0]) * Math.max(0, r[3] - r[1]) / (b.width * b.height);
};
// buttons drawn as plain frames rather than component instances
const TAPFRAME = /^(button|btn|cta|chip|tab|toggle|link|close|back)\b|button$/i;
const inside = (b, x, y, pad) => b && x >= b.x - pad && x <= b.x + b.width + pad && y >= b.y - pad && y <= b.y + b.height + pad;
// a region board stands in for a frame: its members are searched as a frame's children would be
const region = async e => {
  const [x, y, w, h] = e.box, nodes = [];
  for (const pid of [e.parent].flat()) { const p = await figma.getNodeByIdAsync(pid);
    for (const n of p ? p.children : []) { const b = n.absoluteBoundingBox;
      if (n.visible !== false && n.type !== 'SECTION' && b && b.x + b.width / 2 >= x && b.x + b.width / 2 <= x + w && b.y + b.height / 2 >= y && b.y + b.height / 2 <= y + h) nodes.push(n); } }
  const all = (n, f) => [...(f(n) ? [n] : []), ...('findAll' in n ? n.findAll(f) : [])];
  return { id: `${[e.parent].flat()[0]}/${e.name}`, name: e.name, type: 'REGION', children: nodes, absoluteBoundingBox: { x, y, width: w, height: h },
    findAll: f => nodes.flatMap(n => all(n, f)),
    findAllWithCriteria: o => nodes.flatMap(n => [...(o.types.includes(n.type) ? [n] : []), ...('findAllWithCriteria' in n ? n.findAllWithCriteria(o) : [])]) };
};
const boardOf = async e => typeof e === 'object' && e.box ? await region(e) : await figma.getNodeByIdAsync(idOf(e));
// a board's fingerprint: FNV-1a over everything it draws (type, name, box relative to the board, text, fills, opacity);
// group and check mode share it, so a board re-read after a check carries the hash the check saw
const fingerprint = b => hashOf(b.children, b.absoluteBoundingBox);
const hashOf = (nodes, o) => {
  let h = 0x811c9dc5;
  const feed = s => { for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } };
  const paint = n => 'fills' in n && Array.isArray(n.fills) ? n.fills.filter(f => f.visible !== false).map(f =>
    f.type === 'SOLID' ? `${R(f.color.r * 255)},${R(f.color.g * 255)},${R(f.color.b * 255)},${f.opacity ?? 1}` : f.type === 'IMAGE' ? f.imageHash : f.type).join(';') : '';
  const walk = n => {
    if (n.visible === false) return;
    const a = n.absoluteBoundingBox;
    feed(`${n.type}|${n.name}|${a ? [R(a.x - o.x), R(a.y - o.y), R(a.width), R(a.height)] : ''}|${n.type === 'TEXT' ? n.characters : ''}|${paint(n)}|${'opacity' in n ? n.opacity : 1}\n`);
    if ('children' in n) for (const c of n.children) walk(c);
  };
  for (const c of nodes) walk(c);
  return h.toString(16).padStart(8, '0');
};
const isHead = c => c === 'ARROW_LINES' || c === 'ARROW_EQUILATERAL' || c === 'TRIANGLE_FILLED';
const abs = (v, p) => { const t = v.absoluteTransform; return [R(t[0][0] * p.x + t[0][1] * p.y + t[0][2]), R(t[1][0] * p.x + t[1][1] * p.y + t[1][2])]; };
const drawn = n => { for (let q = n; q && q.type !== 'PAGE'; q = q.parent) if (q.visible === false) return false; return true; };
// a connector end: a free point (in its parent's coordinates) or a side of the node it is attached to (AUTO: the side
// facing the other end)
const connEnd = async (v, e, other) => {
  if (e.position) { const t = v.parent && v.parent.type !== 'PAGE' && v.parent.absoluteTransform; return [R(e.position.x + (t ? t[0][2] : 0)), R(e.position.y + (t ? t[1][2] : 0))]; }
  const n = e.endpointNodeId && await figma.getNodeByIdAsync(e.endpointNodeId), b = n && n.absoluteBoundingBox;
  if (!b) return null;
  const cx = R(b.x + b.width / 2), cy = R(b.y + b.height / 2);
  const side = { TOP: [cx, R(b.y)], BOTTOM: [cx, R(b.y + b.height)], LEFT: [R(b.x), cy], RIGHT: [R(b.x + b.width), cy], CENTER: [cx, cy] }[e.magnet];
  if (side) return side;
  if (!other) return [cx, cy];
  const dx = other[0] - cx, dy = other[1] - cy;
  return Math.abs(dx) / b.width > Math.abs(dy) / b.height ? [R(dx > 0 ? b.x + b.width : b.x), cy] : [cx, R(dy > 0 ? b.y + b.height : b.y)];
};
// an arrow's points (absolute, tail first, head last), or null when the node is no arrow
const arrowPts = async v => {
  if (!drawn(v)) return null;
  if (v.type === 'CONNECTOR') {
    const sh = isHead(v.connectorStartStrokeCap), eh = isHead(v.connectorEndStrokeCap);
    if (!sh && !eh && !v.name.includes('-->')) return null;
    let a = await connEnd(v, v.connectorStart, null); const b = await connEnd(v, v.connectorEnd, a); a = await connEnd(v, v.connectorStart, b);
    return a && b ? (sh && !eh ? [b, a] : [a, b]) : null;
  }
  if (v.type === 'LINE') return v.name.includes('-->') || isHead(v.strokeCap) ? [abs(v, { x: 0, y: 0 }), abs(v, { x: v.width, y: 0 })] : null;
  if (v.type !== 'VECTOR') return null;
  let net; try { net = v.vectorNetwork; } catch (e) { return null; }
  const hi = net.vertices.findIndex(x => isHead(x.strokeCap));
  if (hi < 0 && !v.name.includes('-->')) return null;
  // walk the path from the free end without an arrowhead to the arrowhead
  const adj = net.vertices.map(() => []);
  for (const s of net.segments) { adj[s.start].push(s.end); adj[s.end].push(s.start); }
  const head = hi >= 0 ? hi : adj.findIndex(a => a.length === 1);
  let tail = adj.findIndex((a, i) => a.length === 1 && i !== head); if (tail < 0) tail = 0;
  const order = [tail], seen = new Set([tail]);
  for (let cur = tail; cur !== head;) { const nx = adj[cur].find(j => !seen.has(j)); if (nx === undefined) break; order.push(nx); seen.add(nx); cur = nx; }
  if (order[order.length - 1] !== head) order.push(head);
  return order.map(i => abs(v, net.vertices[i]));
};
const ARROWISH = ['VECTOR', 'LINE', 'CONNECTOR'];
const arrowNodes = n => [...(ARROWISH.includes(n.type) ? [n] : []), ...('findAllWithCriteria' in n ? n.findAllWithCriteria({ types: ARROWISH }) : [])];
const meets = (a, b) => a && b && a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;
const covers = (a, b) => a.x <= b.x && a.y <= b.y && a.x + a.width >= b.x + b.width && a.y + a.height >= b.y + b.height;
const overlaysOf = async (b, e) => {
  const o = b.absoluteBoundingBox, region = b.type === 'REGION', mine = new Set(region ? b.children.map(n => n.id) : [b.id]), above = new Set();
  if (!region) for (let q = b.parent; q; q = q.parent) above.add(q.id);
  const holders = [page, ...page.children.filter(n => n.type === 'SECTION')];
  if (!region && b.parent && b.parent.type !== 'PAGE') holders.push(b.parent);
  if (region) for (const p of [e.parent].flat()) { const n = await figma.getNodeByIdAsync(p); if (n && 'children' in n) holders.push(n); }
  const seen = new Set(), res = [];
  for (const h of holders) for (const n of h.children) {
    if (seen.has(n.id) || mine.has(n.id) || above.has(n.id) || n.type === 'SECTION' || n.visible === false) continue;
    seen.add(n.id);
    const nb = n.absoluteBoundingBox; if (!meets(nb, o) || covers(nb, o)) continue;
    const cx = nb.x + nb.width / 2, cy = nb.y + nb.height / 2;
    // a neighbouring board that only reaches over the edge is not drawn over this one; a region's members are the
    // loose nodes centred in its box, so a node centred inside is already read
    if (nb.width >= 300 && nb.height >= 300 && !inside(o, cx, cy, 0)) continue;
    if (region && inside(o, cx, cy, 0)) continue;
    res.push(n);
  }
  return res.sort((a, c) => a.id < c.id ? -1 : 1);
};
// the arrows drawn over a board: overlay arrows with their tail or head on it
const overlayArrows = async (b, ov) => {
  const o = b.absoluteBoundingBox, res = [];
  for (const n of ov) for (const v of arrowNodes(n)) {
    const pts = await arrowPts(v);
    if (pts && (inside(o, pts[0][0], pts[0][1], 0) || inside(o, pts[pts.length - 1][0], pts[pts.length - 1][1], 0))) res.push({ v, pts });
  }
  return res;
};
const unionBox = (o, ov) => { let x0 = o.x, y0 = o.y, x1 = o.x + o.width, y1 = o.y + o.height;
  for (const n of ov) { const b = n.absoluteBoundingBox; x0 = Math.min(x0, b.x); y0 = Math.min(y0, b.y); x1 = Math.max(x1, b.x + b.width); y1 = Math.max(y1, b.y + b.height); }
  return [R(x0), R(y0), R(x1 - x0), R(y1 - y0)]; };
if (BOARDS.hash) {
  const res = { mode: 'hash', hashed_at: new Date().toISOString(), boards: [], others: [] }, boxes = [], parents = new Set();
  for (const e of BOARDS.hash) {
    const id = typeof e === 'object' && e.box ? `${[e.parent].flat()[0]}/${e.name}` : idOf(e);
    const b = await boardOf(e);
    if (!b) { res.boards.push([id, null]); } else {
      const ov = await overlaysOf(b, e), ub = unionBox(b.absoluteBoundingBox, ov), ubox = { x: ub[0], y: ub[1], width: ub[2], height: ub[3] };
      // the smallest section or frame holding board and overlays: get_screenshot of it, cut to the box, shows both
      let holder = '';
      for (let q = b.type === 'REGION' ? await figma.getNodeByIdAsync([e.parent].flat()[0]) : (ov.length ? b.parent : b); q && q.type !== 'PAGE'; q = q.parent) if (q.absoluteBoundingBox && covers(q.absoluteBoundingBox, ubox)) { holder = q.id; break; }
      res.boards.push([id, fingerprint(b), ov.length ? hashOf(ov, b.absoluteBoundingBox) : '', (await overlayArrows(b, ov)).map(a => a.v.id), ub, holder]);
    }
    if (b) { boxes.push(b.absoluteBoundingBox); if (b.type !== 'REGION') parents.add(b.parent.id); }
    if (typeof e === 'object' && e.box) for (const p of [e.parent].flat()) parents.add(p);
  }
  // boards no entry covers: board-sized children of the page, its sections and the regions' parents
  const listed = new Set(res.boards.map(([id]) => id)), seen = new Set();
  const holders = [page, ...page.children.filter(n => n.type === 'SECTION')];
  for (const p of parents) { const n = await figma.getNodeByIdAsync(p); if (n && 'children' in n) holders.push(n); }
  for (const p of holders) for (const n of p.children) {
    const b = n.absoluteBoundingBox;
    if (seen.has(n.id) || listed.has(n.id) || parents.has(n.id) || n.visible === false || !b || b.width < 300 || b.height < 300) continue;
    seen.add(n.id);
    const cx = b.x + b.width / 2, cy = b.y + b.height / 2;
    if (!boxes.some(x => inside(x, cx, cy, 0)) && res.others.length < 400) res.others.push([n.id, n.name.trim().slice(0, 40)]);
  }
  return res;
}
// one group's read (several groups can share a call: { groups } below)
const readGroup = async BOARDS => {
const first = await figma.getNodeByIdAsync(idOf(BOARDS[0]));
const sec = first ? (typeof BOARDS[0] === 'object' && BOARDS[0].box ? first : first.parent) : page;
const out = { section: [sec.id, sec.name, ...secBox(sec)], boards: [], names: [], screens: [], controls: [], arrows: [], hidden: { screens: 0, controls: 0 },
  entries: BOARDS, hash: {}, hashed_at: new Date().toISOString() };
const nameIdx = new Map(), ctlIdx = new Map(), inst = [];
const nameOf = s => { if (!nameIdx.has(s)) { nameIdx.set(s, out.names.length); out.names.push(s); } return nameIdx.get(s); };
const boardNodes = [];
out.overlay = {}; out.overlay_box = {}; out.texts = [];
const overlays = [];
for (const e of BOARDS) {
  const b = await boardOf(e);
  if (!b) continue;
  const ov = await overlaysOf(b, e);
  boardNodes.push(b); overlays.push(ov);
  out.boards.push([b.id, (typeof e === 'object' && e.name) || b.name.trim(), ...box(b)]); out.hash[b.id] = fingerprint(b);
  out.overlay[b.id] = ov.length ? hashOf(ov, b.absoluteBoundingBox) : ''; out.overlay_box[b.id] = unionBox(b.absoluteBoundingBox, ov);
}
// arrow geometry first: panels (dialogs, popups) are found partly by the arrows that point at them
const vectors = [], taken = new Set();
for (const [bi, board] of boardNodes.entries()) {
  for (const v of board.findAllWithCriteria({ types: ARROWISH })) { const pts = await arrowPts(v); if (pts && !taken.has(v.id)) { taken.add(v.id); vectors.push({ v, board, pts }); } }
  for (const { v, pts } of await overlayArrows(board, overlays[bi])) if (!taken.has(v.id)) { taken.add(v.id); vectors.push({ v, board, pts }); }
}
late('arrows');
const screenNodes = [];
boardNodes.forEach((b, bi) => {
  const walk = n => { if (n.visible === false) return;
    if (isPhone(n) && n.absoluteBoundingBox) { if (shown(n) < 0.5) { out.hidden.screens++; return; } screenNodes.push(n); out.screens.push([n.id, bi, n.name.slice(0, 40), ...box(n)]); return; }
    if ('children' in n) for (const c of n.children) walk(c); };
  walk(b);
});
// panels: dialogs, sheets, popups and menus drawn beside the phones (not inside one). A frame of dialog size counts
// (frame, instance or group) when its name says so or an arrow starts or ends within 40 pt of it; the outermost wins. Kept as screens with 'panel' set.
late('screens');
const PANEL = /dialog|popup|pop-up|sheet|toast|alert|modal|tooltip|menu|snackbar|leave|confirm/i;
const phones = new Set(screenNodes.map(n => n.id));
// inside a phone screen, kept by node id like shown()
const phoneMemo = new Map();
const underPhone = q => { if (!q || q.type === 'PAGE') return false; let v = phoneMemo.get(q.id);
  if (v === undefined) { v = phones.has(q.id) || underPhone(q.parent); phoneMemo.set(q.id, v); } return v; };
const inPhone = n => underPhone(n.parent);
const ends = vectors.flatMap(({ pts }) => [pts[0], pts[pts.length - 1]]);
const panelIds = new Set();
boardNodes.forEach((b, bi) => {
  const cands = b.findAll(n => (n.type === 'FRAME' || n.type === 'INSTANCE' || n.type === 'COMPONENT' || n.type === 'GROUP') && !phones.has(n.id)
    && n.width >= 160 && n.width <= 460 && n.height >= 50 && n.height <= 700 && n.absoluteBoundingBox && !inPhone(n)
    && (PANEL.test(n.name) || ends.some(([x, y]) => inside(n.absoluteBoundingBox, x, y, 40)))
    && !!n.findOne(t => t.type === 'TEXT' && t.visible !== false));
  for (const n of cands) {
    let nested = false; for (let q = n.parent; q && q !== b; q = q.parent) if (cands.includes(q)) nested = true;
    if (nested || shown(n) < 0.5) continue;
    panelIds.add(n.id); screenNodes.push(n); out.screens.push([n.id, bi, n.name.slice(0, 40), ...box(n), 'panel']);
  }
});
late('panels');
screenNodes.forEach((s, si) => {
  const panel = panelIds.has(s.id);
  const sb = s.absoluteBoundingBox, bi = out.screens[si][1];
  const visit = (n, parent) => {
    if (n.visible === false) return;
    let me = parent;
    // in a panel any button-shaped frame with one short text is a button (dialog actions are often plain frames)
    const short = () => { const ts = n.findAll(t => t.type === 'TEXT' && t.visible !== false); return ts.length === 1 && ts[0].characters.trim().split(/\s+/).length <= 4; };
    // a `btn` / `back` frame that only wraps icon or button instances is a holder: the instances inside are the controls
    const wraps = () => !!n.findOne(x => x.type === 'INSTANCE' && x.visible !== false && TAP.test(x.name) && !SKIP.test(x.name));
    const asFrame = (n.type === 'FRAME' && TAPFRAME.test(n.name.trim()) && n.width <= 400 && n.height <= 140 && !wraps())
      || (panel && (n.type === 'FRAME' || n.type === 'INSTANCE') && n.height >= 24 && n.height <= 64 && n.width >= 40 && n.width <= 420 && short());
    if ((n.type === 'INSTANCE' || asFrame) && n !== s) {
      if (SKIP.test(n.name)) return;
      if ((asFrame || TAP.test(n.name)) && n.absoluteBoundingBox) {
        if (shown(n) < 0.5) { out.hidden.controls++; return; }
        const b = n.absoluteBoundingBox, t = n.findOne(x => x.type === 'TEXT' && x.visible !== false);
        const label = t ? t.characters.replace(/\s+/g, ' ').trim().slice(0, 40) : '';
        const rx = R(b.x - sb.x), ry = R(b.y - sb.y);
        const key = `${bi}|${n.name}|${label}|${Math.round(rx / 24)},${Math.round(ry / 24)}`;
        if (!ctlIdx.has(key)) { ctlIdx.set(key, out.controls.length); out.controls.push([nameOf(n.name.slice(0, 48)), label, rx, ry, R(b.width), R(b.height), n.id, [], parent]); }
        const ci = ctlIdx.get(key), c = out.controls[ci];
        if (!c[7].includes(si)) c[7].push(si);
        inst.push({ ci, si, b });
        me = ci;
        if (b.width < 120 || b.height < 60) return; // small controls hold no separate buttons
      }
    }
    if ('children' in n) for (const c of n.children) visit(c, me);
  };
  for (const c of s.children) visit(c, -1);
});
late('controls');
const heads = new Map();
const screenAt = (x, y, pad) => { let best = -1, area = Infinity; screenNodes.forEach((s, i) => { const b = s.absoluteBoundingBox; if (inside(b, x, y, pad) && b.width * b.height < area) { best = i; area = b.width * b.height; } }); return best; };
for (const { v, board, pts } of vectors) {
  const [tx, ty] = pts[0], [hx, hy] = pts[pts.length - 1];
  const from = screenAt(tx, ty, 4), to = screenAt(hx, hy, 24);
  let src = -1, area = Infinity;
  for (const it of inst) if ((from < 0 || it.si === from) && inside(it.b, tx, ty, 6) && it.b.width * it.b.height < area) { src = it.ci; area = it.b.width * it.b.height; }
  let toNode = '', toName = '';
  if (to < 0) {
    // the nodes an arrow head can land on, listed once per board (a search of the whole board per arrow was slow)
    if (!heads.has(board)) heads.set(board, board.findAll(n => n.visible !== false && n.type !== 'VECTOR' && n.type !== 'LINE' && n.type !== 'TEXT'
      && n.width > 40 && n.height > 30 && n.absoluteBoundingBox).map(n => ({ n, b: n.absoluteBoundingBox, a: n.width * n.height })).sort((p, q) => p.a - q.a));
    const h = heads.get(board).find(c => inside(c.b, hx, hy, 12))?.n;
    if (h) { toNode = h.id; const t = 'findOne' in h ? h.findOne(x => x.type === 'TEXT' && x.visible !== false) : null; toName = `${h.name}${t ? ` 「${t.characters.replace(/\s+/g, ' ').slice(0, 30)}」` : ''}`.slice(0, 60); }
  }
  out.arrows.push([v.id, v.name.slice(0, 60), pts.flat(), from, src, to, toNode, toName]);
}
late('arrow targets');
// every visible text of a board and its overlays, for comparing a changed board's words with the spec notes
boardNodes.forEach((b, bi) => {
  const seen = new Set();
  for (const t of [b, ...overlays[bi]].flatMap(n => [...(n.type === 'TEXT' ? [n] : []), ...('findAllWithCriteria' in n ? n.findAllWithCriteria({ types: ['TEXT'] }) : [])])) {
    if (!t.characters.trim() || shown(t) < 0.5) continue;
    const bx = box(t), k = `${t.characters}|${bx}`;
    if (seen.has(k)) continue; seen.add(k);
    out.texts.push([bi, ...bx, t.characters.slice(0, 4000), inPhone(t) ? 1 : 0]);
  }
});
out.ms = Date.now() - T0;
out.size = JSON.stringify(out).length;
return out;
};
// Several groups in one call (figma-check.ts --plan, 2026-11-05): BOARDS = { groups: { <name>: [entries] } } reads
// them in order and returns { mode: 'groups', groups: { <name>: read }, pending: [names], ms }. A group that would push
// the reply past MAXREPLY characters (the MCP reply limit is ~48 KB) or that runs out of BUDGET is left for the next
// call instead of losing the whole reply; the groups already read are kept.
const MAXREPLY = 40000;
if (BOARDS.groups) {
  const res = { mode: 'groups', groups: {}, pending: [], ms: 0 };
  let size = 0;
  for (const [name, entries] of Object.entries(BOARDS.groups)) {
    if (res.pending.length) { res.pending.push(name); continue; }
    try {
      const g = await readGroup(entries);
      if (size && size + g.size > MAXREPLY) { res.pending.push(name); continue; }
      res.groups[name] = g; size += g.size;
    } catch (e) { if (!String(e.message).startsWith('INCOMPLETE')) throw e; res.pending.push(name); res.stopped = `${name}: ${e.message}`; }
  }
  res.ms = Date.now() - T0;
  return res;
}
return await readGroup(BOARDS);
