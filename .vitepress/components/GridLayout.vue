<script setup lang="ts">
  defineProps<{
    title: string
  }>()
</script>
<template>
  <div text-red>
    <div class="grid grid-cols-3">
      <div class="bg-#fff test">1</div>
      <div class="bg-#fff test">2</div>
      <div class="bg-#fff test">3</div>
      <div class="bg-#fff test">5</div>
    </div>
  </div>
</template>
<style>
  .test {
    border: 1px solid red;
  }
</style>
