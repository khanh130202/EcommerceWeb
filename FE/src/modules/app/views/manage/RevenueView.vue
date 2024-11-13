<template>
    <div>
        <vc-breadcrumb :breadcrumbItems="breadcrumbItems" />
        <div class="vc-page page-home mt-4">
            <el-row :gutter="20">
                <el-col :span="6">
                    <div class="statistic-card" style="background-color: #F56C6C; display: flex; align-items: center">
                        <div>
                            <Postcard style="width: 120; height: 120; color: white" />
                        </div>

                        <el-statistic :value="posts.length">
                            <template #title>
                                <div>
                                    <span>Tổng bài viết</span>
                                    <el-tooltip effect="dark" content="Tổng bài viết" placement="top">
                                        <el-icon style="margin-left: 4px" :size="12">
                                            <Warning />
                                        </el-icon>
                                    </el-tooltip>
                                </div>
                            </template>
                        </el-statistic>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="statistic-card" style="background-color: #E6A23C; display: flex; align-items: center">
                        <div>
                            <ChatDotSquare style="width: 120; height: 120; color: white" />
                        </div>
                        <el-statistic :value="ratings.length">
                            <template #title>
                                <div style="display: inline-flex; align-items: center">
                                    <span>Tổng đánh giá</span>
                                    <el-tooltip effect="dark" content="Tổng đánh giá" placement="top">
                                        <el-icon style="margin-left: 4px" :size="12">
                                            <Warning />
                                        </el-icon>
                                    </el-tooltip>
                                </div>
                            </template>
                        </el-statistic>
                    </div>
                </el-col>
                <el-col :span="6">
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
                <el-col :span="6">
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

        <div class="vc-page page-rating-list">
            <!-- detail block-->
            <vc-card class="mt-4 mb-4">
                <vc-row :gutter="20">
                    <vc-col :span="10">
                        <vc-input-group label='Chọn loại thống kê'>
                            <el-select v-model="revenue_type" placeholder="Chọn loại thống kê"
                                @change="onChangeRevenueType">
                                <el-option v-for="item in selectTypes" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </vc-input-group>
                    </vc-col>
                    <vc-col :span="11">
                        <vc-input-group label='Chọn thời gian' v-if="revenue_type == 'byPeriod'">
                            <el-date-picker v-model="selectedDate" type="daterange" unlink-panels range-separator="Đến"
                                start-placeholder="Từ ngày" end-placeholder="Đến ngày"
                                :shortcuts="shortcutsDateRange" />
                        </vc-input-group>
                        <vc-input-group label='Chọn năm' v-if="revenue_type == 'byYear'">
                            <el-date-picker v-model="selectedDate" type="year" placeholder="Chọn năm thống kê" />
                        </vc-input-group>
                        <vc-input-group label='Chọn tháng' v-if="revenue_type == 'byMonth'">
                            <el-date-picker v-model="selectedDate" type="month" placeholder="Chọn tháng thống kê" />
                        </vc-input-group>
                        <vc-input-group label='Chọn ngày' v-if="revenue_type == 'byDate'">
                            <el-date-picker v-model="selectedDate" type="date" placeholder="Chọn ngày thống kê"
                                :shortcuts="shortcutsDate" :disabled-date="disabledDate" />
                        </vc-input-group>
                    </vc-col>
                </vc-row>
                <vc-row :gutter="20" style="padding: 10px 0;">
                    <vc-col>
                        <vc-input-group label="Thống kê">
                            <vc-button type="primary" :icon="'PieChart'" @click="onRevenue">Thống kê</vc-button>
                        </vc-input-group>
                    </vc-col>
                </vc-row>
                <vc-row :gutter="20" style="padding: 10px 0;">
                    <vc-col>
                        Tổng doanh thu: {{ TotalSales }}
                    </vc-col>
                </vc-row>
                <vc-row :gutter="20" style="padding: 10px 0;">
                    <vc-col :span="6">
                        <vc-input-group label='Top sản phẩm'>
                            <el-select v-model="selectedTopCount" @change="onChangeTop">
                                <el-option v-for="item in selectTops" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </vc-input-group>
                    </vc-col>
                </vc-row>
                <vc-row :gutter="20">
                    <vc-col>
                        <vc-table :datas="dataGrid" :tableConfig="tableConfig" :colConfigs="colConfig"
                            :loading="loading">
                        </vc-table>
                    </vc-col>
                </vc-row>
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
import { usePostStore } from '@app/stores/post.store'
import { useProductStore } from '@app/stores/product.store'
import { useRatingStore } from '@app/stores/rating.store'
import { useOrderStore } from '@app/stores/order.store'
import { useRevenueStore } from '@app/stores/revenue.store'
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { useActiveStore } from '@/stores/active.store'

const activeStore = useActiveStore()
activeStore.set('9-4')

const authStore = useAuthStore()
const { loggedIn, account } = storeToRefs(authStore)
const storePost = usePostStore()
const { posts } = storeToRefs(storePost);

const storeRating = useRatingStore()
const { ratings } = storeToRefs(storeRating);

const storeProduct = useProductStore()
const { products } = storeToRefs(storeProduct);

const storeOrder = useOrderStore()
const { orders } = storeToRefs(storeOrder);

const breadcrumbItems = ref<any>([])
const storeRevenue = useRevenueStore()
const { dateRange, chartData } = storeToRefs(storeRevenue);

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
}

const {
    SalesDatas,
    loading,
    TotalSales
} = storeToRefs(storeRevenue)
const selectTypes = ref([
    {
        value: "byPeriod",
        label: "Theo khoảng thời gian"
    },
    {
        value: "byDate",
        label: "Theo ngày"
    },
    {
        value: "byMonth",
        label: "Theo tháng"
    },
    {
        value: "byYear",
        label: "Theo năm"
    },
])
const selectTops = ref([
    {
        value: 0,
        label: "Tất cả"
    },
    {
        value: 1,
        label: "Top 1"
    },
    {
        value: 3,
        label: "Top 3"
    },
    {
        value: 5,
        label: "Top 5"
    },
    {
        value: 10,
        label: "Top 10"
    },
])
const dataGrid = ref<any>([])
const selectedTopCount = ref(0)
const revenue_type = ref('byDate')
const selectedDate = ref<any>(new Date())
const shortcutsDateRange = [
    {
        text: 'Tuần trước',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            return [start, end]
        },
    },
    {
        text: 'Tháng trước',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            return [start, end]
        },
    },
    {
        text: '3 tháng trước',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            return [start, end]
        },
    },
]
const shortcutsDate = [
    {
        text: 'Hôm nay',
        value: new Date(),
    },
    {
        text: 'Hôm qua',
        value: () => {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            return date
        },
    },
    {
        text: 'Tuần trước',
        value: () => {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            return date
        },
    },
]
const disabledDate = (time: Date) => {
    return time.getTime() > Date.now()
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
        await onRevenue(account.value.user_id);
        await storePost.getList(account.value.user_id, null);
        await storeRating.getList(null, account.value.user_id);
        await storeProduct.getList(account.value.user_id, null);
        await storeOrder.getList(null, account.value.user_id);
        await storeRevenue.revenueDataChart(account.value.user_id);
    }
})

/**
 * Function
 */
const onRevenue = async (user_id: any) => {
    if (selectedDate.value) {
        await storeRevenue.getRevenue(user_id, revenue_type.value, selectedDate.value)
        dataGrid.value = SalesDatas.value
    }
}

const onChangeRevenueType = () => {
    dataGrid.value = []
    SalesDatas.value = []
    TotalSales.value = 0
    selectedDate.value = null
}

const onChangeTop = () => {
    if (selectedTopCount.value == 0) {
        dataGrid.value = SalesDatas.value
    }
    else {
        dataGrid.value = SalesDatas.value
            .sort((a: any, b: any) => b.totalQuantity - a.totalQuantity) // Sort by totalQuantity descending
            .slice(0, selectedTopCount.value);
    }
}
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