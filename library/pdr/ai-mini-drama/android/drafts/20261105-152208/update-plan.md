# Update plan — pdr/ai-mini-drama / android: approved v9 → draft 20261105-152208
## Spec files
- Unchanged: the 2026-10-21-2 PDFs · New or changed: PM Figma (5 new boards, redrawn boards found by the 2026-11-05 change check), Design Figma (`video` and `main flow` redrawn, two undated 「Template」 frames) · MX Figma unchanged since 10/29 · No longer supplied: none
- What each board now says: `specs/2026-10-21-2/extracted/board-notes.md` › 「Figma changes found 2026-11-05」.

## Requirement changes
| Requirement | Change | Before | After |
|---|---|---|---|
| R-078 | modified | Download: the button turns into a spinner, then 「Saved to your device.」 | Full-screen loading (black 60 % mask, centred spinner), then the toast (PM 11/3) |
| R-080 | modified | Card 「{n} scenes couldn't be generated. / Fix these issues to export your drama.」 | Title 「Fix {n} scenes to export your drama.」 (count only), body by cause (R-487); PM 11/3 and Design `video` agree |
| R-088 | modified | No auto-scroll; ↓ when new content is below | PM 11/4 §13.2 ④: once the user scrolled, nothing auto-scrolls until ↓, the bottom or a new send |
| R-089 | modified | Back from Character Library / Full Edit / History → bottom | Also back from the scene edit page and opening a drama from History (PM 11/4 §13.2 ①) |
| R-138 | modified | Every Stop tells what stops and whether credits are lost | Holds for charged jobs; uncharged replies stop with ■ keeping what was shown (R-486) |
| R-245, R-247 | modified | 「This usually takes about 1 minute.」 | 「This may take a moment. Keep this screen open.」 (PM 10/30, newer than the Design) |
| R-279, R-458 | modified | Generate removes the card, no user bubble | Generate sends the card's Answer (「Create storyboard」…) as a user message pinned at the top (PM 11/4 §13.2 ②); answers Q-A8 for action cards |
| R-315 | modified | No ■ after Generate | Unchanged for charged jobs; notes the 11/4 uncharged exception |
| R-485 | new | – | §13.2 ③: results replace in place; a new message scrolls to its start, not the bottom |
| R-486 | new | – | Uncharged replies (Iris replies, outline, storyboard pricing) stop with ■, keep what was shown, no charge |
| R-487 | new | – | Fix card body by cause: moderation / server busy / both, singular forms |
| R-488 | new | – | 「terms of service」 link; per-scene cause after Fix scenes |
| R-489 | new | – | §13.25 one clip regeneration at a time (40 % + toast, no send, no charge, prompt kept) |
| R-490 | new | – | §13.25 (10/30) one storyboard image at a time; ↻ on thumbnails; error-card Edit not disabled |
| R-491 | new | – | §13.27 empty filter result + Clear filters, every tab incl. Mine |
| R-492 | new | – | §13.28 「Fix Scene {n} first?」 dialog, Go to / Not now |
| R-493 | new | – | §13.28 when the dialog does not show; next failed scene becomes the earliest |
| R-494 | new | – | PM update 11 flow arrow 4325-27346 (X → 「Discard this character?」), walked by TC-057 |
| Q-A7 | modified | Which generations follow the no-pause rule | Outline answered (■ allowed, R-486); rest open |
| Q-A8 | answered | User bubble after Generate? | Yes for action cards (Answer text, pinned); video card is Q-A20 |

## Case changes
- New (20): TC-566 (R-491) after TC-036; TC-567 (R-491) after TC-566; TC-568 (R-491) after TC-567; TC-555 (R-279, R-250) after TC-377; TC-564 (R-490) after TC-070; TC-565 (R-490) after TC-564; TC-569 (R-492) after TC-565; TC-570 (R-492) after TC-569; TC-571 (R-492) after TC-570; TC-572 (R-492, R-493) after TC-571; TC-573 (R-493) after TC-572; TC-559 (R-080, R-487) after TC-091; TC-560 (R-487) after TC-559; TC-561 (R-488) after TC-560; TC-562 (R-489) after TC-144; TC-563 (R-489) after TC-562; TC-558 (R-486) after TC-155; TC-556 (R-089) after TC-311; TC-557 (R-089) after TC-556; TC-554 (R-485) after TC-344
- Modified (10): TC-041 — R-245 / R-247 changed (PM 10/30, pm-update-9): the time hint gives no time any more; newer than the Design frame; TC-057 — New flow-arrow requirement R-494 (PM update 11 arrow 4325-27346 found 11/5): this row walks it; TC-377 — R-279 changed (PM 11/4 §13.2 ②, pm-1002-update C2): Generate now sends 「Create storyboard」 as a user message pinned at the top; answers Q-A8 for action cards; TC-089 — R-078 changed (PM 11/3 §8, pm-update-5): download shows a full-screen loading with a 60 % black mask instead of a spinner on the button; TC-091 — R-080 changed (PM 11/3 board 4982:27069; Design video 11/5): the card title gives the count and the body the cause; TC-499 — R-080 changed (PM 11/3): the Fix card title has its own singular 「Fix 1 scene to export your drama.」; TC-100 — R-088 changed (PM 11/4 §13.2 ④): once the user has scrolled nothing auto-scrolls until ↓, the bottom, or a new send; TC-153 — R-138 changed, new R-486 (PM 11/4 §13.24 addition, 4422:2): outline generation is uncharged and may be paused with ■; stopping keeps what was shown; TC-155 — R-138 changed, new R-486 (PM 11/4 §13.24 addition): an Iris reply (chat revision) is uncharged and may be paused with ■; stopping keeps what was shown; TC-332 — R-245 / R-247 changed (PM 10/30, pm-update-9): the time hint gives no time any more; newer than the Design frame
- Removed (0)
- Unchanged: 493
- Order: every new row sits right after the row it extends (REQ-033); the next round runs the new and modified rows first.

## Found by the analysis
- The change check also flagged boards whose only change was an arrow drawn over them that the 10/28 reads missed (overlays, 11/4 rule). The re-read ones (pm-update-11) added one arrow, 4325-27346 → R-494; the others are still owed (below).
- Design `video` now draws the 11/3 Fix card copy, so the Fix-card rows are not PM-only. Every other new row is PM-only (「PM-only: no Design frame yet」).
- PM 11/4 §13.2 ② makes the user bubble on 「Create storyboard」 correct (Android ticket DRA262610P0122 reported that bubble as a bug; it now matches the spec, noted on TC-377).

## Not added (value check)
- Design `main flow` redraw: its texts match the PDF OCR (status lines, skeleton note); nothing new to test until the full re-read shows otherwise.
- PM 11/4 ⑤ (new results come as a new message): already R-062 / Q-17 (10/20 §13.2 ③), rows TC-073, TC-501.
- §13.25 「applies to Fix Scene › Edit」: covered by the scene edit page row (same button); no separate row.

## Left undone (Figma reads owed)
- Inventory re-reads that dropped mid-call (figma-pm / figma-design transport, 2026-11-05): PM q3, q8, u1a, u1b, u3b, u9a1, u9a2, u9b, eb, mf32, mf33 and the two new groups (q12: 4784:70878, 4982:27069, 5014:26418; q13: 5128:8, 5212:27212), Design d1 (`main flow`). Their words were read by text-only calls, so the rules are in; their controls, arrows and screenshots are not (the five new PM boards are not on the coverage page yet). `figma-check.ts --compare` stays CHANGED until they are read.
- Board screenshots: none re-captured (they follow the re-reads; capturing before would only be re-captured again). board-lint warnings on `main flow`, `MX`, `pm-1002-update` (note-moved) come from those stale images.
- After approval: `node scripts/figma-text.ts pdr/ai-mini-drama 2026-10-21-2 --accept --board pm-error-handling-c,pm-main-flow-11,pm-main-flow-13,pm-main-flow-21,pm-main-flow-22,pm-main-flow-34,pm-update-11,video`.

## Questions for you
- Q-A20: does Generate Video also send a user message (11/4 §13.2 ②), or does the settings card turn into the skeleton in place (10/22)? Rows assume in place.
- Q-A21 (RD): can v1 tell 4xxx from 5xxx for the Fix card? Rows assume the cause-specific copy.
- Q-A22 (Design): which 「Template」 all-categories layout ships, 3 or 4 covers per row?
