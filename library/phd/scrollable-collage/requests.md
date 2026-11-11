# Scrollable Collage — request ledger

Every request that changes what this feature's tables must cover or how its runs are done, from the user, a
colleague, a reviewer or RD. The spec analysis re-applies every **table** entry on each new or updated draft
(skill: "Standing inputs"), and `check.ts` fails a draft whose `requirements.md` does not cite each open table entry
for its platform. **run** entries are followed by the run rules; **analysis** entries change how the spec is read.
Add new entries at the bottom with the next ID; never renumber. Mark an entry `superseded by REQ-…` in Status instead
of deleting it.

| ID | Date | From | Request | Kind | Platform | Status |
|---|---|---|---|---|---|---|
| REQ-001 | 2026-11-05 | user | New PhotoDirector Mobile feature: Scrollable (Swipe) Collage, 26'11/E. Run both the casebook and the figma skill on it. PM spec: Figma page https://www.figma.com/design/zrl1BBEyqTvdLfjtaT8g6I/Collage?node-id=2171-2 ; Design spec: https://www.figma.com/design/iUy5kOrVNG7IjcyxGGnp9t/Swipe_collage?node-id=0-1 (no PDFs). Both platforms (no platform named). | analysis | both | done (drafts ios/android 20261105-165222, in review; Design source read 2026-11-05) |
| REQ-002 | 2026-11-05 | user | Fix figma-source.ts before the Design source read (it asked for 302 calls: one per loose label, a screenshot per frame already in the page image, light/dark twins sharing one image file), then run every call. | analysis | both | done (batch calls, no hidden call without instances, unique image names, crops from the page image, region boards count as read; 140 calls) |
| REQ-003 | 2026-11-09 | user | Re-sent the same PM and Design Figma links; run both the casebook and the figma skill again (change check, re-read only changed boards, update the tables if the spec changed, Design source re-read and design status). | analysis | both | in review (drafts ios/android 20261109-160641: Design added a Launcher frame with a 「Swipe Collage」 shortcut → TC-009 modified, new TC-151 / TC-164; Q-21) |
