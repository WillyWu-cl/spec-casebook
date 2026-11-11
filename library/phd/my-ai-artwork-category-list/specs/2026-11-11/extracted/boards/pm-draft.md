# draft — My Artwork：category list add filter (Figma only)

Source: PM Figma UX-Issues, page 「26 11E UIUX Revamp」, section `14452:6990` 「draft」 (not in the PDF) · board `pm-draft`
Transcribed from the section's figma-pm screenshot (extracted/figma/pm-draft.png, 1 px = 1 pt): use_figma was refused
for this file (Full seat needed), so no text layer. Columns: y, x (points from the section's top-left), text.

```
   100    107  My Artwork：category list add filter
   325    107  Artwork multiple select
   360   1931  備選方案：All categories 顯示作品數量
   444   1931  狀態：未採用 — RD 10/28 回覆 server API 沒有提供數量，app 是一頁一頁撈到沒資料為止。server 支援一次回傳各功能作品數後可啟用。 [D2-04][D1-28]
   505    962  [requirement]
   530    962  • Photo features/Video feature/Recent 的選取狀態都應有 Stroke + 右上角數字
   560    962  • error 的 results 也要可以多選/刪除
   584   2341  【Requirement】
   614   2341  • 每列「名稱 (x)」，沒作品顯示「(0)」、不灰字；超過 999 顯示「(999+)」；Recent 不帶數量 [D1-28][D1-28c][D1-27b]
   674   2341  • x＝點進去看得到幾個卡片：生成中、失敗都算，一包算 1 [D1-28a]
   734   2341  • Photo / Video 子 tab 加總成一個數字；影片只算 AI Creations，Edits 不算 [D1-28b]
   794   2341  • 每次點開 ≡ 都重新拿；載入中先顯示名稱、數字晚點出現；拿不到只顯示名稱，不顯示 (0) [D1-28d]
   854   2341  • 點「(0)」的功能照樣切到該 tab，看到空狀態和 Create More [D1-28e]
   914   2341  • 前提：server 提供一次回傳各功能作品數的 API（今天沒有） [D2-04]
  1635    107  Artwork add Recent category
  1900   1580  Artwork add Recent category
  1960   1580  [background] Jau request, 全產品調整
  2040   1580  [requirement]
  2060   1580  • Photo and Video tab 區分 result 性質
  2080   1580  • Layout: 應有 result 生成日期, feature icon (new), feature name, expire date 等基本資訊; Photo/ Video 都改成長條狀, 左側 1:1 result, 右側基本資訊
  2120   1580  • Video features: 應顯示影片 duration; I2V & V2V 不帶 custom 的 prompt; prompt 在 result page 呈現即可; I2V 不帶 Template name
  2200   1580  • empty state: same as feature categories
  2220   1580  • Call server 資料的上限: Photo: 一次問最新的 25 張, user 向下滑到底部 (25 張已滑完) 才會再 call 下一筆; 上限 100 筆; Video: local 有記, 上限 100 筆
  2300   1580  • 倘若用戶 delete creations, 下次 call server 時須回補刪除的數量 (AP 問一筆, 再看用戶刪多少決定補多少); 若刪掉 ≥25 creations, 只補 25 個 (一筆的數量)
  2340   1580  • 用戶有 ≥100 個 creations, 滑到底 call 不出資料時, UI 上有字串告知: You've reached the end. Showing your 100 most recent creations. / 用戶只有 <100 creations 時, 滑到底部沒有字串
  2400   1580  • AI Headshot (V2) 的結果是一包的, 在 Recent 也應以一包呈現: thumbnail 只 show 第一張; click → show 20/40/60 張 results
  2932   2004  You've reached the end. Showing your 100 most recent creations.
  3290   1500  選取狀態: 不論 Video feature/ Photo feature/ Recent 都應有 stroke + 數字標列右上角
  3350   1500  Recent/ AI Group Shot 都有 Photo/Video tab, 多選的行為比照現行 → 倘若用戶多 select 時切換 tab/category, 會帶他到目的並取消選取
```

Mockups: two multi-select phones (selected cards with a stroke and a number), the 備選方案 sheet with counts
(「AI Art (12)」, 「AI Face Swap (999+)」), three Recent phones (Photo / Video), 「滑到上限 call 不出資料」, a grid / search /
「Expiring」 concept phone (items the 11/E Overview lists as not done) and a Recent multi-select phone.
