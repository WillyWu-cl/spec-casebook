# 主線 - 選片到拿到成品

Source: AI Video Enhance PM Figma (mppB4GYkuVMVvHrdBeSAAU) · board `pm-main-flow` · page 309:643 · section 369:438
Figma text layers (text-p1.json; no PDF in this spec set, so no OCR). Columns: y, x (canvas points), text.

```
    60     80  三入口導到同一套全螢幕面板；Launcher／AI Magic 先經媒體選擇器，Timeline 帶片段直接預開面板（§4.1）
    80     80  計價：credit = 選段秒數（無條件進位為整秒）× 每秒費率(Mode, Resolution, 來源 fps)；Style 不影響計價（§6.1）
   100     80  commit 點＝成功上傳到 server：上傳中 Cancel 不扣款、不建立任務；成功上傳才扣 credit（§8）
   120     80  背景生成 v1 無 cancel；成品同時進 Recent task／AI Magic > My Artwork／Template > My Artwork tab（§4.3、§8）
   140     80  面板記住上次的 Mode／Style／Resolution；Resolution 只提供 ≥ 來源檔位、上限 4K、2K v1 移除（§4.3、§5.2）
   160     80  首次建立背景任務時跳「開啟通知」彈窗（開啟通知／稍後）（§4.2、§9）
   180     80  計費 SKU：genvideo_1_sec_byteplus_{mode}_{style}_{resolution}_{fps}，例 std_hd_1080p_30fps（§6.3）
   200     80  本輪不做：送出前 Before/After 預覽、高價額外確認、結果頁分享／cross-sell、失敗一鍵重試（§2.2）
   306   1982  TBD · 處理中列樣式（進度／預估時間）
   306   2932  TBD · Edit More 去處
   328   1030  Trim 上限依 Mode：Standard 8 min／Professional 2m 30s（切換規則見本 section 右下「Trim × Mode」）
   361     80  既有畫面 · 無 screen map，low-fi
   361    555  §4.2 步驟 1 · v1 單片段
   361   1030  §5、§6.4 例：3.96s→4s × 1080p Std 30fps（2/秒）= 8
   361   1505  §8.2–3 · 尚未送達 server：Cancel 不扣款、不建立任務
   361   1972  §4.3、§9 · v1 無 cancel，使用者可離開 App
   361   2447  §9 · 系統通知，文案為 spec 原文
   361   2922  §4.1 · 成品同時進 Recent task／AI Magic > My Artwork／Template > My Artwork tab（§4.3）
   386     80  Launcher（入口：Video Enhance 捷徑）
   386    555  媒體選擇器（選 1 片段）
   386   1030  面板・預設（Pro+：Enhance＋即時 credit）
   386   1505  面板・上傳中（前景 blocking，可 Cancel）
   386   1972  Recent task・處理中（背景生成）
   386   2447  推播通知（背景生成成功）
   386   2922  結果頁
   454    104  9:41
   454    579  9:41
   454   1054  9:41
   454   1529  9:41
   454   1996  9:41
   454   2946  9:41
   497   1082  Video Enhance
   497   1627  Video Enhance
   497   2024  Video Enhance
   499   1331  0
   502   2529  Try Pro+ 7 days for free
   503   2509  Your video is ready. Tap to view.
   546   2740  View
   548   1988  Recent task
   552   2471  Close
   587    250  Image
   588    922  觸發 TBD
   588   1397  檢查通過
   597    608  Clip
   597    704  Selected clip
   597    856  Clip
   598   2080  Video Enhance · processing
   617   2021  Clip
   630   1195  Preview
   630   1670  Preview
   672   2457  Turn one photo to cinematic reel
   698   2080  Video Enhance · completed
   717   2021  Clip
   721    608  Clip
   721    732  Clip
   721    856  Clip
   726   2080  Date · duration
   740   3068  Result preview
   748   1872  成功上傳＝commit 點・扣 credit
   748   2339  背景生成成功
   754   2461  New Project
   754   2579  Video Edit by Chat
   754   2698  Video
   756   1320  00:03.96
   756   1795  00:03.96
   758   1046  Selected Length
   758   1521  Selected Length
   761    124  Shortcut
   761    243  Shortcut
   761    343  Video Enhance
   770   2698  Enhance
   782   1674  25%
   798   2080  Video Enhance · completed
   799   1166  Trim · drag in / out
   799   1641  Trim · drag in / out
   814   2688  NEW
   817   2021  Clip
   826   2080  Date · duration
   844   1046  Mode
   844   1521  Mode
   845    608  Clip
   845    732  Clip
   845    856  Clip
   848   1625  Video uploading...
   861    120  Tool
   861    208  Tool
   861    296  Tool
   861    384  Tool
   870   2456  Image to Video
   870   2544  Character Motion Swap
   870   2632  AI Mini
   870   2720  Cinematic Reel Creator
   872   1608  Please keep the app open
   877   1103  Standard
   877   1270  Professional
   877   1578  Standard
   877   1745  Professional
   886   2632  Drama
   914   1046  Style
   914   1521  Style
   922   1573  Cancel
   947   1120  HD
   947   1284  Natural
   947   1595  HD
   947   1759  Natural
   957    120  Tool
   957    208  Tool
   957    296  Tool
   957    384  Tool
   969    608  Clip
   969    732  Clip
   969    856  Clip
   974   2456  Text to
   974   2544  Auto Edit
   974   2632  Auto
   974   2720  Photo Enhance
   984   1046  Frame rate
   984   1521  Frame rate
   990   2456  Video
   990   2632  Captions
  1012   3061  Save Result
  1017   1173  Same as source
  1017   1648  Same as source
  1046   2457  What’s Trending
  1048   2719  View more
  1054   1046  Resolution
  1054   1521  Resolution
  1072   3057  Add to Timeline
  1087   1086  720p
  1087   1199  1080p
  1087   1327  4K
  1087   1561  720p
  1087   1674  1080p
  1087   1802  4K
  1088    131  Image
  1088    250  Image
  1088    369  Image
  1093    608  Clip
  1093    732  Clip
  1093    856  Clip
  1123   3365  All
  1123   3431  All
  1130   3077  Edit More
  1164   1137  Enhance · 8 credits
  1164   1612  Enhance · 8 credits
  1170   2465  USA Winner
  1170   2593  Team ARG
  1170   2721  USA Cam
  1170   2849  Team BR
  1170   2977  Baseball Cam
  1198     96  Home
  1198    164  AI Magic
  1198    303  Project
  1198    371  Pro
  1198   2449  Home
  1198   2522  AI Magic
  1198   2595  Template
  1198   2667  Project
  1198   2740  Mine
  1214   2457  Meme Dance Creator
  1216   1053  非 Pro+ → Upgrade to Pro+／credit 不足 → Top Up：見「分岔」section
  1216   2719  View more
  1306   1040  TBD · First-run 文案與關閉方式
  1306   1515  TBD · 已開通知者是否略過
  1311   3365  All
  1311   3431  All
  1325   2023  面板・Trim 上限 × 切換 Mode（9/29）
  1366     80  既有畫面 · 無 screen map，low-fi
  1366   1030  §10.1 · 首次進入面板顯示 bottom toast／小卡，看過即不再出現
  1366   1505  §4.2 步驟 6、§9、§10.4 · 成功上傳並扣 credit 後，首次建立背景任務時跳出
  1377   2023  上限：Standard 8:00／Professional 2:30。選段秒數無條件進位後與上限比較（例：2:30.4 → 151 秒 > 150 秒，算超過）。
  1377   2465  Color Mix
  1377   2593  Dancing Pet
  1377   2721  Puppy
  1391     80  AI Magic（入口：Video Enhance 卡）
  1391   1030  面板・First-run 一次性說明
  1391   1505  面板・首次：開啟通知提示彈窗
  1419   2023  ① 預設選段：從 00:00 開始，長度取「影片長度」與「目前 Mode 上限」較短者（Standard 最多 8:00；進面板時若 Mode 為 Professional，最多 2:30）。
  1421   2457  AI-Powered Creation
  1423   2719  View more
  1445   2023  ② 選段 ≤ 2:30：Standard ↔ Professional 可自由切換，選段不變，只更新 credit。
  1459    104  9:41
  1459   1054  9:41
  1459   1529  9:41
  1471   2023  ③ 選段 > 2:30（只會發生在 Standard）時點 Professional：擋下不切換，Mode 維持 Standard、選段不變，跳 toast 3 秒提醒上限長度。Professional chip 外觀維持一般 unselect 樣式，不做 disable。不自動縮短選段，避免使用者選好的範圍被改掉。
  1501     96  AI Magic
  1502   1082  Video Enhance
  1502   1627  Video Enhance
  1504   1331  0
  1523   2023  ④ 使用者把選段拖到 ≤ 2:30 後再點 Professional → 正常切換。
  1549   2023  ⑤ 已在 Professional：拖到 2:30 時把手停住，無法超過。切回 Standard → 選段不變，上限放寬為 8:00，可自己拖長。
  1575   2023  ⑥ 底部縮圖列比例只看影片長度，不隨 Mode 改變：影片 ≤ 8:00 整支撐滿固定寬度；> 8:00 可橫向捲動，8:00＝一個畫面寬。切 Mode 不重排縮圖列。
  1584   2465  AI Anime Video
  1584   2593  AI Anime
  1584   2721  Voice Changer
  1601   2023  ⑦ Timeline 入口帶入的 clip 規則相同：選段 > 2:30 時點 Professional → 跳同一個 toast。
  1628   2457  Recent Projects
  1630   2719  View more
  1635   1195  Preview
  1635   1670  Preview
  1643   2023  UI
  1660    165  Card
  1660    344  Card
  1672   2577  2023/11/06   10:51 AM
  1688   2023  • 選段 > 2:30 時點 Professional → toast（3 秒）："Professional mode supports up to 2m 30s. Shorten your selection to switch."
  1688   2577  Project 1
  1714   2023  • Mode ⓘ bubble："Standard: up to 8 minutes. Professional: up to 2m 30s."
  1740   2023  • 拖到上限：把手停住＋輕震動＋bubble "Up to 8 minutes in Standard mode"／"Up to 2m 30s in Professional mode"。
  1753   2654  09:18
  1753   2703  456 MB
  1754   1574  Turn on notifications
  1754   2597  9:16
  1755   1894  成功上傳・首次
  1761   1320  00:03.96
  1761   1795  00:03.96
  1763   1046  Selected Length
  1763   1521  Selected Length
  1780   1574  We'll let you know when it's done.
  1782   2023  ① Standard 選 5m 00s（Professional 外觀正常）
  1782   2275  ② 點 Professional → 跳 toast 提醒上限，不切換
  1782   2527  ③ 拖到 2m 20s → 再點 Professional → 切換成功
  1804   1166  Trim · drag in / out
  1804   1641  Trim · drag in / out
  1804   2577  2023/11/06   10:51 AM
  1820   2577  Project 1
  1830   1659  Turn On
  1849   1046  Mode
  1849   1521  Mode
  1856    134  Video Enhance
  1856    344  Card
  1876   1672  Later
  1880   2110  Preview
  1880   2362  Preview
  1880   2614  Preview
  1882   1103  Standard
  1882   1270  Professional
  1882   1578  Standard
  1882   1745  Professional
  1885   2654  09:18
  1885   2703  456 MB
  1886   2597  9:16
  1919   1046  Style
  1919   1521  Style
  1936   2577  2023/11/06   10:51 AM
  1942   2182  5m 00s
  1942   2434  5m 00s
  1942   2686  2m 20s
  1943   2035  Selected Length ⓘ
  1943   2287  Selected Length ⓘ
  1943   2539  Selected Length ⓘ
  1952   1120  HD
  1952   1284  Natural
  1952   1595  HD
  1952   1759  Natural
  1952   2577  Project 1
  1989   1046  Frame rate
  1989   1521  Frame rate
  2005   2035  00:30 – 05:30   (video 06:00)
  2005   2287  00:30 – 05:30   (video 06:00)
  2005   2539  00:30 – 02:50   (video 06:00)
  2017   2654  09:18
  2017   2703  456 MB
  2018   2597  9:16
  2022   1173  Same as source
  2022   1648  Same as source
  2029   2035  Mode ⓘ
  2029   2287  Mode ⓘ
  2029   2539  Mode ⓘ
  2052    165  Card
  2052    344  Card
  2059   1046  Resolution
  2059   1521  Resolution
  2059   2045  Standard
  2059   2116  Professional
  2059   2297  Standard
  2059   2368  Professional
  2059   2549  Standard
  2059   2619  Professional
  2072   2457  Get Cyberlink App
  2092   1086  720p
  2092   1199  1080p
  2092   1327  4K
  2092   1561  720p
  2092   1674  1080p
  2092   1802  4K
  2095   2295  Professional mode supports up to 2m 30s. Shorten your selection to switch.
  2097   2082  Enhance · X credits
  2097   2586  Enhance · X credits
  2124   2525  PhotoDirector
  2133   2731  Try Now
  2142   2525  AI photo editing & Object Removal
  2147   2334  Enhance · X credits
  2169   1137  Enhance · 8 credits
  2169   1612  Enhance · 8 credits
  2203     96  Home
  2203    164  AI Magic
  2203    303  Project
  2203    371  Pro
  2208   2525  Vivid Glam
  2217   2731  Try Now
  2226   2525  Beauty Edits & Camera Filters
  2228   1531  按鈕後落點 TBD（Gaps #6）
  2284   1071  Feature purpose · TBD
  2292   2525  MyEdit
  2301   2731  Try Now
  2309   1071  Uses credits · TBD
  2310   2525  Free AI Image Generator
  2334   1071  Dismiss control · TBD
```
