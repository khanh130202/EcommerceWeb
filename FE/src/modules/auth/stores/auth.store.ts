import { defineStore } from 'pinia'
import authService from '@auth/services/auth.service'
import { useToastStore } from '@/stores/toast.store'

export const useAuthStore = defineStore('useAuthStore', {
  state: () => ({
    loggedIn: false,
    account: <any>{},
  }),
  actions: {
    async login(data: any): Promise<boolean> {
      const response = (await authService.signIn(data)) as any

      // Login success
      if (response?.data?.access_token) {
        // saved token
        authService.updateLocalStorage(response?.data)

        // save cookies
        // authService.updateCookies(response?.data)

        // Update state
        this.loggedIn = true

        // Get account info
        this.account = (await authService.getInfo())?.data?.user
      }
      return this.loggedIn
    },
    async refresh() {
      this.account = (await authService.getInfo())?.data?.user
      if (this.account) this.loggedIn = true
      
      return this.account
    },
    logout() {
      authService.clearLocalStorage()
      this.account = {}
      this.loggedIn = false
    },
    async setUserInfo(account: any) {
      this.account = account
      this.loggedIn = account ? true : false
    },
  },
})
