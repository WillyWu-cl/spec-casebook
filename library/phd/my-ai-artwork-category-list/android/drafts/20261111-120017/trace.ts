// Fills annotation-trace.json for this draft (same script in the iOS and Android draft folders).
// Run after annotations.ts: node library/phd/my-ai-artwork-category-list/<platform>/drafts/<id>/trace.ts
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const DIR = dirname(fileURLToPath(import.meta.url)), p = join(DIR, 'annotation-trace.json');
const t = JSON.parse(readFileSync(p, 'utf8'));
const TRACE: Record<string, string> = {
  'pm-all-categories@1120,3373': 'R-010, R-011, R-012, R-014, R-015, R-016, R-020, R-021, R-022, R-023, Q-4',
  'pm-entry-flow@160,879': 'R-001, R-002, R-010, R-020, R-070',
  'pm-entry-flow@670,929': 'R-020, R-071',
  'pm-entry-flow@1180,929': 'R-020, Q-6',
  'pm-entry-flow@160,1933': 'label: arrow legend (blue line = forward, tap)',
  'pm-header@100,309': 'R-013, Q-1, Q-7',
  'pm-overview@160,555': 'R-002, R-005, R-010, R-013, R-014, R-017, R-024, R-040, R-041, R-050, R-051, R-052, R-004',
  'pm-recent@160,2336': 'label: board title',
  'pm-recent@1120,2373': 'R-002, R-003, R-004, R-005, R-010, Q-1',
  'pm-draft@1931,360': 'R-014',
  'pm-draft@962,530': 'older: the 8/E multi-select spec (selection stroke and number, failed results selectable); unchanged by 11/E, held as today by R-005 (Q-1 answered)',
  'pm-draft@2341,614': 'older: the count option is marked 「未採用」 (RD 10/28, no count API); R-014 holds',
  'pm-draft@1580,1960': 'older: the 8/E Recent spec (「26 8E Recent」); unchanged by 11/E, held as today by R-005 (Q-1 answered)',
  'pm-draft@1500,3290': 'R-023, R-025',
};
for (const b of t.blocks) { if (!TRACE[b.id]) throw new Error(`untraced ${b.id}`); b.trace = TRACE[b.id]; }
writeFileSync(p, JSON.stringify(t, null, 2) + '\n');
console.log(`traced ${t.blocks.length} blocks`);
