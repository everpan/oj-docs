---
title: mail 专栏
updated: 2026-09-18
---

# mail 专栏

邮件投递：`oj-mail` 插件 + `smtp:` 配置段，业务侧只面对全局 `Mail` / `mail`。

| 文档 | 看它解决什么 |
|---|---|
| [邮件投递（SMTP）手册](/reference/mail-smtp) | 完整参考：宿主/插件职责边界、`smtp:` 配置与白名单门禁、JS API 与错误码、附件引用、`sendRaw` 语义、`enqueue` 反馈通道、安全清单、构建运维与已知限制 |
| [JS API 手册 · §6 全局对象](/reference/api-manual/06) | `mail` 速查：方法签名、请求结构、信封与错误码（先看这里上手） |
| [用户手册](/reference/user-manual/) | `config.yaml` 里 `smtp:` 段的字段说明与装配期校验 |
| [插件开发](/reference/plugin-development) | `oj-mail` 是 cdylib 插件：插件发现路径、ABI 与身份预检、`cargo xtask plugin mail` 构建 |
| [WebSocket](/reference/websocket) | §6 里 `bus.subscribe("mail.result")` 的订阅侧说明（`bus.subscribe` 仅 WS 上下文可用） |

## 阅读顺序

1. 先配 `smtp:`（[用户手册](/reference/user-manual/) 看字段）并跑 `cargo xtask plugin mail`，
   未装插件不阻断启动，调用时才会报 `mail not configured`；
2. 写业务先看 [JS API 手册 · §6](/reference/api-manual/06)，需要细节再翻
   [完整手册](/reference/mail-smtp)；
3. 上线前过一遍完整手册的「安全清单」：白名单是 fail-closed 的全等匹配、`tls: none`
   必须显式开关、`code !== 0` **不得自动重试**。

> 邮件是**可选能力**：不配 `smtp:` 段就完全不启用，既有部署与插件无需改动（新增 `mail` 轴
> 不动 ABI 版本）。异步反馈只有**本地** `bus` 扇出，跨进程分布式总线不支持。

## 过程记录

特性落地时的设计与实施记录，来自 `oj-bin` 的 `docs/plans/`。它们是**当时**的决策与执行
过程（含未采纳方案、评审意见与阶段小结），读现行行为请以上面的手册为准。

| 记录 | 里面有什么 |
|---|---|
| [设计记录](/reference/mail-smtp-design) | 设计演进 v1→v5：职责边界、配置形态、JS API、Rust 组件、数据流与线程模型、安全与测试策略（含未采纳方案） |
| [实施记录](/reference/mail-smtp-impl/) | 分阶段执行计划与落地结果：FFI 契约 → 插件骨架 → 队列与 drain → 宿主 ops → 装配端到端 → 加固验收，附逐条阶段小结 |

[← 返回后端专题](/topics/)
