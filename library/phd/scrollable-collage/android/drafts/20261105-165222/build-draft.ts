// Builds requirements.md and draft.csv for phd/scrollable-collage (Figma-only spec set 2026-11-05), one platform per run.
// Usage: node library/phd/scrollable-collage/ios/drafts/20261105-165222/build-draft.ts <ios|android>
// The same file is copied into the Android draft folder; the platform argument picks the rows and grids.
// Row IDs are assigned in file order per platform, so grids name rows by key and are resolved at the end.
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const P = (process.argv[2] ?? 'ios') as 'ios' | 'android';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..', '..', '..');
const OUT = join(ROOT, 'library', 'phd', 'scrollable-collage', P, 'drafts', '20261105-165222');
const IOS = P === 'ios', AND = P === 'android';
const paid = IOS ? 'Pro' : 'Pro';
const REASON = 'New table (PM + Design Figma 2026-11-05)';
const PMONLY = 'PM-only: no Design frame yet (Design 2026-10-29)';
const phone = IOS ? 'iPhone' : 'Android phone';

// ---------------------------------------------------------------- requirements
type Req = { id: string; sec: string; src: string; text: string; plat?: 'ios' | 'android' };
const R: Req[] = [];
let rn = 0;
const req = (sec: string, src: string, text: string, plat?: 'ios' | 'android') => { const id = `R-${String(++rn).padStart(3, '0')}`; R.push({ id, sec, src, text, plat }); return id; };
const PMF = 'https://www.figma.com/design/zrl1BBEyqTvdLfjtaT8g6I/Collage?node-id=';
const arrowReq = (sec: string, node: string, edge: string, exp: string) => req(sec, `DS: flow arrow ${node} ${PMF}${node.replace(':', '-')}`, `${edge}: ${exp}`);

const S1 = 'Entry', S2 = 'Template Page', S3 = 'Template Preview', S4 = 'Canvas', S5 = 'Photo import', S6 = 'Frame focus',
  S7 = 'Image focus and tools', S8 = 'Swap and frame styles', S9 = 'Lock', S10 = 'Add Layer', S11 = 'Background',
  S12 = 'Layers', S13 = 'Ratio', S14 = 'Pages', S15 = 'Leave and resume', S16 = 'Export and Save & Share', S17 = 'PRO content and IAP',
  S18 = 'Light and dark mode', S19 = 'Tracking', S20 = 'Android system Back';

// Entry
const rRoom = req(S1, 'PM:pm-header D0-03, D0-04; PM:pm-ui-1 D0-04, D1-16', 'Swipe Collage is a separate new room (not a new category inside Collage), entered from a banner at the top of the Collage room; the rest of the Collage room is unchanged');
const rBanner = req(S1, 'DS:design-light-entry 「Collage Room · banner (NEW)」 1:238; PM:pm-ui-1 D1-07', 'Entering the Collage room shows the banner 「Try Swipe Collage!」 with the line 「Create the perfect year-end recap post.」 at the top (PM mockup: 「Try Scrollable Collage!」 / 「Swipe-able multi-page collage」, Q-1)');
const rBannerStays = req(S1, 'PM:pm-ui-1 D1-07', 'The banner is shown every time the Collage room is entered; it is not removed after it was tapped');
const rDlRoom = req(S1, 'PM:pm-flow D1-09; PM:pm-ui-1 D1-09', 'Deeplink scrollable_collage opens the Template Page');
const rDlCat = req(S1, 'PM:pm-flow D1-09; PM:pm-ui-1 D2-07', 'Deeplink scrollable_collage with category_guid opens the Template Page on that category');
const rDlTpl = req(S1, 'PM:pm-flow D1-09; PM:pm-ui-1 D1-09', 'Deeplink scrollable_collage with template_guid opens that template\'s Template Preview directly');
const rNoShortcut = req(S1, 'PM:pm-header D0-04, D0-06, D1-08', 'This build has no Launcher shortcut for Swipe Collage (the shortcut is decided later)');
const rNoArtwork = req(S1, 'PM:pm-header D0-04; PM:pm-ui-4 D0-06', 'Swipe Collage projects and exports never appear in My AI Artwork');
const rNoCredit = req(S1, 'PM:pm-header D4-01; PM:pm-save-iap D4-01', 'Swipe Collage is not generative: it charges no credits and opens no new purchase item (SKU)');
const aBanner = arrowReq(S1, '2218:374', 'Collage Room banner → Template Page', 'tapping the banner opens the Template Page');
// Template Page
const rTplHead = req(S2, 'DS:design-light-entry 「Template Page · default (NEW)」 3:336', 'The Template Page has the title 「Swipe Collage」, a ‹ back button and category tabs (Design: 「Year End」, 「Category1」, 「Category2」)');
const rCats = req(S2, 'PM:pm-ui-1 D2-03, D2-07', 'There are 3–4 categories in the order the CMS sets, 「Year End」 first');
const rCatSwitch = req(S2, 'PM:pm-button-next-step D2-07', 'Tapping a category tab switches the list to that category\'s templates');
const rWaterfall = req(S2, 'PM:pm-ui-1 D1-01', 'Templates are shown as a waterfall (masonry) list');
const rCardLabel = req(S2, 'PM:pm-ui-1 D1-01; DS 3:336', 'Each card shows only the default photo count and page count, 「N photos · M pages」 (e.g. 「9 photos · 5 pages」), and no portrait / landscape label');
const rCardFirst = req(S2, 'PM:pm-ui-1 D2-08', 'Each card\'s thumbnail shows the template\'s first page');
const rCardSwipe = req(S2, 'PM:pm-ui-1 D2-08; PM:pm-button-next-step D2-08', 'Swiping a card to the right shows that template\'s next pages, as in SCRL (the list does not move)');
const rEastWest = req(S2, 'PM:pm-ui-1 F16; PM:pm-scrl', 'Templates have Eastern and Western thumbnails, one image per page, and every page is shown in the UI (which set a user sees: Q-3)');
const rNewTag = req(S2, 'PM:pm-ui-1 D2-03, D2-07', 'A template the CMS tags NEW shows a 「NEW」 tag');
const rProIcon = req(S2, 'PM:pm-ui-1 D3-02', 'A template the CMS sets to PRO (usageType purchase) shows a PRO icon at the top right of its card');
const rTwenty = req(S2, 'PM:pm-ui-1 F16; PM:pm-scrl', 'Day 1 has 20 templates in total across the categories');
const aTplBack = arrowReq(S2, '2218:398', 'Template Page ‹ → Collage Room', '‹ on the Template Page returns to the Collage room');
const aTile = arrowReq(S2, '2218:378', 'Template Page card → Template Preview', 'tapping a template card opens its Template Preview');
const aTileDl = arrowReq(S2, '2218:422', 'Template Page (opened by deeplink) card → Template Preview', 'a card on the deeplinked Template Page opens its Template Preview the same way');
// Template Preview
const rPrevHead = req(S3, 'DS:design-light-entry 「entry_launcher2」 18:386; PM:pm-ui-1 D1-02', 'Template Preview has the title 「Template」, the category name, the template\'s 「N photos · M pages」 and the button 「Use Template」');
const rPrevSwipe = req(S3, 'PM:pm-ui-1 D2-09; PM:pm-button-next-step D2-09', 'Swiping left / right on the preview moves page by page through the template');
const rPrevPro = req(S3, 'PM:pm-ui-1 D3-02', 'A PRO template shows the PRO icon on its Template Preview');
const rPrevFree = req(S3, 'PM:pm-ui-1 D3-04; PM:pm-save-iap D3-04', 'A Free user can open a PRO template with 「Use Template」 and edit it; the IAP page comes only at Export');
const rDefault = req(S3, 'PM:pm-ui-1 F1; PM:pm-scrl', 'The thumbnail and preview show the template\'s default layout, and 「Use Template」 opens the canvas in that same layout (background, frames, texts, photo slots)');
const aUse = arrowReq(S3, '2218:382', 'Template Preview 「Use Template」 → Canvas · default', '「Use Template」 opens the canvas with the template');
const aPrevBack = arrowReq(S3, '2218:402', 'Template Preview ‹ → Template Page', '‹ returns to the Template Page');
const aPrevBackDl = arrowReq(S3, '2218:426', 'Template Preview (opened by deeplink) ‹ → Template Page', '‹ returns to the Template Page');
// Canvas
const rMulti = req(S4, 'PM:pm-ui-2 D1-03; PM:pm-header D0-03', 'The canvas is one multi-page canvas: the view can be zoomed freely (pinch) and scrolled left / right across the pages');
const rBars = req(S4, 'DS 「canvas_default」 69:6711; PM:pm-ui-2 D1-04, D1-13', 'The canvas has 「Background」, 「Layers」, +, 「Ratio」 and 「Pages」 at the bottom and under them ✕, ↶ undo, ↷ redo and ✓; there is no top bar (the PM mockups put ‹ and 「Export」 at the top: Q-20)');
const rHoles = req(S4, 'PM:pm-ui-2 F2; PM:pm-scrl', 'Every empty-looking slot is an add-image frame showing +');
const rUndo = req(S4, 'PM:pm-ui-2 D1-13; PM:pm-button-next-step D1-13', 'Undo / redo cover every operation on the canvas (import, move, resize, swap, delete, duplicate, lock, frame style, background, ratio, Pages changes once applied, Removal / Enhance results)');
const rEditEl = req(S4, 'PM:pm-ui-2 D1-04', 'Every element can be adjusted: a text\'s colour, content and font, and an image\'s position');
const rResize = req(S4, 'PM:pm-ui-2 F3; PM:pm-scrl', 'A frame can be resized on the canvas');
const rCentre = req(S4, 'PM:pm-ui-2 F13; PM:pm-scrl', 'An element belongs to the page that holds its centre and moves with that page when pages are reordered; an element that spans two pages still spans pages after the move');
// Photo import
const rPlus = req(S5, 'PM:pm-flow F4; PM:pm-button-next-step F4', 'Tapping a frame\'s + opens the photo picker (the Collage photo picker)');
const rPicker = req(S5, 'DS 「photo_picker」 23:531', 'The photo picker shows 「Please select 3 photos to continue.」 and a counter 「(3/3)」 for a template with 3 empty frames, with the tabs 「Photo」 and 「Stock」 and the albums (PM mockup: 「Select up to 3 photos」, 「Done (2)」; Q-4)');
const rLimit = req(S5, 'PM:pm-ui-4 D2-06; PM:pm-scrl', 'One import takes at most as many photos as there are empty frames on the canvas right now, and never more than 20 on both platforms (Android is not held to its default 6)');
const rFewer = req(S5, 'PM:pm-ui-2 F4; PM:pm-scrl', 'One photo or several can be imported in one go (fewer than the empty frames is allowed; Q-4)');
const rFill = req(S5, 'PM:pm-ui-4 F4; PM:pm-button-next-step F4', 'Confirming the picker (Design: the orange ✓ beside the counter; PM: 「Done」) fills the empty frames in order (left → right, top → bottom, page by page) and returns to the canvas; the picked photos show in a tray at the bottom');
const aPlus = arrowReq(S5, '2218:386', 'Canvas frame + → Photo Picker', 'the frame\'s + opens the photo picker');
const aDone = arrowReq(S5, '2218:390', 'Photo Picker Done → Canvas · image_focus', 'Done returns to the canvas with the photos placed');
const aPickBack = arrowReq(S5, '2218:410', 'Photo Picker ‹ → Canvas · default', '‹ in the picker returns to the canvas with nothing imported');
// Frame focus
const rFocus = req(S6, 'PM:pm-ui-2 F6; PM:pm-scrl; DS note on 「canvas_img_focus」', 'Tapping a frame selects the frame (frame focus); tapping it again selects its image (image focus); tapping in image focus goes back to frame focus');
const rFrameTools = req(S6, 'DS 「canvas_frame_focus」 33:2230; PM:pm-ui-2 F9', 'Frame focus shows the frame tools 「Opacity」, 「Shadow」, 「Flip H」, 「Flip V」, 「Duplicate」, 「Lock」 and Delete (the whole frame)');
const rFloat = req(S6, 'PM:pm-ui-2 F7, D1-32; PM:pm-scrl', 'Frame focus shows floating buttons Delete, Duplicate and Lock (icons) at the frame');
const rFrameDel = req(S6, 'PM:pm-button-next-step F9; PM:pm-ui-2 F9', 'Delete in frame focus removes the whole frame with its photo');
const rFrameDup = req(S6, 'PM:pm-button-next-step F9', 'Duplicate in frame focus adds a copy of the frame (with its photo)');
const rFrameFlip = req(S6, 'PM:pm-button-next-step F9', 'Flip H / Flip V in frame focus flip the frame at once');
const rOpacity = req(S6, 'PM:pm-draft-tbd TBD-1; PM:pm-button-next-step F9', 'Opacity and Shadow open the Collage room\'s Opacity / Shadow sliders and change the frame (PM proposal, TBD-1: Q-6)');
const rSelOps = req(S6, 'PM:pm-ui-2 D1-05', 'A selected element can be deleted, duplicated or locked');
// Image focus
const rImgTools = req(S7, 'DS 「canvas_img_focus」 28:1621; PM:pm-ui-2 F8, D1-35', 'Image focus shows one horizontally scrolling feature bar: 「Replace」, 「Flip H」, 「Flip V」, 「Adjust」, 「Filter」, 「Removal」, 「Enhance」 (the Design spells 「Fliter」: Q-7), with 「Image selected」');
const rReplace = req(S7, 'PM:pm-button-next-step F8', '「Replace」 opens the photo picker and the chosen photo replaces the frame\'s photo');
const rImgFlip = req(S7, 'PM:pm-button-next-step F8', '「Flip H」 / 「Flip V」 in image focus flip the image inside its frame at once');
const rAdjFil = req(S7, 'PM:pm-button-next-step F8; PM:pm-ui-2 F8, D1-35', '「Adjust」 and 「Filter」 work as in the Collage room and change only the focused image');
const rImgDel = req(S7, 'PM:pm-ui-2 F8; PM:pm-scrl', 'Delete in image focus removes the photo: the frame becomes empty and shows the + add-image icon again');
const rPremTag = req(S7, 'PM:pm-ui-2 D3-01; PM:pm-save-iap D3-01; PM:pm-flow D3-01', '「Removal」 and 「Enhance」 carry a premium (PRO) tag in the feature bar');
const rApplyPaid = req(S7, 'PM:pm-flow D1-11; PM:pm-ui-2 D1-11', 'A Pro user who applies (✓) Removal or Enhance gets the result in place of the frame\'s photo, back on the canvas in image focus; it can be undone and is not saved to the photo album');
const rCancelRoom = req(S7, 'PM:pm-flow D1-11', '✕ in Removal / Enhance applies nothing and returns to the canvas');
const rApplyFree = req(S7, 'PM:pm-flow D3-01, D1-43; PM:pm-ui-2 D3-01', 'A Free user who applies (✓) Removal or Enhance gets the existing IAP page (「PhotoDirector Premium」); nothing is applied');
const rGateRoom = req(S7, 'PM:pm-ui-4 D3-01; PM:pm-save-iap D3-01', 'Removal / Enhance are gated when applied in their room, never again at Export');
const aRem = arrowReq(S7, '2315:505', 'Canvas · image_focus 「Removal」 → Object Removal', '「Removal」 opens the Object Removal room with the focused photo');
const aRemIap = arrowReq(S7, '2315:509', 'Object Removal ✓ (Free) → IAP page', 'a Free user\'s apply opens the IAP page');
const aRemOk = arrowReq(S7, '2315:513', 'Object Removal ✓ (Pro) → Canvas · image_focus', 'the removal result replaces the photo on the canvas');
const aRemX = arrowReq(S7, '2315:517', 'Object Removal ✕ → Canvas · image_focus', 'nothing applied, back to the canvas');
const aRemIapX = arrowReq(S7, '2315:521', 'IAP page ✕ → Object Removal', 'closing the IAP page returns to the Object Removal room');
const aEnh = arrowReq(S7, '2315:660', 'Canvas · image_focus 「Enhance」 → AI Enhance', '「Enhance」 opens the AI Enhance room with the focused photo');
const aEnhIap = arrowReq(S7, '2315:664', 'AI Enhance ✓ (Free) → IAP page', 'a Free user\'s apply opens the IAP page');
const aEnhOk = arrowReq(S7, '2315:668', 'AI Enhance ✓ (Pro) → Canvas · image_focus', 'the enhanced photo replaces the photo on the canvas');
const aEnhX = arrowReq(S7, '2315:672', 'AI Enhance ✕ → Canvas · image_focus', 'nothing applied, back to the canvas');
const aEnhIapX = arrowReq(S7, '2315:676', 'IAP page ✕ → AI Enhance', 'closing the IAP page returns to the AI Enhance room');
// Swap and frame styles
const rSwap = req(S8, 'PM:pm-ui-2 F5; PM:pm-scrl; PM:pm-button-next-step F5', 'Long-pressing an image and dropping it on another frame swaps the two photos (PM mockup hint 「Long press & drag to swap」)');
const rSwapIn = req(S8, 'PM:pm-ui-2 D1-20', 'Inside a multi-photo frame, long-pressing an image and dropping it on another cell of the same frame swaps the two');
const rKinds = req(S8, 'PM:pm-ui-2 D1-19; PM:pm-ui-3 D1-19', 'Frames are single-photo (e.g. polaroid) or multi-photo (e.g. film strip)');
const rSwitchEntry = req(S8, 'PM:pm-ui-2 D1-21; PM:pm-draft-tbd TBD-2', 'The frame style is switched from the frame toolbar (a 「Frame」 tool, TBD-2: Q-8), not by dragging');
const rToMulti = req(S8, 'PM:pm-ui-2 D1-21', 'Switching a single-photo frame to a multi-photo one puts the photo in the first cell (left → right, top → bottom); the other cells show + add image');
const rToSingle = req(S8, 'PM:pm-ui-2 D1-22', 'Switching a multi-photo frame to a single-photo one keeps the first photo and deletes the rest');
const rToFewer = req(S8, 'PM:pm-ui-2 D1-22', 'Switching a multi-photo frame to one with fewer cells (N) keeps the first N photos in left → right, top → bottom order and deletes the rest');
const rNoBack = req(S8, 'PM:pm-ui-2 D1-22', 'Photos deleted by a frame switch do not come back when switching back to a multi-photo frame; only undo / redo bring them back');
// Lock
const rFLockMove = req(S9, 'PM:pm-ui-4 D1-33; PM:pm-scrl', 'A locked frame cannot be dragged, resized or rotated on the canvas; focus shows 「Frame locked」');
const rFLockBar = req(S9, 'PM:pm-ui-4 D1-33; PM:pm-button-next-step D1-33', 'A locked frame in focus still shows its feature bar, with every tool disabled except 「Duplicate」, 「Unlock」 and 「Delete」');
const rFLockFloat = req(S9, 'PM:pm-ui-4 D1-33, D1-32', 'A locked frame shows the floating buttons Delete, Duplicate and Unlock');
const rILockMove = req(S9, 'PM:pm-ui-4 D1-34; PM:pm-scrl', 'A locked image cannot be dragged or zoomed inside its frame; focus shows 「Image locked」');
const rILockBar = req(S9, 'PM:pm-ui-4 D1-34, D1-35; PM:pm-button-next-step D1-34', 'A locked image in focus still shows the one feature bar, with every tool disabled except 「Unlock」 and 「Delete」; its floating buttons are Delete, Duplicate and Unlock');
const rUnlock = req(S9, 'PM:pm-ui-4 D1-32; PM:pm-button-next-step D1-32', 'Unlock (floating or toolbar) makes the frame / image editable again and returns to normal focus');
const rLockPages = req(S9, 'PM:pm-ui-4 D1-33; PM:pm-ui-3 D1-39, D1-33', 'Deleting a page or reducing pages in Pages deletes the locked frames on it too');
// Add Layer
const rAddLayer = req(S10, 'DS 「Add Layer」 frame 49:1511; PM:pm-ui-3 F11', '+ opens 「Add Layer」 with five functions 「Image」, 「Text」, 「Sticker」, 「Frame」, 「Text Bubble」, and nothing for video, files, grids, shapes or drawing');
const rAddImg = req(S10, 'PM:pm-button-next-step D1-42; PM:pm-draft-tbd TBD-5', '「Image」 opens the photo picker; the chosen photo is added to the canvas as a new single-photo frame holding it (TBD-5: Q-9)');
const rAddText = req(S10, 'PM:pm-flow D1-14, D1-42; DS 「2_add_text」 54:1487', '「Text」 opens the Collage text input with the keyboard; finishing adds the text to the canvas');
const rAddSticker = req(S10, 'PM:pm-flow D1-14, D1-42; DS 「3_Add_Sticker」 54:1835', '「Sticker」 opens the Edit Room sticker panel; tapping a sticker adds it to the canvas');
const rAddFrame = req(S10, 'PM:pm-ui-3 D1-14, D1-42, D1-19, F2; DS 「4_frame」 54:2110', '「Frame」 opens the new Frame panel: square thumbnails, each labelled with how many photos it holds (「1 photo」, 「3 photos」); tapping one adds that frame to the canvas');
const rFrameTags = req(S10, 'PM:pm-ui-3 D2-07, D3-02, F17', 'Frames are new CMS content (single- or multi-photo masks); NEW frames show a 「NEW」 tag and PRO frames a PRO icon');
const rAddBubble = req(S10, 'PM:pm-flow D1-14, D1-42; DS 「5_Text_bubble」 54:2359', '「Text Bubble」 opens the Edit Room Text Bubble panel; tapping a bubble adds it to the canvas');
const rReuseCms = req(S10, 'PM:pm-ui-1 D1-14; PM:pm-ui-3 D1-14', 'Text, fonts, text styles, text bubbles and stickers are the existing Edit Room panels and CMS content; frames and background textures are the only new content');
const aAImg = arrowReq(S10, '2315:303', 'Add Layer 「Image」 → Photo Picker', 'opens the photo picker');
const aAText = arrowReq(S10, '2315:307', 'Add Layer 「Text」 → Text input', 'opens the Collage text input');
const aASticker = arrowReq(S10, '2315:311', 'Add Layer 「Sticker」 → Sticker panel', 'opens the Edit Room sticker panel');
const aAFrame = arrowReq(S10, '2315:315', 'Add Layer 「Frame」 → Frame Panel', 'opens the Frame panel');
const aABubble = arrowReq(S10, '2315:319', 'Add Layer 「Text Bubble」 → Text Bubble panel', 'opens the Edit Room Text Bubble panel');
const aAPhoto = arrowReq(S10, '2315:323', 'Photo Picker photo → Canvas · default', 'the picked photo appears on the canvas');
const aATextDone = arrowReq(S10, '2315:345', 'Text input Done → Canvas · default', 'the new text appears on the canvas');
const aAStickerOk = arrowReq(S10, '2315:349', 'Sticker panel item → Canvas · default', 'the sticker appears on the canvas');
const aAFrameOk = arrowReq(S10, '2315:353', 'Frame panel item → Canvas · default', 'the frame appears on the canvas');
const aABubbleOk = arrowReq(S10, '2315:357', 'Text Bubble panel item → Canvas · default', 'the text bubble appears on the canvas');
// Background
const rBgPanel = req(S11, 'DS 「background_panel_solid」 69:6938, 「background_panel_texture」 72:1505; PM:pm-ui-2 F10', '「Background」 opens a panel with the tabs 「Solid」 and 「Texture」; Solid offers plain colours only, no gradients');
const rSwatches = req(S11, 'PM:pm-ui-2 D1-23', 'Solid shows 32 colour swatches (8 × 4, defined by the content team); tapping one sets the canvas background colour');
const rCustom = req(S11, 'PM:pm-ui-2 D1-23', 'Custom color opens a colour picker like the Text color picker: a saturation / brightness square, a hue bar and an eyedropper');
const rDropper = req(S11, 'PM:pm-ui-2 D1-23; PM:pm-button-next-step D1-23', 'The eyedropper picks a colour from the canvas');
const rCancelDone = req(S11, 'DS 「background_panel_solid」 72:1786; PM:pm-ui-2 D1-23', 'In the colour picker 「Cancel」 applies nothing and 「Done」 sets the picked colour as the background');
const rTexture = req(S11, 'PM:pm-ui-2 D1-17; PM:pm-ui-1 D1-17; PM:pm-scrl', 'Texture tab: tapping a texture sets it as the background; textures tile seamlessly (loop) over the whole canvas and every page');
const rTexTags = req(S11, 'PM:pm-ui-2 D3-02; PM:pm-save-iap D3-02', 'Some textures are PRO (set in the CMS) and show a PRO icon; new ones show 「NEW」');
const rSheetX = req(S11, 'PM:pm-draft-tbd TBD-4; PM:pm-button-next-step F10, D1-31, D1-37, D1-42', 'The Background, Layers and Ratio sheets end with ✕ and ✓ (Design): ✓ keeps the changes made in the sheet and ✕ drops them (TBD-4 proposes that ✕ keeps them: Q-10)');
// Layers
const rLayers = req(S12, 'DS 「Layers」 73:2199; PM:pm-ui-3 D1-31', '「Layers」 opens the layer list (as SCRL): each layer\'s thumbnail sits on a transparency checkerboard, with ⋯ on the left and ≡ on the right');
const rLayerMenu = req(S12, 'PM:pm-ui-3 D1-31, D1-32; DS 73:2199', '⋯ on a layer opens 「Delete」, 「Duplicate」 and 「Lock」, each with an icon; a locked layer shows 「Unlock」 instead of 「Lock」');
const rLayerDrag = req(S12, 'PM:pm-ui-3 D1-31; PM:pm-draft-tbd TBD-3', 'Holding ≡ and dragging a layer changes its front / back order on the canvas (TBD-3: Q-11)');
// Ratio
const rRatios = req(S13, 'PM:pm-ui-3 D2-02, F12; PM:pm-scrl; PM:pm-competitor F12; DS 「Ratio」 74:2830', '「Ratio」 offers the canvas page ratios 1:1, 4:5, 5:4, 3:4, 4:3, 9:16 and 16:9 (the Design frame shows 「Custom」, 「Original」, 「Squre」, 「2:3」, 「3:2」, 「3:4」: Q-2)');
const rRatioUi = req(S13, 'PM:pm-ui-3 D1-37', 'The ratio choices use the PhD Crop / AI Expand icons with the numbers');
const rLongSide = req(S13, 'PM:pm-ui-3 D1-36', 'The canvas defaults to a 1080 px short side; a ratio change changes only the long side');
const rGrow = req(S13, 'PM:pm-ui-3 F12; PM:pm-scrl', 'On a ratio change the elements do not move: the canvas grows downward or shrinks upward');
const rNoExpand = req(S13, 'PM:pm-ui-3 D1-06', 'The Ratio panel shows no AI Expand promotion');
// Pages
const rPagesView = req(S14, 'PM:pm-ui-3 D1-38; DS 「page」 74:3076', '「Pages」 opens a view that previews the pages joined together, with only a thin line between pages');
const rPagesStart = req(S14, 'PM:pm-ui-3 D1-41; PM:pm-draft-tbd TBD-8; DS 74:3076', 'Pages opens on the page the canvas showed before; a small text shows the selected page as 「Page n / total」 (e.g. 「Page 5 / 5」)');
const rMinMax = req(S14, 'PM:pm-ui-3 D1-12; PM:pm-ui-1 D1-12', 'A canvas has at least 1 and at most 10 pages');
const rAddPage = req(S14, 'PM:pm-ui-3 D1-28, D1-29', 'The + in the thumbnail row and the bottom − / + add or remove a page at the end; after adding, the view scrolls to the last page');
const rMax = req(S14, 'PM:pm-ui-3 D1-12, D1-27; DS 「icons」 btn_add_page / page_stepper plus_disable', 'At 10 pages the thumbnail-row +, the bottom + and 「Duplicate page」 are unavailable (drawn disabled)');
const rMin = req(S14, 'PM:pm-ui-3 D1-12, D1-29; DS page_stepper minus_disable', 'At 1 page 「Delete page」 and the bottom − are unavailable (drawn disabled)');
const rPageMenu = req(S14, 'PM:pm-ui-3 D1-27', '••• on a page opens 「Duplicate page」 (the copy goes right after the original) and 「Delete page」 (deletes with no confirmation)');
const rReorder = req(S14, 'PM:pm-ui-3 D1-25, F13', 'Holding ≡ and dragging a page enlarges its thumbnail half-transparent, the other pages make room, and releasing reorders; the hint reads 「Hold ≡ & drag to reorder」; a plain tap on ≡ does nothing');
const rSelPage = req(S14, 'PM:pm-ui-3 D1-26, D1-30', 'Tapping a page thumbnail selects that page; elements cannot be edited in Pages');
const rDelPage = req(S14, 'PM:pm-ui-3 D1-39, D1-33; PM:pm-draft-tbd TBD-6', 'Deleting a page deletes everything on it, locked elements included (an element crossing into the page: Q-12)');
const rPagesOk = req(S14, 'PM:pm-ui-3 D1-40, D1-24, D1-26', 'Pages has no undo / redo; ✓ applies the page changes and returns to the canvas on the selected page');
const rPagesX = req(S14, 'PM:pm-ui-3 D1-24', '✕ discards every page change of this visit and returns to the canvas; when something changed it first asks 「Discard changes?」 with 「Discard」 and 「Keep」');
const rIconStates = req(S14, 'DS 「Dark mode · Canvas icon buttons」 116:3010, 「Light mode · Canvas icon buttons」 130:3237', 'The page move (≡), page more (•••), add page and page stepper buttons are drawn in normal, pressed, selected and disabled states; the empty photo slot is the import (+) slot');
// Leave and resume
const rCanvasBack = req(S15, 'PM:pm-leave-resume D1-10; PM:pm-flow D1-10', '✕ at the bottom left of the canvas (PM: ‹) asks 「Discard changes?」 with 「Discard」 and 「Keep」 (as Edit Room); 「Discard」 returns to Template Preview (Q-20)');
const rKeep = req(S15, 'PM:pm-leave-resume D1-10', '「Keep」 closes the dialog and stays on the canvas with every edit');
const rKilled = req(S15, 'PM:pm-leave-resume D1-10', 'When the app is killed while editing, the next launch asks 「Continue editing?」 (copy and buttons as Edit Room); continuing reopens the canvas with the edits');
const rLatest = req(S15, 'PM:pm-leave-resume D1-18', 'Only the latest editing session can be restored');
const aCanvasBack = arrowReq(S15, '2218:406', 'Canvas ‹ → Template Preview (after Discard)', 'after 「Discard」 the Template Preview of the same template shows');
const aFocusBack = arrowReq(S15, '2218:414', 'Canvas · image_focus ‹ → Template Preview (after Discard)', '‹ in image focus asks the same dialog and Discard returns to Template Preview');
// Export
const rExport = req(S16, 'PM:pm-flow D1-04, D2-05; PM:pm-button-next-step D2-05', '✓ at the bottom right of the canvas (PM: 「Export」) opens the 「Save & Share」 page (Q-20)');
const rPerPage = req(S16, 'PM:pm-ui-4 D2-01; PM:pm-header D0-03', 'Export cuts the canvas into one image per page');
const rSaveMulti = req(S16, 'PM:pm-save-page 11/3; DS 「Save」 45:723', 'For more than one page, 「Save & Share」 shows 「N images in this set」, 「Swipe to view」, a 「1/N」 counter and a swipeable preview, with no thumbnail strip');
const rSaveBtns = req(S16, 'PM:pm-save-page 11/3', 'For more than one page the orange button reads 「Save all N images」 and saves every image; below it an outline button 「Save this image」 saves only the image shown in the preview (Design 10/29 「Save this image only」: the PM 11/3 update is newer)');
const rSaveOne = req(S16, 'PM:pm-save-page 11/3; DS 「Save: Only 1 img」 103:5778', 'For a single page there is one orange button 「Save」');
const rAlbum = req(S16, 'PM:pm-ui-4 D2-05; PM:pm-flow D2-05', 'Saving all writes the N images at once to the 「PhotoDirector」 album');
const rShare = req(S16, 'PM:pm-save-page 11/3; DS 103:5778; PM:pm-ui-4 D2-05', '「Share to」 lists Instagram, Facebook, Twitter, Line and Tiktok; a share carries all N images when the app accepts several, else only opens the app');
const rQuality = req(S16, 'PM:pm-ui-4 D2-04; PM:pm-draft-tbd TBD-7', 'The exported resolution follows the Image Quality setting, applied to each image\'s long side (TBD-7 proposes a fixed 1200 px short side: Q-13)');
const rNoWm = req(S16, 'PM:pm-ui-4 D3-03; PM:pm-save-iap D3-03', 'Exported images carry no watermark');
const rNoRate = req(S16, 'PM:pm-ui-4 D3-05; PM:pm-save-iap D3-05', 'No rating dialog appears after saving');
const rMightLike = req(S16, 'DS 「Save: Only 1 img」 103:5778; PM:pm-competitor D5-01', 'The single-page Save & Share page shows 「You might also like」 as the Design draws (PM says similar templates are not Day-1: Q-14)');
const aExport = arrowReq(S16, '2218:394', 'Canvas 「Export」 → Save & Share', 'Export opens the Save & Share page');
const aSaveBack = arrowReq(S16, '2218:418', 'Save & Share ‹ → Canvas · image_focus', '‹ returns to the canvas with every edit kept');
// PRO and IAP
const rProExport = req(S17, 'PM:pm-ui-4 D3-04; PM:pm-save-iap D3-04; PM:pm-ui-1 D3-04', 'A Free user who used PRO content (template, frame or texture) gets the IAP page on 「Export」, with 「Paid style applied」; a Pro user exports with no IAP page');
const rEvery3 = req(S17, 'PM:pm-ui-4 D3-03, D3-05; PM:pm-save-iap D3-05', 'A Free user gets the IAP page on every 3rd save; saves are counted per export, not per image');
const rProContent = req(S17, 'PM:pm-save-iap D3-02', 'Templates, frames and textures can be PRO only through the CMS; everything else is free');
const rIapPage = req(S17, 'PM:pm-ui-4; PM:pm-button-next-step D3-03; DS 「B (mimic VVG/ Beauty plus)」 103:6032', 'The IAP page is the existing 「PhotoDirector Premium」 page, unchanged; its ✕ closes it (what Export does after a closed IAP page: Q-15)');
const rTiersIos = req(S17, 'KB: KP-013', 'On iOS both paid modes, Pro and Pro+, count as paid: no IAP page at Export or every 3rd save, and Removal / Enhance apply', 'ios');
// Appearance
const rModes = req(S18, 'DS: page 「20261029_Swipe Collage」 light set (x < 8000) and dark set (x ≥ 8396)', 'Every Swipe Collage screen has a light and a dark design; the app shows the version of the current appearance (Q-16)');
// Tracking
const rEvAppear = req(S19, 'PM:pm-tracking D1-15, D0-05', 'Opening the canvas sends the analytics event ScrollableCollage_Canvas_Appear with from (Collage_Banner / Deeplink) and template_guid (names tentative)');
const rEvExport = req(S19, 'PM:pm-tracking D1-15', 'Finishing an export sends the analytics event ScrollableCollage_Export_Done with template_guid, page_count, photo_count and ratio (names tentative)');
const rMetric = req(S19, 'PM:pm-tracking D0-02; PM:pm-header D0-02', 'Success metric: export completion = Export_Done users ÷ Canvas_Appear users — NOT TESTABLE: a product metric');
const rCmsBlock = req(S19, 'PM:pm-ui-1 D2-07; PM:pm-scrl', 'The CMS type string, contentVer and CMS sheet are not decided (MOCK_CMS_TYPE, MOCK_CMS_SHEET) — NOT TESTABLE: handoff blocker for RD (Q-17)');
// Android system Back
const rSysBack = AND ? req(S20, 'Rule: analysis.md pass 8 (REQ-051)', 'System Back on every Swipe Collage page, sheet, dialog and picker does what its own ‹ / ✕ / Cancel does (the canvas and Pages ask 「Discard changes?」 first; an open keyboard closes first)', 'android') : '';

// ---------------------------------------------------------------- rows
type Row = { key: string; sec: string; pre: string; act: string; exp: string; pri: string; refs: string[]; notes?: string; plat?: 'ios' | 'android' };
const rows: Row[] = [];
const row = (key: string, sec: string, pre: string, act: string | string[], exp: string, pri: string, refs: string[], notes = '', plat?: 'ios' | 'android') => {
  if (plat && plat !== P) return;
  const a = Array.isArray(act) ? (act.length > 1 ? act.map((s, i) => `${i + 1}. ${s}`).join('\n') : act[0]) : act;
  rows.push({ key, sec, pre, act: a, exp, pri, refs: refs.filter(Boolean), notes, plat });
};
const free = `${phone}, PhotoDirector signed in, Free tier`;
const pro = `${phone}, PhotoDirector signed in, ${paid} tier${IOS ? ' (Launcher › Pink › ☰ › [0] IAP › Status = Pro)' : ''}`;
const tpl = '「Year End」 template with several pages and empty photo frames (e.g. 「9 photos · 5 pages」)';
const canvas = (who = free) => `${who}; ${tpl} opened with 「Use Template」, canvas shown`;
const filled = (who = free) => `${canvas(who)}; every frame filled with photos (frame + › pick › Done)`;
const COL = 'Launcher › Collage';

// Entry
row('entry-banner', S1, free, `Open ${COL}`, 'The Collage room shows at its top the banner 「Try Swipe Collage!」 with 「Create the perfect year-end recap post.」; the rest of the Collage room looks as before (layouts, tabs, templates)', 'P1', [rBanner, rRoom], 'PM mockup copy differs (「Try Scrollable Collage!」): Design wins (Q-1)');
row('entry-tap', S1, free, [`Open ${COL}`, 'Tap the 「Try Swipe Collage!」 banner'], 'The Template Page opens with the title 「Swipe Collage」; it is a separate room, not a Collage category tab', 'P1', [aBanner, rRoom]);
row('entry-again', S1, free, [`Open ${COL}`, 'Tap the banner', 'Tap ‹ back twice to leave the Collage room', `Open ${COL} again`], 'The 「Try Swipe Collage!」 banner is still shown at the top', 'P2', [rBannerStays]);
row('entry-dl', S1, `${free}; a deeplink scrollable_collage (no parameters) sent to the phone (e.g. in Notes)`, 'Tap the deeplink', 'PhotoDirector opens on the Swipe Collage Template Page', 'P2', [rDlRoom], 'Deeplink format from RD (Q-17)');
row('entry-dl-cat', S1, `${free}; a deeplink scrollable_collage with the category_guid of a category other than 「Year End」`, 'Tap the deeplink', 'The Template Page opens with that category\'s tab selected and its templates listed', 'P2', [rDlCat]);
row('entry-dl-tpl', S1, `${free}; a deeplink scrollable_collage with a template_guid`, 'Tap the deeplink', 'That template\'s Template Preview opens directly (title 「Template」, 「Use Template」)', 'P2', [rDlTpl]);
row('entry-dl-tpl-back', S1, `${free}; opened a template\'s Template Preview from a deeplink with template_guid`, 'Tap ‹', 'The Swipe Collage Template Page shows', 'P3', [aPrevBackDl]);
row('entry-dl-tile', S1, `${free}; opened the Template Page from a deeplink scrollable_collage`, 'Tap a template card', 'Its Template Preview opens', 'P3', [aTileDl]);
row('entry-noshortcut', S1, free, 'Look through the Launcher and its shortcut list for a Swipe Collage entry', 'The Launcher has no Swipe Collage shortcut in this build', 'P3', [rNoShortcut]);
// Template Page
row('tpl-head', S2, `${free}; Template Page open (banner tapped)`, 'Look at the top of the page and the tabs', 'Title 「Swipe Collage」 with ‹; category tabs 3–4 long, 「Year End」 first (Design draws 「Year End」, 「Category1」, 「Category2」); 「Year End」 is selected', 'P1', [rTplHead, rCats]);
row('tpl-list', S2, `${free}; Template Page open on 「Year End」`, 'Scroll down the list', 'Templates are in a waterfall (masonry) list; each card shows only 「N photos · M pages」 (e.g. 「9 photos · 5 pages」) and no portrait / landscape label; each thumbnail shows the template\'s first page', 'P1', [rWaterfall, rCardLabel, rCardFirst]);
row('tpl-swipe', S2, `${free}; Template Page open`, 'Swipe one card to the right', 'The card shows the template\'s next page (and the next on further swipes); the list itself does not scroll', 'P2', [rCardSwipe, rEastWest]);
row('tpl-cat', S2, `${free}; Template Page open on 「Year End」`, 'Tap each other category tab in turn', 'Each tab shows its own templates; the selected tab is highlighted', 'P2', [rCatSwitch, rCats]);
row('tpl-tags', S2, `${free}; Template Page open`, 'Look at the cards of every category', 'Cards the CMS marks NEW show 「NEW」; PRO templates show a PRO icon at the top right of the card; free templates show neither', 'P2', [rNewTag, rProIcon]);
row('tpl-count', S2, `${free}; Template Page open`, 'Count the templates in every category tab', '20 templates in total on day 1', 'P3', [rTwenty], 'A template in two categories counts once; CMS content may change after launch');
row('tpl-eastwest', S2, `${free}; Template Page open; phone region and language Traditional Chinese (Taiwan)`, ['Note the thumbnails of the first 3 templates', 'Change the region and language to English (US)', 'Reopen the Template Page'], 'The thumbnails follow the Eastern / Western set of the locale (as PM answers Q-3); every page of a template has a thumbnail', 'P3', [rEastWest], 'Q-3: which thumbnail set a user sees');
row('tpl-back', S2, `${free}; Template Page open from the Collage banner`, 'Tap ‹', 'The Collage room shows again', 'P2', [aTplBack]);
row('tpl-open', S2, `${free}; Template Page open`, 'Tap a template card', 'Its Template Preview opens', 'P1', [aTile]);
// Template Preview
row('prev-head', S3, `${free}; a free 「9 photos · 5 pages」 template\'s Template Preview open`, 'Look at the page', 'Title 「Template」, the category 「Year End」, 「9 photos · 5 pages」 and the button 「Use Template」; the preview shows the template\'s default layout (Design draws 「9 photos · 5pages」 with no space: expect 「5 pages」)', 'P1', [rPrevHead, rDefault]);
row('prev-swipe', S3, `${free}; Template Preview of a 5-page template open`, ['Swipe left 4 times', 'Swipe right 4 times'], 'The preview moves one page per swipe through pages 1 to 5 and back', 'P1', [rPrevSwipe]);
row('prev-pro', S3, `${free}; Template Page open`, 'Tap a template that shows the PRO icon', 'Its Template Preview shows the PRO icon too, and 「Use Template」 is available', 'P2', [rPrevPro]);
row('prev-use', S3, `${free}; Template Preview of a free template open`, 'Tap 「Use Template」', 'The canvas opens with the same layout the preview showed (background, frames, texts) and empty frames showing +', 'P1', [aUse, rDefault, rHoles]);
row('prev-use-pro', S3, `${free}; Template Preview of a PRO template open`, 'Tap 「Use Template」 and edit one frame (import a photo)', 'The canvas opens and editing works with no IAP page', 'P1', [rPrevFree]);
row('prev-back', S3, `${free}; Template Preview open from the Template Page`, 'Tap ‹', 'The Template Page shows again on the same category', 'P2', [aPrevBack]);
// Canvas
row('cv-bars', S4, canvas(), 'Look at the top and bottom of the canvas', 'Bottom: 「Background」, 「Layers」, +, 「Ratio」, 「Pages」, and under them ✕, ↶, ↷, ✓; no top bar. Every empty slot shows +', 'P1', [rBars, rHoles]);
row('cv-scroll', S4, canvas(), ['Swipe left across the canvas to the last page', 'Pinch out to zoom in', 'Pinch in to zoom out'], 'The canvas scrolls page by page horizontally; the view zooms in and out freely, and the pages stay one continuous canvas', 'P1', [rMulti]);
row('cv-resize', S4, filled(), ['Tap a frame to focus it', 'Drag its corner handle outward'], 'The frame grows; the photo stays inside it', 'P2', [rResize, rEditEl]);
row('cv-text', S4, canvas(), ['Tap the template text 「a year in pictures」', 'Change its content, colour and font'], 'The text shows the new content, colour and font', 'P2', [rEditEl]);
row('cv-imgpos', S4, filled(), ['Tap a frame twice to focus its image', 'Drag the image inside the frame'], 'The image moves inside its frame', 'P2', [rEditEl, rFocus]);
row('cv-undo', S4, filled(), ['Move a frame, flip an image, change the background colour and delete a frame', 'Tap ↶ four times', 'Tap ↷ four times'], 'Each ↶ undoes one operation in reverse order back to the start; each ↷ redoes them in order', 'P1', [rUndo]);
row('cv-centre', S4, `${filled()}; a sticker placed so its centre is on page 2 and it overlaps page 3`, ['Open 「Pages」', 'Drag page 2 to the last position', 'Tap ✓'], 'The sticker moves with page 2 (the page that holds its centre) and still crosses into the neighbouring page', 'P2', [rCentre]);
// Photo import
row('imp-plus', S5, canvas(), 'Tap + in an empty frame', 'The photo picker opens with 「Please select 3 photos to continue.」, a 「(n/3)」 counter for the 3 empty frames left on the canvas, and the tabs 「Photo」 / 「Stock」', 'P1', [aPlus, rPlus, rPicker], 'The counter total is the empty-frame count of the canvas (Q-4)');
row('imp-limit', S5, `${canvas()}; 3 empty frames on the canvas`, ['Tap + in an empty frame', 'Pick 3 photos', 'Try to pick a 4th'], 'The 4th photo cannot be picked (the counter stops at 「(3/3)」)', 'P1', [rLimit]);
row('imp-fewer', S5, `${canvas()}; 3 empty frames on the canvas`, ['Tap + in an empty frame', 'Pick 2 photos', 'Tap the orange ✓ beside the counter'], 'The 2 photos fill the first 2 empty frames in order and the third frame stays empty with +', 'P1', [rFewer, rFill], 'Design copy 「Please select 3 photos to continue.」 may mean exactly 3 (Q-4)');
row('imp-fill', S5, `${canvas()}; empty frames on several pages`, ['Tap + in an empty frame', 'Pick photos A, B, C in that order', 'Tap the orange ✓ beside the counter'], 'The canvas shows again with A, B, C in the empty frames left → right, top → bottom, page by page', 'P1', [aDone, rFill]);
row('imp-20', S5, `${canvas()}; more than 20 empty frames (add frames with + › 「Frame」 until 21 are empty)`, ['Tap + in an empty frame', 'Pick photos until the picker stops'], 'The picker allows at most 20 photos', 'P2', [rLimit], AND ? 'Android is not held to the default 6 of other pickers' : '');
row('imp-android6', S5, `${canvas()}; 9 empty frames`, ['Tap + in an empty frame', 'Pick 9 photos'], 'All 9 can be picked (not limited to 6)', 'P2', [rLimit], '', 'android');
row('imp-back', S5, canvas(), ['Tap + in an empty frame', 'Pick one photo', 'Tap ‹'], 'The canvas shows with nothing imported', 'P2', [aPickBack]);
// Frame focus
row('ff-focus', S6, filled(), ['Tap a frame', 'Tap the same frame again', 'Tap it once more'], 'First tap: frame focus with the frame tools; second: image focus with 「Image selected」 and the image tools; third: back to frame focus', 'P1', [rFocus]);
row('ff-tools', S6, `${filled()}; a frame in frame focus`, 'Look at the feature bar and the frame', 'Feature bar: 「Opacity」, 「Shadow」, 「Flip H」, 「Flip V」, 「Duplicate」, 「Lock」 and Delete; floating Delete, Duplicate and Lock icons at the frame', 'P1', [rFrameTools, rFloat]);
row('ff-del', S6, `${filled()}; a frame in frame focus`, 'Tap the floating Delete', 'The whole frame and its photo disappear from the canvas', 'P1', [rFrameDel, rSelOps]);
row('ff-dup', S6, `${filled()}; a frame in frame focus`, 'Tap 「Duplicate」', 'A copy of the frame with the same photo appears next to it', 'P2', [rFrameDup, rSelOps]);
row('ff-dup-float', S6, `${filled()}; a frame in frame focus`, 'Tap the floating Duplicate', 'A copy of the frame appears, as with the toolbar 「Duplicate」', 'P3', [rFrameDup, rFloat]);
row('ff-flip', S6, `${filled()}; a frame in frame focus`, ['Tap 「Flip H」', 'Tap 「Flip V」'], 'The frame flips horizontally, then vertically, at once', 'P2', [rFrameFlip]);
row('ff-opacity', S6, `${filled()}; a frame in frame focus`, ['Tap 「Opacity」 and drag its slider to the middle', 'Tap 「Shadow」 and change it'], 'Each opens a slider like the Collage room\'s and the frame becomes half transparent / gets a shadow', 'P2', [rOpacity], 'PM proposal TBD-1 (Q-6)');
row('ff-lock', S6, `${filled()}; a frame in frame focus`, 'Tap 「Lock」', 'The frame is locked: 「Frame locked」 shows and the floating buttons become Delete, Duplicate, Unlock', 'P1', [rSelOps, rFLockMove, rFLockFloat]);
// Image focus
row('if-tools', S7, `${filled()}; an image in image focus`, 'Scroll the feature bar to its end', 'One bar scrolls horizontally: 「Replace」, 「Flip H」, 「Flip V」, 「Adjust」, 「Filter」, 「Removal」, 「Enhance」; 「Removal」 and 「Enhance」 carry a premium tag', 'P1', [rImgTools, rPremTag], 'Design spells 「Fliter」 (Q-7)');
row('if-replace', S7, `${filled()}; an image in image focus`, ['Tap 「Replace」', 'Pick another photo'], 'The new photo replaces the old one in the same frame', 'P1', [rReplace]);
row('if-flip', S7, `${filled()}; an image in image focus`, ['Tap 「Flip H」', 'Tap 「Flip V」'], 'The image flips horizontally, then vertically, inside its frame; the frame does not flip', 'P2', [rImgFlip]);
row('if-adjust', S7, `${filled()}; an image in image focus`, ['Tap 「Adjust」 and change brightness', 'Apply'], 'The tools are the Collage room\'s; only the focused image changes', 'P2', [rAdjFil]);
row('if-filter', S7, `${filled()}; an image in image focus`, ['Tap 「Filter」 and pick a filter', 'Apply'], 'Only the focused image gets the filter', 'P2', [rAdjFil]);
row('if-del', S7, `${filled()}; an image in image focus`, 'Tap Delete', 'The photo is removed; the frame stays, empty, with the + add-image icon', 'P1', [rImgDel, rSelOps]);
row('if-rem-open', S7, `${filled(pro)}; an image in image focus`, 'Tap 「Removal」', 'The Object Removal room opens with the focused photo', 'P1', [aRem]);
row('if-rem-ok', S7, `${filled(pro)}; Object Removal opened from image focus`, ['Mark an object and tap 「Remove」', 'Tap ✓'], 'The canvas shows in image focus with the result in place of the photo; ↶ brings the original back; the photo album has no new image', 'P1', [aRemOk, rApplyPaid, rGateRoom]);
row('if-rem-x', S7, `${filled(pro)}; Object Removal opened from image focus`, ['Mark an object and tap 「Remove」', 'Tap ✕'], 'The canvas shows the original photo, unchanged', 'P2', [aRemX, rCancelRoom]);
row('if-rem-free', S7, `${filled()}; Object Removal opened from image focus`, ['Mark an object and tap 「Remove」', 'Tap ✓'], 'The 「PhotoDirector Premium」 IAP page opens; nothing is applied to the canvas', 'P1', [aRemIap, rApplyFree]);
row('if-rem-iapx', S7, `${filled()}; the IAP page opened by ✓ in Object Removal`, 'Tap the IAP page\'s ✕', 'The Object Removal room shows again', 'P2', [aRemIapX, rIapPage]);
row('if-enh-open', S7, `${filled(pro)}; an image in image focus`, 'Tap 「Enhance」', 'The AI Enhance room opens with the focused photo', 'P1', [aEnh]);
row('if-enh-ok', S7, `${filled(pro)}; AI Enhance opened from image focus`, ['Tap 「Enhance」', 'Tap ✓'], 'The canvas shows in image focus with the enhanced photo; ↶ brings the original back; the photo album has no new image', 'P1', [aEnhOk, rApplyPaid], 'AI Enhance shows a credit price in its own room (as today); Swipe Collage itself charges nothing');
row('if-enh-x', S7, `${filled(pro)}; AI Enhance opened from image focus`, 'Tap ✕', 'The canvas shows the original photo, unchanged', 'P2', [aEnhX, rCancelRoom]);
row('if-enh-free', S7, `${filled()}; AI Enhance opened from image focus`, ['Tap 「Enhance」', 'Tap ✓'], 'The 「PhotoDirector Premium」 IAP page opens; nothing is applied', 'P1', [aEnhIap, rApplyFree]);
row('if-enh-iapx', S7, `${filled()}; the IAP page opened by ✓ in AI Enhance`, 'Tap the IAP page\'s ✕', 'The AI Enhance room shows again', 'P2', [aEnhIapX]);
row('if-rem-proplus', S7, `${phone}, PhotoDirector signed in, Pro+ tier (Launcher › Pink › ☰ › [0] IAP › Status = Pro+); ${tpl} opened, every frame filled; Object Removal opened from image focus`, ['Mark an object and tap 「Remove」', 'Tap ✓'], 'The result replaces the photo on the canvas; no IAP page', 'P2', [rTiersIos, rApplyPaid], '', 'ios');
// Swap and frame styles
row('sw-swap', S8, filled(), ['Long-press the photo in frame 1', 'Drag it onto frame 2 and release'], 'The photos of frame 1 and frame 2 swap places', 'P1', [rSwap]);
row('sw-in', S8, `${filled()}; a multi-photo frame (e.g. film strip) with photos in its cells`, ['Long-press the photo in cell 1', 'Drag it onto cell 2 of the same frame and release'], 'The two photos swap inside the frame', 'P2', [rSwapIn, rKinds]);
row('sw-entry', S8, `${filled()}; a frame in frame focus`, 'Look for the frame style tool and tap it', 'A frame style list opens from the frame toolbar (PM proposal: a first tool 「Frame」); the style changes by choosing, not by dragging', 'P2', [rSwitchEntry], 'TBD-2 (Q-8)');
row('sw-tomulti', S8, `${filled()}; a single-photo frame holding photo A in frame focus`, 'Switch its style to a 3-photo frame', 'Photo A is in the first cell (top-left); the other cells show + add image', 'P1', [rToMulti]);
row('sw-tosingle', S8, `${filled()}; a 3-photo frame holding A, B, C (reading order) in frame focus`, 'Switch its style to a single-photo frame', 'The frame holds A; B and C are gone', 'P1', [rToSingle]);
row('sw-tofewer', S8, `${filled()}; a 4-photo frame holding A, B, C, D (reading order) in frame focus`, 'Switch its style to a 2-photo frame', 'The frame holds A and B; C and D are gone', 'P2', [rToFewer]);
row('sw-noback', S8, `${filled()}; a 3-photo frame A, B, C switched to single (holds A)`, ['Switch it back to the 3-photo style', 'Tap ↶ until the frame shows A, B, C'], 'After switching back only A is there (the other cells show +); ↶ restores A, B, C', 'P2', [rNoBack, rUndo]);
// Lock
row('lk-frame', S9, `${filled()}; a frame locked (frame focus › 「Lock」)`, ['Try to drag the frame', 'Try to resize it with two fingers'], 'The frame does not move or change size', 'P1', [rFLockMove]);
row('lk-frame-bar', S9, `${filled()}; a locked frame in focus`, 'Tap each tool on its feature bar', '「Opacity」, 「Shadow」, 「Flip H」, 「Flip V」 are disabled and do nothing; 「Duplicate」, 「Unlock」 and Delete work', 'P2', [rFLockBar]);
row('lk-frame-dup', S9, `${filled()}; a locked frame in focus`, 'Tap the floating Duplicate', 'A copy of the frame appears (as for an unlocked frame)', 'P3', [rFLockFloat, rFLockBar]);
row('lk-frame-del', S9, `${filled()}; a locked frame in focus`, 'Tap the floating Delete', 'The locked frame is deleted', 'P2', [rFLockFloat]);
row('lk-image', S9, `${filled()}; an image in image focus`, ['Lock the image (floating Lock)', 'Try to drag and pinch the image'], '「Image locked」 shows; the image does not move or zoom', 'P1', [rILockMove, rSelOps]);
row('lk-image-bar', S9, `${filled()}; a locked image in focus`, 'Tap each tool on the feature bar and look at the floating buttons', 'Every tool except 「Unlock」 and 「Delete」 is disabled; the floating buttons are Delete, Duplicate and Unlock', 'P2', [rILockBar]);
row('lk-unlock', S9, `${filled()}; a locked frame and a locked image`, ['Tap Unlock on the frame', 'Drag the frame', 'Tap Unlock on the image', 'Drag the image'], 'After each Unlock the frame / image can be moved again and every tool is enabled', 'P1', [rUnlock]);
row('lk-pages', S9, `${filled()}; a locked frame on page 2`, ['Open 「Pages」', 'Delete page 2 (••• › 「Delete page」)', 'Tap ✓'], 'Page 2 and the locked frame on it are gone', 'P2', [rLockPages, rDelPage]);
// Add Layer
row('al-open', S10, canvas(), 'Tap + in the bottom bar', '「Add Layer」 opens with 「Image」, 「Text」, 「Sticker」, 「Frame」, 「Text Bubble」 only (no video, file, grid, shape or drawing)', 'P1', [rAddLayer]);
row('al-image', S10, `${canvas()}; Add Layer open`, ['Tap 「Image」', 'Pick one photo'], 'The photo picker opens; after picking, the canvas shows the photo as a new single-photo frame', 'P1', [aAImg, aAPhoto, rAddImg], 'TBD-5 (Q-9)');
row('al-text', S10, `${canvas()}; Add Layer open`, ['Tap 「Text」', 'Type 「Strong」', 'Tap Done'], 'The Collage text input opens with the keyboard; after Done the keyboard closes and the new text 「Strong」 is on the canvas', 'P1', [aAText, aATextDone, rAddText]);
row('al-sticker', S10, `${canvas()}; Add Layer open`, ['Tap 「Sticker」', 'Tap a sticker'], 'The Edit Room sticker panel opens (tabs such as 「Favorites」, 「AI Sticker」, 「Flower」, 「Holiday」); the sticker appears on the canvas', 'P1', [aASticker, aAStickerOk, rAddSticker, rReuseCms]);
row('al-text-style', S10, `${canvas()}; Add Layer › 「Text」 open with 「Strong」 typed`, ['Tap bold', 'Tap italic', 'Tap align left', 'Tap align center', 'Tap align right', 'Tap Done'], 'Each style applies to the text as in the Collage text input; the keyboard closes on Done and the styled text is on the canvas', 'P3', [rAddText, rEditEl]);
row('al-frame', S10, `${canvas()}; Add Layer open`, ['Tap 「Frame」', 'Tap a 「3 photos」 frame'], 'The Frame panel shows square thumbnails labelled 「1 photo」, 「3 photos」…; the chosen frame appears on the canvas with 3 empty cells showing +', 'P1', [aAFrame, aAFrameOk, rAddFrame, rKinds]);
row('al-frame-tags', S10, `${canvas()}; Frame panel open`, 'Look through the frames', 'New frames show 「NEW」; PRO frames show a PRO icon', 'P2', [rFrameTags]);
row('al-bubble', S10, `${canvas()}; Add Layer open`, ['Tap 「Text Bubble」', 'Tap a bubble'], 'The Edit Room Text Bubble panel opens; the bubble appears on the canvas', 'P1', [aABubble, aABubbleOk, rAddBubble, rReuseCms]);
row('al-bubble-none', S10, `${canvas()}; a text bubble added and focused, the Text Bubble panel open`, 'Tap the 「none」 (no bubble) choice', 'The bubble shape is removed and the text stays, as in Edit Room', 'P3', [rAddBubble, rReuseCms]);
// Background
row('bg-open', S11, canvas(), 'Tap 「Background」', 'A panel opens with the tabs 「Solid」 and 「Texture」, 「Solid」 selected, plain colours only (no gradients)', 'P1', [rBgPanel]);
row('bg-swatch', S11, `${canvas()}; Background › 「Solid」 open`, ['Count the swatches', 'Tap one swatch'], '32 swatches (8 × 4); the canvas background of every page takes the colour at once', 'P1', [rSwatches]);
row('bg-custom', S11, `${canvas()}; Background › 「Solid」 open`, 'Tap Custom color', 'A colour picker opens like the Text color picker: saturation / brightness square, hue bar, eyedropper, 「Cancel」 and 「Done」', 'P2', [rCustom]);
row('bg-done', S11, `${canvas()}; Background custom colour picker open`, ['Pick a colour on the hue bar and the square', 'Tap 「Done」'], 'The canvas background takes the picked colour', 'P2', [rCancelDone]);
row('bg-cancel', S11, `${canvas()}; Background custom colour picker open`, ['Pick a different colour', 'Tap 「Cancel」'], 'The background keeps its previous colour', 'P2', [rCancelDone]);
row('bg-dropper', S11, `${filled()}; Background custom colour picker open`, ['Tap the eyedropper', 'Tap a point of a photo on the canvas', 'Tap 「Done」'], 'The picked colour is the photo\'s colour at that point and becomes the background', 'P2', [rDropper]);
row('bg-texture', S11, `${canvas()}; Background panel open`, ['Tap 「Texture」', 'Tap a texture', 'Tap 「Solid」'], 'The texture fills the whole canvas and every page with no visible seam between pages or tiles; NEW / PRO textures are marked; 「Solid」 switches back to the swatches', 'P1', [rTexture, rTexTags]);
row('bg-ok', S11, `${canvas()}; Background panel open`, ['Tap a swatch', 'Tap the panel\'s ✓'], 'The panel closes and the new background stays', 'P1', [rSheetX]);
row('bg-x', S11, `${canvas()}; Background panel open`, ['Tap a swatch', 'Tap the panel\'s ✕'], 'The panel closes and the background goes back to what it was before the panel opened', 'P2', [rSheetX], 'TBD-4 proposes the opposite (Q-10)');
// Layers
row('ly-open', S12, `${filled()}; a sticker and a text added`, 'Tap 「Layers」', 'The layer list opens: each layer\'s thumbnail on a transparency checkerboard, ⋯ on the left, ≡ on the right', 'P1', [rLayers]);
row('ly-menu', S12, `${filled()}; Layers open`, ['Tap ⋯ on a layer', 'Tap 「Duplicate」', 'Tap ⋯ on a layer', 'Tap 「Lock」', 'Tap ⋯ on the locked layer'], '「Delete」, 「Duplicate」, 「Lock」 each with an icon; Duplicate adds a copy layer; after Lock the menu shows 「Unlock」 instead of 「Lock」', 'P1', [rLayerMenu]);
row('ly-del', S12, `${filled()}; Layers open`, ['Tap ⋯ on a sticker layer', 'Tap 「Delete」'], 'The layer leaves the list and the sticker leaves the canvas', 'P2', [rLayerMenu]);
row('ly-drag', S12, `${filled()}; Layers open; a sticker over a photo frame`, ['Hold ≡ of the sticker layer', 'Drag it below the frame layer', 'Release'], 'The order changes; on the canvas the sticker is now behind the frame', 'P2', [rLayerDrag], 'TBD-3 (Q-11)');
row('ly-ok', S12, `${filled()}; Layers open, a layer duplicated`, 'Tap the panel\'s ✓', 'The panel closes; the duplicate stays on the canvas', 'P2', [rSheetX]);
row('ly-x', S12, `${filled()}; Layers open, a layer duplicated`, 'Tap the panel\'s ✕', 'The panel closes; the duplicate is gone (Q-10)', 'P3', [rSheetX], 'TBD-4 proposes the opposite (Q-10)');
// Ratio
row('rt-open', S13, canvas(), 'Tap 「Ratio」', 'The Ratio panel lists 1:1, 4:5, 5:4, 3:4, 4:3, 9:16 and 16:9 with the PhD Crop icons and numbers, and no AI Expand promotion', 'P1', [rRatios, rRatioUi, rNoExpand], 'Design frame shows the Crop list (「Custom」, 「Original」, 「Squre」, 「2:3」, 「3:2」, 「3:4」): Q-2, check on device');
row('rt-change', S13, filled(), ['Note the position of each element', 'Tap 「Ratio」', 'Tap 9:16', 'Tap 1:1'], 'At 9:16 each page grows downward and at 1:1 shrinks upward; the width stays the same and no element moves', 'P1', [rGrow, rLongSide]);
row('rt-each', S13, canvas(), 'Tap each ratio in turn and export once at 4:5 and once at 16:9', 'Every ratio changes the page shape; the exported images have the chosen ratio with a 1080 px short side (subject to Q-13)', 'P2', [rRatios, rLongSide]);
row('rt-ok', S13, `${canvas()}; Ratio panel open, canvas at 1:1`, ['Tap 4:5', 'Tap the panel\'s ✓'], 'The panel closes and the canvas keeps 4:5', 'P2', [rSheetX]);
row('rt-x', S13, `${canvas()}; Ratio panel open, canvas at 1:1`, ['Tap 4:5', 'Tap the panel\'s ✕'], 'The panel closes and the canvas is 1:1 again (Q-10)', 'P3', [rSheetX], 'TBD-4 proposes the opposite (Q-10)');
// Pages
row('pg-open', S14, `${filled()}; the canvas shows page 3 of 5`, 'Tap 「Pages」', 'Pages opens with page 3 selected and 「Page 3 / 5」; the pages are joined with only a thin line between them', 'P1', [rPagesView, rPagesStart]);
row('pg-add', S14, `${canvas()}; Pages open with 5 pages`, ['Tap the + in the thumbnail row', 'Tap the bottom +', 'Tap the bottom −'], 'Each + adds a blank page at the end and scrolls to it (7 pages); − removes the last page (6 pages)', 'P1', [rAddPage]);
row('pg-max', S14, `${canvas()}; Pages open`, ['Tap + until there are 10 pages', 'Tap the bottom + and the row +', 'Tap ••• on a page'], 'At 10 pages the row +, the bottom + and 「Duplicate page」 are disabled; the count stays 10', 'P1', [rMax, rMinMax]);
row('pg-min', S14, `${canvas()}; Pages open`, ['Tap − until 1 page is left', 'Tap − again', 'Tap ••• on the page'], 'At 1 page the bottom − and 「Delete page」 are disabled; the page stays', 'P1', [rMin, rMinMax]);
row('pg-dup', S14, `${filled()}; Pages open with 5 pages`, ['Tap ••• on page 2', 'Tap 「Duplicate page」'], 'A copy of page 2 with all its elements appears right after page 2 (6 pages)', 'P1', [rPageMenu]);
row('pg-del', S14, `${filled()}; Pages open with 5 pages`, ['Tap ••• on page 2', 'Tap 「Delete page」'], 'Page 2 and everything on it are deleted at once with no confirmation (4 pages)', 'P1', [rPageMenu, rDelPage]);
row('pg-cross', S14, `${filled()}; a sticker whose centre is on page 2 and which reaches into page 3`, ['Open 「Pages」', 'Delete page 3', 'Tap ✓'], 'Per PM answer to Q-12 (proposal: an element touching the deleted page is deleted with it)', 'P3', [rDelPage], 'TBD-6 (Q-12)');
row('pg-drag', S14, `${filled()}; Pages open with 5 pages`, ['Hold ≡ of page 1', 'Drag it to the third position', 'Release'], 'While dragging the thumbnail is enlarged and half transparent and the others make room; after release page 1 is third; the hint 「Hold ≡ & drag to reorder」 is shown', 'P1', [rReorder]);
row('pg-tapdrag', S14, `${filled()}; Pages open`, 'Tap ≡ once (no hold)', 'Nothing happens', 'P3', [rReorder]);
row('pg-select', S14, `${filled()}; Pages open`, ['Tap the page 4 thumbnail', 'Try to drag a frame on it', 'Tap ✓'], 'Page 4 is selected (「Page 4 / 5」); its frames cannot be moved; ✓ returns to the canvas showing page 4', 'P1', [rSelPage, rPagesOk]);
row('pg-noundo', S14, `${filled()}; Pages open`, 'Look for ↶ / ↷', 'Pages shows no undo / redo', 'P3', [rPagesOk]);
row('pg-x-dialog', S14, `${filled()}; Pages open`, ['Delete one page', 'Tap ✕'], '「Discard changes?」 appears with 「Discard」 and 「Keep」', 'P1', [rPagesX]);
row('pg-x-discard', S14, `${filled()}; Pages open; one page deleted; 「Discard changes?」 shown`, 'Tap 「Discard」', 'The canvas shows all the pages as before', 'P1', [rPagesX]);
row('pg-x-keep', S14, `${filled()}; Pages open; one page deleted; 「Discard changes?」 shown`, 'Tap 「Keep」', 'Pages stays open with the page still deleted', 'P2', [rPagesX]);
row('pg-x-clean', S14, `${filled()}; Pages open, nothing changed`, 'Tap ✕', 'The canvas shows at once with no dialog', 'P2', [rPagesX]);
row('pg-states', S14, `${canvas()}; Pages open`, ['Press and hold ≡', 'Press and hold •••', 'Press and hold the row +', 'Tap + until there are 10 pages', 'Tap − until 1 page is left'], 'The buttons show their pressed states while held; at the limits the stepper\'s + (10) or − (1) and the row + are drawn disabled, as the Canvas icon button sheets draw', 'P3', [rIconStates]);
// Leave and resume
row('lv-back', S15, `${filled()}; one photo moved`, 'Tap ✕ at the bottom left of the canvas', '「Discard changes?」 appears with 「Discard」 and 「Keep」 (as in Edit Room)', 'P1', [rCanvasBack]);
row('lv-discard', S15, `${filled()}; 「Discard changes?」 shown after ✕`, 'Tap 「Discard」', 'The Template Preview of the same template shows; reopening it with 「Use Template」 gives a fresh canvas', 'P1', [aCanvasBack, rCanvasBack]);
row('lv-keep', S15, `${filled()}; 「Discard changes?」 shown after ✕`, 'Tap 「Keep」', 'The dialog closes and the canvas keeps every edit', 'P1', [rKeep]);
row('lv-focus', S15, `${filled()}; an image in image focus`, ['Tap ✕ at the bottom left', 'Tap 「Discard」'], 'The same 「Discard changes?」 dialog appears; Discard returns to the Template Preview', 'P2', [aFocusBack]);
row('lv-kill', S15, `${filled()}; edits made on several pages`, ['Swipe PhotoDirector away from the app switcher', 'Open PhotoDirector'], '「Continue editing?」 appears (as in Edit Room); continuing reopens the Swipe Collage canvas with every page and edit', 'P1', [rKilled]);
row('lv-latest', S15, `${free}; canvas A edited and left with ✕ › 「Discard」; canvas B (another template) edited; the app killed while canvas B is open`, ['Open PhotoDirector', 'Continue editing'], 'Only canvas B (the latest) is restored', 'P2', [rLatest]);
// Export
row('ex-open', S16, filled(), 'Tap ✓ at the bottom right of the canvas', 'The 「Save & Share」 page opens with 「5 images in this set」, 「Swipe to view」, 「1/5」, the preview, 「Save all 5 images」 (orange) and 「Save this image」 (outline) under it, and no thumbnail strip', 'P1', [aExport, rExport, rSaveMulti, rSaveBtns], 'Design 10/29 draws 「Save this image only」; PM 11/3 is newer');
row('ex-swipe', S16, `${filled()}; Save & Share open (5 pages)`, 'Swipe the preview left 4 times', 'The counter goes 「1/5」 … 「5/5」 and each preview is one page of the canvas', 'P1', [rPerPage, rSaveMulti]);
row('ex-saveall', S16, `${filled()}; Save & Share open (5 pages)`, ['Tap 「Save all 5 images」', 'Open the Photos / Gallery app'], 'The 「PhotoDirector」 album has 5 new images, one per page, in page order; no watermark on any; no rating dialog appears', 'P1', [rSaveBtns, rAlbum, rPerPage, rNoWm, rNoRate]);
row('ex-saveone', S16, `${filled()}; Save & Share open (5 pages), preview swiped to 「3/5」`, ['Tap 「Save this image」', 'Open the Photos / Gallery app'], 'Only page 3 is saved (one new image)', 'P1', [rSaveBtns]);
row('ex-single', S16, `${filled()}; the canvas reduced to 1 page in Pages`, 'Tap ✓ at the bottom right of the canvas', 'Save & Share shows one image and one orange 「Save」 only (no 「Save this image」, no counter), 「Share to」 and 「You might also like」', 'P1', [rSaveOne, rMightLike], 'Q-14 「You might also like」');
row('ex-share', S16, `${filled()}; Save & Share open (5 pages); Instagram, Facebook, Twitter, Line and Tiktok installed`, ['Tap Instagram', 'Go back to PhotoDirector', 'Tap Facebook', 'Go back to PhotoDirector', 'Tap Twitter', 'Go back to PhotoDirector', 'Tap Line', 'Go back to PhotoDirector', 'Tap Tiktok'], '「Share to」 lists Instagram, Facebook, Twitter, Line, Tiktok; each app opens with the 5 images when it takes several, otherwise the app just opens', 'P2', [rShare]);
row('ex-quality', S16, `${filled()}; Settings › Image Quality set to its highest value; canvas ratio 4:5`, ['Export and save all', 'Check one saved image\'s size in Photos / Gallery info'], 'The size follows the Image Quality setting on the long side (subject to Q-13)', 'P2', [rQuality, rLongSide], 'Q-13: Image Quality vs fixed short side');
row('ex-back', S16, `${filled()}; Save & Share open`, 'Tap ‹', 'The canvas shows with every edit kept', 'P2', [aSaveBack]);
row('ex-noartwork', S16, `${filled()}; images saved from Save & Share`, 'Open My AI Artwork', 'No Swipe Collage project or image is listed', 'P2', [rNoArtwork]);
row('ex-nocredit', S16, `${filled()}; credit balance noted (Mine › My Credits)`, ['Export and save all', 'Check the credit balance'], 'The balance is unchanged and no purchase was offered for the collage itself', 'P2', [rNoCredit]);
// PRO and IAP
row('iap-pro-free', S17, `${free}; a PRO template opened with 「Use Template」 and one frame filled`, 'Tap ✓ at the bottom right of the canvas', 'The IAP page opens with 「Paid style applied」 instead of Save & Share', 'P1', [rProExport, rPrevFree, rProContent]);
row('iap-frame-free', S17, `${canvas()}; a PRO frame added from Add Layer › 「Frame」`, 'Tap ✓ at the bottom right of the canvas', 'The IAP page opens with 「Paid style applied」', 'P1', [rProExport]);
row('iap-tex-free', S17, `${canvas()}; a PRO texture set as background`, 'Tap ✓ at the bottom right of the canvas', 'The IAP page opens with 「Paid style applied」', 'P1', [rProExport, rTexTags]);
row('iap-pro-paid', S17, `${pro}; a PRO template opened, a PRO frame and a PRO texture used`, ['Tap ✓ at the bottom right of the canvas', 'Tap 「Save all N images」'], 'Save & Share opens directly and the images save; no IAP page', 'P1', [rProExport]);
row('iap-proplus', S17, `${phone}, PhotoDirector signed in, Pro+ tier (Launcher › Pink › ☰ › [0] IAP › Status = Pro+); a PRO template opened`, 'Tap ✓ at the bottom right of the canvas and save', 'Save & Share opens and the images save; no IAP page', 'P2', [rTiersIos], '', 'ios');
row('iap-every3', S17, `${free}; a free template with 2 pages opened, frames filled; no PRO content`, ['Export and 「Save all 2 images」', 'Repeat the export and save twice more'], 'The first two saves go through; the third save opens the IAP page (counted per export, not per image: 4 images saved before it)', 'P1', [rEvery3]);
row('iap-every3-pro', S17, `${pro}; a free template opened, frames filled`, 'Export and save 3 times', 'No IAP page on any save', 'P2', [rEvery3]);
row('iap-x', S17, `${free}; the IAP page opened by 「Export」 with PRO content`, 'Tap the IAP page\'s ✕', 'The IAP page closes (canvas or Save & Share, as PM answers Q-15); the edits are kept', 'P2', [rIapPage], 'Q-15');
// Appearance
row('mode-light', S18, `${free}; the phone in Light appearance${IOS ? ' (Settings › Display & Brightness › Light)' : ' (Settings › Display › Light mode)'}`, ['Open the Collage room banner, Template Page, Template Preview and the canvas', 'Open Background, Layers, Ratio, Pages and Add Layer'], 'Every screen shows the light design (light surfaces, dark icons), as the Design\'s light set', 'P2', [rModes], 'Q-16: follows the system appearance?');
row('mode-dark', S18, `${free}; the phone in Dark appearance`, ['Open the Collage room banner, Template Page, Template Preview and the canvas', 'Open Background, Layers, Ratio, Pages and Add Layer'], 'Every screen shows the dark design (dark surfaces, light icons), as the Design\'s dark set', 'P2', [rModes], 'Q-16');
// Tracking
row('trk-appear', S19, `${free}; the app's analytics events visible (log pull or RD event viewer)`, ['Open the canvas from the Collage banner', 'Open the canvas from a deeplink with template_guid'], 'ScrollableCollage_Canvas_Appear is sent each time, with from = Collage_Banner, then from = Deeplink, and the template_guid', 'P3', [rEvAppear], 'Names tentative; parked until an event log is available');
row('trk-export', S19, `${free}; analytics events visible; a 3-page canvas at 4:5 with 4 photos`, 'Export and save all', 'ScrollableCollage_Export_Done is sent with template_guid, page_count = 3, photo_count = 4, ratio = 4:5', 'P3', [rEvExport], 'Names tentative; parked until an event log is available');
// Android system Back
if (AND) {
  const sb = (key: string, where: string, exp: string, refs: string[] = []) => row(key, S20, `${free}; ${where}`, 'Press system Back', exp, 'P2', [rSysBack, ...refs]);
  sb('sb-tplpage', 'Swipe Collage Template Page open', 'The Collage room shows (as ‹)');
  sb('sb-preview', 'Template Preview open', 'The Template Page shows (as ‹)');
  sb('sb-canvas', 'canvas open with one edit', '「Discard changes?」 appears (as ‹)', [rCanvasBack]);
  sb('sb-dialog', '「Discard changes?」 shown over the canvas', 'The dialog closes and the canvas keeps its edits (as 「Keep」)');
  sb('sb-picker', 'photo picker opened from a frame +', 'The canvas shows with nothing imported (as ‹)');
  sb('sb-addlayer', 'Add Layer open', 'Add Layer closes; the canvas shows');
  sb('sb-text', 'Add Layer › 「Text」 open with the keyboard up', 'The keyboard closes first; a second Back leaves the text input');
  sb('sb-sheets', 'each of Background, Layers, Ratio and the Frame panel opened in turn', 'Each sheet closes like its ✕ (Q-10)');
  sb('sb-color', 'Background custom colour picker open', 'The picker closes without applying (as 「Cancel」)');
  sb('sb-pages', 'Pages open with one page deleted', '「Discard changes?」 appears (as ✕)', [rPagesX]);
  sb('sb-pagemenu', 'Pages ••• menu open', 'The menu closes; Pages stays');
  sb('sb-room', 'Object Removal opened from image focus', 'The canvas shows with nothing applied (as ✕)');
  sb('sb-iap', 'IAP page opened from Export', 'The IAP page closes (as ✕)');
  sb('sb-save', 'Save & Share open', 'The canvas shows with the edits (as ‹)');
}

// ---------------------------------------------------------------- ids, grids, output
const id = new Map<string, string>();
rows.forEach((r, i) => id.set(r.key, `TC-${String(i + 1).padStart(3, '0')}`));
const T = (...keys: string[]) => keys.map(k => { const v = id.get(k); if (!v) throw new Error(`no row ${k} on ${P}`); return v; }).join(', ');
const reqs = R.filter(r => !r.plat || r.plat === P);
const used = new Set(rows.flatMap(r => r.refs));
for (const r of reqs) if (!/NOT TESTABLE/.test(r.text) && !used.has(r.id)) throw new Error(`${r.id} has no row`);

const q = (n: number, text: string) => `- Q-${n} ${text}`;
const questions = [
  q(1, `Feature name and banner copy. The Design (10/29) says 「Swipe Collage」, 「Try Swipe Collage!」 and 「Create the perfect year-end recap post.」; the PM mockups say 「Scrollable Collage」, 「Try Scrollable Collage!」 and 「Swipe-able multi-page collage」; TBD-9 proposes 「Carousel Collage」. Assumption: the Design copy (${rBanner}, ${rTplHead}; ${T('entry-banner', 'tpl-head')}).`),
  q(2, `Ratio list. The PM lists seven page ratios 1:1, 4:5, 5:4, 3:4, 4:3, 9:16, 16:9 (D2-02, F12); the Design 「Ratio」 frame shows the Crop tool's list 「Custom」, 「Original」, 「Squre」, 「2:3」, 「3:2」, 「3:4」 (no source photo for 「Original」 on a canvas, and 「Squre」 is misspelt). Assumption: the PM list, checked on the device (${rRatios}; ${T('rt-open', 'rt-each')}).`),
  q(3, `Eastern / Western thumbnails (F16): which set does a user see, by region, language or something else? Assumption: by the phone's locale (${rEastWest}; ${T('tpl-eastwest')}).`),
  q(20, `Canvas exits. The Design (10/29) has no top bar on the canvas: its bottom row is ✕, ↶, ↷, ✓; the PM mockups and the button table have ‹ at the top left and 「Export」 at the top right (D1-10, D1-04). Assumption: ✕ is the PM's ‹ (asks 「Discard changes?」) and ✓ is the PM's 「Export」 (opens Save & Share) (${rBars}, ${rCanvasBack}, ${rExport}; ${T('cv-bars', 'lv-back', 'ex-open')}).`),
  q(4, `Photo picker. The Design shows 「Please select 3 photos to continue.」 and 「(3/3)」, which reads as "exactly 3"; the PM says one or several photos up to the number of empty frames (F4, D2-06) and its mockup shows 「Select up to 3 photos」 / 「Done (2)」. Assumption: fewer than the empty-frame count is allowed, with the Design copy (${rPicker}, ${rFewer}; ${T('imp-plus', 'imp-fewer')}).`),
  q(5, `Template Preview count copy: the Design writes 「9 photos · 5pages」 (no space) on Template Preview and 「9 photos · 5 pages」 elsewhere. Assumption: 「5 pages」 everywhere (${rPrevHead}; ${T('prev-head')}).`),
  q(6, `TBD-1 (PM, open): what Opacity / Shadow open. Proposal: the Collage room's existing sliders. Assumption: the proposal (${rOpacity}; ${T('ff-opacity')}).`),
  q(7, `The Design labels the image tool 「Fliter」 (canvas_img_focus and the Removal / Enhance frames); the PM says Filter. Assumption: 「Filter」 is right and 「Fliter」 a Design typo (${rImgTools}; ${T('if-tools')}).`),
  q(8, `TBD-2 (PM, open): where the frame style switch is. Proposal: a first tool 「Frame」 on the frame toolbar; the Design's frame toolbar does not draw it. Assumption: a 「Frame」 tool on the frame toolbar (${rSwitchEntry}; ${T('sw-entry')}).`),
  q(9, `TBD-5 (PM, open): does Add Layer › Image add a single-photo frame or a free image layer? Proposal: a single-photo frame with the photo. Assumption: the proposal (${rAddImg}; ${T('al-image')}).`),
  q(10, `TBD-4 (PM, open): does a sheet's ✕ (Background, Layers, Frame, Ratio) keep the changes already applied? Proposal: yes, as Edit Room panels. The Design (10/29) draws ✕ and ✓ on every sheet, which reads as ✓ = keep and ✕ = drop. Assumption: the Design (${rSheetX}; ${T('bg-ok', 'bg-x', 'ly-ok', 'ly-x', 'rt-ok', 'rt-x')}).`),
  q(11, `TBD-3 (PM, open): what Layers' ≡ does. Proposal: hold and drag to change the front / back order. Assumption: the proposal (${rLayerDrag}; ${T('ly-drag')}).`),
  q(12, `TBD-6 (PM, open): when a page is deleted, is an element that crosses into it deleted (touching) or kept by its centre? Proposal: deleted when it touches the page. Assumption: the proposal (${rDelPage}; ${T('pg-cross')}).`),
  q(13, `Export size. D2-04 says the Image Quality setting on each image's long side; D1-36 says a 1080 px short side; TBD-7 proposes a fixed 1200 px short side. Assumption: Image Quality on the long side (${rQuality}, ${rLongSide}; ${T('ex-quality', 'rt-each')}).`),
  q(14, `「You might also like」: the Design's single-page Save & Share (Save: Only 1 img) shows it; the PM competitor notes say similar templates are not Day-1, and the multi-page frame does not show it. Assumption: shown on the single-page page as the Design draws, check on device (${rMightLike}; ${T('ex-single')}).`),
  q(15, `After the IAP page that Export opens is closed with ✕, where does the user land and is anything saved? The spec is silent. Assumption: back on the canvas with the edits, nothing saved (${rIapPage}; ${T('iap-x')}).`),
  q(16, `Light and dark: the Design draws every screen in both. Does the app follow the system appearance or its own setting? Assumption: the system appearance (${rModes}; ${T('mode-light', 'mode-dark')}).`),
  q(17, `CMS handoff blocker: the CMS type string, contentVer and CMS sheet are still mock (MOCK_CMS_TYPE, MOCK_CMS_SHEET), and the deeplink format with category_guid / template_guid needs real guids from RD. Assumption: rows needing real guids wait for RD (${rCmsBlock}, ${rDlCat}, ${rDlTpl}; ${T('entry-dl-cat', 'entry-dl-tpl')}).`),
  q(18, `The PM mockups show the swap hint 「Long press & drag to swap」 and the labels 「Frame selected」 / 「Image selected」; the Design draws only 「Image selected」. Assumption: the hint and 「Frame selected」 are optional (not asserted) (${rSwap}, ${rFocus}; ${T('sw-swap', 'ff-focus')}).`),
  q(19, `The Design's IAP frame (「B (mimic VVG/ Beauty plus)」: 「Start 7-Day Free Trial」, 「Auto-renewal for $29.99/year」) differs from the PM's 「Continue」 page, while the PM says the IAP page is the existing one, unchanged. Assumption: whatever the existing IAP page shows; its copy is not asserted (${rIapPage}; ${T('iap-x', 'if-rem-iapx')}).`),
];

const grid = (head: string[], lines: string[][]) => [`| ${head.join(' | ')} |`, `|${head.map(() => '---').join('|')}|`, ...lines.map(l => `| ${l.join(' | ')} |`)].join('\n');
const jobs = grid(['Job', 'Start / loading', 'Success', 'Failure', 'Retry', 'Second failure', 'Partial', 'Stop', 'Leave and return', 'Longest wait', 'Done notice'], [
  ['Photo import (picker → frames)', 'n/a (no loading state drawn)', T('imp-fill'), 'n/a (spec silent)', 'n/a (spec silent)', 'n/a (spec silent)', T('imp-fewer'), T('imp-back'), T('lv-kill'), 'n/a (spec silent)', 'n/a (the photos appear in the frames)'],
  ['Export and save (Save & Share)', 'n/a (spec silent)', T('ex-saveall'), 'n/a (spec silent)', 'n/a (spec silent)', 'n/a (spec silent)', T('ex-saveone'), 'n/a (nothing to stop)', T('ex-back'), 'n/a (spec silent)', 'n/a (spec silent: no toast drawn)'],
  ['Removal apply (existing room)', 'n/a (as the existing Object Removal room)', T('if-rem-ok'), 'n/a (as the existing room)', 'n/a (as the existing room)', 'n/a (as the existing room)', 'n/a (one photo)', T('if-rem-x'), 'n/a (spec silent)', 'n/a (as the existing room)', 'n/a (as the existing room)'],
  ['Enhance apply (existing room)', 'n/a (as the existing AI Enhance room)', T('if-enh-ok'), 'n/a (as the existing room)', 'n/a (as the existing room)', 'n/a (as the existing room)', 'n/a (one photo)', T('if-enh-x'), 'n/a (spec silent)', 'n/a (as the existing room)', 'n/a (as the existing room)'],
]);
const errs = grid(['Job', 'Error classes'], [
  ['Photo import', 'n/a (spec names no error classes)'],
  ['Export and save', 'n/a (spec names no error classes)'],
  ['Removal / Enhance', 'n/a (existing rooms; spec names no error classes)'],
]);
const exitHead = AND ? ['Stage', '‹ / ✕', 'System Back', 'App killed'] : ['Stage', '‹ / ✕', 'App killed'];
const ex = (stage: string, back: string, sys: string, kill: string) => AND ? [stage, back, sys, kill] : [stage, back, kill];
const exits = grid(exitHead, [
  ex('Canvas with edits', T('lv-back', 'lv-discard', 'lv-keep'), AND ? T('sb-canvas') : '', T('lv-kill')),
  ex('Canvas, image focus', T('lv-focus'), AND ? T('sb-canvas') : '', 'n/a (same as the canvas)'),
  ex('Pages with changes', T('pg-x-dialog', 'pg-x-discard', 'pg-x-keep'), AND ? T('sb-pages') : '', 'n/a (spec silent)'),
  ex('Pages with no change', T('pg-x-clean'), AND ? 'n/a (same as ✕ with no change)' : '', 'n/a (spec silent)'),
  ex('Save & Share', T('ex-back'), AND ? T('sb-save') : '', 'n/a (spec silent)'),
  ex('Photo picker', T('imp-back'), AND ? T('sb-picker') : '', 'n/a (spec silent)'),
]);
const hidden = grid(['Requirement', 'Hidden clause', 'Observed through', 'Rows'], [
  [rEvAppear, 'the analytics event and its parameters are sent', 'the app\'s analytics event log (log pull or RD event viewer); parked until available', T('trk-appear')],
  [rEvExport, 'the analytics event and its parameters are sent', 'the app\'s analytics event log; parked until available', T('trk-export')],
  [rApplyPaid, 'the result is not saved to the photo album', 'the Photos / Gallery app shows no new image after ✓', T('if-rem-ok', 'if-enh-ok')],
  [rNoCredit, 'no credit is charged', 'the credit balance before and after an export (Mine › My Credits)', T('ex-nocredit')],
  [rLongSide, 'the canvas has a 1080 px short side', 'the pixel size of the saved image', T('rt-each', 'ex-quality')],
]);
const variantsList: string[][] = [
  [rApplyPaid, 'tier=Pro', T('if-rem-ok', 'if-enh-ok')],
  [rApplyFree, 'tier=Free', T('if-rem-free', 'if-enh-free')],
  [rApplyFree, 'tier=Pro (applies, no IAP)', T('if-rem-ok', 'if-enh-ok')],
  [rProExport, 'tier=Free', T('iap-pro-free', 'iap-frame-free', 'iap-tex-free')],
  [rProExport, 'tier=Pro', T('iap-pro-paid')],
  [rProExport, 'content=template', T('iap-pro-free')],
  [rProExport, 'content=frame', T('iap-frame-free')],
  [rProExport, 'content=texture', T('iap-tex-free')],
  [rEvery3, 'tier=Free', T('iap-every3')],
  [rEvery3, 'tier=Pro', T('iap-every3-pro')],
  [rPrevFree, 'tier=Free', T('prev-use-pro')],
  [rPrevFree, 'tier=Pro', T('iap-pro-paid')],
  [rIapPage, 'IAP from Removal', T('if-rem-iapx')],
  [rIapPage, 'IAP from Export', T('iap-x')],
  [rModes, 'appearance=Light', T('mode-light')],
  [rModes, 'appearance=Dark', T('mode-dark')],
  [rSaveBtns, 'button=Save all N images', T('ex-saveall')],
  [rSaveBtns, 'button=Save this image', T('ex-saveone')],
  [rRatios, 'ratio=each of the seven', T('rt-open', 'rt-each')],
  [rRatios, 'ratio=9:16 and 1:1 (grow / shrink)', T('rt-change')],
  [rEastWest, 'thumbnails=Eastern', T('tpl-eastwest')],
  [rEastWest, 'thumbnails=Western', T('tpl-eastwest')],
  [rDlRoom, 'deeplink=no parameter', T('entry-dl')],
  [rDlCat, 'deeplink=category_guid', T('entry-dl-cat')],
  [rDlTpl, 'deeplink=template_guid', T('entry-dl-tpl')],
  [rEvAppear, 'from=Collage_Banner', T('trk-appear')],
  [rEvAppear, 'from=Deeplink', T('trk-appear')],
  [rLimit, 'platform cap 20', T('imp-20')],
  ...(AND ? [[rLimit, 'Android not held to 6', T('imp-android6')]] : [[rLimit, 'Android not held to 6', 'n/a (Android table)']]),
  [rToFewer, 'multi → single', T('sw-tosingle')],
  [rToFewer, 'multi → fewer cells', T('sw-tofewer')],
  ...(IOS ? [[rTiersIos, 'tier=Pro', T('iap-pro-paid', 'if-rem-ok')], [rTiersIos, 'tier=Pro+', T('iap-proplus', 'if-rem-proplus')]] : []),
];
const variants = grid(['Requirement', 'Variant', 'Rows'], variantsList);
const arrowsWalked = R.filter(r => /flow arrow/.test(r.src)).map(r => `- ${r.id} [${r.src}] ${r.text}. Walked by: ${[...new Set(rows.filter(x => x.refs.includes(r.id)).map(x => id.get(x.key)))].join(', ')}.`);
const na = (r: string) => `n/a (${r})`;
const domain = grid(['Entry', 'Requirements'], IOS ? [
  ['KP-013', rTiersIos],
  ['KP-016', na('no one-time free trial in this feature')],
] : [
  ['KP-012', `${rApplyPaid}, ${rProExport}, ${rEvery3} (Pro = the Android paid mode)`],
  ['KP-014', na('AI Exposure only')], ['KP-015', na('no purchase is made in this table')], ['KP-016', na('no one-time free trial in this feature')],
  ['KP-017', na('Swipe Collage charges no credits')], ['KP-018', na('no Credit Auto Pass')], ['KP-019', na('no Generate button')],
  ['KP-020', na('no credit button in Swipe Collage')], ['KP-021', na('no chat quota')], ['KP-024', na('not an AI image feature; nothing goes to My AI Artwork')],
  ['KP-025', na('AI Exposure only')], ['KP-026', na('no History button')], ['KP-027', `${rNoArtwork} (the spec keeps Swipe Collage out of My AI Artwork)`],
  ['KP-028', na('Artwork filters not touched')], ['KP-029', na('no long task')], ['KP-030', `${rPerPage}, ${rSaveMulti}`],
  ['KP-032', na('not opened from Edit Room')], ['KP-033', `${rDlCat}, ${rDlTpl}`], ['KP-034', na('no Discover tip')],
  ['KP-035', na('AI Replace only')], ['KP-036', na('no prompt')], ['KP-037', na('AI Try-On only')], ['KP-038', na('AI Group Shot only')],
  ['KP-039', na('no agent job')], ['KP-040', na('no Crop tabs')], ['KP-041', rUndo], ['KP-042', `${rUndo}, ${rRatios} (an undone ratio change restores the canvas and the panel's highlight together)`],
  ['KP-043', na('video only')], ['KP-044', na('video panels only; Swipe Collage sheets: Q-10')], ['KP-045', na('audio only')], ['KP-046', na('Try-On / Hairstyle only')],
  ['KP-047', na('no masks')], ['KP-048', na('the spec gives no Arabic strings')], ['KP-049', `${rCardLabel}, ${rSaveBtns} (「N photos · M pages」, 「Save all N images」 carry numbers)`],
  ['KP-050', na('the spec gives no RTL layout; checked in a localisation pass')],
]);
const ledger = grid(['Ledger entry', 'Requirements'], [['REQ-001', `${rRoom}, ${rBanner} … every requirement (new feature from the PM and Design Figma)`]]);
const sysBack = AND ? '\n### System back\n\n' + grid(['Screen', 'Rows'], [
  ['Swipe Collage Template Page', T('sb-tplpage')], ['Template Preview', T('sb-preview')], ['Canvas (with edits)', T('sb-canvas')],
  ['「Discard changes?」 dialog', T('sb-dialog')], ['Photo picker', T('sb-picker')], ['Add Layer', T('sb-addlayer')],
  ['Text input with keyboard', T('sb-text')], ['Sticker / Text Bubble panels', T('sb-sheets')], ['Background, Layers, Ratio, Frame sheets', T('sb-sheets')],
  ['Custom colour picker', T('sb-color')], ['Pages', T('sb-pages')], ['Pages ••• menu', T('sb-pagemenu')],
  ['Object Removal / AI Enhance', T('sb-room')], ['IAP page', T('sb-iap')], ['Save & Share', T('sb-save')],
  ['Collage room', 'n/a (existing room, unchanged)'], ['「Continue editing?」 dialog', 'n/a (as Edit Room today)'],
]) + '\n' : '';

const secs = [...new Set(reqs.map(r => r.sec))];
const body = secs.map(s => `## ${s}\n` + reqs.filter(r => r.sec === s && !/flow arrow/.test(r.src)).map(r => `- ${r.id} [${r.src}] ${r.text}`).join('\n')).join('\n\n');
const md = `# Scrollable Collage — requirements (${P})
Spec: Scrollable Collage - PM and Design Figma.md (Figma-only spec set 2026-11-05: PM page 2171:2 「26 11E Scrollable Collage (year end)」, Design page 0:1 「20261029_Swipe Collage」)

Source order: Design (2026-10-29) over PM, except the PM 「Save page」 11/3 update, which is newer (analysis.md pass 7). Decision ids in brackets in the PM ([D1-07], [F4]) are the PM's own. Feature name: the Design and the app say 「Swipe Collage」 (Q-1).

${body}

## Open questions
${questions.join('\n')}

## Added 2026-11-05 — coverage passes and standing inputs

### Job states

${jobs}

### Error classes

${errs}

### Exit × stage

${exits}

### Hidden clauses

${hidden}

### Variants

${variants}

### Flow arrows walked by existing rows
${arrowsWalked.join('\n')}
${sysBack}
### Domain rules

${domain}

### Request ledger coverage

${ledger}
`;
writeFileSync(join(OUT, 'requirements.md'), md);

const csvq = (s: string) => /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
const lines = ['ID,Section,Precondition,Action,Expected Result,Priority,Spec Ref,Notes,Change,Change Reason'];
// rows whose behaviour the Design (2026-10-29) does not draw: written from the PM only (pass 7)
const PM_ONLY = new Set(['entry-again', 'entry-dl', 'entry-dl-cat', 'entry-dl-tpl', 'entry-dl-tpl-back', 'entry-dl-tile', 'entry-noshortcut',
  'tpl-swipe', 'tpl-tags', 'tpl-count', 'tpl-eastwest', 'prev-pro', 'prev-use-pro', 'cv-undo', 'cv-centre', 'imp-limit', 'imp-20', 'imp-android6',
  'ff-opacity', 'if-rem-ok', 'if-rem-free', 'if-enh-ok', 'if-enh-free', 'sw-swap', 'sw-in', 'sw-entry', 'sw-tomulti', 'sw-tosingle', 'sw-tofewer', 'sw-noback',
  'lk-frame', 'lk-frame-bar', 'lk-frame-dup', 'lk-frame-del', 'lk-image', 'lk-image-bar', 'lk-unlock', 'lk-pages', 'al-frame-tags', 'bg-dropper',
  'ly-drag', 'rt-change', 'rt-each', 'pg-max', 'pg-min', 'pg-dup', 'pg-del', 'pg-cross', 'pg-drag', 'pg-tapdrag', 'pg-select', 'pg-noundo',
  'pg-x-dialog', 'pg-x-discard', 'pg-x-keep', 'pg-x-clean', 'lv-back', 'lv-discard', 'lv-keep', 'lv-focus', 'lv-kill', 'lv-latest',
  'ex-saveall', 'ex-saveone', 'ex-quality', 'ex-noartwork', 'ex-nocredit', 'iap-pro-free', 'iap-frame-free', 'iap-tex-free', 'iap-pro-paid',
  'iap-proplus', 'iap-every3', 'iap-every3-pro', 'iap-x', 'if-rem-proplus']);
const needsPm = (r: Row) => PM_ONLY.has(r.key);
for (const r of rows) {
  const notes = [r.notes, needsPm(r) ? PMONLY : ''].filter(Boolean).join('. ');
  lines.push([id.get(r.key)!, r.sec, r.pre, r.act, r.exp, r.pri, r.refs.join(', '), notes, 'new', REASON].map(csvq).join(','));
}
writeFileSync(join(OUT, 'draft.csv'), lines.join('\n') + '\n');
writeFileSync(join(OUT, 'row-keys.json'), JSON.stringify(Object.fromEntries(id), null, 1) + '\n');
console.log(`${P}: ${reqs.length} requirements, ${rows.length} rows`);
