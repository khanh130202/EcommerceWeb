<template>
  <vc-modal ref="modal" :title="modalTitle" :type="props.type" @close="close">
    <template #content>
      <el-descriptions style="padding: 12px 16px" :column="1" border v-if="type == POPUP_TYPE.VIEW">
        <el-descriptions-item>
          <template #label>
            <div class="cell-item" style="width: 150px">Tên người tạo</div>
          </template>
          {{ product.CreatedName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item" style="width: 150px">Tên sản phẩm</div>
          </template>
          {{ product.ProductName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">Tên danh mục</div>
          </template>
          {{ product.CategoryName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">Mô tả</div>
          </template>
          {{ product.Description }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">Giá</div>
          </template>
          {{ number.formatCurrency(product.Price) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">Số lượng</div>
          </template>
          {{ number.formatNumberWithDots(product.StockQuantity) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">Ngày tạo</div>
          </template>
          {{ dateTime.formatDateTimeNew(product.CreatedAt) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">Hình ảnh</div>
          </template>
          <vc-row :gutter="20">
            <vc-col v-for="(image, index) in product.ImageUrls" :key="index" :span="6">
              <el-image style="width: 100px; height: 100px" :src="getImageUrl(image.ImageUrl)" fit="cover">
                <template #error>
                  <div class="image-slot">
                    <el-icon><icon-picture /></el-icon>
                  </div>
                </template>
              </el-image>
            </vc-col>
          </vc-row>
        </el-descriptions-item>
      </el-descriptions>
      <el-form ref="productForm" :model="product" :rules="rules" label-position="right" style="padding: 12px 16px"
        require-asterisk-position="right" v-else>
        <vc-row :gutter="20">
          <vc-col :span="12">
            <vc-input-group required prop="ProductName" label="Tên sản phẩm">
              <vc-input v-model="product.ProductName" placeholder="Nhập tên sản phẩm" maxlength="250" />
            </vc-input-group>
          </vc-col>
          <vc-col :span="12">
            <vc-input-group required prop="CategoryID" label="Danh mục">
              <el-tree-select v-model="product.CategoryID" :data="dataGrid" check-strictly :render-after-expand="false"
                show-checkbox check-on-click-node />
            </vc-input-group>
          </vc-col>
        </vc-row>
        <vc-row :gutter="20">
          <vc-col :span="12">
            <vc-input-group prop="Price" label="Giá">
              <vc-input v-model="product.Price" placeholder="Nhập giá" type="number" @change="validatePrice" />
            </vc-input-group>
          </vc-col>
          <vc-col :span="12">
            <vc-input-group prop="StockQuantity" label="Số lượng">
              <vc-input v-model="product.StockQuantity" placeholder="Nhập số lượng" type="number"
                @change="validateQuantity" />
            </vc-input-group>
          </vc-col>
        </vc-row>
        <vc-row :gutter="20">
          <vc-col>
            <vc-input-group required prop="images" label="Hình ảnh">
              <el-upload ref="upload" class="upload-demo" :on-change="handleFileChange" drag :auto-upload="false"
                multiple>
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text">
                  Thả tập tin ở đây hoặc <em>bấm vào để tải lên</em>
                </div>
              </el-upload>
            </vc-input-group>
          </vc-col>
        </vc-row>
        <vc-row :gutter="20" v-if="props.type == POPUP_TYPE.EDIT">
          <vc-col v-for="(image, index) in product.ImageUrls" :key="index" :span="4">
            <el-image style="width: 100px; height: 100px" :src="getImageUrl(image.ImageUrl)" fit="cover">
              <template #error>
                <div class="image-slot">
                  <el-icon><icon-picture /></el-icon>
                </div>
              </template>
            </el-image>
            <vc-button type="danger" size="small" class="btn-acttion" @click="onDeleteImage(image.ImageID)"
              :icon="'Delete'"></vc-button>
          </vc-col>
        </vc-row>
        <vc-row :gutter="20">
          <vc-col :span="24">
            <vc-input-group prop="Description" label="Mô tả">
              <Ckeditor v-model="product.Description" :type="props.type" />
            </vc-input-group>
          </vc-col>
        </vc-row>
      </el-form>
    </template>

    <template #acttion>
      <vc-button v-if="props.type != POPUP_TYPE.VIEW" type="primary" class="ml-2" code="F00004"
        @click="onSave(productForm)" :loading="isLoading" :icon="'FolderChecked'">
        {{ props.type == POPUP_TYPE.CREATE ? 'Thêm mới' : 'Chỉnh sửa' }}
      </vc-button>
    </template>
  </vc-modal>
  <vc-confirm ref="confirmDialog"></vc-confirm>
</template>

<script setup lang="ts">
/**
 * Dependencies injection library
 */
import { storeToRefs } from 'pinia'
import { onMounted, ref, reactive } from 'vue'
import validate from '@/utils/validate_elp'
import productService from '@app/services/product.service'
import { POPUP_TYPE } from '@/commons/const'
import dateTime from '@/utils/dateTime'
import { useCategoryStore } from '@app/stores/category.store'
import { useToastStore } from '@/stores/toast.store'
import type { FormInstance, UploadInstance } from 'element-plus'
import number from '@/utils/number'
import { getImageUrl } from '@/utils/getPathImg'
import Ckeditor from './Ckeditor.vue';

/**
 * Variable define
 */
const toastStore = useToastStore()
const rules = reactive({
  ProductName: [
    { label: 'Tên sản phẩm', required: true, validator: validate.required, trigger: ['blur'] },
    { label: 'Tên sản phẩm', validator: validate.maxLengthRule, trigger: ['blur'], max: 255 }
  ],
  CategoryID: [
    { label: 'Danh mục', required: true, validator: validate.required, trigger: ['change'] }
  ]
})

const props = defineProps<{
  type: POPUP_TYPE
}>()

const productForm = ref<FormInstance>()
const isLoading = ref(false)
const confirmDialog = ref<any>(null)
const modal = ref<any>(null)
const modalTitle = ref<any>(null)
const ImageSelected = ref<any>([])
let callback = (value: any) => {
  return value
}
const storeCategory = useCategoryStore()
const { dataGrid } = storeToRefs(storeCategory)
const upload = ref<UploadInstance>()

const product = reactive({
  ProductID: '',
  ProductName: null,
  CategoryID: '',
  CategoryName: '',
  Price: null as any,
  StockQuantity: null as any,
  ImageUrl: null,
  Description: null,
  CreatedAt: '',
  CreatedName: '',
  ImageUrls: [] as any
})

/**
 * Life circle vue js
 */
// onMounted function
onMounted(async () => {
  await storeCategory.getList()
})

/**
 * Function
 */
const validateQuantity = (val: any) => {
  if (val < 1) {
    product.Quantity = 1
  }
}

const validatePrice = (val: any) => {
  if (val < 0) {
    product.Price = 0
  }
}

const onSave = async (formEl: FormInstance | undefined) => {
  if (!formEl) return

  await formEl.validate(async (valid) => {
    if (!valid) return

    if (ImageSelected.value.length <= 1 && props.type == POPUP_TYPE.CREATE) {
      toastStore.push({
        type: 'error',
        message: 'Vui lòng chọn 2 hình ảnh'
      })
      return
    }
    isLoading.value = true
    const formData = new FormData()
    formData.append('ProductName', product.ProductName ?? '')
    formData.append('title', product.title ?? '')
    formData.append('CategoryID', product.CategoryID ?? '')
    formData.append('Price', product.Price ?? '')
    formData.append('Quantity', product.Quantity ?? '')
    if (ImageSelected.value.length != 0) {
      ImageSelected.value.forEach((file: any) => {
        formData.append('productImages', file.raw)
      })
    }
    formData.append('Description', product.Description ?? '')

    if (product.ProductID) {
      await productService.update(product.ProductID, formData).finally(() => {
        isLoading.value = false
      })
    } else {
      await productService.create(formData).finally(() => {
        isLoading.value = false
      })
    }
    callback(true)
    close()
  })
}

const open = async (title: any, item: any, product_status_id: any, _callback: any) => {
  let productInfo = {
    ProductID: '',
    ProductName: null,
    CategoryID: '',
    CategoryName: '',
    Price: null as any,
    Quantity: null as any,
    ImageUrl: null,
    Description: null,
    condition: '',
    CreatedAt: '',
    CreatedName: '',
    ImageUrls: [] as any
  } as any
  modalTitle.value = title

  if (item) {
    productInfo = (await productService.detail(item)).data?.product
  }
  callback = _callback

  Object.assign(product, productInfo)
  modal.value.open()
  if (item) {
    product.ImageUrls = (await productService.getListImage(item)).data?.result
  }
}

const close = () => {
  if (upload.value) {
    upload.value!.submit()
  }
  if (productForm.value) {
    productForm.value.resetFields()
  }
  modal.value.close()
}

const handleFileChange = (file: any, fileList: any) => {
  ImageSelected.value = fileList
}

// onDeleteImage
const onDeleteImage = (ImageID: any) => {
  if (product.ImageUrls.length <= 2) {
    toastStore.push({
      type: 'error',
      message: 'Phải có ít nhất một hình ảnh'
    })
    return
  }
  confirmDialog.value.confirm('Xác nhận xóa', 'Bạn muốn xóa hình ảnh?', async (res: any) => {
    if (res) {
      await productService.deleteImage(ImageID)
      product.ImageUrls =
        (await productService.getListImage(product.ProductID)).data?.result ?? []
    }
  })
}

defineExpose({
  open,
  close
})
</script>
<style>
.el-form-item {
  display: block;
}

.upload-demo {
  width: 100%;
}
</style>
