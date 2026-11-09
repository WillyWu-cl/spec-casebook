// Results page (user, 2026-10-28): every run's cases with their result, the reason behind it (Actual, the blocked note),
// the expected result and the screenshots recorded as evidence, so a run reads without opening its folder. The run plan
// shows where a run stands; this page shows what each case found.
// Usage: node scripts/results-page.ts <product>/<feature> <platform> [--out <file.html>]
//        node scripts/results-page.ts <product>/<feature> <platform> --serve [port] [--lan]
// Reads runs/*/results.csv (the latest record per case in each run folder), each folder's run-state.md (phase, build)
// and blocked-reasons.json, and the table's cases.csv (Precondition, Priority). --serve (default port 4492) rebuilds on
// every request and sends the screenshots as files/<path under the repo> (with ?thumb a small JPEG copy for the list,
// lib/thumbs.ts; the viewer opens the original); scripts/pages.ts serves it as /results/.
// Without --serve: runs/results.html, with the screenshots linked relative to it (open it from the runs folder).
// eBugs (user, 2026-11-04): each Fail case links the eBugs it belongs to, from the table's ebugs/<batch>/ folders: the
// batch filed from a run (the run folder its drafts and notes name most) gives `filed` (a draft entry whose Report step
// names the case → its ISS → filed_bugcodes.json) and `known` (dedupe.txt: the existing ticket a Fail row repeats);
// any other eBug code in the row's Actual or Disposition is `mentioned`. Links use the eCL address the ebug-tr-filer
// skill prescribes (HandleMainEbug.asp?BugCode=).
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { networkInterfaces } from 'node:os';
import { join, relative } from 'node:path';
import { readRecords } from './lib/csv.ts';
import { thumbnail } from './lib/thumbs.ts';
import { ROOT, arg, assertIds, readManifest, readTable, tableDir } from './lib/library.ts';
import { withShared } from './lib/page-shared.ts';

const [feature, platform] = process.argv.slice(2);
assertIds(feature, platform);
const table = tableDir(feature, platform), runsDir = join(table, 'runs');
const si = process.argv.indexOf('--serve'), serve = si >= 0, lan = process.argv.includes('--lan');
const IMG = /\.(png|jpe?g)$/i;
const title = readManifest(feature, platform)?.title ?? feature;

const CODE = /\b[A-Z]{3}\d{6}(?:P|-)\d{4}\b/g;
// "PDR-A 16.8.0 - [AIAgent][UI] AI Mini Drama: Leaving …" → tags "[AIAgent][UI]" and the title "Leaving …"
const reTitle = new RegExp(`^(${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}|${feature.split('/').pop()!.replace(/-/g, '[ -]')})\\s*:\\s*`, 'i');
const split = (t = '') => { const rest = t.replace(/^[A-Z][\w-]* [\d.]+ - /, ''), tags = rest.match(/^(\[[^\]]*\])+/)?.[0] ?? '';
  return { tags, title: rest.slice(tags.length).trim().replace(reTitle, '') }; };
function ebugIndex() {
  const root = join(table, 'ebugs'), info = new Map<string, { title: string; tags: string }>();
  const byRun = new Map<string, Map<string, Map<string, 'filed' | 'known'>>>();
  const add = (run: string, tc: string, code: string, kind: 'filed' | 'known') => {
    const r = byRun.get(run) ?? byRun.set(run, new Map()).get(run)!, m = r.get(tc) ?? r.set(tc, new Map()).get(tc)!;
    if (m.get(code) !== 'filed') m.set(code, kind);
  };
  for (const b of existsSync(root) ? readdirSync(root).filter(b => statSync(join(root, b)).isDirectory()) : []) {
    const dir = join(root, b), texts = readdirSync(dir).filter(f => /\.(md|txt)$/.test(f)).map(f => readFileSync(join(dir, f), 'utf8'));
    const named = new Map<string, number>();
    for (const t of texts) for (const m of t.matchAll(/runs\/(20\d\d-\d\d-\d\d[\w-]*)/g)) named.set(m[1], (named.get(m[1]) ?? 0) + 1);
    const run = [...named].sort((x, y) => y[1] - x[1])[0]?.[0];
    const filed = existsSync(join(dir, 'filed_bugcodes.json')) ? JSON.parse(readFileSync(join(dir, 'filed_bugcodes.json'), 'utf8')).bugs ?? [] : [];
    const iss = new Map<string, string>();
    for (const f of filed) { if (!f.bugcode) continue; info.set(f.bugcode, split(f.short)); if (f.iss) iss.set(f.iss, f.bugcode); if (f.key) iss.set(f.key, f.bugcode); }
    if (!run) continue;
    // drafts: "## 3. ISS-AMDA-62 — …" then "**Report step:** TC-465, O-6"
    for (const f of readdirSync(dir).filter(f => /_eBug_drafts_.*\.md$/.test(f))) {
      const parts = readFileSync(join(dir, f), 'utf8').split(/^## /m);
      for (const p of parts) {
        const id = p.match(/^\d+\.\s+([\w-]+)/)?.[1], code = id && iss.get(id), steps = p.match(/\*\*Report step:\*\*([^\n]*)/)?.[1];
        if (code && steps) for (const tc of steps.match(/TC-\d+/g) ?? []) add(run, tc, code, 'filed');
      }
    }
    // dedupe.txt: "<code> [<status>] <title>[ / <code> [<status>] <title>]" then indented "    TC-412: …" lines
    if (existsSync(join(dir, 'dedupe.txt'))) {
      let codes: string[] = [];
      for (const l of readFileSync(join(dir, 'dedupe.txt'), 'utf8').split('\n')) {
        if (/^[A-Z]{3}\d{6}[P-]\d{4} \[/.test(l)) {
          codes = [];
          for (const m of l.matchAll(/([A-Z]{3}\d{6}[P-]\d{4}) \[[^\]]*\] (.*?)(?= \/ [A-Z]{3}\d{6}[P-]\d{4} \[|\s+⚑|$)/g)) { codes.push(m[1]); if (!info.has(m[1])) info.set(m[1], split(m[2].trim())); }
        } else if (/^\s+(TC-\d+)/.test(l)) for (const c of codes) add(run, l.trim().match(/^TC-\d+/)![0], c, 'known');
        else if (!/^\s/.test(l)) codes = [];
      }
    }
  }
  return (run: string, id: string, text: string) => {
    const m = new Map<string, string>(byRun.get(run)?.get(id) ?? []);
    for (const c of text.match(CODE) ?? []) if (!m.has(c)) m.set(c, 'mentioned');
    return [...m].map(([code, kind]) => ({ code, kind, title: info.get(code)?.title ?? '', tags: info.get(code)?.tags ?? '' }));
  };
}

function buildData(link: (abs: string) => string) {
  const ebugsOf = ebugIndex();
  const cases = existsSync(join(table, 'cases.csv')) ? readTable(join(table, 'cases.csv')) : [];
  const row = new Map(cases.map(r => [r.ID, r]));
  const runs: any[] = [];
  for (const d of existsSync(runsDir) ? readdirSync(runsDir).filter(d => statSync(join(runsDir, d)).isDirectory()).sort() : []) {
    const dir = join(runsDir, d), rc = join(dir, 'results.csv');
    if (!existsSync(rc)) continue;
    const state = existsSync(join(dir, 'run-state.md')) ? readFileSync(join(dir, 'run-state.md'), 'utf8') : '';
    const blocked = existsSync(join(dir, 'blocked-reasons.json')) ? JSON.parse(readFileSync(join(dir, 'blocked-reasons.json'), 'utf8')) : {};
    const latest = new Map<string, any>();
    for (const r of readRecords(readFileSync(rc, 'utf8'))) {
      const at = Date.parse(r['Recorded At']) || 0, id = r.ID;
      if (!id || (latest.get(id)?.t ?? -1) > at) continue;
      // Evidence lists files relative to the run folder, separated by spaces; anything else in it is kept as a note
      const ev = (r.Evidence ?? '').split(/\s+/).filter(Boolean);
      const shots = ev.filter(e => IMG.test(e) && existsSync(join(dir, e))).map(e => ({ src: link(join(dir, e)), name: e.split('/').pop() }));
      const other = ev.filter(e => !IMG.test(e) || !existsSync(join(dir, e)));
      const t = row.get(id);
      latest.set(id, { id, t: at, at: r['Recorded At'] ?? '', phase: r.Phase ?? '', seg: r.Segment ?? '', needs: r.Needs ?? '', section: r.Section || t?.Section || '',
        pre: t?.Precondition ?? '', prio: t?.Priority ?? '', action: r.Action || t?.Action || '', expected: r['Expected Result'] || t?.['Expected Result'] || '',
        result: r.Result || 'Not run', disp: r.Disposition ?? '', actual: r.Actual ?? '', why: blocked[id]?.note ?? '', group: blocked[id]?.group ?? '',
        shots, files: other, ebugs: /^fail/i.test(r.Result ?? '') ? ebugsOf(d, id, `${r.Actual ?? ''} ${r.Disposition ?? ''}`) : [] });
    }
    if (!latest.size) continue;
    const list = [...latest.values()].sort((a, b) => a.seg.localeCompare(b.seg, 'en', { numeric: true }) || a.id.localeCompare(b.id, 'en', { numeric: true }));
    const times = list.map(c => c.t).filter(Boolean);
    runs.push({ id: d, phase: state.match(/^# Run state — (P\d+)/m)?.[1] ?? '', build: state.match(/\b[A-Z][A-Za-z]+(?: iOS)? (\d+\.\d+\.\d+ \(\d+\))/)?.[1] ?? '',
      report: existsSync(join(dir, 'report.md')), first: times.length ? new Date(Math.min(...times)).toISOString() : '', last: times.length ? new Date(Math.max(...times)).toISOString() : '',
      n: list.length, tally: Object.fromEntries([...new Set(list.map(c => c.result))].map(r => [r, list.filter(c => c.result === r).length])),
      ids: list.map(c => c.id), cases: list.map(({ t, ...c }) => c) });
  }
  return { feature, title, platform, built_at: new Date().toISOString(), runs: runs.reverse() };
}

// served, the page carries the newest run's cases and fetches another run's when it is opened (run.json): all of them
// together were 2 MB, for one shown
const newestOnly = (d: ReturnType<typeof buildData>) => ({ ...d, runs: d.runs.map((r, i) => i ? { ...r, cases: null } : r) });
const page = (data: unknown) => withShared(readFileSync(join(import.meta.dirname, 'results-page.tpl'), 'utf8'))
  .replaceAll('__TITLE__', `${title} Results`).replace('__DATA__', () => JSON.stringify(data).replace(/</g, '\\u003c'));

if (serve) {
  const portArg = /^\d+$/.test(process.argv[si + 1] ?? '') ? Number(process.argv[si + 1]) : 4492;
  // built once per change of the feature's files (the stamp scripts/pages.ts sends): every view, in-place check and
  // run opened until then reads the same data
  const link = (abs: string) => `files/${encodeURI(relative(ROOT, abs).split('\\').join('/'))}`;
  let built: { stamp: string; data: ReturnType<typeof buildData> } | null = null;
  const dataFor = (req: import('node:http').IncomingMessage) => {
    const stamp = String(req.headers['x-casebook-stamp'] ?? '');
    if (stamp && built?.stamp === stamp) return built.data;
    const data = buildData(link);
    if (stamp) built = { stamp, data };
    return data;
  };
  const server = createServer((req, res) => {
    try {
      const url = req.url ?? '/';
      if (url === '/' || url.startsWith('/?')) {
        const html = page(newestOnly(dataFor(req)));
        res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' }); res.end(html); return;
      }
      // the same data alone, for the in-place update (scripts/pages.ts __check)
      if (url.startsWith('/data.json')) {
        res.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' });
        res.end(JSON.stringify(newestOnly(dataFor(req)))); return;
      }
      if (url.startsWith('/run.json')) {
        const id = new URL(url, 'http://x').searchParams.get('id'), r = dataFor(req).runs.find(x => x.id === id);
        res.writeHead(r ? 200 : 404, { 'content-type': 'application/json', 'cache-control': 'no-store' }); res.end(JSON.stringify(r?.cases ?? [])); return;
      }
      // screenshots: images under this table's runs folder only
      const f = url.match(/^\/files\/([^?#]+)/);
      if (f) {
        const p = join(ROOT, decodeURIComponent(f[1]));
        if (IMG.test(p) && relative(runsDir, p).split(/[\\/]/)[0] !== '..' && existsSync(p)) {
          const send = (file: string, type: string) => { res.writeHead(200, { 'content-type': type, 'cache-control': 'max-age=300' }); res.end(readFileSync(file)); };
          const original = () => send(p, /png$/i.test(p) ? 'image/png' : 'image/jpeg');
          if (/[?&]thumb\b/.test(url)) thumbnail(p).then(t => t ? send(t, 'image/jpeg') : original()).catch(() => { if (!res.headersSent) original(); });
          else original();
          return; }
      }
      res.writeHead(404); res.end('Not found');
    } catch (e: any) { res.writeHead(500, { 'content-type': 'text/plain' }); res.end(String(e?.message ?? e)); }
  });
  let port = portArg; const host = lan ? '0.0.0.0' : '127.0.0.1';
  server.on('error', (e: any) => { if (e.code === 'EADDRINUSE' && port < portArg + 60) { port++; server.listen(port, host); } else throw e; });
  server.on('listening', () => {
    console.log(`Results (live): http://127.0.0.1:${port}/  — Ctrl+C to stop`);
    if (!lan) return;
    for (const ifs of Object.values(networkInterfaces())) for (const i of ifs ?? []) if (i.family === 'IPv4' && !i.internal) console.log(`  LAN: http://${i.address}:${port}/`);
    console.log('  Warning: --lan has no auth; anyone on this network can read the page.');
  });
  server.listen(port, host);
} else {
  const out = arg('out') ?? join(runsDir, 'results.html');
  const data = buildData(abs => encodeURI(relative(join(out, '..'), abs).split('\\').join('/')));
  writeFileSync(out, page(data));
  console.log(`${out}: ${data.runs.length} runs, ${data.runs.reduce((n, r) => n + r.cases.length, 0)} case records`);
}
