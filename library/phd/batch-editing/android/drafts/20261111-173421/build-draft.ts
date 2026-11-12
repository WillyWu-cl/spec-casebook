// Build the Batch Editing Android v5 draft (REQ-011) from the approved v4 cases.csv. Same spec set (2026-11-09); the
// PM Figma text snapshot (specs/2026-11-09-figma, the source of the iOS table) is read as well: it states the rules
// the PDF export 「UI UX flow 2.pdf」 lacks (DR-04 「All」 normal / disabled states and the width / height link, D1-12
// strip hidden in Curve / HSL). Approved rows are kept in order; MODS changes fields of a row (Change = modified, with
// its reason), NEW rows are placed right after the row they extend (REQ-033).
// Re-runnable: node library/phd/batch-editing/android/drafts/20261111-173421/build-draft.ts
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DRAFT_COLUMNS, readTable, writeTable } from '../../../../../../scripts/lib/library.ts';

const HERE = dirname(fileURLToPath(import.meta.url));
type Rec = Record<string, string>;
type Fields = Partial<Record<'Section' | 'Precondition' | 'Action' | 'Expected Result' | 'Priority' | 'Spec Ref' | 'Notes', string>>;

const PREM = 'Signed in with a PhotoDirector Premium account';
const ROOM = `${PREM}; Batch Edit Room open with 12 photos (Launcher 「Edit」 › 「Batch」), no edit yet`;
const CROP = `${ROOM}; Crop & Rotate room open on photo 1`;
const ADJ = `${ROOM}; Adjustment room open on photo 1`;
const S3 = `${PREM}; Batch Edit Room open with the Section 3 test set in this order: ① escalator 2:3 (1706×2559), ② 101 4:5 (1576×1970), ③ tea cup 1:1 (small), ④ seascape 16:9 (2730×1535); Crop & Rotate room open`;
const STATES = 'PM Figma DR-04: 「All」 is disabled with nothing unapplied on the current photo (R-234, Q-16 answered)';
const STRIP = 'PM Figma D1-12: the strip hides while Curve / HSL is open (R-237, R-238, Q-17 answered)';

const MODS: Record<string, [Fields, string]> = {
  'TC-042': [{ Action: `1. Look at 「All」
2. Tap 「All」`, 'Expected Result': '「All」 is greyed (disabled) right after the apply; tapping it does nothing: no toast, no photo changes', 'Spec Ref': 'R-234, R-051' }, STATES],
  'TC-153': [{ Action: `1. Look at 「All」 before any change
2. Choose 3:2 and look again
3. Tap 「All」 and look again`, 'Expected Result': '「All」 is greyed (disabled) on entering with no change, normal after 3:2, and greyed again once applied', 'Priority': 'P2', 'Spec Ref': 'R-234, R-051', Notes: '' }, STATES],
  'TC-059': [{ Action: `1. On ④ seascape tap the pencil
2. Unlink width and height
3. Type 1000 × 500 and confirm
4. Look at the ratio and 「All」
5. Tap 「All」`, 'Expected Result': '④ is cropped to 1000×500, the ratio switches to 「Free」 and 「All」 turns normal; after 「All」 the others get the 2:1 ratio with their own largest box (not 1000×500 px)', 'Spec Ref': 'R-067, R-059, R-236' }, 'PM Figma DR-04: unlinked size changes the ratio to Free and enables 「All」 (R-236)'],
  'TC-062': [{ 'Expected Result': 'All 12 photos return to uncropped together in one step; 「All」 turns normal (enabled) again', 'Spec Ref': 'R-081, R-082, R-087, R-234' }, STATES],
  'TC-063': [{ 'Expected Result': 'All 11 other photos and photo 1 get 3:2 back together; 「All」 is greyed again', 'Spec Ref': 'R-082, R-087, R-234' }, STATES],
  'TC-075': [{ Action: `1. Look at 「All」
2. Tap 「All」`, 'Expected Result': '「All」 is greyed (disabled) right after the apply; tapping it does nothing: no toast, no photo changes', 'Spec Ref': 'R-234, R-091' }, STATES],
  'TC-076': [{ 'Expected Result': 'Exposure +20 is removed from all 12 photos together; 「All」 turns normal (enabled) again', 'Spec Ref': 'R-098, R-099, R-105, R-234' }, STATES],
  'TC-079': [{ 'Expected Result': 'Both values are undone, and each Undo switches to the tab of the value it undid: 「Color」 after the first (Saturation), 「Light」 after the second (Exposure)' }, 'PM Figma DR-05g changed 2026-11-11: Undo / Redo switches the tab, as the Android single Adjustment room (R-104)'],
  'TC-081': [{ Precondition: `${ADJ}; Exposure +20 applied to all; then on photo 4 Contrast +10 and Saturation +10 set (not applied)`, Action: `1. Tap ✓
2. On the main screen show photo 4
3. Tap Undo once`, 'Expected Result': 'Back in Batch Edit Room all photos keep +20; one Undo takes photo 4 back to its state before the room (no Exposure, Contrast or Saturation change); the other photos keep +20' }, 'Several edits in one room visit are one main-screen step (R-103)'],
};

// [after, ID, section, pre, action, expected, prio, refs, notes, reason]
const NEW: [string, string, string, string, string, string, string, string, string, string][] = [
  ['TC-058', 'TC-163', 'Crop rules (Section 3)', S3, `1. On ④ seascape tap the pencil
2. With width and height linked, type a smaller width and confirm
3. Look at the height and 「All」`, 'The height follows (ratio kept) and 「All」 stays greyed (disabled): a size-only change has nothing to apply', 'P2', 'R-236, R-234', '', 'PM Figma DR-04: linked size change keeps 「All」 disabled (R-236)'],
  ['TC-153', 'TC-162', 'Crop & Rotate', CROP, `1. Choose 3:2 on photo 1 (do not tap 「All」)
2. Tap photo 2's thumbnail and look at 「All」
3. Tap photo 1's thumbnail and look at 「All」`, '「All」 is greyed on photo 2 (no change of its own) and normal again on photo 1 (its 3:2 not yet applied)', 'P2', 'R-234', '', STATES],
  ['TC-075', 'TC-164', 'Adjustment', ADJ, `1. Look at 「All」
2. Set Exposure +20 and look again
3. Tap photo 2's thumbnail and look again
4. Tap photo 1's thumbnail and look again`, '「All」 is greyed on entering, normal after Exposure +20, greyed on photo 2 (no change of its own) and normal again on photo 1', 'P2', 'R-234, R-091', '', STATES],
  ['TC-076', 'TC-165', 'Adjustment', `${ADJ}; Exposure +20 applied to all and undone once`, 'Tap Redo once', 'Exposure +20 is back on all 12 photos together; 「All」 is greyed again', 'P2', 'R-099, R-105, R-234', '', STATES],
  ['TC-159', 'TC-166', 'Adjustment', ADJ, `1. Tap 「Color」
2. Open Curve
3. Tap where photo 2's thumbnail was`, 'While Curve is open the thumbnail strip fades out and does not react: photo 1 stays current; 「All」 is still shown at the top right', 'P2', 'R-237', '', STRIP],
  ['TC-166', 'TC-167', 'Adjustment', `${ADJ}; Color › Curve open (strip hidden)`, `1. Tap 「Light」
2. Tap Exposure
3. Tap photo 2's thumbnail`, 'The strip shows again once a slider tool (Exposure) is chosen; tapping photo 2 makes it current', 'P2', 'R-238', '', STRIP],
  ['TC-167', 'TC-168', 'Adjustment', ADJ, `1. Tap 「Color」
2. Open HSL and look at the strip and 「All」
3. Fold the panel with ﹀
4. Tap photo 2's thumbnail`, 'With HSL open the strip is hidden and 「All」 is shown; after folding the strip shows again and photo 2 becomes current', 'P2', 'R-237, R-238', '', STRIP],
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
