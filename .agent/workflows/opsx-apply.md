---
description: OpenSpec - 套用任務實作變更
---

# OpenSpec 套用任務

當需要根據 OpenSpec 的任務列表進行實作時：

// turbo
1. 查看目前進行中的變更：
```bash
cd /Users/rexhsu/Documents/type-exercise && openspec list
```

2. 讀取變更的任務列表：
```bash
cd /Users/rexhsu/Documents/type-exercise && openspec show <change-name>
```

3. 取得詳細的實作指引：
```bash
cd /Users/rexhsu/Documents/type-exercise && openspec instructions --change <change-name>
```

4. 根據任務列表逐一實作：
   - 閱讀 `openspec/changes/<change-name>/tasks.md`
   - 按照任務順序實作
   - 完成後在 tasks.md 中將 `[ ]` 改為 `[x]`

5. 檢查完成狀態：
```bash
cd /Users/rexhsu/Documents/type-exercise && openspec status <change-name>
```
