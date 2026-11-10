// Builds draft.csv for pdr/video-enhance ios, draft 20261110-180000 (REQ-008: bring the iOS table to the coverage of the
// approved Android v4, built from android/drafts/20261110-160000).
// Usage: node library/pdr/video-enhance/ios/drafts/20261110-180000/build-draft.ts
// Starts from the approved iOS table v2 (ios/cases.csv, 109 rows). iOS and Android share row IDs for the same content;
// the Android-only System back rows TC-200 – TC-213 are left out. For every row Android v4 modified, the fields that
// changed between Android v3 (android/history/v3.csv) and v4 (android/cases.csv) are taken over and rewritten for iOS
// controls (Pink tier switch, Photos, App Switcher, the media picker's 「Recents」); every Android v4 new row is taken
// the same way. Deliberate iOS differences (SKIP, OVERRIDE) are listed below; rows follow the Android v4 order, which
// puts each new row right after the row it extends (REQ-033).
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readRecords, writeRecords } from '../../../../../../scripts/lib/csv.ts';

const HERE = dirname(fileURLToPath(import.meta.url));
const FEATURE = join(HERE, '..', '..', '..');
const read = (p: string) => readRecords(readFileSync(join(FEATURE, p), 'utf8'));
const COLS = ['ID', 'Section', 'Precondition', 'Action', 'Expected Result', 'Priority', 'Spec Ref', 'Notes', 'Change', 'Change Reason'];
const FIELDS = ['Section', 'Precondition', 'Action', 'Expected Result', 'Priority', 'Spec Ref', 'Notes'];
type Row = Record<string, string>;

const ios = read('ios/cases.csv');
const a3 = new Map(read('android/history/v3.csv').map(r => [r.ID, r]));
const a4 = read('android/cases.csv');
const a4Draft = new Map(read('android/drafts/20261110-160000/draft.csv').map(r => [r.ID, r]));
const iosById = new Map(ios.map(r => [r.ID, r]));
const ANDROID_ONLY = (id: string) => /^TC-2(0\d|1[0-3])$/.test(id); // System back (R-190)

// Android v4 changes that are Android only: the tier rule (decision 3). iOS keeps Pro+ (Design 「Unlock Pro+ to
// Enhance」; spec agent TC-VE2-040 / 041 / 241 say Pro+ on iOS), so these rows stay as approved.
const SKIP: Record<string, string> = {
  'TC-090': 'Android unlocks with Pro; iOS keeps 「Unlock Pro+ to Enhance」 (TC-VE2-040, TC-VE2-041: Pro+ on iOS)',
  'TC-091': 'Android Pro gets Enhance; on iOS a Pro user still sees 「Unlock Pro+ to Enhance」 and the IAP on the Pro+ tab (TC-VE2-241: iOS Pro eligibility is not inferred from Android Pro)',
  'TC-094': 'the Pro unlock CTA is Android only; iOS returns to 「Unlock Pro+ to Enhance」',
  'TC-095': 'the Pro purchase is Android only; iOS buys Pro+ on the App Store sheet',
};

const IOS_PRO = 'Tier Pro+ (Launcher › Pink › ☰ › [0] IAP › status = Pro+, checked in Mine)';
const Q26 = 'Credit numbers are binding; they are the spec agent\'s ECL fixture (its Android rate source) and on iOS wait on the iOS ECL rates (Q-26): a different number shown is checked against the iOS ECL table before it is filed.';
const SWAPS: [string | RegExp, string][] = [
  ['Signed in with a Pro+ account (no tier switch on Android)', IOS_PRO],
  ['Read the saved file\'s resolution and frame rate (the gallery\'s Details, or the file pulled with adb and read with ffprobe on the computer)', 'In Photos, swipe up on the saved video to show its info'],
  [/Credit numbers are binding\./g, Q26],
  [/credit numbers are binding\./g, Q26.replace('Credit', 'credit')],
];
const iosify = (v: string) => SWAPS.reduce((s, [a, b]) => s.replaceAll(a as string, b), v);

// Row-specific iOS rewrites applied after iosify (field → [from, to] pairs).
const OVERRIDE: Record<string, Record<string, [string, string][]>> = {
  'TC-152': {
    Action: [['its media picker on 「All」', 'its media picker on 「Recents」']],
    'Expected Result': [['is a new file in the phone gallery (Google Photos / Files › Movies or DCIM)', 'is a new item in Photos'],
      ['the media picker lists it under 「All」', 'the media picker lists it under 「Recents」']],
    Notes: [['via the spec agent\'s TC-VE2-236 [Req: REQ-008].', 'via the spec agent\'s TC-VE2-236 [Req: REQ-008], which names 「Recents」 on iOS (「All」 on Android).']],
  },
  'TC-255': { Precondition: [['videos in All / Recents and', 'videos in Recents and']] },
  'TC-268': {
    Action: [['Close PowerDirector from Recents (swipe it away)', 'Close PowerDirector from the App Switcher (swipe up from the bottom edge and pause, then swipe PowerDirector away)'],
      ['Reopen PowerDirector and open Recent task', 'Reopen PowerDirector from the Home screen and open Recent task']],
  },
  'TC-259': {
    Notes: [['Same fixture as TC-262 and TC-264.', 'Same fixture as TC-262 and TC-264. iOS: the spec agent reviewed this case for PDRi and tracks it as DRI261897P0040 (filed on 16.9.0.189729); a failure here is that ticket on the build, listed for information only.']],
  },
};
const why: Record<string, string> = {
  'TC-152': 'saved item in Photos, listed under 「Recents」 in the media picker (TC-VE2-236: Recents on iOS)',
  'TC-255': 'the local albums are Recents and named albums',
  'TC-268': 'closed from the iOS App Switcher, reopened from the Home screen',
};

const applyOverride = (id: string, row: Row) => {
  for (const [f, pairs] of Object.entries(OVERRIDE[id] ?? {})) for (const [from, to] of pairs) {
    if (!row[f].includes(from)) throw new Error(`${id} ${f}: "${from}" not found`);
    row[f] = row[f].replace(from, to);
  }
  return row;
};

const out: Row[] = [];
for (const a of a4) {
  if (ANDROID_ONLY(a.ID)) continue;
  const d = a4Draft.get(a.ID);
  if (!d) throw new Error(`no Android draft row for ${a.ID}`);
  const mine = iosById.get(a.ID);
  const tail = (r: string) => why[a.ID] ? `${r}; iOS: ${why[a.ID]}` : r;
  if (d.Change === 'unchanged' || SKIP[a.ID]) {
    if (!mine) throw new Error(`unchanged ${a.ID} missing on iOS`);
    out.push({ ...mine, Change: 'unchanged', 'Change Reason': '' });
    continue;
  }
  if (d.Change === 'modified') {
    if (!mine) throw new Error(`modified ${a.ID} missing on iOS`);
    const old = a3.get(a.ID)!;
    const row: Row = { ...mine };
    for (const f of FIELDS) if (a[f] !== old[f]) row[f] = iosify(a[f]);
    applyOverride(a.ID, row);
    out.push({ ...row, Change: 'modified', 'Change Reason': tail(`${d['Change Reason']} (as Android v4 ${a.ID})`) });
    continue;
  }
  if (d.Change === 'new') {
    if (mine) throw new Error(`new ${a.ID} already on iOS`);
    const row: Row = { ID: a.ID };
    for (const f of FIELDS) row[f] = iosify(a[f]);
    applyOverride(a.ID, row);
    out.push({ ...row, Change: 'new', 'Change Reason': tail(`${d['Change Reason']} (as Android v4 ${a.ID})`) });
    continue;
  }
  throw new Error(`unexpected change ${d.Change} for ${a.ID}`);
}
const ids = out.map(r => r.ID);
if (new Set(ids).size !== ids.length) throw new Error('duplicate IDs');
for (const r of ios) if (!ids.includes(r.ID)) throw new Error(`approved iOS row ${r.ID} went missing`);
for (const r of out) for (const f of ['Precondition', 'Action', 'Expected Result']) {
  if (/Android|adb\b|Google|logcat|device-android/.test(r[f]) && r.Change !== 'unchanged') throw new Error(`${r.ID} ${f} still names Android: ${r[f]}`);
}
writeFileSync(join(HERE, 'draft.csv'), writeRecords(COLS, out));
const count = (c: string) => out.filter(r => r.Change === c).length;
console.log(`draft.csv: ${out.length} rows · unchanged ${count('unchanged')} · modified ${count('modified')} · new ${count('new')} · removed ${count('removed')}`);
