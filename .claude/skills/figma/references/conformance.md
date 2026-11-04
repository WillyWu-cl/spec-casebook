# Design check (conformance)

Part of the figma skill (`../SKILL.md`): does the app match the Design, screen by screen? One command,
`node scripts/design.ts <product>/<feature> <ios|android> <command>`, carries every step after the Figma read, and
`status` always names the next one. The flow:

```
plan (automatic) ─► scope review ─► capture while running (automatic) ─► check ─► two review passes ─► settle ─► your decisions ─► eBugs ─► recheck on the next build
```

What makes it light: the navigation comes from what is already known (the casebook's rows, else the Design's own
arrows), captures ride on runs that already reach the screens, the Figma side is the committed source read (no Figma
call here), and a machine measures every screen before anyone looks at it, so the reviewers read one image per screen.

## Files (same feature folder as the casebook)

| File | Written by | Shared in git |
|---|---|---|
| `<table>/design/plan.json` | `design.ts` (built again whenever its inputs change) | yes |
| `<run dir>/design/captures.jsonl` | `device.ts` / `device-android.ts` `design` | yes |
| `<run dir>/design/captures/<id>.webp`, `<id>.xml` | `check`: a 750 px copy of each capture and its page source | yes |
| `<run dir>/design/compare.json` | `check` | yes |
| `<run dir>/design/builder.json`, `reviewer.json` | the two review subagents | yes |
| `<run dir>/design/findings.json` | `settle`, then `decide` | yes |
| `<run dir>/design/ebug-findings.md` | `ebugs` | yes |
| `<run dir>/screenshots/design/<id>.png`, `.xml`, `-sheet.png` | the capture and `check` | no (local, like every run screenshot) |
| `specs/<set>/extracted/figma-source/design/out/` | `figma-source.ts merge` and `crop`, run by `design.ts` itself after a pull | no (rebuilt from committed files) |

`<table>` is `library/<product>/<feature>/<platform>/`, the casebook's table folder; a feature with no casebook table
gets the same folders. A computer that pulls the repo needs no Figma call and no phone file: `design.ts` rebuilds the
Figma output from the committed responses and board images, and every later step reads the committed copies.

## 1. Plan (automatic)

**The source read comes first (REQ-080, 2026-11-04).** A Design board the casebook inventories
(`figma-inventory-*.json` on the Design file) with no merged board file, or one `merge` left incomplete, is a
*source gap*: `status` names it and stops there (the next step is reading it, `source.md`), `check` warns, `plan`
prints it and the Plan view lists it under the boards read with a warning. It clears when the board is read whole or
excluded on the Plan view with a reason. Boards only the page `list` names are shown, not blocking. Never walk a
board's rows as a design pass before its read is whole: their captures match other boards' frames
(1016_Chat navigation was walked unread and its captures landed on main flow frames).

`design.ts … status` (or any other command) builds `plan.json` when it is missing or older than its inputs; `plan`
builds it on demand and takes `--skip <board or screen ids> --skip-reason "<why>"` for superseded boards (kept on
every rebuild). For each Design screen of the source read, the route that reaches it:

- **A casebook row** (when the feature has a table): the row pressing a control on the screen (`how: on`) or walking
  a flow arrow into it (`how: arrow`), with the best `fit` — `high` for an arrow or a control on at most 3 screens,
  `mid` up to 10, `low` for a shared control (back, a tab bar: the row only reaches the area) — then the best latest
  result, then journey order. `by_case` lists each row's screens.
- **A row citing the frame** (`how: cited`, fit `high`): a row whose Notes or Spec Ref name the screen's node id
  (「Design 5366:70814」). The analysis writes it for a frame the casebook inventory does not list (drawn after the
  inventory read, or a page the inventory knows only by a card inside it); a screen holding a smaller inventory
  screen inside it takes that screen's controls.
- **The Design's own arrows** (no table, or no row reaches it): the shortest path along the flow arrows from the first
  screen of the flow (`how: figma`, `steps`: each screen and the control pressed on it; `fit: entry` for a first
  screen). A screen no arrow reaches takes the path of the nearest reached screen on its board (`fit: variant`: a
  failure, an empty list or a loading state drawn beside it), then the state its name says is brought about there.
- With a casebook table, a screen only the Design's arrows reach is a **gap**: the table has no row for a screen the
  Design draws. Report it; the analysis fixes it in the reading step or pass that missed it (AGENTS.md *What the repo
  is for*), never the design check.
- A screen with none of these is `no-route`: ask the user how it is reached.

## 1b. Scope review (user, 2026-11-03)

Before the first capture the user sees what the check covers and what it leaves out, on the Design tab's **Plan**
view (it opens by default until a run has captures):

- **Scope**: the boards read (each linked to Figma, with its screen count and read date), how many screens are
  included and excluded, the flags below, what every capture measures, what the two review passes look at, and what
  is not covered (excluded screens, animation and timing, other languages and appearances, states that cannot be
  brought about).
- **Order** (user, 2026-11-04): boards in app-flow order by default (where the row reaching their earliest screen
  sits in `cases.csv`, screens in flow order within each), or by screen count, by screens needing a look, or as Figma
  lists them. A screen's image opens full size; a click outside it closes it.
- **One line per screen, by board**: its image, its route (row and fit, or Design path) and its `flags` (plan.json),
  the reasons to look at it: `area` ("approximate route": the row only taps a control shared by many screens, so the
  run must set up the frame's state by hand), `variant` (a state drawn beside a reached screen), `drawing` (narrower
  than 360 pt: a card or detail drawn on its own), `gap`. Each screen and each board has **Include / Exclude** with a
  reason (required; common ones are offered).
- **Needs your decision** (user, 2026-11-04): before the scope review every flagged or unroutable screen, after it
  only the screens new since, is red with a plain note saying what to decide, and neither button is pressed until the
  user picks one.
- **Save** (served live) sends the choices to `node scripts/design.ts <feature> <platform> scope` and reloads; the
  block ends with `reviewed` only once nothing is red. Opened as a file, the button copies the block for the chat
  instead, and the agent passes it to the same command (stdin or a file):

```
DESIGN SCOPE pdr/ai-mini-drama both
exclude 5366:70814: Drawing only, not a screen
include 2820:113367
reviewed
```

  `both` applies it to every platform with a plan (the Design screens are the same). It writes the skip list, a
  reason per screen or board (`skip_reasons`) and `scope_review` (date and the screen ids it covered) into plan.json;
  every rebuild keeps them, and a screen added later shows as **new since the review** until the next one. `status`
  says whether the scope was reviewed and names the review as the next step until it is.

## 2. Capture while running

`node scripts/device.ts <run dir> design <screen id> [--part N] ["note"]` (Android: `device-android.ts`) saves the
screenshot and page source of the screen on the phone and logs it with the case running. Both are of one moment
(user, 2026-11-04): the source is read again after the screenshot and the pair kept only when no text moved, up to 5
tries; a screen that never holds still is saved `unsettled` and the check flags it (`state`), so capture it again
once still. A capture taken while a chat was still scrolling put every app box on the wrong thing.

- **In a casebook run (default): automatic (user, 2026-11-04).** `device.ts <run dir> case <TC-…>` (both platforms)
  arms a watch (`scripts/lib/design-watch.ts`, local `.design-watch.json`) of the screens the row reaches and of every
  other routed screen the run has not captured. Every page source the device script reads anyway (taps, `els`,
  `texts`, `scrollto`, the end of a `waitfor`; on Android every read) is matched against their short Figma texts, and a
  match is saved like `design <id>` with `auto` and the match in `captures.jsonl`, printed as one `design: captured …`
  line: no extra call, navigation or tokens. A match is the check's arrival rule made stricter: the row's own screens
  60 % of 3+ texts, any other screen 80 % of 4+ texts with a clear lead over the next best (a loading or failure state
  drawn beside it is not taken for it); frames drawn with the same texts share one capture. A match is never saved over
a screen already captured in the run (a hand `design <id>` after `case` takes it off the watch), and a frame with a
dark or light background (a board drawing each screen in both) is only taken from a screenshot of the same appearance
(the screenshot's brightness; an unreadable one is not filtered). At `case` the script names
  the row's screens with too few texts to match, and at the next `case` (or `case -`) the ones the row passed without:
  capture those by hand (`design <id>`) if they did show, else a later round does. The `state` check and the review
  passes still catch a wrong state. A computer without the Figma data (`out/`) gets one line saying so and captures by
  hand (`design.ts … screens <TC-…>` lists a row's screens).
- **A design pass** (asked for on its own, or a feature with no table): its own run folder `runs/<date>-design/`.
  After a casebook run on the same build, `design.ts … screens --left <run>` lists only what that run did not capture,
  and the pass walks just those (check both run folders; the Design tab shows the newest capture of each screen).
  Otherwise `design.ts … screens` lists every routed screen in journey order with its row or Design path. Walk them segment by
  segment (one board or at most 40 screens, each in a clean subagent context) under the casebook's run rules
  (spec-casebook `references/run.md`: device restart, `scrollto` / `pink`, fixtures, needs, no reinstall on the QA
  iPhone, nothing charged beyond what the run allows).
- **Both asked at once** (a casebook run and the design check): one run. The casebook run captures as it goes; the
  check and the review run at the phase wrap-up on that run folder, and a design pass covers only `--left`.
- **Only the frame's state.** Match the frame's language (English unless it says otherwise), appearance, tier and the
  state its name says. A screen whose state cannot be brought about is not captured under its id: name it in the
  segment reply with the reason. A frame taller than the phone: capture the top, scroll, `--part 2` (3, …).

## 3. Check

`node scripts/design.ts … check <run dir> [--screen <ids>] [--recheck <earlier run>]` measures every new capture
against the Figma screen and draws its review sheet (`screenshots/design/<id>-sheet.png`: Figma and app side by side
at one width, every candidate numbered on both). The script header has the rules; in short, Figma's width maps to the
window width, each half of the screen is aligned on its matched texts, and what is left is a candidate:

| Kind | Candidate | Default |
|---|---|---|
| `state` | under 40 % of the frame's short texts found: probably another state (every candidate of the screen is in doubt) | major |
| `copy` | a Figma text whose closest app text differs (case, quotes, spacing and numbers ignored) | major (minor when one contains the other) |
| `missing` | a Figma text with no app text near it (`sample` when over 60 characters) | major |
| `truncated` | the app text ends in an ellipsis Figma does not have, or runs past the screen edge | major |
| `lines` | the app text wraps into more or fewer lines (the app's lines counted on the screenshot) | minor |
| `position` | a matched text more than 4 pt off after the alignment (only where 2+ anchors agree within 6 pt) | minor |
| `colour` | a filled shape (buttons, chips, cards, and badges and tags from 12 × 8 pt) ΔE > 12 from its Figma fill, or a text ΔE > 18 from its Figma colour | minor |
| `control` | an icon control of the inventory (no label) with no tappable app element where Figma draws it | major |
| `extra` | short app text Figma does not draw | info |

A shape is found on the app by the nearest matched text's offset, then the app element of about its size there (a
badge's own image view); a badge is sampled by its most common inner colour, not its edge (user, 2026-11-04). A
candidate made after the passes settled (the check run again) shows as Unreviewed until they judge it.

Not measured: how icons and images are drawn, font weight and size, radius, shadow, borders, spacing between non-text
shapes. The reviewers judge those on the sheet as `visual` items.

**Only this feature's part of a shared screen (user, 2026-11-04).** On a screen other features share (the Launcher),
the controls the control trace marks `n/a: other feature: <why>` (spec-casebook `scripts/controls.ts`; a group's
single instances in its `other` list) are left out with the area around each: the largest Figma node around it that
holds none of this feature's controls and under 60 % of the screen (a shortcut tile with its label, a 「What's
Trending」 section with its heading, a header of other features' buttons). Their texts, fills and icons are not
measured, app texts in those areas or equal to their texts are not `extra`, and `compare.json` lists the areas
(`out`), drawn dashed on the Design tab. Mark other features' controls that way when tracing a shared screen.

## 4. Two review passes, then settle

Two subagents, each over at most 15 screens with a self-contained brief; the second is never shown the first's file.
Each brief starts with `node scripts/design.ts <feature> <platform> status <run dir>` (it marks the pass's start for
the Design tab's token use).

- **Builder.** For each screen, its `compare.json` entry and its sheet: a verdict for every candidate except `extra`
  / `sample` (those only when they matter), plus `visual:<n>` items for what the measure cannot see, each with `kind`,
  `figma.box` (screen points) and a note. Writes `design/builder.json`.
- **Notes in both languages (user, 2026-11-04).** Every note is written twice, `note` in English and `note_zh` in
  Traditional Chinese (the same content, 「」 around quoted UI text in both); the Design tab shows the one for its
  language switch, and the eBug drafts use the English.
- **Reviewer.** The same inputs plus only the ids, kinds and boxes of the builder's `visual` items: judges every
  candidate and visual item afresh. Writes `design/reviewer.json`.
- `design.ts … settle <run dir>` → `findings.json`: the same verdict on both stands; a split, or a candidate either
  pass skipped, is a `question`. Settling again keeps every user decision.

```json
{ "screens": { "3946:72100": {
  "copy:3946:72105": { "verdict": "bug", "severity": "minor", "note": "App adds 「now」 to the format question.", "note_zh": "App 在格式問題多加了「now」。" },
  "visual:1": { "kind": "visual", "verdict": "bug", "severity": "cosmetic", "figma": { "box": [16, 88, 40, 40] }, "note": "Back icon is a chevron, Figma draws an arrow.", "note_zh": "返回圖示是 V 形，Figma 畫的是箭頭。" } } } }
```

Verdicts: `bug` (the app departs from the frame), `ok` (sample content such as names, credits or generated text; a
wider phone's reflow that keeps the same lines), `n/a` (the capture is not the frame's state), `question`. A bug's
severity: `major` (wrong or missing copy, a missing control, truncation), `minor` (position, colour, wrapping),
`cosmetic`. The frame is the spec under the casebook's rules: a dated frame older than the newest PM file loses to it,
a superseded frame is not the spec, and a conflict is a question (AGENTS.md *Design vs PM*).

## 5. Decisions and eBugs

- The user answers on the Design tab: Bug / OK / N/A on every measured item (the passes' verdict pressed), an eBug
  tick on each bug to file (or taken off), and a reason once an item is OK or N/A, required when it overturns a bug
  (user, 2026-11-04), then **Save decisions** (served live; opened as a file it copies the block and the agent passes
  it to `design.ts … decide`, stdin or a file: `<run> <screen> <id>: bug|ok|n/a[: <why>]`, `…: eBug`, `…: no eBug`).
  It writes each choice into the run's `findings.json` with `decided: user <date>` and the reason as `why`. A verdict
  on a candidate the check no longer makes (an area left out since) is not shown, settled or drafted.
- `design.ts … ebugs <run dir>` writes `design/ebug-findings.md`: each ticked bug with the screen, its Figma link, the
  row (or Design path) that reaches it, Figma against the app, both review notes, the build and the sheet. Draft from
  it through spec-casebook `references/ebugs.md` and the casebook overlay: `[UI]`, owner RD (Doc for copy), never
  `[UX]`; Spec Link = the Figma node; image = the sheet; dedupe per OS. Filing waits for the user.

## 6. Recheck on the next build

Capture the screens of the earlier run's bugs on the new build, then `check <new run> --recheck <earlier run>`: each
bug is `fixed` (its candidate is gone), `still` (same id: candidate ids are `<kind>:<node>` on every build) or `check`
(a visual item: both review passes look again). The Design tab shows it on each screen.

## The Design tab

`scripts/pages.ts` (`/design/`) or `design-page.ts --serve`, with two views: **Plan** (the scope review above) and
**Results**: one card per Design screen, coloured by status
(**Differs**, **Question**, **Unreviewed**, **Matches**, **Not captured**, **No route**), filtered by board and kind of
difference. A card opens Figma and the app side by side (click either to see it full size over the page, with its
boxes; boxes can be hidden; clicking a box or an item selects both) with the
build, the route (row, or Design path and any gap), an arrival warning, the recheck, and every difference boxed on
both sides with its verdict and decision buttons. Info items stay folded. Every computer that pulled the repo sees
both images: the shared board images and the shared capture copies.

**Time and plan usage** (user, 2026-11-04): above both views, the Progress page's table (account seat, wall, test,
idle gaps, Claude tokens, the token-rate estimate with seat equivalents, the shared account total, and what fell
outside), one row per run folder with design work, figured by the same code (`scripts/lib/usage-estimate.ts`
`spanStats`: the same price weights, `usage-calibration.json` estimate and the run folder's `tokens.jsonl` ledger). Design work is the messages of sessions naming the run folder
inside the design check's active spans: `design/activity.log` (every `design.ts` command on the run writes a line) and
the first sight of `compare` / `builder` / `reviewer` / `findings.json`; for a design pass on its own, also the run's
own activity (captures, taps). A casebook run's automatic captures cost nothing of their own, so under such a run the
panel shows that run's own figure (the same as Progress, not to be added). Served live, the page polls `usage.json`
every 10 s and redraws only the panel. A review subagent starts with `design.ts … status <run dir>`, which marks the
start of its span.

## Coverage of the Figma Agent

Everything the Figma Agent's QA covers is covered here, by a different route:

- **Scope and versions**: Design link and page in `figma-frames.json`; `scope.json` (boards listed, read, not found);
  the build of every check.
- **Figma source**: every node, style, variable, component and arrow from one source read (`source.md`), with saved
  returns checked for freshness and board images checked for size.
- **Per-state plan and arrows**: the plan above; arrow crops and pointer arrows in the source read; arrow traces and
  walked arrows on the casebook's coverage page.
- **Capture and arrival**: captures in runs or a design pass, scrolled parts, the `state` check.
- **Measurement**: text content, presence (texts and icon controls), colour, position after an anchor fit that refuses
  a loose alignment, wrapping, truncation, unspecified text; the rest visual, on the sheet.
- **Independent review**: builder and reviewer passes, every candidate answered, splits to the user.
- **Report and decisions**: the Design tab with filters, zoom, boxes and per-item decisions.
- **eBugs and fix verification**: `ebugs` into the casebook's eBug flow; `--recheck` on the next build.
- **Resume**: `status`, from committed files on any computer.

Not carried over: the Windows-only collection (UIA, QML dumper, dialog sweep, registry), React / Tailwind code
generation and expiring asset links (the source read holds more), phase timing, and its Traditional Chinese report rule
(the Design tab has both languages).
