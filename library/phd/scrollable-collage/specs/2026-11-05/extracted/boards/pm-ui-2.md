# pm-ui-2

Source: PM Figma https://www.figma.com/design/zrl1BBEyqTvdLfjtaT8g6I/Collage?node-id=2171-2 · board `pm-ui-2` · node 2214:6/pm-ui-2 · box x=3261 y=8991 w=10170 h=2100 (absolute Figma canvas points)
Figma text layer (inventory read 2026-11-05, figma-pm / qa1); no PDF export exists, so no OCR. Columns: y, x (absolute Figma canvas points), text (one line per text line); [phone] = inside a phone mockup.

```
  9041   4271  【Requirement】
  9041   5721  【Requirement】
  9041   7171  【Requirement】
  9041   8621  【Requirement】
  9041  10071  【Requirement】
  9041  11521  【Requirement】
  9041  12971  【Requirement】
  9052   4179  [phone] ≋
  9052   5629  [phone] ≋
  9052   7079  [phone] ≋
  9052   8529  [phone] ≋
  9052   9979  [phone] ≋
  9052  11429  [phone] ≋
  9052  12879  [phone] ≋
  9056   3895  [phone] 9:41
  9056   5345  [phone] 9:41
  9056   6795  [phone] 9:41
  9056   8245  [phone] 9:41
  9056   9695  [phone] 9:41
  9056  11145  [phone] 9:41
  9056  12595  [phone] 9:41
  9078   4271  • 多頁 canvas，可自由縮放 view、左右捲動  [D1-03]
  9078   5721  • focus frame 時 click → focus image；focus image 時 click → focus frame  [F6]
  9078   7171  • image 工具（feature bar 一條橫向捲動）：替換 / 水平 flip / 垂直 flip / adjustment / filter（同 Collage）  [F8][D1-35]
  9078   8621  • 長按可拖曳 input image，放到另一個 frame 即兩張對調  [F5]
  9078  10071  • frame 分單圖（例：拍立得）與多圖（例：底片）  [D1-19]
  9078  11521  • 多圖 → 單圖：保留第一張，其餘自動刪除  [D1-22]
  9078  12971  • 多圖 frame 內部：長按 image 拖到同 frame 另一格即對調  [D1-20]
  9085   3879  [phone] ‹
  9085   5329  [phone] ‹
  9085   6779  [phone] ‹
  9085   8229  [phone] ‹
  9085   9679  [phone] ‹
  9085  11129  [phone] ‹
  9085  12579  [phone] ‹
  9097   4011  [phone] ↶
  9097   4051  [phone] ↷
  9097   5461  [phone] ↶
  9097   5501  [phone] ↷
  9097   6911  [phone] ↶
  9097   6951  [phone] ↷
  9097   8361  [phone] ↶
  9097   8401  [phone] ↷
  9097   9811  [phone] ↶
  9097   9851  [phone] ↷
  9097  11261  [phone] ↶
  9097  11301  [phone] ↷
  9097  12711  [phone] ↶
  9097  12751  [phone] ↷
  9102   4151  [phone] Export
  9102   5601  [phone] Export
  9102   7051  [phone] Export
  9102   8501  [phone] Export
  9102   9951  [phone] Export
  9102  11401  [phone] Export
  9102  12851  [phone] Export
  9131   4271  • 每個看似挖空的地方都是 add image 的 frame（+）  [F2]
  9131  11521  • 多圖 → 較少格（N 格）：保留左→右、上→下順序的前 N 張，其餘自動刪除  [D1-22]
  9146   5721  • frame focus 懸浮鈕：delete / duplicate / lock（icon）  [F7][D1-32]
  9146   8621  • 元件依中心點所在頁決定跟誰走；跨頁元件拖曳後仍跨頁  [F13]
  9146  10071  • 在 frame 工具列切換 frame 樣式（不是拖曳）  [D1-21]
  9146  12971  • frame 之間長按互換同 photo_swap  [F5]
  9176   7171  • Removal / Enhance 在工具列掛 premium tag  [D3-01]
  9199   4271  • 點 + 匯入照片：一張或多張，上限＝目前空 frame 數  [F4]
  9199  11521  • 刪掉的圖再切回多圖 frame 也叫不回來，只能 undo / redo  [D1-22]
  9214   5721  • frame 工具：opacity / shadow / 水平 flip / 垂直 flip / duplicate / lock / delete（整個 frame 刪除）  [F9]
  9214   8621  • 也可在多圖 frame 內部格子之間長按互換  [D1-20]
  9214  10071  • 單圖 → 多圖：原圖自動帶到多圖 frame 左→右、上→下的第一格  [D1-21]
  9244   7171  • 進 Removal / Enhance 房間，apply 時 IAP page 擋  [D3-01]
  9267   4271  • 頂部 undo / redo，涵蓋畫布上所有操作  [D1-13]
  9282  10071  • 多圖 frame 的其餘格子顯示 + add image  [D1-21]
  9312   5721  • frame 可縮放  [F3]
  9312   7171  • 結果取代該 frame 的照片、回畫布、可 undo、不另存相簿  [D1-11]
  9320   4271  • 底部：Background / Layers / + / Ratio / Pages  [D1-04]
  9348   3951  [phone] +
  9350   5721  • lock 後行為見 Canvas · frame_locked  [D1-33]
  9376   9888  [phone] +
  9376   9972  [phone] +
  9380   7171  • delete：變回空 frame，+ add image icon 出現  [F8]
  9388   4271  • 元件皆可調整：文字顏色 / 內容 / 字體、圖片位置  [D1-04]
  9391   3897  [phone] a year in pictures
  9391   5347  [phone] a year in pictures
  9391   6797  [phone] a year in pictures
  9391   8247  [phone] a year in pictures
  9401   3311  Canvas
  9401   3311  · default
  9401   4761  Canvas
  9401   4761  · frame_focus
  9401   6211  Canvas
  9401   6211  · image_focus
  9401   7661  Canvas
  9401   7661  · photo_swap
  9401   9111  Canvas
  9401   9111  · frame_switch_multi
  9401  10561  Canvas
  9401  10561  · frame_switch_single
  9401  12011  Canvas
  9401  12011  · swap_in_frame
  9403   5721  • 選取狀態可刪除 / duplicate / lock  [D1-05]
  9421   4070  [phone] +
  9428   3951  [phone] +
  9448   7171  • lock 後行為見 Canvas · image_locked  [D1-34]
  9501   3951  [phone] +
  9501   5401  [phone] +
  9501   6851  [phone] +
  9501   8301  [phone] +
  9521  12621  [phone] Long press & drag to swap
  9563   9721  [phone] Frame
  9563  11171  [phone] Frame
  9564   9995  [phone] ✕
  9564  11445  [phone] ✕
  9581   5311  [phone] Frame selected
  9581   6761  [phone] Image selected
  9581   8211  [phone] Long press & drag to swap
  9705   9679  [phone] 1 photo
  9705   9769  [phone] 3 photos
  9705   9859  [phone] 1 photo
  9705   9949  [phone] 1 photo
  9705  11129  [phone] 1 photo
  9705  11219  [phone] 3 photos
  9705  11309  [phone] 1 photo
  9705  11399  [phone] 1 photo
  9736   7103  [phone] PRO
  9739   5333  [phone] Opacity
  9739   5385  [phone] Shadow
  9739   5437  [phone] Flip H
  9739   5489  [phone] Flip V
  9739   5541  [phone] Duplicate
  9739   5593  [phone] Lock
  9739   5645  [phone] Delete
  9779   4027  [phone] +
  9779   8377  [phone] +
  9779  12727  [phone] +
  9783   6781  [phone] Replace
  9783   6839  [phone] Flip H
  9783   6897  [phone] Flip V
  9783   6955  [phone] Adjust
  9783   7013  [phone] Filter
  9783   7071  [phone] Removal
  9813   3871  [phone] Background
  9813   3945  [phone] Layers
  9813   4093  [phone] Ratio
  9813   4167  [phone] Pages
  9813   8221  [phone] Background
  9813   8295  [phone] Layers
  9813   8443  [phone] Ratio
  9813   8517  [phone] Pages
  9813  12571  [phone] Background
  9813  12645  [phone] Layers
  9813  12793  [phone] Ratio
  9813  12867  [phone] Pages
 10091   4271  【Requirement】
 10091   5721  【Requirement】
 10091   7171  【Requirement】
 10102   4179  [phone] ≋
 10102   5629  [phone] ≋
 10102   7079  [phone] ≋
 10106   3895  [phone] 9:41
 10106   5345  [phone] 9:41
 10106   6795  [phone] 9:41
 10128   4271  • 背景：純色；不做漸層  [F10]
 10128   5721  • 質地 texture 為新內容，需可 loop  [D1-17]
 10128   7171  • 點 Custom color 開調色盤：飽和度 / 明度方塊 + 色相條  [D1-23]
 10135   3879  [phone] ‹
 10135   5329  [phone] ‹
 10135   6779  [phone] ‹
 10166   4271  • 色卡 8×4＝32 色，由 content team 定義  [D1-23]
 10166   5721  • 部分 texture 可由 CMS 設為 PRO  [D3-02]
 10196   7171  • 滴管可從畫布取色  [D1-23]
 10219   4271  • 自訂顏色：調色盤 + 色相條 + 滴管（同 Text color picker）  [D1-23]
 10234   7171  • Cancel 不套用；Done 套用為背景色  [D1-23]
 10272   7171  • 同 Text color picker  [D1-23]
 10451   3311  Background
 10451   3311  · solid
 10451   4761  Background
 10451   4761  · texture
 10451   6211  Background
 10451   6211  · custom_color
 10493   6785  [phone] Cancel
 10493   7081  [phone] Done
 10527   3921  [phone] Background
 10527   5371  [phone] Background
 10528   4195  [phone] ✕
 10528   5645  [phone] ✕
 10586   3885  [phone] Solid
 10586   4057  [phone] Texture
 10586   5335  [phone] Solid
 10586   5507  [phone] Texture
 10644   5341  [phone] NEW
 10644   5455  [phone] NEW
 10726   5515  [phone] PRO
 10799   7091  [phone] ✎
 10825   4087  [phone] ✎
 10828   3885  [phone] Custom color  ⊕
```
