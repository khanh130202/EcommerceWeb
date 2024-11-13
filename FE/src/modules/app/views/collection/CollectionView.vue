<template>
    <div>
        <vc-breadcrumb :breadcrumbItems="breadcrumbItems" />
        <vc-card style="margin: 20px 0">
            <h2 style="text-transform: uppercase;">DANH MỤC {{ title }}</h2>
            <hr>
            <vc-row :gutter="20" style="margin-top: 20px;">
                <vc-col v-if="(products.length == 0)">
                    <h4 style=" font-weight: 600;">Không có sản phẩm thuộc danh mục {{ title }}</h4>
                </vc-col>
                <vc-col :xs="24" :sm="8" :md="4" v-else v-for="(item, index) in products" :key="index">
                    <ProductCard :data="item" />
                </vc-col>
            </vc-row>
            <div style="margin: 20px 0; float: right;">
                <vc-pagination :pageConfig="pageConfig" @changed="changed" />
            </div>
        </vc-card>
    </div>
</template>

<script setup lang="ts">
/**
 * Dependencies injection library
 */
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ProductCard from '@/components/ProductCard.vue';
import { useActiveStore } from '@/stores/active.store'
import { useProductStore } from '@app/stores/product.store'
import { storeToRefs } from 'pinia'

/**
 * Variable define
 */
const productStore = useProductStore()
const { products, pageConfig, filterConfig } = storeToRefs(productStore)
const activeStore = useActiveStore()
const route = useRoute()
const breadcrumbItems = ref<any>([])
const title = ref<any>('')

/**
 * Life circle vue js
 */
watch(route, async (newValue, oldValue) => {
    await onInit()
});

onMounted(async () => {
    await onInit()
})

/**
 * Function
 */
const loadData = async () => {
    filterConfig.value.CategoryID = route.query.id
    await productStore.getList()
}

const onInit = async () => {
    activeStore.set("4");
    title.value = route.query.name
    breadcrumbItems.value = [
        { text: 'Trang chủ', name: 'home' },
        { text: title.value }
    ]
    await loadData()
}
const changed = async (page: any) => {
    pageConfig.value = { ...page };
    await loadData()
}
</script>

<style scoped></style>