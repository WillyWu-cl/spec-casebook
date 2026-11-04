# Logic 補充 · 對齊 Design 26.09 v2（9/29）

Source: AI Video Enhance PM Figma (mppB4GYkuVMVvHrdBeSAAU) · board `pm-draft-logic` · page 365:2 (draft) · section 405:1108
Figma text layers (text-p3.json; no PDF in this spec set, so no OCR). Columns: y, x (canvas points), text.

```
  2207    977  Logic 補充 · 對齊 Design 26.09 v2（9/29）
  2279    977  來源：Video Enhance 設計稿 26.09 › Video Enhance_26.09_v2（Main Flow / Routing Logic / Video Enhance / Cancel / Alternative & Exception）。標籤：[Design] 設計稿已定　[建議] PM 建議補齊的規則　[衝突] 與本頁 spec 不一致，需拍板　[待確認] 需 RD／BytePlus／Legal 回覆。UI 文案一律英文。
  2381   1009  A. 流程總覽 & 入口
  2381   1801  B. 設定面板：選段 & 預設值
  2381   2593  C. Credit、資格檢查、生成
  2381   3385  D. 通知、Recent、Result、Timeline
  2381   4177  E. 影片限制 & Gaps 狀態更新
  2437   1009  A0 主線（Design v2 Routing Logic）
  2437   1801  B1 選段 Trim
  2437   2593  C1 Credit 顯示
  2437   3385  D1 通知
  2437   4177  E1 影片限制（Gap 1）
  2483   1009  Launcher／AI Magic → Demo page（可略過）→ Add Media 選 1 支影片 → 設定面板（Trim＋Mode／Enhancement style／fps／Resolution）→ 點 CTA → Check Eligibility → 通過：上傳 → 扣 credit → Generating → Recent task → Result。
  2483   1801  [9/29 定案] 單次上限依 Mode：Standard 8 分鐘、Professional 2 分 30 秒（取代 Design 的 3 分鐘，設計稿需更新）。預設選段 = 從 00:00 開始，長度取「影片長度」與「目前 Mode 上限」較短者。切換 Mode 的行為見 B1-1。
  2483   2593  credit = 選段秒數（無條件進位）× 每秒費率（Mode, Resolution, fps）；Style 不影響價格。
  2483   3385  [Design] 生成完成時 App 內跳通知（Launcher 上的 notify banner）；點擊 → Result。
  2483   4177  [待確認] RD／BytePlus 回覆後定案，建議：長度 ≥ 1 秒；MP4／MOV（H.264／HEVC）；來源 ≤ 4K（4K 來源只能選 4K）；超過 4K 不支援。
  2535   2593  [衝突] Design CTA 上方寫 "Charge X credits per second"（單價）；本頁是即時總額。建議兩者都顯示：CTA "Enhance · 8 credits"，上方小字 "2 credits/sec × 4s"；拖曳選段或切換設定時即時更新。
  2535   3385  [建議] App 在背景時送系統推播（§9）；點擊 → Result。
  2535   4177  [建議] 不支援的影片在 Add Media 反灰，點擊 toast "This video isn't supported. Try one up to 4K."
  2561   1009  Timeline：選中 clip → Enhance → 直接帶 clip 開面板（無 Demo page、無 Add Media）→ 送出後同主線 → 成功後回貼原 clip。
  2561   1801  [Design] 拖左右把手 = 調整長度，Preview 顯示正在拖的那一端畫面；拖中間 = 長度不變整段平移，Preview 顯示選段第一格。
  2561   3385  [建議] 失敗也推播，因為已經退款，需要讓使用者知道："Video Enhance didn't finish. Your credits have been refunded."（解 Gap 8）
  2601   4177  E2 本頁 Gaps 狀態（對應右上 Gaps 1–16）
  2613   1801  [建議] 最短 1 秒；拉到目前 Mode 上限時把手停住（見 B1-1 UI）。
  2613   3385  [建議] Design 缺「開啟通知」彈窗：第一次成功 commit 後，若系統權限還沒詢問過 → 顯示 soft prompt（Turn On／Later）；Turn On → 系統權限視窗；已授權 → 不顯示；已拒絕 → Turn On 導到系統設定。按完留在 Generating 畫面（解 Gap 6、14）。按 Later 後不再主動詢問。
  2627   1009  A1 Demo page（新增，PM spec 原本沒有）
  2627   2593  C2 Check Eligibility（點 CTA 時依序檢查）
  2639   1801  [建議] Selected Length 顯示「無條件進位後的整秒」，與扣款一致：< 60s 顯示 18s，≥ 60s 顯示 1m 30s（取代本頁 00:03.96 的寫法）。
  2647   4177  1 影片限制 → 見 E1，待 RD／BytePlus
  2673   1009  [Design] 從 Launcher／AI Magic 進入時顯示；勾「Don't show again」後不再出現。Timeline 入口不顯示。
  2673   2593  ① 是否 Pro+ → ② 網路 → ③ 餘額 ≥ 本次 credit。
  2673   4177  2 Empty state → Add Media 已建議（A2）；Timeline 沒選 clip 時 Enhance 反灰
  2699   2593  [Design] Free user → IAP；餘額不足 → Credit page；餘額足夠 → 直接生成。
  2699   4177  3 First-run 文案 → 改成 Bubble（Design），文案見 B2
  2705   1801  B1-1 Trim 上限 × 切換 Mode（9/29 新增）
  2705   3385  D2 Recent task
  2725   1009  [建議] 「不再顯示」只在勾選＋按 Try It Now 時生效；只勾選但按返回不生效。記錄存本機（重裝 App 會重置）。
  2725   2593  [Design] 購買成功 → 回 Video Enhance，餘額已更新、選段與設定保留（解 Gap 12）。
  2725   4177  4 媒體選擇器觸發 → 建議點縮圖直接進（A2）
  2751   1801  上限：Standard 8:00／Professional 2:30（選段秒數無條件進位後與上限比較）。
  2751   3385  [Design] 卡片狀態：Processing → Completed（點擊 → Result）→ Failed（Error 縮圖＋View Details → 錯誤 dialog，說明 credit 已自動退還）。雲端保存 1 年（"Tasks are stored on the cloud for 1 Year…"）＋Manage。
  2751   4177  5 上傳 dialog → Design 缺，需補畫（C3）
  2777   1009  [建議] Demo page 按返回 → 回到入口頁，不進 Add Media。
  2777   1801  ① Standard → Professional，選段 ≤ 2:30：選段不變，只更新 credit。
  2777   2593  [建議] 回到面板後不自動送出，需使用者再按一次 CTA（避免在沒確認的情況下扣款），並重新檢查；新餘額仍不足 → Credit page。
  2777   4177  6 通知彈窗落點 → 建議留在 Generating（D1）
  2803   1009  [衝突] Demo page 描述目前沿用 AI Reframe 文案（"AI reframe your video for any aspect ratio…"），需改為 Video Enhance。建議："Make blurry, noisy or dark videos look sharp and clear."
  2803   1801  ② Standard → Professional，選段 > 2:30：保留起點，終點自動縮為「起點＋2:30」。右把手以動畫縮回（約 200ms），Preview 跳到選段第一格，顯示 toast 3 秒，credit 即時更新。
  2803   4177  7 Recent 入口／處理中樣式 → 已解：Completed 點擊 → Result；入口與進度樣式仍待定
  2829   2593  [建議] 已訂 Pro（非 Pro+）→ IAP 預設停在 Pro+ tab；只買了 Pro → 回面板仍是 Upgrade 狀態。IAP／Credit page 按關閉 → 回面板，內容不變。
  2829   3385  [待確認] Processing 卡片的進度／預估時間樣式；面板 top bar 是否有 Recent 入口（Gap 7）。
  2855   4177  8 失敗推播 → 建議推播（D1）
  2881   1801  ③ Professional → Standard：選段不會自動拉長，上限放寬為 8:00，使用者可自己拖長。
  2881   2593  [建議] 送出時 server 再驗一次餘額（避免跨裝置同時使用），不足 → 同餘額不足流程。
  2881   3385  [待確認] Generation Failed dialog 的內文與按鈕需要從 component 確認（Gap 9）。建議："Enhancement failed" / "Something went wrong. Your X credits have been refunded." / OK。
  2881   4177  9 已退款 dialog → Design 有 Generation Failed dialog，內文待確認（D2）
  2895   1009  A2 Add Media
  2907   2593  [衝突] IAP 頁顯示 "Receive 35 credits during free trial"，但 §7 寫 v1 不提供 free trial → 需確認 Pro+ 試用期間能否使用本功能（35 credits ≈ 1080p Standard 30fps 17 秒）。
  2907   4177  10 Timeline 回貼規則 → 建議（D4）
  2933   1801  ④ 還原：在 Professional 期間沒有動過選段，切回 Standard 時還原成切換前的選段（不跳 toast）；有動過就保留目前選段。只算拖曳選段，改 fps／Resolution 不影響還原。
  2933   4177  11 Edit More 去處 → 已解：Enhance More → Add Media（Design）
  2941   1009  [Design] 只顯示 Video tab，v1 單選 1 支。
  2947   2593  C3 上傳（commit 前）
  2959   3385  [建議] 成品同時進 AI Magic › My Artwork 和 Template › My Artwork（§4.3），Design 尚未呈現。
  2959   4177  12 購買後回哪 → 已解：回面板，保留設定（Design）＋需再按一次 CTA（C2）
  2967   1009  [建議] 點縮圖直接進面板，不需要 Next（解 Gap 4）。頁面標題沿用 Add Media。
  2985   1801  ⑤ 記住上次 Mode（B3）＝Professional 時，新影片預設選 00:00–02:30（影片較短則選整段）。
  2985   4177  13 §7 同步 → 仍待更新 spec 文件
  2993   1009  [建議] 不支援的影片（見 E1）在縮圖上直接反灰，點擊跳 toast，不要等進面板才擋。
  2993   2593  [建議] Design v2 缺「上傳中」狀態，需補畫：前景 dialog "Uploading… 45%" ＋ Cancel。Cancel = 不扣款、不建任務、回面板並保留設定（解 Gap 5）。
  3011   4177  14 已開通知者略過 → 建議略過（D1）
  3019   1009  [建議] 相簿沒有任何影片：顯示 empty state "No videos yet"（解 Gap 2 的 Add Media 部分）。
  3025   3385  D3 Result
  3037   1801  ⑥ 底部縮圖列比例只看影片長度，不隨 Mode 改變：影片 ≤ 8:00 整支撐滿固定寬度；> 8:00 可橫向捲動，8:00＝一個畫面寬。切 Mode 只改選取框，不重排縮圖列。
  3037   4177  15 Applied Video Enhance 呈現 → 建議 toast 3 秒（D4）
  3045   2593  [建議] 上傳失敗／斷網 → 回面板，toast "Upload failed. Check your connection and try again."，不扣款。
  3063   4177  16 Trim 上限 → 已定：Standard 8 min／Professional 2m 30s，切換規則見 B1-1
  3071   3385  [Design] Save Result → 存到手機；Add to Timeline → 用成品開新專案；Enhance More → 回 Add Media 選下一支（解 Gap 11）。
  3077   4177  E3 需拍板的衝突（依優先度）
  3089   1801  ⑦ Timeline 入口（選段鎖定整個 clip）：clip ≤ 2:30 兩種 Mode 都能用；2:30 < clip ≤ 8:00 → Professional chip disable，點擊 toast；clip > 8:00 → 不開面板（D4）。
  3097   2593  [建議] 上傳中 App 被關閉 → 視同取消，不扣款。成功上傳 = commit，扣 credit 並建立任務。
  3123   3385  [衝突] 按鈕文案是 Enhance More，Routing Logic 寫 Edit More → 統一為 Enhance More。
  3123   4177  1. Generating 的 Leave 是「背景繼續」還是「中止不退款」（C4）
  3129   1801  ① Standard：選 00:30–05:30
  3129   2043  ② 點 Professional → 保留起點，縮為 2:30
  3129   2285  ③ 沒動選段就切回 Standard → 還原
  3149   4177  2. fps 可選 → 計價改用輸出 fps（B4）
  3163   2593  C4 Generating & Cancel
  3175   3385  [建議] Save 成功 toast "Saved to your device"；失敗 toast "Couldn't save. Try again."
  3175   4177  3. Resolution 預設規則：≥ 來源 vs 最接近（B3）
  3201   4177  4. 預設值：記住上次 vs 固定（B3）
  3204   1888  Preview
  3209   2593  [Design] Generating = 面板上的 processing dialog；按 Cancel → 確認 dialog，Leave → credit 不退還。
  3215   3385  D4 Timeline 入口
  3220   2130  Preview
  3220   2372  Preview
  3227   4177  5. CTA 顯示總額 vs 單價（C1）
  3253   4177  6. Pro+ 試用期能否使用（C2）
  3261   2593  [衝突] 本頁 v1 定義「背景生成不可取消」。Design 的 Leave 需要明確：是「離開、任務繼續在背景跑」還是「中止任務」？建議採前者：Leave 後任務繼續，完成時通知，成品在 Recent。確認 dialog 文案建議："Keep enhancing in the background? You'll be notified when it's ready. Find it in Recent."（Stay／Leave）。若是中止且不退款 → 建議不要做，付了錢卻沒有成品，容易客訴。
  3261   3385  [Design] 帶選中的 clip 開面板，無 Demo page。Design v2 未畫回貼。
  3265   1917  5m 00s
  3266   1813  Selected Length ⓘ
  3267   1961  / 8m max
  3279   4177  7. Demo page 文案錯誤、Enhance More／Edit More 命名（A1、D3）
  3281   2146  2m 30s
  3281   2401  5m 00s
  3282   2055  Selected Length ⓘ
  3282   2297  Selected Length ⓘ
  3283   2190  / 2m 30s max
  3283   2445  / 8m max
  3287   3385  [建議] 從 Timeline 進入時，選段預設 = 該 clip 在時間軸上的範圍；clip > 8 分鐘 → toast "Split clips longer than 8 minutes first"，不開面板；clip 介於 2:30–8:00 → Professional chip disable（見 B1-1 ⑦）（避免只取代一部分 clip 的複雜度）。
  3305   4177  8. Design 需補畫：上傳中、開啟通知彈窗、Timeline 回貼
  3324   1813  00:30 – 05:30   (video 06:00)
  3331   4177  9. Design 選段上限仍寫 3 分鐘，需改為依 Mode＋補畫切換 Mode 縮短選段的狀態（B1-1）
  3340   2055  00:30 – 03:00   (video 06:00)
  3340   2297  00:30 – 05:30   (video 06:00)
  3345   1813  Mode ⓘ
  3361   2055  Mode ⓘ
  3361   2297  Mode ⓘ
  3372   1823  Standard
  3372   1894  Professional
  3388   2065  Standard
  3388   2135  Professional
  3388   2307  Standard
  3388   2378  Professional
  3391   2593  [建議] 生成中 App 切背景或被關閉 → 雲端繼續生成。
  3391   3385  [建議] 成功後以成品取代原 clip（位置、轉場、音訊保留），toast "Video Enhance applied"，3 秒消失（解 Gap 15）。
  3407   1860  Enhance · X credits
  3417   2593  [待確認] 可同時進行幾個任務？建議 v1 最多 3 個，超過時 CTA 跳 toast "You can run up to 3 enhancements at a time."
  3421   2063  Professional mode supports up to 2m 30s. Your selection was shortened.
  3423   2344  Enhance · X credits
  3443   3385  [建議] 生成期間原 clip 被刪除、修改或專案被關閉 → 不回貼，成品留在 Recent，通知 "Your enhanced video is ready in Recent"（解 Gap 10）。
  3467   2102  Enhance · X credits
  3495   3385  [建議] Timeline 入口的 Result 頁：Add to Timeline 改為回到原專案，不開新專案。
  3515   1801  UI 規格
  3558   1801  • Selected Length 右側顯示「目前長度 / 上限」：5m 00s / 8m max（上限為次要灰字，切 Mode 時更新）。
  3610   1801  • Mode ⓘ bubble："Standard: up to 8 minutes. Professional: up to 2m 30s."
  3636   1801  • 切換縮短 toast（②）："Professional mode supports up to 2m 30s. Your selection was shortened." 快速連續切換時只顯示最後一次。
  3688   1801  • 拖到上限：把手停住＋輕震動＋bubble "Up to 2m 30s in Professional mode"／"Up to 8 minutes in Standard mode"。
  3740   1801  • Timeline disable toast（⑦）："Professional mode supports clips up to 2m 30s. Split the clip to use it."
  3806   1801  B2 首次說明 Bubble（取代本頁 First-run card）
  3852   1801  [Design] 首次進入自動顯示；之後點 Selected Length 旁的 ⓘ 可再開。3 秒後自動消失，期間點畫面任一處也會消失。
  3904   1801  [Design] Mode、Enhancement style 標題旁也有 ⓘ，點擊開啟該設定的說明 bubble。
  3930   1801  [建議] Selected Length bubble 文案："Choose up to 8 minutes in Standard or 2m 30s in Professional. Credits are based on the length you choose."（涵蓋 §10.1 的「功能用途＋會扣 credit」，解 Gap 3、16）
  4022   1801  B3 預設值
  4068   1801  [Design] Mode = Standard、Enhancement style = Natural（固定，不採 API 預設 hd）。
  4120   1801  [Design] fps 依來源：1–45 → 30fps、46–90 → 60fps、91 以上 → 120fps。
  4146   1801  [Design] Resolution：選最接近來源的選項，等距取較低者。
  4172   1801  [衝突] 本頁 §4.3「面板記住上次的 Mode／Style／Resolution」vs Design「固定預設值」。建議：Mode、Style 記住上次選擇（第一次用 Standard／Natural）；fps、Resolution 每支影片依來源重算。
  4250   1801  [衝突] 本頁 §5.2「Resolution 只提供 ≥ 來源、上限 4K」vs Design「最接近、等距取低」，後者可能選到比來源低的檔位（例：900p 來源，720p／1080p 等距 → 取 720p＝降畫質）。建議改為：預設 = ≥ 來源的最小檔位，低於來源的檔位 disable；解析度以短邊判斷（直式 1080×1920 視為 1080p）。
  4342   1801  B4 fps 與計價
  4388   1801  [衝突] 本頁寫 Frame rate = Same as source、計價用「來源 fps」；Design 的 fps 是可選的 30／60／120。需確認：計價與 SKU 的 {fps} 改用「輸出 fps」。
  4440   1801  [建議] 與 Resolution 一致：低於來源的 fps 選項 disable（降幀不算 enhance）。可變幀率（VFR）影片以平均 fps 判斷。
  4506   1801  B5 Chips 狀態
  4552   1801  [Design] unselect／select（每組只有一個）／disable（目前 Mode 不支援）。
  4578   1801  [Design] 點 disable 的 chip → 跳對應 toast（v1 設計稿註記）。建議文案："Not available in Professional mode"、"Choose a resolution at or above your video's"。
  4656   1801  [建議] 切換 Mode 後，若已選的 fps／Resolution 變成 disable → 自動改選最接近且可用的選項（等距取低），並 toast "Frame rate changed to 60fps"。
  4708   1801  [待確認] 需 BytePlus 提供 Mode × fps × Resolution 支援表，Design 目前沒定義哪些組合 disable。
```
