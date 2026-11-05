// Fills the control traces of the iOS and Android drafts (20261103-174203) after scripts/controls.ts wrote them:
// every control group gets the rows that press it, or n/a with the reason (analysis pass 11, REQ-038). The auto label
// matches of controls.ts are replaced here because several were hints only (「Video」 matched every 「AI Video Enhance」).
// Usage: node scripts/controls.ts pdr/video-enhance <ios|android> --draft 20261103-174203, then
//        node library/pdr/video-enhance/ios/drafts/20261103-174203/fill-controls.ts
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const LAUNCHER = 'n/a: another feature\'s Launcher entry or content (not part of this spec)';
const EDITOR = 'n/a: editor control outside this feature (the spec only uses the clip toolbar tool)';
const PICKER = 'n/a: shared PowerDirector media picker control; this spec only states the Video tab and the single pick';
const PAYWALL = 'n/a: existing paywall control (legal pages, Restore purchase asks for the store password, KP-047); this spec only states the page opens';
const CREDIT = 'n/a: existing Credit page control (credit history / info, KP-041); this spec only states the page and its Buy More / Claim';
const press: Record<string, string> = {
  'K-26a1f3': 'TC-038', 'K-03b211': 'TC-097', 'K-8ac5b0': 'TC-098', 'K-7bbe4f': 'TC-132', 'K-a0001f': 'TC-171', 'K-1534be': 'TC-171',
  'K-e9b36e': 'n/a: decorative credit icon on the Credit page', 'K-f41f41': 'TC-171', 'K-70f6bd': 'n/a: Launcher trial chip (MX entry, not this spec)',
  'K-19855b': 'TC-031', 'K-ccef11': 'TC-001', 'C-d0e46f': 'TC-112, TC-113',
  'K-2e2e19': 'n/a: AI Magic tab credit pill, outside this feature (what the pill opens is Q-15)', 'K-ab95a4': 'TC-134', 'K-b687c3': 'TC-002', 'C-86cee4': 'TC-002',
  'K-307e97': EDITOR, 'C-7599a0': EDITOR, 'K-1faca7': EDITOR, 'K-3f0dc2': EDITOR, 'K-83ad9d': EDITOR, 'K-d2a603': EDITOR,
  'C-da44ac': 'TC-003', 'K-68e6ce': 'TC-110', 'K-716732': 'TC-010', 'K-acf5d3': LAUNCHER, 'K-cb4ed0': 'TC-144', 'K-00521c': 'TC-090, TC-091',
  'K-b20a38': 'TC-143', 'K-4c6779': LAUNCHER, 'C-4b3357': LAUNCHER, 'K-c21584': 'TC-117', 'K-31465e': 'TC-143', 'K-405d36': 'TC-143',
  'K-f8a19d': 'TC-013, TC-014', 'C-b7ee84': 'TC-070', 'C-ade8d5': 'TC-061', 'K-7928fc': 'TC-062', 'C-47139e': 'TC-063', 'K-4d5a60': 'TC-095',
  'C-4c31d3': 'TC-002, TC-134', 'K-3997e4': 'n/a: Launcher trial banner (MX entry, not this spec)', 'K-df90b7': 'TC-111', 'K-0a7411': 'TC-093',
  'C-576f65': PAYWALL, 'C-75d545': 'TC-093', 'K-7e0c35': 'TC-010, TC-020', 'K-843422': 'TC-002', 'K-292740': 'TC-038', 'K-d8c7f4': 'TC-013',
  'K-5a6020': 'TC-151', 'K-fa970e': 'TC-153', 'K-0a5609': 'TC-152', 'K-d57575': 'TC-154',
  'K-b4c3e5': LAUNCHER, 'K-317db2': LAUNCHER, 'K-12b9eb': LAUNCHER, 'K-ef4956': LAUNCHER, 'K-f1a959': LAUNCHER, 'K-df2bb9': LAUNCHER, 'K-29583c': LAUNCHER,
  'K-453675': LAUNCHER, 'K-713933': LAUNCHER, 'K-844c30': LAUNCHER, 'K-21337e': LAUNCHER, 'K-aeb618': 'TC-001',
  'K-cc0164': 'TC-042', 'K-cbf2ec': PICKER, 'K-acb3ab': PICKER, 'K-97465d': PICKER, 'K-c0e83a': 'TC-010', 'K-f7abb2': 'TC-021, TC-094, TC-141',
  'K-ffb4aa': PAYWALL, 'K-36828b': 'TC-037', 'K-3d59eb': 'TC-142', 'K-f71d57': 'TC-031, TC-035, TC-036', 'K-5bc434': 'TC-037', 'K-e1c8f3': 'TC-150',
  'K-1b288e': 'n/a: source info label, not tappable (checked in TC-033 and TC-052)', 'K-aa34dd': 'TC-020',
  'K-8288c8': 'TC-097', 'K-a17b43': 'TC-098', 'K-cac71c': 'n/a: decorative credit icon on the Credit page', 'K-3d4383': 'TC-090', 'K-80d991': 'TC-095',
  'K-f72c27': 'TC-093', 'K-4cbea4': CREDIT, 'K-f0669c': CREDIT, 'K-62c42c': CREDIT, 'K-69af1c': 'TC-171', 'K-0324e7': 'TC-171',
  'C-00f911': LAUNCHER, 'K-34e105': LAUNCHER, 'K-a2c659': 'TC-131', 'C-d601b1': 'TC-119, TC-120', 'K-fbb40d': 'TC-132', 'C-b683d4': 'TC-002',
  'K-43979f': 'n/a: PM low-fi 「Frame rate · Same as source」 field (drawn disabled), superseded by the Design fps chips (TC-062)',
  'K-c00c5d': 'TC-042', 'K-2158a3': 'TC-080, TC-110', 'K-c192ce': 'TC-111', 'C-cff91d': 'TC-152, TC-153, TC-154', 'C-397b4c': 'TC-070',
  'C-bd71fb': 'TC-061', 'C-ff031c': 'TC-063', 'C-d4deda': 'TC-020', 'C-5e866f': 'TC-143', 'K-852b24': 'TC-021, TC-155', 'K-3d5ae6': 'TC-038, TC-141',
  'K-7271c7': 'n/a: Launcher trial chip (MX entry, not this spec)', 'K-989b76': LAUNCHER, 'K-e6cd12': LAUNCHER, 'K-b7942f': LAUNCHER,
  'K-1f3afe': 'TC-141', 'K-a02eaf': LAUNCHER, 'K-a044ba': LAUNCHER, 'K-8979a4': LAUNCHER, 'K-f29164': 'TC-142', 'K-f967b9': LAUNCHER, 'K-44ab14': LAUNCHER,
  'K-3e67b6': LAUNCHER, 'K-771908': LAUNCHER, 'K-5e2717': 'TC-001', 'K-c9a342': LAUNCHER, 'K-041ec9': LAUNCHER, 'K-46850e': 'TC-003',
};
const root = join(import.meta.dirname, '..', '..', '..');
for (const p of ['ios', 'android']) {
  const f = join(root, p, 'drafts', '20261103-174203', 'control-trace.json');
  const j = JSON.parse(readFileSync(f, 'utf8'));
  const missing: string[] = [];
  for (const e of j.entries) {
    const v = press[e.group];
    if (!v) { missing.push(`${e.group} ${e.name} ${e.label}`); continue; }
    e.press = v; e.how = 'trace';
  }
  writeFileSync(f, JSON.stringify(j, null, 1) + '\n');
  console.log(p, j.entries.length, 'missing:', missing);
}
