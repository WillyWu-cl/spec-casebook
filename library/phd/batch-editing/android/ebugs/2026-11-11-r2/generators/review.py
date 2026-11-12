#!/usr/bin/env python3
"""Build the Batch Editing Android R2 eBug review page from upload/bodies.json (after build.py, drafts_to_bodies.py,
check_ebug_format.py and the dedupe). Self-contained (thumbnails embedded); a local file, git-ignored. Nothing is filed.

No filed batch exists for this feature and there is no TR for this build, so Creator, TRCode and method are left
blank and marked "needed"; the source tag shows the [AIAgent] the drafts already carry.
"""
import base64, csv, io, json, os, subprocess, sys

from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build as G  # noqa: E402

OUT, RUN = G.OUT, G.RUN
PAGE = f"{OUT}/20261111_eBug_review_Batch-Edit-R2_20.19.0.html"
WHY = {
 "ISS-BEA-12": "The 【NEW】 rule makes 「All」 disabled whenever the current photo has nothing unapplied (on entering, after the apply). In both rooms it is always enabled, and a tap after the apply shows 「Applied to 11 photos」 again and adds an empty Undo step.",
 "ISS-BEA-13": "PM (D1-12) and Design hide the thumbnail strip while Curve or HSL is open so it cannot be hit by mistake; the build moves it above the panel and a tap switches photos.",
 "ISS-BEA-14": "Open question, filed to PM for a decision (user, 2026-11-11): after an edit and 「All」, one Undo reverts the 11 others but the current photo keeps its own edit. R1 held it; R2 saw it again in both rooms.",
}


def thumb(path):
    im = Image.open(path).convert("RGB")
    im.thumbnail((760, 1650))
    b = io.BytesIO()
    im.save(b, "JPEG", quality=72)
    return "data:image/jpeg;base64," + base64.b64encode(b.getvalue()).decode()


def main():
    bodies = json.load(open(f"{OUT}/upload/bodies.json", encoding="utf-8"))
    E = {e["iss"]: e for e in G.E}
    entries = []
    for b in bodies.values():
        e = E[b["iss"]]
        imgs = [{"src": thumb(os.path.join(b["images_dir"], f)), "name": f} for f in b["files"] if f.endswith(".jpg")]
        logs = [{"name": f, "text": open(os.path.join(b["images_dir"], f), encoding="utf-8").read()}
                for f in b["files"] if f.endswith(".txt")]
        entries.append(dict(n=int(b["entry"]), iss=b["iss"], title=b["title"], type=b["type"], sev=int(b["sev"]),
                            belong=b["belong"], short=b["short"], desc=b["desc"], note=b["qa_note"], why=WHY[b["iss"]],
                            cases=e["cases"], imgs=imgs, logs=logs, rep=e["rep"]))
    results = list(csv.DictReader(open(f"{RUN}/results.csv", encoding="utf-8-sig")))
    counts = {}
    for r in results:
        counts[r["Result"]] = counts.get(r["Result"], 0) + 1
    defaults = json.loads(subprocess.run(["node", f"{G.REPO}/scripts/ebug-defaults.ts", "phd/batch-editing", "android", "--json"],
                                         capture_output=True, text=True).stdout or "{}")
    data = dict(entries=entries, counts=counts,
                held=[],
                notraised=[[o, t] for o, t in G.OBS],
                blocked=[],
                defaults=defaults)
    html = TEMPLATE.replace("__DATA__", json.dumps(data, ensure_ascii=False).replace("</", "<\\/"))
    open(PAGE, "w", encoding="utf-8").write(html)
    print(f"wrote {PAGE} ({len(html) // 1024} KB, {len(entries)} cards)")


TEMPLATE = r"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Batch Editing eBugs R2</title>
<style>
:root{--bg:#f6f5f2;--panel:#fff;--ink:#1d1d1b;--mute:#6b6a66;--line:#e2e0da;--accent:#2f5bd3;--warn:#b45309;--warnbg:#fff4e5;
--s1:#b91c1c;--s2:#dc6b19;--s3:#c79a0b;--s4:#5b8c3a;--s5:#6b7280;--mono:ui-monospace,SFMono-Regular,Consolas,monospace;--gutter:16px}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#151514;--panel:#1f1f1d;--ink:#ecebe7;--mute:#a3a29c;--line:#34332f;--accent:#7ea2ff;--warn:#f0a35a;--warnbg:#3a2a14}}
:root[data-theme="dark"]{--bg:#151514;--panel:#1f1f1d;--ink:#ecebe7;--mute:#a3a29c;--line:#34332f;--accent:#7ea2ff;--warn:#f0a35a;--warnbg:#3a2a14}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.wrap{max-width:1100px;margin:0 auto;padding:24px var(--gutter) 60px;display:grid;gap:18px}
.eyebrow{font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--mute)}
h1{font-size:24px;margin:4px 0}h2{font-size:18px;margin:0 0 10px}
.lede{margin:0;color:var(--ink)}
.facts{display:flex;flex-wrap:wrap;gap:8px 18px;margin:8px 0 0}.facts div{min-width:0}.facts dt{font-size:12px;color:var(--mute)}.facts dd{margin:0;font-weight:600;overflow-wrap:anywhere}
.need{color:var(--warn)}
.panel,.card{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:16px;min-width:0;max-width:100%}
.decisions{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}
.decisions label{display:grid;gap:4px;font-weight:600;font-size:14px}.decisions small{font-weight:400;color:var(--mute)}
input[type=text],select,textarea{font:inherit;color:inherit;background:var(--bg);border:1px solid var(--line);border-radius:6px;padding:6px 8px;max-width:100%}
input.pending{border-color:var(--warn);background:var(--warnbg)}
.chips{display:flex;flex-wrap:wrap;gap:6px}.chip{font-size:12px;border:1px solid var(--line);border-radius:999px;padding:2px 9px}
.card{border-left:4px solid var(--s3);display:grid;gap:10px}.card.held{opacity:.45}
.card h3{margin:0;font-size:16px}.fid{font-family:var(--mono);font-weight:700;margin-right:6px}
.sd{font-family:var(--mono);font-size:13px;background:var(--bg);border:1px solid var(--line);border-radius:6px;padding:8px 10px;overflow-wrap:anywhere}
details>summary{cursor:pointer;font-weight:600;font-size:14px}
pre{white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word;margin:6px 0 0;font:12.5px/1.45 var(--mono);background:var(--bg);border-radius:6px;padding:8px 10px}
.myread{border-left:3px solid var(--accent);padding:6px 10px;font-size:14px;background:var(--bg);border-radius:0 6px 6px 0;overflow-wrap:anywhere}
.myread b{color:var(--accent)}
.strip{display:flex;flex-wrap:wrap;gap:8px}.strip button{padding:0;border:1px solid var(--line);border-radius:6px;background:none;cursor:zoom-in}
.strip img{display:block;height:180px;width:auto;max-width:100%;border-radius:6px}
.bar{display:flex;flex-wrap:wrap;gap:10px;align-items:center;border-top:1px solid var(--line);padding-top:10px}
.seg{display:inline-flex;border:1px solid var(--line);border-radius:6px;overflow:hidden}.seg button{border:0;background:none;color:inherit;padding:4px 9px;cursor:pointer;font:inherit}
.seg button[aria-pressed=true]{background:var(--accent);color:#fff}
.ctx{flex:1 1 240px;display:grid;gap:3px;font-size:13px;font-weight:600;color:var(--accent)}.ctx textarea{min-height:38px;width:100%}
table{border-collapse:collapse;width:100%;font-size:14px}td,th{border-top:1px solid var(--line);padding:6px 8px;text-align:left;vertical-align:top;overflow-wrap:anywhere}
.tbl{overflow-x:auto;max-width:100%}
.toolbar{display:flex;flex-wrap:wrap;gap:8px}button.btn{font:inherit;border:1px solid var(--line);background:var(--panel);color:inherit;border-radius:6px;padding:6px 12px;cursor:pointer}
button.primary{background:var(--accent);color:#fff;border-color:var(--accent)}
#out{width:100%;min-height:180px;font:12.5px var(--mono)}
.lb{position:fixed;inset:0;background:rgba(0,0,0,.85);display:grid;place-items:center;z-index:9;padding:12px}.lb[hidden]{display:none}
.lb img{max-width:96vw;max-height:84vh}.lb .cap{color:#fff;display:flex;gap:10px;flex-wrap:wrap;align-items:center;justify-content:center;margin-top:8px}
.lb button{font:inherit}
</style></head><body>
<div class="wrap">
<header>
  <div class="eyebrow">spec-casebook · PhotoDirector Mobile for Android · eBug filing review</div>
  <h1>Batch Editing Android — run R2 (table v5) on 20.19.0: <span id="ncards"></span> findings from <span id="ncases"></span> cases</h1>
  <p class="lede">These cards are the eBug entries exactly as they would be filed. For each one set file or hold, severity, owner and type, and add any context, then Copy decisions and paste the result back. <b>Nothing has been filed, uploaded or commented.</b> Creator, TRCode, tag and method are prefilled from the last filed batch (2026-11-10-r1): confirm each before filing.</p>
  <dl class="facts">
    <div><dt>Version</dt><dd>20.19.0</dd></div>
    <div><dt>Build No</dt><dd>90201900</dd></div>
    <div><dt>Server</dt><dd>Test Server</dd></div>
    <div><dt>Device</dt><dd>Samsung Galaxy A53 5G (SM-A5360) · Android 15</dd></div>
    <div><dt>Account</dt><dd>Premium via debug switch (「Hello VIP!」)</dd></div>
    <div><dt>TRCode</dt><dd>TR261106-0051 (from 2026-11-10-r1 — confirm)</dd></div>
    <div><dt>Product</dt><dd>PhotoDirector Mobile for Android</dd></div>
  </dl>
</header>
<section class="panel"><h2>Batch decisions</h2>
  <div class="decisions">
    <label>Filing account (Creator)<input type="text" id="acct" value="WILLY_WU"><small>from 2026-11-10-r1 — confirm</small></label>
    <label>Source tag<input type="text" id="tag" value="AIAgent"><small>from 2026-11-10-r1 — confirm</small></label>
    <label>TRCode<input type="text" id="tr" value="TR261106-0051"><small>from 2026-11-10-r1 (filed for 20.19.0 build 202611061839) — confirm; the phone shows 20.19.0 (90201900)</small></label>
    <label>Filing method<select id="method"><option selected>API</option><option>Browser form</option></select><small>from 2026-11-10-r1 — confirm</small></label>
  </div>
</section>
<section class="panel"><h2>Where the run landed</h2>
  <div class="chips" id="tally"></div>
  <p class="lede" style="margin-top:8px;font-size:14px"><b>Proposed severities:</b> S3 for all three. F-1 and F-2 are RD defects ([AIAgent]); F-3 is an open question filed to PM ([AIAgent][UX], BugBelong PM, user 2026-11-11). Dedupe (Android pool, read-only): no existing ticket matches any card; PHA262026P0057–P0061 are other findings. No failure-related card, so no log.</p>
  <div class="toolbar" style="margin-top:8px"><button class="btn" id="fileAll">File all</button><button class="btn" id="holdAll">Hold all</button><button class="btn" id="reset">Reset to proposal</button></div>
</section>
<main id="cards" style="display:grid;gap:16px"></main>
<section class="panel"><h2>Questions and observations</h2>
  <p class="lede" style="font-size:14px">No question is held: the one open question is card F-3 (to PM). Same-OS duplicates: none (dedupe.txt). Team rule: no comments on existing tickets.</p>
  <div class="tbl" hidden><table id="held"><tbody></tbody></table></div>
  <details style="margin-top:10px"><summary>Observations not raised</summary><div class="tbl"><table id="nr"><tbody></tbody></table></div></details>
</section>
<section class="panel"><h2>Gaps you should know about</h2>
  <p class="lede" style="font-size:14px">None: all 16 rows have a verdict (no Blocked, no Not run). TC-167 passed though its precondition 「strip hidden」 cannot hold on this build (F-2).</p>
  <div class="tbl"><table id="blk"><thead><tr><th>Case</th><th>Why it is Blocked</th></tr></thead><tbody></tbody></table></div>
</section>
<section class="panel"><h2>Copy decisions</h2>
  <div class="toolbar"><button class="btn primary" id="copy">Copy decisions</button><span id="copied" role="status"></span></div>
  <textarea id="out" readonly aria-label="Decisions table"></textarea>
</section>
</div>
<div class="lb" id="lb" hidden role="dialog" aria-modal="true"><div><img id="lbimg" alt=""><div class="cap"><button id="lbprev">← Prev</button><span id="lbcap"></span><button id="lbnext">Next →</button><button id="lbclose">Close</button></div></div></div>
<script>
const DATA = __DATA__;
const KEY = "batch-edit-ebug-review-20261111-r2-v1";
const SEVC = {1:"var(--s1)",2:"var(--s2)",3:"var(--s3)",4:"var(--s4)",5:"var(--s5)"};
const BEL = ["RD","PC-Doc","PM","PC-Art","Setup Kit","Marketing","RD-ECL"];
const TYPES = ["Functional","UI","UX"];
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
let st = {};
try { st = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { st = {}; }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} };
const prop = e => ({file: true, sev: e.sev, belong: e.belong, type: e.type, note: ""});
DATA.entries.forEach(e => { st[e.iss] = Object.assign(prop(e), st[e.iss] || {}); });
document.getElementById("ncards").textContent = DATA.entries.length;
document.getElementById("ncases").textContent = Object.values(DATA.counts).reduce((a, b) => a + b, 0);
document.getElementById("tally").innerHTML = Object.entries(DATA.counts).map(([k, v]) => `<span class="chip"><b>${v}</b> ${esc(k)}</span>`).join("") + `<span class="chip"><b>${DATA.entries.length}</b> cards</span><span class="chip"><b>${DATA.held.length}</b> PM questions</span><span class="chip">UX ×1 (PM)</span>`;
const cards = document.getElementById("cards");
function render() {
  cards.innerHTML = "";
  DATA.entries.forEach(e => {
    const s = st[e.iss];
    const c = document.createElement("article");
    c.className = "card" + (s.file ? "" : " held");
    c.style.borderLeftColor = SEVC[s.sev];
    c.innerHTML = `<h3><span class="fid" style="color:${SEVC[s.sev]}">F-${e.n}</span>${esc(e.title)}</h3>
      <div class="chips"><span class="chip">${esc(e.iss)}</span><span class="chip">${esc(e.cases.join(", "))}</span><span class="chip">Reproduced ${esc(e.rep)}</span><span class="chip">proposed S${e.sev} · ${esc(e.belong)} · ${esc(e.type)}</span></div>
      <p style="margin:0">${esc(e.why)}</p>
      <div class="sd">${esc(e.short)}</div>
      <details><summary>Description (as filed)</summary><pre>${esc(e.desc)}</pre></details>
      <div class="strip">${e.imgs.map((m, i) => `<button type="button" data-i="${i}" aria-label="${esc(m.name)}"><img src="${m.src}" alt="${esc(m.name)}"></button>`).join("")}</div>
      ${e.logs.map(l => `<details class="logbox"><summary>Log <span style="font:12px var(--mono);opacity:.75">${esc(l.name)}</span></summary><pre>${esc(l.text)}</pre></details>`).join("")}
      <div class="myread"><b>My read.</b> ${esc(e.note)}</div>
      <div class="bar">
        <label><input type="checkbox" class="f" ${s.file ? "checked" : ""}> file</label>
        <span class="seg" role="group" aria-label="Severity">${[1,2,3,4,5].map(n => `<button type="button" data-s="${n}" aria-pressed="${n === s.sev}">${n}</button>`).join("")}</span>
        <select class="b" aria-label="BugBelong">${BEL.map(b => `<option ${b === s.belong ? "selected" : ""}>${b}</option>`).join("")}</select>
        <select class="t" aria-label="Issue type">${TYPES.map(b => `<option ${b === s.type ? "selected" : ""}>${b}</option>`).join("")}</select>
        <label class="ctx">Add context — what am I missing?<textarea class="n">${esc(s.note)}</textarea></label>
      </div>`;
    c.querySelector(".f").onchange = ev => { s.file = ev.target.checked; save(); render(); out(); };
    c.querySelectorAll(".seg button").forEach(b => b.onclick = () => { s.sev = +b.dataset.s; save(); render(); out(); });
    c.querySelector(".b").onchange = ev => { s.belong = ev.target.value; save(); out(); };
    c.querySelector(".t").onchange = ev => { s.type = ev.target.value; save(); out(); };
    c.querySelector(".n").oninput = ev => { s.note = ev.target.value; save(); out(); };
    c.querySelectorAll(".strip button").forEach(b => b.onclick = () => openLb(e, +b.dataset.i));
    cards.appendChild(c);
  });
}
let lbE = null, lbI = 0;
const lb = document.getElementById("lb");
function openLb(e, i) { lbE = e; lbI = i; lb.hidden = false; showLb(); }
function showLb() { const m = lbE.imgs[lbI]; document.getElementById("lbimg").src = m.src; document.getElementById("lbcap").textContent = `F-${lbE.n} · ${m.name} (${lbI + 1}/${lbE.imgs.length})`; }
document.getElementById("lbprev").onclick = () => { lbI = (lbI + lbE.imgs.length - 1) % lbE.imgs.length; showLb(); };
document.getElementById("lbnext").onclick = () => { lbI = (lbI + 1) % lbE.imgs.length; showLb(); };
document.getElementById("lbclose").onclick = () => { lb.hidden = true; };
document.addEventListener("keydown", ev => { if (lb.hidden) return; if (ev.key === "Escape") lb.hidden = true; if (ev.key === "ArrowLeft") document.getElementById("lbprev").click(); if (ev.key === "ArrowRight") document.getElementById("lbnext").click(); });
const fill = (id, rows) => { document.querySelector(`#${id} tbody`).innerHTML = rows.map(r => `<tr>${r.map((x, i) => `<td${i === 0 ? ' style="white-space:nowrap"' : ""}>${esc(x)}</td>`).join("")}</tr>`).join(""); };
fill("held", DATA.held); fill("nr", DATA.notraised); fill("blk", DATA.blocked);
["acct", "tag", "tr", "method"].forEach(id => { const el = document.getElementById(id); try { const v = localStorage.getItem(KEY + ":" + id); if (v) el.value = v; } catch (e) {} el.oninput = el.onchange = () => { try { localStorage.setItem(KEY + ":" + id, el.value); } catch (e) {} el.classList.toggle("pending", !el.value || id === "tr" && !el.value); out(); }; });
function out() {
  const v = id => document.getElementById(id).value || "(needed)";
  const rows = DATA.entries.map(e => { const s = st[e.iss]; return `| F-${e.n} | ${s.sev} | ${s.belong} | ${s.type} | — | ${s.file ? "file" : "hold"} | ${e.short} | ${s.note.replace(/\n/g, " ").replace(/\|/g, "/")} |`; });
  document.getElementById("out").value = `Account: ${v("acct")}\nSource tag: ${v("tag")}\nTRCode: ${v("tr")}\nMethod: ${v("method")}\n\n| # | Sev | Belong | Type | UX check | Action | Short Description | Note |\n|---|---|---|---|---|---|---|---|\n` + rows.join("\n");
}
document.getElementById("fileAll").onclick = () => { DATA.entries.forEach(e => st[e.iss].file = true); save(); render(); out(); };
document.getElementById("holdAll").onclick = () => { DATA.entries.forEach(e => st[e.iss].file = false); save(); render(); out(); };
document.getElementById("reset").onclick = () => { DATA.entries.forEach(e => st[e.iss] = prop(e)); save(); render(); out(); };
document.getElementById("copy").onclick = async () => { const t = document.getElementById("out"); try { await navigator.clipboard.writeText(t.value); } catch (e) { t.select(); document.execCommand("copy"); } document.getElementById("copied").textContent = "Copied."; };
render(); out();
</script></body></html>
"""

if __name__ == "__main__":
    main()
