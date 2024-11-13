<template>
  <!-- <vc-card class="pb-3"> -->
  <div class="vc-table">
    <el-table stripe style="width: 100%" v-loading="loading" :maxHeight="defaultHeight" :data="datas" border
      @selection-change="onRowSelected" @sort-change="onSortChange" @row-dblclick="onRowDbClick">
      <!-- INDEX -->
      <el-table-column label="#" width="50" type="index" align="center" header-align="center"
        v-if="tableConfig.index" />

      <!-- CHECK BOX -->
      <el-table-column type="selection" width="40" v-if="tableConfig.checkbox" />

      <!-- DATA -->
      <template v-for="(col, index) in colConfigs" :key="index">
        <el-table-column :prop="col.key" :width="col.width" :label="col.title" :sortable="col.is_sort"
          v-if="!col.is_custom" />
        <el-table-column :width="col.width" :label="col.title" :sortable="col.is_sort" v-if="col.is_custom">
          <template #default="scope">
            <div class="d-flex flex-start">
              <slot :name="col.key" :data="scope.row" :scope="scope"></slot>
            </div>
          </template>
        </el-table-column>
      </template>

      <!-- ACTIONS -->
      <el-table-column width="170" v-if="tableConfig.action">
        <template #default="scope">
          <div class="d-flex flex-center btn-group-action">
            <slot name="action" :data="scope.row" :scope="scope" class="btn-action"></slot>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- PAGING -->
    <div class="table-footer pa-2 pt-3" v-if="tableConfig?.showPaging">
      <vc-pagination :pageConfig="pageConfig" @changed="onPageChanged"></vc-pagination>
    </div>
    <!-- PAGING -->
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, onMounted, onUnmounted } from 'vue'
import type { MetaResponse } from '@/interfaces/response.interface'
import type { ColConfig, TableConfig } from '@/interfaces/table.interface'
import VcPagination from './vc-pagination.vue'

const props = defineProps<{
  datas?: any[]
  colConfigs: ColConfig[]
  tableConfig: TableConfig
  page: MetaResponse
  height?: string
  loading?: boolean
}>()

const {
  datas,
  tableConfig,
  colConfigs,
  page: pageConfig,
  height,
  loading,
} = toRefs(props)

const emit = defineEmits([
  'dbClick',
  'onDelete',
  'sorted',
  'rowSelected',
  'pageChanged',
])

const colSettings = ref<ColConfig[]>([])
const defaultHeight = ref(window.innerHeight - 308)

onMounted(() => {
  colSettings.value = colConfigs.value
  window.addEventListener('resize', updateTableHeight);
})

onUnmounted(() => {
  window.removeEventListener('resize', updateTableHeight);
});

const updateTableHeight = () => {
  defaultHeight.value = window.innerHeight - 308;
}

const onPageChanged = (page: any) => {
  emit('pageChanged', page)
}

const onRowDbClick = (item: any) => {
  if (tableConfig.value.dbClick) emit('dbClick', item)
}

/**
 * Event clicked row check box
 * Emit rowSelected
 */
const onRowSelected = (items: any[]) => {
  emit('rowSelected', items)
}

/**
 * Event click sort table header
 * Emit sorted
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const onSortChange = (config: any) => {
  if (config.column == null) {
    emit('sorted', null)
    return
  }

  emit(
    'sorted',
    `${config.prop}.${config.order == 'ascending' ? 'asc' : 'desc'}`
  )
}
</script>
<style lang="scss">
@import '@/assets/styles/commons/vc-table';
</style>
