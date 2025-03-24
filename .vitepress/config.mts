import cjk_breaks from 'markdown-it-cjk-breaks'
import footnote_plugin from 'markdown-it-footnote'
import UnoCSS from 'unocss/vite'

import { defineConfig } from 'vitepress'

import { nav, sidebarCSS, sidebarEg, sidebarJS, sidebarNodejs, sidebarOthers, sidebarReact, sidebarTS, sidebarVue } from './theme-config'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // title: 'Keep going',
  title: ' ',
  description: 'Force yourself to make a change',
  head: [['line', { rel: 'icon', href: '/favicon.ico' }]],
  srcDir: 'src',
  lastUpdated: true,
  markdown: {
    lineNumbers: true,
    config: (md) => {
      md.use(cjk_breaks)
      md.use(footnote_plugin)
    },
  },
  vite: {
    plugins: [UnoCSS()],
    optimizeDeps: {
      exclude: ['@nolebase/vitepress-plugin-enhanced-readabilities/client'],
    },
    ssr: {
      noExternal: [
        // 如果还有别的依赖需要添加的话，并排填写和配置到这里即可
        '@nolebase/vitepress-plugin-enhanced-readabilities',
      ],
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: { light: '/logo-light.png', dark: '/logo-dark.png' },
    search: { provider: 'local' },
    nav: nav(),
    sidebar: {
      '/javascript/': { base: '/javascript/', items: sidebarJS() },
      '/typescript/': { base: '/typescript/', items: sidebarTS() },
      '/examples/': { base: '/examples/', items: sidebarEg() },
      '/css/': { base: '/css/', items: sidebarCSS() },
      '/nodejs/': { base: '/nodejs/', items: sidebarNodejs() },
      '/vue/': { base: '/vue/', items: sidebarVue() },
      '/react/': { base: '/react/', items: sidebarReact() },
      '/others/': { base: '/others/', items: sidebarOthers() },
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/ZXheart/ZXheart.github.io' }],
    footer: {
      message: 'Released under the <a href="https://github.com/ZXheart/ZXheart.github.io?tab=MIT-1-ov-file"> MIT License.</a>',
      copyright: 'Copyright © 2023-present <a href="https://github.com/ZXheart/ZXheart.github.io">julien</a>',
    },
    outline: { level: 'deep' },
  },
})
