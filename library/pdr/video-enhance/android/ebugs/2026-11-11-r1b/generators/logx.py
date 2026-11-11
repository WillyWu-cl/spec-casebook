"""Logcat excerpt helper for the Video Enhance Android R1 batches (16.9.0, 2611091); copied from 2026-11-10-r1 for batch r1b
(2026-11-11): purchase tokens are cut too.

The run captured logcat per segment (`device-android.ts logcat start` / `pull-logs`) into
runs/2026-11-10-r1-full/logs/<segment>-<time>/logcat-live.txt. Excerpts keep the Video Enhance task lines (create session =
the charge, transcode, S3 upload, applyEffect status, network exceptions, FCM completion push, toasts, the Result player
init, DownloadUriTask errors) and the balance when it changes. Repeated identical status polls are folded into one line
with a count. Tokens and signed URL queries are dropped or cut.
"""
import glob, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, *[".."] * 7))
RUN = f"{REPO}/library/pdr/video-enhance/android/runs/2026-11-10-r1-full"

KEEP = re.compile(
    r"Create session: (start|end)|create session response|Transcode: (start|finish)|Upload to S3|upload response"
    r"|applyEffect status|AIVideoAnimeServerAPI|UnknownHostException: Unable|getCreditRemain, Exception"
    r"|FcmInstanceIDService: key = Msg|Toast +: show|ExoPlayerImpl: Init|DownloadUriTask: java\.lang"
    r"|getMemberCreditRemain", re.I)
DROP = re.compile(r"memberToken|access_?token|authorization|bearer|x-goog-signature|signature=|refreshMemberToken", re.I)
REMAIN = re.compile(r"totalRemain=(\d+)")


def logfiles():
    return sorted(glob.glob(f"{RUN}/logs/R1-*/logcat-live.txt"))


def lines(day, t0, t1, extra=None):
    got, seen, last_remain = [], set(), None
    for f in logfiles():
        for line in open(f, encoding="utf-8", errors="replace"):
            p = line.split(" ", 2)
            if len(p) < 3 or p[0] != day or not (t0 <= p[1][:8] <= t1):
                continue
            if not (KEEP.search(line) or (extra and re.search(extra, line))) or DROP.search(line):
                continue
            line = line.rstrip()
            if "getMemberCreditRemain" in line:
                m = REMAIN.search(line)
                if not m or m.group(1) == last_remain:
                    continue
                last_remain = m.group(1)
                line = f"{p[0]} {p[1]} CreditSystemManager: totalRemain={last_remain}"
            line = re.sub(r"(https?://[^\s'\"?]+)\?[^\s'\")]*", r"\1?…", line)
            line = re.sub(r'("purchaseToken":")[^"]+', r"\1…", line)
            line = re.sub(r"^(\S+ \S+) +\d+ +\d+ [VDIWE] ", r"\1 ", line)
            if line in seen:
                continue
            seen.add(line)
            got.append(line[:400] + ("…" if len(line) > 400 else ""))
    got.sort()
    # fold runs of identical messages (status polls every 10 s) into first … last (×N)
    out, i = [], 0
    while i < len(got):
        body = got[i].split(" ", 2)[2]
        j = i
        while j + 1 < len(got) and got[j + 1].split(" ", 2)[2] == body:
            j += 1
        if j > i:
            out.append(f"{got[i]}   (×{j - i + 1} until {got[j].split(' ')[1]})")
        else:
            out.append(got[i])
        i = j + 1
    return out


def segment_of(day, t):
    best = None
    for f in logfiles():
        d = os.path.basename(os.path.dirname(f))
        with open(f, encoding="utf-8", errors="replace") as fh:
            first = next((l for l in fh if re.match(r"\d{4}-\d\d-\d\d ", l)), "")
        if first and (first[:10], first[11:19]) <= (day, t):
            best = d
    return best


def excerpt(path, title, header, secs):
    """secs: (label, day, t0, t1[, extra regex])."""
    L = [f"# {title}", header,
         "# Video Enhance task lines (session = charge, transcode, upload, status, errors, push, toasts) and the balance",
         "# when it changes, in the windows below; identical status polls folded; tokens dropped, URL queries cut at '?'.", ""]
    for sec in secs:
        label, day, t0, t1 = sec[:4]
        extra = sec[4] if len(sec) > 4 else None
        got = lines(day, t0, t1, extra)
        if not got:
            sys.exit(f"empty log window {label} {day} {t0}-{t1}")
        L.append(f"## {label} ({day} {t0}–{t1}; logs/{segment_of(day, t0)}/logcat-live.txt)")
        L.extend(got)
        L.append("")
    txt = "\n".join(L)
    if re.search(r"eyJ[A-Za-z0-9_-]{10,}|Bearer |ya29\.|X-Goog-Signature|memberToken", txt):
        sys.exit(f"token-like text left in {path}")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path, "w", encoding="utf-8").write(txt)
    return path
