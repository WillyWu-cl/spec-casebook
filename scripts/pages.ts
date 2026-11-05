// One server for all the live pages of a feature and platform: Cases (the review page), Progress (the run plan),
// Results (every run's cases with screenshots and reasons), Coverage and Design (the design check), each under its own path with a tab bar on top, so one command (and one
// address, also over the LAN) opens them all and they link to each other (a row on Cases opens /coverage/#case=TC-012;
// a case on Coverage opens /cases/#TC-012).
// Usage: node scripts/pages.ts <product>/<feature> <ios|android> [--draft <id>] [--plan <RUN-PLAN.md>] [--plan-draft <id>] [--port 4386] [--lan]
//   --draft       the draft to review (and to show on the coverage page); without it, the approved table
//   --plan        the run plan; default the newest runs/RUN-PLAN-*.md
//   --plan-draft  the draft whose phases.json the plan uses; default the newest draft that has one
// No restart needed after changes: a change under scripts/ restarts the pages (a new run plan or draft is picked up
// then too) and offers open pages a Reload button; a change under library/<product>/<feature>/ makes open pages ask
// whether what they show changed, and only then Progress, Results, Coverage and Design redraw in place (keeping
// filters, open items and scroll) while Cases offers the Reload button (unsaved review edits are never lost). Only a
// change to this file itself needs Ctrl+C and a new start.
// Each page runs as its own server (review.ts, plan-page.ts --serve, results-page.ts --serve, coverage-page.ts --serve) on a loopback port,
// and this one forwards to it, adding the tab bar. --lan binds this server to 0.0.0.0 (no auth: anyone on the network
// can read the pages); the children stay on 127.0.0.1. Review Save is only accepted from this computer.
import { spawn, type ChildProcess } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, watch } from 'node:fs';
import { createServer, request } from 'node:http';
import { networkInterfaces } from 'node:os';
import { join } from 'node:path';
import { createGzip, gzipSync } from 'node:zlib';
import { arg, assertIds, draftsDir, readManifest, tableDir } from './lib/library.ts';
import { isLocal } from './lib/local.ts';

const [feature, platform] = process.argv.slice(2);
assertIds(feature, platform);
const draft = arg('draft'), lan = process.argv.includes('--lan');
const table = tableDir(feature, platform);
const newest = (dir: string, test: (name: string) => boolean) => existsSync(dir) ? readdirSync(dir).filter(test).sort().at(-1) : undefined;
// the plan and its draft are looked up again whenever the pages restart, so a new RUN-PLAN or draft shows up
const planOf = () => ({ md: arg('plan') ?? (n => n && join(table, 'runs', n))(newest(join(table, 'runs'), n => /^RUN-PLAN-.*\.md$/.test(n))),
  draft: arg('plan-draft') ?? newest(draftsDir(feature, platform), n => existsSync(join(draftsDir(feature, platform), n, 'phases.json'))) });
let plan = planOf();
const script = (name: string) => join(import.meta.dirname, name);
const withDraft = draft ? ['--draft', draft] : [];

type Page = { id: string; path: string; label: string; zh: string; argv: string[] | null; why?: string; port?: number; proc?: ChildProcess; error?: string; restarting?: boolean };
const reviewOf = draft ? ` · draft ${draft}` : ` · v${readManifest(feature, platform)?.version ?? '?'}`;
const pages: Page[] = [
  { id: 'review', path: 'cases', label: `Cases${reviewOf}`, zh: `案例${reviewOf.replace('draft', '草稿')}`,
    argv: [script('review.ts'), feature, platform, ...withDraft, '--port', '4487'] },
  { id: 'plan', path: 'progress', label: 'Progress', zh: '進度', argv: null,
    why: `No run plan: needs a runs/RUN-PLAN-*.md and a draft with phases.json (or --plan and --plan-draft).` },
  { id: 'results', path: 'results', label: 'Results', zh: '結果', argv: [script('results-page.ts'), feature, platform, '--serve', '4492'] },
  { id: 'coverage', path: 'coverage', label: 'Coverage', zh: '覆蓋率', argv: [script('coverage-page.ts'), feature, platform, ...withDraft, '--serve', '4491'] },
  // the design check (figma skill, references/conformance.md): Figma screens against the app's captures
  { id: 'design', path: 'design', label: 'Design', zh: '設計比對', argv: [script('design-page.ts'), feature, platform, '--serve', '4493'] },
];

const planArgv = () => plan.md && plan.draft ? [script('plan-page.ts'), feature, platform, plan.draft, plan.md, '--serve', '4490'] : null;

// start each child and read its address from the line it prints (it takes the next free port when one is busy)
function start(p: Page) {
  p.error = undefined; p.restarting = false;
  if (p.id === 'plan') p.argv = planArgv();
  if (!p.argv) { p.error = p.why; return Promise.resolve(); }
  return new Promise<void>(done => {
    const proc = spawn(process.execPath, p.argv!, { stdio: ['ignore', 'pipe', 'pipe'] });
    p.proc = proc;
    let err = '';
    proc.stdout!.on('data', b => { const m = String(b).match(/http:\/\/127\.0\.0\.1:(\d+)\//); if (m && !p.port) { p.port = +m[1]; done(); } });
    proc.stderr!.on('data', b => { err += b; process.stderr.write(`[${p.id}] ${b}`); });
    proc.on('exit', code => { if (p.restarting) return; if (!p.port) { p.error = `${p.label} did not start (exit ${code}): ${err.trim().split('\n').slice(-3).join(' ')}`; done(); } else { p.port = undefined; p.error = `${p.label} stopped (exit ${code}).`; } });
  });
}
await Promise.all(pages.map(start));
const stop = () => { for (const p of pages) p.proc?.kill(); };
// stop a page and start it again (its script, or the plan it shows, changed); the old one is gone before the new one
// binds, so it usually keeps its port
const restart = async (p: Page) => {
  const proc = p.proc;
  p.restarting = true; p.port = undefined; p.proc = undefined;
  if (proc && proc.exitCode === null) await new Promise(r => { proc.once('exit', r); proc.kill(); });
  await start(p);
};

// Live updates (user, 2026-10-29; in place, 2026-11-05). `stamp` changes whenever what a page shows may have changed
// (a file under the feature), `codeStamp` when the scripts did (the pages restarted). They are pushed to the tab bar
// over /__events (one open tab holds the connection and passes them on, so tabs do not use up the browser's six
// connections to this address; where it cannot, e.g. over --lan, the tab bar polls /__stamp every 3 s); on a new stamp
// it asks /<page>/__check whether its page changed (below) and redraws or offers Reload only if so.
let stamp = Date.now(), codeStamp = stamp;
const listeners = new Set<import('node:http').ServerResponse>();
const stamps = () => JSON.stringify({ data: stamp, code: codeStamp });
const bump = (code: boolean) => { stamp = Date.now(); if (code) codeStamp = stamp; for (const r of listeners) r.write(`data: ${stamps()}\n\n`); };
setInterval(() => { for (const r of listeners) r.write(': ping\n\n'); }, 30_000).unref();
const debounce = (ms: number, f: (names: string[]) => void) => { let t: NodeJS.Timeout | undefined, names: string[] = [];
  return (_: string, name: string | null) => { if (name) names.push(name); clearTimeout(t); t = setTimeout(() => { const n = names; names = []; f(n); }, ms); }; };
watch(import.meta.dirname, { recursive: true }, debounce(400, async names => {
  if (names.every(n => n === 'pages.ts')) { console.log('scripts/pages.ts changed: Ctrl+C and start it again to use the new version.'); return; }
  console.log(`scripts changed (${[...new Set(names)].slice(0, 3).join(', ')}): restarting the pages`);
  plan = planOf();
  await Promise.all(pages.map(restart));
  bump(true);
}));
const featureDir = join(import.meta.dirname, '..', 'library', feature);
// tokens.jsonl is topped up by the Progress page's own builds: Progress re-checks every 10 s anyway, and counting it
// here would make every page re-check after each of them
if (existsSync(featureDir)) watch(featureDir, { recursive: true }, debounce(1500, async names => {
  if (names.length && names.every(n => n.endsWith('tokens.jsonl'))) return;
  const next = planOf(), plg = pages.find(p => p.id === 'plan')!;
  if (next.md !== plan.md || next.draft !== plan.draft) { plan = next; console.log(`run plan now ${plan.md ?? 'none'} (draft ${plan.draft ?? 'none'})`); await restart(plg); }
  bump(false);
}));
process.on('exit', stop);
for (const s of ['SIGINT', 'SIGTERM', 'SIGHUP'] as const) process.once(s, () => process.exit(0));

// The tab bar goes in right after <body>; window.CASEBOOK tells each page where the others are, so they can link, and
// which language to show. The bar is the same on every page and holds the one language switch (user, 2026-10-28):
// the choice is kept per browser (localStorage casebook-lang) and sent to the page as a `casebook-lang` event, so the
// pages drop their own switches when served here (their static .html files keep them).
const esc = (s: string) => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));
const tx = (en: string, zh: string) => `<span data-en="${esc(en)}" data-zh="${esc(zh)}">${esc(en)}</span>`;
const tabBar = (current: string, version = '') => {
  const links = Object.fromEntries(pages.filter(p => p.port).map(p => [p.id, `/${p.path}/`]));
  return `<style>
.cb-tabs{display:flex;flex-wrap:wrap;align-items:center;gap:4px 6px;padding:6px 12px;background:#1d2733;color:#c9d3dd;font:500 13px/1.4 system-ui,-apple-system,"Segoe UI","PingFang TC",sans-serif;border-bottom:1px solid #2f3b4a;box-sizing:border-box}
.cb-tabs b{font-weight:650;color:#fff;margin-right:8px}
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
</style><nav class="cb-tabs" aria-label="Casebook pages"><b>${esc(feature)} · ${platform === 'ios' ? 'iOS' : 'Android'}</b>${pages.map(p => p.port
    ? `<a href="/${p.path}/"${p.id === current ? ' aria-current="page"' : ''}>${tx(p.label, p.zh)}</a>`
    : `<span class="off" title="${esc(p.error ?? '')}">${tx(p.label, p.zh)}</span>`).join('')}<button type="button" class="cb-upd" hidden>${current === 'review' ? tx('Files changed · Reload (unsaved edits are lost)', '檔案已更新 · 重新載入（未儲存的修改會遺失）') : tx('Updated · Reload', '已更新 · 重新載入')}</button><span class="cb-note">${lan ? tx('Shared on the network', '已在區域網路分享') : tx('This computer only', '僅限本機')}</span><span class="cb-lang" role="group" aria-label="Language"><button type="button" data-l="en">English</button><button type="button" data-l="zh">中文</button></span></nav>
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
const C=CASEBOOK,u=n.querySelector('.cb-upd'),cur=${JSON.stringify(current)};let d0=${stamp},c0=${codeStamp},v=${JSON.stringify(version)},busy=0,again=0;u.onclick=()=>location.reload();
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
C.check=async fresh=>{if(busy){again=1;return}busy=1;try{const r=await fetch('__check?v='+encodeURIComponent(v)+(C.onData?'&data=1':'')+(fresh?'&fresh=1':''),{cache:'no-store'});
  if(r.status!==200)return;const j=await r.json();v=j.v;if(C.onData)C.quiet(()=>C.onData(j.data));else u.hidden=false}catch(e){}finally{busy=0;if(again){again=0;C.check()}}};
const got=s=>{if(s.code>c0){if(document.hidden&&cur!=='review')return location.reload();u.hidden=false;return}
  if(s.data>d0){d0=s.data;C.check()}};
// one tab per browser holds /__events (a Web Lock) and passes each stamp to the others (BroadcastChannel); the next
// tab takes over when it closes. Locks need a secure context (localhost, not a LAN address): there, poll instead.
if(navigator.locks&&window.BroadcastChannel){const bc=new BroadcastChannel('casebook-stamps');bc.onmessage=e=>got(e.data);
  navigator.locks.request('casebook-events',()=>new Promise(()=>{const es=new EventSource('/__events');addEventListener('pagehide',()=>es.close());es.onmessage=e=>{const s=JSON.parse(e.data);bc.postMessage(s);got(s)}}))}
else setInterval(async()=>{let s;try{s=await(await fetch('/__stamp',{cache:'no-store'})).json()}catch(e){return}got(s)},3000);
n.querySelectorAll('.cb-lang button').forEach(x=>x.onclick=()=>{const v=x.dataset.l;if(v===CASEBOOK.lang)return;CASEBOOK.lang=v;try{localStorage.setItem('casebook-lang',v)}catch(e){}show(v);dispatchEvent(new CustomEvent('casebook-lang',{detail:v}))});})();</script>`;
};
// What a page shows, for __check: its data.json (pages that redraw in place) or its HTML (the others), less the build time
const versionOf = (text: string) => createHash('sha1').update(text.replace(/"(built_at|generated)":"[^"]*"/g, '')).digest('hex').slice(0, 16);
const fetchChild = (p: Page, path: string) => new Promise<{ status: number; body: string }>((ok, fail) => {
  const r = request({ host: '127.0.0.1', port: p.port, path, headers: { 'x-casebook-stamp': String(stamp) } }, up => {
    const c: Buffer[] = []; up.on('data', x => c.push(x)); up.on('end', () => ok({ status: up.statusCode ?? 0, body: Buffer.concat(c).toString('utf8') }));
  });
  r.on('error', fail); r.end();
});
// one build per page and stamp, shared by every open tab (fresh: Progress's 10 s re-check, for usage from transcripts)
const checks = new Map<string, { stamp: number; job: Promise<{ v: string; body: string }> }>();
const check = (p: Page, data: boolean, fresh: boolean) => {
  const key = `${p.id}|${data}`, c = checks.get(key);
  if (!fresh && c?.stamp === stamp) return c.job;
  const job = fetchChild(p, data ? '/data.json' : '/').then(r => { if (r.status !== 200) throw new Error(`${p.label}: ${r.status}`); return { v: versionOf(r.body), body: r.body }; });
  checks.set(key, { stamp, job }); job.catch(() => checks.delete(key));
  return job;
};
const notAvailable = (p: Page) => `<!doctype html><meta charset="utf-8"><title>${esc(p.label)}</title><body style="margin:0;font:15px system-ui;background:#f4f5f7">${tabBar(p.id)}<p style="padding:24px;max-width:80ch">${esc(p.error ?? 'Not available.')}</p></body>`;

// HTML, JSON and other text go out gzipped to a browser that takes it (a page is ~100 KB; it matters over --lan);
// images are compressed already and the event stream must not be buffered
const gz = (req: import('node:http').IncomingMessage) => /\bgzip\b/.test(String(req.headers['accept-encoding'] ?? ''));
const textType = (t: unknown) => /^(text\/(html|plain|css|javascript)|application\/(json|javascript))/.test(String(t ?? ''));
function sendText(req: import('node:http').IncomingMessage, res: import('node:http').ServerResponse, status: number, headers: Record<string, any>, body: string) {
  const h = { ...headers }; delete h['content-length'];
  if (!gz(req) || body.length < 1024) { res.writeHead(status, h); res.end(body); return; }
  res.writeHead(status, { ...h, 'content-encoding': 'gzip', vary: 'accept-encoding' }); res.end(gzipSync(body, { level: 6 }));
}
const server = createServer((req, res) => {
  const url = req.url ?? '/';
  // the pages are Cases, Progress, Results and Coverage (user, 2026-10-28), and Design (2026-11-03); /review/ and /plan/ links still work
  const old = url.match(/^\/(review|plan)(\/.*)?$/);
  if (old) { res.writeHead(301, { location: `/${old[1] === 'review' ? 'cases' : 'progress'}${old[2] ?? '/'}` }); res.end(); return; }
  if (url === '/__stamp') { res.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' }); res.end(stamps()); return; }
  if (url === '/__events') {
    res.writeHead(200, { 'content-type': 'text/event-stream', 'cache-control': 'no-store', connection: 'keep-alive' });
    res.write(`retry: 3000\ndata: ${stamps()}\n\n`); listeners.add(res); req.on('close', () => listeners.delete(res)); return;
  }
  const m = url.match(/^\/(cases|progress|results|coverage|design)(\/.*)?$/);
  if (!m) { res.writeHead(302, { location: '/cases/' }); res.end(); return; }
  const p = pages.find(x => x.path === m[1])!;
  if (!m[2]) { res.writeHead(301, { location: `/${p.path}/` }); res.end(); return; }
  if (!p.port) { res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); res.end(notAvailable(p)); return; }
  if (m[2].startsWith('/__check')) {
    const q = new URL(url, 'http://x').searchParams, data = q.has('data');
    check(p, data, q.has('fresh')).then(r => {
      if (r.v === q.get('v')) { res.writeHead(204, { 'cache-control': 'no-store' }); res.end(); return; }
      sendText(req, res, 200, { 'content-type': 'application/json', 'cache-control': 'no-store' }, `{"v":${JSON.stringify(r.v)}${data ? `,"data":${r.body}` : ''}}`);
    }, e => { res.writeHead(502, { 'content-type': 'text/plain' }); res.end(String(e?.message ?? e)); });
    return;
  }
  // the child sees every request as local, so the Save rule is enforced here
  if (req.method !== 'GET' && !isLocal(req.socket.remoteAddress)) {
    res.writeHead(403, { 'content-type': 'application/json' }); res.end(JSON.stringify({ error: 'Save works only on the computer running scripts/pages.ts.' })); return;
  }
  const fwd = request({ host: '127.0.0.1', port: p.port, path: m[2], method: req.method, headers: { ...req.headers, host: `127.0.0.1:${p.port}`, 'x-casebook-stamp': String(stamp) } }, up => {
    const html = /text\/html/.test(String(up.headers['content-type']));
    if (!html) {
      if (!gz(req) || !textType(up.headers['content-type']) || up.headers['content-encoding']) { res.writeHead(up.statusCode ?? 502, up.headers); up.pipe(res); return; }
      const h = { ...up.headers, 'content-encoding': 'gzip', vary: 'accept-encoding' }; delete h['content-length'];
      res.writeHead(up.statusCode ?? 502, h); up.pipe(createGzip()).pipe(res); return;
    }
    const chunks: Buffer[] = [];
    up.on('data', c => chunks.push(c));
    up.on('end', () => {
      let body = Buffer.concat(chunks).toString('utf8');
      const v = versionOf(body);
      // first thing in the body (the plan page is a fragment with no <body> tag: after its <style>)
      body = /<body[^>]*>/i.test(body) ? body.replace(/<body[^>]*>/i, b => b + tabBar(p.id, v)) : body.replace('</style>', b => b + tabBar(p.id, v));
      // a page opened from another computer cannot save: tell it so before it tries
      if (p.id === 'review' && !isLocal(req.socket.remoteAddress)) body = body.replace('"save":true', '"save":false');
      sendText(req, res, up.statusCode ?? 200, up.headers, body);
    });
  });
  fwd.on('error', e => { res.writeHead(502, { 'content-type': 'text/plain' }); res.end(`${p.label}: ${e.message}`); });
  req.pipe(fwd);
});
let port = Number(arg('port') ?? 4386); const host = lan ? '0.0.0.0' : '127.0.0.1';
server.on('error', (e: any) => { if (e.code === 'EADDRINUSE' && port < 4396) { port++; server.listen(port, host); } else throw e; });
server.on('listening', () => {
  console.log(`Casebook pages for ${feature} / ${platform}: http://127.0.0.1:${port}/  — Ctrl+C to stop`);
  for (const p of pages) console.log(`  ${p.port ? `/${p.path}/`.padEnd(12) : '(off)'.padEnd(12)} ${p.label}${p.error ? ` — ${p.error}` : ''}`);
  if (!lan) return;
  // one address per network this computer is on (Wi-Fi and Ethernet are often different subnets): the other computer
  // opens the one on its own network; a self-assigned 169.254 address is no network
  for (const [name, ifs] of Object.entries(networkInterfaces())) for (const i of ifs ?? []) if (i.family === 'IPv4' && !i.internal && !i.address.startsWith('169.254.'))
    console.log(`  LAN: http://${i.address}:${port}/`.padEnd(36) + ` (${name}, for computers on ${i.cidr ?? i.address})`);
  console.log('  Warning: --lan has no auth; anyone on this network can read the pages. Review Save is accepted from this computer only.');
});
server.listen(port, host);
