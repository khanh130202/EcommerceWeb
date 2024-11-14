import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './app/views/home/HomeView.vue'
import CartView from './app/views/cart/CartView.vue'
import NotFoundView from './app/views/notfound/NotFoundView.vue'
import { useAuth, useAuthMng } from '@/utils/useAuth'
import auth from '@/modules/auth/routers/index.auth.router'
import app from '@/modules/app/routers/index.app.router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/cart',
      name: 'Cart',
      component: CartView,
      meta: { requiresAuth: true, requiresMng: true }
    },
    ...auth,
    ...app,
    {
      path: '/:pathMatch(.*)*', // Route 404
      name: 'NotFound',
      component: NotFoundView
    }
  ]
})
router.beforeEach((to, from, next) => {
  const { isAuthenticated } = useAuth()

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next('/login')
  } 
  // else if (to.meta.requiresMng) {
  //   setTimeout(() => {
  //     const { isManagement } = useAuthMng()
  //     if (isManagement.value) {
  //       next()
  //     } else {
  //       next('/login')
  //     }
  //   }, 100)
  // } 
  else {
    next()
  }
})
export default router
