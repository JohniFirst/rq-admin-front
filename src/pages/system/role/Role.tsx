import type { TableProps } from 'antd'
import { Button } from 'antd'
import { useState } from 'react'
import { getAllRoleList } from '@/api/system-api.ts'
import BaseTable from '@/components/base/base-table.tsx'

function Role() {
  const [dataSource, setDataSource] = useState<RoleListRes[]>([])

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
      render: () => (
        <div>
          <Button type="link" size="small">
            删除
          </Button>
          <Button type="link" size="small">
            修改
          </Button>
        </div>
      ),
    },
  ]

  const testGetTableData: GetTableData = async searchParams => {
    const res = await getAllRoleList(searchParams)

    setDataSource(res)
  }

  return (
    <BaseTable<RoleListRes> tableProps={{ columns, dataSource }} getTableData={testGetTableData} />
  )
}

export default Role
