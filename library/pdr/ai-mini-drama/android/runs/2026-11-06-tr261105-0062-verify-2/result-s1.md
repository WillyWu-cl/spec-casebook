# TR261105-0062 round 2 verify, segment 1 (plan steps 1–5), 2026-11-06 13:51–14:08

Phone: Samsung SM-A5360 (R5CTB22S05Y), Android 15. Build: official 16.8.0.2611052 (`build` confirmed). Account as briefed
(Free, Stage); neither was re-read from the Menu or the Launcher bar in this segment, because the app stayed in AI Mini Drama.
No fault injection exists on this build. Drama: **Echoes in Tide** (session 261106_134503_6dda5827), idea typed by hand.

**The segment did not reach its end state.** 「Choose your video settings」 never appeared on this drama (see O-1), so
segment 2 cannot start from it.

## Credits and chats

| When | Pill |
| --- | --- |
| Start, and before Generate (card ◆36, 「You'll have 27983 left」) | 28,019 |
| Stage ②, just before ← (14:00:56) | 28,016 |
| After the job (14:03:53 on, unchanged to the end) | 27,984 |

Used: **35 credits** (card said 36, see O-2). No video generated.
Chats: **6 sends** (idea, format answers, stopped revision, characters ✓, storyboard Generate, one extra request). The
6th was not in the plan: I sent 「Please show the video settings.」 to try to reach the card (O-1). The app shows no
counter, so which of the 6 count against the Free 10 is not known; assume at most 4 are left today.
Characters were picked from the free library (no charge). Credit Details ledger not opened.

## DRA262610P0343: FIXED

- Expected: stage ② ←, no dialog, only the toast 「We'll keep making your storyboard. Find it in History.」; the job finishes.
- Stage ①: Generate 14:00:28, ← at 14:00:30, pill still 28,019, card 「Thinking…」: 「Leave while we're preparing?」 with
  Leave anyway / Stay. Stay kept the job. My polling loop timed out and pressed ← a second time at 14:00:46, still
  stage ① (「Processing the storyboard creation.」, pill 28,019): same dialog, Stay again at 14:00:55.
- Stage ②: 「Creating your scene…」, pill 28,016 (first charge 14:00:53). ← at 14:00:56: straight to the assistant page,
  no dialog in any of 4 frames, toast fully legible in frame 2. Log: `Toast show` 14:00:56.752, no `Dialog` line after
  14:00:46.
- Job: charges went on in the background (14 receipts, last 14:03:52), `turn_complete: final_state=complete` 14:04:33,
  History 23 MB, reopened with six scenes and Storyboard Preview 0:35. Charged once, no second run. One voice sample
  failed on the server and the settings card is missing (O-1, O-2); neither is this bug's symptom.
- Evidence: `16.8.0.2611052_DRA262610P0343_01_card_before_generate.png`, `_02_stage1_dialog.png`,
  `_03_stage2_before_back.png`, `_04_stage2_back_toast.png`, `_log.txt`.
- Side effects: none seen from the dialog or toast (places checked, screenshots opened: stage ① dialog, stage ② toast
  over the landing page; text readable by eye, contrast not measured). No Design comparison done. The toast sits over
  the template captions, as a system toast does. System Back not repeated on this build. One step past the fix: the job
  finished, but see O-1.

## DRA262610P0348: all four paths checked here pass; bug stays HOLD for O-20 (video cards, segment 2)

Left and reopened as filed (← , History, same drama), walked top to bottom each time.
Order before leaving at the characters stage: idea; 「What format…」; format answers; 「I'll create a story outline…」;
Story Outline & Characters Result; 「I've created the character profiles…」; revision bubble; Story Outline &
Characters Result with Replace; 「The characters look great!…」; Create storyboard card.

| Path | Seen | Result |
| --- | --- | --- |
| TC-160 outline, 13:53:46–13:54:32 | same bubbles and cards in the same order, starting at the idea | pass |
| TC-155 Stop ■, 13:54:54–13:55:04 | see below | pass |
| TC-162 characters, 13:59:45–14:00:16 | same list and order as above, card ◆36 still there | pass |
| O-10 resume, 14:04:45–14:05:14 | idea, format answers, 「I've created the character profiles…」 and the revision bubble all there | pass, ← path only |

- TC-155: 「Ready to create your characters?」 leaves the chat while Iris works (Thinking… / 「Updating Clara's character
  profile.」 card) and comes back right after ■, with both slots, now **below** the revision bubble instead of above
  it. Log: `cancel_turn`, `final_state=cancelled`, `[SYS] reopened 1 question(s) from the blueprint`. The filed symptom
  (card gone) is not there. The 「Updating…」 caption goes with the skeleton card; I read it as a status, not a reply.
  No dialog, pill unchanged.
- O-10 was filed after a **swipe-away** mid-storyboard. I only left with ←, as the plan says; swiping would have spoiled
  the P0343 check and a second storyboard was over budget. If the swipe path is required, it is still open.
- 「The characters look great!…」 and the Create storyboard card are replaced by the 「Create storyboard」 bubble at
  Generate, already in the chat before leaving (`_03_stage2_before_back.png`), so that is not a reopen loss.
- Notice: 「To keep the file lightweight, we kept only the generated story outline, images and videos.」 shows on History
  (footer, plus a tooltip on first open). It was not needed: nothing was lost here.
- Evidence: `16.8.0.2611052_DRA262610P0348_01_outline_before_leave.png`, `_02_outline_after_reopen.png`,
  `_03_after_stop_card_stays.png`, `_04_after_resume_characters_reply.png`, `_05_history_notice.png`, `_log.txt`; full
  page lists in `screenshots/s1_*_p*.txt`.
- Side effects: none seen on the paths above (places checked: reopened chat pages, card after ■); see O-3 for the
  tooltip. To repeat when the bug is judged as a whole.

## Other observations

- **O-1 No 「Choose your video settings」 after the storyboard.** Absent from the screen and page source on 4 opens
  (14:04:45, 14:05:55, after the chat request, 14:08:05), and there is no 「Create video」 control. The chat shows no
  error. Log: voice sample `tts_8` failed, `TextToSpeech failed: … Error 4000 External Error` (14:03:47);
  at the end `MiniDramaFail: [engine] target=char_480e605f | tool=VoiceReference` and `[storyboard] … generation_failed`
  (14:04:33). Two toasts fired at 14:04:33.085 and .100 on the landing page; I was not capturing then and the log gives
  no text. The link between the failed voice and the missing card is my inference, not proven. A leave in stage ② is
  not the likely cause: on 2611041 the same path showed the card. Iris answered the chat request with only 「The selected
  video settings are: Video language: English (en_US) Captions: Yes」 and no card. A real server failure, nothing injected.
- **O-2 Charge 35, card ◆36.** Likely the failed `tts_8` (`receipt failed`), but its 1 credit cannot be matched in the
  balance steps, so confirm in Credit Details if it matters.
- **O-3 Tooltip covers the row.** On first open of History the notice tooltip hides the drama's title until tapped
  away (`_05` is after dismissal; `screenshots/s1_A_history.png` shows it).
- **O-4 Stage ① lasted about 25 s** (14:00:28 to 14:00:53), and the caption is 「Thinking…」 then 「Processing the
  storyboard creation.」, not 「Preparing your scenes…」 as in TC-061's precondition.

## Where it stands

App in front, Echoes in Tide open at its last message, no settings card. Logcat stopped; `pull-logs` ran after the stop
and missed the live file, so I copied it to `logs/s1-20261106-140813/logcat-live.txt`. Nothing written on ECL, no session export.
