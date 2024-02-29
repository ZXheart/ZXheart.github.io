<script setup lang="ts">
import { useData } from 'vitepress'

interface Props {
  minmax?: 'explicit' | 'implicit'
}
const props = withDefaults(defineProps<Props>(), {
  minmax: 'explicit',
})

const { isDark } = useData()
</script>

<template>
  <div class="common-wrapper grid" :class="[isDark ? 'dark-wrapper' : 'light-wrapper', props.minmax]">
    <div class="common-item" :class="[isDark ? 'dark-item' : 'light-item']">
      1
      <div v-if="props.minmax === 'implicit'" class="h-50px implicit-item">
        高50px的内容
      </div>
    </div>
    <div class="common-item" :class="[isDark ? 'dark-item' : 'light-item']">
      2
      <div v-if="props.minmax === 'implicit'" class="h-80px implicit-item">
        高80px的内容
      </div>
    </div>
    <div class="common-item" :class="[isDark ? 'dark-item' : 'light-item']">
      3
      <div v-if="props.minmax === 'implicit'" class="h-120px implicit-item">
        高120px的内容
      </div>
    </div>
    <div class="common-item" :class="[isDark ? 'dark-item' : 'light-item']">
      4
    </div>
    <div class="common-item" :class="[isDark ? 'dark-item' : 'light-item']">
      5
    </div>
  </div>
</template>

<style>
  .explicit {
    grid-template-columns: 1fr minmax(150px, 1fr) 1fr;
  }
  .implicit {
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: minmax(50px, auto);
  }
  .implicit-item{
    --at-apply: 'b-1 b-solid b-soft-d b-rd-8px'
  }
</style>
