# TR261105-0062 — ETHAN_HSU's bugs on the verify list (read 2026-11-06)

TR: 16.8.0.2611052 (Deluxe), PowerDirector Mobile for Android, due 2026-11-09. 8 bugs on the verify list; one created by
ETHAN_HSU. The other seven (DRA262608-0187, P0159, P0206, P0308, P0001, P0007, P0022) are other testers' and out of scope.

## DRA262610P0422 — PDR-A 16.8.0 - [AIAgent] AI Mini Drama: A clean install opens the landing page with no intro page
Filed 2026-10-30 on 16.8.0 / 2610212 (TR261021-0082), S3, RD. Status TRCreated (BuildResolved by REMUS_CHIANG 11/05).
No comments on the ticket.

Repro Steps:
1. Uninstall the APP
2. Install the APP
3. Launch the APP
4. Tap AI Mini Drama on the Launcher
5. Check the result

Result: The landing page opens at once: no intro page, demo video, Don't show again or Try It Now (3 clean installs).
Expect Result: An intro page 「Turn your idea into a video—same characters, same voices, every scene.」 with a demo video and Try It Now.
Spec Link: PM main flow 「Demo page_Straight video」 2283:10856.
