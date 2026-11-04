<!-- One topic per PR (a table update, a script change or a knowledge import). Rules: README › Before you push or open a PR. -->

## What and why

<!-- Feature, platform, REQ ID(s), and what changed. -->

## Checks

- [ ] Rebased on `origin/main`, no conflicts
- [ ] `node scripts/pr-check.ts` ends with `Ready to push`
- [ ] Changed tables saved through the review page as the next version after main's (no hand-edited `cases.csv`)
- [ ] `npm run typecheck` (and `npm test`) if scripts changed; `node scripts/sync-skills.ts` if skills changed
- [ ] Nothing git-ignored, no credentials, no file over 5 MB, no whole exports from other tools
