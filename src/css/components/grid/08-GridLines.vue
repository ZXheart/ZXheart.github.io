<script setup lang="ts"></script>

<template>
  <div class="bg-#161618 b-rd-8px py-20px p-24px">
    <div
      class="
      grid grid-cols-3 grid-auto-rows-120px
      b-2 b-solid b-t-#ffb6c1 b-b-#ffb6c1 b-l-#d8d8d8 b-r-#d8d8d8
      pos-relative"
    >
      <div class="common-item pos-relative">
        1
        <!-- 纵1 & 2 -->
        <div
          class="
          pos-absolute w-30px h-30px lh-30px text-center b-rd-50% bg-#d8d8d8 text-#000
          bottom-0 left-0 transform -translate-x-50% translate-y-50% z-9"
        >
          纵1
        </div>
        <div
          class="
          pos-absolute w-30px h-30px lh-30px text-center b-rd-50% bg-#d8d8d8 text-#000
          bottom-0 right-0 transform translate-x-50% translate-y-50% z-9"
        >
          纵2
        </div>
      </div>
      <div class="common-item pos-relative">
        2
        <!-- 横1 & 2 -->
        <div
          class="
          pos-absolute w-30px h-30px lh-30px text-center b-rd-50% bg-#ffb6c1 text-#000
          top-0 left-50% transform -translate-x-50% -translate-y-50%"
        >
          横1
        </div>
        <div
          class="
          pos-absolute w-30px h-30px lh-30px text-center b-rd-50% bg-#ffb6c1 text-#000
          bottom-0 left-50% transform -translate-x-50% translate-y-50% z-9"
        >
          横2
        </div>
      </div>
      <div class="common-item pos-relative">
        3
        <!-- 纵3 & 4 -->
        <div
          class="
          pos-absolute w-30px h-30px lh-30px text-center b-rd-50% bg-#d8d8d8 text-#000
          bottom-0 left-0 transform -translate-x-50% translate-y-50% z-9"
        >
          纵3
        </div>
        <div
          class="
          pos-absolute w-30px h-30px lh-30px text-center b-rd-50% bg-#d8d8d8 text-#000
          bottom-0 right-0 transform translate-x-50% translate-y-50% z-9"
        >
          纵4
        </div>
      </div>
      <div class="common-item">
        4
      </div>
      <div class="common-item">
        5
        <!-- 横3 -->
        <div
          class="
          pos-absolute w-30px h-30px lh-30px text-center b-rd-50% bg-#ffb6c1 text-#000
          bottom-0 left-50% transform -translate-x-50% translate-y-50% z-9"
        >
          横3
        </div>
      </div>
      <!-- 中间横绿线 -->
      <div class="pos-absolute top-120px l-0 w-full h-2px bg-#ffb6c1" />
      <!-- 中间两条竖黄线 -->
      <div class="pos-absolute top-0 left-33.33% w-2px h-full bg-#d8d8d8" />
      <div class="pos-absolute top-0 right-33.33% w-2px h-full bg-#d8d8d8" />
    </div>
  </div>
</template>

<style module>
  .common-item {
    --at-apply: b-rd-8px bg-#272843 text-center lh-120px;
  }
</style>
