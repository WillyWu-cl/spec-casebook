// Draft on approved v1: TC-018 gets the app languages the user named for East and West (REQ-004, 2026-10-30).
// Run from the repo root: node library/phd/swipe-collage/android/drafts/20261030-145851/build-draft.ts
import { join } from 'node:path';
import { DRAFT_COLUMNS, readTable, tableDir, writeTable } from '../../../../../../scripts/lib/library.ts';

const here = import.meta.dirname;
const rows = readTable(join(tableDir('phd/swipe-collage', 'android'), 'cases.csv'));
const edits: Record<string, Partial<Record<string, string>>> = {
  'TC-018': {
    Precondition: 'Template Page open',
    Action: 'Set the app language in turn to Traditional Chinese and Japanese (East), then to English and German (West); after each change reopen the Template Page and swipe through every template page',
    'Expected Result': 'Traditional Chinese and Japanese show the East thumbnail set; English and German show the West set (every page of that set)',
    Notes: 'Languages per REQ-004. Whether the set follows the app language or the phone region is not stated (Q-12): if a language shows the other set, record the phone region too.',
    'Change Reason': 'REQ-004: East is tested in Traditional Chinese and Japanese, West in English and German',
  },
};
const out = rows.map(r => edits[r.ID] ? { ...r, ...edits[r.ID], Change: 'modified' } : { ...r, Change: 'unchanged', 'Change Reason': '' });
writeTable(join(here, 'draft.csv'), DRAFT_COLUMNS, out);
console.log(`${out.length} rows, ${Object.keys(edits).length} modified`);
