# DRA262610P0420 recheck — 2026-11-05 (RD BEN_WANG: needs the full blueprint and character images)

Question: does a Mine character of about 55 turn about 25 years younger in the full episode's clips (found on 16.8.0.2610212, A7-g2)?

- Phone: Sony Xperia 10 III (XQ-BT52, adb HQ61563393), Android 12, USB.
- Build: PowerDirector 16.8.0 **2611041** (TR261104-0065), installed with `adb install -r` over 2610212. Stage server (Launcher top bar yellow, `screenshots/16.8.0.2611041_DRA262610P0420_launcher.png`).
- Account: ethan.hsu.cl (signed in, kept from 2610212), Free tier. Credits **5821 → 5596** (◆225 = 2 × Create my character ◆4 + storyboard ◆37 + 30-sec preview ◆60 + rest of episode ◆120). The failed first preview try charged nothing.
- Drama 「Hidden identity」 (template 「The New Guy's Secret」 › Make my version), English, No captions, Fast = Seedance 2.0 Mini (`dreamina-seedance-2-0-mini-260615`). Session **261105_115015_e7b457a0**.

## The Mine look used
The A7 look (East Asian-looking grey bob in a white chef coat) is **no longer in Mine** on this phone (Mine holds other looks now), so it was recreated with the A7 inputs (A7-c1 TC-049/TC-469: reference photo of a young woman in a white dress with yellow flowers, default crop, Female / White / Age 75):
1. Jenna's Replace › Choose Character › Create my character: that photo, no description, Female / White / 75 › Generate ◆4 (12:00): a woman of about 55–60 with grey hair in a **ponytail** and a work vest (this build follows the entered age now; on 2610212 the same inputs gave a woman of about 25 with a dyed-grey bob, DRA262610P0210). Saved to Mine (`…_mine_result.png`).
2. To match the A7 look: Create my character again, same photo, description 「Short grey bob haircut, wearing a white chef coat.」, Female / White / 75 › Generate ◆4 (12:02): grey bob, white double-breasted chef coat, about 55–60, Asian-looking features (`…_mine_form2.png`, `…_mine_result2.png`). Save to library applied it to Jenna; OK (12:03).

The character sheet the video used (`media/out_…_t3_…_s_img_1.png` in the export, `…_jenna_sheet.png`) is this second look; it already looks about 55–60, not younger than the Mine portrait (it is the Mine portrait). Blueprint `char_jenna_morales`: **age "75"**, gender female, ethnicity white, look 「…Short grey bob」, default_wardrobe 「white double-breasted chef jacket, dark grey cargo pants, and black boots」.

## Timeline
| Time | Event |
| --- | --- |
| 11:49 | restart, build 2611041 checked, yellow bar, logcat started |
| 11:51 | AI Drama Assistant page, debug info ON, credits 5821 |
| 11:53:27 | The New Guy's Secret › Make my version › English / No captions › Generate; outline + cast at ~11:55 |
| 12:00–12:03 | Two Mine looks made (above); Jenna = the chef look; OK |
| 12:05:23 → 12:08:28 | Create storyboard ◆37 › Storyboard Result (6 scenes) |
| 12:08:53 | Fast · Preview - 30 sec ◆60 › Generate video. 12:09:00 `prompt_1` error 「HTTP POST Add Media failed: Could not establish connection」, turn ended (final_state=complete), no charge; the chat stayed on 「I'll create a video — give me a moment...」 for 25 min with no error or retry card (also after reopening from History). Wi-Fi was connected, ping OK. |
| 12:35:15 | Sent 「Create the video」 in chat → Video length card › Preview - 30 sec ◆60 › Generate (12:35:39) |
| 12:43:28 | 「Here's your drama.」 (clips 1–2) |
| 12:43:52 | 「Create the rest of the video (60 sec)」 ◆120 › Generate (the offer text is now 「rest of the video」, not 「full episode」) |
| 12:51:22 | Turn complete, 4 more clips (3–6), all `done`, no tool_error |
| 12:52:24 | Session exported with media |
| ~12:58 | Debug info OFF, phone on the Launcher, credits 5596 |

## Result per clip (frames from the exported MP4s, `16.8.0.2611041_DRA262610P0420_jenna_clips.jpg`)
| Clip | Part | Jenna | Apparent age |
| --- | --- | --- | --- |
| 1 | preview | yes | about 55–60, matches the portrait |
| 2 | preview | yes | about 55–60 |
| 3 | full | yes (office desk) | about 55–60 |
| 4 | full | yes (rain awning) | about 55–60 |
| 5 | full | no (Caleb and Noah, locker room) | — |
| 6 | full | yes (warehouse aisle, with Richard) | about 55–60 |

**Reproduced: no (0/1).** Jenna keeps her portrait's age (grey bob, same face) in all five clips she is in, including clip 6, whose prompt is the only one without her age. Noah, Caleb and Richard keep their looks; nobody takes another's look.

Prompts (`16.8.0.2611041_DRA262610P0420_log.txt`): every Jenna reference image is her chef sheet `out_…_t3_…_s_img_1.png`; ACTIVE REFERENCES says 「JENNA, 75-year-old female…」 in clips 1, 2, 3, 4 and **omits her age in clip 6** (「JENNA, capable adult warehouse manager…」), as RD noted for A7. So a 75 in the blueprint against a ~55–60 portrait, and one prompt without the age, did not make her younger this time.

Side observation (not this ticket): in every clip Jenna wears 「a durable dark canvas utility vest over a grey long-sleeve shirt, fitted jeans, and steel-toed boots」, the outfit of the **first** Mine look (step 1), not her chef coat. The storyboard beats' `wardrobe` in the blueprint still carry that outfit (from blueprint_V5, before the look was replaced), while the asset's `default_wardrobe` is the chef jacket. The positive locks hold 「JENNA's canvas vest」.

## Evidence
- `exports/261105_115015_e7b457a0_20261105_125224.zip` (88,057,605 bytes, with media; app's own export): `blueprint.json` (valid, complete JSON, 36 KB: session_id, outline, assets, storyboard 6 beats, failures), `blueprint_versions/blueprint_V1–V17.json`, `host_inputs/blueprint.json`, `library_portrait_baseline.json`, `chat_history.json`, `engine_events/`, `perf/`, `video_stage.json`, and `media/`: the character images (Jenna's chef sheet `out_…_t3_…_s_img_1.png`, the first Mine look `out_…_t2_…_s_img_1.png`, the template's original Jenna `character_char_jenna_morales_custom_…_image.png` and `…_female_arab_24_Maya-Mansour_…jpg`, Noah, Caleb, Richard), the six clips `reftovideo_…_t8_…_vid_1/2_15s.mp4` (preview) and `reftovideo_…_t9_…_vid_1–4_15s.mp4` (full), environment images, TTS. Note: `media/r2v/*.json` hold a `unique_key` credit token written by the app; the zip is not git-ignored, so keep it out of commits or check before sharing.
- `16.8.0.2611041_DRA262610P0420_blueprint.json` (copy of the zip's `blueprint.json`)
- `16.8.0.2611041_DRA262610P0420_jenna_clips.jpg` (portrait + clips 1, 2, 3, 4, 6)
- `16.8.0.2611041_DRA262610P0420_log.txt` (RefToVideo excerpt, keys removed)
- `screenshots/16.8.0.2611041_DRA262610P0420_characters_result.png`, `…_jenna_sheet.png`, `…_mine_form.png`, `…_mine_result.png`, `…_mine_form2.png`, `…_mine_result2.png`, `…_player.png`, `…_launcher.png`
- Raw logs (git-ignored): `logs/recheck-20261105-125352/`

## Try 2 (13:43–14:25)

Same phone, build 2611041, account and run dir; files under `try2/`. Stage: `testserver.config` present and `[AID]Stage_Server` on the launcher; the drama page's top bar was yellow with debug info on (`try2/screenshots/…_try2_cast.png`). Credits **5596 → 5376** (◆220 = storyboard ◆40 + 30-sec preview ◆60 + rest of the video ◆120; no Mine look made). Session **261105_134441_e3669d07**, drama 「The New Guy's Secret」 (English, No captions, Fast = Seedance 2.0 Mini `dreamina-seedance-2-0-mini-260615`).

Mine look: the try-1 chef look (grey bob, white chef coat, `…_mine_result2.png`) was still first in Choose Character › Mine. At the cast step Jenna's Choose Character slot **already showed that look, checked** (`try2/screenshots/…_try2_mine_library.png`); confirmed with OK, which ran a cast-confirm turn (blueprint V8 → V9: age 24 → 75, image `character_char_jenna_morales_custom_18825a6c…`).

| Time | Event |
| --- | --- |
| 13:43 | restart, build 2611041, logcat started |
| 13:44 | AI Drama Assistant, debug info ON, credits 5596 |
| 13:45:10 | The New Guy's Secret › Make my version › English / No captions › Generate; outline + cast by 13:47 |
| 13:48 | Jenna's Replace › Mine chef look already selected › OK; cast-confirm turn, Create storyboard card (◆41 before the confirm, ◆40 after) |
| 13:49:24 → 13:53:58 | Create storyboard ◆40 › Storyboard Result (6 scenes; Jenna described as 「seventy-five-year-old woman with a grey chin-length bob」) |
| 13:54:2x | Fast · Preview - 30 sec ◆60 › Generate video. 13:54:29 `prompt_1` 「HTTP POST Add Media failed: Could not establish connection」, turn ended, no charge, chat stuck on 「give me a moment」 (**same stall as try 1**) |
| 14:00:47 | Sent 「Create the video」 → Video length card (Preview - 30 sec ◆60 / Full Video - 90 sec ◆180) › Preview ◆60 › Generate (14:01:08) |
| 14:03:14 | RefToVideo ×2 dispatched (t6); 「Here's your drama.」 shown with an empty player card while the clips render |
| 14:08:5x | Clips 1–2 done; 「Create the rest of the video (60 sec)」 ◆120 offered |
| 14:09:16 | Generate; 14:10:31 RefToVideo ×4 (t7); all four `status=Done` by 14:17:39, no tool_error |
| 14:18:48 | Session exported with media |
| ~14:24 | Play drama (6 clips, `…_try2_player.png`); debug info OFF; IAP sheet closed with its X; phone on the Launcher, credits 5376 |

### Result per clip (frames from the exported MP4s, `try2/16.8.0.2611041_DRA262610P0420_try2_jenna_clips.jpg`)
| Clip | Part | Jenna | Apparent age | Prompt states her age |
| --- | --- | --- | --- | --- |
| 1 | preview (t6 vid_1) | yes (loading-dock door, with Noah) | about 55–60, matches the portrait | no |
| 2 | preview (t6 vid_2) | yes (yard close-ups) | about 55–60 | no |
| 3 | full (t7 vid_1) | yes (office desk, night) | about 55–60 | yes (「75-year-old female」) |
| 4 | full (t7 vid_2) | yes (rain awning, radio) | about 55–60 | yes (「75 years old」) |
| 5 | full (t7 vid_3) | no (Noah and Caleb in the aisle) | — | no |
| 6 | full (t7 vid_4) | yes (warehouse aisle, Richard arrives) | about 55–60 | no |

**Reproduced: no (try 2). Overall 0/2 on 2611041.** Jenna keeps the portrait's face, grey bob and age in all five clips she is in, preview and full alike, including clip 6 whose prompt omits her age. Nobody takes another character's look.

Blueprint (`try2/16.8.0.2611041_DRA262610P0420_try2_blueprint.json`, complete valid JSON with session_id, outline, assets, 6-beat storyboard, failures): `char_jenna_morales` **age "75"**, gender female, ethnicity white, look 「…Grey chin-length bob hair with a side parting」, default_wardrobe 「White double-breasted chef jacket with rolled-up sleeves, dark cargo pants, and black work boots」, front image `character_char_jenna_morales_custom_18825a6c…_image.png` (the Mine chef sheet). Every RefToVideo used that image for Jenna (`try2/16.8.0.2611041_DRA262610P0420_try2_log.txt`). Unlike try 1, the age is missing from **both preview prompts** too (clips 1, 2) and from clips 5 and 6 of the full part; only clips 3 and 4 state it. The prompts' age wording varies per clip, but it changed nothing on screen.

Wardrobe (correction to try 1's side observation): every Jenna WARDROBE line is again 「a durable dark canvas utility vest over a grey long-sleeve shirt, fitted jeans, and steel-toed boots」, and this time no other Mine look was ever applied. The blueprint versions show where it comes from: the **template's own Jenna** (V4–V8, age 24, `…female_arab_24_Maya-Mansour…`) already carries the vest in the storyboard beats; after the Mine look is applied (V9 on) `default_wardrobe` becomes the chef jacket but the beats keep the vest. So the beats' wardrobe isn't refreshed when a character is replaced (not this ticket).

Evidence (try 2):
- `exports/261105_134441_e3669d07_20261105_141848.zip` (85,422,396 bytes, with media; git-ignored; `media/r2v/*.json` hold app `unique_key` credit tokens): `blueprint.json`, `blueprint_versions/V1–V15`, `host_inputs/`, `library_portrait_baseline.json`, `chat_history.json`, `engine_events/`, `perf/`, `media/` (Jenna's chef sheet, the template's original Jenna, Noah, Caleb, Richard, env images, clips `reftovideo_…_t6_…_vid_1/2_15s.mp4` and `…_t7_…_vid_1–4_15s.mp4`)
- `try2/16.8.0.2611041_DRA262610P0420_try2_blueprint.json`, `try2/16.8.0.2611041_DRA262610P0420_try2_jenna_clips.jpg`, `try2/16.8.0.2611041_DRA262610P0420_try2_log.txt`
- `try2/screenshots/…_try2_launcher.png`, `…_try2_assistant.png`, `…_try2_mine_library.png`, `…_try2_cast.png`, `…_try2_player.png`
- Raw logs (git-ignored): `logs/try2-20261105-142023/`
