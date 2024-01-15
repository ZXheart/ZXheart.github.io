import 'virtual:uno.css'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import StackBlitz from '../components/StackBlitz.vue'
// import GridLayout from '../components/GridLayout.vue'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('StackBlitz', StackBlitz)
    //  app.component('GridLayout', GridLayout)
  },
} satisfies Theme
