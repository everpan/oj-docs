# 站点构建与维护指南（维护者文档）

> 本目录是 **oj-docs 站点的维护者文档**，不进 VitePress 站点（`srcDir` 是 `src/`，
> sync 也只读两个源仓库，不读本目录）。**改动脚本、配置或流程后请同步更新本文**，
> 保持文档与实现一致。

## 1. 站点定位与数据源

站点是「oj 开发者手册」，内容**不手写在站点里**，而是从两个源仓库单向同步：

| 源 | 仓库（相对 oj-docs 根） | 取哪些 |
|---|---|---|
| backend（默认） | `../oj-bin` | `docs/`、`docs/devkit/`、`docs/modules/`、`docs/plans/`（只取已落地特性的设计/实施记录）、`sample/` |
| frontend | `../oj-module` | `docs/prd/`（现行手册与设计稿；个别现行文档取自 `docs/archive/prd/`） |

> **名字别混**：本地源仓库目录叫 `oj-bin`（GitHub 仓库 `everpan/oj-bin`）；`only-js`
> 是根 crate 名与项目代号，源文档正文里大量出现，**不要**把正文里的 `only-js` 改成
> `oj-bin`。本文档与脚本里提到「源仓库目录 / 生成页前缀」时用 `oj-bin`。

- 两个源仓库通常与本仓库同级；**任一源仓库缺席时 sync 自动跳过**（打印提示后退出，
  沿用已提交的生成产物）——因此 build/dev 不依赖外部仓库，克隆 oj-docs 单仓库即可构建。
- 两个仓库的 `docs/archive/`、`docs/superpowers/` 都是历史文档，指向它们的链接统一
  改写到 `/appendix/history-index`（被收录的除外——路由表优先命中）。
- `docs/plans/` 是过程记录（实施计划与设计稿），默认不进站点；**例外**是已落地特性被
  显式登记进 `ENTRIES` 的那几篇（当前：邮件投递的设计/实施记录，挂在 mail 专栏下），
  它们作为「当时怎么设计的」提供，读现行行为仍以 `/reference/*` 手册为准。

## 2. 目录约定（能改 / 不能改）

| 路径 | 内容 | 能否手改 | 入库 |
|---|---|---|---|
| `src/guide/`、`src/index.md`、`src/appendix/`、`src/topics/` | 学习路径、首页、术语表、后端专题栏目（本站原创） | ✅ | ✅ |
| `.vitepress/config.mts`、`.vitepress/theme/` | 站点配置与主题 | ✅ | ✅ |
| `scripts/` | 同步与死链检查脚本 | ✅ | ✅ |
| `docs/`（本目录） | 维护者文档 | ✅ | ✅ |
| `src/reference/`、`src/modules/`、`src/frontend/`、`src/sample/` | **脚本生成页** | ❌ 改源文件后 sync | ✅（生成即入库） |
| `.vitepress/generated/` | 脚本生成的 sidebar 数据 | ❌ | ✅（生成即入库） |
| `.vitepress/cache/`、`.vitepress/dist/`、`node_modules/` | 缓存/产物 | — | ❌ |

生成页顶部都有 banner 与 `gen-note`（含 `oj-bin:` / `oj-module:` 仓库前缀与生成日期），
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

克隆后即可构建：`pnpm install && pnpm run build`，**不依赖外部源仓库**——生成产物已入库；
本机存在源仓库时 `predev` / `prebuild` 会先自动 sync（缺席时 sync 自动跳过）。
源仓库文档更新后跑 `pnpm run sync` 再生成，**提交前跑 `pnpm run verify`**，
把再生成页面随源变更一起提交。

## 4. 同步机制（scripts/sync-docs.mjs）

### 收录清单 ENTRIES

白名单逐条登记，**不递归目录**（`sample/unit/node_modules/` 下有大量第三方 README）。
每项五个字段：

```js
{ src: 'docs/websocket.md', route: '/reference/websocket', title: 'WebSocket' }
// from: 'frontend' 时取 oj-module 源（默认 backend = oj-bin）
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
| 正文里 `<config_dir>` / `Promise<T>` 的 `<` → `&lt;` | md 会被当 Vue 模板编译，裸标签 = 未闭合元素，build 直接失败 |
| 代码（围栏块 + 行内代码）里的 `<` 不转义 | markdown-it 自己会转义；脚本再转一次就成 `&amp;lt;`，页面显示成 `&lt;`（曾线上 380 处） |
| 白名单标签需正文里有成对 `</tag>` 才算真 HTML | 否则 `<a>` 这种占位符会被当未闭合元素，build 直接失败 |
| frontmatter 注入 `title` / `generated` | 源文档自带 frontmatter 时做合并不覆盖 |

## 4.1 后端专题栏目（`src/topics/`，本站原创）

专题是**按主题横排**的第二条导航路径，与「按体例纵排」的 `/reference/*` 互补。当前 5 个专栏：
db / tenant / websocket / oidc / mail，各一个 `index.md`（`src/topics/<name>/index.md`）+ 总览页
`src/topics/index.md`，在 `config.mts` 的「后端专题」分组与 nav 里登记。

规则（改动前先看这三条）：

1. **不复制正文**：专栏页只写一句话导读 + 文档清单，正文永远只有 `/reference/*` 等页面上的
   那一份。复制正文等于给自己加一处必然过期的副本。
2. **侧边栏不重复**：文档归入某个专栏后，要从「后端 · API 参考」/「后端 · 手册原文」移除，
   否则同一篇在侧边栏出现两次。学习路径（`src/guide/`）、模块地图（`src/modules/`）、
   sample 里的页属于**跨区引用**，允许同时出现在原分组和专栏里。
3. **新增专栏**：加 `src/topics/<name>/index.md` → 在 `config.mts`「后端专题」`items` 里
   加一项（`link` 带尾斜杠，因为是目录页）→ 跑 `pnpm run verify`。

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
9. **站点自包含（build 不依赖外部）**：生成产物入库；sync 开头的守卫在任一源仓库
   缺失时直接跳过（守卫必须先于任何写入，否则空跑会写出空 sidebar 数据弄坏站点）。
   注意生成页 frontmatter 与 banner 带 `generated` 日期，sync 后即使内容没变
   git diff 也会显示日期刷新，属正常现象；只在实际更新文档时提交再生成结果。

## 7. 常见操作手册

### 新增一篇文档

1. 在 `scripts/sync-docs.mjs` 的 `ENTRIES` 登记（oj-module 的写 `from: 'frontend'`；
   预期切页的写 `split: true`）；
2. `pnpm run sync`；
3. 新分组的话在 `.vitepress/config.mts` 的 `sidebar` 加条目（切页文档引用
   `splitNav['<route>']`，链接带尾斜杠）；文档属于某个主题的话，归进「后端专题」下
   对应专栏（见 §4.1），并从原分组移除；
4. `pnpm run verify` 确认无死链、构建通过。

### 新增 sample 模块（后端）

在 `../oj-bin/sample/src/<模块>/` 丢一份 `README.md` 即可，sync 自动收录并进 sidebar。

### 源仓库文档更新后的发布

```bash
pnpm run verify      # 重新同步 + 检查 + 构建
git status           # 生成页已入库：diff 即再生成结果（含日期刷新），确认后一并提交
```

### 提交约定

- 生成产物**入库**：源仓库文档更新后 `pnpm run sync`，把再生成页面（含日期刷新）
  随脚本/配置变更一起提交；
- 提交前跑 `pnpm run verify`；
- 改动构建流程、脚本行为或踩了新坑，**同步更新本文档**。
