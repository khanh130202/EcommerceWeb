<template>
    <vc-modal ref="modal" :title="modalTitle" @close="close">
        <template #content>
            <el-form ref="changeForm" :model="passwordValidate" :rules="rules" :label-position="'top'">
                <el-form-item required prop="olPass" label='Mật khẩu hiện tại' class="form-label">
                    <el-input class="text-input" v-model.trim="passwordValidate.olPass" placeholder='Mật khẩu hiện tại'
                        type="password" autocomplete="off" show-password />
                </el-form-item>

                <el-form-item required prop="newPass" label='Mật khẩu mới' class="form-label">
                    <el-input class="text-input" v-model.trim="passwordValidate.newPass" placeholder='Mật khẩu mới'
                        type="password" autocomplete="off" show-password />
                </el-form-item>

                <el-form-item required prop="cfPass" label='Xác nhận mật khẩu' class="form-label">
                    <el-input class="text-input" v-model.trim="passwordValidate.cfPass" placeholder='Xác nhận mật khẩu'
                        type="password" autocomplete="off" show-password />
                </el-form-item>

                <vc-button type="primary" class="card-footer-col-btn" @click="handleChangePass(changeForm)">
                    Lưu thay đổi
                </vc-button>
            </el-form>
        </template>
    </vc-modal>
</template>

<script setup lang="ts">
/**
 * Dependencies injection library
 */
import { ref, reactive } from "vue";
import type { FormInstance } from "element-plus";
import validate from "@/utils/validate_elp";
import { useRouter } from 'vue-router'
import authService from '@auth/services/auth.service'
import { useAuthStore } from '@auth/stores/auth.store'

/**
 * Variable define
 */
const authStore = useAuthStore()
const changeForm = ref<FormInstance>()
const router = useRouter();
const modal = ref<any>(null);
const user_id = ref<any>('');
const modalTitle = ref<any>('');

const passwordValidate = reactive({
    olPass: '',
    newPass: '',
    cfPass: '',
})

const checkSamePassword = (rule: any, value: any, callback: any) => {
    if (value !== passwordValidate.newPass) {
        callback(
            new Error('Mật khẩu xác nhận chưa đúng')
        )
    } else {
        callback()
    }
}

const checkPasswrodInfection = (rule: any, value: any, callback: any) => {
    if (value === passwordValidate.olPass) {
        callback(new Error('Vui lòng nhập mật khẩu khác với mật khẩu hiện tại'))
    } else {
        callback()
    }
}

const rules = reactive({
    cfPass: [
        {
            required: true,
            validator: validate.required,
            trigger: 'blur',
            label: 'Xác nhận mật khẩu',
        },
        { validator: validate.alphabetAndSymbolRule, trigger: 'blur' },
        { validator: checkSamePassword, trigger: 'blur' },
    ],
    newPass: [
        {
            required: true,
            validator: validate.required,
            trigger: 'blur',
            label: 'Mật khẩu mới',
        },
        { validator: validate.alphabetAndSymbolRule, trigger: 'blur' },
        { validator: checkPasswrodInfection, trigger: 'blur' },
    ],
    olPass: [
        {
            required: true,
            validator: validate.required,
            trigger: 'blur',
            label: 'Mật khẩu hiện tại',
        },
        { validator: validate.alphabetAndSymbolRule, trigger: 'blur' },
    ],
})

/**
 * Life circle vue js
 */

/**
 * Function
 */

const open = async (title: any, id: any) => {
    modalTitle.value = title;
    user_id.value = id
    modal.value.open();
};

const close = () => {
    modal.value.close()
};

const changePassword = async () => {
    const data = {
        current_password: passwordValidate.olPass,
        new_password: passwordValidate.newPass,
    }
    if (data) {
        const response = await authService.changePassword(data)
        if (response.status == "success") {
            authStore.logout()
            router.push({
                name: "Login",
            });
        }
    }
}
const handleChangePass = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid) => {
        if (valid) {
            changePassword()
        }
    })
}
defineExpose({
    open,
    close,
});

</script>
<style>
.el-form-item {
    display: block;
}
</style>