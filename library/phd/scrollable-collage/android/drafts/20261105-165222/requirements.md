# Scrollable Collage — requirements (android)
Spec: Scrollable Collage - PM and Design Figma.md (Figma-only spec set 2026-11-05: PM page 2171:2 「26 11E Scrollable Collage (year end)」, Design page 0:1 「20261029_Swipe Collage」)

Source order: Design (2026-10-29) over PM, except the PM 「Save page」 11/3 update, which is newer (analysis.md pass 7). Decision ids in brackets in the PM ([D1-07], [F4]) are the PM's own. Feature name: the Design and the app say 「Swipe Collage」 (Q-1).

## Entry
- R-001 [PM:pm-header D0-03, D0-04; PM:pm-ui-1 D0-04, D1-16] Swipe Collage is a separate new room (not a new category inside Collage), entered from a banner at the top of the Collage room; the rest of the Collage room is unchanged
- R-002 [DS:design-light-entry 「Collage Room · banner (NEW)」 1:238; PM:pm-ui-1 D1-07] Entering the Collage room shows the banner 「Try Swipe Collage!」 with the line 「Create the perfect year-end recap post.」 at the top (PM mockup: 「Try Scrollable Collage!」 / 「Swipe-able multi-page collage」, Q-1)
- R-003 [PM:pm-ui-1 D1-07] The banner is shown every time the Collage room is entered; it is not removed after it was tapped
- R-004 [PM:pm-flow D1-09; PM:pm-ui-1 D1-09] Deeplink scrollable_collage opens the Template Page
- R-005 [PM:pm-flow D1-09; PM:pm-ui-1 D2-07] Deeplink scrollable_collage with category_guid opens the Template Page on that category
- R-006 [PM:pm-flow D1-09; PM:pm-ui-1 D1-09] Deeplink scrollable_collage with template_guid opens that template's Template Preview directly
- R-007 [PM:pm-header D0-04, D0-06, D1-08] This build has no Launcher shortcut for Swipe Collage (the shortcut is decided later)
- R-008 [PM:pm-header D0-04; PM:pm-ui-4 D0-06] Swipe Collage projects and exports never appear in My AI Artwork
- R-009 [PM:pm-header D4-01; PM:pm-save-iap D4-01] Swipe Collage is not generative: it charges no credits and opens no new purchase item (SKU)

## Template Page
- R-011 [DS:design-light-entry 「Template Page · default (NEW)」 3:336] The Template Page has the title 「Swipe Collage」, a ‹ back button and category tabs (Design: 「Year End」, 「Category1」, 「Category2」)
- R-012 [PM:pm-ui-1 D2-03, D2-07] There are 3–4 categories in the order the CMS sets, 「Year End」 first
- R-013 [PM:pm-button-next-step D2-07] Tapping a category tab switches the list to that category's templates
- R-014 [PM:pm-ui-1 D1-01] Templates are shown as a waterfall (masonry) list
- R-015 [PM:pm-ui-1 D1-01; DS 3:336] Each card shows only the default photo count and page count, 「N photos · M pages」 (e.g. 「9 photos · 5 pages」), and no portrait / landscape label
- R-016 [PM:pm-ui-1 D2-08] Each card's thumbnail shows the template's first page
- R-017 [PM:pm-ui-1 D2-08; PM:pm-button-next-step D2-08] Swiping a card to the right shows that template's next pages, as in SCRL (the list does not move)
- R-018 [PM:pm-ui-1 F16; PM:pm-scrl] Templates have Eastern and Western thumbnails, one image per page, and every page is shown in the UI (which set a user sees: Q-3)
- R-019 [PM:pm-ui-1 D2-03, D2-07] A template the CMS tags NEW shows a 「NEW」 tag
- R-020 [PM:pm-ui-1 D3-02] A template the CMS sets to PRO (usageType purchase) shows a PRO icon at the top right of its card
- R-021 [PM:pm-ui-1 F16; PM:pm-scrl] Day 1 has 20 templates in total across the categories

## Template Preview
- R-025 [DS:design-light-entry 「entry_launcher2」 18:386; PM:pm-ui-1 D1-02] Template Preview has the title 「Template」, the category name, the template's 「N photos · M pages」 and the button 「Use Template」
- R-026 [PM:pm-ui-1 D2-09; PM:pm-button-next-step D2-09] Swiping left / right on the preview moves page by page through the template
- R-027 [PM:pm-ui-1 D3-02] A PRO template shows the PRO icon on its Template Preview
- R-028 [PM:pm-ui-1 D3-04; PM:pm-save-iap D3-04] A Free user can open a PRO template with 「Use Template」 and edit it; the IAP page comes only at Export
- R-029 [PM:pm-ui-1 F1; PM:pm-scrl] The thumbnail and preview show the template's default layout, and 「Use Template」 opens the canvas in that same layout (background, frames, texts, photo slots)

## Canvas
- R-033 [PM:pm-ui-2 D1-03; PM:pm-header D0-03] The canvas is one multi-page canvas: the view can be zoomed freely (pinch) and scrolled left / right across the pages
- R-034 [DS 「canvas_default」 69:6711; PM:pm-ui-2 D1-04, D1-13] The canvas has 「Background」, 「Layers」, +, 「Ratio」 and 「Pages」 at the bottom and under them ✕, ↶ undo, ↷ redo and ✓; there is no top bar (the PM mockups put ‹ and 「Export」 at the top: Q-20)
- R-035 [PM:pm-ui-2 F2; PM:pm-scrl] Every empty-looking slot is an add-image frame showing +
- R-036 [PM:pm-ui-2 D1-13; PM:pm-button-next-step D1-13] Undo / redo cover every operation on the canvas (import, move, resize, swap, delete, duplicate, lock, frame style, background, ratio, Pages changes once applied, Removal / Enhance results)
- R-037 [PM:pm-ui-2 D1-04] Every element can be adjusted: a text's colour, content and font, and an image's position
- R-038 [PM:pm-ui-2 F3; PM:pm-scrl] A frame can be resized on the canvas
- R-039 [PM:pm-ui-2 F13; PM:pm-scrl] An element belongs to the page that holds its centre and moves with that page when pages are reordered; an element that spans two pages still spans pages after the move

## Photo import
- R-040 [PM:pm-flow F4; PM:pm-button-next-step F4] Tapping a frame's + opens the photo picker (the Collage photo picker)
- R-041 [DS 「photo_picker」 23:531] The photo picker shows 「Please select 3 photos to continue.」 and a counter 「(3/3)」 for a template with 3 empty frames, with the tabs 「Photo」 and 「Stock」 and the albums (PM mockup: 「Select up to 3 photos」, 「Done (2)」; Q-4)
- R-042 [PM:pm-ui-4 D2-06; PM:pm-scrl] One import takes at most as many photos as there are empty frames on the canvas right now, and never more than 20 on both platforms (Android is not held to its default 6)
- R-043 [PM:pm-ui-2 F4; PM:pm-scrl] One photo or several can be imported in one go (fewer than the empty frames is allowed; Q-4)
- R-044 [PM:pm-ui-4 F4; PM:pm-button-next-step F4] Confirming the picker (Design: the orange ✓ beside the counter; PM: 「Done」) fills the empty frames in order (left → right, top → bottom, page by page) and returns to the canvas; the picked photos show in a tray at the bottom

## Frame focus
- R-048 [PM:pm-ui-2 F6; PM:pm-scrl; DS note on 「canvas_img_focus」] Tapping a frame selects the frame (frame focus); tapping it again selects its image (image focus); tapping in image focus goes back to frame focus
- R-049 [DS 「canvas_frame_focus」 33:2230; PM:pm-ui-2 F9] Frame focus shows the frame tools 「Opacity」, 「Shadow」, 「Flip H」, 「Flip V」, 「Duplicate」, 「Lock」 and Delete (the whole frame)
- R-050 [PM:pm-ui-2 F7, D1-32; PM:pm-scrl] Frame focus shows floating buttons Delete, Duplicate and Lock (icons) at the frame
- R-051 [PM:pm-button-next-step F9; PM:pm-ui-2 F9] Delete in frame focus removes the whole frame with its photo
- R-052 [PM:pm-button-next-step F9] Duplicate in frame focus adds a copy of the frame (with its photo)
- R-053 [PM:pm-button-next-step F9] Flip H / Flip V in frame focus flip the frame at once
- R-054 [PM:pm-draft-tbd TBD-1; PM:pm-button-next-step F9] Opacity and Shadow open the Collage room's Opacity / Shadow sliders and change the frame (PM proposal, TBD-1: Q-6)
- R-055 [PM:pm-ui-2 D1-05] A selected element can be deleted, duplicated or locked

## Image focus and tools
- R-056 [DS 「canvas_img_focus」 28:1621; PM:pm-ui-2 F8, D1-35] Image focus shows one horizontally scrolling feature bar: 「Replace」, 「Flip H」, 「Flip V」, 「Adjust」, 「Filter」, 「Removal」, 「Enhance」 (the Design spells 「Fliter」: Q-7), with 「Image selected」
- R-057 [PM:pm-button-next-step F8] 「Replace」 opens the photo picker and the chosen photo replaces the frame's photo
- R-058 [PM:pm-button-next-step F8] 「Flip H」 / 「Flip V」 in image focus flip the image inside its frame at once
- R-059 [PM:pm-button-next-step F8; PM:pm-ui-2 F8, D1-35] 「Adjust」 and 「Filter」 work as in the Collage room and change only the focused image
- R-060 [PM:pm-ui-2 F8; PM:pm-scrl] Delete in image focus removes the photo: the frame becomes empty and shows the + add-image icon again
- R-061 [PM:pm-ui-2 D3-01; PM:pm-save-iap D3-01; PM:pm-flow D3-01] 「Removal」 and 「Enhance」 carry a premium (PRO) tag in the feature bar
- R-062 [PM:pm-flow D1-11; PM:pm-ui-2 D1-11] A Pro user who applies (✓) Removal or Enhance gets the result in place of the frame's photo, back on the canvas in image focus; it can be undone and is not saved to the photo album
- R-063 [PM:pm-flow D1-11] ✕ in Removal / Enhance applies nothing and returns to the canvas
- R-064 [PM:pm-flow D3-01, D1-43; PM:pm-ui-2 D3-01] A Free user who applies (✓) Removal or Enhance gets the existing IAP page (「PhotoDirector Premium」); nothing is applied
- R-065 [PM:pm-ui-4 D3-01; PM:pm-save-iap D3-01] Removal / Enhance are gated when applied in their room, never again at Export

## Swap and frame styles
- R-076 [PM:pm-ui-2 F5; PM:pm-scrl; PM:pm-button-next-step F5] Long-pressing an image and dropping it on another frame swaps the two photos (PM mockup hint 「Long press & drag to swap」)
- R-077 [PM:pm-ui-2 D1-20] Inside a multi-photo frame, long-pressing an image and dropping it on another cell of the same frame swaps the two
- R-078 [PM:pm-ui-2 D1-19; PM:pm-ui-3 D1-19] Frames are single-photo (e.g. polaroid) or multi-photo (e.g. film strip)
- R-079 [PM:pm-ui-2 D1-21; PM:pm-draft-tbd TBD-2] The frame style is switched from the frame toolbar (a 「Frame」 tool, TBD-2: Q-8), not by dragging
- R-080 [PM:pm-ui-2 D1-21] Switching a single-photo frame to a multi-photo one puts the photo in the first cell (left → right, top → bottom); the other cells show + add image
- R-081 [PM:pm-ui-2 D1-22] Switching a multi-photo frame to a single-photo one keeps the first photo and deletes the rest
- R-082 [PM:pm-ui-2 D1-22] Switching a multi-photo frame to one with fewer cells (N) keeps the first N photos in left → right, top → bottom order and deletes the rest
- R-083 [PM:pm-ui-2 D1-22] Photos deleted by a frame switch do not come back when switching back to a multi-photo frame; only undo / redo bring them back

## Lock
- R-084 [PM:pm-ui-4 D1-33; PM:pm-scrl] A locked frame cannot be dragged, resized or rotated on the canvas; focus shows 「Frame locked」
- R-085 [PM:pm-ui-4 D1-33; PM:pm-button-next-step D1-33] A locked frame in focus still shows its feature bar, with every tool disabled except 「Duplicate」, 「Unlock」 and 「Delete」
- R-086 [PM:pm-ui-4 D1-33, D1-32] A locked frame shows the floating buttons Delete, Duplicate and Unlock
- R-087 [PM:pm-ui-4 D1-34; PM:pm-scrl] A locked image cannot be dragged or zoomed inside its frame; focus shows 「Image locked」
- R-088 [PM:pm-ui-4 D1-34, D1-35; PM:pm-button-next-step D1-34] A locked image in focus still shows the one feature bar, with every tool disabled except 「Unlock」 and 「Delete」; its floating buttons are Delete, Duplicate and Unlock
- R-089 [PM:pm-ui-4 D1-32; PM:pm-button-next-step D1-32] Unlock (floating or toolbar) makes the frame / image editable again and returns to normal focus
- R-090 [PM:pm-ui-4 D1-33; PM:pm-ui-3 D1-39, D1-33] Deleting a page or reducing pages in Pages deletes the locked frames on it too

## Add Layer
- R-091 [DS 「Add Layer」 frame 49:1511; PM:pm-ui-3 F11] + opens 「Add Layer」 with five functions 「Image」, 「Text」, 「Sticker」, 「Frame」, 「Text Bubble」, and nothing for video, files, grids, shapes or drawing
- R-092 [PM:pm-button-next-step D1-42; PM:pm-draft-tbd TBD-5] 「Image」 opens the photo picker; the chosen photo is added to the canvas as a new single-photo frame holding it (TBD-5: Q-9)
- R-093 [PM:pm-flow D1-14, D1-42; DS 「2_add_text」 54:1487] 「Text」 opens the Collage text input with the keyboard; finishing adds the text to the canvas
- R-094 [PM:pm-flow D1-14, D1-42; DS 「3_Add_Sticker」 54:1835] 「Sticker」 opens the Edit Room sticker panel; tapping a sticker adds it to the canvas
- R-095 [PM:pm-ui-3 D1-14, D1-42, D1-19, F2; DS 「4_frame」 54:2110] 「Frame」 opens the new Frame panel: square thumbnails, each labelled with how many photos it holds (「1 photo」, 「3 photos」); tapping one adds that frame to the canvas
- R-096 [PM:pm-ui-3 D2-07, D3-02, F17] Frames are new CMS content (single- or multi-photo masks); NEW frames show a 「NEW」 tag and PRO frames a PRO icon
- R-097 [PM:pm-flow D1-14, D1-42; DS 「5_Text_bubble」 54:2359] 「Text Bubble」 opens the Edit Room Text Bubble panel; tapping a bubble adds it to the canvas
- R-098 [PM:pm-ui-1 D1-14; PM:pm-ui-3 D1-14] Text, fonts, text styles, text bubbles and stickers are the existing Edit Room panels and CMS content; frames and background textures are the only new content

## Background
- R-109 [DS 「background_panel_solid」 69:6938, 「background_panel_texture」 72:1505; PM:pm-ui-2 F10] 「Background」 opens a panel with the tabs 「Solid」 and 「Texture」; Solid offers plain colours only, no gradients
- R-110 [PM:pm-ui-2 D1-23] Solid shows 32 colour swatches (8 × 4, defined by the content team); tapping one sets the canvas background colour
- R-111 [PM:pm-ui-2 D1-23] Custom color opens a colour picker like the Text color picker: a saturation / brightness square, a hue bar and an eyedropper
- R-112 [PM:pm-ui-2 D1-23; PM:pm-button-next-step D1-23] The eyedropper picks a colour from the canvas
- R-113 [DS 「background_panel_solid」 72:1786; PM:pm-ui-2 D1-23] In the colour picker 「Cancel」 applies nothing and 「Done」 sets the picked colour as the background
- R-114 [PM:pm-ui-2 D1-17; PM:pm-ui-1 D1-17; PM:pm-scrl] Texture tab: tapping a texture sets it as the background; textures tile seamlessly (loop) over the whole canvas and every page
- R-115 [PM:pm-ui-2 D3-02; PM:pm-save-iap D3-02] Some textures are PRO (set in the CMS) and show a PRO icon; new ones show 「NEW」
- R-116 [PM:pm-draft-tbd TBD-4; PM:pm-button-next-step F10, D1-31, D1-37, D1-42] The Background, Layers and Ratio sheets end with ✕ and ✓ (Design): ✓ keeps the changes made in the sheet and ✕ drops them (TBD-4 proposes that ✕ keeps them: Q-10)

## Layers
- R-117 [DS 「Layers」 73:2199; PM:pm-ui-3 D1-31] 「Layers」 opens the layer list (as SCRL): each layer's thumbnail sits on a transparency checkerboard, with ⋯ on the left and ≡ on the right
- R-118 [PM:pm-ui-3 D1-31, D1-32; DS 73:2199] ⋯ on a layer opens 「Delete」, 「Duplicate」 and 「Lock」, each with an icon; a locked layer shows 「Unlock」 instead of 「Lock」
- R-119 [PM:pm-ui-3 D1-31; PM:pm-draft-tbd TBD-3] Holding ≡ and dragging a layer changes its front / back order on the canvas (TBD-3: Q-11)

## Ratio
- R-120 [PM:pm-ui-3 D2-02, F12; PM:pm-scrl; PM:pm-competitor F12; DS 「Ratio」 74:2830] 「Ratio」 offers the canvas page ratios 1:1, 4:5, 5:4, 3:4, 4:3, 9:16 and 16:9 (the Design frame shows 「Custom」, 「Original」, 「Squre」, 「2:3」, 「3:2」, 「3:4」: Q-2)
- R-121 [PM:pm-ui-3 D1-37] The ratio choices use the PhD Crop / AI Expand icons with the numbers
- R-122 [PM:pm-ui-3 D1-36] The canvas defaults to a 1080 px short side; a ratio change changes only the long side
- R-123 [PM:pm-ui-3 F12; PM:pm-scrl] On a ratio change the elements do not move: the canvas grows downward or shrinks upward
- R-124 [PM:pm-ui-3 D1-06] The Ratio panel shows no AI Expand promotion

## Pages
- R-125 [PM:pm-ui-3 D1-38; DS 「page」 74:3076] 「Pages」 opens a view that previews the pages joined together, with only a thin line between pages
- R-126 [PM:pm-ui-3 D1-41; PM:pm-draft-tbd TBD-8; DS 74:3076] Pages opens on the page the canvas showed before; a small text shows the selected page as 「Page n / total」 (e.g. 「Page 5 / 5」)
- R-127 [PM:pm-ui-3 D1-12; PM:pm-ui-1 D1-12] A canvas has at least 1 and at most 10 pages
- R-128 [PM:pm-ui-3 D1-28, D1-29] The + in the thumbnail row and the bottom − / + add or remove a page at the end; after adding, the view scrolls to the last page
- R-129 [PM:pm-ui-3 D1-12, D1-27; DS 「icons」 btn_add_page / page_stepper plus_disable] At 10 pages the thumbnail-row +, the bottom + and 「Duplicate page」 are unavailable (drawn disabled)
- R-130 [PM:pm-ui-3 D1-12, D1-29; DS page_stepper minus_disable] At 1 page 「Delete page」 and the bottom − are unavailable (drawn disabled)
- R-131 [PM:pm-ui-3 D1-27] ••• on a page opens 「Duplicate page」 (the copy goes right after the original) and 「Delete page」 (deletes with no confirmation)
- R-132 [PM:pm-ui-3 D1-25, F13] Holding ≡ and dragging a page enlarges its thumbnail half-transparent, the other pages make room, and releasing reorders; the hint reads 「Hold ≡ & drag to reorder」; a plain tap on ≡ does nothing
- R-133 [PM:pm-ui-3 D1-26, D1-30] Tapping a page thumbnail selects that page; elements cannot be edited in Pages
- R-134 [PM:pm-ui-3 D1-39, D1-33; PM:pm-draft-tbd TBD-6] Deleting a page deletes everything on it, locked elements included (an element crossing into the page: Q-12)
- R-135 [PM:pm-ui-3 D1-40, D1-24, D1-26] Pages has no undo / redo; ✓ applies the page changes and returns to the canvas on the selected page
- R-136 [PM:pm-ui-3 D1-24] ✕ discards every page change of this visit and returns to the canvas; when something changed it first asks 「Discard changes?」 with 「Discard」 and 「Keep」
- R-137 [DS 「Dark mode · Canvas icon buttons」 116:3010, 「Light mode · Canvas icon buttons」 130:3237] The page move (≡), page more (•••), add page and page stepper buttons are drawn in normal, pressed, selected and disabled states; the empty photo slot is the import (+) slot

## Leave and resume
- R-138 [PM:pm-leave-resume D1-10; PM:pm-flow D1-10] ✕ at the bottom left of the canvas (PM: ‹) asks 「Discard changes?」 with 「Discard」 and 「Keep」 (as Edit Room); 「Discard」 returns to Template Preview (Q-20)
- R-139 [PM:pm-leave-resume D1-10] 「Keep」 closes the dialog and stays on the canvas with every edit
- R-140 [PM:pm-leave-resume D1-10] When the app is killed while editing, the next launch asks 「Continue editing?」 (copy and buttons as Edit Room); continuing reopens the canvas with the edits
- R-141 [PM:pm-leave-resume D1-18] Only the latest editing session can be restored

## Export and Save & Share
- R-144 [PM:pm-flow D1-04, D2-05; PM:pm-button-next-step D2-05] ✓ at the bottom right of the canvas (PM: 「Export」) opens the 「Save & Share」 page (Q-20)
- R-145 [PM:pm-ui-4 D2-01; PM:pm-header D0-03] Export cuts the canvas into one image per page
- R-146 [PM:pm-save-page 11/3; DS 「Save」 45:723] For more than one page, 「Save & Share」 shows 「N images in this set」, 「Swipe to view」, a 「1/N」 counter and a swipeable preview, with no thumbnail strip
- R-147 [PM:pm-save-page 11/3] For more than one page the orange button reads 「Save all N images」 and saves every image; below it an outline button 「Save this image」 saves only the image shown in the preview (Design 10/29 「Save this image only」: the PM 11/3 update is newer)
- R-148 [PM:pm-save-page 11/3; DS 「Save: Only 1 img」 103:5778] For a single page there is one orange button 「Save」
- R-149 [PM:pm-ui-4 D2-05; PM:pm-flow D2-05] Saving all writes the N images at once to the 「PhotoDirector」 album
- R-150 [PM:pm-save-page 11/3; DS 103:5778; PM:pm-ui-4 D2-05] 「Share to」 lists Instagram, Facebook, Twitter, Line and Tiktok; a share carries all N images when the app accepts several, else only opens the app
- R-151 [PM:pm-ui-4 D2-04; PM:pm-draft-tbd TBD-7] The exported resolution follows the Image Quality setting, applied to each image's long side (TBD-7 proposes a fixed 1200 px short side: Q-13)
- R-152 [PM:pm-ui-4 D3-03; PM:pm-save-iap D3-03] Exported images carry no watermark
- R-153 [PM:pm-ui-4 D3-05; PM:pm-save-iap D3-05] No rating dialog appears after saving
- R-154 [DS 「Save: Only 1 img」 103:5778; PM:pm-competitor D5-01] The single-page Save & Share page shows 「You might also like」 as the Design draws (PM says similar templates are not Day-1: Q-14)

## PRO content and IAP
- R-157 [PM:pm-ui-4 D3-04; PM:pm-save-iap D3-04; PM:pm-ui-1 D3-04] A Free user who used PRO content (template, frame or texture) gets the IAP page on 「Export」, with 「Paid style applied」; a Pro user exports with no IAP page
- R-158 [PM:pm-ui-4 D3-03, D3-05; PM:pm-save-iap D3-05] A Free user gets the IAP page on every 3rd save; saves are counted per export, not per image
- R-159 [PM:pm-save-iap D3-02] Templates, frames and textures can be PRO only through the CMS; everything else is free
- R-160 [PM:pm-ui-4; PM:pm-button-next-step D3-03; DS 「B (mimic VVG/ Beauty plus)」 103:6032] The IAP page is the existing 「PhotoDirector Premium」 page, unchanged; its ✕ closes it (what Export does after a closed IAP page: Q-15)

## Light and dark mode
- R-162 [DS: page 「20261029_Swipe Collage」 light set (x < 8000) and dark set (x ≥ 8396)] Every Swipe Collage screen has a light and a dark design; the app shows the version of the current appearance (Q-16)

## Tracking
- R-163 [PM:pm-tracking D1-15, D0-05] Opening the canvas sends the analytics event ScrollableCollage_Canvas_Appear with from (Collage_Banner / Deeplink) and template_guid (names tentative)
- R-164 [PM:pm-tracking D1-15] Finishing an export sends the analytics event ScrollableCollage_Export_Done with template_guid, page_count, photo_count and ratio (names tentative)
- R-165 [PM:pm-tracking D0-02; PM:pm-header D0-02] Success metric: export completion = Export_Done users ÷ Canvas_Appear users — NOT TESTABLE: a product metric
- R-166 [PM:pm-ui-1 D2-07; PM:pm-scrl] The CMS type string, contentVer and CMS sheet are not decided (MOCK_CMS_TYPE, MOCK_CMS_SHEET) — NOT TESTABLE: handoff blocker for RD (Q-17)

## Android system Back
- R-167 [Rule: analysis.md pass 8 (REQ-051)] System Back on every Swipe Collage page, sheet, dialog and picker does what its own ‹ / ✕ / Cancel does (the canvas and Pages ask 「Discard changes?」 first; an open keyboard closes first)

## Open questions
- Q-1 Feature name and banner copy. The Design (10/29) says 「Swipe Collage」, 「Try Swipe Collage!」 and 「Create the perfect year-end recap post.」; the PM mockups say 「Scrollable Collage」, 「Try Scrollable Collage!」 and 「Swipe-able multi-page collage」; TBD-9 proposes 「Carousel Collage」. Assumption: the Design copy (R-002, R-011; TC-001, TC-010).
- Q-2 Ratio list. The PM lists seven page ratios 1:1, 4:5, 5:4, 3:4, 4:3, 9:16, 16:9 (D2-02, F12); the Design 「Ratio」 frame shows the Crop tool's list 「Custom」, 「Original」, 「Squre」, 「2:3」, 「3:2」, 「3:4」 (no source photo for 「Original」 on a canvas, and 「Squre」 is misspelt). Assumption: the PM list, checked on the device (R-120; TC-102, TC-104).
- Q-3 Eastern / Western thumbnails (F16): which set does a user see, by region, language or something else? Assumption: by the phone's locale (R-018; TC-016).
- Q-20 Canvas exits. The Design (10/29) has no top bar on the canvas: its bottom row is ✕, ↶, ↷, ✓; the PM mockups and the button table have ‹ at the top left and 「Export」 at the top right (D1-10, D1-04). Assumption: ✕ is the PM's ‹ (asks 「Discard changes?」) and ✓ is the PM's 「Export」 (opens Save & Share) (R-034, R-138, R-144; TC-025, TC-123, TC-129).
- Q-4 Photo picker. The Design shows 「Please select 3 photos to continue.」 and 「(3/3)」, which reads as "exactly 3"; the PM says one or several photos up to the number of empty frames (F4, D2-06) and its mockup shows 「Select up to 3 photos」 / 「Done (2)」. Assumption: fewer than the empty-frame count is allowed, with the Design copy (R-041, R-043; TC-032, TC-034).
- Q-5 Template Preview count copy: the Design writes 「9 photos · 5pages」 (no space) on Template Preview and 「9 photos · 5 pages」 elsewhere. Assumption: 「5 pages」 everywhere (R-025; TC-019).
- Q-6 TBD-1 (PM, open): what Opacity / Shadow open. Proposal: the Collage room's existing sliders. Assumption: the proposal (R-054; TC-045).
- Q-7 The Design labels the image tool 「Fliter」 (canvas_img_focus and the Removal / Enhance frames); the PM says Filter. Assumption: 「Filter」 is right and 「Fliter」 a Design typo (R-056; TC-047).
- Q-8 TBD-2 (PM, open): where the frame style switch is. Proposal: a first tool 「Frame」 on the frame toolbar; the Design's frame toolbar does not draw it. Assumption: a 「Frame」 tool on the frame toolbar (R-079; TC-065).
- Q-9 TBD-5 (PM, open): does Add Layer › Image add a single-photo frame or a free image layer? Proposal: a single-photo frame with the photo. Assumption: the proposal (R-092; TC-079).
- Q-10 TBD-4 (PM, open): does a sheet's ✕ (Background, Layers, Frame, Ratio) keep the changes already applied? Proposal: yes, as Edit Room panels. The Design (10/29) draws ✕ and ✓ on every sheet, which reads as ✓ = keep and ✕ = drop. Assumption: the Design (R-116; TC-094, TC-095, TC-100, TC-101, TC-105, TC-106).
- Q-11 TBD-3 (PM, open): what Layers' ≡ does. Proposal: hold and drag to change the front / back order. Assumption: the proposal (R-119; TC-099).
- Q-12 TBD-6 (PM, open): when a page is deleted, is an element that crosses into it deleted (touching) or kept by its centre? Proposal: deleted when it touches the page. Assumption: the proposal (R-134; TC-113).
- Q-13 Export size. D2-04 says the Image Quality setting on each image's long side; D1-36 says a 1080 px short side; TBD-7 proposes a fixed 1200 px short side. Assumption: Image Quality on the long side (R-151, R-122; TC-135, TC-104).
- Q-14 「You might also like」: the Design's single-page Save & Share (Save: Only 1 img) shows it; the PM competitor notes say similar templates are not Day-1, and the multi-page frame does not show it. Assumption: shown on the single-page page as the Design draws, check on device (R-154; TC-133).
- Q-15 After the IAP page that Export opens is closed with ✕, where does the user land and is anything saved? The spec is silent. Assumption: back on the canvas with the edits, nothing saved (R-160; TC-145).
- Q-16 Light and dark: the Design draws every screen in both. Does the app follow the system appearance or its own setting? Assumption: the system appearance (R-162; TC-146, TC-147).
- Q-17 CMS handoff blocker: the CMS type string, contentVer and CMS sheet are still mock (MOCK_CMS_TYPE, MOCK_CMS_SHEET), and the deeplink format with category_guid / template_guid needs real guids from RD. Assumption: rows needing real guids wait for RD (R-166, R-005, R-006; TC-005, TC-006).
- Q-18 The PM mockups show the swap hint 「Long press & drag to swap」 and the labels 「Frame selected」 / 「Image selected」; the Design draws only 「Image selected」. Assumption: the hint and 「Frame selected」 are optional (not asserted) (R-076, R-048; TC-063, TC-039).
- Q-19 The Design's IAP frame (「B (mimic VVG/ Beauty plus)」: 「Start 7-Day Free Trial」, 「Auto-renewal for $29.99/year」) differs from the PM's 「Continue」 page, while the PM says the IAP page is the existing one, unchanged. Assumption: whatever the existing IAP page shows; its copy is not asserted (R-160; TC-145, TC-057).

## Added 2026-11-05 — coverage passes and standing inputs

### Job states

| Job | Start / loading | Success | Failure | Retry | Second failure | Partial | Stop | Leave and return | Longest wait | Done notice |
|---|---|---|---|---|---|---|---|---|---|---|
| Photo import (picker → frames) | n/a (no loading state drawn) | TC-035 | n/a (spec silent) | n/a (spec silent) | n/a (spec silent) | TC-034 | TC-038 | TC-127 | n/a (spec silent) | n/a (the photos appear in the frames) |
| Export and save (Save & Share) | n/a (spec silent) | TC-131 | n/a (spec silent) | n/a (spec silent) | n/a (spec silent) | TC-132 | n/a (nothing to stop) | TC-136 | n/a (spec silent) | n/a (spec silent: no toast drawn) |
| Removal apply (existing room) | n/a (as the existing Object Removal room) | TC-054 | n/a (as the existing room) | n/a (as the existing room) | n/a (as the existing room) | n/a (one photo) | TC-055 | n/a (spec silent) | n/a (as the existing room) | n/a (as the existing room) |
| Enhance apply (existing room) | n/a (as the existing AI Enhance room) | TC-059 | n/a (as the existing room) | n/a (as the existing room) | n/a (as the existing room) | n/a (one photo) | TC-060 | n/a (spec silent) | n/a (as the existing room) | n/a (as the existing room) |

### Error classes

| Job | Error classes |
|---|---|
| Photo import | n/a (spec names no error classes) |
| Export and save | n/a (spec names no error classes) |
| Removal / Enhance | n/a (existing rooms; spec names no error classes) |

### Exit × stage

| Stage | ‹ / ✕ | System Back | App killed |
|---|---|---|---|
| Canvas with edits | TC-123, TC-124, TC-125 | TC-152 | TC-127 |
| Canvas, image focus | TC-126 | TC-152 | n/a (same as the canvas) |
| Pages with changes | TC-118, TC-119, TC-120 | TC-159 | n/a (spec silent) |
| Pages with no change | TC-121 | n/a (same as ✕ with no change) | n/a (spec silent) |
| Save & Share | TC-136 | TC-163 | n/a (spec silent) |
| Photo picker | TC-038 | TC-154 | n/a (spec silent) |

### Hidden clauses

| Requirement | Hidden clause | Observed through | Rows |
|---|---|---|---|
| R-163 | the analytics event and its parameters are sent | the app's analytics event log (log pull or RD event viewer); parked until available | TC-148 |
| R-164 | the analytics event and its parameters are sent | the app's analytics event log; parked until available | TC-149 |
| R-062 | the result is not saved to the photo album | the Photos / Gallery app shows no new image after ✓ | TC-054, TC-059 |
| R-009 | no credit is charged | the credit balance before and after an export (Mine › My Credits) | TC-138 |
| R-122 | the canvas has a 1080 px short side | the pixel size of the saved image | TC-104, TC-135 |

### Variants

| Requirement | Variant | Rows |
|---|---|---|
| R-062 | tier=Pro | TC-054, TC-059 |
| R-064 | tier=Free | TC-056, TC-061 |
| R-064 | tier=Pro (applies, no IAP) | TC-054, TC-059 |
| R-157 | tier=Free | TC-139, TC-140, TC-141 |
| R-157 | tier=Pro | TC-142 |
| R-157 | content=template | TC-139 |
| R-157 | content=frame | TC-140 |
| R-157 | content=texture | TC-141 |
| R-158 | tier=Free | TC-143 |
| R-158 | tier=Pro | TC-144 |
| R-028 | tier=Free | TC-023 |
| R-028 | tier=Pro | TC-142 |
| R-160 | IAP from Removal | TC-057 |
| R-160 | IAP from Export | TC-145 |
| R-162 | appearance=Light | TC-146 |
| R-162 | appearance=Dark | TC-147 |
| R-147 | button=Save all N images | TC-131 |
| R-147 | button=Save this image | TC-132 |
| R-120 | ratio=each of the seven | TC-102, TC-104 |
| R-120 | ratio=9:16 and 1:1 (grow / shrink) | TC-103 |
| R-018 | thumbnails=Eastern | TC-016 |
| R-018 | thumbnails=Western | TC-016 |
| R-004 | deeplink=no parameter | TC-004 |
| R-005 | deeplink=category_guid | TC-005 |
| R-006 | deeplink=template_guid | TC-006 |
| R-163 | from=Collage_Banner | TC-148 |
| R-163 | from=Deeplink | TC-148 |
| R-042 | platform cap 20 | TC-036 |
| R-042 | Android not held to 6 | TC-037 |
| R-082 | multi → single | TC-067 |
| R-082 | multi → fewer cells | TC-068 |

### Flow arrows walked by existing rows
- R-010 [DS: flow arrow 2218:374 https://www.figma.com/design/zrl1BBEyqTvdLfjtaT8g6I/Collage?node-id=2218-374] Collage Room banner → Template Page: tapping the banner opens the Template Page. Walked by: TC-002.
- R-022 [DS: flow arrow 2218:398 https://www.figma.com/design/zrl1BBEyqTvdLfjtaT8g6I/Collage?node-id=2218-398] Template Page ‹ → Collage Room: ‹ on the Template Page returns to the Collage room. Walked by: TC-017.
- R-023 [DS: flow arrow 2218:378 https://www.figma.com/design/zrl1BBEyqTvdLfjtaT8g6I/Collage?node-id=2218-378] Template Page card → Template Preview: tapping a template card opens its Template Preview. Walked by: TC-018.
- R-024 [DS: flow arrow 2218:422 https://www.figma.com/design/zrl1BBEyqTvdLfjtaT8g6I/Collage?node-id=2218-422] Template Page (opened by deeplink) card → Template Preview: a card on the deeplinked Template Page opens its Template Preview the same way. Walked by: TC-008.
- R-030 [DS: flow arrow 2218:382 https://www.figma.com/design/zrl1BBEyqTvdLfjtaT8g6I/Collage?node-id=2218-382] Template Preview 「Use Template」 → Canvas · default: 「Use Template」 opens the canvas with the template. Walked by: TC-022.
- R-031 [DS: flow arrow 2218:402 https://www.figma.com/design/zrl1BBEyqTvdLfjtaT8g6I/Collage?node-id=2218-402] Template Preview ‹ → Template Page: ‹ returns to the Template Page. Walked by: TC-024.
- R-032 [DS: flow arrow 2218:426 https://www.figma.com/design/zrl1BBEyqTvdLfjtaT8g6I/Collage?node-id=2218-426] Template Preview (opened by deeplink) ‹ → Template Page: ‹ returns to the Template Page. Walked by: TC-007.
- R-045 [DS: flow arrow 2218:386 https://www.figma.com/design/zrl1BBEyqTvdLfjtaT8g6I/Collage?node-id=2218-386] Canvas frame + → Photo Picker: the frame's + opens the photo picker. Walked by: TC-032.
- R-046 [DS: flow arrow 2218:390 https://www.figma.com/design/zrl1BBEyqTvdLfjtaT8g6I/Collage?node-id=2218-390] Photo Picker Done → Canvas · image_focus: Done returns to the canvas with the photos placed. Walked by: TC-035.
- R-047 [DS: flow arrow 2218:410 https://www.figma.com/design/zrl1BBEyqTvdLfjtaT8g6I/Collage?node-id=2218-410] Photo Picker ‹ → Canvas · default: ‹ in the picker returns to the canvas with nothing imported. Walked by: TC-038.
- R-066 [DS: flow arrow 2315:505 https://www.figma.com/design/zrl1BBEyqTvdLfjtaT8g6I/Collage?node-id=2315-505] Canvas · image_focus 「Removal」 → Object Removal: 「Removal」 opens the Object Removal room with the focused photo. Walked by: TC-053.
- R-067 [DS: flow arrow 2315:509 https://www.figma.com/design/zrl1BBEyqTvdLfjtaT8g6I/Collage?node-id=2315-509] Object Removal ✓ (Free) → IAP page: a Free user's apply opens the IAP page. Walked by: TC-056.
- R-068 [DS: flow arrow 2315:513 https://www.figma.com/design/zrl1BBEyqTvdLfjtaT8g6I/Collage?node-id=2315-513] Object Removal ✓ (Pro) → Canvas · image_focus: the removal result replaces the photo on the canvas. Walked by: TC-054.
- R-069 [DS: flow arrow 2315:517 https://www.figma.com/design/zrl1BBEyqTvdLfjtaT8g6I/Collage?node-id=2315-517] Object Removal ✕ → Canvas · image_focus: nothing applied, back to the canvas. Walked by: TC-055.
- R-070 [DS: flow arrow 2315:521 https://www.figma.com/design/zrl1BBEyqTvdLfjtaT8g6I/Collage?node-id=2315-521] IAP page ✕ → Object Removal: closing the IAP page returns to the Object Removal room. Walked by: TC-057.
- R-071 [DS: flow arrow 2315:660 https://www.figma.com/design/zrl1BBEyqTvdLfjtaT8g6I/Collage?node-id=2315-660] Canvas · image_focus 「Enhance」 → AI Enhance: 「Enhance」 opens the AI Enhance room with the focused photo. Walked by: TC-058.
- R-072 [DS: flow arrow 2315:664 https://www.figma.com/design/zrl1BBEyqTvdLfjtaT8g6I/Collage?node-id=2315-664] AI Enhance ✓ (Free) → IAP page: a Free user's apply opens the IAP page. Walked by: TC-061.
- R-073 [DS: flow arrow 2315:668 https://www.figma.com/design/zrl1BBEyqTvdLfjtaT8g6I/Collage?node-id=2315-668] AI Enhance ✓ (Pro) → Canvas · image_focus: the enhanced photo replaces the photo on the canvas. Walked by: TC-059.
- R-074 [DS: flow arrow 2315:672 https://www.figma.com/design/zrl1BBEyqTvdLfjtaT8g6I/Collage?node-id=2315-672] AI Enhance ✕ → Canvas · image_focus: nothing applied, back to the canvas. Walked by: TC-060.
- R-075 [DS: flow arrow 2315:676 https://www.figma.com/design/zrl1BBEyqTvdLfjtaT8g6I/Collage?node-id=2315-676] IAP page ✕ → AI Enhance: closing the IAP page returns to the AI Enhance room. Walked by: TC-062.
- R-099 [DS: flow arrow 2315:303 https://www.figma.com/design/zrl1BBEyqTvdLfjtaT8g6I/Collage?node-id=2315-303] Add Layer 「Image」 → Photo Picker: opens the photo picker. Walked by: TC-079.
- R-100 [DS: flow arrow 2315:307 https://www.figma.com/design/zrl1BBEyqTvdLfjtaT8g6I/Collage?node-id=2315-307] Add Layer 「Text」 → Text input: opens the Collage text input. Walked by: TC-080.
- R-101 [DS: flow arrow 2315:311 https://www.figma.com/design/zrl1BBEyqTvdLfjtaT8g6I/Collage?node-id=2315-311] Add Layer 「Sticker」 → Sticker panel: opens the Edit Room sticker panel. Walked by: TC-081.
- R-102 [DS: flow arrow 2315:315 https://www.figma.com/design/zrl1BBEyqTvdLfjtaT8g6I/Collage?node-id=2315-315] Add Layer 「Frame」 → Frame Panel: opens the Frame panel. Walked by: TC-083.
- R-103 [DS: flow arrow 2315:319 https://www.figma.com/design/zrl1BBEyqTvdLfjtaT8g6I/Collage?node-id=2315-319] Add Layer 「Text Bubble」 → Text Bubble panel: opens the Edit Room Text Bubble panel. Walked by: TC-085.
- R-104 [DS: flow arrow 2315:323 https://www.figma.com/design/zrl1BBEyqTvdLfjtaT8g6I/Collage?node-id=2315-323] Photo Picker photo → Canvas · default: the picked photo appears on the canvas. Walked by: TC-079.
- R-105 [DS: flow arrow 2315:345 https://www.figma.com/design/zrl1BBEyqTvdLfjtaT8g6I/Collage?node-id=2315-345] Text input Done → Canvas · default: the new text appears on the canvas. Walked by: TC-080.
- R-106 [DS: flow arrow 2315:349 https://www.figma.com/design/zrl1BBEyqTvdLfjtaT8g6I/Collage?node-id=2315-349] Sticker panel item → Canvas · default: the sticker appears on the canvas. Walked by: TC-081.
- R-107 [DS: flow arrow 2315:353 https://www.figma.com/design/zrl1BBEyqTvdLfjtaT8g6I/Collage?node-id=2315-353] Frame panel item → Canvas · default: the frame appears on the canvas. Walked by: TC-083.
- R-108 [DS: flow arrow 2315:357 https://www.figma.com/design/zrl1BBEyqTvdLfjtaT8g6I/Collage?node-id=2315-357] Text Bubble panel item → Canvas · default: the text bubble appears on the canvas. Walked by: TC-085.
- R-142 [DS: flow arrow 2218:406 https://www.figma.com/design/zrl1BBEyqTvdLfjtaT8g6I/Collage?node-id=2218-406] Canvas ‹ → Template Preview (after Discard): after 「Discard」 the Template Preview of the same template shows. Walked by: TC-124.
- R-143 [DS: flow arrow 2218:414 https://www.figma.com/design/zrl1BBEyqTvdLfjtaT8g6I/Collage?node-id=2218-414] Canvas · image_focus ‹ → Template Preview (after Discard): ‹ in image focus asks the same dialog and Discard returns to Template Preview. Walked by: TC-126.
- R-155 [DS: flow arrow 2218:394 https://www.figma.com/design/zrl1BBEyqTvdLfjtaT8g6I/Collage?node-id=2218-394] Canvas 「Export」 → Save & Share: Export opens the Save & Share page. Walked by: TC-129.
- R-156 [DS: flow arrow 2218:418 https://www.figma.com/design/zrl1BBEyqTvdLfjtaT8g6I/Collage?node-id=2218-418] Save & Share ‹ → Canvas · image_focus: ‹ returns to the canvas with every edit kept. Walked by: TC-136.

### System back

| Screen | Rows |
|---|---|
| Swipe Collage Template Page | TC-150 |
| Template Preview | TC-151 |
| Canvas (with edits) | TC-152 |
| 「Discard changes?」 dialog | TC-153 |
| Photo picker | TC-154 |
| Add Layer | TC-155 |
| Text input with keyboard | TC-156 |
| Sticker / Text Bubble panels | TC-157 |
| Background, Layers, Ratio, Frame sheets | TC-157 |
| Custom colour picker | TC-158 |
| Pages | TC-159 |
| Pages ••• menu | TC-160 |
| Object Removal / AI Enhance | TC-161 |
| IAP page | TC-162 |
| Save & Share | TC-163 |
| Collage room | n/a (existing room, unchanged) |
| 「Continue editing?」 dialog | n/a (as Edit Room today) |

### Domain rules

| Entry | Requirements |
|---|---|
| KP-012 | R-062, R-157, R-158 (Pro = the Android paid mode) |
| KP-014 | n/a (AI Exposure only) |
| KP-015 | n/a (no purchase is made in this table) |
| KP-016 | n/a (no one-time free trial in this feature) |
| KP-017 | n/a (Swipe Collage charges no credits) |
| KP-018 | n/a (no Credit Auto Pass) |
| KP-019 | n/a (no Generate button) |
| KP-020 | n/a (no credit button in Swipe Collage) |
| KP-021 | n/a (no chat quota) |
| KP-024 | n/a (not an AI image feature; nothing goes to My AI Artwork) |
| KP-025 | n/a (AI Exposure only) |
| KP-026 | n/a (no History button) |
| KP-027 | R-008 (the spec keeps Swipe Collage out of My AI Artwork) |
| KP-028 | n/a (Artwork filters not touched) |
| KP-029 | n/a (no long task) |
| KP-030 | R-145, R-146 |
| KP-032 | n/a (not opened from Edit Room) |
| KP-033 | R-005, R-006 |
| KP-034 | n/a (no Discover tip) |
| KP-035 | n/a (AI Replace only) |
| KP-036 | n/a (no prompt) |
| KP-037 | n/a (AI Try-On only) |
| KP-038 | n/a (AI Group Shot only) |
| KP-039 | n/a (no agent job) |
| KP-040 | n/a (no Crop tabs) |
| KP-041 | R-036 |
| KP-042 | R-036, R-120 (an undone ratio change restores the canvas and the panel's highlight together) |
| KP-043 | n/a (video only) |
| KP-044 | n/a (video panels only; Swipe Collage sheets: Q-10) |
| KP-045 | n/a (audio only) |
| KP-046 | n/a (Try-On / Hairstyle only) |
| KP-047 | n/a (no masks) |
| KP-048 | n/a (the spec gives no Arabic strings) |
| KP-049 | R-015, R-147 (「N photos · M pages」, 「Save all N images」 carry numbers) |
| KP-050 | n/a (the spec gives no RTL layout; checked in a localisation pass) |

### Request ledger coverage

| Ledger entry | Requirements |
|---|---|
| REQ-001 | R-001, R-002 … every requirement (new feature from the PM and Design Figma) |
