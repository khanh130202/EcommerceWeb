/**
 * Dependencies injection library
 */
import apiClient from '@/utils/httpClient'
import type { APIResponse } from '@/interfaces/response.interface'
import { API } from '@/commons/config/category.config'

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
}

export default categoryService
