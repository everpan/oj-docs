<!-- 由 scripts/sync-docs.mjs 于 2026-10-09 从 `oj-bin:docs/devkit/api-manual.md` 生成，请勿直接编辑；改源文件后运行 `npm run sync` -->

---
title: JS API 手册
generated: 2026-10-09
---

<p class="gen-note">generated: 2026-10-09 · 本页由脚本从 oj-bin:docs/devkit/api-manual.md 同步生成，修改请改源文件后运行 npm run sync。</p>

# oj TS API 开发手册

适用版本：API 面 v0.2（二进制版本号见 `oj/Cargo.toml`）

本手册写给**用 oj 框架开发业务项目**的开发者与 AI agent，内容包括：怎么组织模块、
怎么写 `api.ts` / `ws.ts` handler、怎么用注入的全局对象、怎么写测试、怎么配服务、
怎么构建发布与日常运维。
oj 是把 V8（deno_core）嵌进 Rust 的低代码后端框架：业务逻辑用 TS handler 编写，
运行时注入 `json` / `db` / `http` / `kv` / `blob` / `bus` / `es` 等全局对象，
所有响应统一套 `{code,msg,data}` 信封写回 HTTP。这里说的「信封」就是那层固定的
JSON 外壳：`code` 是状态码、`msg` 是消息、`data` 装业务数据。仓库内部实现见
`docs/dev-guide.md`，部署排障细节见 `docs/ops-manual.md`。本手册随版本包 `devkit/`
一同发布；API 签名以同目录 `global.d.ts` 为类型权威。

目录：1 快速开始 / 2 项目结构与模块约定 / 3 模块数据层 / 4 编写 api.ts /
5 导入解析 / 6 全局对象 API 参考 / 7 响应信封与错误码 / 8 鉴权与多租户 / 9 测试 /
10 配置 config.yaml / 11 构建与发布 / 12 运维要点 / 13 安全红线与已知限制

> **想直接抄代码**：同目录 `scenarios.md` 是场景速查（公开分享页匿名读租户数据 /
> SPA 深链回落与每页 meta / 测试库隔离 / LIMIT 分页陷阱 / 匿名路径通配），
> 每篇都是「配置 + 代码 + 验证 + 常见坑」。本手册讲「有什么、为什么」，场景集讲「怎么写」。

## 章节

- [1. 快速开始](/reference/api-manual/01)
- [2. 项目结构与模块约定](/reference/api-manual/02)
- [3. 模块数据层](/reference/api-manual/03)
- [4. 编写 api.ts](/reference/api-manual/04)
- [5. 导入解析](/reference/api-manual/05)
- [6. 全局对象 API 参考](/reference/api-manual/06)
- [7. 响应信封与错误码](/reference/api-manual/07)
- [8. 鉴权与多租户](/reference/api-manual/08)
- [9. 测试](/reference/api-manual/09)
- [10. 配置 config.yaml](/reference/api-manual/10)
- [11. 构建与发布](/reference/api-manual/11)
- [12. 运维要点](/reference/api-manual/12)
- [13. 安全红线与已知限制](/reference/api-manual/13)
