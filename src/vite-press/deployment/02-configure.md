# config.mts

这个文件是vitepress的配置文件，vitepress中基本所有重要信息都在这里，具体配置项可以参考[vitepress配置](https://vitepress.dev/zh/reference/default-theme-config)

## 源文件目录
vitepress中你所写的`.md`文件称为**源文件**，默认源文件和你的`.vitepress`目录在同一级，这样不方便管理，你可以单独创建一个**源文件目录**用于存放源文件。首先在`.vitepress`同级创建源文件目录`src`(或者pages...)，然后在`config.mts`中配置源文件目录如下
```ts
import { defineConfig, type DefaultTheme } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // ...
  srcDir: 'src', // 或者pages...自定义即可
  // ...
})
```
以后在`src`目录下再创建不同文件夹一一对应网站导航链接便于管理。

## public目录
`public`目录用于存放静态资源，比如`favicon.ico`、`logo`等，注意：`public`目录必须放在[源文件目录](#源文件目录)中。使用的时候直接`/picture-name.png`即可。使用静态资源时vitepress默认会在[源文件目录](#源文件目录)下`public`目录查找。

## favicon.ico
在`src`文件夹下创建`public`文件夹，将`favicon.ico`放入其中，继续在`config.mts`中进行如下配置。
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

logo是指网站左上角的logo，在`config.mts`中进行如下配置

```ts
import { defineConfig, type DefaultTheme } from 'vitepress'

export default defineConfig({
  // ...
  themeConfig:{
    // ...
    // 只有一个logo直接写字符串路径即可
    logo:'/favicon.ico' 
    // 如果你分别为白天和夜晚模式设置了不同logo
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
      nav:nav() // 将nav选项配置单独抽离出来，方便管理，当然也可以直接写在这里
      // ...
  }
  // ...
})

function nav():DefaultTheme.NavItem[] {
  return [
      // 1. 第一种情况，一个导航链接下只有一个内容(或者叫分类)
      // text:导航栏显示的文字
      // link:导航栏点击跳转的链接，这里会跳转到src/js/basic.md
      // activeMatch:只要当前链接在src/js/下，该导航链接文字就会高亮
      { text: 'js', link: '/js/basic', activeMatch : '/js/'},

      // 2. 第二种情况，一个导航链接下有多个内容(或者叫分类)
      {
          text: 'ts',
          // 这里不需要link了，因为下面有多个内容，点击ts不会跳转,而是变成一个下拉菜单
          // 下边items会出现在下拉菜单中
          items: [
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
侧边栏是文档的主要导航块，可以根据需求配置不同侧边栏:
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
大纲是指文档右侧大纲容器，自动根据当前页面的`#`生成。默认情况下，只显示`#`和`##`标题，如果想显示、`###`、`###`...。在`config.mts`中进行如下配置
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
以上是我搭建博客时碰到过问题或者觉得有必要记录的点，其它配置项可以参考[vitepress配置](https://vitepress.dev/zh/reference/default-theme-config)。