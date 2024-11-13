<template>
  <el-dialog v-model="is_show" :show-close="false" :lock-scroll="true" :before-close="handleClose"
    :fullscreen="isFullscreen">
    <template #header="{ titleId, titleClass }">
      <div class="d-flex space-between align-center">
        <h4 :id="titleId" :class="titleClass">{{ title }}</h4>
        <div>
          <slot name="acttion"></slot>
          <vc-button v-if="!hiddenScreen" class="btn-fullscreen" @click="onFullScreen"
            :icon="isFullscreen ? 'Minus' : 'FullScreen'" />
          <vc-button type="info" class="btn-close" @click="onClose" :icon="'Close'">
            Thoát
          </vc-button>
        </div>
      </div>
    </template>
    <div class="vc-content-dialog" :style="{ 'max-height': dialogHeight }">
      <slot name="content" class="mt-2"></slot>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, toRefs, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  title?: string,
  hiddenScreen?: boolean
}>()
const emit = defineEmits(['close'])

const is_show = ref(false)
const is_close = ref(false)
const { hiddenScreen, title } = toRefs(props)
const isFullscreen = ref(false)
const dialogHeight = ref(`${window.innerHeight - 210}px`);

onMounted(() => {
  window.addEventListener('resize', updateDialogHeight);
  updateDialogHeight();
});

onUnmounted(() => {
  window.removeEventListener('resize', updateDialogHeight);
});

const handleClose = () => {
  if (is_close.value) close()
}

const onClose = () => {
  is_close.value = true
  handleClose()
  emit('close')
}

const open = () => {
  is_show.value = true
  is_close.value = false
}

const close = () => {
  is_show.value = false
  is_close.value = false
}

const onFullScreen = () => {
  isFullscreen.value = !isFullscreen.value
}

const updateDialogHeight = () => {
  const screenHeight = window.innerHeight;
  dialogHeight.value = `${screenHeight - 210}px`;
}

defineExpose({
  open,
  close,
})
</script>

<style lang="scss">
@import '@/assets/styles/commons/vc-modal.scss';
</style>