# Update plan — phd/my-ai-artwork-category-list / android: approved v2 → draft 20261111-135316
## Spec files
- Unchanged (spec set 2026-11-11 and the PM Figma page). Change from a ruling: REQ-006.
## Requirement changes
| Requirement | Change | Before | After |
|---|---|---|---|
| R-004 | modified | an empty tab shows 「Create More」 | an empty tab shows 「Nothing yet.」 and 「Start to Create」; 「Create More」 only on a tab with works (REQ-006: the spec's wording was wrong) |
## Case changes
- New (0)
- Modified (2): TC-004, TC-016 — expected 「Nothing yet.」 and 「Start to Create」 instead of 「Create More」 (REQ-006, from run 2026-11-11-r1).
- Removed (0) · Unchanged: 30
## Found by the analysis
- Run 2026-11-11-r1 (TC-004, TC-016) showed the spec's 「有 Create More」 described a tab with works; the user ruled the spec wrong (REQ-006).
## Not added (value check)
- A row that checks 「Create More」 on a tab with works: not asked for; that button is today's behaviour of a filled tab (R-005, Q-1).
## Questions for PM
- None (the empty-tab wording question is settled by REQ-006).
