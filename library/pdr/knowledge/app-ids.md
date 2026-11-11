# Accessibility ids

## KP-009 Android accessibility ids are content-descs
- kind: fact · platform: android · use: run · tags: ids
- source: run-android.md (team, 2026-10-27); Video Enhance Android run 2026-11-10-r1-full O-22, O-30 · verified: 16.9.0 build 2611091 (2026-11-10)

PowerDirector's Android accessibility ids are content-descs starting `[AID]` (e.g. `[AID]IAP_Back`); match them with
`lbl`, not `id`. Many controls also carry resource ids that `id` matches (`tv_premium` for the Launcher's Pro tab,
`iv_back`, `top_toolbar_back`); prefer them over a bare-text `lbl`, which matches the first text containing it
(`lbl Pro` opened 「New Project」). Don't rely on `[AID]…_Server` to tell the server: the Launcher's top-bar colour does (KP-005).
