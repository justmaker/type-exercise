---
description: OpenSpec - 查看變更完成狀態
---

# OpenSpec 完成狀態

查看變更提案的完成狀態：

// turbo
1. 查看所有變更的概覽：
```bash
cd /Users/rexhsu/Documents/type-exercise && openspec list
```

// turbo
2. 查看詳細完成狀態：
```bash
cd /Users/rexhsu/Documents/type-exercise && openspec status
```

3. 查看特定變更的狀態：
```bash
cd /Users/rexhsu/Documents/type-exercise && openspec status <change-name>
```

4. 狀態會顯示：
   - 各個 artifact（proposal, design, tasks, specs）的完成度
   - 任務清單的進度 (已完成/總數)
