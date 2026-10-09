<!-- 由 scripts/sync-docs.mjs 于 2026-10-09 从 `oj-bin:docs/api/README.md` 生成，请勿直接编辑；改源文件后运行 `npm run sync` -->

---
title: API 文档索引
generated: 2026-10-09
---

<p class="gen-note">generated: 2026-10-09 · 本页由脚本从 oj-bin:docs/api/README.md 同步生成，修改请改源文件后运行 npm run sync。</p>


# API 文档索引

本目录按 `src/bridge/` 的 JS 全局对象逐一梳理 handler 侧 API：每篇含概述、配置、API 表、
错误、限制与场景化案例。系统级 bridge 机制见 [`../bridge.md`](/reference/bridge)；
**权威 API 参考为 [`../devkit/api-manual.md`](/reference/api-manual/)**，本目录与其对齐，
如有出入以 api-manual 为准。

| # | 全局对象 | 文档 | 对应 bridge 源 |
|---|---|---|---|
| 01 | `json` / `finish` | [01-json.md](/reference/api/01-json) | `json.rs` / `envelope.rs` |
| 02 | `http` | [02-http.md](/reference/api/02-http) | `http.rs` |
| 03 | `log` | [03-log.md](/reference/api/03-log) | `log.rs` / `sql_trace.rs` |
| 04 | `vars` | [04-vars.md](/reference/api/04-vars) | `vars.rs` |
| 05 | `plugins()` | [05-plugins.md](/reference/api/05-plugins) | `plugins_op.rs` |
| 06 | `db` / `DB(name)` | [06-db.md](/reference/api/06-db) | `db.rs` / `query.rs` / `accessor_sqlx.rs` |
| 07 | `kv`（`redis` 别名） | [07-kv.md](/reference/api/07-kv) | `kv.rs` |
| 08 | `blob(name?)` | [08-blob.md](/reference/api/08-blob) | `blob.rs` |
| 09 | `bus` | [09-bus.md](/reference/api/09-bus) | `bus.rs` / `bus_backend.rs` / `broker/` |
| 10 | `Kafka/RabbitMQ`（mq 轴） | [10-mq.md](/reference/api/10-mq) | `mq.rs` / `broker/` |
| 11 | `es` | [11-es.md](/reference/api/11-es) | `es.rs` |
| 12 | `Mail` / `mail` | [12-mail.md](/reference/api/12-mail) | `mail.rs` |
| 13 | `LDAP` / `ldap` | [13-ldap.md](/reference/api/13-ldap) | `ldap.rs` |
| 14 | `ws` / `WebSocket` | [14-ws.md](/reference/api/14-ws) | `ws.rs` |
| 15 | `tasks` | [15-tasks.md](/reference/api/15-tasks) | `task_pool.rs` |
| 16 | `jwt` / `bcrypt` / `crypto` | [16-crypto.md](/reference/api/16-crypto) | `crypto.rs` |
| 17 | `cert` | [17-cert.md](/reference/api/17-cert) | `cert.rs` |
| 18 | `oidc` | [18-oidc.md](/reference/api/18-oidc) | `oidc.rs` |
| 19 | `fs` | [19-fs.md](/reference/api/19-fs) | `fs.rs` |

其它内建全局（`fetch`、`URL`、`TextEncoder`、`toBigInt`/`toUBigInt`/`toDouble` 等）：
`fetch` 与 Web API 类由 deno_fetch/deno_web 扩展提供，见 api-manual 相应章节；
数值边界助手随 [06-db.md](/reference/api/06-db) 的数值一节说明（另见 [../numeric-limits.md](/reference/numeric-limits)）。
