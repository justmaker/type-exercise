---
description: OpenSpec - 查看變更或規格內容
---

# OpenSpec 查看內容

查看變更提案或規格的詳細內容：

// turbo
1. 列出所有變更：
```bash
cd /Users/rexhsu/Documents/type-exercise && openspec list
```

2. 查看特定變更的內容：
```bash
cd /Users/rexhsu/Documents/type-exercise && openspec show <change-name>
```

3. 查看規格內容：
```bash
cd /Users/rexhsu/Documents/type-exercise && openspec show --spec <spec-name>
```

4. 如果需要查看原始檔案：
```bash
cat /Users/rexhsu/Documents/type-exercise/openspec/changes/<change-name>/proposal.md
cat /Users/rexhsu/Documents/type-exercise/openspec/changes/<change-name>/tasks.md
```
