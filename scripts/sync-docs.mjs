#!/usr/bin/env node
// 把两个源仓库的权威文档同步进 VitePress 站点（src/）：
// 后端 oj-bin（docs/、sample/）与前端框架 oj-module（docs/prd/）。
//
// 设计要点：
// - 白名单显式登记（ENTRIES），绝不递归目录 —— sample/unit/node_modules 下有大量第三方 README。
// - 超长文档（> SPLIT_LINES 行）按二级标题切分成目录 + 子页，sidebar 数据一并生成。
// - 切页判定两阶段：先预读全部条目、按同一份正文数行数、建好路由表（切页文档路由是目录，
//   带尾斜杠），再进入生成 —— 保证链接改写与实际切页一致，避免目录页缺尾斜杠在构建期报死链。
// - 内部相对链接（含 ./xxx.md）按「源相对路径 → 仓库绝对路径 → 站点路由」两级映射，
//   统一改成站点绝对路径；前端文档的 [[slug]] / [[slug|文本]] wikilink 按文件名映射转站内链接，
//   解不出的退化成纯文本。
// - 生成物头部写明来源（含仓库前缀）；禁止手改 src/ 下的生成页，要改就改源文件再跑 `npm run sync`。
//
// 用法：npm run sync

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(HERE, '..'); // 本站点根（oj-docs / vitepress）
// 双源：后端（oj-bin）与前端框架（oj-module）。ENTRIES 用 `from` 指定取哪个源。
const SRCROOT_BACKEND = path.resolve(SITE, '..', 'oj-bin');
const SRCROOT_FRONTEND = path.resolve(SITE, '..', 'oj-module');
const SRCROOTS = { backend: SRCROOT_BACKEND, frontend: SRCROOT_FRONTEND };
const SRC = path.join(SITE, 'src');

// 站点自包含：生成产物已入库，build/dev 不得依赖外部源仓库。
// 任一源仓库缺席时跳过整个同步（沿用已提交的产物）——若继续空跑，会写出空的
// sidebar 数据并覆盖已提交版本，直接弄坏站点。守卫必须放在任何写入之前。
{
  const missing = Object.entries(SRCROOTS).filter(([, root]) => !fs.existsSync(root));
  if (missing.length) {
    console.warn(
      `[sync] 源仓库缺失，跳过同步（沿用已提交的生成产物）：\n` +
        missing.map(([name, root]) => `  - ${name}: ${root}`).join('\n')
    );
    process.exit(0);
  }
}

/** 超过这个行数就按 `## ` 切页。 */
const SPLIT_LINES = 600;

/**
 * 收录清单。字段：
 * - src：源仓库相对路径（配合 from 解析到 oj-bin / oj-module）
 * - route：站点路由（切页时该路由是目录）
 * - from：'backend'（默认，oj-bin）| 'frontend'（oj-module）
 * - split：true 强制切页；不写则正文超过 SPLIT_LINES 行时自动切
 */
const ENTRIES = [
  // ---- 参考（docs/ 顶层，描述当前实现）----
  { src: 'docs/dev-guide.md', route: '/reference/dev-guide', title: '开发指南', split: true },
  { src: 'docs/user-manual.md', route: '/reference/user-manual', title: '用户手册', split: true },
  { src: 'docs/db-guide.md', route: '/reference/db-guide', title: 'db 新人手册', split: true },
  { src: 'docs/tenant-guide.md', route: '/reference/tenant-guide', title: '多租户新手指南' },
  { src: 'docs/ops-manual.md', route: '/reference/ops-manual', title: '运维手册' },
  { src: 'docs/testing.md', route: '/reference/testing', title: '测试手册' },
  { src: 'docs/migration.md', route: '/reference/migration', title: '数据迁移' },
  { src: 'docs/bridge.md', route: '/reference/bridge', title: 'bridge 与全局对象' },
  { src: 'docs/websocket.md', route: '/reference/websocket', title: 'WebSocket' },
  { src: 'docs/mq-tasks.md', route: '/reference/mq-tasks', title: 'MQ 与长任务' },
  { src: 'docs/mail-smtp.md', route: '/reference/mail-smtp', title: '邮件投递（SMTP）' },

  // ---- 设计与实施记录（docs/plans/，已落地特性的过程记录，随专题专栏提供）----
  // impl 是长文档且被 config 的 splitNav 引用，显式 split。
  { src: 'docs/plans/2026-09-15-mail-smtp-design.md', route: '/reference/mail-smtp-design', title: '邮件投递 · 设计记录' },
  { src: 'docs/plans/2026-09-15-mail-smtp-impl.md', route: '/reference/mail-smtp-impl', title: '邮件投递 · 实施记录', split: true },
  { src: 'docs/oidc-integration.md', route: '/reference/oidc-integration', title: 'OIDC 接入' },
  { src: 'docs/oidc-implementation.md', route: '/reference/oidc-implementation', title: 'OIDC 实现' },
  { src: 'docs/plugin-development.md', route: '/reference/plugin-development', title: '插件开发' },
  { src: 'docs/benchmarks.md', route: '/reference/benchmarks', title: '基准测试' },
  { src: 'docs/builtin-api-auth.md', route: '/reference/builtin-api-auth', title: '内置 API 与鉴权' },

  // ---- JS 业务开发者手册（devkit，随发行包交付）----
  { src: 'docs/devkit/api-manual.md', route: '/reference/api-manual', title: 'JS API 手册', split: true },
  { src: 'docs/devkit/SKILL.md', route: '/reference/devkit-skill', title: 'oj 开发 skill' },

  // ---- 模块地图（维护者视角）----
  { src: 'docs/modules/README.md', route: '/modules/index', title: '模块地图' },
  { src: 'docs/modules/00-overview.md', route: '/modules/00-overview', title: '00 · 总览' },
  { src: 'docs/modules/01-core-bridge.md', route: '/modules/01-core-bridge', title: '01 · 核心运行时' },
  { src: 'docs/modules/02-config.md', route: '/modules/02-config', title: '02 · 配置模型' },
  { src: 'docs/modules/03-server-http.md', route: '/modules/03-server-http', title: '03 · HTTP 服务' },
  { src: 'docs/modules/04-oj-cli.md', route: '/modules/04-oj-cli', title: '04 · CLI 与装配' },
  { src: 'docs/modules/05-ffi-and-plugins.md', route: '/modules/05-ffi-and-plugins', title: '05 · FFI 与插件' },
  { src: 'docs/modules/06-toolchain.md', route: '/modules/06-toolchain', title: '06 · 工具链' },
  { src: 'docs/modules/07-data-layer.md', route: '/modules/07-data-layer', title: '07 · 模块数据层' },
  { src: 'docs/modules/08-testing.md', route: '/modules/08-testing', title: '08 · 测试体系' },

  // ---- 前端框架（oj-module，docs/prd 为现行；docs/archive 多为历史）----
  { src: 'docs/prd/framework-development-guide.md', route: '/frontend/framework-dev-guide', title: '框架开发手册', from: 'frontend', split: true },
  { src: 'docs/prd/ojm-api-codegen-guide.md', route: '/frontend/api-codegen', title: 'API 契约代码生成', from: 'frontend' },
  { src: 'docs/prd/oj-fullstack-tutorial.md', route: '/frontend/fullstack-tutorial', title: '全栈实战演练', from: 'frontend', split: true },
  { src: 'docs/prd/framework-verification-playbook.md', route: '/frontend/verification-playbook', title: '端到端验证手册', from: 'frontend' },
  { src: 'docs/prd/oj-release-binary-defect-report.md', route: '/frontend/release-defect-report', title: '发布二进制缺陷报告', from: 'frontend' },
  // 业务模块作者手册：被 framework-dev-guide 引用，现行有效，故从 archive 收录。
  // split: true —— 长文档，且 config 的 splitNav 依赖其切页结构，显式声明不靠行数阈值。
  { src: 'docs/archive/prd/module-development-guide.md', route: '/frontend/module-dev-guide', title: '业务模块开发手册', from: 'frontend', split: true },
  // 设计决策（已确认的设计稿，按日期命名，独立成组）
  // 同上：config 的 splitNav 引用其切页结构，显式 split。
  { src: 'docs/prd/202609110947-oj-module-two-package-consolidation-design.md', route: '/frontend/design/two-package-consolidation', title: '双包整合与改名', from: 'frontend', split: true },
  { src: 'docs/prd/202609111926-vendor-npm-install-design.md', route: '/frontend/design/vendor-npm-install', title: 'vendor npm 改造', from: 'frontend' },
  { src: 'docs/prd/202609112006-init-template-personal-center-design.md', route: '/frontend/design/init-template', title: 'init 模板补全', from: 'frontend' },
  { src: 'docs/prd/202609112324-web-layout-and-codegen-guide-design.md', route: '/frontend/design/web-layout-codegen', title: 'web 布局改名', from: 'frontend' },

  // ---- sample 实战导览 ----
  { src: 'sample/README.md', route: '/sample/index', title: 'sample 项目' },
  { src: 'sample/MODULES.md', route: '/sample/modules-tour', title: 'sample 模块导览' },
  { src: 'sample/src/auth/README.md', route: '/sample/auth', title: 'auth 模块' },
  { src: 'sample/src/auth_demo/README.md', route: '/sample/auth-demo', title: 'auth_demo 模块' },
  { src: 'sample/src/upload/README.md', route: '/sample/upload', title: 'upload 模块' },
  { src: 'sample/src/idp/README.md', route: '/sample/idp', title: 'idp 模块（内置 OP）' },
  { src: 'sample/src/oidc/README.md', route: '/sample/oidc', title: 'oidc 模块（RP）' },
];

// ---- sample 模块专题：sample/src/*/README.md 自动收录（一层 glob，不递归）----
// 上面显式登记的优先（可定制 title/route）；未登记的按目录名补默认项，
// title 取 README 首个 `# ` 标题。新增模块只丢一份 README.md 即自动进站。
{
  const sampleSrc = path.join(SRCROOT_BACKEND, 'sample', 'src');
  const listed = new Set(ENTRIES.map((e) => e.src));
  const auto = [];
  for (const d of fs.readdirSync(sampleSrc, { withFileTypes: true })) {
    if (!d.isDirectory() || d.name.startsWith('.') || d.name.startsWith('_')) continue;
    const rel = `sample/src/${d.name}/README.md`;
    if (listed.has(rel) || !fs.existsSync(path.join(sampleSrc, d.name, 'README.md'))) continue;
    const h1 = fs.readFileSync(path.join(SRCROOT_BACKEND, rel), 'utf8').match(/^#\s+(.+)$/m);
    auto.push({ src: rel, route: `/sample/${d.name}`, title: h1 ? h1[1].trim() : `${d.name} 模块` });
  }
  auto.sort((a, b) => a.src.localeCompare(b.src));
  ENTRIES.push(...auto);
}

/** 未收录文档：指向「历史与未收录文档索引」。 */
const EXCLUDED = new Set([
  'docs/review-2026-09-02.md',
  'docs/review-2026-09-06.md',
  'docs/route-params-design.md',
  'docs/plugin-architecture.md',
  'docs/cli2.md',
]);

// ---------------------------------------------------------------- 工具

const toPosix = (p) => p.split(path.sep).join('/');

/** 解析 markdown 里相对链接（相对源文件目录）→ 站点路由；解析不了返回 null。 */
function resolveLink(srcFile, target) {
  const clean = target.split('#')[0];
  if (clean === '') return null; // 纯锚点
  const abs = toPosix(path.posix.normalize(path.posix.join(path.posix.dirname(srcFile), decodeURIComponent(clean))));
  if (ROUTES.has(abs)) return ROUTES.get(abs);
  if (EXCLUDED.has(abs) || abs.startsWith('docs/archive/') || abs.startsWith('docs/superpowers/')) {
    return '/appendix/history-index';
  }
  return null;
}

/** 合并 frontmatter：已有键保留，title 由清单决定。 */
function splitFrontmatter(text) {
  if (!text.startsWith('---\n')) return [{}, text];
  const end = text.indexOf('\n---\n', 4);
  if (end === -1) return [{}, text];
  const raw = text.slice(4, end + 1);
  const body = text.slice(end + 5);
  const fm = {};
  for (const line of raw.split('\n')) {
    const m = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line);
    if (m) fm[m[1]] = m[2].trim();
  }
  return [fm, body];
}

function toFrontmatter(obj) {
  const lines = ['---'];
  for (const [k, v] of Object.entries(obj)) lines.push(`${k}: ${v}`);
  lines.push('---');
  return lines.join('\n');
}

/** 统一代码块语言（sh/cli/bat/cmd → bash，shiki 不认 cli）。 */
function normalizeCodeFences(text) {
  return text.replace(/^```(cli|bat|cmd|sh)\s*$/gm, '```bash');
}

/**
 * VitePress 把 md 当 Vue 模板编译，正文里的 `<Uint8Array>`、`<config_dir>` 这类
 * 「看起来像标签」的占位符会被当成未闭合元素，直接让 build 失败。这里在正文里把
 * 非白名单标签的 `<` 转义掉（白名单里的真 HTML 标签原样保留）。
 *
 * 代码（围栏块与**行内代码**）一律不碰：markdown-it 会把代码里的 `<` 自己转义成 `&lt;`，
 * 脚本若提前转义，markdown-it 会再转一次变成 `&amp;lt;`，页面上就显示成 `&lt;`
 * （早期只跳过围栏块，线上曾有 380 处这种字样）。
 *
 * 白名单标签还要满足「正文里确实有 `</tag>`」才算真 HTML：源文档里 `未知轴 '<a>'`
 * 这种裸占位符命中白名单（`a` 是合法标签），会被当成未闭合的 `<a>` 元素让 build 失败。
 */
const HTML_OK = new Set([
  '!--', '!doctype', 'br', 'hr', 'img', 'div', 'span', 'p', 'a', 'ul', 'ol', 'li',
  'table', 'thead', 'tbody', 'tr', 'td', 'th', 'details', 'summary', 'b', 'i', 'em',
  'strong', 'code', 'pre', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'center', 'small', 'kbd', 'sup', 'u', 's', 'template', 'style', 'script',
]);

/** 自闭合/声明类标签：本来就没有闭合标签，白名单命中即原样保留。 */
const HTML_VOID = new Set(['!--', '!doctype', 'br', 'hr', 'img']);

/** 行内代码：`` `x` `` / `` ``x`` ``。与围栏块一样，交给 markdown-it 处理。 */
const INLINE_CODE = /`+[^`]*`+/g;

function escapeBareTags(text) {
  const lines = text.split('\n');

  // 第一遍：收集正文里真正闭合的标签名（行内代码里的不算数）。
  const closed = new Set();
  let fence = false;
  for (const line of lines) {
    if (/^\s*(```|~~~)/.test(line)) {
      fence = !fence;
      continue;
    }
    if (fence) continue;
    for (const m of line.replace(INLINE_CODE, '').matchAll(/<\/([A-Za-z][A-Za-z0-9-]*)\s*>/g)) {
      closed.add(m[1].toLowerCase());
    }
  }

  // 第二遍：行内代码整段原样返回，只有正文里的标签参与判定与转义。
  fence = false;
  return lines
    .map((line) => {
      if (/^\s*(```|~~~)/.test(line)) {
        fence = !fence;
        return line;
      }
      if (fence) return line;
      return line.replace(/(`+[^`]*`+)|<([A-Za-z!/][A-Za-z0-9!-]*)/g, (all, code, name) => {
        if (code !== undefined) return all;
        const bare = name.toLowerCase().replace(/^\//, ''); // `/summary` → `summary`
        return HTML_OK.has(bare) && (HTML_VOID.has(bare) || closed.has(bare)) ? all : `&lt;${name}`;
      });
    })
    .join('\n');
}

/** 重写正文里的 markdown 链接与图片。 */
function rewriteLinks(text, srcFile, report) {
  return text.replace(/(\[[^\]]*\]\()([^)\s]+)(\))/g, (all, open, target, close) => {
    // 站点绝对路径（/xxx）、锚点、外链是脚本或作者已有的，不再改写；
    // 注意：源文档里的 `./xxx.md` 相对链接要改写（切分页后相对基准会变），
    // 脚本自己生成的 `./index.md` 自链在调用本函数之后才拼接，不受影响。
    if (/^(https?:|mailto:|#|\/)/.test(target)) return all;
    const resolved = resolveLink(srcFile, target);
    if (resolved) return `${open}${resolved}${close}`;
    report.push({ srcFile, target });
    return all;
  });
}

/**
 * 把 `[[slug]]` / `[[slug|文本]]` 形式的 wikilink 转成站内链接（基于 WIKIS 映射）。
 * 代码块内不处理；解不出的退化成纯文本（slug 或 `|` 后的别名），避免页面出现裸括号或死链。
 */
function rewriteWiki(text) {
  let fence = false;
  return text
    .split('\n')
    .map((line) => {
      if (/^\s*(```|~~~)/.test(line)) {
        fence = !fence;
        return line;
      }
      if (fence) return line;
      return line.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (all, slug, label) => {
        const route = WIKIS.get(slug.trim());
        // 解出的转站内链接；解不出的退化成纯文本（slug 或 `|` 后的别名），避免页面出现裸括号。
        return route ? `[${label ? label.trim() : slug.trim()}](${route})` : (label ? label.trim() : slug.trim());
      });
    })
    .join('\n');
}

/** 按二级标题切片；返回 [{title, body}]，首片为序言（可能为空）。 */
function splitSections(body) {
  const lines = body.split('\n');
  const out = [];
  let cur = { title: null, lines: [] };
  for (const line of lines) {
    if (/^## /.test(line)) {
      out.push(cur);
      cur = { title: line.slice(3).trim(), lines: [] };
    } else {
      cur.lines.push(line);
    }
  }
  out.push(cur);
  return out;
}

/** 切片内标题提升一级：`# ` → `## `、`## ` → `### `（子页已有 H1）。 */
function promoteHeadings(text) {
  return text.replace(/^(#{1,5}) /gm, (_, h) => `${'#'.repeat(Math.min(h.length + 1, 6))} `);
}

/** 生成日期（YYYY-MM-DD）：写进每个生成页，便于读者判断新旧。 */
const TODAY = new Date().toISOString().slice(0, 10);

/**
 * 页面顶部可见的来源说明（含生成日期），小字号呈现 —— 见 .vitepress/theme/style.css
 * 的 `.gen-note`。用 `<p>` 而非 markdown：HTML 块内的 markdown 不会再被解析。
 * repo 标出来源仓库（backend=oj-bin / frontend=oj-module），便于区分双源。
 */
const note = (src, repo) =>
  `<p class="gen-note">generated: ${TODAY} · 本页由脚本从 ${repo}:${src} 同步生成，` +
  `修改请改源文件后运行 npm run sync。</p>\n\n`;

const banner = (src, repo) =>
  `<!-- 由 scripts/sync-docs.mjs 于 ${TODAY} 从 \`${repo}:${src}\` 生成，请勿直接编辑；` +
  `改源文件后运行 \`npm run sync\` -->\n`;

// ---------------------------------------------------------------- 预读与路由表（两阶段）

/**
 * 第一阶段：读入全部条目，产出每个条目「是否切页」的权威决策。
 * 路由表（ROUTES / WIKIS）要在改写任何链接之前建好，而切页与否决定路由带不带尾斜杠。
 * 这里的行数必须与主流程用同一份正文来数（去 frontmatter + 代码块语言归一 + 裸标签转义；
 * wikilink 改写不改变行数，放到第二阶段做），否则路由表与实际切页不一致 → 构建期死链。
 * 注意：这段必须放在工具函数的 const（如 HTML_OK）初始化之后 —— 函数声明会提升，const 不会。
 */
const PROCESSED = new Map(); // src → { fm, prepped, doSplit }
for (const e of ENTRIES) {
  const abs = path.join(SRCROOTS[e.from ?? 'backend'], e.src);
  if (!fs.existsSync(abs)) {
    console.warn(`[sync] 缺失：${e.src}`);
    continue;
  }
  const [fm, bodyRaw] = splitFrontmatter(fs.readFileSync(abs, 'utf8'));
  const prepped = escapeBareTags(normalizeCodeFences(bodyRaw));
  PROCESSED.set(e.src, {
    fm,
    prepped,
    doSplit: e.split === true || prepped.split('\n').length > SPLIT_LINES,
  });
}

/** 仓库相对路径 → 站点路由（切分文档指向目录，带尾斜杠）。 */
const ROUTES = new Map();

/**
 * wikilink 文件名 stem → 站点路由。前端文档大量使用 `[[slug]]` / `[[slug|文本]]`，
 * 这里按「文件名去扩展名」建立 slug 映射，能解析的就转成站内链接。
 */
const WIKIS = new Map();

for (const e of ENTRIES) {
  const p = PROCESSED.get(e.src);
  if (!p) continue; // 预读阶段已告警缺失
  const route = p.doSplit ? `${e.route}/` : e.route;
  ROUTES.set(e.src, route);
  const stem = e.src.replace(/\.md$/i, '').split('/').pop();
  if (stem) WIKIS.set(stem, route);
}

// ---------------------------------------------------------------- 主流程

const unresolved = [];
/** 切分文档的 sidebar 数据：route → [{text, link}] */
const splitNav = {};

for (const e of ENTRIES) {
  const p = PROCESSED.get(e.src);
  if (!p) continue; // 预读阶段已告警缺失
  const repo = e.from === 'frontend' ? 'oj-module' : 'oj-bin';
  const existingFm = p.fm;
  // 第二阶段：WIKIS 此时已建好，才做 wikilink 改写（不改变行数，切页决策已在预读阶段定下）。
  const body = rewriteWiki(p.prepped);
  const doSplit = p.doSplit;

  if (!doSplit) {
    const text = rewriteLinks(body, e.src, unresolved);
    const fm = { ...existingFm, title: e.title, generated: TODAY };
    const out = path.join(SRC, `${e.route}.md`);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(
      out,
      `${banner(e.src, repo)}\n${toFrontmatter(fm)}\n\n${note(e.src, repo)}\n${text.trim()}\n`
    );
    continue;
  }

  // 切分页：目录 + index.md + NN.md
  const sections = splitSections(body);
  const preamble = sections[0].lines.join('\n').trim();
  const parts = sections.slice(1).filter((s) => s.lines.join('\n').trim() !== '');
  const dir = path.join(SRC, e.route);
  fs.mkdirSync(dir, { recursive: true });

  const items = [];
  parts.forEach((s, i) => {
    const n = String(i + 1).padStart(2, '0');
    const file = `${n}.md`;
    items.push({ text: s.title, link: `${e.route}/${n}` });
    let text = rewriteLinks(promoteHeadings(s.lines.join('\n')), e.src, unresolved);
    text = `[← 返回《${e.title}》](./index.md)\n\n# ${s.title}\n\n${text.trim()}\n`;
    fs.writeFileSync(
      path.join(dir, file),
      `${banner(e.src, repo)}\n${toFrontmatter({ title: s.title, generated: TODAY })}\n\n${note(e.src, repo)}${text}\n`
    );
  });

  const toc = items.map((it) => `- [${it.text}](${it.link})`).join('\n');
  const index = [
    preamble,
    '',
    '## 章节',
    '',
    toc,
  ].join('\n');
  const fm = { ...existingFm, title: e.title, generated: TODAY };
  fs.writeFileSync(
    path.join(dir, 'index.md'),
    `${banner(e.src, repo)}\n${toFrontmatter(fm)}\n\n${note(e.src, repo)}${rewriteLinks(index, e.src, unresolved).trim()}\n`
  );
  splitNav[e.route] = items;
  console.log(`[sync] 切分 ${e.src} → ${e.route}/（${items.length} 页）`);
}

// 生成 sidebar 数据（供 .vitepress/config.mts 引入）
const genDir = path.join(SITE, '.vitepress', 'generated');
fs.mkdirSync(genDir, { recursive: true });
// 模块专题侧边栏：全部模块 README 条目（显式 + 自动），供 config.mts 展开。
const sampleModules = ENTRIES
  .filter((e) => /^sample\/src\/[^/]+\/README\.md$/.test(e.src))
  .map((e) => ({ text: e.title, link: e.route }));
fs.writeFileSync(
  path.join(genDir, 'sidebar.mjs'),
  `// 由 scripts/sync-docs.mjs 生成，勿手改\nexport const splitNav = ${JSON.stringify(splitNav, null, 2)};\n` +
    `export const sampleModules = ${JSON.stringify(sampleModules, null, 2)};\n`
);

if (unresolved.length) {
  console.warn(`\n[sync] 未解析链接 ${unresolved.length} 条（需补映射或已在正文里是纯文本）：`);
  for (const u of unresolved) console.warn(`  - ${u.srcFile}: ${u.target}`);
}
console.log(`[sync] 完成，共 ${ENTRIES.length} 篇。`);
