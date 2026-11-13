# On-device run (Android)

Part of the spec-casebook skill. Android runs follow every rule of `run.md`; only the device commands change. The
client is `node scripts/device-android.ts <run dir> <command>` (Appium + UiAutomator2 on the QA Sony Xperia 10 III,
adb serial HQ61563393, Android 12, 1080 × 2520; setup in README › Android phone setup).

- **Same commands, same files.** `start`, `restart`, `status`, `shot`, `els`, `texts`, `source`, `tap`, `hold`, `drag`,
  `burst`, `pinch`, `id`, `lbl`, `scrollto`, `type`, `hidekb`, `clear`, `setval`, `launch`, `terminate`, `waitfor`,
  `tapif`, `expect`, `expect-not`, `do <recipe.steps>` work as on iOS, write the same `.session` and `activity.log`
  stamps, and exit 75 with `BLOCKER (device): …` when the phone is unplugged, unauthorized or PIN-locked. Coordinates
  are **pixels** (the screenshot frame), not points. `els` prints `class | resource-id | text | content-desc | x,y,w,h |
  flags`; `id` takes a resource-id (short or `<pkg>:id/…`), `lbl` / `tapif` / `waitfor` match text or content-desc.
  PowerDirector's accessibility ids are content-descs starting `[AID]` (e.g. `[AID]IAP_Back`). Recipes go in
  `library/<product>/<feature>/android/recipes/`.
- **Drags taken as taps (2026-10-30, REQ-066).** `drag` (one Appium action) and `adb input swipe` reach some views as a
  tap: the AI Mini Drama description box opened its editor instead of scrolling. Use `fingerdrag X1 Y1 X2 Y2 [steps]`
  (adb `input motionevent` DOWN, moves ~100 ms apart, UP) for text that scrolls inside its own box, and before
  filing a 「drag does X」 bug retry it with `fingerdrag`. `setval` is setText, not a paste: it skips the field's
  paste limit, so an over-limit paste is checked by hand.
- **Judging a drag (user, 2026-11-12, video-enhance REQ-015).** A row whose Expected Result says something follows a
  gesture while it moves (the Preview shows the frame at the dragged handle, a bubble and the Preview time follow a
  knob) is judged from a recording of the whole gesture, never from one screenshot taken with the finger down: R1
  passed TC-042 / TC-214 / TC-216 / TC-215 that way while another tool's recording showed the Preview stuck on older
  frames mid-drag. `record start`, the drag (`fingerdrag` with enough steps to last 2–3 s, or several drags in one
  touch for the back-and-forth rows), `record stop <ID>-drag`, then sample frames on the computer
  (`ffmpeg -i recordings/<ID>-drag.mp4 -vf fps=4 recordings/<ID>-drag-%03d.png`) and compare, frame by frame, the
  time burned into the source video (the fixtures carry one) with the handle's or bubble's time. Record the largest
  gap and how long it lasted in Actual. Pass or Fail against the delay the row names; while the spec states none
  (an Open question), a visible lag is recorded with the numbers and filed to PM for a decision.
- **New messages below the screen (user, 2026-11-06, REQ-107).** The AI Mini Drama chat pins the sent message to the
  top and lets the reply and its cards grow below it without following (R-250, R-485; ↓ R-088, R-274), so a new card
  or its lower lines can be off screen and missing from the page source. Every wait or check for something new in a
  chat taps ↓ first: `waitfor "…" --bottom` (taps ↓ each round it shows), `expect "…" --bottom`, or `bottom` on its
  own (seen on 2611061: `button_mini_drama_scroll_bottom`, no content-desc). Leave `--bottom` off only in the rows
  that test the scrolling itself (R-088, R-250, R-274, R-279, R-457, R-485), where tapping ↓ is a step of the case.
- **One Appium server (user, 2026-11-12).** `start` / `restart` start the shared Android server (port 4724) only when
  no server exists on that port, detached so it outlives the segment, on macOS and Windows (`lib/appium-server.ts`:
  a busy server is waited for, a held port is never given a second server, a lock stops two segments starting it at
  once). Never start `appium` by hand or put it in a run plan: a server started in an agent's background shell dies
  with that agent and the next segment starts another. `status` prints `Appium servers: …` and warns when a port
  has more than one; report that to the user rather than killing one.
- **iOS rule → Android command.** Segment start: `restart` (fresh UiAutomator2 server, PowerDirector in front). Keep
  the phone awake: the user turns on Developer options › Stay awake (or the longest Screen timeout) and uses no PIN
  lock. Rows in a list: `scrollto` (it also prints a row's switch state, `| row Switch on at X,Y`). Pages opened as
  fragments leave the previous page in the source; `els`, `texts`, `waitfor` and `scrollto` drop covered subtrees,
  `source` stays raw. Wi-Fi for offline cases: `wifi off|on|status` (refuses unless adb sees the phone over USB). App
  language (user, 2026-10-30, REQ-063): `launch --lang en|zh-Hant|ja|fr` runs the app in that language, as on iOS:
  per-app language on Android 13+, and on this Android 12 phone the system locale switched by the Appium Settings
  helper (`io.appium.settings`) without the Settings UI. The original is saved in `<run dir>/.locale-orig`; a plain
  `launch` or `locale reset` restores it (`locale status` shows it), so end every language case with one. Language
  cases run, never Blocked for the language. `appearance`, `pink …`, `ledger` and `install-wda` have no Android version
  yet. `back` is system Back, a spec exit path: test it wherever a page can be left. `home` presses Home; `activate`
  returns PowerDirector to the front without restarting it (use it after Home: `launch` force-stops the app first,
  2026-10-29). `build` prints versionName / versionCode (the run's build check).
- **Logs (run step 7 on Android).** The app logs to logcat (tags such as `CreditSystemManager`, `SplashActivity`); its
  files are not readable over adb and the phone keeps only ~1 MB of logcat, so `logcat start` at every segment start
  (background capture of the app's uid into `<run dir>/logs/.live/`) and `pull-logs <segment>` at the segment end,
  before a reinstall and before a hand-off (into `logs/<segment>-<time>/logcat-live.txt` plus a ring-buffer dump).
  Logs hold server keys: they stay in the git-ignored `logs/`, eBugs cite excerpts only.
- **Debug controls (rechecked on 16.8.0 build 2610212, 2026-10-27).** No Pink, fault switches, tier switch, Write Log or
  developer-server switch. The Launcher ☰ › Menu ends with a QA block (download all contents, scoped-storage
  migration, 「QA: consume all non-consumables」, 「QA: show all subscription plans」, 「QA: purchase SKU test」,
  region): never tap the consume or purchase rows. Fault rows stay Blocked `--as observability` until fault switches
  ship (planned for a later build, user 2026-10-28; recheck each new build and update this paragraph); failure cases
  otherwise need real failures (network loss). The tier comes from the signed-in account. Builds come from the TR's
  OneDrive folder (`CL_Deluxe.<build>_<SR>_R9.zip`, APK + `Cyberlink.MD5`), installed with `adb install -r`; the agent
  downloads the TR's build without asking (user, 2026-11-05; `fixtures.md`).
  Fully automated, no popup (user, 2026-11-05): never click Download in OneDrive inside the browser pane (the app asks
  the user to approve every pane download, and the transfer stalled). Open the TR's 「OneDrive Shared Link」 in the
  pane (the user signs in once), then in the page run `fetch('/personal/sr_auto_cyberlink_com/_api/v2.0/shares/u!' +
  base64url(link) + '/driveItem/children?select=name,size,file,@content.downloadUrl')` and `curl -L` the zip's
  short-lived `@content.downloadUrl` into `~/.casebook/android/apks/<build>/` (outside the repo; the URL carries a
  temporary token, never commit or paste it). Check the size against `size`, then the APK's MD5.
- **PhotoDirector Free / Premium without a sign-in (user, 2026-11-09 / 11-12, KP-131, phd/swipe-collage REQ-010).**
  A PHD Android run never stops for the user to sign in Premium, and a run plan never lists that as a user step. The
  agent switches the tier itself: Launcher gear (top right, `topToolBarSettingBtn`) › About › tap repeatedly just
  below 「‹」 until the debug dialog opens › 「Set to subscriber」 ON (Premium, paid user) or OFF (Free) › OK ›
  relaunch. Check Mine: 「Hello VIP!」 = Premium, 「Upgrade to Premium!」 = Free (credits unchanged); screenshot it
  and record the tier in the checkpoint. Free rows turn it OFF instead of signing out. Change no other option in that
  dialog (KP-106).
- **Debug info and session export (user, 2026-11-03, REQ-068).** AI Mini Drama has a Pink-like switch: on the 「Hi I'm
  your AI Drama Assistant」 page, keep tapping the top row with two fingers between Back and the credit icon until the
  toast 「Tap for debug info: ON」; the Create Your Drama page's top bar then turns yellow (like Stage). Tapping the top
  of a chat box (Storyboard Result, Story Outline…) opens a menu whose download button exports the session; the
  popup asks whether to include media (bigger file), EXPORT shows a toast with the path (default under Download).
  This is how to get a session's `blueprint.json` (the app's private files are not readable over adb). Scripted
  (2026-11-03): `debug-info on|off` (from the assistant page; reads the toast), `debug-export [OUT] [--media]` (from a
  drama chat; pulls the zip the toast names into OUT, default `<run dir>/exports/`), and the recipe
  `do library/pdr/ai-mini-drama/android/recipes/export-session.steps "<History title>" [OUT]` (assistant page →
  drama → export). The zip holds `blueprint.json`, `blueprint_versions/V*.json`, `host_inputs/`, `engine_events/`,
  `chat_history.json`, `perf/`; attach it (or its blueprint) to the eBug batch folder. Export without media unless
  the media is needed.
  Debug info stays off in test runs unless a case needs it. Export a finding's session when the finding is made,
  before any reinstall or `pm clear`: both wipe History (the A7 blueprints for DRA262610P0420 / P0421 were lost to
  the A7-j reinstalls, 2026-11-03).
- **Server: Stage vs Production (user, 2026-10-28).** An empty `testserver.config` in `/sdcard/cyberlink/PDR/` means
  Stage at the next launch, absent means Production (`/sdcard/cyberlink/tester.config` holds the SR code and is not
  the switch). A fresh install keeps the file (shared storage); if it is missing the app comes up on Production with
  no templates: `adb shell mv` (or `cp`) it into `PDR/`, force-stop and relaunch. Put it in place **before the first
  launch** of a fresh install: a first launch on Production creates the credit ID there and Stage then rejects every
  signed-out turn (`403 "Fail to verify uuid"`); `adb shell pm clear <package>` makes a new ID on Stage. On Stage the
  Launcher's **top bar is yellow**, on Production dark: confirm it at every segment start and after every (re)install;
  don't rely on the `[AID]…_Server` content-desc.
