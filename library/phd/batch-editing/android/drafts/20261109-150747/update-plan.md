# Update plan — phd/batch-editing / android: approved v1 → draft 20261109-150747

Request: REQ-003. Rows: 161 (new 12, modified 28, unchanged 121, removed 0). Built by `build-draft.ts`,
requirements by `make-requirements.py`, Chinese reading copy by `build-zh.ts` (all in this folder).

## Spec files
- Unchanged: Section 3 · 美圖 Apply to all 實測.pdf
- New or changed: UI UX flow 2.pdf (the PM page re-exported 2026-11-09; its top boards moved −100 / +290 pt and the
  Q1 / Q2 notes moved to the new board `pm-decisions`); 50 Design frame PDFs `Design - *.pdf` (light and dark copy of
  each frame, exported by the user because the Figma MCP quota ran out mid source read; boards `ds-*`)
- No longer supplied: UI UX flow.pdf (renamed 「UI UX flow 1.pdf」 in set 2026-10-30, same file)

## Requirement changes
| Requirement | Change | Before | After |
|---|---|---|---|
| R-013 | modified | max 20, same on both platforms | max 20 for Free and Premium alike, no IAP at any count (Q2 decided 10/30) |
| R-015 | modified | count + 「Done」 (copy Q-1) | Design copy 「Select 1 to 20 photos to continue. (n/20)」 + 「Next」 |
| R-016, R-017, R-020, R-021 | modified | 「Done」 | 「Next」 |
| R-019 | new | — | selected-photo tray with ✕ (Design) |
| R-233 | new | — | tile expand icon opens the photo without selecting it (Design) |
| R-022 | modified | Launcher shortcut board with no note (Q-2) | shortcut planned (icon pending) and deeplink `phd://navigate/page?name=batch_edit` (Q-15) |
| R-031 | modified | Home, Replace photo, Save, Setting | + feedback button (Design, Q-21) |
| R-038 | modified | undone Enhance + another edit: cannot enhance again | Redo cleared, but the photo can be enhanced again (R-229) |
| R-050 | modified | room as today, no title bar | top bar ‹, 「W x H」 with pencil, 「All」 (Design); ‹ beside ✕ is Q-22 |
| R-234 | new | — | 「All」 has a greyed state (Design, Q-16) |
| R-090 | modified | no AI Exposure | same, Design draws AI Exposure (Q-18) |
| R-230 | new | — | HSL and Curve panels on the Color tab, folding with ﹀ / ︿ (Design) |
| R-231 | new | — | 「All」 carries HSL and Curve values |
| R-232 | new (not testable) | — | PM's thumbnail-strip proposal for HSL / Curve (direction only, Q-17) |
| R-116 | modified | once per photo; enhanced photos leave N | one Enhance per visit of the room on every photo; 「Enhanced」 for the rest of the visit |
| R-117 | removed (kept as a not-testable line) | undone photo still counts as enhanced | dropped by UI UX flow 2 |
| R-229 | new | — | entering the room again allows another Enhance on the current images |
| R-123 | modified | 「…marked on the thumbnails.」 | Design 「…marked with ! on the thumbnails.」; card with ✕ |
| R-130 | modified (note) | — | Design draws the Discard Dialog over the AI Enhance page (Q-19) |
| R-150 | modified | saving overlay | + top bar dimmed, no feedback button (Design) |
| R-153 | modified | 「Saved N photos」 | Design 「Save N photos」 (Q-20) |
| R-155 | modified | ‹ from the 「Edit Next Batch」 picker → Launcher | → Batch Edit Room with the edits (Android day-1) |
| R-235 | new | — | new red arrow on leave-flow: Picker ‹ (from 「Edit Next Batch」) → Batch Edit Room main; walked by TC-134, TC-148 |

## Case changes
- New (12): TC-150 tray ✕ (R-019) · TC-151 tile expand icon (R-233) · TC-156 Free user selects 20 with no IAP
  (R-013) · TC-152 batch_edit deeplink (R-022) · TC-154 feedback button (R-031) · TC-161 Crop size label and pencil
  (R-050) · TC-155 Crop ‹ (R-050) · TC-153 「All」 greyed state (R-234) · TC-159 HSL / Curve panels and folding
  (R-230) · TC-158 「All」 with HSL and Curve (R-231) · TC-157 second Enhance on a new visit (R-229) · TC-160 result
  card ✕ (R-123)
- Modified (28): TC-008, TC-010, TC-013, TC-014, TC-015, TC-018, TC-019, TC-020, TC-117, TC-119 「Done」 → 「Next」;
  TC-005, TC-007, TC-011 picker copy and tray; TC-022 shortcut planned; TC-024 feedback button; TC-036 photo can be
  enhanced again; TC-037 Crop room as drawn; TC-070 note AI Exposure (Q-18); TC-093 note Q1 decided; TC-096 Spec Ref
  (R-116 no longer about N); TC-097 undone photo enhanced again on a new visit (R-117 → R-229); TC-100, TC-142 note Q-19;
  TC-101 copy with ! and card ✕; TC-122 top bar dimmed while saving; TC-128 title 「Save 12 photos」; TC-134, TC-148
  ‹ / Back from the 「Edit Next Batch」 picker → Batch Edit Room
- Removed (0)
- Unchanged: 121

## Found by the analysis
- Visual diff of UI UX flow 1 vs 2 (rendered page, board by board): only text notes, moved notes and one new red arrow on leave-flow (R-235) changed; mockups unchanged.
- Annotation trace: 141 blocks traced; new blocks from UI UX flow 2 (entry-batch-shortcut, pm-decisions,
  adjust-guideline-note, leave-flow, enhance-done) and one per Design frame text group; carried traces on the changed
  enhance-done and room-default blocks corrected (R-117 → R-229).
- Variants (pass 10): R-013 Free / Premium at 20 photos → TC-156, TC-011; R-229 enhanced again / undone photo →
  TC-157, TC-097; R-231 HSL / Curve → TC-158.
- Domain rules: the product knowledge base has grown since v1; every entry is cited or n/a under *Domain rules*
  (KP-014 AI Exposure noted against Q-18).

## Not added (value check)
- PM's Adjustment thumbnail-strip proposal (A smaller strip, B strip hidden while dragging): park — direction only, no
  Design frame yet (R-232, Q-17).
- Picker tab names 「Photo」 / 「Stock」 (PM drew 「Recents ▾」): drop — the picker's tabs are the existing picker, not
  changed by this feature.
- Light / dark copies of each Design frame: merge — same text and layout; a dark-mode pass is not asked for.
- Design-only visual details (the light Save page drawn on a dark grid, 「Next」 grey in the light picker frame): park —
  Design inconsistencies, noted in Q-1 / board notes, for the design check later.
- Meitu / PhDM limits diagram on `pm-decisions` (Meitu VIP 50, IAP at the 13th; PhDM 20, IAP at the 7th): drop —
  today's figures of other features, R-013 holds the batch rule.

## PM-only rows
- None new. The Design frames now cover the picker, main room, Crop, Adjustment, AI Enhance (confirm, processing,
  result), Discard and Save page; the free-user IAP flow, network-failure states and the Launcher shortcut stay
  PM-only (no Design frame).

## Questions for PM
- Q-15 Launcher shortcut and deeplink landing. Q-17 thumbnail-strip proposal link. Q-18 AI Exposure (PM no, Design
  yes). Q-19 Discard Dialog over the AI Enhance page. Q-20 「Save」 vs 「Saved N photos」. Q-21 feedback button.
  Q-1 「Next」 vs 「Done」 and the hint copy.

## Questions for you
- Q-16 and Q-22 (「All」 greyed state, Crop ‹) are Design-only details: ask Design or settle on the device.
- Settled: Q-2 (shortcut now planned), Q-7 (no credits day-1), Q-8 (no Premium lock day-1), all from UI UX flow 2.
