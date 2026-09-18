---
title: tenant 专栏
updated: 2026-09-14
---

# tenant 专栏

多租户隔离与请求鉴权：租户从哪来、防护怎么开、跨租户怎么安全地做。

| 文档 | 看它解决什么 |
|---|---|
| [多租户新手指南](/reference/tenant-guide) | 两层开关（`enable` / `sql_guard`）、共享表双声明、`db.asSystem()` 逃生口、报错对照表 |
| [内置 API 与鉴权](/reference/builtin-api-auth) | 内置接口总览、登录与 refresh 时序、Bearer 守卫（oj-auth 插件） |
| [07 · 鉴权与多租户](/guide/07-auth-tenant) | 学习路径版：走一遍 sample 的登录 / refresh / logout，多租户与 OIDC 概貌 |

## 阅读顺序

1. 先读 [多租户新手指南](/reference/tenant-guide)——它把「识别」和「防护」两层开关讲清楚了；
2. 要接登录、refresh、Bearer 守卫，看 [内置 API 与鉴权](/reference/builtin-api-auth)；
3. 想动手跑一遍，跟 [07 · 鉴权与多租户](/guide/07-auth-tenant) 里的 sample 命令。

> 租户头目前是客户端自报的，框架只保证「请求内一致」。上线前请用网关/接入层按凭证
> 固定注入租户头，见 [多租户新手指南](/reference/tenant-guide)。

[← 返回后端专题](/topics/)
