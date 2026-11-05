# TR261104-0065 verify, segment 1 (verify-plan steps 1–5), 2026-11-05 14:25–15:02 (phone clock, CST)

- Phone: Samsung Galaxy A53 (SM-A5360, adb R5CTB22S05Y), Android 15, Stage server (`[AID]Stage_Server` on the Launcher).
- Build: PowerDirector Mobile for Android 16.8.0 build 2611041 (TR261104-0065), the debuggable re-sign of the official
  APK (REQ-089). Nothing uninstalled, cleared or injected; Wi-Fi toggled only for P0415.
- Account: the Pro account the user signed in before this segment (logcat `updateSubscribingStatus: true` 10×,
  `false` 24×; no daily-limit dialog during the segment).
- Drama: one new English drama, no captions. Idea 「A lonely lighthouse keeper and a stranded mail pilot. Two
  characters.」 Chat / History name **「Stormbound」** (History 2026/11/05 02:55 PM, 31 MB; session
  261105_142543_4f043971). Cast Elias Rowe / Cole Brennan (library looks, then both updated in chat).
- State at the end: finished storyboard (Storyboard Result, 6 scenes, all images present). Storyboard Preview failed
  (TTS, see P0415) and shows Retry ◆1, not tapped. Video settings not opened.
- Logs: `logs/s1-20261105-150119/` (live logcat + ring buffer); excerpts `16.8.0.2611041_DRA262610P0381_log.txt`,
  `16.8.0.2611041_DRA262610P0328_P0332_log.txt`, `16.8.0.2611041_DRA262610P0415_log.txt`.
- Expected results are from `spec-check.md` (today's spec).

## Credits and turns
| When | Pill |
| --- | --- |
| Start (assistant page, 14:25) | 28,197 |
| Outline + cast confirm (free) | 28,197 |
| Update characters Elias Rowe, ◆4 (14:36) | 28,193 |
| Update characters Cole Brennan, ◆4 (14:43) | 28,189 |
| Create storyboard ◆37, all receipts (14:54:40) | 28,152 |
| After the preview TTS failure refund (+1, 14:54:42) | 28,153 |
| End (15:02) | 28,153 |

Charged 44, refunded 1. Chat turns: about 10 (idea/format, outline Generate, cast ✓, 「Make Elias Rowe…」, its
Generate, 「Can you change one…」, 「Cole Brennan」, 「Make Cole Brennan look older, around 60」, its Generate,
Create storyboard Generate).

## DRA262610P0324 Surprise me repeats
- Steps: AI Mini Drama › Try It Now › Create Your Drama; tap Surprise me 5 times without clearing, reading the box
  after each tap.
- Seen (box after each tap; each appends a new string):
  1. 「He crashes the wrong wedding and somehow gets mistaken for the groom.」
  2. + 「Two strangers accidentally swap phones and begin ruining each other’s lives.」
  3. + 「Two coworkers secretly compete to become their boss’s favorite employee.」
  4. + 「A strict teacher wakes up trapped inside the body of their worst student.」
  5. + 「She lies about having a boyfriend, then hires her annoying neighbor.」
  None equals the two chips (「He pretends to be rich for a date, then meets her billionaire parents.」, 「A fake
  psychic keeps making random predictions that somehow all come true.」).
- Screenshots: `…P0324_00_before.png`, `…P0324_tap1.png` … `tap5.png`.
- Finding: **FIXED** (five different random picks, appended; matches the bug's Expect and today's spec, R-287 too).

## DRA262610P0381 credit pill while the outline generates
- Steps: type the idea › Send › English › No captions › Generate (14:26:31) › while 「Thinking…」 tap the credit pill
  (14:26:33) › Stay › tap New chat (control) › Stay › wait for the outline.
- Seen: the credit pill showed **「Leave this chat?」 / 「Your story outline isn’t ready yet, so this chat won’t be
  saved.」 / 「Leave anyway」 / 「Stay」**; My Credits did not open. Stay kept the chat (「Creating your mini drama with
  the lighthouse keeper and stranded pilot.」), and the outline arrived (turn complete 14:27:04; Story Outline card
  and 「Ready to create your characters?」). New chat showed the same dialog (control). History lists the drama
  (「Stormbound」) as expected after the outline. Leave anyway was not tapped (per the coordinator: checked later on a
  throwaway chat).
- Screenshots: `…P0381_01_thinking.png`, `…P0381_02_after_pill.png`, `…P0381_03_after_stay.png`,
  `…P0381_04_newchat_control.png`.
- Finding: **FIXED for the Stay branch** (dialog shown, like New chat). Leave anyway › My Credits › History not run here.

## DRA262610P0326 Gender 「Other」 twice
- Steps: 「Ready to create your characters?」 › Elias Rowe slot › Choose Character › filter icon › swipe the Gender
  row left.
- Seen: Gender lists **「Female」「Male」「Other」**, once each (the row is 912 px wide inside a 1013 px scroll view, no
  hidden fourth option; page source after the swipe has the same three). Ethnicity: East Asian, African, Hispanic,
  Arab…; Age 1–100.
- Screenshots: `…P0326_00_choose_character.png`, `…P0326_01_filter.png`, `…P0326_02_gender_swiped.png`.
- Finding: **FIXED** (no duplicate). 「Other」 vs spec 「Others」 is DRA262610-0020, not judged here.

## DRA262610P0328 Update characters card count
- Steps: library looks for both slots › ✓ (storyboard offer shown) › type 「Make Elias Rowe a woman in her 40s」 › Send
  › wait (card at 14:36:06) › Generate.
- Seen: 「I've updated Elias Rowe to a woman in her 40s across all scenes.」 / 「Ready to update your characters?」 and
  the card **「Update characters」 「1 character」 ◆4 「Generate」 「You'll have 28193 left」**. Generate charged 4.
  Note (not judged): price ◆4, today's spec ◆6 (DRA262610P0327); Iris's 「I've updated…」 line is posted before
  Generate.
- Screenshots: `…P0328_01_card.png`, `…P0328_02_after_generate.png`, `…P0328_03_updated.png`.
- Finding: **FIXED** (count shown).

## DRA262610P0332 typed name → Update characters card
- Steps: from the storyboard offer, send 「Can you change one of the characters to look older?」 › Iris asks
  **「Which character would you like to make look older, Elias Rowe or Cole Brennan, and around what age should they
  be?」** (no chips) › type 「Cole Brennan」 › Send (14:41:52).
- Seen: no Update characters card. Iris answered with **「What would you like to update for Cole Brennan?」**, one
  suggestion 「Adjust wardrobe to practical flight gear」 and 「More ideas」 (the 「look older」 request was dropped).
  Only after a further message 「Make Cole Brennan look older, around 60」 did the card come (「Update characters」
  「1 character」 ◆4, 14:43:21); generated to reach the storyboard.
- Screenshots: `…P0332_01_question.png`, `…P0332_02_after_name.png`, `…P0332_03_after_age.png`.
- Finding: **STILL REPRODUCES** (changed form: the typed name is taken as the character, but no Update characters
  card; Iris asks what to change instead of 「Retained…」). Expect (spec-check): typed answer treated like a chip →
  Update characters card. Caveat: Iris's question also asked for an age, and offered no chips to compare with.

## DRA262610P0354 「You'll have N left」 (storyboard part)
- Steps: read the Create storyboard card at the offer (14:33, and again 14:50 after both updates).
- Seen: 「Create storyboard」 / 「Credits will be consumed for this task.」 / ◆37 / Generate / **「You'll have 28160
  left」** (28,197 − 37), later **「You'll have 28152 left」** (28,189 − 37). The Update characters cards show it too.
- Screenshots: `…P0354_01_storyboard_card_first.png`, `…P0354_02_storyboard_card.png`.
- Finding: **FIXED for the storyboard card**; the video settings card is for a later segment.

## DRA262610P0415 storyboard image refunds
- Steps: pill 28,189 › Create storyboard Generate (14:50:53) › first per-image charge at 14:51:08–10 (pill 28,186) ›
  Wi-Fi off **14:51:16** › on **14:51:41** › wait until the storyboard finished (14:55:05).
- Seen: **no image failed.** The log shows the job charges in two image groups: six location images `s_env_img_1..6`
  (3 each, one about every 30 s, 14:51:08–14:53:48), then the TTS preview (1, 14:54:24), then the six scene images
  `s_img_1..6` (3 each, all within 14:54:37–14:54:40). The Wi-Fi drop fell during `env_img_1`/`env_img_2`: the app
  logged `UnknownHostException` / `GW Network error`, but `env_img_1` finished at 14:51:50 and every later image
  succeeded. All six Storyboard Result scenes have images. The only failure is the **Storyboard Preview**: 「Storyboard
  preview unavailable. Some credits were refunded. Try again to generate the preview.」 with Retry ◆1, caused by
  `TextToSpeech failed: Others: result:Error 4000 External Error` at **14:54:42** (3 min after Wi-Fi was back, so not
  the offline drop); the pill rose 28,152 → 28,153 at once (the 1-credit preview refunded).
- Price note: each image was charged 3 (today's spec: 6, R-050/REQ-059); total 37 = 12 × 3 + 1.
- Screenshots: `…P0415_00_before_generate.png`, `…P0415_01_wifi_off.png`, `…P0415_02_offline_30s.png`,
  `…P0415_04_up1.png` (all six scene images), `…P0415_03_end.png` / `…P0415_05_preview_failed.png`.
- Finding: **NOT RUN (inconclusive)**: the 30-s drop hit the location-image phase and the images recovered; no
  scene image failed, so the scene-image refund could not be checked. To hit the scene images the drop must come after
  the sixth location receipt (here ≈ 14:54:25–14:54:40, when the TTS receipt appears). Side data: the TTS preview
  failure was refunded at once (+1).
- Failure time for the later refund check: **14:54:42** (preview TTS, ◆1, already back). No scene-image failure to
  time.
