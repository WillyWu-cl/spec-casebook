# Decisions — Video Enhance R1b (batch 2), 16.9.0 build 2611091, pasted by the reviewer 2026-11-11

Saved verbatim. Notes on applying: F-3 and F-10 held with the reviewer's rulings (Android shows no 「You're all set」
dialog, it is iOS only; Android has only Free and Pro, Pro+ is iOS only) — both go into the table as rulings
(REQ-012). Type UX on F-4, F-6, F-8, F-15, F-16 files them `[AIAgent][UX]` with BugBelong PM (user, 2026-11-11: a
PM decision on a user-experience problem is UX); the reviewer's Type UX is the UX check.

Account: ETHAN_HSU
Method: API
Source tag: [AIAgent]
TRCode: TR261109-0041

| # | ISS | Sev | Belong | Type | Action | Short Description | Note |
|---|---|---|---|---|---|---|---|
| F-1 | ISS-VEA-16 | 2 | PM | UI | file | PDR-A 16.9.0 - [AIAgent][UI] AI Video Enhance: Demo page description is AI Reframe's text, not Video Enhance's |  |
| F-2 | ISS-VEA-18 | 2 | RD | Functional | file | PDR-A 16.9.0 - [AIAgent] AI Video Enhance: Trim handles can meet, leaving a 「00:00」 selection under the 1 s minimum |  |
| F-3 | ISS-VEA-19 | 2 | RD | Functional | hold | PDR-A 16.9.0 - [AIAgent] AI Video Enhance: Pro purchase succeeds but no 「You're all set」 dialog is shown | The "You're all set" popup is iOS only, android would have a different behavior |
| F-4 | ISS-VEA-20 | 2 | PM | UX | file | PDR-A 16.9.0 - [AIAgent] AI Video Enhance: 「Don't show again」 ticked then left with ‹ still turns the Demo page off |  |
| F-5 | ISS-VEA-21 | 2 | PM | Functional | file | PDR-A 16.9.0 - [AIAgent] AI Video Enhance: Videos under 1 s and MKV files are not greyed; they open the panel |  |
| F-6 | ISS-VEA-22 | 2 | PM | UX | file | PDR-A 16.9.0 - [AIAgent] AI Video Enhance: Switching to Professional does not re-lay the strip to 2:30 per width |  |
| F-7 | ISS-VEA-23 | 2 | PM | Functional | file | PDR-A 16.9.0 - [AIAgent] AI Video Enhance: Dragging the selection moves the range the opposite way to the finger |  |
| F-8 | ISS-VEA-24 | 2 | PM | UX | file | PDR-A 16.9.0 - [AIAgent] AI Video Enhance: Full-screen preview has no close control and always restarts at 00:00 |  |
| F-9 | ISS-VEA-25 | 2 | PM | UI | file | PDR-A 16.9.0 - [AIAgent][UI] AI Video Enhance: 「Up to 8 minutes in Standard mode」 bubble covers Preview time and play |  |
| F-10 | ISS-VEA-26 | 2 | PM | UI | hold | PDR-A 16.9.0 - [AIAgent][UI] AI Video Enhance: Toolbar badge reads 「Pro」, IAP page has no Pro+ tab (no Android Design) | Android only has free and Pro, Pro+ is only on iOS |
| F-11 | ISS-VEA-27 | 2 | PM | Functional | file | PDR-A 16.9.0 - [AIAgent] AI Video Enhance: 「Leave」 during upload charges 30 credits, then a refund comes 3 h later |  |
| F-12 | ISS-VEA-28 | 2 | PM | UI | file | PDR-A 16.9.0 - [AIAgent][UI] AI Video Enhance: Notification copy is the banner's, not 「Your video is ready. Tap to view」 |  |
| F-13 | ISS-VEA-29 | 2 | PM | UI | file | PDR-A 16.9.0 - [AIAgent][UI] AI Video Enhance: Save Result toast reads 「Saved to Gallery」, not 「Saved to your device」 |  |
| F-14 | ISS-VEA-30 | 2 | PM | Functional | file | PDR-A 16.9.0 - [AIAgent] AI Video Enhance: Recent task's 「Select」 offers only Delete; what 「Manage」 opens is unspecified |  |
| F-15 | ISS-VEA-31 | 2 | PM | UX | file | PDR-A 16.9.0 - [AIAgent] AI Video Enhance: Each finished task is auto-saved to Movies; Save Result makes a second copy |  |
| F-16 | ISS-VEA-32 | 2 | PM | UX | file | PDR-A 16.9.0 - [AIAgent] AI Video Enhance: Timeline clip over 8:00 opens the panel capped at 08:00, no split toast |  |
| F-17 | ISS-VEA-33 | 2 | PM | Functional | file | PDR-A 16.9.0 - [AIAgent] AI Video Enhance: Timeline task result is not pasted back; Add to Timeline makes a new project |  |
