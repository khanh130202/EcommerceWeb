import { defineStore } from "pinia";
import cartService from '@app/services/cart.service'

export const useCartStore = defineStore("useCartStore", {
    state: () => ({
        items: <any>[],
    }),
    getters: {
        TotalQuantity: (state: any) => {
            if (!Array.isArray(state.items)) {
                return 0;
            }
            return state.items.reduce((total: any, item: any) => total + item.Quantity, 0);
        },
        TotalAmount: (state) => {
            if (!Array.isArray(state.items)) {
                return 0;
            }
            return state.items.reduce((total: any, item: any) => total + (item.Price * item.Quantity), 0);
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

        async addToCart(product: any, Quantity = 1) {
            const existingItem = this.items.find((i: any) => i.ProductID === product.ProductID);
            if (existingItem) {
                existingItem.Quantity += Quantity;
                await this.updateCartItem(existingItem);
            } else {
                const newItem = { ProductID: product.ProductID, Quantity };
                await this.createCartItem(newItem);
            }
            await this.fetchCartItems();
        },

        async changeQuantity(productId: any, Quantity: any) {
            const item = this.items.find((i: any) => i.ProductID === productId);
            if (item) {
                item.Quantity = Quantity;
                await this.updateCartItem(item);
            }
            await this.fetchCartItems();
        },

        async removeFromCart(productId: any) {
            await this.deleteCartItem(productId);
            this.items = this.items.filter((i: any) => i.ProductID !== productId);
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
                CartItemID: item.CartItemID,
                Quantity: item.Quantity
            })
        },

        async deleteCartItem(productId: any) {
            const item = this.items.find((i: any) => i.ProductID === productId);
            if (item) {
                await cartService.deleteCartItems(item.CartItemID)
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
