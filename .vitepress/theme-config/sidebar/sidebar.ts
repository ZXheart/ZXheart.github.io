import type { DefaultTheme } from 'vitepress'

/**
 * Sidebar configuration for JavaScript
 */
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

/**
 * Sidebar configuration for Markdown
 */
export function sidebarEg(): DefaultTheme.SidebarItem[] {
  return [
    { text: 'Markdown Examples', link: 'markdown-examples' },
    { text: 'API Examples', link: 'api-examples' },
  ]
}
export function sidebarGithub(): DefaultTheme.SidebarItem[] {
  return [
    { text: '基本使用', collapsed: false, items: [{ text: '注册', link: 'basic/register' }] },
    { text: 'Actions', collapsed: false, items: [{ text: 'Actions', link: 'actions/actions' }] },
  ]
}

/**
 * Sidebar configuration for VitePress
 */
export function sidebarVitePress(): DefaultTheme.SidebarItem[] {
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

/**
 * Sidebar configuration for CSS
 */
export function sidebarCSS(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Grid layout',
      collapsed: false,
      items: [{ text: '网格布局概念', link: 'grid-layout/01-concepts' }],
    },
    {
      text: 'Flex box',
      collapsed: false,
      items: [{ text: '弹性盒布局概念', link: 'flex-box/01-concepts' }],
    },
  ]
}
