<template>
    <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect">
        <el-menu-item index="0">
            <router-link :to="{ name: 'home' }">
                <h1 style="color: #48a2ff">EcommerceWeb</h1>
            </router-link>
        </el-menu-item>

        <div>
            <el-input style="width: 240px; height: 40px; margin: auto 20px" placeholder="Nhập từ khóa tìm kiếm" prefix-icon="Search" v-model="keyword"
                @keyup.enter="handleSearch" />
        </div>

        <el-menu-item v-if="loggedIn" index="2" @click="onCart">
            <el-badge :value="cartStore.TotalQuantity" class="item">
                <el-icon>
                    <ShoppingCart />
                </el-icon>
            </el-badge>
        </el-menu-item>

        <el-sub-menu index="4">
            <template #title>Danh mục sản phẩm</template>
            <template v-for="(item, index) in dataGrid" :key="index">
                <el-menu-item :index="`4*${index + 1}`" @click="goCollection(item.CategoryID, item.CategoryName)">
                    {{ item.CategoryName }}
                </el-menu-item>
            </template>
        </el-sub-menu>
        <el-menu-item index="5" v-if="!loggedIn" @click="onLogin">
            Đăng nhập
        </el-menu-item>
        <el-menu-item index="6" v-if="!loggedIn" @click="onRegister">
            Đăng kí
        </el-menu-item>

        <el-sub-menu index="7" v-if="loggedIn">
            <template #title>{{ account.FullName }}</template>
            <el-menu-item index="7-1" @click="onProfile">
                Thông tin tài khoản
            </el-menu-item>
            <el-menu-item index="7-3" @click="onLogout">Đăng xuất</el-menu-item>

        </el-sub-menu>

        <el-sub-menu index="8" v-if="loggedIn">
            <template #title>Quản lí đơn hàng</template>
            <el-menu-item index="8-1" @click="onPurchaseOrder">
                Đơn mua
            </el-menu-item>
            <el-menu-item index="8-2" @click="onManageOrder">
                Đơn bán
            </el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="9" v-if="loggedIn">
            <template #title>Tiện ích</template>
            <el-menu-item index="9-1" @click="onPostSale">
                Quản lí sản phẩm
            </el-menu-item>
            <el-menu-item index="9-2" @click="onMngCategory">
                Quản lí danh mục
            </el-menu-item>
            <el-menu-item index="9-3" @click="onMngUser">
                Quản lí người dùng
            </el-menu-item>
            <el-menu-item index="9-4" @click="onRevenue">
                Thống kê
            </el-menu-item>
        </el-sub-menu>
    </el-menu>
</template>

<script lang="ts" setup>
/**
 * Dependencies injection library
 */
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch, computed } from 'vue'
import { useActiveStore } from '@/stores/active.store'
import { useAuthStore } from '@auth/stores/auth.store'
import { useRouter } from 'vue-router'
import { useCategoryStore } from '@app/stores/category.store'
import { useCartStore } from '@app/stores/cart.store'
import { ElMessageBox } from 'element-plus'
import { ElNotification } from 'element-plus'

/**
 * Variable define
 */
const cartStore = useCartStore();
const router = useRouter()
const activeStore = useActiveStore()
const authStore = useAuthStore()
const { activeIndex } = storeToRefs(activeStore)
const categoryStore = useCategoryStore()
const { dataGrid } = storeToRefs(categoryStore)
const { account, loggedIn } = storeToRefs(authStore)

const keyword = ref<any>('')

/**
 * Life circle vue js
 */
onMounted(async () => {
    if (loggedIn.value) {
        await cartStore.initializeCart()

    }
    await categoryStore.getList()
})

watch(loggedIn, async (newValue) => {
    if (newValue) {
        await cartStore.initializeCart()
    }
});

/**
 * Function
 */

const onLogout = async () => {
    try {
        const response = await ElMessageBox.confirm('Bạn muốn đăng xuất?');

        if (response) {
            authStore.logout()
            router.push({ name: 'Login' });
        }
    } catch (error) { }

    keyword.value = ''
}

const goCollection = (value: any, label: any) => {

    router.push({
        name: 'Collection',
        query: {
            id: value,
            name: label,
        }
    })

    keyword.value = ''
};

const onLogin = () => {
    router.push({
        name: 'Login',
    })
    keyword.value = ''
}

const onRegister = () => {
    router.push({
        name: 'Register',
    })
    keyword.value = ''
}

const onProfile = () => {
    router.push({
        name: 'Profile',
    })
    keyword.value = ''
}

const onPurchaseOrder = () => {
    router.push({
        name: 'PurchaseOrder'
    })
    keyword.value = ''
}

const onPostSale = () => {
    router.push({
        name: 'ManageProduct'
    })
    keyword.value = ''
}

const onCart = () => {
    router.push({
        name: 'Cart'
    })
    keyword.value = ''
}

const onRevenue = () => {
    router.push({
        name: 'Revenue'
    })
    keyword.value = ''
}

const onManageOrder = () => {
    router.push({
        name: 'ManageOrder'
    })
    keyword.value = ''
}

const handleSearch = () => {
    router.push({
        name: 'Search',
        params: {
            keyword: keyword.value
        }
    })
    keyword.value = ''
}

const onMngCategory = () => {
    router.push({
        name: 'MngCategory',
    })
    keyword.value = ''
}

const onMngUser = () => {
    router.push({
        name: 'MngUser',
    })
    keyword.value = ''
}

const handleSelect = (key: string, keyPath: string[]) => {

}
</script>

<style>
.el-menu--horizontal>.el-menu-item:nth-child(1) {
    margin-right: auto;
}

.el-badge__content.is-fixed {
    top: 15px !important;
}
</style>