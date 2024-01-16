<script setup lang="ts"></script>

<template>
  <div class="grid cols-absolute-fr bg-#161618 b-rd-8px py-20px p-24px">
    <div class="common-item">
      1
    </div>
    <div class="common-item">
      2
    </div>
    <div class="common-item">
      3
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
  .cols-absolute-fr {
    grid-template-columns: 1fr 100px 1fr;
  }
  .common-item {
    @apply b-rd-8px bg-#272843;
  }
</style>
