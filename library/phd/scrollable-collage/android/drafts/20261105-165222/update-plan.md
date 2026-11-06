# Update plan — phd/scrollable-collage / android: new table → draft 20261105-165222

## Spec files
- New: Scrollable Collage - PM and Design Figma.md (Figma-only spec set 2026-11-05: text snapshot of PM page 2171:2 and Design page 0:1, read through figma-pm / figma-design; no PDF)

## Requirement changes
New table: 166 requirements (incl. 17 flow-arrow requirements and the NOT TESTABLE metric / CMS blocker).

## Case changes
- New (163): every row. By section: Entry 9, Template Page 9, Template Preview 6, Canvas 7, Photo import 7, Frame focus 8, Image focus and tools 16, Swap and frame styles 7, Lock 8, Add Layer 9, Background 9, Layers 6, Ratio 5, Pages 16, Leave and resume 6, Export and Save & Share 10, PRO content and IAP 7, Light and dark mode 2, Tracking 2, Android system Back 14
- Modified (0) · Removed (0) · Unchanged: 0

## Found by the analysis
- Annotation trace: 153 blocks traced (PM notes by their decision ids; Design phone texts as ui / requirements; TBD cards → Q-6…Q-13, Q-1).
- Flow arrows: 34 PM 「<from> --> <to>」 frames listed by hand in arrows.json, each with a requirement and a row; 10 SCRL pointer lines marked not_flow.
- Design vs PM: the Design canvas has no top bar (✕ ↶ ↷ ✓ at the bottom), every sheet has ✕ / ✓, the picker confirms with an orange ✓ — rows follow the Design (Q-20, Q-10, Q-4). Save & Share buttons follow the newer PM 11/3 update.
- Pass 9 hidden clauses: analytics events (parked until an event log), no album save on Removal / Enhance apply, no credit, 1080 px short side.
- Pass 10 variants: Free / Pro tiers on export, every-3rd-save and Removal / Enhance; PRO template / frame / texture; light / dark appearance; seven ratios; deeplink parameters; Eastern / Western thumbnails; Save all / Save this image.
- Pass 11 controls: 91 control groups traced (pressed or n/a: Collage room, Object Removal, AI Enhance and IAP purchase controls are other features); added rows for the text-style buttons, the bubble 「none」 choice and every share icon. Android: system Back rows for every page, sheet, dialog and picker (### System back).
- Domain knowledge: KP-012 (Pro = paid), KP-030 (saved = preview), KP-033 (deeplink preselects), KP-041 / KP-042 (undo / redo), KP-049 (number placeholders) applied; others n/a with reasons.

## Not added (value check)
- PM success metric (Export_Done ÷ Canvas_Appear): product metric, NOT TESTABLE (R-165).
- CMS type / contentVer / sheet (MOCK_CMS_TYPE): RD handoff blocker, NOT TESTABLE (R-166, Q-17).
- SCRL competitor behaviour (video, drawing, template links, projects, favourites, 7-day trial): out of scope by the PM [D5-01, F11]; only the "we do not" rules are rows.
- Object Removal / AI Enhance / IAP page internals (selection tools, Standard / Advanced, credit pill, Start 7-Day Free Trial): existing rooms, unchanged; rows only enter, apply, cancel and close. No purchase is made (Start 7-Day Free Trial parked).
- Collage room controls other than the banner (layout tabs, search, menu, View all): existing room, unchanged.
- Launcher shortcut behaviour: not in this build [D1-08]; one row checks it is absent.
- Light / dark: two appearance rows walk the screens; per-screen colour checks belong to the figma skill's design check.
- Analytics rows (ScrollableCollage_*) are kept but parked until an event log is available (needs: analytics log).

## PM-only rows
- TC-003, TC-004, TC-005, TC-006, TC-007, TC-008, TC-009, TC-012, TC-014, TC-015, TC-016, TC-021, TC-023, TC-030, TC-031, TC-033, TC-036, TC-037, TC-045, TC-054, TC-056, TC-059, TC-061, TC-063, TC-064, TC-065, TC-066, TC-067, TC-068, TC-069, TC-070, TC-071, TC-072, TC-073, TC-074, TC-075, TC-076, TC-077, TC-084, TC-092, TC-099, TC-103, TC-104, TC-109, TC-110, TC-111, TC-112, TC-113, TC-114, TC-115, TC-116, TC-117, TC-118, TC-119, TC-120, TC-121, TC-123, TC-124, TC-125, TC-126, TC-127, TC-128, TC-131, TC-132, TC-135, TC-137, TC-138, TC-139, TC-140, TC-141, TC-142, TC-143, TC-144, TC-145 (74 rows; PM: no Design frame yet (Design 2026-10-29)): rules the Design does not draw (deeplinks, card swipe, East / West thumbnails, Day-1 count, locks, frame switching, Pages limits and dialogs, leave / resume, export counting, IAP every 3rd save, tracking). Re-check each when the Design draws it.

## Questions for PM
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

## Questions for you
- Rows that need real CMS guids (deeplinks) and an analytics event log are parked until RD provides them; PRO content rows need at least one PRO template, frame and texture on the CMS.
