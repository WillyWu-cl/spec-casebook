// Run time and token data that every computer sees alike once committed (user, 2026-11-03: the Progress page showed
// different usage on each Mac). Two things used to come from the local machine only:
// - Evidence file times (screenshots, logs, ledger). Screenshots and logs are git-ignored, so only the run machine has
//   them, and a git checkout stamps tracked files with the checkout time. Each file's time is now written once into
//   the run folder's activity.log as "<ISO> file <path>", and the page reads it from there.
// - Claude tokens. Transcripts live in ~/.claude of the machine that ran the session. Each run folder now keeps
//   tokens.jsonl: one line per assistant message (id, time, model, token counts; no text) from the sessions that name
//   the run folder, inside its active spans. Every build adds what this machine sees; the page counts the file.
import { execFileSync } from 'node:child_process';
import { appendFileSync, existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { transcriptMessages, transcriptRuns, type Msg } from '../token-usage.ts';

// Tracked files under a run folder that match the last commit. Their mtime is when git checked them out (a pull or a
// clone), not when the run wrote them, so they are never stamped; the run machine stamps each one before it is committed
// (the page rebuilds every 10 s during a run). One git call per build, and only when an unstamped file is seen.
function cleanTracked(dir: string): Set<string> {
  const git = (...a: string[]) => { try { return execFileSync('git', ['-C', dir, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }); } catch { return ''; } };
  const list = (...a: string[]) => git('ls-files', '-z', '--full-name', ...a, '--', '.').split('\0').filter(Boolean);
  const top = git('rev-parse', '--show-toplevel').trim(); if (!top) return new Set();
  const modified = new Set(list('-m'));
  return new Set(list().filter(f => !modified.has(f)).map(f => join(top, f)));
}

const skipped = new Map<string, number>();   // file → mtime seen as a checkout time (re-checked when it changes)
/** Activity points of a run folder: activity.log lines (with evidence times stamped into it first). `also`: more files
 *  to stamp the same way (the design check's result files in <run>/design/, design-page.ts). */
export function activityPoints(dir: string, also: string[] = []): number[] {
  const act = join(dir, 'activity.log');
  const text = existsSync(act) ? readFileSync(act, 'utf8') : '';
  const stamped = new Set([...text.matchAll(/^\S+ file (.+)$/gm)].map(m => m[1]));
  const walk = (d: string): string[] => existsSync(d) ? readdirSync(d).flatMap(f => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; }) : [];
  const files = [...walk(join(dir, 'screenshots')), ...walk(join(dir, 'ledger')),
    ...(existsSync(join(dir, 'logs')) ? readdirSync(join(dir, 'logs')).map(f => join(dir, 'logs', f)) : []), ...also.filter(f => existsSync(f))];
  const add: string[] = [];
  let clean: Set<string> | undefined;
  for (const f of files) {
    const rel = relative(dir, f); if (stamped.has(rel)) continue;
    const m = statSync(f).mtimeMs; if (skipped.get(f) === m) continue;
    if ((clean ??= cleanTracked(dir)).has(resolve(f))) { skipped.set(f, m); continue; }
    add.push(`${new Date(m).toISOString()} file ${rel}`);
  }
  if (add.length) { add.sort(); appendFileSync(act, (text && !text.endsWith('\n') ? '\n' : '') + add.join('\n') + '\n'); }
  const pts: number[] = [];
  for (const l of (text + '\n' + add.join('\n')).split('\n')) { const t = Date.parse(l.split(' ')[0]); if (t) pts.push(t); }
  return pts;
}

/** Run folders named in a subagent's brief (its first user message). A segment subagent exists only for its run, so all
 *  of its messages belong to that run, also those before its first device command (reading the plan and skill) and
 *  after its last one (the phase wrap-up: eBug drafts, report), which the activity spans miss (2026-11-11: R2 lost 25 %). */
const briefMemo = new Map<string, { size: number; runs: Set<string> }>();
function briefRuns(file: string): Set<string> {
  const size = statSync(file).size, c = briefMemo.get(file);
  if (c && c.size === size) return c.runs;
  const runs = new Set<string>();
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    if (!line.includes('"user"')) continue;
    let o: any; try { o = JSON.parse(line); } catch { continue; }
    if (o.type !== 'user') continue;
    for (const m of JSON.stringify(o.message?.content ?? '').matchAll(/\b(20\d\d-\d\d-\d\d-[A-Za-z0-9][A-Za-z0-9_-]*)/g)) runs.add(m[1]);
    break;
  }
  briefMemo.set(file, { size, runs });
  return runs;
}

/** Messages of this machine's transcripts by run folder: a session (main transcript plus its subagents) counts for every
 *  run folder that any of its files names. Messages of a subagent whose brief names the run carry `whole: true`: they
 *  count for it whatever the activity spans say. */
export function localRunMessages(files: string[], runs: Set<string>): Map<string, (Msg & { whole?: boolean })[]> {
  const groups = new Map<string, string[]>();
  for (const f of files) { const k = f.includes('/subagents/') ? dirname(dirname(f)) : f.replace(/\.jsonl$/, ''); (groups.get(k) ?? groups.set(k, []).get(k)!).push(f); }
  const out = new Map<string, (Msg & { whole?: boolean })[]>();
  for (const fs of groups.values()) {
    const named = new Set(fs.flatMap(f => [...transcriptRuns(f)]).filter(r => runs.has(r)));
    if (!named.size) continue;
    const msgs = transcriptMessages(fs);
    for (const r of named) {
      const whole = new Set(fs.filter(f => f.includes('/subagents/') && briefRuns(f).has(r)).flatMap(f => transcriptMessages([f]).map(m => m.id)));
      (out.get(r) ?? out.set(r, []).get(r)!).push(...msgs.map(m => whole.has(m.id) ? { ...m, whole: true } : m));
    }
  }
  return out;
}

const ledgerCache = new Map<string, { size: number; byId: Map<string, Msg> }>();
/** The run folder's tokens.jsonl merged with `local` (messages this machine sees for it); new or changed messages are
 *  appended. Returns every message of the ledger, last line per id. */
export function syncTokens(file: string, local: Msg[]): Msg[] {
  const size = existsSync(file) ? statSync(file).size : 0;
  let c = ledgerCache.get(file);
  if (!c || c.size !== size) {
    const byId = new Map<string, Msg>();
    if (size) for (const l of readFileSync(file, 'utf8').split('\n')) {
      if (!l) continue;
      try { const o = JSON.parse(l); byId.set(o.id, { id: o.id, ts: o.ts, t: Date.parse(o.ts), model: o.model, input: o.input, cacheWrite: o.cacheWrite, cacheRead: o.cacheRead, output: o.output }); } catch {}
    }
    c = { size, byId }; ledgerCache.set(file, c);
  }
  // A transcript can hold one message ID twice (a streamed partial with zero counts, then the final one): keep the
  // larger, or each build sees one of them as changed and appends both again, forever (2026-11-11)
  const sum = (m: Msg) => m.input + m.cacheWrite + m.cacheRead + m.output;
  const best = new Map<string, Msg>();
  for (const m of local) { const o = best.get(m.id); if (!o || sum(m) >= sum(o)) best.set(m.id, m); }
  const add: string[] = [];
  for (const m of best.values()) {
    const o = c.byId.get(m.id);
    if (o && o.input === m.input && o.cacheWrite === m.cacheWrite && o.cacheRead === m.cacheRead && o.output === m.output) continue;
    c.byId.set(m.id, m);
    add.push(JSON.stringify({ id: m.id, ts: m.ts, model: m.model, input: m.input, cacheWrite: m.cacheWrite, cacheRead: m.cacheRead, output: m.output }));
  }
  if (add.length) { appendFileSync(file, add.join('\n') + '\n'); c.size = statSync(file).size; }
  return [...c.byId.values()];
}
