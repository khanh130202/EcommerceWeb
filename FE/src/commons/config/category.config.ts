export const FUNC_NAME = 'categories'
// ========================== ROUTER =============================
export const ROUTER_CATEGORY = [
  {
    path: '/collection',
    name: 'Collection',
    component: () => import('@app/views/collection/CollectionView.vue')
  },
]

// ========================== PATH API =============================
export const API = {
  CATEGORY: `/${FUNC_NAME}`,
  GetProducts: `/${FUNC_NAME}/getProducts`,
}
