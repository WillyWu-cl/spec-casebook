# Batch Editing — request ledger

Every request that changes what this feature's tables must cover or how its runs are done, from the user, a
colleague, a reviewer or RD. The spec analysis re-applies every **table** entry on each new or updated draft
(skill: "Standing inputs"), and `check.ts` fails a draft whose `requirements.md` does not cite each open table entry
for its platform. **run** entries are followed by the run rules; **analysis** entries change how the spec is read.
Add new entries at the bottom with the next ID; never renumber. Mark an entry `superseded by REQ-…` in Status instead
of deleting it.

| ID | Date | From | Request | Kind | Platform | Status |
|---|---|---|---|---|---|---|
| REQ-001 | 2026-10-30 | user | Generate the Batch Editing test cases from `spec/Batch Editing.zip` (「UI UX flow.pdf」 and 「Section 3 · 美圖 Apply to all 實測.pdf」), Android table first. | table | android | open |
| REQ-002 | 2026-10-30 | user | Add a Traditional Chinese (Taiwan wording) reading copy to the review page: `draft.zh-Hant.csv` / `.xlsx`, built by the draft's `build-zh.ts`; table rows stay in English (AGENTS.md). | view | android | done (draft 20261030-151536) |
