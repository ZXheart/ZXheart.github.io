import type { DefaultTheme } from 'vitepress'

export function sidebarJS(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Basic',
      collapsed: false,
      items: [
        { text: 'Grammar and types', link: 'basic/grammar-and-types' },
        { text: 'Object', link: 'basic/object' },
      ],
    },
    {
      text: 'Intermediate',
      collapsed: false,
      items: [{ text: 'medium', link: 'intermediate/intermediate' }],
    },
    {
      text: 'Advanced',
      collapsed: false,
      items: [{ text: 'high', link: 'advanced/advanced' }],
    },
  ]
}