<script setup lang="ts">
  defineProps<{
    src: string
  }>()
</script>
<template>
  <iframe :src="src" title="test" w-full aspect-square> </iframe>
</template>
<style></style>
