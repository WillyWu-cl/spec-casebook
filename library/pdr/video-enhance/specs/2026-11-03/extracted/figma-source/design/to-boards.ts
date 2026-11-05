// Writes extracted/boards/ds-<board>.md from the Design source read (figma-source/design/out/<board>.json): this spec
// set has no PDF, so the Design board text comes from the Figma text nodes instead of OCR. Same y / x / text form as
// spec-boards.ts and the PM boards (figma-text/to-boards.ts): absolute canvas points of the Figma page, one line per
// paragraph of a text node (line height from its first run). Hidden nodes, nodes under a hidden parent and opacity-0
// nodes are left out (Figma does not draw them).
// Usage: node library/pdr/video-enhance/specs/2026-11-03/extracted/figma-source/design/to-boards.ts
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
const here = import.meta.dirname, out = join(here, '..', '..', 'boards');
const boards: [string, string, string][] = [
  ['3293-13054', 'ds-main-flow', 'Main Flow（Free user → IAP）'],
  ['3293-14560', 'ds-routing', 'Routing Logic'],
  ['3293-14642', 'ds-entry-points', 'Entry Points'],
  ['3293-15052', 'ds-alt-exception', 'Alternative & Exception'],
  ['3300-32003', 'ds-ai-video-enhance', 'AI Video Enhance'],
  ['3396-20438', 'ds-cancel', 'Cancel'],
];
for (const [file, id, title] of boards) {
  const j = JSON.parse(readFileSync(join(here, 'out', `${file}.json`), 'utf8'));
  const byId = new Map<string, any>(j.nodes.map((n: any) => [n.id, n]));
  const shown = (n: any): boolean => { for (let p = n; p; p = byId.get(p.parent)) { if (p.hidden || p.opacity === 0) return false; } return true; };
  const rows: [number, number, string][] = [];
  for (const n of j.nodes) {
    if (n.type !== 'TEXT' || !n.text?.characters || !shown(n)) continue;
    const r0 = n.text.runs?.[0], lh = typeof r0?.line_height === 'number' ? r0.line_height : (r0?.font_size ?? 14) * 1.3;
    let row = 0;
    for (const t of String(n.text.characters).split(/\r?\n|\r|\u2028/)) {
      if (t.trim()) rows.push([Math.round(n.abs[1] + row * lh), Math.round(n.abs[0]), t.trim()]);
      row++;
    }
  }
  rows.sort((a, c) => a[0] - c[0] || a[1] - c[1]);
  writeFileSync(join(out, `${id}.md`), `# ${title}\n\nSource: Video Enhance Design Figma (HceGLJVaxnKsv7gXSXzKWh) · board \`${id}\` · node ${file.replace('-', ':')} · section 3293:13053 「AI Video Enhance_26.09_v2」\n` +
    `Figma text nodes (figma-source/design/out/${file}.json; no PDF in this spec set, so no OCR). Columns: y, x (canvas points), text.\n\n\`\`\`\n` +
    rows.map(([y, x, t]) => `${String(y).padStart(6)} ${String(x).padStart(6)}  ${t}`).join('\n') + '\n```\n');
  console.log(id, rows.length);
}
