// Build the first Batch Editing Android draft (user, 2026-10-30, REQ-001) on spec set 2026-10-30 (UI UX flow.pdf and
// Section 3 · 美圖 Apply to all 實測.pdf). Rows follow the user journey: picker → entry → Batch Edit Room → Crop & Rotate
// (Apply to all, Section 3 crop rules, undo) → Adjustment → AI Enhance (confirm, processing, failures) → leaving →
// save → Batch Save page → Android system Back. Every row is Change = new (a new table).
// Rows with a key (last field) are named in requirements.tpl.md as @KEY; this script writes requirements.md with the
// keys replaced by the row IDs, so the grids stay right when rows move.
// Re-runnable: node library/phd/batch-editing/android/drafts/20261030-151536/build-draft.ts
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DRAFT_COLUMNS, writeTable } from '../../../../../../scripts/lib/library.ts';

const HERE = dirname(fileURLToPath(import.meta.url));
type Row = [section: string, pre: string, action: string, expected: string, prio: string, refs: string, notes?: string, key?: string];

const PREM = 'Signed in with a PhotoDirector Premium account';
const FREE = 'Signed in with a Free (non-Premium) account';
const GAL = 'Gallery holds at least 25 photos of mixed orientation';
const ROOM = `${PREM}; Batch Edit Room open with 12 photos (Launcher 「Edit」 › 「Batch」), no edit yet`;
const EDITED = `${PREM}; Batch Edit Room open with 12 photos, photo 1 cropped to Square and back on the main screen (✓)`;
const SET4 = `${PREM}; Batch Edit Room open with the Section 3 test set in this order: ① escalator 2:3 (1706×2559), ② 101 4:5 (1576×1970), ③ tea cup 1:1 (small), ④ seascape 16:9 (2730×1535); Crop & Rotate room open`;
const CROP = `${ROOM}; Crop & Rotate room open on photo 1`;
const ADJ = `${ROOM}; Adjustment room open on photo 1`;
const ENH = `${ROOM}; AI Enhance page open on photo 1, no photo enhanced yet`;
const FAIL = 'needs: an AI Enhance failure fixture (server fault or RD switch) for some photos of the batch; record Blocked --as test-data without one.';

const rows: Row[] = [
  // ---------- Photo Picker ----------
  ['Photo Picker', `${PREM}; ${GAL}`, 'On the Launcher tap 「Edit」', 'The Photo Picker opens with a 「Single」 / 「Batch」 tab at the top and 「Single」 selected', 'P1', 'R-010, R-200', '', 'PICK_DEFAULT'],
  ['Photo Picker', 'Photo Picker from 「Edit」, 「Batch」 tab chosen earlier, then the picker closed with ‹', 'Tap 「Edit」 again (also after an app restart)', 'The picker opens on 「Single」 again every time', 'P2', 'R-010'],
  ['Photo Picker', 'Photo Picker from 「Edit」 on 「Single」', 'Tap one photo', 'The existing single-photo Edit Room opens with that photo (full Edit Room toolbar, flow unchanged)', 'P1', 'R-011'],
  ['Photo Picker', 'Photo Picker from 「Edit」 on 「Single」', 'Try to select a second photo', 'Only one photo can be chosen on 「Single」 (the first tap opens Edit Room; no multi-select)', 'P2', 'R-013'],
  ['Photo Picker', 'Photo Picker from 「Edit」', 'Tap 「Batch」 and look at the tab and the bottom bar', 'The 「Batch」 tab is highlighted; a bottom bar shows the selection count / hint and 「Done」', 'P1', 'R-012, R-015', 'Copy: 「Select 1 to 20 photos.」 or 「n selected (max 20)」 (Q-1); record the string shown before and after selecting.', 'PICK_TABS_EDIT'],
  ['Photo Picker', `${PREM}; ${GAL}`, 'On the Launcher tap the 「AI Enhance」 shortcut', 'The Photo Picker opens with the same 「Single」 / 「Batch」 tab, 「Single」 selected', 'P1', 'R-012, R-010, R-214', '', 'PICK_TABS_ENH'],
  ['Photo Picker', 'Photo Picker on 「Batch」', 'Tap 3 photos one after another', 'Each selected thumbnail shows its order number 1, 2, 3; the bottom bar shows 3 selected and 「Done」', 'P1', 'R-013, R-014, R-015'],
  ['Photo Picker', 'Photo Picker on 「Batch」 with photos A, B, C selected in that order', 'Tap 「Done」 and look at the thumbnail strip of Batch Edit Room', 'The strip lists A, B, C in the selection order (not the gallery order)', 'P1', 'R-014'],
  ['Photo Picker', 'Photo Picker on 「Batch」 with 3 photos selected (1, 2, 3)', 'Tap photo 2 again to deselect it', 'Photo 2 is deselected; record whether photo 3 is renumbered to 2 and the count drops to 2', 'P3', 'R-014', 'Spec silent on deselect (Q-13).'],
  ['Photo Picker', 'Photo Picker on 「Batch」, nothing selected', 'Tap 「Done」', 'Record: 「Done」 is disabled or does nothing; Batch Edit Room does not open with no photo', 'P3', 'R-015', 'Spec silent (Q-13).'],
  ['Photo Picker', `Photo Picker on 「Batch」; ${GAL}`, 'Select 20 photos', 'All 20 can be selected (numbers 1–20); the count shows 20', 'P1', 'R-013', 'Android is held to 20 like iOS, not a lower platform cap.'],
  ['Photo Picker', 'Photo Picker on 「Batch」 with 20 photos selected', 'Tap a 21st photo', 'The 21st photo is not selected and the toast 「Please pick at most 20 photos.」 appears; the 20 stay selected', 'P1', 'R-018'],
  ['Photo Picker', 'Photo Picker on 「Batch」 with 20 photos selected', 'Tap 「Done」', 'Batch Edit Room opens with 20 thumbnails', 'P2', 'R-013'],
  ['Photo Picker', 'Photo Picker from 「Edit」 on 「Batch」, 1 photo selected (「1 selected (max 20)」)', 'Tap 「Done」', 'The single-photo Edit Room opens (not Batch Edit Room)', 'P1', 'R-016, R-218', '', 'BATCH_ONE'],
  ['Photo Picker', 'Photo Picker from the 「AI Enhance」 shortcut on 「Batch」, 1 photo selected', 'Tap 「Done」', 'The single-photo flow opens as today (not Batch Edit Room)', 'P2', 'R-016, R-013'],
  ['Photo Picker', 'Photo Picker from 「Edit」, 2 photos selected on 「Batch」', 'Tap 「‹」', 'Returns to the Launcher', 'P2', 'R-203', '', 'PICK_BACK'],
  ['Photo Picker', 'Photo Picker from the 「AI Enhance」 shortcut', 'Tap 「‹」', 'Returns to the Launcher', 'P2', 'R-216', '', 'PICK_BACK_ENH'],

  // ---------- Entry ----------
  ['Entry', `${PREM}; Photo Picker from 「Edit」 on 「Batch」 with 12 photos selected`, 'Tap 「Done」', 'The Batch Edit Room main screen opens (photo 1 shown, thumbnail strip, 「Crop & Rotate」 / 「Adjustment」 / 「AI Enhance」)', 'P1', 'R-020, R-001, R-201, R-225', '', 'ENTRY_EDIT'],
  ['Entry', `${PREM}; Photo Picker from the 「AI Enhance」 shortcut on 「Batch」 with 3 photos selected (「3 selected (max 20)」)`, 'Tap 「Done」', 'Batch Edit Room opens directly on its AI Enhance page (「Enhance」 button, thumbnail strip of the 3 photos)', 'P1', 'R-021, R-001, R-215', '', 'ENTRY_ENH'],
  ['Entry', 'Single-photo Edit Room open on one photo, no edit', 'Tap Replace photo, switch the picker to 「Batch」, select 3 photos and tap 「Done」', 'The picker allows the 「Batch」 tab and 「Done」 opens Batch Edit Room with the 3 photos', 'P1', 'R-017, R-219', '', 'EDITROOM_REPLACE'],
  ['Entry', 'Single-photo Edit Room open', 'Look through every Edit Room tool tab (Quick Action, Edit, Enhance, Portrait …)', 'No Batch Edit tool or entry in Edit Room itself', 'P3', 'R-002'],
  ['Entry', 'Launcher open', 'Look for a 「Batch Editing」 shortcut on the Launcher (shortcut row and 「View all」)', 'Record whether a Batch Editing shortcut exists and where it leads', 'P3', 'R-022', 'Board 「Entry: Launcher › Batch Editing shortcut」 has no note; D0-04 lists only the two pickers (Q-2).'],

  // ---------- Batch Edit Room ----------
  ['Batch Edit Room', ROOM, 'Look at the main screen', 'Looks like Edit Room; the bottom bar has only 「Crop & Rotate」, 「Adjustment」, 「AI Enhance」 in that order (no Filter, no Preset, no other tool)', 'P1', 'R-030, R-003'],
  ['Batch Edit Room', ROOM, 'Look at the top bar', 'Home and Replace photo at the left; Save (download icon, as Edit Room) and Setting at the far right', 'P2', 'R-031'],
  ['Batch Edit Room', ROOM, 'Tap the Setting button', 'Record what opens; closing it returns to Batch Edit Room with nothing changed', 'P3', 'R-039', 'Spec silent on the target (Q-3).'],
  ['Batch Edit Room', EDITED, 'Press and hold the compare button on the photo, then release', 'While held the original photo 1 is shown; on release the edited one returns (as Edit Room)', 'P3', 'R-039', 'Compare behaviour assumed from Edit Room (Q-4).'],
  ['Batch Edit Room', ROOM, 'Tap thumbnails 5, 12 and 1 in the strip', 'The large photo switches to each tapped photo; the strip highlights the current one', 'P1', 'R-032'],
  ['Batch Edit Room', ROOM, 'Look at the thumbnails and the strip ends; long-press a thumbnail', 'No × or remove option on any thumbnail and no add (+) button: photos cannot be removed or added', 'P2', 'R-033'],
  ['Batch Edit Room', ROOM, 'Tap 「Crop & Rotate」', 'The Crop & Rotate room opens on the current photo', 'P1', 'R-030, R-202', '', 'CROP_OPEN'],
  ['Batch Edit Room', `${PREM}; Batch Edit Room with 12 photos; photo 1 cropped to Square (✓), then photo 2 cropped to 3:2 (✓); photo 2 is current`, 'Tap Undo on the main screen', 'Only photo 2 goes back to uncropped; photo 1 stays Square', 'P1', 'R-036', '', 'MAIN_UNDO'],
  ['Batch Edit Room', 'As above, after the Undo', 'Switch to photo 1 and tap Undo, then Redo', 'Undo takes photo 1 back to uncropped (photo 2 untouched); Redo makes it Square again', 'P1', 'R-036'],
  ['Batch Edit Room', `${ROOM}; in the Crop & Rotate room photo 1 set to 3:2 and 「All」 tapped, then photo 3 rotated 90°, then ✓`, 'On the main screen, with photo 3 current, tap Undo once', 'Photo 3 goes back to its state before this room visit (no 3:2, no rotation) in one step; the other photos keep 3:2', 'P1', 'R-036, R-086'],
  ['Batch Edit Room', 'As above', 'Switch to photo 5 and tap Undo once', 'Photo 5 loses its 3:2 in one step; photo 3 and the others are not changed by this Undo', 'P2', 'R-036, R-086', 'Section 3 「Undo」 rule may mean one Undo here reverts all photos (Q-9): record.'],
  ['Batch Edit Room', `${PREM}; Batch Edit Room with 3 photos all enhanced (AI Enhance), back on the main screen, photo 2 current`, 'Tap Undo', 'Only photo 2 returns to its pre-Enhance look; photos 1 and 3 stay enhanced', 'P1', 'R-037', '', 'ENH_UNDO'],
  ['Batch Edit Room', 'As above, photo 2 undone', 'Tap Redo', 'Photo 2 shows its Enhance result again', 'P1', 'R-037'],
  ['Batch Edit Room', 'As above, photo 2 undone (Enhance taken back)', 'Crop photo 2 to Square (✓), then look at Redo, then open AI Enhance on photo 2', 'Redo is no longer available; the Enhance result of photo 2 cannot be brought back; AI Enhance shows 「Enhanced」 disabled (photo 2 cannot be enhanced again)', 'P1', 'R-038, R-117'],

  // ---------- Crop & Rotate ----------
  ['Crop & Rotate', CROP, 'Look at the room', 'Same as the current Crop & Rotate room (Rotate, Flip, Flip Vertically, Custom, Original, ratios, angle slider, ✕ / reset / undo / redo / ✓); no title bar above the panel; batch thumbnail strip at the bottom', 'P2', 'R-050, R-080'],
  ['Crop & Rotate', CROP, 'Look at the top right', 'An 「Apply to all」 button with an icon and 「All」 on a semi-transparent dark capsule', 'P2', 'R-051'],
  ['Crop & Rotate', CROP, 'Tap thumbnails in the room strip', 'The current photo switches to the tapped one', 'P2', 'R-080'],
  ['Crop & Rotate', CROP, 'Choose 3:2 on photo 1 and tap 「All」', 'Every photo gets 3:2; the room stays open; the toast 「Applied to 11 photos」 appears; the strip shows all 12 thumbnails cropped at once', 'P1', 'R-052, R-053, R-054, R-071'],
  ['Crop & Rotate', `${PREM}; Batch Edit Room with 3 photos; Crop & Rotate room open`, 'Choose Square and tap 「All」', 'The toast reads 「Applied to 2 photos」 (photos other than the current one)', 'P2', 'R-053'],
  ['Crop & Rotate', `${CROP}; 3:2 applied to all`, 'Tap 「All」 again without any change', 'The button works again (one-shot, not a toggle that switches off); the toast appears again; no photo changes', 'P2', 'R-051'],
  ['Crop & Rotate', `${CROP}; 3:2 applied to all`, 'Switch to photo 4 and choose Square', 'Only photo 4 changes to Square; the others keep 3:2', 'P1', 'R-055'],
  ['Crop & Rotate', `${CROP}; 3:2 applied to all; photo 4 changed to Square`, 'Switch to photo 1, choose 2:3 and tap 「All」', 'Every other photo, photo 4 included, is re-cropped to 2:3 from its original (photo 4\'s Square is overwritten); the strip updates at once', 'P1', 'R-056, R-054'],
  ['Crop & Rotate', CROP, 'On photo 1 tap Rotate once, tap Flip and Flip Vertically, then tap 「All」', 'Every photo is rotated 90° and flipped horizontally and vertically the same way', 'P1', 'R-057, R-068'],
  ['Crop & Rotate', CROP, 'Set the angle slider on photo 1 to +10° and tap 「All」', 'Every photo is straightened by the same +10°; each photo\'s crop box shrinks by its own size so no black edges show', 'P1', 'R-069'],
  ['Crop & Rotate', `${CROP}; photo 1 is portrait, photo 2 landscape`, 'On photo 1 choose 2:3, rotate +5°, then 「All」; check photo 2', 'Photo 2 has 2:3 at +5° with its own largest box inside the rotated photo, placed by the relative-position rule', 'P2', 'R-069, R-060'],
  ['Crop & Rotate', SET4, 'Choose 「Free」 on photo ① and drag the box, then tap 「All」', 'The Free box is accepted as a custom ratio and applied to the others (see the Free rows below)', 'P2', 'R-057, R-063'],

  // ---------- Crop & Rotate: Apply to all rules (Section 3) ----------
  ['Crop rules (Section 3)', SET4, 'Without tapping 「All」, on ④ seascape choose 3:4 (C1)', 'Only ④ changes: largest 3:4 box 1151×1535, full height, centred; ①②③ unchanged', 'P2', 'R-070'],
  ['Crop rules (Section 3)', SET4, 'On ① escalator choose 3:2 and tap 「All」 (C5)', 'All four photos get their own largest 3:2 box, centred', 'P1', 'R-071, R-059'],
  ['Crop rules (Section 3)', SET4, 'On ④ seascape choose Square, drag the box fully left, tap 「All」 (C6)', '④ keeps its box at the left; ①②③ have no horizontal room in 1:1, so their boxes are centred', 'P2', 'R-072, R-061, R-058'],
  ['Crop rules (Section 3)', SET4, 'On ② 101 choose Square, drag the box fully down, tap 「All」 (C7)', '① escalator\'s largest square sits at the bottom (vertical position synced, 1); ④ seascape has no vertical room and is centred; ③ tea cup whole', 'P1', 'R-073, R-060, R-061', 'DR-07 says centred by default; rows follow Section 3 結論 (Q-5).'],
  ['Crop rules (Section 3)', SET4, 'On ④ seascape choose Square, shrink the box to 865×865 at the bottom right, tap 「All」 (C8)', '④ keeps 865×865 at the bottom right; ① gets 1706×1706 flush with the bottom; ② gets 1576×1576 flush with the bottom; ③ tea cup stays whole. The other boxes are NOT shrunk to ≈56 % (Meitu does that)', 'P1', 'R-074, R-058, R-059, R-060'],
  ['Crop rules (Section 3)', SET4, 'On ④ seascape choose Square and tap 「All」; look at ③ tea cup (C9)', '③ tea cup (already 1:1) is not cropped: the box is the whole photo', 'P2', 'R-075, R-065'],
  ['Crop rules (Section 3)', SET4, 'On ① escalator choose 「Free」, drag the box to 1236×611 at the top left, tap 「All」 (C10)', 'The others get the same ≈2:1 ratio with their own largest box, placed at the top left (horizontal and vertical where they have room); not 72 % of their width', 'P1', 'R-076, R-063, R-059'],
  ['Crop rules (Section 3)', `${SET4}; all four set to 3:2 by 「All」`, 'On any photo choose 「Original」 and tap 「All」 (C11)', 'All four return to their own original ratio, uncropped', 'P1', 'R-077, R-064'],
  ['Crop rules (Section 3)', SET4, 'On ④ seascape choose 「Custom」 / pencil and type 3000 × 3000 (C12)', 'The value is refused with a toast (PhD copy, Q-6); the range shown is 238 – 2730 × 238 – 1535 px (this photo\'s size)', 'P2', 'R-066', 'Meitu toast 「Width and height exceed the range」; PhD copy not stated (Q-6).', 'PX_RANGE'],
  ['Crop rules (Section 3)', SET4, 'On ④ seascape type 237 × 237 in the pixel input', 'Refused with the out-of-range toast (minimum 238 px)', 'P3', 'R-066'],
  ['Crop rules (Section 3)', SET4, 'On ④ seascape type 1000 × 500 in the pixel input, then tap 「All」', '④ is cropped to 1000×500; the others get the 2:1 ratio with their own largest box (not 1000×500 px)', 'P1', 'R-067, R-059'],
  ['Crop rules (Section 3)', `${SET4}; Square applied to all, then Save`, 'Compare the saved files\' pixel sizes', 'Sizes differ per photo (each from its own original: e.g. 1706×1706, 1576×1576, 865-or-larger…); this is expected', 'P3', 'R-062'],
  ['Crop rules (Section 3)', `${SET4}; Square applied to all; ① then cropped to 2:3 on its own`, 'On ④ choose 3:2 and tap 「All」', '① is recomputed from its original to its largest 3:2 box; its own 2:3 crop is gone', 'P2', 'R-056'],

  // ---------- Crop & Rotate: undo, ✕, ✓ ----------
  ['Crop & Rotate', `${CROP}`, 'Choose 3:2 and tap 「All」, then tap Undo once', 'All 12 photos return to uncropped together in one step', 'P1', 'R-081, R-082, R-087'],
  ['Crop & Rotate', `${CROP}; 3:2 applied to all, then undone`, 'Tap Redo once', 'All 11 other photos and photo 1 get 3:2 back together', 'P1', 'R-082, R-087'],
  ['Crop & Rotate', `${CROP}; 3:2 applied to all; then photo 4 changed to Square`, 'Switch to photo 7 and tap Undo', 'Only photo 4 goes back to 3:2 and the room switches to photo 4 (strip selects it); photo 7 is unchanged', 'P1', 'R-082, R-084'],
  ['Crop & Rotate', 'As above, after that Undo', 'Tap Undo again', 'The Apply to all step is undone on all photos', 'P2', 'R-081, R-082'],
  ['Crop & Rotate', `${CROP}; photo 1 rotated, photo 2 flipped`, 'Switch between photos 1, 2 and 5 several times, then tap Undo twice', 'The history is intact after switching: the first Undo takes back photo 2\'s flip (switching to photo 2), the second photo 1\'s rotation (switching to photo 1)', 'P2', 'R-083, R-084'],
  ['Crop & Rotate', `${CROP}; 3:2 applied to all, then photo 4 changed to Square`, 'Tap ✕', 'Returns to Batch Edit Room; every photo is as before entering the room (no 3:2, no Square)', 'P1', 'R-085', '', 'CROP_X'],
  ['Crop & Rotate', `${CROP}; 3:2 applied to all`, 'Tap ✓', 'Returns to Batch Edit Room; every photo keeps 3:2', 'P1', 'R-086, R-204', '', 'CROP_OK'],

  // ---------- Adjustment ----------
  ['Adjustment', ROOM, 'Tap 「Adjustment」', 'The Adjustment room opens on the current photo', 'P1', 'R-030, R-205', '', 'ADJ_OPEN'],
  ['Adjustment', ADJ, 'Look at the room: tabs Light / Color / Details and every tool', 'Same as the 26\'10/E Adjustment room; no Subject Detection and no AI Exposure; 「Apply to all」 (icon + 「All」, semi-transparent dark capsule) at the top right; batch strip at the bottom', 'P2', 'R-090, R-091, R-097'],
  ['Adjustment', ADJ, 'Set Exposure +20 on photo 1 and tap 「All」', 'The room stays open; the toast 「Applied to 11 photos」 appears; every thumbnail shows the brighter result', 'P1', 'R-092, R-093, R-094, R-206', '', 'ADJ_APPLY'],
  ['Adjustment', `${ADJ}; Exposure +20 applied to all`, 'Switch to photo 3 and set Contrast +10', 'Only photo 3 gets Contrast +10', 'P1', 'R-095'],
  ['Adjustment', `${ADJ}; Exposure +20 applied to all; photo 3 Contrast +10`, 'Switch to photo 1, set Exposure +30 and tap 「All」', 'Every other photo now has exactly photo 1\'s set (Exposure +30); photo 3 loses its Contrast +10', 'P1', 'R-096'],
  ['Adjustment', ADJ, 'On photo 1 set Exposure +20 (Light), Saturation (Color) and Sharpness (Details), then tap 「All」', 'All three tabs\' values are applied to every photo as one set', 'P2', 'R-092'],
  ['Adjustment', `${ADJ}; Exposure +20 applied to all`, 'Tap 「All」 again with no change', 'Works again (one-shot button, not a checkbox); toast again; nothing changes', 'P3', 'R-091'],
  ['Adjustment', `${ADJ}; Exposure +20 applied to all`, 'Tap Undo once', 'Exposure +20 is removed from all 12 photos together', 'P1', 'R-098, R-099, R-105'],
  ['Adjustment', `${ADJ}; Exposure +20 applied to all, then photo 3 Contrast +10`, 'Switch to photo 6 and tap Undo', 'Only photo 3\'s Contrast +10 is undone and the room switches to photo 3 (strip follows); then Redo puts it back', 'P1', 'R-099, R-101'],
  ['Adjustment', `${ADJ}; photo 1 Exposure +20, photo 2 Contrast +10`, 'Switch photos several times, then tap Undo twice', 'History survives switching: Undo removes photo 2\'s Contrast, then photo 1\'s Exposure', 'P2', 'R-100'],
  ['Adjustment', `${ADJ}; photo 1 Exposure +20 (Light), then Saturation +10 (Color); Details tab now shown`, 'Tap Undo twice', 'Both values are undone but the tab stays on Details (no automatic tab switch)', 'P2', 'R-104'],
  ['Adjustment', `${ADJ}; Exposure +20 applied to all, photo 3 Contrast +10`, 'Tap ✕', 'Returns to Batch Edit Room; every photo is as before entering the room', 'P1', 'R-102', '', 'ADJ_X'],
  ['Adjustment', `${ADJ}; Exposure +20 applied to all`, 'Tap ✓, then on the main screen tap Undo on photo 4', 'Back in Batch Edit Room all photos keep +20; Undo removes the room\'s change from photo 4 only, in one step', 'P1', 'R-103, R-036, R-207', '', 'ADJ_OK'],
  ['Adjustment', `${FREE}; Batch Edit Room with 5 photos`, 'Crop to 3:2 with 「All」 (✓) and set Exposure +20 with 「All」 (✓)', 'Both work without an IAP page or credit charge', 'P2', 'R-004', '', 'FREE_TOOLS'],

  // ---------- AI Enhance ----------
  ['AI Enhance', ROOM, 'Tap 「AI Enhance」', 'The AI Enhance page opens: one 「Enhance」 button with 「Maximize detail and clarity with advanced AI.」, no Standard / Advanced tab, no scenario or Scene Presets, thumbnail strip above the button', 'P1', 'R-110, R-115, R-208', 'Mockup reads 「detaill」 (Q-10): a typo in the app is a copy bug.', 'ENH_OPEN'],
  ['AI Enhance', ENH, 'Look at the 「Enhance」 button and the credit pill; note the balance', 'The button shows no credit count', 'P1', 'R-113'],
  ['AI Enhance', ENH, 'Tap thumbnails above the button', 'The current photo switches', 'P2', 'R-115'],
  ['AI Enhance', `${ENH}; 12 photos`, 'Tap 「Enhance」', 'The Confirm Dialog opens: 「Enhance 12 photos?」, 「Processing takes a moment and cannot be canceled once started.」, 「Cancel」, 「Start」; no credits shown', 'P1', 'R-112, R-135, R-136, R-209', '', 'CONFIRM_COPY'],
  ['AI Enhance', 'Confirm Dialog open', 'Tap 「Cancel」', 'Returns to the AI Enhance page; nothing is processed', 'P1', 'R-137, R-212', '', 'CONFIRM_CANCEL'],
  ['AI Enhance', 'After 「Cancel」 on the Confirm Dialog', 'Tap 「Enhance」 again', 'The Confirm Dialog appears again (every tap)', 'P2', 'R-136'],
  ['AI Enhance', `${ENH}; 12 photos`, 'Tap 「Enhance」 › 「Start」 and watch the screen', 'The loading screen shows 「Creating Your AI Image」 and 「Enhancing k / 12」 counting up; a mask covers the whole screen with the strip under it', 'P1', 'R-120, R-137, R-210', '', 'ENH_LOAD'],
  ['AI Enhance', 'Batch enhance processing', 'Tap 「Crop & Rotate」, 「Adjustment」, a thumbnail and Save', 'Nothing responds until every photo has finished (no switching, no save)', 'P1', 'R-121, R-122'],
  ['AI Enhance', 'Batch enhance processing', 'Look for a cancel / ✕ control', 'There is none; processing cannot be cancelled', 'P2', 'R-122', '', 'ENH_NOCANCEL'],
  ['AI Enhance', `${ENH}; 12 photos, all succeed; note the credit balance`, 'Let the batch finish', 'Every photo shows its enhanced result (no per-photo ✓); the strip shows them; the button reads 「Enhanced」 disabled; the credit balance is unchanged', 'P1', 'R-114, R-116, R-004, R-119', '', 'ENH_OK'],
  ['AI Enhance', `${ENH}; 12 photos; credit balance noted`, 'Run a batch enhance to the end and compare the balance', 'No credits are deducted', 'P1', 'R-004, R-113', 'Credit charging is a pending PM decision (Q-7).', 'ENH_CREDITS'],
  ['AI Enhance', `${ENH}; 20 photos`, 'Time the batch from 「Start」 to the last result', 'The count advances steadily; record the total time; no stall longer than 10 s with the animation running', 'P2', 'R-120', 'Rule 2 wait thresholds.', 'ENH_WAIT'],
  ['AI Enhance', `${ENH}; a photo 1 also enhanced alone in the single Edit Room AI Enhance Standard · Portrait`, 'Batch-enhance and compare photo 1 with the single-room result', 'The batch result matches Standard · Portrait', 'P2', 'R-111', 'Log pull can confirm the mode sent.', 'ENH_PORTRAIT'],
  ['AI Enhance', `${ENH}; 12 photos; after a batch with 3 failures the summary shows 「9 completed, 3 failed」`, 'Tap 「Retry Failed (3)」 and read the Confirm Dialog if it appears, then the loading count', 'Only the 3 not-yet-enhanced photos count: 「Enhance 3 photos?」 (if the dialog is shown) and 「Enhancing k / 3」; the 9 enhanced photos are not in N', 'P1', 'R-116, R-135, R-120', `${FAIL} Spec does not say whether Retry asks first; record.`],
  ['AI Enhance', `${PREM}; Batch Edit Room with 3 photos all enhanced; photo 2 Enhance undone on the main screen`, 'Open AI Enhance', 'The button stays 「Enhanced」 greyed; photo 2 cannot be enhanced again', 'P1', 'R-117'],
  ['AI Enhance', `${FREE}; Batch Edit Room with 5 photos; AI Enhance page`, 'Tap 「Enhance」', 'The existing Premium IAP page opens straight away (no Confirm Dialog, no trial of one photo, nothing processed)', 'P1', 'R-119, R-217', '', 'ENH_FREE'],
  ['AI Enhance', `${FREE}; Premium IAP page from batch AI Enhance`, 'Close the IAP page with ✕', 'Returns to the AI Enhance page with no photo enhanced', 'P2', 'R-119', 'Existing IAP page; record where ✕ lands.'],
  ['AI Enhance', `${ENH}; enhance finished`, 'Tap ✕', 'Returns to the Batch Edit Room main screen with the enhanced results kept', 'P1', 'R-130, R-114, R-213', '', 'ENH_X'],

  // ---------- AI Enhance failures ----------
  ['AI Enhance failures', `${ENH}; 15 photos; 3 set to fail`, 'Run the batch to the end', 'No dialog per photo; at the end one summary 「12 completed, 3 failed」 「Failed photos are marked on the thumbnails.」; a red ! at the top right of the 3 failed thumbnails only; the button reads 「Retry Failed (3)」', 'P1', 'R-123, R-124, R-211', `${FAIL} Copy may include 「with !」 (Q-1 of flow frame): record.`, 'ENH_PARTIAL'],
  ['AI Enhance failures', 'Partial-failure summary shown', 'Tap a failed thumbnail', 'The current photo switches to that failed photo', 'P2', 'R-123', FAIL],
  ['AI Enhance failures', `Partial-failure summary 「12 completed, 3 failed」; 2 of the 3 will succeed on retry`, 'Tap 「Retry Failed (3)」 (and 「Start」 if the dialog appears)', 'Only the 3 failed photos are processed (count k / 3); the 12 successes are not redone; then 「14 completed, 1 failed」 and 「Retry Failed (1)」; the ! disappears from the 2 retried successes', 'P1', 'R-124, R-125', FAIL, 'ENH_RETRY'],
  ['AI Enhance failures', 'Summary 「14 completed, 1 failed」; the last photo fails again', 'Tap 「Retry Failed (1)」', 'The summary still counts the whole batch: 「14 completed, 1 failed」, ! stays on that photo, 「Retry Failed (1)」 again', 'P2', 'R-125', FAIL, 'ENH_RETRY2'],
  ['AI Enhance failures', 'Summary 「14 completed, 1 failed」; the last photo succeeds on retry', 'Tap 「Retry Failed (1)」', 'All 15 done: the failure message and the Retry button are gone; the button reads 「Enhanced」', 'P1', 'R-125, R-116'],
  ['AI Enhance failures', `${ENH}; 15 photos`, 'Start the batch and turn Wi-Fi and mobile data off after about 8 photos', 'Finished photos are kept; unfinished ones get a red !; the message reads 「8 completed, 7 failed」 (actual counts) and 「Connection lost. Check your connection and retry.」; the button reads 「Retry Failed (7)」', 'P1', 'R-126', 'Wi-Fi toggle allowed once the phone is on USB (AGENTS.md).', 'ENH_FAIL'],
  ['AI Enhance failures', 'Connection-lost summary shown, still offline', 'Tap 「Retry Failed (x)」', 'The toast 「No internet connection」 appears and nothing starts', 'P1', 'R-127', '', 'ENH_OFFLINE'],
  ['AI Enhance failures', 'Connection-lost summary shown; connection restored', 'Tap 「Retry Failed (x)」', 'Only the unfinished photos are processed; then the summary updates for the whole batch', 'P1', 'R-127, R-125', '', 'ENH_NET_RETRY'],
  ['AI Enhance failures', `${ENH}; 15 photos; 2 set to fail; connection drops before the end`, 'Let the batch end', 'Failures and unfinished photos are counted together in 「X completed, Y failed」; the second line shows 「Connection lost. Check your connection and retry.」 (not the thumbnail note)', 'P2', 'R-126', FAIL],
  ['AI Enhance failures', `${ENH}; 12 photos`, 'During processing press Home (send the app to the background) for 30 s, then return', 'Processing paused while away and continues from where it was on return; it finishes normally', 'P1', 'R-129', '', 'ENH_BG'],
  ['AI Enhance failures', `${ENH}; 12 photos; some enhanced`, 'During or after processing (before Save) kill the app from Recents, then relaunch', 'Batch Edit Room is gone (no restore); the finished Enhance results are not kept anywhere (gallery, My AI Artwork)', 'P1', 'R-128', '', 'ENH_KILL'],
  ['AI Enhance failures', `${PREM}; Batch Edit Room with 3 photos enhanced and saved`, 'Open My AI Artwork', 'The batch Enhance results are not in My AI Artwork (Standard results are not saved there)', 'P2', 'R-143, R-128', '', 'ENH_ARTWORK'],

  // ---------- Leaving Batch Edit ----------
  ['Leaving Batch Edit', ROOM, 'Tap Home', 'Goes straight to the Launcher with no dialog', 'P1', 'R-034, R-141', '', 'HOME_NOEDIT'],
  ['Leaving Batch Edit', ROOM, 'Tap Replace photo', 'Goes straight to the Photo Picker on 「Batch」 with the 12 photos still selected (numbers kept), no dialog', 'P1', 'R-035, R-141', '', 'REPL_NOEDIT'],
  ['Leaving Batch Edit', `${EDITED}`, 'Tap Home', 'The Discard Dialog opens: 「Discard changes?」, 「Your edits to these photos will be lost.」, 「Discard」, 「Keep Editing」', 'P1', 'R-034, R-140, R-226', '', 'HOME_EDIT'],
  ['Leaving Batch Edit', `${EDITED}; Discard Dialog opened from Home`, 'Tap 「Discard」', 'Goes to the Launcher; nothing is saved', 'P1', 'R-034'],
  ['Leaving Batch Edit', `${EDITED}`, 'Tap Replace photo, then 「Discard」', 'The Photo Picker opens on 「Batch」 with the 12 photos still selected; 「Done」 opens Batch Edit Room with every photo unedited (photo 1 no longer Square)', 'P1', 'R-035, R-227', '', 'REPL_EDIT'],
  ['Leaving Batch Edit', `${EDITED}; Discard Dialog open`, 'Tap 「Keep Editing」', 'Stays in Batch Edit Room; photo 1 is still Square and Undo still works', 'P1', 'R-142, R-228', '', 'KEEP_EDITING'],
  ['Leaving Batch Edit', `${EDITED}; Replace photo › 「Discard」 › Photo Picker on 「Batch」`, 'Deselect 2 photos, select 3 new ones and tap 「Done」', 'Batch Edit Room opens with the new selection in its selection order', 'P2', 'R-035, R-014'],
  ['Leaving Batch Edit', `${PREM}; Batch Edit Room with 3 photos, only AI Enhance done`, 'Tap Home', 'The Discard Dialog appears (an Enhance counts as an edit)', 'P2', 'R-141', 'Spec says 「做過編輯」; record if Enhance alone does not ask.'],
  ['Leaving Batch Edit', `${EDITED}`, 'Kill the app from Recents and relaunch', 'Batch Edit Room is not restored (no 「Continue editing?」 is stated for batch); record what the app shows', 'P2', 'R-128', 'Spec states only the Enhance case (D1-05); record.', 'KILL_EDIT'],

  // ---------- Save ----------
  ['Save', `${PREM}; Batch Edit Room with 20 photos, 5 edited, 15 unedited; note the gallery count`, 'Tap Save', '「Saving k / 20」 and 「Please do not leave this page or quit the app.」 with a progress bar; k counts up; the Batch Save page opens only when all are saved', 'P1', 'R-150, R-220', '', 'SAVE_LOAD'],
  ['Save', 'Saving in progress with 20 photos', 'Time from Save to the Batch Save page', 'Record the time; no stall longer than 10 s with the progress bar moving', 'P2', 'R-150', 'Rule 2 wait thresholds.', 'SAVE_WAIT'],
  ['Save', 'Saving in progress', 'Press Home (background) for 10 s and return', 'Record: saving continues or resumes and ends on the Batch Save page with every photo saved', 'P2', 'R-150', 'Spec only asks the user not to leave; record.', 'SAVE_BG'],
  ['Save', 'Batch of 20 just saved', 'Open the phone gallery', '20 new files dated now; the 20 originals are still there unchanged', 'P1', 'R-151', '', 'SAVE_NEW'],
  ['Save', 'Batch of 20 (5 edited, 15 unedited) just saved', 'Count the new files', 'All 20 input photos are saved as new files, the 15 unedited ones included', 'P1', 'R-152', '', 'SAVE_ALL'],
  ['Save', `${PREM}; Batch Edit Room with 12 photos, AI Enhance running`, 'Tap Save', 'Save does not start before the enhance has finished', 'P2', 'R-122'],

  // ---------- Batch Save page ----------
  ['Batch Save page', 'Batch of 12 just saved', 'Look at the page', 'A thumbnail grid of the 12 saved photos and 「Saved 12 photos」; 「‹」 top left, Home top right, 「Edit Next Batch」 fixed at the bottom; no Video tab and no 「Turn it to video」', 'P1', 'R-153, R-157, R-221', '', 'SAVE_OK'],
  ['Batch Save page', 'Batch Save page with 12 photos', 'Tap a few thumbnails', 'Nothing opens (no full-screen viewer)', 'P2', 'R-156'],
  ['Batch Save page', 'Batch Save page', 'Scroll to the bottom of the grid', '「Edit Next Batch」 stays fixed at the bottom while the grid scrolls', 'P3', 'R-155'],
  ['Batch Save page', 'Batch Save page after saving an edited batch', 'Tap 「‹」', 'Returns to Batch Edit Room', 'P1', 'R-154, R-222', 'Record whether the edits are still there and whether Save again creates another set of files (Q-14).', 'SAVED_BACK'],
  ['Batch Save page', 'Batch Save page', 'Tap Home', 'Goes to the Launcher', 'P1', 'R-154, R-223', '', 'SAVED_HOME'],
  ['Batch Save page', 'Batch Save page', 'Tap 「Edit Next Batch」', 'The Photo Picker opens on 「Batch」 with no photo selected', 'P1', 'R-155, R-224', '', 'NEXT_BATCH'],
  ['Batch Save page', 'Photo Picker opened by 「Edit Next Batch」', 'Tap 「‹」', 'Goes to the Launcher, not back to the Batch Save page', 'P1', 'R-155'],
  ['Batch Save page', `${FREE}; IAP flyer / ad frequency as on the test account`, 'Save a batch of 5', 'IAP flyers and ads appear as they do after a normal save (no extra, none dropped)', 'P3', 'R-158'],
  ['Batch Save page', `${PREM}; the rating dialog trigger count from RD (n saves)`, 'Save n batches of several photos each', 'The rating dialog counts each batch as one save (it appears after n batches, not after n photos)', 'P3', 'R-158', 'needs: rating trigger count from RD.', 'RATING'],

  // ---------- Android system Back ----------
  ['Android Back', 'Photo Picker from 「Edit」 on 「Batch」, 2 selected', 'Press system Back', 'Same as 「‹」: returns to the Launcher', 'P2', 'R-170', '', 'BACK_PICKER'],
  ['Android Back', ROOM, 'Press system Back', 'Record: leaves to the Launcher (as Home) or the picker (as Replace photo), with no dialog', 'P1', 'R-170', 'Spec silent on Back here (Q-11).', 'BACK_MAIN_NOEDIT'],
  ['Android Back', EDITED, 'Press system Back', 'The Discard Dialog appears (edits are not dropped silently); record where 「Discard」 then leads', 'P1', 'R-170, R-140', 'Spec silent (Q-11).', 'BACK_MAIN_EDIT'],
  ['Android Back', `${CROP}; 3:2 applied to all`, 'Press system Back', 'Same as ✕: back to Batch Edit Room with the room\'s changes dropped', 'P2', 'R-170, R-085', 'Spec silent (Q-11).', 'BACK_CROP'],
  ['Android Back', `${ADJ}; Exposure +20 applied to all`, 'Press system Back', 'Same as ✕: back to Batch Edit Room with the room\'s changes dropped', 'P2', 'R-170, R-102', 'Spec silent (Q-11).', 'BACK_ADJ'],
  ['Android Back', `${ENH}; enhance finished`, 'Press system Back', 'Same as ✕: back to Batch Edit Room with the results kept', 'P2', 'R-170, R-130', '', 'BACK_ENH'],
  ['Android Back', 'Batch enhance processing', 'Press system Back', 'Processing is not interrupted or cancelled; the screen stays under the mask', 'P1', 'R-170, R-121, R-122', '', 'BACK_PROC'],
  ['Android Back', 'Confirm Dialog open', 'Press system Back', 'Same as 「Cancel」: the dialog closes and nothing is processed', 'P2', 'R-170, R-137', '', 'BACK_CONFIRM'],
  ['Android Back', `${EDITED}; Discard Dialog open`, 'Press system Back', 'Same as 「Keep Editing」: stays in Batch Edit Room with the edits', 'P2', 'R-170, R-142', 'Spec silent (Q-11).', 'BACK_DISCARD'],
  ['Android Back', 'Saving in progress', 'Press system Back', 'Saving is not interrupted; the Batch Save page follows', 'P2', 'R-170, R-150', 'Spec silent (Q-11).', 'BACK_SAVING'],
  ['Android Back', 'Batch Save page', 'Press system Back', 'Same as 「‹」: returns to Batch Edit Room', 'P2', 'R-170, R-154', '', 'BACK_SAVED'],
  ['Android Back', 'Photo Picker opened by 「Edit Next Batch」', 'Press system Back', 'Goes to the Launcher, not the Batch Save page', 'P2', 'R-170, R-155', '', 'NEXT_BACK'],
  ['Android Back', `${SET4}; pixel input open with the keyboard`, 'Press system Back twice', 'The first Back closes the keyboard; the second closes the pixel input without applying a value', 'P3', 'R-170, R-066', '', 'BACK_PX'],
];

const ids = new Map<string, string>();
const records = rows.map(([section, pre, action, expected, prio, refs, notes = '', key], i) => {
  const ID = `TC-${String(i + 1).padStart(3, '0')}`;
  if (key) { if (ids.has(key)) throw new Error(`duplicate key ${key}`); ids.set(key, ID); }
  return {
    ID, Section: section, Precondition: pre, Action: action, 'Expected Result': expected, Priority: prio,
    'Spec Ref': refs, Notes: notes, Change: 'new', 'Change Reason': 'New table (REQ-001)',
  };
});
writeTable(join(HERE, 'draft.csv'), DRAFT_COLUMNS, records);
const tpl = readFileSync(join(HERE, 'requirements.tpl.md'), 'utf8');
const missing = new Set<string>();
writeFileSync(join(HERE, 'requirements.md'), tpl.replace(/@([A-Z0-9_]+)/g, (_, k) => ids.get(k) ?? (missing.add(k), `@${k}`)));
if (missing.size) { console.error(`Keys used in requirements.tpl.md with no row: ${[...missing].join(', ')}`); process.exit(1); }
console.log(`${records.length} rows → draft.csv; requirements.md written`);
