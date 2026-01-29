## Why

目前的打字練習只支援英文。許多使用者需要練習中文輸入法，但遇到不熟悉的字時不知道如何輸入。加入中文打字練習和編碼提示功能，可以幫助使用者學習和練習各種中文輸入法。

## What Changes

- 新增中文文章供使用者練習打字
- 當使用者不會輸入某個字時，可按 Tab 鍵查看編碼提示
- 在畫面右下角顯示當前字的輸入法編碼：
  - 注音（Zhuyin/Bopomofo）
  - 倉頡（Cangjie）
  - 無蝦米（Boshiamy）
  - 拼音（Pinyin）
- 保持原有的 WPM 和準確率計算功能

## Capabilities

### New Capabilities

- `chinese-typing`: 中文打字練習介面，顯示中文文章並處理中文輸入
- `encoding-hints`: 編碼提示系統，按 Tab 顯示當前字的各種輸入法編碼

### Modified Capabilities

- `typing-test-ui`: 擴展現有 UI 以支援中文顯示和編碼提示區域

## Impact

- 修改 `index.html`：新增編碼提示顯示區域
- 修改 `style.css`：新增編碼提示樣式
- 修改 `script.js`：新增中文文章、Tab 鍵處理、編碼查詢邏輯
- 需要中文編碼資料（可內嵌或從外部載入）
