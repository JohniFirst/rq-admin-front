import { addMenu, editMenu, getMenuList } from '@/api/system-api'
import BaseDraggableTable from '@/components/base/base-draggable-table'
import PopoverMenu from '@/components/base/popover-menu'
import LucideIcon, { type LucideIconType } from '@/components/lucide-icon'
import { Form, Modal, type TableProps } from 'antd'
import { useEffect, useState } from 'react'
import MenuAddForm from './components/menu-add-form'

const Menu = () => {
	const [modal, contextHolder] = Modal.useModal()
	const [dataSource, setDataSource] = useState<MenuApiResponse[]>([])

	useEffect(() => {
		getMenuList().then((res) => {
			if (Array.isArray(res)) {
				setDataSource(res)
			} else if (res?.data && Array.isArray(res.data)) {
				setDataSource(res.data)
			}
		})
	}, [])

	const columns: TableProps<MenuApiResponse>['columns'] = [
		{
			title: 'id',
			dataIndex: 'id',
		},
		{
			title: '菜单名',
			dataIndex: 'title',
		},
		{
			title: '路由',
			dataIndex: 'url',
		},
		{
			title: '图标',
			dataIndex: 'icon',
			render: (_, { icon }) => {
				return <LucideIcon name={icon as LucideIconType} />
			},
		},
		{
			title: '角色',
			dataIndex: 'roles',
			render(value: RoleListRes[] = []) {
				return Array.isArray(value) ? value.map((item: RoleListRes) => item.roleName).join(', ') : ''
			},
		},
		{
			title: '排序',
			dataIndex: 'menuOrder',
		},
		{
			title: '操作',
			key: 'operation',
			align: 'right',
			render: (_: any, record: MenuApiResponse) => {
				return <PopoverMenu values={record} modal={modal} onEdit={handleEdit} onRefresh={refreshMenuList} />
			},
		},
	]

	// 在 Menu 组件内添加编辑逻辑
	const [editRecord, setEditRecord] = useState<MenuApiResponse | null>(null)
	const [isEditModalOpen, setIsEditModalOpen] = useState(false)
	const [editForm] = Form.useForm()

	const handleEdit = (record: MenuApiResponse) => {
		setEditRecord(record)
		editForm.setFieldsValue(record)
		setIsEditModalOpen(true)
	}

	const handleEditSubmit = async () => {
		const values = await editForm.validateFields()
		await editMenu({ ...(editRecord || {}), ...values })
		setIsEditModalOpen(false)
		setEditRecord(null)
		await refreshMenuList()
	}

	// 在 Menu 组件内添加刷新方法
	const refreshMenuList = async () => {
		const res = await getMenuList()
		if (Array.isArray(res)) {
			setDataSource(res)
			return res
		}
		if (res?.data && Array.isArray(res.data)) {
			setDataSource(res.data)
			return res.data
		}
		return []
	}

	return (
		<>
			{contextHolder}
			<BaseDraggableTable
				tableProps={{
					columns,
					dataSource,
				}}
				getTableData={refreshMenuList}
				addForm={{
					addFormApi: async (params: any) => {
						await addMenu(params)
					},
					AddForm: MenuAddForm,
				}}
			/>
			<Modal
				title='编辑菜单'
				open={isEditModalOpen}
				onCancel={() => setIsEditModalOpen(false)}
				onOk={handleEditSubmit}
				okText='保存'
				cancelText='取消'
			>
				<MenuAddForm form={editForm} initialValues={editRecord} />
			</Modal>
		</>
	)
}

export default Menu
