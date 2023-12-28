import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Keep going',
  description: 'Force myself to make a change',
  head: [['line', { rel: 'icon', href: '/favicon.ico' }]],
  srcDir: 'src',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/favicon.ico',
    search: { provider: 'local' },
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'Examples',
        link: '/examples/markdown-examples',
        activeMatch: '/examples/',
      },
      {
        text: 'Javascript',
        link: '/javascript/basic/grammar-and-types',
        activeMatch: '/javascript/',
      },
    ],
    sidebar: {
      '/javascript/': [
        {
          text: 'Reference',
          items: [
            {
              text: 'Basic',
              collapsed: true,
              items: [
                {
                  text: 'Grammar and types',
                  link: '/javascript/basic/grammar-and-types',
                },
                { text: 'Object', link: '/javascript/basic/object' },
              ],
            },
            { text: 'Intermediate', link: '/javascript/intermediate' },
            { text: 'Advanced', link: '/javascript/advanced' },
          ],
        },
      ],
      '/examples/': [
        {
          text: 'Examples Reference',
          items: [
            { text: 'Markdown Examples', link: '/examples/markdown-examples' },
            { text: 'API Examples', link: '/examples/api-examples' },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],
  },
  vite: {},
})
