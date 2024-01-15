<script setup>
import Container  from '../components/grid/01-Container.vue'
import Columns  from '../components/grid/02-Columns.vue'
import FrUnit from '../components/grid/03-FrUnit.vue'
import FrUnequalSize from '../components/grid/04-FrUnequalSize.vue'
import FrAndAbsolute from '../components/grid/05-FrAndAbsolute.vue'
import ImplicitGrid from '../components/grid/06-ImplicitGrid.vue'
import MinmaxFunc from '../components/grid/07-MinmaxFunc.vue'
</script>

# :tada: 网格布局的基本概念

CSS网格布局引入二维网格布局系统，可用于处理网页布局的复杂性。这种布局模式是基于行和列的，可以让开发者将网页分割成多个区域，然后可以在这些区域中放置内容。

##  网格容器(grid container)

通过在元素上声明`display: grid` 或 `display: inline-grid`来创建一个网格容器。网格容器中的所有子元素都会成为*网格元素*。目前看来和正常
block元素并无二致，其实这些*网格元素*任人摆布

``` vue
<template>
  <div class="
    grid <!-- [!code ++] -->
    bg-#161618  b-rd-8px my-20px py-20px p-24px
  ">
    <div class="common-item">1</div>
    <div class="common-item">2</div>
    <div class="common-item">3</div>
    <div class="common-item">4</div>
    <div class="common-item">5</div>
  </div>
</template>
<style>
  .common-item {
    @apply b-rd-8px bg-#272843;
  }
</style>
```
<Container /> 

## 网格轨道(grid track)

***网格轨道*是网格上任意两条相邻线之间的空间**。使用`grid-template-columns`和`grid-template-rows`属性或简写的`grid`属性来定义网格的行和列。

### 基本示例

为[上边示例](#网格容器grid-container)添加`grid-template-columns: 150px 150px 150px;`属性，将网格容器中的子元素被分成了三列，每列宽度为150px。
还能得到的信息：
- *网格元素*的高度是由内容决定的，宽度是由已设置的网格轨道(150px)决定的
- 如若*网格元素*的总宽度小于*网格容器*的宽度，那么剩余空间将会被留白

``` vue
<template>
  <div class="
     grid 
     cols-150px <!-- [!code ++] -->
     bg-#161618 b-rd-8px my-20px py-20px p-24px
   ">
    <div class="common-item">1</div>
    <div class="common-item">2</div>
    <div class="common-item">3</div>
    <div class="common-item">4</div>
    <div class="common-item">5</div>
  </div>
</template>
<style>
  .cols-150px { /* [!code ++:3] */
    grid-template-columns: 150px 150px 150px;
  }
  .common-item {
    @apply b-rd-8px bg-#272843;
  }
</style>
```
<Columns />

### fr单位 (fraction n.小部分；分数；小数；少量)

`grid-template-columns`和`grid-template-rows`属性值可以是你知道的任何CSS长度单位，此外还有一个特殊的单位`fr`，它表示一个网格轨道的剩余空间。
`fr`只会和其他`fr`按比例分配固额(px rem vw vh %...)之外的剩余空间。

 如下示例，网格容器中的子元素被分成了三列，每列宽度为1fr，即三列等宽。

``` vue
<template>
  <div class="
     grid 
     cols-3fr <!-- [!code ++] -->
     bg-#161618 b-rd-8px my-20px py-20px p-24px
   ">
    <div class="common-item">1</div>
    <div class="common-item">2</div>
    <div class="common-item">3</div>
    <div class="common-item">4</div>
    <div class="common-item">5</div>
  </div>
</template>
<style>
  .cols-3fr { /* [!code ++:3] */
    grid-template-columns: 1fr 1fr 1fr;
  }
  .common-item {
    @apply b-rd-8px bg-#272843;
  }
</style>
```
<FrUnit />

### 不同比例

如下示例，网格容器中的子元素被分成了三列，每列宽度为1fr 2fr 1fr，可用空间四等分，其中第二轨道占用了两份，其余轨道各占用一份。

``` vue
<template>
  <div class="
     grid 
     cols-unequal-fr <!-- [!code ++] -->
     bg-#161618 b-rd-8px my-20px py-20px p-24px
   ">
    <div class="common-item">1</div>
    <div class="common-item">2</div>
    <div class="common-item">3</div>
    <div class="common-item">4</div>
    <div class="common-item">5</div>
  </div>
</template>
<style>
  .cols-unequal-fr { /* [!code ++:3] */
    grid-template-columns: 1fr 2fr 1fr;
  }
  .common-item {
    @apply b-rd-8px bg-#272843;
  }
</style>
```
<FrUnequalSize />

### 绝对单位和fr单位混用

正如之前所说，`fr`只会和其他`fr`按比例分配固额(px rem vw vh %...)之外的剩余空间。

如下示例，网格容器中的子元素被分成了三列，每列宽度为1fr 100px 1fr，可用空间四等分，其中第二轨道占用了100px，其余轨道各占用一份。


``` vue
<template>
  <div class="
     grid 
     cols-absolute-fr <!-- [!code ++] -->
     bg-#161618 b-rd-8px my-20px py-20px p-24px
   ">
    <div class="common-item">1</div>
    <div class="common-item">2</div>
    <div class="common-item">3</div>
    <div class="common-item">4</div>
    <div class="common-item">5</div>
  </div>
</template>
<style> 
  .cols-absolute-fr { /* [!code ++:3] */
    grid-template-columns: 1fr 100px 1fr;
  }
  .common-item {
    @apply b-rd-8px bg-#272843;
  }
</style>
```
<FrAndAbsolute />

### repeat()函数

1. `repeat()`函数可以重复部分或整个轨道列表，如下两个示例等价。

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

3. `repeat()`函数可以传入一个轨道列表，它可以创建一个多轨道模式的重复轨道列表。如下两个示例等价。

``` css {2,5}
.example1 {
  grid-template-columns: 1fr 2fr 1fr 2fr 1fr 2fr 1fr 2fr;
}
.example2 {
  grid-template-columns: repeat(4, 1fr 2fr);
}

/* 你也可以将示例2中`example2`改成如下写法，依然可行 */
.example3 {
  grid-template-columns: repeat(2, 100px 1fr 1fr 1fr) 1fr;
}
```

### 显式和隐式网格轨道

 `grid-template-columns`和`grid-template-rows`属性定义的是显式网格轨道，它们定义了网格的结构。
 如上示例，我们使用`grid-template-columns`显式定义了列轨道，但是网格容器会自行创建行轨道，这些行轨道称为隐式网格轨道。

 默认**这些隐式轨道会自动调整大小，取决于它们轨道内的内容**

你也可以通过`grid-auto-rows`和`grid-auto-columns`属性来定义隐式网格轨道的大小。

如下示例，使用`grid-auto-rows: 50px`来定义隐式网格轨道的高度为50px。

``` vue
<template>
  <div class="
    grid cols-absolute-fr 
    grid-auto-rows-50px <!-- [!code ++] -->
     bg-#161618 b-rd-8px py-20px p-24px
  ">
    <div class="common-item">1</div>
    <div class="common-item">2</div>
    <div class="common-item">3</div>
    <div class="common-item">4</div>
    <div class="common-item">5</div>
  </div>
</template>
<style>
  .cols-absolute-fr {
    grid-template-columns: 1fr 100px 1fr;
  }
  .common-item {
    @apply b-rd-8px bg-#272843;
  }
</style>
```
<ImplicitGrid />

### minmax()函数

minmax()函数定义一个长宽范围的闭区间。在设置*显示网格*或定义*自动创建的行或列*的大小时，可以为其设置一个最小值和最大值。


1. 设置显示网格的大小，缩放浏览器，第二列轨道的宽度会在150px和300px之间变化。
``` vue
<template>
  <div class="
    grid
    explicit <!-- [!code ++] -->
    bg-#161618 b-rd-8px py-20px p-24px
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
    grid-template-columns: 1fr minmax(15px, 300px) 1fr;
  }
  .common-item {
    @apply b-rd-8px bg-#272843;
  }
</style>
```
<MinmaxFunc />

1. 设置自动创建的行的大小，根据内容多少，自动创建的行高度最小为50px，最大会根据内容多少自动调整
``` vue
<template>
  <div class="
    grid 
    implicit <!-- [!code ++] -->
     bg-#161618 b-rd-8px py-20px p-24px
   " >
    <div class="common-item">
      1
      <div class="h-50px b-1 b-solid b-#42b883 b-rd-8px">高50px的内容</div>
    </div>
    <div class="common-item">
      2
      <div class="h-80px b-1 b-solid b-#42b883 b-rd-8px">高80px的内容</div>
    </div>
    <div class="common-item">
      3
      <div class="h-120px b-1 b-solid b-#42b883 b-rd-8px">高120px的内容</div>
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
  .common-item {
    @apply b-rd-8px bg-#272843;
  }
</style>
```
<MinmaxFunc minmax="implicit" />

## 网格线(grid line)

我们先前定义网格时，定义的时网格轨道，不是网格线。网格布局为我们创建带编号的网格线，精确地定义每一个网格元素。