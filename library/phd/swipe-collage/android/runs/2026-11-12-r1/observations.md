# Observations — runs/2026-11-12-r1

- **O-1 (probe, closest TC-003 / TC-009): the Template Page crashes the app.** 20.19.0 (90201901), updated over the
  2026-11-02 install at 09:27. Launcher › 「Collage」 › banner 「Try Scrollable Collage!」 → 「PhotoDirector keeps
  stopping」, 2 of 2 tries (10:16:26, 10:17:14). Crash buffer: `android.database.sqlite.SQLiteException: no such
  table: SwipeCollageTemplateContract … DELETE FROM SwipeCollageTemplateContract` at
  `SwipeCollageTemplateRepository$getTemplateList$2.invokeSuspend`. Looks like a missing database migration on an
  update install. Evidence: `screenshots/probe-05-collage-room.png`, `probe-07-retry.png`,
  `probe-08-keeps-stopping.png`, `logs/probe/crash-1.txt`, `crash-2.txt`. Not filed.
- **O-2 (probe, TC-001): the banner shows the older PM copy.** 「Try Scrollable Collage!」 / 「Swipe-able multi-page
  collage」 with a 「NEW」 tag and no picture; the Design has 「Try Swipe Collage!」 / 「Create the perfect year-end recap
  post.」 with a collage picture (Q-18). To be judged in TC-001.
- **O-1 update (R1-a, 2026-11-12 10:30):** the user reinstalled PhotoDirector (20.19.0, versionCode 90201900, first
  install 10:28:09). On this fresh install the banner opened the Template Page with no crash, 3 of 3 entries
  (TC-003, TC-002, TC-156 / later re-entries); the crash buffer stayed empty. O-1 is not reproduced on a fresh install:
  it stays an upgrade-path observation (90201901 over the 2026-11-02 install).
- **O-3 (R1-a, TC-024 / TC-044): templates have more frames than their photo count.** Year End 「2 photos · 1 pages」
  opens with 3 empty frames; Daily 「4 photos · 1 pages」 with 5. (The Year End 「7 photos · 3 pages」 has 7, matching.)
  Evidence: `screenshots/r1a-tc024-canvas.png`, `r1a-tc044-canvas.png`.
- **O-4 (R1-a, TC-024): debug buttons on the Canvas.** 「Save Template」 and 「import Template」 (ids
  `debug_save_template_btn`, `debug_import_btn`) sit over the top left of every canvas on 90201900 and cover part of
  the page. Not pressed. Evidence: `screenshots/r1a-tc024-canvas.png`.
- **O-5 (R1-a, TC-040): the first tap on an empty frame's 「+」 only selects the frame;** a second tap opens the picker.
  Seen on every template tried. Tapping the 「+」 of an already-selected frame can also deselect it.
- **O-6 (R1-a, TC-161 first try): with one empty frame left the picker is single-select:** tapping a photo filled the
  frame at once, no tray or 「Next」. So TC-161 / TC-047 need 2+ empty frames on the page.
- **O-7 (R1-a, closest TC-030s in R1-b): leaving the Canvas.** 「‹」 after changes shows 「Discard changes?」 /
  「All your existing changes will be lost.」 / 「Keep」 「Discard」; Discard returns to the Template Page (not the
  Preview). System Back on an unchanged canvas leaves straight to the Template Page with no dialog.
- **O-8 (R1-a, account): the phone is Free, not Premium.** Mine 「Upgrade to Premium!」, credits 0 at 10:30 and 300 at
  10:47 (log: `giveaway_monthly` 300); a PhotoDirector notification 「Oh no .. Your VIP benefits have ended」 showed at
  10:46. R1-c – R1-f need Premium (fixtures.md).
- **O-9 (R1-b, TC-050): a scaled-up frame draws outside the canvas.** Pinching the page-1 film-strip frame out
  (0.6 → 1.6) grew it far beyond the canvas: it covered the debug buttons and reached the top bar, with a ratio rail
  (3:4, 4:3, 9:16, 16:…) showing behind it. ↶ restored it. Evidence: `screenshots/r1b2-tc050-pinch.png`. Not filed.
- **O-10 (R1-b, TC-029 / TC-072): dragging an added layer is unreliable.** A one-finger drag on the added text
  narrowed its box (「Add / text」 on two lines) instead of moving it; a selected sticker ignored a `fingerdrag` but
  moved (and shrank) with an Appium drag. Swaps by long-press drag work (TC-069 – TC-071).
- **Tool note (R1-b, 11:08):** the Appium server on port 4724 (pid 14480) could not see the phone ("Could not find a
  connected Android device") and could not be stopped from the agent; R1-b ran on a second Appium on **port 4725**
  (started with ANDROID_HOME set, `APPIUM_ANDROID_URL=http://127.0.0.1:4725`). `device-android.ts` cannot spawn
  `appium` on Windows (ENOENT): start it by hand with node.
- **O-11 (R1-c, 11:30): Premium set by the agent, no sign-in (REQ-010, KP-131).** Launcher gear › About › backdoor
  below 「‹」 (`backDoorButton`) ×10 › 「Debug settings」 › 「Set to subscriber」 ON (nothing else changed; 「Test
  server」 and 「Support ScreenShot for free user」 were already on) › OK › relaunch. Mine: 「Hello VIP!」, My Credits
  2300 (was 300 at 10:47; the credit history lists a 2000 `purchase` record, not made by this segment). Evidence:
  `screenshots/r1c-00-debug.png`, `r1c-00-subscriber-on.png`, `r1c-00-mine.png`. Left ON for R1-d – R1-f.
- **O-12 (R1-c, TC-065 / TC-172): the Canvas credit button is inert on Premium.** It reads 「--」 all segment, before
  and after a 6-credit charge (2300 → 2294 in the log), and neither it nor its 「+」 opens anything.
- **O-13 (R1-c, TC-075 / TC-076): switching frame style redraws the frame at the new style's own size,** much larger
  than the old frame (stamp after strip); the orange selection box can keep the previous style's size after ↶.
- **O-14 (R1-d, TC-095 / TC-099): the eyedropper pin stays on the canvas.** After Background › Custom color ›
  eyedropper, then 「Cancel」 and the sheet's ✕, the eyedropper's pin was still drawn over page 2 and over the Add Layer
  sheet's canvas; it went away only after later edits. The pin itself never moved (tap, Appium drag and finger drags),
  so the eyedropper cannot pick a photo colour (TC-095). Evidence: `screenshots/r1d-tc099-card.png`,
  `r1d-tc100-added.png`, `r1d-tc095-picked4.png`.
- **O-15 (R1-d, TC-090 / TC-095): the canvas moves inconsistently with a bottom sheet open.** In TC-090 the canvas
  moved up above the Background sheet; later (TC-095, Custom color) it stayed in place, half hidden behind the sheet.
  Also: the first tap on a swatch right after the sheet opens is sometimes ignored (TC-162 needed a second tap), and
  after a Custom color 「Done」 the colour is added as a recent swatch above the 32, shifting the grid down one row.
- **O-16 (R1-d, TC-101 / TC-164): an accidental 「Discard changes?」.** With an image layer selected, a `type` command
  (no text field focused) brought up 「Discard changes?」 (Keep pressed); likely the key events reached the Canvas as
  Back. Tool artefact, not a finding.
- **O-17 (R1-d, TC-110 / TC-112): Layers sheet gestures.** A downward swipe on the list at its top dismisses the whole
  sheet; a drag that starts off the ≡ scrolls the list; the list reopens at its last scroll position and holds every
  page's layers in one stack.
- **O-18 (R1-e, TC-125 / TC-126): Pages strip controls overlap from 5 pages up.** With 5 pages each page's ••• sits
  under the next page's ≡ pill; at 10 pages the pills form one overlapping row and only the last ••• is reachable
  (the others are hidden), so Duplicate / Delete page can no longer be reached per page. At 1 page the enlarged page
  overlaps the debug 「import Template」 button. Evidence: `screenshots/r1e-tc125-add.png`, `r1e-tc126-10.png`,
  `r1e-tc127-1.png`.
- **O-19 (R1-e, TC-116): the export icon saves at once.** The Canvas's top-right export icon opens 「Save & Share」 and
  writes every page to `DCIM/PhotoDirector/<time>_collage_<n>.jpg` immediately (no 「Save」 tap); 4 files at 12:31:31
  (3:4, 1080 × 1440). New blank pages added in Pages have a white background while the template's pages are dark
  (TC-124). The Ratio sheet does not mark the current ratio (TC-117).
- **O-20 (R1-f, TC-136 / TC-147): every Save & Share opening writes a new copy of every page.** Opening Save & Share
  three times on an unchanged 3-page canvas (12:44:32, 12:44:50, 12:45:07, then 12:45:47) left four identical sets of 3
  files in DCIM/PhotoDirector; leaving with 「‹」 or Back keeps them. Untouched 1-page canvases export too (12:49:42,
  12:50:34). One export = one set; there is no way to look at Save & Share without saving.
- **O-21 (R1-f, TC-141): tool note — never `activate` after a share target.** After backing out of Instagram,
  `device-android.ts activate` sent the launcher intent (SplashActivity, LAUNCH_SINGLE_TASK), which cleared the task
  to the Launcher and lost the open canvas (no crash; no Discard dialog). Return from a share target with system Back
  (as for Facebook, TC-142), or the app switcher.
- **O-22 (R1-f, TC-153): Premium hides the crowns.** On Premium (Set to subscriber) no Scrollable Collage template
  card shows the crown that the Year End 「3 photos · 1 pages」 card showed on Free (R1-a TC-015), and the Add Layer
  Frame and Background Texture panels show no crowns, so PRO content cannot be told apart on Premium. The Add Layer ›
  Frame sheet has a bottom bar with ✕ and ✓ besides the round ✕ (R1-d noted no ✓ on canvas sheets); a tap on a frame
  adds it and closes the sheet.
- **O-23 (R1-f, TC-141 / TC-142 / TC-183): share row targets.** The row lists TikTok although TikTok is not installed
  (TC-183 stays Blocked by policy; the tap was not tried), and Snapchat / Pinterest. 「Instagram」 and 「Facebook」 go
  through an Android 「Share」 resolver (Just once / Always) before the app; Facebook's only target is 「Your groups」.
- **O-24 (R1-g, TC-145): after `pm clear` the free Year End 「2 photos · 1 pages」 template opens a blank Canvas.**
  Before the clear (R1-a – R1-g) this template opened with its stamp / polaroid frames; at 16:05 (first Collage visit
  after the clear, categories and content downloaded per logcat) 「Use Template」 gave a plain cream page with no
  frames or 「+」 (twice). Not re-checked on other templates. Evidence: `screenshots/r1g-tc145-canvas.png`,
  `r1g-tc145-canvas2.png`, `r1g-tc146-1page.png`.
- **O-25 (R1-g): the `pm clear` at 14:09 and the resume.** The first R1-g subagent ran `adb shell pm clear
  com.cyberlink.photodirector` at about 14:09 and stopped mid first-launch with no log pull and no checkpoint. Its
  logs were still in the PC's live capture (`logs/.live/logcat-20261112-125725.txt`, 12:57–14:11, covering the clear):
  copied to `logs/R1-g-preclear-20261112-141100/` and sliced. The resume (16:02) found the first-launch IAP page
  (closed with ✕), then a 「New Content」 popup and the photo permission (Allow all); Mine 「Upgrade to Premium!」,
  0 credits. The Mine 「NetworkManager / Test Server」 overlay seen once before (r1g-tier-mine) did not show; Scrollable
  Collage templates and categories loaded as before.
- **O-26 (R1-h, TC-036): blank templates persist and Add Layer › Frame says 「No connection」.** At 16:12 – 16:14
  the Year End 「3 photos · 1 pages」 and Daily 「3 photos · 1 pages」 templates also opened as a plain cream page (O-24
  now covers every template tried after the clear), and Add Layer › 「Frame」 showed 「Something went wrong」 / 「No
  connection available. Check your connection and then click [Retry] …」 (Retry gave the same) while the phone was on
  Wi-Fi (17F_QA_Wifi_5G, validated, ping OK) and other content loaded. Logcat shows no network error behind it.
  Evidence: `screenshots/r1h-tc036-canvas0.png`, `r1h-tc036-daily-canvas.png`, `r1h-tc036-framesheet.png`,
  `r1h-tc036-frame-retry.png`.
- **O-27 (R1-h, TC-018): Swipe Collage strings are not localised.** In zh-Hant, ja and de the Collage room is
  translated (拼貼, 全部, 新增, 秋天…) but the banner 「Try Scrollable Collage!」 / 「Swipe-able multi-page collage」, the
  Template Page title 「Scrollable Collage」, categories 「Year End」 「Daily」 「Travel」 and 「n photos · 1 pages」 stay
  English. Evidence: `screenshots/r1h-tc018-zh-templates.png`, `r1h-tc018-de-templates.png`.
- **O-28 (R1-h, TC-039 / TC-018): Edit Room restore dialog keeps coming back after 「Cancel」.** After the TC-039
  force-stop, 「Do you want to continue editing?」 / 「You have an unsaved image from a previous edit.」 (Cancel /
  Continue) was cancelled at 16:18, yet every later launch (zh-Hant, ja, en, de, plain) showed it again (translated
  each time) until it was cancelled once more at the plain launch. Outside Swipe Collage (Edit Room); not re-checked
  further. Also: a cold launch on Free shows a full-screen ad (closed with 「Close」), and Home then `activate` lost
  an edited canvas again (O-21).
