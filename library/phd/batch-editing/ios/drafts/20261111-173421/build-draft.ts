// Build the Batch Editing iOS v2 draft (REQ-011) from the approved v1 cases.csv, same spec set (2026-11-09-figma,
// re-read 2026-11-11: pm-ui-4 DR-05g now says Undo / Redo switches the Adjustment tab). Covers what v1 checked only in
// part: several edits in one room visit as one main-screen step, the strip coming back from Curve through a slider
// tool, 「All」 shown with HSL open, and a Free user editing 20 photos. MODS changes fields of a row (Change =
// modified), NEW rows go right after the row they extend (REQ-033).
// Re-runnable: node library/phd/batch-editing/ios/drafts/20261111-173421/build-draft.ts
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DRAFT_COLUMNS, readTable, writeTable } from '../../../../../../scripts/lib/library.ts';

const HERE = dirname(fileURLToPath(import.meta.url));
type Rec = Record<string, string>;
type Fields = Partial<Record<'Section' | 'Precondition' | 'Action' | 'Expected Result' | 'Priority' | 'Spec Ref' | 'Notes', string>>;

const BASE = 'iPhone, PhotoDirector signed in, Free tier; at least 21 photos in the gallery, of different sizes and ratios (e.g. 2:3, 4:5, 1:1, 16:9)';
const ROOM5 = `${BASE}; Batch Edit Room open with 5 photos (Launcher › Edit › Batch › 5 photos › Next)`;
const ADJ = `${ROOM5}; 「Adjustment」 open on photo 1`;
const ONESTEP = 'Several edits in one room visit are one main-screen step (R-028, R-060)';
const STRIP = 'PM D1-12: the strip comes back on collapsing the panel or choosing a slider tool such as Exposure; 「All」 stays shown (R-068, R-069)';

const MODS: Record<string, [Fields, string]> = {
  'TC-021': [{ Action: `1. On photo 1 open 「Adjustment」, set Exposure +30 and Contrast +20, tap ✓
2. On photo 2 open 「Adjustment」, set Contrast +30, tap ✓
3. Show photo 1 and tap ↶ once
4. Tap ↷`, 'Expected Result': 'One ↶ takes photo 1 back to before that room visit (no Exposure, no Contrast change); photo 2 keeps Contrast +30. ↷ brings both of photo 1\'s values back', 'Spec Ref': 'R-028, R-060' }, ONESTEP],
  'TC-022': [{ Action: `1. Open 「Crop & Rotate」, choose 「Squre」, tap 「All」
2. Show photo 3 and tap 「Rotate」
3. Tap ✓
4. Show photo 3 and tap ↶ once`, 'Expected Result': 'One ↶ takes photo 3 back to before that room visit (uncropped and not rotated); photos 1, 2, 4, 5 stay square', 'Spec Ref': 'R-028, R-060' }, ONESTEP],
  'TC-061': [{ 'Expected Result': 'The first ↶ switches to photo 2 and undoes its Contrast (only photo 2), and the tab switches to 「Light」 (where Contrast is); the second ↶ undoes the Exposure +20 on every photo and 「All」 becomes enabled', Notes: 'PM changed DR-05g on 2026-11-11 (was: the tab stays) and cites the Android single Adjustment room (Q-18).' }, 'PM Figma DR-05g changed 2026-11-11: Undo / Redo switches the Adjustment tab (R-067)'],
  'TC-067': [{ 'Expected Result': 'HSL has the colour chips and the three sliders and hides the strip while 「All」 stays shown; going back to Exposure shows the strip again' }, STRIP],
};

// [after, ID, section, pre, action, expected, prio, refs, notes, reason]
const NEW: [string, string, string, string, string, string, string, string, string, string][] = [
  ['TC-066', 'TC-124', 'Adjustment', `${ADJ}; Color › Curve open`, `1. Tap 「Light」
2. Tap Exposure
3. Tap photo 2's thumbnail`, 'The strip shows again once a slider tool (Exposure) is chosen; tapping photo 2 shows photo 2', 'P2', 'R-069', '', STRIP],
  ['TC-084', 'TC-125', 'AI Enhance', `${BASE}; Batch Edit Room open with 20 photos (Launcher › Edit › Batch › 20 photos › Next)`, `1. Open 「Crop & Rotate」, tap 「Squre」 › 「All」 › ✓
2. Open 「Adjustment」, set Exposure +20, tap 「All」 › ✓
3. Tap Save`, 'A Free user crops, adjusts and saves all 20 photos with no IAP page and no credit; the toasts read 「Applied to 19 photos」', 'P1', 'R-003, R-078', '', 'Free user at the 20-photo limit, not only 5 photos (R-003 variant)'],
];

const approved = readTable(join(HERE, '..', '..', 'cases.csv')) as Rec[];
const used = new Set(approved.map(r => r.ID));
const out: Rec[] = [];
const newAfter = new Map<string, typeof NEW>();
for (const n of NEW) { if (used.has(n[1])) throw new Error(`ID taken ${n[1]}`); used.add(n[1]); newAfter.set(n[0], [...(newAfter.get(n[0]) ?? []), n]); }
const emit = (id: string) => {
  for (const [, ID, Section, Precondition, Action, exp, Priority, refs, Notes, reason] of newAfter.get(id) ?? []) {
    out.push({ ID, Section, Precondition, Action, 'Expected Result': exp, Priority, 'Spec Ref': refs, Notes, Change: 'new', 'Change Reason': `${reason}; REQ-011` });
    emit(ID);
  }
};
const seenMods = new Set<string>();
for (const r of approved) {
  const m = MODS[r.ID];
  const row: Rec = { ...r, Change: 'unchanged', 'Change Reason': '' };
  if (m) { seenMods.add(r.ID); Object.assign(row, m[0]); row.Change = 'modified'; row['Change Reason'] = `${m[1]}; REQ-011`; }
  out.push(row);
  emit(r.ID);
}
const missing = Object.keys(MODS).filter(k => !seenMods.has(k));
if (missing.length) throw new Error(`MODS for unknown rows: ${missing}`);
if (out.length !== approved.length + NEW.length) throw new Error('a NEW row was not placed');
writeTable(join(HERE, 'draft.csv'), DRAFT_COLUMNS, out);
const count = (c: string) => out.filter(r => r.Change === c).length;
console.log(`${out.length} rows → draft.csv (new ${count('new')}, modified ${count('modified')}, unchanged ${count('unchanged')})`);
