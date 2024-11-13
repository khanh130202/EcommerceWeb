<template>
  <vc-modal ref="modal" :title="modalTitle" :type="props.type" @close="close">
    <template #content>
      <el-descriptions style="padding: 12px 16px" :column="1" border v-if="type == POPUP_TYPE.VIEW">
        <el-descriptions-item>
          <template #label>
            <div class="cell-item" style="width: 150px">Tên người tạo</div>
          </template>
          {{ product.created_name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item" style="width: 150px">Tên sản phẩm</div>
          </template>
          {{ product.product_name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">Tên danh mục</div>
          </template>
          {{ product.category_name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">Tiêu đề</div>
          </template>
          {{ product.title }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">Mô tả</div>
          </template>
          {{ product.description }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">Tình trạng</div>
          </template>
          {{ product.condition }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">Giá</div>
          </template>
          {{ number.formatCurrency(product.price) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">Số lượng</div>
          </template>
          {{ number.formatNumberWithDots(product.quantity) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">Trạng thái sản phẩm</div>
          </template>
          {{ product.product_status_name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">Ngày tạo</div>
          </template>
          {{ dateTime.formatDateTimeNew(product.created_at) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">Hình ảnh</div>
          </template>
          <vc-row :gutter="20">
            <vc-col v-for="(image, index) in product.image_urls" :key="index" :span="6">
              <el-image style="width: 100px; height: 100px" :src="getImageUrl(image.image_url)" fit="cover">
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
          <vc-col :span="type != POPUP_TYPE.CREATE ? 12 : 24">
            <vc-input-group required prop="product_name" label="Tên sản phẩm">
              <vc-input v-model="product.product_name" placeholder="Nhập tên sản phẩm" maxlength="250" />
            </vc-input-group>
          </vc-col>
          <vc-col v-if="type != POPUP_TYPE.CREATE" :span="12">
            <vc-input-group required prop="product_status_id" label='Trạng thái sản phẩm'>
              <el-select v-model="product.product_status_id" placeholder="Chọn trạng thái sản phẩm">
                <el-option v-for="item in dataGridMasterCode" :key="item.master_code_id" :label="item.value"
                  :value="item.master_code_id" />
              </el-select>
            </vc-input-group>
          </vc-col>
        </vc-row>
        <vc-row :gutter="20">
          <vc-col :span="12">
            <vc-input-group required prop="category_id" label="Danh mục">
              <el-tree-select v-model="product.category_id" :data="dataTree" check-strictly :render-after-expand="false"
                show-checkbox check-on-click-node />
            </vc-input-group>
          </vc-col>
          <vc-col :span="12">
            <vc-input-group required prop="title" label="Tiêu đề">
              <vc-input v-model="product.title" placeholder="Nhập tiêu đề sản phẩm" maxlength="250" />
            </vc-input-group>
          </vc-col>
        </vc-row>
        <vc-row :gutter="20">
          <vc-col :span="12">
            <vc-input-group prop="price" label="Giá (nếu quyên góp thì nhập 0)">
              <vc-input v-model="product.price" placeholder="Nhập giá (nếu quyên góp thì nhập 0)" type="number"
                @change="validatePrice" />
            </vc-input-group>
          </vc-col>
          <vc-col :span="12">
            <vc-input-group prop="quantity" label="Số lượng">
              <vc-input v-model="product.quantity" placeholder="Nhập số lượng" type="number"
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
          <vc-col v-for="(image, index) in product.image_urls" :key="index" :span="4">
            <el-image style="width: 100px; height: 100px" :src="getImageUrl(image.image_url)" fit="cover">
              <template #error>
                <div class="image-slot">
                  <el-icon><icon-picture /></el-icon>
                </div>
              </template>
            </el-image>
            <vc-button type="danger" size="small" class="btn-acttion" @click="onDeleteImage(image.product_image_id)"
              :icon="'Delete'"></vc-button>
          </vc-col>
        </vc-row>
        <vc-row :gutter="20">
          <vc-col :span="24">
            <vc-input-group prop="condition" label="Tình trạng">
              <vc-input v-model="product.condition" placeholder="Nhập tình trạng sản phẩm" type="textarea" />
            </vc-input-group>
          </vc-col>
        </vc-row>
        <vc-row :gutter="20">
          <vc-col :span="24">
            <vc-input-group prop="description" label="Mô tả">
              <Ckeditor v-model="product.description" :type="props.type" />
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
import { useMasterCodeStore } from '@app/stores/masterCode.store'
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
  product_name: [
    { label: 'Tên sản phẩm', required: true, validator: validate.required, trigger: ['blur'] },
    { label: 'Tên sản phẩm', validator: validate.maxLengthRule, trigger: ['blur'], max: 255 }
  ],
  title: [
    { label: 'Tiêu đề sản phẩm', required: true, validator: validate.required, trigger: ['blur'] },
    { label: 'Tiêu đề sản phẩm', validator: validate.maxLengthRule, trigger: ['blur'], max: 255 }
  ],
  product_status_id: [
    {
      label: 'Trạng thái sản phẩm',
      required: true,
      validator: validate.required,
      trigger: ['change']
    }
  ],
  category_id: [
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
const image_selected = ref<any>([])
let callback = (value: any) => {
  return value
}
const storeCategory = useCategoryStore()
const storeMasterCode = useMasterCodeStore()
const { dataTree } = storeToRefs(storeCategory)
const { dataGrid: dataGridMasterCode } = storeToRefs(storeMasterCode)
const upload = ref<UploadInstance>()

const product = reactive({
  product_id: '',
  product_name: null,
  category_id: '',
  category_name: '',
  product_status_id: '',
  product_status_name: '',
  title: '',
  price: null as any,
  quantity: null as any,
  url_image: null,
  description: null,
  condition: '',
  created_at: '',
  created_name: '',
  image_urls: [] as any
})

/**
 * Life circle vue js
 */
// onMounted function
onMounted(async () => {
  await storeCategory.getTree()
  await storeMasterCode.getList(MASTER_CODE.PRODUCT_STATUS)
})

/**
 * Function
 */
const validateQuantity = (val: any) => {
  if (val < 1) {
    product.quantity = 1
  }
}

const validatePrice = (val: any) => {
  if (val < 0) {
    product.price = 0
  }
}

const onSave = async (formEl: FormInstance | undefined) => {
  if (!formEl) return

  await formEl.validate(async (valid) => {
    if (!valid) return

    if (image_selected.value.length <= 1 && props.type == POPUP_TYPE.CREATE) {
      toastStore.push({
        type: 'error',
        message: 'Vui lòng chọn 2 hình ảnh'
      })
      return
    }
    isLoading.value = true
    const formData = new FormData()
    formData.append('product_name', product.product_name ?? '')
    formData.append('title', product.title ?? '')
    formData.append('category_id', product.category_id ?? '')
    formData.append('price', product.price ?? '')
    formData.append('quantity', product.quantity ?? '')
    if (image_selected.value.length != 0) {
      image_selected.value.forEach((file: any) => {
        formData.append('productImages', file.raw)
      })
    }
    formData.append('description', product.description ?? '')
    formData.append('condition', product.condition ?? '')

    if (product.product_id) {
      await productService.update(product.product_id, formData).finally(() => {
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
    product_id: '',
    product_name: null,
    category_id: '',
    category_name: '',
    product_status_id: '',
    product_status_name: '',
    title: '',
    price: null as any,
    quantity: null as any,
    url_image: null,
    description: null,
    condition: '',
    created_at: '',
    created_name: '',
    image_urls: [] as any
  } as any
  modalTitle.value = title

  if (item) {
    productInfo = (await productService.detail(item, product_status_id)).data?.product
  }
  callback = _callback

  Object.assign(product, productInfo)
  modal.value.open()
  if (item) {
    product.image_urls = (await productService.getListImage(item)).data?.result
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
  image_selected.value = fileList
}

// onDeleteImage
const onDeleteImage = (product_image_id: any) => {
  if (product.image_urls.length <= 2) {
    toastStore.push({
      type: 'error',
      message: 'Phải có ít nhất một hình ảnh'
    })
    return
  }
  confirmDialog.value.confirm('Xác nhận xóa', 'Bạn muốn xóa hình ảnh?', async (res: any) => {
    if (res) {
      await productService.deleteImage(product_image_id)
      product.image_urls =
        (await productService.getListImage(product.product_id)).data?.result ?? []
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
