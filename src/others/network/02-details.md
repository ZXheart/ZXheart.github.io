# :zzz:

## 五层网络模型

五层网络模型从上至下：应用层、网络层、传输层、数据链路层、物理层。在发送消息时，消息从上到下进行打包（封装），每一层都会在上一层基础上加包，
而接收消息时，从下到上进行解包，最终得到原始信息。

### 应用层

应用层主要面向互联网中的应用场景，提供了用户与网络之间的接口，比如网页、邮件、文件传输等，它的代表协议有 http、ftp、smtp、pop2、DNS 等。

### 传输层

传输层主要面向传输过程，比如 TCP 协议是为了保证可靠传输，而 UDP 协议则是一种无连接的广播为了追求速度，牺牲了可靠性。

### 网络层

网络层主要解决如何定位目标以及如何寻找最优路径的问题，比如 IP 协议就是为了定位目标而设计的，而路由协议则是为了寻找最优路径而设计的。

### 数据链路层

数据链路层的作用是将数据在一个子网（广播域）内有效传输，MAC 地址、交换机都是属于该层。

### 物理层

物理层是要解决二进制数据到信号之间的互转问题，集线器、双绞线、同轴电缆、光纤等都是属于该层。

## 加密

### 对称加密

对称加密是指加密和解密使用同一把钥匙：

> 加密方：明文 + 密钥 + 算法（DES） = 密文
>
> 解密方：密文 + 密钥 + 算法（DES） = 明文

常见的对称加密算法：DES、3DES、AES、RC4 等。

优点：速度快

缺点：密钥分发困难。密钥传递时，可能会被中间人截获，导致密钥泄露。

### 非对称加密

非对称加密是指加密和解密使用不同的钥匙，公钥和私钥：

> 服务器端发送*公钥*给客户端
>
> 加密方（客户端）：明文 + 公钥 + 算法（RSA） = 密文
>
> 解密方（服务器）：密文 + 私钥 + 算法（RSA） = 明文

常见的非对称加密算法：RSA、DSA、ECC 等。

优点：密钥分发简单。公钥可以公开，私钥只保留在自己手中。

缺点：仅能一方加密，另一方解密。速度慢。非对称加密的速度比对称加密慢很多，通常用于加密对称密钥。

### 摘要/哈希/散列

摘要/哈希/散列是指将任意长度的输入数据转换为固定长度的输出数据

常见算法：MD5、SHA1、SHA256 等。

优点：速度快，且不可逆。即使输入数据有一点点变化，输出结果也会有很大变化。

缺点：

- 无法解密。数据库中存储的密码经过 MD5 加密后，即便服务器被攻破，攻击者也无法获取明文密码。- 所以 MD5 加密的密码是无法找回的。
- 碰撞。不同的输入*可能*会产生相同的输出结果。- 由于 MD5 输出长度固定（128 位），而输入空间无限，根据鸽巢原理，必然存在不同输入产生相同哈希值的情况。
- 确定性。固定输入产生固定输出。- 由此有一种*暴力破解*的方式，攻击者通过预先计算出大量的输入数据和对应的输出结果，存储在一个表中，称为*彩虹表*。
  当攻击者获取到一个 MD5 密文后，就可以通过查表的方式来获取明文密码。

## JWT

JWT - Json Web Token 是一种开放标准（RFC 7519），为网络应用环境提供**统一的、安全的**令牌格式。

因此 jwt 只是一个令牌格式，你可以把它存储到 cookie，也可以存储到 localstorage，sessionStorage，甚至是 url 中。没有任何限制。

同样的，对于传输，你可以使用任何传输方式来传输 jwt，一般来说，我们会使用消息头来传递它。

比如，当登录成功后，服务器可以给客户端响应一个 jwt：

```text
HTTP/1.1 200 OK
...
set-cookie:token=jwt令牌
authorization:jwt令牌

...
{..., token:jwt令牌}
```

> 它可以（同时）出现在 cookie、响应头、响应体中，以照顾那些没有 cookie 的客户端。尽管这会增加额外的传输量。

然后客户端可以在后续的请求中，将 jwt 作为消息头传递给服务器：

```text
GET /api/resources HTTP/1.1
Host: example.com
...
authorization:bearer jwt令牌
...
```

### 令牌的组成

为了保证令牌的安全性，jwt 令牌有三个部分组成，分别是：

1. header：令牌头部，记录了整个令牌的类型和签名算法
2. payload：令牌负载，记录了保存的主体信息，比如你要保存的用户信息就可以放到这里
3. signature：令牌签名，按照头部固定的算法对整个令牌进行签名，该签名的作用是：保证令牌不被伪造和篡改

他们组合而成的完整格式是：`header.payload.signature`

比如，一个完整的 jwt 令牌如下：

```text
eyJhbGciOiJIUzUxMiJ9.eyJ0b2tlbkV4cFRpbWUiOjI1OTIwMDAwMDAsImxvZ2luTmFtZSI6IjAwMDgiLCJleHBpcnlUaW1lIjoxNzQ3NDAzNjc3ODkwLCJ1c2VyTmFtZSI6Inp4IiwiZXhwIjoxNzQ3NDAzNjc3LCJ1c2VySWQiOiI2MDdkNTBhMy1lZmUyLTQxOTYtOTZjZi0zMWU1YTVhZTU4MjEifQ.TB2cu0xTd9lH_1PZ9hVEjfGcNuj09IG7MqgPIYGEsuelfAyM2oRmcqezlsvnS9mSr0ZzAKBkIFndKmxD6Wh5Jg
```

#### header

它是令牌头部，记录整个令牌的类型和签名算法

它的格式是一个 json 对象，包含两个属性：

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

- alg：signature 部分使用的签名算法，通常可以取两个值

  - HS256：一种对称加密算法，使用同一个密钥对 signature 加密解密
  - RS256：一种非对称加密算法，使用私钥签名，公钥验证

- typ：令牌类型，通常取值为 JWT，或者者不设置

这里仅仅是将 json 对象转为 base64 字符串，base64 是一种编码方式，它的作用是将二进制数据转换为可打印字符，方便在网络中传输。

js 中，`atob()`和`btoa()`可以实现 base64 解码和编码。

#### payload

它是令牌负载，记录了保存的主体信息，比如你要保存的用户信息就可以放到这里

它的格式和 header 一致，同样是 json 对象。同时使用 base64 编码。

```json
{
  "ss": "发行者",
  "iat": "发行时间",
  "exp": 2592000000,
  "nbf": "生效时间",
  "jti": "jwt id",
  "sub": "主题",
  "aud": "接收方",
  "loginName": "0008",
  "userName": "zx"
}
```

上述属性表达的含义分别是：

- ss：发型该 jwt 的是谁，可以写公司名字，也可以写服务器名字
- iat：jwt 的发放时间，通常当前时间戳
- exp：jwt 的过期时间，通常是当前时间戳加上过期时间
- nbf：jwt 的生效时间，在该时间点前 jwt 不生效
- jti：jwt 的唯一标识，通常是一个随机字符串。主要为了防止重放攻击（重放攻击是在某些场景下，用户使用之前的令牌发送到服务器，被服务器正确识别，从而导致不可预期的行为）
- sub：jwt 的主题，该 jwt 是用来干嘛的
- aud：jwt 的接收方，jwt 是给谁的，可以是终端类型，也可以是用户名称

#### signature

这部分是 jwt 的签名，正是它的存在，保证了整个 jwt 不被篡改

这部分的生成，是对前面两个部分的编码结果，按照头部指定的方式进行加密

比如：头部指定的加密方法是`HS256`，前面两部分的编码结果是`eyJhbGciOiJIUzUxMiJ9.eyJ0b2tlbkV4cFRpbWUiOjI1OTIwMDAwMDAsImxvZ2luTmFtZSI6IjAwMDgiLCJleHBpcnlUaW1lIjoxNzQ3NDAzNjc3ODkwLCJ1c2VyTmFtZSI6Inp4IiwiZXhwIjoxNzQ3NDAzNjc3LCJ1c2VySWQiOiI2MDdkNTBhMy1lZmUyLTQxOTYtOTZjZi0zMWU1YTVhZTU4MjEifQ`

第三部分使用对称加密算法`HS256`对前两部分进行加密，当然你得指定一个密钥，比如`shhhhh`

```javascript
function btoa(str) {
  return Buffer.from(str, 'utf8').toString('base64')
}

const res = HS256(btoa(header) + '.' + btoa(payload), 'shhhhh')
// res > TB2cu0xTd9lH_1PZ9hVEjfGcNuj09IG7MqgPIYGEsuelfAyM2oRmcqezlsvnS9mSr0ZzAKBkIFndKmxD6Wh5Jg
```

最终将三部分组合一起，得到完整 jwt

由于签名使用的密钥**保存在服务器**，所以客户端**无法伪造出签名**，因为它拿不到密钥。

之所以无法伪造 jwt，就是因为第三部分的存在。而前面两部分只是一个编码结果，可以认为是明文传输。

> 这不会造成太大的问题，因为既然用户登录成功了，他当前有权利查看自己的用户信息，你要保证的是，不要把敏感信息存放 jwt 中，比如密码、银行卡号等。

jwt 的`signature`可以保证令牌不被伪造，那如何保证令牌不被篡改呢？

比如，某个用户登录成功了，获得了 jwt，但他认为的篡改了 payload，比如把自己的账户余额修改为原来的两倍，然后重新编码出`payload`发送到服务器，服务器如何得知这些信息被篡改过了呢？

这就要说到令牌的验证了

### 令牌的验证

令牌在服务器端组装完成后，会以任意方式发送到客户端

服务器端如何验证客户端后续发回的令牌是否正确？

首先，服务器端要验证这个令牌是否被篡改，就是对`header+payload`用同样的密钥和加密算法进行重新加密。然后把加密的结果和传入的 jwt 的`signature`进行对比，如果一致，则说明没有被篡改。

## 输入 URL

- 1. 纠错/补全 - 补充协议、端口、路径。http 默认 80，https 默认 443，路径默认/
- 2. url 编码 - 将中文、特殊字符转换为%xx 格式；叫做百分号编码。js 中
  - encodeURIComponent()：编码
  - decodeURIComponent()：解码
- 3. 浏览器根据 url 地址查找缓存，命中缓存直接使用，不再发送请求
- 4. 通过 DNS 解析域名，得到 ip 地址
- 5. 浏览器向服务器发出建立 TCP 连接的请求，完成三次挥手，建立连接通道
- 6. 若使用了 https 协议，则需要进行 SSL 握手，建立加密信道
- 7. 浏览器决定携带哪些 cookie 到请求头
- 8. 浏览器自动设置好请求头、协议版本、cookie，发出 GET 请求
- 9. 服务器处理请求，完成处理后，服务器响应一个 HTTP 响应报文给浏览器
- 10. 浏览器根据使用的协议版本，以及 Connection 字段决定是否保留 TCP 链接。http1.1 后默认开启
- 11. 浏览器根据响应状态吗决定如何处理这一响应
- 12. 浏览器根据响应头的 Content-Type 决定如何解析响应体
- 13. 浏览器根据响应头完成其他缓存、cookie 的设置
- 14. 浏览器开始从上到下解析 HTML，如遇到外部资源链接，则进一步请求资源
- 15. 解析过程中生成 DOM 树，CSSOM 树，然后一边生成，一边把两者合并为渲染树，随后对渲染树中的每个节点计算位置和大小（reflow），最后把每个节点利用 GPU 会知道屏幕（repaint）
- 16. 在解析过程中还会触发一系列事件，当 DOM 树完成后会触发 DOMContentLoaded 事件、当所有资源加载完成后会触发 load 事件
