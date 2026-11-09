# TR261105-0062 verify — ETHAN_HSU's tickets, 2026-11-06 (REQ-093)

Build 16.8.0.2611052 (TR build, official APK from the TR's OneDrive, MD5 A5C19120… checked), **clean install**
(uninstall + install at 10:55; REQ-047), Stage (`testserver.config` in place before the first launch, yellow bar),
Samsung Galaxy A53 (R5CTB22S05Y, Android 15). First launch: 「Get Started」, every permission allowed, the Pro offer
closed. Then signed in with the phone's Google button; Mine shows `cltqauiap2@gmail.com`, card 「Free」, 28,019 credits
(REQ-100: Android's ☰ menu has no account row, so read from Mine; the 11/05 run wrote Premium). No credits or chat
turns used. Expected result checked against today's spec (`spec-check.md`). No ticket was commented on.

| BugCode | Verdict | Note |
| --- | --- | --- |
| DRA262610P0422 | FIXED | first Launcher tap after a clean install opens the intro (DemoShortcutActivity) |

## DRA262610P0422
- 10:57:51 first tap on 「AI Mini Drama」 (signed out): intro 「AI Mini Drama」 / 「Turn your idea into a video—same
  characters, same voices, every scene.」, a demo video playing (frames differ 3 s apart), 「Don't show again」
  unticked, 「Try It Now」 (`screenshots/05_first_open.png`).
- System Back and ‹ each return to the Launcher; the next tap shows the intro again.
- 「Try It Now」 opens the landing 「Hi, I'm your AI Drama Assistant」 (MiniDramaActivity).
- 「Don't show again」 ticked + Try It Now → the next Launcher tap opens the landing directly (10:58:57).
- Log: `16.8.0.2611052_DRA262610P0422_log.txt` (Activity starts).
- Side effects: none seen (places checked: intro page on first open, with the box ticked, landing after Try It Now:
  text legible, nothing clipped or overlapping; the demo panel's top cuts a line of the demo's own text as the video
  scrolls, which is the video's content).
- Spec: Q-A15 (is the intro shown on Android?) is still open; the build does what the bug expected, so OK (REQ-098).
  Figma change check not run this session.

## Other observations (not filed)
- O-1: the intro's demo has no volume icon; R-472 (PM 2283:10856) draws one at the video's bottom right. PM-only,
  Q-A15 open; no Android ticket found (searched 「Opening Intro」, 「intro volume」). Another tester's intro bugs
  P0001 / P0007 are on this TR.

QA Report: [QR261106-0008](https://ecl.cyberlink.com/IF3/qr/BPM/FormView/QR261106-0008) filed 2026-11-06 11:09, OK 1 / Fail 0 (P0422 now Close; TR verified 1 of 8). Evidence (3 screenshots + log) uploaded to P0422 before Create; receipt `qr-receipt.json`.
