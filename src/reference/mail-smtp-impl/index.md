<!-- 由 scripts/sync-docs.mjs 于 2026-09-18 从 `oj-bin:docs/plans/2026-09-15-mail-smtp-impl.md` 生成，请勿直接编辑；改源文件后运行 `npm run sync` -->

---
title: 邮件投递 · 实施记录
generated: 2026-09-18
---

<p class="gen-note">generated: 2026-09-18 · 本页由脚本从 oj-bin:docs/plans/2026-09-15-mail-smtp-impl.md 同步生成，修改请改源文件后运行 npm run sync。</p>

# Mail SMTP（lettre）插件 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: 用 superpowers:executing-plans 逐任务执行本计划。每阶段结束更新任务状态（TaskUpdate）并写「阶段小结」。

**Goal:** 以 cdylib 插件 `oj-mail` 新增 `mail` 轴，向 JS 提供 `Mail`/`mail` 全局，支持多 profile 的同步/异步 SMTP 发送、队列线程池与双通道反馈。

**Architecture:** 宿主（核心 `src/bridge/`）负责配置装配、入参校验、附件字节解析、bus 发布、结果存储与 JS 全局挂载；插件（`plugins/oj-mail`）持 `lettre`、连接池、有界队列 + worker 池并实际投递；二者经 `oj-plugin-ffi` 的 `MailVtable`（repr(C) + `FfiFuture`）契约通信。

**Tech Stack:** Rust 2024 · deno_core `#[op2]` · `oj-plugin-ffi`（stabby repr(C) + `FfiFuture`）· `lettre`（rustls/tokio1）· `rustls = "=0.23.40"` + aws-lc-rs · tokio。

**设计依据:** `docs/plans/2026-09-15-mail-smtp-design.md`（v3）。

---

## 章节

- [全局约定（每个任务都遵守）](/reference/mail-smtp-impl/01)
- [阶段 0：准备与基线（先验编译，防返工）](/reference/mail-smtp-impl/02)
- [阶段 1：FFI 契约（`oj-plugin-ffi`）](/reference/mail-smtp-impl/03)
- [阶段 2：插件骨架 `oj-mail`](/reference/mail-smtp-impl/04)
- [阶段 3：配置解析与 transport 构建（插件）](/reference/mail-smtp-impl/05)
- [阶段 4：有界队列 + worker 池 + FfiFuture + 背压 + drain（插件）](/reference/mail-smtp-impl/06)
- [阶段 5：消息组装 + 附件 + sendRaw 冲突头（插件）](/reference/mail-smtp-impl/07)
- [阶段 6：宿主 ops + StableState + 校验 + 附件解析 + 结果存储 + JS 全局](/reference/mail-smtp-impl/08)
- [阶段 7：装配与端到端](/reference/mail-smtp-impl/09)
- [阶段 8：加固与验收](/reference/mail-smtp-impl/10)
- [阶段汇总表](/reference/mail-smtp-impl/11)
- [阶段小结（执行时逐条追加）](/reference/mail-smtp-impl/12)
- [统一审查修复（阶段 9：四位评审 → 两批修复）](/reference/mail-smtp-impl/13)
