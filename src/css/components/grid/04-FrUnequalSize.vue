<script setup lang="ts">
import { useData } from 'vitepress'

const { isDark } = useData()
</script>

<template>
  <div
    class="common-wrapper grid grid-cols-[1fr_2fr_1fr]"
    :class="[isDark ? 'dark-wrapper' : 'light-wrapper']"
  >
    <view
      v-for="item in 5" :key="item"
      class="common-item" :class="[isDark ? 'dark-item' : 'light-item']"
    >
      {{ item }}
    </view>
  </div>
</template>

<style></style>
