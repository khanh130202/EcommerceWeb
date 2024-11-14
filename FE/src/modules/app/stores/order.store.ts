/**
 * Dependencies injection library
 */
import { defineStore } from 'pinia'
import orderService from '@app/services/order.service'
import dateTime from '@/utils/dateTime'
import number from '@/utils/number'
import { useAuthStore } from '@auth/stores/auth.store'

export const useOrderStore = defineStore('useOrderStore', {
  state: () => ({
    orders: <any>[],
    formData: <any>{},
    pageConfig: <any>[],
    loading: <any>[],
    search: <any>[],
    status: 'Tất cả'
  }),
  actions: {
    /**
     * Action
     */
    // Get list order
    async getList(UserID?: any, CreatedBy?: any, Status?: any, getAll = false) {
      this.loading = true
      const config = getAll
        ? {
            search: this.search,
            UserID: UserID,
            Status: Status !== 0 ? Status : null,
            CreatedBy: CreatedBy,
            page: 1,
            size: Number.MAX_SAFE_INTEGER
          }
        : {
            search: this.search,
            UserID: UserID,
            Status: Status !== 0 ? Status : null,
            CreatedBy: CreatedBy,
            ...this.pageConfig
          }
      await orderService.getList(config).then((data: any) => {
        this.orders = data.data?.orders ?? []
        this.pageConfig.total = data.data?.metadata?.totalRecords
        this.orders = this.orders.map((item: any) => {
          if (item.CreatedAt) {
            const formatted = dateTime.formatDateTimeNew(item.CreatedAt)
            item.CreatedAt = formatted
          }
          if (item.TotalAmount) {
            const formatted = number.formatCurrency(item.TotalAmount)
            item.TotalAmount = formatted
          }
          return item
        })
        this.loading = false
      })
    }
  }
})
