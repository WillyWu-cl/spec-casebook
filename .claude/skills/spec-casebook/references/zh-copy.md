# Chinese reading copy of a table

Every table can have a Traditional Chinese reading copy (user, 2026-11-11): `cases.zh-Hant.csv` beside an approved
table, `draft.zh-Hant.csv` in a draft. The 中文 switch of Cases, Results, Progress, Coverage and the exported
`cases.html` shows it in place of the English case text. The English table stays the source of truth: rows are
written, edited, reviewed and saved in English only, and the copy is rebuilt from them.

## Keeping it up to date

`scripts/zh-copy.ts` keeps a fingerprint of each row's English (`<copy>.prints.json`). A row whose English changed
since it was translated is **stale**: pages show its English until it is translated again, never an old translation.

```
node scripts/zh-copy.ts <product>/<feature> <ios|android> [--draft <id>] status
node scripts/zh-copy.ts <product>/<feature> <ios|android> [--draft <id>] export
# translate each zh-work/batch-NN.json into zh-work/batch-NN.out.json (below)
node scripts/zh-copy.ts <product>/<feature> <ios|android> [--draft <id>] merge
```

- Run it after a draft is built or changed (`--draft`) and after a Save changed rows: only new and changed rows are
  exported, so upkeep costs little. A draft's copy goes to the table on Save with its fingerprints.
- `export` fills in any text already translated anywhere in the library (the other platform's table, a repeated
  precondition), so translate one platform first, merge, then export the other: most of it is then free.
- Batches are about 9,000 English characters. Hand them to subagents on a cheaper model (Sonnet), a few batches each,
  with this file as the brief; the main session only runs `export` / `merge` and reads the warnings.
- `merge` warns when a 「」 UI string was dropped, the number of steps differs, or a field looks untranslated; fix those
  rows in the `.out.json` and merge again (`--keep` keeps `zh-work/`).
- An older copy built by a draft's `build-zh.ts` has no fingerprints: `adopt` once.

## Batch format

`batch-NN.json` holds `rules` and `rows`: each row has `ID`, `en` (English fields), `zh` (fields already known in
Chinese), `todo` (fields to translate) and, for a row whose English changed, `prev` (its older Chinese, to reuse
wording). Write `batch-NN.out.json` as `{ "<ID>": { "<field>": "<Chinese>", … }, … }` with **every** field of `en`:
the `zh` ones copied (improve one only when it plainly does not fit this row), the `todo` ones translated.

## How to translate

Write the way a Taiwanese QA tester would write the case for a colleague, not a translation of English sentences.
Read the whole row first (precondition, action, expected result and notes), understand what is being tested, then
say it in natural Chinese. Test: a Chinese reader who never sees the English understands it at once and it does not
sound translated.

- **Restructure, don't map words.** Reorder clauses into Chinese order (condition and time first, then the result);
  split long English sentences; drop English filler (「the」「a」, 「is shown」 as 「被顯示」). Prefer active verbs:
  `The Demo page opens` → 開啟 Demo 頁, not 「Demo 頁被開啟」; `Generate stays disabled until …` → 在……都選好之前，
  Generate 都不能按; `No warning shows yet` → 這時還不會跳出警告.
- **Taiwan wording:** 點 / 點選 (tap), 長按, 滑動, 畫面, 按鈕, 彈出視窗 / 跳出, 帳號, 登入, 影片, 相片 / 照片, 設定, 預設, 下載,
  上傳, 儲存, 網路, 訊息, 選單, 匯出, 載入中, 灰色（不能按）, 可以按. Never mainland terms (視頻, 屏幕, 點擊後彈窗, 賬號, 默認,
  設置, 信息, 加載, 保存 → 儲存).
- **Keep exactly:** every 「…」 UI string (the app's English UI, as the English shows it), quoted Figma frame names
  ("Exceed word limit"), IDs (TC-, R-, KP-, KF-, Q-, REQ-), eBug codes, file and board names, numbers, units, sizes and
  prices. Product and feature names stay English (PowerDirector, AI Mini Drama, Launcher, Pro+, Premium, Free).
- **Steps:** a numbered list stays numbered, one step per line, same numbers; a field that is not a list stays prose.
- **Notes:** spec-source notes ("Design 1005_Update … wins over PM §13.11") become short Chinese explanations with the
  sources kept as written: `Design 1005_Update 的「Exceed word limit」比 PM §13.11（10/2）新，以 Design 為準`.
- **Same thing, same words** within a table: one Chinese name per section (merge enforces it) and per recurring
  precondition; reuse the `zh` text you were given rather than rewording it.
- Punctuation: full-width （）：；，。 in Chinese text, half-width inside 「」, IDs and numbers.

Do not translate run results (What happened, Blocked because): they stay as recorded.
