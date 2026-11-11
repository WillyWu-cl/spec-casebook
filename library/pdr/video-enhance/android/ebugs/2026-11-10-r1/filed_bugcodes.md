# AI Video Enhance Android — R1 (table v4) eBugs filed 2026-11-11

Creator ETHAN_HSU (read back on every bug) · method API (create + attachment upload) · source tag [AIAgent] · TR [TR261109-0041](https://ecl.cyberlink.com/IF3/tr/BPM/FormView/TR261109-0041) · 16.9.0 build 2611091 (TR header: 「16.9.0.2611091 (Deluxe)」, Build field 16.9.0.2611091) · Stage server · template Generic v16.9 (23176), PowerDirector Mobile for Android · due 2026-11-18 · decisions: `decisions.md`

**Read back:** every bug's Creator, severity, belong, TR, version, build, Short Description and description match what was sent (description compared in full), and every attachment is on its page (`readback.log`, `upload.log`). Status on read-back is 「BugNeedReview」 (handler: the template's reviewers). Dedupe re-run on the Android pool right before filing (`dedupe-recheck.txt`): same candidates as at review, no duplicate. No existing ticket was commented on.

**F-9 (ISS-VEA-09):** Type UX with BugBelong PM is the user's own decision for this card (2026-11-11); it overrides overlay rule 5 for this card only, and its Short Description stays as written (no [UX] tag). Checks ran with `--allow-agent-ux` / `ALLOW_AGENT_UX=1`; rule 5 is not reverted.

**To do by hand:** OS Language is a required template field the API cannot set — fill it on each ticket's web edit form.

| F | BugCode | ISS | Sev | Belong | Type | Attachments | Short Description |
|---|---|---|---|---|---|---|---|
| F-1 | [DRA262611P0071](https://ecl.cyberlink.com/IF3/ebug/BPM/FormView/DRA262611P0071) | ISS-VEA-01 | 2 | PM | UI | 3 | PDR-A 16.9.0 - [AIAgent][UI] AI Video Enhance: Launcher and AI Magic name it 「Video Enhance」, not 「AI Video Enhance」 |
| F-2 | [DRA262611P0072](https://ecl.cyberlink.com/IF3/ebug/BPM/FormView/DRA262611P0072) | ISS-VEA-02 | 2 | RD | Functional | 3 | PDR-A 16.9.0 - [AIAgent] AI Video Enhance: 1440p, 4K and 8K videos open the panel instead of being rejected |
| F-3 | [DRA262611P0073](https://ecl.cyberlink.com/IF3/ebug/BPM/FormView/DRA262611P0073) | ISS-VEA-03 | 2 | RD | Functional | 3 | PDR-A 16.9.0 - [AIAgent] AI Video Enhance: Badge reads 「0fps」 and fps chips are disabled for stock and Timeline clips |
| F-4 | [DRA262611P0074](https://ecl.cyberlink.com/IF3/ebug/BPM/FormView/DRA262611P0074) | ISS-VEA-04 | 2 | RD | UI | 3 | PDR-A 16.9.0 - [AIAgent][UI] AI Video Enhance: Panel Preview shows no 「00:00/12:30」 time until play is tapped |
| F-5 | [DRA262611P0075](https://ecl.cyberlink.com/IF3/ebug/BPM/FormView/DRA262611P0075) | ISS-VEA-05 | 2 | RD | Functional | 4 | PDR-A 16.9.0 - [AIAgent] AI Video Enhance: A selection shown as 「02:30」 cannot switch to Professional |
| F-6 | [DRA262611P0076](https://ecl.cyberlink.com/IF3/ebug/BPM/FormView/DRA262611P0076) | ISS-VEA-06 | 2 | RD | Functional | 6 | PDR-A 16.9.0 - [AIAgent] AI Video Enhance: Videos of exactly 1 s, 3 s, 30 s or 3:00 are billed one extra second |
| F-7 | [DRA262611P0077](https://ecl.cyberlink.com/IF3/ebug/BPM/FormView/DRA262611P0077) | ISS-VEA-07 | 2 | RD | Functional | 3 | PDR-A 16.9.0 - [AIAgent] AI Video Enhance: Tapping Enhance with no network shows nothing at all |
| F-8 | [DRA262611P0078](https://ecl.cyberlink.com/IF3/ebug/BPM/FormView/DRA262611P0078) | ISS-VEA-08 | 2 | RD | Functional | 4 | PDR-A 16.9.0 - [AIAgent] AI Video Enhance: Processing ring sits at 0% for 48 s, then stalls 30–40 s at a time |
| F-9 | [DRA262611P0079](https://ecl.cyberlink.com/IF3/ebug/BPM/FormView/DRA262611P0079) | ISS-VEA-09 | 2 | PM | UX | 6 | PDR-A 16.9.0 - [AIAgent] AI Video Enhance: Home during upload ends the task but charges 30 credits, refunded 3 h later |
| F-10 | [DRA262611P0080](https://ecl.cyberlink.com/IF3/ebug/BPM/FormView/DRA262611P0080) | ISS-VEA-10 | 2 | RD | Functional | 4 | PDR-A 16.9.0 - [AIAgent] AI Video Enhance: Completion banner's View opens a black Result page that never loads or plays |
| F-11 | [DRA262611P0081](https://ecl.cyberlink.com/IF3/ebug/BPM/FormView/DRA262611P0081) | ISS-VEA-11 | 2 | RD | Functional | 2 | PDR-A 16.9.0 - [AIAgent] AI Video Enhance: Recent task has no ‹ and system Back exits to the Launcher, not the panel |
| F-12 | [DRA262611P0082](https://ecl.cyberlink.com/IF3/ebug/BPM/FormView/DRA262611P0082) | ISS-VEA-12 | 2 | RD | UI | 1 | PDR-A 16.9.0 - [AIAgent][UI] AI Video Enhance: Recent task notice reads 「1 year」 and 「Select」, not 「1 Year」 and 「Manage」 |
| F-13 | [DRA262611P0083](https://ecl.cyberlink.com/IF3/ebug/BPM/FormView/DRA262611P0083) | ISS-VEA-13 | 2 | RD | UI | 2 | PDR-A 16.9.0 - [AIAgent][UI] AI Video Enhance: Cancelled task leaves a card of length 「3961:06:40」 with Retry |
| F-14 | [DRA262611P0084](https://ecl.cyberlink.com/IF3/ebug/BPM/FormView/DRA262611P0084) | ISS-VEA-14 | 2 | RD | Functional | 4 | PDR-A 16.9.0 - [AIAgent] AI Video Enhance: Tasks take 53–103 s for 1–30 s videos, far over 1.5–2.5× their length |
| F-15 | [DRA262611P0085](https://ecl.cyberlink.com/IF3/ebug/BPM/FormView/DRA262611P0085) | ISS-VEA-15 | 2 | RD | Functional | 3 | PDR-A 16.9.0 - [AIAgent] AI Video Enhance: In Professional, the Sharp result is practically identical to Natural |
