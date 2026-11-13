# Run state — R1 First full run of v1 (build 20.19.0 / 90201900)

Table: library/phd/ai-hair-color-custom/android/cases.csv
Started: 2026-11-13T02:05:52.338Z

## Environment
(build, server, device, tier, credit balance, Pink toggles, Log stage timings, Write Log)

## Checkpoints

### 2026-11-13T02:11:16.477Z · next TC-005 (R1-b)
{"Blocked":10,"Not run":75}

R1-a done (5 Blocked test-data: no Intro Demo on either entry). Build 20.19.0/90201900, Test Server (Launcher debug line 'NetworkManager Test Server'). Account Free (Mine shows 'Upgrade to Premium!'), credit chip 1994 at 10:09 and 10:10 (colour page and Mine › My Credits). AI Hair Color reached by: Launcher AI Photos tab › 'AI Hair Color' (or Home hero 'Dye Your Style', actionUrl /navigate/page?name=ai_hair_color) → picker with recommendation sheet ('Continue', its 'Don’t show again' left unticked) → photo → colour page (Solid/Multicolor, Custom first chip, Generate 6). Recipe: android/recipes/open-hair-color.steps. X on the colour page lands in the Edit Room (O-1). Phone left on Launcher Mine tab. Logs pulled R1-a-20261113-101045; feature.json fixed (invalid JSON escape broke log-slice) and timing pattern set to AIHairColor|ai_hair_color|PANEL_AI_HAIRCOLOR. Nothing generated, no credits spent.

### 2026-11-13T02:23:06.244Z · next TC-017 (R1-c)
{"Blocked":13,"Fail":4,"Pass":6,"Not run":62}

R1-b done: 6 Pass, 4 Fail (TC-005/012/015 no slanted-face warning even at 45 deg, face detect runs 'faceNum 1'; TC-009 copy 'No face detected. A face is required for this feature.'), 3 Blocked defect upstream TC-005 (TC-006/087/007). Too-small warning works ('The face in this photo is too small or blurry, which may result in poorly generated results.'), too-big blocks, no-face before ratio, ratio dialog 'Crop to Continue' / 'Cancel' / 'Go to Crop' at >16:9, Crop room re-checks the face. Account Free, chip 1994 at 10:22 (nothing generated). New fixture hc_tilted45_4x5.jpg (first in the HairColor album; album order otherwise alphabetical: closeup, closeup_tilted30, pano_noface, pano_tilted, portrait, smallface, tilted30, wide16x9, wide2x1, wide4x1). Picker remembers the last album (HairColor). Ratio 'Cancel' and Back/X on the colour page land in the Edit Room (O-1..O-3). Phone left in the Edit Room with hc_wide4x1. Logs pulled R1-b-20261113-102252, sliced; logcat live capture still running.

### 2026-11-13T02:36:45.508Z · next TC-045 (R1-d)
{"Blocked":13,"Fail":18,"Pass":19,"Not run":35}

R1-c done: 13 Pass, 14 Fail (12 defect, 2 question: TC-017 Q-2 wand icon / first template is 'Soft Black' not 'Platinum'; TC-085 Back leaves room, Q-14). Main defects: colour rows enabled before a style (TC-021); Ombre+Base only enables Generate and the 'Both Base Color and Highlight Color are required.' text never shows (TC-026/027); collapse (︽ key, not ⌄) closes the panel but never selects Custom nor shows its colours (TC-038, upstream for TC-041/042 cell checks); tapping the photo does not collapse (TC-039); palette has no eyedropper (TC-031/035); system Back in palette or panel leaves the room into the Edit Room (TC-086/085); panel corners square and ✕↩↪✓ row stays under it (TC-019/020). Settings kept across template taps and reset on leaving (TC-041/042/043 parts hold). Palette colours persist as extra swatches (O-7). No generation; TC-021's Generate tap did nothing; chip 1994 before/after and at 10:35 (= Mine › My Credits 1994). Account Free. New recipes pick-portrait.steps (Launcher → colour page with hc_portrait_4x5) and reopen-portrait-from-edit-room.steps (Edit Room → Launcher); device do cannot nest recipes. Phone left on Launcher › Mine. Logs pulled R1-c-20261113-103622, sliced (UI-only cases, no feature lines, no charge in window).

### 2026-11-13T02:57:51.645Z · next TC-062 (R1-e)
{"Blocked":15,"Fail":29,"Pass":26,"Not run":15}

R1-d done: 7 Pass, 11 Fail (defect), 2 Blocked (observability). Defects: no 'Applying your new hair color...' text and no staged reassuring text (scan bar only), Custom wait 47.6-51.5 s; no Intensity bar anywhere (panel open or collapsed, Custom or template), so TC-047/048/049/053/054 Intensity parts fail and no one-time Intensity dialog (TC-057); collapse selects Soft Black so outer Generate makes a template (TC-040); Custom result not recalled after a template (TC-054); X and system Back on a result ask 'Discard changes?' then land in the Edit Room (TC-079/088). Pass: Detail ledger (TC-050), template 16.1 s (TC-078), Artwork key opens AI Hair > Color (TC-055), check opens new Edit Room (TC-056), 5 rapid taps = 1 generation (TC-051), Back ignored during wait (TC-089), force-stop keeps charge, no recall (TC-052; but result lands in My AI Artwork, O-11). TC-036/037: log has no request body (observability). hc_* fixtures rejected (CONTENT_REJECTED, refunded); generations use Pexels portrait via recipes pick-pexels-portrait(.steps + keyevent 66 + -2.steps) (O-10). Chip 1994 -> 1958 (6 successful charged generations: 2 refunded rejections; credit chip not refreshed after refund, O-9). Account Free. Phone left on the colour page with the Pexels photo (nothing generated, Soft Black selected). Logs pulled R1-d-20261113-105716, sliced; logcat live capture running. Next: R1-e.

### 2026-11-13T03:15:57.832Z · next TC-073 (R1-f)
{"Blocked":19,"Fail":29,"Pass":33,"Not run":4}

R1-e done: 7 Pass, 4 Blocked test-data (premium styles on a Free account). Style names on this build mapped by thumbnail: highlights=Babylights, split_dye_vertical=Half-and-half (left/right thumb), split_dye_horizontal=Split-dye (top/bottom thumb). Pass with Pexels hat portrait, Base dark brown + Highlight purple (Solid: palette pure red): Ombre TC-062, Solid TC-063, Dip-dye TC-064, Roots TC-065, Earloop TC-066, Split-dye TC-068, Babylights TC-060; waits 46-56 s, each charged 6 (server totalRemain matches). Blocked: Balayage TC-061, Face framing TC-058, Bangs TC-059, Half-and-half TC-067 carry crowns, show 'UNLOCK TO VIP' and Generate opens 'PhotoDirector Premium' paywall (closed with X, nothing charged) - useful for R1-f TC-069 (O-15). O-13: every Custom style logs the same style id Style_010_Custom_HairColor_gpt-image-2.5-sunburst. O-14: palette colour replaces the earlier extra swatch. Account Free, chip 1958 -> 1916 (7 x 6). Phone left on the colour page with the Babylights result (panel collapsed, Soft Black selected, nothing saved). Logs pulled R1-e-20261113-111543, sliced (blocked windows show only doVerifyPurchase OK from the paywall); logcat live capture running.

### 2026-11-13T03:19:34.497Z · all recorded
{"Blocked":22,"Fail":29,"Pass":34}

R1-f done: 1 Pass, 3 Blocked test-data. TC-069 Pass: Free account, Balayage (crown) shows 'UNLOCK TO VIP', Generate opens 'PhotoDirector Premium' paywall (Monetize_Subscription_Appear 11:17:53), closed with X, nothing charged (totalRemain 1916 before/after). TC-070/071/073 Blocked test-data: balance 1916, Free, no VIP; the KP-105 reset needs the user's go-ahead (not done). Account Free, chip 1916 at 11:17. Phone left on the colour page with hc_portrait_4x5, Custom panel open (Balayage). Logs pulled R1-f-20261113-111915, sliced (TC-069 window: only DB cursor noise, no charge); logcat live capture running. Round R1 complete: 0 Not run.
