/**
 * Dependencies injection library
 */
import apiClient from '@/utils/httpClient'
import type { APIResponse } from '@/interfaces/response.interface'
import { useToastStore } from '@/stores/toast.store'
import { API } from '@/commons/config/order.config'
import { ORDER_STATUS } from "@/commons/const";

const orderService = {
  /**
  * Function
  */
  // Get list order
  async getList(params?: unknown): Promise<APIResponse<any[]>> {
    return await apiClient.get(API.ORDER, {
      params: params,
    })
  },

  // Get detail
  async detail(id: string): Promise<APIResponse<any>> {
    return await apiClient.get(API.DETAIL(id))
  },

  // Check purchase
  async checkPurchase(product_id: string): Promise<APIResponse<any>> {
    return await apiClient.get(API.CHECK_PURCHASE(product_id))
  },

  // Get order detail
  async order_detail(id: string): Promise<APIResponse<any>> {
    return await apiClient.get(API.ORDER_DETAIL(id))
  },

  // Create order
  async create(data: any) {
    const toastStore = useToastStore()
    return await apiClient
      .post(API.CREATE, data)
      .then((response: any) => {
        toastStore.fromApiResponse(response)
        return response
      })
  },

  // Create order
  async paymentMomo(cartTotalAmount: any) {
    const toastStore = useToastStore()
    return await apiClient
      .post(API.PAYMENT_MOMO(cartTotalAmount))
      .then((response: any) => {
        toastStore.fromApiResponse(response)
        return response
      })
  },

  // Update order
  async update(data: any) {
    const toastStore = useToastStore()
    return await apiClient
      .put(API.UPDATE(data.order_id), data)
      .then((response: any) => {
        toastStore.fromApiResponse(response)
        return response
      })
  },

  // Delete order
  async delete(data: any) {
    const toastStore = useToastStore()
    return await apiClient
      .delete(API.DELETE(data.order_id))
      .then((response: any) => {
        toastStore.fromApiResponse(response)
        return response
      })
  },
  // change status order
  async changeStatus(id: any, cancellationReason: any) {
    const toastStore = useToastStore()
    return await apiClient
      .put(API.CHANGE_STATUS(id), {
        order_status_id: ORDER_STATUS.CANCELLED,
        cancellation_reason: cancellationReason
      })
      .then((response: any) => {
        toastStore.fromApiResponse(response)
        return response
      })
  },
}

export default orderService
