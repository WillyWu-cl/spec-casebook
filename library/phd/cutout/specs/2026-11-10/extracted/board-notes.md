# Cutout — board notes (spec set 2026-11-10)

Spec files (from 「Cutout with Stroke.zip」, folder 「26'11/E Add reset/undo」):
- `Cutout Reset Undo Redo Spec 11E.pdf` — one page, 4439 × 3124 pt, dark canvas. PM-style requirement page for the
  11/E release (「【Requirement】Cutout add reset / undo / redo button」, an open-items table with owners). Newest source.
- `Cutout UI UX flow (before 11E).pdf` — one page, 1034 × 1142 pt: the Cutout page and the Background room as they
  were before 11/E. Older than the 11/E page; used only for what the 11/E page does not redraw.

Read from the PDF text layer (clean, Chinese included) and renders of every region; no OCR (Windows machine).
The 11/E PDF holds one link (Design 2025/09 reference, Figma `162:1211`), read on 2026-11-10 (`links.json`,
`design-2025-09-reference.md`). Neither PDF links to its own Figma boards, so the analysis is PDF-only for them
(`figma-pending.json`).

## pm-11e-buttons — scope, room mockup, button states

- Scope line (top): 「範圍：只管 Cutout room 內的編輯紀錄（Background + Stroke 共用一條），離開 room（✕ / ✓）即清空」 — only
  the Cutout room's edit history; Background and Stroke share one history; leaving the room (✕ / ✓) clears it.
- Title: 「【Requirement】Cutout add reset / undo / redo button」. 「參考過去 Design 2025/09 spec: link」 (read, older).
- ➊ add button: reset, undo, redo.
- Room mockup (iPhone): canvas (transparent checkerboard behind the cutout people), an edit (pencil) button at the
  canvas' bottom-left, tabs 「Background」 (selected, orange) and 「Stroke」, chips 「Solid」 (selected) / Wall / Romantic /
  Blue / Summer / Romant…, item row: ∅ (none), transparent (selected, orange frame), import-photo icon, colour wheel
  (palette), white, black… Bottom bar left to right: ✕, Reset (circular arrow), Undo (←), Redo (→), ✓.
- ❷ 「Cutout Reset / Undo / Redo 按鈕狀態定義（灰＝disabled）」 — five drawn states:
  1. ① 剛進入 room（目前＝初始狀態）: Reset ✗ Undo ✗ Redo ✗
  2. ② 做了任一操作後: Reset ✓ Undo ✓ Redo ✗
  3. ③ Undo 後，尚未回到初始狀態: Reset ✓ Undo ✓ Redo ✓
  4. ④ Undo 到底（回到初始狀態）: Reset ✗ Undo ✗ Redo ✓
  5. ⑤ 按下 Reset 後: Reset ✗ Undo ✓ Redo ✗ — note: 「Reset 本身算一步，所以 Undo 可用；Reset 會清空 Redo 紀錄」.
  ✕ and ✓ are always drawn enabled.

### Controls (PDF-read) — Cutout room
| Control | What it does |
|---|---|
| ✕ (bottom bar) | Leaves the room; history cleared (flow board: arrow to the Cutout page) |
| Reset | Back to the state on entering the room, incl. cutout style; a step; clears Redo; switches to Background tab |
| Undo | Reverts the last step; switches to the step's tab |
| Redo | Re-applies the last undone step; switches to the step's tab |
| ✓ (bottom bar) | Leaves the room, flattens the image; history cleared (arrow to the Cutout page) |
| Edit (pencil, canvas) | Opens the edit cutout page (Cutout page); the round trip is not a step |
| Tab 「Background」 / 「Stroke」 | Switch panel; not a step |
| Chips Solid / Wall / Romantic / Blue / Summer … | Switch category; not a step |
| Item ∅ (none) / transparent / white / black / solid colours | Choose a solid background; a step on tap |
| Item import photo | Import a photo as background; a step when the photo is applied |
| Item colour wheel | Opens the colour palette; a step when confirmed or closed, not while dragging |
| Template items (TRY badge, download arrow) | Apply a template background; a step when applying completes |
| Stroke colour swatches / style thumbnails | A step on tap |
| Stroke thickness slider (value 33) | A step on finger-up |
| Cutout object on the canvas | Select (not a step), rotate (step on finger-up), flip (step on tap) |

## pm-11e-logic — 1. undo / redo 邏輯 (operation table)

Columns: # · 操作 · 是否記為一步 · 記錄時機 · Undo 後狀態.

| # | Operation | Step? | Recorded when | After Undo |
|---|---|---|---|---|
| 1 | 選擇純色背景 (solid background) | 是 | 點選當下 (on tap) | 回到前一個背景，panel 選中框同步移回 |
| 2 | 選擇模板背景（Wall／Romantic…） | 是 | 套用完成時 (when applying completes) | 同上 |
| 3 | 匯入照片當背景 | 是 | 照片套用到畫布時 | 照片從畫布移除，回到前一個背景 |
| 4 | 色盤選色 | 是 | 確認或關閉色盤時（拖動中不記錄） | 回到選色前的背景 |
| 5 | Stroke 樣式／顏色 | 是 | 點選當下 | 回到前一個 stroke 設定 |
| 6 | Stroke 粗細 slider | 是 | 手指放開時（拖動中不記錄） | 回到拖動前的數值 |
| 7 | Rotate cutout 物件 | 是 | 手指放開時（旋轉中不記錄） | 回到旋轉前的角度 |
| 8 | Flip cutout 物件 | 是 | 點擊當下 | 回到 flip 前的方向 |
| 9 | Reset | 是 | 點擊當下 | 回到 reset 前的狀態（含 cutout 樣式） |
| 10 | click edit button → Cutout page 再返回 | 否 | — | 不受影響（由 edit cutout page 自己的 undo 管理；Reset 會一併還原） |
| 11 | 在畫布上選取 cutout 物件 | 否 | — | — |
| 12 | 切換 Background／Stroke tab | 否 | — | — |
| 13 | 切換分類 chip（Solid／Wall…） | 否 | — | — |
| 14 | 橫向捲動素材列 | 否 | — | — |
| 15 | 點選已選中的項目 | 否 | — | — |

The board's numbering jumps from 「1.」 to 「5. 待決事項」: sections 2–4 are not in the export (Q-5).

## pm-11e-open — 5. 待決事項

| # | Question | Decision | Status | Owner |
|---|---|---|---|---|
| Q3 | 步數上限 | 請 RD 確認 | 待決 | RD |
| Q7 | Reset 是否還原 edit cutout page 的修改？ | 還原；否則使用者可能卡住，無法繼續 undo / redo | 已決 | — |

## pm-11e-crosstab — Flow：跨 tab Undo

- Rule: 「undo / redo 的變更不在目前 tab 時，自動切到該變更所在的 tab，讓使用者看到變化」.
- Phone 0 (dark): the Cutout page — Auto / Box (selected) / Circle / Brush / Eraser, bottom bar ✕, reset, undo, redo,
  「Cuto…」 (the Cutout button, greyed). Pink arrows from C's ✕ and ✓ run back to this page.
- A. 「Background tab (default locate)」: steps 「編輯 ① → 編輯 ② → locate ③」: ① 選 Wall 背景（Background tab）,
  ② 調整 Stroke（Stroke tab）, ③ locate 回 Background tab. Wall chip selected, a template selected; a slider (33) is
  drawn above the tabs on A and B; Undo highlighted.
- 「按 Undo」 → B. 「B. 按 Undo → 復原 ②」: 復原 ②「調整 Stroke」 → 變更在 Stroke tab，自動切到 Stroke tab. B shows the
  Stroke tab: colour swatches (rainbow, transparent, black, white, orange, yellow, green, cyan, blue, purple) and style
  thumbnails.
- 「再按 Undo」 → C. 「C. 再按 Undo → 復原 ①」: 復原 ①「選 Wall 背景」 → 變更在 Background tab，自動切回 Background tab →
  已回到初始狀態：Reset、Undo disabled. C shows Solid chip, transparent item selected, checkerboard canvas; Redo
  enabled.

## pm-11e-rules — 【Requirement】【按鈕行為】【其他情境】

【Requirement】
- Background 和 Stroke 共用同一條紀錄.
- 不在目前 tab 時，user click undo / redo 會自動切到該變更所在的 tab.
  - 例：在 C 按 Redo → 重做 ①「選 Wall 背景」→ 留在 Background tab，再按 Redo → 重做 ②「調整 Stroke」→ 自動切到 Stroke tab.
- undo / redo / reset 需包含 edit cutout page 的修改（cutout 樣式）.
- 離開 room（✕ 或 ✓）後，壓平圖片處理，紀錄全部清空.

【按鈕行為】
- Undo — 行為：復原上一步，包含 edit cutout page 的修改（cutout 樣式），畫布和 panel 選中狀態同步更新. Enabled：有可以 undo
  的步驟. Disabled：沒有任何步驟.
- Redo — 行為：重做最近一次被 undo 的步驟，包含 edit cutout page 的修改（cutout 樣式）. Enabled：有被 undo 的步驟.
  Disabled：沒有被 undo 的步驟（undo 後做了新操作，紀錄即清空）.
- Reset — 行為：回到進入 room 時的狀態（不是原始照片），包含 edit cutout page 的修改（cutout 樣式），避免 user 卡住無法繼續
  undo / redo. Enabled：目前狀態（含 cutout 樣式）和初始狀態不同. Disabled：目前狀態（含 cutout 樣式）和初始狀態相同.
  一旦 user click reset，自動切到 Background tab.

【其他情境】
- 模板還在下載中就按 undo：取消這次套用；下載完成後也不自動套用.
- 匯入照片後又 undo：照片從畫布移除，仍保留在「最近使用」.
- 步數達到上限：最舊的步驟會被捨棄，使用者沒有感知.

## uiux-before-11e — UI UX flow (before 11/E)

- Cutout page (dark): tools Auto / Box (selected) / Circle / Brush / Eraser, a compare button at the canvas'
  bottom-right, bottom bar ✕, reset, undo, redo, 「Cutout」 (greyed until a selection is made). Unchanged by 11/E.
- Background room (before): canvas with info (ⓘ) and edit (pencil) buttons, tabs 「Background」 / 「Template」, chips
  Favorite / Trendy / Back to School / Smoke / Tennis / Natu…, an add-image item then TRY thumbnails (download
  arrows), bottom bar ✕ and ✓ only (no reset / undo / redo). A 「Collag e」 label is cut off at the bottom.
- Superseded by the 11/E room (tabs Background / Stroke; reset / undo / redo added). Only the Cutout page and the
  entry from it are taken from here.
