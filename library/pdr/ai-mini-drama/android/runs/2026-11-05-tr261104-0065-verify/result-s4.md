# TR261104-0065 verify, segment 4 (last), 2026-11-05 15:41–16:21 (phone clock, CST)

- Phone: Samsung Galaxy A53 (SM-A5360, adb R5CTB22S05Y), Android 15, Stage server.
- Build: PowerDirector Mobile for Android 16.8.0 build 2611041 (TR261104-0065), debuggable re-sign of the official APK.
  Nothing uninstalled, cleared or injected (no fault switch). Wi-Fi toggled only for P0415 (adb `svc wifi`).
- Account: the Pro account from segments 1–3 (still signed in; no limit dialog, no sign-in prompt).
- Session start: `restart R5CTB22S05Y` (15:41). Segment 3's logcat capture (from 15:39:30) kept running; pulled at the
  end into `logs/s4-20261105-162122/` (live 15:39:30–16:21:22 + ring buffer). UiAutomator2 dropped once during the
  17-min wait and was restarted automatically (16:18).
- Language: per-app locale fr-FR for P0424 only (15:49–16:00), then cleared (`set-app-locales … --locales ""`, app
  locales `[]`); system locale untouched (en-US). App relaunched in English (「AI Mini Drama」, 「Hi, I'm your AI Drama
  Assistant」).
- State at the end: Wi-Fi on (17F_QA_Wifi_5G); app in English on the AI Mini Drama home. 「Salt Broth」: storyboard
  regenerated with Scene 1 image and Scenes 2–6 failed (↻, not retried). New template chat 「L'art de la chute」 (in
  French) left at its Créer le storyboard card ◆37, **not generated**. No video generated.

## Credits and turns
| When (CST) | Pill |
| --- | --- |
| Start (15:41) | 28,126 |
| 「Please regenerate the storyboard」 (reply 15:42:55, card ◆19) | 28,126 |
| Storyboard Generate 15:47:01: preview TTS (−1, receipt 15:47:19.9) | 28,125 |
| img_1 (−3, 15:47:25) + img_2 charged-then-failed (−3, 15:47:26), seen 15:48:27 after Wi-Fi came back | 28,119 |
| French template: Créer votre version › Générer (outline + characters; free) | 28,119 |
| Refund check (16:19–16:21) | **28,119** |

Charged 7 this segment, nothing refunded. Chat turns: 3 (「Please regenerate the storyboard」, its Generate, the French
template Générer).

## DRA262610P0415 storyboard scene images fail (retry, charged-then-failed)
- Steps: History › 「Salt Broth」 (already open) › pill 28,126 › typed 「Please regenerate the storyboard」 › Send
  (15:42:24) › Iris 「I have regenerated all six scenes of the storyboard with streamlined cuts and dialogue.」 / 「The
  characters look great! Ready to create the storyboard?」 / card 「Create storyboard」 「Credits will be consumed for this
  task.」 ◆19 「Generate」 「You'll have 28107 left」 (19 = TTS 1 + 6 scene images × 3; location images kept) › Generate
  (15:47:01) › a background watcher on the live logcat ran `svc wifi disable` on the **first scene-image receipt**
  (`…_s_img_1` 「receipt submitted」 15:47:25.672; **Wi-Fi off 15:47:26.04**) › 30 s › **Wi-Fi on 15:47:56.27** ›
  waited for the turn (turn_complete 15:48:32.1) › read the card › Scene 2 › ✕ › ↓ › pill.
- Order: scene-image steps img_1..6 started 15:47:11.6 (upload took 10–13 s); preview TTS receipt 15:47:19.9; img_1
  receipt 15:47:25.7; then the drop.
- Charged and failed (log + Credit Details records):
  - img_1 (Scene 1): charged −3 (record 15:47:25), **succeeded** (`receipt done` 15:48:32.0).
  - **img_2..img_6 (Scenes 2–6): failed 15:47:26.289–.387** (`[TextToImage] generation_failed: Others … ConnectException:
    Failed to connect to demo.myedit.online`, 「receipt failed」 ×5); at turn end `[engine] target=beat_… |
    tool=EditImageGPT2 | … generation_failed - Others` ×5.
  - **One of them was charged: a −3 Text to Image record at 15:47:26** (the second −3; pill 28,125 → 28,119 = img_1 +
    one failed image). The other four failed images were not charged.
  - Preview TTS: charged −1 (15:47:19), succeeded (`receipt done` 15:48:26.9).
- Seen:
  - Chat: 「Create storyboard」 bubble › 「I'll create a storyboard — give me a moment...」 › 「Here's your storyboard」 +
    Storyboard Result card (「View more」). No Iris text about failed images or refunds.
  - Storyboard Result: Scene 1 has an image; **Scenes 2–6 show a grey tile with ↻** (regenerate icon), not 「!」.
  - Scene 2 view: 「Scene 2」 / scene slot 「Scene」 / **「Couldn't create image」 / 「Your credits have been refunded. The
    service is busy — try again later.」 / 「Edit」** / 「A Clashing Kitchen」. ✕ back.
  - Storyboard Preview: 「Storyboard preview unavailable. Complete the image generation above first to view the
    preview.」 (「Salt Broth」 0:38).
  - Pill 28,119 after the turn (15:48:27) and at 16:21.
- Refund check (16:19:04, **31.6 min after the failure**): Credit Details shows the 15:47 rows 「Text to Image
  PowerDirector (Android) -3 2026/11/05 15:47」 ×2 and 「Text to Speech … -1 … 15:47」, and **no 「Generation failed,
  credits returned」 or other plus line** after 14:54; the app's history response has no refund/returned record. Pill
  28,119 (would be 28,122 with the 3 back).
- Screenshots: `…P0415_s4_00_start_balance.png`, `…P0415_s4_01_after_send.png`, `…P0415_s4_02_card_before_generate.png`,
  `…P0415_s4_03_wifi_off.png`, `…P0415_s4_04_end.png` (Scene 1 image, Scenes 2–4 ↻), `…P0415_s4_05_scene2_view.png`,
  `…P0415_s4_06_bottom.png`; Details: `…P0388_s4_01_details_p1.png` (15:47 rows).
- Log: `16.8.0.2611041_DRA262610P0415_s4_log.txt`; refund records `16.8.0.2611041_DRA262610P0388_s4_log.txt`.
- Raw finding: **STILL REPRODUCES** (bug's case hit: one scene image charged 3 and failed). The scene view says
  「Your credits have been refunded」, but 31 min later the 3 credits are not back and Credit Details has no 「Generation
  failed, credits returned」 line, against the bug's Expect and today's spec. Changed since filing: only one failed
  image was charged this time (the other four failed before a charge); the copy and ↻ tiles are as in segment 3
  (no 「!」, no chat message; `pm-update-5` / 5212:27212 still unread, so the 「!」 part is not judged here).

## DRA262610P0424 French copy
- Steps: per-app language `cmd locale set-app-locales com.cyberlink.powerdirector.DRA140225_01 --locales fr-FR`
  (system stays en-US) › app relaunched: Launcher in French (「Accueil」, 「Magique IA」, 「Image en Vidéo」…; the AI Mini
  Drama entry reads **「Mini Fiction AI」** on the Launcher) › Mini Fiction AI › intro 「Mini Drama IA」 › 「Essayer」 ›
  「Démarrer à partir d'un modèle」 › 「Plus」 › 「L'art de la chute」 (The Art of Falling) › 「Créer votre version」
  (15:50:47) › read the format card › 「Générer」 (15:50:58) › waited for the storyboard card (shown by 15:59) ›
  read it. Storyboard not generated.
- Seen:
  - Format card: 「L'art de la chute」 / 「Quel format souhaitez-vous pour votre vidéo ?」 / **「1. Langage de la vidéo」** /
    Anglais · Espagnol · Français (selected) · Allemand · Japonais · Coréen · Chinois / 「2. Sous-titres」 / 「Oui, inclure
    les sous-titres」 (selected) · 「Aucun sous-titre」 / 「Générer」.
  - After Générer, the sent summary bubble reads 「1. Langue de la vidéo : Français 2. Sous-titres : Oui, inclure les
    sous-titres」 (here 「Langue」 is correct), then 「Je vais créer un drama à partir de ce modèle. Veuillez patienter un
    instant…」.
  - Storyboard card: 「Créer le storyboard」 / **「Des crédits seront consommés pour cette tâche.」** / ◆37 / 「Générer」 /
    「You'll have 28082 left」.
  - Side (not in this bug): 「You'll have 28082 left」 is untranslated English; an Iris line is English (「The 6-beat
    storyboard for L'Art de tomber amoureux has been created with all scenes and dialogues in French.」) before the French
    「Les personnages sont superbes ! Voulez-vous créer le storyboard ?」; the Launcher label 「Mini Fiction AI」 differs
    from the in-feature title 「Mini Drama IA」.
- Screenshots: `…P0424_s4_00_launch_fr.png`, `…P0424_s4_01_launcher_fr.png`, `…P0424_s4_02_drama_home.png`,
  `…P0424_s4_03_create_page.png`, `…P0424_s4_04_templates.png`, `…P0424_s4_05_template_detail.png`,
  `…P0424_s4_06_format_card.png` (Langage), `…P0424_s4_07_storyboard_card.png` (Des crédits),
  `…P0424_s4_07b_card_at_1559.png`, `…P0424_s4_08_back_in_english.png`.
- Raw finding: **STILL REPRODUCES in part.** Storyboard card: FIXED (「Des crédits seront consommés pour cette
  tâche.」 as expected). Format card: still 「1. Langage de la vidéo」, expected 「1. Langue de la vidéo」 (bug's Expect,
  Design main flow board). Seen with the per-app language (the bug used the system language); the app was fully French,
  so the system switch was not needed.
- Restored: app locales `[]`, relaunch in English confirmed (16:00).

## DRA262610P0388 refund check (and every failed charge since 15:00)
- Steps: AI Mini Drama home › credit pill (16:18:51) › My Credits 「28119」 › 「Details」 › scrolled the list to before
  15:00 › back › My Credits 28,119 (16:21:11).
- Credit Details since 15:00 (newest first; Text to Image / Text to Speech lines all read 「PowerDirector (Android)」;
  seconds from the app's history response):

  | Line | Amount | Time | What it is |
  | --- | --- | --- | --- |
  | Text to Image | -3 | 15:47 (:26) | s4 Salt Broth img_2..6 — the charged one that **failed** |
  | Text to Image | -3 | 15:47 (:25) | s4 img_1 (succeeded) |
  | Text to Speech | -1 | 15:47 (:19) | s4 preview TTS (succeeded) |
  | Text to Speech | -1 | 15:36 (:45) | s3 preview TTS (succeeded) |
  | Text to Image | -3 | 15:36 (:09) | s3 location image |
  | Text to Image | -3 | 15:36 (:09) | s3 location image |
  | Text to Image | -3 | 15:36 (:08) | s3 location image |
  | Text to Image | -3 | 15:35 (:44) | s3 location image |
  | Text to Speech | -1 | 15:11 (:37) | s2 Storyboard Preview Retry (succeeded) |
  | Text to Image | -3 | 15:08 (:15) | s2 Stormbound s_img_1 / s_img_2 (Scene 4, **failed** 15:08:14.913) |
  | Text to Image | -3 | 15:08 (:14) | s2 s_img_1 / s_img_2 |
  | Text to Speech | -1 | 15:08 (:11) | s2 preview TTS (**failed**, receipt failed 15:09:15.715) |
  | Text to Image | -3 | 15:07 (:41) | s2 location image |
  | Generation failed, credits returned | +1 | 14:54 | segment 1 TTS (before this window) |

- Refunds: **none** for P0388's Scene 4 image (−3, failed 15:08:14; 70 min before the check), P0388's preview TTS
  (−1, failed 15:09:15; 69 min), or s4's failed image (−3, failed 15:47:26; 31.6 min). The only 「Generation failed,
  credits returned」 line is segment 1's +1 at 14:54.
- Balance: **28,119**. Against result-s2.md: s2 end 28,139 − 13 (s3) − 7 (s4) = **28,119**, i.e. nothing came back.
  With the refunds it would be 28,119 + 3 + 1 (P0388; the 「28,143」 of s2 less 20 spent since) + 3 (s4) = **28,126**.
- Side observation, not judged: segment 2 charged two location images at 15:07:41 (log balance 28,153 → 28,150 →
  28,147), but Details lists only one 15:07 Text to Image row; the Details rows since 15:00 sum to −31 while the pill
  fell 34 (28,153 → 28,119).
- Screenshots: `…P0388_s4_00_my_credits.png`, `…P0388_s4_01_details_p1.png` (15:47–15:36), `…P0388_s4_02…06_details_p*.png`
  (scroll frames), `…P0388_s4_08_details_1536_to_1508.png`, `…P0388_s4_07_details_1511_to_1454.png` (15:08–14:54, the
  +1 line), `…P0388_s4_09_my_credits_after.png`.
- Log: `16.8.0.2611041_DRA262610P0388_s4_log.txt`.
- Raw finding: **STILL REPRODUCES (refund part)**: 70 min after the failure the Scene 4 image's 3 credits (and the
  failed TTS's 1) are not returned and Credit Details has no 「Generation failed, credits returned」 line, although the
  scene view says 「Your credits have been refunded」. Bug's Expect and `pm-update-3` J5 want them refunded. With
  segment 2 (no 「!」, no chat message; Edit inside the scene view): overall **STILL REPRODUCES**.

## Not done
- Nothing of the brief left undone. Failed scenes (Salt Broth 2–6, Stormbound 4) left untouched; the French template
  chat's storyboard not generated.
