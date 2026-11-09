# Batch Editing — requirements (android)
Spec: UI UX flow.pdf (PM "Demo + Spec", Batch Edit, 26'11/E) and Section 3 · 美圖 Apply to all 實測.pdf (crop Apply to
all decision), spec set 2026-10-30.

Source tags: `[PM:<board>; <rule IDs>]`, board IDs from `specs/2026-10-30/extracted/boards.json`, rule IDs as the boards
print them (`D1-08`, `DR-05b` …); `[S3:<board>]` for Section 3 · 美圖 Apply to all 實測. The flow file is PM-owned and also
carries the UI; there is no separate Design or MX file. Mockups are iPhone frames; Android differences are in "System
back". No Figma links were supplied: PDF-only analysis (`figma-pending.json`). Request ledger: REQ-001 (this table).

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
- R-013 [PM:picker-batch; DR-01] Only the 「Batch」 tab allows several photos; at most 20 (the same on both platforms, so Android is not held to a lower cap).
- R-014 [PM:picker-batch; D2-01] Selected thumbnails show their selection order 1, 2, 3 …; Batch Edit Room lists the photos in that order.
- R-015 [PM:picker-batch, entry-enhance-shortcut; DR-01] The bottom bar of the Batch tab shows the selected count and 「Done」 (copy: Q-1).
- R-016 [PM:picker-batch-one, batch-one; DR-01b] On the 「Batch」 tab, 「Done」 with only one photo selected opens the single-photo Edit Room.
- R-017 [PM:picker-batch-one, batch-one; D1-08c, DR-13] In the single-photo Edit Room, Replace photo opens the Photo Picker, where switching to 「Batch」 and choosing several photos goes to Batch Edit Room.
- R-018 [PM:picker-over-max; DR-01] Selecting a 21st photo is blocked with the toast 「Please pick at most 20 photos.」.

## Entry
- R-020 [PM:entry-edit; D1-01] From the Launcher 「Edit」 picker, Batch tab → 「Done」 lands on the Batch Edit Room main screen.
- R-021 [PM:entry-enhance-shortcut, enhance-default; DR-02] From the Launcher 「AI Enhance」 shortcut picker, Batch tab with several photos → 「Done」 lands directly on the Batch Edit Room AI Enhance page.
- R-022 [PM:entry-batch-shortcut] The board 「Entry: Launcher › Batch Editing shortcut」 draws a Launcher with no shortcut and no note; whether a Launcher Batch Editing shortcut exists is open (Q-2).

## Batch Edit Room
- R-030 [PM:room-default; D1-11, D1-01] The main screen looks like the current Edit Room; its bottom bar has only three buttons, in the order 「Crop & Rotate」 → 「Adjustment」 → 「AI Enhance」, each opening a room like the current feature room.
- R-031 [PM:room-default; D1-11] Top bar: Home and Replace photo at the left; Save (unchanged from Edit Room) and a Setting button at the far right.
- R-032 [PM:room-default; D1-12] A thumbnail strip on the main screen; tapping a thumbnail switches the current photo.
- R-033 [PM:room-default; D1-09] Photos cannot be removed or added in Batch Edit Room (no × on thumbnails, no add button).
- R-034 [PM:room-default; D1-08] Home with no edit yet goes straight to the Launcher; after an edit it opens the Discard Dialog, and 「Discard」 goes to the Launcher.
- R-035 [PM:room-default, leave-flow; D1-08, D1-08b] Replace photo with no edit yet goes straight to the Photo Picker Batch tab; after an edit it opens the Discard Dialog, and 「Discard」 goes to the Photo Picker Batch tab. Both keep the earlier selected photos selected; Discard drops every edit of this Batch Edit.
- R-036 [PM:room-default; DR-05, DR-05d] The main screen's Undo / Redo keeps one history per photo and acts only on the current photo; one visit to a room ended with ✓ is one step in each changed photo's history.
- R-037 [PM:room-default, enhance-done; DR-10b, DR-12e] On the main screen, Undo on an enhanced photo returns only that photo to its pre-Enhance state; Redo brings the Enhance result back.
- R-038 [PM:room-default; DR-10b, DR-12e] After an Enhance was undone, any other edit to that photo clears the Redo: the Enhance result cannot be brought back and that photo cannot be enhanced again.
- R-039 [PM:room-default] The Setting button's target is not stated (Q-3); the compare button drawn on the photo works as in Edit Room (Q-4).

## Crop & Rotate room
- R-050 [PM:crop-default; D1-11, DR-03] The room matches the current Crop & Rotate room (Rotate, Flip, Flip Vertically, Custom, Original, ratios, angle slider, ✕ / reset / undo / redo / ✓), with no title bar above the panel.
- R-051 [PM:crop-default; DR-04] Top right: an 「Apply to all」 button (icon + 「All」, semi-transparent dark capsule). It is a one-shot button, not a checkbox.
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
- R-090 [PM:adjust-default; D1-11, DR-03, DR-06] The room matches the 26'10/E Adjustment room (Light / Color / Details), without Subject Detection and without AI Exposure.
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
- R-104 [PM:adjust-default; DR-05g] Undo / Redo does not switch the Light / Color / Details tab (as the single Adjustment room).
- R-105 [PM:adjust-applied; DR-05b] Apply to all is one step: Undo takes it back on all photos at once.

## AI Enhance
- R-110 [PM:enhance-default; DR-09, DR-12a, D1-11, DR-09b] Batch AI Enhance supports only Standard: no Standard / Advanced tab, no scenario / Scene Presets (General, Portrait, Scenery, Pets, Concert, Product, Anime), only one 「Enhance」 button with 「Maximize detaill and clarity with advanced AI.」 (spelling: Q-10).
- R-111 [PM:enhance-default; DR-09d] The 「Enhance」 button runs the 10/E Standard · Portrait enhancement on each photo.
- R-112 [PM:enhance-default, confirm-dialog; DR-12h, DR-12] 「Enhance」 applies to all photos of the batch and first opens the AI Enhance Confirm Dialog, every time.
- R-113 [PM:enhance-default; DR-11, D5-01b] The 「Enhance」 button shows no credit count and no credits are deducted.
- R-114 [PM:enhance-default; DR-10] Results are applied as soon as they finish; there is no per-photo ✓.
- R-115 [PM:enhance-default; D1-12] The thumbnail strip is above the 「Enhance」 button; tapping a thumbnail switches the current photo.
- R-116 [PM:enhance-done; DR-12e, DR-12c] Each photo can have Standard only once; enhanced photos no longer count in N; when every photo is enhanced the button reads 「Enhanced」 and is disabled.
- R-117 [PM:enhance-done; DR-12e] A photo whose Enhance was undone still counts as enhanced and cannot be enhanced again; the button stays 「Enhanced」 greyed.
- R-118 [PM:enhance-done; DR-12b, DR-12f, DR-12g] Advanced-only rules do not apply to batch. — NOT TESTABLE: no Advanced mode in batch (checked as R-110).
- R-119 [PM:enhance-free, free-user-iap; DR-12d, D3-01, D3-02] A Free user tapping 「Enhance」 goes straight to the existing Premium IAP page; there is no trial of one photo.
- R-120 [PM:enhance-processing; D1-02] Processing uses the current loading screen with 「Creating Your AI Image」 and 「Enhancing k / N」 (k = finished, N = number of enhance requests); the mask covers the whole screen and the thumbnail strip is under it.
- R-121 [PM:enhance-processing; D1-02] While processing, the user cannot switch to Crop & Rotate / Adjustment or tap thumbnails until every photo has finished.
- R-122 [PM:enhance-processing, server-task-notes; D1-03, D1-02] Processing cannot be cancelled and nothing can be saved before it finishes.
- R-123 [PM:enhance-result, server-task-notes; D1-04] Partial failure shows one summary after every photo has finished (no dialog per photo): 「X completed, Y failed」 and 「Failed photos are marked on the thumbnails.」; each failed thumbnail has a red ! at its top right, successful ones none; tapping a failed thumbnail switches to it.
- R-124 [PM:enhance-result; D1-04, DR-12e] The button reads 「Retry Failed (x)」, x = failed photos; Retry reruns only the failed photos, not the successful ones; the ! of a retried photo disappears; a failed photo does not count as enhanced.
- R-125 [PM:enhance-result; D1-04] After a retry the summary counts the whole batch: 15 photos 「12 completed, 3 failed」 → retry 3, 2 succeed → 「14 completed, 1 failed」 and 「Retry Failed (1)」; when all succeed the failure message and the Retry button are gone.
- R-126 [PM:enhance-network, server-task-notes; D1-05, D1-04] Losing the connection counts as failure: finished photos are kept, unfinished photos get a red !, the message is 「X completed, Y failed」 「Connection lost. Check your connection and retry.」; with both failures and a lost connection the counts merge and the second line shows the connection message.
- R-127 [PM:enhance-network, enhance-offline; D1-05] 「Retry Failed (x)」 reruns the unfinished photos; tapped while still offline it shows the toast 「No internet connection」 and does not start.
- R-128 [PM:enhance-network, server-task-notes; D1-05, D1-10] If the app is killed, Batch Edit Room is gone and finished AI Enhance results are not kept (Standard results are not saved to My AI Artwork).
- R-129 [PM:server-task-notes; D1-05] Sending the app to the background pauses processing; it continues on return.
- R-130 [PM:flow-ai-enhance] ✕ on the AI Enhance page returns to Batch Edit Room with the finished Enhance results kept (results are applied when done, R-114).

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
- R-150 [PM:save-saving; D5-01b] While saving, 「Saving k / N」 and 「Please do not leave this page or quit the app.」 are shown with progress; the Batch Save page opens only when saving has finished.
- R-151 [PM:save-saving; D1-06] Every photo is saved as a new file; originals are not overwritten.
- R-152 [PM:save-saving; D1-06] Every input photo is saved, unedited ones included, each as a new file.
- R-153 [PM:save-saved; D1-07] The new Batch Save page shows a thumbnail grid and 「Saved N photos」.
- R-154 [PM:save-saved; D1-07] 「‹」 at the top left returns to Batch Edit Room; Home at the top right goes to the Launcher.
- R-155 [PM:save-saved; D1-07] 「Edit Next Batch」, fixed at the bottom, opens the Photo Picker on the Batch tab with nothing selected; Back from that Picker goes to the Launcher, not to the Save page.
- R-156 [PM:save-saved; D1-07] Thumbnails on the Batch Save page cannot be opened.
- R-157 [PM:save-saved; D1-07] No Video tab and no 「Turn it to video」 on the Batch Save page.
- R-158 [PM:save-saved; D1-07] The rating dialog counts one batch save as one save; IAP flyers and ads appear as usual.

## Tracking
- R-160 [PM:tracking; D0-02, D4-01, D1-07] Events: an enter event (name pending) when the Picker switches to Batch and enters Batch Edit Room; GenAI_Feature_Generate with from = BatchEdit and batch_size, once per photo; Photo_Result_Save per batch save; a new event per 「Edit Next Batch」 tap; names PascalCase in three parts, parameters snake_case. — NOT TESTABLE: analytics, names still pending and no event viewer on the phone.

## Android
- R-170 [Rule: Android system Back, REQ-051] Android system Back on every screen of the feature does what the screen's own back / close does (listed under "System back"); where the spec draws none, the row records what Back does (Q-11).

## Open questions
- Q-1 Picker bottom copy: Launcher 「Edit」 frames show 「Select 1 to 20 photos.」; the AI Enhance shortcut, batch_one and leave-flow frames show 「3 selected (max 20)」 / 「1 selected (max 20)」. Which is the shipping string, and does the count replace the hint once a photo is selected? (R-015)
- Q-2 Board 「Entry: Launcher › Batch Editing shortcut」 has one Launcher frame, no shortcut and no note, while D0-04 says Batch Edit appears only in the two pickers. Is there a Launcher Batch Editing shortcut in 26'11/E? (R-022)
- Q-3 Where does the Setting button in Batch Edit Room's top bar lead (Edit Room settings, save quality)? (R-039)
- Q-4 The compare button on the photo is drawn but not described: same as Edit Room (hold to see the original)? (R-039)
- Q-5 DR-07 says the crop box defaults to centred on each photo, while Section 3 「✅ 結論」 places other photos' boxes at the source's relative position. Rows follow Section 3 (more specific, marked 結論); confirm. (R-061, R-073)
- Q-6 PhD toast copy for a manual pixel value out of range (Meitu: 「Width and height exceed the range」). (R-066)
- Q-7 PM Q1 pending (Judy with Samuel): will batch AI Enhance charge credits like PhD PC (1 credit per 10 photos, fewer than 10 also 1, ⓘ at top left)? Rows follow the current rule: no credits. (R-004, R-113)
- Q-8 PM Q2 pending: lock batch editing to Premium (Meitu shows IAP at the 13th photo, premium allows 50)? Rows follow the current rule: batch free, max 20. (R-013)
- Q-9 Section 3 「Undo（Apply to all 後回到編輯頁按 Undo）」 says one Undo reverts the application on all photos. If 「編輯頁」 means the main screen, it conflicts with D1/DR-05d (main-screen Undo per photo). Rows: in the room all photos (R-087), on the main screen per photo (R-036). Confirm.
- Q-10 「Maximize detaill and clarity with advanced AI.」 has 「detaill」; the Crop panel shows 「Squre」 and Adjustment 「Hightlight」. Typos in the mockups or in the app strings? Rows expect correct spelling.
- Q-11 Android system Back is not specified for Batch Edit Room main (Home or Replace photo behaviour?), the rooms, the processing mask and the saving dialog. Rows record what Back does.
- Q-12 Figma not compared with the PDF: no Figma links were supplied and this machine has no Figma sign-in, so frames newer than the export may be missing (PDF-only analysis).
- Q-13 What happens to the selected photos when the user deselects one on the Batch tab (do the numbers renumber?) and is 「Done」 disabled with none selected? Spec silent; rows record it.
- Q-14 Does 「‹」 on the Batch Save page return to an editable Batch Edit Room (edits kept, Save again saves another N new files)? Spec only says it returns. (R-154)

## Added 2026-10-30 — coverage passes and standing inputs

### Job states

| Job | Start / loading | Success | Failure | Retry | Second failure | Partial success | Stop | Leave and return | Longest wait | Done notice |
|---|---|---|---|---|---|---|---|---|---|---|
| Batch AI Enhance | @ENH_LOAD | @ENH_OK | @ENH_FAIL | @ENH_RETRY | @ENH_RETRY2 | @ENH_PARTIAL | n/a (no cancel by spec, R-122: @ENH_NOCANCEL) | @ENH_BG | @ENH_WAIT | @ENH_OK |
| Batch save | @SAVE_LOAD | @SAVE_OK | n/a (spec silent) | n/a (spec silent) | n/a (spec silent) | n/a (spec silent) | n/a (spec silent) | @SAVE_BG | @SAVE_WAIT | @SAVE_OK |

### Error classes

| Job | Error classes |
|---|---|
| All jobs | n/a (the spec names no error classes; failure copy is checked in Job states) |

### Exit × stage

| Stage | Home / ‹ / ✕ / Cancel | Replace photo | System Back | App killed |
|---|---|---|---|---|
| Batch Edit Room, no edit | @HOME_NOEDIT | @REPL_NOEDIT | @BACK_MAIN_NOEDIT | n/a (nothing to keep; spec silent) |
| Batch Edit Room, edited | @HOME_EDIT | @REPL_EDIT | @BACK_MAIN_EDIT | @KILL_EDIT |
| Crop & Rotate room, changed | @CROP_X | n/a (not on this screen) | @BACK_CROP | n/a (spec silent) |
| Adjustment room, changed | @ADJ_X | n/a (not on this screen) | @BACK_ADJ | n/a (spec silent) |
| AI Enhance page | @ENH_X | n/a (not on this screen) | @BACK_ENH | @ENH_KILL |
| AI Enhance processing | n/a (no control under the mask, R-121) | n/a (under the mask) | @BACK_PROC | @ENH_KILL |
| Saving | n/a (no control) | n/a (no control) | @BACK_SAVING | n/a (spec silent) |
| Batch Save page | @SAVED_BACK | n/a (not on this screen) | @BACK_SAVED | n/a (already saved) |

### System back

- Photo Picker → Launcher (as ‹): @BACK_PICKER
- Batch Edit Room, no edit / edited: @BACK_MAIN_NOEDIT, @BACK_MAIN_EDIT
- Crop & Rotate / Adjustment rooms → as ✕: @BACK_CROP, @BACK_ADJ
- AI Enhance page → as ✕: @BACK_ENH; processing mask: @BACK_PROC
- Confirm Dialog → as 「Cancel」: @BACK_CONFIRM; Discard Dialog → as 「Keep Editing」: @BACK_DISCARD
- Saving: @BACK_SAVING; Batch Save page → as ‹: @BACK_SAVED
- Picker opened from 「Edit Next Batch」 → Launcher: @NEXT_BACK
- Manual pixel input with keyboard → keyboard first: @BACK_PX

### Hidden clauses

| Requirement | Hidden clause | Observed through | Rows |
|---|---|---|---|
| R-111 | Enhance runs Standard · Portrait | result look compared with the single Edit Room AI Enhance Standard · Portrait on the same photo; app log after a log pull | @ENH_PORTRAIT |
| R-124 | Retry reruns only the failed photos | count k / N on the retry loading screen, successful photos unchanged, app log | @ENH_RETRY |
| R-127 | Retry reruns only the unfinished photos; offline it does not start | k / N count on the retry loading screen, finished photos unchanged, toast | @ENH_NET_RETRY, @ENH_OFFLINE |
| R-128 | finished results not kept on the device after a kill | relaunch, gallery and My AI Artwork | @ENH_KILL |
| R-143 | Standard results not saved to My AI Artwork | My AI Artwork after a batch enhance and save | @ENH_ARTWORK |
| R-151 | new files, originals not overwritten | Gallery / file manager: originals unchanged, new files dated now | @SAVE_NEW |
| R-152 | unedited photos saved too | Gallery count = N new files | @SAVE_ALL |
| R-158 | rating dialog counts a batch as one save | rating dialog timing over several batch saves (needs the rating trigger count from RD) | @RATING |

### Variants

| Requirement | Variant | Rows |
|---|---|---|
| R-004 | Free user (Crop / Adjustment free) | @FREE_TOOLS |
| R-004 | Premium user (AI Enhance without credits) | @ENH_CREDITS |
| R-119 | Free user | @ENH_FREE |
| R-119 | Premium user | @ENH_OK |
| R-012 | 「Edit」 picker | @PICK_TABS_EDIT |
| R-012 | 「AI Enhance」 shortcut picker | @PICK_TABS_ENH |

### Flow arrows walked by existing rows

The PDF has no Figma links, so arrows are read from the drawn flows (`arrows.json`, node = `<board>-a<n>`).
- R-200 [PM:entry-edit flow arrow entry-edit-a1 ] Launcher 「Edit」 → Photo Picker (Single by default). Walked by: @PICK_DEFAULT.
- R-201 [PM:entry-edit flow arrow entry-edit-a2 ] Picker Batch 「Done」 → Batch Edit Room main. Walked by: @ENTRY_EDIT.
- R-202 [PM:entry-edit flow arrow entry-edit-a3 ] Main 「Crop & Rotate」 → Crop & Rotate room. Walked by: @CROP_OPEN.
- R-203 [PM:entry-edit flow arrow entry-edit-a4 ] Picker ‹ → Launcher. Walked by: @PICK_BACK.
- R-204 [PM:entry-edit flow arrow entry-edit-a5 ] Crop & Rotate ✓ → main. Walked by: @CROP_OK.
- R-205 [PM:flow-adjustment flow arrow flow-adjustment-a1 ] Main 「Adjustment」 → Adjustment room. Walked by: @ADJ_OPEN.
- R-206 [PM:flow-adjustment flow arrow flow-adjustment-a2 ] 「All」 → 「Applied to 11 photos」. Walked by: @ADJ_APPLY.
- R-207 [PM:flow-adjustment flow arrow flow-adjustment-a3 ] Adjustment ✓ → main. Walked by: @ADJ_OK.
- R-208 [PM:flow-ai-enhance flow arrow flow-ai-enhance-a1 ] Main 「AI Enhance」 → AI Enhance page. Walked by: @ENH_OPEN.
- R-209 [PM:flow-ai-enhance flow arrow flow-ai-enhance-a2 ] 「Enhance」 → Confirm Dialog. Walked by: @CONFIRM_COPY.
- R-210 [PM:flow-ai-enhance flow arrow flow-ai-enhance-a3 ] 「Start」 → processing. Walked by: @ENH_LOAD.
- R-211 [PM:flow-ai-enhance flow arrow flow-ai-enhance-a4 ] processing → result summary. Walked by: @ENH_PARTIAL.
- R-212 [PM:flow-ai-enhance flow arrow flow-ai-enhance-a5 ] 「Cancel」 → AI Enhance page. Walked by: @CONFIRM_CANCEL.
- R-213 [PM:flow-ai-enhance flow arrow flow-ai-enhance-a6 ] AI Enhance ✕ → main. Walked by: @ENH_X.
- R-214 [PM:entry-enhance-shortcut flow arrow entry-enhance-shortcut-a1 ] Launcher 「AI Enhance」 → Picker. Walked by: @PICK_TABS_ENH.
- R-215 [PM:entry-enhance-shortcut flow arrow entry-enhance-shortcut-a2 ] Picker Batch 「Done」 → AI Enhance page. Walked by: @ENTRY_ENH.
- R-216 [PM:entry-enhance-shortcut flow arrow entry-enhance-shortcut-a3 ] Picker ‹ → Launcher. Walked by: @PICK_BACK_ENH.
- R-217 [PM:free-user-iap flow arrow free-user-iap-a1 ] Free user 「Enhance」 → Premium IAP. Walked by: @ENH_FREE.
- R-218 [PM:batch-one flow arrow batch-one-a1 ] Batch 「Done」 with 1 photo → single Edit Room. Walked by: @BATCH_ONE.
- R-219 [PM:batch-one flow arrow batch-one-a2 ] Single Edit Room Replace photo → Picker (Batch available). Walked by: @EDITROOM_REPLACE.
- R-220 [PM:save-flow flow arrow save-flow-a1 ] Save → 「Saving k / N」. Walked by: @SAVE_LOAD.
- R-221 [PM:save-flow flow arrow save-flow-a2 ] Saving → Batch Save page. Walked by: @SAVE_OK.
- R-222 [PM:save-flow flow arrow save-flow-a3 ] Save page ‹ → Batch Edit Room. Walked by: @SAVED_BACK.
- R-223 [PM:save-flow flow arrow save-flow-a4 ] Save page Home → Launcher. Walked by: @SAVED_HOME.
- R-224 [PM:save-flow flow arrow save-flow-a5 ] 「Edit Next Batch」 → Picker Batch tab, nothing selected. Walked by: @NEXT_BATCH.
- R-225 [PM:leave-flow flow arrow leave-flow-a1 ] Picker 「Done」 → main. Walked by: @ENTRY_EDIT.
- R-226 [PM:leave-flow flow arrow leave-flow-a2 ] Home / Replace photo after an edit → Discard Dialog. Walked by: @HOME_EDIT, @REPL_EDIT.
- R-227 [PM:leave-flow flow arrow leave-flow-a3 ] 「Discard」 from Replace photo → Picker Batch tab, photos still selected. Walked by: @REPL_EDIT.
- R-228 [PM:leave-flow flow arrow leave-flow-a4 ] 「Keep Editing」 → Batch Edit Room. Walked by: @KEEP_EDITING.

### Request ledger coverage

| Ledger entry | Requirements |
|---|---|
| REQ-001 | every requirement of this table (first Android draft) |
