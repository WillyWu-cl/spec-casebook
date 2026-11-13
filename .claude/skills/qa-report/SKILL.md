---
name: qa-report
description: Write and file the QA Report (QR) for a CyberLink Testing Request after verifying its eBugs — OK / Fail per bug (anything not fully verified is left off), readable Test Result Details naming the phone's signed-in account, each bug's screenshots and logs uploaded to that eBug and named in its Reason (no ZIP), a review page the tester approves, then the IF3 「Create QA Report」 form (Standard Report) filled, saved once and read back. Use when the user asks to create, write, draft or file a QR / QA Report for a TR, or to report verification results on a TR. Includes verifying the tester's bugs on the TR's build first when no verdicts exist yet: one ordered journey that checks every bug where the flow reaches it, not a fresh start per bug.
---

# QA Report for a Testing Request

A QR is the tester's answer on a TR: one Standard Report per tester per round, one State (OK / Fail) and
Reason per eBug, plus a free-text summary and attachments. Saving it changes the TR's verify list (Pass / Fail / Not
yet verified) and can move each eBug's workflow, so it is filed only after the tester approves the exact text.

**Overlay rule 6 (no comments on existing tickets) still holds:** a QR is the one sanctioned way to report results on
existing eBugs, and only when the user asks for it in chat. Never add eBug comments, reopen tickets or edit a QR to
"fix" something after saving (every save can append to every linked bug); a correction is a new request.

## Inputs

- The TR (`ecl_query.py tr <TR>`): product, build, the verify list and its creators. "My bugs" = rows whose
  Creator is the tester, unless the user names another relation. **PhotoDirector Android (PHD-A) TRs only:** every
  bug on the verify list, whoever created it (*PHD-A QR*, below).
- A verification run with a verdict, screenshots and logs per bug (`library/<product>/<feature>/<platform>/runs/<date>-<tr>-verify/`,
  `result*.md`). Every verdict must have been seen on the TR's build; a bug never checked is not on the report.
- The QRs other testers already filed on the TR (links in the TR's 「QA Report」 list): read one or two for the
  team's current wording before drafting.

## PHD-A QR (user, 2026-11-13; PhotoDirector Android TRs only)

On a PhotoDirector Mobile for Android TR, follow the team's template QR261102-0081 exactly; everything else in this
skill (other products and platforms) keeps its own format below.

- **Scope:** verify every bug on the TR's verify list, whoever created it (Creator ALBERT_CHANG, WILLY_WU, …); the
  bug rows keep their own Creator.
- **Draft:** `"style": "phd-a"`, `"textOnly": true`, `"shortDescription"` = the TR's Short Description copied
  verbatim (e.g. `20.19.0.v202611111946 (Deluxe) for CyberLink 9 Languages + RUS + PTB (Enu, Cht, …) (R3)`).
  `qa-report.ts check` enforces these.
- **Form fields:** Short Description (the TR's), Test Result `PHD-A - Bug verification [OK=n, Fail=n]`, Testing
  Date. Test Result Details is that same Test Result line only (no lettered list). Product Version, Build Day,
  Build No., Operation System and OS Language stay empty. No attachments, no uploads to the eBugs.
- **OK Reason** (the row's `summary` is the middle sentence, ending with a full stop):
  ```
  Verified OK with 202611111946 build.
  AI Hair Color template names now stay on one line and are no longer truncated.
  Risk test: n/a
  ```
- **Fail Reason** (`observed` / `expected` in English, `observedZh` / `expectedZh` the 摘要 in Traditional Chinese):
  ```
  Verified Fail with 202611111946 build.

  Result:
  Small triangles still show at the bottom corners of the First and Last Frame sample photos.
  摘要：首尾影格範例圖下方兩角仍出現小三角形。

  Expected Result:
  The sample photos should show no triangles at their bottom corners.
  摘要：範例圖下方兩角不應出現三角形。

  Risk test: n/a
  ```
- The build in a Reason is the build number alone (`202611111946`, no version, no device). The *Wording* section's
  Short Description, Test Result prefix, lettered Details and Account line do not apply to PHD-A.

## Verify first (user, 2026-11-05, REQ-093)

`/qa-report <TR>` covers the whole job: when the tester's bugs on the TR have no verdicts on its build yet, verify them
first (run folder `runs/<date>-<tr>-verify/`, `bugs.md` with each bug's filed description), then report.

**One journey, fewest steps.** Never start fresh for each bug. Before touching the phone, write `verify-plan.md`:
1. List what each bug needs: the stage it starts from (new chat, a stage of an existing drama, a setting, a language)
   and what it costs (chat turns, credits, Wi-Fi off, waits).
2. Order the checks along the feature's own flow so one drama (or one session) carries as many bugs as it passes
   through: e.g. a new chat checks the empty-chat and outline bugs, then the character stage, then storyboard, then
   video settings. Reuse a drama already in History at the right stage before making a new one.
3. Share steps: one sent message or one Generate can check several bugs at once; start long waits (a refund that
   takes 30 min) early and check them at the end; put settings changes (system language, account) last and restore
   them once.
4. Count the plan's chat turns and credits against the account's limits (daily free chats) before starting; a step
   the limit would block goes where it still fits, or the user decides.
Then run it in that order, one segment per context (AGENTS.md › One section per context), noting every bug's
evidence as it is passed. A bug whose stage the journey could not reach is Hold.

**Side effects of the fix (user, 2026-11-06, REQ-102).** A fix is checked as it looks, not only as the page source
reads: DRA262610P0354 passed because the new 「You'll have N left」 line was in the page source, but its screenshot
showed the line grey on the blue Create storyboard card (1.6:1), filed by another tester as DRA262611P0038. For every
bug judged FIXED, before the verdict:
1. Name what the fix added or changed on screen (a new line, control, colour, message, wait) and every place it shows
   (each card or screen the bug names, plus the others that share the component: storyboard, update and video cards).
2. Look at each place's screenshot (open the image, not just the text) for: legibility against what is behind it
   (measure text against background where it looks faint; under 4.5:1 for body text, or clearly fainter than the
   card's other text of the same role, is a finding), clipping or truncation, overlap, wrapping that pushes a control
   off, wrong colour for the card's theme, and the old layout around it broken.
3. Compare with the Design frame for that place where one exists; where the Design does not draw it, compare with the
   card's own neighbouring text (the in-product basis).
4. Check one step past the fix: the action the new element leads to still works (Generate still charges what the line
   said).
Write it in the segment result as `Side effects: none seen (places checked: …)` or the finding. A finding does not
fail the original bug (*Verdicts*); it goes under *Other observations* on the review page with its evidence, deduped
against the pool (another tester may have filed it), and is filed only if the user asks.

## Expected = today's spec (user, 2026-11-05, REQ-091)

A bug's Expect Result is what the spec said when it was filed. Before verifying, check it against what the repo
holds now. First bring the repo up to date: the Figma change check of `spec-casebook` step 0 (one small call per
Figma file, `figma-check.ts`; 2026-11-05: no run between 10/29 and 11/05 did it, and PM had redrawn 18 boards and
added 5). A changed board that touches a bug's flow is read before its verdict; the full analysis pass can follow
later. Beyond that, no Figma or PDF call is needed when the repo already has it:
- the eBug page's newest comments and Resolve note (RD often cites a spec change there);
- the table row the bug came from (`cases.csv`, its Notes) and its R- rules in `requirements.md`: `Changed` notes
  and Open questions;
- the newest spec set's `extracted/` (`board-notes.md`, Figma frames dated after the filing, `figma/` board images).

Then judge the build's current behaviour against the current spec:
- The spec changed and the build does what it now says → OK, with a `Note:` naming the newer frame.
- The build differs from the current spec too → Fail. Write `Expected Result:` from the current spec (name the frame
  or rule), not from the bug's original text, and test every stage the newer spec splits the flow into.
- An open question decides it (RD's reading is not a PM ruling) → Hold. Tell the user which question it is.

**Does what the bug expected = pass (user, 2026-11-05, REQ-098).** When the build now does what the bug's Expect
Result says, it is OK. An unread or newer board, a pending Figma check or an open question does not hold it: list
that in the run's result and tell the user, since a newer spec that wants something else is a new finding, not a
reason to keep this ticket open. Hold is only for a path not checked, or for a build that differs from the bug's
Expect Result where an open question decides which is right.

## Verdicts (user, 2026-11-03, REQ-073)

| Result | When | Reason on the form |
| --- | --- | --- |
| OK | Every path the original eBug names is fixed on this build (it does what the bug's Expect Result says, REQ-098), **or the scenario can no longer be completed or triggered by any means** (flow or control removed, input capped so the state can't be reached) | `Verified OK with build (v<version.build>) on <device> / <OS>`, plus one `Note:` line when it needs one: why the scenario can't happen any more, or a fix that is the spec's fallback |
| Fail | Any original symptom still happens | first line `Verify Fail with build (…) on …`, then `Result:` and `Expected Result:` (one or two plain sentences each), then the evidence folder |
| Hold | Anything not fully verified: a path not checked, a fixture missing, a run stopped | **not on the QR at all** (not in the bug rows, not in Details); the bug is left alone and stays "Not yet verified" on the TR |

Never file NotVerified on a QR. Before calling something unreachable, try every way into it (other entry points,
real input by hand, other tiers); "the automation can't do it" is not unreachable. Before holding a bug for cost,
check what the run's credit rule allows (AGENTS.md › AI Mini Drama credits): check every path the bug names.

A new problem seen while verifying never fails the original bug; it goes under *Other observations* (and is filed
through `ebug-tr-filer` only if the user asks).

## Steps

1. **Draft.** Write `qr-draft.json` in the run folder (shape: `scripts/qa-report.ts` › `Draft`; a filled example is
   `library/pdr/ai-mini-drama/android/runs/2026-11-03-tr261102-0018-verify/qr-draft.json`). One row per bug in
   scope, including Hold rows. `summary` is the one-line Details entry; Fail rows take `observed` and `expected`
   from the eBug's own Result / Expect Result, rewritten for what this build does. Use the decisive screenshots
   only (2–4 per bug), with the log excerpt for timing or charge claims. Never put tokens or local paths in any text,
   and no e-mail except the tested account on the Account line (*Wording*). Evidence goes on each eBug (*Evidence
   on each eBug* below; `"attachToBugs": false` is only for the old ZIP drafts): every file of a row is named
   `<version.build>_<BugCode>_…` (a frame two bugs share gets a copy under each bug's name) and stays under 5 MB.
2. **Check and render.** `node scripts/qa-report.ts check <draft>` (must pass), then `render` (`qr-review.html`) and
   `text` (every field exactly as it will be typed). Then `upload <draft>` (dry run): it lists, per bug, the
   files that will be added and those already on the page.
3. **Review.** Open `qr-review.html` in the browser pane and look at every image yourself before showing it. The
   user changes verdicts or Reasons there and pastes **Copy decisions** back, or approves in chat. Apply the
   changes to the draft, re-run step 2 and get the changed rows approved again. Nothing goes to ECL before a clear
   "file it" on this exact revision.
4. **File (IF3).** Open the Create form (*Form notes* has the URL and field names). Fill from `text`: Short
   Description, Test Result, Testing Date, Test Result Details, Product Version, Build Day, Build No., Operation
   System and OS Language. In the bug list set State and Reason only for the approved rows; leave every other row on
   「Not Yet Verified」. First `node scripts/qa-report.ts upload <draft> --send`: each row's files go on its own
   eBug and `uploaded` records what each page lists; `text` warns while any row is missing. No ZIP goes on the QR
   (user, 2026-11-05, REQ-101): readers open each bug and its files. Then fill. Read the whole form back against `text`, then press the submit button (**Create**) once; never twice —
   if unsure whether it saved, reload the TR and look for a new QR in its list.
5. **Read back.** Open the new `https://ecl.cyberlink.com/IF3/qr/BPM/FormView/<QR>` and compare every field, State
   and Reason with `text`; check each bug's page lists the files its Reason names (`ecl_if3.py files <BugCode…>`). Reload the TR: its Pass / Fail / Not yet
   verified counts must move by the filed rows. Save `qr-receipt.json` in the run folder (QR code, URL, time,
   counts, the files on each bug, any mismatch) and add the QR to the run's `result.md` and the request's REQ line.

The first time the form is filled on a new template, record the field names you actually found in this file
(*Form notes*) so the next filing does not have to rediscover them.

## Wording

- Short Description: `<version.build> - Bug verify report (<TESTER>)`. Test Result: `PDR-A - Bug verification [OK=n, Fail=n]` (`PDR-i` for iOS).
- Details are a lettered list like the team's QRs: device, build and how it was installed, server, account, who tested (name the AI model when an agent drove the phone), scope, then OK and FAIL lists
  with one line per bug, other observations, and where the evidence is. Held bugs are not mentioned.
- Account (user, 2026-11-05, REQ-100): the account the phone is signed in to, as the app's menu shows it (Launcher ☰,
  the account at the top), with its tier: `Account: cltqauiap2@gmail.com (Premium)`. Read it from the menu at the start
  of the verify run (it changes when someone signs in another account) and write it in the run's `result.md`; never
  copy it from an earlier run. When the app is not signed in and the bugs need no account, write that with the tier
  (`Account: Not signed in (Free)`); signing in only for the QR is not needed (user, 2026-11-13).
- Reasons in English, short, no test IDs, tool names, timestamps or retry history; the detail lives in the run
  folder. Never write a `.zip` file name in a Reason (ECL links it as a web address). The last line is
  `Evidence: {file.png} {file_log.txt}`, the names of the files on that eBug, like a description (OK rows too).
  Details end with `Evidence: screenshots and logs are attached to each eBug and named in its Reason.`

## Evidence on each eBug (user, 2026-11-05, REQ-099 / REQ-101)

**Text only (user, 2026-11-13): this section is on hold.** The QR is filled with text alone: set `"textOnly": true`
in the draft, so Reasons and Details name no files and `upload` refuses; the screenshots stay in the run folder for
the review page. Old-ASP bugs (`PHA252025-…`) cannot take API uploads anyway.

A QR's Reason reaches every linked bug, so each bug's evidence goes on that bug, and the QR carries no ZIP (others
check the bug and the files there; `pack` refuses per-bug drafts):
`qa-report.ts upload` runs `ebug-tr-filer`'s `ecl_if3.py upload` per row (public code endpoint, `formDataPath=
$.UploadFiles`), which skips names already on the page and reads the page's list back. Tested 2026-11-05 on
DRA262610P0388 in Fail status: six files added, credited to the tester, no Activity Log line, status and handler
unchanged; the same on the seven Close bugs of QR261105-0035 the same day (files listed, no Activity Log line, still
Close). Upload before Create all the same, so RD reads a Reason whose files are already there. **Uploads cannot be
removed** (API or page), so they go only after the tester approved the review page for this revision, and a wrong
file stays on the ticket. This is part of the QR exception to overlay rule 6: files only, on the bugs in the QR,
never a comment.

## Form notes (first filing, QR261103-0039, 2026-11-03)

- **PhotoDirector Android (QR261113-0020, 2026-11-13).** Standard Report is `QRTemplateID=14830` on the PHD-A TRs
  (read from the TR page's QA Report Create button with `window.open` stubbed). Operation System lists Android 11–15
  only: an Android 16 phone leaves it unticked (Details names the OS). Test Result reads `PHD-A - …` (set
  `testResult` in the draft; the script's default is PDR). The TR's verify list and the tickets moved to Close about
  two minutes after Create, not at once. `PHA25…` / `PHA262026-…` bugs are old ASP: no API uploads.

- **Create.** The TR page's 「Create QA Report」 › Standard Report › **Create** opens a new tab, which the browser pane
  blocks; open its URL instead: `https://ecl.cyberlink.com/IF3/qr/BPM/Start/Request/NewCreated?QRTemplateID=14564&TRCode=<TR>`
  (14564 = Standard Report on the PDR-A TRs; read it again from `window.open` if a TR's template differs).
- **Fields.** `#QR_Edit_ShortDescription`, `#QR_Edit_TestResult`, `#QR_Edit_TestResultDetail` (textarea),
  `#ProductVersion`, `#BuildDay`, `#BuildNo`, the Testing Date (date input, prefilled today), Operation System and OS
  Language as checkboxes (labels like 「Android 15」, 「English」, 「9 Languages」). Set values with the native value
  setter plus `input` / `change` / `blur` events (Vue form).
- **Bug rows.** Every TR bug has a row, all on 「Not Yet Verified」. Its cells carry `data-if3-path`
  `FormData.EBugList.<i>.OK|Fail|NotYetVerified|Reason`; find the row by its BugCode text, click the radio, fill the
  Reason textarea. Read the whole form back (fields, every row's State and Reason, other testers' rows untouched)
  before the submit button, which is labelled **Create** (one press; the page then shows the new QR).
- **Effect.** Saving closes OK tickets (status Close) and sets Fail tickets to Fail at once; check with
  `ecl_query.py tr <TR>`.
- **Attachments (user, 2026-11-03, REQ-074; retired 2026-11-05, REQ-101: no ZIP on the QR any more, kept for
  the old drafts QR261103-0042 and QR261105-0035).** The ZIP went in the Create form's upload section (its
  `input[type=file]`), which uploads at once and lists the file with its link
  `https://ecl.cyberlink.com/IF3/Data/Download?o=iForm/…zip`. That link goes in `evidence.url` of the draft; `text`
  then puts it in Details and in every Fail reason (`Evidence: <link>` / `Folder: Fail/<BugCode>/`). The agent fills
  the input itself: serve the ZIP on `127.0.0.1` with CORS for `https://ecl.cyberlink.com` and
  `Access-Control-Allow-Private-Network: true`, `fetch(url, {targetAddressSpace: 'local'})` it in the form page, put
  the `File` in the input through a `DataTransfer` and dispatch `change`. Download the listed link in the page and
  compare its SHA-256 with `evidence.sha256` before filling anything else. Stop the local server afterwards. The
  public Attachment API refuses QRs ("No permission"), and adding a file to a saved QR means Edit › Save, so upload
  before pressing Create.
- The saved QR lists: QR Code, Product, TRCode, TesterName, Short Description, Test Result, Testing Date, Test Result
  Details, Product Version, Build Day, Build No., Operation System, OS Language, Attachment, and only the rows set
  (State / BugCode / Short Description / Creator / Severity / Reason).
