/**
 * Dependencies injection library
 */
import { defineStore } from 'pinia'
import userService from '@app/services/user.service'
import dateTime from '@/utils/dateTime'

export const useUserStore = defineStore('useUserStore', {
  state: () => ({
    dataGrid: <any>[],
    roles: <any>[],
    formData: <any>{},
    search: <any>[],
    pageConfig: <any>[],
    loading: <any>[],
  }),
  actions: {
    /**
     * Action
     */
    // Get list user
    async getList(getAll = false) {
      this.loading = true
      const config = getAll
        ? { search: this.search, page: 1, size: Number.MAX_SAFE_INTEGER }
        : { search: this.search, ...this.pageConfig }
      await userService
        .getList(config)
        .then((data: any) => {
          this.dataGrid = data?.data?.users ?? []
          if (!getAll) {
            this.pageConfig.total = data?.data?.metadata.totalRecords
          }
          this.dataGrid = this.dataGrid.map((item: any) => {
            if (item.CreatedAt) {
              const formatted = dateTime.formatDateTimeNew(item.CreatedAt)
              item.CreatedAt = formatted
            }
            return item
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
    // Get list roles
    async getListRole(getAll = false) {
      this.loading = true
      const config = getAll
        ? { search: this.search, page: 1, size: Number.MAX_SAFE_INTEGER }
        : { search: this.search, ...this.pageConfig }
      await userService
        .getListRole(config)
        .then((data: any) => {
          this.roles = data?.data?.roles ?? []
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
})
