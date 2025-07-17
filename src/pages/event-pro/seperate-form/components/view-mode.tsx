import { Form } from 'antd'
import BaseFormItemList from './base-form-item-list'

function ViewMode() {
  const [form] = Form.useForm()

  return (
    <Form name="basic" form={form} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} disabled>
      <BaseFormItemList form={form} />
    </Form>
  )
}

export default ViewMode
