// Chinese reading copy of a table (cases.zh-Hant.csv / draft.zh-Hant.csv), kept up to date row by row
// (user, 2026-11-11). The English table stays the source of truth (AGENTS.md); this copy is for reading in 中文 mode
// on Cases, Results, Progress and Coverage. Translation style: spec-casebook/references/zh-copy.md.
//
// Usage: node scripts/zh-copy.ts <product>/<feature> <ios|android> [--draft <id>] <command>
//   status            rows translated, stale (English changed since) and missing
//   export [--chars N] writes the rows to translate to <table or draft>/zh-work/batch-NN.json (git-ignored), about N
//                     English characters each (default 9000). Text already translated anywhere in the library (the
//                     other platform's table, a repeated precondition) is filled in from that and only the rest is
//                     left to translate; a row that is fully known needs no translating at all (batch-auto).
//   merge [--keep]    reads every zh-work/batch-NN.out.json, checks it (「」 UI strings kept, same number of steps,
//                     nothing left in English), writes the copy and its fingerprints (<copy>.prints.json), regenerates
//                     cases.html (not cases.xlsx) for an approved table and removes zh-work/ (unless --keep or a check failed)
//   adopt [--from <csv>]  fingerprints an existing copy that has none (one built by a draft's build-zh.ts) against the
//                     English it was built from: by default the approved version's draft.csv, so rows edited on the
//                     review page before Save come out stale and are translated again
//
// A batch file is { "rules": …, "rows": [{ "ID", "en": {field: English}, "zh": {field: Chinese known}, "todo": [fields],
// "prev"?: {field: older Chinese of a row whose English changed} }] }. Its translation is batch-NN.out.json:
// { "<ID>": { "<field>": "<Chinese>", … }, … } with every field of "en" (the "zh" ones copied, or improved).
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { LIBRARY, ROOT, arg, assertIds, listFeatures, readManifest, readTable, tableDir } from './lib/library.ts';
import { toCsv } from './lib/csv.ts';
import { ZH_COLS, ZH_HEAD, ZH_TEXT, printsPathFor, readZhCopy, rowPrint, zhPathFor } from './lib/zh.ts';
import { exportTable } from './lib/exporter.ts';

const argv = process.argv.slice(2);
const [feature, platform] = argv;
const draft = arg('draft');
const cmd = argv.filter((a, i) => i > 1 && !a.startsWith('--') && argv[i - 1] !== '--draft' && argv[i - 1] !== '--chars' && argv[i - 1] !== '--from')[0];
assertIds(feature, platform);
if (!['status', 'export', 'merge', 'adopt'].includes(cmd ?? '')) {
  console.error('Usage: node scripts/zh-copy.ts <product>/<feature> <ios|android> [--draft <id>] status|export|merge|adopt');
  process.exit(2);
}
const table = tableDir(feature, platform);
const base = draft ? join(table, 'drafts', draft) : table;
const csv = join(base, draft ? 'draft.csv' : 'cases.csv');
if (!existsSync(csv)) { console.error(`No ${relative(ROOT, csv)}`); process.exit(1); }
const zhCsv = zhPathFor(csv), printsPath = printsPathFor(zhCsv), work = join(base, 'zh-work');
const rows = readTable(csv);
const rel = (p: string) => relative(ROOT, p);
const prints: Record<string, string> = existsSync(printsPath) ? JSON.parse(readFileSync(printsPath, 'utf8')) : {};
const allZh = readZhCopy(zhCsv);                         // every row of the copy, fresh or not
const fresh = existsSync(printsPath) ? readZhCopy(zhCsv, rows) : {};   // a copy without prints needs `adopt` first
const textFields = (r: Record<string, string>) => ZH_TEXT.filter(f => (r[f] ?? '').trim());

if (cmd === 'status') {
  const stale = rows.filter(r => !fresh[r.ID] && allZh[r.ID]).length;
  console.log(`${rel(csv)}: ${rows.length} rows — ${Object.keys(fresh).length} translated, ${stale} stale, ${rows.length - Object.keys(fresh).length - stale} missing`);
  if (Object.keys(allZh).length && !existsSync(printsPath)) console.log(`The copy has no fingerprints: run \`adopt\` first.`);
  process.exit(0);
}

if (cmd === 'adopt') {
  if (!Object.keys(allZh).length) { console.error(`No ${rel(zhCsv)} to adopt`); process.exit(1); }
  let from = arg('from');
  if (!from && !draft) { const d = readManifest(feature, platform)?.draft; if (d) from = join(table, 'drafts', d, 'draft.csv'); }
  const src = from && existsSync(from) ? readTable(from) : rows;
  if (from && !existsSync(from)) console.log(`${from} not found: fingerprinting against ${rel(csv)}`);
  const p = Object.fromEntries(src.filter(r => allZh[r.ID]).map(r => [r.ID, rowPrint(r)]));
  writeFileSync(printsPath, JSON.stringify(p, null, 1) + '\n');
  const now = readZhCopy(zhCsv, rows);
  console.log(`${rel(printsPath)}: ${Object.keys(p).length} rows fingerprinted; ${Object.keys(now).length} of ${rows.length} are fresh for ${rel(csv)}`);
  process.exit(0);
}

// Translation memory: English field text → Chinese, from every table's fresh copy (this one's included)
function memory() {
  const mem = new Map<string, string>();
  const tables: string[] = [];
  for (const feat of listFeatures())
    for (const pf of ['ios', 'android']) {
      const dir = join(LIBRARY, feat, pf);
      if (existsSync(join(dir, 'cases.csv'))) tables.push(join(dir, 'cases.csv'));
      if (existsSync(join(dir, 'drafts'))) for (const d of readdirSync(join(dir, 'drafts'))) if (existsSync(join(dir, 'drafts', d, 'draft.csv'))) tables.push(join(dir, 'drafts', d, 'draft.csv'));
    }
  for (const t of tables) {
    const z = zhPathFor(t);
    if (!existsSync(z) || !existsSync(printsPathFor(z))) continue;
    const rs = readTable(t), zh = readZhCopy(z, rs);
    for (const r of rs) if (zh[r.ID]) for (const f of ZH_TEXT) { const en = (r[f] ?? '').trim(), c = (zh[r.ID][f] ?? '').trim(); if (en && c && !mem.has(f + '\u0001' + en)) mem.set(f + '\u0001' + en, c); }
  }
  return mem;
}

const RULES = 'Translate into natural Traditional Chinese as a Taiwanese QA tester would write it (spec-casebook/references/zh-copy.md): ' +
  'rewrite each sentence the way it is said in Chinese, never word by word; keep every 「…」 UI string, ID (TC-, R-, KP-, Q-), ' +
  'eBug code, file name, number and unit exactly; keep numbered steps one per line with the same numbers.';

if (cmd === 'export') {
  if (existsSync(work) && readdirSync(work).some(f => f.endsWith('.out.json'))) {
    console.error(`${rel(work)} holds translations not merged yet: run \`merge\` first (or delete the folder).`); process.exit(1);
  }
  rmSync(work, { recursive: true, force: true });
  const mem = memory(), limit = Number(arg('chars') ?? 9000);
  const auto: Record<string, Record<string, string>> = {};
  const batches: any[][] = [];
  let cur: any[] = [], size = 0, todoChars = 0;
  for (const r of rows) {
    if (fresh[r.ID]) continue;
    const en: Record<string, string> = {}, zh: Record<string, string> = {}, todo: string[] = [];
    for (const f of textFields(r)) { en[f] = r[f].trim(); const m = mem.get(f + '\u0001' + en[f]); if (m) zh[f] = m; else todo.push(f); }
    if (!todo.length) { auto[r.ID] = zh; continue; }
    const item: any = { ID: r.ID, en, zh, todo };
    if (allZh[r.ID]) item.prev = Object.fromEntries(ZH_TEXT.filter(f => allZh[r.ID][f]).map(f => [f, allZh[r.ID][f]]));
    const n = todo.reduce((a, f) => a + en[f].length, 0);
    if (cur.length && size + n > limit) { batches.push(cur); cur = []; size = 0; }
    cur.push(item); size += n; todoChars += n;
  }
  if (cur.length) batches.push(cur);
  if (!batches.length && !Object.keys(auto).length) { console.log(`${rel(csv)}: every row is translated.`); process.exit(0); }
  mkdirSync(work, { recursive: true });
  if (Object.keys(auto).length) writeFileSync(join(work, 'batch-auto.out.json'), JSON.stringify(auto, null, 1) + '\n');
  batches.forEach((b, i) => writeFileSync(join(work, `batch-${String(i + 1).padStart(2, '0')}.json`), JSON.stringify({ rules: RULES, rows: b }, null, 1) + '\n'));
  console.log(`${rel(work)}: ${batches.length} batch(es), ${batches.flat().length} rows, ${todoChars} English characters to translate; ` +
    `${Object.keys(auto).length} rows filled from text already translated (batch-auto.out.json).`);
  batches.forEach((b, i) => console.log(`  batch-${String(i + 1).padStart(2, '0')}.json  ${b.length} rows  ${b.reduce((a: number, x: any) => a + x.todo.reduce((s: number, f: string) => s + x.en[f].length, 0), 0)} chars`));
  process.exit(0);
}

// merge
if (!existsSync(work)) { console.error(`No ${rel(work)}: run \`export\` first.`); process.exit(1); }
const outs = readdirSync(work).filter(f => /^batch-.*\.out\.json$/.test(f)).sort();
const pending = readdirSync(work).filter(f => /^batch-\d+\.json$/.test(f) && !outs.includes(f.replace('.json', '.out.json')));
const got: Record<string, Record<string, string>> = {};
for (const f of outs) Object.assign(got, JSON.parse(readFileSync(join(work, f), 'utf8')));
const byId = new Map(rows.map(r => [r.ID, r]));
const errors: string[] = [], warns: string[] = [];
const quoted = (s: string) => (s.match(/「[^」]*」/g) ?? []);
const steps = (s: string) => (s.match(/^\s*\d+[.)]/gm) ?? []).length;
const hanRatio = (s: string) => (s.match(/[一-鿿]/g) ?? []).length / Math.max(1, s.replace(/「[^」]*」|\s/g, '').length);
for (const [id, z] of Object.entries(got)) {
  const r = byId.get(id);
  if (!r) { warns.push(`${id}: not in the table any more, skipped`); delete got[id]; continue; }
  for (const f of textFields(r)) {
    const en = r[f].trim(), c = (z[f] ?? '').trim();
    if (!c) { errors.push(`${id} ${f}: no translation`); continue; }
    const miss = quoted(en).filter(q => !c.includes(q));
    if (miss.length) warns.push(`${id} ${f}: UI string(s) not kept: ${miss.join(' ')}`);
    if (steps(en) !== steps(c)) warns.push(`${id} ${f}: ${steps(en)} numbered steps in English, ${steps(c)} in Chinese`);
    if (en.length > 25 && hanRatio(c) < 0.15) warns.push(`${id} ${f}: looks untranslated`);
  }
}
for (const id of Object.keys(got)) if (errors.some(e => e.startsWith(id + ' '))) delete got[id];
// one Chinese name per section: the most used one wins
const secVotes = new Map<string, Map<string, number>>();
for (const r of rows) {
  const s = got[r.ID]?.Section ?? fresh[r.ID]?.Section; if (!s || !r.Section) continue;
  const m = secVotes.get(r.Section) ?? new Map(); m.set(s, (m.get(s) ?? 0) + 1); secVotes.set(r.Section, m);
}
const secName = new Map([...secVotes].map(([en, m]) => [en, [...m].sort((a, b) => b[1] - a[1])[0][0]]));
// Chinese spacing: no space between Chinese text and 「」 (English spacing carried over by a translator)
const CJK = '[\\u4e00-\\u9fff，。；：、（）！？]';
const tidy = (s: string) => s.trim().replace(new RegExp(`(${CJK}) +「`, 'g'), '$1「').replace(new RegExp(`」 +(${CJK})`, 'g'), '」$1');
const CHANGE: Record<string, string> = { new: '新增', modified: '修改', removed: '移除', unchanged: '未變更' };
const outRows: string[][] = [], newPrints: Record<string, string> = {};
for (const r of rows) {
  const z = got[r.ID] ?? fresh[r.ID];
  if (!z) continue;
  const v: Record<string, string> = { ...Object.fromEntries(ZH_TEXT.map(f => [f, tidy(z[f] ?? '')])), Section: secName.get(r.Section) ?? z.Section ?? '' };
  outRows.push(ZH_COLS.map(c => c === 'ID' ? r.ID : c === 'Priority' || c === 'Spec Ref' ? r[c] ?? '' : c === 'Change' ? (CHANGE[r.Change] ?? r.Change ?? '') : v[c] ?? ''));
  newPrints[r.ID] = rowPrint(r);
}
const cols = rows.length && 'Change' in rows[0] ? ZH_COLS.length : ZH_COLS.length - 2;
writeFileSync(zhCsv, '﻿' + toCsv([ZH_HEAD.slice(0, cols), ...outRows.map(r => r.slice(0, cols))]));
writeFileSync(printsPath, JSON.stringify(newPrints, null, 1) + '\n');
for (const w of warns) console.log('warn  ' + w);
for (const e of errors) console.log('ERROR ' + e);
console.log(`${rel(zhCsv)}: ${outRows.length} of ${rows.length} rows in Chinese (${Object.keys(got).length} merged now)` +
  (pending.length ? `; not translated yet: ${pending.join(', ')}` : ''));
if (!draft) await exportTable(feature, platform, true);   // cases.html only
if (!argv.includes('--keep') && !errors.length && !pending.length) rmSync(work, { recursive: true, force: true });
else console.log(`${rel(work)} kept`);
