<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>__TITLE__</title>
<!-- tab icon (results: a check over a frame), different on each page so the browser tabs are easy to tell apart -->
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='7' fill='%232f7d4f'/><path d='M9 16.5l4.5 4.5L23 11' stroke='white' stroke-width='3.2' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;650;750&family=Source+Sans+3:wght@400;600&family=JetBrains+Mono:wght@400;600&family=Noto+Sans+TC:wght@400;600;700&display=swap">
<style>
/*__SHARED_CSS__*/
/* Layout: a run picker and filters, then one card per case — what was done, what should happen, what happened and the
   screenshots that show it. Same palette as the run plan. */
body { padding-block: 28px 56px }
.wrap { display: grid; gap: 20px }
h1 { font: 750 1.9rem var(--display); margin: 0; letter-spacing: -0.01em; text-wrap: balance }
.eyebrow { font: 600 0.72rem/1 var(--mono); text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted) }
.top { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap }
.lang { display: inline-flex; border: 1px solid var(--line); border-radius: 999px; overflow: hidden; background: var(--panel) }
.lang button { font: 600 0.85rem var(--body); border: 0; background: transparent; color: var(--ink); padding: 5px 14px; cursor: pointer }
.lang button[aria-pressed="true"] { background: var(--ink); color: var(--panel) }
.meta { color: var(--muted); display: flex; flex-wrap: wrap; gap: 6px 18px; font-size: 0.92rem }
.meta b { color: var(--ink); font-weight: 600 }
.runs { display: flex; flex-wrap: wrap; gap: 6px }
.runs button { font: 600 0.82rem var(--mono); border: 1px solid var(--line); background: var(--panel); color: var(--ink); border-radius: 6px; padding: 6px 10px; cursor: pointer; text-align: left }
.runs button[aria-pressed="true"] { border-color: var(--accent); box-shadow: inset 0 0 0 1px var(--accent); color: var(--accent) }
.runs button small { display: block; font: 400 0.72rem var(--mono); color: var(--muted) }
.bar { display: flex; height: 12px; border-radius: 3px; overflow: hidden; background: var(--chip-bg) }
.bar span { display: block; height: 100% }
.tools { position: sticky; top: 0; z-index: 5; background: var(--bg); padding: 10px 0; display: flex; flex-wrap: wrap; gap: 8px; align-items: center; border-bottom: 1px solid var(--line) }
.chip { font: 600 0.82rem var(--body); border: 1px solid var(--line); background: var(--panel); color: var(--ink); border-radius: 999px; padding: 5px 12px; cursor: pointer; display: inline-flex; gap: 6px; align-items: center }
.chip i { width: 9px; height: 9px; border-radius: 2px; display: inline-block }
.chip[aria-pressed="true"] { background: var(--ink); color: var(--panel); border-color: var(--ink) }
.chip .n { font: 0.78rem var(--mono); opacity: 0.8 }
select, input[type="search"] { font: 0.88rem var(--body); color: var(--ink); background: var(--panel); border: 1px solid var(--line); border-radius: 6px; padding: 6px 8px; min-width: 0 }
input[type="search"] { flex: 1 1 200px }
label.only { font-size: 0.85rem; color: var(--muted); display: inline-flex; gap: 6px; align-items: center }
.count { font: 0.82rem var(--mono); color: var(--muted); margin-left: auto }
.list { display: grid; gap: 10px }
.seg-h { font: 650 1rem var(--display); margin: 14px 0 0; color: var(--muted) }
.case { background: var(--panel); border: 1px solid var(--line); border-left: 4px solid var(--notrun); border-radius: 6px; scroll-margin-top: 70px }
.case > summary { list-style: none; cursor: pointer; display: grid; grid-template-columns: 5.2rem 5.6rem minmax(0, 1fr) auto auto; gap: 10px; align-items: baseline; padding: 9px 16px }
.case > summary::-webkit-details-marker { display: none }
.case > summary:hover { background: var(--chip-bg) }
.case .one { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.92rem }
.case .facts { display: none; min-width: 0; gap: 4px 12px; flex-wrap: wrap; align-items: baseline }
.case[open] .one, .case[open] > summary .bug, .case[open] > summary > .disp { display: none }
.case[open] .facts { display: flex }
.case > summary .res { margin-left: 0; justify-self: start }
.cbody { display: grid; gap: 10px; padding: 0 16px 14px } .cbody:empty { display: none }
.case.Pass { border-left-color: var(--pass) } .case.Fail { border-left-color: var(--fail) } .case.Blocked { border-left-color: var(--blocked) } .case.Inconclusive { border-left-color: var(--inc) }
.case.focus { box-shadow: 0 0 0 2px var(--accent) }
.head { display: flex; flex-wrap: wrap; gap: 6px 12px; align-items: baseline }
.cid { font: 600 0.95rem var(--mono) }
.sec { color: var(--muted); font-size: 0.9rem }
.res { font: 600 0.75rem var(--mono); text-transform: uppercase; letter-spacing: 0.05em; padding: 3px 8px; border-radius: 3px; background: var(--chip-bg); margin-left: auto }
.res.Pass { color: var(--pass) } .res.Fail { color: var(--fail) } .res.Blocked { color: var(--blocked) } .res.Inconclusive { color: var(--inc) }
.disp { font: 0.75rem var(--mono); color: var(--muted) }
.xl { display: flex; gap: 10px; font-size: 0.82rem }
.xl a { color: var(--accent); text-decoration: none } .xl a:hover { text-decoration: underline }
.grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px 16px }
.grid h4 { margin: 0 0 2px; font: 600 0.7rem var(--mono); text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted) }
.grid p { margin: 0; white-space: pre-wrap; overflow-wrap: anywhere }
.found { background: var(--chip-bg); border-radius: 4px; padding: 8px 10px }
.found.Fail { box-shadow: inset 3px 0 0 var(--fail) } .found.Blocked { box-shadow: inset 3px 0 0 var(--blocked) } .found.Pass { box-shadow: inset 3px 0 0 var(--pass) }
.why { margin-top: 6px; font-size: 0.88rem; color: var(--blocked) }
.bug { font: 600 0.82em var(--mono); background: var(--panel); border: 1px solid var(--line); border-radius: 3px; padding: 0 4px; color: inherit; text-decoration: none }
a.bug:hover { border-color: var(--fail); color: var(--fail) }
/* eBugs a failed case belongs to: one ticket-like link each, right under the case header */
.ebugs { display: flex; flex-wrap: wrap; gap: 6px; align-items: center }
.ebugs .lbl { font: 600 0.68rem var(--mono); text-transform: uppercase; letter-spacing: 0.08em; color: var(--fail); margin-right: 2px; display: inline-flex; gap: 5px; align-items: center }
.ebugs .lbl svg { width: 14px; height: 14px }
.tk { display: inline-flex; align-items: center; gap: 8px; max-width: 100%; min-width: 0; padding: 5px 10px; border-radius: 6px; text-decoration: none; color: var(--ink);
  border: 1px solid color-mix(in srgb, var(--fail) 40%, var(--line)); background: color-mix(in srgb, var(--fail) 8%, var(--panel)); transition: border-color .15s, background .15s }
a.tk:hover, a.tk:focus-visible { border-color: var(--fail); background: color-mix(in srgb, var(--fail) 14%, var(--panel)); outline: none }
.tk .code { font: 600 0.8rem var(--mono); color: var(--fail); flex: none }
.tk .tt { font-size: 0.86rem; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 56ch }
.tk .kd { font: 0.66rem var(--mono); text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); flex: none }
.tk .ext { color: var(--muted); flex: none; font-size: 0.85rem }
.tk.known { border-color: var(--line); background: var(--chip-bg) }
.tk.mentioned { border-style: dashed; border-color: var(--line); background: transparent }
.tk.none { border-style: dashed; border-color: var(--line); background: transparent; color: var(--muted); font-size: 0.84rem }
@media (max-width: 760px) { .tk .tt { max-width: 26ch } .tk .kd { display: none } }
.small { font-size: 0.85rem; color: var(--muted) }
.shots { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px }
.shots button { border: 1px solid var(--line); background: var(--chip-bg); padding: 0; border-radius: 4px; cursor: zoom-in; flex: none; display: grid }
.shots img { height: 220px; width: auto; display: block; border-radius: 4px 4px 0 0 }
.shots span { font: 0.68rem var(--mono); color: var(--muted); padding: 2px 6px; max-width: 160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: left }
.empty { color: var(--muted); padding: 24px 0 }
.lb { position: fixed; inset: 0; background: rgba(5, 10, 12, 0.92); z-index: 50; display: none; grid-template-rows: auto 1fr; color: #e3ecec }
.lb.on { display: grid }
.lb .bar2 { display: flex; gap: 10px; align-items: center; padding: 10px 16px; font: 0.85rem var(--mono) }
.lb .bar2 button { font: 600 0.9rem var(--body); background: #2a3a3c; color: #fff; border: 0; border-radius: 6px; padding: 6px 12px; cursor: pointer }
.lb .bar2 .cap { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap }
.lb .stage { display: grid; place-items: center; min-height: 0; padding: 0 16px 16px }
.lb img { max-width: 100%; max-height: calc(100vh - 72px); object-fit: contain }
@media (max-width: 760px) { .case > summary { grid-template-columns: auto minmax(0, 1fr) } .case .one { grid-column: 1 / -1; white-space: normal } .grid { grid-template-columns: 1fr } .shots img { height: 180px } .res { margin-left: 0 } }
</style>
</head>
<body>
<div class="wrap">
  <header style="display:grid;gap:12px">
    <div class="top"><div class="eyebrow" id="eyebrow"></div><div class="lang" role="group" aria-label="Language"><button type="button" data-l="en">English</button><button type="button" data-l="zh">中文</button></div></div>
    <h1 id="h"></h1>
    <div class="runs" id="runs" role="group" aria-label="Run"></div>
    <div class="meta" id="meta"></div>
    <p class="small" id="note" style="margin:0" hidden></p>
    <div class="bar" id="bar"></div>
  </header>
  <div class="tools" id="tools">
    <span id="rchips" style="display:contents"></span>
    <select id="seg" aria-label="Segment"></select>
    <select id="disp" aria-label="Disposition"></select>
    <input type="search" id="q" autocomplete="off">
    <label class="only"><input type="checkbox" id="only"> <span id="onlyl"></span></label>
    <label class="only"><input type="checkbox" id="onlybug"> <span id="onlybugl"></span></label>
    <label class="only"><input type="checkbox" id="nobug"> <span id="nobugl"></span></label>
    <label class="only"><input type="checkbox" id="compact"> <span id="compactl"></span></label>
    <span class="count" id="count"></span>
  </div>
  <div class="list" id="list"></div>
</div>
<div class="lb" id="lb" role="dialog" aria-modal="true" aria-label="Screenshot"><div class="bar2"><button type="button" id="lbprev">←</button><button type="button" id="lbnext">→</button><span class="cap" id="lbcap"></span><button type="button" id="lbclose">✕</button></div><div class="stage"><img id="lbimg" alt=""></div></div>
<script>
/*__SHARED_JS__*/
let D = __DATA__;
const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
// Language: English or 中文 for what the page writes itself and the case text (from the table's Chinese copy); what
// the run recorded (What happened, Blocked because) stays as recorded.
// Served by scripts/pages.ts the tab bar holds the switch; a static results.html keeps its own.
let L = 'en';
if (window.CASEBOOK) L = window.CASEBOOK.lang; else try { if (localStorage.getItem('casebook-lang') === 'zh') L = 'zh'; } catch (e) {}
const T = {
  en: { eyebrow: 'Casebook results', title: f => `${f} · Results`, run: 'Run', build: 'Build', cases: 'cases', recorded: 'Recorded', all: 'All',
    allSeg: 'All segments', allDisp: 'All dispositions', search: 'Search ID, section, action, result or eBug', only: 'With screenshots only',
    compact: 'Compact list', attention: 'Needs attention', noBugF: 'Fail with no eBug', gone: n => `Screenshots for ${n} cases stay on the computer that ran the test, so they are not shown here.`, notHere: 'not on this computer',
    shown: (n, m) => `${n} of ${m}`, pre: 'Precondition', action: 'Action', expected: 'Expected result', actual: 'What happened', why: 'Blocked because',
    files: 'Other evidence', none: 'No case matches these filters.', noRuns: 'No run has recorded results yet (runs/*/results.csv).',
    review: 'cases', plan: 'progress', spec: 'coverage', report: 'report.md in the run folder', at: 'recorded', prio: 'priority', needs: 'needs', shot: 'screenshots',
    ebug: 'eBug', kind: { filed: 'filed from this run', known: 'existing ticket', mentioned: 'named in the result' }, noBug: 'No eBug linked', held: 'PM question · not filed', withBug: 'With an eBug',
    kindT: { filed: 'Filed from this run: the eBug draft names this case as a report step.', known: 'An existing ticket this failure repeats (the batch\'s dedupe list), so no new eBug was filed.', mentioned: 'An eBug code named in the recorded result.' },
    noBugT: 'No filed batch names this case and its result names no eBug code.' },
  zh: { eyebrow: '測試表執行結果', title: f => `${f} · 結果`, run: '執行', build: '版本', cases: '個案例', recorded: '記錄時間', all: '全部',
    allSeg: '全部段落', allDisp: '全部歸類', search: '搜尋 ID、區段、操作、結果或 eBug', only: '只看有截圖的',
    compact: '精簡清單', attention: '需要處理', noBugF: '失敗但沒有 eBug', gone: n => `${n} 個案例的截圖留在執行測試的電腦上，這裡不會顯示。`, notHere: '不在這台電腦上',
    shown: (n, m) => `${n} / ${m}`, pre: '前置條件', action: '操作', expected: '預期結果', actual: '實際情況', why: '受阻原因',
    files: '其他證據', none: '沒有符合篩選條件的案例。', noRuns: '還沒有任何執行記錄結果（runs/*/results.csv）。',
    review: '案例', plan: '進度', spec: '覆蓋率', report: '執行資料夾內的 report.md', at: '記錄於', prio: '優先度', needs: '需要', shot: '張截圖',
    ebug: 'eBug', kind: { filed: '本次執行開立', known: '既有單', mentioned: '結果中提及' }, noBug: '未連結 eBug', held: 'PM 問題 · 未開單', withBug: '有 eBug 的',
    kindT: { filed: '本次執行開立：eBug 草稿把此案例列為報告步驟。', known: '此失敗重複的既有單（該批的去重清單），因此沒有另開新單。', mentioned: '記錄的結果中提到的 eBug 編號。' },
    noBugT: '沒有任何已開立的批次列出此案例，結果中也沒有 eBug 編號。' },
};
const t = k => T[L][k] ?? T.en[k];
const RES = ['Pass', 'Fail', 'Blocked', 'Inconclusive', 'Not run'];   // the order of Progress's bar and legend too
const ATTN = ['Fail', 'Blocked', 'Inconclusive'], IMG = /\.(png|jpe?g|webp)$/i;
const RES_ZH = { Pass: '通過', Fail: '失敗', Blocked: '受阻', Inconclusive: '無法判定', 'Not run': '未執行' };
const resName = r => L === 'zh' ? RES_ZH[r] ?? r : r;
const COLOR = r => `var(--${({ Pass: 'pass', Fail: 'fail', Blocked: 'blocked', Inconclusive: 'inc' })[r] ?? 'notrun'})`;
const PAGES = window.CASEBOOK?.pages ?? {};
// served (not a results.html file): the list asks for small copies; the viewer always opens the original
const THUMB = location.protocol === 'file:' ? '' : '?thumb';
const fmt = s => s ? cbWhen(s) : '';
// eBug codes in a result (DRI261898P0001, DRI261893-0124) stand out and open the ticket in eCL (the address the
// ebug-tr-filer skill prescribes)
const ECL = code => `https://ecl.cyberlink.com/Ebug/eBugHandle/HandleMainEbug.asp?BugCode=${encodeURIComponent(code)}`;
const bugs = s => esc(s).replace(/\b([A-Z]{3}\d{6}(?:P|-)\d{4})\b/g, c => `<a class="bug" href="${ECL(c)}" target="_blank" rel="noopener noreferrer">${c}</a>`);
const BUG_ICON = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><ellipse cx="8" cy="9.5" rx="3.6" ry="4.5"/><path d="M8 5v9M4.4 8H1.8M14.2 8h-2.6M4.6 11.6l-2 1.6M11.4 11.6l2 1.6M5 6l-1.6-1.6M11 6l1.6-1.6M6 4.6a2 2 0 0 1 4 0"/></svg>';
function ebugBand(c) {
  if (c.result !== 'Fail') return '';
  const tks = c.ebugs.map(b => `<a class="tk ${esc(b.kind)}" href="${ECL(b.code)}" target="_blank" rel="noopener noreferrer" title="${esc([b.tags, b.title].filter(Boolean).join(' ') + ' — ' + t('kindT')[b.kind])}"><span class="code">${esc(b.code)}</span>${b.title ? `<span class="tt">${esc(b.title)}</span>` : ''}<span class="kd">${esc(t('kind')[b.kind])}</span><span class="ext" aria-hidden="true">↗</span></a>`);
  if (!tks.length) tks.push(`<span class="tk none" title="${esc(t('noBugT'))}">${esc(c.disp === 'question' ? t('held') : t('noBug'))}</span>`);
  return `<div class="ebugs"><span class="lbl">${BUG_ICON}${t('ebug')}</span>${tks.join('')}</div>`;
}

let run = D.runs[0], res = 'attention', seg = '', disp = '', q = '', only = false, onlyBug = false, noBug = false, focus = '', shots = [], at = 0;
// every case shows its whole record (user, 2026-11-06); Compact list folds them to one line each. flip: the cases opened
// or closed by hand against that, kept across redraws
let compact = false; try { compact = !!localStorage.getItem('results-compact'); } catch (e) {}
const flip = new Set(), isOpen = id => compact ? flip.has(id) : !flip.has(id);
// another run's cases are fetched when it is opened, and kept (a static results.html has them all)
const loaded = {};
async function ensure(r) { if (!r || r.cases) return; if (!loaded[r.id]) { const x = await fetch(`run.json?id=${encodeURIComponent(r.id)}`, { cache: 'no-store' }); loaded[r.id] = await x.json(); } r.cases = loaded[r.id]; }
const runName = r => r.phase || r.id.replace(/^\d{4}-\d{2}-\d{2}-/, '').toUpperCase();

function header() {
  document.documentElement.lang = L === 'zh' ? 'zh-Hant' : 'en';
  $('eyebrow').textContent = t('eyebrow');
  $('h').textContent = t('title')(D.title);
  document.querySelectorAll('.lang button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.l === L)));
  $('runs').innerHTML = D.runs.map((r, i) => `<button type="button" data-i="${i}" aria-pressed="${r === run}" title="${esc(r.id)}">${esc(runName(r))} · ${esc(cbWhen(r.first).slice(0, 5))}<small>${r.n} ${t('cases')} · ${RES.filter(x => r.tally[x]).map(x => `${esc(resName(x))} ${r.tally[x]}`).join(' · ')}</small></button>`).join('');
  $('runs').querySelectorAll('button').forEach(b => b.onclick = async () => { const r = D.runs[+b.dataset.i]; await ensure(r); run = r; seg = disp = ''; flip.clear(); render(); });
  if (!run) { $('meta').textContent = ''; $('bar').innerHTML = ''; return; }
  $('meta').innerHTML = [`<span>${t('run')} <b>${esc(run.id)}</b></span>`, run.build && `<span>${t('build')} <b>${esc(run.build)}</b></span>`,
    `<span>${t('recorded')} <b>${esc(cbSpan(run.first, run.last, L))}</b></span>`, run.report && `<span>${t('report')}</span>`].filter(Boolean).join('');
  const gone = run.cases.filter(c => !c.shots.length && c.files.some(f => IMG.test(f))).length;
  $('note').hidden = !gone; $('note').textContent = gone ? t('gone')(gone) : '';
  const n = run.cases.length || 1, c = tally(run.cases);
  $('bar').innerHTML = RES.filter(r => c[r]).map(r => `<span style="width:${c[r] / n * 100}%;background:${COLOR(r)}" title="${resName(r)} ${c[r]}"></span>`).join('');
}
const tally = cs => cs.reduce((m, c) => (m[c.result] = (m[c.result] ?? 0) + 1, m), {});
function tools() {
  const cs = run?.cases ?? [], c = tally(cs);
  const attn = ATTN.reduce((n, r) => n + (c[r] ?? 0), 0);
  $('rchips').innerHTML = `<button type="button" class="chip" data-r="attention" aria-pressed="${res === 'attention'}">${t('attention')} <span class="n">${attn}</span></button><button type="button" class="chip" data-r="all" aria-pressed="${res === 'all'}">${t('all')} <span class="n">${cs.length}</span></button>`
    + RES.filter(r => c[r]).map(r => `<button type="button" class="chip" data-r="${r}" aria-pressed="${res === r}"><i style="background:${COLOR(r)}"></i>${resName(r)} <span class="n">${c[r]}</span></button>`).join('');
  $('rchips').querySelectorAll('button').forEach(b => b.onclick = () => { res = b.dataset.r; render(); });
  const segs = [...new Set(cs.map(c => c.seg).filter(Boolean))], disps = [...new Set(cs.map(c => c.disp).filter(Boolean))].sort();
  $('seg').innerHTML = `<option value="">${t('allSeg')}</option>` + segs.map(s => `<option${s === seg ? ' selected' : ''}>${esc(s)}</option>`).join('');
  $('disp').innerHTML = `<option value="">${t('allDisp')}</option>` + disps.map(s => `<option${s === disp ? ' selected' : ''}>${esc(s)}</option>`).join('');
  $('q').placeholder = t('search'); $('onlyl').textContent = t('only'); $('onlybugl').textContent = t('withBug'); $('nobugl').textContent = t('noBugF'); $('compactl').textContent = t('compact');
  // nothing to filter on where no screenshot is on this computer
  $('only').closest('label').hidden = !cs.some(c => c.shots.length);
}
const match = c => (res === 'all' || (res === 'attention' ? ATTN.includes(c.result) : c.result === res)) && (!seg || c.seg === seg) && (!disp || c.disp === disp) && (!only || c.shots.length)
  && (!onlyBug || c.ebugs.length) && (!noBug || (c.result === 'Fail' && !c.ebugs.length))
  && (!q || [c.id, c.section, c.action, c.expected, ...Object.values(c.zh ?? {}), c.actual, c.why, c.disp, ...c.ebugs.flatMap(b => [b.code, b.title])].join(' ').toLowerCase().includes(q));
function cardBody(c) {
  const links = [PAGES.review && `<a href="${esc(PAGES.review)}#${encodeURIComponent(c.id)}">${t('review')} →</a>`,
    PAGES.plan && `<a href="${esc(PAGES.plan)}#case=${encodeURIComponent(c.id)}">${t('plan')} →</a>`,
    PAGES.coverage && `<a href="${esc(PAGES.coverage)}#case=${encodeURIComponent(c.id)}">${t('spec')} →</a>`].filter(Boolean).join('');
  return `${ebugBand(c)}
  <div class="grid">
    <div>${c.pre ? `<h4>${t('pre')}</h4><p class="small">${esc(ZT(c, 'pre'))}</p>` : ''}<h4>${t('action')}</h4><p>${esc(ZT(c, 'action'))}</p></div>
    <div><h4>${t('expected')}</h4><p>${esc(ZT(c, 'expected'))}</p></div>
    <div class="found ${esc(c.result.replace(' ', ''))}"><h4>${t('actual')}</h4><p>${bugs(c.actual) || '—'}</p>${c.why ? `<div class="why"><b>${t('why')}:</b> ${esc(c.why)}${c.group ? ` <span class="disp">${esc(c.group)}</span>` : ''}</div>` : ''}${c.files.length ? `<div class="small" style="margin-top:6px">${t('files')}: ${c.files.map(esc).join(' ')}${!c.shots.length && c.files.some(f => IMG.test(f)) ? ` (${t('notHere')})` : ''}</div>` : ''}</div>
  </div>
  ${c.shots.length ? `<div class="shots">${c.shots.map((s, i) => `<button type="button" data-c="${esc(c.id)}" data-i="${i}" title="${esc(s.name)}"><img loading="lazy" src="${esc(s.src)}${THUMB}" alt="${esc(c.id)} ${esc(s.name)}"><span>${esc(s.name)}</span></button>`).join('')}</div>` : ''}
  <div class="xl">${links}<span class="disp" style="margin-left:auto">${esc(c.seg)} · ${t('at')} ${fmt(c.at)}</span></div>`;
}
// one line per case, the whole record when it is opened: the finding and its eBug can be scanned down the page
// the table's Chinese reading copy of a case field in 中文 mode (cases.zh-Hant.csv, fresh rows only), else the English
const ZT = (c, k) => (L === 'zh' && c.zh?.[k]) || c[k];
const oneLine = c => { const s = String((c.result === 'Blocked' && c.why) || c.actual || c.why || '').replace(/\s+/g, ' ').trim(), m = s.match(/^.{40,}?[.。](?=\s|$)/);
  const x = m ? m[0] : s; return x.length > 170 ? `${x.slice(0, 169)}…` : x; };
function card(c) {
  const k = esc(c.result.replace(' ', '')), on = isOpen(c.id), bug = c.ebugs[0];
  return `<details class="case ${k}${c.id === focus ? ' focus' : ''}" id="c-${esc(c.id)}" data-id="${esc(c.id)}"${on ? ' open' : ''}><summary><span class="cid">${esc(c.id)}</span><span class="res ${k}">${esc(resName(c.result))}</span><span class="one">${esc(oneLine(c))}</span><span class="facts"><span class="sec">${esc(ZT(c, 'section'))}</span>${c.prio ? `<span class="disp">${t('prio')} ${esc(c.prio)}</span>` : ''}${c.needs ? `<span class="disp">${t('needs')} ${esc(c.needs)}</span>` : ''}${c.disp ? `<span class="disp">${esc(c.disp)}</span>` : ''}</span>${bug ? `<a class="bug" href="${ECL(bug.code)}" target="_blank" rel="noopener noreferrer">${esc(bug.code)}</a>${c.ebugs.length > 1 ? `<span class="disp">+${c.ebugs.length - 1}</span>` : ''}` : ''}</summary><div class="cbody">${on ? cardBody(c) : ''}</div></details>`;
}
function list() {
  if (!run) { $('list').innerHTML = `<p class="empty">${t('noRuns')}</p>`; $('count').textContent = ''; return; }
  const cs = run.cases.filter(match);
  $('count').textContent = t('shown')(cs.length, run.cases.length);
  let html = '', last = null;
  for (const c of cs) { if (c.seg !== last) { html += `<h3 class="seg-h">${esc(c.seg || '—')}</h3>`; last = c.seg; } html += card(c); }
  $('list').innerHTML = html || `<p class="empty">${t('none')}</p>`;
  saveView();
}
// The view (run, filters, search) is kept in the address, so a reload or a shared link opens it again, and for this
// browser tab, so leaving Results for another page and coming back keeps it too.
const VIEW = `results-view:${D.feature}:${D.platform}`;
function saveView() {
  const u = new URLSearchParams();
  if (run && run !== D.runs[0]) u.set('run', run.id);
  for (const [k, v] of [['res', res === 'attention' ? '' : res], ['seg', seg], ['disp', disp], ['q', $('q').value.trim()]]) if (v) u.set(k, v);
  if (only) u.set('shots', '1'); if (onlyBug) u.set('bugs', '1'); if (noBug) u.set('nobug', '1');
  const s = u.toString();
  try { history.replaceState(history.state, '', location.pathname + (s ? `?${s}` : '') + location.hash); sessionStorage.setItem(VIEW, s); } catch (e) {}
}
async function loadView() {
  let s = location.search.slice(1); if (!s && !location.hash) try { s = sessionStorage.getItem(VIEW) ?? ''; } catch (e) {}
  const u = new URLSearchParams(s);
  run = D.runs.find(r => r.id === u.get('run')) ?? D.runs[0]; await ensure(run);
  res = u.get('res') || 'attention'; seg = u.get('seg') ?? ''; disp = u.get('disp') ?? '';
  $('q').value = u.get('q') ?? ''; q = $('q').value.trim().toLowerCase();
  only = $('only').checked = u.has('shots'); onlyBug = $('onlybug').checked = u.has('bugs'); noBug = $('nobug').checked = u.has('nobug');
}
function render() { header(); tools(); list(); }
// screenshot viewer: arrows step through the case's screenshots, Esc closes
let cap = '';
function open(list, i, id) { shots = list; at = i; cap = id; $('lb').classList.add('on'); showShot(); $('lbclose').focus(); }
function showShot() { const s = shots[at]; $('lbimg').src = s.src; $('lbimg').alt = s.name; $('lbcap').textContent = `${cap} · ${s.name} (${at + 1}/${shots.length})`; }
const step = d => { if (!shots.length) return; at = (at + d + shots.length) % shots.length; showShot(); };
const close = () => $('lb').classList.remove('on');
$('lbprev').onclick = () => step(-1); $('lbnext').onclick = () => step(1); $('lbclose').onclick = close;
$('lb').onclick = e => { if (e.target === $('lb') || e.target.classList.contains('stage')) close(); };
addEventListener('keydown', e => { if (!$('lb').classList.contains('on')) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft') step(-1); if (e.key === 'ArrowRight') step(1); });
$('seg').onchange = e => { seg = e.target.value; list(); };
$('disp').onchange = e => { disp = e.target.value; list(); };
$('q').oninput = e => { q = e.target.value.trim().toLowerCase(); list(); };
$('only').onchange = e => { only = e.target.checked; list(); };
$('onlybug').onchange = e => { onlyBug = e.target.checked; list(); };
$('nobug').onchange = e => { noBug = e.target.checked; list(); };
$('list').addEventListener('toggle', e => { const d = e.target; if (!d.matches?.('details.case')) return; const id = d.dataset.id;
  if (d.open === compact) flip.add(id); else flip.delete(id);
  if (d.open) { const c = run.cases.find(x => x.id === id), b = d.querySelector('.cbody'); if (c && !b.firstChild) b.innerHTML = cardBody(c); } }, true);
$('compact').checked = compact;
$('compact').onchange = e => { compact = e.target.checked; flip.clear(); try { localStorage.setItem('results-compact', compact ? '1' : ''); } catch (x) {} list(); };
$('list').addEventListener('click', e => { const b = e.target.closest('.shots button'); if (b) open(run.cases.find(c => c.id === b.dataset.c).shots, +b.dataset.i, b.dataset.c); });
// #case=TC-012 (a link from the other pages): the newest run that recorded the case, filters cleared, scrolled to it
async function showCase() {
  const m = location.hash.match(/^#case=(.+)$/); if (!m) return;
  focus = decodeURIComponent(m[1]);
  const r = D.runs.find(r => r.ids.includes(focus)); if (!r) return;
  await ensure(r); if (compact) flip.add(focus); else flip.delete(focus);
  run = r; res = 'all'; seg = disp = q = ''; only = onlyBug = noBug = false; $('q').value = ''; $('only').checked = $('onlybug').checked = $('nobug').checked = false;
  render(); document.getElementById(`c-${focus}`)?.scrollIntoView({ block: 'start' });
}
const setLang = l => { L = l; try { localStorage.setItem('casebook-lang', l); } catch (e) {} render(); };
document.querySelectorAll('.lang button').forEach(b => b.onclick = () => setLang(b.dataset.l));
if (window.CASEBOOK) { document.querySelector('.lang')?.remove(); addEventListener('casebook-lang', e => { L = e.detail; render(); }); }
addEventListener('hashchange', showCase);
// served by scripts/pages.ts: new results are drawn in place, on the same run and filters
if (window.CASEBOOK) CASEBOOK.onData = d => { if (run?.cases) loaded[run.id] = run.cases; D = d; for (const r of D.runs) if (!r.cases && loaded[r.id]) r.cases = loaded[r.id]; run = D.runs.find(r => r.id === run?.id) ?? D.runs[0]; run.cases ??= []; if (shots.length && $('lb').classList.contains('on')) shots = run?.cases.find(c => c.id === cap)?.shots ?? shots; render(); };
loadView().then(() => { render(); showCase(); });
</script>
</body>
</html>
