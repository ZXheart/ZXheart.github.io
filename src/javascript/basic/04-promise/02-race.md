# :zzz:

## Promise.race

- 接受： 一个`Promise`可迭代对象
- 行为：
  - 第一个完成：返回一个兑现或拒绝的`Promise`结果（`resolve`或`reject`）。
  - “比赛”概念：只有第一个任务会“胜出”，其他任务不再继续执行。
