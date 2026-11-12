# Update plan — phd/swipe-collage / android: approved v2 → draft 20261112-094820

Request: REQ-008 (user, 2026-11-12): update the table from spec set 2026-11-05 and the Design Figma, then run it on
Android. Rebuild the rows with `node library/phd/swipe-collage/android/drafts/20261112-094820/build-draft.ts`.

## Spec files
- Unchanged: the PM rules. `Swipe Collage PhDM Spec.pdf`'s text layer is identical to the right half of `Collage.pdf`
  (the "Demo + Spec" boards), so no PM rule, TBD or flow-table line changed.
- New: the Design Figma file Swipe_collage (iUy5kOrVNG7IjcyxGGnp9t, page 0:1 「20261029_Swipe Collage」): 28 phone
  frames in light and dark mode, two canvas icon-button sheets. It draws no arrows. Read from the committed source read;
  1 extra `use_figma` call read the page's loose texts (all copies of PM notes).
- No longer supplied: the left half of `Collage.pdf` (early PM sketch, plan notes). Everything in it was restated by
  the spec half; requirements that cited `pm-sketch` / `plan-notes` keep their meaning.
- Source order: the Design page (dated 20261029) and the PM text (unchanged since 10/29) cannot be ordered by date
  (Q-28), so the Design decides UI and layout (format rule) and rows say 「check on device」 where the PM differs.

## Requirement changes
| Requirement | Change | Before | After |
|---|---|---|---|
| R-003 | modified | banner copy open (Q-1), 「NEW」 tag | 「Try Swipe Collage!」 / 「Create the perfect year-end recap post.」 / 「›」; NEW tag Q-18 |
| R-004, R-010 | modified | 「Scrollable Collage」 | 「Swipe Collage」 |
| R-008 | modified | category selected | also scrolled into view (KP-033) |
| R-016 | modified | 「PRO」 label | PRO crown icon |
| R-022 | modified | — | page dots; Design typo 「5pages」 (Q-30) |
| R-030, R-031 | modified | top ‹ / ↶ ↷ / 「Export」 | bottom row ✕ ↶ ↷ ✓, no top bar |
| R-033 | modified | Canvas 「‹」 | Canvas ✕ |
| R-036, R-037, R-039 | modified | 「Select up to 3 photos」, 「Done (2)」 | Photo / Stock tabs, albums, tray 「Please select 3 photos to continue.」 「(n/3)」, ✓ |
| R-042, R-043 | modified | — | orange outline, floating bar; 7th item labelled 「Removal」 in the Design (Q-19) |
| R-049, R-054 | modified | PRO tags on Removal / Enhance | the Design draws none (Q-20); 「Fliter」 typo (Q-30) |
| R-055, R-056 | modified | room named only | room contents as drawn |
| R-061 | modified | existing IAP page, 「Continue」 | 「PhotoDirector Premium」 + ✕ checked; Design 「Start 7-Day Free Trial」 layout (Q-21) |
| R-079, R-080, R-083 | modified | ✕, 8 × 4 swatches, 「Custom color」 | ⌄, ✕ / ✓, colour-wheel swatch, rows of 7 (Q-22) |
| R-086 | modified | ✕ keeps (TBD-4) | ✕ next to a new ✓ (Q-5 widened) |
| R-087 – R-092, R-095 | modified | PM panel mocks | Design Add Layer card (Q-23), text editor, sticker / bubble panels, Frame board (Q-24), Layers ⌄ ✕ ✓ |
| R-099 | modified | 1:1 / 4:5 / 5:4 / 3:4 / 4:3 / 9:16 / 16:9 | Custom / Original / Square / 2:3 / 3:2 / 3:4 … (Q-25) |
| R-103 – R-113 | modified | ≡ handle, row + / bottom − + | ↔ move button, strip + , − \| + stepper, greyed disabled states |
| R-119, R-120, R-122 | modified | images saved on Export; IG / FB / More | ✓ opens Save & Share with 「Save」 / 「Save this image only」; Twitter / Line / Tiktok (Q-26) |
| R-131 | modified | — | cites KP-012 (one Android paid mode) |
| R-205 | new | — | page dots on template cards |
| R-206 | new | — | ✓ on every bottom sheet |
| R-207, R-208, R-209 | new | — | Save this image only; preview swipe + counter; one-page Save & Share |
| R-210 | new | — | light and dark versions of every screen (Q-31) |
| R-211 | new | — | Enhance credit button and 5-credit price (Q-27; KP-020) |
| R-212 | new | — | saved images match the preview (KP-030) |
| R-213, R-214 | new | — | picker tray ✕ deselect; Stock tab |
| R-215, R-216 | new | — | text editor B / I / alignment / clear; floating edit / duplicate / delete on text and bubbles |
| R-217 | new | — | ↷ only after an undo (KP-041) |
| (none removed) | | | |

## Case changes
- New (18), each placed after the row it extends (REQ-033):
  - TC-180 (R-217) after TC-031: ↷ unavailable before an undo.
  - TC-170 (R-213), TC-171 (R-214) after TC-041: tray ✕ deselect; Stock tab.
  - TC-172 (R-211) after TC-065: Enhance credit button and 5-credit price (record the charge, Q-27).
  - TC-173 (R-206) after TC-098: Background ✓.
  - TC-174 (R-215), TC-175 (R-216) after TC-101: text editor styles; floating bar on text / bubble.
  - TC-176 (R-206) after TC-117: Ratio ✓.
  - TC-177 (R-208) after TC-136; TC-178 (R-207) after TC-137; TC-179 (R-209) after TC-178.
  - TC-181, TC-182, TC-183 (R-122) after TC-143: Twitter, Line, Tiktok.
  - TC-184 (R-134) after TC-164: system Back on the Add Layer card.
  - TC-185 (R-134) after TC-167: system Back in the AI Enhance room.
  - TC-186, TC-187 (R-210), new section Appearance after Android Back: dark and light mode.
- Modified (69): the strings, controls and layouts above. Main groups:
  - Entry / Template Page: TC-001, TC-003, TC-006, TC-009, TC-015, TC-016, TC-021.
  - Canvas exit and undo: TC-026, TC-031 – TC-035 (✕ and the bottom row).
  - Photo picker: TC-040 – TC-046 (tray, ✓).
  - Focus toolbars and rooms: TC-048, TC-056, TC-061, TC-062.
  - Sheets: TC-090, TC-093, TC-094, TC-098, TC-099 – TC-104, TC-106 – TC-108, TC-113 – TC-117.
  - Pages: TC-072, TC-118, TC-120, TC-121, TC-124 – TC-127 (↔ move button, stepper, greyed states).
  - Export: TC-136 – TC-139, TC-141 – TC-143 (✓ → Save & Share → 「Save」; KP-030 on TC-137).
  - Monetization: TC-145 – TC-147, TC-149 – TC-151, TC-153 – TC-155 (export = ✓ + 「Save」; Enhance left out of the
    no-credit journey, Q-27).
  - Android Back: TC-158, TC-162, TC-164.
- Removed (0).
- Unchanged: 100.

## Found by the analysis
- Annotation trace: 80 blocks of the PM text layer traced (`annotation-trace.json`, first trace for this feature: the
  earlier drafts had none); TBD block → Q-2 – Q-9.
- Control inventory (REQ-038): 76 Android control groups from the Design (`inventory.json`, built offline from the
  source read); all traced in `control-trace.json`: 62 pressed by rows, 14 n/a (Collage room controls of another
  feature, existing Removal / Enhance room controls the spec gives no rule, the 「Start 7-Day Free Trial」 purchase,
  the sheet collapse ⌄, the 「1/5」 counter). New rows for untraced Design controls: TC-170, TC-171, TC-174, TC-175,
  TC-176, TC-181 – TC-183.
- Pass 1 (arrows): the Design has no arrows; the 65 PM flow-table and red-back arrows carry over (`arrows.json`); rows
  that walk them now press the Design's control (✕, ✓, tray ✓, ↔).
- Pass 8 (exits): new Exit × stage lines for the Add Layer card (TC-107, TC-184) and the text editor (TC-102, TC-164);
  System back adds the Enhance room (TC-185).
- Pass 9 (hidden clauses): R-207 (one image saved, TC-178), R-212 (files match the preview, TC-137), R-211 (credits
  charged, TC-172).
- Pass 10 (variants): R-061 per tier / trigger; R-122 per share target; R-120 / R-207 / R-209 Save variants; R-210
  light / dark; R-099 every ratio the bar offers.
- Standing inputs: request ledger REQ-008 added and cited; domain knowledge read (`knowledge.md`): KP-012, KP-020,
  KP-030, KP-033, KP-041 applied, the other rules listed n/a under Domain rules; no Testing Request / RD build note was
  named for this update, so no Build checks; no eBugs filed for this feature yet.

## Not added (value check)
- PM-only 「Search by keywords」 in the sticker panel: not a row of its own (the Design draws category tabs); TC-103
  searches only if the panel has it.
- 「You might also like」 items (Draw to Image, AI Removal): other features' promotion; TC-179 checks the section is
  there, not where each card goes.
- Enhance room history button, Removal room PRO toggle / info / compare: existing rooms with no Swipe Collage rule
  (n/a in the control trace).
- IAP prices (「$2.49/month」, 「NT$234.00 /month」, 「$29.99/year」) and 「Start 7-Day Free Trial」: store prices and a
  purchase; not asserted while the IAP version is open (Q-21).
- A row per Design typo: covered by the rows reading those strings (Q-30).
- Light / dark: one journey row per theme (TC-186, TC-187), not a row per screen.

## PM-only rows
- None new. Rows the Design redraws now follow it with the PM wording in Notes and 「check on device」 (Q-28).

## Questions for PM
- New: Q-18 (banner NEW tag), Q-19 (frame toolbar 「Removal」 item), Q-20 (no PRO tag on Removal / Enhance), Q-21 (IAP
  page version), Q-22 (swatch grid), Q-23 (closing the Add Layer card), Q-24 (Frame panel board shows textures), Q-25
  (ratio list, Custom / Original), Q-26 (share targets incl. TikTok vs D5-01), Q-27 (Enhance credits vs D4-01), Q-28
  (Design vs PM dates), Q-29 (✓ = Export), Q-30 (Design typos), Q-31 (dark mode source).
- Widened: Q-5 (✕ now sits next to ✓), Q-15 (does 「Save this image only」 count), Q-3, Q-9, Q-14, Q-17.
- Still open: Q-2, Q-4, Q-6, Q-7, Q-8, Q-10, Q-12, Q-13, Q-16.
- Answered by this spec set: Q-1 (copy and title from the Design), Q-11 (the Design Figma came and was read).

## Questions for you
- Light / dark rows (TC-186, TC-187) change the phone's dark theme, a system setting: OK to switch it during the run?
- Rows that follow the Design where the PM differs are marked 「check on device」: findings on them are held until
  Q-28 is settled, not filed.
