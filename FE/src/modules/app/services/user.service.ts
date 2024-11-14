import apiClient from '@/utils/httpClient'
import { useToastStore } from '@/stores/toast.store'
import { API } from '@/commons/config/user.config'
import type { APIResponse } from '@/interfaces/response.interface'

const userService = {
  async getList(params?: unknown): Promise<any> {
    return await apiClient.get(API.LIST, {
      params: params,
    })
  },

  async create(data: any) {
    const toastStore = useToastStore()
    return await apiClient
      .post(API.CREATE, data)
      .then((response: any) => {
        toastStore.fromApiResponse(response)
        return response
      })
  },

  async getListRole(params?: unknown): Promise<any> {
    return await apiClient.get(API.LIST_ROLE, {
      params: params,
    })
  },

  async detail(id: string): Promise<APIResponse<any>> {
    return await apiClient.get(API.DETAIL(id))
  },

  async update(UserID: any, data: any) {
    const toastStore = useToastStore()
    return await apiClient
      .put(API.UPDATE(UserID || ''), data)
      .then((response: any) => {
        toastStore.fromApiResponse(response)
        return response
      })
  },

  async delete(id: string) {
    const toastStore = useToastStore()
    return await apiClient
      .delete(API.DELETE(id))
      .then((response: any) => {
        toastStore.fromApiResponse(response)
        return response
      })
  },
}

export default userService
