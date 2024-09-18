import { exportToExcel } from '@/utils/export-to-excel'
import {
	DownloadOutlined,
	PrinterOutlined,
	ReloadOutlined,
	SettingOutlined,
} from '@ant-design/icons'
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
import type { FormProps, TablePaginationConfig, TableProps } from 'antd'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'

type BaseTableProps = {
	tableProps: TableProps
	searchProps?: BaseTableSearchProps
	// 获取表格数据的工具函数
	getTableData: GetTableData
	addForm?: {
		addFormApi: (params: unknown) => void
		AddForm: React.FC
	}
}

const BaseTable: React.FC<BaseTableProps> = ({
	tableProps,
	addForm,
	searchProps = { gutter: 16, span: 6 },
	getTableData,
}) => {
	const [form] = Form.useForm()
	const [isModalOpen, setIsModalOpen] = useState(false)
	// 查询参数
	const [searchParams, setSearchParams] = useState({})
	// 分页参数
	const [pagination, setPagination] = useState<SearchPagination>({
		pageSize: 10,
		current: 1,
	})

	// 当查询参数或者分页参数发生变化时，触发这个函数
	useEffect(() => {
		getTableData({ ...searchParams, ...pagination })
	}, [searchParams, pagination])

	const handleSubmit = async (values: { roleName: string }) => {
		await addForm?.addFormApi(values)

		setIsModalOpen(false)
	}

	/**
	 * Handles exporting data to an Excel file.
	 *
	 * @return {void} No return value, exports data to a file instead.
	 */
	const handleExport = () => {
		// @ts-ignore
		const keys = tableProps.columns!.map((column) => column.dataIndex)
		const excelData: ExcelData = {
			headers: tableProps.columns!.map((column) => column.title) as string[],
			data: tableProps.dataSource!.map((item) => {
				return keys.map((key) => item[key])
			}),
		}
		exportToExcel(excelData, `${format(Date.now(), 'yyyy-MM-dd')}.xlsx`)
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

	/** 查询表单提交失败 */
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
				className='container mb-4 w-full'
				name='basic'
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				autoComplete='off'
			>
				<Row gutter={searchProps.gutter}>
					<Col span={6}>
						<Form.Item
							label='角色名'
							name='roleName'
							rules={[{ required: true, message: '请输入角色名' }]}
						>
							<Input />
						</Form.Item>
					</Col>

					<Col span={6}>
						<Form.Item>
							<Space>
								<Button type='primary' htmlType='submit'>
									查询
								</Button>
								<Button htmlType='reset' onClick={onReset}>
									重置
								</Button>
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
				<Table
					{...tableProps}
					className='print-table'
					pagination={{
						showSizeChanger: true,
						showQuickJumper: true,
						showTotal: (total) => `总计 ${total} 条`,
						...tableProps.pagination,
					}}
					onChange={tableOperationChange}
				/>
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

export default BaseTable
