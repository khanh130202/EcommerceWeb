<template>
    <vc-card shadow="never" style="margin-bottom: 10px">
        <vc-image @click="previewImage" :src="getImageUrl(props.data.ImageUrl)" :zoom-rate="1.2" :max-scale="7"
            :min-scale="0.2" :preview-src-list="srcList" :initial-index="4" fit="cover" />
        <div class="product-name">
            <router-link :to="{ name: 'Detail', params: { id: props.data.ProductID } }">
                <h3 style="font-size: 14px; font-weight: 600;">{{ props.data.ProductName }}</h3>
            </router-link>
        </div>
        <div class="product-Price">{{ number.formatCurrency(props.data.Price) }}</div>
        <vc-row style="margin-top: 10px;">
            <vc-col align="center">
                <vc-button v-if="data.StockQuantity && data.StockQuantity > 0" type="success" plain @click="addToCart">Thêm vào
                    giỏ hàng</vc-button>
                <vc-button v-else type="warning" plain disabled>Hết hàng</vc-button>
            </vc-col>
        </vc-row>
    </vc-card>
</template>

<script lang="ts" setup>
/**
 * Dependencies injection library
 */
import number from '@/utils/number';
import { getImageUrl } from '@/utils/getPathImg';
import { ref } from 'vue'
import productService from '@app/services/product.service'
import { useCartStore } from '@/modules/app/stores/cart.store'
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { useToastStore } from '@/stores/toast.store'
import { useRouter } from 'vue-router';

/**
 * Variable define
 */
const props = defineProps<{
    data: any;
}>();

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const isFavorite = ref<any>(-1)
const srcList = ref<any>([
    getImageUrl(props.data.ImageUrl),
])

/**
 * Life circle vue js
 */

 /**
 * Function
 */
const previewImage = async () => {
    const response = (await productService.getListImage(props.data.ProductID)).data?.result as any
    response.forEach((element: any) => {
        if (element.ImageUrl !== props.data.ImageUrl) {
            srcList.value.push(getImageUrl(element.ImageUrl))
        }
    });
};

const addToCart = () => {
    const toastStore = useToastStore()
    if (authStore.loggedIn) {
        cartStore.addToCart(props.data)
        toastStore.push({
            type: 'success',
            message: "Thêm sản phẩm vào giỏ hàng thành công"
        })
    }
    else {
        toastStore.push({
            type: 'error',
            message: "Vui lòng đăng nhập"
        })
    }
}

</script>

<style scoped lang="scss">
.product-name {
    -webkit-box-orient: vertical;
    display: -webkit-box;
    font-size: 14px;
    font-weight: 600;
    height: 85px;
    overflow: hidden;
    position: relative;
}

.product-Price {
    margin-bottom: 20px;
    color: #d70018;
    font-weight: 700;
    line-height: 1.1;
}
</style>