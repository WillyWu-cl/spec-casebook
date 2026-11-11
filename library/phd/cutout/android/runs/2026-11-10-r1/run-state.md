# Run state — R1 Full run of the draft on the S23

Table: library/phd/cutout/android/drafts/20261110-163734/draft.csv
Started: 2026-11-10T09:20:26.320Z

## Environment
(build, server, device, tier, credit balance, Pink toggles, Log stage timings, Write Log)

## Checkpoints

### 2026-11-10T09:38:16.261Z · next TC-026 (R1-b)
{"Pass":22,"Fail":4,"Not run":25}

R1-a done (26/26: 22 Pass incl. 3 Pass-question, 4 Fail defect TC-011/016/024/051). Tier Premium (Hello VIP!), Test Server, build 20.19.0 (90201900). Phone left in the Cutout room on sample photo 1 (three women) with 5 steps applied (white bg, white-style stroke orange 19, rotated ~25°); next segment should ✕ and re-enter for a clean room. Logs pulled to logs/R1-a-20261110-173739 and sliced; no crash or exception behind the Fails (only CacheDao cache-miss noise). One Trending template (first, grey room with plant) is now downloaded. Tools: two-finger rotate via W3C actions works (scratch script: POST /session/<sid>/actions with two touch pointers); colour-swatch rows scroll after a pick, read select_item_view before tapping.

### 2026-11-10T09:48:26.813Z · next TC-040 (R1-c)
{"Pass":34,"Fail":6,"Not run":11}

R1-b done (14/14: 12 Pass, 2 Fail defect TC-035/TC-038: the edit-cutout-page round trip (pencil › brush › ✓) is recorded as its own room step, so Undo enables after it and needs an extra Undo to revert an earlier step). Tier not re-read this segment (Premium at R1-a; Test Server label on canvas). Phone left in the Cutout room on sample photo 1 with history: White, edited cutout (patch above the heads), Undo/Reset enabled; next segment should ✕ and re-enter for a clean room. Logs pulled to logs/R1-b-20261110-174803 and sliced: no crash/exception behind the Fails, only GPUImageViewer 'updateGPUImageExporter failed' / 'updateGPUImageView failed' noise during edit-page brushing. TC-029: the stroke change was a stroke style pick (colours appear only after a style, O-3). Logcat capture still running.

### 2026-11-10T10:03:16.477Z · all recorded
{"Pass":42,"Fail":9}

R1-c done (11/11: 8 Pass incl. 4 Pass-question (✕ / ✓ / re-entry / Back go through the Edit room, no Cutout page on 20.19.0), 3 Fail defect: TC-044/TC-045 Undo during a template download undoes the previous step and the template is applied anyway when the download ends; TC-049 system Back with the colour palette open closes the whole room (doFragmentPopBackStack)). Phase R1 complete: 42 Pass, 9 Fail. Tier not re-read (Premium at R1-a; Test Server label). Phone left on the PhotoDirector Launcher, nothing open (Edit room changes discarded). Logs R1-c-20261110-180235 pulled and sliced; logcat capture stopped. TC-046 steps 5–60 were sent with adb input (not in taps.jsonl).
