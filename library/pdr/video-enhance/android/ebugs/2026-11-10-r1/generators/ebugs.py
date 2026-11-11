#!/usr/bin/env python3
"""Build the Video Enhance Android eBug draft batch for round R1 (table v4, draft 20261110-160000) on 16.9.0 (2611091).

Writes library/pdr/video-enhance/android/ebugs/2026-11-10-r1/20261110_eBug_drafts_Video-Enhance-R1_16.9.0.md, the sibling
_images/ folder (one NN_ISS-ID folder per entry: JPEGs named 16.9.0_<slug>.jpg plus the logcat excerpt where the finding
is failure- or charge-related) and logs/. First Video Enhance Android batch: ISS-VEA-01 on. Nothing is filed. Every Fail row
of results.csv and every observation O-n is mapped (entry / existing Android ticket / held PM question / not raised); the
script stops when one is missing.
"""
import csv, os, re, shutil, subprocess, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import logx

REPO = logx.REPO
ROOT = f"{REPO}/library/pdr/video-enhance/android"
RUN = logx.RUN
OUT = f"{ROOT}/ebugs/2026-11-10-r1"
NAME = "20261110_eBug_drafts_Video-Enhance-R1_16.9.0"
V, B, TR = "16.9.0", "2611091", "TR261109-0041"
TAG = "AIAgent"
FEAT = "AI Video Enhance"
DEVICE = "Device: Samsung SM-A5360 (Galaxy A53 5G) / Android 15"
DAY = "2026-11-10"
HDR = f"# PowerDirector Mobile for Android {V} ({B}), Stage server, Samsung SM-A5360 / Android 15, {DAY} (phone time, UTC+8)"

DS_URL = "https://www.figma.com/design/HceGLJVaxnKsv7gXSXzKWh/Video-Enhance"
PM_URL = "https://www.figma.com/design/mppB4GYkuVMVvHrdBeSAAU/AI-Video-Enhance"
DSB = {"ds-main-flow": ("Main Flow (Free user → IAP)", "3293-13054"), "ds-routing": ("Routing Logic", "3293-14560"),
       "ds-entry-points": ("Entry Points", "3293-14642"), "ds-alt-exception": ("Alternative & Exception", "3293-15052"),
       "ds-ai-video-enhance": ("AI Video Enhance (settings)", "3300-32003"), "ds-cancel": ("Cancel", "3396-20438")}
PMB = {"pm-main-flow": ("主線 - 選片到拿到成品", "369-438"), "pm-failure-refund": ("失敗與退款", "369-441"),
       "pm-draft-logic": ("Logic 補充 · 對齊 Design 26.09 v2 (9/29)", "405-1108")}


def ds(b, what=None, node=None):
    t, n = DSB[b]
    return f"Spec Link: AI Video Enhance Design spec (Video Enhance, section AI Video Enhance_26.09_v2), {t} board{(' ' + what) if what else ''} - {DS_URL}?node-id={node or n}"


def pm(b, what=None):
    t, n = PMB[b]
    return f"Spec Link: AI Video Enhance PM spec, {t} board{(' ' + what) if what else ''} - {PM_URL}?node-id={n}"


L1 = "Launch the APP"
OPEN = [L1, "Tap 「Video Enhance」 on the Launcher"]

E = [
 dict(iss="ISS-VEA-01", title="Launcher shortcut and AI Magic card are named 「Video Enhance」, not 「AI Video Enhance」",
      cls="UI", sev=3, owner="Doc", cases=["TC-002"], rep=(2, 2),
      short="Launcher and AI Magic name it 「Video Enhance」, not 「AI Video Enhance」",
      note="R-004 (Design ds-main-flow label 「1005_Update wording: AI Video Enhance」, newer than every PM item, which still says 「Video Enhance」) and R-002 (ds-entry-points AI Magic card). The Demo page title and the panel title already read 「AI Video Enhance」; only the two entry labels keep the old name (Launcher tv_title, AI Magic card tv_title). TC-001 passed on the Demo title; its Launcher label is this entry.",
      steps=[L1, "Read the big shortcut name on the Launcher", "Tap 「AI Magic」 in the bottom bar", "Scroll to the 「AI Enhance」 section", "Read the card name"],
      res="The Launcher shortcut and the AI Magic card read 「Video Enhance」; the Demo page is titled 「AI Video Enhance」.",
      res_zh="首頁捷徑與 AI Magic 卡片名稱為「Video Enhance」。",
      exp="Both read 「AI Video Enhance」 (Design 1005_Update wording), as the Demo page and the panel do.",
      exp_zh="兩處名稱皆應為「AI Video Enhance」（Design 1005 更新文案）。",
      imgs=[("r1a-launcher", "vea01_launcher_shortcut"), ("TC-002-section", "vea01_ai_magic_card"), ("TC-002-demo", "vea01_demo_title")],
      links=[ds("ds-main-flow", "(label 「1005_Update wording: AI Video Enhance」)"), ds("ds-entry-points", "(AI Magic card)")]),

 dict(iss="ISS-VEA-02", title="1440p, 4K and 8K sources are not rejected: each opens the panel and can be enhanced",
      cls="Functional", sev=2, owner="RD", cases=["TC-022", "O-3", "O-10"], rep=(3, 3),
      short="1440p, 4K and 8K videos open the panel instead of being rejected",
      note="R-196: user requirement of 2026-10-16 (spec agent TC-VE2-097 / TC-VE2-098, REQ-008), newer than the Design's resolution lookup and PM E1: a source of 2K or higher (1440p and up) is rejected before the panel opens. The message is not specified (Q-23), so the Expect asks only for the rejection. ve-res1440p (2560 × 1440, 5.03 s) opens 「30fps · 1440p」 with the 4K chip and 「Enhance 18」 at 3/s; ve-res4k (3840 × 2160, 5.02 s) 「30fps · 2160p」 「Enhance 15」; ve-res8k (HEVC) first shows the editor's 「Converting for Better Performance」 dialog, then a black Preview, 「0fps · 1080p」, every fps chip disabled, 「Enhance 4」. Pexels 2160p downloads are accepted too (TC-256, 「0fps · 2160p」). O-3: the 1440p and the 4K file of the same length price differently (18 vs 15, O-10 not rechecked). Steps 4–5 of TC-022 (under 1 s and MKV not greyed) are PM question Q-13, not part of this entry. Nothing was charged.",
      steps=OPEN + ["Tap a 2560 × 1440 (1440p) video in Add Media", "Tap the back button ‹ on the panel", "Tap a 3840 × 2160 (4K) video", "Tap the back button ‹ on the panel", "Tap a 7680 × 4320 (8K) video", "Tap 「OK」 on 「Converting for Better Performance」"],
      res="1440p, 4K and 8K videos all open the panel (「Enhance 18」, 「Enhance 15」, 「Enhance 4」); none is rejected.",
      res_zh="1440p、4K、8K 影片皆未被擋下，都直接進入設定面板，可送出增強。",
      exp="A 1440p or larger source is rejected before the panel opens, so no task can start.",
      exp_zh="2K 以上（含 1440p、4K、8K）的影片應在進入面板前被拒絕，無法開始任務。",
      imgs=[("TC-022-1440p", "vea02_1440p_panel"), ("TC-022-4k", "vea02_4k_panel"), ("TC-022-8k-ok", "vea02_8k_panel")],
      links=[ds("ds-main-flow", "(Add Media and VE · 01; 2K+ block: user requirement 2026-10-16)"), ds("ds-ai-video-enhance", "(預設值規則 resolution lookup)")]),

 dict(iss="ISS-VEA-03", title="Panel badge reads 「0fps」 and every fps chip is disabled for stock downloads and Timeline clips",
      cls="Functional", sev=3, owner="RD", cases=["O-2"], rep=(3, 3),
      short="Badge reads 「0fps」 and fps chips are disabled for stock and Timeline clips",
      note="R-021 (Design ds-main-flow 「1005_preview 右下加上影片的來源資訊」: the Preview's lower right shows the source frame rate and resolution) and R-043 (fps defaults from the source fps). Off-case observation O-2, seen on every source of these kinds: Pexels / Pixabay / gettyimages downloads (「0fps · 2160p」, 「0fps · 720p」), the Timeline clip ve-022999-1080p30 opened from the clip toolbar (「0fps · 1080p」), the 8K file after conversion. The same kind of local 30 fps file picked in Add Media reads 「30fps · 1080p」 with the 30fps chip selected. With 0 fps every fps chip is drawn disabled, so the output fps cannot be chosen.",
      steps=OPEN + ["Swipe the provider tab row left until 「Pexels」 shows", "Tap 「Pexels」", "Tap a Pexels video", "Read the badge at the Preview's lower right", "Read the 「fps」 chips"],
      res="The badge reads 「0fps · 2160p」 and 30fps / 60fps / 120fps are all disabled (Timeline clips: 「0fps · 1080p」).",
      res_zh="角標顯示「0fps」，30/60/120fps 全部無法點選；從 Timeline 進入的片段也一樣。",
      exp="The badge shows the source fps (「30fps · …」) and the fps chips can be chosen.",
      exp_zh="角標應顯示來源影片的 fps，fps 選項依來源正常可選。",
      imgs=[("TC-256-panel", "vea03_pexels_0fps"), ("TC-003-panel", "vea03_timeline_0fps"), ("TC-255-getty-panel", "vea03_getty_0fps")],
      links=[ds("ds-main-flow", "(VE · 01, label 「1005_preview 右下加上影片的來源資訊」)"), ds("ds-ai-video-enhance", "(預設值規則 fps lookup)")]),

 dict(iss="ISS-VEA-04", title="Preview shows no time 「00:00/<length>」 until play is tapped",
      cls="UI", sev=3, owner="RD", cases=["TC-033", "TC-215"], rep=(3, 3),
      short="Panel Preview shows no 「00:00/12:30」 time until play is tapped",
      note="R-020 (Design ds-main-flow VE · 01 / VE · 02 draw 「00:00/12:30」 in the Preview bar on entry) and R-192. On opening, preview_bar holds only iv_play and iv_full_screen; tv_preview_time appears only after play is first tapped (or the playhead is dragged), then reads e.g. 「00:01/02:30」. Seen on every panel opened in R1-b (12:30 1080p60 and 1080p30, 02:30.01).",
      steps=OPEN + ["Tap a 12:30 1080p 60 fps video in Add Media", "Read the Preview bar"],
      res="The Preview bar shows only play and full screen; no 「00:00/12:30」 until play is tapped.",
      res_zh="預覽列只有播放與全螢幕鍵，未按播放前不顯示「00:00/12:30」。",
      exp="The Preview shows 「00:00/12:30」 as soon as the panel opens.",
      exp_zh="進入面板即應顯示「00:00/12:30」。",
      imgs=[("TC-033-top", "vea04_no_preview_time"), ("TC-215-s1", "vea04_playhead_no_time"), ("TC-259-paused", "vea04_time_after_play")],
      links=[ds("ds-main-flow", "(VE · 01 / VE · 02 Preview 「00:00/12:30」)")]),

 dict(iss="ISS-VEA-05", title="Lengths are cut down while the 2:30 limit rounds up: a selection reading 「02:30」 cannot switch to Professional",
      cls="Functional", sev=3, owner="RD", cases=["TC-263", "TC-259", "O-8", "O-5"], rep=(3, 3),
      short="A selection shown as 「02:30」 cannot switch to Professional",
      note="R-053 (Design ds-ai-video-enhance Mode 長度上限: shortened to 2:30 or less, tapping Professional switches), R-056 (PM 9/29: the selection is rounded up before the comparison) and R-199 (user requirement 2026-10-21 via spec agent TC-VE2-276: the Preview total is rounded up, 150.01 s reads 「02:31」). The panel truncates every length while the price and the limit round up: ve-023001 (150.033 s) reads 「02:30」 in Selected Length and 「00:01/02:30」 in the Preview but is priced 「Enhance 302」 (151 s × 2). On ve-1230 every handle position that reads 「02:30」 is 150.x s (Enhance 302) and Professional answers with its 2:30 toast; only 「02:29」 (Enhance 300) switches. So the user is told the clip is too long while the panel shows exactly the limit. Step 1–2 of TC-263 (02:31 refused) passed. O-5b: 05:42 → 686, 02:00 → 242 (always one second over the shown length when the fraction is not zero).",
      steps=OPEN + ["Tap a 12:30 video in Add Media", "Drag the right trim handle left until 「Selected Length」 reads 「02:30」", "Tap 「Professional」"],
      res="A selection shown as 「02:30」 gets the 「Professional supports clips up to 2:30」 toast; Mode stays Standard.",
      res_zh="選取長度顯示「02:30」時點 Professional 仍跳出超過 2:30 提示，無法切換。",
      exp="A selection shown as 「02:30」 switches to Professional (shown lengths round up like the limit).",
      exp_zh="顯示「02:30」的選取應可切換 Professional，顯示長度與上限同樣進位。",
      imgs=[("TC-263-230", "vea05_selected_0230"), ("TC-263-tap2", "vea05_professional_refused"), ("TC-263-229", "vea05_0229_switches"), ("TC-259-paused", "vea05_preview_total_0230")],
      links=[ds("ds-ai-video-enhance", "(Mode 長度上限)"), pm("pm-main-flow", "(9/29 limit rule: rounded up before the comparison)")]),

 dict(iss="ISS-VEA-06", title="Videos of exactly whole seconds are billed one second more (1 s → 2, 3 s → 4, 30 s → 31, 3:00 → 181)",
      cls="Functional", sev=2, owner="RD", cases=["TC-269", "O-7", "O-19"], rep=(3, 3),
      short="Videos of exactly 1 s, 3 s, 30 s or 3:00 are billed one extra second",
      note="R-060 (Design ds-routing 「價格 = 選取秒數 × 每秒費率」; spec agent TC-VE2-175 – TC-VE2-184, ECL form 22061491221: the selected seconds rounded up × the rate; credit numbers are binding, REQ-008). Standard / Natural / 30fps / 720p = 1 credit per second. Frame-exact fixtures (ffprobe): 1.000 s → 「Enhance 2」 (expected 1), 3.000 s → 4 (3), 180.000 s → 181 (180), 30.000 s → 31 (30) — and charged so: TC-267 (ve-0030, 30.000 s) took −31 (Credit Details 19:13). Non-whole lengths are right (1.033 s → 2, 2.966 s → 3, 3.966 s → 4, 179.033 / 179.966 s → 180). Android's MediaStore reports these files 21–33 ms longer (1,033 / 3,033 / 30,033 / 180,033 ms), so the app seems to ceil the container duration. O-7: some exact 10.000 s files bill 11 or 22 depending on fps / size; O-19: Recent task cards show the same +1 s (1.000 s → 「0:02」). Step 1 of TC-269 (0.9 s not greyed) is PM question Q-13.",
      steps=OPEN + ["Tap a 720p 30 fps video exactly 1.000 s long in Add Media", "Read the CTA price", "Tap the back button ‹ on the panel", "Tap a 720p 30 fps video exactly 30.000 s long", "Tap 「Enhance」", "Tap the Pro tab", "Tap the credit balance", "Tap 「Details」"],
      res="1.000 s reads 「Enhance 2」, 3.000 s 「Enhance 4」, 3:00 「Enhance 181」; a 30.000 s video is charged 31.",
      res_zh="整秒影片多算 1 秒：1 秒收 2 點、30 秒收 31 點、3 分鐘收 181 點，實際也照此扣點。",
      exp="At 1 credit per second a 1.000 s video costs 1, 3.000 s 3, 30.000 s 30 and 3:00 180.",
      exp_zh="價格＝選取秒數（無條件進位）× 費率：1 秒 1 點、30 秒 30 點、3 分鐘 180 點。",
      imgs=[("TC-269-000100", "vea06_1s_priced_2"), ("TC-269-000300", "vea06_3s_priced_4"), ("TC-269-0300", "vea06_3min_priced_181"), ("TC-267-panel", "vea06_30s_priced_31"), ("R1-f-ledger", "vea06_ledger_minus31")],
      log=("exact-length videos billed one second more", [("TC-265 1.000 s video, Enhance 2 charged", DAY, "19:08:05", "19:08:14"), ("TC-267 30.000 s video, Enhance 31 charged", DAY, "19:13:15", "19:13:38")]),
      links=[ds("ds-routing", "(「價格 = 選取秒數 × 每秒費率」; rates: ECL form 22061491221)")]),

 dict(iss="ISS-VEA-07", title="Offline, 「Enhance」 does nothing: no message, no dialog",
      cls="Functional", sev=3, owner="RD", cases=["TC-100"], rep=(2, 2),
      short="Tapping Enhance with no network shows nothing at all",
      note="R-079 (PM pm-draft-logic C2 order Pro → network → balance; C3 [建議] toast 「Upload failed. Check your connection and try again.」). The copy is a PM proposal, so a different message would be a PM question; the finding is that there is none: both taps (18:19:27, 18:19:55) left the panel unchanged with no toast or dialog (6 screencaps over 4 s identical, dumpsys window only VideoEnhanceSetupActivity), while logcat logs getCreditRemain UnknownHostException on credit-stage. Nothing uploaded or charged (balance 27852 before and after), so only the feedback is missing. Wi-Fi turned off over USB with no mobile data; on again right after. Reviewer: hold as a PM question if you read C3 as the only basis.",
      steps=OPEN + ["Tap a short video in Add Media", "Turn Wi-Fi off", "Tap 「Enhance」", "Wait 5 seconds"],
      res="Nothing happens: no toast, no dialog; the panel stays as it was.",
      res_zh="離線時按 Enhance 完全沒有反應，沒有任何提示或對話框。",
      exp="A message says the upload cannot start; the panel stays and nothing is charged.",
      exp_zh="應提示無法上傳，面板保留且不扣點。",
      imgs=[("TC-100-before", "vea07_panel_offline"), ("TC-100-tap2", "vea07_after_tap_nothing")],
      log=("Enhance tapped twice with Wi-Fi off", [("TC-100 two Enhance taps offline", DAY, "18:19:20", "18:20:00")]),
      links=[pm("pm-draft-logic", "(C2 check order, C3 offline toast [建議])")]),

 dict(iss="ISS-VEA-08", title="Processing ring stays at 「0%」 for ~48 s, then stalls 30–40 s at a time",
      cls="Functional", sev=3, owner="RD", cases=["TC-110", "O-14"], rep=(1, 1),
      short="Processing ring sits at 0% for 48 s, then stalls 30–40 s at a time",
      note="R-085 (Design ds-main-flow VE · 03 Generating and ds-cancel: a progress ring counting up, 「Video uploading...」); the row's 「no frozen wait over 10 s」 is the table's wait rule (team rule), named as such. ve-real-0130-1080p30 (1:30 1080p30, Enhance 180): Enhance 18:24:18, ring 「0%」 18:24:20 – 18:25:08 while logcat runs a local 「Transcode」 (18:24:20.1 – 18:24:57.9) under it, then 22% and on by single percents with stalls (23% 18:25:16 – 18:26:16, 28% 18:26:54 – 18:27:14, 52% 18:29:19 – 18:29:39); the S3 upload took 9.5 min (18:24:58 – 18:34:31). A 14 s 50 fps clip also sat at 0% for its 10 s transcode. Charged at the session start, before any of it (ISS-VEA-09).",
      steps=OPEN + ["Tap a 1:30 1080p 30 fps video in Add Media", "Tap 「Enhance」", "Watch the progress ring for 5 minutes"],
      res="The ring reads 「0%」 for ~48 s, then moves by single percents with 30–40 s stalls (upload 9.5 min).",
      res_zh="進度環停在 0% 約 48 秒，之後每次停滯 30–40 秒；上傳共 9.5 分鐘。",
      exp="The ring counts up from the start of processing (「25%」 …) without a frozen wait over 10 s.",
      exp_zh="進度環應持續前進，不應停住超過 10 秒。",
      imgs=[("TC-110-p2", "vea08_ring_0pct"), ("TC-110-p8", "vea08_ring_stalled"), ("TC-110-p9", "vea08_ring_stalled_later")],
      log=("1:30 1080p task: transcode under the 0% ring, 9.5 min upload", [("TC-110 Enhance to upload done", DAY, "18:24:15", "18:34:35")]),
      links=[ds("ds-main-flow", "(VE · 03 Generating)"), ds("ds-cancel", "(processing dialog)")]),

 dict(iss="ISS-VEA-09", title="Home during the upload ends the task but charges 30 credits; the refund comes about 3 h later",
      cls="Functional", sev=2, owner="RD", cases=["TC-115", "O-13", "O-29"], rep=(1, 1),
      short="Home during upload ends the task but charges 30 credits, refunded 3 h later",
      note="R-089 (Design ds-main-flow arrow 3293-13681 and PM §8 「成功上傳＝commit 點・扣 credit」: the balance drops when the upload finishes) and R-142 / KP-007 (a failed generation refunds at once, team rule). R-090 (backgrounding = cancel, no charge) is PM C3 [建議] (Q-18; the row note says decide with the user before filing). ve-real-gopro-1080p50 (14.26 s, Enhance 30): Enhance 18:44:32, Home 18:44:35 at 0%, reopened from Recents 18:45:16: no processing dialog and no new card, as expected, but 27638 → 27608 and Credit Details 「Video Enhancer -30 / 2026/11/10 18:44」. Logcat: create session 200 at 18:44:34 (the charge, O-13: every charge is stamped at the Enhance tap, before transcode and upload), transcode on in the background until 18:44:47, then UnknownHostException 「demo.myedit.online」, no S3 upload. A 「Generation failed, credits returned +30」 row came only at 22:00 (and one at 21:40 for the TC-113 Leave task; these are the account's only two Video Enhancer −30 rows), with no app call in logcat around them: about 3 h 16 min after the charge. The task also left a failed 「Retry」 card (ISS-VEA-13). The TC-113 Leave charge itself follows the Design dialog (Q-2, PM question).",
      steps=OPEN + ["Tap a 14 s 1080p video in Add Media", "Read the credit balance on the pill", "Tap 「Enhance」", "Press Home while 「Video uploading...」 shows", "Wait 10 seconds", "Reopen PowerDirector from Recents", "Tap the Pro tab", "Tap the credit balance", "Tap 「Details」"],
      res="No task is made, but 30 credits are taken at once; the refund row appears only at 22:00, 3 h later.",
      res_zh="按 Home 後任務未上傳也沒有結果，卻立即扣 30 點；退款約 3 小時後才出現。",
      exp="Nothing is charged until the upload reaches the server; a task that never uploads costs nothing.",
      exp_zh="上傳完成前不應扣點；未上傳的任務不應扣點（或立即退款）。",
      imgs=[("TC-115-recents", "vea09_home_during_upload"), ("TC-115-back", "vea09_reopened_no_task"), ("TC-115-history", "vea09_ledger_minus30"), ("wrapup-ledger-1", "vea09_refund_2200"), ("wrapup-ledger-s2", "vea09_refund_2140")],
      log=("Home during the upload: charge at the session, background network error, no upload", [("TC-115 Enhance, Home, reopen", DAY, "18:44:30", "18:45:45"), ("no app call around the 22:00 refund", DAY, "21:58:00", "22:02:00")]),
      links=[ds("ds-main-flow", "(arrow 3293-13681: upload done → Recent task, balance drops)", "3293-13681"), pm("pm-failure-refund"), pm("pm-main-flow", "(§8 成功上傳＝commit 點・扣 credit)")]),

 dict(iss="ISS-VEA-10", title="The completion banner's 「View」 opens a black Result that never loads",
      cls="Functional", sev=2, owner="RD", cases=["TC-131"], rep=(1, 1),
      short="Completion banner's View opens a black Result page that never loads or plays",
      note="R-101 (Design ds-alt-exception arrow 3293-15875: the banner's 「View」 opens the Result of that task) and R-120 (the Result plays). Banner 「Good news! Your AI Video Enhance task has been completed. Tap here to view your results.」 on the Launcher for a 0:04 task; 「View」 tapped at once (18:39:18): Result page with 「Original」 / 「Result」, 「Save Result」, 「Add to Timeline」, 「Enhance More」, but the player stayed black with a spinner, no time label and no tab highlighted for over 75 s; play did nothing, 「Original」 was black too. Logcat: ExoPlayer Init only, no load. Recent task still showed that task 「Processing… 4 minutes left…」 at the time; opened from Recent task's 「View」 at 18:42:07 the same task loaded at once (「00:00/00:03」). KP-059 (other features): the banner is offered before the result is ready.",
      steps=OPEN + ["Tap a 3 s video in Add Media", "Tap 「Enhance」", "Tap ⌂ on Recent task", "Wait on the Launcher for the completion banner", "Tap 「View」 on the banner", "Tap play"],
      res="The Result page stays black with a spinner, no time and no tab selected for over 75 s; play and 「Original」 do nothing.",
      res_zh="從完成通知點 View 進入結果頁一直黑畫面轉圈，無法播放。",
      exp="The Result of that task opens and its video plays.",
      exp_zh="應開啟該任務結果並可正常播放。",
      imgs=[("TC-131-r6", "vea10_black_result"), ("TC-131-play", "vea10_play_nothing"), ("TC-131-fromrecent2", "vea10_same_task_from_recent")],
      log=("banner View at 18:39:18: player init, nothing loads", [("TC-131 banner View, black Result", DAY, "18:39:10", "18:42:15")]),
      links=[ds("ds-alt-exception", "(arrow 3293-15875: banner View → Result)", "3293-15875"), ds("ds-main-flow", "(result)")]),

 dict(iss="ISS-VEA-11", title="Recent task has no ‹ and system Back goes to the Launcher: nothing returns to the panel",
      cls="Functional", sev=3, owner="RD", cases=["TC-141", "TC-208", "TC-140", "O-9", "O-15"], rep=(6, 6),
      short="Recent task has no ‹ and system Back exits to the Launcher, not the panel",
      note="R-110 (Design ds-main-flow Recent · processing / Recent · 完成: back ‹ and ⌂ at the top), R-114 (arrow 3293-13718 and PM arrow 383-2678: ‹ returns to the panel) and R-190 (Android system Back does what the screen's ‹ does). Recent task draws only ⌂ (btnBack, a Home icon) at the top left; ⌂ and system Back both land on the Launcher (TC-142 Pass for ⌂). Seen every time in R1-d, R1-e and R1-f (6 times, O-9 / O-15), whether Recent task was opened from the panel's icon or by itself after an upload. The panel and its selection are lost.",
      steps=OPEN + ["Tap a video in Add Media", "Tap the Recent task icon at the panel's top right", "Look for a back button ‹ at the top left", "Press system Back"],
      res="Only ⌂ is at the top left (no ‹); system Back lands on the Launcher and the panel is gone.",
      res_zh="Recent task 只有 Home 鍵沒有返回鍵；系統返回直接回到首頁，無法回到設定面板。",
      exp="Recent task shows ‹ and ⌂; ‹ and system Back return to the panel (⌂ opens the Launcher).",
      exp_zh="Recent task 應有返回鍵與 Home 鍵；返回鍵與系統返回應回到設定面板。",
      imgs=[("TC-140-recent", "vea11_recent_home_only"), ("TC-208-back", "vea11_back_to_launcher")],
      links=[ds("ds-main-flow", "(arrow 3293-13718: Recent task ‹ → panel)", "3293-13718"), ds("ds-main-flow", "(Recent · processing / Recent · 完成)")]),

 dict(iss="ISS-VEA-12", title="Recent task notice reads 「1 year」 and offers 「Select」 instead of 「Manage」",
      cls="UI", sev=3, owner="Doc", cases=["TC-140"], rep=(3, 3),
      short="Recent task notice reads 「1 year」 and 「Select」, not 「1 Year」 and 「Manage」",
      note="R-110 (Design ds-main-flow Recent · processing / Recent · 完成: 「Tasks are stored on the cloud for 1 Year. Please download any you want to keep in local storage.」 with 「Manage」). The app reads 「…for 1 year. …」 (lower-case) with 「Select」. What 「Manage」 opens is Q-8 (TC-144, PM question: the app's 「Select」 offers only Delete); this entry is the copy only. Also a 「Create another one」 button at the bottom that the Design does not draw (not raised).",
      steps=OPEN + ["Tap a video in Add Media", "Tap the Recent task icon at the panel's top right", "Read the notice at the top"],
      res="「Tasks are stored on the cloud for 1 year. Please download any you want to keep in local storage.」 with 「Select」.",
      res_zh="提示文字為小寫「1 year」，右側按鈕為「Select」。",
      exp="「Tasks are stored on the cloud for 1 Year. Please download any you want to keep in local storage.」 with 「Manage」.",
      exp_zh="應為「…for 1 Year…」，右側按鈕為「Manage」。",
      imgs=[("TC-140-recent", "vea12_notice_select")],
      links=[ds("ds-main-flow", "(Recent · processing / Recent · 完成 notice 「Manage」)")]),

 dict(iss="ISS-VEA-13", title="A task cancelled during the upload stays in Recent task as a card of length 「3961:06:40」 with 「Retry」",
      cls="UI", sev=3, owner="RD", cases=["O-11", "O-18"], rep=(2, 2),
      short="Cancelled task leaves a card of length 「3961:06:40」 with Retry",
      note="R-140 / R-142 (Design ds-alt-exception Generation Failed and ds-routing 失敗卡片: a failed task's card shows an 「Error」 thumbnail and 「View Details」; there is no Retry) and R-111 (a card shows its video length). Both gopro tasks of R1-e that never finished uploading (TC-113 「Leave」 18:38, TC-115 Home 18:44) stay in Recent task as cards with a blank placeholder thumbnail, the length 「3961:06:40」 (not the 14 s source) and 「Retry」, no 「View Details」 (Retry not tapped). The server later treated both as failed (「Generation failed, credits returned +30」 21:40 / 22:00, ISS-VEA-09). TC-113 expects no completed result, which holds.",
      steps=OPEN + ["Tap a 14 s 1080p video in Add Media", "Tap 「Enhance」", "Tap 「Cancel」 while 「Video uploading...」 shows", "Tap 「Leave」", "Tap the Recent task icon at the panel's top right"],
      res="A card with a blank thumbnail, length 「3961:06:40」 and 「Retry」 is listed for the cancelled task.",
      res_zh="取消的任務在 Recent task 留下長度「3961:06:40」、空白縮圖並帶 Retry 的卡片。",
      exp="A failed card shows the 「Error」 thumbnail, 「View Details」 and no Retry, with a real length.",
      exp_zh="失敗卡片應顯示 Error 縮圖與 View Details（無 Retry），長度正確。",
      imgs=[("TC-113-recent", "vea13_cancelled_card"), ("TC-140-recent", "vea13_two_failed_cards")],
      links=[ds("ds-alt-exception", "(Generation Failed card)"), ds("ds-routing", "(失敗卡片)")]),

 dict(iss="ISS-VEA-14", title="Tasks take far longer than 1.5–2.5× their length: 1 s ≈ 62 s, 3.2 s ≈ 53 s, 30 s ≈ 103 s",
      cls="Functional", sev=3, owner="RD", cases=["TC-265", "TC-266", "TC-267", "O-26"], rep=(3, 3),
      short="Tasks take 53–103 s for 1–30 s videos, far over 1.5–2.5× their length",
      note="R-204: company performance standard adopted by user instruction (spec agent TC-VE2-221 – TC-VE2-223, REQ-008), a team rule, not in the Figma: from the first remaining-time display on the task's Recent task card to completion takes 1.5 – 2.5 × the selection. Standard / Natural / 30fps / 720p defaults: ve-000100 (1 s) card shown 19:08:14 → Done 19:09:18 ≈ 62 s (1.5 – 2.5 s); ve-000320 (3.2 s) card 19:11:10 → banner 19:12:03 ≈ 53 s (4.8 – 8 s); ve-0030 (30 s) card 19:13:38 → completed 19:15:21 ≈ 103 s (45 – 75 s). Logcat shows the server status 「Applying 0」 every 10 s until 「Done」. O-26: every R1-g 3.2 s task took 66 – 151 s in Standard and 208 – 544 s in Professional. Related, not duplicates (Android, 16.6 flow, PM): DRA262608-0071 / DRA262608-0072 (static 「4 minutes left」, zero progress); the static time left (O-12) is left to them.",
      steps=OPEN + ["Tap a 1 s 720p 30 fps video in Add Media", "Tap 「Enhance」", "Note the time when the task's card shows 「4 minutes left…」", "Wait on Recent task until the card shows 「View」"],
      res="1 s: ≈ 62 s; 3.2 s: ≈ 53 s; 30 s: ≈ 103 s from the first time-left display to completion.",
      res_zh="1 秒影片約 62 秒、3.2 秒約 53 秒、30 秒約 103 秒才完成，遠超標準。",
      exp="A task finishes within 1.5–2.5× its length (company standard): 1.5–2.5 s for 1 s, 45–75 s for 30 s.",
      exp_zh="依公司效能標準，完成時間應為選取長度的 1.5–2.5 倍。",
      imgs=[("TC-265-done", "vea14_1s_done_62s"), ("TC-266-banner", "vea14_3s_banner_53s"), ("TC-143-done", "vea14_30s_done_103s")],
      log=("task times: card shown → Done", [("TC-265 1 s", DAY, "19:08:05", "19:09:20"), ("TC-267 30 s", DAY, "19:13:15", "19:15:25")]),
      links=[ds("ds-main-flow", "(Recent · processing card 「4 minutes left...」; time standard: company performance rule)")]),

 dict(iss="ISS-VEA-15", title="In Professional, 「Sharp」 gives practically the same video as 「Natural」",
      cls="Functional", sev=3, owner="RD", cases=["O-28"], rep=(9, 9),
      short="In Professional, the Sharp result is practically identical to Natural",
      note="R-195 (Design ds-ai-video-enhance Settings bubbles: Sharp 「Moderate enhancement for a sharp, clear image」, sharper than Natural 「Lighter enhancement with fewer artifacts, for a more realistic look」) and R-194 (the task is made with the chosen values; analysis pass 10). Observation O-28 over the nine Professional pairs (Natural TC-219, TC-238 – TC-245 vs Sharp TC-246 – TC-254, same 3.2 s source ve-real-000320, same fps and resolution): mean Sobel edge strength over 10 frames equal to two decimals in every pair (720p 26.3 / 26.5 / 26.6, 1080p 25.3 / 25.3 / 25.4, 4K 23.9 / 24.2 / 24.3 for 30 / 60 / 120 fps), PSNR between the two 45.7 – 52.0 dB, nothing visible at 3×. In Standard the two styles differ clearly (TC-223 vs TC-230: 39.7 dB, edge 21.2 vs 22.9). Charged the same rate (R-062, right). Logcat shows no request parameters, so whether the style is not sent or the Professional model ignores it is for RD. The 18 Professional rows are recorded Fail (question) for copy only; this is an off-case observation. RD may forward to PM if Professional is meant to ignore the style.",
      steps=OPEN + ["Tap a 3 s 720p 30 fps video in Add Media", "Tap 「Professional」", "Tap 「Enhance」", "Wait on Recent task until the card shows 「View」", "Tap the back button ‹ until the panel shows", "Tap 「Professional」", "Tap 「Sharp」", "Tap 「Enhance」", "Wait on Recent task until the card shows 「View」", "Compare the two results frame by frame"],
      res="Professional Sharp and Natural results are practically identical in all nine fps × resolution pairs.",
      res_zh="Professional 模式下 Sharp 與 Natural 結果幾乎完全相同（9 組皆然）。",
      exp="Sharp gives a visibly sharper, clearer result than Natural (as it does in Standard).",
      exp_zh="Sharp 應比 Natural 明顯更銳利清晰（Standard 模式即有差異）。",
      imgs=[("TC-246-vs-TC-238", "vea15_pro_sharp_vs_natural_720p30"), ("TC-254-vs-TC-245", "vea15_pro_sharp_vs_natural_4k120"), ("TC-230-vs-natural", "vea15_std_sharp_vs_natural")],
      links=[ds("ds-ai-video-enhance", "(Settings › Enhancement style bubbles)")]),
]

# Fail (question) rows and observations held as PM / table questions: (item, kind, what to decide)
G_ROWS = [f"TC-{n}" for n in range(219, 255)]
HELD_Q = [
 ("PQ-1", ["TC-152"], "「Saved to Gallery」 vs 「Saved to your device」", "Every Save Result (TC-152 and the 36 combination rows) shows 「Saved to Gallery」; R-122's 「Saved to your device」 is PM D3 [建議]. Which copy ships?"),
 ("PQ-2", [], "Credit Details name 「Video Enhancer」 vs 「AI Video Enhance」", "Each of the 36 combination rows' debit (and every other Video Enhance charge) is named 「Video Enhancer」; R-203 (PM naming decision relayed by the spec agent, TC-VE2-174) says 「AI Video Enhance」. Ledger copy is server data: PM to confirm the name."),
 ("PQ-3", ["TC-133"], "Background notification copy", "The system notification reads the banner copy 「Good news! Your AI Video Enhance task has been completed. Tap here to view your results.」, not PM §9's 「Your video is ready. Tap to view.」 (PM-only row, Q-16). Tapping it opens the Result (fine)."),
 ("PQ-4", ["TC-011"], "Demo page description (Q-1)", "The Demo page shows AI Reframe's 「AI reframe your video for any aspect ratio, then fine-tune the crop in real time.」 — the text the Design frame also carries; PM A1 [衝突] proposes 「Make blurry, noisy or dark videos look sharp and clear.」. Held (spec basis: the Design draws what the app does), but the text is plainly another feature's: PM / Design to supply the copy, then file to Doc."),
 ("PQ-5", ["TC-013"], "「Don't show again」 saved on ‹", "The tick is saved when the Demo page is left with ‹ (R-010 PM A1 [建議] says only with Try It Now)."),
 ("PQ-6", ["TC-021", "TC-201"], "Back from Add Media skips the Demo page (Q-9)", "Both ‹ and system Back on Add Media opened from the Demo page return to the Launcher / AI Magic, skipping the Demo page. The Design draws ‹ with no arrow (Q-9); system Back does what ‹ does, so TC-201 is held with it (recorded defect)."),
 ("PQ-7", ["TC-046", "TC-217", "O-27"], "Selection shorter than 1 s", "Dragging one handle onto the other gives 「Selected Length 00:00」, priced as 1 s. The 1 s minimum is PM B1 [建議] (R-035), so held (both rows recorded defect)."),
 ("PQ-8", ["TC-045", "TC-264"], "Strip scale in Professional (Q-24)", "Switching to Professional does not re-lay the strip to 2:30 per width (stays 8:00 per width); the rule comes from the spec agent and is pending PM."),
 ("PQ-9", ["TC-144"], "What 「Manage」 opens (Q-8)", "The app's 「Select」 turns Recent task into a selection mode with only Delete (no download)."),
 ("PQ-10", ["TC-093"], "Android IAP page", "The Android page is one 「PowerDirector Pro」 page: no Pro / Pro+ tabs, no 「Tap to compare」, yearly tag 「POPULAR」 58% OFF (R-072 draws the iOS page). Android sells Pro only (KP-006): table question — make the row Android's."),
 ("PQ-11", ["TC-004"], "Clip toolbar badge 「Pro」 vs 「Pro+」", "On Free the tool carries 「Pro」 like Fix Shake; R-005's 「Pro+」 is the iOS rule (Android sells Pro, KP-006). Table question — make the row Android's."),
 ("PQ-12", [], "Leave during the upload is charged (Q-2), then refunded 3 h later", "TC-113 (Pass): 「Leave」 charged 30 as the Design dialog says (「the credits will not be restored」); PM §8 says nothing is charged before the upload reaches the server. The 30 credits then came back at 21:40 (「Generation failed, credits returned」), so the dialog's claim does not hold either. Which rule ships?"),
 ("PQ-13", [], "Under-1 s and non-MP4 sources not greyed (Q-13)", "TC-022 steps 4–5 and TC-269 step 1: 0.53 s / 0.9 s videos and an MKV open the panel (「00:00」, 「Enhance 1」), no 「This video isn't supported. Try one up to 4K.」 (PM A2 / E1 [建議] / [待確認])."),
 ("PQ-14", ["O-6"], "Dragging the selection moves it against the finger", "A drag on the selection moves the range the other way (right → earlier); the strip scrolls with the finger. No spec rule (R-032 says the range moves)."),
 ("PQ-15", ["O-5"], "Full-screen preview", "O-5a: the full-screen preview draws no close control (only system Back leaves it) and always restarts at 00:00, not at the paused frame. O-5c: the 「Up to 8 minutes in Standard mode」 bubble covers the Preview time and play."),
 ("PQ-16", ["O-23"], "Every result is also auto-saved to Movies", "Each completed task writes its result into Movies/cyberlink/PowerDirector/Video Enhance/ by itself (not media-scanned), and Save Result writes a second identical copy: two files per saved task. Intended?"),
]
OBS_NOT = [
 ("O-1", "Mine › Credits read 「--」 right after the subscription; right after a relaunch", "Self-healed; watched, not seen again."),
 ("O-4", "First-run bubble not seen in R1-a screenshots", "TC-030 Pass from logcat (bubble 3.0 s)."),
 ("O-12", "Processing card's 「n minutes left」 never counts down; list does not refresh by itself", "Matches open Android ticket DRA262608-0072 (dedupe.txt)."),
 ("O-16", "+2000 credit pack from another device on the shared account", "Account note."),
 ("O-17", "R1-f ledger rows match", "Account note."),
 ("O-20", "Completion banner waits on the Launcher until Close", "As R-102 (Close dismisses it)."),
 ("O-21", "DownloadUriTask 「URI is not absolute」 after each Done", "No visible effect (cause of O-23's auto-copy?)."),
 ("O-22", "`lbl Pro` matched New Project (script)", "Setup note."),
 ("O-24", "Saved files 3.285 s for a 3.233 s source (one frame)", "Within a frame; fps conversion right."),
 ("O-25", "Pro tab balance lags one charge", "Panel pill right at the next open; Credit Details right."),
 ("O-30", "Pro test subscription ended 22:34–22:37", "Environment (5 Timeline rows Blocked)."),
 ("O-31", "Panel badge 「0fps」 for a Timeline clip whose file is gone", "Missing source; not judged (O-2 is ISS-VEA-03)."),
]
DUPS_TXT = [("O-12", "DRA262608-0072", "NewCreated, PM, 16.6.0: Recent tasks shows a static 「4 minutes left...」 and 0% progress for the whole run"),
            ("O-12", "DRA262608-0071", "NewCreated, PM, 16.6.0: 4-second clip states 「4 minutes left」 but zero progress for 16 min")]

CAND = [
 ("ISS-VEA-01", "DRA242410-0146", "Close, 14.5.0: AI Video Enhancer wrong function name (old feature, closed; not the same label)"),
 ("ISS-VEA-08", "DRA242410-0010", "Close, 14.5.0 [CHT] credits copy (unrelated)"),
 ("ISS-VEA-10 / 15", "DRA252510-0092", "Close, 15.8.0 [Light Mode] Result icon black (unrelated)"),
 ("ISS-VEA-11 / 12", "DRA252503-0298", "Close, 15.1.0: ‹ from Recent task goes back to the Demo page after Don't show again (old flow, other symptom)"),
 ("ISS-VEA-11 / 12", "DRA242411-0023", "Close, 14.6.0: Recent task empty after uploading (unrelated)"),
 ("ISS-VEA-11", "DRA242410-0074", "Close, 14.5.0: Launcher returned from Recent (old flow)"),
 ("ISS-VEA-14", "DRA262608-0071 / -0072", "NewCreated, PM, 16.6.0: static 「4 minutes left」, zero progress (related; ours is completion time vs the company standard)"),
]

OBS_ALL = [f"O-{i}" for i in range(1, 32)]


def jpg(src, dst):
    subprocess.run(["sips", "-Z", "1400", "-s", "format", "jpeg", "-s", "formatOptions", "80", src, "--out", dst],
                   check=True, capture_output=True)


def build_map(fails):
    m = {}
    for n, e in enumerate(E, 1):
        for c in e["cases"]:
            m.setdefault(c, []).append(f"{n}. {e['iss']}")
    for pq, items, title, _ in HELD_Q:
        for c in items:
            m.setdefault(c, []).append(f"held: {pq} {title}")
    for c in fails:
        if c in G_ROWS:
            m.setdefault(c, []).append("held: PQ-1 + PQ-2 (copy only)")
    for k, _, why in OBS_NOT:
        m.setdefault(k, []).append("not raised" + (" (existing ticket, dedupe.txt)" if "DRA" in why else ""))
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
    if len(obs) != 31:
        sys.exit(f"observations found: {obs}")
    MAP = build_map(fails)
    missing = [k for k in fails + obs if k not in MAP]
    extra = [k for k in MAP if k not in fails and k not in obs]
    if missing or extra:
        sys.exit(f"reconciliation incomplete: missing {missing}, extra {extra}")

    img_root = f"{OUT}/{NAME}_images"
    if os.path.isdir(img_root):
        shutil.rmtree(img_root)
    os.makedirs(img_root)
    os.makedirs(f"{OUT}/logs", exist_ok=True)
    L = []
    w = L.append
    w(f"# AI Video Enhance (Android) — eBug drafts, round R1 (table v4), PDR-A {V} build {B}")
    w("")
    w(f"**Source:** pdr-spec-casebook run `library/pdr/video-enhance/android/runs/2026-11-10-r1-full/` — round R1 of draft `drafts/20261110-160000` (table v4, {len(rows)} cases), 2026-11-10 17:10 → 22:51 on {DEVICE[8:]} through Appium / UiAutomator2, {TR} (SR DRA261109-01), Stage server, account cltqauiap2@gmail.com (Pro test subscription until ~22:35, then Free). Tally: " + ", ".join(f"{v} {k}" for k, v in tally.items()) + ".")
    w("")
    w("**Status:** nothing filed, uploaded or commented. This is the first Video Enhance Android batch (`ebug-defaults.ts pdr/video-enhance android`: no filed batch), so the review page prefills the filing account from the newest PowerDirector Android casebook batch (AI Mini Drama 2026-10-30-a7: Creator ETHAN_HSU, [AIAgent], API) and the TR of this run (TR261109-0041, 16.9.0.2611091), each marked 「confirm」. Dedupe was read-only, Android pool only (dedupe per OS, user 2026-10-28).")
    w("")
    w("Rules: reviewer rules 2026-10-21 — one action per Repro step, a Spec Link on every entry, at least one image per entry, the logcat excerpt on every failure- or charge-related entry (user, 2026-10-27), no video. No `[UX]`: `[AIAgent]` or `[AIAgent][UI]`, owner RD, Doc for copy (RD, 2026-10-21). Spec basis check (REQ-055) per entry: the QA note names the rule; team rules and spec agent rules (REQ-008) are named as such; rows whose rule is a PM proposal ([建議]) or an open question are held as PM questions even when recorded defect (TC-011, TC-201, TC-046, TC-217). Android has no fault switches, so failure entries rest on real events (named in each QA note).")
    w("")
    nq = sum(1 for f in fails if disp[f] == "question")
    w(f"**What is drafted:** {len(E)} new entries (ISS-VEA-01…{len(E):02d}), all proposed for filing. {len(HELD_Q)} PM / table questions hold the {nq} Fail (question) rows and 4 defect rows whose rule is a proposal; one observation repeats an open Android ticket (dedupe.txt only).")
    w("")
    w("Legend — Class: Functional / UI · Severity: S1 critical and blocking only, S2 important, S3 moderate, S4 minor · Owner: RD or Doc. Every entry links the Figma board it is checked against.")
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
        w("<Claude Reviewed>"); w("```"); w("")
        w(f"**Images:** `{NAME}_images/{folder}/`"); w("")

    w("---"); w("")
    w("## Held — PM and table questions (not drafted)")
    w("")
    w("| # | Rows | Question | What was seen / what to decide |")
    w("|---|---|---|---|")
    for pq, items, title, q in HELD_Q:
        its = ", ".join(items) if items else "—"
        if pq in ("PQ-1", "PQ-2"):
            its = (its + " + " if items else "") + "the 36 combination rows (TC-219 – TC-254)"
        if pq == "PQ-12":
            its = "TC-113 (Pass)"
        if pq == "PQ-13":
            its = "TC-022 steps 4–5, TC-269 step 1"
        w(f"| {pq} | {its} | {title} | {q} |")
    w("")
    w("## Not raised (observations, for the record)")
    w("")
    w("| Item | What was seen | Why not raised |")
    w("|---|---|---|")
    for k, a, b in OBS_NOT:
        w(f"| {k} | {a} | {b} |")
    bd = {}
    for r in blocked:
        bd[r["Disposition"]] = bd.get(r["Disposition"], 0) + 1
    w(f"| Blocked ({len(blocked)}) | " + ", ".join(f"{v} {k}" for k, v in sorted(bd.items())) + " | No verdict (reasons on the Progress page and in report.md). |")
    w("")
    w("## Reconciliation against the run")
    w("")
    w(f"{len(fails)} Fail ({len(fails) - nq} defect, {nq} question), {len(blocked)} Blocked, {tally.get('Not run', 0)} Not run, {len(obs)} observations (O-1 … O-31).")
    w("")
    kinds = {"entry": [], "held": [], "notbug": []}
    for k, v in MAP.items():
        if re.search(r"\d+\. ISS-VEA", v):
            kinds["entry"].append(k)
        elif v.startswith("held"):
            kinds["held"].append(k)
        else:
            kinds["notbug"].append(k)
    tot = len(fails) + len(obs)
    w("| Step | Count | Running total |")
    w("|---|---|---|")
    w(f"| Fail rows + observations | {tot} | {tot} |")
    run = tot
    run -= len(kinds["held"]); w(f"| → held (PM / table question) | −{len(kinds['held'])} | {run} |")
    run -= len(kinds["notbug"]); w(f"| → not raised (incl. O-12, an open Android ticket) | −{len(kinds['notbug'])} | {run} |")
    w(f"| → merged: {run} rows / observations share {len(E)} defects | −{run - len(E)} | **{len(E)} entries** |")
    w("")
    w("### Row-by-row map")
    w("")
    w("| Item | Result | Disposition | Became |")
    w("|---|---|---|---|")
    for k in fails:
        w(f"| {k} | Fail | {disp[k]} | {MAP[k]} |")
    for k in obs:
        w(f"| {k} | observation | — | {MAP[k]} |")
    w("")
    w("### Owner split")
    w("")
    w("| Owner | Entries |")
    w("|---|---|")
    for o in ("RD", "Doc"):
        w(f"| {o} | {', '.join(str(i) for i, e in enumerate(E, 1) if e['owner'] == o) or '—'} |")
    w("")
    w("### Filing order")
    w("")
    w("By severity: " + ", ".join(f"**{i}**" for s in (1, 2, 3, 4) for i, e in enumerate(E, 1) if e["sev"] == s) + ". Nothing is filed until the review page's decisions come back.")
    w("")
    open(f"{OUT}/{NAME}.md", "w", encoding="utf-8").write("\n".join(L))
    with open(f"{OUT}/dedupe.txt", "w", encoding="utf-8") as f:
        f.write("# Dedupe per OS (user, 2026-10-28): same-OS matches are left off the drafts and the review page.\n")
        f.write("# Android pool (PowerDirector Mobile for Android), read-only ecl_query.py searches, 2026-11-10.\n\n")
        for k, code, t in DUPS_TXT:
            f.write(f"{k}\t{code}\t{t}\n")
        f.write("\n# ecl_query.py dedupe upload/bodies.json --product \"PowerDirector Mobile for Android\" (dedupe-query.txt): candidates read, none a duplicate\n")
        for k, code, t in CAND:
            f.write(f"{k}\t{code}\t{t}\n")
    print(f"wrote {len(E)} entries, {len(kinds['held'])} held, {len(kinds['notbug'])} not raised → {OUT}/{NAME}.md")
    return MAP, fails


if __name__ == "__main__":
    main()
