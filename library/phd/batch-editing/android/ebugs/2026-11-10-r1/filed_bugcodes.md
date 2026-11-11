# Batch Edit R1 — filed eBugs (2026-11-10)

TR261106-0051 · PhotoDirector Mobile for Android 20.19.0 build 202611061839 · template PHD_Android_Generic 20.19 ·
Creator WILLY_WU (read back) · method api (create + attachment upload) · decisions in `decisions.md` (user).

| Draft | BugCode | Sev | Belong | Short Description |
|---|---|---|---|---|
| ISS-BEA-01 (TC-110) | [PHA262026P0057](https://ecl.cyberlink.com/IF3/ebug/BPM/FormView/PHA262026P0057) | 2 | RD | AI Enhance does not pause in the background; remaining photos fail as Connection lost |
| ISS-BEA-04 (TC-144) | [PHA262026P0058](https://ecl.cyberlink.com/IF3/ebug/BPM/FormView/PHA262026P0058) | 2 | RD | System Back does not close the AI Enhance confirm dialog 「Enhance 12 photos?」 |
| ISS-BEA-05 (TC-145) | [PHA262026P0059](https://ecl.cyberlink.com/IF3/ebug/BPM/FormView/PHA262026P0059) | 2 | RD | System Back does not close the 「Discard changes?」 dialog opened from Home |
| ISS-BEA-06 (TC-060) | [PHA262026P0060](https://ecl.cyberlink.com/IF3/ebug/BPM/FormView/PHA262026P0060) | 3 | RD | Square crop applied to all saves a 16:9 photo as 1434 x 1435, not square |
| ISS-BEA-09 (TC-012) | [PHA262026P0061](https://ecl.cyberlink.com/IF3/ebug/BPM/FormView/PHA262026P0061) | 3 | PC-Doc | 21st-photo toast reads 「You can only select 20 photos.」, not the spec copy |

Not filed (user, 2026-11-10: not a bug): ISS-BEA-02 (TC-037/155), 03 (TC-079), 07 (TC-122), 08 (TC-115),
10 (TC-018), 11 (TC-107).

Feature name changed to 「Batch_Editing:」 on all five (user, 2026-11-10, REQ-008; web edit form, read back).

Build note: the phone's About page and package show only 20.19.0 (90201900); the TR names 20.19.0.v202611061839 and
the user named this TR for the findings.
