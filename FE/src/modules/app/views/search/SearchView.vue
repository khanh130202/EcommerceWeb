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
import { onMounted, ref } from 'vue'
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
const keyword = route.params.keyword
const productStore = useProductStore()
const { products, pageConfig, search } = storeToRefs(productStore)
const breadcrumbItems = ref<any>([
    { text: 'Trang chủ', name: 'home' },
    { text: 'Tìm kiếm' }
])
/**
 * Life circle vue js
 */

onMounted(async () => {
    activeStore.set('')
    search.value = keyword
    await loadData()
    search.value = ''
})


/**
 * Function
 */
const loadData = async () => {
    await productStore.getList()
}

const changed = async (page: any) => {
    pageConfig.value = { ...page };
    await loadData()
}
</script>

<style scoped></style>