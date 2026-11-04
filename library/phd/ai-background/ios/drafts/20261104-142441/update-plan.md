# Update plan — phd/ai-background / ios: approved v3 → draft 20261104-142441

## Spec files
- Unchanged: Background - PM Spec.pdf (spec set `specs/2026-11-03`), the Design Figma and the PM Figma as read for v3. No new spec files: this draft re-checks the analysis against the newest repo rules (REQ-006).

## Requirement changes
| Requirement | Change | Before | After |
|---|---|---|---|
| R-038 | extended | a template generation shows the subject on that template's background | + in that template's look; each template category (R-011) is used in one generation (2026-11-04 variants rule, `### Variants`) |
| Q-1 – Q-12, Q-14, Q-16 | reworded | short questions, some with no assumption or rows | each says what is unclear and where the sources differ, ends `Assumption: …` with its R- and TC- ids (Cases page question panel, SKILL.md › Question answers); meanings unchanged, nothing answered |
| Q-13 | moved | listed under Open questions as 「(answered 2026-11-03)」 | moved to `## Answered questions` with its answer |
| Q-16 | rows | R-051, R-052 | + TC-042, TC-043 |

## Case changes
- New (4), placed right after TC-034 in 「Generation and waiting」 (REQ-033): TC-056 category=Balloon, TC-057 category=Wood, TC-058 category=Vintage, TC-059 category=Life (R-011, R-017, R-038, R-040, R-042). Each selects the category tab and its first template, generates and checks the template's look and a charge of exactly 2. Priority P2: TC-034 (P1) already proves the template flow and the price; these prove each category's templates generate.
- Modified (1): TC-004 Action split into three numbered lines (one step per line, REQ-002); wording otherwise unchanged.
- Unchanged: 44

## Found by the analysis
- Pass 10 variants (2026-11-04 rule 「A setting's values are variants too」): the template category changes what the feature makes, but only TC-034 generated (from a Neutrals template); TC-011 only taps the tabs. R-038 × category=Neutrals → TC-034; Balloon → TC-056; Wood → TC-057; Vintage → TC-058; Life → TC-059.
- Open questions rewritten for the Cases page's 「Questions for the team」 panel: each links its rows through the TC- ids in its text (Q-11 has no row yet).
- Writing rules: TC-004 was the only Action left with steps run together.

## Run plan
- These rows add 4 template generations (8 credits) to round R2 (phase R2-a, template generation, held for credits), on top of its existing generations; the R2 credit request in `runs/RUN-PLAN-20261103-R1.md` needs 8 more. TC-004 is re-run in its R1 segment.

## Not added (value check)
- A row per template inside each category: one row per value is enough (pass 10); the category is the value, its first template stands for it.
- A category × Custom combination: Custom is a prompt, not a template category, and the spec gives no rule for a combination.

## PM-only rows
- None changed.

## Questions for PM
- No new questions. All open questions (Q-1 – Q-12, Q-14, Q-16) now state their assumption and rows; Q-2 and Q-8 also touch the new category rows.
