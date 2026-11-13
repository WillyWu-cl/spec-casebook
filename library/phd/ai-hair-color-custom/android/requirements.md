# AI Hair Color Custom — requirements (android)
Spec: AI Hair Color Custom - PM Figma 3287-89.md (text snapshot of PM Figma page 3287:89 「26 11E AI Hair Color Custom」,
https://www.figma.com/design/vhIp15PMJcwOcWJ6E9Q4JE/AI-Hair?node-id=3287-89). Figma-only, PM only: no Design file was
supplied, so every row is PM-only (pass 7). Rules the page cites from the 10/E Hair Color spec (D1-xx, D2-xx, D3-xx)
were read from page 3026:89 「26 10E AI Hair Color v2」 (`extracted/hair-color-10e-rules.json`) and are tagged
`[PM:10/E …]`.

## Overview and Intro Demo
- R-001 [PM:pm-header] Custom lets the user choose the style (11 kinds) and give 1–2 colours themselves; it does not use a CMS colour swatch (D6-00).
- R-002 [PM:pm-flow Intro Demo] The Intro Demo page shows 「AI Hair Color」, 「Go beyond traditional hair colors! Explore everything from subtle highlights to vibrant, bold shades.」, 「Try Now」, 「Don't show again」 and a ‹ back key at the top left.
- R-003 [PM:pm-flow Intro Demo] 「Try Now」 closes the Intro Demo and continues into AI Hair Color.
- R-004 [PM:pm-flow Intro Demo] ‹ on the Intro Demo leaves AI Hair Color to the screen it was opened from.
- R-005 [PM:pm-flow Intro Demo] With 「Don't show again」 ticked, the Intro Demo is not shown on later entries.

## Entry checks (11/25 new)
- R-006 [PM:pm-face-check] The entry checks run in this order: ① no face (blocked) → ② ratio wider than 16:9 or taller than 9:16 (Cancel / Crop) → ③ face too big (blocked) → ④ face too small / slanted (warning, Continue Anyway) (D2-01e).
- R-007 [PM:pm-face-check] A face with yaw or roll above 15° shows the warning 「Please choose another photo」 / 「The face in this photo is too slanted, which may result in poorly generated results.」 with 「OK」 and 「Continue Anyway」 (D2-01d, thresholds and strings as Hair Volume / AI Hairstyle).
- R-008 [PM:pm-face-check] A face narrower than 128 px on the 1024 px thumbnail shows the face-too-small warning with 「OK」 and 「Continue Anyway」 (D2-01d; string as AI Hairstyle, Q-9).
- R-009 [PM:pm-face-check] The slanted and too-small checks warn and do not block: 「Continue Anyway」 enters the room with the photo; 「OK」 does not enter and lets the user choose another photo.
- R-010 [PM:pm-face-check] A photo with no face is blocked with 「No face detected. Face is required for this feature.」 (D2-01d).
- R-011 [PM:pm-face-check] A photo whose face is too big is blocked with 「The face in this photo is too big.」 (D2-01d).
- R-012 [PM:pm-face-check; PM:10/E entry_blocked_ratio] A photo whose long side / short side is above 16/9 (≈1.78) shows a two-button dialog: 「Cancel」 gives up entering, 「Crop」 opens the existing Crop room; there is no Continue Anyway (D2-01b).
- R-013 [PM:pm-face-check; PM:10/E crop_room] After cropping (✓ in Crop) the face checks run on the cropped image, the one sent to the API (D2-01c, D2-01e).
- R-014 [PM:pm-face-check] Entering from Edit Room or a deeplink (photo already chosen), the four checks run in order at once (D2-01e, D1-10).
- R-015 [PM:pm-face-check] The 16:9 / 9:16 ratio check applies on both platforms; Android AI Hairstyle's old 5:1 limit does not apply to AI Hair Color (D2-01b).

## Custom cell in the swatch row
- R-016 [PM:pm-ui custom_in_row] 「Custom」 is always the first cell of the swatch row, before every CMS template (like AI Background) (D6-01).
- R-017 [PM:pm-ui custom_in_row] Before Custom is set, its cell shows a gradient background with ＋ and the label 「Custom」, and it is not selected; the first template stays selected (D6-01; the mockups draw a pencil icon, Q-2).
- R-018 [PM:pm-ui custom_in_row] Tapping 「Custom」 opens the Custom panel (D6-02).

## Custom panel layout
- R-019 [PM:pm-ui panel_open_no_style] The Custom panel is a half-screen sheet titled 「Custom」 with a ⌄ collapse key at the top right and three areas from top to bottom: ① Style ② Color ③ Generate (D6-02).
- R-020 [PM:pm-ui panel_open_no_style] The panel has no undo / redo and no ✕ / ✓ (D6-16).
- R-021 [PM:pm-ui UI source note] The panel is at most 0.65 of the screen height (548.6 of 844 pt) with top corners rounded 20 pt; the photo stays visible above it.
- R-022 [PM:pm-ui panel_open_no_style] The Color area has two rows titled 「Base Color」 and 「Highlight Color」; each row starts with a rainbow colour-wheel key with a ＋ badge, followed by 7 recommended colours (40 pt circles) that scroll sideways (D6-21).
- R-023 [PM:pm-ui panel_open_no_style] Before a style is chosen, both colour rows and Generate are disabled (D6-03).

## Style
- R-024 [PM:pm-cms] The Style area lists the Custom styles from CMS (type PhDM_AIHairColor_CustomStyle): each with its thumbnail and ui_name, in CMS order, only published ones; the legal styles are solid_color, ombre, colored_roots, dip_dye, balayage, highlights, face_framing, colored_bangs, earloop_highlights, split_dye_vertical and split_dye_horizontal (D6-10, D6-13).
- R-025 [PM:pm-ui UI source note] The split_dye_vertical and split_dye_horizontal thumbnails are still plain colour; the other 9 are photos (D6-17).
- R-026 [PM:pm-ui UI source note] The selected style shows the selected frame (#ffbe98, 4 pt inner frame).
- R-027 [PM:pm-ui panel_solid_color] solid_color takes one colour: only the 「Base Color」 row shows; the 「Highlight Color」 row does not appear (D6-04).
- R-028 [PM:pm-ui panel_solid_color] With solid_color, choosing a Base Color enables Generate (D6-04).
- R-029 [PM:pm-ui panel_two_tone] Every other style needs both colours: with only one filled, Generate stays disabled and 「Both Base Color and Highlight Color are required.」 shows under the rows (D6-04).
- R-030 [PM:pm-ui panel_two_tone] The chosen colour in each row has a 2 pt #FFBE98 ring (D6-21).
- R-031 [PM:pm-ui panel_solid_color] solid_color sends only main_color_r/g/b to the API, no accent colour.
- R-032 [PM:pm-cms; PM:10/E D2-04] Each style generates its own colour pattern in the chosen colours (Multicolor: highlights follow the hair flow, the ombré starts below the ears).

## Colour picking (palette)
- R-033 [PM:pm-ui panel_palette] The colour-wheel key opens the app's existing colour palette: 「Cancel」 / 「Done」 on one line, a saturation-brightness square with a round cursor, a rainbow hue slider with a round handle, an eyedropper key right of the slider and a bottom row ✕ ↩ ↪ ⊕ ✓ (the bottom row is described but not drawn) (D6-05).
- R-034 [PM:pm-ui panel_palette] The palette edits one slot at a time: the row whose wheel opened it receives the colour (D6-05).
- R-035 [PM:pm-ui panel_palette] 「Done」 fills the slot and closes the palette; 「Cancel」 closes it without filling.
- R-036 [PM:pm-ui panel_palette] The colour is converted from HEX to RGB and sent to the API as r/g/b values 0–255.
- R-037 [PM:pm-ui panel_palette] The eyedropper key next to the hue slider works as in the app's existing palette.

## Ready and Generate in the panel
- R-038 [PM:pm-ui panel_ready] With a style and its colours complete, the orange Generate in the panel is enabled and shows 「Generate」 with ⬤ 6, no minus sign (D6-07, D6-15).
- R-039 [PM:pm-ui panel_ready] Generate is inside the panel, not in the bottom row (D6-16).
- R-040 [PM:pm-header] One Custom image costs 6 credits, the same as a template (D6-07).
- R-041 [PM:pm-flow callout in-panel generate] Generate in the panel without collapsing: the result fills the photo area above, a 44 pt Intensity row (default 100%) appears above the panel's Generate and the button becomes 「Retry」 (D6-22, D6-23; result_in_panel is not drawn, Q-4).

## Collapse = apply
- R-042 [PM:pm-ui collapsed_applied] Tapping outside the panel or its ⌄ key both apply the settings; neither cancels (D6-08).
- R-043 [PM:pm-ui collapsed_applied] After collapsing, the template row is back, the Custom cell is selected and the outer Generate is enabled (D6-08).
- R-044 [PM:pm-ui collapsed_applied] The Custom cell then shows the two colours the user chose (D6-08; the mockup draws a pencil icon, Q-2).
- R-045 [PM:pm-ui collapsed_applied] The Custom settings disappear only when the user leaves the room or overwrites them; everything else keeps them (D6-09).
- R-046 [PM:pm-ui collapsed_applied 點別的 template] Tapping another template moves the selection but does not discard the Custom settings: the Custom cell still shows its colours and tapping Custom again shows the same settings (D6-09).

## Generating
- R-047 [PM:pm-flow; PM:pm-header] A Custom generation waits in place (10/E lifecycle) for about 42–48 s with staged reassuring strings, the first 「Applying your new hair color...」 (D6-11).
- R-048 [PM:pm-header] Template generations keep their short wait; Custom's long wait does not affect them (D6-11).
- R-049 [PM:10/E D1-03] While generating, the swatch row and Generate are disabled and the screen does not change.
- R-050 [PM:10/E D1-03] If the system kills the app during generation, the result is lost and the credits stay charged (no user-visible Cancel).
- R-051 [KB: KP-019] A burst of Generate taps charges once and gives one result.

## Result
- R-052 [PM:pm-ui result_custom] The Custom result shows in place with the Intensity bar (0–100%, default 100%) (D6-12, D1-14).
- R-053 [PM:pm-ui result_custom] The button becomes 「Retry」; generating again charges 6 again (D6-12, D1-18).
- R-054 [PM:10/E D1-16] Every new generation sets Intensity back to 100%.
- R-055 [PM:pm-ui result_custom] Switching away from Custom and back recalls the Custom result and its Intensity, with no new generation and no charge (D6-12, D1-19).
- R-056 [PM:10/E D1-14, D1-12] Dragging the Intensity bar is free; releasing it is one undo step.
- R-057 [PM:pm-ui result_custom; PM:10/E D1-15, D1-05] The result is saved to My AI Artwork at 100% the moment it succeeds; the top-bar Artwork key opens My AI Artwork on the AI Hair tab, Color sub-tab, where it is listed.
- R-058 [PM:pm-ui result_custom; PM:10/E D1-13, D1-07] ✓ takes the result at its current Intensity into Edit Room; on Android Edit Room opens anew with it (the image is first saved silently).
- R-059 [PM:10/E D1-15] When the first result appears, a one-time dialog says My AI Artwork keeps only the 100% version; 「Don't show again」 stops it.
- R-060 [PM:10/E D2-04] The result keeps the hairstyle outline, hair length, face, background and clothes; only the hair colour changes.

## Credits, premium and failures
- R-061 [PM:pm-cms; PM:10/E D3-02a] Custom styles carry a CMS usageType free / purchase; a Free user who generates with a purchase style gets the paywall (D3-04).
- R-062 [PM:10/E Credit not enough] A Free user without enough credits gets 「Upgrade to Premium」 → paywall.
- R-063 [PM:10/E Credit not enough] A subscriber without enough credits gets 「More Credits Required!」 → 「Get Credit」 → Credit Shop.
- R-064 [PM:10/E Credit not enough] On Android, the Quick Credit Refill (one-time 10-credit pack) is offered when credits run short (D4-04).
- R-065 [PM:10/E Error Handle] A failed generation uses the existing dialogs and refunds the credits: 4002 → 「Please Try Different Content」, other errors → 「An Error Has Occurred」 (D3-06).
- R-066 [KB: KP-017] Buy Credit › Detail lists each Custom generation under AI Hair Color with 6 credits deducted (and a refund when one happens).
- R-067 [PM:pm-flow; KB: KP-020] The top-bar credit chip shows the current balance; tapping it opens Buy Credit.

## Leaving the room
- R-068 [PM:10/E D1-20b] ✕ in the bottom row gives up this edit and returns to the screen before entry with no confirmation.

## Deeplink
- R-069 [PM:pm-deeplink] A deeplink with a Custom style guid opens AI Hair Color with the Custom panel open and that style selected, waiting for the user's colours (D6-14).
- R-070 [PM:pm-deeplink] The deeplink carries no colours.
- R-071 [PM:pm-deeplink] A guid that CMS does not know or has unpublished opens the Custom panel with no style selected and shows no error.

## Android system Back (pass 8)
- R-072 [Rule pass 8: system Back] System Back on the Intro Demo does what ‹ does.
- R-073 [Rule pass 8: system Back] System Back on the slanted / too-small face warning: the spec is silent (Q-14); the row records what happens.
- R-074 [Rule pass 8: system Back] System Back with the Custom panel open: the spec is silent (Q-14); the row records whether it collapses (applies) or leaves.
- R-075 [Rule pass 8: system Back] System Back in the colour palette does what 「Cancel」 does (the existing palette's own close).
- R-076 [Rule pass 8: system Back] System Back in the room with the panel closed does what ✕ does (D1-20b).
- R-077 [Rule pass 8: system Back] System Back while a Custom generation is running: the spec is silent (no Cancel, D1-03; Q-14); the row records what happens.

## CMS and design tokens
- R-078 [PM:pm-cms] Each Custom style's guid is Style_<serial>_<UIName>_<model>, the value a deeplink carries (D6-14) — NOT TESTABLE: CMS-internal naming; the deeplink rows use the guid RD gives.
- R-079 [PM:pm-ui UI source note] The room and panel use the Design System tokens and layout stack the note lists (Bottom_Sheet_bg #342f2e, Button_1_bg_n #ffbe98, thumbnail cells 64×82 at a 68 pitch, the empty 44 pt Intensity slot, 36 pt compare key) — NOT TESTABLE here: a design-check item (figma skill conformance), not a functional row.

## Open questions
- Q-1 Is 「Custom」 also the first cell of the Multicolor tab's row? The page says it is the first cell of the whole swatch row and draws only the Solid tab. Assumption: Custom is first in both tabs. R-016, TC-018.
- Q-2 How does the Custom cell look? The notes say a gradient with ＋ before it is set and the user's two colours after Apply; every mockup (flow and UI) draws a pencil icon instead. Assumption: the notes. R-017, R-044, TC-017, TC-038.
- Q-3 What happens to the colours when the style changes between solid_color and a two-colour style (is Highlight kept, is Base kept)? The page is silent. Assumption: only the Highlight row hides / shows; the rows record what stays. R-027, R-029, TC-029.
- Q-4 The flow note sends the in-panel Generate result to 「result_in_panel」 in Spec - UI, but Spec - UI has no such frame. Assumption: the note's text (result above, 44 pt Intensity row at 100%, 「Retry」). R-041, TC-047.
- Q-5 What does collapsing do with no style or with colours missing (is Custom still selected, is the outer Generate enabled)? The page says only that collapse = apply. Assumption: no row; to be answered.
- Q-6 Which Custom styles ship on day 1 and which are premium (Draft / TBD Q1; fallback: all 11, half premium)? Is a PRO icon shown on premium style thumbnails as on 10/E colours? Assumption: the fallback, PRO icon as 10/E. R-024, R-061, TC-022, TC-069.
- Q-7 Does the 10/E one-time free trial (free colours only) apply to Custom, and for which styles? The page is silent. Assumption: no row until answered.
- Q-8 When does the Intro Demo page show? This page draws it in the flow; the 10/E page says the first entry goes straight to the colour page with no demo video (D1-08). Assumption: this newer page; it shows on the first entry. R-002–R-005, TC-001–TC-004.
- Q-9 The face-too-small warning string is not drawn (「沿用 Hair Volume / AI Hairstyle」). Assumption: AI Hairstyle's string, recorded at run time. R-008, TC-008.
- Q-10 Only the first reassuring string (「Applying your new hair color...」) is given; the later stages' strings and timing are not. Assumption: the row checks that the text changes during the wait. R-047, TC-046.
- Q-11 The deeplink format is undecided (Draft / TBD Q2; fallback mode=custom&style_guid=<guid>). Assumption: the fallback; deeplink rows wait for RD's link. R-069–R-071, TC-081, TC-082.
- Q-12 Is the 42–48 s wait in place acceptable (ANR, app killed in the background; Draft / TBD Q3)? Fallback: the 10/E lifecycle with staged strings. R-047, R-050.
- Q-13 The CMS type name and fields are to be confirmed (Draft / TBD Q4; fallback PhDM_AIHairColor_CustomStyle). R-024, TC-084.
- Q-14 Android system Back on the Custom panel, the face warning and during generation is not specified. Assumption: rows record it. R-073, R-074, R-077.
- Q-15 No Design file was supplied; every row is written from the PM page (PM-only) and the UI strings are the PM's. Rows change when the Design arrives.

## Added 2026-11-12 — coverage passes and standing inputs

### Flow arrows walked by existing rows
- R-080 [PM: flow arrow 3330-1552 https://www.figma.com/design/vhIp15PMJcwOcWJ6E9Q4JE/AI-Hair?node-id=3330-1552] custom_in_row 「Custom」 → panel_open_no_style: the Custom panel opens. Walked by: TC-019.
- R-081 [PM: flow arrow 3330-1554 https://www.figma.com/design/vhIp15PMJcwOcWJ6E9Q4JE/AI-Hair?node-id=3330-1554] panel_open_no_style → panel_ready: style and colours chosen, Generate enabled. Walked by: TC-028.
- R-082 [PM: flow arrow 3337-1876 https://www.figma.com/design/vhIp15PMJcwOcWJ6E9Q4JE/AI-Hair?node-id=3337-1876] panel_ready in-panel 「Generate」 → generating in place. Walked by: TC-045.
- R-083 [PM: flow arrow 3337-1879 https://www.figma.com/design/vhIp15PMJcwOcWJ6E9Q4JE/AI-Hair?node-id=3337-1879] panel_ready ⌄ → collapsed_applied: Custom selected, outer Generate enabled. Walked by: TC-038.
- R-084 [PM: flow arrow 3330-1558 https://www.figma.com/design/vhIp15PMJcwOcWJ6E9Q4JE/AI-Hair?node-id=3330-1558] generating → result_custom after 42–48 s: result in place, Intensity 100, 「Retry」. Walked by: TC-046, TC-048.

### Job states
| Job | Start / loading | Success | Failure | Retry | Second failure | Partial | Stop | Leave and return | Longest wait | Done notice |
|---|---|---|---|---|---|---|---|---|---|---|
| Custom generation | TC-045 | TC-048, TC-047 | TC-075, TC-076 | TC-049 | n/a (spec silent) | n/a (one image) | n/a (no Cancel, 10/E D1-03) | TC-052 | TC-046 | n/a (result in place, no notice) |

### Error classes
| Job | 4002 | Other errors |
|---|---|---|
| Custom generation | TC-075 | TC-076 |

### Exit × stage
| Stage | ⌄ collapse | Tap outside the panel | ✕ (bottom row) | System Back |
|---|---|---|---|---|
| Panel open, no style | n/a (Q-5: collapse with nothing chosen is undecided) | n/a (Q-5) | n/a (hidden while the panel is open, D6-16) | TC-085 |
| Panel ready | TC-038 | TC-039 | n/a (hidden while the panel is open, D6-16) | TC-085 |
| Palette open | n/a (the palette covers the panel) | n/a (the palette covers the panel) | n/a (palette has its own Cancel) | TC-086 |
| Generating | n/a (spec silent) | n/a (spec silent) | n/a (disabled while generating, D1-03) | TC-089 |
| Result, panel closed | n/a (no panel) | n/a (no panel) | TC-079 | TC-088 |

### Hidden clauses
| Requirement | Hidden clause | Observed through | Rows |
|---|---|---|---|
| R-031 | solid_color sends only main_color_r/g/b, no accent | The generation request in the app log after a log pull | TC-037 |
| R-036 | The colour is sent as r/g/b 0–255 | The generation request in the app log after a log pull; the hair colour in the result | TC-036 |
| R-040 | One Custom image is charged 6 credits | The credit chip before and after, and Buy Credit › Detail | TC-045, TC-050 |
| R-050 | Credits stay charged when the app is killed | The credit chip before and after | TC-052 |
| R-053 | Retry charges 6 again | The credit chip before and after | TC-049 |
| R-055 | Recalling a result charges nothing | The credit chip before and after | TC-054 |
| R-056 | Dragging Intensity is free | The credit chip before and after | TC-053 |
| R-057 | The Artwork copy is saved at 100% when the result succeeds | My AI Artwork › AI Hair › Color opened right after the result, before ✓ | TC-055 |
| R-065 | A failed generation refunds the credits | The credit chip and Buy Credit › Detail | TC-075, TC-076 |

### Variants
| Requirement | Variant | Rows |
|---|---|---|
| R-032 | style=face_framing | TC-058 |
| R-032 | style=colored_bangs | TC-059 |
| R-032 | style=highlights | TC-060 |
| R-032 | style=balayage | TC-061 |
| R-032 | style=ombre | TC-062 |
| R-032 | style=solid_color | TC-063 |
| R-032 | style=dip_dye | TC-064 |
| R-032 | style=colored_roots | TC-065 |
| R-032 | style=earloop_highlights | TC-066 |
| R-032 | style=split_dye_vertical | TC-067 |
| R-032 | style=split_dye_horizontal | TC-068 |
| R-029 | only Base Color filled | TC-026 |
| R-029 | only Highlight Color filled | TC-027 |
| R-034 | Base Color wheel | TC-032 |
| R-034 | Highlight Color wheel | TC-033 |
| R-042 | ⌄ key | TC-038 |
| R-042 | tap outside the panel | TC-039 |
| R-062 | Free user | TC-070 |
| R-062 | subscriber, for contrast (R-063) | TC-071 |
| R-063 | VIP user (Android's one paid mode, KP-012) | TC-071 |
| R-061 | Free user, purchase style | TC-069 |

### System back
- Intro Demo: TC-090 (R-072)
- Face warning dialog: TC-087 (R-073)
- Ratio dialog (Cancel / Crop): n/a (drawn on the 10/E page; covered by the 10/E table)
- Custom panel: TC-085 (R-074)
- Colour palette: TC-086 (R-075)
- Room, panel closed: TC-088 (R-076)
- Generating: TC-089 (R-077)
- Intensity notice dialog: n/a (10/E dialog; covered by the 10/E table)

### Domain rules
| Entry | Requirements |
|---|---|
| KP-012 | R-063 |
| KP-014 | n/a (AI Exposure only) |
| KP-015 | n/a (no Premium purchase in this feature) |
| KP-016 | n/a (one-time free trial for Custom is undecided, Q-7) |
| KP-017 | R-066 |
| KP-018 | n/a (Credit Auto Pass not used here) |
| KP-019 | R-051 |
| KP-020 | R-067 |
| KP-021 | n/a (no chat quota) |
| KP-024 | R-057 |
| KP-025 | n/a (AI Exposure only) |
| KP-026 | R-057 |
| KP-027 | n/a (Recent is a 10/E matter; the page states nothing new) |
| KP-028 | n/a (Artwork filters not changed) |
| KP-029 | n/a (no long task tile; the wait is in place) |
| KP-030 | R-058 |
| KP-032 | R-014 |
| KP-033 | R-069 |
| KP-034 | n/a (Discover only) |
| KP-035 | n/a (AI Replace only) |
| KP-036 | n/a (no prompt) |
| KP-037 | n/a (AI Try-On only) |
| KP-038 | n/a (AI Group Shot only) |
| KP-039 | n/a (Agent jobs only) |
| KP-040 | n/a (no crop tabs in this feature; Crop is the existing room) |
| KP-041 | R-056 |
| KP-042 | n/a (no restored transform state) |
| KP-043 | n/a (Video Editing only) |
| KP-044 | n/a (Video Editing only) |
| KP-045 | n/a (Audio Range Select only) |
| KP-046 | n/a (Try-On / Hairstyle only) |
| KP-047 | n/a (no mask) |
| KP-048 | n/a (the spec states no locale scope) |
| KP-049 | n/a (the spec states no locale scope) |
| KP-050 | n/a (the spec states no locale scope; RTL not in scope) |

### Request ledger coverage
| Ledger entry | Requirements |
|---|---|
| REQ-001 | analysis entry (this draft); no table requirement |
