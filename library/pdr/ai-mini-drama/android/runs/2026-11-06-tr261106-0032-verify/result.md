# TR261106-0032 verify — DRA262610P0424 French copy, 2026-11-06

Build 16.8.0.2611061 (TR build, official APK, MD5 checked), `adb install -r` over 2611052 (sign-in kept; `build`:
versionCode 2611061, updated 15:33:00), Stage (yellow bar, `[AID]Stage_Server`), Samsung Galaxy A53 SM-A5360
(R5CTB22S05Y, Android 15, system locale en-US). Account from the fifth Launcher tab (labelled 「Pro」 on this account,
「Mine」 on a Free one): `cltqauiap2@gmail.com` (qau2 CLT), card **「Pro」** (「You're on the highest plan.」), 27,812
credits (`screenshots/16.8.0.2611061_DRA262610P0424_00_account.png`; the ☰ menu also lists the account,
`…_00a_menu_account.png`). One chat turn, no credits used, no video. Expected result checked against today's spec
(`spec-check.md`). No ticket was commented on.

| BugCode | Verdict | Note |
| --- | --- | --- |
| DRA262610P0424 | FIXED | format card 「1. Langue de la vidéo」; storyboard card 「Des crédits seront consommés pour cette tâche.」 |

## DRA262610P0424
- Steps: per-app language fr-FR (`cmd locale set-app-locales com.cyberlink.powerdirector.DRA140225_01 --locales
  fr-FR`, read back `[fr-FR]`; system stays en-US) › app terminated and reopened in French (「Accueil」, 「Magique IA」…)
  › Launcher 「Mini Fiction AI」 › 「Bonjour, je suis votre Assistant drama IA」 (no intro: 「Don't show again」 was ticked
  on 11/06) › 「Démarrer à partir d'un modèle」 › 「Plus」 › 「L'art de la chute」 › 「Créer votre version」 (15:35:44) ›
  format card (15:35:51) › 「Générer」 (15:36:00) › turn complete 15:38:51 (168 s), storyboard card read 15:46.
  Storyboard **not** generated.
- Format card: 「L'art de la chute」 / 「Quel format souhaitez-vous pour votre vidéo ?」 / **「1. Langue de la vidéo」** /
  Anglais · Espagnol · Français (selected) · Allemand · Japonais · Coréen · Chinois / 「2. Sous-titres」 / 「Oui, inclure
  les sous-titres」 (selected) · 「Aucun sous-titre」 / 「Générer」 (`16.8.0.2611061_DRA262610P0424_01_format_card.png`).
- Storyboard card: **「Créer le storyboard」 / 「Des crédits seront consommés pour cette tâche.」** / ◆40 / 「Il vous en
  restera 27772」 / 「Générer」 (`16.8.0.2611061_DRA262610P0424_02_storyboard_card.png`).
- Against 2611041 (11/05): 「Langage」 → 「Langue」 now fixed; the credit line stays fixed.
- Log: `16.8.0.2611061_DRA262610P0424_log.txt` (session, prompt, turn_complete timing).
- Side effects: none seen (places checked: format card — 「1. Langue de la vidéo」 on one line, same weight and size as
  「2. Sous-titres」, nothing clipped or overlapping, language chips wrap to two rows as before; storyboard card — the
  credit line fits on one line inside the blue card, legible white on blue, no overlap with ◆40 / 「Il vous en
  restera…」 / 「Générer」).

## Other observations (not filed)
- O-1 (changed since 11/05): the card's balance line is now French, 「Il vous en restera 27772」 (11/05: English
  「You'll have 28082 left」).
- O-2 (still shows): an English Iris line before the French question: 「I have created the six-beat storyboard for
  Julian Cross and Lauren Hale in French.」 then 「Les personnages sont superbes ! Voulez-vous créer le storyboard ?」.
  Generated chat text, not app copy.
- O-3 (still shows): Launcher label 「Mini Fiction AI」; the in-feature title 「Mini Drama IA」 seen on 11/05 was on the
  intro, which did not show this time (Don't show again ticked), so the mismatch was not re-seen on screen.
- O-4: the template's cover art reads 「The Art of Falling」 (image content, not localized), as before.

## Credits and turns
| When (CST) | Pill |
| --- | --- |
| Start, Mine (15:34) | 27,812 |
| Format card (15:35:51) | 27,812 |
| Storyboard card shown (after the Générer turn) | 27,812 (card: ◆40, 「Il vous en restera 27772」) |

Used: 0 credits, 1 chat turn (template Générer: outline + characters, free).

## End state
App locales cleared (`--locales ""`, read back `[]`), relaunched in English (「AI Mini Drama」 on the Launcher;
`screenshots/…_05_back_in_english.png`); system locale en-US. The French chat 「L'art de la chute」 is left at its
Créer le storyboard card, not generated. Logs pulled to `logs/p0424-20261106-154621/` (git-ignored).

QA Report: [QR261106-0024](https://ecl.cyberlink.com/IF3/qr/BPM/FormView/QR261106-0024) filed 2026-11-06, OK 1 / Fail 0 (P0424 now Close). Evidence (2 screenshots + log) uploaded to P0424 before Create; receipt `qr-receipt.json`.
