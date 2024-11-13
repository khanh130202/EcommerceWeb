<template>
  <el-button
    :class="[
      'vc-button text-none',
      { 'v-btn--loading': loading },
      button_class,
    ]"
    :loading="loading"
    :disabled="loading"
    @click="onClicked"
  >
    <vc-icon class="mr-5" :type="icon" v-if="icon"></vc-icon>
    <slot></slot>
  </el-button>
</template>

<script setup lang="ts">
  import { toRef } from 'vue'

  const props = defineProps<{
    loading?: boolean
    code?: string
    icon?: any
    button_class?: string
  }>()

  const code = toRef(props, 'code')
  const emit = defineEmits(['click'])

  const onClicked = () => {
    emit('click')
  }

</script>

<style lang="scss" scoped>
  @import '@/assets/styles/commons/vc-button';
  .mr-5 {
    margin-right: 5px;
  }
</style>
