export const FUNC_NAME = 'categories'
// ========================== ROUTER =============================
export const ROUTER_CATEGORY = [
  {
    path: '/collection',
    name: 'Collection',
    component: () => import('@app/views/collection/CollectionView.vue')
  },
  {
    path: '/manage-category',
    name: 'MngCategory',
    component: () => import('@app/views/category/ListView.vue'),
    meta: { requiresAuth: true, requiresMng: true }
  },
]

// ========================== PATH API =============================
export const API = {
  CATEGORY: `/${FUNC_NAME}`,
  GetProducts: `/${FUNC_NAME}/getProducts`,
  CREATE: `/${FUNC_NAME}`,
  DETAIL: (id: string) => `${FUNC_NAME}/${id}`,
  UPDATE: (id: string) => `${FUNC_NAME}/${id}`,
  DELETE: (id: string) => `${FUNC_NAME}/${id}`,
}

// ========================== CONFIG TABLE ==========================
export const tableConfig = {
  checkbox: false,
  action: true,
  showPaging: true,
  dbClick: false,
  index: true,
};

export const colConfig = [
  {
    key: 'CategoryName',
    title: "Tên danh mục"
  },
  {
    key: 'CreatedAt',
    title: "Ngày tạo"
  },
]

export default { tableConfig, colConfig }