# PhotoDirector Mobile (PHD) — domain knowledge

Product knowledge for every `phd/*` feature: how PHD behaves across features, what its past bugs taught, which
rules the team has confirmed and which questions are still open. It is distilled from 260 PHD eBugs created
2026-04-01 → 2026-10-15 (257 Android, 3 iOS; 2 test records and 1 PowerDirector bug excluded) plus rules the user
confirmed on 2026-10-15/16 and later (K75–K76, 2026-11-03). Entries keep their stable IDs **K01–K74**, so a requirement or a Note can cite one
(`[Domain: K21]`); where one source entry held several rules, a letter splits it (`K36a` … `K36e`, `K47a` …).

Imported 2026-11-03 from `qadm-phdm-spec-contract-runner-agent/docs/domain/phd` (commit `c00d9c6`, 2026-10-16) and
sorted by how the casebook uses it. The repo does not read that folder: `source/` holds the copy, and any later
change is made here.

## Files

| File | What it holds | Used in |
| --- | --- | --- |
| [glossary.md](glossary.md) | Feature map, code-name aliases, core data objects, entitlement names (Android VIP = Pro = paid) | Reading the spec, naming rows, reading logs |
| [confirmed-rules.md](confirmed-rules.md) | Cross-feature behaviour confirmed by the user, PM or a verified fix | Requirements and rows when the spec is silent (standing input 6) |
| [decisions.md](decisions.md) | PM decisions, Won't Fix / NAB outcomes and version-bound values that must **not** be asserted as expected results | Value check, verdicts, eBug triage |
| [regression-risks.md](regression-risks.md) | Root causes from past bugs, by area, and the regression matrix they add up to | Coverage passes: what to vary (entry, lifecycle, size, locale…) |
| [test-setup.md](test-setup.md) | Round-start account state (free user, 0 credits) and how to reset it through the debug dialog | `fixtures.md`, first segment of every run |
| [triage.md](triage.md) | Symptom → what to check first, Stage vs Production, build-module checks | Run findings, eBug drafts, rechecks |
| [open-questions.md](open-questions.md) | Unresolved product issues; never an approved expectation | PM questions (`Q-n`) in `requirements.md` |
| `source/` | The imported snapshot: original Chinese text (`phd-domain-knowledge.zh-Hant.md`), its README and the 263-row eBug source index (`source-index.md` / `.json`: title, status at read time, K mapping, link) | Looking up a BugCode or the original wording |

## Authority

1. **The current spec set wins.** This knowledge is history and team rules, not a spec. Where the newest PM / Design
   / MX file states a behaviour, that is the expected result; a K entry never overrides it and an old ticket's
   Expected Result never fills a gap by itself.
2. **User-confirmed rules** (dated in `confirmed-rules.md`, e.g. credit Detail, Artwork save, Android VIP) apply to
   every PHD feature the spec does not contradict; they become requirements citing `[Domain: K<nn>]`.
3. **"Confirmed by fix"** rules (a discussion, RD fix and QA recheck agree) are good defaults for rows on the same
   behaviour; when the new spec says otherwise, follow the spec and note the change in the row's Notes.
4. **History, decisions and open questions** shape *what to vary* and *what not to assert*; they never become an
   expected result on their own. An open question goes to `requirements.md` as a `Q-n`.
5. Keep scope: PHD is not PDR; an Android fix does not prove iOS (and the reverse); Stage capacity, timing or
   entitlement is no Production guarantee. Closed ≠ fixed (read the close reason); Propose Won't Fix ≠ a permanent
   limit.

## Updating

Add or change entries in these files (not in `source/`, which stays the imported snapshot). Keep K numbers stable;
a new entry takes the next number (K75…) and names its source (BugCode or "user, <date>"). A rule the user confirms
in a session goes into `confirmed-rules.md` the same session, dated, and into the feature's `requests.md` when it came
up for one feature. Refreshing the eBug side (new tickets after 2026-10-15) adds entries here with their BugCodes;
`source/source-index.*` is not regenerated.
