# TR261105-0062 verify plan (REQ-093)

One bug, one short journey on the Samsung Galaxy A53 (R5CTB22S05Y, Android 15), Stage, no credits or chat turns.

1. Download the TR build (OneDrive zip, MD5 checked), keep Stage's `testserver.config` in `/sdcard/cyberlink/PDR/`.
2. Uninstall PowerDirector (REQ-047 allows it on Android; data and History are wiped), install the official 2611052 APK.
3. Launch: GDPR 「Get Started」, allow permissions, check the Launcher bar is yellow (Stage).
4. Tap 「AI Mini Drama」 on the Launcher → **P0422** (intro page, demo video, Don't show again, Try It Now).
5. One step past it: Try It Now opens the landing; ‹ / system Back returns to the Launcher; volume icon; 「Don't show
   again」 ticked → the next tap goes straight to the landing (R-472). Side effects: look at every screenshot.
6. Sign in with the phone's Google button, read the account and tier from ☰.
