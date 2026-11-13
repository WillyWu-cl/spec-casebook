# Update plan — phd/genai-autosave-dialog / android: new table → draft 20261111-164954
## Spec files
- New: GenAI auto-save dialog - PM Figma 14451-2196.md (Figma-only text snapshot, PM page 「26 11E UIUX Revamp」; the trigger table is an image of RD's code notes)
## Not added (value check)
- Face Swap trigger (R-015): retire — AI Face Swap is removed from the app before 10/E.
- Delayed AI Background prompt when the page is not resumed (R-032): merged into TC-012 (no fixture sends the page to the background at the right moment).
- One row per feature for the show-once rule: merge — TC-009 checks two more features after the first; each feature's own trigger row runs behind its own reset (one-way state).
## Parked
- TC-011 (AI Exposure DOWNLOAD_FAILED) needs a failure fixture; TC-012 may need one if Wi-Fi off does not force the prompt.
## Questions for PM
- Q-1 where 「Ok」 leads · Q-2 whether the AI Exposure / AI Background prompts get the new text · Q-3 triggers unchanged · Q-4 Image Fusion's entry on Android
