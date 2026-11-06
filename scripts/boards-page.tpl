<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Casebook</title>
<style>
/*__SHARED_CSS__*/
/*__BAR_CSS__*/
body { padding-bottom: 40px }
.head { display: flex; flex-wrap: wrap; gap: 10px 20px; align-items: end; justify-content: space-between; margin: 24px 0 8px }
h1 { font: 700 1.6rem/1.2 var(--display); margin: 0; letter-spacing: -0.01em }
.head p { margin: 2px 0 0; color: var(--muted) }
#q { font: inherit; color: inherit; background: var(--panel); border: 1px solid var(--line); border-radius: 6px; padding: 7px 10px; width: min(280px, 100%) }
#q:focus-visible, a:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px }
h2 { font: 700 1.05rem var(--display); margin: 26px 0 8px }
.rows { background: var(--panel); border: 1px solid var(--line); border-radius: 8px; overflow: hidden }
.row { display: grid; grid-template-columns: minmax(180px, 1fr) minmax(0, 1.35fr) minmax(0, 1.35fr); gap: 0 20px; padding: 12px 16px; border-top: 1px solid var(--line) }
.row:first-child { border-top: 0 }
.name strong { display: block; font-weight: 650 }
.name span { color: var(--muted); font: 0.8rem var(--mono); overflow-wrap: anywhere }
.plat { min-width: 0 }
.plat .open { font-weight: 650; color: var(--accent); text-decoration: none }
.plat .open:hover { text-decoration: underline }
.plat .meta { color: var(--muted); font-size: 0.86rem; margin-left: 6px }
.plat.none { color: var(--muted); font-size: 0.86rem }
.pages { display: flex; flex-wrap: wrap; gap: 2px 10px; margin-top: 3px; font-size: 0.86rem }
/* what can be clicked is in the accent colour, what only informs stays muted (user, 2026-11-06) */
.pages a { color: var(--accent); text-decoration: none }
.pages a:hover { text-decoration: underline }
.pages span { color: var(--muted) }
.pages .draft { color: var(--blocked) }
.status { display: flex; flex-wrap: wrap; gap: 2px 10px; margin-top: 3px; font-size: 0.84rem; color: var(--muted) }
.status a { color: var(--accent); text-decoration: none } .status a:hover { text-decoration: underline }
.status b { font-weight: 650 } .status .p { color: var(--pass) } .status .x { color: var(--fail) } .status .k { color: var(--blocked) } .status .w { color: var(--question) }
.status .run { font: 0.78rem var(--mono); overflow-wrap: anywhere }
.status .live { color: var(--pass); font-weight: 650 }
#recent { display: flex; flex-wrap: wrap; gap: 8px; margin: 14px 0 0 }
#recent a { background: var(--panel); border: 1px solid var(--line); border-radius: 6px; padding: 5px 10px; color: inherit; text-decoration: none; font-size: 0.9rem }
#recent a:hover { border-color: var(--accent) }
#recent span { color: var(--muted) }
footer { color: var(--muted); font-size: 0.86rem; margin-top: 18px }
#none { color: var(--muted); margin-top: 24px }
@media (max-width: 760px) { .row { grid-template-columns: 1fr; gap: 8px } }
</style>
</head>
<body>
<nav class="cb-tabs" aria-label="Casebook"><b>Casebook</b><span class="cb-note">__NOTE__</span><span class="cb-lang" role="group" aria-label="Language"><button type="button" data-l="en">English</button><button type="button" data-l="zh">中文</button></span></nav>
<div class="head"><div><h1 id="t"></h1><p id="s"></p></div><input id="q" type="search" autocomplete="off"></div>
<div id="recent" hidden></div>
<main id="list"></main>
<p id="none" hidden></p>
<footer id="f"></footer>
<script>
/*__SHARED_JS__*/
let D = __DATA__;
let L = 'en'; try { if (localStorage.getItem('casebook-lang') === 'zh') L = 'zh'; } catch (e) {}
const $ = id => document.getElementById(id), tx = (en, zh) => L === 'zh' ? zh : en;
const PAGES = [['cases', 'Cases', '案例'], ['progress', 'Progress', '進度'], ['results', 'Results', '結果'], ['coverage', 'Coverage', '覆蓋率'], ['design', 'Design', '設計比對']];
const platName = p => p === 'ios' ? 'iOS' : 'Android';
// what this browser opened last, per table (the tab bar writes it): Recent, and where a table's name leads
const seen = () => { try { return JSON.parse(localStorage.getItem('casebook-seen') || '{}'); } catch (e) { return {}; } };
const lastTab = (root, s) => s[root]?.path ?? 'cases';
function status(p, root) {
  const r = p.last, w = p.waiting ?? {}, out = [];
  if (r) { const c = (n, cls, en, zh) => n ? `<span class="${cls}"><b>${n}</b> ${tx(en, zh)}</span>` : '';
    out.push(`<a href="${root}/results/" title="${cbEsc(cbWhenZ(r.at, L))}">${r.live ? `<span class="live">${tx('Running', '執行中')}</span> ` : ''}<span class="run">${cbEsc(r.id)}</span> ${c(r.pass, 'p', 'pass', '通過')} ${c(r.fail, 'x', 'fail', '失敗')} ${c(r.blocked, 'k', 'blocked', '受阻')}</a>`); }
  const cases = `${root}/cases/`, item = (n, en, zh) => n ? `<a class="w" href="${cases}"><b>${n}</b> ${tx(en, zh)}</a>` : '';
  out.push(item(w.questions, w.questions > 1 ? 'open questions' : 'open question', '待答問題'), item(w.answers, w.answers > 1 ? 'answers to apply' : 'answer to apply', '待套用答案'), item(w.notes, w.notes > 1 ? 'new-case notes' : 'new-case note', '新案例備註'));
  return out.filter(Boolean).length ? `<div class="status">${out.filter(Boolean).join('')}</div>` : '';
}
function recent(s) {
  const names = new Map(D.products.flatMap(p => p.features.map(f => [f.id, f.title]))), label = { cases: ['Cases', '案例'], progress: ['Progress', '進度'], results: ['Results', '結果'], coverage: ['Coverage', '覆蓋率'], design: ['Design', '設計比對'] };
  const list = Object.entries(s).map(([root, v]) => ({ root, ...v, m: root.match(/^\/([^/]+\/[^/]+)\/(ios|android)(?:\/draft\/(.+))?$/) })).filter(x => x.m && names.has(x.m[1])).sort((a, b) => b.at - a.at).slice(0, 5);
  $('recent').hidden = !list.length;
  $('recent').innerHTML = list.length ? `<span>${tx('Recent', '最近')}</span>${list.map(x => `<a href="${cbEsc(`${x.root}/${x.path}/`)}">${cbEsc(names.get(x.m[1]))} · ${platName(x.m[2])}${x.m[3] ? ` · ${tx('draft', '草稿')}` : ''} <span>${tx(...(label[x.path] ?? [x.path, x.path]))}</span></a>`).join('')}` : '';
}
function cell(f, p, s) {
  if (!p) return `<div class="plat none">${tx('No table', '尚無表格')}</div>`;
  const root = `/${f.id}/${p.platform}`, older = p.drafts.length - 2;
  const meta = p.version ? `v${p.version} · ${tx(`${p.cases} cases`, `${p.cases} 案例`)} · ${cbWhen(p.approved_at).slice(0, 5)}` : tx('Not approved yet', '尚未核准');
  const pages = PAGES.filter(([id]) => (id !== 'progress' || p.plan) && (id !== 'results' || p.runs)).map(([id, en, zh]) => `<a href="${root}/${id}/">${tx(en, zh)}</a>`);
  const drafts = p.drafts.slice(-2).reverse().map(d => `<a class="draft" href="${root}/draft/${d}/cases/">${tx('Draft', '草稿')} ${d}</a>`);
  return `<div class="plat"><a class="open" href="${root}/${lastTab(root, s)}/">${platName(p.platform)}</a><span class="meta">${meta}</span>
    <div class="pages">${p.version ? pages.join('') : ''}${drafts.join('')}${older > 0 ? `<span>${tx(`+${older} older`, `另有 ${older} 份較舊`)}</span>` : ''}</div>${status(p, root)}</div>`;
}
function render() {
  document.documentElement.lang = L === 'zh' ? 'zh-Hant' : 'en';
  document.querySelectorAll('.cb-tabs [data-zh]').forEach(e => e.textContent = e.dataset[L]);
  document.querySelectorAll('.cb-lang button').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.l === L)));
  const features = D.products.flatMap(p => p.features), tables = features.flatMap(f => f.platforms).length;
  $('t').textContent = tx('Choose a feature', '選擇功能');
  $('s').textContent = tx(`${features.length} features · ${tables} tables`, `${features.length} 個功能 · ${tables} 份表格`);
  $('q').placeholder = tx('Filter features', '篩選功能');
  const s = seen(); recent(s);
  const q = $('q').value.trim().toLowerCase();
  const hit = f => !q || `${f.title} ${f.id}`.toLowerCase().includes(q);
  const shown = D.products.map(p => ({ ...p, features: p.features.filter(hit) })).filter(p => p.features.length);
  $('list').innerHTML = shown.map(p => `<h2>${cbEsc(p.name)}</h2><div class="rows">${p.features.map(f => `<div class="row"><div class="name"><strong>${cbEsc(f.title)}</strong><span>${cbEsc(f.id)}</span></div>
    ${['ios', 'android'].map(x => cell(f, f.platforms.find(y => y.platform === x), s)).join('')}</div>`).join('')}</div>`).join('');
  $('none').hidden = !!shown.length; $('none').textContent = tx('No feature matches.', '沒有符合的功能。');
  $('f').textContent = tx(`A page starts when it is opened and stops after ${D.idleMinutes} idle minutes. Running now: ${D.live}. All times Taipei.`,
    `頁面開啟時才啟動，閒置 ${D.idleMinutes} 分鐘後停止。目前執行中：${D.live}。時間皆為台北時間。`);
}
$('q').oninput = render;
document.querySelectorAll('.cb-lang button').forEach(b => b.onclick = () => { L = b.dataset.l; try { localStorage.setItem('casebook-lang', L); } catch (e) {} render(); });
// back on this page: the list may have moved on
addEventListener('pageshow', e => { if (e.persisted) refresh(); });
addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
async function refresh() { try { const r = await fetch('/boards.json', { cache: 'no-store' }); if (r.ok) { D = await r.json(); render(); } } catch (e) {} }
render();
</script>
</body>
</html>
