import { defineConfig, presetUno, presetIcons, presetAttributify } from 'unocss'
declare module '@unocss/core' {}

export default defineConfig({
  presets: [presetUno(), presetIcons(), presetAttributify()],
})
