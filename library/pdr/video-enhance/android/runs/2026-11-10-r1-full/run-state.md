# Run state — R1 Round 1: first full run of Android v4 on 16.9.0 (2611091), TR261109-0041

Table: library/pdr/video-enhance/android/cases.csv
Started: 2026-11-10T09:10:34.669Z

## Environment
(build, server, device, tier, credit balance, Pink toggles, Log stage timings, Write Log)

## Checkpoints

### 2026-11-10T09:28:48.465Z · next TC-030 (R1-b)
{"Pass":9,"Fail":6,"Blocked":20,"Not run":133}

R1-a done 17:29. Tier Pro (Mine 「You're on the highest plan」 at 17:11), 27,852 credits (pill, 17:27), nothing charged (log-slice: 0 authorised, 0 failures). Demo page DISMISSED for good: TC-013's 「Don't show again」 tick was saved on ‹ (Launcher and AI Magic now open Add Media directly; restoring needs pm clear, not done). Panel opened ~12 times in R1-a (first at TC-258 ~17:16, 10 s video); no first-run bubble seen in any screenshot, so TC-030's 'panel never opened' precondition no longer holds (O-4). File/media permission granted at TC-010. No Enhance task started; Recent task empty. A throwaway editor project exists (ve-022999-1080p30, from TC-003). Google Drive/Photos OAuth not granted. Logs pulled to logs/R1-a-20261110-172759 (logcat-live); feature.json files regex extended to logcat-live.txt so log-slice reads Android pulls. Phone on the Launcher.

### 2026-11-10T09:50:13.944Z · next TC-050 (R1-c)
{"Pass":26,"Fail":13,"Blocked":20,"Not run":109}

R1-b done 17:50. Tier Pro (Pro tab 「You're on the highest plan…」 at 17:31), 27,852 credits (pill, 17:49), nothing charged (log-slice: 0 credit lines). Demo page still dismissed. First-run bubble: shown by itself once in R1-a at TC-020 17:17:48 (logcat PopupWindow 3.0 s, judged in TC-030); never again. No Enhance task started; Recent task empty. Logs pulled to logs/R1-b-20261110-174956. Haptics are readable with adb shell dumpsys vibrator_manager (app TOUCH effects with times). Grid positions in Add Media follow MediaStore date_modified desc (content query) - use that to find a fixture. Phone on the Launcher, logcat capture still running.

### 2026-11-10T10:12:04.886Z · next TC-080 (R1-d)
{"Pass":50,"Fail":14,"Blocked":20,"Not run":84}

R1-c done 18:11. Tier Pro (Mine 「You're on the highest plan…」 at 17:51), 27,852 credits (pill on every panel through 18:10), nothing charged (log-slice: 0 credit lines, 0 failures). Demo page still dismissed; first-run bubble not seen again. No Enhance task started; Recent task empty. Logs pulled to logs/R1-c-20261110-181126. Add Media › casebook-ve grid order = MediaStore date_modified desc; a helper that scrolls by rows (fingerdrag 342 px/row + 76 px touch slop) and taps by index worked for every pick (verify with the panel badge). Panel trims: adb motionevent drags with an overshoot-and-return move the handles by single seconds (~0.585 s/px on the 12:30 strip); the Preview time shows the dragged handle's time. O-7 (prices one second high on some exact-length files) and O-8 (02:30 always 150.x s) added. Phone on the Launcher, logcat capture still running.

### 2026-11-10T10:21:35.517Z · next TC-110 (R1-e)
{"Pass":54,"Fail":16,"Blocked":19,"Not run":79}

R1-d done 18:21. Tier Pro (Pro tab 「You're on the highest plan…」 at 18:13), 27,852 credits (pill, 18:20), nothing charged (log-slice: 0 credit lines, 0 failures). TC-091 run (account is Pro, Android's top plan) instead of its up-front block. Demo page still dismissed; first-run bubble not seen. No Enhance task started; Recent task empty (「No Generated Videos」). Wi-Fi turned off for TC-100 at 18:19 and back on at 18:20 (17F_QA_Wifi_5G, app online: credit list loaded 18:20:50). Add Media grid order: MediaStore date_modified desc, ties by _id ascending (pos1 ve-000299, pos2 ve-000101, pos3 ve-000090, pos4 ve-000050, pos5 ve-022999, pos6 ve-000396, pos7 ve-000399 …); the two ve-real-000320 / ve-real-0130 files are not at the top despite newer date_modified. O-3 (1440p 18 vs 4K 15) not reached: left for later (O-10). O-9: Back from Recent task went to the Launcher once (recheck in TC-208). Logs pulled to logs/R1-d-20261110-182116. Phone on the Launcher, logcat capture still running.

### 2026-11-10T10:54:15.999Z · next TC-140 (R1-f)
{"Pass":66,"Fail":20,"Blocked":19,"Not run":63}

R1-e done 18:54. Tier Pro (Pro tab 「You're on the highest plan…」 at 18:23). Balance 27852 at the start → 27604 after this segment's charges (−180 18:24 ve-real-0130 1:30, −4 18:37 and −4 18:46 ve-real-000320, −30 18:38 gopro cancelled with Leave, −30 18:44 gopro backgrounded with Home, all 「Video Enhancer / PowerDirector (Android)」 in Credit Details, stamped at the Enhance tap), then 29604 after a 「Credit Pack (2000 credits) +2000」 row at 18:51 that this phone did not buy (shared account, O-16). Tasks left in Recent task for R1-f (none deleted): 「AI Video Enhance 1110」 1:30 (ve-real-0130-1080p30, TC-110's source, done ~18:42, View), two 0:04 ve-real-000320 results (View; one opened and played), one failed card from the Leave (blank thumbnail, 「3961:06:40」, 「Retry」, not tapped). All have the same name. Demo page still dismissed; first-run bubble not seen. Wi-Fi untouched (no Wi-Fi rows in R1-e). Notifications allowed (TC-118–120 / TC-211 stay Blocked). Several system notifications from PowerDirector in the shade (ids 2, 4; id 6 tapped). Logs pulled to logs/R1-e-20261110-185356. Phone on the Launcher, logcat capture still running. O-11 – O-16 added.

### 2026-11-10T11:17:45.417Z · next TC-223 (R1-g)
{"Pass":74,"Fail":28,"Blocked":19,"Not run":47}

R1-f done 19:17. Tier Pro (Pro tab 「You're on the highest plan…」 at 18:56). Balance 29604 at the start → 29567 (Pro tab 19:16) after three charges, Credit Details 「Video Enhancer / PowerDirector (Android)」 −2 19:08 (TC-265, ve-000100), −4 19:11 (TC-266, ve-000320), −31 19:13 (TC-267, ve-0030); nothing else since the 18:51 pack (O-16, O-17). Recent task now holds 8 cards, all 「AI Video Enhance 1110」, newest first: 0:31, 0:04, 0:02 (R1-f, View), 0:04 View, two failed 「3961:06:40」 「Retry」 (R1-e gopro Leave and Home; not tapped, O-18), 0:04 View, 1:30 View. None deleted. Saved to gallery: the 1:30 result (Movies/cyberlink/PowerDirector/Video Enhance/, pulled to exports/TC-152-saved.mp4). Projects made: 「Project 11-10」 00:03 (TC-153) and 「Project 11-10(1)」 01:30 (TC-152). Picker folder last used: casebook-ve (casebook-ve grid: pos 28-30 = 00:03 / ve-000100 00:01 / ve-0030 00:30 at row 10 after three fingerdrags 540,1900→540,798; ve-000320-720p30 is the last item, pos 43). Use id tv_premium for the Pro tab (lbl Pro hits New Project, O-22). Demo page still dismissed; first-run bubble not seen. Wi-Fi untouched. Notifications allowed. Logs pulled to logs/R1-f-20261110-191722. Phone on the Launcher, logcat capture still running. O-17 – O-22 added.

### 2026-11-10T12:27:08.318Z · next TC-238 (R1-g2)
{"Pass":74,"Fail":46,"Blocked":19,"Not run":29}

R1-g1 done 20:27. Tier Pro (Pro tab 「You're on the highest plan…」 at 19:20). Balance 29567 → 29359 (Pro tab 20:26) = −208, 18 Credit Details rows 「Video Enhancer / PowerDirector (Android)」 19:21 – 20:22 (4, 8, 12, 4, 8, 24, 4, 8, 32 for Natural then the same for Sharp), nothing else seen in between; the Mine › Credit page shows an unclaimed 「Complimentary daily credits ‹Claim›」 (not tapped). Logcat: 18 create-session 200, 18 applyEffect Done, no failures. Recent task now holds 26 cards (18 new 0:04 「AI Video Enhance 1110」 on top, all View). Saved files: 18 in Movies/cyberlink/PowerDirector/Video Enhance/ (VideoEnhance - Nov 10 - 7 … 24), plus an unscanned auto-copy per task (O-23) and one extra from TC-223's second save; pulled to exports/TC-<ID>.mp4, source pulled to exports/src-ve-real-000320.mp4. Picker folder last used: casebook-ve-real (ve-real-000320-720p30 = pos 2, tap 540,750). Panel chips sit under the CTA bar: scroll the panel (fingerdrag 540 1500 540 900) before tapping fps / resolution by id, scroll back (540 1000 → 540 1700) before the trim drags (right handle 978,1160 → 140; back 186,1158 → 1040). Completion read from logcat 「applyEffect status: Done」 (waitfor misses the banner while Recent task is open); toast caught with adb screencap right after an adb tap on Save Result (224,1960). Demo page still dismissed; first-run bubble not seen. Wi-Fi untouched. Logs pulled to logs/R1-g1-20261110-202644. Phone on the Launcher, logcat capture still running. O-23 – O-27 added.

### 2026-11-10T14:36:03.729Z · next TC-160 (R1-h)
{"Pass":74,"Fail":64,"Blocked":19,"Not run":11}

R1-g2 done 22:35. Tier Pro (Pro tab 「You're on the highest plan…」 at 20:28). Balance 29359 → 28411 (Pro tab 22:34) = 18 Credit Details rows 「Video Enhancer / PowerDirector (Android)」 20:30 – 22:24 totalling −1008 (8, 16, 48, 16, 32, 96, 32, 64, 192 for Professional Natural, then the same for Sharp) plus two 「Generation failed, credits returned +30」 rows at 21:40 and 22:00 that no R1-g2 action caused (O-29: likely R1-e's two failed gopro tasks refunded late; TC-113 / TC-115 to recheck). Logcat: 18 applyEffect Done, no failures. Recent task now holds 44 cards (18 new 0:04 「AI Video Enhance 1110」 on top, all View). Saved files: 18 more in Movies/cyberlink/PowerDirector/Video Enhance/ (VideoEnhance - Nov 10 - 25 … 42, each with its unscanned auto-copy, O-23), pulled to exports/TC-<ID>.mp4. Picker folder last used: casebook-ve-real (ve-real-000320-720p30 = pos 2, tap 540,750). Professional is tapped first (chip_mode_professional is on screen); the trim drag only works with the trim track at y 1023 (after scrolling the panel down for chips, scroll back twice). Credit Details can lag one row (TC-249, re-read at TC-250). Demo page still dismissed; first-run bubble not seen. Wi-Fi untouched. Logs pulled to logs/R1-g2-20261110-223518. Phone on the Launcher, logcat capture still running. O-28 (Professional Sharp = Professional Natural) and O-29 added.

### 2026-11-10T14:41:55.379Z · next TC-090 (R1-i)
{"Pass":76,"Fail":64,"Blocked":24,"Not run":4}

R1-h done 22:42. Tier FREE: the Pro test subscription ended between 22:34 and 22:37 (O-30): relaunch opened the Pro paywall (closed with ‹, nothing bought), Pro tab 「Free」 「Claim offer」, panel CTA 「Unlock Pro to Enhance」. Balance 28411 (Pro tab 22:38), nothing charged (log-slice 0 credit lines). TC-160, 161, 162, 164, 165 Blocked test-data (need Pro; rerun when paid again, needs ve-0500 / ve-1000 / ve-0030 projects, none made yet). TC-163, TC-213 Pass on Free in 「Project 11-10」 (00:03 clip; clip toolbar › Enhance › AI Video Enhance; badge 0fps, O-31). Recent task unchanged (44 cards). Demo page still dismissed. Wi-Fi untouched. Logcat restarted cleanly at 22:37; logs pulled to logs/R1-h-20261110-224140. Phone on the Launcher, logcat capture still running.

### 2026-11-10T14:51:47.546Z · all recorded
{"Pass":79,"Fail":66,"Blocked":23}

R1-i done 22:51. Tier FREE (Pro tab 「Free」 「Claim offer」 at 22:43, id tv_premium), 28411 credits throughout, nothing charged (log-slice: 0 authorised, 0 failures; one harmless checkFeatureCredit JsonSyntaxException in TC-004's window). TC-004 rechecked on Free (R1-a Blocked replaced): clip toolbar › Enhance shows a 「Pro」 badge on AI Video Enhance, Fix Shake and AI Color (not 「Pro+」) → Fail question. TC-090 Pass (「Unlock Pro to Enhance」 + 「Charge 1 credits per second」, opens 「PowerDirector Pro」 IAP, no tabs), TC-093 Fail question (no Pro/Pro+ tabs, no Tap to compare, 「POPULAR」 58% OFF), TC-094 Pass (‹ back unchanged, ve 15:01 00:32–05:32 Sharp), TC-206 Pass (system Back same). Nothing bought; Continue never tapped. Recent task unchanged (44 cards, Retry not tapped). Demo page still dismissed. Wi-Fi untouched. Logs pulled to logs/R1-i-20261110-225128. Phone on the Launcher, logcat capture still running. No Not-run rows left: R1 ready for its end steps.

### 2026-11-10T15:12:08.675Z · all recorded
{"Pass":79,"Fail":66,"Blocked":23}

R1 wrap-up done 22:58. Tier FREE (Pro test subscription lapsed ~22:35, O-30), 28411 credits, nothing charged or tapped in the wrap-up beyond reading Credit Details (Retry never tapped). Ledger recheck: refunds +30 at 21:40 / 22:00 are TC-113 / TC-115 (~3 h late); TC-113 Pass, TC-115 Fail defect updated. Final 79 Pass / 66 Fail / 23 Blocked. eBug drafts (15) + review page in ebugs/2026-11-10-r1/, not filed. report.md written; REQ-009 and plan Status updated; knowledge inbox processed (KF-001–KF-008). Logcat capture stopped; phone on the Launcher. Pages server on 4386 left running.

### 2026-11-10T15:12:30.100Z · all recorded
{"Pass":79,"Fail":66,"Blocked":23}

--dry
