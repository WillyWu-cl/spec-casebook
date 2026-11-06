# Scrollable Collage — board notes (spec set 2026-11-05)

**Figma-only spec set** (user, 2026-11-05): no PDF export. PM: Figma `zrl1BBEyqTvdLfjtaT8g6I` 「Collage」, page 2171:2
「26 11E Scrollable Collage (year end)」, read through figma-pm (qa1). Design: Figma `iUy5kOrVNG7IjcyxGGnp9t`
「Swipe_collage」, page 0:1 「20261029_Swipe Collage」, read through figma-design (qa-dm). Board text is the Figma text
layer (`boards/*.md`, absolute canvas points); board images in `figma/`. Decision ids in brackets ([D1-07], [F4]) are the
PM's own. The Design file's page 3:587 「PM SPEC」 is an older copy of the PM section (it lacks 「Save page」): not read.

**Source order.** Design (page dated 2026-10-29) outranks PM; the PM 「Save page」 section 「11/3 更新 save page」 is newer
and wins on Save & Share buttons. PM-only rules (not drawn by the Design) are rows marked PM-only (pass 7).

**Name.** The Design and its UI say 「Swipe Collage」; the PM says 「Scrollable Collage」; TBD-9 proposes 「Carousel
Collage」 (Q-1). Rows use the Design copy.

## pm-header — title and diff line
「Demo + Spec — Scrollable Collage（26 11E）」. Unlike Collage (one image with cut-outs to upload into), Scrollable
Collage is a canvas where the user adds and removes frames freely [D0-03].

## pm-flow — Spec - Flow (rows 1–5 and the arrows)
- Overview: multi-page canvas, frames added / removed freely, export cut into several images [D0-03]; audience IG /
  TikTok carousels and photo dumps, launches with Year End Recap 26 11E [D0-01]; success = export completion [D0-02];
  entries Collage room banner (own new room) and deeplink scrollable_collage; no Launcher shortcut this build; not in
  My AI Artwork [D0-04, D0-06, D1-08]; not generative: no credits, no new SKU [D4-01].
- Row 1 (Collage banner): banner → Template Page [D1-07] (waterfall, only photo / page counts [D1-01]) → Template
  Preview (counts, page-by-page swipe [D1-02]) → Canvas (frame + imports [F4], limit = empty frames [D2-06]) →
  Photo Picker → Canvas image focus → Export [D1-04] → Save (N images to the album + share [D2-05]). Canvas ‹ asks the
  Discard dialog (as Edit Room) and returns to Template Preview [D1-10].
- Row 2 (Deeplink): lands on the waterfall, category_guid selects the category; template_guid opens the preview [D1-09].
- Row 3 (Add Layer): [+] opens five functions [F11]: Image → Collage photo picker; Text → Collage text input; Sticker →
  Edit Room sticker panel; Frame → new Frame panel (square thumbnails); Text Bubble → Edit Room text bubble
  [D1-14, D1-42]; done → back on the canvas with the new element.
- Rows 4–5 (Image focus → Removal / Enhance): premium tag, tap opens the room [D3-01]; Free user's apply opens the
  existing IAP page [D1-43]; paid ✓ replaces the frame's photo, back to the canvas, undoable, not saved to the album; ✕
  applies nothing [D1-11].
- Arrows are frames named 「<from> --> <to>」 (blue = forward tap, red = ‹ return); listed by hand in `arrows.json` (34).

## pm-ui-1 — Collage Room · banner, Template Page, Template Preview, CMS
- Banner 「Try Scrollable Collage!」 / 「Swipe-able multi-page collage」 (PM mockup) on entering the Collage room, every
  time, never removed [D1-07]; own new room, not a Collage category [D0-04]; at the top of the Collage room [D1-16].
- CMS table: guid (deeplink template_guid), categories 3–4 ordered by CMS, Year End first (deeplink category_guid),
  NEW tag, usageType free / purchase → PRO icon, blocked at export [D3-02], photo count, page count 1–10 [D1-12],
  thumbnails East / West, one per page, waterfall shows the first page [F16]. CMS type and sheet are mock (handoff
  blocker) [D2-07]. Day 1: 20 templates [F16]; new content frames (single / multi masks) [F17] and loopable textures
  [D1-17]; text, fonts, styles, bubbles, stickers reuse the CMS [D1-14].
- Template Page: waterfall [D1-01]; card swipes right to later pages [D2-08]; only counts, no orientation [D1-01]; East
  / West thumbnails, every page shown [F16]; thumbnail = first page [D2-08]; PRO icon top right [D3-02].
- Template Preview: counts, page-by-page swipe [D2-09], PRO icon; Free may use, IAP at export [D3-04]; thumbnail =
  default layout [F1]; Use Template → Canvas [D1-02]; deeplink template_guid opens it [D1-09].

## pm-ui-2 — Canvas states and Background
- Canvas default: multi-page, free zoom, horizontal scroll [D1-03]; every cut-out is an add-image frame [F2]; + imports
  one or several, limit = empty frames [F4]; undo / redo for everything [D1-13]; bottom Background / Layers / + / Ratio
  / Pages; text colour / content / font and image position adjustable [D1-04].
- Frame focus: tap toggles frame ↔ image focus [F6]; floating delete / duplicate / lock [F7, D1-32]; frame tools
  opacity / shadow / flip H / flip V / duplicate / lock / delete (whole frame) [F9]; frame resizable [F3]; select
  state can delete / duplicate / lock [D1-05].
- Image focus: one scrolling bar Replace / Flip H / Flip V / Adjust / Filter (as Collage) [F8, D1-35]; Removal /
  Enhance premium tag, gated at apply [D3-01]; result replaces the photo, undoable, not saved [D1-11]; delete empties the
  frame [F8].
- photo_swap: long-press drag to another frame swaps [F5]; elements follow the page of their centre, cross-page stays
  cross-page [F13]; swap inside a multi frame [D1-20].
- frame_switch_multi / single: single vs multi frames [D1-19]; switch from the frame toolbar, not by dragging [D1-21];
  single → multi puts the photo in the first cell, others show + [D1-21]; multi → single keeps the first; → fewer
  keeps the first N; deleted photos come back only by undo [D1-22].
- Background: solid only, no gradient [F10]; 32 swatches 8 × 4 [D1-23]; custom colour picker with SV square, hue bar,
  eyedropper, Cancel / Done as the Text color picker [D1-23]; textures loop, some PRO [D1-17, D3-02].

## pm-ui-3 — Add Layer, Layers, Frame panel, Ratio, Pages
- Add Layer: image / text / sticker / frame / text bubble; no video, file, grid, shape, drawing [F11].
- Layers (as SCRL): thumbnail on transparency grid [D1-31]; ⋯ left: Delete / Duplicate / Lock (Unlock when locked),
  icons [D1-31, D1-32]; ≡ right (TBD-3).
- Frame panel: frame is the only new content [D1-14]; square thumbnails [D1-42] labelled with photo count [D1-19];
  tap adds the frame [F2]; NEW / PRO by CMS [D2-07, D3-02].
- Ratio: 1:1 / 4:5 / 5:4 / 3:4 / 4:3 / 9:16 / 16:9 [D2-02, F12]; Crop / AI Expand icons + numbers [D1-37]; default
  short side 1080 px, ratio changes the long side [D1-36]; elements stay, canvas grows down / shrinks up [F12]; no AI
  Expand promotion [D1-06].
- Pages: preview joined pages, thin lines [D1-38]; opens on the current page, small text shows the page [D1-41]; 1–10
  pages [D1-12]; ••• Duplicate page (after the original) / Delete page (no confirm) [D1-27]; hold ≡ to drag (enlarged,
  translucent, others make room) [D1-25]; ✕ discards all changes, Discard dialog when changed [D1-24]; at 10: row +,
  bottom +, Duplicate page unavailable; at 1: Delete page and − unavailable [D1-12, D1-27, D1-29]; delete page deletes
  everything incl. locked [D1-39, D1-33]; tap thumbnail selects, no element editing [D1-26, D1-30]; tap ≡ does nothing
  [D1-25]; row + and bottom − / + at the end, scrolls to the end [D1-28, D1-29]; no undo / redo, ✓ applies [D1-40].
  Mock strings: 「Page 1 / 3」, 「Hold ≡ & drag to reorder」, 「Duplicate page」, 「Delete page」, 「Discard changes?」 /
  「Discard」 / 「Keep」.

## pm-ui-4 — Photo Picker, Save Page, Locks
- Picker: as Collage [D2-06]; limit = empty frames, cap 20 on both platforms, Android not held to its default 6
  [D2-06]; Done fills empty frames in order [F4]. Mock: 「Select up to 3 photos」, 「Done (2)」.
- Save Page: one image per page [D2-01]; all N to the 「PhotoDirector」 album, Save page shows N [D2-05]; resolution by
  Image Quality on each long side [D2-04]; share IG / FB / More, N images if possible else just open the app [D2-05];
  no watermark [D3-03]; not in My AI Artwork [D0-06]; Free every 3 saves → IAP [D3-03], counted per export [D3-05]; no
  rating dialog [D3-05]; PRO content → IAP at Export with 「Paid style applied」 [D3-04]; Removal / Enhance gated in
  their rooms, not at export [D3-01]. IAP page 「PhotoDirector Premium」 existing, unchanged.
- frame_locked: no drag / rotate [D1-33]; bar shown, all disabled but Duplicate / Unlock / Delete; floating Delete /
  Duplicate / Unlock; Pages deletion still deletes it [D1-33]. image_locked: no drag / zoom [D1-34]; bar shown, all
  disabled but Unlock / Delete [D1-34, D1-35]; floating Delete / Duplicate / Unlock; Unlock restores editing [D1-32].

## pm-leave-resume, pm-save-iap, pm-tracking, pm-competitor
- ‹ → 「Discard changes?」 Discard / Keep (Edit Room) [D1-10]; app killed → 「Continue editing?」 next time (Edit Room)
  [D1-10]; only the latest editing record is restored [D1-18].
- Save & IAP repeats D3-01…D3-05 and D4-01 (above).
- Tracking: ScrollableCollage_Canvas_Appear (from: Collage_Banner / Deeplink, template_guid), ScrollableCollage_Export_Done
  (template_guid, page_count, photo_count, ratio); new dedicated events [D0-05]; names tentative [D1-15]; metric =
  Export_Done ÷ Canvas_Appear [D0-02].
- Competitor (SCRL): what SCRL does; we show no orientation [D1-01], no video / gradient / grid / shape / drawing
  [F11], no template links, TikTok share, video export, projects, similar templates or favourites on Day 1 [D5-01];
  seven ratios [F12].

## pm-button-next-step — Button → Next Step table
Every button and its next step (Collage Room banner → Template Page; Template Page ‹ / tabs / tap / swipe; Template
Preview ‹ / swipe / Use Template; Canvas ‹ → Discard → Template Preview, ↶ / ↷, Export → Save (IAP first for Free with
PRO content), frame + → picker, tap frame / image → focus, long-press → swap, Background / Layers / + / Ratio / Pages;
frame focus floating Delete / Duplicate / Lock, Opacity / Shadow (TBD-1), Flip, frame style (TBD-2); image focus
Replace / Flip / Adjust / Filter / Removal / Enhance / Lock / Delete; locked Unlock / Duplicate / Delete, others
disabled; Background Solid / Texture / swatch / Custom / eyedropper / Cancel / Done / ✕ (TBD-4); Layers ⋯ / ≡ (TBD-3)
/ ✕; Add Layer five items (Image TBD-5); Frame panel tap / ✕; Ratio tap (long side only) / ✕; Pages ✕ / ✓ / tap / ≡ /
••• / + −; Photo Picker Done; Save page share; IAP ✕ / Continue).

## pm-draft-tbd — open PM decisions
TBD-1 Opacity / Shadow (→ Collage sliders), TBD-2 frame style entry (→ 「Frame」 first tool), TBD-3 Layers ≡ (→ drag
order), TBD-4 sheet ✕ keeps changes (→ yes), TBD-5 Add Layer Image (→ single frame), TBD-6 cross-page element on
page delete (→ deleted when touching), TBD-7 export size (→ short side 1200 px), TBD-8 「Page n / ?」 (→ total), TBD-9
name (→ Carousel Collage). Owner Meg (PM), all awaiting reply → Open questions.

## pm-save-page — 11/3 update (newest)
No thumbnail strip; the orange button saves every image; with more than one page a second button below saves only the
image in the preview. Strings: multi orange 「Save all X images」, multi outline 「Save this image」, single orange
「Save」. Mockups: 「Save & Share」, 「5 images in this set」, 「Swipe to view」, 「1/5」, Share to Instagram / Facebook /
Twitter / Line / Tiktok.

## pm-scrl — SCRL competitor screenshots and the original PM notes
Content to CMS 10/XX, RD tool 11/XX; Design builds 20 default canvases (background, frame positions and styles, text,
image count) and East / West thumbnails (every page shown); content needed: loopable texture, frames with mask info
(single / multi), stickers. Notes: long-press drags an input image to swap; every cut-out is an add-image frame; frames
resize; ratio change keeps elements, canvas grows / shrinks; input one or several photos, limit = empty frames;
thumbnail = default layout; per-image ratios 1:1 / 4:5 / 5:4 / 3:4 / 4:3 / 9:16 / 16:9; pages can be dragged,
elements follow the page of their centre, cross-page stays cross-page; frame ↔ image focus; image tools (replace, flip
H / V, adjustment, filter, removal and enhance (monetised), lock, delete → empty frame); frame tools (frame, opacity,
shadow, flip H / V, duplicate, lock, delete whole frame); new content text bubble. Ten pointer lines link notes to
screenshots (`arrows.json`, not_flow).

## Design — light set (x < 8000) and dark set (x ≥ 8396), page dated 20261029
Every screen is drawn twice, light and dark, with the same copy (diff of the board texts: only the Overview notes are
on the light board).
- Collage Room · banner: Collage room with tabs (All, 1…6 layouts), search, menu, sections 「New」 / 「Top」 / 「Classic」
  with 「View all」, and the banner 「Try Swipe Collage!」 / 「Create the perfect year-end recap post.」 (「Swipe」 in orange).
- Template Page: title 「Swipe Collage」, ‹, tabs 「Year End」 / 「Category1」 / 「Category2」, two-column waterfall cards
  「9 photos · 5 pages」.
- Template Preview (entry_launcher2): title 「Template」, preview with page dots, 「9 photos · 5pages」 (sic), 「Year End」,
  「Use Template」.
- Canvas (1_entry, canvas_default): **no top bar**; bottom bar 「Background」, 「Layers」, + , 「Ratio」, 「Pages」, then ✕,
  ↶, ↷, ✓ (the PM mockups put ‹ and 「Export」 at the top: Q-20). Frames show + .
- photo_picker: tabs 「Photo」 / 「Stock」, albums Recents / Sample Photos / Favorites / Instagram, 「Please select 3 photos
  to continue.」, 「(3/3)」 with an orange ✓, picked-photo tray.
- canvas_img_focus: bar Replace / Flip H / Flip V / Adjust / 「Fliter」 (sic) / Removal (+ Enhance on the Removal /
  Enhance rows); canvas_frame_focus: Opacity / Shadow / Flip H / Flip V / Duplicate / Lock, floating delete / duplicate /
  lock icons. Notes: frame ↔ image focus; frame tools; image tools.
- Save (multi): 「Save & Share」, 「5 images in this set」, 「Swipe to view」, 「1/5」, 「Save」 + 「Save this image only」, Share to.
  Save: Only 1 img: 「Save」, Share to Instagram / Facebook / Twitter / Line / Tiktok, 「You might also like」 (Q-14). The
  PM 11/3 strings win (「Save all N images」 / 「Save this image」).
- Add Layer: 「Image」, 「Text」, 「Sticker」, 「Frame」, 「Text Bubble」; 1_add_img = picker; 2_add_text = text input with
  bold / italic / align and keyboard; 3_Add_Sticker = Favorites / AI Sticker / Flower / Holiday; 4_frame = frame grid;
  5_Text_bubble = bubbles with a none choice.
- Background solid (swatches, custom colour), custom colour picker (Cancel / Done, hue bar, eyedropper), texture (NEW
  tag); Layers (⋯ menu Delete / Duplicate / Lock, ≡, checkerboard rows); Ratio (Design shows the Crop list 「Custom」,
  「Original」, 「Squre」 (sic), 「2:3」, 「3:2」, 「3:4」: Q-2); Pages (「Page 5 / 5」, − / + stepper, per-page ↔ and •••, add page
  +). Every sheet ends with ✕ and ✓ (Q-10).
- Removal: existing Object Removal room (Smart Select / Manual / One-Tap, Box / Circle / Swipe, 「Remove」, PRO toggle);
  Enhance: existing AI Enhance room (Standard / Advanced, General / Portrait / Anime / Product / Scenery / Pets,
  「Enhance」 5 credits, credit pill 100); IAP frame 「B (mimic VVG/ Beauty plus)」: 「PhotoDirector Premium」, 「Start 7-Day
  Free Trial」, yearly price, close (Q-19).
- Canvas icon buttons (light 130:3237, dark 116:3010): page move / more 36×36 normal / press / selected / disable; add
  page 40×40 normal / press / disable; page stepper 107×42 default / minus_press / plus_press / minus_disable /
  plus_disable; import_img 109×109 empty photo slot; ic_square_plus_filled 64×64. 「cut」 122:3043: banner title cut.
