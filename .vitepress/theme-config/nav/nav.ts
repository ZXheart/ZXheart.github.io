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
        { text: 'Basic', link: '/javascript/basic/01-comments', activeMatch: '/basic/' },
        { text: 'Intermediate', link: '/javascript/intermediate/intermediate', activeMatch: '/intermediate/' },
        { text: 'Advanced', link: '/javascript/advanced/01-proxy', activeMatch: '/advanced/' },
        { text: 'FunFacts', link: '/javascript/fun-facts/01-smoosh-gate', activeMatch: '/fun-facts/' },
        { text: 'Book', link: '/javascript/book/you-dont-know-js/scope&closures/01-what-is-scope', activeMatch: '/book/' },
      ],
      activeMatch: '/javascript/',
    },
    {
      text: 'Typescript',
      items: [
        { text: 'Basic', link: '/typescript/basic/01-dont-know', activeMatch: '/basic/' },
      ],
      activeMatch: '/typescript/',
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
      text: 'Vue',
      items: [
        { text: 'vue.js', link: '/vue/vue.js/01-get-started', activeMatch: '/vue.js/' },
        { text: 'vue-router', link: '/vue/vue-router/01-getting-started', activeMatch: '/vue-router/' },
        { text: 'vitepress', link: '/vue/vitepress/deployment/01-start', activeMatch: '/vitepress/' },
      ],
      activeMatch: '/vue/',
    },
    {
      text: 'React',
      items: [
        { text: 'react.js', link: '/react/react.js/01-get-started', activeMatch: '/react.js/' },
        { text: 'zustand', link: '/react/zustand/01-get-started', activeMatch: '/zustand/' },
      ],
      activeMatch: '/react/',
    },
    {
      text: 'Others',
      items: [
        { text: 'Vim', link: '/others/vim/about-vim', activeMatch: '/about-vim' },

      ],
      activeMatch: '/others/',
    },

  ]
}
