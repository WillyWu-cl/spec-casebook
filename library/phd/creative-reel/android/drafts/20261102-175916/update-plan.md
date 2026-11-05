# Update plan — phd/creative-reel / android: new table → draft 20261102-175916

New table from `Creative Reel.pdf` (spec set 2026-11-02), PDF-only, plus PHD domain knowledge (REQ-003, REQ-004): 113
requirements (R-001 – R-113, 2 NOT
TESTABLE, 11 flow arrows), 127 rows, 22 open questions.

## Not added (value check)
- R-024 Creative feature_id: drop — analytics id, nothing visible in the app.
- R-025 schedule (Android 11/E, iOS 12/B): drop — release plan.
- CMS type split (Cinematic on the CineStory type, AI Transition + Creative on the new ReelCreator type): drop —
  server setup; its visible effects are the deeplink GUID rows (TC-015 – TC-017) and the sections.
- Generation failure, refund and retry: not added — the spec is silent (Q-12).
- Fresh-install / first-entry rows (TC-021): park if the build cannot be reinstalled; needs a first-entry state.
- Rows needing fixtures stay, tagged in Notes: deeplink URLs (Q-15), size / NSFW / celebrity test photos, low-credit
  Free and Premium accounts.

## Found by the analysis — PHD domain knowledge (standing input 6, REQ-003 / REQ-004)
- K75 credit button → R-008 → TC-008; K76 History button → R-101 → TC-112 (Q-14 answered).
- K36a credit Detail → R-102 → TC-118 (Creative), TC-119 (Cinematic), TC-120 (AI Transition).
- K30 burst taps → R-103 → TC-117. K48 completion notification → R-104 → TC-121; processing thumbnail → Q-18.
- K70 placeholders → R-105 → TC-123; K66 / K68 RTL → R-106 → TC-124; K69 long strings → R-107 → TC-125.
- K01 every entry → R-108 → TC-113; K02 edited image → R-109 → TC-012 (modified); spec wins over K02 for carrying the photo in (TC-013 note).
- K05 warm deeplink → R-110 → TC-114, first-entry note on TC-021; K52 mute → R-111 → TC-115; K62 re-creation → R-112 → TC-116; K28 Create More → R-113 → TC-122.
- Notes only: K03 (TC-055, TC-068), K04 (TC-015), K07 (TC-062), K36b (TC-073), test-setup (TC-072), K51 / K53 (TC-086), K60 / K61 (TC-085), K63 (TC-103).
- Domain open questions touched → Q-19 (CMS content per language, K57), Q-20 (Create More keeps inputs).

## Not added — PHD domain knowledge
- K31 free trial, K36c / K47b AI Exposure, K44 / K40–K43 AI Agent, K08 / K11 / K12 / K14 / K15 / K32 prompt and reference inputs, K20–K27 / K29 edit tools, K24–K26 Video Editing: the feature has none of these.
- K47a: images only; Reel Creator outputs are videos (R-079 already covers Artwork).
- K46 「Nothing yet」: a filter rule; the Reel Creator tab is a feature tab, not a filter.
- K16 Trim / Continue, PHA262026-0399 Full View 「Edit」: the old Cinematic Reel Creator video flow; the new spec does not draw them.
- K18 / K23 / K50 masks, large-photo stacks, preview = output: no editing in this flow (size limits are R-045).
- K39 subscribe dialog, K74 Mixpanel, K55 / K56 / K58 / K59 CMS internals: not visible in this flow or iOS-only.
- K64 keyboard: no text input. K65 foldables: no foldable phone in the lab.
- Decisions K13, K17, K19, K33–K35, K37, K38, K52 (Group Shot BGM), K54, K59, K67, K71, K09: other features; nothing here asserts them.
- PHA262026-0366 low-resolution template samples (open ticket): a quality observation, not a rule.

## Fixed after the rdqe comparison (REQ-006, 2026-11-03)
- Linked ledger 「spec-draft/reel-creator.decisions.md」 in the board title → Q-21 (reading-the-spec step 9 now covers files named in titles).
- 「≤ 10 MB」 unit → Q-22; TC-048 now 11,000,000 bytes, new TC-126 at 9,900,000 bytes (analysis pass 4 now asks for the unit and tests outside the gap).
- 9:16 output per feature → R-023 Variants; new TC-127 (Cinematic), TC-101 now checks the file (analysis pass 10 now splits whole-feature rules by sub-feature).

## PM-only rows
- Every row is from one PM-owned file that draws its own mockups; there is no separate Design file to compare.

## Questions for PM
- Q-1 – Q-9, Q-11 – Q-17 (requirements.md › Open questions).

## Questions for you
- Q-10 Figma: no links and no sign-in on this machine; send the Figma links when available so steps 8 and 10 catch up.
