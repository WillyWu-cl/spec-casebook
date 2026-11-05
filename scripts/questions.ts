// Answers reviewers typed under a table's Open questions on the Cases page (scripts/lib/questions.ts), as text for the
// agent: every answer still "open", and a note when its question changed since.
// Usage: node scripts/questions.ts <product>/<feature> <platform> [--draft <id>] [--all]
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { arg, assertIds, draftsDir, tableDir } from './lib/library.ts';
import { parseQuestions, readAnswers } from './lib/questions.ts';

const [feature, platform] = process.argv.slice(2);
assertIds(feature, platform);
const draft = arg('draft'), all = process.argv.includes('--all');
const md = draft ? join(draftsDir(feature, platform), draft, 'requirements.md') : join(tableDir(feature, platform), 'requirements.md');
const qs = existsSync(md) ? parseQuestions(readFileSync(md, 'utf8')) : [];
const list = Object.entries(readAnswers(feature)).filter(([, a]) => all || a.status === 'open');
if (!list.length) console.log(all ? 'No answers.' : 'No open answers.');
for (const [id, a] of list) {
  const now = qs.find(q => q.id === id);
  console.log(`${id} [${a.status}] (${a.platform}, ${a.at}${a.by ? `, ${a.by}` : ''}): ${a.answer}`);
  if (!now) console.log(`  note: ${id} is not an open question in ${md}`);
  else if (now.text !== a.question) console.log(`  note: the question text changed since this answer; answered: ${a.question}`);
  if (a.resolution) console.log(`  done: ${a.resolution}`);
}
