<!-- 由 scripts/sync-docs.mjs 于 2026-09-12 从 `only-js:docs/user-manual.md` 生成，请勿直接编辑；改源文件后运行 `npm run sync` -->

---
title: 用户手册
generated: 2026-09-12
---

<p class="gen-note">generated: 2026-09-12 · 本页由脚本从 only-js:docs/user-manual.md 同步生成，修改请改源文件后运行 npm run sync。</p>

# oj server 用户手册

`oj` 是一个命令行工具：把按「模块 / 特性」目录组织好的 API 项目直接变成 REST 服务。
开发者在项目里按目录写 `api.ts`，`oj server` 把目录树原样映射成 HTTP 路由——改文件即生效
（dev 模式），编译产物可发布（release 模式）。

## 章节

- [1. 快速开始](/reference/user-manual/01)
- [2. 命令与参数](/reference/user-manual/02)
- [3. 配置 config.yaml](/reference/user-manual/03)
- [4. 项目目录结构](/reference/user-manual/04)
- [5. manifest.yaml 与模块数据层](/reference/user-manual/05)
- [6. 编写 api.ts](/reference/user-manual/06)
- [7. 路由规则](/reference/user-manual/07)
- [8. 导入（import）](/reference/user-manual/08)
- [9. handler 可用全局对象](/reference/user-manual/09)
- [10. 响应信封与错误](/reference/user-manual/10)
- [11. 样例走读（sample/）](/reference/user-manual/11)
- [12. 已知限制（v0.2）](/reference/user-manual/12)
