# 开始

## 前言

搭建过程中遇到很多大大小小奇怪问题，可能是VitePress还比较新的缘故，网上的搭建教程基本如出一辙，导致个人遇到的问题在google上都没得到解决。最后都是通过[官方网站](https://vitepress.dev/)解决的

## 创建项目

### 本记录是将VitePress部署到github pages上，所以先创建一个github仓库再clone到本地可以省去不少麻烦

1. 创建一个github仓库，名称必须是`<username>.github.io`，`<username>`是你的github用户名
2. 仓库顶栏找到`Settings`，左侧栏找到`Pages`，子标题找到`Build and deployment`，选择`Source`为`GitHub Actions`，点击`Save`，
3. 随便创个文件夹，然后`git clone`

## 安装
1. vscode 打开文件夹，初始化一个package.json
   
2. 安装vitepress
:::code-group

```sh [pnpm]
$ pnpm add -D vitepress
```

```sh [npm]
$ npm install -D vitepress
```

```sh [yarn]
$ yarn add -D vitepress
```
:::

3. 初始化vitepress
:::code-group

```sh [pnpm]
$ pnpm vitepress init
```

```sh [npm]
$ npx vitepress init
```
:::
4. 会有一系列问题，一路enter就可以,注意如果不想要ts，就不要选
![初始化问题](/vite-press-img/init-questions.jpg)

