import apiClient from '@/utils/httpClient'
import type {
  AuthChangePassword,
  AuthRequestLogin,
  AuthResponse,
} from '@auth/interfaces/auth.interface'
import { useToastStore } from '@/stores/toast.store'
import { API } from '@/commons/config/auth.config'
import type { APIResponse } from '@/interfaces/response.interface'
import { COOKIE_KEY } from '@/commons/const'

const authService = {
  async signIn(data: AuthRequestLogin): Promise<APIResponse<AuthResponse>> {
    return await apiClient.post(API.SIGN_IN, data)
  },
  async signUp(data: any) {
    return await apiClient.post(API.SIGN_UP, data)
  },

  async getInfo(): Promise<APIResponse<any>> {
    return await apiClient.get(API.GET_INFO)
  },
  async clearLocalStorage() {
    localStorage.removeItem(COOKIE_KEY.ACCESS_TOKEN)
    localStorage.removeItem(COOKIE_KEY.REFRESH_TOKEN)
  },
  async updateLocalStorage(data: AuthResponse) {
    localStorage.setItem(COOKIE_KEY.ACCESS_TOKEN, data.access_token)
    localStorage.setItem(COOKIE_KEY.REFRESH_TOKEN, data.refresh_token)
  },
  async updateCookies(data: AuthResponse) {
    document.cookie = `${COOKIE_KEY.ACCESS_TOKEN}=${data.access_token}; ${COOKIE_KEY.REFRESH_TOKEN}=${data.refresh_token}`
  },
  async clearCookies() {
    document.cookie = ''
  },
  async changePassword(data: AuthChangePassword) {
    const toastStore = useToastStore()
    return await apiClient
      .put(API.CHANGE_PASSWORD, data)
      .then((response: any) => {
        toastStore.fromApiResponse(response)
        return response
      })
  },
}

export default authService
