import { ref } from 'vue';

export function useAuth() {
    const token = localStorage.getItem('auth.access_token')
    const isAuthenticated = ref(!!token);

    return {
        isAuthenticated
    };
}
