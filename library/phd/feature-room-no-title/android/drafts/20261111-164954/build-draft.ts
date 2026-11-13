// Builds draft.csv for phd/feature-room-no-title (android). Run: node build-draft.ts
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const base = 'Android phone, PhotoDirector (build under test) signed in, on the Launcher';
const kept = 'back at the left, the credit button and History at the right, in the same places as before (Q-1)';

type Row = [id: string, section: string, pre: string, action: string, expected: string, prio: string, ref: string, notes?: string];
const S1 = 'Room top bar';
const room = (id: string, name: string, how: string, extra = ''): Row =>
  [id, S1, base, `Open ${name} (${how})`,
    `The top bar shows no 「${name}」 title (no room name at all); it still has ${kept}${extra}; the room's content below is unchanged`, 'P2', 'R-001, R-002'];
const rows: Row[] = [
  room('TC-001', 'AI Try-On', 'AI Photos › 「AI Try-On」'),
  room('TC-002', 'Collage', 'Launcher › 「Collage」', '; the search and ☰ buttons are still at the right'),
  room('TC-003', 'AI Art', 'AI Photos › 「AI Art」'),
  room('TC-004', 'AI Hairstyle', 'AI Photos › 「AI Hairstyle」'),
  room('TC-005', 'AI Group Shot', 'Launcher › 「AI Group Shot」'),
  room('TC-006', 'AI Headshot', 'AI Photos › 「AI Headshot」'),
  [`TC-007`, S1, base, 'Open Image to Video (AI Videos › 「Image to Video」) on the 「Custom」 tab',
    `The top bar shows no 「Image to Video」 title; it still has ${kept}; the 「Custom」 / 「Templates」 tabs and the Custom settings below are unchanged`, 'P2', 'R-001, R-002', 'Q-3'],
  [`TC-008`, S1, `${base}; Image to Video open (AI Videos › 「Image to Video」)`, 'Tap the 「Templates」 tab',
    `The top bar still shows no 「Image to Video」 title on 「Templates」; it still has ${kept}`, 'P2', 'R-001, R-002', 'Q-3'],
  [`TC-009`, S1, `${base}; Image to Video open on the 「Templates」 tab`, 'Tap 「View all >」 (See All) on a template row',
    'The template 「See All」 page opens with no 「Image To Video」 title in its top bar; back is still at the left and the 「All」 / 「Female」 / 「Male」 tabs and categories below are unchanged', 'P2', 'R-001, R-002'],
  [`TC-010`, S1, `${base}; AI Art open (AI Photos › 「AI Art」); note the account's credit balance`, 'Tap the credit button in the top bar',
    'The credit button shows the account\'s balance, and the tap opens the Buy Credit page', 'P2', 'R-003', 'KP-020'],
  [`TC-011`, S1, `${base}; AI Hairstyle open (AI Photos › 「AI Hairstyle」); at least one AI Hairstyle work saved`, 'Tap History (top right)',
    'My AI Artwork opens with the 「AI Hairstyle」 tab selected', 'P2', 'R-004', 'KP-026'],
];

const q = (s = '') => /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
const head = ['ID', 'Section', 'Precondition', 'Action', 'Expected Result', 'Priority', 'Spec Ref', 'Notes', 'Change', 'Change Reason'];
const lines = [head.join(','), ...rows.map(r => [...r.slice(0, 7), r[7] ?? '', 'new', 'New table (REQ-001)'].map(v => q(v as string)).join(','))];
writeFileSync(join(here, 'draft.csv'), '﻿' + lines.join('\r\n') + '\r\n');
console.log(`draft.csv: ${rows.length} rows`);
