# adjust-default — Batch Edit Room · Adjustment · default (UI UX flow 2.pdf, text layer)
  12892 160 Batch Edit Room · Adjustment
  12932 160 default
  13012 590 【Requirement 】
  13028 200 9:41
  13049 590 • 比照 26'10/E Adjustment room，但不顯示 Subject Detection、不出現 AI
  13076 502 All
  13079 590 Exposure [D1-11][DR-03][DR-06]
  13117 590 • 右上「Apply to all」按鈕：icon＋「All」，半透明深底膠囊；一次性按鈕（同
  13147 590 PDR），不是勾選框：點擊後以目前選取的照片為來源，把這個 feature 的設定套
  13177 590 到其他照片 [DR-04]
  13207 590 • 套用後可點縮圖切換照片檢查或個別微調，微調只影響那一張 [DR-04]
  13237 590 • 修改後再按一次，以目前照片的最新設定重新套用到其他照片 [DR-04]
  13267 590 • 下方顯示批次縮圖列，點縮圖切換目前照片 [D1-12]
  13297 590 • 最外層 Batch Edit Room 有自己的 Undo / Redo [DR-05]
  13335 590 ◦ 例：第 1 張 Exposure +20 → 按 Apply to all → 12 張都 +20 → 切到第 3 張微調
  13365 590 Contrast +10（只有第 3 張）→ 回第 1 張改 Exposure +30 再按 → 其他張整組變成
  13395 590 跟第 1 張一樣，第 3 張的 Contrast +10 不保留 [DR-04][DR-04c]
  13433 590 • Room 內只有一組 Undo / Redo（一條共用歷史），依操作順序記錄兩種步驟：
  13463 590 ① Apply to all（一次調整多張）② 單張單個參數編輯 [DR-05][DR-05b]
  13493 590 • Undo / Redo 依序退回／重做最近一步：Apply to all → 所有照片一起；單張編
  13523 590 輯 → 只影響被編輯的那一張（不論目前選取哪張） [DR-05b]
  13553 590 • 切換照片不會清掉歷史 [DR-05e]
  13583 590 • Undo / Redo 的單張編輯不是目前選取的照片時，自動切到那張照片（縮圖列同
  13610 500 33
  13613 590 步選取），讓用戶看到變化 [DR-05h]
  13643 590 • ✕：丟掉這次進 room 後所有照片的修改（含 Apply to all） [DR-05c]
  13654 278 Light
  13654 334 Color
  13654 390 Details
  13673 590 • ✓：回 Batch Edit Room，這次 room 對每張的修改在該張的外層歷史算一步
  13699 590 [DR-05d]
  13721 590 • Undo / Redo 不會自動切換 tab（Light / Color / Details），同今天單張
  13738 181 Auto
  13738 243 Exposure
  13738 315 Contrast
  13738 383 Hightlight
  13738 461 Bright
  13738 525 MidTone
  13738 605 Dark
  13738 668 Shadows
  13751 590 Adjustment room [DR-05g]
