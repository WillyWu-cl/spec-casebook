# Run state — R1 Full run of the draft (TC-032 is new in this draft)

Table: library/phd/my-ai-artwork-category-list/android/cases.csv
Started: 2026-11-11T04:39:09.769Z

## Environment
(build, server, device, tier, credit balance, Pink toggles, Log stage timings, Write Log)

## Checkpoints

### 2026-11-11T05:07:33.361Z · all recorded
{"Pass":20,"Fail":2,"Blocked":10}

R1-a done (27 rows). Phone S23 RFCW2198L7B, PhotoDirector 20.19.0 (90201900), Test Server. Mine: 「Hello VIP!」, My Credits 0 (read 12:53 and 13:06). The account has NO works: every My AI Artwork tab shows 「Nothing yet.」 (also after relaunch); log memberToken empty, getCreditHistory totalRecord=0 — not the 「Premium with works」 the plan expected (O-2). Six rows Blocked test-data for it (TC-005, 009, 014, 015, 019, 032); rerun them once an account with works (AI Art incl. old ones, ≥2 on AI Creative Studio, Recent photos and videos) is on the phone. Fails: TC-004, TC-016 (「Start to Create」 vs spec 「Create More」, O-1). Logs pulled R1-a-20261111-130659 and sliced. App left on the Launcher; nothing bought, signed out or deleted.

### 2026-11-11T05:31:20.738Z · all recorded
{"Pass":20,"Fail":2,"Blocked":10}

R1-a2 (recovery) start: S23 RFCW2198L7B, PhotoDirector 20.19.0, Test Server. Mine 「Hello VIP!」, My Credits 1843. The user generated works today; My AI Artwork now holds: Recent › Photo (AI Group Shot ×2, AI Expand ×1, many AI Creative Studio), Recent › Video (3 videos: Shrug Dance, Elegance, Muse Wave = Image to Video); feature tabs with works: AI Creative Studio (grid, several), AI Expand (1), AI Group Shot (Photo: 2), Image to Video (3). All other 16 feature tabs (incl. AI Art) show 「Nothing yet.」. Every work is dated 2026/11/11 (no older works). Logcat live capture running (pid 25308). Re-running TC-005, 009, 014, 015, 019, 032; AI Art stands in as Image to Video / AI Group Shot where needed.

### 2026-11-11T05:37:08.149Z · all recorded
{"Pass":26,"Fail":2,"Blocked":4}

R1-a2 (recovery) done: TC-005, 009, 014, 015, 019, 032 all Pass (AI Group Shot stood in for AI Art; AI Creative Studio real). Phase R1 now 26 Pass, 2 Fail (TC-004, TC-016, O-1), 4 Blocked observability (TC-028–031). Works on the account: AI Creative Studio 3, AI Expand 1, AI Group Shot 2 photos + 2 videos, Image to Video 3 videos, all dated 2026/11/11 (O-5). Mine 「Hello VIP!」, 1843 credits. Logs R1-a2-20261111-133641 pulled and sliced (only benign 「Job was cancelled」 / HWUI decoder lines). App left on My AI Artwork › Recent › Video; nothing bought, signed out or deleted. Next: phase wrap-up (summary, time --cases, eBug drafts for TC-004/016, report.md).
