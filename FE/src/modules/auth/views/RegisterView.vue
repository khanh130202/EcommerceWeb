<template>
    <el-row :gutter="20">
        <el-col :sm="8"></el-col>
        <el-col :sm="8">
            <el-card>
                <template #header>
                    <div class="card-header">
                        <h2>ĐĂNG KÍ</h2>
                    </div>
                </template>
                <el-form ref="formRef" :model="form" :rules="rules" label-position="top" label-width="auto">
                    <el-form-item required prop="display_name" label="Tên hiển thị">
                        <el-input v-model="form.display_name" placeholder="Nhập tên hiển thị" />
                    </el-form-item>
                    <el-form-item required prop="email" label="Email">
                        <el-input v-model="form.email" placeholder="Nhập email" type="email" />
                    </el-form-item>
                    <el-form-item required prop="phone_number" label="Số điện thoại">
                        <el-input v-model="form.phone_number" placeholder='Nhập số điện thoại' maxlength="20" />
                    </el-form-item>
                    <el-form-item required prop="password" label="Mật khẩu">
                        <el-input v-model="form.password" placeholder="Nhập mật khẩu" type="password" show-password />
                    </el-form-item>
                    <el-form-item required prop="confirm_password" label="Xác nhận mật khẩu">
                        <el-input v-model="form.confirm_password" placeholder="Nhập xác nhận mật khẩu" type="password"
                            show-password />
                    </el-form-item>

                    <el-form-item prop="avatar" label="Ảnh đại diện">
                        <el-upload ref="upload" class="upload-demo" :on-change="handleFileChange" drag
                            :auto-upload="false">
                            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                            <div class="el-upload__text">
                                Thả tập tin ở đây hoặc <em>bấm vào để tải lên</em>
                            </div>
                        </el-upload>
                    </el-form-item>


                    <el-form-item>
                        <el-button :loading="isLoading" type="primary" @click="onRegister(formRef)">Đăng kí</el-button>
                        <span style="margin: 0 10px">|</span>
                        <el-button :loading="isLoading" type="success" @click="onLogon()">Đăng nhập</el-button>
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
import { ref, reactive, onMounted } from "vue";
import type { FormInstance } from "element-plus";
import validate from "@/utils/validate_elp";
import { useActiveStore } from '@/stores/active.store'
import authService from "@/modules/auth/services/auth.service";
import { useRouter } from 'vue-router'

/**
 * Variable define
 */
const router = useRouter()
const activeStore = useActiveStore()
const formRef = ref<FormInstance>();
const isLoading = ref(false);
const upload = ref<any>(null);
const avatar_selected = ref<any>(null);

const form = reactive({
    phone_number: '',
    password: '',
    confirm_password: '',
    email: '',
    display_name: '',
});

const checkSamePassword = (rule: any, value: any, callback: any) => {
    if (value !== form.password) {
        callback(
            new Error('Mật khẩu xác nhận chưa đúng')
        )
    } else {
        callback()
    }
}
const rules = reactive({
    display_name: [
        { label: 'Tên hiển thị', required: true, validator: validate.required, trigger: ["blur"] },
    ],
    password: [
        { label: 'Mật khẩu', required: true, validator: validate.required, trigger: ["blur"] },
        { label: 'Mật khẩu', validator: validate.minLengthRule, trigger: ["blur"], min: 8 },
        { label: 'Mật khẩu', validator: validate.maxLengthRule, trigger: ["blur"], max: 50 },
    ],
    confirm_password: [
        { label: 'Xác nhận mật khẩu', required: true, validator: validate.required, trigger: ["blur"] },
        { label: 'Xác nhận mật khẩu', validator: validate.minLengthRule, trigger: ["blur"], min: 8 },
        { label: 'Xác nhận mật khẩu', validator: validate.maxLengthRule, trigger: ["blur"], max: 50 },
        { validator: checkSamePassword, trigger: 'blur' },
    ],
    phone_number: [
        { label: 'Số điện thoại', required: true, validator: validate.required, trigger: ["blur"] },
        { label: 'Số điện thoại', validator: validate.phoneNumberRule, trigger: ["blur"], max: 20 },
    ],
    email: [
        { label: 'Địa chỉ email', required: true, validator: validate.required, trigger: ["blur"] },
        { label: 'Địa chỉ email', validator: validate.emailRule, trigger: ["blur"] },
    ],
});

/**
 * Life circle vue js
 */

onMounted(() => {
    activeStore.set('6')
})

/**
 * Function
 */
const onRegister = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;

    await formEl.validate(async (valid) => {
        if (!valid) return;

        isLoading.value = true;
        const formData = new FormData();
        formData.append('display_name', form.display_name ?? "");
        formData.append('email', form.email ?? "");
        formData.append('phone_number', form.phone_number ?? "");

        if (avatar_selected.value && avatar_selected.value.length != 0) {
            avatar_selected.value.forEach((file: any) => {
                formData.append('avatarFile', file.raw);
            });
        }
        formData.append('password', form.password ?? "");
        
        await authService.signUp(formData).finally(() => {
            isLoading.value = false;
            router.push({
                name: 'Login'
            })
        });
    });
};

const onLogon = () => {
    router.push({
        name: 'Login'
    })
}

const handleFileChange = (file: any, fileList: any) => {
    avatar_selected.value = fileList;
}

</script>
<style>
.el-form-item {
    display: block;
}
</style>