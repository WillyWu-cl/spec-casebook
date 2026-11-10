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
| REQ-003 | 2026-11-09 | user | Read the Batch Edit Design Figma from the per-frame PDF exports (Figma MCP quota ran out mid source read), compare it with the table and build the v2 draft from it together with the re-exported PM page `UI UX flow 2.pdf` (spec set 2026-11-09). | table | android | open |
| REQ-004 | 2026-11-09 | user | Where the Design frames and `UI UX flow 2.pdf` word the UI differently, rows follow the Design copy (「Next」, 「Save N photos」, 「…marked with ! on the thumbnails.」); the PM wording stays in the Open questions. | table | android | open |
| REQ-005 | 2026-11-09 | user | 「請在 Samsung S23 上做 batch editing 的測試」: run the v2 draft (20261109-150747, 161 rows) on the installed build 20.19.0 (90201900); no TR, nothing filed (RUN-PLAN-20261109-R1). | run | android | done (run 2026-11-09-r1: 130 Pass, 20 Fail, 11 Blocked) |
| REQ-006 | 2026-11-10 | user (via orchestrator) | Phase R1 wrap-up: eBug drafts and review page in `ebugs/2026-11-10-r1/`, deduped per OS; with no TR for the build the review page leaves Creator, TRCode and method open (no prefill); nothing filed, uploaded, commented or committed. | run | android | done (11 drafts, 5 PM questions held) |
