export const FUNC_NAME = 'revenues'
// ========================== ROUTER =============================
export const ROUTER_REVENUE = [
  {
    path: '/revenue',
    name: 'Revenue',
    component: () => import('@app/views/manage/RevenueView.vue'),
    meta: { requiresAuth: true, requiresMng: true }
  },
]

// ========================== PATH API =============================
export const API = {
  REVENUE: `/${FUNC_NAME}/get-revenue`,
  REVENUE_NEW: `/${FUNC_NAME}/get-data-chart`,
}

// ========================== CONFIG TABLE ==========================
export const tableConfig = {
  checkbox: false,
  action: false,
  index: false,
  showPaging: false,
  dbClick: false
}

export const colConfig = [
  {
    key: 'ProductName',
    title: "Tên sản phẩm"
  },
  {
    key: 'totalQuantity',
    title: "Số lượng bán"
  },
  {
    key: 'totalPrice',
    title: "Tổng tiền bán"
  },
]

export default { tableConfig, colConfig }