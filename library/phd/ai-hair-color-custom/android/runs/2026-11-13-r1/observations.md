# Observations — R1

- **O-1** (closest: R1-c leave/X rows) On the colour page (sample photo, nothing generated), ✕ at the bottom left
  closed AI Hair Color into the Edit Room with the photo open (Quick Actions / Edit / Enhance / Portrait…), not back
  to the Launcher; system Back from there went to the picker (Single / Batch), Back again to the Launcher.
  Screenshot: none of the Edit Room (texts read only). Check against the spec's exit rule in R1-c.
- **O-2** (closest: TC-016, TC-011; R-012) 「Cancel」 on the 'Crop to Continue' ratio dialog (2:1 and 4:1 photos, from the
  AI Hair Color picker) does not return to the picker: it opens the photo in the Edit Room (Quick Actions / Edit /
  Enhance / Portrait…), seen twice (10:23, 10:24). R-012 only says Cancel 「gives up entering」; no row states where it
  lands. Ask PM whether the picker is expected. Screenshot: `screenshots/O-2_cancel_edit_room.png`.
- **O-3** (closest: TC-015, R1-c leave rows) System Back on the colour page (slanted photo, nothing generated) also
  lands in the Edit Room with the photo, like ✕ (O-1). That Edit Room is how TC-015 was reached.
  Screenshot: `screenshots/after_back.png`.
- **O-4** (closest: TC-005) New fixture `hc_tilted45_4x5.jpg` (hc_portrait_4x5 rotated 45° on a 4:5 canvas) pushed
  to `/sdcard/Pictures/HairColor/` at 10:16 to rule out a too-small tilt; it also opened with no slant warning. It
  sorts first in the HairColor album (newest), shifting the other photos one place. Add it to fixtures.md.
- **O-5** (closest: TC-005, TC-012, TC-015, TC-016) The colour page opens with 「Soft Black」 selected (Custom is first in
  the row but not selected) on every entry this segment. For R1-c to judge against the default-selection rule.
- **O-6** (closest: TC-022; R-025) The two split-dye styles (「Half-and-half」, 「Split-dye」) have photo thumbnails like the other 9;
  R-025 called their plain-colour thumbnails 「still」 placeholders, so TC-022 took the photos as the finished assets.
  Style names on this build: Solid, Ombre (no accent), Roots, Dip-dye, Balayage, Babylights, Face framing, Bangs,
  Earloop, Half-and-half, Split-dye; crowns on Balayage, Face framing, Bangs, Half-and-half (Free account; Q-6).
  Screenshot: `screenshots/TC-022_style_end.png`.
- **O-7** (closest: TC-032, TC-033, TC-043) A colour picked in the palette is added as a new swatch right after the
  wheel key (rows grow from 8 to 9 cells) and stays in the row after leaving and reopening the room (unselected),
  while the style and selections reset. Not in the spec (R-022 says 7 recommended colours). Screenshot:
  `screenshots/TC-026_base_only.png`.
- **O-8** (closest: TC-031, TC-035) The palette's Done/Cancel header sits over the photo's lower edge and the room's
  ✕ ↩ ↪ ✓ row stays under the palette (as under the panel, TC-019). Screenshot: `screenshots/TC-031_palette.png`.
- **O-9** (closest: TC-045, TC-050; R-040) After a rejected generation the dialog says 「The credits have been refunded.」 and the server
  does refund (log `totalRemain=1994`, Details shows 「Generation failed, credits returned +6」), but the room's credit chip
  keeps the charged value (1988) until the room is left and reopened. Screenshot: `screenshots/TC-045_after_ok.png`.
- **O-10** (closest: every R1-d / R1-e generation row) The HairColor fixtures (hc_*, Shutterstock-watermarked) are
  rejected by the Custom generation: 「Please Try Different Content」 / 「The credits have been refunded. Your content may
  violate our Terms of Service. Modify the image, and then try again.」 / 「OK」 after about 41 s (log `CONTENT_REJECTED`,
  Mixpanel `nsfw_failed`), twice on hc_portrait_4x5 with Ombre. Generations ran on a Pexels stock portrait instead
  (picker › Stock › Pexels, search 「woman portrait」, 2nd in the right column): recipes `pick-pexels-portrait.steps` +
  adb keyevent 66 + `pick-pexels-portrait-2.steps`. R1-e should use it too, or a clean fixture added to fixtures.md.
  Screenshot: `screenshots/TC-045_result.png`.
- **O-11** (closest: TC-052; R-050) A Custom generation whose app was force-stopped mid-wait still finished on the
  server: its result (third blue item) appears in My AI Artwork › AI Hair › Color, though the room recalls nothing and
  the 6 credits stay charged. Ask PM whether that is intended. Screenshot: `screenshots/TC-052_artwork.png`.
- **O-12** (closest: TC-045, TC-047) During a generation the photo is drawn enlarged over the top of the open panel
  (Style row hidden) with a peach scan bar moving down; panel and buttons are dimmed. The panel button keeps reading
  「Retry」 during a Retry wait, so `waitfor Retry` is not a completion signal: use the log
  (`AIHairColor_Generate_Status`). Screenshot: `screenshots/TC-046_w1.png`.
- **O-13** (closest: TC-058..TC-068; R-032) Every Custom generation logs the same style id whatever the chosen style:
  `GenAI_Feature_Generate` / `AIHairColor_Generate_Status` carry `"style":"Style_010_Custom_HairColor_gpt-image-2.5-sunburst"`
  for Ombre, Solid, Dip-dye, Roots, Earloop, Split-dye and Babylights alike (R1-e, 11:00–11:15), so the analytics cannot
  tell the Custom styles apart. The results did differ per style. Ask PM whether a per-style value is expected.
- **O-14** (closest: TC-032, O-7) A colour picked in the palette replaces the earlier extra swatch rather than adding a
  second one: the blue extra swatch from R1-c became the new red one (Base row still 8 colours + wheel).
  Screenshot: `screenshots/TC-063_setup.png`.
- **O-15** (closest: TC-061, TC-058, TC-059, TC-067, TC-069; R-061, Q-6) On this build the premium (crown) Custom styles
  are Balayage, Face framing, Bangs and Half-and-half; tapping one shows a 「UNLOCK TO VIP」 badge under the credit
  chip and Generate on a Free account opens the 「PhotoDirector Premium」 paywall, charging nothing. That is what TC-069
  expects; R1-f can use it. Screenshot: `screenshots/TC-061_generate.png`.
