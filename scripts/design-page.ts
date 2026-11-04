// Design page (figma skill, references/conformance.md): every Design screen with how the app compares to it, so the
// design check reads like the other casebook pages. One card per screen, filtered by status and board; a card opens
// the Figma screen and the app screenshot side by side with each difference boxed on both and listed with its verdict.
// Usage: node scripts/design-page.ts <product>/<feature> <ios|android> [--out <file.html>]
//        node scripts/design-page.ts <product>/<feature> <ios|android> --serve [port] [--lan]
// Reads <table>/design/plan.json and, per run folder, design/compare.json and design/findings.json (design.ts plan,
// check, settle and decide); the newest run that captured a screen is the one shown. A screen is
//   differs      a settled `bug`                       question     a verdict the two passes split on, or `question`
//   unreviewed   measured, candidates not settled yet  matches      measured, nothing left but `ok` / info
//   not captured reached by a row, no capture yet       no route / excluded   from the plan
// Images: the Figma side is figma-source's crop when this machine has it, else the committed board screenshot cropped
// in the browser; the app side is the run's screenshots/design/<id>.png on the computer that ran it, else the compact
// copy committed with the run (design/captures/<id>.webp), so every computer that pulled the repo shows both sides.
// Decisions (Figma Agent parity, 2026-11-03; user, 2026-11-04): every measured item takes Bug / OK / N/A, a bug an
// eBug tick, and an item moved to OK or N/A a reason (required when it overturns a bug); the choices stay in the
// browser (localStorage) until Save decisions sends them to design.ts decide (findings.json `decided`, `why`); the
// agent drafts the ticked eBugs. Opened as a file, the button copies the block for the chat instead.
// Images (user, 2026-11-04): clicking one opens it full size over the page, with its boxes, not in a new tab; clicking
// an item selects it and its boxes as clicking a box does. Other features' areas the check left out (the trace's
// `n/a: other feature: …`, design.ts check) are drawn dashed on the Figma side.
// Plan view (user, 2026-11-03): before any capture, what the check covers and what it leaves out: the boards read, the
// route to each screen with the flags that need a decision (an approximate route, a state beside a screen, a drawing
// narrower than a phone, a gap), and an Include / Exclude choice with a reason per screen or board (user, 2026-11-04: a
// flagged screen stays red, with a plain note, until one is pressed). Save sends a `DESIGN SCOPE` block to design.ts
// … scope, which writes plan.json (skip list, reasons, and the review mark once nothing is left to decide); opened as a
// file, the button copies the block for the chat instead.
// It opens by default until a run has captures. Boards are listed in app-flow order (the earliest row reaching each),
// or by screen count, by screens needing a look, or as Figma lists them.
// --serve (default port 4493) rebuilds on every request; scripts/pages.ts serves it as /design/. POST apply/scope and
// apply/decide take the block as text and run design.ts with it, from this computer only.
import { spawnSync } from 'node:child_process';
import { existsSync, openSync, readdirSync, readFileSync, readSync, closeSync, statSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { networkInterfaces } from 'node:os';
import { join, relative } from 'node:path';
import { readRecords } from './lib/csv.ts';
import { isLocal } from './lib/local.ts';
import { ROOT, arg, assertIds, featureDir, readManifest, readTable, tableDir } from './lib/library.ts';
import { activityPoints, localRunMessages, syncTokens } from './lib/run-ledger.ts';
import { IDLE, W, activity, estimator, readCalibration, readSnaps, spanStats, weeklyRatio, weight, type Group } from './lib/usage-estimate.ts';
import { addMsg, projectTranscripts, zero, type Msg } from './token-usage.ts';

const [feature, platform] = process.argv.slice(2);
assertIds(feature, platform);
const table = tableDir(feature, platform), fdir = featureDir(feature), runsDir = join(table, 'runs');
const si = process.argv.indexOf('--serve'), serve = si >= 0, lan = process.argv.includes('--lan');
const title = readManifest(feature, platform)?.title ?? feature;
const read = (p: string): any => JSON.parse(readFileSync(p, 'utf8'));
const pngWidth = (p: string) => { const b = Buffer.alloc(24), fd = openSync(p, 'r'); readSync(fd, b, 0, 24, 0); closeSync(fd); return b.readUInt32BE(16); };

function buildData(link: (abs: string) => string) {
  const planFile = join(table, 'design', 'plan.json');
  if (!existsSync(planFile)) return { feature, title, platform, missing: true };
  const plan = read(planFile);
  const out = join(fdir, 'specs', plan.spec_set, 'extracted', 'figma-source', 'design', 'out');
  // the newest measure per screen over every run folder
  const seen = new Map<string, any>();
  for (const d of existsSync(runsDir) ? readdirSync(runsDir).filter(d => statSync(join(runsDir, d)).isDirectory()).sort() : []) {
    const cf = join(runsDir, d, 'design', 'compare.json');
    if (!existsSync(cf)) continue;
    const ff = join(runsDir, d, 'design', 'findings.json'), found = existsSync(ff) ? read(ff).screens : null;
    const cmp = read(cf);
    for (const s of cmp.screens) if ((seen.get(s.id)?.captured_at ?? '') <= s.captured_at) seen.set(s.id, { ...s, run: d, settled: !!found, verdicts: found?.[s.id] ?? {}, font_width: cmp.font_width ?? null });
  }
  const widths = new Map<string, number>();
  // a screen's place in the app flow: the position in cases.csv of the row that reaches it (the table runs in flow order)
  const casesFile = join(table, 'cases.csv'), pos = new Map<string, number>(existsSync(casesFile) ? readTable(casesFile).map((r, i) => [r.ID, i]) : []);
  const screens = plan.screens.map((s: any) => {
    const crop = join(out, 'crops', s.board.replace(/[:;]/g, '-'), `${s.id.replace(/[:;]/g, '-')}.png`);
    let figma: any = null;
    if (existsSync(crop)) figma = { src: link(crop) };
    else if (s.board_png && s.board_box && existsSync(join(fdir, s.board_png))) {
      const p = join(fdir, s.board_png);
      if (!widths.has(p)) widths.set(p, pngWidth(p));
      const k = widths.get(p)! / s.board_box[2];
      figma = { src: link(p), iw: widths.get(p), crop: [(s.abs[0] - s.board_box[0]) * k, (s.abs[1] - s.board_box[1]) * k, s.abs[2] * k, s.abs[3] * k] };
    }
    const m = seen.get(s.id);
    let status = s.status === 'routed' ? 'not-captured' : s.status, items: any[] = [];
    if (m) {
      // settle answers every candidate, so one with no verdict is new since (a check run again): unreviewed, not OK
      items = m.candidates.map((c: any) => ({ ...c, ...(m.verdicts[c.id] ?? {}), verdict: m.verdicts[c.id]?.verdict ?? (c.severity === 'info' ? 'info' : 'unreviewed') }));
      // the reviewers' visual items; a verdict whose candidate the check no longer makes (an area left out since) is not shown
      for (const [id, v] of Object.entries<any>(m.verdicts)) if (id.startsWith('visual:') && !items.some(i => i.id === id)) items.push({ id, kind: id.split(':')[0], ...v });
      status = items.some(i => i.verdict === 'bug') ? 'differs' : items.some(i => i.verdict === 'question') ? 'question' : items.some(i => i.verdict === 'unreviewed') ? 'unreviewed' : 'matches';
    }
    // the run's own screenshot on the computer that ran it, else the compact copy committed with the run
    const img = (rel: string) => { const full = join(runsDir, m.run, rel), shared = join(runsDir, m.run, 'design', 'captures', rel.split('/').pop()!.replace(/\.png$/, '.webp'));
      return existsSync(full) ? link(full) : existsSync(shared) ? link(shared) : null; };
    const app = m ? img(m.png) : null;
    return { id: s.id, name: s.name, board: s.board_name, board_id: s.board, flags: s.flags ?? [], flow: pos.get(s.route?.case) ?? null, status, why: s.why ?? '', gap: !!s.gap, route: s.route ?? null, alternatives: s.alternatives ?? [], figma, app,
      run: m?.run ?? '', captured_at: m?.captured_at ?? '', build: m?.build ?? '', note: m?.note ?? '', arrival: m?.arrival ?? null, recheck: m?.recheck ?? null,
      parts: (m?.parts ?? []).map((p: string) => img(p)).filter(Boolean),
      settled: !!m?.settled, win: m?.win ?? null, k: m?.k ?? null, fit: m?.fit ?? null, out: m?.out ?? [], hidden: m?.hidden ?? [], ocr: m?.ocr ?? null, font_width: m?.font_width ?? null,
      w: s.abs[2], h: s.abs[3], items };
  });
  const sc = join(fdir, 'specs', plan.spec_set, 'extracted', 'figma-source', 'design', 'scope.json');
  const boards = existsSync(sc) ? (read(sc).read ?? []).map((b: any) => ({ id: b.id, name: b.name, read_at: b.read_at })) : [];
  return { feature, title, platform, built_at: new Date().toISOString(), spec_set: plan.spec_set, file: plan.file?.key ?? plan.file?.fileKey ?? '',
    review: plan.scope_review ? { at: plan.scope_review.at, fresh: screens.filter((x: any) => !plan.scope_review.ids?.includes(x.id)).map((x: any) => x.id) } : null,
    skip: plan.skip ?? [], reasons: plan.skip_reasons ?? {}, included: plan.scope_included ?? [], boards, gaps: plan.source_gaps ?? { unread: [], incomplete: [] }, screens };
}

// Token use of the design check (user, 2026-11-04), counted like the Progress page (lib/usage-estimate.ts, same
// calibration and weights, same tokens.jsonl ledger per run folder): per run folder with design work, the messages of
// the sessions that name it inside the design check's active spans: design/activity.log (every design.ts command on
// the run) and the first sight of its result files (compare, builder, reviewer, findings), plus, for a design pass on
// its own (a run folder with no results.csv), the run's own activity (captures, taps). A casebook run's automatic
// captures cost no call of their own, so for such a run the Design tab also shows that run's own figure (the same as
// Progress) as the run the captures rode on. Built on every request of /usage.json, which the page polls every 10 s.
function usageData() {
  const dirs = existsSync(runsDir) ? readdirSync(runsDir).filter(d => existsSync(join(runsDir, d, 'design'))).sort() : [];
  const rowsOf = (d: string) => existsSync(join(runsDir, d, 'results.csv')) ? readRecords(readFileSync(join(runsDir, d, 'results.csv'), 'utf8')) : null;
  const phaseOf = (d: string) => existsSync(join(runsDir, d, 'run-state.md')) ? readFileSync(join(runsDir, d, 'run-state.md'), 'utf8').match(/^# Run state — ([A-Z]+\d+)/m)?.[1] ?? '' : '';
  // active spans (gaps up to 15 min) and idle gaps of a set of activity points, as run-log.ts time counts them
  const spansOf = (pts: number[]) => { pts.sort((a, b) => a - b); const spans: { a: number; b: number }[] = [], idle: { a: number; b: number }[] = [];
    for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i]; if (b > a) (b - a > IDLE ? idle : spans).push({ a, b }); }
    return { spans, idle, last: pts.at(-1) }; };
  const cal = readCalibration(runsDir), { snaps, readings, seatAssumed } = readSnaps(runsDir);
  // the calibration's basis phase, counted the way Progress counts it (its run folder's ledger inside its active spans)
  const basisDir = cal && existsSync(runsDir) ? readdirSync(runsDir).find(d => phaseOf(d) === cal.basis && rowsOf(d)) : undefined;
  const files = projectTranscripts(ROOT), local = localRunMessages(files, new Set([...dirs, ...(basisDir ? [basisDir] : [])]));
  const inSpans = (sp: { a: number; b: number }[]) => (m: Msg) => sp.some(x => m.t > x.a && m.t <= x.b);
  const ledger = (d: string, sp: { a: number; b: number }[]) => syncTokens(join(runsDir, d, 'tokens.jsonl'), (local.get(d) ?? []).filter(inSpans(sp)));
  let basisW = cal?.basisWeightedTokens ?? 0;
  if (cal && basisDir) { const sp = activity(join(runsDir, basisDir), rowsOf(basisDir)!, cal.basis).spans, u = zero(); for (const m of ledger(basisDir, sp)) if (inSpans(sp)(m)) addMsg(u, m); basisW = weight(u) || basisW; }
  const rate = cal && basisW ? cal.fiveHourPct * (cal.seat ?? 1) / basisW : null, wr = weeklyRatio(cal, readings), est = estimator(rate, wr.weekRatio);
  const design: Group[] = [], rode: Group[] = [], meta: any[] = [];
  for (const d of dirs) {
    const dir = join(runsDir, d), dd = join(dir, 'design'), rows = rowsOf(d);
    const caps = existsSync(join(dd, 'captures.jsonl')) ? readFileSync(join(dd, 'captures.jsonl'), 'utf8').split('\n').filter(Boolean).flatMap(l => { try { return [JSON.parse(l)]; } catch { return []; } }) : [];
    const pts = activityPoints(dd, ['compare', 'builder', 'reviewer', 'findings'].map(n => join(dd, `${n}.json`)));
    if (!rows) pts.push(...activityPoints(dir), ...caps.map(c => Date.parse(c.t)).filter(Boolean));
    const ds = spansOf(pts), run = rows ? activity(dir, rows, phaseOf(d)) : null;
    const msgs = ledger(d, [...ds.spans, ...(run?.spans ?? [])]);
    design.push({ key: d, spans: ds.spans, idle: ds.idle, msgs });
    if (run) rode.push({ key: d, spans: run.spans, idle: run.idle, msgs });
    meta.push({ id: d, kind: rows ? 'casebook' : 'pass', phase: phaseOf(d), auto: caps.filter(c => c.auto && !(c.part > 1)).length, hand: caps.filter(c => !c.auto && !(c.part > 1)).length,
      live: !!ds.last && Date.now() - ds.last < IDLE, runLive: !!run?.last && Date.now() - run.last < IDLE });
  }
  const ds = spanStats(design, snaps, readings, est), rs = spanStats(rode, snaps, readings, est);
  const runs = meta.map(m => ({ ...m, design: ds.rows.get(m.id) ?? null, run: rs.rows.get(m.id) ?? null })).filter(r => r.design || r.auto || r.hand || r.run);
  const last = readings.at(-1);
  return { built_at: new Date().toISOString(), weights: W, seatAssumed, snapshots: readings.length, outside5: ds.outside5, outsideW: ds.outsideW, approx: ds.approx,
    calibration: cal ? { ...cal, seat: cal.seat ?? 1, basisWt: basisW, rate, weekRatio: wr.weekRatio, weekBasis: wr.weekBasis } : null,
    latest: last ? { at: last.at, seat: last.proMultiplier, fiveHourPct: last.fiveHourPct, weeklyPct: last.weeklyPct } : null, runs };
}

const page = (data: unknown) => readFileSync(join(import.meta.dirname, 'design-page.tpl'), 'utf8')
  .replaceAll('__TITLE__', `${title} Design check`).replace('__DATA__', () => JSON.stringify(data).replace(/</g, '\\u003c'));

if (serve) {
  const portArg = /^\d+$/.test(process.argv[si + 1] ?? '') ? Number(process.argv[si + 1]) : 4493;
  const server = createServer((req, res) => {
    try {
      const url = req.url ?? '/';
      if (url === '/' || url.startsWith('/?')) {
        const html = page({ ...buildData(abs => `files/${encodeURI(relative(ROOT, abs).split('\\').join('/'))}`), usage: usageData(), live: true });
        res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' }); res.end(html); return;
      }
      const ap = url.match(/^\/apply\/(scope|decide)$/);
      if (ap && req.method === 'POST') {
        const local = isLocal(req.socket.remoteAddress);
        const json = (code: number, o: unknown) => { res.writeHead(code, { 'content-type': 'application/json' }); res.end(JSON.stringify(o)); };
        if (!local) { json(403, { error: 'Save works only on the computer running the page.' }); return; }
        const chunks: Buffer[] = [];
        req.on('data', c => chunks.push(c)).on('end', () => {
          const block = Buffer.concat(chunks).toString('utf8');
          if (!block.startsWith(ap[1] === 'scope' ? 'DESIGN SCOPE ' : 'DESIGN DECISIONS ')) { json(400, { error: 'Not a design block.' }); return; }
          const r = spawnSync(process.execPath, [join(import.meta.dirname, 'design.ts'), feature, platform, ap[1]], { input: block, encoding: 'utf8', cwd: ROOT });
          console.log(`apply ${ap[1]}: ${(r.stdout + r.stderr).trim()}`);
          json(r.status === 0 ? 200 : 500, r.status === 0 ? { out: r.stdout, warnings: r.stderr } : { error: (r.stderr || r.stdout).trim() });
        });
        return;
      }
      if (url.startsWith('/usage.json')) { res.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' }); res.end(JSON.stringify(usageData())); return; }
      // images under this feature's folder only
      const f = url.match(/^\/files\/([^?#]+)/);
      if (f) {
        const p = join(ROOT, decodeURIComponent(f[1]));
        if (/\.(png|webp)$/i.test(p) && relative(fdir, p).split(/[\\/]/)[0] !== '..' && existsSync(p)) {
          res.writeHead(200, { 'content-type': /webp$/i.test(p) ? 'image/webp' : 'image/png', 'cache-control': 'max-age=300' }); res.end(readFileSync(p)); return; }
      }
      res.writeHead(404); res.end('Not found');
    } catch (e: any) { res.writeHead(500, { 'content-type': 'text/plain' }); res.end(String(e?.message ?? e)); }
  });
  let port = portArg; const host = lan ? '0.0.0.0' : '127.0.0.1';
  server.on('error', (e: any) => { if (e.code === 'EADDRINUSE' && port < portArg + 60) { port++; server.listen(port, host); } else throw e; });
  server.on('listening', () => {
    console.log(`Design (live): http://127.0.0.1:${port}/  — Ctrl+C to stop`);
    if (!lan) return;
    for (const ifs of Object.values(networkInterfaces())) for (const i of ifs ?? []) if (i.family === 'IPv4' && !i.internal) console.log(`  LAN: http://${i.address}:${port}/`);
    console.log('  Warning: --lan has no auth; anyone on this network can read the page.');
  });
  server.listen(port, host);
} else {
  const out = arg('out') ?? join(table, 'design', 'design.html');
  const data: any = { ...buildData(abs => encodeURI(relative(join(out, '..'), abs).split('\\').join('/'))), usage: usageData() };
  writeFileSync(out, page(data));
  console.log(`${relative(ROOT, out)}: ${data.missing ? 'no design/plan.json yet' : `${data.screens.length} screens`}`);
}
