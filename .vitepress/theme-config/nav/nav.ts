import type { DefaultTheme } from 'vitepress'

export function nav(): DefaultTheme.NavItem[] {
  return [
    {
      text: 'Examples',
      link: '/examples/markdown-examples',
      activeMatch: '/examples/',
    },
    {
      text: 'Javascript',
      items: [
        { text: 'Basic', link: '/javascript/basic/grammar-and-types', activeMatch: '/basic/' },
        { text: 'Intermediate', link: '/javascript/intermediate/intermediate', activeMatch: '/intermediate/' },
        { text: 'Advanced', link: '/javascript/advanced/advanced', activeMatch: '/advanced/' },
      ],
      activeMatch: '/javascript/',
    },
    {
      text: 'Github',
      items: [
        { text: 'Github register', link: '/github/basic/register', activeMatch: '/basic/' },
        { text: 'Github actions', link: '/github/actions/actions', activeMatch: '/actions/' },
      ],
      activeMatch: '/github/',
    },
    {
      text: 'VitePress',
      items: [{ text: 'Deployment process', link: '/vite-press/deployment/01-start', activeMatch: '/deployment/' }],
      activeMatch: '/vite-press/',
    },
    {
      text: 'CSS',
      items: [
        { text: 'Grid layout', link: '/css/grid-layout/01-concepts', activeMatch: '/grid-layout/' },
        { text: 'Flex box', link: '/css/flex-box/01-concepts', activeMatch: '/flex-box/' },
      ],
      activeMatch: '/css/',
    },
    {
      text: 'Node.js',
      items: [
        { text: 'Basic', link: '/nodejs/basic/01-concepts', activeMatch: '/basic/' },
        { text: 'Express', link: '/nodejs/express/01-concepts', activeMatch: '/express/' },
        { text: 'Koa', link: '/nodejs/koa/01-concepts', activeMatch: '/koa/' },
      ],
      activeMatch: '/nodejs/',
    },
    {
      text: 'Vue Router',
      link: '/vue-router/essentials/01-getting-started',
      activeMatch: '/vue-router/',
    },
  ]
}
