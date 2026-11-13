// Builds draft.csv for phd/i2v-bgm-info-tooltip (android). Run: node build-draft.ts (from this folder or the repo root).
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const base = 'Android phone, PhotoDirector (build under test) signed in, enough credits for Image to Video';
const open = 'AI Videos › 「Image to Video」 › 「Templates」';
const panelSwitch = `${base}; a template whose 「Generate Background Sound」 offers 「Off」 and 「On」 (CL designers / Vidu, Q-4) chosen from ${open}, a photo added and its settings panel open`;
const panelKling = `${base}; a template whose 「Off」 is disabled (Kling, Q-4) chosen from ${open}, a photo added and its settings panel open`;

type Row = [id: string, section: string, pre: string, action: string, expected: string, prio: string, ref: string, notes?: string];
const S1 = 'Info icon and tooltip', S2 = 'Background Sound by template';
const rows: Row[] = [
  ['TC-001', S1, panelSwitch, 'Look at the 「Generate Background Sound」 line of the panel',
    'An info icon (ⓘ) sits right after 「Generate Background Sound」; 「Duration」, 「Video Quality」, 「Generate Background Sound」 (Off / On), ✕ and ✓ are all still there', 'P2', 'R-001, R-003'],
  ['TC-002', S1, panelSwitch, 'Tap the info icon next to 「Generate Background Sound」',
    'A tooltip reading exactly 「Sound support varies by template.」 appears just above the icon, pointing at it; no setting changes', 'P1', 'R-002, R-003'],
  ['TC-003', S1, `${panelSwitch}; the tooltip 「Sound support varies by template.」 shown (info icon tapped)`, '1. Tap an empty part of the panel outside the tooltip\n2. Tap the info icon again\n3. Tap the info icon once more',
    'Step 1 closes the tooltip and leaves every setting as it was; step 2 opens it again and step 3 closes it (record what each tap does: Q-1)', 'P3', 'R-004', 'Q-1: how the tooltip closes is not drawn'],
  ['TC-004', S1, `${panelSwitch}; the tooltip 「Sound support varies by template.」 shown (info icon tapped)`, 'Press Android system Back once',
    'The tooltip closes and the settings panel stays open with its settings unchanged (record if Back closes the panel instead: Q-1)', 'P3', 'R-004', 'Q-1'],
  ['TC-005', S1, panelKling, '1. Look at the 「Generate Background Sound」 line\n2. Tap the info icon',
    'The info icon is shown after 「Generate Background Sound」 here too, and tapping it shows 「Sound support varies by template.」 above the icon', 'P2', 'R-001, R-002, R-003'],
  ['TC-006', S2, `${base}; ${open} open`, '1. Choose a template whose 「Off」 can be chosen (Q-4)\n2. Add a photo\n3. Open the settings panel',
    '「Generate Background Sound」 is set to 「Off」 when the panel first opens for this template', 'P2', 'R-010', 'Q-2: 25\'6/E rule, checked as Android\'s current behaviour'],
  ['TC-007', S2, `${base}; two different templates whose 「Off」 can be chosen in ${open}`, '1. Open the first template\'s settings panel\n2. Set 「Generate Background Sound」 to 「On」\n3. Tap ✓\n4. Go back and choose the second template\n5. Add a photo\n6. Open its settings panel',
    'The second template\'s panel shows its own setting (「Off」), not the 「On」 chosen on the first template', 'P2', 'R-012', 'Q-2'],
  ['TC-008', S2, `${panelSwitch}; sound on for the phone`, '1. Set 「Generate Background Sound」 to 「On」\n2. Tap ✓\n3. Tap 「Generate」 and wait for the video\n4. Play the result with sound',
    'The generated video plays with background music', 'P2', 'R-011', 'Uses one template generation. Q-2'],
  ['TC-009', S2, `${panelSwitch}; sound on for the phone`, '1. Leave 「Generate Background Sound」 at 「Off」 and tap ✓\n2. Tap 「Generate」 and wait for the video\n3. Play the result with sound',
    'The generated video has no added background music', 'P3', 'R-010, R-011', 'Uses one template generation; run on the same template and photo as TC-008 to compare. Q-2'],
  ['TC-010', S2, panelKling, 'Look at 「Generate Background Sound」',
    '「On」 is selected and 「Off」 is drawn disabled', 'P2', 'R-013', 'Q-2'],
  ['TC-011', S2, panelKling, 'Tap the disabled 「Off」 under 「Generate Background Sound」',
    'A toast reads exactly 「To achieve the best results, this template\'s settings are limited.」 and 「On」 stays selected', 'P2', 'R-014, R-013', 'Q-2'],
  ['TC-012', S2, `${base}; AI Videos › 「Image to Video」 open on the 「Custom」 tab`, 'Look through the Custom settings (scroll to the bottom)',
    'There is no 「Generate Background Sound」 option and no 「Sound support varies by template.」 info icon on Custom (a 「Generate Sound by AI」 setting, if the model has one, is not part of this check)', 'P3', 'R-015', 'Q-3'],
];

const q = (s = '') => /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
const head = ['ID', 'Section', 'Precondition', 'Action', 'Expected Result', 'Priority', 'Spec Ref', 'Notes', 'Change', 'Change Reason'];
const lines = [head.join(','), ...rows.map(r => [...r.slice(0, 7), r[7] ?? '', 'new', 'New table (REQ-001)'].map(v => q(v as string)).join(','))];
writeFileSync(join(here, 'draft.csv'), '﻿' + lines.join('\r\n') + '\r\n');
console.log(`draft.csv: ${rows.length} rows`);
