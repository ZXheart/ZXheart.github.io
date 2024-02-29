<script setup lang="ts">
import { useData } from 'vitepress'

const { isDark } = useData()
</script>

<template>
  <div class="common-wrapper" :class="[isDark ? 'dark-wrapper' : 'light-wrapper']">
    <div
      class="
      grid grid-cols-3 grid-auto-rows-120px
      b-2 b-solid b-y-#ffb6c1 b-x-#42b883
      pos-relative"
    >
      <div class="item pos-relative" :class="[isDark ? 'dark-item' : 'light-item']">
        1
        <!-- 纵1 & 2 -->
        <div
          class="
          circle bg-#42b883
          bottom-0 left-0 -translate-x-50% translate-y-50% z-9"
        >
          纵1
        </div>
        <div
          class="
          circle bg-#42b883
          bottom-0 right-0  translate-x-50% translate-y-50% z-9"
        >
          纵2
        </div>
      </div>
      <div class="item pos-relative" :class="[isDark ? 'dark-item' : 'light-item']">
        2
        <!-- 横1 & 2 -->
        <div
          class="
          circle bg-#ffb6c1
          top-0 left-50% -translate-x-50% -translate-y-50% z-9"
        >
          横1
        </div>
        <div
          class="
          circle bg-#ffb6c1
          bottom-0 left-50% -translate-x-50% translate-y-50% z-9"
        >
          横2
        </div>
      </div>
      <div class="item pos-relative" :class="[isDark ? 'dark-item' : 'light-item']">
        3
        <!-- 纵3 & 4 -->
        <div
          class="
          circle bg-#42b883
          bottom-0 left-0 -translate-x-50% translate-y-50% z-9"
        >
          纵3
        </div>
        <div
          class="
          circle bg-#42b883
          bottom-0 right-0 translate-x-50% translate-y-50% z-9"
        >
          纵4
        </div>
      </div>
      <div class="item" :class="[isDark ? 'dark-item' : 'light-item']">
        4
      </div>
      <div class="item" :class="[isDark ? 'dark-item' : 'light-item']">
        5
        <!-- 横3 -->
        <div
          class="
          circle bg-#ffb6c1
          bottom-0 left-50% -translate-x-50% translate-y-50% z-9"
        >
          横3
        </div>
      </div>
      <!-- 中间一条横粉线 -->
      <div class="pos-absolute top-120px w-full h-2px bg-#ffb6c1" />
      <!-- 中间两条竖灰线 -->
      <div class="vertical-grey-line left-33.33%" />
      <div class="vertical-grey-line right-33.33%" />
    </div>
  </div>
</template>

<style>
  .item {
    --at-apply:  text-center lh-120px;
  }
  .dark-item{
    --at-apply:  bg-#222529;
  }
  .light-item{
    --at-apply:  bg-#e7e8ec;
  }
  .circle{
    --at-apply: pos-absolute w-30px h-30px lh-30px text-center b-rd-50% ;
  }
  .vertical-grey-line{
    --at-apply: pos-absolute top-0 w-2px h-full bg-#42b883;
  }
</style>
