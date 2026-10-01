import { downloadFile, DownloadFileType } from '@/lib/utils/download'
import { fileTypeFromBlob } from 'file-type'

const KB = 1024
export const MB = 1024 * KB

export const allowedFlowFileTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp']

export const maxAllowedFileSize = 5 * MB

export const download = (fileContent: string[] | ArrayBuffer[], fileName: string, fileType: DownloadFileType) => {
  downloadFile(fileContent, fileName, fileType)
}

export const isAllowedFileType = async (file: File, allowedTypes: string[]) => {
  const fileType = (await fileTypeFromBlob(file))?.mime
  return fileType && allowedTypes.includes(fileType)
}
