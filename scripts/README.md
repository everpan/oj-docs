# 站点脚本

两个脚本，都由根目录 `package.json` 的 npm scripts 调用：

| 脚本 | 命令 | 作用 |
|---|---|---|
| `sync-docs.mjs` | `pnpm run sync` | 把两个源仓库的文档同步进 `src/`（复制 + 切页 + 修链接 + wikilink + 注入元信息） |
| `check-links.mjs` | `pnpm run check` | 扫 `src/**/*.md` 的站内链接，报告死链（有死链 exit 1） |

`pnpm run verify` = `sync` → `check` → `build`，CI 与本地提交前都跑这个。

---

## sync-docs.mjs

### 为什么是「复制」而不是「引用」

VitePress 的页面必须落在 `srcDir`（这里是 `src/`）里。让站点直接以源仓库 `docs/` 为源会把
`docs/superpowers/`（30+ 篇长文）和 `docs/archive/` 全量收进路由与搜索，也会把 `.vitepress`
塞进文档目录。所以选择**单向复制 + 白名单**，代价是存在副本，用下面三条压住漂移：

1. **白名单 `ENTRIES`**：逐个登记文件，不递归目录（`sample/unit/node_modules/` 下有大量
   第三方 README，递归必炸）。
2. **生成页不可手改**：每页顶部有
   `<p class="gen-note">generated: <日期> · 本页由脚本从 <仓库>:<源> 同步生成…</p>`，
   改源文件后重跑 `pnpm run sync` 即可。
3. **产物入库、站点自包含**：生成页与 sidebar 数据提交进仓库，克隆即可 build，
   **不依赖源仓库**——sync 在 `../oj-bin` / `../oj-module` 缺席时自动跳过（沿用已提交
   的产物；守卫必须先于任何写入，否则空跑会写出空 sidebar 数据弄坏站点）。压漂移靠
   流程：改源文档后跑 `pnpm run sync`，提交前跑 `pnpm run verify`，把再生成页面随
   源变更一起提交（注意生成页带日期，sync 后 git diff 会显示日期变化，属正常）。

### 双数据源

| 源 | 仓库 | 取哪些 |
|---|---|---|
| backend（默认） | `../oj-bin` | `docs/`、`docs/devkit/`、`docs/modules/`、`sample/` |
| frontend | `../oj-module` | `docs/prd/`（现行手册与设计稿；个别现行文档取自 `docs/archive/prd/`） |

条目用 `from` 字段选源；生成页 banner 带 `oj-bin:` / `oj-module:` 前缀标明出处。
两个仓库的 `docs/archive/`、`docs/superpowers/` 都是历史文档，指向它们的链接统一改写到
`/appendix/history-index`（被收录的除外，路由表优先命中）。

### 收录清单怎么改

编辑脚本顶部的 `ENTRIES`，每项五个字段：

```js
{ src: 'docs/websocket.md', route: '/reference/websocket', title: 'WebSocket' }
// from: 'frontend' 时取 oj-module 源；split: true 强制切页（不写则按行数自动判定）
```

`src` 是**源仓库相对路径**；`route` 是站点路由（切页时它是目录）。新增一篇文档：

1. 在 `ENTRIES` 里登记（oj-module 的文档记得写 `from: 'frontend'`）；
2. 跑 `pnpm run sync`；
3. 若它是新分组，还要在 `.vitepress/config.mts` 的 `sidebar` 里加条目；
4. 跑 `pnpm run verify` 确认无死链。

**例外 —— sample 模块专题**：`sample/src/*/README.md` 无需登记，sync 时一层 glob 自动收录
（路由 `/sample/<目录名>`，标题取 README 首个 `# ` 行；要定制 title/route 才在 `ENTRIES`
显式登记，显式项优先）。全量模块清单（显式 + 自动）由 sync 写进
`.vitepress/generated/sidebar.mjs` 的 `sampleModules` 导出，config.mts 的「示例实战」
分组直接展开它——新增模块只丢一份 README.md，sync 后自动进站、自动上 sidebar。

不想收录但要留指路的文档，写进 `EXCLUDED` 集合（链接会被改写到 `/appendix/history-index`），
或在 `appendix/history-index.md` 里登记。

### 长文切页（两阶段判定）

- 阈值 `SPLIT_LINES = 600`（**正文行数**，去 frontmatter 后）。也可对某项显式写
  `split: true` 强制切。
- **先预读、后生成**：脚本第一阶段读入全部条目，与主流程用同一份正文数行数，定出每个
  条目「是否切页」的权威决策，据此建路由表（切页文档的路由是目录，**带尾斜杠**）；
  第二阶段才改写链接、生成页面。两阶段保证路由表与实际切页结果一致 —— 否则目录页链接
  缺尾斜杠，要到 vitepress 构建期才报死链。
- 按二级标题 `## ` 切：序言进 `<route>/index.md`，其余每节一个 `NN.md`，
  节内标题提升一级（`## ` → `# `），每页顶部有返回总览的链接。
- `index.md` 底部自动生成章节目录；切页结果写进 `.vitepress/generated/sidebar.mjs`，
  由 config 引入生成 sidebar（**不要手改该文件**）。config 里引用的 `splitNav['<route>']`
  依赖该文档确实切页 —— 长期切页的文档建议显式写 `split: true`，别只靠行数阈值。

### 顺手做的修补

| 处理 | 原因 |
|---|---|
| 代码块语言 `cli` / `bat` / `cmd` / `sh` → `bash` | shiki 不认 `cli`，会掉高亮 |
| 站内相对链接（含 `./xxx.md`）→ 站点绝对路径 | 文档搬到 `src/` 后相对层级全变了；切页后子页目录更深，相对基准必然失效 |
| wikilink `[[slug]]` / `[[slug|文本]]` → 站内链接 | 前端文档用 Obsidian 风格互链；按文件名映射到路由，解不出的退化成纯文本（代码块内不动） |
| 正文里 `<config_dir>` / `Promise<T>` 的 `<` → `&lt;` | md 会被当 Vue 模板编译，裸标签 = 未闭合元素，build 直接失败 |
| 代码（围栏块 + 行内代码）里的 `<` 不转义 | markdown-it 自己会转义；脚本再转一次就成 `&amp;lt;`，页面显示成 `&lt;`（曾线上 380 处） |
| 白名单标签需正文里有成对 `</tag>` 才算真 HTML | 否则 `<a>` 这种占位符会被当未闭合元素，build 直接失败 |
| 注入 frontmatter `title` / `generated` | 页面标题与生成日期；源文档自带 frontmatter 时做**合并**不覆盖 |

### 链接映射怎么工作

两级映射：**源相对路径 → 仓库绝对路径 → 站点路由**。

- 已在 `ENTRIES` 里的 → 改写到对应路由（切页文档带尾斜杠，指向 `index`）。
- 在 `EXCLUDED` 或 `docs/archive/`、`docs/superpowers/` 下的 → 统一指向 `/appendix/history-index`。
- 站点绝对路径（`/xxx`）、锚点、`http(s):` 外链不改写；`[[wikilink]]` 由 wikilink 规则单独处理。
- 源文档里的 `./xxx.md` 相对链接**会**被改写（切页后相对基准会变）；脚本自己生成的
  `./index.md` 返回链接在改写之后才拼接，不受影响。
- 解析不了的会**原样保留并在结尾打印清单**，人工决定补映射还是忽略。

---

## check-links.mjs

VitePress 自带的死链检测只覆盖它渲染出的链接，且不校验被切页拆散后的残留相对路径。
这个脚本直接扫 `src/**/*.md` 的 markdown 源码，**判定与 vitepress 对齐**：

- 跳过 `http(s):`、`mailto:`、纯锚点；
- 文件页按 `src/xxx`、`src/xxx.md` 判定（链接可不带扩展名）；
- 目录页按 `src/xxx/index.md` 判定，且**要求链接带尾斜杠 `/xxx/`** —— 不带会被
  vitepress 判死链，这里提前报出来并附「目录页需带尾斜杠」提示；
- 相对链接按文件所在目录解析成绝对路由后同样判定；
- 有缺失就打印 `文件 → 目标（提示）` 并 **exit 1**。

---

## 常见报错

| 报错 | 处理 |
|---|---|
| `Element is missing end tag` | 有裸 `<...>` 逃过了转义：它一定在正文里（行内代码与围栏块都不转义），且要么不在 `HTML_OK`，要么是白名单标签但正文里没有成对的 `</tag>`；给源文档的占位符补上反引号是首选修法，其次才考虑加白名单 |
| `Found dead link /reference/xxx` | 该文档被切页了，链接要带尾斜杠；或在 `ENTRIES` 补映射 |
| `Found dead link http://localhost:...` | 示例命令里的本地地址，config 的 `ignoreDeadLinks` 已放行 |
| `[sync] 缺失：<src>` | `ENTRIES` 里的源路径写错或文件已删除 |
| 页面出现裸 `[[slug]]` 残留 | wikilink 未收录：把对应文档登记进 `ENTRIES`，或接受其退化为纯文本 |
