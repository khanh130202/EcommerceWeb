import { ref } from 'vue'
import { useAuthStore } from '@auth/stores/auth.store'

export function useAuth() {
  const token = localStorage.getItem('auth.access_token')
  const isAuthenticated = ref(!!token)

  return {
    isAuthenticated
  }
}

export function useAuthMng() {
  const isManagement = ref(false)
  setTimeout(() => {
    const authStore = useAuthStore()
    isManagement.value = authStore.account.RoleNames.includes('Admin')
  }, 100)
  return {
    isManagement
  }
}
