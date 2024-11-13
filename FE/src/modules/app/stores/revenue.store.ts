/**
 * Dependencies injection library
 */
import { defineStore } from 'pinia'
import revenueService from '@/modules/app/services/revenue.service'
import number from '@/utils/number'

export const useRevenueStore = defineStore('useRevenueStore', {
  state: () => ({
    SalesDatas: <any>[],
    formData: <any>{},
    loading: <any>[],
    TotalSales: <any>[],

    dateRange: [
      new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    ],
    chartData: <any>{
      labels: <any>[],
      datasets: [
        {
          label: 'Doanh thu bán hàng',
          backgroundColor: '#205995',
          data: <any>[]
        }
      ]
    }
  }),
  actions: {
    /**
     * Action
     */
    // Get list revenue
    async getRevenue(user_id: any, revenue_type: any, selectedDate: any) {
      this.loading = true
      await revenueService
        .getRevenue({
          user_id: user_id,
          revenue_type: revenue_type,
          selectedDate: selectedDate,
        })
        .then((data: any) => {
          this.SalesDatas = data.data?.revenue?.salesDatas ?? []
          this.TotalSales = data.data?.revenue?.totalSales ?? 0
          this.SalesDatas = this.SalesDatas.map((item: any) => {
            if (item.totalPrice) {
              const formatted = number.formatCurrency(item.totalPrice)
              item.totalPrice = formatted
            }
            if (item.totalQuantity) {
              const formatted = number.formatNumberWithDots(item.totalQuantity)
              item.totalQuantity = formatted
            }
            return item
          })
          this.loading = false
        })
    },

    async revenueDataChart(user_id?: any) {
      this.loading = true

      await revenueService
        .revenueDataChart({
          user_id: user_id,
          startDate: this.dateRange[0],
          endDate: this.dateRange[1],
        })
        .then((data: any) => {
          const result = data.data?.revenue ?? {}
          this.chartData = {
            labels: result.labels,
            datasets: [
              {
                label: 'Doanh thu bán hàng',
                backgroundColor: '#205995',
                data: result.datasets
              }
            ]
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
})
