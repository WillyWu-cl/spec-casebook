# Video Enhance (Android) — what the phone needs before a run

The repository holds everything a run reads on the computer (table, `phases.json`, run plans, scripts). This list is
what has to be on the phone or the account instead, because it can't be committed.

## App, build and account
- The build under test from its Testing Request: the TR's OneDrive folder holds `CL_Deluxe.<build>_<SR>.zip` with the
  APK and `Cyberlink.MD5`. The agent downloads it without asking, checks the MD5 and installs with `adb install -r`
  (run-android.md). Round 1: 16.9.0 (2611091), TR261109-0041.
- Server: Stage, from the empty `/sdcard/cyberlink/PDR/testserver.config` (KP-005); the Launcher bar is yellow.
- Account: Enhance needs a paid tier, and Android has no tier switch (KP-003): the tier is the signed-in account's.
  On the Samsung SM-A5360 (R5CTB22S05Y) the account is cltqauiap2@gmail.com, **Free** on 2026-11-10. Rows tagged
  `paid-tier`, `pro-account` and `low-balance` need accounts in those states; the agent never types a password.
- Credits: a task costs its CTA price (1–2 credits a second in Standard at 30 fps 720p / 1080p, more for 60 / 120 fps,
  4K and Professional). R1-g's 36 combinations of a 3.2 s video cost a few hundred credits in all.
- Purchases (TC-095 Pro, TC-097 credit pack) go through Google Play and need the user's go-ahead each time.

## Videos in the gallery
Made by `node library/pdr/video-enhance/fixtures/make-videos.ts` into `~/.casebook/video-enhance/videos/` (never
committed) and pushed with `--push <serial>` to `Movies/casebook-ve/` (and `Movies/VE test/` for TC-258). Every
length, frame rate and resolution a Precondition names has a file; lengths are whole frames at the file's fps, so quote
the ffprobe length the script prints. Two stand-ins: 「1081p」 is 1920 × 1082 (4:2:0 H.264 needs an even height) and
「not MP4 / MOV」 is an MKV. The 8K file is HEVC. TC-256 / TC-257 use Pexels and Pixabay (network on).

## Phone settings (the user sets these; they are system settings)
- Developer options › USB debugging on, this computer allowed; Stay awake on; no PIN; on the USB cable.
- Notifications for PowerDirector allowed (TC-118 – TC-120 turn them off only with the user's go-ahead).
- System language English; Wi-Fi on (offline rows use `device-android.ts wifi` over USB).

## Real footage (user, 2026-11-10)
`make-videos.ts --real "<the team's v16.7.4 Test clip folder>"` cuts and copies the team's test clips into
`~/.casebook/video-enhance/videos/real/`, pushed to `Movies/casebook-ve-real/`: a 3.2 s 720p 30 fps cut
(`ve-real-000320-720p30`, R1-g's source) and a 01:30 1080p 30 fps cut (`ve-real-0130-1080p30`, TC-110) of real
1080p footage, a 15:00 360p clip, a GoPro 1080p 50 fps clip, a portrait 1080 × 1920 clip, real 1440 × 2560, 4K 60 and
8K 30 (Samsung HEVC) sources for the 2K+ block, and a 480p AVI (not MP4 / MOV). Use them wherever a row judges how the
result looks; the synthetic files stay for exact lengths, frame rates and resolutions.
