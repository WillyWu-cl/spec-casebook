# Update plan — phd/my-ai-artwork-category-list / android: new table → draft 20261111-105445
## Spec files
- New: my ai artwork category list.pdf (PM page, 11/E, ledger 2026-10-28). PDF-only: no Figma link (figma-pending.json).
## Case changes
- New (31): every row (REQ-001).
## Found by the analysis
- Annotation trace: 9 blocks traced; Q-1 (ledger and 8/E Recent spec not supplied), Q-6 and Q-7 came from it.
- Pass 1 flow arrows: pm-entry-flow-a1 (☰ → sheet) walked by TC-006, pm-entry-flow-a2 (row → tab) walked by TC-013.
- Pass 8 exits: ✕, grabber, dimmed page, system Back → TC-021 – TC-024 (Q-3).
- Pass 9 hidden clauses: the two analytics events (TC-028 – TC-031, parked: no event log); no charge (TC-025, TC-026).
- Pass 10 variants: free / paid account; highlight opened from Recent / a feature tab; row chosen with works / no works / Recent / current / last.
- Domain knowledge: KP-026 (History button opens the feature tab) → R-060, TC-027.
## Not added (value check)
- A count of works per row or tab, search, favourites, Expiring, Recent list / grid switch, greying empty tabs: not built this version (spec 「不做」); only their absence is checked (TC-004, TC-009, TC-012).
- KP-028 「Nothing yet」 on an empty Photo / Video filter: filter behaviour is not changed by this spec (R-005); covered by today's Artwork tables, not here.
- The header summary sentence (「建議句，待 PM 確認」): not an app string (Q-7).
- Sheet behaviour when the app goes to the background or the phone rotates: spec silent, no row (job-state grid n/a).
- Closing the sheet during multi-select (✕ / grabber / dimmed page / Back): spec states only choosing a row; Exit × stage n/a.
- Regression row for QA ticket PHI262609-0006: the ticket is the feature request itself; TC-014 checks its problem (AI Art reachable from the sheet).
## PM-only rows
- Every row: the spec is a PM page with iPhone mockups; no separate Design file was supplied.
## Questions for PM
- Q-1 – Q-7 in requirements.md (also on the Cases page under 「Questions for the team」).
