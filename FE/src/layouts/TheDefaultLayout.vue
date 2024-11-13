<template>
    <div>
        <el-container>
            <el-header>
                <el-affix :offset="1">
                    <TheNavBar />
                </el-affix>
            </el-header>
            <el-main>
                <slot></slot>
            </el-main>
            <el-footer>
                <TheFooter />
            </el-footer>
            <vc-toast />
        </el-container>
    </div>
</template>

<script setup lang="ts">
import TheNavBar from '@/components/layouts/TheNavBar.vue'
import TheFooter from '@/components/layouts/TheFooter.vue'
import { onMounted } from 'vue';
import { useAuthStore } from '@auth/stores/auth.store'

const authStore = useAuthStore()

onMounted(async () => {
    await authStore.refresh()
})
</script>