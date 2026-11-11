// Builds draft.csv and requirements.md of the 2026-11-09 update draft of phd/scrollable-collage (same spec set
// 2026-11-05, Design re-read 2026-11-09), one platform per run, from the approved table and requirements.
// Usage: node library/phd/scrollable-collage/ios/drafts/20261109-160641/build-draft.ts <ios|android>
// The same file is copied into the Android draft folder; the platform argument picks the folder and the new row's ID.
// What changed in the Design (figma-check / figma-source re-read 2026-11-09): a new 「entry」 Launcher frame
// (199:3566) drawing a 「Swipe Collage」 shortcut in the Launcher's Features grid; everything else was colour or icon
// art (dark ic_square_plus_filled fill, a new ic_swipe_collage icon on the 「cut」 board, a hidden helper frame removed).
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const P = (process.argv[2] ?? 'ios') as 'ios' | 'android';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..', '..', '..');
const FEAT = join(ROOT, 'library', 'phd', 'scrollable-collage', P);
const OUT = join(FEAT, 'drafts', '20261109-160641');
const phone = P === 'ios' ? 'iPhone' : 'Android phone';
const NEW_ID = P === 'ios' ? 'TC-151' : 'TC-164';

// ---------------------------------------------------------------- CSV helpers
const parse = (text: string) => {
  const rows: string[][] = []; let row: string[] = [], cell = '', q = false;
  text = text.replace(/^﻿/, '');
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += c; continue; }
    if (c === '"') q = true; else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; } else if (c !== '\r') cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
};
const esc = (s: string) => /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;

// ---------------------------------------------------------------- rows
const [head, ...rows] = parse(readFileSync(join(FEAT, 'cases.csv'), 'utf8'));
const out: string[][] = [[...head, 'Change', 'Change Reason']];
const DS = 'Design 「entry」 199:3566 (drawn after 2026-11-05) draws the shortcut; PM D0-06 and the Design overview still say no shortcut in this build (Q-21)';
for (const r of rows) {
  if (r[0] === 'TC-009') {
    out.push([r[0], r[1], `${phone}, PhotoDirector signed in, Free tier`, 'Open the Launcher and look at the Features grid',
      'The Features grid shows a 「Swipe Collage」 shortcut with the Swipe Collage icon and no NEW / HOT badge, after 「AI Art」 on the first page; 「Collage」 is still there',
      'P2', 'R-007', DS, 'modified',
      'R-007 changed: the Design now draws a Launcher with a 「Swipe Collage」 shortcut (newer than the PM file, analysis pass 7); was "no shortcut in this build"']);
    out.push([NEW_ID, r[1], `${phone}, PhotoDirector signed in, Free tier`, '1. Open the Launcher\n2. Tap 「Swipe Collage」 in the Features grid',
      'The Template Page opens with the title 「Swipe Collage」, the same page the Collage room banner opens',
      'P2', 'R-168', 'Destination not drawn (no arrow): assumed the Template Page as the banner (Q-21)', 'new',
      'R-168 new: the Launcher shortcut drawn in Design 「entry」 199:3566 must open Swipe Collage']);
    continue;
  }
  out.push([...r, 'unchanged', '']);
}
writeFileSync(join(OUT, 'draft.csv'), '﻿' + out.map(r => r.map(esc).join(',')).join('\n') + '\n');

// ---------------------------------------------------------------- requirements
let req = readFileSync(join(FEAT, 'requirements.md'), 'utf8');
const swap = (from: string, to: string) => { if (!req.includes(from)) throw new Error(`requirements.md: not found: ${from}`); req = req.replace(from, to); };
swap('- R-007 [PM:pm-header D0-04, D0-06, D1-08] This build has no Launcher shortcut for Swipe Collage (the shortcut is decided later)',
  '- R-007 [DS:design-launcher 「entry」 199:3566 (2026-11-09); PM:pm-header D0-04, D0-06, D1-08] The Launcher\'s Features grid shows a 「Swipe Collage」 shortcut (Swipe Collage icon, no NEW / HOT badge) after 「AI Art」 on the first page. The PM header and the Design overview still say the Launcher shortcut is not in this build; the newer Design frame wins (Q-21)\n' +
  '- R-168 [DS:design-launcher 「entry」 199:3566 (2026-11-09)] Tapping the Launcher\'s 「Swipe Collage」 shortcut opens Swipe Collage: the Template Page, as the Collage room banner does (no arrow drawn; Q-21)');
swap('\n## Added 2026-11-05',
  '- Q-21 Launcher shortcut. The Design added a Launcher frame 「entry」 (199:3566, after 2026-11-05) whose Features grid has a 「Swipe Collage」 shortcut, while the PM header (D0-04, D0-06, D1-08) and the Design\'s own overview still say the Launcher shortcut is not in this build and is decided later. Where does the shortcut lead, is it in this build, and does it send its own tracking 「from」 value (R-163 lists Collage_Banner and Deeplink only)? Assumption: the newer Design frame: the shortcut is shown and opens the Template Page (R-007, R-168; TC-009, ' + NEW_ID + ').\n\n## Added 2026-11-05');
swap('| REQ-001 | R-001, R-002 … every requirement (new feature from the PM and Design Figma) |',
  '| REQ-001 | R-001, R-002 … every requirement (new feature from the PM and Design Figma) |\n| REQ-003 | R-007, R-168 (Design re-read 2026-11-09: new Launcher frame) |');
writeFileSync(join(OUT, 'requirements.md'), req);
console.log(`${P}: ${out.length - 1} rows (1 modified, 1 new ${NEW_ID}) → ${OUT}`);
