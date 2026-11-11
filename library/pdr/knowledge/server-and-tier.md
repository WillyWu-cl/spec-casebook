# Server and tier

## KP-004 Switching the tier on iOS
- kind: howto · platform: ios · use: analysis, run · tags: tier, pink
- source: analysis.md verdict rule 5 (spec agent rules, 2026-10-19); exploration KB ai-mini-drama.md (2026-10-08: default and reset)

Launcher › Pink › ☰ › `[0] IAP` › 「status」: Follow account / Free / Pro / Pro+; it defaults to 「System (lock button
in debug mode)」 and returns to it on relaunch unless set again. Verify the tier in Mine and restore the
previous value after the tier group. No purchase or extra account is needed.

## KP-005 Stage or Production on Android
- kind: howto · platform: android · use: run · tags: server
- source: run-android.md › Server (user, 2026-10-28)

An empty `testserver.config` in `/sdcard/cyberlink/PDR/` means Stage at the next launch; absent means Production
(`/sdcard/cyberlink/tester.config` holds the SR code and is not the switch). Put it in place before the first launch
of a fresh install: a first launch on Production creates the credit ID there and Stage then rejects signed-out turns
(`403 "Fail to verify uuid"`); `adb shell pm clear <package>` makes a new ID. On Stage the Launcher's top bar is
yellow, on Production dark.

## KP-006 Android tiers and chat limits
- kind: fact · platform: android · use: analysis, run · tags: tier, quota, billing
- source: analysis.md verdict rule 10 (team, 2026-10-19) · verified: 16.9.0 build 2611091 (2026-11-10; Pro via Play, 「You're on the highest plan」; chat limits not checked)

Android sells Pro, not Pro+, through Google Play billing; the tier comes from the signed-in account. Daily chat limits
are server-configured: Free 10, Pro 100.

## KP-068 A Play test subscription ends within hours
- kind: quirk · platform: android · use: run · tags: tier, billing, subscription
- source: Video Enhance Android run 2026-11-10-r1-full O-30 · verified: 16.9.0 build 2611091 (2026-11-10)

A Pro test subscription bought on the shared test account (`yearly_sub_usd34.99_yfree_202307`, 17:08) had ended by
22:37 the same day: the next launch opened the 「PowerDirector Pro」 paywall and the Pro tab read 「Free」 「Claim
offer」. Run Pro rows early and check the tier at each segment start; Free rows can follow.
