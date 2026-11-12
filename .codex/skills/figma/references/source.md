# Figma source data in a few calls

## Two routes (user, 2026-11-11)

| Route | When | Calls for the 11 AI Mini Drama boards | Command |
|---|---|---|---|
| **REST + one use_figma call** | **Default** | 2 REST (nodes, images) + 1 `use_figma` (+ `get_screenshot` only for a board REST cannot render 1:1) | `scripts/figma-rest.ts` |
| **use_figma only** | When the user asks for it, or when this computer has no REST token | 196 `use_figma` + 11 `get_screenshot` (the first read; re-reads only touch changed boards) | `scripts/figma-source.ts` (*Steps*, below) |

Both write the same `out/` (same node format, same board fingerprints in `hashes.json`), so the design check and every
other reader does not care which route read last. `source.json` names it: `design.ts` unpacks `rest/boards/*.gz` after a
pull for the REST route, and merges `responses/` for the use_figma route (a feature with no `source.json` is
use_figma only). A use_figma read older than the last REST read is not merged unless `merge design --mcp`.
Measured 2026-11-11 (`library/pdr/ai-mini-drama/comparisons/2026-11-11_figma-rest-prototype.md`, local): all 11 board
fingerprints equal, `screens.json` and `arrows.json` identical, the design check's `compare.json` identical; REST is
also truer on hidden layers inside instances (real ids, exact boxes, where the plugin makes ids up and estimates).

### Default route: REST + one use_figma call

Needs qa-dm's personal access token (README Setup 5): `FIGMA_TOKEN`, else the keychain item
`com.cyberlink.figma-retrieval`, else `~/.casebook/figma-token`. CyberLink DC (where the Design files live) gives qa-dm
a Dev seat: 15 REST file reads a minute. A Design file in a View-seat team gets only up to 20 a month: tell the user.
All commands are `node scripts/figma-rest.ts <product>/<feature> [<set>] …`; replies go to files under
`…/figma-source/design/rest/`, never into the conversation.

0. A feature the casebook has not read: `figma-source.ts <feature> init <Design link>` first (records `files.design`).
1. **List** (1 REST call, first read only): `list [page or section id]` writes the page's sections and boards into
   `scope.json`. Pick the boards as on the other route (every Design board the casebook inventories included).
2. **Fetch** (1 REST call): `fetch [board ids…]` (default: the boards `scope.json` lists as read) gets every board's
   nodes with `geometry=paths` into `rest/nodes.json` (local, about 90 MB for 11 boards).
3. **Extras** (1 `use_figma` call): `calls` writes `rest/calls/extras.js` and prints its description. Load the
   `figma-use` skill, `create_session`, then call `use_figma` on `figma-design` with that description, the file's whole
   content as `code` and `skillNames: "resource:figma-use"` (about 20 KB of code; about 19 KB comes back). Then `save`
   copies the return from the transcript into `rest/extras.json`. It returns variable names, mode names, vectors with
   mixed (per-vertex) caps with their arrowheads, joins REST leaves out, boolean-operation radius and video fills;
   variable values per mode are left out (too large; no reader needs them). The vectors whose join REST leaves out are
   sent by id (a table of id segments keeps it about 20 KB): walk positions drifted where the plugin and REST count
   hidden layers inside instances differently (2026-11-12). A value the call was not asked for (`0`) leaves REST's own
   value in place, and a text run's own style comes from REST's `inheritTextStyleId`.
4. **Publish**: `publish` converts the REST reply and the extras to `out/` (figma-source's node format, with
   `screens.json`, `arrows.json`, `library.json` and `<board>.metadata.xml` made by figma-source's own functions),
   writes the committed copy `rest/boards/<file>.gz`, updates `hashes.json` and `scope.json` with the fingerprints and
   writes `source.json` (route, read time, the boards that changed). It refuses an extras return older than the fetch
   (`--no-extras` publishes without it: names, caps, radius and videos then stay unknown).
5. **Images** (1 REST call, only when a board's shared image is not current): `images` renders those boards at 1 px =
   1 pt into the shared `extracted/figma/` files and lists them in `calls/todo.json`. A REST render is the node alone,
   without the arrows and notes drawn over it (REQ-078), so a board the casebook keeps a current image of, cut from
   what holds it (`box` in `shots.json`), is cropped from that image, never rendered again, unless this read found the
   board changed (then the image predates the redraw and the board is rendered: 2026-11-12, batch-editing); a board with marks drawn
   over it and no current image is left to the casebook's change check (`figma-check.ts` prints the re-capture), and
   no render ever takes the name of such an image (2026-11-12, video-enhance: two boards lost their notes and arrows); a board Figma renders smaller
   (very large boards: `main flow`, 9909 pt, came back 8388 px) is listed for `get_screenshot` on `figma-design`
   (`nodeId`, `maxDimension`; download to `save_to`). Then `node scripts/figma-source.ts <feature> [<set>] crop design`
   shrinks, records and crops them as on the other route.
6. **Commit** `source.json`, `hashes.json`, `scope.json`, `rest/boards/`, `rest/extras.json` and new board images with
   `shots.json` (`rest/nodes.json`, `rest/out/`, `rest/calls/` and `out/` stay local).

A re-read is steps 2–5 again: one fetch for every board (it also tells which boards changed: `publish` prints them),
one extras call, images only for changed boards. `scripts/figma-rest-parity.ts` compares a REST `out/` with a
use_figma one field by field when a question comes up.

### use_figma-only route (on request)

The rest of this file is that route. Use it when the user asks for it, or when no REST token is available.

Part of the figma skill (`../SKILL.md`): the **source** branch. It reads the Design boards' full data once; the
**conformance** branch (`conformance.md`) and anyone needing pixel-level Figma data (measuring a screen, design
tokens) read its `out/` files instead of calling Figma again. Not for the casebook's control/arrow inventory (that
is spec-casebook's `scripts/figma/inventory.js`, which also reads PM and MX).

`scripts/figma/source.js` runs inside Figma through `use_figma` and walks every node of a board, including the inside
of component instances, so one call returns what `get_metadata` + `get_design_context` + `get_variable_defs` return per
frame and per instance. Calls are sized by output bytes, not node count. `scripts/figma-source.ts` writes each call's
code, checks the returns, merges them and crops the board images.

Why it is cheaper: on AI Mini Drama the per-tool route queued 4,595 instance reads and still had no styling, because
`get_design_context` on 8 of the 10 boards was too large and fell back to plain layout. Measured on board 1005_Chat
(3946:68005, 2026-10-30): 5 calls (1 plan, 3 chunks, 1 screenshot; about 10 s of Figma time) against the per-tool
route's 41 (38 `get_metadata`, 1 each of `get_design_context`, `get_variable_defs`, `get_screenshot`), with every
node's styling (423 nodes against 243), the same sizes on every shared node, every colour and all 39 variable and
style names the per-tool reads returned. Board main flow (2778:127318, 8,205 nodes,
2026-11-02): 34 calls (1 plan, 31 chunks, 1 fix, 1 screenshot), with 408 repeated instances sent once (4,531 nodes
sent); the per-tool route spent 4 calls there without any styling (`get_design_context` fell back to layout) and still
had 959 instance reads queued. A re-read costs only the plan calls when nothing changed.

## Before the first call

1. The rules in `../SKILL.md` › *Before any Figma call* apply (Design file only, `figma-design`, `whoami`).
2. Load the Figma `figma-use` skill once (the `/figma-use` skill, or the `skill://figma/figma-use/SKILL.md` resource of
   that server) and call `create_session` once per file. Every `use_figma` call below passes the `sessionId`,
   `skillNames: "resource:figma-use"` (or `figma-use` when loaded as a skill), the call's `description`, and the call
   file's whole content as `code`. The calls only read.
3. **Save every return verbatim**: after the calls, `save design` copies each `use_figma` return from the session
   transcripts (subagents' included) to its `save_to` path; never retype a return. A screenshot's URL is short-lived:
   download it with `curl -f -L -o <save_to> "<url>"` in the same turn.
4. **Always shrink, and run without asking (user, 2026-11-02).** Repeated component instances (status bars, nav bars,
   buttons) are always sent once and copied by the merge; this is the reader's only mode, with no switch to turn it
   off. Once the plan is back, run every chunk call, every
   `fix` call and every screenshot straight through, whatever their number, without asking the user to confirm
   the count or the token cost; report the totals at the end.

## Steps

All commands are `node scripts/figma-source.ts <product>/<feature> [<set>] …`; the set defaults to the newest one with
`figma-frames.json`. Files go to `specs/<set>/extracted/figma-source/design/`, board images to the shared
`specs/<set>/extracted/figma/` (`../SKILL.md` › *One feature folder*).

0. **A feature the casebook has not read** (no `figma-frames.json` with `files.design`): `init <Design Figma link>`
   (with `?node-id=` of the page or section) records it in the newest spec set, starting one with no files if needed.

1. **List** (1 call, never skipped): `calls list design [page or section id]`; save it with the others (`save design`), so merge
   writes it into `scope.json` with the boards read and every id a plan did not find. The return lists the page's sections, their boards and
   each board's instance count. Pick the boards the spec covers (skip superseded ones unless asked), and always every
   Design board the casebook inventories (`figma-inventory-*.json` on the Design file): `merge` names one no plan
   covers (`NOT READ`, exit 11) and the design check stops on it (`conformance.md` › *Plan*).
2. **Plan** (1 call per 4 boards): `calls plan design <board, section or page ids…> [--per 4] [--budget 36000]`. Run
   every plan call **in one message** (parallel). The plan reads no styling (a full read of a big board in one call
   drops the connection): it fingerprints each board, finds the repeated instances and sizes the chunks from an
   estimate (130 bytes per node plus its id, name and text, calibrated on board 3946:68005).
3. **Chunks and screenshots**: `calls chunks design [--all] [--scale 1]` writes `calls/todo.json`: a chunk call for
   every board whose fingerprint differs from `hashes.json` (every board with `--all`) and one screenshot per such
   board (`get_screenshot` with the given `nodeId` and `maxDimension`, the board's longest side × scale, so 1 image px
   = 1 Figma pt at scale 1), saved over the board's shared image. No screenshot for a board whose shared image is
   current: `shots.json` gives it this fingerprint, or the casebook keeps it (its `hash` is the board's hash in
   `figma-hashes.json`) and the board's fingerprint did not change since this read last saw it (a changed board gets a
   new image unless one was taken at its new fingerprint). **Fewer calls (2026-11-05, phd/scrollable-collage: a page of
   loose frames and labels asked for 302 calls):** boards whose whole read fits in half a chunk (loose labels, small
   frames) share `chunk-batch-<n>` calls (`--batch <bytes>`, default 36000); a board with no component instance inside
   (the list call's count) gets no hidden call; a board inside a current 1:1 image the casebook cut from a larger
   render (a page region in `shots.json` with a `box`) takes no screenshot and is cropped from that image
   (`covered_shots`); boards with the same name (light and dark copies) get their own image file. Up to 4 calls at once. With more than 4 chunk calls, hand them to parallel subagents, 4
   calls each, with this brief: "For each entry: read the `call` file, call `use_figma` on <server> with fileKey
   <key>, sessionId <id>, skillNames resource:figma-use, description = the entry's `description`, code = the file
   content; write the whole tool result verbatim to `save_to`. Report only the files written and any error."
4. **Merge**: `save design` (it refuses a return older than its call file: an earlier call with the same
   description; with no names it takes every call whose response is missing or older than its call file, and only
   the chunk and hidden calls `todo.json` lists, so an older plan's pieces left in `calls/` are never saved), then
   `merge design`. It puts every record at its walk index and copies each repeated
   instance's inside from the first one, checking a hash of the full description of both (clipped render bounds and
   drawn share are left out of the hash: each copy sends its own). Exit 10 names what is missing: a missing chunk (run
   it), a `fix-…` call (copies whose check failed; one call per 60 copies, already written: it compares them with
   the first instance inside Figma and returns only the nodes that differ; run it, save, merge again), or "changed
   since the plan" (plan that board again and redo its chunks), or a `hidden-…` call (below).
   **Hidden layers inside instances** are not in the walk: `use_figma` runs with `figma.skipInvisibleInstanceChildren`
   on, and a View seat cannot turn it off (setting it counts as an edit; found 2026-11-02 against the Figma Agent's
   per-node reads, which had 387 such layers the walk lacked). Each board therefore gets `hidden-<board>_0` (in
   `todo.json` with its chunks, or named by merge): a small call (about 6 KB of code) that pairs every shown instance
   with its main component and returns the layers the instance hides, sending repeated ones once. A return with
   `next` names the following call; merge writes it. AI Mini Drama took 18 such calls for 8,654 layers.
5. **Crop**: `crop design` (python3 with Pillow). A new screenshot is shrunk to 256 colours and recorded in
   `shots.json` with its fingerprint (`source_hash`) first, so the casebook's pages use it too. An image whose long
   side is not the size asked for (or the board's at 1 px = 1 pt), within 1 px, is reported and not cropped: take it
   again. It cuts each board image into `out/crops/<board>/<screen>.png`, plus
   `arrow-<arrow>.png` per arrow (its path with 80 pt around, at least 360 pt a side), and writes each arrow's `crop`
   into `arrows.json`. Look at every `pointer` arrow's crop: it is a designer note, often a spec rule.
6. **Commit** `responses/`, `hashes.json`, `scope.json` and the new board images with `shots.json` (`calls/` and
   `out/` stay local). Another computer rebuilds `out/` with `merge` and `crop` and no Figma call; `design.ts` does
   that by itself when `out/` is missing or older than the responses.

**Re-reading later**: run step 2 (plan calls only), save them, then step 3: unchanged boards get no chunk calls and no
screenshot. A newer plan with a board's same fingerprint keeps the earlier plan and its chunks (`scope.json` records
it as `checked_at`); plans are ordered by read time, not file name.

**Incomplete boards never reach the check**: merge removes an earlier merge's `out/<board>.json` for a board it finds
incomplete, so nothing reads a stale or partial board, and the design check lists it as a source gap.

## What `out/` holds

- `<board>.json`: `board` (id, name, canvas box, render bounds, fingerprint, read time) and `nodes` in walk order. Each
  node has `id`, `parent`, `depth`, `type`, `name`, `box` (board-relative x, y, w, h), `abs` (canvas), and as present:
  `render` (bounds including shadows), `rotation`, `hidden` (it or an ancestor is hidden: box and name only), `drawn` (share left after clipping,
  masks, near-zero opacity), `opacity`, `blend`, `mask`, `clips`; `fills` / `strokes` (type, `#rrggbbaa`, variable
  name, gradient stops, image hash), `stroke_weight` (one or per side), `stroke_align`, `dash`; `radius` (one or
  [tl, tr, br, bl]), `smoothing`; `effects` (type, colour, offset, radius, spread); `layout` (auto layout mode, padding
  [t, r, b, l], gap, alignment, sizing) and `child` (sizing inside its auto-layout parent, absolute); `constraints`,
  `min_max`; `styles` (fill / stroke / effect / text style names); `variables` (bound property → `collection/name`),
  `modes`; `text` (characters, alignment, auto-resize, `runs` with font family, style, size, weight, line height, letter
  spacing, decoration, case, fills, text style); `component` (main component name, set, key) and `component_props`
  (variant values); `reactions` (prototype trigger → destination); `annotations`; `arrow` (path points, tail first);
  `copy_of` (on a repeated instance: the instance its inside was copied from, checked equal). A layer hidden inside an
  instance (hidden call) has `hidden`, its box and name, `from_component` (its node in the main component),
  `approx_box` when the instance is resized from its component (the box is the component's offset from the nearest
  shown ancestor), and `made_up_id` when the component comes from a library: the id is then the instance prefix, `~`
  and the library copy's node id, because the real sublayer id cannot be read.
- `<board>.metadata.xml`: the same tree in `get_metadata`'s layout (x / y relative to the nearest non-group ancestor),
  with the instances' insides included, for tools that read that format.
- `screens.json` (phone frames 300–450 pt wide, not nested), `arrows.json` (path, start screen and control, end
  screen, `style` (stroke colour and weight), `kind`: `flow` when drawn in the style most arrows share, `pointer`
  when not (a designer's note pointing at a detail, not a screen-to-screen flow), and `crop` after `crop`),
  `library.json` (variables, styles and components used; each variable and style has the `value` it has on the
  nodes using it, colour as `#rrggbbaa`, a text style as font family, style, size, weight, line height and letter
  spacing, or `values` with a node count each when modes or overrides give it several, e.g. dark and light),
  `summary.json` (calls and bytes), `crops.json` (image size, scale and origin per board).

Not read: image fill pixels (only their hash; the board screenshot shows them), vector path data except arrows,
layout grids, and variable values in modes no node uses (colours and sizes are the values the node resolves to,
and `library.json` values come from those nodes; `modes` is set only on frames that pick a mode explicitly).

## When a call fails

- Timeout or "MCP server connection lost": plan with `--per 1`, or a smaller `--budget` so each chunk returns less.
  A heavy PM file is best planned one board per call.
- One chunk that keeps dropping while the rest of the board is read: do not re-plan the whole board. Copy its call
  file once per piece, changing only `TARGETS` (from, to, first and last node id) to boundaries a smaller-`--budget`
  plan of the same fingerprint gave, and name each `chunk-<board>_<from>`; merge accepts pieces that tile a planned
  chunk exactly. Keep the smaller plan's return out of `responses/` (the newest plan per board wins). On 2811:89056
  (2026-11-02) one 513-node chunk dropped every time; its pieces took 62 s, 66 s and 16 s.
- A return over the host's tool output limit: lower `--budget` (the default keeps returns near 40 KB) and plan again.
  The host may cut a long return without an error: Codex keeps only the head and tail of a string over about 50,000
  characters (「…N chars truncated…」 in the middle), Claude Code stops at 25,000 tokens (「[OUTPUT TRUNCATED …]」).
  `save` and `figma-check.ts --save` refuse such a return and say so (`lib/figma-returns.ts` cutByHost, ported from
  rdqe-spec-contract-agent, 2026-11-11). The missing part is on no disk: run a smaller call, never the same one again.
- A board over 65536 pt on its long side: `todo.json` says so; take its screens one by one after merge.
- Quota: Figma counts every call. `summary.json` records how many this read took; note the account's remaining
  quota before a large read and stop (do not retry in a loop) when it runs out.
