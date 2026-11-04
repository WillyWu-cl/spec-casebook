// Board consistency warnings (user, 2026-11-04, REQ-079): what the coverage page marks on a board against what the
// board's committed Figma screenshot shows, with no Figma call. The marks come from several reads made at different
// times (the Figma read, review-sheet overrides cut from the PDF, spec notes placed by PDF position), so a board
// redrawn after one of them keeps stale marks: PM Update board 11 kept chip and 「Discard」 boxes from the PDF layout
// over the new Figma screen, and its X → dialog arrow was never read. The screenshot is read with macOS Vision
// (scripts/ocr-tiles.swift, cached in extracted/figma/ocr/, committed) and every mark is checked against it:
//   stale-mark   a mark a review sheet added is not in the image where it is marked (elsewhere: misplaced; nowhere:
//                gone). Only labels that were visible text in the sheet's source (the board's PDF OCR) are checked, on
//                images of at least 0.9 px per point: a Figma-read mark is its node's own text, and a change to it is
//                the change check's job (figma-check.ts)
//   overlap      a mark a review sheet added overlaps another on its screen without one holding the other
//   note-moved   a spec note traced to a requirement whose text is in the image, but away from where it is drawn
//   note-gone    a spec note traced to a requirement whose text is not in the image (redrawn, or OCR missed it)
//   note-off     a spec note that no board holds, so the page does not draw it
//   no-arrow     a board with two or more screens whose text describes a step (→, 跳) but no flow arrow was read
// Usage: node scripts/board-lint.ts <product>/<feature> <ios|android> [--draft <id>] [--board <name>,…] [--data <json>]
//        node scripts/board-lint.ts <product>/<feature> <ios|android> --ack <warning id>,… --why "<reason>"
// Writes specs/<set>/extracted/board-lint-<platform>.json; acknowledged warnings (extracted/board-lint-acks.json,
// committed: a mark that is right although it looks wrong) are left out. Images under 0.9 px per point (PM main flow,
// error handling, top mockups) are too small to read reliably: only their arrows are checked. Exit 0 none, 10 warnings.
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { arg, assertIds, draftsDir, featureDir, readManifest, ROOT, writeJson, writeJsonRows } from './lib/library.ts';
import { cover, grams, norm } from './lib/text-match.ts';

const [feature, platform] = process.argv.slice(2);
assertIds(feature, platform);
const has = (f: string) => process.argv.includes(`--${f}`);
const read = (p: string) => JSON.parse(readFileSync(p, 'utf8'));

// the coverage page's own data, so every mark is checked exactly where the page draws it
// (--data <json> takes that data from a file instead: the tests' fixture)
const draft = arg('draft');
const data: any = arg('data') ? read(arg('data')!) : (() => {
  const tmp = join(tmpdir(), `board-lint-${process.pid}.html`);
  const cov = spawnSync(process.execPath, [join(ROOT, 'scripts', 'coverage-page.ts'), feature, platform, ...(draft ? ['--draft', draft] : []), '--out', tmp], { encoding: 'utf8' });
  if (cov.status !== 0) { console.error(cov.stderr || cov.stdout); process.exit(2); }
  const html = readFileSync(tmp, 'utf8'); rmSync(tmp, { force: true });
  // the page template holds the data on one line: `const D = {…};`
  return JSON.parse(html.split('\n').find(l => l.startsWith('const D = '))!.slice('const D = '.length).replace(/;\s*$/, ''));
})();
const ex = join(featureDir(feature), 'specs', String(data.spec_folder).replace(/^specs\//, ''), 'extracted');
const acksPath = join(ex, 'board-lint-acks.json');
const acks: Record<string, string> = existsSync(acksPath) ? read(acksPath) : {};

if (has('ack')) {
  const ids = (arg('ack') ?? '').split(',').filter(Boolean), why = arg('why');
  if (!ids.length || !why) { console.error('--ack <warning id>,… --why "<reason>"'); process.exit(2); }
  for (const id of ids) acks[id] = why;
  writeJson(acksPath, acks); console.log(`Acknowledged ${ids.length} warning(s)`); process.exit(0);
}

// ---- OCR of each board's screenshot, in canvas points --------------------------------------------------------------
type Line = { text: string; n: string; x: number; y: number; w: number; h: number };
const shotDir = join(ex, 'figma'), ocrDir = join(shotDir, 'ocr');
const shots: Record<string, any> = existsSync(join(shotDir, 'shots.json')) ? read(join(shotDir, 'shots.json')) : {};
const pngSize = (p: string) => { const b = readFileSync(p); return [b.readUInt32BE(16), b.readUInt32BE(20)]; };
const ocrOf = (png: string, box: number[]): Line[] => {
  const src = join(shotDir, png), cache = join(ocrDir, `${png.replace(/\.\w+$/, '')}.json`);
  if (!existsSync(cache) || statSync(cache).mtimeMs < statSync(src).mtimeMs) {
    const dir = join(tmpdir(), `board-lint-ocr-${process.pid}`); mkdirSync(dir, { recursive: true });
    const [w] = pngSize(src), scale = w / box[2];
    // Vision shrinks a large image before reading it and loses small text: cut it into overlapping 1600 px tiles
    // (ocr-tiles.swift reads tiles by name inside its folder), then drop the lines two tiles both read
    const cut = spawnSync('python3', ['-c', `import json, sys
from PIL import Image
Image.MAX_IMAGE_PIXELS = None
src, out, T, O = sys.argv[1], sys.argv[2], 1600, 160
im = Image.open(src).convert('RGB'); W, H = im.size; tiles = []
for y in range(0, max(1, H - O), T - O):
  for x in range(0, max(1, W - O), T - O):
    f = f't{x}_{y}.png'; im.crop((x, y, min(W, x + T), min(H, y + T))).save(f'{out}/{f}'); tiles.append([f, x, y])
print(json.dumps(tiles))`, src, dir], { encoding: 'utf8' });
    if (cut.status !== 0) { console.error(`Cannot cut ${png} into tiles (python3 with Pillow needed): ${cut.stderr.trim().split('\n').pop()}`); return []; }
    const tiles = JSON.parse(cut.stdout).map(([file, px, py]: [string, number, number]) => ({ file, x: box[0] + px / scale, y: box[1] + py / scale, w: 0, h: 0 }));
    writeFileSync(join(dir, 'index.json'), JSON.stringify({ scale, tiles }));
    const r = spawnSync('swift', [join(ROOT, 'scripts', 'ocr-tiles.swift'), dir], { encoding: 'utf8' });
    const found: any[] = r.status === 0 && existsSync(join(dir, 'ocr.json')) ? read(join(dir, 'ocr.json')).flatMap((t: any) => t.lines) : [];
    rmSync(dir, { recursive: true, force: true });
    const res = { lines: found.filter((l, i) => !found.slice(0, i).some(k => k.text === l.text && Math.abs(k.x - l.x) <= 8 && Math.abs(k.y - l.y) <= 8)) };
    if (!res.lines.length) { console.error(`OCR read nothing from ${png}${r.stderr ? `: ${r.stderr.trim().split('\n').pop()}` : ''}`); return []; }
    // one [text, x, y, w, h] row per line keeps the shared cache small
    writeJsonRows(cache, { png, box, lines: res.lines.map((l: any) => [l.text, l.x, l.y, l.w, l.h]) });
  }
  return read(cache).lines.map((l: any) => { const [text, x, y, w, h] = Array.isArray(l) ? l : [l.text, l.x, l.y, l.w, l.h]; return { text, x, y, w, h, n: norm(text) }; });
};

// ---- the checks ----------------------------------------------------------------------------------------------------
const overrides = existsSync(join(ex, 'inventory-overrides.json')) ? read(join(ex, 'inventory-overrides.json')) : {};
const screenBox = new Map<string, number[]>(data.screens.map((s: any) => [s.id, s.box]));
// a mark an override added (a review sheet) says so: those came from the PDF and are the likeliest to be stale
const addedAt = (overrides.add ?? []).map((a: any) => { const s = screenBox.get(a.screen); return s ? { box: [s[0] + a.box[0], s[1] + a.box[1], a.box[2], a.box[3]], why: a.why } : null; }).filter(Boolean);
// a set of choices (chips, cards) is one group with one label for all: each mark takes its own control's label
const inv = existsSync(join(ex, 'inventory.json')) ? read(join(ex, 'inventory.json')) : { screens: [], controls: [] };
const invScreen = new Map<string, number[]>(inv.screens.map((x: any) => [x.id, x.box]));
const ctlAt = inv.controls.flatMap((c: any) => c.screens.map((sid: string) => { const sb = invScreen.get(sid); return sb ? { r: [sb[0] + c.box[0], sb[1] + c.box[1]], label: c.label } : null; }).filter(Boolean));
const labelAt = (r: number[], fallback: string) => ctlAt.find((c: any) => Math.abs(c.r[0] - r[0]) <= 2 && Math.abs(c.r[1] - r[1]) <= 2)?.label ?? fallback;
const addOf = (r: number[]) => addedAt.find((a: any) => Math.abs(a.box[0] - r[0]) <= 2 && Math.abs(a.box[1] - r[1]) <= 2);
const inBox = (b: number[], r: number[]) => r[0] + r[2] / 2 >= b[0] && r[0] + r[2] / 2 <= b[0] + b[2] && r[1] + r[3] / 2 >= b[1] && r[1] + r[3] / 2 <= b[1] + b[3];
const inter = (a: number[], b: number[]) => Math.max(0, Math.min(a[0] + a[2], b[0] + b[2]) - Math.max(a[0], b[0])) * Math.max(0, Math.min(a[1] + a[3], b[1] + b[3]) - Math.max(a[1], b[1]));
const near = (r: number[], l: Line, pad: number) => inter([r[0] - pad, r[1] - pad, r[2] + 2 * pad, r[3] + 2 * pad], [l.x, l.y, l.w, l.h]) > 0;
const at = (x: number, y: number) => `${Math.round(x)},${Math.round(y)}`;

// spec notes the page cannot draw: blocks of the trace with no placed note
const traceBlocks = (() => {
  const m = readManifest(feature, platform);
  const ids = draft ? [draft] : m ? [m.draft, ...[...(m.history ?? [])].reverse().map((h: any) => h.draft)] : [];
  const p = ids.map(d => join(draftsDir(feature, platform), d ?? '', 'annotation-trace.json')).find(existsSync);
  return p ? read(p).blocks as any[] : [];
})();
const placed = new Set(data.notes.map((n: any) => n.id));

const pick = arg('board')?.split(',').filter(Boolean);
const warnings: any[] = [], skipped: string[] = [];
for (const b of data.boards as any[]) {
  if (pick && !pick.includes(b.name) && !pick.includes(b.id)) continue;
  const add = (kind: string, subject: string, text: string, extra: any = {}) => {
    const id = `${b.name}|${kind}|${subject}`;
    if (!acks[id]) warnings.push({ id, board: b.name, title: b.title, kind, text, ...extra });
  };
  for (const n of traceBlocks.filter(k => k.board === b.name && !placed.has(k.id))) add('note-off', n.id, `spec note 「${String(n.text).slice(0, 60)}」 is on no board the page draws`);
  const shot = Object.entries(shots).find(([, s]) => s.board === b.id);
  if (!shot) { skipped.push(`${b.name} (no Figma screenshot)`); continue; }
  const [png, s] = shot;
  const shotBox = s.box ?? b.box, lines = ocrOf(png, shotBox);
  const sharp = pngSize(join(shotDir, png))[0] / shotBox[2] >= 0.9;
  // the words the review sheets were cut from (the PDF OCR of the board)
  const sheetText = (() => { const p = join(ex, 'boards', `${b.name}.md`); return existsSync(p) ? norm(readFileSync(p, 'utf8')) : ''; })();
  if (!lines.length) { skipped.push(`${b.name} (no text read from ${png})`); continue; }
  const all = lines.map(l => l.n).join('|'), allG = grams(all);

  // controls: every mark of every group on this board
  const marks = (data.groups as any[]).flatMap(g => (g.rects ?? []).filter((r: number[]) => inBox(b.box, r)).map((r: number[]) => ({ g, r })));
  // a screen the image shows no text on at all (too small to read, or blank) is not checked
  const readable = (r: number[]) => { const sc = data.screens.find((x: any) => x.board === b.name && inBox(x.box, r));
    return !sc || lines.some(l => inBox(sc.box, [l.x, l.y, l.w, l.h])); };
  let unread = 0;
  for (const { g, r } of marks) {
    const shown = labelAt(r, g.label ?? ''), label = norm(shown);
    // an icon (48 pt or less each way) has no text: its label names it
    if (label.length < 2 || /^\d+$/.test(label) || !addOf(r) || !sharp || !sheetText.includes(label) || (r[2] <= 48 && r[3] <= 48)) continue;
    if (!readable(r)) { unread++; continue; }
    const here = lines.filter(l => near(r, l, 16)).map(l => l.n).join('|');
    if (cover(label, here) >= 0.6) continue;
    const src = 'added by a review sheet';
    // elsewhere only when a line there is this label, not a sentence that mentions it
    const where = cover(label, all, allG) >= 0.8 ? lines.find(l => cover(label, l.n) >= 0.8 && l.n.length <= label.length + 4) : null;
    add('stale-mark', `${g.group}@${at(r[0], r[1])}`, where
      ? `「${shown}」 (${g.group}, ${src}) is marked at ${at(r[0], r[1])}, but the image shows it at ${at(where.x, where.y)}`
      : `「${shown}」 (${g.group}, ${src}) is marked at ${at(r[0], r[1])}, but the image shows no such text on this board`,
    { group: g.group, rect: r, rows: g.press ?? [] });
  }
  if (unread) skipped.push(`${b.name}: ${unread} mark(s) on screens with no text read`);
  // marks on one screen overlapping without one holding the other
  for (let i = 0; i < marks.length; i++) for (let j = i + 1; j < marks.length; j++) {
    const a = marks[i], c = marks[j];
    if (a.g.group === c.g.group || (!addOf(a.r) && !addOf(c.r))) continue;
    const o = inter(a.r, c.r), small = Math.min(a.r[2] * a.r[3], c.r[2] * c.r[3]);
    // two marks of about one size on one spot (a stale mark over the current one); an icon on its card is layout
    const big = Math.max(a.r[2] * a.r[3], c.r[2] * c.r[3]);
    if (!small || small < 0.5 * big || o < 0.4 * small || o >= 0.9 * small) continue;
    add('overlap', `${a.g.group}+${c.g.group}`, `「${a.g.label || a.g.name}」 (${a.g.group}) and 「${c.g.label || c.g.name}」 (${c.g.group}) overlap at ${at(c.r[0], c.r[1])}: one is behind the other or stale`, { groups: [a.g.group, c.g.group] });
  }
  // spec notes against the image text
  // a linked document's items (link blocks) are not drawn on the board
  for (const n of (data.notes as any[]).filter(n => sharp && n.board === b.name && n.reqs?.length && !n.link)) {
    // a low-confidence OCR line ("(?)") is no reliable text to look for; any of the note's lines will do
    const segs = String(n.text).split(' / ').filter(x => !/\(\?\)\s*$/.test(x)).map(norm).filter(x => x.length >= 4);
    if (!segs.length) continue;
    // the lines that hold the note's text (or most of a line the note holds), the nearest one counting: a note can
    // be a fragment of a longer line, and the same words can stand in two places
    const hits = lines.filter(l => segs.some(seg => cover(seg, l.n) >= 0.6 || (l.n.length >= Math.max(4, seg.length / 2) && cover(l.n, seg) >= 0.8)));
    const gap = (l: Line) => Math.hypot(Math.max(0, l.x - n.x, n.x - (l.x + l.w)), Math.max(0, l.y - n.y, n.y - (l.y + l.h)));
    const best = hits.sort((a, c) => gap(a) - gap(c))[0];
    if (!best) add('note-gone', n.id, `spec note 「${String(n.text).slice(0, 60)}」 (${n.trace || 'untraced'}) is not in the board image`, { reqs: n.reqs });
    // moved only when the place the note is drawn holds no text at all (else OCR likely misread the words there)
    else if (gap(best) > 40 && !lines.some(l => gap(l) <= 24)) add('note-moved', n.id, `spec note 「${String(n.text).slice(0, 40)}」 is drawn at ${at(n.x, n.y)}; its text is at ${at(best.x, best.y)}`, { reqs: n.reqs });
  }
  // a step described in the board's text with no arrow read
  const scr = data.screens.filter((x: any) => x.board === b.name).length, arr = data.arrows.filter((a: any) => a.board === b.name).length;
  // 跳 alone also means "show" (跳toast): only a jump to a page or dialog counts, and 不跳 / 不再跳 is none
  const step = lines.find(l => /→|->|⇒|➔/.test(l.text) || /(?<!不|不再)跳(到|至|頁|確認|\s*dialog|出)/i.test(l.text));
  if (scr >= 2 && !arr && step) add('no-arrow', 'board', `${scr} screens and no flow arrow read, but the text describes a step: 「${step.text.slice(0, 50)}」`);
}

const out = { checked_at: new Date().toISOString(), feature, platform, set: data.spec_folder, warnings, skipped };
writeJson(join(ex, `board-lint-${platform}.json`), out);
const byBoard = new Map<string, any[]>();
for (const w of warnings) byBoard.set(w.board, [...(byBoard.get(w.board) ?? []), w]);
const kinds = warnings.reduce((m, w) => (m[w.kind] = (m[w.kind] ?? 0) + 1, m), {} as Record<string, number>);
console.log(`${warnings.length ? 'BOARDS: WARNINGS' : 'BOARDS: CLEAN'} — ${byBoard.size} board(s), ${warnings.length} warning(s) ${JSON.stringify(kinds)}${Object.keys(acks).length ? `, ${Object.keys(acks).length} acknowledged` : ''}`);
for (const [board, ws] of byBoard) {
  console.log(`  ${ws[0].title ?? board} (${board}): ${ws.length}`);
  for (const w of ws.slice(0, 8)) console.log(`    ${w.kind}: ${w.text}`);
  if (ws.length > 8) console.log(`    … ${ws.length - 8} more in board-lint-${platform}.json`);
}
if (skipped.length) console.log(`  not checked: ${skipped.join('; ')}`);
process.exit(warnings.length ? 10 : 0);
