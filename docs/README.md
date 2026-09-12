# 站点构建与维护指南（维护者文档）

> 本目录是 **oj-docs 站点的维护者文档**，不进 VitePress 站点（`srcDir` 是 `src/`，
> sync 也只读两个源仓库，不读本目录）。**改动脚本、配置或流程后请同步更新本文**，
> 保持文档与实现一致。

## 1. 站点定位与数据源

站点是「oj 开发者手册」，内容**不手写在站点里**，而是从两个源仓库单向同步：

| 源 | 仓库（相对 oj-docs 根） | 取哪些 |
|---|---|---|
| backend（默认） | `../only-js` | `docs/`、`docs/devkit/`、`docs/modules/`、`sample/` |
| frontend | `../oj-module` | `docs/prd/`（现行手册与设计稿；个别现行文档取自 `docs/archive/prd/`） |

- 两个源仓库必须存在于同级目录，缺失时 sync 会逐条报 `[sync] 缺失：<src>`。
- 两个仓库的 `docs/archive/`、`docs/superpowers/` 都是历史文档，指向它们的链接统一
  改写到 `/appendix/history-index`（被收录的除外——路由表优先命中）。

## 2. 目录约定（能改 / 不能改）

| 路径 | 内容 | 能否手改 | 入库 |
|---|---|---|---|
| `src/guide/`、`src/index.md`、`src/appendix/` | 学习路径、首页、术语表（本站原创） | ✅ | ✅ |
| `.vitepress/config.mts`、`.vitepress/theme/` | 站点配置与主题 | ✅ | ✅ |
| `scripts/` | 同步与死链检查脚本 | ✅ | ✅ |
| `docs/`（本目录） | 维护者文档 | ✅ | ✅ |
| `src/reference/`、`src/modules/`、`src/frontend/`、`src/sample/` | **脚本生成页** | ❌ 改源文件后 sync | ❌ |
| `.vitepress/generated/` | 脚本生成的 sidebar 数据 | ❌ | ❌ |
| `.vitepress/cache/`、`.vitepress/dist/`、`node_modules/` | 缓存/产物 | — | ❌ |

生成页顶部都有 banner 与 `gen-note`（含 `only-js:` / `oj-module:` 仓库前缀与生成日期），
看到就别手改——改了会在下次 sync 被覆盖。

## 3. 命令与构建流程

包管理器**只用 pnpm**（`package.json` 已声明 `packageManager`，别用 npm 混装）。

```bash
pnpm install         # 首次 / 依赖变更后
pnpm run sync        # 从两个源仓库重新同步文档到 src/
pnpm run check       # 死链扫描（有死链 exit 1）
pnpm run dev         # 本地预览 http://localhost:5173（predev 钩子会先自动 sync）
pnpm run build       # 构建到 .vitepress/dist（prebuild 钩子会先自动 sync）
pnpm run verify      # sync → check → build 一条龙；提交前必跑
```

克隆后无需手工补生成页：`predev` / `prebuild` 保证 dev/build 前一定先同步。
代价是「改了源仓库文档但没跑 sync」时本地看不到差异——**提交前跑 `pnpm run verify`**。

## 4. 同步机制（scripts/sync-docs.mjs）

### 收录清单 ENTRIES

白名单逐条登记，**不递归目录**（`sample/unit/node_modules/` 下有大量第三方 README）。
每项五个字段：

```js
{ src: 'docs/websocket.md', route: '/reference/websocket', title: 'WebSocket' }
// from: 'frontend' 时取 oj-module 源（默认 backend = only-js）
// split: true 强制切页；不写则正文 > SPLIT_LINES(600) 行时自动切
```

例外：`sample/src/*/README.md` 无需登记，一层 glob 自动收录（路由 `/sample/<目录名>`，
标题取首个 `# ` 行）。

### 两阶段切页判定（重要）

1. **预读**：读入全部条目，与主流程用**同一份正文**（去 frontmatter + 代码块语言归一 +
   裸标签转义）数行数，定出每个条目「是否切页」的权威决策；
2. 据此建路由表 `ROUTES` / `WIKIS`——**切页文档的路由是目录，带尾斜杠**；
3. **生成**：主循环改写链接、按二级标题 `## ` 切成 `<route>/index.md` + `NN.md`。

> 历史教训：曾用独立的 `willSplit()` 按原始行数（含 frontmatter）判定，与主流程
> 正文行数口径不一致，边界文档导致路由表与实际切页不符 → 链接指向错误路径，
> vitepress 构建期才报死链。两阶段就是为此设计，**改动行数口径时两处必须同步改**。

### 链接与 wikilink 改写

- 普通链接：两级映射「源相对路径 → 仓库绝对路径 → 站点路由」；源文档里的 `./xxx.md`
  **会**被改写成绝对路由（切页后相对基准必然失效）；脚本自己生成的 `./index.md`
  返回链接在改写之后才拼接，不受影响。
- wikilink：前端文档的 `[[slug]]` / `[[slug|文本]]` 按文件名 stem 映射到路由；
  解不出的**退化成纯文本**（不留裸括号、不产死链），代码块内不动。
- 在 `EXCLUDED` 集合或 `docs/archive/`、`docs/superpowers/` 下的 → 统一指向
  `/appendix/history-index`。
- 解析不了的相对链接**原样保留**并在 sync 结尾打印清单，人工决定补映射还是忽略。

### 其他自动处理

| 处理 | 原因 |
|---|---|
| 代码块语言 `cli` / `bat` / `cmd` / `sh` → `bash` | shiki 不认 `cli`，会掉高亮 |
| 代码块外的 `<config_dir>` / `Promise<T>` 的 `<` → `&lt;` | md 会被当 Vue 模板编译，裸标签 = 未闭合元素，build 直接失败 |
| frontmatter 注入 `title` / `generated` | 源文档自带 frontmatter 时做合并不覆盖 |

## 5. 死链检查（scripts/check-links.mjs）

判定**与 vitepress 对齐**：

- 文件页：`/xxx` 或 `/xxx.md` 皆可（链接可不带扩展名）；
- 目录页（切页文档的 index）：**必须带尾斜杠 `/xxx/`**，缺斜杠会报死链并附
  「目录页需带尾斜杠 /」提示；
- 用 `isFile()` 严格判定，**不能用 `existsSync`**——目录存在不等于链接合法
  （这正是早期版本漏报目录页死链的根因）。

## 6. 注意事项与历史教训（排障先看这里）

1. **目录页尾斜杠**：vitepress 只在构建期报死链且信息简短；`pnpm run check` 已提前
   拦截并给提示。新增指向切页文档的链接时记得带 `/`。
2. **`config.mts` 的 `splitNav['<route>']` 依赖该文档确实切页**：长期切页的文档在
   ENTRIES 里显式写 `split: true`，别只靠 600 行阈值（源文档变短会让 splitNav 键
   变 undefined，sidebar 莫名其妙坏掉）。
3. **d3 依赖坑（构建报 `"blur2" is not exported by d3-array`）**：曾因 pnpm lockfile
   snapshot 损坏，`d3-contour@4.0.2` 丢失 `d3-array` 依赖、回退到 hoisted 的
   `d3-array@2.12.1`（缺 `blur2`）。已在 `pnpm-workspace.yaml` 加
   `"d3-contour>d3-array": 3.2.4"` 覆盖。**再遇到此错：`rm -rf node_modules && pnpm install`**
   （普通 `pnpm install` 可能报 Already up to date 而不重链）。
4. **pnpm v11 不读 `package.json` 里的 `pnpm.overrides`**，必须放 `pnpm-workspace.yaml`，
   且嵌套对象形式不认——要用 `"包>依赖": 版本"` 选择器字符串。
5. **中文搜索**：minisearch 默认按空格分词对中文无效，config.mts 里自定义了
   「单字 + 二元组」切词，别删。
6. **mermaid**：后端 `oidc-implementation`、`builtin-api-auth` 两篇有 mermaid 图；
   mermaid 依赖的 fastdom 是 CJS 包，config 里 `optimizeDeps.include` 已处理。
7. **localhost 死链例外**：文档里 `http://localhost:9778/...` 示例是给读者本地跑的，
   `ignoreDeadLinks` 已放行，不算死链。
8. **sync 与源仓库是单向复制**：要改文档内容去源仓库改；在 oj-docs 里改生成页
   会被下次 sync 覆盖。

## 7. 常见操作手册

### 新增一篇文档

1. 在 `scripts/sync-docs.mjs` 的 `ENTRIES` 登记（oj-module 的写 `from: 'frontend'`；
   预期切页的写 `split: true`）；
2. `pnpm run sync`；
3. 新分组的话在 `.vitepress/config.mts` 的 `sidebar` 加条目（切页文档引用
   `splitNav['<route>']`，链接带尾斜杠）；
4. `pnpm run verify` 确认无死链、构建通过。

### 新增 sample 模块（后端）

在 `../only-js/sample/src/<模块>/` 丢一份 `README.md` 即可，sync 自动收录并进 sidebar。

### 源仓库文档更新后的发布

```bash
pnpm run verify      # 重新同步 + 检查 + 构建
git status           # 生成物不入库，通常没有 diff；有 diff 说明脚本/配置变了
```

### 提交约定

- 生成产物（`src/reference/` 等）**不入库**，提交里只应有脚本、配置、原创页与维护者文档；
- 提交前跑 `pnpm run verify`；
- 改动构建流程、脚本行为或踩了新坑，**同步更新本文档**。
