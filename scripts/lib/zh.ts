// Traditional Chinese reading copy of a table (user, 2026-10-30, REQ-002 of phd/swipe-collage): draft.zh-Hant.csv in a
// draft, cases.zh-Hant.csv beside an approved table; same column order as the table with Chinese headers. The 中文 mode
// of the review page and of the exported cases.html shows it above the English fields; rows stay English (AGENTS.md).
import { existsSync, readFileSync } from 'node:fs';
import { parseCsv } from './csv.ts';

const ZH_COLS = ['ID', 'Section', 'Precondition', 'Action', 'Expected Result', 'Priority', 'Spec Ref', 'Notes', 'Change', 'Change Reason'];

export function readZhCopy(path: string): Record<string, Record<string, string>> {
  if (!existsSync(path)) return {};
  const [, ...body] = parseCsv(readFileSync(path, 'utf8').replace(/^﻿/, ''));
  return Object.fromEntries(body.filter(r => r[0]).map(r => [r[0], Object.fromEntries(ZH_COLS.map((c, i) => [c, r[i] ?? '']))]));
}
