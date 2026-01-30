---
description: OpenSpec - 歸檔已完成的變更
---

# OpenSpec 歸檔變更

當一個變更提案已經完成實作並測試後，執行以下步驟歸檔：

// turbo
1. 查看目前的變更狀態：
```bash
cd /Users/rexhsu/Documents/type-exercise && openspec list
```

2. 確認所有任務都已完成後，歸檔變更：
```bash
cd /Users/rexhsu/Documents/type-exercise && openspec archive <change-name>
```

3. 這會將變更的規格合併到主規格目錄中，並將變更提案移至 archive 資料夾
