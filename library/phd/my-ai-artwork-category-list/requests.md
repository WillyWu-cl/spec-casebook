# My AI Artwork: All categories — request ledger

Every request that changes what this feature's tables must cover or how its runs are done, from the user, a
colleague, a reviewer or RD. The spec analysis re-applies every **table** entry on each new or updated draft
(skill: "Standing inputs"), and `check.ts` fails a draft whose `requirements.md` does not cite each open table entry
for its platform. **run** entries are followed by the run rules; **analysis** entries change how the spec is read.
Add new entries at the bottom with the next ID; never renumber. Mark an entry `superseded by REQ-…` in Status instead
of deleting it.

| ID | Date | From | Request | Kind | Platform | Status |
|---|---|---|---|---|---|---|
| REQ-001 | 2026-11-11 | user | Analyse the My AI Artwork ☰ All categories spec (「my ai artwork category list.pdf」, spec set `specs/2026-11-11`; the PDF had been dropped in `library/phd/my ai artwork category list/` and was moved into the feature as `phd/my-ai-artwork-category-list`) and generate the test cases (「請分析my ai artwork category list的spec並產生test case」). Narrowed to Android by REQ-002. | table | android | open |
| REQ-002 | 2026-11-11 | user | Android table only; no iOS version (「IOS的版本不用」). The iOS draft 20261111-105445 was removed; REQ-001 narrowed to Android. | table | android | done (iOS draft removed) |
| REQ-003 | 2026-11-11 | user (Cases page answers) | Q-1 – Q-7 answered, each confirming the rows' assumption: 「同今天」 means the app's current behaviour (Q-1); treat the PDF as complete (Q-2); ✕, the grabber, the dimmed page and system Back all close the sheet (Q-3); the alphabetical order is checked in English only (Q-4); choosing a category during multi-select ends multi-select (Q-5); the chosen tab is scrolled into view (Q-6); the header 「建議句」 is not checked (Q-7). | table | android | open |
| REQ-004 | 2026-11-11 | user | Update the table from the Figma (「請用這份figma來更新artwork category list」): PM file UX-Issues, page 「26 11E UIUX Revamp」 (https://www.figma.com/design/NacadNfWFAGglU880DupER/UX-Issues?node-id=14451-2196). Its spec section matches the PDF; its 「draft」 section adds the multi-select rule for switching tabs (R-025) and the not-adopted count option. Draft 20261111-120017. | table | android | open |
