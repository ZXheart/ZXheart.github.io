<script setup lang="ts"></script>
<template>
  <div class="grid cols-150px bg-#161618 b-rd-8px py-20px p-24px">
    <div class="common-item">1</div>
    <div class="common-item">2</div>
    <div class="common-item">3</div>
    <div class="common-item">4</div>
    <div class="common-item">5</div>
  </div>
</template>
<style>
  .cols-150px {
    grid-template-columns: 150px 150px 150px;
  }
  .common-item {
    @apply b-rd-8px bg-#272843;
  }
</style>
