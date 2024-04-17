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
        {
          text: 'Array Methods',
          collapsed: true,
          items: [
            { text: 'Array.prototype.concat()', link: 'basic/05-array-methods/01-concat' },
            { text: 'Array.prototype.filter()', link: 'basic/05-array-methods/02-filter' },
            { text: 'Array.prototype.find()', link: 'basic/05-array-methods/03-find' },
            { text: 'Array.prototype.findIndex()', link: 'basic/05-array-methods/04-findIndex' },
            { text: 'Array.prototype.forEach()', link: 'basic/05-array-methods/05-forEach' },
            { text: 'Array.prototype.includes()', link: 'basic/05-array-methods/06-includes' },
            { text: 'Array.prototype.indexOf()', link: 'basic/05-array-methods/07-indexOf' },
            { text: 'Array.prototype.join()', link: 'basic/05-array-methods/08-join' },
            { text: 'Array.prototype.map()', link: 'basic/05-array-methods/09-map' },
            { text: 'Array.prototype.pop()', link: 'basic/05-array-methods/10-pop' },
            { text: 'Array.prototype.push()', link: 'basic/05-array-methods/11-push' },
            { text: 'Array.prototype.reduce()', link: 'basic/05-array-methods/12-reduce' },
            { text: 'Array.prototype.reduceRight()', link: 'basic/05-array-methods/13-reduceRight' },
            { text: 'Array.prototype.reverse()', link: 'basic/05-array-methods/14-reverse' },
            { text: 'Array.prototype.shift()', link: 'basic/05-array-methods/15-shift' },
            { text: 'Array.prototype.slice()', link: 'basic/05-array-methods/16-slice' },
            { text: 'Array.prototype.some()', link: 'basic/05-array-methods/17-some' },
            { text: 'Array.prototype.sort()', link: 'basic/05-array-methods/18-sort' },
            { text: 'Array.prototype.splice()', link: 'basic/05-array-methods/19-splice' },
            { text: 'Array.prototype.unshift()', link: 'basic/05-array-methods/20-unshift' },
          ],
        },
        { text: '稀疏数组', link: 'basic/06-sparse-arrays' },
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
        { text: 'this', link: 'advanced/03-this' },
        { text: 'copy', link: 'advanced/04-copy' },
        { text: 'object', link: 'advanced/05-object' },
      ],
    },
  ]
}
