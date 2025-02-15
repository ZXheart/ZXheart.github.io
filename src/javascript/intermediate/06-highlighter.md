# :zzz:

```css
::highlight(custom-highlight) {
  color: red;
}
```

```javascript
const isCSSHighlightSupported = 'highlight' in CSS

function isNodeList(obj) {
  return NodeList.prototype.isPrototypeOf(obj)
}

function isElement(obj) {
  return Element.prototype.isPrototypeOf(obj)
}

function isHTMLCollection(obj) {
  return HTMLCollection.prototype.isPrototypeOf(obj)
}

/**
 * @description highlighter
 * @param {string} keyword - keyword to be highlighted
 * @param {Element} lightEls - elements to be highlighted
 * @param {string} lightClass - class to be added to the element.  e.g. 'custom-highlight' above
 * @param {Element} container - container element
 */
function highlighter(keyword, lightEls, lightClass, container = document.body) {
  if (!isCSSHighlightSupported) {
    throw new Error('CSS Highlight is not supported')
  }

  if (typeof keyword !== 'string') {
    throw new Error('Keyword must be a string')
  }
  if (keyword.trim() === '') {
    throw new Error('Keyword cannot be empty')
  }
  const key = keyword.trim().toLowerCase()

  if (typeof lightClass !== 'string') {
    throw new Error('lightClass must be a string')
  }
  if (lightClass.trim() === '') {
    throw new Error('lightClass cannot be empty')
  }

  if (!isNodeList(lightEls) && !isHTMLCollection(lightEls) && !isElement(lightEls)) {
    throw new Error('lightEls should be an Element, NodeList or HTMLCollection')
  }

  const els = lightEls.length ? Array.from(lightEls) : [lightEls]

  // 获取所有文本节点[[textNode1,textNode2,...],[textNode3,textNode4,...],...]
  const textNodes = els.map(el => {
    // createTreeWalker(root, whatToShow, filter)
    // 创建一个TreeWalker对象，用于遍历文档树中的文本节点
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)

    const nodes = []

    let node = walker.nextNode()
    while (node) {
      nodes.push(node)
      node = walker.nextNode()
    }

    return nodes
  })

  const ranges = textNodes
    .flat()
    .map(node => ({ node, text: node.textContent.toLowerCase() }))
    .map(({ node, text }) => {
      const allIndex = []

      let start = 0

      // 获取所有匹配的索引
      //   while (start < text.length) {
      //     const index = text.indexOf(key, start)
      //     if (!~index) break
      //     allIndex.push(index)
      //     start = index + key.length
      //   }

      // 只获取第一个匹配的索引
      const index = text.indexOf(key, start)

      if (~index) allIndex.push(index)

      // [{collapsed:false, commonAncestorContainer:Text, startContainer:Text,
      //  startOffset:0, endContainer:Text, endOffset:5, ...}, ...]
      return allIndex.map(index => {
        const range = new Range()

        range.setStart(node, index)
        range.setEnd(node, index + key.length)

        return range
      })
    })
    .flat()

  const resultHighlight = new Highlight(...ranges)

  CSS.highlights.set(lightClass, resultHighlight)
}
```
