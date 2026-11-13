# Update plan — phd/ai-hair-color-custom / android: new table → draft 20261112-100854
## Spec files
- New: AI Hair Color Custom - PM Figma 3287-89.md (text snapshot of PM Figma page 3287:89, read 2026-11-12). No Design file, no PDF.

## Case changes
- New (85): every row (new table). Rows are PM-only (no Design file).

## Found by the analysis
- Annotation trace: 28 blocks traced; R-078 (guid naming) and R-079 (DS tokens) added as NOT TESTABLE.
- Pass 1 flow arrows: 5 arrows (drawn head-first; edges fixed from the labels and the board image) → R-080–R-084.
- Pass 2 job states: one job (Custom generation); failure rows parked (no failure fixture).
- Pass 9 hidden clauses: API colour values and solid_color's single colour (log pull), charges and refunds (credit chip and Buy Credit › Detail).
- Pass 10 variants: every one of the 11 styles generates once (TC-058–TC-068); only Base / only Highlight; ⌄ / tap outside.
- Pass 11 controls: 29 groups; the PM mockups draw most controls as plain shapes, so 24 were added by hand (inventory-overrides.json).
- 10/E rules the Custom page cites (D1-03, D1-05, D1-07, D1-12–D1-19, D2-01, D2-04, D3-02a, D3-06, D4-04) read from page 3026:89 and used where Custom says 「沿用 10/E」.

## Not added (value check)
- Exact 15° yaw / roll and 128 px boundaries: drop — no way to make a photo at exactly the threshold; clear cases above and below are rows (TC-005, TC-008).
- result_ratio_mismatch (10/E D1-17) for Custom: drop — an AP safeguard that cannot be forced from the app.
- Ratio dialog and Crop room themselves (10/E entry_blocked_ratio, crop_room): not redrawn here; only their order with the face checks is a row (TC-011–TC-013).
- One-time free trial for Custom: not added until Q-7 is answered.
- Collapse with no style or incomplete colours: not added until Q-5 is answered.
- DS colour tokens and layout sizes (R-079): left to the figma skill's design check.
- Parked (need fixtures): TC-075, TC-076 (failure fixture), TC-081, TC-082 (deeplink format, Q-11), TC-084 (CMS data), TC-036 / TC-037 log part (log pull).

## PM-only rows
- Every row (PM page only; no Design file supplied 2026-11-12). Re-check them when the Design arrives.

## Questions for PM
- Q-1 to Q-13, Q-15, Q-14 (Android system Back) in requirements.md › Open questions (Custom in Multicolor, cell look, style switch, result_in_panel, collapse when incomplete, day-1 list / premium, free trial, Intro Demo vs 10/E, too-small string, staged strings, deeplink format, 42–48 s wait, CMS type).

## Questions for you
- None.
