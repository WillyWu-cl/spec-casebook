// Builds phases.json for the first Batch Editing Android run (round R1, 2026-11-09): every row of draft
// 20261109-150747 (161) by journey stage on the Samsung S23 (SM-S9110), PhotoDirector 20.19.0 (90201900).
// The tier is switched without signing in (Settings › About › backdoor under ‹ › 「subscriber」, user 2026-11-09):
// R1-a … R1-f run as Premium, R1-g switches to Free for the Free rows and back to Premium at its end.
// Re-runnable: node library/phd/batch-editing/android/drafts/20261109-150747/build-phases.ts
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const draft = HERE.replace(/[\\/]$/, '').split(/[\\/]/).pop();

const phases = [
  { id: 'R1', name: 'Full run of draft v2 on the S23', round: true,
    note: 'Premium unless the segment says Free. Section 3 rows use the four stand-in photos in the 「Casebook」 album (fixtures.md). AI Enhance charges no credits (R-004): read the balance before and after anyway.',
    segments: [
      { id: 'R1-a', name: 'Photo Picker and entry', note: 'Launcher 「Edit」 and 「AI Enhance」 pickers, Single / Batch, tray, 20-photo cap, entries, deeplink, picker Back.',
        cases: ['TC-001', 'TC-002', 'TC-003', 'TC-004', 'TC-005', 'TC-006', 'TC-007', 'TC-008', 'TC-009', 'TC-150', 'TC-151', 'TC-010', 'TC-011', 'TC-012', 'TC-013', 'TC-014', 'TC-015', 'TC-016', 'TC-017', 'TC-137',
          'TC-018', 'TC-019', 'TC-020', 'TC-021', 'TC-022', 'TC-152'] },
      { id: 'R1-b', name: 'Batch Edit Room main and Crop & Rotate', note: '12 photos from the gallery; Crop & Rotate room, Apply to all, room history.',
        cases: ['TC-023', 'TC-024', 'TC-025', 'TC-154', 'TC-026', 'TC-027', 'TC-028', 'TC-029', 'TC-030', 'TC-031', 'TC-032', 'TC-033',
          'TC-037', 'TC-161', 'TC-155', 'TC-038', 'TC-039', 'TC-040', 'TC-041', 'TC-042', 'TC-153', 'TC-043', 'TC-044', 'TC-045', 'TC-046', 'TC-047',
          'TC-062', 'TC-063', 'TC-064', 'TC-065', 'TC-066', 'TC-067', 'TC-068', 'TC-140'] },
      { id: 'R1-c', name: 'Crop rules (Section 3 test set)', note: 'The four stand-in photos ① – ④ in this order (fixtures.md); pixel sizes read from the room\'s 「W x H」 label and the saved files.',
        cases: ['TC-048', 'TC-049', 'TC-050', 'TC-051', 'TC-052', 'TC-053', 'TC-054', 'TC-055', 'TC-056', 'TC-057', 'TC-058', 'TC-059', 'TC-060', 'TC-061', 'TC-149'] },
      { id: 'R1-d', name: 'Adjustment room', note: 'Light / Color / Details, HSL and Curve, Apply to all, room history.',
        cases: ['TC-069', 'TC-070', 'TC-159', 'TC-071', 'TC-072', 'TC-073', 'TC-074', 'TC-158', 'TC-075', 'TC-076', 'TC-077', 'TC-078', 'TC-079', 'TC-080', 'TC-081', 'TC-141'] },
      { id: 'R1-e', name: 'AI Enhance', note: 'Batch enhance on 12 (and 20) photos; second visit; Undo / Redo of Enhance on the main screen; offline rows turn Wi-Fi off and back on (USB only).',
        cases: ['TC-083', 'TC-084', 'TC-085', 'TC-086', 'TC-087', 'TC-088', 'TC-144', 'TC-089', 'TC-090', 'TC-091', 'TC-143', 'TC-092', 'TC-093', 'TC-094', 'TC-095', 'TC-100', 'TC-142',
          'TC-034', 'TC-035', 'TC-036', 'TC-097', 'TC-157', 'TC-096', 'TC-101', 'TC-102', 'TC-160', 'TC-103', 'TC-104', 'TC-105', 'TC-106', 'TC-107', 'TC-108', 'TC-109', 'TC-110', 'TC-111', 'TC-112'] },
      { id: 'R1-f', name: 'Leaving, Save and the Batch Save page', note: 'Discard Dialog, saving 20 photos, the Batch Save page and 「Edit Next Batch」.',
        cases: ['TC-113', 'TC-114', 'TC-138', 'TC-115', 'TC-116', 'TC-117', 'TC-118', 'TC-145', 'TC-139', 'TC-119', 'TC-120', 'TC-121',
          'TC-122', 'TC-123', 'TC-124', 'TC-146', 'TC-125', 'TC-126', 'TC-127', 'TC-128', 'TC-129', 'TC-130', 'TC-131', 'TC-147', 'TC-132', 'TC-133', 'TC-134', 'TC-148', 'TC-136'] },
      { id: 'R1-g', name: 'Free user', note: 'Settings › About › backdoor › 「subscriber」 off at the start (screenshot, ids masked), back on at the end and confirmed on the Launcher.',
        cases: ['TC-156', 'TC-082', 'TC-098', 'TC-099', 'TC-135'] },
    ] },
];

const needs: Record<string, string[]> = {};
for (const id of ['TC-096', 'TC-101', 'TC-102', 'TC-160', 'TC-103', 'TC-104', 'TC-105', 'TC-109']) needs[id] = ['fault'];
needs['TC-136'] = ['rd-info'];
const unavailable: Record<string, string> = {
  fault: 'observability: PhotoDirector Android has no switch that makes some photos of a batch fail AI Enhance (run-android.md › Debug controls); offline failures are TC-106 – TC-108',
  'rd-info': 'the rating-dialog trigger count is not known (needs RD); record Blocked test-data until RD gives it',
};

const all = phases.flatMap(p => p.segments.flatMap(s => s.cases));
if (new Set(all).size !== all.length) throw new Error(`a case is in two segments: ${all.filter((c, i) => all.indexOf(c) !== i)}`);
const rows = readFileSync(join(HERE, 'draft.csv'), 'utf8').split('\n').map(l => l.match(/^﻿?(TC-\d+),/)?.[1]).filter(Boolean) as string[];
const missing = rows.filter(r => !all.includes(r)), extra = all.filter(c => !rows.includes(c));
if (missing.length || extra.length) throw new Error(`phases out of step with draft.csv: missing ${missing}; extra ${extra}`);
writeFileSync(join(HERE, 'phases.json'), JSON.stringify({ draft, current: ['R1'], needs, unavailable, phases }, null, 2) + '\n');
console.log(`phases.json: ${all.length} cases; ${phases.map(p => `${p.id} ${p.segments.map(s => `${s.id} ${s.cases.length}`).join(', ')}`).join(' · ')}`);
