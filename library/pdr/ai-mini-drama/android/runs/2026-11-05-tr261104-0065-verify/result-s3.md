# TR261104-0065 verify, segment 3 (verify-plan "After segment 1", segment 3), 2026-11-05 15:20–15:40 (phone clock, CST)

- Phone: Samsung Galaxy A53 (SM-A5360, adb R5CTB22S05Y), Android 15, Stage server.
- Build: PowerDirector Mobile for Android 16.8.0 build 2611041 (TR261104-0065), debuggable re-sign of the official APK.
  Nothing uninstalled, cleared or injected (no fault switch). Wi-Fi toggled only for P0415 (adb `svc wifi`).
- Tier: the Pro account from segments 1–2 (still signed in; My Credits shows 「PowerDirector Pro」; no limit dialog, no
  sign-in prompt).
- Session start: `restart R5CTB22S05Y` (15:20:42). Segment 2's logcat capture (started 15:18:13) kept running; pulled
  at the end into `logs/s3-20261105-153929/` (live 15:18:13–15:39:29 + ring buffer).
- 「Stormbound」 not opened or changed (only seen in the History list).
- **Drama 2:** History name **「Salt Broth」** (2026/11/05 03:37 PM, 13 MB; session 261105_152156_d18b1caf). Idea 「A
  retired chef and her estranged son reopen a seaside diner. Two characters.」, English, no captions. Cast Martha Vance
  / Julian Vance (library looks). State at the end: storyboard done with **all six scene images failed** (↻ tiles,
  not retried), four location images present, Storyboard Preview 「Storyboard preview unavailable. Complete the image
  generation above first to view the preview.」 An Update characters card (Julian Vance, ◆4) is left in the chat, not
  generated. No video. Wi-Fi on (17F_QA_Wifi_5G).

## Credits and turns
| When (CST) | Pill |
| --- | --- |
| Start (15:20) | 28,139 |
| Throwaway chat: outline Generate › pill › Leave anyway (15:21) | 28,139 (outline not charged) |
| Salt Broth outline, cast ✓ (failed once), Try again (15:22–15:30) | 28,139 |
| P0332 question + typed name (Update card shown, not generated) | 28,139 |
| P0350 two long-reply requests | 28,139 |
| Create storyboard ◆31 Generate (15:35:26): env_img_1..4 (−3 each, 15:35:44–15:36:10) | 28,127 |
| preview TTS (−1, receipt 15:36:45.2, deducted after Wi-Fi came back) | 28,126 |
| End (15:39) | 28,126 |

Charged 13 this segment, nothing refunded, none due (the failed scene images were never charged, see P0415).
Chat turns: 11 (throwaway idea + its outline Generate, cancelled; Salt Broth idea, outline Generate, cast ✓, Try
again; 「Can you change one…」, 「Julian Vance」; two long-reply requests; Create storyboard Generate).

## DRA262610P0381 credit pill while the outline generates (Leave anyway)
- Steps: new chat › type 「A street magician befriends a stray cat who can predict the weather.」 › Send › English ›
  No captions › Generate (15:21:14) › while 「Thinking…」 tap the credit pill › Leave anyway (15:21:20) › Back › History.
- Seen: 「Leave this chat?」 / 「Your story outline isn’t ready yet, so this chat won’t be saved.」 / 「Leave anyway」 /
  「Stay」. Leave anyway opened **My Credits** (「My Credits」 「Buy More」 28139, 「Complimentary daily credits」 「Claim」,
  「PowerDirector Pro」). Log: `[TOOL] MyCreation cancel session=261105_152049_63f4c098`, `[TURN] cancel_turn`, step
  error 「turn cancelled during the request」 (15:21:19.8). History afterwards (15:21 and again 15:39): Stormbound,
  Shared Brew, Ambition and Trust (+ later Salt Broth); **no entry for the throwaway chat**. Pill 28,139 before and
  after: the outline was not charged.
- Screenshots: `…P0381_s3_00_format_card.png`, `…P0381_s3_01_thinking.png`, `…P0381_s3_02_leave_dialog.png`,
  `…P0381_s3_03_after_leave.png` (My Credits), `…P0381_s3_04_history.png`, `…P0381_s3_05_history_end.png`.
- Log: `16.8.0.2611041_DRA262610P0381_s3_log.txt`.
- Raw finding: **FIXED** (with segment 1's Stay branch): the dialog appears, Leave anyway goes to My Credits and the
  unsaved chat is not in History, as the bug's Expect and today's spec say.

## DRA262610P0332 typed name → Update characters card (retry)
- Steps: Salt Broth, all characters set, no storyboard (「The characters look great! Ready to create the storyboard?」 +
  Create storyboard card) › send 「Can you change one of the characters to look older?」 (15:30:13) › Iris asks › type
  only the name 「Julian Vance」 › Send (15:31:03).
- Seen: Iris (progress 「Updating character appearance.」) asked **「Which character would you like to make look
  older?」** with **one chip 「Martha Vance (the mother)」 and 「More ideas」** (no age asked). Typed answer 「Julian
  Vance」 (the character not offered as a chip). Reply (turn complete 15:31:46): **「Updated the storyboard beats to align
  with Julian Vance's revised appearance.」 / 「Ready to update your characters?」 / card 「Update characters」 「1
  character」 ◆4 「Generate」 「You'll have 28135 left」**. Generate not tapped.
- Screenshots: `…P0332_s3_01_question.png`, `…P0332_s3_02_after_name.png` (control frame for the state before:
  `…s3_cast_retry.png`).
- Log: `16.8.0.2611041_DRA262610P0332_s3_log.txt`.
- Raw finding: **FIXED** on this retry: the typed name led straight to the Update characters card, as today's spec
  expects (segment 1's STILL REPRODUCES came after a question that also asked for an age and offered no chips). Not
  judged: price ◆4 vs spec ◆6 (P0327); Iris's line says the beats were updated before Generate.
- Side (not a P0332 point): the first cast ✓ (15:26:06) ended in 「Something went wrong on my end. Let's try that
  again.」 「Try again」; log `token_request fired outside a turn worker thread; cc session mint must happen on the turn's
  main loop` (storyboard-reviewer / outline-sync / environment-executor, 15:26:41). Try again succeeded (15:30:01).
  Screenshot `…s3_cast_confirmed.png`. Not filed.

## DRA262610P0350 sent message moved to the top / overflowing reply
- Steps: (1) send 「Describe each character's backstory in detail, at least five sentences each」 (15:32:11), adb frames
  every ~1 s; (2) send 「Don't change anything. Just tell me, in detail and scene by scene, what happens in this story,
  with at least four sentences per scene.」 (15:33:43); (3) the Create storyboard Generate (15:35:26), frames every
  ~2.5 s to 15:38:08; then tap ↓.
- Seen:
  - (1) and (2): the sent bubble jumped to the top at once with 「Thinking…」 / skeleton below and empty space under it;
    the view did not move. Iris refused the long text both times (「Character sheets require concise visual
    descriptions rather than multi-sentence backstories, so Martha Vance and Julian Vance remain as established.」 + the
    Update characters card again; 「The six scenes of Salt Broth remain unchanged as requested.」 + the Create
    storyboard card). Replies fit the screen, no ↓ (correct).
  - (3) Generate on the card posts the bubble 「Create storyboard」: it moved to the top (with 「I'll create a
    storyboard — give me a moment...」 and the skeleton). When the result arrived (15:37:5x), 「Here's your storyboard」
    and the Storyboard Result card grew past the screen bottom; **the view stayed put (bubble still at the top) and a
    ↓ button appeared** at the lower right above the input. Tapping ↓ scrolled to the bottom (Scenes 5–6 and the
    Storyboard Preview card).
- Screenshots: `…P0350_s3_00_before_send.png`, `…P0350_s3_01_right_after_send.png`, `…P0350_s3_02_mid_reply.png`,
  `…P0350_s3_03_after_reply.png`, `…P0350_s3_10_before_send2.png`, `…P0350_s3_11_right_after_send2.png`,
  `…P0350_s3_12_after_reply2.png`, `…P0350_s3_21_storyboard_generate_top.png`, `…P0350_s3_22_storyboard_mid.png`,
  `…P0350_s3_23_storyboard_reply_arrow.png` (overflow, view kept, ↓), `…P0350_s3_24_after_arrow.png`.
- Raw finding: **FIXED for what was observed**: sent message to the top on plain sends and on a card Generate; with
  an overflowing reply the view does not follow and ↓ appears and works (PM §13.2). Not reached: a typed send whose
  text reply overflows (Iris kept replies short). Board 5128:8 「11/4 Chat 捲動：四種情境」 / `pm-1002-update-a` still
  unread (spec-check), so the four-scenario verdict stays open.

## DRA262610P0415 storyboard scene images fail
- Steps: Create storyboard card 「Credits will be consumed for this task.」 ◆31 「You'll have 28108 left」, pill 28,139 ›
  Generate (15:35:26) › background watcher on the live logcat turned Wi-Fi off on the preview TTS receipt
  (`…s_preview_tts` submitted 15:36:45.208; **Wi-Fi off 15:36:45.688**) › **Wi-Fi on 15:37:15.808** (30 s) › waited
  for the turn (turn_complete 15:37:49.8) › read the chat › ↓ › Scene 1 › ✕ › Scene 6 › ✕ › pill.
- Order this time (◆31 = 4 location × 3 + TTS 1 + 6 scene × 3): env_img_1 (15:35:44), env_img_2/3/4 (15:36:09–10), all
  done by 15:36:38; scene image steps img_1..6 started 15:36:38.5 (createSession+upload) before the TTS receipt.
- Failures and clock times: **all six scene images (img_1..img_6) failed at 15:36:45.636–.742** with
  `agent_tool_dispatch('TextToImage') failed: generation_failed - Network` (credit host `UnknownHostException` at the
  same moment); **no `receipt submitted` for any s_img** (they failed in upload, before a charge). Engine lines at turn
  end (15:37:49.796): `MiniDramaFail: [engine] target=beat_… | tool=EditImageGPT2 | … generation_failed - Network`
  ×6, and a toast 「MiniDrama FAIL [engine]: target=beat_fb2ea141 | tool=…」. The TTS preview receipt completed after
  Wi-Fi returned (`receipt done` 15:37:49.7).
- Seen:
  - Chat: 「I'll create a storyboard — give me a moment...」 → 「Here's your storyboard」 + Storyboard Result card. No Iris
    text about failed images or refunds; no 「!」.
  - Storyboard Result: **all six scenes show a grey tile with ↻** (regenerate icon) instead of an image; titles and
    summaries present.
  - Storyboard Preview: 「Storyboard preview unavailable. Complete the image generation above first to view the
    preview.」 (title 「Salt Broth」 0:42, 「See your story as pictures with a voice telling it. The real video comes
    next.」).
  - Scene 1 view (15:38:54) and Scene 6 view: location image present; scene slot 「Scene」 icon; **「Couldn't create
    image ⓘ」 / 「Your credits have been refunded. The service is busy — try again later.」 / 「✦ Edit」**. ✕ back each time.
  - Pill **28,126** at 15:37:50, 15:38:52 and 15:39:10 (= 28,139 − 12 − 1). The 18 credits of the six scene images on
    the card were never deducted, so nothing is owed back; no refund line in the log.
- Screenshots: `…P0415_s3_00_before_generate.png`, `…P0415_s3_01_wifi_off.png` (15:36:58, offline),
  `…P0415_s3_02_fail_toast.png` (15:37:51, FAIL toast), `…P0415_s3_03_end.png` (six ↻ tiles), `…P0415_s3_04_bottom.png`
  (preview unavailable), `…P0415_s3_05_scene1_view.png`, `…P0415_s3_06_scene6_view.png`, `…P0415_s3_07_after_close.png`.
- Log: `16.8.0.2611041_DRA262610P0415_s3_log.txt`.
- Raw finding: **NOT REPRODUCED in the bug's form (inconclusive for the refund)**: the scene images failed before they
  were charged, so there was no deduction to refund; the pill matches what was actually charged (13 for 4 location
  images + TTS) and the copy 「Your credits have been refunded」 is accurate in effect. The failure UI matches today's
  expected copy in the scene view (「Couldn't create image / Your credits have been refunded. The service is busy - try
  again later.」), but the chat has no failure message and the card shows ↻ not 「!」 (same as P0388; `pm-update-5`
  / 5212:27212 still unread). A charged-then-failed scene image (the bug's case) still needs a drop after the s_img
  receipts are submitted (this time they would not have been submitted until upload finished, ~7 s after start).
- Refund check (segment 4): nothing pending from this segment. Failure times for reference: scene images 15:36:45.6–.7
  (never charged).

## Not done / for later segments
- Salt Broth: six scene images left failed (Edit / ↻ not tapped); the Update characters card (Julian Vance ◆4) not
  generated.
- P0350: overflowing reply to a typed send not reached; board 5128:8 still to be read.
- P0415: the charged-then-failed case not hit; P0388's refund check (≥ 15:39) unchanged.
