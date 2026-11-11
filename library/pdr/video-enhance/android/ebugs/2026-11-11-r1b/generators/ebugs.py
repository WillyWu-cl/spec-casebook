#!/usr/bin/env python3
"""Build the second Video Enhance Android eBug batch for round R1 (table v4, draft 20261110-160000) on 16.9.0 (2611091).

Copied from ebugs/2026-11-10-r1/generators/ebugs.py and rewritten for batch r1b (2026-11-11). Writes
library/pdr/video-enhance/android/ebugs/2026-11-11-r1b/20261111_eBug_drafts_Video-Enhance-R1b_16.9.0.md, the sibling
_images/ folder (one NN_ISS-ID folder per entry) and logs/. ISS numbering continues after ISS-VEA-15 (batch 1, filed as
DRA262611P0071 – P0085). What goes in (user, 2026-11-11; spec-casebook ebugs.md step 1, rules of 2026-11-11):
  - defects batch 1 held whose wrongness does not hang on an open question (TC-011, TC-201, TC-046 + TC-217) and the
    new defect of 2026-11-11 (TC-095);
  - every open question the run hit, filed to PM for a decision (BugBelong PM, Class UI for text, Functional for
    behaviour), one eBug per question; TC-162 is judged a question (Q-11), see its QA note;
  - questions already answered by a ruling or ticket (either OS) are cited, not filed (CITED).
Every Fail row of results.csv and every observation O-n is mapped (batch 1 BugCode / this batch / cited / not raised);
the script stops when one is missing. Nothing is filed.
"""
import csv, importlib.util, json, os, re, shutil, subprocess, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import logx

REPO = logx.REPO
ROOT = f"{REPO}/library/pdr/video-enhance/android"
RUN = logx.RUN
OUT = f"{ROOT}/ebugs/2026-11-11-r1b"
B1 = f"{ROOT}/ebugs/2026-11-10-r1"
NAME = "20261111_eBug_drafts_Video-Enhance-R1b_16.9.0"
V, B, TR = "16.9.0", "2611091", "TR261109-0041"
TAG = "AIAgent"
FEAT = "AI Video Enhance"
DEVICE = "Device: Samsung SM-A5360 (Galaxy A53 5G) / Android 15"
D10, D11 = "2026-11-10", "2026-11-11"
HDR = f"# PowerDirector Mobile for Android {V} ({B}), Stage server, Samsung SM-A5360 / Android 15 (phone time, UTC+8)"

DS_URL = "https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance"
PM_URL = "https://www.figma.com/design/mppB4GYkuVMVvHrdBeSAAU/AI-Video-Enhance"
DSB = {"ds-main-flow": ("Main Flow (Free user → IAP)", "3293-13054"), "ds-routing": ("Routing Logic", "3293-14560"),
       "ds-entry-points": ("Entry Points", "3293-14642"), "ds-alt-exception": ("Alternative & Exception", "3293-15052"),
       "ds-ai-video-enhance": ("AI Video Enhance (settings)", "3300-32003"), "ds-cancel": ("Cancel", "3396-20438")}
PMB = {"pm-main-flow": ("主線 - 選片到拿到成品", "369-438"), "pm-failure-refund": ("失敗與退款", "369-441"),
       "pm-draft-logic": ("Logic 補充 · 對齊 Design 26.09 v2 (9/29)", "405-1108"), "pm-timeline": ("Timeline 入口", "369-440")}


def ds(b, what=None, node=None):
    t, n = DSB[b]
    return f"Spec Link: AI Video Enhance Design spec (Video Enhance, section AI Video Enhance_26.09_v2), {t} board{(' ' + what) if what else ''} -\n{DS_URL}?node-id={node or n}"


def pm(b, what=None):
    t, n = PMB[b]
    return f"Spec Link: AI Video Enhance PM spec, {t} board{(' ' + what) if what else ''} -\n{PM_URL}?node-id={n}"


L1 = "Launch the APP"
OPEN = [L1, "Tap 「Video Enhance」 on the Launcher"]
COMBOS = [f"TC-{n}" for n in range(219, 255)]

# kind: "defect" (filed as a bug) or "pm" (an open question filed to PM for a decision)
E = [
 dict(iss="ISS-VEA-16", kind="defect", title="The Demo page description is AI Reframe's text, not a description of Video Enhance",
      cls="UI", sev=2, owner="PM", cases=["TC-011"], rep=(2, 2),
      short="Demo page description is AI Reframe's text, not Video Enhance's",
      note="Held in batch 1 (PQ-4); filed under the 2026-11-11 rule (a visible defect is filed, not held). R-007 (Design ds-main-flow Demo frame and PM pm-draft-logic A1 [衝突]). The app's tv_sub_title reads AI Reframe's description, which is plainly another feature's text whatever Q-1 decides. Owner PM by the text rule (user, 2026-11-11): the Design frame itself carries the same AI Reframe sentence, so the spec's own text must change before RD can fix the app; PM A1's proposal is quoted as a proposal. This entry also carries Q-1 (not filed separately). Seen on the first Demo page of R1-a and again after the TC-014 reset (2026-11-11).",
      steps=OPEN + ["Read the description under the title 「AI Video Enhance」 on the Demo page"],
      res="The Demo page describes AI Reframe: 「AI reframe your video for any aspect ratio, then fine-tune the crop in real time.」",
      res_zh="Demo 頁說明文字為 AI Reframe 的文案，並非 Video Enhance 的說明。",
      exp="It describes Video Enhance (PM A1 proposal: 「Make blurry, noisy or dark videos look sharp and clear.」; Q-1).",
      exp_zh="說明文字應描述 Video Enhance（PM 提案文案見上，Q-1）。",
      imgs=[("TC-001-demo", "vea16_demo_reframe_text")],
      links=[ds("ds-main-flow", "(Demo page frame: the description is AI Reframe's text)"), pm("pm-draft-logic", "(A1 [衝突]: proposed description)")]),

 dict(iss="ISS-VEA-17", kind="withdrawn",
      verdict="Withdrawn by QA while drafting (2026-11-11): the Android dedupe found DRA242410-0142 (Close, fixed in 15.1.0.2503311): its Expect is 「Back to the launcher page after tapping the back button on media picker page」 (after Try It Now), RD root cause 「Spec changed」 with the Recent-task back-behaviour Figma (FrPuLszSNVy2r6Vs1CKMgc). The app does what that fix made it do, so Q-9 is answered by a same-OS ticket and the rows cite it instead (ebugs.md step 1: a question a ticket already answers is cited, not filed). Kept here with its full body so it is not drafted again; reopen only if the user decides the 26.09 Design overrides that ruling.", title="On Add Media opened from the Demo page, ‹ and system Back skip the Demo page",
      cls="Functional", sev=2, owner="RD", cases=["TC-201", "TC-021"], rep=(3, 3),
      short="‹ and system Back on Add Media skip the Demo page it was opened from",
      note="Held in batch 1 (PQ-6); filed under the 2026-11-11 rule, as the user listed TC-201. R-014 (Design ds-main-flow Add Media ‹: back to the page Add Media was opened from; the Design draws no arrow, Q-9) and R-190 (system Back does what ‹ does). Add Media opened with 「Try It Now」 on the Demo page: system Back returned to AI Magic (Demo opened from AI Magic) and to the Launcher on the retry (opened from the Launcher); ‹ (top_toolbar_back) returned to the Launcher (TC-021). Reviewer: system Back does the same as ‹ here, so whether this is wrong rests on where ‹ should go (Q-9); if you read it so, switch Belong to PM (the Expect already names Q-9). Ran before TC-013 turned the Demo page off.",
      steps=OPEN + ["Tap 「Try It Now」 on the Demo page", "Press system Back on Add Media", "Tap 「Video Enhance」 on the Launcher", "Tap 「Try It Now」 on the Demo page", "Tap the back button ‹ on Add Media"],
      res="Both system Back and ‹ on Add Media leave to the Launcher (or AI Magic), skipping the Demo page that opened it.",
      res_zh="從 Demo 頁進入 Add Media 後，系統返回或 ‹ 都直接回首頁（或 AI Magic），跳過 Demo 頁。",
      exp="‹ and system Back return to the Demo page, the page Add Media was opened from (R-014; Q-9: no arrow drawn).",
      exp_zh="‹ 與系統返回應回到開啟 Add Media 的 Demo 頁（Q-9）。",
      imgs=[("TC-201", "vea17_back_to_ai_magic"), ("TC-201-retry", "vea17_back_to_launcher"), ("TC-021", "vea17_arrow_back_to_launcher")],
      links=[ds("ds-main-flow", "(Add Media back ‹; Demo page 「Try It Now」 → Add Media)")]),

 dict(iss="ISS-VEA-18", kind="defect", title="Dragging one trim handle onto the other leaves a selection under 1 s (「00:00」, priced as 1 s)",
      cls="Functional", sev=2, owner="RD", cases=["TC-046", "TC-217", "O-27"], rep=(3, 3),
      short="Trim handles can meet, leaving a 「00:00」 selection under the 1 s minimum",
      note="Held in batch 1 (PQ-7); filed under the 2026-11-11 rule (a selection going under the spec's minimum is the rule's own example). R-035 (PM pm-draft-logic B1 [建議]: the shortest selection is 1 s, whichever handle is dragged), named as a PM proposal. ve-0130-1080p60 (01:30, Enhance 180): the right handle dragged onto the left one (TC-046) and the left onto the right (TC-217) both stop with the handles touching, 「Selected Length」 「00:00」 and 「Enhance 2」 (2 credits per second = one billed second). The panel truncates lengths (02:30.05 reads 02:30, ISS-VEA-05 / DRA262611P0075), so 「00:00」 is under 1 s. O-27: the same in every R1-g1 row on the 3.2 s video (「Enhance <rate × 1>」). No task was sent at 00:00.",
      steps=OPEN + ["Tap a 1:30 1080p 60 fps video in Add Media", "Drag the right trim handle left onto the left handle", "Read 「Selected Length」 and the CTA", "Drag the right trim handle back to the end", "Drag the left trim handle right onto the right handle", "Read 「Selected Length」 and the CTA"],
      res="With the handles touching, 「Selected Length」 reads 「00:00」 and the CTA 「Enhance 2」 (one billed second).",
      res_zh="兩個裁切把手可以疊在一起，選取長度顯示「00:00」，價格以 1 秒計。",
      exp="The handles stop 1 s apart, so the selection is never under 「00:01」 (PM B1 proposal, R-035).",
      exp_zh="兩把手應至少相距 1 秒，選取長度不得小於 1 秒（PM B1 提案）。",
      imgs=[("TC-046-held", "vea18_right_handle_0000"), ("TC-217-held", "vea18_left_handle_0000"), ("TC-046", "vea18_after_release")],
      links=[pm("pm-draft-logic", "(B1 [建議]: shortest selection 1 s)"), ds("ds-ai-video-enhance", "(trim handles)")]),

 dict(iss="ISS-VEA-19", kind="defect", title="After a successful Pro purchase no 「You're all set」 / 「Your purchase was successful.」 dialog appears",
      cls="Functional", sev=2, owner="RD", cases=["TC-095"], rep=(1, 1),
      short="Pro purchase succeeds but no 「You're all set」 dialog is shown",
      note="New on 2026-11-11 (TC-095 rerun, purchase approved by the user; Google Play test card). R-074 (Design ds-main-flow arrows 3293-13678: purchase sheet → 「You're all set」 dialog, and 3293-13679: its 「OK」 → panel). Free account, ve 15:01 panel (05:00 selected, Sharp), 「Unlock Pro to Enhance」 → 「PowerDirector Pro」 → 「Continue」 → Play sheet 「PowerDirector Yearly Subscription」 → Subscribe 09:30:44. Logcat: onPurchasesUpdated 09:30:48, UpdateUserTransaction 200 OK, doVerifySubscribe OK; acknowledgePurchaseResponse 0 and, 21 ms later, a second call answered 2 「Server error, please try again.」 (whether it is the cause is for RD). The IAP page closed straight back to the panel (only a ~0.4 s spinner); no dialog, no 「OK」. Everything else as specified: Mine 「Pro」, +100 Monthly Credit Bonus, selection and Sharp kept, CTA 「Enhance ◆ 301」, nothing sent (R-075). Reproduce 1/1: one purchase only.",
      steps=[L1, "Sign in with a Free account", "Tap 「Video Enhance」 on the Launcher", "Tap a 15:01 video in Add Media", "Tap 「Unlock Pro to Enhance」", "Tap 「Continue」 on the 「PowerDirector Pro」 page", "Tap 「Subscribe」 on the Google Play sheet", "Wait 10 seconds"],
      res="The purchase succeeds (Mine reads Pro) but the app goes straight back to the panel; no 「You're all set」 dialog or 「OK」.",
      res_zh="購買成功（帳號已變為 Pro），但直接回到設定面板，沒有出現「You're all set」購買成功對話框。",
      exp="「You're all set」 / 「Your purchase was successful.」 shows; its 「OK」 returns to the panel (arrows 3293-13678 / 13679).",
      exp_zh="購買完成後應顯示「You're all set」成功對話框，按 OK 回到面板。",
      imgs=[("TC-095-sheet", "vea19_play_sheet"), ("TC-095-step2", "vea19_no_success_dialog"), ("TC-095-tier-after", "vea19_pro_after_purchase")],
      log=("Pro purchase: Play result, transaction, verify, acknowledge", [("TC-095 Subscribe to panel", D11, "09:30:40", "09:31:10", r"onPurchasesUpdated|acknowledgePurchaseResponse|doUpdateUserTransaction|doVerifySubscribeResponse")]),
      links=[ds("ds-main-flow", "(arrow 3293-13678: purchase sheet → 「You're all set」)", "3293-13678"), ds("ds-main-flow", "(arrow 3293-13679: 「OK」 → panel)", "3293-13679")]),

 # ---------------------------------------------------------------- open questions filed to PM for a decision
 dict(iss="ISS-VEA-20", kind="pm", title="「Don't show again」 ticked and left with ‹ still turns the Demo page off (PM decision)",
      cls="Functional", sev=2, owner="PM", cases=["TC-013"], rep=(1, 1),
      short="「Don't show again」 ticked then left with ‹ still turns the Demo page off",
      note="Held in batch 1 (PQ-5); filed to PM under the 2026-11-11 rule. R-010 is PM pm-draft-logic A1 [建議] (only 「Try It Now」 saves the tick); the Design ds-routing says only 「勾 Don't show again 後不再出現」 (no word on ‹). The app may be right, so this asks PM. Side effect in the run: the Demo page stayed off until the TC-014 reset (pm clear, 2026-11-11). No Q-id: the proposal is R-010. Related, not an answer: DRA252503-0298 (Android, Close, 15.1.0: after ticking 「Don't show again」, ‹ from Recent task went back to the Demo page; fix 「Finish demo activity if don't show again button is checked」) settles the Recent task path, not whether ‹ on the Demo page itself saves the tick.",
      steps=OPEN + ["Tick 「Don't show again」 on the Demo page", "Tap the back button ‹ on the Demo page", "Tap 「Video Enhance」 on the Launcher"],
      res="The tick is kept: the next 「Video Enhance」 tap opens Add Media directly, with no Demo page.",
      res_zh="勾選 Don't show again 後按 ‹ 離開，下次進入即不再顯示 Demo 頁。",
      exp="PM to decide whether leaving with ‹ saves the tick; PM A1 proposes only 「Try It Now」 saves it (R-010).",
      exp_zh="請 PM 決定：勾選後按 ‹ 離開是否應記住設定（PM A1 提案：僅 Try It Now 才記住）。",
      imgs=[("TC-013-ticked", "vea20_ticked"), ("TC-013-again", "vea20_add_media_direct")],
      links=[pm("pm-draft-logic", "(A1 [建議]: the tick is saved only with Try It Now)"), ds("ds-routing", "(「勾 Don't show again 後不再出現」)")]),

 dict(iss="ISS-VEA-21", kind="pm", title="Videos under 1 s and MKV files are not greyed in Add Media; they open the panel (Q-13)",
      cls="Functional", sev=2, owner="PM", cases=["TC-022", "TC-269"], rep=(3, 3),
      short="Videos under 1 s and MKV files are not greyed; they open the panel",
      note="Report PQ-13; filed to PM under the 2026-11-11 rule. Only TC-022 steps 4–5 and TC-269 step 1 belong here (the rest of those rows is ISS-VEA-02 / DRA262611P0072 and ISS-VEA-06 / DRA262611P0076). R-015 rests on PM pm-draft-logic A2 / E1 [建議] and the draft's 「[待確認]」 supported-source list (Q-13): under 1 s and not MP4 / MOV greyed with 「This video isn't supported. Try one up to 4K.」 (that toast's 「up to 4K」 no longer fits the 2K+ block, Q-23). ve-000050 (0.53 s) and ve-000090 (0.90 s) open the panel at 「00:00」, 「Enhance 1」; ve-mkv-720p30 opens 「30fps · 720p」 00:10. No task was sent.",
      steps=OPEN + ["Tap a 0.9 s 720p video in Add Media", "Tap the back button ‹ on the panel", "Tap a 10 s MKV video in Add Media"],
      res="Neither is greyed: the 0.9 s video opens the panel at 「00:00」, 「Enhance 1」, and the MKV at 「00:10」.",
      res_zh="不足 1 秒的影片與 MKV 檔都未反灰，皆可進入設定面板。",
      exp="PM to decide the supported sources (Q-13): PM E1 proposes greying under 1 s and non-MP4 / MOV with a toast.",
      exp_zh="請 PM 決定支援的影片來源（Q-13）：PM E1 提案不足 1 秒與非 MP4/MOV 反灰並提示。",
      imgs=[("TC-269-s1-090", "vea21_0_9s_opens"), ("TC-022-short-200x1080", "vea21_0_5s_opens"), ("TC-022-mkv2", "vea21_mkv_opens")],
      links=[pm("pm-draft-logic", "(A2 / E1 [建議], supported sources [待確認])")]),

 dict(iss="ISS-VEA-22", kind="pm", title="Switching to Professional does not re-lay the strip to 2:30 per width (Q-24)",
      cls="Functional", sev=2, owner="PM", cases=["TC-045", "TC-264"], rep=(2, 2),
      short="Switching to Professional does not re-lay the strip to 2:30 per width",
      note="Report PQ-8; filed to PM under the 2026-11-11 rule. R-034 follows the spec agent's reading of PM 9/29 ⑥ (one strip width = the active Mode's limit, re-laid on a Mode switch, REQ-008); our earlier reading of the same note was that the scale depends only on the video length. Neither is newer (Q-24), so the app may be right. ve-0800 and ve-1230 / ve-0801 trimmed to 02:00, 「Professional」: the strip stays 8:00 per width (the 02:00 frame ≈ 1/4 of the width).",
      steps=OPEN + ["Tap an 8:00 video in Add Media", "Drag the right trim handle left until 「Selected Length」 reads 「02:00」", "Tap 「Professional」", "Look at the thumbnail strip"],
      res="In Professional the strip stays at 8:00 per width; the 02:00 selection keeps about a quarter of the width.",
      res_zh="切換 Professional 後縮圖列仍為每寬 8:00，未改為每寬 2:30。",
      exp="PM to confirm PM 9/29 ⑥ (Q-24): does one strip width follow the Mode's limit (2:30 in Professional)?",
      exp_zh="請 PM 確認 9/29 ⑥（Q-24）：縮圖列寬度是否依模式上限（Professional 為 2:30）重排。",
      imgs=[("TC-045-3", "vea22_standard_0200"), ("TC-045-4", "vea22_professional_same_scale"), ("TC-264-8", "vea22_0801_professional")],
      links=[pm("pm-main-flow", "(9/29 ⑥ strip scale)"), pm("pm-draft-logic", "(B1-1 ⑥)")]),

 dict(iss="ISS-VEA-23", kind="pm", title="Dragging the selection moves the range the opposite way to the finger",
      cls="Functional", sev=2, owner="PM", cases=["O-6", "TC-043"], rep=(2, 2),
      short="Dragging the selection moves the range the opposite way to the finger",
      note="Report PQ-14 (O-6); filed to PM under the 2026-11-11 rule. R-032 (PM pm-draft-logic B1 [Design]) says a drag in the middle moves the whole range at the same length (TC-043 Pass on that) but no spec sets the direction. On ve-1230: a drag to the right made the range earlier (02:18 → 00:21 → 00:00), a drag to the left later (→ 01:57); the strip scrolls with the finger while the white frame shifts the other way on screen. This may be a scroll-the-strip design, so it is a question.",
      steps=OPEN + ["Tap a 12:30 video in Add Media", "Drag the right trim handle left until 「Selected Length」 reads 「05:41」", "Drag the middle of the selection to the right", "Read the selection's start in the Preview"],
      res="A drag to the right moves the range earlier (02:18 → 00:21), a drag to the left later; the strip follows the finger.",
      res_zh="向右拖曳選取範圍時範圍往前移（與手指方向相反），向左則往後。",
      exp="PM to decide which way a drag on the selection moves the range (R-032 sets no direction).",
      exp_zh="請 PM 決定拖曳選取範圍時的移動方向（R-032 未規定方向）。",
      imgs=[("TC-043-mid", "vea23_drag_right_earlier"), ("TC-043-left", "vea23_drag_left_later")],
      links=[pm("pm-draft-logic", "(B1: dragging the middle moves the range)"), ds("ds-ai-video-enhance", "(thumbnail strip)")]),

 dict(iss="ISS-VEA-24", kind="pm", title="The full-screen preview has no close control and always restarts at 00:00",
      cls="Functional", sev=2, owner="PM", cases=["O-5", "TC-037"], rep=(1, 1),
      short="Full-screen preview has no close control and always restarts at 00:00",
      note="Report PQ-15 (O-5a); filed to PM under the 2026-11-11 rule. R-027 (Design ds-main-flow VE · 02: the full-screen icon opens a full-screen preview); the Design draws no full-screen frame, so neither the close control nor the start point is specified. ve-023001 paused at 「00:06/02:30」, full-screen icon: the player fills the screen, a tap does nothing, it plays from 00:00 (burned-in 00:00:01.4) and only system Back leaves it (back at 「00:06/02:30」, TC-037 Pass).",
      steps=OPEN + ["Tap a 2:30 video in Add Media", "Tap play on the Preview", "Tap pause at 「00:06」", "Tap the full-screen icon", "Tap the middle of the screen"],
      res="Full screen has no close or other control (a tap does nothing) and plays from 00:00, not from the paused 00:06.",
      res_zh="全螢幕預覽沒有關閉鍵（點擊無反應），且一律從 00:00 開始播放。",
      exp="PM to decide the full-screen view: a close control, and whether it starts at the paused frame (no Design frame).",
      exp_zh="請 PM 決定全螢幕預覽：是否需要關閉鍵、是否從暫停處開始播放。",
      imgs=[("TC-037-paused", "vea24_paused_0006"), ("TC-037-full", "vea24_full_screen_no_close"), ("TC-037-full2", "vea24_full_screen_from_0000")],
      links=[ds("ds-main-flow", "(VE · 02 Preview full-screen icon)")]),

 dict(iss="ISS-VEA-25", kind="pm", title="The 「Up to 8 minutes in Standard mode」 bubble covers the Preview time and play button",
      cls="UI", sev=2, owner="PM", cases=["O-5", "TC-044"], rep=(1, 1),
      short="「Up to 8 minutes in Standard mode」 bubble covers Preview time and play",
      note="Report PQ-15 (O-5c); filed to PM under the 2026-11-11 rule. R-054 (Design ds-ai-video-enhance: the bubble when the handle reaches the limit) does not place it against the Preview bar. ve-1230 in Standard, right handle dragged to the screen edge: the bubble shows while held and after release, over the Preview's time and play button (TC-044 Pass on the bubble itself).",
      steps=OPEN + ["Tap a 12:30 video in Add Media", "Drag the right trim handle to the right screen edge", "Look at the Preview bar"],
      res="The bubble 「Up to 8 minutes in Standard mode」 sits over the Preview's time and play button.",
      res_zh="「Up to 8 minutes in Standard mode」提示泡泡蓋住預覽列的時間與播放鍵。",
      exp="PM to decide where the bubble sits so the Preview time and play stay visible (no frame places it).",
      exp_zh="請 PM 決定提示泡泡的位置，避免遮住預覽時間與播放鍵。",
      imgs=[("TC-044-h1", "vea25_bubble_covers_preview")],
      links=[ds("ds-ai-video-enhance", "(Mode 長度上限 bubble)")]),

 dict(iss="ISS-VEA-26", kind="pm", title="Android shows Pro, not Pro+: clip toolbar badge 「Pro」 and a single-plan IAP page (Q-25)",
      cls="UI", sev=2, owner="PM", cases=["TC-004", "TC-093"], rep=(1, 1),
      short="Toolbar badge reads 「Pro」, IAP page has no Pro+ tab (no Android Design)",
      note="Report PQ-10 / PQ-11; filed to PM under the 2026-11-11 rule as one question (Q-25: what Android draws for the unlock). The Design draws only iOS: R-005 the clip toolbar badge 「Pro+」 and R-072 the IAP_US page with Pro / Pro+ tabs, 「Tap to compare」 and 「Best Value」 「65% OFF」. Android sells Pro only (KP-006, team fact verified on 2611091; colleague feedback 2026-10-07, REQ-008), and the app follows that: badge 「Pro」 like Fix Shake, one 「PowerDirector Pro」 page with 「POPULAR」 「58% OFF」 (percentages are store data, KP-042). Reviewer: if you take KP-006 as the answer, hold this card and the two rows become table fixes.",
      steps=[L1, "Sign in with a Free account", "Tap 「New Project」", "Add a video to the timeline", "Tap the clip", "Tap 「Enhance」 in the clip toolbar", "Read the badge on 「AI Video Enhance」", "Tap 「AI Video Enhance」", "Tap 「Unlock Pro to Enhance」"],
      res="The badge reads 「Pro」 and the IAP page is one 「PowerDirector Pro」 page with no Pro / Pro+ tabs and no 「Tap to compare」.",
      res_zh="工具列標示「Pro」，購買頁只有單一 PowerDirector Pro 頁（無 Pro / Pro+ 分頁）。",
      exp="PM to confirm the Android badge and purchase page; the Design draws only iOS (「Pro+」, Pro / Pro+ tabs; Q-25).",
      exp_zh="請 PM 確認 Android 的標章與購買頁；Design 只畫了 iOS 版本（Q-25）。",
      imgs=[("TC-004-enhance-free", "vea26_badge_pro"), ("TC-093-yearly", "vea26_single_pro_page")],
      links=[ds("ds-entry-points", "(Timeline_default: clip toolbar 「Pro+」 badge)"), ds("ds-main-flow", "(IAP_US: Pro / Pro+ tabs)")]),

 dict(iss="ISS-VEA-27", kind="pm", title="「Leave」 during the upload is charged, although PM says nothing is charged before the upload; refunded 3 h later (Q-2)",
      cls="Functional", sev=2, owner="PM", cases=["TC-113", "O-11", "O-29"], rep=(1, 1),
      short="「Leave」 during upload charges 30 credits, then a refund comes 3 h later",
      note="Report PQ-12; filed to PM under the 2026-11-11 rule (Q-2, a string and a rule). The Design leave dialog says 「Leaving this page will cancel the process, and the credits will not be restored.」 (R-088, ds-cancel arrow 3393-18607); PM §8 says a cancel before the upload reaches the server charges nothing and creates no task, PM C4 says Leave keeps it running. TC-113 (Pass against the Design): ve-real-gopro (14.26 s, Enhance 30) Enhance 18:38:00 (create session = the charge, O-13), 「Cancel」, 「Leave」 18:38:21: −30. Then 「Generation failed, credits returned +30」 at 21:40 (O-29), so the dialog's 「will not be restored」 did not hold either. Related, not the same: DRA262611P0079 (batch 1, Home during the upload, Q-18) and the cancelled card DRA262611P0083; iOS DRI261897P0026 (Enhance disabled after Leave) is another symptom.",
      steps=OPEN + ["Tap a 14 s 1080p video in Add Media", "Tap 「Enhance」", "Tap 「Cancel」 while 「Video uploading...」 shows", "Tap 「Leave」", "Tap the Pro tab", "Tap the credit balance", "Tap 「Details」"],
      res="30 credits are taken at the Enhance tap and kept on Leave; a 「credits returned +30」 row comes about 3 h later.",
      res_zh="上傳中選 Leave 會扣 30 點且當下不退，約 3 小時後才出現退款。",
      exp="PM to decide what Leave costs (Q-2): the dialog keeps the credits, PM §8 charges nothing before the upload completes.",
      exp_zh="請 PM 決定上傳中 Leave 是否扣點（Q-2）：Design 對話框寫不退，PM §8 寫上傳完成前不扣。",
      imgs=[("TC-113-leave", "vea27_leave_dialog"), ("TC-113-history", "vea27_ledger_minus30"), ("wrapup-ledger-s2", "vea27_refund_2140")],
      log=("Leave during the upload: charge at the session, upload started, cancelled", [("TC-113 Enhance, Cancel, Leave", D10, "18:37:55", "18:38:25")]),
      links=[ds("ds-cancel", "(leave dialog; arrow 3393-18607 Leave → panel)", "3393-18607"), pm("pm-main-flow", "(§8 cancel before the upload: no charge)"), pm("pm-failure-refund")]),

 dict(iss="ISS-VEA-28", kind="pm", title="The background notification uses the banner copy, not PM's 「Your video is ready. Tap to view.」 (Q-16)",
      cls="UI", sev=2, owner="PM", cases=["TC-133"], rep=(1, 1),
      short="Notification copy is the banner's, not 「Your video is ready. Tap to view」",
      note="Report PQ-3; filed to PM under the 2026-11-11 rule (Q-16). R-103 is PM-only (pm-main-flow §9 「文案為 spec 原文」, pm-draft-logic D1 [建議]); the Design draws only the in-app banner (R-100), whose copy the notification reuses. Tapping it opened the Result (fine). Reviewer: R-103 calls §9 the spec's own text, so if PM's copy stands this is RD text (switch Belong to RD).",
      steps=OPEN + ["Tap a 3 s video in Add Media", "Tap 「Enhance」", "Press Home while the task is processing", "Wait for the system notification", "Swipe down the notification shade", "Read the PowerDirector notification"],
      res="The notification reads 「Good news! Your AI Video Enhance task has been completed. Tap here to view your results.」",
      res_zh="系統通知文案沿用 App 內橫幅文字，而非 PM 規格的通知文案。",
      exp="PM to decide the notification copy (Q-16): PM §9 「Your video is ready. Tap to view.」 or the banner text.",
      exp_zh="請 PM 決定系統通知文案（Q-16）。",
      imgs=[("TC-133-shade", "vea28_notification_copy")],
      links=[pm("pm-main-flow", "(§9 notification copy 「Your video is ready. Tap to view.」)"), ds("ds-alt-exception", "(生成完成跳通知: in-app banner)")]),

 dict(iss="ISS-VEA-29", kind="pm", title="「Save Result」 shows 「Saved to Gallery」, not 「Saved to your device」",
      cls="UI", sev=2, owner="PM", cases=["TC-152"] + COMBOS, rep=(37, 37),
      short="Save Result toast reads 「Saved to Gallery」, not 「Saved to your device」",
      note="Report PQ-1; filed to PM under the 2026-11-11 rule. The copy that fails 37 rows (TC-152 and every combination row TC-219 – TC-254; in those rows everything else passed, apart from the ledger name, cited, and O-28, DRA262611P0085). R-122: the Design (ds-routing) says only 「Save Result → 存到手機」; the toast 「Saved to your device」 is PM pm-draft-logic D3 [建議], adopted by the spec agent (TC-VE2-236, colleague feedback item 14, REQ-008). The file is saved correctly (Movies/cyberlink/PowerDirector/Video Enhance/).",
      steps=OPEN + ["Tap a 3 s video in Add Media", "Tap 「Enhance」", "Wait on Recent task until the card shows 「View」", "Tap 「View」", "Tap 「Save Result」"],
      res="The toast reads 「Saved to Gallery」.",
      res_zh="儲存結果的提示為「Saved to Gallery」。",
      exp="PM to decide the toast copy: 「Saved to your device」 (PM D3 proposal, spec agent TC-VE2-236) or 「Saved to Gallery」.",
      exp_zh="請 PM 決定儲存提示文案（PM D3 提案「Saved to your device」）。",
      imgs=[("TC-223-toast2", "vea29_saved_to_gallery")],
      links=[ds("ds-routing", "(Save Result → 存到手機)"), pm("pm-draft-logic", "(D3 [建議] toast 「Saved to your device」)")]),

 dict(iss="ISS-VEA-30", kind="pm", title="Recent task's 「Select」 offers only Delete; what 「Manage」 should open is not specified (Q-8)",
      cls="Functional", sev=2, owner="PM", cases=["TC-144"], rep=(1, 1),
      short="Recent task's 「Select」 offers only Delete; what 「Manage」 opens is unspecified",
      note="Report PQ-9; filed to PM under the 2026-11-11 rule (Q-8). R-116: the Design draws 「Manage」 beside the notice but no screen for it. The label itself (「Select」 for 「Manage」) is batch 1's DRA262611P0082 (RD); this asks only what the control should do. The app's 「Select」 turns the list into a selection mode: a checkbox per card and a bottom bar with only 「Delete」 (no download, although the notice tells users to download what they keep). Nothing was deleted.",
      steps=OPEN + ["Tap a video in Add Media", "Tap the Recent task icon at the panel's top right", "Tap 「Select」 beside the notice", "Tick one card"],
      res="Recent task turns into a selection mode whose only action is 「Delete」.",
      res_zh="Recent task 的「Select」只提供刪除，無下載等其他管理功能。",
      exp="PM to decide what 「Manage」 opens and offers (Q-8), e.g. download as well as delete.",
      exp_zh="請 PM 決定「Manage」應開啟的頁面與功能（Q-8）。",
      imgs=[("TC-144-select", "vea30_select_mode"), ("TC-144-checked", "vea30_delete_only")],
      links=[ds("ds-main-flow", "(Recent · 完成: notice with 「Manage」)")]),

 dict(iss="ISS-VEA-31", kind="pm", title="Every completed task is also written to Movies by itself, so 「Save Result」 makes a second copy",
      cls="Functional", sev=2, owner="PM", cases=["O-23", "O-21"], rep=(36, 36),
      short="Each finished task is auto-saved to Movies; Save Result makes a second copy",
      note="Report PQ-16 (O-23, with O-21); filed to PM under the 2026-11-11 rule. The Design's routing says results are stored on the cloud (Recent task) and 「Save Result → 存到手機」 (R-122); nothing says a result is written to the phone without Save Result. In R1-g every task wrote 「VideoEnhance - Nov 10 - <n> - <ms>.mp4」 into Movies/cyberlink/PowerDirector/Video Enhance/ at the 「Done」 moment (no MediaScanner scan, so not in the gallery; logcat DownloadUriTask 「URI is not absolute」, O-21), and Save Result wrote a second identical file. The Timeline entry did not (TC-162, ISS-VEA-33). Intended (a cache) or not?",
      steps=OPEN + ["Tap a 3 s video in Add Media", "Tap 「Enhance」", "Wait on Recent task until the card shows 「View」", "List Movies/cyberlink/PowerDirector/Video Enhance/ on the phone", "Tap 「View」", "Tap 「Save Result」", "List the same folder again"],
      res="A result file appears in Movies at completion without Save Result; Save Result then adds a second identical file.",
      res_zh="任務完成時結果已自動寫入 Movies 資料夾，再按 Save Result 會多存一份相同檔案。",
      exp="PM to decide whether a finished task is written to the phone only by 「Save Result」 (R-122) or also by itself.",
      exp_zh="請 PM 決定結果是否只在按 Save Result 時存到手機。",
      imgs=[("TC-152-all", "vea31_saved_listed"), ("TC-223-saved", "vea31_saved_file")],
      links=[ds("ds-routing", "(Save Result → 存到手機; results stored on the cloud)")]),

 dict(iss="ISS-VEA-32", kind="pm", title="A Timeline clip over 8:00 opens the panel capped at 08:00 instead of the 「Split clips…」 toast (Q-10)",
      cls="Functional", sev=2, owner="PM", cases=["TC-161"], rep=(1, 1),
      short="Timeline clip over 8:00 opens the panel capped at 08:00, no split toast",
      note="New on 2026-11-11 (R1-h on Pro); filed to PM under the 2026-11-11 rule (Q-10). R-058 is PM pm-draft-logic B1-1 ⑦ + D4 [建議] (a clip over 8:00 does not open; toast 「Split clips longer than 8 minutes first」); PM 9/29 ⑦ says the same trim rules as Add Media apply, which is what the app does; no Design frame. ve-1000-1080p30 (10:00) on the timeline: the panel opens with 「Selected Length」 「08:00」 and an ⓘ 「Max 8 minutes. Drag to choose which part.」, 「Enhance ◆ 960」. Nothing charged.",
      steps=[L1, "Tap 「New Project」", "Add a 10:00 video to the timeline", "Tap the clip", "Tap 「Enhance」 in the clip toolbar", "Tap 「AI Video Enhance」"],
      res="The panel opens with the selection capped at 「08:00」 (ⓘ 「Max 8 minutes. Drag to choose which part.」); no toast.",
      res_zh="超過 8 分鐘的 Timeline 片段仍可開啟面板，選取上限為 08:00，未出現分割提示。",
      exp="PM to decide (Q-10): refuse with 「Split clips longer than 8 minutes first」 (D4 proposal) or cap at 08:00 as Add Media.",
      exp_zh="請 PM 決定（Q-10）：拒絕並提示分割，或如 Add Media 限制選取 8 分鐘。",
      imgs=[("TC-161-after", "vea32_panel_capped_0800"), ("TC-161-info", "vea32_info_max_8_min")],
      links=[pm("pm-draft-logic", "(B1-1 ⑦ / D4 [建議]: clip over 8:00 does not open)"), pm("pm-main-flow", "(9/29 ⑦: same trim rules on a Timeline clip)")]),

 dict(iss="ISS-VEA-33", kind="pm", title="A Timeline task's result is not pasted back over the clip, and its 「Add to Timeline」 makes a new project (Q-11)",
      cls="Functional", sev=2, owner="PM", cases=["TC-162", "TC-165"], rep=(1, 1),
      short="Timeline task result is not pasted back; Add to Timeline makes a new project",
      note="New on 2026-11-11 (R1-h on Pro); filed to PM under the 2026-11-11 rule (Q-11). TC-162 judged a question, not a defect: PM (pm-timeline §4.1 / §9, R-131; D4 [建議]) pastes the result back over the clip with 「Applied Video Enhance」, but the Design routing note says every Enhance result is saved as a new video and 「Add to Timeline 是開一條新的 timeline，不取代原 clip」. Under the Design's answer the app is right (result kept in Recent task, Add to Timeline opens a new project), so the wrongness hangs on Q-11; the run's 31-credit charge for the 30 s clip is DRA262611P0076. TC-162: ve-0030-720p30, 「Enhance ◆ 31」 09:40:24 (charged at the tap), main-flow upload and Recent task (with ✕ back to the editor), banner 「Good news! …」 over the editor at 09:43:57; after 「Close」 the clip is unchanged, no 「Applied」 notice, no result file in Movies, logcat shows only the FCM push (no download or timeline call). TC-165: from that task's Result, 「Add to Timeline」 09:50:52 opened a new project 「Project 11-11」 holding only the result clip (the name also reuses TC-160's 「Project 11-11」; not raised: project naming is outside this feature).",
      steps=[L1, "Tap 「New Project」", "Add a 30 s video to the timeline", "Tap the clip", "Tap 「Enhance」 in the clip toolbar", "Tap 「AI Video Enhance」", "Tap 「Enhance」", "Tap ✕ on Recent task", "Wait in the editor for the completion banner", "Tap 「Close」 on the banner", "Look at the clip on the timeline", "Tap the clip", "Tap 「Enhance」 in the clip toolbar", "Tap 「AI Video Enhance」", "Tap the Recent task icon at the panel's top right", "Tap 「View」 on the new card", "Tap 「Add to Timeline」"],
      res="The clip is not replaced, no 「Applied Video Enhance」 shows; 「Add to Timeline」 opens a new project with the result.",
      res_zh="Timeline 任務完成後原片段未被取代、無 Applied 提示；Add to Timeline 另開新專案。",
      exp="PM to decide (Q-11): paste back with 「Applied Video Enhance」 (PM §4.1 / §9) or a new video and project (Design note).",
      exp_zh="請 PM 決定（Q-11）：結果回貼原片段，或如 Design 註記另存新片並開新 timeline。",
      imgs=[("TC-162-done-1", "vea33_banner_in_editor"), ("TC-162-after-close", "vea33_clip_not_replaced"), ("TC-165-after", "vea33_add_to_timeline_new_project"), ("TC-165-projects", "vea33_projects_list")],
      log=("Timeline task: charge at the tap, upload, completion only as a push", [("TC-162 Enhance and upload", D11, "09:40:20", "09:41:00"), ("TC-162 completion in the editor", D11, "09:43:50", "09:45:00", r"pdr://ai_video_enhance")]),
      links=[pm("pm-timeline", "(§4.1 / §9 「背景生成成功後回貼到原片段並通知，顯示 Applied Video Enhance」)"), ds("ds-routing", "(「Add to Timeline 是開一條新的 timeline，不取代原 clip」)")]),
]

E = [e for e in E if e["kind"] != "withdrawn"] + [e for e in E if e["kind"] == "withdrawn"]

# Questions the run hit that a ruling or ticket already answers: cited on the review page, not filed.
CITED = [
 ("Credit Details name 「Video Enhancer」 (R-203)", COMBOS, "DRI261895P0021",
  "iOS ticket (PDR-I 16.9.0, BugBelong PM): Credit Details service name 「Video Enhancer」 vs 「AI Video Enhance」; status QA Propose Won't Fix. The IF3 API exposes no status log for it (ecl_query.py bug --log, TSR.EbugLogAndData: no comments), and the web page needs a sign-in, so the reason was not read; the status itself is QA proposing to keep 「Video Enhancer」. Same server ledger string on Android (every R1 debit). Not filed; the 36 combination rows cite it."),
 ("Q-18 backgrounding during the upload", ["TC-115"], "DRA262611P0079",
  "Filed in batch 1 (F-9, BugBelong PM by the user's decision): Home during the upload charges 30, refunded 3 h later. The PM decision Q-18 asks for is that ticket."),
 ("Q-23 2K+ rejection message", ["TC-022"], "DRA262611P0072",
  "Filed in batch 1 (F-2): 1440p, 4K and 8K are not rejected, so the message Q-23 asks about cannot appear yet; the ticket names Q-23."),
 ("Q-17 processing card 「n minutes left」 (O-12)", ["O-12"], "DRA262608-0072 / DRA262608-0071",
  "Open Android tickets (NewCreated, BugBelong PM, 16.6.0): static 「4 minutes left」 and zero progress (dedupe.txt, batch 1)."),
 ("Q-1 Demo page description", ["TC-011"], "ISS-VEA-16 (this batch)",
  "Carried by the TC-011 defect card (owner PM: the Design frame's text must change); not a second card."),
 ("Q-9 Back from Add Media (TC-201 defect withdrawn, ISS-VEA-17)", ["TC-021", "TC-201"], "DRA242410-0142",
  "Android ticket, Close (fixed 15.1.0.2503311): Back on the media picker opened with Try It Now goes to the Launcher, not the Demo page; RD root cause 「Spec changed」 (Recent-task back-behaviour Figma FrPuLszSNVy2r6Vs1CKMgc). The app does exactly that, and system Back matches ‹. Not filed; ISS-VEA-17 is kept withdrawn in the drafts."),
]

# Observations / items not raised (beyond batch 1's list, which still holds for O-1 … O-31)
OBS_NOT = [
 ("O-1", "Mine › Credits read 「--」 right after the subscription", "Self-healed (KP-067)."),
 ("O-4", "First-run bubble not seen in R1-a screenshots", "TC-030 Pass from logcat."),
 ("O-16", "+2000 credit pack from another device on the shared account", "Account note."),
 ("O-17", "R1-f ledger rows match", "Account note."),
 ("O-20", "Completion banner waits on the Launcher until Close", "As R-102."),
 ("O-22", "`lbl Pro` matched New Project (script)", "Setup note."),
 ("O-24", "Saved files 3.285 s for a 3.233 s source", "Within a frame."),
 ("O-25", "Pro tab balance lags one charge", "Credit Details right."),
 ("O-30", "Pro test subscription ended 22:34–22:37", "Environment."),
 ("O-31", "Panel badge 「0fps」 for a Timeline clip whose file is gone", "Missing source; not judged."),
 ("O-32", "Balance +30 after the TC-014 reset and sign-in (28749 → 28779)", "Credit Details: 「Loyalty Credit Bonus (for PowerDirector Subscribers) +30」 2026/11/11 09:55, a server subscriber bonus on sign-in; not a finding."),
]
OBS_ALL = [f"O-{i}" for i in range(1, 33)]


def batch1():
    """{case: 'F-n DRA… (ISS-VEA-nn)'} for everything batch 1 filed."""
    spec = importlib.util.spec_from_file_location("ebugs_b1", f"{B1}/generators/ebugs.py")
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    codes = {x["iss"]: x["bugcode"] for x in json.load(open(f"{B1}/filed_bugcodes.json", encoding="utf-8"))["bugs"]}
    out = {}
    for e in m.E:
        for c in e["cases"]:
            out.setdefault(c, []).append(f"filed {codes[e['iss']]} ({e['iss']})")
    return out, codes


def jpg(src, dst):
    subprocess.run(["sips", "-Z", "1400", "-s", "format", "jpeg", "-s", "formatOptions", "80", src, "--out", dst],
                   check=True, capture_output=True)


def build_map(fails, b1):
    m = {}
    for c, v in b1.items():
        m.setdefault(c, []).extend(v)
    for n, e in enumerate(E, 1):
        for c in e["cases"]:
            m.setdefault(c, []).append(f"{n}. {e['iss']}" + {"pm": " (PM decision)", "withdrawn": " (withdrawn)"}.get(e["kind"], ""))
    for title, items, code, _ in CITED:
        for c in items:
            m.setdefault(c, []).append(f"cited: {title} → {code}")
    m.setdefault("O-10", []).append("not reached")
    for k, _, why in OBS_NOT:
        m.setdefault(k, []).append("not raised")
    return {k: "; ".join(dict.fromkeys(v)) for k, v in m.items()}


def main():
    rows = list(csv.DictReader(open(f"{RUN}/results.csv", encoding="utf-8-sig")))
    tally = {}
    for r in rows:
        tally[r["Result"]] = tally.get(r["Result"], 0) + 1
    fails = [r["ID"] for r in rows if r["Result"] == "Fail"]
    disp = {r["ID"]: r["Disposition"] for r in rows}
    blocked = [r for r in rows if r["Result"] == "Blocked"]
    obs_file = open(f"{RUN}/observations.md", encoding="utf-8").read()
    obs = [o for o in OBS_ALL if re.search(rf"^- {o} \(", obs_file, re.M)]
    if len(obs) != len(OBS_ALL):
        sys.exit(f"observations found: {obs}")
    b1, codes = batch1()
    MAP = build_map(fails, b1)
    missing = [k for k in fails + obs if k not in MAP]
    if missing:
        sys.exit(f"reconciliation incomplete: missing {missing}")
    # every Fail (question) row must reach a PM card or a citation (rule of 2026-11-11)
    q_unfiled = [k for k in fails if disp[k] == "question" and not re.search(r"PM decision|cited:", MAP[k])]
    if q_unfiled:
        sys.exit(f"Fail (question) rows with no PM card or citation: {q_unfiled}")

    img_root = f"{OUT}/{NAME}_images"
    if os.path.isdir(img_root):
        shutil.rmtree(img_root)
    os.makedirs(img_root)
    os.makedirs(f"{OUT}/logs", exist_ok=True)
    L = []
    w = L.append
    nd = sum(1 for e in E if e["kind"] == "defect")
    npm = sum(1 for e in E if e["kind"] == "pm")
    nw = len(E) - nd - npm
    w(f"# AI Video Enhance (Android) — eBug drafts, round R1 batch 2 (table v4), PDR-A {V} build {B}")
    w("")
    w(f"**Source:** pdr-spec-casebook run `library/pdr/video-enhance/android/runs/2026-11-10-r1-full/` — round R1 of draft `drafts/20261110-160000` (table v4, {len(rows)} cases), 2026-11-10 17:10 → 22:51 plus the paid reruns of 2026-11-11 09:27 → 09:59 (TC-095 purchase, R1-h Timeline rows, TC-014 reset) on {DEVICE[8:]}, {TR} (SR DRA261109-01), Stage server, account cltqauiap2@gmail.com. Tally now: " + ", ".join(f"{v} {k}" for k, v in tally.items()) + ".")
    w("")
    w(f"**Status:** nothing filed, uploaded or commented. Batch 1 (`ebugs/2026-11-10-r1`) is filed as {codes['ISS-VEA-01']} – {codes['ISS-VEA-15']} (ISS-VEA-01 … 15); nothing here repeats it. The review page prefills the filing account from it (`ebug-defaults.ts pdr/video-enhance android`). Dedupe was read-only, Android pool only (per OS).")
    w("")
    w("Rules (2026-11-11, spec-casebook `ebugs.md` step 1, `ebug-draft-generator` › Owner, overlay rule 5): a visible defect is filed even when its exact expected wording is a PM proposal or open question (the Expect names the Q-id); an open question the run cannot settle is filed to PM (BugBelong PM, Class UI for text, Functional for behaviour), one eBug per question, with its rows on the `Report step:` line; a question a ruling or ticket already answers (either OS) is cited, not filed. Text: RD when the spec states it, PM when the spec's own text must change. Reviewer rules 2026-10-21 (one action per step, a Spec Link and an image on every entry, the logcat excerpt on every failure- or charge-related one, no video, no `[UX]`). Every severity is proposed as 2, as the user decided for batch 1.")
    w("")
    w(f"**What is drafted:** {nd + npm} entries to file, numbered 1–{nd + npm} in this batch (trust the ISS-ID across batches): {nd} defects (entries 1–{nd}) and {npm} open questions filed to PM for a decision (entries {nd + 1}–{nd + npm}); then {nw} withdrawn by QA (ISS-VEA-17, TC-201: a closed Android ticket already decided the behaviour). {len(CITED)} questions are cited instead of filed.")
    w("")
    w("Legend — Class: Functional / UI · Severity: S1 critical and blocking only, S2 important, S3 moderate, S4 minor · Owner: RD or PM. Every entry links the Figma board it rests on.")
    w("")
    for n, e in enumerate(E, 1):
        folder = f"{n:02d}_{e['iss']}"
        os.makedirs(f"{img_root}/{folder}")
        names = []
        for png, slug in e["imgs"]:
            src = f"{RUN}/screenshots/{png}.png"
            if not os.path.exists(src):
                sys.exit(f"missing screenshot {src}")
            name = f"{V}_{slug}.jpg"
            jpg(src, f"{img_root}/{folder}/{name}")
            names.append(name)
        if e.get("log"):
            title, secs = e["log"]
            p = logx.excerpt(f"{OUT}/logs/{V}_vea{e['iss'][-2:]}_log.txt", f"{e['iss']} {title}", HDR, secs)
            shutil.copy(p, f"{img_root}/{folder}/")
            names.append(os.path.basename(p))
        tagtype = "" if e["cls"] == "Functional" else f"[{e['cls']}]"
        short = f"PDR-A {V} - [{TAG}]{tagtype} {FEAT}: {e['short']}"
        if len(short) > 125:
            sys.exit(f"{e['iss']} short description {len(short)} > 125")
        for s in e["steps"]:
            if ">" in s or "›" in s:
                sys.exit(f"{e['iss']} step has a chain: {s}")
        w("---"); w("")
        if e["kind"] == "withdrawn" and not any(x.startswith("# ⛔ Withdrawn") for x in L):
            w("# ⛔ Withdrawn by QA — do not file"); w("")
            w("Kept with their full bodies so the finding is not drafted again; nothing below may be pasted or filed."); w("")
        wd = "⛔ WITHDRAWN — " if e["kind"] == "withdrawn" else ""
        w(f"## {n}. {wd}{e['iss']} — {e['title']}  ·  Class: {e['cls']}  ·  Severity: S{e['sev']}  ·  Owner: {e['owner']}")
        w("")
        cases = e["cases"]
        rs = ", ".join(cases) if len(cases) < 10 else f"{cases[0]}, {cases[1]} – {cases[-1]} ({len(cases)} rows)"
        w(f"**Report step:** {rs}  ·  **Reproduce:** {e['rep'][0]}/{e['rep'][1]}  ·  **Verified on:** {V}.{B}")
        w("")
        kind = {"pm": "**Open question filed to PM for a decision.** ", "withdrawn": f"**⛔ {e.get('verdict', '')}** "}.get(e["kind"], "")
        w(f"> **QA note — not pasted into eBug.** {kind}{e['note']}")
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
        w("<Claude Reviewed>"); w("```"); w("")
        w(f"**Images:** `{NAME}_images/{folder}/`"); w("")

    w("---"); w("")
    w("## Cited instead of filed (answered by a ruling or ticket, or carried by a card here)")
    w("")
    w("| Question | Rows | Answered by | Why not filed |")
    w("|---|---|---|---|")
    for title, items, code, why in CITED:
        its = f"{items[0]} – {items[-1]} ({len(items)} rows)" if len(items) > 5 else ", ".join(items)
        w(f"| {title} | {its} | {code} | {why} |")
    w("")
    w("## Not raised (observations, for the record)")
    w("")
    w("| Item | What was seen | Why not raised |")
    w("|---|---|---|")
    for k, a, b in OBS_NOT:
        w(f"| {k} | {a} | {b} |")
    w("| TC-165 side note | The new project reuses the name 「Project 11-11」 of an existing project | Project naming belongs to the editor, not this feature. |")
    bd = {}
    for r in blocked:
        bd[r["Disposition"]] = bd.get(r["Disposition"], 0) + 1
    w(f"| Blocked ({len(blocked)}) | " + ", ".join(f"{v} {k}" for k, v in sorted(bd.items())) + " | No verdict (reasons on the Progress page). |")
    w("")
    w("## Reconciliation against the run")
    w("")
    nq = sum(1 for f in fails if disp[f] == "question")
    w(f"{len(fails)} Fail ({len(fails) - nq} defect, {nq} question), {len(blocked)} Blocked, {len(obs)} observations (O-1 … O-{len(obs)}). Each maps to a batch 1 BugCode, an entry here, a citation, or not raised; a row may map to several (TC-022 and TC-269: the defect steps are batch 1, the source steps are ISS-VEA-21).")
    w("")
    w("### Row-by-row map")
    w("")
    w("| Item | Result | Disposition | Became |")
    w("|---|---|---|---|")
    for k in fails:
        w(f"| {k} | Fail | {disp[k]} | {MAP[k]} |")
    for k in ("TC-113", "TC-037", "TC-043", "TC-044"):
        w(f"| {k} | Pass (note) | — | {MAP[k]} |")
    for k in obs:
        w(f"| {k} | observation | — | {MAP[k]} |")
    w("")
    w("### Owner split")
    w("")
    w("| Owner | Entries |")
    w("|---|---|")
    for o in ("RD", "PM"):
        w(f"| {o} | {', '.join(str(i) for i, e in enumerate(E, 1) if e['owner'] == o and e['kind'] != 'withdrawn') or '—'} |")
    w("")
    w("### Filing order")
    w("")
    w("Defects first (" + ", ".join(f"**{i}**" for i, e in enumerate(E, 1) if e["kind"] == "defect") + "), then the PM decisions (" + ", ".join(f"**{i}**" for i, e in enumerate(E, 1) if e["kind"] == "pm") + "); the withdrawn entry is never filed. Nothing is filed until the review page's decisions come back.")
    w("")
    open(f"{OUT}/{NAME}.md", "w", encoding="utf-8").write("\n".join(L))
    print(f"wrote {len(E)} entries ({nd} defects, {npm} PM) → {OUT}/{NAME}.md")
    return MAP, fails


if __name__ == "__main__":
    main()
