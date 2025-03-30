# :zzz:

## 随机[a, b]的整数

```typescript
/**
 * 随机[a, b]的整数
 * @param a
 * @param b
 */
function randomInt(a: number, b: number): number {
  return Math.floor(Math.random() * (b + 1 - a)) + a
}
```
