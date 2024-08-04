import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { NolebaseEnhancedReadabilitiesMenu, NolebaseEnhancedReadabilitiesScreenMenu } from '@nolebase/vitepress-plugin-enhanced-readabilities/client'

import 'virtual:uno.css'
import './custom.css'
import '@nolebase/vitepress-plugin-enhanced-readabilities/client/style.css'

// import StackBlitz from '../components/StackBlitz.vue'
// import GridLayout from '../components/GridLayout.vue'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // 为较宽的屏幕的导航栏添加阅读增强菜单
      'nav-bar-content-after': () => h(NolebaseEnhancedReadabilitiesMenu),
      // 为较窄的屏幕（通常是小于 iPad Mini）添加阅读增强菜单
      'nav-screen-content-after': () => h(NolebaseEnhancedReadabilitiesScreenMenu),
    })
  },
  // enhanceApp({ app }) {
  //   app.component('StackBlitz', StackBlitz)
  //  app.component('GridLayout', GridLayout)
  // },
} satisfies Theme
