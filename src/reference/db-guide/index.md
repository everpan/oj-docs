<!-- 由 scripts/sync-docs.mjs 于 2026-09-18 从 `oj-bin:docs/db-guide.md` 生成，请勿直接编辑；改源文件后运行 `npm run sync` -->

---
title: db 新人手册
generated: 2026-09-18
---

<p class="gen-note">generated: 2026-09-18 · 本页由脚本从 oj-bin:docs/db-guide.md 同步生成，修改请改源文件后运行 npm run sync。</p>

# db 新人手册 —— 配置 + JS 全量数据访问

> 面向第一次写 oj handler 的新人。目标：读完能独立完成「配库 → 建表 → 增删改查 → 事务」，
> 并理解每一步背后的安全边界。
>
> 本手册讲「怎么上手、为什么这样设计」。逐 API 的穷举式参考见
> [`docs/devkit/api-manual.md`](/reference/api-manual/) 第 6 章「db / DB(name)」。
> 所有 API 名、字段名、报错文案均与源码（`src/bridge/bootstrap.js`、`src/bridge/query.rs`、
> `src/bridge/db.rs`）逐字核对，版本 0.1.14。

---

## 章节

- [0. 五分钟上手](/reference/db-guide/01)
- [1. db 配置](/reference/db-guide/02)
- [2. `db` 全局：方法面总览](/reference/db-guide/03)
- [3. 原生参数化查询（query / exec）](/reference/db-guide/04)
- [4. 事务](/reference/db-guide/05)
- [5. 查询构造器：从最小查询到组合](/reference/db-guide/06)
- [6. join 联表](/reference/db-guide/07)
- [7. DML：insert / update / delete](/reference/db-guide/08)
- [8. 聚合 / 分组 / having / distinct](/reference/db-guide/09)
- [9. 进阶构造（Phase 8）](/reference/db-guide/10)
- [10. 序列化：toJSON / fromJSON](/reference/db-guide/11)
- [11. 边界与红线（新人必读）](/reference/db-guide/12)
- [12. 延伸阅读](/reference/db-guide/13)
