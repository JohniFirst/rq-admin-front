import { exportToExcel } from '@/utils/export-to-excel'
import { DownloadOutlined, PrinterOutlined, ReloadOutlined, SettingOutlined } from '@ant-design/icons'
import type { FormProps, TablePaginationConfig, TableProps } from 'antd'
import { Button, Col, Form, Input, Modal, Row, Space, Table, Tooltip } from 'antd'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'

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

const BaseTable = <T extends object>({
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

	// 当查询参数或者分页参数发生变化时，触发这个函数
	useEffect(() => {
		refreshData()
	}, [searchParams, pagination])

	/** 更新表格数据 */
	const refreshData = () => {
		getTableData({ ...searchParams, ...pagination })
	}

	/** 导出数据到Excel */
	const handleExport = () => {
		if (!tableProps.columns || !tableProps.dataSource) {
			return
		}
		// @ts-ignore
		const keys = tableProps.columns.map((column) => column.dataIndex)
		const excelData: ExcelData = {
			headers: tableProps.columns.map((column) => column.title) as string[],
			data: tableProps.dataSource.map((item) => {
				return keys.map((key: keyof T) => item[key])
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
		const { current = 1, pageSize = 10 } = pagination
		setPagination({ current, pageSize })
	}

	return (
		<>
			<Form
				className='custom-container mb-4 w-full'
				name='basic'
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				autoComplete='off'
			>
				<Row gutter={searchProps.gutter}>
					<Col span={6}>
						<Form.Item label='角色名' name='roleName'>
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
							<PrinterOutlined
								className='cursor-pointer hover:text-red-500'
								onClick={() => window.print()}
								onKeyUp={() => window.print()}
							/>
						</Tooltip>

						<Tooltip title='刷新'>
							<ReloadOutlined
								className='cursor-pointer hover:text-red-500'
								onClick={refreshData}
								onKeyUp={refreshData}
							/>
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
				onCancel={() => setIsModalOpen(false)}
				cancelText='取消'
				okText='提交'
				footer={null}
			>
				{addForm ? <addForm.AddForm /> : null}
			</Modal>
		</>
	)
}

export default BaseTable
