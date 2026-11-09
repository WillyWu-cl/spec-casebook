# Update plan — phd/batch-editing / android: new table → draft 20261030-151536

## Spec files
- New: UI UX flow.pdf, Section 3 · 美圖 Apply to all 實測.pdf (from `spec/Batch Editing.zip`, folder 26'11). PDF-only:
  no Figma links, Figma reads owed (`figma-pending.json`, Q-12).

## Case changes
- New (149): Photo Picker 17, Entry 5, Batch Edit Room 14, Crop & Rotate 19, Crop rules (Section 3) 13, Adjustment 14,
  AI Enhance 18, AI Enhance failures 12, Leaving Batch Edit 9, Save 6, Batch Save page 9, Android Back 13.

## Found by the analysis
- Annotation trace: 96 blocks traced (every 【Requirement】 block, the pending-decision notes, the tracking table, the
  Section 3 conclusion and its 9 measured cases).
- Section 3 「✅ 結論」 turned into requirements R-058 – R-077 and one row per measured case (C1, C5–C12) on the same four
  test photos, plus pixel-input limits (238 px, the photo's own size) and the rotate / angle rules.
- Pass 1: 29 drawn flow arrows (`arrows.json`), each walked by a row.
- Pass 2: job grid for batch AI Enhance (loading, success, partial failure, retry, second failure, offline,
  background, kill) and batch save.
- Pass 8 / REQ-051: Android system Back on every screen (13 rows; the spec is silent for most: Q-11).
- Pass 9: hidden clauses — Standard · Portrait, retry reruns only failed / unfinished photos, results not kept after a
  kill, not in My AI Artwork, new files / originals kept, unedited photos saved, rating counts a batch as one save.
- Pass 10: Free vs Premium for AI Enhance (IAP vs no credits) and for the free tools; both pickers for the tabs.

## Not added (value check)
- Tracking events (R-160): drop — analytics, event names still pending, no event viewer on the phone.
- Release timing 26'11/E, iOS + Android together (R-005): not testable.
- Credit charging for batch AI Enhance (PhD PC 1 credit / 10 photos mockup): not added — PM Q1 still pending (Q-7);
  rows check today's rule (no credits).
- Premium lock / 50-photo limit (Meitu): not added — PM Q2 pending (Q-8).
- Meitu's own results in Section 3 (relative size sync, 56 % / 72 % boxes): not added — competitor behaviour; PhD
  rows assert the PhD decision and name the Meitu difference in TC Expected Results where it matters (C8, C10).
- Advanced-mode AI Enhance rules (DR-12b / f / g, R-118): not testable in batch; R-110 checks Advanced is absent.
- Rows needing a failure fixture (partial failure, retry) are kept and tagged `needs:` in Notes; park them in
  `phases.json` when the run plan is made.

## Questions for PM
- Q-1 Picker bottom copy 「Select 1 to 20 photos.」 vs 「n selected (max 20)」.
- Q-2 Is there a Launcher Batch Editing shortcut (board with no note) or only the two pickers (D0-04)?
- Q-3 / Q-4 Setting button target; compare button behaviour.
- Q-5 DR-07 centred crop box vs Section 3 relative position (rows follow Section 3).
- Q-6 PhD toast copy for an out-of-range pixel value.
- Q-7 / Q-8 pending credit and Premium decisions.
- Q-9 Section 3 「Undo after Apply to all」: room only, or the main screen too (main screen is per photo by DR-05d)?
- Q-10 Typos in mockups (「detaill」, 「Squre」, 「Hightlight」).
- Q-11 Android system Back on the main screen, rooms, processing and saving.
- Q-13 / Q-14 Picker deselect / empty Done; Save page 「‹」 and a second Save.

## Questions for you
- Platform iOS next, from this table, once Android is approved?
- Chinese reading copy: built (`draft.zh-Hant.csv` / `.xlsx`, REQ-002); rebuild with `build-zh.ts` whenever `draft.csv` changes.
