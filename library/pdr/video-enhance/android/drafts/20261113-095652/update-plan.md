# Update plan — pdr/video-enhance / android: approved v8 → draft 20261113-095652

REQ-017 (user, 2026-11-13): the 2026-11-11 reviewer ruling (REQ-012) says Android sells only Free and Pro, and
R-005 / R-072 already follow it, but 121 rows kept the precondition 「Signed in with a Pro+ account」 (76 since v4, 45
more from the REQ-016 draft, which copied the line) and three rows still named Pro+ or a Pro tab. Only those words
change; every row checks what it checked before. Rows are built by `build-draft.ts` in this folder from the approved
`cases.csv`.

## Spec files
- Unchanged: spec set 2026-11-03 (Figma only).

## Requirement changes
| Requirement | Change | Before | After |
|---|---|---|---|
| R-070 | reworded | a Pro or Pro+ user gets the enabled 「Enhance」 | a Pro user gets it; Android has no Pro+ |
| R-071 | reworded | the IAP page opens on the 「Pro」 tab | the single 「PowerDirector Pro」 IAP page opens (no tabs, R-072) |
| R-076 | reworded | a Pro+ user; the Credit page shows the 「PowerDirector Pro+」 card | a paid user (Pro on Android); the plan card's words recorded on Android |
| Variants | relabelled | R-070 Pro+, R-071 Pro tab, R-072 Pro / Pro+ tabs | Pro is the run account; Pro+ and tabs n/a on Android |

## Case changes
- New (0).
- Modified (123):
  - 121 rows: precondition 「Signed in with a Pro+ account (no tier switch on Android)」 → 「Signed in with a Pro account
    (no tier switch on Android)」 (TC-096, listed below, and TC-001 – TC-003, TC-020, TC-030, TC-033, TC-040, TC-041, TC-045, TC-050, TC-052 – TC-059, TC-076, TC-080, TC-100, TC-110, TC-118, TC-160 – TC-162, TC-219 – TC-262, TC-264 – TC-267, TC-269 – TC-314).
  - TC-090: step 2 opens the single 「PowerDirector Pro」 IAP page, not its 「Pro」 tab (R-071, R-072).
  - TC-091: 「Pro (not Pro+) account」 → 「Pro account」.
  - TC-096: the Credit page's plan card is recorded, not asserted as 「PowerDirector Pro+」 (no Android Credit page is drawn).
- Removed (0). Unchanged: 90.

## Not added
- Nothing: no rule or scenario is new.

## Rerun
No rerun is needed for the wording alone: R1 ran on a Pro account (the only paid tier Android sells). TC-090 and
TC-096 are re-read against their R1 evidence where it exists; otherwise they run in the next round as planned.

## Questions for you
- None.
