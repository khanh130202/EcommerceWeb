<template>
    <div>
        <vc-breadcrumb :breadcrumbItems="breadcrumbItems" />
        <vc-card style="margin: 20px 0">
            <h2>KẾT QUẢ TÌM KIẾM</h2>
            <hr>
            <vc-row :gutter="20" style="margin-top: 20px;">
                <vc-col v-if="products.length == 0">
                    <h4 style="font-weight: 600;">Không có sản phẩm phù hợp với `{{ keyword }}`</h4>
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

<script setup lang="ts">/**
* Dependencies injection library
*/
import { onMounted, ref, watch } from 'vue'
import ProductCard from '@/components/ProductCard.vue';
import { useProductStore } from '@app/stores/product.store'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useActiveStore } from '@/stores/active.store'

/**
 * Variable define
 */
const activeStore = useActiveStore()
const route = useRoute()
const keyword = ref<any>('')
const productStore = useProductStore()
const { products, pageConfig, search } = storeToRefs(productStore)
const breadcrumbItems = ref<any>([
    { text: 'Trang chủ', name: 'home' },
    { text: 'Tìm kiếm' }
])
/**
 * Life circle vue js
 */

watch(route, async (newValue, oldValue) => {
    await loadData()
})

onMounted(async () => {
    activeStore.set('')
    await loadData()
})


/**
 * Function
 */
const loadData = async () => {
    search.value = route.params.keyword
    keyword.value = search.value
    await productStore.getList()
    search.value = ''
}

const changed = async (page: any) => {
    pageConfig.value = { ...page };
    await loadData()
}
</script>

<style scoped></style>