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
