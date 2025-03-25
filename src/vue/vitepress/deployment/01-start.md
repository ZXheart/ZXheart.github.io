# VitePress 是什么?

VitePress 是一个*静态站点生成器*(SSG - Static Site Generation)

## 前言

本文记录自己搭建 vitepress 并自动部署到 github pages 的过程，也是搭建本博客后第一篇文章。搭建过程中遇到不少奇怪问题，可能是 VitePress 还比较新的缘故(初写时 vitepress 官网还只有英文版本，本人英文一塌糊涂)，网上的搭建教程没得到比较好的解决。最后都是通过[官网](https://vitepress.dev/)解决的（本文完成时-2024/01/02，vitepress 官网已有中文版本，致敬尤雨溪）

## 前置条件

我只是一个前端小白，深层的东西一概不知，本文只记录我自己的搭建过程。以下是搭建时使用的工具，不同工具可能会导致细微差别，但是大体上都是一样的。

- [vscode](https://code.visualstudio.com/)：代码编辑器
- [pnpm](https://pnpm.io/)：包管理工具
- [git](https://git-scm.com/)：版本控制工具
- [github](https://github.com/)：代码托管平台

## 创建项目

由于是部署到 github pages 上，所以先创建一个 github 仓库再 clone 到本地可以省去不少麻烦

1. 创建一个 github 仓库，名称必须是`<username>.github.io`，`<username>`是你的 github 用户名。_注意，最好添加一个 README.md,这样可以直接 clone，否则还要自己连接仓库_
2. 仓库顶栏找到`Settings`，左侧栏找到`Pages`，子标题找到`Build and deployment`，选择`Source`为`GitHub Actions`，点击`Save`，
3. 本地随便创个文件夹，然后`git clone`

## 安装

1. vscode 打开文件夹，初始化一个 package.json
2. 安装 vitepress

```sh
$ pnpm add -D vitepress
```

3. 初始化 vitepress

```sh
$ pnpm vitepress init
```

- 出现一系列问题选项，根据需求选择，我一路 enter。
  ![初始化问题](/vite-press-img/init-questions.jpg)
- (Where should VitePress initialize the config?如果使用的是默认值`./`)初始化完成后目录结构如下：

```
your-project-name
├─ .vitepress
|  └─ config.mts
├─ node_modules
|  └─ ...
├─ api-examples.md
├─ index.md
├─ markdown-examples.md
├─ package.json
└─ pnpm-lock.yaml
```

## 启动

`vitepress init`时已经注入以下脚本到`package.json`中

```json
{
  ...
  "scripts": {
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:preview": "vitepress preview docs"
  },
  ...
}
```

执行以下命令启动项目

```sh
$ pnpm docs:dev
```

至此，打开浏览器即可查看效果了，此外还有一些东西需要[配置](/vue/vitepress/deployment/02-configure)
