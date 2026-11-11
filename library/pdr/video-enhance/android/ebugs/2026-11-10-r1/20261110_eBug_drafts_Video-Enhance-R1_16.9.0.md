# AI Video Enhance (Android) — eBug drafts, round R1 (table v4), PDR-A 16.9.0 build 2611091

**Source:** pdr-spec-casebook run `library/pdr/video-enhance/android/runs/2026-11-10-r1-full/` — round R1 of draft `drafts/20261110-160000` (table v4, 168 cases), 2026-11-10 17:10 → 22:51 on Samsung SM-A5360 (Galaxy A53 5G) / Android 15 through Appium / UiAutomator2, TR261109-0041 (SR DRA261109-01), Stage server, account cltqauiap2@gmail.com (Pro test subscription until ~22:35, then Free). Tally: 79 Pass, 66 Fail, 23 Blocked.

**Status:** nothing filed, uploaded or commented. This is the first Video Enhance Android batch (`ebug-defaults.ts pdr/video-enhance android`: no filed batch), so the review page prefills the filing account from the newest PowerDirector Android casebook batch (AI Mini Drama 2026-10-30-a7: Creator ETHAN_HSU, [AIAgent], API) and the TR of this run (TR261109-0041, 16.9.0.2611091), each marked 「confirm」. Dedupe was read-only, Android pool only (dedupe per OS, user 2026-10-28).

Rules: reviewer rules 2026-10-21 — one action per Repro step, a Spec Link on every entry, at least one image per entry, the logcat excerpt on every failure- or charge-related entry (user, 2026-10-27), no video. No `[UX]`: `[AIAgent]` or `[AIAgent][UI]`, owner RD, Doc for copy (RD, 2026-10-21). Spec basis check (REQ-055) per entry: the QA note names the rule; team rules and spec agent rules (REQ-008) are named as such; rows whose rule is a PM proposal ([建議]) or an open question are held as PM questions even when recorded defect (TC-011, TC-201, TC-046, TC-217). Android has no fault switches, so failure entries rest on real events (named in each QA note).

**What is drafted:** 15 new entries (ISS-VEA-01…15), all proposed for filing. 16 PM / table questions hold the 45 Fail (question) rows and 4 defect rows whose rule is a proposal; one observation repeats an open Android ticket (dedupe.txt only).

Legend — Class: Functional / UI · Severity: S1 critical and blocking only, S2 important, S3 moderate, S4 minor · Owner: RD or Doc. Every entry links the Figma board it is checked against.

---

## 1. ISS-VEA-01 — Launcher shortcut and AI Magic card are named 「Video Enhance」, not 「AI Video Enhance」  ·  Class: UI  ·  Severity: S3  ·  Owner: Doc

**Report step:** TC-002  ·  **Reproduce:** 2/2  ·  **Verified on:** 16.9.0.2611091

> **QA note — not pasted into eBug.** R-004 (Design ds-main-flow label 「1005_Update wording: AI Video Enhance」, newer than every PM item, which still says 「Video Enhance」) and R-002 (ds-entry-points AI Magic card). The Demo page title and the panel title already read 「AI Video Enhance」; only the two entry labels keep the old name (Launcher tv_title, AI Magic card tv_title). TC-001 passed on the Demo title; its Launcher label is this entry.

**Short Description:**

```
PDR-A 16.9.0 - [AIAgent][UI] AI Video Enhance: Launcher and AI Magic name it 「Video Enhance」, not 「AI Video Enhance」
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Read the big shortcut name on the Launcher
3. Tap 「AI Magic」 in the bottom bar
4. Scroll to the 「AI Enhance」 section
5. Read the card name
6. Check the result

Result:
The Launcher shortcut and the AI Magic card read 「Video Enhance」; the Demo page is titled 「AI Video Enhance」.
摘要：首頁捷徑與 AI Magic 卡片名稱為「Video Enhance」。
{16.9.0_vea01_launcher_shortcut.jpg} {16.9.0_vea01_ai_magic_card.jpg} {16.9.0_vea01_demo_title.jpg}

Expect Result:
Both read 「AI Video Enhance」 (Design 1005_Update wording), as the Demo page and the panel do.
摘要：兩處名稱皆應為「AI Video Enhance」（Design 1005 更新文案）。

Note:
Device: Samsung SM-A5360 (Galaxy A53 5G) / Android 15
Spec Link: AI Video Enhance Design spec (Video Enhance, section AI Video Enhance_26.09_v2), Main Flow (Free user → IAP) board (label 「1005_Update wording: AI Video Enhance」) - https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3293-13054
Spec Link: AI Video Enhance Design spec (Video Enhance, section AI Video Enhance_26.09_v2), Entry Points board (AI Magic card) - https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3293-14642
<Claude Reviewed>
```

**Images:** `20261110_eBug_drafts_Video-Enhance-R1_16.9.0_images/01_ISS-VEA-01/`

---

## 2. ISS-VEA-02 — 1440p, 4K and 8K sources are not rejected: each opens the panel and can be enhanced  ·  Class: Functional  ·  Severity: S2  ·  Owner: RD

**Report step:** TC-022, O-3, O-10  ·  **Reproduce:** 3/3  ·  **Verified on:** 16.9.0.2611091

> **QA note — not pasted into eBug.** R-196: user requirement of 2026-10-16 (spec agent TC-VE2-097 / TC-VE2-098, REQ-008), newer than the Design's resolution lookup and PM E1: a source of 2K or higher (1440p and up) is rejected before the panel opens. The message is not specified (Q-23), so the Expect asks only for the rejection. ve-res1440p (2560 × 1440, 5.03 s) opens 「30fps · 1440p」 with the 4K chip and 「Enhance 18」 at 3/s; ve-res4k (3840 × 2160, 5.02 s) 「30fps · 2160p」 「Enhance 15」; ve-res8k (HEVC) first shows the editor's 「Converting for Better Performance」 dialog, then a black Preview, 「0fps · 1080p」, every fps chip disabled, 「Enhance 4」. Pexels 2160p downloads are accepted too (TC-256, 「0fps · 2160p」). O-3: the 1440p and the 4K file of the same length price differently (18 vs 15, O-10 not rechecked). Steps 4–5 of TC-022 (under 1 s and MKV not greyed) are PM question Q-13, not part of this entry. Nothing was charged.

**Short Description:**

```
PDR-A 16.9.0 - [AIAgent] AI Video Enhance: 1440p, 4K and 8K videos open the panel instead of being rejected
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap 「Video Enhance」 on the Launcher
3. Tap a 2560 × 1440 (1440p) video in Add Media
4. Tap the back button ‹ on the panel
5. Tap a 3840 × 2160 (4K) video
6. Tap the back button ‹ on the panel
7. Tap a 7680 × 4320 (8K) video
8. Tap 「OK」 on 「Converting for Better Performance」
9. Check the result

Result:
1440p, 4K and 8K videos all open the panel (「Enhance 18」, 「Enhance 15」, 「Enhance 4」); none is rejected.
摘要：1440p、4K、8K 影片皆未被擋下，都直接進入設定面板，可送出增強。
{16.9.0_vea02_1440p_panel.jpg} {16.9.0_vea02_4k_panel.jpg} {16.9.0_vea02_8k_panel.jpg}

Expect Result:
A 1440p or larger source is rejected before the panel opens, so no task can start.
摘要：2K 以上（含 1440p、4K、8K）的影片應在進入面板前被拒絕，無法開始任務。

Note:
Device: Samsung SM-A5360 (Galaxy A53 5G) / Android 15
Spec Link: AI Video Enhance Design spec (Video Enhance, section AI Video Enhance_26.09_v2), Main Flow (Free user → IAP) board (Add Media and VE · 01; 2K+ block: user requirement 2026-10-16) - https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3293-13054
Spec Link: AI Video Enhance Design spec (Video Enhance, section AI Video Enhance_26.09_v2), AI Video Enhance (settings) board (預設值規則 resolution lookup) - https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3300-32003
<Claude Reviewed>
```

**Images:** `20261110_eBug_drafts_Video-Enhance-R1_16.9.0_images/02_ISS-VEA-02/`

---

## 3. ISS-VEA-03 — Panel badge reads 「0fps」 and every fps chip is disabled for stock downloads and Timeline clips  ·  Class: Functional  ·  Severity: S3  ·  Owner: RD

**Report step:** O-2  ·  **Reproduce:** 3/3  ·  **Verified on:** 16.9.0.2611091

> **QA note — not pasted into eBug.** R-021 (Design ds-main-flow 「1005_preview 右下加上影片的來源資訊」: the Preview's lower right shows the source frame rate and resolution) and R-043 (fps defaults from the source fps). Off-case observation O-2, seen on every source of these kinds: Pexels / Pixabay / gettyimages downloads (「0fps · 2160p」, 「0fps · 720p」), the Timeline clip ve-022999-1080p30 opened from the clip toolbar (「0fps · 1080p」), the 8K file after conversion. The same kind of local 30 fps file picked in Add Media reads 「30fps · 1080p」 with the 30fps chip selected. With 0 fps every fps chip is drawn disabled, so the output fps cannot be chosen.

**Short Description:**

```
PDR-A 16.9.0 - [AIAgent] AI Video Enhance: Badge reads 「0fps」 and fps chips are disabled for stock and Timeline clips
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap 「Video Enhance」 on the Launcher
3. Swipe the provider tab row left until 「Pexels」 shows
4. Tap 「Pexels」
5. Tap a Pexels video
6. Read the badge at the Preview's lower right
7. Read the 「fps」 chips
8. Check the result

Result:
The badge reads 「0fps · 2160p」 and 30fps / 60fps / 120fps are all disabled (Timeline clips: 「0fps · 1080p」).
摘要：角標顯示「0fps」，30/60/120fps 全部無法點選；從 Timeline 進入的片段也一樣。
{16.9.0_vea03_pexels_0fps.jpg} {16.9.0_vea03_timeline_0fps.jpg} {16.9.0_vea03_getty_0fps.jpg}

Expect Result:
The badge shows the source fps (「30fps · …」) and the fps chips can be chosen.
摘要：角標應顯示來源影片的 fps，fps 選項依來源正常可選。

Note:
Device: Samsung SM-A5360 (Galaxy A53 5G) / Android 15
Spec Link: AI Video Enhance Design spec (Video Enhance, section AI Video Enhance_26.09_v2), Main Flow (Free user → IAP) board (VE · 01, label 「1005_preview 右下加上影片的來源資訊」) - https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3293-13054
Spec Link: AI Video Enhance Design spec (Video Enhance, section AI Video Enhance_26.09_v2), AI Video Enhance (settings) board (預設值規則 fps lookup) - https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3300-32003
<Claude Reviewed>
```

**Images:** `20261110_eBug_drafts_Video-Enhance-R1_16.9.0_images/03_ISS-VEA-03/`

---

## 4. ISS-VEA-04 — Preview shows no time 「00:00/<length>」 until play is tapped  ·  Class: UI  ·  Severity: S3  ·  Owner: RD

**Report step:** TC-033, TC-215  ·  **Reproduce:** 3/3  ·  **Verified on:** 16.9.0.2611091

> **QA note — not pasted into eBug.** R-020 (Design ds-main-flow VE · 01 / VE · 02 draw 「00:00/12:30」 in the Preview bar on entry) and R-192. On opening, preview_bar holds only iv_play and iv_full_screen; tv_preview_time appears only after play is first tapped (or the playhead is dragged), then reads e.g. 「00:01/02:30」. Seen on every panel opened in R1-b (12:30 1080p60 and 1080p30, 02:30.01).

**Short Description:**

```
PDR-A 16.9.0 - [AIAgent][UI] AI Video Enhance: Panel Preview shows no 「00:00/12:30」 time until play is tapped
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap 「Video Enhance」 on the Launcher
3. Tap a 12:30 1080p 60 fps video in Add Media
4. Read the Preview bar
5. Check the result

Result:
The Preview bar shows only play and full screen; no 「00:00/12:30」 until play is tapped.
摘要：預覽列只有播放與全螢幕鍵，未按播放前不顯示「00:00/12:30」。
{16.9.0_vea04_no_preview_time.jpg} {16.9.0_vea04_playhead_no_time.jpg} {16.9.0_vea04_time_after_play.jpg}

Expect Result:
The Preview shows 「00:00/12:30」 as soon as the panel opens.
摘要：進入面板即應顯示「00:00/12:30」。

Note:
Device: Samsung SM-A5360 (Galaxy A53 5G) / Android 15
Spec Link: AI Video Enhance Design spec (Video Enhance, section AI Video Enhance_26.09_v2), Main Flow (Free user → IAP) board (VE · 01 / VE · 02 Preview 「00:00/12:30」) - https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3293-13054
<Claude Reviewed>
```

**Images:** `20261110_eBug_drafts_Video-Enhance-R1_16.9.0_images/04_ISS-VEA-04/`

---

## 5. ISS-VEA-05 — Lengths are cut down while the 2:30 limit rounds up: a selection reading 「02:30」 cannot switch to Professional  ·  Class: Functional  ·  Severity: S3  ·  Owner: RD

**Report step:** TC-263, TC-259, O-8, O-5  ·  **Reproduce:** 3/3  ·  **Verified on:** 16.9.0.2611091

> **QA note — not pasted into eBug.** R-053 (Design ds-ai-video-enhance Mode 長度上限: shortened to 2:30 or less, tapping Professional switches), R-056 (PM 9/29: the selection is rounded up before the comparison) and R-199 (user requirement 2026-10-21 via spec agent TC-VE2-276: the Preview total is rounded up, 150.01 s reads 「02:31」). The panel truncates every length while the price and the limit round up: ve-023001 (150.033 s) reads 「02:30」 in Selected Length and 「00:01/02:30」 in the Preview but is priced 「Enhance 302」 (151 s × 2). On ve-1230 every handle position that reads 「02:30」 is 150.x s (Enhance 302) and Professional answers with its 2:30 toast; only 「02:29」 (Enhance 300) switches. So the user is told the clip is too long while the panel shows exactly the limit. Step 1–2 of TC-263 (02:31 refused) passed. O-5b: 05:42 → 686, 02:00 → 242 (always one second over the shown length when the fraction is not zero).

**Short Description:**

```
PDR-A 16.9.0 - [AIAgent] AI Video Enhance: A selection shown as 「02:30」 cannot switch to Professional
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap 「Video Enhance」 on the Launcher
3. Tap a 12:30 video in Add Media
4. Drag the right trim handle left until 「Selected Length」 reads 「02:30」
5. Tap 「Professional」
6. Check the result

Result:
A selection shown as 「02:30」 gets the 「Professional supports clips up to 2:30」 toast; Mode stays Standard.
摘要：選取長度顯示「02:30」時點 Professional 仍跳出超過 2:30 提示，無法切換。
{16.9.0_vea05_selected_0230.jpg} {16.9.0_vea05_professional_refused.jpg} {16.9.0_vea05_0229_switches.jpg} {16.9.0_vea05_preview_total_0230.jpg}

Expect Result:
A selection shown as 「02:30」 switches to Professional (shown lengths round up like the limit).
摘要：顯示「02:30」的選取應可切換 Professional，顯示長度與上限同樣進位。

Note:
Device: Samsung SM-A5360 (Galaxy A53 5G) / Android 15
Spec Link: AI Video Enhance Design spec (Video Enhance, section AI Video Enhance_26.09_v2), AI Video Enhance (settings) board (Mode 長度上限) - https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3300-32003
Spec Link: AI Video Enhance PM spec, 主線 - 選片到拿到成品 board (9/29 limit rule: rounded up before the comparison) - https://www.figma.com/design/mppB4GYkuVMVvHrdBeSAAU/AI-Video-Enhance?node-id=369-438
<Claude Reviewed>
```

**Images:** `20261110_eBug_drafts_Video-Enhance-R1_16.9.0_images/05_ISS-VEA-05/`

---

## 6. ISS-VEA-06 — Videos of exactly whole seconds are billed one second more (1 s → 2, 3 s → 4, 30 s → 31, 3:00 → 181)  ·  Class: Functional  ·  Severity: S2  ·  Owner: RD

**Report step:** TC-269, O-7, O-19  ·  **Reproduce:** 3/3  ·  **Verified on:** 16.9.0.2611091

> **QA note — not pasted into eBug.** R-060 (Design ds-routing 「價格 = 選取秒數 × 每秒費率」; spec agent TC-VE2-175 – TC-VE2-184, ECL form 22061491221: the selected seconds rounded up × the rate; credit numbers are binding, REQ-008). Standard / Natural / 30fps / 720p = 1 credit per second. Frame-exact fixtures (ffprobe): 1.000 s → 「Enhance 2」 (expected 1), 3.000 s → 4 (3), 180.000 s → 181 (180), 30.000 s → 31 (30) — and charged so: TC-267 (ve-0030, 30.000 s) took −31 (Credit Details 19:13). Non-whole lengths are right (1.033 s → 2, 2.966 s → 3, 3.966 s → 4, 179.033 / 179.966 s → 180). Android's MediaStore reports these files 21–33 ms longer (1,033 / 3,033 / 30,033 / 180,033 ms), so the app seems to ceil the container duration. O-7: some exact 10.000 s files bill 11 or 22 depending on fps / size; O-19: Recent task cards show the same +1 s (1.000 s → 「0:02」). Step 1 of TC-269 (0.9 s not greyed) is PM question Q-13.

**Short Description:**

```
PDR-A 16.9.0 - [AIAgent] AI Video Enhance: Videos of exactly 1 s, 3 s, 30 s or 3:00 are billed one extra second
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap 「Video Enhance」 on the Launcher
3. Tap a 720p 30 fps video exactly 1.000 s long in Add Media
4. Read the CTA price
5. Tap the back button ‹ on the panel
6. Tap a 720p 30 fps video exactly 30.000 s long
7. Tap 「Enhance」
8. Tap the Pro tab
9. Tap the credit balance
10. Tap 「Details」
11. Check the result

Result:
1.000 s reads 「Enhance 2」, 3.000 s 「Enhance 4」, 3:00 「Enhance 181」; a 30.000 s video is charged 31.
摘要：整秒影片多算 1 秒：1 秒收 2 點、30 秒收 31 點、3 分鐘收 181 點，實際也照此扣點。
{16.9.0_vea06_1s_priced_2.jpg} {16.9.0_vea06_3s_priced_4.jpg} {16.9.0_vea06_3min_priced_181.jpg} {16.9.0_vea06_30s_priced_31.jpg} {16.9.0_vea06_ledger_minus31.jpg} {16.9.0_vea06_log.txt}

Expect Result:
At 1 credit per second a 1.000 s video costs 1, 3.000 s 3, 30.000 s 30 and 3:00 180.
摘要：價格＝選取秒數（無條件進位）× 費率：1 秒 1 點、30 秒 30 點、3 分鐘 180 點。

Note:
Device: Samsung SM-A5360 (Galaxy A53 5G) / Android 15
Spec Link: AI Video Enhance Design spec (Video Enhance, section AI Video Enhance_26.09_v2), Routing Logic board (「價格 = 選取秒數 × 每秒費率」; rates: ECL form 22061491221) - https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3293-14560
<Claude Reviewed>
```

**Images:** `20261110_eBug_drafts_Video-Enhance-R1_16.9.0_images/06_ISS-VEA-06/`

---

## 7. ISS-VEA-07 — Offline, 「Enhance」 does nothing: no message, no dialog  ·  Class: Functional  ·  Severity: S3  ·  Owner: RD

**Report step:** TC-100  ·  **Reproduce:** 2/2  ·  **Verified on:** 16.9.0.2611091

> **QA note — not pasted into eBug.** R-079 (PM pm-draft-logic C2 order Pro → network → balance; C3 [建議] toast 「Upload failed. Check your connection and try again.」). The copy is a PM proposal, so a different message would be a PM question; the finding is that there is none: both taps (18:19:27, 18:19:55) left the panel unchanged with no toast or dialog (6 screencaps over 4 s identical, dumpsys window only VideoEnhanceSetupActivity), while logcat logs getCreditRemain UnknownHostException on credit-stage. Nothing uploaded or charged (balance 27852 before and after), so only the feedback is missing. Wi-Fi turned off over USB with no mobile data; on again right after. Reviewer: hold as a PM question if you read C3 as the only basis.

**Short Description:**

```
PDR-A 16.9.0 - [AIAgent] AI Video Enhance: Tapping Enhance with no network shows nothing at all
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap 「Video Enhance」 on the Launcher
3. Tap a short video in Add Media
4. Turn Wi-Fi off
5. Tap 「Enhance」
6. Wait 5 seconds
7. Check the result

Result:
Nothing happens: no toast, no dialog; the panel stays as it was.
摘要：離線時按 Enhance 完全沒有反應，沒有任何提示或對話框。
{16.9.0_vea07_panel_offline.jpg} {16.9.0_vea07_after_tap_nothing.jpg} {16.9.0_vea07_log.txt}

Expect Result:
A message says the upload cannot start; the panel stays and nothing is charged.
摘要：應提示無法上傳，面板保留且不扣點。

Note:
Device: Samsung SM-A5360 (Galaxy A53 5G) / Android 15
Spec Link: AI Video Enhance PM spec, Logic 補充 · 對齊 Design 26.09 v2 (9/29) board (C2 check order, C3 offline toast [建議]) - https://www.figma.com/design/mppB4GYkuVMVvHrdBeSAAU/AI-Video-Enhance?node-id=405-1108
<Claude Reviewed>
```

**Images:** `20261110_eBug_drafts_Video-Enhance-R1_16.9.0_images/07_ISS-VEA-07/`

---

## 8. ISS-VEA-08 — Processing ring stays at 「0%」 for ~48 s, then stalls 30–40 s at a time  ·  Class: Functional  ·  Severity: S3  ·  Owner: RD

**Report step:** TC-110, O-14  ·  **Reproduce:** 1/1  ·  **Verified on:** 16.9.0.2611091

> **QA note — not pasted into eBug.** R-085 (Design ds-main-flow VE · 03 Generating and ds-cancel: a progress ring counting up, 「Video uploading...」); the row's 「no frozen wait over 10 s」 is the table's wait rule (team rule), named as such. ve-real-0130-1080p30 (1:30 1080p30, Enhance 180): Enhance 18:24:18, ring 「0%」 18:24:20 – 18:25:08 while logcat runs a local 「Transcode」 (18:24:20.1 – 18:24:57.9) under it, then 22% and on by single percents with stalls (23% 18:25:16 – 18:26:16, 28% 18:26:54 – 18:27:14, 52% 18:29:19 – 18:29:39); the S3 upload took 9.5 min (18:24:58 – 18:34:31). A 14 s 50 fps clip also sat at 0% for its 10 s transcode. Charged at the session start, before any of it (ISS-VEA-09).

**Short Description:**

```
PDR-A 16.9.0 - [AIAgent] AI Video Enhance: Processing ring sits at 0% for 48 s, then stalls 30–40 s at a time
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap 「Video Enhance」 on the Launcher
3. Tap a 1:30 1080p 30 fps video in Add Media
4. Tap 「Enhance」
5. Watch the progress ring for 5 minutes
6. Check the result

Result:
The ring reads 「0%」 for ~48 s, then moves by single percents with 30–40 s stalls (upload 9.5 min).
摘要：進度環停在 0% 約 48 秒，之後每次停滯 30–40 秒；上傳共 9.5 分鐘。
{16.9.0_vea08_ring_0pct.jpg} {16.9.0_vea08_ring_stalled.jpg} {16.9.0_vea08_ring_stalled_later.jpg} {16.9.0_vea08_log.txt}

Expect Result:
The ring counts up from the start of processing (「25%」 …) without a frozen wait over 10 s.
摘要：進度環應持續前進，不應停住超過 10 秒。

Note:
Device: Samsung SM-A5360 (Galaxy A53 5G) / Android 15
Spec Link: AI Video Enhance Design spec (Video Enhance, section AI Video Enhance_26.09_v2), Main Flow (Free user → IAP) board (VE · 03 Generating) - https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3293-13054
Spec Link: AI Video Enhance Design spec (Video Enhance, section AI Video Enhance_26.09_v2), Cancel board (processing dialog) - https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3396-20438
<Claude Reviewed>
```

**Images:** `20261110_eBug_drafts_Video-Enhance-R1_16.9.0_images/08_ISS-VEA-08/`

---

## 9. ISS-VEA-09 — Home during the upload ends the task but charges 30 credits; the refund comes about 3 h later  ·  Class: Functional  ·  Severity: S2  ·  Owner: RD

**Report step:** TC-115, O-13, O-29  ·  **Reproduce:** 1/1  ·  **Verified on:** 16.9.0.2611091

> **QA note — not pasted into eBug.** R-089 (Design ds-main-flow arrow 3293-13681 and PM §8 「成功上傳＝commit 點・扣 credit」: the balance drops when the upload finishes) and R-142 / KP-007 (a failed generation refunds at once, team rule). R-090 (backgrounding = cancel, no charge) is PM C3 [建議] (Q-18; the row note says decide with the user before filing). ve-real-gopro-1080p50 (14.26 s, Enhance 30): Enhance 18:44:32, Home 18:44:35 at 0%, reopened from Recents 18:45:16: no processing dialog and no new card, as expected, but 27638 → 27608 and Credit Details 「Video Enhancer -30 / 2026/11/10 18:44」. Logcat: create session 200 at 18:44:34 (the charge, O-13: every charge is stamped at the Enhance tap, before transcode and upload), transcode on in the background until 18:44:47, then UnknownHostException 「demo.myedit.online」, no S3 upload. A 「Generation failed, credits returned +30」 row came only at 22:00 (and one at 21:40 for the TC-113 Leave task; these are the account's only two Video Enhancer −30 rows), with no app call in logcat around them: about 3 h 16 min after the charge. The task also left a failed 「Retry」 card (ISS-VEA-13). The TC-113 Leave charge itself follows the Design dialog (Q-2, PM question).

**Short Description:**

```
PDR-A 16.9.0 - [AIAgent] AI Video Enhance: Home during upload ends the task but charges 30 credits, refunded 3 h later
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap 「Video Enhance」 on the Launcher
3. Tap a 14 s 1080p video in Add Media
4. Read the credit balance on the pill
5. Tap 「Enhance」
6. Press Home while 「Video uploading...」 shows
7. Wait 10 seconds
8. Reopen PowerDirector from Recents
9. Tap the Pro tab
10. Tap the credit balance
11. Tap 「Details」
12. Check the result

Result:
No task is made, but 30 credits are taken at once; the refund row appears only at 22:00, 3 h later.
摘要：按 Home 後任務未上傳也沒有結果，卻立即扣 30 點；退款約 3 小時後才出現。
{16.9.0_vea09_home_during_upload.jpg} {16.9.0_vea09_reopened_no_task.jpg} {16.9.0_vea09_ledger_minus30.jpg} {16.9.0_vea09_refund_2200.jpg} {16.9.0_vea09_refund_2140.jpg} {16.9.0_vea09_log.txt}

Expect Result:
Nothing is charged until the upload reaches the server; a task that never uploads costs nothing.
摘要：上傳完成前不應扣點；未上傳的任務不應扣點（或立即退款）。

Note:
Device: Samsung SM-A5360 (Galaxy A53 5G) / Android 15
Spec Link: AI Video Enhance Design spec (Video Enhance, section AI Video Enhance_26.09_v2), Main Flow (Free user → IAP) board (arrow 3293-13681: upload done → Recent task, balance drops) - https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3293-13681
Spec Link: AI Video Enhance PM spec, 失敗與退款 board - https://www.figma.com/design/mppB4GYkuVMVvHrdBeSAAU/AI-Video-Enhance?node-id=369-441
Spec Link: AI Video Enhance PM spec, 主線 - 選片到拿到成品 board (§8 成功上傳＝commit 點・扣 credit) - https://www.figma.com/design/mppB4GYkuVMVvHrdBeSAAU/AI-Video-Enhance?node-id=369-438
<Claude Reviewed>
```

**Images:** `20261110_eBug_drafts_Video-Enhance-R1_16.9.0_images/09_ISS-VEA-09/`

---

## 10. ISS-VEA-10 — The completion banner's 「View」 opens a black Result that never loads  ·  Class: Functional  ·  Severity: S2  ·  Owner: RD

**Report step:** TC-131  ·  **Reproduce:** 1/1  ·  **Verified on:** 16.9.0.2611091

> **QA note — not pasted into eBug.** R-101 (Design ds-alt-exception arrow 3293-15875: the banner's 「View」 opens the Result of that task) and R-120 (the Result plays). Banner 「Good news! Your AI Video Enhance task has been completed. Tap here to view your results.」 on the Launcher for a 0:04 task; 「View」 tapped at once (18:39:18): Result page with 「Original」 / 「Result」, 「Save Result」, 「Add to Timeline」, 「Enhance More」, but the player stayed black with a spinner, no time label and no tab highlighted for over 75 s; play did nothing, 「Original」 was black too. Logcat: ExoPlayer Init only, no load. Recent task still showed that task 「Processing… 4 minutes left…」 at the time; opened from Recent task's 「View」 at 18:42:07 the same task loaded at once (「00:00/00:03」). KP-059 (other features): the banner is offered before the result is ready.

**Short Description:**

```
PDR-A 16.9.0 - [AIAgent] AI Video Enhance: Completion banner's View opens a black Result page that never loads or plays
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap 「Video Enhance」 on the Launcher
3. Tap a 3 s video in Add Media
4. Tap 「Enhance」
5. Tap ⌂ on Recent task
6. Wait on the Launcher for the completion banner
7. Tap 「View」 on the banner
8. Tap play
9. Check the result

Result:
The Result page stays black with a spinner, no time and no tab selected for over 75 s; play and 「Original」 do nothing.
摘要：從完成通知點 View 進入結果頁一直黑畫面轉圈，無法播放。
{16.9.0_vea10_black_result.jpg} {16.9.0_vea10_play_nothing.jpg} {16.9.0_vea10_same_task_from_recent.jpg} {16.9.0_vea10_log.txt}

Expect Result:
The Result of that task opens and its video plays.
摘要：應開啟該任務結果並可正常播放。

Note:
Device: Samsung SM-A5360 (Galaxy A53 5G) / Android 15
Spec Link: AI Video Enhance Design spec (Video Enhance, section AI Video Enhance_26.09_v2), Alternative & Exception board (arrow 3293-15875: banner View → Result) - https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3293-15875
Spec Link: AI Video Enhance Design spec (Video Enhance, section AI Video Enhance_26.09_v2), Main Flow (Free user → IAP) board (result) - https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3293-13054
<Claude Reviewed>
```

**Images:** `20261110_eBug_drafts_Video-Enhance-R1_16.9.0_images/10_ISS-VEA-10/`

---

## 11. ISS-VEA-11 — Recent task has no ‹ and system Back goes to the Launcher: nothing returns to the panel  ·  Class: Functional  ·  Severity: S3  ·  Owner: RD

**Report step:** TC-141, TC-208, TC-140, O-9, O-15  ·  **Reproduce:** 6/6  ·  **Verified on:** 16.9.0.2611091

> **QA note — not pasted into eBug.** R-110 (Design ds-main-flow Recent · processing / Recent · 完成: back ‹ and ⌂ at the top), R-114 (arrow 3293-13718 and PM arrow 383-2678: ‹ returns to the panel) and R-190 (Android system Back does what the screen's ‹ does). Recent task draws only ⌂ (btnBack, a Home icon) at the top left; ⌂ and system Back both land on the Launcher (TC-142 Pass for ⌂). Seen every time in R1-d, R1-e and R1-f (6 times, O-9 / O-15), whether Recent task was opened from the panel's icon or by itself after an upload. The panel and its selection are lost.

**Short Description:**

```
PDR-A 16.9.0 - [AIAgent] AI Video Enhance: Recent task has no ‹ and system Back exits to the Launcher, not the panel
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap 「Video Enhance」 on the Launcher
3. Tap a video in Add Media
4. Tap the Recent task icon at the panel's top right
5. Look for a back button ‹ at the top left
6. Press system Back
7. Check the result

Result:
Only ⌂ is at the top left (no ‹); system Back lands on the Launcher and the panel is gone.
摘要：Recent task 只有 Home 鍵沒有返回鍵；系統返回直接回到首頁，無法回到設定面板。
{16.9.0_vea11_recent_home_only.jpg} {16.9.0_vea11_back_to_launcher.jpg}

Expect Result:
Recent task shows ‹ and ⌂; ‹ and system Back return to the panel (⌂ opens the Launcher).
摘要：Recent task 應有返回鍵與 Home 鍵；返回鍵與系統返回應回到設定面板。

Note:
Device: Samsung SM-A5360 (Galaxy A53 5G) / Android 15
Spec Link: AI Video Enhance Design spec (Video Enhance, section AI Video Enhance_26.09_v2), Main Flow (Free user → IAP) board (arrow 3293-13718: Recent task ‹ → panel) - https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3293-13718
Spec Link: AI Video Enhance Design spec (Video Enhance, section AI Video Enhance_26.09_v2), Main Flow (Free user → IAP) board (Recent · processing / Recent · 完成) - https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3293-13054
<Claude Reviewed>
```

**Images:** `20261110_eBug_drafts_Video-Enhance-R1_16.9.0_images/11_ISS-VEA-11/`

---

## 12. ISS-VEA-12 — Recent task notice reads 「1 year」 and offers 「Select」 instead of 「Manage」  ·  Class: UI  ·  Severity: S3  ·  Owner: Doc

**Report step:** TC-140  ·  **Reproduce:** 3/3  ·  **Verified on:** 16.9.0.2611091

> **QA note — not pasted into eBug.** R-110 (Design ds-main-flow Recent · processing / Recent · 完成: 「Tasks are stored on the cloud for 1 Year. Please download any you want to keep in local storage.」 with 「Manage」). The app reads 「…for 1 year. …」 (lower-case) with 「Select」. What 「Manage」 opens is Q-8 (TC-144, PM question: the app's 「Select」 offers only Delete); this entry is the copy only. Also a 「Create another one」 button at the bottom that the Design does not draw (not raised).

**Short Description:**

```
PDR-A 16.9.0 - [AIAgent][UI] AI Video Enhance: Recent task notice reads 「1 year」 and 「Select」, not 「1 Year」 and 「Manage」
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap 「Video Enhance」 on the Launcher
3. Tap a video in Add Media
4. Tap the Recent task icon at the panel's top right
5. Read the notice at the top
6. Check the result

Result:
「Tasks are stored on the cloud for 1 year. Please download any you want to keep in local storage.」 with 「Select」.
摘要：提示文字為小寫「1 year」，右側按鈕為「Select」。
{16.9.0_vea12_notice_select.jpg}

Expect Result:
「Tasks are stored on the cloud for 1 Year. Please download any you want to keep in local storage.」 with 「Manage」.
摘要：應為「…for 1 Year…」，右側按鈕為「Manage」。

Note:
Device: Samsung SM-A5360 (Galaxy A53 5G) / Android 15
Spec Link: AI Video Enhance Design spec (Video Enhance, section AI Video Enhance_26.09_v2), Main Flow (Free user → IAP) board (Recent · processing / Recent · 完成 notice 「Manage」) - https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3293-13054
<Claude Reviewed>
```

**Images:** `20261110_eBug_drafts_Video-Enhance-R1_16.9.0_images/12_ISS-VEA-12/`

---

## 13. ISS-VEA-13 — A task cancelled during the upload stays in Recent task as a card of length 「3961:06:40」 with 「Retry」  ·  Class: UI  ·  Severity: S3  ·  Owner: RD

**Report step:** O-11, O-18  ·  **Reproduce:** 2/2  ·  **Verified on:** 16.9.0.2611091

> **QA note — not pasted into eBug.** R-140 / R-142 (Design ds-alt-exception Generation Failed and ds-routing 失敗卡片: a failed task's card shows an 「Error」 thumbnail and 「View Details」; there is no Retry) and R-111 (a card shows its video length). Both gopro tasks of R1-e that never finished uploading (TC-113 「Leave」 18:38, TC-115 Home 18:44) stay in Recent task as cards with a blank placeholder thumbnail, the length 「3961:06:40」 (not the 14 s source) and 「Retry」, no 「View Details」 (Retry not tapped). The server later treated both as failed (「Generation failed, credits returned +30」 21:40 / 22:00, ISS-VEA-09). TC-113 expects no completed result, which holds.

**Short Description:**

```
PDR-A 16.9.0 - [AIAgent][UI] AI Video Enhance: Cancelled task leaves a card of length 「3961:06:40」 with Retry
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap 「Video Enhance」 on the Launcher
3. Tap a 14 s 1080p video in Add Media
4. Tap 「Enhance」
5. Tap 「Cancel」 while 「Video uploading...」 shows
6. Tap 「Leave」
7. Tap the Recent task icon at the panel's top right
8. Check the result

Result:
A card with a blank thumbnail, length 「3961:06:40」 and 「Retry」 is listed for the cancelled task.
摘要：取消的任務在 Recent task 留下長度「3961:06:40」、空白縮圖並帶 Retry 的卡片。
{16.9.0_vea13_cancelled_card.jpg} {16.9.0_vea13_two_failed_cards.jpg}

Expect Result:
A failed card shows the 「Error」 thumbnail, 「View Details」 and no Retry, with a real length.
摘要：失敗卡片應顯示 Error 縮圖與 View Details（無 Retry），長度正確。

Note:
Device: Samsung SM-A5360 (Galaxy A53 5G) / Android 15
Spec Link: AI Video Enhance Design spec (Video Enhance, section AI Video Enhance_26.09_v2), Alternative & Exception board (Generation Failed card) - https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3293-15052
Spec Link: AI Video Enhance Design spec (Video Enhance, section AI Video Enhance_26.09_v2), Routing Logic board (失敗卡片) - https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3293-14560
<Claude Reviewed>
```

**Images:** `20261110_eBug_drafts_Video-Enhance-R1_16.9.0_images/13_ISS-VEA-13/`

---

## 14. ISS-VEA-14 — Tasks take far longer than 1.5–2.5× their length: 1 s ≈ 62 s, 3.2 s ≈ 53 s, 30 s ≈ 103 s  ·  Class: Functional  ·  Severity: S3  ·  Owner: RD

**Report step:** TC-265, TC-266, TC-267, O-26  ·  **Reproduce:** 3/3  ·  **Verified on:** 16.9.0.2611091

> **QA note — not pasted into eBug.** R-204: company performance standard adopted by user instruction (spec agent TC-VE2-221 – TC-VE2-223, REQ-008), a team rule, not in the Figma: from the first remaining-time display on the task's Recent task card to completion takes 1.5 – 2.5 × the selection. Standard / Natural / 30fps / 720p defaults: ve-000100 (1 s) card shown 19:08:14 → Done 19:09:18 ≈ 62 s (1.5 – 2.5 s); ve-000320 (3.2 s) card 19:11:10 → banner 19:12:03 ≈ 53 s (4.8 – 8 s); ve-0030 (30 s) card 19:13:38 → completed 19:15:21 ≈ 103 s (45 – 75 s). Logcat shows the server status 「Applying 0」 every 10 s until 「Done」. O-26: every R1-g 3.2 s task took 66 – 151 s in Standard and 208 – 544 s in Professional. Related, not duplicates (Android, 16.6 flow, PM): DRA262608-0071 / DRA262608-0072 (static 「4 minutes left」, zero progress); the static time left (O-12) is left to them.

**Short Description:**

```
PDR-A 16.9.0 - [AIAgent] AI Video Enhance: Tasks take 53–103 s for 1–30 s videos, far over 1.5–2.5× their length
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap 「Video Enhance」 on the Launcher
3. Tap a 1 s 720p 30 fps video in Add Media
4. Tap 「Enhance」
5. Note the time when the task's card shows 「4 minutes left…」
6. Wait on Recent task until the card shows 「View」
7. Check the result

Result:
1 s: ≈ 62 s; 3.2 s: ≈ 53 s; 30 s: ≈ 103 s from the first time-left display to completion.
摘要：1 秒影片約 62 秒、3.2 秒約 53 秒、30 秒約 103 秒才完成，遠超標準。
{16.9.0_vea14_1s_done_62s.jpg} {16.9.0_vea14_3s_banner_53s.jpg} {16.9.0_vea14_30s_done_103s.jpg} {16.9.0_vea14_log.txt}

Expect Result:
A task finishes within 1.5–2.5× its length (company standard): 1.5–2.5 s for 1 s, 45–75 s for 30 s.
摘要：依公司效能標準，完成時間應為選取長度的 1.5–2.5 倍。

Note:
Device: Samsung SM-A5360 (Galaxy A53 5G) / Android 15
Spec Link: AI Video Enhance Design spec (Video Enhance, section AI Video Enhance_26.09_v2), Main Flow (Free user → IAP) board (Recent · processing card 「4 minutes left...」; time standard: company performance rule) - https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3293-13054
<Claude Reviewed>
```

**Images:** `20261110_eBug_drafts_Video-Enhance-R1_16.9.0_images/14_ISS-VEA-14/`

---

## 15. ISS-VEA-15 — In Professional, 「Sharp」 gives practically the same video as 「Natural」  ·  Class: Functional  ·  Severity: S3  ·  Owner: RD

**Report step:** O-28  ·  **Reproduce:** 9/9  ·  **Verified on:** 16.9.0.2611091

> **QA note — not pasted into eBug.** R-195 (Design ds-ai-video-enhance Settings bubbles: Sharp 「Moderate enhancement for a sharp, clear image」, sharper than Natural 「Lighter enhancement with fewer artifacts, for a more realistic look」) and R-194 (the task is made with the chosen values; analysis pass 10). Observation O-28 over the nine Professional pairs (Natural TC-219, TC-238 – TC-245 vs Sharp TC-246 – TC-254, same 3.2 s source ve-real-000320, same fps and resolution): mean Sobel edge strength over 10 frames equal to two decimals in every pair (720p 26.3 / 26.5 / 26.6, 1080p 25.3 / 25.3 / 25.4, 4K 23.9 / 24.2 / 24.3 for 30 / 60 / 120 fps), PSNR between the two 45.7 – 52.0 dB, nothing visible at 3×. In Standard the two styles differ clearly (TC-223 vs TC-230: 39.7 dB, edge 21.2 vs 22.9). Charged the same rate (R-062, right). Logcat shows no request parameters, so whether the style is not sent or the Professional model ignores it is for RD. The 18 Professional rows are recorded Fail (question) for copy only; this is an off-case observation. RD may forward to PM if Professional is meant to ignore the style.

**Short Description:**

```
PDR-A 16.9.0 - [AIAgent] AI Video Enhance: In Professional, the Sharp result is practically identical to Natural
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap 「Video Enhance」 on the Launcher
3. Tap a 3 s 720p 30 fps video in Add Media
4. Tap 「Professional」
5. Tap 「Enhance」
6. Wait on Recent task until the card shows 「View」
7. Tap the back button ‹ until the panel shows
8. Tap 「Professional」
9. Tap 「Sharp」
10. Tap 「Enhance」
11. Wait on Recent task until the card shows 「View」
12. Compare the two results frame by frame
13. Check the result

Result:
Professional Sharp and Natural results are practically identical in all nine fps × resolution pairs.
摘要：Professional 模式下 Sharp 與 Natural 結果幾乎完全相同（9 組皆然）。
{16.9.0_vea15_pro_sharp_vs_natural_720p30.jpg} {16.9.0_vea15_pro_sharp_vs_natural_4k120.jpg} {16.9.0_vea15_std_sharp_vs_natural.jpg}

Expect Result:
Sharp gives a visibly sharper, clearer result than Natural (as it does in Standard).
摘要：Sharp 應比 Natural 明顯更銳利清晰（Standard 模式即有差異）。

Note:
Device: Samsung SM-A5360 (Galaxy A53 5G) / Android 15
Spec Link: AI Video Enhance Design spec (Video Enhance, section AI Video Enhance_26.09_v2), AI Video Enhance (settings) board (Settings › Enhancement style bubbles) - https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3300-32003
<Claude Reviewed>
```

**Images:** `20261110_eBug_drafts_Video-Enhance-R1_16.9.0_images/15_ISS-VEA-15/`

---

## Held — PM and table questions (not drafted)

| # | Rows | Question | What was seen / what to decide |
|---|---|---|---|
| PQ-1 | TC-152 + the 36 combination rows (TC-219 – TC-254) | 「Saved to Gallery」 vs 「Saved to your device」 | Every Save Result (TC-152 and the 36 combination rows) shows 「Saved to Gallery」; R-122's 「Saved to your device」 is PM D3 [建議]. Which copy ships? |
| PQ-2 | the 36 combination rows (TC-219 – TC-254) | Credit Details name 「Video Enhancer」 vs 「AI Video Enhance」 | Each of the 36 combination rows' debit (and every other Video Enhance charge) is named 「Video Enhancer」; R-203 (PM naming decision relayed by the spec agent, TC-VE2-174) says 「AI Video Enhance」. Ledger copy is server data: PM to confirm the name. |
| PQ-3 | TC-133 | Background notification copy | The system notification reads the banner copy 「Good news! Your AI Video Enhance task has been completed. Tap here to view your results.」, not PM §9's 「Your video is ready. Tap to view.」 (PM-only row, Q-16). Tapping it opens the Result (fine). |
| PQ-4 | TC-011 | Demo page description (Q-1) | The Demo page shows AI Reframe's 「AI reframe your video for any aspect ratio, then fine-tune the crop in real time.」 — the text the Design frame also carries; PM A1 [衝突] proposes 「Make blurry, noisy or dark videos look sharp and clear.」. Held (spec basis: the Design draws what the app does), but the text is plainly another feature's: PM / Design to supply the copy, then file to Doc. |
| PQ-5 | TC-013 | 「Don't show again」 saved on ‹ | The tick is saved when the Demo page is left with ‹ (R-010 PM A1 [建議] says only with Try It Now). |
| PQ-6 | TC-021, TC-201 | Back from Add Media skips the Demo page (Q-9) | Both ‹ and system Back on Add Media opened from the Demo page return to the Launcher / AI Magic, skipping the Demo page. The Design draws ‹ with no arrow (Q-9); system Back does what ‹ does, so TC-201 is held with it (recorded defect). |
| PQ-7 | TC-046, TC-217, O-27 | Selection shorter than 1 s | Dragging one handle onto the other gives 「Selected Length 00:00」, priced as 1 s. The 1 s minimum is PM B1 [建議] (R-035), so held (both rows recorded defect). |
| PQ-8 | TC-045, TC-264 | Strip scale in Professional (Q-24) | Switching to Professional does not re-lay the strip to 2:30 per width (stays 8:00 per width); the rule comes from the spec agent and is pending PM. |
| PQ-9 | TC-144 | What 「Manage」 opens (Q-8) | The app's 「Select」 turns Recent task into a selection mode with only Delete (no download). |
| PQ-10 | TC-093 | Android IAP page | The Android page is one 「PowerDirector Pro」 page: no Pro / Pro+ tabs, no 「Tap to compare」, yearly tag 「POPULAR」 58% OFF (R-072 draws the iOS page). Android sells Pro only (KP-006): table question — make the row Android's. |
| PQ-11 | TC-004 | Clip toolbar badge 「Pro」 vs 「Pro+」 | On Free the tool carries 「Pro」 like Fix Shake; R-005's 「Pro+」 is the iOS rule (Android sells Pro, KP-006). Table question — make the row Android's. |
| PQ-12 | TC-113 (Pass) | Leave during the upload is charged (Q-2), then refunded 3 h later | TC-113 (Pass): 「Leave」 charged 30 as the Design dialog says (「the credits will not be restored」); PM §8 says nothing is charged before the upload reaches the server. The 30 credits then came back at 21:40 (「Generation failed, credits returned」), so the dialog's claim does not hold either. Which rule ships? |
| PQ-13 | TC-022 steps 4–5, TC-269 step 1 | Under-1 s and non-MP4 sources not greyed (Q-13) | TC-022 steps 4–5 and TC-269 step 1: 0.53 s / 0.9 s videos and an MKV open the panel (「00:00」, 「Enhance 1」), no 「This video isn't supported. Try one up to 4K.」 (PM A2 / E1 [建議] / [待確認]). |
| PQ-14 | O-6 | Dragging the selection moves it against the finger | A drag on the selection moves the range the other way (right → earlier); the strip scrolls with the finger. No spec rule (R-032 says the range moves). |
| PQ-15 | O-5 | Full-screen preview | O-5a: the full-screen preview draws no close control (only system Back leaves it) and always restarts at 00:00, not at the paused frame. O-5c: the 「Up to 8 minutes in Standard mode」 bubble covers the Preview time and play. |
| PQ-16 | O-23 | Every result is also auto-saved to Movies | Each completed task writes its result into Movies/cyberlink/PowerDirector/Video Enhance/ by itself (not media-scanned), and Save Result writes a second identical copy: two files per saved task. Intended? |

## Not raised (observations, for the record)

| Item | What was seen | Why not raised |
|---|---|---|
| O-1 | Mine › Credits read 「--」 right after the subscription; right after a relaunch | Self-healed; watched, not seen again. |
| O-4 | First-run bubble not seen in R1-a screenshots | TC-030 Pass from logcat (bubble 3.0 s). |
| O-12 | Processing card's 「n minutes left」 never counts down; list does not refresh by itself | Matches open Android ticket DRA262608-0072 (dedupe.txt). |
| O-16 | +2000 credit pack from another device on the shared account | Account note. |
| O-17 | R1-f ledger rows match | Account note. |
| O-20 | Completion banner waits on the Launcher until Close | As R-102 (Close dismisses it). |
| O-21 | DownloadUriTask 「URI is not absolute」 after each Done | No visible effect (cause of O-23's auto-copy?). |
| O-22 | `lbl Pro` matched New Project (script) | Setup note. |
| O-24 | Saved files 3.285 s for a 3.233 s source (one frame) | Within a frame; fps conversion right. |
| O-25 | Pro tab balance lags one charge | Panel pill right at the next open; Credit Details right. |
| O-30 | Pro test subscription ended 22:34–22:37 | Environment (5 Timeline rows Blocked). |
| O-31 | Panel badge 「0fps」 for a Timeline clip whose file is gone | Missing source; not judged (O-2 is ISS-VEA-03). |
| Blocked (23) | 5 observability, 18 test-data | No verdict (reasons on the Progress page and in report.md). |

## Reconciliation against the run

66 Fail (21 defect, 45 question), 23 Blocked, 0 Not run, 31 observations (O-1 … O-31).

| Step | Count | Running total |
|---|---|---|
| Fail rows + observations | 97 | 97 |
| → held (PM / table question) | −52 | 45 |
| → not raised (incl. O-12, an open Android ticket) | −12 | 33 |
| → merged: 33 rows / observations share 15 defects | −18 | **15 entries** |

### Row-by-row map

| Item | Result | Disposition | Became |
|---|---|---|---|
| TC-002 | Fail | defect | 1. ISS-VEA-01 |
| TC-004 | Fail | question | held: PQ-11 Clip toolbar badge 「Pro」 vs 「Pro+」 |
| TC-011 | Fail | defect | held: PQ-4 Demo page description (Q-1) |
| TC-013 | Fail | question | held: PQ-5 「Don't show again」 saved on ‹ |
| TC-201 | Fail | defect | held: PQ-6 Back from Add Media skips the Demo page (Q-9) |
| TC-021 | Fail | question | held: PQ-6 Back from Add Media skips the Demo page (Q-9) |
| TC-022 | Fail | defect | 2. ISS-VEA-02 |
| TC-033 | Fail | defect | 4. ISS-VEA-04 |
| TC-259 | Fail | defect | 5. ISS-VEA-05 |
| TC-215 | Fail | defect | 4. ISS-VEA-04 |
| TC-045 | Fail | question | held: PQ-8 Strip scale in Professional (Q-24) |
| TC-264 | Fail | question | held: PQ-8 Strip scale in Professional (Q-24) |
| TC-046 | Fail | defect | held: PQ-7 Selection shorter than 1 s |
| TC-217 | Fail | defect | held: PQ-7 Selection shorter than 1 s |
| TC-263 | Fail | defect | 5. ISS-VEA-05 |
| TC-269 | Fail | defect | 6. ISS-VEA-06 |
| TC-100 | Fail | defect | 7. ISS-VEA-07 |
| TC-110 | Fail | defect | 8. ISS-VEA-08 |
| TC-115 | Fail | defect | 9. ISS-VEA-09 |
| TC-131 | Fail | defect | 10. ISS-VEA-10 |
| TC-133 | Fail | question | held: PQ-3 Background notification copy |
| TC-140 | Fail | defect | 11. ISS-VEA-11; 12. ISS-VEA-12 |
| TC-141 | Fail | defect | 11. ISS-VEA-11 |
| TC-208 | Fail | defect | 11. ISS-VEA-11 |
| TC-152 | Fail | question | held: PQ-1 「Saved to Gallery」 vs 「Saved to your device」 |
| TC-144 | Fail | question | held: PQ-9 What 「Manage」 opens (Q-8) |
| TC-265 | Fail | defect | 14. ISS-VEA-14 |
| TC-266 | Fail | defect | 14. ISS-VEA-14 |
| TC-267 | Fail | defect | 14. ISS-VEA-14 |
| TC-223 | Fail | question | held: PQ-1 + PQ-2 (copy only) |
| TC-225 | Fail | question | held: PQ-1 + PQ-2 (copy only) |
| TC-224 | Fail | question | held: PQ-1 + PQ-2 (copy only) |
| TC-226 | Fail | question | held: PQ-1 + PQ-2 (copy only) |
| TC-221 | Fail | question | held: PQ-1 + PQ-2 (copy only) |
| TC-227 | Fail | question | held: PQ-1 + PQ-2 (copy only) |
| TC-228 | Fail | question | held: PQ-1 + PQ-2 (copy only) |
| TC-222 | Fail | question | held: PQ-1 + PQ-2 (copy only) |
| TC-229 | Fail | question | held: PQ-1 + PQ-2 (copy only) |
| TC-230 | Fail | question | held: PQ-1 + PQ-2 (copy only) |
| TC-220 | Fail | question | held: PQ-1 + PQ-2 (copy only) |
| TC-231 | Fail | question | held: PQ-1 + PQ-2 (copy only) |
| TC-232 | Fail | question | held: PQ-1 + PQ-2 (copy only) |
| TC-233 | Fail | question | held: PQ-1 + PQ-2 (copy only) |
| TC-234 | Fail | question | held: PQ-1 + PQ-2 (copy only) |
| TC-235 | Fail | question | held: PQ-1 + PQ-2 (copy only) |
| TC-236 | Fail | question | held: PQ-1 + PQ-2 (copy only) |
| TC-237 | Fail | question | held: PQ-1 + PQ-2 (copy only) |
| TC-238 | Fail | question | held: PQ-1 + PQ-2 (copy only) |
| TC-219 | Fail | question | held: PQ-1 + PQ-2 (copy only) |
| TC-239 | Fail | question | held: PQ-1 + PQ-2 (copy only) |
| TC-240 | Fail | question | held: PQ-1 + PQ-2 (copy only) |
| TC-241 | Fail | question | held: PQ-1 + PQ-2 (copy only) |
| TC-242 | Fail | question | held: PQ-1 + PQ-2 (copy only) |
| TC-243 | Fail | question | held: PQ-1 + PQ-2 (copy only) |
| TC-244 | Fail | question | held: PQ-1 + PQ-2 (copy only) |
| TC-245 | Fail | question | held: PQ-1 + PQ-2 (copy only) |
| TC-246 | Fail | question | held: PQ-1 + PQ-2 (copy only) |
| TC-247 | Fail | question | held: PQ-1 + PQ-2 (copy only) |
| TC-248 | Fail | question | held: PQ-1 + PQ-2 (copy only) |
| TC-249 | Fail | question | held: PQ-1 + PQ-2 (copy only) |
| TC-250 | Fail | question | held: PQ-1 + PQ-2 (copy only) |
| TC-251 | Fail | question | held: PQ-1 + PQ-2 (copy only) |
| TC-252 | Fail | question | held: PQ-1 + PQ-2 (copy only) |
| TC-253 | Fail | question | held: PQ-1 + PQ-2 (copy only) |
| TC-254 | Fail | question | held: PQ-1 + PQ-2 (copy only) |
| TC-093 | Fail | question | held: PQ-10 Android IAP page |
| O-1 | observation | — | not raised |
| O-2 | observation | — | 3. ISS-VEA-03 |
| O-3 | observation | — | 2. ISS-VEA-02 |
| O-4 | observation | — | not raised |
| O-5 | observation | — | 5. ISS-VEA-05; held: PQ-15 Full-screen preview |
| O-6 | observation | — | held: PQ-14 Dragging the selection moves it against the finger |
| O-7 | observation | — | 6. ISS-VEA-06 |
| O-8 | observation | — | 5. ISS-VEA-05 |
| O-9 | observation | — | 11. ISS-VEA-11 |
| O-10 | observation | — | 2. ISS-VEA-02 |
| O-11 | observation | — | 13. ISS-VEA-13 |
| O-12 | observation | — | not raised (existing ticket, dedupe.txt) |
| O-13 | observation | — | 9. ISS-VEA-09 |
| O-14 | observation | — | 8. ISS-VEA-08 |
| O-15 | observation | — | 11. ISS-VEA-11 |
| O-16 | observation | — | not raised |
| O-17 | observation | — | not raised |
| O-18 | observation | — | 13. ISS-VEA-13 |
| O-19 | observation | — | 6. ISS-VEA-06 |
| O-20 | observation | — | not raised |
| O-21 | observation | — | not raised |
| O-22 | observation | — | not raised |
| O-23 | observation | — | held: PQ-16 Every result is also auto-saved to Movies |
| O-24 | observation | — | not raised |
| O-25 | observation | — | not raised |
| O-26 | observation | — | 14. ISS-VEA-14 |
| O-27 | observation | — | held: PQ-7 Selection shorter than 1 s |
| O-28 | observation | — | 15. ISS-VEA-15 |
| O-29 | observation | — | 9. ISS-VEA-09 |
| O-30 | observation | — | not raised |
| O-31 | observation | — | not raised |

### Owner split

| Owner | Entries |
|---|---|
| RD | 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15 |
| Doc | 1, 12 |

### Filing order

By severity: **2**, **6**, **9**, **10**, **1**, **3**, **4**, **5**, **7**, **8**, **11**, **12**, **13**, **14**, **15**. Nothing is filed until the review page's decisions come back.
