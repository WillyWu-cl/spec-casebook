/* Shared by every casebook page (scripts/lib/page-shared.ts puts it at the top of each page's <style>): one palette and
   one type scale, and the time and usage strip of Progress and Design. A page's own rules come after and may override. */
:root {
  --bg: #f4f6f6; --panel: #ffffff; --ink: #172426; --muted: #5b6b6e; --line: #d8e0e1; --accent: #0f6e73; --chip-bg: #eef2f2;
  --pass: #2f7d4f; --fail: #b8402f; --blocked: #a86b12; --inc: #6a55a8; --notrun: #9aa6a8; --hold: #7a5a14; --skip: #7d878a;
  --differs: #b8402f; --question: #a86b12; --unreviewed: #6a55a8; --matches: #2f7d4f; --none: #9aa6a8; --info: #2c6fa8;
  --display: "Archivo", "Noto Sans TC", "Helvetica Neue", Arial, sans-serif;
  --body: "Source Sans 3", "Noto Sans TC", "Segoe UI", system-ui, "PingFang TC", sans-serif;
  --mono: "JetBrains Mono", ui-monospace, Menlo, monospace;
  /* one page width and side gutter on every tab (user, 2026-11-06) */
  --gutter: max(16px, env(safe-area-inset-left, 0px), calc((100vw - 1280px) / 2));
}
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {
  --bg: #111a1b; --panel: #182325; --ink: #e3ecec; --muted: #93a5a7; --line: #2a3a3c; --accent: #4fb8bd; --chip-bg: #213032;
  --pass: #5cbf83; --fail: #ec7a66; --blocked: #e0a548; --inc: #a796e0; --notrun: #5f6f71; --hold: #e0b85a; --skip: #8c9a9c;
  --differs: #ec7a66; --question: #e0a548; --unreviewed: #a796e0; --matches: #5cbf83; --none: #5f6f71; --info: #74b3ea; color-scheme: dark } }
:root[data-theme="dark"] {
  --bg: #111a1b; --panel: #182325; --ink: #e3ecec; --muted: #93a5a7; --line: #2a3a3c; --accent: #4fb8bd; --chip-bg: #213032;
  --pass: #5cbf83; --fail: #ec7a66; --blocked: #e0a548; --inc: #a796e0; --notrun: #5f6f71; --hold: #e0b85a; --skip: #8c9a9c;
  --differs: #ec7a66; --question: #e0a548; --unreviewed: #a796e0; --matches: #5cbf83; --none: #5f6f71; --info: #74b3ea; color-scheme: dark }
* { box-sizing: border-box }
[hidden] { display: none !important }
body { background: var(--bg); color: var(--ink); font: 15px/1.5 var(--body); margin: 0; padding-inline: var(--gutter) }
/* the tab bar still spans the window, also after a resize */
.cb-tabs { margin-left: calc(-1 * var(--gutter)) !important; margin-right: calc(-1 * var(--gutter)) !important; padding-inline: var(--gutter) !important }
/* Time and usage: stays at the top of the page, readable at a glance (user, 2026-11-06). One figure per tile, the
   estimate first; the account's shared total stays muted (AGENTS.md, Plan usage). */
.ubox { background: var(--panel); border: 1px solid var(--line); border-radius: 8px; padding: 12px 16px 14px; display: grid; gap: 10px; min-width: 0 }
.ubox .uh { display: flex; gap: 4px 12px; align-items: baseline; flex-wrap: wrap }
.ubox .uh h2 { font: 700 1.05rem var(--display); margin: 0; letter-spacing: -0.01em }
.ubox .uh .uw { color: var(--muted); font-size: 0.86rem }
.ubox .ulive { font: 600 0.75rem var(--body); color: var(--pass); display: inline-flex; gap: 5px; align-items: center }
.ubox .ulive i { width: 8px; height: 8px; border-radius: 50%; background: currentColor; animation: cbpulse 1.6s ease-in-out infinite }
@keyframes cbpulse { 50% { opacity: 0.25 } }
@media (prefers-reduced-motion: reduce) { .ubox .ulive i { animation: none } }
.ustrip { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 10px }
.ut { background: var(--chip-bg); border-radius: 6px; padding: 8px 12px 10px; display: grid; gap: 2px; align-content: start; min-width: 0 }
.ut .ul { font-size: 0.82rem; color: var(--muted) }
.ut .uv { font: 700 1.55rem/1.2 var(--display); font-variant-numeric: tabular-nums }
.ut .uv.est { color: var(--accent) }
.ut .us { font-size: 0.84rem; color: var(--muted) }
.ut .um { display: flex; height: 6px; border-radius: 3px; overflow: hidden; background: color-mix(in srgb, var(--muted) 22%, transparent); margin-top: 5px }
.ut .um span { display: block; height: 100%; background: var(--accent) }
.ut .um span.idle { background: color-mix(in srgb, var(--muted) 45%, transparent) }
.ut.acct .uv { font-size: 1.05rem; font-weight: 600; color: var(--muted); line-height: 1.5 }
.ubox .unone { color: var(--muted); font-style: italic }
.ubox .ufoot { display: flex; gap: 6px 14px; flex-wrap: wrap; align-items: center }
.ubox details.how summary { cursor: pointer; font-size: 0.85rem; color: var(--muted) }
.ubox .notes { color: var(--muted); font-size: 0.85rem; margin: 8px 0 0; display: grid; gap: 4px }
