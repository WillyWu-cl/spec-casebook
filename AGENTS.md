# spec-casebook — agent instructions

This repo turns CyberLink product feature specs (PowerDirector first, any product with specs) into reviewed test-case tables, one per feature and platform.
Follow the skill in `.claude/skills/spec-casebook/SKILL.md` and the `references/` file it names for the task. The
repo also carries its own `ebug-draft-generator` and `ebug-tr-filer` skills for filing failures found while running a
table; their casebook overlay (`ebug-tr-filer/references/casebook-overlay.md`) comes first. Edit skills only under
`.claude/skills/`, then run `node scripts/sync-skills.ts` to copy them to `.codex/skills/` (`check.ts` warns when the
two differ).

- The approved table for a feature is `library/<product>/<feature>/<ios|android>/cases.csv`. Treat it as the correct answer
  for that feature; change it only through the review page's Save or an explicit user request.
- Keep this repo independent from the exploration-test folder, the spec agent repo and other QA tools. (One user-approved
  exception, 2026-11-03: a one-time copy of the exploration knowledge bases into `knowledge/sources/`, see below.)
- Table rows are written in English.
- Scripts are TypeScript run directly with Node ≥ 22.18 (types are stripped, not checked). Keep new scripts in
  TypeScript and run `npm run typecheck` after changing any script.
- Each feature lives in `library/<product>/<feature>/` (see its generated `README.md`): `specs/<date>/` holds every spec set
  received (original files git-ignored; `spec-set.json` and `extracted/` text kept), and `ios/` / `android/` hold
  the platform tables. Never put spec files anywhere else.
- **Old layout (2026-10-29).** The library was `library/<feature>/` before 2026-10-29. If a checkout still has a
  folder straight under `library/` that holds `ios/`, `android/` or `specs/` (e.g. `library/ai-mini-drama/`), it is a
  pre-move checkout's local files: before any other work, tell the user and move them as README › *Moving a checkout
  from the old layout* says (`rsync` into `library/<product>/<feature>/`, then remove the old folder), and have them
  restart any review or pages server with the new ID.
- The review server (`scripts/review.ts`) and the page server (`scripts/pages.ts`: review, plan and coverage on one
  address) are local processes the user may be using; do not stop them unless asked.

## Team preferences

Standing rules from the team's sessions, kept here (not in any one person's local agent memory) so everyone who
clones the repo, in Claude Code or Codex, works the same way. Add new standing preferences here, dated, in one or two
lines; put the full rule in the skill or reference file that applies it and point to it. Pointers: *overlay* =
`ebug-tr-filer/references/casebook-overlay.md`; other files are under `spec-casebook/`.

- **eBug descriptions (reviewers, 2026-10-21/27).** One action per Repro step, a Spec Link on every entry, an image on
  every entry and the log excerpt on every failure-related one (shown on the review card), no video unless asked;
  `check_ebug_format.py` enforces them (overlay rules 1–3).
- **Filing account.** Review pages prefill Creator, TRCode, source tag and method from the newest filed batch
  (`node scripts/ebug-defaults.ts`); "Same build" / "Same TR" means that batch's TR once its header names the tested
  build (overlay rule 4).
- **No comments on existing eBugs (2026-10-21, until lifted).** Never comment on, reopen or reject the fix of an
  existing ticket; rechecks and fixed tickets are listed for information only (overlay).
- **Dedupe per OS (user, 2026-10-28).** A ticket on the other OS never makes a finding a duplicate; a same-OS match is
  left off the drafts and review page (kept only in `dedupe.txt`), unless that ticket is **closed** and the bug is
  back: then it is a new card naming the closed ticket (overlay, *Dedupe per OS*).
- **eBug owner and type (RD, 2026-10-21 — replaces the 2026-10-20 rule; revertible).** Casebook findings are
  `[AIAgent]` Functional or `[UI]`, owner RD (Doc for copy), never `[UX]`; RD forwards to PM when it wants a ruling. A
  finding with no spec basis is held as a PM question, not filed. Exploration (`[AIFound]`) keeps filing `[UX]`.
  **Revert** — the user may restore the 2026-10-20 rule: "A UX problem goes to PM (BugBelong PM), who decides before
  handing it to RD. A problem that plainly needs an RD fix (performance, waits, missing behaviour) is Functional,
  owner RD, with no `[UX]` tag." Put that text back here, then follow the revert steps in overlay rule 5
  (`--allow-agent-ux` / `ALLOW_AGENT_UX=1`).
- **Pink fault switches, AI Mini Drama (2026-10-20).** 「Fail turn」 fails an LLM chat turn (outline, cast confirm,
  storyboard offer); 「Inject failure status」 only applies to a video beat once filming starts. An injected failure
  logs `AppTweaks injected <Tool> failure #N`; `status=tool_error` alone is the server's own failure. Re-check any bug
  found with injection on with every fault switch Off (or the correct one), and name the switch in the Repro steps
  (RD rejected DRI261896P0043 for using the wrong switch).
- **Request ledger (2026-10-21).** Every request about a feature's tables or runs (from anyone) goes into
  `library/<product>/<feature>/requests.md` the same session with the next REQ ID (`analysis.md` › Standing inputs).
- **Design vs PM (2026-10-21/22, REQ-029).** PM-only features become rows now (「PM-only: no Design frame yet」) and are
  updated when the Design draws them; where the two disagree the newer wins, a Design frame older than the newest PM
  file loses to it, and when dates can't tell, check the device and decide with the user (`analysis.md` pass 7).
- **What the repo is for (user, 2026-10-27, REQ-036 / REQ-037).** A thorough spec analysis, then a run that does not
  drain tokens. Missed rules are fixed in the reading step or pass that skipped them, never by copying another
  tool's cases; the spec agent comparison is a report on request only (`SKILL.md`, `analysis.md`).
- **The analysis finds spec rules itself (user, 2026-10-22, REQ-030 / REQ-032).** Dated Figma frames newer than the
  PDF are read, every annotation block and linked page is traced, hidden clauses get an observing row, and each
  variant gets its own row (`reading-the-spec.md` steps 8–9, `analysis.md` passes 9–10).
- **New rows go where they belong (user, 2026-10-22, REQ-033).** Right after the row they extend, an old row modified
  when checked on the same screen, and the next round lists them in their stage segments (`SKILL.md` step 3).
- **Every control pressed, every arrow walked (user, 2026-10-28, REQ-038 / REQ-052).** Every tappable element the
  Design, PM and MX Figma files draw is inventoried, traced to a row and pressed in runs; the coverage page proves it
  and marks everything on every board, superseded versions as Excluded (`reading-the-spec.md` step 10, `analysis.md`
  pass 11, `run.md`).
- **Figma access (user, 2026-10-28/29).** Design only through the `figma-design` MCP server (qa-dm@cyberlink.com), PM
  and MX only through `figma-pm` (qa1@cyberlink.com); never swap accounts by hand or use a claude.ai Figma connector (`.claude/settings.json` blocks it for terminal and IDE
  sessions; desktop app users disconnect it at claude.ai › Settings › Connectors);
  `whoami` before a read. Sign-ins are the user's: the agent opens a Terminal tab with `claude` and walks them through
  README Setup 5. Figma is not a gate (user, 2026-10-30): without the sign-ins an analysis runs **PDF-only**
  (`extracted/figma-pending.json`) and a machine with them catches up later (`reading-the-spec.md`, *No Figma access*). Quota is small: bulk reads per board group, changes found by fingerprint (`figma-check.ts`), every
  read committed (`reading-the-spec.md` step 10).
- **Figma reads by plan, call, save (user, 2026-11-05).** Inventory re-reads go `figma-check.ts --plan` → the printed
  calls, one at a time per server, with their exact description → `--save` (replies copied from the transcripts,
  never retyped; leftovers re-packed) until nothing is left; a read stops at its time budget and keeps what it read
  (`reading-the-spec.md` step 10, *Plan, call, save*).
- **Full Figma data by script (user, 2026-10-30).** When every node's geometry and styling is needed (not just
  controls and arrows), read it with the `figma` skill's source branch, on Design Figma links only (never PM or MX):
  one `use_figma` script per output chunk plus one full-size screenshot per board cropped locally, never per-frame or
  per-instance MCP reads (`figma/references/source.md`).
- **What is drawn over a board (user, 2026-11-04, REQ-078).** Arrows, connectors and notes drawn over a Figma board
  are part of it: reads, the change check and board images include them, and a changed board's words are compared
  with its spec notes (`figma-text.ts`) so its rows follow the redraw; `board-lint.ts` (REQ-079) checks every mark
  against the board's screenshot text (`reading-the-spec.md` step 10).
- **Design check on the casebook's flows (user, 2026-11-03).** Whether the app matches the Design is the `figma`
  skill's conformance branch (`scripts/design.ts`): the rows that already reach each Design screen are its navigation
  (else the Design's own arrows), captures ride on casebook runs, two independent review passes settle the findings,
  and the Design tab shows them; a screen only the Design's arrows reach is a gap for the analysis
  (`figma/references/conformance.md`). It also works with no casebook table (`figma-source.ts init`).
- **Figma data shared, one folder per feature (user, 2026-11-03).** Both skills keep a feature's Figma files in
  `library/<product>/<feature>/specs/<set>/extracted/` (board images in `figma/` with `shots.json`, used by both) and
  commit what another computer needs (source responses, board images, design plans, captures as 750 px copies, results
  and verdicts), so a pull needs no Figma call or phone file (`figma/SKILL.md` › *One feature folder*). `npm test`
  covers the figma scripts.
- **Domain knowledge (user, 2026-11-03).** Facts about an app that no spec states go in `knowledge/` at the
  narrowest true scope: CyberLink (`library/knowledge/`, `KC-`), product (`library/<product>/knowledge/`, `KP-`) or
  feature (`library/<product>/<feature>/knowledge/`, `KF-`); `scripts/knowledge.ts` merges them for analyses
  (Standing inputs 6) and run segments. Generated or second-hand ones go in as `observed`; originals stay local, only
  entries, `source.json` and extracted text are committed. Intake and upkeep are the `domain-knowledge` skill; during a
  run knowledge is only parked (`knowledge.ts … inbox add`) and processed by a fresh subagent at the phase wrap-up.
- **QA Reports (user, 2026-11-03, REQ-072 / REQ-073).** A TR's QR is written with the `qa-report` skill (`scripts/qa-report.ts`): only OK and Fail rows; a bug not fully verified is left off the QR and left alone (still "Not yet verified"), never filed as NotVerified. A scenario that can no longer be completed or triggered by any means counts as fixed (OK, with a Note saying why). Lettered Details like the team's QRs, one evidence ZIP, `qr-review.html` approved by the tester before the IF3 Standard Report is filled and saved once. Replaces the Spec agent's `verify-tr-ebugs` report format here.
- **Verify in one journey (user, 2026-11-05, REQ-093).** `/qa-report <TR>` verifies the tester's bugs on the TR's
  build first when they have no verdicts; the checks are ordered along the flow in `verify-plan.md` so one drama
  carries as many bugs as it passes, shared steps and long waits are reused, never a fresh start per bug
  (`qa-report/SKILL.md` › *Verify first*).
- **Evidence on each eBug (user, 2026-11-05, REQ-099).** A QR's screenshots and logs are uploaded to each bug in it
  (`qa-report.ts upload … --send`, before Create) and its Reason names them like a description (`{file.png}`), not
  the ZIP link; uploads can't be removed, so only after the tester approves (`qa-report/SKILL.md` › *Evidence on
  each eBug*). The one exception to *No comments on existing eBugs*: files only, never a comment.
- **QR account line (user, 2026-11-05, REQ-100).** A QR's Details name the phone's signed-in account as the app's menu
  shows it, with its tier (`Account: cltqauiap2@gmail.com (Premium)`), read from the menu at each verify run
  (`qa-report/SKILL.md` › *Wording*).
- **Bug verify against today's spec (user, 2026-11-05, REQ-091).** Before verifying a bug, check its Expect Result
  against the current spec in the repo (ticket comments, row, `requirements.md` changes and open questions, newer
  frames in `extracted/`), then judge the build's current behaviour against that. An open question means Hold
  (`qa-report/SKILL.md` › *Expected = today's spec*). But a build that does what the bug expected is OK even
  with a board unread or a question open (user, 2026-11-05, REQ-098).
- **AI Mini Drama credits (user, 2026-11-03, REQ-073, until lifted).** For runs and rechecks, use whatever credits a check needs for anything except a full video generation (characters, outlines, storyboards, regenerations, updates); a full video generation still needs the user's go-ahead or an existing video. Check every path a bug names rather than stopping at one to save credits.
- **One step per line (user, 2026-11-03).** When a table cell holds two or more steps, each goes on its own
  numbered line, whether they were numbered (`1. … 2. …`) or plain sentences (`Open X, then tap Y`); `check.ts`
  warns (`formats.md`, writing rules).
- **Source read before the design check (user, 2026-11-04, REQ-081).** Every Design board the casebook inventories
  is read whole before any design pass walks its rows; `design.ts status` stops on a source gap until it is read or
  excluded with a reason (`figma/references/conformance.md` › *Plan*, `source.md` step 1).
- **Design captures ride on runs (user, 2026-11-04).** In a casebook run, `device.ts … case <ID>` arms automatic
  design captures (every page source already read is matched to the row's Design screens); a design pass walks only
  what runs left (`screens --left`), and the Design tab shows the Progress page's time and usage table for it (`figma/references/conformance.md`
  §2, *The Design tab*).
- **Design check: only this feature's part, and decisions with a reason (user, 2026-11-04, REQ-082).** On a shared
  screen (the Launcher) other features' controls are traced `n/a: other feature: …` and the design check leaves their
  areas out; every item on the Design tab takes Bug / OK / N/A with a reason (required to overturn a bug); a capture's
  screenshot and page source are of one moment (`figma/references/conformance.md` §2, §3, §5).
- **Design check: exact data first (user, 2026-11-04, REQ-084).** Figma from the source read (render bounds), the
  phone from the page source (Android layers by drawing order, keyboard window); the screenshot only for colours and,
  by OCR, glyph geometry and a layer cross-check. Captures must match the frame's dark/light and keyboard state;
  reviewers quote texts from compare.json, never from images (`figma/references/conformance.md` §2–§4).
- **Android view data from inside the app (user, 2026-11-04, REQ-085).** `scripts/android-viewdump.ts` re-signs the
  installed PowerDirector debuggable (rdqe-spec-contract-agent's viewdump, copied with the user's approval) and dumps
  exact text colour, size, weight, lines and drawables; the first install replaces the app with an uninstall (data
  cleared) only with `--yes-uninstall` once agreed. With that build, Android design captures save the view data and
  the check reads it before OCR and pixels (REQ-086; `figma/references/conformance.md` §3).
- **Colours set and drawn (user, 2026-11-05).** A design check colour item lists the value set (Figma fill and token,
  the app's value and resource) beside the colour drawn on each image; `check` reports app values the screen does not
  show (`figma/references/conformance.md` §3).
- **eBugs on Results (user, 2026-11-04).** A failed case on the Results page links its eBugs (filed from the run,
  the existing ticket it repeats, or named in the result) to eCL (`scripts/results-page.ts` header).
- **Both platforms by default (user, 2026-11-04).** A feature gets an iOS and an Android table unless the user names
  one platform (`SKILL.md` step 0).
- **A Figma link is the spec (user, 2026-11-04).** When the user sends a Figma link and no PDF, read the spec from
  Figma directly; do not ask for a PDF export (`reading-the-spec.md`, *Figma-only spec*).
- **Build downloads (user, 2026-11-05).** The build under test from a TR's OneDrive folder is always downloaded
  without asking; say the file name and size in chat, then check the MD5 (`run-android.md`, `fixtures.md`).
- **Phone fixtures (2026-10-27).** What a run needs on the phone or account is in
  `library/<product>/<feature>/<platform>/fixtures.md`.
- **Live pages (user, 2026-10-28).** `scripts/pages.ts` serves Cases, Progress, Results, Coverage and Design with one
  shared tab bar holding the only language switch. `+ Add case` takes free text; the agent turns open notes into rows
  (`SKILL.md` step 4, New-case notes). No new tabs without asking (user, 2026-11-04: keep the pages few and readable);
  a table's Open questions sit on Cases above the table with answer boxes, applied as rulings (`SKILL.md` step 4,
  Question answers). Open pages update only when what they show changed (user, 2026-11-05): Progress, Results, Coverage and
  Design redraw in place, patching only what differs; Cases offers a Reload button (`scripts/pages.ts` header).
- **One-off HTML pages (user, 2026-11-05).** A page asked for as HTML is a local file, not an artifact, and never goes
  on the Desktop: it goes in `library/<product>/<feature>/comparisons/` (git-ignored, local only), named
  `<date>_<topic>.html`. The committed spec agent comparisons stay in `<platform>/comparisons/`.
- **Never uninstall PowerDirector on the QA iPhone (user, 2026-10-29, until lifted).** The build cannot be installed
  again for now, so no command may uninstall or reinstall it: `app-setup.ts reinstall` / `fresh` and every
  fresh-install case are off; those cases are recorded Blocked `--as test-data` ("PowerDirector cannot be reinstalled
  on the QA iPhone"). `app-setup.ts` refuses to uninstall unless `CASEBOOK_ALLOW_REINSTALL=1`, which only the
  user lifting this rule allows. WDA is never uninstalled either (below).
- **First-launch consent on the phone (user, 2026-11-04).** After a (re)install the agent gets past the app's
  GDPR/consent screen itself (「Get Started」 accepts the Terms of Service and Privacy Policy, authorized by the user);
  sign-in stays the user's when the agent cannot log in (the agent never types passwords); where a phone signs in with
  its Google account button and no password (the SM-A5360, `fixtures.md`), the agent does it. Every permission the app
  asks for (notifications, photos, microphone…) is allowed (user, 2026-11-04).
- **On the phone (2026-10-21/27).** Wi-Fi may be toggled for offline cases once the phone is on USB (other system
  settings need the user's go-ahead); rows are reached only with `scrollto` / `pink`; Auto-Lock Never, `device.ts
  restart` at every segment, never uninstall WDA; exit 75 = BLOCKER, pushed to the user (`run.md` steps 1, 3, 4).
- **One section per context (user, 2026-10-27).** Every run works section by section (segment, phase wrap-up, board
  group); the user's chat only orchestrates, each section in a new subagent with a self-contained brief, else a
  cleared worker session, else a new chat the user opens (`run.md`, "Keep going without asking").
- **What never gets pushed (user, 2026-11-04).** Run `node scripts/pr-check.ts` before every push or PR and fix
  each blocker: no git-ignored files (no `add -f`), no credentials, no file over 5 MB, no whole exports from other
  tools, nothing under `library/` outside a feature or `knowledge/`, no hand-edited `cases.csv`. Rebase on
  `origin/main` first; a table main approved meanwhile is re-saved as the next version, a clashing `REQ-` is
  renumbered (README › *Before you push or open a PR*).
- **Commit and push (user, 2026-10-27).** "Commit and push" (or "push") means push to `origin` right after the
  commit, with no second confirmation; a plain "commit" stays local.
- **Parallel phones: investigate only.** Running segments on several phones at once is an open idea in
  `INVESTIGATE.md`; do not build multi-device support without asking.
- **Plan usage (2026-10-21).** The account is shared, so usage-card readings overstate a run. The run plan's main
  figure is a token-rate estimate calibrated on P1 (`runs/usage-calibration.json`: P1 ≈ 3 full 5-hour windows of a 1×
  Pro account); the account total is shown muted. Seat sizes: round 1/P1 1× Pro, round 2 a Team seat = 6.25× Pro,
  round 3 (from 2026-10-22) a 1.25× Team account.
