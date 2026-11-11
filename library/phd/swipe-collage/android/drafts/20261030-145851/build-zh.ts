// Traditional Chinese (Taiwan wording) reading copy of draft.csv (user, 2026-10-30, REQ-002). The English draft.csv stays
// the source of truth (AGENTS.md: table rows are written in English); this copy is for reading only and is rebuilt from
// it. UI strings in 「」 stay as the app's English UI shows them. Columns ID, Priority, Spec Ref, Change are copied.
// Writes draft.zh-Hant.csv (UTF-8 with BOM, opens in Excel) and draft.zh-Hant.xlsx.
// Re-runnable: node library/phd/swipe-collage/android/drafts/20261030-145851/build-zh.ts
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import ExcelJS from 'exceljs';
import { DRAFT_COLUMNS, readTable } from '../../../../../../scripts/lib/library.ts';
import { toCsv } from '../../../../../../scripts/lib/csv.ts';

const HERE = dirname(fileURLToPath(import.meta.url));
const FREE = '以 Free（非 Premium）帳號登入';
const PREM = '以 PhotoDirector Premium 帳號登入';
const CANVAS = '在 Year End 版型的 Canvas 上（從 Template Preview › 「Use Template」 進入）';
const FILLED = `${CANVAS}，所有 frame 都已放入照片`;
const MULTI = `${CANVAS}，畫布上有一個多圖 frame（例如「3 photos」底片款）`;

const SECTION: Record<string, string> = {
  'Entry': '入口', 'Template Page': '版型頁', 'Template Preview': '版型預覽', 'Canvas': '畫布', 'Photos': '照片',
  'Frame focus': 'Frame 選取', 'Image focus': '照片選取', 'Swap and drag': '交換與拖曳', 'Frame styles': 'Frame 樣式',
  'Locks': '鎖定', 'Background': '背景', 'Add Layer': '新增圖層', 'Layers': '圖層', 'Ratio': '比例', 'Pages': '頁面',
  'Export': '匯出', 'Monetization': '付費', 'Android Back': 'Android 返回鍵',
};

// [Precondition, Action, Expected Result, Notes] in draft.csv order
const ZH: Record<string, [string, string, string, string?]> = {
  'TC-001': ['剛啟動受測版本', '從 Launcher 進入 Collage 房間', 'Collage 房間頂端、在 Collage 分類上方，顯示帶有「NEW」標籤和「›」的 Swipe Collage 橫幅', '各畫面的橫幅文案不一致（Q-1）：請記下 App 實際顯示的標題與副標。'],
  'TC-002': ['已從橫幅進入過 Swipe Collage 至少一次', '離開 Collage 房間再進入；重新啟動 App 後再做一次', '每次進入 Collage 房間，頂端都仍顯示橫幅', ''],
  'TC-003': ['在 Collage 房間', '點選 Swipe Collage 橫幅', '開啟標題為「Scrollable Collage」的版型頁：是獨立房間，有自己的分類標籤，不是 Collage 底下的一個分類', ''],
  'TC-004': ['在 Launcher', '在 Launcher（含捷徑、工具清單）中尋找 Swipe Collage 捷徑', '本版本的 Launcher 沒有 Swipe Collage 捷徑；App 內唯一入口是 Collage 橫幅', ''],
  'TC-005': ['已安裝 PhotoDirector、App 已關閉；RD 提供的 deeplink `scrollable_collage`（不帶參數）', '開啟 deeplink（adb `am start -a android.intent.action.VIEW -d <link>`）', 'PhotoDirector 開在 Swipe Collage 版型頁（瀑布流），並選取第一個分類「Year End」', '需要：RD 提供 deeplink 網址（Q-10）。'],
  'TC-006': ['deeplink `scrollable_collage` 帶入非 Year End 分類的 `category_guid`', '開啟 deeplink', '版型頁開啟並選取該分類標籤，列出該分類的版型', '需要：RD 提供 deeplink 網址（Q-10）。'],
  'TC-007': ['deeplink `scrollable_collage` 帶入 `template_guid`', '開啟 deeplink', '直接開啟該版型的 Template Preview（顯示該版型的照片數／頁數）', '需要：RD 提供 deeplink 網址（Q-10）。'],
  'TC-008': ['由帶 `template_guid` 的 deeplink 開啟的 Template Preview', '點「‹」，再點一次「‹」', '第一次 ‹ 回到版型頁；第二次回到 Collage 房間（或 App 的前一頁）', '規格沒寫 deeplink 進入後 ‹ 會回到哪裡；請記錄結果（Q-10）。'],
  'TC-009': ['已開啟版型頁', '查看版型清單', '版型以瀑布流（錯落的兩欄清單）排列；標題為「Scrollable Collage」，左上有「‹」', ''],
  'TC-010': ['已開啟版型頁', '查看數張版型卡片下方的標示', '每張卡片只顯示照片數與頁數，例如「6 photos · 3 pages」；沒有直式／橫式標示', ''],
  'TC-011': ['已開啟版型頁', '比對卡片縮圖與該版型 Template Preview 的第一頁', '卡片縮圖顯示的是版型的第一頁', ''],
  'TC-012': ['已開啟版型頁', '查看分類標籤', '顯示 3 到 4 個分類標籤；「Year End」是第一個，進入時即為選取狀態', ''],
  'TC-013': ['已開啟版型頁', '依序點選每個分類標籤', '每個標籤都會反白，清單切換成該分類的版型', ''],
  'TC-014': ['已開啟版型頁；CMS 至少將一個版型設為 NEW', '尋找卡片上的 NEW 標籤', 'CMS 設為 NEW 的版型顯示「NEW」標籤；其他版型沒有', ''],
  'TC-015': ['已開啟版型頁', '查看 PRO 版型的卡片', '每個 PRO 版型的卡片右上角都有「PRO」圖示；免費版型沒有', ''],
  'TC-016': ['已開啟版型頁', '在卡片縮圖上向右滑（在卡片上水平滑動），看完所有頁', '縮圖逐頁顯示該版型後面的每一頁；清單本身不會捲動', ''],
  'TC-017': ['已開啟版型頁', '合計所有分類的版型數量', '共 20 個版型（Day 1）；跨分類重複的版型請另外記下', ''],
  'TC-018': ['已開啟版型頁', '依序把 App 語言切到繁體中文、日文（東方），再切到英文、德文（西方）；每次切換後重新開啟版型頁，滑過每一頁版型', '繁體中文和日文顯示東方縮圖組；英文和德文顯示西方縮圖組（該組的每一頁）', '語言依 REQ-004。規格沒寫縮圖組是依 App 語言還是手機地區決定（Q-12）：如果某個語言顯示另一組，請一併記錄手機地區。'],
  'TC-019': ['已開啟版型頁', '點「‹」', '回到 Collage 房間', ''],
  'TC-020': ['已開啟版型頁', '點選一個版型縮圖', '開啟該版型的 Template Preview', ''],
  'TC-021': ['免費版型的 Template Preview', '查看畫面', '標題為「Template」；圖片下方顯示照片數與頁數（例如「9 photos · 5 pages」）和分類（「Year End」）；有「Use Template」按鈕', ''],
  'TC-022': ['3 頁以上版型的 Template Preview', '在預覽上左右滑動', '每滑一次換一頁，頁面指示點跟著移動；顯示的是版型的預設配置與範例照片', ''],
  'TC-023': ['已開啟 Template Preview', '點「‹」', '回到版型頁，仍停在原本選取的分類', ''],
  'TC-024': ['免費版型的 Template Preview', '點「Use Template」', '開啟 Canvas，帶入該版型的頁面與配置；空的 frame 顯示「+」', ''],
  'TC-025': [`${FREE}；PRO 版型的 Template Preview`, '查看預覽，再點「Use Template」', '預覽右上角有「PRO」圖示；點 Use Template 會開啟 Canvas，不會跳出 IAP 頁', ''],
  'TC-026': [CANVAS, '查看 Canvas', '上方：「‹」、↶／↷、「Export」；下方工具列：「Background」、「Layers」、「+」、「Ratio」、「Pages」', ''],
  'TC-027': [CANVAS, '雙指縮放畫面，再左右捲動瀏覽各頁', '畫面可以自由縮放，並可左右捲動瀏覽畫布的所有頁面', ''],
  'TC-028': [CANVAS, '查看每一頁版面上的每個空位', '每個空位都是帶有「+」（新增照片）的 frame', ''],
  'TC-029': [`${FILLED}；版型中有文字元件（「a year in pictures」）`, '點選文字元件，修改內容、顏色與字型', '畫布上的文字顯示新的內容、顏色與字型', ''],
  'TC-030': [FILLED, '在 frame 內拖曳照片，調整位置（照片選取狀態）', '照片在 frame 內移動，放開後停在新的位置', ''],
  'TC-031': [FILLED, '各做一次：移動照片、翻轉 frame、更換背景、加入貼圖；接著點 ↶ 四次、再點 ↷ 四次', '每點一次 ↶ 依相反順序復原上一個動作；每點一次 ↷ 重做一個動作', ''],
  'TC-032': [`${CANVAS}，至少做過一次編輯`, '點「‹」', '跳出「Discard changes?」對話框，有「Discard」和「Keep」（與 Edit Room 相同）', ''],
  'TC-033': [`${CANVAS}，至少做過一次編輯；已跳出「Discard changes?」對話框`, '點「Keep」', '對話框關閉；Canvas 保留所有編輯', ''],
  'TC-034': [`${CANVAS}，至少做過一次編輯；已跳出「Discard changes?」對話框`, '點「Discard」', '回到 Template Preview；再點一次 Use Template，得到的是未編輯過的版型', ''],
  'TC-035': [`${CANVAS}，尚未做任何編輯`, '點「‹」', '跳出「Discard changes?」對話框（規格寫的是在 Canvas 按 ‹ 一律先詢問）', '請在實機確認：規格沒寫未編輯的畫布是否會略過對話框（Q-17）。'],
  'TC-036': [`${FILLED}，已做過數次編輯`, '強制停止 PhotoDirector（adb `am force-stop`），重新啟動後進入 Collage 房間 › Swipe Collage', '跳出「Continue editing?」對話框（文案與按鈕與 Edit Room 相同）', '規格沒寫對話框出現的時機（啟動 App 時或進入房間時）；請記錄（Q-16）。'],
  'TC-037': ['編輯中被強制停止後，已跳出「Continue editing?」對話框', '選擇繼續編輯', 'Canvas 重新開啟，保留該專案最後的編輯（頁面、照片、背景）', ''],
  'TC-038': ['編輯中被強制停止後，已跳出「Continue editing?」對話框', '選擇不繼續（Edit Room 的關閉按鈕）', '對話框關閉，不會還原任何專案；下次進入時也不會再出現', ''],
  'TC-039': ['正在編輯 Swipe Collage 專案，之後又開始一個 Edit Room 的照片編輯；接著強制停止 App', '重新啟動 PhotoDirector', '只提供還原最後一筆（最新的）編輯，不會兩筆都提供', ''],
  'TC-040': [`${CANVAS}，有 3 個空 frame`, '點空 frame 中的「+」', '開啟照片挑選器（與 Collage 的挑選器相同），標題為「Select up to 3 photos」', ''],
  'TC-041': ['從有 3 個空 frame 的畫布開啟照片挑選器', '選 2 張照片', '照片上顯示選取序號 1 和 2；按鈕顯示「Done (2)」', ''],
  'TC-042': ['從有 3 個空 frame 的畫布開啟照片挑選器', '嘗試選第 4 張照片', '最多只能選 3 張（上限＝空 frame 數）', ''],
  'TC-043': ['從有 3 個空 frame 的畫布開啟照片挑選器，已選 2 張', '點「Done (2)」', '回到 Canvas；2 張照片依序填入空 frame（依選取順序，由左到右、由上到下）；剩下一個 frame 仍顯示「+」', ''],
  'TC-044': [`${CANVAS}，有數個空 frame`, '點「+」，選 1 張照片，點「Done (1)」', '照片填入一個空 frame', ''],
  'TC-045': [`${CANVAS}，共 10 頁，空 frame 超過 20 個（必要時用 + › Frame 新增 frame）`, '點空 frame 的「+」，一直選照片直到挑選器不能再選', '挑選器標題顯示最多 20 張，可以選到 20 張；Android 不受預設 6 張的限制', ''],
  'TC-046': [`${CANVAS}，有 7 到 20 個空 frame`, '點「+」並選 7 張照片', '可以選 7 張（超過 Android 預設的 6 張），按 Done 後填入 7 個 frame', ''],
  'TC-047': ['從 frame 的「+」開啟照片挑選器', '點挑選器的「‹」', '回到 Canvas，沒有加入任何照片', ''],
  'TC-048': [FILLED, '點選一個已放照片的 frame', 'frame 被選取（「Frame selected」）；frame 上浮出 Delete／Duplicate／Lock 圖示；下方工具列顯示「Opacity」「Shadow」「Flip H」「Flip V」「Duplicate」「Lock」「Delete」', ''],
  'TC-049': [`${FILLED}；frame 為選取狀態`, '再點一次 frame，然後再點一次', '第二次點選切換成照片選取（「Image selected」，照片工具列）；第三次點選回到 frame 選取', ''],
  'TC-050': [`${FILLED}；frame 為選取狀態`, '用雙指縮放或拖曳角落來縮放 frame', 'frame 改變大小，照片仍在 frame 內', ''],
  'TC-051': [`${FILLED}；frame 為選取狀態`, '點浮動的 Delete 圖示', '整個 frame（連同照片）從畫布上移除', ''],
  'TC-052': [`${FILLED}；frame 為選取狀態`, '點 frame 工具列的「Delete」', '整個 frame 從畫布上移除', ''],
  'TC-053': [`${FILLED}；frame 為選取狀態`, '點浮動的 Duplicate 圖示，再點工具列的「Duplicate」', '每點一次就在畫布上多一個相同的 frame（樣式與照片都相同）', ''],
  'TC-054': [`${FILLED}；frame 為選取狀態`, '點「Flip H」，再點「Flip V」', 'frame 立即水平翻轉，接著立即垂直翻轉', ''],
  'TC-055': [`${FILLED}；frame 為選取狀態`, '點「Opacity」並調整控制項；點「Shadow」並調整控制項', '畫布上 frame 的透明度與陰影跟著改變（依 TBD-1 建議：沿用 Collage 房間的 Opacity／Shadow 滑桿）', 'TBD-1 待 PM 回覆（Q-2）。'],
  'TC-056': [`${FILLED}；照片為選取狀態`, '查看下方工具列並左右捲動', '只有一條可左右捲動的工具列：「Replace」「Flip H」「Flip V」「Adjust」「Filter」「Removal」「Enhance」「Lock」「Delete」；Removal 和 Enhance 有「PRO」標籤', ''],
  'TC-057': [`${FILLED}；照片為選取狀態`, '點「Replace」並選另一張照片', '開啟照片挑選器；選的照片取代該 frame 中的照片', ''],
  'TC-058': [`${FILLED}；照片為選取狀態`, '點「Flip H」，再點「Flip V」', '照片在 frame 內立即水平翻轉，接著立即垂直翻轉', ''],
  'TC-059': [`${FILLED}；照片為選取狀態`, '點「Adjust」調整一個數值並套用；點「Filter」選一個濾鏡並套用', 'Adjust 和 Filter 開啟的面板與 Collage 房間相同，變更只套用在這張照片', ''],
  'TC-060': [`${FILLED}；照片為選取狀態`, '點「Delete」', '照片被移除；frame 保留下來變成空的，顯示「+」新增照片圖示', ''],
  'TC-061': [`${FREE}；${FILLED}；照片為選取狀態`, '點「Removal」，移除一個物件，點 ✓（套用）', '開啟 Object Removal 房間；套用時跳出既有的 IAP 頁（「PhotoDirector Premium」、「Continue」、✕），尚未套用任何變更', ''],
  'TC-062': [`${FREE}；${FILLED}；照片為選取狀態`, '點「Enhance」，執行強化，點 ✓（套用）', '開啟 AI Enhance 房間；套用時跳出既有的 IAP 頁', ''],
  'TC-063': [`${FREE}；套用 Removal 時跳出的 IAP 頁`, '點 IAP 頁的 ✕', 'IAP 頁關閉（與既有 IAP 頁的行為相同）；Canvas 上的照片沒有改變', ''],
  'TC-064': [`${PREM}；${FILLED}；照片為選取狀態`, '點「Removal」，移除一個物件，點 ✓', '不會跳出 IAP 頁；回到 Canvas，結果取代該 frame 的照片', ''],
  'TC-065': [`${PREM}；${FILLED}；照片為選取狀態`, '點「Enhance」，執行強化，點 ✓', '不會跳出 IAP 頁；回到 Canvas，強化後的照片取代該 frame 的照片', ''],
  'TC-066': [`${PREM}；Canvas 上剛套用 Removal 結果`, '點 ↶，再點 ↷', '↶ 恢復原本的照片；↷ 再換回 Removal 的結果', ''],
  'TC-067': [`${PREM}；先記下手機相簿中「PhotoDirector」相簿最新的一張`, '在 Canvas 上套用一次 Removal 和一次 Enhance，再開啟相簿', 'Removal 和 Enhance 都沒有另外存新圖片到相簿', ''],
  'TC-068': [`${PREM}；${FILLED}；照片為選取狀態`, '點「Removal」，做一些變更後點 ✕；再用「Enhance」做一次', '每次都回到 Canvas，照片沒有改變', ''],
  'TC-069': [`${FILLED}，有兩個單圖 frame`, '長按一張照片，拖到另一個 frame 上放開', '拖曳時顯示「Long press & drag to swap」；放開後兩張照片互換 frame', ''],
  'TC-070': [`${MULTI}，所有格子都有照片`, '長按其中一格的照片，拖到同一個 frame 的另一格放開', '兩張照片互換格子', ''],
  'TC-071': [`${MULTI}；另有一個已放照片的單圖 frame`, '長按多圖 frame 中的一張照片，拖到單圖 frame 上', '兩張照片在兩個 frame 之間互換', ''],
  'TC-072': [`${CANVAS}，共 3 頁；有一個元件跨在第 1、2 頁交界、中心點在第 1 頁，其他元件完全在第 2 頁`, '開啟「Pages」，按住 ≡ 把第 1 頁拖到第 2 頁後面，點 ✓', '每個元件跟著它中心點所在的頁面移動；跨頁元件跟著第 1 頁移動，移動後仍然跨在頁面交界上', ''],
  'TC-073': [`${FILLED}；單圖 frame 為選取狀態`, '從 frame 工具列開啟切換樣式', '開啟「Frame」面板，縮圖為正方形，每個都標示可放幾張照片（「1 photo」、「3 photos」…）；把 frame 拖到另一個 frame 上不會改變樣式', '切換樣式的入口是 TBD-2（建議在工具列第一顆加「Frame」，但 mock 的工具列是從 Opacity 開始）（Q-3）。'],
  'TC-074': ['從已放照片的單圖 frame 開啟 Frame 面板', '點選一個「3 photos」的 frame', 'frame 變成 3 格；原本的照片放在第一格（由左到右、由上到下），其他格顯示「+」', ''],
  'TC-075': [`${MULTI}，3 格都有照片（由左到右為 A、B、C）`, '把 frame 切換成「1 photo」樣式', '只保留 A（第一張）；B 和 C 被移除', ''],
  'TC-076': [`${CANVAS}，有一個 4 格 frame，依序放 A、B、C、D（由左到右、由上到下）`, '把 frame 切換成 2 格樣式', '依序保留 A 和 B；C 和 D 被移除', ''],
  'TC-077': ['3 格 frame 已切換成單圖樣式（B、C 已被移除）', '再切換回 3 格樣式', '只有 A 回來；其他格顯示「+」（B、C 不會復原）', ''],
  'TC-078': ['3 格 frame 已切換成單圖樣式（B、C 已被移除）', '點 ↶', '3 格 frame 連同 A、B、C 都回來；再點 ↷ 又會移除', ''],
  'TC-079': [`${FILLED}；frame 為選取狀態`, '點浮動的 Lock 圖示', 'frame 顯示「Frame locked」；浮動圖示變成 Delete／Duplicate／Unlock', ''],
  'TC-080': ['已鎖定的 frame', '嘗試拖曳、旋轉和縮放 frame', 'frame 不會移動、旋轉或縮放', ''],
  'TC-081': ['已鎖定的 frame 為選取狀態', '逐一點工具列的每個項目（「Opacity」「Shadow」「Flip H」「Flip V」「Duplicate」「Unlock」「Delete」）', '工具列仍會顯示；只有 Duplicate、Unlock、Delete 有反應，其他都是停用狀態', ''],
  'TC-082': ['已鎖定的 frame 為選取狀態', '點浮動的 Duplicate，再點浮動的 Delete', 'Duplicate 會新增一個副本；Delete 會移除 frame（與未鎖定時相同）', ''],
  'TC-083': ['共 3 頁，第 3 頁有一個已鎖定的 frame', '開啟「Pages」，點第 3 頁的 ••• › 「Delete page」，點 ✓', '第 3 頁連同上面已鎖定的 frame 一起被刪除', ''],
  'TC-084': ['最後一頁有一個已鎖定的 frame', '開啟「Pages」，點下方的「−」，點 ✓', '最後一頁連同上面已鎖定的 frame 一起被移除', ''],
  'TC-085': [`${FILLED}；照片為選取狀態`, '點照片工具列的「Lock」', '照片顯示「Image locked」；浮動圖示為 Delete／Duplicate／Unlock', ''],
  'TC-086': ['已鎖定的照片', '嘗試在 frame 內拖曳和雙指縮放照片；長按照片嘗試交換', '照片不會移動或縮放', ''],
  'TC-087': ['已鎖定的照片為選取狀態', '逐一點照片工具列的每個項目', '只顯示一條工具列；只有「Unlock」和「Delete」有反應，其他都是停用狀態', ''],
  'TC-088': ['已鎖定的照片為選取狀態', '點浮動的 Duplicate，再點浮動的 Delete', 'Duplicate 會新增一個副本；Delete 會清空 frame（顯示「+」）', ''],
  'TC-089': ['一個已鎖定的 frame 和一張已鎖定的照片', '分別點「Unlock」（浮動圖示和工具列）', '兩者都回到一般選取狀態；拖曳、縮放與所有工具都恢復可用', ''],
  'TC-090': [CANVAS, '點「Background」', '開啟「Background」面板，有「Solid」和「Texture」兩個分頁和 ✕；Solid 顯示 32 個色票（8 × 4）和「Custom color」；沒有漸層', ''],
  'TC-091': ['Background 面板，Solid 分頁', '點選幾個色票', '每個色票都立即套用為畫布背景，每一頁都會套用', ''],
  'TC-092': ['Background 面板', '點「Texture」，再點一個材質', '材質套用為背景，在每一頁無縫重複（頁面交界沒有接縫）', ''],
  'TC-093': [`${FREE}；Background 面板，Texture 分頁`, '尋找 PRO 和 NEW 標籤；套用一個 PRO 材質', 'PRO 材質有「PRO」標籤，可以直接套用，不會跳出 IAP 頁', ''],
  'TC-094': ['Background 面板，Solid 分頁', '點「Custom color」', '開啟調色盤，有飽和度／明度方塊、色相條和滴管，以及「Cancel」和「Done」（與 Text color picker 相同）', ''],
  'TC-095': ['已開啟 Custom color 調色盤；畫布上有照片', '點滴管，再點照片上的某一點', '調色盤取到該點的顏色', ''],
  'TC-096': ['已開啟 Custom color 調色盤，已選新顏色', '點「Cancel」', '調色盤關閉；背景維持原本的顏色', ''],
  'TC-097': ['已開啟 Custom color 調色盤，已選新顏色', '點「Done」', '選的顏色成為背景色', ''],
  'TC-098': ['已開啟 Background 面板，已套用一個色票', '點 ✕', '面板關閉，套用的背景保留（依 TBD-4 建議：與 Edit Room 面板相同）', 'TBD-4 待 PM 回覆（Q-5）。'],
  'TC-099': [CANVAS, '點下方的「+」', '開啟「Add Layer」面板，有「Image」「Text」「Sticker」「Frame」（NEW 標籤）「Text Bubble」和 ✕；沒有影片、檔案、格線、形狀或繪圖選項', ''],
  'TC-100': ['已開啟 Add Layer 面板', '點「Image」，選一張照片並完成', '開啟 Collage 的照片挑選器；完成後回到 Canvas，照片以新的單圖 frame 加入（依 TBD-5 建議）', 'TBD-5 待 PM 回覆（Q-6）。'],
  'TC-101': ['已開啟 Add Layer 面板', '點「Text」，輸入「Hello 2026」，點「Done」', '開啟 Collage 的文字輸入並跳出鍵盤；點 Done 後鍵盤收起，文字出現在 Canvas 上', ''],
  'TC-102': ['從 Add Layer 開啟文字輸入，已輸入文字', '點「Cancel」', '鍵盤收起，沒有加入文字', ''],
  'TC-103': ['已開啟 Add Layer 面板', '點「Sticker」，在「Search by keywords」搜尋關鍵字，收起鍵盤，點一個貼圖', '開啟 Edit Room 的貼圖面板（Favorites／Trending／…）；貼圖加入 Canvas', ''],
  'TC-104': ['已開啟 Add Layer 面板', '點「Frame」，再點一個縮圖', '開啟新的 Frame 面板，縮圖為正方形；點選的 frame 加入 Canvas，格子是空的「+」', ''],
  'TC-105': [`${FREE}；從 Add Layer 開啟 Frame 面板`, '尋找 NEW 和 PRO 標籤；加入一個 PRO frame', 'CMS 標記的縮圖顯示 NEW 和 PRO 標籤；PRO frame 可以直接加入，不會跳出 IAP 頁', ''],
  'TC-106': ['已開啟 Add Layer 面板', '點「Text Bubble」，選一個文字泡泡', '開啟 Edit Room 的 Text Bubble 面板；文字泡泡加入 Canvas', ''],
  'TC-107': ['已開啟 Add Layer 面板', '點 ✕', '面板關閉，沒有加入任何東西', ''],
  'TC-108': [`${FILLED}，另有文字和貼圖`, '點「Layers」', '開啟「Layers」清單，有 ✕；每個圖層的縮圖放在透明格紋底上，左側是 ⋯、右側是 ≡', ''],
  'TC-109': ['已開啟 Layers 清單', '點某個圖層的 ⋯', '跳出選單：「Delete」「Duplicate」「Lock」，每項都有圖示', ''],
  'TC-110': ['已開啟 Layers 清單', '對某個圖層使用 ⋯ › 「Duplicate」，再使用 ⋯ › 「Delete」', 'Duplicate 新增該元件的副本；Delete 把它從清單和畫布上移除', ''],
  'TC-111': ['已開啟 Layers 清單', '對一個 frame 圖層使用 ⋯ › 「Lock」，再開一次它的 ⋯', '該元件在畫布上變成鎖定（鎖定後的行為）；選單現在顯示「Unlock」', ''],
  'TC-112': ['Layers 清單有 3 個以上圖層', '按住某個圖層的 ≡，拖到另一個位置', '依 TBD-3 建議，圖層順序改變（畫布上的前後關係跟著改變）', 'TBD-3 待 PM 回覆（Q-4）。'],
  'TC-113': ['做過變更後的 Layers 清單', '點 ✕', '清單關閉；變更保留（依 TBD-4 建議）', 'TBD-4（Q-5）。'],
  'TC-114': [CANVAS, '點「Ratio」', '開啟「Ratio」面板，有 ✕ 和「1:1」「4:5」「5:4」「3:4」「4:3」「9:16」「16:9」，每個都有裁切樣式的圖示和數字；沒有 AI Expand 導流', ''],
  'TC-115': [`${FILLED}；已開啟 Ratio 面板`, '依序點每個比例：1:1、4:5、5:4、3:4、4:3、9:16、16:9', '每一頁都套用該比例；頁面寬度（短邊）不變，只有長邊改變；元件留在原位，畫布往下長或往上縮', ''],
  'TC-116': ['套用 9:16 比例後匯出', '查看匯出圖片的寬與高', '寬：高為 9：16（短邊依 R-100／Q-8）', ''],
  'TC-117': ['已開啟 Ratio 面板，已套用一個比例', '點 ✕', '面板關閉，比例保留（依 TBD-4 建議）', 'TBD-4（Q-5）。'],
  'TC-118': [`${FILLED}，共 3 頁，目前在第 2 頁`, '點「Pages」', '開啟 Pages：各頁縮圖連在一起，頁與頁之間只有細線；選取第 2 頁，小字顯示「Page 2 / 3」；有 ✕、✓ 和下方的「−」「+」', ''],
  'TC-119': ['已開啟 Pages', '點第 3 頁的縮圖；再嘗試點選或拖曳縮圖中的元件', '選取第 3 頁（「Page 3 / 3」）；在這個畫面無法編輯元件', ''],
  'TC-120': ['已開啟 Pages，共 3 頁', '點一下頁面下方的 ≡（不按住）', '沒有任何反應', ''],
  'TC-121': ['已開啟 Pages，共 3 頁', '按住第 1 頁下方的 ≡，拖到第 3 頁後面再放開', '拖曳時縮圖放大並變半透明，顯示「Hold ≡ & drag to reorder」，其他頁面讓出位置；放開後第 1 頁移到最後', ''],
  'TC-122': ['已開啟 Pages，共 3 頁', '點第 2 頁下方的 ••• › 「Duplicate page」', '第 2 頁的副本插在第 2 頁後面（共 4 頁）', ''],
  'TC-123': ['已開啟 Pages，共 3 頁', '點第 2 頁下方的 ••• › 「Delete page」', '第 2 頁和上面所有東西立即被刪除，沒有確認視窗', ''],
  'TC-124': ['已開啟 Pages，共 3 頁，選取第 1 頁', '點縮圖列最後的「+」', '在最後面新增一頁，縮圖列捲到新頁（共 4 頁）', ''],
  'TC-125': ['已開啟 Pages，共 3 頁', '點下方的「+」，再點下方的「−」', '「+」在最後新增一頁並捲到該頁；「−」移除最後一頁', ''],
  'TC-126': ['已開啟 Pages，共 9 頁', '點一次「+」；再嘗試縮圖列的「+」、下方的「+」和 ••• › 「Duplicate page」', '新增第 10 頁（「Page n / 10」）；之後縮圖列 +、下方 + 和 Duplicate page 都無法使用', ''],
  'TC-127': ['已開啟 Pages，共 2 頁', '點下方的「−」；再嘗試「−」和 ••• › 「Delete page」', '剩 1 頁（「Page 1 / 1」）；之後 − 和 Delete page 都無法使用', ''],
  'TC-128': ['已開啟 Pages', '尋找復原／重做', 'Pages 沒有 ↶／↷', ''],
  'TC-129': ['已開啟 Pages，已調整頁面順序並選取第 3 頁', '點 ✓', '回到 Canvas，套用新的頁面順序，並停在選取的那一頁', ''],
  'TC-130': ['已開啟 Pages，沒有做任何變更', '點 ✕', '回到 Canvas，不會跳出對話框', ''],
  'TC-131': ['已開啟 Pages，已新增一頁並調整順序', '點 ✕', '跳出「Discard changes?」對話框，有「Discard」和「Keep」', ''],
  'TC-132': ['做過變更後，Pages 已跳出「Discard changes?」對話框', '點「Keep」', '對話框關閉；Pages 仍保留變更', ''],
  'TC-133': ['做過變更後，Pages 已跳出「Discard changes?」對話框', '點「Discard」', '回到 Canvas；這次在 Pages 所做的變更全部放棄', ''],
  'TC-134': ['調整頁面順序後已按 ✓ 套用', '在 Canvas 上點 ↶', '記錄 ↶ 是否會還原頁面變更', '規格沒寫 Canvas 的復原是否包含 Pages 的套用（Q-13）。'],
  'TC-135': ['有一個元件跨在第 2、3 頁交界', '開啟 Pages，刪除第 3 頁，點 ✓', '依 TBD-6 建議，整個元件被刪除', 'TBD-6 待 PM 回覆（Q-7）。'],
  'TC-136': [`${PREM}；${FILLED}，共 5 頁，只用免費內容`, '點「Export」', '開啟「Save & Share」頁，顯示「5 images」（每頁一張）', ''],
  'TC-137': ['剛匯出 5 頁的畫布', '開啟手機相簿 › 「PhotoDirector」相簿', '新增 5 張圖片，每頁一張、依頁面順序，一次全部存好', ''],
  'TC-138': ['剛匯出 5 頁的畫布', '逐張以原尺寸開啟匯出的圖片', '每張圖片都沒有浮水印', ''],
  'TC-139': ['設定 › Image Quality 先設為最低，再設為最高', '每種設定各匯出一次同一個畫布，查看圖片像素尺寸', '每張圖片的長邊都依 Image Quality 設定', 'TBD-7 建議改依畫布尺寸（短邊 1200 px）（Q-8）。'],
  'TC-140': ['剛匯出完成', '開啟 My AI Artwork', '匯出的拼貼不會出現在 My AI Artwork', ''],
  'TC-141': ['Save & Share 頁；手機已安裝 Instagram', '點「Instagram」', '若 Instagram 能一次接收多張，開啟 Instagram 並帶入所有匯出的圖片；不行的話只開啟 Instagram', ''],
  'TC-142': ['Save & Share 頁；手機已安裝 Facebook', '點「Facebook」', '若 Facebook 能一次接收多張，開啟 Facebook 並帶入所有匯出的圖片；不行的話只開啟 Facebook', ''],
  'TC-143': ['Save & Share 頁', '點「More」', '開啟 Android 分享選單，帶入所有匯出的圖片', ''],
  'TC-144': ['Save & Share 頁', '點「‹」', '回到 Canvas，所有編輯都保留', ''],
  'TC-145': [`${FREE}；免費匯出次數從零開始（重新安裝或新帳號）；畫布只用免費內容`, '匯出後回到 Canvas，共做三次', '前兩次匯出直接存檔，不會跳出 IAP 頁；第 3 次存檔時跳出 IAP 頁（「PhotoDirector Premium」）', '規格沒寫清楚 IAP 是在第 3 次存檔時還是存檔後跳出（Q-15）。'],
  'TC-146': [`${FREE}；匯出次數從零開始；準備一個 10 頁和一個 1 頁的畫布`, '10 頁的畫布匯出兩次，再匯出 1 頁的畫布一次', 'IAP 頁在第 3 次匯出時才出現，不會提早：計算的是匯出次數，不是張數', ''],
  'TC-147': [PREM, '匯出只用免費內容的畫布 4 次', '每次匯出都不會跳出 IAP 頁', ''],
  'TC-148': ['任何帳號，剛匯出完成', '在 Save & Share 頁停留一下，再回到 Canvas', '不會跳出評分對話框', ''],
  'TC-149': [`${FREE}；使用 PRO 版型的畫布`, '點「Export」', '存檔前先跳出 IAP 頁，顯示「Paid style applied」', ''],
  'TC-150': [`${FREE}；免費版型上加了 PRO frame`, '點「Export」', '存檔前先跳出 IAP 頁，顯示「Paid style applied」', ''],
  'TC-151': [`${FREE}；免費版型使用 PRO 材質背景`, '點「Export」', '存檔前先跳出 IAP 頁，顯示「Paid style applied」', ''],
  'TC-152': [`${FREE}；匯出時因 PRO 內容跳出的 IAP 頁`, '點 ✕', 'IAP 頁關閉（與既有 IAP 頁相同）；沒有存任何圖片；Canvas 保留所有編輯', '規格只寫「同既有」；請記錄 ✕ 之後回到哪裡。'],
  'TC-153': [`${PREM}；使用 PRO 版型、加了 PRO frame 與 PRO 材質的畫布`, '點「Export」', '不會跳出 IAP 頁；圖片直接存檔', ''],
  'TC-154': [`${FREE}；免費版型、只用免費內容；匯出次數為 0`, '點「Export」', '不會跳出「Paid style applied」IAP 頁：Removal／Enhance 是在各自房間擋，不在這裡擋；圖片直接存檔', ''],
  'TC-155': ['任何帳號；先記下點數餘額（若帳號有顯示）', '走完整個流程：版型 → 照片 → Removal（Premium）→ 匯出', '每一步都不扣點數；IAP 頁只提供既有方案（沒有新的 SKU）', ''],
  'TC-156': ['已開啟版型頁', '按系統返回鍵', '與「‹」相同：回到 Collage 房間', ''],
  'TC-157': ['已開啟 Template Preview', '按系統返回鍵', '與「‹」相同：回到版型頁', ''],
  'TC-158': [`${CANVAS}，已做過編輯`, '按系統返回鍵', '與「‹」相同：跳出「Discard changes?」對話框', ''],
  'TC-159': ['Canvas 已跳出「Discard changes?」對話框', '按系統返回鍵', '對話框關閉，Canvas 保留所有編輯（與 Keep 相同）', '規格沒寫（Q-14）：請記錄。'],
  'TC-160': ['Canvas 上有 frame 或照片為選取狀態', '按系統返回鍵', '記錄：是取消選取，還是跳出 Discard 對話框', '規格沒寫（Q-14）。'],
  'TC-161': ['從 frame 的「+」開啟照片挑選器，已選 1 張', '按系統返回鍵', '回到 Canvas，沒有加入照片（與挑選器的「‹」相同）', ''],
  'TC-162': ['已開啟 Background 面板（Add Layer、Layers、Ratio、Frame 面板也要做）', '在每個面板上按系統返回鍵', '面板像按 ✕ 一樣關閉；已套用的變更保留', 'TBD-4（Q-5）。'],
  'TC-163': ['已開啟 Custom color 調色盤，已選一個顏色', '按系統返回鍵', '調色盤像按「Cancel」一樣關閉（不套用顏色）', '規格沒寫（Q-14）。'],
  'TC-164': ['從 Add Layer 開啟文字輸入，鍵盤已跳出', '按兩次系統返回鍵', '第一次收起鍵盤；第二次像按「Cancel」一樣關閉文字輸入', ''],
  'TC-165': ['已開啟 Pages，有做變更', '按系統返回鍵', '與 ✕ 相同：跳出「Discard changes?」對話框', ''],
  'TC-166': ['已開啟 Pages，沒有變更', '按系統返回鍵', '與 ✕ 相同：回到 Canvas，不會跳出對話框', ''],
  'TC-167': ['從照片選取狀態開啟 Object Removal 房間', '按系統返回鍵', '與 ✕ 相同：回到 Canvas，沒有套用任何變更', ''],
  'TC-168': [`${FREE}；已跳出 IAP 頁（任何觸發方式）`, '按系統返回鍵', '與 IAP 頁的 ✕ 相同', ''],
  'TC-169': ['Save & Share 頁', '按系統返回鍵', '與「‹」相同：回到 Canvas，編輯保留', ''],
};

const rows = readTable(join(HERE, 'draft.csv'));
const missing = rows.filter(r => !ZH[r.ID]).map(r => r.ID);
const extra = Object.keys(ZH).filter(id => !rows.some(r => r.ID === id));
if (missing.length || extra.length) throw new Error(`translation out of step with draft.csv: missing ${missing.join(', ')}; extra ${extra.join(', ')}`);

const HEAD = ['編號', '區塊', '前置條件', '操作步驟', '預期結果', '優先度', '規格對應', '備註', '變更', '變更原因'];
const CHANGE: Record<string, string> = { new: '新增', modified: '修改', removed: '移除', unchanged: '未變更' };
const ZH_REASON: Record<string, string> = {
  'New table (REQ-001)': '新表（REQ-001）',
  'REQ-004: East is tested in Traditional Chinese and Japanese, West in English and German': 'REQ-004：東方用繁體中文和日文測試，西方用英文和德文測試',
};
const out = rows.map(r => {
  const [pre, action, expected, notes = ''] = ZH[r.ID];
  return [r.ID, SECTION[r.Section] ?? r.Section, pre, action, expected, r.Priority, r['Spec Ref'], notes,
    CHANGE[r.Change] ?? r.Change, ZH_REASON[r['Change Reason']] ?? r['Change Reason']];
});
if (DRAFT_COLUMNS.length !== HEAD.length) throw new Error('column count changed');
writeFileSync(join(HERE, 'draft.zh-Hant.csv'), toCsv([HEAD, ...out]));

const wb = new ExcelJS.Workbook();
const ws = wb.addWorksheet('測試案例');
ws.columns = [10, 14, 40, 40, 50, 8, 16, 36, 8, 16].map((width, i) => ({ header: HEAD[i], width }));
ws.addRows(out);
ws.getRow(1).font = { bold: true };
ws.views = [{ state: 'frozen', ySplit: 1 }];
ws.eachRow(row => row.eachCell(c => { c.alignment = { wrapText: true, vertical: 'top' }; }));
await wb.xlsx.writeFile(join(HERE, 'draft.zh-Hant.xlsx'));
console.log(`${out.length} rows → draft.zh-Hant.csv, draft.zh-Hant.xlsx`);
