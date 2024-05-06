<script setup lang="ts">
  import { useData } from 'vitepress'

  const { isDark } = useData()
</script>

<template>
  <div class="common-wrapper grid grid-cols-3 grid-auto-rows-50px" :class="[isDark ? 'dark-wrapper' : 'light-wrapper']">
    <div class="common-item" :class="[isDark ? 'dark-item' : 'light-item']">1</div>
    <div class="common-item col-[2/3] row-[1/3]" :class="[isDark ? 'dark-item' : 'light-item']">2</div>
    <div class="common-item" :class="[isDark ? 'dark-item' : 'light-item']">3</div>
    <div class="common-item" :class="[isDark ? 'dark-item' : 'light-item']">4</div>
    <div class="common-item" :class="[isDark ? 'dark-item' : 'light-item']">5</div>
  </div>
</template>

<style></style>
