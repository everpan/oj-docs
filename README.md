# oj 开发者手册站点（VitePress）

把 **后端仓库 `oj-bin`**（`docs/`、`sample/`）与 **前端仓库 `oj-module`**（`docs/prd/`）里的文档
编成面向新人的开发者手册。后端（Rust + JS/TS 运行时）与前端（React + TS 框架）分两大区呈现。

> 构建流程、同步机制与注意事项见维护者文档 [`docs/README.md`](docs/README.md)——
> 改动脚本、配置或流程后请同步更新它，保持一致性。

包管理器：**pnpm**（`package.json` 已声明 `packageManager`，别用 npm 混装）。

```bash
pnpm install         # 首次
pnpm run dev         # 本地预览 http://localhost:5173
pnpm run build       # 构建到 .vitepress/dist
pnpm run sync        # 从 oj-bin 的 docs/、sample/ 与 oj-module 的 docs/prd/ 重新同步文档
pnpm run check       # 死链扫描
pnpm run verify      # sync + check + build 一条龙（CI 用）
```

## 目录约定

| 路径 | 内容 | 能否手改 |
|---|---|---|
| `src/guide/` | 新人学习路径（12 篇，本站原创） | ✅ 改这里 |
| `src/topics/` | 后端专题栏目（db / tenant / websocket / oidc / mail 专栏索引，本站原创） | ✅ 改这里 |
| `src/index.md` | 首页 | ✅ |
| `src/appendix/` | 术语表、未收录文档索引 | ✅ |
| `src/reference/`、`src/modules/`、`src/sample/` | 后端（oj-bin）由脚本同步生成 | ❌ 改源文档后 `pnpm run sync` |
| `src/frontend/` | 前端框架（oj-module）由脚本同步生成 | ❌ 改源文档后 `pnpm run sync` |

> 生成产物**入库**（`src/reference/`、`src/modules/`、`src/frontend/`、`src/sample/`、
> `.vitepress/generated/`）—— 站点自包含，克隆即可 `pnpm install && pnpm run build`，
> **不依赖外部源仓库**。本机存在 `../oj-bin` / `../oj-module` 时，`predev` / `prebuild`
> 会先自动同步（源仓库缺席时 sync 自动跳过，沿用已提交的产物）。

**生成页顶部都标了来源与生成日期**（含 `oj-bin:` / `oj-module:` 仓库前缀），看到
「本页由脚本从 `xxx.md` 同步生成」就别手改。

## 收录规则

- 两个源：`oj-bin`（后端，取 `docs/`、`sample/`、`docs/devkit/`、`docs/modules/`、
  `docs/plans/`）与 `oj-module`（前端，取 `docs/prd/`，个别现行文档取自 `docs/archive/prd/`）。
- 只收描述**当前实现**的文档；评审记录、历史设计稿、归档不进站点，改由
  `src/appendix/history-index.md` 指路。`docs/archive/`、`docs/superpowers/` 下的文档统一指向该索引。
  例外：`docs/plans/` 里**已落地特性**的设计/实施记录可显式登记进白名单，作为「当时怎么设计的」
  的补充（当前只有邮件投递那两篇，挂在 mail 专栏下）——读现行行为仍以 `/reference/*` 手册为准。
- 超长文档（> 600 行）按二级标题自动切页：`src/reference/<doc>/index.md` + `NN.md`、
  `src/frontend/<doc>/index.md` + `NN.md`，sidebar 由 `scripts/sync-docs.mjs` 生成的
  `.vitepress/generated/sidebar.mjs` 驱动。
- 收录清单是脚本里的 `ENTRIES` 白名单（**不递归目录**，`sample/unit/node_modules/`
  下有大量第三方 README）。新增文档请先登记到白名单并指定 `from: 'backend' | 'frontend'`。
- 前端文档里的 `[[slug]]` / `[[slug|文本]]` wikilink 由脚本按文件名映射到对应路由，未收录的退化成纯文本。
- 后端文档除「按体例纵排」的 `/reference/*` 外，还有一层**按主题横排**的专题栏目
  `src/topics/`（当前 5 个专栏：db / tenant / websocket / oidc / mail）。

## 专题栏目（`src/topics/`）

按主题横向聚合站内已有的后端文档，是 `/reference/*` 之外的第二条导航路径：

| 专栏 | 聚合内容 |
|---|---|
| `db` | db 新人手册、数据迁移 + 学习路径 / 模块地图里的数据层页 |
| `tenant` | 多租户新手指南、内置 API 与鉴权 + 学习路径的鉴权与多租户 |
| `websocket` | WebSocket、MQ 与长任务 + 学习路径的实时与消息 |
| `oidc` | OIDC 接入、OIDC 实现 + sample 的 idp / oidc 模块 |
| `mail` | 邮件投递（SMTP）手册 + `smtp:` 配置、插件与 `bus` 反馈的相邻页，另附设计/实施记录 |

规则：

- 专栏页**只做索引与一句话导读，不复制正文**——正文只有一份，避免两处维护；
- 一篇文档在侧边栏只出现一次：归了专栏就从「后端 · API 参考 / 手册原文」移除；
  学习路径（`src/guide/`）、模块地图（`src/modules/`）里的页属于**跨区引用**，允许重复出现；
- 新增专栏：加 `src/topics/<name>/index.md`，并在 `.vitepress/config.mts` 的
  「后端专题」分组里登记。

## 已知处理

- 中文搜索：minisearch 默认按空格分词对中文无效，config 里自定义了「单字 + 二元组」切词。
- 代码块语言：`cli` / `bat` / `cmd` / `sh` 统一映射为 `bash`（shiki 不认 `cli`）。
- 裸标签转义：正文里 `<config_dir>` / `Promise<T>` 这类占位符会被 Vue 模板编译器当成
  未闭合元素，脚本在正文里统一转义；代码（围栏块与行内代码）不碰，交给 markdown-it，
  否则会被二次转义成页面上的 `&lt;` 字样。
- `http://localhost:9778` 的示例链接是给读者本地跑的，构建时按 `ignoreDeadLinks` 例外放行。
