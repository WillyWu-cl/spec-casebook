# AI Hair Color Custom (Android) — round R1 report

Table v1 (85 cases, draft 20261112-100854), PhotoDirector 20.19.0 (90201900) as installed, Test Server, Samsung Galaxy
S23 (SM-S9110, adb RFCW2198L7B) / Android 16, Appium + UiAutomator2. Free account. Run 2026-11-13 10:05 → 11:19.
Plan: `../RUN-PLAN-20261113-R1.md`. Nothing filed.

## Tally

**34 Pass · 29 Fail (27 defect, 2 question) · 22 Blocked (15 test-data, 4 observability, 3 defect) · 0 Not run ·
Inconclusive queue empty.**

| Segment | Cases | Pass | Fail | Blocked |
|---|---|---|---|---|
| R1-a Intro Demo | 5 | 0 | 0 | 5 test-data |
| R1-b Entry checks | 13 | 6 | 4 defect | 3 defect (upstream TC-005) |
| R1-c Custom panel, no credits | 27 | 13 | 12 defect, 2 question | 0 |
| R1-d Generate, wait and result | 20 | 7 | 11 defect | 2 observability |
| R1-e Every style | 11 | 7 | 0 | 4 test-data |
| R1-f Low balance, Free, VIP | 4 | 1 | 0 | 3 test-data |
| R1-x (blocked at init) | 5 | 0 | 0 | 2 observability, 3 test-data |

## Fails and their evidence (eBug entries)

Drafts: `../../ebugs/2026-11-13-r1/20261113_eBug_drafts_AI-Hair-Color-Custom-R1_20.19.0.md` (15 entries, format check 0
errors). Screenshots in `screenshots/`, logs in `logs/<segment>-*/` (local only).

| Entry | Sev | Cases | What fails | Evidence |
|---|---|---|---|---|
| ISS-HCC-01 | S2 | TC-005, TC-012, TC-015 | No slanted-face warning (30° and 45°, after Crop, from Edit Room); log `doClairFaceDetect2 faceNum 1` | TC-005_tilt45, TC-012_after, TC-015_after |
| ISS-HCC-02 | S4 Doc | TC-009 | No-face copy 「No face detected. A face is required for this feature.」 (spec: 「Face is required」) | TC-009 |
| ISS-HCC-03 | S3 UI | TC-019, TC-020 | Panel shows ︽ not ⌄, keeps the ✕ ↩ ↪ ✓ row, square top corners | TC-019_panel |
| ISS-HCC-04 | S3 | TC-021 | Colour rows enabled before a style | TC-021_tap_base_crop |
| ISS-HCC-05 | S2 | TC-026, TC-027 | Ombre + Base only enables Generate; 「Both Base Color and Highlight Color are required.」 never shows | TC-026_base_only, TC-027_crop |
| ISS-HCC-06 | S3 | TC-031, TC-035 | Palette has no eyedropper | TC-031_palette, TC-035_tap_photo |
| ISS-HCC-07 | S2 | TC-086 | System Back in the palette leaves the room (QA rule pass 8) | TC-086_after_back |
| ISS-HCC-08 | S2 | TC-038, TC-040, TC-041, TC-042 | Collapse keeps 「Soft Black」 selected; outer Generate makes a template (log `is_customize FALSE`, 6 charged) | TC-038_collapsed, TC-040_result, log 10:44:47 |
| ISS-HCC-09 | S3 | TC-039 | Tapping the photo does not collapse the panel | TC-039_after2 |
| ISS-HCC-10 | S3 UI | TC-045, TC-046 | Custom wait: scan bar only, no 「Applying your new hair color...」; 46–56 s | TC-046_w1/w4, log 10:42:22–10:43:13 |
| ISS-HCC-11 | S2 | TC-047, TC-048, TC-049, TC-053 | No Intensity bar on any result | TC-045_result2, TC-040_result |
| ISS-HCC-12 | S3 | TC-057 | No one-time My AI Artwork 100 % dialog | TC-045_result2 |
| ISS-HCC-13 | S3 | TC-054 | Custom result not recalled after a template result | TC-054_custom_tap |
| ISS-HCC-14 | S3 | TC-079, TC-088, O-1, O-3 | ✕ / Back on a result ask 「Discard changes?」 and land in the Edit Room, not the Launcher | TC-079_after, TC-079_landed, TC-088_after |
| ISS-HCC-15 | S3 | O-9 | Credit chip stays at the charged balance after a refunded rejection (server refunded) | TC-045_after_ok, log 10:38:44–10:41:01 |

**Questions (Fail `--as question`, held as PM questions, not eBugs):** TC-017 (Q-2: Custom cell wand icon; first
template 「Soft Black」 not 「Platinum」), TC-085 (Q-14: Back with the panel open leaves the room). Also held: O-2 (ratio
Cancel lands in the Edit Room), O-11 (force-stopped generation still lands in My AI Artwork), O-13 (one Mixpanel style id
for every Custom style), O-7 / O-14 (palette colour kept as an extra swatch).

Dedupe (read-only, Android pool, `ebugs/2026-11-13-r1/dedupe.txt`): no same-OS duplicate. Related open tickets named in
Notes: PHA262026P0039 (20.18.0 slanted face shows 「No face detected」) on ISS-HCC-01, PHA262026P0047 (preview resets after
switching templates) on ISS-HCC-13.

## Blocked, by reason

- **test-data, no Intro Demo (5):** TC-001, TC-090, TC-003, TC-002, TC-004 — both entries go straight to the picker; app
  data may not be cleared (Q-8 open).
- **test-data, premium style on a Free account (4):** TC-061 Balayage, TC-058 Face framing, TC-059 Bangs, TC-067
  Half-and-half — crowns, 「UNLOCK TO VIP」, Generate opens the paywall (closed, nothing charged).
- **test-data, balance and tier (3):** TC-073 (under 6 credits, Quick Credit Refill), TC-070 (Free, under 6), TC-071
  (VIP, under 6) — balance 1916, Free; the KP-105 debug-dialog reset needs the user's go-ahead (not done).
- **test-data, inputs not given (3):** TC-081, TC-082 (deeplink format, Q-11), TC-084 (CMS list, Q-13).
- **observability (4):** TC-036, TC-037 (the log has no request body: r/g/b and main_color fields not visible), TC-075,
  TC-076 (no fault switch forces a server failure on PhotoDirector Android).
- **defect, upstream ISS-HCC-01 (3):** TC-006, TC-087, TC-007 (the slanted-face dialog never shows).

## Observations

O-1 … O-15 in `observations.md`. Raised: O-1 / O-3 (in ISS-HCC-14), O-9 (ISS-HCC-15). Held as PM questions: O-2, O-7,
O-11, O-13, O-14. Not raised: O-4 (fixture), O-5, O-6, O-8 (same row as ISS-HCC-03), O-10 (watermarked fixtures
rejected by moderation, refunded — runs moved to a Pexels portrait), O-12, O-15 (premium paywall works, TC-069 Pass).

## Credits, time, tokens, coverage

- **Credits:** 1994 → 1916 = **78 spent**, 13 charged generations × 6 (R1-d 6, R1-e 7); 2 rejected generations refunded
  (+6 each, server and Details row); paywall opens charged nothing.
- **Time** (`run-log.ts time`): wall 1 h 14 m, test 1 h 14 m, idle 0. R1-a 5 m, R1-b 12 m, R1-c 14 m, R1-d 21 m,
  R1-e 18 m, R1-f 4 m.
- **Tokens** (`token-usage.ts --since 2026-11-13T02:00Z` over the 7 transcripts naming the run, orchestrator plus
  segment subagents): 431 messages, input 998, cache write 1,001,971, cache read 62,258,865, output 180,679 — 63.4 M
  processed. Usage-card snapshots (`usage-log.ts`) were not taken during this run.
- **Coverage** (`coverage-page.ts phd/ai-hair-color-custom android --runs 2026-11-13-r1` → `../../coverage.html`):
  controls 29 — 23 ran, 6 blocked; arrows 5 — 5 ran; spec notes 20 / 28 traced (14 ran, 1 blocked, 5 n/a). Tap proof:
  **0 taps** — the Android client writes no `taps.jsonl`, so no control is marked pressed by proof.

## Open items

1. **No TR named** for this run: the installed build 20.19.0 / 90201900 was tested; filing needs the TR whose header
   names it.
2. **ECL product unconfirmed:** `library/phd/product.json` has `ecl_product` 「PhotoDirector Mobile for Android」; the
   read-only dedupe found PHA tickets under it (PHA262026P0005…P0048), but confirm before filing.
3. eBug review page: `../../ebugs/2026-11-13-r1/20261113_eBug_review_AI-Hair-Color-Custom-R1_20.19.0.html` (local,
   git-ignored; Creator and TRCode blank — no filed batch for this feature yet). Not checked at 600 px: the browser
   pane could not open the local file.
4. `verify_ebug_drafts.py` cannot run on Windows (its index search `while d != '/'` never ends); the format check
   passed with 0 errors.
5. Cases that need the user: TC-070 / TC-071 / TC-073 (KP-105 reset or a low-balance / VIP account), TC-058 / TC-059 /
   TC-061 / TC-067 (VIP account), the Intro Demo rows (fresh install or app-data clear, not allowed now).

## Knowledge

`knowledge.ts phd/ai-hair-color-custom inbox`: 0 open items, and no observation names a knowledge entry, so the
domain-knowledge subagent was not run.
