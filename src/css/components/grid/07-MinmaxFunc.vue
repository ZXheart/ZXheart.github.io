<script setup lang="ts">
interface Props {
  minmax?: 'explicit' | 'implicit'
}
const props = withDefaults(defineProps<Props>(), {
  minmax: 'explicit',
})
</script>

<template>
  <div class="common-wrapper grid" :class="props.minmax">
    <div class="common-item">
      1
      <div v-if="props.minmax === 'implicit'" class="h-50px implicit-item">
        高50px的内容
      </div>
    </div>
    <div class="common-item">
      2
      <div v-if="props.minmax === 'implicit'" class="h-80px implicit-item">
        高80px的内容
      </div>
    </div>
    <div class="common-item">
      3
      <div v-if="props.minmax === 'implicit'" class="h-120px implicit-item">
        高120px的内容
      </div>
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
  .explicit {
    grid-template-columns: 1fr minmax(150px, 300px) 1fr;
  }
  .implicit {
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: minmax(50px, auto);
  }
  .implicit-item{
    @apply b-1 b-solid b-soft-d b-rd-8px;
  }
</style>
