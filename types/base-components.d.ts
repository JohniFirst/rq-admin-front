type ExcelData = {
	headers: string[]
	data: unknown[][]
}

type SearchPagination = {
	current: number | undefined
	pageSize: number | undefined
}

type GetTableData = (params: unknown) => void

type BaseTableSearchProps = {
	// 每个搜索项占的span数 默认6
	span: number
	// 搜索项之间的间距 默认16
	gutter: number
}

type SearchFormItemConfig = {
	// 查询表单渲染（默认是input框）
	searchFormRender?: React.ReactNode
	// 查询表单类型
	type?: 'select' | 'dateRange' | 'timeRange'
	// TODO 完善类型 表单校验规则
	rules?: []
}

type BaseTableColumns = {
	title: string
	dataIndex?: string
	key?: string
	align?: 'left' | 'center' | 'right'
	render?: (value, record, index) => React.ReactNode
	// 查询表单配置项
	searchFormItemConfig?: SearchFormItemConfig
}[]
