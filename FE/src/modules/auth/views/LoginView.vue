<template>
    <el-row :gutter="20">
        <el-col :sm="8"></el-col>
        <el-col :sm="8">
            <el-card>
                <template #header>
                    <div class="card-header">
                        <h2>ĐĂNG NHẬP</h2>
                    </div>
                </template>
                <el-form ref="formRef" :model="form" :rules="rules" label-position="top" label-width="auto">
                    <el-form-item required prop="Email" label="Địa chỉ Email">
                        <el-input v-model="form.Email" placeholder="Nhập địa chỉ Email" />
                    </el-form-item>
                    <el-form-item required prop="Password" label="Mật khẩu">
                        <el-input v-model="form.Password" placeholder="Nhập mật khẩu" type="password" show-password />
                    </el-form-item>

                    <el-form-item>
                        <el-button :loading="isLoading" type="primary" @click="onLogon(formRef)">Đăng nhập</el-button>
                        <span style="margin: 0 10px">|</span>
                        <el-button :loading="isLoading" type="success" @click="onRegister()">Đăng kí</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </el-col>
        <el-col :sm="8"></el-col>
    </el-row>
</template>

<script setup lang="ts">
/**
 * Dependencies injection library
 */
import { ref, reactive, onMounted, watch } from "vue";
import type { FormInstance } from "element-plus";
import validate from "@/utils/validate_elp";
import { useRouter } from 'vue-router'
import { useActiveStore } from '@/stores/active.store'
import { useAuthStore } from '@auth/stores/auth.store'
import { storeToRefs } from "pinia";

/**
 * Variable define
 */
const authStore = useAuthStore()
const { loggedIn } = storeToRefs(authStore)
const activeStore = useActiveStore()
const router = useRouter()
const rules = reactive({
    Email: [
        { label: 'Địa chỉ Email', required: true, validator: validate.required, trigger: ["blur"] },
    ],
    Password: [
        { label: 'Mật khẩu', required: true, validator: validate.required, trigger: ["blur"] },
        { label: 'Mật khẩu', validator: validate.minLengthRule, trigger: ["blur"], min: 8 },
    ],
});

const formRef = ref<FormInstance>();
const isLoading = ref(false);

const form = reactive({
    Email: null,
    Password: null,
});

/**
 * Life circle vue js
 */
onMounted(() => {
    // if (loggedIn.value) {
    //     router.push({
    //         name: 'home'
    //     })
    // }
    activeStore.set('5')
})

watch(loggedIn, (newValue) => {
    // if (newValue) {
    //     router.push({
    //         name: 'home'
    //     })
    // }
})
/**
 * Function
 */

const onLogon = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;

    await formEl.validate(async (valid) => {
        if (!valid) return;

        isLoading.value = true;

        await authStore
            .login(form)
            .then((isLogged) => {
                if (isLogged)
                    window.location.href = '/'
            })
            .finally(() => {
                isLoading.value = false
            })
    });
};

const onRegister = () => {
    router.push({
        name: 'Register'
    })
}
</script>
<style>
.el-form-item {
    display: block;
}
</style>