import { defineStore } from "pinia";
import type { Toast } from "@/interfaces/toast.interface";

export const useNotifyStore = defineStore("useNotifyStore", {
  state: () => ({
    item: {} as Toast,
  }),
  getters: {
    getItems(state) {
      return state.item;
    },
  },
  actions: {
    add(item: Toast) {
      this.remove();
      this.item = item
    },

    remove() {
      this.item = {} as Toast
    },
  },
});
