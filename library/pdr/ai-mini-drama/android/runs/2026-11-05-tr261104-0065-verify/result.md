# TR261104-0065 verify — ETHAN_HSU's tickets, 2026-11-05 (REQ-093)

Build 16.8.0.2611041 (TR build, debuggable re-sign of the official APK, installed with data kept, REQ-089), Stage,
Samsung Galaxy A53 (R5CTB22S05Y, Android 15), Pro account (signed in by the user). One ordered journey (`verify-plan.md`):
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
