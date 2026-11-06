# TR261105-0062 round 2 — ETHAN_HSU's bugs added to the verify list (read 2026-11-06)

TR: 16.8.0.2611052 (Deluxe), PowerDirector Mobile for Android, due 2026-11-09. The list grew from 8 to 24 after
QR261106-0008 (11:09): REMUS_CHIANG set these four BuildResolved at 12:04 and TRCreated at 12:05. P0422 is already
Close. All other rows are other testers' and out of scope. Filed text:
`ebugs/2026-10-27-a2/20261027_eBug_drafts_AI-Mini-Drama-A2_16.8.0.md`.

| Bug | Filed entry | Result as filed | Expect Result as filed |
| --- | --- | --- | --- |
| DRA262610P0343 | ISS-AMDA-23, TC-513 | stage ② ← shows 「Stop and lose your credits?」 | no dialog; toast 「We'll keep making your storyboard. Find it in History.」; the job finishes |
| DRA262610P0348 | ISS-AMDA-29, TC-160, 162, 155, O-10, O-20 | reopened chat starts at the outline card: idea, format answers, earlier user bubbles and replies gone; Stop removed the card above | a reopened chat shows every earlier message and card; nothing removed without notice |
| DRA262610P0358 | ISS-AMDA-40, TC-308 | rename during a scene-3 video update: push reads the old name, no 「Good news!」 toast | the push and the 「Good news!」 toast use the new name |
| DRA262610P0363 | ISS-AMDA-46, TC-166 | for about 2 minutes every History row opens the empty 「Hi, I'm your AI Drama Assistant」 page | the drama opens at its video stage with the video still in progress |
