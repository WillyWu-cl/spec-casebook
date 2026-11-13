# AI Replace: Reference image UX — requirements (android)
Spec: AI Replace ref image UX - PM Figma 14451-2196.md (spec set 2026-11-11, Figma only: PM file UX-Issues, page 「26 11E UIUX Revamp」, block 「AI Replace - Ref Image UX Refinement」, section 14451:2197)
Read from the Figma text layer (get_metadata) and the section screenshot; the control inventory is owed (figma-pending.json: use_figma refused, Full seat). No Design or MX file was supplied; the mockups are iPhone frames and their strings are the expected UI text.

## Choosing how to replace
- R-001 [PM:pm-replace-flow] On the sheet 「Choose how to replace the selected area」, the options 「Upload a reference image」 and 「Describe with text」 show no badge (「badge 都可以拿掉了」; which badges is Q-1).
- R-002 [PM:pm-replace-flow] After a mask is drawn and 「Next」 is tapped, the sheet 「Choose how to replace the selected area」 offers 「Upload a reference image」 and 「Describe with text」 (flow as drawn, unchanged).
- R-003 [PM:pm-replace-flow] 「Upload a reference image」 shows the reference tips sheet (「For the best results, follow this advice:」, Recommendation / Avoid, 「Continue」, 「Don't show again」) and 「Continue」 opens the reference image photo picker (「Recents」 / 「Stock」); choosing a photo there opens the reference image page (flow as drawn, unchanged).

## Reference image page
- R-010 [PM:pm-replace-flow] The reference image page shows two sections, 「Replace Area」 (the photo with the red mask) and 「Reference Image」 (the chosen image, with a replace button at its bottom right), and both always hold an image (「此頁面兩個 section 都恆有圖」).
- R-011 [PM:pm-replace-flow; KB: KP-035] 「Generate」 on the reference image page is always enabled (「generate btn 恆為 enable」): whenever the page shows, Generate can be tapped, with no prompt typed (a reference image alone is enough).
- R-012 [PM:pm-replace-flow] 「Generate」 shows a cost of 6 credits (the mockup's 「-6」; credit numbers in the spec are binding, formats.md; Q-3).
- R-013 [PM:pm-replace-flow] Tapping 「Generate」 starts the replacement with the reference image and the masked area, and a result follows.
- R-014 [KB: KP-019] Once the first 「Generate」 tap is accepted, further taps are blocked until the job takes over: one charge, one result.

## Back to the photo picker
- R-020 [PM:pm-replace-flow] The back button (top left) of the reference image page opens the reference image photo picker (「back鍵 -> 回 ref image 的 photo picker」).
- R-021 [PM:pm-replace-flow] The back button behaves the same as the replace button at the bottom right of 「Reference Image」 (「行為 same as 右下角替換 btn」): the replace button opens the same photo picker.
- R-022 [PM:pm-replace-flow] Choosing another photo in the picker reached by back returns to the reference image page with the new photo under 「Reference Image」 and the same 「Replace Area」 mask, as after the replace button.
- R-023 [PM:pm-replace-flow] Android system Back on the reference image page does the same as its back button: it opens the reference image photo picker (system Back follows the screen's own back, REQ-051 rule).
- R-024 [PM:pm-replace-flow] Leaving the photo picker without choosing a photo (its back / ✕ or system Back) after reaching it from the reference image page returns to the reference image page with the previous reference image (the page always holds an image, R-010; Q-2).

## Flow arrows
- R-030 [DS: flow arrow pm-replace-flow-a1 https://www.figma.com/design/NacadNfWFAGglU880DupER/UX-Issues?node-id=14565-1576] Reference image page back → the reference image photo picker (note 14565:1576, not a drawn arrow). Walked by: TC-006.

## Open questions
- Q-1 「badge 都可以拿掉了」 does not say which badges: the credit cost or 「NEW」 tag on 「Upload a reference image」 / 「Describe with text」, or every badge of the AI Replace flow. Assumption: no badge of any kind on the two options of 「Choose how to replace the selected area」; badges elsewhere are not checked. R-001; TC-001.
- Q-2 The spec does not say where leaving the photo picker goes when it was opened by back (back now opens the picker, so the picker's own back would loop or leave the flow). Assumption: leaving the picker without a choice returns to the reference image page with the image it had (as after the replace button); the row records what happens. R-024; TC-010.
- Q-3 The 「-6」 on 「Generate」 is only in the mockup (the iPhone frame), and the AI Replace text path cost 2 on iOS 20.15 (KP-022). Assumption: 6 credits, as drawn (binding); PM confirms the price for a reference image. R-012; TC-003.

## Added 2026-11-11 — coverage passes and standing inputs
### System back
- Reference image page: TC-009 (opens the reference image photo picker, R-023).
- Reference image photo picker reached by back: TC-010 (Q-2).
- 「Choose how to replace the selected area」 sheet and the tips sheet: n/a (unchanged by this spec).

### Hidden clauses
Pass 9: each clause the screen does not show, how a tester observes it and the rows.

| Requirement | Hidden clause | Observed through | Rows |
|---|---|---|---|
| R-001 | None: 「Upload a reference image」 is the option's label, not an upload rule | The option's label on screen | n/a (no hidden clause) |
| R-002 | None: 「Upload a reference image」 is the option's label, not an upload rule | The option's label on screen | n/a (no hidden clause) |
| R-003 | None: 「Upload a reference image」 is the option's label, not an upload rule | The option's label on screen | n/a (no hidden clause) |
| R-014 | Only one charge for a burst of Generate taps | The credit balance before and after (one 6-credit drop) and a single result | TC-005 |

### Domain rules
Every applicable spec / team rule of knowledge.md.

| Entry | Requirements |
|---|---|
| KP-012 Android has one paid mode: VIP = Pro = paid user | n/a (other feature or flow: not part of the AI Replace reference image flow) |
| KP-014 AI Exposure is paid-only | n/a (other feature or flow: not part of the AI Replace reference image flow) |
| KP-015 Mine refreshes entitlement after buying Premium | n/a (other feature or flow: not part of the AI Replace reference image flow) |
| KP-016 A one-time free trial is consumed at once | n/a (other feature or flow: not part of the AI Replace reference image flow) |
| KP-017 Credit Detail lists every AI use with feature name and amounts | n/a (other feature or flow: not part of the AI Replace reference image flow) |
| KP-018 Credit Auto Pass keeps its own name in the Detail | n/a (other feature or flow: not part of the AI Replace reference image flow) |
| KP-019 A burst of Generate taps charges once | R-014 |
| KP-020 Blue credit button opens Buy Credit | n/a (the credit button in the AI Replace top bar is unchanged by this spec) |
| KP-021 Premium chat quota is higher, not unlimited | n/a (other feature or flow: not part of the AI Replace reference image flow) |
| KP-024 Finished AI images save to their feature tab | n/a (where results are saved is unchanged by this spec) |
| KP-025 AI Exposure results go to Recent and the AI Exposure tab | n/a (other feature or flow: not part of the AI Replace reference image flow) |
| KP-026 History button opens the feature's Artwork tab | n/a (the History button in the AI Replace top bar is unchanged by this spec) |
| KP-027 New features' works reach Recent | n/a (other feature or flow: not part of the AI Replace reference image flow) |
| KP-028 Empty Artwork filter shows Nothing yet | n/a (other feature or flow: not part of the AI Replace reference image flow) |
| KP-029 Long-task tiles and completion notifications | n/a (other feature or flow: not part of the AI Replace reference image flow) |
| KP-030 Saved output matches the last preview | n/a (other feature or flow: not part of the AI Replace reference image flow) |
| KP-032 Features opened from Edit Room get the edited image | n/a (other feature or flow: not part of the AI Replace reference image flow) |
| KP-033 Banners and deep links preselect the linked style | n/a (other feature or flow: not part of the AI Replace reference image flow) |
| KP-034 Discover tip bubble lifecycle | n/a (other feature or flow: not part of the AI Replace reference image flow) |
| KP-035 AI Replace: reference image or prompt enables Next | R-011 (a reference image alone enables Generate) |
| KP-036 A custom prompt reaches the generator | n/a (other feature or flow: not part of the AI Replace reference image flow) |
| KP-037 AI Try-On: no face check on clothing or pets | n/a (other feature or flow: not part of the AI Replace reference image flow) |
| KP-038 AI Group Shot photo picking | n/a (other feature or flow: not part of the AI Replace reference image flow) |
| KP-039 Agent job finished in background shows on return | n/a (other feature or flow: not part of the AI Replace reference image flow) |
| KP-040 Crop tabs keep one consistent state | n/a (other feature or flow: not part of the AI Replace reference image flow) |
| KP-041 Undo, Redo and Reset | n/a (undo / redo on the mask step are unchanged by this spec) |
| KP-042 Restored state restores highlight and transform together | n/a (other feature or flow: not part of the AI Replace reference image flow) |
| KP-043 Video Editing template titles keep their look | n/a (other feature or flow: not part of the AI Replace reference image flow) |
| KP-044 Video Editing panels: X discards, V commits | n/a (other feature or flow: not part of the AI Replace reference image flow) |
| KP-045 Audio Range Select close target | n/a (other feature or flow: not part of the AI Replace reference image flow) |
| KP-046 Try-On / Hairstyle Back keeps the style | n/a (other feature or flow: not part of the AI Replace reference image flow) |
| KP-047 Masks survive returning from Artwork or Store | n/a (returning from Artwork to edit the mask is not changed by this spec; R-022 checks the mask stays after the picker) |
| KP-048 Arabic may keep Western digits | n/a (other feature or flow: not part of the AI Replace reference image flow) |
| KP-049 Localised strings keep their placeholders | n/a (other feature or flow: not part of the AI Replace reference image flow) |
| KP-050 RTL mirrors layout, not only text | n/a (other feature or flow: not part of the AI Replace reference image flow) |

### Request ledger coverage
Every open table entry of requests.md for android.

| Ledger entry | Requirements |
|---|---|
| REQ-001 | R-001 – R-030 (the whole table) |
| REQ-002 | n/a (platform scope: this Android table only) |
