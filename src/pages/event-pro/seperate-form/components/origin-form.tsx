import { Button, Form } from 'antd'
import BaseFormItemList from './base-form-item-list'

function OriginForm() {
  const [form] = Form.useForm()

  const onFinish = (values: Record<string, unknown>) => {
    console.log('看看最终提交的表单的样子', values)
  }

  return (
    <Form
      name="basic"
      form={form}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      onFinish={onFinish}
    >
      <BaseFormItemList form={form} />

      <Form.Item>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </Form.Item>

      <h2>基于这种表单管理模式，你可以使用同一个表单，实现不同的提交逻辑：</h2>
      <ul>
        <li>1、针对不同的业务场景，处理不同的交互逻辑</li>
        <li>2、查看模式，将所有表单禁用</li>
        <li>3、编辑模式，在业务组件对表单进行赋值</li>
        <li>4、根据不同的业务场景，对不同的字段进行显示/禁用，同时处理不同的提交逻辑</li>
      </ul>
    </Form>
  )
}

export default OriginForm
