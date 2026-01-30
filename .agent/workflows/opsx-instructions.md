---
description: OpenSpec - 取得實作指引
---

# OpenSpec 實作指引

取得 AI 優化的實作指引：

// turbo
1. 列出進行中的變更：
```bash
cd /Users/rexhsu/Documents/type-exercise && openspec list
```

2. 取得完整實作指引：
```bash
cd /Users/rexhsu/Documents/type-exercise && openspec instructions
```

3. 取得特定變更的指引：
```bash
cd /Users/rexhsu/Documents/type-exercise && openspec instructions --change <change-name>
```

4. 取得特定 artifact 的指引：
```bash
cd /Users/rexhsu/Documents/type-exercise && openspec instructions proposal
cd /Users/rexhsu/Documents/type-exercise && openspec instructions design
cd /Users/rexhsu/Documents/type-exercise && openspec instructions tasks
```

5. 指引內容包括：
   - 上下文資訊
   - 相關規格
   - 具體實作步驟
