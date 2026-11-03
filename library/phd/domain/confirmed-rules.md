# PHD confirmed rules

Part of the PHD domain knowledge (`README.md`). Behaviour that applies across PHD features and has been confirmed.
Read on every `phd/*` draft (standing input 6, `analysis.md`): where a feature's spec does not contradict a rule
and the feature has the behaviour, it becomes a requirement citing `[Domain: K<nn>]`. The spec wins where it
states otherwise; say so in the row's Notes.

**Kinds.** *User* = the user confirmed it (dated; applies to every PHD feature in scope). *Fix* = a discussion, an
RD fix and a QA recheck agree (a strong default for the same behaviour). Version-bound numbers are not here; they
are in `decisions.md`.

## Credits, entitlement and Artwork (user rules)

| ID | Rule | Scope and limits | Kind |
| --- | --- | --- | --- |
| K36a | After the Generate flow of **any AI feature that uses credits** ends, Buy Credit page › **Detail** (top right) lists the use with the right **feature name** and the credits actually **deducted** and any **refunded**, with correct amounts. | Every credit feature, not only one; check the Detail entry, not only the balance. A refund is not required on every generation, only correct when it happens. | User, 2026-10-15 |
| K36b | **Android has one VIP mode**: VIP, Pro and paid user are synonyms. iOS Pro and Pro+ are distinct; never apply them to Android. | Prices and out-of-credit paths still come from each feature's spec. | User, 2026-10-16 |
| K36c | **AI Exposure is paid-only.** Free user tapping the entry → 「Upgrade to VIP」 dialog → Upgrade opens IAP (no Try Before Buy path). Paid user tapping the entry → 「Try it」 dialog → Try it opens the feature screen (this is not Generate). | Does not change the generation price or the out-of-credit flow; no purchase needs to be completed. | User, 2026-10-16 |
| K47a | Every **credit-deducting AI feature** that finishes an **image** Generate saves the result to **My AI Artwork** automatically, under that feature's own **feature tab**. | Images only: not video, failed or unfinished jobs. Tab name, order and other entries are not defined by this rule. | User, 2026-10-16 |
| K47b | **AI Exposure**: a finished Generate is saved to My AI Artwork › **Recent** and › **AI Exposure**, whether or not [V] brings it back to Adjustment. My AI Artwork entry: Launcher › AI Photos › **My Artwork** (top right). | [V] is not needed to save; no jump to Artwork is required. Recent / [V] behaviour is not extended to other features. | User, 2026-10-16 |
| K36d | Credit Auto Pass shows its own name in the credit detail, never 「Yearly Credit Bonus」. | Fixed server-side copy. PHA262026-0199 | Fix |
| K36e | After buying Premium, Mine's entitlement styling updates when the user returns to it. | PHA262026-0217 | Fix |
| K30 | Once the first Generate is accepted, further taps are blocked until the job takes over: a burst of taps charges once and makes one result. | Includes the gap before the loading indicator appears. PHA262026-0418 (AI Expand) | Fix |
| K31 | A one-time free trial is consumed and the CTA refreshes at once: after the free use, returning shows the paid Generate, never 「1 Free Trial」 again; on entry the CTA never flashes the paid price before showing Free Trial. | PHA262026-0252 (AI Hairstyle), -0429 (AI Expand), PHI262606-0078 (iOS Creative Studio) | Fix |
| K44 | Premium chat copy promises a higher chat quota under normal server conditions, never "unlimited". | No fixed number (30 appeared once but is not the rule). PHA262026-0351 | Fix |

## Entries and data passed between features

| ID | Rule | Source | Kind |
| --- | --- | --- | --- |
| K02 | Opening a feature from Edit Room carries the **current edited image**, not the original file (Cinematic Reel Creator, AI Headshot). | PHA262026-0382, -0400 | Fix |
| K04 | A banner / deep link opens the feature with the linked **style, type and category selected**, and the selected style scrolled into view. | PHA262026-0306, -0344, -0308 | Fix |
| K05 | Discover tip bubble: disappears for this session once Discover is opened; shows again on later launches until the user taps **Use this template** once; then never again. Seen-tutorial, entered-feature and completed-key-action are three different onboarding states. | PHA262026-0255 | Fix |

## AI inputs

| ID | Rule | Source | Kind |
| --- | --- | --- | --- |
| K08 | AI Replace (source and mask done): a reference image **or** a prompt enables the next step; with a reference image the prompt is optional. | PHA262026-0260 | Fix |
| K12 | AI Try-On: a clothing reference without a face is accepted (no face check on it). Pet types never run the person check (a dog photo must not report 「No face」). | PHA262026-0392, -0232 | Fix |
| K14 | AI Group Shot: the first pick is multi-select (Creative Studio style) and Next enables once the template's photo count is picked; changing photos later from the Photo Picker replaces **one at a time**. Check slot order and removal. | PHA262026-0377 … -0379, -0367 (2026-08-24 update replaces "always re-pick two") | Fix |
| K11 | A custom prompt reaches the generator (field `user_prompt` in AI Hairstyle): input, request and result agree, not just that the box takes text. | PHA262026-0270 | Fix |

## Edit state and operations

| ID | Rule | Source | Kind |
| --- | --- | --- | --- |
| K20 | Crop (Crop & Rotate, Perspective, AI Expand tabs): rotation, preview, crop frame, ratio selection and tool state stay consistent across tab switches; re-entering a tab shows the current image. A ratio stays selected only while the frame keeps it (Rotate / Flip that resets the frame clears it). | PHA262026-0416, -0438, -0458 | Fix |
| K21 | **Undo** steps back one record; **Redo** enables only when a redo record exists. **Reset** uses the image first shown on entering the transform screen as its base: enabled only when the preview differs, stays on the current tab, restores image and options to defaults, and is itself an undo record. | PHA262026-0426, -0427 | Fix |
| K22 | Restoring a state restores the button highlight **and** the real transform together (AI Expand ratio pill and its preview; initial Custom mode drives Reset enablement). | PHA262026-0425, -0428 | Fix |
| K24 | Video Editing text: a template title keeps its template look; Cancel, Undo or opacity changes never wash it to white / no preset. | PHA262026-0439 … -0441 | Fix |
| K25 | Video Editing panels: **X** discards everything changed in the panel; **V** commits. X and V must differ. | PHA262026-0442 (RDResolved when read; not every video panel rechecked) | Fix |
| K26 | Video Editing › Audio Range Select: closing returns to the audio panel when a track exists, else to the picker; X and system Back behave the same. | PHA262026-0444 | Fix |
| K27 | AI Try-On / AI Hairstyle: Back after generating keeps the previous style and any reusable reference image; importing a photo does not reset the category to All. | PHA262026-0241, -0285, -0328 (Create More keeping the whole session is an open question) | Fix |
| K29 | AI Replace returning from Artwork to edit the mask shows the red mask; VHS / Glitch returning from Store keep a working mask. | PHA262026-0263, -0244, -0245 | Fix |

## Works, output and notifications

| ID | Rule | Source | Kind |
| --- | --- | --- | --- |
| K46 | An Artwork filter with no matching item shows **Nothing yet** (e.g. Group Shot with videos only, Photo filter). | PHA262026-0363 | Fix |
| K47c | A new feature's works appear in Recent when the feature is meant to (Headshot V3 fix). | PHA262026-0436 | Fix |
| K48 | Long-task processing tiles show the source thumbnail; long video jobs (Cinematic Reel Creator, Group Shot video) send a completion notification whose title, message and deep link open the right page. | PHA262026-0375, -0373 | Fix |
| K50 | Saved output matches the preview the user last saw (e.g. Collage pinch-zoom). | PHA262026-0404 | Fix |
| K42 | An Agent job running when the app goes to background shows its result after returning to foreground. | PHA262026-0321 (the "thinking" timing is still open: -0422) | Fix |

## Platform and locale

| ID | Rule | Source | Kind |
| --- | --- | --- | --- |
| K68 | Arabic UI may keep Western digits 0–9 (Quick Actions sliders align with iOS, `Locale.US`, decided 2026-05). Do not fail Arabic for Western digits. | PHA262026-0201, -0203, -0205, -0206, -0239 | Fix |
| K70 | Localised strings keep the platform's placeholders, types and argument count (`%1$s` on Android); a wrong placeholder crashes the screen. | PHA262026-0298 | Fix |
| K66 | RTL mirrors layout, not only text: bubbles point at the real button, prompt text keeps room for its buttons, slider direction matches the effect, lists and toolbars stay in bounds and scroll, auto-sized views keep a size, text and icons stay centred. | See `regression-risks.md` › Platform and locale | Fix |
