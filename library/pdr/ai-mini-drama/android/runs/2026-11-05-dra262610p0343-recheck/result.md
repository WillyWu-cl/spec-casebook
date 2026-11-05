# DRA262610P0343 recheck — 2026-11-05 (RD: fixed by the 10/27 commits, retest)

Ticket: 「Storyboard stage ②: Back still asks 『Stop and lose your credits?』」 (filed on 16.8.0.2610212).
Cases: TC-513 (stage ②, Back) and TC-061 (stage ①, Back).

- Phone: Samsung Galaxy A53 (SM-A5360, adb R5CTB22S05Y), Android 15, signed in (Pro), Stage server (yellow Launcher bar, `[AID]Stage_Server`).
- Build: PowerDirector Mobile for Android **16.8.0 build 2611041** (TR261104-0065), **re-signed debuggable with the QA key (dex unchanged)**. No timing is taken from this build.
- Fault switches: this Android build has no Pink panel and no AI Mini Drama fault switches (「Fail turn」 / 「Inject failure status」 do not exist; the Launcher ☰ › Menu QA block lists only the download-all rows, the QA consume / subscription / purchase-SKU rows and the region, `screenshots/menu2.png`). Nothing injected; every result below is the real server path. AI Mini Drama debug info was off.
- Dramas (History): drama 1 「Forbidden Office Romance」 (session 261104_180818_88476dee), drama 2 「The New Guy's Secret」 (session 261104_181938_085817e5). Both were at Characters Result; a chat message ("The characters look good. Let's create the storyboard.") brought 「The characters look great! Ready to create the storyboard?」 with the Create storyboard card. No video was generated.

## Credits
| When | Pill |
| --- | --- |
| Before Generate, drama 1 (card ◆41, "You'll have 28205 left") | 28,246 |
| Stage ② of drama 1, just before ← | 28,243 (first image charged at 09:13:44) |
| Before Generate, drama 2 (card ◆39, "You'll have 28192 left") | 28,231 |
| Stage ② of drama 2, just before system Back | 28,228 |
| Back on the assistant page after both finished (09:23) | **28,166** |

28,246 − 28,166 = **80 = 41 + 39**: each storyboard was charged once, exactly its card price, and nothing more (charges arrive per image / voice line as `MyCreation receipt submitted … consumeTaskId=…`). The account is shared; the balance moved by exactly the two card prices, and the in-app Credit Details ledger was not opened.

## Checks

### 1. Stage ②, top-left ← (drama 1) — TC-513
- Seen: 「Creating your scene…」 card shown, pill already 28,243 (charging started) (`16.8.0.2611041_DRA262610P0343_stage2_before_back.png`). ← tapped at 09:13:49: **no dialog**; the app left the chat to the 「Hi, I'm your AI Drama Assistant」 page with the toast 「We'll keep making your storyboard. Find it in History.」 (`…_stage2_back_arrow_f1.png`; f2–f6 the following seconds, no dialog in any). The log has a `Toast show` at 09:13:49.571 and no `Dialog.show` after it; charging continued in the background (img_2 at 09:14:03) and ended `turn_complete` / `[TURN] background blueprint committed for 261104_180818_88476dee` at 09:16:58. History listed it at 09:16 (`…_history_on_return.png`); opened from History it shows the finished six-scene storyboard, 「Storyboard Preview」 0:50 and 「Choose your video settings」 (`…_drama1_reopened_from_history.png`). Charged once (◆41, above).
- Expected: no dialog; only 「We'll keep making your storyboard. Find it in History.」; the app leaves the chat; the storyboard finishes and is charged once.
- Verdict: **FIXED**.
- Log: `16.8.0.2611041_DRA262610P0343_stage2_back_arrow_log.txt`.

### 2. Stage ①, top-left ← right after Generate (drama 1) — TC-061
- Seen: Generate at 09:13:25, ← at 09:13:28 while the skeleton card read 「Generating storyboard.」 and the pill was still 28,246 (nothing charged): dialog **「Leave while we're preparing?」 / 「Your storyboard will start soon. If you leave now, we'll have to prepare it again when you come back.」** with 「Leave anyway」 (red) and 「Stay」 (`…_stage1_back_dialog.png`). No 「Stop and lose your credits?」. Stay closed it and generation went on: 「Creating your scene…」 6 s later (`…_stage1_after_stay.png`), then check 1 on the same drama.
- Expected: 「Leave while we're preparing?」 / 「Your storyboard will start soon. If you leave now, we'll have to prepare it again when you come back.」 with Leave anyway / Stay.
- Verdict: **FIXED** (dialog as specified; Stay keeps the generation). 「Leave anyway」 was not tapped.
- Note: the stage ① skeleton card's caption on this build is 「Generating storyboard.」, not 「Preparing your scenes…」 as in TC-061's precondition (the stage was identified by the dialog and the uncharged pill).
- Log: `16.8.0.2611041_DRA262610P0343_stage1_back_log.txt` (`Dialog.show` at 09:13:28.336, removed at 09:13:36.750 on Stay).

### 3. Stage ②, system Back (drama 2) — TC-513 "Tap Back"
- Seen: Generate at 09:15:41; 「Creating your scene…」 after 13 s, pill 28,228 (charging started) (`…_drama2_stage2_before_sysback.png`). System Back (KEYCODE_BACK) at 09:15:56: **no dialog**; the app left to the assistant page with 「We'll keep making your storyboard. Find it in History.」 (`…_stage2_system_back_f1.png`, f2–f5 after). Log `Toast show` at 09:15:56.353, no `Dialog.show`; generation finished in the background (`turn_complete: final_state=complete` 09:18:28). History listed it at 09:18, 23 MB; opened, the finished six-scene storyboard, 「Storyboard Preview」 1:10, 「Choose your video settings」 (`…_drama2_reopened_from_history.png`). Charged once (◆39).
- Expected: as check 1.
- Verdict: **FIXED**.
- Log: `16.8.0.2611041_DRA262610P0343_stage2_system_back_log.txt`.

## Observation (not part of this ticket)
- O-1: in both dramas, Iris's reply to the chat request said a storyboard already existed before Generate was tapped (drama 1: 「The storyboard for Forbidden Office Romance is ready across all six scenes.」; drama 2: 「I've created the full six-scene storyboard for The New Guy's Secret.」), followed by the Create storyboard card (`screenshots/card1.png`, `…_drama2_stage2_before_sysback.png` top line). This is the TC-176 rule (no message before the card may say a storyboard was created); not filed here.

## Evidence (all under `screenshots/` unless noted, prefix `16.8.0.2611041_DRA262610P0343_`)
- `drama1_card_before_generate.png`, `stage1_after_generate.png`, `stage1_back_dialog.png`, `stage1_after_stay.png`
- `stage2_before_back.png`, `stage2_back_arrow_f1.png` … `f6.png`
- `drama2_card_before_generate.png`, `drama2_stage2_before_sysback.png`, `stage2_system_back_f1.png` … `f5.png`
- `history_during_drama1.png`, `history_on_return.png`, `drama1_reopened_from_history.png`, `drama2_reopened_from_history.png`
- Run folder: `…_stage1_back_log.txt`, `…_stage2_back_arrow_log.txt`, `…_stage2_system_back_log.txt` (logcat excerpts; full capture in the git-ignored `logs/recheck-20261105-092423/`)

No ticket was commented on or changed.
