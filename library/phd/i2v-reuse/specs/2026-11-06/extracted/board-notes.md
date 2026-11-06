# Image to Video Reuse — board notes (spec set 2026-11-04)

PM: Figma `lSk4JUgbXG3DjauMLS9Et7` 「Image to Video」, page 6336:3478 「26'11/E support to reuse model settings in My
artwork」, one section 「Spec」 (6336:3479). **Figma-only spec set** (user, 2026-11-04): no PDF export; the page was
read whole in one inventory call through figma-pm (qa1) and its text is in `boards/*.md` (Figma text layer, no OCR).
Board images: `figma/*.png`, cut from one 1:1 screenshot of the section. Design: not shared yet (expected
2026-11-05), so every row is PM-only (pass 7). Decision ids in brackets ([D1-04]) are the PM's own.

## pm-header — title and diff line
「Demo + Spec」. Diff line [D0-04]: unlike the Save & Share Prompt Reuse / My Prompts Reuse, which bring back only a
piece of text, this feature brings back the whole generation setting set (model + Duration + Quality + Sound [+
prompt]), so the user does not have to search the 10 models again to make another video with the same settings and a
new photo.

## pm-flow — Spec - Flow
Overview:
- Scenario: the user is happy with a result, goes back to My AI Artwork and wants to make another video with the same
  settings and a different photo [D0-01]. Why 11/E: the model list grew and more items can be customised [D0-01].
- The only entry is the video-level Reuse on the Save & Share page; Create More stays as today (Custom tab, default
  model) and shows no reuse list [D0-03].
- Name: 「Reuse」; it appears on the Save & Share page reached from the Artwork I2V tab and from Recent (Video) [D0-05].
- Scope: Custom videos only; 10/E Start/End frame videos count, and the switch state comes back too [D0-06][D0-06b].
- Not benchmarked against competitors; the app's existing prompt Reuse is the reference [D5-01].
Entry A 「My AI Artwork › video artwork › Reuse」: (1) My AI Artwork, tab 「Image to Video」 (tabs Image to Video / AI
Art / AI Face Swap / AI Outfit, 「Select」), tiles: Processing (「9 minutes remaining ...」), finished Custom (0:04),
finished Template (「Template Name 2」), failed tiles with 「Retry」, 「Report」, 「View Details」; 「Create more」 at
the bottom. Callout 「點 Custom 影片 → Save & Share」 [D1-01]. (2) 「Save & Share · Reuse (NEW)」: title 「Save & Share」,
back and home at the top, 「Save」, 「Prompts & Settings」, summary 「Kling 2.6 · 10s · Pro · Sound On」, prompt 「A girl
turning around in the snow, hair flowing in the wind」, 「Reuse」, 「Share to」 Instagram / Facebook / More, 「You might
also like」. Callout 「Reuse 帶回整組設定」 [D0-04b]. (3) 「I2V Custom · reuse_from_video (NEW)」: back, credit 「0」,
history; tabs Custom / Templates; 「Model」 「Kling 2.6」 with a chevron; 「Specify Video Start / End」; 「Add your
images」 (empty); 「Prompts *」, 「My Prompt」, the prompt filled, 「58/2,500」, expand; 「Try with inspirations」; toast
「Settings applied」; 「Generate」 with 「30」. Callout 「設定＋prompt 帶好、照片空、toast」 [D1-04].
Entry B 「My AI Artwork › Create More（維持）」: (1) the same Artwork tab; callout 「Create More → Custom tab、default model
（同今天）」 [D1-03]; (2) 「I2V Custom · default（同 Image to Video 今天）」: model 「Kling 3.0」, placeholder 「Describe the
subject, action, and overall scene, e.g. A woman walking in a park on a sunny afternoon.」, 「0/2,500」, 「Generate」
「30」; callout 「default 設定，不出任何 reuse list」 [D0-03].
Legend: blue lines = forward (tap), red lines = return (‹ back).
Arrows (frames named 「--> 」, listed by hand in `arrows.json`): Custom video tile → Save & Share; Reuse → I2V Custom
from_video; ‹ back (room) → Save & Share; ‹ back (Save & Share) → My AI Artwork; Create more → I2V Custom default.
Controls: Artwork tiles (Retry, Report, View Details, ⚠ icons), 「Create more」; Save & Share back, home, Save, Reuse,
Instagram; room back, credit button, history, Custom tab, model chevron, My Prompt, expand, Generate.

## pm-ui — Spec - UI
Save & Share · Reuse · default (Custom video), 【Requirement】:
- The old Prompt Reuse row of the Prompts area is upgraded: the same Reuse brings back the whole setting set (only one
  Reuse on the page); the section title becomes 「Prompts & Settings」 [D0-04b][D1-10].
- Shows the model + Duration · Quality · Sound summary and the prompt [D2-01].
- Reuse → back to the I2V Custom tab (settings + prompt filled, photo slot empty) [D1-04].
- Tapping a video from the I2V tab or from Recent (Video) reaches this page, both showing Prompts & Settings + Reuse;
  no extra button on the list tiles [D1-01][D0-05][D1-07].
- Shown only for Custom videos that generated successfully; old videos from before 4/E do not show it on day 1 (RD to
  confirm) [D2-03][D2-03b].
- What today's Prompt Reuse brings back is not questioned; after the upgrade this page decides [D0-07b].
Save & Share · template_video (same as today's Template Save & Share): no Prompts & Settings; 「Save」, Share to,
「You might also like」 (Draw to Image, AI Removal). 【Requirement】 Template videos show no Reuse (no model settings to
pick), as today [D0-06].
I2V Custom · Reuse entering the room, from_video: as the flow mockup, toast 「Settings applied」. 【From Save & Share
Reuse】:
- Brings back model, Duration, Video Quality, Generate Sound by AI, the Start/End switch and the prompt; not the photo
  or the Inspiration [D2-01][D0-06b].
- The intro (iOS demo / Steps, AI Processing Notice, Android explanation sheet) shows first as today; the toast
  「Settings applied」 shows only once the Custom page is visible; the toast takes priority over a panel [D1-04b][D1-08].
- Switching model in the room remembers settings as the 4/E rule does; values the model does not support go back to
  the default; leaving the room resets (as Image to Video Custom) [D1-06].
- Back ‹ returns to the Save & Share page [D1-05].
- Reuse charges nothing; Generate shows the model's current price; each model's existing action ID is used
  [D3-01][D3-02][D4-01].
- Free trial as I2V Custom [D3-03].
I2V Custom · model_sunset: model 「Kling 3.0」 (default), prompt empty placeholder, 「0/2,500」, toast 「This model is no
longer available.」 / 「Switched to recommended model.」 (two lines). 【Model 已下架】:
- Reuse can still be tapped; the model becomes the default; the other parameters come along where supported, else
  their defaults (4/E model-switch rule) [D2-02].
- Entering shows the removal toast (two lines) 「This model is no longer available. Switched to recommended model.」, not
  「Settings applied」 [D2-02b][D1-09].
- Generate charges normally under the default model's action id [D3-04].
- Note: the mockup shows an empty prompt, while the rule says the other parameters come along (Q-6).
My AI Artwork – Image to Video tab · default (same as today) 【Requirement】:
- Same as today's Image to Video Artwork; today it has only Create More (blank Custom tab), both platforms alike [D0-07].
- Create More: straight into the Custom tab with the default model, as today [D1-03][D0-03].
- Tapping a Custom video → Save & Share (with Reuse) [D1-01].

## pm-tracking — 【Tracking Event】
- Success metric: share of users who press Generate after entering I2V from Artwork = ImageToVideo_Result_Generate by
  `from` [D0-02][D4-03]. Naming: events in three PascalCase parts (Xxx_Yyy_Zzz), parameters snake_case, else both
  platforms drop them [D4-03].
| Event | Kind | When | Parameter / value | Source |
|---|---|---|---|---|
| ImageToVideo_Result_Generate | existing, new `from` value | Generate after entering through Save & Share Reuse | from = artwork_reuse (new on iOS, same as Android) | D4-02, D4-03 |
| ImageToVideo_Result_Generate | existing, unchanged | Generate after entering through My AI Artwork Create More | from = Artwork (as today) | D4-02 |
| ImageToVideo_Result_Generate | existing, unchanged | Save & Share from Recent (Video), then Reuse | from = artwork_reuse (Recent not split out) | D4-02 |
| ImageToVideo_Reuse_Click | new | Reuse on Save & Share | model | D4-05 |

## pm-draft-tbd — Draft / TBD
- Q1 Can videos from before 4/E be reused? Suggestion: day 1 shows no Reuse. Owner: RD, meeting 2026-10-28. Day 1: no
  Reuse [D2-03b].
- Q2 Can every Custom video get its full settings (both platforms, after reinstall)? Suggestion: when they cannot be
  read, do not bring in the default model setting. Owner: RD, meeting 2026-10-28. Day 1: no Reuse [D2-07].

## pm-error-handling — Error Handling
| Case | User sees | Next | Credits | Source |
|---|---|---|---|---|
| The reused video's model was removed | see Spec - UI › model_sunset | generate as usual | Generate charges the default model's current price | D2-02, D2-02b, D3-04 |
| The reused prompt is over the new model's limit (Android limit 500) | brought back whole; box and counter turn red, Generate disabled, as today | the user deletes text | none | D2-05 |
| Reuse with no network | as entering I2V with no network today; Reuse adds nothing | as today | none | D2-06 |
| Reuse to a model that does not support real people, photo with a face | 「The photo you uploaded includes a real person, which isn't supported by the selected model.」 as today | change photo or model | none | D2-08 |
| Not enough credits | Free → Upgrade to Premium; subscriber → More Credits Required, as today | as today | none | D2-08 |

## Design — 261105_support to reuse model settings (read 2026-11-06)

Page 4701:15518 of the Design file: four loose frames, no arrows, no notes. Light (x 539, 936) and dark (x 1515, 1912).
The Design draws nothing of the reused room, the toasts or the model-removed case; those stay PM-only.

### d-save-share-light / d-save-share-dark (「Save & Share」)
- Order on the page: video preview › 「Save」 › 「More Video Editing Tools」 (PowerDirector icon) › 「Add Text」 「Add Sticker」 「Add Music」 › 「Prompts & Settings」 › 「Share to」.
- 「Prompts & Settings」 card: model icon and model name (sample 「Gemini Omini Flash 1.1」) with an outlined 「Reuse」 at the right of the same row; under it three chips 「10s」 「Pro」 「Soound on」 (sic); under them the prompt.
- PM drew one line 「Kling 2.6 · 10s · Pro · Sound On」 with 「Reuse」 on it. The chips replace the line.
- Top bar: ‹ only. The PM mockup also draws a home button at the top right.

### d-artwork-light / d-artwork-dark (「My AI Artwork」)
- Tabs 「Character Motion Swap」 (selected), 「AI Art」, 「AI Face Swap」; the PM draws 「Image to Video」, 「AI Art」, 「AI Face Swap」, 「AI Outfit」. The layers hold a hidden 「Image to Video」.
- ⓘ at the top right, 「Select」, 「Create more」.
- Tiles: 「Processing...」 with 「9 minutes remaining ...」 and 「Almost done」; finished with 「Expires on」 and a date; failed with 「Resume to Upload」. PM failed tiles show 「Retry」, 「Report」, 「View Details」.
- No 「Reuse」 or other new button on a tile, as R-007.

### PM change (read 2026-11-06)
- 「Reuse」 on the Save & Share mockups moved up (pm-flow y −3612 → −3724, pm-ui y −167 → −279) to sit on the summary line. No text changed.
