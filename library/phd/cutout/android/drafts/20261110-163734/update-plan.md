# Update plan — phd/cutout / android: new table → draft 20261110-163734
## Spec files
- New: Cutout Reset Undo Redo Spec 11E.pdf, Cutout UI UX flow (before 11E).pdf (spec set 2026-11-10, from 「Cutout with Stroke.zip」)
## Case changes
- New (51): every row, from the 11/E Reset / Undo / Redo page (button states, the operation table, cross-tab Undo, Reset, the cutout style, leaving the room, other scenarios); Android adds three system Back rows (TC-048 – TC-050)
## Found by the analysis
- Annotation trace: 34 blocks traced (31 PDF text blocks, 3 items of the linked Design 2025/09 page, read with figma-design).
- Pass 1 flow arrows: the cross-tab board's 2 Undo arrows and 2 pink arrows (✕ / ✓ → Cutout page) → R-090 – R-093.
- Pass 9 hidden clauses: shared history, flatten on ✓, cancelled download not applied, undone photo kept in Recent, oldest step dropped silently.
- Pass 10 variants: Undo / Redo checked once per operation type in the table (solid, template, photo, palette, stroke colour / style, thickness, rotate, flip, Reset).
- Derived rows: Reset enabled by state comparison (TC-011: back to the entry item → Reset disabled, Undo enabled); non-steps keep Redo (TC-027); a cutout-only edit enables Reset but not Undo (TC-035).
## Not added (value check)
- 「UI UX flow (before 11/E)」 Background room (tabs Background / Template, chips Favorite / Trendy…, ✕ / ✓ only): older spec — the 11/E room replaces it (Background / Stroke, Reset / Undo / Redo).
- Design 2025/09 linked page (Background / AI Background rooms, on-canvas undo / redo of Text to image): older reference, no rule for this release; 「Cost 2 credit per creation」 belongs to AI Background, not to this spec.
- Cutout page tools (Auto / Box / Circle / Brush / Eraser) and their own reset / undo / redo: existing feature, unchanged by 11/E; only its entry (TC-001) and the edit-page undo (R-006) are rows.
## Questions for PM
- None open.
## Answers applied (2026-11-10, Cases page)
- Q-1, Q-2, Q-3, Q-7, Q-9 confirmed the assumptions (REQ-005): R-021, R-023, R-050, R-060, R-061, R-070, R-080 state them; TC-040 now checks that ✕ discards the edits, TC-044 that the earlier step stays; new TC-051 (close the palette unchanged → no step), placed after TC-018.
- Q-6 no step limit (REQ-006): R-072 rewritten; TC-046 makes 60 steps and undoes them all (no longer parked).
- Q-8 corrected by the user (REQ-009, supersedes REQ-007): there must be a Flip button; TC-024 stays, and a run that finds none records Fail and files an eBug.
- Q-4 the app has no 「最近使用」 for now (REQ-008, run): TC-016 stays and is expected to fail; file an eBug for it after it runs.
- Q-5 the PDFs hold everything on Figma; updates will come as a new spec set (REQ-010).
## Questions for you
- None.
