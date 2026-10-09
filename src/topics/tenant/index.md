---
title: tenant 专栏
updated: 2026-09-14
---

# tenant 专栏

多租户隔离与请求鉴权：租户从哪来、防护怎么开、跨租户怎么安全地做。

## 阅读顺序

1. **[多租户新手指南](/reference/tenant-guide)** — 两层开关（`enable` / `sql_guard`）、共享表双声明、`db.asSystem()` 逃生口、报错对照表，先把「识别」和「防护」讲清楚。
2. **[内置 API 与鉴权](/reference/builtin-api-auth)** — 内置接口总览、登录与 refresh 时序、Bearer 守卫（见 [oj-auth 插件](/reference/plugins/oj-auth)），要接登录、refresh、Bearer 守卫看这里。
3. **[07 · 鉴权与多租户](/guide/07-auth-tenant)** — 学习路径版：走一遍 sample 的登录 / refresh / logout，建立多租户与 OIDC 概貌，想动手跑就跟这里的命令。

> 租户头目前是客户端自报的，框架只保证「请求内一致」。上线前请用网关/接入层按凭证
> 固定注入租户头，见 [多租户新手指南](/reference/tenant-guide)。

[← 返回后端专题](/topics/)
