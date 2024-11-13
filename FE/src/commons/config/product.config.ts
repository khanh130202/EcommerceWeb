export const FUNC_NAME = 'products'
// ========================== ROUTER =============================
export const ROUTER_PRODUCT = [
  {
    path: '/detail/:id',
    name: 'Detail',
    component: () => import('@app/views/detail/DetailView.vue')
  },
  {
    path: '/search/:keyword',
    name: 'Search',
    component: () => import('@app/views/search/SearchView.vue')
  },
]

// ========================== PATH API =============================
export const API = {
  PRODUCT: `/${FUNC_NAME}`,
  DETAIL: (id: string) => `${FUNC_NAME}/${id}`,
  LIST_IMAGE: (id: string) => `productImages/${id}`,
  GetAllFavorite: `favorites`,
  CheckFavorite: (product_id: any) => `favorites/check-favorite/${product_id}`,
  AddFavorite: (product_id: any) => `favorites/${product_id}`,
  DeleteFavorite: (product_id: any) => `favorites/${product_id}`,
  CheckProductAvailability: `${FUNC_NAME}/check-availability`,
  CREATE: `/${FUNC_NAME}`,
  UPDATE: (id: string) => `${FUNC_NAME}/${id}`,
  DELETE: (id: string) => `${FUNC_NAME}/${id}`,
  DELETE_IMAGE: (id: string) => `productimages/${id}`,
}

// ========================== CONFIG TABLE ==========================
export const tableConfig = {
  checkbox: false,
  action: true,
  index: true,
  showPaging: true,
  dbClick: false
}

export const colConfig = [
  {
    key: 'product_name',
    title: "Tên sản phẩm"
  },
  {
    key: 'category_name',
    title: "Tên danh mục"
  },
  {
    key: 'price',
    title: "Giá",
    is_sort: true,
  },
  {
    key: 'quantity',
    title: "Số lượng",
    is_sort: true,
  },
  {
    key: 'created_at',
    title: "Ngày tạo"
  },
  {
    key: 'created_name',
    title: "Người tạo"
  },
]

export default { tableConfig, colConfig }