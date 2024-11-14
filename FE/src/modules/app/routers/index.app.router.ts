import { ROUTER_CATEGORY } from '@/commons/config/category.config'
import { ROUTER_PRODUCT } from '@/commons/config/product.config'
import { ROUTER_ORDER } from '@/commons/config/order.config'
import { ROUTER_REVENUE } from '@/commons/config/revenue.config'
import { ROUTER_USER } from '@/commons/config/user.config'

export default [
  ...ROUTER_CATEGORY,
  ...ROUTER_PRODUCT,
  ...ROUTER_ORDER,
  ...ROUTER_REVENUE,
  ...ROUTER_USER,
]
