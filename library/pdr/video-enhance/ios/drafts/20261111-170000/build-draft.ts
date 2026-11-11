// Builds draft 20261111-170000 for pdr/video-enhance (REQ-011: the spec agent's main PDF is a 2026-10-07 export of the
// old 26.09_v2 state; a rule that today's board contradicts is dropped). Same script in the ios and android drafts.
// Usage: node library/pdr/video-enhance/<platform>/drafts/20261111-170000/build-draft.ts
// Starts from the approved cases.csv and requirements.md of its platform; changes R-015, R-044, R-196, Q-13, Q-23 and
// rows TC-022 / TC-058; every other row is `unchanged`.
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readRecords, writeRecords } from '../../../../../../scripts/lib/csv.ts';

const HERE = dirname(fileURLToPath(import.meta.url));
const PLAT = basename(join(HERE, '..', '..'));
const COLS = ['ID', 'Section', 'Precondition', 'Action', 'Expected Result', 'Priority', 'Spec Ref', 'Notes', 'Change', 'Change Reason'];
const DS = 'Design ds-ai-video-enhance 預設值規則 「Resolution 依來源（選不低於來源解析度的最小選項；來源超過最高選項時取最高）」, lookup 1081p → 4K';

const rows = readRecords(readFileSync(join(HERE, '..', '..', 'cases.csv'), 'utf8')).map(r => ({ ...r, Change: 'unchanged', 'Change Reason': '' }));
const set = (id: string, f: Record<string, string>, reason: string) => {
  const r = rows.find(x => x.ID === id); if (!r) throw new Error(id);
  Object.assign(r, f, { Change: 'modified', 'Change Reason': reason });
};
set('TC-022', {
  'Expected Result': 'Steps 1–3: each opens the panel like any other source: 「4K」 is selected (a source above the highest option takes the highest), the Preview shows the video and plays it, and the badge at its lower right shows the source\'s own fps and resolution (e.g. 「30fps · 1440p」, 「30fps · 2160p」, 「30fps · 4320p」). Steps 4–5: each is greyed, the tap shows 「This video isn\'t supported. Try one up to 4K.」 and no panel opens',
  'Spec Ref': 'R-196, R-044, R-015',
  Notes: `Steps 1–3: ${DS} [Req: REQ-011]; the spec agent's 2K+ block (TC-VE2-097 / 098) follows the 2026-10-07 export of the old board and is dropped. PM E1 [待確認] (≤ 4K, over 4K greyed) is older than the Design (Q-13), so a difference on the 8K step is still filed. Steps 4–5: PM E1 / A2 [建議] and [待確認] (Q-13), a difference is a PM question. Needs the five fixtures (fixtures.md).`,
}, 'REQ-011: today\'s Design board takes the highest option (4K) for a source above it, so 2K+ sources open the panel; the 2K+ block came from the old board (spec agent TC-VE2-097 / 098, R-196)');
set('TC-058', {
  Notes: `1440p, 4K and 8K sources also default to 4K (R-196, TC-022 steps 1–3): ${DS} [Req: REQ-011]. Needs the two fixture videos.`,
}, 'REQ-011: Note only; the 1440p+ sources are checked in TC-022 again instead of being rejected');
writeFileSync(join(HERE, 'draft.csv'), writeRecords(COLS, rows));

let req = readFileSync(join(HERE, '..', '..', 'requirements.md'), 'utf8');
const rep = (re: RegExp, to: string) => { if (!re.test(req)) throw new Error('not found: ' + re); req = req.replace(re, to); };
rep(/^- R-015 (\[[^\n]*?\]) (A video the feature cannot take[^\n]*?)Sources of 2K and up \(PM E1's 「over 4K」 included\) follow R-196\.$/m,
  '- R-015 $1 $2Sources of 2K and up, over 4K included, open the panel (R-196, the Design\'s lookup; PM E1\'s 「over 4K」 greying is older, Q-13).');
rep(/^- R-196 \[[^\n]*$/m,
  `- R-196 [DS:ds-ai-video-enhance 預設值規則 「來源超過最高選項時取最高」 + lookup 1081p → 4K; Req: REQ-011] A source of 2K or higher (1440p, 4K 3840 × 2160, 8K 7680 × 4320; either orientation) opens the panel like any other: 「4K」 is selected, the Preview shows and plays the video and its badge shows the source's own fps and resolution. Before 2026-11-11 this was a 2K+ block taken from the spec agent (TC-VE2-097 / 098), whose PDF is a 2026-10-07 export of the old board state; today's board contradicts it (REQ-011). PM E1's 「≤ 4K」 is older than the Design (Q-13).`);
rep(/^- R-044 \[DS:ds-ai-video-enhance 預設值規則 \+ 對照表; Req: REQ-008; spec agent TC-VE2-030, TC-VE2-096 – TC-VE2-098\] ([^\n]*?)1081p up to below 2K \(1439p\) → 「4K」\. A 1440p \(2K\) or larger source never reaches the panel \(R-196\); the 4K output option stays \(R-045\)\./m,
  '- R-044 [DS:ds-ai-video-enhance 預設值規則 + 對照表; Req: REQ-008, REQ-011; spec agent TC-VE2-030, TC-VE2-096] $11081p and above → 「4K」 (a source above the highest option takes the highest, so 1440p, 4K and 8K select 4K too, R-196); the 4K output option stays (R-045).');
rep(/^- Q-13 Supported sources \[待確認\]: ([^\n]*?)Partly settled by REQ-008:[^\n]*?\(R-196\)\. /m,
  '- Q-13 Supported sources [待確認]: $1The Design\'s 預設值規則 (newer, 1005 labels) takes the highest option for a larger source, so 2K, 4K and 8K sources open the panel with 4K (R-196, REQ-011); PM E1\'s 「≤ 4K」 and its greying of larger sources stay open for PM. ');
rep(/^- Q-23 2K\+ rejection[^\n]*\n/m, '');
rep(/^\| R-196 \| a 2K\+ source is not loaded and no task starts \| [^\n]*$/m,
  '| R-196 | a 2K+ source opens the panel with 4K | 「4K」 selected; the Preview plays; the badge shows the source fps and resolution | TC-022 |');
rep(/^\| R-044 \| 1081p\+ → 4K \| TC-058 \|$/m, '| R-044 | 1081p+ → 4K | TC-058, TC-022 |');
req = req.replace(/(^## Entry points)/m,
  'Draft 20261111-170000 [Req: REQ-011]: the spec agent\'s main PDF (74bcea79) is a 2026-10-07 export of the old state of\nthe same 26.09_v2 section, so its cases never override today\'s board. R-196 (2K+ rejected) is contradicted by the\nDesign\'s 預設值規則 (「來源超過最高選項時取最高」) and now states that rule; changed: R-015, R-044, R-196, Q-13;\nremoved: Q-23 (no 2K+ block, no message to ask about).\n\n$1');
const ledger = /^(\| REQ-008 \([^\n]*\|[^\n]*\|)$/m;
if (!ledger.test(req)) throw new Error('ledger');
req = req.replace(ledger, '$1\n| REQ-011 (analysis: spec agent cases from the old 26.09_v2 export never override today\'s board; the 2K+ block dropped) | R-015, R-044, R-196, Q-13 |');
writeFileSync(join(HERE, 'requirements.md'), req);
console.log(`${PLAT}: ${rows.length} rows, ${rows.filter(r => r.Change !== 'unchanged').length} modified`);
