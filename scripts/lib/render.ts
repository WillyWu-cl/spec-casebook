// Fill the page template with table data. The same page serves as the review page (editable, Copy and Save)
// and as the read-only view of an approved table.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './library.ts';
import { withShared } from './page-shared.ts';

export type PageData = {
  mode: 'review' | 'view';
  save: boolean;
  feature: string; platform: string; title: string;
  draft: string | null; based_on_version: number | null; version: number | null; approved_at: string | null;
  spec_files: { name: string; sha256: string }[];
  rows: Record<string, string>[];
  previous: Record<string, Record<string, string>>;
  requirements: string; update_plan: string;
  // Open questions and their answers (scripts/lib/questions.ts); the review page shows them above the table
  questions?: { id: string; text: string; rows: string[] }[];
  answers?: Record<string, { answer: string; by: string; at: string; platform: string; status: string; resolution?: string; question: string }>;
  zh?: Record<string, Record<string, string>>;   // Chinese reading copy by case ID (review.ts), shown in 中文 mode
};

export function renderPage(data: PageData): string {
  const tpl = withShared(readFileSync(join(ROOT, 'templates', 'table.html'), 'utf8'));
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return tpl.replace('/*__DATA__*/null', json).replace('__TITLE__', `${data.title} ${data.mode === 'review' ? 'Cases' : 'Test Cases'} · ${data.platform === 'ios' ? 'iOS' : 'Android'}`);
}
