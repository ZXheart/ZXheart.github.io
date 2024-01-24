<script setup lang="ts"></script>

<template>
  <div class="common-wrapper grid">
    <div class="common-item">
      1
    </div>
    <div class="common-item">
      2
    </div>
    <div class="common-item">
      3
    </div>
    <div class="common-item">
      4
    </div>
    <div class="common-item">
      5
    </div>
  </div>
</template>

<style>
/* style标签上没有使用scope和module，该SFC定义两个style全局适用。其它文件直接引用不再声明 */
  .common-wrapper{
    @apply bg-soft-e b-rd-8px py-20px px-24px;
  }
  .common-item {
    @apply b-rd-8px bg-soft-a;
  }
</style>
