/**
 * Dependencies injection library
 */
import { defineStore } from 'pinia'
import productService from '@app/services/product.service'
import { useAuthStore } from '@auth/stores/auth.store'
import dateTime from '@/utils/dateTime'
import number from '@/utils/number'

export const useProductStore = defineStore('useProductStore', {
  state: () => ({
    products: <any>[],
    pageConfig: <any>[],
    filterConfig: <any>[],
    loading: <any>[],
    search: <any>[],
    goSort: <any>[]
  }),
  actions: {
    /**
     * Action
     */
    // Get list product
    async getList(UserId: any = null) {
      this.loading = true
      await productService
        .getList({
          sort: this.goSort,
          search: this.search,
          UserId: UserId,
          ...this.pageConfig,
          ...this.filterConfig
        })
        .then((data: any) => {
          this.products = data.data?.products ?? []
          this.pageConfig.total = data.data?.metadata.totalRecords
          this.products = this.products.map((item: any) => {
            if (item.CreatedAt) {
              const formatted = dateTime.formatDateTimeNew(item.CreatedAt)
              item.CreatedAt = formatted
            }
            if (item.Quantity) {
              const formatted = number.formatNumberWithDots(item.Quantity)
              item.Quantity = formatted
            }
            return item
          })
          this.loading = false
          this.filterConfig = []
        })
    },
  }
})
