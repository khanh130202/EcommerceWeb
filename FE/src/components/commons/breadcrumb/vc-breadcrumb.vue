<template>
    <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item v-for="(item, index) in props.breadcrumbItems" :key="index"
            :to="item.query ? { name: item.name, query: item.query } : item.params ? { name: item.name, params: item.params } : { name: item.name }">
            {{ item.text }}
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script lang="ts" setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { defineProps } from 'vue'


const props = defineProps<{
    breadcrumbItems?: any
}>()
</script>

<style scoped></style>