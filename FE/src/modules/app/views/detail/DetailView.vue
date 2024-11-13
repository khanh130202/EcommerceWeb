<template>
  <div v-if="data">
    <vc-breadcrumb :breadcrumbItems="breadcrumbItems" />
    <vc-row :gutter="100" class="content-detail">
      <vc-col :md="8">
        <vc-carousel motion-blur height="400px" :items="images" />
      </vc-col>
      <vc-col :md="16">
        <h3 style="margin: 20px 0">
          {{ data.ProductName }}
        </h3>
        <div class="dashed"></div>

        <h3 style="margin: 20px 0" class="product-Price">
          {{ number.formatCurrency(data.Price) }}
        </h3>
        <div class="dashed"></div>

        <div class="dashed"></div>
        <div v-if="data.StockQuantity && data.StockQuantity > 0">
          <el-input-number style="margin: 10px 0" v-model="Quantity" :min="1" :max="data.StockQuantity"
            @change="validateQuantity" :value-on-clear="1" :precision="0" />
          <div class="dashed"></div>

          <div style="margin: 20px 0">
            <vc-button type="primary" plain @click="buyNow">Mua ngay</vc-button>
            <vc-button type="success" plain @click="addToCart">Thêm vào giỏ hàng</vc-button>
          </div>
        </div>

        <vc-button v-else style="margin: 20px 0" type="warning" plain disabled>Hết hàng</vc-button>

        <div class="dashed"></div>
        <h5 style="margin: 20px 0 10px 0">Mô tả sản phẩm</h5>
        <p>
          {{ data.Description }}
        </p>
      </vc-col>
    </vc-row>
    <hr />

    <vc-card v-if="pageProductConfig.total > 0" style="margin: 20px 0; width: 100%">
      <h2>SẢN PHẨM LIÊN QUAN</h2>
      <vc-row :gutter="20" style="margin-top: 20px">
        <vc-col :xs="24" :sm="8" :md="4" v-for="(item, index) in relatedProducts" :key="index">
          <ProductCard :data="item" />
        </vc-col>
      </vc-row>
      <div style="margin: 20px 0; float: right">
        <vc-pagination :pageConfig="pageProductConfig" @changed="changedPageProducts" />
      </div>
    </vc-card>
  </div>
</template>

<script lang="ts" setup>
/**
 * Dependencies injection library
 */
import number from '@/utils/number'
import { ref, onMounted, watch } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import productService from '@app/services/product.service'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useActiveStore } from '@/stores/active.store'
import { useCartStore } from '@/modules/app/stores/cart.store'
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import { useToastStore } from '@/stores/toast.store'
import { useProductStore } from '@app/stores/product.store'

/**
 * Variable define
 */
const productStore = useProductStore()
const {
  products,
  pageConfig: pageProductConfig,
  filterConfig: filterProductConfig
} = storeToRefs(productStore)
const authStore = useAuthStore()
const cartStore = useCartStore()
const activeStore = useActiveStore()
const route = useRoute()
const router = useRouter()
const ProductID = ref<any>('')
const data = ref<any>(null)
const images = ref<any>([])
const relatedProducts = ref<any>([])
const breadcrumbItems = ref<any>([])
const Quantity = ref<any>(1)

/**
 * Life circle vue js
 */

watch(route, async (newValue, oldValue) => {
  await onInit()
})

onMounted(async () => {
  await onInit()
})

/**
 * Function
 */
const onInit = async () => {
  ProductID.value = route.params.id
  activeStore.set('')
  data.value = await (await productService.detail(ProductID.value)).data?.product
  if (!data.value) {
    router.push({
      name: 'NotFound'
    })
    return
  }

  const response = (await productService.getListImage(ProductID.value)).data?.result as any
  response.forEach((element: any) => {
    images.value.push({
      src: element.ImageUrl
    })
  })

  filterProductConfig.value.CategoryID = data.value.CategoryID
  await productStore.getList()

  relatedProducts.value = products.value.filter((item: any) => {
    return item.ProductID != ProductID.value
  })

  pageProductConfig.value.total = relatedProducts.value.length

  breadcrumbItems.value = [
    { text: 'Trang chủ', name: 'home' },
    {
      text: data.value.CategoryName,
      name: 'Collection',
      query: { id: data.value.CategoryID, name: data.value.CategoryName }
    },
    { text: data.value.ProductName }
  ]
}
const validateQuantity = (val: any) => {
  if (val < 1) {
    Quantity.value = 1
  }
}
const changedPageProducts = async (page: any) => {
  pageProductConfig.value = { ...page }
  await productStore.getList()
}

const buyNow = async () => {
  const toastStore = useToastStore()
  if (authStore.loggedIn) {
    cartStore.addToCart(data.value, Quantity.value)
    router.push({
      name: 'Cart'
    })

    toastStore.push({
      type: 'success',
      message: 'Thêm sản phẩm vào giỏ hàng thành công'
    })
  } else {
    toastStore.push({
      type: 'error',
      message: 'Vui lòng đăng nhập'
    })
  }
}

const addToCart = () => {
  const toastStore = useToastStore()
  if (authStore.loggedIn) {
    cartStore.addToCart(data.value, Quantity.value)

    toastStore.push({
      type: 'success',
      message: 'Thêm sản phẩm vào giỏ hàng thành công'
    })
  } else {
    toastStore.push({
      type: 'error',
      message: 'Vui lòng đăng nhập'
    })
  }
}

</script>

<style>
@media (max-width: 992px) {
  .el-carousel__container {
    height: 300px !important;
  }
}

.content-detail {
  padding: 20px;
}

.product-Price {
  margin-bottom: 20px;
  color: #d70018;
  font-weight: 700;
  line-height: 1.1;
}

.wrapper {
  margin: 0 auto;
  max-width: 960px;
  width: 100%;
}

.master {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-pack: start;
  -ms-flex-pack: start;
  justify-content: flex-start;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  padding: 40px;
}

h1 {
  font-size: 20px;
  margin-bottom: 20px;
}

h2 {
  line-height: 160%;
  margin-bottom: 20px;
}

.rating-component {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  margin-bottom: 10px;
}

.rating-component .status-msg {
  margin-bottom: 10px;
  text-align: center;
}

.rating-component .status-msg strong {
  display: block;
  font-weight: bold;
  margin-bottom: 10px;
}

.rating-component .stars-box {
  -ms-flex-item-align: center;
  align-self: center;
  margin-bottom: 15px;
}

.rating-component .stars-box .star {
  color: #ccc;
  cursor: pointer;
}

.rating-component .stars-box .star.hover {
  color: #ff5a49;
}

.rating-component .stars-box .star.selected {
  color: #ff5a49;
}

.feedback-tags .tags-container .question-tag {
  text-align: center;
  margin-bottom: 40px;
}

.tags-box {
  width: 250px;
}

.feedback-tags .tags-container .make-compliment {
  padding-bottom: 20px;
}

.feedback-tags .tags-container .make-compliment .compliment-container {
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  color: #000;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
}

.feedback-tags .tags-container .make-compliment .compliment-container .fa-smile-wink {
  color: #ff5a49;
  cursor: pointer;
  font-size: 40px;
  margin-top: 15px;
  -webkit-animation-name: compliment;
  animation-name: compliment;
  -webkit-animation-duration: 2s;
  animation-duration: 2s;
  -webkit-animation-iteration-count: 1;
  animation-iteration-count: 1;
}

.feedback-tags .tags-container .make-compliment .compliment-container .list-of-compliment {
  display: none;
  margin-top: 15px;
}

.feedback-tags .tag {
  border: 1px solid #ff5a49;
  border-radius: 5px;
  color: #ff5a49;
  cursor: pointer;
  padding: 10px;
}

.feedback-tags .tag.choosed {
  background-color: #ff5a49;
  color: #fff;
}

.feedback-tags {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.list-of-compliment ul {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
}

.list-of-compliment ul li {
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  cursor: pointer;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  margin-bottom: 10px;
  margin-left: 20px;
  min-width: 90px;
}

.list-of-compliment ul li:first-child {
  margin-left: 0;
}

.list-of-compliment ul li .icon-compliment {
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  border: 2px solid #ff5a49;
  border-radius: 50%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  height: 70px;
  margin-bottom: 15px;
  overflow: hidden;
  padding: 0 10px;
  -webkit-transition: 0.5s;
  transition: 0.5s;
  width: 70px;
}

.list-of-compliment ul li .icon-compliment i {
  color: #ff5a49;
  font-size: 30px;
  -webkit-transition: 0.5s;
  transition: 0.5s;
}

.list-of-compliment ul li.actived .icon-compliment {
  background-color: #ff5a49;
  -webkit-transition: 0.5s;
  transition: 0.5s;
}

.list-of-compliment ul li.actived .icon-compliment i {
  color: #fff;
  -webkit-transition: 0.5s;
  transition: 0.5s;
}

.button-box .done {
  background-color: #ff5a49;
  border: 1px solid #ff5a49;
  border-radius: 3px;
  color: #fff;
  cursor: pointer;
  min-width: 100px;
  padding: 10px;
}

.button-box .done:disabled,
.button-box .done[disabled] {
  border: 1px solid #ff9b95;
  background-color: #ff9b95;
  color: #fff;
  cursor: initial;
}

.submited-box {
  display: none;
  padding: 20px;
}

.submited-box .loader,
.submited-box .success-message {
  display: none;
}

.submited-box .loader {
  border: 5px solid transparent;
  border-top: 5px solid #4dc7b7;
  border-bottom: 5px solid #ff5a49;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  -webkit-animation: spin 0.8s linear infinite;
  animation: spin 0.8s linear infinite;
}
</style>
