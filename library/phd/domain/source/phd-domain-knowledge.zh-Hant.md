# PHD 行動版領域知識

這份知識庫整理 PhotoDirector 行動版的功能流程、編輯狀態、AI 生成、作品管理、付費權益、內容服務與平台相容性，供功能分析、測試設計、問題定位及新人交接使用。最值得掌握的產品特性是：同一項功能會從多個入口進入；預覽、編輯中的影像與儲存輸出可能使用不同資料；AI 工作的完成、作品分類、點數及通知則必須共同維持一致。

整理日期為 2026 年 10 月 15 日。來源清單包含 263 筆，已讀紀錄的建立日期涵蓋 2026 年 4 月 1 日至 10 月 15 日。已讀取 262 筆 eBug 頁面的重現步驟、實際與預期結果、備註、討論、RD 修正資訊及狀態紀錄。排除使用者確認為測試資料的 PHA262026P0001、內容明確為測試的 PHA262026-0372，以及 PowerDirector 的 DRA262605-0212，實際歸納範圍為 260 筆 PHD 紀錄，其中 Android 257 筆、iOS 3 筆。附件名稱與連結可見，但未逐一播放影片、檢視圖片或開啟外部 spec；影像品質問題因此以 bug 的文字紀錄為準。

文中「確認規則」表示討論、修正說明或複驗支持該行為；「歷史實作」表示該版本的 RD 說明；「待確認」表示尚未形成已確認規則。Closed 只表示票單狀態，仍須閱讀其結案原因。這些知識描述來源期間內的產品，不能自動取代後續版本的正式 Spec Source。

## 閱讀導覽

| 想了解的問題 | 建議先讀 |
| --- | --- |
| PHD 有哪些主要功能與資料物件 | 產品範圍與共通概念 |
| 為何入口不同就出錯 | 入口與跨功能資料傳遞 |
| AI 生成前到底需要哪些輸入 | AI 功能與輸入規則 |
| Undo Reset 取消與返回如何區分 | 編輯狀態與操作語意 |
| 如何理解點數試用及訂閱 | 生成費用與使用權益 |
| 生成完成卻找不到作品或下載失敗 | 作品管理與輸出 |
| 為何 Stage iOS 或某語言不同 | 內容服務與環境、平台與在地化 |
| 下一次回歸應優先測什麼 | 回歸設計與問題定位 |

## 產品範圍與共通概念

### 功能地圖

| 領域 | 來源中出現的功能 | 主要職責 |
| --- | --- | --- |
| 首頁與探索 | Launcher、Home、AI Photos、AI Videos、Discover、Mine、Open Intro | 找功能、看示範、套用內容、呈現帳號相關權益入口 |
| 照片編輯 | Edit Room、Crop、Perspective、Adjustment、Background、Cutout、Mosaic、Blur Tool | 修改影像幾何、色彩、背景、遮罩與效果 |
| 人像與美化 | Beautify、Retouch、Reshape、Skin Tone、Makeup、Hair Volume | 人像局部調整與美化 |
| 照片生成 | AI Creative Studio、AI Art、AI Try-On、AI Hairstyle、AI Headshot、AI Face Swap、AI Group Shot | 以照片、樣式、參考圖或 prompt 產生作品 |
| AI 編輯 | AI Replace、AI Removal、AI Background、AI Expand、AI Enhance、AI Deblur、AI Denoise、AI Relight、AI Exposure | 替換、移除、擴圖、增強與光線調整 |
| 影片生成與編輯 | Image to Video、AI Anime Video、AI Video Try-On、Character Motion Swap、Cinematic Reel Creator、Video Editing | 從照片或影片生成內容，以及加入文字、音訊與範圍調整 |
| 特殊製作 | Collage、ID Photo、Camera、Text、Text Bubble、Sticker、VHS、Glitch | 拼貼、證件照、拍攝、圖層與風格效果 |
| 作品與商業流程 | My AI Artwork、Save & Share、Credits、Credit Auto Pass、IAP、Task Center、RTDN、Mixpanel | 管理工作與結果、儲存分享、計費、推播與事件紀錄 |

這是本批 bug 覆蓋的功能地圖，並非完整產品目錄。功能名稱在程式與 UI 中可能不同：AI Creative Studio 的歷史實作名稱包含 Creative Lab；Cinematic Reel Creator 的實作紀錄出現 CineStory。分析日誌時需辨認這些對應。來源：PHA262026-0358、PHA262026-0373。

### 核心資料物件

| 概念 | 在 PHD 中的意義 | 容易混淆的地方 | 來源 |
| --- | --- | --- | --- |
| 編輯中的影像 | Edit Room 當下合成或處理後的 bitmap | 原始檔案 URI 不一定包含最新編輯 | PHA262026-0382 |
| 來源圖與參考圖 | 來源圖是被改造的照片，參考圖用來指定服飾或替換內容等 | 參考衣服圖不能直接套用人物圖的人臉驗證 | PHA262026-0392、PHA262026-0260 |
| Template 與 Style | 預設內容及使用者選取的樣式，具有 GUID、分類和對應生成設定 | 相同畫面中另有自訂 prompt 或參考圖模式 | PHA262026-0271、PHA262026-0306 |
| Inspiration | 可套用的建議 prompt 或生成靈感 | 由內容服務提供，但仍受所選模型的字數與檢查限制 | PHA262026-0396、PHA262026-0398 |
| Task 與 Pack | 生成工作及作品集合的歷史實作概念 | 圖片或影片，不等同 short task 或 long task | PHA262026-0194、PHA262026-0436 |
| Artwork | 持久呈現生成工作與結果的作品庫 | Recent、功能分類及 Photo／Video 篩選是不同維度 | PHA262026-0363、PHA262026-0436 |
| Credits 與訂閱 | 點數餘額、贈點來源及不同訂閱權益 | Premium、Credit Auto Pass、一次免費試用不能當成同一個狀態 | PHA262026-0199、PHA262026-0316、PHA262026-0252 |

## 入口與跨功能資料傳遞

### K01 功能入口是行為的一部分

同一功能可能從 Launcher banner、AI Photos、AI Videos、Edit Room、Discover、Artwork、通知 deep link 或作品結果頁進入。入口會帶入照片、樣式、分類、教學狀態與返回路徑。只測一個入口無法代表整個功能。AI Replace 從 AI Photos 進入正常，從 Edit Room 繞經 Artwork 再進 Edit Room 卻曾遺失頂部工具列。來源：PHA262026-0283、PHA262026-0278、PHA262026-0233。

### K02 從 Edit Room 帶入的是目前編輯結果

確認規則：從 Edit Room 進入 Cinematic Reel Creator 應帶入最新編輯後的照片。歷史錯誤直接取 FileObj 的 URI，帶到原圖；修正改用最新 bitmap buffer 存成暫存檔。AI Headshot 也曾漏掉來自 Edit Room 的照片，修正補上入口標記。來源：PHA262026-0382、PHA262026-0400。

### K03 照片識別碼會影響選圖回填

歷史實作：AI Agent 與 AI Group Shot 的 Edit Room 來源圖若使用 0 或 -1 這類無效 ID，Photo Picker 無法將它恢復為已選照片。修正使用保留的 AI Editor image ID 並重用對應。看到圖片已顯示但選圖器中未勾選時，要檢查照片身分與選取映射。來源：PHA262026-0357、PHA262026-0367。

### K04 Deep link 必須帶足樣式資訊

確認規則：點特定 banner 後，應選到對應 style、正確的類型與分類，且所選樣式出現在可視區域。曾出現 ThumbnailLink 只有功能名，缺 style_guid；也曾資料已選對，但 RecyclerView 尚未完成 layout 而跳過捲動。來源：PHA262026-0306、PHA262026-0344、PHA262026-0308。

### K05 教學略過與冷啟動都會改變初始化時序

AI Try-On 在勾選 Don't show again 後，特定寵物樣式曾落到錯誤 tab；根因是 target type 與預設狀態設定順序。AI Creative Studio 從 deep link 冷啟動時，資料尚未載入就觸碰瀑布流清單，曾觸發 layout crash。回歸需涵蓋首次教學、略過教學、冷啟動、已有資料四種狀態。來源：PHA262026-0281、PHA262026-0358。

Discover 的提示氣泡另有明確的持續性規則：切到 Discover 時本次氣泡應消失，但在用戶還沒按過 Use this template 前，下次啟動仍可再出現。只有實際使用模板後，才不再顯示。來源：PHA262026-0255。是否看過教學、是否進過功能與是否完成關鍵操作，是三種不同的引導狀態。

### K06 功能重構會改變導頁責任

歷史實作：AI Replace 改為獨立 Activity 後，舊通知路徑仍先經 Edit Room 再開面板，造成黑畫面。修正直接進 AI Replace，並由功能本身管理 intro。相同修正也整理 AI Hairstyle 的 intro 判斷。來源：PHA262026-0278。

### K07 跨功能不能共用未清理的選圖狀態

AI Replace 上傳參考圖後回到 Text Bubble、Text 或 Sticker，曾把參考圖當成 Add Photo 新增。RD 根因是 mCurImageIDArray 未重設。來源：PHA262026-0262。這說明「用過其他功能後才出現」值得作為獨立測試前提。

## AI 功能與輸入規則

### K08 AI Replace 的 prompt 與參考圖可擇一

確認規則：在已完成來源圖與遮罩操作的流程中，上傳參考圖或填入 prompt，即可進入下一步；有參考圖時 prompt 為選填。不能因 prompt 空白而把 Replace 保持停用。來源：PHA262026-0260。

### K09 Prompt 長度依功能與模型區分

| 功能與版本背景 | 已確認的歷史限制 | 證據與注意事項 |
| --- | --- | --- |
| AI Replace 20.13 | 500 字元 | 101 字元誤擋後改為 500，QA 於 202605151736 複驗。PHA262026-0198 |
| AI Creative Studio 20.13 | 5000 字元 | UI 放寬但 XML 仍限制 600，改由程式設定。PHA262026-0257 |
| Image to Video 的 Pixverse V6 內容 | promptCharLimit 為 2000 | 討論明確記錄長度 2186 超過 2000。標題雖寫 words，不能據此解釋為 2000 個英文單字。PHA262026-0396 |

上述數值都是來源期間的特定功能或模型設定。模型切換後需重新檢查有效限制，不能把其中一個值套用所有生成房間。

### K10 Inspiration 同樣需要符合模型限制

已發佈的建議內容不保證能通過當下模型的限制或內容檢查。Image to Video 曾有官方 inspiration 超長或觸發限制，實際透過 PM 更新 CMS 內容修正。另有 prompt 被舊模型截斷後，系統誤認使用者改寫，顯示 Use Another Inspiration。修正記錄實際套用的 prompt，再與輸入比較。來源：PHA262026-0396、PHA262026-0397、PHA262026-0398。

### K11 自訂 prompt 必須送到正確欄位

歷史實作：AI Hairstyle 自訂 prompt 沒有效果，RD 查明送錯 property，改用 user_prompt。此類問題應確認輸入、送出內容與生成行為三者一致，不能只確認輸入框能打字。來源：PHA262026-0270。

### K12 人物圖與服飾參考圖的驗證不同

確認規則：AI Try-On 的服飾參考圖沒有臉也可使用。曾因重用人臉檢查而誤擋；修正對該情境略過相關驗證。Pet 類型也不應拿狗照片執行人物驗證，歷史上曾因工作執行緒旗標不同步導致阿拉伯語情境誤報 No face。來源：PHA262026-0392、PHA262026-0232。

### K13 AI Group Shot 支援人物或寵物

產品決策：PM 確認支援人物與寵物，因此當時暫時略過 face detection。原始 bug 要求對無人物照片彈阻擋框，但後續狀態是 Propose Won't Fix，不能把這項原始預期寫成現行規則。來源：PHA262026-0368。

### K14 AI Group Shot 首次選圖與換圖不同

確認規則：首次選圖沿用 Creative Studio 的多選體驗，選滿模板規定的張數後 Next 才啟用；回到 Photo Picker 換圖時，一次只替換一張。2026 年 8 月 24 日的更新取代較早「始終重新選兩張」的實作描述。應另驗證槽位順序與移除結果。來源：PHA262026-0377、PHA262026-0378、PHA262026-0379、PHA262026-0367。

### K15 AI Hairstyle 的自訂子類型有各自選取狀態

歷史實作：My Style 的 Photos／參考圖與 Prompts 共用 GUID 造成切換後 Generate 停用，修正改為各自保存 GUID。另一個問題是 ViewPager 預載未啟用的男性 tab，覆寫目前 My Style 的空選取，導致按鈕反而錯誤啟用。選取狀態應由目前使用的類型決定。來源：PHA262026-0331、PHA262026-0395。

### K16 不同影片功能要求不同媒體

Character Motion Swap 使用角色照片與動作影片，AI Video Try-On 同樣有照片與影片的輸入流程。輸入引導需辨認正在選的是照片或影片，不能把照片引導寫成 Video of One Person。AI Anime Video、AI Video Try-On、Character Motion Swap、Cinematic Reel Creator 另共用 Trim／Continue 相關路徑，模組缺漏可一起影響。來源：PHA262029-0003、PHA262026-0318、PHA262026-0414。

### K17 預設模式與有效輸入必須一致

Image to Video 移除 Duo 後，從 Discover 套模板仍沿用 Duo 預設值，找不到需要的圖片輸入，導致 Generate 無法啟用；修正改成 Single。這是歷史模式變更，不表示往後版本永遠只能使用單張圖。來源：PHA262026-0284。

### K18 AI Removal 的影像與遮罩必須對齊

歷史實作：Pro+ Removal 對特定長寬比照片失敗，來源影像為 2560×909，但縮小遮罩成 1024×364 後比例因取整不同。RD 修正讓 mask 寬高匹配影像。需要測極寬圖、非整數縮放、邊界遮罩與輸出，而不只測一般正方形。來源：PHA262026-0296。

### K19 功能名稱不能代表生成品質已被保證

待確認的品質問題包括：AI Enhance 新增原圖沒有的人物、AI Headshot 裁掉頭部或帶入來源背景、AI Face Swap 輸出解析度下降。AI Replace 的遮罩殘留則被記錄為約 3% 的當時發生率並 Postpone。這些是品質風險與已接受的版本限制，不是產品應有行為或永久缺陷。來源：PHA262026-0293、PHA262026-0406、PHA262026-0405、PHA262026-0350、PHA262026-0264。

## 編輯狀態與操作語意

### K20 Crop 是多分頁共同維護影像變換

來源中的 Crop 包含 Crop & Rotate、Perspective、AI Expand。切換分頁後，旋轉、預覽、裁切框、比例選取與工具狀態需保持一致；再次進入分頁要更新正確影像。歷史問題包含旋轉後切頁不貼框、Perspective 預覽拉伸、旋轉或翻轉後比例仍選取但裁切框卻重設。來源：PHA262026-0416、PHA262026-0438、PHA262026-0458。

### K21 Undo 與 Reset 有明確差異

確認規則：Undo 退回一步，Redo 在有可重做記錄時啟用。Reset 以進入 ImageTransformActivity 首次顯示的影像為基準；預覽與此影像不同才啟用，按下後停留目前 tab，影像回到基準、選項回預設，且 Reset 本身納入 undo 記錄。來源：PHA262026-0426、PHA262026-0427。

RD 在該次修正記錄：tab 切換與 Reset 需建立記錄；一般按鈕操作需記錄，Perspective 只切換選擇項目的情況有例外；Crop／Perspective 滑桿在手指放開且值改變後才記錄。這些是該版本的歷史操作粒度，新增互動仍需對照最新 spec。來源：PHA262026-0427。

### K22 按鈕選取與預覽要一起還原

AI Expand 返回時曾把 ratio pill 重設為 Custom，但沒重畫預覽；另有進入初始 Custom 時沒真正設定 custom mode，造成 Reset 啟用條件錯誤。修正同步重建初次 layout。UI 高亮、真實變換與可還原狀態需要一起檢查。來源：PHA262026-0425、PHA262026-0428。

### K23 大照片同時涉及縮圖與全解析度堆疊

歷史實作：長邊大於 1600 像素的來源走大型照片流程，另有 full-res stack。Crop／Perspective 曾只 commit 縮圖堆疊，使後續 Adjustment 或 Save 改用未裁切原圖。RD 增加 stageLargePhoto，保存全解析度結果再提交縮圖結果。測試應連做幾何變換、Adjustment、儲存並核對輸出。1600 是此票單的重現前提，不是所有照片功能的通用解析度上限。來源：PHA262026-0457。

### K24 影片文字的模板外觀與自訂樣式不同

歷史實作：文字 style 為 null 代表採用模板原本外觀，不能直接替換成通用預設樣式。編輯取消、Undo 或修改 opacity 曾把字體外觀洗回白色或無 preset。修正從現有 title clip 取得基準，取消時還原已提交 style，必要時從模板重建。來源：PHA262026-0439、PHA262026-0440、PHA262026-0441。

### K25 取消操作要還原該面板內的變更

歷史實作：Video Editing 的文字面板只關閉畫面，卻保留 preset、font、style，導致 X 與 V 一樣。RD 修正記錄打開面板時的 undo 深度，取消時退回該位置、清除多餘 redo 並同步 project。該票單讀取時為 RDResolved - Already CodeReviewed，尚未有該票的 QA 結案紀錄；不能宣稱所有影片面板均已複驗。來源：PHA262026-0442。

### K26 返回位置取決於進入前的內容狀態

Video Editing 的 Audio Range Select 關閉後，已有音軌應回音訊面板，未有音軌則回 picker。RD 修正讓 X 與系統 Back 遵循相同判斷。來源：PHA262026-0444。其他面板仍需按自身 spec 定義取消與提交。

### K27 返回後要保留仍有效的生成設定

確認規則：AI Try-On、AI Hairstyle 生成後按 Back，應保留前次樣式與可重用的參考圖；匯入照片後分類也不應重設 All。歷史原因包含清除參考圖、回頁重播初始化及錯誤設定 ViewPager。這與 Create More 是否保留整個 session 是不同議題，後者的 UX 提案尚待確認。來源：PHA262026-0241、PHA262026-0285、PHA262026-0328、PHA262026-0390、PHA262026-0413。

### K28 返回時不能只看記憶體物件是否存在

Character Motion Swap 從 Artwork 開 Create More 產生新 Activity，其初始化刪掉原 Activity 的影片資源；Back 回原頁時 ViewModel 還有非空物件，但檔案已無效。修正返回時驗證實際資源，必要時重設 UI 讓使用者重做 Trim。AI Try-On 也曾生成後刪除參考圖，返回重做卻顯示 Network error。來源：PHA262026-0309、PHA262026-0295。

### K29 暫時遮罩與生成輸出不是相同狀態

AI Replace 從 Artwork 返回編輯遮罩時應保有可見紅色遮罩；但生成結果中出現遮罩殘留是另一種品質問題。兩者不能用同一判準處理。來源：PHA262026-0263、PHA262026-0264。VHS／Glitch 從 Store 返回後也要驗證 mask 有效，避免效果消失。來源：PHA262026-0244、PHA262026-0245。

## 生成費用與使用權益

### K30 一次接受的生成操作不能因連點重複扣點

確認規則：AI Expand 接受第一次 Generate 後就需阻止重複送出。歷史上只擋 300 ms，等待游標尚未顯示前有空窗，造成扣多次卻只生成一張。RD 增加同步設定的 preparing 狀態，直到正式 expanding 接手。此例可衍生測試「第一下到載入動畫出現前」的連點。來源：PHA262026-0418。

### K31 一次免費試用是會消耗並需即時刷新的狀態

確認規則：AI Hairstyle 免費使用完返回後，不應繼續顯示 1 Free Trial。Crop 的 AI Expand 切頁時也不應先顯示付費 Generate 再改 Free Trial；RD 把查核提前到 Activity。iOS Creative Studio 的 Botero style 亦有先顯示點數再顯示免費的類似問題。來源：PHA262026-0252、PHA262026-0429、PHI262606-0078。

### K32 點數取決於真正的生成模式

AI Try-On 自訂 prompt 在當時應為 3 點，而非參考圖等模式錯配後的 6 點。RD 必須先分辨 prompt／reference image，再取正確 actionID、styleID。此數字是 20.13 的具體規則，之後應查當時設定。來源：PHA262026-0271。

### K33 影片時長標示要與計費的時間單位一致

歷史實作：AI Video Try-On／Character Motion Swap 的顯示時長要對齊點數計算，RD 指出使用 ceil() 向上取整到秒。原始 bug 描述 3s 顯示 4s，不能因此改寫成所有時長一律向下取整。邊界應同時查 Trim 實際時間、UI 顯示與費用。來源：PHA262029-0005。

### K34 費用尚未可得時只顯示 Generate

產品決策：Character Motion Swap 內容或選取尚未準備好時，PM 確認只保留 Generate 字串，不需要顯示 --，也不能要求在影片時長未知時固定顯示某個價格。來源：PHA262029-0001。

### K35 Create a Video 的額外確認框不是必要條件

產品決策：AI Group Shot Artwork 的 Create a Video 按鈕應呈現如 Generate 並顯示點數資訊，PM 確認略過額外確認 dialog。來源：PHA262026-0369。若費用已明示，不能單憑「沒有確認框」判為功能缺陷。

### K36 點數明細與訂閱權益

使用者補充確認（2026 年 10 月 16 日，測試前置作業）：每輪測試開始、執行第一個 Test Case 之前，先確認目前為**免費使用者且點數餘額為 0**。此流程每輪測試只做一次，不在每個 Test Case 前重做；同一輪後續依案例計畫切換訂閱或購買測試點數時，不因初始狀態不同而再次重設。iOS 與 Android 各自開始一輪測試時，分別確認各自的初始狀態。

若已同時符合免費使用者與 0 點，直接開始測試，不重設。若任一條件不符，依使用者指定流程處理：

1. 進入 Edit Room ＞ Settings ＞ About，連續點擊 [<] 下方的 backdoor 按鈕，直到 debug dialog 開啟。
2. 關閉 **set to subscriber** 選項。
3. 向下捲動，對 **UUID** 與 **member token** 分別執行重設。RD 將介面上的 **reset** 誤寫成 **rest**，辨識目標時須依此實際標籤及所屬欄位操作；不可把其他欄位的 rest 當成同一動作。
4. 點選 **OK**，關閉並重新開啟目標 App，不以清除 App 資料取代此流程。
5. 重啟後再次確認免費使用者狀態與點數為 0，再開始第一個案例；未確認成功時記錄前置作業受阻，不把未知狀態當成已完成設定。

此操作屬於每輪測試的初始環境設定，不是產品功能合約，也不是每案例的清理步驟。保留必要的設定前後畫面、重啟結果及操作紀錄即可；UUID 與 member token 的原始值不應寫入報告，含識別值的截圖須遮蔽。不要變更其他 debug 選項；測試過程中若已建立作品、扣點或有待確認的付款，不把本前置重設當作例行中途復原方式。

使用者補充確認（2026 年 10 月 16 日，AI Exposure）：AI Exposure 為付費使用者專用功能。免費使用者點選功能入口時顯示 Upgrade to VIP 對話框，點選 Upgrade 後進入 IAP 頁面；不再以免費 Try Before Buy 路徑作為測試預期。付費使用者點選功能入口時先顯示 Try it 對話框，點選 Try it 才進入功能畫面；此動作不等同於按 Generate。此確認未改變生成費用或點數不足流程，亦未指定必須完成購買。

使用者補充確認（2026 年 10 月 16 日）：Android 只有一種 VIP 權益模式，文件中的 VIP、Pro、paid user 均指同一種 Android VIP 模式，不是不同付費等級。iOS 的 Pro 與 Pro+ 為不同模式，不可將此分級套用到 Android。分析 Android 規格或配置測試帳號時，應將這些名稱視為同義詞，不因命名不同而判為權益規格未定；各功能的價格與點數不足導向仍依該功能當前 Spec Source。

使用者補充確認（2026 年 10 月 15 日）：所有使用 credits 的 AI feature，在 Generate 流程結束後，都應能從 Buy Credit page 右上角的 Detail 查看詳細的 credit 使用紀錄。紀錄應顯示正確的 feature 名稱，並正確記載該次流程實際發生的扣點與退點。若有退點，退點紀錄與數量也必須正確；這不表示每次生成都必須退點。

回歸檢查應在 Generate 流程結束後開啟 Detail，核對 feature 名稱，以及實際扣點、退點與明細是否一致。這項規則適用於所有使用 credits 的 AI feature，不能只驗證某一個功能或只看總餘額。來源為本次使用者補充，非由下列歷史 eBug 推導。

確認規則：Credit Auto Pass 的點數明細應使用自己的名稱，不能誤列 Yearly Credit Bonus；該次由 .com server 修正文案。Premium 購買後 Mine 權益樣式也應在回頁時更新。待確認議題包含雙訂閱下取消月費的 RTDN、Production 贈點與 Stage 不一致，不能從目前票單推導完整贈點週期或所有通知條件。來源：PHA262026-0199、PHA262026-0217、PHA262026-0316、PHA262026-0218。

### K37 試用預覽不必然能保存結果

產品決策背景：AI Enhance Try First 完成後不能套用的 UX 問題，在 2026 年 9 月 16 日 review 被決定 won't fix。不能把其他 AI 功能一次免費生成的語意套用到它，或承諾所有 trial 都可輸出。來源：PHA262026-0386。

### K38 Daily Bonus 與裝置綁定需按服務環境理解

帳號在不同 app 領取 Daily Bonus 的票單，被 server RD／QA 確認並提議 NAB。討論明確寫 Stage 每會員每日最多 3 個產品可領取；因此「同帳號只能在一個產品領」不是可用規則。UUID 一天 3 次後仍可登入的另一筆同樣 ProposeNAB，但沒有足夠文字建立新的確定上限。來源：PHA262026-0403、PHA262026-0402。

### K39 IAP 的顯示取決於完整權益與入口

Launcher 的購物入口與新用戶 offer bubble 曾使用不同的訂閱／perpetual 判斷，造成錨點不在但氣泡仍在，且後來再度回歸。AI Expand → Credits → Subscribe 的 crash 則涉及集中處理訂閱 dialog，風險同時涵蓋 Image to Video 與 Hair Volume。來源：PHA262026-0312、PHA262026-0196。

## AI Agent 對話與工作生命週期

### K40 對話包含 session 與 turn 兩種粒度

歷史實作：session 保存聊天歷史與進行中的工作；turn 包含一次送出後的回覆與輸出。不能只收到 turn_complete 就認定生成成功，因曾出現 final_state=block、error code 0 且無 outputs，最後只顯示 generic error。該問題由 Iris v2.3.0 修正並經複驗。來源：PHA262026-0319。

### K41 Native Agent 初始化必須只發生一次

歷史實作：IO 與 Main 同時初始化 native agent，使同一 turn_complete 寫入 DB 兩次，Suggest 回覆重複。RD 改用 AtomicBoolean compareAndSet 管理 init／destroy。此根因涉及併發與生命週期，並非使用者重複送出。來源：PHA262026-0353。

### K42 回前景後要恢復工作與事件處理

確認規則：生成中的 Agent 回到前景後應顯示結果。歷史上先補 pendingResume 表示 session 有進行中工作，後續仍複驗失敗，才找到 native agent 已銷毀但 loadSessionHistory 等待其 session_list，卡住事件收集。修正把 history 載入放到獨立 coroutine。來源：PHA262026-0321。

尚有「thinking 時進背景，回來顯示 network error」的 Assigned 票單；不能用前一筆已 Close 推論這種時間點也已修復。來源：PHA262026-0422。

### K43 聊天離開提示採用歷史入口引導

產品決策：離開 AI Agent 沒警告 dialog 的原始問題，最後維持既有離開流程，改在 history 按鈕加 hint bubble 並更新 icon。不能再沿用原始「離開一定要警告框」的預期。來源：PHA262026-0320。

### K44 對話權益不是無限次

確認規則：Premium 對話說明由「無限次暢聊」修正為伺服器正常情況下較高的對話額度。原始紀錄出現 30 次，但正式修正文案沒有把它訂為永久固定值。來源：PHA262026-0351。

## 作品管理與輸出

### K45 作品型別與工作型別要分開

歷史實作：Artwork 同時處理 longTaskImage 與 shortTaskImage，錯把長任務圖片當成 error pack 過濾會讓 Headshot 圖片不能顯示。後來 Headshot V3 另需當成 short task 才會進 Recent，說明不同版本可以改工作分類。來源：PHA262026-0194、PHA262026-0436。

### K46 空畫面狀態必須由篩選後結果決定

確認規則：AI Group Shot 只有影片而 Photo 篩選沒有圖片時，要顯示 Nothing yet。歷史根因是 adapter 使用篩選後清單，pageState 卻看未篩選清單而保持 SUCCESS。來源：PHA262026-0363。

### K47 加入功能也要加入作品與 Recent 的對應

使用者補充確認（2026 年 10 月 16 日，共通規則）：所有會扣 credits 的 AI feature，在圖片 Generate 成功完成後，都會自動保存一份生成結果至 My AI Artwork，並在 My AI Artwork 中有該功能專屬的 feature tab，生成結果應歸入對應分頁。這是 PHD 各扣點 AI 圖片功能的共通產品規則，不限於 AI Exposure；新增功能、分析規格及設計回歸案例時，須檢查作品保存與專屬分類的對應。

適用邊界：本次確認針對扣 credits 的 AI 功能所生成的圖片，不自動擴大為影片、生成失敗或未完成工作的保存規則。此共通確認也未定義各功能的分頁名稱、排序、跨工作階段入口或其他輸出行為。Recent 分頁及 [V] 與保存的關係，以下方 AI Exposure 的明確確認為準，不直接推廣到所有功能。

使用者補充確認（2026 年 10 月 16 日）：AI Exposure 的 Generate 成功完成後，無論是否按 [V] 將結果帶回 Adjustment，該結果都會自動保存至 My AI Artwork 的 Recent 與 AI Exposure 兩個分頁。My AI Artwork 入口為 Launcher ＞ AI Photos ＞右上角 My Artwork 按鈕。[V] 不是保存作品的必要條件；這也不表示生成後必須自動跳轉至作品庫。本規則來自使用者直接確認，與下方歷史 eBug 的待確認狀態分開記錄。

AI Headshot V3 生成成功但 Recent 不列出，已修正複驗。AI Exposure 作品被放在 Creative Studio 分類的另一票則為 NewCreated，正確獨立分類是該票提出的預期，尚未有後續確認。作品對應表需要跟隨功能版本更新。來源：PHA262026-0436、PHA262026-0459。

### K48 長任務有進度呈現與完成通知

確認規則：Artwork 長任務的 processing tile 加入來源縮圖，曾透過 spec 更新完成。Cinematic Reel Creator 與 AI Group Shot 影片也需傳入 FCM 標題、訊息並設定完成通知和 deep link；只驗證生成結束不足以涵蓋通知點回正確頁面。來源：PHA262026-0375、PHA262026-0373。

### K49 Artwork 的點擊防重入會影響感知回應

歷史實作：進入 pack 後 800 ms 內點其中圖片會被共用防連點機制擋下，使用者感覺要點兩次。修正增加進包等待指示，並非單純把雙擊改成單擊。來源：PHA262026-0195。

### K50 預覽與輸出必須使用同一份最新狀態

Collage 手勢縮放已存在 PanZoomViewer 當下變換，但 export 讀取上次 render 的 EngineROIInfo，造成縮小的照片儲存後回原大小。修正 export 時直接複製最新手勢 transform，不再依賴 render 完成順序。這是「畫面對、檔案錯」的重要定位案例。來源：PHA262026-0404。

### K51 顯示尺寸與輸出解析度分別檢查

512×512 的 Image to Video 作品因 centerInside 不放大小圖，縮圖看起來特別小；改 fitCenter 修正。這沒有把影片真的提升解析度。另有 Face Swap 真實輸出解析度下降的待確認票單，需看檔案尺寸而非 UI 大小。來源：PHA262026-0280、PHA262026-0350。

### K52 音訊有圖示狀態與模板設定兩條路徑

AI Group Shot 的 mute icon 要反映實際播放狀態，切模板或重建 MediaPlayer 也需保留 isMuted。另一個「生成結果 BGM 和 preview 不同」曾以 CMS audio_setting_toServer=none 處理，PM 說後續觀察用量再評估 vendor 模式。不能從結案推導成所有模板都必須帶相同 BGM。來源：PHA262026-0364、PHA262026-0380、PHA262026-0381。

### K53 完成生成與成功儲存是不同階段

AI Group Shot 儲存影片後看似回到 Recent，其實是 native audio crash，RD 透過 R8／ProGuard 規則修正。尚有「Save & Share 沒明確儲存完成提示」的 UX 票單未結案。應驗證檔案確實存在、可開啟，再判斷畫面提示是否正確。來源：PHA262026-0401、PHA262026-0387。

### K54 分享與外部服務受地區及安裝狀態影響

TikTok 分享入口導到當地不可用商店項目仍為 Assigned，不能直接把「所有國家都顯示」當成合理預設。Discover 作者連結則曾由商店改成使用 CMS social_media_link 導向 Instagram 個人頁。來源：PHA262026-0437、PHA262026-0248。

## 內容服務與環境

### K55 內容可由 App 內建與 CMS 兩邊提供

歷史實作：AI Agent 圖示需更新內建版本與 CMS 版本，QA 被要求同時測 light／dark 及第一次無網路啟動。只看連網後內容無法代表內建 fallback 正確。來源：PHA262026-0333、PHA262026-0340。

### K56 CMS 定義不只是圖片網址

來源內容服務涵蓋 banner、名稱、翻譯、模板、分類、樣式 GUID、inspiration、樣本、音訊設定、new tag 及導頁資訊。AI Agent 縮圖遺失、AI Hairstyle new tag、Discover 作者連結與 Collage 搜尋都曾涉及 CMS，而不是只改 App code。來源：PHA262026-0415、PHA262026-0315、PHA262026-0248、PHA262026-0266。

### K57 語言與內容版本會影響資料更新

歷史 API 紀錄包含 product、platform、lang、contentVer／metaDataVer 等維度。AI Hairstyle new tag 修正需改 tag GUID 並重設 CMS eTag；切語言後 banner 或 Image to Video sample 不更新仍有未結案紀錄。來源：PHA262026-0315、PHA262026-0342、PHA262026-0243。

### K58 iOS 動態縮圖快取需能辨認內容更新

歷史實作：iOS 以 feature GUID 快取動畫縮圖，導致 Try-On 找不到影片或 Expand 沒更新。兩筆修正都改用 animated thumbnail URL hash 做查找與播放。這只能直接證明 iOS 該版本的實作，不能推定 Android 同樣採用。來源：PHI262607-0001、PHI262607-0002。

### K59 CMS 搜尋的標籤與索引要一致

Collage 的建議標籤由 metadatas 提供，內容由 contents 提供，搜尋用 indexdocs。阿拉伯語與越南語曾在 Stage 資料移轉後產生 No Result；暫時改英語搜尋標籤以免影響 iOS GM。這是資料一致性與過渡方案，不能據此定義「本地語言搜尋不支援」。來源：PHA262026-0266。

### K60 Stage 的容量與時間行為不能直接代表 Production

| 具體紀錄 | 後續說明 | 可用的判讀 |
| --- | --- | --- |
| AI Expand 等待 1 分 48 秒 | Stage 容量限制，RD Production 兩次約 17 秒 | 兩者是當時觀察值，不是效能 SLA。PHA262026-0419 |
| Character Motion Swap 卡 processing | Test Stage 缺資源，Close 但文字寫 Unable to fix | 結案不代表已有功能修復。PHA262026-0297 |
| RTDN account hold 顯示 76320 天 | 討論說明 53 天×1440＝76320，Stage 時間換算背景 | 不把數字當真正保留天數。PHA262026-0314 |
| Production 訂閱贈點不正常 | 原票註記 Stage 有給，仍 NewCreated | Stage 通過不能證明 Production 贈點。PHA262026-0218 |

### K61 性能抱怨可能以預期管理處理

AI Enhance 平均約 48 秒的票單，RD 記為當時限制，修正 waiting cursor 樣式；iOS 關聯留言提到約 1 分鐘提示。這只能支持改善等候呈現，不能宣稱演算法已加速或保證一定在某秒數完成。來源：PHA262026-0294。

## 平台與在地化

### K62 Android 前背景與 Activity 重建需分開測

Character Motion Swap 回前景缺模型清單，RD 指出 Activity／ViewModel 被重建卻沒初始化資料，可用 Don't keep activities 重現。AI Agent 則有 session 恢復與 native agent 事件問題；變更 app 語言也可能銷毀 Activity，使未附著 fragment 的 IAP 操作 crash。來源：PHA262026-0310、PHA262026-0321、PHA262026-0303。

### K63 系統返回行為受 Android SDK 變動影響

歷史實作：SDK 36 預設 Predictive Back 後，既有 onBackPressed／KEYCODE_BACK 路徑未如原設計運作，Blur Tool 返回變黑、Edit Room 直接退 Launcher。該版本修正關閉 enableOnBackInvokedCallback。這是專案當時的相容策略，不能泛化為所有 Android App 的建議設定。來源：PHA262026-0370、PHA262026-0371。

### K64 Edge to edge 與鍵盤要共同配置

AI Agent prompt 被鍵盤遮住，RD 記錄 Android 15 的 edge to edge 行為令原有 adjustResize 不足，改監聽 IME insets，底部 padding 取 navBar 與 IME 最大值。Image to Video model list 無法捲動則來自 keyboard listener 覆寫 view padding listener。來源：PHA262026-0349、PHA262026-0423。

### K65 摺疊螢幕問題集中在可用高度與捲動

Fold7 展開時，AI Creative Studio prompt、AI Art／Try-On／Hairstyle bottom sheet、Task Center、Credits pack、Mosaic preview 都有高度或存取問題。已記錄的修正包含依可用高度設定 maxHeight、增加 ScrollView、修正 constraints 及 preview height。Open Intro 裁切與部分 Credits 票單當時仍未結案，不能籠統宣稱 Fold7 已全面修正。來源：PHA262026-0322 至 PHA262026-0327。

### K66 RTL 不只是文字翻譯

| 元件 | RTL 必須一致的關係 | 歷史問題與來源 |
| --- | --- | --- |
| 氣泡與箭頭 | 指向真正按鈕、符合 start／end | AI Agent 的螢幕實體座標與 marginStart 計算混用；一次試用箭頭需 auto mirror。PHA262026-0348、PHA262026-0214 |
| Prompt 輸入框 | 文字保留按鈕所需空間 | 絕對 left／right padding 改成 relative。PHA262026-0352 |
| Slider 與漸層 | 滑動方向與效果方向吻合 | Skin Tone、AI Relight 對應反向。PHA262026-0215、PHA262026-0224 |
| 列表與工具列 | 項目在框內、可捲動 | Blender、Light Leak、Mirror、Mosaic 曾越界。PHA262026-0225、PHA262026-0226、PHA262026-0227、PHA262026-0211 |
| 自動大小與對齊 | 量測後仍有可用寬高 | ID Photo wrap_content 與 centerHorizontal 循環量測，RTL 變零寬。PHA262026-0274 |
| 文字和 icon | 垂直置中、保留可用空間 | Headshot credit icon、Character Motion Swap 的 i 按鈕。PHA262026-0238、PHA262026-0230 |

### K67 在地化要按最終決策與日期判讀

阿拉伯語多筆票單最初建議保留英文，但部分後續由 PM 要求翻譯並複驗完成。例如 Blur、Conceal、Presets、Launcher shortcuts 與 Edit Room 功能名，不能再沿用較早「不翻譯」留言。相對地，Camera ON／OFF、HD／Ultra HD、部分 Premium／AI Denoise／AI Deblur／ISO 字樣，在各自票單最後記為不需翻譯。這些是特定字串的產品決策，不是「所有專有名詞都不翻譯」。來源：PHA262026-0200、PHA262026-0202、PHA262026-0204、PHA262026-0207 至 PHA262026-0210、PHA262026-0212、PHA262026-0216、PHA262026-0213、PHA262026-0219 至 PHA262026-0223、PHA262026-0229。

### K68 阿拉伯語介面仍可使用西文數字

確認規則：Quick Actions 多個 slider 依 2026 年 5 月的決定對齊 iOS，以 Locale.US 保留 0–9。另一票修正使用 formatWithWesternDigits。語系是阿拉伯語不代表每個數字都必須換成另一套數字字形。來源：PHA262026-0201、PHA262026-0203、PHA262026-0205、PHA262026-0206、PHA262026-0239。

### K69 長字串的解法包含翻譯與版面

NLD、IND、PLK、ESP、PTB、RUS 等問題曾透過縮短字串、調 padding、依可用寬度置中、允許捲動或統一工具列文字量測修正。修正 NLD toolbar 時，RD 同步 StaticLayout 與 TextView 的斷行策略、停用自動斷字，再統一跨 tab 最小字級。新增語言需檢查實際可讀性與操作，不只看有沒有譯文。來源：PHA262026-0304、PHA262026-0305、PHA262026-0307、PHA262026-0335、PHA262026-0384、PHA262026-0267、PHA262026-0269。

### K70 字串格式錯誤可以導致功能 crash

IND IAP 年費字串把 Android 的 %1$s 寫成 %@，開頁即 crash。這不是純翻譯品質問題；需保持平台格式佔位符、型別及參數數量一致。來源：PHA262026-0298。

### K71 在地化範圍可能分階段發佈

Interstitial 在 MEX／THA／ARA／VIT 等語系未翻譯的票單，PM 說 Phase 1 先主要語系，其餘暫用英文，後續補內容。這筆為 Postpone，代表已知的發佈安排，不代表永遠不用翻譯。來源：PHA262026-0279。

## 模組與事件紀錄

### K72 Release 模組與 R8 規則會影響端到端流程

| 症狀 | 已記錄根因 | 來源 |
| --- | --- | --- |
| ID Photo 拍照 Next crash | R8／ProGuard，且第一次修正 PR 未納入 build，複驗仍失敗 | PHA262026-0385 |
| Group Shot 影片 Save 後跳走 | native audio JNI crash，補 ProGuard class | PHA262026-0401 |
| 多個影片功能 Trim Continue 顯錯 | 找不到 libCLAudFxMgr.so，補 Audio Effect Engine 及 Android Audio Mixer 模組 | PHA262026-0414 |
| Artwork Add Text crash | Cheetah／CESAREngine 等 eModule 相依版本調整 | PHA262026-0424 |
| Hairstyle 選圖後下載資產或 Character Motion Swap 無法匯入 | Muse 資產搬移與 CMS Venus／Muse 檔名不一致 | PHA262026-0329、PHA262026-0332 |

這些紀錄說明「最新程式已改」仍須核對實際測試 build 的模組與資產；不要只看 UI 或 PR 已合併。

### K73 圖片重用要處理非同步載入

Launcher AI Agent shortcut 曾因 RecyclerView 重用而顯示錯誤 icon，RD 指出舊 Glide HTTP request 未取消，修正重用前先取消。Camera filter 的 crash 則來自 template name 為 null。視覺內容錯誤可能是 view 重用或資料缺值，未必是 CMS 本身給錯圖。來源：PHA262026-0365、PHA262026-0253。

### K74 Mixpanel 需對齊功能與操作入口

| 事件／操作 | 已確認對應 | 來源 |
| --- | --- | --- |
| AI Video Try-On 的 Monetize_Subscription_Appear | feature=ai_video_try_on | PHA262026-0318 |
| AI Enhance Advanced 的 Monetize_Subscription_Appear | feature=ai_enhance_advanced，包含 Generate 與 CTA 入口 | PHA262026-0317 |
| Artwork gallery 單張 Save | 要傳真實下載 item，不能假設 selection mode 的清單有值 | PHA262026-0383 |

歷史上 gallery 直接下載時 selectedListLiveData 為空，事件被丟棄；修正讓下載成功事件帶作品，並修改 18 個 fragment 實作。單張下載與多選下載因此都是必要觀察路徑。

## 待確認的產品議題

下列內容保留為問題知識，不能直接作為自動化 Test Case 的已核准預期。

| 議題 | 目前可確定的範圍 | 來源 |
| --- | --- | --- |
| Create More 保留輸入 | Try-On、Image to Video 等提出保留來源與分類的 UX 建議，仍 NewCreated；與 Back 保留已選 style 的已修復問題不同 | PHA262026-0390、PHA262026-0413 |
| AI Background 自訂樣式命名 | 重複 Custom 名稱造成辨識困難，尚無採用哪種命名方案的決策 | PHA262026-0409 |
| Undo 後 Generate／Retry CTA | 顯示 Retry 2 credits 卻無操作，尚未確認最終修正語意 | PHA262026-0408 |
| Mine 資訊架構 | 帳號、專案、設定是否應集中於 Mine，是未結案 UX 主張 | PHA262026-0389 |
| Edit Room 付費功能提示 | 鎖頭、皇冠或點數是否應預先呈現，尚無完整決策 | PHA262026-0388 |
| Save 完成回饋 | 缺明確儲存確認的 UX 提案仍未結案 | PHA262026-0387 |
| Collage 調整時整體預覽 | 提案增加整張拼貼預覽，尚未有確認方案 | PHA262026-0435 |
| 素材搜尋服務切換 | Getty Images／另一 Stock 分頁切換是否清除搜尋字串，原始預期未有後續確認 | PHA262026-0433 |
| AI Photos 功能排序 | 排序一致性的建議存在，不能假定已採字母或發布日排序 | PHA262026-0336 |
| RTDN 通知完整條件 | 年費免費試用取消、雙訂閱取消等仍需補正式決策 | PHA262026-0313、PHA262026-0316 |
| 特定裝置偶發問題 | Camera frame 未顯示、ID Photo 取消 Makeup 黑圖、Reshape 購買後卡住等不能當成穩定普遍規則 | PHA262026-0460、PHA262026-0289、PHA262026-0277 |
| ID Photo 去背取消 | Eraser 按 X 後 cutout 背景改變仍為 Assigned，尚無已確認根因 | PHA262026-0275 |
| 模擬器問題 | LDPlayer 的影片格式與 Agent 回覆異常尚無足夠資料外推真機 | PHA262026-0356、PHA262026-0343 |

## 回歸設計與問題定位

### 由歷史問題歸納的測試矩陣

以下是測試設計建議，並非已執行的新一輪驗證。使用時需由最新 Spec Source 定義 Claims。

| 測試維度 | 建議組合 | 主要防範問題 |
| --- | --- | --- |
| 入口 | Home、banner、AI Photos／Videos、Edit Room、Discover、Artwork、通知 | style、來源圖、intro、返回堆疊錯誤 |
| 首次與重入 | 冷啟動、首次教學、略過教學、返回、Create More | 初始化重播、選取遺失、無效暫存資源 |
| AI 輸入 | preset、prompt、reference image、人物、寵物、無臉服飾圖 | 驗證錯套、模式 GUID 錯配、費用與 prompt 未使用 |
| 生命週期 | 前景生成、thinking 背景、生成中背景、工作完成後回頁、Activity 重建 | 結果遺失、重複回覆、模型清單空白 |
| 幾何與輸出 | 大圖、極寬圖、Crop／Rotate／Perspective，再 Adjustment／Save | mask 比例、全解析度堆疊、預覽與輸出不一致 |
| 操作語意 | X、V、系統 Back、Undo、Redo、Reset、連點 | 提交與取消混淆、一次操作多扣點 |
| 權益 | 免費、試用未用、已用、Premium、Credit Auto Pass、雙訂閱 | CTA 狀態、明細名稱、權益刷新、通知條件 |
| 作品 | Recent、功能分類、Photo／Video、空清單、processing、pack、單張與多選下載 | 篩選狀態、作品漏列、點擊等待與事件遺漏 |
| 平台與語言 | Android 15／16、Fold7 展開、iOS、LTR／RTL、長字串、light／dark | IME、返回、RTL 方向、尺寸與對比 |
| 服務資料 | Stage／Production、內建離線、CMS 更新、語言切換、快取已有 | 資源容量、舊內容、fallback 與索引不一致 |

### 症狀與優先檢查方向

| 症狀 | 先檢查什麼 | 支持案例 |
| --- | --- | --- |
| Network error 但網路正常 | 暫存圖是否被刪、preset 無 prompt 的檢查、Agent final_state | PHA262026-0295、PHA262026-0251、PHA262026-0319 |
| 輸入都選了 Generate 仍停用 | 目前模式／GUID、Duo 遺留、子 tab 選取、非啟用頁覆寫 | PHA262026-0284、PHA262026-0331、PHA262026-0395 |
| 預覽正常但輸出錯 | 最新 transform、full-res stack、實際來源 buffer | PHA262026-0404、PHA262026-0457、PHA262026-0382 |
| 回前景後不更新 | Activity 是否重建、native agent 是否還在、事件收集是否等待 | PHA262026-0310、PHA262026-0321 |
| 新圖示或縮圖不出現 | 內建與 CMS 是否都更新、快取 key、eTag、view 重用 | PHA262026-0340、PHI262607-0002、PHA262026-0315、PHA262026-0365 |
| 新語言直接 crash | format placeholder、被重建 Activity、fragment attachment | PHA262026-0298、PHA262026-0303 |
| 手機沒問題 Fold 出錯 | available height、bottom constraints、捲動與 hit target | PHA262026-0324、PHA262026-0326 |
| 點儲存卻跳回前頁 | 是否 native crash、R8 與 audio module 版本，不先假定導航設計 | PHA262026-0401 |

### 如何使用這份知識

建立新功能 Test Case 時，先找相同輸入型態、相同入口與相同共用元件的案例，再按最新 Spec Source 決定預期。修正後的回歸應涵蓋原路徑與 RD 明確指出的影響範圍，例如 gallery save 的所有具體實作、共用 Trim、IAP dialog 或跨 tab toolbar。

處理舊 bug 時，先閱讀最新討論、RD 根因與最後 QA 複驗，再看原始 Expected Result。PHA262026-0385、PHA262026-0321、PHA262026-0312 都曾在修正後再失敗；PHA262026-0297 雖 Close 卻記為 Stage 資源限制。狀態、修正實作與可觀察行為需要分別理解。

每個具體知識點已列出來源 BugCode。旁邊的來源索引包含原始標題、匯出狀態、閱讀時遠端狀態、是否納入與 eBug 連結。文中提到的關聯票單僅採用本批頁面可見的連結／留言，未宣稱已另讀所有關聯 ticket。新增 spec 或版本改變時，應更新相關條目並保留原版本背景。
