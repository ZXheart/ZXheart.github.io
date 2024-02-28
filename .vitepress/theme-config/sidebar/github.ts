import type { DefaultTheme } from 'vitepress'

export function sidebarGithub(): DefaultTheme.SidebarItem[] {
    return [
      { text: '基本使用', collapsed: false, items: [{ text: '注册', link: 'basic/register' }] },
      { text: 'Actions', collapsed: false, items: [{ text: 'Actions', link: 'actions/actions' }] },
    ]
  }