<!-- 由 scripts/sync-docs.mjs 于 2026-09-12 从 `oj-module:docs/archive/prd/module-development-guide.md` 生成，请勿直接编辑；改源文件后运行 `npm run sync` -->

---
title: 业务模块开发手册
generated: 2026-09-12
---

<p class="gen-note">generated: 2026-09-12 · 本页由脚本从 oj-module:docs/archive/prd/module-development-guide.md 同步生成，修改请改源文件后运行 npm run sync。</p>

# 模块开发手册（npm 包化版）

> 面向外部团队：在独立仓库中开发业务模块，产物以静态资源形式发布，
> 宿主不重建即可上线（D1）。本文取代旧版「同仓库 modules/」手册。
>
> 更新：2026-08-30 随 P6 安全加固同步——`ctx.utils.request` 收敛为
> 按 `apiPrefix` 的 scoped client、模块资源 URL 受 moduleOrigins 白名单
> 约束、iframe 路由启用 https + 域名白名单 + sandbox。
>
> 更新：2026-08-30 P7 评审整改（详见 `202608300957-p7-review-remediation-plan.md`）——
> peerRuntime 校验真实生效、依赖缺失标记 missing-deps、requiredPermissions 落地、
> scoped client 增加路径归一化与 prefix 剥离、entry 并入 L2 完整性链路、
> 新增 `ram info` / `ram merge`、shell 包转 npm 发布。
>
> 更新：2026-09-01 随 playground 全量模块接入（`202609010056-playground-full-modules-plan.md`）
> ——新增 ram dev 工程 mock 约定（§3.4）、路由相对 path 的菜单 key/id 契约
> （§3.2 要点 4）、AppInfo 缺字段空态契约（§9 常见问题）。
>
> 前置阅读：`202608291145-framework-npm-package-implementation-plan.md`（设计文档），
> 本文引用其中决策编号（D*）与需求编号（B*/O*/R*）。

## 章节

- [目录](/frontend/module-dev-guide/01)
- [1. 架构总览](/frontend/module-dev-guide/02)
- [2. 环境准备](/frontend/module-dev-guide/03)
- [3. 模块开发](/frontend/module-dev-guide/04)
- [4. 构建与发布](/frontend/module-dev-guide/05)
- [5. 多团队清单合并](/frontend/module-dev-guide/06)
- [6. 运维](/frontend/module-dev-guide/07)
- [7. API 参考](/frontend/module-dev-guide/08)
- [8. 红线与门禁](/frontend/module-dev-guide/09)
- [9. 常见问题](/frontend/module-dev-guide/10)
