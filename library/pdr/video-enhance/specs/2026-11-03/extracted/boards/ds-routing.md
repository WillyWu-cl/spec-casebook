# Routing Logic

Source: Video Enhance Design Figma (HceGLJVaxnKsv7gXSXzKWh) · board `ds-routing` · node 3293:14560 · section 3293:13053 「AI Video Enhance_26.09_v2」
Figma text nodes (figma-source/design/out/3293-14560.json; no PDF in this spec set, so no OCR). Columns: y, x (canvas points), text.

```
   -59  20911  Enter AI Video Enhance
   -29  20708  Launcher / AI Magic
   -29  21172  Timeline
    31  20721  Demo page
    31  21081  直接帶入選取的 clip
    57  20721  勾 Don't show again 後不再出現
    57  21081  Timeline 入口，無 Demo page
   125  20721  Media Room 選一支影片
   215  20750  Leave → 回設定面板
   215  20891  設定面板
   241  20891  Trim 選段 ＋ Mode / Enhancement style / fps / Resolution
   303  21205  價格 = 選取秒數 × 每秒費率
   311  20891  Check Eligibility
   321  21205  長度改變，價格跟著改變
   383  20891  Free user  →  IAP
   439  20891  餘額不足  →  Credit Page
   495  20891  餘額足夠  →  直接生成
   543  20802  Cancel
   575  20639  取消確認
   575  20891  Generating（雲端）
   601  20639  Leave → credit 不退還
   649  20891  Recent Task
   705  20752  完成
   705  21216  失敗
   739  20721  Result
   739  21081  失敗卡片
   765  21081  Error 縮圖 ＋ View Details
   799  21216  View Details
   805  20721  Save Result  →  存到手機
   839  21081  錯誤說明 dialog
   861  20721  Add to Timeline  →  開新 timeline
   865  21081  credit 已自動退還
   917  20721  Edit More  →  回 Media Room
   993  20652  所有 Enhance 功能皆耗 credit，一律雲端生成後另存新片。Add to Timeline 是開一條新的 timeline，不取代原 clip。生成失敗系統自動退還 credit；使用者主動取消則不退還。
```
