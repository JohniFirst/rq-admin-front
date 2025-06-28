import { message, Switch, Table, type TableProps } from 'antd'
import { type FC, useEffect, useState } from 'react'
import { getAllUserList, updateUserIsEnabled } from '@/api/system-api'

export type GetUserListParams = {
  pageNumber?: number
  pageSize?: number
}

export type UserList = {
  id: number
  isEnabled: 0 | 1
  nickname: string
  avator: string
  username: string
  phone: string
  email: string
  departmentId: number
  roleId: number
}

/** 当前所有用户列表 */
function User() {
  const [dataSource, setDataSource] = useState<UserList[]>([])
  const [loading, setLoading] = useState(false)
  const [current, setCurrent] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  useEffect(() => {
    getTableData({ pageNumber: current, pageSize })
  }, [current, pageSize])

  const getTableData = async (searchParams: GetUserListParams) => {
    setLoading(true)
    try {
      const res = await getAllUserList(searchParams)
      console.log('获取用户列表', res)

      setDataSource(res.content)
    } catch (_e) {
      message.error(_e instanceof Error ? _e.message : '获取用户列表失败')
    } finally {
      setLoading(false)
    }
  }

  /** 用户是否启用 */
  const IsEnabled: FC<{ value: boolean; record: UserList }> = ({ value, record }) => {
    const toogleUserEnable = async (checked: boolean) => {
      try {
        await updateUserIsEnabled({ id: record.id, isEnabled: checked ? 1 : 0 })
        message.success(checked ? '启用成功' : '禁用成功')
        getTableData({})
      } catch {
        message.error('操作失败')
      }
    }

    return (
      <Switch
        value={value}
        checkedChildren="启用"
        unCheckedChildren="禁用"
        onChange={toogleUserEnable}
      />
    )
  }

  const columns: TableProps<UserList>['columns'] = [
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
      render: (value, record: UserList) => <IsEnabled value={value} record={record} />,
    },
  ]

  return (
    <>
      <Table
        rowKey={'id'}
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        onChange={pagination => {
          setCurrent(pagination.current as number)
          setPageSize(pagination.pageSize as number)
        }}
      />
    </>
  )
}

export default User
