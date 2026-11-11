# 【Requirement】Cutout add reset / undo / redo button (scope, room mockup, button states)

Source: Cutout Reset Undo Redo Spec 11E.pdf · board `pm-11e-buttons` · region x=0 y=0 w=1500 h=1450 (PDF points)
PDF text layer (mupdf structured text; the text layer reads cleanly and this Windows machine has no macOS Vision OCR, so no OCR). Columns: y, x (canvas points), text.

```
   103    100  範圍：只管 Cutout room 內的編輯紀錄（Background + Stroke 共用一條），離開 room（✕ / ✓）即清空
   179    579  【Requirement】Cutout add reset / undo / redo button
   206    135  9:41
   251    579  參考過去 Design 2025/09 spec: link
   311    579  ➊ add button
   341    651  reset
   371    651  undo
   401    651  redo
   461    579  ❷ Cutout Reset / Undo / Redo 按鈕狀態定義（灰＝disabled）
   542    606  ① 剛進入 room（目前＝初始狀態）
   594   1005  Reset ✗　Undo ✗　Redo ✗
   692    606  ② 做了任一操作後
   744   1005  Reset ✓　Undo ✓　Redo ✗
   801    217  Background
   801    318  Stroke
   841    128  Solid
   841    182  Wall
   841    232  Romantic
   841    310  Blue
   841    361  Summer
   841    433  Romantic
   841    511  Blue
   842    606  ③ Undo 後，尚未回到初始狀態
   870    521  TRY
   870    581  TRY
   894   1005  Reset ✓　Undo ✓　Redo ✓
   992    606  ④ Undo 到底（回到初始狀態）
  1044   1005  Reset ✗　Undo ✗　Redo ✓
  1142    606  ⑤ 按下 Reset 後
  1194   1005  Reset ✗　Undo ✓　Redo ✗
  1302    606  ⑤ Reset 本身算一步，所以 Undo 可用；Reset 會清空 Redo 紀錄
```
