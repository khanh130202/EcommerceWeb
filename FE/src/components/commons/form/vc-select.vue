<template>
  <el-select v-model="modelValue" class="m-2" @change="onSelected">
    <el-option v-if="!customText" v-for="item in data" :key="item[fieldValue]" :label="item[fieldText]"
      :value="item[fieldValue]" />

    <el-option v-else v-for="item in data" :key="`${item[fieldValue]}`" :label="buildCustomOpt(item)"
      :value="item[fieldValue]">
      <span>{{ buildCustomOpt(item) }}</span>
    </el-option>
  </el-select>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { ref, toRef, watch, useAttrs, computed } from 'vue'

const props = defineProps<{
  items: any[]
  rules?: []
  modelValue: any
}>()

const selectedItem = ref<any>({})
const data = toRef(props, 'items')
const modelValue = toRef(props, 'modelValue')

type ObjectKeys = keyof (typeof data.value)[0]

const attrs = useAttrs()
const dataText = ref<any>(null)
const fieldValue = (attrs['fieldValue'] ?? 'value') as ObjectKeys
const fieldText = (attrs['fieldText'] ?? 'name') as ObjectKeys
const customText = (attrs['customText'] ?? false) as ObjectKeys

const emit = defineEmits(['update:modelValue', 'selected'])

watch(modelValue, (newVal) => {
  selectedItem.value = getItemFromValue(newVal)
  emit('selected', selectedItem.value)
})

watch(selectedItem, (newVal) => {
  dataText.value = newVal ? getValue(newVal, fieldText) : null
})

// Example: customText="code-name"
const buildCustomOpt = (item: any) => {
  var rs : string[] = [];
  var listField = _.split(customText.toString(), '-');
  listField.forEach((field) => {
    rs.push(`${item[field]}`)
  })
  return rs.join('-');
}

const onSelected = (selected: any) => {
  selectedItem.value = getItemFromValue(selected)
  emit('update:modelValue', selected)
  emit('selected', selectedItem.value)
}

const getItemFromValue = (value: any) => {
  if (value) return data.value.find((x: any) => x[fieldValue] == value)
  return {}
}

const getValue = (obj: any, key: any) => {
  return obj ? obj[key] : null
}
</script>

<style lang="scss">
@import '@/assets/styles/commons/vc-select.scss';
</style>
