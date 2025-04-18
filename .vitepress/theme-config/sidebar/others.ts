import type { DefaultTheme } from 'vitepress'

export function sidebarOthers(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Vim',
      collapsed: false,
      items: [
        { text: 'Vim', link: 'vim/about-vim' },
        { text: 'Vim commands', link: 'vim/vim-commands' },
      ],
    },
    {
      text: 'Network',
      collapsed: false,
      items: [
        { text: 'Network', link: 'network/01-get-started' },
        { text: 'Details', link: 'network/02-details' },
        { text: 'WebSocket', link: 'network/03-websocket' },
      ],
    },
    {
      text: 'something others',
      collapsed: false,
      items: [
        { text: 'SMB', link: '01-smb' },
      ],
    },
  ]
}
