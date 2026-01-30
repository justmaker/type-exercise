---
description: OpenSpec - 快速完成變更（Fast-Forward）
---

# OpenSpec 快速完成變更

當需要快速完成一個變更的所有任務時，執行以下步驟：

// turbo-all

1. 列出進行中的變更：
```bash
cd /Users/rexhsu/Documents/type-exercise && openspec list
```

2. 讀取變更的任務列表：
```bash
cat /Users/rexhsu/Documents/type-exercise/openspec/changes/*/tasks.md 2>/dev/null || echo "No active changes"
```

3. 取得實作指引：
```bash
cd /Users/rexhsu/Documents/type-exercise && openspec instructions 2>/dev/null || echo "No instructions available"
```

4. **快速實作模式**：
   - 讀取所有未完成的任務
   - 按順序快速實作每個任務
   - 自動將 `[ ]` 標記為 `[x]`
   - 跳過需要用戶確認的步驟

5. 驗證完成：
```bash
cd /Users/rexhsu/Documents/type-exercise && openspec validate
```

6. 自動歸檔（如果所有任務都完成）：
```bash
cd /Users/rexhsu/Documents/type-exercise && openspec status
```

---

⚠️ **注意**: 此模式會快速執行所有任務，適合已經明確知道要做什麼的情況。
如果需要更謹慎的實作，請使用 `/opsx-apply`。
