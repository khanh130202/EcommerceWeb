/**
 * Dependencies injection library
 */
import { defineStore } from 'pinia'
import categoryService from '@app/services/category.service'

export const useCategoryStore = defineStore('useCategoryStore', {
  state: () => ({
    products: <any>[],
    dataGrid: <any>[],
    pageConfig: <any>[],
    loading: <any>[],
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
        .getList()
        .then((data: any) => {
          this.dataGrid = data.data?.categories ?? []
          this.pageConfig.total = data.data?.metadata?.totalRecords
          this.loading = false
        })
    },
  },
})
