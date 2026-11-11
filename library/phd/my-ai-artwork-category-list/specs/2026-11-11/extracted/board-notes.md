# Board notes — My AI Artwork: ☰ All categories (spec set 2026-11-11)

Spec: `my ai artwork category list.pdf` (one-page Figma export, 3076 × 4322 pt, no Figma links). Read from the PDF
text layer (clean, Chinese included) and the region renders in `figma/region-*.png`. PDF-only (`figma-pending.json`).
The page is a PM page (rules in Chinese, mockups are iPhone frames); no separate Design or MX file was supplied.

## pm-header
- Title 「My Artwork: Artwork category list add filter Demo + Spec」; subtitle 「My AI Artwork：☰ All categories（11/E · 帳本 2026-10-28）」:
  release 11/E, written from a decisions ledger (帳本) dated 2026-10-28. The ledger is not in the spec set (a named file,
  `reading-the-spec.md` step 9) → Open question. Bracketed codes [D0-04], [D1-10] … are that ledger's decision IDs.
- 「與今天 My AI Artwork 的差異：今天 20 幾個 tab 只能橫滑找；改成點 ☰ 就看得到所有功能，點一下直接跳過去。（建議句，待 PM 確認）」 —
  a suggested summary sentence still pending PM confirmation (label); its content repeats the Overview.

## pm-overview
- Why: QA ticket PHI262609-0006 — too many tabs, old works (e.g. AI Art) are hard to find; scheduled for 11/E.
- What: add ☰ at the far right of the tab bar; it opens 「All categories」 listing every feature; tapping one jumps there.
- No work counts this version: the server API gives no count (RD reply 10/28).
- Not done (manager decision 10/27): Expiring, Recent list/grid switch, greying empty tabs, counts on tabs, search, favourites.
- Platforms: iOS + Android at the same time; pure UX, no charge.
- Events: `Artwork_FeatureList_Appear` (from_tab), `Artwork_Category_Select` (category, source = sheet / tab).

## pm-entry-flow
Flow 「Entry: My AI Artwork（Recent）→ ☰ → All categories → 分類 tab」, three phone frames, blue line = forward (tap):
1. My AI Artwork opens on Recent (first tab); tap ☰ at the far right of the tab bar [D0-07][D1-10]. Frame: back ‹,
   title 「My AI Artwork」, ⓘ; tabs 「Recent」 (selected, peach underline) 「AI Anime Video」 「AI Art」 「AI Background」 … ☰;
   「Photo」 / 「Video」 filter; 「Select」; Recent cards (date, feature name, 「Expires on」 date).
2. 「All categories」 sheet (dimmed page behind, grabber on top, title 「All categories」, ✕): rows 「Recent」 (peach),
   「AI Anime Video」, 「AI Art」, 「AI Background」, 「AI Creative Studio」, 「AI Edit Agent」, 「AI Enhance」, 「AI Expand」,
   「AI Face Swap」, 「AI Glow Up」, 「AI Hairstyle」 … (list continues below the frame). Tap 「AI Creative Studio」 →
   the list closes and the page switches to that tab [D1-11].
3. The category's tab (same as today; the shot is today's multi-select state) [D1-12]: tab bar scrolled to show
   「AI Creative Studio」 selected; 「Cancel」; numbered selected thumbnails; bottom bar (four icons).
   Mockup sample data: names in the list and cards are sample content; the rules are in the notes.

### Controls (PDF-read)
- My AI Artwork: ‹ back, ⓘ, each tab, ☰ (new), 「Photo」, 「Video」, 「Select」, Recent card.
- All categories sheet: ✕, grabber (drag handle), each row (Recent + every feature), dimmed area behind the sheet.
- Multi-select state: 「Cancel」, thumbnails, bottom bar icons (existing, not changed by this spec).

## pm-recent — Recent（☰ 入口）
- ☰ is fixed at the far right of the tab bar; tapping it opens All categories [D1-10][D1-11].
- The tab bar itself is as today: Recent first, the others in alphabetical order; empty tabs are still shown and have
  「Create More」 [D1-12][D1-12b][D1-13].
- Recent list, Photo / Video and Select are all as today (the 8/E Recent spec, 「26 8E Recent」) [D0-08][D0-07].

## pm-all-categories — All categories
- Title 「All categories」 [D0-05].
- Rows are exactly the tab bar's tabs; Recent first, the others alphabetical [D1-27][D1-27b][D1-17].
- Feature names only; no work count this version (no count API); features with no works are not greyed [D1-28][D2-04][D1-27].
- The current tab is highlighted in peach [D1-17].
- Tapping any row (features with no works included) → the sheet closes and the page switches to that tab; tapping in
  multi-select → switches there and cancels the selection [D1-11][D1-28e][D1-19].
