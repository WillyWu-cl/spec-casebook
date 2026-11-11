// Fills annotation-trace.json for this draft (phd/cutout). Run after annotations.ts: node <draft>/trace.ts
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const DIR = dirname(fileURLToPath(import.meta.url));
const p = join(DIR, 'annotation-trace.json');
const t = JSON.parse(readFileSync(p, 'utf8'));
const map: Record<string, string> = {
  'pm-11e-buttons@100,103': 'R-005, R-060, R-061',
  'pm-11e-buttons@579,251': 'label: link to the Design 2025/09 page; its items are traced below',
  'pm-11e-buttons@579,461': 'R-010',
  'pm-11e-buttons@606,692': 'R-011',
  'pm-11e-buttons@606,842': 'R-012',
  'pm-11e-buttons@606,992': 'R-013',
  'pm-11e-buttons@606,1142': 'R-014',
  'pm-11e-buttons@606,1302': 'R-014, R-028',
  'pm-11e-crosstab@145,1702': 'R-040',
  'pm-11e-crosstab@1342,1830': 'R-090',
  'pm-11e-crosstab@2017,1830': 'R-091',
  'pm-11e-crosstab@1153,2242': 'R-090',
  'pm-11e-crosstab@1828,2242': 'R-091',
  'pm-11e-crosstab@667,2716': 'R-003, R-090',
  'pm-11e-crosstab@1342,2716': 'R-040, R-090',
  'pm-11e-crosstab@2017,2716': 'R-040, R-013, R-091',
  'pm-11e-logic@1720,194': 'R-020, R-021, R-022, R-023, R-024, R-025, R-026, R-027, R-028, R-029, R-030, R-031, R-032, R-033, R-034',
  'pm-11e-logic@2144,264': 'label: column heading (是否記為一步)',
  'pm-11e-logic@2284,264': 'R-020, R-021, R-022, R-023, R-024, R-025, R-026, R-027, R-028',
  'pm-11e-logic@2604,264': 'R-020, R-021, R-022, R-023, R-024, R-025, R-026, R-027, R-028, R-006, R-051',
  'pm-11e-open@3311,1169': 'R-072, R-051',
  'pm-11e-open@3756,1292': 'Q-6, R-051',
  'pm-11e-rules@2553,1938': 'R-005, R-040, R-041, R-042, R-050, R-060, R-061, R-035, R-016, R-017, R-015, R-055, R-044, R-070, R-071, R-072, Q-1',
  'uiux-before-11e@137,164': 'ui: status bar',
  'uiux-before-11e@599,181': 'ui: status bar',
  'uiux-before-11e@673,752': 'older: the 11/E room has tabs Background / Stroke (R-004)',
  'uiux-before-11e@865,791': 'older: the 11/E room chips (R-004)',
  'uiux-before-11e@1013,791': 'older: the 11/E room chips (R-004)',
  'uiux-before-11e@141,895': 'R-001',
  'uiux-before-11e@281,895': 'R-001',
  'uiux-before-11e@419,895': 'R-001',
  'pm-11e-buttons@579,311': 'older: 11/E boards (2025/09 Background room; R-002, R-004)',
  'pm-11e-buttons@579,371': 'older: 11/E boards (2025/09 AI Background room, not part of this spec)',
  'pm-11e-buttons@579,431': 'older: 11/E boards (2025/09 on-canvas undo / redo; 11/E puts them in the bottom bar, R-002)',
};
let missing = 0;
for (const b of t.blocks) { if (map[b.id]) b.trace = map[b.id]; else if (!b.trace) { missing++; console.log('untraced', b.id, b.text.slice(0, 80)); } }
writeFileSync(p, JSON.stringify(t, null, 2) + '\n');
console.log('missing', missing);
