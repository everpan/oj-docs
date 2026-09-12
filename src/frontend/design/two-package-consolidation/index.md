<!-- 由 scripts/sync-docs.mjs 于 2026-09-12 从 `oj-module:docs/prd/202609110947-oj-module-two-package-consolidation-design.md` 生成，请勿直接编辑；改源文件后运行 `npm run sync` -->

---
title: 双包整合与改名
generated: 2026-09-12
---

<p class="gen-note">generated: 2026-09-12 · 本页由脚本从 oj-module:docs/prd/202609110947-oj-module-two-package-consolidation-design.md 同步生成，修改请改源文件后运行 npm run sync。</p>

# `@oj-module` 双包整合与品牌改名 — 设计方案

> 创建时间: 2026-09-11 09:47
> 状态: 已评审（脑暴对话逐节确认），待实施
> 关联文档: `docs/archive/prd/202608291025-framework-npm-package-design.md`（现行 4 包架构的设计依据，本文修订其 D4 / §4.1）、`docs/prd/framework-development-guide.md`（对外手册，需同步改名）
> 前置已确认: `@oj-module` npm scope 已注册可用

---

## 章节

- [1. 背景与动机](/frontend/design/two-package-consolidation/01)
- [2. 现状诊断](/frontend/design/two-package-consolidation/02)
- [3. 决策记录](/frontend/design/two-package-consolidation/03)
- [4. 目标架构](/frontend/design/two-package-consolidation/04)
- [5. 构建与产物流水](/frontend/design/two-package-consolidation/05)
- [6. 改名迁移（`@oj-module` → `@oj-module`，`ram` → `ojm`）](/frontend/design/two-package-consolidation/06)
- [7. 风险与守卫](/frontend/design/two-package-consolidation/07)
- [8. 测试与验收](/frontend/design/two-package-consolidation/08)
- [9. 实施阶段](/frontend/design/two-package-consolidation/09)
- [10. 待定事项](/frontend/design/two-package-consolidation/10)
- [11. 修订记录（对既有设计文档）](/frontend/design/two-package-consolidation/11)
- [12 实施记录](/frontend/design/two-package-consolidation/12)
- [13 反常识 / 陷阱记录（P1–P5 新增）](/frontend/design/two-package-consolidation/13)
