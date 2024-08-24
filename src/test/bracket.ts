function isValidVersion1(s: string): boolean {
  const stack: string[] = []
  const obj = {
    '(': ')',
    '[': ']',
    '{': '}',
  }

  for (let i = 0; i < s.length; i++) {
    if (obj[s[i]]) {
      stack.push(obj[s[i]])
    } else {
      if (s[i] !== stack.pop()) {
        return false
      }
    }
  }

  if (stack.length > 0) {
    return false
  }

  return true
}

// type Bracket = '(' | '[' | '{'
const isValid = function (s: string): boolean {
  const map = {
    '(': ')',
    '[': ']',
    '{': '}',
  }
  const stack: string[] = []
  const arr: string[] = Array.from(s)
  console.log('arr', arr)
  arr.forEach(item => {
    if (map[item]) {
      stack.push(map[item])
    } else {
      console.log('stack', stack.pop(), item)
      if (stack.pop() !== item) {
        return false
      }
    }
  })
  if (stack.length) return false
  return true
}

console.log('isValid', isValid('(]')) // false;

// ({}) true
// ([)] false
// ()[]{} true

const res = isValidVersion1('([)]') // true
console.log('res', res)
