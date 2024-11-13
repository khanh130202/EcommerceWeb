<template>
    <div>
        <el-card>
            <template #header>
                <div class="card-header">
                    <h2>QUẢN LÝ NGƯỜI DÙNG</h2>
                </div>
            </template>
            <el-table>
                <template #empty>
                    Không có người dùng nào
                </template>
                <el-table-column label="Product" />
                <el-table-column label="Name" />
                <el-table-column label="Price" />
                <el-table-column label="Qty" />
                <el-table-column label="Total Amount" />
                <el-table-column label="Action">
                    <template #default="scope">
                        <vc-button :icon="'View'" type="danger" @click="onView(scope.row)" />
                        <vc-button :icon="'Edit'" type="danger" @click="onEdit(scope.row)" />
                        <vc-button :icon="'Delete'" type="danger" @click="onDelete(scope.row)" />
                    </template>
                </el-table-column>
            </el-table>
            <div style="margin: 20px 0; float: right;">
                <vc-pagination :pageConfig="pageConfig" />
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const pageConfig = ref({
    page: 1,
    size: 10,
    total: 100
})
const onView = (item: any) => {

}
const onEdit = (item: any) => {

}
const onDelete = (item: any) => {

}
</script>

<style scoped></style>