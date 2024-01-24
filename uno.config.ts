import { defineConfig, presetIcons, presetUno,presetWind } from 'unocss'
import transformerDirectives from '@unocss/transformer-directives'

declare module '@unocss/core' {}

export default defineConfig({
  presets: [presetUno(),presetWind(), presetIcons()],
  transformers: [transformerDirectives()],
  rules: [
    ['pos-center', { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }],
  ],
  theme: {
    colors: {
      'soft-a': '#272843', // 深棕
      'soft-b': '#d8d8d8', // 灰色
      'soft-c': '#ffb6c1', // 淡粉
      'soft-d': '#42b883', // 绿色
      'soft-e': '#161618', // 黑色(代码块背景色)
    },
  },
})
