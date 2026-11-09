# Update plan — phd/i2v-reuse / ios: new table → draft 20261106-121538

New table, 47 rows, from the same spec set as the Android draft (`specs/2026-11-06`: PM page and Design page). Built from
Android draft 20261106-115758 (`build-from-android.py`), with every Android-only step rewritten or dropped. IDs match
the Android table where the row is the same, so they have gaps here; TC-051 and TC-052 are iOS-only.

## iOS differences
- New rows: TC-051 (AI Processing Notice before the toast, R-026), TC-052 (Pro+ with low credits, R-050, KP-013).
- Rewritten: TC-015 (iOS demo / Steps intro instead of the Android sheet), TC-032 (no iOS prompt limit stated, Q-7), TC-036 (Pro instead of VIP), TC-042 (made on Android), TC-047 and TC-048 (compared with a Create more room), credit checks now use Mine › My Credits (Q-17).

## Not added (value check)
- System Back rows TC-043 to TC-046, R-058 to R-061: retire — Android only. Q-9 goes with them.
- Rapid taps on 「Generate」 (Android TC-027, R-040): drop — its only basis is KP-019, an Android rule; iOS has no such rule yet.
- 「Processing tile shows the source photo」 (part of Android R-037): drop — KP-029 is an Android rule.
- Success metric and event naming rule (R-055): drop — analytics rules for RD; the event names are checked by TC-037 to TC-040.
- Pressing 「More Video Editing Tools」, 「Add Text」, 「Add Sticker」, 「Add Music」: drop — today's controls; TC-049 checks where they sit.
- Colours, sizes and the outlined 「Reuse」 style: drop — the design check's job.

## PM-only rows
- The Design draws Save & Share and My AI Artwork only. Rows for the reused room, toasts, removed model, errors and tracking are PM-only.

## Parked rows (fixtures)
- TC-004 (failed job), TC-015, TC-016, TC-051 (first-entry intros), TC-019 (free-trial account), TC-026 (log pull), TC-029 to TC-031 (removed-model fixture from RD), TC-036, TC-052 (low credits), TC-037 to TC-040 (event log), TC-041 (pre-4/E video), TC-042 (unreadable settings).
- Full video generations (credits): TC-023, TC-024, TC-031, TC-038 to TC-040.

## Questions for PM
- Q-1 to Q-7, Q-10 to Q-16, as on Android; Q-7 asks for the iOS prompt limit.

## Questions for you
- Q-8: how tracking events are observed on iOS. Q-17: the route to the credit usage history.
