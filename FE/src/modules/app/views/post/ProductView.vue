<template>
  <div class="vc-page page-product-list">
    <!-- header block-->
    <vc-card class="mt-4 mb-4">
      <vc-button type="primary" :icon="'Plus'" @click="onAddNew">Thêm mới</vc-button>
      <vc-row class="mt-4">
        <vc-col :span="5" class="mr-2">
          <vc-input placeholder="Nhập từ khóa tìm kiếm" v-model="search" />
        </vc-col>
        <vc-col :span="2">
          <vc-button type="primary" :icon="'Search'" @click="onSearch" />
        </vc-col>
      </vc-row>
    </vc-card>
    <!-- detail block-->
    <vc-card class="mt-4 mb-4">
      <vc-table
        :datas="products"
        :tableConfig="tableConfig"
        :colConfigs="colConfig"
        :page="pageConfig"
        :loading="loading"
        @dbClick="onEdit"
        @pageChanged="onPageChanged"
        @sorted="onSort"
      >
        <template #action="{ data }">
          <div class="d-flex flex-center">
            <vc-button
              type="warning"
              size="small"
              class="btn-acttion"
              @click="onView(data)"
              :icon="'View'"
            ></vc-button>
            <vc-button
              type="primary"
              size="small"
              class="btn-acttion"
              @click="onEdit(data)"
              :icon="'Edit'"
            ></vc-button>
            <vc-button
              type="danger"
              size="small"
              class="btn-acttion"
              @click="onDeleteItem(data)"
              :icon="'Delete'"
            ></vc-button>
          </div>
        </template>
      </vc-table>
    </vc-card>
  </div>
  <vc-confirm ref="confirmDialog"></vc-confirm>
  <detail-product-view ref="detailRef" :type="popupType"></detail-product-view>
</template>
<script setup lang="ts">
/**
 * Dependencies injection library
 */
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { colConfig, tableConfig } from '@/commons/config/product.config'
import { useProductStore } from '@app/stores/product.store'
import DetailProductView from './DetailProductView.vue'
import { POPUP_TYPE } from '@/commons/const'
import productService from '@app/services/product.service'
import { useAuthStore } from '@auth/stores/auth.store'

/**
 * Variable define
 */
const props = defineProps<{
  product_status_id?: any
}>()

const authStore = useAuthStore()
const { account } = storeToRefs(authStore)
const store = useProductStore()
const { products, pageConfig, loading, search, goSort } = storeToRefs(store)
const popupType = ref<any>(null)
const detailRef = ref<any>(null)
const confirmDialog = ref<any>(null)

/**
 * Life circle vue js
 */
// onMounted function
onMounted(async () => {
  await onSearch()
})

/**
 * Function
 */
// onSearch
const onSearch = async () => {
  await store.getList(account.value.user_id, props.product_status_id)
}

// onPageChanged
const onPageChanged = async (page: any) => {
  pageConfig.value = { ...page }
  await onSearch()
}

// onAddNew
const onAddNew = () => {
  popupType.value = POPUP_TYPE.CREATE
  detailRef.value.open('Thêm mới', null, null, async (res: any) => {
    if (res) await onSearch()
  })
}

// onEdit
const onEdit = (item: any) => {
  popupType.value = POPUP_TYPE.EDIT
  detailRef.value.open('Chỉnh sửa', item.product_id, props.product_status_id, async (res: any) => {
    if (res) await onSearch()
  })
}

// onView
const onView = (item: any) => {
  popupType.value = POPUP_TYPE.VIEW
  detailRef.value.open('Chi tiết', item.product_id, props.product_status_id)
}

// onSort
const onSort = async (sortBy: any) => {
  goSort.value = sortBy
  await onSearch()
}

// onDeleteItem
const onDeleteItem = (item: any) => {
  confirmDialog.value.confirm('Xác nhận xóa', 'Bạn muốn xóa dữ liệu?', async (res: any) => {
    if (res) {
      await productService.delete(item)
      await onSearch()
    }
  })
}
</script>

<style>
.page-product-list .inline-flex-container {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
}

.mt-4 {
  margin-top: 16px;
}

.mb-4 {
  margin-bottom: 16px;
}
</style>
