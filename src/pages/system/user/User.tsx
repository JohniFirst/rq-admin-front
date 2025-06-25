import { Button, message, Switch, type TableProps } from 'antd'
import { type FC, useEffect, useState } from 'react'
import { getAllUserList, updateUserIsEnabled } from '@/api/system-api'
import BaseTable from '@/components/base/base-table'

/** 当前所有用户列表 */
function User() {
	const [dataSource, setDataSource] = useState<UserListRes[]>([])
	const [loading, setLoading] = useState(false)

	const getTableData: GetTableData = async (searchParams = {}) => {
		setLoading(true)
		try {
			const res = await getAllUserList(searchParams)
			setDataSource(res)
		} catch (_e) {
			message.error('获取用户列表失败')
		} finally {
			setLoading(false)
		}
	}

	const handleRefresh = () => {
		getTableData({})
	}

	/** 用户是否启用 */
	const IsEnabled: FC<{ value: boolean; record: UserListRes }> = ({ value, record }) => {
		const toogleUserEnable = async (checked: boolean) => {
			try {
				await updateUserIsEnabled({ id: record.id, isEnabled: checked ? 1 : 0 })
				message.success(checked ? '启用成功' : '禁用成功')
				getTableData({})
			} catch {
				message.error('操作失败')
			}
		}

		return <Switch value={value} checkedChildren='启用' unCheckedChildren='禁用' onChange={toogleUserEnable} />
	}

	const columns: TableProps<UserListRes>['columns'] = [
		{
			title: '昵称',
			dataIndex: 'nickname',
			key: 'nickname',
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
		},
		{
			title: '手机号',
			dataIndex: 'phone',
			key: 'phone',
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
		},
		{
			title: '角色',
			dataIndex: 'roleId',
			key: 'roleId',
		},
		{
			title: '是否启用',
			dataIndex: 'isEnabled',
			key: 'isEnabled',
			render: (value, record: UserListRes) => <IsEnabled value={value} record={record} />,
		},
	]

	// 页面初始化拉取数据
	useEffect(() => {
		getTableData({})
	}, [])

	return (
		<div>
			<Button onClick={handleRefresh} style={{ marginBottom: 16 }}>
				刷新
			</Button>
			<BaseTable<UserListRes> tableProps={{ columns, dataSource, loading }} getTableData={getTableData} />
		</div>
	)
}

export default User
