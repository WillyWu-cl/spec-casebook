#!/usr/bin/env python3
"""Build the self-contained eBug review page for AI Hair Color Custom R1 (Android) from upload/bodies.json.

Layout per ebug-tr-filer/references/review-page.md: page head facts (TRCode / account shown as 「needed」: no TR named,
no filed batch yet), batch decisions, one card per entry (why, Short Description, collapsed body, evidence strip with
lightbox, collapsed log, My read), then PM questions, not filed, gaps, and Copy decisions. Thumbnails are embedded as
data: URIs (Pillow), so the page needs no folder. Nothing is filed. Run after ebugs.py, drafts_to_bodies.py and the
format check.
"""
import base64, html, io, json, os, re, sys
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import ebugs as G

OUT = G.OUT
PAGE = f"{OUT}/20261113_eBug_review_AI-Hair-Color-Custom-R1_20.19.0.html"
bodies = json.load(open(f"{OUT}/upload/bodies.json", encoding="utf-8"))
items = list(bodies.values()) if isinstance(bodies, dict) else bodies
byiss = {e["iss"]: e for e in G.E}
esc = html.escape


def thumb(path, size=760, q=72):
    im = Image.open(path).convert("RGB")
    im.thumbnail((size, size))
    b = io.BytesIO()
    im.save(b, "JPEG", quality=q)
    return "data:image/jpeg;base64," + base64.b64encode(b.getvalue()).decode()


SEVC = {1: "var(--s1)", 2: "var(--s2)", 3: "var(--s3)", 4: "var(--s4)", 5: "var(--s4)"}
cards = []
for it in items:
    e = byiss[it["iss"]]
    n = it["entry"]
    imgs, logs = [], []
    for f in it["files"]:
        p = os.path.join(it["images_dir"], f)
        if f.endswith(".txt"):
            logs.append((f, open(p, encoding="utf-8").read()))
        else:
            imgs.append((f, thumb(p)))
    strip = "".join(
        f'<figure class="th" data-n="{n}" data-i="{i}"><img src="{src}" alt="{esc(f)}" loading="lazy"><figcaption>{i + 1}/{len(imgs)} · {esc(f.split("_", 2)[-1].rsplit(".", 1)[0].replace("_", " "))}</figcaption></figure>'
        for i, (f, src) in enumerate(imgs))
    logh = "".join(f'<details class="log"><summary>Log · {esc(f)}</summary><pre>{esc(t)}</pre></details>' for f, t in logs)
    chips = f'<span class="chip">Reproduced {e["rep"][0]}/{e["rep"][1]}</span><span class="chip">{esc(", ".join(e["cases"]))}</span>'
    if not imgs:
        chips += '<span class="chip warn">Evidence gap</span>'
    belong = it["belong"]
    opts = "".join(f'<option{" selected" if b == belong else ""}>{b}</option>' for b in ["RD", "PC-Doc", "PM", "PC-Art", "Setup Kit", "Marketing", "RD-ECL"])
    topts = "".join(f'<option{" selected" if t == it["type"] else ""}>{t}</option>' for t in ["Functional", "UI"])
    sev = "".join(f'<label><input type="radio" name="sev{n}" value="{s}"{" checked" if s == it["sev"] else ""}>{s}</label>' for s in range(1, 6))
    cards.append(f'''
<article class="card" id="F-{n}" data-n="{n}" style="--sev:{SEVC[it['sev']]}">
  <header><span class="fid">F-{n}</span><h3>{esc(e['title'])}</h3><div class="chips">{chips}</div></header>
  <p class="why">{esc(e['res'])} Expected: {esc(e['exp'])}</p>
  <div class="sd" data-sd="{n}">{esc(it['short'])}</div>
  <details class="body"><summary>Description (as filed)</summary><pre>{esc(it['desc'])}</pre></details>
  <div class="strip">{strip}</div>
  {logh}
  <aside class="read"><b>My read.</b> {esc(e['note'])}</aside>
  <div class="bar">
    <label class="file"><input type="checkbox" data-k="file" checked> file</label>
    <span class="sev" data-k="sev">Sev {sev}</span>
    <label>Belong <select data-k="belong">{opts}</select></label>
    <label>Type <select data-k="type">{topts}</select></label>
    <label class="ctx">Add context — what am I missing? <textarea data-k="note" rows="1" placeholder="Rewrite, split, merge, hold reason…"></textarea></label>
  </div>
</article>''')

held = "".join(f"<tr><td>{esc(k)}</td><td>{esc(d)}</td><td>{esc(q)}</td></tr>" for k, d, q in G.HELD)
notr = "".join(f"<tr><td>{esc(k)}</td><td>{esc(a)}</td><td>{esc(b)}</td></tr>" for k, a, b in G.OBS_NOT)
sevcount = {}
for it in items:
    sevcount[it["sev"]] = sevcount.get(it["sev"], 0) + 1
tally = " · ".join(f"S{s} ×{c}" for s, c in sorted(sevcount.items()))

PAGE_HTML = f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Hair Color eBugs R1</title>
<style>
:root{{--bg:#f7f6f3;--fg:#1d1c1a;--mut:#6b675f;--card:#fff;--line:#e3e0d8;--acc:#b4531f;--s1:#b42318;--s2:#d9480f;--s3:#b08900;--s4:#5f7f3a;--warn:#b42318;--mono:ui-monospace,Consolas,monospace;--gutter:16px}}
@media (prefers-color-scheme:dark){{:root:not([data-theme="light"]){{--bg:#161514;--fg:#ece9e3;--mut:#a39e94;--card:#211f1d;--line:#36332f;--acc:#f08a4b;--s1:#f0625a;--s2:#ff8a4c;--s3:#e0b84a;--s4:#9cc26a;--warn:#ff7a70}}}}
:root[data-theme="dark"]{{--bg:#161514;--fg:#ece9e3;--mut:#a39e94;--card:#211f1d;--line:#36332f;--acc:#f08a4b;--s1:#f0625a;--s2:#ff8a4c;--s3:#e0b84a;--s4:#9cc26a;--warn:#ff7a70}}
*{{box-sizing:border-box}} body{{margin:0;background:var(--bg);color:var(--fg);font:15px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}}
main{{max-width:1080px;margin:0 auto;padding:24px var(--gutter) 80px}}
.eyebrow{{color:var(--mut);font-size:13px;text-transform:uppercase;letter-spacing:.06em}} h1{{margin:4px 0 6px;font-size:26px}}
dl.facts{{display:flex;flex-wrap:wrap;gap:8px 22px;margin:14px 0;padding:12px 14px;background:var(--card);border:1px solid var(--line);border-radius:10px}}
dl.facts div{{min-width:0}} dt{{font-size:12px;color:var(--mut)}} dd{{margin:0;font-weight:600;overflow-wrap:anywhere}} .need{{color:var(--warn)}}
.panel{{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:14px 16px;margin:16px 0}} .panel h2{{margin:0 0 8px;font-size:18px}}
.grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px}} .grid label{{display:flex;flex-direction:column;font-size:13px;color:var(--mut)}}
input[type=text],select,textarea{{font:inherit;color:var(--fg);background:var(--bg);border:1px solid var(--line);border-radius:6px;padding:5px 8px;max-width:100%}}
.card{{background:var(--card);border:1px solid var(--line);border-left:4px solid var(--sev);border-radius:10px;padding:14px 16px;margin:18px 0;min-width:0}}
.card.held{{opacity:.45}} .card header{{display:flex;flex-wrap:wrap;align-items:baseline;gap:8px}} .fid{{font-weight:700;color:var(--sev)}} .card h3{{margin:0;font-size:17px;flex:1 1 300px}}
.chips{{display:flex;flex-wrap:wrap;gap:6px}} .chip{{font-size:12px;border:1px solid var(--line);border-radius:999px;padding:1px 8px;color:var(--mut)}} .chip.warn{{color:var(--warn);border-color:var(--warn)}}
.why{{margin:8px 0}} .sd{{font-family:var(--mono);font-size:13px;background:var(--bg);border:1px solid var(--line);border-radius:6px;padding:8px 10px;overflow-wrap:anywhere}}
details summary{{cursor:pointer;color:var(--mut);margin:8px 0 4px}} pre{{white-space:pre-wrap;overflow-wrap:anywhere;font-family:var(--mono);font-size:12.5px;background:var(--bg);border:1px solid var(--line);border-radius:6px;padding:10px;margin:0}}
.strip{{display:flex;gap:10px;overflow-x:auto;padding:8px 0}} .th{{margin:0;flex:0 0 auto;width:110px;cursor:zoom-in}} .th img{{width:110px;height:auto;border-radius:6px;border:1px solid var(--line);display:block}} .th figcaption{{font-size:11px;color:var(--mut);overflow-wrap:anywhere}}
.read{{border-left:3px solid var(--acc);background:color-mix(in srgb,var(--acc) 8%,transparent);padding:8px 12px;margin:10px 0;border-radius:0 6px 6px 0;font-size:14px;overflow-wrap:anywhere}}
.bar{{display:flex;flex-wrap:wrap;gap:10px 16px;align-items:center;border-top:1px solid var(--line);padding-top:10px;font-size:14px}} .sev label{{margin-left:6px}}
.ctx{{flex:1 1 260px;display:flex;flex-direction:column;color:var(--acc);font-weight:600}} .ctx textarea{{width:100%;font-weight:400;resize:vertical}}
table{{width:100%;border-collapse:collapse;font-size:14px;table-layout:fixed}} td,th{{border-top:1px solid var(--line);padding:6px;vertical-align:top;text-align:left;overflow-wrap:anywhere}}
th:first-child,td:first-child{{width:90px}} button{{font:inherit;background:var(--acc);color:#fff;border:0;border-radius:8px;padding:8px 14px;cursor:pointer}}
#lb{{position:fixed;inset:0;background:rgba(0,0,0,.85);display:none;flex-direction:column;align-items:center;justify-content:center;padding:16px;z-index:9}} #lb.on{{display:flex}} #lb img{{max-width:100%;max-height:78vh}} #lb p{{color:#eee;margin:8px 0;text-align:center}} #lb nav{{display:flex;gap:10px}}
@media (max-width:600px){{h1{{font-size:21px}} .card{{padding:12px}}}}
</style></head><body><main>
<div class="eyebrow">spec-casebook · PhotoDirector Android · AI Hair Color Custom · round R1</div>
<h1>AI Hair Color Custom — {len(items)} eBug drafts for review</h1>
<p>Decide file / hold, severity and owner per card, add context where the draft misses something, then press <b>Copy decisions</b> and paste the block back in chat. Nothing has been filed.</p>
<dl class="facts"><div><dt>Version</dt><dd>20.19.0</dd></div><div><dt>Build No</dt><dd>90201900</dd></div><div><dt>Server</dt><dd>Test Server</dd></div>
<div><dt>Device</dt><dd>Galaxy S23 (SM-S9110) / Android 16</dd></div><div><dt>Tested account</dt><dd>Free, 1994 → 1916 credits</dd></div>
<div><dt>TRCode</dt><dd>TR261111-0042 (build 20.19.0.v202611111946 = versionCode 90201900, the build tested)</dd></div><div><dt>ECL product</dt><dd>PhotoDirector Mobile for Android (from the TR)</dd></div>
<div><dt>Severity</dt><dd>{tally}</dd></div><div><dt>UX</dt><dd>UX ×0</dd></div></dl>
<p style="color:var(--mut);font-size:14px">Calibration: the format check's Sept 2026 export has Sev 4 in 1 of 175 tickets, so only the copy entry (F-2) is S4; S2 is kept for findings that lose work, charge for the wrong thing or skip a spec'd guard.</p>
<section class="panel"><h2>Batch decisions</h2><div class="grid">
<label>Filing account (Creator)<input type="text" id="b-creator" value="WILLY_WU"></label>
<label>TRCode<input type="text" id="b-tr" value="TR261111-0042"></label>
<label>Source tag<input type="text" id="b-tag" value="[AIAgent]"></label>
<label>Method<select id="b-method"><option>API (new way)</option><option>Browser form (old way)</option></select></label>
<label>ECL product<input type="text" id="b-prod" value="PhotoDirector Mobile for Android"></label></div></section>
{''.join(cards)}
<section class="panel"><h2>PM questions — held, not drafted</h2><table><tr><th>Item</th><th>Kind</th><th>What to decide</th></tr>{held}</table></section>
<section class="panel"><h2>Reproduced but deliberately not filed</h2><p>No same-OS duplicate was found (read-only dedupe over the Android pool, dedupe.txt; TR261111-0042 holds no AI Hair Color ticket, 2026-11-13). Related open tickets named in Notes: PHA262026P0039 (F-1), PHA262026P0047 (F-13).</p><table><tr><th>Item</th><th>What was seen</th><th>Why not raised</th></tr>{notr}</table></section>
<section class="panel"><h2>Gaps you should know about</h2><ul>
<li>No TR was named: the build was the one already installed (20.19.0 / 90201900). Filing needs the TR whose header names this build.</li>
<li>library/phd/product.json's ECL product 「PhotoDirector Mobile for Android」 is unconfirmed (the dedupe found PHA tickets under it).</li>
<li>Spec is the PM Figma page only (no Design file, Q-15); every Expect Result rests on PM text. System-Back expectations (F-7, part of F-14) are a QA rule (rule pass 8).</li>
<li>22 cases Blocked: 15 test-data (no Intro Demo, premium styles and low balance on a Free 1916-credit account, deeplink format, CMS list), 4 observability (no request body in the log, no fault switch), 3 upstream of F-1.</li>
<li>verify_ebug_drafts.py could not run on Windows (its index search loops); check_ebug_format.py passed with 0 errors.</li></ul></section>
<section class="panel"><h2>Copy decisions</h2><button id="copy">Copy decisions</button> <span id="copied" style="color:var(--mut)"></span><pre id="out" style="margin-top:10px"></pre></section>
</main>
<div id="lb"><img alt=""><p></p><nav><button id="pv">← Prev</button><button id="cl">Close</button><button id="nx">Next →</button></nav></div>
<script>
const KEY='hcc-r1-review';let st={{}};try{{st=JSON.parse(localStorage.getItem(KEY)||'{{}}')}}catch(e){{}}
function save(){{try{{localStorage.setItem(KEY,JSON.stringify(st))}}catch(e){{}}}}
const sevc={{1:'var(--s1)',2:'var(--s2)',3:'var(--s3)',4:'var(--s4)',5:'var(--s4)'}};
document.querySelectorAll('.card').forEach(c=>{{const n=c.dataset.n,s=st[n]||(st[n]={{}});
 const f=c.querySelector('[data-k=file]'),b=c.querySelector('[data-k=belong]'),t=c.querySelector('[data-k=type]'),no=c.querySelector('[data-k=note]');
 if(s.file!==undefined)f.checked=s.file; if(s.belong)b.value=s.belong; if(s.type)t.value=s.type; if(s.note)no.value=s.note;
 if(s.sev){{const r=c.querySelector(`input[name=sev${{n}}][value="${{s.sev}}"]`);if(r)r.checked=true}}
 const paint=()=>{{c.classList.toggle('held',!f.checked);const v=c.querySelector(`input[name=sev${{n}}]:checked`).value;c.style.setProperty('--sev',sevc[v])}};paint();
 c.addEventListener('change',()=>{{s.file=f.checked;s.belong=b.value;s.type=t.value;s.note=no.value;s.sev=c.querySelector(`input[name=sev${{n}}]:checked`).value;paint();save()}});
 no.addEventListener('input',()=>{{s.note=no.value;save()}});}});
['b-creator','b-tr','b-tag','b-method','b-prod'].forEach(id=>{{const el=document.getElementById(id);if(st[id])el.value=st[id];el.addEventListener('input',()=>{{st[id]=el.value;save()}});el.addEventListener('change',()=>{{st[id]=el.value;save()}})}});
document.getElementById('copy').onclick=()=>{{const v=id=>document.getElementById(id).value;
 let o=`Account: ${{v('b-creator')||'(needed)'}}\\nTRCode: ${{v('b-tr')||'(needed)'}}\\nSource tag: ${{v('b-tag')}}\\nMethod: ${{v('b-method')}}\\nECL product: ${{v('b-prod')}}\\n\\n| # | Sev | Belong | Type | UX check | Action | Short Description | Note |\\n|---|---|---|---|---|---|---|---|\\n`;
 document.querySelectorAll('.card').forEach(c=>{{const n=c.dataset.n;o+=`| ${{n}} | ${{c.querySelector(`input[name=sev${{n}}]:checked`).value}} | ${{c.querySelector('[data-k=belong]').value}} | ${{c.querySelector('[data-k=type]').value}} | — | ${{c.querySelector('[data-k=file]').checked?'file':'hold'}} | ${{c.querySelector('.sd').textContent}} | ${{c.querySelector('[data-k=note]').value.replace(/\\|/g,'/').replace(/\\n/g,' ')}} |\\n`}});
 document.getElementById('out').textContent=o;try{{navigator.clipboard.writeText(o);document.getElementById('copied').textContent='Copied.'}}catch(e){{document.getElementById('copied').textContent='Select the block below and copy it.'}}}};
const lb=document.getElementById('lb'),li=lb.querySelector('img'),lp=lb.querySelector('p');let cur=[],ci=0;
function show(){{const f=cur[ci];li.src=f.querySelector('img').src;lp.textContent=`F-${{f.dataset.n}} · ${{ci+1}} of ${{cur.length}} — ${{f.querySelector('figcaption').textContent}}`}}
document.querySelectorAll('.th').forEach(f=>f.onclick=()=>{{cur=[...document.querySelectorAll(`.th[data-n="${{f.dataset.n}}"]`)];ci=+f.dataset.i;show();lb.classList.add('on')}});
document.getElementById('pv').onclick=()=>{{ci=(ci+cur.length-1)%cur.length;show()}};document.getElementById('nx').onclick=()=>{{ci=(ci+1)%cur.length;show()}};
document.getElementById('cl').onclick=()=>lb.classList.remove('on');
document.addEventListener('keydown',e=>{{if(!lb.classList.contains('on'))return;if(e.key==='Escape')lb.classList.remove('on');if(e.key==='ArrowLeft')document.getElementById('pv').click();if(e.key==='ArrowRight')document.getElementById('nx').click()}});
</script></body></html>'''
open(PAGE, "w", encoding="utf-8").write(PAGE_HTML)
print(f"wrote {PAGE} ({os.path.getsize(PAGE) // 1024} KB, {len(items)} cards)")
