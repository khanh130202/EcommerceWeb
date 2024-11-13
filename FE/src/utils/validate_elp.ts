
export default {
  required: (rule: any, value: any, callback: any) => {
    if (value === '' || value === null || value === undefined) {
      callback(new Error(`${rule.label} không được để trống`))
    } else {
      callback()
    }
  },
  requiredRadioRule: (value: any, name: string) => {
    return value !== null || 'ValidateFieldRequied'
  },
  minLengthRule: (rule: any, value: string, callback: any) => {
    if (!value && value.length < rule.min) {
      callback(new Error(`${name} phải có ít nhất ${rule.min} kí tự.`))
    } else {
      callback()
    }
  },
  maxLengthRule: (rule: any, value: any, callback: any) => {
    if (!value && value.length > rule.max) {
      callback(new Error('ValidateMaxLength'))
    } else {
      callback()
    }
  },
  lengthRule: (value: any, name: string, length: number) => {
    return (
      value?.length === length || 'ValidateLength'
    )
  },
  emailRule: (rule: any, value: any, callback: any) => {
    if (!value) callback()

    if (
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        value
      )
    ) {
      callback()
    } else {
      callback(new Error(`${rule.label} không đúng định dạng`))
    }
  },
  dateRule: (rule: any, value: any, callback: any) => {
    if (!value) callback()
    // 2021-01-30
    if (
      /^([12]\d{3})[-](((0[13456789]|1[0-2])[-](0[1-9]|[12][0-9]|3[01]))|02[-](0[1-9]|[12][0-9]))$/.test(value)
    ) {
      callback()
    } else {
      callback(new Error('ValidateInvalid'))
    }
  },
  phoneNumberRule: (rule: any, value: any, callback: any) => {
    if (!value) callback()

    if (/^[+0-9][./0-9]{8,19}$/.test(value)) {
      callback()
    } else {
      callback(new Error(`${rule.label} không đúng định dạng`))
    }
  },
  checkPassword: (value: any, newVal: any, name: string) => {
    return value === newVal || 'OtherPassWord'
  },
  checkSamePassword: (value: any, newVal: any, name: string) => {
    return value === newVal || 'OtherPassWord'
  },
  alphabetAndSymbolRule: (rule: any, value: any, callback: any) => {
    if (value === '' || value === null) {
      callback()
    }
    if (!/^[a-zA-Z0-9`~!@#/$%/^/&*/)/(+=._-]+$/g.test(value)) {
      callback(
        new Error(
          '文字数（a ～ A、0 ～ 9）及び特殊文字のみを入力してください：~!@#$%^&*)(+=._-'
        )
      )
    } else {
      callback()
    }
  },
  amountValidator: (rule: any, value: any, callback: any) => {
    const numericValue = parseFloat(value)
    const regex = /^\d{0,15}$/
    if (!isNaN(numericValue) && regex.test(value)) {
      callback()
    } else {
      callback(new Error('ValidateAmountInvalid'))
    }
  },
  amountNegativeValidator: (rule: any, value: any, callback: any) => {
    const numericValue = parseFloat(value)
    const regex = /^-?\d{0,15}$/
    if (!isNaN(numericValue) && regex.test(value)) {
      callback()
    } else {
      callback(new Error('金額は 15 桁以内で入力してください'))
    }
  },
  inputSpaceValidator: (rule: any, value: any, callback: any) => {
    const hasNonWhitespaceCharacter: boolean = /\S/.test(value)

    if (!hasNonWhitespaceCharacter) {
      callback(new Error('値にはスペースを含めることはできません'))
    } else {
      callback()
    }
  },
  numberValidator: (rule: any, value: any, callback: any) => {
    const regex = /^\d*$/
    if (regex.test(value)) {
      callback()
    } else {
      callback(new Error('数字のみを入力してください'))
    }
  },
  sortOrderValidator: (rule: any, value: any, callback: any) => {
    const numericValue = parseFloat(value)
    const regex = /^-?\d{0,10}$/
    if (!isNaN(numericValue) && regex.test(value)) {
      callback()
    } else {
      callback(new Error('金額は 10 桁以内で入力してください'))
    }
  },
  checkEndDateRule: (rule: any, value: any, callback: any) => {
    if (!rule.end_date) {
      callback();
    }
    if (new Date(value) > new Date(rule.end_date)) {
      callback(new Error(`${rule.label || rule.field} phải nhỏ hơn ${rule.end_date_label ?? ""} ngày kết thúc`));
    } else {
      callback();
    }
  },
  checkStartDateRule: (rule: any, value: any, callback: any) => {
    if (!rule.start_date) {
      callback();
    }
    if (new Date(value) < new Date(rule.start_date)) {
      callback(new Error(`${rule.label || rule.field} phải lớn hơn ${rule.start_date_label ?? ""} ngày bắt đầu`));
    } else {
      callback();
    }
  },
}
