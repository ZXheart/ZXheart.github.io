# :tada: 网格布局的基本概念

CSS网格布局引入二维网格布局系统，可用于处理网页布局的复杂性。这种布局模式是基于行和列的，可以让开发者将网页分割成多个区域，然后可以在这些区域中放置内容。

##  网格容器(grid container)

通过在元素上声明`display: grid` 或 `display: inline-grid`来创建一个网格容器。网格容器中的所有子元素都会成为*网格项目*。

<!-- <StackBlitz src='https://stackblitz.com/edit/web-platform-fmpycb?embed=1&file=index.html' /> -->
<GridLayout title='Grid container' /> 

## 网格轨道(grid track)

*网格轨道*是网格上任意两条相邻线之间的空间。使用`grid-template-columns`和`grid-template-rows`属性或简写的`grid`属性来定义网格的行和列。
这两个属性都接受一个由空格分隔的值列表，每个值都代表一个网格轨道的宽/高。

这两个属性的值可以是你知道的任何CSS长度单位，也可以是百分比、此外还有一个特殊的单位`fr`，它表示一个网格轨道的剩余空间。

### fr单位 (fraction n.小部分；分数；小数；少量)

`fr`单位表示一个网格轨道的剩余空间。`fr`只会和其他`fr`按比例分配固额(px rem vw vh %...)之外的剩余空间。
 - 所有单位都是`fr`时，`xfr,yfr,zfr`列的宽度分别是`x/(x+y+z), y/(x+y+z), z/(x+y+z)`。
 - 如果有固额和`fr`时，除去固额后，剩余空间按比例分配给`fr`。例如，`100px 1fr 1fr`，第二列和第三列的宽度都是`(100% - 100px) / 2`。


### 网格列(grid column)
- `grid-template-columns: 100px 100px 100px;` 三列，每列宽度为100px
- `grid-template-columns: 1fr 1fr 1fr;` 三列，每列宽度为1fr 

### 网格行(grid row)
