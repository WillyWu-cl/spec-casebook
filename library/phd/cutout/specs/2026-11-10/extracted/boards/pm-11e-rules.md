# 【Requirement】【按鈕行為】【其他情境】

Source: Cutout Reset Undo Redo Spec 11E.pdf · board `pm-11e-rules` · region x=2480 y=1850 w=1959 h=1274 (PDF points)
PDF text layer (mupdf structured text; the text layer reads cleanly and this Windows machine has no macOS Vision OCR, so no OCR). Columns: y, x (canvas points), text.

```
  1872   2520  【Requirement】
  1938   2553  Background 和 Stroke 共用同一條紀錄
  1971   2553  不在目前 tab 時，user click undo / redo 會自動切到該變更所在的 tab
  2004   2586  例：在 C 按 Redo → 重做 ①「選 Wall 背景」→ 留在 Background tab，再
  2037   2586  按 Redo → 重做 ②「調整 Stroke」→ 自動切到 Stroke tab
  2070   2553  undo / redo / reset 需包含 edit cutout page 的修改（cutout 樣式）
  2103   2553  離開 room（✕ 或 ✓）後，壓平圖片處理，紀錄全部清空
  2169   2520  【按鈕行為】
  2235   2553  Undo
  2268   2586  行為：復原上一步，包含 edit cutout page 的修改（cutout 樣式），畫布和
  2301   2586  panel 選中狀態同步更新
  2334   2586  Enabled：有可以 undo 的步驟
  2367   2586  Disabled：沒有任何步驟
  2433   2553  Redo
  2466   2586  行為：重做最近一次被 undo 的步驟，包含 edit cutout page 的修改（cutout
  2499   2586  樣式）
  2532   2586  Enabled：有被 undo 的步驟
  2557   2498  TRY
  2565   2586  Disabled：沒有被 undo 的步驟（undo 後做了新操作，紀錄即清空）
  2631   2553  Reset
  2664   2586  行為：回到進入 room 時的狀態（不是原始照片），包含 edit cutout page 的
  2697   2586  修改（cutout 樣式），避免 user 卡住無法繼續 undo / redo
  2730   2586  Enabled：目前狀態（含 cutout 樣式）和初始狀態不同
  2763   2586  Disabled：目前狀態（含 cutout 樣式）和初始狀態相同
  2796   2586  一旦 user click reset，自動切到 Background tab
  2862   2520  【其他情境】
  2895   2520  • 模板還在下載中就按 undo：取消這次套用；下載完成後也不自動套用
  2928   2520  • 匯入照片後又 undo：照片從畫布移除，仍保留在「最近使用」
  2961   2520  • 步數達到上限：最舊的步驟會被捨棄，使用者沒有感知
```
