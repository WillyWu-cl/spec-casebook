# Update plan — pdr/video-enhance / ios: approved v1 → draft 20261104-100851

Rerun of the analysis on the same spec set (REQ-004) under the passes added on 2026-11-04: analysis.md pass 10
(**a setting's values are variants**) and pass 11 (**twin and look-alike controls**), plus the new Design arrow
3393-18071 and the board warnings. Rows come from the spec and the passes only (no spec agent cases were read).
Rebuild: `node library/pdr/video-enhance/ios/drafts/20261104-100851/build-draft.ts` (both platforms), then
`controls.ts` and `fill-controls.ts` in the same folder.

## Spec files
- Unchanged: spec set 2026-11-03 (Design HceGLJVaxnKsv7gXSXzKWh, PM mppB4GYkuVMVvHrdBeSAAU; Figma only, no PDF).
- New or changed: `extracted/arrows.json` arrow 3393-18071 (35 arrows); `inventory-overrides.json` adds the left and
  right trim handles of the panel strip (two controls, K-0907bf and K-8a6c94; `inventory.json` rebuilt, nothing else
  changed); `board-lint-acks.json` (14 warnings checked and acknowledged); Alternative & Exception Figma text accepted
  as its baseline (`figma-text.ts --accept`).
- No longer supplied: none.

## Requirement changes
| Requirement | Change | Before | After |
|---|---|---|---|
| R-020 | reworded | 「the thumbnail strip with handles」 | the strip with a left ‹ and a right › trim handle and the playhead (R-192) |
| R-031 | reworded | dragging 「a side handle」 | either handle: the left moves the start, the right the end; each its own row |
| R-033 | reworded | 「the handle stops」 at the Mode limit | the dragged handle (left or right) stops |
| R-035 | reworded | shortest selection 1 s | 1 s whichever handle is dragged |
| R-054 | reworded | 「the handle stops at 2:30」 | either handle stops at 2:30 |
| R-191 | new | — | Design arrow 3393-18071: failed card 「View Details」 → 「An Error Has Occurred」 dialog (walked by TC-171) |
| R-192 | new | — | the playhead: line, time bubble 「00:00」 and ◀▶ knob; the bubble shows the Preview time |
| R-193 | new | — | dragging the playhead knob scrubs the Preview; selection and price unchanged (Q-21) |
| R-194 | new | — | the saved result has the chosen Resolution and fps and the charge is the price those values set; each value used once |
| R-195 | new | — | Professional and Sharp show in the result as their bubbles say |

New requirement IDs start at R-191 on both platforms (Android already holds R-190) so the same rule keeps one ID.

## Case changes
- New (11): IDs start at TC-214 on both platforms (Android holds TC-200–TC-213), so one row keeps one ID.
  - TC-214 (R-031, R-061) left handle dragged right: start moves, length and price follow (after TC-042)
  - TC-215 (R-192, R-193) playhead: bubble and Preview time agree; dragging the knob scrubs only (after TC-043)
  - TC-216 (R-033, R-050) left handle stops at the Standard 8:00 limit (after TC-044)
  - TC-217 (R-035) left handle stops at the 1 s minimum (after TC-046)
  - TC-218 (R-054, R-033) left handle stops at the Professional 2:30 limit (after TC-074)
  - TC-219 (R-194, R-195, R-065) generate with Professional: price, charge, look, saved file (after TC-152)
  - TC-220 (R-194, R-195, R-062) generate with Sharp: price unchanged, look, saved file
  - TC-221 (R-194) generate with 60fps: charge, saved file 60 fps
  - TC-222 (R-194) generate with 120fps: charge, saved file 120 fps
  - TC-223 (R-194, R-044) generate with 720p (720p source): saved file 1280 × 720
  - TC-224 (R-194, R-065) generate with 4K: price, charge, saved file 3840 × 2160
- Modified (6):
  - TC-033: the layout names both trim handles and the playhead (R-020, R-192)
  - TC-093: also presses the 「Pro」 and 「Pro+」 tabs (twins; the Variants grid said 「Pro tab: TC-093」 but no step pressed it)
  - TC-110: source fixed at 1080p 30 fps with the defaults kept, so the main-flow generation is the run for Standard / Natural / 30fps / 1080p (R-194)
  - TC-143: also taps the completed card's thumbnail (look-alike of 「View」; PM D2 「tap → Result」, Q-22)
  - TC-152: checks the saved file's 1920 × 1080 and 30 fps, not only its length (R-194)
  - TC-171: walks the new Design arrow 3393-18071 (R-191 in Spec Ref)
- Removed (0)
- Unchanged: 92

## Found by the analysis
- **Pass 10, setting values (rule 1).** Every Mode, Enhancement style, fps and Resolution value is now used in one
  generation and checked in the saved file and the charge: Standard / Natural / 30fps / 1080p by the main flow
  (TC-110 → TC-152), Professional TC-219, Sharp TC-220, 60fps TC-221, 120fps TC-222, 720p TC-223, 4K TC-224. Before,
  TC-061–TC-063 and TC-070 only tapped the chips and no row looked at the saved file's fps or resolution. Listed in
  `### Variants` as R-194 × <setting>=<value>.
- **Pass 11, twins (rule 2).** The two ends of the selection were not in the inventory at all (the extractor did not
  take them); they are now two controls by override, each traced to its own rows. Every right-handle row now has a
  left-handle twin with its own limit: TC-042 ↔ TC-214, TC-044 ↔ TC-216, TC-046 ↔ TC-217, TC-074 ↔ TC-218. Other
  twin pairs checked: Standard / Professional, Natural / Sharp, Leave / Keep Uploading, Turn On / Later, Close / View,
  Original / Result, Monthly / Yearly (all pressed already) and the IAP Pro / Pro+ tabs (not pressed: TC-093 modified).
- **Pass 11, role from the image (rule 3).** `round/ic_btn_drag` under the 「00:00」 bubble is the playhead (board
  images: a blue line with the time bubble, the knob below the strip; the bubble always equals the Preview time). It was
  traced to TC-042 (the right trim handle); it is now traced to TC-215. Rechecked every trace against the board images;
  beyond the three known misses:
  - `Button/Pill` 「View」 is one group on the completed card and on the Launcher banner: the banner's press (TC-131) was
    missing from the trace.
  - `Nav/Top/Feature` (the panel top bar) holds ‹, the credit pill and the Recent task icon but was traced to ‹ only:
    now TC-038 and TC-140 (the pill stays Q-15). The PM header likewise (TC-038, TC-140, TC-141).
  - `Nav/Top/Result` holds ‹ and the Original / Result tabs: TC-155 added to TC-151.
  - `round/ic_play` covers the panel Preview and the Result player: TC-150 added to TC-037.
  - PM `Nav/Header` ‹ also on the IAP Pro+ page: TC-094 added.
  - The completed card's thumbnail was traced to TC-143, which only tapped 「View」: TC-143 now taps it (Q-22).
  - The PM low-fi 「Trim · drag in / out」 bar has two ends: TC-214 added to TC-042.
- **Pass 1, flow arrows.** 3393-18071 got its `expected`, its edge was checked against the geometry (tail on the
  「View Details」 pill, head on the dialog 3393:18196) and R-191, walked by TC-171.
- **Board warnings.** All 14 were checked on the board images and acknowledged with the reason
  (`board-lint-acks.json`); none needed an override or trace change:
  - 9 Design note-moved: the marker is at the text node's origin and the words are inset in the same label.
  - 1 note-gone: OCR splits 「購買成功 → 回 AI Video Enhance…」 into three lines.
  - 2 stale-marks: the 720p and 4K chips of PM panel 371:237 are where marked; OCR misreads them, and the text at
    1562 / 1800 is the next frame.
  - 2 PM draft-section notes: drawn on the wrong board by the coverage page (a placement issue, reported).
  board-lint is clean on both platforms.
- Annotation trace: 112 blocks, all carried over unchanged (no block text changed); none needed retracing.
- Request ledger: REQ-004 cited (`### Request ledger coverage`); questions.ts: no open answers.

## Not added (value check)
- Everything listed under "Not added" in draft 20261103-174203 still stands (older PM items, server-only billing,
  reinstall-only checks, parked rows); not repeated here.
- Left-handle twins of TC-073 (shorten to 02:20, then Professional) and TC-075 (back to Standard, drag longer): merge —
  the rule they check is the Mode switch (R-053, R-055), not the handle; the left handle's own limits are TC-216 and TC-218.
- Value combinations (e.g. Professional + 4K + 120fps): drop — pass 10 asks one row per value; the spec gives no
  rule for a combination (which combinations exist is Q-6).
- The price each value sets, beyond "the charge equals the CTA price": not added — the rate table and pricing by output
  fps are Q-3 / Q-4, out of scope for this rerun (REQ-004); TC-221 / TC-222 / TC-224 assert only the charge shown.
- 2K+ sources (Q-13) and Android unlocking with Pro: left as REQ-004 says; no rows changed.
- Park, don't drop: TC-219–TC-224 each need one full generation and a made-for-test 00:05 source (1080p 30 fps;
  720p 30 fps for TC-223). Put both videos in the feature's `fixtures.md` before the run, and run the six rows right after
  TC-152 in the Result segment (they reuse its flow). Their cost is small (5 s each), but they are real charges.

## PM-only rows
- TC-216, TC-217: like their right-handle twins TC-044 / TC-046 (PM 9/29 UI, PM B1 [建議]); no Design frame yet.

## Questions for PM
- Q-21 How far may the playhead be dragged, and does play start from it?
- Q-22 Does tapping a completed card open the Result, or only its 「View」 button?

## Questions for you
- None.
