<template>
  <vc-modal ref="modal" :title="modalTitle" :type="props.type" @close="close">
    <template #content>
      <el-form ref="userForm" :model="user" :rules="rules" label-position="right" style="padding: 12px 16px"
        require-asterisk-position="right">
        <vc-row :gutter="20">
          <vc-col :span="24">
            <vc-input-group required prop="FullName" label='Họ và tên'>
              <vc-input v-model="user.FullName" placeholder='Nhập họ và tên' maxlength="100" />
            </vc-input-group>
          </vc-col>
        </vc-row>
        <vc-row :gutter="20">
          <vc-col :span="12">
            <vc-input-group required prop="Email" label='Email'>
              <vc-input v-model="user.Email" placeholder='Nhập Email' maxlength="255" disabled />
            </vc-input-group>
          </vc-col>
          <vc-col :span="12">
            <vc-input-group required prop="PhoneNumber" label='Số điện thoại'>
              <vc-input v-model="user.PhoneNumber" placeholder='Nhập số điện thoại' maxlength="20" />
            </vc-input-group>
          </vc-col>
        </vc-row>
        <vc-row :gutter="20">
          <vc-col :span="24">
            <vc-input-group required prop="Address" label='Địa chỉ'>
              <vc-input v-model="user.Address" placeholder='Nhập địa chỉ' maxlength="255" type="textarea" />
            </vc-input-group>
          </vc-col>
        </vc-row>
        <vc-row :gutter="20">
          <vc-col :span="12">
            <vc-input-group prop="avatar" label='Ảnh đại diện'>
              <el-upload ref="upload" :on-change="handleFileChange" drag :auto-upload="false">
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text">
                  Thả tập tin ở đây hoặc <em>bấm vào để tải lên</em>
                </div>
              </el-upload>
            </vc-input-group>
          </vc-col>
          <vc-col v-if="type != POPUP_TYPE.CREATE" :span="12">
            <vc-input-group label='Ảnh hiện tại'>
              <el-image v-if="user.AvatarUrl" style="width: 100%; height: 100%" :src="getImageUrl(user.AvatarUrl)"
                fit="cover">
                <template #error>
                  <div class="image-slot">
                    <el-icon><icon-picture /></el-icon>
                  </div>
                </template>
              </el-image>
            </vc-input-group>
          </vc-col>
        </vc-row>
      </el-form>
    </template>

    <template #acttion>
      <vc-button v-if="props.type != POPUP_TYPE.VIEW" type="primary" class="ml-2" code="F00004"
        @click="onSave(userForm)" :loading="isLoading" :icon="'FolderChecked'">
        {{ props.type == POPUP_TYPE.CREATE ? "Thêm mới" : "Chỉnh sửa" }}
      </vc-button>
    </template>
    <vc-confirm ref="confirmDialog"></vc-confirm>
  </vc-modal>
</template>

<script setup lang="ts">
/**
 * Dependencies injection library
 */
import { ref, reactive } from "vue";
import validate from "@/utils/validate_elp";
import type { FormInstance } from "element-plus";
import userService from '@app/services/user.service';
import { POPUP_TYPE } from "@/commons/const";
import { getImageUrl } from '@/utils/getPathImg';

/**
 * Variable define
 */
const rules = reactive({
  FullName: [
    { label: 'Họ và tên', required: true, validator: validate.required, trigger: ["blur"] },
    { label: 'Họ và tên', validator: validate.maxLengthRule, trigger: ["blur"], max: 100 },
  ],
  PhoneNumber: [
    { label: 'Số điện thoại', required: true, validator: validate.required, trigger: ["blur"] },
    { label: 'Số điện thoại', validator: validate.phoneNumberRule, trigger: ["blur"], max: 20 },
  ],
  Email: [
    { label: 'Email', required: true, validator: validate.required, trigger: ["blur"] },
    { label: 'Email', validator: validate.emailRule, trigger: ["blur"], max: 255 },
  ],
  Address: [
    { label: 'Địa chỉ', required: true, validator: validate.required, trigger: ["blur"] },
    { label: 'Địa chỉ', validator: validate.maxLengthRule, trigger: ["blur"], max: 255 },
  ],
});

const props = defineProps<{
  type: POPUP_TYPE;
}>();

const userForm = ref<FormInstance>();
const isLoading = ref(false);
const upload = ref<any>(null);
const confirmDialog = ref<any>(null);
const modal = ref<any>(null);
const modalTitle = ref<any>(null);
const avatar_selected = ref<any>(null);
const flagEmail = ref<any>(null);
const roles = ref<any>([]);
let callback = (value: any) => { return value };

const user = reactive({
  UserID: '',
  FullName: null,
  Email: null,
  PhoneNumber: null,
  Address: null,
  AvatarUrl: null,
  RoleName: null,
  RoleIds: '',
  Password: '',
  CreatedAt: '',
});

/**
 * Life circle vue js
 */

/**
 * Function
 */
const onSave = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  await formEl.validate(async (valid) => {
    if (!valid) return;

    isLoading.value = true;

    const formData = new FormData();
    formData.append('FullName', user.FullName ?? "");
    formData.append('Email', user.Email ?? "");
    formData.append('PhoneNumber', user.PhoneNumber ?? "");
    formData.append('Address', user.Address ?? "");
    formData.append('RoleIds', user.RoleIds ?? "");

    if (avatar_selected.value && avatar_selected.value.length != 0) {
      avatar_selected.value.forEach((file: any) => {
        formData.append('avatarFile', file.raw);
      });
    }
    if (user.UserID) {
      if (user.Password) {
        formData.append('Password', user.Password ?? "");
      }
      await userService.update(user.UserID, formData).finally(() => {
        isLoading.value = false;
      });
    } else {
      formData.append('Password', user.Password ?? "");
      await userService.create(formData).finally(() => {
        isLoading.value = false;
      });
    }
    callback(true);
    close();
  });
};

const open = async (title: any, item: any, _callback: any) => {
  let userInfo = {
    UserID: '',
    FullName: null,
    Email: null,
    PhoneNumber: null,
    Address: null,
    AvatarUrl: null,
    RoleName: null,
    RoleIds: '',
    password: null,
    CreatedAt: '',
  };
  modalTitle.value = title;

  if (item)
    userInfo = (await userService.detail(item)).data?.user as any
  callback = _callback;
  Object.assign(user, userInfo)
  user.Password = ''
  flagEmail.value = user.Email;
  modal.value.open();
};

const close = () => {
  if (upload.value) {
    upload.value!.submit()
  }
  if (userForm.value) {
    userForm.value.resetFields();
  }
  modal.value.close()
};

const handleFileChange = (file: any, fileList: any) => {
  avatar_selected.value = fileList;
}

defineExpose({
  open,
  close,
});

</script>
<style>
.el-form-item {
  display: block !important;
}
</style>