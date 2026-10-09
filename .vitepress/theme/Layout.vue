<script setup lang="ts">
import DefaultTheme from 'vitepress/theme';
import { siteMeta } from '../site-meta.mts';

const { Layout } = DefaultTheme;
</script>

<template>
  <Layout>
    <!-- 默认主题的 footer 在带侧边栏的页面被 CSS 隐藏，备案号走 layout-bottom
         插槽独立渲染，保证首页与文档页都可见。备案号来自 site-meta.mts。 -->
    <template #layout-bottom>
      <footer class="IcpFooter">
        <a :href="siteMeta.icp.url" target="_blank" rel="noopener">{{ siteMeta.icp.number }}</a>
      </footer>
    </template>
  </Layout>
</template>
