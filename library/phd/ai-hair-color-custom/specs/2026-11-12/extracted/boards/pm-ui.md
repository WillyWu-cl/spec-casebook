# Spec - UI

Source: PM Figma https://www.figma.com/design/vhIp15PMJcwOcWJ6E9Q4JE/AI-Hair?node-id=3287-89 · board `pm-ui` · region of 3287:94 · box x=0 y=3004 w=12557 h=1284 (absolute Figma canvas points)
Figma text layer (inventory read 2026-11-12, figma-pm / qa1); no PDF export exists, so no OCR. Columns: y, x from the board's top-left, text; [phone] = inside a phone mockup. Lines of one multi-line text are spaced 18 pt apart.

```
    60     60  UI 依據：PM 提供的 **Design System**（PhotoDirector mobile，由 app 原始碼反推）。畫布回到 **390×844**，色票與尺寸全部改用 DS token：
    78     60  Tab_Main-Tab_bg #000000（chrome）／Edit_AI_Expand-Bg #1e1b19（編輯區）／Bottom_Sheet_bg #342f2e 上圓角 20（panel）／
    96     60  Button_1_bg_n #ffbe98、text #000000（Generate）／Thumbnail-thumbnail_selected_frame #ffbe98 4pt 內框（選取）／
   114     60  Thumbnail-thumbnail_name_bg #3f3a38（縮圖名稱列）／Tab_Main-Tab_text #b1aaa7、_text_p #ffbe98（分類 tab）／strikethrough1_n #ff1b3e（必填 *）。
   132     60  版面按 AIHairColorColorSelectionPage 的堆疊重排：47 safe / AIFeatureEditTopBar 44 / 編輯區 91–525（右下 36pt compare）/ **空的 44pt Intensity 槽** / UnderlineTabs 42+1 /
   150     60  HairColorSwatchPanel 94（StyleThumbCell 64×82、pitch 68、x 從 8）/ 8 / AIFeatureGenerateButton 44 inset 20 / 8 / RoutingUndoRedoPanel 44 / 34 home。
   168     60  Custom panel 比照 ImageToVideoModelListPanel：上圓角 20、inset 16、最高 0.65×844 ＝ 548.6。
   186     60  Style 縮圖已換成 PM 提供的 9 張實拍（split_dye_vertical / split_dye_horizontal 兩張仍缺，維持純色底）[D6-17]
    66   1432  UI 依參考檔 · 已裁示
   290     60  Custom panel（NEW）
   380     60  custom_in_row
   380   1030  【 Custom 在色票列第一顆 】
   380   1460  panel_open_no_style
   380   2430  【 panel 開啟 · 尚未選 style 】
   380   2860  panel_solid_color
   380   3830  【 Solid：只要一個顏色 】
   380   4260  panel_two_tone
   380   5230  【 其他 10 種：兩個顏色都必填 】
   380   5660  panel_palette
   380   6630  【 ② 取色 · 照抄 App 調色盤 】
   380   7341  顏色選取狀態
   380   8460  panel_ready
   380   9430  【 兩色齊備 · 可生成 】
   380   9860  collapsed_applied
   380  10830  【 收合 = apply，Custom 變成被選取 】
   380  11917  【 Custom 結果 】
   396    646  [phone] 9:41
   396   2046  [phone] 9:41
   396   3446  [phone] 9:41
   396   4846  [phone] 9:41
   396   6246  [phone] 9:41
   396   7576  [phone] 9:41
   396   9046  [phone] 9:41
   396  10446  [phone] 9:41
   396  11533  [phone] 9:41
   418   1030  • Custom 固定是整條色票列的**第一顆**，在所有 CMS template 之前（比照 AI Background）[D6-01]
   436   1030  • 未設定過時顯示漸層底 + ＋，label「Custom」；此時沒有被選取，選取的仍是第一個 template [D6-01]
   454   1030  • 點它 → 開啟 Custom panel（下一個狀態）[D6-02]
   418   2430  D6-02 panel 三區：① Style ② Color ③ Generate。
   436   2430  D6-21 Color 區 = 兩列，標題 Base Color / Highlight Color（16pt / Text-Main）。
   454   2430  D6-21 每列第一顆是彩虹色輪鍵（＋角標）＝ 開 App 既有調色盤；其後 7 顆推薦色，40pt 圓、pitch 50、橫向捲動。
   472   2430  D6-03 還沒選 style 前：兩列色票與 Generate 全 disabled。
   490   2430  D6-16 無 undo/redo、無 ✗/✓；右上 ⌄ 收合 ＝ apply（D6-08）。
   418   3830  D6-04 solid_color 是唯一只收一個顏色的 style → 只出現 Base Color 一列，Highlight Color 整列不出現。
   436   3830  D6-04 Base Color 必填；填了就 Generate enable。
   454   3830  D6-21 命名用 Base Color（不再叫 Main / Accent）。
   472   3830  API：solid_color 只送 main_color_r/g/b，不送 accent。
   418   5230  D6-04 其餘 10 種 style：Base Color 與 Highlight Color 兩列都必填。
   436   5230  D6-04 只填一個 → Generate 維持 disabled（圖中已填 Base、未填 Highlight）。
   454   5230  D6-21 選中的那顆掛 2pt #FFBE98 選取環。
   418   6630  D6-05 色輪鍵 → 開 App 既有的調色盤（照抄，RD 直接沿用現成元件）。
   436   6630  版型：Cancel / Done 一列 → 飽和度-明度方塊（圓形 ＋ 游標）→ 彩虹 hue slider（圓 handle）→ slider 右側滴管鍵 → 底部 ✕ ↩ ↪ ⊕ ✓。
   454   6630  D6-05 一次只編輯一個槽（由哪一列的色輪鍵進入就回填哪一列）。
   472   6630  Done 回填並關閉；Cancel 不回填。
   490   6630  HEX 轉 RGB 後送 API（API 收 0–255 的 r/g/b）。
   418   9430  D6-07 兩色齊備 → panel 內橘色 Generate enable，顯示「Generate ｜ ⬤ 6」（不帶負號，D6-15）。
   436   9430  D6-21 Base / Highlight 各一顆掛選取環。
   454   9430  D6-16 Generate 在 panel 內，不走下排。
   418  10830  • 點 panel 外的空白處、或按 panel 右上角收合鍵，**都等於 apply**，不是取消 [D6-08]
   436  10830  • 收合後回到 template 色票列，**Custom 那顆變成被選取狀態**，外層 Generate enable（內外層都能生成）[D6-08]
   454  10830  • Custom 格子改成顯示用戶選的兩個顏色，讓用戶看得出設定還在 [D6-08]
   472  10830  • 設定只有兩種情況會消失：**離開 room**、**自己覆蓋**。其餘一律保留 [D6-09]
   418  11917  • 結果原地顯示；**Intensity 條照給**（0–100%、預設 100%）[D6-12][D1-14]
   436  11917  • 按鈕變 **Retry**，再生成一樣扣 6 [D6-12][D1-18]
   454  11917  • 吃 session 記憶：切走再切回 Custom，叫回這張結果與它當時的 Intensity [D6-12][D1-19]
   472  11917  • 存檔、✓ 回 Edit Room、Artwork 行為全部沿用 10/E [D1-15][D1-13]
   440    902  [phone] 100
   440   2302  [phone] 100
   440   3702  [phone] 100
   440   5102  [phone] 100
   440   6502  [phone] 100
   440   7832  [phone] 100
   440   9302  [phone] 100
   440  10702  [phone] 100
   440  11789  [phone] 100
   687   6236  [phone] Cancel
   687   6553  [phone] Done
   689   2374  [phone] ⌄
   689   3774  [phone] ⌄
   689   5174  [phone] ⌄
   689   7904  [phone] ⌄
   689   9374  [phone] ⌄
   691   2036  [phone] Custom
   691   3436  [phone] Custom
   691   4836  [phone] Custom
   691   7566  [phone] Custom
   691   9036  [phone] Custom
   731   2036  [phone] Style
   731   3436  [phone] Style
   731   4836  [phone] Style
   731   7566  [phone] Style
   731   9036  [phone] Style
   760  10830  【 點別的 template 也不丟棄 】
   798  10830  • 選取環移到該 template，但 **Custom 的設定不被 discard** [D6-09]
   816  10830  • Custom 格子仍顯示剛才那兩個顏色；再點回 Custom 就是原本的設定 [D6-09]
   834  10830  • 這與 D1-19 的「切回已生成色叫回結果」是兩件事：這裡保留的是**還沒生成的設定** [D6-09][D1-19]
   810   6471  [phone] +
   838   2036  [phone] Face
   838   2104  [phone] Bangs
   838   2172  [phone] Highlight
   838   2240  [phone] Balayage
   838   2308  [phone] Ombré
   838   2376  [phone] Solid
   838   3436  [phone] Face
   838   3504  [phone] Bangs
   838   3572  [phone] Highlight
   838   3640  [phone] Balayage
   838   3708  [phone] Ombré
   838   3776  [phone] Solid
   838   4836  [phone] Face
   838   4904  [phone] Bangs
   838   4972  [phone] Highlight
   838   5040  [phone] Balayage
   838   5108  [phone] Ombré
   838   5176  [phone] Solid
   838   7566  [phone] Face
   838   7634  [phone] Bangs
   838   7702  [phone] Highlight
   838   7770  [phone] Balayage
   838   7838  [phone] Ombré
   838   7906  [phone] Solid
   838   9036  [phone] Face
   838   9104  [phone] Bangs
   838   9172  [phone] Highlight
   838   9240  [phone] Balayage
   838   9308  [phone] Ombré
   838   9376  [phone] Solid
   886   2036  [phone] Base Color
   886   3436  [phone] Base Color
   886   4836  [phone] Base Color
   886   7566  [phone] Base Color
   886   9036  [phone] Base Color
   916  11527  [phone] Intensity
   916  11834  [phone] 100
   941   2064  [phone] +
   941   3464  [phone] +
   941   4864  [phone] +
   941   7594  [phone] +
   941   9064  [phone] +
   961    748  [phone] Solid
   961    814  [phone] Multicolor
   961  10548  [phone] Solid
   961  10614  [phone] Multicolor
   961  11635  [phone] Solid
   961  11701  [phone] Multicolor
   998   2036  [phone] Highlight Color
   998   4836  [phone] Highlight Color
   998   7566  [phone] Highlight Color
   998   9036  [phone] Highlight Color
  1053   2064  [phone] +
  1053   4864  [phone] +
  1053   9064  [phone] +
  1070    636  [phone] Custom
  1070    704  [phone] Platinum
  1070    772  [phone] Champagne
  1070    840  [phone] Periwinkle
  1070    908  [phone] Sakura
  1070    976  [phone] Peach Gold
  1070  10436  [phone] Custom
  1070  10504  [phone] Platinum
  1070  10572  [phone] Champagne
  1070  10640  [phone] Periwinkle
  1070  10708  [phone] Sakura
  1070  10776  [phone] Peach Gold
  1070  11523  [phone] Custom
  1070  11591  [phone] Platinum
  1070  11659  [phone] Champagne
  1070  11727  [phone] Periwinkle
  1070  11795  [phone] Sakura
  1070  11863  [phone] Peach Gold
  1083   4836  [phone] Both Base Color and Highlight Color are required.
  1083   7566  [phone] Both Base Color and Highlight Color are required.
  1105    747  [phone] Generate
  1105    954  [phone] 6
  1105  10547  [phone] Generate
  1105  10754  [phone] 6
  1105  11650  [phone] Retry
  1105  11841  [phone] 6
  1141   2147  [phone] Generate
  1141   2354  [phone] 6
  1141   3547  [phone] Generate
  1141   3754  [phone] 6
  1141   4947  [phone] Generate
  1141   5154  [phone] 6
  1141   7677  [phone] Generate
  1141   7884  [phone] 6
  1141   9147  [phone] Generate
  1141   9354  [phone] 6
  1156    646  [phone] ✕
  1156    751  [phone] ↺
  1156    855  [phone] ↻
  1156    960  [phone] ✓
  1156  10446  [phone] ✕
  1156  10551  [phone] ↺
  1156  10655  [phone] ↻
  1156  10760  [phone] ✓
  1156  11533  [phone] ✕
  1156  11638  [phone] ↺
  1156  11742  [phone] ↻
  1156  11847  [phone] ✓
```
