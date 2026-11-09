# TR261105-0062 round 2 verify, segment 2 (plan steps 6–8), 2026-11-06 14:12–14:21

Phone: Samsung SM-A5360 (R5CTB22S05Y), Android 15. Build: official 16.8.0.2611052 (`build` confirmed). Stage bar and account
not re-read (as briefed). No fault injection on this build. Drama: **After Closing** (template, session
261106_141313_0fdc5b84).

**The segment stopped at step C, by the brief's stop rule.** The storyboard did not finish, so there is no 「Choose your
video settings」 card and no video was generated. P0363, P0358 and P0348 O-20 were not reached.

## What happened

| Time | Step | Seen |
| --- | --- | --- |
| 14:13:12 | Template After Closing, Make my version | chat opens with the cover and the format question, pill 27,984 |
| 14:13:23 | Format card Generate (English, captions) | 「I'll create a drama based on this template…」, then Story Outline & Characters Result with four pre-assigned characters; no character step |
| 14:14:50 | Create storyboard card | ◆35, 「You'll have 27949 left」, pill 27,984 |
| 14:15:13 | Generate | stage ① |
| 14:15:34 | 「Creating your scene…」 on screen | pill still 27,984; charged 3 at 14:15:35 (log), pill 27,981 on screen 14:15:41 |
| 14:15:48 | Recents opened (real Recents, `KEYCODE_APP_SWITCH`) | app leaves the foreground; system log `Changes in 11632 2 to 15` at 14:15:48.750 |
| 14:15:51 | First swipe up | **missed**: removed the Chrome card, not PowerDirector (see *Run note*) |
| 14:15:53.8 | | system log: DNS for the app `4(FAIL), isBlocked=true`; app log: `tti=download_failed`, `UnknownHostException` for the credit host, then every remaining image and voice fails, `turn_complete` 14:15:54.1 |
| 14:16:17 | Real swipe-away of PowerDirector in Recents | `Killing … remove task`, process gone |
| 14:17:22 | Relaunched after 65 s, Launcher, AI Mini Drama, History | row After Closing 02:15 PM, 1.6 MB, pill 27,981 |
| 14:17:52 | Opened the drama | `restored session … (chars=4, shots=6)`, no resume line, no new job |

## Step B / R-321: the storyboard did not finish

- All six scenes show only ⟳ (R-058), Storyboard Preview shows the red 「Storyboard preview unavailable. Complete the image
  generation above first to view the preview.」 (R-066). The ⟳ offer reads 「Couldn't create image」 / 「Something went wrong.
  Give it another try.」.
- No resume in 3.5 minutes after reopening (log and screen, last read 14:21:17). Against TC-514 / R-321 ("stage ② keeps
  running after the app is swiped away") this is a fail.
- The job ended **5 s after the app left the foreground and 24 s before the swipe-away**, because Android blocked the app's
  network (`isBlocked=true`). So the swipe did not kill it; being in the background did. That the block comes from the app
  not holding a foreground service is my inference. In segment 1 the same stage ② job ran to its end with the app in front.
- Charge: **3 credits** (one image, 14:15:34), for an image whose download failed (`MyCreation receipt failed`). No refund
  in the ledger read at 14:17:26, none on the pill at 14:21:17 (KP-007 expects one). Refunds may lag; recheck in Credit Details.
- R-319: not relevant, stage ① was not interrupted.

## Step C: 「Choose your video settings」 did not appear

Expected here: the storyboard never finished. This does **not** explain segment 1's O-1: that drama's images all finished and
one voice failed on the server; here the voices failed locally (`credit_check_failed`, because the credit host was blocked)
with the images. Nothing new about O-1.

## DRA262610P0348: HOLD (O-20 not reached; O-10 needs a ruling)

- Expected: a reopened chat shows every earlier message and card, nothing removed without notice. `spec-check.md`: a loss
  WITH the notice is not this bug.
- O-10 path, after the swipe-away, top to bottom (top confirmed by 12 drags with no further movement):
  1. Story Outline & Characters Result; 2. Characters Result; 3. 「Here's your storyboard」; 4. Storyboard Result, six ⟳ scenes,
  preview error.
- **Gone** (all there before the swipe, `s2_03`, `s2_04`, `s2_06`, `s2_08`): template cover bubble; 「What format would you like
  for your video?」; the format answers bubble; 「I'll create a drama based on this template…」; 「The storyboard for After
  Closing is ready across six scenes.」; 「The characters look great!…」; 「Create storyboard」 bubble; 「I'll create a
  storyboard…」.
- So the brief's O-10 question is **no**: the template bubble and earlier replies are not there. It is the filed O-20 picture
  ("the thread restarts at Story Outline & Characters Result", template opening gone), without any video card to lose.
- Against the notice: what stayed is exactly outline, images (slots) and storyboard, and History's footer shows 「To keep the file
  lightweight, we kept only the generated story outline, images and videos.」 (`_10`). No notice in the chat itself. By
  `spec-check.md` that is not the bug; by the filed Expect Result it is the original symptom. **The user should rule on this.** Segment
  1's ← reopens lost nothing, so the notice's rule is not applied every time.
- Not separated: this was a template drama and a process kill after a failed job; segment 1 was a typed idea with ←. Either
  difference could be the cause. The ← path on a template drama is unchecked.
- Characters-stage reply: the filed O-10 loss was 「the characters-stage reply」; here it is gone too (「The characters look great!…」).
- Evidence: `16.8.0.2611052_DRA262610P0348_06_template_chat_before.png`, `_07_stage2_before_recents.png`,
  `_08_reopen_top_after_swipe.png`, `_09_failed_scenes_after_swipe.png`, `_10_history_notice_after_swipe.png`, `_log2.txt`;
  pages in `screenshots/s2_17_walk_p*.txt`.
- Side effects: not written, not judged fixed.

## DRA262610P0363: HOLD. Not reached: no video job, and none can start on either drama.

## DRA262610P0358: HOLD. Not reached: no video job. The old name was not tested, and showed nowhere.

## DRA262610P0343: stays FIXED from segment 1; not repeated here

I left stage ② by Recents, not ←, so this drama adds nothing. Its contrast and Design comparison remain undone from segment 1.

## Credits and chats

- Credits: 27,984 → 27,981, **3 used**, no video generated.
- Chats: **2 sends by segment 1's count** (format Generate, storyboard Generate). But R-142 says opening a template also uses
  one, so **3 by the spec**. Nothing else sent; the limit dialog did not appear. Worst case 9 of 10 are used, with 1 left.
- That last one matters: R-142 counts every task button, so a video Generate and segment 3's chat update would be two sends,
  and each ⟳ Regenerate may be one too.

## Other observations

- **O-5 A stage ② storyboard dies seconds after the app leaves the foreground** (see Step B). R-321, TC-514. Home was not
  tried, but Recents alone did it. Fails silently: no toast or push, the chat shows ⟳ only. Android 15 phone; the filed
  behaviour on the Sony (Android 12) was a job that stopped and resumed on reopen. This is new, and may decide how P0363 and
  P0358 behave on this phone: any video job left in the background could end the same way. Staying on the landing page, as in
  segment 1, is the foreground path and is not affected.
- **O-6 The 3 credits for the failed image are not refunded** so far (Step B). KP-007.
- **O-7 「The storyboard for After Closing is ready across six scenes.」 shows before any storyboard exists**, right above
  the Create storyboard card (`s2_06_bottom`).
- **O-8 Card ◆35 here, ◆36 on Echoes in Tide**: different dramas, not comparable with O-2.
- **O-9 Template flow skips the character step**: format answers go straight to the outline and pre-assigned characters, so
  it reached the Create storyboard card in 2 sends (3 by R-142).
- **O-11 (O-10 skipped: it is the filed path name) History row stays "1.6 MB" with no failure mark** for a drama whose storyboard failed.

## Run note

The first swipe in Recents hit the centre card, which was **Chrome, not PowerDirector**, and removed Chrome from Recents (a
CyberLink 「You Are All Set!」 page; open tabs stay in Chrome). It also delayed the real swipe by 26 s. It did not cause the
job failure: the failure followed the block at 14:15:53.8, and the swipe touched another app. I deleted that frame
(`s2_10_…`) because it showed the phone's IMEI and serial.

## Where it stands

App in front, After Closing open at its Storyboard Preview error, nothing running. `pull-logs` ran before the stop this time;
live file is in `logs/s2-20261106-142118/logcat-live.txt` (2,269 lines). Nothing written on ECL, no session export. Both
dramas in History are unusable for video unless After Closing's six scenes are regenerated (⟳ ◆6–12 each per R-059, price not
read: the offer needs Edit first).
