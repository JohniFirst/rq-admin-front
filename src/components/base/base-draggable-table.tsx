import { exportToExcel } from '@/utils/export-to-excel'
import { DownloadOutlined, PrinterOutlined, ReloadOutlined, SettingOutlined } from '@ant-design/icons'
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button, Col, Form, Modal, Row, Space, Table, Tooltip } from 'antd'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'

// import { sortMenu } from '@/store/slice/menu-slice'
import type { DragEndEvent } from '@dnd-kit/core'
import type { FormProps, TablePaginationConfig, TableProps } from 'antd'

type BaseTableProps<T> = {
	tableProps: TableProps<T>
	searchProps?: BaseTableSearchProps
	// 获取表格数据的工具函数
	getTableData: GetTableData
	addForm?: {
		addFormApi: (params: unknown) => void
		AddForm: React.FC
	}
}

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
	'data-row-key': string
}

const BaseDraggableTable = <T extends object>({
	tableProps,
	addForm,
	searchProps = { gutter: 16, span: 6 },
	getTableData,
}: BaseTableProps<T>) => {
	const [form] = Form.useForm()
	const [isModalOpen, setIsModalOpen] = useState(false)
	// 查询参数
	const [searchParams, setSearchParams] = useState({})
	// 分页参数
	const [pagination, setPagination] = useState<SearchPagination>({
		pageSize: 10,
		current: 1,
	})
	const [dataSource, setDataSource] = useState<any[]>(() =>
		tableProps.dataSource ? [...(tableProps.dataSource as any[])] : [],
	)

	// 当查询参数或者分页参数发生变化时，触发这个函数
	useEffect(() => {
		refreshData()
	}, [searchParams, pagination])

	// 保持 dataSource 与 tableProps.dataSource 同步
	useEffect(() => {
		if (tableProps.dataSource) {
			setDataSource([...(tableProps.dataSource as any[])])
		}
	}, [tableProps.dataSource])

	/** 更新表格数据 */
	const refreshData = () => {
		getTableData({ ...searchParams, ...pagination })
	}

	const handleSubmit = async (values: { roleName: string }) => {
		await addForm?.addFormApi(values)

		refreshData()

		setIsModalOpen(false)
	}

	/**
	 * Handles exporting data to an Excel file.
	 *
	 * @return {void} No return value, exports data to a file instead.
	 */
	const handleExport = () => {
		// @ts-ignore
		const keys = tableProps.columns?.map((column) => column.dataIndex) || []
		const excelData: ExcelData = {
			headers: (tableProps.columns?.map((column) => column.title) as string[]) || [],
			data: ((tableProps.dataSource as any[]) ?? []).map((item) => {
				return keys.map((key) => (item as any)[key])
			}),
		}
		exportToExcel(excelData, `${format(Date.now(), 'yyyy-MM-dd')}.xlsx`)
	}

	const CustomRow = (props: RowProps) => {
		const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
			id: props['data-row-key'],
		})

		const style: React.CSSProperties = {
			...props.style,
			transform: CSS.Translate.toString(transform),
			transition,
			cursor: 'move',
			...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
		}

		return <tr {...props} ref={setNodeRef} style={style} {...attributes} {...listeners} />
	}

	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 1 } }))

	const onDragEnd = ({ active, over }: DragEndEvent) => {
		if (active.id !== over?.id) {
			setDataSource((prev) => {
				const activeIndex = prev.findIndex((i) => i.key === active.id)
				const overIndex = prev.findIndex((i) => i.key === over?.id)
				return arrayMove(prev, activeIndex, overIndex)
			})
		}
	}

	/** 提交查询表单 */
	const onFinish: FormProps['onFinish'] = (values) => {
		setSearchParams(values)
	}

	/** 重置表单 */
	const onReset = () => {
		form.resetFields()

		onFinish({})
	}

	const onFinishFailed: FormProps['onFinishFailed'] = (errorInfo) => {
		console.log('Failed:', errorInfo)
	}

	/** 分页参数发生变化 */
	const tableOperationChange = (pagination: TablePaginationConfig) => {
		const { current, pageSize } = pagination

		setPagination({ current, pageSize })
	}

	return (
		<>
			<Form
				className='custom-container mb-4 w-full'
				name='searchForm'
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				autoComplete='off'
			>
				<Row gutter={searchProps.gutter}>
					<Col span={6}>
						<Form.Item>
							<Space>
								<Button type='primary' htmlType='submit'>
									查询
								</Button>

								<Button htmlType='reset' onClick={onReset} onKeyUp={onReset}>
									重置
								</Button>
							</Space>
						</Form.Item>
					</Col>
				</Row>
			</Form>

			<section className='custom-container'>
				{/* 操作栏 */}
				<section className='mb-4 text-right'>
					<Space size={'middle'}>
						<Button type='primary' onClick={() => setIsModalOpen(true)}>
							新增
						</Button>

						<Tooltip title='导出Excel'>
							<DownloadOutlined className='cursor-pointer hover:text-red-500' onClick={handleExport} />
						</Tooltip>

						<Tooltip title='打印'>
							<PrinterOutlined className='cursor-pointer hover:text-red-500' onClick={() => window.print()} />
						</Tooltip>

						<Tooltip title='刷新'>
							<ReloadOutlined className='cursor-pointer hover:text-red-500' />
						</Tooltip>

						<Tooltip title='列设置'>
							<SettingOutlined className='cursor-pointer hover:text-red-500' />
						</Tooltip>
					</Space>
				</section>

				{/* 表格 */}
				<DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
					<SortableContext items={dataSource.map((i) => i.key)} strategy={verticalListSortingStrategy}>
						<Table
							className='print-table'
							rowKey='key'
							components={{
								body: { row: CustomRow },
							}}
							{...tableProps}
							dataSource={dataSource}
							pagination={{
								showSizeChanger: true,
								showQuickJumper: true,
								showTotal: (total) => `总计 ${total} 条`,
								...tableProps.pagination,
							}}
							onChange={tableOperationChange}
						/>
					</SortableContext>
				</DndContext>
			</section>

			<Modal
				title='新增'
				open={isModalOpen}
				okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
				onCancel={() => setIsModalOpen(false)}
				cancelText='取消'
				okText='提交'
				modalRender={(dom) => <Form onFinish={handleSubmit}>{dom}</Form>}
			>
				{addForm ? <addForm.AddForm /> : null}
			</Modal>
		</>
	)
}

export default BaseDraggableTable
