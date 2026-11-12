// Draft on approved v2: spec set 2026-11-05 (Swipe Collage PhDM Spec.pdf, text unchanged from Collage.pdf's spec half)
// plus the Design Figma file Swipe_collage (iUy5kOrVNG7IjcyxGGnp9t, page 0:1 「20261029_Swipe Collage」), REQ-007.
// Run from the repo root: node library/phd/swipe-collage/android/drafts/20261112-094820/build-draft.ts
import { join } from 'node:path';
import { DRAFT_COLUMNS, readTable, tableDir, writeTable } from '../../../../../../scripts/lib/library.ts';

type Row = Record<string, string>;
const here = import.meta.dirname;
const rows: Row[] = readTable(join(tableDir('phd/swipe-collage', 'android'), 'cases.csv'));
const CANVAS = 'On the Canvas of a Year End template (opened from Template Preview › 「Use Template」)';
const FILLED = `${CANVAS}, every frame filled with photos`;
const DS = 'Design (Figma 20261029) differs from the PM mock: check on device (Q-28).';

// Modified rows: only the fields given change; every one names its reason.
const edits: Record<string, Row> = {
  'TC-001': {
    'Expected Result': 'A Swipe Collage banner is shown at the top of the Collage room, under the layout filter tabs (「All」, 1–6) and above 「New」: 「Try Swipe Collage!」, 「Create the perfect year-end recap post.」, 「›」 and a collage picture',
    Notes: 'Copy from the Design (Q-1 answered). The PM entry flow also draws a 「NEW」 tag the Design does not: record whether the app shows one (Q-18). PM copy 「Try Scrollable Collage!」 / 「Swipe-able multi-page collage」 is older wording.',
    'Change Reason': 'R-001, R-003: the Design banner copy and place (Design Figma 1:238)',
  },
  'TC-003': {
    'Expected Result': 'The Template Page titled 「Swipe Collage」 opens: a separate room with its own category tabs, not a category inside Collage',
    Notes: `PM title 「Scrollable Collage」; TBD-9 proposed 「Carousel Collage」. ${DS}`,
    'Change Reason': 'R-004: the Design titles the Template Page 「Swipe Collage」',
  },
  'TC-006': {
    'Expected Result': 'The Template Page opens with that category tab selected and scrolled into view, and its templates listed',
    'Spec Ref': 'R-008',
    'Change Reason': 'R-008 now cites KP-033: a deep link preselects the category and scrolls it into view',
  },
  'TC-009': {
    'Expected Result': 'Templates are laid out as a waterfall (staggered two-column list); the title is 「Swipe Collage」 with a 「‹」',
    Notes: DS,
    'Change Reason': 'R-010: the Design title 「Swipe Collage」',
  },
  'TC-015': {
    'Expected Result': 'Each PRO template shows a PRO crown icon at the top right of its card; free templates show none',
    Notes: 'The Design draws a crown; the PM mock a 「PRO」 label.',
    'Change Reason': 'R-016: the Design draws the PRO marker as a crown icon',
  },
  'TC-016': {
    Action: 'Swipe a card thumbnail to the right (horizontal swipe on the card) through all its pages',
    'Expected Result': 'The thumbnail shows that template\'s next pages one by one, every page of the template; the page dots on the card follow the page shown; the list does not scroll',
    'Spec Ref': 'R-017, R-205',
    'Change Reason': 'R-205: the Design draws page dots on each card thumbnail',
  },
  'TC-021': {
    'Expected Result': 'Title 「Template」 with 「‹」; under the image the page dots, the photo and page count (e.g. 「9 photos · 5 pages」) and the category (「Year End」); a 「Use Template」 button',
    Notes: 'The Design writes 「9 photos · 5pages」 (no space): a missing space in the app is a text finding (Q-30).',
    'Change Reason': 'R-022: the Design preview layout (page dots under the image)',
  },
  'TC-026': {
    'Expected Result': 'No top bar. At the bottom: a tool bar 「Background」, 「Layers」, a round 「+」, 「Ratio」, 「Pages」, and under it ✕, ↶, ↷, ✓',
    Notes: `PM mock: top 「‹」, ↶ / ↷ and 「Export」. ${DS}`,
    'Change Reason': 'R-031: the Design moves ‹, undo / redo and Export into a bottom row ✕ / ↶ / ↷ / ✓',
  },
  'TC-031': {
    Action: '1. Move a photo\n2. Flip a frame\n3. Change the background\n4. Add a sticker\n5. Tap ↶ (bottom row) four times\n6. Tap ↷ four times',
    'Expected Result': 'Each ↶ undoes the last operation in reverse order; each ↷ redoes it',
    'Change Reason': 'R-030: ↶ / ↷ are in the bottom row in the Design',
  },
  'TC-032': {
    Action: 'Tap ✕ (bottom left)',
    Notes: 'PM: 「‹」 at the top; the Design draws ✕ in the bottom row (check on device, Q-28).',
    'Change Reason': 'R-033: the Design leaves the Canvas with ✕',
  },
  'TC-033': {
    Precondition: `${CANVAS}, at least one edit made; 「Discard changes?」 dialog open (from ✕)`,
    'Change Reason': 'R-033: the dialog is opened by ✕ in the Design',
  },
  'TC-034': {
    Precondition: `${CANVAS}, at least one edit made; 「Discard changes?」 dialog open (from ✕)`,
    'Change Reason': 'R-033: the dialog is opened by ✕ in the Design',
  },
  'TC-035': {
    Action: 'Tap ✕ (bottom left)',
    'Expected Result': 'The 「Discard changes?」 dialog appears (the spec asks first on every exit from the Canvas)',
    'Change Reason': 'R-033: the Design leaves the Canvas with ✕',
  },
  'TC-040': {
    'Expected Result': 'The photo picker opens (same as the Collage picker): 「‹」, tabs 「Photo」 / 「Stock」, albums 「Recents」 「Sample Photos」 「Favorites」 「Instagram」, the photo grid, and a tray reading 「Please select 3 photos to continue.」 with 「(0/3)」',
    Notes: `PM mock: title 「Select up to 3 photos」. ${DS}`,
    'Change Reason': 'R-036, R-037: the Design picker (tabs, albums, tray text)',
  },
  'TC-041': {
    'Expected Result': 'The 2 photos are marked in the grid and appear as thumbnails in the tray, each with a ✕; the tray count reads 「(2/3)」',
    Notes: 'PM mock: selection numbers 1, 2 and 「Done (2)」.',
    'Change Reason': 'R-037: the Design tray (thumbnails, 「(n/3)」)',
  },
  'TC-042': {
    'Expected Result': 'No more than 3 can be selected (limit = empty frames); the tray count stays at 「(3/3)」',
    'Change Reason': 'R-037: the Design tray count',
  },
  'TC-043': {
    Precondition: 'Photo picker opened from a canvas with 3 empty frames, 2 photos selected (tray 「(2/3)」)',
    Action: 'Tap the orange ✓ in the tray',
    Notes: 'PM: 「Done (2)」.',
    'Change Reason': 'R-039: the Design confirms with the tray ✓',
  },
  'TC-044': {
    Action: '1. Tap 「+」 in an empty frame\n2. Select one photo\n3. Tap the tray ✓',
    'Change Reason': 'R-039: the Design confirms with the tray ✓',
  },
  'TC-045': {
    'Expected Result': 'The tray allows 20 photos (count 「(n/20)」 or as the app words it); Android is not held to its default limit of 6',
    'Change Reason': 'R-037, R-038: the limit shows in the Design tray',
  },
  'TC-046': {
    Action: '1. Tap 「+」 in an empty frame\n2. Select 7 photos\n3. Tap the tray ✓',
    'Expected Result': '7 photos can be selected (more than the Android default 6) and fill 7 frames',
    'Change Reason': 'R-039: the Design confirms with the tray ✓',
  },
  'TC-048': {
    'Expected Result': 'The frame is selected (「Frame selected」): orange outline with corner handles; floating Delete / Duplicate / Lock icons appear above it; the toolbar shows 「Opacity」 「Shadow」 「Flip H」 「Flip V」 「Duplicate」 「Lock」 「Delete」',
    Notes: 'The Design labels the 7th toolbar item 「Removal」 (Q-19): record its label.',
    'Change Reason': 'R-042, R-043: the Design frame focus (outline, floating bar, toolbar)',
  },
  'TC-056': {
    'Expected Result': 'One horizontally scrolling bar: 「Replace」 「Flip H」 「Flip V」 「Adjust」 「Filter」 「Removal」 「Enhance」 「Lock」 「Delete」; Removal and Enhance carry a 「PRO」 tag',
    Notes: 'The Design draws no PRO tag on Removal / Enhance (Q-20) and spells 「Fliter」 (Q-30): record what the app shows.',
    'Change Reason': 'R-049, R-054: the Design toolbar has no PRO tag (Q-20)',
  },
  'TC-061': {
    Action: '1. Tap 「Removal」\n2. Remove an object (e.g. 「Smart Select」, 「Remove」)\n3. Tap ✓ (apply)',
    'Expected Result': 'The Object Removal room opens (「Smart Select」 / 「Manual」 / 「One-Tap」, 「Box」 / 「Circle」 / 「Swipe」, 「Remove」, ✕ / ✓); applying shows the IAP page 「PhotoDirector Premium」 with a ✕, and nothing is applied yet',
    Notes: 'Which IAP page ships is Q-21 (PM: existing page with 「Continue」; Design: 「Start 7-Day Free Trial」): record the layout.',
    'Change Reason': 'R-055, R-061: the Design room and IAP page (Q-21)',
  },
  'TC-062': {
    Action: '1. Tap 「Enhance」\n2. Run an enhance\n3. Tap ✓ (apply)',
    'Expected Result': 'The AI Enhance room opens (「Standard」 / 「Advanced」, 「General」 「Portrait」 「Anime」 「Product」 「Scenery」 「Pets」 「Concert」, 「Enhance」, ✕ / ✓); applying shows the IAP page 「PhotoDirector Premium」',
    'Change Reason': 'R-056: the Design Enhance room',
  },
  'TC-072': {
    Action: '1. Open 「Pages」\n2. Hold the move button (↔) under page 1 and drag the page after page 2\n3. Tap ✓',
    Notes: 'PM: ≡; the Design draws a ↔ move button.',
    'Change Reason': 'R-106: the Design page move button',
  },
  'TC-090': {
    'Expected Result': 'The 「Background」 sheet opens with a collapse ⌄, tabs 「Solid」 and 「Texture」, ✕ and ✓ at the bottom; Solid shows a colour-wheel 「Custom color」 swatch first and 32 colour swatches; no gradients',
    Notes: 'PM: 8 × 4 grid and a 「Custom color」 button; the Design draws rows of 7 (Q-22): count the swatches.',
    'Change Reason': 'R-079, R-080, R-083: the Design sheet (⌄, ✕ / ✓, colour wheel)',
  },
  'TC-093': {
    'Expected Result': 'PRO textures carry a crown icon and NEW ones a 「NEW」 tag; a PRO texture can be applied without an IAP page',
    'Change Reason': 'R-082: the Design marks PRO textures with a crown',
  },
  'TC-094': {
    Action: 'Tap the colour-wheel swatch (「Custom color」)',
    'Change Reason': 'R-083: the Design opens Custom color from the colour-wheel swatch',
  },
  'TC-098': {
    'Expected Result': 'The sheet closes and the applied background stays (TBD-4 proposal); if ✕ undoes the swatch, record it (Q-5)',
    Notes: 'The Design draws ✓ beside ✕, which may mean ✕ discards (Q-5).',
    'Change Reason': 'R-086, R-206: the Design adds ✓ to every sheet (Q-5)',
  },
  'TC-099': {
    Action: 'Tap the round 「+」 in the tool bar',
    'Expected Result': 'The Add Layer card opens above the tool bar with 「Image」 「Text」 「Sticker」 「Frame」 「Text Bubble」; no video, file, grid, shape or drawing option',
    Notes: 'The Design draws no title, ✕ or NEW tag on Frame; the PM draws 「Add Layer」, ✕ and Frame NEW (Q-23): record them.',
    'Change Reason': 'R-087: the Design Add Layer card',
  },
  'TC-100': {
    Action: '1. Tap 「Image」\n2. Tap a photo',
    'Expected Result': 'The Collage photo picker opens (the Design draws no selection tray); back on the Canvas the photo is added as a new single-image frame (TBD-5 proposal)',
    'Change Reason': 'R-088: the Design picker from Add Layer has no tray',
  },
  'TC-101': {
    Action: '1. Tap 「Text」\n2. Type 「Hello 2026」\n3. Tap ✓',
    'Expected Result': 'The text editor opens: a bar with ✕, 「B」, 「I」, align left / centre / right and ✓ above a text field with ⓧ and the keyboard; ✓ closes the keyboard and the text is on the Canvas',
    Notes: 'PM: Collage text input with 「Cancel」 / 「Done」.',
    'Change Reason': 'R-089: the Design text editor',
  },
  'TC-102': {
    Precondition: 'Text editor opened from Add Layer, text typed',
    Action: 'Tap ✕ in the editor bar',
    'Change Reason': 'R-089: the Design text editor closes with ✕ (PM 「Cancel」)',
  },
  'TC-103': {
    Action: '1. Tap 「Sticker」\n2. Tap another category tab\n3. Tap a sticker\n4. Tap ✓',
    'Expected Result': 'The Edit Room Sticker panel opens (store button, category tabs such as 「Favorites」 「AI Sticker」 「Flower」 「Holiday」, a 「More」 tile, ✕ / ✓); the sticker is added to the Canvas and stays after ✓',
    Notes: 'Category names come from content. The PM mock draws 「Search by keywords」: if the panel has it, search one keyword and close the keyboard.',
    'Change Reason': 'R-090, R-206: the Design sticker panel with ✕ / ✓',
  },
  'TC-104': {
    Action: '1. Tap 「Frame」\n2. Tap a thumbnail\n3. Tap ✓',
    'Expected Result': 'The new Frame panel with square thumbnails (「1 photo」, 「3 photos」 …) and ✕ / ✓ opens; the tapped frame is added to the Canvas with empty 「+」 cells',
    Notes: 'The Design\'s 4_frame board draws texture tiles (Q-24): record what the panel shows.',
    'Change Reason': 'R-091, R-206: the Design Frame panel board (Q-24) and ✓',
  },
  'TC-106': {
    Action: '1. Tap 「Text Bubble」\n2. Tap a bubble style\n3. Tap ✓',
    'Expected Result': 'The Edit Room Text Bubble panel opens (「∅」 first, bubble styles, ✕ / ✓); the bubble is added to the Canvas',
    'Change Reason': 'R-092, R-206: the Design text bubble panel',
  },
  'TC-107': {
    Precondition: 'Add Layer card open',
    Action: 'Close the card: tap the round 「+」 again (or outside the card)',
    'Expected Result': 'The card closes; nothing is added',
    Notes: 'The Design draws no ✕ on the card (Q-23); the PM does: if the app shows ✕, tap it.',
    'Change Reason': 'R-087: the Design card has no ✕ (Q-23)',
  },
  'TC-108': {
    'Expected Result': 'The Layers list opens with a collapse ⌄ and ✕ / ✓; each layer shows its thumbnail on a transparency grid, ⋯ on the left and ≡ on the right',
    'Change Reason': 'R-095: the Design Layers sheet (⌄, ✕ / ✓)',
  },
  'TC-113': {
    Action: '1. Tap ✕\n2. Open 「Layers」 and make the change again\n3. Tap ✓',
    'Expected Result': '✕ closes the list and, per TBD-4, the change stays (record if it is undone, Q-5); ✓ closes it with the change kept',
    'Spec Ref': 'R-086, R-206',
    'Change Reason': 'R-206: the Design adds ✓ to the Layers sheet',
  },
  'TC-114': {
    'Expected Result': 'The Ratio bar opens with ✕ / ✓ and 「Custom」 「Original」 「Square」 「2:3」 「3:2」 「3:4」 and the rest of the bar (scroll it to the end), each with a crop-style icon; no AI Expand promotion',
    Notes: 'PM: 1:1 / 4:5 / 5:4 / 3:4 / 4:3 / 9:16 / 16:9 (Q-25); the Design writes 「Squre」 (Q-30). List every ratio the app offers.',
    'Change Reason': 'R-099: the Design ratio list (Q-25)',
  },
  'TC-115': {
    Action: 'Tap each ratio the bar offers in turn (「Custom」, 「Original」, 「Square」, 「2:3」, 「3:2」, 「3:4」 and any further)',
    'Expected Result': 'Each fixed ratio gives every page that ratio: the page width (short side) stays, only the long side changes; elements keep their place and the canvas grows downward or shrinks upward. 「Original」 and 「Custom」: record what they do (Q-25)',
    'Change Reason': 'R-099: the Design ratio list (Q-25)',
  },
  'TC-116': {
    Precondition: 'Ratio 3:4 applied and the canvas exported and saved',
    'Expected Result': 'Width : height is 3 : 4 (short side as in R-100 / Q-8)',
    'Change Reason': 'R-099: 9:16 is not in the Design ratio list; 3:4 is in both',
  },
  'TC-117': {
    'Expected Result': 'The sheet closes and the ratio stays (TBD-4 proposal); record if ✕ undoes it (Q-5)',
    'Change Reason': 'R-086: the Design adds ✓ beside ✕ (Q-5)',
  },
  'TC-118': {
    'Expected Result': 'Pages opens: the pages joined in one strip with only a thin line between them, a move button (↔) and ••• under each page and a 「+」 at the end of the strip; page 2 is selected and the small text reads 「Page 2 / 3」 above a − | + stepper; ✕ and ✓ at the bottom',
    'Change Reason': 'R-103, R-104, R-106, R-110: the Design Pages screen',
  },
  'TC-120': {
    Action: 'Tap the move button (↔) under a page without holding',
    Notes: 'PM: ≡; the Design draws ↔.',
    'Change Reason': 'R-107: the Design page move button',
  },
  'TC-121': {
    Action: '1. Hold the move button (↔) under page 1\n2. Drag it after page 3\n3. Release',
    Notes: 'PM: ≡; the Design draws ↔ with normal / press / selected / disabled states.',
    'Change Reason': 'R-106: the Design page move button',
  },
  'TC-124': {
    Action: 'Tap the 「+」 at the end of the page strip',
    'Expected Result': 'A new page is added at the end and the strip scrolls to it (4 pages)',
    'Change Reason': 'R-110: the Design draws the add-page 「+」 at the end of the strip',
  },
  'TC-125': {
    Action: '1. Tap the stepper 「+」\n2. Tap the stepper 「−」',
    'Change Reason': 'R-110: the Design draws a − | + stepper',
  },
  'TC-126': {
    Action: '1. Tap the stepper 「+」 once\n2. Try the strip 「+」, the stepper 「+」 and ••• › 「Duplicate page」',
    'Expected Result': 'The 10th page is added (「Page n / 10」); after that the strip +, the stepper + and Duplicate page are greyed and do nothing',
    'Change Reason': 'R-112: the Design draws the disabled states',
  },
  'TC-127': {
    Action: '1. Tap the stepper 「−」\n2. Try 「−」 again and ••• › 「Delete page」',
    'Expected Result': 'One page is left (「Page 1 / 1」); then the stepper − is greyed and − and Delete page do nothing',
    'Change Reason': 'R-113: the Design draws the disabled states',
  },
  'TC-136': {
    Action: 'Tap ✓ (bottom right)',
    'Expected Result': 'The 「Save & Share」 page opens (「‹」): 「5 images in this set」, 「Swipe to view」, the first image with 「1/5」 and page dots, 「Save」, 「Save this image only」 and 「Share to」; nothing is saved yet',
    Notes: 'The Design has no 「Export」 button; ✓ is assumed to export (Q-29). PM: images saved at once and 「5 images」. Check on device (Q-28).',
    'Change Reason': 'R-119, R-120: the Design exports with ✓ to a Save & Share page with 「Save」',
  },
  'TC-137': {
    Precondition: 'Save & Share page of a 5-page canvas',
    Action: '1. Tap 「Save」\n2. Open the Gallery › 「PhotoDirector」 album',
    'Expected Result': '5 new images, one per page in page order, all saved together; each matches its page in the Save & Share preview and on the Canvas',
    'Spec Ref': 'R-119, R-120, R-212',
    'Change Reason': 'R-120, R-212 (KP-030): saving is the 「Save」 button; the files must match the preview',
  },
  'TC-138': {
    Precondition: '5-page canvas saved with 「Save」',
    'Change Reason': 'R-120: saving is the 「Save」 button in the Design',
  },
  'TC-139': {
    Precondition: 'Settings › Image Quality set to the lowest option for the first export and to the highest for the second',
    Action: '1. Export (✓) and tap 「Save」 with the lowest setting\n2. Export and 「Save」 the same canvas with the highest setting\n3. Check both images\' pixel sizes',
    'Change Reason': 'R-120: saving is the 「Save」 button in the Design',
  },
  'TC-141': {
    Precondition: 'Save & Share page of a 5-page canvas; Instagram installed',
    Action: 'Tap 「Instagram」 under 「Share to」',
    'Change Reason': 'R-122: the Design 「Share to」 row',
  },
  'TC-142': {
    Precondition: 'Save & Share page of a 5-page canvas; Facebook installed',
    Action: 'Tap 「Facebook」 under 「Share to」',
    'Change Reason': 'R-122: the Design 「Share to」 row',
  },
  'TC-143': {
    Precondition: 'Save & Share page of a 5-page canvas',
    Action: 'Scroll the 「Share to」 row to its end and tap 「More」',
    'Expected Result': 'The Android share sheet opens with all exported images; if the row has no 「More」, record the targets it offers',
    Notes: 'The Design draws Instagram / Facebook / Twitter / Line / Tiktok and no More (Q-26); share targets also depend on region and installed apps (KP-063).',
    'Change Reason': 'R-122: the Design share targets (Q-26)',
  },
  'TC-145': {
    Action: '1. Tap ✓\n2. Tap 「Save」\n3. Tap 「‹」 back to the Canvas\n4. Repeat steps 1–3 twice more',
    'Expected Result': 'The first two saves go through with no IAP page; the 3rd save shows the IAP page (「PhotoDirector Premium」)',
    'Change Reason': 'R-126: export is ✓ + 「Save」 in the Design',
  },
  'TC-146': {
    Action: '1. Export (✓, 「Save」) the 10-page canvas twice\n2. Export the 1-page canvas once',
    'Change Reason': 'R-126: export is ✓ + 「Save」 in the Design',
  },
  'TC-147': {
    Action: 'Export (✓, 「Save」) a free-content canvas 4 times',
    'Change Reason': 'R-131: export is ✓ + 「Save」 in the Design',
  },
  'TC-149': { Action: 'Tap ✓ (Export)', 'Change Reason': 'R-128: the Design exports with ✓ (Q-29)' },
  'TC-150': { Action: 'Tap ✓ (Export)', 'Change Reason': 'R-128: the Design exports with ✓ (Q-29)' },
  'TC-151': { Action: 'Tap ✓ (Export)', 'Change Reason': 'R-128: the Design exports with ✓ (Q-29)' },
  'TC-153': {
    Action: '1. Tap ✓ (Export)\n2. Tap 「Save」',
    'Change Reason': 'R-131: the Design exports with ✓ and saves with 「Save」',
  },
  'TC-154': {
    Action: '1. Tap ✓ (Export)\n2. Tap 「Save」',
    'Change Reason': 'R-129: the Design exports with ✓ and saves with 「Save」',
  },
  'TC-155': {
    Action: 'Go through a full journey: template → photos → Removal (Premium) → ✓ → 「Save」',
    Notes: 'Enhance is left out: the Design prices it at 5 credits (Q-27, TC-172).',
    'Change Reason': 'R-130, R-211: Enhance has a credit price in the Design (Q-27)',
  },
  'TC-158': {
    'Expected Result': 'Same as ✕: the 「Discard changes?」 dialog appears',
    'Change Reason': 'R-134: the Canvas exit is ✕ in the Design',
  },
  'TC-162': {
    Precondition: 'Background sheet open (also: Layers, Ratio, Sticker, Frame, Text Bubble)',
    'Change Reason': 'R-134, R-206: the Design\'s sheets (Add Layer is a card, TC-184)',
  },
  'TC-164': {
    Precondition: 'Text editor from Add Layer with the keyboard open',
    'Expected Result': 'The first Back closes the keyboard; the second closes the text editor like ✕',
    'Change Reason': 'R-089, R-134: the Design text editor closes with ✕',
  },
};

// New rows, each placed right after the row it extends (REQ-033).
const add: { after: string; row: Row }[] = [
  { after: 'TC-031', row: { ID: 'TC-180', Section: 'Canvas', Precondition: `${FILLED}, no edit made yet`,
    Action: '1. Look at ↷\n2. Move a photo and flip a frame\n3. Tap ↶ once\n4. Look at ↷',
    'Expected Result': 'Before any undo ↷ is unavailable; one ↶ undoes only the flip; ↷ is then available',
    Priority: 'P3', 'Spec Ref': 'R-217', Notes: 'KP-041 (team rule).', 'Change Reason': 'R-217 new: KP-041 undo / redo records' } },
  { after: 'TC-041', row: { ID: 'TC-170', Section: 'Photos', Precondition: 'Photo picker opened from a canvas with 3 empty frames, 2 photos selected (tray 「(2/3)」)',
    Action: 'Tap the ✕ on one thumbnail in the tray',
    'Expected Result': 'That photo is deselected in the grid and leaves the tray; the count reads 「(1/3)」',
    Priority: 'P2', 'Spec Ref': 'R-213', Notes: '', 'Change Reason': 'R-213 new: the Design tray draws a ✕ on each selected photo' } },
  { after: 'TC-170', row: { ID: 'TC-171', Section: 'Photos', Precondition: 'Photo picker opened from a canvas with 3 empty frames',
    Action: '1. Tap the 「Stock」 tab\n2. Select one stock photo\n3. Tap the tray ✓',
    'Expected Result': 'Stock photos are listed; the stock photo fills an empty frame on the Canvas',
    Priority: 'P3', 'Spec Ref': 'R-214', Notes: 'Same as the Collage picker; needs network.', 'Change Reason': 'R-214 new: the Design picker draws a 「Stock」 tab' } },
  { after: 'TC-065', row: { ID: 'TC-172', Section: 'Image focus', Precondition: `Signed in with a PhotoDirector Premium account; ${FILLED}; a photo in image focus; note the credit balance`,
    Action: '1. Tap 「Enhance」\n2. Tap 「Advanced」\n3. Read the 「Enhance」 button and the credit button\n4. Tap 「Enhance」\n5. Tap ✓\n6. Tap the credit button',
    'Expected Result': 'The credit button shows the account\'s balance with 「+」; 「Enhance」 shows a price of 5 credits under 「Advanced」 (「Maximize detail and clarity with advanced AI.」); the balance after ✓ is recorded; the credit button opens Buy Credit',
    Priority: 'P2', 'Spec Ref': 'R-211', Notes: 'D4-01 says the feature charges no credits; the Design draws 5 credits (Q-27). Record the charge; do not file before Q-27 is answered.',
    'Change Reason': 'R-211 new: the Design Enhance room shows a credit price' } },
  { after: 'TC-098', row: { ID: 'TC-173', Section: 'Background', Precondition: 'Background sheet open, a swatch applied',
    Action: 'Tap ✓', 'Expected Result': 'The sheet closes and the applied background stays on every page',
    Priority: 'P2', 'Spec Ref': 'R-206', Notes: '', 'Change Reason': 'R-206 new: the Design adds ✓ to every sheet' } },
  { after: 'TC-101', row: { ID: 'TC-174', Section: 'Add Layer', Precondition: 'Text editor opened from Add Layer, 「Hello 2026」 typed',
    Action: '1. Tap 「B」\n2. Tap 「I」\n3. Tap each alignment (left, centre, right)\n4. Tap ⓧ in the field\n5. Type 「Hi」 and tap ✓',
    'Expected Result': 'The text turns bold, then italic, and follows each alignment; ⓧ empties the field; 「Hi」 is placed on the Canvas with the chosen style',
    Priority: 'P2', 'Spec Ref': 'R-215', Notes: '', 'Change Reason': 'R-215 new: the Design text editor (B, I, alignment, clear)' } },
  { after: 'TC-174', row: { ID: 'TC-175', Section: 'Add Layer', Precondition: `${CANVAS}, a text added with Add Layer › Text and a text bubble added with Text Bubble`,
    Action: '1. Tap the text\n2. Tap the floating duplicate icon\n3. Tap the floating edit icon\n4. Tap ✕ in the editor\n5. Tap the floating delete icon\n6. Repeat steps 1–5 on the text bubble',
    'Expected Result': 'A selected text or bubble shows a floating edit / duplicate / delete bar and a rotate handle; duplicate adds a copy, edit opens its editor, delete removes it',
    Priority: 'P2', 'Spec Ref': 'R-216', Notes: '', 'Change Reason': 'R-216 new: the Design draws a floating bar on text and bubbles' } },
  { after: 'TC-117', row: { ID: 'TC-176', Section: 'Ratio', Precondition: `${FILLED}; Ratio bar open, 「3:2」 tapped`,
    Action: 'Tap ✓', 'Expected Result': 'The bar closes and every page keeps 3:2',
    Priority: 'P2', 'Spec Ref': 'R-206', Notes: '', 'Change Reason': 'R-206 new: the Design adds ✓ to the Ratio bar' } },
  { after: 'TC-136', row: { ID: 'TC-177', Section: 'Export', Precondition: 'Save & Share page of a 5-page canvas',
    Action: '1. Swipe the preview left four times\n2. Swipe it right once',
    'Expected Result': 'The preview moves one image per swipe through all 5 pages in order; the counter reads 「2/5」 … 「5/5」, then 「4/5」, and the dots follow',
    Priority: 'P2', 'Spec Ref': 'R-208', Notes: '', 'Change Reason': 'R-208 new: the Design Save & Share preview' } },
  { after: 'TC-137', row: { ID: 'TC-178', Section: 'Export', Precondition: 'Save & Share page of a 5-page canvas; note the newest item of the Gallery 「PhotoDirector」 album',
    Action: '1. Swipe to image 3 (「3/5」)\n2. Tap 「Save this image only」\n3. Open the Gallery › 「PhotoDirector」 album',
    'Expected Result': 'Exactly one new image is saved: page 3',
    Priority: 'P1', 'Spec Ref': 'R-207', Notes: 'Whether this counts toward the every-3 IAP is Q-15.', 'Change Reason': 'R-207 new: the Design 「Save this image only」' } },
  { after: 'TC-178', row: { ID: 'TC-179', Section: 'Export', Precondition: `Signed in with a PhotoDirector Premium account; ${CANVAS}, reduced to 1 page with free content`,
    Action: 'Tap ✓ (Export)',
    'Expected Result': '「Save & Share」 shows the single image, 「Save」, 「Share to」 and 「You might also like」 (other features); no 「images in this set」 line, counter or 「Save this image only」',
    Priority: 'P2', 'Spec Ref': 'R-209', Notes: '', 'Change Reason': 'R-209 new: the Design 「Save: Only 1 img」 frame' } },
  { after: 'TC-143', row: { ID: 'TC-181', Section: 'Export', Precondition: 'Save & Share page of a 5-page canvas; Twitter (X) installed',
    Action: 'Tap 「Twitter」 under 「Share to」', 'Expected Result': 'Twitter opens with all exported images when it accepts several; otherwise it just opens',
    Priority: 'P3', 'Spec Ref': 'R-122', Notes: 'Design target (Q-26); depends on region and installs (KP-063).', 'Change Reason': 'R-122: the Design adds Twitter' } },
  { after: 'TC-181', row: { ID: 'TC-182', Section: 'Export', Precondition: 'Save & Share page of a 5-page canvas; LINE installed',
    Action: 'Tap 「Line」 under 「Share to」', 'Expected Result': 'LINE opens with all exported images when it accepts several; otherwise it just opens',
    Priority: 'P3', 'Spec Ref': 'R-122', Notes: 'Design target (Q-26); depends on region and installs (KP-063).', 'Change Reason': 'R-122: the Design adds Line' } },
  { after: 'TC-182', row: { ID: 'TC-183', Section: 'Export', Precondition: 'Save & Share page of a 5-page canvas; TikTok installed',
    Action: 'Tap 「Tiktok」 under 「Share to」', 'Expected Result': 'TikTok opens with all exported images when it accepts several; otherwise it just opens',
    Priority: 'P3', 'Spec Ref': 'R-122', Notes: 'Design target; PM D5-01 rules out TikTok share on Day 1 (Q-26).', 'Change Reason': 'R-122: the Design adds Tiktok' } },
  { after: 'TC-164', row: { ID: 'TC-184', Section: 'Android Back', Precondition: 'Add Layer card open',
    Action: 'Press system Back', 'Expected Result': 'The card closes and nothing is added; the Canvas stays (no Discard dialog yet)',
    Priority: 'P3', 'Spec Ref': 'R-134', Notes: 'The card has no ✕ (Q-23, Q-14).', 'Change Reason': 'R-087, R-134: the Design Add Layer card is a new screen state' } },
  { after: 'TC-167', row: { ID: 'TC-185', Section: 'Android Back', Precondition: 'AI Enhance room opened from image focus',
    Action: 'Press system Back', 'Expected Result': 'Same as ✕: returns to the Canvas, nothing applied',
    Priority: 'P3', 'Spec Ref': 'R-134', Notes: '', 'Change Reason': 'R-134: the Enhance room had no system Back row' } },
  { after: 'TC-169', row: { ID: 'TC-186', Section: 'Appearance', Precondition: 'Phone in dark theme (system setting; ask the user before changing it)',
    Action: '1. Open Collage › the Swipe Collage banner\n2. Open a template and 「Use Template」\n3. Open each sheet (Background, Layers, Ratio, Pages)\n4. Export with ✓',
    'Expected Result': 'Every screen shows the Design\'s dark version (dark backgrounds, light icons and text, the dark canvas icon buttons), all text legible',
    Priority: 'P3', 'Spec Ref': 'R-210', Notes: 'Which setting drives it is Q-31.', 'Change Reason': 'R-210 new: the Design draws every screen in dark mode' } },
  { after: 'TC-186', row: { ID: 'TC-187', Section: 'Appearance', Precondition: 'Phone in light theme',
    Action: '1. Open Collage › the Swipe Collage banner\n2. Open a template and 「Use Template」\n3. Open each sheet (Background, Layers, Ratio, Pages)\n4. Export with ✓',
    'Expected Result': 'Every screen shows the Design\'s light version, all text legible',
    Priority: 'P3', 'Spec Ref': 'R-210', Notes: 'Which setting drives it is Q-31.', 'Change Reason': 'R-210 new: the Design draws every screen in light mode' } },
];

const out: Row[] = rows.map(r => edits[r.ID]
  ? { ...r, ...edits[r.ID], Change: 'modified' }
  : { ...r, Change: 'unchanged', 'Change Reason': '' });
for (const { after, row } of add) {
  const i = out.findIndex(r => r.ID === after);
  if (i < 0) throw new Error(`no row ${after}`);
  out.splice(i + 1, 0, { ...row, Change: 'new' });
}
for (const id of Object.keys(edits)) if (!rows.some(r => r.ID === id)) throw new Error(`edit for missing ${id}`);
writeTable(join(here, 'draft.csv'), DRAFT_COLUMNS, out);
const n = (c: string) => out.filter(r => r.Change === c).length;
console.log(`${out.length} rows: ${n('unchanged')} unchanged, ${n('modified')} modified, ${n('new')} new, ${n('removed')} removed`);
