<template>
    <h1>{{ message }}</h1>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useToastStore } from '@/stores/toast.store'
import { useCartStore } from '@/modules/app/stores/cart.store'
import orderService from '../../services/order.service';

const cartStore = useCartStore()
const toastStore = useToastStore()

const message = ref('');

onMounted(async () => {
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.has('message') && queryParams.get('message') === 'Success') {
        const newDataString = localStorage.getItem('new_order');

        // Kiểm tra xem có dữ liệu trong localStorage không
        if (newDataString) {
            const newData = JSON.parse(newDataString);
            await orderService.create(newData)
                .then((response) => {
                    if (response.code == 0) {
                        localStorage.removeItem('new_order');
                        cartStore.emptyCart()
                        message.value = 'Thanh toán qua momo thành công';
                        toastStore.push({
                            message: 'Thanh toán qua momo thành công',
                            type: 'success',
                        });
                    } else {
                        message.value = 'Lỗi khi thanh toán qua momo';
                        toastStore.push({
                            message: 'Lỗi khi thanh toán qua momo',
                            type: 'error',
                        });
                    }
                });
        }
    } else {
        message.value = 'Thanh toán qua momo không thành công';
        toastStore.push({
            message: 'Thanh toán qua momo không thành công',
            type: 'error',
        });
    }
});
</script>
