#!/usr/bin/env python3
"""Build the Cutout Reset / Undo / Redo Android eBug draft batch for run 2026-11-10-r1 (draft 20261110-163734) on
PhotoDirector 20.19.0 (90201900).

Writes library/phd/cutout/android/ebugs/2026-11-10-r1/20261110_eBug_drafts_Cutout-Undo-R1_20.19.0.md, the sibling
_images/ folder (one NN_ISS-ID folder per entry: red-boxed JPEGs named 20.19.0_<slug>.jpg plus the logcat excerpt for
the entries with a log cause) and logs/. Nothing is filed. Every Fail row of results.csv and every observation O-n is
mapped (entry / not raised); the script stops when one is missing.

    python library/phd/cutout/android/ebugs/2026-11-10-r1/generators/build.py
"""
import csv, os, re, shutil, sys

from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.dirname(HERE)
ROOT = os.path.dirname(os.path.dirname(OUT))                      # library/phd/cutout/android
REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(ROOT))))
RUN = f"{ROOT}/runs/2026-11-10-r1"
SHOTS = f"{RUN}/screenshots"
NAME = "20261110_eBug_drafts_Cutout-Undo-R1_20.19.0"
V, B = "20.19.0", "90201900"
PRE = f"PHD-A {V} - [AIAgent]"
DEVICE = "Device: Samsung Galaxy S23 (SM-S9110) / Android 16"
PDF = "Cutout Reset Undo Redo Spec 11E.pdf"
BOARDS = {
    "pm-11e-buttons": "【Requirement】Cutout add reset / undo / redo button",
    "pm-11e-logic": "1. undo / redo 邏輯 (operation table)",
    "pm-11e-rules": "【Requirement】【按鈕行為】【其他情境】",
}


def pm(board):
    return f"Spec Link: Cutout PM spec ({PDF}), {BOARDS[board]} board ({board})"


def steps(*s):
    return "\n".join(f"{i}. {x}" for i, x in enumerate(s, 1))


START = ("Launch the APP", "Tap Edit on the Launcher", "Tap Sample Photos", "Tap the first photo (three women)",
         "Tap Cutout in the Edit tab")

E = [
 dict(iss="ISS-CUT-01", cases=["TC-044", "TC-045"], cls="Functional", sev=2, owner="RD", rep="2/2",
      title="Undo during a template download undoes the previous step, and the template is still applied when the download ends",
      short=f"{PRE} Cutout: Undo during a template download undoes the previous step; the template still applies",
      steps=steps(*START, "Tap the white colour in Solid", "Tap Trending", "Tap a template with the download arrow",
                  "Tap Undo while the template is downloading", "Wait 5 seconds", "Tap Undo", "Check the result"),
      result="Undo reverted the earlier white background; the template was still applied when its download ended.",
      result_zh="下載中按 Undo 會撤銷前一步（白色背景），下載完成後模板仍被套用，白色那一步因此遺失。",
      expect="Undo cancels only the template apply: the white background stays and the template is never applied.",
      expect_zh="Undo 只取消這次尚未完成的模板套用，白色背景保留，下載完成後也不套用模板。",
      notes=[],
      links=[pm("pm-11e-rules")],
      images=[("t44-undo-during.png", "undo_reverts_white", (480, 2075, 800, 2210)),
              ("TC-044.png", "template_applied_after_download", (0, 340, 1080, 1430))],
      log="log044",
      qa="Reproduced with two not-yet-downloaded Trending templates (fireworks, white wood); 「Wall」 is not a chip on 20.19.0, so 「Trending」 stood in. No slow network was available: template and Undo were tapped back to back (adb input) while the thumbnail was still downloading (~2 s on Wi-Fi). R-070 (PM pm-11e-rules 【其他情境】, Q-2 answered by the user, REQ-005: 「Undo 只取消這次還沒完成的套用」). Spec basis checked: written for this room and state; no newer frame. logcat: no cancel; NativeDump 「SetSkyTemplate() … doApplySkyReplacement() end」 applies the template when the download ends (17:52:23 for the wood one). Severity S2 proposed because a finished step is silently lost; RD may judge S3."),
 dict(iss="ISS-CUT-02", cases=["TC-049"], cls="Functional", sev=2, owner="RD", rep="2/2",
      title="System Back with the colour palette open closes the whole Cutout room and drops its edits",
      short=f"{PRE} Cutout: System Back with the colour palette open closes the whole Cutout room, not the palette",
      steps=steps(*START, "Tap the colour wheel item", "Drag on the colour square to red", "Press the system Back key",
                  "Check the result"),
      result="The whole Cutout room closed with no prompt; the colour pick and the room's edits are gone.",
      result_zh="調色盤開啟時按系統返回鍵，整個 Cutout room 直接關閉，顏色與編輯都遺失。",
      expect="Back closes only the palette; the room stays and the colour pick counts as one step.",
      expect_zh="返回鍵等同調色盤自己的關閉：只關閉調色盤，留在 room，選色算一步。",
      notes=[],
      links=[pm("pm-11e-logic"), pm("pm-11e-rules")],
      images=[("t49-dragged.png", "palette_open_red", None),
              ("t49-back.png", "room_closed_after_back", (0, 1830, 1080, 2060))],
      log="log049",
      qa="Team rule REQ-051 (Android system Back does what the screen's own close does), confirmed for this room by the user (Q-7 answered, REQ-005) and applied to R-023 (pm-11e-logic: a palette pick is one step when the palette is confirmed or closed). R-080. logcat at the Back press: 「BottomToolBar: onCurrentPanelChange, panel: PANEL_NONE」, 「EditViewActivity: doFragmentPopBackStack」 (the Cutout fragment is popped, the palette is not consulted). The palette sheet itself has 「Cancel」 / 「Done」 and swiping its handle down keeps the pick (O-2)."),
 dict(iss="ISS-CUT-03", cases=["TC-035", "TC-038"], cls="Functional", sev=3, owner="RD", rep="2/2",
      title="Coming back from the edit cutout page adds its own Undo step to the Cutout room",
      short=f"{PRE} Cutout: Returning from the edit cutout page adds its own Undo step to the Cutout room",
      steps=steps(*START, "Tap the white colour in Solid", "Tap the edit (pencil) button on the canvas",
                  "Brush an area above the heads", "Tap ✓", "Tap Undo", "Check the result"),
      result="The first Undo only removes the brushed area; a second Undo is needed to revert the white background.",
      result_zh="從 edit cutout page 回來多了一步：第一次 Undo 只還原筆刷，第二次才還原白色背景。",
      expect="The edit cutout page round trip is no step: one Undo reverts the white background.",
      expect_zh="進出 edit cutout page 不算一步；一次 Undo 即還原白色背景，沒有更早步驟時 Undo 維持不能按。",
      notes=[],
      links=[pm("pm-11e-logic")],
      images=[("t38-room.png", "undo_after_round_trip", (480, 2075, 600, 2210)),
              ("t38-undo1.png", "first_undo_keeps_white", (0, 98, 1080, 1540))],
      log=None,
      qa="R-029 (pm-11e-logic operation table #10: 「由 edit cutout page 自己的 undo 管理」, not a room step); Q-1 answered (REQ-005). TC-035 (fresh room): after pencil › brush › ✓, Undo is enabled and one Undo removes the brushed area. TC-038 (after 「White」): two Undos needed. Reset after the round trip does return the entry shape (TC-036 passes), and the edit page's own Undo works (TC-039). Spec basis checked; no newer frame. Not tested: what the PM expects the room's Undo to do to the shape when the edit page was the only change (the table only says it is not a step). No log cause (GPUImageViewer exporter noise only)."),
 dict(iss="ISS-CUT-04", cases=["TC-051"], cls="Functional", sev=3, owner="RD", rep="2/2",
      title="Closing the colour palette without changing the colour adds an empty Undo step",
      short=f"{PRE} Cutout: Closing the colour palette without picking a colour adds an empty Undo step",
      steps=steps(*START, "Tap the white colour in Solid", "Tap the colour wheel item", "Swipe the palette's handle down",
                  "Tap Undo", "Check the result"),
      result="The background stays white and Undo stays enabled; only a second Undo returns the entry background.",
      result_zh="未改色就關閉調色盤仍被記為一步，第一次 Undo 畫面沒變化。",
      expect="Closing the palette unchanged is no step: one Undo returns the transparent entry background.",
      expect_zh="未改色關閉調色盤不算一步，一次 Undo 即回到初始透明背景。",
      notes=[],
      links=[pm("pm-11e-logic")],
      images=[("t51-closed.png", "palette_closed_white", None),
              ("TC-051-undo.png", "first_undo_no_change", (480, 2075, 800, 2210))],
      log=None,
      qa="R-023 (pm-11e-logic: the pick is recorded when the palette is confirmed or closed); Q-9 answered by the user: 「沒改就不算」 (REQ-005). The palette's 「Cancel」 discards and adds no step (TC-018); only the swipe-down close was tested here. Reproduced twice in R1-a."),
 dict(iss="ISS-CUT-05", cases=["TC-011"], cls="Functional", sev=3, owner="RD", rep="1/1",
      title="Reset stays enabled after the background is set back to the entry state",
      short=f"{PRE} Cutout: Reset stays enabled when the room's state is back to the entry state",
      steps=steps(*START, "Tap the white colour in Solid", "Tap the transparent item", "Check the Reset button"),
      result="The canvas is back to the transparent entry state, but Reset is still enabled.",
      result_zh="畫面已回到初始透明狀態，Reset 仍可按。",
      expect="Reset is disabled when the current state equals the initial state (Undo stays enabled).",
      expect_zh="目前狀態與初始狀態相同時 Reset 應不能按（Undo 仍可按）。",
      notes=[],
      links=[pm("pm-11e-rules")],
      images=[("TC-011.png", "reset_enabled_at_entry_state", (200, 2075, 450, 2210))],
      log=None,
      qa="R-015 (pm-11e-rules 【按鈕行為】: Reset enabled when the current state differs from the initial one, disabled when it is the same, 「whatever the history holds」). resetBtn read from the page source (not disabled). One Undo then shows white as expected. Spec basis checked."),
 dict(iss="ISS-CUT-06", cases=["TC-024"], cls="Functional", sev=3, owner="RD", rep="1/1",
      title="The Cutout room has no Flip button for the cutout object",
      short=f"{PRE} Cutout: The Cutout room has no Flip button for the cutout object",
      steps=steps(*START, "Tap the cutout on the canvas", "Check the canvas, the panel and the bottom bar"),
      result="No Flip button anywhere in the room; the cutout shows no handles and can only be rotated.",
      result_zh="Cutout room 沒有翻轉 (Flip) 按鈕。",
      expect="The room offers a Flip button; a flip is one step and Undo returns the previous direction.",
      expect_zh="Room 應提供 Flip 按鈕，翻轉為一步，Undo 可還原方向。",
      notes=[],
      links=[pm("pm-11e-logic")],
      images=[("TC-024-selected.png", "no_flip_button", (0, 1540, 1080, 2210))],
      log=None,
      qa="R-027 (pm-11e-logic operation table: 「翻轉物件」 is a step). The user ruled the room must offer Flip and asked for an eBug when a run finds none (Q-8, REQ-009, superseding REQ-007). The page source has no element whose id or label mentions flip or mirror."),
 dict(iss="ISS-CUT-07", cases=["TC-016"], cls="Functional", sev=3, owner="RD", rep="1/1",
      title="An imported background photo that was undone is not kept in Recent (the picker has no Recent)",
      short=f"{PRE} Cutout: An undone imported background photo is not kept in Recent; the picker has no Recent",
      steps=steps(*START, "Tap the import photo item", "Tap a photo", "Tap Undo", "Tap the import photo item",
                  "Tap Sample Photos at the top", "Check the album list"),
      result="The picker's album list has no 「最近使用」 (Recent), so the undone photo is not kept there.",
      result_zh="匯入照片被 Undo 後，挑選器沒有「最近使用」，照片未保留在其中。",
      expect="After Undo the photo leaves the canvas but stays in 「最近使用」 (Recent).",
      expect_zh="Undo 後照片從畫布移除，但保留在「最近使用」。",
      notes=[],
      links=[pm("pm-11e-rules")],
      images=[("TC-016-albums.png", "album_list_no_recent", (20, 340, 1060, 2200)),
              ("TC-016-picker.png", "picker_tabs", (0, 220, 1080, 350))],
      log=None,
      qa="R-071 (pm-11e-rules 【其他情境】). The user said the app has no Recent for now and asked for a bug after the run (Q-4, REQ-008). The undo itself works (photo leaves the canvas and its thumbnail leaves the item row, O-5)."),
]

OBS_NOT = [
 ("O-1", "✕ and system Back return straight to the Edit room, not a Cutout page (20.19.0 has none): question on TC-001 / TC-040 / TC-048, not a defect."),
 ("O-2", "The palette has 「Cancel」 / 「Done」 and hides the bottom bar; swipe-down keeps the pick (context for ISS-CUT-02 / -04)."),
 ("O-3", "Stroke colours and slider appear only after a style is chosen; slider 0–20, default 10 (TC-021 question)."),
 ("O-4", "「Solid」 chip highlight follows the pick, not shown on entry; informational."),
 ("O-5", "Import adds a thumbnail item and a 「50」 slider; Undo removes the thumbnail (context for ISS-CUT-07)."),
 ("O-6", "No selection frame on the cutout; two-finger rotate works (context for ISS-CUT-06)."),
 ("O-7", "Re-entering after ✓ re-cuts the flattened image (stroke outside the people is dropped from the new cutout); TC-043 question, informational."),
]

LOG_SRC = None
SECRET = re.compile(r"bearer|authorization|token|x-amz|signature=|purchase", re.I)


def _logsrc():
    d = sorted(x for x in os.listdir(f"{RUN}/logs") if x.startswith("R1-c-"))[-1]
    return f"{RUN}/logs/{d}/logcat-live.txt"


def excerpt(path, time_re, keep_re, head):
    src = _logsrc()
    seen, lines = set(), []
    for l in open(src, encoding="utf-8", errors="replace"):
        l = l.rstrip("\n")
        if not time_re.match(l) or not keep_re.search(l):
            continue
        body = l
        if body in seen:
            continue
        seen.add(body)
        if SECRET.search(l):
            sys.exit(f"secret-looking line in the log excerpt: {l[:80]}")
        lines.append(l)
    if not lines:
        sys.exit(f"empty log excerpt for {path}")
    open(path, "w", encoding="utf-8").write(head + "\n".join(lines) + "\n")


def log044(path):
    excerpt(path, re.compile(r"^2026-11-10 17:5(1:(2\d|[3-5]\d)|2:([0-4]\d|5[0-5]))\.\d+ "),
            re.compile(r"onCurrentPanelChange|CutoutPanel|SetSkyTemplate|SetSkyROI|doApplySkyReplacement\(\) (start|end)"),
            "PhotoDirector Android 20.19.0 (90201900), Samsung Galaxy S23 / Android 16 — logcat excerpt, Cutout room, Undo tapped\n"
            "while a Trending template was downloading (twice: the fireworks template, then the white-wood template at ~17:52:20).\n"
            "No cancel is logged; each template is still applied (SetSkyTemplate … doApplySkyReplacement() end) when its download\n"
            "ends. Times are the phone's (CST). Repeated identical lines removed.\n\n")


def log049(path):
    excerpt(path, re.compile(r"^2026-11-10 18:0(0:(4[5-9]|5\d)|1:0[0-9])\.\d+ "),
            re.compile(r"onCurrentPanelChange|doFragmentPopBackStack|CutoutPanel|Photo_Feature_Appear|Photo_Tab_Appear:\{\"tab\":\"Edit\"\}"),
            "PhotoDirector Android 20.19.0 (90201900), Samsung Galaxy S23 / Android 16 — logcat excerpt, Cutout room with the colour\n"
            "palette open: system Back pressed at 18:00:57. The panel goes to PANEL_NONE and the Cutout fragment is popped\n"
            "(doFragmentPopBackStack); the Edit tabs appear again. Times are the phone's (CST). Repeated identical lines removed.\n\n")


LOGS = {"log044": log044, "log049": log049}


def boxed(src, dst, box):
    im = Image.open(f"{SHOTS}/{src}").convert("RGB")
    if box:
        d = ImageDraw.Draw(im)
        x0, y0, x1, y1 = box
        x1, y1 = min(x1, im.size[0] - 1), min(y1, im.size[1] - 1)
        for k in range(6):
            d.rectangle([x0 + k, y0 + k, x1 - k, y1 - k], outline=(255, 0, 0))
    im.save(dst, "JPEG", quality=85)


def main():
    results = list(csv.DictReader(open(f"{RUN}/results.csv", encoding="utf-8-sig")))
    fails = {r["ID"] for r in results if r["Result"] == "Fail"}
    mapped = {c for e in E for c in e["cases"]}
    if fails - mapped:
        sys.exit(f"unmapped Fail rows: {sorted(fails - mapped)}")
    obs = set(re.findall(r"^- (O-\d+)", open(f"{RUN}/observations.md", encoding="utf-8").read(), re.M))
    if obs - {o for o, _ in OBS_NOT}:
        sys.exit(f"unmapped observations: {sorted(obs - {o for o, _ in OBS_NOT})}")
    counts = {}
    for r in results:
        counts[r["Result"]] = counts.get(r["Result"], 0) + 1

    imgroot = f"{OUT}/{NAME}_images"
    shutil.rmtree(imgroot, ignore_errors=True)
    os.makedirs(f"{OUT}/logs", exist_ok=True)
    md = []
    md.append(f"# Cutout Reset / Undo / Redo (Android) — eBug drafts, run R1, PhotoDirector {V} build {B}\n")
    md.append(f"**Source:** spec-casebook run `library/phd/cutout/android/runs/2026-11-10-r1/` — phase R1 of draft "
              f"`drafts/20261110-163734` (51 rows, not yet saved as the approved table), 2026-11-10 on Samsung Galaxy S23 "
              f"(SM-S9110) / Android 16 through Appium / UiAutomator2, Test Server, Premium. **No TR for this build.** "
              f"Tally: {counts.get('Pass', 0)} Pass, {counts.get('Fail', 0)} Fail, {counts.get('Blocked', 0)} Blocked, "
              f"{counts.get('Not run', 0)} Not run.\n")
    md.append("**Status:** nothing filed, uploaded or commented. No filed batch exists for this feature "
              "(`ebug-defaults.ts phd/cutout android`: none), so Creator, TRCode, source tag and method are left for the "
              "reviewer. Dedupe is read-only, Android pool only (dedupe per OS, user 2026-10-28): see `dedupe.txt`.\n")
    md.append("Rules: reviewer rules 2026-10-21 — one action per Repro step, a Spec Link on every entry, at least one image per "
              "entry, the logcat excerpt on the entries with a log cause, no video. No `[UX]`: `[AIAgent]`, owner RD. Spec "
              "basis check (REQ-055) done per entry; user rulings (Q-n, REQ-n) and team rules are named as such. The spec was "
              f"read PDF-only (no Figma node links), so Spec Links name `{PDF}` and the board.\n")
    md.append(f"**What is drafted:** {len(E)} entries (ISS-CUT-01…{len(E):02d}) from the {len(fails)} Fail rows (all "
              f"`defect`); TC-035 / TC-038 and TC-044 / TC-045 are merged. No PM question is held. See Reconciliation.\n")
    md.append("Legend — Class: Functional / UI · Severity: S1 critical and blocking only, S2 important, S3 moderate · "
              "Owner: RD / Doc.\n\n---\n")
    for n, e in enumerate(E, 1):
        folder = f"{imgroot}/{n:02d}_{e['iss']}"
        os.makedirs(folder)
        tag = e["iss"].split("-")[-1].lower()
        cites = []
        for src, slug, box in e["images"]:
            fn = f"{V}_cut{tag}_{slug}.jpg"
            boxed(src, f"{folder}/{fn}", box)
            cites.append(fn)
        if e["log"]:
            fn = f"{V}_cut{tag}_log.txt"
            LOGS[e["log"]](f"{folder}/{fn}")
            shutil.copy(f"{folder}/{fn}", f"{OUT}/logs/{fn}")
            cites.append(fn)
        note = [DEVICE] + e["notes"] + e["links"] + ["<Claude Reviewed>"]
        desc = (f"Repro Steps:\n{e['steps']}\n\nResult:\n{e['result']}\n摘要：{e['result_zh']}\n"
                + " ".join("{" + c + "}" for c in cites)
                + f"\n\nExpect Result:\n{e['expect']}\n摘要：{e['expect_zh']}\n\nNote:\n" + "\n".join(note))
        if len(e["short"]) > 120:
            print(f"warning: {e['iss']} short description {len(e['short'])} chars", file=sys.stderr)
        md.append(f"## {n}. {e['iss']} — {e['title']}  ·  Class: {e['cls']}  ·  Severity: S{e['sev']}  ·  Owner: {e['owner']}\n")
        md.append(f"**Report step:** {', '.join(e['cases'])}  ·  **Reproduce:** {e['rep']}  ·  **Verified on:** {V}.{B}\n")
        md.append(f"> **QA note — not pasted into eBug.** {e['qa']}\n")
        md.append(f"**Short Description:**\n\n```\n{e['short']}\n```\n")
        md.append(f"**Description:**\n\n```\n{desc}\n```\n")
        md.append(f"**Images:** `{NAME}_images/{n:02d}_{e['iss']}/`\n\n---\n")
    md.append("## Not raised (observations, for the record)\n")
    for o, t in OBS_NOT:
        md.append(f"- {o}: {t}")
    md.append("\n## Pass with a question (no eBug)\n")
    for r in results:
        if r["Result"] == "Pass" and r["Disposition"] == "question":
            md.append(f"- {r['ID']}: {r['Actual'][:220]}{'…' if len(r['Actual']) > 220 else ''}")
    md.append("\n## Reconciliation against the run\n")
    md.append("| Case | Result | Where |\n|---|---|---|")
    where = {c: f"F-{n} {e['iss']}" for n, e in enumerate(E, 1) for c in e["cases"]}
    for r in results:
        if r["Result"] == "Fail":
            md.append(f"| {r['ID']} | {r['Result']} {r['Disposition']} | {where[r['ID']]} |")
    md.append("")
    open(f"{OUT}/{NAME}.md", "w", encoding="utf-8").write("\n".join(md))
    print(f"wrote {NAME}.md with {len(E)} entries")


if __name__ == "__main__":
    main()
