import { defineStore } from "pinia";

export const useActiveStore = defineStore("useActiveStore", {
    state: () => ({
        activeIndex: localStorage.getItem('activeIndex') ?? '0',
    }),
    actions: {
        set(index: any) {
            localStorage.setItem('activeIndex', index ?? '0')
            this.activeIndex = index
        },
    },
});
