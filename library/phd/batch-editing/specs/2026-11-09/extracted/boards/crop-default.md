# crop-default — Batch Edit Room · Crop & Rotate · default (UI UX flow 2.pdf, text layer)
  11708 160 Batch Edit Room · Crop & Rotate
  11748 160 default
  11828 590 【Requirement 】
  11843 200 9:41
  11865 590 • 畫面比照現在的 Crop & Rotate room，panel 不含上方 title bar [D1-11][DR-03]
  11892 502 All
  11903 590 • 右上「Apply to all」按鈕：icon＋「All」，半透明深底膠囊；一次性按鈕
  11933 590 （sync PDRM apply to all 作法）：點擊後以目前選取的照片為來源，把這個
  11963 590 feature 的設定套到所有其他照片 [DR-04]
  11993 590 • 套用後可點縮圖切換照片檢查或個別微調，微調只影響那一張 [DR-04]
  12023 590 • 修改後再按一次，以目前照片的最新設定重新套用到其他照片，批次縮圖列圖片
  12053 590 需同步動態更新 [DR-04]
  12083 590 • 下方顯示批次縮圖列，點縮圖切換目前照片 [D1-12]
  12113 590 • 最外層 Batch Edit Room 有自己的 Undo / Redo [DR-05]
  12151 590 • Apply to all 只套比例＋旋轉角度＋翻轉，裁切框預設在每張置中；Free 比例也
  12181 590 可套 [DR-07]
  12219 590 • Room 內只有一組 Undo / Redo（一條共用歷史），依操作順序記錄兩種步驟：
  12249 590 ① Apply to all（一次調整多張）② 單張單個參數編輯 [DR-05][DR-05b]
  12279 590 • Undo / Redo 依序退回／重做最近一步：Apply to all → 所有照片一起；單張編
  12309 590 輯 → 只影響被編輯的那一張（不論目前選取哪張） [DR-05b]
  12339 590 • 切換照片不會清掉歷史 [DR-05e]
  12369 590 • Undo / Redo 的單張編輯不是目前選取的照片時，自動切到那張照片（縮圖列同
  12399 590 步選取），讓用戶看到變化 [DR-05h]
  12429 590 • ✕：丟掉這次進 room 後所有照片的修改（含 Apply to all） [DR-05c]
  12459 590 • ✓：回 Batch Edit Room，這次 room 對每張的修改在該張的外層歷史算一步
  12474 494 33
  12485 590 [DR-05d]
  12557 185 Rotate
  12557 259 Flip
  12557 306 Flip Vertically
  12557 406 Custom
  12557 474 Original
  12557 546 Squre
  12557 620 2:3
  12557 688 3:2
  12557 756 3:4
