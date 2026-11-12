# Run state — R2 Round 2: rows v5 added or changed (REQ-011) on the SM-A5360

Table: library/phd/batch-editing/android/cases.csv
Started: 2026-11-11T10:01:52.022Z

## Environment
(build, server, device, tier, credit balance, Pink toggles, Log stage timings, Write Log)

## Checkpoints

### 2026-11-11T10:10:51.625Z · next TC-164 (R2-b)
{"Fail":6,"Pass":1,"Not run":9}

R2-a done on SM-A5360 R5CTB22S05Y. Tier: was Free at segment start (Mine 「Upgrade to Premium!」); set 「Set to subscriber」 on in the debug dialog (nothing else changed), relaunched: Mine 「Hello VIP!」 = Premium. Phone on the Batch picker (Casebook album, 4 stand-ins), Crop room discarded with X, nothing saved this segment. Logs pulled R2-a-20261111-181034 (sliced; no app crash in the segment, logcat noise only). Typing in Custom resolution uses adb input text (no setval). Next: R2-b Adjustment from a fresh 12-photo batch (All album, top 12 tiles).

### 2026-11-11T10:19:49.812Z · all recorded
{"Fail":12,"Pass":4}

R2-b done on SM-A5360 R5CTB22S05Y (phase R2 complete). Tier Premium throughout (Mine 「Hello VIP!」, no debug option changed). R2-b batch: All album top 12 tiles (stand-ins ①–④ first). Phone left on the Batch Edit Room main screen of that batch with unsaved edits (Exposure apply from the Adjustment room, ✓; photo 4's room change undone on main); nothing saved. Logs pulled R2-b-20261111-181928 (sliced; no app crash in the segment; a StackOverflowError at 15:09 in the ring buffer predates R2). Toasts are not in the page source: screenshot straight after the tap or read logcat Toast lines.
