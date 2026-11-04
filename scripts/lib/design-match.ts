// The Figma and app sides of a Design screen, shared by design.ts (check) and the device scripts' automatic captures
// (lib/design-watch.ts): the visible nodes of a Figma screen frame, and the elements of an iOS or Android page source.
export type Box = [number, number, number, number];

// Every visible node inside the screen frame, relative to it; system chrome instances are skipped with their insides.
// controls: the inventory's unlabelled controls on this screen (by node id), checked for presence.
export function figmaScreen(nodes: any[], scr: any, controlNodes: Set<string>) {
  const kids = new Map<string, any[]>();
  for (const n of nodes) { if (!kids.has(n.parent)) kids.set(n.parent, []); kids.get(n.parent)!.push(n); }
  const texts: any[] = [], fills: any[] = [], controls: any[] = [];
  const CHROME = /status ?bar|home ?indicator|keyboard/i;
  const walk = (id: string) => {
    for (const n of kids.get(id) ?? []) {
      if (n.hidden || (n.drawn ?? 1) < 0.2 || (n.opacity ?? 1) < 0.05 || CHROME.test(`${n.name} ${n.component?.name ?? ''} ${n.component?.set ?? ''}`)) continue;
      const box: Box = [n.abs[0] - scr.abs[0], n.abs[1] - scr.abs[1], n.abs[2], n.abs[3]];
      if (box[0] >= scr.abs[2] || box[1] >= scr.abs[3] || box[0] + box[2] <= 0 || box[1] + box[3] <= 0) continue;
      if (controlNodes.has(n.id)) controls.push({ node: n.id, name: n.name, box });
      if (n.type === 'TEXT' && n.text?.characters?.trim()) {
        const run = n.text.runs?.[0] ?? {}, solid = n.text.runs?.length === 1 ? run.fills?.filter((f: any) => f.type === 'SOLID') : null;
        texts.push({ node: n.id, text: n.text.characters.trim(), box, align: n.text.align?.[0] ?? 'LEFT', auto_resize: n.text.auto_resize, size: run.font_size,
          line_height: typeof run.line_height === 'number' ? run.line_height : 0, color: solid?.length === 1 && /ff$/i.test(solid[0].color) ? solid[0].color.slice(0, 7) : null });
      } else if (/^(FRAME|INSTANCE|RECTANGLE|COMPONENT)$/.test(n.type) && box[2] >= 40 && box[3] >= 24 && box[2] * box[3] < 0.4 * scr.abs[2] * scr.abs[3]
        && (n.radius || /btn|button|cta|chip|tag|card/i.test(n.name))) {
        const f = (n.fills ?? []).filter((x: any) => x.type === 'SOLID' && x.color && !x.color.endsWith('00')).at(-1);
        if (f && /ff$/i.test(f.color)) fills.push({ node: n.id, name: n.name, color: f.color.slice(0, 7), box });
      }
      walk(n.id);
    }
  };
  walk(scr.id);
  return { texts, fills: fills.slice(0, 40), controls };
}

// Elements of an XCUITest or UiAutomator2 page source in window units: their text (if any) and whether they can be
// tapped (buttons, cells, switches, clickable views), for the control presence check.
export function appElements(xml: string) {
  const dec = (t: string) => t.replace(/&#10;/g, '\n').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  const out: { type: string; text: string; box: Box; actionable: boolean }[] = [];
  for (const m of xml.matchAll(/<([\w.]+)\s([^>]*?)\/?>/g)) {
    const at: Record<string, string> = {};
    for (const a of m[2].matchAll(/([\w-]+)="([^"]*)"/g)) at[a[1]] = dec(a[2]);
    if (at.visible === 'false' || at.displayed === 'false') continue;
    let box: Box | null = null;
    if (at.bounds) { const b = at.bounds.match(/\[(\d+),(\d+)\]\[(\d+),(\d+)\]/); if (b) box = [+b[1], +b[2], +b[3] - +b[1], +b[4] - +b[2]]; }
    else if (at.x !== undefined) box = [+at.x, +at.y, +at.width, +at.height];
    const type = at.type ?? at.class ?? m[1];
    const text = (/StaticText|TextView|TextField|Button|Cell|Link/.test(type) ? (at.label || at.value || at.text || at['content-desc'] || '') : (at.text || '')).trim();
    if (!box || box[2] <= 0 || box[3] <= 0) continue;
    const actionable = /Button|Cell|Switch|Link|Image|TextField|SearchField|Tab/.test(type) || at.clickable === 'true';
    out.push({ type, text, box, actionable });
  }
  // a button's label repeated by the text inside it: keep the inner text only
  return out.map((o, i) => o.text && out.some((p, j) => j !== i && p.text === o.text && p.box[2] * p.box[3] < o.box[2] * o.box[3] && p.box[0] >= o.box[0] && p.box[1] >= o.box[1]) ? { ...o, text: '' } : o);
}

