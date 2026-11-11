// Builds draft.csv for pdr/video-enhance android, draft 20261110-160000 (REQ-008: cover the spec agent's 271 cases).
// Usage: node library/pdr/video-enhance/android/drafts/20261110-160000/build-draft.ts
// Starts from the approved table v3 (android/cases.csv, 123 rows), applies the REQ-008 modifications, places the new
// rows right after the row they extend (REQ-033) and writes the 36 Mode × Enhancement style × fps × Resolution
// combination rows (analysis pass 10, `### Combinations`) from the ECL rate table the spec agent's fixtures carry.
// Also prints the `### Combinations` grid lines for requirements.md (--grid).
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readRecords, writeRecords } from '../../../../../../scripts/lib/csv.ts';

const HERE = dirname(fileURLToPath(import.meta.url));
const TABLE = join(HERE, '..', '..', 'cases.csv');
const COLS = ['ID', 'Section', 'Precondition', 'Action', 'Expected Result', 'Priority', 'Spec Ref', 'Notes', 'Change', 'Change Reason'];
type Row = Record<string, string>;

const approved = readRecords(readFileSync(TABLE, 'utf8'));
const byId = new Map(approved.map(r => [r.ID, r]));
const steps = (...s: string[]) => s.map((t, i) => `${i + 1}. ${t}`).join('\n');
const PRO = 'Signed in with a Pro+ account (no tier switch on Android)';
const SA = (ids: string) => `spec agent ${ids}`;

// ------------------------------------------------------------------------------------------------ modified rows
const mod: Record<string, Partial<Row> & { reason: string }> = {
  'TC-022': {
    Precondition: 'Add Media open; the album holds a 1440p (2560 × 1440), a 4K (3840 × 2160) and an 8K (7680 × 4320) video, one under 1 s and one that is not MP4 / MOV',
    Action: steps('Tap the 1440p video', 'Tap the 4K video', 'Tap the 8K video', 'Tap the video under 1 s', 'Tap the video that is not MP4 / MOV'),
    'Expected Result': 'Steps 1–3: each 2K-or-higher video is rejected before the panel opens: no panel opens, the video is not loaded and no task starts (record the message shown, Q-23). Steps 4–5: each is greyed, the tap shows 「This video isn\'t supported. Try one up to 4K.」 and no panel opens',
    Priority: 'P2', 'Spec Ref': 'R-196, R-015',
    Notes: 'Steps 1–3: user requirement 2026-10-16 via the spec agent (TC-VE2-097, TC-VE2-098), newer than the Design lookup and PM E1 [Req: REQ-008]; message and threshold: Q-23. Steps 4–5: PM E1 / A2 [建議] and [待確認] (Q-13), a difference is a PM question. Needs the five fixtures (fixtures.md).',
    reason: 'REQ-008 decision 4: every 2K+ source is rejected before the panel (spec agent TC-VE2-097, TC-VE2-098; R-196); before: only sources over 4K were rejected',
  },
  'TC-058': {
    Precondition: `${PRO}; a 1081p (e.g. 1920 × 1081, made for the test) and a 1200p (1920 × 1200) video in the album`,
    Action: steps('Open the panel with the 1081p video', 'Go back and open it with the 1200p video'),
    'Expected Result': 'Both open the panel with 「4K」 selected (a source from 1081p up to below 2K defaults to 4K)',
    'Spec Ref': 'R-044',
    Notes: '1440p and 4K sources no longer reach the panel (R-196, TC-022): user requirement 2026-10-16 via the spec agent (TC-VE2-096 – TC-VE2-098) [Req: REQ-008]. Needs the two fixture videos.',
    reason: 'REQ-008 decision 4: the 4K default now applies only below 2K; the 1440p and 4K sources moved to TC-022 (spec agent TC-VE2-096 – TC-VE2-098; R-044)',
  },
  'TC-045': {
    Precondition: `${PRO}; an 08:00 (480 s) and a 12:30 (750 s) video in the album`,
    Action: steps('Open the panel with the 08:00 video (Standard)', 'Drag the right handle left until 「Selected Length」 reads 「02:00」', 'Tap 「Professional」', 'Scroll the strip sideways', 'Tap 「Standard」',
      'Go back and open the panel with the 12:30 video', 'Scroll the strip sideways', 'Drag the right handle left until 「Selected Length」 reads 「02:00」', 'Tap 「Professional」', 'Scroll the strip sideways'),
    'Expected Result': 'Step 1: the 08:00 strip fills the strip width with no sideways scroll. Steps 3–4: the strip is re-laid so 2:30 fills one width and it scrolls sideways; the selection keeps 00:00–02:00. Step 5: the 08:00 strip fills the width again. Steps 6–7: the 12:30 strip scrolls sideways with 8:00 filling one width. Steps 9–10: the strip is re-laid to 2:30 per width. In every step the thumbnails stay in time order and the selection keeps its start, end and length (00:00–02:00 once set)',
    'Spec Ref': 'R-034, R-051',
    Notes: 'Q-24: follows the spec agent\'s reading of PM 9/29 ⑥ (TC-VE2-026, TC-VE2-265, TC-VE2-267) pending PM [Req: REQ-008]; a different layout is a PM question until PM confirms. PM-only: no Design frame yet.',
    reason: 'REQ-008 decision 5: one strip width = the active Mode limit, re-laid on a Mode switch (spec agent TC-VE2-026, TC-VE2-264 – TC-VE2-267; R-034); before: the scale followed only the video length',
  },
  'TC-083': {
    Precondition: 'Panel open with the 00:03.96 1080p 30 fps video in Standard (「Enhance ◆ 8」, 「Charge 2 credits per second」)',
    Action: steps('Tap 「Professional」', 'Tap 「Standard」'),
    'Expected Result': 'Step 1: the CTA reads 「Enhance ◆ 16」 and the line 「Charge 4 credits per second」 (4 s × 4, Professional 1080p 30fps); step 2: back to 「Enhance ◆ 8」 and 「Charge 2 credits per second」',
    'Spec Ref': 'R-065, R-064, R-063',
    Notes: 'ECL rate table (form 22061491221; spec agent TC-VE2-115, TC-VE2-133) [Req: REQ-008]; credit numbers are binding.',
    reason: 'REQ-008 decision 2: the Professional rate is known from the ECL table (R-063, R-065; Q-4 answered); before: only "the price changes"',
  },
  'TC-087': {
    Precondition: 'Panel open with the 00:03.96 1080p 30 fps video in Standard (「Enhance ◆ 8」)',
    Action: steps('Tap 「60fps」', 'Tap 「120fps」', 'Tap 「4K」', 'Tap 「60fps」', 'Tap 「30fps」', 'Tap 「Professional」', 'Tap 「60fps」', 'Tap 「120fps」'),
    'Expected Result': 'Steps 1–2: the CTA stays 「Enhance ◆ 8」 (Standard 1080p is 2 credits/s at every fps); step 3: 「Enhance ◆ 32」 (Standard 4K 120fps, 8/s); step 4: 「Enhance ◆ 24」 (6/s); step 5: 「Enhance ◆ 12」 (3/s); step 6: 「Enhance ◆ 48」 (Professional 4K 30fps, 12/s); step 7: 「Enhance ◆ 96」 (24/s); step 8: 「Enhance ◆ 192」 (48/s). After each tap 「Charge X credits per second」 shows that rate',
    Priority: 'P2', 'Spec Ref': 'R-065, R-063, R-064',
    Notes: 'ECL rate table (form 22061491221; spec agent TC-VE2-117 – TC-VE2-149) [Req: REQ-008]: the output fps chip prices the task (Q-3 answered). Credit numbers are binding. A chip drawn disabled (Q-6): record it and skip that step.',
    reason: 'REQ-008 decision 2: the output fps chip prices the task by the ECL table (Q-3 answered; R-065); before: another fps chip left the price unchanged',
  },
  'TC-090': {
    Action: steps('Look at the CTA', 'Tap it'),
    'Expected Result': 'Step 1: the CTA is an unlock action for Pro with no price (e.g. 「Unlock Pro to Enhance」), not 「Unlock Pro+ to Enhance」, with 「Charge X credits per second」 under it; step 2 opens the IAP page on the 「Pro」 tab (the Pro plans)',
    'Spec Ref': 'R-070, R-071',
    Notes: 'Android tier from the colleague feedback of 2026-10-07 (spec agent TC-VE2-040, TC-VE2-041) [Req: REQ-008], newer than the Design and PM 9/24, which say Pro+ (now the iOS rule). Exact Android wording: Q-25, recorded, not asserted.',
    reason: 'REQ-008 decision 3: on Android a Free user unlocks with Pro (spec agent TC-VE2-040, TC-VE2-041; R-070, R-071); before: 「Unlock Pro+ to Enhance」',
  },
  'TC-091': {
    Precondition: 'Signed in with a Pro (not Pro+) account (no tier switch on Android) with enough credits; panel open with a video',
    Action: 'Look at the CTA',
    'Expected Result': 'Pro is enough on Android: the CTA is the enabled 「Enhance ◆ <credits>」 with its price and 「Charge X credits per second」; no unlock action and no IAP page',
    'Spec Ref': 'R-070',
    Notes: 'Spec agent TC-VE2-241 (colleague feedback 2026-10-07 items 8–9) [Req: REQ-008]. The iOS table keeps Pro+ only. Nothing is generated.',
    reason: 'REQ-008 decision 3: an Android Pro account gets an enabled Enhance (spec agent TC-VE2-241; R-070); before: 「Unlock Pro+ to Enhance」 and the IAP on the Pro+ tab',
  },
  'TC-094': {
    'Expected Result': 'The panel is back unchanged: selection 05:00, 「Sharp」, the Pro unlock CTA of TC-090',
    reason: 'REQ-008 decision 3: the Free CTA on Android is the Pro unlock action (R-070); before: 「Unlock Pro+ to Enhance」',
  },
  'TC-095': {
    Precondition: 'Signed in with a Free account (Android has no tier switch: the tier comes from the account) on an account that may buy Pro; panel open with selection 00:30–05:30 and 「Sharp」; IAP page open on the 「Pro」 tab',
    reason: 'REQ-008 decision 3: on Android the purchase that unlocks the feature is Pro (R-070, R-071); before: Pro+',
  },
  'TC-071': {
    'Expected Result': 'Before the tap 「Professional」 looks normal (not disabled); the tap shows the toast 「Professional supports clips up to 2:30. Shorten your selection to switch.」 for about 3 s; Mode stays 「Standard」 and the selection is neither shortened nor moved: it still starts at 00:30, ends at 05:30 and reads 「05:00」',
    Notes: 'Design 「Mode 長度上限」 frames. PM 9/29 ③ toast 「Professional mode supports up to 2m 30s…」 (quoted by the spec agent\'s TC-VE2-228, TC-VE2-230, TC-VE2-268) and draft B1-1 ② auto-shortening lose to the Design.',
    reason: 'REQ-008 decision 6: the whole interval (start, end, length) is kept after the refusal (spec agent TC-VE2-228, TC-VE2-230, TC-VE2-268, with the newer Design toast; R-052)',
  },
  'TC-160': {
    Action: steps('Tap 「Professional」', 'Drag the right handle left until 「Selected Length」 reads 「02:20」', 'Tap 「Professional」'),
    'Expected Result': 'Step 1: 「Professional」 looks normal; the toast 「Professional supports clips up to 2:30. Shorten your selection to switch.」 shows for about 3 s, the Mode stays Standard and the selection stays 05:00; step 3 switches to 「Professional」 with no toast and the selection stays 02:20',
    'Spec Ref': 'R-057, R-052, R-053',
    Notes: 'Q-10: draft B1-1 ⑦ disables the chip with 「Professional mode supports clips up to 2m 30s. Split the clip to use it.」; check on device and decide with the user. The spec agent\'s TC-VE2-269 quotes PM 9/29\'s toast; the Design copy is newer.',
    reason: 'REQ-008 decision 6: shorten and retry on a Timeline clip (spec agent TC-VE2-269, with the newer Design toast; R-053)',
  },
  'TC-216': {
    'Expected Result': 'While dragging the Preview shows the frame at the left handle (its time follows the handle back toward 「04:30/12:30」); the left handle stops at 04:30 (「Selected Length」 「08:00」) with a light haptic and the bubble 「Up to 8 minutes in Standard mode」; the right handle stays at 12:30',
    'Spec Ref': 'R-033, R-050, R-031',
    reason: 'REQ-008 decision 7: the Preview frame while the left handle is dragged earlier (spec agent TC-VE2-110; R-031)',
  },
  'TC-215': {
    Action: steps('Look at the strip', 'Drag the ◀▶ knob under the 「00:00」 bubble to the right to about 03:00', 'Drag the knob back to the left to about 01:00',
      'Drag the knob right and left several times without letting go', 'Let go at about 02:00'),
    'Expected Result': 'Step 1: a playhead line sits at the selection start with the bubble 「00:00」 above the strip and the ◀▶ knob under it, and the Preview reads 「00:00/12:30」. Step 2: the playhead moves later, the bubble and the Preview time follow together (about 「03:00」 and 「03:00/12:30」) and the Preview shows that frame. Step 3: it moves earlier the same way (about 「01:00」 and 「01:00/12:30」). Step 4: the bubble, the Preview time and the frame follow the knob both ways. Step 5: they stop at about 「02:00」. In every step both trim handles, 「Selected Length」 「08:00」 and the CTA price stay the same',
    reason: 'REQ-008 decision 7: the playhead dragged earlier and back and forth (spec agent TC-VE2-159, TC-VE2-161; R-193)',
  },
  'TC-037': {
    Action: steps('Tap play under the Preview', 'Tap the same button again (pause)', 'Wait 3 s', 'Tap the full-screen icon', 'Close the full-screen preview'),
    'Expected Result': 'Step 1 plays the video and the time advances; step 2 pauses it and the time and the frame stay the same through step 3; step 4 shows it full screen; step 5 returns to the panel with the selection and settings unchanged',
    'Spec Ref': 'R-027, R-200',
    Notes: 'Pause: spec agent TC-VE2-163 (generic player rule, not in the Design) [Req: REQ-008].',
    reason: 'REQ-008 decision 8: pause on the source preview (spec agent TC-VE2-163; R-200)',
  },
  'TC-150': {
    Action: steps('Tap play', 'Tap the same button again (pause)', 'Wait 3 s', 'Drag the progress slider'),
    'Expected Result': 'The page shows ‹, 「Original」 / 「Result」 with 「Result」 selected, the video with the time (「mm:ss/mm:ss」) and 「Save Result」, 「Add to Timeline」, 「Enhance More」; step 1 plays the result; step 2 pauses it and the time and the frame stay the same through step 3; step 4 moves through the result',
    'Spec Ref': 'R-120, R-201',
    Notes: 'PM 「Edit More」 is older (D3 [衝突]: 「Enhance More」). Pause: spec agent TC-VE2-168 (generic player rule, not in the Design) [Req: REQ-008].',
    reason: 'REQ-008 decision 8: pause on Result (spec agent TC-VE2-168; R-201)',
  },
  'TC-152': {
    Action: steps('Tap 「Save Result」', 'Read the saved file\'s resolution and frame rate (the gallery\'s Details, or the file pulled with adb and read with ffprobe on the computer)',
      'Open a new project in PowerDirector and its media picker on 「All」', 'Add the saved video to the timeline', 'Play the timeline'),
    'Expected Result': 'The toast 「Saved to your device」 appears within 10 s; the enhanced video is a new file in the phone gallery (Google Photos / Files › Movies or DCIM), 01:30 long, 1920 × 1080 and 30 fps (the values chosen on the panel), and the source video is still there unchanged; the media picker lists it under 「All」; it is added to the timeline and plays there',
    Notes: 'Toast copy is PM D3 [建議]. Steps 3–5: colleague feedback item 14 via the spec agent\'s TC-VE2-236 [Req: REQ-008]. The default values of a 1080p source; every combination of the four settings is generated in the Setting combinations rows (REQ-008).',
    reason: 'REQ-008: the saved result is a new file usable on a timeline (spec agent TC-VE2-236; R-122); Notes: the value rows TC-219 – TC-224 became combination rows (decision 1)',
  },
  'TC-112': {
    Action: steps('Look at the 「Enhance」 CTA behind the dialogs', 'Tap 「Keep Uploading」'),
    'Expected Result': 'Step 1: the CTA behind the dialogs is greyed (disabled). Step 2: the leave dialog closes, the processing dialog continues from where it was and the upload finishes (TC-114); the CTA stays disabled until then and no second task can start',
    'Spec Ref': 'R-087',
    Notes: 'Disabled CTA: colleague feedback item 11 via the spec agent\'s TC-VE2-234 [Req: REQ-008].',
    reason: 'REQ-008: Enhance stays disabled through the upload (spec agent TC-VE2-234; R-087)',
  },
  'TC-113': {
    'Expected Result': 'The panel is back with the selection and settings and its 「Enhance ◆ <credits>」 CTA enabled again; the process stops (no completed result for it appears in Recent task); the balance is the noted balance minus the price (credits not restored, as the dialog says)',
    reason: 'REQ-008: Leave restores an enabled Enhance (spec agent TC-VE2-235; R-088)',
  },
  'TC-170': {
    Notes: 'Parked: needs a failure fixture (no fault switch for Video Enhance is known; ask RD). One way the spec agent uses (TC-VE2-173, [Req: REQ-008]): one task on a video that content moderation refuses (an NSFW test album), a single attempt.',
    reason: 'REQ-008: Notes name the spec agent\'s failure setup (TC-VE2-173)',
  },
};

// ------------------------------------------------------------------------------------------------ new rows
const NEW = (id: string, section: string, pre: string, action: string, exp: string, pri: string, ref: string, notes: string, reason: string): Row =>
  ({ ID: id, Section: section, Precondition: pre, Action: action, 'Expected Result': exp, Priority: pri, 'Spec Ref': ref, Notes: notes, Change: 'new', 'Change Reason': reason });

const AM = 'Add Media', PL = 'Panel layout and first-run bubble', TR = 'Trim and selected length', ML = 'Mode length limit', RT = 'Recent task';
const stock = (lib: string, sa: string) => NEW(lib === 'Pexels' ? 'TC-256' : 'TC-257', AM, `${PRO}; Add Media open from the feature; network on`,
  steps(`Swipe the provider tab row left until 「${lib}」 shows`, `Tap 「${lib}」`, `Tap a ${lib} video`),
  `Step 2 lists ${lib} videos; step 3 fetches the video if needed and opens the panel with that video in the Preview`, 'P3', 'R-202, R-012',
  `Not from the spec: the colleague's build via the spec agent's ${sa} [Req: REQ-008] (the Design's Add Media draws one 「Video」 tab with Recents). Swipe the tab row itself, not the grid.`,
  `REQ-008 decision 8: ${lib} stock import (spec agent ${sa}; R-202)`);
const perf = (id: string, len: string, secs: string, range: string, stop: string, sa: string) => NEW(id, RT,
  `${PRO} with enough credits; a ${len} 720p 30 fps video in the album; a screen recording or stopwatch with timestamps`,
  steps(`Open the panel with the ${len} video (whole video selected, defaults kept)`, 'Tap 「Enhance ◆ <credits>」', 'Start timing when the task\'s card in Recent task first shows its remaining time', ...stop.split('|')),
  `The time from step 3 to the end of the last step is ${range} (1.5 – 2.5 × the ${secs} selection)`, 'P3', 'R-204, R-111',
  `Not from the spec: company performance standard adopted by user instruction, spec agent ${sa} [Req: REQ-008]. One full generation.`,
  `REQ-008 decision 8: generation time ${secs} (spec agent ${sa}; R-204)`);

const after: Record<string, Row[]> = {
  'TC-020': [
    NEW('TC-255', AM, `${PRO}; the Demo page showing; videos in All / Recents and in at least one named album or folder; network on`,
      steps('Tap 「Try It Now」', 'Note every video source the picker offers: the album / folder chooser and each tab of the provider tab row (swipe the tab row to reveal hidden tabs)', 'Open each source in turn and tap a supported video in it, going back to Add Media after each panel opens'),
      'Step 1 opens Add Media; step 2: every local album or folder and every stock library tab is listed (record them); step 3: each source lists videos and each tapped video opens the panel with that video in the Preview', 'P3', 'R-202, R-008, R-012',
      'Not from the spec: the colleague\'s build via the spec agent\'s TC-VE2-153 [Req: REQ-008] (the Design\'s Add Media draws one 「Video」 tab with Recents). A source that cannot import its video is a defect.',
      'REQ-008 decision 8: every media picker source tab and local album (spec agent TC-VE2-153, TC-VE2-154; R-202)'),
    stock('Pexels', 'TC-VE2-155'),
    stock('Pixabay', 'TC-VE2-156'),
    NEW('TC-258', AM, `${PRO}; a video that is only in a named album (e.g. 「VE test」), not among the first Recents; Add Media open from the feature`,
      steps('Open the album / folder chooser', 'Tap the named album', 'Tap the video'),
      'Step 2 lists the album\'s videos; step 3 opens the panel with that video in the Preview', 'P3', 'R-202, R-012',
      'Not from the spec: spec agent TC-VE2-225 [Req: REQ-008].', 'REQ-008 decision 8: import from a named local album (spec agent TC-VE2-225; R-202)'),
  ],
  'TC-033': [
    NEW('TC-259', PL, `${PRO}; a 02:30.01 (150.01 s, length checked with ffprobe) video in the album (made for the test)`,
      'Open the panel with the video and read the Preview time', 'The Preview time reads 「00:00/02:31」 (the total rounded up), not 「00:00/02:30」', 'P3', 'R-199',
      'Not from the spec: user requirement 2026-10-21 via the spec agent\'s TC-VE2-276 [Req: REQ-008]. Same fixture as TC-262 and TC-264.',
      'REQ-008 decision 8: the total duration rounds up (spec agent TC-VE2-276; R-199)'),
  ],
  'TC-045': [
    NEW('TC-264', TR, `${PRO}; a 02:30.01 (150.01 s) and an 08:01 (481 s) video in the album (made for the test)`,
      steps('Open the panel with the 02:30.01 video (Standard)', 'Drag the right handle left until 「Selected Length」 reads 「02:00」', 'Tap 「Professional」', 'Scroll the strip sideways',
        'Go back and open the panel with the 08:01 video', 'Scroll the strip sideways', 'Drag the right handle left until 「Selected Length」 reads 「02:00」', 'Tap 「Professional」', 'Scroll the strip sideways'),
      'Step 1: the 02:30.01 strip fills the strip width (under 8:00). Steps 3–4: in Professional the video is over 2:30, so the strip is re-laid to 2:30 per width and scrolls a little sideways. Steps 5–6: the 08:01 strip scrolls sideways with 8:00 per width. Steps 8–9: re-laid to 2:30 per width. The thumbnails stay in time order and the selection keeps 00:00–02:00 through each Mode switch',
      'P3', 'R-034, R-051',
      'The Mode limits + 1 s (spec agent TC-VE2-264, TC-VE2-266) [Req: REQ-008]. Q-24 as in TC-045. Needs the two fixture videos.',
      'REQ-008 decision 5: strip scale just over each Mode limit (spec agent TC-VE2-264, TC-VE2-266; R-034)'),
  ],
  'TC-076': [
    NEW('TC-263', ML, 'Panel open with the 12:30 video in Standard, selection 00:00–08:00',
      steps('Drag the right handle left until 「Selected Length」 reads 「02:31」', 'Tap 「Professional」', 'Drag the right handle left until 「Selected Length」 reads 「02:30」', 'Tap 「Professional」'),
      'Step 2: the toast 「Professional supports clips up to 2:30. Shorten your selection to switch.」 shows for about 3 s, the Mode stays 「Standard」 and the selection keeps 00:00–02:31; step 4: the Mode switches to 「Professional」 with no toast and the selection stays 00:00–02:30',
      'P2', 'R-052, R-053, R-050',
      'The 151 s / 150 s boundary (spec agent TC-VE2-227, TC-VE2-228) [Req: REQ-008]; their toast copy is PM 9/29\'s, the Design copy is newer.',
      'REQ-008 decision 6: Professional refused at 151 s and allowed at 150 s (spec agent TC-VE2-228; R-052, R-053)'),
    NEW('TC-260', ML, `${PRO}; a 00:01 (1 s) and a 00:30 video in the album (720p 30 fps)`,
      steps('Open the panel with the 00:01 video', 'Tap 「Professional」', 'Go back and open the panel with the 00:30 video', 'Tap 「Professional」'),
      'Steps 1 and 3: the panel opens in 「Standard」 with the whole video selected (「00:01」, 「00:30」); steps 2 and 4: the Mode switches to 「Professional」 with no toast and the selection unchanged',
      'P3', 'R-197, R-040, R-030, R-051',
      'The spec agent\'s TC-VE2-245 / TC-VE2-246 expect the panel to open in Professional (PM 9/29 ①); the newer Design 預設值規則 opens every entry in Standard (R-040), so the boundary is checked on the switch [Req: REQ-008].',
      'REQ-008 decision 6: short sources at entry, then Professional (spec agent TC-VE2-245, TC-VE2-246; R-197)'),
    NEW('TC-261', ML, `${PRO}; a 02:29.99 (149.99 s) and a 02:30 (150 s) video in the album (made for the test)`,
      steps('Open the panel with the 02:29.99 video', 'Tap 「Professional」', 'Go back and open the panel with the 02:30 video', 'Tap 「Professional」'),
      'Steps 1 and 3: the panel opens in 「Standard」 with the whole video selected; steps 2 and 4: the Mode switches to 「Professional」 with no toast and the selection unchanged (149.99 s rounds up to 150 s, within 2:30)',
      'P2', 'R-197, R-040, R-051, R-056',
      'The spec agent\'s TC-VE2-247 / TC-VE2-248 expect the panel to open in Professional (PM 9/29 ①); the newer Design opens every entry in Standard (R-040) [Req: REQ-008].',
      'REQ-008 decision 6: sources at the 150 s boundary at entry, then Professional (spec agent TC-VE2-247, TC-VE2-248; R-197)'),
    NEW('TC-262', ML, `${PRO}; a 02:30.01 (150.01 s) and a 12:30 (750 s) video in the album`,
      steps('Open the panel with the 02:30.01 video', 'Tap 「Professional」', 'Go back and open the panel with the 12:30 video', 'Tap 「Professional」'),
      'Step 1: the panel opens in 「Standard」 with the whole video selected; step 3: in 「Standard」 with 00:00–08:00 selected; steps 2 and 4: the toast 「Professional supports clips up to 2:30. Shorten your selection to switch.」 shows, the Mode stays 「Standard」 and the selection is unchanged (150.01 s counts as 151 s)',
      'P2', 'R-197, R-040, R-052, R-056',
      'The spec agent\'s TC-VE2-249 / TC-VE2-250 expect the panel to open in Professional with 2:30 selected (PM 9/29 ①); the newer Design opens every entry in Standard (R-040) and the Design toast is newer [Req: REQ-008].',
      'REQ-008 decision 6: sources over 150 s at entry, then Professional (spec agent TC-VE2-249, TC-VE2-250; R-197)'),
  ],
  'TC-080': [
    NEW('TC-269', 'Credit price', `${PRO}; videos of 00:00.9, 00:01, 00:01.01, 00:02.99, 00:03, 00:03.99, 02:59.01, 02:59.99 and 03:00 (lengths checked with ffprobe), all 720p 30 fps, in the album (made for the test)`,
      steps('Tap the 00:00.9 video in Add Media', 'Open the panel with each other video in turn (whole video, Standard / Natural / 30fps / 720p = 1 credit per second) and read the CTA'),
      'Step 1: the 0.9 s video is greyed and shows 「This video isn\'t supported. Try one up to 4K.」 (under 1 s, R-015); no panel opens. Step 2, the CTA reads: 1 s 「Enhance ◆ 1」; 1.01 s 「Enhance ◆ 2」; 2.99 s 「Enhance ◆ 3」; 3 s 「Enhance ◆ 3」; 3.99 s 「Enhance ◆ 4」; 179.01 s, 179.99 s and 180 s 「Enhance ◆ 180」 (seconds rounded up × 1)',
      'P2', 'R-060, R-063, R-015',
      'Rounding boundaries of the spec agent\'s TC-VE2-175 – TC-VE2-184 [Req: REQ-008] (ECL rate 1 for Standard / Natural / 30fps / 720p). Their 0.9 s case prices 1 credit 「subject to a separately confirmed minimum rule」: our minimum is R-015 / R-035 (no selection under 1 s). Credit numbers are binding. Needs the nine fixture videos.',
      'REQ-008: credit rounding at each boundary (spec agent TC-VE2-175 – TC-VE2-184; R-060, R-063)'),
  ],
  'TC-143': [
    perf('TC-265', '00:01', '1 s', '1.5 – 2.5 s', 'Stay on Recent task and stop timing when the card turns completed with 「View」', 'TC-VE2-221'),
    perf('TC-266', '00:03.2', '3.2 s', '4.8 – 8 s', 'Tap ⌂ to go to the Launcher|Stop timing when the completion banner 「Good news! Your AI Video Enhance task has been completed. Tap here to view your results.」 appears', 'TC-VE2-222'),
    perf('TC-267', '00:30', '30 s', '45 – 75 s', 'Stop timing at whichever is seen first: the card turning completed or a completion banner or notification', 'TC-VE2-223'),
  ],
  'TC-144': [
    NEW('TC-268', RT, 'A completed Video Enhance task in Recent task that finished at least 2 days ago (the longest wait the run allows); note its date and name',
      steps('Close PowerDirector from Recents (swipe it away)', 'Reopen PowerDirector and open Recent task from the panel', 'Read the notice', 'Tap 「View」 on the noted task\'s card'),
      'Step 2 lists the noted task as completed with its date and name; step 3 reads 「Tasks are stored on the cloud for 1 Year. Please download any you want to keep in local storage.」; step 4 opens its Result and the video plays',
      'P3', 'R-198, R-110',
      'Spec agent TC-VE2-077 [Req: REQ-008]. The one-year limit itself (R-117) is confirmed with RD, not in a run; record the task\'s age when run.',
      'REQ-008 decision 9: what a run can see of the one-year retention (spec agent TC-VE2-077; R-198)'),
  ],
};

// ------------------------------------------------------------------------------------------------ combinations
const MODES = ['Standard', 'Professional'], STYLES = ['Natural', 'Sharp'], FPS = ['30fps', '60fps', '120fps'], RES = ['720p', '1080p', '4K'];
const RATE: Record<string, Record<string, number[]>> = { // ECL form 22061491221, rate per second for 30 / 60 / 120 fps
  Standard: { '720p': [1, 1, 1], '1080p': [2, 2, 2], '4K': [3, 6, 8] },
  Professional: { '720p': [2, 4, 8], '1080p': [4, 8, 16], '4K': [12, 24, 48] },
};
const DIMS: Record<string, string> = { '720p': '1280 × 720', '1080p': '1920 × 1080', '4K': '3840 × 2160' };
const LOOK: Record<string, string> = {
  Standard: 'enhanced over 「Original」 (「Great quality」)', Professional: 'more detailed than a Standard result (「Maximum detail」)',
  Natural: 'with a lighter, realistic enhancement (「Lighter enhancement with fewer artifacts, for a more realistic look」)', Sharp: 'sharper and clearer (「Moderate enhancement for a sharp, clear image」)',
};
// Existing value rows that become combination rows (IDs kept): v3 value → its combination.
const KEEP: Record<string, string> = {
  'Professional|Natural|30fps|1080p': 'TC-219', 'Standard|Sharp|30fps|1080p': 'TC-220', 'Standard|Natural|60fps|1080p': 'TC-221',
  'Standard|Natural|120fps|1080p': 'TC-222', 'Standard|Natural|30fps|720p': 'TC-223', 'Standard|Natural|30fps|4K': 'TC-224',
};
const combos: { id: string; m: string; s: string; f: string; r: string; rate: number; price: number; gen: string; disp: string; action: string }[] = [];
let next = 225, n = 0;
for (const m of MODES) for (const s of STYLES) for (const f of FPS) for (const r of RES) {
  const fi = FPS.indexOf(f), rate = RATE[m][r][fi];
  const key = `${m}|${s}|${f}|${r}`;
  const id = KEEP[key] ?? `TC-${next++}`;
  combos.push({ id, m, s, f, r, rate, price: 4 * rate, gen: `TC-VE2-${185 + n}`, disp: `TC-VE2-${114 + n}`,
    action: `genvideo_1_sec_byteplus_${m === 'Standard' ? 'std' : 'pro'}_${s === 'Natural' ? 'natural' : 'hd'}_${r.toLowerCase()}_${f}` });
  n++;
}
const CS = 'Setting combinations';
const comboRow = (c: typeof combos[number]): Row => {
  const taps = [c.m !== 'Standard' && c.m, c.s !== 'Natural' && c.s, c.f !== '30fps' && c.f, c.r !== '720p' && c.r].filter(Boolean).map(v => `Tap 「${v}」`);
  const pre = taps.length ? taps : ['Check the defaults: 「Standard」, 「Natural」, 「30fps」 and 「720p」 selected'];
  const set = 1 + pre.length;
  const a = steps('Open the panel with the 3.2 s video (whole video selected)', ...pre,
    'Drag the right handle toward the left handle as far as it goes (1 s selected)', 'Drag the right handle back to the end of the video (the whole 3.2 s selected)',
    `Tap 「Enhance ◆ ${c.price}」`, 'Wait in Recent task until the task completes', 'Tap 「View」 on its card', 'Tap 「Original」', 'Tap 「Result」', 'Tap 「Save Result」',
    'Read the saved file\'s resolution and frame rate (the gallery\'s Details, or the file pulled with adb and read with ffprobe on the computer)',
    'Open the credit history (「Details」 on the Credit page)');
  const e = `After step ${set}: 「${c.m}」, 「${c.s}」, 「${c.f}」 and 「${c.r}」 are selected (none disabled) and the line reads 「Charge ${c.rate} credits per second」. `
    + `Step ${set + 1}: the CTA reads 「Enhance ◆ ${c.rate}」 (1 s × ${c.rate}); step ${set + 2}: 「Enhance ◆ ${c.price}」 (3.2 s rounds up to 4 s × ${c.rate}). `
    + `Step ${set + 3} starts the upload at once with no confirmation; after the upload the balance is the noted balance − ${c.price}. `
    + `The task completes and its Result plays; 「Result」 looks ${LOOK[c.m]} and ${LOOK[c.s]}. `
    + `「Save Result」 shows 「Saved to your device」; the saved video is 3.2 s long, ${DIMS[c.r]} and ${c.f.replace('fps', '')} fps. `
    + `The credit history's newest entry is one debit 「AI Video Enhance」 of ${c.price} credits`;
  const old = byId.get(c.id);
  return {
    ID: c.id, Section: CS,
    Precondition: `${PRO} with at least ${c.price} credits; a 00:03.2 (3.2 s) 720p 30 fps landscape video in the album (made for the test, the same file for every combination row); note the balance and the newest entry of the credit history`,
    Action: a, 'Expected Result': e, Priority: 'P1', 'Spec Ref': 'R-194, R-195, R-060, R-063, R-065, R-062, R-061, R-089, R-122, R-203',
    Notes: `Combination Mode=${c.m} · Enhancement style=${c.s} · fps=${c.f} · Resolution=${c.r} (\`### Combinations\`, analysis pass 10) [Req: REQ-008]. Rate ${c.rate} credits/s from the ECL rate table (form 22061491221, action ${c.action}); spec agent ${c.gen} (generate) and ${c.disp} (price display). Credit numbers are binding. A chip drawn disabled for this combination (Q-6) is recorded Blocked --as question. One full generation of ${c.price} credits.`,
    Change: old ? 'modified' : 'new',
    'Change Reason': old
      ? `REQ-008 decision 1: the setting-value row becomes the combination row ${c.m} / ${c.s} / ${c.f} / ${c.r}, priced by the ECL table (${c.price} credits), generated and checked (spec agent ${c.gen}, ${c.disp})`
      : `REQ-008 decision 1: every combination of Mode × Enhancement style × fps × Resolution is priced, generated and checked (spec agent ${c.gen}, ${c.disp})`,
  };
};

// ------------------------------------------------------------------------------------------------ assemble
if (process.argv.includes('--grid')) {
  console.log('- Setting Mode: ' + MODES.join(', ') + '\n- Setting Enhancement style: ' + STYLES.join(', ') + '\n- Setting fps: ' + FPS.join(', ') + '\n- Setting Resolution: ' + RES.join(', ') + '\n');
  console.log('| Combination | Rows |\n|---|---|');
  for (const c of combos) console.log(`| Mode=${c.m} · Enhancement style=${c.s} · fps=${c.f} · Resolution=${c.r} | ${c.id} (${c.rate}/s, 3.2 s → 「Enhance ◆ ${c.price}」) |`);
  process.exit(0);
}
const out: Row[] = [];
const comboIds = new Set(combos.map(c => c.id));
for (const r of approved) {
  if (comboIds.has(r.ID)) continue; // moved into the combination section
  const m = mod[r.ID];
  if (m) {
    const { reason, ...fields } = m;
    out.push({ ...r, ...fields, Change: 'modified', 'Change Reason': reason });
  } else out.push({ ...r, Change: 'unchanged', 'Change Reason': '' });
  for (const a of after[r.ID] ?? []) out.push(a);
  if (r.ID === 'TC-155') for (const c of combos) out.push(comboRow(c));
}
const ids = out.map(r => r.ID);
if (new Set(ids).size !== ids.length) throw new Error('duplicate IDs');
if (approved.some(r => !ids.includes(r.ID))) throw new Error('an approved row went missing');
writeFileSync(join(HERE, 'draft.csv'), writeRecords(COLS, out));
const count = (c: string) => out.filter(r => r.Change === c).length;
console.log(`draft.csv: ${out.length} rows · unchanged ${count('unchanged')} · modified ${count('modified')} · new ${count('new')} · removed ${count('removed')}`);
