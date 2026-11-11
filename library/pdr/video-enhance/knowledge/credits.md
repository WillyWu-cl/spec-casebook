# Credits

## KF-001 Billed seconds are the ceiling of the MediaStore duration
- kind: fact · platform: android · use: analysis, run · tags: credits, price, duration
- source: Video Enhance Android run 2026-11-10-r1-full O-5, O-7, O-8, O-19 · verified: 16.9.0 build 2611091 (2026-11-10)

The price is rate × the whole seconds of the phone's MediaStore duration rounded up, which runs ~21–33 ms longer than
ffprobe: an exact 10.000 s file may bill 10 or 11 s (and a 1.000 s one 2 s). 「Selected Length」 truncates, so
「02:30」 means 150.x s. Recent task cards round up the same way. Price rows quote the price with the MediaStore
duration (`adb shell content query` on the file), never the ffprobe one.

## KF-002 A charge is stamped at the Enhance tap
- kind: fact · platform: android · use: run · tags: credits, ledger, logs
- source: Video Enhance Android run 2026-11-10-r1-full O-13, O-17 · verified: 16.9.0 build 2611091 (2026-11-10)

The Credit Details row 「Video Enhancer」 −N carries the time of the Enhance tap (logcat 「create session response
code->200」), before the local transcode and the upload end. Match ledger rows to tap times. (PM says credits are
taken when the upload reaches the server: that gap is the table's Q-2, not settled here.)

## KF-003 A task that never uploaded is refunded hours later
- kind: quirk · platform: android · use: run · tags: credits, refund, failure
- source: Video Enhance Android run 2026-11-10-r1-full O-11, O-29 and the wrap-up recheck · verified: 16.9.0 build 2611091 (2026-11-10)

Two 30-credit tasks left during the upload (「Leave」 18:38, Home 18:44) stayed charged with 「Retry」 cards, then got
「Generation failed, credits returned +30」 at 21:40 and 22:00 with no app call around them: the server refunds such
tasks about 3 h later. Read the ledger again at the end of the run before calling a refund missing.
