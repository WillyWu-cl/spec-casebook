# AI Hair Color Custom — board notes (spec set 2026-11-12)

PM Figma page 3287:89 「26 11E AI Hair Color Custom」 (file AI-Hair, vhIp15PMJcwOcWJ6E9Q4JE), read 2026-11-12 through
figma-pm (qa1). Figma-only: no PDF, no Design file. Text per board in `boards/<id>.md`; screenshots in `figma/`.
Rules cited from the 10/E Hair Color page 3026:89 are in `hair-color-10e-rules.json`.

## pm-header
- Title 「【26'11/E】AI Hair Color · Custom」. Diff line: template = one swatch is a ready style + colour; Custom = the
  user picks the style, then gives 1–2 colours (D6-00, D6-01).

## pm-flow (Spec - Flow)
- Overview bullets: 11 styles + 1–2 colours, no CMS swatch; Custom is the first cell, opens a panel with ① Style
  ② Color ③ Generate; solid_color one colour, the other 10 two; collapse = apply, settings lost only on leaving the
  room or overwriting; 6 credits per image, same as template, 10/E lifecycle; vendor measured 42–48 s per image, needs
  staged reassuring strings, templates stay short; Custom styles go on CMS; deeplink to Custom with a style guid.
- Intro Demo (Tutorial frame 3491:771): 「AI Hair Color」, body text, 「Try Now」, 「Don't show again」, ‹ back.
  The 10/E page says the first entry has no demo video (D1-08) → Q-8.
- Flow row: custom_in_row (finger on Custom) → tap Custom → panel_open_no_style → 選 style + 色 → panel_ready
  → in-panel Generate (green arrow) → generating (「Applying your new hair color...」) → 42–48 s → result_custom
  (Intensity 100, 「Retry」) → result with Intensity 50.
- panel_ready ⌄ (pink arrow, 「⌄ 收合 ＝ apply」) → collapsed_applied: Custom selected, outer Generate enabled.
- Callout: in-panel Generate without collapsing → result fills the edit area, 44 pt Intensity row (100%) above the
  panel's Generate, button 「Retry」; refers to a 「result_in_panel」 state that Spec - UI does not draw → Q-4.
- Arrows are drawn head-first (tail at the head end); edges in `arrows.json` follow the labels and the image.
- Controls (drawn as shapes, added by hand in `inventory-overrides.json`): Custom cell, template cell, Solid /
  Multicolor tabs, ✕ ↺ ↻ ✓, ⌄, style thumbs, Base / Highlight colour wheels and swatches, Intensity slider,
  Try Now, Don't show again.

## pm-ui (Spec - UI)
- UI source note: DS tokens (Bottom_Sheet_bg #342f2e radius 20, Button_1_bg_n #ffbe98, selected frame #ffbe98 4 pt,
  …), layout stack, panel like ImageToVideoModelListPanel (max 0.65 × 844 = 548.6); 9 style thumbnails are photos,
  split_dye_vertical / split_dye_horizontal still plain colour (D6-17).
- custom_in_row: Custom always first, before every CMS template (like AI Background); unset = gradient + ＋, label
  「Custom」, not selected (first template selected); tap → panel. Mockups draw a pencil icon → Q-2.
- panel_open_no_style: three areas; Color = two rows Base Color / Highlight Color (16 pt); first a rainbow wheel key
  with ＋ = app palette, then 7 recommended colours (40 pt, pitch 50, scroll); before a style both rows and Generate
  disabled; no undo / redo, no ✕ / ✓; ⌄ collapse = apply.
- panel_solid_color: only Base Color; filled → Generate enabled; API gets main_color_r/g/b only.
- panel_two_tone (×2 frames): both required; one filled → disabled; hint 「Both Base Color and Highlight Color are
  required.」 drawn in the phone; chosen colour 2 pt #FFBE98 ring.
- panel_palette: app palette copied: Cancel / Done, SV square, hue slider, eyedropper right of the slider, bottom
  ✕ ↩ ↪ ⊕ ✓ (described, not drawn); one slot at a time; Done fills, Cancel does not; HEX → RGB 0–255.
- 顏色選取狀態 (second panel_two_tone frame 3349:1983): Base chosen with a ring, Highlight not yet.
- panel_ready: both colours → orange 「Generate ｜ ⬤ 6」, no minus (D6-15); Generate in the panel (D6-16).
- collapsed_applied: tap outside or ⌄ = apply; Custom selected, outer Generate enabled; cell shows the two colours
  (mockup: pencil, Q-2); lost only by leaving the room or overwriting; another template does not discard them.
- result_custom: in place, Intensity 0–100 default 100; 「Retry」 charges 6; session memory recalls the result and
  its Intensity; saving, ✓ to Edit Room and Artwork as 10/E.

## pm-cms (CMS · Custom Style)
- Style list on CMS (thumbnail, order, publishing). Type PhDM_AIHairColor_CustomStyle (mock, Q-13). Fields guid
  (Style_<serial>_<UIName>_<model>, used by deeplink), api_style_value (11 legal values), ui_name, thumbnail,
  color_slots (1 for solid_color, else 2), order, usageType free / purchase (D3-04).

## pm-deeplink
- Locate Custom with a style guid → room, Custom panel open, style selected; no colours carried, so it always waits
  for colours; unknown / unpublished guid → panel with no style, no error.

## pm-draft-tbd
- Q1 day-1 list and free / premium (fallback 11, half premium) → Q-6; Q2 deeplink format (fallback
  mode=custom&style_guid=<guid>) → Q-11; Q3 42–48 s in place (ANR / killed) → Q-12; Q4 CMS type → Q-13.

## pm-face-check (11/25 new)
- entry_warn_face: 「Please choose another photo」 / 「The face in this photo is too slanted, which may result in
  poorly generated results.」 / 「OK」 / 「Continue Anyway」.
- Face checks after the ratio check (or after Crop); thresholds and strings as Hair Volume / AI Hairstyle: slanted =
  yaw or roll > 15°, too small = face < 128 px on the 1024 thumbnail; both warnings. Blocked: no face 「No face
  detected. Face is required for this feature.」, too big 「The face in this photo is too big.」.
- Order: no face → ratio > 16:9 / 9:16 (Cancel / Crop) → too big → too small / slanted. From Edit Room / deeplink
  all four at once. Android AI Hairstyle allowed 5:1, iOS did not check ratio: both now 16:9.
