<template>
    <vc-breadcrumb :breadcrumbItems="breadcrumbItems" />
    <el-row :gutter="20" class="mt-4">
        <el-col :sm="6"></el-col>
        <el-col :sm="12">
            <el-card>
                <el-descriptions title="Thông tin tài khoản" direction="vertical" border style="margin-top: 20px">
                    <el-descriptions-item :rowspan="2" :width="140" label="Ảnh đại diện" align="center">
                        <el-image style="width: 100px; height: 100px"
                            :src="account.AvatarUrl ? getImageUrl(account.AvatarUrl) : `https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png`" />
                    </el-descriptions-item>
                    <el-descriptions-item label="Tên hiển thị">{{ account.FullName }}</el-descriptions-item>
                    <el-descriptions-item label="Số điện thoại">{{ account.PhoneNumber }}</el-descriptions-item>
                    <el-descriptions-item label="Email">{{ account.Email }}</el-descriptions-item>
                    <el-descriptions-item label="Địa chỉ">{{ account.Address }}</el-descriptions-item>
                </el-descriptions>
                <div style="margin-top: 10px;">
                    <el-button :loading="isLoading" type="success" @click="onClickUpdate">
                        Thay đổi
                    </el-button>
                    <span style="margin: 0 10px;">|</span>
                    <el-button :loading="isLoading" type="warning" @click="onClickChangePassword">
                        Đổi mật khẩu
                    </el-button>
                </div>
            </el-card>
        </el-col>
        <el-col :sm="6"></el-col>
    </el-row>
    <change-password ref="changePassRef"></change-password>
    <edit-profile ref="editProfileRef"></edit-profile>
</template>

<script setup lang="ts">
/**
 * Dependencies injection library
 */
import { storeToRefs } from 'pinia'
import { ref, reactive, onMounted } from "vue";
import { useAuthStore } from '@auth/stores/auth.store'
import { useActiveStore } from '@/stores/active.store'
import EditProfile from './EditProfile.vue';
import ChangePassword from './ChangePassword.vue';
import { getImageUrl } from '@/utils/getPathImg';

/**
 * Variable define
 */
const changePassRef = ref<any>(null);
const editProfileRef = ref<any>(null);
const activeStore = useActiveStore()
const authStore = useAuthStore()
const { account } = storeToRefs(authStore)
const isLoading = ref(false);

const breadcrumbItems = ref<any>([])

/**
 * Life circle vue js
 */
onMounted(() => {
    breadcrumbItems.value = [
        { text: 'Trang chủ', name: 'home' },
        { text: 'Thông tin tài khoản' }
    ]
    activeStore.set('7-1')
})
/**
 * Function
 */
const onClickUpdate = async () => {
    editProfileRef.value.open("Cập nhật thông tin cá nhân", account.value.UserID, async () => {
        await authStore.refresh()
    })
};
const onClickChangePassword = async () => {
    changePassRef.value.open("Đổi mật khẩu", account.value.UserID)
};

</script>
<style>
.el-form-item {
    display: block;
}
</style>