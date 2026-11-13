# Swipe Collage Android — R1 report (run 2026-11-12-r1)

Table v3 (187 rows, draft `20261112-094820`, spec set 2026-11-05: PM PDF + Design Figma `iUy5kOrVNG7IjcyxGGnp9t`),
PhotoDirector 20.19.0 (90201900), fresh install 10:28, Test Server; Samsung Galaxy S23 (SM-S9110, Android 16), dark
theme. Plan: `runs/RUN-PLAN-20261112-R1.md`. Nothing filed, uploaded or commented.

## Tally

| Segment | Area | Pass | Fail | Blocked | Test time |
|---|---|---|---|---|---|
| R1-a | Entry, Template Page / Preview, Photos | 17 | 14 | 6 (5 up front) | 0h 31m |
| R1-b | Canvas, frame / image focus, swap | 20 | 11 | 0 | 0h 40m |
| R1-c | Frame styles, locks, Removal / Enhance (Premium) | 11 | 8 | 6 | 0h 27m |
| R1-d | Background, Add Layer, Layers (Premium) | 13 | 16 | 0 | 0h 22m |
| R1-e | Ratio, Pages (Premium) | 11 | 12 | 2 | 0h 16m |
| R1-f | Export, Save & Share (Premium) | 12 | 7 | 1 (up front) | 0h 25m |
| R1-g | Monetization (Free) | 2 | 7 | 5 | 0h 25m |
| R1-h | Restore, languages, appearance (Free) | 3 | 1 | 3 | 0h 15m |
| **Total** | | **89** | **76** | **22** | **3h 22m** |

Fail dispositions: 68 defect, 8 question. Blocked: 16 defect (upstream of a drafted bug), 6 test-data. Not run: 0.
Inconclusive queue: empty (every row has a verdict).

## Time, tokens, credits, usage

- Wall 6h 10m (10:15 – 16:25 CST), test time 3h 22m, idle 2h 48m in two gaps (13:09 – 14:05; 14:11 – 16:02, the
  R1-g subagent that stopped after its `pm clear`, O-25).
- Tokens in `tokens.jsonl` (1 348 messages, segments and orchestration inside the run's spans; this wrap-up not yet
  included): input 3 338, cache write 2.42 M, cache read 257.4 M, output 533 k (claude-opus-5-5).
- Plan usage: no `usage.jsonl` snapshot was logged for this run, so no percentage is reported.
- Credits: R1-a Free 0 → 300 (`giveaway_monthly`); Premium by the debug switch from 11:30 with 2300 (O-11); one
  Advanced AI Enhance charged 6 (2300 → 2294, TC-172); Standard Enhance free; nothing else charged; Free with 0 after
  the 14:09 `pm clear`.

## Main findings (48 eBug drafts: 36 RD, 12 PM)

Drafts: `library/phd/swipe-collage/android/ebugs/2026-11-12-r1/20261112_eBug_drafts_Swipe-Collage-R1_20.19.0.md`;
review page `…/20261112_eBug_review_Swipe-Collage-R1_20.19.0.html`. Format check 0 errors (2 warnings: entries 46 / 47
start with a setup step). Dedupe (Android pool, read-only): no Swipe / Scrollable Collage ticket exists; 0 matches.

Blocking or important (S2, RD):
- Template thumbnails and the Template Preview never render (ISS-SWC-02; TC-011, 016, 021, 022; blocks TC-018).
- Picker limit is the current page's empty frames, not the canvas's, with no 20 cap (ISS-SWC-07; TC-045, 046).
- Text and bubble content cannot be typed: no text field or keyboard (ISS-SWC-12; TC-029, 101, 164, 174, 175).
- 「Removal」 on the image tool bar opens nothing (ISS-SWC-20; TC-061, 064, 068; blocks 063, 066, 067, 167).
- Free: a PRO template card opens the IAP page instead of the preview (ISS-SWC-42; TC-025; blocks 149, 152).
- Free: no IAP page at the 3rd export or any of 7 (ISS-SWC-44; TC-145, 146).
- No 「Continue editing?」 after a kill; edits lost (ISS-SWC-45; TC-036; blocks 037, 038).
- After `pm clear` every template opens blank and Add Layer › Frame says 「No connection」 (ISS-SWC-46; O-24, O-26).

Other RD defects (S3): more frames than photos (03), first tap on 「+」 only selects (04), grid marks (06), Discard
target (09), Back on the Discard dialog (11), frame tool bar lacks Flip / Shadow / Lock (13), 3rd tap clears focus
(14), image bar labels and clipped 「Delete」 (15), no swap hint (16), Frame thumbnails without counts (17), frame lock
incomplete (18), image Lock inert (19), credit button 「--」 (21), no 「Concert」 (23), eyedropper pin fixed (25), Back
on the colour picker applies (26), extra 「Collage」 in Add Layer (27), Sticker panel (29), Text Bubble 「∅」 (30), ratio
change squashes frames (32), Pages counter / stepper (33), Pages ✓ / ✕ and Discard (34), undo in Pages (35), Pages
move button (36), Pages controls overlap from 5 pages (37), 「1 pages」 / 「1 images」 (38), no PRO / NEW marks on
textures and frames (43), strings not localised (47).

PM decisions (12): name and banner copy (01, UI), picker copy (05, UI), Canvas controls (08, UX), dialog on an unedited
Canvas (10, UX), sheet ✕ / ✓ (24, UX), Add Layer › Image as free layer (28, UX), ratio list (31, UX), Save & Share
layout and save-on-open (39, UX), export size vs Image Quality (40), share targets (41, UX), Enhance price (22),
20-template Day 1 set (48).

## Observations O-1 – O-28

| ID | Summary | Where |
|---|---|---|
| O-1 | Template Page crash (no such table SwipeCollageTemplateContract) on 90201901 over an older install; not on the fresh 90201900 | Not raised — other build; upgrade path to re-check |
| O-2 | Banner shows the PM copy | ISS-SWC-01 |
| O-3 | Templates have more frames than photos | ISS-SWC-03 |
| O-4 | Debug buttons 「Save Template」 / 「import Template」 on every canvas | Not raised — ask RD whether they ship |
| O-5 | First tap on 「+」 only selects | ISS-SWC-04 |
| O-6 | One empty frame left: single-select picker | Not raised (behaviour) |
| O-7 | Discard target; no dialog when unedited | ISS-SWC-09, -10 |
| O-8 | Free at R1-a, credits | Not raised (setup) |
| O-9 | Pinched frame grows past the canvas | Not raised |
| O-10 | Drags on added layers uneven | Not raised (tool) |
| O-11 | Premium by the debug switch (KP-131 held) | Not raised (setup) |
| O-12 | Credit button inert on Premium | ISS-SWC-21 |
| O-13 | Frame style redraws at new size; stale selection box after ↶ | Not raised — re-check in R2 |
| O-14 | Eyedropper pin fixed and left drawn | ISS-SWC-25 |
| O-15 | Canvas position with sheets; first swatch tap ignored | Not raised (partly tool timing) |
| O-16 | Typing with no field acted as Back | Not raised (tool artefact) |
| O-17 | Layers sheet gestures | Not raised (behaviour) |
| O-18 | Pages controls overlap from 5 pages | ISS-SWC-37 |
| O-19 | Export icon saves at once; Ratio sheet doesn't mark the current ratio; new pages white | ISS-SWC-39 (save) |
| O-20 | Every Save & Share opening writes another set | ISS-SWC-39 |
| O-21 | `activate` after a share target clears the task | Not raised (tool note) |
| O-22 | No crowns on Premium | ISS-SWC-43 |
| O-23 | TikTok listed though not installed; resolver before Instagram / Facebook | ISS-SWC-41 |
| O-24 | Blank template after `pm clear` | ISS-SWC-46 |
| O-25 | The `pm clear` and the resume | Not raised (run note) |
| O-26 | Blank templates persist; Frame sheet 「No connection」 | ISS-SWC-46 |
| O-27 | Swipe Collage strings not localised | ISS-SWC-47 |
| O-28 | Edit Room restore dialog returns after Cancel; Free cold-launch ad | Not raised (other feature) |

## Blocked reasons (22)

- Test data (6): TC-005 – TC-008 deeplink URLs not supplied (Q-10); TC-014 no template tagged NEW on the Test Server
  (`blocked-reasons.json`); TC-183 TikTok not installed.
- Upstream of a drafted defect (16): TC-018 (thumbnails, SWC-02); TC-086 – 088 (image Lock, SWC-19); TC-063, 066, 067,
  167 (Removal, SWC-20); TC-132, 133 (no Pages Discard, SWC-34; TC-132 in `blocked-reasons.json`); TC-149, 152 (PRO
  template gated at the card, SWC-42); TC-150, 151 (no PRO marks, SWC-43); TC-037, 038 (no restore, SWC-45).

## Coverage

`node scripts/coverage-page.ts phd/swipe-collage android --draft 20261112-094820 --runs 2026-11-12-r1` → local
`library/phd/swipe-collage/android/coverage.html` (git-ignored). The Android run has no `taps.jsonl`, so no control is
proven pressed: of 76 control groups, 23 have their row run, 1 blocked, 38 not run, 14 n/a; arrows: none (the Design
draws no flow arrows); spec notes 80 / 80 traced (44 run, 10 blocked, 21 not run, 5 n/a); board images 22 / 78 on this
computer. (`coverage-page.ts` was fixed to read this spec set's `boards.json` shape, `{pdf: {boards: [...]}}`.)

## Open questions for PM

All filed as PM drafts (none held): Q-1 / Q-28 name and copy (SWC-01), picker copy (SWC-05), Q-28 / Q-29 Canvas
controls (SWC-08), Q-17 unedited exit (SWC-10), Q-5 sheet ✕ / ✓ (SWC-24), Q-6 Add Layer Image (SWC-28), Q-25 ratios
(SWC-31), Q-28 / Q-29 Save & Share (SWC-39), Q-8 export size (SWC-40), Q-26 share targets (SWC-41), Q-27 Enhance
price (SWC-22), F16 20 templates (SWC-48). Still open, not settled on the phone: Q-10 deeplinks (RD to supply links),
Q-12 East / West sets (blocked by SWC-02), Q-15 IAP count detail (moot until SWC-44 is fixed), Q-16 where 「Continue
editing?」 appears (moot until SWC-45), Q-14 Android Back (SWC-11 and SWC-26 filed to RD under team rule R-134).

## Knowledge

Inbox: 0 open items. O-11 confirms KP-131 (Premium by the debug switch) on this build; no entry contradicted.
