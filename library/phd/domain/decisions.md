# PHD decisions and things not to assert

Part of the PHD domain knowledge (`README.md`). PM decisions, Won't Fix / NAB outcomes and version-bound values. Use
them in the value check and in verdicts: a row must not expect the **original** ticket expectation where a later
decision replaced it, and a run must not file what was already decided. A current spec that states otherwise wins.

## Product decisions (original expectation replaced)

| ID | Decision | Do not assert | Source |
| --- | --- | --- | --- |
| K13 | AI Group Shot supports people **or pets**; face detection was skipped on purpose. | A blocking dialog for a photo with no person (original ticket; Propose Won't Fix). | PHA262026-0368 |
| K34 | Character Motion Swap: while content or selection is not ready, the button shows just 「Generate」. | 「--」 or a fixed price while the video length is unknown. | PHA262029-0001 |
| K35 | AI Group Shot Artwork › 「Create a Video」 looks like Generate and shows the credits; PM skipped the extra confirmation dialog. | "No confirmation dialog" as a defect when the cost is shown. | PHA262026-0369 |
| K37 | AI Enhance Try First result cannot be applied — Won't Fix (review 2026-09-16). | That every trial preview can be saved, or other features' free-generation semantics for it. | PHA262026-0386 |
| K43 | Leaving AI Agent keeps the normal exit; a hint bubble on the History button (new icon) guides users back. | A warning dialog on leaving. | PHA262026-0320 |
| K44 | Premium chat is a higher quota, not unlimited. | A fixed quota number (e.g. 30). | PHA262026-0351 |
| K67 | Arabic: per-string decisions. Translated after PM asked: Blur, Conceal, Presets, Launcher shortcuts, Edit Room feature names. Kept untranslated: Camera ON/OFF, HD / Ultra HD, some Premium / AI Denoise / AI Deblur / ISO labels. | "All proper nouns stay English", or an early "keep English" comment that a later decision reversed. | PHA262026-0200 … -0229 (see `source/source-index.md`) |
| K71 | Interstitial localisation is phased: Phase 1 main languages, others English for now (Postpone). | Missing MEX / THA / ARA / VIT translation as a defect while Phase 1 holds; nor "never translated". | PHA262026-0279 |
| K59 | Collage search tags were switched to English after a Stage data move broke Arabic / Vietnamese search (to protect iOS GM). Transitional. | "Local-language search is not supported." | PHA262026-0266 |

## Accepted limits and quality risks (not rules, not permanent bugs)

| ID | Record | How to use it | Source |
| --- | --- | --- | --- |
| K19 | AI Enhance adding people, AI Headshot cropping the head or keeping the source background, AI Face Swap lower resolution: open quality issues. AI Replace mask residue ≈ 3 % at the time, Postponed. | Quality observations; file only with evidence on the tested build. A feature's name promises no quality level. | PHA262026-0293, -0406, -0405, -0350, -0264 |
| K61 | AI Enhance ≈ 48 s average: treated as a limit; the fix improved the waiting cursor (iOS mentions ≈ 1 min). | Judge the waiting UI (wait threshold rule), not a promised duration. | PHA262026-0294 |
| K38 | Daily Bonus: Stage allows up to 3 products per member per day (NAB). UUID used 3 times a day can still log in (NAB). | Not "one product per account"; no firm limit from these tickets. | PHA262026-0403, -0402 |
| K52 | Group Shot result BGM differing from preview: handled by CMS `audio_setting_toServer=none`; vendor mode under review. | Not "every template must keep the preview BGM". | PHA262026-0380, -0381 |
| K54 | TikTok share leading to a store item unavailable in the region is still Assigned; Discover author links now open the Instagram profile from CMS `social_media_link`. | Region and install state change share targets; no "shown in every country" default. | PHA262026-0437, -0248 |

## Version-bound values (check the current setting)

| ID | Value at the time | Note | Source |
| --- | --- | --- | --- |
| K09 | AI Replace prompt limit 500 characters (20.13; was wrongly 101) | Rechecked 2026-05-15 | PHA262026-0198 |
| K09 | AI Creative Studio prompt limit 5000 characters (20.13) | UI relaxed while XML still capped 600; set in code | PHA262026-0257 |
| K09 | Image to Video, Pixverse V6: `promptCharLimit` 2000 (characters, despite "words" in the title) | 2186 exceeded 2000 | PHA262026-0396 |
| K32 | AI Try-On custom prompt 3 credits (20.13), not 6 | Price depends on the real mode (prompt vs reference image) | PHA262026-0271 |
| K33 | AI Video Try-On / Character Motion Swap: displayed length uses `ceil()` to whole seconds to match billing | Not "always round down"; check Trim time, UI and price at the boundary | PHA262029-0005 |
| K17 | Image to Video removed Duo; templates from Discover default to Single | A historic mode change, not "single image only" forever | PHA262026-0284 |
| K23 | Large-photo path for long edge > 1600 px (with a full-resolution stack) | The ticket's repro condition, not a general resolution cap | PHA262026-0457 |
| K21 | Undo granularity (20.17): tab switch and Reset make records; button actions do, except Perspective selection-only changes; Crop / Perspective sliders on finger-up with a changed value | Compare new interactions with the newest spec | PHA262026-0427 |
| K60 | Stage timings: AI Expand 1 min 48 s on Stage vs ≈ 17 s on Production; RTDN account hold 「76320 days」 = 53 × 1440 Stage time scale | Observations, not an SLA or a real hold length | PHA262026-0419, -0314 |
