# AI Video Enhance — requirements (android)
Spec: Figma only (spec set 2026-11-03, no PDF). Design HceGLJVaxnKsv7gXSXzKWh section 3293:13053 「AI Video Enhance_26.09_v2」
(boards ds-main-flow 3293:13054, ds-routing 3293:14560, ds-entry-points 3293:14642, ds-alt-exception 3293:15052,
ds-ai-video-enhance 3300:32003, ds-cancel 3396:20438); PM mppB4GYkuVMVvHrdBeSAAU page 309:643 (pm-main-flow,
pm-access-credit, pm-timeline, pm-failure-refund, pm-gaps, pm-defaults) and draft section 405:1108 (pm-draft-logic,
pm-draft-notes) [Req: REQ-001, REQ-002]. Page 0:1 (Denoise / Lighting cloud solution) is superseded (REQ-002).

Android table: derived from the iOS draft of the same date. The Design draws iPhone frames only; they count for Android
(inventory.json). Every Precondition and Action was read against Android's controls: no Pink tier switch (the tier
comes from the signed-in account), Google Play billing, logcat instead of the iOS log, Android 12 notification
settings instead of the iOS permission dialog, and system Back on every screen (R-190, `### System back`).

Source rules used here: the Design outranks the PM; where the two disagree the newer dated item wins (analysis pass 7).
The Design carries 「1005_Update」 / 「1005_preview」 labels (10/05), newer than every PM item (9/24, 9/29, 1002), so
the Design decides every conflict it draws. PM-only rules become rows with Notes 「PM-only: no Design frame yet」;
PM [建議] items are proposals (rows at P3, a difference is a PM question, not a defect), [待確認] items are pending
(Open questions), [衝突] items are settled by the Design where it draws them.

Draft 20261104-100851 reruns the analysis on the same spec set under analysis.md passes 10 (a setting's values are
variants: each value used in a generation and checked in the saved file) and 11 (twin and look-alike controls), with
the new Design arrow 3393-18071 [Req: REQ-004]. Changed: R-020, R-031, R-033, R-035, R-054; new: R-191 – R-195,
Q-21, Q-22.

Draft 20261110-160000 (Android) takes the spec agent's 271 colleague-checked Video Enhance cases (TC-VE2-*, snapshot
`spec-agent/android.json`, YAMLs read 2026-11-10) as a source [Req: REQ-008]: their rules win where our spec set is
silent or older (the ECL rate table, form 22061491221; the Android tier, colleague feedback 2026-10-07; the 2K+ import
block, user requirement 2026-10-16; the strip scale, pending PM), our newer Figma wins where theirs follows an older
spec (toast and bubble copy; Mode is Standard on every entry). Every combination of Mode × Enhancement style × fps ×
Resolution is a row (`### Combinations`, analysis pass 10). Changed: R-015, R-034, R-044, R-060, R-062, R-063, R-065,
R-070, R-071, R-087, R-088, R-122, R-194; new: R-196 – R-204, Q-23 – Q-25; answered: Q-3, Q-4.

Draft 20261111-170000 [Req: REQ-011]: the spec agent's main PDF (74bcea79) is a 2026-10-07 export of the old state of
the same 26.09_v2 section, so its cases never override today's board. R-196 (2K+ rejected) is contradicted by the
Design's 預設值規則 (「來源超過最高選項時取最高」) and now states that rule; changed: R-015, R-044, R-196, Q-13;
removed: Q-23 (no 2K+ block, no message to ask about).

## Entry points
- R-001 [DS:ds-main-flow Launcher_2026_08; DS:ds-routing 「Launcher / AI Magic → Demo page」] The Launcher big shortcut 「AI Video Enhance」 opens the Demo page (until 「Don’t show again」 was confirmed, R-009).
- R-002 [DS:ds-entry-points Launcher_AI Magic; DS:ds-routing] The AI Magic tab's 「AI Enhance」 section has an 「AI Video Enhance」 card that opens the Demo page (same rule as R-001).
- R-003 [DS:ds-entry-points Timeline_default; DS:ds-routing 「直接帶入選取的 clip / Timeline 入口，無 Demo page」; PM:pm-timeline §4.1] In the editor, the clip toolbar tool 「AI Video Enhance」 opens the panel directly with the selected clip: no Demo page and no Add Media. (PM calls the tool 「Enhance」; the Design wins.)
- R-004 [DS:ds-main-flow 「1005_Update wording: AI Video Enhance」] The feature is named 「AI Video Enhance」 on the Launcher shortcut, the Demo page and the panel title (PM's 「Video Enhance」 is older).
- R-005 [DS:ds-entry-points Timeline_default] The clip toolbar's 「AI Video Enhance」 tool carries a 「Pro+」 badge. On Android it is 「Pro」: Android sells only Free and Pro, 「Pro+」 is iOS only [Req: REQ-012; KP-006].

## Demo page
- R-006 [DS:ds-main-flow Demo page_Straight video] The Demo page shows a back ‹, the title 「AI Video Enhance」, a sample video, a description, a 「Don’t show again」 checkbox and the button 「Try It Now」.
- R-007 [DS:ds-main-flow; PM:pm-draft-logic A1 [衝突]] The Demo description describes Video Enhance; the Design text 「AI reframe your video for any aspect ratio, then fine-tune the crop in real time.」 is AI Reframe's copy (Q-1).
- R-008 [DS:ds-main-flow arrow 3294-24050] 「Try It Now」 opens Add Media.
- R-009 [DS:ds-routing 「勾 Don't show again 後不再出現」; PM:pm-draft-logic A1 [Design]] After 「Don’t show again」 is ticked and 「Try It Now」 tapped, later entries from the Launcher and AI Magic skip the Demo page and open Add Media.
- R-010 [PM:pm-draft-logic A1 [建議]] Ticking 「Don’t show again」 and leaving with back (without 「Try It Now」) does not save it: the Demo page appears on the next entry.
- R-011 [PM:pm-draft-logic A1 [建議]] Back on the Demo page returns to the entry page (Launcher or AI Magic) without opening Add Media.

## Add Media
- R-012 [DS:ds-main-flow Add Media; PM:pm-draft-logic A2 [Design]] Add Media (title 「Add Media」) shows only the 「Video」 tab and takes one video (v1 single pick).
- R-013 [DS:ds-main-flow arrow 3293-13715; PM:pm-draft-logic A2 [建議]] Tapping a video thumbnail opens the panel with that video (no Next button).
- R-014 [DS:ds-main-flow Add Media ‹] The back ‹ on Add Media returns to the page Add Media was opened from (Q-9).
- R-015 [PM:pm-draft-logic A2 / E1 [建議]; Req: REQ-008] A video the feature cannot take (under 1 s, not MP4 / MOV) is greyed in Add Media and tapping it shows the toast 「This video isn't supported. Try one up to 4K.」 (Q-13). Sources of 2K and up, over 4K included, open the panel (R-196, the Design's lookup; PM E1's 「over 4K」 greying is older, Q-13).
- R-196 [DS:ds-ai-video-enhance 預設值規則 「來源超過最高選項時取最高」 + lookup 1081p → 4K; Req: REQ-011] A source of 2K or higher (1440p, 4K 3840 × 2160, 8K 7680 × 4320; either orientation) opens the panel like any other: 「4K」 is selected, the Preview shows and plays the video and its badge shows the source's own fps and resolution. Before 2026-11-11 this was a 2K+ block taken from the spec agent (TC-VE2-097 / 098), whose PDF is a 2026-10-07 export of the old board state; today's board contradicts it (REQ-011). PM E1's 「≤ 4K」 is older than the Design (Q-13).
- R-202 [Req: REQ-008; spec agent TC-VE2-153, TC-VE2-154, TC-VE2-155, TC-VE2-156, TC-VE2-225 (colleague's build, not in the Design)] Add Media (the 「Video」 tab of R-012) offers every video source of PowerDirector's media picker: the local albums (All / Recents and named albums or folders) and the stock video libraries in its provider tab row (Pexels, Pixabay among them); a supported video picked from any of them opens the panel with that video in the Preview.
- R-016 [PM:pm-draft-logic A2 [建議]] With no videos on the device Add Media shows the empty state 「No videos yet」.

## Panel layout and first-run bubble
- R-020 [DS:ds-main-flow VE · 01 / VE · 02] The panel shows: top bar back ‹, title 「AI Video Enhance」, a credit pill with the balance (「0」 on Free, 「35」 after the purchase) and a Recent task icon; the Preview with play, the time 「00:00/<video length>」 and a full-screen icon; 「Selected Length ⓘ」 with the selected length; the thumbnail strip with a left ‹ and a right › trim handle and the playhead (R-192); 「Mode ⓘ」 Standard / Professional; 「Enhancement style ⓘ」 Natural / Sharp; 「fps」 30fps / 60fps / 120fps; 「Resolution」 720p / 1080p / 4K; the CTA; the line 「Charge X credits per second」 under it.
- R-021 [DS:ds-main-flow 「1005_preview 右下加上影片的來源資訊」] The Preview's lower right shows the source video's frame rate and resolution (「60fps · 1080p」 for a 60 fps 1080p video).
- R-022 [DS:ds-main-flow 「第一次進入此功能跳出 bubble」; PM:pm-draft-logic B2 [Design]] On the first entry to the panel the bubble 「Max 8 minutes. Drag to choose which part.」 appears by itself at Selected Length; it closes after 3 s or on any tap. (PM's first-run card §10.1 is replaced by this bubble; PM B2's proposed copy loses to the Design copy.)
- R-023 [PM:pm-main-flow §10.1; PM:pm-draft-logic B2] The automatic bubble appears only on the first entry, never again.
- R-024 [PM:pm-draft-logic B2 [Design]] The ⓘ next to 「Selected Length」 opens the same bubble again.
- R-025 [DS:ds-ai-video-enhance Settings › Mode] The ⓘ next to 「Mode」 shows the bubble 「Standard: Great quality · up to 8 min」 / 「Professional: Maximum detail · up to 2:30」 (PM 1002 「Standard: Great quality, quick results」 and PM 9/29 「Standard: up to 8 minutes. Professional: up to 2m 30s.」 are older).
- R-026 [DS:ds-ai-video-enhance Settings › Enhancement style; PM:pm-defaults] The ⓘ next to 「Enhancement style」 shows the bubble 「Natural: Lighter enhancement with fewer artifacts, for a more realistic look」 / 「Sharp: Moderate enhancement for a sharp, clear image」.
- R-027 [DS:ds-main-flow VE · 02] The Preview's play button plays the video from the selection and the full-screen icon opens a full-screen preview.
- R-200 [Req: REQ-008; spec agent TC-VE2-163 (generic player rule, not in the Design)] While the Preview plays, the same button pauses it: the time and the frame stop where they are until play is tapped again.
- R-199 [Req: REQ-008; spec agent TC-VE2-276 (user requirement 2026-10-21; the Design draws 「00:00/12:30」 with no rounding rule)] The total after the slash in the Preview time is the source length rounded up to whole seconds: a 150.01 s video reads 「00:00/02:31」, never 「00:00/02:30」.
- R-028 [DS:ds-main-flow arrow 3293-13716] The panel's back ‹ returns to Add Media (from the Timeline entry: R-133).

## Trim and selected length
- R-030 [DS:ds-ai-video-enhance Default / Length; PM:pm-main-flow 9/29 ①; PM:pm-draft-logic B1 [9/29 定案]] The default selection starts at 00:00 and is min(video length, Mode limit) long: a 12:30 video selects 「08:00」, a 01:30 video the whole 「01:30」. Selected Length shows mm:ss (Design; PM's 「5m 00s / 8m max」 and 「18s」 / 「1m 30s」 forms are older).
- R-031 [PM:pm-draft-logic B1 [Design]; DS:ds-ai-video-enhance Length] Either side handle can be dragged: the left ‹ handle moves the start and the right › handle the end; each changes the selected length and the Preview shows the frame at the dragged end. (Two controls, one row each: analysis pass 11.)
- R-032 [PM:pm-draft-logic B1 [Design]] Dragging the middle of the selection moves the whole range at the same length and the Preview shows its first frame.
- R-033 [PM:pm-main-flow 9/29 UI; PM:pm-draft-logic UI 規格] At the Mode limit the dragged handle (left or right) stops, the phone gives a light haptic and a bubble says 「Up to 8 minutes in Standard mode」 (Standard) or 「Up to 2m 30s in Professional mode」 (Professional).
- R-192 [DS:ds-main-flow VE · 01 strip 「00:00」; DS:ds-ai-video-enhance Default / Length (bubbles 「00:00」, 「02:30」, 「01:00」, 「00:14」)] The strip carries a playhead: a line across the strip with a time bubble above it (「00:00」 on entry) and a ◀▶ drag knob (round/ic_btn_drag) under the strip. The bubble shows the same time as the Preview's 「mm:ss/<video length>」 (「00:14」 with 「00:14/01:30」, 「01:00」 with 「01:00/12:30」). The knob is the playhead's, not a trim handle (role read from the board images, analysis pass 11).
- R-193 [DS:ds-ai-video-enhance Length; DS:ds-main-flow VE · 01 knob round/ic_btn_drag] Dragging the playhead knob moves the playhead: the Preview shows the frame under it and the bubble and the Preview time follow; the trim handles, Selected Length and the price do not change (how far it may go: Q-21).
- R-034 [PM:pm-main-flow 9/29 ⑥; PM:pm-draft-logic B1-1 ⑥; Req: REQ-008; spec agent TC-VE2-026, TC-VE2-264 – TC-VE2-267] One strip width stands for the active Mode's limit: in Standard a video ≤ 8:00 fills the strip's width and a longer one scrolls sideways with 8:00 = one strip width; in Professional a video ≤ 2:30 fills the width and a longer one scrolls with 2:30 = one strip width. Switching Mode re-lays the strip to the new limit; the thumbnails stay in time order and the selection keeps its start, end and length. (Follows the spec agent's reading of ⑥, pending PM: Q-24.)
- R-035 [PM:pm-draft-logic B1 [建議]] The shortest selection is 1 s, whichever handle is dragged toward the other.

## Default settings
- R-040 [DS:ds-ai-video-enhance 預設值規則; PM:pm-defaults 1002] On entering the feature Mode is 「Standard」, a fixed value that does not follow the source video.
- R-041 [DS:ds-ai-video-enhance 預設值規則; PM:pm-defaults 1002] Enhancement style is 「Natural」, fixed (deliberately not the API default hd).
- R-042 [DS:ds-ai-video-enhance 預設值規則 「進入功能時自動帶入」] The defaults are set on every entry: a Mode or style changed on one visit is back to Standard / Natural on the next (PM §4.3 「記住上次」 and PM B3's proposal to remember are older than the Design and the 1002 rule).
- R-043 [DS:ds-ai-video-enhance 預設值規則 + 對照表] fps defaults to the smallest option not below the source fps, the highest when the source is above it: source 1–30 → 「30fps」, 31–60 → 「60fps」, 61 and above → 「120fps」. (PM 1002 「nearest, tie lower」 and PM B3 1–45 / 46–90 / 91+ are older.)
- R-044 [DS:ds-ai-video-enhance 預設值規則 + 對照表; Req: REQ-008, REQ-011; spec agent TC-VE2-030, TC-VE2-096] Resolution defaults to the smallest option not below the source resolution: 0–720p → 「720p」, 721–1080p → 「1080p」, 1081p and above → 「4K」 (a source above the highest option takes the highest, so 1440p, 4K and 8K select 4K too, R-196); the 4K output option stays (R-045). (Q-5: which side of a portrait video counts.)
- R-045 [PM:pm-main-flow §5.2] Resolution offers 720p, 1080p and 4K only; there is no 2K option in v1.

## Settings chips
- R-046 [DS:ds-ai-video-enhance Chips 狀態] Each chip group (Mode, Enhancement style, fps, Resolution) has exactly one selected chip; tapping an unselected, enabled chip selects it and unselects the previous one.
- R-047 [DS:ds-ai-video-enhance Chips 狀態 「disable：當前 Mode 不支援此設定，不可點選」] A chip the current Mode does not support is drawn disabled and cannot be selected (which combinations: Q-6).

## Mode length limit
- R-050 [DS:ds-ai-video-enhance Settings › Mode; PM:pm-draft-logic B1 [9/29 定案]] The selection limit is 8:00 in Standard and 2:30 in Professional.
- R-051 [PM:pm-main-flow 9/29 ②; PM:pm-draft-logic B1-1 ①] With a selection ≤ 2:30, Standard and Professional switch freely; the selection does not change, only the credit price updates.
- R-052 [DS:ds-ai-video-enhance Mode 長度上限 「點 Professional → 跳 toast 說明上限，不切換」; PM:pm-main-flow 9/29 ③] With a selection over 2:30 in Standard, the Professional chip looks normal (not disabled); tapping it shows the toast 「Professional supports clips up to 2:30. Shorten your selection to switch.」 for about 3 s, Mode stays Standard and the selection is not changed. (PM 9/29 ③'s toast wording and draft B1-1 ②'s auto-shortening 「…Your selection was shortened.」 lose to the Design.)
- R-053 [DS:ds-ai-video-enhance Mode 長度上限 「縮短到 02:20 → 再點 Professional → 切換成功」] After the selection is shortened to 2:30 or less, tapping Professional switches the Mode.
- R-054 [PM:pm-main-flow 9/29 ⑤] In Professional either handle stops at 2:30 (R-033).
- R-055 [PM:pm-main-flow 9/29 ⑤; PM:pm-draft-logic B1-1 ③] Switching from Professional back to Standard keeps the selection and raises the limit to 8:00; the user can drag it longer. (Draft B1-1 ④ 「restore the earlier selection」 belongs to the auto-shortening the Design rejected.)
- R-056 [PM:pm-main-flow 9/29 limit rule] The selection is rounded up to whole seconds before it is compared with the limit: 2:30.4 counts as 151 s, over 2:30.
- R-197 [Req: REQ-008; spec agent TC-VE2-245 – TC-VE2-250 (PM 9/29 ① 「Professional at entry」, older than the Design 預設值規則 R-040); R-030, R-051, R-052, R-056] The panel never opens in Professional. For sources of 1 s, 30 s, 149.99 s, 150 s, 150.01 s and 12:30 (750 s) the panel opens in Standard with 00:00 – min(length, 8:00) selected; a tap on 「Professional」 then switches for the 1 s, 30 s, 149.99 s (150 s rounded up) and 150 s selections with the selection unchanged, and is refused with the R-052 toast for the 150.01 s (151 s rounded up) and 8:00 selections.
- R-057 [PM:pm-main-flow 9/29 ⑦] On a clip from the Timeline the same rules apply: a selection over 2:30 and a tap on Professional shows the same toast. (Draft B1-1 ⑦ disables the chip with 「Professional mode supports clips up to 2m 30s. Split the clip to use it.」; the Design rule 「Professional 外觀正常，可點」 decides, Q-10.)
- R-058 [PM:pm-draft-logic B1-1 ⑦ + D4 [建議]] A Timeline clip longer than 8:00 does not open the panel; a toast 「Split clips longer than 8 minutes first」 explains it (Q-10).

## Credit price
- R-060 [DS:ds-routing 「價格 = 選取秒數 × 每秒費率」; PM:pm-main-flow §6.1; Req: REQ-008; spec agent TC-VE2-114 – TC-VE2-149, ECL form 22061491221] The price is the selected seconds rounded up to whole seconds × the per-second rate of the chosen Mode, Resolution and output fps (the ECL rate table, R-063); the CTA shows the total (「Enhance ◆ <credits>」).
- R-061 [DS:ds-routing 「長度改變，價格跟著改變」] Changing the selected length updates the CTA price at once.
- R-062 [PM:pm-main-flow §6.1; Req: REQ-008 (ECL: the natural and hd actions carry the same rates)] Enhancement style does not change the price.
- R-063 [PM:pm-main-flow §5 / §6.4 example; Req: REQ-008; spec agent TC-VE2-114 – TC-VE2-149 and TC-VE2-185 – TC-VE2-220, ECL form 22061491221, actions genvideo_1_sec_byteplus_{std|pro}_{natural|hd}_{720p|1080p|4k}_{30|60|120}fps] Per-second rates in credits (Natural and Sharp alike), for 30fps / 60fps / 120fps: Standard 720p 1 / 1 / 1, 1080p 2 / 2 / 2, 4K 3 / 6 / 8; Professional 720p 2 / 4 / 8, 1080p 4 / 8 / 16, 4K 12 / 24 / 48. A 3.96 s selection in 1080p Standard at 30 fps costs 4 s × 2 credits = 8 credits; a 3.2 s selection costs 4 s × the rate. Credit numbers are binding.
- R-064 [DS:ds-main-flow 「Charge X credits per second」; PM:pm-draft-logic C1 [衝突]] Under the CTA the line 「Charge X credits per second」 shows the per-second rate of the current settings (the Design shows both the total and the rate).
- R-065 [PM:pm-main-flow §6.1; PM:pm-draft-logic B4 [衝突]; Req: REQ-008; spec agent TC-VE2-117 – TC-VE2-149 (ECL form 22061491221)] Mode, Resolution and the chosen output fps chip change the price by the R-063 table (PM B4's output fps, not the source fps of the PM main page; Q-3 answered): in Standard 720p and 1080p the fps chip leaves the rate unchanged (1 and 2 for every fps); in Standard 4K and in Professional a higher fps raises it.
- R-066 [PM:pm-main-flow §6.3] Billing uses the SKU genvideo_1_sec_byteplus_{mode}_{style}_{resolution}_{fps} (e.g. std_hd_1080p_30fps) — NOT TESTABLE: server-side billing id, not shown in the app.

## Eligibility and purchase
- R-070 [DS:ds-main-flow VE · 01 「Free user 需要訂閱才能使用」; PM:pm-access-credit §7 / 9/24; Req: REQ-008; spec agent TC-VE2-040, TC-VE2-041, TC-VE2-241 (colleague feedback 2026-10-07 items 8–9, newer than Design and PM 9/24)] On Android the feature unlocks with Pro: a Free user's CTA is an unlock action for Pro (no price; Android wording not drawn, Q-25) and tapping it opens the IAP page; a Pro or Pro+ user gets the enabled 「Enhance ◆ <credits>」. (The Design's 「Unlock Pro+ to Enhance」 and the Pro+-only rule are the iOS rule; PM's 「Upgrade to Pro+」 is older.)
- R-071 [PM:pm-draft-logic C2 [建議]; Req: REQ-008; spec agent TC-VE2-041] On Android the unlock action opens the IAP page on the 「Pro」 tab (Pro IAP). The PM C2 rule that sends a Pro user to the 「Pro+」 tab is the iOS rule: an Android Pro user never sees the unlock action (R-070).
- R-072 [DS:ds-main-flow IAP_US] The IAP page shows the Pro / Pro+ tabs, the plans 「Yearly」 (「Best Value」, 「65% OFF」) and 「Monthly」, 「Continue」, 「Tap to compare」 and the footer 「Terms of Service」 「Privacy Policy」 「Restore purchase」. The trial line 「Receive 35 credits during free trial」 conflicts with PM §7 「no free trial in v1」 (Q-7). On Android the page is a single 「PowerDirector Pro」 page with no tabs and no 「Tap to compare」 (Android sells only Free and Pro) [Req: REQ-012].
- R-073 [PM:pm-draft-logic C2 [建議]] Closing the IAP page or the Credit page without buying returns to the panel unchanged (selection and settings kept).
- R-074 [DS:ds-main-flow arrows 3293-13677, 3293-13678] 「Continue」 opens the store purchase sheet (Google Play on Android); after the purchase the app shows 「You're all set」 / 「Your purchase was successful.」 with 「OK」. That dialog is iOS only: on Android the IAP page closes and the panel is back at once (R-075) [Req: REQ-012].
- R-075 [DS:ds-main-flow arrow 3293-13679; DS:ds-alt-exception 「購買成功 → 回 AI Video Enhance（餘額已更新、選取狀態保留）」; PM:pm-draft-logic C2] After a purchase the app returns to the panel with the balance updated and the selection and settings kept; nothing is sent until the user taps the CTA again (PM C2 [建議]).
- R-076 [DS:ds-alt-exception Insufficient Credits; DS:ds-routing 「餘額不足 → Credit Page」; PM:pm-access-credit §8.1] A Pro+ user whose balance is below the price is taken by 「Enhance」 to the Credit page (「My Credits」, 「Buy More」, 「Expiring within 7 days: 0 credits」, 「Complimentary daily credits」 「Claim once every 24 hours」 「Claim」, the 「PowerDirector Pro+」 card); the video is not uploaded and nothing is charged.
- R-077 [DS:ds-alt-exception 購買成功 → 回 AI Video Enhance] After buying credits with 「Buy More」 the app returns to the panel with the new balance and the selection kept.
- R-078 [DS:ds-alt-exception Credit page_paid] 「Claim」 on the Credit page claims the daily credits; back on the panel the credit pill shows the new balance (balance-updated rule of R-075 / R-077).
- R-079 [PM:pm-draft-logic C2 ① Pro+ → ② network → ③ balance; C3 [建議]] With no network, 「Enhance」 sends nothing and charges nothing; the toast 「Upload failed. Check your connection and try again.」 appears and the panel stays.
- R-080 [DS:ds-routing 「餘額足夠 → 直接生成」; PM:pm-main-flow §2.2] With enough credits 「Enhance」 starts at once, with no extra confirmation.
- R-081 [PM:pm-draft-logic C2 [建議]] The server checks the balance again when the task is sent (a balance spent on another device leads to the Credit page) — NOT TESTABLE: needs two devices racing on one account; the visible result is R-076.

## Generating and cancel
- R-085 [DS:ds-main-flow VE · 03 Generating; DS:ds-cancel] After 「Enhance」 a processing dialog covers the panel: a progress ring (「25%」), 「Video uploading...」, 「Please keep the app open」 and 「Cancel」.
- R-086 [DS:ds-cancel arrow 3393-18476; DS:ds-routing 「取消確認」] 「Cancel」 opens the dialog 「Sure You Want to Leave?」 / 「Your video is still uploading. Leaving this page will cancel the process, and the credits will not be restored.」 with 「Leave」 and 「Keep Uploading」.
- R-087 [DS:ds-cancel; Req: REQ-008; spec agent TC-VE2-234 (colleague feedback item 11)] 「Keep Uploading」 closes the dialog and the upload goes on; the 「Enhance」 CTA behind the dialogs stays disabled until the upload ends, so no second task can start.
- R-088 [DS:ds-cancel arrow 3393-18607; DS:ds-routing 「Leave → 回設定面板 / Leave → credit 不退還 / 使用者主動取消則不退還」] 「Leave」 cancels the process and returns to the panel with 「Enhance」 enabled again [Req: REQ-008; spec agent TC-VE2-235]; the credits are not restored (PM §8 「Cancel while uploading charges nothing, creates no task」 and PM C4's 「Leave = keep running」 lose to the Design, Q-2).
- R-089 [DS:ds-main-flow arrow 3293-13681; PM:pm-main-flow §8 「成功上傳＝commit 點・扣 credit」] When the upload finishes the task moves to Recent task as processing and the balance drops by the CTA price.
- R-090 [PM:pm-draft-logic C3 [建議]] Closing or backgrounding the app while uploading counts as a cancel and charges nothing (Q-18).
- R-091 [PM:pm-main-flow §4.3 「v1 無 cancel，使用者可離開 App」; PM:pm-draft-logic C4 [建議]] After the upload the generation runs on the server in the background: the user may leave the app and it still finishes; a processing task cannot be cancelled in v1.
- R-092 [PM:pm-draft-logic C4 [待確認]] More than one task can run at once (the limit is pending; PM proposes 3 with 「You can run up to 3 enhancements at a time.」, Q-12).
- R-093 [PM:pm-main-flow §4.2 step 6 / §9 / §10.4, arrow 397-1241] When the first background task is created after a successful upload, the dialog 「Turn on notifications」 / 「We'll let you know when it's done.」 with 「Turn On」 and 「Later」 appears. PM-only: no Design frame yet.
- R-094 [PM:pm-draft-logic D1 [建議]] The prompt is shown only when the system notification permission was never asked; 「Turn On」 opens the system permission dialog, or the system notification settings when it was denied (on Android 12 the permission is a setting, granted by default); afterwards the user stays on the Generating screen.
- R-095 [PM:pm-draft-logic D1 [建議]] After 「Later」 the app does not ask again.
- R-203 [Req: REQ-008; spec agent TC-VE2-174 (PM naming decision relayed by their colleague; our spec does not draw the ledger), TC-VE2-185 – TC-VE2-220] Each task's charge appears in the credit history (Credit page › 「Details」) as one debit named 「AI Video Enhance」 for exactly the CTA price.
- R-204 [Req: REQ-008; spec agent TC-VE2-221 – TC-VE2-223 (company performance standard adopted by user instruction, not in the spec)] From the first remaining-time display on the task's Recent task card to its completion (the card turning completed, the completion banner or notification, whichever comes first) takes 1.5 – 2.5 × the selected length: 1.5 – 2.5 s for a 1 s selection, 4.8 – 8 s for 3.2 s, 45 – 75 s for 30 s.

## Background task and notifications
- R-100 [DS:ds-alt-exception 生成完成跳通知; PM:pm-draft-logic D1 [Design]] When a task completes while the user is elsewhere in the app, an in-app banner shows 「Good news! Your AI Video Enhance task has been completed. Tap here to view your results.」 with 「Close」 and 「View」 (PM's push copy is the background case, R-103).
- R-101 [DS:ds-alt-exception arrow 3293-15875; PM:pm-main-flow arrow 377-452] The banner's 「View」 opens the Result of that task.
- R-102 [DS:ds-alt-exception Launcher_2026_08 「Close」] The banner's 「Close」 dismisses it; the task stays completed in Recent.
- R-103 [PM:pm-main-flow §9 「文案為 spec 原文」; PM:pm-draft-logic D1 [建議]] With the app in the background a system notification 「Your video is ready. Tap to view.」 arrives; tapping it opens the Result. PM-only: no Design frame yet.
- R-104 [PM:pm-main-flow §4.3; PM:pm-draft-logic D2 [建議]] The result also appears in AI Magic › My Artwork and in Template › My Artwork.

## Recent task
- R-110 [DS:ds-main-flow Recent · processing / Recent · 完成; PM:pm-draft-logic D2 [Design]] Recent task (title 「AI Video Enhance」, back ‹, ⌂) shows the notice 「Tasks are stored on the cloud for 1 Year. Please download any you want to keep in local storage.」 with 「Manage」 and one card per task.
- R-111 [DS:ds-main-flow Recent · processing] A processing card shows the thumbnail, date and name (「2026/10/21」 「AI Video Enhance 1021」 as drawn), 「processing...」, the time left (「4 minutes left...」) and a progress bar.
- R-112 [DS:ds-main-flow arrows 3293-13680, 3293-13683] When the task is done its card turns completed with 「View」; 「View」 opens the Result.
- R-113 [DS:ds-main-flow Recent icon on VE · 02; PM:pm-draft-logic D2 [待確認]] The Recent task icon in the panel's top bar opens Recent task.
- R-114 [DS:ds-main-flow arrow 3293-13718; PM:pm-main-flow arrow 383-2678] Back ‹ on Recent task returns to the panel.
- R-115 [DS:ds-alt-exception arrow 3293-15874] ⌂ on Recent task opens the Launcher.
- R-116 [DS:ds-main-flow 「Manage」] 「Manage」 opens the management of the stored tasks (Q-8).
- R-117 [DS:ds-main-flow 「Tasks are stored on the cloud for 1 Year」] Tasks are kept on the cloud for one year — NOT TESTABLE: needs a year.
- R-198 [DS:ds-main-flow 「Tasks are stored on the cloud for 1 Year」; Req: REQ-008; spec agent TC-VE2-077] The part of the one-year retention a run can see: a completed task stays on Recent task after the app is closed and reopened, and its 「View」 still opens its Result after the longest wait the run allows (days later, not only minutes); the one-year limit itself is confirmed with RD (R-117).

## Result
- R-120 [DS:ds-main-flow result; DS:ds-alt-exception result] The Result page shows back ‹, the tabs 「Original」 / 「Result」 (Result selected), the video with play, a progress slider and the time (「04:48/08:00」), and the buttons 「Save Result」, 「Add to Timeline」 and 「Enhance More」 (PM 「Edit More」 is older; PM D3 [衝突] settles it).
- R-121 [DS:ds-main-flow result] 「Original」 shows the source video and 「Result」 the enhanced one.
- R-201 [Req: REQ-008; spec agent TC-VE2-168 (generic player rule, not in the Design)] While the Result video plays, the same button pauses it: the time and the frame stop where they are until play is tapped again.
- R-122 [DS:ds-routing 「Save Result → 存到手機」; PM:pm-draft-logic D3 [建議]; Req: REQ-008; spec agent TC-VE2-236 (colleague feedback item 14)] 「Save Result」 saves the video to the phone as a new file, with the toast 「Saved to your device」 (「Couldn't save. Try again.」 on failure); the saved file is listed under 「All」 in PowerDirector's media picker and can be used on a timeline.
- R-123 [DS:ds-routing 「Add to Timeline → 開新 timeline」 + 「Add to Timeline 是開一條新的 timeline，不取代原 clip」] 「Add to Timeline」 opens a new project with the result on its timeline; it does not replace a clip in an existing project.
- R-124 [DS:ds-main-flow arrow 3293-13720; DS:ds-routing 「Edit More → 回 Media Room」] 「Enhance More」 opens Add Media for the next video.
- R-125 [DS:ds-main-flow result ‹] Back ‹ on the Result page returns to the page it was opened from (Q-9).
- R-126 [DS:ds-routing 「所有 Enhance 功能皆耗 credit，一律雲端生成後另存新片」] The result is a new video: the source video in the album is kept unchanged.
- R-194 [DS:ds-routing 設定面板 「Trim + Mode / Enhancement style / fps / Resolution」 and 「一律雲端生成後另存新片」; PM:pm-main-flow §6.3 SKU {mode}_{style}_{resolution}_{fps}; Rule: analysis pass 10, a setting's values are variants (2026-11-04); Req: REQ-004] The task is made with the values chosen on the panel when 「Enhance」 is tapped: the saved result has the chosen Resolution (720p = 1280 × 720, 1080p = 1920 × 1080, 4K = 3840 × 2160 for a landscape source), the chosen fps (30 / 60 / 120) and the selected length, and the charge is the CTA price those values set (R-060, R-062, R-065, R-089). Each value of Mode, Enhancement style, fps and Resolution is used in a generation (`### Variants`), and every combination of the four is priced, generated and checked once (`### Combinations`, 36 rows) [Req: REQ-008; spec agent TC-VE2-171, TC-VE2-172, TC-VE2-185 – TC-VE2-220].
- R-195 [DS:ds-ai-video-enhance Settings › Mode and Enhancement style bubbles; Req: REQ-004] The Mode and style values show in the result as their bubbles say: Professional 「Maximum detail」 (more detail than Standard's 「Great quality」); Sharp 「Moderate enhancement for a sharp, clear image」 (sharper than Natural's 「Lighter enhancement with fewer artifacts, for a more realistic look」).

## Timeline entry
- R-130 [PM:pm-timeline arrow 397-1887; DS:ds-entry-points] From the Timeline, the tool opens the panel with the selected clip; after 「Enhance」 the flow is the main one (upload, Recent task, notice).
- R-131 [PM:pm-timeline arrow 397-1921 「Applied Video Enhance」; PM:pm-draft-logic D4 [建議] 「Video Enhance applied」 3 s] After a Timeline task succeeds, the result replaces the original clip on the timeline and the app shows 「Applied Video Enhance」. PM-only: no Design frame yet (Design v2 does not draw the paste-back; Q-11).
- R-132 [PM:pm-draft-logic D4 [建議]] If the clip was deleted or the project closed during generation, nothing is pasted back and the result stays in Recent task.
- R-133 [DS:ds-routing Timeline entry] Back ‹ on a panel opened from the Timeline returns to the editor with the project unchanged.
- R-134 [PM:pm-draft-logic D4 [建議]] On a Result opened for a Timeline task, 「Add to Timeline」 returns to the original project.

## Failure and refund
- R-140 [DS:ds-alt-exception Generation Failed; DS:ds-routing 失敗卡片; PM:pm-failure-refund] A failed task's card shows an 「Error」 thumbnail and 「View Details」.
- R-141 [DS:ds-alt-exception Recent dialog; PM:pm-failure-refund arrow 377-1127] 「View Details」 opens the dialog 「An Error Has Occurred」 / 「Credits have been refunded.」 / 「The server may be busy. Please try again later or use a different video.」 with 「OK」; 「OK」 closes it.
- R-142 [DS:ds-routing 「生成失敗系統自動退還 credit」; PM:pm-failure-refund §8.6; KB: KP-007] A failed generation refunds its credits automatically (the balance is back to what it was before the task); there is no Retry.
- R-143 [PM:pm-draft-logic D1 [建議]] A failure in the background sends the notification 「Video Enhance didn't finish. Your credits have been refunded.」 (Q-16).

## System back (Android)
- R-190 [Rule: Android system Back, analysis pass 8 (user, 2026-10-28)] On every page, sheet, dialog and full-screen view of the feature, system Back does what the screen's own ‹ / Cancel / close does; where the screen has no exit of its own it must not leave silently (Q-20).

## Open questions
- Q-1 Demo page description: the Design draws AI Reframe's text 「AI reframe your video for any aspect ratio, then fine-tune the crop in real time.」; PM A1 [衝突] proposes 「Make blurry, noisy or dark videos look sharp and clear.」. Assumption: the description must not be AI Reframe's; the PM proposal is the expected text until the Design changes. R-007 (TC-011).
- Q-2 Cancel during upload: Design 「Leaving this page will cancel the process, and the credits will not be restored.」 vs PM §8 (Cancel before the upload reaches the server charges nothing and creates no task) and PM C4 (Leave = keep running in the background). Assumption: the Design (newer, outranks): Leave cancels, back to the panel, credits not restored. R-088 (TC-113).
- Q-5 Resolution of a portrait video: which side decides (PM B3 proposes the short side, 1080×1920 = 1080p). Assumption: short side. R-044 (TC-059).
- Q-6 Disabled chips: which fps / Resolution combinations each Mode supports (BytePlus table [待確認]); the Design says a disabled chip cannot be tapped, PM B5 says a tap shows a toast. Assumption: a tap on a disabled chip changes nothing and shows no toast; the ECL table prices all 36 combinations, so every combination row expects its chips enabled, and a combination row whose chip is disabled on the build is recorded Blocked as a question. R-047 (TC-064, the combination rows TC-219 – TC-224, TC-225 – TC-254).
- Q-7 Pro+ trial: the IAP page offers 「Try Pro+ 7 days for free」 and 「Receive 35 credits during free trial」 while PM §7 says no free trial in v1 (PM C2 [衝突]). Assumption: no row asserts the trial; the IAP page is checked as the Design draws it. R-072 (TC-093).
- Q-8 「Manage」 on Recent task: the spec does not say what it opens. Assumption: a page to manage (download / delete) stored tasks. R-116 (TC-144).
- Q-9 Back from Add Media and from the Result page: the spec draws ‹ but no arrow. Assumption: the previous page. R-014, R-125 (TC-021, TC-155).
- Q-10 Timeline clip limits: PM 9/29 ⑦ (same trim rules, toast) vs draft B1-1 ⑦ / D4 (whole clip locked, Professional chip disabled for 2:30–8:00 clips, clip > 8:00 does not open). Assumption: the Design rule 「Professional 外觀正常，可點」 and ⑦ (toast) for 2:30–8:00; clip > 8:00 does not open (both PM drafts). R-057, R-058 (TC-160, TC-161).
- Q-11 Timeline result: PM pastes the result back over the clip (「Applied Video Enhance」, form TBD), the Design routing note says every Enhance result is saved as a new video and 「不取代原 clip」. Assumption: PM paste-back for the Timeline entry (the Design note is about Add to Timeline); check on device. R-131 (TC-162).
- Q-12 Concurrent tasks [待確認] (PM proposes up to 3). Assumption: a second task can start while one is processing. R-092 (TC-121).
- Q-13 Supported sources [待確認]: length ≥ 1 s, MP4 / MOV (H.264 / HEVC), ≤ 4K; whether a 4K source can be used (draft notes, Gap 1). The Design's 預設值規則 (newer, 1005 labels) takes the highest option for a larger source, so 2K, 4K and 8K sources open the panel with 4K (R-196, REQ-011); PM E1's 「≤ 4K」 and its greying of larger sources stay open for PM. Assumption for the rest: PM E1 proposal (under 1 s and not MP4 / MOV are greyed with the toast). R-015, R-196 (TC-022).
- Q-14 Disclosure: whether the existing GenAI consent dialog (covering the ByteDance cloud) is shown before the first upload (PM Open question 3, Legal). No row asserts it; a consent dialog on first use is recorded, not filed.
- Q-15 The panel's credit pill: the spec does not say what tapping it opens. Its control is n/a until PM answers.
- Q-16 Notifications: failure push (PM Gap 8, D1 [建議]) and the push copy for success are PM-only; the Design draws only the in-app banner. Assumption: Design copy in the app, PM copy for the system notification. R-100, R-103, R-143.
- Q-17 Recent task entry and processing style [待確認] (Gap 7): the Design draws a Recent icon on the panel and 「4 minutes left...」; assumption: as drawn. R-111, R-113.
- Q-18 Backgrounding or closing the app during the upload: PM C3 [建議] (cancel, no charge) vs the Design rule that a user cancel is not refunded. Assumption: PM C3 (the Design does not draw backgrounding); check on device. R-090 (TC-115).
- Q-19 Selected Length format and the limit display: PM 9/29 「5m 00s / 8m max」 and B1 「18s」 vs the Design 「08:00」. Assumption: the Design (mm:ss, no 「/ max」). R-030.
- Q-20 (Android) System Back on screens the spec gives no Back rule: the bubbles, the processing dialog, the leave dialog and the notification prompt. Assumption: a bubble closes; the processing dialog asks first like its 「Cancel」; the leave dialog and the prompt take the safe answer (「Keep Uploading」, 「Later」). R-190 (TC-203, TC-204, TC-205, TC-211).
- Q-21 Playhead: the Design draws a playhead on the strip (a line, a time bubble and a ◀▶ knob) but no note says how far it may be dragged (only inside the selection, or the whole video) or whether play starts from it. Assumption: dragging it scrubs the Preview inside the selection and changes neither the selection nor the price. R-192, R-193 (TC-215).
- Q-22 Completed task card: PM D2 says a completed card opens the Result when tapped (「Completed (tap → Result)」); the Design draws only the 「View」 button. Assumption: tapping the card's thumbnail opens the same Result as 「View」. R-112 (TC-143).
- Q-24 Strip scale (REQ-008): PM 9/29 ⑥ says the strip's scale depends only on the video length and a Mode switch does not re-lay it (our v3 reading); the spec agent reads the same note as one strip width = the active Mode's limit (8:00 Standard, 2:30 Professional), re-laid on a Mode switch. Neither source is newer. Assumption: the spec agent's reading, pending PM confirmation of PM 9/29 ⑥; a difference on the build is a PM question, not a defect, until PM confirms. R-034 (TC-045, TC-264).

## Answered questions
- Q-25 Android unlock wording (REQ-008): the colleague feedback of 2026-10-07 makes Pro the Android tier, but no Design frame draws the Android CTA (the iPhone frame reads 「Unlock Pro+ to Enhance」), and the clip toolbar badge 「Pro+」 (R-005) is drawn for iOS too. Assumption: the CTA names Pro (e.g. 「Unlock Pro to Enhance」) and opens the IAP on the Pro tab; its exact words and the badge are recorded, not asserted. R-070, R-071, R-005 (TC-090, TC-004). Answer (2026-11-11, REQ-012, reviewer ruling on batch 2): Android has only Free and Pro; 「Pro+」 is iOS only, so the badge reads 「Pro」 and the IAP is a single Pro page (R-005, R-072); the 「You're all set」 dialog is iOS only (R-074).
- Q-3 Which fps prices a task: PM main page said the source fps, PM B4 [衝突] proposed the output fps. Answer (2026-11-10, REQ-008; spec agent TC-VE2-117 – TC-VE2-149, ECL form 22061491221): the chosen output fps chip prices the task, by the ECL table. R-065 (TC-087, the combination rows).
- Q-4 Per-second rate table: only 1080p Standard 30 fps = 2 credits/s was stated. Answer (2026-11-10, REQ-008; spec agent TC-VE2-185 – TC-VE2-220 fixtures, ECL form 22061491221): the full table is R-063 (Standard 720p 1/1/1, 1080p 2/2/2, 4K 3/6/8; Professional 720p 2/4/8, 1080p 4/8/16, 4K 12/24/48 for 30/60/120fps; Natural = Sharp). R-063, R-065 (TC-083, TC-087, the combination rows TC-219 – TC-224, TC-225 – TC-254).

## Added 2026-11-04 — coverage passes and standing inputs

### Job states
Rows = jobs, columns = states (coverage pass 2).

| Job | Start / loading | Success | Failure (copy and refund) | Retry | Second failure | Partial success | Stop (notice and credits) | Leave and return | Longest wait | Done notice |
|---|---|---|---|---|---|---|---|---|---|---|
| Upload (foreground) | TC-110 | TC-114 | TC-100 | n/a (spec: no retry; the user taps Enhance again) | n/a (no retry) | n/a (one clip per task) | TC-111, TC-113 | TC-115 | TC-110 | n/a (the task moves to Recent, TC-114) |
| Enhancement (background) | TC-114 | TC-143 | TC-170, TC-171, TC-173 | n/a (no Retry, §8.6; TC-173 checks none) | n/a (no Retry) | n/a (one clip per task) | n/a (v1 has no cancel; TC-117 checks none) | TC-116 | TC-114 | TC-130, TC-133 |
| Save Result | TC-152 | TC-152 | n/a (no fixture makes saving fail; PM [建議] copy only) | n/a (spec silent) | n/a (spec silent) | n/a (one file) | n/a (spec silent) | n/a (spec silent) | TC-152 | TC-152 |

### Error classes
The spec names no error classes; one column for any failure.

| Job | Unclassified failure (the spec names no error classes) |
|---|---|
| Upload (foreground) | TC-100 |
| Enhancement (background) | TC-170, TC-171, TC-173 |

### Exit × stage
Ways out × stages (coverage pass 8).

| Stage | Panel back ‹ | Recent task icon | Leave the app (Home) | Dialog Cancel / Leave | System back |
|---|---|---|---|---|---|
| Panel, idle | TC-038 | TC-140 | n/a (spec silent; nothing is running) | n/a (no dialog) | TC-202 |
| Panel from the Timeline | TC-163 | TC-140 | n/a (spec silent) | n/a (no dialog) | TC-213 |
| Uploading (processing dialog) | n/a (the dialog covers the panel; its Cancel is the exit) | n/a (covered by the dialog) | TC-115 | TC-111, TC-112, TC-113 | TC-204, TC-205 |
| Background generation | TC-141 | TC-140 | TC-116 | n/a (v1 has no cancel, TC-117) | TC-208 |

### System back
One line per screen the feature opens (inventory screens and panels, plus the PM-only screens).

| Screen | Row | System back must |
|---|---|---|
| Demo page | TC-200 | return to the entry page like ‹ |
| Add Media | TC-201 | return like ‹ |
| Panel (from Add Media) | TC-202 | return to Add Media like ‹ |
| Panel (from the Timeline) | TC-213 | return to the editor like ‹ |
| Bubbles (Selected Length, Mode, Enhancement style) | TC-203 | close the bubble (Q-20) |
| Full-screen preview | TC-212 | close it, panel unchanged |
| Processing dialog (uploading) | TC-204 | ask first like 「Cancel」 (Q-20) |
| Leave dialog 「Sure You Want to Leave?」 | TC-205 | act like 「Keep Uploading」 (Q-20) |
| 「Turn on notifications」 dialog (PM-only) | TC-211 | act like 「Later」 (Q-20) |
| IAP page | TC-206 | return to the panel unchanged like ‹ |
| Google Play purchase sheet | n/a (Google's sheet; cancelling it returns to the IAP page, not this spec) | — |
| Credit page | TC-207 | return to the panel unchanged like ‹ |
| Recent task | TC-208 | return to the panel like ‹ |
| Result | TC-209 | return like ‹ |
| 「An Error Has Occurred」 dialog | TC-210 | close like 「OK」 |
| Manage page | n/a (its content is Q-8) | — |

### Hidden clauses
Clauses the screen does not show and how a tester observes them (pass 9).

| Requirement | Hidden clause | Observed through | Rows |
|---|---|---|---|
| R-076 | the video is not uploaded and nothing is charged | the credit pill and the Credit page balance before / after; Recent task has no new card | TC-096 |
| R-079 | nothing is sent or charged offline | the balance before / after; Recent task has no new card | TC-100 |
| R-089 | credits are taken when the upload reaches the server | the balance before Enhance, during the upload and after the card appears | TC-114 |
| R-087 | the upload goes on after Keep Uploading | the processing dialog progress and the card in Recent task | TC-112 |
| R-088 | Leave cancels the process and does not restore credits | the balance before / after; Recent task gets no completed result | TC-113 |
| R-090 | backgrounding while uploading cancels and charges nothing | the balance and Recent task after returning | TC-115 |
| R-093 | the prompt follows only the first successful upload (first background task) | the dialog after the first upload only | TC-118, TC-120 |
| R-091 | the generation keeps running on the server while the app is away | the card completes after the user returns | TC-116 |
| R-110 | tasks are stored on the cloud (one year) | the notice only; the year is NOT TESTABLE (R-117) | TC-140 |
| R-130 | after Enhance the clip is uploaded as in the main flow | the processing dialog and the Recent task card | TC-162 |
| R-126 | the source video is kept unchanged | the source video in the album after the task | TC-153 |
| R-196 | a 2K+ source opens the panel with 4K | 「4K」 selected; the Preview plays; the badge shows the source fps and resolution | TC-022 |
| R-203 | the charge is booked as one debit named 「AI Video Enhance」 | the credit history after each combination generation | TC-219, TC-223 |
| R-198 | the task is kept on the cloud (one year) | the completed card and its Result after closing and reopening the app days later; the year itself is NOT TESTABLE (R-117) | TC-268 |
| R-142 | the refund is automatic | the balance before the task, after the charge and after the failure | TC-173 |

### Variants
One line per requirement × variant (pass 10).

| Requirement | Variant | Rows |
|---|---|---|
| R-005 | Free on Android: the 「Pro」 badge | TC-004 |
| R-005 | 「Pro+」 badge (iOS) | n/a (Android has no Pro+, REQ-012) |
| R-070 | Free (Pro unlock action, IAP) | TC-090 |
| R-070 | Pro (enabled Enhance on Android) | TC-091 |
| R-070 | Pro+ (enabled Enhance) | TC-033, TC-110 |
| R-071 | Free (IAP opens on the Pro tab) | TC-090 |
| R-071 | Pro (IAP on the Pro+ tab: the iOS rule) | n/a (an Android Pro user never sees the unlock action, R-070; TC-091 checks the enabled Enhance) |
| R-071 | Pro+ | n/a (already unlocked, R-070) |
| R-072 | Pro tab | TC-093 |
| R-072 | Pro+ tab | TC-091, TC-093 |
| R-043 | source 1–30 fps → 30fps | TC-052 |
| R-043 | source 31–60 fps → 60fps | TC-053, TC-055 |
| R-043 | source 61+ fps → 120fps | TC-054, TC-055 |
| R-044 | 0–720p → 720p | TC-056 |
| R-044 | 721–1080p → 1080p | TC-057, TC-059 |
| R-044 | 1081p+ → 4K | TC-058, TC-022 |
| R-046 | Mode | TC-070 |
| R-046 | Enhancement style | TC-061 |
| R-046 | fps | TC-062 |
| R-046 | Resolution | TC-063 |
| R-033 | Standard (8:00), right handle | TC-044 |
| R-033 | Standard (8:00), left handle | TC-216 |
| R-033 | Professional (2:30), right handle | TC-074 |
| R-033 | Professional (2:30), left handle | TC-218 |
| R-031 | right handle › | TC-042 |
| R-031 | left handle ‹ | TC-214 |
| R-035 | right handle › | TC-046 |
| R-035 | left handle ‹ | TC-217 |
| R-072 | Pro tab pressed | TC-093 |
| R-194 | Mode=Standard | TC-110, TC-152 |
| R-194 | Mode=Professional | TC-219 |
| R-194 | Enhancement style=Natural | TC-110, TC-152 |
| R-194 | Enhancement style=Sharp | TC-220 |
| R-194 | fps=30fps | TC-110, TC-152 |
| R-194 | fps=60fps | TC-221 |
| R-194 | fps=120fps | TC-222 |
| R-194 | Resolution=720p | TC-223 |
| R-194 | Resolution=1080p | TC-110, TC-152 |
| R-194 | Resolution=4K | TC-224 |
| R-195 | Mode=Professional (look) | TC-219 |
| R-195 | Enhancement style=Sharp (look) | TC-220 |
| R-195 | Standard / Natural (look) | TC-151 |
| R-034 | Standard (8:00 per strip width) | TC-045, TC-264 |
| R-034 | Professional (2:30 per strip width) | TC-045, TC-264 |
| R-197 | sources 1 s, 30 s | TC-260 |
| R-197 | sources 149.99 s, 150 s | TC-261 |
| R-197 | sources 150.01 s, 750 s | TC-262 |
| R-202 | local albums (All / Recents) | TC-020, TC-255 |
| R-202 | named local album | TC-258 |
| R-202 | Pexels | TC-256 |
| R-202 | Pixabay | TC-257 |
| R-204 | 1 s, card completion | TC-265 |
| R-204 | 3.2 s, completion banner | TC-266 |
| R-204 | 30 s, whichever comes first | TC-267 |

### Combinations
Every combination of the four settings the panel lets the user choose together (analysis pass 10, user 2026-11-10,
REQ-008). Each row opens the 3.2 s 720p 30 fps fixture, sets the combination, checks the rate line and the CTA price
at 1 s and at 3.2 s (4 billable seconds × the ECL rate, R-063), generates, checks the charge (balance and the credit
history debit 「AI Video Enhance」, R-203), the Result look (R-195) and the saved file's resolution and fps (R-194).
The ECL table prices every combination, so none is n/a.

- Setting Mode: Standard, Professional
- Setting Enhancement style: Natural, Sharp
- Setting fps: 30fps, 60fps, 120fps
- Setting Resolution: 720p, 1080p, 4K

| Combination | Rows |
|---|---|
| Mode=Standard · Enhancement style=Natural · fps=30fps · Resolution=720p | TC-223 (1/s, 3.2 s → 「Enhance ◆ 4」) |
| Mode=Standard · Enhancement style=Natural · fps=30fps · Resolution=1080p | TC-225 (2/s, 3.2 s → 「Enhance ◆ 8」) |
| Mode=Standard · Enhancement style=Natural · fps=30fps · Resolution=4K | TC-224 (3/s, 3.2 s → 「Enhance ◆ 12」) |
| Mode=Standard · Enhancement style=Natural · fps=60fps · Resolution=720p | TC-226 (1/s, 3.2 s → 「Enhance ◆ 4」) |
| Mode=Standard · Enhancement style=Natural · fps=60fps · Resolution=1080p | TC-221 (2/s, 3.2 s → 「Enhance ◆ 8」) |
| Mode=Standard · Enhancement style=Natural · fps=60fps · Resolution=4K | TC-227 (6/s, 3.2 s → 「Enhance ◆ 24」) |
| Mode=Standard · Enhancement style=Natural · fps=120fps · Resolution=720p | TC-228 (1/s, 3.2 s → 「Enhance ◆ 4」) |
| Mode=Standard · Enhancement style=Natural · fps=120fps · Resolution=1080p | TC-222 (2/s, 3.2 s → 「Enhance ◆ 8」) |
| Mode=Standard · Enhancement style=Natural · fps=120fps · Resolution=4K | TC-229 (8/s, 3.2 s → 「Enhance ◆ 32」) |
| Mode=Standard · Enhancement style=Sharp · fps=30fps · Resolution=720p | TC-230 (1/s, 3.2 s → 「Enhance ◆ 4」) |
| Mode=Standard · Enhancement style=Sharp · fps=30fps · Resolution=1080p | TC-220 (2/s, 3.2 s → 「Enhance ◆ 8」) |
| Mode=Standard · Enhancement style=Sharp · fps=30fps · Resolution=4K | TC-231 (3/s, 3.2 s → 「Enhance ◆ 12」) |
| Mode=Standard · Enhancement style=Sharp · fps=60fps · Resolution=720p | TC-232 (1/s, 3.2 s → 「Enhance ◆ 4」) |
| Mode=Standard · Enhancement style=Sharp · fps=60fps · Resolution=1080p | TC-233 (2/s, 3.2 s → 「Enhance ◆ 8」) |
| Mode=Standard · Enhancement style=Sharp · fps=60fps · Resolution=4K | TC-234 (6/s, 3.2 s → 「Enhance ◆ 24」) |
| Mode=Standard · Enhancement style=Sharp · fps=120fps · Resolution=720p | TC-235 (1/s, 3.2 s → 「Enhance ◆ 4」) |
| Mode=Standard · Enhancement style=Sharp · fps=120fps · Resolution=1080p | TC-236 (2/s, 3.2 s → 「Enhance ◆ 8」) |
| Mode=Standard · Enhancement style=Sharp · fps=120fps · Resolution=4K | TC-237 (8/s, 3.2 s → 「Enhance ◆ 32」) |
| Mode=Professional · Enhancement style=Natural · fps=30fps · Resolution=720p | TC-238 (2/s, 3.2 s → 「Enhance ◆ 8」) |
| Mode=Professional · Enhancement style=Natural · fps=30fps · Resolution=1080p | TC-219 (4/s, 3.2 s → 「Enhance ◆ 16」) |
| Mode=Professional · Enhancement style=Natural · fps=30fps · Resolution=4K | TC-239 (12/s, 3.2 s → 「Enhance ◆ 48」) |
| Mode=Professional · Enhancement style=Natural · fps=60fps · Resolution=720p | TC-240 (4/s, 3.2 s → 「Enhance ◆ 16」) |
| Mode=Professional · Enhancement style=Natural · fps=60fps · Resolution=1080p | TC-241 (8/s, 3.2 s → 「Enhance ◆ 32」) |
| Mode=Professional · Enhancement style=Natural · fps=60fps · Resolution=4K | TC-242 (24/s, 3.2 s → 「Enhance ◆ 96」) |
| Mode=Professional · Enhancement style=Natural · fps=120fps · Resolution=720p | TC-243 (8/s, 3.2 s → 「Enhance ◆ 32」) |
| Mode=Professional · Enhancement style=Natural · fps=120fps · Resolution=1080p | TC-244 (16/s, 3.2 s → 「Enhance ◆ 64」) |
| Mode=Professional · Enhancement style=Natural · fps=120fps · Resolution=4K | TC-245 (48/s, 3.2 s → 「Enhance ◆ 192」) |
| Mode=Professional · Enhancement style=Sharp · fps=30fps · Resolution=720p | TC-246 (2/s, 3.2 s → 「Enhance ◆ 8」) |
| Mode=Professional · Enhancement style=Sharp · fps=30fps · Resolution=1080p | TC-247 (4/s, 3.2 s → 「Enhance ◆ 16」) |
| Mode=Professional · Enhancement style=Sharp · fps=30fps · Resolution=4K | TC-248 (12/s, 3.2 s → 「Enhance ◆ 48」) |
| Mode=Professional · Enhancement style=Sharp · fps=60fps · Resolution=720p | TC-249 (4/s, 3.2 s → 「Enhance ◆ 16」) |
| Mode=Professional · Enhancement style=Sharp · fps=60fps · Resolution=1080p | TC-250 (8/s, 3.2 s → 「Enhance ◆ 32」) |
| Mode=Professional · Enhancement style=Sharp · fps=60fps · Resolution=4K | TC-251 (24/s, 3.2 s → 「Enhance ◆ 96」) |
| Mode=Professional · Enhancement style=Sharp · fps=120fps · Resolution=720p | TC-252 (8/s, 3.2 s → 「Enhance ◆ 32」) |
| Mode=Professional · Enhancement style=Sharp · fps=120fps · Resolution=1080p | TC-253 (16/s, 3.2 s → 「Enhance ◆ 64」) |
| Mode=Professional · Enhancement style=Sharp · fps=120fps · Resolution=4K | TC-254 (48/s, 3.2 s → 「Enhance ◆ 192」) |

### Flow arrows walked by existing rows
- R-150 [DS: flow arrow 3294-24049 https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3294-24049] Launcher 「AI Video Enhance」 shortcut → Demo page. Walked by: TC-001.
- R-151 [DS: flow arrow 3294-24050 https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3294-24050] Demo page 「Try It Now」 → Add Media. Walked by: TC-010.
- R-152 [DS: flow arrow 3293-13715 https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3293-13715] Add Media video thumbnail → panel (VE · 01, Free). Walked by: TC-020.
- R-153 [DS: flow arrow 3293-13716 https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3293-13716] Panel back ‹ → Add Media. Walked by: TC-038.
- R-154 [DS: flow arrow 3293-13717 https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3293-13717] Panel 「Unlock Pro+ to Enhance」 → IAP page. Walked by: TC-090.
- R-155 [DS: flow arrow 3293-13677 https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3293-13677] IAP 「Continue」 → store purchase sheet (Google Play). Walked by: TC-095.
- R-156 [DS: flow arrow 3293-13678 https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3293-13678] Purchase sheet → 「You're all set」 / 「Your purchase was successful.」. Walked by: TC-095.
- R-157 [DS: flow arrow 3293-13679 https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3293-13679] Purchase success 「OK」 → panel (VE · 02, balance updated). Walked by: TC-095.
- R-158 [DS: flow arrow 3293-13682 https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3293-13682] Panel 「Enhance」 → processing dialog (VE · 03 Generating). Walked by: TC-110.
- R-159 [DS: flow arrow 3293-13681 https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3293-13681] Upload done → Recent task, processing card. Walked by: TC-114.
- R-160 [DS: flow arrow 3293-13718 https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3293-13718] Recent task back ‹ → panel. Walked by: TC-141.
- R-161 [DS: flow arrow 3293-13680 https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3293-13680] Task complete → Recent task, completed card. Walked by: TC-143.
- R-162 [DS: flow arrow 3293-13683 https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3293-13683] Completed card 「View」 → Result. Walked by: TC-143.
- R-163 [DS: flow arrow 3293-13720 https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3293-13720] Result 「Enhance More」 → Add Media. Walked by: TC-154.
- R-164 [DS: flow arrow 3388-17846 https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3388-17846] Cancel board: panel 「Enhance」 → processing dialog. Walked by: TC-110.
- R-165 [DS: flow arrow 3393-18476 https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3393-18476] Processing dialog 「Cancel」 → 「Sure You Want to Leave?」. Walked by: TC-111.
- R-166 [DS: flow arrow 3393-18607 https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3393-18607] Leave dialog 「Leave」 → panel. Walked by: TC-113.
- R-167 [DS: flow arrow 3293-15662 https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3293-15662] Panel 「Enhance」 with too few credits → Credit page. Walked by: TC-096.
- R-168 [DS: flow arrow 3293-15874 https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3293-15874] Recent task ⌂ → Launcher. Walked by: TC-142.
- R-169 [DS: flow arrow 3293-15875 https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3293-15875] Launcher completion banner 「View」 → Result. Walked by: TC-131.
- R-170 [PM: flow arrow 377-442 https://www.figma.com/design/mppB4GYkuVMVvHrdBeSAAU/AI-Video-Enhance?node-id=377-442] Launcher shortcut → media picker (the Design inserts the Demo page first, R-001). Walked by: TC-001, TC-010.
- R-171 [PM: flow arrow 377-443 https://www.figma.com/design/mppB4GYkuVMVvHrdBeSAAU/AI-Video-Enhance?node-id=377-443] AI Magic card → media picker (via the Demo page, R-002). Walked by: TC-002.
- R-172 [PM: flow arrow 377-444 https://www.figma.com/design/mppB4GYkuVMVvHrdBeSAAU/AI-Video-Enhance?node-id=377-444] Media picker clip → panel (「觸發 TBD」, settled by the Design: tap the thumbnail). Walked by: TC-020.
- R-173 [PM: flow arrow 377-446 https://www.figma.com/design/mppB4GYkuVMVvHrdBeSAAU/AI-Video-Enhance?node-id=377-446] Panel 「Enhance」 (checks passed) → uploading dialog. Walked by: TC-110.
- R-174 [PM: flow arrow 377-448 https://www.figma.com/design/mppB4GYkuVMVvHrdBeSAAU/AI-Video-Enhance?node-id=377-448] Upload succeeded (commit, charge) → Recent task processing. Walked by: TC-114.
- R-175 [PM: flow arrow 377-450 https://www.figma.com/design/mppB4GYkuVMVvHrdBeSAAU/AI-Video-Enhance?node-id=377-450] Background success → notification over the Launcher. Walked by: TC-130, TC-133.
- R-176 [PM: flow arrow 377-452 https://www.figma.com/design/mppB4GYkuVMVvHrdBeSAAU/AI-Video-Enhance?node-id=377-452] Notification → Result. Walked by: TC-131, TC-133.
- R-177 [PM: flow arrow 383-2678 https://www.figma.com/design/mppB4GYkuVMVvHrdBeSAAU/AI-Video-Enhance?node-id=383-2678] Recent task back ‹ → panel. Walked by: TC-141.
- R-178 [PM: flow arrow 397-1241 https://www.figma.com/design/mppB4GYkuVMVvHrdBeSAAU/AI-Video-Enhance?node-id=397-1241] First successful upload → 「Turn on notifications」 prompt. Walked by: TC-118.
- R-179 [PM: flow arrow 377-1116 https://www.figma.com/design/mppB4GYkuVMVvHrdBeSAAU/AI-Video-Enhance?node-id=377-1116] Panel 「Upgrade to Pro+」 → IAP Pro+ (on Android the Pro unlock action, R-070; an Android Pro user gets Enhance, TC-091). Walked by: TC-090.
- R-180 [PM: flow arrow 377-1117 https://www.figma.com/design/mppB4GYkuVMVvHrdBeSAAU/AI-Video-Enhance?node-id=377-1117] Panel 「Enhance」 with balance < price → Credit page. Walked by: TC-096.
- R-181 [PM: flow arrow 397-1887 https://www.figma.com/design/mppB4GYkuVMVvHrdBeSAAU/AI-Video-Enhance?node-id=397-1887] Timeline clip tool → panel with the clip. Walked by: TC-003.
- R-182 [PM: flow arrow 397-1921 https://www.figma.com/design/mppB4GYkuVMVvHrdBeSAAU/AI-Video-Enhance?node-id=397-1921] Timeline task succeeded → clip replaced, 「Applied Video Enhance」. Walked by: TC-162.
- R-183 [PM: flow arrow 377-1127 https://www.figma.com/design/mppB4GYkuVMVvHrdBeSAAU/AI-Video-Enhance?node-id=377-1127] Failed card 「View details」 → refunded dialog. Walked by: TC-171.
- R-191 [DS: flow arrow 3393-18071 https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3393-18071] Alternative & Exception: the failed task card's 「View Details」 on Recent (3293:15910) → the dialog 「An Error Has Occurred」 / 「Credits have been refunded.」 / 「The server may be busy. Please try again later or use a different video.」 with 「OK」 (3393:18196). Walked by: TC-171.

### Build checks
None: no Testing Request build is named for this feature yet.

### Domain rules
| Entry | Requirements |
|---|---|
| KP-007 A failed generation refunds its credits | R-142 |
| KP-066 Android text is held to the Android equivalent of the iOS font | n/a (a design-check rule for font weights against the Design; no casebook row checks a font weight, `figma` conformance applies it) |

### Request ledger coverage
| Ledger entry | Requirements |
|---|---|
| REQ-001 (analysis: build the tables from the Design and PM Figma) | every requirement above (R-001 – R-195) |
| REQ-002 (analysis: PM scope 309:643 + 405:1108; 0:1 superseded) | the PM-sourced requirements (e.g. R-033, R-093, R-131); page 0:1 is not read (update-plan.md › Not added) |
| REQ-004 (analysis: rerun under passes 10 and 11 — left trim handle, setting values end to end, playhead) | R-031, R-033, R-035, R-054 (both handles), R-192, R-193 (playhead), R-194, R-195 (setting values); the ECL rate table (Q-3, Q-4), the 2K+ import block (Q-13) and Android Pro unlocking are left as REQ-004 says |
| REQ-008 (table, Android: cover all 271 spec agent cases; every Mode × Enhancement style × fps × Resolution combination priced, generated and checked) | R-015, R-034, R-044, R-060, R-062, R-063, R-065, R-070, R-071, R-087, R-088, R-122, R-194 (changed); R-196 – R-204 (new); Q-3, Q-4 (answered); Q-23 – Q-25; `### Combinations` (36 rows); mapping `comparisons/20261110b_casebook-vs-spec-agent.mapping.json` |
| REQ-011 (analysis: spec agent cases from the old 26.09_v2 export never override today's board; the 2K+ block dropped) | R-015, R-044, R-196, Q-13 |
| REQ-012 (rulings, Android: no Pro+; no 「You're all set」 dialog) | R-005, R-072, R-074, Q-25 |
