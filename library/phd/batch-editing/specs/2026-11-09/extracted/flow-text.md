# UI UX flow 2.pdf text layer (MuPDF), x,y in PDF points
4263,152 Demo + Spec
100,340 與 Edit Room 的差異：Edit Room 一次修一張、什麼工具都能用；Batch Edit 一次修 N 張，只提供能『同一個設定套到每張』的三種調整，用一次設定換 N 張結果，再個別微調。 [D0-03]
7000,562 • 主指標：進入比例＝批次進入 event ÷ 進 Picker [D0-02]
4800,563 • 不適用：AI Enhance 沒有扣點機制，批次不會遇到點數不足 [DR-11][DR-11b]
5900,563 • 部分失敗：跑完全部才一次總結，不逐張跳 Dialog；失敗的圖片可重試 [D1-04]
7000,592 • 次指標：Batch session 存檔比例＝Photo_Result_Save [D0-02]
5900,601 • 沒有取消，要等全部做完（同今天所有 server task） [D1-03]
7000,622 • 命名規則：event 三段 PascalCase（Xxx_Yyy_Zzz）、參數 snake_case，不符合會被兩平台丟掉 [D0-02]
5900,639 • App 被殺：Batch Edit Room 不見（同今天 sync 任務），已做的 AI Enhance 結果也不會留下
5900,669 （Standard 不存到 My AI Artwork） [D1-05][D1-10]
7015,696 Event
7345,696 類型
7545,696 觸發時機
7885,696 參數 / 值
8265,696 決策來源
5900,707 • 斷網：視同失敗，用 Retry Failed 重跑；切背景：暫停，回來後繼續 [D1-05]
7015,747 名稱待定（例 Batch_Edit_Enter）
7345,747 新增
7545,747 Picker 切批次 Tab 並進 Batch Edit
7885,747 —（主指標分子）
8265,747 D0-02
7545,772 Room
7015,823 GenAI_Feature_Generate
7345,823 既有，新增 from 值
7545,823 批次 AI Enhance，每張各送一次
7885,823 from＝BatchEdit；batch_size
8265,823 D4-01
280,830 Overview
7345,848 ＋參數
7015,899 Photo_Result_Save
7345,899 既有，不變
7545,899 Batch session 存檔
7885,899 （次指標）
8265,899 D0-02
38,914 • 幫誰：旅遊／活動一組照片、賣家商品照、社群 carousel；競品 Meitu、Fotor 都有 [D0-01]
38,948 • 名稱 Batch Edit／Batch Edit Room；只出現在 Launcher「Edit」Picker 與 AI Enhance Shortcut Picker，Edit Room 內不出現 [D0-04][D0-04b]
7015,950 名稱待定
7345,950 新增
7545,950 Batch Save page 點「Edit Next
7885,950 記點擊次數
8265,950 D1-07
7545,975 Batch」
38,982 • iOS + Android 同步，26'11/E [D0-05]
38,1016 • 今天 app 沒有任何批次編輯；本版只做 AI Enhance／Crop & Rotate／Adjustment，Filter／Preset 看用量再加 [D0-07][D0-06][DR-03]
38,1050 • 差異化：Meitu、Fotor 批次都沒有 AI Enhance；批次本身免費，AI Enhance 也不扣點 [D0-08][D5-01b]
280,1170 Entry: Launcher › Edit（批次 Tab）
2365,1170 Entry: Launcher › Batch Editing shortcut
315,1245 9:41
1181,1245 9:41
1610,1245 9:41
2781,1255 要請 design 出 icon 設計 fot shorcut
2400,1287 9:41
296,1289 PhotoD irector
1912,1294 All
2381,1331 PhotoD irector
2784,1338 icon 設
2867,1338 計方向可參考 Meitu
2804,1368 deeplink: phd://navigate/page?name=batch_edit
830,1377 Single
923,1377 Batch
296,1441 AI Group Photos
816,1443 1
1048,1443 2
2381,1483 AI Group Photos
385,1507 Edit
546,1507 Camera
2470,1549 Edit
2631,1549 Camera
932,1559 3
6964,1568 Q1 ✅ 已決：AI Enhance 批次 day-1 不新增扣點 [DR-11]
8054,1568 Q2 ✅ 已決：批次 day-1 不鎖 Premium [D5-01b]
6964,1608 ➡️ day-1 不做：維持不扣點，不 sync PhD PC 的批次扣點作法
8054,1608 ➡️ day-1 不做：不參考 Meitu 選到第 13 張跳 IAP 的作法，批次照片上限維持 20 張、免費使用
306,1628 Quick Action
392,1628 Motion Swap
479,1630 AI Edit Agent
565,1633 Reel Creator
6964,1648 主：Judy（與 Samuel 確認，10/30）
8054,1648 主：Judy（與 Samuel 確認，10/30）
2391,1670 Quick Action
2477,1670 Motion Swap
2564,1672 AI Edit Agent
2650,1675 Reel Creator
357,1680 HOT
6964,1688 原因：與 Samuel 討論，AI Enhance model 未來有機會換成 Nano Banana，成本可能降低，margin 再
8054,1688 原因：目前 Batch Editing 可用的 feature 還不夠多，等 feature 累積到一定量再評估要不要鎖 Premium
6964,1718 觀察
2442,1722 HOT
309,1738 AI Removal
385,1738 AI Group Photo
570,1738 AI Try-On
488,1739 Beautify
2394,1780 AI Removal
2470,1780 AI Group Photo
2655,1780 AI Try-On
2573,1781 Beautify
329,1782 HOT
6975,1813 9:41
296,1822 Cinematic Reel Creator
2414,1824 HOT
576,1825 View all
7403,1853 If AI Enhance 收 credit
8911,1853 batch editin
9120,1853 g 鎖 premium
7225,1854 182
2381,1864 Cinematic Reel Creator
2661,1867 View all
1904,1876 33
7451,1901 左上角加 info
8991,1901 meitu
8150,1938 Single
8243,1938 Batch
7451,1949 比照 PhD PC 作法每 10 張 1 credit
9039,1949 vip max 50 pics
1595,1959 Rotate
1669,1959 Flip
1716,1959 Flip Vertically
1816,1959 Custom
1884,1959 Original
1956,1959 Squre
2030,1959 2:3
2098,1959 3:2
2166,1959 3:4
730,1971 Select 1 to 20 photos.
997,1972 Done
306,1992 Home
373,1992 Discover
443,1992 AI Videos
514,1992 AI Photos
598,1992 MIne
7451,1997 (不滿 10 張也同樣 consume 1
9039,1997 13+ 跳 IAP
8136,2004 1
8368,2004 2
296,2028 Trendy
1194,2032 Crop & Rotate
1311,2032 Adjustment
1420,2032 AI Enhance
2391,2034 Home
2458,2034 Discover
2528,2034 AI Videos
2599,2034 AI Photos
2683,2034 MIne
7451,2045 credit)
8991,2045 phdm
2381,2070 Trendy
9039,2093 phdm max 20 pics
8252,2120 3
7403,2141 L4: 0.0030/image
9039,2141 7+ 跳 IAP
719,2168 Lorem ipsum
7403,2189 L4: 0.0015/image - cost down完
455,2205 Lorem ipsum
591,2206 Lorem ipsum
319,2207 Lorem ipsum
2804,2210 Lorem ipsum
2540,2247 Lorem ipsum
2676,2248 Lorem ipsum
2404,2249 Lorem ipsum
296,2251 What’s New
2381,2293 What’s New
280,2334 Batch Edit Room › Adjustment
320,2393 Try Now
321,2409 9:41
750,2409 9:41
1180,2409 9:41
604,2421 Go
304,2424 Lorem ipsum dolor sit amet, consectetur amet
2405,2435 Try Now
1052,2458 All
1482,2458 All
2689,2463 Go
2389,2466 Lorem ipsum dolor sit amet, consectetur amet
296,2491 AI Removal
414,2498 HOT
7095,2502 Enhance
8050,2532 Select 1 to 20 photos.
2381,2533 AI Removal
8317,2534 Done
2499,2540 HOT
7013,2545 Maximize detaill and clarity with advanced AI.
296,2680 AI Enhance HOT
2381,2722 AI Enhance HOT
296,2865 AI Magic
1268,2869 Applied to 11 photos
2381,2907 AI Magic
1050,2992 33
1480,2992 33
828,3035 Light
884,3035 Color
940,3035 Details
1258,3035 Light
1314,3035 Color
1370,3035 Details
304,3036 AI Hairstyle
480,3036 AI Expand
2389,3078 AI Hairstyle
2565,3078 AI Expand
731,3119 Auto
793,3119 Exposure
865,3119 Contrast
933,3119 Hightlight
1011,3119 Bright
1075,3119 MidTone
1155,3119 Dark
1161,3119 Auto
1218,3119 Shadows
1223,3119 Exposure
1295,3119 Contrast
1363,3119 Hightlight
1441,3119 Bright
1505,3119 MidTone
1585,3119 Dark
1648,3119 Shadows
334,3196 Crop & Rotate
451,3196 Adjustment
560,3196 AI Enhance
307,3209 AI Face Swap
480,3212 Fashion Outfit
2392,3251 AI Face Swap
2565,3254 Fashion Outfit
307,3385 Business Outfit
483,3385 AI Headshot
2392,3427 Business Outfit
2568,3427 AI Headshot
537,3489 +9
280,3498 Batch Edit Room › AI Enhance（批次）
2622,3531 +9
304,3564 AI Sketch
321,3573 9:41
1605,3573 9:41
2480,3573 9:41
745,3574 9:41
2035,3574 9:41
297,3606 Collage
2389,3606 AI Sketch
561,3610 View all
995,3615 182
2285,3615 182
2382,3648 Collage
2646,3652 View all
2028,3669 12 completed, 3 failed
2028,3689 Failed photos are marked with ! on the thumbnails.
297,3803 Collage
561,3805 View all
2382,3845 Collage
2646,3847 View all
1676,3869 Creating Your AI Image
1238,3898 Enhance {xx} photos?
1189,3932 Processing takes a moment and cannot be
1693,3935 Enhancing 3 / 20
1254,3953 canceled once started.
1231,4002 Cancel
1382,4002 Start
2157,4161 !
2265,4161 !
2319,4161 !
1725,4260 Enhance
865,4263 Enhance
2128,4263 Retry Failed (3)
1615,4298 Maximize detaill and clarity with advanced AI.
783,4306 Maximize detaill and clarity with advanced AI.
2073,4306 Maximize detaill and clarity with advanced AI.
334,4360 Crop & Rotate
451,4360 Adjustment
560,4360 AI Enhance
2493,4360 Crop & Rotate
2610,4360 Adjustment
2719,4360 AI Enhance
280,4662 Entry: Launcher Shortcut › AI Enhance（批次 Tab）
2000,4662 Free user › AI Enhance → Premium IAP
315,4737 9:41
1175,4738 9:41
2035,4738 9:41
1425,4779 182
2284,4779 182
296,4781 PhotoD irector
830,4869 Single
923,4869 Batch
296,4933 AI Group Photos
816,4935 1
1048,4935 2
385,4999 Edit
546,4999 Camera
932,5051 3
2554,5102 Premium IAP
306,5120 Quick Action
392,5120 Motion Swap
479,5122 AI Edit Agent
565,5125 Reel Creator
2495,5142 沿用既有 Premium IAP 頁（本檔無畫面）
426,5171 HOT
357,5172 HOT
395,5228 AI Enhance
309,5230 AI Removal
570,5230 AI Try-On
488,5231 Beautify
329,5274 HOT
296,5314 Cinematic Reel Creator
576,5317 View all
1295,5427 Enhance
2155,5427 Enhance
730,5464 3 selected (max 20)
997,5465 Done
1213,5470 Maximize detaill and clarity with advanced AI.
2073,5470 Maximize detaill and clarity with advanced AI.
306,5484 Home
373,5484 Discover
443,5484 AI Videos
514,5484 AI Photos
598,5484 MIne
296,5520 Trendy
719,5660 Lorem ipsum
455,5697 Lorem ipsum
591,5698 Lorem ipsum
319,5699 Lorem ipsum
296,5743 What’s New
280,5826 批次 Tab 只選 1 張 → 單張 Edit Room
320,5885 Try Now
751,5901 9:41
604,5913 Go
304,5916 Lorem ipsum dolor sit amet, consectetur amet
1140,5930 單張 Edit Room 按 Replace photo → Photo Picker，可切
1140,5954 到批次 Tab 改走 Batch Edit [D1-08c]
296,5983 AI Removal
414,5990 HOT
400,6033 Single
493,6033 Batch
502,6099 1
296,6172 AI Enhance HOT
296,6357 AI Magic
304,6528 AI Hairstyle
480,6528 AI Expand
1108,6622 AI
1541,6622 AI
300,6628 1 selected (max 20)
567,6629 Done
720,6642 AI Removal
803,6642 Mosaic
879,6642 Crop
934,6642 Background
1018,6642 Cutout
1085,6642 AI Replace
1157,6642 Text Tools
1236,6642 Sticker
1300,6642 Add Image
1374,6642 Pen Tools
1453,6642 Frame
1517,6642 AI Scene
733,6676 Quick Action
850,6676 Edit
911,6676 Enhance
996,6676 Portrait
1075,6676 Effects
307,6701 AI Face Swap
480,6704 Fashion Outfit
307,6877 Business Outfit
483,6877 AI Headshot
537,6981 +9
280,6990 存檔
304,7056 AI Sketch
321,7065 9:41
1181,7065 9:41
297,7098 Collage
561,7102 View all
1164,7154 Saved 12 photos
297,7295 Collage
561,7297 View all
854,7425 Saving 3 / 20
805,7451 Please do not leave this page or quit
883,7469 the app.
1276,7814 Edit Next Batch
334,7852 Crop & Rotate
451,7852 Adjustment
560,7852 AI Enhance
280,8154 返回：離開 Batch Edit
751,8229 9:41
400,8361 Single
493,8361 Batch
1570,8390 只有做過編輯才跳 Discard Dialog；還沒做任何編輯時，Home
1570,8414 直接回 Launcher、Replace photo 直接回 Photo Picker 批次
386,8427 1
618,8427 2
1570,8438 Tab [D1-08]
1570,8462 Discard 之後去哪，看是從哪個按鈕來：
1570,8486 • Replace photo → 回 Photo Picker 批次 Tab（保留之前選過
1570,8510 的照片，編輯全部丟掉） [D1-08b]
1570,8534 • Home → 回 Launcher [D1-08]
1263,8538 Discard changes?
502,8543 3
1212,8570 Your edits to these photos will be lost.
1570,8598 從 Save page 按 Edit Next Batch 進 Picker 時，按 ‹ 返回 → 回
1570,8622 Batch Edit Room，顯示原本的編輯狀態（day-1 照 Android 單
1233,8641 Discard
1364,8641 Keep Editing
1570,8646 張做法；iOS 單張今天是回 Launcher） [D1-07]
300,8956 3 selected (max 20)
567,8957 Done
764,9016 Crop & Rotate
881,9016 Adjustment
990,9016 AI Enhance
280,9308 — 藍線＝去程（點擊觸發）　— 紅線＝回程（✓ / ‹ / 取消 / Discard 返回）
160,9362 Photo Picker
1620,9362 Photo Picker
3080,9362 Photo Picker
4540,9362 Photo Picker
160,9402 single
1620,9402 batch
3080,9402 batch_one
4540,9402 over_max
575,9482 【Requirement 】
2035,9482 【Requirement 】
3495,9482 【Requirement 】
4955,9482 【Requirement 】
575,9519 • Picker 上方新增 Tab「Single / Batch」，每次打開預設「Single」 [DR-01b]
2035,9519 • 切到「Batch」Tab 才能多選，最多 20 張（兩平台一致） [DR-01]
3495,9519 • 批次 Tab 只選 1 張按 Done → 自動走單張 Edit Room [DR-01b]
4955,9519 • 選第 21 張：擋下並顯示 toast「Please pick at most 20 photos.」 [DR-01]
575,9557 • 單張 Tab 選 1 張 → 現有 Edit Room，流程不變 [DR-13]
2035,9557 • 縮圖顯示點選順序 1、2、3…，Batch Edit Room 照此順序排列 [D2-01]
3495,9557 • 單張 Edit Room 流程同今天 [DR-13]
3495,9587 • 單張 Edit Room 按 Replace photo → Picker 可切到批次 Tab，改走 Batch Edit
575,9595 • Launcher「Edit」與 AI Enhance Shortcut 兩個 Picker 用同一套 Tab [DR-01b]
2035,9595 • 底部新增：已選張數＋Done [DR-01]
3495,9613 [D1-08c]
575,9621 [D0-04b]
280,9629 Single
373,9629 Batch
1740,9629 Single
1833,9629 Batch
3200,9629 Single
3293,9629 Batch
4660,9629 Single
4753,9629 Batch
2035,9633 • 埋點見【Tracking Event】 [D0-02]
575,9649 • 比照 Meitu：Picker 可選 single or batch [DR-01]
1726,9695 1
1958,9695 2
3302,9695 1
4646,9695 1
4762,9695 2
4878,9695 3
1842,9811 3
4646,9811 4
4762,9811 5
4878,9811 6
4646,9927 7
4762,9927 8
4878,9927 9
4628,10141 Please pick at most 20 photos.
1640,10223 Select 1 to 20 photos.
3100,10223 Select 1 to 20 photos.
4560,10223 Select 1 to 20 photos.
1907,10225 Done
3367,10225 Done
4827,10225 Done
160,10514 Batch Edit Room
160,10554 default
590,10634 【Requirement 】
201,10649 9:41
590,10671 •長得像現在的 Edit Room，底部只有三個 button：Crop & Rotate / Adjustment
590,10701 / AI Enhance；點進去比照現在各 feature room [D1-11]
590,10731 •Top bar: Save 不變，最右是 Setting 按鈕 [D1-11]
590,10769 •photo Picker 進來先落在這個主畫面；button 順序：Crop & Rotate →
590,10799 Adjustment → AI Enhance [D1-01]
590,10837 • 縮圖列放主畫面，點縮圖切換照片；照片不能移除、也不能新增（縮圖沒有 ×）
590,10863 [D1-12][D1-09]
590,10891 • 右上存檔 → Saving k / N → Batch Save page [D5-01b]
590,10921 • 左上 Home：還沒做任何編輯 → 直接回 Launcher；有編輯 → Discard Dialog
590,10951 → Discard 後回 Launcher [D1-08]
590,10981 • 左上 Replace photo：還沒做任何編輯 → 直接回 Photo Picker 批次 Tab；有編
590,11011 輯 → Discard Dialog → Discard 後回 Photo Picker 批次 Tab。兩種都保留之前選
590,11041 過的照片，有編輯時丟掉這次 Batch Edit 的所有編輯 [D1-08][D1-08b]
590,11079 • 外層 Undo / Redo 也是每張照片各自一條：只作用在目前這張；從 room 按 ✓
590,11109 回來後，那次 room 對每張的修改在各自的歷史算一步 [DR-05][DR-05d]
590,11147 • AI Enhance 的 Undo / Redo：在單張照片按 Undo 可退回 Enhance 前，只退那
590,11177 一張；想拿回結果按 Redo。退回後若又對那張做了其他修改，Redo 會被清掉，
590,11207 Enhance 結果拿不回來（可再進 AI Enhance room 重新 Enhance） [DR-10b][DR-12e]
214,11436 Crop & Rotate
331,11436 Adjustment
440,11436 AI Enhance
160,11708 Batch Edit Room · Crop & Rotate
1620,11708 Batch Edit Room · Crop & Rotate
160,11748 default
1620,11748 applied
590,11828 【Requirement 】
2050,11828 【Requirement 】
200,11843 9:41
1660,11843 9:41
590,11865 • 畫面比照現在的 Crop & Rotate room，panel 不含上方 title bar [D1-11][DR-03]
2050,11865 • 按 Apply to all 後：以目前這張為來源，把這個 room 的設定整組套到其他照
502,11892 All
1962,11892 All
2050,11895 片，畫面留在 room 裡 [DR-04][DR-04c]
590,11903 • 右上「Apply to all」按鈕：icon＋「All」，半透明深底膠囊；一次性按鈕
590,11933 （sync PDRM apply to all 作法）：點擊後以目前選取的照片為來源，把這個
2050,11933 • 跳 toast「Applied to x photos」，數字＝目前這張以外的照片數 [DR-04]
590,11963 feature 的設定套到所有其他照片 [DR-04]
2050,11971 • 縮圖列顯示套用後的結果 [DR-04]
590,11993 • 套用後可點縮圖切換照片檢查或個別微調，微調只影響那一張 [DR-04]
2050,12009 • Apply to all 在 room 的 Undo / Redo 歷史中算一步，按 Undo 一起退回所有照
590,12023 • 修改後再按一次，以目前照片的最新設定重新套用到其他照片，批次縮圖列圖片
2050,12039 片 [DR-05b]
590,12053 需同步動態更新 [DR-04]
590,12083 • 下方顯示批次縮圖列，點縮圖切換目前照片 [D1-12]
590,12113 • 最外層 Batch Edit Room 有自己的 Undo / Redo [DR-05]
590,12151 • Apply to all 只套比例＋旋轉角度＋翻轉，裁切框預設在每張置中；Free 比例也
590,12181 可套 [DR-07]
590,12219 • Room 內只有一組 Undo / Redo（一條共用歷史），依操作順序記錄兩種步驟：
590,12249 ① Apply to all（一次調整多張）② 單張單個參數編輯 [DR-05][DR-05b]
590,12279 • Undo / Redo 依序退回／重做最近一步：Apply to all → 所有照片一起；單張編
590,12309 輯 → 只影響被編輯的那一張（不論目前選取哪張） [DR-05b]
590,12339 • 切換照片不會清掉歷史 [DR-05e]
1748,12340 Applied to 11 photos
590,12369 • Undo / Redo 的單張編輯不是目前選取的照片時，自動切到那張照片（縮圖列同
590,12399 步選取），讓用戶看到變化 [DR-05h]
590,12429 • ✕：丟掉這次進 room 後所有照片的修改（含 Apply to all） [DR-05c]
590,12459 • ✓：回 Batch Edit Room，這次 room 對每張的修改在該張的外層歷史算一步
494,12474 33
1954,12474 33
590,12485 [DR-05d]
185,12557 Rotate
259,12557 Flip
306,12557 Flip Vertically
406,12557 Custom
474,12557 Original
546,12557 Squre
620,12557 2:3
688,12557 3:2
756,12557 3:4
1645,12557 Rotate
1719,12557 Flip
1766,12557 Flip Vertically
1866,12557 Custom
1934,12557 Original
2006,12557 Squre
2080,12557 2:3
2148,12557 3:2
2216,12557 3:4
160,12892 Batch Edit Room · Adjustment
1620,12892 Batch Edit Room · Adjustment
160,12932 default
1620,12932 applied
3080,12932 請 design 處理 guideline 留意 (HSL / Curve)
590,13012 【Requirement 】
2050,13012 【Requirement 】
200,13028 9:41
1660,13028 9:41
3974,13042 • 現有 adjustment room 中有部分 feature panel 畫面本
590,13049 • 比照 26'10/E Adjustment room，但不顯示 Subject Detection、不出現 AI
2050,13049 • 按 Apply to all 後：以目前這張為來源，把這個 room 的設定整組套到其他照
3974,13072 來就很高，加上縮圖列後，照片可見高度又會變得更好，
502,13076 All
1962,13076 All
590,13079 Exposure [D1-11][DR-03][DR-06]
2050,13079 片，畫面留在 room 裡 [DR-04][DR-04c]
3974,13102 看起來很擠
590,13117 • 右上「Apply to all」按鈕：icon＋「All」，半透明深底膠囊；一次性按鈕（同
2050,13117 • 跳 toast「Applied to x photos」，數字＝目前這張以外的照片數 [DR-04]
4004,13132 想請 design 留意 preview photo 比例並給予建議
590,13147 PDR），不是勾選框：點擊後以目前選取的照片為來源，把這個 feature 的設定套
2050,13155 • 縮圖列顯示套用後的結果 [DR-04]
590,13177 到其他照片 [DR-04]
3974,13192 PM prefer 調整方向
2050,13193 • Apply to all 在 room 的 Undo / Redo 歷史中算一步，按 Undo 一起退回所有照
590,13207 • 套用後可點縮圖切換照片檢查或個別微調，微調只影響那一張 [DR-04]
4004,13222 可參考提案 · Adjustment 縮圖列（draft）
2050,13223 片 [DR-05b]
590,13237 • 修改後再按一次，以目前照片的最新設定重新套用到其他照片 [DR-04]
4014,13252 A
4046,13252 . 縮小縮圖列：縮圖 50→40px、縮圖列
590,13267 • 下方顯示批次縮圖列，點縮圖切換目前照片 [D1-12]
4034,13282 62→48px，照片多回約 14px（一次可看到 8 張）
590,13297 • 最外層 Batch Edit Room 有自己的 Undo / Redo [DR-05]
4034,13312 ・B. 拖曳 slider 時隱藏縮圖列：手指按住滑桿 / 曲
590,13335 ◦ 例：第 1 張 Exposure +20 → 按 Apply to all → 12 張都 +20 → 切到第 3 張微調
4034,13342 線點時縮圖列淡出，照片回到原本高度；放開後淡
590,13365 Contrast +10（只有第 3 張）→ 回第 1 張改 Exposure +30 再按 → 其他張整組變成
4034,13372 入
590,13395 跟第 1 張一樣，第 3 張的 Contrast +10 不保留 [DR-04][DR-04c]
590,13433 • Room 內只有一組 Undo / Redo（一條共用歷史），依操作順序記錄兩種步驟：
590,13463 ① Apply to all（一次調整多張）② 單張單個參數編輯 [DR-05][DR-05b]
1748,13487 Applied to 11 photos
590,13493 • Undo / Redo 依序退回／重做最近一步：Apply to all → 所有照片一起；單張編
590,13523 輯 → 只影響被編輯的那一張（不論目前選取哪張） [DR-05b]
590,13553 • 切換照片不會清掉歷史 [DR-05e]
590,13583 • Undo / Redo 的單張編輯不是目前選取的照片時，自動切到那張照片（縮圖列同
500,13610 33
1960,13610 33
590,13613 步選取），讓用戶看到變化 [DR-05h]
590,13643 • ✕：丟掉這次進 room 後所有照片的修改（含 Apply to all） [DR-05c]
278,13654 Light
334,13654 Color
390,13654 Details
1738,13654 Light
1794,13654 Color
1850,13654 Details
590,13673 • ✓：回 Batch Edit Room，這次 room 對每張的修改在該張的外層歷史算一步
590,13699 [DR-05d]
590,13721 • Undo / Redo 不會自動切換 tab（Light / Color / Details），同今天單張
181,13738 Auto
243,13738 Exposure
315,13738 Contrast
383,13738 Hightlight
461,13738 Bright
525,13738 MidTone
605,13738 Dark
668,13738 Shadows
1641,13738 Auto
1703,13738 Exposure
1775,13738 Contrast
1843,13738 Hightlight
1921,13738 Bright
1985,13738 MidTone
2065,13738 Dark
2128,13738 Shadows
590,13751 Adjustment room [DR-05g]
160,14076 Batch Edit Room · AI Enhance
1620,14076 Batch Edit Room · AI Enhance
3080,14076 Batch Edit Room · AI Enhance
4540,14076 Batch Edit Room · AI Enhance
6000,14076 Batch Edit Room · AI Enhance
7460,14076 Batch Edit Room · AI Enhance
8920,14076 Batch Edit Room · AI Enhance
160,14116 default
1620,14116 already_done
3080,14116 free_user
4540,14116 processing
6000,14116 result_summary
7460,14116 network_incomplete
8920,14116 network_incomplete · offline
575,14196 【Requirement 】
2035,14196 【Requirement 】
3495,14196 【Requirement 】
4955,14196 【Requirement 】
6415,14196 【Requirement 】
7875,14196 【Requirement 】
4575,14211 9:41
195,14212 9:41
1655,14212 9:41
3115,14212 9:41
6035,14212 9:41
7495,14212 9:41
8955,14212 9:41
575,14233 • 批次 AI Enhance 只支援 Standard：不顯示 Standard / Advanced tab、不顯示
2035,14233 • 每次進 AI Enhance room 可 apply 一次 Enhance，套用到批次全部照片；按完
3495,14233 • Free user 按 generate → Premium IAP [DR-12d]
4955,14233 • 沿用現行 loading 畫面，將 string 替換為「Enhancing k / N」，k=已完成
6415,14233 • 跑完全部才一次總結：「X completed, Y failed」「Failed photos are marked
7875,14233 • 斷網視同失敗，畫面同 result_summary：已完成的保留；沒做完的照片標紅色
445,14253 182
1905,14253 182
3364,14253 182
6285,14253 182
7745,14253 182
9205,14253 182
575,14263 scenario，畫面只剩一顆 generate（沿用 10/E room 的 Enhance 按鈕） [DR-09]
2035,14263 按鈕變「Enhanced」灰掉 [DR-12e][DR-12h]
4955,14263 enhance 數量，N=enhance request 總數；遮罩蓋住整個畫面，縮圖列在遮罩下方
6415,14263 on the thumbnails.」；Y 張失敗的照片在縮圖右上角標紅色 !（X 張成功的不
7875,14263 !；訊息「X completed, Y failed」「Connection lost. Check your connection and
3495,14271 • 不提供試做 1 張：流程上沒辦法只試做一張再跳 IAP，Free user 按 Enhance 直
575,14289 [DR-12a][D1-11]
4955,14289 [D1-02]
6415,14293 標），點失敗縮圖可切過去看 [D1-04]
7875,14293 retry.」；同時有失敗與斷網時合併計算，第二行優先顯示斷網提示 [D1-05][D1-04]
2035,14301 • 離開 room 再進來可以再 apply 一次，處理的是目前的圖（已 Enhance 過的結
3495,14301 接跳 Premium IAP [D3-01][D3-02]
6028,14307 12 completed, 3 failed
7488,14307 8 completed, 7 failed
8948,14307 8 completed, 7 failed
575,14317 • 這顆 Enhance 按鈕對應 10/E Standard · Portrait [DR-09d]
4955,14317 • Enhance 過程中不能跳出去編輯其他東西（不能切 Crop / Adjustment、不能點
6028,14327 Failed photos are marked on the thumbnails.
7488,14327 Connection lost. Check your connection and retry.
8948,14327 Connection lost. Check your connection and retry.
2035,14331 果），同單張 Edit Room [DR-12e]
6415,14331 • button 為「Retry Failed (x)」，只重做失敗的照片，(x) 為enhance 失敗張數；
7875,14331 • 按鈕「Retry Failed (7)」重跑沒做完的照片；還沒連上網就按 → toast「No
4955,14347 縮圖切換），要等全部做完（RD 確認） [D1-02]
575,14355 • 按下套用到批次全部照片，先跳 AI Enhance Confirm Dialog [DR-12h][DR-12]
6415,14361 Retry 後 ! 消失，成功的照片不重做；失敗不算做過 [D1-04][DR-12e]
7875,14361 internet connection」，不開始處理 [D1-05]
2035,14369 • Advanced 相關規則不適用（批次只支援 Standard） [DR-12b][DR-12f][DR-12g]
4955,14385 • 沒有取消，要等全部做完；跑完前不能存檔 [D1-03][D1-02]
6415,14391 • Retry 後的總結以整批照片累計計算，不是只算這次重試：例 15 張先「12
575,14393 • 不扣點：AI Enhance 沒有扣點機制，Enhance 按鈕不顯示點數；Crop /
7875,14399 • App 被殺：Batch Edit Room 不見，已做的 AI Enhance 結果也不會留下
2035,14407 • 10/E Advanced 的 7 個 Scene Presets（General / Portrait / Scenery / Pets /
6415,14421 completed, 3 failed」→ Retry 3 張、2 張成功 →「14 completed, 1 failed」，按
575,14423 Adjustment 也免費 [DR-11][D5-01b]
7875,14429 （Standard 結果不存到 My AI Artwork） [D1-05][D1-10]
2035,14437 Concert / Product / Anime）批次不支援 [DR-09b][DR-09]
6415,14451 鈕變「Retry Failed (1)」；全部成功時不再顯示失敗訊息與 Retry 按鈕 [D1-04]
575,14461 • 「全圖」＝批次內全部照片；做完即套用，不用逐張 ✓ [DR-10]
575,14499 • 從 AI Enhance Shortcut 多選直接落在這頁 [DR-02]
4646,14507 Creating Your AI Image
575,14529 • Enhance 按鈕上方顯示批次縮圖列，點縮圖切換目前照片 [D1-12]
4663,14573 Enhancing 3 / 20
6157,14799 !
6265,14799 !
6319,14799 !
7725,14799 !
7779,14799 !
7833,14799 !
9185,14799 !
9239,14799 !
9293,14799 !
9031,14841 No internet connection
4695,14898 Enhance
315,14901 Enhance
1770,14901 Enhanced
3235,14901 Enhance
6128,14901 Retry Failed (3)
7589,14901 Retry Failed (7)
9049,14901 Retry Failed (7)
4585,14936 Maximize detaill and clarity with advanced AI.
233,14944 Maximize detaill and clarity with advanced AI.
1693,14944 Maximize detaill and clarity with advanced AI.
3153,14944 Maximize detaill and clarity with advanced AI.
6073,14944 Maximize detaill and clarity with advanced AI.
7533,14944 Maximize detaill and clarity with advanced AI.
8993,14944 Maximize detaill and clarity with advanced AI.
160,15228 AI Enhance Confirm Dialog
160,15268 default
575,15348 【Requirement 】
575,15385 • 每次按 Enhance 都跳；套用到批次全部照片；不扣點、不顯示 Credits [DR-12]
575,15411 [DR-12h][DR-11]
575,15439 • 文案以畫面為準（已與 RD 確認）：Enhance {xx} photos? / Processing takes a
575,15469 moment and cannot be canceled once started. / [Cancel] [Start] [D1-02][D1-03]
575,15507 • Cancel  → 回 AI Enhance；Start  → 開始批次處理 [DR-12]
258,15677 Enhance {xx} photos?
210,15717 Processing takes a moment and cannot be
275,15738 canceled once started.
251,15792 Cancel
402,15792 Start
160,16380 Discard Dialog
160,16420 default
590,16500 【Requirement 】
590,16537 • 只有做過編輯才跳這個 Dialog；還沒做任何編輯時按 Home / Replace photo 直
590,16567 接離開 [D1-08]
590,16597 • 從 Replace photo 來 → Discard：回 Photo Picker 批次 Tab，原本選過的照片
590,16627 保持勾選，這次 Batch Edit 的所有編輯都丟掉 [D1-08][D1-08b]
590,16657 • 從 Home 來 → Discard：回 Launcher [D1-08]
590,16687 • Keep Editing：留在 Batch Edit Room [D1-08]
590,16725 • 文案：「Discard changes?」「Your edits to these photos will be lost.」[D1-08b]
590,16763 • Standard AI Enhance 的結果目前不會存到 My AI Artwork [D1-10]
283,16833 Discard changes?
232,16865 Your edits to these photos will be lost.
253,16927 Discard
384,16927 Keep Editing
160,17574 Batch Save Page
1620,17574 Batch Save Page
160,17614 saving
1620,17614 saved
590,17694 【Requirement 】
2050,17694 【Order of Artwork】
1661,17709 9:41
590,17731 • 存檔中顯示「Saving k / N」「Please do not leave this page or quit the
2050,17731 • 新的 Batch Save page：縮圖格狀＋「Saved N photos」 [D1-07]
590,17761 app.」，存完才進 Batch Save page（跟進 Meitu） [D5-01b]
2050,17761 • 左上 ‹ = 回 Batch Edit Room；右上 Home = 回 Launcher [D1-07]
2050,17791 • 底部固定「Edit Next Batch」：進 Photo Picker 批次 Tab、不勾任何照片；在
1644,17798 Saved 12 photos
590,17799 • 存成新檔，不覆蓋原圖 [D1-06]
2050,17821 Picker 按返回 → 回 Batch Edit Room，顯示原本的編輯狀態（day-1 照 Android
590,17837 • 存全部輸入照片（含沒編輯過的），每張都存成新檔 [D1-06]
2050,17851 單張 Edit Room 現行做法） [D1-07]
2050,17881 • 註：iOS 單張 Edit Room 今天的行為不同（Save page → Next edit → Picker →
2050,17911 返回 → Launcher），批次 day-1 以 Android 為準 [D1-07]
2050,17941 • 縮圖不能點開放大 [D1-07]
2050,17979 • Rating dialog 一次批次算 1 次存檔；IAP flyer / 廣告照常 [D1-07]
304,18066 Saving 3 / 20
255,18095 Please do not leave this page or quit
333,18113 the app.
1756,18459 Edit Next Batch
