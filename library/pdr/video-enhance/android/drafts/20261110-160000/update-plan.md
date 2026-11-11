# Update plan — pdr/video-enhance / android: approved v3 → draft 20261110-160000

REQ-008 (user, 2026-11-10): cover all 271 spec agent cases (TC-VE2-*, snapshot `spec-agent/android.json`, YAMLs read
2026-11-10) on the Android table. The spec agent's rules were checked one by one by a colleague, so they are a source:
where our spec set is silent or older they win (ECL rate table, Android tier, 2K+ block, strip scale pending PM); where
they follow an older spec than our Figma (toast and bubble copy, Professional at entry) the row is written to our newer
spec. Every Mode × Enhancement style × fps × Resolution combination is a row (analysis.md pass 10, `### Combinations`).
Rows are built by `build-draft.ts` in this folder from the approved `cases.csv`. Fresh mapping against these rows:
`comparisons/20261110b_casebook-vs-spec-agent.mapping.json` (271 of 271 `cov`).

## Spec files
- Unchanged: spec set 2026-11-03 (Design HceGLJVaxnKsv7gXSXzKWh, PM mppB4GYkuVMVvHrdBeSAAU; Figma only, no PDF).
- New source: the spec agent's Video Enhance cases [Req: REQ-008] — ECL rate table form 22061491221 (their fixtures),
  colleague feedback 2026-10-07 (Android tier), user requirements 2026-10-16 (2K+ import block) and 2026-10-21
  (total duration rounding), the company performance standard.
- No longer supplied: none.

## Requirement changes
| Requirement | Change | Before | After |
|---|---|---|---|
| R-015 | changed | over 4K, under 1 s, not MP4 / MOV greyed with the toast | under 1 s and not MP4 / MOV only; 2K+ moves to R-196 |
| R-034 | changed | strip scale from the video length only; a Mode switch does not re-lay it | one strip width = the active Mode limit (8:00 / 2:30), re-laid on a Mode switch (decision 5, Q-24) |
| R-044 | changed | 1081p and above → 4K | 1081p up to below 2K → 4K; 1440p+ never reaches the panel (R-196) |
| R-060 | changed | rate of Mode, Resolution and fps | rate of Mode, Resolution and output fps by the ECL table |
| R-062 | source added | PM §6.1 | + ECL: natural and hd carry the same rates |
| R-063 | changed | only 1080p Standard 30 fps = 2/s (Q-4) | the full ECL table (36 rates) |
| R-065 | changed | the source fps prices the task (Q-3) | the output fps chip prices it (Standard 720p / 1080p: same rate at every fps) |
| R-070 | changed | Pro+ only; Free and Pro see 「Unlock Pro+ to Enhance」 | Android: Pro unlocks; Free sees a Pro unlock action; Pro / Pro+ get Enhance (decision 3, Q-25) |
| R-071 | changed | a Pro user's IAP opens on the Pro+ tab | Android: the unlock action opens the IAP on the Pro tab; the Pro+ tab rule is iOS |
| R-087 | changed | Keep Uploading continues the upload | + the CTA behind the dialogs stays disabled (spec agent TC-VE2-234) |
| R-088 | changed | Leave returns to the panel | + with 「Enhance」 enabled again (TC-VE2-235) |
| R-122 | changed | Save Result saves to the phone | + as a new file, listed under 「All」 and usable on a timeline (TC-VE2-236) |
| R-194 | changed | each value used in a generation | + every combination priced, generated and checked (`### Combinations`) |
| R-196 | new | — | a 2K+ source (1440p and up) is rejected before the panel (decision 4, Q-23) |
| R-197 | new | — | the panel never opens in Professional; boundaries 1 s / 30 s / 149.99 s / 150 s / 150.01 s / 750 s on the switch (decision 6) |
| R-198 | new | — | the visible part of the one-year retention (decision 9) |
| R-199 | new | — | the Preview total rounds up: 150.01 s → 「00:00/02:31」 (decision 8) |
| R-200 | new | — | pause on the source Preview (decision 8) |
| R-201 | new | — | pause on the Result (decision 8) |
| R-202 | new | — | every media picker source: local albums, named albums, Pexels, Pixabay (decision 8) |
| R-203 | new | — | the charge is one credit-history debit 「AI Video Enhance」 for the price (decision 8) |
| R-204 | new | — | generation time 1.5 – 2.5 × the selected length (decision 8) |
| Q-3, Q-4 | answered | open | answered by the ECL table (REQ-008), moved to Answered questions |
| Q-6, Q-13 | updated | — | rows renamed; Q-13 partly settled by R-196 |
| Q-23 – Q-25 | new | — | 2K+ message and threshold; strip scale pending PM; Android unlock wording and badge |

## Case changes
- Unchanged: 98. Modified: 25. New: 45. Removed: 0. Active: 168 (v3: 123).
- Modified (25):
  - TC-219 – TC-224 (decision 1): the six setting-value rows become combination rows of their value
    (TC-219 Professional / Natural / 30fps / 1080p, TC-220 Standard / Sharp / 30fps / 1080p, TC-221 Standard / Natural /
    60fps / 1080p, TC-222 Standard / Natural / 120fps / 1080p, TC-223 Standard / Natural / 30fps / 720p, TC-224 Standard /
    Natural / 30fps / 4K), moved to the new section 「Setting combinations」 after the Result rows.
  - TC-083, TC-087 (decision 2): exact ECL prices; TC-087 now expects the fps chip to price the task.
  - TC-090, TC-091, TC-094, TC-095 (decision 3): Android unlocks with Pro.
  - TC-022, TC-058 (decision 4): 2K+ sources rejected; the 4K default only below 2K.
  - TC-045 (decision 5): strip scale per active Mode limit.
  - TC-071, TC-160 (decision 6): interval kept after the refusal; shorten and retry on a Timeline clip.
  - TC-215, TC-216 (decision 7): playhead dragged earlier and back and forth; Preview frame while the left handle goes earlier.
  - TC-037, TC-150 (decision 8): pause on the source Preview and on the Result.
  - TC-152, TC-112, TC-113, TC-170 (REQ-008, cases the v3 mapping called covered with a remainder): the saved file
    used on a timeline (TC-VE2-236); Enhance disabled through the upload (TC-VE2-234) and enabled after Leave
    (TC-VE2-235); the NSFW failure setup in Notes (TC-VE2-173).
- New (45):
  - TC-225 – TC-254 (decision 1): the other 30 combinations (R-194, R-063, R-203).
  - TC-255 – TC-258 (decision 8): media picker sources, Pexels, Pixabay, named album (R-202), after TC-020.
  - TC-259 (decision 8): 150.01 s reads 「00:00/02:31」 (R-199), after TC-033.
  - TC-264 (decision 5): strip scale at 150.01 s and 481 s (R-034), after TC-045.
  - TC-263 (decision 6): Professional refused at 02:31, allowed at 02:30 (R-052, R-053), after TC-076.
  - TC-260 – TC-262 (decision 6): sources 1 s / 30 s, 149.99 s / 150 s, 150.01 s / 750 s open in Standard, then
    Professional (R-197), after TC-263.
  - TC-269 (REQ-008): credit rounding at 0.9 / 1 / 1.01 / 2.99 / 3 / 3.99 / 179.01 / 179.99 / 180 s (TC-VE2-175 – 184;
    R-060, R-063), after TC-080.
  - TC-265 – TC-267 (decision 8): generation time for 1 s, 3.2 s and 30 s (R-204), after TC-143.
  - TC-268 (decision 9): the task still on Recent task days later (R-198), after TC-144.

## Combination rows and prices (3.2 s fixture = 4 billable seconds; 1 s check = the rate)
| Combination (Mode / style / fps / Resolution) | Row | Rate /s | 3.2 s price |
|---|---|---|---|
| Standard / Natural / 30 / 720p | TC-223 | 1 | 4 |
| Standard / Natural / 30 / 1080p | TC-225 | 2 | 8 |
| Standard / Natural / 30 / 4K | TC-224 | 3 | 12 |
| Standard / Natural / 60 / 720p | TC-226 | 1 | 4 |
| Standard / Natural / 60 / 1080p | TC-221 | 2 | 8 |
| Standard / Natural / 60 / 4K | TC-227 | 6 | 24 |
| Standard / Natural / 120 / 720p | TC-228 | 1 | 4 |
| Standard / Natural / 120 / 1080p | TC-222 | 2 | 8 |
| Standard / Natural / 120 / 4K | TC-229 | 8 | 32 |
| Standard / Sharp / 30 / 720p | TC-230 | 1 | 4 |
| Standard / Sharp / 30 / 1080p | TC-220 | 2 | 8 |
| Standard / Sharp / 30 / 4K | TC-231 | 3 | 12 |
| Standard / Sharp / 60 / 720p | TC-232 | 1 | 4 |
| Standard / Sharp / 60 / 1080p | TC-233 | 2 | 8 |
| Standard / Sharp / 60 / 4K | TC-234 | 6 | 24 |
| Standard / Sharp / 120 / 720p | TC-235 | 1 | 4 |
| Standard / Sharp / 120 / 1080p | TC-236 | 2 | 8 |
| Standard / Sharp / 120 / 4K | TC-237 | 8 | 32 |
| Professional / Natural / 30 / 720p | TC-238 | 2 | 8 |
| Professional / Natural / 30 / 1080p | TC-219 | 4 | 16 |
| Professional / Natural / 30 / 4K | TC-239 | 12 | 48 |
| Professional / Natural / 60 / 720p | TC-240 | 4 | 16 |
| Professional / Natural / 60 / 1080p | TC-241 | 8 | 32 |
| Professional / Natural / 60 / 4K | TC-242 | 24 | 96 |
| Professional / Natural / 120 / 720p | TC-243 | 8 | 32 |
| Professional / Natural / 120 / 1080p | TC-244 | 16 | 64 |
| Professional / Natural / 120 / 4K | TC-245 | 48 | 192 |
| Professional / Sharp / 30 / 720p | TC-246 | 2 | 8 |
| Professional / Sharp / 30 / 1080p | TC-247 | 4 | 16 |
| Professional / Sharp / 30 / 4K | TC-248 | 12 | 48 |
| Professional / Sharp / 60 / 720p | TC-249 | 4 | 16 |
| Professional / Sharp / 60 / 1080p | TC-250 | 8 | 32 |
| Professional / Sharp / 60 / 4K | TC-251 | 24 | 96 |
| Professional / Sharp / 120 / 720p | TC-252 | 8 | 32 |
| Professional / Sharp / 120 / 1080p | TC-253 | 16 | 64 |
| Professional / Sharp / 120 / 4K | TC-254 | 48 | 192 |

All 36 generations together cost 1 216 credits.

## Found by the analysis
- Annotation trace: unchanged (same spec set; no new or changed blocks).
- Control trace: `controls.ts` carried every group; 「Unlock Pro+ to Enhance」 is now pressed by TC-090 only (TC-091 is
  an Android Pro account with Enhance enabled). Pause, Pexels / Pixabay tabs and the album chooser are not in the
  Figma inventory (not drawn).
- Pass 9 hidden clauses: R-196 → TC-022, R-198 → TC-268, R-203 → TC-219, TC-223 (and every combination row).
- Pass 10 variants and combinations: R-034, R-070, R-071, R-197, R-202, R-204 lines; `### Combinations` 36 of 36.

## Not added (value check)
- The spec agent's price checks at 30 s, 90 s and the Mode cap (TC-VE2-114 – TC-VE2-149): merged — each combination
  row checks the rate line, the 1 s price (= the rate) and the 3.2 s price (4 × the rate) of its combination; TC-042,
  TC-080 and TC-214 check that the price follows the length.
- R-005 (the 「Pro+」 badge on the clip toolbar tool): kept as drawn; on Android it may name Pro (Q-25), recorded.

## PM-only rows
- Unchanged from v3.

## Questions for PM
- Q-23 2K+ rejection message and the exact threshold.
- Q-24 strip scale: confirm PM 9/29 ⑥ as the spec agent reads it.
- Q-25 Android unlock wording and the toolbar badge.
