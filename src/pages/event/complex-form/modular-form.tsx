import { CaretRightOutlined } from '@ant-design/icons'
import { Button, Collapse, type CollapseProps, Form, FormInstance, Space, theme } from 'antd'
import React, { type CSSProperties } from 'react'
import BasicForm, { type BasicFormValues } from './components-modular/basic-form'
import AnotherComplexForm, {
  type AdvancedFormValues,
} from './components-modular/another-complex-form'
import TableForm from './components-modular/table-form'

type SubmitFormValues = AdvancedFormValues & BasicFormValues

const getItems: (panelStyle: CSSProperties, form: FormInstance) => CollapseProps['items'] = (
  panelStyle,
  form,
) => [
  {
    key: '1',
    label: '一个有很多项的基本表单',
    children: <BasicForm form={form} />,
    style: panelStyle,
  },
  {
    key: '2',
    label: '可以跟第一部分表单跨组件联动的高级表单',
    children: <AnotherComplexForm form={form} />,
    style: panelStyle,
  },
  {
    key: '3',
    label: '放置一个表格编辑项',
    children: <TableForm form={form} />,
    style: panelStyle,
  },
]

const ModularForm: React.FC = () => {
  const [form] = Form.useForm()
  const { token } = theme.useToken()

  const onFinish = (values: SubmitFormValues) => {
    console.log('表单校验成功，这里可以进行提交', values)
  }

  const panelStyle: React.CSSProperties = {
    marginBottom: 24,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: 'none',
  }

  return (
    <Form<SubmitFormValues>
      form={form}
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Collapse
        bordered={false}
        defaultActiveKey={['1', '2', '3']}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        style={{ background: token.colorBgContainer }}
        items={getItems(panelStyle, form)}
      />

      <Form.Item>
        <Space size={16}>
          <Button type="primary" htmlType="submit">
            提 交
          </Button>
          <Button htmlType="reset">重置</Button>
          <Button>取消</Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default ModularForm
