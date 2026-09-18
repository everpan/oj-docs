<!-- 由 scripts/sync-docs.mjs 于 2026-09-18 从 `oj-module:docs/prd/oj-fullstack-tutorial.md` 生成，请勿直接编辑；改源文件后运行 `npm run sync` -->

---
title: 全栈实战演练
generated: 2026-09-18
---

<p class="gen-note">generated: 2026-09-18 · 本页由脚本从 oj-module:docs/prd/oj-fullstack-tutorial.md 同步生成，修改请改源文件后运行 npm run sync。</p>

# 实战演练：从零构建一个 oj 前后端应用（books 图书管理）

> **配套手册**：[`framework-development-guide.md`](/frontend/framework-dev-guide/)（四个包的职责与原理）。本文只讲「怎么一步步做出来」。
> **产出**：一个可登录、可查询、可新增的「图书管理」全栈应用（前端模块 + oj 后端 + SQLite）。
> **前置**：Node 18+、pnpm、会 React + TypeScript。**不需要**先懂 oj 或本框架内部。

### 你会走的完整链路

```
浏览器
  └─ shell（importmap：react/antd/runtime 单例）
       └─ runtime（加载 books 模块、跑生命周期、渲染页面）
            └─ books 模块（pages → 生成的 client）
                 └─ /api/books/*（Bearer token 自动带上）
                      └─ oj 后端（api/src/books/** 目录镜像路由）
                           └─ SQLite（books 表）
```

---

## 章节

- [0. 演练总览](/frontend/fullstack-tutorial/01)
- [1. 创建工程](/frontend/fullstack-tutorial/02)
- [2. 认识脚手架（动手前先读一遍）](/frontend/fullstack-tutorial/03)
- [3. 后端：新增 `books` 业务模块](/frontend/fullstack-tutorial/04)
- [4. 契约：把接口钉成契约](/frontend/fullstack-tutorial/05)
- [5. 前端：新增 `books` 模块](/frontend/fullstack-tutorial/06)
- [6. 联调与验证](/frontend/fullstack-tutorial/07)
- [7. 构建与部署](/frontend/fullstack-tutorial/08)
- [8. 常见问题（oj 应用专项）](/frontend/fullstack-tutorial/09)
- [附：命令速查](/frontend/fullstack-tutorial/10)
