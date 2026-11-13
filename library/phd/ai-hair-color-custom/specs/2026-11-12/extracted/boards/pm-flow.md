# Spec - Flow

Source: PM Figma https://www.figma.com/design/vhIp15PMJcwOcWJ6E9Q4JE/AI-Hair?node-id=3287-89 · board `pm-flow` · region of 3287:93 · box x=0 y=320 w=3377 h=2524 (absolute Figma canvas points)
Figma text layer (inventory read 2026-11-12, figma-pm / qa1); no PDF export exists, so no OCR. Columns: y, x from the board's top-left, text; [phone] = inside a phone mockup. Lines of one multi-line text are spaced 18 pt apart.

```
    60     60  Overview
   112     60  • 11/E 新增 Custom：用戶自己挑 style（11 種）＋自己給 1–2 個顏色，不走 CMS 色票 [D6-00]
   130     60  • Custom 是整條色票列的第一顆，點它開 panel；panel 三區：① Style ② Color ③ Generate [D6-01][D6-02]
   148     60  • `solid_color` 只收一個顏色，其餘 10 種兩色都必填 [D6-04]
   166     60  • 收合 panel ＝ apply；設定只有「離開 room」與「自己覆蓋」會消失 [D6-08][D6-09]
   184     60  • 一張圖 6 credit，與 template 同價；lifecycle 同 10/E 原地等 [D6-07]
   202     60  • ⚠ Custom 廠商實測 42–48 秒／張，需分段安撫字串；template 確定是短秒數，不受影響 [D6-11]
   220     60  • Custom 的 style 要上 CMS（與以往的 custom 不同）[D6-13]
   238     60  • Deeplink 可直接 locate 在 Custom 並帶 style guid [D6-14]
   351     60  Intro Demo
   351    637  Entry: Color Selection ›「Custom」
   404    637  入口：色票列第一顆 Custom（StyleMenuCustomStyleCell）[D6-01][D6-19]
   404   1130  點 Custom → 開半屏 sheet，三區由上到下 [D6-02][D6-16]
   404   1560  style + 1~2 色齊備 → sheet 內 AIFeatureGenerateButton 亮起 [D6-07][D6-16]
   404   1990  原地等 42–48 秒，分段安撫字串 [D6-11]
   404   2420  結果原地顯示，Intensity 槽填入 + Retry [D6-12]
   475     85  [phone] 9:41
   476    663  [phone] 9:41
   476   1156  [phone] 9:41
   476   1586  [phone] 9:41
   476   2026  [phone] 9:41
   476   2446  [phone] 9:41
   476   2886  [phone] 9:41
   520    919  [phone] 100
   520   1412  [phone] 100
   520   1842  [phone] 100
   520   2282  [phone] 100
   520   2702  [phone] 100
   520   3142  [phone] 100
   769   1484  [phone] ⌄
   769   1914  [phone] ⌄
   771   1146  [phone] Custom
   771   1576  [phone] Custom
   786   2094  [phone] Applying your new hair color...
   811   1146  [phone] Style
   811   1576  [phone] Style
   834   1037  tap
   852   1037  Custom
   858   1529  選色
   858   2380  42–48s
   918   1146  [phone] Face
   918   1214  [phone] Bangs
   918   1282  [phone] Highlight
   918   1350  [phone] Balayage
   918   1418  [phone] Ombré
   918   1486  [phone] Solid
   918   1576  [phone] Face
   918   1644  [phone] Bangs
   918   1712  [phone] Highlight
   918   1780  [phone] Balayage
   918   1848  [phone] Ombré
   918   1916  [phone] Solid
   966   1146  [phone] Base Color
   966   1576  [phone] Base Color
   979    108  [phone] AI Hair Color
   996   2440  [phone] Intensity
   996   2747  [phone] 100
   996   2880  [phone] Intensity
   996   3187  [phone] 50
  1013     83  [phone] Go beyond traditional hair colors! Explore everything from subtle highlights to vibrant, bold shades.
  1021   1174  [phone] +
  1021   1604  [phone] +
  1041    765  [phone] Solid
  1041    831  [phone] Multicolor
  1041   2128  [phone] Solid
  1041   2194  [phone] Multicolor
  1041   2548  [phone] Solid
  1041   2614  [phone] Multicolor
  1041   2988  [phone] Solid
  1041   3054  [phone] Multicolor
  1078   1146  [phone] Highlight Color
  1078   1576  [phone] Highlight Color
  1133   1174  [phone] +
  1133   1604  [phone] +
  1150    653  [phone] Custom
  1150    721  [phone] Platinum
  1150    789  [phone] Champagne
  1150    857  [phone] Periwinkle
  1150    925  [phone] Sakura
  1150    993  [phone] Peach Gold
  1150   2016  [phone] Custom
  1150   2084  [phone] Platinum
  1150   2152  [phone] Champagne
  1150   2220  [phone] Periwinkle
  1150   2288  [phone] Sakura
  1150   2356  [phone] Peach Gold
  1150   2436  [phone] Custom
  1150   2504  [phone] Platinum
  1150   2572  [phone] Champagne
  1150   2640  [phone] Periwinkle
  1150   2708  [phone] Sakura
  1150   2776  [phone] Peach Gold
  1150   2876  [phone] Custom
  1150   2944  [phone] Platinum
  1150   3012  [phone] Champagne
  1150   3080  [phone] Periwinkle
  1150   3148  [phone] Sakura
  1150   3216  [phone] Peach Gold
  1156    213  [phone] Try Now
  1185    764  [phone] Generate
  1185    971  [phone] 6
  1185   2127  [phone] Generate
  1185   2334  [phone] 6
  1185   2563  [phone] Retry
  1185   2754  [phone] 6
  1185   3003  [phone] Retry
  1185   3194  [phone] 6
  1208    217  [phone] Don’t show again
  1221   1257  [phone] Generate
  1221   1464  [phone] 6
  1221   1687  [phone] Generate
  1221   1894  [phone] 6
  1236    663  [phone] ✕
  1236    768  [phone] ↺
  1236    872  [phone] ↻
  1236    977  [phone] ✓
  1236   2026  [phone] ✕
  1236   2131  [phone] ↺
  1236   2235  [phone] ↻
  1236   2340  [phone] ✓
  1236   2446  [phone] ✕
  1236   2551  [phone] ↺
  1236   2655  [phone] ↻
  1236   2760  [phone] ✓
  1236   2886  [phone] ✕
  1236   2991  [phone] ↺
  1236   3095  [phone] ↻
  1236   3200  [phone] ✓
  1238   1922  generate
  1426   1989  ⌄ 收合 ＝ apply
  1485   1989  收合 panel（點空白處或收合鍵）＝ apply；Custom 變選取，外層 Generate 也能生成 [D6-08]
  1560   1801  [phone] 9:41
  1604   2057  [phone] 100
  1660   1560  另一條路徑（D6-22 / D6-23）：panel 不收合、直接在 panel 內按 Generate → 結果回填上方 edit area，panel 內 Generate 上方出現 44pt Intensity row（預設 100%），按鈕變 Retry。該狀態見 Spec - UI 的 result_in_panel。
  2125   1903  [phone] Solid
  2125   1969  [phone] Multicolor
  2234   1791  [phone] Custom
  2234   1859  [phone] Platinum
  2234   1927  [phone] Champagne
  2234   1995  [phone] Periwinkle
  2234   2063  [phone] Sakura
  2234   2131  [phone] Peach Gold
  2269   1902  [phone] Generate
  2269   2109  [phone] 6
  2320   1801  [phone] ✕
  2320   1906  [phone] ↺
  2320   2010  [phone] ↻
  2320   2115  [phone] ✓
```
