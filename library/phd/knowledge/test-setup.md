# Round-start setup

## KP-104 A round starts as a free user with 0 credits
- kind: howto · platform: both · use: run · tags: setup, account, credits
- source: PHD domain test-setup.md (user, 2026-10-16; the source labels it K36) · aka: K36

Check once per round, before its first case and separately for each platform's round: free user and balance 0. Do
not redo it per case, nor when the round's plan later switches the subscription or buys test credits.

## KP-105 Resetting the account through the debug dialog
- kind: howto · platform: both · use: run · tags: setup, debug, account
- source: PHD domain test-setup.md (user, 2026-10-16)

Edit Room › Settings › About: tap the backdoor button under [<] until the debug dialog opens. Turn 「set to
subscriber」 off, reset UUID and member token each with the 「rest」 button in its own row, tap OK, close and reopen
the app (never clear app data). Check again; if it cannot be confirmed, record the setup Blocked `--as test-data`.
On Android 20.19.0 Settings is the Launcher gear (top right), and the dialog is reached as in KP-131.

## KP-106 The account reset is setup, not a row
- kind: howto · platform: both · use: run · tags: setup, privacy
- source: PHD domain test-setup.md (user, 2026-10-16)

Never a table row or a per-case cleanup, never a mid-round recovery after works, spends or a pending payment. Keep
before / after screenshots and a log line; mask UUID and member token. Change no other debug option. On the QA
iPhone it replaces reinstalling.

## KP-131 Switching Free / Premium on Android with 「Set to subscriber」
- kind: howto · platform: android · use: run · tags: setup, debug, tier, subscription
- source: user 2026-11-09 (chat; inbox I-002) · verified: 20.19.0 (90201900) (2026-11-10)

No sign-in needed. Launcher gear (top right, `topToolBarSettingBtn`) › About: tap repeatedly just below the ‹ button
until the debug dialog opens; turn 「Set to subscriber」 on (Premium) or off (Free), tap OK, then relaunch the app.
Mine shows 「Hello VIP!」 for Premium, 「Upgrade to Premium!」 for Free; the credit balance is unchanged. Change no
other debug option (KP-106).

## KP-132 TR builds cannot update a Play Store install
- kind: quirk · platform: android · use: run · tags: setup, install
- source: orchestrator, i2v-reuse R1 setup 2026-11-09 (inbox I-001) · verified: 20.19.0.v202611061839 (2026-11-09)

A PhotoDirector installed from the Play Store (20.18.0 on the SM-A5360) is signed with a different key from a TR
build: `adb install` fails 「INSTALL_FAILED_UPDATE_INCOMPATIBLE」 and the store app has to be uninstalled first.

## KP-133 Credits do not survive an uninstall without sign-in
- kind: quirk · platform: android · use: run · tags: setup, credits, install, uuid
- source: orchestrator, i2v-reuse R1 setup 2026-11-09 (inbox I-001; second-hand, one occurrence) · verified: 20.19.0.v202611061839 (2026-11-09)

6,000 test credits added on a not-signed-in install were gone after uninstall and reinstall: the Image to Video pill
and Buy Credit › My Credits both read 0, with no sign-in prompt on the way. The balance looks tied to the install's
UUID, not an account (not confirmed). Plan credits again after any reinstall.
