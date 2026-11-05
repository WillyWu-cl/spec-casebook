# Spec - UI

Source: PM Figma https://www.figma.com/design/lSk4JUgbXG3DjauMLS9Et7/Image-to-Video?node-id=6336-3478 · board `pm-ui` · node 6366:5664/pm-ui · box x=-3910 y=-968 w=2965 h=3967 (absolute Figma canvas points)
Figma text layer (inventory read 2026-11-04, figma-pm / qa1); no PDF export exists, so no OCR. Columns: y, x, text (one line per text line); [phone] = inside a phone mockup.

```
  -868  -3850  Save & Share · Reuse (NEW)
  -788  -2899  【Requirement】
  -788  -1405  【Requirement】
  -773  -3275  [phone] 9:41
  -773  -1775  [phone] 9:41
  -768  -3850  default
  -768  -2350  template_video
  -727  -3157  [phone] Save & Share
  -727  -1657  [phone] Save & Share
  -726  -1405  • Template 影片不顯示 Reuse（沒有 model 設定可選）— 同今天 Template Save & Share [D0-06]
  -716  -2899  • 原 Prompts 區的 Prompt Reuse row 升級：同一顆 Reuse 帶回整組設定（頁面只剩一顆 Reuse）；區塊標題改為「Prompts & Settings」 [D0-04b][D1-10]
  -696  -3850  （Custom 影片）
  -645  -2899  • 顯示 model＋Duration · Quality · Sound 摘要與 prompt [D2-01]
  -573  -2899  • 按 Reuse → 回 I2V Custom tab（設定＋prompt 帶好、照片欄空） [D1-04]
  -502  -2899  • 從 I2V tab、Recent (Video) 點影片都會到這頁，一樣顯示 Prompts & Settings＋Reuse；列表 tile 上不另加按鈕 [D1-01][D0-05][D1-07]
  -430  -2899  • 只有生成成功的 Custom 影片顯示；4/E 前舊影片 day-1 不顯示（待 RD） [D2-03][D2-03b]
  -368  -1635  [phone] Save
  -362  -3127  [phone] Save
  -359  -2899  • 今天 Prompt Reuse 帶回什麼不追問，升級後行為以本頁為準 [D0-07b]
  -321  -3282  [phone] Prompts & Settings
  -315  -1784  [phone] Share to
  -281  -3244  [phone] Kling 2.6 · 10s · Pro · Sound On
  -255  -3272  [phone] A girl turning around in the snow, hair flowing in the wind
  -230  -1736  [phone] Instagram
  -230  -1639  [phone] Facebook
  -230  -1531  [phone] More
  -177  -1784  [phone] You might also like
  -167  -3011  [phone] Reuse
  -127  -3284  [phone] Share to
   -42  -3236  [phone] Instagram
   -42  -3139  [phone] Facebook
   -42  -3031  [phone] More
   -21  -1763  [phone] Draw to Image
   -21  -1626  [phone] AI Removal
   -21  -1498  [phone] AI Removal
   -12  -3284  [phone] You might also like
   382  -3850  I2V Custom · Reuse 進房
   462  -2905  【From Save & Share Reuse】
   462  -1405  【Model 已下架】
   477  -3275  [phone] 9:41
   477  -1775  [phone] 9:41
   482  -3850  from_video
   482  -2350  model_sunset
   522  -3010  [phone] 0
   522  -1510  [phone] 0
   531  -2905  • 帶回 model、Duration、Video Quality、Generate Sound by AI、Start/End 開關、prompt；不帶照片、Inspiration [D2-01][D0-06b]
   538  -1405  • Reuse 照樣能按；model 改用 default，其他參數能帶就帶、不支援回預設 (同 4/E 切換 model 規則) [D2-02]
   569  -3180  [phone] Custom
   569  -3099  [phone] Templates
   569  -1680  [phone] Custom
   569  -1599  [phone] Templates
   600  -2905  • intro（iOS demo / Steps、AI Processing Notice、Android 說明 sheet）照今天先出，看到 Custom 頁才跳 toast「Settings applied」；toast 優先於 panel [D1-04b][D1-08]
   601  -3282  [phone] Model
   601  -1782  [phone] Model
   614  -1405  • 進房彈出下架 toast (兩句要換行)「This model is no longer available. Switched to recommended model.」，不彈「Settings applied」 [D2-02b][D1-09]
   643  -3226  [phone] Kling 2.6
   643  -1726  [phone] Kling 3.0
   669  -2905  • 房內切 model 照 4/E 記住設定、不支援回預設；離房 reset (同 Image to Video Custom) [D1-06]
   689  -1405  • 按 Generate 照 default model action id 正常扣點 [D3-04]
   693  -3282  [phone] Specify Video Start / End 
   693  -1782  [phone] Specify Video Start / End 
   724  -3282  [phone] Add your images
   724  -1782  [phone] Add your images
   738  -2905  • Back ‹ 回 Save & Share 頁 [D1-05]
   807  -2905  • Reuse 不扣點；Generate 按鈕顯示該 model 現在的點數；沿用各 model 現有 action ID [D3-01][D3-02][D4-01]
   876  -2905  • Free trial 同 I2V Custom [D3-03]
   886  -3282  [phone] Prompts *
   886  -1782  [phone] Prompts *
   888  -3028  [phone] My Prompt
   888  -1528  [phone] My Prompt
   944  -3269  [phone] A girl turning around in the snow, hair flowing in the wind
   944  -1769  [phone] Describe the subject, action, and overall scene, e.g. A woman walking in a park on a sunny afternoon.
  1058  -2999  [phone] 58/2,500
  1058  -1492  [phone] 0/2,500
  1096  -1732  [phone] This model is no longer available.
  1113  -3269  [phone] Try with inspirations
  1113  -1769  [phone] Try with inspirations
  1113  -1732  [phone] Switched to recommended model.
  1144  -3167  [phone] Settings applied
  1211  -3144  [phone] Generate
  1211  -2986  [phone] 30
  1211  -1644  [phone] Generate
  1211  -1486  [phone] 30
  1632  -3850  My AI Artwork – Image to Video tab
  1712  -2905  【Requirement】
  1727  -3275  9:41
  1732  -3850  default
  1771  -3159  My AI Artwork
  1773  -2905  • 同 Image to Video 今天的 Artwork；今天只有 Create More（空白進 Custom tab），兩平台一樣 [D0-07]
  1821  -3284  Image to Video
  1821  -3161  AI Art
  1821  -3102  AI Face Swap
  1821  -2989  AI Outfit
  1834  -2905  • Create More：照今天直接進 Custom tab、default model [D1-03][D0-03]
  1868  -2983  [phone] Select
  1894  -2905  • 點 Custom 影片 → Save & Share（含 Reuse） [D1-01]
  1908  -3122  [phone] 2025/01/20
  1928  -3122  [phone] Image to Vdieo - A Template Name 2
  1963  -3243  [phone] Processing...
  2010  -3122  [phone] 9 minutes remaining ...
  2066  -3122  [phone] 2025/01/20
  2086  -3122  [phone] Custom
  2181  -3276  [phone] 0:04
  2224  -3122  [phone] 2025/01/20
  2244  -3122  [phone] Template Name 2
  2339  -3276  [phone] 0:04
  2382  -3122  [phone] 2025/01/20
  2402  -3122  [phone] Image to Vdieo - A Template Name 2
  2484  -3012  [phone] Retry
  2540  -3122  [phone] 2025/01/20
  2560  -3122  [phone] Image to Vdieo - A Template Name 2
  2642  -3012  [phone] Report
  2698  -3122  [phone] 2025/01/20
  2718  -3122  [phone] Image to Vdieo - A Template Name 2
  2800  -3012  [phone] View Details
  2868  -3146  Create more
```
