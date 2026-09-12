<!-- 由 scripts/sync-docs.mjs 于 2026-09-12 从 `only-js:docs/dev-guide.md` 生成，请勿直接编辑；改源文件后运行 `npm run sync` -->

---
title: 开发指南
generated: 2026-09-12
---

<p class="gen-note">generated: 2026-09-12 · 本页由脚本从 only-js:docs/dev-guide.md 同步生成，修改请改源文件后运行 npm run sync。</p>

# 开发手册（Developer Guide）

`only-js`（代号 **oj**）—— 基于 Rust + `deno_core` 的低代码后端框架，将 JS/TS 运行时（V8）
嵌入 Rust。业务逻辑以 JS/TS「handler」编写，使用注入的全局对象（`json` / `db` / `http` /
`kv` / `blob` / `bus` / `es` / `fetch` / `log` / `ws` / `plugins` / `cert` / `jwt` /
`bcrypt` / `crypto` / `finish`），Rust 侧捕获统一的 `{code,msg,data}` 信封，由 HTTP 服务写回。
数据库、KV、对象存储、事件总线、ES 等后端能力在启动时作为 **cdylib 插件** 通过 C-ABI FFI
契约（`oj-plugin-ffi`，ABI 7）加载。

本文合并了原日常开发手册与 `oj server` 内部实现走读两份文档：既覆盖**日常开发**
（环境、构建、写 handler、Rust 侧嵌入 API、加 op、测试、调试），也覆盖**内部实现**
（执行模型、关键模块深读、安全模型、设计权衡）。JS 全局对象完整参考见
[devkit/api-manual.md](/reference/api-manual/)（类型权威 `global.d.ts`），插件开发另见
[plugin-development.md](/reference/plugin-development)，部署运维见 [ops-manual.md](/reference/ops-manual)，
性能数据见 [benchmarks.md](/reference/benchmarks)，OIDC 实现走读与接入手册见
[oidc-implementation.md](/reference/oidc-implementation) / [oidc-integration.md](/reference/oidc-integration)。

---

## 章节

- [1. 环境与构建](/reference/dev-guide/01)
- [2. 项目结构（workspace 布局）](/reference/dev-guide/02)
- [3. 执行模型（数据流）](/reference/dev-guide/03)
- [4. 写 handler（JS/TS）](/reference/dev-guide/04)
- [5. 在 Rust 侧使用 Bridge（嵌入 / 测试）](/reference/dev-guide/05)
- [6. 接入真实数据库（SqlxAccessor）](/reference/dev-guide/06)
- [7. 模块加载与热重载（oj server）](/reference/dev-guide/07)
- [8. 关键模块职责（深读）](/reference/dev-guide/08)
- [9. DevTools 调试（inspector）](/reference/dev-guide/09)
- [10. 加一个新的 op（扩展 JS SDK）](/reference/dev-guide/10)
- [11. 安全模型与设计红线](/reference/dev-guide/11)
- [12. 测试](/reference/dev-guide/12)
- [13. 插件系统（cdylib + FFI）](/reference/dev-guide/13)
- [14. 设计权衡与已知约束](/reference/dev-guide/14)
- [15. 排错](/reference/dev-guide/15)
- [16. 提交与 CI](/reference/dev-guide/16)
