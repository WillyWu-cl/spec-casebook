# Observations — design pass 「main flow」, Android, 16.8.0 (2611021) debuggable, 2026-11-04

These came up while walking rows for design captures. They are not results recorded for the casebook. They are for the
next casebook round on this build and for the domain-knowledge inbox. None was filed.

- **O-1 Template chats never offer the storyboard card (TC-044 template branch, TC-236).** This happened in three
  template chats. In Dark, the follow-up turn failed only in logcat ("HTTP request to cc team gateway failed: Could
  not establish connection", 18:08:40) and the app showed nothing. In Light and in 「The Art of Falling」, the chat
  ended with 「The language is already set to English.」 and no card. Typing "Create storyboard" brought the card,
  but the assistant first said 「I have created the six-beat storyboard…」 before any storyboard existed. The settings
  card came only after typing "Create video". This may be DRA262610P0268 (same OS); check it before any filing.
- **O-2 Credits: an unexplained −84.** Storyboard 1 (dark custom chat) was quoted 32. The balance dropped 84 at
  18:05:17 and then 32 in small steps. Mine › Credits › Details was not checked. The account is shared, so another
  client may have taken it.
- **O-3 Video prices differ from TC-080.**

  | Quality | Preview 30 sec | Full 90 sec |
  |---|---|---|
  | Best | 180 | 540 |
  | Standard | 120 | 360 |
  | Fast | 60 | 180 |

  That is 6, 4 and 2 credits a second. The row expects Standard 390 / 1170 and Fast 120 / 360.
- **O-4 No 「Get notified」 prompt** appeared during either preview-video generation (TC-081).
- **O-5 「Here's your drama.」 over an empty placeholder.** It showed for about 8 minutes while the video was still
  generating, with the toast 「Preview is unavailable while your videos are being generated.」 The offer afterwards is
  the 60-sec 「rest of the video」, not the 90-sec full episode (TC-086).
- **O-6 Server failures, no injection.**
  - The first custom outline failed with 「Something went wrong on my end…」 (server 502, "upstream provider
    error"); 「Try again」 worked.
  - A Scene 4 image failed (`MiniDramaFail [TextToImage] generation_failed … error_code=4000`) and blocked Storyboard
    Preview, as DRA262610P0111 describes. Edit › Done › 「Regenerate Image」 (3 credits) fixed it.
- **O-7 No 「Building the cast」 stage.** The loading goes 「Thinking…」, then 「Processing the mini drama project with
  selected video settings.」, then the outline with its characters at once. The storyboard loading text varies between
  runs (「Preparing shots for the storyboard.」, then 「Creating your scene…」).
- **O-8 「Good news! Your "…" is ready」 banner.** After leaving a chat that is still generating, a banner (View /
  Close) appears over the Launcher; once it swallowed taps on ☰.
- **O-9 Other.**
  - In Choose Character, the tooltip 「Tap to choose a look for <name>」 covers the title for about a second after a
    pick.
  - Back from the ☰ Menu once opened the PowerDirector Pro page (closed with its 「<」).
  - In the app's Light mode, the Samsung keyboard and the system nav bar stay dark.
  - Each preview video took about 11 minutes; the build is debuggable, so this timing does not count.
- **O-10 History lost the old full-video dramas.** The reinstall left History empty (no 「Memory Drift」), so no
  full-video result screen can be captured until a full video is generated with the user's go-ahead.
- **O-11 Design check tooling.** On the keyboard-up captures 2778:139486 and 2778:139548 (light), the page source held
  only the keyboard window's texts. Both review passes set the state, missing and colour candidates aside as
  measuring artefacts. The multi-window read in `device-android.ts design` should keep the app window's texts.
