# pm-tracking

Source: PM Figma https://www.figma.com/design/iWlQTjlmfykHfmlNvg9J4p/Batch-Editing?node-id=0-1 · board `pm-tracking` · node 16:15550 · box x=13206 y=622 w=1500 h=572 (absolute Figma canvas points)
Figma text layer (inventory read 2026-11-09, figma-pm / qa1); no PDF export exists, so no OCR. Columns: y, x (absolute Figma canvas points), text (one line per text line); [phone] = inside a phone mockup.

```
   682  13266  • 主指標：進入比例＝批次進入 event ÷ 進 Picker [D0-02]
   712  13266  • 次指標：Batch session 存檔比例＝Photo_Result_Save [D0-02]
   742  13266  • 命名規則：event 三段 PascalCase（Xxx_Yyy_Zzz）、參數 snake_case，不符合會被兩平台丟掉 [D0-02]
   817  13281  Event
   817  13611  類型
   817  13811  觸發時機
   817  14151  參數 / 值
   817  14531  決策來源
   868  13281  名稱待定（例 Batch_Edit_Enter）
   868  13611  新增
   868  13811  Picker 切批次 Tab 並進 Batch Edit Room
   868  14151  —（主指標分子）
   868  14531  D0-02
   944  13281  GenAI_Feature_Generate
   944  13611  既有，新增 from 值＋參數
   944  13811  批次 AI Enhance，每張各送一次
   944  14151  from＝BatchEdit；batch_size
   944  14531  D4-01
  1020  13281  Photo_Result_Save
  1020  13611  既有，不變
  1020  13811  Batch session 存檔
  1020  14151  （次指標）
  1020  14531  D0-02
  1071  13281  名稱待定
  1071  13611  新增
  1071  13811  Batch Save page 點「Edit Next Batch」
  1071  14151  記點擊次數
  1071  14531  D1-07
```
