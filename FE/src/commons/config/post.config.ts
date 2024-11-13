export const FUNC_NAME = 'posts'
// ========================== ROUTER =============================
export const ROUTER_POST = [
  {
    path: '/post-sale',
    name: 'PostSale',
    component: () => import('@app/views/post/ListProductView.vue')
  },
  {
    path: '/post-charity',
    name: 'PostCharity',
    component: () => import('@app/views/post/ListProductCharityView.vue')
  },
  {
    path: '/post-intro',
    name: 'PostIntroductions',
    component: () => import('@app/views/post/ListIntroductionView.vue')
  },
  {
    path: '/detail-post/:id',
    name: 'DetailPost',
    component: () => import('@app/views/detail/PostDetailView.vue')
  },
]

// ========================== PATH API =============================
export const API = {
  POST: `/${FUNC_NAME}`,
  CREATE: `/${FUNC_NAME}`,
  DETAIL: (id: string) => `${FUNC_NAME}/${id}`,
  UPDATE: (id: string) => `${FUNC_NAME}/${id}`,
  DELETE: (id: string) => `${FUNC_NAME}/${id}`,
  LIKE: (id: string) => `postlikes/${id}`,
  DISLIKE: (id: string) => `postlikes/${id}`,
  CREATE_COMMENT: `comments`,
  LIST_COMMENT: `comments`,
  CHECK_LIKE: (id: string) => `postlikes/check-post-like/${id}`,
}

// ========================== CONFIG TABLE ==========================
export const tableConfig = {
  checkbox: false,
  action: true,
  index: true,
  showPaging: true,
  dbClick: false
}

export const colConfig = [
  {
    key: 'title',
    title: "Tiêu đề"
  },
  {
    key: 'created_at',
    title: "Ngày tạo"
  },
  {
    key: 'created_name',
    title: "Người tạo"
  },
]

export default { tableConfig, colConfig }