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
          {{ order.recipient_name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Số điện thoại
            </div>
          </template>
          {{ order.phone }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Địa chỉ
            </div>
          </template>
          {{ order.address }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Ngày đặt hàng
            </div>
          </template>
          {{ dateTime.formatDateTimeNew(order.created_at) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Tổng tiền
            </div>
          </template>
          {{ number.formatCurrency(order.total_amount) }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Trạng thái
            </div>
          </template>
          <el-popconfirm confirm-button-text="Có" width="auto" cancel-button-text="Không" icon="InfoFilled"
            icon-color="#626AEF" title="Bạn muốn thay đổi trạng thái đơn hàng?" @confirm="changeStatus"
            @cancel="handleCancelChangeStatus">
            <template #reference>
              <el-radio-group v-model="selectedStatus">
                <el-radio v-for="(status, index) in orderStatuses" :key="index" :value="status.master_code_id">
                  {{ status.value }}
                </el-radio>
              </el-radio-group>
            </template>
          </el-popconfirm>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Phương thức thanh toán
            </div>
          </template>
          <el-popconfirm confirm-button-text="Có" width="auto" cancel-button-text="Không" icon="InfoFilled"
            icon-color="#626AEF" title="Bạn muốn thay đổi phương thức thanh toán?" @confirm="changePaymentMethod"
            @cancel="handleCancelChangePaymentMethod">
            <template #reference>
              <el-radio-group v-model="selectedPaymentMethod">
                <el-radio v-for="(status, index) in paymentMethods" :key="index" :value="status.master_code_id">
                  {{ status.value }}
                </el-radio>
              </el-radio-group>
            </template>
          </el-popconfirm>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              Ghi chú
            </div>
          </template>
          {{ order.note }}
        </el-descriptions-item>
      </el-descriptions>
      <el-table v-else :data="dataGrid">
        <el-table-column label="Tên sản phẩm" prop="product_name" />
        <el-table-column label="Số lượng" prop="quantity" />
        <el-table-column label="Giá tiền" prop="price" />
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
import { storeToRefs } from 'pinia'
import { ref, reactive } from "vue";
import orderService from '@app/services/order.service';
import dateTime from "@/utils/dateTime";
import number from "@/utils/number";
import { useRouter } from 'vue-router'
import { MASTER_CODE } from "@/commons/const";
import { useMasterCodeStore } from '@app/stores/masterCode.store'

/**
 * Variable define
 */
const storeMasterCode = useMasterCodeStore();
const { dataGrid: dataGridMasterCode } = storeToRefs(storeMasterCode)
const router = useRouter()
const modal = ref<any>(null);
const modalTitle = ref<any>(null);
const dataGrid = ref<any>([]);
const flagOrderDetail = ref<any>(false);
const selectedStatus = ref<any>(null);
const selectedPaymentMethod = ref<any>(null);
const orderStatuses = ref<any>([]);
const paymentMethods = ref<any>([]);

const order = reactive({
  order_id: '',
  order_status_id: '',
  payment_method_id: '',
  recipient_name: '',
  phone: '',
  address: '',
  created_at: '',
  total_amount: '',
  note: '',
  is_deleted: '',
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
        product_id: item.product_id,
        product_name: item.product_name,
        price: number.formatCurrency(item.price),
        quantity: number.formatNumberWithDots(item.quantity),
      };
    });
  }
  else {
    let orderInfo = {} as any;
    await storeMasterCode.getList(MASTER_CODE.ORDER_STATUS)
    orderStatuses.value = [...dataGridMasterCode.value]
    await storeMasterCode.getList(MASTER_CODE.PAYMENT_METHOD)
    paymentMethods.value = [...dataGridMasterCode.value]

    if (item)
      orderInfo = (await orderService.detail(item)).data?.order
    Object.assign(order, orderInfo)
    callback = _callback;
    selectedStatus.value = order.order_status_id
    selectedPaymentMethod.value = order.payment_method_id
  }
  modal.value.open();
};

// onView
const onView = (item: any) => {
  router.push({
    name: 'Detail',
    params: {
      id: item.product_id
    }
  })
};

const close = () => {
  modal.value.close()
};

// changeStatus
const changeStatus = async () => {
  order.order_status_id = selectedStatus.value
  await orderService.update(order)
  callback(true);
  close();
};

// handleCancelChangeStatus
const handleCancelChangeStatus = async () => {
  selectedStatus.value = order.order_status_id
};

// changePaymentMethod
const changePaymentMethod = async () => {
  order.payment_method_id = selectedPaymentMethod.value
  await orderService.update(order)
  callback(true);
  close();
};

// handleCancelChangeStatus
const handleCancelChangePaymentMethod = async () => {
  selectedPaymentMethod.value = order.payment_method_id
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