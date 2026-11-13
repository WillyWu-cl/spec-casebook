# GenAI dialog adjust (sync with My Artwork dialog) (Figma only)

Source: PM Figma UX-Issues (NacadNfWFAGglU880DupER), page 「26 11E UIUX Revamp」 (14451:2196), section `14451:2197` · board `pm-genai-dialog`
Figma text layer from get_metadata (layer names of visible text nodes); use_figma was refused for this file (Full seat
needed), so no inventory read. Columns: y, x (points from the section's top-left), text. Board image: extracted/figma/pm-genai-dialog.png.

```
  3992    177  GenAI dialog adjust (sync with My Artwork dialog)
  4223    764  【Requirement】Gen AI dialog
  4305    773  ➊ dialog dialog title (不變) dialog content (原): All your generated results are saved in My Artwork, so you can acess them anytime. dialog content (改為): Your generated results are saved in My AI Artwork for 1 year. Download them to keep them permanently.
```

Embedded image (RD code notes, read by eye from the board image at 3×; not a text layer). Mockup dialog today:
「Results Are Saved Automatically」 / 「All your generated results are saved in My Artwork, so you can access them anytime.」 / 「Ok」.

```
依目前程式碼，觸發點如下：
Feature                  | 跳出時間點                                                        | 是否共用
AI Headshot              | 結果頁按「回首頁」，且未在生成中                                   | 共用
AI Try On                | 結果頁按「回首頁」，且未在生成中                                   | 共用
AI Art / Artistic Avatar | 結果頁按「回首頁」，且未在生成中                                   | 共用
Image Fusion             | 結果頁按 Home；一般 Back 不會                                      | 共用
Face Swap                | 結果頁按 Back、Home，或系統返回鍵；系統返回時生成中會擋住          | 共用
AI Glow Up               | 已有生成圖片，按返回離開功能時；生成中不允許離開                   | 共用
AI Exposure              | 有生成結果但未套用，按關閉時                                       | 獨立 dialog / 紀錄
AI Exposure              | 發生 DOWNLOAD_FAILED 時                                            | 獨立提示
AI Background            | 生成流程發生錯誤 / 強制結束下載，但任務仍可至「我的作品」查看時    | 獨立提示；頁面未 resume 時延後顯示
(a green brace marks the first six rows)
共用的顯示規則：前六項都呼叫 showAutoSaveNoticeDialog() (line 271)，共用 aiLeavePageDoNotShowAgain：
• 任一功能顯示過一次，其他共用功能之後也不再跳。
• dialog 顯示時就設為已顯示，不必按 OK。
• 只有 OK，沒有「不再顯示」勾選框。
獨立的部分：
• AI Exposure 關閉提醒 (line 177)：有 OK / Cancel /「不再顯示」。只有按 OK 且勾選，才寫入自己的紀錄；不受上述共用紀錄影響。
• AI Exposure 下載失敗提示 (line 59) 與 AI Background 提示 (line 5560)：共用標題 / 內文，沒有共用的「顯示一次」限制。
```
