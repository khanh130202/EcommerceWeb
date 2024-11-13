<template>
  <div>
    <vc-carousel :items="itemsCarousel" height="400px" type="card" />
    <vc-card style="margin: 40px 0 0 0">
      <h2>SẢN PHẨM</h2>
      <div v-if="products.length > 0">
        <vc-row :gutter="20" style="margin-top: 20px;">
          <vc-col :xs="24" :sm="8" :md="4" v-for="(item, index) in products" :key="index">
            <ProductCard :data="item" />
          </vc-col>
        </vc-row>
        <div style="margin: 20px 0; float: right;">
          <vc-pagination :pageConfig="pageProductConfig" @changed="changedPageProduct" />
        </div>
      </div>
      <div v-else>
        <h3>KHÔNG CÓ SẢN PHẨM NÀO!</h3>
      </div>
    </vc-card>
  </div>
</template>
<script setup lang="ts">
/**
 * Dependencies injection library
 */
import ProductCard from '@/components/ProductCard.vue';
import { ref, onMounted } from 'vue'
import { useActiveStore } from '@/stores/active.store'
import { useProductStore } from '@app/stores/product.store'
import { storeToRefs } from 'pinia'

/**
 * Variable define
 */
const productStore = useProductStore()
const { products, pageConfig: pageProductConfig } = storeToRefs(productStore)
const activeStore = useActiveStore()
const itemsCarousel = ref([{
  src: '/public/carousel/carousel-1.jpg',
  alt: ''
},
{
  src: '/public/carousel/carousel-2.jpg',
  alt: ''
},
{
  src: '/public/carousel/carousel-3.jpg',
  alt: ''
},])

/**
 * Life circle vue js
 */

onMounted(async () => {
  activeStore.set('0')
  await loadData()
})

/**
 * Function
 */
const loadData = async () => {
  await productStore.getList()
}

const changedPageProduct = async (page: any) => {
  pageProductConfig.value = { ...page };
  await productStore.getList()
}
</script>

<style scoped>
@media (max-width: 992px) {
  .el-carousel__container {
    height: 200px !important;
  }
}
</style>
