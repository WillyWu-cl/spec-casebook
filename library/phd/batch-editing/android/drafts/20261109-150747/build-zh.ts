// Traditional Chinese (Taiwan wording) reading copy of this draft's draft.csv (REQ-002). The English draft.csv stays the
// source of truth; this copy is for reading only. Unchanged rows take their text from the approved cases.zh-Hant.csv
// (v1); modified and new rows are translated here. UI strings in 「」 stay as the app's English UI shows them.
// Writes draft.zh-Hant.csv (UTF-8 with BOM) and draft.zh-Hant.xlsx.
// Re-runnable: node library/phd/batch-editing/android/drafts/20261109-150747/build-zh.ts
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import ExcelJS from 'exceljs';
import { DRAFT_COLUMNS, readTable } from '../../../../../../scripts/lib/library.ts';
import { toCsv } from '../../../../../../scripts/lib/csv.ts';

const HERE = dirname(fileURLToPath(import.meta.url));
const PREM = '以 PhotoDirector Premium 帳號登入';
const FREE = '以 Free（非 Premium）帳號登入';
const GAL = '相簿中至少有 25 張直橫混合的照片';
const ROOM = `${PREM}；已開啟 Batch Edit Room，共 12 張照片（Launcher「Edit」›「Batch」），尚未做任何編輯`;
const CROP = `${ROOM}；已在第 1 張開啟 Crop & Rotate room`;
const ADJ = `${ROOM}；已在第 1 張開啟 Adjustment room`;
const FAIL = '需要：讓批次中部分照片 AI Enhance 失敗的測試條件（伺服器故障或 RD 開關）；沒有的話記為 Blocked --as test-data。';
const SECTION: Record<string, string> = {
  'Photo Picker': '照片挑選器', 'Entry': '入口', 'Batch Edit Room': 'Batch Edit Room 主畫面', 'Crop & Rotate': '裁切與旋轉',
  'Crop rules (Section 3)': '裁切規則（Section 3）', 'Adjustment': '調整', 'AI Enhance': 'AI Enhance',
  'AI Enhance failures': 'AI Enhance 失敗', 'Leaving Batch Edit': '離開 Batch Edit', 'Save': '存檔',
  'Batch Save page': 'Batch Save 頁', 'Android Back': 'Android 返回鍵',
};
const NEXT_IDS = ['TC-008', 'TC-010', 'TC-013', 'TC-014', 'TC-015', 'TC-018', 'TC-019', 'TC-020', 'TC-117', 'TC-119'];
const NEXT_REASON = 'Design 畫的挑選器按鈕是「Next」（R-015、Q-1）';

type Z = Partial<{ pre: string; action: string; expected: string; notes: string }>;
// modified rows: only the fields that changed, plus the reason
const MOD: Record<string, [Z, string]> = {
  'TC-005': [{ expected: '「Batch」分頁反白；底部列顯示提示「Select 1 to 20 photos to continue. (0/20)」與「Next」', notes: '採 Design 文案；PM 畫板為「Select 1 to 20 photos.」／「n selected (max 20)」與「Done」（Q-1）：請記下選照片前後顯示的字串。' }, '底部列採 Design 文案（R-015、Q-1）'],
  'TC-007': [{ expected: '每張被選的縮圖顯示點選順序 1、2、3；提示結尾為「(3/20)」；底部列下方的托盤依序列出這 3 張；「Next」可點' }, 'Design 文案與已選照片托盤（R-015、R-019）'],
  'TC-011': [{ pre: `${PREM}；照片挑選器在「Batch」分頁；${GAL}`, expected: '20 張都能選取（編號 1–20）；提示結尾為「(20/20)」', notes: 'Android 與 iOS 一樣上限 20 張，不受平台較低的預設上限限制。Free 使用者見 TC-156。' }, '張數採 Design 文案；R-013 的 Premium 情境（Q2 已決）'],
  'TC-014': [{ pre: '從「Edit」開啟的照片挑選器在「Batch」分頁，只選 1 張（「Select 1 to 20 photos to continue. (1/20)」）' }, NEXT_REASON],
  'TC-019': [{ pre: `${PREM}；從「AI Enhance」捷徑開啟的照片挑選器在「Batch」分頁，已選 3 張（「(3/20)」）` }, NEXT_REASON],
  'TC-022': [{ action: '在 Launcher（捷徑列與「View all」）尋找 Batch Edit 捷徑；有的話點它', expected: '記錄是否有這個捷徑（icon 仍在設計中）、點了會到哪裡（預期：照片挑選器的「Batch」分頁）', notes: 'UI UX flow 2 規劃了捷徑與 deeplink（TC-152）；落點沒寫（Q-15）。' }, 'PM 入口畫板改為規劃 Launcher 捷徑（R-022、Q-15；Q-2 已結）'],
  'TC-024': [{ expected: '左側為 Home 與 Replace photo；右側為回饋按鈕（對話框加 !）、Save（下載圖示，與 Edit Room 相同）與 Setting', notes: '回饋按鈕只有 Design 畫（Q-21）：沒有的話請記錄。' }, 'Design 上方列多了回饋按鈕（R-031、Q-21）'],
  'TC-036': [{ expected: 'Redo 已無法使用，第 2 張的 Enhance 結果拿不回來；在 AI Enhance 按鈕為「Enhance」（可點）：第 2 張可以再 Enhance' }, 'UI UX flow 2：可再進 AI Enhance room 重新 Enhance（R-038、R-229）'],
  'TC-037': [{ expected: '與現行 Crop & Rotate room 相同（Rotate、Flip、Flip Vertically、Original、Custom、Square、2:3、3:2、3:4…、角度滑桿、✕／undo／redo／✓）；工具 panel 上方沒有標題；上方列為 ‹、「W x H」加鉛筆、「All」；底部有批次縮圖列', notes: 'Design 畫的是「Squre」（Q-10），且沒有重設按鈕。' }, 'Design 的 Crop & Rotate 畫面（R-050）'],
  'TC-070': [{ notes: 'Design 畫面在「Exposure」與「Contrast」之間畫了「AI Exposure」（Q-18）：請記錄 App 有沒有。' }, 'Design 有 AI Exposure、PM 沒有（R-090、Q-18）'],
  'TC-093': [{ notes: 'Q1 已於 10/30 決定（Judy 與 Samuel）：day-1 不扣點。' }, 'PM Q1 已決（pm-decisions；Q-7 已結）'],
  'TC-096': [{}, 'R-116 不再說 Enhance 過的照片不算進 N；Retry Failed 只算失敗的照片（R-124）'],
  'TC-097': [{ action: '1. 開啟 AI Enhance\n2. 點「Enhance」\n3. 點「Start」', expected: '這次進入時按鈕為「Enhance」（可點）；對話框為「Enhance 3 photos?」；第 2 張從目前狀態 Enhance，第 1、3 張從已 Enhance 的結果再 Enhance', notes: '原本：「Enhanced」灰掉、第 2 張不能再 Enhance（UI UX flow 2 已刪除）。' }, 'R-117 移除；R-229：再進 room 可以再 Enhance 一次'],
  'TC-100': [{ notes: 'Design 把 Discard Dialog 畫在 AI Enhance 頁上（Q-19）：如果 ✕ 會先詢問請記錄。' }, 'Design 的 Discard 畫面在 AI Enhance 頁上（R-130、Q-19）'],
  'TC-101': [{ expected: '不會逐張跳對話框；跑完後一張總結卡片「12 completed, 3 failed」「Failed photos are marked with ! on the thumbnails.」，附 ✕；只有 3 張失敗的縮圖右上角有紅色 !；按鈕為「Retry Failed (3)」', notes: FAIL }, '採 Design 文案「with !」與卡片 ✕（R-123）'],
  'TC-122': [{ expected: '主畫面上顯示「Saving k / 20」與「Please do not leave this page or quit the app.」及進度條；上方列變暗（沒有回饋按鈕）且不能點；k 逐步增加；全部存完才開啟 Batch Save 頁' }, 'Design 存檔畫面（R-150）'],
  'TC-128': [{ expected: '標題「Save 12 photos」下方為 12 張存檔照片的縮圖格狀；左上「‹」、右上 Home、底部固定「Edit Next Batch」；沒有 Video 分頁、沒有「Turn it to video」', notes: '採 Design 文案；PM 寫「Saved 12 photos」（Q-20）。' }, 'Design 標題文案（R-153、Q-20）'],
  'TC-134': [{ pre: `${PREM}；Batch Edit Room 共 12 張，第 1 張已裁成 Square；已存檔；由「Edit Next Batch」開啟的照片挑選器`, expected: '回到 Batch Edit Room，編輯維持原樣（第 1 張仍是 Square），不是 Launcher、也不是 Batch Save 頁', notes: 'UI UX flow 2：day-1 照 Android 單張 Edit Room 做法（iOS 單張今天是回 Launcher）。' }, 'UI UX flow 2：從該挑選器按 ‹ 回到 Batch Edit Room（R-155）'],
  'TC-142': [{ notes: 'Design 把 Discard Dialog 畫在 AI Enhance 頁上（Q-19）：如果返回鍵會先詢問請記錄。' }, 'Design 的 Discard 畫面在 AI Enhance 頁上（Q-19）'],
  'TC-148': [{ pre: `${PREM}；Batch Edit Room 共 12 張，第 1 張已裁成 Square；已存檔；由「Edit Next Batch」開啟的照片挑選器`, expected: '與「‹」相同：回到 Batch Edit Room，編輯保留（第 1 張仍是 Square），不是 Batch Save 頁' }, 'UI UX flow 2：該挑選器按返回鍵回到 Batch Edit Room（R-155）'],
};
// new rows: [pre, action, expected, notes, reason]
const NEW: Record<string, [string, string, string, string, string]> = {
  'TC-150': ['照片挑選器在「Batch」分頁，已選第 1、2、3 張', '在底部列下方的托盤點第 2 張的 ✕', '第 2 張離開托盤，縮圖上的編號消失；提示結尾為「(2/20)」；記錄第 3 張是否改編為 2', '規格沒寫編號是否重排（Q-13）。', 'Design 挑選器托盤與 ✕（R-019）'],
  'TC-151': ['照片挑選器在「Batch」分頁，未選任何照片', '1. 點某張縮圖右下角的放大圖示\n2. 關閉開啟的畫面', '照片放大顯示但沒有被選取；關閉後回到挑選器，仍未選任何照片', 'Design 只畫了圖示（Q-13）：請記錄開啟了什麼。', 'Design 縮圖放大圖示（R-233）'],
  'TC-156': [`${FREE}；${GAL}`, '1. 在 Launcher 點「Edit」\n2. 選「Batch」\n3. 逐張選 20 張照片\n4. 點「Next」', '任何張數都不會出現 IAP 頁或 Premium 提示（第 7、第 13 張也不會）；20 張都能選；開啟 20 張的 Batch Edit Room', 'Q2 已於 10/30 決定：day-1 不鎖 Premium（pm-decisions）。', 'PM Q2 已決：免費、上限 20 張（R-013）'],
  'TC-152': [`${PREM}；手機已接 USB`, '開啟 deeplink phd://navigate/page?name=batch_edit（adb shell am start -a android.intent.action.VIEW -d "phd://navigate/page?name=batch_edit"）', 'PhotoDirector 開到 Batch Edit 入口；記錄落點（預期：照片挑選器的「Batch」分頁）', '落點沒寫（Q-15）。', 'UI UX flow 2 新增 batch_edit deeplink（R-022）'],
  'TC-154': [ROOM, '點上方列的回饋按鈕（對話框加 !）', '記錄開啟了什麼；關閉後回到 Batch Edit Room，沒有任何改變', '只有 Design 畫（Q-21）。', 'Design 上方列回饋按鈕（R-031）'],
  'TC-161': [CROP, '1. 查看上方列\n2. 切到另一張尺寸不同的照片\n3. 點鉛筆', '上方列顯示第 1 張的像素尺寸「W x H」加鉛筆；切換照片後變成那張的尺寸；鉛筆開啟手動輸入像素', '', 'Design Crop 上方列的尺寸與鉛筆（R-050）'],
  'TC-155': [`${CROP}；3:2 已套用到全部`, '點左上的 ‹', '與 ✕ 相同：回到 Batch Edit Room，這次 room 的修改被捨棄；如果保留了（像 ✓）請記錄', '規格沒寫 ✕ 之外的 ‹（Q-22）。', 'Design Crop 上方列的 ‹（R-050、Q-22）'],
  'TC-153': [CROP, '1. 還沒改任何東西時查看「All」\n2. 選 3:2 後再看一次\n3. 點「All」後再看一次\n4. 在 Adjustment room 重做一次', '記錄「All」什麼時候呈灰色；不是灰色時點下去會把設定套到其他照片', 'Design 畫了停用狀態（Q-16）。', 'Design「All」的兩種狀態（R-234）'],
  'TC-159': [ADJ, '1. 開「Color」分頁並開啟 HSL\n2. 用 ﹀ 收合 panel\n3. 用 ︿ 再展開\n4. 開啟 Curve，同樣收合再展開', 'HSL 顯示「Hue」／「Saturation」／「Lightness」與八個色點；Curve 在曲線旁顯示 RGB／紅／綠／藍色版；﹀ 收合 panel 後照片變大，︿ 再展開；照片上有重設與比較按鈕', '', 'Design HSL／Curve 畫面（R-230）'],
  'TC-158': [ADJ, '1. 在第 1 張把 HSL 紅色 Hue 設為 +20\n2. 把 RGB 曲線中段往上拉\n3. 點「All」\n4. 查看第 2、5 張', '第 2、5 張套用相同的 HSL 與 Curve 數值（紅色偏移、中間調變亮）；出現 toast「Applied to 11 photos」', '', 'Apply to all 包含 HSL 與 Curve（R-231）'],
  'TC-157': [`${PREM}；Batch Edit Room 共 3 張，已在同一次 AI Enhance 中全部 Enhance，回到主畫面`, '1. 再點一次「AI Enhance」\n2. 點「Enhance」\n3. 點「Start」', '這次進入時按鈕為「Enhance」（可點）；對話框為「Enhance 3 photos?」；3 張都從已 Enhance 的結果再 Enhance 一次；完成後按鈕為「Enhanced」灰掉', 'UI UX flow 2（原本：每張只能一次）。', 'R-229：每次進入可 Enhance 一次，下次進入可再一次'],
  'TC-160': ['部分失敗的總結卡片已顯示', '點卡片上的 ✕', '卡片關閉；紅色 ! 與「Retry Failed (3)」保留', FAIL, 'Design 結果卡片的 ✕（R-123）'],
};

const v1 = new Map(readTable(join(HERE, '..', '..', 'cases.zh-Hant.csv')).map(r => [r['編號'], r]));
const rows = readTable(join(HERE, 'draft.csv'));
const HEAD = ['編號', '區塊', '前置條件', '操作步驟', '預期結果', '優先度', '規格對應', '備註', '變更', '變更原因'];
const CHANGE: Record<string, string> = { new: '新增', modified: '修改', removed: '移除', unchanged: '未變更' };
const out = rows.map(r => {
  let pre: string, action: string, expected: string, notes: string, reason = '';
  if (r.Change === 'new') {
    const n = NEW[r.ID]; if (!n) throw new Error(`no translation for new ${r.ID}`);
    [pre, action, expected, notes, reason] = n; reason += '；REQ-003';
  } else {
    const o = v1.get(r.ID); if (!o) throw new Error(`no v1 translation for ${r.ID}`);
    [pre, action, expected, notes] = [o['前置條件'], o['操作步驟'], o['預期結果'], o['備註']];
    if (r.Change === 'modified') {
      if (NEXT_IDS.includes(r.ID)) { [pre, action, expected] = [pre, action, expected].map(t => t.replaceAll('「Done」', '「Next」')); reason = NEXT_REASON; }
      const m = MOD[r.ID];
      if (m) { pre = m[0].pre ?? pre; action = m[0].action ?? action; expected = m[0].expected ?? expected; notes = m[0].notes ?? notes; reason = m[1]; }
      if (!reason) throw new Error(`no Chinese reason for modified ${r.ID}`);
      reason += '；REQ-003';
    }
  }
  if (!!r.Notes !== !!notes) throw new Error(`Notes present in only one language: ${r.ID}`);
  return [r.ID, SECTION[r.Section] ?? r.Section, pre, action, expected, r.Priority, r['Spec Ref'], notes, CHANGE[r.Change] ?? r.Change, reason];
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
