# PHD round-start setup

Part of the PHD domain knowledge (`README.md`). User rule, 2026-10-16 (K36). Applies to every `phd/*` run on iOS and
Android; each feature's `fixtures.md` points here.

## Once per round, before the first case

A round starts with a **free user and a credit balance of 0**. Check it once, before the first case of the round, and
separately on each platform's round. Do not redo it before every case, and do not reset again when the round's plan
later switches the subscription or buys test credits.

If both already hold, start. If either does not:

1. Edit Room › Settings › About: tap the backdoor button under [<] repeatedly until the debug dialog opens.
2. Turn **set to subscriber** off.
3. Scroll down and reset **UUID** and **member token**, each with its own button. RD labelled the button **rest**
   (for "reset"): use the one in that field's row, never a 「rest」 of another field.
4. Tap **OK**, close the app and open it again. Never clear app data instead.
5. After the restart, check again: free user and 0 credits. If it cannot be confirmed, record the setup as blocked
   (`--as test-data`); never run on an unknown state.

## Limits

- This is environment setup, not a product rule and not a per-case cleanup step; never write it as a table row.
- Keep before / after screenshots, the restart and a log line. Never put UUID or member-token values in a report;
  mask them in screenshots.
- Change no other debug option. When the round has already created works, spent credits or has a pending payment,
  do not use this reset as a mid-round recovery.
- On the QA iPhone the app is never uninstalled (AGENTS.md); this reset is how a PHD round gets a fresh account
  state without reinstalling.
