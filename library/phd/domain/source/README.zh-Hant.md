# PHD 行動版產品知識

這裡是 PhotoDirector 行動版的正式產品參考文件入口。內容從 2026 年 4 月至 10 月的 eBug 詳情與討論歸納，適用於功能理解、spec 分析、測試設計、回歸規劃與問題定位。

使用者直接補充確認的產品規則，另在相關條目標明日期與來源。K36 已收錄 2026 年 10 月 15 日補充：所有使用 credits 的 AI feature 在 Generate 結束後，Buy Credit page 右上角 Detail 應有正確 feature 名稱及扣點、退點明細。這類補充不計入 eBug 來源筆數。

K36 亦收錄 2026 年 10 月 16 日使用者確認：Android 只有一種 VIP 權益模式，VIP、Pro、paid user 均為同義名稱；不可套用 iOS Pro／Pro+ 的雙層分級。

K36 的測試前置作業亦已收錄：每輪測試開始時只確認一次免費使用者與 0 點；任一不符才在 debug dialog 關閉 set to subscriber，重設 UUID／member token（介面誤標為 rest），按 OK 並重啟後再次確認。不在每個 Test Case 前重做。

K47 已收錄 2026 年 10 月 16 日使用者確認：所有會扣 credits 的 AI feature，圖片生成完成後都會自動保存至 My AI Artwork，並歸入各功能專屬的 feature tab；另保留 AI Exposure 的 Recent／AI Exposure 分頁與 [V] 無關保存規則。

## 文件與來源

- [領域知識](phd-domain-knowledge.md)：主要維護文件，包含 74 項知識、功能地圖與回歸矩陣。
- [可搜尋的 HTML 閱讀版](phd-domain-knowledge.html)：由維護文件與來源索引產生，附章節導覽與來源篩選。
- [eBug 來源索引](source-index.md)：263 筆原始清單、納入範圍與來源連結。
- [來源索引資料](source-index.json)：保留閱讀日期、原始檔 SHA-256、遠端狀態快照、排除原因及條目對應。不是完整 eBug 頁面或附件備份。

目前納入 260 筆 PHD 紀錄，排除 2 筆測試資料及 1 筆 PowerDirector bug。IF3 測試資料依使用者指示未讀取；其餘 262 筆已讀取頁面文字。原始 `EbugDownloadCSV.xls` 保留在原位置，不需依靠它重新產生閱讀版。

## 何時讀取

| 工作 | 使用方式 |
| --- | --- |
| create-update-spec | 對照相關功能、名詞、入口及歷史決策，理解新版 spec 的變更與影響範圍 |
| review-spec-completeness | 根據歷史問題檢查目前 spec 的狀態轉換、失敗恢復與旅程是否定義完整 |
| 產生與審查 Test Case | 尋找入口、輸入模式、返回、生成中斷、輸出、權益、語系與裝置的回歸風險 |
| UI 探索與測試 | 選擇相關路徑及觀察點，根據本次任務與正式 spec 決定驗證內容 |
| bug 分析與複驗 | 參考過往根因、影響範圍及反覆修正案例，再用目標版本的實際證據確認 |

先讀領域知識開頭的範圍與證據定義，再讀與任務相關的章節。需要具體來源時查索引或 BugCode 連結。無關的功能不必整份載入。

## 來源權威與衝突處理

當前有效的 Spec Source 及其權威補充決策，才是合約與 Claims 的依據。這份知識提供歷史背景、已記錄決策與測試風險；不得把未結案的原始 Expected Result、自行歸納的測試建議或舊版本數值直接升格成規格。

新版 spec 明確改變舊行為時，依新版 spec 更新合約，並保留知識條目的版本背景。若 spec 沒有定義、與歷史決策衝突或描述不明，記錄問題並追溯來源，不用舊 eBug 自動填補答案。票單 Close 不等於功能已修復，Propose Won't Fix 也不等於永久限制。

文件中的產品與平台範圍必須保留：PHD 不等同 PDR，Android 的修正不能自動證明 iOS 正常，Stage 的容量、時間或權益設定不能當成 Production 保證。

## 維護方式

修改 `phd-domain-knowledge.md`，新增具體來源時更新 `source-index.json`。保留每筆來源的閱讀日期背景、納入判斷與原始狀態，不把舊快照描述成遠端即時狀態。新增知識條目沿用穩定的 K 編號，不為重排任意改號。

`phd-domain-knowledge.html` 與 `source-index.md` 是產生檔，不手動修改。使用 Node.js 及可用的 `marked` 套件重新產生：

```powershell
node docs/domain/phd/render.ts
```

若 `marked` 未安裝於可解析位置，可透過 `--marked-module` 指定執行環境提供的 `marked.esm.js` 絕對路徑。這個命令僅重新建立本地閱讀版與索引，不連線刷新 eBug。更新後核對來源數量、引用有效性與閱讀版呈現。
