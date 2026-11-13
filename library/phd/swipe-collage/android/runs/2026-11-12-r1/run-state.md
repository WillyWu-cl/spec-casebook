# Run state — R1 Full run of v3 (first run of the table)

Table: library/phd/swipe-collage/android/cases.csv
Started: 2026-11-12T02:19:40.936Z

## Environment
(build, server, device, tier, credit balance, Pink toggles, Log stage timings, Write Log)

## Checkpoints

### 2026-11-12T02:48:01.710Z · next TC-026 (R1-b)
{"Fail":14,"Pass":17,"Blocked":6,"Not run":150}

R1-a done 10:47. Build 20.19.0 (90201900), fresh install 10:28 by the user; Test Server labels; O-1 crash not reproduced. Account Free / signed out (Mine 「Upgrade to Premium!」), credits 0 at 10:30, 300 at 10:47 (giveaway_monthly). Phone dark theme. App on the Launcher (Home), no project open (canvases discarded). Logcat capture running since 10:30 (logs/.live); last pull logs/R1-a-20261112-104702, sliced. Template thumbnails / previews blank (TC-011); picker limit = empty frames on the current page (TC-045/046); first tap on a frame + only selects it (O-5). Premium needed from R1-c.

### 2026-11-12T03:28:13.360Z · next TC-073 (R1-c)
{"Fail":25,"Pass":37,"Blocked":6,"Not run":119}

R1-b done 11:28. Build 20.19.0 (90201900), Test Server labels, Free / signed out (credit pill 「--」; nothing charged in R1-b). Phone dark theme, app on the Launcher (Home), canvas discarded. Appium: the 4724 server could not see the phone; R1-b ran on a second Appium at 127.0.0.1:4725 (set APPIUM_ANDROID_URL=http://127.0.0.1:4725; start it with node …/appium/index.js --address 127.0.0.1 --port 4725 and ANDROID_HOME set; device-android.ts cannot spawn appium on Windows). Logcat capture still running (logs/.live); last pull logs/R1-b-20261112-112721, sliced. TC-031 re-run (old screenshots r1b-tc031-* not used). Frame focus has no Flip H/V or Shadow (TC-054/055); text content can't be edited (TC-029); no swap hint (TC-069). Next R1-c needs the user's Premium sign-in.

### 2026-11-12T03:54:43.812Z · next TC-090 (R1-d)
{"Fail":33,"Pass":48,"Blocked":12,"Not run":94}

R1-c done 11:54. Build 20.19.0 (90201900), Test Server labels. Tier PREMIUM via Debug settings 「Set to subscriber」 ON (agent, 11:30; Mine 「Hello VIP!」) — left ON for R1-d – R1-f; turn it OFF for R1-g (Free rows) instead of signing out. Credits 2294 at 11:54 (log getMemberCreditRemain; 2300 at 11:30; one Advanced Enhance −6, Standard Enhance free; no Removal run: 「Removal」 on the image bar opens nothing, TC-064). Canvas credit button reads 「--」 and is inert (O-12). Phone dark theme; app on the Launcher (Home), canvas discarded. Appium 127.0.0.1:4726 (orchestrator's). Logcat capture still running (logs/.live); last pull logs/R1-c-20261112-115415, sliced (nothing behind the Removal / image-lock Fails). Frame style switch = frame focus › 「Replace」 › 「Frame」 sheet; image 「Lock」 does nothing (TC-085, 086–088 Blocked).

### 2026-11-12T04:17:05.151Z · next TC-114 (R1-e)
{"Fail":49,"Pass":61,"Blocked":12,"Not run":65}

R1-d done 12:16. Build 20.19.0 (90201900), Test Server labels. Tier PREMIUM (Debug settings 「Set to subscriber」 still ON, Mine 「Hello VIP!」 at 11:56 and 12:16) — leave ON for R1-e / R1-f. Credits 2294 at 11:56 and 12:16 (nothing charged in R1-d). Phone dark theme; app on the Launcher (Home), canvas discarded. Appium 127.0.0.1:4726 (orchestrator's). Logcat capture still running (logs/.live); last pull logs/R1-d-20261112-121644, sliced (no errors behind any Fail). No ✓ on any canvas sheet (Background, Layers, Sticker, Text Bubble; Frame sheet closes itself on tap); Add Layer › Text has no editor/keyboard; eyedropper pin cannot be moved (TC-095, O-14). Tool notes: a tap right after a sheet opens may be ignored; device type with no focused field can act as Back (O-16).

### 2026-11-12T04:33:53.505Z · next TC-136 (R1-f)
{"Fail":61,"Pass":72,"Blocked":14,"Not run":40}

R1-e done 12:34. Build 20.19.0 (90201900), Test Server labels. Tier PREMIUM (Debug settings 「Set to subscriber」 still ON, Mine 「Hello VIP!」 at 12:19 and 12:33) — leave ON for R1-f. Credits 2294 at 12:19 and 12:33 (nothing charged in R1-e). Phone dark theme; app on the Launcher (Home), canvas discarded. Appium 127.0.0.1:4726 (orchestrator's). Logcat capture still running (logs/.live); last pull logs/R1-e-20261112-123324, sliced (0 failures, no errors behind the Fails). TC-116 exported once: the Canvas export icon (top right, export_btn) opens Save & Share and saves every page at once (DCIM/PhotoDirector/2026-11-12-12-31-31-566_collage_1-4.jpg, 1080x1440) — R1-f should expect files written before any Save tap. Ratio = bottom sheet with ✕ only, 7 fixed ratios (no Custom/Original/3:2), tap applies and closes; Pages = strip mode with ‹ exit, Add / Insert Left / Insert Right / Delete, no stepper / ✓ / ✕ / Discard dialog, ↶ works. Tool notes: long-press drag of a page pill = adb shell input motionevent DOWN, sleep 1.2, MOVEs, UP; a frame + needs two taps (select, then open picker).

### 2026-11-12T04:57:48.467Z · next TC-025 (R1-g)
{"Fail":68,"Pass":84,"Blocked":14,"Not run":21}

R1-f done 12:57. Build 20.19.0 (90201900), Test Server labels. Tier PREMIUM (Debug settings 「Set to subscriber」 still ON; Mine 「Hello VIP!」 at 12:35 and 12:57) — R1-g must turn it OFF (Free rows). Credits 2294 at 12:35 and 12:57 (nothing charged in R1-f; Removal on the image bar still opens nothing). Settings › Image Quality back on HD (was HD; set Efficient / Maximum for TC-139, restored and checked). Camera permission granted (While using the app) when Image Quality Settings first opened. Phone dark theme; app on the Launcher (Home), canvases discarded. Appium 127.0.0.1:4726 (orchestrator's). Logcat capture still running (logs/.live); last pull logs/R1-f-20261112-125724, sliced (only CacheDao/IME noise; nothing behind the Fails). DCIM/PhotoDirector holds the R1-f exports 12:39–12:56 (each Save & Share opening writes every page, O-20). Tool notes: never use activate after a share target (it clears the task to the Launcher, O-21) — use system Back; lbl "HD (Long" also matches Ultra HD, tap HD by position; lbl Discard hits the dialog title, use id right_button.

### 2026-11-12T08:10:47.542Z · next TC-036 (R1-h)
{"Fail":75,"Pass":86,"Blocked":19,"Not run":7}

R1-g done 16:10 (resumed 16:02 after the first R1-g subagent's 14:09 pm clear; 14 rows: 2 Pass, 7 Fail defect, 5 Blocked defect). Build 20.19.0 (90201900). After pm clear: Free / signed out (Mine 「Upgrade to Premium!」, 0 credits; Set to subscriber reset OFF), first-launch screens done (Get Started, Notify, Allow, NEXT×5, Let's go, IAP closed, New Content closed, photos Allow all). Mine's Test Server overlay not seen; Collage templates load (O-25). Exports on Free: 4 one-page + 2 ten-page + 1 one-page (16:06–16:09), never an IAP page (TC-145/146 Fail); free template opens blank after the clear (O-24). No pre-clear log pull was made: the PC's live capture logs/.live/logcat-20261112-125725.txt ran 12:57–14:11 and covers the clear; copied to logs/R1-g-preclear-20261112-141100 and sliced. New capture logs/.live/logcat-20261112-160247.txt; pulled logs/R1-g-20261112-161010, sliced (no errors). Phone dark theme; app on the Launcher, canvas discarded; local projects/settings wiped by the clear (Image Quality default). Appium 127.0.0.1:4726. Next R1-h (TC-036–039, 018, 186, 187) on any tier.

### 2026-11-12T08:25:31.157Z · all recorded
{"Fail":76,"Pass":89,"Blocked":22}

R1-h done 16:25 (7 rows: 3 Pass, 1 Fail defect, 3 Blocked defect). Build 20.19.0 (90201900). Free / signed out (Mine 「Upgrade to Premium!」, 0 credits at 16:11; nothing charged). Force-stop restore: Swipe Collage offers no 「Continue editing?」 at launch, Collage room or Template Page (TC-036 Fail; 037/038 Blocked); Edit Room's restore dialog appears and keeps reappearing after Cancel (O-28). Every template still opens blank after the pm clear and Add Layer › Frame says No connection on a working Wi-Fi (O-26). TC-018 Blocked (thumbnails never render, TC-011); Swipe Collage strings untranslated (O-27). Dark/light walked (TC-186/187 Pass). Phone theme restored to dark (cmd uimode night yes, read back). App language: plain launch, system locale en-US, app in English. App on the Launcher, canvases discarded. Appium 127.0.0.1:4726. Logcat capture running; pulled logs/R1-h-20261112-162459, sliced (nothing behind the Fail / Blocked). All rows recorded: R1 phase ready for its wrap-up.

### 2026-11-12T08:52:30.892Z · all recorded
{"Fail":76,"Pass":89,"Blocked":22}

R1 phase done
