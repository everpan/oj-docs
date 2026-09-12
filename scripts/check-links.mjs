#!/usr/bin/env node
// 死链扫描：检查 src/**/*.md 里的站内链接目标是否真实存在。
// VitePress 的死链检测只覆盖它自己渲染出的链接，这里多扫一遍原始 markdown
// （尤其是被切分页拆散后遗留的相对路径），作为 `npm run verify` 的一道门禁。
//
// 判定与 vitepress 对齐：
// - 文件页：`/xxx` 或 `/xxx.md` 皆可（链接可不带扩展名）；
// - 目录页（切页文档的 index）：链接必须带尾斜杠 `/xxx/`，不带会被 vitepress 判死链，
//   这里提前报出来，不用等到构建期。
//
// 用法：npm run check

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(HERE, '..', 'src');

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else if (entry.name.endsWith('.md')) out.push(p);
  }
  return out;
}

const isFile = (p) => {
  try {
    return fs.statSync(p).isFile();
  } catch {
    return false;
  }
};

/**
 * 站点路由是否有效。注意不能用 existsSync 直接判 —— 目录存在不等于链接合法
 * （目录页不带尾斜杠 vitepress 照样判死链），必须按文件判定。
 */
function exists(route) {
  const clean = route.split('#')[0].split('?')[0];
  if (clean === '' || clean === '/') return true;
  const hasSlash = clean.endsWith('/');
  const base = path.join(SRC, clean.replace(/\/$/, ''));
  if (isFile(base) || isFile(`${base}.md`)) return true;
  return hasSlash && isFile(path.join(base, 'index.md'));
}

const problems = [];
const files = walk(SRC);

for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  const re = /\[[^\]]*\]\(([^)\s]+)\)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const target = m[1];
    if (/^(https?:|mailto:|#)/.test(target)) continue;
    const abs = target.startsWith('/')
      ? target
      : '/' + path.relative(SRC, path.resolve(path.dirname(file), target)).split(path.sep).join('/');
    if (exists(abs)) continue;
    // 目录页缺尾斜杠是最常见的坑，附提示
    const clean = abs.split('#')[0];
    const hint = !clean.endsWith('/') && isFile(path.join(SRC, clean, 'index.md'))
      ? '（目录页需带尾斜杠 /）'
      : '';
    problems.push(`${path.relative(SRC, file)} → ${target}${hint}`);
  }
}

if (problems.length) {
  console.error(`[check] 发现 ${problems.length} 条死链：`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(`[check] ${files.length} 篇页面，无死链。`);
