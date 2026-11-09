// Builds requirements.md and draft.csv for pdr/photo-enhancer (Figma-only spec set 2026-11-06), one platform per run.
// Usage: node library/pdr/photo-enhancer/ios/drafts/20261106-105312/build-draft.ts <ios|android>
// The same file is copied into the Android draft folder; the platform argument picks the rows and grids.
// Rows carry fixed IDs (Android-only rows TC-030 onward), so grids name them directly.
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const P = (process.argv[2] ?? 'ios') as 'ios' | 'android';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..', '..', '..');
const OUT = join(ROOT, 'library', 'pdr', 'photo-enhancer', P, 'drafts', '20261106-105312');
const IOS = P === 'ios', AND = P === 'android';
const REASON = 'New table (PM + Design Figma 2026-11-06)';
const PMONLY = 'PM-only: no Design frame yet (the Design link is the 24.10E toolbar regroup; Q-11)';
const phone = IOS ? 'iPhone' : 'Android phone';
const PMF = 'https://www.figma.com/design/mzJYPdS0vyHdprWGYdzDAp/Support-Photo-Enhancer?node-id=';
const tierHow = IOS ? 'Launcher › Pink › ☰ › [0] IAP › status' : 'the debug tier switch (KP-003)';

// ---------------------------------------------------------------- requirements
type Req = { id: string; sec: string; src: string; text: string; plat?: 'ios' | 'android' };
const R: Req[] = [];
const req = (id: string, sec: string, src: string, text: string, plat?: 'ios' | 'android') => { R.push({ id, sec, src, text, plat }); return id; };

const S1 = 'Enhance in the photo toolbars', S2 = 'Apply Photo Enhance', S3 = 'Photo Enhance panel', S4 = 'Full-screen preview',
  S5 = 'Android system Back', S6 = 'Not testable';

req('R-001', S1, 'PM:pm-master-photo; DS:d-master-photo-toolbar', 'Selecting a photo clip on the master track shows the photo toolbar with an 「Enhance」 button (the toolbar scrolls sideways; where Enhance sits: Q-1)');
req('R-002', S1, 'PM:pm-pip-photo; DS:d-pip-photo-toolbar', 'Selecting a photo clip on a PiP track shows the PiP photo toolbar with an 「Enhance」 button (position: Q-1)');
req('R-003', S1, 'PM:pm-enhance-flow 「打開second layer」 Frame 8786; Link: toolbar-reorg-sheet.md', 'Tapping 「Enhance」 on a photo clip opens a second layer holding 「Photo Enhance」 and 「AI Color」 (Design 24.10E draws Enhance with no second layer and AI Color under Effects; the PM and the sheet are newer: Q-1)');
req('R-004', S1, 'Link: toolbar-reorg-sheet.md (Enhance column); PM:pm-enhance-flow Frame 8786', 'In the Enhance second layer 「Photo Enhance」 comes first and 「AI Color」 second, on the master and the PiP photo toolbar');
req('R-005', S1, 'DS:figma 12.23 1528:43699; PM:pm-enhance-flow round/ic_ai_enhancement', '「Photo Enhance」 uses the new photo-with-sparkle icon (round/ic_ai_enhancement, Design icon slice 「12.23」)');
req('R-006', S1, 'PM:pm-enhance-flow Frame 8786 round/ic_ai_color', '「AI Color」 in the Enhance second layer opens AI Color for the selected photo clip');

req('R-010', S2, 'PM:pm-enhance-flow 65:4092', 'Tapping 「Photo Enhance」 on a photo clip that is not enhanced opens the dialog 「Ready to Enhance?」 / 「Your image will look even better in just a few seconds.」 with 「Cancel」 and 「Continue」');
req('R-011', S2, 'PM:pm-enhance-flow 65:4092', '「Cancel」 in 「Ready to Enhance?」 closes the dialog and applies nothing (the PM draws no arrow from it)');
req('R-012', S2, 'PM:pm-enhance-flow 65:6095', '「Continue」 dims the editor and shows a spinner, 「Enhancing...」 and a 「Cancel」 button');
req('R-013', S2, 'PM:pm-enhance-flow 65:6095', '「Cancel」 during 「Enhancing...」 stops the enhancement and applies nothing (no arrow drawn: Q-2)');
req('R-014', S2, 'PM:pm-enhance-flow 65:4427', 'When the enhancement finishes, the preview shows the enhanced photo and the toast 「Applied Photo Enhance」 appears');
req('R-015', S2, 'PM:pm-enhance-flow 65:4427 Vector 2597; PM:pm-full-screen Ellipse 230', 'A small white dot on the toolbar 「Enhance」 button marks a photo clip that has Photo Enhance applied');
req('R-016', S2, 'PM:pm-enhance-flow 65:9990', 'With Photo Enhance applied, the Enhance second layer shows a white dot over 「Photo Enhance」');
req('R-017', S2, 'PM:pm-master-photo; PM:pm-pip-photo; PM:pm-enhance-flow', 'Photo Enhance can be applied to a photo clip on the master track and to one on a PiP track; it changes only the selected clip');

req('R-020', S3, 'PM:pm-enhance-flow 「再次點擊Image Enhance(已套用狀態)」; panel at 3389,497', 'Tapping 「Photo Enhance」 on a clip that has it applied opens the Photo Enhance panel directly (no dialog): the photo preview, ✕ at the top left, an icon at the top right, 「Reset」, the title 「Photo Enhance」 and the options 「Original」 and 「Result」, with 「Result」 selected');
req('R-021', S3, 'PM:pm-enhance-flow panel; PM:pm-refs (Video Enhance and Photo Enhance room references)', '「Original」 shows the clip without the enhancement and 「Result」 shows it enhanced; the selected option is outlined');
req('R-022', S3, 'PM:pm-enhance-flow 「再次點擊Image Enhance(已套用>未套用狀態), 需要記住上次的result, 因此第二次套用不會有progressing」', 'The last enhancement result is kept: going back from not applied to applied reuses it, so no 「Enhancing...」 progress is shown and the photo is not processed again');
req('R-023', S3, 'PM:pm-enhance-flow arrow 91-8366', '✕ closes the panel and returns to the editor with the enhancement and the white dot kept');
req('R-024', S3, 'PM:pm-enhance-flow arrow 91-8359; 91:7764', '「Reset」 removes the enhancement and returns to the editor, where the preview shows the original photo and the toast 「Removed Photo Enhance」 appears');
req('R-025', S3, 'PM:pm-enhance-flow 「小白點消失」', 'After 「Reset」 the white dot is gone from the toolbar 「Enhance」 button and from 「Photo Enhance」');
req('R-026', S3, 'PM:pm-enhance-flow 「…因此第二次套用不會有progressing」', 'After 「Reset」, applying Photo Enhance again on the same clip uses the kept result: no 「Enhancing...」, the enhanced photo and 「Applied Photo Enhance」 come at once (whether 「Ready to Enhance?」 shows again: Q-5)');
req('R-027', S3, 'PM:pm-enhance-flow panel top-right icon; PM:pm-refs', 'The icon at the top right of the Photo Enhance panel does what the Photo Enhance room\'s compare control does (its function is not stated: Q-6)');

req('R-030', S4, 'PM:pm-full-screen arrow 65-6786', 'The editor\'s full-screen button opens the full-screen preview, which shows the photo clip with its enhancement');
req('R-031', S4, 'PM:pm-full-screen 「***Timeline Mode, Full Screen一律做擋截圖, 樣式跟rule都跟原shortcut image enhancer一樣」; arrow 65-6787', 'In the timeline\'s full-screen preview, taking a screenshot is always blocked (「一律」; whether that includes a photo without the enhancement: Q-7) with the 「screenshot IAP dialog」, looking and behaving as in the shortcut Photo Enhance (image enhancer) room');
req('R-032', S4, 'PM:pm-full-screen note (「rule都跟原shortcut image enhancer一樣」)', 'The screenshot block follows the shortcut room\'s tier rule: a Free user gets the IAP dialog; a subscriber (Pro) is treated as in the shortcut room (assumed: no dialog; Q-7)');

req('R-040', S5, 'Rule: Android system Back (analysis.md pass 8, REQ-051)', 'Android system Back on each Photo Enhance screen does what the screen\'s own way out does (see System back)', 'android');

req('R-045', S6, 'PM:pm-refs', 'The two reference shots (Video Enhance panel in the timeline, the Photo Enhance shortcut room) only show what the panel is modelled on — NOT TESTABLE: no rule of their own; R-020–R-027 cover the panel');
req('R-046', S6, 'PM:pm-header', 'The 「SPEC」 title bar — NOT TESTABLE: a heading');

// flow arrows
const AR: [string, string, string, string][] = [
  ['R-050', '65-6779', 'Master photo toolbar 「Enhance」 → Enhance second layer', 'TC-002'],
  ['R-051', '65-6780', 'PiP photo toolbar 「Enhance」 → Enhance second layer', 'TC-004'],
  ['R-052', '65-9989', 'Enhance second layer 「Photo Enhance」 (not applied) → 「Ready to Enhance?」', 'TC-006'],
  ['R-053', '65-6781', '「Ready to Enhance?」 「Continue」 → 「Enhancing...」', 'TC-008'],
  ['R-054', '65-6782', '「Enhancing...」 done (automatic) → editor with 「Applied Photo Enhance」', 'TC-009'],
  ['R-055', '65-6783', 'Editor (applied) 「Enhance」 → second layer with the white dot on 「Photo Enhance」', 'TC-010'],
  ['R-056', '91-8364', 'Second layer 「Photo Enhance」 (applied) → Photo Enhance panel', 'TC-013'],
  ['R-057', '91-8366', 'Photo Enhance panel ✕ → editor (applied)', 'TC-015'],
  ['R-058', '91-8359', 'Photo Enhance panel 「Reset」 → editor with 「Removed Photo Enhance」', 'TC-016'],
  ['R-059', '65-6786', 'Editor full-screen button → full-screen preview', 'TC-020'],
  ['R-060', '65-6787', 'Full-screen preview, screenshot → 「screenshot IAP dialog」', 'TC-021'],
];

// ---------------------------------------------------------------- rows
type Row = { id: string; sec: string; pre: string; act: string; exp: string; pri: string; ref: string; notes?: string; plat?: 'ios' | 'android' };
const rows: Row[] = [];
const row = (r: Row) => rows.push(r);
const base = `${phone}, PowerDirector signed in, Pro tier (${tierHow}; Q-3)`;
const master = `${base}; an editor project whose master track holds one photo clip`;
const pip = `${base}; an editor project with a video clip on the master track and a photo clip on a PiP track`;
const applied = `${master}; Photo Enhance applied to the photo clip (TC-009)`;
const openSecond = ['Tap the photo clip on the master track', 'Scroll the toolbar to 「Enhance」', 'Tap 「Enhance」'];
const steps = (...s: string[]) => s.length === 1 ? s[0] : s.map((x, i) => `${i + 1}. ${x}`).join('\n');

row({ id: 'TC-001', sec: S1, pre: master, act: steps('Tap the photo clip on the master track', 'Scroll the toolbar to its end'), exp: 'The photo toolbar shows an 「Enhance」 button (between 「Effects」 and 「Tools」 in the PM mockup; the sheet puts it after 「Background」: Q-1)', pri: 'P1', ref: 'R-001', notes: 'Position not asserted until Q-1 is answered' });
row({ id: 'TC-002', sec: S1, pre: master, act: steps(...openSecond), exp: 'A second layer opens over the toolbar with 「Photo Enhance」 first and 「AI Color」 second; 「Photo Enhance」 has the photo-with-sparkle icon', pri: 'P1', ref: 'R-003, R-004, R-005, R-050', notes: 'Design 24.10E draws no Enhance second layer (AI Color under Effects): the PM and the sheet are newer (Q-1)' });
row({ id: 'TC-003', sec: S1, pre: pip, act: steps('Tap the photo clip on the PiP track', 'Scroll the toolbar to its end'), exp: 'The PiP photo toolbar shows an 「Enhance」 button', pri: 'P1', ref: 'R-002' });
row({ id: 'TC-004', sec: S1, pre: pip, act: steps('Tap the photo clip on the PiP track', 'Scroll the toolbar to 「Enhance」', 'Tap 「Enhance」'), exp: 'The same second layer opens: 「Photo Enhance」 first, 「AI Color」 second', pri: 'P1', ref: 'R-003, R-004, R-051' });
row({ id: 'TC-005', sec: S1, pre: master, act: steps(...openSecond, 'Tap 「AI Color」'), exp: 'AI Color opens for the selected photo clip', pri: 'P2', ref: 'R-006', notes: 'AI Color itself is another feature; only the entry is checked here' });

row({ id: 'TC-006', sec: S2, pre: master, act: steps(...openSecond, 'Tap 「Photo Enhance」'), exp: 'The dialog 「Ready to Enhance?」 appears with 「Your image will look even better in just a few seconds.」 and the buttons 「Cancel」 and 「Continue」', pri: 'P1', ref: 'R-010, R-052', notes: PMONLY });
row({ id: 'TC-007', sec: S2, pre: master, act: steps(...openSecond, 'Tap 「Photo Enhance」', 'Tap 「Cancel」'), exp: 'The dialog closes; the photo is unchanged, no toast appears and 「Enhance」 has no white dot', pri: 'P2', ref: 'R-011', notes: PMONLY });
row({ id: 'TC-008', sec: S2, pre: master, act: steps(...openSecond, 'Tap 「Photo Enhance」', 'Tap 「Continue」'), exp: 'The editor dims and shows a spinner, 「Enhancing...」 and a 「Cancel」 button', pri: 'P1', ref: 'R-012, R-053', notes: `${PMONLY}. The shortcut room finishes a photo in about 3–5 s: record the screen before tapping 「Continue」` });
row({ id: 'TC-009', sec: S2, pre: master, act: steps(...openSecond, 'Tap 「Photo Enhance」', 'Tap 「Continue」', 'Wait until 「Enhancing...」 closes'), exp: 'The preview shows the enhanced photo (sharper, compare with a screenshot taken before) and the toast 「Applied Photo Enhance」 appears', pri: 'P1', ref: 'R-014, R-017, R-054', notes: PMONLY });
row({ id: 'TC-010', sec: S2, pre: applied, act: steps('Look at the toolbar 「Enhance」 button', 'Tap 「Enhance」'), exp: '1. A small white dot sits on 「Enhance」\n2. The second layer opens with a white dot over 「Photo Enhance」', pri: 'P2', ref: 'R-015, R-016, R-055', notes: PMONLY });
row({ id: 'TC-011', sec: S2, pre: master, act: steps(...openSecond, 'Tap 「Photo Enhance」', 'Tap 「Continue」', 'Tap 「Cancel」 while 「Enhancing...」 shows'), exp: 'The enhancement stops; the editor shows the original photo, no 「Applied Photo Enhance」 toast and no white dot (Q-2)', pri: 'P2', ref: 'R-013', notes: `${PMONLY}. Assumption until Q-2 is answered` });
row({ id: 'TC-012', sec: S2, pre: pip, act: steps('Tap the photo clip on the PiP track', 'Scroll the toolbar to 「Enhance」', 'Tap 「Enhance」', 'Tap 「Photo Enhance」', 'Tap 「Continue」', 'Wait until 「Enhancing...」 closes'), exp: 'The PiP photo shows enhanced and 「Applied Photo Enhance」 appears; the master-track video is unchanged', pri: 'P1', ref: 'R-014, R-017', notes: PMONLY });
row({ id: 'TC-023', sec: S2, pre: `${base}; an editor project whose master track holds two photo clips; Photo Enhance applied to the first clip only (TC-009)`, act: steps('Tap the second photo clip on the master track', 'Look at the toolbar 「Enhance」 button', 'Tap 「Enhance」', 'Tap 「Photo Enhance」', 'Tap 「Cancel」', 'Tap the first photo clip'), exp: '1. The second clip is selected\n2. 「Enhance」 has no white dot\n3. 「Photo Enhance」 in the second layer has no white dot\n4. 「Ready to Enhance?」 appears, not the panel\n5. The dialog closes\n6. The first clip still shows enhanced and 「Enhance」 has its white dot', pri: 'P2', ref: 'R-015, R-016, R-017, R-010', notes: `${PMONLY}. The dot and the dialog follow the selected clip, not the project` });

row({ id: 'TC-013', sec: S3, pre: applied, act: steps(...openSecond, 'Tap 「Photo Enhance」'), exp: 'No dialog: the Photo Enhance panel opens with the photo preview, ✕ at the top left, an icon at the top right, 「Reset」, the title 「Photo Enhance」 and the options 「Original」 and 「Result」, with 「Result」 selected', pri: 'P1', ref: 'R-020, R-056', notes: PMONLY });
row({ id: 'TC-014', sec: S3, pre: `${applied}; the Photo Enhance panel open (TC-013); screen recording on`, act: steps('Tap 「Original」', 'Tap 「Result」'), exp: '1. 「Original」 is outlined and the preview shows the photo without the enhancement\n2. 「Result」 is outlined and the enhanced photo returns at once, with no 「Enhancing...」 progress', pri: 'P1', ref: 'R-021, R-022', notes: PMONLY });
row({ id: 'TC-015', sec: S3, pre: `${applied}; the Photo Enhance panel open (TC-013)`, act: 'Tap ✕', exp: 'The panel closes; the editor shows the enhanced photo and 「Enhance」 keeps its white dot', pri: 'P2', ref: 'R-023, R-057', notes: PMONLY });
row({ id: 'TC-016', sec: S3, pre: `${applied}; the Photo Enhance panel open (TC-013)`, act: 'Tap 「Reset」', exp: 'The panel closes; the editor shows the original photo and the toast 「Removed Photo Enhance」 appears', pri: 'P1', ref: 'R-024, R-058', notes: PMONLY });
row({ id: 'TC-017', sec: S3, pre: `${master}; Photo Enhance applied and removed again (TC-016)`, act: steps('Look at the toolbar 「Enhance」 button', 'Tap 「Enhance」'), exp: '1. 「Enhance」 has no white dot\n2. 「Photo Enhance」 in the second layer has no white dot', pri: 'P2', ref: 'R-025', notes: PMONLY });
row({ id: 'TC-018', sec: S3, pre: `${master}; Photo Enhance applied and removed again (TC-016); screen recording on`, act: steps(...openSecond, 'Tap 「Photo Enhance」', 'Tap 「Continue」 if 「Ready to Enhance?」 appears (Q-5)', 'Send the app log'), exp: '1. No 「Enhancing...」 progress appears; the enhanced photo and 「Applied Photo Enhance」 come at once\n2. The log shows no new enhance request for this clip', pri: 'P1', ref: 'R-026, R-022', notes: `${PMONLY}. Whether the dialog shows again: Q-5` });
row({ id: 'TC-019', sec: S3, pre: `${applied}; the Photo Enhance panel open (TC-013)`, act: 'Tap and hold the icon at the top right of the panel', exp: 'It compares the original and the enhanced photo, as the Photo Enhance room\'s compare control does (Q-6)', pri: 'P3', ref: 'R-027', notes: `${PMONLY}. Function not stated; assumption until Q-6 is answered` });

row({ id: 'TC-020', sec: S4, pre: applied, act: 'Tap the full-screen button under the preview', exp: 'The full-screen preview opens and shows the enhanced photo', pri: 'P1', ref: 'R-030, R-059', notes: PMONLY });
row({ id: 'TC-021', sec: S4, pre: `${applied.replace('Pro tier', 'Free tier')}; the full-screen preview open (TC-020)`, act: IOS ? 'Take a screenshot (side button + volume up)' : 'Take a screenshot (power + volume down)', exp: IOS ? 'The screenshot IAP dialog appears, the same dialog (look and buttons) as the shortcut Photo Enhance room shows on a screenshot' : 'The screenshot is blocked the way the shortcut Photo Enhance room blocks it (the screenshot IAP dialog; Q-8)', pri: 'P1', ref: 'R-031, R-032, R-060', notes: `${PMONLY}. Compare with a screenshot in Launcher › Photo Enhance on the same tier` });
row({ id: 'TC-022', sec: S4, pre: `${applied}; the full-screen preview open (TC-020)`, act: IOS ? 'Take a screenshot (side button + volume up)' : 'Take a screenshot (power + volume down)', exp: 'The screenshot is handled as in the shortcut Photo Enhance room on a Pro account (assumed: saved, no IAP dialog; Q-7)', pri: 'P2', ref: 'R-032', notes: `${PMONLY}. 「一律」 may mean every tier: check on device and decide with the user (Q-7)` });
row({ id: 'TC-024', sec: S4, pre: `${master.replace('Pro tier', 'Free tier')}; Photo Enhance not applied to the photo clip; the full-screen preview open`, act: IOS ? 'Take a screenshot (side button + volume up)' : 'Take a screenshot (power + volume down)', exp: 'The screenshot is blocked as on an enhanced photo: 「一律」 (always) taken literally (Q-7)', pri: 'P3', ref: 'R-031', notes: `${PMONLY}. The note does not limit the block to enhanced photos: check on device and decide with the user (Q-7)` });

if (AND) {
  const back = 'Press system Back';
  row({ id: 'TC-030', sec: S5, pre: master, act: steps(...openSecond, back), exp: 'The Enhance second layer closes; the editor stays with the photo clip selected', pri: 'P2', ref: 'R-040', plat: 'android' });
  row({ id: 'TC-031', sec: S5, pre: master, act: steps(...openSecond, 'Tap 「Photo Enhance」', back), exp: 'The 「Ready to Enhance?」 dialog closes as with 「Cancel」: nothing applied', pri: 'P2', ref: 'R-040, R-011', plat: 'android' });
  row({ id: 'TC-032', sec: S5, pre: master, act: steps(...openSecond, 'Tap 「Photo Enhance」', 'Tap 「Continue」', `${back} while 「Enhancing...」 shows`), exp: 'The enhancement stops as with 「Cancel」 (nothing applied), or Back is ignored until it ends (Q-2)', pri: 'P2', ref: 'R-040, R-013', plat: 'android' });
  row({ id: 'TC-033', sec: S5, pre: `${applied}; the Photo Enhance panel open (TC-013)`, act: back, exp: 'The panel closes as with ✕: the editor keeps the enhancement and the white dot', pri: 'P2', ref: 'R-040, R-023', plat: 'android' });
  row({ id: 'TC-034', sec: S5, pre: `${applied}; the full-screen preview open (TC-020)`, act: back, exp: 'The full-screen preview closes and the editor returns', pri: 'P3', ref: 'R-040, R-030', plat: 'android' });
}

// ---------------------------------------------------------------- write
const active = rows.filter(r => !r.plat || r.plat === P);
const rowsOf = (rid: string) => active.filter(r => r.ref.split(/,\s*/).includes(rid)).map(r => r.id);
const L: string[] = [];
L.push(`# Support Photo Enhancer — requirements (${P})`);
L.push('Spec: Support Photo Enhancer - PM and Design Figma.md (Figma-only spec set 2026-11-06: PM page 65:3761 「✅SPEC」, Design page 212:2045 「temp_UJ_ toolbar regroup_24.10E」, Master / PiP Photo Toolbar and icon slice)');
L.push('');
L.push('Source order: the PM page and its linked toolbar sheet (newest tab 「2026/11 Auto Reframe」) over the Design page, which is the older 24.10E toolbar regroup and draws none of the Photo Enhance screens (analysis.md pass 7: a Design frame older than the newest PM file loses where they conflict). Every Photo Enhance screen row is PM-only (Q-11).');
for (const sec of [S1, S2, S3, S4, ...(AND ? [S5] : []), S6]) {
  L.push('', `## ${sec}`);
  for (const r of R.filter(r => r.sec === sec && (!r.plat || r.plat === P))) L.push(`- ${r.id} [${r.src}] ${r.text}`);
}
L.push('', '## Open questions');
const Q: string[] = [
  'Q-1 Where is 「Enhance」 in the photo toolbars, and what does its second layer hold? The PM mockups put it after 「Effects」 (master: …Background, Effects, Enhance, Tools…); the linked sheet\'s newest tab 「2026/11 Auto Reframe」 puts it after 「Background」 and before 「Transition」; the Design (24.10E) has 「Enhance」 with no second layer and 「AI Color」 under 「Effects」. Assumption: Enhance is present with the second layer 「Photo Enhance」, 「AI Color」 (PM + sheet); its position is not checked. R-001, R-002, R-003, R-004; TC-001, TC-002, TC-003, TC-004.',
  'Q-2 What does 「Cancel」 during 「Enhancing...」 do? The PM draws the button with no arrow. Assumption: it stops, returns to the editor and applies nothing (no toast, no dot). R-013; TC-011' + (AND ? ', TC-032.' : '.'),
  'Q-3 Is Photo Enhance in the timeline limited by tier or credits? The spec says nothing; the shortcut Photo Enhance room was seen free on VIP with no credits charged (exploration KB, 2026-08-13). Assumption: any tier can apply it; rows run on Pro. R-010, R-014; TC-006, TC-009.',
  'Q-4 In the Photo Enhance panel, if 「Original」 is selected and the panel is closed with ✕, does the clip stay enhanced or lose the enhancement? Not drawn. Assumption: none; no row until answered. R-021, R-023.',
  'Q-5 After 「Reset」, does tapping 「Photo Enhance」 show 「Ready to Enhance?」 again before the kept result is re-applied? The note says only that the second apply shows no progress. Assumption: the dialog may show; Continue then applies at once. R-026; TC-018.',
  'Q-6 What does the icon at the top right of the Photo Enhance panel do? No arrow or note; the references show a history icon (Video Enhance) and a compare icon (Photo Enhance room). Assumption: compare (press and hold shows the original). R-027; TC-019.',
  'Q-7 Which tiers does the full-screen screenshot block apply to, and only to enhanced photos? 「一律做擋截圖」 (always blocks) with 「rule 跟原 shortcut image enhancer 一樣」 (same rule as the shortcut room). Assumption: a Free user gets the IAP dialog, on any photo (「一律」 taken literally); a Pro user is treated as in the shortcut room (no dialog). R-031, R-032; TC-021, TC-022, TC-024.',
];
if (AND) Q.push('Q-8 On Android, how is the screenshot blocked: the same IAP dialog after the screenshot, or a blocked (black) screenshot (secure window)? The PM draws only the iPhone. Assumption: as the shortcut Photo Enhance room on Android. R-031; TC-021.');
Q.push(
  'Q-9 Is the enhancement kept in the project (leave and reopen, undo / redo) and in the exported video? The spec does not say. Assumption: none; no row until answered. R-014, R-024.',
  'Q-10 What happens when the enhancement fails (no network, server error)? Not drawn. Assumption: none; no row until answered. R-012, R-014.',
  'Q-11 The Design link is the 24.10E toolbar regroup page: it draws no 「Ready to Enhance?」 dialog, 「Enhancing...」, Photo Enhance panel or toasts. Is a Design for these screens coming? Assumption: the PM mockups are the expected look; rows are PM-only. R-010–R-031.',
);
for (const q of Q) L.push(`- ${q}`);

L.push('', '## Added 2026-11-06 — coverage passes and standing inputs');
L.push('', '### Job states', '', '| Job | Start / loading | Success | Failure | Retry | Second failure | Partial | Stop | Leave and return | Longest wait | Done notice |', '|---|---|---|---|---|---|---|---|---|---|---|');
L.push('| Photo Enhance (first apply) | TC-008 | TC-009, TC-012 | n/a (spec silent; Q-10) | n/a (spec silent) | n/a (spec silent) | n/a (one photo per apply) | TC-011 | n/a (spec silent) | n/a (spec says only 「a few seconds」) | TC-009 |');
L.push('| Photo Enhance (re-apply, kept result) | n/a (no progress by spec: TC-018) | TC-018, TC-014 | n/a (spec silent) | n/a (spec silent) | n/a (spec silent) | n/a (one photo) | n/a (nothing to stop) | n/a (spec silent) | n/a (instant by spec) | TC-018 |');
L.push('', '### Error classes', '', '| Job | Error classes |', '|---|---|', '| Photo Enhance | n/a (spec names no error classes; Q-10) |');
L.push('', '### Exit × stage', '');
if (IOS) {
  L.push('| Stage | Cancel / ✕ | Reset |', '|---|---|---|');
  L.push('| 「Ready to Enhance?」 dialog | TC-007 | n/a (no Reset here) |', '| 「Enhancing...」 | TC-011 | n/a (no Reset here) |', '| Photo Enhance panel | TC-015 | TC-016 |', '| Full-screen preview | n/a (the existing full-screen exit; spec draws none) | n/a (no Reset here) |');
} else {
  L.push('| Stage | Cancel / ✕ | Reset | System Back |', '|---|---|---|---|');
  L.push('| Enhance second layer | n/a (no button drawn) | n/a (no Reset here) | TC-030 |', '| 「Ready to Enhance?」 dialog | TC-007 | n/a (no Reset here) | TC-031 |', '| 「Enhancing...」 | TC-011 | n/a (no Reset here) | TC-032 |', '| Photo Enhance panel | TC-015 | TC-016 | TC-033 |', '| Full-screen preview | n/a (the existing full-screen exit; spec draws none) | n/a (no Reset here) | TC-034 |');
  L.push('', '### System back', '', '- Enhance second layer: TC-030 (closes the layer)', '- 「Ready to Enhance?」 dialog: TC-031 (as 「Cancel」)', '- 「Enhancing...」: TC-032 (as 「Cancel」, or ignored: Q-2)', '- Photo Enhance panel: TC-033 (as ✕)', '- Full-screen preview: TC-034 (closes it)', '- Screenshot IAP dialog: n/a (the shortcut Photo Enhance room\'s dialog, another feature)');
}
L.push('', '### Hidden clauses', '', '| Requirement | Hidden clause | Observed through | Rows |', '|---|---|---|---|');
L.push('| R-022 | the kept result is reused, the photo is not processed again | no 「Enhancing...」 in a screen recording, and no new enhance request in the app log (log pull) | TC-014, TC-018 |');
L.push('| R-026 | the kept result is reused after Reset | no 「Enhancing...」 in a screen recording, and no new enhance request in the app log | TC-018 |');
L.push('| R-017 | only the selected clip changes | the other track\'s clip looks unchanged in the preview | TC-012 |', '| R-015 | the dot belongs to the clip, not the project | a second, un-enhanced clip shows no dot and gets the dialog | TC-023 |');
L.push('', '### Variants', '', '| Requirement | Variant | Rows |', '|---|---|---|');
L.push('| R-003 | track=master | TC-002 |', '| R-003 | track=PiP | TC-004 |', '| R-017 | track=master | TC-009 |', '| R-017 | track=PiP | TC-012 |', '| R-031 | photo enhanced | TC-021 |', '| R-031 | photo not enhanced | TC-024 |', '| R-032 | tier=Free | TC-021 |', '| R-032 | tier=Pro | TC-022 |');
L.push('', '### Flow arrows walked by existing rows', '');
for (const [id, node, edge, walked] of AR) L.push(`- ${id} [DS: flow arrow ${node} ${PMF}${node}] ${edge}. Walked by: ${walked}.`);
L.push('', '### Domain rules', '', '| Entry | Requirements |', '|---|---|');
L.push('| KP-007 A failed generation refunds its credits | n/a (the spec charges no credits for Photo Enhance; Q-3) |');
if (AND) L.push('| KP-066 Android text against the Android font | n/a (design check only, not a table rule) |');
L.push('', '### Request ledger coverage', '', '| Ledger entry | Requirements |', '|---|---|', '| REQ-001 (analysis: new feature, both platforms) | all (this table) |');
writeFileSync(join(OUT, 'requirements.md'), L.join('\n') + '\n');

const q = (s: string) => /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
const head = ['ID', 'Section', 'Precondition', 'Action', 'Expected Result', 'Priority', 'Spec Ref', 'Notes', 'Change', 'Change Reason'];
const csv = [head.join(','), ...active.map(r => [r.id, r.sec, r.pre, r.act, r.exp, r.pri, r.ref, r.notes ?? '', 'new', REASON].map(q).join(','))];
writeFileSync(join(OUT, 'draft.csv'), csv.join('\n') + '\n');
// untested requirements
const testable = R.filter(r => (!r.plat || r.plat === P) && !r.text.includes('NOT TESTABLE')).map(r => r.id);
const walkedReqs = new Set(AR.map(a => a[0]));
const missing = testable.filter(id => !rowsOf(id).length && !walkedReqs.has(id));
console.log(`${P}: ${active.length} rows, ${R.filter(r => !r.plat || r.plat === P).length + AR.length} requirements${missing.length ? `; no row: ${missing.join(', ')}` : ''}`);
