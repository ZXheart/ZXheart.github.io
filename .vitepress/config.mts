import { defineConfig, type DefaultTheme } from 'vitepress'
import UnoCSS from 'unocss/vite'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Keep going',
  description: 'Force yourself to make a change',
  head: [['line', { rel: 'icon', href: '/favicon.ico' }]],
  srcDir: 'src',
  lastUpdated: true,
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

function nav(): DefaultTheme.NavItem[] {
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
  ]
}
function sidebarJS(): DefaultTheme.SidebarItem[] {
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
function sidebarEg(): DefaultTheme.SidebarItem[] {
  return [
    { text: 'Markdown Examples', link: 'markdown-examples' },
    { text: 'API Examples', link: 'api-examples' },
  ]
}
function sidebarGithub(): DefaultTheme.SidebarItem[] {
  return [
    { text: '基本使用', collapsed: false, items: [{ text: '注册', link: 'basic/register' }] },
    { text: 'Actions', collapsed: false, items: [{ text: 'Actions', link: 'actions/actions' }] },
  ]
}
function sidebarVitePress(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Deployment process',
      collapsed: false,
      items: [
        { text: '开始', link: 'deployment/01-start' },
        { text: '配置', link: 'deployment/02-configure' },
        { text: '部署', link: 'deployment/03-deploy' },
      ],
    },
  ]
}
function sidebarCSS(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Basic concepts of grid layout',
      collapsed: false,
      items: [{ text: '网格布局概念', link: 'grid-layout/01-concepts' }],
    },
    {
      text: 'Basic concepts of flex box',
      collapsed: false,
      items: [{ text: '网格布局概念', link: 'flex-box/01-concepts' }],
    },
  ]
}
