// Build the first Creative Reel (Reel Creator room) Android draft (user, 2026-11-02, REQ-001) on spec set 2026-11-02
// (Creative Reel.pdf, "Reel Creator（原 Cinematic Reel Creator）— Room & Template Preview"), PDF-only. Rows follow the
// user journey: room and entries → Preview → photo tips → picker → picker memory → confirm page → text language →
// generation and My AI Artwork → Cinematic Styles → AI Transition → Android system Back. Every row is Change = new.
// Re-runnable: node library/phd/creative-reel/android/drafts/20261102-175916/build-draft.ts
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DRAFT_COLUMNS, writeTable } from '../../../../../../scripts/lib/library.ts';

const HERE = dirname(fileURLToPath(import.meta.url));
// id: a row added after the first build keeps the next free ID wherever it is placed (REQ-033), so earlier IDs stay put
type Row = [section: string, pre: string, action: string, expected: string, prio: string, refs: string, notes?: string, id?: string];
// rows changed by a later request: the request named in Change Reason
const DOMAIN = 'New table (REQ-001); PHD domain knowledge (REQ-004)';
const REASON: Record<string, string> = {
  ...Object.fromEntries(['TC-012', 'TC-013', 'TC-015', 'TC-021', 'TC-055', 'TC-062', 'TC-068', 'TC-072', 'TC-073', 'TC-085', 'TC-086', 'TC-103',
    ...Array.from({ length: 13 }, (_, i) => `TC-${113 + i}`)].map(id => [id, DOMAIN])),
  'TC-008': 'New table (REQ-001); credit button per domain K75 (REQ-003)',
  'TC-112': 'New table (REQ-001); History button per domain K76 (REQ-003)',
  'TC-048': 'New table (REQ-001); size boundary outside the MB / MiB gap (REQ-006)',
  'TC-101': 'New table (REQ-001); 9:16 output per feature (REQ-006)',
  'TC-126': 'New table (REQ-001); size boundary outside the MB / MiB gap (REQ-006)',
  'TC-127': 'New table (REQ-001); 9:16 output per feature (REQ-006)',
};

const FREE = 'Signed in with a Free (non-Premium) account';
const PREM = 'Signed in with a PhotoDirector Premium (subscribed) account';
const ROOM = 'Reel Creator room open';
const TOP5 = 'Preview of the Creative template 「Top 5 of My Year」 (Year-End Recap, 5–15 photos)';
const PICK = 'Picker of 「Top 5 of My Year」 (opened by 「Use Template」), nothing picked';
const CONF = 'Confirm page of 「Top 5 of My Year」 reached with 7 photos picked';
const NEWSESSION = 'App relaunched (force-stop, then launch) so a new session starts';
const DEEP = 'needs: deeplink URLs from RD (Q-15).';

const rows: Row[] = [
  // ---------- Room ----------
  ['Room', 'Fresh launch of the build under test', 'Open the Effects menu and read the room button', 'The button is labelled 「Reel Creator」 (no longer 「Cinematic Reel Creator」)', 'P2', 'R-002'],
  ['Room', 'Launcher open', 'Read the Launcher Shortcut for the room', 'The shortcut is labelled 「Reel Creator」', 'P2', 'R-003'],
  ['Room', 'Launcher open', 'Scroll to the Launcher Template row of the room and read its title', 'The row is titled 「Reel Creator」', 'P2', 'R-004'],
  ['Room', 'AI Video page open', 'Read the room entry on the AI Video page', 'The entry is labelled 「Reel Creator」', 'P2', 'R-005'],
  ['Room', 'Launcher open', 'Tap the 「Reel Creator」 Launcher Shortcut', 'The room opens titled 「Reel Creator」; top bar shows 「‹」, the credit pill (balance and 「+」) and a history icon', 'P1', 'R-001, R-008'],
  ['Room', ROOM, 'Scroll the room from top to bottom and read the section headers', 'No tabs; one page of sections including 「Cinematic Styles 🎬」, 「Year-End Recap 📅」, 「Christmas Time 🎄」 and 「Cool Transitions 🤳🏻」, the three features mixed', 'P1', 'R-006, R-009', 'Section order is pending (Q-1): record the order shown.'],
  ['Room', ROOM, 'Swipe each section\'s row of cards left and right', 'Each section scrolls horizontally through its own template cards', 'P2', 'R-007'],
  ['Room', `${ROOM}; note the account's credit balance`, 'Read the blue credit button at the top right, then tap it', 'The button shows the account\'s current balance and a 「+」; tapping it opens the Buy Credit page', 'P2', 'R-008', 'Domain K75 (user, 2026-11-03). The same button is on the Preview and the confirm page.'],
  ['Room', ROOM, 'Tap the History button (a sheet of paper with a clock) at the top right', 'My AI Artwork opens with the 「Reel Creator」 tab selected', 'P2', 'R-101', 'Domain K76 (user, 2026-11-03).', 'TC-112'],
  ['Room', ROOM, 'Tap 「‹」', 'Leaves the room to the page it was opened from', 'P3', 'R-089'],
  ['Room', 'Launcher open', 'Open the room from each entry in turn: Effects button, Launcher Shortcut, Launcher Template row, AI Video page, My AI Artwork 「Create More」; after each, tap 「‹」', 'Every entry opens the Reel Creator room; each 「‹」 returns to the page that entry was on', 'P2', 'R-108', 'Domain K01: every entry is its own path.', 'TC-113'],

  // ---------- Entry from Edit Room ----------
  ['Entry from Edit Room', 'Edit Room open with a photo, an edit applied', 'Tap the Reel Creator entry in the Edit Room', 'A dialog (as Image to Video) asks whether to jump to Reel Creator', 'P1', 'R-010', 'Dialog copy not drawn (Q-13): note it.'],
  ['Entry from Edit Room', 'Jump dialog shown from the Edit Room', 'Choose the cancel option', 'The dialog closes; the Edit Room stays with the photo and its edit', 'P2', 'R-011'],
  ['Entry from Edit Room', 'Jump dialog shown from the Edit Room; note the photo count in the Gallery', 'Confirm the jump', 'The Reel Creator room opens; the photo was saved to the Gallery automatically, with the Edit Room edit applied (not the original file)', 'P1', 'R-010, R-012, R-109', 'Domain K02 (PHA262026-0382: the original photo was used instead of the edited one).'],
  ['Entry from Edit Room', 'Reel Creator room opened from the Edit Room', 'Open a Cinematic Styles template, tap 「Use Template」; do the same with a Creative template', 'Neither picker has the Edit Room photo preselected (0 picked); the room opened without carrying the photo', 'P1', 'R-012', 'Today CineStory carries the photo in; the new spec does not. Domain K02 (edited image carried in) no longer applies: the spec wins.'],

  // ---------- Deeplink ----------
  ['Deeplink', 'PhotoDirector closed; old Cinematic Reel Creator deeplink without parameters', 'Open the deeplink (adb `am start -a android.intent.action.VIEW -d <link>`)', 'The Reel Creator room opens', 'P2', 'R-013, R-014', DEEP],
  ['Deeplink', 'PhotoDirector already running on another page (e.g. Edit Room); deeplink with template = a Creative content GUID', 'Open the deeplink', 'The same Preview opens as from a cold start; no crash, the template list is loaded', 'P2', 'R-110, R-015', `${DEEP} Domain K05 (cold vs warm start, data not loaded yet).`, 'TC-114'],
  ['Deeplink', 'Deeplink with template = the content GUID of a Creative template', 'Open the deeplink', 'That template\'s Preview opens directly; no photo is selected', 'P2', 'R-015, R-017', `${DEEP} Domain K04: the linked template itself, not the category\'s first.`],
  ['Deeplink', 'Deeplink with template = the content GUID of an AI Transition template', 'Open the deeplink', 'That template\'s Preview opens directly', 'P2', 'R-015, R-017', DEEP],
  ['Deeplink', 'Deeplink with template = a CineStory (Cinematic Styles) GUID', 'Open the deeplink', 'That Cinematic template\'s Preview opens directly; no photo is selected', 'P2', 'R-015, R-016', DEEP],
  ['Deeplink', 'Deeplink with template = a GUID that does not exist', 'Open the deeplink', 'The Reel Creator room opens (no error page)', 'P2', 'R-018', DEEP],
  ['Deeplink', 'Deeplink with only a category parameter', 'Open the deeplink', 'The Reel Creator room opens; the category parameter is ignored', 'P3', 'R-019', DEEP],
  ['Deeplink', 'Preview opened by a template GUID deeplink', 'Tap 「‹」', 'Record where it goes (expected: the Reel Creator room)', 'P3', 'R-015, R-035', 'Spec silent (Q-8, Q-15).'],

  // ---------- Preview ----------
  ['Preview', 'First time the room is entered on this install (clear app data or new account state)', 'Open the room and tap a Year-End Recap template', 'A finger animation guides swiping up / down', 'P2', 'R-033', 'Needs a first-entry state; run before any other Preview row. Domain K05: first entry, cold start and later entry are separate onboarding states.'],
  ['Preview', 'The swipe guide was already shown once', 'Leave the room, enter again and open a template', 'The finger animation is not shown again', 'P3', 'R-033'],
  ['Preview', ROOM, 'Tap the 「Top 5 of My Year」 card', 'A full-screen 9:16 demo plays automatically and loops when it ends', 'P1', 'R-026'],
  ['Preview', TOP5, 'Read the screen', '「View photo tips」 top left; a mute button on the right; at the bottom the name 「Top 5 of My Year」, the description 「Rank your year\'s best moments in one reel」, 「5–15 photos」 and 「Use Template」; text over a darkened bottom of the demo', 'P2', 'R-029, R-031, R-032, R-020'],
  ['Preview', TOP5, 'Tap the mute button, then tap it again', 'The demo\'s sound goes off, then back on; the icon follows', 'P2', 'R-030'],
  ['Preview', `${TOP5}; demo muted`, 'Swipe up to the next template, then down again', 'The demo stays muted on every template', 'P3', 'R-111', 'Domain K52 (mute state survives template switches); the spec does not say.', 'TC-115'],
  ['Preview', TOP5, 'Swipe up, then down', 'Up shows the next template of the same category (Year-End Recap) with its own demo, name and count; down returns', 'P1', 'R-027'],
  ['Preview', 'Preview of the last template of Year-End Recap', 'Swipe up', 'The first template of Year-End Recap appears (endless loop, no other category)', 'P2', 'R-028'],
  ['Preview', 'Preview of the first template of Year-End Recap', 'Swipe down', 'The last template of Year-End Recap appears (endless loop)', 'P2', 'R-028'],
  ['Preview', 'Preview of a Cool Transitions template', 'Swipe up through every template until one repeats', 'Only Cool Transitions templates appear; the list loops', 'P3', 'R-028'],
  ['Preview', 'Preview of a Cinematic Styles template', 'Read the count line', 'The count reads 「1 photo」', 'P3', 'R-031'],
  ['Preview', TOP5, 'Tap 「‹」', 'Returns to the Reel Creator room', 'P2', 'R-035', 'No arrow drawn (Q-8).'],

  // ---------- View photo tips ----------
  ['View photo tips', 'Room entered; a template\'s Preview opened', 'Wait on the Preview for 10 s without touching', 'The photo tips sheet does not open by itself', 'P2', 'R-036'],
  ['View photo tips', TOP5, 'Tap 「View photo tips」', 'The 「Photo tips」 sheet opens: 「✓ Recommended」 with example images and bullets (incl. 「Portrait (vertical) photos work best」), 「✕ Avoid」 with example images and bullets, and 「Got it」', 'P1', 'R-036, R-037, R-039'],
  ['View photo tips', 'Photo tips sheet open', 'Tap 「Got it」', 'The sheet closes and the Preview stays on the same template', 'P2', 'R-040'],
  ['View photo tips', 'Photo tips read on 「Top 5 of My Year」', 'Swipe to another template and open its 「View photo tips」', 'The tips content (text and example images) is that template\'s own', 'P3', 'R-038'],
  ['View photo tips', 'Photo tips sheet open', 'Tap the dimmed area above the sheet, or drag the sheet down', 'Record whether the sheet closes', 'P3', 'R-037', 'Spec draws only 「Got it」; record.'],

  // ---------- Photo picker ----------
  ['Photo picker', TOP5, 'Tap 「Use Template」', 'The picker 「Add Photos」 opens directly (「‹」, 「Recents ▾」); tray shows 「Select 5–15 photos」 「0/15」 and 「Next」', 'P1', 'R-034, R-041, R-042'],
  ['Photo picker', PICK, 'Pick 3 photos', 'They show 01, 02, 03 in pick order; tray 「3/15」 with 3 thumbnails; red 「Select at least 5 photos (2 more)」; Next disabled', 'P1', 'R-041, R-043'],
  ['Photo picker', `${PICK}; 3 picked`, 'Tap 「Next」', 'Nothing happens (Next disabled below min)', 'P2', 'R-043'],
  ['Photo picker', PICK, 'Pick exactly 5 photos', 'Red hint gone; 「5/15」; Next enabled', 'P1', 'R-043, R-022'],
  ['Photo picker', PICK, 'Pick 10 photos and scroll the tray', 'The tray thumbnails scroll horizontally and show all 10 in pick order', 'P2', 'R-042'],
  ['Photo picker', PICK, 'Pick 15 photos, then try to pick a 16th', 'The 16th cannot be picked (or Next turns disabled); 15/15 is the most allowed', 'P1', 'R-047, R-022', 'How the 16th is refused is not drawn (Q-11): record.'],
  ['Photo picker', `${PICK}; 4 photos picked (01–04)`, 'Tap photo 02 again', 'It is unpicked; count 3/15; record whether 03 / 04 renumber', 'P2', 'R-048', 'Q-11.'],
  ['Photo picker', PICK, 'Pick a landscape and a portrait photo', 'Both are accepted and numbered', 'P2', 'R-046'],
  ['Photo picker', `${PICK}; Gallery holds a photo 299 px on its short side`, 'Pick it', 'The photo is marked as not meeting the requirement', 'P2', 'R-045', 'needs: test photos. Marking copy not drawn (Q-11).'],
  ['Photo picker', `${PICK}; Gallery holds photos of exactly 300 px and 4096 px`, 'Pick both', 'Both are accepted (300–4096 px inclusive)', 'P2', 'R-045', 'needs: test photos.'],
  ['Photo picker', `${PICK}; Gallery holds a photo 4097 px or larger on its long side`, 'Pick it', 'The photo is marked as not meeting the requirement', 'P2', 'R-045', 'needs: test photos.'],
  ['Photo picker', `${PICK}; Gallery holds a JPEG of 1200 × 1200 px padded to 11,000,000 bytes (above 10 MB and 10 MiB)`, 'Pick it', 'The photo is marked as not meeting the requirement (≤ 10 MB)', 'P2', 'R-045', 'needs: test photos. Unit of 10 MB unknown (Q-22); 11,000,000 bytes is over both readings.'],
  ['Photo picker', `${PICK}; Gallery holds a JPEG of 1200 × 1200 px padded to 9,900,000 bytes (under 10 MB and 10 MiB)`, 'Pick it', 'The photo is accepted and numbered (not marked)', 'P2', 'R-045', 'needs: test photo. Unit of 10 MB unknown (Q-22); 9,900,000 bytes is under both readings.', 'TC-126'],
  ['Photo picker', `${PICK}; Gallery holds an NSFW test photo`, 'Pick it', 'The photo is marked as not allowed', 'P2', 'R-045', 'needs: NSFW test photo.'],
  ['Photo picker', `${PICK}; Gallery holds a celebrity photo`, 'Pick it', 'The photo is marked as not allowed', 'P2', 'R-045', 'needs: celebrity test photo.'],
  ['Photo picker', PICK, 'Tap 「Recents ▾」 and choose another album', 'The grid shows that album\'s photos', 'P3', 'R-049'],
  ['Photo picker', `${PICK}; 3 picked`, 'Tap 「‹」', 'Returns to the Preview of the same template', 'P2', 'R-050', 'No arrow drawn (Q-8).'],
  ['Photo picker', `${PICK}; 7 picked`, 'Tap 「Next」', 'The confirm page opens with the 7 photos', 'P1', 'R-095'],

  // ---------- Picker memory ----------
  ['Picker memory', `${NEWSESSION}; picker of 「Top 5 of My Year」, 7 photos picked, 「Next」 tapped, then back to the room`, 'Open 「Top 5 of My Year」 › 「Use Template」 again', 'Above the tray: 「Use the 7 photos you picked last time?」 with 「Import」 and 「×」; nothing is picked yet (0/15)', 'P1', 'R-051, R-052', 'Which set counts as 「last time」 is open (Q-3).'],
  ['Picker memory', 'Import prompt shown with 7 photos from last time', 'Tap 「Import」', 'The 7 photos are picked in the picker (7/15) with their numbers ticked; the picker stays open (does not jump to the confirm page)', 'P1', 'R-053', 'Domain K03: a photo shown but not ticked points at a photo id mix-up.'],
  ['Picker memory', 'Import prompt shown', 'Tap 「×」 on the prompt; leave the picker and enter it again', 'The prompt closes; record whether it appears again on the next entry', 'P2', 'R-052', 'Q-5.'],
  ['Picker memory', `${NEWSESSION}; 3 photos picked last time in this session (e.g. in a 4-photo AI Transition picker, then left)`, 'Open 「Top 5 of My Year」 › Use Template › 「Import」', '3 photos imported; tray red 「Select at least 5 photos (2 more)」; Next disabled until 2 more are picked', 'P1', 'R-055, R-094', 'Drawn flow (picker-a2).'],
  ['Picker memory', `${NEWSESSION}; 10 photos picked last time on a Creative template`, 'Open an AI Transition template with 4 photos › Use Template › 「Import」', '10 photos imported; tray shows red text; Next disabled until photos are removed down to 4', 'P1', 'R-054, R-059, R-087'],
  ['Picker memory', `${NEWSESSION}; 6 photos picked last time, then 2 of them deleted from the Gallery`, 'Enter the picker again and tap 「Import」', 'Only the 4 photos still in the Gallery are picked', 'P2', 'R-056', 'Record the N shown in the prompt (Q-17).'],
  ['Picker memory', `${NEWSESSION}; only 1 photo picked last time (e.g. Cinematic Styles)`, 'Enter the 「Top 5 of My Year」 picker', 'No 「Use the … photos you picked last time?」 prompt is shown', 'P2', 'R-057'],
  ['Picker memory', '7 photos picked in the last session', 'Force-stop and relaunch the app, then open the 「Top 5 of My Year」 picker', 'No Import prompt (the memory ends with the session)', 'P2', 'R-058'],
  ['Picker memory', `${NEWSESSION}; 7 photos picked in the Reel Creator picker`, 'Open another photo picker of the app (e.g. Collage) and look above the tray', 'Record whether the Import prompt appears there', 'P3', 'R-051', 'Q-4. Domain K07: selection state leaking into another feature is a past bug class.'],

  // ---------- Confirm page ----------
  ['Confirm page', CONF, 'Read the page', 'Top: template thumbnail, 「Top 5 of My Year」, 「5–15 photos · output 9:16」, 「‹」 and the credit pill; 「Your photos」 「7/15」 with 「Long-press to reorder · tap × to remove」; 7 numbered photos with 「×」 and a 「+」 tile; 「Text language」 「English ▾」; 「Generate | 60」', 'P1', 'R-060, R-061, R-067, R-068, R-023'],
  ['Confirm page', CONF, 'Long-press photo 3 and drag it to position 1', 'The photo moves to position 1 and the numbers follow the new order', 'P1', 'R-062'],
  ['Confirm page', CONF, 'Tap 「×」 on photo 7', 'The photo is removed; count 6/15', 'P1', 'R-063'],
  ['Confirm page', CONF, 'Remove photos until 4 are left', 'Count 「4/15」 in red; 「Generate」 disabled', 'P1', 'R-069, R-096'],
  ['Confirm page', `${CONF}; 4 left after removing`, 'Tap the disabled 「Generate」', 'Toast 「Please upload at least 5 photos」; nothing is generated and no credits are charged', 'P1', 'R-069, R-096'],
  ['Confirm page', `${CONF}; 4 left after removing`, 'Tap the 「+」 tile', 'The picker opens with the 4 current photos picked and ticked (4/15)', 'P1', 'R-064', 'Domain K03.'],
  ['Confirm page', 'Picker opened from the confirm page 「+」 with 4 picked', 'Pick 2 more and tap 「Next」', 'The confirm page shows the 6 photos (the 4 kept plus 2 new)', 'P2', 'R-064'],
  ['Confirm page', 'Confirm page with 15/15 photos', 'Look for the 「+」 tile', 'Record whether 「+」 is shown at max', 'P3', 'R-064', 'Q-16.'],
  ['Confirm page', CONF, 'Tap 「‹」', 'Returns to the picker (record whether the 7 photos stay picked)', 'P2', 'R-072', 'No arrow drawn (Q-8).'],
  ['Confirm page', `${CONF}; photos reordered; Text language 「日本語」; Developer options › Don\'t keep activities on`, 'Press Home, open another app, return to PhotoDirector', 'The confirm page is back with the same photos, order, count and Text language; no crash', 'P2', 'R-112', 'Domain K62 (Activity re-creation). Turn Don\'t keep activities off afterwards.', 'TC-116'],
  ['Confirm page', `${FREE}; credit balance below 60; ${CONF}`, 'Tap 「Generate | 60」', 'The paywall (IAP page) opens; nothing is generated', 'P1', 'R-070', 'The PHD round-start state (free user, 0 credits; domain test-setup) fits this row.'],
  ['Confirm page', `${PREM}; credit balance below 60; ${CONF}`, 'Tap 「Generate | 60」', '「More Credits Required」 appears; its button leads to the Credit Shop', 'P1', 'R-070', 'needs: low-credit Premium account. Domain K36b: on Android VIP = Pro = Premium = subscribed, one mode.'],
  ['Confirm page', `Credit balance of 60 or more (note it); ${CONF}`, 'Tap 「Generate | 60」', 'Generation starts; the balance drops by exactly 60', 'P1', 'R-071, R-068'],
  ['Confirm page', `Credits ≥ 120 (note the balance); ${CONF}`, 'Tap 「Generate | 60」 three times as fast as possible', 'One job starts: one new card in My AI Artwork and the balance drops by 60 only once', 'P1', 'R-103', 'Domain K30 (PHA262026-0418): a burst of taps charges once.', 'TC-117'],
  ['Confirm page', 'A 「Top 5 of My Year」 Generate just finished (TC-074)', 'Open the credit button › Buy Credit › 「Detail」 (top right)', 'The newest entry names the feature (Reel Creator / the Creative feature) and shows 60 deducted; a refund, if any, is listed with its amount', 'P1', 'R-102', 'Domain K36a. Feature name not fixed yet (Q-2): record it.', 'TC-118'],

  // ---------- Text language ----------
  ['Text language', `Phone language English; ${CONF}`, 'Tap 「Text language」 「English ▾」', 'A list opens with 「English (Device language)」 first and ticked, then 「繁體中文」, 「简体中文」, 「日本語」, 「한국어」, 「Español」, 「Français」, 「Deutsch」, 「Português」, 「Italiano」, 「ภาษาไทย」 …; the list scrolls', 'P1', 'R-073, R-074'],
  ['Text language', `App launched in Traditional Chinese (\`launch --lang zh-Hant\`); ${CONF}`, 'Read the Text language value and open the list', 'The default is 「繁體中文」 marked (Device language)', 'P2', 'R-073', 'End with `locale reset`.'],
  ['Text language', 'Text language list open', 'Scroll to the end of the list', 'Every language PhotoDirector supports is listed; record the list (should match iOS)', 'P3', 'R-074'],
  ['Text language', 'Text language list open', 'Choose 「日本語」', 'The list closes; Text language shows 「日本語」', 'P2', 'R-074'],
  ['Text language', 'Text language set to 「日本語」 on the confirm page', 'Go back to the picker and tap 「Next」 again; then open another Creative template\'s confirm page', 'Text language still shows 「日本語」 within the room (same session)', 'P2', 'R-076'],
  ['Text language', 'Text language set to 「日本語」', 'Leave the Reel Creator room, enter it again and reach a Creative confirm page', 'Text language is back to the device language', 'P2', 'R-076'],
  ['Text language', `Credits ≥ 60; ${CONF}; Text language 「日本語」`, 'Tap 「Generate」 and open the finished reel', 'The text in the reel is Japanese', 'P1', 'R-075'],
  ['Text language', `Credits ≥ 60; ${CONF}; Text language 「繁體中文」`, 'Tap 「Generate」 and open the finished reel', 'The text in the reel is Traditional Chinese', 'P2', 'R-075'],
  ['Text language', `Credits ≥ 60; ${CONF}; Text language left at 「English (Device language)」`, 'Tap 「Generate」 and open the finished reel', 'The text in the reel is English', 'P2', 'R-075'],
  ['Text language', 'A finished Creative reel in My AI Artwork', 'Open it and look for a way to edit its text', 'The reel\'s text cannot be edited', 'P3', 'R-077'],
  ['App language', 'App launched in Traditional Chinese, then in Japanese (`launch --lang zh-Hant` / `ja`)', 'In each language: pick 3 photos in the 「Top 5 of My Year」 picker; reach the Import prompt (TC-054 setup); on the confirm page remove photos to 4 and tap Generate', 'The tray, the Import prompt and the toast show the right numbers (5–15, 2, N, 5) in that language; no screen crashes or shows a raw placeholder', 'P2', 'R-105', 'Domain K70 (placeholders %d / %1$s). End with `locale reset`.', 'TC-123'],
  ['App language', 'App launched in Arabic (`launch --lang ar`, if PhotoDirector offers it)', 'Walk room → Preview → picker → confirm page → Text language list', 'Layout mirrors (‹ on the right, tray and lists in bounds, swipe guide and tips point at the right controls); Western digits 0–9 are acceptable', 'P3', 'R-106', 'Domain K66, K68. Record Not run if Arabic is not offered. End with `locale reset`.', 'TC-124'],
  ['App language', 'App launched in German, then Portuguese', 'Read the picker tray, the Import prompt, the confirm page hint and 「Generate」', 'Every string is readable (not cut off or overlapping) and every button stays reachable', 'P3', 'R-107', 'Domain K69 (long strings). End with `locale reset`.', 'TC-125'],

  // ---------- Generation and My AI Artwork ----------
  ['Generation and My AI Artwork', `Credits ≥ 60; ${CONF}`, 'Tap 「Generate | 60」', 'My AI Artwork opens on the 「Reel Creator」 tab with a new 「Top 5 of My Year」 card at the top: 「Processing…」, a time estimate (「… minutes remaining…」) and a progress bar', 'P1', 'R-078, R-097', 'Domain K60 / K61: 「3 minutes」 is mockup text, not a promised duration; judge the waiting UI. Note the thumbnail on the card (Q-18).'],
  ['Generation and My AI Artwork', 'A Creative reel processing in My AI Artwork', 'Wait until it finishes, then tap the card', 'The card shows the date and 「Top 5 of My Year」; the reel plays, and the video file is 9:16 in pixels (width : height)', 'P1', 'R-083, R-023, R-081', 'Domain K51 / K53: check the file\'s pixel size and that it opens, not only the on-screen size.'],
  ['Generation and My AI Artwork', 'A finished Creative reel from 7 different photos', 'Watch the whole reel', 'Each of the 7 input photos appears in the reel (order may differ from the confirm page)', 'P2', 'R-066'],
  ['Generation and My AI Artwork', 'A reel processing in My AI Artwork', 'Leave My AI Artwork (‹), wait 1 minute, open it again from the room\'s history icon', 'The card is still processing (or finished); nothing is lost', 'P2', 'R-078', 'Leaving during processing is not stated (Q-12).'],
  ['Generation and My AI Artwork', 'A Creative reel just started processing', 'Press Home and wait for the job to finish; tap the completion notification', 'A notification with a title and message arrives; tapping it opens My AI Artwork (Reel Creator tab) on the finished reel, never 「APP version does not support feature」', 'P2', 'R-104', 'Domain K48 (PHA262026-0373). The spec itself is silent (Q-12).', 'TC-121'],
  ['Generation and My AI Artwork', 'My AI Artwork open', 'Read the tabs', 'Tabs include 「Image to Video」, 「Reel Creator」, 「Character Motion Swap」; no tab named 「Cinematic Reel Creator」', 'P2', 'R-080'],
  ['Generation and My AI Artwork', 'One finished result each from Creative, AI Transition and Cinematic Styles', 'Open the 「Reel Creator」 tab', 'All three are in the same list, no sub tabs, newest first, each with its date and template name', 'P1', 'R-079, R-081'],
  ['Generation and My AI Artwork', 'My AI Artwork on the 「Reel Creator」 tab', 'Tap 「Create More」', 'The Reel Creator room opens', 'P2', 'R-082, R-098'],
  ['Generation and My AI Artwork', 'Room opened by 「Create More」 from My AI Artwork; credits ≥ 40', 'Generate a Cinematic Styles reel again, then press 「‹」 from the room', 'The second job runs and finishes normally; 「‹」 leaves the room without an error or a black screen', 'P2', 'R-113', 'Domain K28 (Create More / Back with stale resources). Whether Create More keeps inputs is open (Q-20).', 'TC-122'],

  // ---------- Cinematic Styles ----------
  ['Cinematic Styles', ROOM, 'Tap a Cinematic Styles template (e.g. 「Micro Cinema」), then 「Use Template」', 'The Preview shows 「1 photo」; 「Use Template」 opens the picker with 「Select 1 photo」 「0/1」', 'P1', 'R-084, R-044, R-099'],
  ['Cinematic Styles', 'Cinematic picker 「Select 1 photo」', 'Pick 1 photo, then try to pick a 2nd', 'The first shows 01 and 1/1; Next enabled; a second cannot be added (or Next turns disabled)', 'P2', 'R-044, R-047'],
  ['Cinematic Styles', 'Cinematic picker with 1 photo picked', 'Tap 「Next」', 'Confirm page: 「Micro Cinema」, 「1 photo · output 9:16」, 「Your photos」 「1/1」, 「Tap the photo to replace」, 「Generate | 40」; no Text language', 'P1', 'R-085, R-086, R-100'],
  ['Cinematic Styles', 'Cinematic confirm page', 'Tap the photo and pick another one', 'The photo on the confirm page is replaced by the new one (still 1/1)', 'P2', 'R-085'],
  ['Cinematic Styles', 'Cinematic confirm page; credits ≥ 40 (note the balance)', 'Tap 「Generate | 40」', 'My AI Artwork 「Reel Creator」 tab shows the 「Micro Cinema」 card processing; the balance drops by exactly 40', 'P1', 'R-084, R-079'],
  ['Cinematic Styles', 'The 「Micro Cinema」 reel from TC-096 has finished', 'Open it from My AI Artwork, play it and check the video file', 'The reel plays; the file is 9:16 in pixels (width : height) and opens', 'P2', 'R-023, R-083', 'Domain K51 / K53: measure the file, not the on-screen size.', 'TC-127'],
  ['Cinematic Styles', 'A Cinematic Styles Generate just finished', 'Open Buy Credit › 「Detail」', 'The newest entry names the feature (Cinematic Styles / CineStory) and shows 40 deducted', 'P2', 'R-102', 'Domain K36a.', 'TC-119'],
  ['Cinematic Styles', `${NEWSESSION}; 7 photos picked last time on a Creative template`, 'Open a Cinematic template › 「Use Template」', 'Record whether the Import prompt appears and, after Import, that Next stays disabled until only 1 is left', 'P3', 'R-084, R-054', 'Q-7.'],

  // ---------- AI Transition ----------
  ['AI Transition', ROOM, 'Open a Cool Transitions template; read the count; tap 「Use Template」', 'The Preview shows a fixed count (「4 photos」 or 「6 photos」); the picker tray reads 「Select 4 photos」 (or 6) with 「0/4」', 'P1', 'R-021, R-044, R-087'],
  ['AI Transition', 'AI Transition picker 「Select 4 photos」', 'Pick 3 photos, then a 4th', 'Next disabled at 3; enabled at 4/4; a 5th cannot be picked', 'P1', 'R-087, R-043'],
  ['AI Transition', 'AI Transition picker with 4 photos picked', 'Tap 「Next」', 'Confirm page with 「4/4」 photos, reorder hint and 「Generate | <price>」; no Text language', 'P1', 'R-088, R-067', 'Price not drawn (Q-9): record it.'],
  ['AI Transition', 'AI Transition confirm page with photos A, B, C, D; credits enough (note the balance)', 'Long-press to reorder to D, C, B, A, then tap 「Generate」', 'The finished video shows the photos in the order D, C, B, A and its file is 9:16 in pixels; the balance drops by the price on the button', 'P1', 'R-065, R-088, R-023'],
  ['AI Transition', 'An AI Transition Generate just finished', 'Open Buy Credit › 「Detail」', 'The newest entry names the feature (AI Transition) and shows the price on the button deducted', 'P2', 'R-102', 'Domain K36a.', 'TC-120'],
  ['AI Transition', 'Preview of a 6-photo Cool Transitions template (if the roster has one)', 'Tap 「Use Template」', 'The tray reads 「Select 6 photos」', 'P2', 'R-021, R-087'],

  // ---------- Android system Back ----------
  ['Android Back', ROOM, 'Press system Back', 'Same as 「‹」: leaves the room', 'P2', 'R-089', 'Domain K63: Back regressions (Predictive Back) were per screen; every screen has its own row.'],
  ['Android Back', TOP5, 'Press system Back', 'Same as 「‹」: returns to the room', 'P2', 'R-089'],
  ['Android Back', 'Photo tips sheet open', 'Press system Back', 'The sheet closes (as 「Got it」); the Preview stays', 'P2', 'R-089'],
  ['Android Back', `${PICK}; 3 picked`, 'Press system Back', 'Same as the picker 「‹」: returns to the Preview', 'P2', 'R-089'],
  ['Android Back', 'Import prompt shown in the picker', 'Press system Back', 'Record: the prompt closes, or the picker closes', 'P3', 'R-089', 'Spec silent (Q-8).'],
  ['Android Back', CONF, 'Press system Back', 'Same as 「‹」: returns to the picker', 'P2', 'R-089'],
  ['Android Back', 'Text language list open on the confirm page', 'Press system Back', 'The list closes and the language is unchanged; the confirm page stays', 'P2', 'R-089'],
  ['Android Back', 'Edit Room jump dialog shown', 'Press system Back', 'The dialog closes as cancel; the Edit Room stays', 'P3', 'R-089'],
  ['Android Back', 'My AI Artwork opened after Generate', 'Press system Back', 'Record where it goes (the confirm page, the room or the previous page)', 'P3', 'R-089', 'Spec silent (Q-8).'],
];

let next = 0;
const records = rows.map(([section, pre, action, expected, prio, refs, notes = '', id]) => {
  const ID = id ?? `TC-${String(++next).padStart(3, '0')}`;
  return {
    ID, Section: section, Precondition: pre, Action: action, 'Expected Result': expected, Priority: prio,
    'Spec Ref': refs, Notes: notes, Change: 'new', 'Change Reason': REASON[ID] ?? 'New table (REQ-001)',
  };
});
writeTable(join(HERE, 'draft.csv'), DRAFT_COLUMNS, records);
// ID list for requirements.md grids
for (const r of records) console.log(`${r.ID}\t${r.Section}\t${r['Spec Ref']}\t${r.Action.slice(0, 50)}`);
