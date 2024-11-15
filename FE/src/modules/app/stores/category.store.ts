/**
 * Dependencies injection library
 */
import { defineStore } from 'pinia'
import categoryService from '@app/services/category.service'
import dateTime from '@/utils/dateTime'

export const useCategoryStore = defineStore('useCategoryStore', {
  state: () => ({
    products: <any>[],
    dataGrid: <any>[],
    pageConfig: <any>[],
    loading: <any>[],
    search: <any>[]
  }),
  actions: {
    /**
     * Action
     */
    // Get product by category
    async getProducts(name: any) {
      this.loading = true
      await categoryService
        .getProducts({
          search: name,
          ...this.pageConfig
        })
        .then((data: any) => {
          this.products = data.data ?? []
          this.pageConfig.total = data.total
          this.loading = false
        })
    },

    async getList() {
      this.loading = true
      await categoryService
        .getList({
          search: this.search,
          ...this.pageConfig
        })
        .then((data: any) => {
          this.dataGrid = data.data?.categories ?? []
          this.dataGrid = this.dataGrid.map((item: any) => {
            if (item.CreatedAt) {
              const formatted = dateTime.formatDateTimeNew(item.CreatedAt)
              item.CreatedAt = formatted
            }
            return item
          })
          this.pageConfig.total = data.data?.metadata?.totalRecords
          this.loading = false
        })
    }
  }
})
