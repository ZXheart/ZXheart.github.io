# :zzz:

## 静态（Static）元素 vs 动态（Live）元素

- **静态（Static）**

  - 定义：
    - 静态集合在创建时会“快照”当前的 DOM 状态。
    - 即使后续 DOM 发生变化，静态集合的内容不会随之更新。
  - 特点：
    - 性能较高，因为不需要实时查询 DOM。
    - 常见于`querySelectorAll`返回的`NodeList`。

- **动态（Live）**

  - 定义：
    - 动态集合会实时反应 DOM 的变化。
    - 如果 DOM 中添加、删除或修改了相关元素，动态集合会立即更新。
  - 特点：
    - 性能较低，因为每次访问都会重新查询 DOM。
    - 常见于`getElementsByTagName`和`getElementsByClassName`返回的`HTMLCollection`。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div class="container">
      <a href="#" class="a-el">1</a>
      <a href="#" class="a-el">2</a>
    </div>

    <script>
      const nodeListEls = document.querySelectorAll('.a-el')
      const collectionEls = document.getElementsByClassName('a-el')
      console.log('Initial static NodeList', nodeListEls) // NodeList(2) [a.a-el, a.a-el]
      console.log('Initial Live HTMLCollection', collectionEls) // HTMLCollection(2) [a.a-el, a.a-el]

      const newAEl = document.createElement('a')
      newAEl.textContent = '3'
      newAEl.href = '#'
      newAEl.className = 'a-el'
      document.querySelector('.container').appendChild(newAEl)

      console.log('Updated static NodeList', nodeListEls) // NodeList(2) [a.a-el, a.a-el]
      console.log('Updated Live HTMLCollection', collectionEls) // HTMLCollection(3) [a.a-el, a.a-el, a.a-el]
    </script>
  </body>
</html>
```
