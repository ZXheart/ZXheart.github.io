<script setup lang="ts"></script>

<template>
  <div class="common-wrapper">
    <div
      class="
      grid grid-cols-3 grid-auto-rows-120px
      b-2 b-solid b-y-#ffb6c1 b-x-#d8d8d8
      pos-relative"
    >
      <div class="common-item-line pos-relative">
        1
        <!-- 纵1 & 2 -->
        <div
          class="
          circle bg-#d8d8d8
          bottom-0 left-0 -translate-x-50% translate-y-50% z-9"
        >
          纵1
        </div>
        <div
          class="
          circle bg-#d8d8d8
          bottom-0 right-0  translate-x-50% translate-y-50% z-9"
        >
          纵2
        </div>
      </div>
      <div class="common-item-line pos-relative">
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
      <div class="common-item-line pos-relative">
        3
        <!-- 纵3 & 4 -->
        <div
          class="
          circle bg-#d8d8d8
          bottom-0 left-0 -translate-x-50% translate-y-50% z-9"
        >
          纵3
        </div>
        <div
          class="
          circle bg-#d8d8d8
          bottom-0 right-0 translate-x-50% translate-y-50% z-9"
        >
          纵4
        </div>
      </div>
      <div class="common-item-line">
        4
      </div>
      <div class="common-item-line">
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
  .common-item-line {
    --at-apply: b-rd-8px bg-#272843 text-center lh-120px;
  }
  .circle{
    --at-apply: pos-absolute w-30px h-30px lh-30px text-center b-rd-50% text-#000;
  }
  .vertical-grey-line{
    --at-apply: pos-absolute top-0 w-2px h-full bg-#d8d8d8;
  }
</style>
