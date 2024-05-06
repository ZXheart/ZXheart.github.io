<script setup lang="ts">
  import { useData } from 'vitepress'

  const { isDark } = useData()
</script>

<template>
  <div class="common-wrapper grid grid-cols-3 gap-[10px_20px]" :class="[isDark ? 'dark-wrapper' : 'light-wrapper']">
    <div v-for="item in 5" :key="item" class="common-item" :class="[isDark ? 'dark-item' : 'light-item']">
      {{ item }}
    </div>
  </div>
</template>

<style></style>
