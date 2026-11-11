#!/usr/bin/env python3
"""Build the Video Enhance Android R1 batch 2 (r1b) eBug review page from upload/bodies.json (copied from batch 2026-11-10-r1,
with its Copy decisions fix; adapted from the AI Mini Drama A7 page).

Reuses the iOS P9 review page's stylesheet (ios/ebugs/2026-10-27-p9) and its card / decisions script, with Android text, a
PM-questions table and the Blocked groups. Run after ebugs.py, drafts_to_bodies.py, check_ebug_format.py and the dedupe.
Thumbnails are made with `sips` (no Pillow on this machine). Nothing is filed; the page is a self-contained file here.
"""
import base64, csv, json, os, re, subprocess, sys, tempfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import ebugs as G

REPO, OUT, RUN = G.REPO, G.OUT, G.RUN
SHELL = f"{REPO}/library/pdr/ai-mini-drama/ios/ebugs/2026-10-27-p9/20261022_eBug_review_AI-Mini-Drama-P9_16.9.0.html"
PAGE = f"{OUT}/20261111_eBug_review_Video-Enhance-R1b_16.9.0.html"

WHY = {
 "ISS-VEA-16": "Defect: the Demo page of Video Enhance describes AI Reframe. Owner PM because the Design frame carries the same wrong text (the spec's text must change); carries Q-1.",
 "ISS-VEA-18": "Defect: either trim handle can be dragged onto the other, leaving a 「00:00」 selection under the 1 s minimum (PM B1 proposal), priced as 1 s.",
 "ISS-VEA-19": "Defect: a successful Pro purchase skips the Design's 「You're all set」 confirmation and its 「OK」; the log shows one acknowledge call answered 「Server error」.",
 "ISS-VEA-20": "PM decision: the Demo page tick is saved when the page is left with ‹; PM A1 proposes only Try It Now saves it.",
 "ISS-VEA-21": "PM decision (Q-13): which sources Add Media greys out; under-1 s videos and MKV open the panel today.",
 "ISS-VEA-22": "PM decision (Q-24): whether the strip re-lays to 2:30 per width in Professional; the app keeps 8:00 per width.",
 "ISS-VEA-23": "PM decision: a drag on the selection moves the range against the finger; no spec sets the direction.",
 "ISS-VEA-24": "PM decision: the full-screen preview has no close control and always starts at 00:00; no Design frame for it.",
 "ISS-VEA-25": "PM decision: the 8-minute limit bubble sits over the Preview time and play button.",
 "ISS-VEA-26": "PM decision (Q-25): no Android Design for the unlock; the app shows the 「Pro」 badge and a single Pro page (KP-006). Hold it if KP-006 is answer enough.",
 "ISS-VEA-27": "PM decision (Q-2): 「Leave」 during the upload is charged as the Design dialog says, PM §8 says no charge, and the credits came back 3 h later anyway.",
 "ISS-VEA-28": "PM decision (Q-16): the system notification reuses the banner copy instead of PM §9's 「Your video is ready. Tap to view.」 (flip to RD if §9 stands).",
 "ISS-VEA-29": "PM decision: the Save Result toast 「Saved to Gallery」 vs PM D3's 「Saved to your device」; the one string that fails 37 rows.",
 "ISS-VEA-30": "PM decision (Q-8): what 「Manage」 opens; the app's 「Select」 offers only Delete. The label itself is DRA262611P0082.",
 "ISS-VEA-31": "PM decision: every finished task is written to Movies by itself, so Save Result leaves two identical files.",
 "ISS-VEA-32": "PM decision (Q-10): a Timeline clip over 8:00 opens the panel capped at 08:00 instead of being refused with a split toast.",
 "ISS-VEA-33": "PM decision (Q-11), judged a question: a Timeline task's result is not pasted back and Add to Timeline opens a new project; the Design's 「不取代原 clip」 note makes that possibly right.",
}
RELATED = {
 "ISS-VEA-16": "Held in batch 1 as PQ-4; filed under the 2026-11-11 rule. Dedupe: DRA252503-0298 / DRA242410-0142 share only 「demo page」.",
 "ISS-VEA-18": "Held in batch 1 as PQ-7 (TC-046, TC-217, O-27). No Android ticket.",
 "ISS-VEA-19": "New 2026-11-11 (TC-095 rerun, purchase approved by the user). Reproduce 1/1: one purchase only.",
 "ISS-VEA-20": "Related, not an answer: DRA252503-0298 (Close, 15.1.0): Recent task ‹ after ticking went back to the Demo page; fix finishes the Demo activity when ticked.",
 "ISS-VEA-21": "Only TC-022 steps 4–5 and TC-269 step 1; the rest of those rows is DRA262611P0072 / P0076.",
 "ISS-VEA-26": "KP-006 (team fact, verified on 2611091): Android sells Pro, not Pro+. If you take it as the answer, hold this card; TC-004 and TC-093 then become table fixes.",
 "ISS-VEA-27": "Related: DRA262611P0079 (batch 1, Home during upload, Q-18) and P0083 (the cancelled card); iOS DRI261897P0026 is another symptom.",
 "ISS-VEA-29": "Every combination row (TC-219 – TC-254) fails only on this toast and the ledger name 「Video Enhancer」, which is cited (iOS DRI261895P0021).",
 "ISS-VEA-33": "The 31-credit charge for the 30 s clip is DRA262611P0076. The new project reusing the name 「Project 11-11」 is not raised (editor naming).",
}
DEF = json.loads(subprocess.run(["node", f"{REPO}/scripts/ebug-defaults.ts", "pdr/video-enhance", "android", "--json"], capture_output=True, text=True, check=True).stdout)  # batch 1 (2026-11-10-r1) is the newest filed batch



def thumb(path):
    with tempfile.TemporaryDirectory() as d:
        out = os.path.join(d, "t.jpg")
        subprocess.run(["sips", "-Z", "900", "-s", "format", "jpeg", "-s", "formatOptions", "60", path, "--out", out],
                       check=True, capture_output=True)
        return "data:image/jpeg;base64," + base64.b64encode(open(out, "rb").read()).decode()


s = open(SHELL, encoding="utf-8").read()
style = s[:s.index("</style>")]
style = style.replace("<title>AI Mini Drama P9 eBugs</title>", "<title>Video Enhance R1b eBugs</title>")
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

# after filing, the page shows every card (bodies-all.json, no decisions applied) and marks the held ones
_all = f"{OUT}/upload/bodies-all.json"
bodies = json.load(open(_all if os.path.exists(_all) and os.path.exists(f"{OUT}/filed_bugcodes.json") else f"{OUT}/upload/bodies.json", encoding="utf-8"))
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
    rel = RELATED.get(b["iss"], "Read-only ECL dedupe (Android pool): no likely duplicate (dedupe.txt).")
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
 "fixes": [[f"{t} ({(it[0] + ' – ' + it[-1] + ', ' + str(len(it)) + ' rows') if len(it) > 5 else ', '.join(it)})", f"CITED, NOT FILED — {code}: {why}"] for t, it, code, why in G.CITED]
          + [["ISS-VEA-17 (TC-201, TC-021)", "WITHDRAWN BY QA — " + next(e["verdict"] for e in G.E if e["iss"] == "ISS-VEA-17")]]
          + [["Batch 1 (filed 2026-11-11)", f"ALREADY FILED — {DEF['first']} – {DEF['last']} (ISS-VEA-01 … 15); none is repeated here, and no comment is added to them."]]
          + [[k, f"NOT RAISED — {a}: {b}"] for k, a, b in G.OBS_NOT],
 "defaults": {"found": True, "from": f"the Video Enhance Android batch {DEF['from']} (filed {DEF['filed_on']}, {DEF['first']} – {DEF['last']})", "creator": DEF["creator"],
              "tr": G.TR, "tr_prev": DEF["tr"], "tag": DEF["tag"], "method": DEF["method"], "version": G.V, "build": G.B},
 "filed": filed,
}
nhold = sum(1 for e in entries if e["action"] == "hold")
FN = {e["iss"]: e["n"] for e in entries}
def F(*iss):
    return ", ".join(f"F-{FN[i]}" for i in iss)
KIND = {e["iss"]: e["kind"] for e in G.E}
DEFF = ", ".join(f"F-{e['n']}" for e in entries if KIND[e["iss"]] == "defect")
PMF = ", ".join(f"F-{e['n']}" for e in entries if KIND[e["iss"]] == "pm")
ND, NPM = DEFF.count("F-"), PMF.count("F-")
FILED_LINE = ("Nothing has been filed, uploaded or commented." if not filed else
  f"Filed 2026-11-11 from your decisions (decisions.md): {len(filed['bugs'])} bugs, " + ", ".join(sorted(v['code'] for v in filed['bugs'].values())[:1]) + " – " + sorted(v['code'] for v in filed['bugs'].values())[-1] + ", each with its images and logs; F-3 and F-10 held with your rulings (Android has no 「You're all set」 dialog; Android sells only Free and Pro). Type UX cards are filed [AIAgent][UX], BugBelong PM.")
bsum = ", ".join(f"{v} {k}" for k, v in sorted(bcount.items(), key=lambda x: -x[1]))
body = f'''</style>

<div class="wrap">
  <header style="display:grid;gap:10px">
    <div class="eyebrow">pdr-spec-casebook · PowerDirector Mobile for Android · eBug filing review</div>
    <h1>AI Video Enhance Android — round R1, batch 2 on 2611091: {len(entries)} cards ({ND} defects, {NPM} PM decisions)</h1>
    <p class="lede">These cards are the eBug entries exactly as they would be filed. For each one, set file or hold, severity, owner and type, and add any context. Then use Copy decisions and paste the result back. {FILED_LINE} Batch 1 is filed ({DEF['first']} – {DEF['last']}) and nothing here repeats it. This batch follows the rules of 2026-11-11: visible defects that batch 1 held are filed, and every open question the run hit is filed to PM for a decision (BugBelong PM; UI for text, Functional for behaviour), one card per question; a question a ruling or ticket already answers is cited in the table below instead. Run now (with the 2026-11-11 paid reruns): {counts.get("Pass", 0)} Pass, {counts.get("Fail", 0)} Fail, {counts.get("Blocked", 0)} Blocked; every Fail and observation is mapped in the drafts file. TC-201 was withdrawn while drafting: a closed Android ticket (DRA242410-0142) made Back from Add Media go to the Launcher on purpose. Failure- and charge-related cards show their logcat excerpt under 「Log」.</p>
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
        <small>{DEF['creator']} from the Video Enhance Android batch {DEF['from']} (filed {DEF['filed_on']}) — confirm. Becomes Creator on every ticket.</small>
      </label>
      <label for="tag">Source tag
        <input type="text" id="tag" class="pending" value="AIAgent">
        <small>[AIAgent], as for every casebook batch.</small>
      </label>
      <label for="tr">TRCode
        <input type="text" id="tr" class="pending" value="{G.TR}">
        <small>{DEF['tr']}, the TR batch 1 was filed on, whose header names 16.9.0.2611091, the build every card here was seen on — confirm ("Same TR").</small>
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
    <p class="cal"><b>Proposed severities:</b> every card S2, as you decided for batch 1; no S1. <b>Defects</b> ({DEFF}): owner RD, except the Demo page text (PM: the Design frame's own text must change). <b>PM decisions</b> ({PMF}): BugBelong PM, Type UI for text and Functional for behaviour; each Expect names the decision and its sources. Two cards carry a reviewer note: F-{FN["ISS-VEA-26"]} (hold it if KP-006 answers it) and F-{FN["ISS-VEA-28"]} (flip to RD if PM §9's copy stands). A PM decision on a user-experience problem is [AIAgent][UX] (overlay rule 5, 2026-11-11).</p>
    <p class="cal"><b>Observation O-32 (balance +30 after the TC-014 reset):</b> Credit Details reads 「Loyalty Credit Bonus (for PowerDirector Subscribers) +30 · PowerDirector (Android) · 2026/11/11 09:55」, the sign-in time after <code>pm clear</code>; the credit history in logcat has the same row (give_away, giveaway_loyalty). A subscriber bonus from the server, nothing spent, not a finding. Recorded in the run's observations.md.</p>
    <div class="toolbar">
      <button type="button" id="fileAll">File all</button>
      <button type="button" id="holdAll">Hold all</button>
      <button type="button" id="reset">Reset to proposal</button>
    </div>
  </section>

  <main id="cards" style="display:grid;gap:16px"></main>

  <section class="panel" aria-labelledby="nf">
    <h2 id="nf">Cited instead of filed, withdrawn, already filed and not raised</h2>
    <p class="cal" style="margin:0">Team rule (2026-10-21): no comments, no reopen, no reject on existing tickets.</p>
    <div class="tbl"><table id="fxtbl"><thead><tr><th>Item</th><th>Outcome</th></tr></thead><tbody></tbody></table></div>
  </section>

  <section class="panel" aria-labelledby="gp">
    <h2 id="gp">Gaps you should know about</h2>
    <p class="cal" style="margin:0">{counts.get("Blocked", 0)} cases are <b>Blocked</b> with no verdict: {bsum}. The Timeline rows ran on 2026-11-11 after the approved purchase; Android 16.9 has no fault switches, so the server-failure rows wait for a real failure.</p>
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
 ('const KEY = "amd-ebug-review-20261027-p9-v1";', 'const KEY = "ve-ebug-review-20261111-r1b-android-v1";'),
 ("`<span class=\"chip\"><b>392</b> P9 cases</span>", f"`<span class=\"chip\"><b>{len(results)}</b> R1 cases</span>"),
 ("add(document.getElementById(\"tr\").closest(\"label\"), `${DEF.tr} for build 189872 — confirm. ${DEF.from} used ${DEF.tr_prev} (build ${DEF.build}), so \"Same TR\" does not apply to this build.`);",
  "add(document.getElementById(\"tr\").closest(\"label\"), `${DEF.tr} — batch 1's TR, build 2611091, confirm.`);"),
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
