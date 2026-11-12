// Builds draft 20261112-170000 for pdr/video-enhance on the platform whose drafts/ folder holds this file
// (REQ-016: the scenario-level comparison with spec agent commit 8b411402 found cases the tables match by rule but not
// by scenario: other fixture values, the other direction, exact boundaries, more durations in a price list).
// Usage: node library/pdr/video-enhance/<android|ios>/drafts/20261112-170000/build-draft.ts
// The same file sits in both platforms' draft folders; it starts from that platform's approved cases.csv and keeps
// every platform difference already in it (tier line, gallery, purchase sheet, Q-26 note).
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readRecords, writeRecords } from '../../../../../../scripts/lib/csv.ts';

const HERE = dirname(fileURLToPath(import.meta.url));
const PLATFORM = basename(dirname(dirname(HERE))) as 'android' | 'ios';
const AND = PLATFORM === 'android';
const COLS = ['ID', 'Section', 'Precondition', 'Action', 'Expected Result', 'Priority', 'Spec Ref', 'Notes', 'Change', 'Change Reason'];
type Row = Record<string, string>;
const rows: Row[] = readRecords(readFileSync(join(HERE, '..', '..', 'cases.csv'), 'utf8')).map(r => ({ ...r, Change: 'unchanged', 'Change Reason': '' }));
const get = (id: string) => { const r = rows.find(x => x.ID === id); if (!r) throw new Error(id); return r; };
const TIER = AND ? '1. Signed in with a Pro+ account (no tier switch on Android)'
  : '1. Tier Pro+ (Launcher › Pink › ☰ › [0] IAP › status = Pro+, checked in Mine)';
const Q26 = AND ? '' : ' On iOS the numbers wait on the iOS ECL rates (Q-26): a different number shown is checked against the iOS ECL table before it is filed.';
const REQ = '[Req: REQ-016]';
const set = (id: string, f: Row, reason: string) => Object.assign(get(id), f, { Change: 'modified', 'Change Reason': `REQ-016: ${reason}` });
let next = 270;
const added: { after: string; row: Row }[] = [];
const add = (after: string, f: Omit<Row, 'ID'>, reason: string) => {
  const row = { ID: `TC-${next++}`, ...f, Change: 'new', 'Change Reason': `REQ-016: ${reason}` } as Row;
  added.push({ after, row });
  return row.ID;
};
const lines = (...l: string[]) => l.join('\n');
const steps = (...l: string[]) => l.map((s, i) => `${i + 1}. ${s}`).join('\n');

// ── 1. Entry: the clip toolbar groups the tool under 「Enhance」 on the build (R1 TC-003), and the Demo is not yet off
set('TC-003', {
  Precondition: lines(get('TC-003').Precondition.split('\n')[0], '2. A project open in the editor with one video clip of 2:30 or less on the timeline', '3. 「Don\'t show again」 on the Demo page not saved yet (run before TC-014)'),
  Action: steps('Tap the clip on the timeline', 'Tap 「AI Video Enhance」 in the clip toolbar (inside its 「Enhance」 group when the toolbar groups the tools)'),
  'Expected Result': lines('The AI Video Enhance panel opens directly with that clip in the Preview', 'No Demo page and no Add Media appear, although the Demo has not been turned off'),
  Notes: 'PM calls the tool 「Enhance」 (pm-timeline); the Design draws 「AI Video Enhance」 directly in the toolbar, the R1 build groups it under 「Enhance」 (the spec agent\'s path, TC-VE2-003): either way passes, the grouping is recorded. Demo not yet off: spec agent TC-VE2-009 ' + REQ + '. Whether the trim applies to a Timeline clip is Q-10.',
}, 'the spec agent reaches the tool through the toolbar\'s 「Enhance」 group (as R1 found) and runs it before the Demo is turned off (TC-VE2-003, TC-VE2-009)');

// ── 2. Default selection at exact lengths (R-030)
add('TC-041', {
  Section: 'Trim and selected length',
  Precondition: lines(TIER, '2. Videos of 00:01 (ve-000100-720p30), 07:59 (ve-0759-1080p30), 07:59.97 (ve-075997-1080p30, one frame under 8:00), 08:00 (ve-0800-1080p30), 08:00.03 (ve-080003-1080p30, one frame over) and 08:01 (ve-0801-1080p30) in the album, lengths checked with ffprobe', '3. Each video\'s time is burned into its frames'),
  Action: steps('Open the panel with the 00:01 video', 'Go back and open it with the 07:59 video', 'Go back and open it with the 07:59.97 video', 'Drag the playhead to the right handle', 'Go back and open it with the 08:00 video', 'Go back and open it with the 08:00.03 video', 'Drag the playhead to the right handle', 'Go back and open it with the 08:01 video'),
  'Expected Result': lines('Every video opens in 「Standard」 with the selection starting at 00:00',
    'Step 1: the whole video is selected, 「Selected Length」 「00:01」, the CTA 「Enhance ◆ 1」',
    'Step 2: the whole video is selected, 「Selected Length」 「07:59」, 「Enhance ◆ 958」 (2 credits/s at 1080p)',
    'Steps 3–4: the whole video is selected: the frame at the right handle is the video\'s last (burned-in 07:59.9x)', 'Steps 3–4: 「Selected Length」 shows 479.97 s as the app rounds it (record it)', 'Steps 3–4: the CTA reads 「Enhance ◆ 960」 (480 s rounded up × 2)',
    'Step 5: 00:00–08:00, the whole video, 「Selected Length」 「08:00」, 「Enhance ◆ 960」',
    'Steps 6–7: the selection is 00:00–08:00, not the whole video: the frame at the right handle reads 08:00.00, not the last frame', 'Steps 6–7: 「Selected Length」 「08:00」 and 「Enhance ◆ 960」',
    'Step 8: 00:00–08:00 with 「Selected Length」 「08:00」 and 「Enhance ◆ 960」'),
  Priority: 'P2', 'Spec Ref': 'R-030, R-050, R-060',
  Notes: `The 8:00 default at whole and fractional lengths (spec agent TC-VE2-099 – TC-VE2-102, TC-VE2-251, TC-VE2-252) ${REQ}. Prices are Standard / Natural / 30fps at the source's default resolution (1 s video 720p = 1/s, the others 1080p = 2/s).${Q26} Needs the six fixture videos.`,
}, 'the default selection read at 1 s, 479 s, 479.97 s, 480 s, 480.03 s and 481 s (TC-VE2-099 – 102, 251, 252); the rows only opened 12:30 and 01:30');

// ── 3. Body drag: both directions, the full 08:00 selection and three shorter ones (R-032)
set('TC-043', {
  Precondition: 'Panel open with the 12:30 video in Standard, the default selection 00:00–08:00 (「08:00」)',
  Action: steps('Drag the middle of the selection to the right as far as it goes', 'Drag the middle of the selection to the left until its start is about 02:00'),
  'Expected Result': lines('Step 1: both handles move by the same amount and stop with the end at 12:30 (start 04:30)', 'Step 1: 「Selected Length」 stays 「08:00」 and the Preview shows the frame at the new start (burned-in 04:30)', 'Step 2: both handles move back by the same amount (about 02:00–10:00)', 'Step 2: 「Selected Length」 stays 「08:00」 and the Preview shows the frame at the new start'),
  Notes: `Both directions with the full 8:00 selection (spec agent TC-VE2-232, TC-VE2-233) ${REQ}.`,
}, 'drag the middle both ways with the full 08:00 selection; the row dragged a 6:00 selection one way (TC-VE2-232, 233)');
add('TC-043', {
  Section: 'Trim and selected length',
  Precondition: lines(TIER, '2. A 05:24 (324 s) 1080p 30 fps video with its time burned in (ve-0524-1080p30) in the album', '3. Panel open with it in Standard'),
  Action: steps('Trim the selection to 01:00–01:30 (「00:30」)', 'Drag the middle of the selection to the right until its start is about 03:00', 'Drag the middle to the left until its start is about 00:30', 'Trim the selection to 01:00–02:30 (「01:30」)', 'Drag the middle to the right until its start is about 03:00', 'Drag the middle to the left until its start is about 00:30', 'Trim the selection to 01:00–04:00 (「03:00」)', 'Drag the middle to the right as far as it goes', 'Drag the middle to the left until its start is about 00:30'),
  'Expected Result': lines('After every drag both handles have moved by the same amount', 'After every drag 「Selected Length」 is unchanged: 「00:30」 in steps 2–3, 「01:30」 in steps 5–6, 「03:00」 in steps 8–9', 'After every drag the Preview shows the frame at the new start (its burned-in time equals the start)', 'Step 8: the end stops at 05:24 (start 02:24)'),
  Priority: 'P3', 'Spec Ref': 'R-032',
  Notes: `Spec agent TC-VE2-104 – TC-VE2-109 (30 s, 90 s and 180 s selections dragged both ways on a 324 s source) ${REQ}. Needs ve-0524-1080p30.`,
}, 'the spec agent drags 30 s, 90 s and 180 s selections both ways (TC-VE2-104 – 109); no row did');

// ── 4. Handles: the right handle dragged later, the left handle dragged earlier under the cap, no fractional overrun
const REC = 'Evidence: screen recording of the whole drag (run-android.md, *Judging a drag*); the fixture burns its time into every frame. Allowed delay: Q-27 (assumed: no visible lag).';
set('TC-044', {
  Action: steps('Start a screen recording', 'Drag the right handle to the right as far as it goes over 2–3 seconds', 'Keep pushing it right for a second', 'Stop the recording'),
  'Expected Result': lines('Step 2: at every sampled moment the Preview shows the frame at the right handle (its burned-in time follows toward 08:00, no visible lag)', 'Step 2: 「Selected Length」 grows with the handle', 'Step 2: the handle stops at 8:00 (「Selected Length」 「08:00」) with a light haptic and the bubble 「Up to 8 minutes in Standard mode」', 'Step 3: the handle stays at 8:00 and 「Selected Length」 never reads 「08:01」'),
  Notes: `PM-only: no Design frame yet (PM 9/29 UI). The right handle dragged later (spec agent TC-VE2-023, TC-VE2-113); TC-042 drags it earlier ${REQ}. ${REC}`,
}, 'the right handle dragged later with the Preview followed during the drag (TC-VE2-023, 113); only the earlier drag was recorded');
add('TC-216', {
  Section: 'Trim and selected length',
  Precondition: lines(TIER, '2. Panel open with the 05:24 video (ve-0524-1080p30) in Standard', '3. The selection trimmed to 02:00–03:30 (「01:30」)'),
  Action: steps('Start a screen recording', 'Drag the left handle to the left until it is at about 01:30, over 2–3 seconds', 'Stop the recording'),
  'Expected Result': lines('Step 2: at every sampled moment the Preview shows the frame at the left handle (no visible lag)', 'Step 2: 「Selected Length」 grows with the drag and ends at 「02:00」 (end − start)', 'Step 2: the right handle stays at 03:30', 'Step 2: no limit bubble shows (still under 8:00)'),
  Priority: 'P3', 'Spec Ref': 'R-031, R-033',
  Notes: `The left handle lengthening a selection under the cap (spec agent TC-VE2-157); TC-216 only checks the stop at 8:00 ${REQ}. ${REC}`,
}, 'the left handle lengthening the selection under the cap (TC-VE2-157)');
add('TC-218', {
  Section: 'Mode length limit',
  Precondition: lines(TIER, '2. Panel open with the 12:30 video (time burned into every frame)'),
  Action: steps('In Standard trim the selection to 01:00–08:59 (「07:59」)', 'Drag the left handle to the left as far as it goes and keep pushing for a second', 'Drag the playhead to each handle and read the burned-in times', 'Trim the selection to 01:00–08:59 again', 'Drag the right handle to the right as far as it goes and keep pushing for a second', 'Drag the playhead to each handle and read the burned-in times', 'Trim the selection to 05:00–07:29 (「02:29」) and tap 「Professional」', 'Drag the left handle to the left as far as it goes and keep pushing for a second', 'Drag the playhead to each handle and read the burned-in times', 'Trim the selection to 05:00–07:29 again', 'Drag the right handle to the right as far as it goes and keep pushing for a second', 'Drag the playhead to each handle and read the burned-in times'),
  'Expected Result': lines('Step 2: the left handle stops 1 s further out (00:59) with the bubble 「Up to 8 minutes in Standard mode」 and 「Selected Length」 「08:00」', 'Step 3: end − start is exactly 8:00.00 by the burned-in times (never 8:00.0x)', 'Step 5: the right handle stops at 09:00 with the same bubble and 「08:00」', 'Step 6: end − start is exactly 8:00.00', 'Step 8: the left handle stops at 04:59 with the bubble 「Up to 2m 30s in Professional mode」 and 「02:30」', 'Step 9: end − start is exactly 2:30.00 (never 2:30.0x)', 'Step 11: the right handle stops at 07:30 with the same bubble and 「02:30」', 'Step 12: end − start is exactly 2:30.00'),
  Priority: 'P2', 'Spec Ref': 'R-033, R-050, R-054',
  Notes: `No fractional overrun at the four caps, starting 1 s under each (spec agent TC-VE2-256 – TC-VE2-259) ${REQ}. The playhead may land a frame off a handle: read the frame at the handle itself.`,
}, 'each of the four caps approached from 1 s under it, checked to the frame (TC-VE2-256 – 259)');

// ── 5. Mode switch: start and end kept, price, a later start, Timeline clip
set('TC-075', {
  Precondition: 'Panel open with the 12:30 video, Professional selected, selection 00:30–03:00 (「02:30」)',
  Action: steps('Tap 「Standard」', 'Drag the right handle to the right as far as it goes'),
  'Expected Result': lines('Step 1: the Mode is 「Standard」 and the selection is still 00:30–03:00 (start, end and 「02:30」 unchanged)', 'Step 2: the selection lengthens past 2:30 and stops at 08:30 (「08:00」)', 'Step 2: 「Selected Length」 never reads 「08:01」'),
  Notes: `Start and end, not only the length, and the Standard cap after the switch (spec agent TC-VE2-244) ${REQ}.`,
}, 'check start and end after the switch back and the 8:00 stop (TC-VE2-244)');
add('TC-263', {
  Section: 'Mode length limit',
  Precondition: lines(TIER, '2. Panel open with the 12:30 1080p video in Standard / Natural / 30fps'),
  Action: steps('Tap 「720p」', 'Trim the selection to 00:30–02:50 (「02:20」)', 'Tap 「Professional」', 'Tap 「Standard」', 'Drag the right handle to 02:59 (「02:29」)', 'Tap 「Professional」', 'Tap 「Standard」', 'Drag the right handle to 03:00 (「02:30」)', 'Tap 「Professional」', 'Tap 「Standard」', 'Drag the right handle to 03:01 (「02:31」)', 'Tap 「Professional」'),
  'Expected Result': lines('Step 1: 「720p」 is selected, 「1080p」 is not, and the line reads 「Charge 1 credits per second」',
    'Step 2: 「Enhance ◆ 140」', 'Step 3: 「Professional」 with no toast, the selection still 00:30–02:50, 「Charge 2 credits per second」, 「Enhance ◆ 280」', 'Step 4: 「Standard」, 00:30–02:50, 「Enhance ◆ 140」',
    'Step 5: 「Enhance ◆ 149」', 'Step 6: 「Professional」 with no toast, 00:30–02:59, 「Enhance ◆ 298」', 'Step 7: 00:30–02:59, 「Enhance ◆ 149」',
    'Step 8: 「Enhance ◆ 150」', 'Step 9: 「Professional」 with no toast, 00:30–03:00, 「Enhance ◆ 300」', 'Step 10: 00:30–03:00, 「Enhance ◆ 150」',
    'Step 11: 「Enhance ◆ 151」', 'Step 12: the toast 「Professional supports clips up to 2:30. Shorten your selection to switch.」 for about 3 s, the Mode stays 「Standard」, the selection keeps 00:30–03:01 and 「Enhance ◆ 151」'),
  Priority: 'P1', 'Spec Ref': 'R-052, R-053, R-055, R-063, R-065, R-061',
  Notes: `Mode switches both ways at 140, 149, 150 and 151 s with a start after 00:00, and the price each way (spec agent TC-VE2-226, TC-VE2-228, TC-VE2-260 – TC-VE2-263); step 1 taps 「720p」, which no other row taps (TC-VE2-034) ${REQ}. ECL rates: Standard 720p 30fps 1/s, Professional 2/s.${Q26}`,
}, 'Mode switches with a later start and their prices (TC-VE2-226, 228, 260 – 263) and tapping 720p (TC-VE2-034)');
add(`TC-${next - 1}`, {
  Section: 'Mode length limit',
  Precondition: lines(TIER, '2. Panel open with the 12:30 video in Standard (time burned into every frame)'),
  Action: steps('Trim the selection to start at 00:30 and nudge the right handle until the frame at it reads 02:59.99 (149.99 s selected)', 'Tap 「Professional」', 'Tap 「Standard」', 'Nudge the right handle until the frame at it reads 03:00.01 (150.01 s selected)', 'Tap 「Professional」'),
  'Expected Result': lines('Step 2: 「Professional」 with no toast', 'Step 2: the frames at the handles still read 00:30 and 02:59.99', 'Step 5: the toast 「Professional supports clips up to 2:30. Shorten your selection to switch.」 shows and the Mode stays 「Standard」', 'Step 5: the frames at the handles still read 00:30 and 03:00.01'),
  Priority: 'P3', 'Spec Ref': 'R-052, R-053',
  Notes: `Fractional boundaries with a later start (spec agent TC-VE2-253, TC-VE2-254); TC-261 / TC-262 use whole videos from 00:00 ${REQ}. A handle that cannot be set to the hundredth is recorded with the nearest frame reached.`,
}, 'the 149.99 s / 150.01 s boundaries with a start after 00:00 (TC-VE2-253, 254)');
add('TC-160', {
  Section: 'Timeline entry',
  Precondition: lines(TIER, '2. A project with a 06:00 clip (ve-0600-1080p30)', '3. Panel opened on it from the clip toolbar'),
  Action: steps('Trim the selection to 00:30–05:30 (「05:00」)', 'Tap 「Professional」', 'Drag the right handle left to 02:50 (「02:20」)', 'Tap 「Professional」'),
  'Expected Result': lines('Step 2: the toast 「Professional supports clips up to 2:30. Shorten your selection to switch.」 for about 3 s, the Mode stays 「Standard」 and the selection keeps 00:30–05:30', 'Step 4: 「Professional」 with no toast and the selection keeps 00:30–02:50'),
  Priority: 'P3', 'Spec Ref': 'R-057, R-052, R-053',
  Notes: `A Timeline clip whose selection starts after 00:00 (spec agent TC-VE2-269) ${REQ}. Q-10 as in TC-160. Needs ve-0600-1080p30.`,
}, 'a Timeline clip with a selection that starts after 00:00 (TC-VE2-269)');

// ── 6. Strip layout (Q-24): sources within both caps, and back to Standard after the re-lay
add('TC-045', {
  Section: 'Trim and selected length',
  Precondition: lines(TIER, '2. A 00:30 (ve-0030-1080p30) and a 02:30.00 (ve-023000-1080p30) video in the album'),
  Action: steps('Open the panel with the 00:30 video (Standard)', 'Scroll the strip sideways', 'Tap 「Professional」', 'Scroll the strip sideways', 'Go back and open the panel with the 02:30.00 video (Standard)', 'Scroll the strip sideways', 'Tap 「Professional」', 'Scroll the strip sideways'),
  'Expected Result': lines('Steps 1–2: the whole video fills one strip width with its first and last frames visible and no sideways scroll', 'Steps 3–4: still one width, no sideways scroll', 'Steps 5–6: one width, no sideways scroll', 'Steps 7–8: still one width (exactly at the 2:30 limit), no sideways scroll', 'The thumbnails stay in time order and the selection is the whole video throughout'),
  Priority: 'P3', 'Spec Ref': 'R-034, R-051',
  Notes: `Sources within both caps (spec agent TC-VE2-026) ${REQ}. Q-24 as in TC-045.`,
}, 'sources within both caps keep one strip width in both Modes (TC-VE2-026)');
set('TC-045', {
  Action: steps('Open the panel with the 08:00 video (Standard)', 'Drag the right handle left until 「Selected Length」 reads 「02:00」', 'Tap 「Professional」', 'Scroll the strip sideways', 'Tap 「Standard」', 'Go back and open the panel with the 12:30 video', 'Scroll the strip sideways', 'Drag the right handle left until 「Selected Length」 reads 「02:00」', 'Tap 「Professional」', 'Scroll the strip to its end', 'Tap 「Standard」'),
  'Expected Result': lines('Step 1: the 08:00 strip fills the strip width with no sideways scroll', 'Steps 3–4: the strip is re-laid so 2:30 fills one width and it scrolls sideways', 'Steps 3–4: the selection keeps 00:00–02:00', 'Step 5: the 08:00 strip fills the width again', 'Steps 6–7: the 12:30 strip scrolls sideways with 8:00 filling one width', 'Steps 9–10: the strip is re-laid to 2:30 per width and its end (the 12:30 frame) can be reached', 'Step 11: back to 8:00 per width with no trim made', 'In every step the thumbnails stay in time order and the selection keeps its start, end and length (00:00–02:00 once set)'),
}, 'the 12:30 tail reachable in Professional and back to Standard (TC-VE2-265)');
set('TC-264', {
  Action: steps('Open the panel with the 02:30.01 video (Standard)', 'Drag the right handle left until 「Selected Length」 reads 「02:00」', 'Tap 「Professional」', 'Scroll the strip sideways', 'Tap 「Standard」', 'Go back and open the panel with the 08:01 video', 'Scroll the strip sideways', 'Drag the right handle left until 「Selected Length」 reads 「02:00」', 'Tap 「Professional」', 'Scroll the strip to its end', 'Tap 「Standard」'),
  'Expected Result': lines('Step 1: the 02:30.01 strip fills the strip width (under 8:00)', 'Steps 3–4: in Professional the video is over 2:30, so the strip is re-laid to 2:30 per width and scrolls a little sideways', 'Step 5: the whole video fits one width again', 'Steps 6–7: the 08:01 strip scrolls sideways with 8:00 per width', 'Steps 9–10: re-laid to 2:30 per width and its end (the 08:01 frame) can be reached', 'Step 11: back to 8:00 per width', 'The thumbnails stay in time order and the selection keeps 00:00–02:00 through each Mode switch'),
}, 'back to Standard after each re-lay and the 08:01 tail reachable (TC-VE2-264, 266)');

// ── 7. Default fps / resolution: the other side of each band edge, and the Preview label (R-043, R-044)
const label = (s: string) => `the Preview label reads 「${s}」`;
set('TC-052', {
  Precondition: lines(get('TC-052').Precondition.split('\n')[0], '2. A 1 fps (ve-fps1-1080p), a 24 fps, a 29 fps (ve-fps29-1080p) and a 30 fps 1080p video in the album'),
  Action: steps('Open the panel with the 1 fps video', 'Go back and open it with the 24 fps video', 'Go back and open it with the 29 fps video', 'Go back and open it with the 30 fps video'),
  'Expected Result': lines('Step 1: 「30fps」 is selected and the fps chips are enabled as for any 1–30 fps source', `Step 1: ${label('1fps · 1080p')}`, 'Step 2: 「30fps」 is selected', `Step 2: ${label('24fps · 1080p')}`, 'Step 3: 「30fps」 is selected', `Step 3: ${label('29fps · 1080p')}`, 'Step 4: 「30fps」 is selected', `Step 4: ${label('30fps · 1080p')}`),
  Notes: `1 fps is the lowest value of R-043's 1–30 band (analysis.md pass 4, ranges: both outer ends) [Req: REQ-015]; 29 fps is just under its upper edge (spec agent TC-VE2-079, TC-VE2-081) ${REQ}.${AND ? ' The Spec Agent saw no fps selected and every fps chip disabled for a 1 fps source.' : ''}`,
}, AND ? 'add 29 fps under the 30 fps edge and read the Preview label (TC-VE2-081)' : 'add 1 fps (as Android has) and 29 fps, the band\'s two ends, and read the Preview label (TC-VE2-079, 081)');
set('TC-053', {
  Precondition: lines(get('TC-053').Precondition.split('\n')[0], '2. A 50 fps, a 59 fps (ve-fps59-1080p) and a 60 fps 1080p video in the album'),
  Action: steps('Open the panel with the 50 fps video', 'Go back and open it with the 59 fps video', 'Go back and open it with the 60 fps video'),
  'Expected Result': lines('All three select 「60fps」', `Step 1: ${label('50fps · 1080p')}`, `Step 2: ${label('59fps · 1080p')}`, `Step 3: ${label('60fps · 1080p')}`),
  Notes: `59 fps is just under the 60 fps edge (spec agent TC-VE2-084) ${REQ}.`,
}, 'add 59 fps under the 60 fps edge and read the Preview label (TC-VE2-084)');
set('TC-054', {
  Precondition: lines(get('TC-054').Precondition.split('\n')[0], '2. 119 fps (ve-fps119-1080p), 120 fps, 144 fps (ve-fps144-1080p) and 240 fps (slow-motion) 1080p videos in the album'),
  Action: steps('Open the panel with the 119 fps video', 'Go back and open it with the 120 fps video', 'Go back and open it with the 144 fps video', 'Go back and open it with the 240 fps video'),
  'Expected Result': lines('All four select 「120fps」 (119 is the smallest option not below it; above 120 the highest option)', `Step 1: ${label('119fps · 1080p')}`, `Step 2: ${label('120fps · 1080p')}`, `Step 3: ${label('144fps · 1080p')}`, `Step 4: ${label('240fps · 1080p')}`),
  Notes: `119 and 144 fps either side of the 120 fps edge (spec agent TC-VE2-087 – TC-VE2-090) ${REQ}.`,
}, 'add 119 and 144 fps and read the Preview label (TC-VE2-087 – 090)');
set('TC-055', {
  'Expected Result': lines('31 fps selects 「60fps」 and 61 fps selects 「120fps」 (smallest option not below the source)', `Step 1: ${label('31fps · 1080p')}`, `Step 2: ${label('61fps · 1080p')}`),
}, 'read the Preview label for the source (TC-VE2-083, 086)');
set('TC-056', {
  Precondition: lines(get('TC-056').Precondition.split('\n')[0], '2. 360p (ve-res360p, 640 × 360), 480p, 718p (ve-res718p, 1280 × 718, just under 720p) and 720p videos in the album'),
  Action: steps('Open the panel with the 360p video', 'Go back and open it with the 480p video', 'Go back and open it with the 718p video', 'Go back and open it with the 720p video'),
  'Expected Result': lines('All four select 「720p」', `Step 1: ${label('30fps · 360p')}`, `Step 2: ${label('30fps · 480p')}`, `Step 3: ${label('30fps · 718p')}`, `Step 4: ${label('30fps · 720p')}`),
  Notes: `360p and just under 720p (spec agent TC-VE2-091 – TC-VE2-093; their 719p cannot be encoded, the fixture is 718p) ${REQ}.`,
}, 'add 360p and just-under-720p and read the Preview label (TC-VE2-091 – 093)');
set('TC-057', {
  Precondition: lines(get('TC-057').Precondition.split('\n')[0], '2. A 722p (ve-res722p, 1280 × 722, just over 720p), a 900p (e.g. 1600×900) and a 1080p video in the album'),
  Action: steps('Open the panel with the 722p video', 'Go back and open it with the 900p video', 'Go back and open it with the 1080p video'),
  'Expected Result': lines('All three select 「1080p」', `Step 1: ${label('30fps · 722p')}`, `Step 3: ${label('30fps · 1080p')}`),
  Notes: `${get('TC-057').Notes} Just over 720p: spec agent TC-VE2-094 (their 721p cannot be encoded, the fixture is 722p) ${REQ}.`,
}, 'add just-over-720p and read the Preview label (TC-VE2-094)');
set('TC-058', {
  'Expected Result': lines('Both open the panel with 「4K」 selected (a source from 1081p up to below 2K defaults to 4K)', `Step 1: ${label('30fps · 1082p')}`, `Step 2: ${label('30fps · 1200p')}`),
}, 'read the Preview label for the source (TC-VE2-096)');

// ── 8. Price lists: every combination priced at 30 s, 90 s and the Mode cap on the 12:30 video (R-060, R-063, R-065)
const combos = rows.filter(r => /^Combination Mode=/.test(r.Notes)).map(r => {
  const m = r.Notes.match(/Mode=(\w+) · Enhancement style=(\w+) · fps=(\d+)fps · Resolution=(\w+)/)!;
  const rate = Number(r.Notes.match(/Rate (\d+) credits\/s/)![1]);
  const sa = r.Notes.match(/(TC-VE2-\d+) \(price display\)/)?.[1] ?? '';
  return { id: r.ID, mode: m[1], style: m[2], fps: m[3], res: m[4], rate, sa };
});
if (combos.length !== 36) throw new Error(`expected 36 combination rows, found ${combos.length}`);
let priceAfter = 'TC-087';
for (const c of combos) {
  const pro = c.mode === 'Professional';
  const cap = pro ? 150 : 480, capL = pro ? '02:30' : '08:00';
  const chips = [c.style === 'Sharp' ? 'Tap 「Sharp」' : null, `Tap 「${c.fps}fps」`, `Tap 「${c.res}」`].filter(Boolean) as string[];
  const act = pro
    ? ['Drag the right handle left until 「Selected Length」 reads 「00:30」', 'Tap 「Professional」', ...chips, 'Drag the right handle right until 「Selected Length」 reads 「01:30」', 'Drag the right handle right as far as it goes (「02:30」)', 'Drag the right handle left until 「Selected Length」 reads 「00:30」']
    : [...chips, 'Drag the right handle left until 「Selected Length」 reads 「00:30」', 'Drag the right handle right until 「Selected Length」 reads 「01:30」', 'Drag the right handle right as far as it goes (「08:00」)', 'Drag the right handle left until 「Selected Length」 reads 「00:30」'];
  const n = act.length;
  const chosen = `「${c.mode}」, 「${c.style}」, 「${c.fps}fps」 and 「${c.res}」 are selected${pro ? ' (the switch made with no toast)' : ''} and the line reads 「Charge ${c.rate} credits per second」`;
  const p30 = `「Enhance ◆ ${30 * c.rate}」 (30 s × ${c.rate})`;
  const expected = [
    ...(pro ? [`After step ${n - 3}: ${chosen}`, `After step ${n - 3}: ${p30}`] : [`After step ${n - 4}: ${chosen}`, `Step ${n - 3}: ${p30}`]),
    `Step ${n - 2}: 「Enhance ◆ ${90 * c.rate}」 (90 s × ${c.rate})`,
    `Step ${n - 1}: 「Selected Length」 「${capL}」 and 「Enhance ◆ ${cap * c.rate}」 (${cap} s × ${c.rate})`,
    `Step ${n}: back to 「Enhance ◆ ${30 * c.rate}」 with the four chips and the rate line unchanged`,
  ];
  priceAfter = add(priceAfter, {
    Section: 'Credit price',
    Precondition: lines(TIER, '2. Panel open with the 12:30 1080p 30 fps video in Standard / Natural / 30fps / 1080p, the default selection 00:00–08:00'),
    Action: steps(...act),
    'Expected Result': lines(...expected),
    Priority: 'P2', 'Spec Ref': 'R-060, R-063, R-065',
    Notes: `Price list of combination ${c.mode} · ${c.style} · ${c.fps}fps · ${c.res} (generated in ${c.id}) at 30 s, 90 s and the ${c.mode} limit; spec agent ${c.sa} ${REQ}. Rate ${c.rate} credits/s from the ECL rate table (form 22061491221). No Enhance is tapped: no credits.${Q26}`,
  }, `the price list of ${c.mode} · ${c.style} · ${c.fps}fps · ${c.res} at 30 s, 90 s and ${cap} s (${c.sa}); ${c.id} priced only 1 s and 3.2 s`);
}

// ── 9. Processing time of each combination's task (R-204)
const TIMED: Record<string, string> = { 'TC-225': '186', 'TC-224': '187', 'TC-226': '188', 'TC-221': '189', 'TC-227': '190', 'TC-228': '191', 'TC-222': '192', 'TC-229': '193', 'TC-230': '194', 'TC-220': '195', 'TC-231': '196', 'TC-232': '197', 'TC-233': '198', 'TC-234': '199', 'TC-235': '200', 'TC-236': '201', 'TC-237': '202', 'TC-238': '203', 'TC-219': '204' };
for (const [id, sa] of Object.entries(TIMED)) {
  const r = get(id);
  if (!/Wait in Recent task until the task completes/.test(r.Action)) throw new Error(`${id}: no wait step`);
  set(id, {
    Action: r.Action.replace('Wait in Recent task until the task completes', 'Stay on Recent task and time the task\'s card from its first remaining-time display until it shows 「View」'),
    'Expected Result': r['Expected Result'].replace('The task completes and its Result plays', 'The task completes in 4.8 – 8 s from the card\'s first remaining time (1.5 – 2.5 × the 3.2 s selection, R-204) and its Result plays'),
    'Spec Ref': r['Spec Ref'].includes('R-204') ? r['Spec Ref'] : `${r['Spec Ref']}, R-204`,
    Notes: `${r.Notes} Processing time: spec agent TC-VE2-${sa} (company performance standard, not in the spec) ${REQ}.`,
  }, `time this combination's task against R-204 (TC-VE2-${sa}); only the default combination was timed`);
}

// ── 10. Purchases, refunds, Result, Recent task, player
if (AND) {
  set('TC-095', {
    Precondition: lines(get('TC-095').Precondition, '4. The signed-in Google account is a license tester of PowerDirector on Google Play (「Test card, always approves」, no charge)'),
    Action: steps('Tap 「Yearly」', 'Tap 「Continue」', 'Pay with 「Test card, always approves」 and tap 「Subscribe」 on the Google Play sheet', 'If a Google Play offer shows, tap 「Not now」'),
    'Expected Result': lines('Step 3: the Google Play sheet shows 「PowerDirector Yearly Subscription」, 「Starting today」 and 「Test card, always approves」', 'After step 4 the IAP page closes and the panel is back (no 「You\'re all set」 dialog on Android, not Home or the Pro page)', 'The balance is updated in the credit pill, the selection and 「Sharp」 are kept, the CTA reads 「Enhance ◆ <credits>」 and nothing is sent until the CTA is tapped'),
    Notes: `Needs the user's go-ahead (Google Play test card, no charge; fixtures.md). The Yearly plan and the offer step (spec agent TC-VE2-042) ${REQ}. 「You're all set」 / 「Your purchase was successful.」 (Design arrows 3293-13678 / 13679) is the iOS dialog [Req: REQ-012]; 「no auto-send」 is PM C2 [建議].`,
  }, 'the Yearly plan on Google Play\'s test card and the offer dismissed on the way back (TC-VE2-042)');
  set('TC-097', {
    Precondition: lines('1. TC-096 setup: Credit page open from the panel, the balance noted', '2. The signed-in Google account is a license tester of PowerDirector on Google Play, so the purchase sheet offers 「Test card, always approves」 (no charge)', '3. The user\'s go-ahead for this purchase'),
    Action: steps('Tap 「Buy More」', 'Pick 「Get 500 Credits」 (NT$1190)', 'Pay with 「Test card, always approves」 on the Google Play sheet', 'If 「Want to get 100 credits, too?」 shows, tap 「Not now」', 'Open My Credits'),
    'Expected Result': lines('Step 3: the sheet shows 「500 Credits」, 「NT$1190」 and 「Test card, always approves」', 'After step 4 the app returns to the panel with the same video, start, end, 「Selected Length」, Mode, style, fps and resolution', 'The credit pill shows the noted balance + 500', 'Step 5: My Credits shows the noted balance + 500'),
    Notes: `Needs the user's go-ahead (Google Play test card, no charge; fixtures.md) [Req: REQ-015]. The 500-credit pack, the 100-credit offer and the exact balance (spec agent TC-VE2-044, TC-VE2-045, TC-VE2-272) ${REQ}. The Spec Agent bought the same pack this way and the app returned to My Credits, not the panel.`,
  }, 'the 500-credit pack, the 100-credit offer, the balance + 500 and every setting kept (TC-VE2-044, 045, 272)');
} else {
  set('TC-097', {
    Precondition: 'TC-096 setup: Credit page open from the panel, the balance noted',
    Action: steps('Tap 「Buy More」', 'Buy a credit pack on the App Store purchase sheet (note its credits)', 'Open My Credits'),
    'Expected Result': lines('After step 2 the app returns to the panel with the same video, start, end, 「Selected Length」, Mode, style, fps and resolution', 'The credit pill shows the noted balance + the pack\'s credits', 'Step 3: My Credits shows the same balance'),
    Notes: `Parked: needs purchase. The balance arithmetic and every setting kept (spec agent TC-VE2-045, TC-VE2-272; their pack and price are Google Play's) ${REQ}.`,
  }, 'the balance is the noted balance + the pack and every setting is kept (TC-VE2-045, 272)');
}
set('TC-113', {
  Action: steps('Tap 「Leave」', 'Open the credit history (「Details」 on the Credit page)'),
  'Expected Result': lines('Step 1: the panel is back with the selection and settings and its 「Enhance ◆ <credits>」 CTA enabled again', 'Step 1: the process stops (no completed result for it appears in Recent task)', 'Step 1: the balance is the noted balance minus the price (credits not restored, as the dialog says)', 'Step 2: one 「AI Video Enhance」 debit of the price for this task and no refund entry for it'),
  Notes: `${get('TC-113').Notes} The ledger check: spec agent TC-VE2-055 ${REQ}.`,
}, 'check the credit history: one debit, no refund (TC-VE2-055)');
add('TC-153', {
  Section: 'Result',
  Precondition: lines(TIER, '2. A saved project whose only clip is the 3.2 s video (ve-000320-720p30), its length and position noted', '3. Enough credits for one 3.2 s task'),
  Action: steps('Open AI Video Enhance from the Launcher and pick the same 3.2 s video in Add Media', 'Tap 「Enhance ◆ <credits>」 with the defaults', 'Wait until the task completes and tap 「View」', 'Tap 「Add to Timeline」', 'Go back to the project list and open the saved project'),
  'Expected Result': lines('Step 4: a new project opens with the enhanced video on its timeline', 'Step 5: the saved project still holds its original clip at the same position and length (not the enhanced one)'),
  Priority: 'P2', 'Spec Ref': 'R-123, R-126',
  Notes: `A project that already uses the source (spec agent TC-VE2-065) ${REQ}. Q-11 (the Timeline entry's replace) does not apply: this task starts from Add Media. One full generation.`,
}, 'Add to Timeline leaves a project that already uses the source unchanged (TC-VE2-065)');
set('TC-142', {
  Precondition: 'Recent task open with a task still processing',
  Action: steps('Tap ⌂ on Recent task', 'Open AI Video Enhance again and its Recent task'),
  'Expected Result': lines('Step 1: the Launcher opens', 'Step 2: the task is still processing or has completed (not cancelled)'),
  Notes: `With a task processing (spec agent TC-VE2-067) ${REQ}.`,
}, 'tap ⌂ while a task is processing (TC-VE2-067)');
set('TC-141', {
  Action: steps('Tap ‹ on Recent task', 'Once no task is processing, open Recent task from the panel again (only completed cards)', 'Tap ‹'),
  'Expected Result': lines('Step 1: the panel is shown again', 'Step 3: the panel is shown again'),
  Notes: `Also with only completed cards (spec agent TC-VE2-238) ${REQ}.`,
}, 'also with only completed cards (TC-VE2-238)');
set('TC-037', {
  Precondition: lines('1. Panel open with the 12:30 video', '2. Selection trimmed to 02:00–04:00 (「02:00」) with 「Professional」, 「Sharp」, 「60fps」 and 「4K」, the CTA price noted'),
  Action: steps('Tap play under the Preview', 'Tap the same button again (pause)', 'Wait 3 s', 'Tap the full-screen icon', 'Close the full-screen preview'),
  'Expected Result': lines('Step 1 plays from inside the selection (02:00 onward) and the time advances', 'Step 2 pauses it and the time and the frame stay the same through step 3', 'Step 4 shows it full screen', 'Step 5 returns to the panel with the same video, the selection 02:00–04:00 (「02:00」), 「Professional」, 「Sharp」, 「60fps」, 「4K」 and the noted CTA price'),
  Notes: `Pause: spec agent TC-VE2-163 (generic player rule, not in the Design) [Req: REQ-008]. A trimmed, non-default panel (spec agent TC-VE2-162, TC-VE2-170) ${REQ}.`,
}, 'play a trimmed selection and come back from full screen with non-default settings (TC-VE2-162, 170)');
set('TC-150', {
  Action: steps('Tap play', 'Tap the same button again (pause)', 'Wait 3 s', 'Drag the progress slider later', 'Drag the progress slider earlier'),
  'Expected Result': lines('The page shows ‹, 「Original」 / 「Result」 with 「Result」 selected, the video with the time (「mm:ss/mm:ss」) and 「Save Result」, 「Add to Timeline」, 「Enhance More」', 'Step 1 plays the result', 'Step 2 pauses it and the time and the frame stay the same through step 3', 'Step 4: the time and the frame follow the slider later', 'Step 5: the time and the frame follow it back earlier'),
}, 'the slider dragged both ways with the time and frame followed (TC-VE2-169)');
set('TC-151', {
  Action: steps('Tap 「Original」', 'Drag the slider to 00:02 and pause', 'Tap 「Result」', 'Drag the slider to 00:02 and pause'),
  'Expected Result': lines('「Original」 shows the source video, 「Result」 the enhanced one', 'The two frames at 00:02 differ visibly (the Result sharper or cleaner)'),
  Notes: `Same-moment frames (spec agent TC-VE2-166) ${REQ}.`,
}, 'compare Original and Result at the same moment (TC-VE2-166)');

// ── place the new rows (REQ-033: right after the row they extend)
for (const { after, row } of added) {
  const i = rows.findIndex(r => r.ID === after);
  if (i < 0) throw new Error(`anchor ${after}`);
  rows.splice(i + 1, 0, row);
}
writeFileSync(join(HERE, 'draft.csv'), writeRecords(COLS, rows));
const count = (c: string) => rows.filter(r => r.Change === c).length;
console.log(`${PLATFORM}: ${rows.length} rows — new ${count('new')}, modified ${count('modified')}, unchanged ${count('unchanged')}`);
