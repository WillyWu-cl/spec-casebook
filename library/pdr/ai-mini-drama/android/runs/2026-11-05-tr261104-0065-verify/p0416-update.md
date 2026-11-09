# DRA262610P0416 update after the price rule change (REQ-103), draft for approval

Edit › Short Description and Description; then upload the two frames the new Result adds
(`16.8.0.2611041_DRA262610P0416_Full_Best.png`, `…_Full_Fast.png`; the other four are already on the page).
Version / Build stay as filed (16.8.0 / 2610212). Status, handler and every other field untouched; no comment.

## Short Description

PDR-A 16.8.0 - [AIAgent] AI Mini Drama: Full Video 90 s is quoted 4 credits above the per-second price (Standard 364, not 360)

## Description

Repro Steps:
1. Launch the APP
2. Tap AI Mini Drama on the Launcher
3. Tap History
4. Tap a drama at 「Choose your video settings」
5. Tap Preview - 30 sec
6. Tap Best
7. Tap Standard
8. Tap Fast
9. Tap Full Video - 90 sec
10. Tap Best
11. Tap Standard
12. Tap Fast
13. Check the result

Result:
Preview 30 s is right: Best 180, Standard 120, Fast 60. Full 90 s is 544 / 364 / 184, 4 above 90 s at the same rates.
摘要：試看 180 / 120 / 60 正確；完整 90 秒為 544 / 364 / 184，比每秒單價多 4 點。
{16.8.0.2611041_DRA262610P0416_Preview_Best.png} {16.8.0.2611041_DRA262610P0416_Preview_Standard.png} {16.8.0.2611041_DRA262610P0416_Preview_Fast.png} {16.8.0.2611041_DRA262610P0416_Full_Best.png} {16.8.0.2611041_DRA262610P0416_Full_Standard.png} {16.8.0.2611041_DRA262610P0416_Full_Fast.png}

Expect Result:
Credit System prices: Seedance 2.5 6 per second, Seedance 2.0 4, Seedance 2.0 Mini 2, so Full 90 s is 540 / 360 / 180.
摘要：依點數系統每秒 6 / 4 / 2 點，完整 90 秒應為 540 / 360 / 180。

Note:
Device: Samsung Galaxy A53 (SM-A5360) / Android 15
Build: 16.8.0.2611041. On 2610212 the Full 90 s prices were exactly 90 × the per-second price (Standard 360, Fast 180).
Updated 2026-11-06: the expected prices now come from the Credit System forms, not the MX charging sheet (the original 13 per second no longer applies).
Spec Link: ECL Credit System, Seedance 2.5 - https://ecl.cyberlink.com/IF3/eclcom/BPM/FormView/22937582357
Spec Link: ECL Credit System, Seedance 2.0 - https://ecl.cyberlink.com/IF3/eclcom/BPM/FormView/22850755605
Spec Link: ECL Credit System, Seedance 2.0 mini - https://ecl.cyberlink.com/IF3/eclcom/BPM/FormView/21703885589
<Claude Reviewed>
