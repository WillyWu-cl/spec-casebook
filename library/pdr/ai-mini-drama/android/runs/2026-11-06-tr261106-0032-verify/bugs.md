# TR261106-0032 verify — ETHAN_HSU's bugs in scope (read 2026-11-06)

TR: 16.8.0.2611061 (Deluxe), PowerDirector Mobile for Android, due 2026-11-10. ETHAN_HSU's rows on the verify list:
P0343, P0348, P0358, P0363 (filed in a different QR, user 2026-11-06; out of scope here) and P0424 (in scope).
Filed text: `ebugs/2026-10-30-a7/20261030_eBug_drafts_AI-Mini-Drama-A7_16.8.0.md`.

## DRA262610P0424 (ISS-AMDA-69, TC-406)
PDR-A 16.8.0 - [AIAgent][UI] AI Mini Drama: French copy: 「Crédits seront consommés」 lacks an article; 「Langage de la vidéo」

- Result as filed: the format card reads 「1. Langage de la vidéo」; the storyboard card reads 「Crédits seront consommés pour cette tâche.」
- Expect Result as filed: 「1. Langue de la vidéo」 and 「Des crédits seront consommés pour cette tâche.」
- History: QR261105-0035 Fail on 2611041 (storyboard line fixed, 「Langage de la vidéo」 still on the format card).
