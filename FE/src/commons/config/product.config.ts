export const FUNC_NAME = 'products'
// ========================== ROUTER =============================
export const ROUTER_PRODUCT = [
  {
    path: '/detail/:id',
    name: 'Detail',
    component: () => import('@app/views/detail/DetailView.vue')
  },
  {
    path: '/manage-product',
    name: 'ManageProduct',
    component: () => import('@app/views/post/ProductView.vue'),
    meta: { requiresAuth: true, requiresMng: true }
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
  CheckFavorite: (ProductID: any) => `favorites/check-favorite/${ProductID}`,
  AddFavorite: (ProductID: any) => `favorites/${ProductID}`,
  DeleteFavorite: (ProductID: any) => `favorites/${ProductID}`,
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
    key: 'ProductName',
    title: "Tên sản phẩm"
  },
  {
    key: 'CategoryName',
    title: "Tên danh mục"
  },
  {
    key: 'Price',
    title: "Giá",
    is_sort: true,
  },
  {
    key: 'StockQuantity',
    title: "Số lượng",
    is_sort: true,
  },
  {
    key: 'CreatedAt',
    title: "Ngày tạo"
  },
  {
    key: 'CreatedName',
    title: "Người tạo"
  },
]

export default { tableConfig, colConfig }