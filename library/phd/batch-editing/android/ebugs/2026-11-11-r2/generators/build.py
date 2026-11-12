#!/usr/bin/env python3
"""Build the Batch Editing Android eBug draft batch for run 2026-11-11-r2 (phase R2, table v5) on 20.19.0 (90201900).

Writes ../20261111_eBug_drafts_Batch-Edit-R2_20.19.0.md and the sibling _images/ folder (one NN_ISS-ID folder per
entry, red-boxed JPEGs named 20.19.0_<slug>.jpg). Nothing is filed. Every Fail row of results.csv and every
observation O-n is mapped; the script stops when one is missing.

    python3 library/phd/batch-editing/android/ebugs/2026-11-11-r2/generators/build.py
"""
import csv, os, re, shutil, sys

from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.dirname(HERE)
ROOT = os.path.dirname(os.path.dirname(OUT))                      # library/phd/batch-editing/android
REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(ROOT))))
RUN = f"{ROOT}/runs/2026-11-11-r2"
SHOTS = f"{RUN}/screenshots"
NAME = "20261111_eBug_drafts_Batch-Edit-R2_20.19.0"
V, B = "20.19.0", "90201900"
PRE = f"PHD-A {V} - [AIAgent]"
DEVICE = "Device: Samsung Galaxy A53 5G (SM-A5360) / Android 15"
PM_URL = "https://www.figma.com/design/iWlQTjlmfykHfmlNvg9J4p/Batch-Editing?node-id="
DS_URL = "https://www.figma.com/design/qZXJfrM5gb5g4tFoCIS1YU/Batch-Edit?node-id="


def pm(board, what, node):
    return f"Spec Link: Batch Editing PM Figma, {board} board ({what}) -\n{PM_URL}{node}"


def ds(frame, what, node):
    return f"Spec Link: Batch Edit Design Figma, {frame} frame ({what}) -\n{DS_URL}{node}"


def steps(*s):
    return "\n".join(f"{i}. {x}" for i, x in enumerate(s, 1))


START = ("Launch the APP", "Tap Edit on the Launcher", "Tap Batch", "Select 12 photos", "Tap Next")
ALL = (840, 100, 1060, 225)          # 「All」 capsule, top right
TOAST = (200, 1940, 890, 2105)       # 「Applied to 11 photos」 toast

E = [
 dict(iss="ISS-BEA-12", cls="Functional", sev=3, owner="RD", rep="8/8",
      cases=["TC-153", "TC-162", "TC-042", "TC-063", "TC-163", "TC-164", "TC-075", "TC-165"],
      title="「All」 (Apply to all) is never disabled in Crop & Rotate or Adjustment; tapping it after the apply applies again",
      short=f"{PRE} Batch_Editing: 「All」 is never disabled in Crop & Rotate or Adjustment, even after applying",
      steps=steps(*START, "Tap Adjustments", "Check 「All」 at the top right", "Drag the Exposure slider to 0.62",
                  "Tap All", "Check 「All」", "Tap All", "Check the result"),
      result="「All」 is never disabled, even after the apply; tapping it again shows 「Applied to 11 photos」 again.",
      result_zh="All 從未停用；套用後再按一次又顯示 Applied to 11 photos。",
      expect="「All」 is disabled while the current photo has no unapplied change (on entering, after the apply).",
      expect_zh="目前照片沒有未套用的修改時（進入、套用後）All 為停用，點了無反應。",
      notes=["Related: the same in the Crop & Rotate room (3:2, then All, then All again)"],
      links=[pm("pm-ui-3", "Batch Edit Room · Crop & Rotate / Adjustment, 【NEW】 Apply to all normal / disabled states, DR-04", "16-13767")],
      images=[("tc164-1-enter.png", "adjust_enter_all_enabled", ALL),
              ("tc075-3-tap-again.png", "adjust_after_apply_tap_again_toast", TOAST),
              ("tc164-3-p2.png", "adjust_photo2_no_change_all_enabled", ALL),
              ("tc042-tap-again.png", "crop_after_apply_tap_again_toast", TOAST)],
      qa="One ticket for both rooms: the same control (`batchApplyToAllBtn`, 「All」 / content-desc 「Apply to all」) and the one rule R-234 (PM Figma DR-04 【NEW】: 進 room 無修改 → disabled; 有未套用修改 → normal; 套用完成 → disabled; 切換照片依該張; Undo 退回 Apply to all → normal, Redo → disabled). Every state was read from the screenshot (white icon and text, identical pixels in every state) and from `els` (no `disabled` flag ever). Crop & Rotate: TC-153 (entering, after 3:2, after the apply), TC-162 (photo 2 with no change), TC-042 (tap after the apply: toast again, nothing changes), TC-063 (after Redo), TC-163 (size-only change via the pencil, R-236). Adjustment: TC-164 (entering, photo 2), TC-075 (after the apply, tap again: toast at 18:15:09 in logcat), TC-165 (after Redo). Exposure was set by a thumb drag (「0.62」, the row's 「+20」). Side effect: the extra no-change tap makes an empty Undo step (O-1; R1 O-11), which goes away once 「All」 is disabled after the apply. Spec basis checked: the 【NEW】 list sits on the PM UI board beside both rooms' default and applied frames (2026-11-11 Figma read, REQ-011); no newer frame draws 「All」 always enabled. Not in the R1 batch (R1 ran before the rule) nor in PHA262026P0057–P0061."),
 dict(iss="ISS-BEA-13", cls="Functional", sev=3, owner="RD", rep="2/2", cases=["TC-166", "TC-168"],
      title="With Color › Curve or HSL open, the thumbnail strip stays shown and tappable instead of fading out",
      short=f"{PRE} Batch_Editing: Thumbnail strip stays shown and tappable while Adjustment Curve or HSL is open",
      steps=steps(*START, "Tap Adjustments", "Tap Color", "Tap Curve", "Check the thumbnail strip",
                  "Tap photo 2's thumbnail", "Check the result"),
      result="The strip moves above the Curve panel and stays tappable: photo 2 becomes current. HSL is the same.",
      result_zh="開啟 Curve 時縮圖列移到面板上方且完整顯示，點第 2 張即切換照片；HSL 相同。",
      expect="While Curve or HSL is open the strip fades out and cannot be tapped; 「All」 stays shown.",
      expect_zh="展開 Curve / HSL 時縮圖列淡出且不能點，右上 All 照常顯示。",
      notes=[],
      links=[pm("pm-ui-4", "Batch Edit Room · Adjustment · curve_hsl, D1-12", "16-13767"),
             ds("9_Adjust_curve", "strip hidden while Curve is open", "57-6798"),
             ds("9_Adjust_HSL", "strip hidden while HSL is open", "63-7874")],
      images=[("tc166-1-curve.png", "curve_strip_shown", (0, 1005, 1080, 1205)),
              ("tc166-3-tap-p2.png", "curve_tap_photo2_switches", (0, 1005, 1080, 1205)),
              ("tc168-1-hsl.png", "hsl_strip_shown", (0, 1005, 1080, 1205))],
      qa="R-237 (PM Figma D1-12: 「展開 Color › Curve / HSL panel 時，批次縮圖列淡出且不能點（panel 為透明、疊在照片上，避免與曲線控制點／滑桿誤觸）」; Design 9_Adjust_curve and 9_Adjust_HSL draw no strip). In the app the strip (`batchAdjustStrip`) moves from y 1543 to y 1015–1196, above the panel, still after 3.5 s. The rest passes: collapsing with ﹀ or tapping 「Light」 brings the strip back under the photo and photo switching works there (TC-167, TC-168 steps 3–4); 「All」 stays shown. Spec basis checked: D1-12 is the decided rule (Q-17 answered, REQ-011); no newer frame draws the strip above the panel."),
 dict(iss="ISS-BEA-14", cls="UX", sev=3, owner="PM", rep="4/4", cases=["TC-062", "TC-076"],
      title="PM decision: one Undo after an edit + 「All」 reverts the 11 other photos but keeps the current photo's own edit",
      short=f"{PRE}[UX] Batch_Editing: One Undo after an edit and 「All」 keeps the current photo's own edit",
      steps=steps(*START, "Tap Crop & Rotate", "Tap 3:2", "Tap All", "Tap Undo", "Check photo 1 and photo 2"),
      result="One Undo reverts the 11 other photos only; photo 1 keeps 3:2 (「1706 x 1133」) until a 2nd Undo.",
      result_zh="一次 Undo 只還原其他 11 張，目前這張保留 3:2，需再按一次。",
      expect="PM to decide whether one Undo also reverts the current photo's own edit (all 12 together) or not.",
      expect_zh="請 PM 決定一次 Undo 是否連目前這張的修改一起還原（12 張同時）。",
      notes=["Related: the same in the Adjustment room (Exposure, then All, then Undo)"],
      links=[pm("pm-ui-3", "Batch Edit Room · Crop & Rotate / Adjustment · applied, DR-05b", "16-13767")],
      images=[("tc062-2-undo1.png", "crop_undo1_photo1_keeps_3x2", (300, 100, 760, 215)),
              ("tc076-2-undo2.png", "adjust_undo_photo1_keeps_exposure", (20, 1555, 340, 1715))],
      qa="Seen in R1 (TC-062, TC-076, held as a PM question) and again in R2 on the SM-A5360: Crop TC-062 (3:2 + 「All」, Undo 1: photo 2 「1576 x 1970」 and photo 4 「2560 x 1439」 back, photo 1 still 「1706 x 1133」; Undo 2: photo 1 「1706 x 2559」); Adjustment TC-076 (Exposure 「0.62」 + 「All」: after the apply's Undo, photo 2 183/130/100 → 146/100/74, photo 1 unchanged 123/147/191 at 「0.62」). The app follows R-099's 「a single edit is that photo's own step」, so the behaviour may be the intended one: filed to PM for a decision (user, 2026-11-11), Type UX (how Undo feels), not a defect. In TC-076 the first Undo was an empty step left by a no-change 「All」 (O-1, see ISS-BEA-12). The image of TC-076 shows photo 1 (selected, still bright) beside photo 2 (back to its original)."),
]

OBS = [("O-1", "Folded into ISS-BEA-12's note: a no-change 「All」 makes an empty Undo step (R1 O-11); gone once 「All」 is disabled after the apply.")]


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
    obs = set(re.findall(r"^- \*\*(O-\d+)\*\*", open(f"{RUN}/observations.md", encoding="utf-8").read(), re.M))
    if obs - {o for o, _ in OBS}:
        sys.exit(f"unmapped observations: {sorted(obs - {o for o, _ in OBS})}")
    tally = {}
    for r in results:
        tally[r["Result"]] = tally.get(r["Result"], 0) + 1

    imgroot = f"{OUT}/{NAME}_images"
    shutil.rmtree(imgroot, ignore_errors=True)
    md = [f"# Batch Editing (Android) — eBug drafts, run R2 (table v5), PhotoDirector {V} build {B}\n",
          f"**Source:** spec-casebook run `library/phd/batch-editing/android/runs/2026-11-11-r2/` — phase R2 of draft "
          f"`drafts/20261111-173421` (approved table v5, the 16 rows v5 added or changed), 2026-11-11 on Samsung Galaxy "
          f"A53 5G (SM-A5360) through Appium / UiAutomator2, Test Server, Premium through the debug switch. Tally: "
          f"{tally.get('Pass', 0)} Pass, {tally.get('Fail', 0)} Fail, {tally.get('Blocked', 0)} Blocked, "
          f"{tally.get('Not run', 0)} Not run.\n",
          "**Status:** nothing filed, uploaded or commented. Filing defaults from the newest filed batch "
          "(`ebug-defaults.ts`: 2026-11-10-r1 — Creator WILLY_WU, TR261106-0051, [AIAgent], API) are for the reviewer "
          "to confirm. Dedupe is read-only, Android pool only (dedupe per OS): see `dedupe.txt`.\n",
          "Rules: reviewer rules — one action per Repro step, a Spec Link on every entry (URL on its own line), at least "
          "one image per entry, no video; no failure-related entry, so no log. RD findings are `[AIAgent]`; the open "
          "question goes to PM as `[AIAgent][UX]` (user, 2026-11-11). Feature name `Batch_Editing:` (REQ-008). Spec basis "
          "check (REQ-055) done per entry.\n",
          f"**What is drafted:** {len(E)} entries (ISS-BEA-12…{11 + len(E)}; numbering continues R1's) from "
          f"{len(fails)} Fail rows: 2 defects (10 rows), 1 PM question (2 rows).\n",
          "Legend — Class: Functional / UI / UX · Severity: S1 critical and blocking only, S2 important, S3 moderate · "
          "Owner: RD / PM.\n\n---\n"]
    for n, e in enumerate(E, 1):
        folder = f"{imgroot}/{n:02d}_{e['iss']}"
        os.makedirs(folder)
        tag = e["iss"].split("-")[-1].lower()
        cites = []
        for src, slug, box in e["images"]:
            fn = f"{V}_bea{tag}_{slug}.jpg"
            boxed(src, f"{folder}/{fn}", box)
            cites.append(fn)
        note = [DEVICE] + e["notes"] + e["links"] + ["<Claude Reviewed>"]
        desc = (f"Repro Steps:\n{e['steps']}\n\nResult:\n{e['result']}\n摘要：{e['result_zh']}\n"
                + " ".join("{" + c + "}" for c in cites)
                + f"\n\nExpect Result:\n{e['expect']}\n摘要：{e['expect_zh']}\n\nNote:\n" + "\n".join(note))
        if len(e["short"]) > 140:
            sys.exit(f"{e['iss']} short description {len(e['short'])} chars")
        md.append(f"## {n}. {e['iss']} — {e['title']}  ·  Class: {e['cls']}  ·  Severity: S{e['sev']}  ·  Owner: {e['owner']}\n")
        md.append(f"**Report step:** {', '.join(e['cases'])}  ·  **Reproduce:** {e['rep']}  ·  **Verified on:** {V}.{B}\n")
        md.append(f"> **QA note — not pasted into eBug.** {e['qa']}\n")
        md.append(f"**Short Description:**\n\n```\n{e['short']}\n```\n")
        md.append(f"**Description:**\n\n```\n{desc}\n```\n")
        md.append(f"**Images:** `{NAME}_images/{n:02d}_{e['iss']}/`\n\n---\n")
    md.append("## Not raised (observations, for the record)\n")
    for o, t in OBS:
        md.append(f"- {o}: {t}")
    md.append("\n## Reconciliation against the run\n")
    md.append("| Case | Result | Where |\n|---|---|---|")
    where = {c: f"F-{n} {e['iss']}" for n, e in enumerate(E, 1) for c in e["cases"]}
    for r in results:
        md.append(f"| {r['ID']} | {r['Result']} {r['Disposition']} | {where.get(r['ID'], '—')} |")
    md.append("")
    open(f"{OUT}/{NAME}.md", "w", encoding="utf-8").write("\n".join(md))
    print(f"wrote {NAME}.md with {len(E)} entries")


if __name__ == "__main__":
    main()
