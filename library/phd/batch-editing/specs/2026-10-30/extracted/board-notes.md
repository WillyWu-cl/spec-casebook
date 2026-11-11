# Batch Editing — board notes, spec set 2026-10-30

Sources: `UI UX flow.pdf` (one Figma export page "Demo + Spec", 9956 × 18869 pt; PM-owned, carries the UI and the
【Requirement】 blocks with rule IDs `[D0-…]`, `[DR-…]`, `[D1-…]`) and `Section 3 · 美圖 Apply to all 實測.pdf` (PM test of
Meitu's crop Apply to all, ending in the PhD decision 「✅ 結論」). Both read from the PDF text layer through MuPDF (the
Chinese maps correctly; pdftotext does not) plus close-up renders (`regions/`). No dates on any board other than the
26'11/E release tag; no Figma links, so this is a **PDF-only** analysis (`figma-pending.json`).

Product: PhotoDirector (Launcher 「AI Group Photos」, AI Enhance room, Premium IAP). Mockups are iPhone frames; this
table is Android.

## overview
- Edit Room edits one photo with every tool; Batch Edit edits N photos with only the three adjustments whose one
  setting can be applied to every photo, then individual fine-tuning [D0-03].
- Audience: travel / event sets, seller product photos, social carousels; Meitu and Fotor have it [D0-01].
- Name Batch Edit / Batch Edit Room; appears only in the Launcher 「Edit」 Picker and the AI Enhance Shortcut Picker;
  not inside Edit Room [D0-04][D0-04b].
- iOS + Android together, 26'11/E [D0-05].
- No batch editing in the app today; this version only AI Enhance / Crop & Rotate / Adjustment; Filter / Preset later
  by usage [D0-07][D0-06][DR-03].
- Batch itself is free and AI Enhance charges no credits [D0-08][D5-01b].

## entry-edit (flow; blue = forward tap, red = back)
Launcher 「Edit」 → Photo Picker (Recents / Stock, Single | Batch segment, selection numbers, 「Select 1 to 20 photos.」,
「Done」) → Batch Edit Room main (Home, Replace photo, Save, Setting; undo / redo; compare; thumbnail strip; Crop & Rotate /
Adjustment / AI Enhance) → Crop & Rotate room (ⓘ, 「All」; strip; angle slider 「33」; Rotate / Flip / Flip Vertically /
Custom / Original …; ✕ / reset / undo / redo / ✓). Red: Picker ‹ → Launcher; room ✓ → main.

## entry-batch-shortcut
One Launcher frame titled 「Entry: Launcher › Batch Editing shortcut」 with no note and no arrow. The Launcher drawn shows
no Batch Editing shortcut (Edit / Camera / Quick Action / Motion Swap / AI Edit Agent / Reel Creator / AI Removal / AI
Group Photo / Beautify / AI Try-On). Conflicts with D0-04 (entries only from the Edit and AI Enhance pickers): Q-2.

## flow-adjustment
Main 「Adjustment」 → Adjustment room (Light / Color / Details; Auto, Exposure, Contrast, Hightlight [sic], Bright, MidTone,
Dark, Shadows; slider; 「All」) → tap 「All」 → toast 「Applied to 11 photos」 → ✓ → main.

## flow-ai-enhance
Main 「AI Enhance」 → AI Enhance page (credit pill 「182」, strip, 「Enhance」, 「Maximize detaill and clarity with advanced
AI.」 [sic], ✕ / ✓ greyed) → 「Enhance」 → Confirm Dialog 「Enhance {xx} photos?」 / 「Processing takes a moment and cannot
be canceled once started.」 / Cancel / Start → Start → 「Creating Your AI Image」 「Enhancing 3 / 20」 → 「12 completed, 3
failed」 「Failed photos are marked with ! on the thumbnails.」, red ! on 3 thumbnails, 「Retry Failed (3)」 → ✕ → main.
Red: Cancel → AI Enhance page; ✕ (result) → main.

## entry-enhance-shortcut
Launcher 「AI Enhance」 shortcut → Photo Picker Batch tab (「3 selected (max 20)」, 「Done」) → Batch Edit Room AI Enhance page
directly [DR-02]. Red: Picker ‹ → Launcher.

## free-user-iap
Free user AI Enhance 「Enhance」 → existing Premium IAP page (no screen in this file).

## batch-one
Batch tab, 1 selected (「1 selected (max 20)」) → 「Done」 → single Edit Room (Quick Action / Edit / Enhance / Portrait / …).
Single Edit Room Replace photo → Photo Picker; the Batch tab can be chosen there to go to Batch Edit [D1-08c].

## save-flow
Main Save → 「Saving 3 / 20」 「Please do not leave this page or quit the app.」 with a progress bar → 「Saved 12 photos」 grid,
‹, Home, 「Edit Next Batch」. Red: ‹ → main; Home → Launcher. Blue: 「Edit Next Batch」 → Picker Batch tab.

## leave-flow
Picker Done → main → Home / Replace photo → 「Discard changes?」 「Your edits to these photos will be lost.」 「Discard」
「Keep Editing」. Discard → Picker (Batch tab, earlier photos kept); Keep Editing → main. No edit yet: Home → Launcher,
Replace photo → Picker Batch tab without a dialog [D1-08][D1-08b].

## credit-notes / server-task-notes (pending decisions)
- Not applicable: no credit deduction, so batch never hits insufficient credits [DR-11][DR-11b].
- Q1 (PM, pending, Judy with Samuel): whether AI Enhance will charge credits, following PhD PC (1 credit per 10 photos,
  fewer than 10 also 1 credit, ⓘ at top left). The mockup beside it is a what-if, not the spec: Q-7.
- Q2 (PM, pending): lock batch editing to Premium (Meitu shows IAP at the 13th photo; premium supports 50): Q-8.
- Partial failure: one summary after all, no dialog per photo; failed photos can be retried [D1-04]. No cancel [D1-03].
  App killed: Batch Edit Room is gone, AI Enhance results not kept (Standard not in My AI Artwork) [D1-05][D1-10].
  Offline = failure, Retry Failed reruns; to background: paused, continues on return [D1-05].

## tracking (analytics — names pending, not observable on the phone)
Enter event (name TBD, e.g. Batch_Edit_Enter) when the Picker switches to Batch and enters Batch Edit Room;
GenAI_Feature_Generate with from=BatchEdit + batch_size, once per photo; Photo_Result_Save unchanged per batch save;
new event for 「Edit Next Batch」 taps. PascalCase three parts, snake_case parameters [D0-02][D4-01][D1-07].

## State boards (【Requirement】 blocks; rules in requirements.md)
picker-single, picker-batch, picker-batch-one, picker-over-max (toast 「Please pick at most 20 photos.」), room-default,
crop-default / crop-applied, adjust-default / adjust-applied, enhance-default / already_done (「Enhanced」 disabled) /
free_user / processing / result_summary (「Failed photos are marked on the thumbnails.」 — the flow frame adds 「with !」,
Q-1) / network_incomplete (「8 completed, 7 failed」 「Connection lost. Check your connection and retry.」 「Retry Failed (7)」)
/ offline (toast 「No internet connection」), confirm-dialog, discard-dialog, save-saving, save-saved (heading
「【Order of Artwork】」 over the Save-page rules).

## meitu (Section 3)
Meitu syncs ratio + relative size + relative position (Free too). **PhD decision (✅ 結論):** sync ratio + relative
position, not size. Current photo keeps its box; others get the largest box of that ratio placed at the source's
relative position; relative position = left margin ÷ (width − box width), top margin ÷ (height − box height), 0 / 0.5 /
1; only directions with room move, a direction with no room (or a source with no room) is centred (0.5); output px
differ per photo; applying overwrites the others' earlier crop, recomputed from the original. Free = custom ratio,
same rules; Original = each photo back to its own ratio, no crop; ratio equal to the photo = whole photo; manual px
range 238 px … photo width / height, beyond → toast, Apply to all takes only the ratio. Rotate: 90° rotation and H / V
flips applied to each; angle fine-tune applies the same angle, the auto-shrunk box is computed per photo, then the crop
rules. Undo after Apply to all: one Undo reverts the application on all photos, Redo restores all.
Cases C1, C5–C12 with test photos ① escalator 2:3 (1706×2559) ② 101 4:5 (1576×1970) ③ tea cup 1:1 (small)
④ seascape 16:9 (2730×1535).

## Controls (PDF-read)
- Launcher: 「Edit」, 「AI Enhance」 shortcut.
- Photo Picker: ‹, Recents ▾, Stock, 「Single」, 「Batch」, photo tiles (select / deselect), 「Done」, camera, ⓘ.
- Batch Edit Room main: Home, Replace photo, Save, Setting, Undo, Redo, compare, thumbnails, 「Crop & Rotate」,
  「Adjustment」, 「AI Enhance」.
- Crop & Rotate room: ⓘ, 「All」, thumbnails, angle slider, 「Rotate」, 「Flip」, 「Flip Vertically」, 「Custom」, 「Original」,
  「Squre」 [sic], 「2:3」, 「3:2」, 「3:4」 (more ratios to the right, Free / Social Media per Section 3), crop box handles,
  manual px (pencil, Section 3), ✕, reset, Undo, Redo, ✓.
- Adjustment room: ⓘ, 「All」, compare, thumbnails, slider, 「Light」 / 「Color」 / 「Details」, tools (Auto … Shadows), ✕,
  reset, Undo, Redo, ✓.
- AI Enhance page: credit pill, thumbnails, 「Enhance」 / 「Enhanced」 / 「Retry Failed (x)」, ✕, ✓.
- Confirm Dialog: 「Cancel」, 「Start」. Discard Dialog: 「Discard」, 「Keep Editing」.
- Batch Save page: ‹, Home, thumbnails (not openable), 「Edit Next Batch」.
- Premium IAP page: existing (✕, plans, 「Continue」) — not part of this spec.
