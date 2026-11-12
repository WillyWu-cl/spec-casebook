# Swipe Collage — requirements (android)
Spec: Collage.pdf (PM / Design "Demo + Spec — Scrollable Collage (26 11E)", spec set 2026-10-29)

Source tags: `[PM:<board>; <spec ID>]`, board IDs from `specs/2026-10-29/extracted/boards.json`, spec IDs as the board
prints them (`D1-07`, `F4` …). The file is a single PM-owned Figma export that also carries the UI; there is no separate
Design file, so its mockups give the UI strings and its 【Requirement】 blocks the rules. Mockups are iPhone frames;
Android differences are stated where the spec names them (photo picker cap, D2-06) and in "System back".
Request ledger: REQ-001 (this table), REQ-004 (TC-018 languages).

## Entry
- R-001 [PM:states Collage Room · banner; D1-07, D1-16] On entering the Collage room a Swipe Collage banner is shown at the top of the room (Collage has no AI / Traditional categories).
- R-002 [PM:states Collage Room · banner; D1-07] The banner is shown every time Collage is entered; it is not removed by default (also after it was used).
- R-003 [PM:entry-banner, states Collage Room · banner; D1-07] The banner carries a 「NEW」 tag and 「›」; title / subtitle copy: see Q-1.
- R-004 [PM:flow-table, states Collage Room · banner; D1-07, D0-04] Tapping the banner opens the Template Page 「Scrollable Collage」, an independent new room, not a Collage category.
- R-005 [PM:overview; D0-04, D0-06, D1-08] No Launcher shortcut for the feature in this build (not in this spec; not built).
- R-006 [PM:overview; D0-04, D0-06] Swipe Collage output is not added to My AI Artwork. (Checked as R-124.) Walked by: TC-140.
- R-007 [PM:entry-deeplink, states Template Page; D1-09] Deeplink `scrollable_collage` lands on the Template Page (waterfall).
- R-008 [PM:entry-deeplink, cms; D1-09, D2-07] A deeplink with `category_guid` selects that category on the Template Page.
- R-009 [PM:entry-deeplink, cms; D1-09] A deeplink with `template_guid` opens that template's Template Preview directly.

## Template Page
- R-010 [PM:states Template Page · default; D1-01] The Template Page is titled 「Scrollable Collage」 with 「‹」 and lists templates as a waterfall.
- R-011 [PM:states Template Page · default; D1-01] Each card shows only the default photo count and page count (「6 photos · 3 pages」); no portrait / landscape label.
- R-012 [PM:states Template Page · default; D2-08, F16] A card thumbnail shows the template's first page.
- R-013 [PM:states Template Page · default, cms; D2-03, D2-07] 3–4 categories in CMS order with 「Year End」 first (selected on entry, as drawn).
- R-014 [PM:flow-table; D2-07] Tapping a category tab switches the list to that category.
- R-015 [PM:states Template Page · default, cms; D2-03, D2-07] NEW tags come from the CMS tag.
- R-016 [PM:states Template Page · default, cms; D3-02] A CMS-PRO template shows a 「PRO」 icon at the card's top right.
- R-017 [PM:states Template Page · thumb_swipe, flow-table; D2-08, F16] Swiping a card thumbnail right shows that template's next pages (as SCRL); every page is shown.
- R-018 [PM:states Template Page · thumb_swipe, cms, plan-notes; F16] Thumbnails come in East and West sets; every page of the set is shown in the UI. Which set a user sees is not stated (Q-12); per REQ-004, East is tested with the app in Traditional Chinese and Japanese, West in English and German.
- R-019 [PM:states Template Page · default, cms; F16] Day 1 has 20 templates.
- R-020 [PM:flow-table; D1-07] Template Page 「‹」 returns to the Collage room.
- R-021 [PM:flow-table; D1-02] Tapping a thumbnail opens the Template Preview.

## Template Preview
- R-022 [PM:states Template Preview · default; D1-02] The preview (title 「Template」) shows the photo / page count (「9 photos · 5 pages」), the category (「Year End」) and 「Use Template」.
- R-023 [PM:states Template Preview · default, flow-table; D2-09] Swiping left / right moves page by page (as SCRL).
- R-024 [PM:states Template Preview · default; F1] The preview shows the template's default layout.
- R-025 [PM:states Template Preview · default, flow-table; D1-02] 「Use Template」 opens the Canvas.
- R-026 [PM:states Template Preview · pro; D3-02, D3-04] A CMS-PRO template shows a 「PRO」 icon at the top right; a free user can use it, IAP comes only at export.
- R-027 [PM:flow-table; D1-02] Template Preview 「‹」 returns to the Template Page.

## Canvas
- R-028 [PM:states Canvas · default; D1-03] The canvas has several pages; the view zooms freely and scrolls left / right.
- R-029 [PM:states Canvas · default, pm-sketch; F2] Every hole is an add-image frame with 「+」.
- R-030 [PM:states Canvas · default, flow-table; D1-13] Top 「↶」 / 「↷」 undo / redo every canvas operation.
- R-031 [PM:states Canvas · default; D1-04] Bottom bar 「Background」 / 「Layers」 / 「+」 / 「Ratio」 / 「Pages」; top 「‹」, undo / redo, 「Export」.
- R-032 [PM:states Canvas · default; D1-04] Every element is adjustable: text colour, content and font; image position.
- R-033 [PM:leave-notes, entry-banner, flow-table; D1-10] Canvas 「‹」 shows 「Discard changes?」 with 「Discard」 / 「Keep」 (as Edit Room); Discard returns to the Template Preview, Keep stays with the edits.
- R-034 [PM:leave-notes; D1-10] When the app was killed during editing, a 「Continue editing?」 dialog (as Edit Room) appears next time; continuing restores the project.
- R-035 [PM:leave-notes; D1-18] Only the latest editing record is restored (one task at a time).

## Photos
- R-036 [PM:flow-table, entry-banner, states Photo Picker; F4, D2-06] Tapping a frame's 「+」 opens the photo picker, the same as the Collage picker; its 「‹」 returns to the Canvas.
- R-037 [PM:states Canvas · default, Photo Picker; F4, D2-06] One or several photos can be imported; the limit is the number of empty frames (「Select up to 3 photos」, 「Done (2)」).
- R-038 [PM:states Photo Picker; D2-06] The import limit is capped at 20 on both platforms; Android is not held to its default 6.
- R-039 [PM:states Photo Picker, flow-table; F4] 「Done」 fills the empty frames in order and returns to the Canvas.
- R-040 [PM:pm-sketch; F4] A single photo can be imported too.

## Frame focus
- R-041 [PM:states Canvas · frame_focus, pm-sketch; F6] Tapping a frame selects it (「Frame selected」); a tap in frame focus moves to image focus, a tap in image focus back to frame focus.
- R-042 [PM:states Canvas · frame_focus; F7, D1-32, D1-05] Frame focus shows floating Delete / Duplicate / Lock icons.
- R-043 [PM:states Canvas · frame_focus; F9] The frame toolbar holds 「Opacity」 「Shadow」 「Flip H」 「Flip V」 「Duplicate」 「Lock」 「Delete」.
- R-044 [PM:states Canvas · frame_focus, flow-table; F9] Delete (floating or toolbar) removes the whole frame.
- R-045 [PM:flow-table; F9, D1-05] Duplicate copies the frame.
- R-046 [PM:flow-table; F9] Flip H / Flip V flip the frame immediately.
- R-047 [PM:flow-table, tbd; F9] Opacity / Shadow open controls for the frame (TBD-1: the Collage room's sliders, Q-2).
- R-048 [PM:states Canvas · frame_focus, pm-sketch; F3] A frame can be scaled.

## Image focus
- R-049 [PM:states Canvas · image_focus; F8, D1-35] Image focus (「Image selected」) has one horizontally scrolling bar: 「Replace」 「Flip H」 「Flip V」 「Adjust」 「Filter」 「Removal」 「Enhance」 「Lock」 「Delete」.
- R-050 [PM:flow-table; F8] Replace opens the photo picker and replaces the photo.
- R-051 [PM:flow-table; F8] Flip H / Flip V flip the photo immediately.
- R-052 [PM:flow-table, states Canvas · image_focus; F8] Adjust / Filter work as in the Collage room.
- R-053 [PM:states Canvas · image_focus; F8] Delete empties the frame and its 「+」 add-image icon shows.
- R-054 [PM:states Canvas · image_focus, monetization-notes; D3-01] Removal and Enhance carry a premium (PRO) tag on the toolbar.
- R-055 [PM:removal-flow; D3-01, D1-43] Removal opens the Object Removal room; for a free user, applying shows the existing IAP page.
- R-056 [PM:enhance-flow; D3-01, D1-43] Enhance opens the AI Enhance room; for a free user, applying shows the existing IAP page.
- R-057 [PM:removal-flow, enhance-flow; D1-11] For a paying user, ✓ puts the result in place of that frame's photo and returns to the Canvas.
- R-058 [PM:states Canvas · image_focus; D1-11] The Removal / Enhance result can be undone on the Canvas.
- R-059 [PM:states Canvas · image_focus; D1-11] The Removal / Enhance result is not saved to the album separately.
- R-060 [PM:removal-flow; D1-11] ✕ in the room applies nothing and returns to the Canvas.
- R-061 [PM:removal-flow, enhance-flow, flow-table; D3-01, D3-03] The IAP page is the existing one, unchanged (「PhotoDirector Premium」, 「Continue」, ✕).

## Swap and drag
- R-062 [PM:states Canvas · photo_swap; F5] Long-press a photo and drop it on another frame: the two swap (「Long press & drag to swap」).
- R-063 [PM:states Canvas · photo_swap / swap_in_frame; D1-20] Inside a multi-image frame, long-press drag to another cell swaps them.
- R-064 [PM:states Canvas · photo_swap, Pages · dragging, pm-sketch; F13] When pages move, each element follows the page holding its centre; a cross-page element still spans pages after the move.

## Frame styles
- R-065 [PM:states Canvas · frame_switch_multi, Frame Panel; D1-19] Frames are single-image (polaroid) or multi-image (film strip); each Frame panel thumbnail states its photo count.
- R-066 [PM:states Canvas · frame_switch_multi, flow-table, tbd; D1-21] The style is switched from the frame toolbar, not by dragging (entry TBD-2, Q-3).
- R-067 [PM:states Canvas · frame_switch_multi; D1-21] Single → multi: the photo goes to the first cell (left→right, top→bottom); other cells show 「+」.
- R-068 [PM:states Canvas · frame_switch_single; D1-22] Multi → single keeps the first photo; the others are deleted.
- R-069 [PM:states Canvas · frame_switch_single; D1-22] Multi → fewer cells (N) keeps the first N photos in left→right, top→bottom order.
- R-070 [PM:states Canvas · frame_switch_single; D1-22] Deleted photos do not come back when switching back; only undo / redo restores them.

## Locks
- R-071 [PM:states Canvas · frame_locked, pm-sketch; D1-33] A locked frame (「Frame locked」) cannot be dragged, rotated or scaled.
- R-072 [PM:states Canvas · frame_locked; D1-33] A focused locked frame still shows the toolbar; all items except Duplicate / Unlock / Delete are disabled.
- R-073 [PM:states Canvas · frame_locked, flow-table; D1-33, D1-32] Locked-frame floating icons: Delete / Duplicate / Unlock; Duplicate and Delete work as unlocked.
- R-074 [PM:states Canvas · frame_locked, Pages · min_pages; D1-33, D1-39] Deleting or removing a page in Pages deletes a locked frame on it.
- R-075 [PM:states Canvas · image_locked, pm-sketch; D1-34] A locked image (「Image locked」) cannot be dragged or zoomed.
- R-076 [PM:states Canvas · image_locked; D1-34, D1-35] A focused locked image still shows its one toolbar; all items except Unlock / Delete are disabled.
- R-077 [PM:states Canvas · image_locked; D1-34] Locked-image floating icons: Delete / Duplicate / Unlock.
- R-078 [PM:states Canvas · image_locked, flow-table; D1-32] Unlock returns to normal focus and editing.

## Background
- R-079 [PM:states Background · solid, flow-table; F10] 「Background」 opens a sheet with tabs 「Solid」 / 「Texture」 and ✕.
- R-080 [PM:states Background · solid; F10, D1-23] Solid: 32 swatches (8 × 4, content team); a swatch applies at once; no gradient.
- R-081 [PM:states Background · texture; D1-17] Textures are new content and loop seamlessly.
- R-082 [PM:states Background · texture; D3-02, D2-07] Some textures are PRO (CMS) and NEW-tagged; a free user may apply them, IAP at export.
- R-083 [PM:states Background · custom_color; D1-23] 「Custom color」 opens a picker: saturation / brightness square, hue bar and eyedropper (as Text color picker).
- R-084 [PM:states Background · custom_color; D1-23] The eyedropper picks a colour from the canvas.
- R-085 [PM:states Background · custom_color; D1-23] Picker 「Cancel」 does not apply; 「Done」 applies the colour as the background.
- R-086 [PM:flow-table, tbd; F10, D1-31, D1-42, D1-37] A bottom sheet's ✕ closes it and keeps the applied changes (TBD-4 proposal, Q-5).

## Add Layer
- R-087 [PM:add-layer-flow, states Add Layer; F11] 「+」 opens 「Add Layer」: 「Image」 「Text」 「Sticker」 「Frame」 (NEW) 「Text Bubble」, ✕; no video, file, grid, shape or drawing.
- R-088 [PM:add-layer-flow, flow-table, tbd; D1-42] Image opens the Collage photo picker; the photo is added as a single-image frame (TBD-5 proposal, Q-6).
- R-089 [PM:add-layer-flow; D1-14, D1-42] Text opens the Collage text input (「Cancel」 / 「Done」).
- R-090 [PM:add-layer-flow; D1-14, D1-42] Sticker opens the Edit Room Sticker panel.
- R-091 [PM:add-layer-flow, states Frame Panel; D1-42, F2] Frame opens the new Frame panel with square thumbnails; tapping one adds that frame.
- R-092 [PM:add-layer-flow; D1-14, D1-42] Text Bubble opens the Edit Room Text Bubble panel.
- R-093 [PM:add-layer-flow; D1-42] After finishing, the Canvas shows the new element.
- R-094 [PM:states Frame Panel; D2-07, D3-02, F17] Frame panel thumbnails carry CMS NEW / PRO tags; a PRO frame is usable, IAP at export.

## Layers
- R-095 [PM:states Layers · default; D1-31] 「Layers」 opens a list (as SCRL), each layer's thumbnail on a transparency grid, with ✕.
- R-096 [PM:states Layers · default / menu; D1-31, D1-32] ⋯ opens 「Delete」 / 「Duplicate」 / 「Lock」 with icons; a locked layer shows 「Unlock」.
- R-097 [PM:states Layers · menu; D1-31, D1-33, D1-34] The menu actions act on that element; Lock gives the locked behaviour on the canvas.
- R-098 [PM:states Layers · default, tbd; D1-31] Right-side ≡ (TBD-3 proposal: hold-drag to reorder layers, Q-4).

## Ratio
- R-099 [PM:states Ratio · default; D2-02, F12, D1-37] The 「Ratio」 sheet offers 1:1 / 4:5 / 5:4 / 3:4 / 4:3 / 9:16 / 16:9 with Crop / AI Expand style icons plus numbers, and ✕.
- R-100 [PM:states Ratio · default, flow-table; D1-36] The canvas default short side is 1080 px; a ratio change only changes the long side.
- R-101 [PM:states Ratio · default, pm-sketch; F12] On a ratio change elements stay put; the canvas grows downward / shrinks upward.
- R-102 [PM:states Ratio · default; D1-06] No AI Expand promotion.

## Pages
- R-103 [PM:states Pages · default; D1-38] Pages previews the joined pages, with only a thin line between pages.
- R-104 [PM:states Pages · default; D1-41] Pages opens on the page the user was on; small text shows the selected page (「Page 1 / 3」; denominator TBD-8, Q-9).
- R-105 [PM:states Pages · default; D1-26, D1-30] Tapping a thumbnail selects the page; elements cannot be edited here.
- R-106 [PM:states Pages · dragging; D1-25, F13] Holding ≡ drags a page: thumbnail enlarged and translucent, others make room, release reorders (「Hold ≡ & drag to reorder」).
- R-107 [PM:states Pages · default; D1-25] Tapping ≡ without holding does nothing.
- R-108 [PM:states Pages · min_pages; D1-27] ••• opens 「Duplicate page」 (inserted after the page) / 「Delete page」 (no confirmation).
- R-109 [PM:states Pages · min_pages; D1-39] Deleting a page deletes everything on it.
- R-110 [PM:states Pages · default; D1-28, D1-29] The thumbnail-row 「+」 and bottom 「+」 add a page at the end and scroll there; bottom 「−」 removes the last page.
- R-111 [PM:states Pages · max_pages, cms; D1-12] A canvas has 1 to 10 pages.
- R-112 [PM:states Pages · max_pages; D1-12, D1-27] At 10 pages the row 「+」, bottom 「+」 and 「Duplicate page」 are unavailable.
- R-113 [PM:states Pages · min_pages; D1-12, D1-29] At 1 page 「Delete page」 and bottom 「−」 are unavailable.
- R-114 [PM:states Pages · default; D1-40] Pages has no undo / redo.
- R-115 [PM:states Pages · default, flow-table; D1-24, D1-26] ✓ applies and returns to the Canvas on the selected page.
- R-116 [PM:states Pages · discard; D1-24] ✕ drops this visit's page changes and returns to the Canvas; with changes, 「Discard changes?」 (Discard / Keep, as Edit Room) comes first.
- R-117 [PM:tbd] Deleting a page with a cross-page element: TBD-6 proposal deletes the whole element (Q-7).

## Export
- R-119 [PM:states Save Page · default; D2-01] Export cuts each page into one image.
- R-120 [PM:states Save Page · default, entry-banner; D2-05] All N images are saved together to the 「PhotoDirector」 album; 「Save & Share」 shows 「N images」.
- R-121 [PM:states Save Page · default; D2-04] Resolution follows the Image Quality setting, applied to each image's long side (TBD-7 conflicts, Q-8).
- R-122 [PM:states Save Page · default, flow-table; D2-05] Share via 「Instagram」 / 「Facebook」 / 「More」 passes all N images when the app takes several, otherwise only opens the app.
- R-123 [PM:states Save Page · default, monetization-notes; D3-03] No watermark.
- R-124 [PM:states Save Page · default; D0-06] The images are not saved to My AI Artwork.
- R-125 [PM:entry-banner (red back arrow)] 「Save & Share」 「‹」 returns to the Canvas with the edits kept.

## Monetization
- R-126 [PM:states Save Page · iap_every_3, monetization-notes; D3-03, D3-05] A Free user gets the IAP page every 3 saves; exports are counted, not images.
- R-127 [PM:states Save Page · iap_every_3; D3-05] No rating dialog (removed from September on both platforms).
- R-128 [PM:states Save Page · pro_export, Template Preview · pro; D3-04, D3-02] A Free user who used PRO content (template, frame or texture) gets the IAP page (「Paid style applied」) on Export.
- R-129 [PM:states Save Page · pro_export; D3-01] Removal / Enhance are gated when applied in their rooms, not at export.
- R-130 [PM:overview, monetization-notes; D4-01] Non-generative: no credits charged, no new SKU.
- R-131 [PM:states Save Page · iap_every_3 / pro_export; D3-04, D3-05] A paying (Premium) user gets neither the every-3 IAP nor the PRO-content IAP at export.
- R-132 [PM:event-notes; D0-05, D1-15] Events ScrollableCollage_Canvas_Appear (from, template_guid) and ScrollableCollage_Export_Done (template_guid, page_count, photo_count, ratio); names provisional — NOT TESTABLE: analytics events, no event viewer on the phone.
- R-133 [PM:overview; D0-01, D0-02, D0-03] Audience, success metric (Export_Done ÷ Canvas_Appear) and release (26 11E, with Year End Recap) — NOT TESTABLE: product goals.
- R-135 [PM:scrl-compare, cms; D5-01, D2-07] SCRL differences (no template link, TikTok share, video export, projects, similar templates, favourites) and the CMS handoff blocker — NOT TESTABLE: scope notes, nothing in the app to observe beyond R-087 / R-122.

## Android
- R-134 [Rule: Android system Back (analysis pass 8, REQ-051 of the skill)] On Android, system Back on every screen and sheet does what its own 「‹」 / ✕ / Cancel does; on the Canvas it asks 「Discard changes?」 as ‹ does. The spec draws no Android Back (Q-14).

## Open questions
- Q-1 Banner copy and feature name: the entry flow draws 「Try Swipe Collage!」 / 「Create the perfect year-end recap post.」, the Collage Room · banner board and the flow table 「Try Scrollable Collage!」 / 「Swipe-able multi-page collage」; the screen title is 「Scrollable Collage」 and TBD-9 proposes 「Carousel Collage」. Which is final? (R-003, R-010)
- Q-2 TBD-1 frame Opacity / Shadow: proposed the Collage room sliders, pending PM. (R-047)
- Q-3 TBD-2 entry of the frame-style switch: proposed a first 「Frame」 button on the frame toolbar, but the frame toolbar mock starts with 「Opacity」. (R-066)
- Q-4 TBD-3 Layers ≡: proposed hold-drag to reorder layers. (R-098)
- Q-5 TBD-4 bottom-sheet ✕ keeps applied changes? proposed yes. (R-086, R-134)
- Q-6 TBD-5 Add Layer › Image adds a single-image frame or a free layer? proposed a frame. (R-088)
- Q-7 TBD-6 deleting a page with a cross-page element: proposed delete it whole. (R-117)
- Q-8 TBD-7 export size: D2-04 says Image Quality per long side, TBD-7 proposes canvas size with a 1200 px short side, D1-36 says the canvas short side is 1080 px. (R-100, R-121)
- Q-9 TBD-8 「Page n / ?」 denominator: proposed total pages. (R-104)
- Q-10 Deeplink URLs (`scrollable_collage`, `category_guid`, `template_guid`) are not given; RD to supply test links. Where does ‹ go after a deeplink entry? (R-007 – R-009)
- Q-11 No Figma links came with the PDF, so frames newer than the export and the control inventory could not be read (Figma servers also need sign-in). Please send the Figma link. (all)
- Q-12 Which East / West thumbnail set does a user see (region, language)? (R-018)
- Q-13 Does Canvas ↶ undo a page change applied in Pages (✓)? (R-030, R-114)
- Q-14 Android system Back is not drawn: rows assume it equals ‹ / ✕ / Cancel. (R-134)
- Q-15 「每 save 3 次跳 IAP」: on the 3rd save or after it, before or after saving, and is the count kept across sessions? (R-126)
- Q-16 Where does 「Continue editing?」 appear after a kill: at app launch or on entering Swipe Collage? (R-034)
- Q-17 Does Canvas ‹ ask 「Discard changes?」 even with no edits? (R-033)

## Added 2026-10-29 — coverage passes and standing inputs

### Job states
| Job | Start / loading | Success | Failure | Retry | Leave and return | Longest wait | Done notice |
|---|---|---|---|---|---|---|---|
| Template list (CMS) | n/a (spec silent) | TC-009, TC-013 | n/a (spec silent: no offline / empty state drawn) | n/a (spec silent) | TC-023 | n/a (spec silent) | n/a (no notice) |
| Photo import | n/a (spec silent) | TC-043, TC-044 | n/a (spec silent) | n/a (spec silent) | TC-047 | n/a (spec silent) | n/a (no notice) |
| Removal apply | n/a (existing room) | TC-064 | n/a (existing room, spec silent) | n/a (existing room) | TC-068 | n/a (existing room) | n/a (no notice) |
| Enhance apply | n/a (existing room) | TC-065 | n/a (existing room, spec silent) | n/a (existing room) | TC-068 | n/a (existing room) | n/a (no notice) |
| Export (save N images) | n/a (spec silent) | TC-136, TC-137 | n/a (spec silent) | n/a (spec silent) | TC-144 | n/a (spec silent) | TC-136 |

### Error classes
| Job | Error classes |
|---|---|
| All jobs | n/a (the spec names no error classes or failure copy) |

### Exit × stage
| Stage | ‹ / ✕ / Cancel | System Back | App killed |
|---|---|---|---|
| Canvas, no edit | TC-035 | n/a (same dialog as ‹; TC-158 checks Back on an edited canvas) | n/a (nothing to restore; spec silent) |
| Canvas, edited | TC-032 – TC-034 | TC-158, TC-159 | TC-036 – TC-038 |
| Canvas, element in focus | n/a (no ‹ of its own) | TC-160 | n/a (spec silent) |
| Bottom sheet open | TC-098, TC-107, TC-113, TC-117 | TC-162 | n/a (spec silent) |
| Pages, with changes | TC-131 – TC-133 | TC-165 | n/a (spec silent) |
| Pages, no change | TC-130 | TC-166 | n/a (spec silent) |
| Photo picker | TC-047 | TC-161 | n/a (spec silent) |
| Removal / Enhance room | TC-068 | TC-167 | n/a (existing room) |
| Save & Share | TC-144 | TC-169 | n/a (already saved) |

### System back
- Template Page → Collage room: TC-156
- Template Preview → Template Page: TC-157
- Canvas (edited) → 「Discard changes?」: TC-158; the dialog itself: TC-159; element in focus: TC-160
- Photo picker → Canvas: TC-161
- Background / Add Layer / Layers / Ratio / Frame panel sheets → close as ✕: TC-162
- Custom color picker → as Cancel: TC-163
- Text input with keyboard → keyboard first, then as Cancel: TC-164
- Pages → as ✕: TC-165, TC-166
- Object Removal / AI Enhance rooms → as ✕: TC-167
- IAP page → as ✕: TC-168
- Save & Share → Canvas: TC-169
- Sticker / Text Bubble panels → n/a (existing Edit Room panels; covered by TC-162's rule, Q-14)

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

### Variants
| Requirement | Variant | Rows |
|---|---|---|
| R-055 | Free (IAP at apply) | TC-061 |
| R-055 | Premium (applies) | TC-064 |
| R-056 | Free (IAP at apply) | TC-062 |
| R-056 | Premium (applies) | TC-065 |
| R-126 | Free | TC-145, TC-146 |
| R-126 | Premium (no IAP, R-131) | TC-147 |
| R-128 | PRO template | TC-149 |
| R-128 | PRO frame | TC-150 |
| R-128 | PRO texture | TC-151 |
| R-128 | Premium (no IAP, R-131) | TC-153 |
| R-099 | 1:1, 4:5, 5:4, 3:4, 4:3, 9:16, 16:9 (each tapped) | TC-114, TC-115 |
| R-087 | Image | TC-100 |
| R-087 | Text | TC-101 |
| R-087 | Sticker | TC-103 |
| R-087 | Frame | TC-104 |
| R-087 | Text Bubble | TC-106 |
| R-122 | Instagram | TC-141 |
| R-122 | Facebook | TC-142 |
| R-122 | More | TC-143 |
| R-018 | East / West thumbnails | TC-018 |
| R-121 | lowest / highest Image Quality | TC-139 |

### Flow arrows walked by existing rows
The PDF has no Figma links, so arrows are the spec's Screen × Button → Next table (`ft-…`) and the red back arrows of
the drawn flows (`dr-…`).
- R-140 [PM:flow-table flow arrow ft-01 (D1-07)] Collage Room banner → Template Page. Walked by: TC-003.
- R-141 [PM:flow-table flow arrow ft-02 (D1-07)] Template Page ‹ → Collage Room. Walked by: TC-019.
- R-142 [PM:flow-table flow arrow ft-03 (D2-07)] Category tab → category switched. Walked by: TC-013.
- R-143 [PM:flow-table flow arrow ft-04 (D1-02)] Template thumbnail → Template Preview. Walked by: TC-020.
- R-144 [PM:flow-table flow arrow ft-05 (D2-08)] Thumbnail swipe right → next page of that template. Walked by: TC-016.
- R-145 [PM:flow-table flow arrow ft-06 (D1-02)] Template Preview ‹ → Template Page. Walked by: TC-023.
- R-146 [PM:flow-table flow arrow ft-07 (D2-09)] Template Preview swipe → page by page. Walked by: TC-022.
- R-147 [PM:flow-table flow arrow ft-08 (D1-02)] Use Template → Canvas. Walked by: TC-024.
- R-148 [PM:flow-table flow arrow ft-09 (D1-10)] Canvas ‹ → Discard dialog → Template Preview. Walked by: TC-032, TC-034.
- R-149 [PM:flow-table flow arrow ft-10 (D1-13)] ↶ / ↷ → undo / redo. Walked by: TC-031.
- R-150 [PM:flow-table flow arrow ft-11 (D2-05)] Export → Save & Share. Walked by: TC-136.
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
- R-187 [PM:flow-table flow arrow ft-48 (D1-42)] Add Layer ✕ → closed (TBD-4). Walked by: TC-107.
- R-188 [PM:flow-table flow arrow ft-49 (D1-42)] Frame panel thumbnail → frame added. Walked by: TC-104.
- R-189 [PM:flow-table flow arrow ft-50 (D1-36)] Ratio item → applied, long side only. Walked by: TC-115.
- R-190 [PM:flow-table flow arrow ft-51 (D1-37)] Ratio ✕ → closed (TBD-4). Walked by: TC-117.
- R-191 [PM:flow-table flow arrow ft-52 (D1-24)] Pages ✕ → discard, Discard dialog when changed. Walked by: TC-130, TC-131, TC-133.
- R-192 [PM:flow-table flow arrow ft-53 (D1-24, D1-26)] Pages ✓ → Canvas on the selected page. Walked by: TC-129.
- R-193 [PM:flow-table flow arrow ft-54 (D1-26)] Pages thumbnail → page selected. Walked by: TC-119.
- R-194 [PM:flow-table flow arrow ft-55 (D1-25)] Hold ≡ → drag to reorder. Walked by: TC-121.
- R-195 [PM:flow-table flow arrow ft-56 (D1-27)] ••• → Duplicate / Delete page. Walked by: TC-122, TC-123.
- R-196 [PM:flow-table flow arrow ft-57 (D1-28, D1-29)] Row + / bottom − + → pages added / removed at the end. Walked by: TC-124, TC-125.
- R-197 [PM:flow-table flow arrow ft-58 (F4)] Photo picker Done → frames filled, Canvas. Walked by: TC-043.
- R-198 [PM:flow-table flow arrow ft-59 (D2-05)] Save page Instagram / Facebook / More → share. Walked by: TC-141, TC-142, TC-143.
- R-199 [PM:flow-table flow arrow ft-60 (D3-03)] IAP page ✕ / Continue → as existing (Continue starts a purchase and is not tapped). Walked by: TC-063, TC-152.
- R-200 [PM:entry-banner flow arrow dr-01 (red back arrow)] Photo picker ‹ → Canvas. Walked by: TC-047.
- R-201 [PM:entry-banner flow arrow dr-02 (red back arrow)] Save & Share ‹ → Canvas. Walked by: TC-144.
- R-202 [PM:removal-flow flow arrow dr-03 (D1-11)] Removal / Enhance room ✕ → Canvas, not applied. Walked by: TC-068.
- R-203 [PM:removal-flow flow arrow dr-04 (D3-01)] IAP page ✕ → back. Walked by: TC-063.
- R-204 [PM:add-layer-flow flow arrow dr-05 (D1-42)] Add Layer panel finished → Canvas with the new element. Walked by: TC-101.

### Request ledger coverage
| Ledger entry | Requirements |
|---|---|
| REQ-001 | R-001 – R-204 (the whole table) |
| REQ-004 | R-018 (TC-018: East in Traditional Chinese and Japanese, West in English and German) |
