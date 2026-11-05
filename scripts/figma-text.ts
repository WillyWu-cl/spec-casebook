// What a changed Figma board now says, against what the spec notes were read from (user, 2026-11-04). The analysis
// reads a board's words once (the PDF's OCR, boards/<board>.md); when the board is redrawn in Figma later, the rows keep
// the old words (TC-341 kept a 「Discard」 button the PM board no longer draws). Group reads now return every text of
// the board and of what is drawn over it (scripts/figma/inventory.js `texts`), so a changed board is compared here with
// no extra Figma call.
// Usage: node scripts/figma-text.ts <product>/<feature> [<spec-set folder>] [--board <name>,…] [--all] [--accept]
//   default    the boards extracted/figma-check.json lists as changed or with missed arrows (else --all)
//   --all      every board whose group read has texts
//   --accept   after the update plan took the changes: save each board's current Figma text as its baseline
//              (extracted/figma-text/<board>.json, committed), so the next comparison is Figma against Figma
// The baseline is the board's last accepted Figma text, else its PDF OCR. A Figma line counts as present when the
// baseline holds it (spaces, punctuation and full-width forms ignored; OCR noise tolerated); a baseline line counts as
// gone when the Figma text no longer holds it. Each line names the requirements whose spec notes (the approved tables'
// annotation-trace.json) hold it. Writes extracted/figma-text-diff.json; exit 0 no change, 10 changed.
import { existsSync, mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { arg, assertIds, draftsDir, featureDir, readManifest, writeJson } from './lib/library.ts';
import { listSpecSets } from './lib/specs.ts';
import { cover, grams, norm } from './lib/text-match.ts';

const [feature, maybeSet] = process.argv.slice(2);
if (!feature) { console.error('Usage: node scripts/figma-text.ts <product>/<feature> [<spec-set folder>] [--board <name>,…] [--all] [--accept]'); process.exit(2); }
assertIds(feature, 'ios');
const specs = join(featureDir(feature), 'specs');
const hasGroups = (set: string) => existsSync(join(specs, set, 'extracted')) && readdirSync(join(specs, set, 'extracted')).some(f => /^figma-inventory-.+\.json$/.test(f));
const set = maybeSet && !maybeSet.startsWith('--') ? maybeSet : listSpecSets(feature).map(s => s.folder).reverse().find(hasGroups);
if (!set) { console.log('No spec set has figma-inventory-<group>.json'); process.exit(1); }
const ex = join(specs, set, 'extracted'), baseDir = join(ex, 'figma-text');
const read = (p: string) => JSON.parse(readFileSync(p, 'utf8'));
const has = (f: string) => process.argv.includes(`--${f}`);
const slug = (s: string) => s.replace(/[^\w.-]+/g, '-');

// status bar times, page numbers and single characters say nothing
const worth = (n: string) => n.length >= 3 && !/^\d+$/.test(n);

// boards in scope
type Board = { id: string; name: string; group: string; lines: { text: string; inPhone: number }[] };
const boards: Board[] = [], noTexts: string[] = [];
for (const f of readdirSync(ex).filter(f => /^figma-inventory-.+\.json$/.test(f) && !f.endsWith('-boards.json')).sort()) {
  const g = read(join(ex, f)), group = f.replace(/^figma-inventory-|\.json$/g, '');
  if (!g.texts) { noTexts.push(group); continue; }
  g.boards.forEach((b: any[], bi: number) => {
    const lines = g.texts.filter((t: any[]) => t[0] === bi).flatMap((t: any[]) => String(t[5]).split('\n').map(text => ({ text: text.trim(), inPhone: t[6] })))
      .filter((l: any) => l.text);
    boards.push({ id: b[0], name: b[1], group, lines });
  });
}
const pick = arg('board')?.split(',').filter(Boolean);
const checkPath = join(ex, 'figma-check.json');
const flagged = existsSync(checkPath) ? new Set<string>([...(read(checkPath).changed ?? []), ...(read(checkPath).missed_arrows ?? [])].map((r: any) => r.id)) : null;
const scope = boards.filter(b => pick ? pick.includes(b.name) || pick.includes(b.id) : has('all') || !flagged?.size ? true : flagged.has(b.id));

if (has('accept')) {
  mkdirSync(baseDir, { recursive: true });
  for (const b of scope) writeJson(join(baseDir, `${slug(b.name)}.json`), { board: b.id, name: b.name, group: b.group, accepted_at: new Date().toISOString(), lines: b.lines });
  console.log(`Accepted the current Figma text of ${scope.length} board(s) as their baseline (${join(set, 'extracted', 'figma-text')})`);
  process.exit(0);
}

// spec notes of the approved tables (their draft's annotation-trace.json; a direct edit's version has no draft folder,
// so the newest version that has one)
const blocks: { board: string; text: string; reqs: string[] }[] = [];
for (const platform of ['ios', 'android']) {
  const m = readManifest(feature, platform); if (!m) continue;
  const p = [m.draft, ...[...(m.history ?? [])].reverse().map((h: any) => h.draft)].map(d => join(draftsDir(feature, platform), d ?? '', 'annotation-trace.json')).find(existsSync);
  if (p) for (const b of read(p).blocks) blocks.push({ board: b.board, text: norm(b.text ?? ''), reqs: String(b.trace ?? '').match(/R-\d+/g) ?? [] });
}
const reqsOf = (board: string, line: string) => [...new Set(blocks.filter(b => b.board === board && cover(line, b.text, grams(b.text)) >= 0.6).flatMap(b => b.reqs))];

const ocr = (name: string) => {
  const p = join(ex, 'boards', `${name}.md`); if (!existsSync(p)) return null;
  return readFileSync(p, 'utf8').split('\n').map(l => l.match(/^\s*-?\d+\s+-?\d+\s+(.+)$/)).filter(Boolean).map(m => ({ text: m![1].trim(), low: /\(\?\)\s*$/.test(m![1]) }));
};
const report: any = { checked_at: new Date().toISOString(), set, boards: [] as any[], no_texts: noTexts };
for (const b of scope) {
  const saved = existsSync(join(baseDir, `${slug(b.name)}.json`)) ? read(join(baseDir, `${slug(b.name)}.json`)) : null;
  const base = saved ? saved.lines.map((l: any) => ({ text: l.text, low: false })) : ocr(b.name);
  if (!base) { report.boards.push({ board: b.name, id: b.id, group: b.group, baseline: 'none' }); continue; }
  const from = saved ? 'figma' : 'pdf-ocr';
  // OCR misreads characters, so a line is gone only when little of it is left; Figma against Figma is exact
  const keep = saved ? 0.95 : 0.6, present = saved ? 0.95 : 0.8;
  const now = b.lines.map(l => norm(l.text)).join('|'), nowG = grams(now);
  const was = base.map((l: any) => norm(l.text)).join('|'), wasG = grams(was);
  const added = b.lines.filter(l => worth(norm(l.text)) && cover(norm(l.text), was, wasG) < present)
    .map(l => ({ text: l.text, inPhone: !!l.inPhone, reqs: reqsOf(b.name, norm(l.text)) }));
  const removed = base.filter((l: any) => worth(norm(l.text)) && cover(norm(l.text), now, nowG) < keep)
    .map((l: any) => ({ text: l.text.replace(/\s*\(\?\)\s*$/, ''), ...(l.low ? { low: true } : {}), reqs: reqsOf(b.name, norm(l.text)) }));
  const reqs = [...new Set(blocks.filter(x => x.board === b.name).flatMap(x => x.reqs))];
  report.boards.push({ board: b.name, id: b.id, group: b.group, baseline: from, added, removed, reqs });
}
writeJson(join(ex, 'figma-text-diff.json'), report);
const changed = report.boards.filter((b: any) => b.added?.length || b.removed?.length);
console.log(`${changed.length ? 'FIGMA TEXT: CHANGED' : 'FIGMA TEXT: UNCHANGED'} — ${scope.length} board(s) compared${flagged?.size && !pick && !has('all') ? ' (changed in figma-check.json)' : ''}, ${changed.length} with new or gone lines`);
for (const b of changed) {
  console.log(`  ${b.board} (${b.id}, against its ${b.baseline === 'figma' ? 'last accepted Figma text' : 'PDF OCR'}): +${b.added.length} / −${b.removed.length}; requirements on this board: ${b.reqs.join(', ') || 'none'}`);
  for (const l of b.added.slice(0, 12)) console.log(`    + ${l.text}${l.inPhone ? ' [screen]' : ''}${l.reqs.length ? `  (${l.reqs.join(', ')})` : ''}`);
  for (const l of b.removed.slice(0, 12)) console.log(`    − ${l.text}${l.low ? ' [low OCR]' : ''}${l.reqs.length ? `  (${l.reqs.join(', ')})` : ''}`);
  if (b.added.length > 12 || b.removed.length > 12) console.log('    … all lines in figma-text-diff.json');
}
for (const b of report.boards.filter((b: any) => b.baseline === 'none')) console.log(`  ${b.board}: no baseline (no accepted Figma text, no PDF OCR): --accept it once its rows are checked`);
if (noTexts.length) console.log(`  ${noTexts.length} group read(s) without texts (read before 2026-11-04): ${noTexts.join(', ')}; their boards are compared after their next re-read`);
if (changed.length) console.log(`Put the changes in the update plan (requirements and rows above), then: node scripts/figma-text.ts ${feature} ${set} --accept${pick ? ` --board ${pick.join(',')}` : ''}`);
process.exit(changed.length ? 10 : 0);
