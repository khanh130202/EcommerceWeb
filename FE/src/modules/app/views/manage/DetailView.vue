<template>
  <vc-modal ref="modal" :title="modalTitle" @close="close">
    <template #content>
      <el-descriptions style="padding: 12px 16px" :column="1" border v-if="!flagOrderDetail">
        <el-descriptions-item>
          <template #label>
            <div class="cell-item" style="width: 150px;">
              Tên người nhận
            </div>
          </template>
          {{ order.FullName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Số điện thoại
            </div>
          </template>
          {{ order.PhoneNumber }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Địa chỉ
            </div>
          </template>
          {{ order.Address }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Ngày đặt hàng
            </div>
          </template>
          {{ dateTime.formatDateTimeNew(order.CreatedAt) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Tổng tiền
            </div>
          </template>
          {{ number.formatCurrency(order.TotalAmount) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Trạng thái
            </div>
          </template>
          <el-popconfirm v-if="flgManage" confirm-button-text="Có" width="auto" cancel-button-text="Không"
            icon="InfoFilled" icon-color="#626AEF" title="Bạn muốn thay đổi trạng thái đơn hàng?"
            @confirm="changeStatus" @cancel="handleCancelChangeStatus">
            <template #reference>
              <el-radio-group v-model="selectedStatus">
                <el-radio v-for="(status, index) in ORDER_STATUS_ARRAY" :key="index" :value="status.label">
                  {{ status.label }}
                </el-radio>
              </el-radio-group>
            </template>
          </el-popconfirm>
          <span v-else>{{ order.Status }}</span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Ghi chú
            </div>
          </template>
          {{ order.Note }}
        </el-descriptions-item>
      </el-descriptions>
      <el-table v-else :data="dataGrid">
        <el-table-column label="Tên sản phẩm" prop="ProductName" />
        <el-table-column label="Số lượng" prop="Quantity" />
        <el-table-column label="Giá tiền" prop="Price" />
        <el-table-column label="Action">
          <template #default="scope">
            <el-button type="warning" size="small" class="btn-acttion" @click="onView(scope.row)"
              :icon="'View'"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </vc-modal>
</template>

<script setup lang="ts">
/**
 * Dependencies injection library
 */
import { ref, reactive } from "vue";
import orderService from '@app/services/order.service';
import dateTime from "@/utils/dateTime";
import number from "@/utils/number";
import { useRouter } from 'vue-router'
import { ORDER_STATUS_ARRAY, ORDER_STATUS } from "@/commons/const";

/**
 * Variable define
 */
const router = useRouter()
const modal = ref<any>(null);
const modalTitle = ref<any>(null);
const dataGrid = ref<any>([]);
const flagOrderDetail = ref<any>(false);
const selectedStatus = ref<any>(null);

const order = reactive({
  OrderID: '',
  Status: '',
  FullName: '',
  PhoneNumber: '',
  Address: '',
  CreatedAt: '',
  TotalAmount: '',
  Note: '',
  IsDeleted: '',
});

let callback = (value: any) => { return value };
const flgManage = ref<any>(false)
/**
 * Life circle vue js
 */

/**
 * Function
 */

const open = async (title: any, item: any, flagDetail: boolean, flagManage: boolean, _callback: any) => {
  flagOrderDetail.value = flagDetail;
  flgManage.value = flagManage;
  modalTitle.value = title;
  if (flagDetail) {
    const response = (await orderService.order_detail(item)).data?.orderItems as any

    dataGrid.value = response.map((item: any) => {
      return {
        ProductID: item.ProductID,
        ProductName: item.ProductName,
        Price: number.formatCurrency(item.Price),
        Quantity: number.formatNumberWithDots(item.Quantity),
      };
    });
  }
  else {
    let orderInfo = {} as any;

    if (item)
      orderInfo = (await orderService.detail(item)).data?.order
    Object.assign(order, orderInfo)
    selectedStatus.value = order.Status
    callback = _callback;
  }
  modal.value.open();
};

// onView
const onView = (item: any) => {
  router.push({
    name: 'Detail',
    params: {
      id: item.ProductID
    }
  })
};

const close = () => {
  modal.value.close()
};

// changeStatus
const changeStatus = async () => {
  order.Status = selectedStatus.value
  await orderService.update(order)
  callback(true);
  close();
};

// handleCancelChangeStatus
const handleCancelChangeStatus = async () => {
  selectedStatus.value = order.Status
};
defineExpose({
  open,
  close,
});

</script>
<style>
.el-form-item {
  display: block;
}
</style>