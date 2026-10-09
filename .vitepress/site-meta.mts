// 站点级元数据兜底默认值。运行时页脚会优先读取 public/beian.json 覆盖此处；
// 本文件仅作为构建期兜底，保证 SSR / 首屏在 beian.json 缺失时不为空。
// 真正要改备案号，编辑 public/beian.json 并重新部署该文件即可，不必整站重建。

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
