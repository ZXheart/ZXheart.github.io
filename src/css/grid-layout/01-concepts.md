<script setup>
import Container  from '../components/grid/01-Container.vue'
import Columns  from '../components/grid/02-Columns.vue'
import FrUnit from '../components/grid/03-FrUnit.vue'
import FrUnequalSize from '../components/grid/04-FrUnequalSize.vue'
import FrAndAbsolute from '../components/grid/05-FrAndAbsolute.vue'
import ImplicitGrid from '../components/grid/06-ImplicitGrid.vue'
import MinmaxFunc from '../components/grid/07-MinmaxFunc.vue'
import GridLines from '../components/grid/08-GridLines.vue'
import AgainstLines from '../components/grid/09-AgainstLines.vue'
import LineShorthands from '../components/grid/10-LineShorthands.vue'
import Gap from '../components/grid/11-Gap.vue'
</script>

# :satisfied: 前言

跟随[MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_grid_layout/Basic_concepts_of_grid_layout)，学习grid布局

本文示例使用[UnoCSS](https://unocss.dev/)，在阅读之前最好对UnoCSS有一定了解。

使用了`presetUno`和`presetWind`两个预设，`presetUno`是UnoCSS的默认预设，`presetWind`是TailwindCSS的预设，书写方法及功能更加丰富。


# :point_right: 基本概念

二维网格布局，随意指定网格元素大小位置，比flex粒度更细，更适合复杂布局。

## 网格容器(Grid container)

通过在元素上声明`display: grid` 或 `display: inline-grid`来创建一个网格容器。网格容器中的所有子元素都会成为*网格元素*。看起来和常规块元素无二致，其实已经能精准随意摆布*网格元素*

``` vue{15,16}
<template>
  <div class="
    common-wrapper
    grid <!-- [!code ++] -->
  ">
    <div class="common-item">1</div>
    <div class="common-item">2</div>
    <div class="common-item">3</div>
    <div class="common-item">4</div>
    <div class="common-item">5</div>
  </div>
</template>

<style>
  /* style标签上没有使用scope和module，该SFC定义如下两个style全局适用。
    其它SFC文件将不再声明直接引用 */
  .common-wrapper{
    @apply bg-soft-e b-rd-8px py-20px px-24px;
  }
  .common-item {
    @apply b-rd-8px bg-soft-a;
  }
</style>
```
<Container /> 

## 网格轨道(Grid tracks)

**网格轨道是网格上任意两条相邻线之间的空间**。使用`grid-template-columns`和`grid-template-rows`属性或简写的`grid`属性来定义网格的行和列。

### 基本示例

为[上边示例](#网格容器-grid-container)添加`grid-template-columns: 150px 150px 150px;`属性，将网格容器中的子元素被分成了三列，每列宽度为150px。
还能得到的信息：
- 仅指定网格元素宽度，网格元素的高度就由内容决定(其实就是隐式轨道)
- 若网格元素的总宽度小于网格容器的宽度，那么剩余空间将会被留白

``` vue
<template>
  <div class="
    common-wrapper
    grid grid-cols-[150px_150px_150px] <!-- [!code ++] -->
  ">
    <div class="common-item">1</div>
    <div class="common-item">2</div>
    <div class="common-item">3</div>
    <div class="common-item">4</div>
    <div class="common-item">5</div>
  </div>
</template>
```
<Columns />

### fr单位 (fraction)

`grid-template-columns`和`grid-template-rows`属性值可以是你知道的任何CSS长度单位，此外还有一个特殊的单位`fr`，它表示一个网格轨道的剩余空间。
`fr`只会和其他`fr`按比例分配固额(px rem vw vh %...)之外的剩余空间。

网格容器中的子元素被分成了三列，每列宽度为1fr，即三列等宽。

``` vue
<template>
  <div class="
    common-wrapper
    grid grid-cols-3 <!-- [!code ++] -->
  ">
    <div class="common-item">1</div>
    <div class="common-item">2</div>
    <div class="common-item">3</div>
    <div class="common-item">4</div>
    <div class="common-item">5</div>
  </div>
</template>
```
<FrUnit />

### 不同比例

网格容器中的子元素被分成了三列，宽度分别为1fr 2fr 1fr。

``` vue
<template>
  <div class="
    common-wrapper
    grid grid-cols-[1fr_2fr_1fr] <!-- [!code ++] -->
  ">
    <div class="common-item">1</div>
    <div class="common-item">2</div>
    <div class="common-item">3</div>
    <div class="common-item">4</div>
    <div class="common-item">5</div>
  </div>
</template>
<style>
</style>
```
<FrUnequalSize />

### 绝对单位和fr单位混用

正如前边所说，`fr`只会和其他`fr`按比例分配固额(px rem vw vh %...)之外的剩余空间。

网格容器中的子元素被分成了三列，宽度分别为1fr 100px 1fr。

``` vue
<template>
  <div class="
    common-wrapper
    grid grid-cols-[1fr_100px_1fr] <!-- [!code ++] -->
   ">
    <div class="common-item">1</div>
    <div class="common-item">2</div>
    <div class="common-item">3</div>
    <div class="common-item">4</div>
    <div class="common-item">5</div>
  </div>
</template>
```
<FrAndAbsolute />

### repeat()函数

`repeat()`函数可以重复部分或整个轨道列表。

1. `repeat()`函数重复整个轨道列表，如下两个示例等价。

``` css {2,5}
.example1 {
  grid-template-columns: 1fr 1fr 1fr;
}
.example2 {
  grid-template-columns: repeat(3, 1fr);
}
```

2. `repeat()`函数重复部分轨道列表，如下两个示例等价。

``` css {2,5}
.example1 {
  grid-template-columns: 100px 1fr 1fr 1fr 100px 1fr 1fr 1fr 1fr;
}
.example2 {
  grid-template-columns: 100px repeat(3, 1fr) 100px repeat(4, 1fr);
}
```

3. `repeat()`函数可以创建一个多轨道模式的重复轨道列表。如下两个示例等价。

``` css {2,5,8}
.example1 {
  grid-template-columns: 1fr 2fr 1fr 2fr 1fr 2fr 1fr 2fr;
}
.example2 {
  grid-template-columns: repeat(4, 1fr 2fr);
}

/* 你也可以将示例2中`example1`改成如下写法，依然可行 */
.example3 {
  grid-template-columns: repeat(2, 100px 1fr 1fr 1fr) 1fr;
}
```

### 显式和隐式网格轨道

 `grid-template-columns`和`grid-template-rows`属性定义的是显式网格轨道，它们定义了网格的结构。
 如上示例，我们使用`grid-template-columns`显式定义了列轨道，但是网格容器会自行创建行轨道，这些行轨道称为 **隐式网格轨道**。

 默认**隐式轨道会自动调整大小，取决于它们轨道内的内容**

 也可以通过`grid-auto-rows`和`grid-auto-columns`属性来定义隐式网格轨道的大小。

 使用`grid-auto-rows: 50px`来定义隐式网格轨道的高度为50px。

``` vue
<template>
  <div class="
    common-wrapper
    grid grid-cols-3 
    grid-auto-rows-50px <!-- [!code ++] -->
  ">
    <div class="common-item">1</div>
    <div class="common-item">2</div>
    <div class="common-item">3</div>
    <div class="common-item">4</div>
    <div class="common-item">5</div>
  </div>
</template>
```
<ImplicitGrid />

### minmax()函数

minmax()函数定义一个长宽范围的闭区间。在设置**显式网格**或定义**自动创建的行或列**的大小时，可以为其设置一个最小值和最大值。


1. 设置显示网格的大小。缩放浏览器，第二列轨道的宽度会在150px和1fr之间变化。浏览器宽度足够时，第二列与其他两列等宽。反之，第二列最小宽度为150px。
``` vue
<template>
  <div class="
    common-wrapper
    grid
    explicit <!-- [!code ++] -->
  ">
    <div class="common-item">1</div>
    <div class="common-item">2</div>
    <div class="common-item">3</div>
    <div class="common-item">4</div>
    <div class="common-item">5</div>
  </div>
</template>
<style>
  .explicit { /* [!code ++:3] */
    grid-template-columns: 1fr minmax(150px, 1fr) 1fr;
  }
</style>
```
<MinmaxFunc />

2. 设置自动创建的行的大小。根据内容多少，自动创建的行高度最小为50px，最大会根据内容多少自动调整
``` vue
<template>
  <div class="
    grid 
    implicit <!-- [!code ++] -->
   ">
    <div class="common-item">
      1
      <div class="h-50px implicit-item">高50px的内容</div>
    </div>
    <div class="common-item">
      2
      <div class="h-80px implicit-item">高80px的内容</div>
    </div>
    <div class="common-item">
      3
      <div class="h-120px implicit-item">高120px的内容</div>
    </div>
    <div class="common-item">4</div>
    <div class="common-item">5</div>
  </div>
</template>
<style>
  .implicit { /* [!code ++:4] */
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: minmax(50px, auto);
  }
  .implicit-item{
    @apply b-1 b-solid b-soft-d b-rd-8px;
  }
</style>
```
<MinmaxFunc minmax="implicit" />

## 网格线(Grid lines)

我们先前定义网格时，定义的时是网格轨道，不是**网格线**。网格布局为我们创建带编号的网格线，精确地控制每一个网格元素。
如下三列两行网格中，包含**四纵**和**三横**网格线。

<GridLines />

网格线的编号顺序取决于文章的书写模式，我们是自左到右，编号1的网格线在最左边。

### 根据网格线定位元素

使用`grid-column-start`、`grid-column-end`和`grid-row-start`、`grid-row-end`属性配合网格线，可以精确地控制每一个网格元素。

`col-start-1`和`col-end-3`表示从纵1到纵3，即`common-item-1`占用2条纵轨道的宽度

`row-start-1`和`row-end-3`表示从横1到横3，即`common-item-1`占用2条横轨道的高度

``` vue
<template>
  <div class="common-wrapper grid grid-cols-3 grid-auto-rows-50px">
    <div class="common-item <!-- [!code highlight:5] -->
      col-start-1 col-end-3 row-start-1 row-end-3 <!-- [!code ++] -->
    ">
      1
    </div>
    <div class="common-item">2</div>
    <div class="common-item">3</div>
    <div class="common-item <!-- [!code highlight:10] -->
      col-start-1 col-end-2 row-start-3 row-end-5  <!-- [!code ++] -->
    ">
      4
    </div>
    <div class="common-item
      col-start-2 col-end-4 row-start-3 row-end-5  <!-- [!code ++] -->
    ">
      5
    </div>
  </div>
</template>
<style>
</style>
```
<AgainstLines />

### 简写

``` css
/* 以下两个示例等价 */
.example1{
  grid-column-start:1;
  grid-column-end:3;
  grid-row-start:1;
  grid-row-end:3;
}
.example2{
  grid-column:1/3;
  grid-row:1/3;
}
```
记录在`UnoCSS`中的使用，注意`presetUno`预设中不支持中括号语法。需要导入`presetWind`预设。
``` vue
<template>
  <div class="common-wrapper grid grid-cols-3 grid-auto-rows-50px">
    <div class="common-item">1</div>
    <div class="common-item <!-- [!code highlight:5] -->
      col-[2/3] row-[1/3] <!-- [!code ++] -->
    ">
      2
    </div>
    <div class="common-item">3</div>
    <div class="common-item">4</div>
    <div class="common-item">5</div>
  </div>
</template>
```
<LineShorthands />

### 默认跨度(default spans)

上边示例都指明了`grid-*-end`，但实际上如果一个元素只延伸一个轨道，可以省略`grid-*-end`属性，元素**默认延伸一个轨道**

如下四种写法完全一致

``` css
.example1{
  grid-column-start:1;
  grid-column-end:2;
}
.example2{
  grid-column-start:1;
}
.example3{
  grid-column:1/2;
}
.example4{
  grid-column:1;
}
```
总结，你的`grid-*-start: x;`和`grid-*-end: y;`中如果符合 `y - x === 1`，那么可以省略`grid-*-end: y;`。

### grid-area属性

可以更进一步，使用`grid-area`属性来同时指定`grid-*-start`和`grid-*-end`四个属性。

`grid-area`分别指定`grid-row-start`、`grid-column-start`、`grid-row-end`和`grid-column-end`属性的值。

**上 左 下 右** 的顺序，与常见的`padding`、`margin`、`border`等属性的简写(上 右 下 左)顺序相反


如下两个示例等价
``` css
.example1{
  grid-row-start:1;
  grid-row-end:3;
  grid-column-start:1;
  grid-column-end:3;
}
.example2{
  grid-area:1/1/3/3;
}
```

### 负数网格线

我们可以从最右端的列线和底端的行线开始计数，这两条线会被记为`-1`，倒数第2条线记为`-2`，以此类推。
注意，最后一条线是指显示定义的最后一条线，即`grid-template-columns`和`grid-template-rows`定义的网格，隐式定义的网格不会被考虑在内。

## 网格间距

网格元素间的列间距和行间距可以使用`column-gap`和`row-gap`或者简写`gap`属性来设置。

`gap`属性值可以是任何单位，除了`fr`。

 `row-gap:10px; column-gap:20px;`等价于`gap:10px 20px;`表示行间距为10px，列间距为20px。
``` vue
<template>
  <div class="common-wrapper grid grid-cols-3
     gap-[10px_20px] <!-- [!code ++] -->
  ">
    <div class="common-item">1</div>
    <div class="common-item">2</div>
    <div class="common-item">3</div>
    <div class="common-item">4</div>
    <div class="common-item">5</div>
  </div>
</template>
```
<Gap />

## 网格区域
// TODO 
