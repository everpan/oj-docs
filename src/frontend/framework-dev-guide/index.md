<!-- 由 scripts/sync-docs.mjs 于 2026-09-18 从 `oj-module:docs/prd/framework-development-guide.md` 生成，请勿直接编辑；改源文件后运行 `npm run sync` -->

---
title: 框架开发手册
generated: 2026-09-18
---

<p class="gen-note">generated: 2026-09-18 · 本页由脚本从 oj-module:docs/prd/framework-development-guide.md 同步生成，修改请改源文件后运行 npm run sync。</p>

# 框架开发手册：两个 npm 包（新人上手版）

> **读者**：刚加入、需要维护「框架本体」的同学。默认你会 React + TypeScript，能读 Vite / esbuild 配置；**不要求**你了解本仓库历史。
> **目标**：读完能独立完成「定位改动落在哪个包 → 写代码 → 本地验证 → 提交前重建产物」。
> **范围**：只讲 2 个对外发布的包 —— `runtime`（含 `runtime/contract` 子路径）与 `cli`（含预构建宿主 `shell-dist`），每包一章。
> **想直接上手做项目**：看配套实战演练 [`oj-fullstack-tutorial.md`](/frontend/fullstack-tutorial/)（从零搭一个 oj 前后端应用）。
> 面向「业务模块作者」的手册是 [`module-development-guide.md`](/frontend/module-dev-guide/)，两本手册读者不同，不要混读。
>
> ⚠️ **结构变更（已全量落实）**：本手册已按两轮改造逐句核对——**P1/P2 包合并与 scope 改名**（原 4 包 contract / runtime / shell / cli → 2 包 `runtime` / `cli`，`@react-antd-module` → `@oj-module`），以及 **P3 命令与内部前缀改名**（`ram` → `ojm`，内部 `ram-*` → `ojm-*`，**兼容读旧名**）。全文已无「独立 shell/contract 包」「`ram` 命令」口径；依据与迁移记录见 [`202609110947-oj-module-two-package-consolidation-design.md`](/frontend/design/two-package-consolidation/)（§12 实施记录、§13 陷阱 A27–A46）。
> 旧 scope 的 4 个包（`@react-antd-module/{runtime,cli,contract,shell}`）已在 npm 全量 **deprecate**，安装时会提示迁移到 `@oj-module/*`；两包当前同版 **`0.1.6`**。

---

## 章节

- [导读（先读这一页）](/frontend/framework-dev-guide/01)
- [第 1 章 `@oj-module/runtime/contract`：契约层](/frontend/framework-dev-guide/02)
- [第 2 章 `@oj-module/runtime`：运行时框架](/frontend/framework-dev-guide/03)
- [第 3 章 `@oj-module/cli`：预构建宿主](/frontend/framework-dev-guide/04)
- [第 4 章 `@oj-module/cli`：工程工具链（`ojm`）](/frontend/framework-dev-guide/05)
- [附录 A：发布清单（含 staged publishing 踩坑）](/frontend/framework-dev-guide/06)
- [附录 B：排障速查表](/frontend/framework-dev-guide/07)
- [附录 C：相关文档索引](/frontend/framework-dev-guide/08)
