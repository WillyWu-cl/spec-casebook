# PHD triage

Part of the PHD domain knowledge (`README.md`). For run findings, eBug drafts and rechecks: where to look first, and
how to read an old ticket.

## Symptom → check first

| Symptom | Check first | Past cases |
| --- | --- | --- |
| Network error while the network is fine | Temp image deleted? Preset without a prompt rejected? Agent `final_state` | PHA262026-0295, -0251, -0319 |
| All inputs picked, Generate still disabled | Current mode / GUID, Duo leftovers, sub-tab selection, an inactive page overwriting it | PHA262026-0284, -0331, -0395 |
| Preview right, saved file wrong | Latest transform, full-res stack, the real source buffer | PHA262026-0404, -0457, -0382 |
| Nothing updates after returning to foreground | Activity re-created? Native agent alive? Event collection waiting? | PHA262026-0310, -0321 |
| New icon or thumbnail missing | Built-in and CMS both updated, cache key, eTag, view reuse | PHA262026-0340, PHI262607-0002, PHA262026-0315, -0365 |
| New language crashes | Format placeholder, re-created Activity, fragment attachment | PHA262026-0298, -0303 |
| Fine on a phone, broken on Fold | Available height, bottom constraints, scrolling, hit targets | PHA262026-0324, -0326 |
| Save jumps back to the previous page | A native crash first (R8, audio module), not a navigation design | PHA262026-0401 |
| Credits charged twice for one result | Taps before the loading indicator appeared (K30) | PHA262026-0418 |
| Work missing from Artwork | Job class (long / short task), feature tab mapping, filter-based empty state (K45–K47) | PHA262026-0194, -0436, -0459, -0363 |

## The build, not the PR (K72)

"The fix is merged" is not "the build has it". Check the tested build's modules and assets:

| Symptom | Recorded cause | Source |
| --- | --- | --- |
| ID Photo crashes on Next after capture | R8 / ProGuard; the first fix PR was not in the build, recheck failed | PHA262026-0385 |
| Group Shot video Save jumps away | Native audio JNI crash; ProGuard class added | PHA262026-0401 |
| Several video features fail Trim › Continue | `libCLAudFxMgr.so` missing; Audio Effect Engine and Android Audio Mixer modules added | PHA262026-0414 |
| Artwork Add Text crashes | Cheetah / CESAREngine eModule versions | PHA262026-0424 |
| Hairstyle asset download after picking, Motion Swap import fails | Muse asset move, CMS Venus / Muse file names differ | PHA262026-0329, -0332 |

## Stage is not Production (K60)

| Record | What happened | Reading |
| --- | --- | --- |
| AI Expand waits 1 min 48 s | Stage capacity; Production ≈ 17 s twice | Observations, not an SLA. PHA262026-0419 |
| Character Motion Swap stuck processing | Test Stage lacked resources; Closed with "Unable to fix" | Closed ≠ fixed. PHA262026-0297 |
| RTDN account hold shows 76320 days | 53 × 1440: Stage time scale | Not a real hold length. PHA262026-0314 |
| Production subscription bonus wrong | Stage gave it; still NewCreated | Stage passing proves nothing for Production. PHA262026-0218 |

## Reading an old ticket

- Read the latest discussion, RD root cause and last QA recheck before the original Expected Result.
  PHA262026-0385, -0321 and -0312 failed again after their fix; -0297 is Closed for a Stage resource limit.
- Status, fix and observable behaviour are three things. Closed needs its close reason; Propose Won't Fix is not a
  permanent limit; a RDResolved ticket has no QA close yet.
- A fix's regression covers the original path **and** the scope RD names (all gallery-save fragments, the shared
  Trim, the shared IAP dialog, cross-tab toolbar text).
- Sightings on one device or on an emulator (LDPlayer video formats, Agent replies) are not general rules
  (`open-questions.md`).
- The casebook's eBug rules still apply (per-OS dedupe, `[AIAgent]` / `[UI]`, owner RD): `ebug-tr-filer` overlay.
