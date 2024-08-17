import { menuUrls } from '@/routes/dynamic-routes'
import { Input, Form, InputNumber, Row, Col, Select } from 'antd'

/** 新增菜单的表单 */
const MenuAddForm = () => {
  return (
    <>
      <Form.Item
        label="菜单名"
        name="title"
        rules={[{ required: true, message: '请输入菜单名' }]}
      >
        <Input placeholder="请输入菜单名" />
      </Form.Item>

      <Form.Item
        label="路由"
        name="url"
        rules={[{ required: true, message: '请输入路由' }]}
      >
        <Select
          showSearch
          placeholder="请输入路由"
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={menuUrls}
        />
      </Form.Item>

      <Form.Item
        label="图标"
        name="icon"
        rules={[{ required: true, message: '请选择图标' }]}
      >
        <Input />
      </Form.Item>

      <Row>
        <Col span={12}>
          <Form.Item label="父级菜单ID" name="parent">
            <InputNumber className="w-full" placeholder="一级菜单可以不填" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="排序" name="menuOrder">
            <InputNumber placeholder="升序排序" />
          </Form.Item>
        </Col>
      </Row>
    </>
  )
}

export default MenuAddForm
