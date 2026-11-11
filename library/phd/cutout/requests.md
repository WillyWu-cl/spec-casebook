# Cutout — request ledger

Every request that changes what this feature's tables must cover or how its runs are done, from the user, a
colleague, a reviewer or RD. The spec analysis re-applies every **table** entry on each new or updated draft
(skill: "Standing inputs"), and `check.ts` fails a draft whose `requirements.md` does not cite each open table entry
for its platform. **run** entries are followed by the run rules; **analysis** entries change how the spec is read.
Add new entries at the bottom with the next ID; never renumber. Mark an entry `superseded by REQ-…` in Status instead
of deleting it.

| ID | Date | From | Request | Kind | Platform | Status |
|---|---|---|---|---|---|---|
| REQ-001 | 2026-11-10 | user | Analyse the Cutout spec (「Cutout with Stroke.zip」: 11/E Reset / Undo / Redo spec and the UI UX flow before 11/E, spec set `specs/2026-11-10`) and generate the test cases. | table | android | open |
| REQ-002 | 2026-11-10 | user | Android table only for now; no iOS version (「現在只需要Android 不用IOS的版本」). The iOS draft 20261110-163733 was removed; REQ-001 narrowed to Android. | table | android | done (iOS draft removed) |
| REQ-003 | 2026-11-10 | user | Show the Precondition, Action and Expected Result in Chinese on the draft (「草稿內並沒有把前置條件, 操作步驟和預期結果的中文標示出來」). Kept as a Traditional Chinese (Taiwan wording) reading copy `draft.zh-Hant.csv` / `.xlsx` built by `build-zh.ts`; rows stay English (AGENTS.md). | view | android | done (draft 20261110-163734) |
| REQ-004 | 2026-11-10 | user | Show the Open questions in Chinese too (「幫我把問題也都標上中文」). `questions.zh-Hant.json` beside requirements.md (Taiwan wording, copied to the table on Save); the Cases page's 中文 mode shows it above each English question (`scripts/lib/questions.ts`, `review.ts`, `templates/table.html`). | view | android | done (draft 20261110-163734) |
| REQ-005 | 2026-11-10 | user (Cases page answers) | Q-1, Q-2, Q-3, Q-7, Q-9 answered, confirming the rows' assumptions: each step's state includes the cutout style (Q-1); Undo during a download only cancels that apply, and with no earlier step Undo stays disabled (Q-2); ✕ discards and returns to the Cutout page, ✓ flattens and returns to the Cutout page (Q-3); system Back does what each screen's own close does (Q-7); closing the palette with no colour change is no step (Q-9). | table | android | open |
| REQ-006 | 2026-11-10 | user (Cases page answer to Q-6) | No step limit (「沒有上限」): replaces the spec's open Q3 and its 「步數達到上限：最舊的步驟會被捨棄」 clause. | table | android | open |
| REQ-007 | 2026-11-10 | user (Cases page answer to Q-8) | The cutout object can only be rotated, not flipped (「只能旋轉不能翻轉」): operation #8 (Flip) does not apply. | table | android | superseded by REQ-009 |
| REQ-008 | 2026-11-10 | user (Cases page answer to Q-4) | The app has no 「最近使用」 (Recent) for now (「目前沒有recent, 執行完這條請先開個bug」): keep the spec's row (TC-016); after it runs, file an eBug for the missing Recent first (verified on the build, per the filing rules). | run | android | open |
| REQ-009 | 2026-11-10 | user | Correction of the Q-8 answer: there must be a Flip button (「其中有一點我搞錯了, 應該要有flip這個按鈕, 請遇到這個問題時發bug」). R-027 and TC-024 stay as the spec states; when a run finds no Flip button, record Fail and file an eBug. | table | android | open |
| REQ-010 | 2026-11-10 | user (Cases page answer to Q-5) | 「Figma上面的已經都儲存下來了, 有更新會再更新」: the two PDFs hold everything on Figma (no missing sections, no newer frames); spec updates will be sent as a new spec set. | analysis | android | done |
| REQ-011 | 2026-11-10 | user | 「請執行測試 你可以用S23」: run the draft 20261110-163734 (51 rows) on the S23 (20.19.0, 90201900). Done as phase R1 (`runs/2026-11-10-r1/`, plan RUN-PLAN-20261110-R1.md): 42 Pass, 9 Fail; 7 eBug drafts and their review page in `android/ebugs/2026-11-10-r1/`, nothing filed. | run | android | done (filing waits for the user) |
| REQ-012 | 2026-11-11 | user | File the 7 Cutout eBug drafts as reviewed: TR261106-0051, Creator WILLY_WU, source tag AIAgent, API. Filed PHA262026P0063 – P0069 (`android/ebugs/2026-11-10-r1/filed_bugcodes.md`). | run | android | done |
