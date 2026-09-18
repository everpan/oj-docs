<script setup lang="ts">
import DefaultTheme from 'vitepress/theme';

const { Layout } = DefaultTheme;
</script>

<template>
  <Layout>
    <!-- 默认主题的 footer 在带侧边栏的页面被 CSS 隐藏，备案号走 layout-bottom
         插槽独立渲染，保证首页与文档页都可见。 -->
    <template #layout-bottom>
      <footer class="IcpFooter">
        <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">粤ICP备2026140573号-1</a>
      </footer>
    </template>
  </Layout>
</template>
