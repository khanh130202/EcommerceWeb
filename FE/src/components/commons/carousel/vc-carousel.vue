<template>
    <el-carousel :interval="4000" :height="'200px'">
        <el-carousel-item v-for="(item, index) in props.items" :key="index">
            <el-image :src="getImageUrl(item.src)" :alt="item.alt" />
        </el-carousel-item>
    </el-carousel>
</template>

<script lang="ts" setup>
import { getImageUrl } from '@/utils/getPathImg';

const props = defineProps<{
    items?: any;
}>();

</script>