# PHD glossary

Part of the PHD domain knowledge (`README.md`). Source: `source/phd-domain-knowledge.zh-Hant.md` › 產品範圍與共通概念.

## Feature map

The features the 2026-04 → 10 eBugs touch; not a full product catalogue.

| Area | Features | What it does |
| --- | --- | --- |
| Home and discovery | Launcher, Home, AI Photos, AI Videos, Discover, Mine, Open Intro | Find features, show demos, apply content, account and entitlement entries |
| Photo editing | Edit Room, Crop, Perspective, Adjustment, Background, Cutout, Mosaic, Blur Tool | Geometry, colour, background, masks and effects |
| Portrait and beauty | Beautify, Retouch, Reshape, Skin Tone, Makeup, Hair Volume | Local portrait adjustments |
| Photo generation | AI Creative Studio, AI Art, AI Try-On, AI Hairstyle, AI Headshot, AI Face Swap, AI Group Shot | New works from a photo, style, reference image or prompt |
| AI editing | AI Replace, AI Removal, AI Background, AI Expand, AI Enhance, AI Deblur, AI Denoise, AI Relight, AI Exposure | Replace, remove, outpaint, enhance, relight |
| Video generation and editing | Image to Video, AI Anime Video, AI Video Try-On, Character Motion Swap, Cinematic Reel Creator, Video Editing | Video from photos or videos; text, audio, range editing |
| Special | Collage, ID Photo, Camera, Text, Text Bubble, Sticker, VHS, Glitch | Collage, ID photos, capture, layers, style effects |
| Works and business | My AI Artwork, Save & Share, Credits, Credit Auto Pass, IAP, Task Center, RTDN, Mixpanel | Jobs and results, save/share, billing, notifications, events |

## Name aliases (code and logs)

| UI name | Also appears as | Source |
| --- | --- | --- |
| AI Creative Studio | Creative Lab | PHA262026-0358 |
| Cinematic Reel Creator | CineStory | PHA262026-0373 |
| Edit Room source image id | AI Editor image ID | PHA262026-0357, -0367 |

## Core data objects

| Concept | Meaning in PHD | Easy to confuse with | Source |
| --- | --- | --- | --- |
| Image being edited | The bitmap Edit Room has composed so far | The original file URI, which lacks the latest edits | PHA262026-0382 |
| Source vs reference image | Source = the photo being changed; reference = clothing / replacement content | Face checks for a person photo do not apply to a clothing reference | PHA262026-0392, -0260 |
| Template / Style | Preset content and the chosen style: GUID, category, generation settings | The custom-prompt or reference-image modes on the same screen | PHA262026-0271, -0306 |
| Inspiration | A suggested prompt from the content service | Still bound by the chosen model's length and content checks | PHA262026-0396, -0398 |
| Task / Pack | A generation job and a collection of works (implementation names) | Image vs video is not the same as short vs long task | PHA262026-0194, -0436 |
| Artwork | The library of jobs and results | Recent, feature tab and Photo / Video filter are separate dimensions | PHA262026-0363, -0436 |
| Credits / subscription | Balance, bonus sources, subscription entitlements | Premium, Credit Auto Pass and a one-time free trial are different states | PHA262026-0199, -0316, -0252 |

## Entitlement names (user, 2026-10-16)

- **Android has one paid mode.** VIP, Pro and "paid user" in any PHD Android spec mean the same Android VIP mode, not
  tiers; never read a naming difference as an undefined entitlement. Prices and the out-of-credits path still come
  from each feature's spec. (K36)
- **iOS has two:** Pro and Pro+ are different modes; never apply them to Android.
- Premium, Credit Auto Pass and the one-time free trial are separate states (K31, K36).

## Platform terms

- **Stage / Production:** server environments; Stage capacity, timing and bonus behaviour do not stand for Production (K60).
- **Built-in vs CMS content:** many icons, banners, templates and tags exist both in the app and on CMS (K55–K57).
- **Don't keep activities:** Android developer option that reproduces Activity / ViewModel re-creation (K62).
- **Predictive Back:** Android SDK 36 default that changed back handling (K63).
