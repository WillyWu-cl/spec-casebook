// Traditional Chinese (Taiwan wording) reading copy of draft.csv and of the Open questions (as phd/cutout REQ-003 /
// REQ-004). The English draft.csv stays the source of truth (AGENTS.md: table rows are written in English); this copy
// is for reading only and is rebuilt from it. UI strings in 「」 stay as the app's English UI shows them.
// Same script in the iOS and Android draft folders. Writes draft.zh-Hant.csv, draft.zh-Hant.xlsx, questions.zh-Hant.json.
// Re-runnable: node library/phd/my-ai-artwork-category-list/<platform>/drafts/<id>/build-zh.ts
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import ExcelJS from 'exceljs';
import { DRAFT_COLUMNS, readTable } from '../../../../../../scripts/lib/library.ts';
import { toCsv } from '../../../../../../scripts/lib/csv.ts';

const HERE = dirname(fileURLToPath(import.meta.url));
const ANDROID = /[\\/]android[\\/]/.test(HERE);
const PHONE = ANDROID ? 'Android 手機，PhotoDirector 已登入' : 'iPhone，PhotoDirector 已登入';
const OPEN = ANDROID ? 'My AI Artwork（Launcher › AI Photos › 右上角 My Artwork）' : 'My AI Artwork';
const WORKS = '至少三個功能底下有作品，其中包含「AI Art」和「AI Creative Studio」';
const BASE = `${PHONE}；${WORKS}`;
const ON = (tab: string) => `${BASE}；${OPEN} 已開啟並停在「${tab}」分頁`;
const SHEET = (tab: string) => `${ON(tab)}；已點 ☰，「All categories」已開啟`;
const PAID = ANDROID ? 'VIP' : 'Pro';
const EVLOG = '；已開啟 analytics 事件紀錄';
const PARK = '等有事件紀錄可看時再執行（先擱置）';

const SECTION: Record<string, string> = {
  'Entry and tab bar': '入口與分頁列', 'All categories sheet': 'All categories 清單', 'Choosing a category': '選擇分類',
  'Closing the sheet': '關閉清單', 'No charge': '不收費', 'Entry from a feature': '從功能進入', 'Tracking events': '埋點事件',
};

// [Precondition, Action, Expected Result, Notes] by ID
const ZH: Record<string, [string, string, string, string?]> = {
  'TC-001': [BASE, `開啟 ${OPEN}`, '頁面停在第一個分頁「Recent」（peach 色選取）；分頁列最右邊有 ☰ 按鈕'],
  'TC-002': [ON('Recent'), '1. 把分頁列往左滑到看見最後一個分頁\n2. 點最後一個分頁', '分頁滑動時 ☰ 固定在分頁列最右邊；點完後最後一個分頁被選取，☰ 仍在最右邊'],
  'TC-003': [ON('Recent'), '從第一個分頁讀到最後一個（往左滑分頁列）', '「Recent」排第一，其他分頁依英文字母順序（A → Z）；沒有作品的功能分頁也在其中', '把分頁清單記下來：TC-007 要拿清單來比對'],
  'TC-004': [`${ON('Recent')}；有一個沒有作品的功能（分頁裡是空的）`, '在分頁列點那個功能的分頁', '空分頁開啟並顯示「Nothing yet.」和「Start to Create」；該分頁在分頁列上沒有反灰', 'REQ-006：有作品的分頁才會顯示「Create More」'],
  'TC-005': [`${ON('Recent')}；Recent 裡有照片也有影片`, '1. 點「Video」\n2. 點「Photo」\n3. 點「Select」\n4. 點「Cancel」', '和改版前一樣：「Video」只顯示影片、「Photo」只顯示照片；「Select」進入多選、「Cancel」結束多選。Recent 仍是原本的列表，沒有列表／格狀切換', 'Q-1 已回答（REQ-003）：「同今天」= App 目前的行為'],
  'TC-006': [ON('Recent'), '點分頁列最右邊的 ☰', '頁面變暗，上方蓋一個標題為「All categories」、右上角有 ✕ 的清單；第一列是「Recent」'],
  'TC-007': [`${SHEET('Recent')}；已記下 TC-003 的分頁清單`, '從上到下讀每一列（捲動清單）', '清單內容和分頁列完全一樣：名稱相同、不多不少、順序相同——「Recent」第一，其他依英文字母順序（A → Z）', 'Q-4 已回答（REQ-003）：只在英文介面檢查順序'],
  'TC-008': [SHEET('Recent'), '把清單捲到最底', '清單能捲到最後一列，最後一列就是分頁列的最後一個分頁；每個功能都有一列'],
  'TC-009': [`${SHEET('Recent')}；至少有一個沒有作品的功能`, '看一個有作品和一個沒有作品的功能列', '每列只顯示功能名稱，沒有作品數量；沒有作品的那列字色和其他列一樣（沒有反灰）'],
  'TC-010': [SHEET('Recent'), '看「Recent」列和下面其他列', '只有「Recent」以 peach 色高亮，其他列都沒有'],
  'TC-011': [ON('AI Art'), '點 ☰', '「All categories」中「AI Art」列以 peach 色高亮；「Recent」和其他列都沒有'],
  'TC-012': [SHEET('Recent'), '1. 看一遍清單\n2. 點 ✕ 關閉\n3. 看一遍頁面和分頁', '清單和頁面都沒有搜尋欄、收藏（星號）或 Expiring 清單，分頁也沒有顯示數量'],
  'TC-013': [SHEET('Recent'), '點「AI Creative Studio」', '清單關閉，My AI Artwork 切到「AI Creative Studio」分頁：分頁列上該分頁被選取（peach 底線）且在畫面內，並顯示它的作品'],
  'TC-014': [SHEET('Recent'), '點「AI Art」', '清單關閉並停在「AI Art」分頁，顯示 AI Art 的作品（包含舊作品），不用滑分頁列', 'QA 單 PHI262609-0006 的問題'],
  'TC-015': [ON('Recent'), '1. 在分頁列點「AI Art」分頁\n2. 記下顯示內容（作品、篩選、捲動在最上方）\n3. 點「Recent」分頁\n4. 點 ☰\n5. 點「AI Art」', '從清單選「AI Art」看到的分頁、作品和篩選狀態，和直接點分頁時一樣（「同今天」）'],
  'TC-016': [`${SHEET('Recent')}；有一個沒有作品的功能`, '點那個功能的列', '清單關閉，切到該功能的空分頁，顯示「Nothing yet.」和「Start to Create」', 'REQ-006'],
  'TC-017': [SHEET('AI Art'), '點「AI Art」（高亮的那列）', '清單關閉，頁面仍停在「AI Art」分頁'],
  'TC-018': [SHEET('AI Art'), '點「Recent」', '清單關閉，回到「Recent」，分頁列上「Recent」被選取'],
  'TC-019': [ON('AI Creative Studio'), '1. 點「Select」\n2. 選兩個作品\n3. 點 ☰\n4. 點「AI Art」\n5. 點「AI Creative Studio」分頁', '步驟 4：清單關閉並停在「AI Art」分頁，選取被取消（沒有作品被選、多選結束：沒有「Cancel」、沒有底部操作列）。步驟 5：那兩個作品已不是選取狀態', 'Q-5 已回答（REQ-003）：多選結束'],
  'TC-032': [ON('AI Creative Studio'), '1. 點「Select」\n2. 選兩個作品\n3. 在分頁列點「AI Art」分頁\n4. 點「AI Creative Studio」分頁', '步驟 3：頁面切到「AI Art」分頁，選取被取消（沒有作品被選、多選結束：沒有「Cancel」、沒有底部操作列）。步驟 4：那兩個作品已不是選取狀態', 'Figma draft 區塊「選取狀態」（REQ-004）'],
  'TC-020': [SHEET('Recent'), '點清單最後一列', '清單關閉並停在該分頁；分頁列捲到最後，該分頁被選取且在畫面內', 'Q-6 已回答（REQ-003）'],
  'TC-021': [SHEET('AI Art'), '點 ✕', '清單關閉；頁面仍停在「AI Art」分頁，沒有變化', 'Q-3 已回答（REQ-003）'],
  'TC-022': [SHEET('AI Art'), '拖住清單上方的拉桿往下拉', '清單關閉；頁面仍停在「AI Art」分頁', 'Q-3 已回答（REQ-003）'],
  'TC-023': [SHEET('AI Art'), '點清單上方變暗的頁面', '清單關閉；頁面仍停在「AI Art」分頁', 'Q-3 已回答（REQ-003）'],
  'TC-024': [SHEET('AI Art'), '按系統返回鍵', '只有清單關閉；My AI Artwork 仍停在「AI Art」分頁（沒有離開頁面）', 'Q-3 已回答（REQ-003）'],
  'TC-025': [`${PHONE}，使用免費（未訂閱）帳號；${WORKS}；${OPEN} 停在「Recent」；已記下 credit 餘額`, '1. 點 ☰\n2. 點「AI Art」\n3. 點 ☰\n4. 點 ✕', '每個步驟都沒有出現升級或購買提示；credit 餘額不變'],
  'TC-026': [`${PHONE}，使用 ${PAID} 帳號；${WORKS}；${OPEN} 停在「Recent」；已記下 credit 餘額`, '1. 點 ☰\n2. 點「AI Art」', '沒有出現升級或購買提示；credit 餘額不變', ANDROID ? '' : 'iOS 的付費模式有 Pro 和 Pro+（KP-013）；規格沒有指定方案，所以只放一列付費'],
  'TC-027': [`${PHONE}；有一個帶 History 按鈕（右下有時鐘的紙張圖示）且底下有作品的功能`, '1. 開啟該功能\n2. 點它的 History 按鈕\n3. 點 ☰', 'My AI Artwork 開在該功能的分頁；「All categories」中該功能那列以 peach 色高亮', 'KP-026（團隊規則）'],
  'TC-028': [`${ON('Recent')}${EVLOG}`, '點 ☰', '送出「Artwork_FeatureList_Appear」，from_tab = Recent', PARK],
  'TC-029': [`${ON('AI Art')}${EVLOG}`, '點 ☰', '送出「Artwork_FeatureList_Appear」，from_tab = AI Art', PARK],
  'TC-030': [`${SHEET('Recent')}${EVLOG}`, '點「AI Art」', '送出「Artwork_Category_Select」，category = AI Art、source = sheet', PARK],
  'TC-031': [`${ON('Recent')}${EVLOG}`, '在分頁列點「AI Art」分頁', '送出「Artwork_Category_Select」，category = AI Art、source = tab', PARK],
};

const QUESTIONS: Record<string, string> = {}; // Q-1 – Q-7 answered 2026-11-11 (REQ-003)

const rows = readTable(join(HERE, 'draft.csv'));
const missing = rows.filter(r => !ZH[r.ID]).map(r => r.ID);
if (missing.length) throw new Error(`translation out of step with draft.csv: missing ${missing.join(', ')}`);

const HEAD = ['編號', '區塊', '前置條件', '操作步驟', '預期結果', '優先度', '規格對應', '備註', '變更', '變更原因'];
const CHANGE: Record<string, string> = { new: '新增', modified: '修改', removed: '移除', unchanged: '未變更' };
const ZH_REASON: Record<string, string> = { 'REQ-006: an empty tab shows 「Nothing yet.」 / 「Start to Create」; 「Create More」 only on a tab with works (R-004)': 'REQ-006：空分頁顯示「Nothing yet.」/「Start to Create」；有作品才顯示「Create More」（R-004）', 'New table (REQ-001)': '新建的表（REQ-001）', 'Figma draft: switching tab during multi-select cancels the selection (R-025, REQ-004)': 'Figma draft：多選時切換分頁會取消選取（R-025，REQ-004）' };
const out = rows.map(r => {
  const [pre, action, expected, notes = ''] = ZH[r.ID];
  return [r.ID, SECTION[r.Section] ?? r.Section, pre, action, expected, r.Priority, r['Spec Ref'], notes,
    CHANGE[r.Change] ?? r.Change, ZH_REASON[r['Change Reason']] ?? r['Change Reason']];
});
if (DRAFT_COLUMNS.length !== HEAD.length) throw new Error('column count changed');
writeFileSync(join(HERE, 'draft.zh-Hant.csv'), toCsv([HEAD, ...out]));
writeFileSync(join(HERE, 'questions.zh-Hant.json'), JSON.stringify(QUESTIONS, null, 2) + '\n');

const wb = new ExcelJS.Workbook();
const ws = wb.addWorksheet('測試案例');
ws.columns = [10, 14, 40, 40, 50, 8, 16, 36, 8, 16].map((width, i) => ({ header: HEAD[i], width }));
ws.addRows(out);
ws.getRow(1).font = { bold: true };
ws.views = [{ state: 'frozen', ySplit: 1 }];
ws.eachRow(row => row.eachCell(c => { c.alignment = { wrapText: true, vertical: 'top' }; }));
await wb.xlsx.writeFile(join(HERE, 'draft.zh-Hant.xlsx'));
console.log(`${out.length} rows → draft.zh-Hant.csv, draft.zh-Hant.xlsx, questions.zh-Hant.json`);
