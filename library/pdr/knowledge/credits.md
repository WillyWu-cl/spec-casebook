# Credits

## KP-007 A failed generation refunds its credits
- kind: rule · platform: both · use: analysis, run, ebug · tags: credits, refund · authority: team
- source: run.md step 8 (user, 2026-10-19) · verified: 16.9.0 build 2611091 (2026-11-10)

A failed item costs nothing net; a partial failure costs only the items that succeeded. A missing or wrong refund is
a defect with its own eBug, even when the failure itself is already filed.

## KP-008 Reading the credits ledger
- kind: howto · platform: both · use: run · tags: credits, refund, ledger
- source: run.md step 8 (user, 2026-10-19); Video Enhance Android run 2026-11-10-r1-full O-16, O-17, O-25 · verified: 16.9.0 build 2611091 (2026-11-10)

Mine › Credits › Details lists charge rows by tool (Text to Image / Text to Speech / AI Video Generator / Video
Enhancer) with the platform (「PowerDirector (Android)」) and a refund row 「Generation failed, credits returned +N」.
The account is shared: rows nobody in the run made appear (a 「Credit Pack (2000 credits) +2000」 on 2026-11-10), so
match rows by time and amount, never by balance difference alone. Balances lag: the credit pill is stale until its
screen is reopened, and the Pro tab can trail one charge behind the ledger (Android); quote the next fresh pill.

## KP-041 Daily free credits
- kind: fact · platform: both · use: analysis, run · tags: credits, claim
- source: exploration KB mine-page.md (2026-09-07 PDRM TestFlight, and 2026-09-29, 16.9.0 build 189315, Free); Android: Video Enhance run 2026-11-10-r1-full O-27 (offer seen, not claimed)

My Credits carries 「Complimentary daily credits / Claim once every 24 hours / Claim」; a claim gives 5 credits
(toast 「5 Credits Received · valid for 7 days」). Yet 「Expiring within 7 days」 stays 「0 credit」 after it
(ISS-MP-27, DRI261893-0042). Android's Mine › Credit page shows the same 「Complimentary daily credits ‹Claim›」
offer (16.9.0 build 2611091); its amount there is unchecked.

## KP-067 Credits read 「--」 right after a Play purchase
- kind: quirk · platform: android · use: run · tags: credits, billing, logs
- source: Video Enhance Android run 2026-11-10-r1-full O-1 · verified: 16.9.0 build 2611091 (2026-11-10)

Right after a Google Play subscription, Mine › Credits shows 「--」 and every launch logs `getCreditRemain error,
creditSystemUUID is null` (also `doVerifyPurchase error`, `checkFeatureCredit … JsonSyntaxException`). A relaunch a
minute later shows the balance with the monthly credits added; relaunch before reading prices or the pill.
