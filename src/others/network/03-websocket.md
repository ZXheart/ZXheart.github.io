# :zzz:

模拟聊天

## html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>WebSocket Chat</title>
  </head>
  <body>
    <h1>WebSocket Chat</h1>
    <div>
      <h2>Client 1</h2>
      <div id="chat1"></div>
      <input type="text" id="input1" placeholder="Type a message..." />
      <input type="text" id="recipient1" placeholder="Recipient..." />
      <button onclick="sendMessage1()">Send</button>
    </div>
    <div>
      <h2>Client 2</h2>
      <div id="chat2"></div>
      <input type="text" id="input2" placeholder="Type a message..." />
      <input type="text" id="recipient2" placeholder="Recipient..." />
      <button onclick="sendMessage2()">Send</button>
    </div>

    <script>
      const socket1 = new WebSocket('ws://localhost:3030')
      const socket2 = new WebSocket('ws://localhost:3030')

      socket1.addEventListener('open', event => {
        console.log('Client 1 connected to WebSocket server')
        socket1.send(JSON.stringify({ type: 'register', username: 'client1' }))
      })

      socket1.addEventListener('message', event => {
        const chat1 = document.getElementById('chat1')
        const message = JSON.parse(event.data)
        if (message.type === 'info' || message.type === 'error') {
          chat1.innerHTML += `<p>${message.message}</p>`
        } else {
          chat1.innerHTML += `<p>${message.from}: ${message.content}</p>`
        }
      })

      socket2.addEventListener('open', event => {
        console.log('Client 2 connected to WebSocket server')
        socket2.send(JSON.stringify({ type: 'register', username: 'client2' }))
      })

      socket2.addEventListener('message', event => {
        const chat2 = document.getElementById('chat2')
        const message = JSON.parse(event.data)
        if (message.type === 'info' || message.type === 'error') {
          chat2.innerHTML += `<p>${message.message}</p>`
        } else {
          chat2.innerHTML += `<p>${message.from}: ${message.content}</p>`
        }
      })

      function sendMessage1() {
        const input1 = document.getElementById('input1')
        const recipient1 = document.getElementById('recipient1')
        socket1.send(JSON.stringify({ type: 'message', to: recipient1.value, content: input1.value }))
        input1.value = ''
        recipient1.value = ''
      }

      function sendMessage2() {
        const input2 = document.getElementById('input2')
        const recipient2 = document.getElementById('recipient2')
        socket2.send(JSON.stringify({ type: 'message', to: recipient2.value, content: input2.value }))
        input2.value = ''
        recipient2.value = ''
      }
    </script>
  </body>
</html>
```

nodejs

```javascript
// rotes/websocket.js
export function setupSocket(wss) {
  const clients = new Map()

  wss.on('connection', (ws, req) => {
    console.log('新的客户端连接')

    // 监听客户端发送的用户名
    ws.on('message', message => {
      const parsedMessage = JSON.parse(message)
      if (parsedMessage.type === 'register') {
        const username = parsedMessage.username
        clients.set(username, ws)
        ws.username = username
        ws.send(JSON.stringify({ type: 'info', message: `欢迎 ${username} 连接 WebSocket` }))
      } else if (parsedMessage.type === 'message') {
        const { to, content } = parsedMessage
        const recipientWs = clients.get(to)
        if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
          recipientWs.send(JSON.stringify({ from: ws.username, content }))
        } else {
          ws.send(JSON.stringify({ type: 'error', message: `用户 ${to} 不存在或不在线` }))
        }
      }
    })

    ws.on('close', () => {
      console.log('客户端断开连接')
      clients.delete(ws.username)
    })
  })
}

// app.js
import { WebSocketServer } from 'ws'

const app = express()

// 1.使用http监听的端口或使用其他端口
const wss = new WebSocketServer({ port: 3030 })
setupSocket(wss)

// 2.或者直接使用express同样的端口
// const server = app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

// const wss = new WebSocketServer({ server })
// setupSocket(wss)
```
