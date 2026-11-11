# pm-ui-2

Source: PM Figma https://www.figma.com/design/iWlQTjlmfykHfmlNvg9J4p/Batch-Editing?node-id=0-1 · board `pm-ui-2` · node 16:13767/pm-ui-2 · box x=6366 y=10604 w=9681 h=1196 (absolute Figma canvas points)
Figma text layer (inventory read 2026-11-09, figma-pm / qa1); no PDF export exists, so no OCR. Columns: y, x (absolute Figma canvas points), text (one line per text line); [phone] = inside a phone mockup.

```
 10636   6426  Batch Edit Room
 10676   6426  default
 10756   6856  【Requirement 】
 10771   6453  [phone] 9:41
 10790   6856  •長得像現在的 Edit Room，底部只有三個 button：Crop & Rotate / Adjustment / AI Enhance；點進去比照現在各 feature room [D1-11]
 10835   6856  •Top bar: Save 不變，最右是 Setting 按鈕 [D1-11]
 10888   6856  •photo Picker 進來先落在這個主畫面；button 順序：Crop & Rotate → Adjustment → AI Enhance [D1-01]
 10956   6856  • 縮圖列放主畫面，點縮圖切換照片；照片不能移除、也不能新增（縮圖沒有 ×） [D1-12][D1-09]
 11010   6856  • 右上存檔 → Saving k / N → Batch Save page [D5-01b]
 11070   6856  • 左上 Home：還沒做任何編輯 → 直接回 Launcher；有編輯 → Discard Dialog → Discard 後回 Launcher [D1-08]
 11130   6856  • 左上 Replace photo：還沒做任何編輯 → 直接回 Photo Picker 批次 Tab；有編輯 → Discard Dialog → Discard 後回 Photo Picker 批次 Tab。兩種都保留之前選過的照片，有編輯時丟掉這次 Batch Edit 的所有編輯 [D1-08][D1-08b]
 11198   6856  • 外層 Undo / Redo 也是每張照片各自一條：只作用在目前這張；從 room 按 ✓ 回來後，那次 room 對每張的修改在各自的歷史算一步 [DR-05][DR-05d]
 11266   6856  • AI Enhance 的 Undo / Redo：在單張照片按 Undo 可退回 Enhance 前，只退那一張；想拿回結果按 Redo。退回後若又對那張做了其他修改，Redo 會被清掉，Enhance 結果拿不回來（可再進 AI Enhance room 重新 Enhance） [DR-10b][DR-12e]
 11560   6469  [phone] Crop & Rotate
 11560   6577  [phone] Adjustment
 11560   6685  [phone] AI Enhance
```
