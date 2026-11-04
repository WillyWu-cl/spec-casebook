# Video Enhance — board notes (spec set 2026-11-03)

Sources (no PDF exports; everything is read from Figma):
- **PM** `mppB4GYkuVMVvHrdBeSAAU` 「AI Video Enhance」, page 309:643 「Spec - Video Enhance with Byteplus」 and the draft
  page's section 405:1108 「Logic 補充 · 對齊 Design 26.09 v2（9/29）」 (REQ-002). Page 0:1 (2025-10 Denoise / Lighting
  cloud solution) is superseded. Text: `boards/pm-*.md` (Figma text layers, `figma-text/`).
- **Design** `HceGLJVaxnKsv7gXSXzKWh` 「Video Enhance」, page 2974:19965 「26.09」 (see 「Design」 below).

PM page notes cite the PM document's sections (§4.1 …) that are not in this set; the boards restate them.
Mockups on page 309:643 are low-fi (「既有畫面 · 無 screen map，low-fi」): their strings are PM placeholders unless the
Design or a note confirms them. Green flags 「TBD · …」 are PM's own open points.

Dates: page 309:643 notes 9/24 (Pro+ CTA) and 9/29 (Trim × Mode); the loose settings block is flagged
「1002 update rule」 (10/02), the newest PM content. The draft logic section is dated 9/29 and aligned with Design
26.09 v2; its tags: [Design] = decided in the Design, [建議] = PM's suggestion, [衝突] = conflict to be ruled,
[待確認] = waiting for RD / BytePlus / Legal. 「UI 文案一律英文」 (all UI copy English).

## pm-main-flow 「主線 - 選片到拿到成品」 (369:438)

Header rules (369:443):
- Three entries reach one full-screen panel: Launcher shortcut 「Video Enhance」 and AI Magic card 「Video Enhance」 go
  through the media picker first; Timeline opens the panel directly with the selected clip (§4.1).
- Price: credit = selected seconds (rounded **up** to whole seconds) × per-second rate (Mode, Resolution, source fps);
  Style does not change the price (§6.1). Example on the panel: 3.96 s → 4 s × 1080p Standard 30fps (2/sec) = 8.
- Commit point = upload reached the server: Cancel while uploading charges nothing and creates no task; credits are
  taken only after a successful upload (§8).
- Background generation has no cancel in v1; the result goes to Recent task, AI Magic › My Artwork and Template ›
  My Artwork (§4.3, §8).
- Panel remembers the last Mode / Style / Resolution; Resolution offers only tiers ≥ source, max 4K; 2K removed in
  v1 (§4.3, §5.2). (Superseded in part by the 1002 defaults, see pm-defaults.)
- First background task: 「Turn on notifications」 prompt (Turn On / Later) (§4.2, §9).
- Billing SKU `genvideo_1_sec_byteplus_{mode}_{style}_{resolution}_{fps}`, e.g. `std_hd_1080p_30fps` (§6.3).
- Not in this round: Before/After preview before sending, extra confirm for high prices, result share / cross-sell,
  one-tap retry of a failure (§2.2).

Screens (left → right):
1. Launcher_Home (370:2) and Launcher_2026_08 (383:1738, real Launcher): big shortcut 「Video Enhance」 → media picker.
2. AIMagic_Home (370:171): 「Video Enhance」 card → media picker.
3. VideoEnhance_MediaPicker (371:177) 「媒體選擇器（選 1 片段）」, §4.2 step 1, v1 one clip. Arrow to the panel is
   「觸發 TBD」 (how a pick opens the panel: PM Gap 4).
4. VideoEnhance_Panel default (371:237) 「Pro+：Enhance＋即時 credit」: top bar 「Video Enhance」, credit pill 「0」,
   Recent-task icon; Preview; 「Selected Length」 「00:03.96」; trim bar 「Trim · drag in / out」; Mode
   「Standard」/「Professional」; Style 「HD」/「Natural」; Frame rate 「Same as source」 (one disabled field);
   Resolution 「720p」 (disabled)/「1080p」/「4K」; CTA 「Enhance · 8 credits」. Note 377:454: non-Pro+ → 「Upgrade to
   Pro+」, low credit → Top Up, see the branch section. Title 381:606: Trim max by Mode, Standard 8 min /
   Professional 2m 30s.
5. VideoEnhance_Panel uploading (373:305) 「前景 blocking，可 Cancel」, §8.2–3: dialog 「25%」 ring, 「Video
   uploading...」, 「Please keep the app open」, 「Cancel」. Not yet at the server: Cancel charges nothing, no task.
   Arrow 「成功上傳＝commit 點・扣 credit」 → Recent task.
6. VideoEnhance_RecentTask processing (373:450), §4.3 / §9, no cancel in v1, user may leave the app: list
   「Recent task」 with 「Video Enhance · processing」 (progress bar) and 「Video Enhance · completed」 / 「Date ·
   duration」 rows. Flag 「TBD · 處理中列樣式（進度／預估時間）」.
7. Push notification (383:1738 over the Launcher): banner 「Your video is ready. Tap to view.」 with 「Close」 and
   「View」 (§9 system notification, 「文案為 spec 原文」 = copy is the spec's own). Arrow 「push notification」 → Result.
8. VideoEnhance_Result (373:1138) §4.1: 「Result preview」, 「Save Result」, 「Add to Timeline」, 「Edit More」. Flag
   「TBD · Edit More 去處」 (settled by draft D3: 「Enhance More」 → Add Media).
9. Panel First-run (397:1060) §10.1: first entry shows a bottom toast / small card once, never again after seen;
   card 「Feature purpose · TBD」 「Uses credits · TBD」 「Dismiss control · TBD」 (replaced by the B2 bubble).
10. Panel first notification prompt (397:1151) §4.2 step 6 / §9 / §10.4: after the first successful upload and
    charge, when the first background task is created: dialog 「Turn on notifications」 「We'll let you know when it's
    done.」 「Turn On」 「Later」; 「按鈕後落點 TBD（Gaps #6）」; flag 「TBD · 已開通知者是否略過」.

「面板・Trim 上限 × 切換 Mode（9/29）」 (407:1108):
- Limits Standard 8:00 / Professional 2:30; the selection is rounded up before comparing (2:30.4 → 151 s > 150 s =
  over).
- ① Default selection from 00:00, length = min(video length, current Mode limit) (Standard max 8:00; Professional on
  entry max 2:30).
- ② Selection ≤ 2:30: switch freely, selection unchanged, only the credit updates.
- ③ Selection > 2:30 (only in Standard), tap Professional: **blocked**, Mode stays Standard, selection unchanged,
  toast 3 s; the Professional chip keeps its normal unselected look (not disabled); never shortens the selection.
- ④ Drag to ≤ 2:30, then Professional → switches.
- ⑤ In Professional the handle stops at 2:30; back to Standard → selection unchanged, limit 8:00, user drags longer.
- ⑥ Thumbnail strip scale depends only on the video length: ≤ 8:00 fills the fixed width; > 8:00 scrolls
  sideways, 8:00 = one screen width; switching Mode does not re-lay the strip.
- ⑦ Timeline clip: same rules; selection > 2:30 + Professional → the same toast.
- UI: toast 3 s 「Professional mode supports up to 2m 30s. Shorten your selection to switch.」; Mode ⓘ bubble
  「Standard: up to 8 minutes. Professional: up to 2m 30s.」; at the limit the handle stops + light haptic + bubble
  「Up to 8 minutes in Standard mode」 / 「Up to 2m 30s in Professional mode」.
- Mockups: 「Selected Length ⓘ」 「5m 00s」, 「00:30 – 05:30 (video 06:00)」, 「Mode ⓘ」, 「Enhance · X credits」.

## pm-access-credit 「分岔 - 存取／餘額檢查沒過」 (369:439)

- Pro+ only; **no free trial in v1** (§7). Flag 「9/24 Update · spec §7 待同步」.
- Not Pro+: panel CTA reads 「Upgrade to Pro+」 → IAP Pro+ page (PM 9/24). Screen 374:331 (CTA 「Upgrade to Pro+」),
  IAP_ProPlus 374:380 (low-fi 「PowerDirector Pro+」, plan rows, CTA).
- Pro+ with too few credits: tap Enhance → Top Up / Claim daily credits; nothing uploaded, nothing charged (§8.1,
  §10.8). Screen 374:422, arrow 「餘額 < 本次 credit」 → Credit page_paid 383:849 (「My Credits」, 「Buy More」,
  「Expiring within 7 days: 0 credits」, 「Complimentary daily credits」 「Claim once every 24 hours」 「Claim」,
  「PowerDirector Pro+」 card).
- Flag 「TBD · 購買／儲值後回到哪、是否保留設定」 (settled by draft C2).

## pm-timeline 「Timeline 入口」 (369:440)

- Timeline_Editor (376:405): a selected clip, toolbar 「Enhance」 → panel with that clip (no media picker, §4.1);
  after sending, same as the main flow.
- Timeline_Editor (397:1888): after background success the result replaces the original clip and the user is
  notified: 「Applied Video Enhance」 (§4.1, §9). Flag 「TBD · 「Applied Video Enhance」呈現形式（toast／片段標籤）」.

## pm-failure-refund 「失敗與退款」 (369:441)

- Generation failure → automatic refund; no Retry (§8.6).
- Recent task row 「Video Enhance · failed」 with 「View details」 → refunded dialog: 「An Error Has Occurred」 /
  「Credits have been refunded.」 / 「The server may be busy. Please try again later or use a different video.」 / 「OK」.
- Flags 「TBD · 失敗是否推播」, 「TBD · 已退款 dialog 內文與關閉鈕」.

## pm-gaps 「Gaps & Open questions」 (369:442)

Gaps 1–16 (spec not settled); the draft section's E2 gives each a status. Open questions (spec §14): 2K price
(removed in v1); baseline metrics; disclosure wording (existing GenAI consent dialog, covering ByteDance cloud) —
Legal.

## pm-defaults 「Settings · 預設值規則」, flag 「1002 update rule」 (loose frames, 309:643)

Two panel sheets (413:1139, 413:1207) drawn with the newer controls:
- 「Selected Length」 「01:30」, timeline from 「00:00」.
- 「Mode」 「Standard」 / 「Professional」; info bubble 「Standard: Great quality, quick results」 / 「Professional:
  Cinema-level detail, worth the wait」.
- 「Enhancement style」 「Natural」 / 「Sharp」; info bubble 「Natural: Lighter enhancement with fewer artifacts, for a more
  realistic look」 / 「Sharp: Moderate enhancement for a sharp, clear image」.
- 「fps」 「30fps」 / 「60fps」 / 「120fps」; 「Resolution」 「720p」 / 「1080p」 / 「4K」.

Default rules (on entering the feature):
| Setting | Default | Rule |
|---|---|---|
| Mode | Standard | fixed, not from the source |
| Enhancement style | Natural | fixed; deliberately not the API default `hd` |
| fps | from source | nearest option; on a tie the lower |
| Resolution | from source | nearest option; on a tie the lower |

Lookup tables (「供驗收用」, for acceptance): source fps 1–30 → 30fps, 31–60 → 60fps, 61+ → 120fps; source
resolution 0–720p → 720p, 721–1080p → 1080p, 1081p+ → 4K.

Chip states: unselect (selectable, not chosen); select (chosen, one per group); disable (the current Mode does not
support it; not tappable).

## pm-draft-logic 「Logic 補充 · 對齊 Design 26.09 v2（9/29）」 (draft page, 405:1108)

Only the [Design] and [9/29 定案] items are decided; [建議] are PM proposals, [衝突] need a ruling, [待確認] wait for
RD / BytePlus / Legal. Conflicts with newer PM content (1002) are noted.

A. Flow and entries
- A0 Launcher / AI Magic → Demo page (skippable) → Add Media (1 video) → panel (Trim + Mode / Enhancement style / fps
  / Resolution) → CTA → Check Eligibility → upload → charge → Generating → Recent task → Result. Timeline: selected
  clip → Enhance → panel with the clip (no Demo page, no Add Media) → same → pasted back onto the clip.
- A1 [Design] Demo page from Launcher / AI Magic; 「Don't show again」 stops it; never from Timeline. [建議] takes
  effect only when ticked + 「Try It Now」; back without Try It Now does not; stored locally (reset on reinstall);
  back → the entry page. [衝突] Demo copy is AI Reframe's (「AI reframe your video for any aspect ratio…」); proposed
  「Make blurry, noisy or dark videos look sharp and clear.」
- A2 [Design] Add Media shows only the Video tab, single pick. [建議] tapping a thumbnail opens the panel, no Next;
  title 「Add Media」; unsupported videos greyed with a toast; no videos → 「No videos yet」.

B. Panel
- B1 [9/29 定案] limits per Mode Standard 8 min, Professional 2m 30s (replaces the Design's 3 min); default
  selection from 00:00, min(video, Mode limit). [Design] dragging a side handle changes the length and the Preview
  shows that end's frame; dragging the middle moves the whole range (same length) and the Preview shows its first
  frame. [建議] minimum 1 s; Selected Length shows whole rounded-up seconds: 「18s」 below 60 s, 「1m 30s」 from 60 s.
- B1-1 (9/29 新增) **conflicts with page 309:643 ③**: Standard → Professional with selection > 2:30 keeps the start
  and **shortens** the end to start + 2:30 (≈200 ms handle animation, Preview to the first frame, toast 3 s, credit
  updates); ④ switching back without touching the range restores the earlier selection (no toast), fps / Resolution
  changes do not count as touching; ⑤ remembered Mode Professional → new video selects 00:00–02:30; ⑥ strip as on the
  main page; ⑦ Timeline (whole clip locked): clip ≤ 2:30 both Modes; 2:30–8:00 → Professional chip disabled, tap →
  toast 「Professional mode supports clips up to 2m 30s. Split the clip to use it.」; clip > 8:00 → panel does not
  open (D4). UI: 「5m 00s / 8m max」 (limit grey, updates with Mode); shortening toast 「Professional mode supports up
  to 2m 30s. Your selection was shortened.」 (rapid switching shows only the last).
- B2 [Design] first-run bubble: shown automatically on first entry; reopened by the ⓘ next to Selected Length;
  disappears after 3 s or on any tap. Mode and Enhancement style titles also have ⓘ bubbles. [建議] Selected Length
  copy 「Choose up to 8 minutes in Standard or 2m 30s in Professional. Credits are based on the length you choose.」
- B3 [Design] defaults Standard / Natural fixed (not API `hd`); fps 1–45 → 30, 46–90 → 60, 91+ → 120 (**older than the
  1002 table 1–30 / 31–60 / 61+**); Resolution nearest, tie lower. [衝突] remember vs fixed; ≥ source vs nearest
  (900p → 720p would downgrade); proposal: short side decides (1080×1920 = 1080p).
- B4 [衝突] price by output fps; [建議] fps below source disabled; VFR by average fps.
- B5 [Design] chip states (as 1002); tapping a disabled chip → toast; [待確認] BytePlus Mode × fps × Resolution support
  table; [建議] auto-reselect and toast 「Frame rate changed to 60fps」.

C. Credit, eligibility, generation
- C1 credit formula (as main page); [衝突] Design shows 「Charge X credits per second」 above the CTA vs PM total.
- C2 order: ① Pro+ → ② network → ③ balance ≥ cost. [Design] Free → IAP; low balance → Credit page; enough →
  generate. [Design] after a purchase → back to Video Enhance with balance updated, selection and settings kept.
  [建議] no auto-send; Pro (not Pro+) → IAP on the Pro+ tab; closing IAP / Credit page → panel unchanged; server
  re-check. [衝突] IAP 「Receive 35 credits during free trial」 vs no trial (§7).
- C3 [建議] upload dialog 「Uploading… 45%」 + Cancel (Design v2 lacks it); upload failure toast 「Upload failed. Check
  your connection and try again.」; app closed while uploading = cancel.
- C4 [Design] Generating = processing dialog on the panel; Cancel → confirm dialog; Leave → credits not refunded.
  [衝突] with v1 「no cancel」; proposal Leave = keep running in background. [待確認] concurrent tasks (proposal 3).

D. Notification, Recent, Result, Timeline
- D1 [Design] in-app notify banner on the Launcher when done; tap → Result. [建議] system push in background; failure
  push 「Video Enhance didn't finish. Your credits have been refunded.」; notification soft prompt only when the
  system permission was never asked, Turn On → system dialog, denied → Settings, stays on Generating; Later never asks
  again.
- D2 [Design] Recent task cards: Processing → Completed (tap → Result) → Failed (Error thumbnail + 「View Details」 →
  error dialog: credits refunded); stored on the cloud for 1 year (「Tasks are stored on the cloud for 1 Year…」) +
  「Manage」. [待確認] processing style, Recent entry from the panel top bar, failure dialog copy.
- D3 [Design] 「Save Result」 → device; 「Add to Timeline」 → new project with the result; 「Enhance More」 → Add Media.
  [衝突] Enhance More vs Edit More → 「Enhance More」. [建議] toasts 「Saved to your device」 / 「Couldn't save. Try
  again.」
- D4 [Design] Timeline opens the panel with the clip, no Demo page; Design v2 does not draw the paste-back. [建議]
  clip > 8 min → toast 「Split clips longer than 8 minutes first」; success replaces the clip, toast 「Video Enhance
  applied」 3 s; clip deleted / project closed → result stays in Recent; Result from Timeline: Add to Timeline back to
  the project.

E. Limits and gaps
- E1 [待確認] ≥ 1 s; MP4 / MOV (H.264 / HEVC); ≤ 4K; [建議] unsupported greyed + toast 「This video isn't supported.
  Try one up to 4K.」
- E2 gap status; E3 conflicts to rule (Leave, output fps price, Resolution default, remember vs fixed, total vs per
  second, Pro+ trial, Demo copy / Enhance More, missing Design states, Design trim limit still 3 min).

## pm-draft-notes (draft page, 365:196)

「two routes: shortcut / Timeline → video enhance」; 「[哪些影片是不是不能用?] 會不會有已經是4K的影片就不能夠用 video
enhance」 (can a 4K source be used at all?) → Gap 1 / E1.

## Design

Section 3293:13053 「AI Video Enhance_26.09_v2」 (page 2974:19965 「26.09」), read through figma-design (qa-dm) into
`figma-source/design/out/`; board text in `boards/ds-*.md` (written by `figma-source/design/to-boards.ts` from the text
nodes, hidden nodes left out). Dated labels: 「1005_Update wording: AI Video Enhance」 and 「1005_preview 右下加上影片的來源資訊」
(10/05) make the Design newer than every PM item (9/24, 9/29, 1002). The Design outranks the PM; where they differ the
Design version is the expected result (requirements.md says which PM item lost).

### ds-main-flow 「Main Flow（Free user → IAP）」 (3293:13054)
- Header: 「Launcher → Demo page → Add Media → AI Video Enhance → IAP → Purchase Success → Enhance → Generating → View → Result」.
- Launcher_2026_08: big shortcut 「AI Video Enhance」 (1005 wording; PM says 「Video Enhance」) → Demo page (arrow 3294-24049).
- Demo page_Straight video: ‹, title 「AI Video Enhance」, sample video, description (AI Reframe's copy 「AI reframe your
  video for any aspect ratio, then fine-tune the crop in real time.」, PM A1 [衝突]), 「Don’t show again」 checkbox,
  「Try It Now」 → Add Media (3294-24050).
- Add Media: title 「Add Media」, one 「Video」 tab, Recents album, camera, filter, thumbnails with durations; a thumbnail
  → panel (3293-13715).
- VE · 01 預設（未訂閱）: note 「第一次進入此功能跳出 bubble」 — bubble 「Max 8 minutes. Drag to choose which part.」 at
  Selected Length; top bar ‹ (→ Add Media, 3293-13716), 「AI Video Enhance」, credit pill 「0」, Recent icon; Preview with
  「60fps · 1080p」 at the lower right (1005_preview: the source video's info), 「00:00/12:30」, play, full-screen;
  「Selected Length ⓘ」 「08:00」, strip with handles and the 「00:00」 marker; 「Mode ⓘ」 Standard / Professional;
  「Enhancement style ⓘ」 Natural / Sharp; 「fps」 30fps / 60fps / 120fps; 「Resolution」 720p / 1080p / 4K; CTA
  「Unlock Pro+ to Enhance」 (note 「Free user 需要訂閱才能使用」) → IAP_US (3293-13717); line 「Charge X credits per second」.
- IAP_US ×3: Pro / Pro+ tabs (Pro+), 「Yearly」 「Best Value」 「65% OFF」 「$6.67/month」, 「Monthly」 「$18.99/month」,
  「Receive 35 credits during free trial」, 「Continue」 → App Store sheet (3293-13677) → 「You're all set / Your purchase
  was successful.」 「OK」 (3293-13678) → VE · 02 (3293-13679); footer 「Terms of Service」 「Privacy Policy」
  「Restore purchase」; 「Tap to compare」. Prices are store data.
- VE · 02 預設（已訂閱）: pill 「35」, CTA 「Enhance ◆ XX」 → VE · 03 Generating (3293-13682).
- VE · 03 Generating: processing dialog 「25%」 ring, 「Video uploading...」, 「Please keep the app open」, 「Cancel」 →
  Recent · processing (3293-13681).
- Recent · processing / 完成: title 「AI Video Enhance」, ‹ (→ VE · 02, 3293-13718), ⌂; 「Tasks are stored on the cloud
  for 1 Year. Please download any you want to keep in local storage.」 「Manage」; card 「2026/10/21」 「AI Video Enhance
  1021」 「processing...」 「4 minutes left...」 with a bar; completed card 「View」 (3293-13680, → result 3293-13683).
- result: ‹, 「Original」 / 「Result」, player 「04:48/08:00」 with slider; 「Save Result」 「Add to Timeline」
  「Enhance More」 (→ Add Media, 3293-13720).

### ds-routing 「Routing Logic」 (3293:14560)
- Enter: Launcher / AI Magic → Demo page (「勾 Don't show again 後不再出現」) → Media Room picks one video; Timeline →
  「直接帶入選取的 clip」, no Demo page.
- 設定面板: Trim + Mode / Enhancement style / fps / Resolution; 「價格 = 選取秒數 × 每秒費率」, 「長度改變，價格跟著改變」.
- Check Eligibility: Free user → IAP; 餘額不足 → Credit Page; 餘額足夠 → 直接生成.
- Generating（雲端）: Cancel → 取消確認; Leave → 回設定面板, 「Leave → credit 不退還」.
- Recent Task: 完成 → Result (Save Result → 存到手機; Add to Timeline → 開新 timeline; Edit More → 回 Media Room — the
  button is 「Enhance More」); 失敗 → 失敗卡片 (Error 縮圖 + View Details) → 錯誤說明 dialog, credit 已自動退還.
- Footer rule: every Enhance costs credits and is generated on the cloud and saved as a new video; Add to Timeline opens
  a new timeline and does not replace the original clip; a failure refunds automatically, a user cancel does not.

### ds-entry-points 「Entry Points」 (3293:14642)
- Launcher: big shortcuts New Project · Video Edit by Chat · 「AI Video Enhance」 (Try Pro+ chip, tiles, rows as KP-010).
- AI Magic: tabs 「AI Magic」 / 「My Artwork」, credit pill 「182」; section 「AI Enhance」: 「AI Video Enhance」, 「AI Video
  Upscaler」, 「Photo Enhance」, 「Video Quick Actions」.
- Timeline_default: clip selected, clip toolbar 「AI Video Enhance」 (「Pro+」 badge), 「Fix Shake」 (Pro+), 「AI Color」 (Pro),
  「AI Video Upscaler」; preview badge 「Pro+ Only / Upgrade Now」 (existing, KP-040). No arrows drawn.

### ds-alt-exception 「Alternative & Exception」 (3293:15052)
- Insufficient Credits: VE · 02 「Enhance」 → Credit page_paid (3293-15662): 「My Credits」 「0」 「Buy More」 「Expiring within
  7 days: 0 credits」 「Complimentary daily credits」 「Claim once every 24 hours」 「Claim」 「Details」, card 「PowerDirector
  Pro+」 「You've unlocked 100 monthly credits, 50% for all credit packs, 100 GB Cloud Storage, and many more!」. Note
  「購買成功 → 回 AI Video Enhance（餘額已更新、選取狀態保留）」.
- Leave / Return: Recent ⌂ → Launcher (3293-15874); note 「生成完成跳通知」: banner 「Good news! Your AI Video Enhance task
  has been completed. Tap here to view your results.」 「Close」 「View」 → result (3293-15875).
- Generation Failed: Recent card 「Error」 thumbnail + 「View Details」 → dialog 「An Error Has Occurred」 「Credits have
  been refunded.」 「The server may be busy. Please try again later or use a different video.」 「OK」.

### ds-ai-video-enhance 「AI Video Enhance」 (3300:32003)
- Default / Length: 12:30 video selects 08:00; 01:30 video selects the whole 01:30; dragging a handle (06:00, 01:00,
  00:14 selections).
- Settings › Mode bubble 「Standard: Great quality · up to 8 min」 / 「Professional: Maximum detail · up to 2:30」;
  Enhancement style bubble 「Natural: Lighter enhancement with fewer artifacts, for a more realistic look」 / 「Sharp:
  Moderate enhancement for a sharp, clear image」.
- 預設值規則（進入功能時自動帶入）: Mode Standard (固定值，不隨來源影片改變); Enhancement style Natural (固定值，刻意不採用
  API 預設值 hd); fps 依來源 (選不低於來源 fps 的最小選項；來源超過最高選項時取最高); Resolution 依來源 (選不低於來源解析度
  的最小選項；來源超過最高選項時取最高). Lookup (供驗收用): fps 1–30 → 30fps, 31–60 → 60fps, 61 以上 → 120fps;
  resolution 0–720p → 720p, 721–1080p → 1080p, 1081p → 4K. This replaces PM 1002 「nearest, tie lower」.
- Chips 狀態: unselect (可選但目前未選中), select (目前選中；每組僅一個), disable (當前 Mode 不支援此設定，不可點選).
- Mode 長度上限: 「Standard 選 05:00（Professional 外觀正常，可點）」 → 「點 Professional → 跳 toast 說明上限，不切換」 with
  toast 「Professional supports clips up to 2:30. Shorten your selection to switch.」 → 「縮短到 02:20 → 再點 Professional →
  切換成功」. This settles PM 309:643 ③ (block) vs draft B1-1 ② (auto-shorten): block, with the Design's toast copy.

### ds-cancel 「Cancel」 (3396:20438)
- VE · 02 「Enhance」 → VE · 03 Generating (3388-17846); 「Cancel」 → dialog 「Sure You Want to Leave?」 「Your video is still
  uploading. Leaving this page will cancel the process, and the credits will not be restored.」 「Leave」 / 「Keep
  Uploading」 (3393-18476); 「Leave」 → VE · 02 (3393-18607). Conflicts with PM §8 (cancel before commit charges nothing)
  and PM C4 (Leave = keep running): the Design decides (Q-2 in requirements.md).
