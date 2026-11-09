# room-default — Batch Edit Room · default (UI UX flow 2.pdf, text layer)
  10514 160 Batch Edit Room
  10554 160 default
  10634 590 【Requirement 】
  10649 201 9:41
  10671 590 •長得像現在的 Edit Room，底部只有三個 button：Crop & Rotate / Adjustment
  10701 590 / AI Enhance；點進去比照現在各 feature room [D1-11]
  10731 590 •Top bar: Save 不變，最右是 Setting 按鈕 [D1-11]
  10769 590 •photo Picker 進來先落在這個主畫面；button 順序：Crop & Rotate →
  10799 590 Adjustment → AI Enhance [D1-01]
  10837 590 • 縮圖列放主畫面，點縮圖切換照片；照片不能移除、也不能新增（縮圖沒有 ×）
  10863 590 [D1-12][D1-09]
  10891 590 • 右上存檔 → Saving k / N → Batch Save page [D5-01b]
  10921 590 • 左上 Home：還沒做任何編輯 → 直接回 Launcher；有編輯 → Discard Dialog
  10951 590 → Discard 後回 Launcher [D1-08]
  10981 590 • 左上 Replace photo：還沒做任何編輯 → 直接回 Photo Picker 批次 Tab；有編
  11011 590 輯 → Discard Dialog → Discard 後回 Photo Picker 批次 Tab。兩種都保留之前選
  11041 590 過的照片，有編輯時丟掉這次 Batch Edit 的所有編輯 [D1-08][D1-08b]
  11079 590 • 外層 Undo / Redo 也是每張照片各自一條：只作用在目前這張；從 room 按 ✓
  11109 590 回來後，那次 room 對每張的修改在各自的歷史算一步 [DR-05][DR-05d]
  11147 590 • AI Enhance 的 Undo / Redo：在單張照片按 Undo 可退回 Enhance 前，只退那
  11177 590 一張；想拿回結果按 Redo。退回後若又對那張做了其他修改，Redo 會被清掉，
  11207 590 Enhance 結果拿不回來（可再進 AI Enhance room 重新 Enhance） [DR-10b][DR-12e]
  11436 214 Crop & Rotate
  11436 331 Adjustment
  11436 440 AI Enhance
