# Batch Editing (Android) — what the phone needs before a run

What a run needs on the phone or the account, because none of it can be committed. Check it before the first segment;
a new row that needs a new photo or account state adds it here in the same draft.

## Phone, app and account
- Phone: Samsung Galaxy S23 (SM-S9110, adb serial RFCW2198L7B, Android 16, 1080 × 2340), on USB, Stay awake on, no
  PIN. A Pixel 8a is also on adb: always pass the serial.
- PhotoDirector for Android 20.19.0 (90201900), installed 2026-11-09 (user: test this build). The Launcher shows the
  Test Server labels.
- Tier without signing in (user, 2026-11-09; KP-105): Edit Room › Settings › About, tap the backdoor button under ‹
  until the debug dialog opens, then 「set to subscriber」 on = Premium, off = Free; OK, close and reopen the app.
  Change no other debug option (never reset UUID or member token mid-round), screenshot before / after with UUID and
  token masked. Rows run as Premium; segment R1-g switches to Free and back.
- AI Enhance charges no credits (R-004): read the balance before and after, never buy credits.

- Second phone (round R2, 2026-11-11): Samsung Galaxy A53 5G (SM-A5360, adb serial R5CTB22S05Y, 1080 × 2400),
  same build 20.19.0 (90201900); Stay awake on.

## Photos in the gallery
| Photo | Used by | Notes |
| --- | --- | --- |
| At least 25 photos of mixed orientation | Picker, room, Enhance, Save rows | The phone's own gallery (≈3,000 photos) |
| Section 3 stand-ins ① – ④ in album 「Casebook」 (`/sdcard/Pictures/Casebook/`): `casebook_s3_1_escalator_2x3_1706x2559.jpg`, `casebook_s3_2_101_4x5_1576x1970.jpg`, `casebook_s3_3_teacup_1x1_800x800.jpg`, `casebook_s3_4_seascape_16x9_2730x1535.jpg` | TC-048 – TC-061, TC-149 | Generated 2026-11-09 at the exact sizes of PM's Section 3 photos (user approved stand-ins); grid every 100 px, coloured corner discs and a centre dot to read box positions. Select them in the order ① ② ③ ④. On the SM-A5360 regenerated 2026-11-11 at the same names and sizes (PIL: plain colour, 100 px grid, red / green / blue / yellow corner discs at top-left / top-right / bottom-left / bottom-right, white centre dot), pushed with `adb push` and a media-scan broadcast |

## Network
- Offline rows (TC-106 – TC-108) turn Wi-Fi off with `device-android.ts wifi off` only while adb sees the phone over
  USB; turn it back on right after and confirm the app is online.
