<script setup lang="ts">
defineProps<{
  w?: string
  h?: number
}>()

</script>
<template><i :style="{ 'width': w??16 + 'px', 'height': h??16 + 'px' }" class="material-icons"><slot></slot></i></template>