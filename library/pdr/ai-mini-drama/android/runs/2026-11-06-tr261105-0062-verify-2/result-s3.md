# TR261105-0062 round 2 verify, segment 3, 2026-11-06 (from 14:27)

Account: cltqauiap2@gmail.com (Pro). Mine at 14:29: card 「Pro」, 「You're on the highest plan…」, **28081 credits**.
Same e-mail as segments 1–2; 27,981 + the 100 monthly credits of the welcome page. Needed: storyboard ~36 + Fast Preview 30 s ~60 = ~96, covered.

## Video 1: Fast · Preview 30 s (14:37, 60 credits, 28,039 → 27,979)
- **P0363 FIXED.** ← in stage ② at 14:39:38 (「Find your video here in History.」), History row 「Processing...」; opened the
  drama at 14:40:11, 14:40:23, 14:40:39 and 14:41:33 (all within 2 minutes): each time at its video stage (storyboard
  card, 「Preview is unavailable while your videos are being generated.」, the 「Here's your drama.」 card), never the empty
  「Hi, I'm your AI Drama Assistant」 page. Another row (After Closing) opened its own chat in between. `s3_19`–`s3_27`.
- **P0358 OK on a preview job.** History ⋮ Rename → 「Rose Test Renamed」 at 14:41:04 while processing, ←, waited on the
  landing page. Push at 14:43:57: 「Your drama is ready」 / 「"Rose Test Renamed" is done. Tap to watch it.」 (the FCM payload
  still carries the old name 「Love, Unscripted」, the app shows the new one). Toast: 「Good news! Your "Rose Test Renamed"
  is ready. Tap here to view your results.」 `16.8.0.2611052_DRA262610P0358_01_preview_toast_new_name.png`, `_push.txt`.
- **P0348 O-20 OK.** Reopen from History (14:46) and after terminate + relaunch (14:47): the video card (Play drama, Save
  to gallery) and the 「Create the rest of the video (60 sec)」 offer are back. `_P0348_11`, `_P0348_12`.
- Observation: the storyboard preview card inside the chat keeps the old title 「Love, Unscripted」 after the rename.

## Video 2: Create the rest of the video (60 sec), 120 credits, Generate at 14:48
- Done at about 14:56 (120 credits, 27,979 → 27,859). The 「Good news! Your "Rose Test Renamed" is ready」 toast showed
  while this chat was open and the card under it was still a placeholder; the video card came about 15 s later
  (`screenshots/s3_37_toast_card_still_loading.png`, `s3_38`). Observation.

## Scene-3 update (video 3)
- Chat 「Change scene 3 only: …」 (15:00) → 「Updated Scene 3 …」 + 「Script updated! Regenerate the storyboard to match?」,
  storyboard Generate 6 credits (27,859 → 27,853), scene 3 redrawn only.
- Offer card for the update reads 「Looking good! Ready for the full video? / Create the rest of the video (15 sec)」, 30
  credits (observation: update worded as "the rest of the video"). Generate at 15:12:45; 「Generating the updated video
  for scene 3.」; no stage ② placeholder seen (polled every ~10 s); push at 15:18:51, chat done by 15:21.
  Balance still 27,853 after it (30 not charged as of 15:22; recheck on Mine).
- **P0358 filed path not reached**: the update went from stage ① to done with no stage ② to rename in. Renaming in stage ①
  means leaving through 「Leave while we're preparing?」. A repeat needs a 4th video (30 credits): asked the user.
