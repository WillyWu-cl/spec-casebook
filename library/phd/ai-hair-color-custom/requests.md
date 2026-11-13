# AI Hair Color Custom — request ledger

Every request that changes what this feature's tables must cover or how its runs are done, from the user, a
colleague, a reviewer or RD. The spec analysis re-applies every **table** entry on each new or updated draft
(skill: "Standing inputs"), and `check.ts` fails a draft whose `requirements.md` does not cite each open table entry
for its platform. **run** entries are followed by the run rules; **analysis** entries change how the spec is read.
Add new entries at the bottom with the next ID; never renumber. Mark an entry `superseded by REQ-…` in Status instead
of deleting it.

| ID | Date | From | Request | Kind | Platform | Status |
|---|---|---|---|---|---|---|
| REQ-001 | 2026-11-12 | user | New PhotoDirector feature: AI Hair Color 「26 11E AI Hair Color Custom」. Analyse the PM Figma page https://www.figma.com/design/vhIp15PMJcwOcWJ6E9Q4JE/AI-Hair?node-id=3287-89 (no PDF, no Design file) and produce the test cases (Android only, REQ-002). | analysis | android | done (draft android 20261112-100854) |
| REQ-002 | 2026-11-12 | user | 「AI Hair Color Custom不用做IOS版的」: Android table only; no iOS version. The iOS draft 20261112-100854 was removed; REQ-001 narrowed to Android. | table | android | done (iOS draft removed) |
| REQ-003 | 2026-11-13 | user (eBug review, ISS-HCC-05) | For two-colour Custom styles (Ombré, Balayage …) Base Color is required and Highlight Color is not: Generate with Base only is correct, and the 「both required」 rule (TC-026, TC-027) is wrong. ISS-HCC-05 held. | table | android | done (android v2, 2026-11-13: R-029, TC-026, TC-027) |
| REQ-004 | 2026-11-13 | user (eBug review, ISS-HCC-09) | Tapping the photo above the Custom panel must not close (collapse) the panel; TC-039's expectation is wrong. ISS-HCC-09 held. | table | android | done (android v2, 2026-11-13: R-042, TC-039) |
| REQ-005 | 2026-11-13 | user (eBug review) | Run 2026-11-13-r1 filing decisions on TR261111-0042: file ISS-HCC-01, 03, 04, 06, 07, 08, 10, 11, 12, 13; hold 02, 05, 09, 14, 15. ISS-HCC-10 (no wait text) is a UX bug: `[AIAgent][UX]`, BugBelong PM (the 2026-10-20 UX rule restored, AGENTS.md). | run | android | done (filing 2026-11-13) |
