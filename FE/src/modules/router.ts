import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './app/views/home/HomeView.vue'
import CartView from './app/views/cart/CartView.vue'
import NotFoundView from './app/views/notfound/NotFoundView.vue'
import { useAuth } from '@/utils/useAuth'
import auth from '@/modules/auth/routers/index.auth.router'
import app from '@/modules/app/routers/index.app.router'
import CheckoutMomo from '@app/views/cart/CheckoutMomo.vue'

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
      component: CartView
    },
    {
      path: '/cart/PaymentMOMOConfirm',
      name: 'PaymentMOMOConfirm',
      component: CheckoutMomo
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
  } else {
    next()
  }
})
export default router
