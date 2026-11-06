# Update plan — pdr/ai-mini-drama / android: approved v11 → draft 20261106-084820
## Spec files
- Unchanged: the 2026-10-21-2 PDFs, Design, PM and MX Figma · New or changed: none in the spec set; a credit-usage source arrived (REQ-103) · No longer supplied: none
- Source: the ECL Credit System 「Publish Feature List」 forms the user gave on 2026-11-06 (`https://ecl.cyberlink.com/IF3/eclcom/BPM/FormView/<form no>`): Seedance 2.5 22937582357 (6/s, 2026-11-03, Production Released), Seedance 2.0 22850755605 (4/s, 2026-10-30), Seedance 2.0 mini 21703885589 (2/s at 480p, 720p 4/s, 2026-09-08, Stage Released, Text to Video), Text to image 22632766997 (3 per image, 2026-10-20, Production Released), TTS 22833510933 (1 per 1000 characters, 2026-10-29, Stage Released, character voice samples). They replace the REQ-059 sheet prices (formats.md › Credit numbers: a credit-usage source decides credit numbers). Knowledge KF-056 (prices) and KF-057 (action ids).
- Built on the approved v11 (= draft 20261105-160857, saved 2026-11-05 with no edits); no newer unsaved draft exists.

## Requirement changes
| Requirement | Change | Before | After |
|---|---|---|---|
| R-033 | changed | ◆6×n (PM / Design mock) | ◆4 per character (image 3 + voice sample 1) |
| R-040 | changed | Generate ◆6 (sheet) | Generate ◆4 (image 3 + voice sample 1) |
| R-050 | changed | 6 per scene image + TTS (sheet) | 3 per image, Location and scene, + TTS 1 per 1000 characters (◆37 for 6 scenes) |
| R-059 | changed | Regenerate Image ◆6 / ◆12 (Design) | ◆3 / ◆6 (3 per image) |
| R-061 | changed | 6 per image (sheet) | 3 per image + 1 TTS when the preview is remade |
| R-069 | changed | 6 / 13 / 4 per second; Preview 180 / 390 / 120, Full 540 / 1170 / 360 | 6 / 4 / 2 per second at 480p; Preview 180 / 120 / 60, Full 540 / 360 / 180 (+4 seen: Q-A24) |
| R-081 | changed | 15 s scene ◆195 / ◆60 / ◆90 | ◆90 / ◆60 / ◆30 |
| R-147 | changed | full price = sheet | full price = Credit System forms; discount still held |
| R-254 | changed | one character ◆6 | ◆4 |
| R-259, R-260 | changed | 6 per scene image + TTS | 3 per image + TTS |
| R-379, R-452, R-453 | changed | 「Regenerate Image ◆6」 expected | 3 per image (◆3; ◆6 with the Location); ◆6 is the PM mock |
| R-466 | changed | 6 credits per image | 3 credits per image |
| R-481 | changed | `…_aiminidrama_normal` / `_discount` sheet ids | Credit System form ids, no suffix (images gptimage2.5sunburst 1k, TTS gemini3.8flash, Seedance 2.5 / 2.0 480p aiminidrama, Mini 480p Text to Video id) |
| Q-A18 | changed | answered by REQ-059 (sheet prices) | superseded by REQ-103 |
| Q-A19 | changed | no Seedance 2.5 row in the sheet | answered: 6 per second (form 22937582357) |
| Q-A24 | new | – | new: Full Video quoted 4 above 90 × the rate on Android 16.8.0.2611041 |
| Q-A25 | new | – | new: which id / price books the Storyboard Preview narration (TTS form says voice samples only) |

## Case changes
- New (0)
- Modified (23):
  - TC-039 — REQ-103: a character costs ◆4 (image 3, form 22632766997, + voice sample 1, form 22833510933), R-033
  - TC-040 — REQ-103: a character costs ◆4 (image 3, form 22632766997, + voice sample 1, form 22833510933), R-033
  - TC-045 — REQ-103: one character costs ◆4 (R-254)
  - TC-047 — REQ-103: Generate ◆4 (R-040)
  - TC-060 — REQ-103: 3 credits per image plus Text to Speech at 1 per 1000 characters (R-050)
  - TC-070 — REQ-103: 3 credits per image (R-059)
  - TC-523 — REQ-103: two images cost ◆6 (R-059)
  - TC-072 — REQ-103: 3 credits per image (R-061)
  - TC-080 — REQ-103: 6 / 4 / 2 credits per second (R-069)
  - TC-092 — REQ-103: 6 / 4 / 2 credits per second (R-069, R-081)
  - TC-114 — REQ-103: 3 credits per image (R-259)
  - TC-356 — REQ-103: 3 credits per image (R-260)
  - TC-527 — REQ-103: ◆4 per character (Notes only)
  - TC-229 — REQ-103: full prices from the Credit System forms (R-147)
  - TC-544 — REQ-103: Credit System ids (no _normal suffix) and prices (R-465 / R-481, R-040)
  - TC-545 — REQ-103: 3 credits per image and the Credit System image id (R-050, R-465 / R-481)
  - TC-546 — REQ-103: Seedance 2.0 4 credits per second, id from form 22850755605 (R-069, R-465 / R-481)
  - TC-547 — REQ-103: Seedance 2.0 Mini 2 credits per second at 480p, id from form 21703885589 (R-069, R-465 / R-481)
  - TC-548 — REQ-103: ◆4 per character and the Credit System ids (R-254, R-465 / R-481)
  - TC-549 — REQ-103: 3 credits per image and the Credit System image id (R-059, R-465 / R-481)
  - TC-550 — REQ-103: 6 / 4 / 2 credits per second and the Credit System video ids (R-081, R-465 / R-481)
  - TC-292 — REQ-103: 3 credits per image (R-156)
  - TC-316 — REQ-103: 6 / 4 / 2 credits per second (R-069, R-081)
- Removed (0)
- Unchanged: 506
- Order: unchanged (prices change in place). The next round re-runs the modified rows first.

## Found by the analysis
- Every rule and row that states a credit price, a per-unit rate or an action id was searched (◆ numbers, per second / per image, `genimage` / `genvideo` / `genaudio`, `_normal` / `_discount`, REQ-057 / REQ-059 citations) and changed in place.
- Left as they are: the PM / MX flow-arrow requirements that only name a drawn button label (「Regenerate Video ◆30」, 「Regenerate Image ◆6」 as the arrow's source, MX 「Regenerate Video ◆225」 top-up example); Storyboard Preview Retry ◆1 (R-256, matches TTS 1 per 1000 characters); Q-15 (6 / 4 / 2, now confirmed by the forms); the promotion rules R-479, R-480, R-395 and their discount rows (TC-230, TC-232, TC-233 say only 「full prices」).
- Pass 9 hidden clauses: R-033 (◆4 = image + voice sample, Credit Details and the log) → TC-544; R-050 and R-481 rows reworded.
- Variants: the R-481 「normal (`_aiminidrama_normal`)」 variant is now 「full price (the Credit System form ids)」; the discount variant stays held.
- Domain rules: KF-056 (spec) → R-033, R-040, R-050, R-059, R-061, R-069, R-081, R-147, R-254, R-259, R-260.
- Annotation and control traces: carried over unchanged (no new board).

## Not added (value check)
- A separate row for the Full Video +4: TC-080 already reads every Full quote; the difference waits on Q-A24.
- A row for the Mini 720p price (4/s): the app offers no resolution choice; Fast is quoted at the 480p rate.

## PM-only rows
- none changed

## Left undone
- No device run (prices were read from the forms and the 2026-11-05 Android run). The Full Video charge itself was not generated (needs the user's go-ahead, REQ-073).

## Questions for you
- Q-A24: Full Video 90 s is quoted ◆544 / ◆364 / ◆184 on Android 16.8.0.2611041, 4 above 90 × 6 / 4 / 2; no form explains the 4. Rows expect ◆540 / ◆360 / ◆180 and record the quote.
- Q-A25: the TTS form is for character voice samples only, yet the Storyboard Preview narration is charged as Text to Speech (◆1); which id does it use?
