# Spec - 進房檢查 & Photo Picker (11/25 新增)

Source: PM Figma https://www.figma.com/design/vhIp15PMJcwOcWJ6E9Q4JE/AI-Hair?node-id=3287-89 · board `pm-face-check` · region of 3370:1666 · box x=0 y=5500 w=1636 h=1300 (absolute Figma canvas points)
Figma text layer (inventory read 2026-11-12, figma-pm / qa1); no PDF export exists, so no OCR. Columns: y, x from the board's top-left, text; [phone] = inside a phone mockup. Lines of one multi-line text are spaced 18 pt apart.

```
    60     60  進房檢查 & Photo Picker（11/25 新增，不併入 10/E template spec）
   344     72  11/25 NEW · 進房驗臉（歪頭 / 臉太小）
   376     60  entry_warn_face
   376   1030  【 進房提醒：臉歪 / 臉太小 】
   392    646  [phone] 9:41
   414   1030  • 觸發：比例檢查通過（或裁切完回來）之後才驗臉 [D2-01e]
   432   1030  • 門檻與字串全部沿用 Hair Volume / AI Hairstyle，RD 不用新寫 [D2-01d]
   450   1030  　－ 歪斜：yaw 或 roll > 15°
   468   1030  　－ 臉太小：1024 縮圖下臉寬 < 128px
   486   1030  　－ 兩者都是警告不是擋下：OK / Continue Anyway
   504   1030  • 擋下的兩項（也沿用）：0 張臉「No face detected. Face is required for this feature.」、臉太大「The face in this photo is too big.」 [D2-01d]
   522   1030  • 進房檢查完整順序 [D2-01e]：① 無臉（擋）→ ② 比例 > 16:9 / 9:16（Cancel / Crop）→ ③ 臉太大（擋）→ ④ 臉太小 / 歪斜（警告，可 Continue Anyway）
   540   1030  • 順序理由：裁切會改變構圖，裁完 yaw / roll 可能就變了，臉的警告一定要對最終送 API 的那張圖下 [D2-01e]
   558   1030  • 從 Edit Room / Deeplink 進來時照片已選好，四項在同一刻依序跑完 [D2-01e][D1-10]
   576   1030  • ⚠ Android AI Hairstyle 今天的比例上限是長短邊 5 倍，iOS 這條線完全不驗比例 —— 新的 16:9 / 9:16 兩平台都要補 [D2-01b]
   594   1030  • 前一步（比例 dialog → Crop 房）畫在 10/E 頁的 entry_blocked_ratio / crop_room，本頁不重畫 [D2-01b][D2-01c]
   439    902  [phone] 100
   720    681  [phone] Please choose another photo
   752    690  [phone] The face in this photo is too slanted, which may result in poorly generated results.
   822    665  [phone] OK
   868    665  [phone] Continue Anyway
   952    650  [phone] Solid
   952    712  [phone] Multicolor
  1080    641  [phone] Natural Brown
  1080    743  [phone] Milk Tea
  1080    823  [phone] Ash Blonde
  1080    910  [phone] Honey Gold
  1110    747  [phone] Generate
  1110    958  [phone] 6
  1166    644  [phone] ✕
  1168    960  [phone] ✓
  1169    780  [phone] ↺
  1169    824  [phone] ↻
```
