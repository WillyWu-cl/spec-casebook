# CMS · Custom Style

Source: PM Figma https://www.figma.com/design/vhIp15PMJcwOcWJ6E9Q4JE/AI-Hair?node-id=3287-89 · board `pm-cms` · region of 3287:95 · box x=0 y=4448 w=1780 h=542 (absolute Figma canvas points)
Figma text layer (inventory read 2026-11-12, figma-pm / qa1); no PDF export exists, so no OCR. Columns: y, x from the board's top-left, text; [phone] = inside a phone mockup. Lines of one multi-line text are spaced 18 pt apart.

```
    60     60  CMS · Custom Style
   104     60  跟以往的 custom 不一樣：這次 Custom 裡面也有 style，所以 style 清單要上 CMS（縮圖、排序、上下架都由 CMS 控）[D6-13]
   150     60  CMS type: PhDM_AIHairColor_CustomStyle  (MOCK_CMS_TYPE，待 CMS 窗口確認)
   194     60  欄位                      說明
   212     60  guid                     Style_<流水號>_<UIName>_<model>，deeplink 帶的就是這個 [D6-14]
   230     60  api_style_value          送給 API 的 style 字串，必須是 11 個合法值之一 [D6-10]
   248     60  ui_name                  panel 上顯示的名稱（例：Ombre）
   266     60  thumbnail                style 區的範例截圖
   284     60  color_slots              1 或 2 —— solid_color 填 1，其餘填 2 [D6-04]
   302     60  order                    在 style 區的排序
   320     60  usageType                free / purchase（是否吃 premium 門檻）[D3-04]
   338     60  11 個合法 api_style_value：solid_color / ombre / colored_roots / dip_dye / balayage /
   356     60  highlights / face_framing / colored_bangs / earloop_highlights / split_dye_vertical /
   374     60  split_dye_horizontal   —— 來源：廠商 pipeline interface.json 的 legal.values [D6-10]
```
