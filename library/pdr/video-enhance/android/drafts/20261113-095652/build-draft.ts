// Builds draft 20261113-095652 for pdr/video-enhance / android (REQ-017): Android sells only Free and Pro (REQ-012
// ruling, 2026-11-11), but rows kept the precondition "Signed in with a Pro+ account" and three rows still named a
// Pro+ account, the IAP 「Pro」 tab or the Credit page's 「PowerDirector Pro+」 card. Only those words change.
// Usage: node library/pdr/video-enhance/android/drafts/20261113-095652/build-draft.ts
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readRecords, writeRecords } from '../../../../../../scripts/lib/csv.ts';

const HERE = dirname(fileURLToPath(import.meta.url));
const COLS = ['ID', 'Section', 'Precondition', 'Action', 'Expected Result', 'Priority', 'Spec Ref', 'Notes', 'Change', 'Change Reason'];
type Row = Record<string, string>;
const rows: Row[] = readRecords(readFileSync(join(HERE, '..', '..', 'cases.csv'), 'utf8'))
  .map(r => ({ ...r, Change: 'unchanged', 'Change Reason': '' }));
const get = (id: string) => { const r = rows.find(x => x.ID === id); if (!r) throw new Error(id); return r; };
const mark = (r: Row, reason: string) => Object.assign(r, { Change: 'modified', 'Change Reason': `REQ-017: ${reason}` });

const OLD_TIER = 'Signed in with a Pro+ account (no tier switch on Android)';
const NEW_TIER = 'Signed in with a Pro account (no tier switch on Android)';
let tier = 0;
for (const r of rows) {
  if (!r.Precondition.includes(OLD_TIER)) continue;
  r.Precondition = r.Precondition.split(OLD_TIER).join(NEW_TIER);
  mark(r, 'Android has no Pro+ (REQ-012): the paid account is Pro');
  tier++;
}

const r090 = get('TC-090');
r090['Expected Result'] = r090['Expected Result'].replace(
  'Step 2 opens the IAP page on the 「Pro」 tab (the Pro plans)',
  'Step 2 opens the single 「PowerDirector Pro」 IAP page (no Pro / Pro+ tabs)');
mark(r090, 'the Android IAP is one Pro page with no tabs (REQ-012, R-071, R-072)');

const r091 = get('TC-091');
r091.Precondition = r091.Precondition.replace('Signed in with a Pro (not Pro+) account', 'Signed in with a Pro account');
r091.Notes = r091.Notes.replace('The iOS table keeps Pro+ only.', 'The iOS table keeps Pro+ only; Android has no Pro+ (REQ-012).');
mark(r091, 'Android has no Pro+ to contrast with (REQ-012)');

const r096 = get('TC-096');
r096['Expected Result'] = r096['Expected Result'].replace(
  'the 「PowerDirector Pro+」 card)',
  'the account\'s plan card, not a 「PowerDirector Pro+」 one: its exact words recorded)');
r096.Notes = `${r096.Notes} The Design's 「PowerDirector Pro+」 card is the iOS page; Android has no Pro+ and no Android Credit page is drawn [Req: REQ-017].`;
mark(r096, 'the Credit page card cannot read Pro+ on Android (REQ-012); its words are recorded, not asserted');

for (const [id, field] of [['TC-090', 'Expected Result'], ['TC-091', 'Precondition'], ['TC-096', 'Expected Result']] as const) {
  if (get(id)[field].includes(id === 'TC-091' ? 'not Pro+' : id === 'TC-090' ? '「Pro」 tab' : '「PowerDirector Pro+」 card)')) throw new Error(`${id}: text to replace not found`);
}
const left = rows.filter(r => /Pro\+ account/.test(r.Precondition));
if (left.length) throw new Error(`Pro+ account left in ${left.map(r => r.ID).join(', ')}`);

writeFileSync(join(HERE, 'draft.csv'), writeRecords(COLS, rows));
const count = (c: string) => rows.filter(r => r.Change === c).length;
console.log(`android: ${rows.length} rows — tier lines ${tier}, modified ${count('modified')}, unchanged ${count('unchanged')}`);
