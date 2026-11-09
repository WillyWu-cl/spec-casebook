// What the live pages leave on this computer is theirs to clear (user, 2026-11-06). scripts/pages.ts runs this when it
// starts and once a day: temp files older than an hour from pages that stopped mid-build (and from before coverage-page.ts
// deleted its copy, ~1 MB per restart), and thumbnails no page has asked for in 30 days (lib/thumbs.ts refreshes a
// thumbnail's time on every use; a page makes it again when it is needed).
import { existsSync, readdirSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { THUMB_DIR } from './thumbs.ts';

const HOUR = 3_600_000, DAY = 24 * HOUR;

function sweep(dir: string, match: RegExp, maxAge: number, now: number) {
  let files = 0, bytes = 0;
  if (!existsSync(dir)) return { files, bytes };
  for (const name of readdirSync(dir)) {
    if (!match.test(name)) continue;
    const p = join(dir, name);
    try { const st = statSync(p); if (!st.isFile() || now - st.mtimeMs < maxAge) continue; rmSync(p); files++; bytes += st.size; } catch {}
  }
  return { files, bytes };
}

export function housekeeping(temp = tmpdir(), thumbs = THUMB_DIR, now = Date.now()) {
  const a = sweep(temp, /^coverage-.+-\d+\.(html|json)$/, HOUR, now), b = sweep(thumbs, /\.jpg$/, 30 * DAY, now);
  return { files: a.files + b.files, bytes: a.bytes + b.bytes };
}
