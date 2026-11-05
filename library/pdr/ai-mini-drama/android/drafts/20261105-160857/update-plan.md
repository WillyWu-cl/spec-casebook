# Update plan — pdr/ai-mini-drama / android: approved v10 → draft 20261105-160857
## Spec files
- Unchanged: the 2026-10-21-2 PDFs, Design and MX Figma · New or changed: PM Figma board 5318:2605 「11/5 update — 角色名人圖被擋：引導找 CS 退點」 (§13.26, added 11/5, read by REQ-095 as q14) and the arrows of the 11/3 – 11/4 boards (q12, q13) · No longer supplied: none
- What the board says: `specs/2026-10-21-2/extracted/board-notes.md` › 「PM — 11/5 board 「角色名人圖被擋」 and the 11/3 – 11/4 arrows」.
- Why now: `check.ts` failed on the approved v10 with 「Flow arrows with no requirement (4): 5014-27027, 5212-27475, 5212-27476, 5318-2806」 after the REQ-095 reads; this draft clears it (REQ-096).

## Requirement changes
| Requirement | Change | Before | After |
|---|---|---|---|
| R-495 | new | – | §13.26: a generated character the server judges a real public figure is not shown; 「This image can't be used」 dialog with Close / blue Send Feedback; only Make your character, Finish your characters, chat character change |
| R-496 | new | – | §13.26: the blocked character is not saved to Mine; no automatic refund (user guided to CS); noted as an exception to KP-007 in the Domain rules table |
| R-497 | new | – | §13.26: Close on Make your character returns to the form, input kept, retry possible (Finish / chat: Q-A23) |
| R-498 | new | – | §13.26: Send Feedback opens AI Issues pre-filled (feature 「AI Mini Drama · Character generation」, celebrity issue text with time, the description as prompt, e-mail when signed in, task ID hidden) |
| R-499 | new | – | PM flow arrow 5318-2806 (Send Feedback → AI Issues form), walked by TC-575 |
| R-500 | new | – | PM flow arrow 5014-27027 (Clear filters → full list), walked by TC-567 |
| R-501 | new | – | PM flow arrow 5212-27475 (Go to Scene 2 → Scene 2), walked by TC-570 |
| R-502 | new | – | PM flow arrow 5212-27476 (Not now → stay on Scene 4), walked by TC-571 |
| Q-A23 | new | – | What Close does in Finish your characters and in chat, and what prompt Send Feedback fills there |

## Case changes
- New (6): TC-574 (R-495) after TC-054 — Make your character with a public figure's description → the dialog; TC-575 (R-498, R-499) after TC-574 — Send Feedback form pre-filled, not submitted; TC-576 (R-497) after TC-575 — Close back to the form with input kept, then a retry (Android: system back first, R-355); TC-577 (R-496, P1) after TC-576 — not in Mine, charge kept with no refund in Credit Details; TC-578 (R-495, R-496) after TC-338 — Finish your characters (Generate all) with a public figure in the cast; TC-579 (R-495, R-496) after TC-353 — chat character change to a public figure's look
- Modified (3): TC-567 — Spec Ref adds R-500 (arrow 5014-27027, this row presses 「Clear filters」); TC-570 — adds R-501 (arrow 5212-27475); TC-571 — adds R-502 (arrow 5212-27476). Row text unchanged; all three were added by the 11/5 draft and have not run yet.
- Removed (0)
- Unchanged: 520
- Order: the Make your character rows follow TC-054 (the earlier, reference-photo celebrity check); Finish your characters follows its timeout row TC-338; the chat row follows the chat character change rows (TC-353). The next round runs the new and modified rows first.

## Found by the analysis
- Annotation trace: the new board has no screenshot yet, so no annotation blocks; its rule text was read from the Figma texts (q14). Carried traces unchanged.
- Controls (REQ-038): the q12 – q14 reads added 12 untraced control groups; traced in this draft's `control-trace.json`: filter-empty board × chips → TC-567, cleared-list thumbnails → TC-326, cast slots → TC-120, character chips → TC-033, chat-scroll scene thumbnail → TC-556, celebrity board tile enlarge icon → TC-135, the pre-filled AI Issues fields (timeout and celebrity forms, one group) → TC-543, TC-575 (dismiss TC-543); decorative icons (clip placeholder video icon, Fix card !, scene-edit image icons, tile 9:16 badge) n/a with reasons.
- Pass 9 hidden clauses: R-498 task ID sent hidden → TC-575 (no task ID field; the report itself is not sent); R-496 no automatic refund → TC-577, TC-578, TC-579 (Credit Details).
- Pass 10 variants: R-495 per entry point — Make your character TC-574, Finish your characters TC-578, chat TC-579.
- Domain knowledge: KP-007 (a failed generation refunds its credits) does not hold here: §13.26 says no automatic refund; recorded on the KP-007 row of the Domain rules table and in TC-577's Notes, so a run does not file the missing refund as a defect.
- Related rows: TC-054 (reference-photo check 「This photo can't be used」, before generating) is a different check and stays; the timeout Send Feedback rows (TC-336, TC-543) are the pattern for TC-575.
- `arrows.json`: the four arrows' `expected` filled. `board-lint.ts` not worse: 6 warnings before and after on both platforms (the six new boards are not checked: no screenshots).

## Not added (value check)
- Send Feedback from the Finish your characters and chat dialogs: one more blocked generation each only to read the same form; the prompt they pre-fill is part of Q-A23; TC-575 covers the form.
- The signed-out branch (no e-mail pre-filled): the test account is signed in (as TC-336).
- Submitting the form: it sends a real report to CyberLink support.

## PM-only rows
- TC-574 – TC-577, TC-578, TC-579 (PM 5318:2605): no Design frame yet.

## Left undone
- How to trigger: no fault switch for the celebrity check is known; the rows need a description the server judges a real public figure, and every try spends credits (allowed by REQ-073). Rows say to record the descriptions tried.
- Board screenshots for the six new boards (owed since REQ-095), so board-lint and the coverage page do not draw them yet.
- After approval: `node scripts/figma-text.ts pdr/ai-mini-drama 2026-10-21-2 --accept --board pm-1029-regenerate-one,pm-1103-fix-issues-copy,pm-1103-library-filter-empty,pm-1104-chat-scroll,pm-1104-multi-scene-fail,pm-1105-celebrity-blocked` (the six boards have no baseline yet; the first five were taken by v10, the last by this draft).

## Questions for you
- Q-A23 (PM): §13.26 covers Finish your characters and the chat character change but says what Close does only on Make your character. With no form there, where does Close go (the sheet with the slot empty and the rest of the batch kept? the chat with the old look?), and what does Send Feedback put under 「What Prompt did you use?」? Rows record what happens and check only what the board states.
