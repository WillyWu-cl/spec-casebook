# Batch Editing — request ledger

Every request that changes what this feature's tables must cover or how its runs are done, from the user, a
colleague, a reviewer or RD. The spec analysis re-applies every **table** entry on each new or updated draft
(skill: "Standing inputs"), and `check.ts` fails a draft whose `requirements.md` does not cite each open table entry
for its platform. **run** entries are followed by the run rules; **analysis** entries change how the spec is read.
Add new entries at the bottom with the next ID; never renumber. Mark an entry `superseded by REQ-…` in Status instead
of deleting it.

| ID | Date | From | Request | Kind | Platform | Status |
|---|---|---|---|---|---|---|
| REQ-001 | 2026-11-09 | user | New PhotoDirector Mobile feature: Batch Editing (26'11/E: AI Enhance, Crop & Rotate, Adjustment). Run both the casebook and the figma skill on it. PM spec: Figma https://www.figma.com/design/iWlQTjlmfykHfmlNvg9J4p/Batch-Editing?node-id=0-1 ; Design spec: https://www.figma.com/design/qZXJfrM5gb5g4tFoCIS1YU/Batch-Edit?node-id=12-2321 (no PDFs). Both platforms. | analysis | both | done (approved ios v1 (123 rows) and android v1 (140 rows: Android-only risk variants KP-082/068, KP-097, KP-099 and system Back), 2026-11-10; Design source read 2026-11-09/10: 50 boards, 36 screens, design scope not yet reviewed) |
