# :zzz:

## [SmooshGate](https://developer.chrome.com/blog/smooshgate)，摘自 Chrome 开发者博客。

## 发生了什么*混乱*？

针对名为`Array#flatten`的 JS 语言功能的提案最终被发现与 Web 不兼容。在 Firefox Nightly 中发布该功能导致至少一个热门网站出现问题。鉴于存在问题的代码是广泛使用的 MooTools 库的一部分，
因此可能有更多网站受到影响。

## Array#flatten 的作用什么？

`Array#flat`（最初提议为`Array#flatten`）会递归展平数组，直到达到指定的`depth`（默认为`1`）。

```javascript
// Flatten one level
const arr = [1, [2, [3]]]
arr.flat() // [1, 2, [3]]

// Flatten recursively until the array contains no more nested arrays
arr.flat(Infinity) // [1, 2, 3]
```

同一提案中还包含`Array#flatMap`，它与`Array#map`类似，但会将结果展平为一个新数组。

```javascript
;[2, 3, 4].flatMap(x => [x, x * 2]) // [2,4,3,6,4,8]
```

## MooTools 在执行什么操作导致了此问题？

MooTools 定义了自己的非标准`Array#flatten`版本：

```javascript
Array.prototype.flatten=/* non-standard implementation */
```

MooTools 的`flatten`实现与提议的标准不同。不过，这不是问题！当浏览器原生提供`Array#flatten`时，MooTools 会替换原生实现。这样可确保无论原生`flatten`是否可用，
依赖于 MooTools 行为的代码都能按预期运行。到目前为止，一切进展顺利！

很遗憾，接下来发生了其他问题。MooTools 会将其所有自定义数组方法复制到`Elements.prototype`（其中`Elements`是 MooTools 专用 API）：

```javascript
for (var key in Array.prototype) {
  Elements.prototype[key] = Array.prototype[key]
}
```

`for..in`会迭代“可枚举”属性，其中不包括`Array#sort`等原生方法，但包括`Array#foo = whatever`等手动赋值的属性。不过，重点是，如果您覆盖不可枚举的
属性（如`Array#sort = whatever`），该属性仍会保持不可枚举状态。

目前，`Array#flatten = mooToolsFlattenImplementation`会创建一个可枚举的`flatten`属性，因此该属性稍后会复制到`Elements`。但是，如果浏览器提供的了原生`flatten`，
则它会变为不可枚举，并且*不会*被复制到`Elements`。**现在，所有依赖与 MooTools 的`Elements#flatten`的代码都已损坏**。

虽然将原生`Array#flatten`更改为可枚举似乎可以解决此问题吃，但可能会导致更多兼容性问题。然后，所有依赖`for..in`来迭代数组的网站（这是一种不良做法，但确实会发生）
都会突然因为`flatten`属性而额外的迭代循环。

这里更大的问题是修改内置对象。如今，扩展原生原型通常被认为是一种不良做法，因为它无法与其他库和第三方代码很好的组合。请勿修改不归您所有的对象！

## 为什么不直接保留现有名称并打破 Web 的规则？

1996 年，在 CSS 广泛普及之前，在“HTML5”成为热门词汇之前[The Space Jam website](https://www.spacejam.com/1996/)正式上线。如今，该网站的运作方式与 22（当前-2018）年前一样。

这是怎么发生的？这些年来，是否有人一直在维护该网站，并在每次浏览器供应商发布新功能时对其进行更新吧？

事实证明，“不要破坏 Web”是 HTML、CSS、JavaScript 以及 Web 上广泛使用的任何其他标准的首要[设计原则](https://www.w3.org/TR/html-design-principles/#support-existing-content)。
如果发布新的浏览器功能导致现有网站无法正常运行，这对*所有人*来说都是不利的：

- 受影响网站的访问者突然获得糟糕的用户体验；

- 网站所有者在没有更改任何内容的情况下，网站从正常运行变为无法正常运行；

- 由于用户发现“它在浏览器 X 中可用”后会切换浏览器，因此发布新功能的浏览器供应商会失去市场份额；

- 一旦发现兼容性问题，其他浏览器供应商就会拒绝发布它。特性说明与事实不
  符（["nothing but a work of fiction"](https://www.webstandards.org/2009/05/13/interview-with-ian-hickson-editor-of-the-html-5-specification/#about-browsers)），
  这不利于标准化流程。

当然，回想起来，MooTools 做错了 —— 但打破 web 规则并不能惩罚他们，而是惩罚用户。这些用户不知道什么是 MooTools，或者，我们也可以找到其他解决方案，用户也还能继续使用网站。
所以选择结果很明显。

## 这是否意味着，无法从 Web 平台中移除糟糕的 API？

这要视具体情况而定。在极少数情况下，不良功能会被移除。机制只是确定是否可以移除某项功能，也是一项非常棘手的工作，需要进行大量遥测来量化有多少网站的行为会发生变化。但
如果相应功能非常不安全、对用户有害或很少使用，则可以这么做。

`<applet>`、`keygen`和`showModalDialog()`都是已成功从 Web 平台中移除的无效 API 的示例。

## 为什么不直接修复 MooTools？

修补 MooTools 以使其不在扩展内置对象是个好主意。不过，这并不能解决这个问题。即使 MooTools 发布了补丁版本，所有使用它的现有网站也必须更新，才能解决兼容性问题。

## 用户就不能更新他们的 MooTools 吗？

理想情况下，MooTools 会发布补丁，然后使用 MooTools 的每个网站都会在第二天神奇的更新。问题解决了，对吗？

很遗憾，这是不现实的。即使有人能够以某种方式识别出所有受影响的网站，设法找到每个网站的联系信息，成功与所有网站所有者联系，并说服他们全部进行更新（这可能
意味着重构整个代码库），整个过程也至少需要数年时间。

请注意，其中许多网站都已经过时，并且可能未得到维护。即使维护者仍然在，他们也可能不像您一样是高技能 Web 开发者。我们不能要求所有人因为网络兼容性
问题而更改 8 年前的网站。

## TC39 流程是如何运作的？

TC39 是负责通过 ECMAScript 标准改进 JavaScript 语言的委员会。

_SmooshGate_ 导致一些人认为“TC39 想要将`flatten`重命名为`smoosh`”，但这只是一个内部笑话，并未向外界充分沟通。我们不会轻易做出更改提案名称等重大决策，
也不会有单个人做出此类决策，更不会根据单个 GitHub 评论在短时间内做出此类决策。

TC39 采用[清晰的功能提案分阶段流程](https://tc39.es/process-document/)。ECMAScript 提案极其任何重大更改（包括方法重命名）会在 TC39 会议期间讨论，
并且需要获得整个委员会的批准才能正式发布。对于`Array#flatten`，该提案已经历了多个协商阶段，一直到第 3 阶段，这表明该功能已经准好在网络浏览器中实现。
在实现过程中出现其他规范问题很常见。在本例中，最重要的反馈是在*尝试发布*该功能后获得的：该功能在当前状态下会破坏 Web。正因如此，TC39 流程不会在浏览器
发布某项功能后就结束，因为还会遇到诸如此类难以预测的问题。

TC39 以共识为基础，这意味着委员会必须就任何新更改达成一致。即使`smoosh`是一个严肃的建议，委员会成员似乎也可能会反对，而更倾向于使用`compact`或`chain`等更常见的名称。

从`flatten`重命名为`smoosh`（即使这不是开玩笑）从未在 TC39 会议上讨论过。因此，目前尚不清楚 TC39 对此主题的官方立场。在下次会议达成共识之前，任何人都不能代表
TC39 全体成员发言。

TC39 会议通常由背景非常多元化的人员参加：有些人拥有多年的编程语言设计经验，有些人从事浏览器或 JS 引擎的工作，并且越来越多的与会者代表 JS 开发者社区。

## SmooshGate 最终是如何解决的？

在[2018 年 5 月的 TC39 会议](https://github.com/tc39/agendas/blob/main/2018/05.md)期间，通过将`flatten`重命名为`flat`，SmooshGate 问题已得到正式解决。
`Array#flat`和`Array#flatMap`已经在 V8 v6.9 和 Chrome69 中发布。
