# Swipe Collage — request ledger

Every request that changes what this feature's tables must cover or how its runs are done, from the user, a
colleague, a reviewer or RD. The spec analysis re-applies every **table** entry on each new or updated draft
(skill: "Standing inputs"), and `check.ts` fails a draft whose `requirements.md` does not cite each open table entry
for its platform. **run** entries are followed by the run rules; **analysis** entries change how the spec is read.
Add new entries at the bottom with the next ID; never renumber. Mark an entry `superseded by REQ-…` in Status instead
of deleting it.

| ID | Date | From | Request | Kind | Platform | Status |
|---|---|---|---|---|---|---|
| REQ-001 | 2026-10-29 | user | Generate the Swipe Collage test cases from `spec/Collage.pdf` (the Scrollable Collage "Demo + Spec" board), Android table. | table | android | open |
| REQ-002 | 2026-10-30 | user | Translate the English content of the draft into Traditional Chinese with Taiwan wording. Kept as a reading copy (`draft.zh-Hant.csv` / `.xlsx`, built by `build-zh.ts`); table rows stay in English (AGENTS.md). | view | android | done (draft 20261029-171116) |
| REQ-003 | 2026-10-30 | user | Show the review page in Chinese. The review page (`templates/table.html`, `scripts/review.ts`) got an English / 中文 switch; 中文 shows the page in Taiwan wording and each row's `draft.zh-Hant.csv` text above its English fields (rows stay English). | view | android | done |
| REQ-004 | 2026-10-30 | user | TC-018: test the East thumbnail set with the app language in Traditional Chinese and Japanese, and the West set in English and German. | table | android | open |
| REQ-005 | 2026-11-05 | user | Keep `Swipe Collage PhDM Spec.pdf` (14.6 MB, found in the repo's root `spec/` folder, dated 2026-10-30) as a new spec set `specs/2026-11-05` (original git-ignored). Not read or analysed yet; the approved v1 (169 rows) is still built on `specs/2026-10-29` (Collage.pdf). | analysis | android | open |
| REQ-006 | 2026-11-05 | user | Read the Swipe_collage Design Figma file (`iUy5kOrVNG7IjcyxGGnp9t`, page `0:1`) in full with the `figma` skill's source branch (`figma-design`, qa-dm@cyberlink.com): every phone frame on the page, board images cropped, pointer arrows looked at. Source files committed under `specs/2026-11-05/extracted/figma-source/design/`. | analysis | android | open |
| REQ-007 | 2026-11-12 | user | Readability: no long Precondition or Expected Result lines joined by ";". Each precondition goes on its own numbered line, like Action; each expected check on its own line, unnumbered, with a step prefix ("Step 3:") repeated on every line of that step. Rule in AGENTS.md › Team preferences and `formats.md` (*One item per line*); `check.ts` warns. Reformat the approved tables and save them directly; the Chinese copy follows line for line. | tooling | android | done (Android v3: 49 Precondition and 81 Expected Result cells; Android also 26 older Action / Precondition cells whose steps still ran together (`check.ts` one-step-per-line warnings) split one step per numbered line; wording otherwise unchanged; changes in `history/<draft>-decisions.json`) |
