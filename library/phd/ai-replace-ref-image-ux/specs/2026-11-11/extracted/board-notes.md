# Board notes — AI Replace: Reference image UX (Figma only)

Read from the Figma text layer (boards/pm-replace-flow.md) and the board image (figma/pm-replace-flow.png). No
inventory read (figma-pending.json).

## pm-replace-flow
Five frames left to right: the mask step (「1-2」: Size 33, Box / Circle / Brush / Eraser, 「Next」); the sheet
「Choose how to replace the selected area」 (「1-3」: 「Upload a reference image」, 「Describe with text」, note 「badge
都可以拿掉了」); the reference tips sheet (an image: Recommendation / Avoid, 「Continue」, 「Don't show again」); the photo
picker (「4-1」: 「Recents」 / 「Stock」); the reference image page (「Replace Area」, 「Reference Image」 with a replace
button, 「Generate」 -6; note: back → the reference image photo picker, same as the replace button; both sections always
hold an image; Generate always enabled).

### Controls (PDF-read)
- 「Next」 — TC-001
- 「Upload a reference image」, tips 「Continue」, a photo in the picker — TC-002
- 「Describe with text」 — n/a (unchanged; only its badge is checked, TC-001)
- 「Don't show again」 — n/a (unchanged; one-way state, not ticked so the tips stay as today)
- Mask tools (Size, Box, Circle, Brush, Eraser, undo / redo) — n/a (unchanged; Brush used in the Preconditions)
- Reference page back (top left) — TC-006; replace button — TC-007; system Back — TC-009
- Picker back — TC-010; 「Recents」 / 「Stock」 — 「Recents」 in TC-002, 「Stock」 n/a (unchanged)
- 「Generate」 — TC-003, TC-004, TC-005
- Top bar credits and History — n/a (unchanged)
