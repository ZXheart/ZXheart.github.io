# :zzz:

```javascript
// arr
const arr = [
  { id: 1, value: 1, parent: null },
  { id: 2, value: 2, parent: 1 },
  { id: 3, value: 3, parent: 2 },
  { id: 4, value: 4, parent: 1 },
]

//2

// tree
const tree = [
  {
    id: 1,
    value: 1,
    parent: null,
    children: [
      { id: 2, value: 2, parent: 1, children: [{ id: 3, value: 3, parent: 2, children: [] }] },
      { id: 4, value: 4, parent: 1, children: [] },
    ],
  },
]

// 1
function array2tree(arr) {
  const map = arr.reduce((acc, cur) => {
    acc[cur.id] = { ...cur, children: [] }
    return acc
  }, {})

  const tree = []
  for (const node of arr) {
    if (node.parent === null) {
      tree.push(map[node.id])
    } else {
      map[node.parent].children.push(map[node.id])
    }
  }

  return tree
}

// 2
function array2tree(arr) {
  const map = new Map()
  arr.forEach(node => {
    map.set(node.id, { ...node, children: [] })
  })

  const root = []
  arr.forEach(node => {
    if (node.parent === null) {
      root.push(map.get(node.id))
    } else {
      map.get(node.parent).children.push(map.get(node.id))
    }
  })
  return root
}
```
