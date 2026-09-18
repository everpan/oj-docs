---
title: db 专栏
updated: 2026-09-14
---

# db 专栏

数据怎么声明、怎么访问、怎么迁移。

| 文档 | 看它解决什么 |
|---|---|
| [db 新人手册](/reference/db-guide/) | 配置 + JS 全量数据访问：查询构造器、事务、join、DML、序列化、红线 |
| [数据迁移](/reference/migration) | 初始化与迁移两条通道、场景速查、错误码与回滚 |
| [06 · 数据层与迁移](/guide/06-data-layer) | 学习路径版：四个数据通道、schema.yaml、账本门禁、表归属 |
| [07 · 模块数据层](/modules/07-data-layer) | 维护者视角：manifest / schema / migrate / seed / checks 五个 crate |

## 阅读顺序

1. 新人先读 [06 · 数据层与迁移](/guide/06-data-layer) 建立心智模型；
2. 写业务时查 [db 新人手册](/reference/db-guide/)；
3. 表结构要变更或迁移报错，翻 [数据迁移](/reference/migration)；
4. 改 oj 自己的数据层实现，看 [07 · 模块数据层](/modules/07-data-layer)。

[← 返回后端专题](/topics/)
