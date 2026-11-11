# Update plan — pdr/video-enhance / ios: approved v2 → draft 20261110-180000

REQ-008 (user, 2026-11-10): cover all 271 spec agent cases (TC-VE2-*, snapshot `spec-agent/android.json`, YAMLs read
2026-11-10), Android first, then iOS. This draft brings the iOS table to the coverage of the approved Android v4
(168 rows, built from `android/drafts/20261110-160000/`) under the same row IDs (SKILL.md step 0: the second platform
starts from the first platform's rows, adjusted for platform differences). The Android-only System back rows
TC-200 – TC-213 are not brought over. Rows are built by `build-draft.ts` in this folder from the approved
`ios/cases.csv`: for every row Android v4 modified, the fields that changed between Android v3 and v4 are taken over
and rewritten for iOS controls; every Android v4 new row is taken the same way. Fresh mapping against these rows:
`comparisons/20261110b_casebook-vs-spec-agent.mapping.json` (271 of 271 `cov`).

## Spec files
- Unchanged: spec set 2026-11-03 (Design HceGLJVaxnKsv7gXSXzKWh, PM mppB4GYkuVMVvHrdBeSAAU; Figma only, no PDF).
- New source: the spec agent's Video Enhance cases [Req: REQ-008] — ECL rate table form 22061491221 (their fixtures:
  the Android rate source), colleague feedback 2026-10-07 (tier per platform: Pro on Android, Pro+ on iOS), user
  requirements 2026-10-16 (2K+ import block; TC-VE2-097 / 098 reviewed for PDRi) and 2026-10-21 (total duration
  rounding; TC-VE2-276 reviewed for PDRi, ticket DRI261897P0040), the company performance standard.
- No longer supplied: none.

## Platform decisions (iOS against Android v4)
1. **Tier: iOS keeps Pro+.** Android v4's decision 3 (Pro unlocks; TC-090, TC-091, TC-094, TC-095 modified) is Android
   only. The spec agent's own cases give iOS Pro+: TC-VE2-040 「Pro on Android and Pro+ on iOS」, TC-VE2-041 「Android
   Pro; iOS Pro+」, TC-VE2-241 「Android Pro or iOS Pro+ exposes the enabled Enhance」 and 「iOS Pro eligibility is not
   inferred from Android Pro」. So TC-090, TC-091, TC-094, TC-095 stay as approved (「Unlock Pro+ to Enhance」, IAP on the
   Pro+ tab, App Store Pro+ purchase); R-070 only gains the spec agent as a source; R-071 and R-179 are unchanged. Q-25
   (Android unlock wording) is not an iOS question and is not used on iOS.
2. **Pricing: the ECL table's prices are stated, with Q-26.** The spec agent's rates (form 22061491221, actions
   genvideo_1_sec_byteplus_…) are the fixture of its Android case set; every pricing case marks 「Platform-specific ECL
   rate source」 and TC-VE2-047 / TC-VE2-115 say 「Use the Android or iOS ECL source for the tested platform … Do not use
   the other platform source as authority」. Neither the YAMLs nor the snapshots (`spec-agent/android.json`,
   `spec-agent/ios.json`) state any iOS rate. Decision: the iOS rows state the same 36 rates and prices as Android
   (R-063 unchanged in numbers), and Q-26 asks for the iOS ECL rate table; each row whose Notes say 「Credit numbers are
   binding」 (TC-083, TC-087, TC-269 and the 36 combination rows) adds that a different number shown is checked against
   the iOS ECL table before it is filed. The rule that the output fps chip prices the task (Q-3) holds on iOS.
3. **Media picker: 「Recents」.** The saved result is found under 「Recents」 in PowerDirector's iOS media picker (spec agent
   TC-VE2-236: 「All on Android; Recents on iOS」): TC-152 steps 3 and its Expected Result; TC-255 takes Recents and named
   albums. Pexels and Pixabay are PowerDirector's in-app stock sources, so TC-256 and TC-257 apply as on Android.
4. **iOS controls.** Every 「Signed in with a Pro+ account (no tier switch on Android)」 becomes the iOS Pink tier switch
   (「Tier Pro+ (Launcher › Pink › ☰ › [0] IAP › status = Pro+, checked in Mine)」); the saved-file check reads the
   Photos info (as the approved iOS value rows did) instead of the gallery Details / adb + ffprobe; TC-268 closes the app
   from the App Switcher and reopens it from the Home screen. No new row needs a fresh install (PowerDirector is never
   uninstalled on the QA iPhone).
5. **2K+ block, strip scale, older-spec rewrites, not-from-spec rows, retention, the five closed partial covers:** as on
   Android (the 2K+ block and the rounding rule are the two spec agent rule sets reviewed for PDRi). TC-259 names the
   spec agent's iOS ticket DRI261897P0040 for information only.

## Requirement changes
| Requirement | Change | Before | After |
|---|---|---|---|
| R-015 | changed | over 4K, under 1 s, not MP4 / MOV greyed with the toast | under 1 s and not MP4 / MOV only; 2K+ moves to R-196 |
| R-034 | changed | strip scale from the video length only; a Mode switch does not re-lay it | one strip width = the active Mode limit (8:00 / 2:30), re-laid on a Mode switch (Q-24) |
| R-044 | changed | 1081p and above → 4K | 1081p up to below 2K → 4K; 1440p+ never reaches the panel (R-196) |
| R-060 | changed | rate of Mode, Resolution and fps | rate of Mode, Resolution and output fps by the ECL table |
| R-062 | source added | PM §6.1 | + ECL: natural and hd carry the same rates |
| R-063 | changed | only 1080p Standard 30 fps = 2/s (Q-4) | the full ECL table (36 rates); on iOS pending the iOS ECL rates (Q-26) |
| R-065 | changed | the source fps prices the task (Q-3) | the output fps chip prices it (Standard 720p / 1080p: same rate at every fps) |
| R-070 | source added | Design + PM 9/24: Pro+ only | + spec agent TC-VE2-040 / 041 / 241: Pro+ on iOS (Android's Pro rule not taken) |
| R-087 | changed | Keep Uploading continues the upload | + the CTA behind the dialogs stays disabled (TC-VE2-234) |
| R-088 | changed | Leave returns to the panel | + with 「Enhance」 enabled again (TC-VE2-235) |
| R-122 | changed | Save Result saves to the phone | + as a new item in Photos, listed under 「Recents」 in the media picker and usable on a timeline (TC-VE2-236) |
| R-194 | changed | each value used in a generation | + every combination priced, generated and checked (`### Combinations`) |
| R-196 – R-204 | new | — | as Android v4: 2K+ rejected, Professional never at entry, retention, rounding, pauses, picker sources, credit history debit, generation time |
| Q-3, Q-4 | answered | open | answered by the ECL table (REQ-008); numbers on iOS wait on Q-26 |
| Q-6, Q-13 | updated | — | combination rows; Q-13 partly settled by R-196 |
| Q-23, Q-24 | new | — | 2K+ message and threshold; strip scale pending PM |
| Q-26 | new | — | iOS ECL rate table not confirmed |

R-071 and R-179 stay as approved (iOS Pro+ rule). Unchanged requirement IDs and the Variants lines of R-070 / R-071 keep
their v2 text.

## Case changes
- Unchanged: 88. Modified: 21. New: 45. Removed: 0. Active: 154 (v2: 109). Android v4 has 168 = these 154 + the 14
  Android-only System back rows.
- Modified (21), each as its Android v4 twin rewritten for iOS:
  - TC-219 – TC-224: the six setting-value rows become combination rows of their value, moved to 「Setting
    combinations」 after the Result rows.
  - TC-083, TC-087: exact ECL prices (Q-26 noted); TC-087 expects the fps chip to price the task.
  - TC-022, TC-058: 2K+ sources rejected; the 4K default only below 2K.
  - TC-045: strip scale per active Mode limit.
  - TC-071, TC-160: interval kept after the refusal; shorten and retry on a Timeline clip.
  - TC-215, TC-216: playhead dragged earlier and back and forth; Preview frame while the left handle goes earlier.
  - TC-037, TC-150: pause on the source Preview and on the Result.
  - TC-152, TC-112, TC-113, TC-170: the saved item used on a timeline from 「Recents」 (TC-VE2-236); Enhance disabled
    through the upload (TC-VE2-234) and enabled after Leave (TC-VE2-235); the NSFW failure setup in Notes (TC-VE2-173).
- Not taken from Android v4 (stay unchanged on iOS): TC-090, TC-091, TC-094, TC-095 (platform decision 1); TC-200 –
  TC-213 (Android system Back, never on iOS; the IDs stay unused on iOS).
- New (45), same IDs and places as Android v4:
  - TC-225 – TC-254: the other 30 combinations (R-194, R-063, R-203).
  - TC-255 – TC-258: media picker sources, Pexels, Pixabay, named album (R-202), after TC-020.
  - TC-259: 150.01 s reads 「00:00/02:31」 (R-199), after TC-033.
  - TC-264: strip scale at 150.01 s and 481 s (R-034), after TC-045.
  - TC-263, TC-260 – TC-262: Professional refused at 02:31, allowed at 02:30; the boundary sources at entry, then
    Professional (R-052, R-053, R-197), after TC-076.
  - TC-269: credit rounding boundaries (R-060, R-063), after TC-080.
  - TC-265 – TC-267: generation time for 1 s, 3.2 s and 30 s (R-204), after TC-143.
  - TC-268: the task still on Recent task days later (R-198), after TC-144.

## Combination rows and prices (3.2 s fixture = 4 billable seconds; 1 s check = the rate; iOS rates: Q-26)
Same rows, rates and prices as Android v4 (`android/drafts/20261110-160000/update-plan.md`): 1 216 credits for all 36
generations. TC-223 Standard / Natural / 30 / 720p (1/s, 4) … TC-254 Professional / Sharp / 120 / 4K (48/s, 192); the
full grid is `requirements.md` › `### Combinations`.

## Found by the analysis
- Annotation trace: unchanged (same spec set; carried from draft 20261104-100851, identical to Android's).
- Control trace: `controls.ts` carried all 128 groups from draft 20261104-100851 (0 untraced). The only difference
  from the Android v4 trace is 「Unlock Pro+ to Enhance」: pressed by TC-090 and TC-091 on iOS (TC-090 only on Android).
  Pause, the Pexels / Pixabay tabs and the album chooser are not in the Figma inventory (not drawn).
- Pass 9 hidden clauses: R-196 → TC-022, R-198 → TC-268, R-203 → TC-219, TC-223 (and every combination row).
- Pass 10 variants and combinations: R-034, R-197, R-202, R-204 lines; `### Combinations` 36 of 36.

## Not added (value check)
- As Android v4: the spec agent's price checks at 30 s, 90 s and the Mode cap (TC-VE2-114 – TC-VE2-149) are merged into
  the combination rows' 1 s and 3.2 s price checks and TC-042, TC-080, TC-214.

## PM-only rows
- Unchanged from v2.

## Questions for PM
- Q-23 2K+ rejection message and the exact threshold.
- Q-24 strip scale: confirm PM 9/29 ⑥ as the spec agent reads it.
- Q-26 the iOS ECL rate table (the price shown must match the iOS ECL rates).
