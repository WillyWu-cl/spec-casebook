# AI Video Enhance (Android) — eBug drafts, round R1 batch 3 (table v5), PDR-A 16.9.0 build 2611091

**Source:** pdr-spec-casebook run `library/pdr/video-enhance/android/runs/2026-11-10-r1-full/` — TC-022 step 3, recorded in R1-a (2026-11-10 17:19) and re-judged on 2026-11-11 against table v5 (REQ-011: today's 26.09_v2 board takes 4K for a source above it; the 2K+ block, DRA262611P0072, followed the old board and was Cancelled). Samsung SM-A5360 (Galaxy A53 5G) / Android 15, TR261109-0041, Stage server, account cltqauiap2@gmail.com. Tally now: 85 Pass, 67 Fail, 16 Blocked.

**Status:** nothing filed, uploaded or commented. Batches 1 and 2 are filed (DRA262611P0071 – P0085, P0086 – P0100); nothing here repeats them. Dedupe is read-only, Android pool only (per OS).

Rules: spec-casebook `ebugs.md` step 1 (2026-11-11), overlay rules 1–5, Design source = page 2974:19965 section 「AI Video Enhance_26.09_v2」 only (REQ-010), Spec Link URL on its own line. Severity proposed as 2, as for batches 1 and 2.

**What is drafted:** 1 entry, a defect (owner RD: the Design states the rule and the app differs).

Legend — Class: Functional / UI · Severity: S1 critical and blocking only, S2 important, S3 moderate, S4 minor · Owner: RD or PM.

---

## 1. ISS-VEA-34 — An 8K video is converted to Full HD before the panel, which then shows a black Preview, 「0fps · 1080p」 and disabled fps chips  ·  Class: Functional  ·  Severity: S2  ·  Owner: RD

**Report step:** TC-022 (step 3)  ·  **Reproduce:** 1/1  ·  **Verified on:** 16.9.0.2611091

> **QA note — not pasted into eBug.** R-196 / R-044 (Design ds-ai-video-enhance 預設值規則: Resolution 「選不低於來源解析度的最小選項；來源超過最高選項時取最高」, lookup 1081p → 4K; REQ-011). The same row's 1440p and 4K steps open the panel with 4K and the right badge (「30fps · 1440p」, 「30fps · 2160p」), so only 8K goes wrong. ve-res8k.mp4 is HEVC 7680 × 4320, 30 fps, 2.000 s; tapping it shows the editor's 「Converting for Better Performance」 dialog (its text is about the editor's overlay track), the log shows the HEVC source re-encoded to H.264 (17:19:12–17:19:16), and the panel then opens on the converted copy: black Preview, badge 「0fps · 1080p」, every fps chip disabled, 1080p price (「Charge 2 credits per second」, Enhance 4). PM E1 [待確認] (≤ 4K, larger greyed with a toast) is older than the Design and still open (Q-13); either way the panel shown is wrong, so this is filed as a defect, not held. Related, not duplicates: DRA262611P0073 (「0fps」 for stock and Timeline sources, another cause), DRA262611P0089 (Q-13 for under 1 s and MKV). Reproduced once (R1-a); not rerun since.

**Short Description:**

```
PDR-A 16.9.0 - [AIAgent] AI Video Enhance: 8K video is converted to Full HD; panel shows a black Preview, 「0fps · 1080p」
```

**Description:**

```
Repro Steps:
1. Launch the APP
2. Tap 「Video Enhance」 on the Launcher
3. Tap a 2 s 8K (7680 × 4320) HEVC 30 fps video in Add Media
4. Tap 「OK」 on 「Converting for Better Performance」
5. Wait for the panel
6. Check the result

Result:
After a Full HD conversion the panel shows a black Preview, 「0fps · 1080p」, no fps chips and the 1080p rate.
摘要：8K 影片先轉成 Full HD，面板預覽全黑、顯示「0fps · 1080p」，fps 不可選，以 1080p 計價。
{16.9.0_vea34_8k_converting_dialog.jpg} {16.9.0_vea34_8k_panel_black.jpg} {16.9.0_vea34_4k_panel_ok.jpg} {16.9.0_vea34_log.txt}

Expect Result:
The panel opens like for a 4K video: Preview shows it, badge 「30fps · 4320p」, fps chips enabled, 「4K」 selected.
摘要：8K 影片應如 4K 影片正常開啟：預覽正常、標示「30fps · 4320p」、可選 fps，解析度預設 4K。

Note:
Device: Samsung SM-A5360 (Galaxy A53 5G) / Android 15
Spec Link: AI Video Enhance Design spec (Video Enhance, section AI Video Enhance_26.09_v2), AI Video Enhance (settings) board (預設值規則: Resolution takes the highest option when the source is above it) -
https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3300-32003
<Claude Reviewed>
```

**Images:** `20261111_eBug_drafts_Video-Enhance-R1c_16.9.0_images/01_ISS-VEA-34/`

---

# Not raised in this batch

| Item | Where it stands |
|---|---|
| TC-022 steps 1–2 (1440p, 4K) | Pass under table v5: 4K selected, right badge |
| TC-022 steps 4–5 (under 1 s, MKV) | Filed in batch 2 as DRA262611P0089 (Q-13) |
| The editor dialog's text on the Video Enhance path (「…on the video overlays track…」) | Part of this entry's Result (the dialog belongs to the conversion); not a separate bug |

### Row-by-row map

| Item | Result | Disposition | Became |
|---|---|---|---|
| TC-022 | Fail | defect | 1. ISS-VEA-34 (step 3); steps 4–5 filed DRA262611P0089 (ISS-VEA-21) |

### Owner split

| Owner | Entries |
|---|---|
| RD | 1 |
| PM | — |
