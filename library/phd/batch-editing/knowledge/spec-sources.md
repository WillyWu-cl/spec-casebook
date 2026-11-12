# Batch Editing spec sources

## KF-005 The PM PDF export lags the PM Figma page
- kind: fact · platform: both · use: analysis · tags: spec, figma, pdf, sources · authority: spec
- source: spec agent comparison and Figma re-read, user 2026-11-11 (REQ-011)

「UI UX flow 2.pdf」 is an older export of the PM Figma page (iWlQTjlmfykHfmlNvg9J4p, page 0:1). It lacks the
【NEW】 「All」 normal / disabled list and the width / height link rule (DR-04), the Curve / HSL strip rule (D1-12), and
still had the old DR-05g. Read the Figma page (text snapshot and inventory in `specs/2026-11-09-figma/extracted/`) for
both platforms; where the PDF differs, the Figma page wins.

## KF-006 PM rules change in place on the Figma page
- kind: risk · platform: both · use: analysis · tags: spec, figma, change-check · authority: observed
- source: Figma re-read 2026-11-11 (pm-ui-4 DR-05g) · verified: Figma 2026-11-11

The PM edits rule lines on the existing boards without a dated frame: on 2026-11-11 DR-05g turned from 「Undo / Redo
不會自動切換 tab」 into 「會自動切換 tab…同今天 Android 單張」, one character apart. Run the `figma-check.ts` change check
before every draft and run, and read `figma-text.ts` output line by line.
