---
title: db 专栏
updated: 2026-09-14
---

# db 专栏

数据怎么声明、怎么访问、怎么迁移。

## 阅读顺序

由浅入深，按这个顺序读：

1. **[06 · 数据层与迁移](/guide/06-data-layer)** — 学习路径版：四个数据通道、schema.yaml、账本门禁、表归属，先建立心智模型。
2. **[db 新人手册](/reference/db-guide/)** — 配置 + JS 全量数据访问：查询构造器、事务、join、DML、序列化、红线，写业务时查。
3. **[数据迁移](/reference/migration)** — 初始化与迁移两条通道、场景速查、错误码与回滚，表结构变更或迁移报错时翻。
4. **[07 · 模块数据层](/modules/07-data-layer)** — 维护者视角：manifest / schema / migrate / seed / checks 五个 crate，改 oj 自己的数据层实现看这里。
5. **[oj-db-mysql / oj-db-postgres 插件](/reference/plugins/oj-db-mysql)** — 第一方 db 轴插件：认领 `mysql://` / `postgres://`，后端轴、配置段与构建注意、当前状态。

[← 返回后端专题](/topics/)
