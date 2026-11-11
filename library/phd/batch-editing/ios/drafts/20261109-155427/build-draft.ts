// Builds requirements.md and draft.csv for phd/batch-editing (Figma-only spec set 2026-11-09), one platform per run.
// Usage: node library/phd/batch-editing/ios/drafts/20261109-155427/build-draft.ts <ios|android> [<android draft id>]
// The same file builds the Android draft (SKILL.md step 0: every Precondition / Action read against Android controls):
// the platform argument picks the rows and grids; Android rows have no Pink menu, Pro instead of Pro / Pro+, system Back.
// Row IDs are assigned in file order per platform, so grids name rows by key and are resolved at the end.
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const P = (process.argv[2] ?? 'ios') as 'ios' | 'android';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..', '..', '..');
const DRAFT = P === 'ios' ? '20261109-155427' : (process.argv[3] ?? '');
if (!DRAFT) throw new Error('give the Android draft id');
const OUT = join(ROOT, 'library', 'phd', 'batch-editing', P, 'drafts', DRAFT);
const IOS = P === 'ios', AND = P === 'android';
const REASON = 'New table (PM + Design Figma 2026-11-09)';
const PMONLY = 'PM-only: no Design frame yet (Design 261104)';
const phone = IOS ? 'iPhone' : 'Android phone';

// ---------------------------------------------------------------- requirements
type Req = { id: string; sec: string; src: string; text: string; plat?: 'ios' | 'android' };
const R: Req[] = [];
let rn = 0;
const req = (sec: string, src: string, text: string, plat?: 'ios' | 'android') => {
  const id = `R-${String(++rn).padStart(3, '0')}`;
  if (!plat || plat === P) R.push({ id, sec, src, text, plat });
  return id;
};
const PMF = 'https://www.figma.com/design/iWlQTjlmfykHfmlNvg9J4p/Batch-Editing?node-id=';
const arrowReq = (sec: string, node: string, edge: string, exp: string) => req(sec, `DS: flow arrow ${node} ${PMF}${node.replace(':', '-')}`, `${edge}: ${exp}`);

const S1 = 'Entry and Photo Picker', S2 = 'Batch Edit Room', S3 = 'Crop & Rotate', S4 = 'Adjustment', S5 = 'AI Enhance',
  S6 = 'AI Enhance errors', S7 = 'Save', S8 = 'Leaving Batch Edit', S9 = 'Light and dark mode', S10 = 'Tracking', S11 = 'Android system Back';

// Entry and Photo Picker
const rWhere = req(S1, 'PM:pm-flow-1 D0-04, D0-04b; PM:pm-ui-1 DR-01b', 'Batch Edit is reached only from the Photo Picker of Launcher 「Edit」 and of the AI Enhance shortcut (and the Batch Editing shortcut); the single-photo Edit Room has no batch button');
const rScope = req(S1, 'PM:pm-flow-1 D0-07, D0-06, DR-03; PM:pm-header D0-03', 'Batch Edit offers only three tools that apply one setting to every photo: Crop & Rotate, Adjustment and AI Enhance (no Filter or Preset)');
const rFree = req(S1, 'PM:pm-flow-1 D0-08, D5-01b; PM:pm-tbd Q2; PM:pm-credit DR-11', 'Batch Edit is free on day 1: a Free user can open it, use Crop & Rotate and Adjustment and save, with the 20-photo limit; it is not locked to Premium');
const rTabs = req(S1, 'DS:design-light-entry 「photo_picker」 13:2380; PM:pm-ui-1 DR-01b', 'The Photo Picker has a 「Single」 / 「Batch」 switch at the top, and it opens on 「Single」 every time');
const rSingle = req(S1, 'PM:pm-ui-1 DR-13', 'With 「Single」, picking one photo opens the existing single-photo Edit Room as today');
const rSameTabs = req(S1, 'PM:pm-ui-1 DR-01b, D0-04b; PM:pm-flow-4', 'The Launcher 「Edit」 picker and the AI Enhance shortcut picker have the same Single / Batch switch');
const rMulti = req(S1, 'PM:pm-ui-1 DR-01', 'Only 「Batch」 allows several photos, at most 20 on both platforms');
const rOrder = req(S1, 'DS:design-light-entry 13:2380; PM:pm-ui-1 D2-01', 'Picked photos show their pick order 1, 2, 3… on the thumbnails, and the Batch Edit Room lists them in that order');
const rCount = req(S1, 'DS:design-light-entry 13:2380; PM:pm-ui-1 DR-01', 'The picker bottom shows the count and 「Next」: Design 「Select 1 to 20 photos to continue.(10/20)」 (PM mockups: 「Select 1 to 20 photos.」, 「3 selected (max 20)」, 「Done」; Q-1)');
const rStripPick = req(S1, 'DS:design-light-entry 13:2380', 'The Design picker shows the picked photos in a row above 「Next」, each with ×; tapping × removes that photo from the selection (Design-only, Q-2)');
const rOverMax = req(S1, 'PM:pm-ui-1 DR-01', 'Picking a 21st photo is refused with the toast 「Please pick at most 20 photos.」');
const rBatchOne = req(S1, 'PM:pm-ui-1 DR-01b, DR-13; PM:pm-flow-5', 'With 「Batch」 and only one photo picked, Next / Done opens the single-photo Edit Room');
const rReplaceSingle = req(S1, 'PM:pm-flow-5 D1-08c; PM:pm-ui-1 D1-08c', 'In the single-photo Edit Room, Replace photo opens the Photo Picker, where switching to 「Batch」 leads to Batch Edit');
const rShortcut = req(S1, 'PM:pm-flow-1 row 8, 410:4074, 410:4076', 'The Launcher has a 「Batch Editing」 shortcut (icon still to be designed, Q-3) that opens Batch Edit; deeplink phd://navigate/page?name=batch_edit opens it too (where it lands: Q-3)');
const aEdit = arrowReq(S1, '16:10599', 'Launcher 「Edit」 → Photo Picker (Batch tab)', 'tapping 「Edit」 opens the Photo Picker, where the 「Batch」 tab allows several photos');
const aNext = arrowReq(S1, '16:10603', 'Photo Picker (Batch) Next → Batch Edit Room', 'Next with 2 or more photos opens the Batch Edit Room');
const aPickBack = arrowReq(S1, '16:10611', 'Photo Picker ‹ → Launcher', '‹ on the picker returns to the Launcher');
const aSc = arrowReq(S1, '16:12859', 'Launcher AI Enhance shortcut → Photo Picker', 'the AI Enhance shortcut opens the Photo Picker with the same Single / Batch switch');
const aScDone = arrowReq(S1, '16:12863', 'AI Enhance shortcut picker (Batch) → AI Enhance room', 'several photos land directly in the batch AI Enhance room');
const aScBack = arrowReq(S1, '16:12867', 'AI Enhance shortcut picker ‹ → Launcher', '‹ returns to the Launcher');
const aOne = arrowReq(S1, '16:13109', 'Photo Picker (Batch, one photo) → single Edit Room', 'one photo opens the existing single Edit Room');
const aRepl1 = arrowReq(S1, '137:4368', 'Single Edit Room Replace photo → Photo Picker', 'Replace photo opens the picker, whose Batch tab leads to Batch Edit');
const rScPick = req(S1, 'PM:pm-ui-5 DR-02', 'From the AI Enhance shortcut, several photos land directly in the batch AI Enhance room (not the Batch Edit Room main screen)');

// Batch Edit Room
const rRoomLook = req(S2, 'DS:design-light-entry 「canvas_img_focus」 13:2826; PM:pm-ui-2 D1-11, D1-01', 'The Batch Edit Room looks like the Edit Room; its bottom has only three buttons, in this order: 「Crop & Rotate」, 「Adjustment」, 「AI Enhance」; the picker opens it on this main screen');
const rTopBar = req(S2, 'DS:design-light-entry 13:2826; PM:pm-ui-2 D1-11', 'The top bar has Home and Replace photo on the left and Save (download) and Settings on the right (Settings rightmost); the Design also draws a feedback icon (Q-4)');
const rSettings = req(S2, 'PM:pm-ui-2 D1-11', 'Settings (rightmost) opens the existing save settings, as in the Edit Room (Q-4)');
const rStrip = req(S2, 'DS:design-light-entry 13:2826; PM:pm-ui-2 D1-12, D1-09', 'A thumbnail strip on the main screen lists the batch; tapping a thumbnail shows that photo; photos cannot be removed or added (no × on the thumbnails)');
const rOuterUndo = req(S2, 'PM:pm-ui-2 DR-05, DR-05d', 'The main screen\'s Undo / Redo keep one history per photo and act only on the photo shown; what one room visit changed on a photo is one step in that photo\'s history');
const rEnhUndo = req(S2, 'PM:pm-ui-2 DR-10b, DR-12e', 'Undo on a photo can take it back to before AI Enhance (that photo only) and Redo brings the result back; once that photo is edited after the Undo, Redo is cleared and the result cannot be restored (Enhance can be run again)');
const rBA = req(S2, 'DS:design-light-entry 13:2826 「editing_area/btn_BA_n」', 'The compare button at the bottom right of the photo shows the current photo before its edits while held (as in the Edit Room)');
const rFeedback = req(S2, 'DS:design-light-entry 13:2826 「round/ic_feedback」', 'The feedback icon in the top bar opens the app\'s existing feedback page (Design-only, Q-4)');

// Crop & Rotate
const rCropLook = req(S3, 'DS:design-light-entry 「3_」 22:2798; PM:pm-ui-3 D1-11, DR-03', 'The batch Crop & Rotate room is the existing Crop & Rotate room without a panel title bar: top ‹, the photo\'s size 「W x H ✎」 and 「All」; the angle slider; 「Rotate」, 「Flip」, 「Flip Vertically」, 「Original」, 「Custom」 and the ratios (「Squre」, 「2:3」, 「3:2」, 「3:4」…); ✕, ↶, ↷, ✓ at the bottom; the thumbnail strip above the slider');
const rSize = req(S3, 'PM:pm-ui-3 D1-11', 'The top shows the current photo\'s output size 「W x H」; switching photos shows that photo\'s size');
const rPx = req(S3, 'PM:pm-ui-3 D1-11; PM:pm-crop-apply-rule C12', 'Tapping ✎ allows typing the size in px, from 238 px up to that photo\'s original width / height; a value out of range shows a toast and is not applied (toast copy: Q-5)');
const rPxSync = req(S3, 'PM:pm-ui-3 D1-11, DR-04; PM:pm-crop-apply-rule', 'After a typed px size, Apply to all copies only the ratio to the other photos, never the px values');
const rLinked = req(S3, 'PM:pm-ui-3 DR-04', 'With width and height linked, typing a size keeps the ratio, so 「All」 stays disabled; with them unlinked, the ratio changes to Free (custom) and 「All」 becomes enabled');
const rAll = req(S3, 'DS:design-light-entry 22:2798 「All」, 「status」 105:4500; PM:pm-ui-3 DR-04; PM:pm-ui-4 DR-04', 'Each batch room (Crop & Rotate, Adjustment) has 「All」 (Apply to all) at the top right: an icon and 「All」 on a translucent dark capsule; it is a one-off button, not a checkbox: tapping it applies the current photo\'s setting of that room to every other photo');
const rAllOff = req(S3, 'DS:「status」 105:4500 (normal / disabled); PM:pm-ui-3 DR-04; PM:pm-ui-4 DR-04', '「All」 is disabled when the room opens and the current photo has no change');
const rAllOn = req(S3, 'PM:pm-ui-3 DR-04; PM:pm-ui-4 DR-04', '「All」 becomes enabled when the current photo has a change not yet applied, and is disabled again once applied, until the current photo changes again');
const rAllSwitch = req(S3, 'PM:pm-ui-3 DR-04; PM:pm-ui-4 DR-04', 'Switching photos sets 「All」 by the newly shown photo: enabled only if that photo has a change not yet applied');
const rAllUndo = req(S3, 'PM:pm-ui-3 DR-04; PM:pm-ui-4 DR-04', 'Undo of the Apply-to-all step makes 「All」 enabled again; Redo of it makes 「All」 disabled');
const rAllToast = req(S3, 'DS:design-light-adjust 「adjust」 41:923 「Applied to 11 photos」; PM:pm-ui-3 DR-04, DR-04c; PM:pm-ui-4 DR-04', 'After 「All」 the room stays open and the toast 「Applied to x photos」 shows, x = the number of photos other than the current one');
const rAllThumbs = req(S3, 'PM:pm-ui-3 DR-04; PM:pm-ui-4 DR-04', 'After 「All」 the thumbnail strip shows every photo with the applied result (updated at once)');
const rAllTweak = req(S3, 'PM:pm-ui-3 DR-04; PM:pm-ui-4 DR-04', 'After 「All」 any photo can be shown and adjusted on its own; that adjustment changes only that photo');
const rAllAgain = req(S3, 'PM:pm-ui-3 DR-04; PM:pm-ui-4 DR-04, DR-04c', 'Tapping 「All」 again after a new change applies the current photo\'s latest setting of the room, as a whole, to every other photo, replacing their own tweaks in that room');
const rCropDefault = req(S3, 'PM:pm-crop-apply-rule C1, C5', 'Choosing a ratio gives the photo the largest box of that ratio, centred (as the single Crop & Rotate room); with Apply to all and the box not moved, every photo gets its own largest box, centred');
const rCropCur = req(S3, 'PM:pm-crop-apply-rule 一', 'Crop Apply to all keeps the current photo\'s crop box as the user set it (size and position)');
const rCropMax = req(S3, 'PM:pm-crop-apply-rule 一, 二; PM:pm-ui-3 DR-07', 'Every other photo gets the largest box of that ratio, placed at the current photo\'s relative position; only directions with room to move take the position, others are centred (the PM UI board said 「centred」: Q-6)');
const rCropPx = req(S3, 'PM:pm-crop-apply-rule 一', 'Each photo\'s output size is worked out from its own original, so the px sizes differ between photos');
const rCropOver = req(S3, 'PM:pm-crop-apply-rule 一', 'Crop Apply to all replaces the other photos\' earlier crops, recomputed from each original');
const rCropFree = req(S3, 'PM:pm-crop-apply-rule 三; PM:pm-ui-3 DR-07', 'A Free crop is applied as a custom ratio (ratio and relative position), with each other photo at the largest box of that ratio');
const rCropOrig = req(S3, 'PM:pm-crop-apply-rule 三, C11', '「Original」 with Apply to all returns every photo to its own original ratio, uncropped');
const rCropSame = req(S3, 'PM:pm-crop-apply-rule 三, C9', 'A photo whose ratio already equals the applied ratio stays whole (not cropped)');
const rCropRot = req(S3, 'PM:pm-crop-apply-rule 五; PM:pm-ui-3 DR-07', 'Apply to all copies rotation and flips: 90° rotation and horizontal / vertical flips to every photo; a fine angle copies the same angle, with each photo\'s box shrunk to avoid black edges from its own size');
const rCropUndoAll = req(S3, 'PM:pm-crop-apply-rule 五; PM:pm-ui-3 DR-05b', 'One Undo after Apply to all undoes it on every photo; one Redo applies it to every photo again');
const rRoomHist = req(S3, 'PM:pm-ui-3 DR-05, DR-05b; PM:pm-ui-4 DR-05, DR-05b', 'Each batch room has one shared Undo / Redo history of two kinds of step: Apply to all (all photos) and a single parameter edit on one photo; Undo of a single edit changes only the photo it was made on, whichever photo is shown');
const rHistSwitch = req(S3, 'PM:pm-ui-3 DR-05e; PM:pm-ui-4 DR-05e', 'Switching photos in a room does not clear its history');
const rHistJump = req(S3, 'PM:pm-ui-3 DR-05h; PM:pm-ui-4 DR-05h', 'When Undo / Redo changes a photo that is not shown, the room switches to that photo and the strip selects it');
const rRoomX = req(S3, 'PM:pm-ui-3 DR-05c; PM:pm-ui-4 DR-05c', 'A room\'s ✕ drops every change made to every photo since the room was opened, Apply to all included');
const rRoomOk = req(S3, 'PM:pm-ui-3 DR-05d; PM:pm-ui-4 DR-05d', 'A room\'s ✓ returns to the Batch Edit Room keeping the changes (one step per photo in the main screen\'s history)');
const rRoomStrip = req(S3, 'PM:pm-ui-3 D1-12; PM:pm-ui-4 D1-12', 'Each batch room shows the thumbnail strip; tapping a thumbnail switches the current photo');
const rCropBack = req(S3, 'DS:design-light-entry 22:2798 「top/ic_back」; PM:pm-ui-3 D1-11', 'The Crop & Rotate room\'s ‹ at the top left leaves the room like ✕ (Q-7)');
const aCrop = arrowReq(S3, '16:10607', 'Batch Edit Room 「Crop & Rotate」 → Crop & Rotate room', '「Crop & Rotate」 opens the batch Crop & Rotate room');
const aCropOk = arrowReq(S3, '16:10615', 'Crop & Rotate ✓ → Batch Edit Room', '✓ keeps the changes and returns to the Batch Edit Room');

// Adjustment
const rAdjLook = req(S4, 'DS:design-light-adjust 「adjust」 41:923; PM:pm-ui-4 D1-11, DR-03, DR-06', 'The batch Adjustment room is the 26\'10/E Adjustment room with tabs 「Light」 / 「Color」 / 「Details」, ⓘ at the top left and 「All」 at the top right, the thumbnail strip, ✕ ↶ ↷ ✓; it has no Subject Detection; the Design draws 「AI Exposure」 in the tool row while the PM says it is not shown (Q-8)');
const rAdjEx = req(S4, 'PM:pm-ui-4 DR-04, DR-04c', 'Adjustment Apply to all copies the room\'s whole setting: photo 1 Exposure +20 → 「All」 → every photo +20; photo 3 Contrast +10; photo 1 Exposure +30 → 「All」 → every other photo matches photo 1 and photo 3 loses its Contrast +10');
const rAdjTab = req(S4, 'PM:pm-ui-4 DR-05g', 'Undo / Redo in Adjustment do not switch the Light / Color / Details tab (as the single Adjustment room)');
const rCurve = req(S4, 'DS:design-light-adjust 「9_Adjust_curve」 57:6798, 「9_Adjust_HSL」 63:7874; PM:pm-ui-4 D1-12, 31:1833', 'Opening Color › Curve or HSL hides the thumbnail strip (it cannot be tapped); 「All」 stays shown');
const rCurveBack = req(S4, 'DS:design-light-adjust 「9_Adjust_curve_collapse」 128:8508, 「9_Adjust_HSL_collapse」 105:4123; PM:pm-ui-4 D1-12', 'Collapsing the Curve / HSL panel (﹀) or going back to a slider tool such as Exposure shows the strip again; to switch photos the panel is collapsed first');
const rHsl = req(S4, 'DS:design-light-adjust 63:7874', 'HSL has the colour chips and 「Hue」, 「Saturation」, 「Lightness」 sliders as in the single Adjustment room, and Curve has its reset and compare buttons');
const rInfo = req(S4, 'DS:design-light-adjust 41:923 「top/ic_info」', 'ⓘ at the top left of the batch rooms opens the existing help for that tool (Design-only, Q-7)');
const aAdj = arrowReq(S4, '16:11038', 'Batch Edit Room 「Adjustment」 → Adjustment room', '「Adjustment」 opens the batch Adjustment room');
const aAdjOk = arrowReq(S4, '16:11042', 'Adjustment ✓ → Batch Edit Room', '✓ keeps the changes and returns to the Batch Edit Room');
const aAdjAll = arrowReq(S4, '297:3116', 'Adjustment 「All」 → applied', '「All」 applies the setting and shows 「Applied to x photos」');

// AI Enhance
const rEnhLook = req(S5, 'DS:design-light-enhance 「Enhance_1」 57:4257; PM:pm-ui-5 DR-09, DR-12a, D1-11', 'The batch AI Enhance room has no Standard / Advanced tabs and no scenario list: one 「Enhance」 button with 「Maximize detaill and clarity with advanced AI.」 under it, the thumbnail strip above it, ✕ and ✓ at the bottom');
const rEnhModel = req(S5, 'PM:pm-ui-5 DR-09d', 'The batch 「Enhance」 runs the 10/E Standard · Portrait enhance');
const rEnhNoAdv = req(S5, 'PM:pm-ui-5 DR-12b, DR-12f, DR-12g, DR-09b, DR-09', 'Batch has none of the Advanced rules or the seven Advanced scene presets (General, Portrait, Scenery, Pets, Concert, Product, Anime)');
const rNoCredit = req(S5, 'PM:pm-ui-5 DR-11, D5-01b; PM:pm-ui-6 DR-11; PM:pm-credit DR-11; PM:pm-tbd Q1', 'AI Enhance in batch charges no credits: the 「Enhance」 button and the dialog show no price, and the balance does not change; Crop & Rotate and Adjustment are free too');
const rEnhAll = req(S5, 'PM:pm-ui-5 DR-10, DR-12h', 'One 「Enhance」 enhances every photo of the batch, and the results apply when done (no ✓ per photo)');
const rConfirm = req(S5, 'DS:design-light-enhance 57:4625 「Alert」; PM:pm-ui-6 DR-12, DR-12h, D1-02, D1-03', 'Each tap on 「Enhance」 asks 「Enhance {xx} photos?」 / 「Processing takes a moment and cannot be canceled once started.」 with 「Cancel」 and 「Start」 ({xx} = the photos to enhance, Q-9)');
const rConfirmBtns = req(S5, 'PM:pm-ui-6 DR-12', '「Cancel」 returns to the AI Enhance room with nothing processed; 「Start」 starts the batch');
const rProc = req(S5, 'DS:design-light-enhance 57:4892; PM:pm-ui-5 D1-02', 'While processing, the existing loading screen shows 「Creating Your AI Image」 and 「Enhancing k / N」 (k = done, N = requests) with a progress bar; the mask covers the whole screen, the strip included');
const rProcLock = req(S5, 'PM:pm-ui-5 D1-02, D1-03', 'While processing nothing else can be done: no Crop / Adjustment, no thumbnail switch, no cancel, no save; the user waits for every photo');
const rOnce = req(S5, 'PM:pm-ui-5 DR-12e, DR-12h', 'In one visit of the AI Enhance room 「Enhance」 can be applied once: afterwards the button reads 「Enhanced」 and is greyed');
const rAgain = req(S5, 'PM:pm-ui-5 DR-12e', 'Leaving the room and opening it again allows one more Enhance, run on the current (already enhanced) photos');
const rFreeIap = req(S5, 'PM:pm-ui-5 DR-12d, D3-01, D3-02; PM:pm-flow-4 151:2352', 'A Free user\'s 「Enhance」 opens the existing Premium IAP page at once (no trial of one photo, no dialog)');
const rIapBack = req(S5, 'PM:pm-flow-4 151:2336', 'Closing the Premium IAP page without buying returns to the AI Enhance room with nothing enhanced (Q-10)');
const rEnhX = req(S5, 'DS:design-light-enhance 57:4257 「✕」', 'The AI Enhance room\'s ✕ returns to the Batch Edit Room; whether a finished Enhance is kept is not stated (Q-11)');
const rEnhStrip = req(S5, 'PM:pm-ui-5 D1-12', 'The AI Enhance room\'s thumbnail strip switches the photo shown');
const rTiersIos = req(S5, 'KB:KP-013', 'On iOS the paid modes Pro and Pro+ are distinct; batch AI Enhance works for each paid mode', 'ios');
const aEnh = arrowReq(S5, '16:11813', 'Batch Edit Room 「AI Enhance」 → AI Enhance room', '「AI Enhance」 opens the batch AI Enhance room');
const aEnhBtn = arrowReq(S5, '31:1858', 'AI Enhance 「Enhance」 → Confirm Dialog', 'a paid user\'s 「Enhance」 asks 「Enhance {xx} photos?」');
const aStart = arrowReq(S5, '16:11821', 'Confirm 「Start」 → processing', '「Start」 shows 「Enhancing k / N」');
const aCancel = arrowReq(S5, '16:11829', 'Confirm 「Cancel」 → AI Enhance room', 'nothing is processed');
const aDone = arrowReq(S5, '31:1863', 'Processing → result summary', 'the result shows when every photo is done');
const aEnhOk = arrowReq(S5, '16:13763', 'AI Enhance ✓ → Batch Edit Room', '✓ returns with the enhanced photos');
const aIap = arrowReq(S5, '151:2352', 'AI Enhance 「Enhance」 (Free) → Premium IAP', 'a Free user\'s 「Enhance」 opens the Premium IAP page');

// AI Enhance errors
const rSummary = req(S6, 'DS:design-light-enhance 57:5097; PM:pm-ui-5 D1-04; PM:pm-error-handle D1-04', 'Failures are summed up once, when every photo is done (no dialog per photo): 「X completed, Y failed」 and 「Failed photos are marked with ! on the thumbnails.」 (Design; PM: 「Failed photos are marked on the thumbnails.」, Q-12); failed thumbnails get a red ! at the top right, successful ones none');
const rSumTap = req(S6, 'PM:pm-ui-5 D1-04', 'Tapping a failed thumbnail shows that photo');
const rSumClose = req(S6, 'DS:design-light-enhance 57:5097 (× on the message)', 'The × on the result message closes it (Design-only)');
const rRetry = req(S6, 'DS:design-light-enhance 57:5097; PM:pm-ui-5 D1-04, DR-12e', 'The button becomes 「Retry Failed (x)」 (x = failed photos); it redoes only the failed photos, their ! goes, successful photos are not redone; a failed photo does not count as enhanced');
const rRetrySum = req(S6, 'PM:pm-ui-5 D1-04', 'After Retry the summary counts the whole batch: 15 photos, 「12 completed, 3 failed」 → Retry, 2 succeed → 「14 completed, 1 failed」 and 「Retry Failed (1)」; when all have succeeded the message and 「Retry Failed」 are gone');
const rOffline = req(S6, 'PM:pm-ui-5 D1-05, D1-04; PM:pm-error-handle D1-05', 'Losing the network counts as failure: finished photos are kept, unfinished ones get !, and the message is 「X completed, Y failed」 / 「Connection lost. Check your connection and retry.」; with both failures and a lost connection the counts are combined and the second line shows the connection message');
const rOfflineRetry = req(S6, 'PM:pm-ui-5 D1-05', '「Retry Failed (x)」 reruns the unfinished photos; tapped while still offline it shows the toast 「No internet connection」 and does not start');
const rBg = req(S6, 'PM:pm-error-handle D1-05', 'Sending the app to the background pauses the batch; it continues on return');
const rKill = req(S6, 'PM:pm-error-handle D1-05, D1-10; PM:pm-ui-5 D1-05, D1-10', 'If the app is killed the Batch Edit Room is gone, and finished AI Enhance results are not kept');
const rArtwork = req(S6, 'PM:pm-ui-7 D1-10; PM:pm-error-handle D1-10', 'Standard AI Enhance results from batch are not saved to My AI Artwork');

// Save
const rSaving = req(S7, 'DS:design-light-save 「canvas_img_focus」 57:5666; PM:pm-ui-8 D5-01b', 'Save shows 「Saving k / N」 with 「Please do not leave this page or quit the app.」 and a progress bar; the Batch Save page opens only when every photo is saved (Design 「Saving 3/20」)');
const rNewFiles = req(S7, 'PM:pm-ui-8 D1-06', 'Each photo is saved as a new file; the originals are not overwritten');
const rSaveAll = req(S7, 'PM:pm-ui-8 D1-06', 'Every photo of the batch is saved, the unedited ones too, each as a new file');
const rSavePage = req(S7, 'DS:design-light-save 「save2」 57:6001; PM:pm-ui-8 D1-07', 'The Batch Save page shows a grid of the saved photos under 「Save 12 photos」 (Design; PM 「Saved 12 photos」, Q-13), ‹ at the top left, Home at the top right and 「Edit Next Batch」 fixed at the bottom');
const rSaveNoZoom = req(S7, 'PM:pm-ui-8 D1-07', 'The Batch Save page thumbnails do not open (no full view)');
const rSaveBack = req(S7, 'PM:pm-ui-8 D1-07', 'On the Batch Save page ‹ returns to the Batch Edit Room and Home to the Launcher');
const rNextBatch = req(S7, 'PM:pm-ui-8 D1-07; PM:pm-flow-7 357:2621', '「Edit Next Batch」 opens the Photo Picker on 「Batch」 with nothing ticked; its ‹ returns to the Batch Edit Room with the earlier edits (day 1 follows the Android single Edit Room on both platforms)');
const rNextBatchIos = req(S7, 'PM:pm-ui-8 D1-07', 'On iOS this differs from the single Edit Room today (Save page → Next edit → picker ‹ → Launcher): batch follows Android and returns to the Batch Edit Room', 'ios');
const rRating = req(S7, 'PM:pm-ui-8 D1-07', 'For the rating dialog a batch save counts as one save; IAP flyers and ads show as for any save');
const aSave = arrowReq(S7, '16:13426', 'Batch Edit Room Save → Saving', 'Save shows 「Saving k / N」');
const aSaved = arrowReq(S7, '16:13430', 'Saving → Batch Save page', 'the Batch Save page shows once all are saved');
const aSaveBack = arrowReq(S7, '141:2038', 'Batch Save page ‹ → Batch Edit Room', '‹ returns to the Batch Edit Room');
const aSaveHome = arrowReq(S7, '141:2042', 'Batch Save page Home → Launcher', 'Home returns to the Launcher');
const aNextBatch = arrowReq(S7, '141:2046', 'Batch Save page 「Edit Next Batch」 → Photo Picker', '「Edit Next Batch」 opens the picker on 「Batch」 with nothing ticked');
const aNextBack = arrowReq(S7, '357:2620', 'Photo Picker (from Edit Next Batch) ‹ → Batch Edit Room', '‹ returns to the Batch Edit Room with its edits');

// Leaving
const rHome = req(S8, 'PM:pm-ui-2 D1-08; PM:pm-ui-7 D1-08; PM:pm-flow-7', 'Home with no edit yet goes straight to the Launcher; with edits it asks 「Discard changes?」, and 「Discard」 goes to the Launcher');
const rReplace = req(S8, 'PM:pm-ui-2 D1-08, D1-08b; PM:pm-ui-7 D1-08, D1-08b', 'Replace photo with no edit yet goes straight to the Photo Picker on 「Batch」; with edits it asks first and 「Discard」 goes there; either way the earlier photos stay ticked and every edit of this Batch Edit is dropped');
const rDialog = req(S8, 'DS:design-light-save 「Discard dialog」 110:4532; PM:pm-ui-7 D1-08b', 'The dialog reads 「Discard changes?」 / 「Your edits to these photos will be lost.」 with 「Discard」 and 「Keep Editing」');
const rKeep = req(S8, 'PM:pm-ui-7 D1-08', '「Keep Editing」 closes the dialog and stays in the Batch Edit Room with every edit');
const aHomeD = arrowReq(S8, '16:13750', 'Batch Edit Room Home (with edits) → Discard Dialog', 'Home asks 「Discard changes?」');
const aReplD = arrowReq(S8, '37:2034', 'Batch Edit Room Replace photo (with edits) → Discard Dialog', 'Replace photo asks 「Discard changes?」');
const aDiscard = arrowReq(S8, '16:13754', 'Discard Dialog 「Discard」 → Photo Picker (Batch)', 'from Replace photo, 「Discard」 opens the picker on 「Batch」 with the earlier photos ticked');
const aKeep = arrowReq(S8, '16:13758', 'Discard Dialog 「Keep Editing」 → Batch Edit Room', 'the edits stay');
const aNext7 = arrowReq(S8, '16:13746', 'Photo Picker (Batch) Next → Batch Edit Room (leave flow)', 'Next opens the Batch Edit Room');

// Light and dark, tracking
const rModes = req(S9, 'DS:design-light-entry … design-dark-save (every screen drawn light and dark)', 'Every Batch Edit screen has a light and a dark design (which one shows: Q-14)');
const rEvEnter = req(S10, 'PM:pm-tracking D0-02', 'Switching the picker to Batch and entering the Batch Edit Room sends a new event (name to be set, e.g. Batch_Edit_Enter)');
const rEvGen = req(S10, 'PM:pm-tracking D4-01', 'Batch AI Enhance sends GenAI_Feature_Generate once per photo, with from = BatchEdit and batch_size');
const rEvSave = req(S10, 'PM:pm-tracking D0-02', 'A batch save sends Photo_Result_Save (unchanged event)');
const rEvNext = req(S10, 'PM:pm-tracking D1-07', '「Edit Next Batch」 sends a new click event (name to be set)');
const rEvNames = req(S10, 'PM:pm-tracking D0-02', 'Event names have three PascalCase parts (Xxx_Yyy_Zzz) and parameters are snake_case, or both platforms drop them');
const rSysBack = req(S11, 'Rule: Android system Back (analysis.md pass 8, REQ-051 of the AI Mini Drama ledger, KP-098)', 'System Back on every Batch Edit screen does what that screen\'s own ‹ / ✕ / Cancel does; where the spec gives no way out, the row records what it does', 'android');

// ---------------------------------------------------------------- rows
type Row = { key: string; sec: string; pre: string; act: string; exp: string; pri: string; refs: string[]; notes?: string; pm?: boolean };
const rows: Row[] = [];
const row = (key: string, sec: string, pre: string, act: string | string[], exp: string, pri: string, refs: string[], notes = '', plat?: 'ios' | 'android', pm = false) => {
  if (plat && plat !== P) return;
  const a = Array.isArray(act) ? (act.length > 1 ? act.map((s, i) => `${i + 1}. ${s}`).join('\n') : act[0]) : act;
  rows.push({ key, sec, pre, act: a, exp, pri, refs: refs.filter(Boolean), notes, pm });
};
const pmRow = (key: string, sec: string, pre: string, act: string | string[], exp: string, pri: string, refs: string[], notes = '', plat?: 'ios' | 'android') => row(key, sec, pre, act, exp, pri, refs, notes, plat, true);
const free = `${phone}, PhotoDirector signed in, Free tier`;
const paid = IOS ? `${phone}, PhotoDirector signed in, Pro tier (Launcher › Pink › ☰ › [0] IAP › Status = Pro)` : `${phone}, PhotoDirector signed in, Pro (VIP) account`;
const gal = 'at least 21 photos in the gallery, of different sizes and ratios (e.g. 2:3, 4:5, 1:1, 16:9)';
const pick = (n: number) => [`Open Launcher › 「Edit」`, 'Tap 「Batch」', `Tap ${n} photos in order`, 'Tap 「Next」'];
const room = (who = free, n = 5) => `${who}; ${gal}; Batch Edit Room open with ${n} photos (Launcher › Edit › Batch › ${n} photos › Next)`;
const crop = (who = free) => `${room(who)}; 「Crop & Rotate」 open on photo 1`;
const adj = (who = free) => `${room(who)}; 「Adjustment」 open on photo 1`;
const enh = (n = 5) => `${room(paid, n)}; 「AI Enhance」 open`;
const edited = (who = free) => `${room(who)}; one edit made (Crop & Rotate › 「Squre」 › ✓)`;

// Entry and Photo Picker
row('pk-open', S1, `${free}; ${gal}`, 'Open Launcher › 「Edit」', 'The Photo Picker opens with the 「Single」 / 「Batch」 switch at the top, 「Single」 selected', 'P1', [rTabs, aEdit]);
row('pk-default', S1, `${free}; ${gal}`, ['Open Launcher › 「Edit」', 'Tap 「Batch」', 'Tap ‹', 'Open Launcher › 「Edit」 again'], 'The picker opens on 「Single」 again (it does not remember 「Batch」); the first ‹ returned to the Launcher', 'P2', [rTabs, aPickBack]);
row('pk-single', S1, `${free}; ${gal}`, ['Open Launcher › 「Edit」', 'With 「Single」, tap one photo'], 'The existing single-photo Edit Room opens with that photo, as before this feature (Quick Action / Edit / Enhance / Portrait / Effects)', 'P1', [rSingle]);
row('pk-single-one', S1, `${free}; ${gal}`, ['Open Launcher › 「Edit」 (「Single」)', 'Try to tick a second photo'], 'With 「Single」 only one photo can be picked; picking it opens the Edit Room', 'P2', [rMulti]);
row('pk-order', S1, `${free}; ${gal}`, ['Open Launcher › 「Edit」', 'Tap 「Batch」', 'Tap photos C, A, B in that order'], 'The thumbnails show 1 on C, 2 on A, 3 on B; the bottom reads 「Select 1 to 20 photos to continue.(3/20)」 with 「Next」, and C, A, B appear in the row above 「Next」', 'P1', [rOrder, rCount, rStripPick], 'Design copy; PM mockups 「3 selected (max 20)」 / 「Done」 (Q-1)');
row('pk-next', S1, `${free}; ${gal}`, pick(3), 'The Batch Edit Room opens on its main screen with the 3 photos in the strip in pick order (C, A, B)', 'P1', [aNext, rOrder, rRoomLook]);
row('pk-x', S1, `${free}; ${gal}`, ['Open Launcher › 「Edit」', 'Tap 「Batch」', 'Tap 3 photos', 'Tap × on the second photo in the row above 「Next」'], 'That photo is no longer ticked; the count reads (2/20) and the remaining photos keep their order (renumbered 1, 2)', 'P2', [rStripPick], 'Design-only control (Q-2): renumbering not stated');
row('pk-20', S1, `${free}; ${gal}`, ['Open Launcher › 「Edit」', 'Tap 「Batch」', 'Tap 20 photos', 'Tap a 21st photo'], 'The 21st photo is not ticked and the toast 「Please pick at most 20 photos.」 shows; the count stays at 20', 'P1', [rOverMax, rMulti]);
row('pk-20-next', S1, `${free}; ${gal}`, pick(20), 'The Batch Edit Room opens with all 20 photos (a Free user, no IAP)', 'P1', [rMulti, rFree]);
row('pk-one', S1, `${free}; ${gal}`, ['Open Launcher › 「Edit」', 'Tap 「Batch」', 'Tap one photo', 'Tap 「Next」'], 'The existing single-photo Edit Room opens with that photo (not the Batch Edit Room)', 'P1', [rBatchOne, aOne]);
row('pk-replace', S1, `${free}; ${gal}; single-photo Edit Room open (Edit › Single › one photo)`, ['Tap Replace photo (the photo icon at the top left)', 'Tap 「Batch」', 'Tap 3 photos', 'Tap 「Next」'], 'Replace photo opens the Photo Picker; with 「Batch」 and 3 photos 「Next」 opens the Batch Edit Room', 'P2', [rReplaceSingle, aRepl1]);
row('pk-noentry', S1, `${free}; ${gal}; single-photo Edit Room open`, 'Look through the Edit Room\'s tools and top bar', 'The single Edit Room has no batch button or 「Batch Edit」 entry', 'P3', [rWhere]);
row('sc-open', S1, `${paid}; ${gal}`, 'On the Launcher tap the 「AI Enhance」 shortcut', 'The Photo Picker opens with the same 「Single」 / 「Batch」 switch, 「Single」 selected', 'P1', [aSc, rSameTabs]);
row('sc-batch', S1, `${paid}; ${gal}`, ['On the Launcher tap the 「AI Enhance」 shortcut', 'Tap 「Batch」', 'Tap 3 photos', 'Tap 「Next」'], 'The batch AI Enhance room opens directly (one 「Enhance」 button, the 3 photos in its strip), not the Batch Edit Room main screen', 'P1', [aScDone, rScPick]);
row('sc-back', S1, `${paid}; ${gal}`, ['On the Launcher tap the 「AI Enhance」 shortcut', 'Tap ‹'], 'The Launcher shows', 'P2', [aScBack]);
pmRow('sc-shortcut', S1, `${free}; ${gal}`, 'Look for a 「Batch Editing」 shortcut on the Launcher and tap it', 'A 「Batch Editing」 shortcut is on the Launcher and opens Batch Edit (the Photo Picker on 「Batch」, Q-3)', 'P2', [rShortcut], 'Icon to be designed; landing page not stated (Q-3)');
pmRow('sc-deeplink', S1, `${free}; ${gal}; the link phd://navigate/page?name=batch_edit sent to the phone (e.g. in Notes)`, 'Tap the link', 'PhotoDirector opens Batch Edit (the Photo Picker on 「Batch」, Q-3)', 'P2', [rShortcut]);
row('pk-scope', S1, room(), 'Look at the bottom of the Batch Edit Room', 'Only 「Crop & Rotate」, 「Adjustment」 and 「AI Enhance」 are offered: no Filter, Preset or other tool', 'P2', [rScope, rRoomLook]);

// Batch Edit Room
row('rm-look', S2, room(), 'Look at the Batch Edit Room', 'It looks like the Edit Room: top bar Home and Replace photo on the left, Save and Settings on the right (Settings rightmost; the Design adds a feedback icon), the photo, ↶ ↷ and the compare button, the thumbnail strip, and 「Crop & Rotate」, 「Adjustment」, 「AI Enhance」 in that order', 'P1', [rRoomLook, rTopBar]);
row('rm-strip', S2, room(), ['Tap the third thumbnail', 'Tap the first thumbnail'], 'The photo shown changes to photo 3, then photo 1; the thumbnails have no ×, and there is no way to add a photo from the strip', 'P1', [rStrip]);
row('rm-undo', S2, room(), ['On photo 1 open 「Adjustment」, set Exposure +30, tap ✓', 'On photo 2 open 「Adjustment」, set Contrast +30, tap ✓', 'Show photo 1 and tap ↶'], 'Only photo 1 loses its Exposure change; photo 2 keeps Contrast +30. ↷ brings photo 1\'s Exposure back', 'P1', [rOuterUndo]);
row('rm-undo-room', S2, room(), ['Open 「Crop & Rotate」, choose 「Squre」, tap 「All」, tap ✓', 'Show photo 3 and tap ↶ once'], 'Only photo 3 goes back to its uncropped state (the room visit is one step per photo); photos 1, 2, 4, 5 stay square', 'P2', [rOuterUndo]);
row('rm-enh-undo', S2, room(paid), ['Open 「AI Enhance」, tap 「Enhance」 › 「Start」, wait, tap ✓', 'Show photo 2 and tap ↶', 'Tap ↷'], '↶ shows photo 2 as before the Enhance (the others stay enhanced); ↷ brings the enhanced photo 2 back', 'P1', [rEnhUndo]);
row('rm-enh-undo-lost', S2, room(paid), ['Enhance the batch and tap ✓', 'Show photo 2 and tap ↶', 'Open 「Adjustment」 on photo 2, set Exposure +10, tap ✓'], '↷ no longer brings photo 2\'s enhanced result back; opening 「AI Enhance」 again can enhance it anew', 'P2', [rEnhUndo, rAgain]);
row('rm-ba', S2, edited(), 'Press and hold the compare button at the bottom right of the photo', 'The current photo shows without its edits while held, and with them again on release', 'P3', [rBA], 'As the Edit Room; the spec draws the button but states nothing new');
pmRow('rm-settings', S2, room(), 'Tap Settings (the gear, rightmost in the top bar)', 'The existing save settings open, as from the Edit Room (Q-4)', 'P3', [rSettings, rTopBar]);
row('rm-feedback', S2, room(), 'Tap the feedback icon in the top bar', 'The app\'s existing feedback page opens (Q-4)', 'P3', [rFeedback], 'Design-only icon (Q-4)');

// Crop & Rotate
row('cr-open', S3, room(), 'Tap 「Crop & Rotate」', 'The batch Crop & Rotate room opens: ‹ and 「1920 x 2560 ✎」-style size at the top, 「All」 disabled at the top right, the thumbnail strip, the angle slider, 「Rotate」, 「Flip」, 「Flip Vertically」, 「Original」, 「Custom」 and the ratios, ✕ ↶ ↷ ✓; no panel title bar', 'P1', [aCrop, rCropLook, rAllOff, rAll]);
row('cr-size', S3, crop(), ['Read the size at the top', 'Tap the thumbnail of a photo of another size'], 'The size shows photo 1\'s output 「W x H」, then the other photo\'s own 「W x H」', 'P2', [rSize, rRoomStrip]);
pmRow('cr-px', S3, crop(), ['Tap ✎', 'Type a width larger than the photo\'s original width and confirm'], 'A toast says the size is out of range and the value is not applied (range 238 px to the original size)', 'P2', [rPx], 'Toast copy not given (Meitu: 「Width and height exceed the range」, Q-5)');
// Android risk KP-099 (2026-11-09): on Android 15 inputs sat under the keyboard (edge-to-edge).
if (AND) pmRow('cr-px-kbd', S3, crop(), 'Tap ✎', 'The keyboard opens and the width / height fields and their confirm stay visible above it (not hidden under the keyboard or the navigation bar)', 'P3', [rPx], 'KB risk KP-099 (edge-to-edge and keyboard)');
pmRow('cr-px-low', S3, crop(), ['Tap ✎', 'Type 200 px and confirm'], 'The toast shows and 200 px is not applied (minimum 238 px)', 'P3', [rPx]);
pmRow('cr-linked', S3, crop(), ['Tap ✎ with width and height linked', 'Type a smaller width and confirm'], 'The height follows (ratio kept) and 「All」 stays disabled', 'P2', [rLinked]);
pmRow('cr-unlinked', S3, crop(), ['Tap ✎ and unlink width and height', 'Type 1000 x 500 and confirm', 'Tap 「All」'], 'The ratio switches to Free and 「All」 becomes enabled; after 「All」 the other photos get a 2:1 box at their own largest size, not 1000 x 500 px', 'P2', [rLinked, rPxSync, rCropFree]);
row('cr-all-on', S3, crop(), 'Tap 「Squre」', '「All」 becomes enabled', 'P1', [rAllOn]);
row('cr-all', S3, crop(), ['Tap 「Squre」', 'Tap 「All」'], 'The room stays open, the toast 「Applied to 4 photos」 shows, every thumbnail in the strip shows a square crop, and 「All」 becomes disabled', 'P1', [rAll, rAllToast, rAllThumbs, rAllOn]);
row('cr-all-switch', S3, crop(), ['Tap 「Squre」 › 「All」', 'Tap photo 2\'s thumbnail', 'Tap 「2:3」', 'Tap photo 3\'s thumbnail', 'Tap photo 2\'s thumbnail'], '「All」 is disabled on photo 2 after the switch, enabled after 「2:3」, disabled on photo 3 (no pending change) and enabled again on photo 2', 'P1', [rAllSwitch, rAllTweak]);
row('cr-tweak', S3, crop(), ['Tap 「Squre」 › 「All」', 'Show photo 2 and drag its crop box to the right edge', 'Tap ✓'], 'Only photo 2\'s box moves; photos 1, 3, 4, 5 keep their square boxes', 'P1', [rAllTweak]);
row('cr-again', S3, crop(), ['Tap 「Squre」 › 「All」', 'Show photo 2, tap 「2:3」', 'Show photo 1, tap 「3:4」, tap 「All」'], 'Every photo, photo 2 included, now has a 3:4 crop; photo 2\'s own 2:3 is replaced; the toast reads 「Applied to 4 photos」', 'P1', [rAllAgain, rCropOver]);
row('cr-default', S3, crop(), ['Tap 「3:4」', 'Tap 「All」'], 'Photo 1 shows the largest 3:4 box, centred; after 「All」 every photo has its own largest 3:4 box, centred', 'P1', [rCropDefault, rCropMax]);
row('cr-cur', S3, crop(), ['Tap 「Squre」', 'Shrink the box and move it to the bottom right', 'Tap 「All」'], 'Photo 1 keeps its small box at the bottom right; every other photo gets the largest square its size allows, pushed right / down only where it has room (centred where it has none)', 'P1', [rCropCur, rCropMax], 'Newer PM crop rule (✅ 結論) over the PM UI board\'s 「centred」 (Q-6)');
row('cr-left', S3, `${crop()}; photo 1 a 16:9 landscape, photo 2 a 2:3 portrait`, ['Tap 「Squre」', 'Drag the box to the far left', 'Tap 「All」'], 'Photo 2 (portrait) gets a centred square, as it has no room left / right; landscape photos get their largest square at the far left', 'P2', [rCropMax]);
row('cr-down', S3, `${crop()}; photo 1 a 4:5 portrait, photo 2 a 2:3 portrait, photo 3 a 16:9 landscape`, ['On photo 1 tap 「Squre」', 'Drag the box to the bottom', 'Tap 「All」'], 'Photo 2\'s square sits at the bottom; photo 3 (no room up / down) is centred', 'P2', [rCropMax]);
row('cr-px-out', S3, crop(), ['Tap 「Squre」 › 「All」', 'Tap ✓', `Save the batch and open the saved files in ${AND ? 'the Gallery app' : 'Photos'}`], 'Each saved photo is square at its own size (the px differ between photos), cut from its original', 'P2', [rCropPx, rCropOver]);
// Android risk KP-082 / KP-068 (2026-11-09): crop only reached the thumbnail stack on large photos, so Save wrote the uncropped original; chain geometry → Adjustment → Save on a photo over 1600 px and check the file.
if (AND) row('cr-chain-large', S3, `${free}; ${gal}, two of them with a long edge over 1600 px (e.g. 4000 x 3000 camera photos); Batch Edit Room open with those 2 and 3 smaller photos; 「Crop & Rotate」 open on a large photo`, ['Tap 「Squre」 › 「All」 › ✓', 'Open 「Adjustment」, set Exposure +30, tap 「All」 › ✓', 'Save the batch and open the two large saved photos in the Gallery app'], 'Both large photos are saved square and brighter, cut from the full-size original (not the uncropped photo, not a thumbnail-sized file)', 'P2', [rCropPx, rSaveAll, rNewFiles], 'KB risk KP-082 (large photos have two stacks); KP-068: 1600 px is the repro condition');
row('cr-free', S3, crop(), ['Tap 「Custom」 (Free) and drag a wide box to the top left', 'Tap 「All」'], 'The other photos get the same ratio at their largest box, at the top left where they have room; not the same relative size', 'P2', [rCropFree, rCropMax]);
row('cr-orig', S3, crop(), ['Tap 「3:2」 › 「All」', 'Tap 「Original」 › 「All」'], 'Every photo is back at its own original ratio, uncropped', 'P2', [rCropOrig]);
row('cr-same', S3, `${crop()}; photo 3 a 1:1 photo`, ['On photo 1 tap 「Squre」 › 「All」', 'Show photo 3'], 'Photo 3 is not cropped (the whole photo)', 'P2', [rCropSame]);
row('cr-rotate', S3, crop(), ['Tap 「Rotate」 once', 'Tap 「Flip」', 'Tap 「All」'], 'Every photo is rotated 90° and flipped horizontally like photo 1', 'P1', [rCropRot]);
row('cr-flipv', S3, crop(), ['Tap 「Flip Vertically」', 'Tap 「All」'], 'Every photo is flipped vertically', 'P2', [rCropRot]);
row('cr-angle', S3, crop(), ['Drag the angle slider to 15', 'Tap 「All」'], 'Every photo is tilted 15°, each with its box shrunk enough to show no black edge for its own size', 'P2', [rCropRot]);
row('cr-undo-all', S3, crop(), ['Tap 「Squre」 › 「All」', 'Tap ↶', 'Tap ↷'], '↶ removes the square from every photo at once and 「All」 becomes enabled; ↷ applies it to every photo again and 「All」 becomes disabled', 'P1', [rCropUndoAll, rAllUndo, rRoomHist]);
row('cr-undo-single', S3, crop(), ['Tap 「Squre」 › 「All」', 'Show photo 2, tap 「2:3」', 'Show photo 4', 'Tap ↶'], 'The room switches to photo 2 (strip selects it) and photo 2 is back to square; photo 4 and the others are unchanged', 'P1', [rRoomHist, rHistJump]);
row('cr-hist-switch', S3, crop(), ['Tap 「Squre」 on photo 1', 'Tap photo 2\'s thumbnail', 'Tap photo 1\'s thumbnail', 'Tap ↶'], 'Photo 1\'s square is undone: switching photos kept the history', 'P2', [rHistSwitch]);
row('cr-x', S3, crop(), ['Tap 「Squre」 › 「All」', 'Show photo 2, tap 「2:3」', 'Tap ✕'], 'The Batch Edit Room shows every photo as before the room was opened (no square, no 2:3)', 'P1', [rRoomX]);
row('cr-ok', S3, crop(), ['Tap 「Squre」 › 「All」', 'Tap ✓'], 'The Batch Edit Room shows every photo square', 'P1', [aCropOk, rRoomOk]);
row('cr-back', S3, crop(), ['Tap 「Squre」', 'Tap ‹ at the top left'], 'The Batch Edit Room shows with photo 1 uncropped (‹ = ✕, Q-7)', 'P3', [rCropBack]);

// Adjustment
row('ad-open', S4, room(), 'Tap 「Adjustment」', 'The batch Adjustment room opens: ⓘ and 「All」 (disabled) at the top, the thumbnail strip, the slider, 「Light」 / 「Color」 / 「Details」, the tool row and ✕ ↶ ↷ ✓; no Subject Detection. Note whether 「AI Exposure」 is in the tool row (Design draws it, PM says not; Q-8)', 'P1', [aAdj, rAdjLook, rAllOff], 'Design and PM disagree on AI Exposure: check on device (Q-8)');
row('ad-tools', S4, adj(), ['Tap Exposure, Contrast and Highlight in turn and move the slider for each', 'If 「AI Exposure」 is in the tool row, tap it'], 'Each tool changes photo 1 only and enables 「All」; the tools are those of the single Adjustment room (AI Exposure: Q-8)', 'P2', [rAdjLook, rAllOn]);
row('ad-all', S4, adj(), ['Tap Exposure and set +20', 'Tap 「All」'], 'The toast 「Applied to 4 photos」 shows, every thumbnail is brighter, 「All」 becomes disabled and the room stays open', 'P1', [aAdjAll, rAllToast, rAllThumbs, rAll, rAllOn]);
row('ad-example', S4, adj(), ['Set Exposure +20, tap 「All」', 'Show photo 3, set Contrast +10', 'Show photo 1, set Exposure +30, tap 「All」'], 'Every other photo matches photo 1 (Exposure +30); photo 3 no longer has its Contrast +10', 'P1', [rAdjEx, rAllAgain, rAllTweak]);
row('ad-switch', S4, adj(), ['Set Exposure +20, tap 「All」', 'Show photo 2, set Contrast +10', 'Show photo 4', 'Show photo 2'], '「All」 is enabled on photo 2 after its change, disabled on photo 4 and enabled again on photo 2', 'P2', [rAllSwitch]);
row('ad-undo', S4, adj(), ['Set Exposure +20, tap 「All」', 'Show photo 2, set Contrast +10', 'Show photo 4, tap 「Color」', 'Tap ↶', 'Tap ↶'], 'The first ↶ switches to photo 2 and undoes its Contrast (only photo 2); the tab stays 「Color」; the second ↶ undoes the Exposure +20 on every photo and 「All」 becomes enabled', 'P1', [rRoomHist, rHistJump, rAdjTab, rAllUndo]);
row('ad-redo', S4, adj(), ['Set Exposure +20, tap 「All」', 'Tap ↶', 'Tap ↷'], '↷ applies Exposure +20 to every photo again and 「All」 is disabled', 'P2', [rAllUndo, rRoomHist]);
row('ad-x', S4, adj(), ['Set Exposure +20, tap 「All」', 'Tap ✕'], 'The Batch Edit Room shows every photo without the Exposure change', 'P1', [rRoomX]);
row('ad-ok', S4, adj(), ['Set Exposure +20, tap 「All」', 'Tap ✓'], 'The Batch Edit Room shows every photo brighter', 'P1', [aAdjOk, rRoomOk]);
row('ad-curve', S4, adj(), ['Tap 「Color」', 'Open Curve'], 'The thumbnail strip hides and does not react to taps; 「All」 is still shown', 'P1', [rCurve]);
row('ad-curve-back', S4, `${adj()}; Color › Curve open`, ['Tap ﹀ to collapse the panel', 'Tap photo 2\'s thumbnail'], 'The strip shows again after collapsing and photo 2 is shown', 'P1', [rCurveBack]);
row('ad-hsl', S4, adj(), ['Tap 「Color」', 'Open HSL', 'Tap a colour chip and move 「Hue」, 「Saturation」, 「Lightness」', 'Tap Exposure'], 'HSL has the colour chips and the three sliders and hides the strip; going back to Exposure shows the strip again', 'P2', [rHsl, rCurve, rCurveBack]);
row('ad-curve-tools', S4, `${adj()}; Color › Curve open with a point moved`, ['Press and hold the compare button', 'Tap the reset button'], 'Compare shows the photo without the curve while held; reset puts the curve back to straight', 'P3', [rHsl]);
row('ad-info', S4, adj(), 'Tap ⓘ at the top left', 'The existing help for Adjustment opens (Q-7)', 'P3', [rInfo], 'Design-only icon (Q-7)');
row('ad-auto', S4, adj(), ['Tap 「Auto」', 'Tap 「All」'], 'Auto adjusts photo 1; 「All」 applies the same settings to every other photo', 'P2', [rAll, rAdjLook]);

// AI Enhance
row('en-open', S5, room(paid), 'Tap 「AI Enhance」', 'The batch AI Enhance room opens: one 「Enhance」 button with 「Maximize detaill and clarity with advanced AI.」, the strip above it, ✕ and ✓; no Standard / Advanced tabs, no scenarios, no credit price on the button', 'P1', [aEnh, rEnhLook, rEnhNoAdv, rNoCredit]);
row('en-dialog', S5, enh(), 'Tap 「Enhance」', 'The dialog 「Enhance 5 photos?」 / 「Processing takes a moment and cannot be canceled once started.」 with 「Cancel」 and 「Start」; no credit price', 'P1', [aEnhBtn, rConfirm, rNoCredit], '{xx} assumed to be the batch size (Q-9)');
row('en-cancel', S5, enh(), ['Tap 「Enhance」', 'Tap 「Cancel」'], 'The dialog closes; the room is as before and no photo is processed', 'P1', [aCancel, rConfirmBtns]);
row('en-start', S5, enh(), ['Tap 「Enhance」', 'Tap 「Start」'], '「Creating Your AI Image」 and 「Enhancing k / 5」 with a progress bar cover the whole screen (strip included); k counts up to 5', 'P1', [aStart, rConfirmBtns, rProc]);
row('en-lock', S5, enh(), ['Tap 「Enhance」 › 「Start」', 'While it runs, tap a thumbnail, ✕, ✓ and the area of the bottom buttons'], 'Nothing reacts until every photo is done: no switch, no leaving, no cancel', 'P1', [rProcLock]);
row('en-done', S5, enh(), ['Tap 「Enhance」 › 「Start」', 'Wait until it ends', 'Tap 「Enhanced」'], 'Every photo in the strip is enhanced; the button reads 「Enhanced」, greyed, and tapping it does nothing; no result message when all succeeded', 'P1', [aDone, rEnhAll, rOnce, rRetrySum]);
row('en-again', S5, enh(), ['Enhance the batch', 'Tap ✓', 'Tap 「AI Enhance」 again'], '「Enhance」 is enabled again; running it enhances the already enhanced photos (the dialog shows first)', 'P2', [rAgain, rConfirm]);
row('en-ok', S5, enh(), ['Enhance the batch', 'Tap ✓'], 'The Batch Edit Room shows every photo enhanced', 'P1', [aEnhOk]);
row('en-x', S5, enh(), ['Enhance the batch', 'Tap ✕'], 'The Batch Edit Room shows; note whether the enhanced results were kept (Q-11)', 'P2', [rEnhX], 'Not stated (Q-11)');
row('en-strip', S5, enh(), 'Tap photo 3\'s thumbnail', 'Photo 3 is shown above the 「Enhance」 button', 'P2', [rEnhStrip]);
row('en-credit', S5, `${enh()}; note the credit balance (Mine › My Credits)`, ['Enhance the batch and tap ✓', 'Open Mine › My Credits'], 'The balance is the same as before: batch AI Enhance charged nothing', 'P1', [rNoCredit]);
row('en-free', S5, `${room(free)}; 「AI Enhance」 open`, 'Tap 「Enhance」', 'The existing Premium IAP page opens at once (no dialog, no one-photo trial)', 'P1', [aIap, rFreeIap]);
pmRow('en-free-x', S5, `${room(free)}; Premium IAP opened from 「Enhance」`, 'Close the IAP page without buying', 'The AI Enhance room shows with nothing enhanced (Q-10)', 'P2', [rIapBack], 'Not stated (Q-10)');
row('en-free-crop', S5, room(free), ['Open 「Crop & Rotate」, tap 「Squre」 › 「All」 › ✓', 'Open 「Adjustment」, set Exposure +20, tap 「All」 › ✓', 'Tap Save'], 'A Free user crops, adjusts and saves all 5 photos with no IAP and no credit', 'P1', [rFree, rNoCredit]);
row('en-pro', S5, enh(20), ['Tap 「Enhance」 › 「Start」', 'Wait until it ends'], 'All 20 photos are enhanced in one run (「Enhancing k / 20」)', 'P1', [rEnhAll, rProc, rMulti]);
if (IOS) row('en-proplus', S5, `${phone}, PhotoDirector signed in, Pro+ tier (Pink › ☰ › [0] IAP › Status = Pro+); ${gal}; Batch Edit Room with 5 photos; 「AI Enhance」 open`, ['Tap 「Enhance」 › 「Start」', 'Wait until it ends'], 'Every photo is enhanced, no IAP, no credit charged (as Pro)', 'P2', [rTiersIos, rEnhAll, rNoCredit]);
pmRow('en-model', S5, `${enh()}; the app log available (log pull)`, ['Enhance the batch', 'Pull the app log'], 'Each request uses the Standard · Portrait enhance (as 10/E Standard · Portrait)', 'P3', [rEnhModel], 'Parked until the log or RD shows the model');

// AI Enhance errors
row('er-partial', S6, `${enh(15)}; some photos made to fail (a failure fixture from RD, or photos the server rejects)`, ['Tap 「Enhance」 › 「Start」', 'Wait until it ends'], 'One message at the end: 「12 completed, 3 failed」 / 「Failed photos are marked with ! on the thumbnails.」 (Design; PM omits 「with !」, Q-12); the failed thumbnails have a red ! at the top right; the button reads 「Retry Failed (3)」', 'P1', [rSummary, rRetry], 'Needs a failure fixture');
row('er-tap', S6, `${enh(15)}; a run ended with 3 failed`, 'Tap a thumbnail with !', 'That photo is shown', 'P2', [rSumTap]);
row('er-close', S6, `${enh(15)}; a run ended with 3 failed`, 'Tap × on the result message', 'The message closes; the ! marks and 「Retry Failed (3)」 stay', 'P3', [rSumClose], 'Design-only ×');
row('er-retry', S6, `${enh(15)}; a run ended with 「12 completed, 3 failed」; the failure fixture lets 2 of 3 succeed`, ['Tap 「Retry Failed (3)」 (the dialog may show first)', 'Wait until it ends'], 'Only the 3 failed photos are processed (「Enhancing k / 3」); the message reads 「14 completed, 1 failed」 and the button 「Retry Failed (1)」; the ! is gone from the 2 that succeeded', 'P1', [rRetry, rRetrySum], 'Needs a failure fixture');
row('er-retry-all', S6, `${enh(15)}; a run ended with 1 failed`, ['Tap 「Retry Failed (1)」', 'Wait until it succeeds'], 'The message and 「Retry Failed」 are gone; every thumbnail is free of !', 'P2', [rRetrySum]);
row('er-offline', S6, `${enh(15)}; Wi-Fi and mobile data controllable`, ['Tap 「Enhance」 › 「Start」', 'Turn off Wi-Fi (and mobile data) after a few photos', 'Wait until it ends'], 'Finished photos stay enhanced; the unfinished get !; the message reads 「X completed, Y failed」 / 「Connection lost. Check your connection and retry.」; the button 「Retry Failed (Y)」', 'P1', [rOffline]);
row('er-offline-retry', S6, `${enh(15)}; a run ended with 「Connection lost…」; still offline`, 'Tap 「Retry Failed (x)」', 'The toast 「No internet connection」 shows and nothing starts', 'P1', [rOfflineRetry]);
row('er-online-retry', S6, `${enh(15)}; a run ended with 「Connection lost…」`, ['Turn Wi-Fi back on', 'Tap 「Retry Failed (x)」 and wait'], 'Only the unfinished photos are processed; the message counts the whole batch', 'P2', [rOfflineRetry, rRetry]);
pmRow('er-mixed', S6, `${enh(15)}; the failure fixture on and Wi-Fi to be turned off mid-run`, ['Tap 「Enhance」 › 「Start」', 'Turn off Wi-Fi after some photos failed', 'Wait until it ends'], 'The counts combine both kinds of failure and the second line reads 「Connection lost. Check your connection and retry.」', 'P2', [rOffline], 'Needs a failure fixture');
row('er-bg', S6, enh(15), ['Tap 「Enhance」 › 「Start」', 'Press Home on the phone after a few photos', 'Wait 30 s and return to PhotoDirector'], 'Progress did not move while away (paused) and continues from the same k after return', 'P1', [rBg]);
// Android risk KP-097 (2026-11-09): Activity re-creation is a separate test from backgrounding.
if (AND) row('er-recreate', S6, `${enh(15)}; Developer options › 「Don't keep activities」 On (turn it Off after the row)`, ['Tap 「Enhance」 › 「Start」', 'Press Home on the phone after a few photos', 'Return to PhotoDirector from Recents'], 'PhotoDirector returns to the batch without a crash: 「Enhancing k / 15」 continues from the same k (as after a plain Home), or, if the batch could not be kept, the Batch Edit Room shows with its photos and no half-applied result', 'P2', [rBg], 'KB risk KP-097 (Activity re-creation is its own test); system setting: needs the user\'s go-ahead in runs');
row('er-kill', S6, enh(15), ['Tap 「Enhance」 › 「Start」', 'Wait until a few photos are done', 'Kill PhotoDirector and open it again'], 'The app opens without the Batch Edit Room; the enhanced results are not kept anywhere (not in the gallery, not in My AI Artwork)', 'P1', [rKill, rArtwork]);
row('er-artwork', S6, `${enh()}; note My AI Artwork's contents`, ['Enhance the batch, tap ✓ and save', 'Open My AI Artwork'], 'No new item from batch AI Enhance is in My AI Artwork', 'P2', [rArtwork]);

// Save
row('sv-saving', S7, room(free, 20), ['Make one edit (Crop & Rotate › 「Squre」 › 「All」 › ✓)', 'Tap Save (download icon, top right)'], '「Saving k / 20」 and 「Please do not leave this page or quit the app.」 with a progress bar show; when k reaches 20 the Batch Save page opens', 'P1', [aSave, aSaved, rSaving]);
row('sv-page', S7, `${edited()}; saved`, 'Look at the Batch Save page', 'A grid of the 5 saved photos under 「Save 5 photos」 (Design; PM 「Saved 5 photos」, Q-13), ‹ top left, Home top right, 「Edit Next Batch」 at the bottom', 'P1', [rSavePage], 'Q-13');
row('sv-files', S7, `${room()}; note the gallery's photo count`, ['On photo 1 only, Adjustment › Exposure +20 › ✓', 'Save', 'Open the gallery'], 'The gallery has 5 new photos (the 4 unedited ones too); the 5 originals are still there unchanged', 'P1', [rNewFiles, rSaveAll]);
row('sv-nozoom', S7, `${edited()}; saved`, 'Tap a thumbnail on the Batch Save page', 'Nothing opens', 'P3', [rSaveNoZoom]);
row('sv-back', S7, `${edited()}; saved`, 'Tap ‹', 'The Batch Edit Room shows with the edits', 'P1', [aSaveBack, rSaveBack]);
row('sv-home', S7, `${edited()}; saved`, 'Tap Home', 'The Launcher shows (no Discard dialog)', 'P1', [aSaveHome, rSaveBack]);
row('sv-next', S7, `${edited()}; saved`, 'Tap 「Edit Next Batch」', 'The Photo Picker opens on 「Batch」 with no photo ticked', 'P1', [aNextBatch, rNextBatch]);
row('sv-next-back', S7, `${edited()}; saved; Photo Picker opened by 「Edit Next Batch」`, 'Tap ‹', 'The Batch Edit Room shows with the earlier photos and edits (not the Launcher)', 'P1', [aNextBack, rNextBatch, ...(IOS ? [rNextBatchIos] : [])]);
row('sv-next-go', S7, `${edited()}; saved; Photo Picker opened by 「Edit Next Batch」`, ['Tap 3 photos', 'Tap 「Next」'], 'A new Batch Edit Room opens with only the 3 new photos and no edits', 'P2', [rNextBatch]);
pmRow('sv-rating', S7, `${room()}; the app's rating dialog due on the next save (RD setting)`, 'Save the batch', 'The rating dialog counts the batch as one save (it shows once, not per photo); the IAP flyer / ads behave as for any save', 'P3', [rRating], 'Parked until RD can set the rating counter');

// Leaving
row('lv-home-clean', S8, room(), 'Tap Home', 'The Launcher shows at once (no dialog)', 'P1', [rHome]);
row('lv-home', S8, edited(), 'Tap Home', '「Discard changes?」 / 「Your edits to these photos will be lost.」 with 「Discard」 and 「Keep Editing」', 'P1', [aHomeD, rHome, rDialog]);
row('lv-home-discard', S8, edited(), ['Tap Home', 'Tap 「Discard」'], 'The Launcher shows; opening Edit › Batch again starts with no photos and no edits', 'P1', [rHome]);
row('lv-keep', S8, edited(), ['Tap Home', 'Tap 「Keep Editing」'], 'The dialog closes; the Batch Edit Room keeps every edit', 'P1', [aKeep, rKeep]);
row('lv-repl-clean', S8, room(), 'Tap Replace photo (photo icon at the top left)', 'The Photo Picker opens on 「Batch」 at once, with the 5 photos still ticked', 'P1', [rReplace]);
row('lv-repl', S8, edited(), ['Tap Replace photo', 'Tap 「Discard」'], 'The dialog shows first; after 「Discard」 the Photo Picker opens on 「Batch」 with the 5 photos still ticked', 'P1', [aReplD, aDiscard, rReplace, rDialog]);
row('lv-repl-next', S8, edited(), ['Tap Replace photo › 「Discard」', 'Tap 「Next」'], 'The Batch Edit Room opens with the same 5 photos and none of the earlier edits', 'P1', [aNext7, rReplace]);
row('lv-repl-keep', S8, edited(), ['Tap Replace photo', 'Tap 「Keep Editing」'], 'The Batch Edit Room keeps every edit', 'P2', [rKeep]);

// Modes, tracking
row('mode-light', S9, `${room()}; the phone in Light appearance`, 'Open the picker, the Batch Edit Room, each room, the dialog and the Batch Save page', 'Every screen shows the light design', 'P3', [rModes], 'Q-14');
row('mode-dark', S9, `${room()}; the phone in Dark appearance`, 'Open the picker, the Batch Edit Room, each room, the dialog and the Batch Save page', 'Every screen shows the dark design', 'P3', [rModes], 'Q-14');
pmRow('trk-enter', S10, `${free}; ${gal}; the app's analytics events visible (log pull or RD event viewer)`, pick(3), 'The new batch-enter event is sent once (name in Xxx_Yyy_Zzz form, parameters snake_case)', 'P3', [rEvEnter, rEvNames], 'Name to be set; parked until an event log is available');
pmRow('trk-gen', S10, `${enh()}; analytics events visible`, 'Enhance the batch', 'GenAI_Feature_Generate is sent 5 times, each with from = BatchEdit and batch_size = 5', 'P3', [rEvGen, rEvNames], 'Parked until an event log is available');
pmRow('trk-save', S10, `${edited()}; analytics events visible`, 'Save the batch', 'Photo_Result_Save is sent for the batch save', 'P3', [rEvSave], 'Parked until an event log is available');
pmRow('trk-next', S10, `${edited()}; saved; analytics events visible`, 'Tap 「Edit Next Batch」', 'The new Edit Next Batch click event is sent', 'P3', [rEvNext], 'Name to be set; parked until an event log is available');

// Android system Back
if (AND) {
  const sb = (key: string, where: string, exp: string, refs: string[] = []) => row(key, S11, `${free}; ${gal}; ${where}`, 'Press system Back', exp, 'P2', [rSysBack, ...refs]);
  sb('sb-picker', 'Photo Picker open on 「Batch」 with 3 photos ticked', 'The Launcher shows (as ‹)', [aPickBack]);
  sb('sb-room-clean', 'Batch Edit Room with 5 photos, no edit', 'The Launcher shows, as Home with no edit (spec silent on Back, Q-15)');
  sb('sb-room', 'Batch Edit Room with one edit', '「Discard changes?」 shows, as Home (Q-15)');
  sb('sb-dialog', '「Discard changes?」 shown over the Batch Edit Room', 'The dialog closes and the edits stay (as 「Keep Editing」)');
  sb('sb-crop', '「Crop & Rotate」 open with 「Squre」 tapped', 'The Batch Edit Room shows without the change (as ✕)', [rRoomX]);
  sb('sb-adj', '「Adjustment」 open with Exposure +20', 'The Batch Edit Room shows without the change (as ✕)', [rRoomX]);
  sb('sb-curve', '「Adjustment」 › Color › Curve open', 'The Curve panel or the room closes as its ✕ does; nothing is applied (Q-15)');
  sb('sb-enh', '「AI Enhance」 open (Pro account), nothing run', 'The Batch Edit Room shows (as ✕)');
  sb('sb-confirm', '「Enhance 5 photos?」 shown (Pro account)', 'The dialog closes and nothing is processed (as 「Cancel」)');
  sb('sb-proc', 'Batch AI Enhance running (Pro account)', 'Nothing happens: processing cannot be left or cancelled');
  sb('sb-saving', '「Saving k / N」 shown', 'Nothing happens: the save is not interrupted (「Please do not leave this page」)');
  sb('sb-save', 'Batch Save page open', 'The Batch Edit Room shows (as ‹)');
  sb('sb-next', 'Photo Picker opened by 「Edit Next Batch」', 'The Batch Edit Room shows with its edits (as ‹)');
  sb('sb-iap', 'Premium IAP opened from 「Enhance」 (Free account)', 'The IAP page closes and the AI Enhance room shows (as its ✕)');
  sb('sb-px', '「Crop & Rotate」 size input (✎) open with the keyboard up', 'The keyboard closes first; a second Back closes the input');
}

// ---------------------------------------------------------------- ids, grids, output
const id = new Map<string, string>();
rows.forEach((r, i) => id.set(r.key, `TC-${String(i + 1).padStart(3, '0')}`));
const T = (...keys: string[]) => keys.map(k => { const v = id.get(k); if (!v) throw new Error(`no row ${k} on ${P}`); return v; }).join(', ');
const used = new Set(rows.flatMap(r => r.refs));
for (const r of R) if (!/NOT TESTABLE/.test(r.text) && !used.has(r.id)) throw new Error(`${r.id} has no row`);

const q = (n: number, text: string) => `- Q-${n} ${text}`;
const questions = [
  q(1, `Photo Picker bottom copy. The Design (261104) shows 「Select 1 to 20 photos to continue.(10/20)」 and 「Next」; the PM mockups show 「Select 1 to 20 photos.」, 「3 selected (max 20)」 and 「Done」. Assumption: the Design copy (${rCount}; ${T('pk-order')}).`),
  q(2, `The Design picker shows the picked photos in a row above 「Next」, each with ×; the PM does not mention it. Does × untick the photo, and are the numbers redone? Assumption: × unticks and the others renumber (${rStripPick}; ${T('pk-x')}).`),
  q(3, `The 「Batch Editing」 Launcher shortcut and deeplink phd://navigate/page?name=batch_edit: the PM draws the Launcher only and notes the icon is still to be designed; where do they land? Assumption: the Photo Picker on 「Batch」 (${rShortcut}; ${T('sc-shortcut', 'sc-deeplink')}).`),
  q(4, `Batch Edit Room top bar: the PM says Save unchanged and Settings rightmost; the Design adds a feedback icon. What do Settings and the feedback icon open in batch? Assumption: the existing save settings and feedback page (${rTopBar}, ${rSettings}, ${rFeedback}; ${T('rm-settings', 'rm-feedback')}).`),
  q(5, `Crop size input: the PM gives the range (238 px to the original) and 「超出跳 toast」 but no toast copy (Meitu: 「Width and height exceed the range」). Assumption: a toast, copy not asserted (${rPx}; ${T('cr-px', 'cr-px-low')}).`),
  q(6, `Crop Apply to all placement: the PM UI board (DR-07) says the other photos' boxes are centred; the newer crop rule board (「✅ 結論」) says they take the largest box at the current photo's relative position. Assumption: the crop rule board (${rCropMax}; ${T('cr-cur', 'cr-left', 'cr-down')}).`),
  q(7, `The Design draws ‹ (Crop & Rotate) and ⓘ (Adjustment) at the top left of the batch rooms; the spec does not say what they do. Assumption: ‹ = ✕ and ⓘ opens the existing help (${rCropBack}, ${rInfo}; ${T('cr-back', 'ad-info')}).`),
  q(8, `AI Exposure in batch Adjustment: the PM says it is not shown (DR-06); the Design (261104) draws 「AI Exposure」 in the tool row. The dates cannot tell which is newer. Assumption: the Design, checked on device (${rAdjLook}; ${T('ad-open')}).`),
  q(9, `「Enhance {xx} photos?」: is {xx} the batch size, or only the photos not yet enhanced / still failed (Retry)? Assumption: the batch size, and the failed count on Retry (${rConfirm}; ${T('en-dialog', 'er-retry')}).`),
  q(10, `Closing the Premium IAP page opened from batch 「Enhance」: where does the user land? Spec silent. Assumption: back in the AI Enhance room with nothing enhanced (${rIapBack}; ${T('en-free-x')}).`),
  q(11, `AI Enhance room ✕ after a finished Enhance: are the results kept (they apply when done, DR-10) or dropped as a room ✕ (DR-05c)? Assumption: not asserted; the run records it (${rEnhX}; ${T('en-x')}).`),
  q(12, `Result message second line: the Design says 「Failed photos are marked with ! on the thumbnails.」; the PM UI board says 「Failed photos are marked on the thumbnails.」 (its flow board has the Design wording). Assumption: the Design (${rSummary}; ${T('er-partial')}).`),
  q(13, `Batch Save page title: the Design says 「Save 12 photos」; the PM says 「Saved 12 photos」. Assumption: the Design wording, the count as the batch size (${rSavePage}; ${T('sv-page')}).`),
  q(14, `Light and dark: the Design draws every screen in both; does the app follow the system appearance? Assumption: the system appearance (${rModes}; ${T('mode-light', 'mode-dark')}).`),
  q(16, `Adjustment strip in Curve / HSL: the PM rule (D1-12) and the Design (261104) hide the strip while Curve / HSL is open; the PM draft board 「提案 · Adjustment 縮圖列」 shows RD's current build (「RD 實作提案一」) keeping the strip with a blank bar and ﹀, and two proposals (smaller strip; hide while dragging; ﹀ in the strip) marked 「尚未寫進 spec」. Assumption: the PM rule and the Design (${rCurve}, ${rCurveBack}; ${T('ad-curve', 'ad-curve-back')}).`),
  q(17, `Credit pill and History in the AI Enhance room: the PM mockups (pm-ui-5) and the Design's Discard dialog frame show a credit pill (「182」 / 「100」) and a History icon at the top right, while batch AI Enhance charges nothing (DR-11) and the Design's own AI Enhance frames draw no top bar. Are they shown, and what do they open? Assumption: not asserted; only the 「Enhance」 button and the dialog are held to 「no price」 (${rNoCredit}; ${T('en-open', 'en-credit')}).`),
  ...(AND ? [q(15, `Android system Back on the Batch Edit Room, the Curve / HSL panel and other batch screens is not stated. Assumption: as the screen's own ‹ / Home / ✕ (${rSysBack}; ${T('sb-room-clean', 'sb-room', 'sb-curve')}).`)] : []),
];

const grid = (head: string[], lines: string[][]) => [`| ${head.join(' | ')} |`, `|${head.map(() => '---').join('|')}|`, ...lines.map(l => `| ${l.join(' | ')} |`)].join('\n');
const jobs = grid(['Job', 'Start / loading', 'Success', 'Failure', 'Retry', 'Second failure', 'Partial', 'Stop', 'Leave and return', 'Longest wait', 'Done notice'], [
  ['Batch AI Enhance', T('en-start'), T('en-done'), T('er-partial', 'er-offline'), T('er-retry', 'er-online-retry'), T('er-offline-retry'), T('er-partial', 'er-retry'), 'n/a (no cancel: D1-03)', T('er-bg', 'er-kill'), T('en-pro'), T('en-done')],
  ['Batch save', T('sv-saving'), T('sv-page', 'sv-files'), 'n/a (spec silent)', 'n/a (spec silent)', 'n/a (spec silent)', 'n/a (spec silent)', 'n/a (cannot be stopped)', AND ? T('sb-saving') : 'n/a (spec silent: 「Please do not leave this page」)', T('sv-saving'), T('sv-page')],
  ['Apply to all (Crop, Adjustment)', 'n/a (no loading drawn)', T('cr-all', 'ad-all'), 'n/a (spec silent)', 'n/a (spec silent)', 'n/a (spec silent)', 'n/a (spec silent)', T('cr-undo-all'), T('cr-x', 'ad-x'), 'n/a (spec silent)', T('cr-all', 'ad-all')],
]);
const errs = grid(['Job', 'Error classes'], [
  ['Batch AI Enhance', `failed photo ${T('er-partial', 'er-retry')}; connection lost ${T('er-offline', 'er-offline-retry')}; both ${T('er-mixed')} (no numbered classes in the spec)`],
  ['Batch save', 'n/a (spec names no error classes)'],
]);
const exitHead = AND ? ['Stage', 'Home', 'Replace photo', 'Room ✕ / ‹', 'System Back', 'Background / kill'] : ['Stage', 'Home', 'Replace photo', 'Room ✕ / ‹', 'Background / kill'];
const ex = (stage: string, home: string, repl: string, x: string, sys: string, kill: string) => AND ? [stage, home, repl, x, sys, kill] : [stage, home, repl, x, kill];
const exits = grid(exitHead, [
  ex('Batch Edit Room, no edit', T('lv-home-clean'), T('lv-repl-clean'), 'n/a (no room open)', AND ? T('sb-room-clean') : '', 'n/a (spec silent)'),
  ex('Batch Edit Room, with edits', T('lv-home', 'lv-home-discard', 'lv-keep'), T('lv-repl', 'lv-repl-keep'), 'n/a (no room open)', AND ? T('sb-room', 'sb-dialog') : '', T('er-kill')),
  ex('Crop & Rotate room', 'n/a (no Home in the room)', 'n/a (no Replace in the room)', T('cr-x', 'cr-back'), AND ? T('sb-crop') : '', 'n/a (spec silent)'),
  ex('Adjustment room', 'n/a (no Home in the room)', 'n/a (no Replace in the room)', T('ad-x'), AND ? T('sb-adj', 'sb-curve') : '', 'n/a (spec silent)'),
  ex('AI Enhance room, idle', 'n/a (no Home in the room)', 'n/a (no Replace in the room)', T('en-x'), AND ? T('sb-enh', 'sb-confirm') : '', 'n/a (nothing running)'),
  ex('AI Enhance processing', 'n/a (screen locked)', 'n/a (screen locked)', T('en-lock'), AND ? T('sb-proc') : '', T('er-bg', 'er-kill')),
  ex('Saving', 'n/a (screen locked)', 'n/a (screen locked)', 'n/a (no ✕)', AND ? T('sb-saving') : '', 'n/a (spec silent)'),
  ex('Batch Save page', T('sv-home'), 'n/a (no Replace)', T('sv-back'), AND ? T('sb-save') : '', 'n/a (spec silent)'),
  ex('Photo Picker from Edit Next Batch', 'n/a (no Home)', 'n/a', T('sv-next-back'), AND ? T('sb-next') : '', 'n/a (spec silent)'),
]);
const hidden = grid(['Requirement', 'Hidden clause', 'Observed through', 'Rows'], [
  [rNoCredit, 'no credit is charged for batch AI Enhance', 'the credit balance before and after (Mine › My Credits)', T('en-credit')],
  [rEnhModel, 'each request runs the Standard · Portrait enhance', 'the app log after a log pull; parked until it names the model', T('en-model')],
  [rKill, 'finished AI Enhance results are not kept after a kill', 'the gallery and My AI Artwork after reopening', T('er-kill')],
  [rArtwork, 'Standard results are not saved to My AI Artwork', 'My AI Artwork after a batch save', T('er-artwork', 'er-kill')],
  [rNewFiles, 'originals are not overwritten', 'the gallery: the originals are unchanged and new files added', T('sv-files')],
  [rSaveAll, 'unedited photos are saved too', 'the gallery count after a save', T('sv-files')],
  [rRating, 'a batch save counts as one save for the rating dialog', 'the rating dialog with RD\'s counter set; parked', T('sv-rating')],
  [rEvEnter, 'the analytics event is sent', 'the analytics event log; parked until available', T('trk-enter')],
  [rEvGen, 'one event per photo with from and batch_size', 'the analytics event log; parked', T('trk-gen')],
  [rEvSave, 'the analytics event is sent', 'the analytics event log; parked', T('trk-save')],
  [rEvNext, 'the analytics event is sent', 'the analytics event log; parked', T('trk-next')],
  [rRetry, 'only the failed photos are redone', '「Enhancing k / x」 counts only the failed photos; the others keep their result', T('er-retry')],
  [rOfflineRetry, 'offline Retry does not start', 'no 「Enhancing」 progress appears and the counts stay', T('er-offline-retry')],
  [rBg, 'the batch pauses in the background', '「Enhancing k / N」 before and after returning', T('er-bg')],
]);
const variantsList: string[][] = [
  [rAll, 'room=Crop & Rotate', T('cr-all')], [rAll, 'room=Adjustment', T('ad-all', 'ad-auto')],
  [rAllOn, 'room=Crop & Rotate', T('cr-all-on', 'cr-all')], [rAllOn, 'room=Adjustment', T('ad-all')],
  [rAllSwitch, 'room=Crop & Rotate', T('cr-all-switch')], [rAllSwitch, 'room=Adjustment', T('ad-switch')],
  [rAllUndo, 'room=Crop & Rotate', T('cr-undo-all')], [rAllUndo, 'room=Adjustment', T('ad-undo', 'ad-redo')],
  [rAllToast, 'room=Crop & Rotate', T('cr-all')], [rAllToast, 'room=Adjustment', T('ad-all')],
  [rRoomX, 'room=Crop & Rotate', T('cr-x')], [rRoomX, 'room=Adjustment', T('ad-x')],
  [rRoomOk, 'room=Crop & Rotate', T('cr-ok')], [rRoomOk, 'room=Adjustment', T('ad-ok')],
  [rRoomHist, 'room=Crop & Rotate', T('cr-undo-single', 'cr-undo-all')], [rRoomHist, 'room=Adjustment', T('ad-undo')],
  [rCropMax, 'ratio=Squre (fixed)', T('cr-cur', 'cr-left', 'cr-down')], [rCropFree, 'ratio=Free (Custom)', T('cr-free', 'cr-unlinked')],
  [rCropOrig, 'ratio=Original', T('cr-orig')], [rCropSame, 'ratio=same as the photo', T('cr-same')],
  [rCropRot, 'rotate 90°', T('cr-rotate')], [rCropRot, 'flip horizontal', T('cr-rotate')], [rCropRot, 'flip vertical', T('cr-flipv')], [rCropRot, 'fine angle', T('cr-angle')],
  [rLinked, 'width / height linked', T('cr-linked')], [rLinked, 'width / height unlinked', T('cr-unlinked')],
  [rPx, 'above the original', T('cr-px')], [rPx, 'below 238 px', T('cr-px-low')], ...(AND ? [[rPx, 'keyboard up (edge-to-edge)', T('cr-px-kbd')], [rCropPx, 'photo over 1600 px, crop then Adjustment', T('cr-chain-large')], [rBg, 'Activity re-created (Don\'t keep activities)', T('er-recreate')]] : []),
  [rFree, 'tier=Free (Crop, Adjustment, save)', T('en-free-crop', 'pk-20-next')],
  [rFree, IOS ? 'tier=Pro' : 'tier=Pro (VIP)', T('en-done', 'en-ok')],
  [rFreeIap, 'tier=Free', T('en-free')], [rFreeIap, IOS ? 'tier=Pro (dialog, no IAP)' : 'tier=Pro (VIP: dialog, no IAP)', T('en-dialog')], [rEnhAll, IOS ? 'tier=Pro' : 'tier=Pro (VIP)', T('en-done', 'en-pro')],
  ...(IOS ? [[rTiersIos, 'tier=Pro', T('en-done')], [rTiersIos, 'tier=Pro+', T('en-proplus')]] : []),
  [rSameTabs, 'entry=Launcher Edit', T('pk-open')], [rSameTabs, 'entry=AI Enhance shortcut', T('sc-open')],
  [rMulti, 'photos=1 (Batch)', T('pk-one')], [rMulti, 'photos=20', T('pk-20-next', 'en-pro')], [rMulti, 'photos=21', T('pk-20')],
  [rHome, 'no edit', T('lv-home-clean')], [rHome, 'with edits', T('lv-home', 'lv-home-discard')],
  [rReplace, 'no edit', T('lv-repl-clean')], [rReplace, 'with edits', T('lv-repl', 'lv-repl-next')],
  [rOffline, 'connection lost only', T('er-offline')], [rOffline, 'failures and connection lost', T('er-mixed')],
  [rModes, 'appearance=Light', T('mode-light')], [rModes, 'appearance=Dark', T('mode-dark')],
  [rShortcut, 'Launcher shortcut', T('sc-shortcut')], [rShortcut, 'deeplink', T('sc-deeplink')],
];
const variants = grid(['Requirement', 'Variant', 'Rows'], variantsList);
const arrowsWalked = R.filter(r => /flow arrow/.test(r.src)).map(r => `- ${r.id} [${r.src}] ${r.text}. Walked by: ${[...new Set(rows.filter(x => x.refs.includes(r.id)).map(x => id.get(x.key)))].join(', ')}.`);
const na = (r: string) => `n/a (${r})`;
const domain = grid(['Entry', 'Requirements'], IOS ? [
  ['KP-013', rTiersIos],
  ['KP-016', na('no one-time free trial in batch: a Free user gets the IAP page, D3-01')],
] : [
  ['KP-012', `${rFreeIap}, ${rEnhAll} (Pro = VIP, the Android paid mode)`],
  ['KP-014', `${rAdjLook} (AI Exposure in batch Adjustment is Q-8)`], ['KP-015', na('no purchase is made in this table')], ['KP-016', na('no one-time free trial in batch')],
  ['KP-017', na('batch AI Enhance charges no credits')], ['KP-018', na('no Credit Auto Pass')], ['KP-019', na('no credit charge, so no double charge; the dialog guards repeated taps')],
  ['KP-020', na('no credit button in batch')], ['KP-021', na('no chat quota')], ['KP-024', `${rArtwork} (batch Standard results are kept out of My AI Artwork by the spec, D1-10)`],
  ['KP-025', na('AI Exposure results are not generated in batch')], ['KP-026', na('no History button in batch')], ['KP-027', `${rArtwork} (the spec keeps batch results out of My AI Artwork)`],
  ['KP-028', na('Artwork filters not touched')], ['KP-029', na('no long-task tile or notification in batch')], ['KP-030', `${rCropPx}, ${rNewFiles}`],
  ['KP-032', na('Batch Edit is not opened from the Edit Room')], ['KP-033', na('no banner; the deeplink names no style')], ['KP-034', na('no Discover tip')],
  ['KP-035', na('AI Replace only')], ['KP-036', na('no prompt')], ['KP-037', na('AI Try-On only')], ['KP-038', na('AI Group Shot only')],
  ['KP-039', na('no agent job')], ['KP-040', `${rCropLook} (Crop tabs as the existing room)`], ['KP-041', `${rRoomHist}, ${rOuterUndo}`], ['KP-042', `${rAllUndo}, ${rCropUndoAll}`],
  ['KP-043', na('video only')], ['KP-044', `${rRoomX}, ${rRoomOk} (the rooms' ✕ discards and ✓ commits, as the spec states)`], ['KP-045', na('audio only')], ['KP-046', na('Try-On / Hairstyle only')],
  ['KP-047', na('no masks')], ['KP-048', na('the spec gives no Arabic strings')], ['KP-049', `${rAllToast}, ${rProc}, ${rSummary}, ${rSaving} (「Applied to x photos」, 「Enhancing k / N」, 「X completed, Y failed」, 「Saving k / N」 carry numbers)`],
  ['KP-050', na('the spec gives no RTL layout; checked in a localisation pass')],
  ['KP-068 (risk)', `${rCropPx} (the large-photo variant uses a long edge over 1600 px)`], ['KP-082 (risk)', `${rCropPx}, ${rSaveAll} (crop → Adjustment → Save checked in the file)`],
  ['KP-097 (risk)', `${rBg} (Activity re-creation variant)`], ['KP-099 (risk)', `${rPx} (size fields above the keyboard)`],
]);
const ledger = grid(['Ledger entry', 'Requirements'], [['REQ-009', `${rWhere}, ${rTabs} … every requirement (new feature from the PM and Design Figma)`]]);
const sysBack = AND ? '\n### System back\n\n' + grid(['Screen', 'Rows'], [
  ['Photo Picker (Launcher Edit, AI Enhance shortcut)', T('sb-picker')], ['Batch Edit Room (no edit / with edits)', T('sb-room-clean', 'sb-room')],
  ['「Discard changes?」 dialog', T('sb-dialog')], ['Crop & Rotate room', T('sb-crop')], ['Crop size input with keyboard', T('sb-px')], ['Adjustment room', T('sb-adj')],
  ['Curve / HSL panel', T('sb-curve')], ['AI Enhance room', T('sb-enh')], ['AI Enhance Confirm Dialog', T('sb-confirm')],
  ['AI Enhance processing', T('sb-proc')], ['Saving', T('sb-saving')], ['Batch Save page', T('sb-save')],
  ['Photo Picker from Edit Next Batch', T('sb-next')], ['Premium IAP', T('sb-iap')],
  ['Single Edit Room', 'n/a (existing screen, unchanged)'], ['Launcher', 'n/a (existing screen)'],
]) + '\n' : '';

const secs = [...new Set(R.map(r => r.sec))];
const body = secs.map(s => `## ${s}\n` + R.filter(r => r.sec === s && !/flow arrow/.test(r.src)).map(r => `- ${r.id} [${r.src}] ${r.text}`).join('\n')).filter(s => /\n- /.test(s)).join('\n\n');
const md = `# Batch Editing — requirements (${P})
Spec: Batch Editing - PM and Design Figma.md (Figma-only spec set 2026-11-09: PM page 0:1 「26'11/E Batch editing: AI enhance, crop & rotate, adjustments」, Design page 12:2321 「261104_design」)

Source order: Design (page dated 261104) over PM, except where a PM rule is newer or more specific (the 「✅ 結論」 crop rule board, the TBD Q1 / Q2 decisions of 10/30) (analysis.md pass 7). Decision ids in brackets ([D1-07], [DR-04]) are the PM's own. The draft boards 「Apply to all · icon options」 and 「提案 · Adjustment 縮圖列」 are proposals the PM marks as not in the spec yet; the 「Reference」 section is competitor material.

${body}

## Open questions
${questions.join('\n')}

## Added 2026-11-09 — coverage passes and standing inputs

### Job states

${jobs}

### Error classes

${errs}

### Exit × stage

${exits}

### Hidden clauses

${hidden}

### Variants

${variants}

### Flow arrows walked by existing rows
${arrowsWalked.join('\n')}
${sysBack}
### Domain rules

${domain}

### Request ledger coverage

${ledger}
`;
writeFileSync(join(OUT, 'requirements.md'), md);

const csvq = (s: string) => /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
const lines = ['ID,Section,Precondition,Action,Expected Result,Priority,Spec Ref,Notes,Change,Change Reason'];
for (const r of rows) {
  const notes = [r.notes, r.pm ? PMONLY : ''].filter(Boolean).join('. ');
  lines.push([id.get(r.key)!, r.sec, r.pre, r.act, r.exp, r.pri, r.refs.join(', '), notes, 'new', REASON].map(csvq).join(','));
}
writeFileSync(join(OUT, 'draft.csv'), lines.join('\n') + '\n');
writeFileSync(join(OUT, 'row-keys.json'), JSON.stringify(Object.fromEntries(id), null, 1) + '\n');
console.log(`${P}: ${R.length} requirements, ${rows.length} rows`);
