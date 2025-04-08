# :zzz:

# 网络模型

TCP/IP 四层网络模型

- 应用层
- 传输层
- 网络层
- 物理链路层

TCP/IP 五层网络模型

- 应用层
- 传输层
- 网络层
- 数据链路层
- 物理层

OSI 七层网络模型

- 应用层
- 表示层
- 会话层
- 传输层
- 网络层
- 数据链路层
- 物理层

## 应用层协议

### URL

URL(uniform resource locator) 统一资源定位符，用于定位网络服务。

http://a.com:80/news/detail?id=1#title

- http://: 协议（schema）
- a.com: 域名（domain）
- 80: 端口号（port）
- /news/detail: 路径（path）
- ?id=1: 查询参数（query）
- #title: 锚点（hash）

它表达了：
从网络中 **哪台计算机（domain）** 中的 **哪个程序（port）** 寻找 **哪个服务（path）**，并注明了获取服务的 **具体细节（path、query、hash）**，以及要用什么样的 **协议通信（schema）**。

细节：

- 当协议是**http**端口为**80**时，端口可以省略
- 当协议是**https**端口为**443**时，端口可以省略
- **schema、domain、path**是必须的，其他的根据具体要求填写

### HTTP

超文本传输协议（Hyper Text Transfer Protocol），是一个广泛运用于互联网的应用层协议。

99%的情况下，前端开发者接触的都是 HTTP 协议。

该协议规定了两个方面的内容：

- 传递消息的模式
- 传递消息的格式

#### 传递消息的模式

HTTP 使用了一种极为简单的消息传递模式，「请求-响应」模式。

发起请求的称为客户端（client），接受请求并完成响应的称之为服务器（server）。

「请求-响应」完成后，一次交互结束。

#### 传递消息的格式

HTTP 的消息格式是一种纯文本的格式，文本分为三个部分：

- 请求行
- 请求头
-
-
- 请求体

:::warning
注意请求头和请求体之间有两个换行
:::

##### 请求消息格式：

```text
GET /news/detail?id=1 HTTP/1.1 # 请求行
Host: a.com # 请求头
Content-Type: application/json
Content-Type: multipart/form-data; boundary=ccc


# 当请求头是 multipart/form-data 时，格式为
--ccc
Content-Disposition: form-data; name="loginName"

julien
--ccc
Content-Disposition: form-data; name="password"

123456
--ccc
Content-Disposition: form-data; name="file"; filename="1.png"
Content-Type: image/png

<二进制数据>
--ccc-- # 以--分隔符--结尾
# 当请求头是 application/x-www-form-urlencoded 时，格式为
loginName=xxx&age=18
```

**请求行**

- GET 「在 HTTP 协议中，请求方法仅有语义的区别，只是表达了这次请求的「期望」。它可以是任意的字符串。」
  - GET 「获取资源」
  - POST 「提交资源」
  - PUT 「更新资源」
  - DELETE 「删除资源」
- /news/detail?id=1 「请求的路径和查询参数」
- HTTP/1.1 「HTTP 协议的版本」

**请求头**

可以包含任意键值对，格式为 `key: value`。

- Host: a.com 「请求的主机名（必须）」
- Content-Type: application/json 「描述请求体的类型（如何处理）」**同时「x/y」这种格式的类型叫做 MIME 类型**。「MIME：描述格式的标准字符串」
  - application/x-www-form-urlencoded 「name=xxx&age=18」
  - application/json 「{"name": "xxx", "age": 18}」
  - multipart/form-data; boundary=aaa 「文件上传」 「分隔符为 aaa」「base64 主要作用就是能以文本的形式书写/传输二进制数据」

**请求体**

请求体是可选的，同时里边的写法和请求头的 Content-Type 有关系。

##### 响应消息格式：

```text
HTTP/1.1 200 OK # 响应行
Content-Type: text/html # 响应头
Content-Length: 1234 # 响应体的字节数


<html>
  <head>
    <title>hello world</title>
  </head>
  <body>
    <h1>hello world</h1>
  </body>
</html>
```

**响应行**

- HTTP/1.1 「HTTP 协议的版本」
- 200 「响应的状态码，描述服务器对这个响应的态度」可自定义
  - 1\*\* 「信息，服务器收到请求，需要请求者继续执行操作」
  - 2\*\* 「成功，操作被成功接收并处理」
  - 3\*\* 「重定向，需要进一步的操作以完成请求」
    - 301 「永久重定向，客户端第一次请求发现永久重定向后，会将 Location 的地址缓存到本地，后续请求直接使用这个地址」
    - 302 「临时重定向，浏览器没有关闭窗口的时候，后续请求会使用 Location 的地址；如果关闭了窗口，后续请求会使用原地址」
  - 4\*\* 「客户端错误，请求包含语法错误或无法完成请求」
  - 5\*\* 「服务器错误，服务器在处理请求的过程中发生了错误」
- OK 「响应的状态描述」 可自定义

# 浏览器通信能力

## 用户代理

浏览器可以代替用户完成 http 请求，代替用户解析响应结果，所以我们称之为**用户代理（User Agent）**。

在网络层面，对于前端开发者，必须要知道浏览器拥有的两大核心能力：

- 自动发出请求的能力
- 自动解析响应的能力

### 自动发送请求的能力

当一些事情发生的时候，浏览器会代替用户自动发出 http 请求，主要包括：

1. **用户在地址栏输入了一个 url 地址，并按下了回车**
   - 浏览器会自动解析 URL，并发出一个 GET 请求，同时抛弃当前页面。
2. **当用户点击了页面中的 a 元素**
   - 浏览器会拿到 a 元素的 href 地址，并发出一个 GET 请求，同时抛弃当前页面。
     > 书写 href 地址可以是相对路径，也可以是绝对径路。最终都会转换成完整的 URL 地址。
     > 当前页面：https://a.com/news/199.html
     >
     > 绝对路径：绝对当前 url 的协议、域名、端口。和 path 无关。
     >
     > 1、可以省略协议，将会直接使用当前页面协议，例`//b.com => https://b.com/`
     >
     > 2、可以同时省略协议，域名及端口，将会使用当前页面协议域名及端口。例`/about/1.html => https://a.com/about/1.html`
     >
     > 相对路径：相对当前 url 的 path 部分。
     >
     > 1.`./200.html => https://a.com/news/200.html`
     >
     > 2.`../200.html => https://a.com/200.html`
     >
     > 3.`200.html => https://a.com/news/200.html`（什么都不写，相当于`./200.html`）
3. **当用户点击了提交按钮<button type="submit">...</button>**
   - 浏览器会获取按钮所在的`<from>`元素，拿到它的`action`属性地址，同时拿到它的`method`属性值，然后把表单中的数据组织到请求体中，发出`指定方法`的请求，同时抛弃当前页面。
4. **当解析 HTML 时遇到了`<link>` `<img>` `script` `video` `audio`等元素** 浏览器会拿到对应的地址，发出 GET 请求。
5. **当用户点击了刷新**，浏览器会拿到当前页面的地址，以及当前页面的的请求方法，重新发一次请求，同时抛弃当前页面。

> 浏览器在发出请求时，会自动附带一些请求头。

#### 约定俗成

服务器和浏览器有一个约定：**当发送 GET 请求时，不会附带请求体**。

这个约定深刻地影响着后续的前后端各种应用，现在几乎所有人都在潜意识中认同了这一点，无论是前端开发人员还是后端开发人员。但实际上 GET 请求同样可以携带请求体，和 POST
请求没有任何区别，从 HTTP 协议角度来看，这两个单词仅有语义上的区别而已。

由于前后端程序的默认行为，逐步造成了 GET 和 POST 的各种差异：

- 浏览器在发送 GET 请求时，不会携带请求体。请求头/行中不能有非 ASCII 字符，现代浏览器会自动编码，js 中通过`encodeURIComponent`编码。
- GET 请求的传递信息量有限，适合传递少量数据；POST 请求的传递信息量是没有限制的，适合传输大量数据。
- GET 请求只能传递只能传递 ASCII 数据，遇到非 ASCII 数据需要进行编码；POST 请求没有限制。
- 大部分 GET 请求传递的数据都附带在 path 参数中，能够通过分享地址完整的重现页面，但同时也暴露了数据，若有敏感数据传递，不应该使用 GET 请求，至少不应该放到 path。
- POST 不会被保存到浏览器的历史记录中
- 刷新页面时，若当前的页面是通过 POST 请求得到的，则浏览器会提示用户是否重新提交。若是 GET 请求得到的页面则没有提示。

### 自动解析响应的能力

浏览器不仅能发送请求，还能够针对服务器的各种响应结果做出不同的自动处理。

常见的处理有：

1.  **识别响应码**：
    - 浏览器能够自动识别响应码，当出现一些特殊的响应码时浏览器会自动完成处理，比如 301、302。
2.  **根据响应结果做不同的处理**：
    - 浏览器能够自动分析响应头中的`Content-Type`，根据不同值进行不同处理，比如：
    - `text/plain`：普通的纯文本，浏览器通常会将响应体原封不动的显示到页面上。
    - `text/html`：HTML 文档，浏览器通常会将响应体作为页面进行渲染。
    - `text/javascript或application/javascript`：JS 代码，浏览器通常会使用 JS 执行引擎将它们解析。
    - `text/css`：CSS 代码，浏览器会将它视为样式。
    - `image/jpeg`：浏览器会将它视为 jpg 图片。
    - `application/octet-stream`：二进制数据，会触发浏览器下载功能。
    - `attachment`；附件，会触发下载功能。**该值和其他值不同，应放到`Content-Disposition`**

### 基本流程

用户在地址栏输入了一个 URL 地址，并按下了回车

1.  浏览器自动纠错/补全 URL。对于 URL 里非 ASCII 字符，浏览器会自动进行编码。
2.  浏览器发送 GET 请求，然后根据响应的状态码、`Content-Type`判断是否需要额外操作或者如何处理响应结果。
3.  丢弃旧页面 开始解析 HTML，遇到 link 元素，再次发送 GET 请求，响应 CSS 代码。
4.  解析 CSS 继续解析 HTML，遇到 img 元素，再次发送 GET 请求，响应图片数据。
5.  将图片应用到布局 继续解析 HTML，遇到 script 元素，再次发送 GET 请求，响应 JS 代码。
6.  执行 JS 代码 继续解析 HTML 文档直到完成。

## AJAX

浏览器本身就具备网络通信的能力，但在早期，浏览器并没有把这个能力开发给 JS。

最早是微软在 IE 浏览器中把这里能力向 JS 开放，让 JS 可以在代码中实现发送请求，并且不会刷新页面，这项技术在 2005 年被正式命名为 AJAX(Asynchronous JavaScript And XML)。

AJAX 就是指在 web 应用程序中异步向服务器发送请求。

它的实现方式有两种，XMLHttpRequest（简称 XHR）和 Fetch。

对比：

| 特性                      | XHR                | Fetch              |
| ------------------------- | ------------------ | ------------------ |
| 基本的请求能力            | :white_check_mark: | :white_check_mark: |
| 基本的获取响应能力        | :white_check_mark: | :white_check_mark: |
| 监控请求进度              | :white_check_mark: | :x:                |
| 监控响应进度              | :white_check_mark: | :white_check_mark: |
| Service Worker 中是否可用 | :x:                | :white_check_mark: |
| 控制 cookie 携带          | :x:                | :white_check_mark: |
| 控制重定向                | :x:                | :white_check_mark: |
| 请求取消                  | :x:                | :white_check_mark: |
| 自定义 referrer           | :white_check_mark: | :white_check_mark: |
| 流式请求                  | :x:                | :white_check_mark: |
| API 风格                  | Event              | Promise            |
| 活跃度                    | 停止更新           | 不断更新           |

### Fetch

```javascript
async function loadHeroes() {
  const res = await fetch('https://study.duyiedu.com/api/herolist')
  console.log(res)
  console.log(res.headers.get('content-type'))

  // 1.等待响应体全部传输完成 2.并且解析为纯文本、JS对象、二进制数据等等
  // const bodyTextRes= await res.text()
  // const bodyJsonRes= await res.json()
  // const bodyBlobRes= await res.blob()
  // const bodyArrayBufferRes= await res.arrayBuffer() // 只读的、空间连续的、定长字节数组
}
loadHeroes()
```

![fetch-res](/javascript-img/others/network/fetch-res.png)

首次`await`在 fetch 拿到响应头的时候就已经完成了。第二次才会获取 body 然后根据需求转换为不同数据类型。

### XHR file upload

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>upload progress monitoring</title>
    <style>
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      .add-wrapper {
        width: 100px;
        height: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #ccc;
        border-radius: 8px;
        position: relative;
      }
      .plus {
        width: 50px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        background-color: #f0f0f0;
        border-radius: 50%;
        font-size: 24px;
        color: #333;
        cursor: pointer;

        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      .uploaded-img {
        /* display: none; */
        visibility: hidden;
        width: 100px;
        height: 100px;
        border-radius: 8px;
      }
      .upload-input {
        display: none;
      }
      .progress {
        width: 100%;
        height: 5px;
        background-color: #f0f0f0;
        border-radius: 8px;
        position: absolute;
        bottom: 10px;
        left: 0;
        display: none;
        overflow: hidden;
      }
      .progress-bar {
        width: 0%;
        height: 5px;
        background-color: #4caf50;
        border-radius: 8px;
        transition: width 0.4s ease;
      }
    </style>
  </head>
  <body>
    <div class="add-wrapper">
      <label for="upload-input" class="plus">+</label>
      <input type="file" name="avatar" id="upload-input" class="upload-input" accept="image/png, image/jpeg" />
      <img class="uploaded-img" src="http://mdrs.yuanjin.tech/FgMwAPYq17So9nwVH44ltDHo7u3c" alt="" />
      <div class="progress">
        <div class="progress-bar"></div>
      </div>
    </div>

    <script>
      const $ = document.querySelector.bind(document)
      const doms = {
        wrapper: $('.add-wrapper'),
        plus: $('.plus'),
        uploadedImg: $('.uploaded-img'),
        uploadInput: $('#upload-input'),
        progressBar: $('.progress-bar'),
      }

      doms.uploadInput.addEventListener('change', e => {
        const file = e.target.files[0]
        if (!file) return

        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function (e) {
          doms.uploadedImg.src = e.target.result
        }
        showUploading()

        const formData = new FormData()
        formData.append('avatar', file, file.name) // input框中的name属性；二进制文件对象；文件名
        const xhr = new XMLHttpRequest()
        xhr.open('POST', 'http://localhost:3030/upload')

        xhr.upload.onprogress = function (e) {
          if (e.lengthComputable) {
            const percentComplete = Math.round((e.loaded / e.total) * 100)
            doms.progressBar.style.width = `${percentComplete}%`
          }
        }

        xhr.onload = function () {
          if (xhr.status === 200) {
            const res = JSON.parse(xhr.responseText)
            console.log(res)
          } else {
            console.log('上传失败')
          }
        }

        xhr.send(formData)
      })

      function showUploading() {
        doms.plus.style.display = 'none'
        doms.uploadedImg.style.visibility = 'visible'
        doms.progressBar.style.width = '0%'
        doms.progressBar.parentElement.style.display = 'block'
      }
    </script>
  </body>
</html>
```

nodejs 上传文件代码

```javascript
import express from 'express'
import multer from 'multer'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
)
const port = 3030

const uploadDir = 'uploads/'
// 设置静态文件目录
fs.existsSync(uploadDir) || fs.mkdirSync(uploadDir)

// 配置 Multer 存储方式
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // 设置上传文件存储的目录
  },
  filename: function (req, file, cb) {
    // 给上传的文件添加时间戳防止重名
    cb(null, Date.now() + path.extname(file.originalname))
  },
})

const upload = multer({ storage })

app.use('/uploads', express.static(path.join(__dirname, uploadDir)))

// 单文件上传
app.post('/upload', upload.single('avatar'), (req, res) => {
  console.log(`req`, req, res)
  if (!req.file) {
    return res.status(400).json({ message: '未上传文件' })
  }
  res.json({
    message: '文件上传成功',
    filename: req.file.filename,
    path: `http://localhost:${port}/uploads/${req.file.filename}`,
  })
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
```

# 跨域问题

## 同源策略及跨域问题

**同源策略**是一套浏览器**安全机制**，当一个**源**的文档和脚本，与另一个**源**的资源进行通信时，同源策略就会对这个通信做出不同程度的限制。

简单来说，同源策略对**同源资源 放行**，对**异源资源 限制**。

因此限制造成的开发问题，称之为**跨域（异源）问题**。

### 源

源（origin） = 协议 + 域名 + 端口

例如：

`http://localhost:3030/upload`的源为`http://localhost:3030`

两个 URL 地址的源**完全相同**，则称之为**同源**，否则称之为**异源**。

### 异源出现的场景

- 网络通信
  - a 元素的跳转；加载 css、js、图片等；AJAX 等等
- JS API
  - window.open、window.parent、iframe.contentWindow 等等
- 存储
  - WebStorage、IndexedDB 等等

顿时不同的跨域场景，以及每个场景中不同的跨域方式，同源策略都有不同的限制。

### 网络中的跨域

当浏览器运行页面后，会发出很多的网络请求，例如 CSS、JS、图片、AJAX 等等。

请求页面的源称为**页面源**，在该页面中发出的请求称之为**目标源**。

当页面源和目标源一致时，则为**同源请求**，否则则为**异源请求（跨域请求）**。

浏览器出于多方面的考量，制定了非常繁杂的规则来限制各种跨域请求，但总体的原则非常简单：

- 对标签发出的跨域请求轻微限制
- 对 AJAX 发出的跨域请求**严格限制**

通过 AJAX 发出的跨域请求，服务器通常会返回一个成功响应，失败的原因通常是浏览器**校验不通过**（校验规则就是 CORS 规则）导致的。

## 解决方案

### CORS

CORS(Cross-Origin Resource Sharing)是最正统的跨域解决方案，同时也是浏览器推荐的解决方案。

CORS 是一套规则，用于帮助浏览器判断是否**校验通过**。

CORS 的基本理念是：

- 只要服务器明确表示**允许**，则校验**通过**。
- 服务器明确拒绝或没有表示，则校验**不通过**。

**所以，使用 CORS 解决跨域，必须要保证服务器是「自己人」**

#### 请求分类

CORS 将请求分为两类：**简单请求(simple request)**和**预检请求(preflight request)**。

对不同种类的请求他的规则有所不同。

所以要理解 CORS，首先要理解它是如何划分请求的。

##### 简单请求

> 完整判定逻辑：https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Guides/CORS#%E7%AE%80%E5%8D%95%E8%AF%B7%E6%B1%82

简单来说，只要全部满足以下条件（请求头），就是简单请求：

- 请求方法是 GET、POST、HEAD 之一
- 头部字段满足 CORS 安全规范，详见 [W3C](https://fetch.spec.whatwg.org/#cors-safelisted-request-header)
  > 浏览器默认自带的头部字段都是满足安全规范的，只要开发者不改动和新增头部，就不会打破此条规则
- 如果有`Content-Type`，必须是下列值中的一个
  - text/plain
  - multipart/form-data
  - application/x-www-form-urlencoded

##### 预检请求

只要不是简单请求，就是预检请求。

#### 对简单请求的验证

简单请求时，浏览器会自动在请求头中添加一个`Origin`字段，表示请求的源。

服务器会根据请求头中的`Origin`字段，判断是否允许跨域。

- 如果允许跨域，服务器会在响应头中添加一个`Access-Control-Allow-Origin`字段，值为请求的源或者`*`。
  - `*`表示允许所有源的请求，不推荐使用。
  - `http://a.com`表示只允许`http://a.com`的请求
- 如果不允许跨域，服务器会在响应头中添加一个`Access-Control-Allow-Origin`字段，值为`null`。或者不添加该字段。
  - `null`或者不添加，浏览器认为不允许跨域。

#### 对预检请求的验证

1. 发送预检请求

浏览器不会发出真正的请求，而是先发出一个 OPTIONS 请求。同时告知服务器，该请求的 Origin、请求方法、请求头（改动的）等信息。

预检请求的请求头：

```text
OPTIONS /api/herolist HTTP/1.1
Host: crossdomain.com
...
Origin: http://localhost:3000
Access-Control-Request-Method: POST
Access-Control-Request-Headers:a, b, c, content-type
```

预检请求的响应头：
如果要预检通过，Access-Control-Allow-Origin、Access-Control-Allow-Methods、Access-Control-Allow-Headers 这三个字段是必须的。

```text
HTTP/1.1 200 OK
Date: Wed, 25 Oct 2023 08:00:00 GMT
...
Access-Control-Allow-Origin: http://localhost:3000 # 允许的源
Access-Control-Allow-Methods: POST, GET, OPTIONS # 允许的请求方法（可以更多，但一定要包含预检请求的请求方法）
Access-Control-Allow-Headers: a, b, c, content-type # 允许的请求头（可以更多，但一定要包含预检请求的请求头）
Access-Control-Max-Age: 3600 # 预检请求的有效期，单位秒（表示在这个时间内，浏览器不用再次发出预检请求）

```

2. 发送真正的请求（和简单请求一致）

#### 细节 1 - 关于 cookie

默认情况下，ajax 的跨域请求并不会附带 cookie，这样一来，某些需要权限的操作就无法进行。

不过可以通过简单的配置就可以实现附带 cookie

```javascript
// XHR
const xhr = new XMLHttpRequest()
xhr.withCredentials = true // 允许携带 cookie

// fetch
fetch(url, {
  credentials: 'include', // 允许携带cookie
})
```

这样一来，该跨域的 ajax 请求就是一个*附带身份凭证的请求*。

当一个请求需要附带 cookie 时，无论它是简单请求，还是预检请求，都会在请求头中添加 cookie 字段。

而服务器响应时，需要明确告知客户端：服务器允许这样的凭证。

告知的方式也非常简单，只需要在响应头中添加：`Access-Control-Allow-Credentials: true`。

对于一个附带身份凭证的请求，若服务器没有明确告知，浏览器仍然视为跨域被拒绝。

另外要特别注意的是：**对于附带身份凭证的请求，服务器不得设置`Access-Control-Allow-Origin: *`**。这就是为什么不推荐使用`*`的原因。

#### 细节 2 - 关于跨域获取响应头

在跨域访问时，JS 只能拿到一些最基本的响应头，如：Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma，如果要访问其他头，则需要服务器设置本响应头。

`Access-Control-Expose-Headers`头让服务器把允许浏览器访问的头放入白名单，例如：

```text
Access-Control-Expose-Headers: a, b, c, authorization
```

这样 JS 就能够访问指定的响应头了。

### JSONP

古早，在没有 CORS 的时候

XHR/fetch 只能发送同源请求，只要是异源请求，浏览器都会直接拒绝。所以只能使用奇技淫巧，JSONP 是利用浏览器对于标签跨域的宽松限制，来实现跨域请求的。

nodejs

```javascript
// routes/jsonp.js
import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  const data = { ...req.query }
  delete data.callback

  const cbName = req.query.callback || 'callback'

  res.set('content-type', 'application/javascript')
  res.send(`${cbName}(${JSON.stringify(data)})`)
})

export default router

// app.js
app.use('/jsonp', jsonpRouter)
```

jsonp.html

提前定义好回调函数，浏览器加载到`<script>` 标签的时候，会自动执行这个函数。所以，该方法同样需要前后端配合。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>jsonp</title>
  </head>
  <body>
    <script>
      function callback(data) {
        console.log('get data from jsonp', data)
      }
    </script>
    <script src="http://localhost:3030/jsonp"></script>
  </body>
</html>
```

jsonp 封装

```typescript
export default function jsonp(url: string, params: object) {
  // 1.拼接url
  const paramsStr = Object.keys(params)
    .map(key => `${key}=${params[key]}`)
    .join('&')
  const callbackName = `${Math.random().toString(36).slice(2, 10)}_${Date.now()}`
  const jsonpUrl = `${url}?callback=${callbackName}${paramsStr ? `&${paramsStr}` : ''}`

  // 2.创建Promise对象
  return new Promise(resolve => {
    const script = document.createElement('script')
    script.src = jsonpUrl

    // 3.创建全局函数
    ;(window as any)[callbackName] = function (data: any) {
      resolve(data)
      // 4.删除脚本标签和全局函数
      script.remove()
      delete (window as any)[callbackName]
    }

    document.body.appendChild(script)
  })
}
```

缺点：

- 只能使用 GET 请求
- 容易产生安全隐患（你执行的是远程返回的 JS）
- 安全性和可控性差

**除非是特殊原因，否则永远不应该使用 JSONP**

### 代理

CORS 和 JSONP 均需要服务器是「自己人」。

既然跨域是浏览器同源策略的限制，那我们可以通过自己搭建代理服务器请求跨域资源，然后再把结果返回给浏览器。

nodejs

```javascript
import { Router } from 'express'
import axios from 'axios'

const router = Router()

router.get('/', async (req, res) => {
  const resp = await axios.get('https://game.gtimg.cn/images/lol/act/img/js/heroList/hero_list.js?ts=2906872')
  res.send(resp.data)
})

export default router
```
