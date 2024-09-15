import { addRole, getAllRoleList } from '@/api/system-api.ts'
import BaseTable from '@/components/base/base-table.tsx'
import { Button, Form, Input } from 'antd'
import type { TableProps } from 'antd'

function Role() {
	const columns: TableProps<RoleListRes>['columns'] = [
		{
			title: '角色名',
			dataIndex: 'roleName',
			key: 'roleName',
		},
		{
			title: '操作',
			key: 'action',
			align: 'right',
			render: (_, { id }) => (
				<div key={id + 1}>
					<Button type='link' size='small'>
						删除
					</Button>
					<Button type='link' size='small'>
						修改
					</Button>
				</div>
			),
		},
	]

	return (
		<BaseTable
			tableProps={{ columns, getList: getAllRoleList }}
			addForm={{
				addFormApi: addRole,
				AddForm: () => (
					<Form.Item
						label='角色名'
						name='roleName'
						rules={[{ required: true, message: '请输入角色名' }]}
					>
						<Input />
					</Form.Item>
				),
			}}
		/>
	)
}

export default Role
