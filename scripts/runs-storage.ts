// How much disk the run folders use, and the clean-ups that change no evidence (scripts/lib/runs-storage.ts says what
// each does). Nothing changes without --apply.
// Usage: node scripts/runs-storage.ts [<product>/<feature> [ios|android]]       measure, the default
//        node scripts/runs-storage.ts logs [<feature> [<platform>]] [--apply]    drop logs/*/unzipped/ copies the zips can restore
//        node scripts/runs-storage.ts dedupe [<feature> [<platform>]] [--apply]  byte-identical files → APFS clones
//        node scripts/runs-storage.ts unpack <run folder>                        bring a run's unzipped/ copies back
import { existsSync } from 'node:fs';
import { relative } from 'node:path';
import { PLATFORMS, ROOT, listFeatures, tableDir } from './lib/library.ts';
import { cloneGroup, duplicates, logPulls, removeUnzipped, runFolders, runUse, unpack } from './lib/runs-storage.ts';

const argv = process.argv.slice(2), apply = argv.includes('--apply');
const words = argv.filter(a => !a.startsWith('--'));
const command = ['logs', 'dedupe', 'unpack'].includes(words[0]) ? words.shift()! : 'report';
const mb = (n: number) => `${Math.round(n / 1e6).toLocaleString('en')} MB`;

if (command === 'unpack') {
  if (!words[0] || !existsSync(words[0])) { console.error('Usage: node scripts/runs-storage.ts unpack <run folder>'); process.exit(2); }
  console.log(`${unpack(words[0])} log pull(s) unpacked in ${words[0]}`);
  process.exit(0);
}
const [feature, platform] = words;
const tables = (feature ? [feature] : listFeatures()).flatMap(f => (platform ? [platform] : PLATFORMS).map(p => tableDir(f, p))).filter(t => existsSync(`${t}/runs`));

if (command === 'logs') {
  let done = 0, kept = 0;
  for (const t of tables) for (const run of runFolders(t)) for (const p of logPulls(run)) {
    if (!p.safe) { kept += p.bytes; console.log(`kept ${p.unzipped} (${p.why})`); continue; }
    if (apply) removeUnzipped(p);
    done += p.bytes;
  }
  console.log(`${apply ? 'Removed' : 'Would remove'} ${mb(done)} of unzipped log copies${kept ? `; ${mb(kept)} kept` : ''}.${apply ? ' Bring a run back with `unpack <run folder>`.' : ' Add --apply to do it.'}`);
} else if (command === 'dedupe') {
  let saved = 0;
  for (const t of tables) for (const g of duplicates(`${t}/runs`)) saved += apply ? cloneGroup(g) : g.size * (g.files.length - 1);
  console.log(`${apply ? 'Cloned' : 'Would clone'} up to ${mb(saved)} of identical files (a file already cloned counts again: the disk cannot tell).${apply ? '' : ' Add --apply to do it.'}`);
} else {
  let all = 0, logs = 0, shots = 0, named = 0, dup = 0;
  for (const t of tables) {
    const use = runFolders(t).map(runUse), total = use.reduce((n, u) => n + u.total, 0);
    if (!total) continue;
    const d = duplicates(`${t}/runs`).filter(g => !g.files[0].includes('/unzipped/')).reduce((n, g) => n + g.size * (g.files.length - 1), 0);
    console.log(`\n${relative(ROOT, t)}  ${mb(total)}`);
    for (const u of use.sort((a, b) => b.total - a.total).slice(0, 5)) console.log(`  ${mb(u.total).padStart(9)}  ${u.run.split('/').pop()}  (log copies ${mb(u.logs)}, images ${mb(u.shots)}, of those named in results.csv ${mb(u.named)})`);
    all += total; dup += d;
    for (const u of use) { logs += u.logs; shots += u.shots; named += u.named; }
  }
  console.log(`\nAll runs: ${mb(all)}`);
  console.log(`  ${mb(logs)} unzipped log copies: \`logs --apply\` removes them, the zips stay`);
  console.log(`  ${mb(dup)} identical files outside those: \`dedupe --apply\` keeps every path, one copy on disk`);
  console.log(`  ${mb(shots)} images, ${mb(named)} named in a results.csv: left alone`);
}
