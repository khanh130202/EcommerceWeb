export const FUNC_NAME = 'carts'

// ========================== PATH API =============================
export const API = {
  GET_CART: `/${FUNC_NAME}`,
  UPDATE_CART: `/${FUNC_NAME}`,
  CREATE_CART: `/${FUNC_NAME}/create-cart`,
  DELETE_CART: `/${FUNC_NAME}/delete-cart`,
  CREATE_CART_ITEMS: `/${FUNC_NAME}/create-cart-item`,
  DELETE_CART_ITEMS: (CartItemID: any) => `/${FUNC_NAME}/delete-cart-item/${CartItemID}`,
}
