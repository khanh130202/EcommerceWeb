<template>
  <el-date-picker
    :format="format ?? dateFormat"
    :value-format="format ?? dateFormat"
  ></el-date-picker>
</template>
<script setup lang="ts">
  const dateFormat = 'YYYY-MM-DD'
  defineProps<{
    format?: string
  }>()
</script>
