// Traditional Chinese (Taiwan wording) reading copy (answers applied 2026-11-10, REQ-005 – REQ-008) of draft.csv (user, 2026-11-10, REQ-003). The English draft.csv stays
// the source of truth (AGENTS.md: table rows are written in English); this copy is for reading only and is rebuilt from
// it. UI strings in 「」 and the button names Reset / Undo / Redo stay as the app's English UI shows them. Columns ID,
// Priority, Spec Ref, Change are copied. Writes draft.zh-Hant.csv (UTF-8 with BOM, opens in Excel) and draft.zh-Hant.xlsx.
// Re-runnable: node library/phd/cutout/android/drafts/20261110-163734/build-zh.ts
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import ExcelJS from 'exceljs';
import { DRAFT_COLUMNS, readTable } from '../../../../../../scripts/lib/library.ts';
import { toCsv } from '../../../../../../scripts/lib/csv.ts';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOM = '剛進入 Cutout 房間（人物照片，用「Auto」選取後點「Cutout」）；還沒做任何步驟';
const TWO = '在 Cutout 房間，「Solid」分類（兩個步驟）：\n1. 點「White」\n2. 點「Black」';

const SECTION: Record<string, string> = {
  'Entry and layout': '入口與版面', 'Button states': '按鈕狀態', 'Steps per operation': '各操作的步驟',
  'Operations that are not steps': '不算步驟的操作', 'Undo across tabs': '跨分頁 Undo', 'Reset and the cutout style': 'Reset 與去背樣式',
  'Leaving the room': '離開房間', 'Other scenarios': '其他情境', 'Android': 'Android 返回鍵',
};

// [Precondition, Action, Expected Result, Notes] in draft.csv order
const ZH: Record<string, [string, string, string, string?]> = {
  'TC-001': ['編輯器已開啟一張有一到兩個人的照片', '1. 點 Edit ›「Cutout」\n2. 點「Auto」\n3. 點「Cutout」', '開啟 Cutout 房間：畫布上是去背後的人物，畫布上有編輯（鉛筆）按鈕；分頁「Background」和「Stroke」，預設選在「Background」；分類從「Solid」開始，下方是素材列', ''],
  'TC-002': [ROOM, '查看底部工具列', '由左到右五個按鈕：✕、Reset、Undo、Redo、✓。Reset、Undo、Redo 為灰色（不能按）；✕ 和 ✓ 可以按', ''],
  'TC-003': [ROOM, '1. 點 Reset\n2. 點 Undo\n3. 點 Redo', '都沒有反應：畫布和面板不變，三個按鈕維持灰色', ''],
  'TC-004': [ROOM, '在「Solid」素材列點「White」', '背景變成白色。Reset 和 Undo 變成可以按；Redo 維持不能按', ''],
  'TC-005': [TWO, '點 Undo', '背景回到白色。Reset、Undo、Redo 三個都可以按', ''],
  'TC-006': [`${TWO}\n3. 點 Undo（背景為白色）`, '點 Undo', '畫布回到剛進房間的狀態（透明背景）。Reset 和 Undo 不能按；Redo 可以按', ''],
  'TC-007': [TWO, '點 Reset', '畫布回到剛進房間的狀態。Reset 不能按、Undo 可以按、Redo 不能按', ''],
  'TC-008': [`${TWO}\n3. 點 Reset`, '1. 點 Undo\n2. 點 Redo', 'Undo 後：黑色背景回來，Reset 重新可以按。Redo 後：再次套用 Reset（回到剛進房間的狀態），Reset 不能按、Undo 可以按', ''],
  'TC-009': [`${TWO}\n3. 點 Undo（Redo 可以按）`, '點 Reset', '回到剛進房間的狀態。Redo 變成不能按（Reset 會清空 Redo 紀錄）；Undo 可以按', ''],
  'TC-010': [`${TWO}\n3. 點 Undo（Redo 可以按）`, '在素材列點「Blue」', '背景變成藍色。Redo 變成不能按（新操作清空了 Redo 紀錄）；Undo 可以按', ''],
  'TC-011': [`${ROOM}；記下剛進入時選中的素材（透明）`, '1. 點「White」\n2. 點剛進入時選中的素材（透明）', '畫布看起來和剛進入時一樣。Reset 不能按（狀態等於初始狀態），Undo 可以按（有兩個步驟）；點一次 Undo 會顯示白色背景', ''],
  'TC-012': ['在 Cutout 房間，「Solid」分類；已選「White」（一個步驟）', '1. 點「Black」\n2. 點 Undo\n3. 點 Redo', 'Undo 後：白色背景，橘色選取框移回「White」。Redo 後：黑色背景，選取框在「Black」', ''],
  'TC-013': [`${ROOM}；已下載一個「Wall」模板（沒有下載箭頭）`, '1. 點「Wall」分類\n2. 點已下載的模板\n3. 點 Undo\n4. 點 Redo', '模板套用到畫布後 Undo 才變成可以按。Undo 後：回到剛進入時的背景，選取框移回剛進入時的素材。Redo 後：模板再次套用，選取框在模板上', ''],
  'TC-014': [`${ROOM}；有一個還沒下載的「Wall」模板（有下載箭頭），可以的話用慢速網路`, '1. 點「Wall」分類\n2. 點有下載箭頭的模板\n3. 下載中觀察 Undo', '模板下載中 Undo 維持不能按，要等模板套用到畫布後才變成可以按（套用完成時才記錄）', 'Q-2 已回答（REQ-005）：沒有更早的步驟時，下載中 Undo 維持不能按。'],
  'TC-015': [ROOM, '1. 點匯入照片的素材\n2. 選一張照片\n3. 點 Undo\n4. 點 Redo', '照片出現在畫布上時 Undo 變成可以按。Undo 後：照片從畫布移除，回到剛進入時的背景。Redo 後：照片再次出現', ''],
  'TC-016': ['在 Cutout 房間：\n1. 匯入一張照片當背景\n2. 點 Undo', '再次打開匯入照片的素材', '被 Undo 的照片仍列在「最近使用」（Recent）中', 'REQ-008：App 目前沒有「最近使用」，這列預期會失敗；執行完這列後，請先為缺少 Recent 開 eBug。'],
  'TC-017': [ROOM, '1. 點色盤素材\n2. 在色盤上拖過幾個顏色，不要確認\n3. 查看 Undo\n4. 確認顏色\n5. 點 Undo', '拖動中 Undo 維持不能按，確認後才變成可以按。Undo 會回到打開色盤前的背景（不是拖動中經過的某個顏色）', ''],
  'TC-018': ['在 Cutout 房間：已選「White」（一個步驟）', '1. 點色盤素材\n2. 拖到紅色\n3. 不確認，直接關閉色盤\n4. 點 Undo', '關閉色盤會把選色記為一個步驟：關閉後背景是選的顏色；點一次 Undo 回到白色', ''],
  'TC-051': ['在 Cutout 房間：已選「White」（一個步驟）', '1. 點色盤素材\n2. 沒有改顏色，直接關閉色盤\n3. 點 Undo', '沒有改顏色就關閉色盤不算一步：點一次 Undo 回到剛進入時的背景，之後 Undo 變成不能按', 'Q-9 已回答（REQ-005）。'],
  'TC-019': [ROOM, '1. 點「Stroke」分頁\n2. 點橘色色塊\n3. 點 Undo\n4. 點 Redo', '點下色塊時 Undo 就變成可以按。Undo 後：回到原本的描邊設定（剛進入時的顏色）。Redo 後：橘色描邊', ''],
  'TC-020': [ROOM, '1. 點「Stroke」分頁\n2. 點另一個描邊樣式縮圖\n3. 點 Undo', '點下時 Undo 就變成可以按；Undo 回到原本的描邊樣式', ''],
  'TC-021': [`${ROOM}；在「Stroke」分頁，粗細滑桿在剛進入時的數值（Design 為 33）`, '1. 把粗細滑桿拖到約 60，手指不放\n2. 查看 Undo\n3. 放開\n4. 點 Undo', '手指按住時 Undo 維持不能按，放開後才變成可以按。Undo 讓滑桿和描邊回到剛進入時的數值', ''],
  'TC-022': ['在 Cutout 房間：「Stroke」分頁，粗細滑桿在 33', '1. 把滑桿拖到約 60 後放開\n2. 再拖到約 10 後放開\n3. 點 Undo', '點一次 Undo，滑桿回到約 60（每次放開算一步，中間經過的數值不算）', ''],
  'TC-023': [ROOM, '1. 用兩指旋轉去背物件，手指不放\n2. 查看 Undo\n3. 放開\n4. 點 Undo', '旋轉中 Undo 維持不能按，放開後才變成可以按。Undo 讓去背物件回到旋轉前的角度', ''],
  'TC-024': [ROOM, '1. 在畫布上選取去背物件\n2. 點 Flip 按鈕\n3. 點 Undo\n4. 點 Redo', '有 Flip 按鈕，按下會翻轉去背物件，Undo 同時變成可以按。Undo 後：去背物件回到翻轉前的方向。Redo 後：再次翻轉', 'REQ-009：房間必須有 Flip 按鈕；如果這個版本沒有，請記為 Fail 並開 eBug。'],
  'TC-025': [ROOM, '1. 點「White」\n2. 點「Stroke」分頁\n3. 點橘色色塊\n4. 拖動粗細滑桿後放開\n5. 旋轉去背物件後放開\n6. 點 Undo 四次\n7. 點 Redo 四次', '四次 Undo 依序復原旋轉、粗細、描邊顏色、白色背景，最後回到剛進入時的狀態（Reset 和 Undo 不能按，Redo 可以按）。四次 Redo 依原本順序重新套用', ''],
  'TC-026': [ROOM, '1. 點畫布上的去背物件\n2. 點「Stroke」\n3. 點「Background」\n4. 點「Wall」分類\n5. 點「Romantic」分類\n6. 點「Solid」分類\n7. 左右捲動素材列\n8. 點已選中的素材', '每個動作之後，Reset、Undo、Redo 都維持不能按', ''],
  'TC-027': [`${TWO}\n3. 點 Undo（Redo 可以按）`, '1. 點畫布上的去背物件\n2. 點「Stroke」\n3. 點「Background」\n4. 點「Wall」分類\n5. 點「Solid」分類\n6. 捲動素材列\n7. 再點一次已選中的「White」\n8. 點 Redo', '第 1–7 步之後 Redo 都維持可以按（這些都不算步驟），點 Redo 會把黑色背景帶回來', ''],
  'TC-028': ['在 Cutout 房間：已選「White」（一個步驟）', '1. 再點一次「White」\n2. 點 Undo', '點一次 Undo 就回到剛進入時的背景；之後 Undo 變成不能按（第二次點擊沒有多記一步）', ''],
  'TC-029': [`${ROOM}；已下載一個「Wall」模板`, '1. 套用「Wall」模板\n2. 點「Stroke」並改變描邊顏色\n3. 點「Background」\n4. 點 Undo', '描邊的變更被復原，面板自動切到「Stroke」分頁', ''],
  'TC-030': ['接續上一列：在「Stroke」分頁，Wall 模板仍套用中', '點 Undo', 'Wall 模板被復原；面板自動切回「Background」；畫布回到剛進入時的狀態，Reset 和 Undo 不能按，Redo 可以按', ''],
  'TC-031': ['接續上一列：在「Background」，剛進入時的狀態，Redo 可以按', '1. 點 Redo\n2. 點 Redo', '第一次 Redo：Wall 模板回來，面板停在「Background」。第二次 Redo：描邊變更回來，面板自動切到「Stroke」', ''],
  'TC-032': ['在 Cutout 房間：「Stroke」分頁，已在這個分頁改過兩次描邊顏色', '點 Undo', '最後一次的描邊顏色被復原，面板停在「Stroke」', ''],
  'TC-033': ['在 Cutout 房間：已改過背景、描邊顏色和粗細；面板在「Stroke」', '點 Reset', '面板自動切到「Background」，畫布回到剛進入時的狀態：去背物件、剛進入時的背景和描邊', ''],
  'TC-034': ['在 Cutout 房間：已改過背景', '點 Reset', '畫布回到進入房間時的狀態（去背後的人物），不是原始照片和它原本的背景', ''],
  'TC-035': [ROOM, '1. 點畫布上的編輯（鉛筆）按鈕\n2. 在編輯去背頁，用筆刷多選一塊區域\n3. 回到 Cutout 房間', '去背物件顯示編輯後的形狀。Undo 和 Redo 維持不能按（來回一趟不算步驟）；Reset 變成可以按（狀態和剛進入時不同）', ''],
  'TC-036': ['接續上一列：在編輯去背頁改過去背，房間內沒有步驟', '點 Reset', '去背物件回到進入房間時的形狀。Reset 不能按、Undo 可以按，面板在「Background」', ''],
  'TC-037': ['接續上一列：已按過 Reset', '點 Undo', '編輯後的去背形狀回來（Reset 前的狀態，包含去背樣式）', ''],
  'TC-038': ['在 Cutout 房間：已選「White」（一個步驟）', '1. 點編輯按鈕\n2. 用筆刷多選一塊區域\n3. 回到 Cutout 房間\n4. 點 Undo\n5. 點 Redo', '來回一趟沒有多記一步。Undo 復原「White」，去背物件也回到那一步時的形狀（剛進入時的形狀）；Redo 帶回白色背景和編輯後的去背', 'Q-1 已回答（REQ-005）。'],
  'TC-039': ['在 Cutout 房間：已點編輯按鈕（在編輯去背頁）', '1. 用筆刷多選一塊區域\n2. 點編輯去背頁自己的 Undo', '編輯去背頁的 Undo 復原該頁上的那一筆筆刷', ''],
  'TC-040': ['在 Cutout 房間：已做兩個步驟', '點 ✕', '關閉房間且不保留房間內的編輯，開啟 Cutout 頁（Auto / Box / Circle / Brush / Eraser），顯示進入房間前的圖片', ''],
  'TC-041': ['接續上一列：在 Cutout 頁', '點「Cutout」再次進入房間', 'Reset、Undo、Redo 全部不能按；之前的步驟都無法 Undo', ''],
  'TC-042': ['在 Cutout 房間：背景改成白色，描邊也改過', '點 ✓', '圖片被壓平（背景、去背物件和描邊合成一張圖），開啟 Cutout 頁並帶入這張圖', ''],
  'TC-043': ['接續上一列：在 Cutout 頁，圖片已壓平', '1. 選取區域\n2. 點「Cutout」再次進入房間', 'Reset、Undo、Redo 全部不能按；白色背景和描邊已是圖片的一部分，無法在房間內 Undo', ''],
  'TC-044': ['在 Cutout 房間：已選「White」（一個步驟）；有一個還沒下載的「Wall」模板；可以的話用慢速網路', '1. 點有下載箭頭的模板\n2. 下載中點 Undo', '只取消這次模板套用：畫布上不會出現模板，白色背景保留', 'Q-2 已回答（REQ-005）。'],
  'TC-045': ['接續上一列：被取消的模板仍在下載中', '等下載完成', '下載完成後模板不會自動套用；畫布不變', ''],
  'TC-046': [ROOM, '1. 做 60 個步驟（「White」和「Black」交替）\n2. 一直點 Undo 直到不能按', 'Undo 可以一路復原全部 60 步，回到剛進入時的狀態（透明背景）後才變成不能按；沒有步驟被捨棄，也不會顯示任何訊息', 'REQ-006：沒有步數上限。'],
  'TC-047': ['在 Cutout 房間：\n1. 做兩個步驟\n2. 點 Undo', '1. 把 App 切到背景 10 秒\n2. 回到 App', '房間的畫布和面板不變；Reset、Undo、Redo 狀態和之前一樣；Redo 仍能重做被復原的步驟', ''],
  'TC-048': ['在 Cutout 房間：已做兩個步驟', '按系統返回鍵', '返回鍵的效果和 ✕ 相同：關閉房間回到 Cutout 頁，再次進入時紀錄已清空', 'Q-7 已回答（REQ-005）。'],
  'TC-049': [ROOM, '1. 點色盤素材\n2. 拖到一個顏色\n3. 按系統返回鍵', '返回鍵只關閉色盤（仍在房間內），選色記為一個步驟（Undo 可以按；Undo 回到剛進入時的背景）', 'Q-7 已回答（REQ-005）。'],
  'TC-050': ['在 Cutout 房間：已點編輯按鈕（在編輯去背頁）', '按系統返回鍵', '返回 Cutout 房間（和該頁自己的關閉相同）；房間的 Reset／Undo／Redo 狀態不變', 'Q-7 已回答（REQ-005）。'],
};

const rows = readTable(join(HERE, 'draft.csv'));
const missing = rows.filter(r => !ZH[r.ID]).map(r => r.ID);
const extra = Object.keys(ZH).filter(id => !rows.some(r => r.ID === id));
if (missing.length || extra.length) throw new Error(`translation out of step with draft.csv: missing ${missing.join(', ')}; extra ${extra.join(', ')}`);

const HEAD = ['編號', '區塊', '前置條件', '操作步驟', '預期結果', '優先度', '規格對應', '備註', '變更', '變更原因'];
const CHANGE: Record<string, string> = { new: '新增', modified: '修改', removed: '移除', unchanged: '未變更' };
const ZH_REASON: Record<string, string> = { 'New table from the 11/E spec': '依 11/E 規格建立的新表' };
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
