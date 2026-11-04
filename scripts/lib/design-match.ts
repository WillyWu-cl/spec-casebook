// The Figma and app sides of a Design screen, shared by design.ts (check) and the device scripts' automatic captures
// (lib/design-watch.ts): the visible nodes of a Figma screen frame, and the elements of an iOS or Android page source.
export type Box = [number, number, number, number];

// A control of the inventory on this screen: its node (on one of the screens it is drawn on), name and box in the screen.
export type Ctl = { node: string; name: string; box: Box };

// Every visible node inside the screen frame, relative to it; system chrome instances are skipped with their insides.
// controls: the inventory's unlabelled controls on this screen (by node id), checked for presence.
// scope (user, 2026-11-04): on a screen shared with other features (the Launcher), `other` are the controls the trace
// marks `n/a: other feature: …` and `mine` every other control of the screen. Each other-feature control is left out
// with what surrounds it: the largest node around it that holds none of this feature's controls and less than 60 % of
// the screen (a shortcut tile with its label, the 「What's Trending」 section with its heading, a top bar of other
// features' buttons). Their texts, fills and icons are not measured; `out` lists those areas and `outTexts` their texts.
export function figmaScreen(nodes: any[], scr: any, controlNodes: Set<string>, scope?: { other: Ctl[]; mine: Ctl[] }) {
  const kids = new Map<string, any[]>(), byId = new Map<string, any>();
  for (const n of nodes) { if (!kids.has(n.parent)) kids.set(n.parent, []); kids.get(n.parent)!.push(n); byId.set(n.id, n); }
  const texts: any[] = [], fills: any[] = [], controls: any[] = [], out: { node: string; name: string; box: Box }[] = [];
  const CHROME = /status ?bar|home ?indicator|keyboard|iphone x|^notch$/i;
  let keyboard = false;   // the frame draws the keyboard up (the check compares it with the capture)
  const rel = (n: any): Box => [n.abs[0] - scr.abs[0], n.abs[1] - scr.abs[1], n.abs[2], n.abs[3]];
  const outIds = new Set<string>();
  if (scope?.other.length) {
    const inside = new Set<string>(), all: any[] = [];
    const down = (id: string) => { for (const n of kids.get(id) ?? []) { inside.add(n.id); all.push(n); down(n.id); } };
    down(scr.id);
    // a control drawn on several screens names the node of one of them: on the others it is found by name and box
    const find = (c: Ctl) => inside.has(c.node) ? c.node : all.find(n => n.name === c.name && rel(n).every((v, i) => Math.abs(v - c.box[i]) <= 2))?.id;
    // this feature's controls: their nodes and every node around them; a control added by hand (no node) by its box
    const mine = new Set<string>(), centres = scope.mine.map(c => [c.box[0] + c.box[2] / 2, c.box[1] + c.box[3] / 2]);
    for (const c of scope.mine) for (let id = find(c); id && id !== scr.id; id = byId.get(id)?.parent) mine.add(id);
    const holdsMine = (id: string) => { if (mine.has(id)) return true; const b = rel(byId.get(id)); return centres.some(([x, y]) => x > b[0] && x < b[0] + b[2] && y > b[1] && y < b[1] + b[3]); };
    const area = scr.abs[2] * scr.abs[3];
    for (const c of scope.other) {
      let id = find(c); if (!id || holdsMine(id)) continue;
      for (let p = byId.get(id).parent; p && p !== scr.id && !holdsMine(p) && byId.get(p).abs[2] * byId.get(p).abs[3] < 0.6 * area; p = byId.get(p).parent) id = p;
      outIds.add(id);
    }
  }
  const holdsImage = (id: string): boolean => (byId.get(id)?.fills ?? []).some((x: any) => x.type === 'IMAGE') || (kids.get(id) ?? []).some((k: any) => !k.hidden && holdsImage(k.id));
  const outTexts: string[] = [];
  const outText = (id: string) => { for (const n of kids.get(id) ?? []) { if (n.type === 'TEXT' && n.text?.characters?.trim()) outTexts.push(n.text.characters.trim()); outText(n.id); } };
  const walk = (id: string) => {
    for (const n of kids.get(id) ?? []) {
      if (n.hidden || (n.drawn ?? 1) < 0.2 || (n.opacity ?? 1) < 0.05) continue;
      if (CHROME.test(`${n.name} ${n.component?.name ?? ''} ${n.component?.set ?? ''}`)) { if (/keyboard/i.test(`${n.name} ${n.component?.name ?? ''} ${n.component?.set ?? ''}`) && n.abs[1] - scr.abs[1] < scr.abs[3]) keyboard = true; continue; }
      const box = rel(n);
      if (box[0] >= scr.abs[2] || box[1] >= scr.abs[3] || box[0] + box[2] <= 0 || box[1] + box[3] <= 0) continue;
      if (outIds.has(n.id)) { out.push({ node: n.id, name: n.name, box }); outText(n.id); continue; }
      if (controlNodes.has(n.id)) controls.push({ node: n.id, name: n.name, box });
      if (n.type === 'TEXT' && n.text?.characters?.trim()) {
        const run = n.text.runs?.[0] ?? {}, solid = n.text.runs?.length === 1 ? run.fills?.filter((f: any) => f.type === 'SOLID') : null;
        texts.push({ node: n.id, text: n.text.characters.trim(), box, align: n.text.align?.[0] ?? 'LEFT', auto_resize: n.text.auto_resize, size: run.font_size,
          font: run.font_family ? `${run.font_family} ${run.font_style ?? ''} ${run.font_size ?? '?'} pt`.replace(/\s+/g, ' ') : undefined,
          // the glyphs as Figma draws them (absoluteRenderBounds from the source read, in the board's frame like `box`)
          render: n.render && n.box ? [n.render[0] - n.box[0] + box[0], n.render[1] - n.box[1] + box[1], n.render[2], n.render[3]] : undefined,
          line_height: typeof run.line_height === 'number' ? run.line_height : 0, color: solid?.length === 1 && /ff$/i.test(solid[0].color) ? solid[0].color.slice(0, 7) : null });
      // filled shapes: buttons, chips and cards, and small badges and tags (「NEW」, 「HOT」: 12 × 8 pt and up; user, 2026-11-04)
      } else if (/^(FRAME|INSTANCE|RECTANGLE|COMPONENT)$/.test(n.type) && box[2] * box[3] < 0.4 * scr.abs[2] * scr.abs[3]
        && ((box[2] >= 40 && box[3] >= 24 && (n.radius || /btn|button|cta|chip|tag|card/i.test(n.name)))
          || (box[2] >= 12 && box[2] <= 120 && box[3] >= 8 && box[3] < 24 && (/tag|badge|label|new|hot|pill/i.test(n.name) || (n.radius && kids.get(n.id)?.some((k: any) => k.type === 'TEXT')))))) {
        // a shape holding an image (a portrait card, a poster) shows the image, not its fill
        const f = (n.fills ?? []).filter((x: any) => x.type === 'SOLID' && x.color && !x.color.endsWith('00')).at(-1);
        if (f && /ff$/i.test(f.color) && !holdsImage(n.id)) fills.push({ node: n.id, name: n.name, color: f.color.slice(0, 7), box });
      }
      walk(n.id);
    }
  };
  walk(scr.id);
  // a wrapper and the shape inside it on the same box (a white 「Tag」 instance around a pink 「Tag_new」): the inner one is what shows
  const same = (a: Box, b: Box) => a.every((v, i) => Math.abs(v - b[i]) <= 1);
  const shown = fills.filter((f, i) => !fills.some((g, j) => j > i && same(f.box, g.box)));
  return { texts, fills: shown.slice(0, 40), controls, out, outTexts, keyboard };
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

