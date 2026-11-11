# Video Enhance Android — R1 report (table v4, first full run)

- **Build:** PowerDirector Mobile for Android 16.9.0 (2611091), SR DRA261109-01, TR261109-0041 (Generic v16.9), APK MD5 checked.
- **Server:** Stage.
- **Phone:** Samsung SM-A5360, Android 15, on USB.
- **Account:** cltqauiap2@gmail.com. It was on a Pro test subscription until about 22:35, then Free (O-30).
- **Table and draft:** table v4 (168 rows), draft 20261110-160000, REQ-009.
- **When:** 2026-11-10, 17:10 to 22:51 phone time (UTC+8).
- **Status:** nothing filed and nothing committed.

## Final tally

**79 Pass, 66 Fail, 23 Blocked, 0 Not run.**

- Fail: 21 defect, 45 question.
- Blocked: 18 test-data, 5 observability.

| Segment | Rows | Pass | Fail (defect / question) | Blocked |
|---|---|---|---|---|
| R1-a Entry points, Demo page, Add Media | 19 | 9 | 7 (4 / 3) | 3 |
| R1-b Panel layout, first-run bubble, trim | 24 | 17 | 7 (5 / 2) | 0 |
| R1-c Defaults, chips, Mode length limit | 25 | 24 | 1 (1 / 0) | 0 |
| R1-d Credit price, eligibility, purchase | 9 | 4 | 2 (2 / 0) | 3 |
| R1-e Generating, cancel, background, notifications | 20 | 12 | 4 (3 / 1) | 4 |
| R1-f Recent task, Result, failure | 22 | 8 | 8 (6 / 2) | 6 |
| R1-g1 Standard combinations | 18 | 0 | 18 (0 / 18) | 0 |
| R1-g2 Professional combinations | 18 | 0 | 18 (0 / 18) | 0 |
| R1-h Timeline entry | 7 | 2 | 0 | 5 |
| R1-i Free account rows | 6 | 3 | 1 (0 / 1) | 2 |

About the table:

- **TC-004 (Fail, question) moved to R1-a.** R1-a recorded it Blocked. R1-i rechecked it on the Free account and replaced that result.
- **All 36 combination rows in R1-g1 and R1-g2 failed on copy only.** Every price, saved file (resolution, fps, length), debit and Result was right. Each row failed only on the two copy strings, PQ-1 and PQ-2 below.

### Wrap-up recheck of TC-113 / TC-115 (O-29)

I read Credit Details at 22:53, scrolling back to 2026/11/06:

- **The charges.** The account has only two 「Video Enhancer -30」 rows: 18:38 (TC-113, Leave) and 18:44 (TC-115, Home).
- **The refunds.** The only two 「Generation failed, credits returned +30 / PowerDirector (Android)」 rows are at 21:40 and 22:00. Logcat shows no app call around either time, so the server returned the credits by itself.
- **How late.** If the refunds came in order, TC-113's took about 3 h 02 min and TC-115's about 3 h 16 min. Whichever refund is TC-115's, it came at least 2 h 56 min after the charge.
- **TC-113 stays Pass.** The row checks the balance right after 「Leave」. The note now records that the refund came anyway, so in the end the dialog's 「credits will not be restored」 did not hold (PQ-12).
- **TC-115 stays Fail (defect).** The task was charged at once and refunded only about 3 h later. Its result text now says this; it used to say "no refund".

## Defects: 15 eBug drafts

The drafts are in `library/pdr/video-enhance/android/ebugs/2026-11-10-r1/`:

- the drafts file `20261110_eBug_drafts_Video-Enhance-R1_16.9.0.md`;
- the review page `20261110_eBug_review_Video-Enhance-R1_16.9.0.html`.

All 15 are proposed for filing. The format check gives 0 errors and 0 warnings (`check.txt`).

| # | ISS | Finding | Rows | Type · Sev · Owner |
|---|---|---|---|---|
| 1 | VEA-01 | The Launcher shortcut and the AI Magic card say 「Video Enhance」, not 「AI Video Enhance」 | TC-002 | UI · S3 · Doc |
| 2 | VEA-02 | 1440p, 4K and 8K sources open the panel; there is no 2K+ block | TC-022, O-3 | Func · S2 · RD |
| 3 | VEA-03 | The badge reads 「0fps」 and every fps chip is disabled for stock, Timeline and 8K sources | O-2 | Func · S3 · RD |
| 4 | VEA-04 | The Preview shows no 「00:00/<length>」 until play is tapped | TC-033, TC-215 | UI · S3 · RD |
| 5 | VEA-05 | Shown lengths are truncated, so a selection that reads 「02:30」 cannot switch to Professional | TC-263, TC-259, O-8, O-5b | Func · S3 · RD |
| 6 | VEA-06 | Exact whole-second videos are billed one second more (1 s → 2, 30 s → 31, which was charged, 3:00 → 181) | TC-269, O-7, O-19 | Func · S2 · RD |
| 7 | VEA-07 | Offline, 「Enhance」 gives no feedback at all | TC-100 | Func · S3 · RD |
| 8 | VEA-08 | The ring sits at 0% for about 48 s (local transcode), then stalls 30–40 s at a time | TC-110, O-14 | Func · S3 · RD |
| 9 | VEA-09 | Home during the upload charges 30 with no task; the refund comes about 3 h later | TC-115, O-13, O-29 | Func · S2 · RD |
| 10 | VEA-10 | The banner's 「View」 opens a black Result that never loads | TC-131 | Func · S2 · RD |
| 11 | VEA-11 | Recent task has no ‹, and system Back goes to the Launcher, never to the panel | TC-141, TC-208, TC-140, O-9, O-15 | Func · S3 · RD |
| 12 | VEA-12 | The Recent task notice says 「1 year」 and offers 「Select」, not 「1 Year」 and 「Manage」 | TC-140 | UI · S3 · Doc |
| 13 | VEA-13 | Cancelled tasks leave cards of length 「3961:06:40」 with a blank thumbnail and 「Retry」 | O-11, O-18 | UI · S3 · RD |
| 14 | VEA-14 | Task times are far over the 1.5–2.5× company standard (1 s ≈ 62 s, 3.2 s ≈ 53 s, 30 s ≈ 103 s) | TC-265 – TC-267, O-26 | Func · S3 · RD |
| 15 | VEA-15 | In Professional, Sharp gives practically the same video as Natural in all nine pairs | O-28 | Func · S3 · RD |

### About the drafts

- **Spec basis check (REQ-055).** Four rows recorded as defects are held as PM questions instead, because their rule is a PM proposal or an open question:
  - TC-011: the Design frame carries the same AI Reframe text (Q-1).
  - TC-201: system Back does what ‹ does, and ‹ is Q-9.
  - TC-046 and TC-217: the 1 s minimum is PM B1 [建議].
- **Reviewer notes on two cards.**
  - **VEA-09:** its "backgrounding = no charge" part is PM C3 [建議] (Q-18). The row note says to decide with the user before filing.
  - **VEA-07:** the toast copy is a PM proposal.
- **O-28 (Sharp in Professional) is drafted as VEA-15, with RD as owner.** The evidence is the nine `TC-24x-vs-TC-2xx.png` crops. Edge strength is equal to two decimals in every pair, and PSNR between the two results is 45.7–52 dB. In Standard the two styles differ clearly (39.7 dB). RD may forward it to PM if Professional is meant to ignore the style.
- **Dedupe (Android pool only, read-only).**
  - No entry repeats an existing ticket (`dedupe-query.txt`, `dedupe.txt`).
  - O-12 (the processing card's 「n minutes left」 never counts down) matches open DRA262608-0072 and -0071 (16.6, PM). It is in `dedupe.txt` only.
- **Filing defaults.** No Video Enhance batch has been filed yet. The review page prefills Creator ETHAN_HSU, [AIAgent] and API from the AI Mini Drama Android batch 2026-10-30-a7, and TR261109-0041 from this run. Each is marked 「confirm」.
- **`verify_ebug_drafts.py`** reports "unknown sheet" for every Figma Spec Link. Its sheet index only knows PDF sheets; the A7 batch got the same result.
- **Not checked at 600 px.** The review page was not checked in a 600 px browser window, because the browser pane refused the local page. It uses the A7 page's wrap rules.

## PM and table questions (16; no eBugs)

| # | Rows | Question |
|---|---|---|
| PQ-1 | TC-152 and the 36 combination rows (TC-219 – TC-254) | The toast says 「Saved to Gallery」; R-122 (PM D3 [建議]) says 「Saved to your device」. Which copy ships? |
| PQ-2 | The 36 combination rows (every Video Enhance debit) | The Credit Details row is named 「Video Enhancer」; R-203 (PM naming via the spec agent) says 「AI Video Enhance」. |
| PQ-3 | TC-133 | The background notification uses the banner copy, not PM §9's 「Your video is ready. Tap to view.」. |
| PQ-4 | TC-011 (recorded defect) | The Demo page description is AI Reframe's text, which is also in the Design frame (Q-1). PM or Design to give the copy, then file it to Doc. |
| PQ-5 | TC-013 | 「Don't show again」 is saved when the page is left with ‹ (R-010 [建議] says only with Try It Now). |
| PQ-6 | TC-021, TC-201 (TC-201 recorded defect) | ‹ and system Back on Add Media skip the Demo page (Q-9). |
| PQ-7 | TC-046, TC-217 (recorded defect), O-27 | A selection can go under 1 s (「00:00」, priced as 1 s). R-035 is [建議]. |
| PQ-8 | TC-045, TC-264 | The strip is not re-laid to 2:30 per width in Professional (Q-24). |
| PQ-9 | TC-144 | 「Select」 offers only Delete. What should 「Manage」 open (Q-8)? |
| PQ-10 | TC-093 | The Android IAP page has no Pro / Pro+ tabs and no 「Tap to compare」, and shows 「POPULAR」 58% OFF. This is a table question: Android sells Pro only. |
| PQ-11 | TC-004 | The clip toolbar badge reads 「Pro」, not 「Pro+」. This is a table question: Android's tier rule. |
| PQ-12 | TC-113 (Pass) | 「Leave」 is charged as the Design dialog says, but PM §8 says no charge before the upload reaches the server (Q-2). The credits then came back about 3 h later anyway. |
| PQ-13 | TC-022 steps 4–5, TC-269 step 1 | Sources under 1 s and an MKV are not greyed (Q-13). |
| PQ-14 | O-6 | Dragging the selection moves it against the finger. |
| PQ-15 | O-5 | The full-screen preview has no close control and always restarts at 00:00. The Standard-limit bubble covers the Preview time. |
| PQ-16 | O-23 | Every completed task is auto-written to Movies/…/Video Enhance/ (not media-scanned), and Save Result writes a second copy. |

**The copy strings repeat across many rows:**
- 「Saved to Gallery」 appears in 37 rows (TC-152 plus all 36 combination rows).
- 「Video Enhancer」 appears in 36 rows and in every Video Enhance ledger row of the run.

## Observations

There are 31 observations, O-1 to O-31, in `observations.md`. Each one is mapped in the drafts file:

- **Drafted:** O-2, O-3, O-5b, O-7, O-8, O-9, O-11, O-13, O-14, O-15, O-18, O-19, O-26, O-28, O-29.
- **Held as PM questions:** O-5a/c, O-6, O-23, O-27.
- **Not raised:** O-1, O-4, O-12 (an existing ticket), O-16, O-17, O-20, O-21, O-22, O-24, O-25, O-30, O-31.
- **Not reached:** O-10.

The knowledge-inbox subagent filed the run's facts:
- **Inbox item:** I-001 became KF-059 (AI Mini Drama).
- **Corrected:** KP-008, KP-009 and KP-041.
- **Stamped verified on 2611091:** KP-006, KP-007, KP-008 and KP-009.
- **New product entries:** KP-067 (credits read 「--」 after a Play purchase until a relaunch) and KP-068 (the Play test subscription ended within about 5 h).
- **New feature folder:** `library/pdr/video-enhance/knowledge/` with KF-001 – KF-008 (billed seconds, the charge stamped at the Enhance tap, late refunds, Recent task quirks, timings, the double save, the 0fps badge).
- **Fixed in passing:** KP-066 now has `authority: spec`.

## Credits

| Segment | Charged | Notes |
|---|---|---|
| R1-e | 248 | 180 + 4 + 30 + 30 + 4 |
| R1-f | 37 | 2 + 4 + 31 |
| R1-g1 | 208 | 18 tasks |
| R1-g2 | 1008 | 18 tasks |
| Refunds | +60 | 21:40 and 22:00, for TC-113 and TC-115 |

- **Total:** 1,501 credits charged in 40 tasks; 1,441 net after the 60 refunded.
- **Balance:** 27,852 → 28,411. That includes a +2,000 credit pack bought from another device on the shared account at 18:51 (O-16).
- **Nothing bought:** this phone bought nothing, and no full purchase flow was run.
- **Ledger and logcat:** Credit Details rows match every charge by time and amount. Each charge is stamped at the Enhance tap (create session), not when the upload ends (O-13).

## Account, subscription and policy blocks (23 Blocked)

- **The Pro test subscription lapsed (O-30).** It ended on its own between 22:34 and 22:37. Opening the app afterwards showed the Pro paywall; it was closed with ‹ and nothing was bought.
  - **5 Timeline rows Blocked:** TC-160, TC-161, TC-162, TC-164 and TC-165 are Blocked test-data and need a paid account. To rerun them, the account must be paid again, and they need ve-0500 / ve-1000 / ve-0030 projects.
  - **Free rows ran:** R1-i's Free rows (TC-090, TC-093, TC-094, TC-206 and the TC-004 recheck) ran after the lapse.
- **TC-095 / TC-097 are Blocked by the purchase policy.** A Google Play purchase needs the user's go-ahead (TC-097 also needs a low balance).
- **The other 16 Blocked rows:**

| Rows | Reason |
|---|---|
| TC-170, TC-171, TC-173, TC-174, TC-210 | No fault switch on Android for a server failure (observability) |
| TC-118 – TC-120, TC-211 | Turning notifications off needs the user's go-ahead |
| TC-096, TC-098, TC-207 | Need a low balance |
| TC-014 | The Demo page was already turned off by TC-013 |
| TC-255 | Google Drive / Photos OAuth is not granted |
| TC-023 | Needs an empty gallery |
| TC-268 | Needs a task 2 days old |

## Time, tokens, usage, coverage

- **Time.**
  - Wall time is 5 h 57 m (16:57 → 22:55, wrap-up included), with no idle gap over 15 min.
  - Test time per segment: R1-a 33 m, R1-b 22 m, R1-c 21 m, R1-d 10 m, R1-e 36 m, R1-f 23 m, R1-g1 1 h 10 m, R1-g2 2 h 09 m, R1-h 7 m, R1-i 7 m.
  - The combination segments are long because each Professional task took 208 – 544 s.
- **Tokens.** These are from `token-usage.ts --since 2026-11-10T08:57Z`, over the orchestrator and every segment's subagent transcript: 1,133 messages (claude-opus-5-5), input 2.5 k, cache-write 3.78 M, cache-read 177.4 M, output 461 k, 181.6 M processed in all.
- **Usage (`runs/usage.jsonl`, seat 6.25× Pro).** The account is shared, so these readings overstate the run.
  - The first 5-hour window went from 36 % to 57 % (setup to the end of R1-e).
  - A new window started at R1-f: 2 % → 15 % at the end of R1-i.
  - Weekly: 6 % → 12 %.
- **Coverage.** This is from `coverage-page.ts pdr/video-enhance android --runs 2026-11-10-r1-full`, written to `android/coverage.html`.
  - **Controls:** 66 ran, 12 blocked, 50 n/a.
  - **Flow arrows:** 26 ran, 9 blocked.
  - **Spec notes:** 99 of 112 traced (62 ran, 13 blocked, 24 n/a).
  - **Board images:** 11 of 12.
  - **No tap proof:** the Android device script writes no `taps.jsonl`, so no control counts as "pressed (proof)". Coverage comes from the rows' results.
- **Production credit actions not exercised.** The run was on Stage, so the Production 「VideoEnhanceV2」 credit actions from the RD note were not used.

## What the user decides

1. **The eBug review page.** Decide file or hold for each card, the Creator and TR, and in particular VEA-09 (Q-18) and VEA-07.
2. **The 16 PM / table questions.** In particular PQ-1 / PQ-2, the copy strings that fail 37 and 36 rows.
3. **Making the account paid again.** The 5 Timeline rows need it. Any purchase rows also need a go-ahead.

## Update 2026-11-11 (table v5)

- **Old board (REQ-011):** DRA262611P0072 (2K+ block) followed the spec agent's 2026-10-07 export of the old 26.09_v2
  state and was Cancelled. Today's board takes 4K for larger sources, so TC-022 steps 1–3 now expect the panel: 1440p
  and 4K do, 8K does not (black Preview, 「0fps · 1080p」, fps chips disabled) — filed as DRA262611P0101.
- **Rulings (REQ-012):** Android has no Pro+ and no 「You're all set」 dialog; TC-004, TC-093, TC-095 re-recorded Pass.
- **P0076 (one extra credit):** the app bills the video track's own length rounded up; the test videos carry 33 ms of
  encoder padding. Padding-free 1.000 s files price at 1 and camera videos have no padding (KF-001).
- **Batch 2 filed:** DRA262611P0086 – P0100 (15; F-3 and F-10 held).
- **Run now:** 85 Pass, 67 Fail, 16 Blocked.

