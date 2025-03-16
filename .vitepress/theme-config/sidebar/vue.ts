import type { DefaultTheme } from 'vitepress'

export function sidebarVue(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Vue.js',
      collapsed: false,
      items: [{ text: 'get started', link: 'vue.js/01-get-started' }],
    },
    {
      text: 'Vue Router',
      collapsed: false,
      items: [
        { text: 'Getting Started', link: 'vue-router/01-getting-started' },
        { text: 'bala bala', link: 'vue-router/02-navigation-guards' },
      ],
    },
    {
      text: 'vitepress',
      collapsed: false,
      items: [
        {
          text: 'Deployment process',
          collapsed: false,
          items: [
            { text: '开始', link: 'vitepress/deployment/01-start' },
            { text: '配置', link: 'vitepress/deployment/02-configure' },
            { text: '部署', link: 'vitepress/deployment/03-deploy' },
          ],
        },
      ],
    },
  ]
}
