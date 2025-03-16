import type { DefaultTheme } from 'vitepress'

export function sidebarTS(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'typescript',
      collapsed: false,
      items: [{ text: 'get started', link: 'basic/01-dont-know' }],
    },
  ]
}
