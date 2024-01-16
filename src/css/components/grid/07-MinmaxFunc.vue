<script setup lang="ts">
interface Props {
  minmax?: 'explicit' | 'implicit'
}
const props = withDefaults(defineProps<Props>(), {
  minmax: 'explicit',
})
</script>

<template>
  <div class="grid bg-#161618 b-rd-8px py-20px p-24px" :class="props.minmax">
    <div class="common-item">
      1
      <div v-if="props.minmax === 'implicit'" class="h-50px b-1 b-solid b-#42b883 b-rd-8px">
        高50px的内容
      </div>
    </div>
    <div class="common-item">
      2
      <div v-if="props.minmax === 'implicit'" class="h-80px b-1 b-solid b-#42b883 b-rd-8px">
        高80px的内容
      </div>
    </div>
    <div class="common-item">
      3
      <div v-if="props.minmax === 'implicit'" class="h-120px b-1 b-solid b-#42b883 b-rd-8px">
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

<style module>
  .explicit {
    grid-template-columns: 1fr minmax(15px, 300px) 1fr;
  }
  .implicit {
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: minmax(50px, auto);
  }
  .common-item {
    @apply b-rd-8px bg-#272843;
  }
</style>
