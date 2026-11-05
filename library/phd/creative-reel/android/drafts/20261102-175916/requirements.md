# Creative Reel (Reel Creator room) — requirements (android)
Spec: Creative Reel.pdf ("Reel Creator（原 Cinematic Reel Creator）— Room & Template Preview", spec set 2026-11-02)

Source tags: `[PM:<board>]`, board IDs from `specs/2026-11-02/extracted/boards.json`. The file is one PM-owned Figma
export carrying both the mockups (UI strings) and the rule boxes; there is no separate Design or MX file. Mockups are
iPhone frames; Android differences are in "System back". Red note lines are pending items (待決 / 待確認) and are Open
questions unless they state a rule. **PDF-only analysis** (`extracted/figma-pending.json`): Figma steps 8 and 10 are
owed. Product: PhotoDirector (the language note says 「PhD 支援的所有語言」; credit pill, AI Creative Studio).
"Creative" = the Opus 5.5 reel templates (Year-End Recap, Christmas Time …); "AI Transition" = Cool Transitions;
"CineStory" = Cinematic Styles. Request ledger: REQ-001 (this table), REQ-003 (K75 / K76). PHD domain knowledge (`library/phd/knowledge/`, standing input 6; imported K ids kept as `aka`) is applied (REQ-003 K75 / K76, REQ-004 K01–K74): rules that fit the feature are R-101 – R-113 citing `[KB: KP-…]`; the rest are listed in update-plan.md › Not added.

## Room
- R-001 [PM:room] The room formerly called 「Cinematic Reel Creator」 is titled 「Reel Creator」.
- R-002 [PM:room] The Effects button that opens the room is labelled 「Reel Creator」.
- R-003 [PM:room] The Launcher Shortcut for the room is labelled 「Reel Creator」.
- R-004 [PM:room] The Launcher Template row for the room is labelled 「Reel Creator」.
- R-005 [PM:room] The AI Video Page entry for the room is labelled 「Reel Creator」.
- R-006 [PM:room] The room has no tabs: one page of sections from top to bottom, the three features mixed: 「Cinematic Styles 🎬」 = CineStory, 「Year-End Recap 📅」 and 「Christmas Time 🎄」 … = Creative (Opus 5.5), 「Cool Transitions 🤳🏻」 = AI Transition.
- R-007 [PM:room] Each section is a category (CMS category = section) showing its template cards in a horizontal row (as drawn).
- R-008 [PM:room; KB: KP-020] The room's top bar shows 「‹」, the blue credit button and the History button (as drawn). The credit button shows the account's current credit balance and a 「+」; tapping it opens the Buy Credit page.
- R-101 [PM:room; KB: KP-026] The History button (a sheet of paper with a clock at its bottom right) opens My AI Artwork with the feature's own tab, 「Reel Creator」, selected.
- R-009 [PM:room] Section order is pending (Meg / CMS, Q-1); the room shows every section whatever the order.

## Entry from Edit Room
- R-010 [PM:room] Entering Reel Creator from the Edit Room first shows a dialog asking whether to jump (as Image to Video), and the photo being edited is saved automatically.
- R-011 [PM:room] Declining the jump dialog keeps the user in the Edit Room with the edit intact (the dialog's cancel branch; copy as I2V, Q-13).
- R-012 [PM:room] After the jump the Reel Creator room opens without carrying the photo in: no template has it preselected, CineStory included (different from today).

## Deeplink
- R-013 [PM:deeplink] The old Cinematic Reel Creator deeplink opens the Reel Creator room.
- R-014 [PM:deeplink] With no parameter the deeplink opens the room.
- R-015 [PM:deeplink] With template = content GUID the deeplink opens that template's Preview page directly, with no photo selected.
- R-016 [PM:deeplink] A CineStory (Cinematic Styles) GUID is supported.
- R-017 [PM:deeplink] A GUID of the new CMS type (AI Transition / Creative) is supported.
- R-018 [PM:deeplink] A GUID that is not found opens the room.
- R-019 [PM:deeplink] The category parameter is not supported (no tabs): a deeplink with only a category opens the room.

## CMS and template data
- R-020 [PM:room] Each template carries DisplayName, description, demo, View photo tips content (Recommend / Avoid) and Photo min / max; the Preview, tips and picker show them.
- R-021 [PM:room] AI Transition templates have min = max, fixed at 4 or 6 photos.
- R-022 [PM:room] Creative templates have min < max per template, possibly more than 10 (e.g. 「5–15 photos」).
- R-023 [PM:room] The output ratio is fixed at 9:16 for every feature (Creative, Cinematic Styles, AI Transition): confirm page 「output 9:16」, and the generated video file is 9:16 in pixels.
- R-024 [PM:room] Creative feature_id is pending (Meg, early November) — NOT TESTABLE: an analytics id with no app-visible effect (Q-2).
- R-025 [PM:room] Schedule: Android 11/E, iOS 12/B, the three features ship together — NOT TESTABLE: release plan.

## Preview
- R-026 [PM:preview] Tapping any template in the room opens a full-screen 9:16 demo that auto-plays and loops.
- R-027 [PM:preview] Swiping up / down on the Preview switches template like Reels.
- R-028 [PM:preview] The swipe range is the template's own category, looping endlessly (after the last comes the first, before the first comes the last).
- R-029 [PM:preview] 「View photo tips」 is at the top left; a mute button is on the right side.
- R-030 [PM:preview] The mute button turns the demo's sound off and on.
- R-031 [PM:preview] At the bottom: template name, description and photo count (「5–15 photos」 / 「1 photo」), then the CTA 「Use Template」.
- R-032 [PM:preview] The text lies over the demo with the bottom darkened.
- R-033 [PM:preview] The first time the room is entered a finger animation guides swiping up / down; it is not shown again.
- R-034 [PM:preview] 「Use Template」 opens the photo picker directly.
- R-035 [PM:preview] The Preview has 「‹」 and the credit pill at the top (as drawn); 「‹」 returns to the room (no arrow drawn, Q-8).

## View photo tips
- R-036 [PM:preview] 「View photo tips」 sits at the top left as in CineStory and opens only when tapped; it never pops up by itself.
- R-037 [PM:preview] The tips sheet shows 「Photo tips」, 「✓ Recommended」 with example images and bullets, 「✕ Avoid」 with example images and bullets, and 「Got it」.
- R-038 [PM:preview] Tips content comes from the CMS and is written per template (Recommended / Avoid text + example images).
- R-039 [PM:preview] The portrait-photo advice is under Recommended (「Portrait (vertical) photos work best」).
- R-040 [PM:preview] 「Got it」 closes the sheet back to the Preview (drawn).

## Photo picker
- R-041 [PM:picker] 「Use Template」 goes straight to the picker 「Add Photos」 (「‹」, album 「Recents ▾」); several photos can be picked and the pick order is shown as 01, 02 … on the thumbnails.
- R-042 [PM:picker] The bottom tray shows 「Select {min}–{max} photos」, 「{picked}/{max}」, the picked thumbnails (horizontal scroll) and 「Next」.
- R-043 [PM:picker] 「Next」 works only when the count is within min–max; below min the tray says in red 「Select at least {min} photos ({n} more)」 and Next is disabled (drawn).
- R-044 [PM:picker] When min = max the tray says 「Select N photos」 (「Select 1 photo」, AI Transition 4 or 6).
- R-045 [PM:picker] Each photo is checked when picked: 300–4096 px, ≤ 10 MB, NSFW, celebrity; a photo that fails is marked. 「10 MB」 does not say decimal or binary (Q-22): rows test below 10,000,000 bytes (accepted) and above 10,485,760 bytes (marked), which hold under both readings.
- R-046 [PM:picker] Both landscape and portrait photos are accepted.
- R-047 [PM:picker] Picking more than max photos is not allowed (Next works only within the range); how a pick past max is refused is not drawn (Q-11).
- R-048 [PM:picker] Tapping a picked photo again unpicks it; the count and tray follow (renumbering not stated, Q-11).
- R-049 [PM:picker] 「Recents ▾」 switches the album (drawn control).
- R-050 [PM:picker] The picker 「‹」 returns to the Preview (no arrow drawn, Q-8).

## Picker memory (NEW)
- R-051 [PM:picker] A session runs from app launch to session end; within it, entering the picker again remembers the photos picked last time.
- R-052 [PM:picker] Above the tray the picker shows 「Use the N photos you picked last time?」 with 「Import」 and 「×」.
- R-053 [PM:picker] 「Import」 brings in the picked state and stays in the picker (does not leave it).
- R-054 [PM:picker] When the imported count is above the template's max, the tray shows red text and Next stays disabled until photos are removed down to the range.
- R-055 [PM:picker] When the imported count is below the template's min, the tray shows red text 「Select at least {min} photos ({n} more)」 and Next stays disabled until enough are added.
- R-056 [PM:picker] Photos no longer in the phone gallery are not brought in.
- R-057 [PM:picker] When only 1 photo was picked last time, the prompt is not shown.
- R-058 [PM:picker] After the app is relaunched (new session) the prompt is not shown.
- R-059 [PM:picker] The memory applies across templates in the same session (any later picker entry, e.g. another template's).

## Confirm-generate page (NEW)
- R-060 [PM:confirm] Top: template thumbnail, name and 「{min}–{max} photos · output 9:16」, with 「‹」 and the credit pill.
- R-061 [PM:confirm] 「Your photos」 shows every input image with the count 「{n}/{max}」 and the hint 「Long-press to reorder · tap × to remove」.
- R-062 [PM:confirm] Long-press and drag reorders the photos (as AI Creative Studio).
- R-063 [PM:confirm] 「×」 on a photo removes it and the count goes down.
- R-064 [PM:confirm] The 「+」 tile returns to the picker carrying the current selection.
- R-065 [PM:confirm] AI Transition: the order on this page is the order the photos appear in the output.
- R-066 [PM:confirm] Creative: the output does not have to follow the user's order, but every input photo is used (content team), with no extra notice on the page.
- R-067 [PM:confirm] Creative only: a 「Text language」 dropdown, default the device language. AI Transition and Cinematic pages have no Text language.
- R-068 [PM:confirm] The button reads 「Generate | 60」 on the Creative template drawn (「Top 5 of My Year」); the credit number is binding (other templates' prices: Q-9).
- R-069 [PM:confirm] Removing photos below min turns the count red and disables Generate; tapping it shows the toast 「Please upload at least %d photos」 (「Please upload at least 5 photos」).
- R-070 [PM:confirm] With too few credits a free user gets the paywall; a subscribed user gets 「More Credits Required」, which leads to the Credit Shop.
- R-071 [PM:confirm] Generate charges the credits on the button (balance drops by 60 for 「Top 5 of My Year」).
- R-072 [PM:confirm] 「‹」 on the confirm page goes back (to the picker; no arrow drawn, Q-8).

## Text language (Creative only)
- R-073 [PM:text-language] The default is the device language, marked 「(Device language)」 with a ✓.
- R-074 [PM:text-language] The list holds every language PhD supports (same list on iOS and Android) and scrolls: 「English」, 「繁體中文」, 「简体中文」, 「日本語」, 「한국어」, 「Español」, 「Français」, 「Deutsch」, 「Português」, 「Italiano」, 「ภาษาไทย」 … (drawn).
- R-075 [PM:text-language] The chosen language code is passed to the engine: the reel's text comes out in that language (Opus 5.5 pipeline supports them all).
- R-076 [PM:text-language] The choice is kept within the session and reset when the room is left.
- R-077 [PM:text-language] Text in the generated reel cannot be edited afterwards.

## Generation and My AI Artwork
- R-078 [PM:artwork] After Generate the app shows My AI Artwork on the 「Reel Creator」 tab with the new item 「Processing…」 and a time estimate (「3 minutes remaining…」) with a progress bar.
- R-079 [PM:artwork] Results of all three features go to the (former Cinematic Reel Creator) Artwork page.
- R-080 [PM:artwork] The Artwork tab is named 「Reel Creator」 (tabs 「Image to Video」, 「Reel Creator」, 「Character Motion Swap」 as drawn).
- R-081 [PM:artwork] The tab has no sub tabs and no feature split; items are sorted by time (newest first), each showing its date and template name.
- R-082 [PM:artwork] 「Create More」 returns to the Reel Creator room.
- R-083 [PM:artwork] The finished item can be opened and plays the 9:16 reel (R-023).

## Cinematic Styles (CineStory, 1 photo)
- R-084 [PM:cinematic] Cinematic Styles follows the same flow: Preview → Use Template → single-photo picker 「Select 1 photo」 → confirm page → 「Generate | 40」.
- R-085 [PM:cinematic] The Cinematic confirm page shows 「1 photo · output 9:16」, 「Your photos」 「1/1」 and 「Tap the photo to replace」; tapping the photo replaces it.
- R-086 [PM:cinematic] The Cinematic confirm page has no Text language.

## AI Transition (Cool Transitions)
- R-087 [PM:room, PM:confirm] An AI Transition template's picker needs exactly its fixed count (4 or 6): 「Select 4 photos」 / 「Select 6 photos」, Next only at that count.
- R-088 [PM:confirm] The AI Transition confirm page has no Text language and its Generate charges the price shown (price not drawn, Q-9).

## Android
- R-089 [Rule: Android system Back, REQ-051] System Back on every screen and sheet of the feature behaves as its own 「‹」 / 「×」 / 「Got it」, closes the keyboard or dropdown first, or (where the spec gives no exit) is recorded (Q-8).

## PHD domain knowledge (standing input 6, REQ-004)
- R-102 [KB: KP-017] After a Generate of each feature (Creative, Cinematic Styles, AI Transition) ends, Buy Credit › 「Detail」 lists the use with the right feature name and the credits actually deducted, and any refund with its amount.
- R-103 [KB: KP-019] Once the first Generate tap is accepted, further taps are blocked: a burst of taps charges once and makes one result.
- R-104 [KB: KP-029] A finished reel job (a long video job, as Cinematic Reel Creator) sends a completion notification with a title and message whose tap opens the right page (the result in My AI Artwork). The spec is silent (Q-12).
- R-105 [KB: KP-049] Localised strings that carry numbers (tray 「Select {min}–{max} photos」 and 「({n} more)」, the Import prompt N, the toast 「Please upload at least %d photos」) show the right numbers in every app language and never crash the screen.
- R-106 [KB: KP-050, KP-048] In an RTL app language (Arabic) the room, Preview, picker, confirm page and Text language list mirror their layout and stay in bounds; Western digits are acceptable.
- R-107 [KB: KP-101] Long translations (e.g. German, Portuguese) on the picker tray, Import prompt and confirm page stay readable and every button stays reachable.
- R-108 [KB: KP-072] Every entry to the room (Effects button, Launcher Shortcut, Launcher Template row, AI Video page, My AI Artwork 「Create More」) opens it, and its 「‹」 returns to the page of that entry.
- R-109 [PM:room; KB: KP-032] The photo saved automatically on the Edit Room jump is the current edited image, not the original file.
- R-110 [KB: KP-074] A template deeplink opened while the app is already running (warm start) opens the same Preview as from a cold start, without a crash before the template data has loaded.
- R-111 [KB: KP-091] The Preview's mute state stays when swiping to another template.
- R-112 [KB: KP-097] After Activity re-creation (Don't keep activities) the confirm page keeps its photos, order, count and Text language.
- R-113 [KB: KP-083] After 「Create More」 from My AI Artwork, a new generation from the room runs normally and Back from the room works (no stale resource).

### Domain rules
Cited above: KP-020, KP-026, KP-017, KP-019, KP-029, KP-049, KP-050, KP-048, KP-101, KP-072, KP-032, KP-074, KP-091,
KP-097, KP-083. The rest, carried over from update-plan.md › Not added (REQ-004; K ids are the entries' `aka`, moved
from `library/phd/domain/` to `library/phd/knowledge/` on 2026-11-05):
- KP-012 (K36b) → n/a as a row (noted on TC-073).
- KP-014 (K36c), KP-025 (K47b) → n/a (the feature has no AI Exposure).
- KP-016 (K31) → n/a (no free trial in this flow).
- KP-021 (K44), KP-039 (K42) → n/a (no AI Agent in this flow).
- KP-024 (K47a) → n/a (images only; Reel Creator outputs are videos, R-079 covers Artwork).
- KP-028 (K46) → n/a (a filter rule; the Reel Creator tab is a feature tab, not a filter).
- KP-030 (K50) → n/a (no editing in this flow).
- KP-033 (K04) → n/a as a row (noted on TC-015).
- KP-034 (K05) → n/a (the Discover tip bubble is not in this flow; K05's warm-start risk is KP-074, R-110).
- KP-035 (K08), KP-036 (K11), KP-037 (K12), KP-038 (K14) → n/a (no prompt or reference inputs in this flow).
- KP-040 (K20), KP-041 (K21), KP-042 (K22), KP-046 (K27), KP-047 (K29) → n/a (no edit tools in this flow).
- KP-043 (K24), KP-044 (K25), KP-045 (K26) → n/a (no Video Editing in this flow).
- KP-015 (K36e), KP-018 (K36d), KP-027 (K47c) → not reviewed in REQ-004 (missing from its lists); the next draft
  decides them. KP-027 (new features' works reach Recent) likely applies to Reel Creator.

## Flow arrows
- R-090 [PM:room flow arrow room-a1 ] Room template card → Preview. Walked by: TC-023.
- R-091 [PM:preview flow arrow preview-a1 ] Preview 「View photo tips」 → Photo tips sheet. Walked by: TC-033.
- R-092 [PM:preview flow arrow preview-a2 ] Preview 「Use Template」 → picker. Walked by: TC-037.
- R-093 [PM:picker flow arrow picker-a1 ] Picker entered again in the session → Import prompt. Walked by: TC-054.
- R-094 [PM:picker flow arrow picker-a2 ] 「Import」 → picker with the photos selected and the red tray. Walked by: TC-057.
- R-095 [PM:picker flow arrow picker-a3 ] Picker 「Next」 (in range) → confirm page. Walked by: TC-053.
- R-096 [PM:confirm flow arrow confirm-a1 ] Remove below min → Generate disabled and toast. Walked by: TC-066, TC-067.
- R-097 [PM:text-language flow arrow text-language-a1 ] 「Generate」 → My AI Artwork Processing card. Walked by: TC-085.
- R-098 [PM:artwork flow arrow artwork-a1 ] 「Create More」 → room. Walked by: TC-091.
- R-099 [PM:cinematic flow arrow cinematic-a1 ] Cinematic 「Use Template」 → 「Select 1 photo」 picker. Walked by: TC-092.
- R-100 [PM:cinematic flow arrow cinematic-a2 ] Cinematic 「Next」 → Cinematic confirm page. Walked by: TC-094.

## Open questions
- Q-1 Section order in the room is pending (Meg and CMS: can CineStory move to the new CMS type). R-009.
- Q-2 Creative feature_id pending (leaning to CineStory's; Meg, early November; fallback CineStory feature_id with action_id vendor Opus 5.5). R-024.
- Q-3 「Picked last time」 = the set last confirmed with Next, or the set last generated? R-051, R-052.
- Q-4 Is the memory only inside Reel Creator, or shared by the app's other pickers? R-051.
- Q-5 After closing the prompt with 「×」, does it come back on the next picker entry in the same session? R-052.
- Q-6 The language menu moving from the Preview to the confirm page is still to be confirmed. R-067.
- Q-7 Cinematic picker: when the last pick had several photos, is the Import prompt shown (the import must then be cut to 1)? R-084.
- Q-8 Back paths (Preview, picker, confirm 「‹」 and Android system Back) are drawn as buttons but no arrow says where they go; rows record the result.
- Q-9 Credit prices: only 「Generate | 60」 (Top 5 of My Year) and 「Generate | 40」 (Micro Cinema) are drawn. Per-template Creative prices and AI Transition prices are not stated.
- Q-10 Figma not compared with the PDF: frames newer than the export may be missing (PDF-only analysis; no Figma links supplied).
- Q-11 Picker: how a pick past max is refused, whether numbers renumber after an unpick, and how a failed check (size, NSFW, celebrity) is marked and worded are not drawn. R-045, R-047, R-048.
- Q-12 Generation failure (copy, refund, retry) and leaving during processing are not stated. The done notice is not in the spec either; rows follow domain K48 (R-104).
- Q-13 The Edit Room jump dialog copy and buttons are 「as I2V」 but not drawn. R-010, R-011.
- Q-14 Answered (user, 2026-11-03, REQ-003): the spec does not say where the credit button and History button lead; PHD domain knowledge K75 (Buy Credit) and K76 (My AI Artwork on the feature's tab) does. R-008, R-101.
- Q-15 The deeplink URLs (old Cinematic Reel Creator link, parameter names) must come from RD. R-013 – R-019.
- Q-16 Does the 「+」 tile on the confirm page stay when the count is at max? Not drawn. R-064.
- Q-17 Does the Import prompt's N count only photos still in the gallery? R-056.
- Q-18 The processing card in the mockup shows the template's art; PHD domain K48 (PHA262026-0375) says long-task processing tiles show the source photo's thumbnail. Which one is expected? R-078.
- Q-19 Template names, descriptions and photo tips come from the CMS: are they localised per app language, and do they refresh after a language switch (domain open question, PHA262026-0342 / -0243)? R-020, R-038.
- Q-20 Does 「Create More」 keep anything (template, photos, Text language), or open a clean room? Domain lists 「Create More keeps inputs」 as an open question (PHA262026-0390, -0413). R-082.
- Q-21 The board title says the spec follows the ledger 「spec-draft/reel-creator.decisions.md」, which was not supplied. Please send it (or access): decisions in it may settle Q-1 – Q-7 or add rules. (Found by the rdqe comparison, 2026-11-03, REQ-006.)
- Q-22 Is 「≤ 10 MB」 10,000,000 bytes or 10 MiB (10,485,760 bytes)? Rows avoid the gap between the two (TC-048, TC-126); a photo inside it is untested until PM answers. R-045.

## Added 2026-11-02 — coverage passes and standing inputs

### Job states
| Job | Start / loading | Success | Failure | Retry | Leave and return | Longest wait | Done notice |
|---|---|---|---|---|---|---|---|
| Photo check on pick (size, NSFW, celebrity) | n/a (spec silent: checked when picked) | TC-046 | TC-045, TC-047, TC-048, TC-049, TC-050 | n/a (spec silent) | n/a (spec silent) | n/a (spec silent) | n/a (no notice) |
| Creative generation | TC-085, TC-117 | TC-086, TC-087, TC-118 | n/a (spec silent, Q-12) | n/a (spec silent, Q-12) | TC-088, TC-116 | TC-085 (「… minutes remaining…」 shown) | TC-121 |
| Cinematic Styles generation | TC-096 | TC-090, TC-119, TC-122 | n/a (spec silent, Q-12) | n/a (spec silent, Q-12) | n/a (same Artwork card as TC-088) | n/a (spec silent) | n/a (spec silent, Q-12) |
| AI Transition generation | TC-101 | TC-101, TC-120 | n/a (spec silent, Q-12) | n/a (spec silent, Q-12) | n/a (same Artwork card as TC-088) | n/a (spec silent) | n/a (spec silent, Q-12) |

### Error classes
| Job | Error classes |
|---|---|
| All jobs | n/a (the spec names no error classes or failure copy) |

### Exit × stage
| Stage | ‹ / × / Got it | System Back |
|---|---|---|
| Room | TC-009 | TC-103 |
| Preview | TC-031, TC-020 | TC-104 |
| Photo tips sheet | TC-034, TC-036 | TC-105 |
| Picker | TC-052 | TC-106 |
| Picker with Import prompt | TC-056 | TC-107 |
| Confirm page | TC-071 | TC-108; Activity re-created: TC-116 |
| Text language list | n/a (closed by choosing, TC-078) | TC-109 |
| Edit Room jump dialog | TC-011 | TC-110 |
| My AI Artwork | TC-088 | TC-111 |

### System back
- Reel Creator room → leaves the room: TC-103
- Preview → room: TC-104
- Photo tips sheet → closes as 「Got it」: TC-105
- Picker → Preview: TC-106; with the Import prompt shown: TC-107
- Confirm page → picker: TC-108
- Text language list → closes, language unchanged: TC-109
- Edit Room jump dialog → as cancel: TC-110
- Paywall / More Credits Required / Credit Shop → n/a (existing pages outside this spec)
- My AI Artwork → recorded: TC-111

### Hidden clauses
| Requirement | Hidden clause | Observed through | Rows |
|---|---|---|---|
| R-010 | the Edit Room photo is saved automatically on the jump | Gallery photo count before and after the jump | TC-012 |
| R-109 | the saved photo carries the Edit Room edit | the photo saved to the Gallery, compared with the original | TC-012 |
| R-102 | the credit use is recorded with its feature name and amount | Buy Credit › Detail after each Generate | TC-118, TC-119, TC-120 |
| R-103 | a burst of taps is charged once | credit balance and the number of new Artwork cards | TC-117 |
| R-105 | the %d / {n} placeholders are filled in every language | the numbers on the tray, prompt and toast in zh-Hant and ja | TC-123 |
| R-012 | the room opens without the photo | picker of each feature shows 0 picked | TC-013 |
| R-056 | photos no longer in the gallery are not imported | imported count after deleting 2 photos from the Gallery | TC-059 |
| R-065 | AI Transition output order = page order | order of the photos in the finished video | TC-101 |
| R-066 | every input photo is used in a Creative reel | each input photo seen in the finished reel | TC-087 |
| R-069 | below min nothing is generated or charged | credit balance and My AI Artwork after tapping the disabled Generate | TC-067 |
| R-071 | Generate charges the credits on the button | credit balance before and after | TC-074, TC-096, TC-101 |
| R-075 | the chosen language code is passed to the engine | language of the text in the finished reel | TC-081, TC-082, TC-083 |

### Variants
| Requirement | Variant | Rows |
|---|---|---|
| R-074 | English (device language, default) | TC-075, TC-083 |
| R-074 | 繁體中文 | TC-076, TC-082 |
| R-074 | 日本語 | TC-078, TC-081 |
| R-074 | rest of the list (scrolled) | TC-077 |
| R-075 | English | TC-083 |
| R-075 | 繁體中文 | TC-082 |
| R-075 | 日本語 | TC-081 |
| R-070 | free user (paywall) | TC-072 |
| R-070 | subscribed user (More Credits Required) | TC-073 |
| R-084 | Creative (60 credits, Text language) | TC-063, TC-074 |
| R-084 | Cinematic Styles (40 credits, 1 photo) | TC-094, TC-096 |
| R-084 | AI Transition (fixed 4 / 6, no Text language) | TC-100, TC-101 |
| R-021 | 4 photos | TC-098, TC-099 |
| R-021 | 6 photos | TC-102 |
| R-102 | Creative | TC-118 |
| R-102 | Cinematic Styles | TC-119 |
| R-102 | AI Transition | TC-120 |
| R-105 | 繁體中文 | TC-123 |
| R-105 | 日本語 | TC-123 |
| R-023 | Creative | TC-086 |
| R-023 | Cinematic Styles | TC-127 |
| R-023 | AI Transition | TC-101 |
| R-016 | CineStory GUID | TC-017 |
| R-017 | Creative GUID | TC-015 |
| R-017 | AI Transition GUID | TC-016 |

### Annotation trace (manual, PDF-only)
No `boards/` OCR on this Windows machine, so `annotations.ts` cannot run; every bullet of the PDF note boxes was traced by hand:
- room (board title): 「spec 依帳本 spec-draft/reel-creator.decisions.md」 → Q-21 (linked file not supplied; added 2026-11-03, REQ-006).
- room: 房間改名 → R-001 – R-005; 不分 tab / 三個 feature 混排 → R-006, R-007; 待決 section 排序 → Q-1; 從 Edit Room 進入 → R-010 – R-012; CMS fields → R-020; min / max → R-021, R-022; 輸出 9:16 → R-023; 待決 feature_id → Q-2, R-024; Cinematic Styles 沿用 CineStory CMS type → Q-1 (label: CMS setup); 時程 → R-025.
- deeplink: R-013 – R-019, Q-15.
- preview: R-026 – R-034; red lines 上下刷範圍 → R-028, 文字疊在 demo 上 → R-032, 手指動畫 → R-033.
- tips: R-036 – R-039.
- picker: R-041 – R-046; memory R-051 – R-058; 待確認 → Q-3, Q-4, Q-5.
- confirm: R-060 – R-071; 待確認 語言選單 → Q-6.
- text-language: R-073 – R-077.
- artwork: R-078 – R-082 (RD 注意 tab rename → R-080).
- cinematic: R-084 – R-086; 待確認 Import → Q-7.

### Controls (PDF-read) → rows
Room: ‹ TC-009 · credit button TC-008 · History button TC-112 · template card TC-023 · section row swipe TC-007. Preview: ‹ TC-031 · View photo tips TC-033 · mute TC-025 · Use Template TC-037 · swipe TC-026. Tips: Got it TC-034. Picker: ‹ TC-052 · Recents ▾ TC-051 · photo cell TC-038 / TC-043 · Next TC-053 · tray thumbnails TC-041 · Import TC-055 · prompt × TC-056. Confirm: ‹ TC-071 · photo × TC-065 · long-press drag TC-064 · + tile TC-068 · Text language ▾ TC-075 · language item TC-078 · Generate TC-074 / TC-067. Cinematic confirm: photo tap TC-095. Artwork: tabs TC-089 · card TC-086 · Create More TC-091. No inputs with a keyboard.

### Request ledger coverage
| Ledger entry | Requirements |
|---|---|
| REQ-001 | R-001 – R-101 (this table) |
| REQ-003 | R-008, R-101 |
| REQ-004 | R-102 – R-113 |
| REQ-006 | R-023, R-045 (Q-21, Q-22) |
