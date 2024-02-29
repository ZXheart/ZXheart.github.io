<script setup lang="ts">
import { useData } from 'vitepress'

const { isDark } = useData()
</script>

<template>
  <div
    class="common-wrapper grid grid-cols-3 grid-auto-rows-50px"
    :class="[isDark ? 'dark-wrapper' : 'light-wrapper']"
  >
    <div
      class="common-item col-start-1 col-end-3 row-start-1 row-end-3"
      :class="[isDark ? 'dark-item' : 'light-item']"
    >
      1
    </div>
    <div class="common-item" :class="[isDark ? 'dark-item' : 'light-item']">
      2
    </div>
    <div class="common-item" :class="[isDark ? 'dark-item' : 'light-item']">
      3
    </div>
    <div
      class="common-item col-start-1 col-end-2 row-start-3 row-end-5"
      :class="[isDark ? 'dark-item' : 'light-item']"
    >
      4
    </div>
    <div
      class="common-item col-start-2 col-end-4 row-start-3 row-end-5"
      :class="[isDark ? 'dark-item' : 'light-item']"
    >
      5
    </div>
  </div>
</template>

<style></style>
