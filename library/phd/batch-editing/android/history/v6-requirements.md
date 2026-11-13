# Batch Editing — requirements (android)
Spec: UI UX flow 2.pdf (PM "Demo + Spec", Batch Edit, 26'11/E, re-exported 2026-11-09), Section 3 · 美圖 Apply to all
實測.pdf (crop Apply to all decision) and the Design Figma frames exported one PDF per frame (`Design - *.pdf`, light and
dark copies), spec set 2026-11-09.

Source tags: `[PM:<board>; <rule IDs>]`, board IDs from `specs/2026-11-09/extracted/boards.json`, rule IDs as the boards
print them (`D1-08`, `DR-05b` …); `[S3:<board>]` for Section 3 · 美圖 Apply to all 實測. The flow file is PM-owned and also
carries the UI; `[DS:<board>]` = a Design frame (`ds-*` boards, `design-text.md`). UI strings follow the Design frames,
rules the PM boards; where the two disagree on a rule the question is open and the row says which it follows. Mockups
are iPhone frames; Android differences are in "System back". The Design Figma was read from PDF exports, not through
Figma (quota ran out mid read: `figma-pending.json`, Q-12). Request ledger: REQ-001 (this table), REQ-003 (this update), REQ-004 (UI copy follows the Design), REQ-011 (v5).

**Also read (REQ-011, 2026-11-11):** the PM and Design Figma pages themselves (PM page 0:1, Design page 12:2321), as the
text snapshot of spec set 2026-11-09-figma (re-read 2026-11-11). `[PMF:<board>; <rule IDs>]` = a PM Figma board
(`specs/2026-11-09-figma/extracted/figma-inventory-pm-*.json`). The PDF export 「UI UX flow 2.pdf」 is an older state
of that page: it lacks the 【NEW】 「All」 states and the width / height rule (DR-04), the Curve / HSL strip rule (D1-12)
and has DR-05g before its 2026-11-11 change (KF-005). Where the two differ, the Figma page wins.

## Scope
- R-001 [PM:overview; D0-04, D0-04b] The feature is named 「Batch Edit」 / 「Batch Edit Room」 and is reached only from the Photo Picker of the Launcher 「Edit」 button and of the Launcher 「AI Enhance」 shortcut.
- R-002 [PM:overview; D0-04] Edit Room itself offers no Batch Edit tool (its toolbar has no batch entry); the only way from Edit Room is Replace photo → Picker Batch tab (R-017).
- R-003 [PM:overview, room-default; D0-07, D0-06, DR-03, D1-11] Batch Edit offers only three tools: 「Crop & Rotate」, 「Adjustment」, 「AI Enhance」 (no Filter, no Preset).
- R-004 [PM:overview, enhance-default; D0-08, D5-01b, DR-11] Batch Edit is free: Crop & Rotate and Adjustment cost nothing and AI Enhance deducts no credits (the credit balance is unchanged after a batch enhance).
- R-005 [PM:overview; D0-05] Released on iOS and Android together in 26'11/E. — NOT TESTABLE: release planning.

## Photo Picker
- R-010 [PM:picker-single; DR-01b] The Photo Picker has a 「Single」 / 「Batch」 tab at the top; it opens on 「Single」 every time.
- R-011 [PM:picker-single; DR-13] On 「Single」, choosing one photo opens the existing single-photo Edit Room; that flow is unchanged.
- R-012 [PM:picker-single; DR-01b, D0-04b] The Launcher 「Edit」 picker and the 「AI Enhance」 shortcut picker carry the same 「Single」 / 「Batch」 tabs.
- R-013 [PM:picker-batch, pm-decisions; DR-01, D5-01b] Only the 「Batch」 tab allows several photos; at most 20 for Free and Premium users alike, with no IAP at any count (Q2 decided 10/30: no Premium lock day-1, not Meitu's IAP at the 13th photo), and the same on both platforms, so Android is not held to a lower cap.
- R-014 [PM:picker-batch; D2-01] Selected thumbnails show their selection order 1, 2, 3 …; Batch Edit Room lists the photos in that order.
- R-015 [PM:picker-batch, entry-enhance-shortcut; DR-01; DS:ds-photo-picker] The bottom bar of the Batch tab shows the hint with the count, 「Select 1 to 20 photos to continue. (n/20)」, and 「Next」 (Design copy; PM draws 「n selected (max 20)」 and 「Done」: Q-1).
- R-019 [DS:ds-photo-picker] On the Batch tab a tray under the bottom bar lists the selected photos in selection order, each with ✕; ✕ deselects that photo (the tile loses its number, the count drops).
- R-233 [DS:ds-photo-picker] Every picker tile carries an expand icon at its bottom right that opens the photo large without selecting it (Design draws the icon only; what opens is not stated: Q-13).
- R-016 [PM:picker-batch-one, batch-one; DR-01b] On the 「Batch」 tab, 「Next」 with only one photo selected opens the single-photo Edit Room.
- R-017 [PM:picker-batch-one, batch-one; D1-08c, DR-13] In the single-photo Edit Room, Replace photo opens the Photo Picker, where switching to 「Batch」 and choosing several photos goes to Batch Edit Room.
- R-018 [PM:picker-over-max; DR-01] Selecting a 21st photo is blocked with the toast 「Please pick at most 20 photos.」.

## Entry
- R-020 [PM:entry-edit; D1-01] From the Launcher 「Edit」 picker, Batch tab → 「Next」 lands on the Batch Edit Room main screen.
- R-021 [PM:entry-enhance-shortcut, enhance-default; DR-02] From the Launcher 「AI Enhance」 shortcut picker, Batch tab with several photos → 「Next」 lands directly on the Batch Edit Room AI Enhance page.
- R-022 [PM:entry-batch-shortcut] A Launcher Batch Edit shortcut is planned (its icon is still to be designed, after Meitu); the Launcher drawn has none yet. The deeplink `phd://navigate/page?name=batch_edit` opens Batch Edit; where it lands is not stated (Q-15).

## Batch Edit Room
- R-030 [PM:room-default; D1-11, D1-01] The main screen looks like the current Edit Room; its bottom bar has only three buttons, in the order 「Crop & Rotate」 → 「Adjustment」 → 「AI Enhance」, each opening a room like the current feature room.
- R-031 [PM:room-default; D1-11; DS:ds-canvas-img-focus] Top bar: Home and Replace photo at the left; a feedback button (speech bubble with !), Save (unchanged from Edit Room) and a Setting button at the right (the feedback button is drawn by Design only: Q-21).
- R-032 [PM:room-default; D1-12] A thumbnail strip on the main screen; tapping a thumbnail switches the current photo.
- R-033 [PM:room-default; D1-09] Photos cannot be removed or added in Batch Edit Room (no × on thumbnails, no add button).
- R-034 [PM:room-default; D1-08] Home with no edit yet goes straight to the Launcher; after an edit it opens the Discard Dialog, and 「Discard」 goes to the Launcher.
- R-035 [PM:room-default, leave-flow; D1-08, D1-08b] Replace photo with no edit yet goes straight to the Photo Picker Batch tab; after an edit it opens the Discard Dialog, and 「Discard」 goes to the Photo Picker Batch tab. Both keep the earlier selected photos selected; Discard drops every edit of this Batch Edit.
- R-036 [PM:room-default; DR-05, DR-05d] The main screen's Undo / Redo keeps one history per photo and acts only on the current photo; one visit to a room ended with ✓ is one step in each changed photo's history.
- R-037 [PM:room-default, enhance-done; DR-10b, DR-12e] On the main screen, Undo on an enhanced photo returns only that photo to its pre-Enhance state; Redo brings the Enhance result back.
- R-038 [PM:room-default; DR-10b, DR-12e] After an Enhance was undone, any other edit to that photo clears the Redo: the Enhance result cannot be brought back, but the photo can be enhanced again from the AI Enhance room (R-229).
- R-039 [PM:room-default] The Setting button's target is not stated (Q-3); the compare button drawn on the photo works as in Edit Room (Q-4).

## Crop & Rotate room
- R-050 [PM:crop-default; D1-11, DR-03; DS:ds-3, ds-main-down-tool-box] The room matches the current Crop & Rotate room (Rotate, Flip, Flip Vertically, Original, Custom, Square, 2:3, 3:2, 3:4 and more ratios, angle slider, ✕ / undo / redo / ✓), with no title above the tool panel. Its top bar has ‹ at the left, the current photo's pixel size 「W x H」 with a pencil (manual pixel input, R-066) in the middle and 「All」 at the right (‹ beside ✕: Q-22).
- R-051 [PM:crop-default; DR-04] Top right: an 「Apply to all」 button (icon + 「All」, semi-transparent dark capsule). It is a one-shot button, not a checkbox; it has a normal and a disabled state (R-234).
- R-234 [DS:ds-status; PMF:pm-ui-3, pm-ui-4 DR-04 【NEW】] 「All」 (Crop & Rotate and Adjustment) is normal or disabled by the current photo: disabled on entering the room while the current photo has no change; normal once it has a change not yet applied; disabled once applied, until the current photo changes again; on switching photos, set by that photo's own unapplied changes; Undo of the Apply to all step → normal, Redo of it → disabled.
- R-236 [PMF:pm-ui-3 DR-04 【NEW】] Crop manual size (W x H ✎): with width and height linked, a size-only change keeps the ratio, so there is nothing to apply and 「All」 stays disabled; with them unlinked the ratio changes to 「Free」 (custom) and 「All」 turns normal, applying that Free ratio.
- R-052 [PM:crop-default, crop-applied; DR-04, DR-04c] Tapping 「All」 applies this room's settings from the current photo to every other photo; the screen stays in the room.
- R-053 [PM:crop-applied; DR-04] After 「All」 the toast 「Applied to x photos」 appears; x = the number of photos other than the current one.
- R-054 [PM:crop-default, crop-applied; DR-04] The thumbnail strip updates at once to show the applied result on every photo.
- R-055 [PM:crop-default; DR-04] After applying, tapping a thumbnail switches to that photo to check or fine-tune it; a fine-tune changes only that photo.
- R-056 [PM:crop-default; DR-04; S3:meitu-conclusion] Changing the source and tapping 「All」 again re-applies the current photo's latest settings to the others, overwriting their earlier crop (recomputed from each original).
- R-057 [PM:crop-default; DR-07; S3:meitu-conclusion] Apply to all carries the ratio, the rotation angle and the flips; the 「Free」 ratio can be applied too.
- R-058 [S3:meitu-conclusion] The current (source) photo keeps the box the user adjusted (size and position unchanged).
- R-059 [S3:meitu-conclusion, meitu-summary] Every other photo gets the largest box of that ratio (one side flush with its original, only the part outside the ratio cut); the box size is not synced (Meitu syncs relative size, PhD does not).
- R-060 [S3:meitu-conclusion] The largest box of each other photo is placed at the source's relative position: horizontal = left margin ÷ (width − box width), vertical = top margin ÷ (height − box height); 0 = left / top, 0.5 = centre, 1 = right / bottom.
- R-061 [S3:meitu-conclusion] Only a direction in which a photo's box has room to move takes the relative position; a direction with no room is centred, and a source direction with no room counts as 0.5 (centred). (DR-07 says boxes default to centred on each photo: Q-5.)
- R-062 [S3:meitu-conclusion] Output size is computed from each original, so the saved photos' pixel sizes differ; this is expected.
- R-063 [S3:meitu-conclusion] 「Free」 counts as a custom ratio: its ratio and relative position are applied, other photos get the largest box of that ratio.
- R-064 [S3:meitu-conclusion] 「Original」 applied to all returns each photo to its own original ratio, uncropped.
- R-065 [S3:meitu-conclusion] A photo whose ratio equals the chosen ratio keeps the whole photo (no crop).
- R-066 [S3:meitu-conclusion, meitu-cases C12] Manual pixel input accepts 238 px up to the photo's own width / height; a value beyond the range shows a toast and is not taken (Meitu: 「Width and height exceed the range」 with the range under the field; PhD copy: Q-6).
- R-067 [S3:meitu-conclusion] Apply to all after a manual pixel input applies only its ratio, not the pixel values.
- R-068 [S3:meitu-conclusion] Rotation applied to all: 90° rotation and horizontal / vertical flips apply to every photo as they are.
- R-069 [S3:meitu-conclusion] An angle fine-tune applies the same angle to every photo; each photo's box shrinks by its own size to avoid black edges, then the crop rules above apply.
- R-070 [S3:meitu-cases C1] With Apply to all not tapped, choosing 3:4 on the seascape (2730×1535) gives the largest box 1151×1535, full height, centred, on that photo only.
- R-071 [S3:meitu-cases C5] Choosing 3:2 on the escalator photo and applying to all gives every photo its own largest 3:2 box, centred.
- R-072 [S3:meitu-cases C6] Square on the seascape dragged fully left, applied to all: photos with no horizontal room stay centred.
- R-073 [S3:meitu-cases C7] Square on the 101 photo dragged fully down, applied to all: the escalator photo's box sits low (vertical position synced); the seascape has no vertical room and stays centred.
- R-074 [S3:meitu-cases C8] Square on the seascape shrunk to 865×865 at the bottom right, applied to all: the seascape keeps 865×865 at the bottom right; the escalator gets 1706×1706 flush with the bottom; the 101 gets 1576×1576 flush with the bottom; the 1:1 tea cup stays whole.
- R-075 [S3:meitu-cases C9] Square applied from the seascape leaves the 1:1 tea cup uncropped.
- R-076 [S3:meitu-cases C10] 「Free」 on the escalator dragged to 1236×611 at the top left, applied to all: every other photo gets the largest ≈2:1 box at the top left (not 72 % of its width).
- R-077 [S3:meitu-cases C11] After all photos are 3:2, 「Original」 on any photo applied to all returns all four to their original ratios.
- R-080 [PM:crop-default; D1-12] The batch thumbnail strip is shown at the bottom of the room; tapping a thumbnail switches the current photo.
- R-081 [PM:crop-default; DR-05, DR-05b] The room has one Undo / Redo with one shared history recording, in order, ① Apply to all (several photos at once) and ② a single parameter edit on one photo.
- R-082 [PM:crop-default; DR-05b] Undo / Redo steps back / forward the latest step: an Apply to all step for all photos together; a single edit only on the photo it was made on, whichever photo is current.
- R-083 [PM:crop-default; DR-05e] Switching photos does not clear the room's history.
- R-084 [PM:crop-default; DR-05h] When Undo / Redo changes a single edit of a photo that is not current, the room switches to that photo (the thumbnail strip selects it).
- R-085 [PM:crop-default; DR-05c] ✕ drops every change made to every photo since entering the room, Apply to all included.
- R-086 [PM:crop-default; DR-05d] ✓ returns to Batch Edit Room; the room's changes to each photo are one step in that photo's main-screen history.
- R-087 [PM:crop-applied; DR-05b; S3:meitu-conclusion] Apply to all is one step of the room history: one Undo takes it back on all photos, one Redo restores it on all (Section 3 「Undo」 rule; whether it also means the main screen: Q-9).

## Adjustment room
- R-090 [PM:adjust-default; D1-11, DR-03, DR-06] The room matches the 26'10/E Adjustment room (Light / Color / Details), without Subject Detection and without AI Exposure (the Design frames draw 「AI Exposure」 in the tool list: Q-18; rows follow PM).
- R-230 [DS:ds-9-adjust-hsl, ds-9-adjust-curve, ds-9-adjust-hsl-collapse, ds-9-adjust-curve-collapse; PM:adjust-guideline-note] The Color tab has an HSL panel (「Hue」 / 「Saturation」 / 「Lightness」 sliders and eight colour dots: red, orange, yellow, green, cyan, blue, purple, magenta) and a Curve panel (channel buttons RGB / red / green / blue beside the tone curve), as the current Adjustment room; each panel folds down with a chevron (﹀) and opens again with ︿, and reset and compare sit on the photo.
- R-231 [PM:adjust-default; DR-04, DR-04c; DS:ds-9-adjust-hsl, ds-9-adjust-curve] 「All」 carries the HSL and Curve values with the rest of the set (the whole set of the room, R-092).
- R-232 [PM:adjust-guideline-note] PM asks Design for the HSL / Curve layout with the thumbnail strip (the photo gets small) and prefers the proposal 「Adjustment 縮圖列（draft）」: A. thumbnails 50→40 px, strip 62→48 px; B. the strip fades out while a finger holds a slider or a curve point and fades back on release. — NOT TESTABLE: direction only, not drawn yet (Q-17). Decided in the PM Figma (D1-12): R-237, R-238.
- R-237 [PMF:pm-ui-4 D1-12; DS:9_Adjust_curve, 9_Adjust_HSL] Opening Color › Curve or HSL fades the batch thumbnail strip out; it cannot be tapped (the panel lies over the photo); 「All」 stays shown at the top right.
- R-238 [PMF:pm-ui-4 D1-12; DS:9_Adjust_curve_collapse, 9_Adjust_HSL_collapse] Collapsing the panel (﹀), or going back to a slider tool such as Exposure, shows the strip again; to switch photos the panel is collapsed first.
- R-091 [PM:adjust-default; DR-04] Top right: the one-shot 「Apply to all」 button (icon + 「All」, semi-transparent dark capsule, as PDR), not a checkbox.
- R-092 [PM:adjust-default, adjust-applied; DR-04, DR-04c] Tapping 「All」 applies the whole set of this room's settings from the current photo to every other photo; the screen stays in the room.
- R-093 [PM:adjust-applied; DR-04] The toast 「Applied to x photos」 appears, x = the photos other than the current one.
- R-094 [PM:adjust-applied; DR-04] The thumbnail strip shows the applied result.
- R-095 [PM:adjust-default; DR-04] After applying, a thumbnail switches to that photo; a fine-tune there changes only that photo.
- R-096 [PM:adjust-default; DR-04, DR-04c] Changing the source and tapping 「All」 again replaces the others' whole set with the source's: e.g. photo 1 Exposure +20 → All → all +20; photo 3 Contrast +10; photo 1 Exposure +30 → All → every other photo equals photo 1 and photo 3 loses its Contrast +10.
- R-097 [PM:adjust-default; D1-12] The thumbnail strip is at the bottom of the room; tapping switches the current photo.
- R-098 [PM:adjust-default; DR-05, DR-05b] One shared Undo / Redo history records Apply to all steps and single parameter edits in order.
- R-099 [PM:adjust-default; DR-05b] Undo / Redo of an Apply to all step affects all photos together; of a single edit, only that photo whichever is current.
- R-100 [PM:adjust-default; DR-05e] Switching photos does not clear the history.
- R-101 [PM:adjust-default; DR-05h] Undo / Redo of a single edit on a non-current photo switches to that photo (strip selection follows).
- R-102 [PM:adjust-default; DR-05c] ✕ drops every change to every photo since entering the room, Apply to all included.
- R-103 [PM:adjust-default; DR-05d] ✓ returns to Batch Edit Room; the room's changes are one step in each photo's main-screen history.
- R-104 [PM:adjust-default; PMF:pm-ui-4 DR-05g, changed 2026-11-11] Undo / Redo switches to the Light / Color / Details tab of the value it undoes or redoes, as the Android single Adjustment room (was: no tab switch).
- R-105 [PM:adjust-applied; DR-05b] Apply to all is one step: Undo takes it back on all photos at once.

## AI Enhance
- R-110 [PM:enhance-default; DR-09, DR-12a, D1-11, DR-09b] Batch AI Enhance supports only Standard: no Standard / Advanced tab, no scenario / Scene Presets (General, Portrait, Scenery, Pets, Concert, Product, Anime), only one 「Enhance」 button with 「Maximize detaill and clarity with advanced AI.」 (spelling: Q-10).
- R-111 [PM:enhance-default; DR-09d] The 「Enhance」 button runs the 10/E Standard · Portrait enhancement on each photo.
- R-112 [PM:enhance-default, confirm-dialog; DR-12h, DR-12] 「Enhance」 applies to all photos of the batch and first opens the AI Enhance Confirm Dialog, every time.
- R-113 [PM:enhance-default; DR-11, D5-01b] The 「Enhance」 button shows no credit count and no credits are deducted.
- R-114 [PM:enhance-default; DR-10] Results are applied as soon as they finish; there is no per-photo ✓.
- R-115 [PM:enhance-default; D1-12] The thumbnail strip is above the 「Enhance」 button; tapping a thumbnail switches the current photo.
- R-116 [PM:enhance-done; DR-12e, DR-12h] Each visit of the AI Enhance room allows one Enhance, applied to every photo of the batch; after it the button reads 「Enhanced」 and is disabled for the rest of the visit.
- R-117 [PM:enhance-done] (removed 2026-11-09: UI UX flow 2 dropped 「Undo 退回 Enhance 的照片仍算做過，不能再 Enhance」; R-229 replaces it.) — NOT TESTABLE: no longer a rule.
- R-229 [PM:enhance-done, room-default; DR-12e, DR-10b] Leaving the AI Enhance room and entering it again allows another Enhance; it processes the current images (results already enhanced are enhanced again, an undone photo from its state now), as in the single Edit Room.
- R-118 [PM:enhance-done; DR-12b, DR-12f, DR-12g] Advanced-only rules do not apply to batch. — NOT TESTABLE: no Advanced mode in batch (checked as R-110).
- R-119 [PM:enhance-free, free-user-iap; DR-12d, D3-01, D3-02] A Free user tapping 「Enhance」 goes straight to the existing Premium IAP page; there is no trial of one photo.
- R-120 [PM:enhance-processing; D1-02] Processing uses the current loading screen with 「Creating Your AI Image」 and 「Enhancing k / N」 (k = finished, N = number of enhance requests); the mask covers the whole screen and the thumbnail strip is under it.
- R-121 [PM:enhance-processing; D1-02] While processing, the user cannot switch to Crop & Rotate / Adjustment or tap thumbnails until every photo has finished.
- R-122 [PM:enhance-processing, server-task-notes; D1-03, D1-02] Processing cannot be cancelled and nothing can be saved before it finishes.
- R-123 [PM:enhance-result, server-task-notes; D1-04; DS:ds-enhance-1-2] Partial failure shows one summary card after every photo has finished (no dialog per photo): 「X completed, Y failed」 and 「Failed photos are marked with ! on the thumbnails.」 (Design copy; the PM state board drops 「with !」); each failed thumbnail has a red ! at its top right, successful ones none; tapping a failed thumbnail switches to it. The card has a ✕ that closes it (Design).
- R-124 [PM:enhance-result; D1-04, DR-12e] The button reads 「Retry Failed (x)」, x = failed photos; Retry reruns only the failed photos, not the successful ones; the ! of a retried photo disappears; a failed photo does not count as enhanced.
- R-125 [PM:enhance-result; D1-04] After a retry the summary counts the whole batch: 15 photos 「12 completed, 3 failed」 → retry 3, 2 succeed → 「14 completed, 1 failed」 and 「Retry Failed (1)」; when all succeed the failure message and the Retry button are gone.
- R-126 [PM:enhance-network, server-task-notes; D1-05, D1-04] Losing the connection counts as failure: finished photos are kept, unfinished photos get a red !, the message is 「X completed, Y failed」 「Connection lost. Check your connection and retry.」; with both failures and a lost connection the counts merge and the second line shows the connection message.
- R-127 [PM:enhance-network, enhance-offline; D1-05] 「Retry Failed (x)」 reruns the unfinished photos; tapped while still offline it shows the toast 「No internet connection」 and does not start.
- R-128 [PM:enhance-network, server-task-notes; D1-05, D1-10] If the app is killed, Batch Edit Room is gone and finished AI Enhance results are not kept (Standard results are not saved to My AI Artwork).
- R-129 [PM:server-task-notes; D1-05] Sending the app to the background pauses processing; it continues on return.
- R-130 [PM:flow-ai-enhance] ✕ on the AI Enhance page returns to Batch Edit Room with the finished Enhance results kept (results are applied when done, R-114). (The Design draws the Discard Dialog over the AI Enhance page: Q-19.)

## AI Enhance Confirm Dialog
- R-135 [PM:confirm-dialog; D1-02, D1-03] Copy (as drawn, confirmed with RD): 「Enhance {xx} photos?」 / 「Processing takes a moment and cannot be canceled once started.」 / 「Cancel」 / 「Start」; {xx} = the photos to enhance.
- R-136 [PM:confirm-dialog; DR-12, DR-12h, DR-11] The dialog appears on every 「Enhance」 tap, covers all photos of the batch and shows no credits.
- R-137 [PM:confirm-dialog; DR-12] 「Cancel」 returns to the AI Enhance page with nothing processed; 「Start」 starts the batch.

## Discard Dialog
- R-140 [PM:discard-dialog; D1-08b] Copy: 「Discard changes?」 / 「Your edits to these photos will be lost.」 / 「Discard」 / 「Keep Editing」.
- R-141 [PM:discard-dialog; D1-08] The dialog appears only after an edit; with no edit, Home / Replace photo leave at once.
- R-142 [PM:discard-dialog; D1-08] 「Keep Editing」 stays in Batch Edit Room with the edits.
- R-143 [PM:discard-dialog; D1-10] Standard AI Enhance results are not saved to My AI Artwork.

## Save
- R-150 [PM:save-saving; D5-01b; DS:ds-canvas-img-focus-8] While saving, 「Saving k / N」 and 「Please do not leave this page or quit the app.」 are shown with progress over the main screen, whose top bar is dimmed (no feedback button); the Batch Save page opens only when saving has finished.
- R-151 [PM:save-saving; D1-06] Every photo is saved as a new file; originals are not overwritten.
- R-152 [PM:save-saving; D1-06] Every input photo is saved, unedited ones included, each as a new file.
- R-153 [PM:save-saved; D1-07; DS:ds-save2] The new Batch Save page shows a thumbnail grid under the title 「Save N photos」 (Design copy; PM writes 「Saved N photos」: Q-20).
- R-154 [PM:save-saved; D1-07] 「‹」 at the top left returns to Batch Edit Room; Home at the top right goes to the Launcher.
- R-155 [PM:save-saved, leave-flow; D1-07] 「Edit Next Batch」, fixed at the bottom, opens the Photo Picker on the Batch tab with nothing selected; Back (‹) from that Picker returns to Batch Edit Room showing the edits as they were (day-1 follows the Android single Edit Room; iOS single goes to the Launcher today, batch follows Android).
- R-156 [PM:save-saved; D1-07] Thumbnails on the Batch Save page cannot be opened.
- R-157 [PM:save-saved; D1-07] No Video tab and no 「Turn it to video」 on the Batch Save page.
- R-158 [PM:save-saved; D1-07] The rating dialog counts one batch save as one save; IAP flyers and ads appear as usual.

## Tracking
- R-160 [PM:tracking; D0-02, D4-01, D1-07] Events: an enter event (name pending) when the Picker switches to Batch and enters Batch Edit Room; GenAI_Feature_Generate with from = BatchEdit and batch_size, once per photo; Photo_Result_Save per batch save; a new event per 「Edit Next Batch」 tap; names PascalCase in three parts, parameters snake_case. — NOT TESTABLE: analytics, names still pending and no event viewer on the phone.

## Android
- R-170 [Rule: Android system Back, REQ-051] Android system Back on every screen of the feature does what the screen's own back / close does (listed under "System back"); where the spec draws none, the row records what Back does (Q-11).

## Open questions
- Q-1 Picker bottom copy: the Design draws 「Select 1 to 20 photos to continue. (10/20)」 and 「Next」 (the light frame without the space before 「(10/20)」 and with 「Next」 grey although 10 photos are selected); the PM boards still draw 「Select 1 to 20 photos.」 / 「3 selected (max 20)」 and 「Done」. Assumption: the Design copy, 「Next」 enabled once a photo is selected. (R-015, TC-005, TC-007)
- Q-3 Where does the Setting button in Batch Edit Room's top bar lead (Edit Room settings, save quality)? (R-039)
- Q-4 The compare button on the photo is drawn but not described: same as Edit Room (hold to see the original)? (R-039)
- Q-5 DR-07 says the crop box defaults to centred on each photo, while Section 3 「✅ 結論」 places other photos' boxes at the source's relative position. Rows follow Section 3 (more specific, marked 結論); confirm. (R-061, R-073)
- Q-6 PhD toast copy for a manual pixel value out of range (Meitu: 「Width and height exceed the range」). (R-066)
- Q-9 Section 3 「Undo（Apply to all 後回到編輯頁按 Undo）」 says one Undo reverts the application on all photos. If 「編輯頁」 means the main screen, it conflicts with D1/DR-05d (main-screen Undo per photo). Rows: in the room all photos (R-087), on the main screen per photo (R-036). Confirm.
- Q-10 「Maximize detaill and clarity with advanced AI.」 has 「detaill」; the Crop panel shows 「Squre」 and Adjustment 「Hightlight」. Typos in the mockups or in the app strings? Rows expect correct spelling.
- Q-11 Android system Back is not specified for Batch Edit Room main (Home or Replace photo behaviour?), the rooms, the processing mask and the saving dialog. Rows record what Back does.
- Q-12 The Design Figma (file qZXJfrM5gb5g4tFoCIS1YU) was read from per-frame PDF exports, not through Figma: the source read stopped on the Figma quota and four boards it had planned (67:10037, 67:10070, 67:10377, 67:10838) are gone from the file. Frames carry no dates, controls are read by eye, and no Figma inventory exists yet. Assumption: the exported frames are the current Design.
- Q-13 What happens to the selected photos when the user deselects one on the Batch tab, by tapping the tile or the tray ✕ (do the numbers renumber?), is 「Next」 disabled with none selected, and what does a tile's expand icon open? Spec silent; rows record it. Assumption: the numbers close up. (R-019, R-233, TC-009, TC-010, TC-150, TC-151)
- Q-14 Does 「‹」 on the Batch Save page return to an editable Batch Edit Room (edits kept, Save again saves another N new files)? Spec only says it returns. (R-154)

## Answered questions
- Q-16 (when 「All」 is greyed) — answered by the PM Figma DR-04 【NEW】 list (REQ-011): R-234, R-236; TC-042, TC-153, TC-162, TC-163, TC-059, TC-062, TC-063, TC-075, TC-076, TC-164, TC-165.
- Q-17 (the strip in HSL / Curve) — answered by the PM Figma D1-12 rule: the strip hides while the panel is open (REQ-011): R-237, R-238; TC-166, TC-167, TC-168.

## Added 2026-10-30 (updated 2026-11-09) — coverage passes and standing inputs

### Job states

| Job | Start / loading | Success | Failure | Retry | Second failure | Partial success | Stop | Leave and return | Longest wait | Done notice |
|---|---|---|---|---|---|---|---|---|---|---|
| Batch AI Enhance | TC-089 | TC-092 | TC-106 | TC-103 | TC-104 | TC-101 | n/a (no cancel by spec, R-122: TC-091) | TC-110 | TC-094 | TC-092 |
| Batch save | TC-122 | TC-128 | n/a (spec silent) | n/a (spec silent) | n/a (spec silent) | n/a (spec silent) | n/a (spec silent) | TC-124 | TC-123 | TC-128 |

### Error classes

| Job | Error classes |
|---|---|
| All jobs | n/a (the spec names no error classes; failure copy is checked in Job states) |

### Exit × stage

| Stage | Home / ‹ / ✕ / Cancel | Replace photo | System Back | App killed |
|---|---|---|---|---|
| Batch Edit Room, no edit | TC-113 | TC-114 | TC-138 | n/a (nothing to keep; spec silent) |
| Batch Edit Room, edited | TC-115 | TC-117 | TC-139 | TC-121 |
| Crop & Rotate room, changed | TC-067 | n/a (not on this screen) | TC-140 | n/a (spec silent) |
| Adjustment room, changed | TC-080 | n/a (not on this screen) | TC-141 | n/a (spec silent) |
| AI Enhance page | TC-100 | n/a (not on this screen) | TC-142 | TC-111 |
| AI Enhance processing | n/a (no control under the mask, R-121) | n/a (under the mask) | TC-143 | TC-111 |
| Saving | n/a (no control) | n/a (no control) | TC-146 | n/a (spec silent) |
| Batch Save page | TC-131 | n/a (not on this screen) | TC-147 | n/a (already saved) |

### System back

- Photo Picker → Launcher (as ‹): TC-137
- Batch Edit Room, no edit / edited: TC-138, TC-139
- Crop & Rotate / Adjustment rooms → as ✕: TC-140, TC-141
- AI Enhance page → as ✕: TC-142; processing mask: TC-143
- Confirm Dialog → as 「Cancel」: TC-144; Discard Dialog → as 「Keep Editing」: TC-145
- Saving: TC-146; Batch Save page → as ‹: TC-147
- Picker opened from 「Edit Next Batch」 → Launcher: TC-148
- Manual pixel input with keyboard → keyboard first: TC-149

### Hidden clauses

| Requirement | Hidden clause | Observed through | Rows |
|---|---|---|---|
| R-111 | Enhance runs Standard · Portrait | result look compared with the single Edit Room AI Enhance Standard · Portrait on the same photo; app log after a log pull | TC-095 |
| R-124 | Retry reruns only the failed photos | count k / N on the retry loading screen, successful photos unchanged, app log | TC-103 |
| R-127 | Retry reruns only the unfinished photos; offline it does not start | k / N count on the retry loading screen, finished photos unchanged, toast | TC-108, TC-107 |
| R-128 | finished results not kept on the device after a kill | relaunch, gallery and My AI Artwork | TC-111 |
| R-143 | Standard results not saved to My AI Artwork | My AI Artwork after a batch enhance and save | TC-112 |
| R-151 | new files, originals not overwritten | Gallery / file manager: originals unchanged, new files dated now | TC-125 |
| R-152 | unedited photos saved too | Gallery count = N new files | TC-126 |
| R-158 | rating dialog counts a batch as one save | rating dialog timing over several batch saves (needs the rating trigger count from RD) | TC-136 |

### Variants

| Requirement | Variant | Rows |
|---|---|---|
| R-004 | Free user (Crop / Adjustment free) | TC-082 |
| R-004 | Premium user (AI Enhance without credits) | TC-093 |
| R-013 | Free user, 20 photos (no IAP at any count) | TC-156 |
| R-013 | Premium user, 20 photos | TC-011 |
| R-234 | Crop & Rotate room | TC-153, TC-162, TC-042, TC-062, TC-063 |
| R-234 | Adjustment room | TC-164, TC-075, TC-076, TC-165 |
| R-236 | width / height linked | TC-163 |
| R-236 | width / height unlinked | TC-059 |
| R-237 | Curve | TC-166 |
| R-237 | HSL | TC-168 |
| R-229 | photos already enhanced (enhanced again) | TC-157 |
| R-229 | photo whose Enhance was undone | TC-097 |
| R-231 | HSL values | TC-158 |
| R-231 | Curve values | TC-158 |
| R-119 | Free user | TC-098 |
| R-119 | Premium user | TC-092 |
| R-012 | 「Edit」 picker | TC-005 |
| R-012 | 「AI Enhance」 shortcut picker | TC-006 |

### Flow arrows walked by existing rows

The PDF has no Figma links, so arrows are read from the drawn flows (`arrows.json`, node = `<board>-a<n>`).
- R-200 [PM:entry-edit flow arrow entry-edit-a1 ] Launcher 「Edit」 → Photo Picker (Single by default). Walked by: TC-001.
- R-201 [PM:entry-edit flow arrow entry-edit-a2 ] Picker Batch 「Done」 → Batch Edit Room main. Walked by: TC-018.
- R-202 [PM:entry-edit flow arrow entry-edit-a3 ] Main 「Crop & Rotate」 → Crop & Rotate room. Walked by: TC-029.
- R-203 [PM:entry-edit flow arrow entry-edit-a4 ] Picker ‹ → Launcher. Walked by: TC-016.
- R-204 [PM:entry-edit flow arrow entry-edit-a5 ] Crop & Rotate ✓ → main. Walked by: TC-068.
- R-205 [PM:flow-adjustment flow arrow flow-adjustment-a1 ] Main 「Adjustment」 → Adjustment room. Walked by: TC-069.
- R-206 [PM:flow-adjustment flow arrow flow-adjustment-a2 ] 「All」 → 「Applied to 11 photos」. Walked by: TC-071.
- R-207 [PM:flow-adjustment flow arrow flow-adjustment-a3 ] Adjustment ✓ → main. Walked by: TC-081.
- R-208 [PM:flow-ai-enhance flow arrow flow-ai-enhance-a1 ] Main 「AI Enhance」 → AI Enhance page. Walked by: TC-083.
- R-209 [PM:flow-ai-enhance flow arrow flow-ai-enhance-a2 ] 「Enhance」 → Confirm Dialog. Walked by: TC-086.
- R-210 [PM:flow-ai-enhance flow arrow flow-ai-enhance-a3 ] 「Start」 → processing. Walked by: TC-089.
- R-211 [PM:flow-ai-enhance flow arrow flow-ai-enhance-a4 ] processing → result summary. Walked by: TC-101.
- R-212 [PM:flow-ai-enhance flow arrow flow-ai-enhance-a5 ] 「Cancel」 → AI Enhance page. Walked by: TC-087.
- R-213 [PM:flow-ai-enhance flow arrow flow-ai-enhance-a6 ] AI Enhance ✕ → main. Walked by: TC-100.
- R-214 [PM:entry-enhance-shortcut flow arrow entry-enhance-shortcut-a1 ] Launcher 「AI Enhance」 → Picker. Walked by: TC-006.
- R-215 [PM:entry-enhance-shortcut flow arrow entry-enhance-shortcut-a2 ] Picker Batch 「Done」 → AI Enhance page. Walked by: TC-019.
- R-216 [PM:entry-enhance-shortcut flow arrow entry-enhance-shortcut-a3 ] Picker ‹ → Launcher. Walked by: TC-017.
- R-217 [PM:free-user-iap flow arrow free-user-iap-a1 ] Free user 「Enhance」 → Premium IAP. Walked by: TC-098.
- R-218 [PM:batch-one flow arrow batch-one-a1 ] Batch 「Done」 with 1 photo → single Edit Room. Walked by: TC-014.
- R-219 [PM:batch-one flow arrow batch-one-a2 ] Single Edit Room Replace photo → Picker (Batch available). Walked by: TC-020.
- R-220 [PM:save-flow flow arrow save-flow-a1 ] Save → 「Saving k / N」. Walked by: TC-122.
- R-221 [PM:save-flow flow arrow save-flow-a2 ] Saving → Batch Save page. Walked by: TC-128.
- R-222 [PM:save-flow flow arrow save-flow-a3 ] Save page ‹ → Batch Edit Room. Walked by: TC-131.
- R-223 [PM:save-flow flow arrow save-flow-a4 ] Save page Home → Launcher. Walked by: TC-132.
- R-224 [PM:save-flow flow arrow save-flow-a5 ] 「Edit Next Batch」 → Picker Batch tab, nothing selected. Walked by: TC-133.
- R-225 [PM:leave-flow flow arrow leave-flow-a1 ] Picker 「Done」 → main. Walked by: TC-018.
- R-226 [PM:leave-flow flow arrow leave-flow-a2 ] Home / Replace photo after an edit → Discard Dialog. Walked by: TC-115, TC-117.
- R-227 [PM:leave-flow flow arrow leave-flow-a3 ] 「Discard」 from Replace photo → Picker Batch tab, photos still selected. Walked by: TC-117.
- R-228 [PM:leave-flow flow arrow leave-flow-a4 ] 「Keep Editing」 → Batch Edit Room. Walked by: TC-118.
- R-235 [PM:leave-flow flow arrow leave-flow-a5 ] Photo Picker ‹ (opened by 「Edit Next Batch」) → Batch Edit Room main with the edits (red arrow new in UI UX flow 2). Walked by: TC-134, TC-148.

### Domain rules

| Entry | Requirements |
|---|---|
| KP-134 | R-104 |
| KP-012 | n/a (batch has no paid mode split: Free and Premium are R-004, R-013, R-119) |
| KP-014 | n/a (PM: no AI Exposure in the batch Adjustment room, R-090; Design draws it: Q-18) |
| KP-015 | n/a (no purchase in this feature) |
| KP-016 | n/a (no free trial in batch, R-119) |
| KP-017 | n/a (batch AI Enhance deducts no credits, R-004) |
| KP-018 | n/a (no Credit Auto Pass) |
| KP-019 | R-112, R-136 (every Enhance tap opens the Confirm Dialog; one batch per Start) |
| KP-020 | n/a (the batch AI Enhance page shows no credit count, R-113; a pill drawn on the Discard frame: Q-19) |
| KP-021 | n/a (no chat) |
| KP-024 | n/a (spec: Standard batch results are not saved to My AI Artwork, R-143) |
| KP-025 | n/a (no AI Exposure in batch, R-090) |
| KP-026 | n/a (no History button drawn in the batch AI Enhance room; Q-19 notes one on the Discard frame) |
| KP-027 | n/a (batch results are not artworks, R-143) |
| KP-028 | n/a (no Artwork filter) |
| KP-029 | n/a (batch Enhance runs in the foreground under a mask, R-120) |
| KP-030 | R-151, R-062 (saved files from each edited photo) |
| KP-032 | n/a (Batch Edit is not opened from Edit Room, R-002) |
| KP-033 | R-022 (the batch_edit deeplink; no style to preselect) |
| KP-034 | n/a (no Discover tip) |
| KP-035 | n/a (AI Replace) |
| KP-036 | n/a (no prompt) |
| KP-037 | n/a (AI Try-On) |
| KP-038 | n/a (AI Group Shot; batch picking is R-013, R-014, R-019) |
| KP-039 | n/a (no Agent) |
| KP-040 | R-050, R-057 (one crop state per photo; Apply to all carries ratio, rotation, flips) |
| KP-041 | R-081, R-082, R-098 (the batch rooms keep their own shared history; Design draws no reset in Crop) |
| KP-042 | n/a (no restored state) |
| KP-043 | n/a (Video Editing) |
| KP-044 | R-085, R-086, R-102, R-103 (✕ drops, ✓ keeps) |
| KP-045 | n/a (Video Editing) |
| KP-046 | n/a (Try-On / Hairstyle) |
| KP-047 | n/a (no masks) |
| KP-048 | n/a (English UI only in this table) |
| KP-049 | n/a (placeholders 「{xx}」 / 「n/20」 checked in English only) |
| KP-050 | n/a (no RTL run) |

### Request ledger coverage

| Ledger entry | Requirements |
|---|---|
| REQ-001 | every requirement of this table (first Android draft) |
| REQ-003 | R-013, R-015, R-019, R-022, R-031, R-038, R-050, R-090, R-116, R-123, R-130, R-150, R-153, R-155, R-229, R-230, R-231, R-232, R-233, R-234, R-235 (Design frames and UI UX flow 2) |
| REQ-004 | R-015, R-016, R-017, R-020, R-021, R-123, R-153 (Design copy over PM wording) |
| REQ-011 | R-051, R-103, R-104, R-232, R-234, R-236, R-237, R-238 (PM Figma rules the PDF lacks; spec agent comparison) |
| REQ-010 | every requirement of this table (kept over main's Android v1 when the branch merged main, re-saved as v4) |
- Q-15 The PM entry board now plans a Launcher Batch Edit shortcut (icon to be designed after Meitu) and the deeplink `phd://navigate/page?name=batch_edit`, while D0-04 still says Batch Edit appears only in the two pickers. Where do the shortcut and the deeplink land (Photo Picker on 「Batch」?), and is the shortcut in 26'11/E? Assumption: the deeplink opens the Photo Picker on 「Batch」; rows record it. (R-022, TC-022, TC-152)
- Q-18 PM (re-exported 2026-11-09) says the Adjustment room shows no AI Exposure; every Design Adjustment frame draws 「AI Exposure」 between 「Exposure」 and 「Contrast」. Which holds? Assumption: PM (no AI Exposure); the row records what the app shows. (R-090, TC-070)
- Q-19 The Design draws the Discard Dialog over the AI Enhance page (with a credit pill 「100」 and a history icon at the top right), while PM says ✕ on that page returns to Batch Edit Room keeping the results and the dialog comes from Home / Replace photo. Does ✕ (or Back) on the AI Enhance page ask to discard, and does that page show a credit pill? Assumption: PM (no dialog, results kept). (R-130, TC-100, TC-142)
- Q-20 Batch Save page title: Design 「Save 12 photos」, PM 「Saved 12 photos」 (D1-07). Assumption: the Design copy. (R-153, TC-128)
- Q-21 The Design adds a feedback button (speech bubble with !) to the Batch Edit Room top bar; PM lists only Home, Replace photo, Save and Setting. Is it in the batch room, and what does it open? Assumption: present; rows record what opens. (R-031, TC-024, TC-154)
- Q-22 The Design Crop & Rotate room has ‹ at the top left as well as ✕ at the bottom. Is ‹ the same as ✕ (drop the room's changes) or as ✓? Assumption: same as ✕; rows record it. (R-050, TC-155)
