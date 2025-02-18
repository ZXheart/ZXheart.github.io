# :zzz:

## Promise.any

- 接受： 一个`Promise`可迭代对象
- 行为：
  - 任意一个兑现：返回第一个兑现（`resolve`）的`Promise`结果。
  - 全部拒绝：如果所有`Promise`都被拒绝，返回一个包含所有拒绝原因`AggregateError`错误。
