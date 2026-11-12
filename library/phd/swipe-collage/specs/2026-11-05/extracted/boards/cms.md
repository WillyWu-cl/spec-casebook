# cms — CMS fields and Template Spec

Swipe Collage PhDM Spec.pdf, region 3314, 8000, 1700, 900 (PDF points). From the PDF text layer (mupdf structured text; it maps the Chinese correctly in this file); macOS Vision OCR is not available on this Windows machine. Lines: y x text.

8090 3483 CMS Sheet Link (click me)
8154 3400 CMS type: MOCK_CMS_TYPE（未定）
8217 3412 欄位
8217 3752 說明
8217 4552 ID
8265 3412 guid
8265 3752 template id；deeplink template_guid 直接開 preview
8265 4552 [D1-09]
8313 3412 categories[]{guid, name, order}
8313 3752 3–4 個，順序由 CMS，Year End 第一；deeplink category_guid
8313 4552 [D2-07]
8361 3412 tags
8361 3752 NEW tag
8361 4552 [D2-07]
8409 3412 usageType
8409 3752 free / purchase → PRO icon，匯出時擋
8409 4552 [D3-02]
8457 3412 photo count
8457 3752 default 支援張數（瀑布流 / preview 顯示）
8457 4552 [D1-01]
8505 3412 page count
8505 3752 canvas 頁數（1–10）
8505 4552 [D1-12]
8553 3412 thumbnails（東 / 西）
8553 3752 每一頁一張；瀑布流顯示第一頁
8553 4552 [F16]
8618 3400 Template Spec
8665 3400 • Day 1：20 顆 template  [F16]
8703 3400 • 新內容：frame（mask 支援單張 / 多張 image）  [F17]
8741 3400 • 新內容：背景 texture（需可 loop）  [D1-17]
8779 3400 • 文字 / 字體 / 文字樣式 / text bubble / 貼紙沿用既有 CMS  [D1-14]
8817 3400 • ⚠️ HANDOFF BLOCKER：CMS type string / contentVer 未定（MOCK_CMS_TYPE）；CMS sheet 連結未提供（MOCK_CMS_SHEET）
8843 3400 [D2-07]
