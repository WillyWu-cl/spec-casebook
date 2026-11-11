# pm-ui-4

Source: PM Figma https://www.figma.com/design/iWlQTjlmfykHfmlNvg9J4p/Batch-Editing?node-id=0-1 · board `pm-ui-4` · node 16:13767/pm-ui-4 · box x=6366 y=13400 w=9681 h=1480 (absolute Figma canvas points)
Figma text layer (inventory read 2026-11-09, figma-pm / qa1); no PDF export exists, so no OCR. Columns: y, x (absolute Figma canvas points), text (one line per text line); [phone] = inside a phone mockup.

```
 13428   6426  Batch Edit Room · Adjustment
 13428   7886  Batch Edit Room · Adjustment
 13468   6426  default
 13468   7886  applied
 13468   9346  curve_hsl（展開 Curve / HSL 時縮圖列隱藏）
 13548   6856  【Requirement 】
 13548   8316  【Requirement 】
 13564   6452  [phone] 9:41
 13564   7912  [phone] 9:41
 13575  10240  • 展開 Color › Curve / HSL panel 時，批次縮圖列淡出且不能點（panel 為透明、疊在照片上，避免與曲線控制點／滑桿誤觸） [D1-12]
 13582   6856  • 比照 26'10/E Adjustment room，但不顯示 Subject Detection、不出現 AI Exposure [D1-11][DR-03][DR-06]
 13582   8316  • 按 Apply to all 後：以目前這張為來源，把這個 room 的設定整組套到其他照片，畫面留在 room 裡 [DR-04][DR-04c]
 13612   6768  [phone] All
 13612   8228  [phone] All
 13612   9687  All
 13612  10102  All
 13635  10240  • 收合 panel，或切回一般滑桿工具（例如 Exposure）時，縮圖列再出現 [D1-12]
 13650   6856  • 右上「Apply to all」按鈕：icon＋「All」，半透明深底膠囊；一次性按鈕（同 PDR），不是勾選框：點擊後以目前選取的照片為來源，把這個 feature 的設定套到其他照片 [DR-04]
 13650   8316  • 跳 toast「Applied to x photos」，數字＝目前這張以外的照片數 [DR-04]
 13688   8316  • 縮圖列顯示套用後的結果 [DR-04]
 13690   6856  • 套用後可點縮圖切換照片檢查或個別微調，微調只影響那一張 [DR-04]
 13695  10240  • 要換照片：先收合 panel，再點縮圖 [D1-12]
 13726   8316  • Apply to all 在 room 的 Undo / Redo 歷史中算一步，按 Undo 一起退回所有照片 [DR-05b]
 13730   6856  • 修改後再按一次，以目前照片的最新設定重新套用到其他照片 [DR-04]
 13755  10240  • 左圖 HSL、右圖 Curve 為現行畫面，示意縮圖列隱藏時的樣子；右上「All」照常顯示 [D1-12]
 13770   6856  • 下方顯示批次縮圖列，點縮圖切換目前照片 [D1-12]
 13794   8316  • 套用完成後「All」按鈕變 disabled，直到目前這張照片再有參數變動才變回 normal [DR-04]
 13810   6856  • 最外層 Batch Edit Room 有自己的 Undo / Redo [DR-05]
 13850   6856  • 【NEW】Apply to all 按鈕新增 normal / disabled 兩種狀態，看「目前這張照片」決定 [DR-04]
 13890   6856  ◦ 進 room、目前這張還沒有任何修改 → disabled
 13930   6856  ◦ 目前這張有參數變動（且尚未套用）→ normal
 13970   6856  ◦ 按下 Apply to all、套用完成 → disabled
 14010   6856  ◦ 切換照片 → 依切過去的那張照片自己有沒有尚未套用的修改決定
 14024   8014  [phone] Applied to 11 photos
 14050   6856  ◦ Undo 退回 Apply to all 那一步 → normal；Redo 重新套用 → disabled
 14090   6856  • 展開 Color › Curve / HSL 時縮圖列淡出、不能點；收合 panel 或切回一般滑桿工具時再出現（見 curve_hsl） [D1-12]
 14145   6766  [phone] 33
 14145   8226  [phone] 33
 14162   6918  All
 14162   7052  All
 14191   6544  [phone] Light
 14191   6600  [phone] Color
 14191   6656  [phone] Details
 14191   8004  [phone] Light
 14191   8060  [phone] Color
 14191   8116  [phone] Details
 14200   6880  normal
 14200   7014  disabled
 14242   6856  ◦ 例：第 1 張 Exposure +20 → 按 Apply to all → 12 張都 +20 → 切到第 3 張微調 Contrast +10（只有第 3 張）→ 回第 1 張改 Exposure +30 再按 → 其他張整組變成跟第 1 張一樣，第 3 張的 Contrast +10 不保留 [DR-04][DR-04c]
 14276   6427  [phone] Auto
 14276   6497  [phone] Exposure
 14276   6568  [phone] Contrast
 14276   6649  [phone] Hightlight
 14276   6727  [phone] Bright
 14276   6791  [phone] MidTone
 14276   7887  [phone] Auto
 14276   7957  [phone] Exposure
 14276   8028  [phone] Contrast
 14276   8109  [phone] Hightlight
 14276   8187  [phone] Bright
 14276   8251  [phone] MidTone
 14340   6856  • Room 內只有一組 Undo / Redo（一條共用歷史），依操作順序記錄兩種步驟：① Apply to all（一次調整多張）② 單張單個參數編輯 [DR-05][DR-05b]
 14390   6856  • Undo / Redo 依序退回／重做最近一步：Apply to all → 所有照片一起；單張編輯 → 只影響被編輯的那一張（不論目前選取哪張） [DR-05b]
 14439   6856  • 切換照片不會清掉歷史 [DR-05e]
 14489   6856  • Undo / Redo 的單張編輯不是目前選取的照片時，自動切到那張照片（縮圖列同步選取），讓用戶看到變化 [DR-05h]
 14539   6856  • ✕：丟掉這次進 room 後所有照片的修改（含 Apply to all） [DR-05c]
 14589   6856  • ✓：回 Batch Edit Room，這次 room 對每張的修改在該張的外層歷史算一步 [DR-05d]
 14638   6856  • Undo / Redo 不會自動切換 tab（Light / Color / Details），同今天單張 Adjustment room [DR-05g]
```
