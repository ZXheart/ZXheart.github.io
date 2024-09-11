import type { DefaultTheme } from 'vitepress'

export function sidebarJS(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Basic',
      collapsed: false,
      items: [
        { text: '注释', link: 'basic/01-comments' },
        { text: '逻辑运算符', link: 'basic/02-logical-operators' },
        { text: '空值合并运算符', link: 'basic/03-nullish-coalescing-operator' },
        { text: 'new.target', link: 'basic/04-new.target' },
        { text: '稀疏数组', link: 'basic/05-sparse-arrays' },
        {
          text: 'Array Methods',
          collapsed: true,
          items: [
            { text: 'concat', link: 'basic/01-array-methods/01-concat' },
            { text: 'filter', link: 'basic/01-array-methods/02-filter' },
            { text: 'find', link: 'basic/01-array-methods/03-find' },
            { text: 'findIndex', link: 'basic/01-array-methods/04-findIndex' },
            { text: 'forEach', link: 'basic/01-array-methods/05-forEach' },
            { text: 'includes', link: 'basic/01-array-methods/06-includes' },
            { text: 'indexOf', link: 'basic/01-array-methods/07-indexOf' },
            { text: 'join', link: 'basic/01-array-methods/08-join' },
            { text: 'map', link: 'basic/01-array-methods/09-map' },
            { text: 'pop', link: 'basic/01-array-methods/10-pop' },
            { text: 'push', link: 'basic/01-array-methods/11-push' },
            { text: 'reduce', link: 'basic/01-array-methods/12-reduce' },
            { text: 'reduceRight', link: 'basic/01-array-methods/13-reduceRight' },
            { text: 'reverse', link: 'basic/01-array-methods/14-reverse' },
            { text: 'shift', link: 'basic/01-array-methods/15-shift' },
            { text: 'slice', link: 'basic/01-array-methods/16-slice' },
            { text: 'some', link: 'basic/01-array-methods/17-some' },
            { text: 'sort', link: 'basic/01-array-methods/18-sort' },
            { text: 'splice', link: 'basic/01-array-methods/19-splice' },
            { text: 'unshift', link: 'basic/01-array-methods/20-unshift' },
          ],
        },
        {
          text: 'Function Methods',
          collapsed: true,
          items: [
            { text: 'apply', link: 'basic/02-function-methods/01-apply' },
            { text: 'bind', link: 'basic/02-function-methods/02-call' },
            { text: 'call', link: 'basic/02-function-methods/03-bind' },
          ],
        },
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
      items: [
        { text: 'proxy', link: 'advanced/01-proxy' },
        { text: 'extend-es5', link: 'advanced/02-extend-es5' },
        { text: 'copy', link: 'advanced/03-copy' },
      ],
    },
    {
      text: 'Book',
      collapsed: true,
      items: [
        {
          text: "You Don't Know JS",
          collapsed: true,
          items: [
            {
              text: 'scope & closures',
              collapsed: true,
              items: [
                { text: 'what is scope', link: 'book/you-dont-know-js/scope&closures/01-what-is-scope' },
                { text: 'lexical scope', link: 'book/you-dont-know-js/scope&closures/02-lexical-scope' },
                { text: 'function vs. block scope', link: 'book/you-dont-know-js/scope&closures/03-function-vs-block-scope' },
                { text: 'hoisting', link: 'book/you-dont-know-js/scope&closures/04-hoisting' },
                { text: 'scope closure', link: 'book/you-dont-know-js/scope&closures/05-scope-closure' },
                { text: 'dynamic scope', link: 'book/you-dont-know-js/scope&closures/appendixA' },
                { text: 'polyfilling block scope', link: 'book/you-dont-know-js/scope&closures/appendixB' },
                { text: 'lexical this', link: 'book/you-dont-know-js/scope&closures/appendixC' },
              ],
            },
            {
              text: 'this & object prototype',
              collapsed: true,
              items: [
                { text: 'this or that', link: 'book/you-dont-know-js/this&object-prototype/01-this' },
                { text: 'this all makes sense now', link: 'book/you-dont-know-js/this&object-prototype/02-this' },
                { text: 'object', link: 'book/you-dont-know-js/this&object-prototype/03-object' },
                { text: `mixing (up) 'class' object`, link: 'book/you-dont-know-js/this&object-prototype/04-mixing-class-objects' },
                { text: `prototypes`, link: 'book/you-dont-know-js/this&object-prototype/05-prototypes' },
                { text: `behavior delegation`, link: 'book/you-dont-know-js/this&object-prototype/06-behavior-delegation' },
                { text: `appendixA ES6 class`, link: 'book/you-dont-know-js/this&object-prototype/appendixA' },
              ],
            },
            {
              text: 'types & grammar',
              collapsed: true,
              items: [
                { text: 'types', link: 'book/you-dont-know-js/types&grammar/01-types' },
                { text: 'values', link: 'book/you-dont-know-js/types&grammar/02-values' },
                { text: 'natives', link: 'book/you-dont-know-js/types&grammar/03-natives' },
                { text: 'coercion', link: 'book/you-dont-know-js/types&grammar/04-coercion' },
                { text: 'grammar', link: 'book/you-dont-know-js/types&grammar/05-grammar' },
                { text: 'mixed environment JS', link: 'book/you-dont-know-js/types&grammar/appendixA' },
              ],
            },
            {
              text: 'async & performance',
              collapsed: true,
              items: [
                { text: 'asynchrony', link: 'book/you-dont-know-js/async&performance/01-asynchrony' },
                { text: 'callbacks', link: 'book/you-dont-know-js/async&performance/02-callbacks' },
                { text: 'promise', link: 'book/you-dont-know-js/async&performance/03-promise' },
                { text: 'generator', link: 'book/you-dont-know-js/async&performance/04-generator' },
                { text: 'program performance', link: 'book/you-dont-know-js/async&performance/05-program-performance' },
                { text: 'benchmarking & tuning', link: 'book/you-dont-know-js/async&performance/06-benchmarking-tuning' },
                { text: 'appendixA tail call optimization', link: 'book/you-dont-know-js/async&performance/appendixA' },
              ],
            },
          ],
        },
        {
          text: 'some book',
          collapsed: true,
          items: [{ text: 'this', link: 'book/you-dont-know-js/03-object' }],
        },
      ],
    },
  ]
}
