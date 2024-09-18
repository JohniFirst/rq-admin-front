import { getAllUserList, updateUserIsEnabled } from '@/api/system-api'
import BaseTable from '@/components/base/base-table'
import { Switch } from 'antd'
import type { FC } from 'react'

const test: number = '1'

console.log(test)

/** 当前所有用户列表 */
function User() {
	const columns: BaseTableColumns = [
		{
			title: '昵称',
			dataIndex: 'nickname',
			key: 'nickname',
			searchFormItemConfig: {},
		},
		{
			title: '头像',
			dataIndex: 'avator',
			key: 'avator',
		},
		{
			title: '用户名',
			dataIndex: 'username',
			key: 'username',
			searchFormItemConfig: {},
		},
		{
			title: '手机号',
			dataIndex: 'phone',
			key: 'phone',
			searchFormItemConfig: {},
		},
		{
			title: '电子邮箱',
			dataIndex: 'email',
			key: 'email',
		},
		{
			title: '部门',
			dataIndex: 'departmentId',
			key: 'departmentId',
			searchFormItemConfig: {},
		},
		{
			title: '角色',
			dataIndex: 'roleId',
			key: 'roleId',
			searchFormItemConfig: {},
		},
		{
			title: '是否启用',
			dataIndex: 'isEnabled',
			key: 'isEnabled',
			searchFormItemConfig: {},
			render: (value, record: UserListRes) => (
				<IsEnabled value={value} record={record} />
			),
		},
	]

	/** 用户是否启用 */
	const IsEnabled: FC<{ value: boolean; record: UserListRes }> = ({
		value,
		record,
	}) => {
		const toogleUserEnable = async (checked: boolean) => {
			await updateUserIsEnabled({ id: record.id, isEnabled: checked ? 1 : 0 })
		}

		return (
			<Switch
				value={value}
				checkedChildren='启用'
				unCheckedChildren='禁用'
				onChange={(checked) => toogleUserEnable(checked)}
			/>
		)
	}

	return <BaseTable tableProps={{ columns, getList: getAllUserList }} />
}

export default User
