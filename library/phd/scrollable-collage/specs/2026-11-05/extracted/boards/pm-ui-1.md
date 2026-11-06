# pm-ui-1

Source: PM Figma https://www.figma.com/design/zrl1BBEyqTvdLfjtaT8g6I/Collage?node-id=2171-2 · board `pm-ui-1` · node 2214:6/pm-ui-1 · box x=3261 y=5811 w=10170 h=3180 (absolute Figma canvas points)
Figma text layer (inventory read 2026-11-05, figma-pm / qa1); no PDF export exists, so no OCR. Columns: y, x (absolute Figma canvas points), text (one line per text line); [phone] = inside a phone mockup.

```
  5891   4271  【Requirement】
  5904   6561  CMS Sheet Link (click me)
  5928   4271  • Collage 房間一進去即顯示 banner「Try Scrollable Collage!」，點擊進 Scrollable Collage  [D1-07]
  5967   6561  CMS type: MOCK_CMS_TYPE（未定）
  6026   4271  • Scrollable Collage 是獨立新房間，不是 Collage 的新分類  [D0-04]
  6032   6573  欄位
  6032   6913  說明
  6032   7713  ID
  6055   3889  [phone] Try Scrollable Collage!
  6057   4207  [phone] ›
  6068   4123  [phone] NEW
  6079   3889  [phone] Swipe-able multi-page collage
  6080   6573  guid
  6080   6913  template id；deeplink template_guid 直接開 preview
  6080   7713  [D1-09]
  6094   4271  • 每次進 Collage 都看得到，預設不拿掉 banner  [D1-07]
  6128   6573  categories[]{guid, name, order}
  6128   6913  3–4 個，順序由 CMS，Year End 第一；deeplink category_guid
  6128   7713  [D2-07]
  6162   4271  • Collage 今天沒有 AI / Traditional 分類，banner 放在 Collage 房間頂部  [D1-16]
  6176   6573  tags
  6176   6913  NEW tag
  6176   7713  [D2-07]
  6224   6573  usageType
  6224   6913  free / purchase → PRO icon，匯出時擋
  6224   7713  [D3-02]
  6230   4271  • 其餘畫面同 Collage  [D0-04]
  6251   3311  Collage Room
  6251   3311  · banner
  6272   6573  photo count
  6272   6913  default 支援張數（瀑布流 / preview 顯示）
  6272   7713  [D1-01]
  6320   6573  page count
  6320   6913  canvas 頁數（1–10）
  6320   7713  [D1-12]
  6368   6573  thumbnails（東 / 西）
  6368   6913  每一頁一張；瀑布流顯示第一頁
  6368   7713  [F16]
  6432   6561  Template Spec
  6476   6561  • Day 1：20 顆 template  [F16]
  6514   6561  • 新內容：frame（mask 支援單張 / 多張 image）  [F17]
  6552   6561  • 新內容：背景 texture（需可 loop）  [D1-17]
  6590   6561  • 文字 / 字體 / 文字樣式 / text bubble / 貼紙沿用既有 CMS  [D1-14]
  6628   6561  • ⚠️ HANDOFF BLOCKER：CMS type string / contentVer 未定（MOCK_CMS_TYPE）；CMS sheet 連結未提供（MOCK_CMS_SHEET）  [D2-07]
  6941   4271  【Requirement】
  6941   5721  【Requirement】
  6952   4179  [phone] ≋
  6952   5629  [phone] ≋
  6956   3895  [phone] 9:41
  6956   5345  [phone] 9:41
  6978   4271  • Template 列表為瀑布流  [D1-01]
  6978   5721  • 每顆縮圖可向右滑動看後面的頁（同 SCRL）  [D2-08]
  6985   3879  [phone] ‹
  6985   5329  [phone] ‹
  6999   3921  [phone] Scrollable Collage
  6999   5371  [phone] Scrollable Collage
  7016   4271  • 每顆只標 default 支援張數 & canvas 頁數，不標直式 / 橫式  [D1-01]
  7046   5721  • 東西方 thumbnails，每一頁都顯示於 UI  [F16]
  7050   3877  [phone] Year End
  7050   3984  [phone] Category 2
  7050   4108  [phone] Category 3
  7050   5327  [phone] Year End
  7050   5434  [phone] Category 2
  7050   5558  [phone] Category 3
  7084   4271  • 縮圖顯示第一頁  [D2-08]
  7099   5721  • Deeplink scrollable_collage 落點在此頁；category_guid 定位分類  [D1-09]
  7103   4185  [phone] PRO
  7103   5635  [phone] PRO
  7122   4271  • 3–4 個 category，順序由 CMS，Year End 第一；NEW 用 CMS tag  [D2-03][D2-07]
  7190   4271  • CMS 設為 PRO 的 template 右上掛 PRO icon  [D3-02]
  7212   5457  [phone] →
  7258   4271  • Day 1 共 20 顆 template  [F16]
  7301   3311  Template Page
  7301   3311  · default
  7301   4761  Template Page
  7301   4761  · thumb_swipe
  7302   4072  [phone] 6 photos · 3 pages
  7302   5522  [phone] 6 photos · 3 pages
  7367   3885  [phone] 9 photos · 5 pages
  7367   5335  [phone] 9 photos · 5 pages
  7648   3885  [phone] 4 photos · 2 pages
  7648   4072  [phone] 11 photos · 5 pages
  7648   5335  [phone] 4 photos · 2 pages
  7648   5522  [phone] 11 photos · 5 pages
  7730   3998  [phone] PRO
  7730   5448  [phone] PRO
  7991   4271  【Requirement】
  7991   5721  【Requirement】
  8002   4179  [phone] ≋
  8002   5629  [phone] ≋
  8006   3895  [phone] 9:41
  8006   5345  [phone] 9:41
  8028   4271  • 點 template 進 preview，顯示支援張數 / 頁數  [D1-02]
  8028   5721  • CMS 設為 PRO 的 template 右上掛 PRO icon  [D3-02]
  8035   3879  [phone] ‹
  8035   5329  [phone] ‹
  8049   3921  [phone] Template
  8049   5371  [phone] Template
  8096   4271  • 可左右逐頁滑（同 SCRL）  [D2-09]
  8096   5721  • Free user 可先使用，匯出時才跳 IAP（同 AI 功能「Paid style applied」）  [D3-04]
  8110   5619  [phone] PRO
  8134   4271  • Thumbnail = template 的 default 配置  [F1]
  8172   4271  • Use Template → 進 Canvas  [D1-02]
  8210   4271  • Deeplink 帶 template_guid 直接開此頁  [D1-09]
  8351   3311  Template Preview
  8351   3311  · default
  8351   4761  Template Preview
  8351   4761  · pro
  8591   3861  [phone] ‹  swipe  ›
  8591   5311  [phone] ‹  swipe  ›
  8627   3885  [phone] 9 photos · 5 pages
  8627   5335  [phone] 9 photos · 5 pages
  8657   3885  [phone] Year End
  8657   5335  [phone] Year End
  8747   3877  [phone] Use Template
  8747   5327  [phone] Use Template
```
