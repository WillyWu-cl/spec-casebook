// Traditional Chinese reading copy of a table (user, 2026-10-30, REQ-002 of phd/swipe-collage): draft.zh-Hant.csv in a
// draft, cases.zh-Hant.csv beside an approved table; same column order as the table with Chinese headers. The 中文 mode
// of the review page, the exported cases.html, Results, Progress and Coverage show it; rows stay English (AGENTS.md).
// Since 2026-11-11 every table can have one, built by scripts/zh-copy.ts, with a fingerprint per row
// (<copy>.prints.json: ID → hash of the row's English text). With rows given, readZhCopy keeps only the rows whose
// English is unchanged since they were translated, so a page never shows a stale translation (it shows the English).
// A copy without a prints file (hand-built by an older draft's build-zh.ts) is trusted as it is.
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { parseCsv } from './csv.ts';

export const ZH_COLS = ['ID', 'Section', 'Precondition', 'Action', 'Expected Result', 'Priority', 'Spec Ref', 'Notes', 'Change', 'Change Reason'];
export const ZH_HEAD = ['編號', '區塊', '前置條件', '操作步驟', '預期結果', '優先度', '規格對應', '備註', '變更', '變更原因'];
// the English fields a translation depends on
export const ZH_TEXT = ['Section', 'Precondition', 'Action', 'Expected Result', 'Notes', 'Change Reason'];

export const zhPathFor = (csv: string) => csv.replace(/\.csv$/, '.zh-Hant.csv');
export const printsPathFor = (zhCsv: string) => zhCsv.replace(/\.csv$/, '.prints.json');
// fingerprinted: the case's own text (Change Reason exists only in drafts, so a draft row and its approved row match)
const PRINTED = ['Section', 'Precondition', 'Action', 'Expected Result', 'Notes'];
export const rowPrint = (r: Record<string, string>) =>
  createHash('sha1').update(PRINTED.map(c => (r[c] ?? '').trim()).join('\u0001')).digest('hex').slice(0, 16);

export function readZhCopy(path: string, rows?: Record<string, string>[]): Record<string, Record<string, string>> {
  if (!existsSync(path)) return {};
  const [, ...body] = parseCsv(readFileSync(path, 'utf8').replace(/^﻿/, ''));
  const all = Object.fromEntries(body.filter(r => r[0]).map(r => [r[0], Object.fromEntries(ZH_COLS.map((c, i) => [c, r[i] ?? '']))]));
  const pp = printsPathFor(path);
  if (!rows || !existsSync(pp)) return all;
  const prints: Record<string, string> = JSON.parse(readFileSync(pp, 'utf8'));
  const fresh = new Set(rows.filter(r => prints[r.ID] && prints[r.ID] === rowPrint(r)).map(r => r.ID));
  return Object.fromEntries(Object.entries(all).filter(([id]) => fresh.has(id)));
}

// The case fields the run pages show, in Chinese, for rows with a fresh translation: { ID: { section, pre, action, expected } }
export function zhCaseText(csv: string, rows: Record<string, string>[]) {
  const zh = readZhCopy(zhPathFor(csv), rows);
  return Object.fromEntries(Object.entries(zh).map(([id, z]) => [id, { section: z.Section, pre: z.Precondition, action: z.Action, expected: z['Expected Result'] }]));
}
