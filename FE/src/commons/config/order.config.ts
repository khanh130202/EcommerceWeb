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
    meta: { requiresAuth: true, requiresMng: true }
  },
]

// ========================== PATH API =============================
export const API = {
  ORDER: `/${FUNC_NAME}`,
  CREATE: `/${FUNC_NAME}`,
  DETAIL: (id: string) => `${FUNC_NAME}/${id}`,
  PAYMENT_MOMO: (cartTotalAmount: string) => `${FUNC_NAME}/PaymentMomo/${cartTotalAmount}`,
  ORDER_DETAIL: (OrderID: string) => `orderitems/${OrderID}`,
  CHANGE_STATUS: (id: string) => `${FUNC_NAME}/${id}`,
  CHECK_PURCHASE: (ProductID: string) => `orderItems/check-purchase/${ProductID}`,
  UPDATE: (id: string) => `${FUNC_NAME}/${id}`,
  DELETE: (id: string) => `${FUNC_NAME}/${id}`,
}