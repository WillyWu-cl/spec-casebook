// Small JPEG copies of run screenshots for the live pages (Results shows them 220 px high; the original PNGs are
// 0.5–3 MB each). Made with macOS `sips` (as device.ts and coverage-page.ts already do) a few at a time, kept in
// node_modules/.cache/casebook-thumbs/ (git-ignored) under the source's path, size and mtime, so a re-captured
// screenshot gets a new copy. Where sips is missing or fails, thumbnail() gives null and the caller sends the original.
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const dir = join(import.meta.dirname, '..', '..', 'node_modules', '.cache', 'casebook-thumbs');
const MAX = 480;   // longest side in px: a 220 px high image on a 2× screen
const running = new Map<string, Promise<string | null>>(), queue: (() => void)[] = [];
let active = 0;
const slot = () => new Promise<void>(go => { if (active < 3) { active++; go(); } else queue.push(() => { active++; go(); }); });
const done = () => { active--; queue.shift()?.(); };

export function thumbnail(src: string): Promise<string | null> {
  let st; try { st = statSync(src); } catch { return Promise.resolve(null); }
  const out = join(dir, createHash('sha1').update(`${src}|${st.size}|${st.mtimeMs}|${MAX}`).digest('hex').slice(0, 20) + '.jpg');
  if (existsSync(out)) return Promise.resolve(out);
  const was = running.get(out); if (was) return was;
  const job = slot().then(() => new Promise<string | null>(ok => {
    try { mkdirSync(dir, { recursive: true }); } catch {}
    execFile('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '75', '-Z', String(MAX), src, '--out', out], { timeout: 20_000 },
      err => ok(!err && existsSync(out) ? out : null));
  })).finally(() => { done(); running.delete(out); });
  running.set(out, job);
  return job;
}
