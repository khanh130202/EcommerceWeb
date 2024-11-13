<template>
  <el-radio-group>
    <!-- <slot></slot> -->
    <vc-radio v-for="item, index in items" :label="item[fieldValue]" :key="index">
      {{ item[fieldText] }}
    </vc-radio>
  </el-radio-group>
</template>

<script lang="ts" setup>
import { useAttrs } from 'vue'

const props = defineProps<{
  items: [];
}>();

type ObjectKeys = keyof (typeof props.items)

const attrs = useAttrs()
const fieldValue = (attrs['fieldValue'] ?? 'value') as ObjectKeys
const fieldText = (attrs['fieldText'] ?? 'name') as ObjectKeys

</script>
