<!-- 由 scripts/sync-docs.mjs 于 2026-10-09 从 `oj-bin:docs/plugins/README.md` 生成，请勿直接编辑；改源文件后运行 `npm run sync` -->

---
title: 插件索引
generated: 2026-10-09
---

<p class="gen-note">generated: 2026-10-09 · 本页由脚本从 oj-bin:docs/plugins/README.md 同步生成，修改请改源文件后运行 npm run sync。</p>


# 插件状态文档索引

本目录是按插件拆分的状态文档：每个第一方 cdylib 插件一份，记录它提供的后端轴、配置段、依赖与构建注意、当前状态。系统级插件机制文档见 [`plugin-architecture.md`](/reference/plugins/plugin-architecture) / [`plugin-development.md`](/reference/plugins/plugin-development) / [`../modules/05-ffi-and-plugins.md`](/modules/05-ffi-and-plugins)。

AXES 共 9 个：es / db / blob / bus / kv / auth / mq / mail / ldap。

| 插件 | 后端轴 | 配置段 | 状态 | 文档 |
|---|---|---|---|---|
| [oj-auth](/reference/plugins/oj-auth) | auth | `auth:` | 已随发行包发布（较早合入） | [oj-auth.md](/reference/plugins/oj-auth) |
| [oj-blob-s3](/reference/plugins/oj-blob-s3) | blob | `blob:`（或 `blob.backends.<name>`） | 已随发行包发布（较早合入） | [oj-blob-s3.md](/reference/plugins/oj-blob-s3) |
| [oj-bus-kafka](/reference/plugins/oj-bus-kafka) | bus + mq | `broker:` | 已随发行包发布（较早合入） | [oj-bus-kafka.md](/reference/plugins/oj-bus-kafka) |
| [oj-bus-rabbitmq](/reference/plugins/oj-bus-rabbitmq) | bus + mq | `broker:` | 已随发行包发布（较早合入） | [oj-bus-rabbitmq.md](/reference/plugins/oj-bus-rabbitmq) |
| [oj-db-mysql](/reference/plugins/oj-db-mysql) | db | `db:`（认领 `mysql://`） | 已随发行包发布（较早合入） | [oj-db-mysql.md](/reference/plugins/oj-db-mysql) |
| [oj-db-postgres](/reference/plugins/oj-db-postgres) | db | `db:`（认领 `postgres://`） | 已随发行包发布（较早合入） | [oj-db-postgres.md](/reference/plugins/oj-db-postgres) |
| [oj-es](/reference/plugins/oj-es) | es | `es:` | 已随发行包发布（较早合入） | [oj-es.md](/reference/plugins/oj-es) |
| [oj-kv-redis](/reference/plugins/oj-kv-redis) | kv | `redis:` | 已随发行包发布（较早合入） | [oj-kv-redis.md](/reference/plugins/oj-kv-redis) |
| [oj-ldap](/reference/plugins/oj-ldap) | ldap | `ldap:` | 首版可用（v0.1.28 起）；随发行包发布 | [oj-ldap.md](/reference/plugins/oj-ldap) |
| [oj-mail](/reference/plugins/oj-mail) | mail | `smtp:`（或 `plugins.mail` 透传） | 首版可用（v0.1.19 起）；随发行包发布 | [oj-mail.md](/reference/plugins/oj-mail) |

> `fs` 轴（核心内置，非插件）的文档已移至 [`../api/19-fs.md`](/reference/api/19-fs)。
