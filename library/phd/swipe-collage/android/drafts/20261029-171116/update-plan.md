# Update plan — phd/swipe-collage / android: new table → draft 20261029-171116

## Spec files
- New: Collage.pdf (one Figma export page; current spec = right half 「Demo + Spec — Scrollable Collage (26 11E)」, left half
  = earlier PM sketch, restated by the right half). No Figma links supplied.

## Case changes
- New (169): TC-001 – TC-169, every row `new` (Entry 8, Template Page 12, Template Preview 5, Canvas 14, Photos 8,
  Frame focus 8, Image focus 13, Swap and drag 4, Frame styles 6, Locks 11, Background 9, Add Layer 9, Layers 6,
  Ratio 4, Pages 18, Export 9, Monetization 11, Android Back 14).

## Found by the analysis
- Spec rule IDs: every ID the board prints (D0-01 – D5-01, F1 – F17) is cited by a requirement.
- Flow arrows: 60 rows of the Screen × Button → Next table (ft-01 – ft-60) and 5 red back arrows (dr-01 – dr-05), each
  walked by a row (R-140 – R-204).
- Pass 8 / Android system Back: 14 rows (TC-156 – TC-169), the spec draws none (Q-14).
- Pass 9 hidden clauses: 7 (album, My AI Artwork, export counting, credits, pixel sizes, restore).
- Pass 10 variants: Free / Premium for Removal, Enhance, every-3 IAP and PRO-content IAP; PRO template / frame / texture;
  7 ratios; 5 Add Layer functions; 3 share targets.
- TBD-1 … TBD-8 rows are written from PM's proposed answer and say so in Notes (Q-2 – Q-9).

## Not added (value check)
- Analytics events ScrollableCollage_Canvas_Appear / _Export_Done (R-132): no event viewer on the phone; NOT TESTABLE.
- Product goals, success metric, release date (R-133) and SCRL scope notes (R-135): nothing to observe.
- plan-notes board (CMS / Design schedule, save-as-template tool): project plan, not app behaviour.
- Purchase from the IAP page (「Continue」): never tapped in runs (purchase); only ✕ and Back are rows.
- Error / offline states: the spec draws none (Job states grid n/a); not invented.

## Parked (need fixtures)
- TC-005 – TC-008: deeplink URLs from RD (Q-10).
- TC-145, TC-146: a Free account whose export counter is fresh (new install or new account).
- TC-064 – TC-068, TC-147, TC-153: a Premium account on the phone.
- TC-141, TC-142: Instagram and Facebook installed and signed in.

## Questions for PM
- Q-1 banner copy / feature name; Q-2 – Q-9 TBD-1 … TBD-8; Q-12 East / West thumbnails; Q-13 undo after Pages;
  Q-14 Android Back; Q-15 every-3-saves timing; Q-16 Continue editing location; Q-17 Discard on an unedited canvas.

## Questions for you
- Q-10 Can RD send the deeplink test URLs? Q-11 Please send the Figma link(s) of this spec so frames newer than the PDF
  and the control inventory can be read (needs the figma-pm sign-in).
