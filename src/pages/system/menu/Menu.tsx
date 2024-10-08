// import { addMenu, getMenuList } from '@/api/system-api'
// import BaseDraggableTable from '@/components/base/base-table'
// import PopoverMenu from '@/components/base/popover-menu'
// import LucideIcon, { type LucideIconType } from '@/components/lucide-icon'
// import { Modal, TableProps } from 'antd'
// import MenuAddForm from './components/menu-add-form'

// const Menu = () => {
// 	const [modal, contextHolder] = Modal.useModal()

// 	const columns: TableProps<MenuApiResponse>['columns'] = [
// 		{
// 			title: 'id',
// 			dataIndex: 'id',
// 		},
// 		{
// 			title: '菜单名',
// 			dataIndex: 'title',
// 		},
// 		{
// 			title: '路由',
// 			dataIndex: 'url',
// 		},
// 		{
// 			title: '图标',
// 			dataIndex: 'icon',
// 			render: (_, { icon }) => {
// 				return <LucideIcon name={icon as LucideIconType} />
// 			},
// 		},
// 		{
// 			title: '角色',
// 			dataIndex: 'roles',
// 			render(value) {
// 				return value.map((item: RoleListRes) => item.roleName).join(', ')
// 			},
// 		},
// 		{
// 			title: '排序',
// 			dataIndex: 'menuOrder',
// 		},
// 		{
// 			title: '操作',
// 			key: 'operation',
// 			align: 'right',
// 			render(value, record) {
// 				return <PopoverMenu values={record} modal={modal} />
// 			},
// 		},
// 	]

// 	return (
// 		<>
// 			{contextHolder}
// 			<BaseDraggableTable
// 				tableProps={{
// 					columns,
// 					dataSource
// 				}}
// 			/>
// 		</>
// 	)
// }

// export default Menu
