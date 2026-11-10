# Run state — R1 Full run of draft v2 on the S23

Table: library/phd/batch-editing/android/drafts/20261109-150747/draft.csv
Started: 2026-11-09T11:43:44.101Z

## Environment
(build, server, device, tier, credit balance, Pink toggles, Log stage timings, Write Log)

## Checkpoints

### 2026-11-10T01:03:22.423Z · next TC-023 (R1-b)
{"Pass":23,"Fail":2,"Blocked":10,"Not run":126}

R1-a done (26: 22 Pass, 2 Fail defect copy TC-012 toast / TC-018 「Adjustments」, 1 Blocked observability TC-152 deeplink unresolvable, plus init Blocked). Tier: was Free at segment start; set Premium via Settings › About backdoor 「Set to subscriber」 on, OK, relaunch; Mine shows 「Hello VIP!」. No other debug option changed. Credits 2000 (unchanged, nothing generated). Phone on Launcher, no photos in any room, nothing half-done. Logs pulled to logs/R1-a-20261110-090245 and sliced (feature.json logs.files regex escape fixed). Note: device-android hold takes seconds, not ms (O-3). Picker album now 「All」 (newest first: stand-ins ①–④ at the top).

### 2026-11-10T01:26:16.956Z · next TC-048 (R1-c)
{"Pass":54,"Fail":4,"Blocked":11,"Not run":92}

R1-b done (34: 31 Pass, 2 Fail: TC-037 defect no ‹ at the Crop & Rotate room's top left (R-050), TC-062 question one Undo after 3:2+All leaves photo 1's own 3:2; 1 Blocked TC-155 defect (no ‹ to tap)). Tier Premium (Mine 「Hello VIP!」 at segment start), credits 2000, nothing generated. Phone in Batch Edit Room with 3 photos (stand-ins ① ④ ③ from All, Casebook album not in the picker list; ① ② ③ ④ are the first four tiles of All) on the main screen, no edits applied (room ✕). Logs pulled to logs/R1-b-20261110-092551 and sliced; logcat capture restarted (pid 16568). Observations O-4 – O-6 added (size labels / 2560 px cap, lbl Discard taps the title: use tapif). Nothing half-done.

### 2026-11-10T02:18:30.418Z · next TC-069 (R1-d)
{"Pass":65,"Fail":8,"Blocked":11,"Not run":77}

R1-c done (15: 11 Pass, 4 Fail: TC-049 / TC-057 / TC-058 question, TC-060 defect; this resume: TC-059 Pass, TC-061 Pass). TC-059's 09:39 StackOverflowError crash triaged as an automation artifact (UiAutomator2 setval = accessibility ACTION_SET_TEXT; not reproduced by keyboard input with or without the session), O-9. Appium 4724 was restarted (stale after force-stopping the UiAutomator2 server; log %TEMP%\appium-4724.log), and device-android restart then dropped the batch into the single-photo Edit room (O-10); the stand-ins were picked again. Tier Premium (not changed; credits 2000 in the log, nothing generated). Phone in Batch Edit Room main screen with 4 photos (stand-ins ① ② ③ ④ from All tiles 5-8; tiles 1-4 are TC-060's saved squares), no edits applied (Crop room closed with ✕). Logs pulled to logs/R1-c-20261110-101757 and sliced; logcat capture still running. Nothing half-done.

### 2026-11-10T02:33:24.174Z · next TC-083 (R1-e)
{"Pass":79,"Fail":10,"Blocked":11,"Not run":61}

R1-d done (16: 14 Pass, 2 Fail: TC-076 question (no-change 「All」 makes an empty Undo step, then one Undo reverts the 11 others but photo 1 keeps its own edit, as TC-062), TC-079 defect (Undo switches the Light / Color / Details tab to the undone value's tab, R-104)). Segment kept the live UiAutomator2 session (no restart, to keep the batch; O-12). Batch re-picked with 12 photos (Launcher Edit › Batch, All tiles 1-12: stand-ins ① ② ③ ④ twice + 4 sticker sheets). Tier Premium (not changed, nothing generated, credits 2000 in the log). Phone on Batch Edit Room main screen, 12 photos, photo 1 current; main-screen history: one Adjustment step on photos 1-3, 5-12 (Exposure 0.48 + Saturation 46 etc. from TC-081's ✓), photo 4 undone (Redo available on photo 4). Not a clean 「no edit yet」 state: R1-e should re-pick or note it. Logs pulled to logs/R1-d-20261110-103242 and sliced (only CacheDao noise); logcat capture still running. O-11, O-12 added. Nothing half-done.

### 2026-11-10T06:42:17.661Z · next TC-113 (R1-f)
{"Pass":102,"Fail":15,"Blocked":11,"Not run":33}

R1-e done (36: 23 Pass, 5 Fail (TC-144 earlier, defect), 8 Blocked at init). This resume (2026-11-10 14:09–14:41, after a restart: Appium 4724 had died, the batch was lost): TC-094 Pass (20 photos 2 min 33 s, maxInFlight=1), TC-095 Pass (batch ≈ single Standard·Portrait by image diff; the log does not name the mode), TC-097 / TC-034 / TC-035 / TC-036 / TC-157 / TC-106 / TC-108 / TC-111 / TC-112 Pass; TC-100 / TC-142 Fail question (✕ and Back after a finished enhance open 「Discard changes?」 Keep / Discard; Discard drops the results; Q-19 / R-130); TC-110 Fail defect (Home 30 s: processing not paused, the app has no network in the background, UnknownHostException, every remaining photo failed 「Connection lost」; twice); TC-107 Fail defect copy (toast 「No Internet connection」, capital I). Observations O-13 (SocketTimeout upload failures on working Wi-Fi), O-14 (Retry Failed asks 「Enhance n photos?」, for TC-096), O-15 (device-android wifi USB check fixed for Windows adb), O-16 (Batch Save title 「Saved 3 photos」, for R1-f). Tier Premium (Mine 「Hello VIP!」), credits 2000 unchanged, Wi-Fi on and connected. Phone: Batch Edit Room main screen, 3 photos (All tiles 5–7: stand-ins ① ② ③ originals), all enhanced twice, photo 2 cropped Square; not a clean state: R1-f must re-pick 12 (All tiles 1–4 are TC-060's saved squares; DCIM/PhotoDirector also holds TC-112's 3 saved portraits from 14:21). Logs pulled to logs/R1-e-20261110-144154 and sliced; logcat capture running. Nothing half-done.

### 2026-11-10T07:07:37.846Z · next TC-156 (R1-g)
{"Pass":126,"Fail":19,"Blocked":11,"Not run":5}

R1-f done (28 run + TC-136 Blocked at init): 23 Pass, 4 Fail (TC-115 defect copy: Discard dialog button 「Keep」 not 「Keep Editing」; TC-145 defect: system Back does nothing on the open 「Discard changes?」 dialog, as TC-144; TC-122 defect: the dimmed top bar keeps the feedback (!) button while saving, otherwise the saving box, counter and lock are right; TC-128 question: title 「Saved 12 photos」 vs Design 「Save 12 photos」, Q-20). Back with no edit goes to the picker (TC-138), Back with edits asks and Discard leads to the picker (TC-139); kill from Recents is not restored (TC-121); Enhance alone counts as an edit (TC-120). Save is fast: 20 photos in about 4–6 s; continues through Back and Home; ‹ / Back on the Batch Save page keep the edits and Save again writes another full set (Q-14). Rate Us dialog after some batch saves (O-17, for TC-136). Tier Premium (Mine 「Hello VIP!」 at segment start), credits 2000 unchanged (all Enhance free), Wi-Fi on. Phone: Batch Edit Room main screen, 12 saved copies (photo 1 tape sheet cropped Square, all 12 enhanced), saved twice. pick12.steps tile positions are stale after the saves (O-18): R1-g should pick fresh. DCIM/PhotoDirector now 753 files (104 saved this segment). Logs pulled to logs/R1-f-20261110-150708 and sliced (no errors in the Fail windows); logcat capture running. Nothing half-done.

### 2026-11-10T07:17:10.317Z · all recorded
{"Pass":130,"Fail":20,"Blocked":11}

R1-g done (5: 4 Pass, 1 Fail): TC-156 Pass (20 photos one by one as Free, no IAP at any count, room opens with 20), TC-082 Pass (3:2 + All and Exposure + All as Free, no IAP, credits 2000), TC-098 Pass (Enhance as Free → Premium IAP page at once, no confirm), TC-099 Pass (IAP ✕ → back on the AI Enhance page, nothing enhanced), TC-135 Fail question (flyer on 1st batch save, interstitial on 2nd, but no native ad card on the Batch Save page unlike single Save & Share; O-19). Tier: subscriber off at start (Mine 「Upgrade to Premium!」), back ON at end, Mine 「Hello VIP!」 confirmed. Credits 2000 unchanged. Phone on the Launcher, no batch open. Logs pulled to logs/R1-g-20261110-151653 and sliced (only cache-deletion noise); logcat capture running. Nothing half-done. Phase R1 complete; wrap-up left to the orchestrator.
