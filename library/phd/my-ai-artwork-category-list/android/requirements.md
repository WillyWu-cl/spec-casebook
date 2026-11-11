# My AI Artwork: All categories — requirements (android)
Spec: my ai artwork category list.pdf (spec set 2026-11-11; PM page 「My Artwork: Artwork category list add filter Demo + Spec」, 11/E, ledger 2026-10-28)
Read from the PDF text layer and region renders; the PM Figma page (UX-Issues 「26 11E UIUX Revamp」, REQ-004) was compared on 2026-11-11: its spec section 14567:1713 is the PDF (same pixels), and its 「draft」 section 14452:6990 is read as board pm-draft. The Figma control inventory is still owed (figma-pending.json: use_figma refused, Full seat). No separate Design or MX file was supplied; the mockups are iPhone frames and their strings are used as the expected UI text.

## Entry and tab bar
- R-001 [PM:pm-entry-flow; PM:pm-recent] My AI Artwork opens on 「Recent」, the first tab, as today (「預設落在 Recent（第一個 tab）」).
- R-002 [PM:pm-overview; PM:pm-recent; PM:pm-entry-flow] The tab bar has a ☰ button fixed at its far right (「tab 列最右邊固定 ☰」): it stays at the right edge while the tabs are scrolled and whichever tab is selected.
- R-003 [PM:pm-recent] The tab bar itself is unchanged: 「Recent」 first, every other tab in alphabetical order.
- R-004 [PM:pm-recent; Req: REQ-006] Tabs of features with no works are still shown in the tab bar, and such an empty tab shows 「Nothing yet.」 and 「Start to Create」; 「Create More」 shows only on a tab with works (the spec's 「有 Create More」 corrected by REQ-006).
- R-005 [PM:pm-recent; PM:pm-overview] The Recent list, the 「Photo」 / 「Video」 filter and 「Select」 work as today (the 8/E Recent spec, 「26 8E Recent」), i.e. as the app behaves now (Q-1 answered, REQ-003); Recent gets no list / grid switch (not done, manager decision 10/27).

## All categories sheet
- R-010 [PM:pm-entry-flow; PM:pm-all-categories; PM:pm-overview] Tapping ☰ opens a sheet titled 「All categories」 (with ✕) over My AI Artwork.
- R-011 [PM:pm-all-categories] The sheet's rows are exactly the tab bar's tabs (「項目跟 tab 列一模一樣」): the same tabs with the same names, none missing and none extra.
- R-012 [PM:pm-all-categories] The rows are in the tab bar's order: 「Recent」 first, the others in alphabetical order.
- R-013 [PM:pm-header; PM:pm-overview] The sheet lists every feature (today 「20 幾個 tab」, more than 20), so each one can be reached from it without scrolling the tab bar; the list scrolls down to the last feature.
- R-014 [PM:pm-all-categories; PM:pm-overview; PM:pm-draft] Rows show the feature name only: no work count this version (the server API gives no count, RD 10/28), and no count on the tabs either.
- R-015 [PM:pm-all-categories; PM:pm-overview] Rows of features with no works look like every other row (「沒作品的也不灰字」): not greyed.
- R-016 [PM:pm-all-categories] The row of the current tab is highlighted in peach; the other rows are not.
- R-017 [PM:pm-overview] Not in this version (manager decision 10/27): no Expiring list, no search, no favourites in My AI Artwork or the sheet.

## Choosing a category
- R-020 [PM:pm-entry-flow; PM:pm-all-categories; PM:pm-overview] Tapping a row closes the sheet and switches My AI Artwork to that tab, the same as tapping that tab today (「切到該分類的 tab（同 今天）」): the tab is selected in the tab bar and its works are shown; a tab chosen from the sheet is scrolled into view in the tab bar (Q-6 answered, REQ-003).
- R-021 [PM:pm-all-categories] Tapping the row of a feature with no works also closes the sheet and switches to that feature's empty tab.
- R-022 [PM:pm-all-categories] Tapping the current tab's row (「點任一列」) closes the sheet and stays on that tab.
- R-023 [PM:pm-all-categories; PM:pm-draft] Tapping a row while works are selected in multi-select (「Select」) switches to that tab and cancels the selection (「多選中點 → 切過去並取消選取」): multi-select ends (Q-5 answered, REQ-003).
- R-025 [PM:pm-draft] Switching to another tab in the tab bar while works are selected in multi-select also goes to that tab and cancels the selection (draft 「選取狀態」: 「倘若用戶多 select 時切換 tab/category, 會帶他到目的並取消選取」, 「多選的行為比照現行」).
- R-024 [PM:pm-overview] The sheet takes the user straight to old works that are hard to find in the tab bar, e.g. 「AI Art」 (QA ticket PHI262609-0006).

## Closing the sheet
- R-030 [PM:pm-entry-flow; PM:pm-all-categories] The sheet's ✕ closes it without changing the tab (Q-3 answered, REQ-003).
- R-031 [PM:pm-entry-flow] The sheet draws a grabber over a dimmed page: dragging it down or tapping the dimmed page closes the sheet without changing the tab (Q-3 answered, REQ-003).
- R-032 [PM:pm-all-categories] Android system Back with the sheet open closes the sheet only and stays on My AI Artwork on the same tab (Q-3 answered, REQ-003).

## No charge
- R-040 [PM:pm-overview] The feature is pure UX and free (「純 UX，不收費」): opening the sheet and choosing a category asks for no upgrade and charges no credits, for a free and a paid user.
- R-041 [PM:pm-overview] The feature ships on iOS and Android at the same time (「iOS + Android 同時」). — NOT TESTABLE: release scheduling; each platform has its own table.

## Entry from a feature
- R-060 [KB: KP-026; PM:pm-all-categories] Opening My AI Artwork from a feature's History button lands on that feature's tab, and the sheet then highlights that feature's row in peach.

## Tracking events
- R-050 [PM:pm-overview] Opening the sheet sends 「Artwork_FeatureList_Appear」 with from_tab = the tab it was opened from.
- R-051 [PM:pm-overview] Choosing a category in the sheet sends 「Artwork_Category_Select」 with category = the chosen feature and source = sheet.
- R-052 [PM:pm-overview] Tapping a tab in the tab bar sends 「Artwork_Category_Select」 with category = that feature and source = tab.

## Flow arrows
- R-070 [PM: flow arrow pm-entry-flow-a1  (PDF board pm-entry-flow, no Figma link)] My AI Artwork (Recent) ☰ → 「All categories」 sheet: tapping ☰ opens the sheet. Walked by: TC-006.
- R-071 [PM: flow arrow pm-entry-flow-a2  (PDF board pm-entry-flow, no Figma link)] 「All categories」 「AI Creative Studio」 row → the 「AI Creative Studio」 tab: the sheet closes on that tab. Walked by: TC-013.

## Open questions

## Answered questions (2026-11-11, Cases page)
- Q-1 — 同今天意思是照目前當下的狀態 → 「as today」 is the current behaviour of the app; the ledger and the 8/E Recent spec are not needed. REQ-003; R-003, R-004, R-005.
- Q-2 — 先當 PDF 是完整的 → the PDF is taken as complete. The Figma link came later (REQ-004): its spec section is the same as the PDF; only the control inventory is still owed. REQ-003, REQ-004.
- Q-3 — 預期都會關閉清單 → ✕, the grabber, the dimmed page and system Back each close the sheet, tab unchanged. REQ-003; R-030, R-031, R-032.
- Q-4 — 只在英文檢查 → the alphabetical order is checked in the English UI only. REQ-003; R-003, R-012.
- Q-5 — 結束多選 → choosing a category during multi-select ends multi-select. REQ-003; R-023.
- Q-6 — 會 → the chosen tab is scrolled into view. REQ-003; R-020.
- Q-7 — 不用檢查 → the header 「建議句」 is not an app string; no row. REQ-003.

## Added 2026-11-11 — coverage passes and standing inputs
### Job states
| Job | Start / loading | Success | Failure | Retry | Leave and return | Longest wait | Done notice |
|---|---|---|---|---|---|---|---|
| Open the sheet and switch tabs | n/a (no server job: the list is the tab bar's tabs) | TC-006, TC-013 | n/a (spec silent) | n/a (no job) | n/a (spec silent) | n/a (no job) | n/a (no notice) |

### Error classes
| Job | Error classes |
|---|---|
| All jobs | n/a (the spec names no error classes or failure copy) |

### Exit × stage
| Stage | ✕ | Grabber drag down | Tap dimmed page | System Back |
|---|---|---|---|---|
| Sheet open | TC-021 | TC-022 | TC-023 | TC-024 |
| Sheet open during multi-select | n/a (spec silent: only choosing a row is stated) | n/a (spec silent) | n/a (spec silent) | n/a (spec silent) |

### System back
- 「All categories」 sheet → closes the sheet only, same tab: TC-024
- My AI Artwork page → n/a (existing page, Back not changed by 11/E)
- Multi-select on a tab → n/a (existing state, not changed by 11/E)

### Hidden clauses
| Requirement | Hidden clause | Observed through | Rows |
|---|---|---|---|
| R-050 | Artwork_FeatureList_Appear sent with from_tab | the analytics event log | TC-028, TC-029 |
| R-051 | Artwork_Category_Select sent with source = sheet | the analytics event log | TC-030 |
| R-052 | Artwork_Category_Select sent with source = tab | the analytics event log | TC-031 |
| R-040 | no credits charged | the credit balance before and after | TC-025, TC-026 |

### Variants
| Requirement | Variant | Rows |
|---|---|---|
| R-040 × account | free | TC-025 |
| R-040 × account | paid (VIP) | TC-026 |
| R-016 × opened from | Recent | TC-010 |
| R-016 × opened from | a feature tab | TC-011 |
| R-020 × row chosen | feature with works | TC-013, TC-014 |
| R-020 × row chosen | Recent | TC-018 |
| R-020 × row chosen | last row | TC-020 |
| R-021 × row chosen | feature with no works | TC-016 |
| R-023 × way of switching | a row of the sheet | TC-019 |
| R-025 × way of switching | a tab of the tab bar | TC-032 |
| R-050 × from_tab | Recent | TC-028 |
| R-050 × from_tab | a feature tab | TC-029 |

### Domain rules
| Entry | Requirements |
|---|---|
| KP-012 Android has one paid mode: VIP = Pro = paid user | n/a (the spec states the feature is free for every user: R-040 checks a free and a VIP user) |
| KP-014 AI Exposure is paid-only | n/a (other feature or flow: not part of My AI Artwork's tab bar or the All categories sheet) |
| KP-015 Mine refreshes entitlement after buying Premium | n/a (other feature or flow: not part of My AI Artwork's tab bar or the All categories sheet) |
| KP-016 A one-time free trial is consumed at once | n/a (other feature or flow: not part of My AI Artwork's tab bar or the All categories sheet) |
| KP-017 Credit Detail lists every AI use with feature name and amounts | n/a (other feature or flow: not part of My AI Artwork's tab bar or the All categories sheet) |
| KP-018 Credit Auto Pass keeps its own name in the Detail | n/a (other feature or flow: not part of My AI Artwork's tab bar or the All categories sheet) |
| KP-019 A burst of Generate taps charges once | n/a (other feature or flow: not part of My AI Artwork's tab bar or the All categories sheet) |
| KP-020 Blue credit button opens Buy Credit | n/a (other feature or flow: not part of My AI Artwork's tab bar or the All categories sheet) |
| KP-021 Premium chat quota is higher, not unlimited | n/a (other feature or flow: not part of My AI Artwork's tab bar or the All categories sheet) |
| KP-024 Finished AI images save to their feature tab | n/a (where works are saved is not changed by this spec; the rows only need works under several features) |
| KP-025 AI Exposure results go to Recent and the AI Exposure tab | n/a (other feature: AI Exposure; its Artwork entry path is used in the Preconditions) |
| KP-026 History button opens the feature's Artwork tab | R-060 |
| KP-027 New features' works reach Recent | n/a (which works reach Recent is not changed by this spec) |
| KP-028 Empty Artwork filter shows Nothing yet | n/a (the Photo / Video filter is unchanged, R-005; the spec states empty tabs show 「Create More」, R-004) |
| KP-029 Long-task tiles and completion notifications | n/a (other feature or flow: not part of My AI Artwork's tab bar or the All categories sheet) |
| KP-030 Saved output matches the last preview | n/a (other feature or flow: not part of My AI Artwork's tab bar or the All categories sheet) |
| KP-032 Features opened from Edit Room get the edited image | n/a (other feature or flow: not part of My AI Artwork's tab bar or the All categories sheet) |
| KP-033 Banners and deep links preselect the linked style | n/a (other feature or flow: not part of My AI Artwork's tab bar or the All categories sheet) |
| KP-034 Discover tip bubble lifecycle | n/a (other feature or flow: not part of My AI Artwork's tab bar or the All categories sheet) |
| KP-035 AI Replace: reference image or prompt enables Next | n/a (other feature or flow: not part of My AI Artwork's tab bar or the All categories sheet) |
| KP-036 A custom prompt reaches the generator | n/a (other feature or flow: not part of My AI Artwork's tab bar or the All categories sheet) |
| KP-037 AI Try-On: no face check on clothing or pets | n/a (other feature or flow: not part of My AI Artwork's tab bar or the All categories sheet) |
| KP-038 AI Group Shot photo picking | n/a (other feature or flow: not part of My AI Artwork's tab bar or the All categories sheet) |
| KP-039 Agent job finished in background shows on return | n/a (other feature or flow: not part of My AI Artwork's tab bar or the All categories sheet) |
| KP-040 Crop tabs keep one consistent state | n/a (other feature or flow: not part of My AI Artwork's tab bar or the All categories sheet) |
| KP-041 Undo, Redo and Reset | n/a (other feature or flow: not part of My AI Artwork's tab bar or the All categories sheet) |
| KP-042 Restored state restores highlight and transform together | n/a (other feature or flow: not part of My AI Artwork's tab bar or the All categories sheet) |
| KP-043 Video Editing template titles keep their look | n/a (other feature or flow: not part of My AI Artwork's tab bar or the All categories sheet) |
| KP-044 Video Editing panels: X discards, V commits | n/a (other feature or flow: not part of My AI Artwork's tab bar or the All categories sheet) |
| KP-045 Audio Range Select close target | n/a (other feature or flow: not part of My AI Artwork's tab bar or the All categories sheet) |
| KP-046 Try-On / Hairstyle Back keeps the style | n/a (other feature or flow: not part of My AI Artwork's tab bar or the All categories sheet) |
| KP-047 Masks survive returning from Artwork or Store | n/a (other feature or flow: not part of My AI Artwork's tab bar or the All categories sheet) |
| KP-048 Arabic may keep Western digits | n/a (other feature or flow: not part of My AI Artwork's tab bar or the All categories sheet) |
| KP-049 Localised strings keep their placeholders | n/a (other feature or flow: not part of My AI Artwork's tab bar or the All categories sheet) |
| KP-050 RTL mirrors layout, not only text | n/a (other feature or flow: not part of My AI Artwork's tab bar or the All categories sheet) |

### Request ledger coverage
| Ledger entry | Requirements |
|---|---|
| REQ-001 | R-001 – R-052 (the whole table) |
| REQ-003 | R-003, R-004, R-005, R-012, R-020, R-023, R-030, R-031, R-032 |
| REQ-006 | R-004 (empty-tab button) |
| REQ-004 | R-014, R-023, R-025 (Figma draft section) |
| REQ-002 | n/a (platform scope: this Android table only, the iOS draft was removed) |
