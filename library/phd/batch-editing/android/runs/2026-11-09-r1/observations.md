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
