# Observations — R1 (draft v2, S23)

- O-1 (R1-a, near TC-008 / TC-013; for R1-f) System Back from Batch Edit Room with no edit returned straight to the
  Photo Picker on 「Batch」 with the same selection still numbered (「(3/20)」, 「(20/20)」); no leave dialog. A second
  Back / ‹ left to the Launcher. Evidence: screenshots/leave-room.png.
- O-2 (R1-a, near TC-015) Single-photo AI Enhance opened from the 「AI Enhance」 shortcut: ✕ led to the single-photo
  Edit Room (Enhance tab), not back to the picker. Evidence: screenshots/after-x.png.
- O-3 (R1-a, tooling) `device-android.ts hold X Y [s]` takes seconds; `hold 540 700 1200` held a finger down for
  20 min and swallowed every later tap (Batch toggle and ‹ looked dead) until `restart`. Not an app issue; TC-004 was
  redone with `hold … 1.2`.
- O-4 (R1-b, TC-043; for R1-c) Square chosen by hand on photo 4 (1080 × 2340 screenshot) shows 「1077 x 1076」 in the
  room's size label, not 1080 x 1080 (not square, not the full width). Check the saved file in R1-c / R1-f.
  Evidence: screenshots/tc043-p4sq.png.
- O-5 (R1-b, TC-030 / TC-040 / TC-047; for R1-c) Size labels: Square chosen by hand on photo 1 (1688 wide) shows
  「1688 x 1685」; 3:2 chosen by hand on photo 2 (1920 x 2560) shows 「1920 x 1276」 while 3:2 reached through 「All」 on
  the same photo shows 「1920 x 1280」. Every photo the room loads seems capped at a 2560 px long side (1920 x 2560,
  1588 x 2560, 1438 x 2560; the 2730 x 1535 stand-in ④ behaves as 2560 x 1439), so R1-c's output-size rows should
  read ④ against 2560, or check the saved file. Evidence: tc030-before.png, tc040-p2.png, tc047-p2.png.
- O-6 (R1-b, tooling) `lbl Discard` taps the dialog title 「Discard changes?」 (first match), not the button; use
  `tapif Discard` (exact match) on the leave dialog.
- O-7 (R1-c, TC-056) Stand-in ④ (held as 2560 × 1439 by the room) reads 「2554 x 1435」 after 3:2 via 「All」 and then
  「Original」 via 「All」, though the box covers the whole photo; ①②③ return to their exact sizes. Likely a rounding
  loss through the 2560 cap; check ④'s saved size whenever it is saved with Original. Evidence: tc056-p4.png.
- O-8 (R1-c, TC-060; for R1-f TC-136) The first batch Save of this run (4 photos) showed the 「Rate Us」 dialog
  (「Your photo looks perfect! Enjoying PhotoDirector?」 「Not Now」 / 「Totally!」) before the Batch Save page; tapped
  「Not Now」. Earlier saves on this phone may count toward its trigger. Saved files kept locally in
  screenshots/saved-tc060/ (① 1706×1706, ② 1576×1576, ③ 800×800, ④ 1434×1435). Evidence: tc060-save.png.
- O-9 (R1-c, TC-059; crash triage) At 09:39:17 the app crashed (java.lang.StackOverflowError) while TC-059's values
  were set with UiAutomator2 `setval` (editWidth 1000, then editHeight 500, aspect link on). The trace
  (screenshots/tc059-crash1.txt, ~13 k frames) starts at `TextView.performAccessibilityActionInternal`
  (ACTION_SET_TEXT from the automation) and then loops between the two fields' TextWatchers (`rm3.onTextChanged` →
  `tm3.a` / `tm3.b` → `EditText.setText` on the other field → …) until the stack overflows; the
  AccessibilityEvent frames at the top are only where it ran out. Check: the same values typed through the keyboard
  path (`adb shell input tap` + `input text`, link on, 1000 then 500) with UiAutomator2 force-stopped and no
  accessibility service bound gave 889 x 500 with no crash (tc059-adb-h.png); again with the session running, no
  crash (tc059-a11y-kb.png). Verdict: automation artifact, not counted as a defect. For RD's information only: the
  linked Width / Height watchers have no re-entry guard against a programmatic setText (an accessibility service
  setting the text, e.g. a voice-access or autofill tool, could reach the same loop); not tried with TalkBack.
- O-10 (R1-c, tooling) After `adb force-stop` of the UiAutomator2 server, Appium 4724 answered /status but every new
  session failed "Could not find a connected Android device"; Appium was restarted (log %TEMP%\appium-4724.log).
  The following `device-android.ts restart` brought the app to the front by launching it, which replaced the Batch
  Edit Room with the single-photo Edit room (EditViewActivity on ④): the unsaved batch was lost and the four
  stand-ins were picked again. Type into fields with `adb shell input text` (keyboard path) instead of `setval` in
  the Custom resolution dialog; the keyboard moves the dialog up (Height field at 880,722 px, OK at 953,867).
- O-11 (R1-d, TC-075 / TC-076) A 「All」 tap with no change (every photo already carries the current photo's set)
  still makes its own step in the room's Undo history: the next Undo changed nothing on any photo, and a second Undo
  was needed to take back the previous Apply to all. Spec silent (R-051 / R-091 one-shot, R-098 history); PM call
  whether a no-op Apply to all should record a step. Evidence: tc075-all.png.png, tc076-undo1.png.png, tc076-undo2.png.png.
- O-12 (R1-d, tooling) Adjustment sliders on 20.19.0: Exposure is EV, progress 0–880, label −4.0 … +4.0 non-linear
  (progress 528 = 「0.48」, 572 = 「0.92」); Contrast / Saturation progress 0–220 with a dead zone round the centre
  (label = progress − 120 above it: 130 = 「10」); Sharpness 0–100 linear; HSL Hue 0–220 (140 = 「(20)」). Table
  values like 「+20」 were set as progress steps; thumb drags with `fingerdrag` on the track (x 82–836, y 1725) make
  one history step per finger-up. Thumbnail changes were measured by mean RGB of each strip tile (room strip y 1506,
  or 960 with a Color panel open; main strip y 1799). R1-d kept the live UiAutomator2 session (0.1 h old) instead of
  `restart`, which had dropped the batch in R1-c (O-10); 12 photos re-picked (All tiles 1–12).
- O-13 (R1-e, TC-092 / TC-094) Batch AI Enhance photos fail as 「Connection lost. Check your connection and retry.」 on a
  working Wi-Fi when one upload to the S3 accelerate host hangs: logcat `executeWithAuthRetry: … uploadFile,
  java.net.SocketTimeoutException: timeout` (30 s) then `BatchEditRunner: image N failed: NETWORK_ERROR`. Seen at
  10:42 (2 of 12, images 480/481) and 14:13 (1 of 20, image 515); 「Retry Failed (n)」 then succeeded each time. The
  runner works one photo at a time (`batch of 20 (maxInFlight=1) took 150637 ms`). Likely network / Test Server;
  watch whether it repeats on other networks before calling it a defect. Evidence: tc092-done.png, tc094-done.png.
- O-14 (R1-e, for TC-096 Blocked) 「Retry Failed (n)」 asks first: the Confirm Dialog reads 「Enhance 7 photos?」 for
  7 failed photos of 12 (TC-110's retry) and 「Enhance 2 photos?」 earlier: N counts only the failed photos, as
  TC-096 expects; the photos then process as 「Enhancing k / n」. Evidence: tc110-retry.png.
- O-15 (R1-e, tooling) `device-android.ts wifi off` refused on Windows: `adb devices -l` there prints no `usb:` field,
  so the USB check failed (「adb does not see RFCW2198L7B over USB」). Fixed: a serial with no host:port and no mDNS
  `adb-…` name counts as wired. TC-106's first attempt ran to the end online because of it and was redone.
- O-16 (R1-e, for R1-f TC-128) The Batch Save page title after saving 3 photos reads 「Saved 3 photos」, not the
  spec's 「Save 12 photos」 form; check against the Design in R1-f. Evidence: tc112-saved.png.
- O-17 (R1-f, for TC-136 Blocked) The 「Rate Us」 dialog (「Your photo looks perfect! Enjoying PhotoDirector?」 Not Now /
  Totally!) came up on the Batch Save page after the 2nd batch save of the segment (TC-131, 20 photos) and again after
  the 5th (TC-128, 12 photos), not after the 1st, 4th or 6th; Not Now each time. Six batch saves (20, 20, 20, 20, 12,
  12 photos) in 8 min, after earlier single saves in R1-c / R1-e: the trigger looks per save, not per photo, but the
  count is unknown (TC-136 still needs RD's number). Evidence: tc131-save2.png.
- O-18 (R1-f, tooling) Every batch save adds its photos at the top of the picker's 「All」 grid, so fixed tile positions
  move: `recipes/pick12.steps` assumed All tiles 8–11 were the stand-in originals, which held until the first save at
  14:59; after it, 12 saved copies were picked instead (TC-127 – TC-148 ran on saved copies, photo 1 a tape sheet,
  1077 x 1076 after Square). `recipes/crop1-square.steps` now expects only 「Square」 selected. Pick from the
  「Casebook」 album, or re-read the grid, before reusing pick12. A `screencap` to /sdcard/s.png (TC-124 evidence) was
  picked up by the media scanner and showed in the batch as photo 5; the file was removed afterwards. Saves this
  segment: DCIM/PhotoDirector 649 → 753 files (104 new: four 20-photo and two 12-photo sets).
- O-19 (R1-g, TC-135, PM question) As Free, a batch save shows the IAP flyer (1st save) and a full-screen interstitial
  (2nd save, a few seconds after the Batch Save page), but the Batch Save page has no native ad card, while the single
  「Save & Share」 page carries one under 「Share to」 (the Test Server overlay names it 「PhDA_save page_native」). Neither
  PM nor the Design draws an ad slot on the Batch Save page; R-158 says ads appear as usual. New open question for PM.
  Tier switched Free at 15:05 and back to Premium at 15:16 (Mine 「Hello VIP!」); credits 2000 throughout. Saves:
  DCIM/PhotoDirector 753 → 764 (two 5-photo batches, one single).
