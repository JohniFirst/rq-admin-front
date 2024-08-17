import { addMenu, getMenuList } from '@/api/system-api'
import BaseTable from '@/components/base/base-table'
import MenuAddForm from './components/menu-add-form'
import LucideIcon, { LucideIconType } from '@/components/lucide-icon'

function Menu() {
  const columns: BaseTableColumns = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '菜单名',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '路由',
      dataIndex: 'url',
      key: 'url',
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      render: (_, { icon }) => {
        return <LucideIcon name={icon as LucideIconType} />
      },
    },
    {
      title: '排序',
      dataIndex: 'menuOrder',
      key: 'menuOrder',
    },
    {
      title: '操作',
      key: 'operation',
      align: 'right',
      render: (_, { id }) => <a key={id + '1'}>删除</a>,
    },
  ]

  return (
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
  )
}

export default Menu
