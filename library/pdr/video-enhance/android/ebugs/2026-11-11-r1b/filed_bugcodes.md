# AI Video Enhance Android — R1b (batch 2) eBugs filed 2026-11-11

Creator ETHAN_HSU (read back on every bug) · method API (create + attachment upload) · source tag [AIAgent] · TR [TR261109-0041](https://ecl.cyberlink.com/IF3/tr/BPM/FormView/TR261109-0041) · 16.9.0 build 2611091 (TR header 「16.9.0.2611091 (Deluxe)」) · Stage server · template Generic v16.9 (23176) · due 2026-11-18 · decisions: `decisions.md`

**Read back:** Creator, severity, belong, TR, build and Short Description of every bug match what was sent (`readback.log`); all 35 attachments are on their pages (`files.log`, `upload.log`). Status 「BugNeedReview」. Dedupe re-run on the Android pool right before filing (`dedupe-recheck.txt`): no duplicate. No existing ticket was commented on.

**Held:** F-3 (ISS-VEA-19, TC-095: 「You're all set」 is iOS only) and F-10 (ISS-VEA-26, Q-25: Android sells only Free and Pro) — the reviewer's rulings, applied to the table as REQ-012. **UX:** F-4, F-6, F-8, F-15, F-16 are [AIAgent][UX], BugBelong PM (user, 2026-11-11: a PM decision on a user-experience problem is UX).

**Still to do on the web form:** OS Language on every bug (the API cannot set it).

| BugCode | ISS | Sev | Belong | Short Description |
|---|---|---|---|---|
| [DRA262611P0086](https://ecl.cyberlink.com/IF3/ebug/BPM/FormView/DRA262611P0086) | ISS-VEA-16 | 2 | PM | PDR-A 16.9.0 - [AIAgent][UI] AI Video Enhance: Demo page description is AI Reframe's text, not Video Enhance's |
| [DRA262611P0087](https://ecl.cyberlink.com/IF3/ebug/BPM/FormView/DRA262611P0087) | ISS-VEA-18 | 2 | RD | PDR-A 16.9.0 - [AIAgent] AI Video Enhance: Trim handles can meet, leaving a 「00:00」 selection under the 1 s minimum |
| [DRA262611P0088](https://ecl.cyberlink.com/IF3/ebug/BPM/FormView/DRA262611P0088) | ISS-VEA-20 | 2 | PM | PDR-A 16.9.0 - [AIAgent][UX] AI Video Enhance: 「Don't show again」 ticked then left with ‹ still turns the Demo page off |
| [DRA262611P0089](https://ecl.cyberlink.com/IF3/ebug/BPM/FormView/DRA262611P0089) | ISS-VEA-21 | 2 | PM | PDR-A 16.9.0 - [AIAgent] AI Video Enhance: Videos under 1 s and MKV files are not greyed; they open the panel |
| [DRA262611P0090](https://ecl.cyberlink.com/IF3/ebug/BPM/FormView/DRA262611P0090) | ISS-VEA-22 | 2 | PM | PDR-A 16.9.0 - [AIAgent][UX] AI Video Enhance: Switching to Professional does not re-lay the strip to 2:30 per width |
| [DRA262611P0091](https://ecl.cyberlink.com/IF3/ebug/BPM/FormView/DRA262611P0091) | ISS-VEA-23 | 2 | PM | PDR-A 16.9.0 - [AIAgent] AI Video Enhance: Dragging the selection moves the range the opposite way to the finger |
| [DRA262611P0092](https://ecl.cyberlink.com/IF3/ebug/BPM/FormView/DRA262611P0092) | ISS-VEA-24 | 2 | PM | PDR-A 16.9.0 - [AIAgent][UX] AI Video Enhance: Full-screen preview has no close control and always restarts at 00:00 |
| [DRA262611P0093](https://ecl.cyberlink.com/IF3/ebug/BPM/FormView/DRA262611P0093) | ISS-VEA-25 | 2 | PM | PDR-A 16.9.0 - [AIAgent][UI] AI Video Enhance: 「Up to 8 minutes in Standard mode」 bubble covers Preview time and play |
| [DRA262611P0094](https://ecl.cyberlink.com/IF3/ebug/BPM/FormView/DRA262611P0094) | ISS-VEA-27 | 2 | PM | PDR-A 16.9.0 - [AIAgent] AI Video Enhance: 「Leave」 during upload charges 30 credits, then a refund comes 3 h later |
| [DRA262611P0095](https://ecl.cyberlink.com/IF3/ebug/BPM/FormView/DRA262611P0095) | ISS-VEA-28 | 2 | PM | PDR-A 16.9.0 - [AIAgent][UI] AI Video Enhance: Notification copy is the banner's, not 「Your video is ready. Tap to view」 |
| [DRA262611P0096](https://ecl.cyberlink.com/IF3/ebug/BPM/FormView/DRA262611P0096) | ISS-VEA-29 | 2 | PM | PDR-A 16.9.0 - [AIAgent][UI] AI Video Enhance: Save Result toast reads 「Saved to Gallery」, not 「Saved to your device」 |
| [DRA262611P0097](https://ecl.cyberlink.com/IF3/ebug/BPM/FormView/DRA262611P0097) | ISS-VEA-30 | 2 | PM | PDR-A 16.9.0 - [AIAgent] AI Video Enhance: Recent task's 「Select」 offers only Delete; what 「Manage」 opens is unspecified |
| [DRA262611P0098](https://ecl.cyberlink.com/IF3/ebug/BPM/FormView/DRA262611P0098) | ISS-VEA-31 | 2 | PM | PDR-A 16.9.0 - [AIAgent][UX] AI Video Enhance: Each finished task is auto-saved to Movies; Save Result makes a second copy |
| [DRA262611P0099](https://ecl.cyberlink.com/IF3/ebug/BPM/FormView/DRA262611P0099) | ISS-VEA-32 | 2 | PM | PDR-A 16.9.0 - [AIAgent][UX] AI Video Enhance: Timeline clip over 8:00 opens the panel capped at 08:00, no split toast |
| [DRA262611P0100](https://ecl.cyberlink.com/IF3/ebug/BPM/FormView/DRA262611P0100) | ISS-VEA-33 | 2 | PM | PDR-A 16.9.0 - [AIAgent] AI Video Enhance: Timeline task result is not pasted back; Add to Timeline makes a new project |
