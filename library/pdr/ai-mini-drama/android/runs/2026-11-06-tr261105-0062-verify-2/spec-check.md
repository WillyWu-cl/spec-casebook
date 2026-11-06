# Expected result against today's spec (REQ-091)

Figma change check: last run 2026-11-05 (63 boards unchanged, `extracted/figma-check.json`); not repeated today. Re-run
it before writing any Fail's Expected Result from the spec. Ticket comments: not read yet (ECL page needs the tester's
sign-in; the API returns none), read before the verdicts are final.

- P0343: R-320 / R-321, TC-513: unchanged, no dialog in stage ②. RD (11/03) said fixed; FIXED on 2611041 (REQ-089), not
  yet seen on this TR's build. Stage ① has its own dialog (R-318, TC-061).
- P0348: R-139, TC-160 / 162 / 155. The Design's Recent Task board notes a reopened chat keeps "only outline, images and
  videos" with a notice (`spec-basis-audit.md` row 25: only the lost video cards held). Judge against that too: a loss
  WITH the notice is not this bug. R-315 removed Stop after a Generate; ■ on a chat revision reply stays (TC-155, R-138,
  R-486).
- P0358: R-171, TC-308: unchanged.
- P0363: R-139, R-071, R-264, TC-166: unchanged. Since 10/22 the video job has stages: stage ① leave asks 「Leave while
  we're preparing?」 (R-318), so leave in stage ② 「Making your video…」 as the bug's job had started.

## Added 2026-11-06 (ticket comment relayed by the tester)
- P0348, YUTUNG_LEE 11/05 11:42 (Assigned): on RD's build ← then History keeps every message and card (Remus could not
  reproduce on 10/30); Stop removes no card; only after the app is closed or restarted does a reopen show just the generated
  cards (outline, characters, storyboard, video), which RD calls Android's current design. That matches the run and the
  Design's notice, so the swipe-away loss is not this bug. Still open: the video card must come back (O-20). OK with a
  Note if it does. The notice shows only on History, not in the chat: an observation.
