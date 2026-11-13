# Image to Video: Background Sound info icon — requirements (android)
Spec: I2V BGM info icon - PM Figma 14451-2196.md (spec set 2026-11-11, Figma only: PM file UX-Issues, page 「26 11E UIUX Revamp」, block 「Image to Video: add info icon (why BGM setting cannot be changed)」, section 14451:2197; context block from section 14627:1319 「11/E 改為 TBD 項目」)
Read from the Figma text layer (get_metadata) and the section screenshots; the control inventory is owed (figma-pending.json: use_figma refused, Full seat). No Design or MX file was supplied; the mockups are iPhone frames and their strings are the expected UI text.

## Info icon and tooltip
- R-001 [PM:pm-i2v-info] In an Image to Video template's settings panel, 「Generate Background Sound」 has an info icon (ⓘ) right after the label; the panel keeps 「Duration」, 「Video Quality」 and 「Generate Background Sound」 with ✕ and ✓ as today.
- R-002 [PM:pm-i2v-info] Tapping the info icon shows a tooltip reading exactly 「Sound support varies by template.」, drawn just above the icon and pointing at it.
- R-003 [PM:pm-i2v-info; PM:pm-i2v-template-config] The info icon and its tooltip are shown on every template's panel, both where the user can switch Background Sound (templates by CL designers / Vidu) and where it is locked (Kling templates): the icon explains why the setting cannot always be changed (heading: 「why BGM setting cannot be changed」).
- R-004 [PM:pm-i2v-info] The tooltip closes again without changing any setting, and the panel stays usable after it (how it closes is Q-1).

## Background Sound by template (25'6/E rule the icon explains)
- R-010 [PM:pm-i2v-template-config] Templates by CL designers / Vidu: 「Generate Background Sound」 defaults to 「Off」.
- R-011 [PM:pm-i2v-template-config] Templates by CL designers / Vidu: only when the user chooses 「On」 is background music (BGM from the CMS) added to the generated video; with 「Off」 the video gets no added BGM.
- R-012 [PM:pm-i2v-template-config] Background Sound is not carried from one template to another (「不連動，by 各 template 設定」): each template opens with its own setting, not the value chosen on the template used before.
- R-013 [PM:pm-i2v-template-config] Kling templates: 「Generate Background Sound」 defaults to 「On」 and 「Off」 cannot be chosen (drawn disabled).
- R-014 [PM:pm-i2v-template-config] Kling templates: tapping a disabled option in the panel shows the toast 「To achieve the best results, this template's settings are limited.」 and the setting stays as it was.
- R-015 [PM:pm-i2v-template-config] Custom does not support music generation (「Custom 不需支援音樂生成」): the Custom settings show no 「Generate Background Sound」 option and so no info icon.
- R-016 [PM:pm-i2v-template-config] 【Requirement - for iOS】 the iOS toast logic is to follow Android (TBD). — NOT TESTABLE: iOS only, and moved to TBD; this Android table checks the Android toast (R-014) it refers to.

## Flow arrows
None drawn on these boards (arrows.json is empty).

## Open questions
- Q-1 The spec draws the tooltip open but not how it closes (tap outside, tap the icon again, a timeout, Android system Back). Assumption: a tap anywhere outside the tooltip closes it and system Back closes the tooltip first; the rows record what each way does. R-004; TC-003, TC-004.
- Q-2 The template-config rules (R-010 – R-015) sit in the section 「11/E 改為 TBD 項目」 as the 25'6/E spec the iOS change should copy (「比照 Android 目前處理」). Assumption: they describe Android's current behaviour, so the Android rows check them as they are; a difference is asked about, not filed, until PM confirms. R-010 – R-015; TC-006 – TC-011.
- Q-3 Custom has its own sound setting today (「Generate Sound by AI」 on models that support it). The spec only says Custom needs no music generation. Assumption: Custom shows no 「Generate Background Sound」 and no new info icon; 「Generate Sound by AI」 is unchanged and not part of this table. R-015; TC-012.
- Q-4 A template's type (CL designers, Vidu or Kling) is not shown in the app. Assumption: a template whose 「Off」 can be chosen stands for CL designers / Vidu, and a template whose 「Off」 is disabled stands for Kling; RD names one of each if both are needed. R-003, R-010, R-013; TC-001, TC-005.

## Added 2026-11-11 — coverage passes and standing inputs
### System back
- I2V template settings panel with the tooltip open: TC-004 (Q-1: the tooltip closes first, the panel stays).
- I2V template settings panel: n/a (unchanged by this spec; the panel's ✕ / ✓ and system Back behave as today).
- Kling toast: n/a (a toast takes no input).

### Hidden clauses
Pass 9: each clause the screen does not show, how a tester observes it and the rows.

| Requirement | Hidden clause | Observed through | Rows |
|---|---|---|---|
| R-011 | BGM is fetched from the CMS only when 「On」 is chosen | Playing the generated video with sound on: background music with On, none added with Off | TC-008, TC-009 |

### Variants
Pass 10: one line per variant.

| Requirement | Variant | Rows |
|---|---|---|
| R-003 | Template where Background Sound can be switched (CL designers / Vidu) | TC-001, TC-002 |
| R-003 | Kling template (Off disabled) | TC-005 |
| R-011 | Background Sound On | TC-008 |
| R-011 | Background Sound Off | TC-009 |

### Domain rules
Every applicable spec / team rule of knowledge.md.

| Entry | Requirements |
|---|---|
| KP-012 Android has one paid mode: VIP = Pro = paid user | n/a (other feature or flow: not part of the Image to Video template settings panel or its Background Sound setting) |
| KP-014 AI Exposure is paid-only | n/a (other feature or flow: not part of the Image to Video template settings panel or its Background Sound setting) |
| KP-015 Mine refreshes entitlement after buying Premium | n/a (other feature or flow: not part of the Image to Video template settings panel or its Background Sound setting) |
| KP-016 A one-time free trial is consumed at once | n/a (other feature or flow: not part of the Image to Video template settings panel or its Background Sound setting) |
| KP-017 Credit Detail lists every AI use with feature name and amounts | n/a (other feature or flow: not part of the Image to Video template settings panel or its Background Sound setting) |
| KP-018 Credit Auto Pass keeps its own name in the Detail | n/a (other feature or flow: not part of the Image to Video template settings panel or its Background Sound setting) |
| KP-019 A burst of Generate taps charges once | n/a (Generate is unchanged by this spec; TC-008 / TC-009 generate once each) |
| KP-020 Blue credit button opens Buy Credit | n/a (the credit button on the I2V page is unchanged by this spec) |
| KP-021 Premium chat quota is higher, not unlimited | n/a (other feature or flow: not part of the Image to Video template settings panel or its Background Sound setting) |
| KP-024 Finished AI images save to their feature tab | n/a (videos, and where results are saved is unchanged) |
| KP-025 AI Exposure results go to Recent and the AI Exposure tab | n/a (other feature or flow: not part of the Image to Video template settings panel or its Background Sound setting) |
| KP-026 History button opens the feature's Artwork tab | n/a (other feature or flow: not part of the Image to Video template settings panel or its Background Sound setting) |
| KP-027 New features' works reach Recent | n/a (other feature or flow: not part of the Image to Video template settings panel or its Background Sound setting) |
| KP-028 Empty Artwork filter shows Nothing yet | n/a (other feature or flow: not part of the Image to Video template settings panel or its Background Sound setting) |
| KP-029 Long-task tiles and completion notifications | n/a (other feature or flow: not part of the Image to Video template settings panel or its Background Sound setting) |
| KP-030 Saved output matches the last preview | n/a (other feature or flow: not part of the Image to Video template settings panel or its Background Sound setting) |
| KP-032 Features opened from Edit Room get the edited image | n/a (other feature or flow: not part of the Image to Video template settings panel or its Background Sound setting) |
| KP-033 Banners and deep links preselect the linked style | n/a (other feature or flow: not part of the Image to Video template settings panel or its Background Sound setting) |
| KP-034 Discover tip bubble lifecycle | n/a (other feature or flow: not part of the Image to Video template settings panel or its Background Sound setting) |
| KP-035 AI Replace: reference image or prompt enables Next | n/a (other feature or flow: not part of the Image to Video template settings panel or its Background Sound setting) |
| KP-036 A custom prompt reaches the generator | n/a (other feature or flow: not part of the Image to Video template settings panel or its Background Sound setting) |
| KP-037 AI Try-On: no face check on clothing or pets | n/a (other feature or flow: not part of the Image to Video template settings panel or its Background Sound setting) |
| KP-038 AI Group Shot photo picking | n/a (other feature or flow: not part of the Image to Video template settings panel or its Background Sound setting) |
| KP-039 Agent job finished in background shows on return | n/a (other feature or flow: not part of the Image to Video template settings panel or its Background Sound setting) |
| KP-040 Crop tabs keep one consistent state | n/a (other feature or flow: not part of the Image to Video template settings panel or its Background Sound setting) |
| KP-041 Undo, Redo and Reset | n/a (other feature or flow: not part of the Image to Video template settings panel or its Background Sound setting) |
| KP-042 Restored state restores highlight and transform together | n/a (other feature or flow: not part of the Image to Video template settings panel or its Background Sound setting) |
| KP-043 Video Editing template titles keep their look | n/a (other feature or flow: not part of the Image to Video template settings panel or its Background Sound setting) |
| KP-044 Video Editing panels: X discards, V commits | n/a (other feature or flow: not part of the Image to Video template settings panel or its Background Sound setting) |
| KP-045 Audio Range Select close target | n/a (other feature or flow: not part of the Image to Video template settings panel or its Background Sound setting) |
| KP-046 Try-On / Hairstyle Back keeps the style | n/a (other feature or flow: not part of the Image to Video template settings panel or its Background Sound setting) |
| KP-047 Masks survive returning from Artwork or Store | n/a (other feature or flow: not part of the Image to Video template settings panel or its Background Sound setting) |
| KP-048 Arabic may keep Western digits | n/a (other feature or flow: not part of the Image to Video template settings panel or its Background Sound setting) |
| KP-049 Localised strings keep their placeholders | n/a (other feature or flow: not part of the Image to Video template settings panel or its Background Sound setting) |
| KP-050 RTL mirrors layout, not only text | n/a (other feature or flow: not part of the Image to Video template settings panel or its Background Sound setting) |

### Request ledger coverage
Every open table entry of requests.md for android.

| Ledger entry | Requirements |
|---|---|
| REQ-001 | R-001 – R-016 (the whole table) |
| REQ-002 | n/a (platform scope: this Android table only) |
