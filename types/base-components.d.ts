type ExcelData = {
  headers: string[]
  data: unknown[][]
}

type BaseTableColumns = {
  title: string
  dataIndex?: string
  key?: string
  align?: 'left' | 'center' | 'right'
  render?: (value, record, index) => React.ReactNode
}[]
