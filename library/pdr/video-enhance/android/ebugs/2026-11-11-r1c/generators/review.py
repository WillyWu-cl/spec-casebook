#!/usr/bin/env python3
"""Review page for Video Enhance Android eBug batch 3 (R1c, ISS-VEA-34) on 16.9.0 (2611091).

Usage: python3 library/pdr/video-enhance/android/ebugs/2026-11-11-r1c/generators/review.py
Reads upload/bodies.json (drafts_to_bodies.py) and the filing defaults (scripts/ebug-defaults.ts), embeds each image as
a downscaled data: URI and writes 20261111_eBug_review_Video-Enhance-R1c_16.9.0.html. After filing, filed_bugcodes.json
puts each card's BugCode on it. Layout: ebug-tr-filer/references/review-page.md. Copy decisions copies with
execCommand first, then the Clipboard API, then asks for Cmd+C (an app preview pane refuses the Clipboard API).
"""
import base64, html, json, os, subprocess, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.dirname(HERE)
REPO = os.path.abspath(os.path.join(OUT, *[".."] * 6))
PAGE = f"{OUT}/20261111_eBug_review_Video-Enhance-R1c_16.9.0.html"
bodies = json.load(open(f"{OUT}/upload/bodies.json", encoding="utf-8"))
DEF = json.loads(subprocess.run(["node", "scripts/ebug-defaults.ts", "pdr/video-enhance", "android", "--json"],
                                cwd=REPO, capture_output=True, text=True).stdout)
filed = {}
if os.path.exists(f"{OUT}/filed_bugcodes.json"):
    filed = {b["iss"]: b["bugcode"] for b in json.load(open(f"{OUT}/filed_bugcodes.json", encoding="utf-8"))["bugs"]}

CAPTION = {
    "16.9.0_vea34_8k_converting_dialog.jpg": "Tapping the 8K video shows the editor's conversion dialog: the panel will open on a Full HD copy, not the source.",
    "16.9.0_vea34_8k_panel_black.jpg": "The panel after the conversion: black Preview, 「0fps · 1080p」, fps chips disabled, 1080p rate — the defect.",
    "16.9.0_vea34_4k_panel_ok.jpg": "Control: a 4K video in the same row opens correctly (Preview shows it, 「30fps · 2160p」, 4K rate).",
}


def thumb(path):
    with tempfile.TemporaryDirectory() as t:
        o = os.path.join(t, "x.jpg")
        subprocess.run(["sips", "-Z", "760", "-s", "format", "jpeg", "-s", "formatOptions", "72", path, "--out", o],
                       capture_output=True, check=True)
        return "data:image/jpeg;base64," + base64.b64encode(open(o, "rb").read()).decode()


e = lambda s: html.escape(s, quote=True)
cards = []
for n, (k, b) in enumerate(bodies.items(), 1):
    imgs = [f for f in b["files"] if f.endswith(".jpg")]
    logs = [f for f in b["files"] if f.endswith(".txt")]
    strip = "".join(f'<button class="th" data-f="F-{n}" data-i="{i}" data-cap="{e(CAPTION.get(f, f))}" data-src="{thumb(os.path.join(b["images_dir"], f))}">'
                    f'<img alt="{e(f)}" src="" loading="lazy"><span>{i + 1}/{len(imgs)}</span></button>' for i, f in enumerate(imgs))
    logtxt = "".join(f'<details><summary>Log · {e(f)}</summary><pre>{e(open(os.path.join(b["images_dir"], f), encoding="utf-8").read())}</pre></details>' for f in logs)
    desc = b["desc"]
    steps = desc.split("\nResult:")[0]
    code = filed.get(b["iss"])
    chip = f'<a class="chip ok" href="https://ecl.cyberlink.com/IF3/ebug/BPM/FormView/{code}">{code}</a>' if code else '<span class="chip">CONFIRMED · 1/1</span>'
    cards.append(f'''<article class="card" id="F-{n}" data-iss="{e(b["iss"])}" data-short="{e(b["short"])}">
  <header><b class="fid">F-{n}</b> <span class="iss">{e(b["iss"])}</span> {chip}</header>
  <h2>An 8K video opens Video Enhance on a Full HD copy with a black Preview</h2>
  <p class="why">Anyone who picks an 8K video gets a panel they cannot judge: no picture, 「0fps」, no fps choice and a 1080p price, although today's Design takes 4K for any larger source. The 1440p and 4K videos in the same row are fine.</p>
  <div class="sd">{e(b["short"])}</div>
  <details><summary>Repro steps and full description</summary><pre>{e(desc)}</pre></details>
  <div class="strip">{strip}</div>
  {logtxt}
  <div class="read"><b>My read.</b> Owner RD: the Design's 預設值規則 states the rule (「來源超過最高選項時取最高」) and the app differs. Severity 2 like the rest of R1. PM E1's older 「≤ 4K, larger greyed」 is still open (Q-13), but even then this panel would be wrong, so it is a defect, not a PM question. Reproduced once (R1-a, 2026-11-10); not rerun.</div>
  <div class="bar">
    <label class="tog"><input type="checkbox" class="file" checked> file</label>
    <span class="seg" role="group">{"".join(f'<button class="sev{" on" if s == b["sev"] else ""}" data-s="{s}">{s}</button>' for s in range(1, 6))}</span>
    <select class="belong">{"".join(f'<option{" selected" if o == b["belong"] else ""}>{o}</option>' for o in ["RD", "Setup Kit", "PC-Art", "PC-Doc", "PM", "Marketing", "RD-ECL"])}</select>
    <select class="type">{"".join(f'<option{" selected" if o == "Functional" else ""}>{o}</option>' for o in ["Functional", "UI", "UX"])}</select>
    <label class="ctx"><span>Add context — what am I missing?</span><input class="note" type="text"></label>
  </div>
</article>''')

fact = lambda dt, dd: f"<div><dt>{dt}</dt><dd>{dd}</dd></div>"
src = f'from {DEF.get("from", "?")} — confirm'
page = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Video Enhance eBugs R1c</title>
<style>
:root{{--bg:#fbfaf7;--fg:#1d1d1b;--mut:#6b6a66;--line:#e2dfd8;--card:#fff;--acc:#2f5bd3;--warn:#b25b00;--s2:#c2410c;--ok:#1f7a4d;--mono:ui-monospace,SFMono-Regular,Menlo,monospace}}
@media (prefers-color-scheme:dark){{:root:not([data-theme="light"]){{--bg:#171716;--fg:#ecebe7;--mut:#a3a19b;--line:#33322f;--card:#21201e;--acc:#86a6ff;--warn:#f0a050;--s2:#fb923c;--ok:#5fcf98}}}}
:root[data-theme="dark"]{{--bg:#171716;--fg:#ecebe7;--mut:#a3a19b;--line:#33322f;--card:#21201e;--acc:#86a6ff;--warn:#f0a050;--s2:#fb923c;--ok:#5fcf98}}
*{{box-sizing:border-box}} body{{margin:0;background:var(--bg);color:var(--fg);font:15px/1.5 -apple-system,system-ui,sans-serif}}
.wrap{{max-width:980px;margin:0 auto;padding:24px 16px 64px}} .eye{{color:var(--mut);font-size:13px;letter-spacing:.04em}}
h1{{margin:4px 0 6px;font-size:24px}} dl{{display:flex;flex-wrap:wrap;gap:8px 20px;margin:14px 0}} dl div{{min-width:0}} dt{{font-size:12px;color:var(--mut)}} dd{{margin:0;font-weight:600}} .need{{color:var(--warn)}}
.cal{{border-left:3px solid var(--line);padding:6px 12px;color:var(--mut);font-size:14px}}
.card{{background:var(--card);border:1px solid var(--line);border-left:4px solid var(--s2);border-radius:10px;padding:16px;margin:18px 0}} .card.hold{{opacity:.45}}
.card h2{{font-size:18px;margin:6px 0}} .fid{{color:var(--s2)}} .iss{{color:var(--mut);font-size:13px}} .chip{{font-size:12px;border:1px solid var(--line);border-radius:99px;padding:1px 8px;margin-left:6px}} .chip.ok{{color:var(--ok);border-color:var(--ok)}}
.sd{{font-family:var(--mono);font-size:13px;background:var(--bg);border:1px solid var(--line);border-radius:6px;padding:8px 10px;overflow-wrap:anywhere;margin:10px 0}}
pre{{white-space:pre-wrap;overflow-wrap:anywhere;font:12.5px/1.45 var(--mono);background:var(--bg);border:1px solid var(--line);border-radius:6px;padding:10px;margin:6px 0}}
details{{margin:8px 0}} summary{{cursor:pointer;color:var(--acc)}}
.strip{{display:flex;gap:8px;overflow-x:auto;padding:6px 0}} .th{{position:relative;flex:0 0 104px;height:150px;padding:0;border:1px solid var(--line);border-radius:6px;background:#000;cursor:zoom-in;overflow:hidden}} .th img{{width:100%;height:100%;object-fit:cover}} .th span{{position:absolute;right:4px;bottom:4px;background:#000a;color:#fff;font-size:11px;padding:0 4px;border-radius:4px}}
.read{{border-left:3px solid var(--acc);padding:8px 12px;margin:12px 0;font-size:14px}}
.bar{{display:flex;flex-wrap:wrap;gap:10px;align-items:center;border-top:1px solid var(--line);padding-top:12px}} .seg button{{border:1px solid var(--line);background:var(--card);color:var(--fg);padding:4px 10px;cursor:pointer}} .seg button.on{{background:var(--s2);color:#fff;border-color:var(--s2)}}
select,input[type=text]{{background:var(--card);color:var(--fg);border:1px solid var(--line);border-radius:6px;padding:5px 8px;font:inherit}} .ctx{{flex:1 1 260px;display:flex;flex-direction:column;gap:2px;min-width:0}} .ctx span{{color:var(--acc);font-size:13px;font-weight:600}}
.panel{{border:1px solid var(--line);border-radius:10px;padding:14px 16px;margin:16px 0}} .panel h3{{margin:0 0 6px;font-size:16px}} table{{width:100%;border-collapse:collapse;font-size:14px}} td,th{{border-top:1px solid var(--line);padding:6px;text-align:left;vertical-align:top;overflow-wrap:anywhere}}
textarea{{width:100%;min-height:150px;font:12.5px var(--mono);background:var(--bg);color:var(--fg);border:1px solid var(--line);border-radius:6px;padding:8px}} .btn{{background:var(--acc);color:#fff;border:0;border-radius:6px;padding:8px 14px;font:inherit;cursor:pointer}}
#lb{{position:fixed;inset:0;background:#000d;display:none;flex-direction:column;align-items:center;justify-content:center;padding:16px;z-index:9}} #lb.on{{display:flex}} #lb img{{max-width:100%;max-height:78vh}} #lb p{{color:#fff;max-width:720px;text-align:center}} #lb nav{{display:flex;gap:14px;color:#fff;align-items:center}} #lb button{{background:#fff2;color:#fff;border:0;border-radius:6px;padding:6px 12px;cursor:pointer}}
</style></head><body><div class="wrap">
<div class="eye">AIAgent · PowerDirector Mobile for Android · {e(DEF.get("creator", ""))}</div>
<h1>Video Enhance — eBug review, batch 3</h1>
<p>One defect, drafted from TC-022 step 3 after the re-analysis (table v5). Set file or hold, severity, owner and type, add context, then Copy decisions and paste the result back. {"Filed: " + ", ".join(filed.values()) + "." if filed else "Nothing has been filed, uploaded or commented."}</p>
<dl>{fact("Version", "16.9.0")}{fact("Build No", "2611091")}{fact("Server", "Stage")}{fact("Account", f'<span class="need">{e(DEF.get("creator", "needed"))}</span> <small>({e(src)})</small>')}{fact("TRCode", f'<span class="need">{e(DEF.get("tr", "needed"))}</span> <small>({e(src)})</small>')}{fact("Method", "API")}{fact("Tally", "1 card · S2 ×1 · UX ×0")}</dl>
<p class="cal">Severity: every R1 card was filed at 2 by your decision (batches 1 and 2); this one follows. Nothing is proposed at 1: the feature works for every source up to 4K.</p>
{"".join(cards)}
<section class="panel"><h3>Reproduced but deliberately not filed</h3><table><tr><th>Item</th><th>Why</th></tr>
<tr><td>TC-022 steps 1–2 (1440p, 4K)</td><td>Pass under table v5 (4K selected, right badge)</td></tr>
<tr><td>TC-022 steps 4–5 (under 1 s, MKV)</td><td>Already filed: DRA262611P0089</td></tr>
<tr><td>Possible duplicates</td><td>None on the Android pool: DRA262611P0073 (「0fps」 for stock / Timeline, another cause) is related; DRA262603-0149 (8K trim preview in the Media Picker) and DRA262610-0023 (Timeline conversion dialog) are other screens; DRA262611P0072 was Cancelled (old board). <code>dedupe.txt</code></td></tr></table></section>
<section class="panel"><h3>Gaps you should know about</h3><ul><li>Reproduced once (R1-a, 2026-11-10 17:19); not rerun on another 8K file.</li><li>Play was not tapped on the black Preview, so whether it plays at all is not recorded.</li><li>PM E1 (≤ 4K) is still open as Q-13; the Expect follows the Design.</li></ul></section>
<section class="panel"><h3>Copy decisions</h3><button class="btn" id="copy">Copy decisions</button> <span id="msg"></span><textarea id="out" readonly></textarea></section>
</div>
<div id="lb" role="dialog"><img alt=""><p></p><nav><button id="pv">← Prev</button><span id="pos"></span><button id="nx">Next →</button><button id="cl">Close</button></nav></div>
<script>
const KEY = "ve-r1c-review";
let st = {{}}; try {{ st = JSON.parse(localStorage.getItem(KEY) || "{{}}"); }} catch (e) {{}}
const save = () => {{ try {{ localStorage.setItem(KEY, JSON.stringify(st)); }} catch (e) {{}} }};
const cards = [...document.querySelectorAll(".card")];
function sync() {{
  const rows = cards.map(c => {{
    const s = st[c.id] || {{}};
    c.querySelector(".file").checked = s.file !== false; c.classList.toggle("hold", s.file === false);
    const sev = s.sev || +c.querySelector(".sev.on").dataset.s;
    c.querySelectorAll(".sev").forEach(b => b.classList.toggle("on", +b.dataset.s === sev));
    if (s.belong) c.querySelector(".belong").value = s.belong; if (s.type) c.querySelector(".type").value = s.type;
    if (s.note !== undefined) c.querySelector(".note").value = s.note;
    return `| ${{c.id}} | ${{c.dataset.iss}} | ${{sev}} | ${{c.querySelector(".belong").value}} | ${{c.querySelector(".type").value}} | ${{s.file === false ? "hold" : "file"}} | ${{c.dataset.short}} | ${{(c.querySelector(".note").value || "").replace(/\\|/g, "/")}} |`;
  }});
  document.getElementById("out").value = `Account: {e(DEF.get("creator", ""))}\\nMethod: API\\nSource tag: [AIAgent]\\nTRCode: {e(DEF.get("tr", ""))}\\n\\n| # | ISS | Sev | Belong | Type | Action | Short Description | Note |\\n|---|---|---|---|---|---|---|---|\\n` + rows.join("\\n");
}}
cards.forEach(c => {{
  const s = () => (st[c.id] = st[c.id] || {{}});
  c.querySelector(".file").onchange = ev => {{ s().file = ev.target.checked; save(); sync(); }};
  c.querySelectorAll(".sev").forEach(b => b.onclick = () => {{ s().sev = +b.dataset.s; save(); sync(); }});
  c.querySelector(".belong").onchange = ev => {{ s().belong = ev.target.value; save(); sync(); }};
  c.querySelector(".type").onchange = ev => {{ s().type = ev.target.value; save(); sync(); }};
  c.querySelector(".note").oninput = ev => {{ s().note = ev.target.value; save(); sync(); }};
}});
document.querySelectorAll(".th").forEach(b => {{ b.querySelector("img").src = b.dataset.src; }});
const lb = document.getElementById("lb"); let group = [], at = 0;
function show() {{ const b = group[at]; lb.querySelector("img").src = b.dataset.src; lb.querySelector("p").textContent = b.dataset.cap; document.getElementById("pos").textContent = `${{b.dataset.f}} · ${{at + 1}} of ${{group.length}}`; }}
document.querySelectorAll(".th").forEach(b => b.onclick = () => {{ group = [...document.querySelectorAll(`.th[data-f="${{b.dataset.f}}"]`)]; at = +b.dataset.i; show(); lb.classList.add("on"); }});
const step = d => {{ at = (at + d + group.length) % group.length; show(); }};
document.getElementById("pv").onclick = () => step(-1); document.getElementById("nx").onclick = () => step(1); document.getElementById("cl").onclick = () => lb.classList.remove("on");
document.addEventListener("keydown", ev => {{ if (!lb.classList.contains("on")) return; if (ev.key === "Escape") lb.classList.remove("on"); if (ev.key === "ArrowLeft") step(-1); if (ev.key === "ArrowRight") step(1); }});
document.getElementById("copy").onclick = () => {{
  const t = document.getElementById("out"), msg = document.getElementById("msg");
  const ok = () => {{ msg.textContent = "Copied. Paste it back in the chat."; }};
  t.focus(); t.select(); let done = false; try {{ done = document.execCommand("copy"); }} catch (e) {{}}
  if (done) {{ ok(); return; }}
  (navigator.clipboard ? navigator.clipboard.writeText(t.value) : Promise.reject()).then(ok, () => {{ msg.textContent = "This window does not allow copying (an app preview pane can block it; open the file in Safari or Chrome). The text is selected: press Cmd+C."; }});
}};
sync();
</script></body></html>'''
open(PAGE, "w", encoding="utf-8").write(page)
print(f"wrote {PAGE} ({len(page) // 1024} KB, {len(cards)} card)")
