# DRA262610P0347 recheck — 2026-11-05 (NeedMoreInfo: RD could not reproduce)

Ticket: 「Reopened dramas lose the confirmed cast and the characters card」 (filed on 16.8.0.2610212, Sony Xperia 10 III / Android 12).
Origin: `../2026-10-27-a2-round2/` TC-121, TC-337, TC-403, observations O-1 / O-8 (cast lost only after an **interrupted** character step).

- Phone: Samsung Galaxy A53 (SM-A5360, adb R5CTB22S05Y), Android 15, signed in (Free tier: the Launcher's 「Pro」 is the upgrade button; logcat `updateSubscribingStatus: false`; fixtures.md: Free test account), Stage server (yellow Launcher bar, `[AID]Stage_Server`).
- Build: PowerDirector Mobile for Android **16.8.0 build 2611041** (TR261104-0065), **re-signed debuggable with the QA key (dex unchanged)**. No timing is taken from this build.
- Fault switches: none on this build; nothing injected. AI Mini Drama debug info off.
- Drama used: 「Last Reel」 (History; chat title 「Save the Old Cinema」, session 261105_100433_d5cd3d5d), idea "A retired projectionist, his daughter and a young usher save an old cinema on its last night. Three characters.", English, no captions. Cast Nora Vance / Liam Miller / Arthur Vance.

## BLOCKER: daily chat limit
At 10:13:58 「Generate ◆4」 on 「Finish your characters」 (1 character unset) did not start a turn: it showed **「Daily Free Chat Limit Reached」 / 「You have used up your AI Mini Drama free chats. To keep chatting, please upgrade to Premium.」** with 「Upgrade to Premium」 (`16.8.0.2611041_DRA262610P0347_daily_chat_limit.png`; no `[TURN]` line, the check is app-side). At 10:23:44 sending a new idea on a fresh 「Create Your Drama」 page showed the same dialog at once (`…_daily_chat_limit_new_drama.png`). The account had already spent today's chats (earlier runs today on this account). Only the ✓ cast-confirm turn still went through (check C). So paths A and B, which both need a character Generate (◆4 / Generate all) and a fresh drama, **could not be run today**. Nothing was bought; 「Upgrade to Premium」 was not tapped.

Note: this is the expected Free-tier limit (KF-042 / KP-006: Free 10 chats a day, counted app-side), not a tier bug: the account is Free (the Launcher's 「Pro」 is the upgrade button; `updateSubscribingStatus: false`). Today's earlier runs (the DRA262610P0343 recheck and this one) used the 10 chats. Stage confirmed: `[AID]Stage_Server` on the Launcher, `/sdcard/cyberlink/PDR/testserver.config` present.

## Credits
| When | Pill |
| --- | --- |
| Start (assistant page, 10:04) | 28,166 |
| After the outline, the blocked Generate and the cast confirm | 28,166 |
| End (assistant page, 10:24) | 28,166 |

Nothing was charged (the outline and the library picks are free; the ◆4 Generate never ran; Create storyboard ◆31 was not tapped).

## Checks

### A. Path 1 (The Final Reel path: Generate ◆4 for the unset slot, sheet X, picker X › Leave)
- Steps (as far as possible):
  1. Create Your Drama › type the idea › send.
  2. Pick English / No captions › Generate (outline; 「Ready to create your characters?」 with three empty slots).
  3. Tap the Nora Vance slot.
  4. Pick a library look for Nora Vance.
  5. Tap the Liam Miller slot.
  6. Pick a library look for Liam Miller (Arthur Vance left unset).
  7. Tap ✓ (「1 character isn't set yet」 / 「Finish your characters」).
  8. Tap Generate ◆4.
- Seen: 「Daily Free Chat Limit Reached」 at step 8; no generation, no 「Your characters are ready」 sheet.
- Verdict: **NOT RUN (blocked by the daily chat limit)**.

### A′. Same drama, picks left unfinished (the Quiet Hours symptom), done instead
- Steps:
  1. From step 8 above, close the limit dialog with its X.
  2. Tap Cancel on 「Finish your characters」.
  3. Tap the Choose Character X.
  4. Tap 「Leave」 on 「Leave without finishing?」 / 「If you leave now, your picks won't be saved.」
  5. Tap ← to leave the chat.
  6. Force-stop the app (`am force-stop`; pid 14724 → 21609 after relaunch).
  7. Relaunch › AI Mini Drama › Try It Now › History › 「Last Reel」.
- Seen: after Leave the chat ends with the Story Outline card and 「Ready to create your characters?」 with three empty slots, nothing committed (`…_E_leave_dialog.png`, `…_E_after_leave_chat.png`). Reopened: same — outline card, 「Ready to create your characters?」, three empty slots (`…_E_reopen1.png`; log `restored session 261105_100433_d5cd3d5d (chars=3, shots=0)`, `reopened 1 question(s) from the blueprint`). The 「Choose your characters」 step is kept, unlike Quiet Hours (which reopened with only the Story Outline card).
- Verdict: **DOES NOT REPRODUCE** (for a Leave that never reached a generated look; the original's trigger, a look generated and then Leave, could not be tried).
- Log: `16.8.0.2611041_DRA262610P0347_limit_leave_reopen_log.txt`.

### B. Path 2 (Corner Stall path: Generate all, X › Leave anyway while 「Creating N characters…」)
- Steps: not started (a fresh drama cannot be created: sending the idea shows 「Daily Free Chat Limit Reached」, 10:23:44).
- Verdict: **NOT RUN (blocked by the daily chat limit)**.

### C. Control: cast confirmed normally (✓ with every slot set), then reopen
- Steps:
  1. On reopened 「Last Reel」, tap the Nora Vance slot.
  2. Pick a library look for Nora Vance.
  3. Tap the Liam Miller slot and pick a library look.
  4. Tap the Arthur Vance slot and pick a library look.
  5. Tap ✓.
  6. Wait for 「The characters look great! Ready to create the storyboard?」 (54 s, turn_complete 10:22:07).
  7. Tap ← to leave the chat.
  8. Force-stop the app (pid 21609 → 22522 after relaunch).
  9. Relaunch › AI Mini Drama › Try It Now › History › 「Last Reel」.
  10. Tap ← again, then History › 「Last Reel」 (second reopen, no force-stop).
- Seen: before leaving, 「Characters Result」 with the three looks and Replace, then 「The characters look great! Ready to create the storyboard?」 and Create storyboard ◆31, 「You'll have 28135 left」 (`…_C_chat_before_leave.png`). Reopen 1 (after force-stop): same Characters Result with all three looks and the Create storyboard ◆31 card last (`…_C_reopen1.png`; log `restored session … (chars=3, shots=6)`). (A stray tap first opened Choose Character from a cast card, showing all three looks set, `…_C_reopen1_picker_from_cast_card.png`; closed with X, no dialog, nothing changed.) Reopen 2: unchanged, Create storyboard ◆31 last (`…_C_reopen2.png`).
- Verdict: **DOES NOT REPRODUCE** (as expected; matches RD).
- Log: `16.8.0.2611041_DRA262610P0347_control_confirm_reopen_log.txt`.

### D. Second reopen
- C: done (step 10), cast kept. A′: one reopen only. A / B: not run.

### Restart vs no restart
Not applicable: A / B did not run.

## Minimal repro
None on this build so far: the interrupted-generation paths (A, B) are still untested. They need a day with chats left (or an account with Unlimited daily chat / a Pro account the app treats as Pro).

## Evidence (all under `screenshots/` unless noted, prefix `16.8.0.2611041_DRA262610P0347_`)
- `daily_chat_limit.png`, `A_after_limit_close.png`, `daily_chat_limit_new_drama.png`
- `E_leave_dialog.png`, `E_after_leave_chat.png`, `E_reopen1.png`
- `C_confirm_attempt.png`, `C_chat_before_leave.png`, `C_reopen1_picker_from_cast_card.png`, `C_reopen1.png`, `C_reopen2.png`
- Working shots: `a_outline.png`, `a_outline2.png`, `a_picker.png`, `a_pick1.png`, `a_picks.png`, `a_unset_dialog.png`
- Run folder: `…_limit_leave_reopen_log.txt`, `…_control_confirm_reopen_log.txt` (logcat excerpts; full captures in the git-ignored `logs/recheck-20261105-101959/` and `logs/recheck-end-20261105-102357/`)

No ticket was commented on or changed.

## Official build, paths A/B (11:14–11:30)

- Phone: Samsung Galaxy A53 SM-A5360 (R5CTB22S05Y), Android 15. Build: **official** PowerDirector 16.8.0 build 2611041
  (TR261104-0065, not debuggable; see `official-build/result.md`), Stage server, signed in (qau2 CLT), Free tier. No fault
  switches on this build; nothing injected.
- Logcat: the live capture had stopped at the 11:02 reinstall (new app uid); path A comes from the phone's ring buffer,
  the capture was restarted at 11:17:31 (`logs/.live/logcat-20261105-111731.txt`, git-ignored).
- Screenshots: `screenshots/16.8.0.2611041_DRA262610P0347_official_*`. Logs: `16.8.0.2611041_DRA262610P0347_A_leave_reopen_log.txt`,
  `16.8.0.2611041_DRA262610P0347_B_leave_reopen_log.txt`.

### Path A (The Final Reel path) — **REPRODUCES**
Drama: the cafe drama from 11:06 (History 「Shared Dreams」, chat title "Cafe Opening Story", session 261105_110537_5edec7d2;
cast Maya / Julian). It was still open in the chat, so it was used from there.
- Steps: Maya slot › library look for Maya (Julian left unset) › ✓ › 「Finish your characters」 / 「1 character isn't set yet」
  › Generate ◆4 (11:14:56) › 「Your characters are ready」 / Confirm after 68 s › sheet X (11:16:17) › Choose Character shows
  the generated Julian look in its slot (`_A_06`) › picker X › 「Leave without finishing?」 / 「If you leave now, your picks
  won't be saved.」 (`_A_07`) › 「Leave」 (11:16:57).
- Chat right after Leave (`_A_08`, `_A_08b` 15 s later): no Characters Result card; the chat had already moved on:
  「The complete six-scene storyboard has been created for Before Dawn Preparations through Unspoken Shift.」 then
  「The characters look great! Ready to create the storyboard?」 with Create storyboard ◆26 (「You'll have 28136 left」).
  The log shows why: the Generate turn itself ran past the look (text-to-image ok 11:15:33, then storyboard-executor and
  environment-executor) and ended `[TURN] turn_complete: final_state=complete`, `turn_end complete stage=storyboard→storyboard`
  at 11:16:08, before the sheet X. Nothing is logged at the Leave.
- ← + plain reopen from History (no force-stop, 11:18): same as before leaving — Create storyboard ◆26 last, no cast card
  (`_A_10`, `_A_10b`, `_A_10c`). No `restored session` line (the process kept the session in memory). **So the symptom does
  not show on a plain ← + reopen.**
- ← › `am force-stop` (11:18:58, pid 25730 → 28651) › relaunch › AI Mini Drama › Try It Now › History › 「Shared Dreams」
  (11:19:48): the chat ends at the Story Outline card and 「Ready to create your characters?」 with **both slots empty**;
  no 「The characters look great!」 message, **no Create storyboard card** (`_A_12`). Log `[SYS] restored session
  261105_110537_5edec7d2 (chars=2, shots=0)`, `reopened 1 question(s) from the blueprint`.
- Second reopen without force-stop (11:20:20): unchanged, slots empty (`_A_13`); tapping the Julian slot opens Choose
  Character with both slots empty; the generated Julian look is only in the library as 「Mine」 (`_A_14`; closed with X, no
  dialog).
- Credits: 28,166 → 28,162 (◆4 for Julian's look, charged; not refunded).

### Path B (Corner Stall Rivalry path) — **REPRODUCES** (when Leave anyway lands after the turn ended)
Drama: new, idea "Two rival food stall owners compete on the same street corner. Two characters." (History 「Corner Turf」,
session 261105_112055_69e599c8; cast Elena / Marcus). English / captions, outline Generate 11:21:09, done 11:23:11.

**B1 — Leave anyway while the turn was still running (no repro).** Elena slot › ✓ with both unset › 「2 characters aren't set
yet」 › Generate all ◆8 (11:24:13) › 「Creating 2 characters…」 › sheet X (11:24:23, a watcher fired early on the previous
✓ turn's turn_complete) › 「Stop and lose your credits?」 / 「This is still generating. If you leave now, it'll stop and the
credits you've spent won't be refunded.」 (`_B_05`) › both looks finished (text-to-image ok 11:24:45 / 11:24:47) › 「Leave
anyway」 at 11:24:55. Log: `MyCreation receipt cancelled … tts_2`, `[TURN] cancel_turn -> 0`, `turn_complete:
final_state=cancelled`, `discarded reply after user cancel`. Choose Character came back with **both slots empty** (`_B_06`);
picker X closed it with no dialog; the chat showed 「2 characters aren't set yet」 with empty slots (`_B_08`) — nothing
committed, no storyboard card. Credits 28,162 → 28,154 (◆8 charged, not refunded, as the dialog warns). Reopens not done
for B1 (the chat was already back at the unset step, and B2 continued in the same drama).

**B2 — Leave anyway ~1 s after the turn ended (repro).** In the same drama: Elena slot › ✓ › Generate all ◆8 (11:25:52)
› images ok 11:26:34 › sheet X at 11:26:34.5 (「Stop and lose your credits?」) › the generation turn ended at 11:27:21.04
(`turn_complete: final_state=complete`, `turn_end complete stage=storyboard→storyboard`) › 「Leave anyway」 at 11:27:22.4
(1.4 s later; no cancel_turn logged). Choose Character came back with **both generated looks in the slots** (`_B2_02`).
Picker X closed it **without** the 「Leave without finishing?」 dialog, onto the chat (`_B2_03`, `_B2_04`): no cast card,
「Created the 6-beat storyboard for Corner Turf with Elena and Marcus on the street corner.」, 「The characters look great!
Ready to create the storyboard?」, Create storyboard ◆25 (「You'll have 28121 left」).
- ← + plain reopen (11:27:58): unchanged, Create storyboard ◆25 last (`_B2_05`). **Not visible on a plain ← + reopen.**
- ← › `am force-stop` (11:28:13) › relaunch › Launcher › AI Mini Drama › Try It Now › History › 「Corner Turf」 (11:29:07):
  outline card then 「Ready to create your characters?」 with **Elena and Marcus empty**, **no Create storyboard card**
  (`_B2_06`). Log `restored session 261105_112055_69e599c8 (chars=2, shots=0)`, `reopened 1 question(s) from the blueprint`.
- Second reopen without force-stop (11:29:25): unchanged (`_B2_07`).
- Credits: 28,154 → 28,146 (◆8, kept and charged).

### Verdicts
| Path | Verdict | Seen |
| --- | --- | --- |
| A | **REPRODUCES** | After sheet X › picker X › Leave the chat moves on to Create storyboard ◆26 with no cast card; after a force-stop the reopened drama is back at 「Ready to create your characters?」 with both slots empty and no storyboard card. |
| B | **REPRODUCES** (B2) | 「Leave anyway」 1.4 s after the generation turn ended: chat moves on to Create storyboard ◆25 with no cast card; after a force-stop the reopen shows empty slots and no storyboard card. Leave anyway during the turn (B1) cancels it cleanly instead. |

Both need a process restart: a plain ← + reopen still shows the moved-on chat. In every case the turn had already committed
(`stage=storyboard→storyboard`) before the user left, and the restore after force-stop reports `shots=0` and reopens the
character question.

### Minimal repro (path A, eBug Repro Steps)
1. Open AI Mini Drama › Try It Now › Create Your Drama.
2. Enter "A short story about two friends opening a cafe. Two characters." and send.
3. Tap Generate on the format card and wait for 「Ready to create your characters?」.
4. Tap the first character's slot.
5. Pick any library look for the first character.
6. Tap ✓ (the second character is left unset).
7. Tap Generate ◆4 on 「Finish your characters」.
8. Wait for 「Your characters are ready」.
9. Tap the sheet's X (not Confirm).
10. Tap the X on Choose Character.
11. Tap 「Leave」 on 「Leave without finishing?」.
12. Tap ← to leave the chat.
13. Force-stop PowerDirector (or swipe it away from Recents).
14. Launch PowerDirector › AI Mini Drama › Try It Now › History.
15. Open the drama.
- Result: after step 11 the chat shows 「The characters look great! Ready to create the storyboard?」 with Create storyboard;
  after step 15 it shows 「Ready to create your characters?」 with every slot empty and no Create storyboard card.
- Expect: the drama reopens in the state the chat showed when it was left (or the picks are not committed in the first place,
  as 「your picks won't be saved」 says).

### Usage this section
- Chats: 7 turn-starting taps (A: ✓, Generate ◆4; B: outline Generate, ✓, Generate all, ✓, Generate all), on top of the
  one at 11:06. 「Daily Free Chat Limit Reached」 did not appear.
- Credits: 28,166 → 28,146 (−20: ◆4 Julian look, ◆8 B1 looks, ◆8 B2 looks). No storyboard or video; Create storyboard
  was never tapped; nothing bought.
- No ticket was commented on or changed.
