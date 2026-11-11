# Flow：跨 tab Undo

Source: Cutout Reset Undo Redo Spec 11E.pdf · board `pm-11e-crosstab` · region x=0 y=1650 w=2480 h=1474 (PDF points)
PDF text layer (mupdf structured text; the text layer reads cleanly and this Windows machine has no macOS Vision OCR, so no OCR). Columns: y, x (canvas points), text.

```
  1702    145  Flow：跨 tab Undo
  1760    156  規則：undo / redo 的變更不在目前 tab 時，自動切到該變更所在的 tab，讓使用者看到變化
  1830    667  A. Background tab (default locate)
  1830   1342  B. 按 Undo → 復原 ②
  1830   2017  C. 再按 Undo → 復原 ①
  1884    180  9:41
  1893    702  9:41
  1893   1377  9:41
  1893   2052  9:41
  2242   1153  按 Undo
  2242   1828  再按 Undo
  2449    994  33
  2449   1669  33
  2488    784  Background
  2488    885  Stroke
  2488   1459  Background
  2488   1560  Stroke
  2488   2134  Background
  2488   2235  Stroke
  2528    695  Solid
  2528    749  Wall
  2528    799  Romantic
  2528    877  Blue
  2528    928  Summer
  2528   1000  Romantic
  2528   1078  Blue
  2528   2045  Solid
  2528   2099  Wall
  2528   2149  Romantic
  2528   2227  Blue
  2528   2278  Summer
  2528   2350  Romantic
  2528   2428  Blue
  2555   1074  TRY
  2555   1722  TRY
  2555   1782  TRY
  2555   1842  TRY
  2555   1902  TRY
  2555   1962  TRY
  2555   2022  TRY
  2555   2082  TRY
  2555   2141  TRY
  2557    713  TRY
  2557    773  TRY
  2557    833  TRY
  2557    893  TRY
  2557    953  TRY
  2557   1013  TRY
  2557   1073  TRY
  2557   1384  TRY
  2557   1440  TRY
  2557   1496  TRY
  2557   1552  TRY
  2557   1608  TRY
  2557   1664  TRY
  2557   2438  TRY
  2615    184  Auto
  2615    257  Box
  2615    324  Circle
  2615    393  Brush
  2615    462  Eraser
  2641    474  Cuto
  2716    667  編輯  ①  → 編輯  ②  → locate  ③ ：
  2716   1342  復原 ②「調整 Stroke」
  2716   2017  復原 ①「選 Wall 背景」
  2746    667  ① 選 Wall 背景（Background tab）
  2746   1342  → 變更在 Stroke tab，自動切到 Stroke
  2746   2017  → 變更在 Background tab，自動切回
  2776    667  ② 調整 Stroke（Stroke tab）
  2776   1342  tab
  2776   2017  Background tab
  2806    667  ③  locate 回 Background tab
  2806   2017  → 已回到初始狀態：Reset、Undo
  2836   2017  disabled
```
