# Tasks and results

## KF-004 Recent task does not refresh and Back leaves it to the Launcher
- kind: quirk · platform: android · use: run · tags: recent-task, back
- source: Video Enhance Android run 2026-11-10-r1-full O-9, O-12, O-15, O-21 · verified: 16.9.0 build 2611091 (2026-11-10)

A card done on the server stays 「Processing…」 and 「<n> minutes left…」 never counts down until Recent task is
reopened or a card is tapped. System Back on Recent task goes to the Launcher, not the panel (5 of 5 times; whether by
design is TC-208's call). A 「View」 tapped right after the list opens can do nothing; tap again.

## KF-005 Task timings
- kind: fact · platform: android · use: run · tags: timing, upload, wait
- source: Video Enhance Android run 2026-11-10-r1-full O-14, O-26, O-28 · verified: 16.9.0 build 2611091 (2026-11-10)

The ring sits at 「0%」 through a local transcode (38 s for 01:30 1080p) before the upload; a 01:30 1080p upload took
9.5 min, a 3 s 720p one 1 s. From the Enhance tap to Done a 3.2 s clip took 66–151 s in Standard (4K the longest) and
208–544 s in Professional. Plan waits from these, not from the spec's seconds.

## KF-006 Results are written to the phone twice
- kind: fact · platform: android · use: run · tags: storage, save, result
- source: Video Enhance Android run 2026-11-10-r1-full O-21, O-23 · verified: 16.9.0 build 2611091 (2026-11-10)

At 「Done」 the app writes the result to Movies/cyberlink/PowerDirector/Video Enhance/ (「VideoEnhance - <date> - <n> -
<ms>.mp4」) without a media scan, so the gallery does not show it; 「Save Result」 writes a second identical copy and
scans that one (each tap another). Count files there by run time, not by number. Logcat's 「DownloadUriTask: …URI is
not absolute」 after each Done has no visible effect.

## KF-007 Completion is announced twice
- kind: fact · platform: android · use: run · tags: notification, banner
- source: Video Enhance Android run 2026-11-10-r1-full O-15, O-20 · verified: 16.9.0 build 2611091 (2026-11-10)

Each completed task posts a system notification even with the app in front, and an in-app 「Good news! …」 banner that
waits on the Launcher until 「Close」 and covers its top tiles; close it before tapping there.
