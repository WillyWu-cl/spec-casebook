// Builds requirements.md and draft.csv for phd/my-ai-artwork-category-list (My AI Artwork ☰ All categories, 11/E,
// spec set 2026-11-11). Same script in the iOS and Android draft folders; the platform comes from the folder path.
// Run: node library/phd/my-ai-artwork-category-list/<platform>/drafts/<id>/build-draft.ts
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DRAFT_COLUMNS, writeTable } from '../../../../../../scripts/lib/library.ts';

const DIR = dirname(fileURLToPath(import.meta.url));
const PLATFORM = /[\\/]android[\\/]/.test(DIR) ? 'android' : 'ios';
const ANDROID = PLATFORM === 'android';

// ---------------------------------------------------------------- requirements
type Req = [id: string, src: string, text: string, platform?: 'android' | 'ios'];
const sections: [string, Req[]][] = [];
const sec = (name: string, reqs: Req[]) => sections.push([name, reqs.filter(r => !r[3] || r[3] === PLATFORM)]);

sec('Entry and tab bar', [
  ['R-001', 'PM:pm-entry-flow; PM:pm-recent', 'My AI Artwork opens on 「Recent」, the first tab, as today (「預設落在 Recent（第一個 tab）」).'],
  ['R-002', 'PM:pm-overview; PM:pm-recent; PM:pm-entry-flow', 'The tab bar has a ☰ button fixed at its far right (「tab 列最右邊固定 ☰」): it stays at the right edge while the tabs are scrolled and whichever tab is selected.'],
  ['R-003', 'PM:pm-recent', 'The tab bar itself is unchanged: 「Recent」 first, every other tab in alphabetical order.'],
  ['R-004', 'PM:pm-recent; Req: REQ-006', 'Tabs of features with no works are still shown in the tab bar, and such an empty tab shows 「Nothing yet.」 and 「Start to Create」; 「Create More」 shows only on a tab with works (the spec\'s 「有 Create More」 corrected by REQ-006).'],
  ['R-005', 'PM:pm-recent; PM:pm-overview', 'The Recent list, the 「Photo」 / 「Video」 filter and 「Select」 work as today (the 8/E Recent spec, 「26 8E Recent」), i.e. as the app behaves now (Q-1 answered, REQ-003); Recent gets no list / grid switch (not done, manager decision 10/27).'],
]);
sec('All categories sheet', [
  ['R-010', 'PM:pm-entry-flow; PM:pm-all-categories; PM:pm-overview', 'Tapping ☰ opens a sheet titled 「All categories」 (with ✕) over My AI Artwork.'],
  ['R-011', 'PM:pm-all-categories', 'The sheet\'s rows are exactly the tab bar\'s tabs (「項目跟 tab 列一模一樣」): the same tabs with the same names, none missing and none extra.'],
  ['R-012', 'PM:pm-all-categories', 'The rows are in the tab bar\'s order: 「Recent」 first, the others in alphabetical order.'],
  ['R-013', 'PM:pm-header; PM:pm-overview', 'The sheet lists every feature (today 「20 幾個 tab」, more than 20), so each one can be reached from it without scrolling the tab bar; the list scrolls down to the last feature.'],
  ['R-014', 'PM:pm-all-categories; PM:pm-overview; PM:pm-draft', 'Rows show the feature name only: no work count this version (the server API gives no count, RD 10/28), and no count on the tabs either.'],
  ['R-015', 'PM:pm-all-categories; PM:pm-overview', 'Rows of features with no works look like every other row (「沒作品的也不灰字」): not greyed.'],
  ['R-016', 'PM:pm-all-categories', 'The row of the current tab is highlighted in peach; the other rows are not.'],
  ['R-017', 'PM:pm-overview', 'Not in this version (manager decision 10/27): no Expiring list, no search, no favourites in My AI Artwork or the sheet.'],
]);
sec('Choosing a category', [
  ['R-020', 'PM:pm-entry-flow; PM:pm-all-categories; PM:pm-overview', 'Tapping a row closes the sheet and switches My AI Artwork to that tab, the same as tapping that tab today (「切到該分類的 tab（同 今天）」): the tab is selected in the tab bar and its works are shown; a tab chosen from the sheet is scrolled into view in the tab bar (Q-6 answered, REQ-003).'],
  ['R-021', 'PM:pm-all-categories', 'Tapping the row of a feature with no works also closes the sheet and switches to that feature\'s empty tab.'],
  ['R-022', 'PM:pm-all-categories', 'Tapping the current tab\'s row (「點任一列」) closes the sheet and stays on that tab.'],
  ['R-023', 'PM:pm-all-categories; PM:pm-draft', 'Tapping a row while works are selected in multi-select (「Select」) switches to that tab and cancels the selection (「多選中點 → 切過去並取消選取」): multi-select ends (Q-5 answered, REQ-003).'],
  ['R-025', 'PM:pm-draft', 'Switching to another tab in the tab bar while works are selected in multi-select also goes to that tab and cancels the selection (draft 「選取狀態」: 「倘若用戶多 select 時切換 tab/category, 會帶他到目的並取消選取」, 「多選的行為比照現行」).'],
  ['R-024', 'PM:pm-overview', 'The sheet takes the user straight to old works that are hard to find in the tab bar, e.g. 「AI Art」 (QA ticket PHI262609-0006).'],
]);
sec('Closing the sheet', [
  ['R-030', 'PM:pm-entry-flow; PM:pm-all-categories', 'The sheet\'s ✕ closes it without changing the tab (Q-3 answered, REQ-003).'],
  ['R-031', 'PM:pm-entry-flow', 'The sheet draws a grabber over a dimmed page: dragging it down or tapping the dimmed page closes the sheet without changing the tab (Q-3 answered, REQ-003).'],
  ['R-032', 'PM:pm-all-categories', 'Android system Back with the sheet open closes the sheet only and stays on My AI Artwork on the same tab (Q-3 answered, REQ-003).', 'android'],
]);
sec('No charge', [
  ['R-040', 'PM:pm-overview', 'The feature is pure UX and free (「純 UX，不收費」): opening the sheet and choosing a category asks for no upgrade and charges no credits, for a free and a paid user.'],
  ['R-041', 'PM:pm-overview', 'The feature ships on iOS and Android at the same time (「iOS + Android 同時」). — NOT TESTABLE: release scheduling; each platform has its own table.'],
]);
sec('Entry from a feature', [
  ['R-060', 'KB: KP-026; PM:pm-all-categories', 'Opening My AI Artwork from a feature\'s History button lands on that feature\'s tab, and the sheet then highlights that feature\'s row in peach.', 'android'],
]);
sec('Tracking events', [
  ['R-050', 'PM:pm-overview', 'Opening the sheet sends 「Artwork_FeatureList_Appear」 with from_tab = the tab it was opened from.'],
  ['R-051', 'PM:pm-overview', 'Choosing a category in the sheet sends 「Artwork_Category_Select」 with category = the chosen feature and source = sheet.'],
  ['R-052', 'PM:pm-overview', 'Tapping a tab in the tab bar sends 「Artwork_Category_Select」 with category = that feature and source = tab.'],
]);

// ---------------------------------------------------------------- rows
type Row = Record<string, string>;
const rows: Row[] = [];
let n = 0, section = '';
const S = (name: string) => { section = name; };
const R = (pre: string, action: string, expected: string, pri: string, ref: string, notes = '', only?: 'android' | 'ios') => {
  n++;
  if (only && only !== PLATFORM) return;
  rows.push({ ID: `TC-${String(n).padStart(3, '0')}`, Section: section, Precondition: pre, Action: action, 'Expected Result': expected,
    Priority: pri, 'Spec Ref': ref, Notes: notes, Change: 'unchanged', 'Change Reason': '' });
};
// a row added after v1 takes an explicit ID and sits after the row it extends (REQ-033); n is not advanced
const RX = (rid: string, pre: string, action: string, expected: string, pri: string, ref: string, notes: string, reason: string) =>
  rows.push({ ID: rid, Section: section, Precondition: pre, Action: action, 'Expected Result': expected, Priority: pri, 'Spec Ref': ref, Notes: notes, Change: 'unchanged', 'Change Reason': '' });
const id = (k: number) => `TC-${String(k).padStart(3, '0')}`;

const PHONE = ANDROID ? 'Android phone, PhotoDirector signed in' : 'iPhone, PhotoDirector signed in';
const OPEN = ANDROID ? 'My AI Artwork (Launcher › AI Photos › My Artwork, top right)' : 'My AI Artwork';
const WORKS = 'works saved under at least three features, among them 「AI Art」 and 「AI Creative Studio」';
const BASE = `${PHONE}; ${WORKS}`;
const ON = (tab: string) => `${BASE}; ${OPEN} open on the 「${tab}」 tab`;
const SHEET = (tab: string) => `${ON(tab)}; ☰ tapped, 「All categories」 open`;
const PAID = ANDROID ? 'VIP' : 'Pro';

S('Entry and tab bar');
R(BASE, `Open ${OPEN}`, 'The page opens on 「Recent」, the first tab, shown selected (peach); the tab bar ends with a ☰ button at its far right', 'P1', 'R-001, R-002');
R(ON('Recent'), '1. Swipe the tab bar left until its last tab shows\n2. Tap the last tab', 'While the tabs scroll, ☰ stays fixed at the right edge of the tab bar; after the tap the last tab is selected and ☰ is still at the far right', 'P2', 'R-002');
R(ON('Recent'), 'Read the tab bar from the first tab to the last (swipe it left)', '「Recent」 is first and every other tab follows in alphabetical order (A → Z); tabs of features with no works are among them', 'P2', 'R-003, R-004', 'Write down the tab list: TC-007 compares the sheet with it');
R(`${ON('Recent')}; a feature with no works (its tab holds nothing)`, 'Tap that feature\'s tab in the tab bar', 'The empty tab opens and shows 「Nothing yet.」 and 「Start to Create」; the tab is not greyed in the tab bar', 'P2', 'R-004', 'REQ-006: 「Create More」 shows only on a tab with works');
R(`${ON('Recent')}; Recent holds photos and videos`, '1. Tap 「Video」\n2. Tap 「Photo」\n3. Tap 「Select」\n4. Tap 「Cancel」', 'As before the change: 「Video」 shows only videos, 「Photo」 only photos; 「Select」 starts multi-select and 「Cancel」 ends it. Recent shows the list as before, with no list / grid switch', 'P2', 'R-005, R-017', 'Q-1 answered (REQ-003): 「as today」 = the current behaviour of the app');

S('All categories sheet');
R(ON('Recent'), 'Tap ☰ at the far right of the tab bar', 'A sheet titled 「All categories」 with ✕ at its top right opens over the dimmed page; its first row is 「Recent」', 'P1', 'R-010');
R(`${SHEET('Recent')}; the tab list from TC-003 written down`, 'Read every row from top to bottom (scroll the list)', 'The rows are the same tabs as the tab bar, with the same names, none missing and none extra, in the same order: 「Recent」 first, the others alphabetical (A → Z)', 'P1', 'R-011, R-012', 'Q-4 answered (REQ-003): order checked in the English UI only');
R(SHEET('Recent'), 'Scroll the list to the end', 'The list scrolls to its last row, which is the last tab of the tab bar; every feature has a row', 'P2', 'R-013');
R(`${SHEET('Recent')}; at least one feature with no works`, 'Look at the rows of a feature with works and of one with no works', 'Each row shows only the feature name, with no count of works; the row of the feature with no works has the same text colour as the others (not greyed)', 'P2', 'R-014, R-015');
R(SHEET('Recent'), 'Look at the 「Recent」 row and the rows below it', 'Only 「Recent」 is highlighted in peach; no other row is highlighted', 'P2', 'R-016');
R(ON('AI Art'), 'Tap ☰', 'In 「All categories」 the 「AI Art」 row is highlighted in peach; 「Recent」 and the other rows are not', 'P2', 'R-016');
R(SHEET('Recent'), '1. Look over the sheet\n2. Close it with ✕\n3. Look over the page and its tabs', 'There is no search field, no favourite (star) control and no Expiring list in the sheet or on the page, and no tab shows a count', 'P3', 'R-014, R-017');

S('Choosing a category');
R(SHEET('Recent'), 'Tap 「AI Creative Studio」', 'The sheet closes and My AI Artwork switches to the 「AI Creative Studio」 tab: the tab is selected (peach underline) and in view in the tab bar, and its works are shown', 'P1', 'R-020');
R(SHEET('Recent'), 'Tap 「AI Art」', 'The sheet closes on the 「AI Art」 tab, which shows the AI Art works, old ones included (no tab-bar swiping needed)', 'P1', 'R-020, R-024', 'The problem of QA ticket PHI262609-0006');
R(ON('Recent'), '1. Tap the 「AI Art」 tab in the tab bar\n2. Note what it shows (works, filter, scroll position at the top)\n3. Tap the 「Recent」 tab\n4. Tap ☰\n5. Tap 「AI Art」', 'Choosing 「AI Art」 in the sheet shows the same tab, works and filter state as tapping the tab did (「同今天」)', 'P2', 'R-020');
R(`${SHEET('Recent')}; a feature with no works`, 'Tap that feature\'s row', 'The sheet closes and the page switches to that feature\'s empty tab, which shows 「Nothing yet.」 and 「Start to Create」', 'P2', 'R-021, R-004', 'REQ-006');
R(`${SHEET('AI Art')}`, 'Tap 「AI Art」 (the highlighted row)', 'The sheet closes and the page stays on the 「AI Art」 tab', 'P3', 'R-022');
R(SHEET('AI Art'), 'Tap 「Recent」', 'The sheet closes and the page is back on 「Recent」, selected in the tab bar', 'P2', 'R-020');
R(ON('AI Creative Studio'), '1. Tap 「Select」\n2. Select two works\n3. Tap ☰\n4. Tap 「AI Art」\n5. Tap the 「AI Creative Studio」 tab', 'Step 4: the sheet closes on the 「AI Art」 tab and the selection is cancelled (no work selected, multi-select ended: no 「Cancel」, no bottom action bar). Step 5: the two works are no longer selected', 'P2', 'R-023', 'Q-5 answered (REQ-003): multi-select ends');
RX('TC-032', ON('AI Creative Studio'), '1. Tap 「Select」\n2. Select two works\n3. Tap the 「AI Art」 tab in the tab bar\n4. Tap the 「AI Creative Studio」 tab', 'Step 3: the page switches to the 「AI Art」 tab and the selection is cancelled (no work selected, multi-select ended: no 「Cancel」, no bottom action bar). Step 4: the two works are no longer selected', 'P2', 'R-025', 'Figma draft section 「選取狀態」 (REQ-004)', 'Figma draft: switching tab during multi-select cancels the selection (R-025, REQ-004)');
R(SHEET('Recent'), 'Tap the last row of the list', 'The sheet closes on that tab, which is selected and scrolled into view at the end of the tab bar', 'P3', 'R-020', 'Q-6 answered (REQ-003)');

S('Closing the sheet');
R(SHEET('AI Art'), 'Tap ✕', 'The sheet closes; the page is still on the 「AI Art」 tab, unchanged', 'P2', 'R-030', 'Q-3 answered (REQ-003)');
R(SHEET('AI Art'), 'Drag the sheet down by its grabber', 'The sheet closes; the page is still on the 「AI Art」 tab', 'P3', 'R-031', 'Q-3 answered (REQ-003)');
R(SHEET('AI Art'), 'Tap the dimmed page above the sheet', 'The sheet closes; the page is still on the 「AI Art」 tab', 'P3', 'R-031', 'Q-3 answered (REQ-003)');
R(SHEET('AI Art'), 'Press system Back', 'Only the sheet closes; My AI Artwork stays open on the 「AI Art」 tab (the page is not left)', 'P2', 'R-032', 'Q-3 answered (REQ-003)', 'android');

S('No charge');
R(`${PHONE} with a free (not subscribed) account; ${WORKS}; ${OPEN} open on 「Recent」; credit balance noted`, '1. Tap ☰\n2. Tap 「AI Art」\n3. Tap ☰\n4. Tap ✕', 'No upgrade or purchase prompt appears at any step; the credit balance is unchanged', 'P2', 'R-040');
R(`${PHONE} with a ${PAID} account; ${WORKS}; ${OPEN} open on 「Recent」; credit balance noted`, '1. Tap ☰\n2. Tap 「AI Art」', 'No upgrade or purchase prompt appears; the credit balance is unchanged', 'P2', 'R-040', ANDROID ? '' : 'iOS paid modes are Pro and Pro+ (KP-013); the spec names no tier, so one paid row');

S('Entry from a feature');
R(`${PHONE}; a feature with a History button (a sheet of paper with a clock) and works saved under it`, '1. Open the feature\n2. Tap its History button\n3. Tap ☰', 'My AI Artwork opens on that feature\'s tab; in 「All categories」 that feature\'s row is highlighted in peach', 'P3', 'R-060', 'KP-026 (team rule)', 'android');

S('Tracking events');
R(`${ON('Recent')}; the analytics event log open`, 'Tap ☰', '「Artwork_FeatureList_Appear」 is sent with from_tab = Recent', 'P3', 'R-050', 'Parked until an event log is available');
R(`${ON('AI Art')}; the analytics event log open`, 'Tap ☰', '「Artwork_FeatureList_Appear」 is sent with from_tab = AI Art', 'P3', 'R-050', 'Parked until an event log is available');
R(`${SHEET('Recent')}; the analytics event log open`, 'Tap 「AI Art」', '「Artwork_Category_Select」 is sent with category = AI Art and source = sheet', 'P3', 'R-051', 'Parked until an event log is available');
R(`${ON('Recent')}; the analytics event log open`, 'Tap the 「AI Art」 tab in the tab bar', '「Artwork_Category_Select」 is sent with category = AI Art and source = tab', 'P3', 'R-052', 'Parked until an event log is available');

// ---------------------------------------------------------------- grids
const has = (r: string) => sections.some(([, rs]) => rs.some(q => q[0] === r));
const rowsOf = (ref: string) => rows.filter(r => r['Spec Ref'].split(/,\s*/).includes(ref)).map(r => r.ID);
const list = (ref: string) => rowsOf(ref).join(', ');
const T = (ids: number[]) => ids.map(id).filter(i => rows.some(r => r.ID === i)).join(', ');

const md: string[] = [];
md.push(`# My AI Artwork: All categories — requirements (${PLATFORM})`);
md.push('Spec: my ai artwork category list.pdf (spec set 2026-11-11; PM page 「My Artwork: Artwork category list add filter Demo + Spec」, 11/E, ledger 2026-10-28)');
md.push('Read from the PDF text layer and region renders; the PM Figma page (UX-Issues 「26 11E UIUX Revamp」, REQ-004) was compared on 2026-11-11: its spec section 14567:1713 is the PDF (same pixels), and its 「draft」 section 14452:6990 is read as board pm-draft. The Figma control inventory is still owed (figma-pending.json: use_figma refused, Full seat). No separate Design or MX file was supplied; the mockups are iPhone frames and their strings are used as the expected UI text.');
md.push('');
for (const [name, reqs] of sections) {
  md.push(`## ${name}`);
  for (const [rid, src, text] of reqs) md.push(`- ${rid} [${src}] ${text}`);
  md.push('');
}
md.push('## Flow arrows');
md.push('- R-070 [PM: flow arrow pm-entry-flow-a1  (PDF board pm-entry-flow, no Figma link)] My AI Artwork (Recent) ☰ → 「All categories」 sheet: tapping ☰ opens the sheet. Walked by: ' + T([6]) + '.');
md.push('- R-071 [PM: flow arrow pm-entry-flow-a2  (PDF board pm-entry-flow, no Figma link)] 「All categories」 「AI Creative Studio」 row → the 「AI Creative Studio」 tab: the sheet closes on that tab. Walked by: ' + T([13]) + '.');
md.push('');
md.push('## Open questions');
md.push('');
md.push('## Answered questions (2026-11-11, Cases page)');
md.push('- Q-1 — 同今天意思是照目前當下的狀態 → 「as today」 is the current behaviour of the app; the ledger and the 8/E Recent spec are not needed. REQ-003; R-003, R-004, R-005.');
md.push('- Q-2 — 先當 PDF 是完整的 → the PDF is taken as complete. The Figma link came later (REQ-004): its spec section is the same as the PDF; only the control inventory is still owed. REQ-003, REQ-004.');
md.push(`- Q-3 — 預期都會關閉清單 → ✕, the grabber, the dimmed page and system Back each close the sheet, tab unchanged. REQ-003; R-030, R-031, R-032.`);
md.push('- Q-4 — 只在英文檢查 → the alphabetical order is checked in the English UI only. REQ-003; R-003, R-012.');
md.push('- Q-5 — 結束多選 → choosing a category during multi-select ends multi-select. REQ-003; R-023.');
md.push('- Q-6 — 會 → the chosen tab is scrolled into view. REQ-003; R-020.');
md.push('- Q-7 — 不用檢查 → the header 「建議句」 is not an app string; no row. REQ-003.');
md.push('');
md.push('## Added 2026-11-11 — coverage passes and standing inputs');
md.push('### Job states');
md.push('| Job | Start / loading | Success | Failure | Retry | Leave and return | Longest wait | Done notice |');
md.push('|---|---|---|---|---|---|---|---|');
md.push(`| Open the sheet and switch tabs | n/a (no server job: the list is the tab bar's tabs) | ${T([6, 13])} | n/a (spec silent) | n/a (no job) | n/a (spec silent) | n/a (no job) | n/a (no notice) |`);
md.push('');
md.push('### Error classes');
md.push('| Job | Error classes |');
md.push('|---|---|');
md.push('| All jobs | n/a (the spec names no error classes or failure copy) |');
md.push('');
md.push('### Exit × stage');
md.push(ANDROID ? '| Stage | ✕ | Grabber drag down | Tap dimmed page | System Back |' : '| Stage | ✕ | Grabber drag down | Tap dimmed page |');
md.push(ANDROID ? '|---|---|---|---|---|' : '|---|---|---|---|');
md.push(`| Sheet open | ${T([21])} | ${T([22])} | ${T([23])} |${ANDROID ? ` ${T([24])} |` : ''}`);
md.push(`| Sheet open during multi-select | n/a (spec silent: only choosing a row is stated) | n/a (spec silent) | n/a (spec silent) |${ANDROID ? ' n/a (spec silent) |' : ''}`);
md.push('');
if (ANDROID) {
  md.push('### System back');
  md.push(`- 「All categories」 sheet → closes the sheet only, same tab: ${T([24])}`);
  md.push('- My AI Artwork page → n/a (existing page, Back not changed by 11/E)');
  md.push('- Multi-select on a tab → n/a (existing state, not changed by 11/E)');
  md.push('');
}
md.push('### Hidden clauses');
md.push('| Requirement | Hidden clause | Observed through | Rows |');
md.push('|---|---|---|---|');
md.push(`| R-050 | Artwork_FeatureList_Appear sent with from_tab | the analytics event log | ${list('R-050')} |`);
md.push(`| R-051 | Artwork_Category_Select sent with source = sheet | the analytics event log | ${list('R-051')} |`);
md.push(`| R-052 | Artwork_Category_Select sent with source = tab | the analytics event log | ${list('R-052')} |`);
md.push(`| R-040 | no credits charged | the credit balance before and after | ${list('R-040')} |`);
md.push('');
md.push('### Variants');
md.push('| Requirement | Variant | Rows |');
md.push('|---|---|---|');
md.push(`| R-040 × account | free | ${T([25])} |`);
md.push(`| R-040 × account | paid (${PAID}) | ${T([26])} |`);
md.push(`| R-016 × opened from | Recent | ${T([10])} |`);
md.push(`| R-016 × opened from | a feature tab | ${T([11])} |`);
md.push(`| R-020 × row chosen | feature with works | ${T([13, 14])} |`);
md.push(`| R-020 × row chosen | Recent | ${T([18])} |`);
md.push(`| R-020 × row chosen | last row | ${T([20])} |`);
md.push(`| R-021 × row chosen | feature with no works | ${T([16])} |`);
md.push('| R-023 × way of switching | a row of the sheet | TC-019 |');
md.push('| R-025 × way of switching | a tab of the tab bar | TC-032 |');
md.push(`| R-050 × from_tab | Recent | ${T([28])} |`);
md.push(`| R-050 × from_tab | a feature tab | ${T([29])} |`);
md.push('');
md.push('### Domain rules');
md.push('| Entry | Requirements |');
md.push('|---|---|');
md.push('@@DOMAIN@@');
md.push('');
md.push('### Request ledger coverage');
md.push('| Ledger entry | Requirements |');
md.push('|---|---|');
md.push('| REQ-001 | R-001 – R-052 (the whole table) |');
md.push('| REQ-003 | R-003, R-004, R-005, R-012, R-020, R-023, R-030, R-031, R-032 |');
md.push('| REQ-006 | R-004 (empty-tab button) |');
md.push('| REQ-004 | R-014, R-023, R-025 (Figma draft section) |');
md.push('| REQ-002 | n/a (platform scope: this Android table only, the iOS draft was removed) |');

// domain rules: filled from knowledge.md (every rule entry); entries applied are named here, the rest n/a
import { readFileSync } from 'node:fs';
const kn = readFileSync(join(DIR, 'knowledge.md'), 'utf8');
const ruleSection = kn.split(/^## /m).find(s => s.startsWith('rule')) ?? '';
const applied: Record<string, string> = {
  'KP-026': 'R-060',
  'KP-012': 'n/a (the spec states the feature is free for every user: R-040 checks a free and a VIP user)',
  'KP-013': 'n/a (the spec names no tier: R-040 checks a free and a Pro user)',
  'KP-024': 'n/a (where works are saved is not changed by this spec; the rows only need works under several features)',
  'KP-025': 'n/a (other feature: AI Exposure; its Artwork entry path is used in the Preconditions)',
  'KP-027': 'n/a (which works reach Recent is not changed by this spec)',
  'KP-028': 'n/a (the Photo / Video filter is unchanged, R-005; the spec states empty tabs show 「Create More」, R-004)',
};
const doms: string[] = [];
for (const m of ruleSection.matchAll(/^### (K[CPF]-\d+) (.+?) \(/gm)) doms.push(`| ${m[1]} ${m[2]} | ${applied[m[1]] ?? 'n/a (other feature or flow: not part of My AI Artwork\'s tab bar or the All categories sheet)'} |`);
const text = md.join('\n').replace('@@DOMAIN@@', doms.join('\n') || '| (none) | n/a |') + '\n';
writeFileSync(join(DIR, 'requirements.md'), text);
for (const r of rows) if (r.ID === 'TC-004' || r.ID === 'TC-016') { r.Change = 'modified'; r['Change Reason'] = 'REQ-006: an empty tab shows 「Nothing yet.」 / 「Start to Create」; 「Create More」 only on a tab with works (R-004)'; }
writeTable(join(DIR, 'draft.csv'), DRAFT_COLUMNS, rows);
console.log(`${PLATFORM}: ${sections.reduce((a, [, r]) => a + r.length, 0)} requirements, ${rows.length} rows`);
