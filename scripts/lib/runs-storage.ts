// What the run folders hold on this computer, and the two clean-ups that change no evidence (user, 2026-11-06; the
// run folders are local, scripts/runs-storage.ts is the command):
//   logs    logs/<pull>/unzipped/ is a copy of the Logs*.zip beside it, each pull holding the phone's whole log folder
//           again. It goes only when every file in it is in those zips at the same size; `unpack` brings it back.
//   dedupe  byte-identical files become APFS clones: every path and its bytes stay, each file stays separate if it is
//           edited later, and the disk holds one copy. (`du` still counts each one; the free space is what grows.)
// Everything else is measured only. Screenshots are never touched here.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { closeSync, existsSync, lstatSync, openSync, readdirSync, readFileSync, readSync, renameSync, rmSync, statSync, utimesSync } from 'node:fs';
import { dirname, join } from 'node:path';

const walk = (d: string): string[] => readdirSync(d, { withFileTypes: true }).flatMap(e => { const p = join(d, e.name); return e.isDirectory() ? walk(p) : e.isFile() ? [p] : []; });
const dirs = (d: string) => existsSync(d) ? readdirSync(d, { withFileTypes: true }).filter(e => e.isDirectory()).map(e => join(d, e.name)) : [];
const bytes = (files: string[]) => files.reduce((n, f) => n + lstatSync(f).size, 0);

export const logZips = (pull: string) => walk(pull).filter(f => /\/Logs\d*\.zip$/.test(f) && !f.includes('/unzipped/'));

// name → sizes, from `unzip -l`: "  4796  10-17-2026 01:26   name"
export function zipEntries(zip: string): Map<string, Set<number>> {
  const out = new Map<string, Set<number>>();
  for (const l of execFileSync('unzip', ['-l', zip], { encoding: 'utf8', maxBuffer: 1 << 26 }).split('\n')) {
    const m = l.match(/^\s*(\d+)\s+\S+\s+\S+\s+(.+)$/);
    if (m && !m[2].endsWith('/')) (out.get(m[2]) ?? out.set(m[2], new Set()).get(m[2])!).add(+m[1]);
  }
  return out;
}

export type Pull = { dir: string; unzipped: string; bytes: number; safe: boolean; why?: string };

/** Every log pull of a run folder that has an unzipped/ copy, and whether its zips can bring all of it back. */
export function logPulls(run: string): Pull[] {
  return dirs(join(run, 'logs')).filter(d => existsSync(join(d, 'unzipped'))).map(dir => {
    const unzipped = join(dir, 'unzipped'), files = walk(unzipped), zips = logZips(dir), have = new Map<string, Set<number>>();
    for (const z of zips) for (const [n, s] of zipEntries(z)) for (const v of s) (have.get(n) ?? have.set(n, new Set()).get(n)!).add(v);
    const lost = files.find(f => !have.get(f.slice(unzipped.length + 1))?.has(lstatSync(f).size));
    return { dir, unzipped, bytes: bytes(files), safe: !!zips.length && !lost, why: !zips.length ? 'no Logs zip beside it' : lost ? `not in the zips: ${lost.slice(unzipped.length + 1)}` : undefined };
  });
}

export const removeUnzipped = (p: Pull) => { if (p.safe) rmSync(p.unzipped, { recursive: true }); };

/** Put a run's unzipped/ copies back from their zips. */
export function unpack(run: string): number {
  let n = 0;
  for (const dir of dirs(join(run, 'logs'))) {
    if (existsSync(join(dir, 'unzipped'))) continue;
    const zips = logZips(dir);
    for (const z of zips) execFileSync('ditto', ['-x', '-k', z, join(dir, 'unzipped')]);
    if (zips.length) n++;
  }
  return n;
}

const hash = (f: string) => { const h = createHash('sha256'), fd = openSync(f, 'r'), b = Buffer.alloc(1 << 20);
  try { for (let n; (n = readSync(fd, b)) > 0;) h.update(b.subarray(0, n)); } finally { closeSync(fd); } return h.digest('hex'); };

/** Files with the same bytes under one folder, each group biggest saving first. Files under minBytes are not worth it. */
export function duplicates(root: string, minBytes = 65_536) {
  const bySize = new Map<number, string[]>();
  for (const f of walk(root)) { const s = lstatSync(f).size; if (s >= minBytes) (bySize.get(s) ?? bySize.set(s, []).get(s)!).push(f); }
  const groups: { size: number; files: string[] }[] = [];
  for (const [size, files] of bySize) {
    if (files.length < 2) continue;
    const byHash = new Map<string, string[]>();
    for (const f of files) { const h = hash(f); (byHash.get(h) ?? byHash.set(h, []).get(h)!).push(f); }
    for (const same of byHash.values()) if (same.length > 1) groups.push({ size, files: same.sort() });
  }
  return groups.sort((a, b) => b.size * (b.files.length - 1) - a.size * (a.files.length - 1));
}

/** Make the rest of a group clones of its first file; each keeps its own time. Gives the bytes cloned; none off APFS. */
export function cloneGroup(g: { size: number; files: string[] }): number {
  let saved = 0;
  const [keep, ...rest] = g.files;
  for (const f of rest) {
    const st = statSync(f), tmp = `${f}.clone-tmp`;
    try {
      execFileSync('cp', ['-c', keep, tmp], { stdio: 'ignore' });
      if (!readFileSync(tmp).equals(readFileSync(f))) throw new Error('differs');
      utimesSync(tmp, st.atime, st.mtime); renameSync(tmp, f); saved += g.size;
    } catch { rmSync(tmp, { force: true }); }
  }
  return saved;
}

export type RunUse = { run: string; total: number; logs: number; shots: number; named: number };

/** A run folder's use: all of it, the log copies, its images, and how much of those a results.csv names. */
export function runUse(run: string): RunUse {
  const files = walk(run), shots = files.filter(f => /\.(png|jpe?g|webp)$/i.test(f) && !f.includes('/logs/'));
  const csv = join(run, 'results.csv'), text = existsSync(csv) ? readFileSync(csv, 'utf8') : '';
  return { run, total: bytes(files), logs: bytes(files.filter(f => f.includes('/unzipped/'))), shots: bytes(shots), named: bytes(shots.filter(f => text.includes(f.slice(run.length + 1)))) };
}

export const runFolders = (table: string) => dirs(join(table, 'runs')).filter(d => !dirname(d).endsWith('_')).sort();
