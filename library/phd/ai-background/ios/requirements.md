# AI Background — requirements (ios)
Spec: Background - PM Spec.pdf (PM, received 2026-11-03; boards pm-custom, pm-room, pm-cms) · AI-Background Design Figma
(page 1:77: frames 「5」 dark, 「6」 light, thumbnail states 「Frame 4922」 / 「Frame 4923」; read 2026-11-03 through figma-design)

Source order: Design, then PM. The Design file draws only the room (no prompt panel, no waiting state), so everything
about the Custom prompt panel and the wait is PM-only (pass 7). The PM Figma file could not be opened (no access for
qa1 or qa-dm), so the PM is read from its PDF (`figma-pending.json`, Q-13).

## Entry and room
- R-001 [PM:pm-custom; DS:figma 5 1:451] Opening AI Background keeps the current flow: the app removes the photo's background itself and the canvas shows the subject on a checkerboard (transparent) background.
- R-002 [PM:pm-custom; DS:figma 5 editing_area/ic_eraser_n] The eraser button at the canvas's lower left lets the user erase (smear out) parts of the cut-out subject, and the canvas shows the change.
- R-003 [PM:pm-custom; DS:figma 5 ic_crop_n 5:482] The crop button next to the eraser lets the user crop the cut-out subject, and the canvas shows the cropped subject.
- R-004 [PM:pm-custom] The image the app sends to the server for a generation is its own cut-out of the subject, after the user's crop and erase (the server does not remove the background again).
- R-005 [DS:figma 5 1:451] Room layout, top to bottom: top bar with ⓘ at the left and the credit pill (balance and ⊕) at the right; the canvas with eraser and crop at its lower left and compare at its lower right; the category tabs; the thumbnail row; the Generate button with its credit price; the bottom bar with X, undo, redo and ✓.
- R-006 [DS:figma 5 top/ic_info] The ⓘ button in the top bar opens the feature's information; closing it returns to the room unchanged.
- R-007 [DS:figma 5 btn_add_credit] The credit pill shows the current credit balance with ⊕; tapping it opens the credit purchase page, and coming back returns to the room unchanged.
- R-008 [DS:figma 5 On-screen/btn_BA_n 5:420] Pressing and holding the compare button at the canvas's lower right shows the photo before the change; releasing it shows the current result again.
- R-009 [DS:figma 5 bottom_action/4icons 4:158; PM:pm-room screenshot] The bottom bar shows X, undo, redo and ✓; undo and redo are dimmed until there is something to undo or redo.
- R-010 [DS:figma 5 bottom_action/4icons; PM:pm-room screenshot] ✓ applies the room's result to the photo and returns to the editor; X leaves the room without applying it. (Current-app behaviour of the bottom bar both specs draw; the spec states no change to it.)

## Category tabs and thumbnails
- R-011 [DS:figma 5 capsuleTab_box 1:541; PM:pm-room 「category 選取狀態」] Categories are capsule tabs in one row; the selected tab has an orange fill. The Design draws 「Custom」, 「Neutrals」, 「Ballon」, 「Wood」, 「Vintage」, 「Life」 (the actual-app screenshot spells 「Balloon」, Q-2; the category list comes from CMS, Q-8).
- R-012 [PM:pm-room 「Custom 的橘色泡泡太貼近螢幕邊緣」; DS:figma 5 tab-03 1:546] The selected 「Custom」 capsule no longer touches the screen's left edge: the Design places it 12 pt from the edge, the same inset as the thumbnails.
- R-013 [PM:pm-room 「thumbnail 大小」; DS:figma 5 thumb/80x80/withname/regular 24:723] Each thumbnail is an 80 × 80 pt image with its name in a strip below it (80 × 98 pt in all), 4 pt apart (smaller than the current app's thumbnails).
- R-014 [DS:figma 5 24:723, sep 1:888] The 「Custom」 thumbnail (orange gradient with a magic-wand icon) comes first, then a vertical separator, then the templates.
- R-015 [DS:figma Frame 4922 / 4923] A premium template shows a crown badge at its top right.
- R-016 [DS:figma Frame 4922 / 4923; DS:figma 5 Lomo 26:968] The selected thumbnail has an orange stroke; the others have none.
- R-017 [DS:figma 5 capsuleTab_box] Tapping a category tab selects it (orange fill) and shows that category's templates in the thumbnail row.

## Custom prompt panel (PM-only: no Design frame yet)
- R-020 [PM:pm-custom 「Click Custom → 喚起打字 panel (current: click Custom → 開啟新的房間)」] Tapping the 「Custom」 thumbnail opens the typing panel with the keyboard in the same room; it no longer opens a new room.
- R-021 [PM:pm-custom mockup 2] The panel shows the title 「Prompts」, a 「My Prompts」 button, a ✓ button, the text box with the placeholder 「Please describe the content to replace (guitar, flower, chair)」, an expand button at the text box's top right, a delete (trash) button at its lower left and the counter 「0/2,500」.
- R-022 [PM:pm-custom mockups 2–3] While the text box is empty, ✓ and the trash button are dimmed; once there is text, ✓ turns orange and the trash button is active.
- R-023 [PM:pm-custom mockup 3] The counter shows the number of characters typed out of 2,500 (e.g. 「120/2,500」).
- R-024 [PM:pm-custom 「0/2,500」] The prompt holds at most 2,500 characters: typing or pasting more stops at 2,500 and the counter shows 「2,500/2,500」.
- R-025 [PM:pm-custom 「設有 expand/ delete btn」, mockup row 2; PM:figma 純文字_放大狀態 2404:6807 round/ic_collapse_text 2404:6852] The expand button opens the text box at full height, showing the whole prompt, with the trash button still at its lower left; the collapse button at the expanded box's top right returns it to its normal height with the prompt kept.
- R-026 [PM:pm-custom 「設有 expand/ delete btn」] The trash button clears the prompt; the counter returns to 「0/2,500」.
- R-027 [PM:pm-custom 「& My Prompt」] The panel has a 「My Prompts」 button (title: 「add My Prompt」); what it opens is not described (Q-4).
- R-028 [PM:pm-custom 「click 空白處 or 勾勾→ panel 不見, Custom 為 selected 狀態 (橘色 stroke), ready for generation」] Tapping a blank area outside the panel, or ✓, closes the panel; the 「Custom」 thumbnail is then selected (orange stroke) and Generate is ready (enabled, orange, with its price).
- R-029 [PM:pm-custom mockup 1] Before a Custom prompt is confirmed (the Custom tab open, no thumbnail selected), Generate is dimmed.

## Generation and waiting
- R-030 [PM:pm-custom 「不走 long task, 讓用戶在房間等, 不設有 my artwork 入口」] A Custom generation is not a long task: the user waits in the room, and no My Artwork entry (button, toast or link) is offered during the wait.
- R-031 [PM:pm-custom 「等待途中的 handle 方式同 GAI Enhance」] What happens when the user leaves or interrupts during the wait is the same as in AI Enhance (Q-7: the spec does not restate it); leaving and coming back never silently loses the generation or its credits.
- R-032 [PM:pm-custom] From 0 to 10 s of the wait the room shows 「Analyzing your image...」.
- R-033 [PM:pm-custom] From 10 to 20 s it shows 「Understanding the scene...」.
- R-034 [PM:pm-custom] From 20 to 30 s it shows 「Creating the new background...」.
- R-035 [PM:pm-custom] From 30 to 40 s it shows 「Refining the details...」.
- R-036 [PM:pm-custom] From 40 to 45 s it shows 「Making the final adjustments...」.
- R-037 [PM:pm-custom] After 45 s it shows 「Almost done!」 until the result arrives.
- R-038 [DS:figma 5; PM:pm-room screenshot; Rule: analysis pass 10, a setting's values are variants (2026-11-04); Req: REQ-006] Selecting a template and tapping Generate generates a new background from that template in the room, and the canvas shows the subject on it in that template's look. Each template category (R-011) is used in one generation (`### Variants`).
- R-039 [PM:pm-custom 「ready for generation」] Tapping Generate with a confirmed Custom prompt generates a new background from the prompt, and the canvas shows the subject on it.
- R-040 [DS:figma 5 btn_credit_primary_1row 5:461] With a template selected, the Generate button reads 「Generate」 with the credit icon and 「2」, and a template generation charges 2 credits (Q-1).
- R-041 [PM:pm-custom mockup 4 「Generate 5」] With a confirmed Custom prompt, the Generate button shows 「5」 credits, and a Custom generation charges 5 credits (PM-only; differs from the Design's 「2」, Q-1).
- R-042 [Rule: credit numbers binding] After a charged generation the credit pill's balance goes down by exactly the price shown on Generate.

## Free trial
- R-045 [PM:pm-room screenshot 「1 Free Trial」; PM:pm-cms 「First time free trial task ID」] On a user's first use, the CTA reads 「1 Free Trial」 with the price shown as 「2 → 0」 (the 2 struck through).
- R-046 [PM:pm-cms; KB:KP-016] The free trial is a one-time use: generating with it charges 0 credits; afterwards the CTA shows the paid Generate with its price and never 「1 Free Trial」 again, and on entry the CTA never flashes the paid price before showing 「1 Free Trial」.
- R-047 [PM:pm-cms] A free-trial generation is sent with the task ID 「temp_one_time_free」.

## Feature and Action IDs
- R-050 [PM:pm-cms] AI Background generations are sent under the Feature ID 「PeopleBackgroundV3」.
- R-051 [PM:pm-cms] A Custom generation is sent with the Action ID 「genimage_1_img_bytedance_seedream5.0pro_none_custom」 (model Seedream 5.0 Pro).
- R-052 [PM:pm-cms] A template generation is sent with the Action ID 「genimage_1_img_bytedance_seedream5.0pro_none_tmpl」.
- R-053 [PM:pm-cms 「CMS type TBD」] The CMS type for the categories and templates is not decided — NOT TESTABLE: TBD in the spec (Q-8).

## Themes
- R-055 [DS:figma 5 1:451, 6 11:248] The Design draws the room in a dark version (「5」: black bars, dark thumbnail strips) and a light version (「6」: light bars, orange-tinted credit pill, light thumbnail strips); each shows the same controls in the same places (Q-9: which app setting shows the light version).

## Open questions
- Q-1 Credit price. The Design's Generate button shows 「2」 with a template selected; the PM Custom mockup shows 「5」; the actual-app screenshot shows the free trial as 「2 → 0」. The spec never states the prices in words, so it is unclear whether a Custom generation costs 5 and a template 2. Assumption: a template costs 2 (Design) and a Custom prompt 5 (PM); credit numbers are binding, so a different charge is a finding. R-040, R-041, R-042, R-045 (TC-015, TC-023, TC-033, TC-034, TC-056, TC-057, TC-058, TC-059, TC-039, TC-040).
- Q-2 Spelling of the third category. The Design spells it 「Ballon」; the actual-app screenshot shows 「Balloon」. Assumption: 「Balloon」 is correct and the Design has a typo. R-011 (TC-009, TC-056).
- Q-3 When Generate is enabled. In the Design's frame 「5」 the template 「Lomo」 is selected but Generate looks dimmed; the PM mockup with Custom confirmed shows Generate orange. Assumption: Generate is enabled (orange) whenever a template or a confirmed Custom prompt is selected, and dimmed only on the Custom tab with nothing selected. R-028, R-029, R-040 (TC-015, TC-023, TC-024, TC-025, TC-034, TC-056, TC-057, TC-058, TC-059).
- Q-4 What 「My Prompts」 does. The PM panel has a 「My Prompts」 button (title 「add My Prompt」) but does not say what it opens (a list of saved prompts, or saving the current prompt) or whether the typed prompt is kept on return. Assumption: it opens a My Prompts page and the typed prompt is still in the box on return; what the page holds is checked on device and decided with the user before filing. R-027 (TC-022).
- Q-5 Closing the panel with an empty text box. The PM says a tap on a blank area or on ✓ closes the panel and selects 「Custom」, but ✓ is dimmed while the box is empty, and it does not say what a blank-area tap does with no prompt (select 「Custom」 with no prompt, or just close the panel). Assumption: ✓ is dimmed while the box is empty; no row closes the panel with an empty box. R-022, R-028 (TC-017, TC-021, TC-024).
- Q-6 Reopening Custom. The spec does not say what tapping 「Custom」 again shows after a prompt was confirmed or generated: the panel with the previous prompt, or an empty one. Assumption: no row reopens it; the first tap opens the panel (TC-016). R-020 (TC-016).
- Q-7 Leaving during the wait. The PM says the wait is handled the same as in AI Enhance but does not restate it: whether there is a cancel or Stop, a leave dialog, what Home or an app switch does, and what happens to the credits. Assumption: leaving and coming back never silently loses the generation, and credits are charged only for a delivered result; no row taps a cancel or Stop. R-031 (TC-038).
- Q-8 Which categories and templates ship. The PM leaves the CMS type 「TBD」, so the order of the categories, their templates and which templates are premium are not fixed. Assumption: the Design's tabs 「Custom」, 「Neutrals」, 「Balloon」, 「Wood」, 「Vintage」, 「Life」 in that order, a crown on whichever templates are premium; a category row is Blocked if that category is missing on the build. R-011, R-015, R-053 (TC-009, TC-014, TC-034, TC-056, TC-057, TC-058, TC-059).
- Q-9 How to see the light room. The Design draws a dark room (frame 「5」) and a light one (frame 「6」) but does not say which app or system setting shows the light one. Assumption: the light room shows under some app or system light appearance; the row is Blocked if the app has none. R-055 (TC-045).
- Q-10 Premium templates for a Free user. The Design marks premium templates with a crown but neither source says what a Free user gets on tapping one (Generate with credits, or a subscription page), and the spec states no tier rule (KB KP-013). Assumption: rows check only the crown badge; no row taps a premium template as a Free user. R-015 (TC-014).
- Q-11 Failures. Neither source specifies what happens when a Custom, template or free-trial generation fails, or when the background removal on entry fails: the error copy, whether credits are refunded, and whether there is a retry. Assumption: none; the Job states and Error classes grids mark these n/a. R-001, R-038, R-039, R-046 (no row yet).
- Q-12 Top bar of the prompt panel. The PM prompt-panel mockups 2–3 show a top bar with back, home, credits and a history icon; the Design and the actual-app screenshot show ⓘ and the credit pill. Assumption: the Design's top bar (ⓘ and credits). R-005 (TC-002).
- Q-14 Waiting for a template. The PM's six timed progress messages are written for a Custom generation; it does not say whether a template generation shows them too, or what its wait looks like. Assumption: the messages are checked only on a Custom generation; a template generation only needs a wait indicator before the result. R-032, R-033, R-034, R-035, R-036, R-037, R-038 (TC-026, TC-027, TC-028, TC-029, TC-030, TC-031, TC-034, TC-056, TC-057, TC-058, TC-059).
- Q-16 Which model this release uses. The PM page is titled 「26 10E AI Background Upgrade to GPT Image 2.5 Flare」, but its Action IDs name Seedream 5.0 Pro (「…bytedance_seedream5.0pro…」). Assumption: the Action IDs as written in the PM CMS table (Seedream 5.0 Pro). R-051, R-052 (TC-042, TC-043).

## Answered questions
- Q-13 Could the PM Figma file be read? Answer (2026-11-03): The PM Figma file was opened through figma-pm (qa1) after the first draft: page 2403:4094 holds the same sections, mockups and note text as the PDF and no dated frames. Its inventory added the collapse button of the expanded text box (R-025) and the mockups' own top bar (back, home, history), which the Design replaces (Q-12).

## Added 2026-11-03 — coverage passes and standing inputs

### Flow arrows walked by existing rows
Neither the Design file nor the PM PDF draws flow arrows (inventory: 0 arrows); `arrows.json` is empty.

### Job states
Every cell names the rows that check it, or n/a when the spec defines nothing for that state.

| Job | Start / loading | Success | Failure | Retry | Second failure | Partial | Stop | Leave and return | Longest wait | Done notice |
|---|---|---|---|---|---|---|---|---|---|---|
| Background removal on entry | n/a (spec silent: current flow) | TC-001 | n/a (spec silent, Q-11) | n/a (spec silent, Q-11) | n/a (spec silent) | n/a (one image) | n/a (spec silent) | n/a (spec silent) | n/a (spec silent) | n/a (result shows on the canvas) |
| Custom generation | TC-026 | TC-033 | n/a (spec silent, Q-11) | n/a (spec silent, Q-11) | n/a (spec silent, Q-11) | n/a (one image) | n/a (same as AI Enhance, not restated: Q-7) | TC-038 | TC-031 | n/a (no long task: the result shows in the room, TC-033) |
| Template generation | TC-034 | TC-034 | n/a (spec silent, Q-11) | n/a (spec silent, Q-11) | n/a (spec silent, Q-11) | n/a (one image) | n/a (spec silent, Q-7) | n/a (spec silent, Q-14) | n/a (spec silent, Q-14) | n/a (the result shows in the room, TC-034) |
| Free-trial generation | TC-040 | TC-040 | n/a (spec silent, Q-11) | n/a (spec silent, Q-11) | n/a (spec silent, Q-11) | n/a (one image) | n/a (spec silent, Q-7) | n/a (spec silent, Q-7) | n/a (spec silent) | n/a (the result shows in the room, TC-040) |

### Error classes
| Job | Error classes |
|---|---|
| Background removal on entry | n/a (spec names no error classes, Q-11) |
| Custom generation | n/a (spec names no error classes, Q-11) |
| Template generation | n/a (spec names no error classes, Q-11) |
| Free-trial generation | n/a (spec names no error classes, Q-11) |

### Exit × stage
| Stage | Bottom X | Bottom ✓ | App to background |
|---|---|---|---|
| Prompt panel open | n/a (the keyboard covers the bottom bar) | n/a (the keyboard covers the bottom bar) | n/a (spec silent, Q-6) |
| Custom ready, not generated | n/a (spec silent: nothing to apply) | n/a (spec silent: nothing to apply) | n/a (spec silent) |
| Generating | n/a (same as AI Enhance, Q-7) | n/a (same as AI Enhance, Q-7) | TC-038 |
| Result shown | TC-037 | TC-036 | n/a (spec silent) |

### Hidden clauses
| Requirement | Hidden clause | Observed through | Rows |
|---|---|---|---|
| R-004 | The image sent to the server is the app's cut-out after crop / erase | The uploaded image in the app log or the request record after a log pull; parked until a PhotoDirector log pull is set up | TC-042 |
| R-047 | The free-trial generation is sent with task ID 「temp_one_time_free」 | The request in the app log after a log pull | TC-044 |
| R-050 | Sent under Feature ID 「PeopleBackgroundV3」 | The request in the app log after a log pull | TC-042, TC-043 |
| R-051 | Custom is sent with Action ID 「…_custom」 | The request in the app log after a log pull | TC-042 |
| R-052 | A template is sent with Action ID 「…_tmpl」 | The request in the app log after a log pull | TC-043 |

### Variants
| Requirement | Variant | Rows |
|---|---|---|
| R-055 | Dark (frame 5) | TC-002 |
| R-055 | Light (frame 6) | TC-045 |
| R-040 | Template price 2 | TC-015, TC-034 |
| R-041 | Custom price 5 | TC-023, TC-033 |
| R-045 | Free trial 2 → 0 | TC-039, TC-040 |
| R-038 | category=Neutrals | TC-034 |
| R-038 | category=Balloon | TC-056 |
| R-038 | category=Wood | TC-057 |
| R-038 | category=Vintage | TC-058 |
| R-038 | category=Life | TC-059 |

### Domain rules
| Entry | Requirements |
|---|---|
| KP-016 | R-046 |
| KP-013 | n/a (the spec states no tier rule; Q-10) |

### Request ledger coverage
| Ledger entry | Requirements |
|---|---|
| (none open of kind table) | n/a |
