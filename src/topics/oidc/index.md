---
title: oidc 专栏
updated: 2026-09-14
---

# oidc 专栏

OIDC 单点登录：oj 既能当 IdP（OP），也能接外部 IdP（RP）。

| 文档 | 看它解决什么 |
|---|---|
| [OIDC 接入](/reference/oidc-integration) | 最小可用配置、登录链路（RP 角色）、用内置 OP、多租户接线、上线前安全清单 |
| [OIDC 实现](/reference/oidc-implementation) | OP + RP 双角色架构、全链时序图、多租户数据流、文件清单与已知边界 |
| [idp 模块（内置 OP）](/sample/idp) | sample 里的身份提供方模块：干什么、不变量、怎么改、怎么测 |
| [oidc 模块（RP）](/sample/oidc) | sample 里的依赖方模块：接内置 OP 的完整样例 |

## 阅读顺序

1. 要接线先读 [OIDC 接入](/reference/oidc-integration)（配置与安全清单在这）；
2. 要改实现或排查链路，读 [OIDC 实现](/reference/oidc-implementation)；
3. 想看能跑的代码，从 [idp 模块](/sample/idp)（OP）到 [oidc 模块](/sample/oidc)（RP）对读。

> OIDC 的浏览器跳转腿带不了自定义头，需要免租户头的路径在
> `tenant.anonymous_paths` 里豁免，见 [OIDC 接入](/reference/oidc-integration) 的多租户接线一节。

[← 返回后端专题](/topics/)
