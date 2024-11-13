<template>
    <el-empty :image-size="200" description="Page Not Found" />
</template>
<script lang="ts" setup>
import { onMounted } from 'vue'
import { useActiveStore } from '@/stores/active.store'

const activeStore = useActiveStore()
onMounted(() => {
    activeStore.set('')
})
</script>