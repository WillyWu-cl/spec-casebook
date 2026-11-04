// Check a branch before pushing it or opening a PR (README › Before you push or open a PR).
// Usage: node scripts/pr-check.ts [--base origin/main] [--no-fetch]
// Compares HEAD with the base branch and exits 1 on a blocker: merge conflicts, files .gitignore keeps local, large
// files, likely secrets, an approved table both sides changed, request IDs main already uses, folders outside the
// library layout, .codex/skills edited without .claude/skills, or cases.csv changed without a review-page Save.
import { execFileSync } from 'node:child_process';
import { arg, ROOT } from './lib/library.ts';

const base = arg('base', process.argv) ?? 'origin/main';
const git = (...a: string[]) => execFileSync('git', a, { cwd: ROOT, encoding: 'utf8', maxBuffer: 256 << 20 });
const tryGit = (...a: string[]) => { try { return git(...a); } catch (e: any) { return e.stdout ?? ''; } };
const lines = (s: string) => s.split('\n').filter(Boolean);

if (!process.argv.includes('--no-fetch')) {
  try { git('fetch', '--quiet', base.split('/')[0], base.split('/').slice(1).join('/')); }
  catch { console.log(`! Could not fetch ${base}; checking against the local copy.`); }
}

const blockers: string[] = [];
const warnings: string[] = [];
const mergeBase = git('merge-base', base, 'HEAD').trim();
const changed = lines(git('diff', '--name-only', '--diff-filter=AMR', mergeBase, 'HEAD'));
const touched = lines(git('diff', '--name-only', mergeBase, 'HEAD'));
const mainChanged = new Set(lines(git('diff', '--name-only', mergeBase, base)));

// 1. Up to date with main, no conflicts
const behind = Number(git('rev-list', '--count', `HEAD..${base}`).trim());
if (behind) {
  const tree = tryGit('merge-tree', '--write-tree', '--name-only', '--no-messages', base, 'HEAD');
  const conflicts = lines(tree).slice(1);
  if (conflicts.length) blockers.push(`Conflicts with ${base} in ${conflicts.length} file(s); rebase on it first:\n    ${conflicts.join('\n    ')}`);
  else warnings.push(`${behind} commit(s) behind ${base}; rebase before opening the PR.`);
}

// 2. Files .gitignore keeps local (force-added) and large files
const ignored = changed.length ? lines(tryGit('check-ignore', '--no-index', ...changed.slice(0, 5000))) : [];
if (ignored.length) blockers.push(`Files .gitignore keeps local (images, spec originals, logs, review pages…) were committed:\n    ${ignored.join('\n    ')}`);
const LARGE = 5 << 20;
for (const f of changed) {
  const size = Number(tryGit('cat-file', '-s', `HEAD:${f}`).trim() || 0);
  if (size > LARGE) blockers.push(`${f} is ${(size / 1048576).toFixed(1)} MB (over 5 MB); keep it local or summarise it.`);
}

// 3. Likely secrets in added lines
const SECRET = /(gh[pousr]_[A-Za-z0-9]{30,}|sk-[A-Za-z0-9_-]{30,}|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----|figd_[A-Za-z0-9_-]{20,}|(?:password|passwd|api[_-]?key|access[_-]?token|secret)["']?\s*[:=]\s*["'][^"'\s]{8,})/i;
let file = '';
for (const l of lines(git('diff', '-U0', mergeBase, 'HEAD'))) {
  if (l.startsWith('+++ ')) file = l.slice(6);
  else if (l.startsWith('+') && SECRET.test(l)) blockers.push(`Possible credential in ${file}: ${l.slice(1, 120).trim()}`);
}

// 4. Approved tables: both sides changed one, or cases.csv changed without a Save
const tables = new Set(touched.filter(f => /^library\/[^/]+\/[^/]+\/(ios|android)\/(cases\.csv|manifest\.json)$/.test(f)).map(f => f.replace(/\/[^/]+$/, '')));
for (const t of tables) {
  if (mainChanged.has(`${t}/manifest.json`) || mainChanged.has(`${t}/cases.csv`)) {
    const v = (ref: string) => { try { return JSON.parse(git('show', `${ref}:${t}/manifest.json`)).version; } catch { return '?'; } };
    blockers.push(`${t}: ${base} approved v${v(base)} of this table after the branch started (the branch has v${v('HEAD')}). Take ${base}'s cases.csv and manifest.json, rebuild the draft on it and Save it again on the review page (it becomes v${Number(v(base)) + 1}).`);
  }
  if (touched.includes(`${t}/cases.csv`) && !touched.includes(`${t}/manifest.json`))
    blockers.push(`${t}/cases.csv changed without manifest.json: approved tables change only through the review page's Save.`);
}

// 5. Request IDs main already uses
for (const f of touched.filter(f => f.endsWith('/requests.md'))) {
  const ids = (ref: string) => { try { return new Map(lines(git('show', `${ref}:${f}`)).filter(l => /^\| REQ-\d+ /.test(l)).map(l => [l.split('|')[1].trim(), l])); } catch { return new Map<string, string>(); } };
  const mine = ids('HEAD'), theirs = ids(base), before = ids(mergeBase);
  for (const [id, row] of mine) if (!before.has(id) && theirs.has(id) && theirs.get(id) !== row)
    blockers.push(`${f}: ${id} is already used on ${base} for another request; renumber yours after the last ID there.`);
}

// 6. Library layout: library/<product>/<feature>/… or a knowledge/ folder
const products = new Set(lines(git('ls-tree', '-d', '--name-only', `${base}:library`)));
for (const f of changed.filter(f => f.startsWith('library/'))) {
  const [, product, second, third] = f.split('/');
  if (!third) continue;                                   // library/<product>/product.json and the like
  if (second === 'knowledge' || product === 'knowledge') continue;
  const featureFiles = lines(tryGit('ls-tree', '--name-only', `HEAD:library/${product}/${second}`));
  if (!featureFiles.some(n => ['ios', 'android', 'specs'].includes(n)))
    blockers.push(`library/${product}/${second}/ is not a feature (no ios/, android/ or specs/) nor knowledge/; product facts go in library/${product}/knowledge/ (domain-knowledge skill).`);
  if (!products.has(product)) warnings.push(`New product folder library/${product}/; check it is the product's agreed slug.`);
}

// 7. Skills edited in .codex only
const codexOnly = touched.filter(f => f.startsWith('.codex/skills/') && !touched.includes(f.replace(/^\.codex/, '.claude')));
if (codexOnly.length) blockers.push(`.codex/skills changed without .claude/skills (edit .claude/skills, then node scripts/sync-skills.ts):\n    ${codexOnly.join('\n    ')}`);

const uniq = (a: string[]) => [...new Set(a)];
for (const b of uniq(blockers)) console.log(`✗ ${b}`);
for (const w of uniq(warnings)) console.log(`! ${w}`);
console.log(blockers.length ? `\n${uniq(blockers).length} blocker(s): fix them before pushing.` : `\nReady to push (${changed.length} file(s) against ${base}).`);
process.exit(blockers.length ? 1 : 0);
