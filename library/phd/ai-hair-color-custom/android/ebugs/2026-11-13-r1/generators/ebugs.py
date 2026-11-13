#!/usr/bin/env python3
"""Build the AI Hair Color Custom Android eBug draft batch for round R1 (table v1, draft 20261112-100854) on 20.19.0 (90201900).

Writes ../20261113_eBug_drafts_AI-Hair-Color-Custom-R1_20.19.0.md, the sibling _images/ folder (one NN_ISS-ID folder per
entry: JPEGs named 20.19.0_hccNN_<slug>.jpg with a red box on what the entry is about, plus the logcat excerpt where the
finding has a log cause) and logs/. Nothing is filed. Every Fail row of results.csv and every observation O-n is mapped
(entry / held PM question / not raised); the script stops when one is missing.
Run: python library/phd/ai-hair-color-custom/android/ebugs/2026-11-13-r1/generators/ebugs.py
"""
import csv, json, os, re, shutil, sys
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.dirname(HERE)
ROOT = os.path.abspath(os.path.join(OUT, "..", ".."))           # library/phd/ai-hair-color-custom/android
REPO = os.path.abspath(os.path.join(ROOT, "..", "..", "..", ".."))
RUN = f"{ROOT}/runs/2026-11-13-r1"
NAME = "20261113_eBug_drafts_AI-Hair-Color-Custom-R1_20.19.0"
V, B = "20.19.0", "90201900"
PROD = "PHD-A"
FEAT = "AI_Hair_Color"
DEVICE = "Device: Samsung Galaxy S23 (SM-S9110) / Android 16"
PM_URL = "https://www.figma.com/design/vhIp15PMJcwOcWJ6E9Q4JE/AI-Hair"


def pm(frame, node):
    return f"Spec Link: AI Hair Color Custom PM Figma (26 11E AI Hair Color Custom), {frame} - {PM_URL}?node-id={node}"


def tene(rule, node):
    return f"Spec Link: AI Hair Color PM Figma (26 10E AI Hair Color v2, cited by the Custom page), {rule} - {PM_URL}?node-id={node}"


FACE = pm("Color Selection · entry_warn_face (NEW) frame, Spec - 進房檢查 board", "3370-1668")
FACEB = pm("Spec - 進房檢查 & Photo Picker board (11/25)", "3370-1666")
P_ROW = pm("custom_in_row (NEW) frame, Spec - UI", "3330-424")
P_OPEN = pm("panel_open_no_style (NEW) frame, Spec - UI", "3327-824")
P_TWO = pm("panel_two_tone (NEW) frame, Spec - UI", "3327-1077")
P_PAL = pm("panel_palette (NEW) frame, Spec - UI", "3327-1204")
P_READY = pm("panel_ready (NEW) frame, Spec - UI", "3327-1467")
P_COLL = pm("collapsed_applied (NEW) frame, Spec - UI", "3330-512")
P_RES = pm("result_custom (NEW) frame, Spec - UI", "3330-718")
P_UI = pm("Spec - UI board (UI source note)", "3287-94")
P_FLOW = pm("Spec - Flow board", "3287-93")
A_COLL = pm("flow arrow panel_ready ⌄ → collapsed_applied", "3337-1879")
A_RES = pm("flow arrow generating → result_custom", "3330-1558")
E_X = tene("Spec - UI rule D1-20b (✕ leaves with no confirmation)", "3030-296")
E_RES = tene("Spec - UI rules D1-15 / D1-16 / D1-19 (Artwork save, Intensity)", "3030-302")

# Each entry: iss, title, cls, sev, owner, cases, rep, note, short, steps, res, res_zh, exp, exp_zh, links,
# imgs [(png, slug, box or None)], log (title, [(label, t0, t1)]) or None, rel [lines]
OPEN_ROOM = ["Launch the APP", "Tap AI Photos on the Launcher", "Tap AI Hair Color", "Tap Continue on the photo tips sheet"]
PORTRAIT = OPEN_ROOM + ["Tap a portrait photo with one clear, front-facing face"]
PANEL = PORTRAIT + ["Tap Custom in the swatch row"]
PEXELS = OPEN_ROOM + ["Tap Stock", "Search 「woman portrait」 in Pexels", "Tap the portrait of a woman in a knitted hat"]

E = [
 dict(iss="ISS-HCC-01", title="No slanted-face warning: a 45° tilted face opens the colour page at once", cls="Functional", sev=2, owner="RD",
      cases=["TC-005", "TC-012", "TC-015"], rep=(4, 4),
      note="R-007 / R-009 / R-013 / R-014 (11/25 進房檢查 board: yaw or roll above 15° shows 「Please choose another photo」 / 「The face in this photo is too slanted, which may result in poorly generated results.」 with OK / Continue Anyway). Seen with hc_tilted30_4x5 (about 22° in the screenshot) and hc_tilted45_4x5 (the portrait rotated 45°) from the picker (TC-005), after Crop (TC-012) and from Edit Room › Portrait › Hair (TC-015). Log: doClairFaceDetect2 faceNum 1 each time, then the colour page; no warning. The face-too-small warning does show (TC-008), so only the slant check is missing. Blocked downstream: TC-006 / TC-087 / TC-007 (OK, Continue Anyway, Back on that dialog).",
      short="No slanted-face warning: a face tilted 45° opens the colour page at once",
      steps=OPEN_ROOM + ["Tap a portrait photo whose face is tilted 45°"],
      res="The colour page opens at once (Generate 6); no slanted-face warning shows.",
      res_zh="臉傾斜 45° 的照片直接進入顏色頁，沒有臉部歪斜提示。",
      exp="「Please choose another photo」 / 「The face in this photo is too slanted…」 shows with OK and Continue Anyway.",
      exp_zh="應顯示臉部歪斜提示（OK / Continue Anyway）。",
      links=[FACE, FACEB],
      imgs=[("TC-005_tilt45", "tilted45_colour_page", (0, 1500, 1080, 2220)), ("TC-012_after", "after_crop_no_warning", None)],
      log=None, rel=[]),
 dict(iss="ISS-HCC-02", title="No-face dialog copy differs from the spec (「A face is required」)", cls="UI", sev=4, owner="Doc",
      cases=["TC-009"], rep=(1, 1),
      note="R-010 (11/25 進房檢查 board quotes the 10/E string: 「No face detected. Face is required for this feature.」). The app shows 「No face detected. A face is required for this feature.」. Behaviour (blocked, OK back to the picker) is as specified; copy only, owner Doc.",
      short="No-face dialog reads 「A face is required」, not 「Face is required」",
      steps=OPEN_ROOM + ["Tap a photo with no face (a teacup)"],
      res="The dialog body reads 「No face detected. A face is required for this feature.」",
      res_zh="無臉提示文字多了「A」。",
      exp="The body reads 「No face detected. Face is required for this feature.」",
      exp_zh="文字應為「No face detected. Face is required for this feature.」",
      links=[FACEB],
      imgs=[("TC-009", "no_face_copy", (80, 1050, 1000, 1300))], log=None, rel=[]),
 dict(iss="ISS-HCC-03", title="Custom panel: ︽ key instead of ⌄, the ✕ ↩ ↪ ✓ row stays under it, square top corners", cls="UI", sev=3, owner="RD",
      cases=["TC-019", "TC-020"], rep=(3, 3),
      note="R-019 (⌄ collapse key at the top right), R-020 / D6-16 (the panel has no undo / redo and no ✕ / ✓), R-021 (Bottom_Sheet_bg, top corners rounded 20 pt, as ImageToVideoModelListPanel). The app draws a double up-chevron (custom_collapse_btn), keeps the room's closeBtn / undoBtn / redoBtn / saveResultBtn row under the panel, and the panel's top corners are square (pixel at (2,964) already panel black). Height 0.53 of the screen is within the 0.65 cap (holds). O-8: the palette keeps the same bottom row.",
      short="Custom panel shows ︽ not ⌄, keeps the ✕ ↩ ↪ ✓ row, square corners",
      steps=PANEL + ["Check the panel's top-right key, its corners and the bottom row"],
      res="The key is ︽, the ✕ ↩ ↪ ✓ row stays under the panel, and the top corners are square.",
      res_zh="收合鍵為︽、面板下方仍有 ✕ ↩ ↪ ✓ 列、上緣為直角。",
      exp="A ⌄ key at the top right, no ✕ / ✓ or undo / redo row, top corners rounded 20 pt.",
      exp_zh="右上應為 ⌄、無 ✕ ✓ ↩ ↪ 列、上緣圓角 20pt。",
      links=[P_OPEN, P_UI],
      imgs=[("TC-019_panel", "panel_chevron_row_corners", [(915, 960, 1065, 1085), (0, 2075, 1080, 2210), (0, 955, 120, 1020)])],
      log=None, rel=[]),
 dict(iss="ISS-HCC-04", title="Colour rows are enabled before a style is chosen", cls="Functional", sev=3, owner="RD",
      cases=["TC-021"], rep=(1, 1),
      note="R-023 (panel_open_no_style: before a style is chosen both colour rows and Generate are disabled, D6-03). With no style, tapping the first Base Color swatch selects it (peach ring); both rows are full colour. Generate is disabled and does nothing (holds).",
      short="Custom panel: colour rows can be picked before any style is chosen",
      steps=PANEL + ["Tap the dark brown swatch in Base Color"],
      res="The swatch gets the selection ring; the colour rows are not disabled before a style.",
      res_zh="未選 style 時即可選色，顏色列未停用。",
      exp="Both colour rows are disabled until a style is chosen.",
      exp_zh="選 style 前兩列顏色應為停用。",
      links=[P_OPEN],
      imgs=[("TC-021_tap_base_crop", "colour_selected_no_style", None)], log=None, rel=[]),
 dict(iss="ISS-HCC-05", title="Two-colour style with Base only: Generate is enabled and the 「both required」 text never shows", cls="Functional", sev=2, owner="RD",
      cases=["TC-026", "TC-027"], rep=(2, 2),
      note="R-029 (panel_two_tone: every style but Solid needs both colours; with one filled Generate stays disabled and 「Both Base Color and Highlight Color are required.」 shows under the rows, D6-04). Ombre + Base only: Generate turns orange and enabled (not tapped, it would charge 6). Balayage + Highlight only: Generate stays disabled (holds) but the message is missing too.",
      short="Ombre with only Base Color enables Generate; 「both required」 text never shows",
      steps=PANEL + ["Tap Ombre in Style", "Tap the dark brown swatch in Base Color"],
      res="Generate turns orange and enabled; 「Both Base Color and Highlight Color are required.」 does not show.",
      res_zh="只選 Base Color 時 Generate 已可按，且未顯示兩色皆需選擇的提示。",
      exp="Generate stays disabled and 「Both Base Color and Highlight Color are required.」 shows under the rows.",
      exp_zh="Generate 應停用，並顯示兩色皆需選擇的提示。",
      links=[P_TWO],
      imgs=[("TC-026_base_only", "base_only_generate_enabled", [(40, 1925, 1040, 2095), (0, 1700, 1080, 1935)]),
            ("TC-027_crop", "highlight_only_no_message", None)], log=None, rel=[]),
 dict(iss="ISS-HCC-06", title="Colour palette has no eyedropper key", cls="Functional", sev=3, owner="RD",
      cases=["TC-031", "TC-035"], rep=(2, 2),
      note="R-033 / R-037 (panel_palette: Cancel / Done, saturation-brightness square, hue slider, an eyedropper key right of the slider that works as in the app's existing palette). The page source has Cancel, Done, the square, the cursor and the hue SeekBar only; tapping the hair on the photo with the palette open does nothing.",
      short="Custom colour palette has no eyedropper key next to the hue slider",
      steps=PANEL + ["Tap Ombre in Style", "Tap the colour wheel in Base Color"],
      res="The palette shows Cancel / Done, the colour square and the hue slider, but no eyedropper key.",
      res_zh="調色盤沒有滴管鍵。",
      exp="An eyedropper key sits right of the hue slider and picks a colour from the photo.",
      exp_zh="hue slider 右側應有滴管鍵，可從照片取色。",
      links=[P_PAL],
      imgs=[("TC-031_palette", "palette_no_eyedropper", (950, 1950, 1078, 2080))], log=None, rel=[]),
 dict(iss="ISS-HCC-07", title="System Back in the palette closes the whole room, not just the palette", cls="Functional", sev=2, owner="RD",
      cases=["TC-086"], rep=(1, 1),
      note="R-075 is a QA rule (rule pass 8, Android system Back): Back in the colour palette does what 「Cancel」 does (R-035: Cancel closes it without filling). Back from the palette (Base blue chosen, green being picked) closed AI Hair Color into the Edit Room and lost the Custom settings. Related: Back with the panel open also leaves the room (TC-085, held as Q-14).",
      short="System Back in the colour palette leaves AI Hair Color, not just the palette",
      steps=PANEL + ["Tap Ombre in Style", "Tap the colour wheel in Base Color", "Drag the hue slider to green", "Press the system Back key"],
      res="AI Hair Color closes into the Edit Room; the palette and Custom settings are gone.",
      res_zh="按系統返回鍵直接離開 AI Hair Color 進入 Edit Room，設定遺失。",
      exp="Back closes only the palette like Cancel; the room and the Custom settings stay.",
      exp_zh="返回鍵應只關閉調色盤（同 Cancel）。",
      links=[P_PAL],
      imgs=[("TC-086_green", "palette_before_back", None), ("TC-086_after_back", "back_lands_edit_room", (0, 1820, 1080, 2130))],
      log=None, rel=[]),
 dict(iss="ISS-HCC-08", title="Collapsing the panel never selects Custom; the outer Generate makes the Soft Black template", cls="Functional", sev=2, owner="RD",
      cases=["TC-038", "TC-040", "TC-041", "TC-042"], rep=(5, 5),
      note="R-043 / R-044 / R-042 and flow arrow 3337-1879 (⌄ = apply: the template row is back, the Custom cell is selected and shows the chosen colours, the outer Generate is enabled). After ︽ the selection stays on 「Soft Black」 and the Custom cell keeps its gradient + wand look; the outer Generate then started a TEMPLATE generation (log GenAI_Feature_Generate is_customize FALSE style Style_6001_Solid-Soft-Black_ChatGPT, 6 charged, 10:44:47) instead of the Custom one. Settings themselves are kept and overwritten correctly (TC-041 / TC-042 parts hold). The Custom cell's look before / after is Q-2 (gradient + ＋ vs pencil) and is not part of this entry.",
      short="Collapsing Custom panel keeps Soft Black selected; Generate makes a template",
      steps=PEXELS + ["Tap Custom in the swatch row", "Tap Ombre in Style", "Tap the dark brown swatch in Base Color", "Tap the purple swatch in Highlight Color", "Tap the collapse key at the top right of the panel", "Tap Generate"],
      res="Soft Black stays selected after collapsing and Generate makes a Soft Black template result (6 credits).",
      res_zh="收合後仍選 Soft Black，外部 Generate 產生的是 Soft Black 模板結果。",
      exp="Collapsing selects the Custom cell with the chosen colours and Generate makes the Custom result.",
      exp_zh="收合應選中 Custom 並顯示所選顏色，Generate 產生 Custom 結果。",
      links=[P_COLL, A_COLL],
      imgs=[("TC-038_collapsed", "collapse_soft_black_selected", [(10, 1620, 215, 1900), (225, 1620, 450, 1900)]),
            ("TC-040_result", "outer_generate_template_result", None)],
      log=("outer Generate after collapse is a template generation", [("TC-040", "10:44:40", "10:45:05")]), rel=[]),
 dict(iss="ISS-HCC-09", title="Tapping the photo above the Custom panel does not collapse it", cls="Functional", sev=3, owner="RD",
      cases=["TC-039"], rep=(2, 2),
      note="R-042 (collapsed_applied: tapping outside the panel or its ⌄ key both apply the settings, D6-08). Taps at (540,600) and (300,350) on the photo leave the panel open; only the collapse key closes it.",
      short="Tapping the photo above the Custom panel does not collapse the panel",
      steps=PANEL + ["Tap Ombre in Style", "Tap the dark brown swatch in Base Color", "Tap the purple swatch in Highlight Color", "Tap the photo above the panel"],
      res="Nothing happens; the panel stays open.",
      res_zh="點面板外的照片，面板不會收合。",
      exp="Tapping outside the panel collapses it and applies the settings, like ⌄.",
      exp_zh="點面板外應收合並套用設定。",
      links=[P_COLL],
      imgs=[("TC-039_after2", "panel_stays_after_photo_tap", (0, 960, 1080, 1080))], log=None, rel=[]),
 dict(iss="ISS-HCC-10", title="Custom wait shows only a scan bar: no 「Applying your new hair color...」 text", cls="UI", sev=3, owner="RD",
      cases=["TC-045", "TC-046"], rep=(9, 9),
      note="R-047 (Spec - Flow: a Custom generation waits in place for about 42–48 s with staged reassuring strings, the first 「Applying your new hair color...」, D6-11; the later strings are Q-10). On every Custom generation of the run (9) only a moving peach scan bar shows over the enlarged photo; no text on screen or in the accessibility tree. Waits measured from the log 46–56 s (10:42:22.1 → 10:43:13.6 = 51.5 s for the first).",
      short="Custom generation wait shows no 「Applying your new hair color...」 text",
      steps=PEXELS + ["Tap Custom in the swatch row", "Tap Ombre in Style", "Tap the dark brown swatch in Base Color", "Tap the purple swatch in Highlight Color", "Tap Generate in the panel", "Watch the screen until the result shows"],
      res="Only a scan bar moves over the photo for about 51 s; no reassuring text shows.",
      res_zh="約 51 秒等待只有掃描條動畫，沒有提示文字。",
      exp="「Applying your new hair color...」 shows, then the later reassuring strings change during the wait.",
      exp_zh="等待時應顯示「Applying your new hair color...」並分段更換文字。",
      links=[P_FLOW, A_RES],
      imgs=[("TC-046_w1", "wait_scan_bar_no_text", (0, 224, 1080, 1470)), ("TC-046_w4", "wait_later_no_text", None)],
      log=("Custom generation start and end", [("TC-045 / TC-046", "10:42:20", "10:43:14")]), rel=[]),
 dict(iss="ISS-HCC-11", title="No Intensity bar on a Custom result (panel open or collapsed)", cls="Functional", sev=2, owner="RD",
      cases=["TC-047", "TC-048", "TC-049", "TC-053"], rep=(4, 4),
      note="R-041 / R-052 / R-054 / R-056 (result_custom: the result shows in place with the Intensity bar 0–100 %, default 100 %, D6-12 / D1-14; in-panel Generate puts a 44 pt Intensity row above the button, D6-22 / D6-23, Q-4 for the frame name only). No Intensity row or slider in the page source after any Custom or template result, panel open or collapsed, so Intensity cannot be dragged or reset to 100 on Retry.",
      short="Custom result has no Intensity bar, panel open or collapsed",
      steps=PEXELS + ["Tap Custom in the swatch row", "Tap Ombre in Style", "Tap the dark brown swatch in Base Color", "Tap the purple swatch in Highlight Color", "Tap Generate in the panel", "Wait for the result"],
      res="The result shows and the button reads Retry, but there is no Intensity bar.",
      res_zh="結果出現、按鈕變 Retry，但沒有 Intensity 調整條。",
      exp="An Intensity bar at 100 % appears above Retry and adjusts the result's strength.",
      exp_zh="Retry 上方應出現 Intensity 條（預設 100%）。",
      links=[P_RES, E_RES],
      imgs=[("TC-045_result2", "result_no_intensity", (40, 1860, 1040, 2075)), ("TC-040_result", "collapsed_result_no_intensity", None)],
      log=None, rel=[]),
 dict(iss="ISS-HCC-12", title="No one-time 「My AI Artwork keeps the 100% version」 dialog on the first result", cls="Functional", sev=3, owner="RD",
      cases=["TC-057"], rep=(1, 1),
      note="R-059 (10/E D1-15, cited by result_custom: when the first result appears a one-time dialog says My AI Artwork keeps only the 100 % version; 「Don't show again」 stops it). The first successful result of the run (10:43:13) showed no dialog. It may be tied to the missing Intensity bar (ISS-HCC-11); RD may merge.",
      short="First Custom result shows no one-time My AI Artwork 100% dialog",
      steps=PEXELS + ["Tap Custom in the swatch row", "Tap Ombre in Style", "Tap the dark brown swatch in Base Color", "Tap the purple swatch in Highlight Color", "Tap Generate in the panel", "Wait for the first result"],
      res="The result shows with no one-time dialog.",
      res_zh="第一次結果出現時沒有一次性說明對話框。",
      exp="A one-time dialog says My AI Artwork keeps only the 100% version, with Don't show again.",
      exp_zh="應出現一次性對話框說明 My AI Artwork 只保存 100% 版本。",
      links=[E_RES, P_RES],
      imgs=[("TC-045_result2", "first_result_no_dialog", (0, 224, 1080, 1000))], log=None, rel=[]),
 dict(iss="ISS-HCC-13", title="Switching to a template and back to Custom does not recall the Custom result", cls="Functional", sev=3, owner="RD",
      cases=["TC-054"], rep=(1, 1),
      note="R-055 (result_custom: switching away from Custom and back recalls the Custom result and its Intensity, with no new generation and no charge, D6-12 / D1-19). After a Custom Ombre result and a Soft Black template result, tapping Custom reopens the panel with the settings but the photo still shows the Soft Black result. No generation, no charge (chip 1982). Reached through the collapse defect (ISS-HCC-08), which auto-selects Soft Black.",
      short="Tapping Custom after a template result does not bring back the Custom result",
      steps=PEXELS + ["Tap Custom in the swatch row", "Tap Ombre in Style", "Tap the dark brown swatch in Base Color", "Tap the purple swatch in Highlight Color", "Tap Generate in the panel", "Wait for the result", "Tap the collapse key", "Tap Generate", "Wait for the Soft Black result", "Tap Custom in the swatch row"],
      res="The panel opens with the Custom settings, but the photo still shows the Soft Black result.",
      res_zh="切回 Custom 後照片仍顯示 Soft Black 結果，未叫回 Custom 結果。",
      exp="The Custom result is shown again with no new generation and no charge.",
      exp_zh="應叫回 Custom 結果，不重新生成、不扣點。",
      links=[P_RES, E_RES],
      imgs=[("TC-054_custom_tap", "custom_tap_shows_template_result", (0, 224, 1080, 1000))], log=None, rel=[]),
 dict(iss="ISS-HCC-14", title="✕ and system Back on a result ask 「Discard changes?」 and land in the Edit Room, not the Launcher", cls="Functional", sev=3, owner="RD",
      cases=["TC-079", "TC-088", "O-1", "O-3"], rep=(4, 4),
      note="R-068 (10/E D1-20b: ✕ gives up this edit and returns to the screen before entry — Launcher / Edit Room / My AI Artwork — with no second confirmation). R-076 is a QA rule (rule pass 8: system Back does what ✕ does). Entered from Launcher › AI Photos: ✕ and Back on a result show 「Discard changes?」 / 「All your existing changes will be lost.」 / Keep / Discard, and Discard lands in the Edit Room with the original photo. Without a result (O-1, O-3) ✕ and Back also land in the Edit Room. The result is still in My AI Artwork (saved on success, holds).",
      short="✕ on a result asks 「Discard changes?」, then opens Edit Room, not Launcher",
      steps=PEXELS + ["Tap Custom in the swatch row", "Tap Solid in Style", "Tap the navy swatch in Base Color", "Tap Generate in the panel", "Wait for the result", "Tap the collapse key", "Tap ✕ at the bottom left", "Tap Discard"],
      res="「Discard changes?」 shows; Discard opens the Edit Room with the photo instead of the Launcher.",
      res_zh="按 ✕ 會跳「Discard changes?」確認，之後進入 Edit Room 而非回到 Launcher。",
      exp="✕ returns straight to the Launcher (the screen before entry) with no confirmation.",
      exp_zh="✕ 應不經確認直接回到進入前的畫面（Launcher）。",
      links=[E_X, P_RES],
      imgs=[("TC-079_after", "x_discard_dialog", (80, 880, 1000, 1240)), ("TC-079_landed", "discard_lands_edit_room", None),
            ("TC-088_after", "back_discard_dialog", (80, 880, 1000, 1240))],
      log=None, rel=[]),
 dict(iss="ISS-HCC-15", title="Credit chip keeps the charged balance after a refunded generation", cls="Functional", sev=3, owner="RD",
      cases=["O-9"], rep=(2, 2),
      note="R-067 (Spec - Flow; KP-020: the top-bar credit chip shows the current balance) and the refund rule R-065. Two Custom generations on hc_portrait_4x5 were rejected (CONTENT_REJECTED, nsfw_failed — the Shutterstock-watermarked fixture, not a bug, O-10) after about 41 s; the dialog says 「The credits have been refunded.」 and the server refunds (totalRemain 1988 → 1994 at the next call, Details 「Generation failed, credits returned +6」), but the room's chip stays at 1988 until the room is left and reopened. Observation, closest TC-045 / TC-050; the run's refund check (rule 8) holds on the server side.",
      short="Credit chip still shows the charged balance after a refunded failed generation",
      steps=OPEN_ROOM + ["Tap a portrait photo the generation will reject", "Tap Custom in the swatch row", "Tap Ombre in Style", "Tap the dark brown swatch in Base Color", "Tap the purple swatch in Highlight Color", "Read the credit chip", "Tap Generate in the panel", "Wait for 「Please Try Different Content」", "Tap OK", "Read the credit chip"],
      res="The dialog says the credits were refunded, but the chip still shows 1988 instead of 1994.",
      res_zh="提示已退款，但額度顯示仍為扣點後的 1988。",
      exp="The chip shows the refunded balance (1994) once the refund is made.",
      exp_zh="退款後額度應即時更新為 1994。",
      links=[P_FLOW],
      imgs=[("TC-045_after_ok", "chip_stale_after_refund", (690, 100, 970, 220)), ("TC-045_try2", "rejected_dialog", None)],
      log=("rejected generations, charge and refund", [("O-9", "10:38:40", "10:41:02")]), rel=[]),
]

# Read-only dedupe (2026-11-13, Android pool, dedupe.txt): related tickets, not duplicates.
E[0]["rel"] = ["Related: PHA262026P0039 (20.18.0, Assigned: a slanted face photo shows 「No face detected」); on 20.19.0 no dialog shows at all"]
E[12]["rel"] = ["Related: PHA262026P0047 (20.18.0, Assigned: preview resets to the original after switching to a template not used in generation)"]

HELD = [
 ("TC-017", "PM question (Q-2)", "The Custom cell is an orange gradient with a magic-wand icon (the notes say ＋, the mockups a pencil), and the first template is 「Soft Black」, not 「Platinum」. Which look and which first template are right?"),
 ("TC-085", "PM question (Q-14)", "System Back with the Custom panel open leaves the room into the Edit Room and discards the settings. The spec is silent on Android Back here: collapse (apply), or leave?"),
 ("O-2", "PM question", "「Cancel」 on the >16:9 ratio dialog opens the photo in the Edit Room, not the picker. R-012 only says Cancel gives up entering: is the Edit Room expected?"),
 ("O-11", "PM question", "A Custom generation whose app was force-stopped mid-wait still finished on the server and appears in My AI Artwork, while the room recalls nothing and the 6 credits stay charged. Intended?"),
 ("O-13", "PM question", "Every Custom style logs the same Mixpanel style id Style_010_Custom_HairColor_gpt-image-2.5-sunburst, so analytics cannot tell Ombre from Solid etc. Is a per-style value expected?"),
 ("O-7 / O-14", "PM question", "A palette colour is added as one extra swatch after the wheel (rows grow to 8 + wheel) and replaces the previous extra; it stays after leaving the room. R-022 says 7 recommended colours. Intended?"),
]
OBS_NOT = [
 ("O-4", "New fixture hc_tilted45_4x5.jpg pushed for TC-005.", "Test data, added to fixtures."),
 ("O-5", "The colour page opens with 「Soft Black」 selected.", "Matches R-017 (first template selected); the first-template name is TC-017's question."),
 ("O-6", "Split-dye thumbnails are photos; style names and crowns listed.", "Assets look finished (R-025 said placeholders); no defect."),
 ("O-8", "Palette header over the photo; ✕ ↩ ↪ ✓ row stays under the palette.", "Same bottom-row point as ISS-HCC-03; no separate entry."),
 ("O-10", "Shutterstock-watermarked fixtures rejected as content violations (refunded).", "Server moderation of a watermarked stock photo; not a bug. Run used a Pexels portrait."),
 ("O-12", "Panel button keeps reading 「Retry」 during a Retry wait.", "Run note for timing; the spec does not say what the button reads while waiting."),
 ("O-15", "Premium styles (crown) show 「UNLOCK TO VIP」 and Generate opens the paywall.", "As specified (TC-069 Pass)."),
]
MAP_EXTRA = {"TC-017": "held — PM question Q-2", "TC-085": "held — PM question Q-14", "O-2": "held — PM question",
             "O-11": "held — PM question", "O-13": "held — PM question", "O-7": "held — PM question (with O-14)",
             "O-14": "held — PM question (with O-7)"}

KEEP = re.compile(r"GenAI_Feature_Generate|AIHairColor_Generate_Status|generate error|CONTENT_REJECTED|getMemberCreditRemain|"
                  r"Monetize_Subscription_Appear|doClairFaceDetect2 faceNum|getCreditHistory", re.I)
DROP = re.compile(r"memberToken|access_?token|authorization|bearer|signature=|purchaseToken|creditSystemUUID|uuid", re.I)


def log_lines(t0, t1):
    got, last = [], None
    for f in sorted(os.listdir(f"{RUN}/logs")):
        p = f"{RUN}/logs/{f}/logcat-live.txt"
        if not os.path.exists(p):
            continue
        for line in open(p, encoding="utf-8", errors="replace"):
            parts = line.split(" ", 2)
            if len(parts) < 3 or parts[0] != "2026-11-13" or not (t0 <= parts[1][:8] <= t1):
                continue
            if not KEEP.search(line) or DROP.search(line):
                continue
            m = re.search(r"totalRemain=(\d+)", line)
            if "getMemberCreditRemain" in line:
                if not m or m.group(1) == last:
                    continue
                last = m.group(1)
                line = f"{parts[0]} {parts[1]} CreditSystem: totalRemain={last}"
            if "getCreditHistory" in line:
                continue
            line = re.sub(r"^(\S+ \S+) +\d+ +\d+ [VDIWE] ", r"\1 ", line.rstrip())
            line = re.sub(r"(https?://[^\s'\"?]+)\?\S*", r"\1?…", line)
            if line not in got:
                got.append(line[:400])
    return sorted(got), f


def excerpt(n, iss, title, secs):
    L = [f"# {iss} {title}", f"# PhotoDirector Android {V} ({B}), Samsung SM-S9110 / Android 16, logcat of the app captured by the casebook run",
         "# Lines about generations, failures and the credit balance (shown only when it changes); tokens and IDs dropped.", ""]
    for label, t0, t1 in secs:
        got, _ = log_lines(t0, t1)
        if not got:
            sys.exit(f"empty log window {label} {t0}-{t1}")
        L.append(f"## {label} (2026-11-13 {t0}–{t1})")
        L.extend(got)
        L.append("")
    txt = "\n".join(L)
    if re.search(r"eyJ[A-Za-z0-9_-]{10,}|Bearer |ya29\.|memberToken|purchaseToken", txt):
        sys.exit(f"token-like text in {iss} log")
    os.makedirs(f"{OUT}/logs", exist_ok=True)
    path = f"{OUT}/logs/{V}_hcc{n:02d}_log.txt"
    open(path, "w", encoding="utf-8").write(txt)
    return path


def jpg(src, dst, box):
    im = Image.open(src).convert("RGB")
    if box:
        d = ImageDraw.Draw(im)
        for b in (box if isinstance(box, list) else [box]):
            d.rectangle(b, outline=(255, 0, 0), width=8)
    im.thumbnail((1400, 1400))
    im.save(dst, "JPEG", quality=82)


def main():
    rows = list(csv.DictReader(open(f"{RUN}/results.csv", encoding="utf-8-sig")))
    tally = {}
    for r in rows:
        tally[r["Result"]] = tally.get(r["Result"], 0) + 1
    fails = [r["ID"] for r in rows if r["Result"] == "Fail"]
    disp = {r["ID"]: r["Disposition"] for r in rows}
    blocked = [r for r in rows if r["Result"] == "Blocked"]
    obs = re.findall(r"\*\*(O-\d+)\*\*", open(f"{RUN}/observations.md", encoding="utf-8").read())
    MAP = {}
    for n, e in enumerate(E, 1):
        for c in e["cases"]:
            MAP[c] = f"{n}. {e['iss']}"
    for k, _, _ in OBS_NOT:
        MAP.setdefault(k, "not raised")
    for k, v in MAP_EXTRA.items():
        MAP.setdefault(k, v)
    missing = [k for k in fails + obs if k not in MAP]
    extra = [k for k in MAP if k not in fails and k not in obs]
    if missing or extra:
        sys.exit(f"reconciliation incomplete: missing {missing}, extra {extra}")
    for e in E:
        for c in e["cases"]:
            if c.startswith("TC-") and (c not in fails or disp[c] != "defect"):
                sys.exit(f"{e['iss']} cites {c}, which is not a defect Fail")

    img_root = f"{OUT}/{NAME}_images"
    if os.path.isdir(img_root):
        shutil.rmtree(img_root)
    os.makedirs(img_root)
    L = []
    w = L.append
    w(f"# AI Hair Color Custom (Android) — eBug drafts, round R1 (table v1), PhotoDirector {V} build {B}")
    w("")
    w(f"**Source:** spec-casebook run `library/phd/ai-hair-color-custom/android/runs/2026-11-13-r1/` — round R1 of draft `drafts/20261112-100854` (table v1, {len(rows)} cases), 2026-11-13 10:05 → 11:19 on Samsung Galaxy S23 (SM-S9110) / Android 16 through Appium / UiAutomator2, Test Server, a Free account (credits 1994 → 1916). Tally: " + ", ".join(f"{v} {k}" for k, v in sorted(tally.items())) + ".")
    w("")
    w("**Status:** nothing filed, uploaded or commented. TR: TR261111-0042 (user, 2026-11-13); its build 20.19.0.v202611111946 is versionCode 90201900, the build tested. ECL product 「PhotoDirector Mobile for Android」 (from the TR). Creator WILLY_WU and [AIAgent] prefilled from the Swipe Collage batch on the same TR.")
    w("")
    w("Rules: reviewer rules 2026-10-21 — one action per Repro step, a Spec Link on every entry, at least one image per entry, the logcat excerpt on every failure- or charge-related entry, no video. No `[UX]`: `[AIAgent]` or `[AIAgent][UI]`, owner RD (Doc for copy). Spec basis check (REQ-055) done per entry: the spec is the PM Figma page only (no Design file, Q-15); QA rules (rule pass 8, system Back) are named as such in the QA notes.")
    w("")
    w(f"**What is drafted:** {len(E)} new entries (ISS-HCC-01…{len(E):02d}). {len(HELD)} items are held as PM questions (not drafted).")
    w("")
    w("Legend — Class: Functional / UI · Severity: S1 critical and blocking only, S2 important, S3 moderate, S4 minor · Owner: RD / Doc.")
    w("")
    for n, e in enumerate(E, 1):
        folder = f"{n:02d}_{e['iss']}"
        os.makedirs(f"{img_root}/{folder}")
        names = []
        for png, slug, box in e["imgs"]:
            src = f"{RUN}/screenshots/{png}.png"
            if not os.path.exists(src):
                sys.exit(f"missing screenshot {src}")
            name = f"{V}_hcc{n:02d}_{slug}.jpg"
            jpg(src, f"{img_root}/{folder}/{name}", box)
            names.append(name)
        if e.get("log"):
            title, secs = e["log"]
            p = excerpt(n, e["iss"], title, secs)
            shutil.copy(p, f"{img_root}/{folder}/")
            names.append(os.path.basename(p))
        tag = "[AIAgent]" + ("" if e["cls"] == "Functional" else f"[{e['cls']}]")
        short = f"{PROD} {V} - {tag} {FEAT}: {e['short']}"
        if len(short) > 140:
            sys.exit(f"{e['iss']} short description {len(short)} > 140")
        e["_short"] = short
        w("---"); w("")
        w(f"## {n}. {e['iss']} — {e['title']}  ·  Class: {e['cls']}  ·  Severity: S{e['sev']}  ·  Owner: {e['owner']}")
        w("")
        w(f"**Report step:** {', '.join(e['cases'])}  ·  **Reproduce:** {e['rep'][0]}/{e['rep'][1]}  ·  **Verified on:** {V}.{B}")
        w("")
        w(f"> **QA note — not pasted into eBug.** {e['note']}")
        w("")
        w("**Short Description:**"); w(""); w("```"); w(short); w("```"); w("")
        w("**Description:**"); w(""); w("```"); w("Repro Steps:")
        for i, s in enumerate(e["steps"], 1):
            w(f"{i}. {s}")
        w(f"{len(e['steps']) + 1}. Check the result")
        w(""); w("Result:"); w(e["res"]); w(f"摘要：{e['res_zh']}"); w(" ".join("{" + x + "}" for x in names))
        w(""); w("Expect Result:"); w(e["exp"]); w(f"摘要：{e['exp_zh']}")
        w(""); w("Note:"); w(DEVICE)
        for l in e["links"]:
            w(l)
        for r in e.get("rel", []):
            w(r)
        w("<Claude Reviewed>"); w("```"); w("")
        w(f"**Images:** `{NAME}_images/{folder}/`"); w("")

    w("---"); w("")
    w("# Held — PM questions (not drafted)")
    w("")
    w("| Item | Kind | What to decide |")
    w("|---|---|---|")
    for k, d, q in HELD:
        w(f"| {k} | {d} | {q} |")
    w("")
    w("# Not raised (observations, for the record)")
    w("")
    w("| Item | What was seen | Why not raised |")
    w("|---|---|---|")
    for k, a, b in OBS_NOT:
        w(f"| {k} | {a} | {b} |")
    bd = {}
    for r in blocked:
        bd[r["Disposition"]] = bd.get(r["Disposition"], 0) + 1
    w(f"| Blocked ({len(blocked)}) | " + ", ".join(f"{v} {k}" for k, v in sorted(bd.items())) + " | No verdict; reasons in report.md. TC-006 / TC-087 / TC-007 are blocked by ISS-HCC-01. |")
    w("")
    w("# Reconciliation against the run")
    w("")
    nq = sum(1 for f in fails if disp[f] == "question")
    w(f"{len(fails)} Fail ({len(fails) - nq} defect, {nq} question), {len(blocked)} Blocked, {tally.get('Not run', 0)} Not run, {len(obs)} observations (O-1 … O-{len(obs)}).")
    w("")
    w("| Item | Result | Disposition | Became |")
    w("|---|---|---|---|")
    for k in fails:
        w(f"| {k} | Fail | {disp[k]} | {MAP[k]} |")
    for k in obs:
        w(f"| {k} | observation | — | {MAP[k]} |")
    w("")
    w("Filing order by severity: " + ", ".join(f"**{i}**" for s in (1, 2, 3, 4) for i, e in enumerate(E, 1) if e["sev"] == s) + ". Nothing is filed until the review page's decisions come back.")
    w("")
    open(f"{OUT}/{NAME}.md", "w", encoding="utf-8").write("\n".join(L))
    json.dump({e["iss"]: {"cases": e["cases"], "why": e["title"]} for e in E}, open(f"{OUT}/entries.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"wrote {len(E)} entries, {len(HELD)} held → {OUT}/{NAME}.md")


if __name__ == "__main__":
    main()
