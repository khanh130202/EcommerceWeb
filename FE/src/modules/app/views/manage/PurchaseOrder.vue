<template>
    <div>
        <vc-breadcrumb :breadcrumbItems="breadcrumbItems" />
        <el-card class="mt-4">
            <template #header>
                <div class="card-header">
                    <h2>LỊCH SỬ MUA HÀNG</h2>
                </div>
                <vc-row :gutter="20">
                    <vc-col :span="6">
                        <el-select v-model="selectedStatus" placeholder="Chọn trạng thái đơn hàng" @change="loadData()">
                            <el-option v-for="(item, index) in ORDER_STATUS_ARRAY" :key="index" :label="item.label"
                                :value="item.label" />
                        </el-select>
                    </vc-col>
                </vc-row>
            </template>
            <el-table :data="orders" :loading="loading">
                <template #empty>
                    Không có đơn hàng nào
                </template>
                <el-table-column label="Tên người nhận" prop="FullName" />
                <el-table-column label="Ngày mua" prop="CreatedAt" />
                <el-table-column label="Trạng thái" prop="Status" />
                <el-table-column label="Tổng tiền" prop="TotalAmount" />
                <el-table-column label="Ghi chú" prop="Note" />
                <el-table-column label="Action">
                    <template #default="scope">
                        <vc-button :icon="'View'" type="warning" @click="onView(scope.row)" />
                        <vc-button :icon="'List'" type="success" @click="onOrderDetail(scope.row)" />
                        <el-popconfirm confirm-button-text="Có" cancel-button-text="Không" icon="InfoFilled"
                            icon-color="#626AEF" title="Bạn muốn hủy đơn hàng này?"
                            @confirm="confirmCancelOrder(scope.row)">
                            <template #reference>
                                <vc-button :disabled="scope.row.STATUS != ORDER_STATUS.PROCESSING"
                                    :icon="'Close'" type="danger" />
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
import { ORDER_STATUS_ARRAY, ORDER_STATUS } from "@/commons/const";
import DetailModal from './DetailView.vue'
import orderService from '../../services/order.service'
import { useAuthStore } from '@/modules/auth/stores/auth.store';

/**
 * Variable define
 */
const authStore = useAuthStore()
const { loggedIn, account } = storeToRefs(authStore)
const detailRef = ref<any>(null);
const orderStore = useOrderStore()
const { orders, pageConfig, loading } = storeToRefs(orderStore)
const activeStore = useActiveStore()

const breadcrumbItems = ref<any>([])
const selectedStatus = ref<any>(ORDER_STATUS.PROCESSING);

/**
 * Life circle vue js
 */
onMounted(async () => {
    breadcrumbItems.value = [
        { text: 'Trang chủ', name: 'home' },
        { text: 'Đơn mua' }
    ]
    activeStore.set('8-1')
    await loadData()

})

/**
 * Function
 */
const loadData = async () => {
    if (loggedIn.value) {
        await orderStore.getList(account.value.UserID, null, selectedStatus.value)
    }
}

const changed = async (page: any) => {
    pageConfig.value = { ...page };
    await loadData()
}

// onView
const onView = (item: any) => {
    detailRef.value.open("Chi tiết", item.OrderID, false, false)
};

// onOrderDetail
const onOrderDetail = (item: any) => {
    detailRef.value.open("Đơn hàng chi tiết", item.OrderID, true)
};

const confirmCancelOrder = async (item: any) => {
    const userInput = prompt("Vui lòng nhập lí do hủy đơn");
    if (userInput) {
        await orderService.changeStatus(item.OrderID, userInput).then(async (response: any) => {
            if (response.status == "success") {
                await loadData()
            }
        })
    }
}
</script>

<style scoped></style>