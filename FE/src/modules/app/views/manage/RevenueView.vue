<template>
    <div>
        <vc-breadcrumb :breadcrumbItems="breadcrumbItems" />
        <div class="vc-page page-home mt-4">
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="statistic-card" style="background-color: #E6A23C; display: flex; align-items: center">
                        <div>
                            <User style="width: 120; height: 120; color: white" />
                        </div>
                        <el-statistic :value="users.length">
                            <template #title>
                                <div style="display: inline-flex; align-items: center">
                                    <span>Tổng người dùng</span>
                                    <el-tooltip effect="dark" content="Tổng người dùng" placement="top">
                                        <el-icon style="margin-left: 4px" :size="12">
                                            <Warning />
                                        </el-icon>
                                    </el-tooltip>
                                </div>
                            </template>
                        </el-statistic>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="statistic-card" style="background-color: #67C23A; display: flex; align-items: center">
                        <div>
                            <TakeawayBox style="width: 120; height: 120; color: white" />
                        </div>
                        <el-statistic :value="products.length">
                            <template #title>
                                <div style="display: inline-flex; align-items: center">
                                    <span>Tổng sản phẩm</span>
                                    <el-tooltip effect="dark" content="Tổng sản phẩm" placement="top">
                                        <el-icon style="margin-left: 4px" :size="12">
                                            <Warning />
                                        </el-icon>
                                    </el-tooltip>
                                </div>
                            </template>
                        </el-statistic>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="statistic-card" style="background-color: #409EFF; display: flex; align-items: center">
                        <div>
                            <Tickets style="width: 120; height: 120; color: white" />
                        </div>
                        <el-statistic :value="orders.length">
                            <template #title>
                                <div style="display: inline-flex; align-items: center">
                                    <span>Tổng đơn hàng</span>
                                    <el-tooltip effect="dark" content="Tổng đơn hàng" placement="top">
                                        <el-icon style="margin-left: 4px" :size="12">
                                            <Warning />
                                        </el-icon>
                                    </el-tooltip>
                                </div>
                            </template>
                        </el-statistic>
                    </div>
                </el-col>
            </el-row>
            <vc-card class="mb-4 pa-4" style="margin-top: 40px">
                <div style="display: flex;">
                    <div>
                        <b class="mr-2">Ngày thống kê</b>
                        <el-date-picker @change="handleChangeDateRange" v-model="dateRange" type="daterange"
                            start-placeholder="Start Date" end-placeholder="End Date" />
                    </div>
                </div>

                <h1 class="mb-4 mt-4">Doanh thu</h1>
                <div class="chart-container">
                    <Bar :data="chartData" :options="chartOptions" />
                </div>
            </vc-card>
        </div>
    </div>
</template>

<script setup lang="ts">
/**
 * Dependencies injection library
 */
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { Bar } from 'vue-chartjs'
import {
    Warning,
} from '@element-plus/icons-vue'
import { useProductStore } from '@app/stores/product.store'
import { useUserStore } from '@app/stores/user.store'
import { useOrderStore } from '@app/stores/order.store'
import { useRevenueStore } from '@app/stores/revenue.store'
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { useActiveStore } from '@/stores/active.store'

const activeStore = useActiveStore()
activeStore.set('9-4')

const authStore = useAuthStore()
const { loggedIn, account } = storeToRefs(authStore)

const storeProduct = useProductStore()
const { products } = storeToRefs(storeProduct);

const storeOrder = useOrderStore()
const { orders } = storeToRefs(storeOrder);

const storeUser = useUserStore()
const { dataGrid: users } = storeToRefs(storeUser);

const breadcrumbItems = ref<any>([])
const storeRevenue = useRevenueStore()
const { dateRange, chartData } = storeToRefs(storeRevenue);

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
}


/**
 * Life circle vue js
 */
// onMounted function
onMounted(async () => {

    breadcrumbItems.value = [
        { text: 'Trang chủ', name: 'home' },
        { text: 'Thống kê' }
    ]
    if (loggedIn.value) {
        await storeProduct.getList(account.value.UserID, true);
        await storeOrder.getList(null, account.value.UserID, true);
        await storeUser.getList(true);
        await storeRevenue.revenueDataChart(account.value.UserID);
    }
})

/**
 * Function
 */
const handleChangeDateRange = async () => {
    await storeRevenue.revenueDataChart();
}

</script>
<style>
.chart-container {
    position: relative;
    margin: auto;
    height: 50vh;
}

:global(h2#card-usage ~ .example .example-showcase) {
    background-color: var(--el-fill-color) !important;
}

.el-statistic {
    --el-statistic-content-font-size: 28px;
}

.statistic-card {
    height: 100%;
    padding: 10px;
    border-radius: 4px;
    background-color: var(--el-bg-color-overlay);
}

.statistic-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    font-size: 12px;
    color: var(--el-text-color-regular);
    margin-top: 16px;
}

.statistic-footer .footer-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.statistic-footer .footer-item span:last-child {
    display: inline-flex;
    align-items: center;
    margin-left: 4px;
}

.green {
    color: var(--el-color-success);
}

.red {
    color: var(--el-color-error);
}

.el-statistic__number {
    font-size: 48px;
    color: white
}

.el-statistic__head div {
    color: white;
    display: inline-flex;
    align-items: center;
}
</style>