# Image to Video Reuse (Android) — what the phone needs before a run

What a run needs on the phone or the account, because none of it can be committed. Check it before the first segment;
a new row that needs a new video or account state adds it here in the same draft.

## Phone, build and account
- Phone: Samsung SM-A5360 (adb serial R5CTB22S05Y), on USB, Stay awake on, no PIN.
- Build: PhotoDirector for Android from the TR's OneDrive folder (TR261106-0051: 20.19.0.v202611061839), installed
  with `adb install -r` over the installed app (keeps its data); the agent downloads it without asking, says the file
  name and size, and checks the MD5.
- Account: the team's QA account (never typed by the agent).
- Credits: enough to make the fixture videos below on the build under test (videos made before the build that
  records settings cannot be reused, TC-041), plus one Kling 2.6 generation each for TC-023, TC-027 and TC-031. The
  run never buys credits; the user arranges them.

## Videos in My AI Artwork › Image to Video (made on the build under test)
| Video | Made with | Used by |
| --- | --- | --- |
| A | Custom, Kling 2.6, 10s, Pro, Generate Sound by AI On, Start/End Off, a typed prompt | most rows |
| B | Custom, a model other than the default, Duration ≠ 10s, Quality ≠ Pro, Generate Sound by AI Off | TC-012 |
| C | Custom, 「Specify Video Start / End」 On (start and end photos) | TC-008, TC-013 |
| D | Custom from an inspiration under 「Inspiration」 | TC-014 |
| Template video | any template | TC-007 |
| Failed job | a Custom job that failed (tile with 「View Details」) | TC-004 |
| Processing job | a Custom job still processing when the row runs | TC-005 |
| F | Custom, a prompt over 500 characters, a model that allows it | TC-032 |
| G | Custom, a model that does not support real people | TC-034 |

## States the run cannot arrange (Blocked test-data unless provided)
- A Custom video made before the feature (TC-041), one whose settings cannot be read (TC-042), one whose model was
  later removed (TC-029 – TC-031).
- A VIP account with fewer credits than 「Generate」's price (TC-036); an account with the Image to Video free trial
  (TC-019); the analytics event log (TC-037 – TC-040).

## Photos in the gallery
| Photo | Used by |
| --- | --- |
| A photo with a person's face | TC-034 and every Generate row |
| Two more photos (start and end frames) | video C |
