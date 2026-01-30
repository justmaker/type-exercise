# 打字速度測試 | Typing Speed Test

一個支援中英文的打字速度測試工具，整合完整的中文輸入法字碼查詢功能。

## 功能特色

- ✅ **雙語支援**：中文 / English
- ✅ **每日新聞**：自動抓取當日新聞作為練習文本
- ✅ **字碼查詢**：按 `Tab` 查看當前字的編碼
  - 注音（Zhuyin）、倉頡（Cangjie）、無蝦米（Boshiamy）、拼音（Pinyin）
- ✅ **快捷重啟**：測試完成後按 `Enter` 或 `Space` 即可「再試一次」
- ✅ **提早結束**：練習中可按 `Esc` 強制結束測試
- ✅ **成績記錄**：WPM、正確率、破紀錄提示與排行榜

## 快速開始

### 方法一：HTTP 伺服器（推薦）

```bash
# 啟動本地伺服器
python3 -m http.server 8080

# 開啟瀏覽器
open http://localhost:8080
```

### 方法二：更新每日新聞

```bash
# 安裝依賴（首次執行）
pip3 install feedparser beautifulsoup4

# 抓取今日新聞
python3 fetch_news.py

# 啟動伺服器
python3 -m http.server 8080
```

## 檔案說明

### 核心檔案
- `index.html` - 主頁面（包含 Esc 結束與 Enter 重啟提示）
- `script.js` - 遊戲核心邏輯（全域按鍵監聽）
- `style.css` - 現代化暗色系風格樣式

### 字典資料
- `dictionary.json` - 字典原始資料（Array 格式）
- `dictionary-data.js` - 預編譯字典（Object 格式，用於前端）
- `build_dict.py` - 字典生成腳本
- `DATA_SOURCES.md` - 資料來源說明

### 新聞系統
- `fetch_news.py` - 新聞抓取腳本（Python 後端）
- `daily_news.json` - 當日新聞快取

### 輸入法碼表
- `cin-tables/ov-cj-ext.cin` - 倉頡（OpenVanilla）
- `cin-tables/bopomofo.cin` - 注音
- `cin-tables/boshiamy.txt` - 無蝦米（Fcitx5）

## 新聞抓取流程

```
Python 後端 (fetch_news.py)
  ↓
抓取 RSS Feed
  ↓
清理 HTML 標籤
  ↓
標點符號標準化（半形 → 全形）
  ↓
輸出 daily_news.json
  ↓
前端 (script.js) 載入
  ↓
快取到 localStorage
```

### 標點符號轉換

Python 後端會自動將半形標點轉換為全形：

| 半形 | 全形 |
|------|------|
| `,` | `，` |
| `.` | `。` |
| `?` | `？` |
| `!` | `！` |
| `:` | `：` |
| `;` | `；` |

這確保打字練習時不需要切換輸入法。

## 字典生成

```bash
# 重新生成字典（如果需要更新字碼）
python3 build_dict.py

# 這會生成：
# - dictionary.json (13,061 字)
# - 包含：注音、倉頡、無蝦米、拼音
```

## 資料來源

詳見 [`DATA_SOURCES.md`](DATA_SOURCES.md)

- **倉頡**：OpenVanilla (MIT License)
- **注音**：CNS11643 (Open Government Data)
- **無蝦米**：Fcitx5 (LGPL-2.1)
- **拼音**：pypinyin (MIT License)

## 開發

### 更新新聞（每日執行）

```bash
# 可以設定 cron job 每天自動執行
0 6 * * * cd /path/to/type-exercise && python3 fetch_news.py
```

### 更新字典

```bash
# 下載最新碼表到 cin-tables/
# 然後執行
python3 build_dict.py
```

## 授權

本專案使用多個開源資料來源，各有不同授權：

- 程式碼：MIT License
- 倉頡碼表：MIT License
- 注音碼表：Open Government Data License
- 無蝦米碼表：LGPL-2.1
- 拼音：MIT License

詳見 `DATA_SOURCES.md`。

## 技術架構

### 前端
- Vanilla JavaScript (ES6+)
- LocalStorage 快取
- Fetch API

### 後端（新聞抓取）
- Python 3.9+
- feedparser (RSS 解析)
- BeautifulSoup4 (HTML 清理)

### 資料處理
- Big5 編碼過濾
- CJK 字元範圍檢查
- 最短碼優先（Rule B）

## 常見問題

### Q: 為什麼直接開啟 index.html 會卡住？

A: 瀏覽器的 CORS 安全政策會阻擋 `file://` 協議下的 fetch 請求。請使用 HTTP 伺服器。

### Q: 如何更新每日新聞？

A: 執行 `python3 fetch_news.py`，或設定 cron job 自動執行。

### Q: 字碼顯示「無資料」？

A: 確認 `dictionary-data.js` 已正確載入。檢查瀏覽器 Console 是否有錯誤。

### Q: 如何新增更多字？

A: 在 `cin-tables/` 中新增對應的 `.cin` 或 `.txt` 檔案，然後執行 `python3 build_dict.py`。

## 貢獻

歡迎提交 Issue 或 Pull Request！

## 作者

Justmaker
