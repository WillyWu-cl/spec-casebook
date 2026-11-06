# Support Photo Enhancer — board notes (spec set 2026-11-06, Figma-only)

PM page 65:3761 「✅SPEC」 (figma-pm, read 2026-11-06) and Design page 212:2045 「temp_UJ_ toolbar regroup_24.10E»
(figma-design, read 2026-11-06). Board images in `figma/`, texts in `boards/`. The PM page has no dates of its own; its
reference shots are named 「U-2025-02-13」 and 「U-2025-08-27」, and its linked sheet's newest tab is 「2026/11 Auto
Reframe」. The Design page is the 24.10E toolbar regroup (older); only its icon slice is dated (「12.23」).

## pm-header
- 「SPEC」 title bar over the whole flow. No rule.

## pm-master-photo — 「Master Photo」
- Editor with a photo clip selected on the master track. Toolbar (scrolls sideways): Split, Duration, Transform, Adjust,
  Transition, Background, Effects, **Enhance**, Tools, Duplicate, Mask, Portrait. Only Split…Adjust fit on the phone;
  Enhance is the 8th button.
- Arrow 65-6779: 「Enhance」 → the Enhance second layer (popup beside the flow, 「打開second layer」).

## pm-pip-photo — 「PiP Photo」
- Editor with a photo clip on a PiP track (track label 「PiP Photo」). Toolbar: Split, Duration, Transform, Opacity,
  Motion, Adjust, Background, Effects, **Enhance**, Tools, Duplicate, Mask, Blending, Portrait.
- Arrow 65-6780: 「Enhance」 → the same second layer (not returned by the read; listed by hand from the page metadata).

## pm-enhance-flow — the main flow (left to right)
1. **Second layer popup** (Frame 8786, beside the phones): 「Photo Enhance」 (photo-with-sparkle icon,
   round/ic_ai_enhancement) and 「AI Color」 (round/ic_ai_color), in that order. Note 「打開second layer」. A collapsed
   「Enhance」 tile is drawn under it.
2. Arrow 65-9989: 「Photo Enhance」 → phone 65:4092: dialog 「Ready to Enhance?」 / 「Your image will look even better in
   just a few seconds.」 with 「Cancel」 and 「Continue」 (Dialog_text_02). No arrow from 「Cancel」.
3. Arrow 65-6781: 「Continue」 → phone 65:6095: the editor dims, a spinner, 「Enhancing...」 and a 「Cancel」 button
   (Frame 33). No arrow from 「Cancel」.
4. Arrow 65-6782 (automatic, the enhancement finishes) → phone 65:4427: the enhanced photo (freckles sharper) and
   the toast 「Applied Photo Enhance」. The toolbar has scrolled to Effects / **Enhance** / Tools / Duplicate; a small
   white dot (Vector 2597, 4×4) sits on 「Enhance」.
5. Arrow 65-6783: 「Enhance」 → phone 65:9990: the second layer opens over the toolbar (Frame 8786 copy) with a white
   dot over 「Photo Enhance」. Notes 「打開second layer」 and 「再次點擊Image Enhance(已套用狀態)」 (tap Photo Enhance again,
   applied state).
6. Arrow 91-8364: 「Photo Enhance」 (applied) → the **Photo Enhance panel** (loose shapes at 3389,497, not a frame):
   full-height preview of the photo, ✕ top-left (Rectangle 734), an icon top-right, under the preview 「Reset」 (left,
   blue) and the title 「Photo Enhance」, then two option tiles 「Original」 (video-camera icon in the mockup) and
   「Result」 (selected, outlined). Modelled on the reference shots: 「ref. 在 timeline 點擊 video enhance (已經套用過)」
   (Video Enhance panel: ✕, history icon, 「Video Enhance」, 「Original」 / 「Result」 / 「Edit Again」, trash, 「View details of
   applied effects」) and 「ref. 在 shortcut 使用 photo enhance room」 (Photo Enhance room: ‹, 「Export」, compare icon,
   「Original」 / 「Result」).
   Note under the panel: 「再次點擊Image Enhance(已套用>未套用狀態), 需要記住上次的result, 因此第二次套用不會有progressing」 —
   tapping Image Enhance again going from applied to not applied: the last result must be remembered, so applying a
   second time shows no progress.
7. Arrow 91-8366: ✕ → back to phone 65:9990 (the editor, applied state).
8. Arrow 91-8359: 「Reset」 → phone 91:7764: the original photo and the toast 「Removed Photo Enhance」; note 「小白點消失」
   (the white dot is gone: no dot on 「Enhance」).

### Controls (Figma-read by hand) — the Photo Enhance panel (no frame, so not in inventory.json)
- ✕ (top-left): closes the panel (91-8366).
- Top-right icon: no arrow, no note (Q-6).
- 「Reset」: removes the enhancement (91-8359).
- 「Original」 / 「Result」 tiles: choose what the clip shows; 「Result」 selected when the panel opens.

## pm-full-screen — 「Full Screen Preview」
- Phone 65:5095: editor with the photo, toolbar Effects / Enhance (white dot, Ellipse 230) / Tools / Duplicate.
- Arrow 65-6786: full-screen button → full-screen preview (reference shot U-2025-02-13, a street photo with a player bar).
- Arrow 65-6787: preview → the same preview with the placeholder 「screenshot IAP dialog」 (Frame 34).
- Note: 「***Timeline Mode, Full Screen一律做擋截圖, 樣式跟rule都跟原shortcut image enhancer一樣」 — in the timeline, full
  screen always blocks screenshots; the look and the rules are the same as the existing shortcut image enhancer
  (Photo Enhance room).

## pm-refs
- The two reference shots named above (Video Enhance panel in the timeline, Photo Enhance shortcut room).

## pm-toolbar-link
- 「Toolbar re-org reference」 + the Google Sheet link: read into `toolbar-reorg-sheet.md` (links.json). The sheet's
  newest tab lists Enhance → 1. Photo Enhance, 2. AI Color for both photo toolbars; its first-layer order differs from
  the PM mockups (Enhance after Background, before Transition, on the master photo toolbar).

## Design — d-master-photo-toolbar, d-pip-photo-toolbar (24.10E toolbar regroup)
- Master Photo Toolbar: Split, Duration, Transform, Adjust, Transition, Background, Effects, Enhance, Tools, Duplicate,
  Mask, Portrait; the sheet image above it marks 「(Enhance)」 column 8 with **no second layer**, and AI Color sits
  under **Effects** (with Tempo Effects, Effect, Filter, AI Scene).
- PiP Photo Toolbar: Split, Duration, Transform, Opacity, Motion, Adjust, Background, Effects, Enhance, Tools,
  Duplicate, Mask, Blending, Portrait; AI Color under Effects; Enhance with no second layer.
- A 「New icon」 row on the master photo board holds round/ic_ai_enhancement among the new icons.
- The Design draws none of the Photo Enhance screens (dialog, Enhancing, panel, toasts): those rows are PM-only.

## Design — d-icon-slice (「Icon」, 「12.23」)
- round/ic_ai_enhancement (photo with a sparkle) and round/ic_crop: the dated icon export. The photo-with-sparkle icon is
  the one the PM draws on 「Photo Enhance」.

## Not this feature (Design page 212:2045)
- 「Experiment for RD」 (2-d panel), the video toolbars of 「toolbar icon」, 「2-d panel UI - iPad」, 「Landscape Mode」 and
  section 585:19827 (other features' PM spec: stickers, audio, Extract Audio) are the general toolbar regroup: not read.
