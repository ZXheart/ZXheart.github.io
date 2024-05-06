<script setup lang="ts">
  import { useData } from 'vitepress'

  const { isDark } = useData()
</script>

<template>
  <div class="common-wrapper grid" :class="[isDark ? 'dark-wrapper' : 'light-wrapper']">
    <div v-for="item in 5" :key="item" class="common-item" :class="[isDark ? 'dark-item' : 'light-item']">
      {{ item }}
    </div>
  </div>
</template>

<style>
  /* style标签上没有使用scope和module，该SFC定义两个style全局适用。其它文件直接引用不再声明 */
  .common-wrapper {
    --at-apply: 'b-rd-8px py-20px px-24px';
  }
  .common-item {
    --at-apply: 'b-rd-8px';
  }

  .dark-wrapper {
    --at-apply: 'bg-soft-e ';
  }
  .dark-item {
    --at-apply: 'bg-soft-a ';
  }
  .light-wrapper {
    --at-apply: 'bg-#f6f6f6 ';
  }
  .light-item {
    --at-apply: 'bg-#e7e8ec ';
  }
</style>
