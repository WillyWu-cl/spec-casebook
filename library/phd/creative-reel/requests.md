# Creative Reel — request ledger

Every request that changes what this feature's tables must cover or how its runs are done, from the user, a
colleague, a reviewer or RD. The spec analysis re-applies every **table** entry on each new or updated draft
(skill: "Standing inputs"), and `check.ts` fails a draft whose `requirements.md` does not cite each open table entry
for its platform. **run** entries are followed by the run rules; **analysis** entries change how the spec is read.
Add new entries at the bottom with the next ID; never renumber. Mark an entry `superseded by REQ-…` in Status instead
of deleting it.

| ID | Date | From | Request | Kind | Platform | Status |
|---|---|---|---|---|---|---|
| REQ-001 | 2026-11-02 | user | Generate the Creative Reel (Reel Creator room) test cases from `spec/Creative Reel.pdf`, Android table, PDF-only (no Figma sign-in on this machine). | table | android | open |
| REQ-002 | 2026-11-03 | user | Add a Traditional Chinese (Taiwan wording) reading copy of the draft for the review page (`draft.zh-Hant.csv` / `.xlsx`, built by `build-zh.ts`); table rows stay in English (AGENTS.md). | view | android | done (draft 20261102-175916) |
| REQ-003 | 2026-11-03 | user | TC-008: the credit button and the History button are no longer an open question; follow PHD domain knowledge K75 (credit button shows the balance and [+], opens Buy Credit) and K76 (History button opens My AI Artwork on the feature's tab). | table | android | open |
| REQ-004 | 2026-11-03 | user | Check the draft against the rest of the PHD domain knowledge (K01–K74, `library/phd/domain/`) and apply what fits Creative Reel (R-102 – R-113, Q-18 – Q-20). | table | android | open |
| REQ-005 | 2026-11-03 | user | Compare the casebook draft with the contracts and test cases `rdqe-spec-contract-agent` generated for Creative Reel (coverage and case content). Report only: `comparisons/2026-11-03_casebook-vs-rdqe-contract-agent.html` + `.mapping.json`; no rows added from it. | report | android | done |
| REQ-006 | 2026-11-03 | user | Fix the three analysis gaps the rdqe comparison found: the decisions ledger named in the board title (Q-21), the 10 MB unit (Q-22; TC-048, TC-126) and 9:16 output for every feature (TC-101, TC-127); the reading step and passes 4 / 10 changed so future specs get them. | analysis | android | done |
| REQ-007 | 2026-11-05 | user | Move the PHD domain knowledge from `library/phd/domain/` to `library/phd/knowledge/` (the domain-knowledge store upstream already imported, K ids kept as `aka`). Draft 20261102-175916 now cites `[KB: KP-…]` instead of `[Domain: K<nn>]` and lists the rules it leaves out under requirements.md › Domain rules; KP-015, KP-018 and KP-027 were missing from REQ-004's lists and are left to the next draft. | analysis | android | done |
| REQ-008 | 2026-11-12 | user | Readability: no long Precondition or Expected Result lines joined by ";". Each precondition goes on its own numbered line, like Action; each expected check on its own line, unnumbered, with a step prefix ("Step 3:") repeated on every line of that step. Rule in AGENTS.md › Team preferences and `formats.md` (*One item per line*); `check.ts` warns. Reformat the approved tables and save them directly; the Chinese copy follows line for line. | tooling | android | done (Android v2: 41 Precondition and 56 Expected Result cells; Android also 19 older Action / Precondition cells whose steps still ran together (`check.ts` one-step-per-line warnings) split one step per numbered line; wording otherwise unchanged; changes in `history/<draft>-decisions.json`) |
