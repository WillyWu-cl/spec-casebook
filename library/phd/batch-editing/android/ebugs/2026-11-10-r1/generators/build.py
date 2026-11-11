#!/usr/bin/env python3
"""Build the Batch Edit Android eBug draft batch for run 2026-11-09-r1 (draft v2, 20261109-150747) on 20.19.0 (90201900).

Writes library/phd/batch-editing/android/ebugs/2026-11-10-r1/20261110_eBug_drafts_Batch-Edit-R1_20.19.0.md, the sibling
_images/ folder (one NN_ISS-ID folder per entry: red-boxed JPEGs named 20.19.0_<slug>.jpg plus the logcat excerpt for the
failure-related entry) and logs/. Nothing is filed. Every Fail row of results.csv, every Blocked row and every observation
O-n is mapped (entry / held PM question / not raised); the script stops when one is missing.

    python library/phd/batch-editing/android/ebugs/2026-11-10-r1/generators/build.py
"""
import csv, os, re, shutil, sys

from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.dirname(HERE)
ROOT = os.path.dirname(os.path.dirname(OUT))                      # library/phd/batch-editing/android
REPO = os.path.dirname(os.path.dirname(os.path.dirname(ROOT)))
RUN = f"{ROOT}/runs/2026-11-09-r1"
SHOTS = f"{RUN}/screenshots"
NAME = "20261110_eBug_drafts_Batch-Edit-R1_20.19.0"
V, B = "20.19.0", "90201900"
PRE = f"PHD-A {V} - [AIAgent]"
DEVICE = "Device: Samsung Galaxy S23 (SM-S9110) / Android 16"
DS_URL = "https://www.figma.com/design/qZXJfrM5gb5g4tFoCIS1YU/Batch-Edit?node-id=12-2321"
PM_PDF = "UI UX flow 2.pdf"
S3_PDF = "Section 3 · 美圖 Apply to all 實測.pdf"
PM_T = {
    "picker-over-max": "Photo Picker · over_max",
    "room-default": "Batch Edit Room · default",
    "crop-default": "Batch Edit Room · Crop & Rotate · default",
    "adjust-default": "Batch Edit Room · Adjustment · default",
    "server-task-notes": "Server task notes",
    "enhance-offline": "Batch Edit Room · AI Enhance · network_incomplete · offline",
    "confirm-dialog": "AI Enhance Confirm Dialog · default",
    "discard-dialog": "Discard Dialog · default",
    "save-saving": "Batch Save Page · saving",
}


def pm(board):
    return f"Spec Link: Batch Edit PM spec ({PM_PDF}), {PM_T[board]} board ({board})"


def ds(frame):
    return f"Spec Link: Batch Edit Design spec, {frame} frame (Figma page Batch Edit) - {DS_URL}"


def steps(*s):
    return "\n".join(f"{i}. {x}" for i, x in enumerate(s, 1))


START = ("Launch the APP", "Tap Edit on the Launcher", "Tap Batch")

# Each entry: iss, title, cls, sev, owner, cases, reproduce, short, steps, result, result_zh, expect, expect_zh,
# notes (extra Note lines), links, images [(src, slug, box or None)], log (slug or None), qa (QA note).
E = [
 dict(iss="ISS-BEA-01", cases=["TC-110"], cls="Functional", sev=2, owner="RD", rep="2/2",
      title="Sending the app to the background during batch AI Enhance does not pause it; every remaining photo fails",
      short=f"{PRE} Batch Edit: AI Enhance does not pause in the background; remaining photos fail as Connection lost",
      steps=steps(*START, "Select 12 photos", "Tap Next", "Tap AI Enhance", "Tap Enhance", "Tap Start",
                  "Wait until 「Enhancing 4 / 12」 shows", "Press the Home key", "Wait 30 seconds",
                  "Open PhotoDirector from Recents", "Check the result"),
      result="Not paused: the 7 remaining photos failed in the background; on return 「5 completed, 7 failed」 / Connection lost.",
      result_zh="背景期間未暫停，剩餘 7 張立即以 Connection lost 失敗（兩次皆重現）。",
      expect="Processing pauses while the app is in the background and continues from where it was on return; it finishes normally.",
      expect_zh="App 在背景時暫停處理，回到前景後由中斷處繼續並正常完成。",
      notes=[],
      links=[pm("server-task-notes"), "Related: PHA262026P0022 (AI_Removal: false Network Error after backgrounding during Generate)"],
      images=[("tc110-return.png", "return_5done_7failed", (30, 250, 1050, 420)),
              ("tc110-return2.png", "return2_4done_8failed", None)],
      log="log",
      qa="Wi-Fi on and connected throughout; 「Retry Failed (7)」 in the foreground then finished all 7 in 29 s. Second try: Home at 「Enhancing 2 / 12」, back after 30 s: 「4 completed, 8 failed」. R-129 (PM server-task-notes, D1-05: 「App 切到背景 → 處理暫停，回到前景後繼續」). Spec basis checked: the rule is written for the batch AI Enhance processing state; no newer Design frame draws background behaviour. logcat (R1-e pull): Home at 14:23:41, image 563 still finished in the background at 14:23:44, then at 14:23:47 `uploadFile, java.net.UnknownHostException` and images 564–570 `Failed(error=NETWORK_ERROR)` within 3 s; `batch of 12 (maxInFlight=1) took 48525 ms`. Second run 14:26:08 the same. The app has no network while in the background on this phone (Android 16), and the runner keeps going instead of pausing, so every remaining photo is burned as a failure. Related to O-13 (sporadic SocketTimeout on working Wi-Fi), which is not raised."),
 dict(iss="ISS-BEA-02", cases=["TC-037", "TC-155"], cls="UI", sev=3, owner="RD", rep="1/1",
      title="The batch Crop & Rotate room has no ‹ (back) button at the top left",
      short=f"{PRE}[UI] Batch Edit: The Crop & Rotate room has no ‹ (back) button at the top left of the top bar",
      steps=steps(*START, "Select 12 photos", "Tap Next", "Tap Crop & Rotate", "Check the top left of the top bar"),
      result="The top bar shows only 「1688 x 2528」 with the pencil and 「All」; there is no ‹ at the left.",
      result_zh="Crop & Rotate 頂列左側沒有 ‹ 返回鍵。",
      expect="The top bar has ‹ at the left, the photo's size 「W x H」 with a pencil in the middle and 「All」 at the right.",
      expect_zh="頂列左側有 ‹，中間為尺寸與鉛筆，右側為 All。",
      notes=[],
      links=[pm("crop-default"), ds("3_ (Crop & Rotate)")],
      images=[("tc029-crop.png", "crop_room_no_back", (0, 110, 330, 250))],
      log=None,
      qa="The rest of the room matches (tools, ratios, angle slider, ✕ / undo / redo / ✓); no ‹ in the view hierarchy either. R-050 (PM crop-default; Design 3_ / main_down_tool_box frames both draw ‹ at the top left). Spec basis checked on both sets (2026-10-30 PM, 2026-11-09 PM + Design PDFs): every Crop frame draws ‹. What ‹ should do beside ✕ is open (Q-22), so the ticket asks only for the button; TC-155 (‹ behaviour) is Blocked by this. The reset button the app adds is not drawn by the Design (note only, not raised)."),
 dict(iss="ISS-BEA-03", cases=["TC-079"], cls="Functional", sev=3, owner="RD", rep="1/1",
      title="Undo in the batch Adjustment room switches the Light / Color / Details tab",
      short=f"{PRE} Batch Edit: Undo in the Adjustment room switches the Light / Color / Details tab",
      steps=steps(*START, "Select 12 photos", "Tap Next", "Tap Adjustments", "Tap Exposure",
                  "Drag the slider to 0.92", "Tap Color", "Tap Saturation", "Drag the slider to 58", "Tap Details",
                  "Tap Undo", "Tap Undo", "Check the result"),
      result="Values undone, but the 1st Undo switched the tab to 「Color」 and the 2nd to 「Light」.",
      result_zh="兩次 Undo 都正確還原數值，但分頁被切到 Color、再切到 Light。",
      expect="Both values are undone and the tab stays on 「Details」 (Undo does not switch the tab).",
      expect_zh="數值還原且分頁維持在 Details，不因 Undo 自動切換。",
      notes=[],
      links=[pm("adjust-default")],
      images=[("tc079-before.png.png", "details_before_undo", (560, 1800, 780, 1900)),
              ("tc079-undo2.png.png", "light_after_2nd_undo", (280, 1800, 430, 1900))],
      log=None,
      qa="Starting values: Exposure 0.48 → 0.92, Saturation 46 → 58. R-104 (PM adjust-default, DR-05g: 「Undo / Redo 不切換 Light / Color / Details 分頁（同單張 Adjustment）」). Spec basis checked: written for the batch Adjustment room; no Design frame draws undo behaviour. The single-photo Adjustment room was not compared on this phone (opening it drops the batch), so the parenthesis is the PM's claim."),
 dict(iss="ISS-BEA-04", cases=["TC-144"], cls="Functional", sev=3, owner="RD", rep="2/2",
      title="System Back does not close the 「Enhance 12 photos?」 confirm dialog",
      short=f"{PRE} Batch Edit: System Back does not close the AI Enhance confirm dialog 「Enhance 12 photos?」",
      steps=steps(*START, "Select 12 photos", "Tap Next", "Tap AI Enhance", "Tap Enhance",
                  "Press the system Back key", "Press the system Back key", "Check the result"),
      result="The dialog stays open after each Back; only 「Cancel」 closes it. Nothing is processed.",
      result_zh="按系統返回鍵兩次，確認對話框仍不關閉。",
      expect="Back acts like 「Cancel」: the dialog closes, the AI Enhance page shows and nothing is processed.",
      expect_zh="返回鍵等同 Cancel：關閉對話框且不開始處理。",
      notes=[],
      links=[pm("confirm-dialog")],
      images=[("tc144-back.png", "confirm_after_back", (90, 960, 990, 1360))],
      log=None,
      qa="Same on the 「Discard changes?」 dialog (ISS-BEA-05). Team rule REQ-051 / R-170 (Android system Back does what the screen's own back / close does) applied to R-137 (PM confirm-dialog: 「Cancel」 returns to the AI Enhance page with nothing processed). The spec draws no Back for the dialog, so this rests on the team rule, named as such. Tried with Appium back and adb KEYCODE_BACK."),
 dict(iss="ISS-BEA-05", cases=["TC-145"], cls="Functional", sev=3, owner="RD", rep="2/2",
      title="System Back does not close the 「Discard changes?」 dialog",
      short=f"{PRE} Batch Edit: System Back does not close the 「Discard changes?」 dialog opened from Home",
      steps=steps(*START, "Select 12 photos", "Tap Next", "Tap Crop & Rotate", "Tap Square", "Tap ✓", "Tap Home",
                  "Press the system Back key", "Wait 2 seconds", "Press the system Back key", "Check the result"),
      result="The 「Discard changes?」 dialog stays open after each Back.",
      result_zh="按系統返回鍵兩次，放棄變更對話框仍不關閉。",
      expect="Back acts like 「Keep Editing」: the dialog closes and Batch Edit Room stays with the edits.",
      expect_zh="返回鍵等同 Keep Editing：關閉對話框並保留編輯。",
      notes=[],
      links=[pm("discard-dialog")],
      images=[("tc145-back.png", "discard_after_back", (85, 960, 995, 1340))],
      log=None,
      qa="Same on the AI Enhance confirm dialog (ISS-BEA-04). Team rule REQ-051 / R-170 applied to R-142 (PM discard-dialog: 「Keep Editing」 stays in Batch Edit Room with the edits). Spec silent on Back (Q-11), so this rests on the team rule, named as such."),
 dict(iss="ISS-BEA-06", cases=["TC-060"], cls="Functional", sev=3, owner="RD", rep="1/1",
      title="Square applied to all saves a 16:9 photo as 1434 x 1435 — not square",
      short=f"{PRE} Batch Edit: Square crop applied to all saves a 16:9 photo as 1434 x 1435, not square",
      steps=steps(*START, "Select 4 photos, the 4th one 2730 x 1535 (16:9)", "Tap Next", "Tap Crop & Rotate",
                  "Tap the 4th thumbnail", "Tap Square", "Tap All", "Tap ✓", "Tap Save",
                  "Check the saved files' pixel sizes"),
      result="The room labels the box 「1434 x 1435」 and the saved file is 1434 x 1435; the other three are square.",
      result_zh="16:9 照片套用 Square 後輸出 1434 x 1435，並非正方形。",
      expect="Square is a 1:1 crop: every saved photo's width equals its height.",
      expect_zh="Square 為 1:1，輸出寬高應相等。",
      notes=[],
      links=[pm("crop-default"), f"Spec Link: Batch Edit PM test ({S3_PDF}), 結論 board (meitu-conclusion)"],
      images=[("tc060-room.png", "square_label_1434x1435", (360, 130, 660, 220)),
              ("tc060-savepage.png", "saved_4_photos", None)],
      log=None,
      qa="Saved files read over adb from DCIM/PhotoDirector: 1706 x 1706, 1576 x 1576, 800 x 800, 1434 x 1435. Hand-chosen Square shows the same 1 px gap in the label (「1077 x 1076」, 「1688 x 1685」). R-050 lists Square among the room's ratios; R-062 (Section 3 conclusion) says output sizes follow each original. The 1 px gap is a plain defect whatever the size. Not part of this entry: the room holds this photo at a 2560 px long side (2560 x 1439, O-5), so the box is cut from the reduced copy (full original would give 1535 x 1535) — held as a PM question with TC-049 / TC-057 / TC-058. O-4 / O-7 are the same rounding in the label."),
 dict(iss="ISS-BEA-07", cases=["TC-122"], cls="UI", sev=3, owner="RD", rep="2/2",
      title="The feedback button stays on the dimmed top bar while photos are saving",
      short=f"{PRE}[UI] Batch Edit: The feedback button stays on the dimmed top bar while 「Saving k / 20」 shows",
      steps=steps(*START, "Select 20 photos", "Tap Next", "Tap Save", "Check the top bar while 「Saving k / 20」 shows"),
      result="While 「Saving k / 20」 shows, the feedback (!) button is still on the dimmed top bar.",
      result_zh="存檔中頂列仍顯示 feedback (!) 按鈕。",
      expect="While saving, the top bar is dimmed with no feedback button.",
      expect_zh="存檔中頂列變暗，且不顯示 feedback 按鈕。",
      notes=[],
      links=[ds("canvas_img_focus-8 (saving)"), pm("save-saving")],
      images=[("tc122-saving1.png", "saving_feedback_button", (690, 90, 830, 230))],
      log=None,
      qa="R-150 (PM save-saving; Design canvas_img_focus-8 / -9 draw the saving overlay with the feedback icon gone and Home / Replace dimmed). Spec basis checked against the 2026-11-09 Design PDFs; PM does not draw the top bar in detail, so the Design is the source."),
 dict(iss="ISS-BEA-08", cases=["TC-115"], cls="UI", sev=3, owner="Doc", rep="1/1",
      title="Discard dialog button reads 「Keep」, not 「Keep Editing」",
      short=f"{PRE}[UI] Batch Edit: The Discard dialog's button reads 「Keep」, not 「Keep Editing」",
      steps=steps(*START, "Select 12 photos", "Tap Next", "Tap Crop & Rotate", "Tap Square", "Tap ✓", "Tap Home",
                  "Check the dialog buttons"),
      result="「Discard changes?」 / 「Your edits to these photos will be lost.」 with the buttons 「Keep」 and 「Discard」.",
      result_zh="對話框按鈕為「Keep」。",
      expect="The buttons read 「Discard」 and 「Keep Editing」.",
      expect_zh="按鈕應為「Discard」與「Keep Editing」。",
      notes=[],
      links=[pm("discard-dialog"), ds("Discard dialog")],
      images=[("tc115-dialog.png", "keep_button", (80, 1195, 545, 1325))],
      log=None,
      qa="R-140 (PM discard-dialog copy; the 2026-11-09 Design 「Discard dialog」 frame also reads 「Keep Editing」). The dialog over the AI Enhance page (TC-100) shows 「Keep」 too, with another body text; that dialog's existence is the held Q-19 question."),
 dict(iss="ISS-BEA-09", cases=["TC-012"], cls="UI", sev=3, owner="Doc", rep="2/2",
      title="The 21st-photo toast reads 「You can only select 20 photos.」",
      short=f"{PRE}[UI] Batch Edit: 21st-photo toast reads 「You can only select 20 photos.」, not the spec copy",
      steps=steps(*START, "Select 20 photos", "Tap a 21st photo", "Check the toast"),
      result="The 21st photo is not selected and the 20 stay selected, but the toast reads 「You can only select 20 photos.」.",
      result_zh="第 21 張被擋下，但 toast 文案不同。",
      expect="The toast reads 「Please pick at most 20 photos.」.",
      expect_zh="Toast 應為「Please pick at most 20 photos.」。",
      notes=[],
      links=[pm("picker-over-max")],
      images=[("tc012-toast-crop.png", "toast", (0, 0, 799, 179)),
              ("tc012-toast.png", "picker_20_of_20", (0, 1795, 760, 1885))],
      log=None,
      qa="R-018 (PM picker over_max, DR-01). The Design PDFs draw no toast for this case, so PM's copy stands. The toast is not in the page source; captured by screencap (crop) on 2 taps."),
 dict(iss="ISS-BEA-10", cases=["TC-018"], cls="UI", sev=3, owner="Doc", rep="1/1",
      title="Main screen tool label reads 「Adjustments」, not 「Adjustment」",
      short=f"{PRE}[UI] Batch Edit: The main screen's tool label reads 「Adjustments」, not 「Adjustment」",
      steps=steps(*START, "Select 12 photos", "Tap Next", "Check the tool labels at the bottom"),
      result="The tools read 「Crop & Rotate」 / 「Adjustments」 / 「AI Enhance」.",
      result_zh="中間工具名稱為「Adjustments」。",
      expect="The tools read 「Crop & Rotate」 / 「Adjustment」 / 「AI Enhance」.",
      expect_zh="工具名稱應為「Adjustment」。",
      notes=[],
      links=[pm("room-default"), ds("canvas_img_focus")],
      images=[("tc018-b.png", "adjustments_label", (420, 2005, 660, 2175))],
      log=None,
      qa="If the label is shared with the single-photo Edit Room on purpose, RD may forward to PM. R-020 / room-default (PM) and every 2026-11-09 Design main-screen frame read 「Adjustment」. Spec basis checked: no frame draws 「Adjustments」."),
 dict(iss="ISS-BEA-11", cases=["TC-107"], cls="UI", sev=3, owner="Doc", rep="1/1",
      title="Offline 「Retry Failed」 toast reads 「No Internet connection」 (capital I)",
      short=f"{PRE}[UI] Batch Edit: Offline Retry Failed toast reads 「No Internet connection」 (capital I)",
      steps=steps(*START, "Select 15 photos", "Tap Next", "Tap AI Enhance", "Tap Enhance", "Tap Start",
                  "Turn Wi-Fi off while 「Enhancing」 shows", "Wait until the summary shows",
                  "Tap Retry Failed (7)", "Check the toast"),
      result="Toast 「No Internet connection」; nothing starts (correct). Only the capital 「I」 differs.",
      result_zh="Toast 為「No Internet connection」（大寫 I），行為正確。",
      expect="The toast reads 「No internet connection」 and nothing starts.",
      expect_zh="Toast 應為「No internet connection」，且不開始處理。",
      notes=[],
      links=[pm("enhance-offline")],
      images=[("tc107-toast.png", "offline_toast", (290, 1110, 790, 1195))],
      log="log107",
      qa="Likely the app's shared offline toast; Doc may keep the app-wide copy. logcat: the offline batch of 15 ended 14:34:44 with 7 NETWORK_ERROR failures; the toast at 14:35:02 starts no BatchEditRunner work (none until Wi-Fi was back). R-127 (PM network_incomplete · offline). Copy-only; the behaviour (nothing starts) passes. Low value: Doc may judge the app-wide string correct."),
]

HELD = [
 ("TC-062, TC-076, O-11", "question", "One Undo after a ratio / Adjustment edit + 「All」 reverts the 11 other photos, but the current photo keeps its own edit (a separate earlier step). R-087 / R-105 say only that Apply to all is one step; whether the current photo's own change belongs to it is a PM call. O-11: a no-change 「All」 adds an empty Undo step."),
 ("TC-049, TC-057, TC-058", "question", "The Crop room holds every photo at a 2560 px long side (stand-in ④ 2730 x 1535 acts as 2560 x 1439, O-5 / O-7), so box sizes and the Custom resolution range (「Width should be between 147 and 2560.」) differ from Section 3's figures (1151 x 1535; 238 – 2730 x 238 – 1535). PM: does PhD use the 2560 cap and a 147 px minimum (Q-6)?"),
 ("TC-100, TC-142", "question", "✕ and Back after a finished batch AI Enhance open 「Discard changes?」 「All your existing changes will be lost.」 Keep / Discard, and Discard drops the results; R-130 says ✕ returns with the results kept, while the Design draws this dialog over the AI Enhance page (Q-19)."),
 ("TC-128, O-16", "question", "Batch Save page title 「Saved 12 photos」 follows PM; the Design draws 「Save 12 photos」 (Q-20)."),
 ("TC-135, O-19", "question", "As Free, batch saves show the IAP flyer and an interstitial, but the Batch Save page has no native ad card (the single 「Save & Share」 page has one under 「Share to」). Neither PM nor the Design draws an ad slot there; R-158 says ads appear as usual. New PM question."),
]
OBS_NOT = [
 ("O-1", "System Back from Batch Edit Room with no edit returns to the picker with the selection kept (expected, TC-138)."),
 ("O-2", "Single-photo AI Enhance ✕ leads to the single Edit Room (outside this feature)."),
 ("O-3", "Tooling: `device-android.ts hold` takes seconds."),
 ("O-4", "Size label 1 px short on a hand-chosen Square: folded into ISS-BEA-06."),
 ("O-5", "2560 px long-side cap in the Crop room: held with TC-049 / TC-057 / TC-058."),
 ("O-6", "Tooling: `lbl Discard` taps the dialog title; use `tapif`."),
 ("O-7", "④ reads 「2554 x 1435」 after Original via All: rounding through the 2560 cap, held with the cap question."),
 ("O-8", "「Rate Us」 after the first batch save (TC-136 needs RD's trigger count)."),
 ("O-9", "StackOverflowError at 09:39 came from UiAutomator2 `setval` (accessibility ACTION_SET_TEXT) looping the linked Width / Height watchers; not reproduced by keyboard input. Automation artifact, RD information only, not filed."),
 ("O-10", "Tooling: Appium restart dropped the batch."),
 ("O-11", "Empty Undo step from a no-change 「All」: held with TC-062 / TC-076."),
 ("O-12", "Tooling: slider scales and progress steps."),
 ("O-13", "Sporadic SocketTimeout upload failures on working Wi-Fi (Retry succeeded each time): likely network / Test Server; watch on other networks before raising."),
 ("O-14", "Retry Failed asks 「Enhance n photos?」 with n = failed photos (as TC-096 expects; TC-096 itself Blocked)."),
 ("O-15", "Tooling: `wifi` USB check fixed for Windows adb."),
 ("O-16", "Batch Save title 「Saved 3 photos」: held with TC-128 (Q-20)."),
 ("O-17", "「Rate Us」 after some batch saves; trigger count unknown (TC-136 Blocked, rd-info)."),
 ("O-18", "Tooling: picker tiles move after saves."),
 ("O-19", "No native ad card on the Batch Save page: held with TC-135."),
]

LOG_SRC = f"{RUN}/logs/R1-e-20261110-144154/logcat-live.txt"
LOG_RE = re.compile(r"^2026-11-10 14:2(3:(0[7-9]|[1-5]\d)|6:0[0-9])\.\d+ .*(BatchEditRunner|executeWithAuthRetry)")
SECRET = re.compile(r"bearer|authorization|token|x-amz|signature=", re.I)


def make_log(path):
    seen, lines = set(), []
    for l in open(LOG_SRC, encoding="utf-8", errors="replace"):
        l = l.rstrip("\n")
        if not LOG_RE.match(l) or "failed: NETWORK_ERRORcom" in l:
            continue
        body = l[24:]
        if body in seen:
            continue
        seen.add(body)
        if SECRET.search(l):
            sys.exit(f"secret-looking line in the log excerpt: {l[:80]}")
        lines.append(l)
    head = ("PhotoDirector Android 20.19.0 (90201900), Samsung Galaxy S23 / Android 16 — logcat excerpt, batch AI Enhance sent to\n"
            "the background. Run 1: Home pressed at 14:23:41 at 「Enhancing 4 / 12」, back at 14:24:11. Run 2: Home at 14:26:02 at\n"
            "「Enhancing 2 / 12」, back at 14:26:32. Wi-Fi on and connected throughout. Duplicate lines removed.\n\n")
    open(path, "w", encoding="utf-8").write(head + "\n".join(lines) + "\n")


LOG107 = re.compile(r"^2026-11-10 14:3(4:(1\d|[2-4]\d)|5:0\d)\.\d+ .*(BatchEditRunner|executeWithAuthRetry|Toast   : show: caller|VRI\[Toast\].*Relayout)")


def make_log107(path):
    seen, lines = set(), []
    for l in open(LOG_SRC, encoding="utf-8", errors="replace"):
        l = l.rstrip("\n")
        if not LOG107.match(l) or "failed: NETWORK_ERRORcom" in l:
            continue
        body = l[24:]
        if body in seen:
            continue
        seen.add(body)
        if SECRET.search(l):
            sys.exit(f"secret-looking line in the log excerpt: {l[:80]}")
        lines.append(l)
    head = ("PhotoDirector Android 20.19.0 (90201900), Samsung Galaxy S23 / Android 16 — logcat excerpt, offline batch AI Enhance\n"
            "(Wi-Fi off) ending 「8 completed, 7 failed」, then 「Retry Failed (7)」 tapped at 14:35:02 while still offline: the\n"
            "toast 「No Internet connection」 shows and no BatchEditRunner work starts. Duplicate lines removed.\n\n")
    open(path, "w", encoding="utf-8").write(head + "\n".join(lines) + "\n")


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
    blocked = [r for r in results if r["Result"] == "Blocked"]
    mapped = {c for e in E for c in e["cases"]} | {c.strip() for h in HELD for c in h[0].split(",") if c.strip().startswith("TC-")}
    missing = sorted(fails - mapped)
    if missing:
        sys.exit(f"unmapped Fail rows: {missing}")
    obs = set(re.findall(r"^- (O-\d+)", open(f"{RUN}/observations.md", encoding="utf-8").read(), re.M))
    if obs - {o for o, _ in OBS_NOT}:
        sys.exit(f"unmapped observations: {sorted(obs - {o for o, _ in OBS_NOT})}")

    imgroot = f"{OUT}/{NAME}_images"
    shutil.rmtree(imgroot, ignore_errors=True)
    os.makedirs(f"{OUT}/logs", exist_ok=True)
    md = []
    md.append(f"# Batch Edit (Android) — eBug drafts, run R1 (draft v2), PhotoDirector {V} build {B}\n")
    md.append(f"**Source:** spec-casebook run `library/phd/batch-editing/android/runs/2026-11-09-r1/` — phase R1 of draft "
              f"`drafts/20261109-150747` (table v2 draft, 161 rows, not yet saved as the approved table), 2026-11-09 → 11-10 on "
              f"Samsung Galaxy S23 (SM-S9110) / Android 16 through Appium / UiAutomator2, Test Server, Premium through the debug "
              f"switch (R1-g Free). **No TR for this build.** Tally: 130 Pass, 20 Fail, 11 Blocked, 0 Not run.\n")
    md.append("**Status:** nothing filed, uploaded or commented. No filed batch exists for this feature "
              "(`ebug-defaults.ts batch-editing android`: none), so Creator, TRCode, source tag and method are left for the "
              "reviewer. Dedupe is read-only, Android pool only (dedupe per OS, user 2026-10-28): see `dedupe.txt`.\n")
    md.append("Rules: reviewer rules 2026-10-21 — one action per Repro step, a Spec Link on every entry, at least one image per "
              "entry, the logcat excerpt on the failure-related entry, no video. No `[UX]`: `[AIAgent]` or `[AIAgent][UI]`, owner "
              "RD (Doc for copy). Spec basis check (REQ-055) done per entry; team rules are named as such. The Design has no "
              "per-frame Figma links in this spec set (PDF exports of page 12:2321), so Design links point at that page with "
              "the frame name.\n")
    md.append(f"**What is drafted:** {len(E)} entries (ISS-BEA-01…{len(E):02d}) from 12 defect rows (11 Fail + TC-155 "
              f"Blocked). 9 Fail rows are held as PM questions (5 questions). See Reconciliation.\n")
    md.append("Legend — Class: Functional / UI · Severity: S1 critical and blocking only, S2 important, S3 moderate (copy and small UI too: S4 is rare in the pool) · "
              "Owner: RD / Doc.\n\n---\n")
    for n, e in enumerate(E, 1):
        folder = f"{imgroot}/{n:02d}_{e['iss']}"
        os.makedirs(folder)
        tag = e["iss"].split("-")[-1].lower()
        cites = []
        for src, slug, box in e["images"]:
            fn = f"{V}_bea{tag}_{slug}.jpg"
            boxed(src, f"{folder}/{fn}", box)
            cites.append(fn)
        if e["log"]:
            fn = f"{V}_bea{tag}_log.txt"
            (make_log107 if e["log"] == "log107" else make_log)(f"{folder}/{fn}")
            shutil.copy(f"{folder}/{fn}", f"{OUT}/logs/{fn}")
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
    md.append("## Held — PM questions (not drafted)\n")
    md.append("| Cases | Disposition | Question |\n|---|---|---|")
    for c, d, q in HELD:
        md.append(f"| {c} | {d} | {q} |")
    md.append("\n## Not raised (observations, for the record)\n")
    for o, t in OBS_NOT:
        md.append(f"- {o}: {t}")
    md.append("\n## Reconciliation against the run\n")
    md.append("### Fail rows\n")
    md.append("| Case | Disposition | Where |\n|---|---|---|")
    where = {}
    for n, e in enumerate(E, 1):
        for c in e["cases"]:
            where[c] = f"F-{n} {e['iss']}"
    for c, _, _ in HELD:
        for x in [y.strip() for y in c.split(",") if y.strip().startswith("TC-")]:
            where[x] = "Held PM question"
    for r in results:
        if r["Result"] == "Fail" or (r["Result"] == "Blocked" and r["ID"] in where):
            md.append(f"| {r['ID']} | {r['Result']} {r['Disposition']} | {where[r['ID']]} |")
    md.append("\n### Blocked rows (no verdict, not drafted)\n")
    for r in blocked:
        if r["ID"] in where:
            continue
        md.append(f"- {r['ID']} ({r['Disposition']}): {r['Actual'][:200]}{'…' if len(r['Actual']) > 200 else ''}")
    md.append("")
    open(f"{OUT}/{NAME}.md", "w", encoding="utf-8").write("\n".join(md))
    print(f"wrote {NAME}.md with {len(E)} entries")


if __name__ == "__main__":
    main()
