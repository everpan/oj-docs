<script setup lang="ts">
import { ref, onMounted } from 'vue';
import DefaultTheme from 'vitepress/theme';
import { siteMeta } from '../site-meta.mts';

const { Layout } = DefaultTheme;

// 构建期兜底值；运行时优先用 public/beian.json 覆盖，改号只需替换该文件。
const icp = ref(siteMeta.icp);

onMounted(async () => {
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}beian.json`, { cache: 'no-cache' });
    if (!res.ok) return;
    const data = (await res.json()) as { icp?: { number?: string; url?: string } };
    if (data?.icp?.number) icp.value = { number: data.icp.number, url: data.icp.url ?? siteMeta.icp.url };
  } catch {
    /* 忽略：保留兜底值 */
  }
});
</script>

<template>
  <Layout>
    <!-- 默认主题的 footer 在带侧边栏的页面被 CSS 隐藏，备案号走 layout-bottom
         插槽独立渲染，保证首页与文档页都可见。备案号运行时从 beian.json 读取。 -->
    <template #layout-bottom>
      <footer class="IcpFooter">
        <a :href="icp.url" target="_blank" rel="noopener">{{ icp.number }}</a>
      </footer>
    </template>
  </Layout>
</template>
