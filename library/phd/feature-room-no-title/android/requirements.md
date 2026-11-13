# Feature rooms: no top bar title — requirements (android)
Spec: Feature room top bar title - PM Figma 14451-2196.md (spec set 2026-11-11, Figma only: PM file UX-Issues, page 「26 11E UIUX Revamp」, block 「All Feature room：remove top bar feature naming」, section 14451:2197)
Read from the Figma text layer (get_metadata) and the section screenshot; the screens on the board are captures of today's app with their titles. The control inventory is owed (figma-pending.json: use_figma refused, Full seat). No Design or MX file was supplied.

## Room top bar
- R-001 [PM:pm-room-titles] The top bar of each of these feature rooms no longer shows the room title (「移除 Room top bar 上的 room title」): AI Try-On, Collage, AI Art, AI Hairstyle, AI Group Shot, AI Headshot, Image to Video, and the Image to Video template 「See All」 page.
- R-002 [PM:pm-room-titles] Only the title is removed: the rest of each top bar stays (back, the credit button, History; in Collage the search and ☰ buttons; in Image to Video the 「Custom」 / 「Templates」 tabs under it), and the room's content below is unchanged.
- R-003 [PM:pm-room-titles; KB: KP-020] The credit button kept in the top bar still shows the account's balance and opens the Buy Credit page.
- R-004 [PM:pm-room-titles; KB: KP-026] The History button kept in the top bar still opens My AI Artwork on that feature's own tab.
- R-005 [PM:pm-room-titles] AI Face Swap needs no change: it is removed from the app before 10/E (「AI Face Swap 於 10/E 前 in app 移除，無須調整」). — NOT TESTABLE: the room is no longer in the app.

## Open questions
- Q-1 The spec does not say whether the remaining top bar buttons move into the space the title leaves. Assumption: they stay where they are today (back at the left, the others at the right); a moved button is recorded, not filed, until PM answers. R-002; TC-001 – TC-009.
- Q-2 「Room」 is read as the feature's landing page drawn on the board (before a photo is imported or a template opened). Assumption: later pages of the same feature (photo editing, generating, result) keep their titles as today and are not checked. R-001.
- Q-3 The Image to Video capture shows the 「Custom」 tab only. Assumption: the title is gone on both 「Custom」 and 「Templates」. R-001; TC-007, TC-008.

## Added 2026-11-11 — coverage passes and standing inputs
### System back
- Each room: n/a (unchanged by this spec; only the title is removed).

### Variants
Pass 10: one line per variant.

| Requirement | Variant | Rows |
|---|---|---|
| R-001 | AI Try-On | TC-001 |
| R-001 | Collage | TC-002 |
| R-001 | AI Art | TC-003 |
| R-001 | AI Hairstyle | TC-004 |
| R-001 | AI Group Shot | TC-005 |
| R-001 | AI Headshot | TC-006 |
| R-001 | Image to Video (Custom) | TC-007 |
| R-001 | Image to Video (Templates) | TC-008 |
| R-001 | Image to Video template See All page | TC-009 |

### Domain rules
Every applicable spec / team rule of knowledge.md.

| Entry | Requirements |
|---|---|
| KP-012 Android has one paid mode: VIP = Pro = paid user | n/a (other feature or flow: only the room top bar title changes) |
| KP-014 AI Exposure is paid-only | n/a (other feature or flow: only the room top bar title changes) |
| KP-015 Mine refreshes entitlement after buying Premium | n/a (other feature or flow: only the room top bar title changes) |
| KP-016 A one-time free trial is consumed at once | n/a (other feature or flow: only the room top bar title changes) |
| KP-017 Credit Detail lists every AI use with feature name and amounts | n/a (other feature or flow: only the room top bar title changes) |
| KP-018 Credit Auto Pass keeps its own name in the Detail | n/a (other feature or flow: only the room top bar title changes) |
| KP-019 A burst of Generate taps charges once | n/a (other feature or flow: only the room top bar title changes) |
| KP-020 Blue credit button opens Buy Credit | R-003 |
| KP-021 Premium chat quota is higher, not unlimited | n/a (other feature or flow: only the room top bar title changes) |
| KP-024 Finished AI images save to their feature tab | n/a (other feature or flow: only the room top bar title changes) |
| KP-025 AI Exposure results go to Recent and the AI Exposure tab | n/a (other feature or flow: only the room top bar title changes) |
| KP-026 History button opens the feature's Artwork tab | R-004 |
| KP-027 New features' works reach Recent | n/a (other feature or flow: only the room top bar title changes) |
| KP-028 Empty Artwork filter shows Nothing yet | n/a (other feature or flow: only the room top bar title changes) |
| KP-029 Long-task tiles and completion notifications | n/a (other feature or flow: only the room top bar title changes) |
| KP-030 Saved output matches the last preview | n/a (other feature or flow: only the room top bar title changes) |
| KP-032 Features opened from Edit Room get the edited image | n/a (other feature or flow: only the room top bar title changes) |
| KP-033 Banners and deep links preselect the linked style | n/a (other feature or flow: only the room top bar title changes) |
| KP-034 Discover tip bubble lifecycle | n/a (other feature or flow: only the room top bar title changes) |
| KP-035 AI Replace: reference image or prompt enables Next | n/a (other feature or flow: only the room top bar title changes) |
| KP-036 A custom prompt reaches the generator | n/a (other feature or flow: only the room top bar title changes) |
| KP-037 AI Try-On: no face check on clothing or pets | n/a (AI Try-On face checks are not changed by this spec) |
| KP-038 AI Group Shot photo picking | n/a (AI Group Shot photo picking is not changed by this spec) |
| KP-039 Agent job finished in background shows on return | n/a (other feature or flow: only the room top bar title changes) |
| KP-040 Crop tabs keep one consistent state | n/a (other feature or flow: only the room top bar title changes) |
| KP-041 Undo, Redo and Reset | n/a (other feature or flow: only the room top bar title changes) |
| KP-042 Restored state restores highlight and transform together | n/a (other feature or flow: only the room top bar title changes) |
| KP-043 Video Editing template titles keep their look | n/a (other feature or flow: only the room top bar title changes) |
| KP-044 Video Editing panels: X discards, V commits | n/a (other feature or flow: only the room top bar title changes) |
| KP-045 Audio Range Select close target | n/a (other feature or flow: only the room top bar title changes) |
| KP-046 Try-On / Hairstyle Back keeps the style | n/a (Back after generating is not changed by this spec) |
| KP-047 Masks survive returning from Artwork or Store | n/a (other feature or flow: only the room top bar title changes) |
| KP-048 Arabic may keep Western digits | n/a (other feature or flow: only the room top bar title changes) |
| KP-049 Localised strings keep their placeholders | n/a (other feature or flow: only the room top bar title changes) |
| KP-050 RTL mirrors layout, not only text | n/a (other feature or flow: only the room top bar title changes) |

### Request ledger coverage
Every open table entry of requests.md for android.

| Ledger entry | Requirements |
|---|---|
| REQ-001 | R-001 – R-005 (the whole table) |
| REQ-002 | n/a (platform scope: this Android table only) |
