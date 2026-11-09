# Builds this draft's requirements.md from the approved v1 requirements.md (spec set 2026-10-30) with the changes of
# spec set 2026-11-09: UI UX flow 2.pdf (PM re-export) and the Design frame PDFs (REQ-003). Re-runnable.
# Usage: python library/phd/batch-editing/android/drafts/20261109-150747/make-requirements.py
import os, re
HERE = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(HERE, '..', '..', 'requirements.md'), encoding='utf-8').read()


def rep(old, new):
    global src
    assert old in src, 'not found: ' + old[:80]
    src = src.replace(old, new, 1)


def find(rid):
    m = re.search(r'^- ' + re.escape(rid) + r' .*$', src, re.M)
    assert m, rid
    return m


def line(rid, new):
    global src
    m = find(rid)
    src = src[:m.start()] + new + src[m.end():]


def after(rid, new):
    global src
    m = find(rid)
    src = src[:m.end()] + '\n' + new + src[m.end():]


rep("""Spec: UI UX flow.pdf (PM "Demo + Spec", Batch Edit, 26'11/E) and Section 3 · 美圖 Apply to all 實測.pdf (crop Apply to
all decision), spec set 2026-10-30.""", """Spec: UI UX flow 2.pdf (PM "Demo + Spec", Batch Edit, 26'11/E, re-exported 2026-11-09), Section 3 · 美圖 Apply to all
實測.pdf (crop Apply to all decision) and the Design Figma frames exported one PDF per frame (`Design - *.pdf`, light and
dark copies), spec set 2026-11-09.""")
rep("board IDs from `specs/2026-10-30/extracted/boards.json`", "board IDs from `specs/2026-11-09/extracted/boards.json`")
rep("""carries the UI; there is no separate Design or MX file. Mockups are iPhone frames; Android differences are in "System
back". No Figma links were supplied: PDF-only analysis (`figma-pending.json`). Request ledger: REQ-001 (this table).""",
"""carries the UI; `[DS:<board>]` = a Design frame (`ds-*` boards, `design-text.md`). UI strings follow the Design frames,
rules the PM boards; where the two disagree on a rule the question is open and the row says which it follows. Mockups
are iPhone frames; Android differences are in "System back". The Design Figma was read from PDF exports, not through
Figma (quota ran out mid read: `figma-pending.json`, Q-12). Request ledger: REQ-001 (this table), REQ-003 (this update), REQ-004 (UI copy follows the Design).""")

# ---- Photo Picker / Entry
line('R-013', "- R-013 [PM:picker-batch, pm-decisions; DR-01, D5-01b] Only the 「Batch」 tab allows several photos; at most 20 for Free and Premium users alike, with no IAP at any count (Q2 decided 10/30: no Premium lock day-1, not Meitu's IAP at the 13th photo), and the same on both platforms, so Android is not held to a lower cap.")
line('R-015', "- R-015 [PM:picker-batch, entry-enhance-shortcut; DR-01; DS:ds-photo-picker] The bottom bar of the Batch tab shows the hint with the count, 「Select 1 to 20 photos to continue. (n/20)」, and 「Next」 (Design copy; PM draws 「n selected (max 20)」 and 「Done」: Q-1).")
after('R-015', """- R-019 [DS:ds-photo-picker] On the Batch tab a tray under the bottom bar lists the selected photos in selection order, each with ✕; ✕ deselects that photo (the tile loses its number, the count drops).
- R-233 [DS:ds-photo-picker] Every picker tile carries an expand icon at its bottom right that opens the photo large without selecting it (Design draws the icon only; what opens is not stated: Q-13).""")
for rid in ['R-016', 'R-017', 'R-020', 'R-021']:
    m = find(rid)
    src = src[:m.start()] + m.group(0).replace('「Done」', '「Next」') + src[m.end():]
line('R-022', "- R-022 [PM:entry-batch-shortcut] A Launcher Batch Edit shortcut is planned (its icon is still to be designed, after Meitu); the Launcher drawn has none yet. The deeplink `phd://navigate/page?name=batch_edit` opens Batch Edit; where it lands is not stated (Q-15).")

# ---- Batch Edit Room
line('R-031', "- R-031 [PM:room-default; D1-11; DS:ds-canvas-img-focus] Top bar: Home and Replace photo at the left; a feedback button (speech bubble with !), Save (unchanged from Edit Room) and a Setting button at the right (the feedback button is drawn by Design only: Q-21).")
line('R-038', "- R-038 [PM:room-default; DR-10b, DR-12e] After an Enhance was undone, any other edit to that photo clears the Redo: the Enhance result cannot be brought back, but the photo can be enhanced again from the AI Enhance room (R-229).")

# ---- Crop & Rotate
line('R-050', "- R-050 [PM:crop-default; D1-11, DR-03; DS:ds-3, ds-main-down-tool-box] The room matches the current Crop & Rotate room (Rotate, Flip, Flip Vertically, Original, Custom, Square, 2:3, 3:2, 3:4 and more ratios, angle slider, ✕ / undo / redo / ✓), with no title above the tool panel. Its top bar has ‹ at the left, the current photo's pixel size 「W x H」 with a pencil (manual pixel input, R-066) in the middle and 「All」 at the right (‹ beside ✕: Q-22).")
after('R-051', "- R-234 [DS:ds-status] 「All」 has a normal and a greyed (disabled) look; when it is greyed is not stated (Q-16).")

# ---- Adjustment
line('R-090', "- R-090 [PM:adjust-default; D1-11, DR-03, DR-06] The room matches the 26'10/E Adjustment room (Light / Color / Details), without Subject Detection and without AI Exposure (the Design frames draw 「AI Exposure」 in the tool list: Q-18; rows follow PM).")
after('R-090', """- R-230 [DS:ds-9-adjust-hsl, ds-9-adjust-curve, ds-9-adjust-hsl-collapse, ds-9-adjust-curve-collapse; PM:adjust-guideline-note] The Color tab has an HSL panel (「Hue」 / 「Saturation」 / 「Lightness」 sliders and eight colour dots: red, orange, yellow, green, cyan, blue, purple, magenta) and a Curve panel (channel buttons RGB / red / green / blue beside the tone curve), as the current Adjustment room; each panel folds down with a chevron (﹀) and opens again with ︿, and reset and compare sit on the photo.
- R-231 [PM:adjust-default; DR-04, DR-04c; DS:ds-9-adjust-hsl, ds-9-adjust-curve] 「All」 carries the HSL and Curve values with the rest of the set (the whole set of the room, R-092).
- R-232 [PM:adjust-guideline-note] PM asks Design for the HSL / Curve layout with the thumbnail strip (the photo gets small) and prefers the proposal 「Adjustment 縮圖列（draft）」: A. thumbnails 50→40 px, strip 62→48 px; B. the strip fades out while a finger holds a slider or a curve point and fades back on release. — NOT TESTABLE: direction only, not drawn yet (Q-17).""")

# ---- AI Enhance
line('R-116', "- R-116 [PM:enhance-done; DR-12e, DR-12h] Each visit of the AI Enhance room allows one Enhance, applied to every photo of the batch; after it the button reads 「Enhanced」 and is disabled for the rest of the visit.")
line('R-117', "- R-117 [PM:enhance-done] (removed 2026-11-09: UI UX flow 2 dropped 「Undo 退回 Enhance 的照片仍算做過，不能再 Enhance」; R-229 replaces it.) — NOT TESTABLE: no longer a rule.")
after('R-117', "- R-229 [PM:enhance-done, room-default; DR-12e, DR-10b] Leaving the AI Enhance room and entering it again allows another Enhance; it processes the current images (results already enhanced are enhanced again, an undone photo from its state now), as in the single Edit Room.")
line('R-123', "- R-123 [PM:enhance-result, server-task-notes; D1-04; DS:ds-enhance-1-2] Partial failure shows one summary card after every photo has finished (no dialog per photo): 「X completed, Y failed」 and 「Failed photos are marked with ! on the thumbnails.」 (Design copy; the PM state board drops 「with !」); each failed thumbnail has a red ! at its top right, successful ones none; tapping a failed thumbnail switches to it. The card has a ✕ that closes it (Design).")
line('R-130', "- R-130 [PM:flow-ai-enhance] ✕ on the AI Enhance page returns to Batch Edit Room with the finished Enhance results kept (results are applied when done, R-114). (The Design draws the Discard Dialog over the AI Enhance page: Q-19.)")

# ---- Save
line('R-150', "- R-150 [PM:save-saving; D5-01b; DS:ds-canvas-img-focus-8] While saving, 「Saving k / N」 and 「Please do not leave this page or quit the app.」 are shown with progress over the main screen, whose top bar is dimmed (no feedback button); the Batch Save page opens only when saving has finished.")
line('R-153', "- R-153 [PM:save-saved; D1-07; DS:ds-save2] The new Batch Save page shows a thumbnail grid under the title 「Save N photos」 (Design copy; PM writes 「Saved N photos」: Q-20).")
line('R-155', "- R-155 [PM:save-saved, leave-flow; D1-07] 「Edit Next Batch」, fixed at the bottom, opens the Photo Picker on the Batch tab with nothing selected; Back (‹) from that Picker returns to Batch Edit Room showing the edits as they were (day-1 follows the Android single Edit Room; iOS single goes to the Launcher today, batch follows Android).")

# ---- Open questions
rep("""- Q-1 Picker bottom copy: Launcher 「Edit」 frames show 「Select 1 to 20 photos.」; the AI Enhance shortcut, batch_one and leave-flow frames show 「3 selected (max 20)」 / 「1 selected (max 20)」. Which is the shipping string, and does the count replace the hint once a photo is selected? (R-015)""",
"""- Q-1 Picker bottom copy: the Design draws 「Select 1 to 20 photos to continue. (10/20)」 and 「Next」 (the light frame without the space before 「(10/20)」 and with 「Next」 grey although 10 photos are selected); the PM boards still draw 「Select 1 to 20 photos.」 / 「3 selected (max 20)」 and 「Done」. Assumption: the Design copy, 「Next」 enabled once a photo is selected. (R-015, TC-005, TC-007)""")
rep("""- Q-2 Board 「Entry: Launcher › Batch Editing shortcut」 has one Launcher frame, no shortcut and no note, while D0-04 says Batch Edit appears only in the two pickers. Is there a Launcher Batch Editing shortcut in 26'11/E? (R-022)
""", "")
rep("""- Q-7 PM Q1 pending (Judy with Samuel): will batch AI Enhance charge credits like PhD PC (1 credit per 10 photos, fewer than 10 also 1, ⓘ at top left)? Rows follow the current rule: no credits. (R-004, R-113)
- Q-8 PM Q2 pending: lock batch editing to Premium (Meitu shows IAP at the 13th photo, premium allows 50)? Rows follow the current rule: batch free, max 20. (R-013)
""", "")
rep("""- Q-12 Figma not compared with the PDF: no Figma links were supplied and this machine has no Figma sign-in, so frames newer than the export may be missing (PDF-only analysis).""",
"""- Q-12 The Design Figma (file qZXJfrM5gb5g4tFoCIS1YU) was read from per-frame PDF exports, not through Figma: the source read stopped on the Figma quota and four boards it had planned (67:10037, 67:10070, 67:10377, 67:10838) are gone from the file. Frames carry no dates, controls are read by eye, and no Figma inventory exists yet. Assumption: the exported frames are the current Design.""")
rep("""- Q-13 What happens to the selected photos when the user deselects one on the Batch tab (do the numbers renumber?) and is 「Done」 disabled with none selected? Spec silent; rows record it.""",
"""- Q-13 What happens to the selected photos when the user deselects one on the Batch tab, by tapping the tile or the tray ✕ (do the numbers renumber?), is 「Next」 disabled with none selected, and what does a tile's expand icon open? Spec silent; rows record it. Assumption: the numbers close up. (R-019, R-233, TC-009, TC-010, TC-150, TC-151)""")
src = src.rstrip('\n') + """
- Q-15 The PM entry board now plans a Launcher Batch Edit shortcut (icon to be designed after Meitu) and the deeplink `phd://navigate/page?name=batch_edit`, while D0-04 still says Batch Edit appears only in the two pickers. Where do the shortcut and the deeplink land (Photo Picker on 「Batch」?), and is the shortcut in 26'11/E? Assumption: the deeplink opens the Photo Picker on 「Batch」; rows record it. (R-022, TC-022, TC-152)
- Q-16 The Design draws 「All」 in a normal and a greyed state. When is it greyed (no change on the current photo yet, one photo only)? R-051 says it is a one-shot button that works again with no change. Assumption: enabled always; rows record when it is grey. (R-234, TC-042, TC-153)
- Q-17 PM asks Design to lay out HSL / Curve with the thumbnail strip and links a proposal 「Adjustment 縮圖列（draft）」 (smaller strip, or the strip hidden while dragging). The link could not be opened from the PDF and no Design frame draws the change. Assumption: the strip as today; no row checks the proposal. (R-232)
- Q-18 PM (re-exported 2026-11-09) says the Adjustment room shows no AI Exposure; every Design Adjustment frame draws 「AI Exposure」 between 「Exposure」 and 「Contrast」. Which holds? Assumption: PM (no AI Exposure); the row records what the app shows. (R-090, TC-070)
- Q-19 The Design draws the Discard Dialog over the AI Enhance page (with a credit pill 「100」 and a history icon at the top right), while PM says ✕ on that page returns to Batch Edit Room keeping the results and the dialog comes from Home / Replace photo. Does ✕ (or Back) on the AI Enhance page ask to discard, and does that page show a credit pill? Assumption: PM (no dialog, results kept). (R-130, TC-100, TC-142)
- Q-20 Batch Save page title: Design 「Save 12 photos」, PM 「Saved 12 photos」 (D1-07). Assumption: the Design copy. (R-153, TC-128)
- Q-21 The Design adds a feedback button (speech bubble with !) to the Batch Edit Room top bar; PM lists only Home, Replace photo, Save and Setting. Is it in the batch room, and what does it open? Assumption: present; rows record what opens. (R-031, TC-024, TC-154)
- Q-22 The Design Crop & Rotate room has ‹ at the top left as well as ✕ at the bottom. Is ‹ the same as ✕ (drop the room's changes) or as ✓? Assumption: same as ✕; rows record it. (R-050, TC-155)
"""
# ---- Variants, ledger
rep("| R-004 | Premium user (AI Enhance without credits) | TC-093 |", """| R-004 | Premium user (AI Enhance without credits) | TC-093 |
| R-013 | Free user, 20 photos (no IAP at any count) | TC-156 |
| R-013 | Premium user, 20 photos | TC-011 |
| R-229 | photos already enhanced (enhanced again) | TC-157 |
| R-229 | photo whose Enhance was undone | TC-097 |
| R-231 | HSL values | TC-158 |
| R-231 | Curve values | TC-158 |""")
rep("| REQ-001 | every requirement of this table (first Android draft) |", """| REQ-001 | every requirement of this table (first Android draft) |
| REQ-003 | R-013, R-015, R-019, R-022, R-031, R-038, R-050, R-090, R-116, R-123, R-130, R-150, R-153, R-155, R-229, R-230, R-231, R-232, R-233, R-234, R-235 (Design frames and UI UX flow 2) |
| REQ-004 | R-015, R-016, R-017, R-020, R-021, R-123, R-153 (Design copy over PM wording) |""")
rep("- R-228 [PM:leave-flow flow arrow leave-flow-a4 ] 「Keep Editing」 → Batch Edit Room. Walked by: TC-118.", """- R-228 [PM:leave-flow flow arrow leave-flow-a4 ] 「Keep Editing」 → Batch Edit Room. Walked by: TC-118.
- R-235 [PM:leave-flow flow arrow leave-flow-a5 ] Photo Picker ‹ (opened by 「Edit Next Batch」) → Batch Edit Room main with the edits (red arrow new in UI UX flow 2). Walked by: TC-134, TC-148.""")
src = src.replace('## Added 2026-10-30 — coverage passes and standing inputs', '## Added 2026-10-30 (updated 2026-11-09) — coverage passes and standing inputs')
NA = {
 'KP-012': 'n/a (batch has no paid mode split: Free and Premium are R-004, R-013, R-119)',
 'KP-014': 'n/a (PM: no AI Exposure in the batch Adjustment room, R-090; Design draws it: Q-18)',
 'KP-015': 'n/a (no purchase in this feature)', 'KP-016': 'n/a (no free trial in batch, R-119)',
 'KP-017': 'n/a (batch AI Enhance deducts no credits, R-004)', 'KP-018': 'n/a (no Credit Auto Pass)',
 'KP-019': 'R-112, R-136 (every Enhance tap opens the Confirm Dialog; one batch per Start)',
 'KP-020': 'n/a (the batch AI Enhance page shows no credit count, R-113; a pill drawn on the Discard frame: Q-19)',
 'KP-021': 'n/a (no chat)', 'KP-024': 'n/a (spec: Standard batch results are not saved to My AI Artwork, R-143)',
 'KP-025': 'n/a (no AI Exposure in batch, R-090)', 'KP-026': 'n/a (no History button drawn in the batch AI Enhance room; Q-19 notes one on the Discard frame)',
 'KP-027': 'n/a (batch results are not artworks, R-143)', 'KP-028': 'n/a (no Artwork filter)',
 'KP-029': 'n/a (batch Enhance runs in the foreground under a mask, R-120)', 'KP-030': 'R-151, R-062 (saved files from each edited photo)',
 'KP-032': 'n/a (Batch Edit is not opened from Edit Room, R-002)', 'KP-033': 'R-022 (the batch_edit deeplink; no style to preselect)',
 'KP-034': 'n/a (no Discover tip)', 'KP-035': 'n/a (AI Replace)', 'KP-036': 'n/a (no prompt)', 'KP-037': 'n/a (AI Try-On)',
 'KP-038': 'n/a (AI Group Shot; batch picking is R-013, R-014, R-019)', 'KP-039': 'n/a (no Agent)',
 'KP-040': 'R-050, R-057 (one crop state per photo; Apply to all carries ratio, rotation, flips)',
 'KP-041': 'R-081, R-082, R-098 (the batch rooms keep their own shared history; Design draws no reset in Crop)',
 'KP-042': 'n/a (no restored state)', 'KP-043': 'n/a (Video Editing)', 'KP-044': 'R-085, R-086, R-102, R-103 (✕ drops, ✓ keeps)',
 'KP-045': 'n/a (Video Editing)', 'KP-046': 'n/a (Try-On / Hairstyle)', 'KP-047': 'n/a (no masks)',
 'KP-048': 'n/a (English UI only in this table)', 'KP-049': 'n/a (placeholders 「{xx}」 / 「n/20」 checked in English only)', 'KP-050': 'n/a (no RTL run)',
}
dr = '### Domain rules\n\n| Entry | Requirements |\n|---|---|\n' + ''.join(f'| {k} | {v} |\n' for k, v in NA.items()) + '\n'
rep('### Request ledger coverage', dr + '### Request ledger coverage')
open(os.path.join(HERE, 'requirements.md'), 'w', encoding='utf-8', newline='\n').write(src)
print('ok', src.count('\n- R-'), 'requirement lines')
