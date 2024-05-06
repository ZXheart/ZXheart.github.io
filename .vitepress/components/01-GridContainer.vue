<script setup lang="ts">
  defineProps<{
    title: string
  }>()
</script>

<template>
  <div class="bg-#161618 grid b-rd-8px my-20px py-20px p-24px">
    <div class="common-item">1</div>
    <div class="common-item">2</div>
    <div class="common-item">3</div>
    <div class="common-item">5</div>
  </div>
</template>

<style>
  .common-item {
    @apply b-rd-8px bg-#272843;
  }
</style>
