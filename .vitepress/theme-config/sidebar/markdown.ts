import type { DefaultTheme } from 'vitepress'

export function sidebarEg(): DefaultTheme.SidebarItem[] {
  return [
    { text: 'Markdown Examples', link: 'markdown-examples' },
    { text: 'API Examples', link: 'api-examples' },
  ]
}
