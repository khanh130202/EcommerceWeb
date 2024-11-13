<template>
  <div v-if="data">
    <vc-breadcrumb :breadcrumbItems="breadcrumbItems" />
    <vc-row :gutter="100" class="content-detail">
      <vc-col :md="8">
        <vc-carousel motion-blur height="400px" :items="images" />
      </vc-col>
      <vc-col :md="16">
        <h3 style="margin: 20px 0">
          {{ data.product_name }} |
          <span style="color: #777; font-size: 12px">Yêu thích</span>
          <span v-if="isFavorite != 1" @click="AddFavorite" style="cursor: pointer">🤍</span>
          <span v-else @click="DeleteFavorite" style="cursor: pointer">❤️</span>
        </h3>

        <vc-rate
          v-model="data.score"
          :disabled="true"
          :colors="colorsRating"
          show-score
          text-color="#ff9900"
          :score-template="data.score + ' sao'"
        />
        <div class="dashed"></div>

        <h3 style="margin: 20px 0" class="product-price">
          {{ number.formatCurrency(data.price) }}
        </h3>
        <div class="dashed"></div>

        <div class="dashed"></div>
        <div v-if="data.quantity && data.quantity > 0">
          <el-input-number
            style="margin: 10px 0"
            v-model="quantity"
            :min="1"
            :max="data.quantity"
            @change="validateQuantity"
            :value-on-clear="1"
            :precision="0"
          />
          <div class="dashed"></div>

          <div style="margin: 20px 0">
            <vc-button type="primary" plain @click="buyNow">Mua ngay</vc-button>
            <vc-button type="success" plain @click="addToCart">Thêm vào giỏ hàng</vc-button>
          </div>
        </div>

        <vc-button v-else style="margin: 20px 0" type="warning" plain @click="onContact"
          >Liên hệ</vc-button
        >

        <div class="dashed"></div>
        <h5 style="margin: 20px 0 10px 0">Mô tả sản phẩm</h5>
        <p>
          {{ data.description }}
        </p>
      </vc-col>
    </vc-row>
    <hr />
    <div v-if="checkUserHasPurchased" class="wrapper">
      <div class="master">
        <h1 v-if="!submitted">Đánh giá và xếp hạng</h1>
        <h2 v-if="!submitted">Trải nghiệm của bạn về sản phẩm của chúng tôi như thế nào?</h2>

        <div v-if="!submitted" class="rating-component">
          <div class="stars-box">
            <el-rate v-model="form.score" :colors="colorsRating" @change="changeRate" />
          </div>
        </div>

        <div v-if="!submitted" class="feedback-tags">
          <div class="tags-container" v-if="form.score != 0">
            <div class="question-tag">
              {{ question }}
            </div>
          </div>

          <div class="tags-box">
            <el-input
              v-model="form.comment"
              placeholder="Vui lòng nhập đánh giá của bạn"
              type="textarea"
            />
          </div>
        </div>

        <div v-if="!submitted" class="button-box" style="margin-top: 10px">
          <el-button type="success" @click="handleSubmit" plain>Thêm đánh giá</el-button>
        </div>

        <div v-if="submitted">
          <div class="success-message">Cảm ơn bạn!</div>
        </div>
      </div>
    </div>

    <div v-if="ratings.length > 0">
      <div v-for="(comment, index) in ratings" :key="index">
        <hr style="margin: 10px 0" />
        <img
          style="max-width: 40px"
          :alt="comment.display_name"
          :src="
            comment.avatar_url
              ? getImageUrl(comment.avatar_url)
              : 'https://lh4.googleusercontent.com/-T3-L8KezLEg/AAAAAAAAAAI/AAAAAAAAAAA/6385upYGISk/s40-c-k/photo.jpg'
          "
        />
        <div>
          <div>
            <a style="cursor: 'pointer'; color: 'blue'">
              {{ comment.display_name }}
            </a>
          </div>
          <div>
            <span>{{ dateTime.formatDate(comment.created_at) }}</span>
          </div>
          <div>
            <span>
              <el-rate disabled v-model="comment.score" :colors="colorsRating" />
            </span>
            <div>
              <span>{{ comment.comment }}</span>
            </div>
          </div>
        </div>
      </div>

      <div style="margin: 20px 0; float: right; width: 100%">
        <vc-pagination :pageConfig="pageRatingConfig" @changed="changedPageRatings" />
      </div>
      <hr style="margin: 10px 0" />
    </div>

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
import { ref, onMounted, reactive, watch } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import productService from '@app/services/product.service'
import { useRoute, useRouter } from 'vue-router'
import { useRatingStore } from '@app/stores/rating.store'
import { storeToRefs } from 'pinia'
import { useActiveStore } from '@/stores/active.store'
import { useCartStore } from '@/modules/app/stores/cart.store'
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import { useToastStore } from '@/stores/toast.store'
import { colorsRating } from '@/commons/const'
import dateTime from '@/utils/dateTime'
import ratingService from '../../services/rating.service'
import orderService from '../../services/order.service'
import { useProductStore } from '@app/stores/product.store'
import { getImageUrl } from '@/utils/getPathImg'

/**
 * Variable define
 */
const productStore = useProductStore()
const {
  products,
  pageConfig: pageProductConfig,
  filterConfig: filterProductConfig
} = storeToRefs(productStore)
const ratingStore = useRatingStore()
const {
  ratings,
  pageConfig: pageRatingConfig,
  filterConfig: filterRatingsConfig
} = storeToRefs(ratingStore)
const authStore = useAuthStore()
const cartStore = useCartStore()
const activeStore = useActiveStore()
const route = useRoute()
const router = useRouter()
const product_id = ref<any>('')
const data = ref<any>(null)
const images = ref<any>([])
const isFavorite = ref<any>(-1)
const relatedProducts = ref<any>([])
const breadcrumbItems = ref<any>([])
const quantity = ref<any>(1)
const checkUserHasPurchased = ref<any>(true)
const submitted = ref<any>(false)
const question = ref<any>('')

const form = reactive({
  user_id: '',
  product_id: '',
  comment: '',
  score: 0
})
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
  product_id.value = route.params.id
  activeStore.set('')
  data.value = await (await productService.detail(product_id.value)).data?.product
  if (!data.value) {
    router.push({
      name: 'NotFound'
    })
    return
  }

  const response = (await productService.getListImage(product_id.value)).data?.result as any
  response.forEach((element: any) => {
    images.value.push({
      src: element.image_url
    })
  })

  filterProductConfig.value.category_id = data.value.category_id
  await productStore.getList()

  relatedProducts.value = products.value.filter((item: any) => {
    return item.product_id != product_id.value
  })

  pageProductConfig.value.total = relatedProducts.value.length

  if (authStore.loggedIn) {
    isFavorite.value =
      (await productService.CheckFavorite(product_id.value)).data?.isFavorite ?? false
    const rec = (await orderService.checkPurchase(product_id.value)) as any
    if (rec == 1) {
      checkUserHasPurchased.value = true
    }
  }
  breadcrumbItems.value = [
    { text: 'Trang chủ', name: 'home' },
    {
      text: data.value.category_name,
      name: 'Collection',
      query: { id: data.value.category_id, name: data.value.category_name }
    },
    { text: data.value.product_name }
  ]

  filterRatingsConfig.value.product_id = product_id.value
  await ratingStore.getList()
}
const validateQuantity = (val: any) => {
  if (val < 1) {
    quantity.value = 1
  }
}
const changedPageProducts = async (page: any) => {
  pageProductConfig.value = { ...page }
  await productStore.getList()
}
const changedPageRatings = async (page: any) => {
  pageRatingConfig.value = { ...page }
  await ratingStore.getList()
}

const AddFavorite = async () => {
  if (authStore.loggedIn) {
    await productService.AddFavorite(product_id.value)
    isFavorite.value = 1
  } else {
    const toastStore = useToastStore()
    toastStore.push({
      type: 'error',
      message: 'Vui lòng đăng nhập'
    })
  }
}

const DeleteFavorite = async () => {
  if (authStore.loggedIn) {
    await productService.DeleteFavorite(product_id.value)
    isFavorite.value = -1
  } else {
    const toastStore = useToastStore()
    toastStore.push({
      type: 'error',
      message: 'Vui lòng đăng nhập'
    })
  }
}

const buyNow = async () => {
  const toastStore = useToastStore()
  if (authStore.loggedIn) {
    cartStore.addToCart(data.value, quantity.value)
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
    cartStore.addToCart(data.value, quantity.value)

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

const changeRate = () => {
  if (form.score == 1) {
    question.value = 'Tại sao trải nghiệm của bạn lại tệ đến thế?'
  }
  if (form.score == 2) {
    question.value = 'Tại sao trải nghiệm của bạn lại tệ đến thế?'
  }
  if (form.score == 3) {
    question.value = 'Tại sao trải nghiệm đánh giá trung bình của bạn là gì?'
  }
  if (form.score == 4) {
    question.value = 'Tại sao trải nghiệm của bạn lại tốt?'
  }
  if (form.score == 5) {
    question.value = 'Tuyệt vời ❤️'
  }
}

const handleSubmit = async () => {
  const toastStore = useToastStore()
  if (form.comment === '') {
    toastStore.push({
      type: 'error',
      message: 'Vui lòng nhập nội dung đánh giá'
    })
    return
  }
  if (form.score == 0) {
    toastStore.push({
      type: 'error',
      message: 'Vui lòng đánh giá điểm'
    })
    return
  }
  if (authStore.loggedIn) {
    form.product_id = product_id.value
    if (checkUserHasPurchased.value == true) {
      await ratingService.create(form).then(async (response: any) => {
        if (response.status == 'success') {
          await ratingStore.getList()
          submitted.value = true
        }
      })
    } else {
      toastStore.push({
        type: 'error',
        message: 'Bạn chưa mua sản phẩm này'
      })
    }
  } else {
    toastStore.push({
      type: 'error',
      message: 'Vui lòng đăng nhập'
    })
  }
}

const onContact = async () => {
  if (!authStore.loggedIn) {
    const toastStore = useToastStore()
    toastStore.push({
      type: 'error',
      message: 'Vui lòng đăng nhập'
    })
    return
  }
  if (authStore.account.user_id == data.value.created_by) {
    const toastStore = useToastStore()
    toastStore.push({
      type: 'error',
      message: 'Bạn không thể gửi tin nhắn cho chính mình'
    })
    return
  }
  router.push({
    name: 'Chat',
    state: { userId: data.value.created_by, productLink: window.location.href }
  })
  window.history.replaceState(
    { userId: data.value.created_by, productLink: window.location.href },
    ''
  )
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

.product-price {
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
