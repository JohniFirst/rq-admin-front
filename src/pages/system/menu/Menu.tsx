import { Button, message, Modal, Popover, Table, type TableProps } from 'antd'
import { useEffect, useState } from 'react'
import { delMenu, getMenuList } from '@/api/system-api'
// import BaseDraggableTable from '@/components/base/base-draggable-table'
// import PopoverMenu from '@/components/base/popover-menu'
import LucideIcon, { type LucideIconType } from '@/components/lucide-icon'
import MenuAddForm from './components/menu-add-form'
import styled from 'styled-components'
import { MoreOutlined } from '@ant-design/icons'

const OperationButtonWp = styled.section`
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
`

const Menu = () => {
  const [dataSource, setDataSource] = useState<MenuApiResponse[]>([])
  const [modal, contextHolder] = Modal.useModal()

  useEffect(() => {
    refreshMenuList()
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
        return Array.isArray(value)
          ? value.map((item: RoleListRes) => item.roleName).join(', ')
          : ''
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
      render: (_: unknown, record: MenuApiResponse) => {
        return (
          <Popover
            placement="left"
            trigger="click"
            content={
              <>
                <MenuAddForm onRefresh={refreshMenuList} initialValues={record}>
                  编辑
                </MenuAddForm>

                <Button
                  type="text"
                  danger
                  onClick={async () => {
                    const confirmed = await modal.confirm({
                      title: '确认删除？',
                      cancelText: '取消',
                      okText: '删除',
                    })

                    if (!confirmed) return

                    await delMenu(record.id)
                    message.success('删除成功')
                    refreshMenuList()
                  }}
                >
                  删 除
                </Button>
              </>
            }
          >
            <Button type="text" shape="circle" icon={<MoreOutlined />} />
          </Popover>
        )
      },
    },
  ]

  // 在 Menu 组件内添加刷新方法
  const refreshMenuList = async () => {
    const res = await getMenuList()

    setDataSource(res)
  }

  return (
    <>
      {contextHolder}

      <OperationButtonWp>
        <MenuAddForm onRefresh={refreshMenuList} />
      </OperationButtonWp>

      <Table dataSource={dataSource} columns={columns} />
    </>
  )
}

export default Menu
