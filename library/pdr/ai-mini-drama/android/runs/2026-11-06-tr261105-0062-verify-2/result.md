# TR261105-0062 verify round 2 — ETHAN_HSU's four added bugs, 2026-11-06 (REQ-093, REQ-105)

Build 16.8.0.2611052 (official, installed 10:55), Stage, Samsung Galaxy A53 (R5CTB22S05Y, Android 15), Mine shows
`cltqauiap2@gmail.com`, card 「Free」. Verified: details in `result-s1.md`, `result-s2.md`, `result-s3.md` (segment 3 on Pro, 28,081 credits, 3 videos). No ticket touched, no QR filed.

| BugCode | Verdict so far | Open |
| --- | --- | --- |
| DRA262610P0343 | FIXED | system Back not repeated on this build (the bug names ←) |
| DRA262610P0348 | OK (Note) | O-20: the video card is back after a History reopen and after terminate + relaunch; swipe-away loss of chat text is Android's current design (YUTUNG_LEE 11/05), not this bug |
| DRA262610P0358 | OK (Note) | judged on a Fast Preview 30 s job (user, 2026-11-06: "judge from preview"): renamed while processing, push and 「Good news!」 toast use the new name; the filed scene-3 update path had no stage ② to rename in (update went stage ① → done), not repeated |
| DRA262610P0363 | FIXED | four History opens within 2 min of leaving stage ② all landed on the video stage |

Used segments 1–2: 38 credits (28,019 → 27,981), no video generated, 8 sends plus one template open: 9 of 10 free chats by R-142.
Segment 3: 228 credits (28,081 → 27,853): storyboard, Preview 30 s 60, rest of the video 120, storyboard update 6; the scene-3 update's 30 not charged as of 15:22.

Checked by the orchestrator: the `isBlocked=true` lines are in `16.8.0.2611052_DRA262610P0348_log2.txt` (14:15:53.8). The same
line shows for Chrome earlier the same day, and netpolicy shows no restriction on PowerDirector (Restrict background and
power off, standby bucket 10), so this is the phone's general blocking of background apps, not a setting on this app.
The next video job stays in the foreground except for the leave steps a bug names, and that risk stands for those.

Other observations (not filed, dedupe first): O-5 toast before the in-chat video card loaded (s3); O-6 scene update offered as 「Create the rest of the video (15 sec)」 (s3); O-7 storyboard card keeps the old title after rename (s3); O-8 update's 30 credits not charged (s3); O-1 no video settings card after a server voice failure (s1); O-2 card ◆36,
charged 35 (s1); storyboard stage ② dies 5 s after the app goes to the background, TC-514 / R-321 (s2); 3 credits charged for
an image whose download failed, no refund by 14:21 (s2).

## Wrong TR found at filing (2026-11-06 ~15:45)
The four bugs are **not on TR261105-0062** (its verify list: P0155, P0009, P0153, P0021, P0038, P0193, P0025, P0385, P0422,
plus P0051 / P0052 found on it). At 12:05 they were put on **TR261106-0032, build 16.8.0.2611061** (R17, due 2026-11-10,
29 bugs on its verify list). `bugs.md` read that as TR261105-0062 growing; it was a new TR. Every verdict above is on
2611052, not the build the bugs were sent for, so **no QR was filed**: the QR form for TR261105-0062 has no rows for them,
and a QR on TR261106-0032 needs the checks repeated on 2611061.
Already done before this was found (cannot be removed): `qa-report.ts upload --send` put this run's 2611052 files on the
four eBugs (17 files, names start with `16.8.0.2611052_`); no comment, no Reason names them.

**Filed after all (user, 2026-11-06: "they got moved from the old TR to this new one, it's ok to just file them"):**
[QR261106-0022](https://ecl.cyberlink.com/IF3/qr/BPM/FormView/QR261106-0022) on TR261106-0032, OK 4. The fields, Details b
and every Reason name the tested build 16.8.0.2611052. Read back: matches `text`; the four bugs are now Close and
verified on TR261106-0032; the other 19 rows (P0424 among them, handled in another session) were not touched. `qr-receipt.json`.
