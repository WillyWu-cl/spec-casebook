# Batch Editing quirks seen in runs

## KF-001 「Rate Us」 dialog after some batch saves
- kind: quirk · platform: android · use: run · tags: save, rate-us, dialog
- source: run 2026-11-09-r1 O-8, O-17 (batch-editing only so far) · verified: 20.19.0 (90201900) (2026-11-10)

「Your photo looks perfect! Enjoying PhotoDirector?」 (「Not Now」 / 「Totally!」) can come up on the Batch Save page
after a batch save: after the 1st save of R1-c, and after the 2nd and 5th of six in R1-f. It looks counted per
save, not per photo; the trigger count is unknown (RD). Tap 「Not Now」 and carry on.

## KF-002 Batch Save adds saved copies to the top of the picker
- kind: quirk · platform: android · use: run · tags: picker, save, recipes
- source: run 2026-11-09-r1 O-18 · verified: 20.19.0 (90201900) (2026-11-10)

Every batch save puts its photos first in the picker's 「All」 grid, so fixed tile positions (recipes such as
`pick12.steps`) pick saved copies after a save. Pick from the 「Casebook」 album or re-read the grid. A screenshot
written to /sdcard is media-scanned and shows in 「All」 too.

## KF-003 Adjustment slider scales (Batch Edit Room)
- kind: howto · platform: android · use: run · tags: adjustment, slider
- source: run 2026-11-09-r1 O-12 · verified: 20.19.0 (90201900) (2026-11-10)

Exposure is EV: progress 0–880, label −4.0 … +4.0, non-linear (528 = 「0.48」, 572 = 「0.92」). Contrast / Saturation
0–220 with a dead zone round the centre (above it label = progress − 120). Sharpness 0–100 linear; HSL Hue 0–220
(140 = 「(20)」). A thumb drag makes one Undo step per finger-up.
