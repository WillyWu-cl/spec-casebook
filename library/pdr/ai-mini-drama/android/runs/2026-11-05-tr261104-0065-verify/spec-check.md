# TR261104-0065 verify: expected result against today's spec (REQ-091 / REQ-093)

Repo data only (no Figma, eCL or phone calls), 2026-11-05. Sources: `android/cases.csv`, `android/requirements.md`,
`specs/2026-10-21-2/extracted/` (newest set; `board-notes.md`, `figma-inventory-*.json`, `mx-charging-table.md`),
the 2026-11-05 PM/Design/MX change check (`extracted/figma-check.json`, `figma-check/{pm,design,mx}.json`),
`requests.md`, `knowledge/`, and the 2026-11-03 / 2026-11-05 run results on 2611021 / 2611041.

**The 11/05 change check is not fully read yet.** It flagged changed boards that have not been read again: PM
`pm-1002-update-a/b` (§13.2 chat scrolling), `pm-update-5` (3325:18429, offline, including 「Offline_mid generation →
Try again」), `pm-update-9`, `4422:2` (§13.24; REQ-091: only an 11/4 note about pausing replies that cost nothing),
Design `main flow` (2778:127318) and `video` (2820:113981). It also found five new PM boards that have not been read:
10/29 Regenerate Clip one at a time (4784:70878), 11/3 Fix these issues copy (4982:27069), 11/3 Character Library
filter with no results (5014:26418), **11/4 Chat scrolling: four scenarios (5128:8)** and 11/4 several failed scenes:
fix the first one first (5212:27212).
Reread today and unchanged in meaning: `pm-main-flow-11` (composer, Surprise me), `-13`, `-21`, `-22`,
`pm-error-handling-c`, `pm-update-11`. Unchanged hash: 1016_Chat navigation (4858:34930), Design MX (2820:125545),
`pm-update-7` (3746:20983), every MX board (including `mx-a-right` ③ charging table). The linked sheet has not been
read again since 2026-10-29.

| Bug | Verdict |
| --- | --- |
| P0324 | Same |
| P0326 | Same |
| P0328 | Changed (price only: ◆4 → ◆6) |
| P0332 | Same |
| P0350 | Open: newer boards not yet read (5128:8 new, pm-1002-update-a changed) |
| P0354 | Same (Q-3 is listed open but the row is decided by the Design-first rule) |
| P0381 | Same |
| P0388 | Same in substance (the price per image changed; two-stage job) |
| P0415 | Same in substance (two-stage job: drop Wi-Fi in stage ②) |
| P0416 | Same (Best price rests on open Q-A19) |
| P0424 | Same (the spec has no French strings; the language rule decides) |

---

## DRA262610P0324: Surprise me repeats (ISS-AMDA-01)
- **Row:** TC-014 (R-014, R-287). **Start:** empty chat (Create Your Drama), input box not cleared between taps.
- **Current expected:** 「Each tap appends one inspiration after the existing text instead of replacing it; the picks
  are random from the pool (not one of the two chips), so the five are not all the same string (a single repeat is
  allowed)」. PM note (`pm-main-flow-11`, reread 11/05, unchanged): 「ui 顯示前兩個, surprise me 從 array 裡面排除ui那兩個隨機抽一個」
  (the UI shows the first two strings; Surprise me picks one at random from the rest) and 「連續按隨機抽, 不會替換掉原text內容,
  會直接接續上去」 (each press is a new random pick, appended to the text, never replacing it).
- **vs bug:** Same. Also check that no pick equals one of the two chips (R-287). The Design main flow board changed
  on 11/05 and has not been read again, but the PM rule governs Surprise me.

## DRA262610P0326: Gender 「Other」 twice (ISS-AMDA-03)
- **Row:** TC-036 (R-031, R-040). **Start:** character stage › a slot › Choose Character › filter icon (swipe the
  Gender row).
- **Current expected:** 「Gender lists Female, Male and Other(s), each once」. Spec string (PM main flow, Make your
  character): 「Gender* (Female / Male / Others)」.
- **vs bug:** Same. The 「Other」 vs 「Others」 label is DRA262610-0020 and is not judged here; this bug is only the
  duplicate. The new 11/3 PM board 「角色庫 filter 沒有結果」 (5014:26418, Character Library filter with no results) has
  not been read; by its title it covers the empty-result state, not the option list. Still reproduced on 2611021
  (11/03 verify, 2/2).

## DRA262610P0328: Update characters card has no count (ISS-AMDA-07)
- **Rows:** TC-045, TC-350 (R-038, R-254). **Start:** all characters set, storyboard not started (R-254: the same
  flow runs after a storyboard, which then ends with the storyboard offer).
- **Current expected:** with no question first, 「Ready to update your characters?」 and the card 「Update characters •
  1 character • ◆{price} • Generate」 (PM `pm-update-7` 10/16: 「Update characters • {n} character(s) • ◆{credits} •
  Generate」). Before Generate nothing else is posted. For two characters: 「• 2 characters」 at twice the price.
- **vs bug:** **Changed (price only).** R-254 changed on 2026-10-29 (REQ-059): one character is **◆6**, two are ◆12.
  The bug's example says ◆4. The build still quotes ◆4 (2611041, 11/05 P0334 recheck); that price belongs to
  DRA262610P0327, so judge this bug on the count only. `pm-update-7` is unchanged (11/05 hash).

## DRA262610P0332: typed name gets no Update card (ISS-AMDA-11)
- **Row:** TC-391 (R-301, R-254). **Start:** all characters set, no storyboard; send an unclear request (e.g. 「Can
  you change one of the characters to look older?」) so that Iris asks 「Sure! Which character would you like to
  change?」 with 2–4 chips.
- **Current expected:** 「Iris takes the typed answer as it would a chip and offers the 「Update characters」 card」.
  The card is priced ◆6 for one character (R-254, REQ-059). After Generate, the new Story Outline & Characters card
  updates the outline text as well as the images (R-301).
- **vs bug:** Same. `pm-update-7` is unchanged.

## DRA262610P0350: sent message not moved to the top (ISS-AMDA-31)
- **Row:** TC-344 (R-250). **Start:** a chat with several messages (the bug used a finished storyboard and sent
  「Please update the image for Scene 2…」).
- **Expected in the repo (PM §13.2, 10/20):** 「The sent message moves to the top of the screen; the reply generates
  below without the view following it; ↓ appears when it runs past the screen and tapping it scrolls smoothly to the
  bottom」.
- **vs bug:** **Open: newer spec not yet read.** The 11/05 check found a new PM board 「11/4 update — Chat 捲動：四種情境」
  (5128:8, chat scrolling in four scenarios) and a changed `pm-1002-update-a` (frames 「Chat_scrolled up (↓ shown)」 and
  「Chat_at bottom」). REQ-091's skim says 5128:8 names 「Update characters」 only as a Generate answer that scrolls to
  the top. Read both before the verdict, and test each of the four scenarios the board defines. A plain send and a
  Generate tap on an action card may scroll differently. Related: P0349 (↓ button) was FIXED on 2611021.

## DRA262610P0354: no 「You'll have N left」 (ISS-AMDA-35)
- **Row:** TC-115 (R-100). **Start:** the Create storyboard card (storyboard offer) and the video settings card
  (「Choose your video settings」).
- **Current expected:** 「A line 「You'll have {n} left」 shows the balance after this action; tapping Generate charges
  without a separate confirmation」 (Design MX link: 「You'll have 160 left」).
- **vs bug:** Same. R-100's text and Q-3 still mention a 「Confirm」 step from MX. The approved row follows the
  Design-first rule (user, 2026-10-19), which gives the line under Generate and no confirmation; that matches the bug.
  Design MX (2820:125545) is unchanged. The Design `video` board changed on 11/05 and has not been read again; read it
  for the video card. Seen on 2611041 already: the line is on the Create storyboard card (「You'll have 28205 left」,
  P0343 recheck) and on the Update characters card (P0334 recheck). The video card has not been seen yet; check both
  cards.

## DRA262610P0381: credit pill skips 「Leave this chat?」 (ISS-AMDA-48)
- **Rows:** TC-357, TC-358 (R-261, R-333). **Start:** new chat, outline generating (after the format card Generate,
  while 「Thinking…」 / 「Writing your story...」 shows).
- **Current expected:** the credit pill, like New chat, History and ←, shows 「Leave this chat?」 / 「Your story
  outline isn't ready yet, so this chat won't be saved.」 with 「Leave anyway」 / 「Stay」. 「Stay」 keeps the chat and
  the outline still arrives. 「Leave anyway」 opens My Credits and History has no entry for this idea.
- **vs bug:** Same. 1016_Chat navigation is unchanged. The 11/4 note on `4422:2` (replies that cost nothing, the
  outline included, may be paused with ■) does not touch leaving. Test both branches, Stay (TC-357) and Leave anyway
  + History (TC-358). Both rows still failed on 2611021 (REQ-080, 11/04).

## DRA262610P0388: failed chat-update images, no 「!」 or refund (ISS-AMDA-55)
- **Row:** TC-293 (R-157; refund rule KP-007). **Start:** finished storyboard; ask Iris to change two scene images.
- **Current expected (PM `pm-update-3` J5):** successful images update. Each failed one is refunded and marked 「!」
  with 「1 image couldn't be updated. Your credits have been refunded. Tap Edit to try again, or tell me what to
  change.」 and Edit. Credit Details shows the refund (「Generation failed, credits returned +N」, KP-008).
- **vs bug:** Same in substance. Three things changed after filing:
  - The price per image is now 6 (R-061, REQ-059, 2026-10-29). The refund to expect is what the failed images were
    actually charged (the bug's 6 = 2 × 3 on 2610212).
  - The action card reads 「Create storyboard • credits • Generate」 (PM 10/20).
  - The chat storyboard update is a two-stage job (R-158 changed 10/27, §13.24). It is charged only in stage ②
    (「Creating your storyboard…」), so turn Wi-Fi off after the charge, in stage ②. A drop in stage ① tests nothing.
    By Q-17, read the newest Storyboard Result card; earlier cards are not updated.

  Not yet read: `pm-update-5` changed on 11/05 (「Offline_mid generation → Try again」, R-165: an offline drop
  mid-generation shows Try again), and the new 11/4 board 「多個 scene 失敗：先修第一個」 (5212:27212). Read both before a
  Fail verdict that rests on the 「!」 copy. The refund itself (KP-007) is unaffected. `pm-update-3-b` was flagged only
  for a missed arrow (3168:18114).

## DRA262610P0415: storyboard image refunds never arrive (ISS-AMDA-60)
- **Row:** TC-465 (R-057, R-141; KP-007 / KP-008). **Start:** all characters set, at 「The characters look great!
  Ready to create the storyboard?」 with the Create storyboard card. Note the balance before Generate.
- **Current expected:** each failed scene image shows its failure card with 「Your credits have been refunded…」 (5xx
  copy: 「Couldn't create image / Your credits have been refunded. The service is busy - try again later.」). The
  failed images' credits come back: the pill rises and Credit Details lists 「Generation failed, credits returned
  +N」.
- **vs bug:** Same in substance.
  - The storyboard is two-stage (§13.24, R-317/R-320): nothing is charged in stage ① (「Generating storyboard.」 on
    2611041) and charging starts in stage ② (「Creating your scene…」). Turn Wi-Fi off after the per-image receipts.
  - Price per scene image: 6 (R-050, REQ-059). Expect a refund equal to what each failed image was charged (3 each on
    2610212).
  - Same open reads as P0388: `pm-update-5` (offline mid-generation → Try again), 5212:27212, and the 11/4 change on
    `4422:2`.

## DRA262610P0416: video prices (ISS-AMDA-61)
- **Rows:** TC-080, TC-230 (R-069, R-147, R-481). **Start:** video settings card (「Choose your video settings」)
  after a finished storyboard.
- **Current pricing rule:** R-069 changed on 2026-10-29 (REQ-059: the original prices from the MX ③ charging sheet,
  `mx-charging-table.md`, sheet modified 2026-10-20). Seedance 2.0 1080p (Standard) costs **13/s**, Seedance 2.0 Mini
  720p (Fast) **4/s**, Seedance 2.5 (Best) **6/s**, the PM 10/16 rate kept because the sheet has no 2.5 row (Q-A19,
  open). That gives Preview • 30 sec **◆180 / ◆390 / ◆120** and Full Video 90 sec **◆540 / ◆1170 / ◆360**. Full length
  is 15 s × scenes (R-251). The promotion price is held (R-147, R-479), so expect no discount. The charge goes under
  `genvideo_1_sec_bytedance_seedance2.0std_enable_1080p_aiminidrama_normal` (or `…2.0mini_enable_720p…_normal`)
  with the matching `total_credit` in logcat.
- **vs bug:** Same, because REQ-059 predates the filing. Only the Best figure depends on the open Q-A19. The MX boards
  are unchanged on 11/05. The Design `video` board changed, but under REQ-059 Design prices are mocks and do not set
  prices. Seen on 2611041: the video offer quoted 「Generate video」 ◆120 (official build, chat 16, model not
  recorded); that equals only Fast Preview under today's rule.

## DRA262610P0424: French copy (ISS-AMDA-69)
- **Row:** TC-406 (R-149, R-313). **Start:** phone system language French; a template chat (「The Art of Falling」 ›
  Créer votre version) through the format card and the Create storyboard card.
- **Current expected:** 「Every string is French: no English left, no spelling, grammar or punctuation errors」. The
  spec is English only (「1. Video language」; the credit line 「Credits will be consumed for this task.」 is app copy,
  not in the spec). The repo holds no French string table or newer French source, so the bug's wording (「1. Langue
  de la vidéo」, 「Des crédits seront consommés pour cette tâche.」) remains QA's language judgment under R-149 / R-313.
- **vs bug:** Same. Pass if both strings are grammatical French (another correct wording also passes); fail if
  「Langage de la vidéo」 or the article-less 「Crédits seront consommés…」 remains.
