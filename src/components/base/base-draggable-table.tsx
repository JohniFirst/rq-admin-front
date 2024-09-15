import { exportToExcel } from '@/utils/export-to-excel'
import {
	DownloadOutlined,
	PrinterOutlined,
	ReloadOutlined,
	SettingOutlined,
} from '@ant-design/icons'
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
	SortableContext,
	arrayMove,
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
	Button,
	Col,
	Form,
	Input,
	Modal,
	Row,
	Space,
	Table,
	Tooltip,
} from 'antd'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'

import { sortMenu } from '@/store/slice/menu-slice'
import type { DragEndEvent } from '@dnd-kit/core'
import type { FormProps, TableProps } from 'antd'

type BaseTableProps = {
	tableProps: TableProps & {
		columns: BaseTableColumns
		getList: (params?: unknown) => void
	}
	searchProps?: BaseTableSearchProps
	addForm?: {
		addFormApi: unknown
		AddForm: React.FC
	}
}

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
	'data-row-key': string
}

const BaseDraggableTable: React.FC<BaseTableProps> = ({
	tableProps,
	addForm,
	searchProps = { gutter: 16, span: 6 },
}) => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [dataSource, setDataSource] = useState([])

	const searchFormItems = tableProps.columns?.filter(
		// @ts-ignore
		(item) => item.searchFormItemConfig,
	)

	useEffect(() => {
		getList()
	}, [])

	const getList = async (params?: unknown) => {
		const res = await tableProps.getList(params)

		sortMenu(res)

		setDataSource(res)
	}

	const handleSubmit = async (values: { roleName: string }) => {
		await addForm?.addFormApi(values)

		getList()

		setIsModalOpen(false)
	}

	/**
	 * Handles exporting data to an Excel file.
	 *
	 * @return {void} No return value, exports data to a file instead.
	 */
	const handleExport = () => {
		// @ts-ignore
		const keys = tableProps.columns?.map((column) => column.dataIndex)
		const excelData: ExcelData = {
			headers: tableProps.columns?.map((column) => column.title) as string[],
			data: tableProps.dataSource?.map((item) => {
				return keys.map((key) => item[key])
			}),
		}
		exportToExcel(excelData, `${format(Date.now(), 'yyyy-MM-dd')}.xlsx`)
	}

	const CustomRow = (props: RowProps) => {
		const {
			attributes,
			listeners,
			setNodeRef,
			transform,
			transition,
			isDragging,
		} = useSortable({
			id: props['data-row-key'],
		})

		const style: React.CSSProperties = {
			...props.style,
			transform: CSS.Translate.toString(transform),
			transition,
			cursor: 'move',
			...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
		}

		return (
			<tr
				{...props}
				ref={setNodeRef}
				style={style}
				{...attributes}
				{...listeners}
			/>
		)
	}

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 1 } }),
	)

	const onDragEnd = ({ active, over }: DragEndEvent) => {
		if (active.id !== over?.id) {
			setDataSource((prev) => {
				const activeIndex = prev.findIndex((i) => i.key === active.id)
				const overIndex = prev.findIndex((i) => i.key === over?.id)
				return arrayMove(prev, activeIndex, overIndex)
			})
		}
	}

	const onFinish: FormProps['onFinish'] = (values) => {
		const params: typeof values = {}

		for (const item of Object.keys(values)) {
			if (values[item] !== undefined) {
				params[item] = values[item]
			}
		}

		getList(params)
	}

	const onFinishFailed: FormProps['onFinishFailed'] = (errorInfo) => {
		console.log('Failed:', errorInfo)
	}

	return (
		<>
			<Form
				className='container mb-4 w-full'
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

								<Button htmlType='submit'>重置</Button>
							</Space>
						</Form.Item>
					</Col>
				</Row>
			</Form>

			<section className='container'>
				{/* 操作栏 */}
				<section className='mb-4 text-right'>
					<Space size={'middle'}>
						<Button type='primary' onClick={() => setIsModalOpen(true)}>
							新增
						</Button>

						<Tooltip title='导出Excel'>
							<DownloadOutlined
								className='cursor-pointer hover:text-red-500'
								onClick={handleExport}
							/>
						</Tooltip>

						<Tooltip title='打印'>
							<PrinterOutlined
								className='cursor-pointer hover:text-red-500'
								onClick={() => window.print()}
							/>
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
				<DndContext
					sensors={sensors}
					modifiers={[restrictToVerticalAxis]}
					onDragEnd={onDragEnd}
				>
					<SortableContext
						items={dataSource.map((i) => i.key)}
						strategy={verticalListSortingStrategy}
					>
						<Table
							className='print-table'
							rowKey='key'
							components={{
								body: { row: CustomRow },
							}}
							dataSource={dataSource}
							{...tableProps}
							pagination={{
								showSizeChanger: true,
								showQuickJumper: true,
								showTotal: (total) => `总计 ${total} 条`,
								...tableProps.pagination,
							}}
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
