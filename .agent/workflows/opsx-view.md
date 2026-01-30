---
description: OpenSpec - 顯示互動式儀表板
---

# OpenSpec 儀表板

顯示 OpenSpec 的互動式儀表板：

1. 啟動互動式儀表板：
```bash
cd /Users/rexhsu/Documents/type-exercise && openspec view
```

⚠️ **注意**: 此命令需要在終端機中執行，會顯示互動式 TUI 介面。

2. 如果無法使用互動式介面，可以改用以下命令查看狀態：

// turbo
```bash
cd /Users/rexhsu/Documents/type-exercise && openspec list && echo "---" && openspec list --specs
```
