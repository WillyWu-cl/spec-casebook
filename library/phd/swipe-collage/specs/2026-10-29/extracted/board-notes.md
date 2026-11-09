# Swipe Collage (Scrollable Collage) — board notes, spec set 2026-10-29

Source: `Collage.pdf` (one Figma export page, 31456 × 19676 pt). Read from the PDF text layer, which maps the Chinese
annotations correctly in this file, plus close-up renders of the entry flow, Canvas and Pages rows. The right half
("Demo + Spec — Scrollable Collage (26 11E)") is the current spec and tags every rule with an ID (`[D0-01]`, `[F4]` …);
the left half is the earlier PM sketch, every point of which the right half restates. No Figma links and no dates
other than the 26 11E release tag were supplied, so there is no Figma-only comparison (Q-11).

Product: PhotoDirector (IAP page 「PhotoDirector Premium」, Removal / Enhance rooms, Image Quality setting). Mockups are
iPhone frames; this table is Android.

## overview
- Feature: a multi-page canvas; the user adds / removes frames freely; export cuts it into several images [D0-03].
- Difference from Collage: Collage is one image with holes; Scrollable Collage is a canvas with free frames [D0-03].
- Audience IG / TikTok carousel, photo dump; ships with Year End Recap (26 11E) [D0-01].
- Success metric: export completion = Export_Done users ÷ Canvas_Appear users [D0-02].
- Entry: Collage room banner (independent new room), Deeplink `scrollable_collage`; Launcher Shortcut not in this spec
  and not built [D0-04][D0-06][D1-08]; not in My AI Artwork [D0-04].
- Non-generative: no credits, no new SKU [D4-01].

## leave-notes
- User taps ‹ → Discard dialog (same as Edit Room 「Discard changes?」 Discard / Keep) [D1-10].
- App killed → next time a 「Continue editing?」 dialog (same as Edit Room) [D1-10]; only the latest edit is restored
  (the user can only do one thing at a time) [D1-18].

## monetization-notes
- Removal / Enhance: premium tag on the toolbar, IAP page blocks at apply (existing rooms) [D3-01].
- Some content (template / frame / texture) set PRO by CMS [D3-02]; PRO content usable, IAP only at export (same as AI
  「Paid style applied」) [D3-04].
- No watermark [D3-03]. Free user: IAP page every 3 saves; counts exports, not images [D3-05]. No rating dialog (removed
  from September on iOS / Android) [D3-05]. No credits, no new SKU [D4-01].

## event-notes (analytics — not testable on the phone without an event viewer)
- New dedicated events [D0-05]: `ScrollableCollage_Canvas_Appear` (from: Collage_Banner / Deeplink; template_guid),
  `ScrollableCollage_Export_Done` (template_guid, page_count, photo_count, ratio). Names and parameters provisional [D1-15].

## scrl-compare (competitor SCRL; what we do differently)
- We do not mark orientation [D1-01]; no video, gradient, grid, shape, drawing [F11]; no template link, TikTok share,
  video export, projects, similar templates, favourites on Day 1 [D5-01]; SCRL has 3 ratios, we open 7 [F12].

## entry-banner (flow, blue = forward tap, red = back ‹)
Collage room (banner 「Try Swipe Collage!」 / 「Create the perfect year-end recap post.」 / 「NEW ›」 in this mockup) → tap
banner → Template Page 「Scrollable Collage」 (tabs Year End / Category 2 / Category 3, waterfall, 「6 photos · 3 pages」,
PRO badge) → tap a thumbnail → Template Preview 「Template」 (「9 photos · 5 pages」, 「Year End」, page dots, 「Use
Template」) → Canvas (‹, undo / redo, 「Export」, title text 「a year in pictures」, + in frames; bottom Background /
Layers / + / Ratio / Pages) → tap + in a frame → Photo Picker 「Select up to 3 photos」 (selection numbers, 「Done (2)」) →
Canvas with photos (「Image selected」, toolbar Replace / Flip H / Flip V / Adjust / Filter / Removal PRO / Enhance PRO /
Lock / Delete) → 「Export」 → 「Save & Share」 (「5 images」, Instagram / Facebook / More). Red arrows: each ‹ goes one
screen back; Canvas ‹ asks Discard first, then Template Preview [D1-10].

## entry-deeplink
- Deeplink lands on the waterfall; `category_guid` selects the category [D1-09]; `template_guid` opens the preview
  directly [D1-09].

## add-layer-flow
Canvas [+] → Add Layer (Image, Text 「Aa」, Sticker, Frame 「NEW」, Text Bubble; ✕) [F11]:
- Image → same as Collage photo picker [D1-42]; Text → same as Collage text input (Cancel / Done) [D1-14][D1-42];
  Sticker → same as Edit Room Sticker panel (Favorites / Trending / Special Effects, 「Search by keywords」) [D1-14][D1-42];
  Frame → NEW Frame panel, square thumbnails (「1 photo」, 「3 photos」, NEW / PRO) [D1-42]; Text Bubble → same as Edit Room
  [D1-14][D1-42]. After finishing, back to Canvas with the new element on it [D1-42].

## removal-flow / enhance-flow
- Removal / Enhance carry a premium tag; tap opens the room (Object Removal: Auto / Manual, Object / Smart Select / Wire,
  Box / Circle / Swoon, 「Remove」; AI Enhance: modes Standard / Pro, 「Enhance」) [D3-01]. Free user: IAP at apply
  [D3-01][D1-43]; IAP page is the existing one, unchanged (「PhotoDirector Premium」, 「Continue」, ✕) [D3-01].
- Paid user ✓ → result replaces that frame's photo, back to Canvas, undoable, not saved to the album; ✕ → not applied,
  back to Canvas [D1-11].

## flow-table (Screen | Button | Next | ID)
Collage Room banner → Template Page [D1-07]; Template Page ‹ → Collage Room [D1-07]; Category tab → switch [D2-07];
thumbnail tap → Template Preview [D1-02]; thumbnail swipe right → next page of that template [D2-08]; Template Preview
‹ → Template Page [D1-02]; swipe → page by page [D2-09]; Use Template → Canvas [D1-02]; Canvas ‹ → Discard → Template
Preview [D1-10]; ↶ / ↷ → undo / redo [D1-13]; Export → Save page, free user with PRO content gets IAP first
[D2-05][D3-04]; frame + → Photo Picker [F4]; tap frame → frame focus, tap image → image focus [F6]; long-press image →
drag swap (between / inside frames) [F5][D1-20]; Background → panel [F10]; Layers → panel [D1-31]; + → Add Layer [F11];
Ratio → panel [D2-02]; Pages → Pages [F13]. Frame focus: hover Delete (whole frame) [F9], hover Duplicate [F9], hover
Lock → frame_locked [D1-33], Opacity / Shadow → TBD-1 [F9], Flip H / V immediate [F9], switch frame style → Frame panel
(entry TBD-2) [D1-21]. Image focus: Replace → Photo Picker [F8]; Flip immediate [F8]; Adjust / Filter as Collage [F8];
Removal / Enhance rooms, IAP at apply [D3-01][D1-43]; Lock → image_locked [D1-34]; Delete → empty frame [F8]. Locked:
hover / toolbar Unlock → normal focus [D1-32]; Duplicate / Delete as unlocked; other tools disabled [D1-33][D1-34].
Background: Solid / Texture tabs [F10]; swatch / texture applies [D1-23][D1-17]; Custom color → picker; eyedropper
picks from canvas; picker Cancel / Done [D1-23]; ✕ TBD-4 [F10]. Layers: ⋯ → Delete / Duplicate / Lock menu; ≡ TBD-3;
✕ TBD-4 [D1-31]. Add Layer: Image → Photo Picker (content TBD-5); Text / Sticker / Frame / Text Bubble panels; ✕ TBD-4
[D1-42]. Frame panel: tap thumbnail → adds that frame [D1-42]. Ratio: ratio applies, long side only [D1-36]; ✕ TBD-4
[D1-37]. Pages: ✕ discards, asks Discard when changed [D1-24]; ✓ applies, back to Canvas on the selected page
[D1-24][D1-26]; tap thumbnail selects [D1-26]; hold ≡ drag to reorder [D1-25]; ••• Duplicate / Delete page [D1-27];
thumbnail-row + / bottom − + change page count (from the last page) [D1-28][D1-29]. Photo Picker: pick → Done fills
empty frames in order, back to Canvas [F4]. Save page: Instagram / Facebook / More share; app opened only if it cannot
take several [D2-05]. IAP page: ✕ / Continue as existing [D3-03].

## tbd (PM Meg, all 「待回覆」)
TBD-1 frame Opacity / Shadow → proposed same sliders as Collage. TBD-2 frame-style entry → proposed a first 「Frame」
button on the frame toolbar. TBD-3 Layers ≡ → proposed hold-drag to reorder layers. TBD-4 bottom-sheet ✕ → proposed
closes and keeps applied changes (as Edit Room). TBD-5 Add Layer › Image → proposed adds a single-image frame with the
photo. TBD-6 deleting a page with a cross-page element → proposed delete it whole. TBD-7 export size → proposed canvas
size (short side 1200 px). TBD-8 「Page n / ?」 denominator → proposed total pages. TBD-9 name → proposed 「Carousel
Collage」.

## cms
Fields: guid (template_guid opens preview) [D1-09]; categories[] 3–4, CMS order, Year End first; category_guid [D2-07];
tags (NEW) [D2-07]; usageType free / purchase → PRO icon, blocked at export [D3-02]; photo count (waterfall / preview)
[D1-01]; page count 1–10 [D1-12]; thumbnails East / West, one per page, waterfall shows page 1 [F16]. Day 1: 20
templates [F16]; new content: frame (mask single / multi image) [F17], background texture (loops) [D1-17]; text, fonts,
text styles, text bubble, stickers reuse existing CMS [D1-14]. Handoff blocker: CMS type / contentVer / sheet not set
[D2-07].

## states (state boards; each 【Requirement】 block)
- Collage Room · banner: banner 「Try Scrollable Collage!」 / 「Swipe-able multi-page collage」 / 「NEW ›」 shown on entering
  Collage, tap opens Scrollable Collage [D1-07]; independent room, not a Collage category [D0-04]; visible every time,
  not removed by default [D1-07]; at the top of the Collage room (no AI / Traditional categories) [D1-16]; rest as Collage [D0-04].
- Template Page · default / thumb_swipe: waterfall [D1-01]; only default photo count & page count, no orientation [D1-01];
  thumbnail shows page 1 [D2-08]; 3–4 categories, CMS order, Year End first, NEW by CMS tag [D2-03][D2-07]; PRO icon top
  right on CMS-PRO templates [D3-02]; each thumbnail swipes right to later pages (as SCRL) [D2-08]; East / West
  thumbnails, every page shown [F16]; deeplink lands here, category_guid picks the category [D1-09]; Day 1 20 templates [F16].
- Template Preview · default / pro: tap template → preview with photo / page count [D1-02]; swipe page by page [D2-09];
  thumbnail = template default layout [F1]; Use Template → Canvas [D1-02]; deeplink template_guid opens it [D1-09]; PRO
  icon [D3-02]; free user may use it, IAP only at export [D3-04].
- Canvas · default: multi-page canvas, free zoom, scroll left / right [D1-03]; every hole is an add-image frame (+) [F2];
  + imports one or many photos, limit = current empty frames [F4]; undo / redo top, all canvas operations [D1-13];
  bottom Background / Layers / + / Ratio / Pages [D1-04]; every element adjustable: text colour / content / font, image
  position [D1-04].
- Canvas · frame_focus: tap in frame focus → image focus, tap in image focus → frame focus [F6]; hover buttons delete /
  duplicate / lock (icons) [F7][D1-32]; frame tools Opacity / Shadow / Flip H / Flip V / Duplicate / Lock / Delete (whole
  frame) [F9]; frame scalable [F3]; lock → frame_locked [D1-33]; selected state can delete / duplicate / lock [D1-05].
  Label 「Frame selected」.
- Canvas · image_focus: one horizontally scrolling feature bar Replace / Flip H / Flip V / Adjust / Filter (as Collage)
  [F8][D1-35]; Removal / Enhance premium tag [D3-01]; IAP at apply [D3-01]; result replaces photo, back, undo, not saved to
  album [D1-11]; Delete → empty frame with + [F8]; lock → image_locked [D1-34]. Label 「Image selected」.
- Canvas · photo_swap: long-press drag an image onto another frame swaps the two [F5]; also between cells of a multi-image
  frame [D1-20]; elements move with the page holding their centre; a cross-page element stays cross-page after drag
  [F13]. Hint 「Long press & drag to swap」.
- Canvas · frame_switch_multi / single: frames single (polaroid) or multi (film strip) [D1-19]; switch style on the frame
  toolbar, not by dragging [D1-21]; single → multi: the photo goes to the first cell (left→right, top→bottom), other
  cells show + [D1-21]; multi → single keeps the first photo, others deleted; multi → fewer cells (N) keeps the first N
  in left→right, top→bottom order [D1-22]; deleted photos do not come back when switching back, only undo / redo [D1-22].
  Frame panel 「Frame」 ✕, thumbnails 「1 photo」 「3 photos」.
- Canvas · swap_in_frame: long-press drag inside a multi frame swaps cells [D1-20]; between frames as photo_swap [F5].
- Background · solid / texture / custom_color: solid only, no gradient [F10]; swatches 8×4 = 32 colours (content team)
  [D1-23]; custom colour: picker + hue bar + eyedropper (as Text color picker) [D1-23]; texture new content, loops
  [D1-17]; some textures PRO [D3-02]; Custom color opens saturation / brightness square + hue bar; eyedropper picks from
  canvas; Cancel does not apply, Done applies as background [D1-23]. Sheet 「Background」 ✕, tabs 「Solid」 「Texture」.
- Add Layer · default: Image / Text / Sticker / Frame / Text Bubble [F11]; no video, file, grid, shape, drawing [F11];
  frame new content, mask single / multi [F17]; only frame and texture are new [D1-14]; others reuse Edit Room panels and
  CMS [D1-14].
- Layers · default / menu: list (as SCRL), each layer's thumbnail on a transparency grid [D1-31]; left ⋯ Delete /
  Duplicate / Lock with icons (locked shows Unlock) [D1-31][D1-32]; right ≡ [D1-31]; lock behaviour as Canvas locked
  [D1-33][D1-34].
- Frame Panel · default: square thumbnails [D1-42]; each marks how many photos it holds [D1-19]; tap → adds frame [F2];
  NEW by CMS tag, some PRO [D2-07][D3-02].
- Ratio · default: 1:1 / 4:5 / 5:4 / 3:4 / 4:3 / 9:16 / 16:9 [D2-02][F12]; icons as PhD Crop / AI Expand + numbers
  [D1-37]; canvas default short side 1080 px, ratio changes the long side only [D1-36]; elements stay, canvas grows down /
  shrinks up [F12]; no AI Expand promotion [D1-06]. Sheet 「Ratio」 ✕.
- Pages · default: preview of the joined pages, only a thin line between pages [D1-38]; opens on the page the user was on,
  small text shows the selected page (「Page 1 / 3」) [D1-41]; tap thumbnail selects, no element editing here
  [D1-26][D1-30]; hold ≡ to drag, tap ≡ does nothing [D1-25]; thumbnail-row + and bottom − / +: add at the end, view
  scrolls to the end [D1-28][D1-29]; no undo / redo; ✓ applies, ✕ discards [D1-40][D1-24].
- Pages · max_pages: min 1, max 10 pages [D1-12]; at 10: thumbnail +, bottom +, Duplicate page unavailable [D1-12][D1-27]
  (「Page 1 / 10」).
- Pages · min_pages: ••• menu Duplicate page (after the page) / Delete page (no confirmation) [D1-27]; deleting a page
  deletes all on it, locked elements too [D1-39][D1-33]; one page left: Delete page and bottom − unavailable
  [D1-12][D1-29] (「Page 1 / 1」).
- Pages · dragging: hold ≡ drag: thumbnail enlarged, translucent, others make room, release reorders [D1-25]; pages
  reorderable [F13]. Hint 「Hold ≡ & drag to reorder」.
- Pages · discard: ✕ discards all page changes, back to canvas [D1-24]; with changes the Discard dialog first (「Discard
  changes?」 Discard / Keep) [D1-24].
- Photo Picker · default: same as Collage picker [D2-06]; import limit = empty frames, capped 20 on both platforms
  (Android not held to its default 6) [D2-06]; Done fills empty frames in order [F4]. Title 「Select up to 3 photos」,
  「Done (2)」.
- Save Page · default / iap_every_3 / pro_export: each page one image [D2-01]; N images saved together to the
  「PhotoDirector」 album, Save page shows N (「5 images」) [D2-05]; resolution follows Image Quality, applied to each
  image's long side [D2-04]; share IG / FB / More, all N when the app takes them, else the app only opens [D2-05]; no
  watermark [D3-03]; not saved to My AI Artwork [D0-06]; free user IAP every 3 saves, counted per export not per image, no
  rating dialog [D3-03][D3-05]; PRO content + free user: IAP at Export (「Paid style applied」) [D3-04]; Removal / Enhance
  already blocked in their rooms, not at export [D3-01].
- Canvas · frame_locked: no drag / rotate on canvas [D1-33]; feature bar still shows, all disabled except Duplicate /
  Unlock / Delete [D1-33]; hover Delete / Duplicate / Unlock [D1-33][D1-32]; deleting / removing a page in Pages still
  deletes the locked frame [D1-33]. Label 「Frame locked」.
- Canvas · image_locked: no drag / zoom [D1-34]; feature bar (one) still shows, all disabled except Unlock / Delete
  [D1-34][D1-35]; hover Delete / Duplicate / Unlock [D1-34]; Unlock restores editing [D1-32]. Label 「Image locked」.

## pm-sketch (older; restated by the right half)
Every hole is an add-image frame; frame scalable; long-press drag input image (swap with a 4-cell frame); input one /
many photos, limit = empty add-image frames; frame focus hover buttons delete / duplicate / lock; click toggles frame /
image focus; image tools (replace, flips, adjustment, filter, removal, enhance, lock, delete → empty frame) and frame
tools (frame, opacity, shadow, flips, duplicate, lock, delete); pages draggable, elements follow the page holding their
centre, cross-page stays cross-page; ratio change keeps elements, canvas grows / shrinks; 7 ratios. The sketch lists
「frame」 as the first frame tool (cf. TBD-2).

## plan-notes (project plan, not app behaviour)
Content ready on CMS 10/XX; AP RD CMS + tool 11/XX (save as template, save as image batch export); Design builds 20
default canvases; East / West thumbnails; content needed: texture (loop), frame, mask info, stickers.
