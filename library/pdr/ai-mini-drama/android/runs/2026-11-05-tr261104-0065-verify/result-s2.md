# TR261104-0065 verify, segment 2 (verify-plan steps 6–7), 2026-11-05 15:04–15:18 (phone clock, CST)

- Phone: Samsung Galaxy A53 (SM-A5360, adb R5CTB22S05Y), Android 15, Stage server.
- Build: PowerDirector Mobile for Android 16.8.0 build 2611041 (TR261104-0065), debuggable re-sign of the official APK.
  Nothing uninstalled, cleared or injected (no fault switch). Wi-Fi toggled only for P0388 (adb `svc wifi`).
- Account: the Pro account from segment 1 (still signed in; no limit dialog, no sign-in prompt).
- Drama: 「Stormbound」 (session 261105_142543_4f043971), opened as left by segment 1 (already in the chat).
- Session start: `restart R5CTB22S05Y`; segment 1's logcat capture stopped and a fresh one started 15:04:18. Logs:
  `logs/s2-20261105-151812/` (live logcat 15:04:18–15:18:12 + ring buffer); excerpt
  `16.8.0.2611041_DRA262610P0388_log.txt`.
- State at the end: Storyboard Result with Scene 2 updated (heavy rain) and **Scene 4 failed** (↻ thumbnail, scene
  view 「Couldn't create image」 + Edit; not retried); Storyboard Preview now generated (0:41, after Retry ◆1); the
  video settings card 「Choose your video settings」 open, left on Standard / Preview - 30 sec (◆120). No video
  generated. Wi-Fi on (17F_QA_Wifi_5G).

## Credits and turns
| When (CST) | Pill |
| --- | --- |
| Start (15:04) | 28,153 |
| After the send (free) | 28,153 |
| Update Generate ◆13: env_img_1 / env_img_2 (−3 each, 15:07:41) | 28,147 |
| preview TTS (−1, 15:08:11) | 28,146 |
| s_img_1 + s_img_2 (−6, seen 15:09:51 after Wi-Fi came back) | 28,140 |
| After the update, after Scene 2 / Scene 4 ✕ (15:11:07) | 28,140 |
| Storyboard Preview Retry ◆1 (15:11:36, succeeded 15:12:11) | 28,139 |
| End (15:18) | 28,139 |

Charged 14 (13 update + 1 preview retry), nothing refunded in this segment. Chat turns: 3 (「Make Scene 2 and Scene 4
heavy rain」, its Generate, 「Create video」). The Preview Retry is not a chat turn.

## DRA262610P0350 sent message not moved to the top
- Steps: in 「Stormbound」 at the bottom of the chat (Storyboard Preview card, keyboard down) › tap the input › type
  「Make Scene 2 and Scene 4 heavy rain」 › Send (15:04:40) › adb screencaps every ~0.5 s for 12 s, then every ~2.5 s
  to 15:06:36.
- Seen:
  - First frame after Send (≈0.5 s): the sent bubble 「Make Scene 2 and Scene 4 heavy rain」 is at the **top of the
    chat view** (just under the top bar, y ≈ 220–360 px of 2400), with 「Thinking…」 and a skeleton card below it and
    empty space under that. The earlier storyboard is scrolled out of view above.
  - Mid-reply (from ≈4 s): 「Adding heavy rain to Scene 2 and Scene 4.」 replaces 「Thinking…」 over the skeleton;
    the bubble stays in the same place.
  - Reply done (turn_complete 15:05:27): 「I added heavy rain to Scene 2 and Scene 4.」 / 「Script updated! Regenerate
    the storyboard to match?」 / card 「Create storyboard」 「Credits will be consumed for this task.」 ◆13 「Generate」
    「You'll have 28140 left」. The bubble is still at the top (y 221–364); the reply and card end at y 944, well
    above the input (2062). The view did not move at any point after the jump to the top.
  - The reply did not overflow the screen, so **the ↓ button and "view follows / does not follow an overflowing reply"
    could not be observed** with this send. No ↓ was shown (correct for a reply that fits).
- Screenshots: `…P0350_00_before_send.png`, `…P0350_01_right_after_send.png`, `…P0350_02_mid_reply.png`,
  `…P0350_03_after_reply.png`.
- Raw finding: **The bug's Result no longer reproduces for this case** (sent message moves to the top; the bubble
  does not stay mid-screen). The bug's Expect and §13.2 (10/20) are met for the part observed. Not judged: the
  overflow part (↓, not following) because the reply fit; and board 5128:8 「11/4 Chat 捲動：四種情境」 /
  `pm-1002-update-a` are still unread, so this is a description, not a verdict. Side observation: the second send
  「Create video」 (15:17:16) was followed by the video settings card in the same way (not screenshotted for scroll).

## DRA262610P0388 failed scene images in a chat update
- Steps: Generate on the update card (15:07:28) › a background watcher on the live logcat turned Wi-Fi off with
  `svc wifi disable` on the first scene-image receipt (`…_s_img_1` submitted 15:08:14.503; Wi-Fi off **15:08:14.99**)
  › Wi-Fi on **15:09:15.14** (60 s) › waited until the update finished (turn_complete 15:09:50) › read the chat › Scene
  2 › ✕ › Scene 4 › ✕ › read the pill.
- Order seen in the log (update job, charged ◆13 in total): env_img_1, env_img_2 (−3 each, 15:07:41) → preview TTS
  (−1, 15:08:11) → s_img_1 (submitted 15:08:14.50) → s_img_2 failed 15:08:14.91.
- Failures and clock times:
  - **s_img_2 (Scene 4 scene image): failed 15:08:14.913** — `MiniDramaFail: [TextToImage] generation_failed: Others
    … ConnectException: Failed to connect to demo.myedit.online`, `receipt failed …s_img_2` (15:08:14.933); at
    turn end `[engine] target=beat_32b630b9 | tool=EditImageGPT2 | … failed: generation_failed - Others`.
  - **Preview TTS: failed** — `receipt failed …s_preview_tts` **15:09:15.715**, `[engine] target=storyboard |
    tool=VoiceReference | TextToSpeech failed … UnknownHostException` 15:09:50.448.
  - s_img_1 (Scene 2) succeeded (`receipt done` 15:09:50.376); both location images succeeded (15:08:01 / 15:08:06).
- Seen:
  - Chat after the update: the progress line 「Updating storyboard images to reflect the heavy rain in scenes 2 and
    4.」 was replaced by **「Here's your storyboard」** and the Storyboard Result card (「View more」). No other Iris
    text: no 「1 image couldn't be updated…」, no 「!」, no Edit in the chat.
  - Storyboard Result card: Scene 2 has a new image (wet floor, rain). **Scene 4 has no image: its thumbnail is a
    grey tile with a ↻ (regenerate) icon** (`image_mini_drama_storyboard_scene_regenerate`), not 「!」. Its summary
    text was updated (「…streaming with heavy rain outside…」).
  - Scene 2 view: two images (location, scene), rain text, no error. ✕ back.
  - Scene 4 view: location image present; the scene slot shows an image icon and 「Scene」, and under it **「Couldn't
    create image ⓘ」 / 「Your credits have been refunded. The service is busy — try again later.」 with 「✦ Edit」**.
    ✕ back.
  - Storyboard Preview under the card still read 「Storyboard preview unavailable. Some credits were refunded. Try
    again to generate the preview.」 with Retry ◆1.
  - Pill: **28,140** after ✕ (15:11:07) = 28,153 − 13. The failed Scene 4 image (−3, deducted with s_img_1 when the
    balance was read again at 15:09:51) and the failed TTS (−1) were **not** returned by 15:18; no refund line in the
    log. (In segment 1 a TTS failure was refunded at once, +1.)
- Screenshots: `…P0388_00_update_card.png`, `…P0388_01_wifi_off.png`, `…P0388_02_offline_30s.png`,
  `…P0388_05_reply.png` (「Here's your storyboard」, Scene 4 ↻), `…P0388_04_end_up.png`, `…P0388_03_end_bottom.png`,
  `…P0388_06_scene2_detail.png`, `…P0388_07_scene4_detail.png` (failure + Edit), `…P0388_08_balance_after_close.png`.
- Log: `16.8.0.2611041_DRA262610P0388_log.txt`.
- Raw finding: **PARTLY FIXED / STILL REPRODUCES in part (refund pending).** Changed since filing: the update no
  longer claims success silently; the failed scene shows a failure state with Edit inside the scene view, and the
  copy says the credits were refunded. Still against the bug's Expect / `pm-update-3` J5: no 「!」 on the failed scene
  (a ↻ tile instead), no 「1 image couldn't be updated. Your credits have been refunded. Tap Edit to try again, or tell
  me what to change.」 in the chat (Iris says only 「Here's your storyboard」), and the pill did not get the 3 credits
  back although the scene view says 「Your credits have been refunded」. The refund (Credit Details 「Generation failed,
  credits returned +3」, and +1 for the TTS) is for the ≥ 30-min check in segment 4. Before a Fail verdict on the
  「!」 copy, `pm-update-5` (Offline_mid generation → Try again) and 5212:27212 still have to be read (spec-check).
- Refund check (segment 4, not before **15:39**): Scene 4 image ◆3 failed 15:08:14; preview TTS ◆1 failed 15:09:15.
  Expected after the check: pill 28,139 + 4 = 28,143 if both come back (minus anything spent later).

## DRA262610P0354 「You'll have N left」 (video settings card)
- Steps: after the update the Storyboard Preview card had no 「Create video」 and no video settings card followed. Retry
  ◆1 on the preview (15:11:36) → preview generated (0:41, 15:12:11) but still no 「Create video」 or settings card. Sent
  「Create video」 (15:17:16) → Iris 「Pick a video model and length on the card to start generating.」 and the card
  (15:17:25). Read under Generate video.
- Seen: 「Choose your video settings」 / Best · Standard (selected) · Fast / 「Seedance 2.0 · Balanced quality for
  everyday stories」 / 「Video length」 Preview - 30 sec (selected) · Full Video - 90 sec / ◆120 / 「Generate video」 /
  **「You'll have 28019 left」** (28,139 − 120). The line follows every selection (e.g. Full Best ◆544 → 「You'll have
  27595 left」).
- Screenshots: `…P0354_01_video_card.png` (and every `…P0416_*` frame).
- Raw finding: **FIXED** (video card; the storyboard card was FIXED in segment 1). Side note, not judged: the
  successful Storyboard Preview card had no 「Create video」 control (TC-079 / Q-A16) and the settings card did not
  follow by itself; it took a typed 「Create video」.

## DRA262610P0416 video prices
- Steps: on the video settings card, Preview - 30 sec › Best › Standard › Fast; Full Video - 90 sec › Best › Standard ›
  Fast; read the price, model line and 「You'll have N left」 each time; back to Preview / Standard. Generate not tapped.
- Seen (balance 28,139):

  | Length | Best | Standard | Fast |
  | --- | --- | --- | --- |
  | Preview - 30 sec | ◆180 (left 27959) | ◆120 (left 28019) | ◆60 (left 28079) |
  | Full Video - 90 sec | ◆544 (left 27595) | ◆364 (left 27775) | ◆184 (left 27955) |
  | Today's spec (Preview / Full) | ◆180 / ◆540 | ◆390 / ◆1170 | ◆120 / ◆360 |

  Model lines: Best 「Seedance 2.5 · Sharper motion and richer detail」; Standard 「Seedance 2.0 · Balanced quality for
  everyday stories」; Fast 「Seedance 2.0 Mini · Quicker results, fewer credits」.
- Screenshots: `…P0416_Preview_Best.png`, `…P0416_Preview_Standard.png`, `…P0416_Preview_Fast.png`,
  `…P0416_Full_Best.png`, `…P0416_Full_Standard.png`, `…P0416_Full_Fast.png`.
- Raw finding: **STILL REPRODUCES** (Standard and Fast). Standard is 4/s (◆120 / ◆364) against 13/s (◆390 / ◆1170);
  Fast 2/s (◆60 / ◆184) against 4/s (◆120 / ◆360). Best now quotes 6/s (◆180; ◆544 for Full), matching the PM 10/16
  Best rate (open Q-A19) — changed since the bug (which saw Best ◆120). Full Video quotes are 4 credits above 3× the
  preview (544 / 364 / 184, not 540 / 360 / 180): recorded, not judged. No video generated (quotes do not match today's
  spec), so the charge was not checked.

## Not done / for later segments
- P0388 / storyboard-TTS refund check: ≥ 15:39 (segment 4), Credit Details.
- Scene 4 left failed (Edit / ↻ not tapped) so the refund check sees an untouched failure.
- P0350 overflow case (a reply longer than the screen) and the four 11/4 scenarios: need board 5128:8 read first.
