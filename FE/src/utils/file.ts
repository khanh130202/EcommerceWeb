import { useToastStore } from '@/stores/toast.store'
import { ERROR_TEXT } from '@/commons/const'
import dateTime from '@/utils/dateTime'

const fileService = {
  resolveAndDownloadBlob(byte: any, file_name: string, hasFormatDate: boolean = false) {
    file_name = decodeURI(file_name)
    if(!hasFormatDate){
      file_name = file_name.replace(
        '.xlsx',
        `_${dateTime.formatDateTimeGrenCode(new Date().toDateString())}.xlsx`
      )
    }
    else{
      file_name = file_name.replace(
        '.xlsx',
        `_${dateTime.formatDayMonthYearExport(new Date().toDateString())}.xlsx`
      )
    }
    const url = window.URL.createObjectURL(new Blob([byte]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', file_name)
    document.body.appendChild(link)
    link.click()
    window.URL.revokeObjectURL(url)
    link.remove()
  },
  downloadAsDataURL(url: string, file_name: string) {
    file_name = decodeURI(file_name)
    file_name = file_name.replace(
      '.pdf',
      `_${dateTime.formatDateTimeGrenCode(new Date().toDateString())}.pdf`
    )
    const link = document.createElement('a')
    link.setAttribute('download', file_name)
    link.href = url
    link.click()
  },
  async checkFileHaveChange(file: File): Promise<any> {
    return await file
      .slice(0, 1) // only the first byte
      .arrayBuffer() // try to read
      .then(() => {
        // Not do anything
      })
      .catch((err: any) => {
        // error while reading
        useToastStore().push({
          type: ERROR_TEXT,
          message: 'データのエクスポートに失敗しました。',
        })

        return Promise.resolve(err)
      })
  },
  // download(
  //   data: any,
  //   filename?: any,
  //   mime: any = 'application/octet-stream',
  //   bom: any = undefined
  // ) {
  //   const blobData = typeof bom !== 'undefined' ? [bom, data] : [data]
  //   const blob = new Blob(blobData, { type: data.type })
  //   const navigator: any = window.navigator
  //   if (typeof navigator.msSaveBlob !== 'undefined') {
  //     navigator.msSaveBlob(blob, filename)
  //   } else {
  //     const blobURL =
  //       window.URL && window.URL.createObjectURL
  //         ? window.URL.createObjectURL(blob)
  //         : window.webkitURL.createObjectURL(blob)
  //     const tempLink = document.createElement('a')
  //     tempLink.style.display = 'none'
  //     tempLink.href = blobURL
  //     if (filename) {
  //       tempLink.setAttribute('download', filename)
  //     }
  //     // if (typeof tempLink.download === 'undefined') {
  //     tempLink.setAttribute('target', '_blank')
  //     // }
  //     document.body.appendChild(tempLink)

  //     tempLink.click()

  //     setTimeout(function () {
  //       document.body.removeChild(tempLink)
  //       window.URL.revokeObjectURL(blobURL)
  //     }, 200)
  //   }
  // },
}

export default fileService
