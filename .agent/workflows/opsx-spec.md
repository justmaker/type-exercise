---
description: OpenSpec - 管理規格文件
---

# OpenSpec 規格管理

管理 OpenSpec 的規格文件：

// turbo
1. 列出所有規格：
```bash
cd /Users/rexhsu/Documents/type-exercise && openspec list --specs
```

2. 建立新規格（需要指定名稱）：
```bash
cd /Users/rexhsu/Documents/type-exercise && openspec spec new <spec-name>
```

3. 在變更提案中建立規格：
```bash
cd /Users/rexhsu/Documents/type-exercise && openspec spec new <spec-name> --change <change-name>
```

4. 查看規格內容：
```bash
cd /Users/rexhsu/Documents/type-exercise && openspec show --spec <spec-name>
```

5. 規格目錄結構：
   - `openspec/specs/<spec-name>/spec.md` - 主規格檔案
