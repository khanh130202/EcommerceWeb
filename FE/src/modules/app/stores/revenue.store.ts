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
    async revenueDataChart(UserID?: any) {
      this.loading = true

      await revenueService
        .revenueDataChart({
          UserID: UserID,
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
