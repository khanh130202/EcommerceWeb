export enum ResponseCode {
  Success = 0,
  SystemError = 1,
  NotFound = 2,
  Invalid = 3,
  UnAuthorized = 4
}

export enum UploadImage {
  Avatar = 'Avatar'
}

export enum DATA_TYPE {
  DATE = 'DATE',
  DATE_TIME = 'DATE_TIME',
  NUMBER = 'NUMBER'
}

export enum ACC_TYPE {
  SYS_ADMIN = 1,
  ADMIN = 2,
  USER = 3
}

export enum COOKIE_KEY {
  ACCESS_TOKEN = 'auth.access_token',
  REFRESH_TOKEN = 'auth.refresh_token',
  AUTH_INFO = 'auth.info'
}

export enum IMPORT_TYPE {
  WITHOUT_DATA = 1,
  WITH_DATA = 2
}

export enum MESSAGE {
  LOGOUT_CONFIRM_TITLE = 'Đăng xuất',
  LOGOUT_CONFIRM_MESSAGE = 'Kết thúc phiên đăng nhập. Vui lòng xác nhận .',

  DELETE_CONFIRM = 'Xóa thông tin hồ sơ cư dân. cái này tốt không. ',
  UPLOAD_CONFIRM = 'Bạn có chắc muốn cập nhật không? ',

  E_NO_FILE_UPLOAD = 'Hãy chọn file mẫu.',
  E_API_RESPONSE = 'Đã xảy ra lỗi. Vui lòng thử lại sau. '
}

export enum SCREEN_CODE {
  COMMON = 'Common',
  BL001 = 'BL001'
}

export enum POPUP_TYPE {
  VIEW = 'VIEW',
  CREATE = 'CREATE',
  EDIT = 'EDIT'
}

export enum ROLE_NAME {
  ROLE_ADMIN = 'ROLE_ADMIN',
  ROLE_HR = 'ROLE_HR',
  ROLE_LEAD = 'ROLE_LEAD',
  ROLE_MANAGER = 'ROLE_MANAGER',
  ROLE_USER = 'ROLE_USER'
}

export const ERROR_TEXT = 'error'
export const LIMITED_TIME = 3600000 //  1 * 60 * 60 * 1000
export const DEFAULT_SAVE = '0'
export const DEFAULT_SEND = '1'

export const colorsRating = ['#99A9BF', '#F7BA2A', '#FF9900']

export const ORDER_STATUS = {
  PROCESSING: 'Chờ xử lí',
  CONFIRMED: 'Đã xác nhận',
  SHIPPING: 'Đang vận chuyển',
  DELIVERED: 'Giao hàng thành công',
  CANCELLED: 'Hủy đơn'
}

export const ORDER_STATUS_ARRAY = Object.entries(ORDER_STATUS).map(([key, value]) => ({
  value: key,
  label: value
}))
