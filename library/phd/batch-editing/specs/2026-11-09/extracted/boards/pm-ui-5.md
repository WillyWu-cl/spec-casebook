# pm-ui-5

Source: PM Figma https://www.figma.com/design/iWlQTjlmfykHfmlNvg9J4p/Batch-Editing?node-id=0-1 · board `pm-ui-5` · node 16:13767/pm-ui-5 · box x=6366 y=14880 w=9681 h=1150 (absolute Figma canvas points)
Figma text layer (inventory read 2026-11-09, figma-pm / qa1); no PDF export exists, so no OCR. Columns: y, x (absolute Figma canvas points), text (one line per text line); [phone] = inside a phone mockup.

```
 14908   6426  Batch Edit Room · AI Enhance
 14908   7886  Batch Edit Room · AI Enhance
 14908   9346  Batch Edit Room · AI Enhance
 14908  10806  Batch Edit Room · AI Enhance
 14908  12266  Batch Edit Room · AI Enhance
 14908  13726  Batch Edit Room · AI Enhance
 14908  15186  Batch Edit Room · AI Enhance
 14948   6426  default
 14948   7886  already_done
 14948   9346  free_user
 14948  10806  processing
 14948  12266  result_summary
 14948  13726  network_incomplete
 14948  15186  network_incomplete · offline
 15028   6841  【Requirement 】
 15028   8301  【Requirement 】
 15028   9761  【Requirement 】
 15028  11221  【Requirement 】
 15028  12681  【Requirement 】
 15028  14141  【Requirement 】
 15043   6451  [phone] 9:41
 15043   7911  [phone] 9:41
 15043   9371  [phone] 9:41
 15043  10831  [phone] 9:41
 15043  12291  [phone] 9:41
 15043  13751  [phone] 9:41
 15043  15211  [phone] 9:41
 15062   6841  • 批次 AI Enhance 只支援 Standard：不顯示 Standard / Advanced tab、不顯示 scenario，畫面只剩一顆 generate（沿用 10/E room 的 Enhance 按鈕） [DR-09][DR-12a][D1-11]
 15062   8301  • 每次進 AI Enhance room 可 apply 一次 Enhance，套用到批次全部照片；按完按鈕變「Enhanced」灰掉 [DR-12e][DR-12h]
 15062   9761  • Free user 按 generate → Premium IAP [DR-12d]
 15062  11221  • 沿用現行 loading 畫面，將 string 替換為「Enhancing k / N」，k=已完成 enhance 數量，N=enhance request 總數；遮罩蓋住整個畫面，縮圖列在遮罩下方 [D1-02]
 15062  12681  • 跑完全部才一次總結：「X completed, Y failed」「Failed photos are marked on the thumbnails.」；Y 張失敗的照片在縮圖右上角標紅色 !（X 張成功的不標），點失敗縮圖可切過去看 [D1-04]
 15062  14141  • 斷網視同失敗，畫面同 result_summary：已完成的保留；沒做完的照片標紅色 !；訊息「X completed, Y failed」「Connection lost. Check your connection and retry.」；同時有失敗與斷網時合併計算，第二行優先顯示斷網提示 [D1-05][D1-04]
 15085   6711  [phone] 182
 15085   8171  [phone] 182
 15085   9630  [phone] 182
 15085  12551  [phone] 182
 15085  14011  [phone] 182
 15085  15471  [phone] 182
 15100   9761  • 不提供試做 1 張：流程上沒辦法只試做一張再跳 IAP，Free user 按 Enhance 直接跳 Premium IAP [D3-01][D3-02]
 15130   8301  • 離開 room 再進來可以再 apply 一次，處理的是目前的圖（已 Enhance 過的結果），同單張 Edit Room [DR-12e]
 15139  12294  [phone] 12 completed, 3 failed
 15139  13754  [phone] 8 completed, 7 failed
 15139  15214  [phone] 8 completed, 7 failed
 15146   6841  • 這顆 Enhance 按鈕對應 10/E Standard · Portrait [DR-09d]
 15146  11221  • Enhance 過程中不能跳出去編輯其他東西（不能切 Crop / Adjustment、不能點縮圖切換），要等全部做完（RD 確認） [D1-02]
 15159  12294  [phone] Failed photos are marked on the thumbnails.
 15159  13754  [phone] Connection lost. Check your connection and retry.
 15159  15214  [phone] Connection lost. Check your connection and retry.
 15160  12681  • button 為「Retry Failed (x)」，只重做失敗的照片，(x) 為enhance 失敗張數；Retry 後 ! 消失，成功的照片不重做；失敗不算做過 [D1-04][DR-12e]
 15160  14141  • 按鈕「Retry Failed (7)」重跑沒做完的照片；還沒連上網就按 → toast「No internet connection」，不開始處理 [D1-05]
 15184   6841  • 按下套用到批次全部照片，先跳 AI Enhance Confirm Dialog [DR-12h][DR-12]
 15198   8301  • Advanced 相關規則不適用（批次只支援 Standard） [DR-12b][DR-12f][DR-12g]
 15214  11221  • 沒有取消，要等全部做完；跑完前不能存檔 [D1-03][D1-02]
 15222   6841  • 不扣點：AI Enhance 沒有扣點機制，Enhance 按鈕不顯示點數；Crop / Adjustment 也免費 [DR-11][D5-01b]
 15228  14141  • App 被殺：Batch Edit Room 不見，已做的 AI Enhance 結果也不會留下（Standard 結果不存到 My AI Artwork） [D1-05][D1-10]
 15235  12681  • Retry 後的總結以整批照片累計計算，不是只算這次重試：例 15 張先「12 completed, 3 failed」→ Retry 3 張、2 張成功 →「14 completed, 1 failed」，按鈕變「Retry Failed (1)」；全部成功時不再顯示失敗訊息與 Retry 按鈕 [D1-04]
 15236   8301  • 10/E Advanced 的 7 個 Scene Presets（General / Portrait / Scenery / Pets / Concert / Product / Anime）批次不支援 [DR-09b][DR-09]
 15290   6841  • 「全圖」＝批次內全部照片；做完即套用，不用逐張 ✓ [DR-10]
 15328   6841  • 從 AI Enhance Shortcut 多選直接落在這頁 [DR-02]
 15339  10913  [phone] Creating Your AI Image
 15358   6841  • Enhance 按鈕上方顯示批次縮圖列，點縮圖切換目前照片 [D1-12]
 15405  10858  [phone] Enhancing 3 / 20
 15629  12417  [phone] !
 15629  12525  [phone] !
 15629  12579  [phone] !
 15629  13985  [phone] !
 15629  14039  [phone] !
 15629  15445  [phone] !
 15629  15499  [phone] !
 15673  15238  [phone] No internet connection
 15730  10962  [phone] Enhance
 15733   6582  [phone] Enhance
 15733   8036  [phone] Enhanced
 15733   9502  [phone] Enhance
 15733  12395  [phone] Retry Failed (3)
 15733  13855  [phone] Retry Failed (7)
 15733  15315  [phone] Retry Failed (7)
 15767  10851  [phone] Maximize detaill and clarity with advanced AI.
 15776   6499  [phone] Maximize detaill and clarity with advanced AI.
 15776   7959  [phone] Maximize detaill and clarity with advanced AI.
 15776   9419  [phone] Maximize detaill and clarity with advanced AI.
 15776  12339  [phone] Maximize detaill and clarity with advanced AI.
 15776  13799  [phone] Maximize detaill and clarity with advanced AI.
 15776  15259  [phone] Maximize detaill and clarity with advanced AI.
```
