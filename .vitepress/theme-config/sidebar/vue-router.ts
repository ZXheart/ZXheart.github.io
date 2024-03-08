import type { DefaultTheme } from 'vitepress'

export function sidebarVueRouter(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Essential',
      collapsed: false,
      items: [{ text: 'Getting Started', link: 'essentials/01-getting-started' }],
    },
    {
      text: 'Advanced',
      collapsed: false,
      items: [{ text: 'Navigation guards', link: 'advanced/02-navigation-guards' }],
    },
  ]
}
