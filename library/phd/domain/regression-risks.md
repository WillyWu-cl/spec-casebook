# PHD regression risks

Part of the PHD domain knowledge (`README.md`). What past root causes say about **what to vary** when a feature's
rows are written: entries, first use, lifecycle, image sizes, locales, devices. Use it in the coverage passes of
every `phd/*` draft: where the feature has the same input, entry or shared component, add the variation as a row
(Expected Result from the current spec or `confirmed-rules.md`, Notes naming the K entry). These are test-design
suggestions, not results of a new run.

## Regression matrix

| Dimension | Combinations | Guards against |
| --- | --- | --- |
| Entry | Home, banner, AI Photos / AI Videos, Edit Room, Discover, Artwork, notification deep link | Wrong style or source image, intro, broken back stack |
| First use and re-entry | Cold start, first tutorial, skipped tutorial, back, Create More | Replayed init, lost selection, stale temp resources |
| AI input | Preset, prompt, reference image, person, pet, faceless clothing | Wrong validation, mode / GUID mix-up, wrong price, prompt not used |
| Lifecycle | Generate in foreground, background while thinking, background while generating, return after the job, Activity re-creation | Lost result, duplicate replies, empty model list |
| Geometry and output | Large photo, very wide photo, Crop / Rotate / Perspective then Adjustment / Save | Mask ratio, full-res stack, preview ≠ output |
| Operations | X, V, system Back, Undo, Redo, Reset, rapid taps | Commit vs cancel, double charge |
| Entitlement | Free, trial unused / used, Premium (Android VIP), Credit Auto Pass, two subscriptions | CTA state, detail names, entitlement refresh, notifications |
| Works | Recent, feature tab, Photo / Video filter, empty list, processing, pack, single and multi-select download | Filter state, missing works, tap delay, lost events |
| Platform and locale | Android 15 / 16, Fold7 unfolded, iOS, LTR / RTL, long strings, light / dark | IME, back, RTL direction, size, contrast |
| Service data | Stage / Production, built-in offline, CMS update, language switch, warm cache | Capacity, stale content, fallback, index mismatch |

## Entries and cross-feature state

- **K01 Every entry is its own path.** The same feature opens from Launcher banner, AI Photos, AI Videos, Edit Room,
  Discover, Artwork, a notification deep link or a result page, each bringing photo, style, category, tutorial state
  and back path. AI Replace was fine from AI Photos but lost its top toolbar via Edit Room → Artwork → Edit Room.
  PHA262026-0283, -0278, -0233.
- **K03 Photo identity drives picker re-selection.** Edit Room source images with an invalid id (0 / -1) did not show
  as selected in the Photo Picker (AI Agent, Group Shot). Image shown but not ticked → check id mapping.
  PHA262026-0357, -0367.
- **K05 Init order changes with tutorials and cold start.** Try-On with 「Don't show again」 put a pet style in the
  wrong tab; Creative Studio cold-started from a deep link crashed touching the list before data loaded. Cover first
  tutorial, skipped tutorial, cold start and data already loaded. PHA262026-0281, -0358.
- **K06 Refactors move navigation.** AI Replace became its own Activity; an old notification path through Edit Room
  showed black. Re-walk notification and deep-link paths after a feature moves. PHA262026-0278.
- **K07 Selection state leaks across features.** After AI Replace uploaded a reference, Text Bubble / Text / Sticker
  added it as Add Photo. "After using another feature" is its own precondition. PHA262026-0262.

## AI inputs

- **K10 Inspirations obey the model too.** Official inspirations were too long or hit content checks (fixed in CMS);
  a prompt truncated by an old model made the app think the user edited it (「Use Another Inspiration」).
  PHA262026-0396 … -0398.
- **K15 Sub-types keep their own selection.** AI Hairstyle My Style shared one GUID across Photos / Prompts (Generate
  disabled after switching); ViewPager preloading the male tab overwrote My Style's empty selection (Generate wrongly
  enabled). PHA262026-0331, -0395.
- **K16 Video features take different media.** Character Motion Swap and AI Video Try-On take a photo and a video;
  guides must name the right one. AI Anime Video, AI Video Try-On, Character Motion Swap and Cinematic Reel Creator
  share Trim / Continue, so a missing module breaks all four. PHA262029-0003, PHA262026-0318, -0414.
- **K18 Image and mask must align.** AI Removal failed on 2560×909 because the scaled mask (1024×364) rounded to a
  different ratio. Test very wide images, non-integer scales, edge masks and the output. PHA262026-0296.
- **K32 Price follows the real mode.** Prompt vs reference image must be told apart before picking action and style
  ids. PHA262026-0271.

## Edit state

- **K23 Large photos have two stacks.** Crop / Perspective committed only the thumbnail stack, so Adjustment or Save
  used the uncropped original. Chain geometry → Adjustment → Save and check the file. PHA262026-0457.
- **K28 Back must check real resources.** Create More from Artwork deleted the original Activity's video; Back found a
  non-null ViewModel with a dead file. Try-On deleted the reference after generating, then showed Network error on
  redo. PHA262026-0309, -0295.
- **K29 Temporary mask ≠ output.** A visible mask while editing is required; mask residue in the result is a quality
  issue. Judge them separately. PHA262026-0263, -0264.

## Credits and IAP

- **K39 IAP visibility needs the whole entitlement.** Launcher's shop entry and new-user offer bubble used different
  subscription / perpetual checks (bubble without its anchor, regressed later). AI Expand → Credits → Subscribe
  crashed in the shared subscribe dialog, which also serves Image to Video and Hair Volume. PHA262026-0312, -0196.

## AI Agent

- **K40 Session vs turn.** A session holds history and running jobs; a turn is one send and its replies. A
  `turn_complete` is not success: `final_state=block`, error code 0 and no outputs showed only a generic error (fixed
  in Iris v2.3.0). PHA262026-0319.
- **K41 Native agent initialises once.** IO and Main threads both initialised it, writing one `turn_complete` twice
  (duplicate Suggest replies). PHA262026-0353.
- **K42 Foreground resume.** History load waited on a destroyed native agent and blocked event collection.
  PHA262026-0321; the "thinking" timing (-0422) is still open.

## Works and output

- **K45 Work type ≠ job type.** Long-task images filtered as error packs hid Headshot images; Headshot V3 had to be a
  short task to reach Recent. Versions can change the job class. PHA262026-0194, -0436.
- **K49 Tap guard on packs.** Taps within 800 ms of opening a pack were swallowed (felt like a double tap); fixed with
  a wait indicator. PHA262026-0195.
- **K51 Display size vs resolution.** 512×512 Image to Video works looked tiny (centerInside → fitCenter); Face Swap
  output resolution is a separate open issue. Check the file's pixels, not the UI size. PHA262026-0280, -0350.
- **K52 Mute state survives template switches** and MediaPlayer re-creation (Group Shot). PHA262026-0364.
- **K53 Generated ≠ saved.** Group Shot "returning to Recent" after Save was a native audio crash. Check the file
  exists and opens before judging the prompt. PHA262026-0401, -0387.

## Content service

- **K55 Built-in and CMS both supply content.** AI Agent icons needed both updated; test light / dark and a first
  launch offline. PHA262026-0333, -0340.
- **K56 CMS is more than image URLs:** banners, names, translations, templates, categories, style GUIDs,
  inspirations, samples, audio settings, new tags, navigation. PHA262026-0415, -0315, -0248, -0266.
- **K57 Language and content version.** APIs carry product, platform, lang, contentVer / metaDataVer; a new-tag fix
  needed a new tag GUID and a CMS eTag reset; banners / Image to Video samples not updating after a language switch
  are still open. PHA262026-0315, -0342, -0243.
- **K58 iOS animated-thumbnail cache** keyed by feature GUID missed updates; now keyed by URL hash. iOS only; do not
  assume Android. PHI262607-0001, -0002.
- **K59 Collage search** uses metadatas (tags), contents and indexdocs; they must agree per language. PHA262026-0266.

## Platform and locale

- **K62 Background vs Activity re-creation** are separate tests: Character Motion Swap lost its model list after
  re-creation (reproduce with Don't keep activities); changing app language destroys the Activity (IAP on a detached
  fragment crashed). PHA262026-0310, -0321, -0303.
- **K63 Android SDK 36 Predictive Back** broke onBackPressed paths (Blur Tool black, Edit Room exiting to Launcher);
  that build disabled `enableOnBackInvokedCallback`. Test system Back on every screen. PHA262026-0370, -0371.
- **K64 Edge-to-edge and keyboard.** Android 15 made adjustResize insufficient (AI Agent prompt under the keyboard);
  a keyboard listener overwrote padding (Image to Video model list would not scroll). PHA262026-0349, -0423.
- **K65 Foldables (Fold7 unfolded):** Creative Studio prompt, AI Art / Try-On / Hairstyle bottom sheets, Task Center,
  Credits pack, Mosaic preview had height or reach problems; Open Intro crop and some Credits tickets were still open.
  PHA262026-0322 … -0327.
- **K66 RTL components:**

  | Component | Must hold in RTL | Past issue |
  | --- | --- | --- |
  | Bubbles and arrows | Point at the real button, start / end correct | Screen x mixed with marginStart (AI Agent); trial arrow needs auto-mirror. PHA262026-0348, -0214 |
  | Prompt box | Text leaves room for its buttons | left / right padding → relative. PHA262026-0352 |
  | Sliders and gradients | Drag direction matches the effect | Skin Tone, AI Relight reversed. PHA262026-0215, -0224 |
  | Lists and toolbars | Items in bounds, scrollable | Blender, Light Leak, Mirror, Mosaic overflowed. PHA262026-0225 … -0227, -0211 |
  | Auto size and alignment | Measured views keep a size | ID Photo zero width. PHA262026-0274 |
  | Text and icons | Vertically centred, room kept | Headshot credit icon, Motion Swap 「i」. PHA262026-0238, -0230 |

- **K69 Long strings** (NLD, IND, PLK, ESP, PTB, RUS): fixed by shorter copy, padding, centring on available width,
  scrolling, one text measure across toolbar tabs. Check readability and reach, not just that a translation exists.
  PHA262026-0304, -0305, -0307, -0335, -0384, -0267, -0269.

## Modules and events

- **K73 View reuse and async loads.** A reused RecyclerView cell showed the wrong AI Agent icon (old Glide request
  not cancelled); a Camera filter crashed on a null template name. Wrong visuals are not always wrong CMS data.
  PHA262026-0365, -0253.
- **K74 Mixpanel by feature and entry.** `Monetize_Subscription_Appear` carries `feature=ai_video_try_on` /
  `ai_enhance_advanced` (Generate and CTA entries); Artwork single Save must send the real item (selection list was
  empty; 18 fragments fixed). Single and multi-select download are both paths. PHA262026-0318, -0317, -0383.
