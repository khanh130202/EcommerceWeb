import apiClient from '@/utils/httpClient'
import type { APIResponse } from '@/interfaces/response.interface'
import { useToastStore } from '@/stores/toast.store'
import fileService from '@/utils/file'

export default class BaseService {
  protected API: any
  protected apiClient: any
  protected toastStore: any
  constructor(_API: any) {
    this.API = _API
    this.apiClient = apiClient
    this.toastStore = useToastStore()
  }

  async getList(params?: unknown): Promise<APIResponse<any[]>> {
    return await this.apiClient.get(this.API.LIST, {
      params: params,
    })
  }

  async getById(id: string): Promise<APIResponse<any>> {
    return await this.apiClient.get(this.API.DETAIL(id))
  }

  async create(data: any) {
    return await this.apiClient
      .post(this.API.CREATE, data)
      .then((response: any) => {
        this.toastStore.fromApiResponse(response)
        return response
      })
  }

  async update(data: any) {
    return await this.apiClient
      .put(this.API.UPDATE(data.id || ''), data)
      .then((response: any) => {
        this.toastStore.fromApiResponse(response)
        return response
      })
  }

  async delete(id: string) {
    return await this.apiClient
      .delete(this.API.DELETE(id))
      .then((response: any) => {
        this.toastStore.fromApiResponse(response)
        return response
      })
  }

  async export(params?: unknown, filename?: any) {
    return await this.apiClient
      .get(this.API.EXPORT, {
        params: params,
        responseType: 'blob',
      })
      .then((response: any) => {
        fileService.resolveAndDownloadBlob(response, filename);
      })
  }

  async deleteMulti(ids: string[]) {
    const toastStore = useToastStore()
    return await apiClient
      .delete(this.API.DELETE_MULTI, { data: ids })
      .then((response: any) => {
        toastStore.fromApiResponse(response)
        return response
      })
  }
}
