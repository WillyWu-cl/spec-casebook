// Traditional Chinese (Taiwan wording) reading copy of draft.csv (user, 2026-11-03, REQ-002). The English draft.csv stays
// the source of truth (AGENTS.md: table rows are written in English); this copy is for reading only and is rebuilt from
// it. UI strings in 「」 stay as the app's English UI shows them. Columns ID, Priority, Spec Ref, Change are copied.
// Writes draft.zh-Hant.csv (UTF-8 with BOM, opens in Excel) and draft.zh-Hant.xlsx.
// Re-runnable: node library/phd/creative-reel/android/drafts/20261102-175916/build-zh.ts
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import ExcelJS from 'exceljs';
import { DRAFT_COLUMNS, readTable } from '../../../../../../scripts/lib/library.ts';
import { toCsv } from '../../../../../../scripts/lib/csv.ts';

const HERE = dirname(fileURLToPath(import.meta.url));
const FREE = '以 Free（非 Premium）帳號登入';
const PREM = '以 PhotoDirector Premium（訂閱）帳號登入';
const ROOM = '已開啟 Reel Creator 房間';
const TOP5 = 'Creative 版型「Top 5 of My Year」的預覽頁（Year-End Recap，5–15 張）';
const PICK = '「Top 5 of My Year」的選圖頁（由「Use Template」進入），尚未選圖';
const CONF = '已選 7 張照片進入「Top 5 of My Year」的確認生成頁';
const NEWSESSION = '已重新啟動 App（強制停止後再開啟），開始新的 session';
const DEEP = '需要：RD 提供 deeplink 網址（Q-15）。';

const SECTION: Record<string, string> = {
  'Room': '房間', 'Entry from Edit Room': '從 Edit Room 進入', 'Deeplink': 'Deeplink', 'Preview': '預覽頁',
  'View photo tips': '照片建議', 'Photo picker': '選圖頁', 'Picker memory': '選圖記憶', 'Confirm page': '確認生成頁',
  'Text language': '文字語言', 'Generation and My AI Artwork': '生成與 My AI Artwork', 'Cinematic Styles': 'Cinematic Styles',
  'AI Transition': 'AI Transition', 'Android Back': 'Android 返回鍵',
};

// [Precondition, Action, Expected Result, Notes] in draft.csv order
const ZH: Record<string, [string, string, string, string?]> = {
  // 房間
  'TC-001': ['剛啟動受測版本', '開啟 Effects 選單，查看房間按鈕名稱', '按鈕名稱為「Reel Creator」（不再是「Cinematic Reel Creator」）'],
  'TC-002': ['在 Launcher', '查看該房間的 Launcher 捷徑名稱', '捷徑名稱為「Reel Creator」'],
  'TC-003': ['在 Launcher', '捲到該房間的 Launcher 版型列，查看標題', '版型列標題為「Reel Creator」'],
  'TC-004': ['已開啟 AI Video 頁', '查看 AI Video 頁上的房間入口名稱', '入口名稱為「Reel Creator」'],
  'TC-005': ['在 Launcher', '點「Reel Creator」Launcher 捷徑', '開啟標題為「Reel Creator」的房間；上方列有「‹」、點數膠囊（餘額與「+」）和歷史紀錄圖示'],
  'TC-006': [ROOM, '從上往下捲動房間，查看各 section 標題', '沒有 tab；單一頁面依序排列 section，包含「Cinematic Styles 🎬」、「Year-End Recap 📅」、「Christmas Time 🎄」和「Cool Transitions 🤳🏻」，三種 feature 混排', 'Section 排序尚未決定（Q-1）：請記下實際順序。'],
  'TC-007': [ROOM, '左右滑動每個 section 的卡片列', '每個 section 都能橫向捲動，顯示自己的版型卡片'],
  'TC-008': [`${ROOM}；先記下帳號的點數餘額`, '查看右上角的藍色點數按鈕，然後點它', '按鈕顯示帳號目前的點數餘額和「+」；點下去開啟 Buy Credit 頁', 'Domain K75（使用者，2026-11-03）。預覽頁和確認生成頁也有同一個按鈕。'],
  'TC-112': [ROOM, '點右上角的 History 按鈕（一張紙加時鐘的圖示）', '開啟 My AI Artwork，並選在「Reel Creator」tab', 'Domain K76（使用者，2026-11-03）。'],
  'TC-113': ['在 Launcher', '依序從各入口開啟房間：Effects 按鈕、Launcher 捷徑、Launcher 版型列、AI Video 頁、My AI Artwork「Create More」；每次開啟後點「‹」', '每個入口都開啟 Reel Creator 房間；每次「‹」都回到該入口所在的頁面', 'Domain K01：每個入口都是各自的路徑。'],
  'TC-009': [ROOM, '點「‹」', '離開房間，回到進入前的頁面'],
  // 從 Edit Room 進入
  'TC-010': ['已在 Edit Room 開啟照片並套用一項編輯', '點 Edit Room 裡的 Reel Creator 入口', '跳出對話框（同 Image to Video）詢問是否跳轉到 Reel Creator', '規格沒畫對話框文案（Q-13）：請記下。'],
  'TC-011': ['Edit Room 已跳出跳轉對話框', '選擇取消', '對話框關閉；留在 Edit Room，照片與編輯都還在'],
  'TC-012': ['Edit Room 已跳出跳轉對話框；先記下相簿的照片數', '確認跳轉', '開啟 Reel Creator 房間；照片已自動存到相簿，且套用了 Edit Room 的編輯（不是原始檔）', 'Domain K02（PHA262026-0382：曾經帶入原始照片而非編輯後的照片）。'],
  'TC-013': ['由 Edit Room 進入的 Reel Creator 房間', '開一個 Cinematic Styles 版型並點「Use Template」；Creative 版型也做一次', '兩個選圖頁都沒有預先選取 Edit Room 的照片（已選 0 張）；進入房間時沒有帶入照片', '現行 CineStory 會帶入照片；新規格不帶。Domain K02（帶入編輯後的照片）不再適用：以規格為準。'],
  // Deeplink
  'TC-014': ['PhotoDirector 已關閉；舊的 Cinematic Reel Creator deeplink（不帶參數）', '開啟 deeplink（adb `am start -a android.intent.action.VIEW -d <link>`）', '開啟 Reel Creator 房間', DEEP],
  'TC-114': ['PhotoDirector 已在其他頁面執行中（例如 Edit Room）；deeplink 的 template 帶入 Creative 的 content GUID', '開啟 deeplink', '開啟的預覽頁與冷啟動時相同；不會閃退，版型清單已載入', `${DEEP} Domain K05（冷啟動與熱啟動、資料尚未載入）。`],
  'TC-015': ['deeplink 的 template 帶入某個 Creative 版型的 content GUID', '開啟 deeplink', '直接開啟該版型的預覽頁；沒有選取任何照片', `${DEEP} Domain K04：開的是連結指定的版型，不是該分類的第一個。`],
  'TC-016': ['deeplink 的 template 帶入某個 AI Transition 版型的 content GUID', '開啟 deeplink', '直接開啟該版型的預覽頁', DEEP],
  'TC-017': ['deeplink 的 template 帶入 CineStory（Cinematic Styles）的 GUID', '開啟 deeplink', '直接開啟該 Cinematic 版型的預覽頁；沒有選取任何照片', DEEP],
  'TC-018': ['deeplink 的 template 帶入不存在的 GUID', '開啟 deeplink', '開啟 Reel Creator 房間（不出現錯誤頁）', DEEP],
  'TC-019': ['deeplink 只帶 category 參數', '開啟 deeplink', '開啟 Reel Creator 房間；category 參數被忽略', DEEP],
  'TC-020': ['由帶 template GUID 的 deeplink 開啟的預覽頁', '點「‹」', '記錄回到哪裡（預期：Reel Creator 房間）', '規格沒寫（Q-8、Q-15）。'],
  // 預覽頁
  'TC-021': ['此安裝第一次進入房間（清除 App 資料或新帳號狀態）', '開啟房間並點一個 Year-End Recap 版型', '出現引導上下滑動的手指動畫', '需要第一次進入的狀態；請在其他預覽頁案例之前執行。Domain K05：第一次進入、冷啟動和之後再進入是不同的引導狀態。'],
  'TC-022': ['滑動引導已顯示過一次', '離開房間後再進入，開一個版型', '不再顯示手指動畫'],
  'TC-023': [ROOM, '點「Top 5 of My Year」卡片', '全螢幕 9:16 demo 自動播放，播完後循環播放'],
  'TC-024': [TOP5, '查看畫面', '左上「View photo tips」；右側靜音按鈕；底部有名稱「Top 5 of My Year」、說明「Rank your year\'s best moments in one reel」、「5–15 photos」和「Use Template」；文字疊在 demo 上，底部壓暗'],
  'TC-025': [TOP5, '點靜音按鈕，再點一次', 'demo 聲音先關閉再開啟；圖示跟著切換'],
  'TC-115': [`${TOP5}；demo 已靜音`, '往上滑到下一個版型，再往下滑回來', '每個版型的 demo 都維持靜音', 'Domain K52（切換版型後靜音狀態保留）；規格沒寫。'],
  'TC-026': [TOP5, '往上滑，再往下滑', '往上滑顯示同一分類（Year-End Recap）的下一個版型，有自己的 demo、名稱與張數；往下滑回到原版型'],
  'TC-027': ['Year-End Recap 最後一個版型的預覽頁', '往上滑', '出現 Year-End Recap 的第一個版型（無限循環，不會跑到其他分類）'],
  'TC-028': ['Year-End Recap 第一個版型的預覽頁', '往下滑', '出現 Year-End Recap 的最後一個版型（無限循環）'],
  'TC-029': ['某個 Cool Transitions 版型的預覽頁', '一直往上滑，直到出現重複的版型', '只出現 Cool Transitions 的版型；清單會循環'],
  'TC-030': ['某個 Cinematic Styles 版型的預覽頁', '查看張數那一行', '張數顯示「1 photo」'],
  'TC-031': [TOP5, '點「‹」', '回到 Reel Creator 房間', '規格沒畫箭頭（Q-8）。'],
  // 照片建議
  'TC-032': ['已進入房間並開啟某個版型的預覽頁', '在預覽頁停留 10 秒不觸碰', '照片建議面板不會自己跳出'],
  'TC-033': [TOP5, '點「View photo tips」', '開啟「Photo tips」面板：「✓ Recommended」附範例圖與條列文字（含「Portrait (vertical) photos work best」）、「✕ Avoid」附範例圖與條列文字，以及「Got it」'],
  'TC-034': ['照片建議面板已開啟', '點「Got it」', '面板關閉，預覽頁停在同一個版型'],
  'TC-035': ['已在「Top 5 of My Year」看過照片建議', '滑到另一個版型，開啟它的「View photo tips」', '照片建議內容（文字和範例圖）是該版型自己的'],
  'TC-036': ['照片建議面板已開啟', '點面板上方的暗色區域，或把面板往下拖', '記錄面板是否會關閉', '規格只畫了「Got it」；請記錄。'],
  // 選圖頁
  'TC-037': [TOP5, '點「Use Template」', '直接開啟選圖頁「Add Photos」（「‹」、「Recents ▾」）；底部列顯示「Select 5–15 photos」「0/15」和「Next」'],
  'TC-038': [PICK, '選 3 張照片', '照片依選取順序標上 01、02、03；底部列「3/15」並顯示 3 張縮圖；紅字「Select at least 5 photos (2 more)」；Next 無法按'],
  'TC-039': [`${PICK}；已選 3 張`, '點「Next」', '沒有反應（低於下限時 Next 無法按）'],
  'TC-040': [PICK, '剛好選 5 張', '紅字消失；「5/15」；Next 可以按'],
  'TC-041': [PICK, '選 10 張並捲動底部列', '底部列縮圖可橫向捲動，依選取順序顯示全部 10 張'],
  'TC-042': [PICK, '選 15 張，再嘗試選第 16 張', '第 16 張選不了（或 Next 變成無法按）；最多 15/15', '規格沒畫第 16 張如何被擋（Q-11）：請記錄。'],
  'TC-043': [`${PICK}；已選 4 張（01–04）`, '再點一次 02 那張', '取消選取；變成 3/15；記錄 03／04 是否重新編號', 'Q-11。'],
  'TC-044': [PICK, '選一張橫式和一張直式照片', '兩張都能選並標上編號'],
  'TC-045': [`${PICK}；相簿有一張短邊 299 px 的照片`, '選這張照片', '照片被標示為不符合條件', '需要：測試照片。標示文案規格沒畫（Q-11）。'],
  'TC-046': [`${PICK}；相簿有剛好 300 px 和 4096 px 的照片`, '兩張都選', '兩張都能選（300–4096 px 含邊界）', '需要：測試照片。'],
  'TC-047': [`${PICK}；相簿有一張長邊 4097 px 以上的照片`, '選這張照片', '照片被標示為不符合條件', '需要：測試照片。'],
  'TC-048': [`${PICK}；相簿有一張 1200 × 1200 px、補到 11,000,000 bytes 的 JPEG（超過 10 MB 也超過 10 MiB）`, '選這張照片', '照片被標示為不符合條件（≤ 10 MB）', '需要：測試照片。10 MB 的單位未定（Q-22）；11,000,000 bytes 在兩種解讀下都超過上限。'],
  'TC-126': [`${PICK}；相簿有一張 1200 × 1200 px、補到 9,900,000 bytes 的 JPEG（低於 10 MB 也低於 10 MiB）`, '選這張照片', '照片可以選，並標上編號（沒有被標示）', '需要：測試照片。10 MB 的單位未定（Q-22）；9,900,000 bytes 在兩種解讀下都低於上限。'],
  'TC-049': [`${PICK}；相簿有一張 NSFW 測試照片`, '選這張照片', '照片被標示為不允許', '需要：NSFW 測試照片。'],
  'TC-050': [`${PICK}；相簿有一張名人照片`, '選這張照片', '照片被標示為不允許', '需要：名人測試照片。'],
  'TC-051': [PICK, '點「Recents ▾」並選擇其他相簿', '照片格顯示該相簿的照片'],
  'TC-052': [`${PICK}；已選 3 張`, '點「‹」', '回到同一個版型的預覽頁', '規格沒畫箭頭（Q-8）。'],
  'TC-053': [`${PICK}；已選 7 張`, '點「Next」', '開啟確認生成頁，帶著這 7 張照片'],
  // 選圖記憶
  'TC-054': [`${NEWSESSION}；在「Top 5 of My Year」選圖頁選了 7 張並點過「Next」，之後回到房間`, '再次開啟「Top 5 of My Year」›「Use Template」', '底部列上方出現「Use the 7 photos you picked last time?」以及「Import」和「×」；目前尚未選圖（0/15）', '「上次選的圖」指哪一組尚未確認（Q-3）。'],
  'TC-055': ['已出現帶入上次 7 張照片的提醒', '點「Import」', '7 張照片在選圖頁中被選取（7/15），編號都有勾選；停留在選圖頁（不會直接跳到確認生成頁）', 'Domain K03：照片有顯示卻沒被勾選，代表照片 id 對應出錯。'],
  'TC-056': ['已出現 Import 提醒', '點提醒上的「×」；離開選圖頁後再進入', '提醒關閉；記錄下次進入時是否再出現', 'Q-5。'],
  'TC-057': [`${NEWSESSION}；本 session 上次選了 3 張（例如在 4 張的 AI Transition 選圖頁選了 3 張後離開）`, '開啟「Top 5 of My Year」› Use Template ›「Import」', '帶入 3 張；底部列紅字「Select at least 5 photos (2 more)」；Next 無法按，直到再選 2 張', '規格畫出的流程（picker-a2）。'],
  'TC-058': [`${NEWSESSION}；上次在 Creative 版型選了 10 張`, '開啟需要 4 張的 AI Transition 版型 › Use Template ›「Import」', '帶入 10 張；底部列顯示紅字；Next 無法按，直到減到 4 張'],
  'TC-059': [`${NEWSESSION}；上次選了 6 張，之後從相簿刪掉其中 2 張`, '再次進入選圖頁並點「Import」', '只選取仍在相簿中的 4 張', '請記錄提醒中顯示的 N（Q-17）。'],
  'TC-060': [`${NEWSESSION}；上次只選了 1 張（例如 Cinematic Styles）`, '進入「Top 5 of My Year」選圖頁', '不顯示「Use the … photos you picked last time?」提醒'],
  'TC-061': ['上一個 session 選了 7 張', '強制停止並重新開啟 App，再開啟「Top 5 of My Year」選圖頁', '沒有 Import 提醒（記憶隨 session 結束）'],
  'TC-062': [`${NEWSESSION}；在 Reel Creator 選圖頁選了 7 張`, '開啟 App 中其他的選圖頁（例如 Collage），查看底部列上方', '記錄是否也出現 Import 提醒', 'Q-4。Domain K07：選取狀態外漏到其他功能，是以前出過的 bug 類型。'],
  // 確認生成頁
  'TC-063': [CONF, '查看頁面', '上方：版型縮圖、「Top 5 of My Year」、「5–15 photos · output 9:16」、「‹」和點數膠囊；「Your photos」「7/15」與「Long-press to reorder · tap × to remove」；7 張有編號和「×」的照片與一個「+」方塊；「Text language」「English ▾」；「Generate | 60」'],
  'TC-064': [CONF, '長按第 3 張並拖到第 1 個位置', '照片移到第 1 個位置，編號依新順序更新'],
  'TC-065': [CONF, '點第 7 張的「×」', '照片被移除；變成 6/15'],
  'TC-066': [CONF, '移除照片直到剩 4 張', '「4/15」變紅字；「Generate」無法按'],
  'TC-067': [`${CONF}；移除後剩 4 張`, '點無法按的「Generate」', '出現 toast「Please upload at least 5 photos」；沒有開始生成，也沒有扣點'],
  'TC-068': [`${CONF}；移除後剩 4 張`, '點「+」方塊', '開啟選圖頁，目前的 4 張保持選取並有勾選（4/15）', 'Domain K03。'],
  'TC-069': ['從確認生成頁的「+」開啟的選圖頁，已選 4 張', '再選 2 張並點「Next」', '確認生成頁顯示 6 張（原本的 4 張加上新的 2 張）'],
  'TC-070': ['確認生成頁有 15/15 張照片', '尋找「+」方塊', '記錄達到上限時是否仍顯示「+」', 'Q-16。'],
  'TC-071': [CONF, '點「‹」', '回到選圖頁（記錄 7 張是否仍保持選取）', '規格沒畫箭頭（Q-8）。'],
  'TC-116': [`${CONF}；照片已重新排序；Text language 為「日本語」；開發人員選項 › 不保留活動 已開啟`, '按 Home，開啟其他 App，再回到 PhotoDirector', '確認生成頁回來時照片、順序、張數和 Text language 都不變；不會閃退', 'Domain K62（Activity 重建）。測完請關閉「不保留活動」。'],
  'TC-072': [`${FREE}；點數餘額低於 60；${CONF}`, '點「Generate | 60」', '開啟付費牆（IAP 頁）；沒有開始生成', 'PHD 每輪開始時的狀態（免費用戶、0 點；domain test-setup）就適用這個案例。'],
  'TC-073': [`${PREM}；點數餘額低於 60；${CONF}`, '點「Generate | 60」', '出現「More Credits Required」；其按鈕會開到 Credit Shop', '需要：點數不足的 Premium 帳號。Domain K36b：Android 上 VIP = Pro = Premium = 訂閱，只有一種付費模式。'],
  'TC-074': [`點數餘額 60 以上（先記下）；${CONF}`, '點「Generate | 60」', '開始生成；餘額剛好減少 60'],
  'TC-117': [`點數 ≥ 120（先記下餘額）；${CONF}`, '以最快速度連點「Generate | 60」三次', '只開始一個工作：My AI Artwork 只多一張卡片，餘額只減少一次 60', 'Domain K30（PHA262026-0418）：連點只扣一次。'],
  'TC-118': ['剛完成一次「Top 5 of My Year」生成（TC-074）', '開啟點數按鈕 › Buy Credit ›「Detail」（右上角）', '最新一筆寫出功能名稱（Reel Creator／Creative 功能）並顯示扣了 60；如有退點，也列出退點金額', 'Domain K36a。功能名稱尚未定案（Q-2）：請記下。'],
  // 文字語言
  'TC-075': [`手機語言為英文；${CONF}`, '點「Text language」「English ▾」', '開啟清單，第一項為「English (Device language)」並打勾，接著是「繁體中文」、「简体中文」、「日本語」、「한국어」、「Español」、「Français」、「Deutsch」、「Português」、「Italiano」、「ภาษาไทย」…；清單可以捲動'],
  'TC-076': [`App 以繁體中文啟動（\`launch --lang zh-Hant\`）；${CONF}`, '查看 Text language 的值並開啟清單', '預設為「繁體中文」，並標示 (Device language)', '最後請執行 `locale reset`。'],
  'TC-077': ['已開啟 Text language 清單', '捲到清單底部', '列出 PhotoDirector 支援的所有語言；請記下清單（應與 iOS 相同）'],
  'TC-078': ['已開啟 Text language 清單', '選「日本語」', '清單關閉；Text language 顯示「日本語」'],
  'TC-079': ['確認生成頁的 Text language 已設為「日本語」', '回到選圖頁再點一次「Next」；再開另一個 Creative 版型的確認生成頁', '在房間內（同一個 session）Text language 仍顯示「日本語」'],
  'TC-080': ['Text language 已設為「日本語」', '離開 Reel Creator 房間後再進入，走到 Creative 確認生成頁', 'Text language 恢復為裝置語言'],
  'TC-081': [`點數 ≥ 60；${CONF}；Text language 為「日本語」`, '點「Generate」並開啟完成的 reel', 'reel 裡的文字是日文'],
  'TC-082': [`點數 ≥ 60；${CONF}；Text language 為「繁體中文」`, '點「Generate」並開啟完成的 reel', 'reel 裡的文字是繁體中文'],
  'TC-083': [`點數 ≥ 60；${CONF}；Text language 維持「English (Device language)」`, '點「Generate」並開啟完成的 reel', 'reel 裡的文字是英文'],
  'TC-084': ['My AI Artwork 中有一支完成的 Creative reel', '開啟它並尋找編輯文字的方式', 'reel 的文字無法編輯'],
  'TC-123': ['App 先以繁體中文、再以日文啟動（`launch --lang zh-Hant`／`ja`）', '在每種語言下：在「Top 5 of My Year」選圖頁選 3 張；走到 Import 提醒（TC-054 的前置）；在確認生成頁刪到 4 張並點 Generate', '底部列、Import 提醒和 toast 在該語言下顯示正確的數字（5–15、2、N、5）；沒有畫面閃退或顯示原始佔位符', 'Domain K70（佔位符 %d／%1$s）。最後請執行 `locale reset`。'],
  'TC-124': ['App 以阿拉伯文啟動（`launch --lang ar`，若 PhotoDirector 有提供）', '走一遍 房間 → 預覽頁 → 選圖頁 → 確認生成頁 → Text language 清單', '版面左右鏡像（‹ 在右邊，底部列和清單不超出畫面，滑動引導和照片建議指向正確的控制項）；可接受西方數字 0–9', 'Domain K66、K68。若沒有阿拉伯文，記錄為 Not run。最後請執行 `locale reset`。'],
  'TC-125': ['App 先以德文、再以葡萄牙文啟動', '查看選圖頁底部列、Import 提醒、確認生成頁的提示和「Generate」', '每段文字都能讀（沒有被截斷或重疊），每個按鈕都按得到', 'Domain K69（長字串）。最後請執行 `locale reset`。'],
  // 生成與 My AI Artwork
  'TC-085': [`點數 ≥ 60；${CONF}`, '點「Generate | 60」', '開啟 My AI Artwork 的「Reel Creator」tab，最上方出現新的「Top 5 of My Year」卡片：「Processing…」、剩餘時間（「… minutes remaining…」）和進度條', 'Domain K60／K61：「3 minutes」是 mockup 文字，不是保證的時間；判斷的是等待畫面。請記下卡片上的縮圖（Q-18）。'],
  'TC-086': ['My AI Artwork 中有一支處理中的 Creative reel', '等待完成後點卡片', '卡片顯示日期和「Top 5 of My Year」；reel 可以播放，影片檔的像素尺寸為 9:16（寬：高）', 'Domain K51／K53：檢查檔案的像素尺寸，以及檔案能開啟，不只看畫面上的大小。'],
  'TC-087': ['一支用 7 張不同照片生成完成的 Creative reel', '看完整支 reel', '7 張輸入照片每一張都有出現在 reel 中（順序可能與確認生成頁不同）'],
  'TC-088': ['My AI Artwork 中有一支處理中的 reel', '離開 My AI Artwork（‹），等 1 分鐘，再從房間的歷史紀錄圖示開啟', '卡片仍在處理中（或已完成）；沒有遺失', '規格沒寫處理中離開的情況（Q-12）。'],
  'TC-121': ['一支 Creative reel 剛開始處理', '按 Home，等工作完成；點完成通知', '收到有標題和內容的通知；點下去開啟 My AI Artwork（Reel Creator tab）並停在完成的 reel，不會出現「APP version does not support feature」', 'Domain K48（PHA262026-0373）。規格本身沒寫（Q-12）。'],
  'TC-089': ['已開啟 My AI Artwork', '查看 tab', 'tab 包含「Image to Video」、「Reel Creator」、「Character Motion Swap」；沒有名為「Cinematic Reel Creator」的 tab'],
  'TC-090': ['Creative、AI Transition 和 Cinematic Styles 各有一筆完成的結果', '開啟「Reel Creator」tab', '三筆都在同一個清單中，沒有子 tab，依時間由新到舊，每筆顯示日期和版型名稱'],
  'TC-091': ['My AI Artwork 的「Reel Creator」tab', '點「Create More」', '開啟 Reel Creator 房間'],
  'TC-122': ['由 My AI Artwork 的「Create More」開啟的房間；點數 ≥ 40', '再生成一支 Cinematic Styles reel，然後在房間按「‹」', '第二個工作正常執行並完成；「‹」離開房間時沒有錯誤或黑畫面', 'Domain K28（Create More／返回時資源已失效）。Create More 是否保留輸入尚未確認（Q-20）。'],
  // Cinematic Styles
  'TC-092': [ROOM, '點一個 Cinematic Styles 版型（例如「Micro Cinema」），再點「Use Template」', '預覽頁顯示「1 photo」；「Use Template」開啟選圖頁，顯示「Select 1 photo」「0/1」'],
  'TC-093': ['Cinematic 選圖頁「Select 1 photo」', '選 1 張，再嘗試選第 2 張', '第一張標示 01、1/1；Next 可以按；第二張加不進去（或 Next 變成無法按）'],
  'TC-094': ['Cinematic 選圖頁已選 1 張', '點「Next」', '確認生成頁：「Micro Cinema」、「1 photo · output 9:16」、「Your photos」「1/1」、「Tap the photo to replace」、「Generate | 40」；沒有 Text language'],
  'TC-095': ['Cinematic 確認生成頁', '點照片並選另一張', '確認生成頁上的照片換成新選的那張（仍為 1/1）'],
  'TC-096': ['Cinematic 確認生成頁；點數 ≥ 40（先記下餘額）', '點「Generate | 40」', 'My AI Artwork 的「Reel Creator」tab 顯示「Micro Cinema」卡片處理中；餘額剛好減少 40'],
  'TC-127': ['TC-096 的「Micro Cinema」reel 已完成', '從 My AI Artwork 開啟、播放，並檢查影片檔', 'reel 可以播放；影片檔的像素尺寸為 9:16（寬：高），檔案能開啟', 'Domain K51／K53：量的是檔案，不是畫面上的大小。'],
  'TC-119': ['剛完成一次 Cinematic Styles 生成', '開啟 Buy Credit ›「Detail」', '最新一筆寫出功能名稱（Cinematic Styles／CineStory）並顯示扣了 40', 'Domain K36a。'],
  'TC-097': [`${NEWSESSION}；上次在 Creative 版型選了 7 張`, '開一個 Cinematic 版型 ›「Use Template」', '記錄是否出現 Import 提醒；Import 後 Next 要到只剩 1 張才可以按', 'Q-7。'],
  // AI Transition
  'TC-098': [ROOM, '開一個 Cool Transitions 版型；查看張數；點「Use Template」', '預覽頁顯示固定張數（「4 photos」或「6 photos」）；選圖頁底部列顯示「Select 4 photos」（或 6）與「0/4」'],
  'TC-099': ['AI Transition 選圖頁「Select 4 photos」', '選 3 張，再選第 4 張', '3 張時 Next 無法按；4/4 時可以按；第 5 張選不了'],
  'TC-100': ['AI Transition 選圖頁已選 4 張', '點「Next」', '確認生成頁顯示「4/4」張照片、排序提示和「Generate | <點數>」；沒有 Text language', '規格沒畫點數（Q-9）：請記下。'],
  'TC-101': ['AI Transition 確認生成頁，照片為 A、B、C、D；點數足夠（先記下餘額）', '長按排序成 D、C、B、A，再點「Generate」', '完成的影片中照片依 D、C、B、A 的順序出現，影片檔的像素尺寸為 9:16；餘額減少按鈕上的點數'],
  'TC-120': ['剛完成一次 AI Transition 生成', '開啟 Buy Credit ›「Detail」', '最新一筆寫出功能名稱（AI Transition）並顯示扣了按鈕上的點數', 'Domain K36a。'],
  'TC-102': ['6 張的 Cool Transitions 版型預覽頁（若版型清單中有）', '點「Use Template」', '底部列顯示「Select 6 photos」'],
  // Android 返回鍵
  'TC-103': [ROOM, '按系統返回鍵', '與「‹」相同：離開房間', 'Domain K63：返回鍵的問題（Predictive Back）是逐頁出現的；每個畫面都有自己的案例。'],
  'TC-104': [TOP5, '按系統返回鍵', '與「‹」相同：回到房間'],
  'TC-105': ['照片建議面板已開啟', '按系統返回鍵', '面板關閉（同「Got it」）；停留在預覽頁'],
  'TC-106': [`${PICK}；已選 3 張`, '按系統返回鍵', '與選圖頁「‹」相同：回到預覽頁'],
  'TC-107': ['選圖頁顯示 Import 提醒', '按系統返回鍵', '記錄：關閉的是提醒，還是選圖頁', '規格沒寫（Q-8）。'],
  'TC-108': [CONF, '按系統返回鍵', '與「‹」相同：回到選圖頁'],
  'TC-109': ['確認生成頁的 Text language 清單已開啟', '按系統返回鍵', '清單關閉，語言不變；停留在確認生成頁'],
  'TC-110': ['已跳出 Edit Room 跳轉對話框', '按系統返回鍵', '對話框以取消的方式關閉；留在 Edit Room'],
  'TC-111': ['生成後開啟的 My AI Artwork', '按系統返回鍵', '記錄回到哪裡（確認生成頁、房間或前一頁）', '規格沒寫（Q-8）。'],
};

const rows = readTable(join(HERE, 'draft.csv'));
const missing = rows.filter(r => !ZH[r.ID]).map(r => r.ID);
const extra = Object.keys(ZH).filter(id => !rows.some(r => r.ID === id));
if (missing.length || extra.length) throw new Error(`translation out of step with draft.csv: missing ${missing.join(', ')}; extra ${extra.join(', ')}`);

const HEAD = ['編號', '區塊', '前置條件', '操作步驟', '預期結果', '優先度', '規格對應', '備註', '變更', '變更原因'];
const CHANGE: Record<string, string> = { new: '新增', modified: '修改', removed: '移除', unchanged: '未變更' };
const REASON_ZH: Record<string, string> = {
  'New table (REQ-001)': '新表（REQ-001）',
  'New table (REQ-001); credit button per domain K75 (REQ-003)': '新表（REQ-001）；依 domain K75 更新點數按鈕（REQ-003）',
  'New table (REQ-001); History button per domain K76 (REQ-003)': '新表（REQ-001）；依 domain K76 新增 History 按鈕（REQ-003）',
  'New table (REQ-001); PHD domain knowledge (REQ-004)': '新表（REQ-001）；依 PHD domain knowledge 更新（REQ-004）',
  'New table (REQ-001); size boundary outside the MB / MiB gap (REQ-006)': '新表（REQ-001）；檔案大小邊界避開 MB／MiB 差距（REQ-006）',
  'New table (REQ-001); 9:16 output per feature (REQ-006)': '新表（REQ-001）；每種 feature 都檢查 9:16 輸出（REQ-006）',
};
const out = rows.map(r => {
  const [pre, action, expected, notes = ''] = ZH[r.ID];
  return [r.ID, SECTION[r.Section] ?? r.Section, pre, action, expected, r.Priority, r['Spec Ref'], notes,
    CHANGE[r.Change] ?? r.Change, REASON_ZH[r['Change Reason']] ?? r['Change Reason']];
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
