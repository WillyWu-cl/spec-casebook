// Fills the control traces of the iOS and Android drafts (20261104-100851) after scripts/controls.ts wrote them.
// controls.ts carries every trace of draft 20261103-174203 over (fill-controls.ts there holds them); this file only
// sets what the 2026-11-04 rerun changed under analysis.md pass 11 (twin and look-alike controls, REQ-004):
// the two trim handles (new inventory overrides) get their own rows, the playhead knob is no longer traced to a trim
// row, and groups whose copies do different things (one component on two screens, a top bar holding three buttons)
// name the row for each.
// Usage: node scripts/controls.ts pdr/video-enhance <ios|android> --draft 20261104-100851, then
//        node library/pdr/video-enhance/ios/drafts/20261104-100851/fill-controls.ts
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const press: Record<string, string> = {
  // twins: each end of the selection is its own control, each with its own limit rows
  'K-0907bf': 'TC-214, TC-216, TC-217, TC-218',
  'K-8a6c94': 'TC-042, TC-044, TC-046, TC-073, TC-074, TC-075',
  // the PM low-fi bar 「Trim · drag in / out」: both ends
  'K-c00c5d': 'TC-042, TC-214',
  // round/ic_btn_drag under the 「00:00」 bubble is the playhead (board image), not the trim handle (was TC-042)
  'K-cc0164': 'TC-215',
  // look-alikes: one component, different actions
  'K-b20a38': 'TC-143, TC-131', // 「View」 on the completed card (→ Result) and on the Launcher banner (→ Result of that task)
  'K-405d36': 'TC-143', // the completed card's thumbnail: step 4 of TC-143 taps it (Q-22)
  'K-292740': 'TC-038, TC-140', // the panel's top bar: ‹ (TC-038), the Recent task icon (TC-140); the credit pill is Q-15
  'K-3d5ae6': 'TC-038, TC-140, TC-141', // PM header on the panel (‹, Recent icon) and on Recent task (‹)
  'K-5a6020': 'TC-151, TC-155', // the Result top bar: the Original / Result tabs (TC-151) and ‹ (TC-155)
  'K-5bc434': 'TC-037, TC-150', // play on the panel Preview and on the Result player
  'K-852b24': 'TC-021, TC-094, TC-155', // PM header ‹ on the media picker, the IAP Pro+ page and the Result
  // setting values used end to end (pass 10): every value of each set has a generating row
  'C-b7ee84': 'TC-070, TC-219',
  'C-ade8d5': 'TC-061, TC-220',
  'K-7928fc': 'TC-062, TC-221, TC-222',
  'C-47139e': 'TC-063, TC-224, TC-223',
};
const root = join(import.meta.dirname, '..', '..', '..');
for (const p of ['ios', 'android']) {
  const f = join(root, p, 'drafts', '20261104-100851', 'control-trace.json');
  const j = JSON.parse(readFileSync(f, 'utf8'));
  const missing: string[] = [], seen = new Set<string>();
  for (const e of j.entries) {
    const v = press[e.group];
    if (v) { e.press = v; e.how = 'trace'; seen.add(e.group); }
    else if (!e.press) missing.push(`${e.group} ${e.name} ${e.label}`);
  }
  writeFileSync(f, JSON.stringify(j, null, 1) + '\n');
  console.log(p, j.entries.length, 'untraced:', missing, 'not found:', Object.keys(press).filter(g => !seen.has(g)));
}
