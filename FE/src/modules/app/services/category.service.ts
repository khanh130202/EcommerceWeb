/**
 * Dependencies injection library
 */
import apiClient from '@/utils/httpClient'
import type { APIResponse } from '@/interfaces/response.interface'
import { API } from '@/commons/config/category.config'
import { useToastStore } from '@/stores/toast.store'

const categoryService = {
  /**
  * Function
  */
  // Get list category
  async getList(params?: unknown): Promise<APIResponse<any[]>> {
    return await apiClient.get(API.CATEGORY, {
      params: params,
    })
  },
  // Get list subcategory
  async getProducts(params: any): Promise<APIResponse<any[]>> {
    return await apiClient.get(API.GetProducts, {
      params: params,
    })
  },

  // Get detail
  async detail(CategoryID: string): Promise<APIResponse<any>> {
    return await apiClient.get(API.DETAIL(CategoryID))
  },

  // Create category
  async create(data: any) {
    const toastStore = useToastStore()
    return await apiClient
      .post(API.CREATE, data)
      .then((response: any) => {
        toastStore.fromApiResponse(response)
        return response
      })
  },

  // Update category
  async update(data: any) {
    const toastStore = useToastStore()
    return await apiClient
      .put(API.UPDATE(data.CategoryID), data)
      .then((response: any) => {
        toastStore.fromApiResponse(response)
        return response
      })
  },

  // Delete category
  async delete(data: any) {
    const toastStore = useToastStore()
    return await apiClient
      .delete(API.DELETE(data.CategoryID))
      .then((response: any) => {
        toastStore.fromApiResponse(response)
        return response
      })
  },
}

export default categoryService
