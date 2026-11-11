# pm-adjust-strip-proposal

Source: PM Figma https://www.figma.com/design/iWlQTjlmfykHfmlNvg9J4p/Batch-Editing?node-id=0-1 · board `pm-adjust-strip-proposal` · node 382:2617 · box x=16611 y=9851 w=4924 h=2633 (absolute Figma canvas points)
Figma text layer (inventory read 2026-11-09, figma-pm / qa1); no PDF export exists, so no OCR. Columns: y, x (absolute Figma canvas points), text (one line per text line); [phone] = inside a phone mockup.

```
  9911  16711  提案一、Color › HSL / Curve：現況 + 縮圖列 vs 提案 A vs 提案 B；草稿，尚未寫進 spec
  9922  18517  RD 實作提案一
  9926  20212  提案二、Color › HSL / Curve：收合 ^ button UI 併入縮圖列；草稿，尚未寫進 spec
 10008  18517  問題
 10056  18517  收合時多一條空白： ︿ 自己獨佔一條灰色橫條（大約 35px），夾在縮圖列和 Light / Color / Details 之間，什麼都沒放，等於白白吃掉照片的高度。
 10104  18517  ︿ 卡在中間： 它不貼著 panel，也不屬於縮圖列，看不出是在收誰，位置也像是被擠在兩塊中間。
 10164  18517  Color › HSL
 10168  16711  Color › HSL
 10198  20212  提案二 · ﹀ 收進縮圖列右側
 10224  18517  現況（RD 實作方式）
 10228  16711  現況 + 縮圖列
 10228  17220  提案 A · 縮小縮圖列
 10228  17729  提案 B · 拖曳時隱藏縮圖列
 10640  20511  [phone] ↺
 10640  20564  [phone] ◧
 10737  18529  [phone] 空白＋﹀ 卡在中間
 10742  17909  [phone] 拖曳中：縮圖列隱藏
 11117  20212  拿掉那條空白，縮圖列直接貼在 panel 上緣，﹀ 放在縮圖列最右邊，跟著 panel 一起移動，是 panel 的把手；照片下緣只被蓋住約 20px（現況約 62px）。
 11143  18517  縮圖列和 panel 之間多一條空白，﹀ 卡在中間，看不出是在收合縮圖列還是 panel。
 11147  16711  縮圖列（62px）疊在照片下緣：照片可見高度約 232 → 170px，少了約 27%。
 11147  17220  縮圖 40px、縮圖列 48px：照片可見約 184px（少約 21%）。
 11147  17729  拖滑桿／曲線點時縮圖列淡出，照片回到原本約 232px；放開後淡入。
 11301  18517  Color › Curve
 11305  16711  Color › Curve
 11335  20212  提案二 · ﹀ 收進縮圖列右側
 11361  18517  現況（RD 實作方式）
 11365  16711  現況 + 縮圖列
 11365  17220  提案 A · 縮小縮圖列
 11365  17729  提案 B · 拖曳時隱藏縮圖列
 11777  20511  [phone] ↺
 11777  20564  [phone] ◧
 11869  19275  空白＋﹀ 卡在中間
 11967  17945  [phone] 拖曳中：縮圖列隱藏
 12254  20212  拿掉那條空白，縮圖列直接貼在 panel 上緣，﹀ 放在縮圖列最右邊，跟著 panel 一起移動，是 panel 的把手；照片下緣只被蓋住約 20px（現況約 62px）。
 12280  18517  縮圖列和 panel 之間多一條空白，﹀ 卡在中間，看不出是在收合縮圖列還是 panel。
 12284  16711  縮圖列（62px）疊在照片下緣：照片可見高度約 232 → 170px，少了約 27%。
 12284  17220  縮圖 40px、縮圖列 48px：照片可見約 184px（少約 21%）。
 12284  17729  拖滑桿／曲線點時縮圖列淡出，照片回到原本約 232px；放開後淡入。
 12378  20211  收合狀態同理：拿掉 ︿ 那條空白，︿ 放在縮圖列最右邊，縮圖列直接貼著 Light / Color / Details。
 12382  16711  補充：畫面上已有收合 panel 的「﹀」按鈕，用戶想看大圖時可先收合 panel；這是現行行為，不需新設計。
```
