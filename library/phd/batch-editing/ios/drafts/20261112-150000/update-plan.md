# Update plan — phd/batch-editing / ios: approved v3 → draft 20261112-150000

Requests: REQ-013, REQ-014 (Figma Agent comparison, 2026-11-12). Rows: 128 (new 3, modified 0, unchanged 125, removed 0).
Same spec set; no Figma change read for this draft (the rows come from analysis pass 10b, not a spec change).

## Why
The Figma Agent's checkpoints `curve-collapse` and `hsl-collapse` had no row here: existing rows fold and reopen
the panel and check the strip, but never that the panel's values and selection survive. Pass 10b now asks for it.

## Requirement changes
| Requirement | Change | Before | After |
|---|---|---|---|
| R-009 | hidden clause added | 「Select 1 to 20 photos」 | + no batch starts with 0 photos (TC-128) |
| R-069 | hidden clause added | folding shows the strip again | + folding only hides the panel: curve, point, channel, HSL colour and values stay |

## Rows
- New: TC-128 (0 photos, 「Next」) after TC-005; TC-126 (Curve) after TC-066, TC-127 (HSL) after TC-067.
