// Builds draft.csv (Android only since REQ-002; the ios fields are kept unused) of phd/ai-hair-color-custom (draft 20261112-100854) from one row list.
// Usage: node library/phd/ai-hair-color-custom/android/drafts/20261112-100854/build-draft.ts
// Rows with `only` go to one platform; a field given as { ios, android } differs per platform.
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

type P = 'ios' | 'android';
type F = string | { ios: string; android: string };
interface Row { id: string; sec: string; pre: F; act: F; exp: F; pri: string; ref: F; notes?: F; only?: P }

const PM = 'PM-only: no Design frame yet (no Design file supplied 2026-11-12)';
const PHOTO = 'A portrait photo with one clear, front-facing face (passes every entry check)';
const ROOM = `In the AI Hair Color room with ${PHOTO.toLowerCase()}`;
const PANEL = `${ROOM}; the Custom panel is open`;
const BAL = 'Account with at least 30 credits';

const S1 = 'Intro Demo', S2 = 'Entry checks', S3 = 'Custom cell', S4 = 'Custom panel', S5 = 'Style', S6 = 'Colour palette',
  S7 = 'Collapse = apply', S8 = 'Generate and wait', S9 = 'Result', S10 = 'Styles generated', S11 = 'Credits and failures',
  S12 = 'Leaving the room', S13 = 'Deeplink', S14 = 'CMS', S15 = 'Android system Back';

const STYLES: [string, string, string][] = [
  ['face_framing', 'Face', 'the strands framing the face take the Highlight Color over the Base Color'],
  ['colored_bangs', 'Bangs', 'the bangs take the Highlight Color, the rest the Base Color'],
  ['highlights', 'Highlight', 'Highlight Color streaks run along the hair flow over the Base Color'],
  ['balayage', 'Balayage', 'the Highlight Color is swept through the lengths over the Base Color'],
  ['ombre', 'Ombré', 'the Base Color fades into the Highlight Color, the change starting below the ears'],
  ['solid_color', 'Solid', 'all the hair is the one Base Color'],
  ['dip_dye', 'name from CMS', 'the ends are dipped in the Highlight Color, the rest the Base Color'],
  ['colored_roots', 'name from CMS', 'the roots take one colour and the lengths the other'],
  ['earloop_highlights', 'name from CMS', 'the Highlight Color shows in the layer around and behind the ears'],
  ['split_dye_vertical', 'name from CMS', 'the hair is split left / right into the two colours'],
  ['split_dye_horizontal', 'name from CMS', 'the hair is split top / bottom into the two colours'],
];

const rows: Row[] = [
  // Intro Demo
  { id: 'TC-001', sec: S1, pre: 'Fresh install (or app data cleared); AI Hair Color never opened', act: 'Open AI Hair Color from its Launcher entry', exp: 'The Intro Demo page shows 「AI Hair Color」, 「Go beyond traditional hair colors! Explore everything from subtle highlights to vibrant, bold shades.」, an orange 「Try Now」, an unticked 「Don\'t show again」 and ‹ at the top left', pri: 'P2', ref: 'R-002', notes: `Q-8 (10/E says no demo on first entry; this newer page draws one). ${PM}` },
  { id: 'TC-002', sec: S1, pre: 'Intro Demo page shown (TC-001)', act: 'Tap 「Try Now」', exp: 'The Intro Demo closes and AI Hair Color continues (photo picker, then the colour page)', pri: 'P2', ref: 'R-003', notes: PM },
  { id: 'TC-003', sec: S1, pre: 'Intro Demo page shown; 「Don\'t show again」 not ticked', act: 'Tap ‹ at the top left', exp: 'AI Hair Color closes and the screen it was opened from shows again', pri: 'P2', ref: 'R-004', notes: PM },
  { id: 'TC-004', sec: S1, pre: 'Intro Demo page shown; run after every row that needs the Intro Demo (one-way state)', act: '1. Tick 「Don\'t show again」\n2. Tap 「Try Now」\n3. Leave AI Hair Color\n4. Open AI Hair Color again', exp: 'The Intro Demo page does not show on the second entry', pri: 'P3', ref: 'R-005', notes: PM },
  // Entry checks
  { id: 'TC-005', sec: S2, pre: 'A photo whose face is tilted clearly more than 15° (yaw or roll), normal 4:5 ratio', act: 'Open AI Hair Color from Launcher and pick the photo', exp: 'A dialog shows 「Please choose another photo」, 「The face in this photo is too slanted, which may result in poorly generated results.」, 「OK」 and 「Continue Anyway」; no credits are used', pri: 'P2', ref: 'R-007', notes: `Thresholds and strings as Hair Volume / AI Hairstyle. ${PM}` },
  { id: 'TC-006', sec: S2, pre: 'The slanted-face dialog is shown (TC-005)', act: 'Tap 「OK」', exp: 'The room does not open; the user can choose another photo', pri: 'P2', ref: 'R-009', notes: PM },
  { id: 'TC-007', sec: S2, pre: 'The slanted-face dialog is shown (TC-005)', act: 'Tap 「Continue Anyway」', exp: 'The AI Hair Color room opens with the slanted photo, 「Custom」 first in the swatch row', pri: 'P2', ref: 'R-009', notes: PM },
  { id: 'TC-008', sec: S2, pre: 'A photo whose face is small (narrower than about 1/8 of the image width), normal ratio', act: '1. Open AI Hair Color from Launcher and pick the photo\n2. Tap 「Continue Anyway」', exp: '1. A face-too-small warning shows with 「OK」 and 「Continue Anyway」 (record its text)\n2. The room opens with the photo', pri: 'P2', ref: 'R-008, R-009', notes: `128 px on the 1024 px thumbnail = 1/8 of the long side. String not drawn: AI Hairstyle's (Q-9). ${PM}` },
  { id: 'TC-009', sec: S2, pre: 'A photo with no face (landscape, object)', act: 'Open AI Hair Color from Launcher and pick the photo', exp: '「No face detected. Face is required for this feature.」 shows and the room does not open', pri: 'P2', ref: 'R-010', notes: PM },
  { id: 'TC-010', sec: S2, pre: 'A close-up photo whose face fills most of the frame', act: 'Open AI Hair Color from Launcher and pick the photo', exp: '「The face in this photo is too big.」 shows and the room does not open; there is no Continue Anyway', pri: 'P2', ref: 'R-011', notes: PM },
  { id: 'TC-011', sec: S2, pre: 'A 21:9 panorama with a slanted face', act: 'Open AI Hair Color from Launcher and pick the photo', exp: 'The ratio dialog with 「Cancel」 and 「Crop」 shows first, with no Continue Anyway; no face warning shows before it', pri: 'P2', ref: 'R-012, R-006', notes: `Ratio dialog drawn on the 10/E page (entry_blocked_ratio). ${PM}` },
  { id: 'TC-012', sec: S2, pre: 'The ratio dialog is shown for the 21:9 slanted-face photo (TC-011)', act: '1. Tap 「Crop」\n2. Choose 4:5 and tap ✓', exp: '1. The existing Crop room opens\n2. Back in AI Hair Color the slanted-face warning shows, checked on the cropped image', pri: 'P2', ref: 'R-013', notes: PM },
  { id: 'TC-013', sec: S2, pre: 'A 21:9 photo with no face', act: 'Open AI Hair Color from Launcher and pick the photo', exp: '「No face detected. Face is required for this feature.」 shows; the ratio dialog does not show (no face is checked first)', pri: 'P3', ref: 'R-006', notes: PM },
  { id: 'TC-014', sec: S2, pre: 'A close-up photo whose face is too big and tilted more than 15°', act: 'Open AI Hair Color from Launcher and pick the photo', exp: '「The face in this photo is too big.」 shows (blocked); the slanted warning does not show', pri: 'P3', ref: 'R-006', notes: PM },
  { id: 'TC-015', sec: S2, pre: 'A slanted-face photo open in Edit Room', act: 'Open Portrait › Hair › AI Hair Color from Edit Room', exp: 'The slanted-face warning shows right away, with no photo picker', pri: 'P2', ref: 'R-014', notes: PM },
  { id: 'TC-016', sec: S2, pre: { ios: 'A 16:9 photo and a 2:1 photo, each with one front-facing face', android: 'A 16:9 photo, a 2:1 photo and a 4:1 photo, each with one front-facing face' }, act: { ios: '1. Open AI Hair Color with the 16:9 photo\n2. Leave the room\n3. Open AI Hair Color with the 2:1 photo', android: '1. Open AI Hair Color with the 16:9 photo\n2. Leave the room\n3. Open AI Hair Color with the 2:1 photo\n4. Leave the room\n5. Open AI Hair Color with the 4:1 photo' }, exp: { ios: '1. The 16:9 photo opens the room with no ratio dialog\n3. The 2:1 photo shows the 「Cancel」 / 「Crop」 ratio dialog', android: '1. The 16:9 photo opens the room with no ratio dialog\n3. The 2:1 photo shows the 「Cancel」 / 「Crop」 ratio dialog\n5. The 4:1 photo shows the same dialog (the old 5:1 limit does not apply)' }, pri: 'P2', ref: 'R-015, R-012', notes: { ios: `iOS did not check ratio before (D2-01b). ${PM}`, android: `Android AI Hairstyle allowed up to 5:1 (D2-01b). ${PM}` } },
  // Custom cell
  { id: 'TC-017', sec: S3, pre: `${PHOTO}; Solid tab`, act: 'Open AI Hair Color from Launcher and pick the photo', exp: '「Custom」 is the first cell of the swatch row, before 「Platinum」; it shows a gradient with ＋ and is not selected; the first template (「Platinum」) is selected', pri: 'P1', ref: 'R-016, R-017', notes: `Q-2: mockups draw a pencil icon. ${PM}` },
  { id: 'TC-018', sec: S3, pre: ROOM, act: '1. Tap the 「Multicolor」 tab\n2. Tap the 「Solid」 tab', exp: '1. 「Custom」 is the first cell of the Multicolor row too\n2. 「Custom」 is first again in the Solid row', pri: 'P2', ref: 'R-016', notes: `Q-1 (only Solid drawn). ${PM}` },
  { id: 'TC-019', sec: S4, pre: ROOM, act: 'Tap 「Custom」', exp: 'A half-screen sheet titled 「Custom」 opens with ⌄ at the top right, the 「Style」 area, the 「Base Color」 and 「Highlight Color」 rows and an orange Generate with ⬤ 6 inside it; the ✕ ↺ ↻ ✓ row is not shown', pri: 'P1', ref: 'R-018, R-019, R-020, R-039', notes: PM },
  { id: 'TC-020', sec: S4, pre: PANEL, act: 'Look at the panel against the screen height', exp: 'The panel covers at most about two thirds of the screen (0.65 of the height) with rounded top corners; the photo stays visible above it', pri: 'P3', ref: 'R-021', notes: PM },
  { id: 'TC-030', sec: S4, pre: `${PANEL}; style 「Ombré」 selected`, act: '1. Swipe the 「Base Color」 row sideways\n2. Swipe the 「Highlight Color」 row sideways', exp: 'Each row starts with a rainbow colour-wheel key with a ＋ badge followed by 7 round recommended colours, and scrolls sideways', pri: 'P2', ref: 'R-022', notes: PM },
  { id: 'TC-021', sec: S5, pre: `${PANEL}; no style chosen yet`, act: '1. Tap a colour in 「Base Color」\n2. Tap Generate', exp: 'Both colour rows and Generate look disabled and nothing happens on either tap', pri: 'P1', ref: 'R-023', notes: PM },
  { id: 'TC-022', sec: S5, pre: PANEL, act: 'Swipe the 「Style」 row to its end', exp: 'Every published Custom style shows with its thumbnail and name (「Face」, 「Bangs」, 「Highlight」, 「Balayage」, 「Ombré」, 「Solid」, …), 11 on day 1 by the fallback; the two split-dye styles have plain-colour thumbnails', pri: 'P2', ref: 'R-024, R-025', notes: `Day-1 list and premium styles: Q-6. ${PM}` },
  { id: 'TC-023', sec: S5, pre: `${PANEL}; no style chosen yet`, act: 'Tap 「Ombré」', exp: '「Ombré」 shows the selected frame (#ffbe98) and both colour rows become enabled', pri: 'P1', ref: 'R-026', notes: PM },
  { id: 'TC-024', sec: S5, pre: PANEL, act: 'Tap 「Solid」', exp: 'Only the 「Base Color」 row shows; no 「Highlight Color」 row', pri: 'P1', ref: 'R-027', notes: PM },
  { id: 'TC-025', sec: S5, pre: `${PANEL}; 「Solid」 selected`, act: 'Tap a recommended colour in 「Base Color」', exp: 'The colour shows its ring and Generate is enabled, showing 「Generate」 with ⬤ 6 (no minus sign)', pri: 'P1', ref: 'R-028, R-038', notes: PM },
  { id: 'TC-026', sec: S5, pre: `${PANEL}; 「Ombré」 selected; no colours chosen`, act: 'Tap a recommended colour in 「Base Color」 only', exp: 'Generate stays disabled and 「Both Base Color and Highlight Color are required.」 shows under the rows', pri: 'P1', ref: 'R-029', notes: PM },
  { id: 'TC-027', sec: S5, pre: `${PANEL}; 「Balayage」 selected; no colours chosen`, act: 'Tap a recommended colour in 「Highlight Color」 only', exp: 'Generate stays disabled and 「Both Base Color and Highlight Color are required.」 shows', pri: 'P2', ref: 'R-029', notes: PM },
  { id: 'TC-028', sec: S5, pre: `${PANEL}; 「Ombré」 selected`, act: '1. Tap a colour in 「Base Color」\n2. Tap a colour in 「Highlight Color」', exp: 'Each chosen colour has a 2 pt #FFBE98 ring and Generate is enabled with ⬤ 6', pri: 'P1', ref: 'R-030, R-038', notes: PM },
  { id: 'TC-029', sec: S5, pre: `${PANEL}; 「Ombré」 with both colours chosen`, act: '1. Tap 「Solid」\n2. Tap 「Ombré」 again', exp: '1. The 「Highlight Color」 row disappears (record whether Base stays chosen and Generate stays enabled)\n2. The 「Highlight Color」 row comes back (record whether its colour is kept)', pri: 'P2', ref: 'R-027, R-029', notes: `Q-3. ${PM}` },
  // Palette
  { id: 'TC-031', sec: S6, pre: `${PANEL}; 「Ombré」 selected`, act: 'Tap the colour-wheel key of 「Base Color」', exp: 'The app\'s colour palette opens: 「Cancel」 and 「Done」 on one line, a saturation-brightness square with a round cursor, a rainbow hue slider with a round handle an eyedropper key right of the slider and, below, the bottom row ✕ ↩ ↪ ⊕ ✓ (described in the note, not drawn: record it)', pri: 'P1', ref: 'R-033', notes: PM },
  { id: 'TC-032', sec: S6, pre: 'The palette opened from 「Base Color」 (TC-031)', act: '1. Drag the hue handle to blue\n2. Drag the cursor in the square\n3. Tap 「Done」', exp: 'The palette closes; the 「Base Color」 row now holds the picked blue as its chosen colour; 「Highlight Color」 is unchanged', pri: 'P1', ref: 'R-034, R-035', notes: PM },
  { id: 'TC-033', sec: S6, pre: `${PANEL}; 「Ombré」 with a Base Color chosen`, act: '1. Tap the colour-wheel key of 「Highlight Color」\n2. Pick a purple\n3. Tap 「Done」', exp: 'Only the 「Highlight Color」 row takes the purple; 「Base Color」 keeps its colour; Generate is enabled', pri: 'P1', ref: 'R-034', notes: PM },
  { id: 'TC-034', sec: S6, pre: `${PANEL}; 「Ombré」 with a Base Color chosen`, act: '1. Tap the colour-wheel key of 「Base Color」\n2. Pick another colour\n3. Tap 「Cancel」', exp: 'The palette closes and 「Base Color」 keeps the colour it had before', pri: 'P2', ref: 'R-035', notes: PM },
  { id: 'TC-035', sec: S6, pre: 'The palette opened from 「Base Color」', act: '1. Tap the eyedropper key\n2. Pick a colour on the photo\n3. Tap 「Done」', exp: 'The picked photo colour fills 「Base Color」, as the app\'s existing palette does elsewhere', pri: 'P3', ref: 'R-037', notes: PM },
  { id: 'TC-036', sec: S6, pre: `${PANEL}; ${BAL}; 「Solid」 with a pure blue Base Color picked in the palette; app log capture on`, act: '1. Tap Generate\n2. Wait for the result\n3. Pull the app log', exp: '1. The hair in the result is that blue\n2. The generation request carries the colour as r/g/b values between 0 and 255 (blue ≈ 0/0/255)', pri: 'P2', ref: 'R-036', notes: `Hidden clause; park the log part until a log pull is set up. ${PM}` },
  { id: 'TC-037', sec: S6, pre: `${PANEL}; ${BAL}; 「Solid」 with a Base Color; app log capture on`, act: '1. Tap Generate\n2. Wait for the result\n3. Pull the app log', exp: 'The request sends style solid_color with main_color_r/g/b only and no accent colour', pri: 'P3', ref: 'R-031', notes: `Hidden clause; park until a log pull is set up. ${PM}` },
  // Collapse
  { id: 'TC-038', sec: S7, pre: `${PANEL}; 「Ombré」 with both colours chosen`, act: 'Tap ⌄ at the top right of the panel', exp: 'The panel closes; the swatch row is back with 「Custom」 selected and showing the two chosen colours; the outer Generate is enabled with ⬤ 6', pri: 'P1', ref: 'R-042, R-043, R-044', notes: `Q-2: the mockup draws a pencil icon in the cell. ${PM}` },
  { id: 'TC-039', sec: S7, pre: `${PANEL}; 「Balayage」 with both colours chosen`, act: 'Tap the photo area above the panel', exp: 'The panel closes and the settings are applied as with ⌄: 「Custom」 selected with its colours, outer Generate enabled', pri: 'P1', ref: 'R-042', notes: PM },
  { id: 'TC-040', sec: S7, pre: `Custom applied by collapse (TC-038); ${BAL}`, act: 'Tap the outer Generate', exp: 'A Custom generation starts in place (「Applying your new hair color...」) and 6 credits are taken', pri: 'P1', ref: 'R-043', notes: PM },
  { id: 'TC-041', sec: S7, pre: 'Custom applied by collapse (Ombré, two colours), not generated', act: '1. Tap 「Platinum」\n2. Tap 「Custom」', exp: '1. The selection ring moves to 「Platinum」; the Custom cell still shows the two colours\n2. The panel opens with 「Ombré」 and the same two colours chosen', pri: 'P1', ref: 'R-046, R-044', notes: PM },
  { id: 'TC-042', sec: S7, pre: 'Custom applied (Ombré, two colours)', act: '1. Tap 「Custom」\n2. Choose 「Solid」 and another Base Color\n3. Tap ⌄', exp: 'The Custom cell now shows the new colour and reopening the panel shows 「Solid」 with it (the user\'s own overwrite replaces the old settings)', pri: 'P2', ref: 'R-045', notes: PM },
  { id: 'TC-043', sec: S7, pre: 'Custom applied (Ombré, two colours)', act: '1. Tap ✕ to leave the room\n2. Open AI Hair Color again with the same photo\n3. Tap 「Custom」', exp: 'The Custom cell is back to its unset look and the panel has no style or colours chosen', pri: 'P2', ref: 'R-045', notes: PM },
  // Generate and wait
  { id: 'TC-045', sec: S8, pre: `${PANEL}; ${BAL}; 「Ombré」 with both colours chosen; note the credit chip`, act: 'Tap Generate in the panel', exp: 'Generation runs in place with 「Applying your new hair color...」 over the photo; the swatch row and Generate are disabled; the credit chip drops by 6', pri: 'P1', ref: 'R-047, R-049, R-040, R-001', notes: PM },
  { id: 'TC-046', sec: S8, pre: 'A Custom generation just started (TC-045)', act: 'Time the wait until the result shows', exp: 'The result shows after about 42–48 s; the reassuring text changes in stages during the wait and an animation runs the whole time (no 10 s without one)', pri: 'P2', ref: 'R-047', notes: `Later strings not given (Q-10). ${PM}` },
  { id: 'TC-078', sec: S8, pre: `${ROOM}; ${BAL}; 「Platinum」 selected`, act: 'Tap Generate and time the wait', exp: 'The template result shows with its short wait (about 15 s as 10/E), not the 42–48 s Custom wait', pri: 'P3', ref: 'R-048', notes: PM },
  { id: 'TC-047', sec: S8, pre: 'A Custom generation started from the panel\'s Generate without collapsing (TC-045)', act: 'Wait for the result', exp: 'The panel stays open; the result fills the photo area above; a 44 pt Intensity row at 100 appears above the panel\'s button, which now reads 「Retry」 with ⬤ 6', pri: 'P1', ref: 'R-041', notes: `result_in_panel not drawn (Q-4). ${PM}` },
  { id: 'TC-051', sec: S8, pre: `${PANEL}; ${BAL}; 「Solid」 with a Base Color; note the credit chip`, act: 'Tap Generate 5 times quickly', exp: 'One generation runs; the chip drops by 6 only once and one result shows', pri: 'P2', ref: 'R-051', notes: PM, only: 'android' },
  { id: 'TC-052', sec: S8, pre: `${PANEL}; ${BAL}; 「Solid」 with a Base Color; note the credit chip`, act: '1. Tap Generate\n2. Force-stop the app during the wait\n3. Open AI Hair Color again', exp: 'No Custom result is shown or recalled and the 6 credits stay charged (no refund), as the 10/E spec states', pri: 'P3', ref: 'R-050', notes: `Q-12. ${PM}` },
  // Result
  { id: 'TC-048', sec: S9, pre: `Custom applied by collapse; ${BAL}`, act: '1. Tap the outer Generate\n2. Wait for the result', exp: 'The result shows in place with the Intensity bar at 100 (0–100 range) above the tabs, and the button reads 「Retry」 with ⬤ 6', pri: 'P1', ref: 'R-052', notes: PM },
  { id: 'TC-049', sec: S9, pre: 'A Custom result with Intensity dragged to 50; note the credit chip', act: '1. Tap 「Retry」\n2. Wait for the result', exp: 'A new result replaces the old one, the chip drops by 6 and the Intensity bar is back at 100', pri: 'P1', ref: 'R-053, R-054', notes: PM },
  { id: 'TC-053', sec: S9, pre: 'A Custom result at Intensity 100; note the credit chip', act: '1. Drag the Intensity handle to about 50 and release\n2. Tap ↺\n3. Tap ↻', exp: '1. The new colour shows at about half strength over the original; the chip does not change\n2. Intensity goes back to 100\n3. Intensity returns to about 50', pri: 'P2', ref: 'R-056', notes: PM },
  { id: 'TC-054', sec: S9, pre: 'A Custom result with Intensity at 50; note the credit chip', act: '1. Tap 「Platinum」\n2. Tap 「Custom」 and collapse the panel with ⌄', exp: 'The Custom result and its Intensity 50 come back without a new generation; the chip is unchanged; the button reads 「Retry」', pri: 'P1', ref: 'R-055', notes: PM },
  { id: 'TC-055', sec: S9, pre: 'A Custom result just shown, Intensity dragged to 30, ✓ not tapped', act: 'Tap the Artwork key at the top right', exp: 'My AI Artwork opens on the AI Hair tab, Color sub-tab, and the Custom result is listed at full intensity (100%)', pri: 'P1', ref: 'R-057', notes: PM },
  { id: 'TC-056', sec: S9, pre: 'A Custom result with Intensity at 60', act: 'Tap ✓', exp: { ios: 'Edit Room shows the result at Intensity 60 on the canvas; one undo in Edit Room returns to the photo before AI Hair Color', android: 'A new Edit Room opens with the result at Intensity 60' }, pri: 'P1', ref: 'R-058', notes: { ios: `10/E D1-07: iOS writes back to the canvas as one undo step. ${PM}`, android: `10/E D1-07: Android saves silently and opens a new Edit Room. ${PM}` } },
  { id: 'TC-057', sec: S9, pre: 'The Intensity notice never dismissed with 「Don\'t show again」; first result of this install', act: 'Generate a Custom result', exp: 'A one-time dialog says My AI Artwork keeps only the 100% version; after 「OK」 the Intensity bar can be used', pri: 'P3', ref: 'R-059', notes: `10/E dialog, behaviour inherited (D1-15). ${PM}` },
  // Styles generated
  ...STYLES.map(([api, ui, look], i): Row => ({
    id: `TC-${String(58 + i).padStart(3, '0')}`, sec: S10,
    pre: `${PANEL}; ${BAL}`,
    act: api === 'solid_color'
      ? `1. Tap 「${ui}」\n2. Choose a vivid Base Color (red)\n3. Tap Generate`
      : `1. Tap the ${api} style (${ui})\n2. Choose a dark Base Color and a vivid Highlight Color\n3. Tap Generate`,
    exp: `The result shows the ${api} pattern: ${look}; the hairstyle outline, hair length, face, background and clothes do not change; 6 credits are taken`,
    pri: api === 'solid_color' || api === 'ombre' ? 'P1' : 'P2', ref: 'R-032, R-060',
    notes: `Look described from the style name (the spec gives none). ${PM}`,
  })),
  // Credits and failures
  { id: 'TC-069', sec: S11, pre: `${PANEL}; Free user; a Custom style whose usageType is purchase`, act: '1. Choose the premium style and its colours\n2. Tap Generate', exp: 'The paywall opens and no credits are taken', pri: 'P1', ref: 'R-061', notes: `Which styles are premium: Q-6. ${PM}` },
  { id: 'TC-070', sec: S11, pre: `${PANEL}; Free user with fewer than 6 credits; a free style`, act: '1. Choose the style and colours\n2. Tap Generate', exp: '「Upgrade to Premium」 shows; its button opens the paywall', pri: 'P1', ref: 'R-062', notes: PM },
  { id: 'TC-071', sec: S11, pre: { ios: `${PANEL}; Pro user with fewer than 6 credits`, android: `${PANEL}; VIP user with fewer than 6 credits` }, act: '1. Choose a style and colours\n2. Tap Generate\n3. Tap 「Get Credit」', exp: '2. 「More Credits Required!」 shows\n3. The Credit Shop opens', pri: 'P1', ref: 'R-063', notes: PM },
  { id: 'TC-072', sec: S11, pre: `${PANEL}; Pro+ user with fewer than 6 credits`, act: '1. Choose a style and colours\n2. Tap Generate\n3. Tap 「Get Credit」', exp: '2. 「More Credits Required!」 shows\n3. The Credit Shop opens', pri: 'P2', ref: 'R-063', notes: `KP-013: Pro and Pro+ are separate modes. ${PM}`, only: 'ios' },
  { id: 'TC-073', sec: S11, pre: `${PANEL}; account with fewer than 6 credits; Quick Credit Refill not used yet`, act: '1. Choose a style and colours\n2. Tap Generate', exp: 'The Quick Credit Refill offer (one-time 10-credit pack) shows', pri: 'P2', ref: 'R-064', notes: `Android only (10/E D4-04). ${PM}`, only: 'android' },
  { id: 'TC-075', sec: S11, pre: `${PANEL}; ${BAL}; a server failure 4002 can be forced (RD fixture)`, act: 'Tap Generate', exp: '「Please Try Different Content」 shows and the 6 credits are refunded', pri: 'P2', ref: 'R-065', notes: `Park: needs a failure fixture. ${PM}` },
  { id: 'TC-076', sec: S11, pre: `${PANEL}; ${BAL}; another server failure can be forced (RD fixture)`, act: 'Tap Generate', exp: '「An Error Has Occurred」 shows and the 6 credits are refunded', pri: 'P2', ref: 'R-065', notes: `Park: needs a failure fixture. ${PM}` },
  { id: 'TC-050', sec: S11, pre: 'One Custom generation done (TC-045)', act: '1. Tap the credit chip\n2. Open 「Detail」 at the top right of Buy Credit', exp: 'The newest entry is AI Hair Color with 6 credits deducted', pri: 'P2', ref: 'R-066, R-040', notes: PM, only: 'android' },
  { id: 'TC-077', sec: S11, pre: ROOM, act: { ios: 'Compare the credit chip with the balance in Mine', android: '1. Compare the credit chip with the balance in Mine\n2. Tap the credit chip' }, exp: { ios: 'The chip shows the same balance (record what tapping it opens)', android: '1. The chip shows the same balance\n2. Buy Credit opens' }, pri: 'P2', ref: 'R-067', notes: { ios: `What the chip opens on iOS is not stated (Q-16). ${PM}`, android: PM } },
  // Leaving
  { id: 'TC-079', sec: S12, pre: 'A Custom result shown, panel closed; opened from Launcher', act: 'Tap ✕ at the bottom left', exp: 'The room closes with no confirmation and the screen before entry shows; the result is still in My AI Artwork', pri: 'P1', ref: 'R-068', notes: PM },
  // Deeplink
  { id: 'TC-081', sec: S13, pre: `A Custom deeplink for the ombre style guid from RD; ${PHOTO.toLowerCase()} ready`, act: '1. Open the deeplink\n2. Pick the photo if asked', exp: 'AI Hair Color opens with the Custom panel open and 「Ombré」 selected; no colours are chosen and Generate is disabled', pri: 'P2', ref: 'R-069, R-070', notes: `Park until RD gives the link format (Q-11; fallback mode=custom&style_guid=<guid>). ${PM}` },
  { id: 'TC-082', sec: S13, pre: 'A Custom deeplink with an unknown or unpublished style guid', act: 'Open the deeplink', exp: 'The Custom panel opens with no style selected and no error is shown', pri: 'P2', ref: 'R-071', notes: `Park until RD gives the link format (Q-11). ${PM}` },
  // CMS
  { id: 'TC-084', sec: S14, pre: 'The CMS list of PhDM_AIHairColor_CustomStyle (names, order, published state) from the CMS owner', act: 'Open the Custom panel and compare the Style row with the CMS list', exp: 'The names, thumbnails and order match CMS and only published styles show', pri: 'P3', ref: 'R-024', notes: `Park: needs CMS data (Q-13). ${PM}` },
  // Android system Back
  { id: 'TC-090', sec: S15, pre: 'Intro Demo page shown', act: 'Press system Back', exp: 'Same as ‹: AI Hair Color closes to the screen it was opened from', pri: 'P2', ref: 'R-072', notes: PM, only: 'android' },
  { id: 'TC-087', sec: S15, pre: 'The slanted-face warning is shown', act: 'Press system Back', exp: 'Record what happens (expected like 「OK」: the room does not open)', pri: 'P3', ref: 'R-073', notes: `Q-14. ${PM}`, only: 'android' },
  { id: 'TC-085', sec: S15, pre: `${PANEL}; 「Ombré」 with both colours chosen`, act: 'Press system Back', exp: 'Record what happens (expected like ⌄: the panel closes and the settings are applied, the room stays)', pri: 'P2', ref: 'R-074', notes: `Q-14. ${PM}`, only: 'android' },
  { id: 'TC-086', sec: S15, pre: 'The palette is open from 「Base Color」 with another colour picked', act: 'Press system Back', exp: 'Same as 「Cancel」: the palette closes and 「Base Color」 is unchanged', pri: 'P2', ref: 'R-075', notes: PM, only: 'android' },
  { id: 'TC-088', sec: S15, pre: 'A Custom result shown, panel closed; opened from Launcher', act: 'Press system Back', exp: 'Same as ✕: the room closes with no confirmation', pri: 'P2', ref: 'R-076', notes: PM, only: 'android' },
  { id: 'TC-089', sec: S15, pre: 'A Custom generation running', act: 'Press system Back', exp: 'Record what happens (the screen, whether the generation continues and the credits)', pri: 'P3', ref: 'R-077', notes: `Q-14. ${PM}`, only: 'android' },
];

const q = (s: string) => /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
const v = (f: F | undefined, p: P) => f === undefined ? '' : typeof f === 'string' ? f : f[p];
const here = import.meta.dirname;
// One item per line (formats.md, user 2026-11-12): split on a top-level ";" (not inside (), 「」 or quotes).
const split = (s: string) => {
  const parts: string[] = []; let depth = 0, cur = '';
  for (const ch of s) {
    if ('(「“"'.includes(ch) && !(ch === '"' && depth)) depth++;
    else if (')」”'.includes(ch) || (ch === '"' && depth)) depth = Math.max(0, depth - 1);
    if (ch === ';' && !depth) { parts.push(cur.trim()); cur = ''; } else cur += ch;
  }
  parts.push(cur.trim());
  return parts.filter(Boolean);
};
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const fmtPre = (s: string) => { const p = split(s); return p.length < 2 ? s : p.map((x, i) => `${i + 1}. ${cap(x)}`).join('\n'); };
const fmtExp = (s: string) => {
  const lines = s.split('\n');
  if (/^\d+\. /.test(lines[0])) {
    if (!lines.some(l => split(l).length > 1)) return s;
    return lines.flatMap(l => { const m = l.match(/^(\d+)\. (.*)$/)!; return split(m[2]).map(x => `Step ${m[1]}: ${x}`); }).join('\n');
  }
  const p = split(s); return p.length < 2 ? s : p.map(cap).join('\n');
};
for (const p of ['android'] as P[]) { // Android only (REQ-002)
  const out = ['ID,Section,Precondition,Action,Expected Result,Priority,Spec Ref,Notes,Change,Change Reason'];
  for (const r of rows) {
    if (r.only && r.only !== p) continue;
    out.push([r.id, r.sec, fmtPre(v(r.pre, p)), v(r.act, p), fmtExp(v(r.exp, p)), r.pri, v(r.ref, p), v(r.notes, p), 'new', 'New table (REQ-001)'].map(q).join(','));
  }
  const dir = join(here, '..', '..', '..', p, 'drafts', '20261112-100854');
  writeFileSync(join(dir, 'draft.csv'), out.join('\n') + '\n');
  console.log(p, out.length - 1, 'rows');
}
