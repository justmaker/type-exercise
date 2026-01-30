---
description: OpenSpec - 更新指令檔案
---

# OpenSpec 更新指令檔

更新 OpenSpec 的指令檔案到最新版本：

// turbo
1. 更新指令檔案：
```bash
cd /Users/rexhsu/Documents/type-exercise && openspec update
```

2. 這會更新 `.openspec/` 目錄中的 AI 指令檔案

3. 查看更新後的檔案：
```bash
ls -la /Users/rexhsu/Documents/type-exercise/.openspec/ 2>/dev/null || echo "No .openspec directory"
```
