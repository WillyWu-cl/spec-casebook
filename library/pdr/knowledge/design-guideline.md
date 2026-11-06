# Design guideline (PDRM)

## KP-066 Android text is held to the Android equivalent of the iOS font
- kind: rule · platform: android · use: analysis, run · tags: design, font, typography
- source: 2025_PDRM_design_guideline, Typography board (Figma qSdtJ1wbHddNm6ebWvF4ia, node 3883:8926), read 2026-11-06; user, 2026-11-06

The Design Figma is drawn for iOS in SF Pro. On Android the standard is Roboto: SF Pro Regular 400 → Roboto Regular
400, Medium 500 → Roboto Medium 500, Semibold 600 → Roboto Medium 500 (the board labels it 「Semibold/500」). Figma's
variable SF Pro weights between these (Medium 510) count as the nearest named weight. The board gives no size mapping,
so a size in pt is the same number in sp. The design check (`scripts/design.ts`, `ANDROID_WEIGHT`) judges Android
weights this way.
