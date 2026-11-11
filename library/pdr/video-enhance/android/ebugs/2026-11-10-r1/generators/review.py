#!/usr/bin/env python3
"""Build the Video Enhance Android R1 eBug review page from upload/bodies.json (adapted from the AI Mini Drama A7 page).

Reuses the iOS P9 review page's stylesheet (ios/ebugs/2026-10-27-p9) and its card / decisions script, with Android text, a
PM-questions table and the Blocked groups. Run after ebugs.py, drafts_to_bodies.py, check_ebug_format.py and the dedupe.
Thumbnails are made with `sips` (no Pillow on this machine). Nothing is filed; the page is a self-contained file here.
"""
import base64, csv, json, os, re, subprocess, sys, tempfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import ebugs as G

REPO, OUT, RUN = G.REPO, G.OUT, G.RUN
SHELL = f"{REPO}/library/pdr/ai-mini-drama/ios/ebugs/2026-10-27-p9/20261022_eBug_review_AI-Mini-Drama-P9_16.9.0.html"
PAGE = f"{OUT}/20261110_eBug_review_Video-Enhance-R1_16.9.0.html"

WHY = {
 "ISS-VEA-01": "The Design's 1005_Update wording names the feature 「AI Video Enhance」 everywhere; the two entry points keep the old 「Video Enhance」.",
 "ISS-VEA-02": "The 2K+ block (user requirement 2026-10-16) is not there: 1440p, 4K and 8K sources open the panel and could be enhanced.",
 "ISS-VEA-03": "Stock downloads and Timeline clips show 「0fps」 and lock every fps chip, so the output fps cannot be chosen.",
 "ISS-VEA-04": "The Design's Preview shows 「00:00/12:30」 on entry; the app shows no time until play.",
 "ISS-VEA-05": "The panel shows 「02:30」 for 150.x s while the limit rounds up, so the user is refused Professional at a length the panel shows as allowed.",
 "ISS-VEA-06": "Overbilling: every video of an exact whole-second length pays one second more (charged so: 30 s → 31).",
 "ISS-VEA-07": "Offline, Enhance gives no feedback at all (nothing charged).",
 "ISS-VEA-08": "The processing ring sits at 0% during a 48 s local transcode, then stalls 30–40 s at a time.",
 "ISS-VEA-09": "Charged 30 for a task that never uploaded; the refund came only ~3 h later.",
 "ISS-VEA-10": "The completion banner's View opens a Result that never loads, while the same task opens fine from Recent task.",
 "ISS-VEA-11": "Recent task has no ‹; ⌂ and system Back both leave to the Launcher, so the panel is lost every time.",
 "ISS-VEA-12": "Recent task notice copy: 「1 year」 / 「Select」 for the Design's 「1 Year」 / 「Manage」.",
 "ISS-VEA-13": "Cancelled tasks leave failed cards with a garbage length 「3961:06:40」 and a Retry the spec does not have.",
 "ISS-VEA-14": "Task times are 25–40× the company performance standard (1.5–2.5× the video length).",
 "ISS-VEA-15": "The Sharp style has no effect in Professional: nine pairs of results are practically identical.",
}
RELATED = {
 "ISS-VEA-01": "Read-only ECL dedupe (Android pool): closest DRA242410-0146 (Close, 14.5.0, old AI Video Enhancer name) — not the same.",
 "ISS-VEA-09": "Rests on R-089 (Design: charge when the upload finishes) and the refund rule; R-090 (backgrounding = cancel, no charge) is a PM proposal (Q-18) — the table note asks to decide with the user before filing. The TC-113 Leave charge is PM question PQ-12.",
 "ISS-VEA-07": "The toast copy is a PM proposal (C3 [建議]); the finding is the missing feedback. Hold as a PM question if you read C3 as its only basis.",
 "ISS-VEA-11": "Read-only ECL dedupe: DRA252503-0298 / DRA242410-0074 (Close, old flow) are other symptoms.",
 "ISS-VEA-14": "Related, not duplicates: DRA262608-0071 / -0072 (Android, NewCreated, PM: static 「4 minutes left」, zero progress, 16.6 flow).",
 "ISS-VEA-15": "Off-case observation O-28 (the combination rows are recorded Fail only for copy). RD may forward to PM if Professional is meant to ignore the style.",
}
DEF = json.loads(subprocess.run(["node", f"{REPO}/scripts/ebug-defaults.ts", "pdr/ai-mini-drama", "android", "--json"], capture_output=True, text=True, check=True).stdout)  # no Video Enhance batch yet: newest PowerDirector Android batch



def thumb(path):
    with tempfile.TemporaryDirectory() as d:
        out = os.path.join(d, "t.jpg")
        subprocess.run(["sips", "-Z", "900", "-s", "format", "jpeg", "-s", "formatOptions", "60", path, "--out", out],
                       check=True, capture_output=True)
        return "data:image/jpeg;base64," + base64.b64encode(open(out, "rb").read()).decode()


s = open(SHELL, encoding="utf-8").read()
style = s[:s.index("</style>")]
style = style.replace("<title>AI Mini Drama P9 eBugs</title>", "<title>Video Enhance R1 eBugs</title>")
# Log excerpts start collapsed and wrap like the other card text; nothing in a card may push it wider than the page
# (user, 2026-10-28: half-width window).
style += """
.logbox summary{padding:8px 10px;font-size:13px;font-weight:600;cursor:pointer}
.logbox summary span{font:12px var(--mono);opacity:.75;margin-left:6px;font-weight:400}
.logbox pre{white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word;margin:0;padding:8px 10px}
.card,.card>*,main,section,details,.dupbox,.myread,.sd,.bar,.chips,.strip{min-width:0;max-width:100%}
.card pre,.card code,.dupbox,.myread,.sd,td{overflow-wrap:anywhere}
.card img{max-width:100%;height:auto}
.strip,.bar{flex-wrap:wrap}
table{max-width:100%}
.tblwrap,.scrollx{overflow-x:auto;max-width:100%}
"""
i = s.index("const DATA = ") + len("const DATA = ")
_, end = json.JSONDecoder().raw_decode(s[i:])
tail = s[i + end:]

bodies = json.load(open(f"{OUT}/upload/bodies.json", encoding="utf-8"))
# After filing (2026-10-28): cards show the boxed frames as uploaded and each card carries its BugCode.
FILED_JSON = f"{OUT}/filed_bugcodes.json"  # absent until this batch is filed
filed = None
if os.path.exists(FILED_JSON):
    fj = json.load(open(FILED_JSON, encoding="utf-8"))
    filed = {"meta": {**fj["meta"], "method": "API", "tag": "AIAgent"},
             "bugs": {x["iss"]: {"code": x["bugcode"], "sev": x["severity"], "belong": x["belong"], "files": len(x["attachments"])}
                      for x in fj["bugs"]}}
FILING_DIR = f"{OUT}/upload_filing"
def src(b, f):
    p = os.path.join(FILING_DIR, f)
    return p if filed and os.path.exists(p) else os.path.join(b["images_dir"], f)
E = {e["iss"]: e for e in G.E}
entries = []
for k, b in bodies.items():
    e = E[b["iss"]]
    imgs = [{"src": thumb(src(b, f)), "name": f} for f in b["files"] if f.endswith(".jpg")]
    logs = [f for f in b["files"] if f.endswith(".txt")]
    logtext = [{"name": f, "text": open(os.path.join(b["images_dir"], f), encoding="utf-8").read()} for f in logs]
    d = None
    rel = RELATED.get(b["iss"], "Read-only ECL dedupe (Android pool, AI Video Enhance): no likely duplicate.")
    if logs:
        rel += f" Logcat excerpt attached: {', '.join(logs)} (token-checked; URL queries cut) — text in the Log section below."
    entries.append(dict(n=int(b["entry"]), iss=b["iss"], title=b["title"], type=b["type"], sev=int(b["sev"]), belong=b["belong"],
                        out=int(b["out"]), times=int(b["times"]), short=b["short"], desc=b["desc"], note=b["qa_note"],
                        why=WHY[b["iss"]], imgs=imgs, cases=e["cases"],
                        dup={"code": d[0], "status": d[1], "text": d[2]} if d else None,
                        related=rel, logs=logtext, action="hold" if d else "file"))

results = list(csv.DictReader(open(f"{RUN}/results.csv", encoding="utf-8-sig")))
counts = {}
for r in results:
    counts[r["Result"]] = counts.get(r["Result"], 0) + 1
from blocked import group as bgroup  # noqa: E402
blocked = [[r["ID"], f"{bgroup(r)} · {r['Disposition']} — {r['Actual'][:240]}{'…' if len(r['Actual']) > 240 else ''}"]
           for r in results if r["Result"] == "Blocked"]
bcount = {}
for r in results:
    if r["Result"] == "Blocked":
        bcount[bgroup(r)] = bcount.get(bgroup(r), 0) + 1
data = {
 "entries": entries,
 "blocked": blocked,
 "counts": counts,
 "rechecks": [],
 "fixes": [[f"{pq} ({', '.join(it) or 'see drafts'})", f"PM QUESTION — {t}: {q}"] for pq, it, t, q in G.HELD_Q] + [[k, f"NOT RAISED — {a}: {b}"] for k, a, b in G.OBS_NOT],
 "defaults": {"found": True, "from": f"the AI Mini Drama Android batch {DEF['from']} (filed {DEF['filed_on']})", "creator": DEF["creator"],
              "tr": G.TR, "tr_prev": DEF["tr"], "tag": DEF["tag"], "method": DEF["method"], "version": G.V, "build": G.B},
 "filed": filed,
}
nhold = sum(1 for e in entries if e["action"] == "hold")
FN = {e["iss"]: e["n"] for e in entries}
def F(*iss):
    return ", ".join(f"F-{FN[i]}" for i in iss)
S2F = ", ".join(f"F-{e['n']}" for e in entries if e["sev"] == 2)
DOCF = ", ".join(f"F-{e['n']}" for e in entries if "Doc" in e["belong"]) or "none"
FILED_LINE = "Nothing has been filed, uploaded or commented."
bsum = ", ".join(f"{v} {k}" for k, v in sorted(bcount.items(), key=lambda x: -x[1]))
body = f'''</style>

<div class="wrap">
  <header style="display:grid;gap:10px">
    <div class="eyebrow">pdr-spec-casebook · PowerDirector Mobile for Android · eBug filing review</div>
    <h1>AI Video Enhance Android — round R1 (table v4) on 2611091: {len(entries)} findings from {len(results)} cases</h1>
    <p class="lede">These cards are the eBug entries exactly as they would be filed. For each one, set file or hold, severity, owner and type, and add any context. Then use Copy decisions and paste the result back. {FILED_LINE} R1 ran all 11 segments of table v4 (draft 20261110-160000) on 16.9.0 (2611091), {G.TR}, Stage server, 2026-11-10 17:10 → 22:51: {counts.get("Pass", 0)} Pass, {counts.get("Fail", 0)} Fail, {counts.get("Blocked", 0)} Blocked. Every Fail and observation is mapped in the drafts file. {len(G.HELD_Q)} PM / table questions hold the copy-only rows (「Saved to Gallery」 ×37, 「Video Enhancer」 ×36) and four rows whose rule is a PM proposal; they are listed below, not as cards. Dedupe per OS: no finding repeats an Android ticket (O-12 matches open DRA262608-0072, dedupe.txt only). Failure- and charge-related cards show their logcat excerpt under 「Log」.</p>
    <dl class="facts">
      <div><dt>Version</dt><dd>16.9.0</dd></div>
      <div><dt>Build No</dt><dd>2611091 (TR OneDrive APK, MD5 checked)</dd></div>
      <div><dt>Server</dt><dd>Stage server</dd></div>
      <div><dt>Device</dt><dd>Samsung SM-A5360 · Android 15</dd></div>
      <div><dt>Account</dt><dd class="need" id="f-acct">needed</dd></div>
      <div><dt>TRCode</dt><dd class="need" id="f-tr">{G.TR}? confirm</dd></div>
      <div><dt>Product</dt><dd>PowerDirector Mobile for Android · Generic v16.9</dd></div>
    </dl>
  </header>

  <section class="panel" aria-labelledby="bd">
    <h2 id="bd">Batch decisions</h2>
    <div class="decisions">
      <label for="acct">Filing account (Creator)
        <input type="text" id="acct" class="pending" placeholder="ECL login, e.g. ETHAN_HSU">
        <small>No Video Enhance batch filed yet: {DEF['creator']} from the AI Mini Drama Android batch {DEF['from']} — confirm. Becomes Creator on every ticket.</small>
      </label>
      <label for="tag">Source tag
        <input type="text" id="tag" class="pending" value="AIAgent">
        <small>[AIAgent], as for every casebook batch.</small>
      </label>
      <label for="tr">TRCode
        <input type="text" id="tr" class="pending" value="{G.TR}">
        <small>The TR this run tested (16.9.0.2611091, header read 2026-11-10) — confirm.</small>
      </label>
      <div class="radios" role="radiogroup" aria-labelledby="mlab">
        <span id="mlab" style="font-weight:600">Filing method</span>
        <label><input type="radio" name="method" id="m-api" value="API" checked> API (new way) <small>ecl_if3.py create plus attachment upload, if the Android v16.9 template is on IF3.</small></label>
        <label><input type="radio" name="method" id="m-web" value="Browser form"> Browser form (old way) <small>ECL web form through the browser pane, every field by hand.</small></label>
      </div>
    </div>
  </section>

  <section class="panel" aria-labelledby="tl">
    <h2 id="tl">Where the run landed</h2>
    <div class="tally" id="tally"></div>
    <p class="cal"><b>Proposed severities:</b> no S1. S2 for money and blocked rules ({S2F}: overbilling, a charge for a task that never uploaded, the missing 2K+ block, a Result that never loads); S3 for the rest. Owner RD, Doc for copy ({DOCF}); no [UX] (RD, 2026-10-21). F-{FN["ISS-VEA-09"]} and F-{FN["ISS-VEA-07"]} carry reviewer notes (PM-proposal parts).</p>
    <div class="toolbar">
      <button type="button" id="fileAll">File all</button>
      <button type="button" id="holdAll">Hold all</button>
      <button type="button" id="reset">Reset to proposal</button>
    </div>
  </section>

  <main id="cards" style="display:grid;gap:16px"></main>

  <section class="panel" aria-labelledby="nf">
    <h2 id="nf">Questions for PM, held items and not a bug</h2>
    <p class="cal" style="margin:0">Team rule (2026-10-21): no comments, no reopen, no reject on existing tickets.</p>
    <div class="tbl"><table id="fxtbl"><thead><tr><th>Item</th><th>Outcome</th></tr></thead><tbody></tbody></table></div>
  </section>

  <section class="panel" aria-labelledby="gp">
    <h2 id="gp">Gaps you should know about</h2>
    <p class="cal" style="margin:0">{counts.get("Blocked", 0)} cases are <b>Blocked</b> with no verdict: {bsum}. The Pro test subscription ended at about 22:35, so 5 Timeline rows wait for a paid account; Android 16.9 has no fault switches, so the server-failure rows wait for a real failure.</p>
    <div class="tbl"><table id="blk"><thead><tr><th>Case</th><th>Why it is Blocked</th></tr></thead><tbody></tbody></table></div>
  </section>

  <section class="panel" aria-labelledby="cd">
    <h2 id="cd">Copy decisions</h2>
    <div class="toolbar"><button type="button" class="primary" id="copy">Copy decisions</button><span id="copied" class="cal" role="status"></span></div>
    <textarea id="out" readonly aria-label="Decisions table"></textarea>
  </section>
</div>

<div class="lb" id="lb" hidden role="dialog" aria-modal="true" aria-label="Evidence">
  <img id="lbimg" alt="">
  <div class="cap"><button type="button" id="lbprev">← Prev</button><span id="lbcap"></span><button type="button" id="lbnext">Next →</button><button type="button" id="lbclose">Close</button></div>
</div>

<script>
const DATA = '''
R = [
 ('`<section class="logbox"><h4>Log <span>${esc(l.name)}</span></h4><pre>${esc(l.text)}</pre></section>`',
  '`<details class="logbox"><summary>Log <span>${esc(l.name)}</span></summary><pre>${esc(l.text)}</pre></details>`'),
 ('const KEY = "amd-ebug-review-20261027-p9-v1";', 'const KEY = "ve-ebug-review-20261110-r1-android-v1";'),
 ("`<span class=\"chip\"><b>392</b> P9 cases</span>", f"`<span class=\"chip\"><b>{len(results)}</b> R1 cases</span>"),
 ("add(document.getElementById(\"tr\").closest(\"label\"), `${DEF.tr} for build 189872 — confirm. ${DEF.from} used ${DEF.tr_prev} (build ${DEF.build}), so \"Same TR\" does not apply to this build.`);",
  "add(document.getElementById(\"tr\").closest(\"label\"), `${DEF.tr} — the TR this run tested (build 2611091), confirm.`);"),
 ('const rtb = document.querySelector("#rctbl tbody");\nDATA.rechecks.forEach(([c, k, s, w]) => rtb.insertAdjacentHTML("beforeend", `<tr><td class="mono">${esc(c)}</td><td class="mono">${esc(k)}</td><td>${esc(s)}</td><td>${esc(w)}</td></tr>`));\n', ''),
# Copy decisions: copy synchronously first (execCommand works where the async Clipboard API is refused, e.g. a file
 # opened in an app's preview pane), the Clipboard API second, and say why when both are refused (user, 2026-11-11).
 ('  navigator.clipboard.writeText(t.value).then(() => { msg.textContent = "Copied. Paste it back in the chat."; })\n    .catch(() => { t.focus(); t.select(); msg.textContent = "Copy was blocked. The text is selected; press Cmd+C."; });',
  '  const ok = () => { msg.textContent = "Copied. Paste it back in the chat."; };\n  t.focus(); t.select(); let done = false; try { done = document.execCommand("copy"); } catch (e) {}\n  if (done) { ok(); return; }\n  (navigator.clipboard ? navigator.clipboard.writeText(t.value) : Promise.reject()).then(ok, () => { msg.textContent = "This window does not allow copying (an app preview pane can block it; open the file in Safari or Chrome). The text is selected: press Cmd+C."; });'),
 ("fT.textContent = `${DEF.tr} — this build (189872), confirm`;", "fT.textContent = `${DEF.tr} — this build (2611091), confirm`;"),
]
for a, b in R:
    if a not in tail:
        sys.exit(f"shell text not found: {a[:90]}")
    tail = tail.replace(a, b, 1)
html = style + body + json.dumps(data, ensure_ascii=False).replace("</", "<\\/") + tail
if not html.lstrip().lower().startswith("<meta charset"):
    html = '<meta charset="utf-8">\n' + html
if 'name="viewport"' not in html:
    html = html.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">', 1)
left = re.findall(r"189872|P9 case|iPhone 17", html[:html.index("const DATA")] + html[html.index("const KEY"):])
if left:
    print(f"note: iOS text left in the page: {left}")
open(PAGE, "w", encoding="utf-8").write(html)
print(f"wrote {PAGE} ({len(html) // 1024} KB, {len(entries)} cards, {nhold} on hold)")
