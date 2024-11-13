import LoginView from '@auth/views/LoginView.vue'
import RegisterView from '@auth/views/RegisterView.vue'
import ProfileView from '@auth/views/ProfileView.vue'
export const FUNC_NAME = 'auth'

// ========================== ROUTER =============================
export const ROUTER_AUTH = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  },
]

// ========================== PATH API =============================
export const API = {
  SIGN_UP: `/${FUNC_NAME}/signup`,
  SIGN_IN: `${FUNC_NAME}/login`,
  GET_INFO: `${FUNC_NAME}/infoLogin`,
  REFRESH_TOKEN: `${FUNC_NAME}/refresh-token`,
  CHANGE_PROFILE: (user_id: string) => `${FUNC_NAME}/change-profile/${user_id}`,
  CHANGE_PASSWORD: `${FUNC_NAME}/change-password`,
}
