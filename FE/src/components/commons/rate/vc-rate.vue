<template>
    <el-rate :disabled="props.disabled" text-color="#ff9900" />
</template>

<script lang="ts" setup>
const props = defineProps<{
    disabled?: any
}>()
</script>