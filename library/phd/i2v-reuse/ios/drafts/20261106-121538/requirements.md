# Image to Video Reuse — requirements (ios)
Spec: Image to Video Reuse - PM Figma 6336-3478.md (text of the PM Figma page
https://www.figma.com/design/lSk4JUgbXG3DjauMLS9Et7/Image-to-Video?node-id=6336-3478, re-read 2026-11-06) and
Image to Video Reuse - Design Figma 4701-15518.md (text of the Design page 「261105_support to reuse model settings」
https://www.figma.com/design/VU8bgYiFHTWhYddg7ciqtL/Image-to-video---Character-motion-swap?node-id=4701-15518, read 2026-11-06). Figma-only spec set, no PDF.

The Design draws only Save & Share and My AI Artwork, in light and dark, with no arrows or notes. Everything else
(the reused room, the toasts, the removed model, errors, tracking) stays PM-only (pass 7) and its strings are checked
again if the Design draws them. Bracketed decision ids ([D1-04]) are the PM's own.

## Scope and entry
- R-001 [PM:pm-header D0-04] Reuse on a video's Save & Share page brings back the whole generation setting set (model, Duration, Video Quality, Generate Sound by AI and the prompt), not only the prompt text as the old Prompt Reuse did.
- R-002 [PM:pm-flow Overview D0-03] The only entry is the video-level 「Reuse」 on the Save & Share page: My AI Artwork shows no reuse list and no other reuse entry.
- R-003 [PM:pm-flow Overview D0-05] The button is named 「Reuse」 and appears on the Save & Share page reached from the My AI Artwork 「Image to Video」 tab and from Recent (Video).
- R-004 [PM:pm-flow Overview D0-06; PM:pm-ui template_video D0-06] Only Custom videos: a Template video's Save & Share page shows no 「Reuse」 and no 「Prompts & Settings」, as today.
- R-005 [PM:pm-flow Overview D0-06, D0-06b] Custom videos made with the 10/E Start/End frame option are in scope: their Save & Share page shows 「Prompts & Settings」 and 「Reuse」.

## My AI Artwork — Image to Video tab
- R-006 [PM:pm-ui My AI Artwork D0-07] The Image to Video tab is the same as today: 「Create more」 is its only creation button.
- R-007 [DS:d-artwork-light; PM:pm-ui Save & Share D1-07] The list tiles get no Reuse or other new button.
- R-008 [PM:pm-ui Save & Share D1-01; PM:pm-ui My AI Artwork D1-01] Tapping a finished Custom video in the Image to Video tab opens its Save & Share page with 「Prompts & Settings」 and 「Reuse」.
- R-009 [PM:pm-ui Save & Share D0-05, D1-01] Tapping a finished Custom video in Recent (Video) opens the same Save & Share page with 「Prompts & Settings」 and 「Reuse」.

## Save & Share — Prompts & Settings
- R-010 [DS:d-save-share-light; PM:pm-ui Save & Share D0-04b, D1-10] The Prompts area's title is 「Prompts & Settings」.
- R-011 [DS:d-save-share-light; PM:pm-ui Save & Share D0-04b] The page has exactly one 「Reuse」: the old Prompt Reuse row is replaced by it, not shown beside it.
- R-012 [DS:d-save-share-light; PM:pm-ui Save & Share D2-01] The section is a card: the model's icon and name with 「Reuse」 at the right of the same row, under them one chip each for Duration, Quality and Sound (sample 「10s」 「Pro」 「Sound on」, Q-13), and under the chips the video's prompt.
- R-067 [DS:d-save-share-light] On a Custom video's page the order is 「Save」, 「More Video Editing Tools」, 「Add Text」 「Add Sticker」 「Add Music」, 「Prompts & Settings」, 「Share to」.
- R-068 [DS:d-save-share-dark] In dark mode the 「Prompts & Settings」 card follows the dark frame: the title, model name, chips, prompt and 「Reuse」 are readable on the dark background (Q-16).
- R-013 [PM:pm-ui Save & Share D2-03] Only Custom videos that generated successfully show 「Prompts & Settings」 and 「Reuse」; processing and failed jobs do not.
- R-014 [PM:pm-ui Save & Share D2-03b; PM:pm-draft-tbd Q1] Custom videos generated before 4/E show no 「Reuse」 on day 1 (RD to confirm).
- R-015 [PM:pm-draft-tbd Q2 D2-07] A Custom video whose full settings cannot be read (made on the other platform, or after a reinstall) shows no 「Reuse」 on day 1 (RD to confirm).

## Reuse into Image to Video Custom
- R-016 [PM:pm-ui Save & Share D1-04] Tapping 「Reuse」 opens Image to Video with the 「Custom」 tab selected.
- R-017 [PM:pm-ui From Save & Share Reuse D2-01] The model the video was made with is selected.
- R-018 [PM:pm-ui From Save & Share Reuse D2-01] The video's Duration is selected.
- R-019 [PM:pm-ui From Save & Share Reuse D2-01] The video's Video Quality is selected.
- R-020 [PM:pm-ui From Save & Share Reuse D2-01] Generate Sound by AI is set as it was for the video.
- R-021 [PM:pm-ui From Save & Share Reuse D2-01, D0-06b] The 「Specify Video Start / End」 switch is set as it was for the video.
- R-022 [PM:pm-ui From Save & Share Reuse D2-01; PM:pm-flow D1-04] The video's prompt is filled in the prompt box, with its character counter (mockup 「58/2,500」).
- R-023 [PM:pm-ui From Save & Share Reuse D2-01; PM:pm-flow D1-04] The photo is not brought back: 「Add your images」 is empty.
- R-024 [PM:pm-ui From Save & Share Reuse D2-01] The Inspiration is not brought back: no inspiration is selected under 「Try with inspirations」.
- R-025 [PM:pm-flow D1-04; PM:pm-ui From Save & Share Reuse D1-04b] On entering, the toast 「Settings applied」 shows on the Custom page.
- R-026 [PM:pm-ui From Save & Share Reuse D1-04b] When Image to Video would show its iOS intro (demo / Steps) or the AI Processing Notice, it shows first as today, and 「Settings applied」 shows only once the Custom page is visible.
- R-027 [PM:pm-ui From Save & Share Reuse D1-08] The toast takes priority over a panel (Q-4).
- R-028 [PM:pm-ui From Save & Share Reuse D3-01] Reuse charges no credits.
- R-029 [PM:pm-ui From Save & Share Reuse D3-02] 「Generate」 shows the reused model's current credit price.
- R-030 [PM:pm-ui From Save & Share Reuse D3-03; KB: KP-016] Free trial works as in Image to Video Custom: a user with the free trial sees it in the reused room as in a Custom room opened by Create more.

## In the room after Reuse
- R-031 [PM:pm-ui From Save & Share Reuse D1-06] Switching models in the room keeps the settings as the 4/E rule does; values the new model does not support go back to that model's defaults.
- R-032 [PM:pm-ui From Save & Share Reuse D1-06] Leaving the room resets it, as Image to Video Custom does: the next Custom room opened by 「Create more」 has the default model and settings and an empty prompt.
- R-033 [PM:pm-ui From Save & Share Reuse D1-05] ‹ Back in the reused room returns to the Save & Share page.
- R-034 [PM:pm-flow arrow 「‹ back --> My AI Artwork」] ‹ Back on the Save & Share page returns to My AI Artwork (Image to Video tab).

## Generate from Reuse
- R-035 [PM:pm-ui From Save & Share Reuse D4-01] Generate is sent under the reused model's existing action ID.
- R-036 [PM:pm-ui From Save & Share Reuse D3-02; KB: KP-023] Generate charges the price 「Generate」 showed; the credit usage history is the record to match, not the badge.
- R-037 [PM:pm-flow Artwork mockup] The new job appears in My AI Artwork › Image to Video as a Processing tile and becomes a finished Custom video.
- R-038 [PM:pm-header D0-04; Rule pass 10] The new video is made with the reused settings: its length is the reused Duration and it has sound only when Generate Sound by AI was on.
- R-039 [PM:pm-ui From Save & Share Reuse D2-01] The reused prompt is the prompt sent to the generator.

## Create more (unchanged)
- R-041 [PM:pm-ui My AI Artwork D1-03, D0-03; PM:pm-flow D1-03] 「Create more」 opens the Custom tab with the default model (mockup 「Kling 3.0」), the placeholder prompt 「Describe the subject, action, and overall scene, e.g. A woman walking in a park on a sunny afternoon.」, 「0/2,500」, no 「Settings applied」 toast and no reuse list.

## Model no longer available
- R-042 [PM:pm-ui Model 已下架 D2-02] 「Reuse」 can still be tapped on a video whose model was removed; the room opens with the default model.
- R-043 [PM:pm-ui Model 已下架 D2-02] The other parameters come along where the default model supports them, else they take its defaults (4/E model-switch rule).
- R-044 [PM:pm-ui Model 已下架 D2-02b, D1-09] Entering shows the toast 「This model is no longer available.」 / 「Switched to recommended model.」 on two lines, and not 「Settings applied」.
- R-045 [PM:pm-ui Model 已下架 D3-04; PM:pm-error-handling] 「Generate」 charges the default model's current price under its action id.

## Error handling
- R-046 [PM:pm-error-handling D2-05] A reused prompt longer than the current model's limit is brought back whole; the box and the counter turn red and 「Generate」 is disabled, as today; no credits are charged (the PM names the limit for Android only, Q-7).
- R-047 [PM:pm-error-handling D2-06] Reuse with no network behaves as opening Image to Video with no network today; no credits are charged.
- R-048 [PM:pm-error-handling D2-08] After Reuse to a model that does not support real people, a photo with a face shows 「The photo you uploaded includes a real person, which isn't supported by the selected model.」, as today; no credits are charged.
- R-049 [PM:pm-error-handling D2-08] Not enough credits, Free user: 「Generate」 leads to Upgrade to Premium, as today; no credits are charged.
- R-050 [PM:pm-error-handling D2-08; KB: KP-013] Not enough credits, subscriber (Pro or Pro+): 「Generate」 leads to 「More Credits Required」, as today; no credits are charged.

## Tracking events
- R-051 [PM:pm-tracking D4-05] Tapping 「Reuse」 sends the new event ImageToVideo_Reuse_Click with parameter `model`.
- R-052 [PM:pm-tracking D4-02, D4-03] Generate after Reuse from the Image to Video tab's Save & Share sends ImageToVideo_Result_Generate with from = artwork_reuse (a new value on iOS, same as Android).
- R-053 [PM:pm-tracking D4-02] Generate after Reuse from a Save & Share page opened from Recent (Video) sends from = artwork_reuse (Recent is not split out).
- R-054 [PM:pm-tracking D4-02] Generate after 「Create more」 sends from = Artwork, as today.
- R-055 [PM:pm-tracking D0-02, D4-03] Success metric and naming rule (three PascalCase parts, snake_case parameters) — NOT TESTABLE: analytics rules for RD; the event names are checked by R-051 to R-054.

## Credits and artwork
- R-056 [PM:pm-ui from_video mockup] The history button at the reused room's top right does what it does in a Custom room opened by 「Create more」.
- R-057 [PM:pm-ui from_video mockup] The credit button at the reused room's top shows the account's balance and opens what it opens in a Custom room opened by 「Create more」.

## Open questions
- Q-1 The Design does not draw the reused room or its toasts, so 「Settings applied」 and the removal toast still come from the PM mockups only. 「Prompts & Settings」 and 「Reuse」 are now confirmed by the Design. Assumption: the PM strings are expected until the Design draws them. R-025, R-044; TC-010, TC-029.
- Q-2 Which videos count as made 「before 4/E」? The PM's own draft question Q1 waits for RD (meeting 2026-10-28) and no build or date is given. Assumption: a Custom video generated on a build older than 4/E shows no 「Reuse」. R-014; TC-041.
- Q-3 Videos whose settings cannot be read. The PM draft Q2 suggests 「do not bring in the default model setting」 but its day-1 line says 「no Reuse」. Assumption: day 1 shows no 「Reuse」 for such a video (made on iOS, or before a reinstall). R-015; TC-042.
- Q-4 「toast 優先於 panel」: which panel, and what does priority mean? Assumption: when a panel is open or opens as the room appears, 「Settings applied」 still shows on top of it and is not hidden by it. R-027; TC-016.
- Q-5 Back from a Save & Share page opened from Recent (Video): the PM arrow draws only the Image to Video tab path. Assumption: ‹ returns to where the page was opened (Recent). R-034; TC-009.
- Q-6 The 「model_sunset」 mockup shows an empty prompt and placeholder, while the rule says the other parameters come along. Assumption: the prompt is brought back (R-043) and the empty box in the mockup is a drawing shortcut. R-043; TC-030.
- Q-7 「Android 上限 500」 gives no limit for iOS and names no model. Assumption: the row uses any iOS model whose limit is below the reused prompt's length; if no iOS model has a lower limit, the row is retired. R-046; TC-032.
- Q-8 How are tracking events observed on iOS? Assumption: rows wait for an event log (log pull or RD event viewer) and are parked until one is set up. R-051 to R-054; TC-037 to TC-040.
- Q-10 The chips for a model without a Quality or Sound option are not drawn. Assumption: the card shows chips only for the settings the model has, in the order Duration, Quality, Sound. R-012; TC-012.
- Q-11 A video made from an inspiration: is the prompt text kept while only the inspiration selection is dropped? Assumption: yes, the prompt text comes back and no inspiration is selected. R-024; TC-014.
- Q-12 Which model does not support real people, and which are the 10 models? Not listed. Assumption: the tester finds the model from the app's current behaviour (the message shows today) and records its name. R-048; TC-034.
- Q-13 The Sound chip reads 「Soound on」 in the Design, a likely typo, and the PM wrote 「Sound On」. Assumption: the app shows 「Sound on」, with a lower-case 「on」 as the Design has it. R-012; TC-006.
- Q-14 The Design's My AI Artwork frames look copied from an older page: the selected tab is 「Character Motion Swap」 with no 「Image to Video」 tab, and the failed tile has 「Resume to Upload」, while the PM draws an 「Image to Video」 tab and failed tiles with 「Retry」, 「Report」 and 「View Details」. The PM says this page stays as today. Assumption: the PM holds, and the first run confirms it on the device. R-006, R-008, R-013; TC-001, TC-002, TC-004.
- Q-15 The PM's Save & Share mockup has a home button at the top right; the Design shows only ‹. Assumption: the page keeps whatever it has today, so no row presses it. No row depends on this. R-067; TC-049.
- Q-16 The Design draws dark frames but no spec says how they are reached. Assumption: the page follows the iPhone's Dark appearance; if the app has no dark mode the row is retired. R-068; TC-050.
- Q-17 The spec does not name the iOS route to the credit usage history. Assumption: Mine › My Credits (KP-123 names My Credits only). R-028, R-036; TC-017, TC-025, TC-031.

## Added 2026-11-04 — coverage passes and standing inputs

### Flow arrows walked by existing rows
The PM draws its arrows as frames named 「<from> --> <to>」 (legend: blue = forward, red = return); they are listed by hand in `arrows.json`.
- R-062 [PM: flow arrow 6366:5631 https://www.figma.com/design/lSk4JUgbXG3DjauMLS9Et7/Image-to-Video?node-id=6366-5631] Custom video tile → Save & Share · Reuse: the Save & Share page with 「Prompts & Settings」 and 「Reuse」. Walked by: TC-002.
- R-063 [PM: flow arrow 6366:5635 https://www.figma.com/design/lSk4JUgbXG3DjauMLS9Et7/Image-to-Video?node-id=6366-5635] Reuse → I2V Custom · from_video: settings and prompt filled, photo empty, 「Settings applied」. Walked by: TC-010.
- R-064 [PM: flow arrow 6366:5639 https://www.figma.com/design/lSk4JUgbXG3DjauMLS9Et7/Image-to-Video?node-id=6366-5639] ‹ back in the reused room → Save & Share. Walked by: TC-020.
- R-065 [PM: flow arrow 6366:5643 https://www.figma.com/design/lSk4JUgbXG3DjauMLS9Et7/Image-to-Video?node-id=6366-5643] ‹ back on Save & Share → My AI Artwork. Walked by: TC-009.
- R-066 [PM: flow arrow 6378:795 https://www.figma.com/design/lSk4JUgbXG3DjauMLS9Et7/Image-to-Video?node-id=6378-795] Create more → I2V Custom · default. Walked by: TC-028.

### Job states
Every cell names the rows that check it, or n/a when the spec defines nothing for that state.

| Job | Start / loading | Success | Failure | Retry | Second failure | Partial | Stop | Leave and return | Longest wait | Done notice |
|---|---|---|---|---|---|---|---|---|---|---|
| Reuse (opening the room with the settings) | n/a (no loading state: Reuse opens the room) | TC-010 | TC-033 | n/a (spec silent) | n/a (spec silent) | TC-029 | n/a (nothing to stop) | TC-022 | n/a (no wait) | TC-010 |
| Generate from Reuse (video job) | TC-023 | TC-024 | n/a (same as Image to Video Custom today; spec silent) | n/a (same as today: the Artwork tile's 「Retry」) | n/a (spec silent) | n/a (one video) | n/a (spec silent) | n/a (long task in My AI Artwork, as today) | n/a (same as today; the tile shows the remaining time) | TC-023 |

### Error classes
| Job | Error classes |
|---|---|
| Reuse (opening the room with the settings) | n/a (spec names no error classes) |
| Generate from Reuse (video job) | n/a (spec names no error classes; failures as Image to Video today) |

### Exit × stage
| Stage | ‹ Back |
|---|---|
| Save & Share (Custom video) | TC-009 |
| Reused room, nothing changed | TC-020 |
| Reused room, prompt keyboard open | n/a (spec silent) |
| iOS intro or AI Processing Notice over the reused room | n/a (its own close, as today) |

### Hidden clauses
| Requirement | Hidden clause | Observed through | Rows |
|---|---|---|---|
| R-028 | Reuse charges nothing | The credit balance before and after Reuse, and no new entry in the credit usage history (Mine › My Credits) | TC-017 |
| R-035 | Generate is sent under the reused model's existing action ID | the credit usage history (Mine › My Credits) shows the use under Image to Video at that model's price; the request in the app log after a log pull (parked until a PhotoDirector Android log pull is set up) | TC-025, TC-026 |
| R-039 | The reused prompt is the prompt sent to the generator | The request in the app log after a log pull; the video follows the prompt | TC-026 |
| R-045 | The default model's action id is charged after a removal | the credit usage history (Mine › My Credits) after Generate shows the default model's price | TC-031 |
| R-048 | The real-person check charges nothing | The credit balance before and after Generate, and no new entry in the credit usage history (Mine › My Credits) | TC-034 |
| R-051 | ImageToVideo_Reuse_Click is sent with `model` | The analytics event log (Q-8) | TC-037 |
| R-052 | from = artwork_reuse is sent | The analytics event log (Q-8) | TC-038 |
| R-053 | from = artwork_reuse is sent from Recent | The analytics event log (Q-8) | TC-039 |
| R-054 | from = Artwork is sent after Create more | The analytics event log (Q-8) | TC-040 |

### Variants
| Requirement | Variant | Rows |
|---|---|---|
| R-068 | theme=dark | TC-050 |
| R-012 | theme=light | TC-006 |
| R-026 | intro=demo / Steps | TC-015 |
| R-026 | intro=AI Processing Notice | TC-051 |
| R-017 | model=Kling 2.6 (the mockup video) | TC-010 |
| R-017 | model=another model that is not the default | TC-012 |
| R-018 | Duration=10s | TC-011 |
| R-018 | Duration=another value of the model | TC-012, TC-024 |
| R-019 | Video Quality=Pro | TC-011 |
| R-019 | Video Quality=another value | TC-012 |
| R-020 | Generate Sound by AI=On | TC-011, TC-024 |
| R-020 | Generate Sound by AI=Off | TC-012 |
| R-021 | Start/End=Off | TC-010 |
| R-021 | Start/End=On | TC-013 |
| R-038 | Duration and sound carried into the generated video | TC-024 |
| R-049 | tier=Free | TC-035 |
| R-049 | tier=Pro (R-050) | TC-036 |
| R-049 | tier=Pro+ (R-050) | TC-052 |
| R-050 | tier=Pro | TC-036 |
| R-050 | tier=Pro+ | TC-052 |
| R-050 | tier=Free (R-049) | TC-035 |
| R-003 | entry=Image to Video tab | TC-002 |
| R-003 | entry=Recent (Video) | TC-003 |
| R-052 | entry=Image to Video tab | TC-038 |
| R-053 | entry=Recent (Video) | TC-039 |

### Domain rules
| Entry | Requirements |
|---|---|
| KP-013 | R-050 |
| KP-016 | R-030 |
| KP-031 | n/a (this page's spec draws no 「Next Edit」) |
| KP-127 | n/a (no editor) |
| KP-128 | n/a (no portrait tools) |

### Request ledger coverage
| Ledger entry | Requirements |
|---|---|
| (none open of kind table) | n/a |
