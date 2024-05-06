import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vitepress'

import cjk_breaks from 'markdown-it-cjk-breaks'

import {
  nav,
  sidebarCSS,
  sidebarEg,
  sidebarGithub,
  sidebarJS,
  sidebarNodejs,
  sidebarVitePress,
  sidebarVueRouter,
} from './theme-config'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Keep going',
  description: 'Force yourself to make a change',
  head: [['line', { rel: 'icon', href: '/favicon.ico' }]],
  srcDir: 'src',
  lastUpdated: true,
  markdown: {
    lineNumbers: true,
    config: md => md.use(cjk_breaks),
  },
  vite: {
    plugins: [UnoCSS()],
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: { light: '/logo-light.png', dark: '/logo-dark.png' },
    search: { provider: 'local' },
    nav: nav(),
    sidebar: {
      '/javascript/': { base: '/javascript/', items: sidebarJS() },
      '/examples/': { base: '/examples/', items: sidebarEg() },
      '/github/': { base: '/github/', items: sidebarGithub() },
      '/vite-press/': { base: '/vite-press/', items: sidebarVitePress() },
      '/css/': { base: '/css/', items: sidebarCSS() },
      '/nodejs/': { base: '/nodejs/', items: sidebarNodejs() },
      '/vue-router/': { base: '/vue-router/', items: sidebarVueRouter() },
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/vuejs/vitepress' }],
    footer: {
      message:
        'Released under the <a href="https://github.com/ZXheart/ZXheart.github.io?tab=MIT-1-ov-file"> MIT License.</a>',
      copyright: 'Copyright © 2023-present <a href="https://github.com/ZXheart/ZXheart.github.io">julien</a>',
    },
    outline: { level: 'deep' },
  },
})
