# 项目简介

一份空白的扩展。

## 安装

```bash
# 安装依赖模块
npm install
# 构建
npm run build
```

## 配置
 
```  tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "Core": [
        "./assets/Core/index"
      ],
    }
  }
}
```
 
``` import-map.json
{
    "imports": {
        "Core": "./assets/Core/index.ts"
    }
}
```

cocos creator -> 项目 -> 项目设置 -> 脚本-> Import Map -> 添加 import-map.json
