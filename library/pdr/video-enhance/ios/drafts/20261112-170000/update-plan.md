# Update plan — pdr/video-enhance / ios: approved v5 → draft 20261112-170000

REQ-016 (user, 2026-11-12): the 11/10 comparison counted all 271 spec agent cases as covered because a row checks
the same rule. Re-read at scenario level against spec agent commit 8b411402 (the cases are now committed:
`test-specs/features/video-enhance/review/run-references/20261110-android/cases/`), 119 cases on Android (107 partly, 12 not at all) and 118 on iOS (105, 13) matched only in part
because no row ran their fixture, direction, exact boundary or price lengths. This draft adds those scenarios. The gap
was in the analysis: `analysis.md` pass 4 now has *Scenarios, not only rules*. Rows are built by `build-draft.ts`
in this folder (the same file for both platforms) from the approved `cases.csv`.

## Spec files
- Unchanged: spec set 2026-11-03 (Design HceGLJVaxnKsv7gXSXzKWh page 2974:19965, PM mppB4GYkuVMVvHrdBeSAAU; Figma only).

## Requirement changes
None: every requirement stands; only its rows change (requirements.md notes the draft and the REQ-016 ledger line).

## Case changes
- New (45):
  - TC-270 default selection at exact lengths (1 s, 479 s, one frame either side of 8:00, 480 s, 481 s; the price at 8:00)
  - TC-271 the selection body dragged both ways with 30 s, 90 s and 180 s selections on a 05:24 source
  - TC-272 the left handle lengthening a selection under the cap
  - TC-273 no fractional overrun at the four handle caps, from 1 s under each
  - TC-274 Mode switches both ways at 140 / 149 / 150 / 151 s with a later start, and the price each way (taps 「720p」)
  - TC-275 the 149.99 s / 150.01 s switch boundaries with a later start
  - TC-276 a Timeline clip whose selection starts after 00:00
  - TC-277 strips of sources within both caps (00:30, 02:30.00)
  - TC-278 – TC-313 one price list per combination at 30 s, 90 s and the Mode limit (no credits) — Q-26 prices
  - TC-314 Add to Timeline leaves a project that already uses the source unchanged
- Modified (39):
  - TC-003 (the 「Enhance」 group, Demo not yet off)
  - TC-043 (both ways, full 08:00), TC-044 (recorded, the later drag)
  - TC-045 / TC-264 (back to Standard, the tail reachable), TC-075 (start and end, the 8:00 stop)
  - TC-052 – TC-058 (29 / 59 / 119 / 144 fps, 1 fps, 360p / 718p / 722p, the Preview label)
  - TC-097 (balance arithmetic), TC-113 (credit history: one debit, no refund)
  - TC-037 (trimmed, non-default panel through full screen), TC-141 (only completed cards), TC-142 (⌂ while processing)
  - TC-150 (slider both ways), TC-151 (same-moment frames)
  - 19 combination rows timed against R-204 (TC-219 – TC-238 except TC-223)
- Removed (0). Unchanged: 115.

## Not added
- TC-VE2-077 (a task just under one year old is still listed): needs a 364-day-old task; R-117 stays NOT TESTABLE,
  TC-268 covers what a run can see (2 days, close and reopen).
- TC-VE2-078 (the task's own cloud processing record): server side, not visible to a tester (value check 2); TC-116
  observes it finishing in the background.
- TC-VE2-175 (0.9 s priced at 1 credit): the casebook refuses a source under 1 s (R-015, TC-269 step 1, Q-13 open).
  Decide with PM which holds; no row changed.
- Older-spec cases (4K / 8K rejected, Professional at entry, toast copy), iOS tier: today's board wins (REQ-011).

## Fixtures
New videos in `fixtures/make-videos.ts`: ve-fps29 / 59 / 119 / 144-1080p, ve-res360p / 718p / 722p, ve-0759,
ve-075997, ve-080003, ve-0600, ve-0524 and ve-0030 (1080p30). Make them with
`node library/pdr/video-enhance/fixtures/make-videos.ts --only <names>`.

## Rerun
Every new and modified row runs in the next round. Credits: the price lists cost nothing; TC-314 and the 19 timed
combination rows ride on generations the table already makes (one more 3.2 s task for TC-314).
TC-097 stays parked (purchase).
