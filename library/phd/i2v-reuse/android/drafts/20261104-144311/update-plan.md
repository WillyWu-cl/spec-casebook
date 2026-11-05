# Update plan — phd/i2v-reuse / android: new table → draft 20261104-144311

New table, 48 rows, from the PM Figma page alone (Figma-only spec set `specs/2026-11-04`; the Design spec is expected
2026-11-05). Every row is PM-only (pass 7).

## Not added (value check)
- Success metric and event naming rule (R-055): drop — analytics rules for RD; the event names are checked by TC-037 to TC-040.
- PM rationale (D0-01, why 11/E) and 「no competitor comparison」 (D5-01): drop — no behaviour to check.
- 「What today's Prompt Reuse brings back is not questioned」 (D0-07b): drop — states that this page decides, covered by the Reuse rows.
- iOS-only parts of the notes (iOS demo / Steps, AI Processing Notice, 「from=artwork_reuse new on iOS」): not added to the Android table; kept for the iOS table.
- Original video kept after Reuse and Generate (KP-083 risk): merged into TC-023's Expected Result, not a row of its own (a risk is not a row's basis).
- A row per model of the 10 models: not added — the spec names no list; TC-010 and TC-012 cover two models (variants), Q-12.

## PM-only rows
- TC-001 to TC-048 (PM boards pm-flow, pm-ui, pm-tracking, pm-error-handling, pm-draft-tbd): no Design frame yet. When the Design arrives (REQ-003), each row is modified to the Design version or removed if the Design leaves it out.

## Parked rows (fixtures)
- TC-004 (failed job), TC-015 / TC-016 / TC-046 (first-entry explanation sheet), TC-019 (free-trial account), TC-026 (log pull), TC-029 to TC-031 (removed-model fixture from RD), TC-036 (VIP with low credits), TC-037 to TC-040 (analytics event log), TC-041 (pre-4/E video), TC-042 (unreadable settings).
- Full video generations (credits): TC-023, TC-024, TC-027, TC-031, TC-038 to TC-040.

## Questions for PM
- Q-2, Q-3 (RD-pending day-1 rules), Q-4 (toast vs panel), Q-5 (Back from Recent), Q-6 (sunset mockup prompt), Q-7 (which model has 500), Q-9 (system Back on the sheet), Q-10 (summary line without Quality / Sound), Q-11 (inspiration prompt), Q-12 (model list).

## Questions for you
- Q-8: how tracking events are observed on Android (Mixpanel debug view or a log pull).
