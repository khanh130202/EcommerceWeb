<template>
  <component :is="TheDefaultLayout">
    <RouterView />
  </component>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import TheDefaultLayout from '@/layouts/TheDefaultLayout.vue'
</script>
