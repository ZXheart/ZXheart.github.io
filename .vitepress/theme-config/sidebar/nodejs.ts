import type { DefaultTheme } from 'vitepress'

export function sidebarNodejs(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Node.js Basic',
      collapsed: false,
      items: [{ text: '开始', link: 'basic/01-concepts' }],
    },
    {
      text: 'Express',
      collapsed: false,
      items: [{ text: '开始', link: 'express/01-concepts' }],
    },
    {
      text: 'Koa',
      collapsed: false,
      items: [{ text: '开始', link: 'koa/01-concepts' }],
    },
  ]
}
