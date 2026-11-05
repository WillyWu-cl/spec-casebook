// use_figma returns, found by the call's `description` in the session transcripts (Claude Code: ~/.claude/projects/
// <cwd>/, subagents included; Codex: ~/.codex/sessions/), so a reply is saved verbatim and never retyped. Shared by
// figma-check.ts (check and re-read calls); figma-source.ts keeps its own copy of the same scan.
// A return made before `notBefore` (the call file's write time, less a minute) belongs to an older call with the same
// description and is skipped. Within one transcript the latest return wins; a newer transcript beats an older one.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './library.ts';

export type Found = { text: string; at: string };

const text = (c: any): string => typeof c === 'string' ? c : Array.isArray(c) ? c.map(text).join('')
  : c && typeof c === 'object' ? (typeof c.text === 'string' ? c.text : text(c.content ?? c.Ok?.content ?? '')) : '';
// a long return the host saved to a file instead of inlining it
const full = (t: string) => { const m = t.match(/Full output saved to: (\S+)/); return m && existsSync(m[1]) ? readFileSync(m[1], 'utf8') : t; };

export function useFigmaReturns(notBefore: Map<string, number>, opts: { days?: number; marker?: string } = {}): Map<string, Found> {
  const home = process.env.HOME ?? '', roots = [join(home, '.claude', 'projects', ROOT.replace(/[^A-Za-z0-9]/g, '-')), join(home, '.codex', 'sessions')];
  const files: { p: string; t: number }[] = [], since = Date.now() - (opts.days ?? 2) * 86400000;
  const scan = (d: string) => { for (const e of readdirSync(d, { withFileTypes: true })) { const p = join(d, e.name);
    if (e.isDirectory()) scan(p); else if (e.name.endsWith('.jsonl')) { const t = statSync(p).mtimeMs; if (t >= since) files.push({ p, t }); } } };
  for (const r of roots) if (existsSync(r)) scan(r);
  files.sort((a, b) => b.t - a.t);
  const found = new Map<string, Found>(), marker = opts.marker ?? 'use_figma';
  const fresh = (d: string, at?: string) => !at || Date.parse(at) >= (notBefore.get(d) ?? 0) - 60_000;
  for (const { p } of files) {
    if (found.size === notBefore.size) break;
    const calls = new Map<string, string>(), here = new Map<string, Found>();
    for (const line of readFileSync(p, 'utf8').split('\n')) {
      if (!line.includes(marker) && !calls.size) continue;
      let o: any; try { o = JSON.parse(line); } catch { continue; }
      for (const b of o.message?.content ?? []) {
        if (b.type === 'tool_use' && /use_figma$/.test(b.name) && notBefore.has(b.input?.description)) calls.set(b.id, b.input.description);
        if (b.type === 'tool_result' && calls.has(b.tool_use_id) && !b.is_error && fresh(calls.get(b.tool_use_id)!, o.timestamp))
          here.set(calls.get(b.tool_use_id)!, { text: full(text(b.content)), at: o.timestamp ?? '' });
      }
      const ev = o.payload ?? o; // Codex: mcp_tool_call_end carries the call and its result together
      const inv = ev.invocation ?? ev.item;
      if (inv && /use_figma$/.test(inv.tool ?? '') && notBefore.has(inv.arguments?.description)) {
        const d = inv.arguments.description, r = ev.result ?? inv.result;
        if (r && !r.Err && fresh(d, o.timestamp)) here.set(d, { text: full(text(r.Ok?.content ?? r.content ?? r)), at: o.timestamp ?? '' });
      }
    }
    for (const [d, f] of here) if (!found.has(d)) found.set(d, f);
  }
  return found;
}

// the JSON object in a return: bare, inside the host's text blocks, or with a line of text around it
export function jsonOf(t: string): any {
  const s = t.trim();
  try { const v = JSON.parse(s); if (Array.isArray(v) && typeof v[0]?.text === 'string') return jsonOf(v[0].text); return v; } catch { /* not bare JSON */ }
  const a = s.indexOf('{'), b = s.lastIndexOf('}');
  if (a >= 0 && b > a) try { return JSON.parse(s.slice(a, b + 1)); } catch { /* not JSON */ }
  return null;
}
