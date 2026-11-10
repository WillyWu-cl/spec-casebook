// Traces every control group of control-trace.json (analysis.md pass 11) by row key (row-keys.json), so a rebuild that
// renumbers rows keeps the trace. Run after controls.ts. Usage: node trace-controls.ts <draft dir>
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
const D = process.argv[2];
const keys = JSON.parse(readFileSync(join(D, 'row-keys.json'), 'utf8'));
const T = (...k: string[]) => k.filter(x => keys[x]).map(x => keys[x]).join(', ') || (() => { throw new Error(`no rows ${k}`); })();
const LAUNCHER = 'n/a: other features\' controls on the shared Launcher (PM mockup of the existing Launcher)';
const EDITROOM = 'n/a: the existing single-photo Edit Room, unchanged by this feature (other tools)';
const DRAFT = 'n/a: PM draft board 「Apply to all · icon options」 (給 PM 選, not in the spec); the same tools are pressed on the Design Crop & Rotate frame';
const CREDIT = 'n/a: credit pill / History drawn in the AI Enhance room top bar; batch charges nothing and whether they show is Q-17';
const map: Record<string, string> = {
  'K-471aa6': T('cr-all', 'ad-all'), 'C-e0011e': T('ad-hsl'), 'K-767df6': T('ad-x', 'cr-x'), 'K-42ab79': T('ad-ok', 'cr-ok'),
  'K-14866f': T('ad-auto'), 'K-55ae2a': T('ad-curve-tools'), 'K-0dafc6': T('ad-redo', 'cr-undo-all'), 'K-f474c6': T('ad-undo', 'cr-undo-single'),
  'K-b56a6b': T('ad-curve-tools'), 'K-67b0a7': T('ad-tools'), 'K-68ce29': T('ad-tools', 'ad-example'), 'K-66b151': T('ad-all'),
  'K-3978a7': T('rm-feedback'), 'K-14ddab': T('ad-all', 'cr-angle'), 'C-745d29': T('ad-hsl'), 'C-fcde4f': T('cr-open', 'ad-open', 'en-open'),
  'K-570f14': 'n/a: 10-pt divider between the Auto tool and the other tools (not tappable)', 'K-161aa5': T('ad-tools'),
  'K-407daa': T('sv-saving'), 'K-fddfa3': T('lv-home', 'sv-home'), 'K-90a9b5': T('ad-info'), 'K-9b8db7': T('lv-repl', 'lv-repl-clean'),
  'K-55d5ba': T('rm-settings'), 'K-0816be': T('en-dialog'), 'K-a03f73': T('er-retry'), 'K-027f5f': T('en-start'), 'K-6ddcb1': T('en-cancel'),
  'C-e2a31f': T('pk-x'), 'K-768f43': T('pk-next'), 'K-32efa4': T('pk-open', 'pk-order'), 'C-4f0857': T('cr-all', 'cr-default'),
  'K-8d5d5a': T('pk-order'), 'K-0ea28f': T('cr-free'), 'K-e7543f': T('cr-orig'), 'K-0e44a5': T('cr-flipv'),
  'K-68efe7': 'n/a: the picker\'s existing Photo / Stock source tabs, unchanged by this feature (the spec adds only Single / Batch)',
  'K-464eb7': T('cr-back', 'sv-back'), 'K-960eab': T('pk-default', 'sc-back'), 'K-23b3e5': CREDIT, 'K-5c3877': CREDIT,
  'K-71e5cc': T('lv-keep', 'lv-repl-keep'), 'K-6e1204': T('sv-next'), 'K-457d02': T('lv-home-discard', 'lv-repl'),
  'C-417772': LAUNCHER, 'K-92c5f3': LAUNCHER, 'K-8fb7ec': LAUNCHER, 'K-a60d7d': T('pk-open'), 'K-f071d7': LAUNCHER, 'K-7dde0f': LAUNCHER,
  'K-b06e44': LAUNCHER, 'K-45214a': LAUNCHER, 'K-998798': LAUNCHER, 'K-4e956f': LAUNCHER, 'K-529c88': LAUNCHER, 'K-6c9709': LAUNCHER,
  'K-1599a8': T('lv-home', 'sv-home'), 'K-e61079': T('rm-ba'), 'K-5062a6': T('rm-undo'), 'K-6ffd14': T('rm-undo'), 'K-efb427': T('cr-open'),
  'C-69394e': T('ad-undo', 'ad-curve'), 'K-6b58e4': T('ad-x'),
  'K-380963': 'n/a: PM mockup of the 26\'10/E Adjustment room (subject-mask toggle); the batch room shows no Subject Detection (DR-06) and the Design draws none',
  'K-dfcc50': 'n/a: PM mockup of the existing room\'s reset; the Design (261104) batch bottom row is ✕ ↶ ↷ ✓ only',
  'C-a494aa': T('ad-tools'), 'K-57b6f8': T('ad-tools'), 'K-93d18f': T('ad-all'), 'C-aa3629': T('ad-auto', 'ad-all'),
  'K-a20d53': CREDIT, 'K-e1af9c': T('en-dialog', 'en-free'), 'K-849da8': T('er-retry'), 'K-5f0901': CREDIT,
  'K-2fe040': T('sc-open'), 'C-fbe74f': EDITROOM, 'K-f1cf6b': EDITROOM, 'K-c03eda': EDITROOM, 'K-9d1050': EDITROOM, 'K-674a1e': EDITROOM,
  'K-8372f2': T('en-done'),
};
const t = JSON.parse(readFileSync(join(D, 'control-trace.json'), 'utf8'));
let left = 0;
for (const e of t.entries) {
  if (e.board === 'pm-apply-all-options') { e.press = DRAFT; e.how = 'n/a'; continue; }
  const v = map[e.group];
  if (!v) { if (!e.press) { console.log('UNTRACED', e.group, e.name, e.label); left++; } continue; }
  e.press = v; e.how = v.startsWith('n/a') ? 'n/a' : 'trace';
}
writeFileSync(join(D, 'control-trace.json'), JSON.stringify(t, null, 2) + '\n');
console.log(`untraced ${left}`);
