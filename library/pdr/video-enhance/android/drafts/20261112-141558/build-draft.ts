// Builds draft 20261112-141558 for pdr/video-enhance / android (REQ-015: the 4 groups Android R1 missed, found by the
// run-cost comparison with the Spec Agent, comparisons/2026-11-12_run-cost-vs-spec-agent.html).
// Usage: node library/pdr/video-enhance/android/drafts/20261112-141558/build-draft.ts
// Starts from the approved cases.csv (v6) and requirements.md; modifies TC-052 (1 fps source, the low end of R-043's
// 1–30 band), TC-097 (Google Play test card route), TC-042 / TC-214 / TC-216 / TC-215 (judged from a screen recording,
// Q-27 for the allowed delay); every other row is `unchanged`.
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readRecords, writeRecords } from '../../../../../../scripts/lib/csv.ts';

const HERE = dirname(fileURLToPath(import.meta.url));
const COLS = ['ID', 'Section', 'Precondition', 'Action', 'Expected Result', 'Priority', 'Spec Ref', 'Notes', 'Change', 'Change Reason'];
const rows = readRecords(readFileSync(join(HERE, '..', '..', 'cases.csv'), 'utf8')).map(r => ({ ...r, Change: 'unchanged', 'Change Reason': '' }));
const set = (id: string, f: Record<string, string>, reason: string) => {
  const r = rows.find(x => x.ID === id); if (!r) throw new Error(id);
  Object.assign(r, f, { Change: 'modified', 'Change Reason': reason });
};

// 1. Ranges: both outer ends (analysis.md pass 4, REQ-015).
set('TC-052', {
  Precondition: '1. Signed in with a Pro+ account (no tier switch on Android)\n2. A 1 fps (ve-fps1-1080p), a 24 fps and a 30 fps video in the album',
  Action: '1. Open the panel with the 1 fps video\n2. Go back and open it with the 24 fps video\n3. Go back and open it with the 30 fps video',
  'Expected Result': 'Step 1: 「30fps」 is selected and the fps chips are enabled as for any 1–30 fps source\nStep 1: the Preview label reads 「1fps · …」\nStep 2: 「30fps」 is selected\nStep 2: the Preview label reads 「24fps · …」\nStep 3: 「30fps」 is selected\nStep 3: the Preview label reads 「30fps · …」',
  Notes: '1 fps is the lowest value of R-043\'s 1–30 band (analysis.md pass 4, ranges: both outer ends) [Req: REQ-015]; the Spec Agent saw no fps selected and every fps chip disabled for a 1 fps source.',
}, 'REQ-015: add the 1 fps source, the low end of R-043\'s 1–30 band; R1 took only the edges between bands');

// 2. Free route before parking (analysis.md value check 4, REQ-015).
set('TC-097', {
  Precondition: '1. TC-096 setup: Credit page open from the panel\n2. The signed-in Google account is a license tester of PowerDirector on Google Play, so the purchase sheet offers 「Test card, always approves」 (no charge)\n3. The user\'s go-ahead for this purchase',
  Action: '1. Tap 「Buy More」\n2. Pick a credit pack\n3. Pay with 「Test card, always approves」 on the Google Play purchase sheet',
  'Expected Result': 'After step 3 the app returns to the panel\nThe credit pill shows the new balance (old balance + the pack)\nThe selection and the settings are kept',
  Notes: 'Needs the user\'s go-ahead (Google Play test card, no charge; fixtures.md) [Req: REQ-015]. The Spec Agent bought the same pack this way and the app returned to My Credits, not the panel.',
}, 'REQ-015: the purchase has a free route (license tester + Google Play test card), so the row is no longer parked; only the go-ahead is needed');

// 3. During a gesture: judged from a recording (analysis.md pass 4, run-android.md › Judging a drag, Q-27).
const REC = 'Evidence: screen recording of the whole drag (run-android.md, *Judging a drag*); the fixture burns its time into every frame. Allowed delay: Q-27 (assumed: no visible lag).';
const LAG = 'REQ-015: judged from a screen recording at several moments of the drag, not one screenshot; allowed delay asked in Q-27 (the Spec Agent\'s recording showed the Preview stuck on older frames)';
set('TC-042', {
  Action: '1. Start a screen recording\n2. Drag the right handle left to about 06:00 over 2–3 seconds\n3. Stop the recording',
  'Expected Result': 'Step 2: at every sampled moment of the drag the Preview shows the frame at the right handle (its burned-in time matches the handle\'s time, no visible lag)\nStep 2: 「Selected Length」 follows (about 「06:00」 at the end)\nStep 2: the CTA price drops at once',
  Notes: REC,
}, LAG);
set('TC-214', {
  Action: '1. Start a screen recording\n2. Drag the left handle right to about 02:00 over 2–3 seconds\n3. Stop the recording',
  'Expected Result': 'Step 2: at every sampled moment of the drag the Preview shows the frame at the left handle (its time follows toward 「02:00/12:30」, no visible lag)\nStep 2: the selection ends about 02:00–08:00 and 「Selected Length」 follows (about 「06:00」)\nStep 2: the right handle stays at 08:00\nStep 2: the CTA price drops at once',
  Notes: `Twin of TC-042 (analysis pass 11: either side handle is its own control). ${REC}`,
}, LAG);
set('TC-216', {
  Action: '1. Start a screen recording\n2. Drag the left handle as far left as it goes over 2–3 seconds\n3. Stop the recording',
  'Expected Result': 'Step 2: at every sampled moment of the drag the Preview shows the frame at the left handle (its time follows the handle back toward 「04:30/12:30」, no visible lag)\nStep 2: the left handle stops at 04:30 (「Selected Length」 「08:00」) with a light haptic and the bubble 「Up to 8 minutes in Standard mode」\nStep 2: the right handle stays at 12:30',
  Notes: `Twin of TC-044 for the left handle. PM-only: no Design frame yet (PM 9/29 UI). ${REC}`,
}, LAG);
set('TC-215', {
  Action: '1. Look at the strip\n2. Start a screen recording\n3. Drag the ◀▶ knob under the 「00:00」 bubble to the right to about 03:00\n4. Drag the knob back to the left to about 01:00\n5. Drag the knob right and left several times without letting go\n6. Let go at about 02:00\n7. Stop the recording',
  'Expected Result': 'Step 1: a playhead line sits at the selection start with the bubble 「00:00」 above the strip and the ◀▶ knob under it\nStep 1: the Preview reads 「00:00/12:30」\nStep 3: the playhead moves later\nStep 3: at every sampled moment the bubble, the Preview time and the frame\'s burned-in time agree (about 「03:00」 and 「03:00/12:30」 at the end, no visible lag)\nStep 4: it moves earlier the same way (about 「01:00」 and 「01:00/12:30」)\nStep 5: the bubble, the Preview time and the frame follow the knob both ways at every sampled moment\nStep 6: they stop at about 「02:00」\nSteps 3–6: both trim handles, 「Selected Length」 「08:00」 and the CTA price stay the same',
  Notes: `The knob (round/ic_btn_drag) is the playhead, not a trim handle (analysis pass 11, role from the board image). Q-21: how far the playhead may go is not stated. ${REC}`,
}, LAG);
writeFileSync(join(HERE, 'draft.csv'), writeRecords(COLS, rows));

let req = readFileSync(join(HERE, '..', '..', 'requirements.md'), 'utf8');
const rep = (re: RegExp, to: string) => { if (!re.test(req)) throw new Error('not found: ' + re); req = req.replace(re, to); };
rep(/(Draft 20261111-170000 \[Req: REQ-011\][^\n]*\n(?:[^\n]+\n)*?removed: Q-23 \(no 2K\+ block, no message to ask about\)\.\n)/,
  '$1\nDraft 20261112-141558 [Req: REQ-015]: the 4 groups Android R1 missed (run-cost comparison with the Spec Agent,\n' +
  '`comparisons/2026-11-12_run-cost-vs-spec-agent.html`). R-043\'s 1–30 band is taken at its low end too (1 fps, TC-052);\n' +
  'R-077 has a free route (Google Play test card, TC-097); R-031 and R-193 are timing rules judged from a screen\n' +
  'recording (TC-042, TC-214, TC-216, TC-215). Changed: R-031, R-077, R-193; new: Q-27.\n');
rep(/^(- R-031 \[[^\n]*?)\(Two controls, one row each: analysis pass 11\.\)$/m,
  '$1The frame follows the handle while it moves, not only when it stops: a timing rule judged from a screen recording of the whole drag; the allowed delay is not stated (Q-27) [Req: REQ-015]. (Two controls, one row each: analysis pass 11.)');
rep(/^(- R-077 \[[^\n]*?the selection kept\.)$/m,
  '$1 Run with a license-tester account and Google Play\'s 「Test card, always approves」 (no charge) on the user\'s go-ahead [Req: REQ-015].');
rep(/^(- R-193 \[[^\n]*?)\(how far it may go: Q-21\)\.$/m,
  '$1(how far it may go: Q-21). The frame, the bubble and the Preview time follow during the drag, not only at the end: a timing rule judged from a screen recording; allowed delay: Q-27 [Req: REQ-015].');
rep(/^(- Q-24 Strip scale[^\n]*\n)/m,
  '$1- Q-27 Preview delay while dragging (REQ-015): R-031 and R-193 say the Preview shows the frame at the dragged handle or playhead, but no source says how closely it must keep up during the drag (the Spec Agent\'s recording showed the Preview stuck on older frames mid-drag). Assumption: no visible lag: at every sampled moment of the recording (4 frames a second) the frame\'s time is within about 0.5 s of the handle\'s; a larger gap is recorded with its size and duration and filed to PM for a decision. R-031, R-193 (TC-042, TC-214, TC-216, TC-215).\n');
rep(/^\| R-043 \| source 1–30 fps → 30fps \| TC-052 \|$/m, '| R-043 | source 1–30 fps → 30fps (1, 24, 30 fps: the band\'s low end and both edges) | TC-052 |');
rep(/^(\| R-142 \| the refund is automatic [^\n]*\n)/m,
  '$1| R-031 | the Preview keeps up with the handle during the drag (Q-27) | a screen recording sampled at 4 frames a second: the burned-in time against the handle\'s | TC-042, TC-214, TC-216 |\n' +
  '| R-193 | the bubble, the Preview time and the frame keep up with the knob during the drag (Q-27) | a screen recording sampled at 4 frames a second | TC-215 |\n');
rep(/^(\| REQ-012 \(rulings, Android: no Pro\+; no 「You're all set」 dialog\) \| [^\n]*\n)/m,
  '$1| REQ-015 (table, Android: the 4 groups R1 missed — 1 fps default, purchase return, 2 Preview lags) | R-043 (1 fps, TC-052), R-077 (free route, TC-097), R-031, R-193 (recording; TC-042, TC-214, TC-216, TC-215), Q-27 |\n');
writeFileSync(join(HERE, 'requirements.md'), req);
console.log('draft.csv and requirements.md written');
