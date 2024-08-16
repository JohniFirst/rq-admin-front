type ExcelData = {
  headers: string[]
  data: unknown[][]
}

type BaseTableColumns = {
  title: string
  dataIndex: string
  key: string
  render?: (value, record, index) => React.ReactNode
}[]
