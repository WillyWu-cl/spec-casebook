# Gen AI auto-save dialog — requirements (android)
Spec: GenAI auto-save dialog - PM Figma 14451-2196.md (spec set 2026-11-11, Figma only: PM file UX-Issues, page 「26 11E UIUX Revamp」, block 「GenAI dialog adjust (sync with My Artwork dialog)」, section 14451:2197)
Read from the Figma text layer (get_metadata) and the section screenshot; the trigger table on the board is an image of RD's code notes, read by eye (boards/pm-genai-dialog.md). The control inventory is owed (figma-pending.json: use_figma refused, Full seat). No Design or MX file was supplied.

## Dialog content
- R-001 [PM:pm-genai-dialog] The dialog title is unchanged: 「Results Are Saved Automatically」.
- R-002 [PM:pm-genai-dialog] The dialog text reads exactly 「Your generated results are saved in My AI Artwork for 1 year. Download them to keep them permanently.」, replacing 「All your generated results are saved in My Artwork, so you can access them anytime.」.
- R-003 [PM:pm-genai-dialog] The dialog has only 「Ok」 and no 「Don't show again」 check; tapping 「Ok」 closes it (where the user lands then is Q-1).

## Where the dialog shows
- R-010 [PM:pm-genai-dialog] AI Headshot: tapping Home (回首頁) on the result page, with nothing generating, shows the dialog.
- R-011 [PM:pm-genai-dialog] AI Try On: tapping Home on the result page, with nothing generating, shows the dialog.
- R-012 [PM:pm-genai-dialog] AI Art (Artistic Avatar): tapping Home on the result page, with nothing generating, shows the dialog.
- R-013 [PM:pm-genai-dialog] Image Fusion: tapping Home on the result page shows the dialog; a plain Back there does not.
- R-014 [PM:pm-genai-dialog] AI Glow Up: leaving the feature with Back after images were generated shows the dialog; while generating, leaving is not allowed.
- R-015 [PM:pm-genai-dialog; PM:pm-room-titles] Face Swap: Back, Home or system Back on the result page shows the dialog. — NOT TESTABLE: AI Face Swap is removed from the app before 10/E (「AI Face Swap 於 10/E 前 in app 移除」, same page).
- R-016 [PM:pm-genai-dialog] AI Headshot, AI Try On and AI Art: tapping Home on the result page while a generation is still running does not show the dialog (「且未在生成中」).

## Shown once across the six features
- R-020 [PM:pm-genai-dialog] The six features share one record (`aiLeavePageDoNotShowAgain`, kept on the device): once the dialog has shown in any of them, none of them shows it again.
- R-021 [PM:pm-genai-dialog] The dialog counts as shown as soon as it appears, without 「Ok」 being tapped (「dialog 顯示時就設為已顯示，不必按 OK」).

## Separate prompts
- R-030 [PM:pm-genai-dialog] The AI Exposure download-failed prompt (DOWNLOAD_FAILED) and the AI Background prompt (generation error or download forced to end while the task is still in My Artwork) use the same title and text as the dialog, so they show the new text (Q-2), and they have no show-once limit: they still show after the shared dialog has shown.
- R-031 [PM:pm-genai-dialog; KB: KP-014] The AI Exposure close reminder (result generated but not applied, then close) keeps its own 「Ok」 / 「Cancel」 / 「Don't show again」 and its own record: it still shows after the shared dialog has shown.
- R-032 [PM:pm-genai-dialog] The AI Background prompt waits until the page is resumed when it is not in front (「頁面未 resume 時延後顯示」).

## Open questions
- Q-1 The spec does not say where 「Ok」 leads. Assumption: the dialog closes and the Home tap goes on to the Launcher (for AI Glow Up, the Back goes on out of the feature); the row records where it lands. R-003; TC-002.
- Q-2 The board marks only the first six features as sharing the dialog, but says the AI Exposure download-failed prompt and the AI Background prompt share its title and text. Assumption: those two prompts show the new text too; PM confirms. R-030; TC-011, TC-012.
- Q-3 The trigger table is RD's notes on the current code (「依目前程式碼」), not a new design. Assumption: the triggers stay as they are and only the text changes; a trigger that differs is asked about, not filed. R-010 – R-016; TC-001 – TC-010.
- Q-4 Image Fusion is not in the Android Launcher lists the casebook knows (KP-123 / KP-124 name no 「Image Fusion」). Assumption: it is still reachable (RD names the entry); otherwise TC-005 / TC-006 are recorded n/a. R-013.

## Added 2026-11-11 — coverage passes and standing inputs
### One-way state (pass 9 of the verdict rules)
The shared record (R-020) cannot be undone in the UI, so every row that needs the dialog unseen runs right after a
reset: Android 「pm clear」 of PhotoDirector (logs pulled first), then the phone's sign-in. Order: TC-003 → TC-001 →
TC-002 → TC-009 (one reset); TC-010 (reset); TC-004 (reset); TC-005 → TC-006 (one reset); TC-007 → TC-008 (one reset).
TC-011 – TC-013 need the record set, so they run after any of those.

### System back
- The dialog: n/a (spec silent; it only has 「Ok」. TC-002 records what happens).
- Result pages of the six features: n/a (system Back is a trigger only for Face Swap, R-015, removed from the app).

### Hidden clauses
Pass 9: each clause the screen does not show, how a tester observes it and the rows.

| Requirement | Hidden clause | Observed through | Rows |
|---|---|---|---|
| R-020 | One record shared by the six features, kept on the device | Triggering a second feature after the first showed the dialog: no dialog | TC-009 |
| R-021 | The record is written when the dialog appears, not on 「Ok」 | Closing the app from Recents with the dialog open, then triggering again: no dialog | TC-010 |

### Variants
Pass 10: one line per variant.

| Requirement | Variant | Rows |
|---|---|---|
| R-016 | AI Headshot | TC-003 |
| R-016 | AI Try On | TC-003 |
| R-016 | AI Art | TC-003 |
| R-030 | AI Exposure download-failed prompt | TC-011 |
| R-030 | AI Background prompt | TC-012 |

### Domain rules
Every applicable spec / team rule of knowledge.md.

| Entry | Requirements |
|---|---|
| KP-012 Android has one paid mode: VIP = Pro = paid user | n/a (the dialog is the same for free and paid users; no tier rule in this spec) |
| KP-014 AI Exposure is paid-only | R-031 (TC-011 and TC-013 use a paid account) |
| KP-015 Mine refreshes entitlement after buying Premium | n/a (other feature or flow: not part of the auto-save dialog) |
| KP-016 A one-time free trial is consumed at once | n/a (other feature or flow: not part of the auto-save dialog) |
| KP-017 Credit Detail lists every AI use with feature name and amounts | n/a (other feature or flow: not part of the auto-save dialog) |
| KP-018 Credit Auto Pass keeps its own name in the Detail | n/a (other feature or flow: not part of the auto-save dialog) |
| KP-019 A burst of Generate taps charges once | n/a (other feature or flow: not part of the auto-save dialog) |
| KP-020 Blue credit button opens Buy Credit | n/a (other feature or flow: not part of the auto-save dialog) |
| KP-021 Premium chat quota is higher, not unlimited | n/a (other feature or flow: not part of the auto-save dialog) |
| KP-024 Finished AI images save to their feature tab | n/a (the dialog text states where results are saved; where they are saved is not changed by this spec) |
| KP-025 AI Exposure results go to Recent and the AI Exposure tab | n/a (other feature or flow: not part of the auto-save dialog) |
| KP-026 History button opens the feature's Artwork tab | n/a (other feature or flow: not part of the auto-save dialog) |
| KP-027 New features' works reach Recent | n/a (other feature or flow: not part of the auto-save dialog) |
| KP-028 Empty Artwork filter shows Nothing yet | n/a (other feature or flow: not part of the auto-save dialog) |
| KP-029 Long-task tiles and completion notifications | n/a (other feature or flow: not part of the auto-save dialog) |
| KP-030 Saved output matches the last preview | n/a (other feature or flow: not part of the auto-save dialog) |
| KP-032 Features opened from Edit Room get the edited image | n/a (other feature or flow: not part of the auto-save dialog) |
| KP-033 Banners and deep links preselect the linked style | n/a (other feature or flow: not part of the auto-save dialog) |
| KP-034 Discover tip bubble lifecycle | n/a (other feature or flow: not part of the auto-save dialog) |
| KP-035 AI Replace: reference image or prompt enables Next | n/a (other feature or flow: not part of the auto-save dialog) |
| KP-036 A custom prompt reaches the generator | n/a (other feature or flow: not part of the auto-save dialog) |
| KP-037 AI Try-On: no face check on clothing or pets | n/a (other feature or flow: not part of the auto-save dialog) |
| KP-038 AI Group Shot photo picking | n/a (other feature or flow: not part of the auto-save dialog) |
| KP-039 Agent job finished in background shows on return | n/a (other feature or flow: not part of the auto-save dialog) |
| KP-040 Crop tabs keep one consistent state | n/a (other feature or flow: not part of the auto-save dialog) |
| KP-041 Undo, Redo and Reset | n/a (other feature or flow: not part of the auto-save dialog) |
| KP-042 Restored state restores highlight and transform together | n/a (other feature or flow: not part of the auto-save dialog) |
| KP-043 Video Editing template titles keep their look | n/a (other feature or flow: not part of the auto-save dialog) |
| KP-044 Video Editing panels: X discards, V commits | n/a (other feature or flow: not part of the auto-save dialog) |
| KP-045 Audio Range Select close target | n/a (other feature or flow: not part of the auto-save dialog) |
| KP-046 Try-On / Hairstyle Back keeps the style | n/a (other feature or flow: not part of the auto-save dialog) |
| KP-047 Masks survive returning from Artwork or Store | n/a (other feature or flow: not part of the auto-save dialog) |
| KP-048 Arabic may keep Western digits | n/a (other feature or flow: not part of the auto-save dialog) |
| KP-049 Localised strings keep their placeholders | n/a (other feature or flow: not part of the auto-save dialog) |
| KP-050 RTL mirrors layout, not only text | n/a (other feature or flow: not part of the auto-save dialog) |

### Request ledger coverage
Every open table entry of requests.md for android.

| Ledger entry | Requirements |
|---|---|
| REQ-001 | R-001 – R-032 (the whole table) |
| REQ-002 | n/a (platform scope: this Android table only) |
