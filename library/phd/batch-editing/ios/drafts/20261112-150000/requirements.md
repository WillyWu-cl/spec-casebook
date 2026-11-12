# Batch Editing — requirements (ios)
Spec: Batch Editing - PM and Design Figma.md (Figma-only spec set 2026-11-09: PM page 0:1 「26'11/E Batch editing: AI enhance, crop & rotate, adjustments」, Design page 12:2321 「261104_design」)

Re-read 2026-11-11 (REQ-011): five boards changed (pm-flow-1, pm-ui-4, the dark Design entry / adjust / enhance boards); the only rule change is DR-05g (R-067).

Source order: Design (page dated 261104) over PM, except where a PM rule is newer or more specific (the 「✅ 結論」 crop rule board, the TBD Q1 / Q2 decisions of 10/30) (analysis.md pass 7). Decision ids in brackets ([D1-07], [DR-04]) are the PM's own. The draft boards 「Apply to all · icon options」 and 「提案 · Adjustment 縮圖列」 are proposals the PM marks as not in the spec yet; the 「Reference」 section is competitor material.

## Entry and Photo Picker
- R-001 [PM:pm-flow-1 D0-04, D0-04b; PM:pm-ui-1 DR-01b] Batch Edit is reached only from the Photo Picker of Launcher 「Edit」 and of the AI Enhance shortcut (and the Batch Editing shortcut); the single-photo Edit Room has no batch button
- R-002 [PM:pm-flow-1 D0-07, D0-06, DR-03; PM:pm-header D0-03] Batch Edit offers only three tools that apply one setting to every photo: Crop & Rotate, Adjustment and AI Enhance (no Filter or Preset)
- R-003 [PM:pm-flow-1 D0-08, D5-01b; PM:pm-tbd Q2; PM:pm-credit DR-11] Batch Edit is free on day 1: a Free user can open it, use Crop & Rotate and Adjustment and save, with the 20-photo limit; it is not locked to Premium
- R-004 [DS:design-light-entry 「photo_picker」 13:2380; PM:pm-ui-1 DR-01b] The Photo Picker has a 「Single」 / 「Batch」 switch at the top, and it opens on 「Single」 every time
- R-005 [PM:pm-ui-1 DR-13] With 「Single」, picking one photo opens the existing single-photo Edit Room as today
- R-006 [PM:pm-ui-1 DR-01b, D0-04b; PM:pm-flow-4] The Launcher 「Edit」 picker and the AI Enhance shortcut picker have the same Single / Batch switch
- R-007 [PM:pm-ui-1 DR-01] Only 「Batch」 allows several photos, at most 20 on both platforms
- R-008 [DS:design-light-entry 13:2380; PM:pm-ui-1 D2-01] Picked photos show their pick order 1, 2, 3… on the thumbnails, and the Batch Edit Room lists them in that order
- R-009 [DS:design-light-entry 13:2380; PM:pm-ui-1 DR-01] The picker bottom shows the count and 「Next」: Design 「Select 1 to 20 photos to continue.(10/20)」 (PM mockups: 「Select 1 to 20 photos.」, 「3 selected (max 20)」, 「Done」; Q-1)
- R-010 [DS:design-light-entry 13:2380] The Design picker shows the picked photos in a row above 「Next」, each with ×; tapping × removes that photo from the selection (Design-only, Q-2)
- R-011 [PM:pm-ui-1 DR-01] Picking a 21st photo is refused with the toast 「Please pick at most 20 photos.」
- R-012 [PM:pm-ui-1 DR-01b, DR-13; PM:pm-flow-5] With 「Batch」 and only one photo picked, Next / Done opens the single-photo Edit Room
- R-013 [PM:pm-flow-5 D1-08c; PM:pm-ui-1 D1-08c] In the single-photo Edit Room, Replace photo opens the Photo Picker, where switching to 「Batch」 leads to Batch Edit
- R-014 [PM:pm-flow-1 row 8, 410:4074, 410:4076] The Launcher has a 「Batch Editing」 shortcut (icon still to be designed, Q-3) that opens Batch Edit; deeplink phd://navigate/page?name=batch_edit opens it too (where it lands: Q-3)
- R-023 [PM:pm-ui-5 DR-02] From the AI Enhance shortcut, several photos land directly in the batch AI Enhance room (not the Batch Edit Room main screen)

## Batch Edit Room
- R-024 [DS:design-light-entry 「canvas_img_focus」 13:2826; PM:pm-ui-2 D1-11, D1-01] The Batch Edit Room looks like the Edit Room; its bottom has only three buttons, in this order: 「Crop & Rotate」, 「Adjustment」, 「AI Enhance」; the picker opens it on this main screen
- R-025 [DS:design-light-entry 13:2826; PM:pm-ui-2 D1-11] The top bar has Home and Replace photo on the left and Save (download) and Settings on the right (Settings rightmost); the Design also draws a feedback icon (Q-4)
- R-026 [PM:pm-ui-2 D1-11] Settings (rightmost) opens the existing save settings, as in the Edit Room (Q-4)
- R-027 [DS:design-light-entry 13:2826; PM:pm-ui-2 D1-12, D1-09] A thumbnail strip on the main screen lists the batch; tapping a thumbnail shows that photo; photos cannot be removed or added (no × on the thumbnails)
- R-028 [PM:pm-ui-2 DR-05, DR-05d] The main screen's Undo / Redo keep one history per photo and act only on the photo shown; what one room visit changed on a photo is one step in that photo's history
- R-029 [PM:pm-ui-2 DR-10b, DR-12e] Undo on a photo can take it back to before AI Enhance (that photo only) and Redo brings the result back; once that photo is edited after the Undo, Redo is cleared and the result cannot be restored (Enhance can be run again)
- R-030 [DS:design-light-entry 13:2826 「editing_area/btn_BA_n」] The compare button at the bottom right of the photo shows the current photo before its edits while held (as in the Edit Room)
- R-031 [DS:design-light-entry 13:2826 「round/ic_feedback」] The feedback icon in the top bar opens the app's existing feedback page (Design-only, Q-4)

## Crop & Rotate
- R-032 [DS:design-light-entry 「3_」 22:2798; PM:pm-ui-3 D1-11, DR-03] The batch Crop & Rotate room is the existing Crop & Rotate room without a panel title bar: top ‹, the photo's size 「W x H ✎」 and 「All」; the angle slider; 「Rotate」, 「Flip」, 「Flip Vertically」, 「Original」, 「Custom」 and the ratios (「Squre」, 「2:3」, 「3:2」, 「3:4」…); ✕, ↶, ↷, ✓ at the bottom; the thumbnail strip above the slider
- R-033 [PM:pm-ui-3 D1-11] The top shows the current photo's output size 「W x H」; switching photos shows that photo's size
- R-034 [PM:pm-ui-3 D1-11; PM:pm-crop-apply-rule C12] Tapping ✎ allows typing the size in px, from 238 px up to that photo's original width / height; a value out of range shows a toast and is not applied (toast copy: Q-5)
- R-035 [PM:pm-ui-3 D1-11, DR-04; PM:pm-crop-apply-rule] After a typed px size, Apply to all copies only the ratio to the other photos, never the px values
- R-036 [PM:pm-ui-3 DR-04] With width and height linked, typing a size keeps the ratio, so 「All」 stays disabled; with them unlinked, the ratio changes to Free (custom) and 「All」 becomes enabled
- R-037 [DS:design-light-entry 22:2798 「All」, 「status」 105:4500; PM:pm-ui-3 DR-04; PM:pm-ui-4 DR-04] Each batch room (Crop & Rotate, Adjustment) has 「All」 (Apply to all) at the top right: an icon and 「All」 on a translucent dark capsule; it is a one-off button, not a checkbox: tapping it applies the current photo's setting of that room to every other photo
- R-038 [DS:「status」 105:4500 (normal / disabled); PM:pm-ui-3 DR-04; PM:pm-ui-4 DR-04] 「All」 is disabled when the room opens and the current photo has no change
- R-039 [PM:pm-ui-3 DR-04; PM:pm-ui-4 DR-04] 「All」 becomes enabled when the current photo has a change not yet applied, and is disabled again once applied, until the current photo changes again
- R-040 [PM:pm-ui-3 DR-04; PM:pm-ui-4 DR-04] Switching photos sets 「All」 by the newly shown photo: enabled only if that photo has a change not yet applied
- R-041 [PM:pm-ui-3 DR-04; PM:pm-ui-4 DR-04] Undo of the Apply-to-all step makes 「All」 enabled again; Redo of it makes 「All」 disabled
- R-042 [DS:design-light-adjust 「adjust」 41:923 「Applied to 11 photos」; PM:pm-ui-3 DR-04, DR-04c; PM:pm-ui-4 DR-04] After 「All」 the room stays open and the toast 「Applied to x photos」 shows, x = the number of photos other than the current one
- R-043 [PM:pm-ui-3 DR-04; PM:pm-ui-4 DR-04] After 「All」 the thumbnail strip shows every photo with the applied result (updated at once)
- R-044 [PM:pm-ui-3 DR-04; PM:pm-ui-4 DR-04] After 「All」 any photo can be shown and adjusted on its own; that adjustment changes only that photo
- R-045 [PM:pm-ui-3 DR-04; PM:pm-ui-4 DR-04, DR-04c] Tapping 「All」 again after a new change applies the current photo's latest setting of the room, as a whole, to every other photo, replacing their own tweaks in that room
- R-046 [PM:pm-crop-apply-rule C1, C5] Choosing a ratio gives the photo the largest box of that ratio, centred (as the single Crop & Rotate room); with Apply to all and the box not moved, every photo gets its own largest box, centred
- R-047 [PM:pm-crop-apply-rule 一] Crop Apply to all keeps the current photo's crop box as the user set it (size and position)
- R-048 [PM:pm-crop-apply-rule 一, 二; PM:pm-ui-3 DR-07] Every other photo gets the largest box of that ratio, placed at the current photo's relative position; only directions with room to move take the position, others are centred (the PM UI board said 「centred」: Q-6)
- R-049 [PM:pm-crop-apply-rule 一] Each photo's output size is worked out from its own original, so the px sizes differ between photos
- R-050 [PM:pm-crop-apply-rule 一] Crop Apply to all replaces the other photos' earlier crops, recomputed from each original
- R-051 [PM:pm-crop-apply-rule 三; PM:pm-ui-3 DR-07] A Free crop is applied as a custom ratio (ratio and relative position), with each other photo at the largest box of that ratio
- R-052 [PM:pm-crop-apply-rule 三, C11] 「Original」 with Apply to all returns every photo to its own original ratio, uncropped
- R-053 [PM:pm-crop-apply-rule 三, C9] A photo whose ratio already equals the applied ratio stays whole (not cropped)
- R-054 [PM:pm-crop-apply-rule 五; PM:pm-ui-3 DR-07] Apply to all copies rotation and flips: 90° rotation and horizontal / vertical flips to every photo; a fine angle copies the same angle, with each photo's box shrunk to avoid black edges from its own size
- R-055 [PM:pm-crop-apply-rule 五; PM:pm-ui-3 DR-05b] One Undo after Apply to all undoes it on every photo; one Redo applies it to every photo again
- R-056 [PM:pm-ui-3 DR-05, DR-05b; PM:pm-ui-4 DR-05, DR-05b] Each batch room has one shared Undo / Redo history of two kinds of step: Apply to all (all photos) and a single parameter edit on one photo; Undo of a single edit changes only the photo it was made on, whichever photo is shown
- R-057 [PM:pm-ui-3 DR-05e; PM:pm-ui-4 DR-05e] Switching photos in a room does not clear its history
- R-058 [PM:pm-ui-3 DR-05h; PM:pm-ui-4 DR-05h] When Undo / Redo changes a photo that is not shown, the room switches to that photo and the strip selects it
- R-059 [PM:pm-ui-3 DR-05c; PM:pm-ui-4 DR-05c] A room's ✕ drops every change made to every photo since the room was opened, Apply to all included
- R-060 [PM:pm-ui-3 DR-05d; PM:pm-ui-4 DR-05d] A room's ✓ returns to the Batch Edit Room keeping the changes (one step per photo in the main screen's history)
- R-061 [PM:pm-ui-3 D1-12; PM:pm-ui-4 D1-12] Each batch room shows the thumbnail strip; tapping a thumbnail switches the current photo
- R-062 [DS:design-light-entry 22:2798 「top/ic_back」; PM:pm-ui-3 D1-11] The Crop & Rotate room's ‹ at the top left leaves the room like ✕ (Q-7)

## Adjustment
- R-065 [DS:design-light-adjust 「adjust」 41:923; PM:pm-ui-4 D1-11, DR-03, DR-06] The batch Adjustment room is the 26'10/E Adjustment room with tabs 「Light」 / 「Color」 / 「Details」, ⓘ at the top left and 「All」 at the top right, the thumbnail strip, ✕ ↶ ↷ ✓; it has no Subject Detection; the Design draws 「AI Exposure」 in the tool row while the PM says it is not shown (Q-8)
- R-066 [PM:pm-ui-4 DR-04, DR-04c] Adjustment Apply to all copies the room's whole setting: photo 1 Exposure +20 → 「All」 → every photo +20; photo 3 Contrast +10; photo 1 Exposure +30 → 「All」 → every other photo matches photo 1 and photo 3 loses its Contrast +10
- R-067 [PM:pm-ui-4 DR-05g, re-read 2026-11-11] Undo / Redo in Adjustment switch to the Light / Color / Details tab of the value they undo or redo (the PM changed this on 2026-11-11 from 「the tab stays」 and cites today's Android single Adjustment room: Q-18)
- R-068 [DS:design-light-adjust 「9_Adjust_curve」 57:6798, 「9_Adjust_HSL」 63:7874; PM:pm-ui-4 D1-12, 31:1833] Opening Color › Curve or HSL hides the thumbnail strip (it cannot be tapped); 「All」 stays shown
- R-069 [DS:design-light-adjust 「9_Adjust_curve_collapse」 128:8508, 「9_Adjust_HSL_collapse」 105:4123; PM:pm-ui-4 D1-12] Collapsing the Curve / HSL panel (﹀) or going back to a slider tool such as Exposure shows the strip again; to switch photos the panel is collapsed first
- R-070 [DS:design-light-adjust 63:7874] HSL has the colour chips and 「Hue」, 「Saturation」, 「Lightness」 sliders as in the single Adjustment room, and Curve has its reset and compare buttons
- R-071 [DS:design-light-adjust 41:923 「top/ic_info」] ⓘ at the top left of the batch rooms opens the existing help for that tool (Design-only, Q-7)

## AI Enhance
- R-075 [DS:design-light-enhance 「Enhance_1」 57:4257; PM:pm-ui-5 DR-09, DR-12a, D1-11] The batch AI Enhance room has no Standard / Advanced tabs and no scenario list: one 「Enhance」 button with 「Maximize detaill and clarity with advanced AI.」 under it, the thumbnail strip above it, ✕ and ✓ at the bottom
- R-076 [PM:pm-ui-5 DR-09d] The batch 「Enhance」 runs the 10/E Standard · Portrait enhance
- R-077 [PM:pm-ui-5 DR-12b, DR-12f, DR-12g, DR-09b, DR-09] Batch has none of the Advanced rules or the seven Advanced scene presets (General, Portrait, Scenery, Pets, Concert, Product, Anime)
- R-078 [PM:pm-ui-5 DR-11, D5-01b; PM:pm-ui-6 DR-11; PM:pm-credit DR-11; PM:pm-tbd Q1] AI Enhance in batch charges no credits: the 「Enhance」 button and the dialog show no price, and the balance does not change; Crop & Rotate and Adjustment are free too
- R-079 [PM:pm-ui-5 DR-10, DR-12h] One 「Enhance」 enhances every photo of the batch, and the results apply when done (no ✓ per photo)
- R-080 [DS:design-light-enhance 57:4625 「Alert」; PM:pm-ui-6 DR-12, DR-12h, D1-02, D1-03] Each tap on 「Enhance」 asks 「Enhance {xx} photos?」 / 「Processing takes a moment and cannot be canceled once started.」 with 「Cancel」 and 「Start」 ({xx} = the photos to enhance, Q-9)
- R-081 [PM:pm-ui-6 DR-12] 「Cancel」 returns to the AI Enhance room with nothing processed; 「Start」 starts the batch
- R-082 [DS:design-light-enhance 57:4892; PM:pm-ui-5 D1-02] While processing, the existing loading screen shows 「Creating Your AI Image」 and 「Enhancing k / N」 (k = done, N = requests) with a progress bar; the mask covers the whole screen, the strip included
- R-083 [PM:pm-ui-5 D1-02, D1-03] While processing nothing else can be done: no Crop / Adjustment, no thumbnail switch, no cancel, no save; the user waits for every photo
- R-084 [PM:pm-ui-5 DR-12e, DR-12h] In one visit of the AI Enhance room 「Enhance」 can be applied once: afterwards the button reads 「Enhanced」 and is greyed
- R-085 [PM:pm-ui-5 DR-12e] Leaving the room and opening it again allows one more Enhance, run on the current (already enhanced) photos
- R-086 [PM:pm-ui-5 DR-12d, D3-01, D3-02; PM:pm-flow-4 151:2352] A Free user's 「Enhance」 opens the existing Premium IAP page at once (no trial of one photo, no dialog)
- R-087 [PM:pm-flow-4 151:2336] Closing the Premium IAP page without buying returns to the AI Enhance room with nothing enhanced (Q-10)
- R-088 [DS:design-light-enhance 57:4257 「✕」] The AI Enhance room's ✕ returns to the Batch Edit Room; whether a finished Enhance is kept is not stated (Q-11)
- R-089 [PM:pm-ui-5 D1-12] The AI Enhance room's thumbnail strip switches the photo shown
- R-090 [KB:KP-013] On iOS the paid modes Pro and Pro+ are distinct; batch AI Enhance works for each paid mode

## AI Enhance errors
- R-098 [DS:design-light-enhance 57:5097; PM:pm-ui-5 D1-04; PM:pm-error-handle D1-04] Failures are summed up once, when every photo is done (no dialog per photo): 「X completed, Y failed」 and 「Failed photos are marked with ! on the thumbnails.」 (Design; PM: 「Failed photos are marked on the thumbnails.」, Q-12); failed thumbnails get a red ! at the top right, successful ones none
- R-099 [PM:pm-ui-5 D1-04] Tapping a failed thumbnail shows that photo
- R-100 [DS:design-light-enhance 57:5097 (× on the message)] The × on the result message closes it (Design-only)
- R-101 [DS:design-light-enhance 57:5097; PM:pm-ui-5 D1-04, DR-12e] The button becomes 「Retry Failed (x)」 (x = failed photos); it redoes only the failed photos, their ! goes, successful photos are not redone; a failed photo does not count as enhanced
- R-102 [PM:pm-ui-5 D1-04] After Retry the summary counts the whole batch: 15 photos, 「12 completed, 3 failed」 → Retry, 2 succeed → 「14 completed, 1 failed」 and 「Retry Failed (1)」; when all have succeeded the message and 「Retry Failed」 are gone
- R-103 [PM:pm-ui-5 D1-05, D1-04; PM:pm-error-handle D1-05] Losing the network counts as failure: finished photos are kept, unfinished ones get !, and the message is 「X completed, Y failed」 / 「Connection lost. Check your connection and retry.」; with both failures and a lost connection the counts are combined and the second line shows the connection message
- R-104 [PM:pm-ui-5 D1-05] 「Retry Failed (x)」 reruns the unfinished photos; tapped while still offline it shows the toast 「No internet connection」 and does not start
- R-105 [PM:pm-error-handle D1-05] Sending the app to the background pauses the batch; it continues on return
- R-106 [PM:pm-error-handle D1-05, D1-10; PM:pm-ui-5 D1-05, D1-10] If the app is killed the Batch Edit Room is gone, and finished AI Enhance results are not kept
- R-107 [PM:pm-ui-7 D1-10; PM:pm-error-handle D1-10] Standard AI Enhance results from batch are not saved to My AI Artwork

## Save
- R-108 [DS:design-light-save 「canvas_img_focus」 57:5666; PM:pm-ui-8 D5-01b] Save shows 「Saving k / N」 with 「Please do not leave this page or quit the app.」 and a progress bar; the Batch Save page opens only when every photo is saved (Design 「Saving 3/20」)
- R-109 [PM:pm-ui-8 D1-06] Each photo is saved as a new file; the originals are not overwritten
- R-110 [PM:pm-ui-8 D1-06] Every photo of the batch is saved, the unedited ones too, each as a new file
- R-111 [DS:design-light-save 「save2」 57:6001; PM:pm-ui-8 D1-07] The Batch Save page shows a grid of the saved photos under 「Save 12 photos」 (Design; PM 「Saved 12 photos」, Q-13), ‹ at the top left, Home at the top right and 「Edit Next Batch」 fixed at the bottom
- R-112 [PM:pm-ui-8 D1-07] The Batch Save page thumbnails do not open (no full view)
- R-113 [PM:pm-ui-8 D1-07] On the Batch Save page ‹ returns to the Batch Edit Room and Home to the Launcher
- R-114 [PM:pm-ui-8 D1-07; PM:pm-flow-7 357:2621] 「Edit Next Batch」 opens the Photo Picker on 「Batch」 with nothing ticked; its ‹ returns to the Batch Edit Room with the earlier edits (day 1 follows the Android single Edit Room on both platforms)
- R-115 [PM:pm-ui-8 D1-07] On iOS this differs from the single Edit Room today (Save page → Next edit → picker ‹ → Launcher): batch follows Android and returns to the Batch Edit Room
- R-116 [PM:pm-ui-8 D1-07] For the rating dialog a batch save counts as one save; IAP flyers and ads show as for any save

## Leaving Batch Edit
- R-123 [PM:pm-ui-2 D1-08; PM:pm-ui-7 D1-08; PM:pm-flow-7] Home with no edit yet goes straight to the Launcher; with edits it asks 「Discard changes?」, and 「Discard」 goes to the Launcher
- R-124 [PM:pm-ui-2 D1-08, D1-08b; PM:pm-ui-7 D1-08, D1-08b] Replace photo with no edit yet goes straight to the Photo Picker on 「Batch」; with edits it asks first and 「Discard」 goes there; either way the earlier photos stay ticked and every edit of this Batch Edit is dropped
- R-125 [DS:design-light-save 「Discard dialog」 110:4532; PM:pm-ui-7 D1-08b] The dialog reads 「Discard changes?」 / 「Your edits to these photos will be lost.」 with 「Discard」 and 「Keep Editing」
- R-126 [PM:pm-ui-7 D1-08] 「Keep Editing」 closes the dialog and stays in the Batch Edit Room with every edit

## Light and dark mode
- R-132 [DS:design-light-entry … design-dark-save (every screen drawn light and dark)] Every Batch Edit screen has a light and a dark design (which one shows: Q-14)

## Tracking
- R-133 [PM:pm-tracking D0-02] Switching the picker to Batch and entering the Batch Edit Room sends a new event (name to be set, e.g. Batch_Edit_Enter)
- R-134 [PM:pm-tracking D4-01] Batch AI Enhance sends GenAI_Feature_Generate once per photo, with from = BatchEdit and batch_size
- R-135 [PM:pm-tracking D0-02] A batch save sends Photo_Result_Save (unchanged event)
- R-136 [PM:pm-tracking D1-07] 「Edit Next Batch」 sends a new click event (name to be set)
- R-137 [PM:pm-tracking D0-02] Event names have three PascalCase parts (Xxx_Yyy_Zzz) and parameters are snake_case, or both platforms drop them

## Open questions
- Q-1 Photo Picker bottom copy. The Design (261104) shows 「Select 1 to 20 photos to continue.(10/20)」 and 「Next」; the PM mockups show 「Select 1 to 20 photos.」, 「3 selected (max 20)」 and 「Done」. Assumption: the Design copy (R-009; TC-005).
- Q-2 The Design picker shows the picked photos in a row above 「Next」, each with ×; the PM does not mention it. Does × untick the photo, and are the numbers redone? Assumption: × unticks and the others renumber (R-010; TC-007).
- Q-3 The 「Batch Editing」 Launcher shortcut and deeplink phd://navigate/page?name=batch_edit: the PM draws the Launcher only and notes the icon is still to be designed; where do they land? Assumption: the Photo Picker on 「Batch」 (R-014; TC-016, TC-017).
- Q-4 Batch Edit Room top bar: the PM says Save unchanged and Settings rightmost; the Design adds a feedback icon. What do Settings and the feedback icon open in batch? Assumption: the existing save settings and feedback page (R-025, R-026, R-031; TC-026, TC-027).
- Q-5 Crop size input: the PM gives the range (238 px to the original) and 「超出跳 toast」 but no toast copy (Meitu: 「Width and height exceed the range」). Assumption: a toast, copy not asserted (R-034; TC-030, TC-031).
- Q-6 Crop Apply to all placement: the PM UI board (DR-07) says the other photos' boxes are centred; the newer crop rule board (「✅ 結論」) says they take the largest box at the current photo's relative position. Assumption: the crop rule board (R-048; TC-040, TC-041, TC-042).
- Q-7 The Design draws ‹ (Crop & Rotate) and ⓘ (Adjustment) at the top left of the batch rooms; the spec does not say what they do. Assumption: ‹ = ✕ and ⓘ opens the existing help (R-062, R-071; TC-055, TC-069).
- Q-8 AI Exposure in batch Adjustment: the PM says it is not shown (DR-06); the Design (261104) draws 「AI Exposure」 in the tool row. The dates cannot tell which is newer. Assumption: the Design, checked on device (R-065; TC-056).
- Q-9 「Enhance {xx} photos?」: is {xx} the batch size, or only the photos not yet enhanced / still failed (Retry)? Assumption: the batch size, and the failed count on Retry (R-080; TC-072, TC-091).
- Q-10 Closing the Premium IAP page opened from batch 「Enhance」: where does the user land? Spec silent. Assumption: back in the AI Enhance room with nothing enhanced (R-087; TC-083).
- Q-11 AI Enhance room ✕ after a finished Enhance: are the results kept (they apply when done, DR-10) or dropped as a room ✕ (DR-05c)? Assumption: not asserted; the run records it (R-088; TC-079).
- Q-12 Result message second line: the Design says 「Failed photos are marked with ! on the thumbnails.」; the PM UI board says 「Failed photos are marked on the thumbnails.」 (its flow board has the Design wording). Assumption: the Design (R-098; TC-088).
- Q-13 Batch Save page title: the Design says 「Save 12 photos」; the PM says 「Saved 12 photos」. Assumption: the Design wording, the count as the batch size (R-111; TC-101).
- Q-14 Light and dark: the Design draws every screen in both; does the app follow the system appearance? Assumption: the system appearance (R-132; TC-118, TC-119).
- Q-18 Adjustment tab on Undo / Redo: the PM changed DR-05g on 2026-11-11 from 「Undo / Redo does not switch the tab, as today's single Adjustment room」 to 「Undo / Redo switches the tab, as today's Android single Adjustment room」. Does the iOS batch room switch the tab too (the iOS single room may not)? Assumption: yes, the batch rule is for both platforms (R-067; TC-061).
- Q-16 Adjustment strip in Curve / HSL: the PM rule (D1-12) and the Design (261104) hide the strip while Curve / HSL is open; the PM draft board 「提案 · Adjustment 縮圖列」 shows RD's current build (「RD 實作提案一」) keeping the strip with a blank bar and ﹀, and two proposals (smaller strip; hide while dragging; ﹀ in the strip) marked 「尚未寫進 spec」. Assumption: the PM rule and the Design (R-068, R-069; TC-065, TC-066).
- Q-17 Credit pill and History in the AI Enhance room: the PM mockups (pm-ui-5) and the Design's Discard dialog frame show a credit pill (「182」 / 「100」) and a History icon at the top right, while batch AI Enhance charges nothing (DR-11) and the Design's own AI Enhance frames draw no top bar. Are they shown, and what do they open? Assumption: not asserted; only the 「Enhance」 button and the dialog are held to 「no price」 (R-078; TC-071, TC-081).

## Added 2026-11-09 — coverage passes and standing inputs

### Job states

| Job | Start / loading | Success | Failure | Retry | Second failure | Partial | Stop | Leave and return | Longest wait | Done notice |
|---|---|---|---|---|---|---|---|---|---|---|
| Batch AI Enhance | TC-074 | TC-076 | TC-088, TC-093 | TC-091, TC-095 | TC-094 | TC-088, TC-091 | n/a (no cancel: D1-03) | TC-097, TC-098 | TC-085 | TC-076 |
| Batch save | TC-100 | TC-101, TC-102 | n/a (spec silent) | n/a (spec silent) | n/a (spec silent) | n/a (spec silent) | n/a (cannot be stopped) | n/a (spec silent: 「Please do not leave this page」) | TC-100 | TC-101 |
| Apply to all (Crop, Adjustment) | n/a (no loading drawn) | TC-035, TC-058 | n/a (spec silent) | n/a (spec silent) | n/a (spec silent) | n/a (spec silent) | TC-050 | TC-053, TC-063 | n/a (spec silent) | TC-035, TC-058 |

### Error classes

| Job | Error classes |
|---|---|
| Batch AI Enhance | failed photo TC-088, TC-091; connection lost TC-093, TC-094; both TC-096 (no numbered classes in the spec) |
| Batch save | n/a (spec names no error classes) |

### Exit × stage

| Stage | Home | Replace photo | Room ✕ / ‹ | Background / kill |
|---|---|---|---|---|
| Batch Edit Room, no edit | TC-110 | TC-114 | n/a (no room open) | n/a (spec silent) |
| Batch Edit Room, with edits | TC-111, TC-112, TC-113 | TC-115, TC-117 | n/a (no room open) | TC-098 |
| Crop & Rotate room | n/a (no Home in the room) | n/a (no Replace in the room) | TC-053, TC-055 | n/a (spec silent) |
| Adjustment room | n/a (no Home in the room) | n/a (no Replace in the room) | TC-063 | n/a (spec silent) |
| AI Enhance room, idle | n/a (no Home in the room) | n/a (no Replace in the room) | TC-079 | n/a (nothing running) |
| AI Enhance processing | n/a (screen locked) | n/a (screen locked) | TC-075 | TC-097, TC-098 |
| Saving | n/a (screen locked) | n/a (screen locked) | n/a (no ✕) | n/a (spec silent) |
| Batch Save page | TC-105 | n/a (no Replace) | TC-104 | n/a (spec silent) |
| Photo Picker from Edit Next Batch | n/a (no Home) | n/a | TC-107 | n/a (spec silent) |

### Hidden clauses

| Requirement | Hidden clause | Observed through | Rows |
|---|---|---|---|
| R-078 | no credit is charged for batch AI Enhance | the credit balance before and after (Mine › My Credits) | TC-081 |
| R-076 | each request runs the Standard · Portrait enhance | the app log after a log pull; parked until it names the model | TC-087 |
| R-106 | finished AI Enhance results are not kept after a kill | the gallery and My AI Artwork after reopening | TC-098 |
| R-107 | Standard results are not saved to My AI Artwork | My AI Artwork after a batch save | TC-099, TC-098 |
| R-109 | originals are not overwritten | the gallery: the originals are unchanged and new files added | TC-102 |
| R-110 | unedited photos are saved too | the gallery count after a save | TC-102 |
| R-116 | a batch save counts as one save for the rating dialog | the rating dialog with RD's counter set; parked | TC-109 |
| R-133 | the analytics event is sent | the analytics event log; parked until available | TC-120 |
| R-134 | one event per photo with from and batch_size | the analytics event log; parked | TC-121 |
| R-135 | the analytics event is sent | the analytics event log; parked | TC-122 |
| R-136 | the analytics event is sent | the analytics event log; parked | TC-123 |
| R-101 | only the failed photos are redone | 「Enhancing k / x」 counts only the failed photos; the others keep their result | TC-091 |
| R-104 | offline Retry does not start | no 「Enhancing」 progress appears and the counts stay | TC-094 |
| R-105 | the batch pauses in the background | 「Enhancing k / N」 before and after returning | TC-097 |
| R-069 | folding the Curve / HSL panel only hides it: the curve, its point and channel, the HSL colour and its three values stay as set | the photo while folded, the panel after ︿ (pass 10b, Figma Agent comparison 2026-11-12) | TC-126, TC-127 |
| R-009 | 「Select 1 to 20 photos」: no batch starts with 0 photos | 「Next」 with nothing ticked (Figma Agent comparison 2026-11-12) | TC-128 |

### Variants

| Requirement | Variant | Rows |
|---|---|---|
| R-037 | room=Crop & Rotate | TC-035 |
| R-037 | room=Adjustment | TC-058, TC-070 |
| R-039 | room=Crop & Rotate | TC-034, TC-035 |
| R-039 | room=Adjustment | TC-058 |
| R-040 | room=Crop & Rotate | TC-036 |
| R-040 | room=Adjustment | TC-060 |
| R-041 | room=Crop & Rotate | TC-050 |
| R-041 | room=Adjustment | TC-061, TC-062 |
| R-042 | room=Crop & Rotate | TC-035 |
| R-042 | room=Adjustment | TC-058 |
| R-059 | room=Crop & Rotate | TC-053 |
| R-059 | room=Adjustment | TC-063 |
| R-060 | room=Crop & Rotate | TC-054 |
| R-060 | room=Adjustment | TC-064 |
| R-056 | room=Crop & Rotate | TC-051, TC-050 |
| R-056 | room=Adjustment | TC-061 |
| R-048 | ratio=Squre (fixed) | TC-040, TC-041, TC-042 |
| R-051 | ratio=Free (Custom) | TC-044, TC-033 |
| R-052 | ratio=Original | TC-045 |
| R-053 | ratio=same as the photo | TC-046 |
| R-054 | rotate 90° | TC-047 |
| R-054 | flip horizontal | TC-047 |
| R-054 | flip vertical | TC-048 |
| R-054 | fine angle | TC-049 |
| R-036 | width / height linked | TC-032 |
| R-036 | width / height unlinked | TC-033 |
| R-034 | above the original | TC-030 |
| R-034 | below 238 px | TC-031 |
| R-003 | tier=Free (Crop, Adjustment, save) | TC-084, TC-009 |
| R-003 | tier=Free (20-photo batch: Crop, Adjustment, save) | TC-125 |
| R-003 | tier=Pro | TC-076, TC-078 |
| R-086 | tier=Free | TC-082 |
| R-086 | tier=Pro (dialog, no IAP) | TC-072 |
| R-079 | tier=Pro | TC-076, TC-085 |
| R-090 | tier=Pro | TC-076 |
| R-090 | tier=Pro+ | TC-086 |
| R-006 | entry=Launcher Edit | TC-001 |
| R-006 | entry=AI Enhance shortcut | TC-013 |
| R-007 | photos=1 (Batch) | TC-010 |
| R-007 | photos=20 | TC-009, TC-085 |
| R-007 | photos=21 | TC-008 |
| R-123 | no edit | TC-110 |
| R-123 | with edits | TC-111, TC-112 |
| R-124 | no edit | TC-114 |
| R-124 | with edits | TC-115, TC-116 |
| R-103 | connection lost only | TC-093 |
| R-103 | failures and connection lost | TC-096 |
| R-132 | appearance=Light | TC-118 |
| R-132 | appearance=Dark | TC-119 |
| R-014 | Launcher shortcut | TC-016 |
| R-014 | deeplink | TC-017 |

### Combinations

- Not combined: room, ratio, tier, entry, photos, appearance (each is one condition a rule holds under, never chosen together to change one output: the room a rule is checked in, a crop ratio, the account tier, the picker entry, the batch size, the system appearance; rotation and flips applied with a ratio are checked together in TC-047 and TC-049)

### Flow arrows walked by existing rows
- R-015 [DS: flow arrow 16:10599 https://www.figma.com/design/iWlQTjlmfykHfmlNvg9J4p/Batch-Editing?node-id=16-10599] Launcher 「Edit」 → Photo Picker (Batch tab): tapping 「Edit」 opens the Photo Picker, where the 「Batch」 tab allows several photos. Walked by: TC-001.
- R-016 [DS: flow arrow 16:10603 https://www.figma.com/design/iWlQTjlmfykHfmlNvg9J4p/Batch-Editing?node-id=16-10603] Photo Picker (Batch) Next → Batch Edit Room: Next with 2 or more photos opens the Batch Edit Room. Walked by: TC-006.
- R-017 [DS: flow arrow 16:10611 https://www.figma.com/design/iWlQTjlmfykHfmlNvg9J4p/Batch-Editing?node-id=16-10611] Photo Picker ‹ → Launcher: ‹ on the picker returns to the Launcher. Walked by: TC-002.
- R-018 [DS: flow arrow 16:12859 https://www.figma.com/design/iWlQTjlmfykHfmlNvg9J4p/Batch-Editing?node-id=16-12859] Launcher AI Enhance shortcut → Photo Picker: the AI Enhance shortcut opens the Photo Picker with the same Single / Batch switch. Walked by: TC-013.
- R-019 [DS: flow arrow 16:12863 https://www.figma.com/design/iWlQTjlmfykHfmlNvg9J4p/Batch-Editing?node-id=16-12863] AI Enhance shortcut picker (Batch) → AI Enhance room: several photos land directly in the batch AI Enhance room. Walked by: TC-014.
- R-020 [DS: flow arrow 16:12867 https://www.figma.com/design/iWlQTjlmfykHfmlNvg9J4p/Batch-Editing?node-id=16-12867] AI Enhance shortcut picker ‹ → Launcher: ‹ returns to the Launcher. Walked by: TC-015.
- R-021 [DS: flow arrow 16:13109 https://www.figma.com/design/iWlQTjlmfykHfmlNvg9J4p/Batch-Editing?node-id=16-13109] Photo Picker (Batch, one photo) → single Edit Room: one photo opens the existing single Edit Room. Walked by: TC-010.
- R-022 [DS: flow arrow 137:4368 https://www.figma.com/design/iWlQTjlmfykHfmlNvg9J4p/Batch-Editing?node-id=137-4368] Single Edit Room Replace photo → Photo Picker: Replace photo opens the picker, whose Batch tab leads to Batch Edit. Walked by: TC-011.
- R-063 [DS: flow arrow 16:10607 https://www.figma.com/design/iWlQTjlmfykHfmlNvg9J4p/Batch-Editing?node-id=16-10607] Batch Edit Room 「Crop & Rotate」 → Crop & Rotate room: 「Crop & Rotate」 opens the batch Crop & Rotate room. Walked by: TC-028.
- R-064 [DS: flow arrow 16:10615 https://www.figma.com/design/iWlQTjlmfykHfmlNvg9J4p/Batch-Editing?node-id=16-10615] Crop & Rotate ✓ → Batch Edit Room: ✓ keeps the changes and returns to the Batch Edit Room. Walked by: TC-054.
- R-072 [DS: flow arrow 16:11038 https://www.figma.com/design/iWlQTjlmfykHfmlNvg9J4p/Batch-Editing?node-id=16-11038] Batch Edit Room 「Adjustment」 → Adjustment room: 「Adjustment」 opens the batch Adjustment room. Walked by: TC-056.
- R-073 [DS: flow arrow 16:11042 https://www.figma.com/design/iWlQTjlmfykHfmlNvg9J4p/Batch-Editing?node-id=16-11042] Adjustment ✓ → Batch Edit Room: ✓ keeps the changes and returns to the Batch Edit Room. Walked by: TC-064.
- R-074 [DS: flow arrow 297:3116 https://www.figma.com/design/iWlQTjlmfykHfmlNvg9J4p/Batch-Editing?node-id=297-3116] Adjustment 「All」 → applied: 「All」 applies the setting and shows 「Applied to x photos」. Walked by: TC-058.
- R-091 [DS: flow arrow 16:11813 https://www.figma.com/design/iWlQTjlmfykHfmlNvg9J4p/Batch-Editing?node-id=16-11813] Batch Edit Room 「AI Enhance」 → AI Enhance room: 「AI Enhance」 opens the batch AI Enhance room. Walked by: TC-071.
- R-092 [DS: flow arrow 31:1858 https://www.figma.com/design/iWlQTjlmfykHfmlNvg9J4p/Batch-Editing?node-id=31-1858] AI Enhance 「Enhance」 → Confirm Dialog: a paid user's 「Enhance」 asks 「Enhance {xx} photos?」. Walked by: TC-072.
- R-093 [DS: flow arrow 16:11821 https://www.figma.com/design/iWlQTjlmfykHfmlNvg9J4p/Batch-Editing?node-id=16-11821] Confirm 「Start」 → processing: 「Start」 shows 「Enhancing k / N」. Walked by: TC-074.
- R-094 [DS: flow arrow 16:11829 https://www.figma.com/design/iWlQTjlmfykHfmlNvg9J4p/Batch-Editing?node-id=16-11829] Confirm 「Cancel」 → AI Enhance room: nothing is processed. Walked by: TC-073.
- R-095 [DS: flow arrow 31:1863 https://www.figma.com/design/iWlQTjlmfykHfmlNvg9J4p/Batch-Editing?node-id=31-1863] Processing → result summary: the result shows when every photo is done. Walked by: TC-076.
- R-096 [DS: flow arrow 16:13763 https://www.figma.com/design/iWlQTjlmfykHfmlNvg9J4p/Batch-Editing?node-id=16-13763] AI Enhance ✓ → Batch Edit Room: ✓ returns with the enhanced photos. Walked by: TC-078.
- R-097 [DS: flow arrow 151:2352 https://www.figma.com/design/iWlQTjlmfykHfmlNvg9J4p/Batch-Editing?node-id=151-2352] AI Enhance 「Enhance」 (Free) → Premium IAP: a Free user's 「Enhance」 opens the Premium IAP page. Walked by: TC-082.
- R-117 [DS: flow arrow 16:13426 https://www.figma.com/design/iWlQTjlmfykHfmlNvg9J4p/Batch-Editing?node-id=16-13426] Batch Edit Room Save → Saving: Save shows 「Saving k / N」. Walked by: TC-100.
- R-118 [DS: flow arrow 16:13430 https://www.figma.com/design/iWlQTjlmfykHfmlNvg9J4p/Batch-Editing?node-id=16-13430] Saving → Batch Save page: the Batch Save page shows once all are saved. Walked by: TC-100.
- R-119 [DS: flow arrow 141:2038 https://www.figma.com/design/iWlQTjlmfykHfmlNvg9J4p/Batch-Editing?node-id=141-2038] Batch Save page ‹ → Batch Edit Room: ‹ returns to the Batch Edit Room. Walked by: TC-104.
- R-120 [DS: flow arrow 141:2042 https://www.figma.com/design/iWlQTjlmfykHfmlNvg9J4p/Batch-Editing?node-id=141-2042] Batch Save page Home → Launcher: Home returns to the Launcher. Walked by: TC-105.
- R-121 [DS: flow arrow 141:2046 https://www.figma.com/design/iWlQTjlmfykHfmlNvg9J4p/Batch-Editing?node-id=141-2046] Batch Save page 「Edit Next Batch」 → Photo Picker: 「Edit Next Batch」 opens the picker on 「Batch」 with nothing ticked. Walked by: TC-106.
- R-122 [DS: flow arrow 357:2620 https://www.figma.com/design/iWlQTjlmfykHfmlNvg9J4p/Batch-Editing?node-id=357-2620] Photo Picker (from Edit Next Batch) ‹ → Batch Edit Room: ‹ returns to the Batch Edit Room with its edits. Walked by: TC-107.
- R-127 [DS: flow arrow 16:13750 https://www.figma.com/design/iWlQTjlmfykHfmlNvg9J4p/Batch-Editing?node-id=16-13750] Batch Edit Room Home (with edits) → Discard Dialog: Home asks 「Discard changes?」. Walked by: TC-111.
- R-128 [DS: flow arrow 37:2034 https://www.figma.com/design/iWlQTjlmfykHfmlNvg9J4p/Batch-Editing?node-id=37-2034] Batch Edit Room Replace photo (with edits) → Discard Dialog: Replace photo asks 「Discard changes?」. Walked by: TC-115.
- R-129 [DS: flow arrow 16:13754 https://www.figma.com/design/iWlQTjlmfykHfmlNvg9J4p/Batch-Editing?node-id=16-13754] Discard Dialog 「Discard」 → Photo Picker (Batch): from Replace photo, 「Discard」 opens the picker on 「Batch」 with the earlier photos ticked. Walked by: TC-115.
- R-130 [DS: flow arrow 16:13758 https://www.figma.com/design/iWlQTjlmfykHfmlNvg9J4p/Batch-Editing?node-id=16-13758] Discard Dialog 「Keep Editing」 → Batch Edit Room: the edits stay. Walked by: TC-113.
- R-131 [DS: flow arrow 16:13746 https://www.figma.com/design/iWlQTjlmfykHfmlNvg9J4p/Batch-Editing?node-id=16-13746] Photo Picker (Batch) Next → Batch Edit Room (leave flow): Next opens the Batch Edit Room. Walked by: TC-116.

### Domain rules

| Entry | Requirements |
|---|---|
| KP-013 | R-090 |
| KP-016 | n/a (no one-time free trial in batch: a Free user gets the IAP page, D3-01) |

### Request ledger coverage

| Ledger entry | Requirements |
|---|---|
| REQ-009 | R-001, R-004 … every requirement (new feature from the PM and Design Figma) |
| REQ-011 | R-003, R-028, R-060, R-067, R-068, R-069 (the spec agent comparison's partial cases; DR-05g re-read) |
| REQ-013 | R-069 (hidden clause: folding the Curve / HSL panel keeps its values and selection; TC-126, TC-127) |
| REQ-014 | R-009 (hidden clause: no batch with 0 photos; TC-128) |
