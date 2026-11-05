# Official 16.8.0 build 2611041: server, tier and daily chat limit (2026-11-05, 11:02–11:11)

Asked: is the official (not re-signed) build also on Stage, and does it also hit the daily chat limit that the
re-signed debuggable build hit on this account at ~10:14 (「Daily Free Chat Limit Reached」, see `../result.md`)?

## Build
- Phone: Samsung Galaxy A53 SM-A5360 (adb R5CTB22S05Y), Android 15.
- 11:02 `adb uninstall com.cyberlink.powerdirector.DRA140225_01` (the re-signed debuggable 2611041; data and sign-in
  cleared, user-approved), then `adb install` of
  `~/.casebook/android/apks/com.cyberlink.powerdirector.DRA140225_01-2611041-original.apk`.
- APK MD5 `1ff6b186966b8b519cf8851a711cade5` = expected `1FF6B186966B8B519CF8851A711CADE5`.
- dumpsys: versionName 16.8.0, versionCode 2611041, flags `[ HAS_CODE ALLOW_CLEAR_USER_DATA ALLOW_BACKUP LARGE_HEAP ]`
  — **not DEBUGGABLE** (before the uninstall the flags included `DEBUGGABLE`).
- `/sdcard/cyberlink/PDR/testserver.config` was in place before the first launch.

## First launch
GDPR screen 「Get Started」 (`_01-first-launch.png`) → notifications 「Allow」 → the PowerDirector Pro paywall
(NT$1190/Year, 「Continue」) closed with its ← (nothing bought) → Launcher signed out (`_02-launcher-signed-out.png`).
Sign-in: Mine › 「User Sign in」 › Google button (phone's Google account, no password; Chrome's sync prompt answered
「No thanks」; the sign-in page was `mauth-stage.cyberlink.com`) › 「Account Sign In」 notice 「Got it」. Signed in as
qau2 CLT (`_03-mine-signed-in.png`).

## Server: **Stage**
- Launcher toolbar content-desc `[AID]Stage_Server`, signed out and signed in (`_02…_els.txt`, `_04…_els.txt`).
- Launcher top bar yellow (`_02`, `_04` screenshots).
- Google sign-in went through `mauth-stage.cyberlink.com` → `csestage.cyberlink.com`.
- AI Mini Drama loaded 20 Stage templates; `cc_chat_base_url = https://demo.myedit.online/iris-relay` (logcat).

## Tier: **Free**
- Mine shows 「Free」 with 「Claim offer」 (`_03`). The Launcher's 「Pro」 is `layout_try_badge` / `tv_try` (the upgrade
  badge for Free users), not a Pro status.
- logcat `GoogleBillingWrapper: updateSubscribingStatus: false` (11 times, 11:02:25–11:05:11, before and after sign-in).

## Credits
28,166 throughout (Mine and the AI Drama Assistant pill, before and after the outline turn; logcat
`getMemberCreditRemain … totalRemain=28166`). Nothing was charged.

## History
「No dramas yet」 right after sign-in (`_06-history.png`): the account's earlier dramas (e.g. 「Last Reel」 from 10:04 today)
are **not** shown after the reinstall, so History is stored on the device, not fetched from the server.

## Daily chat limit: **not hit**
- 11:05:37 New Chat; 11:05:54 sent "A short story about two friends opening a cafe. Two characters." → the format card
  (English / captions, `_07-after-send.png`) → 11:06:24 「Generate」 → 「I'll create a story outline — give me a
  moment...」 / 「Thinking…」 (`_08-after-generate.png`), `[TOKEN] resolve_token (member_token ok, uuid ok) -> 0`.
- No 「Daily Free Chat Limit Reached」 / 「Today's AI Chats Are Used Up」 dialog.
- The turn ran: `dispatch_planned` at 11:09:06 (161 s after the prompt; the re-signed build's turns this morning
  dispatched in ~3–5 s), `[TURN] turn_complete: final_state=complete` at 11:09:37; Story Outline Result with Maya and
  Julian (`_09-turn-result.png`, `_09-turn-result_texts.txt`). One message only; no characters, storyboard or video.
- **Caveat:** the limit is counted app-side (`../result.md`: no `[TURN]` line when it fires; KF-042 / KP-006), and the
  uninstall cleared the app's data. So this shows the counter starts fresh after a reinstall; it does **not** show the
  official build lacks the limit. Comparing builds fairly needs ~10 chats on the official build (expect the dialog on
  about the 11th) or the same chat count on both.

## Files
`2611041-official_01…09*.png`, `*_els.txt`, `*_texts.txt`, and `2611041-official_logcat.txt` (PowerDirector pid 25730:
billing, credits, AI Mini Drama lines).

## Daily limit on the official build (2026-11-05, 11:49–11:53)

Asked: does the official 2611041 still reach the Free daily chat limit (KF-042: 10 chats a day, counted app-side,
then 「Daily Free Chat Limit Reached」 with only 「Upgrade to Premium」)? Same phone, same install (11:02), Stage, Free,
signed in. Chats 1–8 are the turns started since the reinstall (from the sections above and `../result.md` › Official
build, paths A/B, counts as given in the brief); chats 9–13 are free title-change messages sent in 「Shared Dreams」
(History, session `261105_110537_5edec7d2`). No card was generated, no ◆ action tapped, 「Upgrade」 never tapped.

| # | Time | Action | Result |
|---|------|--------|--------|
| 1 | 11:06 | Cafe idea › 「Generate」 (outline) | turn ran |
| 2 | path A | ✓ (cast confirm) | turn ran |
| 3 | path A | 「Generate ◆4」 | turn ran |
| 4 | path B | Outline 「Generate」 | turn ran |
| 5 | path B | ✓ | turn ran |
| 6 | path B | 「Generate all ◆8」 | turn ran |
| 7 | path B | 「Generate all ◆8」 (again) | turn ran |
| 8 | path B | not named in the brief, which counts 8 turns; likely path B's idea send (11:21:00) or the turn cancelled at 11:24:55 | turn ran |
| 9 | 11:49:40 | "Please change the story title to Morning Brew." | turn ran: 「Changing the story title to Morning Brew.」 → 「Morning Brew's cast remains set with Maya and Julian.」; `turn_complete: final_state=complete` 11:49:57 (`_limit_09.png`) |
| 10 | 11:50:36 | "Please change the story title to Second Cup." | turn ran: 「I've confirmed the cast for Second Cup.」; complete 11:50:54 (`_limit_10.png`) |
| 11 | 11:51:04 | "…title to Morning Brew." | turn ran: 「Changing the story title back to Morning Brew.」 → 「I've preserved Maya and Julian for Morning Brew.」; complete 11:51:22 (`_limit_11.png`) |
| 12 | 11:51:33 | "…title to Second Cup." | turn ran: 「Updating the story title to Second Cup.」 → 「I've preserved Maya and Julian for Second Cup.」; complete 11:51:54 (`_limit_12.png`) |
| 13 | 11:52:02 | "…title to Morning Brew." | turn ran: 「I kept Maya and Julian for Morning Brew.」; complete 11:52:20 (`_limit_13.png`) |

(Rows 2–7: see `../result.md` › *Official build, paths A/B* for exact times; the count of 8 is the brief's. Logcat since
11:17 also shows one `cancel_turn` at 11:24:55 in path B's session `261105_112055_69e599c8`.)

- **No 「Daily Free Chat Limit Reached」 by chat 13.** Every send dispatched (`dispatch_planned`, turns t4–t8 of the
  session) and completed in 13–18 s; no dialog, no paywall.
- **Credits:** 28,146 before chat 9 (`_limit_08-before.png`, logcat `totalRemain=28146`) and 28,146 after chat 13
  (pill). Nothing charged. Tier still Free (`updateSubscribingStatus: false`, 11:49:05).
- **Dialog controls:** not observed on this build (no dialog appeared).
- **Caveat — what the gate may cover.** On the re-signed build this morning the dialog appeared on 「Generate ◆4」 and on
  sending a new idea from a fresh 「Create Your Drama」 page, while the ✓ cast-confirm turn still went through
  (`../result.md`, BLOCKER section). So the app-side gate may apply only to Generate / new-drama starts, not to
  follow-up messages in an existing drama; chats 9–13 may not be counted or gated at all. This run shows the limit is
  not enforced on follow-up title messages up to 13 turns; it does not yet show the official build lacks the limit.
  A free discriminating check: New Chat › send a short idea (stop at the format card, no Generate) — on the re-signed
  build that send alone showed the dialog.

Files: `2611041-official_limit_08-before.png`, `_limit_09.png` … `_limit_13.png`, `2611041-official_limit_logcat.txt`
(token redacted; full capture in git-ignored `../logs/`).

### New drama idea send (11:53, follow-up check)
- 11:53:41 Shared Dreams › New Chat (+): new session `261105_115341_188ed74c` (logcat `session_created`), 「Hi, I'm your
  AI Drama Assistant」 page, pill 28,146.
- 11:53:51 sent "Two neighbours share a garden. Two characters." → **no dialog**: the format card appeared at once
  (「What format would you like for your video?」, Video language / Captions / 「Generate」, `_limit_14-new-idea.png`).
  「Generate」 was **not** tapped. Pill still 28,146.
- logcat: no `[TOKEN]`, `dispatch_planned` or `[TURN]` line after the send (the format card is local), and no limit line.
- On the re-signed build at 10:23:44, this same action (an idea sent on a fresh Create Your Drama page) showed
  「Daily Free Chat Limit Reached」 at once. Here it did not, after 13 counted turns (8 before plus chats 9–13).
- Nothing else is free to try in this new drama (the next step is 「Generate」), so the check stops here. Dialog
  controls: not observed.

### Paid turns until the limit (11:55–12:06, coordinator go-ahead: any spend except a full video)
These chats continue the count in the new drama 「Two neighbours share a garden」 (session `261105_115341_188ed74c`).

| # | Time | Action | Turn ran / dialog | Credits (pill) |
|---|------|--------|-------------------|----------------|
| 14 | 11:55:51 | Format card 「Generate」 (outline) | ran: Story Outline Result, Claire / Julian; complete 11:56:21 (`_limit_14.png`) | 28,146 → 28,146 |
| 15 | 11:57:14 | Choose Character: library characters picked for Claire and Julian › ✓ (cast confirm) | ran: Characters Result, 「Create storyboard」 offer (Generate ◆25); complete 11:59:24 (`_limit_15.png`) | 28,146 → 28,146 |
| 16 | 11:59:50 | 「Create storyboard」 › 「Generate」 ◆25 | ran: 「Here's your storyboard」 + video offer (「Generate video」 ◆120, **not tapped**); complete 12:03:00 (`_limit_16.png`) | 28,146 → **28,121** (logcat `totalRemain=28121`) |
| 17 | 12:03:26 | "Please change the story title to Garden Truce." | ran: 「Updating the story title to Garden Truce.」; complete 12:04:04 (`_limit_17.png`) | 28,121 → 28,121 |
| 18 | 12:04:11 | "…title to Shared Plot." | ran: 「The overall story theme is managed in the outline stage, so the storyboard scenes remain unchanged.」; complete 12:04:54 (`_limit_18.png`) | 28,121 → 28,121 |
| 19 | 12:04:58 | "…title to Garden Truce." (send) | **blocked: 「Daily Free Chat Limit Reached」** (`_limit_19-dialog.png`); no `[TOKEN]` / `dispatch_planned` / `[TURN]` line, the message was not sent (it stays in the input box) | 28,121 → 28,121 |

**The official build does enforce the daily limit: the dialog appeared at the 19th counted chat** (a plain message), not
at about the 11th as on the re-signed build this morning. As counted here: 8 turns before 11:49, 5 title messages
(9–13), then 5 turns in the new drama (14–18); the new-drama idea send at 11:53:51 only showed the format card (no
turn) and is not counted.
- Dialog text: 「Daily Free Chat Limit Reached」 / 「You have used up your AI Mini Drama free chats. To keep chatting,
  please upgrade to Premium.」 / 「Upgrade to Premium」 (never tapped).
- Controls: an **X** at the top right of the panel (`button_mini_drama_chat_quota_close`, content-desc 「Cancel」)
  closes it (12:05:29 re-send showed the dialog again, X closed it: `_limit_19-resend-dialog.png`,
  `_limit_19-after-x.png`). **Tapping outside** (the dim scrim, 540,2000) also closes it (`_limit_19-tap-outside.png`).
  This differs from KF-042 (「only 『Upgrade to Premium』, no ✕」, iOS 16.9.0): on this Android build there is an X.
- Credits: 28,146 before chat 9 → 28,121 at the end; the only charge was the storyboard ◆25 (chat 16). The blocked
  sends charged nothing.
- Why 19 and not 11 is open: the counter is app-side (KF-042) and was reset by the 11:02 reinstall, so either the
  official build counts differently (e.g. some turns not counted: the cancelled 11:24:55 turn, cast confirms, or
  title-only turns) or its quota is higher. The brief's count of 8 before 11:49 is also an estimate (see row 8).
