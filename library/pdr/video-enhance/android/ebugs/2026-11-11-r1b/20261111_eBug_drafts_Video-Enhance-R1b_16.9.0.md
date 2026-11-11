# AI Video Enhance (Android) — eBug drafts, round R1 batch 2 (table v4), PDR-A 16.9.0 build 2611091

**Source:** pdr-spec-casebook run `library/pdr/video-enhance/android/runs/2026-11-10-r1-full/` — round R1 of draft `drafts/20261110-160000` (table v4, 168 cases), 2026-11-10 17:10 → 22:51 plus the paid reruns of 2026-11-11 09:27 → 09:59 (TC-095 purchase, R1-h Timeline rows, TC-014 reset) on Samsung SM-A5360 (Galaxy A53 5G) / Android 15, TR261109-0041 (SR DRA261109-01), Stage server, account cltqauiap2@gmail.com. Tally now: 82 Pass, 70 Fail, 16 Blocked.

**Status:** nothing filed, uploaded or commented. Batch 1 (`ebugs/2026-11-10-r1`) is filed as DRA262611P0071 – DRA262611P0085 (ISS-VEA-01 … 15); nothing here repeats it. The review page prefills the filing account from it (`ebug-defaults.ts pdr/video-enhance android`). Dedupe was read-only, Android pool only (per OS).

Rules (2026-11-11, spec-casebook `ebugs.md` step 1, `ebug-draft-generator` › Owner, overlay rule 5): a visible defect is filed even when its exact expected wording is a PM proposal or open question (the Expect names the Q-id); an open question the run cannot settle is filed to PM (BugBelong PM, Class UI for text, Functional for behaviour), one eBug per question, with its rows on the `Report step:` line; a question a ruling or ticket already answers (either OS) is cited, not filed. Text: RD when the spec states it, PM when the spec's own text must change. Reviewer rules 2026-10-21 (one action per step, a Spec Link and an image on every entry, the logcat excerpt on every failure- or charge-related one, no video, no `[UX]`). Every severity is proposed as 2, as the user decided for batch 1.

**What is drafted:** 17 entries to file, numbered 1–17 in this batch (trust the ISS-ID across batches): 3 defects (entries 1–3) and 14 open questions filed to PM for a decision (entries 4–17); then 1 withdrawn by QA (ISS-VEA-17, TC-201: a closed Android ticket already decided the behaviour). 6 questions are cited instead of filed.

Legend — Class: Functional / UI · Severity: S1 critical and blocking only, S2 important, S3 moderate, S4 minor · Owner: RD or PM. Every entry links the Figma board it rests on.

---

## 1. ISS-VEA-16 — The Demo page description is AI Reframe's text, not a description of Video Enhance  ·  Class: UI  ·  Severity: S2  ·  Owner: PM

**Report step:** TC-011  ·  **Reproduce:** 2/2  ·  **Verified on:** 16.9.0.2611091

> **QA note — not pasted into eBug.** Held in batch 1 (PQ-4); filed under the 2026-11-11 rule (a visible defect is filed, not held). R-007 (Design ds-main-flow Demo frame and PM pm-draft-logic A1 [衝突]). The app's tv_sub_title reads AI Reframe's description, which is plainly another feature's text whatever Q-1 decides. Owner PM by the text rule (user, 2026-11-11): the Design frame itself carries the same AI Reframe sentence, so the spec's own text must change before RD can fix the app; PM A1's proposal is quoted as a proposal. This entry also carries Q-1 (not filed separately). Seen on the first Demo page of R1-a and again after the TC-014 reset (2026-11-11).

**Short Description:**

```
PDR-A 16.9.0 - [AIAgent][UI] AI Video Enhance: Demo page description is AI Reframe's text, not Video Enhance's
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap 「Video Enhance」 on the Launcher
3. Read the description under the title 「AI Video Enhance」 on the Demo page
4. Check the result

Result:
The Demo page describes AI Reframe: 「AI reframe your video for any aspect ratio, then fine-tune the crop in real time.」
摘要：Demo 頁說明文字為 AI Reframe 的文案，並非 Video Enhance 的說明。
{16.9.0_vea16_demo_reframe_text.jpg}

Expect Result:
It describes Video Enhance (PM A1 proposal: 「Make blurry, noisy or dark videos look sharp and clear.」; Q-1).
摘要：說明文字應描述 Video Enhance（PM 提案文案見上，Q-1）。

Note:
Device: Samsung SM-A5360 (Galaxy A53 5G) / Android 15
Spec Link: AI Video Enhance Design spec (Video Enhance, section AI Video Enhance_26.09_v2), Main Flow (Free user → IAP) board (Demo page frame: the description is AI Reframe's text) -
https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3293-13054
Spec Link: AI Video Enhance PM spec, Logic 補充 · 對齊 Design 26.09 v2 (9/29) board (A1 [衝突]: proposed description) -
https://www.figma.com/design/mppB4GYkuVMVvHrdBeSAAU/AI-Video-Enhance?node-id=405-1108
<Claude Reviewed>
```

**Images:** `20261111_eBug_drafts_Video-Enhance-R1b_16.9.0_images/01_ISS-VEA-16/`

---

## 2. ISS-VEA-18 — Dragging one trim handle onto the other leaves a selection under 1 s (「00:00」, priced as 1 s)  ·  Class: Functional  ·  Severity: S2  ·  Owner: RD

**Report step:** TC-046, TC-217, O-27  ·  **Reproduce:** 3/3  ·  **Verified on:** 16.9.0.2611091

> **QA note — not pasted into eBug.** Held in batch 1 (PQ-7); filed under the 2026-11-11 rule (a selection going under the spec's minimum is the rule's own example). R-035 (PM pm-draft-logic B1 [建議]: the shortest selection is 1 s, whichever handle is dragged), named as a PM proposal. ve-0130-1080p60 (01:30, Enhance 180): the right handle dragged onto the left one (TC-046) and the left onto the right (TC-217) both stop with the handles touching, 「Selected Length」 「00:00」 and 「Enhance 2」 (2 credits per second = one billed second). The panel truncates lengths (02:30.05 reads 02:30, ISS-VEA-05 / DRA262611P0075), so 「00:00」 is under 1 s. O-27: the same in every R1-g1 row on the 3.2 s video (「Enhance <rate × 1>」). No task was sent at 00:00.

**Short Description:**

```
PDR-A 16.9.0 - [AIAgent] AI Video Enhance: Trim handles can meet, leaving a 「00:00」 selection under the 1 s minimum
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap 「Video Enhance」 on the Launcher
3. Tap a 1:30 1080p 60 fps video in Add Media
4. Drag the right trim handle left onto the left handle
5. Read 「Selected Length」 and the CTA
6. Drag the right trim handle back to the end
7. Drag the left trim handle right onto the right handle
8. Read 「Selected Length」 and the CTA
9. Check the result

Result:
With the handles touching, 「Selected Length」 reads 「00:00」 and the CTA 「Enhance 2」 (one billed second).
摘要：兩個裁切把手可以疊在一起，選取長度顯示「00:00」，價格以 1 秒計。
{16.9.0_vea18_right_handle_0000.jpg} {16.9.0_vea18_left_handle_0000.jpg} {16.9.0_vea18_after_release.jpg}

Expect Result:
The handles stop 1 s apart, so the selection is never under 「00:01」 (PM B1 proposal, R-035).
摘要：兩把手應至少相距 1 秒，選取長度不得小於 1 秒（PM B1 提案）。

Note:
Device: Samsung SM-A5360 (Galaxy A53 5G) / Android 15
Spec Link: AI Video Enhance PM spec, Logic 補充 · 對齊 Design 26.09 v2 (9/29) board (B1 [建議]: shortest selection 1 s) -
https://www.figma.com/design/mppB4GYkuVMVvHrdBeSAAU/AI-Video-Enhance?node-id=405-1108
Spec Link: AI Video Enhance Design spec (Video Enhance, section AI Video Enhance_26.09_v2), AI Video Enhance (settings) board (trim handles) -
https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3300-32003
<Claude Reviewed>
```

**Images:** `20261111_eBug_drafts_Video-Enhance-R1b_16.9.0_images/02_ISS-VEA-18/`

---

## 3. ISS-VEA-19 — After a successful Pro purchase no 「You're all set」 / 「Your purchase was successful.」 dialog appears  ·  Class: Functional  ·  Severity: S2  ·  Owner: RD

**Report step:** TC-095  ·  **Reproduce:** 1/1  ·  **Verified on:** 16.9.0.2611091

> **QA note — not pasted into eBug.** New on 2026-11-11 (TC-095 rerun, purchase approved by the user; Google Play test card). R-074 (Design ds-main-flow arrows 3293-13678: purchase sheet → 「You're all set」 dialog, and 3293-13679: its 「OK」 → panel). Free account, ve 15:01 panel (05:00 selected, Sharp), 「Unlock Pro to Enhance」 → 「PowerDirector Pro」 → 「Continue」 → Play sheet 「PowerDirector Yearly Subscription」 → Subscribe 09:30:44. Logcat: onPurchasesUpdated 09:30:48, UpdateUserTransaction 200 OK, doVerifySubscribe OK; acknowledgePurchaseResponse 0 and, 21 ms later, a second call answered 2 「Server error, please try again.」 (whether it is the cause is for RD). The IAP page closed straight back to the panel (only a ~0.4 s spinner); no dialog, no 「OK」. Everything else as specified: Mine 「Pro」, +100 Monthly Credit Bonus, selection and Sharp kept, CTA 「Enhance ◆ 301」, nothing sent (R-075). Reproduce 1/1: one purchase only.

**Short Description:**

```
PDR-A 16.9.0 - [AIAgent] AI Video Enhance: Pro purchase succeeds but no 「You're all set」 dialog is shown
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Sign in with a Free account
3. Tap 「Video Enhance」 on the Launcher
4. Tap a 15:01 video in Add Media
5. Tap 「Unlock Pro to Enhance」
6. Tap 「Continue」 on the 「PowerDirector Pro」 page
7. Tap 「Subscribe」 on the Google Play sheet
8. Wait 10 seconds
9. Check the result

Result:
The purchase succeeds (Mine reads Pro) but the app goes straight back to the panel; no 「You're all set」 dialog or 「OK」.
摘要：購買成功（帳號已變為 Pro），但直接回到設定面板，沒有出現「You're all set」購買成功對話框。
{16.9.0_vea19_play_sheet.jpg} {16.9.0_vea19_no_success_dialog.jpg} {16.9.0_vea19_pro_after_purchase.jpg} {16.9.0_vea19_log.txt}

Expect Result:
「You're all set」 / 「Your purchase was successful.」 shows; its 「OK」 returns to the panel (arrows 3293-13678 / 13679).
摘要：購買完成後應顯示「You're all set」成功對話框，按 OK 回到面板。

Note:
Device: Samsung SM-A5360 (Galaxy A53 5G) / Android 15
Spec Link: AI Video Enhance Design spec (Video Enhance, section AI Video Enhance_26.09_v2), Main Flow (Free user → IAP) board (arrow 3293-13678: purchase sheet → 「You're all set」) -
https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3293-13678
Spec Link: AI Video Enhance Design spec (Video Enhance, section AI Video Enhance_26.09_v2), Main Flow (Free user → IAP) board (arrow 3293-13679: 「OK」 → panel) -
https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3293-13679
<Claude Reviewed>
```

**Images:** `20261111_eBug_drafts_Video-Enhance-R1b_16.9.0_images/03_ISS-VEA-19/`

---

## 4. ISS-VEA-20 — 「Don't show again」 ticked and left with ‹ still turns the Demo page off (PM decision)  ·  Class: Functional  ·  Severity: S2  ·  Owner: PM

**Report step:** TC-013  ·  **Reproduce:** 1/1  ·  **Verified on:** 16.9.0.2611091

> **QA note — not pasted into eBug.** **Open question filed to PM for a decision.** Held in batch 1 (PQ-5); filed to PM under the 2026-11-11 rule. R-010 is PM pm-draft-logic A1 [建議] (only 「Try It Now」 saves the tick); the Design ds-routing says only 「勾 Don't show again 後不再出現」 (no word on ‹). The app may be right, so this asks PM. Side effect in the run: the Demo page stayed off until the TC-014 reset (pm clear, 2026-11-11). No Q-id: the proposal is R-010. Related, not an answer: DRA252503-0298 (Android, Close, 15.1.0: after ticking 「Don't show again」, ‹ from Recent task went back to the Demo page; fix 「Finish demo activity if don't show again button is checked」) settles the Recent task path, not whether ‹ on the Demo page itself saves the tick.

**Short Description:**

```
PDR-A 16.9.0 - [AIAgent] AI Video Enhance: 「Don't show again」 ticked then left with ‹ still turns the Demo page off
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap 「Video Enhance」 on the Launcher
3. Tick 「Don't show again」 on the Demo page
4. Tap the back button ‹ on the Demo page
5. Tap 「Video Enhance」 on the Launcher
6. Check the result

Result:
The tick is kept: the next 「Video Enhance」 tap opens Add Media directly, with no Demo page.
摘要：勾選 Don't show again 後按 ‹ 離開，下次進入即不再顯示 Demo 頁。
{16.9.0_vea20_ticked.jpg} {16.9.0_vea20_add_media_direct.jpg}

Expect Result:
PM to decide whether leaving with ‹ saves the tick; PM A1 proposes only 「Try It Now」 saves it (R-010).
摘要：請 PM 決定：勾選後按 ‹ 離開是否應記住設定（PM A1 提案：僅 Try It Now 才記住）。

Note:
Device: Samsung SM-A5360 (Galaxy A53 5G) / Android 15
Spec Link: AI Video Enhance PM spec, Logic 補充 · 對齊 Design 26.09 v2 (9/29) board (A1 [建議]: the tick is saved only with Try It Now) -
https://www.figma.com/design/mppB4GYkuVMVvHrdBeSAAU/AI-Video-Enhance?node-id=405-1108
Spec Link: AI Video Enhance Design spec (Video Enhance, section AI Video Enhance_26.09_v2), Routing Logic board (「勾 Don't show again 後不再出現」) -
https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3293-14560
<Claude Reviewed>
```

**Images:** `20261111_eBug_drafts_Video-Enhance-R1b_16.9.0_images/04_ISS-VEA-20/`

---

## 5. ISS-VEA-21 — Videos under 1 s and MKV files are not greyed in Add Media; they open the panel (Q-13)  ·  Class: Functional  ·  Severity: S2  ·  Owner: PM

**Report step:** TC-022, TC-269  ·  **Reproduce:** 3/3  ·  **Verified on:** 16.9.0.2611091

> **QA note — not pasted into eBug.** **Open question filed to PM for a decision.** Report PQ-13; filed to PM under the 2026-11-11 rule. Only TC-022 steps 4–5 and TC-269 step 1 belong here (the rest of those rows is ISS-VEA-02 / DRA262611P0072 and ISS-VEA-06 / DRA262611P0076). R-015 rests on PM pm-draft-logic A2 / E1 [建議] and the draft's 「[待確認]」 supported-source list (Q-13): under 1 s and not MP4 / MOV greyed with 「This video isn't supported. Try one up to 4K.」 (that toast's 「up to 4K」 no longer fits the 2K+ block, Q-23). ve-000050 (0.53 s) and ve-000090 (0.90 s) open the panel at 「00:00」, 「Enhance 1」; ve-mkv-720p30 opens 「30fps · 720p」 00:10. No task was sent.

**Short Description:**

```
PDR-A 16.9.0 - [AIAgent] AI Video Enhance: Videos under 1 s and MKV files are not greyed; they open the panel
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap 「Video Enhance」 on the Launcher
3. Tap a 0.9 s 720p video in Add Media
4. Tap the back button ‹ on the panel
5. Tap a 10 s MKV video in Add Media
6. Check the result

Result:
Neither is greyed: the 0.9 s video opens the panel at 「00:00」, 「Enhance 1」, and the MKV at 「00:10」.
摘要：不足 1 秒的影片與 MKV 檔都未反灰，皆可進入設定面板。
{16.9.0_vea21_0_9s_opens.jpg} {16.9.0_vea21_0_5s_opens.jpg} {16.9.0_vea21_mkv_opens.jpg}

Expect Result:
PM to decide the supported sources (Q-13): PM E1 proposes greying under 1 s and non-MP4 / MOV with a toast.
摘要：請 PM 決定支援的影片來源（Q-13）：PM E1 提案不足 1 秒與非 MP4/MOV 反灰並提示。

Note:
Device: Samsung SM-A5360 (Galaxy A53 5G) / Android 15
Spec Link: AI Video Enhance PM spec, Logic 補充 · 對齊 Design 26.09 v2 (9/29) board (A2 / E1 [建議], supported sources [待確認]) -
https://www.figma.com/design/mppB4GYkuVMVvHrdBeSAAU/AI-Video-Enhance?node-id=405-1108
<Claude Reviewed>
```

**Images:** `20261111_eBug_drafts_Video-Enhance-R1b_16.9.0_images/05_ISS-VEA-21/`

---

## 6. ISS-VEA-22 — Switching to Professional does not re-lay the strip to 2:30 per width (Q-24)  ·  Class: Functional  ·  Severity: S2  ·  Owner: PM

**Report step:** TC-045, TC-264  ·  **Reproduce:** 2/2  ·  **Verified on:** 16.9.0.2611091

> **QA note — not pasted into eBug.** **Open question filed to PM for a decision.** Report PQ-8; filed to PM under the 2026-11-11 rule. R-034 follows the spec agent's reading of PM 9/29 ⑥ (one strip width = the active Mode's limit, re-laid on a Mode switch, REQ-008); our earlier reading of the same note was that the scale depends only on the video length. Neither is newer (Q-24), so the app may be right. ve-0800 and ve-1230 / ve-0801 trimmed to 02:00, 「Professional」: the strip stays 8:00 per width (the 02:00 frame ≈ 1/4 of the width).

**Short Description:**

```
PDR-A 16.9.0 - [AIAgent] AI Video Enhance: Switching to Professional does not re-lay the strip to 2:30 per width
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap 「Video Enhance」 on the Launcher
3. Tap an 8:00 video in Add Media
4. Drag the right trim handle left until 「Selected Length」 reads 「02:00」
5. Tap 「Professional」
6. Look at the thumbnail strip
7. Check the result

Result:
In Professional the strip stays at 8:00 per width; the 02:00 selection keeps about a quarter of the width.
摘要：切換 Professional 後縮圖列仍為每寬 8:00，未改為每寬 2:30。
{16.9.0_vea22_standard_0200.jpg} {16.9.0_vea22_professional_same_scale.jpg} {16.9.0_vea22_0801_professional.jpg}

Expect Result:
PM to confirm PM 9/29 ⑥ (Q-24): does one strip width follow the Mode's limit (2:30 in Professional)?
摘要：請 PM 確認 9/29 ⑥（Q-24）：縮圖列寬度是否依模式上限（Professional 為 2:30）重排。

Note:
Device: Samsung SM-A5360 (Galaxy A53 5G) / Android 15
Spec Link: AI Video Enhance PM spec, 主線 - 選片到拿到成品 board (9/29 ⑥ strip scale) -
https://www.figma.com/design/mppB4GYkuVMVvHrdBeSAAU/AI-Video-Enhance?node-id=369-438
Spec Link: AI Video Enhance PM spec, Logic 補充 · 對齊 Design 26.09 v2 (9/29) board (B1-1 ⑥) -
https://www.figma.com/design/mppB4GYkuVMVvHrdBeSAAU/AI-Video-Enhance?node-id=405-1108
<Claude Reviewed>
```

**Images:** `20261111_eBug_drafts_Video-Enhance-R1b_16.9.0_images/06_ISS-VEA-22/`

---

## 7. ISS-VEA-23 — Dragging the selection moves the range the opposite way to the finger  ·  Class: Functional  ·  Severity: S2  ·  Owner: PM

**Report step:** O-6, TC-043  ·  **Reproduce:** 2/2  ·  **Verified on:** 16.9.0.2611091

> **QA note — not pasted into eBug.** **Open question filed to PM for a decision.** Report PQ-14 (O-6); filed to PM under the 2026-11-11 rule. R-032 (PM pm-draft-logic B1 [Design]) says a drag in the middle moves the whole range at the same length (TC-043 Pass on that) but no spec sets the direction. On ve-1230: a drag to the right made the range earlier (02:18 → 00:21 → 00:00), a drag to the left later (→ 01:57); the strip scrolls with the finger while the white frame shifts the other way on screen. This may be a scroll-the-strip design, so it is a question.

**Short Description:**

```
PDR-A 16.9.0 - [AIAgent] AI Video Enhance: Dragging the selection moves the range the opposite way to the finger
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap 「Video Enhance」 on the Launcher
3. Tap a 12:30 video in Add Media
4. Drag the right trim handle left until 「Selected Length」 reads 「05:41」
5. Drag the middle of the selection to the right
6. Read the selection's start in the Preview
7. Check the result

Result:
A drag to the right moves the range earlier (02:18 → 00:21), a drag to the left later; the strip follows the finger.
摘要：向右拖曳選取範圍時範圍往前移（與手指方向相反），向左則往後。
{16.9.0_vea23_drag_right_earlier.jpg} {16.9.0_vea23_drag_left_later.jpg}

Expect Result:
PM to decide which way a drag on the selection moves the range (R-032 sets no direction).
摘要：請 PM 決定拖曳選取範圍時的移動方向（R-032 未規定方向）。

Note:
Device: Samsung SM-A5360 (Galaxy A53 5G) / Android 15
Spec Link: AI Video Enhance PM spec, Logic 補充 · 對齊 Design 26.09 v2 (9/29) board (B1: dragging the middle moves the range) -
https://www.figma.com/design/mppB4GYkuVMVvHrdBeSAAU/AI-Video-Enhance?node-id=405-1108
Spec Link: AI Video Enhance Design spec (Video Enhance, section AI Video Enhance_26.09_v2), AI Video Enhance (settings) board (thumbnail strip) -
https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3300-32003
<Claude Reviewed>
```

**Images:** `20261111_eBug_drafts_Video-Enhance-R1b_16.9.0_images/07_ISS-VEA-23/`

---

## 8. ISS-VEA-24 — The full-screen preview has no close control and always restarts at 00:00  ·  Class: Functional  ·  Severity: S2  ·  Owner: PM

**Report step:** O-5, TC-037  ·  **Reproduce:** 1/1  ·  **Verified on:** 16.9.0.2611091

> **QA note — not pasted into eBug.** **Open question filed to PM for a decision.** Report PQ-15 (O-5a); filed to PM under the 2026-11-11 rule. R-027 (Design ds-main-flow VE · 02: the full-screen icon opens a full-screen preview); the Design draws no full-screen frame, so neither the close control nor the start point is specified. ve-023001 paused at 「00:06/02:30」, full-screen icon: the player fills the screen, a tap does nothing, it plays from 00:00 (burned-in 00:00:01.4) and only system Back leaves it (back at 「00:06/02:30」, TC-037 Pass).

**Short Description:**

```
PDR-A 16.9.0 - [AIAgent] AI Video Enhance: Full-screen preview has no close control and always restarts at 00:00
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap 「Video Enhance」 on the Launcher
3. Tap a 2:30 video in Add Media
4. Tap play on the Preview
5. Tap pause at 「00:06」
6. Tap the full-screen icon
7. Tap the middle of the screen
8. Check the result

Result:
Full screen has no close or other control (a tap does nothing) and plays from 00:00, not from the paused 00:06.
摘要：全螢幕預覽沒有關閉鍵（點擊無反應），且一律從 00:00 開始播放。
{16.9.0_vea24_paused_0006.jpg} {16.9.0_vea24_full_screen_no_close.jpg} {16.9.0_vea24_full_screen_from_0000.jpg}

Expect Result:
PM to decide the full-screen view: a close control, and whether it starts at the paused frame (no Design frame).
摘要：請 PM 決定全螢幕預覽：是否需要關閉鍵、是否從暫停處開始播放。

Note:
Device: Samsung SM-A5360 (Galaxy A53 5G) / Android 15
Spec Link: AI Video Enhance Design spec (Video Enhance, section AI Video Enhance_26.09_v2), Main Flow (Free user → IAP) board (VE · 02 Preview full-screen icon) -
https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3293-13054
<Claude Reviewed>
```

**Images:** `20261111_eBug_drafts_Video-Enhance-R1b_16.9.0_images/08_ISS-VEA-24/`

---

## 9. ISS-VEA-25 — The 「Up to 8 minutes in Standard mode」 bubble covers the Preview time and play button  ·  Class: UI  ·  Severity: S2  ·  Owner: PM

**Report step:** O-5, TC-044  ·  **Reproduce:** 1/1  ·  **Verified on:** 16.9.0.2611091

> **QA note — not pasted into eBug.** **Open question filed to PM for a decision.** Report PQ-15 (O-5c); filed to PM under the 2026-11-11 rule. R-054 (Design ds-ai-video-enhance: the bubble when the handle reaches the limit) does not place it against the Preview bar. ve-1230 in Standard, right handle dragged to the screen edge: the bubble shows while held and after release, over the Preview's time and play button (TC-044 Pass on the bubble itself).

**Short Description:**

```
PDR-A 16.9.0 - [AIAgent][UI] AI Video Enhance: 「Up to 8 minutes in Standard mode」 bubble covers Preview time and play
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap 「Video Enhance」 on the Launcher
3. Tap a 12:30 video in Add Media
4. Drag the right trim handle to the right screen edge
5. Look at the Preview bar
6. Check the result

Result:
The bubble 「Up to 8 minutes in Standard mode」 sits over the Preview's time and play button.
摘要：「Up to 8 minutes in Standard mode」提示泡泡蓋住預覽列的時間與播放鍵。
{16.9.0_vea25_bubble_covers_preview.jpg}

Expect Result:
PM to decide where the bubble sits so the Preview time and play stay visible (no frame places it).
摘要：請 PM 決定提示泡泡的位置，避免遮住預覽時間與播放鍵。

Note:
Device: Samsung SM-A5360 (Galaxy A53 5G) / Android 15
Spec Link: AI Video Enhance Design spec (Video Enhance, section AI Video Enhance_26.09_v2), AI Video Enhance (settings) board (Mode 長度上限 bubble) -
https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3300-32003
<Claude Reviewed>
```

**Images:** `20261111_eBug_drafts_Video-Enhance-R1b_16.9.0_images/09_ISS-VEA-25/`

---

## 10. ISS-VEA-26 — Android shows Pro, not Pro+: clip toolbar badge 「Pro」 and a single-plan IAP page (Q-25)  ·  Class: UI  ·  Severity: S2  ·  Owner: PM

**Report step:** TC-004, TC-093  ·  **Reproduce:** 1/1  ·  **Verified on:** 16.9.0.2611091

> **QA note — not pasted into eBug.** **Open question filed to PM for a decision.** Report PQ-10 / PQ-11; filed to PM under the 2026-11-11 rule as one question (Q-25: what Android draws for the unlock). The Design draws only iOS: R-005 the clip toolbar badge 「Pro+」 and R-072 the IAP_US page with Pro / Pro+ tabs, 「Tap to compare」 and 「Best Value」 「65% OFF」. Android sells Pro only (KP-006, team fact verified on 2611091; colleague feedback 2026-10-07, REQ-008), and the app follows that: badge 「Pro」 like Fix Shake, one 「PowerDirector Pro」 page with 「POPULAR」 「58% OFF」 (percentages are store data, KP-042). Reviewer: if you take KP-006 as the answer, hold this card and the two rows become table fixes.

**Short Description:**

```
PDR-A 16.9.0 - [AIAgent][UI] AI Video Enhance: Toolbar badge reads 「Pro」, IAP page has no Pro+ tab (no Android Design)
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Sign in with a Free account
3. Tap 「New Project」
4. Add a video to the timeline
5. Tap the clip
6. Tap 「Enhance」 in the clip toolbar
7. Read the badge on 「AI Video Enhance」
8. Tap 「AI Video Enhance」
9. Tap 「Unlock Pro to Enhance」
10. Check the result

Result:
The badge reads 「Pro」 and the IAP page is one 「PowerDirector Pro」 page with no Pro / Pro+ tabs and no 「Tap to compare」.
摘要：工具列標示「Pro」，購買頁只有單一 PowerDirector Pro 頁（無 Pro / Pro+ 分頁）。
{16.9.0_vea26_badge_pro.jpg} {16.9.0_vea26_single_pro_page.jpg}

Expect Result:
PM to confirm the Android badge and purchase page; the Design draws only iOS (「Pro+」, Pro / Pro+ tabs; Q-25).
摘要：請 PM 確認 Android 的標章與購買頁；Design 只畫了 iOS 版本（Q-25）。

Note:
Device: Samsung SM-A5360 (Galaxy A53 5G) / Android 15
Spec Link: AI Video Enhance Design spec (Video Enhance, section AI Video Enhance_26.09_v2), Entry Points board (Timeline_default: clip toolbar 「Pro+」 badge) -
https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3293-14642
Spec Link: AI Video Enhance Design spec (Video Enhance, section AI Video Enhance_26.09_v2), Main Flow (Free user → IAP) board (IAP_US: Pro / Pro+ tabs) -
https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3293-13054
<Claude Reviewed>
```

**Images:** `20261111_eBug_drafts_Video-Enhance-R1b_16.9.0_images/10_ISS-VEA-26/`

---

## 11. ISS-VEA-27 — 「Leave」 during the upload is charged, although PM says nothing is charged before the upload; refunded 3 h later (Q-2)  ·  Class: Functional  ·  Severity: S2  ·  Owner: PM

**Report step:** TC-113, O-11, O-29  ·  **Reproduce:** 1/1  ·  **Verified on:** 16.9.0.2611091

> **QA note — not pasted into eBug.** **Open question filed to PM for a decision.** Report PQ-12; filed to PM under the 2026-11-11 rule (Q-2, a string and a rule). The Design leave dialog says 「Leaving this page will cancel the process, and the credits will not be restored.」 (R-088, ds-cancel arrow 3393-18607); PM §8 says a cancel before the upload reaches the server charges nothing and creates no task, PM C4 says Leave keeps it running. TC-113 (Pass against the Design): ve-real-gopro (14.26 s, Enhance 30) Enhance 18:38:00 (create session = the charge, O-13), 「Cancel」, 「Leave」 18:38:21: −30. Then 「Generation failed, credits returned +30」 at 21:40 (O-29), so the dialog's 「will not be restored」 did not hold either. Related, not the same: DRA262611P0079 (batch 1, Home during the upload, Q-18) and the cancelled card DRA262611P0083; iOS DRI261897P0026 (Enhance disabled after Leave) is another symptom.

**Short Description:**

```
PDR-A 16.9.0 - [AIAgent] AI Video Enhance: 「Leave」 during upload charges 30 credits, then a refund comes 3 h later
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
7. Tap the Pro tab
8. Tap the credit balance
9. Tap 「Details」
10. Check the result

Result:
30 credits are taken at the Enhance tap and kept on Leave; a 「credits returned +30」 row comes about 3 h later.
摘要：上傳中選 Leave 會扣 30 點且當下不退，約 3 小時後才出現退款。
{16.9.0_vea27_leave_dialog.jpg} {16.9.0_vea27_ledger_minus30.jpg} {16.9.0_vea27_refund_2140.jpg} {16.9.0_vea27_log.txt}

Expect Result:
PM to decide what Leave costs (Q-2): the dialog keeps the credits, PM §8 charges nothing before the upload completes.
摘要：請 PM 決定上傳中 Leave 是否扣點（Q-2）：Design 對話框寫不退，PM §8 寫上傳完成前不扣。

Note:
Device: Samsung SM-A5360 (Galaxy A53 5G) / Android 15
Spec Link: AI Video Enhance Design spec (Video Enhance, section AI Video Enhance_26.09_v2), Cancel board (leave dialog; arrow 3393-18607 Leave → panel) -
https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3393-18607
Spec Link: AI Video Enhance PM spec, 主線 - 選片到拿到成品 board (§8 cancel before the upload: no charge) -
https://www.figma.com/design/mppB4GYkuVMVvHrdBeSAAU/AI-Video-Enhance?node-id=369-438
Spec Link: AI Video Enhance PM spec, 失敗與退款 board -
https://www.figma.com/design/mppB4GYkuVMVvHrdBeSAAU/AI-Video-Enhance?node-id=369-441
<Claude Reviewed>
```

**Images:** `20261111_eBug_drafts_Video-Enhance-R1b_16.9.0_images/11_ISS-VEA-27/`

---

## 12. ISS-VEA-28 — The background notification uses the banner copy, not PM's 「Your video is ready. Tap to view.」 (Q-16)  ·  Class: UI  ·  Severity: S2  ·  Owner: PM

**Report step:** TC-133  ·  **Reproduce:** 1/1  ·  **Verified on:** 16.9.0.2611091

> **QA note — not pasted into eBug.** **Open question filed to PM for a decision.** Report PQ-3; filed to PM under the 2026-11-11 rule (Q-16). R-103 is PM-only (pm-main-flow §9 「文案為 spec 原文」, pm-draft-logic D1 [建議]); the Design draws only the in-app banner (R-100), whose copy the notification reuses. Tapping it opened the Result (fine). Reviewer: R-103 calls §9 the spec's own text, so if PM's copy stands this is RD text (switch Belong to RD).

**Short Description:**

```
PDR-A 16.9.0 - [AIAgent][UI] AI Video Enhance: Notification copy is the banner's, not 「Your video is ready. Tap to view」
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap 「Video Enhance」 on the Launcher
3. Tap a 3 s video in Add Media
4. Tap 「Enhance」
5. Press Home while the task is processing
6. Wait for the system notification
7. Swipe down the notification shade
8. Read the PowerDirector notification
9. Check the result

Result:
The notification reads 「Good news! Your AI Video Enhance task has been completed. Tap here to view your results.」
摘要：系統通知文案沿用 App 內橫幅文字，而非 PM 規格的通知文案。
{16.9.0_vea28_notification_copy.jpg}

Expect Result:
PM to decide the notification copy (Q-16): PM §9 「Your video is ready. Tap to view.」 or the banner text.
摘要：請 PM 決定系統通知文案（Q-16）。

Note:
Device: Samsung SM-A5360 (Galaxy A53 5G) / Android 15
Spec Link: AI Video Enhance PM spec, 主線 - 選片到拿到成品 board (§9 notification copy 「Your video is ready. Tap to view.」) -
https://www.figma.com/design/mppB4GYkuVMVvHrdBeSAAU/AI-Video-Enhance?node-id=369-438
Spec Link: AI Video Enhance Design spec (Video Enhance, section AI Video Enhance_26.09_v2), Alternative & Exception board (生成完成跳通知: in-app banner) -
https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3293-15052
<Claude Reviewed>
```

**Images:** `20261111_eBug_drafts_Video-Enhance-R1b_16.9.0_images/12_ISS-VEA-28/`

---

## 13. ISS-VEA-29 — 「Save Result」 shows 「Saved to Gallery」, not 「Saved to your device」  ·  Class: UI  ·  Severity: S2  ·  Owner: PM

**Report step:** TC-152, TC-219 – TC-254 (37 rows)  ·  **Reproduce:** 37/37  ·  **Verified on:** 16.9.0.2611091

> **QA note — not pasted into eBug.** **Open question filed to PM for a decision.** Report PQ-1; filed to PM under the 2026-11-11 rule. The copy that fails 37 rows (TC-152 and every combination row TC-219 – TC-254; in those rows everything else passed, apart from the ledger name, cited, and O-28, DRA262611P0085). R-122: the Design (ds-routing) says only 「Save Result → 存到手機」; the toast 「Saved to your device」 is PM pm-draft-logic D3 [建議], adopted by the spec agent (TC-VE2-236, colleague feedback item 14, REQ-008). The file is saved correctly (Movies/cyberlink/PowerDirector/Video Enhance/).

**Short Description:**

```
PDR-A 16.9.0 - [AIAgent][UI] AI Video Enhance: Save Result toast reads 「Saved to Gallery」, not 「Saved to your device」
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap 「Video Enhance」 on the Launcher
3. Tap a 3 s video in Add Media
4. Tap 「Enhance」
5. Wait on Recent task until the card shows 「View」
6. Tap 「View」
7. Tap 「Save Result」
8. Check the result

Result:
The toast reads 「Saved to Gallery」.
摘要：儲存結果的提示為「Saved to Gallery」。
{16.9.0_vea29_saved_to_gallery.jpg}

Expect Result:
PM to decide the toast copy: 「Saved to your device」 (PM D3 proposal, spec agent TC-VE2-236) or 「Saved to Gallery」.
摘要：請 PM 決定儲存提示文案（PM D3 提案「Saved to your device」）。

Note:
Device: Samsung SM-A5360 (Galaxy A53 5G) / Android 15
Spec Link: AI Video Enhance Design spec (Video Enhance, section AI Video Enhance_26.09_v2), Routing Logic board (Save Result → 存到手機) -
https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3293-14560
Spec Link: AI Video Enhance PM spec, Logic 補充 · 對齊 Design 26.09 v2 (9/29) board (D3 [建議] toast 「Saved to your device」) -
https://www.figma.com/design/mppB4GYkuVMVvHrdBeSAAU/AI-Video-Enhance?node-id=405-1108
<Claude Reviewed>
```

**Images:** `20261111_eBug_drafts_Video-Enhance-R1b_16.9.0_images/13_ISS-VEA-29/`

---

## 14. ISS-VEA-30 — Recent task's 「Select」 offers only Delete; what 「Manage」 should open is not specified (Q-8)  ·  Class: Functional  ·  Severity: S2  ·  Owner: PM

**Report step:** TC-144  ·  **Reproduce:** 1/1  ·  **Verified on:** 16.9.0.2611091

> **QA note — not pasted into eBug.** **Open question filed to PM for a decision.** Report PQ-9; filed to PM under the 2026-11-11 rule (Q-8). R-116: the Design draws 「Manage」 beside the notice but no screen for it. The label itself (「Select」 for 「Manage」) is batch 1's DRA262611P0082 (RD); this asks only what the control should do. The app's 「Select」 turns the list into a selection mode: a checkbox per card and a bottom bar with only 「Delete」 (no download, although the notice tells users to download what they keep). Nothing was deleted.

**Short Description:**

```
PDR-A 16.9.0 - [AIAgent] AI Video Enhance: Recent task's 「Select」 offers only Delete; what 「Manage」 opens is unspecified
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap 「Video Enhance」 on the Launcher
3. Tap a video in Add Media
4. Tap the Recent task icon at the panel's top right
5. Tap 「Select」 beside the notice
6. Tick one card
7. Check the result

Result:
Recent task turns into a selection mode whose only action is 「Delete」.
摘要：Recent task 的「Select」只提供刪除，無下載等其他管理功能。
{16.9.0_vea30_select_mode.jpg} {16.9.0_vea30_delete_only.jpg}

Expect Result:
PM to decide what 「Manage」 opens and offers (Q-8), e.g. download as well as delete.
摘要：請 PM 決定「Manage」應開啟的頁面與功能（Q-8）。

Note:
Device: Samsung SM-A5360 (Galaxy A53 5G) / Android 15
Spec Link: AI Video Enhance Design spec (Video Enhance, section AI Video Enhance_26.09_v2), Main Flow (Free user → IAP) board (Recent · 完成: notice with 「Manage」) -
https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3293-13054
<Claude Reviewed>
```

**Images:** `20261111_eBug_drafts_Video-Enhance-R1b_16.9.0_images/14_ISS-VEA-30/`

---

## 15. ISS-VEA-31 — Every completed task is also written to Movies by itself, so 「Save Result」 makes a second copy  ·  Class: Functional  ·  Severity: S2  ·  Owner: PM

**Report step:** O-23, O-21  ·  **Reproduce:** 36/36  ·  **Verified on:** 16.9.0.2611091

> **QA note — not pasted into eBug.** **Open question filed to PM for a decision.** Report PQ-16 (O-23, with O-21); filed to PM under the 2026-11-11 rule. The Design's routing says results are stored on the cloud (Recent task) and 「Save Result → 存到手機」 (R-122); nothing says a result is written to the phone without Save Result. In R1-g every task wrote 「VideoEnhance - Nov 10 - <n> - <ms>.mp4」 into Movies/cyberlink/PowerDirector/Video Enhance/ at the 「Done」 moment (no MediaScanner scan, so not in the gallery; logcat DownloadUriTask 「URI is not absolute」, O-21), and Save Result wrote a second identical file. The Timeline entry did not (TC-162, ISS-VEA-33). Intended (a cache) or not?

**Short Description:**

```
PDR-A 16.9.0 - [AIAgent] AI Video Enhance: Each finished task is auto-saved to Movies; Save Result makes a second copy
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap 「Video Enhance」 on the Launcher
3. Tap a 3 s video in Add Media
4. Tap 「Enhance」
5. Wait on Recent task until the card shows 「View」
6. List Movies/cyberlink/PowerDirector/Video Enhance/ on the phone
7. Tap 「View」
8. Tap 「Save Result」
9. List the same folder again
10. Check the result

Result:
A result file appears in Movies at completion without Save Result; Save Result then adds a second identical file.
摘要：任務完成時結果已自動寫入 Movies 資料夾，再按 Save Result 會多存一份相同檔案。
{16.9.0_vea31_saved_listed.jpg} {16.9.0_vea31_saved_file.jpg}

Expect Result:
PM to decide whether a finished task is written to the phone only by 「Save Result」 (R-122) or also by itself.
摘要：請 PM 決定結果是否只在按 Save Result 時存到手機。

Note:
Device: Samsung SM-A5360 (Galaxy A53 5G) / Android 15
Spec Link: AI Video Enhance Design spec (Video Enhance, section AI Video Enhance_26.09_v2), Routing Logic board (Save Result → 存到手機; results stored on the cloud) -
https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3293-14560
<Claude Reviewed>
```

**Images:** `20261111_eBug_drafts_Video-Enhance-R1b_16.9.0_images/15_ISS-VEA-31/`

---

## 16. ISS-VEA-32 — A Timeline clip over 8:00 opens the panel capped at 08:00 instead of the 「Split clips…」 toast (Q-10)  ·  Class: Functional  ·  Severity: S2  ·  Owner: PM

**Report step:** TC-161  ·  **Reproduce:** 1/1  ·  **Verified on:** 16.9.0.2611091

> **QA note — not pasted into eBug.** **Open question filed to PM for a decision.** New on 2026-11-11 (R1-h on Pro); filed to PM under the 2026-11-11 rule (Q-10). R-058 is PM pm-draft-logic B1-1 ⑦ + D4 [建議] (a clip over 8:00 does not open; toast 「Split clips longer than 8 minutes first」); PM 9/29 ⑦ says the same trim rules as Add Media apply, which is what the app does; no Design frame. ve-1000-1080p30 (10:00) on the timeline: the panel opens with 「Selected Length」 「08:00」 and an ⓘ 「Max 8 minutes. Drag to choose which part.」, 「Enhance ◆ 960」. Nothing charged.

**Short Description:**

```
PDR-A 16.9.0 - [AIAgent] AI Video Enhance: Timeline clip over 8:00 opens the panel capped at 08:00, no split toast
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap 「New Project」
3. Add a 10:00 video to the timeline
4. Tap the clip
5. Tap 「Enhance」 in the clip toolbar
6. Tap 「AI Video Enhance」
7. Check the result

Result:
The panel opens with the selection capped at 「08:00」 (ⓘ 「Max 8 minutes. Drag to choose which part.」); no toast.
摘要：超過 8 分鐘的 Timeline 片段仍可開啟面板，選取上限為 08:00，未出現分割提示。
{16.9.0_vea32_panel_capped_0800.jpg} {16.9.0_vea32_info_max_8_min.jpg}

Expect Result:
PM to decide (Q-10): refuse with 「Split clips longer than 8 minutes first」 (D4 proposal) or cap at 08:00 as Add Media.
摘要：請 PM 決定（Q-10）：拒絕並提示分割，或如 Add Media 限制選取 8 分鐘。

Note:
Device: Samsung SM-A5360 (Galaxy A53 5G) / Android 15
Spec Link: AI Video Enhance PM spec, Logic 補充 · 對齊 Design 26.09 v2 (9/29) board (B1-1 ⑦ / D4 [建議]: clip over 8:00 does not open) -
https://www.figma.com/design/mppB4GYkuVMVvHrdBeSAAU/AI-Video-Enhance?node-id=405-1108
Spec Link: AI Video Enhance PM spec, 主線 - 選片到拿到成品 board (9/29 ⑦: same trim rules on a Timeline clip) -
https://www.figma.com/design/mppB4GYkuVMVvHrdBeSAAU/AI-Video-Enhance?node-id=369-438
<Claude Reviewed>
```

**Images:** `20261111_eBug_drafts_Video-Enhance-R1b_16.9.0_images/16_ISS-VEA-32/`

---

## 17. ISS-VEA-33 — A Timeline task's result is not pasted back over the clip, and its 「Add to Timeline」 makes a new project (Q-11)  ·  Class: Functional  ·  Severity: S2  ·  Owner: PM

**Report step:** TC-162, TC-165  ·  **Reproduce:** 1/1  ·  **Verified on:** 16.9.0.2611091

> **QA note — not pasted into eBug.** **Open question filed to PM for a decision.** New on 2026-11-11 (R1-h on Pro); filed to PM under the 2026-11-11 rule (Q-11). TC-162 judged a question, not a defect: PM (pm-timeline §4.1 / §9, R-131; D4 [建議]) pastes the result back over the clip with 「Applied Video Enhance」, but the Design routing note says every Enhance result is saved as a new video and 「Add to Timeline 是開一條新的 timeline，不取代原 clip」. Under the Design's answer the app is right (result kept in Recent task, Add to Timeline opens a new project), so the wrongness hangs on Q-11; the run's 31-credit charge for the 30 s clip is DRA262611P0076. TC-162: ve-0030-720p30, 「Enhance ◆ 31」 09:40:24 (charged at the tap), main-flow upload and Recent task (with ✕ back to the editor), banner 「Good news! …」 over the editor at 09:43:57; after 「Close」 the clip is unchanged, no 「Applied」 notice, no result file in Movies, logcat shows only the FCM push (no download or timeline call). TC-165: from that task's Result, 「Add to Timeline」 09:50:52 opened a new project 「Project 11-11」 holding only the result clip (the name also reuses TC-160's 「Project 11-11」; not raised: project naming is outside this feature).

**Short Description:**

```
PDR-A 16.9.0 - [AIAgent] AI Video Enhance: Timeline task result is not pasted back; Add to Timeline makes a new project
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap 「New Project」
3. Add a 30 s video to the timeline
4. Tap the clip
5. Tap 「Enhance」 in the clip toolbar
6. Tap 「AI Video Enhance」
7. Tap 「Enhance」
8. Tap ✕ on Recent task
9. Wait in the editor for the completion banner
10. Tap 「Close」 on the banner
11. Look at the clip on the timeline
12. Tap the clip
13. Tap 「Enhance」 in the clip toolbar
14. Tap 「AI Video Enhance」
15. Tap the Recent task icon at the panel's top right
16. Tap 「View」 on the new card
17. Tap 「Add to Timeline」
18. Check the result

Result:
The clip is not replaced, no 「Applied Video Enhance」 shows; 「Add to Timeline」 opens a new project with the result.
摘要：Timeline 任務完成後原片段未被取代、無 Applied 提示；Add to Timeline 另開新專案。
{16.9.0_vea33_banner_in_editor.jpg} {16.9.0_vea33_clip_not_replaced.jpg} {16.9.0_vea33_add_to_timeline_new_project.jpg} {16.9.0_vea33_projects_list.jpg} {16.9.0_vea33_log.txt}

Expect Result:
PM to decide (Q-11): paste back with 「Applied Video Enhance」 (PM §4.1 / §9) or a new video and project (Design note).
摘要：請 PM 決定（Q-11）：結果回貼原片段，或如 Design 註記另存新片並開新 timeline。

Note:
Device: Samsung SM-A5360 (Galaxy A53 5G) / Android 15
Spec Link: AI Video Enhance PM spec, Timeline 入口 board (§4.1 / §9 「背景生成成功後回貼到原片段並通知，顯示 Applied Video Enhance」) -
https://www.figma.com/design/mppB4GYkuVMVvHrdBeSAAU/AI-Video-Enhance?node-id=369-440
Spec Link: AI Video Enhance Design spec (Video Enhance, section AI Video Enhance_26.09_v2), Routing Logic board (「Add to Timeline 是開一條新的 timeline，不取代原 clip」) -
https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3293-14560
<Claude Reviewed>
```

**Images:** `20261111_eBug_drafts_Video-Enhance-R1b_16.9.0_images/17_ISS-VEA-33/`

---

# ⛔ Withdrawn by QA — do not file

Kept with their full bodies so the finding is not drafted again; nothing below may be pasted or filed.

## 18. ⛔ WITHDRAWN — ISS-VEA-17 — On Add Media opened from the Demo page, ‹ and system Back skip the Demo page  ·  Class: Functional  ·  Severity: S2  ·  Owner: RD

**Report step:** TC-201, TC-021  ·  **Reproduce:** 3/3  ·  **Verified on:** 16.9.0.2611091

> **QA note — not pasted into eBug.** **⛔ Withdrawn by QA while drafting (2026-11-11): the Android dedupe found DRA242410-0142 (Close, fixed in 15.1.0.2503311): its Expect is 「Back to the launcher page after tapping the back button on media picker page」 (after Try It Now), RD root cause 「Spec changed」 with the Recent-task back-behaviour Figma (FrPuLszSNVy2r6Vs1CKMgc). The app does what that fix made it do, so Q-9 is answered by a same-OS ticket and the rows cite it instead (ebugs.md step 1: a question a ticket already answers is cited, not filed). Kept here with its full body so it is not drafted again; reopen only if the user decides the 26.09 Design overrides that ruling.** Held in batch 1 (PQ-6); filed under the 2026-11-11 rule, as the user listed TC-201. R-014 (Design ds-main-flow Add Media ‹: back to the page Add Media was opened from; the Design draws no arrow, Q-9) and R-190 (system Back does what ‹ does). Add Media opened with 「Try It Now」 on the Demo page: system Back returned to AI Magic (Demo opened from AI Magic) and to the Launcher on the retry (opened from the Launcher); ‹ (top_toolbar_back) returned to the Launcher (TC-021). Reviewer: system Back does the same as ‹ here, so whether this is wrong rests on where ‹ should go (Q-9); if you read it so, switch Belong to PM (the Expect already names Q-9). Ran before TC-013 turned the Demo page off.

**Short Description:**

```
PDR-A 16.9.0 - [AIAgent] AI Video Enhance: ‹ and system Back on Add Media skip the Demo page it was opened from
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap 「Video Enhance」 on the Launcher
3. Tap 「Try It Now」 on the Demo page
4. Press system Back on Add Media
5. Tap 「Video Enhance」 on the Launcher
6. Tap 「Try It Now」 on the Demo page
7. Tap the back button ‹ on Add Media
8. Check the result

Result:
Both system Back and ‹ on Add Media leave to the Launcher (or AI Magic), skipping the Demo page that opened it.
摘要：從 Demo 頁進入 Add Media 後，系統返回或 ‹ 都直接回首頁（或 AI Magic），跳過 Demo 頁。
{16.9.0_vea17_back_to_ai_magic.jpg} {16.9.0_vea17_back_to_launcher.jpg} {16.9.0_vea17_arrow_back_to_launcher.jpg}

Expect Result:
‹ and system Back return to the Demo page, the page Add Media was opened from (R-014; Q-9: no arrow drawn).
摘要：‹ 與系統返回應回到開啟 Add Media 的 Demo 頁（Q-9）。

Note:
Device: Samsung SM-A5360 (Galaxy A53 5G) / Android 15
Spec Link: AI Video Enhance Design spec (Video Enhance, section AI Video Enhance_26.09_v2), Main Flow (Free user → IAP) board (Add Media back ‹; Demo page 「Try It Now」 → Add Media) -
https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3293-13054
<Claude Reviewed>
```

**Images:** `20261111_eBug_drafts_Video-Enhance-R1b_16.9.0_images/18_ISS-VEA-17/`

---

## Cited instead of filed (answered by a ruling or ticket, or carried by a card here)

| Question | Rows | Answered by | Why not filed |
|---|---|---|---|
| Credit Details name 「Video Enhancer」 (R-203) | TC-219 – TC-254 (36 rows) | DRI261895P0021 | iOS ticket (PDR-I 16.9.0, BugBelong PM): Credit Details service name 「Video Enhancer」 vs 「AI Video Enhance」; status QA Propose Won't Fix. The IF3 API exposes no status log for it (ecl_query.py bug --log, TSR.EbugLogAndData: no comments), and the web page needs a sign-in, so the reason was not read; the status itself is QA proposing to keep 「Video Enhancer」. Same server ledger string on Android (every R1 debit). Not filed; the 36 combination rows cite it. |
| Q-18 backgrounding during the upload | TC-115 | DRA262611P0079 | Filed in batch 1 (F-9, BugBelong PM by the user's decision): Home during the upload charges 30, refunded 3 h later. The PM decision Q-18 asks for is that ticket. |
| Q-23 2K+ rejection message | TC-022 | DRA262611P0072 | Filed in batch 1 (F-2): 1440p, 4K and 8K are not rejected, so the message Q-23 asks about cannot appear yet; the ticket names Q-23. |
| Q-17 processing card 「n minutes left」 (O-12) | O-12 | DRA262608-0072 / DRA262608-0071 | Open Android tickets (NewCreated, BugBelong PM, 16.6.0): static 「4 minutes left」 and zero progress (dedupe.txt, batch 1). |
| Q-1 Demo page description | TC-011 | ISS-VEA-16 (this batch) | Carried by the TC-011 defect card (owner PM: the Design frame's text must change); not a second card. |
| Q-9 Back from Add Media (TC-201 defect withdrawn, ISS-VEA-17) | TC-021, TC-201 | DRA242410-0142 | Android ticket, Close (fixed 15.1.0.2503311): Back on the media picker opened with Try It Now goes to the Launcher, not the Demo page; RD root cause 「Spec changed」 (Recent-task back-behaviour Figma FrPuLszSNVy2r6Vs1CKMgc). The app does exactly that, and system Back matches ‹. Not filed; ISS-VEA-17 is kept withdrawn in the drafts. |

## Not raised (observations, for the record)

| Item | What was seen | Why not raised |
|---|---|---|
| O-1 | Mine › Credits read 「--」 right after the subscription | Self-healed (KP-067). |
| O-4 | First-run bubble not seen in R1-a screenshots | TC-030 Pass from logcat. |
| O-16 | +2000 credit pack from another device on the shared account | Account note. |
| O-17 | R1-f ledger rows match | Account note. |
| O-20 | Completion banner waits on the Launcher until Close | As R-102. |
| O-22 | `lbl Pro` matched New Project (script) | Setup note. |
| O-24 | Saved files 3.285 s for a 3.233 s source | Within a frame. |
| O-25 | Pro tab balance lags one charge | Credit Details right. |
| O-30 | Pro test subscription ended 22:34–22:37 | Environment. |
| O-31 | Panel badge 「0fps」 for a Timeline clip whose file is gone | Missing source; not judged. |
| O-32 | Balance +30 after the TC-014 reset and sign-in (28749 → 28779) | Credit Details: 「Loyalty Credit Bonus (for PowerDirector Subscribers) +30」 2026/11/11 09:55, a server subscriber bonus on sign-in; not a finding. |
| TC-165 side note | The new project reuses the name 「Project 11-11」 of an existing project | Project naming belongs to the editor, not this feature. |
| Blocked (16) | 5 observability, 11 test-data | No verdict (reasons on the Progress page). |

## Reconciliation against the run

70 Fail (22 defect, 48 question), 16 Blocked, 32 observations (O-1 … O-32). Each maps to a batch 1 BugCode, an entry here, a citation, or not raised; a row may map to several (TC-022 and TC-269: the defect steps are batch 1, the source steps are ISS-VEA-21).

### Row-by-row map

| Item | Result | Disposition | Became |
|---|---|---|---|
| TC-002 | Fail | defect | filed DRA262611P0071 (ISS-VEA-01) |
| TC-004 | Fail | question | 10. ISS-VEA-26 (PM decision) |
| TC-011 | Fail | defect | 1. ISS-VEA-16; cited: Q-1 Demo page description → ISS-VEA-16 (this batch) |
| TC-013 | Fail | question | 4. ISS-VEA-20 (PM decision) |
| TC-201 | Fail | defect | 18. ISS-VEA-17 (withdrawn); cited: Q-9 Back from Add Media (TC-201 defect withdrawn, ISS-VEA-17) → DRA242410-0142 |
| TC-021 | Fail | question | 18. ISS-VEA-17 (withdrawn); cited: Q-9 Back from Add Media (TC-201 defect withdrawn, ISS-VEA-17) → DRA242410-0142 |
| TC-022 | Fail | defect | filed DRA262611P0072 (ISS-VEA-02); 5. ISS-VEA-21 (PM decision); cited: Q-23 2K+ rejection message → DRA262611P0072 |
| TC-033 | Fail | defect | filed DRA262611P0074 (ISS-VEA-04) |
| TC-259 | Fail | defect | filed DRA262611P0075 (ISS-VEA-05) |
| TC-215 | Fail | defect | filed DRA262611P0074 (ISS-VEA-04) |
| TC-045 | Fail | question | 6. ISS-VEA-22 (PM decision) |
| TC-264 | Fail | question | 6. ISS-VEA-22 (PM decision) |
| TC-046 | Fail | defect | 2. ISS-VEA-18 |
| TC-217 | Fail | defect | 2. ISS-VEA-18 |
| TC-263 | Fail | defect | filed DRA262611P0075 (ISS-VEA-05) |
| TC-269 | Fail | defect | filed DRA262611P0076 (ISS-VEA-06); 5. ISS-VEA-21 (PM decision) |
| TC-100 | Fail | defect | filed DRA262611P0077 (ISS-VEA-07) |
| TC-110 | Fail | defect | filed DRA262611P0078 (ISS-VEA-08) |
| TC-115 | Fail | defect | filed DRA262611P0079 (ISS-VEA-09); cited: Q-18 backgrounding during the upload → DRA262611P0079 |
| TC-131 | Fail | defect | filed DRA262611P0080 (ISS-VEA-10) |
| TC-133 | Fail | question | 12. ISS-VEA-28 (PM decision) |
| TC-140 | Fail | defect | filed DRA262611P0081 (ISS-VEA-11); filed DRA262611P0082 (ISS-VEA-12) |
| TC-141 | Fail | defect | filed DRA262611P0081 (ISS-VEA-11) |
| TC-208 | Fail | defect | filed DRA262611P0081 (ISS-VEA-11) |
| TC-152 | Fail | question | 13. ISS-VEA-29 (PM decision) |
| TC-144 | Fail | question | 14. ISS-VEA-30 (PM decision) |
| TC-265 | Fail | defect | filed DRA262611P0084 (ISS-VEA-14) |
| TC-266 | Fail | defect | filed DRA262611P0084 (ISS-VEA-14) |
| TC-267 | Fail | defect | filed DRA262611P0084 (ISS-VEA-14) |
| TC-223 | Fail | question | 13. ISS-VEA-29 (PM decision); cited: Credit Details name 「Video Enhancer」 (R-203) → DRI261895P0021 |
| TC-225 | Fail | question | 13. ISS-VEA-29 (PM decision); cited: Credit Details name 「Video Enhancer」 (R-203) → DRI261895P0021 |
| TC-224 | Fail | question | 13. ISS-VEA-29 (PM decision); cited: Credit Details name 「Video Enhancer」 (R-203) → DRI261895P0021 |
| TC-226 | Fail | question | 13. ISS-VEA-29 (PM decision); cited: Credit Details name 「Video Enhancer」 (R-203) → DRI261895P0021 |
| TC-221 | Fail | question | 13. ISS-VEA-29 (PM decision); cited: Credit Details name 「Video Enhancer」 (R-203) → DRI261895P0021 |
| TC-227 | Fail | question | 13. ISS-VEA-29 (PM decision); cited: Credit Details name 「Video Enhancer」 (R-203) → DRI261895P0021 |
| TC-228 | Fail | question | 13. ISS-VEA-29 (PM decision); cited: Credit Details name 「Video Enhancer」 (R-203) → DRI261895P0021 |
| TC-222 | Fail | question | 13. ISS-VEA-29 (PM decision); cited: Credit Details name 「Video Enhancer」 (R-203) → DRI261895P0021 |
| TC-229 | Fail | question | 13. ISS-VEA-29 (PM decision); cited: Credit Details name 「Video Enhancer」 (R-203) → DRI261895P0021 |
| TC-230 | Fail | question | 13. ISS-VEA-29 (PM decision); cited: Credit Details name 「Video Enhancer」 (R-203) → DRI261895P0021 |
| TC-220 | Fail | question | 13. ISS-VEA-29 (PM decision); cited: Credit Details name 「Video Enhancer」 (R-203) → DRI261895P0021 |
| TC-231 | Fail | question | 13. ISS-VEA-29 (PM decision); cited: Credit Details name 「Video Enhancer」 (R-203) → DRI261895P0021 |
| TC-232 | Fail | question | 13. ISS-VEA-29 (PM decision); cited: Credit Details name 「Video Enhancer」 (R-203) → DRI261895P0021 |
| TC-233 | Fail | question | 13. ISS-VEA-29 (PM decision); cited: Credit Details name 「Video Enhancer」 (R-203) → DRI261895P0021 |
| TC-234 | Fail | question | 13. ISS-VEA-29 (PM decision); cited: Credit Details name 「Video Enhancer」 (R-203) → DRI261895P0021 |
| TC-235 | Fail | question | 13. ISS-VEA-29 (PM decision); cited: Credit Details name 「Video Enhancer」 (R-203) → DRI261895P0021 |
| TC-236 | Fail | question | 13. ISS-VEA-29 (PM decision); cited: Credit Details name 「Video Enhancer」 (R-203) → DRI261895P0021 |
| TC-237 | Fail | question | 13. ISS-VEA-29 (PM decision); cited: Credit Details name 「Video Enhancer」 (R-203) → DRI261895P0021 |
| TC-238 | Fail | question | 13. ISS-VEA-29 (PM decision); cited: Credit Details name 「Video Enhancer」 (R-203) → DRI261895P0021 |
| TC-219 | Fail | question | 13. ISS-VEA-29 (PM decision); cited: Credit Details name 「Video Enhancer」 (R-203) → DRI261895P0021 |
| TC-239 | Fail | question | 13. ISS-VEA-29 (PM decision); cited: Credit Details name 「Video Enhancer」 (R-203) → DRI261895P0021 |
| TC-240 | Fail | question | 13. ISS-VEA-29 (PM decision); cited: Credit Details name 「Video Enhancer」 (R-203) → DRI261895P0021 |
| TC-241 | Fail | question | 13. ISS-VEA-29 (PM decision); cited: Credit Details name 「Video Enhancer」 (R-203) → DRI261895P0021 |
| TC-242 | Fail | question | 13. ISS-VEA-29 (PM decision); cited: Credit Details name 「Video Enhancer」 (R-203) → DRI261895P0021 |
| TC-243 | Fail | question | 13. ISS-VEA-29 (PM decision); cited: Credit Details name 「Video Enhancer」 (R-203) → DRI261895P0021 |
| TC-244 | Fail | question | 13. ISS-VEA-29 (PM decision); cited: Credit Details name 「Video Enhancer」 (R-203) → DRI261895P0021 |
| TC-245 | Fail | question | 13. ISS-VEA-29 (PM decision); cited: Credit Details name 「Video Enhancer」 (R-203) → DRI261895P0021 |
| TC-246 | Fail | question | 13. ISS-VEA-29 (PM decision); cited: Credit Details name 「Video Enhancer」 (R-203) → DRI261895P0021 |
| TC-247 | Fail | question | 13. ISS-VEA-29 (PM decision); cited: Credit Details name 「Video Enhancer」 (R-203) → DRI261895P0021 |
| TC-248 | Fail | question | 13. ISS-VEA-29 (PM decision); cited: Credit Details name 「Video Enhancer」 (R-203) → DRI261895P0021 |
| TC-249 | Fail | question | 13. ISS-VEA-29 (PM decision); cited: Credit Details name 「Video Enhancer」 (R-203) → DRI261895P0021 |
| TC-250 | Fail | question | 13. ISS-VEA-29 (PM decision); cited: Credit Details name 「Video Enhancer」 (R-203) → DRI261895P0021 |
| TC-251 | Fail | question | 13. ISS-VEA-29 (PM decision); cited: Credit Details name 「Video Enhancer」 (R-203) → DRI261895P0021 |
| TC-252 | Fail | question | 13. ISS-VEA-29 (PM decision); cited: Credit Details name 「Video Enhancer」 (R-203) → DRI261895P0021 |
| TC-253 | Fail | question | 13. ISS-VEA-29 (PM decision); cited: Credit Details name 「Video Enhancer」 (R-203) → DRI261895P0021 |
| TC-254 | Fail | question | 13. ISS-VEA-29 (PM decision); cited: Credit Details name 「Video Enhancer」 (R-203) → DRI261895P0021 |
| TC-161 | Fail | question | 16. ISS-VEA-32 (PM decision) |
| TC-162 | Fail | question | 17. ISS-VEA-33 (PM decision) |
| TC-165 | Fail | question | 17. ISS-VEA-33 (PM decision) |
| TC-093 | Fail | question | 10. ISS-VEA-26 (PM decision) |
| TC-095 | Fail | defect | 3. ISS-VEA-19 |
| TC-113 | Pass (note) | — | 11. ISS-VEA-27 (PM decision) |
| TC-037 | Pass (note) | — | 8. ISS-VEA-24 (PM decision) |
| TC-043 | Pass (note) | — | 7. ISS-VEA-23 (PM decision) |
| TC-044 | Pass (note) | — | 9. ISS-VEA-25 (PM decision) |
| O-1 | observation | — | not raised |
| O-2 | observation | — | filed DRA262611P0073 (ISS-VEA-03) |
| O-3 | observation | — | filed DRA262611P0072 (ISS-VEA-02) |
| O-4 | observation | — | not raised |
| O-5 | observation | — | filed DRA262611P0075 (ISS-VEA-05); 8. ISS-VEA-24 (PM decision); 9. ISS-VEA-25 (PM decision) |
| O-6 | observation | — | 7. ISS-VEA-23 (PM decision) |
| O-7 | observation | — | filed DRA262611P0076 (ISS-VEA-06) |
| O-8 | observation | — | filed DRA262611P0075 (ISS-VEA-05) |
| O-9 | observation | — | filed DRA262611P0081 (ISS-VEA-11) |
| O-10 | observation | — | filed DRA262611P0072 (ISS-VEA-02); not reached |
| O-11 | observation | — | filed DRA262611P0083 (ISS-VEA-13); 11. ISS-VEA-27 (PM decision) |
| O-12 | observation | — | cited: Q-17 processing card 「n minutes left」 (O-12) → DRA262608-0072 / DRA262608-0071 |
| O-13 | observation | — | filed DRA262611P0079 (ISS-VEA-09) |
| O-14 | observation | — | filed DRA262611P0078 (ISS-VEA-08) |
| O-15 | observation | — | filed DRA262611P0081 (ISS-VEA-11) |
| O-16 | observation | — | not raised |
| O-17 | observation | — | not raised |
| O-18 | observation | — | filed DRA262611P0083 (ISS-VEA-13) |
| O-19 | observation | — | filed DRA262611P0076 (ISS-VEA-06) |
| O-20 | observation | — | not raised |
| O-21 | observation | — | 15. ISS-VEA-31 (PM decision) |
| O-22 | observation | — | not raised |
| O-23 | observation | — | 15. ISS-VEA-31 (PM decision) |
| O-24 | observation | — | not raised |
| O-25 | observation | — | not raised |
| O-26 | observation | — | filed DRA262611P0084 (ISS-VEA-14) |
| O-27 | observation | — | 2. ISS-VEA-18 |
| O-28 | observation | — | filed DRA262611P0085 (ISS-VEA-15) |
| O-29 | observation | — | filed DRA262611P0079 (ISS-VEA-09); 11. ISS-VEA-27 (PM decision) |
| O-30 | observation | — | not raised |
| O-31 | observation | — | not raised |
| O-32 | observation | — | not raised |

### Owner split

| Owner | Entries |
|---|---|
| RD | 2, 3 |
| PM | 1, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17 |

### Filing order

Defects first (**1**, **2**, **3**), then the PM decisions (**4**, **5**, **6**, **7**, **8**, **9**, **10**, **11**, **12**, **13**, **14**, **15**, **16**, **17**); the withdrawn entry is never filed. Nothing is filed until the review page's decisions come back.
