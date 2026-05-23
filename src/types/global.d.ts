// global.d.ts - 全局类型定义

// 搜索分页参数
export interface SearchPagination {
  pageSize?: number
  current?: number
  [key: string]: unknown
}

// Excel 导出数据类型
export interface ExcelData {
  headers: string[]
  data: unknown[][]
}

// 表格搜索属性
export interface BaseTableSearchProps {
  gutter?: number
  span?: number
}

// 获取表格数据的函数类型
export type GetTableData = (params: Record<string, unknown>) => void | Promise<void>

// 可拖拽选择模式
export type DraggableSelectMode = 'add' | 'remove' | 'reverse'

// 可拖拽选择范围
export interface DraggableSelectStartRange {
  start: number
  end: number
}

// 云相册项
export interface CloudAlbumItem {
  id?: string | number
  url?: string
  name?: string
  size?: number
  createTime?: string
  description?: string
  album?: string | number
  src?: string
  created_at?: string
  updated_at?: string
}

// 上传云相册属性
export interface UploadCloudAlbumProps {
  value?: CloudAlbumItem[]
  onChange?: (value: CloudAlbumItem[]) => void
  maxCount?: number
}
