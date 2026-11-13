// Builds draft.csv for phd/ai-replace-ref-image-ux (android). Run: node build-draft.ts
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const base = 'Android phone, PhotoDirector (build under test) signed in, at least 20 credits; a photo with a clear object in AI Replace, its object brushed with the mask';
const refPage = `${base}; 「Next」 › 「Upload a reference image」 › 「Continue」 done and a reference photo chosen, so the reference image page (「Replace Area」 / 「Reference Image」) is open`;

type Row = [id: string, section: string, pre: string, action: string, expected: string, prio: string, ref: string, notes?: string];
const S1 = 'Choosing how to replace', S2 = 'Reference image page', S3 = 'Back to the photo picker';
const rows: Row[] = [
  ['TC-001', S1, base, 'Tap 「Next」',
    'The sheet 「Choose how to replace the selected area」 opens with 「Upload a reference image」 and 「Describe with text」, and neither option shows a badge (no credit cost, 「NEW」 or other tag)', 'P3', 'R-001, R-002', 'Q-1'],
  ['TC-002', S1, `${base}; the sheet 「Choose how to replace the selected area」 open`, '1. Tap 「Upload a reference image」\n2. Tap 「Continue」 on the tips sheet\n3. Choose a photo in 「Recents」',
    'Step 1 shows 「For the best results, follow this advice:」 with 「Continue」 and 「Don\'t show again」; step 2 opens the photo picker (「Recents」 / 「Stock」); step 3 opens the reference image page with the masked photo under 「Replace Area」 and the chosen photo under 「Reference Image」', 'P1', 'R-003, R-010', 'Do not tick 「Don\'t show again」: the other rows need the tips sheet as today'],
  ['TC-003', S2, refPage, 'Look at 「Generate」 without typing anything',
    '「Generate」 is enabled and shows 6 credits (「-6」)', 'P1', 'R-011, R-012', 'Q-3: price from the PM mockup (binding)'],
  ['TC-004', S2, refPage, '1. Tap 「Generate」\n2. Wait for the result',
    'The masked area is replaced using the reference image and the result is shown; the balance drops by the price shown on 「Generate」', 'P1', 'R-013, R-012', 'One generation'],
  ['TC-005', S2, `${refPage}; note the credit balance`, '1. Tap 「Generate」 three times quickly\n2. Wait for the result',
    'Only one job starts: one result, and the balance drops once by the price on 「Generate」', 'P2', 'R-014', 'KP-019; one generation'],
  ['TC-006', S3, refPage, 'Tap the back button (top left)',
    'The reference image photo picker opens (「Recents」 / 「Stock」), the same picker the replace button opens; AI Replace is not left and the mask sheet does not reopen', 'P1', 'R-020, R-030'],
  ['TC-007', S3, refPage, 'Tap the replace button at the bottom right of 「Reference Image」',
    'The same reference image photo picker opens as with the back button (TC-006)', 'P2', 'R-021'],
  ['TC-008', S3, `${refPage}; back (top left) tapped, so the reference image photo picker is open`, 'Choose a different photo',
    'The reference image page returns with the new photo under 「Reference Image」 and the same mask under 「Replace Area」; 「Generate」 is enabled', 'P2', 'R-022, R-010, R-011'],
  ['TC-009', S3, refPage, 'Press Android system Back once',
    'The reference image photo picker opens, as with the back button (TC-006)', 'P2', 'R-023'],
  ['TC-010', S3, `${refPage}; back (top left) tapped, so the reference image photo picker is open`, '1. Leave the picker without choosing (its back button)\n2. Open the picker again with back (top left)\n3. Press Android system Back',
    'Steps 1 and 3 each return to the reference image page with the previous reference image, both sections holding an image and 「Generate」 enabled (record where each lands: Q-2)', 'P2', 'R-024, R-010, R-011', 'Q-2'],
];

const q = (s = '') => /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
const head = ['ID', 'Section', 'Precondition', 'Action', 'Expected Result', 'Priority', 'Spec Ref', 'Notes', 'Change', 'Change Reason'];
const lines = [head.join(','), ...rows.map(r => [...r.slice(0, 7), r[7] ?? '', 'new', 'New table (REQ-001)'].map(v => q(v as string)).join(','))];
writeFileSync(join(here, 'draft.csv'), '﻿' + lines.join('\r\n') + '\r\n');
console.log(`draft.csv: ${rows.length} rows`);
