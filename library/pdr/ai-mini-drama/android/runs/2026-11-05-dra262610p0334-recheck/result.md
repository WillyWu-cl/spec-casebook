# DRA262610P0334 recheck — 2026-11-05 (RD: matches PM 10/22 update, retest)

Ticket: 「Back during a chat character update leaves with no stop dialog」 (A2 AMDA-13, filed on 16.8.0.2610212; Fail on QR261103-0042 on 2611021).
Case: TC-351 (R-254).

Two readings are recorded against what the app does; this file does not decide the ticket:
- **Original (TC-351 / R-254):** Back during a chat character update asks 「Stop and lose your credits?」 with Leave anyway / Keep Generating.
- **PM 10/22 two-stage (Figma 4422:2 §13.24, `specs/2026-10-21-2/extracted/board-notes.md`):** stage ① (Iris writing the prompt, nothing charged, nothing dispatched) asks 「Leave while we're preparing?」 with 「Leave anyway」 / 「Stay」; stage ② (dispatched, charged) shows no dialog, only a toast, and the job finishes in the background, charged once. Whether the chat character update is two-stage is open question **Q-A3** (PM).

## Setup
- Phone: Samsung Galaxy A53 (SM-A5360, adb R5CTB22S05Y), Android 15.
- Build: PowerDirector Mobile for Android **16.8.0 build 2611041** (TR261104-0065), **official build, not debuggable** (`dumpsys package`: versionCode 2611041, flags without DEBUGGABLE; installed APK `~/.casebook/android/apks/…-2611041-original.apk` MD5 `1ff6b186966b8b519cf8851a711cade5` = REQ-090's).
- Daily chat limit reset (user-authorised): `adb shell pm clear com.cyberlink.powerdirector.DRA140225_01` at 12:45 (no reinstall needed). Then 「Get Started」 on the GDPR screen, notifications 「Allow」 (`screenshots/setup_1_notification.png`), the Pro upsell closed with its ← (nothing bought), Mine › 「User Sign in」 › Google button (no password; `mauth-stage.cyberlink.com`) › 「Account Sign In」 「Got it」: signed in as qau2 CLT, **Free** (Mine 「Free」), 28,121 credits (`screenshots/setup_3_mine_signed_in.png`).
- Server: **Stage**: yellow Launcher bar (`screenshots/setup_4_launcher_stage.png`), toolbar content-desc `[AID]Stage_Server`; `/sdcard/cyberlink/PDR/testserver.config` present.
- No fault switches on this build; nothing injected; AI Mini Drama debug info off.
- Drama: new custom drama from the idea 「Two coworkers, Mia and Leo, compete for the same promotion and fall in love.」 › format Generate (English, captions) › outline 「One Desk Two Rivals…」 › 「Ready to create your characters?」 › library looks picked for Mia and Leo in Choose Character (free) › ✓. History title **「Ambition and Trust」** (session 261105_124842_0e46b241). The 「Create storyboard」 card (◆39/38) was offered and **never tapped**; no storyboard, no video.
- Each check used a fresh 「Update characters」 card (1 character, **◆4**): typed request › Send › 「Ready to update your characters?」 › Generate. Keys were sent with adb (`input tap` on Generate / the top-left ←, `input keyevent KEYCODE_BACK`); screenshots by `screencap` right before the key and at ~0.4 s, 2 s, 4.5 s, 8 s, 11 s, 15 s after. Times below are phone times from logcat.
- 「Daily Free Chat Limit Reached」 did not appear (3 setup turns + 5 update requests + 5 Generates).

## Credits
| When | Pill / totalRemain |
| --- | --- |
| After sign-in, before any check | 28,121 |
| Check 1 card (「You'll have 28117 left」), before Generate | 28,121 |
| After check 1's update | 28,117 |
| After check 2's update | 28,113 |
| After check 3's update | 28,109 |
| After check 4's update | 28,105 |
| After check 1 repeat's update (end) | **28,101** |

28,121 − 28,101 = **20 = 5 × ◆4**: each update was charged once, exactly the card price (two receipts per update: image ◆3 then voice ◆1, `MyCreation receipt submitted … consumeTaskId=…`). Setup turns (idea, format, outline, cast) cost nothing.

## Checks

### 1. Stage ①, system Back right after Generate (「Make Mia a woman in her 40s」)
- Seen: Generate 12:55:25.2 (`[DECISION] pre-approved 'character': {IMAGE=1, VOICE=1}`, `[USER] AnswerUpdateCharacter`); KEYCODE_BACK at **12:55:28.07**, 2.8 s later, while the card showed the skeleton with 「Applying character updates to the project.」 and the pill was 28,121 (`…_check1_stage1_sysback_before_key.png`). Nothing had been dispatched: `tool_dispatch: TextToSpeech / TextToImage` came at **12:55:33.5**, 5.4 s after Back.
- Result: **no dialog, no toast**. The app left the chat straight to the 「Hi, I'm your AI Drama Assistant」 page (`…_f1.png` at +0.4 s; f2–f6 up to +15 s show the same page, no dialog or toast). The log has no `Toast show` and no dialog window (`WindowManagerGlobal#addView ty=2`) after the key.
- After leaving: the update ran on in the background: dispatch 12:55:33.5, charged 28,121 → 28,117 by 12:55:36.3, `turn_complete: final_state=complete` 12:56:01.6. Reopened from History (12:56), the drama shows Characters Result and the Create storyboard card; Choose Character has a new 「Mine」 look for Mia (older, selected) (`…_check1_reopened.png`, `…_check1_mia_look.png`). Charged once (◆4).
- Log: `16.8.0.2611041_DRA262610P0334_check1_stage1_sysback_log.txt`.

### 2. Stage ①, top-left ← right after Generate (「Make Leo a man in his 50s」)
- Seen: Generate 12:57:54.8; ← tapped at **12:57:57.09**, 2.3 s later, card 「Thinking…」 with skeleton, pill 28,117 (`…_check2_stage1_arrow_before_key.png`). Dispatch at **12:58:03.3**, 6.2 s after ←.
- Result: **no dialog, no toast**; left to the assistant page (`…_check2_stage1_arrow_f1.png` … `f6.png`).
- After leaving: dispatched 12:58:03.3, charged 28,117 → 28,113 by 12:58:06.8, `turn_complete` 12:58:32.8. Reopened from History: new 「Mine」 look for Leo (older man) selected (`…_check2_reopened.png`, `…_check2_leo_look.png`). Charged once (◆4).
- Log: `16.8.0.2611041_DRA262610P0334_check2_stage1_back_arrow_log.txt`.

### 3. Stage ②, system Back after dispatch (「Make Mia wear a red dress」)
- Seen: Generate 12:59:57.9; dispatch `TextToSpeech` / `TextToImage` at **13:00:15.08**; first receipt 13:00:16.6 (totalRemain 28,110); KEYCODE_BACK at **13:00:18.52** with the card 「Applying character updates to the project.」 and pill 28,110 (`…_check3_stage2_sysback_before_key.png`).
- Result: **no dialog, no toast**; left to the assistant page (`…_check3_stage2_sysback_f1.png` … `f5.png`, pill 28,110 → 28,109). No `Toast show` in the log.
- After leaving: second receipt 13:00:19.9 (28,109), `turn_complete` 13:00:43.5. Reopened from History: Mia's new red-dress 「Mine」 look is there and selected (`…_check3_reopened.png`, `…_check3_mia_look.png`). Charged once (◆4).
- Log: `16.8.0.2611041_DRA262610P0334_check3_stage2_sysback_log.txt`.

### 4. Stage ②, top-left ← after dispatch (「Give Leo a grey beard」)
- Seen: Generate 13:02:33.98; dispatch **13:03:05.5**; both receipts by 13:03:08.15 (28,105); ← at **13:03:08.74**, card 「Applying character updates to the project.」, pill 28,105 (`…_check4_stage2_arrow_before_key.png`).
- Result: **no dialog, no toast**; left to the assistant page (`…_check4_stage2_arrow_f1.png` … `f5.png`).
- After leaving: `turn_complete` 13:03:28.9. Reopened from History: Leo's grey-beard 「Mine」 look is there and selected (`…_check4_reopened.png`, `…_check4_leo_look.png`). Charged once (◆4).
- Log: `16.8.0.2611041_DRA262610P0334_check4_stage2_back_arrow_log.txt`.

### 1 (repeat). Stage ①, system Back (「Give Mia glasses」)
- Seen: Generate 13:04:59.1; KEYCODE_BACK at **13:05:01.45**, 2.3 s later, card 「Thinking…」, pill 28,105 (`…_check1b_stage1_sysback_before_key.png`). Dispatch at **13:05:09.2**, 7.8 s after Back.
- Result: **no dialog, no toast**; left to the assistant page (`…_check1b_stage1_sysback_f1.png` … `f6.png`).
- After leaving: charged 28,105 → 28,101 by 13:05:16.5, `turn_complete` 13:05:43.4. Reopened from History: Mia's glasses look is there and selected (`…_check1b_reopened.png`, `…_check1b_mia_look.png`). Charged once (◆4).
- Log: `16.8.0.2611041_DRA262610P0334_check1b_stage1_sysback_log.txt`.

## Against the two readings
| Stage | Key | Runs | Seen | Original (「Stop and lose your credits?」) | 10/22 two-stage |
| --- | --- | --- | --- | --- | --- |
| ① (before dispatch, uncharged) | system Back | 2/2 | no dialog, no toast; job continues, charged ◆4 | does not match | does not match (no 「Leave while we're preparing?」; job is not paused for a restart, it runs on and charges) |
| ① | ← | 1/1 | same | does not match | does not match |
| ② (dispatched, charging) | system Back | 1/1 | no dialog, **no toast**; finishes in background, charged once | does not match | dialog part matches; **no toast** shown |
| ② | ← | 1/1 | same | does not match | dialog part matches; **no toast** shown |

Behaviour is the same as on 2611021 (11/03 verify: Back at 「Thinking…」 8 s before dispatch, no dialog, no toast, ◆4 charged). Stage ① caption varies: 「Thinking…」 (checks 2, 1 repeat) or 「Applying character updates to the project.」 (check 1); both were before dispatch and before any charge.

No verdict is taken here: whether the character update is two-stage is still Q-A3.

## Evidence (under `screenshots/` unless noted, prefix `16.8.0.2611041_DRA262610P0334_`)
- Check 1: `check1_card_before_generate.png`, `check1_stage1_sysback_after_generate.png`, `…_before_key.png`, `…_f1.png` … `f6.png`, `check1_history.png`, `check1_reopened.png`, `check1_mia_look.png`
- Check 2: `check2_card_before_generate.png`, `check2_stage1_arrow_after_generate.png`, `…_before_key.png`, `…_f1.png` … `f6.png`, `check2_reopened.png`, `check2_leo_look.png`
- Check 3: `check3_card_before_generate.png`, `check3_stage2_sysback_before_key.png`, `…_f1.png` … `f5.png`, `check3_reopened.png`, `check3_mia_look.png`
- Check 4: `check4_card_before_generate.png`, `check4_stage2_arrow_before_key.png`, `…_f1.png` … `f5.png`, `check4_reopened.png`, `check4_leo_look.png`
- Check 1 repeat: `check1b_card_before_generate.png`, `check1b_stage1_sysback_after_generate.png`, `…_before_key.png`, `…_f1.png` … `f6.png`, `check1b_reopened.png`, `check1b_mia_look.png`
- `history_end.png` (History: 「Ambition and Trust」, 9.9 MB); setup: `setup_*.png`
- Run folder: the five `16.8.0.2611041_DRA262610P0334_check*_log.txt` excerpts (full capture in the git-ignored `logs/recheck-*/`)

No ticket was commented on or changed; no QR; `cases.csv` untouched.
