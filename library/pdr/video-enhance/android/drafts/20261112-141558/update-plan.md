# Update plan — pdr/video-enhance / android: approved v6 → draft 20261112-141558

REQ-015 (user, 2026-11-12): the run-cost comparison with the Spec Agent
(`comparisons/2026-11-12_run-cost-vs-spec-agent.html`) found 4 groups Android R1 missed. Each gap was traced to the
analysis step that skipped it and fixed there first (analysis.md pass 4: ranges at both outer ends, rules followed
during a gesture; value check 4: a free route before parking; run-android.md *Judging a drag*;
`device-android.ts record`; the 1 fps fixture in `make-videos.ts`). This draft applies those fixes to the table.
Rows are built by `build-draft.ts` in this folder from the approved `cases.csv`.

## Spec files
- Unchanged: spec set 2026-11-03 (Design HceGLJVaxnKsv7gXSXzKWh page 2974:19965, PM mppB4GYkuVMVvHrdBeSAAU; Figma only).

## Requirement changes
| Requirement | Change | Before | After |
|---|---|---|---|
| R-031 | changed | the Preview shows the frame at the dragged end | the same, during the drag too: a timing rule judged from a screen recording (Q-27) |
| R-077 | changed | buying credits returns to the panel | the same, run with a license tester and Google Play's 「Test card, always approves」 (no charge) |
| R-193 | changed | the frame, bubble and time follow the knob | the same, during the drag too: judged from a screen recording (Q-27) |
| Q-27 | new | — | the allowed Preview delay while dragging; assumption: no visible lag (within about 0.5 s at 4 samples a second) |
| `### Variants` R-043 | changed | 1–30 band: TC-052 (24, 30 fps) | TC-052 takes 1, 24 and 30 fps |
| `### Hidden clauses` | new lines | — | R-031 and R-193 observed through a screen recording |

## Case changes
- Modified (6): TC-052 (adds the 1 fps source, the low end of 1–30), TC-097 (Google Play test card route; no longer
  parked, the go-ahead is the only need), TC-042, TC-214, TC-216, TC-215 (record the whole drag, check several
  moments, not one screenshot; Q-27).
- New (0), Removed (0). Unchanged: the other 162 rows.

## Rerun
All six rows run again in the next Android round: TC-052 with `ve-fps1-1080p` (push it with
`make-videos.ts --only ve-fps1-1080p --push <serial>`), the four drag rows with `device-android.ts record`, and
TC-097 once the user agrees to the test-card purchase. R1's results for these rows stay as recorded.

## Not added
- iOS: REQ-015 names Android. The same gaps hold on the iOS table (TC-052, TC-097 with App Store sandbox, the four drag
  rows); its next draft applies the same analysis passes.
- The Spec Agent's 4K 60 / 120 playback note (Sony decoder): not a rule in the spec; a question for PM if the user
  wants it asked.
