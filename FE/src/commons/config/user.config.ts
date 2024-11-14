export const FUNC_NAME = 'users'

// ========================== ROUTER =============================
export const ROUTER_USER = [
  {
    path: '/manage-user',
    name: 'MngUser',
    component: () => import('@app/views/user/ListView.vue'),
    meta: { requiresAuth: true, requiresMng: true }
  },
]

// ========================== PATH API =============================
export const API = {
  LIST: `/${FUNC_NAME}`,
  LIST_ROLE: `/roles`,
  CREATE: `/${FUNC_NAME}`,
  DETAIL: (id: string) => `${FUNC_NAME}/${id}`,
  UPDATE: (id: string) => `${FUNC_NAME}/${id}`,
  DELETE: (id: string | string[]) => `${FUNC_NAME}/${id}`,
  RESET_PASSWORD: (id: string) => `${FUNC_NAME}/${id}/reset_password`,
}

// ========================== CONFIG TABLE ==========================
export const tableConfig = {
  checkbox: false,
  action: true,
  showPaging: true,
  dbClick: false,
  index: true,
};

export const colConfig = [
  {
    key: "FullName",
    title: 'Tên hiển thị',
  },
  {
    key: "Email",
    title: 'Email',
  },
  {
    key: "PhoneNumber",
    title: 'Số điện thoại',
  },
  {
    key: "CreatedAt",
    title: 'Ngày tạo',
  },
];

export default { tableConfig, colConfig };
