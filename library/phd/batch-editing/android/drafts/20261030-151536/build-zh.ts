// Traditional Chinese (Taiwan wording) reading copy of draft.csv (user, 2026-10-30, REQ-002). The English draft.csv stays
// the source of truth (AGENTS.md: table rows are written in English); this copy is for reading only and is rebuilt from
// it. UI strings in 「」 stay as the app's English UI shows them. Columns ID, Priority, Spec Ref, Change are copied.
// Writes draft.zh-Hant.csv (UTF-8 with BOM, opens in Excel) and draft.zh-Hant.xlsx.
// Re-runnable: node library/phd/batch-editing/android/drafts/20261030-151536/build-zh.ts
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
const EDITED = `${PREM}；已開啟 Batch Edit Room，共 12 張照片，第 1 張已裁成 Square 並按 ✓ 回到主畫面`;
const SET4 = `${PREM}；Batch Edit Room 依序匯入 Section 3 測試照片：① 手扶梯 2:3（1706×2559）、② 101 4:5（1576×1970）、③ 茶杯 1:1（小圖）、④ 海景 16:9（2730×1535）；已開啟 Crop & Rotate room`;
const CROP = `${ROOM}；已在第 1 張開啟 Crop & Rotate room`;
const ADJ = `${ROOM}；已在第 1 張開啟 Adjustment room`;
const ENH = `${ROOM}；已在第 1 張開啟 AI Enhance 頁，尚未 Enhance 任何照片`;
const FAIL = '需要：讓批次中部分照片 AI Enhance 失敗的測試條件（伺服器故障或 RD 開關）；沒有的話記為 Blocked --as test-data。';
const NOTE_Q11 = '規格沒寫（Q-11）。';

const SECTION: Record<string, string> = {
  'Photo Picker': '照片挑選器', 'Entry': '入口', 'Batch Edit Room': 'Batch Edit Room 主畫面', 'Crop & Rotate': '裁切與旋轉',
  'Crop rules (Section 3)': '裁切規則（Section 3）', 'Adjustment': '調整', 'AI Enhance': 'AI Enhance',
  'AI Enhance failures': 'AI Enhance 失敗', 'Leaving Batch Edit': '離開 Batch Edit', 'Save': '存檔',
  'Batch Save page': 'Batch Save 頁', 'Android Back': 'Android 返回鍵',
};

// [Precondition, Action, Expected Result, Notes] in draft.csv order
const ZH: Record<string, [string, string, string, string?]> = {
  // ---------- 照片挑選器 ----------
  'TC-001': [`${PREM}；${GAL}`, '在 Launcher 點「Edit」', '開啟照片挑選器，上方有「Single」／「Batch」分頁，預設選在「Single」'],
  'TC-002': ['從「Edit」開啟照片挑選器，先前選過「Batch」分頁，再用 ‹ 關閉挑選器', '再點一次「Edit」（重新啟動 App 後也做一次）', '每次開啟挑選器都回到「Single」'],
  'TC-003': ['從「Edit」開啟的照片挑選器，在「Single」分頁', '點選一張照片', '開啟現有的單張 Edit Room，帶入該照片（完整 Edit Room 工具列，流程不變）'],
  'TC-004': ['從「Edit」開啟的照片挑選器，在「Single」分頁', '試著選第二張照片', '「Single」只能選一張（第一次點選就進入 Edit Room；不能多選）'],
  'TC-005': ['從「Edit」開啟的照片挑選器', '點「Batch」，查看分頁與底部列', '「Batch」分頁反白；底部列顯示已選張數／提示文字與「Done」', '文案為「Select 1 to 20 photos.」或「n selected (max 20)」（Q-1）；請記下選照片前後顯示的字串。'],
  'TC-006': [`${PREM}；${GAL}`, '在 Launcher 點「AI Enhance」捷徑', '開啟照片挑選器，上方有相同的「Single」／「Batch」分頁，預設選在「Single」'],
  'TC-007': ['照片挑選器在「Batch」分頁', '依序點選 3 張照片', '每張被選的縮圖顯示點選順序 1、2、3；底部列顯示已選 3 張與「Done」'],
  'TC-008': ['照片挑選器在「Batch」分頁，依序選了 A、B、C 三張', '點「Done」，查看 Batch Edit Room 的縮圖列', '縮圖列依點選順序排列 A、B、C（不是相簿順序）'],
  'TC-009': ['照片挑選器在「Batch」分頁，已選 3 張（1、2、3）', '再點一次第 2 張，取消選取', '第 2 張取消選取；記錄第 3 張是否重新編號為 2、張數是否變成 2', '規格沒寫取消選取（Q-13）。'],
  'TC-010': ['照片挑選器在「Batch」分頁，未選任何照片', '點「Done」', '記錄：「Done」為停用或沒有反應；不會在沒有照片時開啟 Batch Edit Room', '規格沒寫（Q-13）。'],
  'TC-011': [`照片挑選器在「Batch」分頁；${GAL}`, '選 20 張照片', '20 張都能選取（編號 1–20）；張數顯示 20', 'Android 與 iOS 一樣上限 20 張，不受平台較低的預設上限限制。'],
  'TC-012': ['照片挑選器在「Batch」分頁，已選 20 張', '點第 21 張照片', '第 21 張不會被選取，並跳出 toast「Please pick at most 20 photos.」；原本 20 張維持選取'],
  'TC-013': ['照片挑選器在「Batch」分頁，已選 20 張', '點「Done」', '開啟 Batch Edit Room，有 20 張縮圖'],
  'TC-014': ['從「Edit」開啟的照片挑選器在「Batch」分頁，只選 1 張（「1 selected (max 20)」）', '點「Done」', '開啟單張 Edit Room（不是 Batch Edit Room）'],
  'TC-015': ['從「AI Enhance」捷徑開啟的照片挑選器在「Batch」分頁，只選 1 張', '點「Done」', '照今天的單張流程開啟（不是 Batch Edit Room）'],
  'TC-016': ['從「Edit」開啟的照片挑選器，在「Batch」分頁已選 2 張', '點「‹」', '回到 Launcher'],
  'TC-017': ['從「AI Enhance」捷徑開啟的照片挑選器', '點「‹」', '回到 Launcher'],

  // ---------- 入口 ----------
  'TC-018': [`${PREM}；從「Edit」開啟的照片挑選器在「Batch」分頁，已選 12 張`, '點「Done」', '開啟 Batch Edit Room 主畫面（顯示第 1 張、縮圖列、「Crop & Rotate」／「Adjustment」／「AI Enhance」）'],
  'TC-019': [`${PREM}；從「AI Enhance」捷徑開啟的照片挑選器在「Batch」分頁，已選 3 張（「3 selected (max 20)」）`, '點「Done」', '直接開在 Batch Edit Room 的 AI Enhance 頁（「Enhance」按鈕、3 張照片的縮圖列）'],
  'TC-020': ['單張 Edit Room 已開啟一張照片，未編輯', '點 Replace photo，把挑選器切到「Batch」，選 3 張後點「Done」', '挑選器可以切到「Batch」分頁，「Done」開啟帶 3 張照片的 Batch Edit Room'],
  'TC-021': ['已開啟單張 Edit Room', '查看 Edit Room 每個工具分頁（Quick Action、Edit、Enhance、Portrait…）', 'Edit Room 本身沒有 Batch Edit 工具或入口'],
  'TC-022': ['在 Launcher', '在 Launcher（捷徑列與「View all」）尋找「Batch Editing」捷徑', '記錄是否有 Batch Editing 捷徑、點了會到哪裡', '「Entry: Launcher › Batch Editing shortcut」畫板沒有說明；D0-04 只列兩個挑選器（Q-2）。'],

  // ---------- Batch Edit Room 主畫面 ----------
  'TC-023': [ROOM, '查看主畫面', '外觀像 Edit Room；底部只有「Crop & Rotate」、「Adjustment」、「AI Enhance」三個按鈕，依此順序（沒有 Filter、Preset 或其他工具）'],
  'TC-024': [ROOM, '查看上方列', '左側為 Home 與 Replace photo；最右側為 Save（下載圖示，與 Edit Room 相同）與 Setting'],
  'TC-025': [ROOM, '點 Setting 按鈕', '記錄開啟了什麼；關閉後回到 Batch Edit Room，沒有任何變更', '規格沒寫 Setting 會到哪裡（Q-3）。'],
  'TC-026': [EDITED, '在照片上按住比較按鈕，再放開', '按住時顯示第 1 張原圖；放開後回到編輯後的樣子（與 Edit Room 相同）', '比較按鈕行為比照 Edit Room（Q-4）。'],
  'TC-027': [ROOM, '在縮圖列依序點第 5、12、1 張', '大圖切換成點選的照片；縮圖列反白目前那張'],
  'TC-028': [ROOM, '查看縮圖與縮圖列兩端；長按一張縮圖', '縮圖上沒有 ×、沒有移除選項，也沒有新增（+）按鈕：照片不能移除也不能新增'],
  'TC-029': [ROOM, '點「Crop & Rotate」', '在目前照片上開啟 Crop & Rotate room'],
  'TC-030': [`${PREM}；Batch Edit Room 共 12 張；第 1 張裁成 Square（✓），再把第 2 張裁成 3:2（✓）；目前在第 2 張`, '在主畫面點 Undo', '只有第 2 張回到未裁切；第 1 張仍是 Square'],
  'TC-031': ['承上，已按過 Undo', '切到第 1 張點 Undo，再點 Redo', 'Undo 讓第 1 張回到未裁切（第 2 張不受影響）；Redo 再變回 Square'],
  'TC-032': [`${ROOM}；在 Crop & Rotate room 把第 1 張設為 3:2 並點「All」，再把第 3 張旋轉 90°，然後按 ✓`, '回到主畫面，在第 3 張點一次 Undo', '第 3 張一步回到進 room 前的狀態（沒有 3:2、沒有旋轉）；其他照片仍是 3:2'],
  'TC-033': ['承上', '切到第 5 張，點一次 Undo', '第 5 張一步拿掉 3:2；第 3 張與其他照片不受這次 Undo 影響', 'Section 3「Undo」規則可能表示這裡一次 Undo 會退回全部照片（Q-9）：請記錄。'],
  'TC-034': [`${PREM}；Batch Edit Room 共 3 張，全部已 AI Enhance，回到主畫面，目前在第 2 張`, '點 Undo', '只有第 2 張回到 Enhance 前的樣子；第 1、3 張仍是 Enhance 後'],
  'TC-035': ['承上，第 2 張已 Undo', '點 Redo', '第 2 張再次顯示 Enhance 結果'],
  'TC-036': ['承上，第 2 張已 Undo（退回 Enhance）', '把第 2 張裁成 Square（✓），查看 Redo，再在第 2 張開啟 AI Enhance', 'Redo 已無法使用；第 2 張的 Enhance 結果拿不回來；AI Enhance 顯示「Enhanced」停用（第 2 張不能再 Enhance）'],

  // ---------- 裁切與旋轉 ----------
  'TC-037': [CROP, '查看 room', '與現行 Crop & Rotate room 相同（Rotate、Flip、Flip Vertically、Custom、Original、各比例、角度滑桿、✕／重設／undo／redo／✓）；panel 上方沒有 title bar；底部有批次縮圖列'],
  'TC-038': [CROP, '查看右上角', '有「Apply to all」按鈕：圖示加「All」，半透明深色膠囊底'],
  'TC-039': [CROP, '點 room 內縮圖列的縮圖', '目前照片切換成點選的那張'],
  'TC-040': [CROP, '在第 1 張選 3:2，點「All」', '每張照片都變成 3:2；畫面留在 room；跳出 toast「Applied to 11 photos」；縮圖列 12 張縮圖立即顯示裁切結果'],
  'TC-041': [`${PREM}；Batch Edit Room 共 3 張；已開啟 Crop & Rotate room`, '選 Square，點「All」', 'toast 顯示「Applied to 2 photos」（目前這張以外的張數）'],
  'TC-042': [`${CROP}；已套用 3:2 到全部`, '不做任何修改，再點一次「All」', '按鈕可以再按（一次性按鈕，不是會被關掉的開關）；toast 再出現一次；照片沒有變化'],
  'TC-043': [`${CROP}；已套用 3:2 到全部`, '切到第 4 張，選 Square', '只有第 4 張變成 Square；其他仍是 3:2'],
  'TC-044': [`${CROP}；已套用 3:2 到全部；第 4 張改成 Square`, '切到第 1 張，選 2:3，點「All」', '其他每張（含第 4 張）都從原圖重新裁成 2:3（第 4 張的 Square 被覆蓋）；縮圖列立即更新'],
  'TC-045': [CROP, '在第 1 張點一次 Rotate、點 Flip 與 Flip Vertically，再點「All」', '每張照片都以相同方式旋轉 90° 並水平、垂直翻轉'],
  'TC-046': [CROP, '把第 1 張的角度滑桿設為 +10°，點「All」', '每張照片都拉正相同的 +10°；每張的裁切框依自己的尺寸縮小，不會出現黑邊'],
  'TC-047': [`${CROP}；第 1 張為直圖、第 2 張為橫圖`, '在第 1 張選 2:3、旋轉 +5°，再點「All」；查看第 2 張', '第 2 張為 2:3、+5°，在旋轉後的照片內用自己的最大框，依相對位置規則擺放'],
  'TC-048': [SET4, '在 ① 選「Free」並拖曳裁切框，再點「All」', 'Free 框視為自訂比例並套用到其他照片（見下方 Free 相關案例）'],

  // ---------- 裁切規則（Section 3） ----------
  'TC-049': [SET4, '不點「All」，在 ④ 海景選 3:4（C1）', '只有 ④ 改變：3:4 最大框 1151×1535，高度貼滿、置中；①②③ 不變'],
  'TC-050': [SET4, '在 ① 手扶梯選 3:2，點「All」（C5）', '四張都是各自的 3:2 最大框，置中'],
  'TC-051': [SET4, '在 ④ 海景選 Square，把框拖到最左，點「All」（C6）', '④ 的框維持在最左；①②③ 套 1:1 時左右沒有移動空間，框置中'],
  'TC-052': [SET4, '在 ② 101 選 Square，把框拖到最下，點「All」（C7）', '① 手扶梯的最大正方框貼底（垂直位置有同步，值為 1）；④ 海景上下沒有空間，置中；③ 茶杯整張不裁', 'DR-07 寫預設置中；本案例依 Section 3 結論（Q-5）。'],
  'TC-053': [SET4, '在 ④ 海景選 Square，把框縮到 865×865 放右下，點「All」（C8）', '④ 維持 865×865 在右下；① 為 1706×1706 貼底；② 為 1576×1576 貼底；③ 茶杯整張不裁。其他張的框不會縮成約 56%（美圖才會）'],
  'TC-054': [SET4, '在 ④ 海景選 Square 並點「All」；查看 ③ 茶杯（C9）', '③ 茶杯（本來就是 1:1）不裁切：框等於整張'],
  'TC-055': [SET4, '在 ① 手扶梯選「Free」，把框拉成 1236×611 放左上，點「All」（C10）', '其他張套用相同約 2:1 比例、各自的最大框，放在左上（有空間的方向才移動）；不是各自寬度的 72%'],
  'TC-056': [`${SET4}；四張已用「All」設成 3:2`, '在任一張選「Original」並點「All」（C11）', '四張都回到各自原始比例，不裁切'],
  'TC-057': [SET4, '在 ④ 海景點「Custom」／鉛筆，輸入 3000 × 3000（C12）', '數值被拒並跳出 toast（PhD 文案，Q-6）；顯示的範圍為 238 – 2730 × 238 – 1535 px（這張照片的尺寸）', '美圖 toast 為「Width and height exceed the range」；PhD 文案未定（Q-6）。'],
  'TC-058': [SET4, '在 ④ 海景的像素輸入填 237 × 237', '跳出超出範圍的 toast（下限 238 px）'],
  'TC-059': [SET4, '在 ④ 海景的像素輸入填 1000 × 500，再點「All」', '④ 裁成 1000×500；其他張套用 2:1 比例、各自的最大框（不是 1000×500 px）'],
  'TC-060': [`${SET4}；已用「All」套 Square，再存檔`, '比較存出檔案的像素尺寸', '每張尺寸不同（各依原圖計算：例如 1706×1706、1576×1576、865 或更大…）；這是預期行為'],
  'TC-061': [`${SET4}；已用「All」套 Square；再把 ① 單獨裁成 2:3`, '在 ④ 選 3:2，點「All」', '① 從原圖重新計算成自己的 3:2 最大框；原本單獨的 2:3 裁切被覆蓋'],

  // ---------- 裁切與旋轉：undo、✕、✓ ----------
  'TC-062': [CROP, '選 3:2 並點「All」，再點一次 Undo', '12 張照片一步一起回到未裁切'],
  'TC-063': [`${CROP}；已套用 3:2 到全部後又 Undo`, '點一次 Redo', '第 1 張與其他 11 張一起恢復 3:2'],
  'TC-064': [`${CROP}；已套用 3:2 到全部；再把第 4 張改成 Square`, '切到第 7 張，點 Undo', '只有第 4 張回到 3:2，room 自動切到第 4 張（縮圖列同步選取）；第 7 張不變'],
  'TC-065': ['承上，已按過該次 Undo', '再點一次 Undo', '「Apply to all」這一步在全部照片上一起退回'],
  'TC-066': [`${CROP}；第 1 張已旋轉、第 2 張已翻轉`, '在第 1、2、5 張之間切換數次，再點兩次 Undo', '切換後歷史仍在：第一次 Undo 退回第 2 張的翻轉（切到第 2 張），第二次退回第 1 張的旋轉（切到第 1 張）'],
  'TC-067': [`${CROP}；已套用 3:2 到全部，再把第 4 張改成 Square`, '點 ✕', '回到 Batch Edit Room；每張照片都回到進 room 前的狀態（沒有 3:2、沒有 Square）'],
  'TC-068': [`${CROP}；已套用 3:2 到全部`, '點 ✓', '回到 Batch Edit Room；每張照片都保留 3:2'],

  // ---------- 調整 ----------
  'TC-069': [ROOM, '點「Adjustment」', '在目前照片上開啟 Adjustment room'],
  'TC-070': [ADJ, '查看 room：Light／Color／Details 分頁與每個工具', '與 26\'10/E Adjustment room 相同；沒有 Subject Detection、沒有 AI Exposure；右上有「Apply to all」（圖示加「All」，半透明深色膠囊）；底部有批次縮圖列'],
  'TC-071': [ADJ, '在第 1 張設 Exposure +20，點「All」', '畫面留在 room；跳出 toast「Applied to 11 photos」；每張縮圖都顯示變亮的結果'],
  'TC-072': [`${ADJ}；已套用 Exposure +20 到全部`, '切到第 3 張，設 Contrast +10', '只有第 3 張有 Contrast +10'],
  'TC-073': [`${ADJ}；已套用 Exposure +20 到全部；第 3 張 Contrast +10`, '切到第 1 張，改 Exposure +30 並點「All」', '其他每張都變成和第 1 張完全相同的設定（Exposure +30）；第 3 張的 Contrast +10 不保留'],
  'TC-074': [ADJ, '在第 1 張設 Exposure +20（Light）、Saturation（Color）、Sharpness（Details），再點「All」', '三個分頁的數值整組套用到每張照片'],
  'TC-075': [`${ADJ}；已套用 Exposure +20 到全部`, '不做修改，再點一次「All」', '可以再按（一次性按鈕，不是勾選框）；toast 再出現；沒有變化'],
  'TC-076': [`${ADJ}；已套用 Exposure +20 到全部`, '點一次 Undo', '12 張照片一起拿掉 Exposure +20'],
  'TC-077': [`${ADJ}；已套用 Exposure +20 到全部，再在第 3 張設 Contrast +10`, '切到第 6 張，點 Undo', '只退回第 3 張的 Contrast +10，room 自動切到第 3 張（縮圖列跟著選取）；再點 Redo 會加回來'],
  'TC-078': [`${ADJ}；第 1 張 Exposure +20、第 2 張 Contrast +10`, '切換照片數次，再點兩次 Undo', '切換後歷史仍在：Undo 先拿掉第 2 張的 Contrast，再拿掉第 1 張的 Exposure'],
  'TC-079': [`${ADJ}；第 1 張先 Exposure +20（Light），再 Saturation +10（Color）；目前顯示 Details 分頁`, '點兩次 Undo', '兩個數值都退回，但分頁停在 Details（不會自動切換分頁）'],
  'TC-080': [`${ADJ}；已套用 Exposure +20 到全部，第 3 張 Contrast +10`, '點 ✕', '回到 Batch Edit Room；每張照片都回到進 room 前的狀態'],
  'TC-081': [`${ADJ}；已套用 Exposure +20 到全部`, '點 ✓，再在主畫面第 4 張點 Undo', '回到 Batch Edit Room 時全部保留 +20；Undo 只把第 4 張這次 room 的修改一步退回'],
  'TC-082': [`${FREE}；Batch Edit Room 共 5 張`, '用「All」裁成 3:2（✓），再用「All」設 Exposure +20（✓）', '兩者都能使用，不會跳 IAP 頁也不扣點'],

  // ---------- AI Enhance ----------
  'TC-083': [ROOM, '點「AI Enhance」', '開啟 AI Enhance 頁：只有一顆「Enhance」按鈕與「Maximize detail and clarity with advanced AI.」，沒有 Standard／Advanced 分頁，沒有 scenario 或 Scene Presets，按鈕上方有縮圖列', '設計稿寫「detaill」（Q-10）：App 若拼錯屬文案 bug。'],
  'TC-084': [ENH, '查看「Enhance」按鈕與點數膠囊；記下點數餘額', '按鈕上沒有顯示點數'],
  'TC-085': [ENH, '點按鈕上方的縮圖', '目前照片切換'],
  'TC-086': [`${ENH}；共 12 張`, '點「Enhance」', '開啟確認對話框：「Enhance 12 photos?」、「Processing takes a moment and cannot be canceled once started.」、「Cancel」、「Start」；不顯示點數'],
  'TC-087': ['已開啟確認對話框', '點「Cancel」', '回到 AI Enhance 頁；沒有處理任何照片'],
  'TC-088': ['在確認對話框按過「Cancel」', '再點一次「Enhance」', '確認對話框再次出現（每次都會跳）'],
  'TC-089': [`${ENH}；共 12 張`, '點「Enhance」›「Start」並觀察畫面', 'loading 畫面顯示「Creating Your AI Image」與「Enhancing k / 12」並逐步增加；遮罩蓋住整個畫面，縮圖列在遮罩下方'],
  'TC-090': ['批次 Enhance 處理中', '點「Crop & Rotate」、「Adjustment」、縮圖與 Save', '全部做完之前都沒有反應（不能切換、不能存檔）'],
  'TC-091': ['批次 Enhance 處理中', '尋找取消／✕ 按鈕', '沒有；處理無法取消'],
  'TC-092': [`${ENH}；共 12 張，全部成功；記下點數餘額`, '等批次做完', '每張都顯示 Enhance 結果（不用逐張 ✓）；縮圖列也顯示；按鈕變成「Enhanced」停用；點數餘額不變'],
  'TC-093': [`${ENH}；共 12 張；已記下點數餘額`, '批次 Enhance 做到完，再比較餘額', '沒有扣點', '是否收點數是 PM 待決事項（Q-7）。'],
  'TC-094': [`${ENH}；共 20 張`, '計時：從「Start」到最後一張結果', '張數穩定前進；記錄總時間；動畫進行中不可停滯超過 10 秒', 'Rule 2 等待門檻。'],
  'TC-095': [`${ENH}；第 1 張也另外在單張 Edit Room 用 AI Enhance Standard · Portrait 做過`, '批次 Enhance 後，比較第 1 張與單張 room 的結果', '批次結果與 Standard · Portrait 一致', '可用 log 確認送出的模式。'],
  'TC-096': [`${ENH}；共 12 張；一次批次有 3 張失敗後，總結顯示「9 completed, 3 failed」`, '點「Retry Failed (3)」，若出現確認對話框請看文字，再看 loading 張數', '只計算尚未 Enhance 的 3 張：「Enhance 3 photos?」（若有對話框）與「Enhancing k / 3」；已 Enhance 的 9 張不算進 N', `${FAIL}規格沒寫 Retry 是否先確認；請記錄。`],
  'TC-097': [`${PREM}；Batch Edit Room 共 3 張全部已 Enhance；第 2 張在主畫面 Undo 退回 Enhance`, '開啟 AI Enhance', '按鈕維持「Enhanced」灰掉；第 2 張不能再 Enhance'],
  'TC-098': [`${FREE}；Batch Edit Room 共 5 張；在 AI Enhance 頁`, '點「Enhance」', '直接開啟既有的 Premium IAP 頁（沒有確認對話框、沒有試做一張、沒有處理任何照片）'],
  'TC-099': [`${FREE}；從批次 AI Enhance 跳出的 Premium IAP 頁`, '用 ✕ 關閉 IAP 頁', '回到 AI Enhance 頁，沒有照片被 Enhance', '既有 IAP 頁；請記錄 ✕ 回到哪裡。'],
  'TC-100': [`${ENH}；Enhance 已完成`, '點 ✕', '回到 Batch Edit Room 主畫面，Enhance 結果保留'],

  // ---------- AI Enhance 失敗 ----------
  'TC-101': [`${ENH}；共 15 張；設定其中 3 張失敗`, '讓批次跑完', '不會逐張跳對話框；跑完後一次總結「12 completed, 3 failed」「Failed photos are marked on the thumbnails.」；只有 3 張失敗的縮圖右上角有紅色 !；按鈕為「Retry Failed (3)」', `${FAIL}文案可能多了「with !」（流程畫面版本）：請記錄。`],
  'TC-102': ['已顯示部分失敗的總結', '點一張失敗的縮圖', '目前照片切換到那張失敗的照片', FAIL],
  'TC-103': ['部分失敗總結「12 completed, 3 failed」；重試時 3 張中有 2 張會成功', '點「Retry Failed (3)」（若出現對話框再點「Start」）', '只處理 3 張失敗的照片（張數 k / 3）；成功的 12 張不重做；接著顯示「14 completed, 1 failed」與「Retry Failed (1)」；重試成功的 2 張 ! 消失', FAIL],
  'TC-104': ['總結「14 completed, 1 failed」；最後一張再次失敗', '點「Retry Failed (1)」', '總結仍以整批計算：「14 completed, 1 failed」，該張 ! 保留，再次顯示「Retry Failed (1)」', FAIL],
  'TC-105': ['總結「14 completed, 1 failed」；最後一張重試會成功', '點「Retry Failed (1)」', '15 張全部完成：失敗訊息與 Retry 按鈕消失；按鈕變成「Enhanced」'],
  'TC-106': [`${ENH}；共 15 張`, '開始批次，約做完 8 張時關掉 Wi-Fi 與行動數據', '已完成的保留；沒做完的標紅色 !；訊息為「8 completed, 7 failed」（依實際張數）與「Connection lost. Check your connection and retry.」；按鈕為「Retry Failed (7)」', '手機接 USB 後可切換 Wi-Fi（AGENTS.md）。'],
  'TC-107': ['已顯示斷網總結，仍未連網', '點「Retry Failed (x)」', '跳出 toast「No internet connection」，不開始處理'],
  'TC-108': ['已顯示斷網總結；網路已恢復', '點「Retry Failed (x)」', '只處理沒做完的照片；之後總結依整批更新'],
  'TC-109': [`${ENH}；共 15 張；設定 2 張失敗；結束前斷網`, '讓批次結束', '失敗與沒做完的照片合併計入「X completed, Y failed」；第二行顯示「Connection lost. Check your connection and retry.」（不是縮圖提示）', FAIL],
  'TC-110': [`${ENH}；共 12 張`, '處理中按 Home（App 切到背景）30 秒後再回來', '離開期間暫停，回來後從原處繼續，正常做完'],
  'TC-111': [`${ENH}；共 12 張；部分已 Enhance`, '處理中或處理後（存檔前）從最近使用清單滑掉 App，再重新開啟', 'Batch Edit Room 不見（不會還原）；已完成的 Enhance 結果沒有留在任何地方（相簿、My AI Artwork）'],
  'TC-112': [`${PREM}；Batch Edit Room 共 3 張，已 Enhance 並存檔`, '開啟 My AI Artwork', '批次 Enhance 結果不在 My AI Artwork（Standard 結果不會存到那裡）'],

  // ---------- 離開 Batch Edit ----------
  'TC-113': [ROOM, '點 Home', '直接回到 Launcher，不跳對話框'],
  'TC-114': [ROOM, '點 Replace photo', '直接回到照片挑選器的「Batch」分頁，12 張仍為選取狀態（編號保留），不跳對話框'],
  'TC-115': [EDITED, '點 Home', '跳出 Discard 對話框：「Discard changes?」、「Your edits to these photos will be lost.」、「Discard」、「Keep Editing」'],
  'TC-116': [`${EDITED}；已從 Home 開啟 Discard 對話框`, '點「Discard」', '回到 Launcher；沒有存任何東西'],
  'TC-117': [EDITED, '點 Replace photo，再點「Discard」', '開啟照片挑選器的「Batch」分頁，12 張仍為選取；按「Done」開啟的 Batch Edit Room 每張都未編輯（第 1 張不再是 Square）'],
  'TC-118': [`${EDITED}；已開啟 Discard 對話框`, '點「Keep Editing」', '留在 Batch Edit Room；第 1 張仍是 Square，Undo 仍可用'],
  'TC-119': [`${EDITED}；Replace photo ›「Discard」› 照片挑選器在「Batch」分頁`, '取消選取 2 張、新選 3 張，點「Done」', '開啟 Batch Edit Room，照片為新的選取，依點選順序排列'],
  'TC-120': [`${PREM}；Batch Edit Room 共 3 張，只做過 AI Enhance`, '點 Home', '跳出 Discard 對話框（Enhance 也算編輯）', '規格寫「做過編輯」；若只做 Enhance 時沒有詢問，請記錄。'],
  'TC-121': [EDITED, '從最近使用清單滑掉 App 再重新開啟', 'Batch Edit Room 不會還原（規格沒寫批次有「Continue editing?」）；記錄 App 顯示什麼', '規格只寫 Enhance 的情況（D1-05）；請記錄。'],

  // ---------- 存檔 ----------
  'TC-122': [`${PREM}；Batch Edit Room 共 20 張，5 張有編輯、15 張未編輯；記下相簿張數`, '點 Save', '顯示「Saving k / 20」與「Please do not leave this page or quit the app.」及進度條；k 逐步增加；全部存完才開啟 Batch Save 頁'],
  'TC-123': ['20 張存檔中', '計時：從 Save 到 Batch Save 頁', '記錄時間；進度條移動中不可停滯超過 10 秒', 'Rule 2 等待門檻。'],
  'TC-124': ['存檔中', '按 Home（切到背景）10 秒後回來', '記錄：存檔繼續或恢復，最後到 Batch Save 頁且每張都已存', '規格只要求使用者不要離開；請記錄。'],
  'TC-125': ['剛存完 20 張的批次', '開啟手機相簿', '有 20 個今天日期的新檔；20 張原圖仍在且未改變'],
  'TC-126': ['剛存完 20 張（5 張有編輯、15 張未編輯）', '計算新檔數量', '20 張輸入照片全部存成新檔，包含 15 張未編輯的'],
  'TC-127': [`${PREM}；Batch Edit Room 共 12 張，AI Enhance 處理中`, '點 Save', 'Enhance 完成前不會開始存檔'],

  // ---------- Batch Save 頁 ----------
  'TC-128': ['剛存完 12 張的批次', '查看頁面', '12 張存檔照片的縮圖格狀與「Saved 12 photos」；左上「‹」、右上 Home、底部固定「Edit Next Batch」；沒有 Video 分頁、沒有「Turn it to video」'],
  'TC-129': ['Batch Save 頁有 12 張', '點幾張縮圖', '不會開啟任何東西（沒有全螢幕檢視）'],
  'TC-130': ['Batch Save 頁', '把格狀捲到底', '捲動時「Edit Next Batch」固定在底部'],
  'TC-131': ['存完一批有編輯的照片後的 Batch Save 頁', '點「‹」', '回到 Batch Edit Room', '請記錄編輯是否還在、再按一次 Save 是否會再存一組新檔（Q-14）。'],
  'TC-132': ['Batch Save 頁', '點 Home', '回到 Launcher'],
  'TC-133': ['Batch Save 頁', '點「Edit Next Batch」', '開啟照片挑選器的「Batch」分頁，沒有選任何照片'],
  'TC-134': ['由「Edit Next Batch」開啟的照片挑選器', '點「‹」', '回到 Launcher，不是回到 Batch Save 頁'],
  'TC-135': [`${FREE}；IAP flyer／廣告頻率依測試帳號`, '存一批 5 張', 'IAP flyer 與廣告照一般存檔後的方式出現（不多也不少）'],
  'TC-136': [`${PREM}；RD 提供評分對話框的觸發次數（n 次存檔）`, '存 n 批，每批數張', '評分對話框把每一批算成一次存檔（存 n 批後出現，不是 n 張）', '需要：RD 提供評分觸發次數。'],

  // ---------- Android 返回鍵 ----------
  'TC-137': ['從「Edit」開啟的照片挑選器在「Batch」分頁，已選 2 張', '按系統返回鍵', '與「‹」相同：回到 Launcher'],
  'TC-138': [ROOM, '按系統返回鍵', '記錄：離開到 Launcher（同 Home）或挑選器（同 Replace photo），不跳對話框', '規格沒寫這裡的返回鍵（Q-11）。'],
  'TC-139': [EDITED, '按系統返回鍵', '跳出 Discard 對話框（編輯不會被默默丟掉）；記錄「Discard」之後到哪裡', NOTE_Q11],
  'TC-140': [`${CROP}；已套用 3:2 到全部`, '按系統返回鍵', '與 ✕ 相同：回到 Batch Edit Room，這次 room 的變更丟掉', NOTE_Q11],
  'TC-141': [`${ADJ}；已套用 Exposure +20 到全部`, '按系統返回鍵', '與 ✕ 相同：回到 Batch Edit Room，這次 room 的變更丟掉', NOTE_Q11],
  'TC-142': [`${ENH}；Enhance 已完成`, '按系統返回鍵', '與 ✕ 相同：回到 Batch Edit Room，結果保留'],
  'TC-143': ['批次 Enhance 處理中', '按系統返回鍵', '處理不會被中斷或取消；畫面仍在遮罩下'],
  'TC-144': ['已開啟確認對話框', '按系統返回鍵', '與「Cancel」相同：對話框關閉，不處理任何照片'],
  'TC-145': [`${EDITED}；已開啟 Discard 對話框`, '按系統返回鍵', '與「Keep Editing」相同：留在 Batch Edit Room，編輯保留', NOTE_Q11],
  'TC-146': ['存檔中', '按系統返回鍵', '存檔不會被中斷；接著開啟 Batch Save 頁', NOTE_Q11],
  'TC-147': ['Batch Save 頁', '按系統返回鍵', '與「‹」相同：回到 Batch Edit Room'],
  'TC-148': ['由「Edit Next Batch」開啟的照片挑選器', '按系統返回鍵', '回到 Launcher，不是 Batch Save 頁'],
  'TC-149': [`${SET4}；像素輸入已開啟、鍵盤已跳出`, '按兩次系統返回鍵', '第一次收起鍵盤；第二次關閉像素輸入，不套用數值'],
};

const rows = readTable(join(HERE, 'draft.csv'));
const missing = rows.filter(r => !ZH[r.ID]).map(r => r.ID);
const extra = Object.keys(ZH).filter(id => !rows.some(r => r.ID === id));
if (missing.length || extra.length) throw new Error(`translation out of step with draft.csv: missing ${missing.join(', ')}; extra ${extra.join(', ')}`);
// a row's English notes and the Chinese ones must both be there or both be empty
const noteGap = rows.filter(r => !!r.Notes !== !!(ZH[r.ID][3] ?? '')).map(r => r.ID);
if (noteGap.length) throw new Error(`Notes present in only one language: ${noteGap.join(', ')}`);

const HEAD = ['編號', '區塊', '前置條件', '操作步驟', '預期結果', '優先度', '規格對應', '備註', '變更', '變更原因'];
const CHANGE: Record<string, string> = { new: '新增', modified: '修改', removed: '移除', unchanged: '未變更' };
const ZH_REASON: Record<string, string> = { 'New table (REQ-001)': '新表（REQ-001）' };
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
