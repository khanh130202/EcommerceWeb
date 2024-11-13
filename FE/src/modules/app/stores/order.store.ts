/**
 * Dependencies injection library
 */
import { defineStore } from 'pinia'
import orderService from '@app/services/order.service'
import dateTime from "@/utils/dateTime";
import number from '@/utils/number';
import { useAuthStore } from '@auth/stores/auth.store'

export const useOrderStore = defineStore('useOrderStore', {
  state: () => ({
    orders: <any>[],
    formData: <any>{},
    pageConfig: <any>[],
    loading: <any>[],
    search: <any>[],
    status: 'Tất cả',
  }),
  actions: {
    /**
    * Action
    */
    // Get list order
    async getList(user_id?: any, product_created_by?: any, order_status_id?: any, payment_method_id?: any) {
      this.loading = true
      await orderService
        .getList({
          search: this.search,
          user_id: user_id,
          order_status_id: order_status_id !== 0 ? order_status_id : null,
          payment_method_id: payment_method_id !== 0 ? payment_method_id : null,
          product_created_by: product_created_by,
          ...this.pageConfig,
        })
        .then((data: any) => {
          this.orders = data.data?.orders ?? []
          this.pageConfig.total = data.data?.metadata?.totalRecords
          this.orders = this.orders.map((item: any) => {
            if (item.created_at) {
              const formatted = dateTime.formatDateTimeNew(
                item.created_at
              );
              item.created_at = formatted;
            }
            if (item.total_amount) {
              const formatted = number.formatCurrency(
                item.total_amount
              );
              item.total_amount = formatted;
            }
            return item;
          });
          this.loading = false
        })
    },
  },
})
