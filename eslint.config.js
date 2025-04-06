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
      ], // 无效
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

  // {
  //   overrides: {
  //     'no-unused-vars': 'off',
  //     'no-var': 'off',
  //     'vars-on-top': 'off',
  //     'object-shorthand': 'off',
  //     'new-cap': 'off',
  //     'no-extend-native': 'off',
  //     'prefer-rest-params': 'off',
  //     'ts/no-this-alias': 'off',
  //     'no-useless-call': 'off',
  //     'prefer-spread': 'off',
  //     'prefer-arrow-callback': 'off',
  //   },
  // },
})
