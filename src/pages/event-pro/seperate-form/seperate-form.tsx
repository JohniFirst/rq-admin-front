import { Tabs } from 'antd'
import type { TabsProps } from 'antd'
import OriginForm from './components/origin-form'
import ViewMode from './components/view-mode'
import EditMode from './components/edit-mode'
import BusinessWithoutName from './components/business-without-item'
import BusinessDisableItem from './components/bussiness-disable-item'
import styled from 'styled-components'

const PageTitle = styled.h2`
  margin-bottom: 16px;
  background-color: red;
  padding: 8px 16px;
`

const items: TabsProps['items'] = [
  {
    key: '1',
    label: '公共基础表单显示所有的字段',
    children: <OriginForm />,
  },
  {
    key: '2',
    label: '查看模式，禁用所有表单项',
    children: <ViewMode />,
  },
  {
    key: '3',
    label: '编辑模式，对表单字段进行赋值',
    children: <EditMode />,
  },
  {
    key: '4',
    label: '业务场景1，不需要姓名，最高学历',
    children: <BusinessWithoutName />,
  },
  {
    key: '5',
    label: '业务场景2，禁用年龄和最高学历',
    children: <BusinessDisableItem />,
  },
]

const SeperateForm: React.FC = () => {
  return (
    <>
      <PageTitle>
        基于这种管理模式，你可以对以下表单实现不同的提交逻辑，任意字段的显示/禁用，这是vue的组件库目前没有办法实现的灵活度
      </PageTitle>
      <Tabs defaultActiveKey="1" items={items} />
    </>
  )
}

export default SeperateForm
