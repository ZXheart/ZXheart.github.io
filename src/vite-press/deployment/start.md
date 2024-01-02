# 开始

## 前言

本文记录自己搭建vitepress并自动部署到github pages的过程，也是搭建本博客后第一篇文章。搭建过程中遇到不少奇怪问题，可能是VitePress还比较新的缘故(初写时vitepress官网还只有英文版本，本人英文一塌糊涂)，网上的搭建教程没得到比较好的解决。最后都是通过[官方网站](https://vitepress.dev/)解决的（本文完成时-2024/01/02，vitepress官网已有中文版本，致敬尤雨溪）

## 前置条件
我只是一个前端小白，所以本文只记录我自己的搭建过程。以下是搭建时使用的工具，不同工具可能会导致细微差别，但是大体上都是一样的。
- [vscode](https://code.visualstudio.com/)：代码编辑器
- [pnpm](https://pnpm.io/)：包管理工具
- [git](https://git-scm.com/)：版本控制工具
- [github](https://github.com/)：代码托管平台

## 创建项目

### 由于是部署到github pages上，所以先创建一个github仓库再clone到本地可以省去不少麻烦

1. 创建一个github仓库，名称必须是`<username>.github.io`，`<username>`是你的github用户名
2. 仓库顶栏找到`Settings`，左侧栏找到`Pages`，子标题找到`Build and deployment`，选择`Source`为`GitHub Actions`，点击`Save`，
3. 本地随便创个文件夹，然后`git clone`

## 安装
1. vscode 打开文件夹，初始化一个package.json
   
2. 安装vitepress
```sh
$ pnpm add -D vitepress
```

3. 初始化vitepress
```sh
$ pnpm vitepress init
```

   -  出现一系列问题选项，根据需求选择，我一路enter。
    ![初始化问题](/vite-press-img/init-questions.jpg)
   -  (Where should VitePress initialize the config?如果使用的是默认值`./`)初始化完成后目录结构如下：
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
至此，打开浏览器即可查看效果了，但是还有一些东西需要[配置](/vite-press/deployment/configure)