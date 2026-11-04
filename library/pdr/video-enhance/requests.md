# Video Enhance — request ledger

Every request that changes what this feature's tables must cover or how its runs are done, from the user, a
colleague, a reviewer or RD. The spec analysis re-applies every **table** entry on each new or updated draft
(skill: "Standing inputs"), and `check.ts` fails a draft whose `requirements.md` does not cite each open table entry
for its platform. **run** entries are followed by the run rules; **analysis** entries change how the spec is read.
Add new entries at the bottom with the next ID; never renumber. Mark an entry `superseded by REQ-…` in Status instead
of deleting it.

| ID | Date | From | Request | Kind | Platform | Status |
|---|---|---|---|---|---|---|
| REQ-001 | 2026-11-03 | user | Build the Video Enhance tables (iOS and Android) with the casebook skill and read the Design Figma with the figma skill. Design: https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance?node-id=3293-13053 (first given as Design + PM; access opened later the same day). PM: https://www.figma.com/design/mppB4GYkuVMVvHrdBeSAAU/AI-Video-Enhance?node-id=309-643 (read with figma-pm / qa1). No PDF exports. | analysis | both | in progress |
| REQ-002 | 2026-11-03 | user | PM scope: the page 「Spec - Video Enhance with Byteplus」 (309:643) and the draft page's section 「Logic 補充 - 對齊 Design 26.09 v2」 (405:1108) are spec; the page 「spec - AI Video Enhance- Denoise / Lighting (Cloud solution)」 (0:1) is superseded. | analysis | both | open |
| REQ-003 | 2026-11-04 | user | A place on the review pages to read the open questions and type the answers you know: no new tab (user: five pages are already a lot, keep it readable for anyone): a collapsed **Questions for the team** panel on Cases above the table, a `Q-n ?` marker on each row a question touches, answers saved to `question-answers.json` and applied as rulings (SKILL.md step 4, Question answers). | run | both | done |
| REQ-004 | 2026-11-04 | user | After the spec agent comparison (comparisons/20261104_casebook-vs-spec-agent.html): fix the analysis steps that missed the left trim handle, the generations with non-default settings (and the saved file's fps / resolution) and the playhead drag control, then rerun the analysis; never add the spec agent's cases directly. Rules written into analysis.md passes 10 (setting values are variants) and 11 (twin and look-alike controls). The ECL rate table, the 2K+ import block and Android Pro unlocking need sources outside the spec set and are left for now. Compare iOS only (Video Enhance runs on iOS). | analysis | both | open |
