# Image to Video Reuse — request ledger

Every request that changes what this feature's tables must cover or how its runs are done, from the user, a
colleague, a reviewer or RD. The spec analysis re-applies every **table** entry on each new or updated draft
(skill: "Standing inputs"), and `check.ts` fails a draft whose `requirements.md` does not cite each open table entry
for its platform. **run** entries are followed by the run rules; **analysis** entries change how the spec is read.
Add new entries at the bottom with the next ID; never renumber. Mark an entry `superseded by REQ-…` in Status instead
of deleting it.

| ID | Date | From | Request | Kind | Platform | Status |
|---|---|---|---|---|---|---|
| REQ-001 | 2026-11-04 | user | New PhotoDirector feature: Image to Video 「26'11/E support to reuse model settings in My artwork」. PM spec is the Figma page https://www.figma.com/design/lSk4JUgbXG3DjauMLS9Et7/Image-to-Video?node-id=6336-3478 (no PDF); the Design spec follows on 2026-11-05. Draft from the PM now (PM-only rows), Android only for now. | analysis | android | done (draft 20261104-144311) |
| REQ-002 | 2026-11-04 | user | Standing rules: a feature gets both platforms unless one is named; a Figma link is read from Figma directly, no PDF asked (AGENTS.md › Team preferences). | analysis | both | done (AGENTS.md, SKILL.md step 0, reading-the-spec.md *Figma-only spec*) |
| REQ-003 | 2026-11-04 | user | When the Design spec arrives (expected 2026-11-05): read it and update the PM-only rows (pass 7); add the iOS table then if the user asks. | analysis | android | done (draft 20261106-115758) |
| REQ-004 | 2026-11-06 | user | The Design spec has arrived: https://www.figma.com/design/VU8bgYiFHTWhYddg7ciqtL/Image-to-video---Character-motion-swap?node-id=4701-15518 (page 「261105_support to reuse model settings」). Update the rows from it. | analysis | android | done (draft 20261106-115758) |
| REQ-005 | 2026-11-06 | user | Add the iOS table for this feature (REQ-003), from the same PM and Design pages. | analysis | ios | done (draft 20261106-121538) |
| REQ-006 | 2026-11-09 | user | Re-check the Design page https://www.figma.com/design/VU8bgYiFHTWhYddg7ciqtL/Image-to-video---Character-motion-swap?node-id=4701-15518 and whether the PM spec was updated. | analysis | both | done (figma-check 2026-11-09: Design 4 boards and PM 6 boards unchanged since 2026-11-06, no new pages in either file; tables stand) |
| REQ-007 | 2026-11-09 | user | Start the on-device run of the Android table on TR261106-0051 (PhotoDirector Android 20.19.0.v202611061839). | run | android | cancelled 2026-11-09: user says the feature is not implemented in this build yet; setup results wiped, no case recorded. phases.json and fixtures.md kept for the build that has it |
