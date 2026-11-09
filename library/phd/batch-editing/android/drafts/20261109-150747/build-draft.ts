// Build the Batch Editing Android v2 draft (REQ-003) from the approved v1 cases.csv: spec set 2026-11-09 adds the
// Design frames (exported one PDF per frame) and the re-exported PM page UI UX flow 2.pdf. Approved rows are kept in
// order; MODS changes fields of a row (Change = modified, with its reason), NEW rows are placed right after the row
// they extend (REQ-033). requirements.md is written by make-requirements.py in this folder.
// Re-runnable: node library/phd/batch-editing/android/drafts/20261109-150747/build-draft.ts
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DRAFT_COLUMNS, readTable, writeTable } from '../../../../../../scripts/lib/library.ts';

const HERE = dirname(fileURLToPath(import.meta.url));
type Rec = Record<string, string>;
type Fields = Partial<Record<'Section' | 'Precondition' | 'Action' | 'Expected Result' | 'Priority' | 'Spec Ref' | 'Notes', string>>;

const PREM = 'Signed in with a PhotoDirector Premium account';
const FREE = 'Signed in with a Free (non-Premium) account';
const GAL = 'Gallery holds at least 25 photos of mixed orientation';
const ROOM = `${PREM}; Batch Edit Room open with 12 photos (Launcher 「Edit」 › 「Batch」), no edit yet`;
const CROP = `${ROOM}; Crop & Rotate room open on photo 1`;
const ADJ = `${ROOM}; Adjustment room open on photo 1`;
const FAIL = 'needs: an AI Enhance failure fixture (server fault or RD switch) for some photos of the batch; record Blocked --as test-data without one.';
const NEXT = 'Design draws 「Next」 for the picker button (R-015, Q-1)';

const MODS: Record<string, [Fields, string]> = {
  'TC-005': [{ 'Expected Result': 'The 「Batch」 tab is highlighted; a bottom bar shows the hint 「Select 1 to 20 photos to continue. (0/20)」 and 「Next」', Notes: 'Design copy; the PM boards draw 「Select 1 to 20 photos.」 / 「n selected (max 20)」 and 「Done」 (Q-1): record the string shown before and after selecting.' }, 'Design copy for the bottom bar (R-015, Q-1)'],
  'TC-007': [{ 'Expected Result': 'Each selected thumbnail shows its order number 1, 2, 3; the hint ends 「(3/20)」; the tray under the bar lists the 3 photos in that order; 「Next」 is enabled', 'Spec Ref': 'R-013, R-014, R-015, R-019' }, 'Design copy and the selected-photo tray (R-015, R-019)'],
  'TC-008': [{ Action: 'Tap 「Next」 and look at the thumbnail strip of Batch Edit Room' }, NEXT],
  'TC-010': [{ Action: 'Tap 「Next」', 'Expected Result': 'Record: 「Next」 is disabled or does nothing; Batch Edit Room does not open with no photo' }, NEXT],
  'TC-011': [{ Precondition: `${PREM}; Photo Picker on 「Batch」; ${GAL}`, 'Expected Result': 'All 20 can be selected (numbers 1–20); the hint ends 「(20/20)」', Notes: 'Android is held to 20 like iOS, not a lower platform cap. Free users: TC-156.' }, 'Design copy for the count; Premium variant of R-013 (Q2 decided)'],
  'TC-013': [{ Action: 'Tap 「Next」' }, NEXT],
  'TC-014': [{ Precondition: 'Photo Picker from 「Edit」 on 「Batch」, 1 photo selected (「Select 1 to 20 photos to continue. (1/20)」)', Action: 'Tap 「Next」' }, NEXT],
  'TC-015': [{ Action: 'Tap 「Next」' }, NEXT],
  'TC-018': [{ Action: 'Tap 「Next」' }, NEXT],
  'TC-019': [{ Precondition: `${PREM}; Photo Picker from the 「AI Enhance」 shortcut on 「Batch」 with 3 photos selected (「(3/20)」)`, Action: 'Tap 「Next」' }, NEXT],
  'TC-020': [{ Action: 'Tap Replace photo, switch the picker to 「Batch」, select 3 photos and tap 「Next」', 'Expected Result': 'The picker allows the 「Batch」 tab and 「Next」 opens Batch Edit Room with the 3 photos' }, NEXT],
  'TC-022': [{ Action: 'Look for a Batch Edit shortcut on the Launcher (shortcut row and 「View all」); if there is one, tap it', 'Expected Result': 'Record whether the shortcut exists (its icon is still being designed) and where it lands (expected: the Photo Picker on 「Batch」)', Notes: 'UI UX flow 2 plans the shortcut and a deeplink (TC-152); landing not stated (Q-15).' }, 'PM entry board now plans a Launcher shortcut (R-022, Q-15; Q-2 settled)'],
  'TC-024': [{ 'Expected Result': 'Home and Replace photo at the left; a feedback button (speech bubble with !), Save (download icon, as Edit Room) and Setting at the right', Notes: 'Feedback button drawn by Design only (Q-21): record if absent.' }, 'Design top bar adds a feedback button (R-031, Q-21)'],
  'TC-036': [{ 'Expected Result': 'Redo is no longer available and the Enhance result of photo 2 cannot be brought back; on AI Enhance the button reads 「Enhance」 (enabled): photo 2 can be enhanced again', 'Spec Ref': 'R-038, R-229' }, 'UI UX flow 2: the photo can be enhanced again from the AI Enhance room (R-038, R-229)'],
  'TC-037': [{ 'Expected Result': 'Same as the current Crop & Rotate room (Rotate, Flip, Flip Vertically, Original, Custom, Square, 2:3, 3:2, 3:4 …, angle slider, ✕ / undo / redo / ✓); no title above the tool panel; top bar ‹, 「W x H」 with a pencil, 「All」; batch thumbnail strip at the bottom', Notes: 'The Design draws 「Squre」 (Q-10) and no reset button.' }, 'Design Crop & Rotate frame (R-050)'],
  'TC-070': [{ Notes: 'The Design frames draw 「AI Exposure」 between 「Exposure」 and 「Contrast」 (Q-18): record whether the app shows it.' }, 'Design draws AI Exposure, PM does not (R-090, Q-18)'],
  'TC-093': [{ Notes: 'Q1 decided 10/30 (Judy with Samuel): no credits day-1.' }, 'PM Q1 decided (pm-decisions; Q-7 settled)'],
  'TC-096': [{ 'Spec Ref': 'R-124, R-135, R-120' }, 'R-116 no longer says enhanced photos leave N; Retry Failed counts only failed photos (R-124)'],
  'TC-097': [{ Precondition: `${PREM}; Batch Edit Room with 3 photos all enhanced; photo 2 Enhance undone on the main screen`, Action: `1. Open AI Enhance
2. Tap 「Enhance」
3. Tap 「Start」`, 'Expected Result': 'The button reads 「Enhance」 (enabled) on this new visit; the dialog reads 「Enhance 3 photos?」; photo 2 is enhanced from its state now, photos 1 and 3 from their enhanced results', 'Spec Ref': 'R-229, R-116, R-038', Notes: 'Was: 「Enhanced」 greyed, photo 2 cannot be enhanced again (removed from UI UX flow 2).' }, 'R-117 removed; R-229: entering the room again allows another Enhance'],
  'TC-100': [{ Notes: 'The Design draws the Discard Dialog over the AI Enhance page (Q-19): record if ✕ asks first.' }, 'Design Discard frame over the AI Enhance page (R-130, Q-19)'],
  'TC-101': [{ 'Expected Result': 'No dialog per photo; at the end one summary card 「12 completed, 3 failed」 「Failed photos are marked with ! on the thumbnails.」 with a ✕; a red ! at the top right of the 3 failed thumbnails only; the button reads 「Retry Failed (3)」', Notes: FAIL }, 'Design copy 「with !」 and the card ✕ (R-123)'],
  'TC-117': [{ 'Expected Result': 'The Photo Picker opens on 「Batch」 with the 12 photos still selected; 「Next」 opens Batch Edit Room with every photo unedited (photo 1 no longer Square)' }, NEXT],
  'TC-119': [{ Action: 'Deselect 2 photos, select 3 new ones and tap 「Next」' }, NEXT],
  'TC-122': [{ 'Expected Result': '「Saving k / 20」 and 「Please do not leave this page or quit the app.」 with a progress bar over the main screen; the top bar is dimmed (no feedback button) and does not respond; k counts up; the Batch Save page opens only when all are saved' }, 'Design saving frame (R-150)'],
  'TC-128': [{ 'Expected Result': 'A thumbnail grid of the 12 saved photos under the title 「Save 12 photos」; 「‹」 top left, Home top right, 「Edit Next Batch」 fixed at the bottom; no Video tab and no 「Turn it to video」', Notes: 'Design copy; PM writes 「Saved 12 photos」 (Q-20).' }, 'Design title copy (R-153, Q-20)'],
  'TC-134': [{ Precondition: `${PREM}; Batch Edit Room with 12 photos, photo 1 cropped to Square; saved; Photo Picker opened by 「Edit Next Batch」`, 'Expected Result': 'Returns to Batch Edit Room showing the edits as they were (photo 1 still Square), not the Launcher and not the Batch Save page', Notes: 'UI UX flow 2: day-1 follows the Android single Edit Room (iOS single goes to the Launcher today).', 'Spec Ref': 'R-155, R-235' }, 'UI UX flow 2: ‹ from that Picker returns to Batch Edit Room (R-155, new arrow R-235)'],
  'TC-142': [{ Notes: 'The Design draws the Discard Dialog over the AI Enhance page (Q-19): record if Back asks first.' }, 'Design Discard frame over the AI Enhance page (Q-19)'],
  'TC-148': [{ Precondition: `${PREM}; Batch Edit Room with 12 photos, photo 1 cropped to Square; saved; Photo Picker opened by 「Edit Next Batch」`, 'Expected Result': 'Same as 「‹」: returns to Batch Edit Room with the edits (photo 1 still Square), not the Batch Save page', 'Spec Ref': 'R-170, R-155, R-235' }, 'UI UX flow 2: Back from that Picker returns to Batch Edit Room (R-155, R-235)'],
};

// [after, ID, section, pre, action, expected, prio, refs, notes, reason]
const NEW: [string, string, string, string, string, string, string, string, string, string][] = [
  ['TC-009', 'TC-150', 'Photo Picker', 'Photo Picker on 「Batch」 with photos 1, 2, 3 selected', 'Tap ✕ on photo 2 in the tray under the bottom bar', 'Photo 2 leaves the tray and its tile loses the number; the hint ends 「(2/20)」; record whether photo 3 is renumbered to 2', 'P2', 'R-019, R-014', 'Spec silent on renumbering (Q-13).', 'Design picker tray with ✕ (R-019)'],
  ['TC-150', 'TC-151', 'Photo Picker', 'Photo Picker on 「Batch」, nothing selected', `1. Tap the expand icon at the bottom right of a tile
2. Close what opens`, 'The photo opens large without being selected; closing it returns to the picker with nothing selected', 'P3', 'R-233', 'Design draws the icon only (Q-13): record what opens.', 'Design tile expand icon (R-233)'],
  ['TC-011', 'TC-156', 'Photo Picker', `${FREE}; ${GAL}`, `1. On the Launcher tap 「Edit」
2. Choose 「Batch」
3. Select 20 photos one by one
4. Tap 「Next」`, 'No IAP page or Premium prompt at any count (not at the 7th or the 13th photo); all 20 are selected; Batch Edit Room opens with 20 photos', 'P1', 'R-013, R-004', 'Q2 decided 10/30: no Premium lock day-1 (pm-decisions).', 'PM Q2 decided: free, max 20 (R-013)'],
  ['TC-022', 'TC-152', 'Entry', `${PREM}; phone on USB`, 'Open the deeplink phd://navigate/page?name=batch_edit (adb shell am start -a android.intent.action.VIEW -d "phd://navigate/page?name=batch_edit")', 'PhotoDirector opens on the Batch Edit entry; record where it lands (expected: the Photo Picker on 「Batch」)', 'P2', 'R-022', 'Landing not stated (Q-15).', 'UI UX flow 2 adds the batch_edit deeplink (R-022)'],
  ['TC-025', 'TC-154', 'Batch Edit Room', ROOM, 'Tap the feedback button (speech bubble with !) in the top bar', 'Record what opens; closing it returns to Batch Edit Room with nothing changed', 'P3', 'R-031', 'Drawn by Design only (Q-21).', 'Design top bar feedback button (R-031)'],
  ['TC-037', 'TC-161', 'Crop & Rotate', CROP, `1. Look at the top bar
2. Switch to a photo of another size
3. Tap the pencil`, 'The top bar shows photo 1\'s pixel size 「W x H」 with a pencil; it changes to the other photo\'s size on switching; the pencil opens the manual pixel input', 'P2', 'R-050, R-066', '', 'Design Crop top bar with the size and pencil (R-050)'],
  ['TC-161', 'TC-155', 'Crop & Rotate', `${CROP}; 3:2 applied to all`, 'Tap ‹ at the top left', 'Same as ✕: back to Batch Edit Room with the room\'s changes dropped; record if they are kept (as ✓)', 'P3', 'R-050, R-085', 'Spec silent on ‹ beside ✕ (Q-22).', 'Design Crop top bar ‹ (R-050, Q-22)'],
  ['TC-042', 'TC-153', 'Crop & Rotate', CROP, `1. Look at 「All」 before any change
2. Choose 3:2 and look again
3. Tap 「All」 and look again
4. Repeat in the Adjustment room`, 'Record when 「All」 shows its greyed look; whenever it is not greyed a tap applies the settings to the other photos', 'P3', 'R-234, R-051, R-091', 'Design draws a disabled state (Q-16).', 'Design 「All」 states (R-234)'],
  ['TC-070', 'TC-159', 'Adjustment', ADJ, `1. Open the 「Color」 tab and open HSL
2. Fold the panel with ﹀
3. Open it again with ︿
4. Open Curve and fold and open it the same way`, 'HSL shows 「Hue」 / 「Saturation」 / 「Lightness」 and eight colour dots; Curve shows RGB / red / green / blue channels beside the curve; ﹀ folds the panel and the photo grows, ︿ opens it again; reset and compare sit on the photo', 'P2', 'R-230', '', 'Design HSL / Curve frames (R-230)'],
  ['TC-074', 'TC-158', 'Adjustment', ADJ, `1. On photo 1 set HSL red Hue +20
2. Pull the RGB curve up in the middle
3. Tap 「All」
4. Look at photos 2 and 5`, 'Photos 2 and 5 get the same HSL and Curve values (reds shifted, mid-tones brighter); the toast 「Applied to 11 photos」 appears', 'P1', 'R-231, R-092', '', 'Apply to all carries HSL and Curve (R-231)'],
  ['TC-097', 'TC-157', 'AI Enhance', `${PREM}; Batch Edit Room with 3 photos, all enhanced in one AI Enhance visit, back on the main screen`, `1. Tap 「AI Enhance」 again
2. Tap 「Enhance」
3. Tap 「Start」`, 'On the new visit the button reads 「Enhance」 (enabled); the dialog reads 「Enhance 3 photos?」; all 3 are enhanced again from their enhanced results; then the button reads 「Enhanced」 greyed', 'P1', 'R-229, R-116', 'UI UX flow 2 (was: once per photo).', 'R-229: one Enhance per visit, again on the next visit'],
  ['TC-102', 'TC-160', 'AI Enhance failures', 'Partial-failure summary card shown', 'Tap ✕ on the card', 'The card closes; the red ! marks and 「Retry Failed (3)」 stay', 'P3', 'R-123', FAIL, 'Design result card ✕ (R-123)'],
];

const approved = readTable(join(HERE, '..', '..', 'cases.csv')) as Rec[];
const used = new Set(approved.map(r => r.ID));
const out: Rec[] = [];
const newAfter = new Map<string, typeof NEW>();
for (const n of NEW) { if (used.has(n[1])) throw new Error(`ID taken ${n[1]}`); used.add(n[1]); newAfter.set(n[0], [...(newAfter.get(n[0]) ?? []), n]); }
const emit = (id: string) => {
  for (const [, ID, Section, Precondition, Action, exp, Priority, refs, Notes, reason] of newAfter.get(id) ?? []) {
    out.push({ ID, Section, Precondition, Action, 'Expected Result': exp, Priority, 'Spec Ref': refs, Notes, Change: 'new', 'Change Reason': `${reason}; REQ-003` });
    emit(ID);
  }
};
const seenMods = new Set<string>();
for (const r of approved) {
  const m = MODS[r.ID];
  const row: Rec = { ...r, Change: 'unchanged', 'Change Reason': '' };
  if (m) { seenMods.add(r.ID); Object.assign(row, m[0]); row.Change = 'modified'; row['Change Reason'] = `${m[1]}; REQ-003`; }
  out.push(row);
  emit(r.ID);
}
const missing = Object.keys(MODS).filter(k => !seenMods.has(k));
if (missing.length) throw new Error(`MODS for unknown rows: ${missing}`);
if (out.length !== approved.length + NEW.length) throw new Error('a NEW row was not placed');
writeTable(join(HERE, 'draft.csv'), DRAFT_COLUMNS, out);
const count = (c: string) => out.filter(r => r.Change === c).length;
console.log(`${out.length} rows → draft.csv (new ${count('new')}, modified ${count('modified')}, unchanged ${count('unchanged')})`);
