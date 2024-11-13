<template>
  <div class="vc-notify mb-2 mt-2">
    <el-alert
      v-if="item.message"
      :type="item.type"
      :title="item.title"
      :description="item.message"
      show-icon
      @close="notifyStore.remove()"
    />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { onBeforeRouteLeave } from 'vue-router'
  import { useNotifyStore } from '@/stores/notify.store'

  const notifyStore = useNotifyStore()
  const { item } = storeToRefs(notifyStore)

  const path = [
    {
      path: '/statement?tb=0',
    },
    {
      path: '/statement?tb=1',
    },
    {
      path: '/statement?tb=2',
    },
    {
      path: '/statement?tb=3',
    },
    {
      path: '/statement?tb=4',
    },
    {
      path: '/report/cash-statement-month',
    },
    {
      path: '/report/bank-statement-month',
    },
    {
      path: '/report/class_statement',
    },
    {
      path: '/cash-statement?tb=001',
    },
    {
      path: '/bank-statement?tb=002',
    },
    {
      path: '/report/class_statement?tb=003',
    },
  ]
  onBeforeRouteLeave((to, from) => {
    const isDifferentPath = path.every((res) => to.fullPath !== res.path)
    if (isDifferentPath) {
      if (to.fullPath == '/') {
        // notifyStore.remove()
      } else {
        notifyStore.remove()
      }
    }
  })
</script>

<style lang="scss" scoped>
  @import '@/assets/styles/commons/vc-toast';
</style>
