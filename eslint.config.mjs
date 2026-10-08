import antfu from '@antfu/eslint-config'

export default antfu({
  vue: {
    overrides: {
      'vue/singleline-html-element-content-newline': [
        'off',
        {
          ignoreWhenNoAttributes: true,
          ignoreWhenEmpty: true,
        },
      ], 
    },
  },
  markdown: false,
  typescript: {
    overrides: {
      'no-console': 'off',
    },
  },
  javascript: {
    overrides: {
      'no-console': 'off',
    },
  },

})
