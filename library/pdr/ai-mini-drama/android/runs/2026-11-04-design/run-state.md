# Design pass — board 「main flow」 on the Galaxy A53, build 2611021, with app view data (REQ-087)

Board: Design 「main flow」 (2778:127318), 45 routed screens, walked in two segments, one subagent each (AGENTS.md
*One section per context*). The first main-flow pass of today was deleted at the user's request; this is the fresh
run, the first with the debuggable build's own view data (REQ-085/086) and the exact-data check (REQ-084).
Started: 2026-11-04T09:50:45Z (Appium session); segments from 2026-11-04T10:0xZ.

- **mf-1** — landing, idea input, format, outline, characters, storyboard Generate: rows TC-001, TC-009, TC-011,
  TC-013, TC-020, TC-021, TC-022, TC-024, TC-033, TC-037, TC-044, TC-060 (26 screens).
- **mf-2** — storyboard preview, preview video, full-video result, template flow: rows TC-075, TC-080, TC-081,
  TC-086, TC-087, TC-138, TC-142, TC-236, TC-440, TC-321, plus the TC-020 video-loading frames 2778:138725 /
  2778:138862 (19 screens).

## Environment
- Device: Samsung Galaxy A53 (SM-A5360), serial R5CTB22S05Y, Android 15, 1080 × 2400 px; system font scale set to
  1.0 for this run (normally 1.1), restored at the end.
- Build: PowerDirector Mobile for Android 16.8.0 (2611021), re-signed debuggable (`android-viewdump.ts prepare`,
  REQ-085): reinstalled with data cleared; the user signed in again, consent accepted, notifications allowed.
  A debuggable build is slower: no timing from this run counts.
- Rules: Stage server (yellow Launcher bar); credits on outlines, characters, storyboards and preview videos only, no
  full video generation; no purchase buttons; Appearance switched in the app (Launcher ☰ › Preferences), Light at the end.

## Checkpoints

### 2026-11-04T10:22Z · mf-1 captured
Segment mf-1 17:53–18:22 CST. Build 16.8.0 (2611021) debuggable, Stage (yellow bar), signed in qau2 CLT. Walked Dark
(app Appearance switched from 「Device Settings」), then Light; left on Light Mode. 24 of 26 screens captured, every
line with `views` (11 automatic checked against their frames, 13 by hand; automatic 127500 and 127450 had taken the
pre-tap screen and 2778:138725 a landing page, removed). Not captured: 2778:127475 and 3142:68296 (「Building the
cast」): the app has no such stage (「Thinking…」 → 「Processing the mini drama project with selected video
settings.」 → outline with characters at once), tried in two template and two custom chats. 2778:127378 / 3142:68240
were captured on custom-chat format cards (the frames draw a template poster and an idea bubble together).
Credits 28787 → 28643: storyboard 1 (dark, quoted 32) took 116 in all (one −84 at 18:05:17 not explained, maybe
another client on the shared account; not checked in Mine › Credits › Details), storyboard 2 (light) 28 as quoted;
outlines and characters free; no video. Dramas: custom 「Body Swap」 (dark) and 「Borrowed Boyfriend」 (light), both
storyboarded; templates 「Forbidden Office Romance」 (dark) and 「The New Guy's Secret」 (light) at outline + cast, never
offered the storyboard card (dark: log-only gateway failure 18:08:40; light: 「The language is already set to
English.」). First custom outline failed with a server 502 (「Something went wrong on my end…」), Try again worked.
Watch captures of other boards (2566:114704/114761, 2824:130245/130307/130669, 3949:74761 wrong) left for the
orchestrator. Logs: logs/mf-1-20261104-182204/.

### 2026-11-04T11:30Z · mf-2 captured
Segment mf-2 18:24–19:30 CST, same build, server and account. Dark, then Light; left on Light Mode, phone on the
Launcher. 12 of 19 screens captured, every line with `views` (2778:127612, 2778:127742 automatic and checked; the rest
by hand; automatic 127956 / 128300 replaced by hand captures, automatic 2778:128025 had matched a template preview
loading to the full-video loading frame and was removed with its files). 2778:138725 was taken under TC-081 and
2778:138793 in the custom chat 「Borrowed Boyfriend」, not a template chat.
Not captured: 2778:127811, 2778:128025, 2778:138862 (full-video loading: no full video may be generated);
3131:65428, 2778:128097, 3153:103325 (full-video result: History holds no drama with a full video since the
reinstall; 「Memory Drift」 is gone); 2778:127525 (「Building the cast…」: no such stage, as mf-1).
Credits 28643 → 28246 (−397): preview 「Body Swap」 Standard 30 s −120, template storyboard (quoted 37) −34, Scene 4
image regenerated −3, template preview −120, preview 「Borrowed Boyfriend」 (light) −120. No full video.
Dramas: 「Body Swap」 (dark, preview done, at the 60-sec offer), 「Borrowed Boyfriend」 (light, same), new template chat
「The Art of Falling」 (dark: outline, cast, storyboard, preview). The template chat again ended with 「The language is
already set to English.」 and no storyboard card; typing "Create storyboard" brought it (the assistant first claimed
「I have created the six-beat storyboard…」), and the settings card only after typing "Create video". Scene 4 image
failed on the server (`MiniDramaFail [TextToImage] generation_failed … error_code=4000`, no injection), blocking
Storyboard Preview as DRA262610P0111; Edit › Done › 「Regenerate Image」 (3 credits) fixed it. Settings prices: Best
180 / 540, Standard 120 / 360, Fast 60 / 180 (preview 30 s / full 90 s; 6 / 4 / 2 credits a second) against TC-080's
Standard 390 / 1170, Fast 120 / 360. No 「Get notified」 prompt (TC-081). 「Here's your drama.」 over an empty placeholder
for about 8 minutes while generating (TC-086). Each preview took about 11 minutes. Logs: logs/mf-2-20261104-192925/.

### 2026-11-04T11:35Z · check
Six watch captures of other boards (2566:114704, 2566:114761, 2824:130245, 2824:130307, 2824:130669, and 3949:74761
taken wrongly at a healthy format card) were taken off captures.jsonl: this pass covers 「main flow」 only.
36 main-flow captures checked (`design.ts … check 2026-11-04-design`): 9 state, 31 copy, 122 missing, 8 lines,
26 weight, 49 position, 29 colour, 4 control, 154 extra, 15 sample; 39 candidates from the app's view data
(`src: app`). Arrival in doubt: 2778:128850, 2778:129028, 2778:129078, 2778:139486, 2778:139548, 2778:139432,
2778:139610, 2778:139660, 2824:130900. Font scale put back to 1.1 after the walk.

### 2026-11-04T12:10Z · reviewed and settled
Builder and reviewer passes, three subagents each over 12 screens (the reviewer shown only the builder's visual item
ids, kinds and boxes); merged into design/builder.json and design/reviewer.json (group files builder-b1..b3,
reviewer-r1..r3 kept). `settle`: 269 agreed, 56 split → questions. findings.json: 90 bugs (19 major, 65 minor,
6 cosmetic), 161 ok, 14 n/a, 60 questions. Bugs by kind: weight 24, missing 22, position 21, visual 11, copy 9,
colour 2, lines 1. Main ones: 「More ideas」 chip missing at every stage that draws it; 「Thinking…」 for 「Drafting the
storyline...」; 「Ready to create your characters?」 for 「Choose your characters」 / 「Tap each character to choose their
look.」; preview-done offer 「Create the rest of the video (60 sec)」 for 「Create the full video · 90 sec」; 「Quality」
label missing on the settings card, 「Video length」 / 「Preview - 30 sec」 for 「Length」 / 「Preview · 30 sec」; user
bubbles 「Create storyboard」 and 「Standard · Preview - 30 sec」 for the Design's; offer questions outside their cards;
weights 700 for Semibold 590 (app view data). Model-selector frames (2778:127550, 2778:138663) judged ok: PM 10/16
replaced the selector with Quality. Keyboard-up captures 2778:139486 / 2778:139548: the page source held only the
keyboard window's texts, so their state / missing / colour candidates were judged measuring artefacts (a check issue
to look at). No eBugs drafted or filed. Next: the user's decisions on the Design tab (`design.ts … decide`).
Font scale restored to 1.1 (`adb shell settings get system font_scale` → 1.1).
