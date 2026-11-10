# Batch Editing log lines

## KF-004 Batch AI Enhance runner lines
- kind: fact · platform: android · use: run, ebug · tags: logs, ai-enhance, network
- source: run 2026-11-09-r1 O-13, TC-094 · verified: 20.19.0 (90201900) (2026-11-10)

The runner enhances one photo at a time: `batch of 20 (maxInFlight=1) took 150637 ms`. A failed photo logs
`BatchEditRunner: image N failed: NETWORK_ERROR`, shown as 「Connection lost. Check your connection and retry.」;
an upload timeout to the S3 accelerate host (`executeWithAuthRetry: … SocketTimeoutException`, 30 s) causes it
now and then on working Wi-Fi, and 「Retry Failed (n)」 then succeeds.
