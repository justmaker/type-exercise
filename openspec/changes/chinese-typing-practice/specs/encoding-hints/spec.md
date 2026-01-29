## ADDED Requirements

### Requirement: Tab 鍵觸發編碼提示
系統 SHALL 在使用者按下 Tab 鍵時，顯示當前待輸入字元的編碼提示。

#### Scenario: 按 Tab 顯示編碼
- **WHEN** 使用者按下 Tab 鍵
- **THEN** 在畫面右下角顯示當前字的編碼提示

#### Scenario: 非中文字元按 Tab
- **WHEN** 當前待輸入字元不是中文字（如英文、標點）
- **THEN** 不顯示編碼提示，或顯示「非中文字元」訊息

### Requirement: 顯示多種輸入法編碼
系統 SHALL 同時顯示以下四種輸入法的編碼：
- 注音（Zhuyin/Bopomofo）
- 倉頡（Cangjie）
- 無蝦米（Boshiamy）
- 拼音（Pinyin）

#### Scenario: 顯示完整編碼資訊
- **WHEN** 使用者對中文字按 Tab
- **THEN** 同時顯示該字的注音、倉頡、無蝦米、拼音編碼

### Requirement: 編碼提示位置
編碼提示 SHALL 顯示在畫面右下角，不遮擋主要打字區域。

#### Scenario: 提示框位置
- **WHEN** 編碼提示顯示
- **THEN** 提示框固定在畫面右下角

### Requirement: 編碼提示自動隱藏
編碼提示 SHALL 在使用者繼續輸入時自動隱藏。

#### Scenario: 輸入後隱藏提示
- **WHEN** 使用者在查看編碼提示後輸入任何字元
- **THEN** 編碼提示自動隱藏

### Requirement: 編碼資料完整性
系統 SHALL 提供常用中文字的編碼資料。若某字無特定輸入法編碼，SHALL 顯示「無資料」或相應提示。

#### Scenario: 查詢常用字編碼
- **WHEN** 使用者查詢常用中文字（如「的」「是」「我」）
- **THEN** 顯示該字的所有四種編碼

#### Scenario: 查詢無編碼資料的字
- **WHEN** 使用者查詢的字沒有某種輸入法編碼資料
- **THEN** 該輸入法欄位顯示「無資料」
