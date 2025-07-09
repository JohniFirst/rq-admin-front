import { http } from '@/utils/http'

/** 上传文件 */
export const uploadFile = (file: File) => {
  return http.post('/file/upload', { file })
}

/** 批量上传文件 */
export const multiUploadFile = (files: File[]) => {
  return http.post('/file/multiple', { files })
}

/**
 * 文件下载
 * @param id 文件列表的id
 * @returns 文件对象
 */
export const fileDownload = (id: string) => {
  return http.get('/file/download/' + id)
}

/**
 * 物理删除文件
 * @param id 文件列表的id
 */
export const fileDelete = (id: string) => {
  return http.delete('/file/' + id)
}

export type FileListParams = {
  pageNumber?: number
  pageSize?: number
}

/**
 * 获取文件列表
 * @param params 分页参数，不传后端默认 0 10
 * @returns 文件列表
 */
export const getFileList = (params: FileListParams) => {
  return http.get('/file/list', { params })
}

/**
 * 获取文件信息
 * @param id 文件id
 */
export const getFileInfo = (id: string) => {
  return http.get('/file/info/' + id)
}

/**
 * 更新文件状态
 * @param id 文件id
 */
export const putFileStatus = (id: string) => {
  return http.put('/file/status/' + id)
}

/**
 * 更新文件描述
 * @param id 文件id
 */
export const putFileDescription = (id: string, description: string) => {
  return http.put('/file/description/' + id, { description })
}

/**
 * 删除文件信息
 * @param id 文件id
 */
export const deleteFileInfo = (id: string) => {
  return http.delete('/file/info/' + id)
}

/**
 * 批量删除文件
 * @param ids 文件id
 */
export const batchDeleteFile = (ids: string[]) => {
  return http.delete('/file/batch', { data: ids })
}
