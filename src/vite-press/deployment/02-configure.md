# config.mts

vitepress的配置文件，vitepress中重要信息都在这里，具体配置项可以参考:point_right:[vitepress](https://vitepress.dev/zh/reference/default-theme-config)

## 源文件目录
`.md`文件称为**源文件**，默认源文件和`.vitepress`目录在同级，不方便管理。我单独创建一个**源文件目录**存放源文件。在`.vitepress`同级创建目录`src`(或者pages...)，然后在`config.mts`中配置如下
```ts
import { defineConfig, type DefaultTheme } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // ...
  srcDir: 'src', // 或者pages...
  // ...
})
```
此后在`src`目录下创建不同目录分别对应不同网站导航。

## public目录
`public`目录用于存放静态资源，比如`favicon.ico`、`logo`、`.md所用图片`等，注意：`public`目录必须放在[源文件目录](#源文件目录)。使用静态资源时vitepress默认会在[源文件目录](#源文件目录)下`public`目录查找。
例如在`.md`中引用图片: `![某张图片](/some-picture.png)` 

## favicon.ico
将`favicon.ico`放入`src/public`中，然后在`config.mts`配置如下。
```ts
import { defineConfig, type DefaultTheme } from 'vitepress'

export default defineConfig({
  // ...
  head: [
      ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
  // ...
})
```

## 导航栏(nav)

### logo

logo是指网站左上角的logo，在`config.mts`配置如下

```ts
import { defineConfig, type DefaultTheme } from 'vitepress'

export default defineConfig({
  // ...
  themeConfig:{
    // ...
    // 只有一个logo直接写字符串路径即可
    logo:'/favicon.ico' 
    // 如果你分别为白天和夜晚模式准备了不同logo
    logo:{light:'/logo-light.png',dark:'/logo-dark.png'} 
    // ...
  }
  // ...
})
```

### 导航链接

在`config.mts`中进行如下配置

```ts
import { defineConfig, type DefaultTheme } from 'vitepress'

export default defineConfig({
  // ...
  themeConfig:{
      // ...
      nav:nav() // 我把nav选项配置抽离便于管理，当然也可以直接写在这里
      // ...
  }
  // ...
})

function nav():DefaultTheme.NavItem[] {
  return [
      // 1. 情况一，一个导航链接下只有一个内容(或者叫分类)
      // text:导航栏显示的文字
      // link:导航栏点击跳转的链接，这里会跳转到src/js/basic.md
      // activeMatch:只要当前链接在src/js/下，该导航链接文字就会高亮
      { text: 'js', link: '/js/basic', activeMatch : '/js/'},

      // 2. 情况二，一个导航链接下有多个内容(或者叫分类)
      {
          text: 'ts',
          // 这里不需要link，因为下面有多个内容，点击ts不会跳转,而是变成下拉菜单
          // 下边items会出现在下拉菜单中
          items: [
              // 内容配置等同情况一
              // items中的每一项可以继续嵌套分类，你想的话
              { text: 'ts基础', link: '/ts/basic', activeMatch:'/basic' },
              { text: 'ts进阶', link: '/ts/advanced', activeMatch:'/advanced' },
          ]
      },
      //...
  ]

}
```

## 侧边栏(sidebar)
侧边栏是文档的主要导航块，如你看到的文档左边导航。配置如下:
```ts
import { defineConfig, type DefaultTheme } from 'vitepress'

export default defineConfig({
  // ...
  themeConfig:{
      // ...
      sidebar: {
        // 以上边已设置的nav为例，这里的sidebar就是js、ts两个导航链接下的内容：
        // /js/表示点击js导航链接后，侧边栏会显示src/js/下的所有内容(有多个侧边栏需要这样配置)
        // base: '/js/'表示侧边栏的根目录是src/js/，之后在items中的链接都是相对于src/js/的
        '/js/': { base: '/js/', items: sidebarJS() },// 同样将items配置单独抽离出来
        '/ts/': { base: '/ts/', items: sidebarTs() },
        // ...
      }, 
      // ...
  }
  // ...
})
function sidebarJS(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'js',
      items: [
        { text: 'js基础', link: 'basic' },
      ],
    },
  ]
}
function sidebarTS(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'ts',
      collapsed: false, // 默认是否折叠(当一个导航链接下有多个内容时，此选项可配置)
      items: [
        { text: 'ts基础', link: 'basic/basic' },
        { text: 'ts进阶', link: 'advanced/advanced' },
        // 可以进一步嵌套至多6级
        // {
        //   text: 'ts高级',
        //   items: [
        //     { text: 'ts高级1', link: 'advanced/advanced1' },
        //     { text: 'ts高级2', link: 'advanced/advanced2' },
        //   ],
        // },
      ],
    },
  ]
}

```

## 大纲(outline)
大纲是指文档右侧大纲容器，自动根据当前页面的`#`生成。默认情况下，只显示`#`和`##`标题，想显示、`###`、`###`... 配置如下
```ts
import { defineConfig, type DefaultTheme } from 'vitepress'

export default defineConfig({
  // ...
  themeConfig:{
    // ...
    outline: { level: 'deep', label: '目录' },
    // level可选值：false | number | [number,number] | 'deep' 默认为2
        // false: 不显示
        // number: 默认2,只显示##标题。写几就显示第几级标题
        // [number,number]: 从第几级标题开始显示，比如[3, 4]表示从三级标题开始显示，到四级标题结束
        // 'deep': 等于[2, 6]
    // label: 大纲标题 默认'On this page'
    // ...
  }
  // ...
})
```
更多配置项参考:point_right:[vitepress](https://vitepress.dev/zh/reference/default-theme-config)