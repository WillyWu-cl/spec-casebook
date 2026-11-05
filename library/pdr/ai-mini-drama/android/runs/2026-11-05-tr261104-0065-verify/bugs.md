# TR261104-0065 verify: ETHAN_HSU bugs (descriptions as filed)

## DRA262610P0324 (2026-10-27-a2)
PDR-A 16.8.0 - [AIAgent] AI Mini Drama: Surprise me appends the same inspiration on every tap

Repro Steps:
1. Launch the APP
2. Tap AI Mini Drama on the Launcher
3. Tap Create Your Drama
4. Tap Surprise me
5. Tap Surprise me
6. Tap Surprise me
7. Tap Surprise me
8. Tap Surprise me
9. Check the result

Result:
Five Surprise me taps append the same inspiration five times instead of random picks.
{16.8.0_amda01_same_pick_x5.jpg}

Expect Result:
Each tap appends a random pick from the inspiration pool, so five taps are not all the same string.

Note:
Device: Sony Xperia 10 III (XQ-BT52) / Android 12
Spec Link: AI Mini Drama PM spec (AI Mini Drama - PM Spec 20261021.pdf), Main flow board - https://www.figma.com/design/44RyrcOcWi2MvhGci9bO5F/AI-Mini-Drama?node-id=2016-2
<Claude Reviewed>

## DRA262610P0326 (2026-10-27-a2)
PDR-A 16.8.0 - [AIAgent][UI] AI Mini Drama: Character filter lists 「Other」 twice under Gender

Repro Steps:
1. Launch the APP
2. Tap AI Mini Drama on the Launcher
3. Tap History
4. Tap a drama at 「Choose your characters」
5. Tap a character slot
6. Tap the filter icon
7. Swipe the Gender options left
8. Check the result

Result:
The Gender filter lists 「Female」「Male」「Other」「Other」: Other appears twice.
{16.8.0_amda03_other_twice.jpg} {16.8.0_amda03_other_twice2.jpg}

Expect Result:
Gender lists Female, Male and Others once each.
Spec string: 「Female / Male / Others」

Note:
Device: Sony Xperia 10 III (XQ-BT52) / Android 12
Spec Link: AI Mini Drama PM spec (AI Mini Drama - PM Spec 20261021.pdf), Main flow board - https://www.figma.com/design/44RyrcOcWi2MvhGci9bO5F/AI-Mini-Drama?node-id=2016-2
<Claude Reviewed>

## DRA262610P0328 (2026-10-27-a2)
PDR-A 16.8.0 - [AIAgent][UI] AI Mini Drama: Update characters card shows no character count

Repro Steps:
1. Launch the APP
2. Tap AI Mini Drama on the Launcher
3. Tap History
4. Tap a drama whose characters are all set (no storyboard yet)
5. Type Make Maya Lin a woman in her 40s
6. Tap Send
7. Wait for the Update characters card
8. Check the result

Result:
The card shows only 「Update characters」, the price and Generate; 「• 1 character」 (or 2) is missing.
{16.8.0_amda07_one_character.jpg} {16.8.0_amda07_two_characters.jpg}

Expect Result:
The card reads 「Update characters • 1 character • ◆4 • Generate」 (「• 2 characters」 for two).
Spec string: 「Update characters • N character(s) • ◆credits • Generate」

Note:
Device: Sony Xperia 10 III (XQ-BT52) / Android 12
Spec Link: AI Mini Drama PM spec (AI Mini Drama - PM Spec 20261021.pdf), Update board 7 board - https://www.figma.com/design/44RyrcOcWi2MvhGci9bO5F/AI-Mini-Drama?node-id=2016-2
<Claude Reviewed>

## DRA262610P0332 (2026-10-27-a2)
PDR-A 16.8.0 - [AIAgent] AI Mini Drama: A typed character name does not lead to the Update characters card

Repro Steps:
1. Launch the APP
2. Tap AI Mini Drama on the Launcher
3. Tap History
4. Tap a drama whose characters are all set (no storyboard yet)
5. Type Can you change one of the characters to look older?
6. Tap Send
7. Wait for Iris's question
8. Type Walter Grant
9. Tap Send
10. Check the result

Result:
Iris replies 「Retained Walter Grant…」 and offers Create storyboard; no Update characters card appears.
{16.8.0_amda11_no_update_card.jpg}

Expect Result:
A typed name is taken like a chip: Iris offers the 「Update characters」 card for that character.

Note:
Device: Sony Xperia 10 III (XQ-BT52) / Android 12
Spec Link: AI Mini Drama PM spec (AI Mini Drama - PM Spec 20261021.pdf), Update board 7 board (10/16) - https://www.figma.com/design/44RyrcOcWi2MvhGci9bO5F/AI-Mini-Drama?node-id=2016-2
<Claude Reviewed>

## DRA262610P0350 (2026-10-27-a2)
PDR-A 16.8.0 - [AIAgent] AI Mini Drama: Sent message is not moved to the top and the view follows the reply

Repro Steps:
1. Launch the APP
2. Tap AI Mini Drama on the Launcher
3. Tap History
4. Tap a drama with a finished storyboard
5. Type Please update the image for Scene 2 so Mateo holds the guitar case
6. Tap Send
7. Watch the chat until the reply is shown
8. Check the result

Result:
After Send the bubble stays mid-screen and the view follows the reply to the bottom; no ↓ appears.
{16.8.0_amda31_after_send.jpg} {16.8.0_amda31_followed_reply.jpg}

Expect Result:
The sent message moves to the top; the reply generates below without the view following; ↓ shows if it overflows.

Note:
Device: Sony Xperia 10 III (XQ-BT52) / Android 12
Spec Link: AI Mini Drama PM spec (AI Mini Drama - PM Spec 20261021.pdf), 1002 update board §13.2 (10/20) - https://www.figma.com/design/44RyrcOcWi2MvhGci9bO5F/AI-Mini-Drama?node-id=2016-2
<Claude Reviewed>

## DRA262610P0354 (2026-10-27-a2)
PDR-A 16.8.0 - [AIAgent][UI] AI Mini Drama: Video and storyboard cards show no 「You'll have N left」 line under Generate

Repro Steps:
1. Launch the APP
2. Tap AI Mini Drama on the Launcher
3. Tap History
4. Tap a drama at 「Choose your video settings」
5. Look under Generate video
6. Check the result

Result:
Under Generate video the card shows only ◆120; there is no 「You'll have N left」 line (also on Create storyboard).
{16.8.0_amda35_video_card.jpg} {16.8.0_amda35_storyboard_card.jpg}

Expect Result:
A line 「You'll have N left」 under Generate shows the balance after this action.
Spec string: 「You'll have 160 left」 (Design MX link frame example)

Note:
Device: Sony Xperia 10 III (XQ-BT52) / Android 12
Spec Link: AI Mini Drama Design spec, MX Spec Link board - https://www.figma.com/design/dZk5HLzZTdcZwWwvN9aZfZ/AI-Mini-Drama?node-id=116-7873
<Claude Reviewed>

## DRA262610P0381 (2026-10-28-a4)
PDR-A 16.8.0 - [AIAgent] AI Mini Drama: Credit pill leaves a generating outline with no 「Leave this chat?」 dialog

Repro Steps:
1. Launch the APP
2. Tap AI Mini Drama on the Launcher
3. Tap Create Your Drama
4. Type an idea (e.g. A lonely lighthouse keeper and a stranded mail pilot)
5. Tap Send
6. Tap Generate
7. Tap the credit pill while 「Thinking…」 shows
8. Tap the system Back button
9. Wait for the Story Outline card
10. Tap ←
11. Tap History
12. Check the result

Result:
While the outline generates, the credit pill opens My Credits with no 「Leave this chat?」; the chat is saved.
{16.8.0_amda48_new_chat_dialog.jpg} {16.8.0_amda48_pill_no_dialog.jpg} {16.8.0_amda48_saved_in_history.jpg}

Expect Result:
The credit pill shows 「Leave this chat?」 like New chat and History; after Leave anyway nothing is saved.

Note:
Device: Sony Xperia 10 III (XQ-BT52) / Android 12
Spec Link: AI Mini Drama Design spec, 1016_Chat navigation frame - https://www.figma.com/design/dZk5HLzZTdcZwWwvN9aZfZ/AI-Mini-Drama?node-id=4858-34930
<Claude Reviewed>

## DRA262610P0388 (2026-10-28-a4)
PDR-A 16.8.0 - [AIAgent] AI Mini Drama: Failed scene images in a chat update show no 「!」 and keep their 6 credits

Repro Steps:
1. Launch the APP
2. Tap AI Mini Drama on the Launcher
3. Tap History
4. Tap a drama with a finished storyboard
5. Type 「Make Scene 2 and Scene 4 heavy rain」
6. Tap Send
7. Tap Generate on the update card
8. Turn Wi-Fi off while the images are updating
9. Wait 1 minute
10. Turn Wi-Fi on
11. Read Iris's reply in the chat
12. Tap Scene 2 on the Storyboard Result card
13. Tap ✕
14. Read the balance on the credit pill
15. Tap the credit pill
16. Tap Details
17. Check the result

Result:
Both main scene images fail (log) while Location images update; chat claims success, no 「!」 or Edit; 6 credits kept.
{16.8.0_amda55_success_claim.jpg} {16.8.0_amda55_no_message.jpg} {16.8.0_amda55_old_image.jpg} {16.8.0_amda55_log.txt}

Expect Result:
Failed images show 「!」 and 「…image couldn't be updated. Your credits have been refunded…」 with Edit; 6 refunded.

Note:
Device: Sony Xperia 10 III (XQ-BT52) / Android 12
Spec Link: AI Mini Drama PM spec (AI Mini Drama - PM Spec 20261021.pdf), Update board 3 board J5 - https://www.figma.com/design/44RyrcOcWi2MvhGci9bO5F/AI-Mini-Drama?node-id=2016-2
<Claude Reviewed>

## DRA262610P0415 (2026-10-30-a7)
PDR-A 16.8.0 - [AIAgent] AI Mini Drama: Failed storyboard images claim a refund, but the 15 credits never return

Repro Steps:
1. Launch the APP
2. Tap AI Mini Drama on the Launcher
3. Tap History
4. Tap a drama at 「Ready to create the storyboard?」
5. Read the balance on the credit pill
6. Tap Generate on the Create storyboard card
7. Turn Wi-Fi off while the scene images are being created
8. Wait 30 seconds
9. Turn Wi-Fi on
10. Wait for the storyboard to finish
11. Tap a failed scene on the Storyboard Result card
12. Tap ✕
13. Wait 30 minutes
14. Tap the credit pill
15. Tap Details
16. Check the result

Result:
5 scene images fail after a charge of 3 each; each says credits were refunded, but none come back after 35 min.
{16.8.0_amda60_failed_scene_refunded.jpg} {16.8.0_amda60_details_2023_no_return.jpg} {16.8.0_amda60_details_2040_no_return.jpg} {16.8.0_amda60_log.txt}

Expect Result:
Each failed image's 3 credits are returned and Credit Details shows 「Generation failed, credits returned」.

Note:
Device: Sony Xperia 10 III (XQ-BT52) / Android 12
Spec Link: AI Mini Drama PM spec (AI Mini Drama - PM Spec 20261021.pdf), Update board 6 (Error) board - https://www.figma.com/design/44RyrcOcWi2MvhGci9bO5F/AI-Mini-Drama?node-id=2016-2
Spec Link: AI Mini Drama Design spec, Storyboard board - https://www.figma.com/design/dZk5HLzZTdcZwWwvN9aZfZ/AI-Mini-Drama?node-id=116-7873
Related: DRA262610P0308 (5 of 6 storyboard images fail, only 2 refunds)
<Claude Reviewed>

## DRA262610P0416 (2026-10-30-a7)
PDR-A 16.8.0 - [AIAgent] AI Mini Drama: Video is priced below the charging sheet: Standard 30 s is 120 credits, not 390

Repro Steps:
1. Launch the APP
2. Tap AI Mini Drama on the Launcher
3. Tap History
4. Tap a drama at 「Choose your video settings」
5. Tap Best
6. Tap Standard
7. Tap Fast
8. Tap Full Video - 90 sec
9. Tap Best
10. Tap Standard
11. Tap Fast
12. Tap Preview - 30 sec
13. Tap Standard
14. Tap Generate video
15. Read the balance on the credit pill
16. Check the result

Result:
Preview 30 s: Best 120, Standard 120, Fast 60; Full 90 s: 360 / 360 / 180; charged as shown (Standard 4/s, Fast 2/s).
{16.8.0_amda61_preview_best.jpg} {16.8.0_amda61_preview_standard.jpg} {16.8.0_amda61_preview_fast.jpg} {16.8.0_amda61_full_standard.jpg} {16.8.0_amda61_log.txt}

Expect Result:
PDRM MX sheet: Standard 13/s (390 / 1170), Fast 4/s (120 / 360); Best 6/s (180 / 540) per PM 10/16 (no sheet row).

Note:
Device: Sony Xperia 10 III (XQ-BT52) / Android 12
Spec Link: PDRM MX spec, v1 ③ Credit Charging Table (action id) board (mx-a-right), linked sheet 「AI Mini Drama CMS」 › 「Action ID (not on CMS)」 (2026-10-20) - https://www.figma.com/design/3urWYejMUP2uaglb4s73M5/PDRM-MX?node-id=1057-24035
Spec Link: AI Mini Drama PM spec (AI Mini Drama - PM Spec 20261021.pdf), Main flow board - https://www.figma.com/design/44RyrcOcWi2MvhGci9bO5F/AI-Mini-Drama?node-id=2016-2
Related: DRA262610P0274 (Best and Standard quote the same credits)
Related: DRA262610P0032 (Cancelled)
<Claude Reviewed>

## DRA262610P0424 (2026-10-30-a7)
PDR-A 16.8.0 - [AIAgent][UI] AI Mini Drama: French copy: 「Crédits seront consommés」 lacks an article; 「Langage de la vidéo」

Repro Steps:
1. Set the phone's system language to Français (France)
2. Launch the APP
3. Tap AI Mini Drama on the Launcher
4. Tap Plus
5. Tap The Art of Falling
6. Tap Créer votre version
7. Read the format card
8. Tap Générer
9. Wait for the Create storyboard card
10. Check the result

Result:
The format card reads 「1. Langage de la vidéo」; the storyboard card reads 「Crédits seront consommés pour cette tâche.」
{16.8.0_amda69_langage.jpg} {16.8.0_amda69_credits_line.jpg}

Expect Result:
「1. Langue de la vidéo」 and 「Des crédits seront consommés pour cette tâche.」

Note:
Device: Sony Xperia 10 III (XQ-BT52) / Android 12
Spec Link: AI Mini Drama Design spec, Main flow board - https://www.figma.com/design/dZk5HLzZTdcZwWwvN9aZfZ/AI-Mini-Drama?node-id=116-7873
<Claude Reviewed>

<!-- missing: [] -->
