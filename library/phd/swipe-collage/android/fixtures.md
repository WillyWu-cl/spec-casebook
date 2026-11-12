# Swipe Collage (Android) — what the phone needs before a run

What a run needs on the phone or the account, because none of it can be committed. Check it before the first segment;
a new row that needs a new photo or account state adds it here in the same draft.

## Phone, app and account
- Phone: Samsung Galaxy S23 (SM-S9110, adb serial RFCW2198L7B, Android 16, 1080 × 2340), on USB, Stay awake on, no
  PIN. Always pass the serial; run device and adb commands with `MSYS_NO_PATHCONV=1` in Git Bash.
- PhotoDirector for Android 20.19.0, versionCode **90201900**, fresh install by the user on 2026-11-12 10:28 (replaced
  90201901, which had been updated over the 2026-11-02 install), or the TR's build; the Launcher shows the Test Server
  labels.
- Entry on 20.19.0: Launcher tool grid, page 2 › 「Collage」 › banner 「Try Scrollable Collage!」 (「NEW」, 「›」) above
  the first category. No Swipe Collage shortcut on the Launcher (TC-004 checks it).
- The banner crashed the app on the 90201901 upgrade install (2026-11-12 probe, O-1: `SQLiteException: no such table:
  SwipeCollageTemplateContract`). On the 90201900 fresh install (R1-a) it opens the Template Page with no crash.
- Template thumbnails and Template Preview images are blank on 90201900 (TC-011, TC-021): pick templates by their
  label (「n photos · n pages」) and category, not by picture.
- Accounts (the user signs in; the agent never types a password):
  - **Premium** (PhotoDirector Premium) for R1-a – R1-f: TC-064 – TC-068, TC-172, TC-136, TC-179, TC-147, TC-153 need
    it; the other rows there run on any account. On 2026-11-12 (probe) the phone was **signed out**, 1723 credits; after the
    reinstall (R1-a, 10:30–10:47) still **Free / signed out**, Mine 「Upgrade to Premium!」, credits 0 then 300
    (monthly giveaway). Premium is still needed before R1-c.
  - **Free** = the phone signed out (R1-g: TC-025, 061 – 063, 093, 105, 145 – 146, 149 – 152, 154, 168). The agent
    signs out of Premium at the start of R1-g.
  - **Fresh free-export counter** (TC-145, TC-146, TC-154): `adb shell pm clear com.cyberlink.photodirector` on the
    signed-out phone, as the last step block of R1-g (it wipes local projects and settings; Premium needs the user's
    sign-in again afterwards).
- Credits: one generation per row is allowed (Enhance, about 5 credits under 「Advanced」, TC-065 / TC-067 / TC-172;
  Removal TC-064 / TC-067 / TC-155); record the balance before and after. A row needing many credits or a purchase
  is parked. Never buy; never tap the Menu's QA consume / purchase rows; IAP pages are only viewed and closed.
- Appearance: the user allows switching the phone's system dark / light theme for TC-186 / TC-187 (2026-11-12). Note
  the original theme first and restore it after those rows. The app also has Settings › 「Appearance」 (Q-31).
- App language (TC-018): `launch --lang zh-Hant|ja|en|de` (per-app language on Android 16), then plain `launch`.

## Photos in the gallery (checked 2026-11-12: 1843 images, 659 videos)
| Need | Used by | On the S23 |
| --- | --- | --- |
| 21+ photos for one picker session (limit 20) and 7 for TC-046 | TC-045, TC-046 | yes (album `PhotoDirector` 759, `Camera` 34, `00PHDa_Testing_Material` 24) |
| Enough photos to fill a 10-page canvas and 5-page canvases | TC-045, TC-136 – TC-146 | yes |
| Portrait, landscape and square photos | frame fit, image focus, Ratio | 1283 / 348 / 212 |
| A photo with an object to remove and one soft enough to enhance | TC-061 – TC-068, TC-172 | yes (pick from `00PHDa_Testing_Material`) |
| A photo with clear colours for the eyedropper | TC-095 | yes |
| Stock tab photos (network) | TC-171 | online |
| Videos, GIFs and tiny images (not asked by the table; note if the picker lists them) | — | 659 videos, 7 GIF, 52 under 300 px |

## Share targets
Installed: Instagram, Facebook, X (`com.twitter.android`), LINE. **TikTok is not installed** (TC-183 parked).

## Not available
- Deeplink URLs for `scrollable_collage` / `category_guid` / `template_guid` (TC-005 – TC-008, Q-10).
- TikTok (TC-183).
