import { Button, Form } from 'antd'
import BaseFormItemList from './base-form-item-list'

function BusinessWithoutName() {
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
      <BaseFormItemList form={form} hiddenArr={['name', 'highestEducation']} />

      <Form.Item>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </Form.Item>
    </Form>
  )
}

export default BusinessWithoutName
