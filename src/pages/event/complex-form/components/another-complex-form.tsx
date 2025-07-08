import { Col, Form, type FormInstance, Input, Row } from 'antd'

const AnotherComplexForm: React.FC<{ form: FormInstance }> = ({ form }) => {
  const span = 6

  const name = Form.useWatch('name', form)

  return (
    <Row>
      <Col span={span}>
        <Form.Item
          name="advancedFormValue1"
          label="进阶表单值1"
          rules={[{ required: true, message: '请输入进阶表单值1' }]}
        >
          <Input placeholder="请输入进阶表单值1" />
        </Form.Item>
      </Col>

      <Col span={span}>
        <Form.Item
          name="advancedFormValue2"
          label="进阶表单值2"
          rules={[{ required: true, message: '请输入进阶表单值2' }]}
        >
          <Input placeholder="请输入进阶表单值2" />
        </Form.Item>
      </Col>

      {name && (
        <Col span={span}>
          <Form.Item
            name="advancedFormValue3"
            label="进阶表单值3"
            rules={[{ required: Boolean(name), message: '请输入进阶表单值3' }]}
          >
            <Input placeholder="第一部分的name输入了之后这个表单才会显示" />
          </Form.Item>
        </Col>
      )}
    </Row>
  )
}

export default AnotherComplexForm
