/**
 * Dependencies injection library
 */
import apiClient from '@/utils/httpClient'
import type { APIResponse } from '@/interfaces/response.interface'
import { API } from '@/commons/config/product.config'
import { useToastStore } from '@/stores/toast.store'

const productService = {
  /**
  * Function
  */
  // Get list product
  async getList(params?: unknown): Promise<APIResponse<any[]>> {
    return await apiClient.get(API.PRODUCT, {
      params: params,
    })
  },

  // Get list image
  async getListImage(id: string): Promise<APIResponse<any>> {
    return await apiClient.get(API.LIST_IMAGE(id))
  },

  // Get detail
  async detail(id: string): Promise<APIResponse<any>> {
    return await apiClient.get(API.DETAIL(id))
  },

  // Create product
  async create(data: any) {
    const toastStore = useToastStore()
    return await apiClient
      .post(API.CREATE, data)
      .then((response: any) => {
        toastStore.fromApiResponse(response)
        return response
      })
  },

  // Update product
  async update(id: any, data: any) {
    const toastStore = useToastStore()
    return await apiClient
      .put(API.UPDATE(id), data)
      .then((response: any) => {
        toastStore.fromApiResponse(response)
        return response
      })
  },

  // Delete product
  async delete(data: any) {
    const toastStore = useToastStore()
    return await apiClient
      .delete(API.DELETE(data.ProductID))
      .then((response: any) => {
        toastStore.fromApiResponse(response)
        return response
      })
  },

  // Delete image
  async deleteImage(id: any) {
    const toastStore = useToastStore()
    return await apiClient
      .delete(API.DELETE_IMAGE(id))
      .then((response: any) => {
        toastStore.fromApiResponse(response)
        return response
      })
  },
}

export default productService
