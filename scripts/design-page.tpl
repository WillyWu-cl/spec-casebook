<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>__TITLE__</title>
<!-- tab icon (design: two frames side by side), different on each page so the browser tabs are easy to tell apart -->
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='7' fill='%236a55a8'/><rect x='6' y='8' width='8' height='16' rx='2' fill='none' stroke='white' stroke-width='2.4'/><rect x='18' y='8' width='8' height='16' rx='2' fill='white'/></svg>">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;650;750&family=Source+Sans+3:wght@400;600&family=JetBrains+Mono:wght@400;600&family=Noto+Sans+TC:wght@400;600;700&display=swap">
<style>
/* Layout: status chips and two filters, then a grid of screen cards; a card opens the comparison (Figma | app, the
   differences boxed and listed). Same palette as Results. */
:root {
  --bg: #f4f6f6; --panel: #ffffff; --ink: #172426; --muted: #5b6b6e; --line: #d8e0e1; --accent: #0f6e73; --chip-bg: #eef2f2;
  --differs: #b8402f; --question: #a86b12; --unreviewed: #6a55a8; --matches: #2f7d4f; --none: #9aa6a8; --info: #2c6fa8;
  --display: "Archivo", "Noto Sans TC", "Helvetica Neue", Arial, sans-serif;
  --body: "Source Sans 3", "Noto Sans TC", "Segoe UI", system-ui, "PingFang TC", sans-serif;
  --mono: "JetBrains Mono", ui-monospace, Menlo, monospace;
}
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {
  --bg: #111a1b; --panel: #182325; --ink: #e3ecec; --muted: #93a5a7; --line: #2a3a3c; --accent: #4fb8bd; --chip-bg: #213032;
  --differs: #ec7a66; --question: #e0a548; --unreviewed: #a796e0; --matches: #5cbf83; --none: #5f6f71; --info: #74b3ea; color-scheme: dark } }
:root[data-theme="dark"] {
  --bg: #111a1b; --panel: #182325; --ink: #e3ecec; --muted: #93a5a7; --line: #2a3a3c; --accent: #4fb8bd; --chip-bg: #213032;
  --differs: #ec7a66; --question: #e0a548; --unreviewed: #a796e0; --matches: #5cbf83; --none: #5f6f71; --info: #74b3ea; color-scheme: dark }
* { box-sizing: border-box }
[hidden] { display: none !important }
body { background: var(--bg); color: var(--ink); font: 15px/1.5 var(--body); margin: 0;
  padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); padding-block: 28px 56px }
.wrap { max-width: 1180px; margin: 0 auto; display: grid; gap: 18px }
h1 { font: 750 1.9rem var(--display); margin: 0; letter-spacing: -0.01em }
.eyebrow { font: 600 0.72rem/1 var(--mono); text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted) }
.top { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap }
.lang { display: inline-flex; border: 1px solid var(--line); border-radius: 999px; overflow: hidden; background: var(--panel) }
.lang button { font: 600 0.85rem var(--body); border: 0; background: transparent; color: var(--ink); padding: 5px 14px; cursor: pointer }
.lang button[aria-pressed="true"] { background: var(--ink); color: var(--panel) }
.meta { color: var(--muted); font-size: 0.92rem }
.bar { display: flex; height: 10px; border-radius: 3px; overflow: hidden; background: var(--chip-bg) }
.bar span { display: block; height: 100% }
.tools { position: sticky; top: 0; z-index: 5; background: var(--bg); padding: 10px 0; display: flex; flex-wrap: wrap; gap: 8px; align-items: center; border-bottom: 1px solid var(--line) }
/* Plan view: chips on one row, the rest on the next, every chip always there and Save a fixed width, so nothing moves
   when a count or the Save label changes (user, 2026-11-04) */
.tools.two { flex-direction: column; align-items: stretch }
.tools.two .trow { display: flex; flex-wrap: wrap; gap: 8px; align-items: center }
.chip:disabled { opacity: 0.45; cursor: default }
#pcopy, #copy { min-width: 17rem; justify-content: center }
.chip { font: 600 0.82rem var(--body); border: 1px solid var(--line); background: var(--panel); color: var(--ink); border-radius: 999px; padding: 5px 12px; cursor: pointer; display: inline-flex; gap: 6px; align-items: center }
.chip i { width: 9px; height: 9px; border-radius: 2px; display: inline-block }
.chip[aria-pressed="true"] { background: var(--ink); color: var(--panel); border-color: var(--ink) }
.chip .n { font: 0.78rem var(--mono); opacity: 0.8 }
select, input[type="search"] { font: 0.88rem var(--body); color: var(--ink); background: var(--panel); border: 1px solid var(--line); border-radius: 6px; padding: 6px 8px; min-width: 0 }
input[type="search"] { flex: 1 1 180px }
.count { font: 0.82rem var(--mono); color: var(--muted); margin-left: auto }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px }
.card { background: var(--panel); border: 1px solid var(--line); border-top: 4px solid var(--none); border-radius: 6px; padding: 8px; cursor: pointer; display: grid; gap: 6px; text-align: left; font: inherit; color: inherit }
.card:hover, .card:focus-visible { box-shadow: 0 0 0 2px var(--accent); outline: none }
.card .nm { font-weight: 600; font-size: 0.88rem; line-height: 1.25; overflow-wrap: anywhere }
.card .sub { font: 0.72rem var(--mono); color: var(--muted) }
.thumb { aspect-ratio: 375 / 812; overflow: hidden; border-radius: 4px; background: var(--chip-bg); position: relative }
.thumb img { display: block; width: 100%; height: auto }
.thumb .cut { position: absolute; max-width: none }
.st { font: 600 0.72rem var(--body); display: inline-flex; gap: 5px; align-items: center }
.st i { width: 8px; height: 8px; border-radius: 50%; display: inline-block }
.empty { color: var(--muted); padding: 24px 0 }
.grid .gh { grid-column: 1 / -1; font: 700 1rem var(--display); margin: 10px 0 -4px; border-bottom: 1px solid var(--line); padding-bottom: 4px }
.grid .gh:first-child { margin-top: 0 }
/* the comparison */
dialog { border: 0; border-radius: 10px; padding: 0; width: min(1180px, 100vw - 24px); max-height: calc(100vh - 24px); background: var(--panel); color: var(--ink) }
/* the comparison fits the window: images sized to the height left under the header, only the right panel scrolls
   (user, 2026-11-04: the images ran under the bottom of the browser and scrolled away with the list) */
#dlg[open] { height: calc(100dvh - 24px); display: flex; flex-direction: column; overflow: hidden }
dialog::backdrop { background: rgba(10, 16, 18, 0.6) }
.dh { position: sticky; top: 0; background: var(--panel); border-bottom: 1px solid var(--line); padding: 12px 16px; display: flex; gap: 12px; align-items: baseline; flex-wrap: wrap; z-index: 2 }
.dh h2 { font: 700 1.2rem var(--display); margin: 0 }
.dh .x { margin-left: auto; font: 600 1rem var(--body); border: 1px solid var(--line); background: var(--panel); color: var(--ink); border-radius: 6px; padding: 2px 10px; cursor: pointer }
.db { padding: 14px 16px; display: grid; grid-template-columns: minmax(0, 1fr) minmax(280px, 380px); grid-template-rows: minmax(0, 1fr); gap: 16px; flex: 1; min-height: 0 }
.pair { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: minmax(0, 1fr); gap: 10px; align-items: start; min-height: 0; container-type: size }
.pair .parts { grid-column: 1 / -1 }
.pair .frame { width: min(100%, calc((100cqh - 24px) * var(--r, 0.46))) }
.rp { overflow-y: auto; min-height: 0; padding-right: 4px }
@media (max-width: 760px) { #dlg[open] { overflow-y: auto } .db { grid-template-columns: 1fr; grid-template-rows: none; flex: none } .pair { container-type: normal } .pair .frame { width: 100% } .rp { overflow: visible } }
.side { display: grid; gap: 4px }
.side b { font: 600 0.72rem var(--mono); color: var(--muted); text-transform: uppercase; letter-spacing: 0.06em }
.frame { position: relative; overflow: hidden; border-radius: 6px; background: var(--chip-bg) }
.frame img { display: block; width: 100% }
.frame .cut { position: absolute; max-width: none; width: auto }
.frame svg { position: absolute; inset: 0; width: 100%; height: 100% }
.frame .no { aspect-ratio: 375 / 812; display: grid; place-items: center; color: var(--muted); font-size: 0.85rem; padding: 12px; text-align: center }
.frame svg { pointer-events: none }
.box { fill: none; stroke-width: 2.5; vector-effect: non-scaling-stroke; pointer-events: all; cursor: pointer }
.route { font-size: 0.88rem; display: grid; gap: 4px; margin-bottom: 10px }
.route a { color: var(--accent) }
.items { display: grid; gap: 8px; align-content: start; padding: 6px }
.it { border: 1px solid var(--line); border-left: 4px solid var(--none); border-radius: 6px; padding: 8px 10px; font-size: 0.86rem; display: grid; gap: 3px }
/* hover: a thin dashed outline; selected (a box or its item clicked): the Coverage page's mark, a white ring between
   two black ones just outside, the item's border in its verdict colour (user, 2026-11-05) */
.it.hl { outline: 2px dashed var(--muted); outline-offset: 2px }
.it.pick { outline: 0; border-color: var(--vc); box-shadow: 0 0 0 1.5px #000, 0 0 0 4px #fff, 0 0 0 5.5px #000 }
.it.flash { animation: pick 1.2s ease-out }
@keyframes pick { from { background: color-mix(in srgb, var(--accent) 30%, transparent) } to { background: transparent } }
.box.hl { stroke-width: 3 }
.ring { fill: none; pointer-events: none }
.it .h { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap }
.it .num { font: 700 0.8rem var(--mono); color: #fff; border-radius: 4px; padding: 0 6px }
.it .k { font: 600 0.78rem var(--mono) }
.it .v { margin-left: auto; font: 600 0.75rem var(--body) }
.grp { display: grid; gap: 8px }
.grp > summary { font: 600 0.78rem var(--body); text-transform: uppercase; letter-spacing: 0.05em; cursor: pointer; padding: 2px 0 }
.it q { quotes: "「" "」"; overflow-wrap: anywhere }
.it .note { color: var(--muted) }
.sw { display: inline-block; width: 12px; height: 12px; border-radius: 3px; border: 1px solid var(--line); vertical-align: -1px }
.ct { border-collapse: collapse; margin: 4px 0; font-size: 12px }
.ct th { text-align: left; font-weight: 500; color: var(--muted, inherit); opacity: .75; padding: 2px 12px 2px 0 }
.ct td { padding: 2px 12px 2px 0; vertical-align: top; white-space: nowrap }
.ct td code { display: block; font-size: 11px; opacity: .75; white-space: normal }
.more { font-size: 0.82rem; color: var(--muted) }
.dec { display: flex; gap: 4px; flex-wrap: wrap; align-items: center; margin-top: 2px }
.dec button { font: 600 0.74rem var(--body); border: 1px solid var(--line); background: var(--panel); color: var(--ink); border-radius: 5px; padding: 2px 8px; cursor: pointer }
.dec button[aria-pressed="true"] { background: var(--ink); color: var(--panel); border-color: var(--ink) }
.dec label { font-size: 0.78rem; display: inline-flex; gap: 4px; align-items: center; margin-left: 4px }
.warn { border: 1px solid var(--question); border-radius: 6px; padding: 6px 10px; font-size: 0.85rem; margin-bottom: 8px }
.rc { font-size: 0.84rem; display: grid; gap: 2px; margin-bottom: 10px }
.rc b.fixed { color: var(--matches) } .rc b.still { color: var(--differs) } .rc b.check { color: var(--question) }
.frame a { display: block }
.parts { display: flex; gap: 6px; flex-wrap: wrap; font-size: 0.78rem }
.noboxes .frame svg { display: none }
.srcapp { font: 600 0.7rem var(--mono); color: var(--matches); border: 1px solid currentColor; border-radius: 4px; padding: 0 4px }
.dec input.why { flex: 1 1 100%; font: 0.8rem var(--body); border: 1px solid var(--line); border-radius: 5px; padding: 3px 7px; background: var(--panel); color: var(--ink) }
.dec input.why.need { border-color: var(--differs) }
.it { cursor: pointer }
.outa { fill: color-mix(in srgb, var(--muted) 14%, transparent); stroke: var(--muted); stroke-width: 1.5; stroke-dasharray: 5 4; vector-effect: non-scaling-stroke }
.frame .zm { display: block; width: 100%; padding: 0; border: 0; background: none; cursor: zoom-in }
.lb { position: fixed; inset: 0; z-index: 10; display: grid; place-items: center; background: rgba(10, 16, 18, 0.85); cursor: zoom-out }
.lb .frame { height: calc(100dvh - 32px); width: auto; max-width: calc(100vw - 32px) }
.lb .frame.plain { height: auto; max-height: calc(100dvh - 32px); overflow: auto }
/* Plan view: the scope, then one line per screen grouped by board, each with Include / Exclude and a reason */
.views { display: inline-flex; border: 1px solid var(--line); border-radius: 8px; overflow: hidden; background: var(--panel) }
.views button { font: 650 0.9rem var(--display); border: 0; background: transparent; color: var(--ink); padding: 6px 16px; cursor: pointer }
.views button[aria-pressed="true"] { background: var(--accent); color: #fff }
.scope { background: var(--panel); border: 1px solid var(--line); border-radius: 8px; padding: 14px 16px; display: grid; gap: 12px }
.scope h2, .pb h3 { font: 700 1.05rem var(--display); margin: 0 }
.sh { display: flex; gap: 10px; align-items: baseline; flex-wrap: wrap }
.badge { font: 600 0.78rem var(--body); border-radius: 999px; padding: 2px 10px; border: 1px solid currentColor }
.badge.ok { color: var(--matches) } .badge.todo { color: var(--question) }
.gapnote { font-size: 0.82rem; color: var(--question); white-space: nowrap }
.sgrid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px 20px; font-size: 0.88rem }
.sgrid b { display: block; font: 600 0.72rem var(--mono); text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); margin-bottom: 4px }
.sgrid ul { margin: 0; padding-left: 18px } .sgrid li { margin: 1px 0 }
.sgrid a { color: var(--accent) }
.nums { display: flex; flex-wrap: wrap; gap: 6px 14px } .nums span b { display: inline; font: 700 0.95rem var(--mono); color: var(--ink); text-transform: none; letter-spacing: 0 }
.pb { display: grid; gap: 6px }
.pbh { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; padding-top: 6px }
.pr { display: grid; grid-template-columns: 88px minmax(0, 1.2fr) minmax(0, 1.6fr) minmax(220px, 1fr); gap: 10px; align-items: center;
  background: var(--panel); border: 1px solid var(--line); border-left: 4px solid var(--matches); border-radius: 6px; padding: 6px 10px; font-size: 0.86rem }
.pr.x { border-left-color: var(--none); opacity: 0.72 } .pr.flag { border-left-color: var(--question) } .pr.chg { box-shadow: 0 0 0 2px var(--unreviewed) }
.pr.todo { border-left-color: var(--differs); background: color-mix(in srgb, var(--differs) 7%, var(--panel)) }
.pr .ask { grid-column: 2 / -1; font-size: 0.82rem; color: var(--ink) } .pr .ask b { color: var(--differs) }
.pr.todo .dc button { border-color: var(--differs) }
#pcopy.go { background: var(--accent); color: #fff; border-color: var(--accent) }
@media (max-width: 760px) { .pr { grid-template-columns: 72px minmax(0, 1fr) } .pr .rt, .pr .dc { grid-column: 1 / -1 } }
.pr .tn { width: 100%; aspect-ratio: 375 / 812; overflow: hidden; border-radius: 3px; background: var(--chip-bg); position: relative; cursor: pointer; border: 0; padding: 0 }
.pr .tn img { display: block; width: 100% } .pr .tn .cut { position: absolute; max-width: none }
.pr .nm { font-weight: 600; overflow-wrap: anywhere; background: none; border: 0; padding: 0; color: var(--ink); text-align: left; cursor: pointer; font-size: inherit }
.pr .id { font: 0.72rem var(--mono); color: var(--muted) }
.pr .rt { color: var(--muted); overflow-wrap: anywhere } .pr .rt b { color: var(--ink) }
.fl { display: inline-block; font: 600 0.72rem var(--body); color: var(--question); border: 1px solid var(--question); border-radius: 4px; padding: 0 5px; margin: 2px 4px 0 0 }
.dc { display: flex; gap: 4px; flex-wrap: wrap; align-items: center }
.dc button { font: 600 0.76rem var(--body); border: 1px solid var(--line); background: var(--panel); color: var(--ink); border-radius: 5px; padding: 2px 9px; cursor: pointer }
.dc button[aria-pressed="true"] { background: var(--ink); color: var(--panel); border-color: var(--ink) }
.dc input { flex: 1 1 140px; font: 0.8rem var(--body); color: var(--ink); background: var(--panel); border: 1px solid var(--line); border-radius: 5px; padding: 3px 6px; min-width: 0 }
.dc input:invalid { border-color: var(--differs) }
.byb { font-size: 0.78rem; color: var(--muted) }
.hint { font-size: 0.84rem; color: var(--muted); margin: 0 }
/* Time and plan usage: the same table as the Progress page, one row per run with design work */
.usage { background: var(--panel); border: 1px solid var(--line); border-radius: 8px; padding: 14px 16px; display: grid; gap: 8px; min-width: 0 }
.usage h2 { font: 700 1.05rem var(--display); margin: 0; display: flex; gap: 10px; align-items: baseline; flex-wrap: wrap }
.usage .live { font: 600 0.72rem var(--body); color: var(--matches); display: inline-flex; gap: 5px; align-items: center }
.usage .live i { width: 8px; height: 8px; border-radius: 50%; background: currentColor; animation: pulse 1.6s ease-in-out infinite }
@keyframes pulse { 50% { opacity: 0.25 } }
@media (prefers-reduced-motion: reduce) { .usage .live i { animation: none } }
.usage .tbl { overflow-x: auto }
.usage table { border-collapse: collapse; width: 100%; font-size: 0.88rem }
.usage th { text-align: left; font: 600 0.7rem var(--mono); text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); padding: 6px; border-bottom: 1px solid var(--line); white-space: normal; vertical-align: bottom }
.usage td { padding: 6px; border-bottom: 1px solid var(--line); vertical-align: top; white-space: nowrap }
.usage td.n, .usage th.n { text-align: right; font-variant-numeric: tabular-nums }
.usage td:first-child { white-space: normal; min-width: 190px; max-width: 280px }
.usage th.grp { text-align: center }
.usage td.est { color: var(--accent); font-weight: 600 }
.usage td.acct, .usage th.acct { color: var(--muted) }
.usage td.acct { font-size: 0.82rem }
.usage tr.tot td { font-weight: 600; border-bottom: 0 }
.usage tr.round td { border-top: 2px solid var(--line) }
.usage tr.sub td { font-size: 0.8rem; color: var(--muted); padding-block: 3px }
.usage tr.sub td:first-child { padding-left: 22px }
.usage tr.sub td.est { color: var(--accent); font-weight: 400 }
.usage .eq { display: block; font: 400 0.7rem var(--mono); color: var(--muted) }
.usage .none { color: var(--muted); font-style: italic; font-weight: 400 }
.usage details.how summary { cursor: pointer; font-size: 0.85rem; color: var(--muted) }
.usage .notes { color: var(--muted); font-size: 0.85rem; margin: 8px 0 0; display: grid; gap: 4px }
</style>
</head>
<body>
<div class="wrap">
  <div class="top"><span class="eyebrow" id="eyebrow"></span><span class="views" id="views" role="group"></span><span class="lang" role="group" aria-label="Language"><button type="button" data-l="en">English</button><button type="button" data-l="zh">中文</button></span></div>
  <h1 id="h1"></h1>
  <div class="meta" id="meta"></div>
  <div class="bar" id="bar"></div>
  <section class="usage" id="usage" aria-labelledby="usage-h" hidden></section>
  <div id="planv" hidden>
    <section class="scope" id="scope"></section>
    <div class="tools two">
      <div class="trow" id="pchips"></div>
      <div class="trow">
        <select id="pboard" aria-label="Board"></select>
        <select id="psort" aria-label="Order"></select>
        <input type="search" id="pq" autocomplete="off">
        <span class="count" id="pcount"></span>
        <button type="button" class="chip" id="pcopy"></button>
      </div>
    </div>
    <p class="hint" id="phint"></p>
    <div id="pl" style="display:grid;gap:14px"></div>
    <datalist id="whys"></datalist>
  </div>
  <div id="resv">
  <div class="tools two">
    <div class="trow" id="chips"></div>
    <div class="trow">
      <select id="board" aria-label="Board"></select>
      <select id="kind" aria-label="Difference"></select>
      <select id="rsort" aria-label="Order"></select>
      <input type="search" id="q" autocomplete="off">
      <span class="count" id="count"></span>
      <button type="button" class="chip" id="copy"></button>
    </div>
  </div>
  <div class="grid" id="grid"></div>
  </div>
</div>
<dialog id="dlg"></dialog>
<script>
let D = __DATA__;
const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
// Language: English or 中文 for what the page writes itself; Figma and app text stay as they are.
let L = 'en';
if (window.CASEBOOK) L = window.CASEBOOK.lang; else try { if (localStorage.getItem('casebook-lang') === 'zh') L = 'zh'; } catch (e) {}
const T = {
  en: { eyebrow: 'Casebook design check', title: f => `${f} · Design`, all: 'All', captured: 'Captured',
    rsorts: { status: 'Order: by state', board: 'Order: by board', flow: 'Order: app flow', look: 'Order: most to look at', recent: 'Order: latest capture', figma: 'Order: as in Figma' },allBoards: 'All boards', sorts: { flow: 'Order: app flow', count: 'Order: most screens', look: 'Order: most to look at', figma: 'Order: as in Figma' }, search: 'Search screen, board or case',
    shown: (n, m) => `${n} of ${m}`, none: 'No screen matches these filters.', noPlan: 'No design plan yet: run node scripts/design.ts <feature> <platform> plan (figma skill, references/conformance.md).',
    meta: (n, c, s) => `${n} Design screens · ${c} captured · spec set ${s}`, figma: 'Figma', app: 'App', noApp: 'No capture on this computer', noFig: 'No Figma image on this computer',
    reached: 'Reached by', fit: { high: 'direct', mid: 'likely', low: 'approximate' }, also: 'also', pre: 'Precondition', action: 'Action', via: 'via',
    run: 'Run', open: 'Open in Figma', cases: 'Cases', cov: 'Coverage', res: 'Results', info: n => `${n} info items (sample text, app text not in Figma)`,
    showInfo: 'Show', hideInfo: 'Hide', nothing: 'No differences measured.', notCaptured: 'Not captured yet: reach it as shown and capture it (device.ts … design <id>).', close: 'Close',
    fitNote: (t, b) => `Fit offset: top ${t} pt, bottom ${b} pt`, allKinds: 'All differences', copy: n => `Copy decisions (${n})`, copied: 'Copied',
    bug: 'Bug', ok: 'OK', na: 'N/A', ebug: 'eBug', you: 'your call', recheck: r => `Recheck of ${r}`, build: 'Build', boxes: 'Boxes',
    doubt: (m, n) => `Only ${m} of ${n} Figma texts were found: this capture may be another state.`, part: n => `part ${n}`, zoom: 'Click to see it full size', dwhy: 'Why it is not a problem (required)', dwhyOpt: 'Note (optional)',
    needDecWhy: n => `${n} bug(s) moved to OK or N/A need a reason first.`, colSet: 'Set to', colDrawn: 'On screen', colDrawnT: 'The colour as drawn on the image, sampled from the pixels', colDiff: (a, b) => `Difference ΔE ${a} as set${b != null ? `, ${b} on screen` : ''}`, srcApp: 'app data', srcAppT: "Read from the app's own view data (exact), not from the screenshot",
    viewsNote: (m, n, sc) => `App view data: ${m} of the matched texts read exactly (${n} texts in the dump)${sc !== 1 ? `; the phone's font scale is ${sc}` : ''}.`,
    hiddenNote: n => `${n} text(s) of the page source are not on the screen (under another layer, or a button's accessibility name) and were left out.`,
    noOcr: 'The screenshot was not read (OCR runs on macOS): lines, text size and hidden texts come from the view boxes.',
    fontNote: (w, n) => `This platform draws Figma's font ${Math.round(Math.abs(1 - w) * 100)} % ${w < 1 ? 'narrower' : 'wider'} on average (${n} texts read on both sides): text size is judged against that.`, outNote: n => `${n} area(s) of other features left out of the check (dashed on the Figma side).`, outT: 'Another feature: not checked',
    now: { fixed: 'fixed', still: 'still there', check: 'look again' }, designPath: 'Design path', byArrows: 'Reached by the Design arrows',
    gap: 'No casebook row reaches this screen: a gap for the analysis.', pfit: { path: 'arrow path', variant: 'state beside a reached screen', entry: 'first screen of a flow' },
    views: { plan: 'Plan', results: 'Results' }, scope: 'Scope', reviewed: (d, n) => `Reviewed ${d}${n ? ` · ${n} new since` : ''}`, notReviewed: 'Not reviewed yet',
    sFigma: 'Figma read', sScreens: 'Screens', sMeasured: 'Measured on every capture', sLooked: 'Looked at by the two review passes', sNot: 'Not covered',
    boardsRead: (n, d) => `${n} boards read${d ? `, ${d}` : ''}`, specSet: s => `spec set ${s}`,
    unread: 'Not read yet: its screens are not in this plan. Read it before the check, or exclude it with a reason.', partial: 'Read incompletely: its screens are left out until the read finishes.', unreadS: 'not read yet', partialS: 'read incomplete',
    included: 'Included', excluded: 'Excluded', noRoute: 'No route', toLook: 'Needs your decision', lookT: r => r ? 'Added since the scope review: pick Include or Exclude.' : 'Flagged screens: read the note on each, then pick Include or Exclude.', decided: 'Decided', changed: 'Your changes',
    measured: ['Copy: each Figma text against the app text', 'Missing text and icon controls', 'Truncation (「…」 or past the edge)', 'Wrapping (number of lines)', 'Position, after aligning top and bottom', 'Fill and text colour', 'Arrival: the capture is the frame\'s state'],
    looked: ['Icon drawings and images', 'Font weight and size', 'Corner radius, shadows and borders', 'Anything else the sheet shows'],
    notCov: ['Excluded screens and boards (reason on each line)', 'Animation, motion and timing', 'Languages and appearances other than the frame\'s', 'Screens whose state cannot be brought about (named in the run)'],
    flagN: { area: 'Approximate route', variant: 'State to bring about', drawing: 'Not a phone screen', gap: 'Gap in the table' },
    yourCall: 'Your decision:',
    ask: { area: 'The test case that gets here only taps a control shared by many screens (back, close, tab bar), so it reaches this part of the app, not this exact state. The run has to set up what the frame shows (an error, an empty list…) by hand. Include if that can be done; Exclude if not.',
      variant: 'A state drawn beside a screen the run reaches; the run sets it up there. Include if it can be set up; Exclude if not.',
      drawing: 'Not a full phone screen: a card or detail drawn on its own. Its text is still checked where it appears on a real screen, so this is usually Exclude ("Drawing only").',
      gap: 'No test case reaches this screen yet. Include to keep it (the analysis adds a case); Exclude if it is not in this release.',
      noroute: 'No way to reach this screen was found. Exclude it, or Include and say in the chat how to get there.',
      fresh: 'Added to Figma after the last scope review.' },
    psave: (n, left) => left ? `Save${n ? ` (${n})` : ''} · ${left} still to decide` : n ? `Save and finish the review (${n})` : 'Saved',
    save: n => `Save decisions (${n})`, saving: 'Saving…', saveFail: 'Could not save:',
    flagT: { area: 'The row only reaches the area (a shared control); the runner brings about the state the frame shows.', variant: 'Drawn beside a reached screen: brought about there.',
      drawing: 'Narrower than a phone: a card or detail drawn on its own. Its texts are still compared where the card appears.', gap: 'No casebook row reaches it: the analysis adds one.' },
    include: 'Include', exclude: 'Exclude', why: 'Reason (required)', byBoard: r => `Excluded with its board: ${r}`, excludeBoard: 'Exclude board', includeBoard: 'Include board',
    boardHidden: n => `${n} screen${n === 1 ? '' : 's'} of this board hidden by the filter`,
    pcopy: n => `Copy for the chat${n ? ` (${n})` : ''}`, needWhy: n => `${n} exclusion(s) need a reason first.`,
    phint: 'Red rows need your decision: read the note, then pick Include (check it on the phone) or Exclude (with a reason). Any other screen can be excluded too. Save writes the choices to the design plan for iOS and Android (the Design screens are the same); once nothing is red the scope is reviewed. Opened as a file, the button copies the choices for you to paste into the chat instead.',
    whys: ['Superseded by a newer frame', 'Drawing only, not a screen', 'State cannot be brought about', 'Not in this release', 'Other platform only'],
    newFlag: 'New since the review', dpath: 'Design path' },
  zh: { eyebrow: '測試表設計比對', title: f => `${f} · 設計比對`, all: '全部', captured: '已擷取',
    rsorts: { status: '排序：依狀態', board: '排序：依畫板', flow: '排序：App 流程', look: '排序：待確認最多', recent: '排序：最新擷取', figma: '排序：依 Figma' },allBoards: '全部畫板', sorts: { flow: '排序：App 流程', count: '排序：畫面最多', look: '排序：待確認最多', figma: '排序：依 Figma' }, search: '搜尋畫面、畫板或案例',
    shown: (n, m) => `${n} / ${m}`, none: '沒有符合篩選條件的畫面。', noPlan: '還沒有設計比對計畫：執行 node scripts/design.ts <feature> <platform> plan（figma 技能，references/conformance.md）。',
    meta: (n, c, s) => `${n} 個 Design 畫面 · 已擷取 ${c} · 規格 ${s}`, figma: 'Figma', app: 'App', noApp: '這台電腦沒有擷取圖', noFig: '這台電腦沒有 Figma 圖',
    reached: '到達方式', fit: { high: '直接', mid: '可能', low: '不精確' }, also: '另有', pre: '前置條件', action: '操作', via: '經由',
    run: '執行', open: '在 Figma 開啟', cases: '案例', cov: '覆蓋率', res: '結果', info: n => `${n} 個資訊項目（範例文字、Figma 沒有的 App 文字）`,
    showInfo: '顯示', hideInfo: '隱藏', nothing: '沒有量到差異。', notCaptured: '尚未擷取：依右側方式到達後擷取（device.ts … design <id>）。', close: '關閉',
    fitNote: (t, b) => `對齊位移：上 ${t} pt，下 ${b} pt`, allKinds: '全部差異', copy: n => `複製決定（${n}）`, copied: '已複製',
    bug: '問題', ok: '一致', na: '無法判定', ebug: '開 eBug', you: '你的決定', recheck: r => `複驗 ${r}`, build: '版本', boxes: '框線',
    doubt: (m, n) => `只找到 ${m} / ${n} 個 Figma 文字：這張擷取圖可能是別的狀態。`, part: n => `第 ${n} 段`, zoom: '點一下看原尺寸', dwhy: '為什麼不是問題（必填）', dwhyOpt: '備註（選填）',
    needDecWhy: n => `有 ${n} 個改成「一致」或「無法判定」的問題需要先填原因。`, colSet: '設定值', colDrawn: '畫面上', colDrawnT: '圖上實際畫出的顏色，取自像素', colDiff: (a, b) => `差異 ΔE：設定值 ${a}${b != null ? `，畫面上 ${b}` : ''}`, srcApp: 'App 資料', srcAppT: '取自 App 自身的 view 資料（精確值），不是截圖',
    viewsNote: (m, n, sc) => `App view 資料：配對的文字中 ${m} 段取得精確值（dump 共 ${n} 段文字）${sc !== 1 ? `；手機字型縮放為 ${sc}` : ''}。`,
    hiddenNote: n => `頁面原始碼中有 ${n} 段文字不在畫面上（在其他圖層下，或是按鈕的無障礙名稱），已排除。`,
    noOcr: '擷取圖未經文字辨識（OCR 只在 macOS 執行）：行數、文字大小與隱藏文字改用元件框判斷。',
    fontNote: (w, n) => `此平台呈現 Figma 字型平均${w < 1 ? '窄' : '寬'} ${Math.round(Math.abs(1 - w) * 100)}%（兩邊都辨識到的 ${n} 段文字）：文字大小以此為基準判斷。`, outNote: n => `${n} 個其他功能的區域不比對（Figma 圖上的虛線框）。`, outT: '其他功能：不比對',
    now: { fixed: '已修正', still: '仍存在', check: '需再看' }, designPath: 'Design 路徑', byArrows: '依 Design 箭頭到達',
    gap: '沒有任何測試表案例到達此畫面：分析需補上。', pfit: { path: '箭頭路徑', variant: '已到達畫面旁的狀態', entry: '流程的第一個畫面' },
    views: { plan: '計畫', results: '結果' }, scope: '範圍', reviewed: (d, n) => `已審查 ${d}${n ? ` · 之後新增 ${n} 個` : ''}`, notReviewed: '尚未審查',
    sFigma: 'Figma 讀取', sScreens: '畫面', sMeasured: '每張擷取圖自動量測', sLooked: '由兩輪審查人工檢視', sNot: '不在範圍內',
    boardsRead: (n, d) => `已讀取 ${n} 個畫板${d ? `，${d}` : ''}`, specSet: s => `規格 ${s}`,
    unread: '尚未讀取：此畫板的畫面不在計畫中。請先讀取再檢查，或註明原因排除。', partial: '讀取未完成：讀取完成前不含此畫板的畫面。', unreadS: '尚未讀取', partialS: '讀取未完成',
    included: '納入', excluded: '排除', noRoute: '無路徑', toLook: '需要你決定', lookT: r => r ? '範圍審查後新增：請選納入或排除。' : '有標記的畫面：看完每行的說明後選納入或排除。', decided: '已決定', changed: '你的變更',
    measured: ['文案：每個 Figma 文字對照 App 文字', '缺少的文字與圖示控制項', '截斷（「…」或超出邊界）', '換行（行數）', '位置（上下對齊後）', '填色與文字顏色', '到達：擷取圖是否為該畫面的狀態'],
    looked: ['圖示繪製與圖片', '字重與字級', '圓角、陰影與框線', '比對圖上其他可見差異'],
    notCov: ['已排除的畫面與畫板（每行附原因）', '動畫、動態與時間', '畫面以外的語言與外觀模式', '無法製造出狀態的畫面（執行時註明）'],
    flagN: { area: '路徑不精確', variant: '需製造狀態', drawing: '非完整畫面', gap: '測試表缺口' },
    yourCall: '需要你決定：',
    ask: { area: '到這裡的測試案例只按了許多畫面共用的控制項（返回、關閉、底部分頁），所以只會到這一區，不一定是這個確切狀態。執行時需手動製造畫面上畫的狀態（錯誤、空清單等）。做得到就選「納入」，做不到就選「排除」。',
      variant: '畫在已到達畫面旁的狀態，執行時在那裡製造。做得到就選「納入」，做不到就選「排除」。',
      drawing: '不是完整的手機畫面，而是單獨畫出的卡片或細節。它的文字仍會在真實畫面出現處比對，所以通常選「排除」（僅為示意）。',
      gap: '還沒有測試案例到達此畫面。選「納入」保留（分析會補案例）；不在本次版本就選「排除」。',
      noroute: '找不到到達此畫面的方式。選「排除」，或選「納入」並在對話中說明怎麼到。',
      fresh: '上次範圍審查之後才加到 Figma。' },
    psave: (n, left) => left ? `儲存${n ? `（${n}）` : ''} · 還有 ${left} 個待決定` : n ? `儲存並完成審查（${n}）` : '已儲存',
    save: n => `儲存決定（${n}）`, saving: '儲存中…', saveFail: '無法儲存：',
    flagT: { area: '案例只到達該區域（共用控制項）；執行者需製造出畫面所示的狀態。', variant: '畫在已到達畫面旁：在那裡製造出此狀態。',
      drawing: '比手機窄：單獨畫出的卡片或細節。其文字仍會在卡片出現處比對。', gap: '沒有測試表案例到達：分析需補上。' },
    include: '納入', exclude: '排除', why: '原因（必填）', byBoard: r => `隨畫板排除：${r}`, excludeBoard: '排除畫板', includeBoard: '納入畫板',
    boardHidden: n => `此畫板有 ${n} 個畫面被篩選隱藏`,
    pcopy: n => `複製給對話${n ? `（${n}）` : ''}`, needWhy: n => `有 ${n} 項排除需要先填原因。`,
    phint: '紅色的行需要你決定：看完說明後選「納入」（要在手機上比對）或「排除」（填原因）。其他畫面也可以排除。按「儲存」會把選擇寫進設計比對計畫，iOS 與 Android 共用（兩者的 Design 畫面相同）；沒有紅色的行時，範圍即審查完成。若以檔案開啟，按鈕改為複製選擇，貼到對話中。',
    whys: ['已被較新的畫面取代', '僅為示意，非畫面', '無法製造出此狀態', '不在本次版本', '僅適用另一平台'],
    newFlag: '審查後新增', dpath: 'Design 路徑' },
};
const t = k => T[L][k] ?? T.en[k];
const ST = ['differs', 'question', 'unreviewed', 'matches', 'not-captured', 'no-route', 'excluded'];
const STN = { en: { differs: 'Differs', question: 'Question', unreviewed: 'Unreviewed', matches: 'Matches', 'not-captured': 'Not captured', 'no-route': 'No route', excluded: 'Excluded' },
  zh: { differs: '有差異', question: '待確認', unreviewed: '未審查', matches: '一致', 'not-captured': '未擷取', 'no-route': '無路徑', excluded: '排除' } };
const COL = s => `var(--${({ differs: 'differs', question: 'question', unreviewed: 'unreviewed', matches: 'matches' })[s] ?? 'none'})`;
const VN = { en: { bug: 'Bug', question: 'Question', ok: 'OK', 'n/a': 'N/A', unreviewed: 'Unreviewed', info: 'Info' }, zh: { bug: '問題', question: '待確認', ok: '一致', 'n/a': '無法判定', unreviewed: '未審查', info: '資訊' } };
// Info and N/A in readable colours, not the faint grey (user, 2026-11-04)
const VC = v => `var(--${({ bug: 'differs', question: 'question', unreviewed: 'unreviewed', ok: 'matches', info: 'info', 'n/a': 'muted' })[v] ?? 'none'})`;
const KN = { en: { state: 'State', appearance: 'Dark / light', size: 'Text size', weight: 'Font weight', radius: 'Corner radius', padding: 'Padding', align: 'Centring', border: 'Border', spacing: 'Spacing', truncated: 'Truncated', control: 'Control', copy: 'Copy', missing: 'Missing', lines: 'Lines', position: 'Position', colour: 'Colour', extra: 'Extra text', sample: 'Sample text', visual: 'Visual' },
  zh: { state: '狀態', appearance: '深色／淺色', size: '文字大小', weight: '字重', radius: '圓角', padding: '內距', align: '置中', border: '邊框', spacing: '按鍵間距', truncated: '截斷', control: '控制項', copy: '文案', missing: '缺少', lines: '行數', position: '位置', colour: '顏色', extra: '多出文字', sample: '範例文字', visual: '視覺' } };
const PAGES = window.CASEBOOK?.pages ?? {};
let st = '', board = '', kind = '', q = '', open = null, showInfo = true, noBoxes = false;
const folded = new Set();   // verdict groups folded on the open comparison: kept when it is drawn again
// the user's decisions: run|screen|id → { v: bug | ok | n/a, ebug: true | false, why, b: the passes' verdict, w0: the
// saved reason }, each field only when it changes what findings.json holds; kept in this browser until saved
const DKEY = `design-decisions:${D.feature}:${D.platform}`;
let DEC = {}; try { DEC = JSON.parse(localStorage.getItem(DKEY) || '{}'); } catch (e) {}
const saveDec = () => { try { localStorage.setItem(DKEY, JSON.stringify(DEC)); } catch (e) {} copyBtn(); };
const dkey = (s, it) => `${s.run}|${s.id}|${it.id}`;
function copyBtn() {
  const n = Object.keys(DEC).length, b = $('copy');
  // always there, greyed out with nothing to save, so the bar does not shift (user, 2026-11-04)
  b.disabled = !n; b.textContent = D.live ? t('save')(n) : t('copy')(n);
}
$('copy').onclick = async () => {
  const lines = [`DESIGN DECISIONS ${D.feature} ${D.platform}`];
  const whyOf = d => (d.why ?? d.w0 ?? '').replace(/\s+/g, ' ').trim();
  const bad = Object.values(DEC).filter(d => d.b === 'bug' && (d.v === 'ok' || d.v === 'n/a') && !whyOf(d));
  if (bad.length) { alert(t('needDecWhy')(bad.length)); return; }
  for (const [k, d] of Object.entries(DEC)) { const [run, scr, id] = k.split('|'), v = d.v ?? d.b;
    if (v && (d.v || d.why !== undefined)) lines.push(`${run} ${scr} ${id}: ${v}${whyOf(d) ? `: ${whyOf(d)}` : ''}`);
    if (d.ebug === true) lines.push(`${run} ${scr} ${id}: eBug`); else if (d.ebug === false) lines.push(`${run} ${scr} ${id}: no eBug`); }
  if (D.live) {
    $('copy').disabled = true; $('copy').textContent = t('saving');
    try { await post('decide', lines.join('\n')); DEC = {}; saveDec(); location.reload(); } catch (e) { alert(`${t('saveFail')}\n${e.message}`); $('copy').disabled = false; copyBtn(); }
    return;
  }
  try { await navigator.clipboard.writeText(lines.join('\n')); $('copy').textContent = t('copied'); setTimeout(copyBtn, 1500); } catch (e) { prompt('', lines.join('\n')); }
};
$('kind').onchange = e => { kind = e.target.value; grid(); };
$('q').oninput = e => { q = e.target.value.trim().toLowerCase(); grid(); };
$('board').onchange = e => { board = e.target.value; grid(); };

// a Figma image: the crop as is, or the board screenshot cut to the screen (width, left and margin-top in % of the
// frame's width, so the cut holds whatever height the frame has)
function fig(f, lazy = true) {
  if (!f) return '';
  const ld = lazy ? ' loading="lazy"' : '';
  if (!f.crop) return `<img src="${esc(f.src)}" alt=""${ld}>`;
  const [x, y, w] = f.crop, k = 100 / w;
  return `<img class="cut" src="${esc(f.src)}" alt=""${ld} style="width:${f.iw * k}%;left:${-x * k}%;top:0;margin-top:${-y * k}%">`;
}
// ---- Plan view ----------------------------------------------------------------------------------------------------
// the user's scope choices: screen or board id → { x: excluded, why }, kept in this browser until copied to the chat
const VKEY = `design-view:${D.feature}:${D.platform}`, SKEY = `design-scope:${D.feature}`;
let view = 'plan'; try { view = localStorage.getItem(VKEY) || (D.screens?.some(s => s.run) ? 'results' : 'plan'); } catch (e) {}
let SC = {}; try { SC = JSON.parse(localStorage.getItem(SKEY) || '{}'); } catch (e) {}
const saveSc = () => { try { localStorage.setItem(SKEY, JSON.stringify(SC)); } catch (e) {} };
let pst = '', pboard = '', pq = '', psort = 'flow';
const pkeep = new Set();   // boards pressed on this page: kept in the list under any filter
try { psort = localStorage.getItem('design-sort') || 'flow'; } catch (e) {}
// needs a decision: before the scope review every flagged or unroutable screen, after it only the screens new since;
// pressing Include or Exclude on it (or excluding its board) is the decision, kept here until saved
const flaggedOf = s => D.review ? D.review.fresh.includes(s.id) : s.flags.length > 0 || s.status === 'no-route';
const lookOf = s => flaggedOf(s) && !SC[s.id] && !exOf(s) && !D.included?.includes(s.id);
// boards in the chosen order; in flow order a board goes where its earliest-reached screen is, and its screens follow the flow
const lastFlow = 1e9, flowOf = s => s.flow ?? lastFlow;
const boardOrder = () => { const S = D.screens, of = b => S.filter(s => s.board_id === b.id), key = {
    flow: b => Math.min(lastFlow, ...of(b).map(flowOf)), count: b => -of(b).length, look: b => -of(b).filter(lookOf).length, figma: () => 0 }[psort] ?? (() => 0);
  return D.boards.map((b, i) => [b, key(b), i]).sort((a, c) => a[1] - c[1] || a[2] - c[2]).map(x => x[0]); };
const screenOrder = list => psort === 'flow' ? list.map((s, i) => [s, i]).sort((a, c) => flowOf(a[0]) - flowOf(c[0]) || a[1] - c[1]).map(x => x[0]) : list;
const was = id => D.skip?.includes(id) ? { x: true, why: D.reasons?.[id] ?? '' } : { x: false, why: '' };
const now = id => SC[id] ?? was(id);
const changedIds = () => Object.keys(SC).filter(id => SC[id].x !== was(id).x || (SC[id].x && SC[id].why !== was(id).why) || SC[id].d);
// a screen is excluded by its own choice or its board's
const exOf = s => now(s.id).x ? { by: 'screen', why: now(s.id).why } : now(s.board_id).x ? { by: 'board', why: now(s.board_id).why } : null;
const isChanged = s => changedIds().includes(s.id) || changedIds().includes(s.board_id);
$('pboard').onchange = e => { pboard = e.target.value; planList(); };
$('psort').onchange = e => { psort = e.target.value; try { localStorage.setItem('design-sort', psort); } catch (e) {} planView(); };
$('pq').oninput = e => { pq = e.target.value.trim().toLowerCase(); planList(); };
// Save (served live): the choices go to design.ts scope, which writes plan.json; the scope counts as reviewed once no
// screen still needs a decision. Opened as a file, the same block is copied for the chat instead.
const pbtn = () => { const n = changedIds().length, left = D.screens.filter(lookOf).length, b = $('pcopy');
  b.textContent = D.live ? t('psave')(n, left) : t('pcopy')(n); b.disabled = D.live && !n && (left || D.review); b.classList.toggle('go', !!n && !left); };
// a saved choice is gone from this browser; the page then shows what plan.json holds
const post = async (cmd, block) => { const r = await fetch(`apply/${cmd}`, { method: 'POST', headers: { 'content-type': 'text/plain' }, body: block });
  const j = await r.json().catch(() => ({ error: r.statusText })); if (!r.ok || j.error) throw new Error(j.error || r.statusText); return j; };
$('pcopy').onclick = async () => {
  const ids = changedIds(), bad = ids.filter(id => SC[id].x && !SC[id].why.trim());
  if (bad.length) { alert(t('needWhy')(bad.length)); return; }
  const done = !D.screens.some(lookOf);
  const block = [`DESIGN SCOPE ${D.feature} both`, ...ids.map(id => SC[id].x ? `exclude ${id}: ${SC[id].why.trim()}` : `include ${id}`), ...(done ? ['reviewed'] : [])].join('\n');
  if (D.live) {
    $('pcopy').disabled = true; $('pcopy').textContent = t('saving');
    try { await post('scope', block); SC = {}; saveSc(); location.reload(); } catch (e) { alert(`${t('saveFail')}\n${e.message}`); pbtn(); }
    return;
  }
  try { await navigator.clipboard.writeText(block); $('pcopy').textContent = t('copied'); setTimeout(pbtn, 1500); } catch (e) { prompt('', block); }
};
// a choice re-renders the list: keep the page where it was
const keepScroll = f => { const y = scrollY; f(); scrollTo(0, y); };
function planView() {
  const S = D.screens, inc = S.filter(s => !exOf(s) && s.status !== 'no-route'), ex = S.filter(s => exOf(s));
  const fl = f => inc.filter(s => s.flags.includes(f)).length, last = D.boards.map(b => b.read_at).sort().at(-1);
  const per = b => S.filter(s => s.board_id === b.id).length;
  $('scope').innerHTML = `<div class="sh"><h2>${esc(t('scope'))}</h2>${D.review ? `<span class="badge ok">${esc(t('reviewed')(D.review.at, D.review.fresh.length))}</span>` : `<span class="badge todo">${esc(t('notReviewed'))}</span>`}</div>
    <div class="sgrid">
      <div><b>${esc(t('sFigma'))}</b>${esc(t('boardsRead')(D.boards.length, last ? last.slice(0, 10) : ''))} · ${esc(t('specSet')(D.spec_set))}
        <ul>${[...boardOrder(), ...D.gaps.unread.filter(g => !D.boards.some(b => b.id === g.id))].map(b => {
          const k = D.gaps.unread.some(g => g.id === b.id) ? 'unread' : D.gaps.incomplete.some(g => g.id === b.id) ? 'partial' : '';
          const name = D.file ? `<a href="https://www.figma.com/design/${esc(D.file)}?node-id=${esc(b.id.replace(':', '-'))}" target="_blank" rel="noopener">${esc(b.name)}</a>` : esc(b.name);
          return `<li${k ? ` title="${esc(t(k))}"` : ''}>${name} ${k ? `<span class="gapnote">⚠ ${esc(t(k + 'S'))}</span>` : `<span class="more">· ${per(b)}</span>`}</li>`; }).join('')}</ul>
        ${D.gaps.unread.length + D.gaps.incomplete.length ? `<p class="more">⚠ ${esc([D.gaps.unread.length ? t('unread') : '', D.gaps.incomplete.length ? t('partial') : ''].filter(Boolean).join(' '))}</p>` : ''}</div>
      <div><b>${esc(t('sScreens'))}</b><div class="nums"><span><b>${inc.length}</b> ${esc(t('included'))}</span><span><b>${ex.length}</b> ${esc(t('excluded'))}</span>${S.filter(s => s.status === 'no-route').length ? `<span><b>${S.filter(s => s.status === 'no-route').length}</b> ${esc(t('noRoute'))}</span>` : ''}</div>
        <ul>${['area', 'variant', 'drawing', 'gap'].filter(fl).map(f => `<li title="${esc(t('flagT')[f])}">${esc(t('flagN')[f])}: ${fl(f)}</li>`).join('')}</ul></div>
      <div><b>${esc(t('sMeasured'))}</b><ul>${t('measured').map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
      <div><b>${esc(t('sLooked'))}</b><ul>${t('looked').map(x => `<li>${esc(x)}</li>`).join('')}</ul>
        <b style="margin-top:8px">${esc(t('sNot'))}</b><ul>${t('notCov').map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
    </div>`;
  const look = lookOf;
  // Included is left out while it equals All; Needs a look says why in its tooltip
  const why = S.filter(look), dec = S.filter(flaggedOf).length - why.length, whyT = [...['area', 'variant', 'drawing', 'gap'].map(f => [t('flagN')[f], why.filter(s => s.flags.includes(f)).length]),
    [t('noRoute'), why.filter(s => s.status === 'no-route').length], [t('newFlag'), D.review ? why.length : 0]].filter(x => x[1]).map(([l, n]) => `${l} ${n}`).join(' · ');
  const cs = [['', t('all'), S.length], ['look', t('toLook'), why.length, `${t('lookT')(!!D.review)}${whyT ? `\n${whyT}` : ''}`], ['dec', t('decided'), dec], ['inc', t('included'), inc.length], ['ex', t('excluded'), ex.length], ['chg', t('changed'), S.filter(isChanged).length]];
  $('pchips').innerHTML = cs.map(([k, l, n, tt]) => `<button type="button" class="chip" data-p="${k}" aria-pressed="${pst === k}"${k && !n && pst !== k ? ' disabled' : ''}${tt ? ` title="${esc(tt)}"` : ''}>${esc(l)} <span class="n">${n}</span></button>`).join('')
    + (pst === 'look' && whyT ? `<span class="more">${esc(whyT)}</span>` : '');
  $('pchips').querySelectorAll('.chip').forEach(b => b.onclick = () => { pst = b.dataset.p; planView(); });
  $('pboard').innerHTML = `<option value="">${esc(t('allBoards'))}</option>` + boardOrder().map(b => `<option value="${esc(b.id)}"${b.id === pboard ? ' selected' : ''}>${esc(b.name)}</option>`).join('');
  $('psort').innerHTML = Object.entries(t('sorts')).map(([k, l]) => `<option value="${k}"${k === psort ? ' selected' : ''}>${esc(l)}</option>`).join('');
  $('pq').placeholder = t('search'); $('phint').textContent = t('phint'); pbtn();
  $('whys').innerHTML = t('whys').map(w => `<option value="${esc(w)}">`).join('');
  planList();
}
function planList() {
  const look = lookOf;
  const list = screenOrder(D.screens).filter(s => (!pboard || s.board_id === pboard)
    && (!pst || (pst === 'look' ? look(s) : pst === 'dec' ? flaggedOf(s) && !look(s) : pst === 'inc' ? !exOf(s) && s.status !== 'no-route' : pst === 'ex' ? !!exOf(s) : isChanged(s)))
    && (!pq || `${s.name} ${s.board} ${s.id} ${s.route?.case ?? ''}`.toLowerCase().includes(pq)));
  $('pcount').textContent = t('shown')(list.length, D.screens.length);
  const dc = (id, x, why, board, open) => `<div class="dc" data-k="${esc(id)}"><button type="button" data-x="0" aria-pressed="${!open && !x}">${esc(board ? t('includeBoard') : t('include'))}</button><button type="button" data-x="1" aria-pressed="${x}">${esc(board ? t('excludeBoard') : t('exclude'))}</button>
    ${x ? `<input type="text" list="whys" required placeholder="${esc(t('why'))}" value="${esc(why)}">` : ''}</div>`;
  // a board pressed on this page stays listed whatever the filter, so its other button can undo the press: under
  // "To look", Exclude board decided every screen and the whole board left the list with its Include button (user, 2026-11-04)
  const groups = boardOrder().filter(b => (!pboard || b.id === pboard) && (list.some(s => s.board_id === b.id) || pkeep.has(b.id)));
  $('pl').innerHTML = groups.length ? groups.map(b => { const bx = now(b.id), shown = list.filter(s => s.board_id === b.id).length, all = D.screens.filter(s => s.board_id === b.id);
    return `<section class="pb"><div class="pbh"><h3>${esc(b.name)}</h3><span class="more">${shown} / ${all.length}</span>${dc(b.id, bx.x, bx.why, true, all.some(look))}</div>
    ${shown ? '' : `<p class="more">${esc(t('boardHidden')(all.length))}</p>`}
    ${list.filter(s => s.board_id === b.id).map(s => { const e = exOf(s), own = now(s.id), r = s.route;
      const route = r && r.how === 'figma' ? `<b>${esc(t('dpath'))}</b> ${esc(r.action)}` : r ? `<b>${esc(r.case)}</b> · ${esc(t('fit')[r.fit] ?? r.fit)}${r.edge ? ` · ${esc(t('via'))} ${esc(r.edge)}` : ''}` : esc(s.why);
      const todo = look(s), reasons = [...s.flags, ...(s.status === 'no-route' ? ['noroute'] : []), ...(D.review?.fresh.includes(s.id) ? ['fresh'] : [])];
      return `<div class="pr${e ? ' x' : todo ? ' todo' : flaggedOf(s) ? ' flag' : ''}${isChanged(s) ? ' chg' : ''}" data-id="${esc(s.id)}">
        <button type="button" class="tn" data-open aria-label="${esc(s.name)}">${fig(s.figma)}</button>
        <div><button type="button" class="nm" data-open>${esc(s.name)}</button><div class="id">${esc(s.id)} · ${Math.round(s.w)}×${Math.round(s.h)}</div></div>
        <div class="rt">${route}<div>${s.flags.map(f => `<span class="fl" title="${esc(t('flagT')[f])}">${esc(t('flagN')[f])}</span>`).join('')}${D.review?.fresh.includes(s.id) ? `<span class="fl">${esc(t('newFlag'))}</span>` : ''}</div></div>
        ${e?.by === 'board' ? `<div class="byb">${esc(t('byBoard')(e.why))}</div>` : dc(s.id, own.x, own.why, false, todo)}
        ${flaggedOf(s) && !e ? `<div class="ask">${todo ? `<b>${esc(t('yourCall'))}</b> ` : ''}${reasons.map(f => esc(t('ask')[f] ?? '')).join(' ')}</div>` : ''}</div>`; }).join('')}</section>`; }).join('') : `<p class="empty">${esc(t('none'))}</p>`;
  $('pl').querySelectorAll('[data-open]').forEach(b => b.onclick = () => { location.hash = `screen=${encodeURIComponent(b.closest('.pr').dataset.id)}`; });
  $('pl').querySelectorAll('.dc').forEach(d => { const k = d.dataset.k;
    d.querySelectorAll('button').forEach(b => b.onclick = () => { const x = b.dataset.x === '1';
      const fl = D.screens.some(s => s.id === k && flaggedOf(s)), board = D.boards.some(bd => bd.id === k);
      SC[k] = { x, why: x ? (now(k).why || '') : '', ...(fl ? { d: 1 } : {}) }; if (!fl && SC[k].x === was(k).x && SC[k].why === was(k).why) delete SC[k];
      // Include board also includes every screen of the board still waiting for a decision (a board is included by
      // default, so the press alone changed nothing); screens excluded one by one keep their own choice
      if (board) { pkeep.add(k); if (!x) for (const s of D.screens) if (s.board_id === k && lookOf(s)) SC[s.id] = { x: false, why: '', d: 1 }; }
      saveSc(); keepScroll(planView);
      if (x) $('pl').querySelector(`.dc[data-k="${CSS.escape(k)}"] input`)?.focus(); });
    // the reason is kept as it is typed, without drawing the list again: a redraw on blur (`change`) replaced the
    // button the user was pressing next, so that click was lost (user, 2026-11-04)
    d.querySelector('input') && (d.querySelector('input').oninput = e => { SC[k] = { ...SC[k], x: true, why: e.target.value }; if (!SC[k].d && SC[k].why === was(k).why && was(k).x) delete SC[k]; saveSc(); pbtn();
      d.closest('.pr')?.classList.toggle('chg', changedIds().includes(k)); }); });
}
// Time and plan usage of the design check (design-page.ts usageData): the Progress page's table, one row per run with
// design work, and under a casebook run the run its captures rode on (the same figure as Progress). Served live, the
// page fetches usage.json every 10 s and redraws only this table, so open comparisons and unsaved decisions stay put.
const tx = (en, zh) => L === 'zh' ? zh : en;
const hm = ms => `${Math.floor(ms / 3600000)}h ${String(Math.round(ms / 60000) % 60).padStart(2, '0')}m`;
const tok = n => n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${Math.round(n / 1e3)}k` : String(n);
const tokAll = u => u.input + u.cacheWrite + u.cacheRead + u.output;
const num = n => n.toLocaleString('en-US');
const tokTitle = u => tx(`${u.messages} msgs · input ${num(u.input)} · cache write ${num(u.cacheWrite)} · cache read ${num(u.cacheRead)} · output ${num(u.output)}`,
  `${u.messages} 則訊息 · 輸入 ${num(u.input)} · 快取寫入 ${num(u.cacheWrite)} · 快取讀取 ${num(u.cacheRead)} · 輸出 ${num(u.output)}`);
const fmtP = v => v < 9.95 ? `${v.toFixed(1)}%` : `${Math.round(v)}%`;
const pct = (v, approx, none) => v == null ? `<span class="none">${none}</span>` : `${approx ? '≈' : ''}${Math.round(v)}%`;
const utc = s => esc(String(s).slice(5, 16).replace('T', ' '));
const seatLabel = s => !s ? '' : (s.seats?.length ? s.seats.map(m => m === 1 ? 'Pro 1×' : `${m}× Pro`).join(' + ') : tx('seat unknown', '席位不明')) + (s.readings ? '' : `, ${tx('no readings', '無讀數')}`);
const seatEq = (v, s) => { const m = s?.seats?.length === 1 && s.seats[0] !== 1 ? s.seats[0] : null; return m && v != null ? `<span class="eq">${tx(`= ${fmtP(v / m)} of ${m}× seat`, `= ${m}× 席位的 ${fmtP(v / m)}`)}</span>` : ''; };
function renderUsage() {
  const U = D.usage, el = $('usage');
  if (!U) { el.hidden = true; return; }
  el.hidden = false;
  const runs = U.runs, ps = runs.filter(r => r.design), live = runs.some(r => r.live || (r.run && r.runLive)), C = U.calibration;
  const estCells = (s, eq = true) => `<td class="n est">${s.est5 == null ? `<span class="none">${s.noTokens ? tx('no token data yet', '尚無 token 資料') : tx('no calibration', '未校準')}</span>` : fmtP(s.est5) + (eq ? seatEq(s.est5, s) : '')}</td><td class="n est">${s.estW == null ? '<span class="none">—</span>' : '~' + fmtP(s.estW) + (eq ? seatEq(s.estW, s) : '')}</td>`;
  const acctCells = (h5, wk, approx) => `<td class="n acct">${pct(h5, approx, '—')}</td><td class="n acct">${pct(wk, approx, '—')}</td>`;
  const gaps = n => tx(`${n} gap${n > 1 ? 's' : ''}`, `${n} 段閒置`);
  const row = (label, seat, s, cls = '') => `<tr class="${cls}"><td>${label}</td><td>${esc(seat.split(', ')[0])}${seat.includes(', ') ? `<span class="eq">${esc(seat.split(', ').slice(1).join(', '))}</span>` : ''}</td><td class="n">${hm(s.wall)}</td><td class="n">${hm(s.test)}</td><td class="n">${hm(s.idle)}${s.gaps ? `<span class="eq">${gaps(s.gaps)}</span>` : ''}</td><td class="n" title="${esc(tokTitle(s.tokens))}">${tok(tokAll(s.tokens))}${s.wt != null ? `<span class="eq">${tx('wtd', '加權')} ${tok(s.wt)}</span>` : ''}</td>`;
  const full = (label, s, cls = '', eq = true) => row(label, cls === 'sub' ? '' : seatLabel(s), s, cls) + estCells(s, eq) + acctCells(s.fiveHour, s.weekly, s.approx) + '</tr>';
  const kind = r => r.kind === 'pass' ? tx('design pass', '設計比對專跑') : tx(`casebook run${r.phase ? ` ${r.phase}` : ''}`, `測試表執行${r.phase ? ` ${r.phase}` : ''}`);
  const caps = r => r.auto || r.hand ? tx(` · captures: ${r.auto} automatic, ${r.hand} by hand`, ` · 擷取：自動 ${r.auto}、手動 ${r.hand}`) : '';
  const dot = on => on ? ' <span class="live"><i></i></span>' : '';
  const body = runs.map(r => (r.design ? full(`<b>${esc(r.id)}</b>${dot(r.live)}<span class="eq">${esc(kind(r) + caps(r))}</span><span class="eq">${utc(r.design.from)} → ${utc(r.design.to)} UTC</span>`, r.design)
      : `<tr><td><b>${esc(r.id)}</b><span class="eq">${esc(kind(r) + caps(r))}</span></td><td colspan="9" class="none">${tx('no design work timed yet', '尚未記錄設計比對的作業時間')}</td></tr>`)
    + (r.run ? full(`${tx('Run the captures rode on (same as Progress, not added)', '擷取圖附帶的這次執行（與「進度」頁相同，不相加）')}${dot(r.runLive)}<span class="eq">${utc(r.run.from)} → ${utc(r.run.to)} UTC · ${esc(seatLabel(r.run))}</span>`, r.run, 'sub', false) : '')).join('');
  const sum = k => ps.some(p => p.design[k] != null) ? ps.reduce((a, p) => a + (p.design[k] ?? 0), 0) : null;
  const z = { wall: 0, test: 0, idle: 0, gaps: 0, tokens: { input: 0, cacheWrite: 0, cacheRead: 0, output: 0, messages: 0 } };
  for (const p of ps) { for (const k of ['wall', 'test', 'idle', 'gaps']) z[k] += p.design[k]; for (const k in z.tokens) z.tokens[k] += p.design.tokens[k]; }
  const outside = U.outside5 || U.outsideW ? `<tr><td>${tx('Outside the design check', '設計比對以外')}</td><td></td><td class="n">—</td><td class="n">—</td><td class="n">—</td><td class="n">—</td><td class="n est">—</td><td class="n est">—</td>${acctCells(U.outside5, U.outsideW, U.approx)}</tr>` : '';
  const total = ps.length > 1 ? row(tx('Design check total', '設計比對合計'), '', { ...z, wt: sum('wt') }, 'tot round') + estCells(ps.every(p => p.design.noTokens) ? { est5: null, estW: null, noTokens: true } : { est5: sum('est5'), estW: sum('estW') }) + acctCells(sum('fiveHour'), sum('weekly'), ps.some(p => p.design.approx)) + '</tr>' : '';
  const acctTitle = tx("Snapshot increments during the design check's active time, including other users of the account", '設計比對期間帳號用量快照的增加量，包含帳號的其他使用者');
  const head = `<thead><tr><th rowspan="2">${tx('Run', '執行')}</th><th rowspan="2">${tx('Account', '帳號')}</th><th class="n" rowspan="2">${tx('Wall', '總時長')}</th><th class="n" rowspan="2">${tx('Test', '測試')}</th><th class="n" rowspan="2">${tx('Idle &gt;15 min', '閒置 &gt;15 分')}</th><th class="n" rowspan="2">${tx('Claude tokens', 'Claude token')}</th><th class="grp" colspan="2">${tx('Est. from token rate, % of 1× Pro', '依 token 率估計（1× Pro 的 %）')}</th><th class="grp acct" colspan="2">${tx('Account total (shared), % of 1× Pro', '帳號合計（共用，1× Pro 的 %）')}</th></tr>
    <tr><th class="n">${tx('5-hour', '5 小時')}</th><th class="n">${tx('Weekly (rough)', '每週（粗估）')}</th><th class="n acct" title="${acctTitle}">${tx('5-hour', '5 小時')}</th><th class="n acct" title="${acctTitle}">${tx('Weekly', '每週')}</th></tr></thead>`;
  const rateStr = C && C.rate != null ? (C.rate * 1e6).toFixed(2) : '?', w = U.weights;
  const notes = [
    tx(`<span><b>Same figures as Progress.</b> A design row is the Claude messages of the sessions that name the run folder, inside the design check's active time: <code>design/activity.log</code> (every design.ts command on the run) and its result files; a design pass on its own also counts its captures and taps. Tokens come from the run folder's <code>tokens.jsonl</code> like Progress. Automatic captures in a casebook run cost no call of their own; that run's own row under it is the Progress figure and is not added to the total.</span>`,
      `<span><b>與「進度」頁相同的算法。</b>設計比對列 = 提到該執行資料夾的工作階段中、落在設計比對作業時間內的 Claude 訊息：<code>design/activity.log</code>（每個在該執行上的 design.ts 指令）與結果檔；設計比對專跑另含擷取與點擊。token 與「進度」頁一樣取自該資料夾的 <code>tokens.jsonl</code>。測試表執行中的自動擷取不另外花費呼叫；其下方的執行列即「進度」頁的數字，不計入合計。</span>`),
    C ? tx(`<span><b>Est. from token rate.</b> ${esc(C.source || C.basis)} = ${C.fiveHourPct * (C.seat || 1)}% of a 1× Pro 5-hour window for ${esc(C.basis)}'s ${tok(C.basisWt)} weighted tokens: ${rateStr}% per million weighted tokens (weights: input ${w.input}, cache write ${w.cacheWrite}, cache read ${w.cacheRead}, output ${w.output}); weekly × ${C.weekRatio != null ? C.weekRatio.toFixed(3) : '?'}. "= N% of an N× seat" divides by the seat size the row ran on.</span>`,
      `<span><b>依 token 率估計。</b>${esc(C.source || C.basis)} = ${esc(C.basis)} 的 ${tok(C.basisWt)} 加權 token 用掉 1× Pro 5 小時額度的 ${C.fiveHourPct * (C.seat || 1)}%：每百萬加權 token ${rateStr}%（權重：輸入 ${w.input}、快取寫入 ${w.cacheWrite}、快取讀取 ${w.cacheRead}、輸出 ${w.output}）；每週 × ${C.weekRatio != null ? C.weekRatio.toFixed(3) : '?'}。「= N× 席位的 N%」是再除以該列所用帳號的席位大小。</span>`)
      : tx('<span><b>No calibration</b> (<code>runs/usage-calibration.json</code>): tokens only.</span>', '<span><b>尚未校準</b>（<code>runs/usage-calibration.json</code>）：只顯示 token。</span>'),
    tx(`<span><b>Account total (shared) is muted on purpose:</b> the account's snapshot increments (<code>runs/usage.jsonl</code>, ${U.snapshots} readings) during the active time, split between rows by weighted tokens; other users of the account are in it too.</span>`,
      `<span><b>帳號合計（共用）刻意淡化顯示：</b>作業期間帳號用量快照（<code>runs/usage.jsonl</code>，${U.snapshots} 筆讀數）的增加量，依加權 token 分給各列；帳號其他使用者的用量也在其中。</span>`),
  ];
  el.innerHTML = `<h2 id="usage-h">${tx('Time and plan usage · design check', '時間與方案用量 · 設計比對')}${live ? `<span class="live"><i></i>${tx('live', '即時')}</span>` : ''}</h2>`
    + `<div class="tbl"><table>${head}<tbody>${runs.length ? body + outside + total : `<tr><td colspan="10" class="none">${tx('No design work recorded yet: the figures start with the first capture or design.ts command on a run folder.', '尚未記錄設計比對的工作：數字從執行資料夾的第一張擷取圖或第一個 design.ts 指令開始。')}</td></tr>`}</tbody></table></div>`
    + `<details class="how"${usageHow ? ' open' : ''}><summary>${tx('How these figures are computed', '這些數字怎麼算')}</summary><div class="notes">${notes.join('')}</div></details>`;
  el.querySelector('details.how').ontoggle = e => { usageHow = e.target.open; };
}
let usageHow = false;
if (D.live) setInterval(async () => { try { const r = await fetch('usage.json', { cache: 'no-store' }); if (r.ok) { D.usage = await r.json(); (window.CASEBOOK?.quiet ?? (f => f()))(renderUsage); } } catch (e) {} }, 10000);
function render() {
  document.querySelectorAll('.lang button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.l === L)));
  $('eyebrow').textContent = t('eyebrow'); $('h1').textContent = t('title')(D.title); $('q').placeholder = t('search');
  if (D.missing) { $('meta').textContent = t('noPlan'); $('resv').hidden = true; return; }
  renderUsage();
  $('views').innerHTML = ['plan', 'results'].map(v => `<button type="button" data-v="${v}" aria-pressed="${view === v}">${esc(t('views')[v])}</button>`).join('');
  $('views').querySelectorAll('button').forEach(b => b.onclick = () => { view = b.dataset.v; try { localStorage.setItem(VKEY, view); } catch (e) {} render(); });
  $('planv').hidden = view !== 'plan'; $('resv').hidden = view !== 'results';
  if (view === 'plan') planView();
  const n = s => D.screens.filter(x => x.status === s).length;
  $('meta').textContent = t('meta')(D.screens.length, D.screens.filter(s => s.run).length, D.spec_set);
  $('bar').innerHTML = ST.map(s => n(s) ? `<span style="width:${100 * n(s) / D.screens.length}%;background:${COL(s)}" title="${esc(STN[L][s])} ${n(s)}"></span>` : '').join('');
  // every status chip always shown (greyed out at 0), like the Plan view, so the bar does not shift
  // Captured: every screen run on the phone, whatever its result, beside Not captured (user, 2026-11-05)
  $('chips').innerHTML = [['', t('all'), D.screens.length], ['captured', t('captured'), D.screens.filter(s => s.run).length], ...ST.map(s => [s, STN[L][s], n(s)])].map(([k, l, c]) =>
    `<button type="button" class="chip" data-s="${k}" aria-pressed="${st === k}"${k && !c && st !== k ? ' disabled' : ''}>${k ? `<i style="background:${COL(k)}"></i>` : ''}${esc(l)} <span class="n">${c}</span></button>`).join('');
  $('chips').querySelectorAll('.chip').forEach(b => b.onclick = () => { st = b.dataset.s; render(); });
  const boards = [...new Set(D.screens.map(s => s.board))];
  $('board').innerHTML = `<option value="">${esc(t('allBoards'))}</option>` + boards.map(b => `<option${b === board ? ' selected' : ''}>${esc(b)}</option>`).join('');
  const kinds = [...new Set(D.screens.flatMap(s => s.items.filter(i => i.verdict !== 'ok' && i.verdict !== 'info').map(i => i.kind)))];
  $('kind').innerHTML = `<option value="">${esc(t('allKinds'))}</option>` + kinds.map(k => `<option value="${esc(k)}"${k === kind ? ' selected' : ''}>${esc(KN[L][k] ?? k)}</option>`).join('');
  $('rsort').innerHTML = Object.entries(t('rsorts')).map(([k, l]) => `<option value="${k}"${k === rsort ? ' selected' : ''}>${esc(l)}</option>`).join('');
  copyBtn(); grid(); if (open) detail(open);
}
// The Results order (user, 2026-11-05), each falling back to app flow and then the plan's Figma order: by state (the chip
// order, Differs first), by board (boards where their earliest screen comes in the app flow, screens in flow order),
// app flow (the cases.csv position of the row reaching the screen), most to look at (bugs, then questions and
// unreviewed items), latest capture first, or as in Figma (the plan's order, as the page had it before)
let rsort = 'status';
try { rsort = localStorage.getItem('design-rsort') || 'status'; } catch (e) {}
$('rsort').onchange = e => { rsort = e.target.value; try { localStorage.setItem('design-rsort', rsort); } catch (e) {} grid(); };
function resultOrder() {
  const S = D.screens, rank = s => ST.indexOf(s.status) < 0 ? ST.length : ST.indexOf(s.status);
  const bfirst = new Map(); for (const s of S) bfirst.set(s.board_id, Math.min(bfirst.get(s.board_id) ?? lastFlow, flowOf(s)));
  const bi = new Map(); S.forEach(s => { if (!bi.has(s.board_id)) bi.set(s.board_id, bi.size); });
  const nOf = (s, v) => s.items.filter(i => v.includes(i.verdict)).length;
  const key = { status: [rank], board: [s => bfirst.get(s.board_id), s => bi.get(s.board_id)], flow: [],
    look: [s => -nOf(s, ['bug']), s => -nOf(s, ['question', 'unreviewed']), rank], recent: [s => s.captured_at ? -Date.parse(s.captured_at) : Infinity],
    figma: null }[rsort in { status: 1, board: 1, flow: 1, look: 1, recent: 1, figma: 1 } ? rsort : 'status'];
  if (!key) return S;
  const ks = [...key, flowOf];
  return S.map((s, i) => [s, i]).sort((a, c) => { for (const k of ks) { const d = k(a[0]) - k(c[0]); if (d) return d; } return a[1] - c[1]; }).map(x => x[0]);
}
function grid() {
  const list = resultOrder()
    .filter(s => (!st || (st === 'captured' ? !!s.run : s.status === st)) && (!board || s.board === board)
    && (!kind || s.items.some(i => i.kind === kind && i.verdict !== 'ok' && i.verdict !== 'info'))
    && (!q || `${s.name} ${s.board} ${s.id} ${s.route?.case ?? ''}`.toLowerCase().includes(q)));
  $('count').textContent = t('shown')(list.length, D.screens.length);
  // by board: a heading over each board's cards
  const head = (s, i) => rsort === 'board' && (i === 0 || list[i - 1].board_id !== s.board_id)
    ? `<h3 class="gh">${esc(s.board)} <span class="more">${list.filter(x => x.board_id === s.board_id).length}</span></h3>` : '';
  $('grid').innerHTML = list.length ? list.map((s, i) => {
    const bugs = s.items.filter(i => i.verdict === 'bug').length, qs = s.items.filter(i => i.verdict === 'question' || i.verdict === 'unreviewed').length;
    return `${head(s, i)}<button type="button" class="card" data-id="${esc(s.id)}" style="border-top-color:${COL(s.status)}">
      <div class="thumb">${fig(s.figma)}</div>
      <span class="st"><i style="background:${COL(s.status)}"></i>${esc(STN[L][s.status])}${bugs ? ` · ${bugs}` : qs ? ` · ${qs}` : ''}</span>
      <span class="nm">${esc(s.name)}</span><span class="sub">${esc(s.board)}${s.route ? ` · ${esc(s.route.case || t('designPath'))}` : ''}</span></button>`;
  }).join('') : `<p class="empty">${esc(t('none'))}</p>`;
  $('grid').querySelectorAll('.card').forEach(c => c.onclick = () => { location.hash = `screen=${encodeURIComponent(c.dataset.id)}`; });
}
// an item's decision row: Bug / OK / N/A (the current verdict pressed), the eBug tick on a bug, and the reason once it
// is OK or N/A (required when it overturns a bug)
const effV = (s, it) => DEC[dkey(s, it)]?.v ?? it.verdict;
const effW = (s, it) => DEC[dkey(s, it)]?.why ?? it.why ?? '';
function decRow(s, it) {
  const k = dkey(s, it), v = effV(s, it), need = it.verdict === 'bug' && (v === 'ok' || v === 'n/a');
  const btns = [['bug', t('bug')], ['ok', t('ok')], ['n/a', t('na')]].map(([x, l]) => `<button type="button" data-v="${x}" aria-pressed="${v === x}">${esc(l)}</button>`).join('');
  const eb = v === 'bug' ? `<label><input type="checkbox" data-e${(DEC[k]?.ebug ?? !!it.ebug) ? ' checked' : ''}> ${esc(t('ebug'))}</label>` : '';
  const why = v === 'ok' || v === 'n/a' || effW(s, it) ? `<input type="text" class="why${need && !effW(s, it).trim() ? ' need' : ''}" data-w placeholder="${esc(need ? t('dwhy') : t('dwhyOpt'))}" value="${esc(effW(s, it))}">` : '';
  return `<div class="dec" data-k="${esc(k)}">${btns}${eb}${why}</div>`;
}
// the review notes in the page's language (user, 2026-11-04): each pass writes `note` (English) and `note_zh`; a note
// in one language only is shown as it is. The check's own notes and the settle split are fixed English, put into
// Chinese here.
const MN = { 'one text contains the other': '其中一段文字包含另一段', 'runs past the screen edge': '超出畫面邊緣', 'text colour': '文字顏色',
  'no tappable app element where Figma draws this control': 'Figma 畫此控制項的位置，App 沒有可點的元素',
  'the screen kept changing while it was captured: the app boxes may not match the screenshot; capture it again once still': '擷取時畫面仍在變動：App 的框線可能與截圖不符；請等畫面靜止後重新擷取',
  'number format differs': '數字格式不同',
  "text colour, the app's own value": '文字顏色（App 自身的設定值）', "fill, the app's own value": '填色（App 自身的設定值）',
  'the keyboard is up in the capture, Figma draws this screen without it: capture it again with the keyboard down': '擷取圖中鍵盤是開的，Figma 此畫面沒有鍵盤：請收起鍵盤後重新擷取',
  'Figma draws the keyboard up, the capture has it down: capture it again with the field focused': 'Figma 畫有鍵盤，擷取圖沒有：請點選輸入框後重新擷取' };
// the check's notes with values in them
const MNX = [[/^the app sets ([\d.]+) sp \((.*?)\), Figma (.*?)(; the phone's font scale ([\d.]+) is not in this)?$/, (m, sp, fam, f, x, sc) => `App 設定 ${sp} sp（${fam}），Figma 為 ${f}` + (sc ? `；未計入手機字型縮放 ${sc}` : '')],
  [/^the app draws weight (\d+) \((.*?)\), Figma (\d+) \((.*)\)$/, (m, a, fam, f, ff) => `App 字重 ${a}（${fam}），Figma 為 ${f}（${ff}）`],
  [/^corner radius ([\d.]+) dp in the app, ([\d.]+) in Figma$/, (m, a, f) => `圓角 App 為 ${a} dp，Figma 為 ${f}`],
  [/^the phone's font scale is ([\d.]+): wrapping at 1\.0 may differ$/, (m, sc) => `手機字型縮放為 ${sc}：在 1.0 時換行可能不同`],
[/^Figma draws this screen (dark|light), the capture is (dark|light)(.*)$/, (m, f, c, rest) => `Figma 此畫面為${f === 'dark' ? '深色' : '淺色'}，擷取圖為${c === 'dark' ? '深色' : '淺色'}` + (rest.includes('does not follow') && rest.includes('phone was in') && !rest.includes('capture it again') ? '：手機已是該模式，App 沒有跟著切換' : rest.includes('if the phone was') ? '：若手機已是該模式，表示 App 沒有跟著切換；否則請切換後重新擷取' : '：請切換手機模式後重新擷取')],
  [/^text (wider|narrower|taller|shorter) by (\d+) % than this platform's texts draw Figma's \(size, weight or font differs\); Figma sets (.*)$/, (m, d, n, f) => `文字比此平台一般呈現 Figma 字型時${({ wider: '寬', narrower: '窄', taller: '高', shorter: '矮' })[d]} ${n}%（大小、粗細或字型不同）；Figma 設定為 ${f}`]];
const mnx = t => { for (const [re, f] of MNX) { const m = t.match(re); if (m) return f(...m); } return null; };
const lang = (o, k) => L === 'zh' ? o[`${k}_zh`] || (o[k] && (MN[o[k]] ?? mnx(o[k]) ?? o[k].replace(/^only (\d+) of (\d+) Figma texts found: the capture may not be this frame's state$/, '只找到 $1 / $2 個 Figma 文字：擷取圖可能不是此畫面的狀態'))) || ''
  : o[k] || o[`${k}_zh`] || '';
const PASS = { builder: '建構者', reviewer: '審查者', skipped: '略過' };
const splitL = x => L === 'zh' ? x.replace(/\b(builder|reviewer|skipped)\b/g, m => PASS[m]).replace(/\b(bug|ok|n\/a|question|unreviewed)\b/g, m => VN.zh[m] ?? m) : x;
const decidedL = x => L === 'zh' ? x.replace(/^user /, '使用者 ') : x;
// one difference: number, kind, verdict, Figma vs app
const ORDER = { bug: 0, question: 1, unreviewed: 2, 'n/a': 3, ok: 4, info: 5 };
// the items of a comparison under one heading per verdict (Bug, Question, …, OK), each foldable; an item keeps its
// number, which is the number of its box on both images (colleague's request, 2026-11-04)
const groupsOf = list => { const g = []; list.forEach((it, n) => { const last = g[g.length - 1]; if (last && last[0] === it.verdict) last[1].push([it, n]); else g.push([it.verdict, [[it, n]]]); }); return g; };
function detail(id) {
  const s = D.screens.find(x => x.id === id); if (!s) return;
  if (open !== id) picked = null;
  open = id;
  const main = s.items.filter(i => i.verdict !== 'info').sort((a, b) => (ORDER[a.verdict] ?? 9) - (ORDER[b.verdict] ?? 9));
  const info = s.items.filter(i => i.verdict === 'info'), shown = showInfo ? [...main, ...info] : main;
  const k = s.k ? 1 / s.k : 1, aw = s.win ? s.win.w * (s.k ?? 1) : s.w, ah = s.win ? s.win.h * (s.k ?? 1) : s.h;
  // smaller boxes are drawn last, so a box inside another stays clickable
  const boxes = (side, w, h, out = []) => `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">${out.map(o => `<rect class="outa" x="${o.box[0]}" y="${o.box[1]}" width="${o.box[2]}" height="${o.box[3]}"><title>${esc(t('outT'))}: ${esc(o.name)}</title></rect>`).join('')}${shown.map((it, n) => [it[side]?.box, n, it]).filter(x => x[0])
    .sort((a, c) => c[0][2] * c[0][3] - a[0][2] * a[0][3]).map(([b, n, it]) =>
      `<rect class="box" data-n="${n}" x="${b[0]}" y="${b[1]}" width="${b[2]}" height="${b[3]}" style="stroke:${VC(it.verdict)}"><title>${n + 1} · ${esc(KN[L][it.kind] ?? it.kind)}</title></rect>`).join('')}</svg>`;
  // a colour as set (Figma's fill and its token, or the app's own value) and as drawn on the image, when sampled
  const hex = (c) => (c.length === 9 ? '#' + c.slice(3) : c).toUpperCase(), alphaOf = (c) => c.length === 9 && !/^#ff/i.test(c) ? ` α ${Math.round(parseInt(c.slice(1, 3), 16) / 2.55)}%` : '';
  const sw = (c) => `<span class="sw" style="background:${esc(hex(c))}"></span> ${esc(hex(c))}${alphaOf(c)}`;
  // a colour item with both values: one row per side, the value set (with its token or resource) and the colour on screen
  const colourTable = (it) => `<table class="ct"><tr><th></th><th>${esc(t('colSet'))}</th><th title="${esc(t('colDrawnT'))}">${esc(t('colDrawn'))}</th></tr>${[['figma', it.figma], ['app', it.app]].filter(([, o]) => o?.color).map(([k, o]) =>
    `<tr><th>${esc(t(k))}</th><td>${sw(o.color)}${o.variable || o.res ? `<code>${esc((o.variable || o.res).replace(/^Variable\//, ''))}</code>` : ''}${o.alpha ? `<code>α ${o.alpha}</code>` : ''}</td><td>${o.drawn ? sw(o.drawn) : '—'}</td></tr>`).join('')}</table>`;
  const name = (o) => `${o.variable || o.res ? ` <code>${esc((o.variable || o.res).replace(/^Variable\//, ''))}</code>` : ''}${o.alpha ? ` α ${o.alpha}` : ''}`;
  const swatches = (o) => o.drawn ? `${esc(t('colSet'))} ${sw(o.color)}${name(o)} · <span title="${esc(t('colDrawnT'))}">${esc(t('colDrawn'))}</span> ${sw(o.drawn)}` : `${sw(o.color)}${name(o)}`;
  const txt = (o) => o?.text ? `<q>${esc(o.text.length > 120 ? o.text.slice(0, 120) + '…' : o.text)}</q>` : o?.color ? swatches(o) : o?.name ? `<code>${esc(o.name)}</code>` : '';
  const r = s.route, link = (p, h, l) => PAGES[p] ? `<a href="${PAGES[p]}#${h}">${esc(l)}</a>` : '';
  const keep = open === id && $('dlg').open ? ($('dlg').querySelector('.rp')?.scrollTop ?? 0) : 0;
  const figmaUrl = D.file ? `https://www.figma.com/design/${D.file}?node-id=${encodeURIComponent(s.id.replace(':', '-'))}` : '';
  $('dlg').innerHTML = `<div class="dh"><h2>${esc(s.name)}</h2><span class="st"><i style="background:${COL(s.status)}"></i>${esc(STN[L][s.status])}</span>
    <span class="more">${esc(s.board)} · ${esc(s.id)}${s.run ? ` · ${t('run')} ${esc(s.run)}` : ''}${s.build ? ` · ${t('build')} ${esc(s.build)}` : ''}</span>
    <label class="more"><input type="checkbox" id="bx"${noBoxes ? '' : ' checked'}> ${esc(t('boxes'))}</label>
    ${figmaUrl ? `<a class="more" href="${figmaUrl}" target="_blank" rel="noopener">${esc(t('open'))} ↗</a>` : ''}<button type="button" class="x" id="x" aria-label="${esc(t('close'))}">✕</button></div>
  <div class="db"><div class="pair">
    <div class="side"><b>${esc(t('figma'))}</b><div class="frame" style="aspect-ratio:${s.w}/${s.h};--r:${s.w / s.h}">${s.figma ? `<button type="button" class="zm" title="${esc(t('zoom'))}">${fig(s.figma, false)}</button>` + boxes('figma', s.w, s.h, s.out) : `<div class="no">${esc(t('noFig'))}</div>`}</div></div>
    <div class="side"><b>${esc(t('app'))}</b><div class="frame" style="aspect-ratio:${aw}/${ah};--r:${aw / ah}">${s.app ? `<button type="button" class="zm" title="${esc(t('zoom'))}"><img src="${esc(s.app)}" alt=""></button>${boxes('app', aw, ah)}` : `<div class="no">${esc(s.run ? t('noApp') : s.status === 'not-captured' ? t('notCaptured') : STN[L][s.status])}</div>`}</div></div>
  ${s.parts.length ? `<div class="parts">${s.parts.map((p, i) => `<button type="button" class="chip" data-part="${esc(p)}">${esc(t('part')(i + 2))}</button>`).join('')}</div>` : ''}
  </div><div class="rp">
    ${s.arrival && !s.arrival.ok ? `<div class="warn">${esc(t('doubt')(s.arrival.matched, s.arrival.of))}</div>` : ''}
    ${s.recheck ? `<div class="rc"><b>${esc(t('recheck')(s.recheck.run))}</b>${s.recheck.items.map(i => `<div><b class="${i.now}">${esc(t('now')[i.now])}</b> ${esc(KN[L][i.id.split(':')[0]] ?? i.id)} <span class="more">${esc(lang(i, 'note'))}</span></div>`).join('')}</div>` : ''}
    ${s.gap ? `<div class="warn">${esc(t('gap'))}</div>` : ''}
    ${s.out.length ? `<p class="more">${esc(t('outNote')(s.out.length))}</p>` : ''}
    ${s.hidden.length ? `<p class="more" title="${esc(s.hidden.map(h => h.text.replace(/\s+/g, ' ').slice(0, 60)).join('\n'))}">${esc(t('hiddenNote')(s.hidden.length))}</p>` : ''}
    ${s.run && s.ocr && !s.ocr.app ? `<p class="more">${esc(t('noOcr'))}</p>` : ''}
    ${s.views ? `<p class="more">${esc(t('viewsNote')(s.views.matched, s.views.texts, s.views.font_scale))}</p>` : s.font_width ? `<p class="more">${esc(t('fontNote')(s.font_width.width, s.font_width.texts))}</p>` : ''}
    ${r && r.how === 'figma' ? `<div class="route"><div><b>${esc(t('byArrows'))}</b> <span class="more">(${esc(t('pfit')[r.fit] ?? r.fit)})</span></div><div class="more">${esc(r.action)}</div></div>`
    : r ? `<div class="route"><div><b>${esc(t('reached'))}</b> ${esc(r.case)} <span class="more">(${esc(t('fit')[r.fit] ?? r.fit)}, ${esc(t('via'))} ${esc(r.edge || r.via)})</span>
      ${link('review', esc(r.case), t('cases'))} ${link('coverage', `case=${esc(r.case)}`, t('cov'))} ${link('results', `case=${esc(r.case)}`, t('res'))}</div>
      ${r.precondition ? `<div class="more"><b>${esc(t('pre'))}</b> ${esc(r.precondition)}</div>` : ''}<div class="more"><b>${esc(t('action'))}</b> ${esc(r.action)}</div>
      ${s.alternatives.length ? `<div class="more">${esc(t('also'))}: ${s.alternatives.map(esc).join(', ')}</div>` : ''}
      ${s.fit ? `<div class="more">${esc(t('fitNote')(s.fit.top.dy, s.fit.bottom.dy))}</div>` : ''}</div>` : s.why ? `<p class="more">${esc(s.why)}</p>` : ''}
    <div class="items">${s.run && !main.length ? `<p class="more">${esc(t('nothing'))}</p>` : ''}${groupsOf(shown).map(([v, list]) => `<details class="grp" data-v="${esc(v)}"${folded.has(v) ? '' : ' open'}><summary style="color:${VC(v)}">${esc(VN[L][v] ?? v)} · ${list.length}</summary>${list.map(([it, n]) => `<div class="it" data-n="${n}" style="border-left-color:${VC(it.verdict)};--vc:${VC(it.verdict)}">
      <div class="h"><span class="num" style="background:${VC(it.verdict)}">${n + 1}</span><span class="k">${esc(KN[L][it.kind] ?? it.kind)}</span>
      ${it.src === 'app' ? `<span class="srcapp" title="${esc(t('srcAppT'))}">${esc(t('srcApp'))}</span>` : ''}${it.severity && it.verdict === 'bug' ? `<span class="more">${esc(it.severity)}</span>` : ''}<span class="v" style="color:${VC(it.verdict)}">${esc(VN[L][it.verdict] ?? it.verdict)}</span></div>
      ${it.kind === 'colour' && (it.figma?.drawn || it.app?.drawn) ? colourTable(it) + (it.delta?.dE != null ? `<div class="more">${esc(t('colDiff')(it.delta.dE, it.delta.dE_drawn))}</div>` : '')
      : `${it.figma ? `<div>${esc(t('figma'))} ${txt(it.figma)}</div>` : ''}${it.app && (it.app.text || it.app.color) ? `<div>${esc(t('app'))} ${txt(it.app)}</div>` : ''}
      ${it.delta ? `<div class="more">${esc(Object.entries(it.delta).map(([a, b]) => `${a} ${b}`).join(' · '))}</div>` : ''}`}
      ${it.split ? `<div class="note">${esc(splitL(it.split))}</div>` : ''}${it.decided ? `<div class="note">${esc(decidedL(it.decided))}</div>` : ''}
      ${s.run ? decRow(s, it) : ''}${lang(it, 'note') ? `<div class="note">${esc(lang(it, 'note'))}</div>` : ''}${lang(it, 'reviewer') && lang(it, 'reviewer') !== lang(it, 'note') ? `<div class="note">${esc(lang(it, 'reviewer'))}</div>` : ''}</div>`).join('')}</details>`).join('')}
    ${info.length ? `<button type="button" class="chip" id="info">${esc(showInfo ? t('hideInfo') : t('showInfo'))} · ${esc(t('info')(info.length))}</button>` : ''}</div>
  </div></div>`;
  $('x').onclick = () => { history.replaceState(null, '', location.pathname + location.search); $('dlg').close(); open = null; };
  $('info')?.addEventListener('click', () => { showInfo = !showInfo; detail(id); });
  $('dlg').querySelectorAll('details.grp').forEach(g => g.addEventListener('toggle', () => g.open ? folded.delete(g.dataset.v) : folded.add(g.dataset.v)));
  $('bx').onchange = e => { noBoxes = !e.target.checked; $('dlg').classList.toggle('noboxes', noBoxes); };
  $('dlg').classList.toggle('noboxes', noBoxes);
  // a decision: pressing the passes' own verdict (or the chosen one again) goes back to it; a field equal to what
  // findings.json holds is dropped, and an empty decision with it
  $('dlg').querySelectorAll('.dec').forEach(d => {
    const k = d.dataset.k, it = s.items.find(i => dkey(s, i) === k);
    const tidy = () => { const x = DEC[k]; for (const f of ['v', 'ebug', 'why']) if (x[f] === undefined) delete x[f];
      if (x.ebug !== undefined && (x.v ?? it.verdict) !== 'bug') delete x.ebug;
      if (x.v === undefined && x.ebug === undefined && x.why === undefined) delete DEC[k]; saveDec(); };
    const base = () => ({ b: it.verdict, ...(it.why ? { w0: it.why } : {}), ...(DEC[k] ?? {}) });
    d.querySelectorAll('button').forEach(b => b.onclick = e => { e.stopPropagation(); const x = b.dataset.v, cur = base();
      DEC[k] = { ...cur, v: cur.v === x || x === it.verdict ? undefined : x }; tidy(); detail(id);
      $('dlg').querySelector(`.dec[data-k="${CSS.escape(k)}"] input.why`)?.focus(); });
    d.querySelector('[data-e]')?.addEventListener('change', e => { DEC[k] = { ...base(), ebug: e.target.checked === !!it.ebug ? undefined : e.target.checked }; tidy(); });
    // the reason is kept as it is typed, without drawing the panel again
    d.querySelector('[data-w]')?.addEventListener('input', e => { DEC[k] = { ...base(), why: e.target.value === (it.why ?? '') ? undefined : e.target.value }; tidy();
      e.target.classList.toggle('need', it.verdict === 'bug' && ['ok', 'n/a'].includes(effV(s, it)) && !e.target.value.trim()); });
  });
  // hovering a difference highlights its boxes on both images, and hovering a box its difference; clicking a box scrolls to it
  const hl = (n, on) => $('dlg').querySelectorAll(`rect[data-n="${n}"], .it[data-n="${n}"]`).forEach(r => r.classList.toggle('hl', on));
  $('dlg').querySelectorAll('.it').forEach(e => { e.onmouseenter = () => hl(e.dataset.n, true); e.onmouseleave = () => hl(e.dataset.n, false); });
  $('dlg').querySelectorAll('rect.box').forEach(r => { const n = r.dataset.n;
    r.onmouseenter = () => hl(n, true); r.onmouseleave = () => hl(n, false);
    r.onclick = () => pick(n, true); });
  // an item clicked (not its buttons or reason) is selected like its box (user, 2026-11-04)
  $('dlg').querySelectorAll('.it').forEach(e => e.addEventListener('click', ev => { if (!ev.target.closest('button, input, label, a')) pick(e.dataset.n, false); }));
  // an image clicked: full size over the page with its boxes (user, 2026-11-04: not a new tab); a click or Esc closes it
  $('dlg').querySelectorAll('.frame .zm').forEach(b => b.onclick = () => { const fr = b.closest('.frame').cloneNode(true);
    fr.querySelector('.zm').replaceWith(...fr.querySelector('.zm').childNodes); lightbox(fr); });
  $('dlg').querySelectorAll('[data-part]').forEach(b => b.onclick = () => { const fr = document.createElement('div'); fr.className = 'frame plain';
    fr.innerHTML = `<img src="${esc(b.dataset.part)}" alt="">`; lightbox(fr); });
  if (!$('dlg').open) $('dlg').showModal();
  const rp = $('dlg').querySelector('.rp'); if (rp) rp.scrollTop = keep;
  // the selection survives a redraw (a decision pressed, info shown or hidden)
  if (picked?.id === id) pick(picked.n, false, true);
}
// a box or an item clicked: both marked until another click (the same one again clears it); from a box, its item
// scrolls into view in the right panel. The box is marked as on the Coverage page: a black / white / black ring just
// clear of it (so it never covers what the box holds), then the box itself redrawn on top in its verdict colour.
let picked = null;
function pick(n, scroll, again = false) {
  $('dlg').querySelectorAll('.pick, .flash').forEach(e => e.classList.remove('pick', 'flash'));
  $('dlg').querySelectorAll('.ring, .box.top').forEach(e => e.remove());
  if (!again && picked?.id === open && picked.n === n) { picked = null; return; }
  const it = $('dlg').querySelector(`.it[data-n="${n}"]`); if (!it) { picked = null; return; }
  picked = { id: open, n };
  it.closest('details')?.setAttribute('open', '');
  $('dlg').querySelectorAll(`rect.box[data-n="${n}"]`).forEach(b => {
    // the ring stays clear of the box (its inner edge 2 px outside the box's stroke) and the box keeps its width: these
    // boxes hug a line of text, and a thicker box or a ring on its edge covered the glyphs (user, 2026-11-05)
    const svg = b.ownerSVGElement, k = svg.viewBox.baseVal.width / (svg.clientWidth || svg.viewBox.baseVal.width), o = 5.5 * k;
    const [x, y, w, h] = ['x', 'y', 'width', 'height'].map(a => +b.getAttribute(a));
    const ring = (c, sw) => `<rect class="ring" x="${x - o}" y="${y - o}" width="${w + 2 * o}" height="${h + 2 * o}" rx="${3 * k}" stroke="${c}" stroke-width="${sw * k}"/>`;
    const top = b.cloneNode(true); top.classList.add('top'); top.style.pointerEvents = 'none'; top.querySelector('title')?.remove();
    b.classList.add('pick'); svg.insertAdjacentHTML('beforeend', ring('rgba(0,0,0,0.85)', 3.5) + ring('#fff', 1.5)); svg.append(top); });
  void it.offsetWidth; it.classList.add('pick'); if (!again) it.classList.add('flash');
  if (!scroll) return;
  const rp = it.closest('.rp'), y = it.getBoundingClientRect().top - rp.getBoundingClientRect().top + rp.scrollTop - (rp.clientHeight - it.offsetHeight) / 2;
  if (rp.scrollHeight > rp.clientHeight) rp.scrollTo({ top: Math.max(0, y), behavior: 'smooth' }); else it.scrollIntoView({ block: 'center', behavior: 'smooth' });
}
function lightbox(fr) {
  const lb = document.createElement('div'); lb.className = 'lb'; lb.append(fr);
  lb.onclick = () => lb.remove(); $('dlg').append(lb);
}
// Esc closes the full-size image first, then the comparison
$('dlg').addEventListener('cancel', e => { const lb = $('dlg').querySelector('.lb'); if (lb) { e.preventDefault(); lb.remove(); } });
$('dlg').addEventListener('click', e => { if (e.target === $('dlg')) $('x')?.click(); });
$('dlg').addEventListener('close', () => { open = null; if (location.hash.startsWith('#screen=')) history.replaceState(null, '', location.pathname + location.search); });
const fromHash = () => { const m = location.hash.match(/^#screen=(.+)$/); if (m) detail(decodeURIComponent(m[1])); };
const setLang = l => { L = l; try { localStorage.setItem('casebook-lang', l); } catch (e) {} render(); };
document.querySelectorAll('.lang button').forEach(b => b.onclick = () => setLang(b.dataset.l));
if (window.CASEBOOK) { document.querySelector('.lang')?.remove(); addEventListener('casebook-lang', e => { L = e.detail; render(); }); }
addEventListener('hashchange', fromHash);
// served by scripts/pages.ts: changed data is drawn in place; the open comparison is drawn again only when its screen
// changed and nothing in it is being typed in (decisions are kept in DEC either way)
if (window.CASEBOOK) CASEBOOK.onData = d => {
  const was = open && JSON.stringify(D.screens?.find(s => s.id === open));
  D = d; render();
  if (open && $('dlg').open && JSON.stringify(D.screens?.find(s => s.id === open)) !== was && !$('dlg').contains(document.activeElement))
    setTimeout(() => open && detail(open));   // after CASEBOOK.quiet: detail() adds listeners, so it is drawn whole
};
render(); fromHash();
</script>
</body>
</html>
