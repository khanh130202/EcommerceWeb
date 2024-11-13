<template>
    <div>
        <vc-breadcrumb :breadcrumbItems="breadcrumbItems" />
        <el-card class="mt-4">
            <template #header>
                <div class="card-header">
                    <h2>QUẢN LÍ ĐƠN HÀNG</h2>
                </div>
                <vc-row :gutter="20">
                    <vc-col :span="6">
                        <el-select v-model="selectedStatus" placeholder="Chọn trạng thái đơn hàng" @change="loadData()">
                            <el-option v-for="(item, index) in orderStatuses" :key="index" :label="item.value"
                                :value="item.master_code_id" />
                        </el-select>
                    </vc-col>
                    <vc-col :span="6">
                        <el-select v-model="selectedPaymentMethod" placeholder="Chọn phương thức thanh toán"
                            @change="loadData()">
                            <el-option v-for="(item, index) in paymentMethods" :key="index" :label="item.value"
                                :value="item.master_code_id" />
                        </el-select>
                    </vc-col>
                </vc-row>
            </template>
            <el-table :data="orders" :loading="loading">
                <template #empty>
                    Không có đơn hàng nào
                </template>
                <el-table-column label="Tên người nhận" prop="recipient_name" />
                <el-table-column label="Ngày mua" prop="created_at" />
                <el-table-column label="Trạng thái" prop="order_status" />
                <el-table-column label="Phương thức thanh toán" prop="payment_method" />
                <el-table-column label="Tổng tiền" prop="total_amount" />
                <el-table-column label="Ghi chú" prop="note" />
                <el-table-column label="Action">
                    <template #default="scope">
                        <vc-button :icon="'View'" type="warning" @click="onView(scope.row)" />
                        <vc-button :icon="'List'" type="success" @click="onOrderDetail(scope.row)" />
                        <el-popconfirm confirm-button-text="Có" cancel-button-text="Không" icon="InfoFilled"
                            icon-color="#626AEF" title="Bạn muốn xóa đơn hàng này?" @confirm="onDeleteItem(scope.row)">
                            <template #reference>
                                <vc-button type="danger" :icon="'Delete'" />
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <div style="margin: 20px 0; float: right;">
                <vc-pagination :pageConfig="pageConfig" @changed="changed" />
            </div>
        </el-card>
    </div>
    <detail-modal ref="detailRef"></detail-modal>
</template>

<script setup lang="ts">
/**
 * Dependencies injection library
 */
import { storeToRefs } from 'pinia'
import { useActiveStore } from '@/stores/active.store'
import { onMounted, ref } from 'vue'
import { useOrderStore } from '@app/stores/order.store'
import { ORDER_STATUS, MASTER_CODE } from "@/commons/const";
import DetailModal from './DetailView.vue'
import orderService from '../../services/order.service'
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { useMasterCodeStore } from '@app/stores/masterCode.store'

/**
 * Variable define
 */
const storeMasterCode = useMasterCodeStore();
const { dataGrid: dataGridMasterCode } = storeToRefs(storeMasterCode)
const authStore = useAuthStore()
const { loggedIn, account } = storeToRefs(authStore)
const detailRef = ref<any>(null);
const orderStore = useOrderStore()
const { orders, pageConfig, loading } = storeToRefs(orderStore)
const activeStore = useActiveStore()

const breadcrumbItems = ref<any>([])
const orderStatuses = ref<any>([]);
const paymentMethods = ref<any>([]);
const selectedStatus = ref<any>(0);
const selectedPaymentMethod = ref<any>(0);

/**
 * Life circle vue js
 */
onMounted(async () => {
    breadcrumbItems.value = [
        { text: 'Trang chủ', name: 'home' },
        { text: 'Đơn bán' }
    ]
    activeStore.set('8-2')
    await storeMasterCode.getList(MASTER_CODE.ORDER_STATUS)
    orderStatuses.value = [{ master_code_id: 0, value: 'Tất cả' }, ...dataGridMasterCode.value]
    await storeMasterCode.getList(MASTER_CODE.PAYMENT_METHOD)
    paymentMethods.value = [{ master_code_id: 0, value: 'Tất cả' }, ...dataGridMasterCode.value]
    await loadData()
})

/**
 * Function
 */
const loadData = async () => {
    if (loggedIn.value) {
        await orderStore.getList(null, account.value.user_id, selectedStatus.value, selectedPaymentMethod.value)
    }
}

const changed = async (page: any) => {
    pageConfig.value = { ...page };
    await loadData()
}

// onView
const onView = (item: any) => {
    detailRef.value.open("Chi tiết", item.order_id, false, true, async (res: any) => {
        if (res) await loadData()
    })
};

// onOrderDetail
const onOrderDetail = (item: any) => {
    detailRef.value.open("Đơn hàng chi tiết", item.order_id, true)
};

// onDeleteItem
const onDeleteItem = async (item: any) => {
    await orderService.delete(item);
    await loadData()
};

</script>

<style scoped></style>