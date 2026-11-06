// What the pages server knows about the library without opening a table: the navigation page's list (a few small
// files per table, no CSV is read), which run plan a table's Progress tab shows, and which drafts are still open.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { readRecords } from './csv.ts';
import { LIBRARY, PLATFORMS, draftsDir, listFeatures, readManifest, tableDir } from './library.ts';
import { parseQuestions, readAnswers } from './questions.ts';

const NAMES: Record<string, string> = { pdr: 'PowerDirector', phd: 'PhotoDirector' };
const names = (dir: string) => existsSync(dir) ? readdirSync(dir).sort() : [];
const json = (file: string) => { try { return JSON.parse(readFileSync(file, 'utf8')); } catch { return null; } };

/** A table's run plan: the newest RUN-PLAN and the newest draft with a phases.json. */
export function newestPlan(feature: string, platform: string): { md?: string; draft?: string } {
  const runs = join(tableDir(feature, platform), 'runs'), drafts = draftsDir(feature, platform);
  const md = names(runs).filter(n => /^RUN-PLAN-.*\.md$/.test(n)).at(-1);
  return { md: md && join(runs, md), draft: names(drafts).filter(n => existsSync(join(drafts, n, 'phases.json'))).at(-1) };
}

/** Drafts still waiting for a Save, oldest first: newer than the last one saved (ids sort by time; an older unsaved one was left behind). */
export function openDrafts(feature: string, platform: string): string[] {
  const m = readManifest(feature, platform), dir = draftsDir(feature, platform);
  const last = [m?.draft, ...(m?.history ?? []).map(h => h.draft)].filter(d => d && !d.startsWith('edit-')).sort().at(-1) ?? '';
  return names(dir).filter(n => n > last && existsSync(join(dir, n, 'draft.csv')));
}

export const hasDraft = (feature: string, platform: string, draft: string) => /^[\w.-]+$/.test(draft) && existsSync(join(draftsDir(feature, platform), draft, 'draft.csv'));

const runCount = (feature: string, platform: string) => {
  const dir = join(tableDir(feature, platform), 'runs');
  return names(dir).filter(n => { try { return statSync(join(dir, n)).isDirectory(); } catch { return false; } }).length;
};

// a file's reading, kept until the file changes: the navigation page asks on every view
const memo = new Map<string, { key: string; value: any }>();
function byFile<T>(file: string, read: () => T): T | null {
  let st; try { st = statSync(file); } catch { return null; }
  const key = `${st.mtimeMs}|${st.size}`, was = memo.get(file);
  if (was?.key === key) return was.value;
  const value = read(); memo.set(file, { key, value }); return value;
}

/** The table's latest run: the one whose results.csv changed last, each case counted at its newest result. */
export function lastRun(feature: string, platform: string) {
  const dir = join(tableDir(feature, platform), 'runs');
  const csv = names(dir).map(n => join(dir, n, 'results.csv')).filter(existsSync).sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs)[0];
  if (!csv) return null;
  const tally = byFile(csv, () => {
    const latest = new Map<string, { at: number; result: string }>();
    for (const r of readRecords(readFileSync(csv, 'utf8'))) { const at = Date.parse(r['Recorded At']) || 0; if (r.ID && (latest.get(r.ID)?.at ?? -1) <= at) latest.set(r.ID, { at, result: r.Result ?? '' }); }
    const n = (re: RegExp) => [...latest.values()].filter(x => re.test(x.result)).length;
    return { total: latest.size, pass: n(/^pass/i), fail: n(/^fail/i), blocked: n(/^block/i) };
  });
  const at = statSync(csv).mtime;
  return { id: csv.split('/').at(-2)!, at: at.toISOString(), live: Date.now() - at.getTime() < 20 * 60_000, ...tally };
}

/** What waits on a person: questions nobody answered, answers and new-case notes the agent has not applied. */
export function waiting(feature: string, platform: string, draft?: string) {
  const dir = draft ? join(draftsDir(feature, platform), draft) : tableDir(feature, platform);
  const questions = byFile(join(dir, 'requirements.md'), () => parseQuestions(readFileSync(join(dir, 'requirements.md'), 'utf8')).map(q => q.id)) ?? [];
  const answers = readAnswers(feature);
  const notes = byFile(join(tableDir(feature, platform), 'new-case-notes.json'), () => (json(join(tableDir(feature, platform), 'new-case-notes.json'))?.notes ?? []).filter((n: any) => n.status === 'open').length) ?? 0;
  return { questions: questions.filter(id => !answers[id]).length, answers: questions.filter(id => answers[id]?.status === 'open').length, notes };
}

export function listBoards() {
  const products = new Map<string, { id: string; name: string; features: unknown[] }>();
  for (const id of listFeatures()) {
    const product = id.split('/')[0];
    if (!products.has(product)) products.set(product, { id: product, name: json(join(LIBRARY, product, 'product.json'))?.name ?? NAMES[product] ?? product, features: [] });
    let title = '';
    // a table being saved right now (a half-written file) sits out this view; the rest of the list still shows
    const platforms = PLATFORMS.filter(p => existsSync(tableDir(id, p))).flatMap(platform => { try {
      const m = readManifest(id, platform), drafts = openDrafts(id, platform), plan = newestPlan(id, platform);
      title ||= m?.title ?? json(join(draftsDir(id, platform), drafts.at(-1) ?? '', 'spec.json'))?.title ?? '';
      return [{ platform, version: m?.version ?? null, cases: m?.cases ?? null, approved_at: m?.approved_at ?? null, drafts, plan: !!(plan.md && plan.draft), runs: runCount(id, platform), last: lastRun(id, platform), waiting: waiting(id, platform, m ? undefined : drafts.at(-1)) }];
    } catch { return []; } }).filter(p => p.version || p.drafts.length);
    if (platforms.length) products.get(product)!.features.push({ id, title: title || id.split('/')[1], platforms });
  }
  return [...products.values()].filter(p => p.features.length);
}
