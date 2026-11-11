# Decisions — AI Video Enhance Android R1 batch (2026-11-10) — user, 2026-11-11, pasted from the review page's Copy decisions

Account: ETHAN_HSU
Method: API
Source tag: [AIAgent]
TRCode: TR261109-0041

| # | ISS | Sev | Belong | Type | Action | Short Description | Note |
|---|---|---|---|---|---|---|---|
| F-1 | ISS-VEA-01 | 2 | PM | UI | file | PDR-A 16.9.0 - [AIAgent][UI] AI Video Enhance: Launcher and AI Magic name it 「Video Enhance」, not 「AI Video Enhance」 |  |
| F-2 | ISS-VEA-02 | 2 | RD | Functional | file | PDR-A 16.9.0 - [AIAgent] AI Video Enhance: 1440p, 4K and 8K videos open the panel instead of being rejected |  |
| F-3 | ISS-VEA-03 | 2 | RD | Functional | file | PDR-A 16.9.0 - [AIAgent] AI Video Enhance: Badge reads 「0fps」 and fps chips are disabled for stock and Timeline clips |  |
| F-4 | ISS-VEA-04 | 2 | RD | UI | file | PDR-A 16.9.0 - [AIAgent][UI] AI Video Enhance: Panel Preview shows no 「00:00/12:30」 time until play is tapped |  |
| F-5 | ISS-VEA-05 | 2 | RD | Functional | file | PDR-A 16.9.0 - [AIAgent] AI Video Enhance: A selection shown as 「02:30」 cannot switch to Professional |  |
| F-6 | ISS-VEA-06 | 2 | RD | Functional | file | PDR-A 16.9.0 - [AIAgent] AI Video Enhance: Videos of exactly 1 s, 3 s, 30 s or 3:00 are billed one extra second |  |
| F-7 | ISS-VEA-07 | 2 | RD | Functional | file | PDR-A 16.9.0 - [AIAgent] AI Video Enhance: Tapping Enhance with no network shows nothing at all |  |
| F-8 | ISS-VEA-08 | 2 | RD | Functional | file | PDR-A 16.9.0 - [AIAgent] AI Video Enhance: Processing ring sits at 0% for 48 s, then stalls 30–40 s at a time |  |
| F-9 | ISS-VEA-09 | 2 | PM | UX | file | PDR-A 16.9.0 - [AIAgent] AI Video Enhance: Home during upload ends the task but charges 30 credits, refunded 3 h later |  |
| F-10 | ISS-VEA-10 | 2 | RD | Functional | file | PDR-A 16.9.0 - [AIAgent] AI Video Enhance: Completion banner's View opens a black Result page that never loads or plays |  |
| F-11 | ISS-VEA-11 | 2 | RD | Functional | file | PDR-A 16.9.0 - [AIAgent] AI Video Enhance: Recent task has no ‹ and system Back exits to the Launcher, not the panel |  |
| F-12 | ISS-VEA-12 | 2 | RD | UI | file | PDR-A 16.9.0 - [AIAgent][UI] AI Video Enhance: Recent task notice reads 「1 year」 and 「Select」, not 「1 Year」 and 「Manage」 |  |
| F-13 | ISS-VEA-13 | 2 | RD | UI | file | PDR-A 16.9.0 - [AIAgent][UI] AI Video Enhance: Cancelled task leaves a card of length 「3961:06:40」 with Retry |  |
| F-14 | ISS-VEA-14 | 2 | RD | Functional | file | PDR-A 16.9.0 - [AIAgent] AI Video Enhance: Tasks take 53–103 s for 1–30 s videos, far over 1.5–2.5× their length |  |
| F-15 | ISS-VEA-15 | 2 | RD | Functional | file | PDR-A 16.9.0 - [AIAgent] AI Video Enhance: In Professional, the Sharp result is practically identical to Natural |  |

Notes (from the filing request, 2026-11-11):
- Every entry is severity 2 (some drafts were S3); Sev, BugBelong and Short Descriptions as decided, applied with `drafts_to_bodies.py --decisions`.
- F-9: the user's own choice of Type UX with BugBelong PM for this card only; overrides overlay rule 5 for this card (rule 5 not reverted). Its Short Description stays as written (no [UX] tag). Checks for this batch run with `--allow-agent-ux` / `ALLOW_AGENT_UX=1`.
- F-1 and F-12 follow the 2026-11-11 owner rule: text that differs from the spec is RD when the spec states it, PM when the spec's own text must change; never Doc.
