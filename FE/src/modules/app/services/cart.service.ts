/**
 * Dependencies injection library
 */
import apiClient from '@/utils/httpClient'
import type { APIResponse } from '@/interfaces/response.interface'
import { API } from '@/commons/config/cart.config'

const categoryService = {
  /**
  * Function
  */
  // Get list cart
  async getList(params?: unknown): Promise<APIResponse<any>> {
    return await apiClient.get(API.GET_CART, {
      params: params,
    })
  },

  async update(data: any) {
    return await apiClient.put(API.UPDATE_CART, {
      data
    })
  },

  async createCart() {
    return await apiClient.post(API.CREATE_CART)
  },

  async createCartItem(data: any) {
    return await apiClient.post(API.CREATE_CART_ITEMS, {
      data
    })
  },

  async deleteCart() {
    return await apiClient.delete(API.DELETE_CART)
  },

  async deleteCartItems(CartItemID: any) {
    return await apiClient.delete(API.DELETE_CART_ITEMS(CartItemID))
  },
}

export default categoryService
