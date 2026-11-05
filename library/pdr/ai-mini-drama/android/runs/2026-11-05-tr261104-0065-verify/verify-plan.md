# TR261104-0065 verify plan (REQ-093)

Build 16.8.0.2611041 (already installed, debuggable re-sign of the official APK, REQ-089), Samsung Galaxy A53
(SM-A5360, Android 15), Stage, Free account. Bugs: ETHAN_HSU's 11 on the TR's verify list (`bugs.md`); the expected
result for each comes from `spec-check.md` (today's spec, REQ-091).

## What each bug needs

| Bug | Starts from | Costs |
| --- | --- | --- |
| P0324 Surprise me repeats | empty Create Your Drama page | none (no send) |
| P0381 credit pill, no 「Leave this chat?」 | new chat, outline generating | 2 turns (idea, outline Generate) |
| P0326 Gender 「Other」 twice | character stage, Choose Character filter | none |
| P0328 Update characters card count | all characters set, no storyboard | 1 turn (+ Generate ◆4 optional) |
| P0332 typed name → no Update card | all characters set, no storyboard | 2 turns |
| P0354 no 「You'll have N left」 | Create storyboard card; video settings card | none |
| P0415 storyboard image refund | storyboard Generate with Wi-Fi off | 1 turn, ~15 credits, 30 min wait |
| P0350 sent message not moved to top | finished storyboard, any send | shares P0388's send |
| P0388 failed update images keep 6 credits | finished storyboard, update with Wi-Fi off | 2 turns, ~6 credits, wait |
| P0416 video prices | video settings card | none to read; one 30-s preview to check the charge (allowed, not a full video) |
| P0424 French copy | system language French, template chat | 2–3 turns; system setting |

## One journey (order)

Drama 1, new chat in English, carries 10 of the 11 bugs:
1. Create Your Drama: Surprise me ×5 → **P0324**. Clear the box, type the idea.
2. Send idea, Generate the outline; while 「Thinking…」 tap the credit pill → **P0381**; Back, stay in the chat.
3. Character stage: open a slot › filter › Gender → **P0326**; pick looks for every slot, ✓.
4. All set, no storyboard: send 「Make <name> a woman in her 40s」 → **P0328** (card count; Generate it).
   Send 「Can you change one of the characters to look older?」, type the name → **P0332**.
5. Create storyboard card: read under Generate → **P0354** (storyboard). Note balance; Generate, Wi-Fi off 30 s,
   on → **P0415** (failed images, their text). Start the 30-min refund clock.
6. Finished storyboard: send 「Make Scene 2 and Scene 4 heavy rain」 and watch the scroll → **P0350**; Generate,
   Wi-Fi off 1 min, on → **P0388** (「!」, message, Edit). Start its refund clock.
7. Video settings card: under Generate → **P0354** (video); read every quality × length price → **P0416**; generate
   one 30-s Standard preview only if the quote matches today's spec, to check the charge.
8. After 30 min: credit pill › Details → refunds for **P0415** and **P0388**.

Then, last, with the user's go-ahead: system language French → template 「The Art of Falling」 › Créer votre
version › format card › Générer → storyboard card → **P0424**; language back to English.

About 12–14 chat turns and about 30 credits plus one preview (Free limit: the app counted 19–22 turns before
「Daily Free Chat Limit Reached」 today, and it is reached on this phone now).

## After segment 1 (15:05)

Drama 1 「Stormbound」 (finished storyboard) done for P0324, P0381 (Stay), P0326, P0328, P0332, P0354 (storyboard).
P0415 missed: storyboard order is six location images → TTS preview → six scene images within ~3 s, so Wi-Fi must go
off right after the TTS charge. Revised order:
- **Segment 2, 「Stormbound」:** step 6 (P0350 + P0388, Wi-Fi off right after the update's image charge), step 7
  (P0354 video, P0416 prices).
- **Segment 3, drama 2 (new, English):** a throwaway chat first for P0381 Leave anyway (outline generating › credit
  pill › Leave anyway › My Credits, nothing in History); then a new drama › characters › P0332 retry, answering
  Iris's question in full (name and age) › Create storyboard › Wi-Fi off right after the TTS charge → P0415.
- **Segment 4:** French P0424 (template, up to the Create storyboard card), English back; then the refund check for
  P0388 / P0415 (≥ 30 min after their failures).
