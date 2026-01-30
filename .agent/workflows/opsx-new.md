---
description: OpenSpec - 建立新的變更提案
---

# OpenSpec 建立新變更

執行以下步驟建立新的 OpenSpec 變更提案：

1. 詢問用戶變更的名稱和描述

2. 建立新的變更提案：
```bash
cd /Users/rexhsu/Documents/type-exercise && openspec change new <change-name>
```

3. 編輯 proposal.md 檔案，填寫變更的原因和目標

4. 編輯 design.md 檔案，填寫設計決策

5. 編輯 tasks.md 檔案，列出具體的實作任務

6. 如果需要建立新的規格：
```bash
cd /Users/rexhsu/Documents/type-exercise && openspec spec new <spec-name> --change <change-name>
```
