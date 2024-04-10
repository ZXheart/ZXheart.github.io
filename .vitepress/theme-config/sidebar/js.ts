import type { DefaultTheme } from 'vitepress'

export function sidebarJS(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Basic',
      collapsed: false,
      items: [
        { text: '注释', link: 'basic/01-comments' },
        { text: '逻辑运算符', link: 'basic/02-logical-operators' },
        { text: '空值合并运算符', link: 'basic/03-nullish-coalescing-operator' },
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
      items: [
        { text: 'proxy', link: 'advanced/01-proxy' },
        { text: 'extend-es5', link: 'advanced/02-extend-es5' },
        { text: 'this', link: 'advanced/03-this' },
      ],
    },
  ]
}
