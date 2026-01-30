# 字碼資料來源說明 (Data Sources Documentation)

本文件記錄打字練習遊戲所使用的輸入法字碼資料來源、授權資訊及處理規則。

---

## 資料來源總覽

| 輸入法 | 來源專案 | 檔案名稱 | 授權 |
|--------|----------|----------|------|
| 倉頡 | OpenVanilla | `ov-cj-ext.cin` | MIT / Open Government Data |
| 注音 | chinese-opendesktop/cin-tables | `bopomofo.cin` | Open Government Data License |
| 無蝦米 | fcitx/fcitx5-table-extra | `boshiamy.txt` | LGPL-2.1 |
| 拼音 | pypinyin (Python Library) | - | MIT |

---

## 詳細說明

### 1. 倉頡輸入法 (Cangjie)

**來源**: [OpenVanilla](https://github.com/openvanilla/openvanilla)

```
檔案路徑: cin-tables/ov-cj-ext.cin
下載網址: https://raw.githubusercontent.com/openvanilla/openvanilla/master/DataTables/cj-ext.cin
字元數量: 81,897 個唯一字元
```

**選擇原因**:
- OpenVanilla 是 Mac/Linux 上最知名的開源輸入法架構
- 維護了最乾淨、格式最統一的 `.cin` 檔案
- 包含大字集（CNS11643），涵蓋約 70,000 個中文字元
- 授權友善，適合開源專案使用

**授權資訊**:
- 基於 CNS11643 全字庫資料
- Open Government Data License (台灣政府開放資料授權)

---

### 2. 注音輸入法 (Bopomofo/Zhuyin)

**來源**: [chinese-opendesktop/cin-tables](https://github.com/chinese-opendesktop/cin-tables)

```
檔案路徑: cin-tables/bopomofo.cin
下載網址: https://raw.githubusercontent.com/chinese-opendesktop/cin-tables/master/bopomofo.cin
字元數量: 70,476 個唯一字元
```

**選擇原因**:
- 依據全字庫 (CNS11643) 文字屬性規範
- 官方注音碼表，資料品質高
- 格式標準，易於解析

**授權資訊**:
- Open Government Data License
- 來源: http://www.cns11643.gov.tw/web/download.jsp

**格式說明**:
- 使用鍵盤碼表示注音 (如 `2k7` 表示 `ㄉㄜ˙`)
- 腳本會自動轉換為注音符號顯示

---

### 3. 無蝦米輸入法 (Boshiamy)

**來源**: [fcitx/fcitx5-table-extra](https://github.com/fcitx/fcitx5-table-extra)

```
檔案路徑: cin-tables/boshiamy.txt
下載網址: https://raw.githubusercontent.com/fcitx/fcitx5-table-extra/master/tables/boshiamy.txt
字元數量: 19,680 個唯一字元
```

**選擇原因**:
- Fcitx5 是 Linux 上最流行的輸入法框架
- 社群維護的「偽蝦米」表格，相容於原版無蝦米
- 開源授權，可自由使用

**授權資訊**:
- LGPL-2.1 (GNU Lesser General Public License)

**版權注意事項**:
> ⚠️ 原版無蝦米輸入法的字碼表具有版權，由行易有限公司持有。
> 此處使用的是 Linux 社群維護的開源版本，供學習與個人使用。

---

### 4. 漢語拼音 (Pinyin)

**來源**: [pypinyin](https://github.com/mozillazg/python-pinyin) Python 函式庫

```
安裝方式: pip install pypinyin
版本: 最新穩定版
```

**設定說明**:
- 使用 `Style.TONE3` 格式
- 輸出範例: `guang3`, `zhong1`, `ce4`
- 聲調以數字表示 (1-4)

**授權資訊**:
- MIT License

---

## 資料處理規則

### Rule A: Big5 過濾
```python
# 只保留能用 Big5 編碼的字元
# Big5 涵蓋約 13,000 個繁體中文常用字
char.encode('big5')
```

### Rule B: 最短碼優先 (Collision Handling)
```python
# 當一個字有多個輸入碼時，選擇最短的
# 例如倉頡有「標準碼」和「簡碼」，我們選簡碼
min(codes, key=len)
```

### Rule C: CJK 範圍過濾
```python
# 只保留 Unicode CJK 基本區和擴展 A 的字元
# 過濾掉符號、希臘字母、假名等
0x4E00 <= ord(char) <= 0x9FFF  # CJK 基本區
0x3400 <= ord(char) <= 0x4DBF  # CJK 擴展 A
```

---

## 輸出格式

### dictionary.json

```json
[
  ["測", "ㄘㄜˋ", "水月金弓", "SEI", "ce4"],
  ["試", "ㄕˋ", "卜口戈心", "HV", "shi4"]
]
```

| 欄位 | 說明 | 範例 |
|------|------|------|
| Col 0 | 字元 | 測 |
| Col 1 | 注音 | ㄘㄜˋ |
| Col 2 | 倉頡 (中文字根) | 水月金弓 |
| Col 3 | 無蝦米 (大寫) | SEI |
| Col 4 | 拼音 (TONE3) | ce4 |

---

## 統計資料 (最後更新)

| 項目 | 數值 |
|------|------|
| 最終字典字數 | 13,061 |
| 注音覆蓋率 | 99.9% |
| 倉頡覆蓋率 | 100% |
| 無蝦米覆蓋率 | 100% |
| 拼音覆蓋率 | 100% |
| 檔案大小 | 609.7 KB |

---

## 如何更新資料

1. 執行下載腳本更新碼表：
```bash
cd cin-tables/
curl -L "https://raw.githubusercontent.com/openvanilla/openvanilla/master/DataTables/cj-ext.cin" -o ov-cj-ext.cin
curl -L "https://raw.githubusercontent.com/chinese-opendesktop/cin-tables/master/bopomofo.cin" -o bopomofo.cin
curl -L "https://raw.githubusercontent.com/fcitx/fcitx5-table-extra/master/tables/boshiamy.txt" -o boshiamy.txt
```

2. 重新生成字典：
```bash
python3 build_dict.py
```

---

## 授權聲明

本專案的字碼資料來自多個開源專案，遵循各自的授權條款：

- **CNS11643 資料**: Open Government Data License (台灣政府開放資料)
- **Fcitx5 資料**: LGPL-2.1
- **pypinyin**: MIT License

使用者應遵循上述授權條款使用相關資料。

---

*文件更新日期: 2026-01-31*
