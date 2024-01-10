# 
# 部署站点到 GitHub Pages

## 设定public根目录
默认，VitePress假定你的站点将会部署到域名的根目录下（例如 `https://example.com/`）。如果你想要部署到一个子路径下（例如 `https://example.com/blog/`），你需要在你的 `config.mts` 中设定 `base`。

```ts
import { defineConfig, type DefaultTheme } from 'vitepress'

export default defineConfig({
  // ...
   base:'/blog/',
  // ...
})

```
我使用了默认值`./`，直接跳过该步骤

## 创建部署文件
在项目根目录下创建`.github/workflows/deploy.yml`文件，内容如下：

```yml

# Sample workflow for building and deploying a VitePress site to GitHub Pages
#
name: Deploy VitePress site to GitHub Pages

on:
  # Runs on pushes targeting the `main` branch. Change this to `master` if you're
  # using the `master` branch as the default branch.
  push:
    branches: [main]

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Allow only one concurrent deployment, skipping runs queued between the run in-progress and latest queued.
# However, do NOT cancel in-progress runs as we want to allow these production deployments to complete.
concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  # Build job
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        with:
          fetch-depth: 0 # Not needed if lastUpdated is not enabled
      - uses: pnpm/action-setup@v2 # Uncomment this if you're using pnpm
        with:
          version: latest
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: pnpm # or pnpm / yarn
      - name: Setup Pages
        uses: actions/configure-pages@v3
      - name: Install dependencies
        run: pnpm install # or pnpm install / yarn install
      - name: Build with VitePress
        run: pnpm docs:build # or pnpm docs:build / yarn docs:build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: .vitepress/dist 
          # 注意！！！注意！！！，vitepress官网是 docs/.vitepress/dist
          # 官网的教程默认项目根目录下有docs文件夹，我没有，所以这里改成了.vitepress/dist
  # Deployment job
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2


```

文件内容粘贴自[官方文档](https://vitepress.dev/zh/guide/deploy#github-pages)，修改了部分内容。因为官方文档使用的npm且默认项目根目录下有docs文件夹，我使用的是pnpm且没有docs文件夹，所以修改了部分内容。

## 提交代码

使用git提交代码，该文件上传至github后，github会自动执行`deploy.yml`文件，部署站点到github pages上。然后就可以通过`https://<username>.github.io`访问你的网站了。