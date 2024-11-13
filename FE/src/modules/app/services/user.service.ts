import apiClient from '@/utils/httpClient'
import { useToastStore } from '@/stores/toast.store'
import { API } from '@/commons/config/user.config'

const userService = {
  async create(data: any) {
    const toastStore = useToastStore()
    return await apiClient
      .post(API.CREATE, data)
      .then((response: any) => {
        toastStore.fromApiResponse(response)
        return response
      })
  },
}

export default userService
