# tracking — Tracking Event table [D0-02] (UI UX flow 2.pdf, text layer)
  562 7000 • 主指標：進入比例＝批次進入 event ÷ 進 Picker [D0-02]
  592 7000 • 次指標：Batch session 存檔比例＝Photo_Result_Save [D0-02]
  622 7000 • 命名規則：event 三段 PascalCase（Xxx_Yyy_Zzz）、參數 snake_case，不符合會被兩平台丟掉 [D0-02]
  696 7015 Event
  696 7345 類型
  696 7545 觸發時機
  696 7885 參數 / 值
  696 8265 決策來源
  747 7015 名稱待定（例 Batch_Edit_Enter）
  747 7345 新增
  747 7545 Picker 切批次 Tab 並進 Batch Edit
  747 7885 —（主指標分子）
  747 8265 D0-02
  772 7545 Room
  823 7015 GenAI_Feature_Generate
  823 7345 既有，新增 from 值
  823 7545 批次 AI Enhance，每張各送一次
  823 7885 from＝BatchEdit；batch_size
  823 8265 D4-01
  848 7345 ＋參數
  899 7015 Photo_Result_Save
  899 7345 既有，不變
  899 7545 Batch session 存檔
  899 7885 （次指標）
  899 8265 D0-02
  950 7015 名稱待定
  950 7345 新增
  950 7545 Batch Save page 點「Edit Next
  950 7885 記點擊次數
  950 8265 D1-07
  975 7545 Batch」
