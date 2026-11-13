# AI Hair Color Custom (Android) — what the phone needs before a run

What a run needs on the phone or the account, because none of it can be committed. Check it before the first segment;
a new row that needs a new photo or account state adds it here in the same draft.

## App, build and account
- PhotoDirector for Android 20.19.0 (versionCode 90201900), the build installed on the phone (user, 2026-11-13: test
  the installed build; no TR named).
- Phone: Samsung SM-S9110 (adb RFCW2198L7B), Android 16, on USB, Stay awake on.
- The signed-in account has credits (user, 2026-11-13); no round-start reset (KP-104 is waived for this round).
  One Custom generation costs 6 credits (R-040); round 1 needs about 22 generations ≈ 130 credits. When the balance
  runs below 6, the remaining generation rows are Blocked `--as test-data` and the low-balance rows can run.
- Free / VIP with fewer than 6 credits (TC-069 – TC-073): only through the KP-105 debug-dialog reset, which needs the
  user's go-ahead (it drops the account's credits); held in R1-f.
- Never buy credits, never type a password, never tap the QA consume / purchase rows.

## Photos in the gallery (`/sdcard/Pictures/HairColor/`, made 2026-11-13 from the stock portrait in Pictures)
| Photo | Used by |
| --- | --- |
| `hc_portrait_4x5.jpg` — one clear, front-facing face | every 「ROOM」 row, TC-017, TC-015 (after a tilt) |
| `hc_tilted30_4x5.jpg` — face rolled 30° | TC-005, TC-006, TC-007, TC-087, TC-015 |
| `hc_tilted45_4x5.jpg` — portrait rotated 45° (added in R1-b, 2026-11-13; sorts first in the album) | TC-005 retry |
| `hc_smallface_4x5.jpg` — face about 1/15 of the width | TC-008 |
| `casebook_s3_3_teacup_1x1_800x800.jpg` (Pictures/Casebook) — no face | TC-009 |
| `hc_closeup_4x5.jpg` — face fills the frame | TC-010 |
| `hc_pano21x9_tilted.jpg` — 21:9 with a slanted face | TC-011, TC-012 |
| `hc_pano21x9_noface.jpg` — 21:9 seascape | TC-013 |
| `hc_closeup_tilted30_4x5.jpg` — close-up, tilted 30° | TC-014 |
| `hc_wide16x9.jpg`, `hc_wide2x1.jpg`, `hc_wide4x1.jpg` — front-facing face | TC-016 |

## Not available this round
- Server failure 4002 / other (TC-075, TC-076): no fault switch on PhotoDirector Android.
- Custom deeplink (TC-081, TC-082): link format not given by RD (Q-11).
- CMS list of PhDM_AIHairColor_CustomStyle (TC-084): not given (Q-13).

**Generations (R1-d, 2026-11-13):** the hc_* photos are rejected by the Custom generation as content violations
(Shutterstock watermarks, O-10 of run 2026-11-13-r1). Generate on the Pexels stock portrait reached by
`recipes/pick-pexels-portrait.steps` (then adb keyevent 66) and `recipes/pick-pexels-portrait-2.steps`.
