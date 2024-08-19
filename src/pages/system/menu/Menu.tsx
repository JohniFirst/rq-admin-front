import { addMenu, delMenu, getMenuList } from '@/api/system-api'
import BaseTable from '@/components/base/base-table'
import MenuAddForm from './components/menu-add-form'
import LucideIcon, { LucideIconType } from '@/components/lucide-icon'
import { Button, message, Modal } from 'antd'

function Menu() {
  const [modal, contextHolder] = Modal.useModal()

  const columns: BaseTableColumns = [
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
      render(value) {
        return value.map((item: RoleListRes) => item.roleName).join(', ')
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
      render(value, record) {
        return (
          <>
            <Button type="link" size="small">
              修改
            </Button>

            <Button
              type="link"
              size="small"
              onClick={async () => {
                const confirmed = await modal.confirm({
                  title: '确认删除？',
                  cancelText: '取消',
                  okText: '删除',
                })

                if (!confirmed) return

                await delMenu(record.id)

                message.success('删除成功')
              }}
            >
              删除
            </Button>
          </>
        )
      },
    },
  ]

  return (
    <>
      {contextHolder}
      <BaseTable
        noPage
        tableProps={{
          columns,
          getList: getMenuList,
        }}
        addForm={{
          addFormApi: addMenu,
          AddForm: () => <MenuAddForm />,
        }}
      />
    </>
  )
}

export default Menu
