import type { DefaultTheme } from 'vitepress'

export function sidebarVitePress(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Deployment process',
      collapsed: false,
      items: [
        { text: '开始', link: 'deployment/01-start' },
        { text: '配置', link: 'deployment/02-configure' },
        { text: '部署', link: 'deployment/03-deploy' },
      ],
    },
  ]
}
