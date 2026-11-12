# Update plan — phd/batch-editing / android: approved v6 → draft 20261112-150000

Request: REQ-013 (Figma Agent comparison, 2026-11-12). Rows: 170 (new 2, modified 0, unchanged 168, removed 0).
Same spec set; no Figma change read for this draft (the rows come from analysis pass 10b, not a spec change).

## Why
The Figma Agent's checkpoints `curve-collapse` and `hsl-collapse` had no row here: existing rows fold and reopen
the panel and check the strip, but never that the panel's values and selection survive. Pass 10b now asks for it.

## Requirement changes
| Requirement | Change | Before | After |
|---|---|---|---|
| R-238 | hidden clause added | folding shows the strip again | + folding only hides the panel: curve, point, channel, HSL colour and values stay |

## Rows
- New: TC-169 (Curve) and TC-170 (HSL) after TC-159.
