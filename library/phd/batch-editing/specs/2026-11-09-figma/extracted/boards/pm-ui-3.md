# pm-ui-3

Source: PM Figma https://www.figma.com/design/iWlQTjlmfykHfmlNvg9J4p/Batch-Editing?node-id=0-1 · board `pm-ui-3` · node 16:13767/pm-ui-3 · box x=6366 y=11800 w=9681 h=1600 (absolute Figma canvas points)
Figma text layer (inventory read 2026-11-09, figma-pm / qa1); no PDF export exists, so no OCR. Columns: y, x (absolute Figma canvas points), text (one line per text line); [phone] = inside a phone mockup.

```
 11830   6426  Batch Edit Room · Crop & Rotate
 11830   7886  Batch Edit Room · Crop & Rotate
 11870   6426  default
 11870   7886  applied
 11950   6856  【Requirement 】
 11950   8316  【Requirement 】
 11966   6452  [phone] 9:41
 11966   7912  [phone] 9:41
 11984   6856  • 畫面比照現在的 Crop & Rotate room，panel 不含上方 title bar [D1-11][DR-03]
 11984   8316  • 按 Apply to all 後：以目前這張為來源，把這個 room 的設定整組套到其他照片，畫面留在 room 裡 [DR-04][DR-04c]
 12011   6561  [phone] 1108 x 1477
 12011   8021  [phone] 1108 x 1477
 12044   6856  • 頂部同單張 Crop & Rotate：‹ ＋ 目前照片的輸出尺寸「W x H ✎」；切換照片時顯示該張的尺寸，點 ✎ 可手動輸入 px（範圍＝該張原圖尺寸，超出跳 toast）；按 Apply to all 時其他照片只同步比例，不同步 px [D1-11]
 12052   8316  • 跳 toast「Applied to x photos」，數字＝目前這張以外的照片數 [DR-04]
 12059   6768  [phone] All
 12059   8228  [phone] All
 12090   8316  • 縮圖列顯示套用後的結果 [DR-04]
 12112   6856  • 右上「Apply to all」按鈕：icon＋「All」，半透明深底膠囊；一次性按鈕（sync PDRM apply to all 作法）：點擊後以目前選取的照片為來源，把這個 feature 的設定套到所有其他照片 [DR-04]
 12128   8316  • Apply to all 在 room 的 Undo / Redo 歷史中算一步，按 Undo 一起退回所有照片 [DR-05b]
 12157   6856  • 套用後可點縮圖切換照片檢查或個別微調，微調只影響那一張 [DR-04]
 12196   8316  • 套用完成後「All」按鈕變 disabled，直到目前這張照片再有參數變動才變回 normal [DR-04]
 12202   6856  • 修改後再按一次，以目前照片的最新設定重新套用到其他照片，批次縮圖列圖片需同步動態更新 [DR-04]
 12247   6856  • 下方顯示批次縮圖列，點縮圖切換目前照片 [D1-12]
 12292   6856  • 最外層 Batch Edit Room 有自己的 Undo / Redo [DR-05]
 12337   6856  • 【NEW】Apply to all 按鈕新增 normal / disabled 兩種狀態，看「目前這張照片」決定 [DR-04]
 12382   6856  ◦ 進 room、目前這張還沒有任何修改 → disabled
 12427   6856  ◦ 目前這張有參數變動（且尚未套用）→ normal
 12463   8014  [phone] Applied to 11 photos
 12472   6856  ◦ 按下 Apply to all、套用完成 → disabled
 12517   6856  ◦ 切換照片 → 依切過去的那張照片自己有沒有尚未套用的修改決定
 12562   6856  ◦ Undo 退回 Apply to all 那一步 → normal；Redo 重新套用 → disabled
 12595   6761  [phone] 33
 12595   8221  [phone] 33
 12607   6856  • Crop 特例：手動輸入解析度（點 W x H ✎）時，Apply to all 只同步比例、不同步 px [DR-04]
 12652   6856  ◦ 寬高有連接（鎖住比例）：只改尺寸、比例不變 → 沒有可同步的內容，維持 disabled
 12681   6451  [phone] Rotate
 12681   6526  [phone] Flip
 12681   6573  [phone] Flip Vertically
 12681   6672  [phone] Custom
 12681   6741  [phone] Original
 12681   7911  [phone] Rotate
 12681   7986  [phone] Flip
 12681   8033  [phone] Flip Vertically
 12681   8132  [phone] Custom
 12681   8201  [phone] Original
 12697   6856  ◦ 寬高沒有連接：比例改變並切到 Free（自訂比例）→ normal，可把這個 Free 比例套到其他照片
 12774   6918  All
 12774   7052  All
 12812   6880  normal
 12812   7014  disabled
 12854   6856  • Apply to all 只套比例＋旋轉角度＋翻轉，裁切框預設在每張置中；Free 比例也可套 [DR-07]
 12922   6856  • Room 內只有一組 Undo / Redo（一條共用歷史），依操作順序記錄兩種步驟：① Apply to all（一次調整多張）② 單張單個參數編輯 [DR-05][DR-05b]
 12970   6856  • Undo / Redo 依序退回／重做最近一步：Apply to all → 所有照片一起；單張編輯 → 只影響被編輯的那一張（不論目前選取哪張） [DR-05b]
 13017   6856  • 切換照片不會清掉歷史 [DR-05e]
 13065   6856  • Undo / Redo 的單張編輯不是目前選取的照片時，自動切到那張照片（縮圖列同步選取），讓用戶看到變化 [DR-05h]
 13113   6856  • ✕：丟掉這次進 room 後所有照片的修改（含 Apply to all） [DR-05c]
 13160   6856  • ✓：回 Batch Edit Room，這次 room 對每張的修改在該張的外層歷史算一步 [DR-05d]
```
