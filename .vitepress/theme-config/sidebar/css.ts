import type { DefaultTheme } from 'vitepress'

export function sidebarCSS(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Grid layout',
      collapsed: false,
      items: [{ text: '网格布局概念', link: 'grid-layout/01-concepts' }],
    },
    {
      text: 'Flex box',
      collapsed: false,
      items: [{ text: '弹性盒布局概念', link: 'flex-box/01-concepts' }],
    },
  ]
}
