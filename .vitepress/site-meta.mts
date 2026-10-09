// 站点级元数据（备案号、版权等）。直接改这里即可，构建时注入页脚，
// 无需动 Layout.vue。

export interface SiteMeta {
  icp: {
    /** 备案号文本，显示在页脚 */
    number: string;
    /** 备案查询链接 */
    url: string;
  };
}

export const siteMeta: SiteMeta = {
  icp: {
    number: '粤ICP备2026140573号-1',
    url: 'https://beian.miit.gov.cn/',
  },
};
