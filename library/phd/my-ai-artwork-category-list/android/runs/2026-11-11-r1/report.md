# My AI Artwork: All categories — Android run 2026-11-11-r1 (phase R1)

Table v2 (32 rows, draft 20261111-120017) on the Samsung S23 (RFCW2198L7B), PhotoDirector **20.19.0 (90201900)**,
Test Server. No TR named. Nothing filed.

## Result
| Pass | Fail | Blocked | Not run |
|---|---|---|---|
| 28 | 0 | 4 (observability) | 0 |

- **TC-004, TC-016 (Pass after the ruling):** — an empty feature tab shows 「Nothing yet.」 and the button
  **「Start to Create」** (`create_more_btn`); R-004 / R-021 say 「Create More」. The spec states the tab bar 「同今天」
  and Q-1 was answered 「同今天 = 目前當下的狀態」, so it was held as a question; the user ruled the spec wrong (REQ-006: 「Create More」 needs works), so both are Pass and the table follows in draft 20261111-135316.
- **Blocked, observability (4):** TC-028 – TC-031, the two analytics events (no event log on Android).
- Everything the 11/E change adds passes: ☰ fixed at the far right (`all_categories_btn`), 「All categories」 rows equal
  to the tab bar in the same order, names only with no count and nothing greyed, the current tab in peach (also when
  entered from a History button), choosing a row closes the sheet on that tab (works, Video filter and position the
  same as a tab tap), ✕ / grabber / dimmed page / system Back close it, multi-select cancelled when switching through
  the sheet (TC-019) or the tab bar (TC-032), no upgrade prompt or charge on a free or VIP account.

## Fixtures and stand-ins
- TC-025 ran on the phone's free state (0 credits, no works). The rest ran on the account the user signed in and then
  filled with works (O-2, O-5): works under AI Creative Studio (3), AI Expand (1), AI Group Shot (2 photos, 2 videos)
  and Image to Video (3 videos), all dated 2026/11/11.
- 「AI Art」 had no works: AI Group Shot stood in for it in TC-014 / TC-015. TC-014's 「old ones included」 could not be
  checked (no older works).

## Observations
- O-3 Dragging the sheet's list down at its top closes the sheet (Android bottom sheet).
- O-4 The sheet opens scrolled so that the current tab's row is in view.
- O-1 / O-2 / O-5 as above (`observations.md`).

## Time and logs
- Wall 0 h 58 m, test time 0 h 39 m (19 min waiting for the account). Logs `R1-a-20261111-130659` and
  `R1-a2-20261111-133641`, sliced: only 「Status check loop error: Job was cancelled」 from tab loaders, no crash.
- Knowledge inbox: nothing open; no observation contradicts a knowledge entry.

## Questions for PM
- None open (empty-tab wording settled by REQ-006).
