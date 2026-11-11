# Update plan — phd/my-ai-artwork-category-list / android: approved v1 → draft 20261111-120017
## Spec files
- Unchanged: my ai artwork category list.pdf · New: the PM Figma page (UX-Issues 「26 11E UIUX Revamp」, REQ-004), read for comparison.
- The Figma spec section (14567:1713) is the PDF: compared pixel by pixel on 2026-11-11, same content (only photo rendering differs).
- The Figma 「draft」 section (14452:6990) is not in the PDF: read from its screenshot as board pm-draft.
## Requirement changes
| Requirement | Change | Before | After |
|---|---|---|---|
| R-025 | new | — | Switching tab in the tab bar during multi-select goes there and cancels the selection (draft 「選取狀態」) |
| R-023 | source added | PM:pm-all-categories | + PM:pm-draft (same rule, also stated in the draft) |
| R-014 | source added | PM:pm-all-categories; PM:pm-overview | + PM:pm-draft (count option marked 「未採用」) |
## Case changes
- New (1): TC-032 (R-025) multi-select on 「AI Creative Studio」, tap the 「AI Art」 tab → selection cancelled. Placed right after TC-019.
- Modified (0) · Removed (0) · Unchanged: 31
## Found by the analysis
- Annotation trace: 5 new blocks from pm-draft; 2 → R-014 / R-023, R-025; 3 traced `older` (8/E multi-select and Recent spec, the not-adopted count option).
## Not added (value check)
- The 8/E Recent spec in the draft section (Photo / Video layout, 25-per-call paging up to 100, 「You've reached the end. Showing your 100 most recent creations.」, Headshot V2 packs) and the 8/E multi-select spec (stroke + number, failed results selectable): unchanged by 11/E; R-005 holds them 「as today」 (Q-1 answered). Not made into regression rows (user, 2026-11-11: 「No, review as is」).
- The count option (「名稱 (x)」, 「(999+)」): marked 「未採用」 (RD 10/28); R-014 checks that no count is shown.
## Figma owed
- The control inventory (step 10): use_figma is refused for qa1 on this file (Full seat needed), so controls were not read from layers (figma-pending.json).
## Questions for PM
- None new.
