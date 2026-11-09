// One server for the live pages of every table: `/` is the navigation page (choose a product, feature and platform; user,
// 2026-11-06) and each table has Cases (the review page), Progress (the run plan), Results (every run's cases with
// screenshots and reasons), Coverage and Design (the design check) under /<product>/<feature>/<platform>/<page>/, with a
// tab bar on top, so one command (and one address, also over the LAN) opens them all and they link to each other (a row
// on Cases opens …/coverage/#case=TC-012; a case on Coverage opens …/cases/#TC-012). A draft's pages are under
// /<product>/<feature>/<platform>/draft/<id>/<page>/.
// Usage: node scripts/pages.ts [--lan [--passcode <code>]] [--port 4386] [--idle <minutes, default 10>]
//        node scripts/pages.ts <product>/<feature> <ios|android> [--draft <id>] [--plan <RUN-PLAN.md>] [--plan-draft <id>] [--lan]
//   With a feature it prints that table's address (and old /cases/-style links go there); the server is the same one.
//   --draft       the draft to review (and to show on the coverage page); without it, the approved table
//   --plan        the run plan; default the newest runs/RUN-PLAN-*.md
//   --plan-draft  the draft whose phases.json the plan uses; default the newest draft that has one
// One server is enough: when one already runs, a second start prints the address and exits (a new --plan is handed over).
// Only what is open runs (user, 2026-11-06): the server itself holds no table. A page's process starts on its first
// visit and stops after IDLE_MS without a request (open pages wake it on their next look; a hidden tab does not look);
// at most MAX_LIVE run at once, the least recently used stops first. What the pages leave on disk is cleared by
// lib/housekeeping.ts at start and daily.
// No restart needed after changes: a change under scripts/ stops the running pages (they start again from the new code
// on the next request; a new run plan or draft is picked up then too) and offers open pages a Reload button; a change
// under library/<product>/<feature>/ makes open pages ask whether what they show changed, and only then Progress, Results,
// Coverage and Design redraw in place (keeping filters, open items and scroll) while Cases offers the Reload button
// (unsaved review edits are never lost). Only a change to this file or lib/boards.ts needs Ctrl+C and a new start.
// Shared look: scripts/page-shared.css.tpl and page-shared.js.tpl (palette, Taipei times, the usage strip).
// Each page runs as its own server (review.ts, plan-page.ts --serve, results-page.ts --serve, coverage-page.ts --serve) on a loopback port,
// and this one forwards to it, adding the tab bar. --lan binds this server to 0.0.0.0, the children stay on 127.0.0.1;
// other computers enter the passcode first (lib/passcode.ts: printed at start, or --passcode). Review Save is only
// accepted from this computer.
import { spawn, type ChildProcess } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, watch } from 'node:fs';
import { createServer, request } from 'node:http';
import { networkInterfaces } from 'node:os';
import { join } from 'node:path';
import { createGzip, gzipSync } from 'node:zlib';
import { hasDraft, listBoards, newestPlan, openDrafts } from './lib/boards.ts';
import { housekeeping } from './lib/housekeeping.ts';
import { LIBRARY, PLATFORMS, arg, assertIds, readManifest, tableDir } from './lib/library.ts';
import { isLocal } from './lib/local.ts';
import { COOKIE, attempts, hasSession, makePasscode, passcodeMatches, safeNext, sessionOf } from './lib/passcode.ts';
import { withShared } from './lib/page-shared.ts';

const IDLE_MS = Number(arg('idle') ?? 10) * 60_000, MAX_LIVE = 12;
const argv = process.argv.slice(2), lan = argv.includes('--lan');
const [cliFeature, cliPlatform] = argv.filter((a, i) => !a.startsWith('--') && !['--draft', '--plan', '--plan-draft', '--port', '--idle', '--passcode'].includes(argv[i - 1]));
if (cliFeature) assertIds(cliFeature, cliPlatform);

type Ref = { feature: string; platform: string; draft?: string };
const script = (name: string) => join(import.meta.dirname, name);
const base = (r: Ref) => `/${r.feature}/${r.platform}${r.draft ? `/draft/${r.draft}` : ''}`;
// a run plan other than the newest, named on a command line
const plans = new Map<string, { md?: string; draft?: string }>();
const planOf = (r: Ref) => { const auto = newestPlan(r.feature, r.platform), o = plans.get(`${r.feature}|${r.platform}`); return { md: o?.md ?? auto.md, draft: o?.draft ?? auto.draft }; };
if (cliFeature && (arg('plan') || arg('plan-draft'))) plans.set(`${cliFeature}|${cliPlatform}`, { md: arg('plan'), draft: arg('plan-draft') });
const cli: Ref | null = cliFeature ? { feature: cliFeature, platform: cliPlatform, draft: arg('draft') } : null;
if (cli?.draft && !hasDraft(cli.feature, cli.platform, cli.draft)) throw new Error(`No draft ${cli.draft} for ${cli.feature} / ${cli.platform}.`);

type Def = { id: string; path: string; label: string; zh: string; draft?: boolean; argv: (r: Ref) => string[] | null; why?: string };
const withDraft = (r: Ref) => r.draft ? ['--draft', r.draft] : [];
const defs: Def[] = [
  { id: 'review', path: 'cases', label: 'Cases', zh: '案例', draft: true, argv: r => [script('review.ts'), r.feature, r.platform, ...withDraft(r), '--port', '4487'] },
  { id: 'plan', path: 'progress', label: 'Progress', zh: '進度',
    argv: r => { const p = planOf(r); return p.md && p.draft ? [script('plan-page.ts'), r.feature, r.platform, p.draft, p.md, '--serve', '4490'] : null; },
    why: `No run plan: needs a runs/RUN-PLAN-*.md and a draft with phases.json (or --plan and --plan-draft).` },
  { id: 'results', path: 'results', label: 'Results', zh: '結果', argv: r => [script('results-page.ts'), r.feature, r.platform, '--serve', '4492'] },
  { id: 'coverage', path: 'coverage', label: 'Coverage', zh: '覆蓋率', draft: true, argv: r => [script('coverage-page.ts'), r.feature, r.platform, ...withDraft(r), '--serve', '4491'] },
  // the design check (figma skill, references/conformance.md): Figma screens against the app's captures
  { id: 'design', path: 'design', label: 'Design', zh: '設計比對', argv: r => [script('design-page.ts'), r.feature, r.platform, '--serve', '4493'] },
];
// read on every page view: an approved table's version moves on while this server keeps running
const reviewOf = (r: Ref) => r.draft ? ` · draft ${r.draft}` : ` · v${readManifest(r.feature, r.platform)?.version ?? '?'}`;

// A running page. Pages that do not show a draft are the same process for a table and its drafts.
type Child = { key: string; def: Def; ref: Ref; port?: number; proc?: ChildProcess; error?: string; starting?: Promise<void>; used: number };
const children = new Map<string, Child>();
const childOf = (def: Def, ref: Ref) => {
  const key = `${def.id}|${ref.feature}|${ref.platform}|${def.draft ? ref.draft ?? '' : ''}`;
  let c = children.get(key);
  if (!c) children.set(key, c = { key, def, ref: def.draft ? ref : { feature: ref.feature, platform: ref.platform }, used: 0 });
  return c;
};
const live = () => [...children.values()].filter(c => c.proc);
const stopChild = (c: Child) => { const p = c.proc; c.proc = undefined; c.port = undefined; p?.kill(); };

// start a child and read its address from the line it prints (it takes the next free port when one is busy)
function start(c: Child) {
  const args = c.def.argv(c.ref);
  c.error = undefined;
  if (!args) { c.error = c.def.why; return Promise.resolve(); }
  const others = live().sort((a, b) => a.used - b.used);
  while (others.length >= MAX_LIVE) stopChild(others.shift()!);
  return new Promise<void>(done => {
    const proc = spawn(process.execPath, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    c.proc = proc;
    let err = '';
    proc.stdout!.on('data', b => { const m = String(b).match(/http:\/\/127\.0\.0\.1:(\d+)\//); if (m && c.proc === proc && !c.port) { c.port = +m[1]; done(); } });
    proc.stderr!.on('data', b => { err += b; process.stderr.write(`[${c.key}] ${b}`); });
    // stopped on purpose (idle, code change) or replaced: nothing to report, the next request starts it again
    proc.on('exit', code => { if (c.proc !== proc) { done(); return; } c.proc = undefined; const was = c.port; c.port = undefined; c.error = `${c.def.label} ${was ? 'stopped' : 'did not start'} (exit ${code}): ${err.trim().split('\n').slice(-3).join(' ')}`; done(); });
  });
}
const ensure = (c: Child) => { c.used = Date.now(); return c.port ? Promise.resolve() : c.starting ??= start(c).finally(() => { c.starting = undefined; }); };
setInterval(() => { const now = Date.now(); for (const c of live()) if (now - c.used > IDLE_MS) { console.log(`idle: stopped ${c.key}`); stopChild(c); } }, Math.min(60_000, IDLE_MS / 2)).unref();
const stop = () => { for (const c of live()) stopChild(c); };

// what answers on a port: nothing (null), a casebook server (its /__hub reply) or something else ({})
const hubAt = (port: number, query = '') => new Promise<any>(ok => {
  const r = request({ host: '127.0.0.1', port, path: `/__hub${query}`, timeout: 800 }, up => { let s = ''; up.on('data', x => s += x); up.on('end', () => { try { ok(JSON.parse(s)); } catch { ok({}); } }); });
  r.on('error', () => ok(null)); r.on('timeout', () => { r.destroy(); ok({}); }); r.end();
});
const lanLines = (port: number) => Object.entries(networkInterfaces()).flatMap(([name, ifs]) => (ifs ?? [])
  // one address per network this computer is on (Wi-Fi and Ethernet are often different subnets): the other computer
  // opens the one on its own network; a self-assigned 169.254 address is no network
  .filter(i => i.family === 'IPv4' && !i.internal && !i.address.startsWith('169.254.'))
  .map(i => `  LAN: http://${i.address}:${port}/`.padEnd(36) + ` (${name}, for computers on ${i.cidr ?? i.address})`));
const FIRST_PORT = 4386, LAST_PORT = 4396;
let port = Number(arg('port') ?? FIRST_PORT);
if (!arg('port')) {
  const ports = Array.from({ length: LAST_PORT - FIRST_PORT + 1 }, (_, i) => FIRST_PORT + i);
  const seen = await Promise.all(ports.map(async p => ({ p, hub: await hubAt(p) })));
  // a server already running here takes over: it is told the run plan, and this start ends
  const found = seen.find(x => x.hub?.casebook && (x.hub.lan || !lan));
  if (found) {
    if (cli && (arg('plan') || arg('plan-draft'))) await hubAt(found.p, `?${new URLSearchParams({ feature: cli.feature, platform: cli.platform, plan: arg('plan') ?? '', planDraft: arg('plan-draft') ?? '' })}`);
    console.log(`Casebook pages are already running: http://127.0.0.1:${found.p}${cli ? `${base(cli)}/cases/` : '/'}`);
    if (found.hub.lan) { for (const l of lanLines(found.p)) console.log(l); if (found.hub.passcode) console.log(`  Passcode for other computers: ${found.hub.passcode}`); }
    if (arg('passcode') && arg('passcode') !== found.hub.passcode) console.log('  --passcode ignored: the running server keeps its own. Stop it and start again to change it.');
    process.exit(0);
  }
  // the first port nothing answers on: listening alone is not enough, macOS lets 127.0.0.1:<port> sit beside a --lan
  // server's 0.0.0.0:<port> and take this computer's requests from it
  port = seen.find(x => !x.hub)?.p ?? port;
}
if (arg('passcode') && !lan) console.log('--passcode only applies with --lan: this server is for this computer alone.');
const passcode = lan ? arg('passcode') ?? makePasscode() : null, session = passcode ? sessionOf(passcode) : '', tries = attempts();
const clean = () => { const { files, bytes } = housekeeping(); if (files) console.log(`Cleared ${files} old page files (${Math.round(bytes / 1e6)} MB).`); };
clean(); setInterval(clean, 24 * 3_600_000).unref();

// Live updates (user, 2026-10-29; in place, 2026-11-05). `stamp` changes whenever what a page shows may have changed
// (a file under the feature), `codeStamp` when the scripts did (the pages restarted). They are pushed to the tab bar
// over /__events (one open tab holds the connection and passes them on, so tabs do not use up the browser's six
// connections to this address; where it cannot, e.g. over --lan, the tab bar polls /__stamp every 3 s); on a new stamp
// it asks /<page>/__check whether its page changed (below) and redraws or offers Reload only if so.
const started = Date.now(), touched = new Map<string, number>();
let codeStamp = started;
const stampOf = (feature: string) => touched.get(feature) ?? started;
const listeners = new Set<import('node:http').ServerResponse>();
const stamps = () => JSON.stringify({ code: codeStamp, stamps: Object.fromEntries(touched) });
const tell = () => { for (const r of listeners) r.write(`data: ${stamps()}\n\n`); };
setInterval(() => { for (const r of listeners) r.write(': ping\n\n'); }, 30_000).unref();
const debounce = (ms: number, f: (names: string[]) => void) => { let t: NodeJS.Timeout | undefined, names: string[] = [];
  return (_: string, name: string | null) => { if (name) names.push(name); clearTimeout(t); t = setTimeout(() => { const n = names; names = []; f(n); }, ms); }; };
watch(import.meta.dirname, { recursive: true }, debounce(400, names => {
  if (names.every(n => /^(pages\.ts|lib\/boards\.ts)$/.test(n))) { console.log(`${names[0]} changed: Ctrl+C and start it again to use the new version.`); return; }
  console.log(`scripts changed (${[...new Set(names)].slice(0, 3).join(', ')}): stopping the running pages, they start again when asked for`);
  stop();
  codeStamp = Date.now(); tell();
}));
// One watch on the whole library, whichever tables are open. tokens.jsonl is topped up by the Progress page's own
// builds: Progress re-checks every 10 s anyway, and counting it here would make every page re-check after each of them
if (existsSync(LIBRARY)) watch(LIBRARY, { recursive: true }, debounce(1500, names => {
  const features = new Set(names.filter(n => !n.endsWith('tokens.jsonl') && !n.endsWith('.DS_Store')).map(n => n.split('/').slice(0, 2).join('/')).filter(f => f.includes('/') && !f.endsWith('/knowledge')));
  if (!features.size) return;
  const now = Date.now();
  for (const f of features) touched.set(f, now);
  // a new run plan or draft: Progress starts again from it when it is next asked for
  for (const c of live()) if (c.def.id === 'plan' && features.has(c.ref.feature) && c.def.argv(c.ref)?.join(' ') !== c.proc?.spawnargs.slice(1).join(' ')) { console.log(`run plan changed for ${c.ref.feature} / ${c.ref.platform}`); stopChild(c); }
  tell();
}));
process.on('exit', stop);
for (const s of ['SIGINT', 'SIGTERM', 'SIGHUP'] as const) process.once(s, () => process.exit(0));

// The tab bar goes in right after <body>; window.CASEBOOK tells each page where the others are, so they can link, and
// which language to show. The bar is the same on every page and holds the one language switch (user, 2026-10-28):
// the choice is kept per browser (localStorage casebook-lang) and sent to the page as a `casebook-lang` event, so the
// pages drop their own switches when served here (their static .html files keep them).
const esc = (s: string) => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));
const tx = (en: string, zh: string) => `<span data-en="${esc(en)}" data-zh="${esc(zh)}">${esc(en)}</span>`;
const tabName = (d: Def, r: Ref) => d.id === 'review' ? tx(`${d.label}${reviewOf(r)}`, `${d.zh}${reviewOf(r).replace('draft', '草稿')}`) : tx(d.label, d.zh);
const platformName = (p: string) => p === 'ios' ? 'iOS' : 'Android';
// a tab is a link unless the page cannot open: no run plan yet, or it failed the last time it was started
const problem = (d: Def, r: Ref) => (d.id === 'plan' && !d.argv(r) ? d.why : undefined) ?? (({ proc, error }) => proc ? undefined : error)(childOf(d, r));
// the same page on the table's other platform: its draft of the same id if it has one, else the approved table, else its newest draft
const otherPlatform = (r: Ref, path: string) => { const p = PLATFORMS.find(x => x !== r.platform)!;
  const draft = r.draft && hasDraft(r.feature, p, r.draft) ? r.draft : readManifest(r.feature, p) ? undefined : openDrafts(r.feature, p).at(-1);
  return draft || readManifest(r.feature, p) ? `${base({ ...r, platform: p, draft })}/${path}/` : ''; };
// iOS | Android beside the language switch, the table's platform lit like the language (user, 2026-11-06)
const platformSwitch = (r: Ref, path: string) => { const other = otherPlatform(r, path);
  return `<span class="cb-lang cb-pf" role="group" aria-label="Platform">${PLATFORMS.map(p => p === r.platform ? `<span aria-current="true">${platformName(p)}</span>` : other ? `<a href="${other}">${platformName(p)}</a>` : `<span class="no" title="${esc(`No ${platformName(p)} table`)}">${platformName(p)}</span>`).join('')}</span>`; };
const barCss = `<style>
.cb-tabs{display:flex;flex-wrap:wrap;align-items:center;gap:4px 6px;padding:6px 12px;background:#1d2733;color:#c9d3dd;font:500 13px/1.4 system-ui,-apple-system,"Segoe UI","PingFang TC",sans-serif;border-bottom:1px solid #2f3b4a;box-sizing:border-box}
.cb-tabs b{font-weight:650;color:#fff}
.cb-tabs .cb-home::before{content:"‹ "}
.cb-tabs .cb-pf a,.cb-tabs .cb-pf span{font-size:12px;font-weight:600;line-height:1;padding:5px 10px;border-radius:0;color:#c9d3dd}
.cb-tabs .cb-pf a:hover{background:#2c3a4a;color:#fff}
.cb-tabs .cb-pf [aria-current]{background:#3d6fd9;color:#fff}
.cb-tabs .cb-pf .no{opacity:.45;cursor:not-allowed}
.cb-tabs .cb-sep{width:1px;height:18px;background:#3a4a5c;margin:0 6px}
.cb-tabs a,.cb-tabs span.off{padding:4px 12px;border-radius:6px;color:#c9d3dd;text-decoration:none}
.cb-tabs a:hover{background:#2c3a4a;color:#fff}
.cb-tabs a[aria-current="page"]{background:#3d6fd9;color:#fff}
.cb-tabs span.off{opacity:.45;cursor:not-allowed}
.cb-tabs .cb-note{margin-left:auto;font-size:12px;opacity:.7}
.cb-tabs .cb-lang{display:inline-flex;border:1px solid #3a4a5c;border-radius:6px;overflow:hidden;margin-left:8px}
.cb-tabs .cb-lang button{font-family:inherit;font-size:12px;font-weight:600;line-height:1;border:0;background:transparent;color:#c9d3dd;padding:5px 10px;cursor:pointer}
.cb-tabs .cb-lang button[aria-pressed="true"]{background:#3d6fd9;color:#fff}
.cb-tabs .cb-upd{font:inherit;font-size:12px;font-weight:600;border:0;border-radius:6px;background:#e0a526;color:#1d2733;padding:4px 10px;cursor:pointer;margin-left:8px}
.cb-tabs .cb-upd[hidden]{display:none}
@media print{.cb-tabs{display:none}}
</style>`;
const shareNote = () => lan ? tx('Shared on the network', '已在區域網路分享') : tx('This computer only', '僅限本機');
const tabBar = (r: Ref, current: string, version = '') => {
  const links = Object.fromEntries(defs.filter(d => !problem(d, r)).map(d => [d.id, `${base(r)}/${d.path}/`]));
  const path = defs.find(d => d.id === current)!.path;
  return `${barCss}<nav class="cb-tabs" aria-label="Casebook pages"><a class="cb-home" href="/">${tx('All features', '全部功能')}</a><b>${esc(r.feature)}</b><span class="cb-sep"></span>${defs.map(d => { const why = problem(d, r); return why
    ? `<span class="off" title="${esc(why)}">${tabName(d, r)}</span>`
    : `<a href="${base(r)}/${d.path}/"${d.id === current ? ' aria-current="page"' : ''}>${tabName(d, r)}</a>`; }).join('')}<button type="button" class="cb-upd" hidden>${current === 'review' ? tx('Files changed · Reload (unsaved edits are lost)', '檔案已更新 · 重新載入（未儲存的修改會遺失）') : tx('Updated · Reload', '已更新 · 重新載入')}</button><span class="cb-note">${shareNote()}</span>${platformSwitch(r, path)}<span class="cb-lang" role="group" aria-label="Language"><button type="button" data-l="en">English</button><button type="button" data-l="zh">中文</button></span></nav>
<script>(()=>{let l='en';try{if(localStorage.getItem('casebook-lang')==='zh')l='zh'}catch(e){}
window.CASEBOOK=Object.assign(${JSON.stringify({ pages: links, current })},{lang:l});
const n=document.currentScript.previousElementSibling,b=getComputedStyle(document.body),t=parseFloat(b.paddingTop)||0;
// the pages pad their bodies differently: pull the bar over that padding so it spans the window the same way on each
n.style.margin=\`\${-t}px -\${b.paddingRight} \${t?18:0}px -\${b.paddingLeft}\`;
const show=v=>{n.querySelectorAll('[data-zh]').forEach(e=>e.textContent=e.dataset[v]);n.querySelectorAll('.cb-lang button').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.l===v)))};
show(l);
// live updates: on a newer /__stamp the page asks __check whether what it shows changed, and only then a page that set
// CASEBOOK.onData (every page but Cases) gets the new data and redraws in place inside CASEBOOK.quiet(), where each
// innerHTML write becomes a patch of only the nodes that differ (filters, open items, scroll, focus and loaded images
// stay; SVG is drawn as before); Cases (unsaved edits) shows the Reload button. New page code (a
// scripts change) shows the button too, and reloads a hidden tab other than Cases.
// this table's place on the navigation page: Recent, and the tab it opens on
try{const k='casebook-seen',m=JSON.parse(localStorage.getItem(k)||'{}');m[${JSON.stringify(base(r))}]={path:${JSON.stringify(path)},at:Date.now()};localStorage.setItem(k,JSON.stringify(m))}catch(e){}
const C=CASEBOOK,u=n.querySelector('.cb-upd'),cur=${JSON.stringify(current)},F=${JSON.stringify(r.feature)};let d0=${stampOf(r.feature)},c0=${codeStamp},v=${JSON.stringify(version)},busy=0,again=0,later=0,stale=0;u.onclick=()=>location.reload();
const H=Object.getOwnPropertyDescriptor(Element.prototype,'innerHTML'),XH='http://www.w3.org/1999/xhtml';
const same=(o,m)=>o.nodeType===m.nodeType&&(o.nodeType!==1||o.tagName===m.tagName&&o.id===m.id);
const sync=(a,b)=>{let i=0;for(const m of [...b.childNodes]){const o=a.childNodes[i];
  if(!o)a.appendChild(m);else if(same(o,m))patch(o,m);
  else{const k=m.nodeType===1&&m.id?[...a.children].find(x=>x.id===m.id&&x.tagName===m.tagName):null;if(k){a.insertBefore(k,o);patch(k,m)}else a.insertBefore(m,o)}
  i++}while(a.childNodes.length>i)a.lastChild.remove()};
const patch=(o,m)=>{if(o.nodeType!==1){if(o.nodeValue!==m.nodeValue)o.nodeValue=m.nodeValue;return}
  if(o.isEqualNode(m))return;
  for(const x of m.attributes)if(o.getAttribute(x.name)!==x.value)o.setAttribute(x.name,x.value);
  for(const x of [...o.attributes])if(!m.hasAttribute(x.name))o.removeAttribute(x.name);
  const tg=o.tagName;if((tg==='INPUT'||tg==='TEXTAREA')&&o===document.activeElement)return;
  if(tg==='INPUT'){if(o.type==='checkbox'||o.type==='radio')o.checked=m.hasAttribute('checked');else o.value=m.getAttribute('value')??'';return}
  sync(o,m);if(tg==='TEXTAREA')o.value=m.textContent;
  if(tg==='SELECT'){const k=[...o.options].findIndex(x=>x.hasAttribute('selected'));o.selectedIndex=k<0?0:k}};
const morph=(el,h)=>{const t=document.createElement('template');H.set.call(t,h);sync(el,t.content)};
C.quiet=f=>{Object.defineProperty(Element.prototype,'innerHTML',{configurable:true,get:H.get,set(h){if(this.isConnected&&this.namespaceURI===XH&&this.tagName!=='TEMPLATE')morph(this,String(h));else H.set.call(this,h)}});
  try{return f()}finally{Object.defineProperty(Element.prototype,'innerHTML',H)}};
// a hidden tab asks for nothing, so its page process can stop when idle; it catches up when it is shown
C.check=async fresh=>{if(document.hidden){later=1;return}if(busy){again=1;return}busy=1;try{const r=await fetch('__check?v='+encodeURIComponent(v)+(C.onData?'&data=1':'')+(fresh?'&fresh=1':''),{cache:'no-store'});
  if(r.status!==200)return;const j=await r.json();v=j.v;if(C.onData)C.quiet(()=>C.onData(j.data));else u.hidden=false}catch(e){}finally{busy=0;if(again){again=0;C.check()}}};
const got=s=>{if(s.code>c0){if(document.hidden&&cur!=='review'){stale=1;return}u.hidden=false;return}
  const d=s.stamps[F];if(d>d0){d0=d;C.check()}};
addEventListener('visibilitychange',()=>{if(document.hidden)return;if(stale)return location.reload();if(later){later=0;C.check()}});
// one tab per browser holds /__events (a Web Lock) and passes each stamp to the others (BroadcastChannel); the next
// tab takes over when it closes. Locks need a secure context (localhost, not a LAN address): there, poll instead.
if(navigator.locks&&window.BroadcastChannel){const bc=new BroadcastChannel('casebook-stamps');bc.onmessage=e=>got(e.data);
  navigator.locks.request('casebook-events',()=>new Promise(()=>{const es=new EventSource('/__events');addEventListener('pagehide',()=>es.close());es.onmessage=e=>{const s=JSON.parse(e.data);bc.postMessage(s);got(s)}}))}
else setInterval(async()=>{let s;try{s=await(await fetch('/__stamp',{cache:'no-store'})).json()}catch(e){return}got(s)},3000);
n.querySelectorAll('.cb-lang button').forEach(x=>x.onclick=()=>{const v=x.dataset.l;if(v===CASEBOOK.lang)return;CASEBOOK.lang=v;try{localStorage.setItem('casebook-lang',v)}catch(e){}show(v);dispatchEvent(new CustomEvent('casebook-lang',{detail:v}))});})();</script>`;
};
// What a page shows, for __check: its data.json (pages that redraw in place) or its HTML (the others), less the build time
const versionOf = (text: string) => createHash('sha1').update(text.replace(/"(built_at|generated)":"[^"]*"/g, '')).digest('hex').slice(0, 16);
const fetchChild = (c: Child, path: string) => new Promise<{ status: number; body: string }>((ok, fail) => {
  const r = request({ host: '127.0.0.1', port: c.port, path, headers: { 'x-casebook-stamp': String(stampOf(c.ref.feature)) } }, up => {
    const c: Buffer[] = []; up.on('data', x => c.push(x)); up.on('end', () => ok({ status: up.statusCode ?? 0, body: Buffer.concat(c).toString('utf8') }));
  });
  r.on('error', fail); r.end();
});
// one build per page and stamp, shared by every open tab (fresh: Progress's 10 s re-check, for usage from transcripts)
const checks = new Map<string, { stamp: number; job: Promise<{ v: string; body: string }> }>();
const check = (c: Child, data: boolean, fresh: boolean) => {
  const key = `${c.key}|${data}`, was = checks.get(key), stamp = stampOf(c.ref.feature);
  if (!fresh && was?.stamp === stamp) return was.job;
  const job = ensure(c).then(() => { if (!c.port) throw new Error(c.error ?? `${c.def.label} is not running.`); return fetchChild(c, data ? '/data.json' : '/'); })
    .then(r => { if (r.status !== 200) throw new Error(`${c.def.label}: ${r.status}`); return { v: versionOf(r.body), body: r.body }; });
  checks.set(key, { stamp, job }); job.catch(() => checks.delete(key));
  return job;
};
const notAvailable = (c: Child, r: Ref) => `<!doctype html><meta charset="utf-8"><title>${esc(c.def.label)}</title><body style="margin:0;font:15px system-ui;background:#f4f5f7">${tabBar(r, c.def.id)}<p style="padding:24px;max-width:80ch">${esc(c.error ?? 'Not available.')}</p></body>`;
// The navigation page. Its data is a few small files per table, read when it is asked for.
const boardsData = () => ({ products: listBoards(), live: live().length, idleMinutes: IDLE_MS / 60_000 });
const loginPage = (next: string, error = '') => withShared(readFileSync(script('login-page.tpl'), 'utf8')).replace('__NEXT__', () => esc(next)).replace('__HIDE__', error ? '' : ' hidden').replace('__ERROR__', () => esc(error));
const boardsPage = () => withShared(readFileSync(script('boards-page.tpl'), 'utf8')).replace('/*__BAR_CSS__*/', () => barCss.replace(/<\/?style>/g, ''))
  .replace('__NOTE__', () => shareNote()).replace('__DATA__', () => JSON.stringify(boardsData()).replace(/</g, '\\u003c'));

// HTML, JSON and other text go out gzipped to a browser that takes it (a page is ~100 KB; it matters over --lan);
// images are compressed already and the event stream must not be buffered
const gz = (req: import('node:http').IncomingMessage) => /\bgzip\b/.test(String(req.headers['accept-encoding'] ?? ''));
const textType = (t: unknown) => /^(text\/(html|plain|css|javascript)|application\/(json|javascript))/.test(String(t ?? ''));
function sendText(req: import('node:http').IncomingMessage, res: import('node:http').ServerResponse, status: number, headers: Record<string, any>, body: string) {
  const h = { ...headers }; delete h['content-length'];
  if (!gz(req) || body.length < 1024) { res.writeHead(status, h); res.end(body); return; }
  res.writeHead(status, { ...h, 'content-encoding': 'gzip', vary: 'accept-encoding' }); res.end(gzipSync(body, { level: 6 }));
}
const html200 = (res: import('node:http').ServerResponse, status: number) => res.writeHead(status, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' });
const notFound = (req: import('node:http').IncomingMessage, res: import('node:http').ServerResponse, what: string) => sendText(req, res, 404, { 'content-type': 'text/html; charset=utf-8' },
  `<!doctype html><meta charset="utf-8"><title>Not found</title><body style="font:15px system-ui;padding:24px"><p>${esc(what)}</p><p><a href="/">All features</a></p></body>`);
const BOARD = /^\/([a-z0-9-]+\/[a-z0-9-]+)\/(ios|android)(?:\/draft\/([\w.-]+))?(?:\/([a-z]+)(\/.*)?|\/)?$/;
// Other computers sign in with the passcode; everything but the sign-in itself waits behind it. Local requests skip it.
async function signIn(req: import('node:http').IncomingMessage, res: import('node:http').ServerResponse) {
  const who = String(req.socket.remoteAddress);
  let raw = ''; for await (const c of req) { raw += c; if (raw.length > 2048) break; }
  const form = new URLSearchParams(raw), next = safeNext(form.get('next')), html = { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' };
  if (tries.locked(who)) { sendText(req, res, 429, html, loginPage(next, 'Too many tries. Wait a minute and try again.')); return; }
  if (!passcodeMatches(form.get('passcode') ?? '', passcode!)) { tries.failed(who); sendText(req, res, 401, html, loginPage(next, 'That passcode is not right.')); return; }
  tries.passed(who);
  res.writeHead(303, { location: next, 'set-cookie': `${COOKIE}=${session}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${30 * 86_400}` }); res.end();
}
// One failed request must not take the pages down for everyone: a file read mid-write ends in an error page
const failed = (res: import('node:http').ServerResponse, e: any) => { console.error(e); if (!res.headersSent) res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' }); res.end(`Casebook pages: ${e?.message ?? e}. Reload to try again.`); };
const server = createServer((req, res) => { handle(req, res).catch(e => failed(res, e)); });
async function handle(req: import('node:http').IncomingMessage, res: import('node:http').ServerResponse) {
  const url = req.url ?? '/';
  if (passcode && !isLocal(req.socket.remoteAddress)) {
    if (url === '/__login' && req.method === 'POST') { await signIn(req, res); return; }
    if (!hasSession(req.headers.cookie, session)) {
      // a page gets the sign-in; what a page fetches in the background gets a plain refusal
      if (req.method === 'GET' && /\btext\/html\b/.test(String(req.headers.accept))) sendText(req, res, 401, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' }, loginPage(safeNext(url)));
      else { res.writeHead(401, { 'content-type': 'text/plain' }); res.end('Passcode needed.'); }
      return;
    }
  }
  if (url === '/' || url.startsWith('/?')) { sendText(req, res, 200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' }, boardsPage()); return; }
  if (url === '/boards.json') { sendText(req, res, 200, { 'content-type': 'application/json', 'cache-control': 'no-store' }, JSON.stringify(boardsData())); return; }
  if (url === '/__stamp') { res.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' }); res.end(stamps()); return; }
  if (url === '/__events') {
    res.writeHead(200, { 'content-type': 'text/event-stream', 'cache-control': 'no-store', connection: 'keep-alive' });
    res.write(`retry: 3000\ndata: ${stamps()}\n\n`); listeners.add(res); req.on('close', () => listeners.delete(res)); return;
  }
  // a second `pages.ts` asks whether this is a casebook server, and hands over the run plan it was given
  if (url.startsWith('/__hub')) {
    const q = new URL(url, 'http://x').searchParams, feature = q.get('feature'), platform = q.get('platform');
    if (feature && platform && isLocal(req.socket.remoteAddress)) {
      assertIds(feature, platform); plans.set(`${feature}|${platform}`, { md: q.get('plan') || undefined, draft: q.get('planDraft') || undefined });
      const c = children.get(`plan|${feature}|${platform}|`); if (c) stopChild(c);
    }
    res.writeHead(200, { 'content-type': 'application/json' }); res.end(JSON.stringify({ casebook: true, lan, live: live().map(c => c.key), ...(passcode && isLocal(req.socket.remoteAddress) ? { passcode } : {}) })); return;
  }
  if (url === '/favicon.ico') { res.writeHead(204); res.end(); return; }
  // old addresses, from before there was a table in the path (user, 2026-11-06); /review/ and /plan/ are older names
  const names: Record<string, string> = { review: 'cases', plan: 'progress' };
  const old = url.match(/^\/(cases|progress|results|coverage|design|review|plan)(\/.*)?$/);
  if (old) { res.writeHead(302, { location: cli ? `${base(cli)}/${names[old[1]] ?? old[1]}${old[2] ?? '/'}` : '/' }); res.end(); return; }
  const m = url.match(BOARD);
  if (!m) { notFound(req, res, `Nothing at ${url}.`); return; }
  const ref: Ref = { feature: m[1], platform: m[2], draft: m[3] };
  if (!existsSync(tableDir(ref.feature, ref.platform))) { notFound(req, res, `No table for ${ref.feature} / ${ref.platform}.`); return; }
  if (ref.draft && !hasDraft(ref.feature, ref.platform, ref.draft)) { notFound(req, res, `No draft ${ref.draft} for ${ref.feature} / ${ref.platform}.`); return; }
  // a table nobody approved yet opens on its newest draft
  if (!ref.draft && !readManifest(ref.feature, ref.platform)) {
    const draft = openDrafts(ref.feature, ref.platform).at(-1);
    if (!draft) { notFound(req, res, `No approved table or draft for ${ref.feature} / ${ref.platform}.`); return; }
    res.writeHead(302, { location: `${base({ ...ref, draft })}/${m[4] ?? 'cases'}${m[5] ?? '/'}` }); res.end(); return;
  }
  const path = names[m[4]] ?? m[4];
  if (m[4] !== path) { res.writeHead(301, { location: `${base(ref)}/${path}${m[5] ?? '/'}` }); res.end(); return; }
  if (!m[4]) { res.writeHead(302, { location: `${base(ref)}/cases/` }); res.end(); return; }
  const def = defs.find(d => d.path === path);
  if (!def) { notFound(req, res, `No page ${path}.`); return; }
  if (!m[5]) { res.writeHead(301, { location: `${base(ref)}/${path}/` }); res.end(); return; }
  const c = childOf(def, ref);
  if (m[5].startsWith('/__check')) {
    const q = new URL(url, 'http://x').searchParams, data = q.has('data');
    c.used = Date.now();
    check(c, data, q.has('fresh')).then(r => {
      if (r.v === q.get('v')) { res.writeHead(204, { 'cache-control': 'no-store' }); res.end(); return; }
      sendText(req, res, 200, { 'content-type': 'application/json', 'cache-control': 'no-store' }, `{"v":${JSON.stringify(r.v)}${data ? `,"data":${r.body}` : ''}}`);
    }, e => { res.writeHead(502, { 'content-type': 'text/plain' }); res.end(String(e?.message ?? e)); });
    return;
  }
  // the child sees every request as local, so the Save rule is enforced here
  if (req.method !== 'GET' && !isLocal(req.socket.remoteAddress)) {
    res.writeHead(403, { 'content-type': 'application/json' }); res.end(JSON.stringify({ error: 'Save works only on the computer running scripts/pages.ts.' })); return;
  }
  await ensure(c);
  if (!c.port) { html200(res, 200); res.end(notAvailable(c, ref)); return; }
  const fwd = request({ host: '127.0.0.1', port: c.port, path: m[5], method: req.method, headers: { ...req.headers, host: `127.0.0.1:${c.port}`, 'x-casebook-stamp': String(stampOf(ref.feature)) } }, up => {
    const html = /text\/html/.test(String(up.headers['content-type']));
    if (!html) {
      if (!gz(req) || !textType(up.headers['content-type']) || up.headers['content-encoding']) { res.writeHead(up.statusCode ?? 502, up.headers); up.pipe(res); return; }
      const h = { ...up.headers, 'content-encoding': 'gzip', vary: 'accept-encoding' }; delete h['content-length'];
      res.writeHead(up.statusCode ?? 502, h); up.pipe(createGzip()).pipe(res); return;
    }
    const chunks: Buffer[] = [];
    up.on('data', x => chunks.push(x));
    up.on('end', () => { try {
      let body = Buffer.concat(chunks).toString('utf8');
      const v = versionOf(body), bar = tabBar(ref, def.id, v);
      // first thing in the body (the plan page is a fragment with no <body> tag: after its <style>)
      body = /<body[^>]*>/i.test(body) ? body.replace(/<body[^>]*>/i, b => b + bar) : body.replace('</style>', b => b + bar);
      // a page opened from another computer cannot save: tell it so before it tries
      if ((def.id === 'review' || def.id === 'design') && !isLocal(req.socket.remoteAddress)) body = body.replace('"save":true', '"save":false');
      sendText(req, res, up.statusCode ?? 200, up.headers, body);
    } catch (e) { failed(res, e); } });
  });
  fwd.on('error', e => { res.writeHead(502, { 'content-type': 'text/plain' }); res.end(`${def.label}: ${e.message}`); });
  req.pipe(fwd);
}
const host = lan ? '0.0.0.0' : '127.0.0.1';
server.on('error', (e: any) => { if (e.code === 'EADDRINUSE' && port < LAST_PORT) { port++; server.listen(port, host); } else throw e; });
server.on('listening', () => {
  console.log(`Casebook pages: http://127.0.0.1:${port}/  — Ctrl+C to stop`);
  if (cli) console.log(`  ${cli.feature} / ${cli.platform}: http://127.0.0.1:${port}${base(cli)}/cases/`);
  if (!lan) return;
  for (const l of lanLines(port)) console.log(l);
  console.log(`  Passcode for other computers: ${passcode}${arg('passcode') ? '' : '   (new at each start; --passcode <code> keeps one)'}`);
  console.log('  This computer needs no passcode. The pages travel unencrypted on the network. Review Save is accepted from this computer only.');
});
server.listen(port, host);
