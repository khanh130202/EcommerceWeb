export const FUNC_NAME = 'carts'

// ========================== PATH API =============================
export const API = {
  GET_CART: `/${FUNC_NAME}`,
  UPDATE_CART: `/${FUNC_NAME}`,
  CREATE_CART: `/${FUNC_NAME}/create-cart`,
  DELETE_CART: `/${FUNC_NAME}/delete-cart`,
  CREATE_CART_ITEMS: `/${FUNC_NAME}/create-cart-item`,
  DELETE_CART_ITEMS: (cart_item_id: any) => `/${FUNC_NAME}/delete-cart-item/${cart_item_id}`,
}
