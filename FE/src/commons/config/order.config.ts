export const FUNC_NAME = 'orders'
// ========================== ROUTER =============================
export const ROUTER_ORDER = [
  {
    path: '/purchase-order',
    name: 'PurchaseOrder',
    component: () => import('@app/views/manage/PurchaseOrder.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/manage-order',
    name: 'ManageOrder',
    component: () => import('@app/views/manage/ManageOrder.vue'),
    meta: { requiresAuth: true }
  },
]

// ========================== PATH API =============================
export const API = {
  ORDER: `/${FUNC_NAME}`,
  CREATE: `/${FUNC_NAME}`,
  DETAIL: (id: string) => `${FUNC_NAME}/${id}`,
  PAYMENT_MOMO: (cartTotalAmount: string) => `${FUNC_NAME}/PaymentMomo/${cartTotalAmount}`,
  ORDER_DETAIL: (order_id: string) => `orderitems/${order_id}`,
  CHANGE_STATUS: (id: string) => `${FUNC_NAME}/${id}`,
  CHECK_PURCHASE: (product_id: string) => `orderItems/check-purchase/${product_id}`,
  UPDATE: (id: string) => `${FUNC_NAME}/${id}`,
  DELETE: (id: string) => `${FUNC_NAME}/${id}`,
}