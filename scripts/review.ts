// Serve the review page for a draft (or for the approved table) and save the reviewed result.
// Usage: node scripts/review.ts <product>/<feature> <ios|android> [--draft <id>] [--port 4387] [--lan]
// Without --draft the approved table itself is opened for editing; saving creates a new version.
// --lan binds 0.0.0.0 so other computers on the network can open the page (no auth); Save is only accepted from this
// computer, others can read, edit in their browser and Copy. Served through scripts/pages.ts, each row links to the
// coverage page, which shows where in the spec the case comes from.
// Save writes library/<product>/<feature>/<platform>/cases.csv (the approved table), archives the previous
// version under history/, updates manifest.json, and regenerates cases.xlsx and cases.html.
// New-case notes (+ Add case opens a free-text box, user 2026-10-28) are not rows: Save appends them to
// library/<product>/<feature>/<platform>/new-case-notes.json with status "open", and the agent turns them into rows in the next
// draft (skill: "New-case notes").
// Open questions (user, 2026-11-04): the page lists the Open questions of requirements.md in a panel above the table and
// marks the rows they touch; answers go to library/<product>/<feature>/question-answers.json through POST /answers
// (scripts/lib/questions.ts), separate from Save, and the agent applies them (skill: "Question answers").
import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { networkInterfaces } from 'node:os';
import { join } from 'node:path';
import { COLUMNS, arg, assertIds, draftsDir, readManifest, readTable, stamp, tableDir, writeJson, writeTable, type Manifest } from './lib/library.ts';
import { renderPage } from './lib/render.ts';
import { parseCsv } from './lib/csv.ts';
import { exportTable } from './lib/exporter.ts';
import { writeFeatureIndex } from './lib/feature-index.ts';
import { parseQuestions, readAnswers, readQuestionsZh, saveAnswers } from './lib/questions.ts';
import { isLocal } from './lib/local.ts';

const [feature, platform] = process.argv.slice(2);
assertIds(feature, platform);
const draftArg = arg('draft');
const firstPort = Number(arg('port') ?? 4387);
let port = firstPort;
const lan = process.argv.includes('--lan'), host = lan ? '0.0.0.0' : '127.0.0.1';
const table = tableDir(feature, platform);
let manifest = readManifest(feature, platform);

let draftId: string, draftDir: string | null, rows: Record<string, string>[], spec: any, requirements = '', plan = '';
let previous: Record<string, Record<string, string>> = {};
// Traditional Chinese reading copy (user, 2026-10-30, REQ-002 of phd/swipe-collage): draft.zh-Hant.csv / cases.zh-Hant.csv,
// same column order as the table with Chinese headers. The page's 中文 mode shows it above the English fields; the
// rows stay English (AGENTS.md), so Save never writes it back.
const ZH_COLS = ['ID', 'Section', 'Precondition', 'Action', 'Expected Result', 'Priority', 'Spec Ref', 'Notes', 'Change', 'Change Reason'];
let zh: Record<string, Record<string, string>> = {};
let qzh: Record<string, string> = {};
function readZh(path: string) {
  if (!existsSync(path)) return {};
  const [, ...body] = parseCsv(readFileSync(path, 'utf8').replace(/^﻿/, ''));
  return Object.fromEntries(body.filter(r => r[0]).map(r => [r[0], Object.fromEntries(ZH_COLS.map((c, i) => [c, r[i] ?? '']))]));
}
// read on every page load, so a draft or table changed on disk shows without restarting the server
function load() {
  manifest = readManifest(feature, platform);
  requirements = ''; plan = '';
  if (draftArg) {
    draftId = draftArg;
    draftDir = join(draftsDir(feature, platform), draftArg);
    if (!existsSync(join(draftDir, 'draft.csv'))) throw new Error(`No draft.csv in ${draftDir}`);
    rows = readTable(join(draftDir, 'draft.csv'));
    spec = JSON.parse(readFileSync(join(draftDir, 'spec.json'), 'utf8'));
    if (existsSync(join(draftDir, 'requirements.md'))) requirements = readFileSync(join(draftDir, 'requirements.md'), 'utf8');
    if (existsSync(join(draftDir, 'update-plan.md'))) plan = readFileSync(join(draftDir, 'update-plan.md'), 'utf8');
  } else {
    if (!manifest) throw new Error(`No approved table for ${feature} / ${platform}; pass --draft <id>.`);
    draftId ??= `edit-${stamp()}`;
    draftDir = null;
    rows = readTable(join(table, 'cases.csv'));
    spec = { title: manifest.title, spec_folder: manifest.spec_folder, spec_files: manifest.spec_files, spec_set_sha256: manifest.spec_set_sha256 };
    if (existsSync(join(table, 'requirements.md'))) requirements = readFileSync(join(table, 'requirements.md'), 'utf8');
  }
  zh = readZh(draftDir ? join(draftDir, 'draft.zh-Hant.csv') : join(table, 'cases.zh-Hant.csv'));
  qzh = readQuestionsZh(draftDir ?? table);
  previous = {};
  if (manifest && existsSync(join(table, 'cases.csv'))) for (const r of readTable(join(table, 'cases.csv'))) previous[r.ID] = r;
}
load();

const page = (local: boolean) => renderPage({
  mode: 'review', save: local, feature, platform, title: spec.title ?? feature, draft: draftId,
  based_on_version: manifest?.version ?? null, version: manifest?.version ?? null, approved_at: manifest?.approved_at ?? null,
  spec_files: spec.spec_files, rows, previous: draftArg ? previous : {}, requirements, update_plan: plan, zh,
  questions: parseQuestions(requirements), answers: readAnswers(feature), questions_zh: qzh,
});

type Note = { id: string; section: string; text: string; at?: string };
async function save(body: { rows: Record<string, string>[]; decisions: unknown[]; summary: string; notes?: Note[] }) {
  const current = readManifest(feature, platform);
  const sameDraft = current?.draft === draftId;
  const version = current ? (sameDraft ? current.version : current.version + 1) : 1;
  const history = current?.history ?? [];
  if (current && !sameDraft && existsSync(join(table, 'cases.csv'))) {
    mkdirSync(join(table, 'history'), { recursive: true });
    copyFileSync(join(table, 'cases.csv'), join(table, 'history', `v${current.version}.csv`));
    if (existsSync(join(table, 'requirements.md'))) copyFileSync(join(table, 'requirements.md'), join(table, 'history', `v${current.version}-requirements.md`));
  }
  const clean = body.rows.map(r => Object.fromEntries(COLUMNS.map(c => [c, String(r[c] ?? '').trim()])));
  writeTable(join(table, 'cases.csv'), COLUMNS, clean);
  if (draftDir && existsSync(join(draftDir, 'requirements.md'))) copyFileSync(join(draftDir, 'requirements.md'), join(table, 'requirements.md'));
  // the control trace (REQ-038) goes with the table, so coverage-page.ts reads the approved one
  if (draftDir && existsSync(join(draftDir, 'control-trace.json'))) copyFileSync(join(draftDir, 'control-trace.json'), join(table, 'control-trace.json'));
  // the Chinese reading copy goes along too; rows edited on the page show their English as newer in 中文 mode
  if (draftDir && existsSync(join(draftDir, 'draft.zh-Hant.csv'))) copyFileSync(join(draftDir, 'draft.zh-Hant.csv'), join(table, 'cases.zh-Hant.csv'));
  if (draftDir && existsSync(join(draftDir, 'questions.zh-Hant.json'))) copyFileSync(join(draftDir, 'questions.zh-Hant.json'), join(table, 'questions.zh-Hant.json'));
  const now = new Date().toISOString();
  const entry = { version, approved_at: now, spec_set_sha256: spec.spec_set_sha256, draft: draftId, cases: clean.length, csv: 'cases.csv', requirements: 'requirements.md' };
  const hist = history.filter(h => h.version !== version).map(h => ({ ...h, csv: `history/v${h.version}.csv`, requirements: `history/v${h.version}-requirements.md` }));
  const m: Manifest = { feature, platform, title: spec.title ?? current?.title ?? feature, version, approved_at: now, draft: draftId,
    spec_folder: spec.spec_folder ?? current?.spec_folder, spec_files: spec.spec_files, spec_set_sha256: spec.spec_set_sha256, cases: clean.length, history: [...hist, entry] };
  writeJson(join(table, 'manifest.json'), m);
  const logDir = draftDir ?? join(table, 'history');
  const notes = (body.notes ?? []).filter(n => n.text?.trim());
  writeJson(join(logDir, draftDir ? 'decisions.json' : `${draftId}-decisions.json`), { saved_at: now, version, decisions: body.decisions, summary: body.summary, notes });
  const notesFile = join(table, 'new-case-notes.json');
  if (notes.length) {
    const old = existsSync(notesFile) ? JSON.parse(readFileSync(notesFile, 'utf8')) : { notes: [] };
    old.notes.push(...notes.map(n => ({ ...n, text: n.text.trim(), saved_at: now, saved_with: `v${version}`, draft: draftId, status: 'open' })));
    writeJson(notesFile, old);
  }
  const out = await exportTable(feature, platform);
  writeFeatureIndex(feature);
  return { ...out, version, cases: clean.length, csv: join(table, 'cases.csv'), notes: notes.length, notes_file: notes.length ? notesFile : '' };
}

const server = createServer(async (req, res) => {
  try {
    const local = isLocal(req.socket.remoteAddress);
    if (req.method === 'GET' && (req.url === '/' || req.url?.startsWith('/?'))) {
      load(); res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' }); res.end(page(local)); return;
    }
    if (req.method === 'POST' && req.url === '/save') {
      if (!local) { res.writeHead(403, { 'content-type': 'application/json' }); res.end(JSON.stringify({ error: 'Save works only on the computer running scripts/review.ts.' })); return; }
      let raw = ''; for await (const c of req) raw += c;
      const result = await save(JSON.parse(raw));
      console.log(`Saved version ${result.version}: ${result.cases} cases → ${result.csv}${result.notes ? ` · ${result.notes} new-case notes → ${result.notes_file}` : ''}`);
      res.writeHead(200, { 'content-type': 'application/json' }); res.end(JSON.stringify(result)); return;
    }
    if (req.method === 'POST' && req.url === '/answers') {
      if (!local) { res.writeHead(403, { 'content-type': 'application/json' }); res.end(JSON.stringify({ error: 'Answers are saved only on the computer running scripts/review.ts.' })); return; }
      let raw = ''; for await (const c of req) raw += c;
      const result = saveAnswers(feature, platform, JSON.parse(raw));
      console.log(`Saved question answers → ${result.file}`);
      res.writeHead(200, { 'content-type': 'application/json' }); res.end(JSON.stringify(result)); return;
    }
    res.writeHead(404); res.end('Not found');
  } catch (e: any) {
    console.error(e);
    res.writeHead(500, { 'content-type': 'application/json' }); res.end(JSON.stringify({ error: String(e?.message ?? e) }));
  }
});
server.on('error', (e: any) => {
  // the next free port, up to 60 above the one asked for (pages.ts asks for 4487; several pages servers share the range)
  if (e.code === 'EADDRINUSE' && port < firstPort + 60) { port++; server.listen(port, host); } else throw e;
});
server.listen(port, host);
server.on('listening', () => {
  console.log(`Review ${feature} / ${platform} (${draftId}): http://127.0.0.1:${port}/  — Ctrl+C to stop`);
  if (!lan) return;
  for (const ifs of Object.values(networkInterfaces())) for (const i of ifs ?? []) if (i.family === 'IPv4' && !i.internal) console.log(`  LAN: http://${i.address}:${port}/`);
  console.log('  Warning: --lan has no auth; anyone on this network can read the page. Save is accepted from this computer only.');
});
