# TR261104-0065 verify — ETHAN_HSU's tickets, 2026-11-05 (REQ-093)

Build 16.8.0.2611041 (TR build, debuggable re-sign of the official APK, installed with data kept, REQ-089), Stage,
Samsung Galaxy A53 (R5CTB22S05Y, Android 15), account cltqauiap2@gmail.com (Premium, signed in by the user; REQ-100). One ordered journey (`verify-plan.md`):
drama 1 「Stormbound」 (segments 1–2), drama 2 「Salt Broth」 + a throwaway chat (segments 3–4), French by per-app
locale (restored). Expected results checked against today's spec (`spec-check.md`). Credits 28,197 → 28,119; about 27
chat turns; no video generated. No ticket was commented on or changed. Details: `result-s1.md` … `result-s4.md`.
Figma change check: `figma-pm` / `figma-design` were disconnected this session; boards flagged unread in `spec-check.md`
are still unread.

| BugCode | Verdict | Note |
| --- | --- | --- |
| DRA262610P0324 | FIXED | five different strings |
| DRA262610P0326 | FIXED | Other once (label 「Other」, P0020's issue) |
| DRA262610P0328 | FIXED | 「1 character」 shown (price ◆4 vs spec ◆6 is P0327) |
| DRA262610P0332 | FIXED | s3: typed name → Update characters card; s1: Iris asked name + age with no chips, the name alone got a follow-up question |
| DRA262610P0350 | FIXED | moves to top, view stays, ↓ on overflow (as the bug expected; user: mark OK although board 5128:8 is unread) |
| DRA262610P0354 | FIXED | line on storyboard, update and video cards |
| DRA262610P0381 | FIXED | Stay and Leave anyway both per spec |
| DRA262610P0388 | STILL REPRODUCES | Scene 4 charged −3, failed 15:08, not refunded after 70 min; chat silent; ↻ not 「!」 |
| DRA262610P0415 | STILL REPRODUCES | s4: one scene image charged −3 and failed 15:47, not refunded after 31 min |
| DRA262610P0416 | STILL REPRODUCES | Preview 180 / 120 / 60, Full 544 / 364 / 184 vs 180 / 390 / 120, 540 / 1170 / 360 |
| DRA262610P0424 | STILL REPRODUCES (half) | 「Langage de la vidéo」 remains; 「Des crédits seront consommés…」 fixed |

QA Report: [QR261105-0035](https://ecl.cyberlink.com/IF3/qr/BPM/FormView/QR261105-0035) filed 2026-11-05 with the evidence ZIP, OK 7 / Fail 4 (tickets: 7 Close, 4 Fail); receipt `qr-receipt.json`.
Each bug's verify screenshots and logs were then uploaded to the bug itself (40 files on 11 eBugs, REQ-099; `upload-bugs.log`).

## Retry 2026-11-06: side effects of the P0354 fix (REQ-102)
User: P0354's verify missed the side effect that [DRA262611P0038](https://ecl.cyberlink.com/IF3/ebug/BPM/FormView/DRA262611P0038)
(BALLY_HSU, 2026-11-05, same TR and build) reports. Re-checked on this run's own 2611041 screenshots:

| Place | 「You'll have N left」 | Contrast | Next to it |
| --- | --- | --- | --- |
| Create storyboard card (blue) `…P0354_02_storyboard_card.png` | grey RGB(138,147,164) on blue RGB(57,113,189) | **1.6:1**, barely readable | 「Credits will be consumed for this task.」 white, about 5.9:1 |
| Video settings card (dark) `…P0354_01_video_card.png` | same grey on RGB(35,42,53) | about 4.7:1, readable | |

- Side effect: **seen**, the storyboard (and Update characters) card. The evidence held it on 11/05; the verify read
  the line from the page source and never judged how it looked. RD's root cause on P0038 agrees: `textSecondary`
  from 30172f1 (the P0354 fix) on the card's blue gradient.
- P0354's verdict stays OK (the line is there, as the bug expected; a new problem never fails the original bug). The
  side effect is already filed as P0038, so nothing to file; QR261105-0035 and the tickets are not touched (no comments
  on existing eBugs).
- P0038 is RDResolve (PR 3155, NeedCodeReview) and not yet in a build: verify it on the next TR build that contains
  the fix, on the storyboard, Update characters and video cards, in dark mode.
- Process fix: `qa-report/SKILL.md` › Verify first › *Side effects of the fix*.
