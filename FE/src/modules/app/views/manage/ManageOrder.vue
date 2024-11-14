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
import DetailModal from './DetailView.vue'
import orderService from '../../services/order.service'
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { ORDER_STATUS, ORDER_STATUS_ARRAY } from '@/commons/const'

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
const orderStatuses = ref<any>([]);
const selectedStatus = ref<any>(ORDER_STATUS.PROCESSING);

/**
 * Life circle vue js
 */
onMounted(async () => {
    breadcrumbItems.value = [
        { text: 'Trang chủ', name: 'home' },
        { text: 'Đơn bán' }
    ]
    activeStore.set('8-2')
    await loadData()
})

/**
 * Function
 */
const loadData = async () => {
    if (loggedIn.value) {
        await orderStore.getList(null, account.value.UserID, selectedStatus.value)
    }
}

const changed = async (page: any) => {
    pageConfig.value = { ...page };
    await loadData()
}

// onView
const onView = (item: any) => {
    detailRef.value.open("Chi tiết", item.OrderID, false, true, async (res: any) => {
        if (res) await loadData()
    })
};

// onOrderDetail
const onOrderDetail = (item: any) => {
    detailRef.value.open("Đơn hàng chi tiết", item.OrderID, true)
};

// onDeleteItem
const onDeleteItem = async (item: any) => {
    await orderService.delete(item);
    await loadData()
};

</script>

<style scoped></style>