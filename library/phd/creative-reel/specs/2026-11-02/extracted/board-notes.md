# Creative Reel (Reel Creator room) — board notes, spec set 2026-11-02

Source: `Creative Reel.pdf` (one Figma export page, 5566 × 2862 pt), titled 「Reel Creator（原 Cinematic Reel Creator）—
Room & Template Preview ｜ spec 依帳本 spec-draft/reel-creator.decisions.md」. Read from the PDF text layer (Chinese maps
correctly; `pdf-text.txt`, `annot-lines.txt` with positions) and renders of the phone rows and note boxes
(`regions/`, local). Red note lines are pending (待決 / 待確認) or late additions. No Figma links: PDF-only
(`figma-pending.json`). Product PhotoDirector. Mockups are iPhone frames; table is Android.

## room
- Room renamed Reel Creator: Effects button, Launcher Shortcut, Launcher Template row, AI Video Page, room title.
- No tabs; sections top to bottom, three features mixed: Cinematic Styles 🎬 = CineStory (existing), Cool Transitions 🤳🏻 =
  AI Transition, Year-End Recap 📅 / Christmas Time 🎄 … = Creative (Opus 5.5, existing server pipeline).
- Red: section order pending (Meg / CMS: can CineStory move to the new CMS type).
- Mockup labels: 「第一條 cinematic styles = CineStory; 第二條 year-end recap = Creative Reel (opus 5.5); 第三條 cool
  transitions = AI Transition」. Top bar ‹, credit pill 「100 ⊕」, history icon.
- From Edit Room: as I2V, dialog asks to jump and saves the photo; room opens without the photo (CineStory too).
- CMS: Cinematic keeps CineStory CMS type (red, pending); AI Transition + Creative share a new type (ReelCreator),
  category = section; per template DisplayName, description, demo, tips (Recommend / Avoid), Photo min / max; AI
  Transition min = max (4 or 6), Creative min < max (may be > 10); output 9:16. Red: Creative feature_id pending.
- Schedule Android 11/E, iOS 12/B, three features together.

## deeplink
- Old Cinematic Reel Creator deeplink opens the room; template = content GUID → Preview (no photo); CineStory and new
  CMS GUIDs; no parameter → room; GUID not found → room; no category parameter.

## preview (1. Preview, 2. View photo tips)
- Template tap → full-screen 9:16 demo auto-play / loop; swipe up / down like Reels; View photo tips top left; mute
  right; bottom name, description, count (5–15 photos / 1 photo); 「Use Template」 → picker.
- Red: swipe range = same category, endless loop; text over the demo (bottom darkened); first room entry shows a
  finger animation for swiping.
- Tips: as CineStory, CMS per template (Recommended / Avoid text + images), portrait advice under Recommended, opens
  only on tap. Sheet: 「Photo tips」, 「✓ Recommended」 (Portrait (vertical) photos work best · Clear, well-lit photos ·
  One main subject per photo), 「✕ Avoid」 (Blurry or dark photos · Screenshots or photos with heavy text), 「Got it」.
- Mockup: 「Top 5 of My Year」 / 「Rank your year's best moments in one reel」 / 「5–15 photos」, credit pill 182.

## picker (3, 4–5)
- Multi-select, order 01, 02 …; tray 「Select {min}–{max} photos」, 「{n}/{max}」, thumbnails (horizontal), 「Next」; Next only
  in range; min = max → 「Select N photos」; per-photo check 300–4096 px, ≤ 10 MB, NSFW, celebrity, failures marked;
  landscape and portrait accepted.
- Memory (NEW): session = app launch to end; prompt 「Use the N photos you picked last time?」 + Import (+ ×); Import
  keeps the picker open; out of range → red tray, must fix; photos gone from gallery not imported; last pick of 1 → no
  prompt. Red 待確認: last Next set vs last generated set; scope beyond Reel Creator; after × in the same session.
- Drawn: below min tray red 「Select at least 5 photos (2 more)」, Next grey.

## confirm (6–7)
- Top thumbnail + name + count (「5–15 photos · output 9:16」); 「Your photos」 「7/15」, 「Long-press to reorder · tap × to
  remove」 (sync AI Creative Studio); AI Transition order = output order; Creative order not guaranteed; + tile → picker
  with current selection; Creative 「Text language」 dropdown (device language default); 「Generate | 60」; below min →
  disabled, toast 「Please upload at least %d photos」 (drawn 「Please upload at least 5 photos」, count 4/15 red); low
  credits: free → paywall, subscriber → More Credits Required → Credit Shop; every input is used (no notice).
  Red 待確認: language menu moved from the preview to this page.

## text-language (8)
- Default device language 「English (Device language)」 ✓; all PhD languages (same iOS / Android), scrolls; lang code to
  engine; kept in the session, reset on leaving the room; text not editable after generation. Drawn list: 繁體中文,
  简体中文, 日本語, 한국어, Español, Français, Deutsch, Português, Italiano, ภาษาไทย, ….

## artwork
- All three features' results go to the Cinematic Reel Creator Artwork page; red: RD rename the tab to Reel Creator;
  no sub tabs, by time, each with template name; Create More → room. Drawn tabs 「Image to Video」 「Reel Creator」
  「Character Motion S…」; card 「Processing…」 「3 minutes remaining…」 with progress bar.

## cinematic
- Same flow: Preview → Use Template → single pick → confirm → 「Generate | 40」; tap the photo to replace; no Text
  language. Red 待確認: Import prompt in the Cinematic picker when the last pick had several photos.
- Drawn: 「Micro Cinema」 「Dreamy close-ups build a cinematic visual story」 「1 photo」; 「Select 1 photo 1/1」;
  confirm 「1 photo · output 9:16」, 「Tap the photo to replace」.

## Controls (PDF-read)
See requirements.md › Controls (PDF-read) → rows.
