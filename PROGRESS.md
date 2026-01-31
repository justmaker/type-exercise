# 打字速度測試 - 開發進度記錄

## 最後更新：2026-01-31

---

## 已完成功能

### 1. 修復初始化卡住問題
- **問題**：`inputArea.addEventListener` 在 DOM 元素初始化前執行，導致頁面卡在 loading
- **解法**：將事件監聽器移到 `setupEventListeners()` 函數中，在 `bootstrap()` 初始化 DOM 後才呼叫
- **相關檔案**：`script.js`

### 2. 修復變數重複宣告問題
- **問題**：`dictionary-data.js` 使用 `const dictionaryData`，`script.js` 又用 `var dictionaryData` 導致衝突
- **解法**：將 `dictionary-data.js` 的 `const` 改為 `var`
- **相關檔案**：`dictionary-data.js`

### 3. 背景載入新聞功能
- 先用 5 篇備用句子初始化，讓用戶可以立即開始打字
- 背景非同步載入 20 篇新聞（從 `daily_news.json` 或 RSS）
- 載入完成後自動更新題庫數量顯示
- `file://` 協議下跳過背景載入（避免 fetch 錯誤）
- **相關檔案**：`script.js`

### 4. 文章模式
- 新增「句子模式」/「文章模式」切換按鈕
- 句子模式：打新聞標題（約 20-50 字）
- 文章模式：打完整新聞內文（約 100-1000 字）
- 文章模式下文字區域可滾動、輸入框變大
- **相關檔案**：`index.html`, `style.css`, `script.js`

### 5. Python 後端支援完整新聞
- `fetch_news.py` 新增 `fetch_full_articles()` 函數
- 嘗試從新聞網站抓取完整內文（大部分網站有防爬蟲機制，抓取失敗時使用備用文章）
- `daily_news.json` 新增 `articles_zh` 和 `articles_en` 欄位
- **相關檔案**：`fetch_news.py`, `daily_news.json`

---

## 檔案變更清單

| 檔案 | 版本 | 變更內容 |
|------|------|----------|
| `script.js` | v5.0 | 修復初始化、新增背景載入、新增文章模式 |
| `index.html` | - | 新增句子/文章模式切換按鈕 |
| `style.css` | - | 新增內容模式按鈕樣式、文章模式 CSS |
| `fetch_news.py` | - | 新增抓取完整新聞內文功能 |
| `dictionary-data.js` | - | `const` → `var` |
| `daily_news.json` | - | 新增 `articles_zh`、`articles_en` 欄位 |

---

## 待處理事項

### 優先級高
- [ ] 文章模式目前只有 1 篇備用文章（新聞網站有防爬蟲機制）
- [ ] 考慮改用其他 API 來源（維基百科、公開文章、文學作品等）

### 優先級中
- [ ] 文章模式的排行榜可能需要獨立（長文和短句成績不好比較）
- [ ] 考慮新增「自訂文章」功能，讓用戶貼上自己想練習的文字

### 優先級低
- [ ] 新聞標題有時會包含來源（如 `| 政治 | 要聞`），可考慮清理
- [ ] 考慮新增進度追蹤（每日練習統計）

---

## 如何測試

```bash
# 1. 進入專案目錄
cd /Users/rexhsu/Documents/type-exercise

# 2. 啟動 HTTP 伺服器
python -m http.server 8000

# 3. 開啟瀏覽器
# http://localhost:8000
```

## 如何更新新聞

```bash
# 執行 Python 腳本抓取最新新聞
python fetch_news.py
```

---

## 專案結構

```
type-exercise/
├── index.html          # 主頁面
├── style.css           # 樣式
├── script.js           # 主要邏輯 (v5.0)
├── fetch_news.py       # Python 新聞抓取腳本
├── daily_news.json     # 每日新聞資料
├── dictionary.json     # 字典資料
├── dictionary-data.js  # 預載入字典
├── encoding-data.js    # 編碼資料
└── PROGRESS.md         # 本檔案
```
