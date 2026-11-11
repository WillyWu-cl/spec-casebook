# Quirks

## KF-008 The source badge reads 0fps for some sources
- kind: quirk · platform: android · use: run · tags: panel, badge, fps
- source: Video Enhance Android run 2026-11-10-r1-full O-2, O-31 · verified: 16.9.0 build 2611091 (2026-11-10)

The panel's badge reads 「0fps · <res>」 with every fps chip disabled for stock downloads (Pexels, Pixabay, gettyimages),
an 8K file after the convert dialog, some Timeline clips and a Timeline clip whose file is gone, while the same kind
of local file from Add Media reads its fps. Use a local Add Media file for fps rows.
