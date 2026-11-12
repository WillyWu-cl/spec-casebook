# Swipe Collage — requirements (android)
Spec: Swipe Collage PhDM Spec.pdf (PM "Demo + Spec — Scrollable Collage (26 11E)", spec set 2026-11-05) and the Design
Figma file Swipe_collage (iUy5kOrVNG7IjcyxGGnp9t, page 0:1 「20261029_Swipe Collage」, read whole on 2026-11-05)

Source tags: `[PM:<board>; <spec ID>]`, board IDs from `specs/2026-11-05/extracted/boards.json` (the PM PDF's text
layer, identical to the right half of the 2026-10-29 Collage.pdf), spec IDs as the board prints them (`D1-07`, `F4` …);
`[DS:<board> <node>]` for a Design board (Figma names, light-mode copy; every board is drawn again in dark mode).
Design and PM: the Design page is labelled 20261029 and the PM text has not changed since the 2026-10-29 export, so the
dates cannot tell which is newer (Q-28). Rows follow the Design for UI and layout (format rule: Design outranks PM)
and say 「check on device」 where the PM differs; PM rules the Design does not contradict stay as written.
Mockups are iPhone frames; Android differences are stated where the spec names them (photo picker cap, D2-06) and in
"System back". Request ledger: REQ-001 (this table), REQ-004 (TC-018 languages), REQ-008 (this update).

## Entry
- R-001 [PM:states-collage-room; D1-07, D1-16] [DS:Collage Room · banner (NEW) 1:238] On entering the Collage room a Swipe Collage banner is shown at the top of the room, under the layout filter tabs (「All」, 1–6) and above 「New」 (Collage has no AI / Traditional categories).
- R-002 [PM:states-collage-room; D1-07] The banner is shown every time Collage is entered; it is not removed by default (also after it was used).
- R-003 [DS:Collage Room · banner (NEW) 1:238; PM:entry-banner; D1-07] The banner reads 「Try Swipe Collage!」 / 「Create the perfect year-end recap post.」 with 「›」 and a collage picture. The Design draws no 「NEW」 tag; the PM entry flow draws 「NEW ›」 (Q-18). (Design answers Q-1 for the copy.)
- R-004 [PM:flow-table, states-collage-room; D1-07, D0-04] [DS:Template Page · default (NEW) 3:336] Tapping the banner opens the Template Page 「Swipe Collage」 (PM: 「Scrollable Collage」), an independent new room, not a Collage category.
- R-005 [PM:overview; D0-04, D0-06, D1-08] No Launcher shortcut for the feature in this build (not in this spec; not built).
- R-006 [PM:overview; D0-04, D0-06] Swipe Collage output is not added to My AI Artwork. (Checked as R-124.) Walked by: TC-140.
- R-007 [PM:entry-deeplink, states-template-page; D1-09] Deeplink `scrollable_collage` lands on the Template Page (waterfall).
- R-008 [PM:entry-deeplink, cms; D1-09, D2-07; KB: KP-033] A deeplink with `category_guid` selects that category on the Template Page and scrolls its tab into view.
- R-009 [PM:entry-deeplink, cms; D1-09] A deeplink with `template_guid` opens that template's Template Preview directly.

## Template Page
- R-010 [DS:Template Page · default (NEW) 3:336; PM:states-template-page; D1-01] The Template Page is titled 「Swipe Collage」 (PM: 「Scrollable Collage」) with 「‹」 and lists templates as a two-column waterfall.
- R-011 [PM:states-template-page; D1-01] [DS:3:336] Each card shows only the default photo count and page count (「9 photos · 5 pages」); no portrait / landscape label.
- R-012 [PM:states-template-page; D2-08, F16] A card thumbnail shows the template's first page.
- R-013 [PM:states-template-page, cms; D2-03, D2-07] [DS:3:336] 3–4 categories in CMS order with 「Year End」 first (selected on entry, as drawn; the Design's other tabs 「Category1」 / 「Category2」 are placeholders).
- R-014 [PM:flow-table; D2-07] Tapping a category tab switches the list to that category.
- R-015 [PM:states-template-page, cms; D2-03, D2-07] NEW tags come from the CMS tag.
- R-016 [DS:Template Page · default (NEW) 3:336; PM:states-template-page, cms; D3-02] A CMS-PRO template shows a PRO crown icon at the card's top right (the Design draws the crown; the PM mock a 「PRO」 label).
- R-017 [PM:states-template-page, flow-table; D2-08, F16] Swiping a card thumbnail right shows that template's next pages (as SCRL); every page is shown.
- R-205 [DS:Template Page · default (NEW) 3:336] Each card thumbnail carries page dots that mark the page shown, and they follow a thumbnail swipe.
- R-018 [PM:states-template-page, cms; F16] Thumbnails come in East and West sets; every page of the set is shown in the UI. Which set a user sees is not stated (Q-12); per REQ-004, East is tested with the app in Traditional Chinese and Japanese, West in English and German.
- R-019 [PM:states-template-page, cms; F16] Day 1 has 20 templates.
- R-020 [PM:flow-table; D1-07] Template Page 「‹」 returns to the Collage room.
- R-021 [PM:flow-table; D1-02] Tapping a thumbnail opens the Template Preview.

## Template Preview
- R-022 [DS:entry_launcher2 18:386; PM:states-template-preview; D1-02] The preview (title 「Template」, 「‹」) shows the photo / page count (「9 photos · 5 pages」; the Design writes 「5pages」, Q-30), the category (「Year End」), page dots and 「Use Template」.
- R-023 [PM:states-template-preview, flow-table; D2-09] Swiping left / right moves page by page (as SCRL).
- R-024 [PM:states-template-preview; F1] The preview shows the template's default layout.
- R-025 [PM:states-template-preview, flow-table; D1-02] 「Use Template」 opens the Canvas.
- R-026 [PM:states-template-preview; D3-02, D3-04] A CMS-PRO template shows a PRO icon at the top right; a free user can use it, IAP comes only at export.
- R-027 [PM:flow-table; D1-02] Template Preview 「‹」 returns to the Template Page.

## Canvas
- R-028 [PM:states-canvas; D1-03] The canvas has several pages; the view zooms freely and scrolls left / right.
- R-029 [PM:states-canvas; F2] [DS:canvas_default 69:6711] Every hole is an add-image frame with a 「+」 (grey slot with a black round 「+」).
- R-030 [PM:states-canvas, flow-table; D1-13] [DS:canvas_default 69:6711] 「↶」 / 「↷」 undo / redo every canvas operation; the Design puts them in the bottom row between ✕ and ✓ (PM: at the top).
- R-217 [KB: KP-041] 「↷」 is available only when there is something to redo (after an undo); each 「↶」 steps back one operation.
- R-031 [DS:canvas_default 69:6711, 1_entry 23:989; PM:states-canvas; D1-04] Canvas controls: tool bar 「Background」 / 「Layers」 / round 「+」 / 「Ratio」 / 「Pages」, and under it ✕ / ↶ / ↷ / ✓. There is no top bar (the PM's top 「‹」, undo / redo and 「Export」 are not drawn; check on device).
- R-032 [PM:states-canvas; D1-04] Every element is adjustable: text colour, content and font; image position.
- R-033 [PM:leave-notes, entry-banner, flow-table; D1-10] [DS:canvas_default 69:6711] Leaving the Canvas (Design ✕, PM 「‹」) shows 「Discard changes?」 with 「Discard」 / 「Keep」 (as Edit Room); Discard returns to the Template Preview, Keep stays with the edits.
- R-034 [PM:leave-notes; D1-10] When the app was killed during editing, a 「Continue editing?」 dialog (as Edit Room) appears next time; continuing restores the project.
- R-035 [PM:leave-notes; D1-18] Only the latest editing record is restored (one task at a time).

## Photos
- R-036 [PM:flow-table, entry-banner, states-photo-picker; F4, D2-06] [DS:photo_picker 23:531] Tapping a frame's 「+」 opens the photo picker, the same as the Collage picker (「‹」, tabs 「Photo」 / 「Stock」, albums 「Recents」 「Sample Photos」 「Favorites」 「Instagram」, photo grid); its 「‹」 returns to the Canvas.
- R-037 [DS:photo_picker 23:531; PM:states-canvas, states-photo-picker; F4, D2-06] One or several photos can be imported; the limit is the number of empty frames. The picker's tray reads 「Please select 3 photos to continue.」 with the count 「(n/3)」 and an orange ✓ (PM mock: 「Select up to 3 photos」, 「Done (2)」).
- R-213 [DS:photo_picker 23:531] Each selected photo shows in the tray with a ✕; tapping ✕ deselects it and the count goes down.
- R-214 [DS:photo_picker 23:531] The picker's 「Stock」 tab offers stock photos that can be imported like gallery photos (Collage picker behaviour).
- R-038 [PM:states-photo-picker; D2-06] The import limit is capped at 20 on both platforms; Android is not held to its default 6.
- R-039 [PM:states-photo-picker, flow-table; F4] [DS:photo_picker 23:531] The tray's ✓ (PM 「Done」) fills the empty frames in order and returns to the Canvas.
- R-040 [PM:states-canvas; F4] A single photo can be imported too.

## Frame focus
- R-041 [PM:states-canvas; F6] Tapping a frame selects it (「Frame selected」); a tap in frame focus moves to image focus, a tap in image focus back to frame focus.
- R-042 [PM:states-canvas; F7, D1-32, D1-05] [DS:canvas_frame_focus 33:2230] Frame focus outlines the frame in orange with corner handles and shows floating Delete / Duplicate / Lock icons above it.
- R-043 [PM:states-canvas; F9] [DS:canvas_frame_focus 33:2230] The frame toolbar holds 「Opacity」 「Shadow」 「Flip H」 「Flip V」 「Duplicate」 「Lock」 「Delete」 (the Design's 7th item is labelled 「Removal」, Q-19).
- R-044 [PM:states-canvas, flow-table; F9] Delete (floating or toolbar) removes the whole frame.
- R-045 [PM:flow-table; F9, D1-05] Duplicate copies the frame.
- R-046 [PM:flow-table; F9] Flip H / Flip V flip the frame immediately.
- R-047 [PM:flow-table, tbd; F9] Opacity / Shadow open controls for the frame (TBD-1: the Collage room's sliders, Q-2).
- R-048 [PM:states-canvas; F3] A frame can be scaled.

## Image focus
- R-049 [PM:states-canvas; F8, D1-35] [DS:canvas_img_focus 28:1621] Image focus (「Image selected」) has one horizontally scrolling bar: 「Replace」 「Flip H」 「Flip V」 「Adjust」 「Filter」 「Removal」 「Enhance」 「Lock」 「Delete」 (the Design writes 「Fliter」, Q-30).
- R-050 [PM:flow-table; F8] Replace opens the photo picker and replaces the photo.
- R-051 [PM:flow-table; F8] Flip H / Flip V flip the photo immediately.
- R-052 [PM:flow-table, states-canvas; F8] Adjust / Filter work as in the Collage room.
- R-053 [PM:states-canvas; F8] Delete empties the frame and its 「+」 add-image icon shows.
- R-054 [PM:states-canvas, monetization-notes, removal-flow, enhance-flow; D3-01] Removal and Enhance carry a premium (PRO) tag on the toolbar. The Design draws no tag on either (Enhance's icon has a sparkle), Q-20.
- R-055 [PM:removal-flow; D3-01, D1-43] [DS:GAI_removal 61:4517] Removal opens the Object Removal room (「Smart Select」 / 「Manual」 / 「One-Tap」, PRO toggle, 「Box」 / 「Circle」 / 「Swipe」, 「Remove」, ✕ / ✓); for a free user, applying shows the IAP page.
- R-056 [PM:enhance-flow; D3-01, D1-43] [DS:Enhance_2 67:6424] Enhance opens the AI Enhance room (「Standard」 / 「Advanced」, 「General」 「Portrait」 「Anime」 「Product」 「Scenery」 「Pets」 「Concert」, 「Enhance」, ✕ / ✓); for a free user, applying shows the IAP page.
- R-211 [DS:Enhance_2 67:6424; KB: KP-020] The AI Enhance room shows the credit balance button (「100」 with 「+」, opening Buy Credit) and, on 「Advanced」, 「Enhance」 priced 5 credits (「Maximize detail and clarity with advanced AI.」). D4-01 says the feature charges no credits (Q-27).
- R-057 [PM:removal-flow, enhance-flow; D1-11] For a paying user, ✓ puts the result in place of that frame's photo and returns to the Canvas.
- R-058 [PM:states-canvas; D1-11] The Removal / Enhance result can be undone on the Canvas.
- R-059 [PM:states-canvas; D1-11] The Removal / Enhance result is not saved to the album separately.
- R-060 [PM:removal-flow; D1-11] ✕ in the room applies nothing and returns to the Canvas.
- R-061 [PM:removal-flow, enhance-flow, flow-table; D3-01, D3-03] [DS:B (mimic VVG/ Beauty plus) 103:6032] The IAP page is 「PhotoDirector Premium」 with a ✕. PM: the existing page, unchanged (「Continue」); the Design draws a new layout (「Access all AI tools & Get 3600 free credits per year」, 「Start 7-Day Free Trial」, 「Terms of Service」 | 「Privacy Policy」 | 「Restore Purchase」), Q-21.

## Swap and drag
- R-062 [PM:states-canvas; F5] Long-press a photo and drop it on another frame: the two swap (「Long press & drag to swap」).
- R-063 [PM:states-canvas; D1-20] Inside a multi-image frame, long-press drag to another cell swaps them.
- R-064 [PM:states-canvas, states-pages; F13] When pages move, each element follows the page holding its centre; a cross-page element still spans pages after the move.

## Frame styles
- R-065 [PM:states-canvas, states-layers; D1-19] Frames are single-image (polaroid) or multi-image (film strip); each Frame panel thumbnail states its photo count.
- R-066 [PM:states-canvas, flow-table, tbd; D1-21] The style is switched from the frame toolbar, not by dragging (entry TBD-2, Q-3; the Design's frame toolbar has no Frame button either).
- R-067 [PM:states-canvas; D1-21] Single → multi: the photo goes to the first cell (left→right, top→bottom); other cells show 「+」.
- R-068 [PM:states-canvas; D1-22] Multi → single keeps the first photo; the others are deleted.
- R-069 [PM:states-canvas; D1-22] Multi → fewer cells (N) keeps the first N photos in left→right, top→bottom order.
- R-070 [PM:states-canvas; D1-22] Deleted photos do not come back when switching back; only undo / redo restores them.

## Locks
- R-071 [PM:states-locks; D1-33] A locked frame (「Frame locked」) cannot be dragged, rotated or scaled.
- R-072 [PM:states-locks; D1-33] A focused locked frame still shows the toolbar; all items except Duplicate / Unlock / Delete are disabled.
- R-073 [PM:states-locks, flow-table; D1-33, D1-32] Locked-frame floating icons: Delete / Duplicate / Unlock; Duplicate and Delete work as unlocked.
- R-074 [PM:states-locks, states-pages; D1-33, D1-39] Deleting or removing a page in Pages deletes a locked frame on it.
- R-075 [PM:states-locks; D1-34] A locked image (「Image locked」) cannot be dragged or zoomed.
- R-076 [PM:states-locks; D1-34, D1-35] A focused locked image still shows its one toolbar; all items except Unlock / Delete are disabled.
- R-077 [PM:states-locks; D1-34] Locked-image floating icons: Delete / Duplicate / Unlock.
- R-078 [PM:states-locks, flow-table; D1-32] Unlock returns to normal focus and editing.

## Background
- R-079 [PM:states-background, flow-table; F10] [DS:background_panel_solid 69:6938] 「Background」 opens a sheet with tabs 「Solid」 / 「Texture」, a collapse ⌄ and ✕ / ✓ at the bottom (PM: ✕ only).
- R-080 [PM:states-background; F10, D1-23] [DS:69:6938] Solid: 32 swatches (8 × 4, content team; the Design draws rows of 7, Q-22); a swatch applies at once; no gradient.
- R-081 [PM:states-background; D1-17] Textures are new content and loop seamlessly.
- R-082 [PM:states-background; D3-02, D2-07] [DS:background_panel_texture 72:1505] Some textures are PRO (CMS; crown icon) and NEW-tagged; a free user may apply them, IAP at export.
- R-083 [PM:states-background; D1-23] [DS:background_panel_solid 69:6938, 72:1786] 「Custom color」 (the Design's colour-wheel swatch with 「+」, first in the grid) opens a picker: saturation / brightness square, hue bar and eyedropper, 「Cancel」 / 「Done」 (as Text color picker).
- R-084 [PM:states-background; D1-23] The eyedropper picks a colour from the canvas.
- R-085 [PM:states-background; D1-23] Picker 「Cancel」 does not apply; 「Done」 applies the colour as the background.
- R-086 [PM:flow-table, tbd; F10, D1-31, D1-42, D1-37] A bottom sheet's ✕ closes it; TBD-4 proposes that it keeps the applied changes (Q-5; the Design now also draws ✓).
- R-206 [DS:background_panel_solid 69:6938, Layers 73:2199, Ratio 74:2830, 3_Add_Sticker 54:1835, 4_frame 54:2110, 5_Text_bubble 54:2359] Every bottom sheet (Background, Layers, Ratio, Sticker, Frame, Text Bubble) has a ✓ that keeps what was applied and closes it.

## Add Layer
- R-087 [PM:add-layer-flow, states-layers; F11] [DS:[+] 開 Add Layer：五個 function 49:1511] The round 「+」 opens the Add Layer card above the tool bar: 「Image」 「Text」 「Sticker」 「Frame」 「Text Bubble」; no video, file, grid, shape or drawing. The Design draws no title, no ✕ and no NEW tag on Frame (PM: 「Add Layer」, ✕, Frame NEW), Q-23.
- R-088 [PM:add-layer-flow, flow-table, tbd; D1-42] [DS:1_add_img 54:520] Image opens the Collage photo picker (the Design draws it without the selection tray); the photo is added as a single-image frame (TBD-5 proposal, Q-6).
- R-089 [DS:2_add_text 54:1487; PM:add-layer-flow; D1-14, D1-42] Text opens the text editor: a bar with ✕, 「B」, 「I」, align left / centre / right and ✓ above a text field with a clear ⓧ and the keyboard (PM: Collage text input, 「Cancel」 / 「Done」).
- R-215 [DS:2_add_text 54:1487] Bold, italic and the three alignments apply to the text; the field's ⓧ clears it.
- R-216 [DS:2_add_text 54:1487, 5_Text_bubble 54:2359] A text or text bubble on the canvas shows a floating edit / duplicate / delete bar and a rotate handle when selected.
- R-090 [DS:3_Add_Sticker 54:1835; PM:add-layer-flow; D1-14, D1-42] Sticker opens the Edit Room Sticker panel (store button, category tabs such as 「Favorites」 「AI Sticker」 「Flower」 「Holiday」, a 「More」 tile, ✕ / ✓; the PM mock draws 「Search by keywords」).
- R-091 [PM:add-layer-flow, states-layers; D1-42, F2] Frame opens the new Frame panel with square thumbnails; tapping one adds that frame. (The Design's 4_frame board draws texture tiles with NEW / crown and ✕ / ✓, Q-24.)
- R-092 [DS:5_Text_bubble 54:2359; PM:add-layer-flow; D1-14, D1-42] Text Bubble opens the Edit Room Text Bubble panel (「∅」 none first, bubble styles, ✕ / ✓).
- R-093 [PM:add-layer-flow; D1-42] After finishing, the Canvas shows the new element.
- R-094 [PM:states-layers; D2-07, D3-02, F17] Frame panel thumbnails carry CMS NEW / PRO tags; a PRO frame is usable, IAP at export.

## Layers
- R-095 [PM:states-layers; D1-31] [DS:Layers 73:2199] 「Layers」 opens a list (as SCRL), each layer's thumbnail on a transparency grid, ⋯ at the left and ≡ at the right, with a collapse ⌄ and ✕ / ✓.
- R-096 [PM:states-layers; D1-31, D1-32] [DS:73:2199] ⋯ opens 「Delete」 / 「Duplicate」 / 「Lock」 with icons; a locked layer shows 「Unlock」.
- R-097 [PM:states-layers; D1-31, D1-33, D1-34] The menu actions act on that element; Lock gives the locked behaviour on the canvas.
- R-098 [PM:states-layers, tbd; D1-31] Right-side ≡ (TBD-3 proposal: hold-drag to reorder layers, Q-4).

## Ratio
- R-099 [DS:Ratio 74:2830; PM:states-ratio; D2-02, F12, D1-37] The Ratio bar offers 「Custom」 「Original」 「Square」 「2:3」 「3:2」 「3:4」 … (the bar scrolls past the screen edge; the Design writes 「Squre」, Q-30), each with its crop-style icon, and ✕ / ✓. PM: 1:1 / 4:5 / 5:4 / 3:4 / 4:3 / 9:16 / 16:9 (Q-25).
- R-100 [PM:states-ratio, flow-table; D1-36] The canvas default short side is 1080 px; a ratio change only changes the long side.
- R-101 [PM:states-ratio; F12] On a ratio change elements stay put; the canvas grows downward / shrinks upward.
- R-102 [PM:states-ratio; D1-06] No AI Expand promotion.

## Pages
- R-103 [PM:states-pages; D1-38] [DS:page 74:3076] Pages previews the joined pages as one strip, with only a thin line between pages.
- R-104 [PM:states-pages; D1-41] [DS:74:3076] Pages opens on the page the user was on; small text above the − | + stepper shows the selected page (「Page 5 / 5」; denominator TBD-8, Q-9).
- R-105 [PM:states-pages; D1-26, D1-30] Tapping a thumbnail selects the page; elements cannot be edited here.
- R-106 [PM:states-pages; D1-25, F13] [DS:74:3076, Light mode · Canvas icon buttons 130:3237] Holding a page's move button (Design ↔ 「btn_page_move」; PM ≡) drags the page: thumbnail enlarged and translucent, others make room, release reorders (「Hold ≡ & drag to reorder」).
- R-107 [PM:states-pages; D1-25] Tapping the move button without holding does nothing.
- R-108 [PM:states-pages; D1-27] ••• under a page opens 「Duplicate page」 (inserted after the page) / 「Delete page」 (no confirmation).
- R-109 [PM:states-pages; D1-39] Deleting a page deletes everything on it.
- R-110 [PM:states-pages; D1-28, D1-29] [DS:74:3076] The 「+」 at the end of the strip and the stepper 「+」 add a page at the end and scroll there; the stepper 「−」 removes the last page.
- R-111 [PM:states-pages, cms; D1-12] A canvas has 1 to 10 pages.
- R-112 [PM:states-pages; D1-12, D1-27] [DS:130:3237] At 10 pages the strip 「+」, the stepper 「+」 and 「Duplicate page」 are unavailable (the Design draws their disabled, greyed states).
- R-113 [PM:states-pages; D1-12, D1-29] [DS:130:3237] At 1 page 「Delete page」 and the stepper 「−」 are unavailable (greyed).
- R-114 [PM:states-pages; D1-40] Pages has no undo / redo.
- R-115 [PM:states-pages, flow-table; D1-24, D1-26] ✓ applies and returns to the Canvas on the selected page.
- R-116 [PM:states-pages; D1-24] ✕ drops this visit's page changes and returns to the Canvas; with changes, 「Discard changes?」 (Discard / Keep, as Edit Room) comes first.
- R-117 [PM:tbd] Deleting a page with a cross-page element: TBD-6 proposal deletes the whole element (Q-7).

## Export
- R-119 [PM:states-save-page; D2-01] Export (the Canvas ✓ in the Design, Q-29) cuts each page into one image.
- R-120 [DS:Save 45:723; PM:states-save-page, entry-banner; D2-05] Export opens 「Save & Share」 (「‹」): 「5 images in this set」, 「Swipe to view」, the images as a swipeable preview with a 「1/5」 counter and page dots, 「Save」, 「Save this image only」 and 「Share to」. 「Save」 saves all N images together to the 「PhotoDirector」 album (PM: all N images saved at once; the page shows 「N images」).
- R-208 [DS:Save 45:723] Swiping the preview moves image by image; the counter and dots follow.
- R-207 [DS:Save 45:723] 「Save this image only」 saves only the image being shown.
- R-209 [DS:Save: Only 1 img 103:5778] A one-page canvas opens 「Save & Share」 with its single image, 「Save」, 「Share to」 and 「You might also like」 (other features), without the set line, counter or 「Save this image only」.
- R-212 [KB: KP-030] Each saved image matches the page as shown in the Save & Share preview and on the Canvas.
- R-121 [PM:states-save-page; D2-04] Resolution follows the Image Quality setting, applied to each image's long side (TBD-7 conflicts, Q-8).
- R-122 [DS:Save 45:723, Save: Only 1 img 103:5778; PM:states-save-page, flow-table; D2-05] 「Share to」 offers 「Instagram」 「Facebook」 「Twitter」 「Line」 「Tiktok」 (the row scrolls; PM: Instagram / Facebook / More, and D5-01 says no TikTok share on Day 1, Q-26); a target gets all N images when the app takes several, otherwise only opens.
- R-123 [PM:states-save-page, monetization-notes; D3-03] No watermark.
- R-124 [PM:states-save-page; D0-06] The images are not saved to My AI Artwork.
- R-125 [PM:entry-banner (red back arrow)] [DS:45:723] 「Save & Share」 「‹」 returns to the Canvas with the edits kept.

## Monetization
- R-126 [PM:states-save-page, monetization-notes; D3-03, D3-05] A Free user gets the IAP page every 3 saves; exports are counted, not images.
- R-127 [PM:states-save-page; D3-05] No rating dialog (removed from September on both platforms).
- R-128 [PM:states-save-page, states-template-preview; D3-04, D3-02] A Free user who used PRO content (template, frame or texture) gets the IAP page (「Paid style applied」) on Export.
- R-129 [PM:states-save-page; D3-01] Removal / Enhance are gated when applied in their rooms, not at export.
- R-130 [PM:overview, monetization-notes; D4-01] Non-generative: no credits charged, no new SKU.
- R-131 [PM:states-save-page; D3-04, D3-05; KB: KP-012] A paying (Premium, the one Android paid mode) user gets neither the every-3 IAP nor the PRO-content IAP at export.
- R-132 [PM:event-notes; D0-05, D1-15] Events ScrollableCollage_Canvas_Appear (from, template_guid) and ScrollableCollage_Export_Done (template_guid, page_count, photo_count, ratio); names provisional — NOT TESTABLE: analytics events, no event viewer on the phone.
- R-133 [PM:overview; D0-01, D0-02, D0-03] Audience, success metric (Export_Done ÷ Canvas_Appear) and release (26 11E, with Year End Recap) — NOT TESTABLE: product goals.
- R-135 [PM:scrl-compare, cms; D5-01, D2-07] SCRL differences (no template link, TikTok share, video export, projects, similar templates, favourites) and the CMS handoff blocker (「CMS Sheet Link (click me)」 carries no link in the PDF; MOCK_CMS_TYPE) — NOT TESTABLE: scope notes, nothing in the app to observe beyond R-087 / R-122.

## Appearance
- R-210 [DS:every board, drawn in light and dark; Dark mode · Canvas icon buttons 116:3010, Light mode · Canvas icon buttons 130:3237] Every Swipe Collage screen is drawn in a light and a dark version: the app shows the light one in light mode and the dark one in dark mode (which setting drives it is not stated, Q-31).

## Android
- R-134 [Rule: Android system Back (analysis pass 8, REQ-051 of the skill)] On Android, system Back on every screen and sheet does what its own 「‹」 / ✕ / Cancel does; on the Canvas it asks 「Discard changes?」 as ✕ does. The spec draws no Android Back (Q-14).

## Open questions
- Q-2 TBD-1 frame Opacity / Shadow: proposed the Collage room sliders, pending PM. Assumption: the Collage room's sliders. (R-047; TC-055)
- Q-3 TBD-2 entry of the frame-style switch: proposed a first 「Frame」 button on the frame toolbar, but neither the PM toolbar mock nor the Design's frame toolbar (「Opacity」 first) has one. Assumption: a toolbar button opens the Frame panel. (R-066; TC-073)
- Q-4 TBD-3 Layers ≡: proposed hold-drag to reorder layers. Assumption: as proposed. (R-098; TC-112)
- Q-5 TBD-4 bottom-sheet ✕: the PM proposed that ✕ closes and keeps the applied changes, but the Design now draws ✓ beside ✕ on every sheet (Background, Layers, Ratio, Sticker, Frame, Text Bubble), which usually means ✕ discards. Which is it? Assumption: ✓ keeps and closes; ✕ follows the TBD-4 proposal (keeps), and a ✕ that undoes the change is recorded, not failed. (R-086, R-206, R-134; TC-098, TC-107, TC-113, TC-117, TC-162)
- Q-6 TBD-5 Add Layer › Image adds a single-image frame or a free layer? proposed a frame. Assumption: a frame. (R-088; TC-100)
- Q-7 TBD-6 deleting a page with a cross-page element: proposed delete it whole. Assumption: as proposed. (R-117; TC-135)
- Q-8 TBD-7 export size: D2-04 says Image Quality per long side, TBD-7 proposes canvas size with a 1200 px short side, D1-36 says the canvas short side is 1080 px. Assumption: Image Quality. (R-100, R-121; TC-116, TC-139)
- Q-9 TBD-8 「Page n / ?」 denominator: proposed total pages; the Design draws 「Page 5 / 5」. Assumption: total pages. (R-104; TC-118)
- Q-10 Deeplink URLs (`scrollable_collage`, `category_guid`, `template_guid`) are not given; RD to supply test links. Where does ‹ go after a deeplink entry? Assumption: rows wait for the links. (R-007 – R-009; TC-005 – TC-008)
- Q-12 Which East / West thumbnail set does a user see (region, language)? Assumption: app language (REQ-004). (R-018; TC-018)
- Q-13 Does Canvas ↶ undo a page change applied in Pages (✓)? Assumption: recorded, not judged. (R-030, R-114; TC-134)
- Q-14 Android system Back is not drawn: rows assume it equals ‹ / ✕ / Cancel; the Add Layer card has no ✕ of its own. Assumption: Back closes what is open. (R-134; TC-156 – TC-169, TC-184, TC-185)
- Q-15 「每 save 3 次跳 IAP」: on the 3rd save or after it, before or after saving, is the count kept across sessions, and does 「Save this image only」 count as a save? Assumption: the 3rd export shows it; Save this image only recorded. (R-126, R-207; TC-145, TC-146)
- Q-16 Where does 「Continue editing?」 appear after a kill: at app launch or on entering Swipe Collage? Assumption: recorded. (R-034; TC-036)
- Q-17 Does leaving the Canvas (✕) ask 「Discard changes?」 even with no edits? Assumption: it asks. (R-033; TC-035)
- Q-18 Banner 「NEW」 tag: the PM entry flow draws 「NEW ›」, the Design banner only 「›」. Assumption: Design (no tag); a tag in the app is recorded. (R-003; TC-001)
- Q-19 The Design's frame toolbar ends with an item labelled 「Removal」 where the PM lists 「Delete」 (frames have no Removal). Assumption: Delete. (R-043; TC-048)
- Q-20 Removal / Enhance premium tag: the PM puts a PRO tag on both toolbar items, the Design draws none. Assumption: PM (tag shown); its absence is recorded, check on device. (R-054; TC-056)
- Q-21 IAP page: the PM says the existing page, unchanged (「Continue」); the Design draws 「B (mimic VVG / Beauty plus)」 with 「Start 7-Day Free Trial」 and prices. Which page ships? Assumption: rows check only 「PhotoDirector Premium」 and ✕ and record the layout. (R-061; TC-061 – TC-063, TC-149 – TC-152, TC-168)
- Q-22 Solid swatches: the PM says 32 in an 8 × 4 grid; the Design draws rows of 7 with the colour wheel first. Assumption: 32 swatches, layout as drawn. (R-080; TC-090)
- Q-23 How is the Add Layer card closed? The Design draws no ✕ or title (the PM draws 「Add Layer」 and ✕). Assumption: tapping the round 「+」 again or outside the card closes it. (R-087; TC-099, TC-107, TC-184)
- Q-24 The Design's Frame panel board (4_frame) draws texture tiles, not frame thumbnails with photo counts. Assumption: PM (square frame thumbnails with 「1 photo」 / 「3 photos」). (R-091; TC-104, TC-105)
- Q-25 Ratio list: the PM opens 1:1 / 4:5 / 5:4 / 3:4 / 4:3 / 9:16 / 16:9; the Design draws 「Custom」 「Original」 「Square」 「2:3」 「3:2」 「3:4」 and more past the edge. What are the final ratios, and what do Custom and Original do? Assumption: the Design's list; every ratio the bar offers is tapped and recorded against both lists. (R-099; TC-114, TC-115, TC-116)
- Q-26 Share targets: the PM keeps Instagram / Facebook / More and rules out TikTok sharing on Day 1 (D5-01); the Design draws Instagram / Facebook / Twitter / Line / Tiktok. Assumption: the Design's targets. (R-122; TC-141 – TC-143, TC-181 – TC-183)
- Q-27 AI Enhance from Swipe Collage: the Design draws the credit button and 「Enhance」 at 5 credits; D4-01 says the feature charges no credits. Is Enhance charged in Swipe Collage? Assumption: the existing Enhance room's price applies; the charge is recorded. (R-130, R-211; TC-155, TC-172)
- Q-28 Design vs PM dates: the Design page is 「20261029_Swipe Collage」, the PM PDF was exported on 10/30 with text unchanged since 10/29. Which is newer where they differ (title 「Swipe Collage」 vs 「Scrollable Collage」, the Canvas bar, picker, Ratio, Save & Share)? Assumption: the Design; each such row says 「check on device」. (R-004, R-010, R-031, R-037, R-099, R-120, R-122)
- Q-29 The Design's Canvas has no 「Export」; is its ✓ the export (Save & Share)? Assumption: yes. (R-031, R-119; TC-136, TC-145 – TC-154)
- Q-30 Design typos: 「Fliter」, 「Squre」, 「9 photos · 5pages」, 「Recieve 30 credits」, 「Maximize detaill」. Assumption: the app spells them correctly; a typo in the app is a text finding. (R-022, R-049, R-099, R-211)
- Q-31 Light / dark: does the app follow the phone's dark theme or an app setting? Assumption: the phone's dark theme. (R-210; TC-186, TC-187)

### Answered by this spec set
- Q-1 Banner copy and feature name: answered by the Design, which outranks the PM for UI copy: banner 「Try Swipe Collage!」 / 「Create the perfect year-end recap post.」, Template Page 「Swipe Collage」 (R-003, R-004, R-010). The PM's 「Scrollable Collage」 and TBD-9 「Carousel Collage」 are recorded in Notes; dates in Q-28.
- Q-11 Figma link: the Design Figma file came with spec set 2026-11-05 and was read whole (frames, controls; it draws no arrows). The PDF links no PM or MX Figma file.

## Added 2026-10-29 — coverage passes and standing inputs (updated 2026-11-12)

### Job states
| Job | Start / loading | Success | Failure | Retry | Leave and return | Longest wait | Done notice |
|---|---|---|---|---|---|---|---|
| Template list (CMS) | n/a (spec silent) | TC-009, TC-013 | n/a (spec silent: no offline / empty state drawn) | n/a (spec silent) | TC-023 | n/a (spec silent) | n/a (no notice) |
| Photo import | n/a (spec silent) | TC-043, TC-044 | n/a (spec silent) | n/a (spec silent) | TC-047 | n/a (spec silent) | n/a (no notice) |
| Removal apply | n/a (existing room) | TC-064 | n/a (existing room, spec silent) | n/a (existing room) | TC-068 | n/a (existing room) | n/a (no notice) |
| Enhance apply | n/a (existing room) | TC-065, TC-172 | n/a (existing room, spec silent) | n/a (existing room) | TC-068 | n/a (existing room) | n/a (no notice) |
| Export (save N images) | n/a (spec silent) | TC-136, TC-137, TC-178 | n/a (spec silent) | n/a (spec silent) | TC-144 | n/a (spec silent) | TC-137 |

### Error classes
| Job | Error classes |
|---|---|
| All jobs | n/a (the spec names no error classes or failure copy) |

### Exit × stage
| Stage | ✕ / ‹ / Cancel | System Back | App killed |
|---|---|---|---|
| Canvas, no edit | TC-035 | n/a (same dialog as ✕; TC-158 checks Back on an edited canvas) | n/a (nothing to restore; spec silent) |
| Canvas, edited | TC-032 – TC-034 | TC-158, TC-159 | TC-036 – TC-038 |
| Canvas, element in focus | n/a (no ✕ of its own) | TC-160 | n/a (spec silent) |
| Bottom sheet open | TC-098, TC-113, TC-117 | TC-162 | n/a (spec silent) |
| Add Layer card open | TC-107 | TC-184 | n/a (spec silent) |
| Text editor open | TC-102 | TC-164 | n/a (spec silent) |
| Pages, with changes | TC-131 – TC-133 | TC-165 | n/a (spec silent) |
| Pages, no change | TC-130 | TC-166 | n/a (spec silent) |
| Photo picker | TC-047 | TC-161 | n/a (spec silent) |
| Removal / Enhance room | TC-068 | TC-167, TC-185 | n/a (existing room) |
| Save & Share | TC-144 | TC-169 | n/a (already saved) |

### System back
- Template Page → Collage room: TC-156
- Template Preview → Template Page: TC-157
- Canvas (edited) → 「Discard changes?」: TC-158; the dialog itself: TC-159; element in focus: TC-160
- Photo picker → Canvas: TC-161
- Background / Layers / Ratio / Frame / Sticker / Text Bubble sheets → close as ✕: TC-162
- Add Layer card → closes (no ✕ drawn, Q-23): TC-184
- Custom color picker → as Cancel: TC-163
- Text editor with keyboard → keyboard first, then as ✕: TC-164
- Pages → as ✕: TC-165, TC-166
- Object Removal room → as ✕: TC-167; AI Enhance room → as ✕: TC-185
- IAP page → as ✕: TC-168
- Save & Share → Canvas: TC-169

### Hidden clauses
| Requirement | Hidden clause | Observed through | Rows |
|---|---|---|---|
| R-035 | only the latest record is restored | which project 「Continue editing?」 brings back after two edits | TC-039 |
| R-059 | Removal / Enhance result not saved to the album | Gallery 「PhotoDirector」 album before and after | TC-067 |
| R-100 | canvas short side 1080 px, only the long side changes | exported image width × height | TC-115, TC-116 |
| R-121 | resolution per long side by Image Quality | exported image pixel size per setting | TC-139 |
| R-124 | not saved to My AI Artwork | My AI Artwork list after export | TC-140 |
| R-126 | counted per export, not per image | IAP timing with 10-page and 1-page exports | TC-146 |
| R-130 | no credits, no new SKU | credit balance and IAP plan list | TC-155 |
| R-207 | only the shown image is saved | Gallery 「PhotoDirector」 album count and content after the tap | TC-178 |
| R-212 | saved files match the preview | each saved image opened beside its Save & Share preview page | TC-137 |
| R-211 | Enhance charged 5 credits | credit balance before and after an Advanced Enhance | TC-172 |

### Variants
| Requirement | Variant | Rows |
|---|---|---|
| R-055 | Free (IAP at apply) | TC-061 |
| R-055 | Premium (applies) | TC-064 |
| R-056 | Free (IAP at apply) | TC-062 |
| R-056 | Premium (applies) | TC-065 |
| R-126 | Free | TC-145, TC-146 |
| R-126 | Premium (no IAP, R-131) | TC-147 |
| R-061 | Free (IAP page at Removal / Enhance apply) | TC-061, TC-062, TC-063 |
| R-061 | Free (IAP page at export with PRO content) | TC-149, TC-152 |
| R-061 | Premium (no IAP page) | TC-064, TC-065 |
| R-128 | PRO template | TC-149 |
| R-128 | PRO frame | TC-150 |
| R-128 | PRO texture | TC-151 |
| R-128 | Premium (no IAP, R-131) | TC-153 |
| R-099 | every ratio the bar offers (Custom, Original, Square, 2:3, 3:2, 3:4 …), each tapped | TC-114, TC-115 |
| R-087 | Image | TC-100 |
| R-087 | Text | TC-101 |
| R-087 | Sticker | TC-103 |
| R-087 | Frame | TC-104 |
| R-087 | Text Bubble | TC-106 |
| R-122 | Instagram | TC-141 |
| R-122 | Facebook | TC-142 |
| R-122 | More (PM; if the row offers it) | TC-143 |
| R-122 | Twitter | TC-181 |
| R-122 | Line | TC-182 |
| R-122 | Tiktok | TC-183 |
| R-120 | Save (all images) | TC-137 |
| R-207 | Save this image only | TC-178 |
| R-120 | multi-page set | TC-136 |
| R-209 | one page | TC-179 |
| R-210 | Light mode | TC-187 |
| R-210 | Dark mode | TC-186 |
| R-018 | East / West thumbnails | TC-018 |
| R-121 | lowest / highest Image Quality | TC-139 |

### Flow arrows walked by existing rows
The Design page draws no arrows, so arrows are the PM spec's Screen × Button → Next table (`ft-…`) and the red back
arrows of the drawn flows (`dr-…`); where the Design moved a control (Canvas ‹ → ✕, Export → ✓, Done → ✓), the row
presses the Design's control.
- R-140 [PM:flow-table flow arrow ft-01 (D1-07)] Collage Room banner → Template Page. Walked by: TC-003.
- R-141 [PM:flow-table flow arrow ft-02 (D1-07)] Template Page ‹ → Collage Room. Walked by: TC-019.
- R-142 [PM:flow-table flow arrow ft-03 (D2-07)] Category tab → category switched. Walked by: TC-013.
- R-143 [PM:flow-table flow arrow ft-04 (D1-02)] Template thumbnail → Template Preview. Walked by: TC-020.
- R-144 [PM:flow-table flow arrow ft-05 (D2-08)] Thumbnail swipe right → next page of that template. Walked by: TC-016.
- R-145 [PM:flow-table flow arrow ft-06 (D1-02)] Template Preview ‹ → Template Page. Walked by: TC-023.
- R-146 [PM:flow-table flow arrow ft-07 (D2-09)] Template Preview swipe → page by page. Walked by: TC-022.
- R-147 [PM:flow-table flow arrow ft-08 (D1-02)] Use Template → Canvas. Walked by: TC-024.
- R-148 [PM:flow-table flow arrow ft-09 (D1-10)] Canvas ‹ (Design ✕) → Discard dialog → Template Preview. Walked by: TC-032, TC-034.
- R-149 [PM:flow-table flow arrow ft-10 (D1-13)] ↶ / ↷ → undo / redo. Walked by: TC-031.
- R-150 [PM:flow-table flow arrow ft-11 (D2-05)] Export (Design ✓) → Save & Share. Walked by: TC-136.
- R-151 [PM:flow-table flow arrow ft-12 (D3-04)] Export with PRO content, Free user → IAP page. Walked by: TC-149.
- R-152 [PM:flow-table flow arrow ft-13 (F4)] Frame + → Photo picker. Walked by: TC-040.
- R-153 [PM:flow-table flow arrow ft-14 (F6)] Tap frame → frame focus. Walked by: TC-048.
- R-154 [PM:flow-table flow arrow ft-15 (F6)] Tap image → image focus. Walked by: TC-049.
- R-155 [PM:flow-table flow arrow ft-16 (F5, D1-20)] Long-press image → drag swap between / inside frames. Walked by: TC-069, TC-070.
- R-156 [PM:flow-table flow arrow ft-17 (F10)] Background → Background sheet. Walked by: TC-090.
- R-157 [PM:flow-table flow arrow ft-18 (D1-31)] Layers → Layers list. Walked by: TC-108.
- R-158 [PM:flow-table flow arrow ft-19 (F11)] + → Add Layer. Walked by: TC-099.
- R-159 [PM:flow-table flow arrow ft-20 (D2-02)] Ratio → Ratio sheet. Walked by: TC-114.
- R-160 [PM:flow-table flow arrow ft-21 (F13)] Pages → Pages. Walked by: TC-118.
- R-161 [PM:flow-table flow arrow ft-22 (F9)] Frame focus floating Delete → frame removed. Walked by: TC-051.
- R-162 [PM:flow-table flow arrow ft-23 (F9)] Floating Duplicate → frame copied. Walked by: TC-053.
- R-163 [PM:flow-table flow arrow ft-24 (D1-33)] Floating Lock → frame locked. Walked by: TC-079.
- R-164 [PM:flow-table flow arrow ft-25 (F9)] Opacity / Shadow → controls (TBD-1). Walked by: TC-055.
- R-165 [PM:flow-table flow arrow ft-26 (F9)] Frame Flip H / Flip V → flipped. Walked by: TC-054.
- R-166 [PM:flow-table flow arrow ft-27 (D1-21)] Frame style switch → Frame panel (TBD-2). Walked by: TC-073.
- R-167 [PM:flow-table flow arrow ft-28 (F8)] Image Replace → Photo picker. Walked by: TC-057.
- R-168 [PM:flow-table flow arrow ft-29 (F8)] Image Flip H / Flip V → flipped. Walked by: TC-058.
- R-169 [PM:flow-table flow arrow ft-30 (F8)] Adjust / Filter → Collage panels. Walked by: TC-059.
- R-170 [PM:flow-table flow arrow ft-31 (D3-01)] Removal → Object Removal room, IAP at apply. Walked by: TC-061, TC-064.
- R-171 [PM:flow-table flow arrow ft-32 (D3-01)] Enhance → AI Enhance room, IAP at apply. Walked by: TC-062, TC-065.
- R-172 [PM:flow-table flow arrow ft-33 (D1-34)] Image Lock → image locked. Walked by: TC-085.
- R-173 [PM:flow-table flow arrow ft-34 (F8)] Image Delete → empty frame. Walked by: TC-060.
- R-174 [PM:flow-table flow arrow ft-35 (D1-32)] Locked Unlock → normal focus. Walked by: TC-089.
- R-175 [PM:flow-table flow arrow ft-36 (D1-33, D1-34)] Locked Duplicate / Delete → as unlocked. Walked by: TC-082, TC-088.
- R-176 [PM:flow-table flow arrow ft-37 (F10)] Background Solid / Texture → tab switched. Walked by: TC-092.
- R-177 [PM:flow-table flow arrow ft-38 (D1-23, D1-17)] Swatch / texture → background applied. Walked by: TC-091, TC-092.
- R-178 [PM:flow-table flow arrow ft-39 (D1-23)] Custom color → picker. Walked by: TC-094.
- R-179 [PM:flow-table flow arrow ft-40 (D1-23)] Eyedropper → colour from canvas. Walked by: TC-095.
- R-180 [PM:flow-table flow arrow ft-41 (D1-23)] Picker Cancel / Done → not applied / applied. Walked by: TC-096, TC-097.
- R-181 [PM:flow-table flow arrow ft-42 (F10)] Background ✕ → closed (TBD-4). Walked by: TC-098.
- R-182 [PM:flow-table flow arrow ft-43 (D1-31)] Layers ⋯ → Delete / Duplicate / Lock menu. Walked by: TC-109.
- R-183 [PM:flow-table flow arrow ft-44 (D1-31)] Layers ≡ → TBD-3. Walked by: TC-112.
- R-184 [PM:flow-table flow arrow ft-45 (D1-31)] Layers ✕ → closed (TBD-4). Walked by: TC-113.
- R-185 [PM:flow-table flow arrow ft-46 (D1-42)] Add Layer Image → Photo picker. Walked by: TC-100.
- R-186 [PM:flow-table flow arrow ft-47 (D1-42)] Add Layer Text / Sticker / Frame / Text Bubble → their panels. Walked by: TC-101, TC-103, TC-104, TC-106.
- R-187 [PM:flow-table flow arrow ft-48 (D1-42)] Add Layer ✕ → closed (TBD-4; the Design draws no ✕, Q-23). Walked by: TC-107.
- R-188 [PM:flow-table flow arrow ft-49 (D1-42)] Frame panel thumbnail → frame added. Walked by: TC-104.
- R-189 [PM:flow-table flow arrow ft-50 (D1-36)] Ratio item → applied, long side only. Walked by: TC-115.
- R-190 [PM:flow-table flow arrow ft-51 (D1-37)] Ratio ✕ → closed (TBD-4). Walked by: TC-117.
- R-191 [PM:flow-table flow arrow ft-52 (D1-24)] Pages ✕ → discard, Discard dialog when changed. Walked by: TC-130, TC-131, TC-133.
- R-192 [PM:flow-table flow arrow ft-53 (D1-24, D1-26)] Pages ✓ → Canvas on the selected page. Walked by: TC-129.
- R-193 [PM:flow-table flow arrow ft-54 (D1-26)] Pages thumbnail → page selected. Walked by: TC-119.
- R-194 [PM:flow-table flow arrow ft-55 (D1-25)] Hold ≡ (Design ↔) → drag to reorder. Walked by: TC-121.
- R-195 [PM:flow-table flow arrow ft-56 (D1-27)] ••• → Duplicate / Delete page. Walked by: TC-122, TC-123.
- R-196 [PM:flow-table flow arrow ft-57 (D1-28, D1-29)] Row + / bottom − + → pages added / removed at the end. Walked by: TC-124, TC-125.
- R-197 [PM:flow-table flow arrow ft-58 (F4)] Photo picker Done (Design ✓) → frames filled, Canvas. Walked by: TC-043.
- R-198 [PM:flow-table flow arrow ft-59 (D2-05)] Save page Instagram / Facebook / More → share. Walked by: TC-141, TC-142, TC-143.
- R-199 [PM:flow-table flow arrow ft-60 (D3-03)] IAP page ✕ / Continue → as existing (Continue starts a purchase and is not tapped). Walked by: TC-063, TC-152.
- R-200 [PM:entry-banner flow arrow dr-01 (red back arrow)] Photo picker ‹ → Canvas. Walked by: TC-047.
- R-201 [PM:entry-banner flow arrow dr-02 (red back arrow)] Save & Share ‹ → Canvas. Walked by: TC-144.
- R-202 [PM:removal-flow flow arrow dr-03 (D1-11)] Removal / Enhance room ✕ → Canvas, not applied. Walked by: TC-068.
- R-203 [PM:removal-flow flow arrow dr-04 (D3-01)] IAP page ✕ → back. Walked by: TC-063.
- R-204 [PM:add-layer-flow flow arrow dr-05 (D1-42)] Add Layer panel finished → Canvas with the new element. Walked by: TC-101.

### Domain rules
| Entry | Requirements |
|---|---|
| KP-012 Android has one paid mode | R-131 |
| KP-014 AI Exposure is paid-only | n/a (no AI Exposure in this feature) |
| KP-015 Mine refreshes entitlement after buying Premium | n/a (no purchase is completed in this table) |
| KP-016 A one-time free trial is consumed at once | n/a (no one-time free use in this feature) |
| KP-017 Credit Detail lists every AI use | n/a (the feature charges no credits, D4-01; the Enhance price is Q-27) |
| KP-018 Credit Auto Pass keeps its own name | n/a (no Credit Auto Pass) |
| KP-019 A burst of Generate taps charges once | n/a (no Generate) |
| KP-020 Blue credit button opens Buy Credit | R-211 |
| KP-021 Premium chat quota | n/a (no chat) |
| KP-024 Finished AI images save to their feature tab | n/a (non-generative; D0-06 keeps the output out of My AI Artwork, R-124) |
| KP-025 AI Exposure results | n/a (no AI Exposure) |
| KP-026 History button opens the Artwork tab | n/a (the spec draws no History button; the Enhance room's is the existing room's) |
| KP-027 New features' works reach Recent | n/a (D0-06: not in My AI Artwork) |
| KP-028 Empty Artwork filter | n/a (no Artwork tab) |
| KP-029 Long-task tiles and notifications | n/a (no long task) |
| KP-030 Saved output matches the last preview | R-212 |
| KP-032 Features opened from Edit Room get the edited image | n/a (not opened from Edit Room) |
| KP-033 Banners and deep links preselect the linked style | R-008 |
| KP-034 Discover tip bubble lifecycle | n/a (no Discover bubble) |
| KP-035 AI Replace reference / prompt | n/a (no AI Replace) |
| KP-036 A custom prompt reaches the generator | n/a (no prompt) |
| KP-037 AI Try-On face check | n/a (no Try-On) |
| KP-038 AI Group Shot photo picking | n/a (Group Shot only) |
| KP-039 Agent job in background | n/a (no Agent) |
| KP-040 Crop tabs keep one state | n/a (no Crop / AI Expand tabs; Ratio is the feature's own sheet) |
| KP-041 Undo, Redo and Reset | R-217 |
| KP-042 Restored state restores highlight and transform | n/a (no restored transform state in the spec) |
| KP-043 Video Editing template titles | n/a (video only) |
| KP-044 Video Editing panels: X discards, V commits | n/a (video panels; the bottom-sheet ✕ is Q-5) |
| KP-045 Audio Range Select | n/a (no audio) |
| KP-046 Try-On / Hairstyle Back | n/a (other features) |
| KP-047 Masks survive returning | n/a (no mask) |
| KP-048 Arabic digits | n/a (Arabic not in scope) |
| KP-049 Localised strings keep placeholders | n/a (the spec gives English strings only; TC-018 changes language for thumbnails, not copy) |
| KP-050 RTL mirrors layout | n/a (no RTL language in scope) |

### Request ledger coverage
| Ledger entry | Requirements |
|---|---|
| REQ-001 | R-001 – R-217 (the whole table) |
| REQ-004 | R-018 (TC-018: East in Traditional Chinese and Japanese, West in English and German) |
| REQ-008 | R-003, R-004, R-010, R-016, R-022, R-029 – R-031, R-033, R-036, R-037, R-039, R-042, R-043, R-049, R-054 – R-056, R-061, R-079 – R-099, R-103 – R-122, R-205 – R-217 (spec set 2026-11-05 and the Design Figma) |
