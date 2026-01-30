---
description: OpenSpec - 驗證變更提案的完整性
---

# OpenSpec 驗證變更

執行以下步驟驗證變更提案的完整性：

// turbo
1. 列出所有變更：
```bash
cd /Users/rexhsu/Documents/type-exercise && openspec list
```

// turbo
2. 驗證變更提案（檢查必要檔案是否存在、格式是否正確）：
```bash
cd /Users/rexhsu/Documents/type-exercise && openspec validate
```

3. 如果需要驗證特定變更：
```bash
cd /Users/rexhsu/Documents/type-exercise && openspec validate <change-name>
```

4. 檢查項目包括：
   - proposal.md 是否存在且格式正確
   - design.md 是否存在
   - tasks.md 是否存在且有任務項目
   - specs/ 目錄下的規格是否完整

5. 查看變更的完成狀態：
```bash
cd /Users/rexhsu/Documents/type-exercise && openspec status <change-name>
```
