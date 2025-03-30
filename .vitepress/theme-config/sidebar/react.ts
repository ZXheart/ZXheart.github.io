import type { DefaultTheme } from 'vitepress'

export function sidebarReact(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'React.js',
      collapsed: false,
      items: [
        { text: 'get started', link: 'react.js/01-get-started' },
        { text: 'Hooks', link: 'react.js/02-hooks' },
      ],
    },
    {
      text: 'zustand',
      collapsed: false,
      items: [
        { text: 'Get Started', link: 'zustand/01-get-started' },
      ],
    },
    {
      text: 'redux',
      collapsed: false,
      items: [
        { text: 'Get Started', link: 'redux/01-get-started' },
        { text: 'Go on', link: 'redux/02-go-on' },
      ],
    },

  ]
}
