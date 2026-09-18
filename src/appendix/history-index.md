---
title: 历史与未收录文档
updated: 2026-09-18
---

# 历史与未收录文档

本站点只收录**描述当前实现**的文档。下面这些文档不进站点（内容已过时或属于过程记录），
但仍然保留在仓库里，需要时直接看源文件：

| 文档 | 为什么不进站点 | 看它的理由 |
|---|---|---|
| `docs/review-2026-09-06.md` | 全模块评审与整改记录（过程性） | 想知道某个已知债的来龙去脉；里面有文档债与处置表 |
| `docs/review-2026-09-02.md` | 同上，时间更早的一轮 | 与上一条互补 |
| `docs/route-params-design.md` | 早期设计稿，其中 release/build 段落已被 `oj build` 取代 | 只关心 `.route` 路径参数的设计动机 |
| `docs/plugin-architecture.md` | 只有 §0 描述现行实现，§1 起是未执行的历史方案 | 现行部分已并入[插件开发](../reference/plugin-development.md) |
| `docs/cli2.md` | 与[用户手册](../reference/user-manual/index.md)高度重复 | CLI 细节的另一种表述 |
| `docs/archive/` | 早期 CLI 预案、rust-core-runtime 方案与评审、插件系统交接快照 | 考古 |
| `docs/superpowers/` | 实施计划与 spec 草稿（量很大） | 想知道某个特性当时是怎么设计与评审的 |

> 站点里的[模块地图](../modules/index.md)与[开发指南](../reference/dev-guide/index.md)是
> 这些文档的「现行版结论」，一般先看它们就够。

`docs/plans/`（实施计划与设计稿）同样属于过程记录，默认不进站点。**已收录的例外**是已落地
特性的设计与实施记录：《[邮件投递设计记录](../reference/mail-smtp-design.md)》与
《[邮件投递实施记录](../reference/mail-smtp-impl/index.md)》——它们是邮件能力当时的决策与执行
过程，摆在 [mail 专栏](../topics/mail-smtp/index.md) 下；读现行行为请以
《[邮件投递（SMTP）手册](../reference/mail-smtp.md)》为准。

## 前端仓库（oj-module）

前端框架文档主要来自 `oj-module` 的 `docs/prd/`（现行设计稿与手册）。`oj-module` 的
`docs/archive/` 同样是历史文档（早期 PRD、前端 guide 旧版），不进站点。

其中《[业务模块开发手册](../frontend/module-dev-guide/index.md)》虽然位于 `oj-module` 的
`docs/archive/prd/`，但它是面向「业务模块作者」的**现行**手册（被《框架开发手册》引用），
因此已收录进站点前端区，不要把它当历史文档。

> 前端文档里出现的 `[[slug]]` 形式链接，若 slug 未收录则退化成纯文本，不会指向本页。
