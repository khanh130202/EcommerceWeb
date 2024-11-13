<template>
    <div>
        <el-card>
            <template #header>
                <div class="card-header">
                    <vc-row :gutter="20">
                        <vc-col :span="12" style="display: flex;">
                            <h2>Giỏ hàng ({{ cartStore.total_quantity }})</h2>
                            <el-button style="margin-left: 20px" :loading="isLoading" type="primary"
                                @click="onContinue">Tiếp tục mua hàng</el-button>
                            <el-button v-if="cartStore.total_quantity > 0 && !loggedIn" style="margin-left: 20px"
                                :loading="isLoading" type="success" @click="onLogin">Vui lòng đăng nhập</el-button>
                        </vc-col>
                        <vc-col v-if="cartStore.total_quantity > 0" :span="12" style="text-align: right;">
                            <el-popconfirm style="width: auto !important;" confirm-button-text="Có"
                                cancel-button-text="Không" icon="InfoFilled" icon-color="#626AEF"
                                title="Bạn muốn làm trống giỏ hàng?" @confirm="emptyCart">
                                <template #reference>
                                    <vc-button :icon="'Delete'" type="danger">Làm trống giỏ hàng</vc-button>
                                </template>
                            </el-popconfirm>
                        </vc-col>
                    </vc-row>
                </div>
            </template>
            <el-table :data="items">
                <template #empty>
                    Không có sản phẩm nào trong giỏ hàng
                </template>
                <el-table-column label="Action">
                    <template #default="scope">
                        <el-popconfirm style="width: auto !important;" confirm-button-text="Có"
                            cancel-button-text="Không" icon="InfoFilled" icon-color="#626AEF"
                            title="Bạn muốn sản phẩm này khỏi giỏ hàng?" @confirm="removeFromCart(scope.row)">
                            <template #reference>
                                <vc-button :icon="'Delete'" type="danger" />
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
                <el-table-column label="Hình ảnh">
                    <template #default="scope">
                        <vc-image :src="getImageUrl(scope.row.image_url)" fit="cover" />
                    </template>
                </el-table-column>
                <el-table-column label="Tên sản phẩm" prop="product_name" />
                <el-table-column label="Giá" prop="price" />
                <el-table-column label="Số lượng">
                    <template #default="scope">
                        <el-input-number v-model="scope.row.quantity" :min="1" @change="validateQuantity(scope.row)" />
                    </template>
                </el-table-column>
                <el-table-column label="Thành tiền">
                    <template #default="scope">
                        {{ number.formatCurrency(scope.row.price * scope.row.quantity) }}
                    </template>
                </el-table-column>
            </el-table>
            <h4 style="margin-top: 20px">
                <b>Tổng tiền: {{ number.formatCurrency(cartStore.total_amount) }}</b>
            </h4>
        </el-card>
        <el-row :gutter="20" style="margin-top: 10px">
            <el-col :sm="10">
                <el-card v-if="loggedIn && cartStore.total_quantity > 0">
                    <template #header>
                        <div class="card-header">
                            <h2>THÔNG TIN NHẬN HÀNG</h2>
                        </div>
                    </template>
                    <vc-row :gutter="20">
                        <vc-col :span="12">
                            <vc-input-group label='Địa chỉ giao hàng'>
                                <el-select v-model="selectedAddress" @change="handleAddressChange"
                                    placeholder="Chọn địa chỉ giao hàng">
                                    <el-option v-for="item in dataGrid" :key="item.master_code_id" :label="item.address"
                                        :value="item.shipping_address_id" />
                                </el-select>
                            </vc-input-group>
                        </vc-col>
                    </vc-row>
                    <vc-row :gutter="20" style="margin-top: 10px">
                        <vc-col :span="24">
                            <el-form ref="formRef" :model="form" :rules="rules" label-position="top" label-width="auto">
                                <el-form-item required prop="recipient_name" label="Họ và tên người nhận">
                                    <el-input v-model="form.recipient_name"
                                        placeholder="Nhập họ và tên người nhận hàng" />
                                </el-form-item>
                                <el-form-item required prop="address" label="Địa chỉ giao hàng">
                                    <el-input v-model="form.address" placeholder="Địa chỉ giao hàng" />
                                </el-form-item>
                                <el-form-item required prop="phone" label="Số điện thoại">
                                    <el-input v-model="form.phone" placeholder="Số điện thoại" type="tel" />
                                </el-form-item>
                                <el-form-item prop="note" label="Ghi chú">
                                    <el-input v-model="form.note" placeholder="Ghi chú" type="textarea" />
                                </el-form-item>

                                <el-form-item>
                                    <div style="display: flex; width: 100%">
                                        <el-button :loading="isLoading" type="primary" size="large"
                                            @click="onCheckout(formRef)" style="width: 100%">Thanh
                                            toán khi
                                            nhận
                                            hàng (COD)</el-button>
                                    </div>
                                </el-form-item>
                            </el-form>

                            <div ref="paypalRef"></div>
                        </vc-col>
                    </vc-row>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
/**
 * Dependencies injection library
 */
import { getImageUrl } from '@/utils/getPathImg';
import { storeToRefs } from 'pinia'
import { ref, reactive, onMounted, watch } from "vue";
import type { FormInstance } from "element-plus";
import validate from "@/utils/validate_elp";
import { useAuthStore } from '@auth/stores/auth.store'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/modules/app/stores/cart.store'
import { useActiveStore } from '@/stores/active.store'
import number from '@/utils/number';
import orderService from '../../services/order.service';
import productService from '../../services/product.service';
import { useToastStore } from '@/stores/toast.store'
import { ORDER_STATUS } from "@/commons/const";
import { loadScript } from '@paypal/paypal-js';
import axios from 'axios';

/**
 * Variable define
 */
const activeStore = useActiveStore()
const cartStore = useCartStore()
const { items } = storeToRefs(cartStore)

const router = useRouter()
const authStore = useAuthStore()
const { account, loggedIn } = storeToRefs(authStore)
const formRef = ref<FormInstance>();
const isLoading = ref(false);
const toastStore = useToastStore()
const paypalRef = ref<any>(null);
const form = reactive({
    user_id: "",
    recipient_name: "",
    email: "",
    phone: "",
    address: "",
    note: '',
    order_status_id: ORDER_STATUS.PROCESSING,
    total_amount: 0,
    orderItemRequests: [] as any
});
const paypal = ref<any>(null)
const selectedAddress = ref(null);

const rules = reactive({
    address: [
        { label: 'Địa chỉ giao hàng', required: true, validator: validate.required, trigger: ["blur"] },
    ],
    phone: [
        { label: 'Số điện thoại', required: true, validator: validate.required, trigger: ["blur"] },
        { label: 'Số điện thoại', validator: validate.phoneNumberRule, trigger: ["blur"] },
    ],
    recipient_name: [
        { label: 'Họ và tên người nhận', required: true, validator: validate.required, trigger: ["blur"] },
    ],
    email: [
        { label: 'Địa chỉ email', required: true, validator: validate.required, trigger: ["blur"] },
        { label: 'Địa chỉ email', validator: validate.emailRule, trigger: ["blur"] },
    ],
});

/**
 * Life circle vue js
 */
onMounted(async () => {
    activeStore.set('2')
    await cartStore.initializeCart()

    items.value.forEach((item: any) => {
        form.orderItemRequests.push({
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
        })
    })

    paypal.value = await loadScript({
        clientId: 'AbEkMIt57ky9uFBp5IUSAyEEZq_f4PbXCIIXPAzxVl5LXQjjMCvd82yWQRJFiw39jnwKoQfleIvq-3iR',
        currency: 'VND',
    });
    if (paypal.value) {
        paypal.value.Buttons({
            createOrder: async (data: any, actions: any) => {
                // const response = await axios.get(
                //     "https://api.exchangerate-api.com/v4/latest/USD"
                // );
                // const usdAmount = (cartStore.total_amount / response.data.rates.VND).toFixed(2);

                return actions.order.create({
                    purchase_units: [
                        {
                            amount: {
                                value: cartStore.total_amount, // Số tiền thanh toán
                            },
                        },
                    ],
                });
            },
            onApprove: (data: any, actions: any) => {
                return actions.order.capture().then((details: any) => {
                    onCheckout(formRef.value, 'PAYPAL')
                    alert(`Transaction completed by ${details.payer.name.given_name}`);
                });
            },
            onError: (err: any) => {
                console.error(err);
            },
        }).render(paypalRef.value);
    }
})

/**
 * Function
 */
const validateQuantity = async (row: any) => {
    if (row.quantity < 1) {
        row.quantity.value = 1;
    }
    await cartStore.changeQuantity(row.product_id, row.quantity)
}

const onCheckout = async (formEl: FormInstance | undefined, payment_method: any) => {
    if (!formEl) return;

    await formEl.validate(async (valid) => {
        if (!valid) return;
        let dataOrderDetail = [] as any;

        items.value.forEach((item: any) => {
            const newData = {
                product_id: item.product_id,
                quantity: item.quantity
            };

            dataOrderDetail.push(newData);
        });

        isLoading.value = true;

        await orderService.create(form).then((response: any) => {
            if (response.status == 'success') {
                toastStore.push({
                    message: `Đặt hàng thành công`,
                    type: 'success',
                });
                cartStore.emptyCart()
            } else {
                toastStore.push({
                    message: `Lỗi khi đặt hàng`,
                    type: 'error',
                });
            }
        })
        
        isLoading.value = false;
    });
}

const removeFromCart = (item: any) => {
    cartStore.removeFromCart(item.product_id)
}

const emptyCart = () => {
    cartStore.emptyCart()
}

const onContinue = () => {
    router.push({
        name: 'home'
    })
}

const onLogin = () => {
    router.push({
        name: 'Login'
    })
}
</script>
<style>
.el-form-item {
    display: block;
}

.cell .el-image .el-image__inner {
    max-width: 100px;
}
</style>