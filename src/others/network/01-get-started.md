# :zzz:

## 网络模型

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
从网络中 **哪台计算机（domain）** 中的 **哪个程序（port）** 寻找 **哪个服务（path）**，并注明了获取服务的 **具体细节（path、query、hash）**，以及要用什么样的 **协议通信（scheme）**。

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
