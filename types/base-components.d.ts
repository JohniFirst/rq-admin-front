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

type DraggableSelectMode = 'add' | 'remove' | 'reverse'

type DraggableSelectStartRange = 'all' | 'inside' | 'outside'

// SquareInputBox 组件类型定义
type SquareInputBoxProps = {
	/** 验证码长度，默认为6 */
	length?: number
	/** 输入框大小，默认为48px */
	size?: number
	/** 输入框间距，默认为8px */
	gap?: number
	/** 圆角大小，默认为8px */
	borderRadius?: number
	/** 当前值 */
	value?: string
	/** 值变化回调 */
	onChange?: (value: string) => void
	/** 输入完成回调 */
	onComplete?: (value: string) => void
	/** 是否禁用 */
	disabled?: boolean
	/** 是否自动聚焦 */
	autoFocus?: boolean
	/** 输入框类型，默认为text */
	type?: 'text' | 'number' | 'password'
	/** 占位符 */
	placeholder?: string
	/** 自定义样式 */
	className?: string
	/** 错误状态 */
	error?: boolean
	/** 成功状态 */
	success?: boolean
}
