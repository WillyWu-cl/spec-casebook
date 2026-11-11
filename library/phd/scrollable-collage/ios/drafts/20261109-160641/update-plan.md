# Update plan — phd/scrollable-collage / ios: approved v1 → draft 20261109-160641
## Spec files
- Unchanged: PM Figma page 2171:2 (all 14 boards unchanged) · New or changed: Design Figma page 0:1 re-read 2026-11-09 (figma-check: 4 boards changed, 1 new) · No longer supplied: none
- Same spec set (specs/2026-11-05); REQ-003.
## What changed in the Design
- New board design-launcher (「entry」 199:3566): the PhotoDirector Launcher (Home) with a 「Swipe Collage」 shortcut in the Features grid (after 「AI Art」, no badge), plus three loose icon frames beside it (199:3307, 199:3315, 201:4615: Swipe Collage shortcut icon art).
- design-dark-add-layer and design-icons-dark: the dark-mode centre [+] (round/ic_square_plus_filled, and its 「press」 state on the icon sheet) changed fill from orange #FFBE98 to near-white #FFF8F5. Texts, controls and arrows unchanged; no row asserts this colour (left to the design check).
- design-icons-cut: a new 28×28 ic_swipe_collage icon added beside the banner cut. No row depends on it.
- design-light-entry: a hidden 100×100 helper frame 「icons (dark-mode source)」 (116:3014) behind the banner screen was deleted. Nothing visible changed.
- figma-text: no new or gone lines on any re-read board (all texts identical); the new Launcher board has no baseline yet.
## Requirement changes
| Requirement | Change | Before | After |
|---|---|---|---|
| R-007 | modified | This build has no Launcher shortcut for Swipe Collage (PM D0-04, D0-06, D1-08) | The Launcher's Features grid shows a 「Swipe Collage」 shortcut after 「AI Art」 (Design 「entry」 199:3566, newer than the PM file; Q-21) |
| R-168 | new | — | Tapping the Launcher's 「Swipe Collage」 opens the Template Page, as the banner does (no arrow drawn; Q-21) |
## Case changes
- New (1): TC-151 (R-168) Launcher › 「Swipe Collage」 opens the Template Page; placed right after TC-009 (REQ-033)
- Modified (1): TC-009 now expects the 「Swipe Collage」 shortcut in the Launcher's Features grid (was: no shortcut); P3 → P2
- Removed (0)
- Unchanged: 149
## Found by the analysis
- Annotation trace: 153 blocks traced (all carried; the new Launcher board has no annotation block).
- Control trace: 17 Launcher controls added: the 「Swipe Collage」 shortcut → TC-151; 「Collage」 → TC-001, TC-002; the other shortcuts, tabs, premium, settings, 「Features ›」 and 「Edit」 → n/a: other feature (shared Launcher).
## Not added (value check)
- Colour of the dark [+] and the new icon art: design check (figma skill), not table rows.
## PM-only rows
- TC-009 (PM pm-header D0-06): Design now draws the Launcher → modified.
## Questions for PM
- Q-21 The Design's new Launcher frame shows a 「Swipe Collage」 shortcut, but the PM header (D0-04, D0-06, D1-08) and the Design's own overview still say the Launcher shortcut is not in this build. Is it in this build, where does it lead, and does it send its own tracking 「from」 value?
## Questions for you
- Follow the newer Design frame for TC-009 / TC-151 (as drafted), or keep the approved "no shortcut" row until PM answers Q-21?
