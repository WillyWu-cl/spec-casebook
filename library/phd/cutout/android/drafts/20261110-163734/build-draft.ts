// Builds requirements.md and draft.csv for phd/cutout (Cutout room Reset / Undo / Redo, spec set 2026-11-10).
// Same script in the iOS and Android draft folders; the platform comes from the folder path.
// Run: node library/phd/cutout/<platform>/drafts/<id>/build-draft.ts
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = dirname(fileURLToPath(import.meta.url));
const PLATFORM = /[\\/]android[\\/]/.test(DIR) ? 'android' : 'ios';
const ANDROID = PLATFORM === 'android';

// ---------------------------------------------------------------- requirements
type Req = { id: string; src: string; text: string };
const sections: [string, Req[]][] = [];
const sec = (name: string, reqs: [string, string, string][]) => sections.push([name, reqs.map(([id, src, text]) => ({ id, src, text }))]);

sec('Entry and layout', [
  ['R-001', 'PM:uiux-before-11e; PM:pm-11e-crosstab', 'Edit › 「Cutout」 opens the Cutout page (tools 「Auto」 / 「Box」 / 「Circle」 / 「Brush」 / 「Eraser」, bottom bar ✕, reset, undo, redo, 「Cutout」); after a selection, 「Cutout」 opens the Cutout room with the cutout on the canvas.'],
  ['R-002', 'PM:pm-11e-buttons', 'The Cutout room has a Reset, an Undo and a Redo button (➊ add button: reset / undo / redo), drawn in the bottom bar between ✕ and ✓ in the order ✕, Reset, Undo, Redo, ✓.'],
  ['R-003', 'PM:pm-11e-crosstab', 'The Cutout room opens on the 「Background」 tab (「Background tab (default locate)」).'],
  ['R-004', 'PM:pm-11e-buttons', 'The room panel has two tabs, 「Background」 and 「Stroke」; the Background tab has category chips (「Solid」, 「Wall」, 「Romantic」, 「Blue」, 「Summer」…) above an item row (none, transparent, import photo, colour palette, solid colours, templates).'],
  ['R-005', 'PM:pm-11e-buttons; PM:pm-11e-rules', 'The history covers only edits made in the Cutout room, and Background and Stroke share one history (「Background + Stroke 共用一條」).'],
  ['R-006', 'PM:pm-11e-logic', 'The edit cutout page (reached with the canvas edit button) keeps its own undo for its own edits (operation table #10: 「由 edit cutout page 自己的 undo 管理」).'],
]);
sec('Button states', [
  ['R-010', 'PM:pm-11e-buttons', '① On entering the room (current = initial state): Reset, Undo and Redo are disabled (grey).'],
  ['R-011', 'PM:pm-11e-buttons', '② After any step: Reset enabled, Undo enabled, Redo disabled.'],
  ['R-012', 'PM:pm-11e-buttons', '③ After an Undo that has not reached the initial state: Reset, Undo and Redo are all enabled.'],
  ['R-013', 'PM:pm-11e-buttons', '④ After undoing every step (back at the initial state): Reset disabled, Undo disabled, Redo enabled.'],
  ['R-014', 'PM:pm-11e-buttons; PM:pm-11e-logic', '⑤ After Reset: Reset disabled, Undo enabled, Redo disabled — Reset is itself a step and clears the Redo history.'],
  ['R-015', 'PM:pm-11e-rules', 'Reset is enabled when the current state (cutout style included) differs from the initial state, and disabled when it is the same, whatever the history holds.'],
  ['R-016', 'PM:pm-11e-rules', 'Undo is enabled when there is a step to undo and disabled when there is none.'],
  ['R-017', 'PM:pm-11e-rules', 'Redo is enabled when there is an undone step; a new step after an Undo clears the Redo history (Redo disabled).'],
]);
sec('Steps per operation', [
  ['R-020', 'PM:pm-11e-logic', 'Choosing a solid background is a step, recorded on tap; Undo returns the previous background and the panel selection frame moves back with it.'],
  ['R-021', 'PM:pm-11e-logic; Req: REQ-005', 'Choosing a template background (Wall / Romantic…) is a step, recorded when applying completes; Undo returns the previous background and moves the selection back.'],
  ['R-022', 'PM:pm-11e-logic', 'Importing a photo as background is a step, recorded when the photo is applied to the canvas; Undo removes the photo from the canvas and returns the previous background.'],
  ['R-023', 'PM:pm-11e-logic; Req: REQ-005', 'Picking a colour in the colour palette is a step, recorded when the palette is confirmed or closed, not while dragging; Undo returns the background from before the pick. Closing the palette with no colour change is no step (Q-9 answered).'],
  ['R-024', 'PM:pm-11e-logic', 'Choosing a Stroke style or colour is a step, recorded on tap; Undo returns the previous stroke setting.'],
  ['R-025', 'PM:pm-11e-logic', 'Dragging the Stroke thickness slider is a step, recorded on finger-up, not while dragging; Undo returns the value from before the drag.'],
  ['R-026', 'PM:pm-11e-logic', 'Rotating the cutout object is a step, recorded on finger-up, not while rotating; Undo returns the angle from before the rotation.'],
  ['R-027', 'PM:pm-11e-logic; Req: REQ-009', 'Flipping the cutout object is a step, recorded on tap; Undo returns the direction from before the flip. The room must offer a Flip button (Q-8 answered, REQ-009).'],
  ['R-028', 'PM:pm-11e-logic', 'Reset is a step, recorded on tap; Undo after Reset returns the state from before the Reset, cutout style included.'],
  ['R-035', 'PM:pm-11e-rules; KB: KP-042', 'Undo reverts the last step and updates the canvas and the panel selection together; Redo re-applies the most recently undone step.'],
]);
sec('Operations that are not steps', [
  ['R-029', 'PM:pm-11e-logic', 'Opening the edit cutout page with the edit button and coming back is not a step (#10).'],
  ['R-030', 'PM:pm-11e-logic', 'Selecting the cutout object on the canvas is not a step (#11).'],
  ['R-031', 'PM:pm-11e-logic', 'Switching between the 「Background」 and 「Stroke」 tabs is not a step (#12).'],
  ['R-032', 'PM:pm-11e-logic', 'Switching category chips (「Solid」 / 「Wall」…) is not a step (#13).'],
  ['R-033', 'PM:pm-11e-logic', 'Scrolling the item row sideways is not a step (#14).'],
  ['R-034', 'PM:pm-11e-logic', 'Tapping the item that is already selected is not a step (#15).'],
]);
sec('Undo across tabs', [
  ['R-040', 'PM:pm-11e-crosstab; PM:pm-11e-rules', 'When the change an Undo or Redo reverts or re-applies was made on the other tab, the panel switches to that tab so the user sees the change.'],
  ['R-041', 'PM:pm-11e-rules', 'When the change is on the current tab, Undo / Redo keeps the panel on it (「在 C 按 Redo → 重做 ①「選 Wall 背景」→ 留在 Background tab」).'],
  ['R-042', 'PM:pm-11e-rules', 'From C, a second Redo re-applies ② 「調整 Stroke」 and switches to the Stroke tab.'],
  ['R-044', 'PM:pm-11e-rules', 'Tapping Reset switches the panel to the 「Background」 tab.'],
]);
sec('Reset and the cutout style', [
  ['R-050', 'PM:pm-11e-rules; Req: REQ-005', 'Undo and Redo include the edits made on the edit cutout page (cutout style): each step\'s state includes the cutout style of that moment, so undoing back past a step also brings back the cutout shape it had (Q-1 answered).'],
  ['R-051', 'PM:pm-11e-rules; PM:pm-11e-open', 'Reset restores the edits made on the edit cutout page (cutout style) too (5. 待決事項 Q7, decided: 「還原；否則使用者可能卡住，無法繼續 undo / redo」).'],
  ['R-052', 'PM:pm-11e-rules; PM:pm-11e-logic', 'After only editing the cutout on the edit cutout page (no step in the room), Reset is enabled (the state differs from the initial one) while Undo and Redo stay disabled (the round trip is no step).'],
  ['R-055', 'PM:pm-11e-rules', 'Reset returns to the state on entering the room, not to the original photo.'],
]);
sec('Leaving the room', [
  ['R-060', 'PM:pm-11e-buttons; PM:pm-11e-rules; Req: REQ-005', 'Leaving the room with ✕ discards the room\'s edits, returns to the Cutout page and clears the whole history: entering the room again starts with Reset, Undo and Redo disabled (Q-3 answered).'],
  ['R-061', 'PM:pm-11e-rules; Req: REQ-005', 'Leaving the room with ✓ flattens the image, returns to the Cutout page with it and clears the whole history (「壓平圖片處理，紀錄全部清空」; Q-3 answered).'],
]);
sec('Other scenarios', [
  ['R-070', 'PM:pm-11e-rules; Req: REQ-005', 'Tapping Undo while a template is still downloading cancels only that apply (the earlier step stays); when the download finishes the template is not applied. With no earlier step Undo stays disabled during the download (Q-2 answered).'],
  ['R-071', 'PM:pm-11e-rules; Req: REQ-008', 'After an imported photo is undone it is removed from the canvas but stays in 「最近使用」 (Recent).'],
  ['R-072', 'PM:pm-11e-rules; PM:pm-11e-open; Req: REQ-006', 'There is no step limit (Q-6 answered, REQ-006; replaces 「步數達到上限：最舊的步驟會被捨棄」 and the spec\'s open Q3): after many steps Undo walks back every one of them to the entry state.'],
  ['R-081', 'Rule 2: leave and return', 'Sending the app to the background in the Cutout room and returning keeps the canvas, the panel and the Reset / Undo / Redo states.'],
]);
if (ANDROID) sec('Android', [
  ['R-080', 'Rule: Android system Back (REQ-051 of the skill); Req: REQ-005', 'System Back in the Cutout room, with the colour palette open and on the edit cutout page does what the screen\'s own close does (Q-7 answered).'],
]);
sec('Flow arrows', [
  ['R-090', 'PM: flow arrow pm-11e-crosstab-a1 (PDF board pm-11e-crosstab, no Figma link)', 'A (Background tab after ① Wall, ② Stroke, ③ back on Background) → 「按 Undo」 → B: ② reverted, panel on the Stroke tab.'],
  ['R-091', 'PM: flow arrow pm-11e-crosstab-a2 (PDF board pm-11e-crosstab, no Figma link)', 'B → 「再按 Undo」 → C: ① reverted, panel back on the Background tab, Reset and Undo disabled.'],
  ['R-092', 'PM: flow arrow pm-11e-crosstab-a3 (PDF board pm-11e-crosstab, no Figma link)', 'Room ✕ → the Cutout page (pink arrow).'],
  ['R-093', 'PM: flow arrow pm-11e-crosstab-a4 (PDF board pm-11e-crosstab, no Figma link)', 'Room ✓ → the Cutout page (pink arrow).'],
]);

const arrowTag = (r: Req) => r.src.replace(/^PM: flow arrow (\S+)/, 'DS: flow arrow $1 ');

// ---------------------------------------------------------------- rows
type Row = { id: string; section: string; pre: string; action: string; expected: string; prio: string; refs: string; notes: string; android?: boolean };
const rows: Row[] = [];
let n = 0;
let section = '';
const S = (name: string) => { section = name; };
// a row dropped after an answer keeps its ID unused (IDs are never reused); a row added later takes an explicit ID
const skip = () => { n++; };
const add = (pre: string, action: string | string[], expected: string, prio: string, refs: string, notes = '', opts: { android?: boolean; id?: string } = {}) => {
  if (opts.android && !ANDROID) return;
  if (!opts.id) n++;
  rows.push({ id: opts.id ?? `TC-${String(n).padStart(3, '0')}`, section, pre, action: Array.isArray(action) ? action.map((a, i) => `${i + 1}. ${a}`).join('\n') : action, expected, prio, refs, notes, android: opts.android });
};

const ROOM = 'In the Cutout room just entered (a person photo, 「Auto」 selection, 「Cutout」 tapped); no step made yet';
const TWO = 'In the Cutout room, 「Solid」 chip (two steps):\n1. Tap 「White」\n2. Tap 「Black」';

S('Entry and layout');
add('A photo with one or two people open in the editor', ['Tap Edit › 「Cutout」', 'Tap 「Auto」', 'Tap 「Cutout」'],
  'The Cutout room opens with the cut-out people on the canvas, an edit (pencil) button on the canvas, tabs 「Background」 and 「Stroke」 with 「Background」 selected, category chips starting with 「Solid」 and the item row below.', 'P1', 'R-001, R-003, R-004');
add(ROOM, 'Look at the bottom bar',
  'Five buttons from left to right: ✕, Reset, Undo, Redo, ✓. Reset, Undo and Redo are grey (disabled); ✕ and ✓ are enabled.', 'P1', 'R-002, R-010');
add(ROOM, ['Tap Reset', 'Tap Undo', 'Tap Redo'],
  'Nothing happens: canvas and panel unchanged, the three buttons stay grey.', 'P2', 'R-010');

S('Button states');
add(ROOM, 'Tap 「White」 in the 「Solid」 item row',
  'The background turns white. Reset and Undo are enabled; Redo stays disabled.', 'P1', 'R-011, R-020');
add(TWO, 'Tap Undo',
  'The background is white again. Reset, Undo and Redo are all enabled.', 'P1', 'R-012');
add(`${TWO}
3. Tap Undo (background white)`, 'Tap Undo',
  'The canvas is back to the entry state (transparent background). Reset and Undo are disabled; Redo is enabled.', 'P1', 'R-013, R-016');
add(TWO, 'Tap Reset',
  'The canvas is back to the entry state. Reset is disabled, Undo is enabled, Redo is disabled.', 'P1', 'R-014');
add(`${TWO}
3. Tap Reset`, ['Tap Undo', 'Tap Redo'],
  'After Undo: the black background is back and Reset is enabled again. After Redo: the Reset is applied again (entry state), Reset disabled and Undo enabled.', 'P1', 'R-014, R-028, R-035');
add(`${TWO}
3. Tap Undo (Redo enabled)`, 'Tap Reset',
  'Entry state. Redo is disabled (Reset clears the Redo history); Undo is enabled.', 'P1', 'R-014, R-017');
add(`${TWO}
3. Tap Undo (Redo enabled)`, 'Tap 「Blue」 in the item row',
  'The background turns blue. Redo is disabled (the new step cleared the Redo history); Undo is enabled.', 'P1', 'R-017');
add(ROOM + '; note which item is selected on entry (transparent)', ['Tap 「White」', 'Tap the item selected on entry (transparent)'],
  'The canvas looks as on entry. Reset is disabled (state equals the initial one) while Undo is enabled (two steps); tapping Undo once shows the white background.', 'P2', 'R-015, R-016');

S('Steps per operation');
add('In the Cutout room, 「Solid」 chip; 「White」 selected (one step)', ['Tap 「Black」', 'Tap Undo', 'Tap Redo'],
  'After Undo: white background and the orange selection frame back on 「White」. After Redo: black background and the frame on 「Black」.', 'P1', 'R-020, R-035');
add(ROOM + '; a 「Wall」 template already downloaded (no download arrow)', ['Tap the 「Wall」 chip', 'Tap the downloaded template', 'Tap Undo', 'Tap Redo'],
  'The template is applied and Undo enables once it shows. After Undo: the entry background and the selection frame back on the entry item. After Redo: the template again, frame on it.', 'P1', 'R-021, R-035');
add(ROOM + '; a 「Wall」 template not downloaded yet (download arrow), slow network if available', ['Tap the 「Wall」 chip', 'Tap the template with the download arrow', 'Watch Undo while it downloads'],
  'Undo stays disabled while the template downloads and enables only when the template is applied to the canvas (recorded when applying completes).', 'P1', 'R-021, R-070', 'Q-2 answered (REQ-005): with no earlier step Undo stays disabled during the download.');
add(ROOM, ['Tap the import-photo item', 'Choose a photo', 'Tap Undo', 'Tap Redo'],
  'Undo enables when the photo shows on the canvas. After Undo: the photo is gone from the canvas and the entry background is back. After Redo: the photo again.', 'P1', 'R-022, R-035');
add('In the Cutout room:\n1. Import a photo as background\n2. Tap Undo', 'Open the import-photo item again',
  'The undone photo is still listed under 「最近使用」 (Recent).', 'P2', 'R-071', 'REQ-008: the app has no 「最近使用」 for now, so this row is expected to fail; after running it, file an eBug for the missing Recent first.');
add(ROOM, ['Tap the colour-palette item', 'Drag across several colours without confirming', 'Look at Undo', 'Confirm the colour', 'Tap Undo'],
  'Undo stays disabled while dragging; it enables only after confirming. Undo returns the background from before the palette opened (not an intermediate dragged colour).', 'P1', 'R-023');
add('In the Cutout room: 「White」 selected (one step)', ['Tap the colour-palette item', 'Drag to a red colour', 'Close the palette without confirming', 'Tap Undo'],
  'Closing the palette records the pick as one step: the background is the picked colour after closing; one Undo returns white.', 'P2', 'R-023');
add('In the Cutout room: 「White」 selected (one step)', ['Tap the colour-palette item', 'Close the palette without changing the colour', 'Tap Undo'],
  'Closing the palette unchanged adds no step: one Undo returns the entry background and Undo is then disabled.', 'P2', 'R-023', 'Q-9 answered (REQ-005).', { id: 'TC-051' });
add(ROOM, ['Tap the 「Stroke」 tab', 'Tap an orange colour swatch', 'Tap Undo', 'Tap Redo'],
  'Undo enables on the tap. After Undo: the stroke setting from before (entry colour). After Redo: orange stroke.', 'P1', 'R-024, R-035');
add(ROOM, ['Tap the 「Stroke」 tab', 'Tap a different stroke style thumbnail', 'Tap Undo'],
  'Undo enables on the tap; Undo returns the previous stroke style.', 'P1', 'R-024');
add(ROOM + '; 「Stroke」 tab, thickness slider at its entry value (33 in the Design)', ['Drag the thickness slider to about 60 and hold', 'Look at Undo', 'Release', 'Tap Undo'],
  'Undo stays disabled while the finger is down and enables on release. Undo returns the slider and the stroke to the entry value.', 'P1', 'R-025');
add('In the Cutout room: 「Stroke」 tab, thickness slider at 33', ['Drag the slider to about 60 and release', 'Drag it to about 10 and release', 'Tap Undo'],
  'One Undo returns the slider to about 60 (each release is one step, no step for the positions in between).', 'P2', 'R-025');
add(ROOM, ['Rotate the cutout with two fingers and hold', 'Look at Undo', 'Release', 'Tap Undo'],
  'Undo stays disabled while rotating and enables on release. Undo returns the cutout to its angle before the rotation.', 'P1', 'R-026');
add(ROOM, ['Select the cutout on the canvas', 'Tap the Flip button', 'Tap Undo', 'Tap Redo'],
  'A Flip button is there and flips the cutout; Undo enables on the flip. After Undo: the cutout faces the direction from before the flip. After Redo: flipped again.', 'P1', 'R-027, R-035', 'REQ-009: the room must have a Flip button; if the build has none, record Fail and file an eBug.');
add(ROOM, ['Tap 「White」', 'Tap the 「Stroke」 tab', 'Tap an orange swatch', 'Drag the thickness slider and release', 'Rotate the cutout and release', 'Tap Undo four times', 'Tap Redo four times'],
  'The four Undo taps revert rotation, thickness, stroke colour and white background in that order, ending at the entry state (Reset and Undo disabled, Redo enabled). The four Redo taps re-apply them in the original order.', 'P1', 'R-005, R-035');

S('Operations that are not steps');
add(ROOM, ['Tap the cutout on the canvas', 'Tap 「Stroke」', 'Tap 「Background」', 'Tap the 「Wall」 chip', 'Tap the 「Romantic」 chip', 'Tap the 「Solid」 chip', 'Scroll the item row left and right', 'Tap the item already selected'],
  'Reset, Undo and Redo stay disabled after every action.', 'P2', 'R-030, R-031, R-032, R-033, R-034');
add(`${TWO}
3. Tap Undo (Redo enabled)`, ['Tap the cutout on the canvas', 'Tap 「Stroke」', 'Tap 「Background」', 'Tap the 「Wall」 chip', 'Tap the 「Solid」 chip', 'Scroll the item row', 'Tap the selected 「White」 again', 'Tap Redo'],
  'Redo stays enabled through steps 1–7 (none of them is a step) and Redo brings the black background back.', 'P2', 'R-017, R-030, R-031, R-032, R-033, R-034');
add('In the Cutout room: 「White」 selected (one step)', ['Tap 「White」 again', 'Tap Undo'],
  'One Undo returns the entry background; Undo is then disabled (the second tap added no step).', 'P2', 'R-034');

S('Undo across tabs');
add(ROOM + '; a 「Wall」 template downloaded', ['Apply the 「Wall」 template', 'Tap 「Stroke」 and change the stroke colour', 'Tap 「Background」', 'Tap Undo'],
  'The stroke change is reverted and the panel switches to the 「Stroke」 tab by itself.', 'P1', 'R-040, R-090');
add('After the previous row: on the 「Stroke」 tab, the Wall template still applied', 'Tap Undo',
  'The Wall template is reverted; the panel switches back to 「Background」; the canvas is at the entry state with Reset and Undo disabled and Redo enabled.', 'P1', 'R-040, R-013, R-091');
add('After the previous row: entry state on 「Background」, Redo enabled', ['Tap Redo', 'Tap Redo'],
  'First Redo: the Wall template is back and the panel stays on 「Background」. Second Redo: the stroke change is back and the panel switches to 「Stroke」.', 'P1', 'R-041, R-042, R-035');
add('In the Cutout room: 「Stroke」 tab, two stroke colour changes made on it', 'Tap Undo',
  'The last stroke colour is reverted and the panel stays on 「Stroke」.', 'P2', 'R-041');

S('Reset and the cutout style');
add('In the Cutout room: background, stroke colour and thickness changed; the panel on 「Stroke」', 'Tap Reset',
  'The panel switches to 「Background」 and the canvas shows the entry state: cutout on its entry background with the entry stroke.', 'P1', 'R-044, R-055');
add('In the Cutout room: background changed', 'Tap Reset',
  'The canvas shows the state on entering the room (the cut-out people), not the original photo with its own background.', 'P1', 'R-055');
add(ROOM, ['Tap the edit (pencil) button on the canvas', 'On the edit cutout page, brush an extra area into the selection', 'Return to the Cutout room'],
  'The cutout shows the edited shape. Undo and Redo stay disabled (the round trip is no step); Reset is enabled (the state differs from the entry state).', 'P1', 'R-029, R-052');
add('After the previous row: cutout edited on the edit cutout page, no room step', 'Tap Reset',
  'The cutout returns to its shape on entering the room. Reset is disabled, Undo is enabled, the panel is on 「Background」.', 'P1', 'R-051, R-014');
add('After the previous row: Reset done', 'Tap Undo',
  'The edited cutout shape comes back (the state before Reset, cutout style included).', 'P1', 'R-028, R-050');
add('In the Cutout room: 「White」 selected (one step)', ['Tap the edit button', 'Brush an extra area into the selection', 'Return to the Cutout room', 'Tap Undo', 'Tap Redo'],
  'The round trip adds no step. Undo reverts 「White」 and the cutout goes back to its shape at that step (entry shape); Redo brings back the white background and the edited cutout.', 'P2', 'R-029, R-050', 'Q-1 answered (REQ-005).');
add('In the Cutout room: tapped the edit button (on the edit cutout page)', ['Brush an extra area', 'Tap the edit cutout page\'s own Undo'],
  'The edit cutout page\'s Undo reverts the brush stroke on that page.', 'P3', 'R-006');

S('Leaving the room');
add('In the Cutout room: two steps made', 'Tap ✕',
  'The room closes without keeping its edits and the Cutout page opens (Auto / Box / Circle / Brush / Eraser) showing the image as it was before the room.', 'P1', 'R-060, R-092');
add('After the previous row: on the Cutout page', 'Tap 「Cutout」 to enter the room again',
  'Reset, Undo and Redo are all disabled; no earlier step can be undone.', 'P1', 'R-060, R-010');
add('In the Cutout room: background changed to white and stroke changed', 'Tap ✓',
  'The image is flattened (background, cutout and stroke as one image) and the Cutout page opens with it.', 'P1', 'R-061, R-093');
add('After the previous row: on the Cutout page with the flattened image', ['Make a selection', 'Tap 「Cutout」 to enter the room again'],
  'Reset, Undo and Redo are all disabled; the white background and stroke are part of the image and cannot be undone in the room.', 'P1', 'R-061, R-010');

S('Other scenarios');
add('In the Cutout room: 「White」 selected (one step); a 「Wall」 template not downloaded yet; slow network if available', ['Tap the template with the download arrow', 'While it downloads, tap Undo'],
  'Only the template apply is cancelled: the canvas does not show the template and the white background stays.', 'P1', 'R-070', 'Q-2 answered (REQ-005).');
add('After the previous row: the cancelled template still downloading', 'Wait until the download finishes',
  'The template is not applied when the download finishes; the canvas is unchanged.', 'P2', 'R-070');
add(ROOM, ['Make 60 steps (alternate 「White」 and 「Black」)', 'Tap Undo until it is disabled'],
  'Undo walks back all 60 steps to the entry state (transparent background) before it disables; no step is dropped and no message appears.', 'P2', 'R-072', 'REQ-006: no step limit.');
add('In the Cutout room:\n1. Make two steps\n2. Tap Undo', ['Send the app to the background for 10 s', 'Return to the app'],
  'The room shows the same canvas and panel; Reset, Undo and Redo are enabled as before; Redo still re-applies the undone step.', 'P2', 'R-081');

S('Android');
add('In the Cutout room: two steps made', 'Press system Back',
  'Back does what ✕ does: the room closes to the Cutout page and the history is cleared on re-entry.', 'P2', 'R-080, R-060', 'Q-7 answered (REQ-005).', { android: true });
add(ROOM, ['Tap the colour-palette item', 'Drag to a colour', 'Press system Back'],
  'Back closes the palette only (the room stays) and the pick is recorded as one step (Undo enabled; Undo returns the entry background).', 'P2', 'R-080, R-023', 'Q-7 answered (REQ-005).', { android: true });
add('In the Cutout room: tapped the edit button (on the edit cutout page)', 'Press system Back',
  'Back returns to the Cutout room (like the page\'s own close); the room\'s Reset / Undo / Redo states are unchanged.', 'P3', 'R-080, R-029', 'Q-7 answered (REQ-005).', { android: true });

// ---------------------------------------------------------------- grids and the rest of requirements.md
const ids = (...xs: string[]) => xs.join(', ');
const kb = readFileSync(join(DIR, 'knowledge.md'), 'utf8');
const ruleSection = kb.split(/^## /m).find(s => s.startsWith('rule')) ?? '';
const kbRules = [...ruleSection.matchAll(/^### (K[PCF]-\d+) (.+?) \(/gm)].map(m => [m[1], m[2]]);
const kbWhy: Record<string, string> = {
  'KP-012': 'n/a (the Cutout room spec states no paid gating or price)',
  'KP-013': 'n/a (the Cutout room spec states no paid gating or price)',
  'KP-041': 'n/a (a Crop transform-screen rule; the Cutout spec states its own Reset: it switches to the Background tab, R-044)',
  'KP-042': 'R-035',
  'KP-016': 'n/a (no free trial in the Cutout room spec)',
};
const domainRules = kbRules.map(([id, title]) => `| ${id} ${title} | ${kbWhy[id] ?? `n/a (other feature or flow: not part of the Cutout room)`} |`);

const tc = (refs: string) => rows.filter(r => r.refs.split(', ').some(x => refs.split(',').map(s => s.trim()).includes(x))).map(r => r.id).join(', ');

let md = `# Cutout Reset / Undo / Redo — requirements (${PLATFORM})
Spec: Cutout Reset Undo Redo Spec 11E.pdf, Cutout UI UX flow (before 11E).pdf (spec set 2026-11-10; from 「Cutout with Stroke.zip」)
Read PDF-only from the text layer and renders (figma-pending.json); the linked Design 2025/09 page was read with figma-design (links.json).
Source order: the 11/E page is the newest and governs; the 「before 11/E」 page is used only for the Cutout page and the entry.

`;
for (const [name, reqs] of sections) {
  md += `## ${name}\n`;
  for (const r of reqs) md += /flow arrow/.test(r.src) ? `- ${r.id} [${arrowTag(r)}] ${r.text}\n` : `- ${r.id} [${r.src}] ${r.text}\n`;
  md += '\n';
}
md += `## Open questions

## Answered questions (2026-11-10, Cases page)
- Q-1 — 每一步記錄的狀態都包含當時的去背樣式 → confirms the assumption. REQ-005; R-050.
- Q-2 — Undo 只取消這次還沒完成的套用；沒有更早的步驟時 Undo 維持不能按 → confirms the assumption. REQ-005; R-021, R-070.
- Q-3 — ✕ 捨棄編輯並回到 Cutout 頁；✓ 壓平圖片後回到 Cutout 頁 → confirms the assumption. REQ-005; R-060, R-061.
- Q-4 — 目前沒有 recent，執行完這條請先開個 bug → the app has no Recent for now; TC-016 stays (expected to fail) and an eBug is filed after it runs. REQ-008; R-071.
- Q-6 — 沒有上限 → no step limit; replaces the oldest-step-dropped clause. REQ-006; R-072.
- Q-7 — 返回鍵的效果和該畫面自己的關閉相同 → confirms the assumption. REQ-005; R-080.
- Q-8 — 只能旋轉不能翻轉, corrected by the user: there must be a Flip button; when a run finds none, file an eBug → R-027 and TC-024 stay. REQ-009 (supersedes REQ-007); R-027.
- Q-5 — Figma 上面的已經都儲存下來了，有更新會再更新 → the two PDFs hold everything on Figma (no missing sections, no newer frames); spec updates will be sent as a new set. REQ-010.
- Q-9 — 沒改就不算 → closing the palette unchanged is no step; new TC-051. REQ-005; R-023.

## Added 2026-11-10 — coverage passes and standing inputs
### Job states
| Job | Start / loading | Success | Failure | Retry | Leave and return | Longest wait | Done notice |
|---|---|---|---|---|---|---|---|
| Template background download | ${tc('R-021')} | ${tc('R-021')} | n/a (spec silent) | n/a (spec silent) | ${tc('R-081')} | n/a (spec silent) | n/a (no notice) |
| Photo import | ${tc('R-022')} | ${tc('R-022')} | n/a (spec silent) | n/a (spec silent) | ${tc('R-081')} | n/a (spec silent) | n/a (no notice) |

### Error classes
| Job | Error classes |
|---|---|
| All jobs | n/a (the spec names no error classes or failure copy) |

### Exit × stage
| Stage | ✕ | ✓ | Edit button (round trip) | App to background${ANDROID ? ' | System Back' : ''} |
|---|---|---|---|---|${ANDROID ? '---|' : ''}
| Room, no step | n/a (nothing to clear; R-060 checked with steps) | n/a (R-061 checked with steps) | ${tc('R-052')} | n/a (spec silent)${ANDROID ? ' | n/a (same as with steps)' : ''} |
| Room, steps made | ${tc('R-060')} | ${tc('R-061')} | ${tc('R-050')} | ${tc('R-081')}${ANDROID ? ` | ${rows.find(r => r.android)?.id}` : ''} |
| Template downloading | n/a (spec silent) | n/a (spec silent) | n/a (spec silent) | n/a (spec silent)${ANDROID ? ' | n/a (spec silent)' : ''} |
| Colour palette open | n/a (no ✕ / ✓ while open) | n/a (no ✕ / ✓ while open) | n/a (not reachable) | n/a (spec silent)${ANDROID ? ` | ${rows.filter(r => r.android)[1]?.id}` : ''} |
`;
if (ANDROID) md += `
### System back
- Cutout room → as ✕: ${rows.filter(r => r.android)[0].id}
- Colour palette → closes it, pick recorded: ${rows.filter(r => r.android)[1].id}
- Edit cutout page → back to the room: ${rows.filter(r => r.android)[2].id}
- Cutout page → n/a (existing page, not changed by 11/E)
- Photo picker (import photo) → n/a (existing picker, not changed by 11/E)
`;
md += `
### Hidden clauses
| Requirement | Hidden clause | Observed through | Rows |
|---|---|---|---|
| R-005 | Background and Stroke share one history | Undo order across both tabs | ${tc('R-005')} |
| R-061 | the image is flattened on ✓ | the Cutout page shows one image; re-entering cannot undo it | ${tc('R-061')} |
| R-070 | a cancelled template is not applied after its download finishes | canvas after the download ends | ${tc('R-070')} |
| R-071 | an undone photo is kept in 「最近使用」 | the Recent list after Undo | ${tc('R-071')} |
| R-072 | no step is ever dropped (no limit) | Undo count after 60 steps | ${tc('R-072')} |

### Variants
| Requirement | Variant | Rows |
|---|---|---|
| R-035 × operation | solid background | ${tc('R-020')} |
| R-035 × operation | template background | ${tc('R-021')} |
| R-035 × operation | imported photo | ${tc('R-022')} |
| R-035 × operation | colour palette | ${tc('R-023')} |
| R-035 × operation | stroke colour / style | ${tc('R-024')} |
| R-035 × operation | stroke thickness | ${tc('R-025')} |
| R-035 × operation | rotate | ${tc('R-026')} |
| R-035 × operation | flip | ${tc('R-027')} |
| R-035 × operation | Reset | ${tc('R-028')} |

### Domain rules
| Entry | Requirements |
|---|---|
${domainRules.join('\n')}

### Request ledger coverage
| Ledger entry | Requirements |
|---|---|
| REQ-001 | R-001 – R-093 [Req: REQ-001] |
| REQ-002 | scope only: this table is Android; no iOS table for now [Req: REQ-002] |
| REQ-005 | R-021, R-023, R-050, R-060, R-061, R-070, R-080 |
| REQ-006 | R-072 |
| REQ-009 | R-027 |
`;
writeFileSync(join(DIR, 'requirements.md'), md);

const q = (s: string) => /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
const csv = ['ID,Section,Precondition,Action,Expected Result,Priority,Spec Ref,Notes,Change,Change Reason',
  ...rows.map(r => [r.id, r.section, r.pre, r.action, r.expected, r.prio, r.refs, r.notes, 'new', 'New table from the 11/E spec'].map(q).join(','))].join('\n') + '\n';
writeFileSync(join(DIR, 'draft.csv'), csv);
console.log(`${PLATFORM}: ${rows.length} rows, ${sections.reduce((a, [, r]) => a + r.length, 0)} requirements`);
