import { defineStore } from "pinia";
import cartService from '@app/services/cart.service'

export const useCartStore = defineStore("useCartStore", {
    state: () => ({
        items: <any>[],
    }),
    getters: {
        total_quantity: (state: any) => {
            if (!Array.isArray(state.items)) {
                return 0;
            }
            return state.items.reduce((total: any, item: any) => total + item.quantity, 0);
        },
        total_amount: (state) => {
            if (!Array.isArray(state.items)) {
                return 0;
            }
            return state.items.reduce((total: any, item: any) => total + (item.price * item.quantity), 0);
        },
    },

    actions: {
        async initializeCart() {
            try {
                const response = await cartService.createCart();
                this.items = response.data?.cart ?? [];
            } catch (error) {
                console.error('Error initializing cart:', error); // Thêm logging để kiểm tra lỗi
            }
        },

        async addToCart(product: any, quantity = 1) {
            const existingItem = this.items.find((i: any) => i.product_id === product.product_id);
            if (existingItem) {
                existingItem.quantity += quantity;
                await this.updateCartItem(existingItem);
            } else {
                const newItem = { product_id: product.product_id, quantity };
                await this.createCartItem(newItem);
            }
            await this.fetchCartItems();
        },

        async changeQuantity(productId: any, quantity: any) {
            const item = this.items.find((i: any) => i.product_id === productId);
            if (item) {
                item.quantity = quantity;
                await this.updateCartItem(item);
            }
            await this.fetchCartItems();
        },

        async removeFromCart(productId: any) {
            await this.deleteCartItem(productId);
            this.items = this.items.filter((i: any) => i.product_id !== productId);
        },

        async emptyCart() {
            await this.deleteAllCartItems();
            this.items = [];
        },

        async createCartItem(item: any) {
            await cartService.createCartItem({
                item
            })
        },

        async updateCartItem(item: any) {
            await cartService.update({
                cart_item_id: item.cart_item_id,
                quantity: item.quantity
            })
        },

        async deleteCartItem(productId: any) {
            const item = this.items.find((i: any) => i.product_id === productId);
            if (item) {
                await cartService.deleteCartItems(item.cart_item_id)
            }
        },

        async deleteAllCartItems() {
            await cartService.deleteCart()
        },

        async fetchCartItems() {
            const response = await cartService.getList()
            this.items = response.data?.cartitems;
        },
    },
});
