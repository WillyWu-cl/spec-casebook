# Credits in AI Mini Drama

## KF-040 What the ledger books
- kind: fact · platform: ios · use: run, ebug · tags: credits, ledger
- source: exploration KB ai-mini-drama.md (2026-10-07, 16.9.0 189399)

The ledger has no 「AI Mini Drama」 row (DRI261894P0021): each image is 「Text to Image」 −3, each voice 「Text to
Speech」 −1, video 「AI Video Generator」 −N; a ◆4 character is one of each.

## KF-041 No consume confirmation; debit may differ from the button
- kind: risk · platform: ios · use: analysis, run · tags: credits
- source: exploration KB ai-mini-drama.md (2026-10-07, 16.9.0 189399; 2026-10-15, 189631)

Every spend charges on the first tap with no 「Consume credits?」 dialog (MX/Design want one; DRI261893-0130). Debits
ran 1 below the button (◆4 → −3, ◆25 → −24), not explained. A rejected (moderated) character keeps a 1-credit voice
charge (DRI261894P0023). Compare each button with its `[AIDrama Permission]` line.

## KF-042 Free daily chat limit
- kind: rule · platform: ios · use: analysis, run · tags: quota, tier · authority: observed
- source: exploration KB ai-mini-drama.md (2026-10-08 MX, 16.9.0 189482)

Free users get 10 chats a day, counted app-side; once used, Generate shows 「Daily Free Chat Limit Reached」 with only
「Upgrade to Premium」 (no ✕, DRI261894P0022). The paid-tier dialog is 「Today's AI Chats Are Used Up」 /
「Continue Tomorrow」. Earlier runs the same day use up the quota unless Unlimited daily chat is on.

## KF-043 Free tier and Full Edit export
- kind: risk · platform: ios · use: analysis, run · tags: tier, export, captions
- source: exploration KB ai-mini-drama.md (2026-10-15 New User, 16.9.0 189631)

On Free, Full Edit › Export is blocked as premium 「Auto Captions」 for the drama's own captions, while the result
page's Export Full Video passes (DRI261896P0015). Export both ways on Free with captions on.

## KF-056 Credit prices come from the Credit System forms
- kind: rule · platform: both · use: analysis, run, ebug · tags: credits, price, video, image, tts · authority: spec
- source: user 2026-11-06 (chat, REQ-103): ECL Credit System 「Publish Feature List」 forms 22937582357, 22850755605, 21703885589, 22632766997, 22833510933 (`https://ecl.cyberlink.com/IF3/eclcom/BPM/FormView/<form no>`) · verified: Android 16.8.0.2611041 (2026-11-05); the Full Video quote is 4 higher, the reference audio (KF-058)

AI Mini Drama prices follow these forms, not the MX ③ charging sheet (REQ-059): Seedance 2.5 (Best) 6, Seedance 2.0
(Standard) 4, Seedance 2.0 Mini (Fast) 2 credits per second at 480p (Mini 720p 4); each image (character, Location,
scene, regenerate) 3; Text to Speech 1 per 1000 characters. A character is ◆4 (image + voice sample); a storyboard is
3 per image + 1. Discounts: none in the forms (held).

## KF-057 Credit System action ids
- kind: fact · platform: both · use: analysis, run, ebug · tags: credits, logs, action-id
- source: user 2026-11-06 (chat, REQ-103): the same Credit System forms (KF-056)

No `_normal` / `_discount` suffix: images `genimage_1_img_openai_gptimage2.5sunburst_<none|enable>_1k_aiminidrama`
(22632766997, Android, iOS); voice samples `genaudio_1000_char_google_gemini3.8flash` (22833510933, Android); video
`genvideo_1_sec_bytedance_seedance2.5std_<none|enable>_480p_aiminidrama` (22937582357, Android),
`…seedance2.0std_enable_480p_aiminidrama` (22850755605, Android), `…seedance2.0mini_<none|enable>_480p` (21703885589, Text to Video, iOS and Android).

## KF-058 Full Video adds 4 credits for the reference audio
- kind: rule · platform: both · use: analysis, run, ebug · tags: credits, price, video, audio · authority: observed
- source: RD's comments relayed by the user 2026-11-06 (chat, 「這些是rd給我的comment」, REQ-103): 「4點應該是生reference audio的點數」 and 「30s的應該前面生角色場景的地方生過了，所以不用重生」; no Credit System form names it yet · verified: Android 16.8.0.2611041 (2026-11-05)

A Full Video quote is 90 s × the per-second rate (KF-056) plus 4 credits for generating the reference audio: Best /
Standard / Fast ◆544 / ◆364 / ◆184. Preview • 30 sec has no such charge (◆180 / ◆120 / ◆60): its reference audio was already
generated at the character / scene step, so it is not generated again.
