import { Col, Form, type FormInstance, Input, InputNumber, Row, Select } from 'antd'

type BaseFormItemListProps = {
  hiddenArr?: string[]
  disableArr?: string[]
  gutter?: number
  span?: number
  form: FormInstance
}

function BaseFormItemList({
  hiddenArr,
  disableArr,
  gutter = 16,
  span = 8,
  form,
}: BaseFormItemListProps) {
  const highestEducation = Form.useWatch('highestEducation', form)

  return (
    <>
      <Row gutter={gutter}>
        {!hiddenArr?.includes('name') && (
          <Col span={span}>
            <Form.Item label="姓名" name="name" rules={[{ required: true, message: '请输入姓名' }]}>
              <Input placeholder="请输入姓名" allowClear disabled={disableArr?.includes('name')} />
            </Form.Item>
          </Col>
        )}

        {!hiddenArr?.includes('age') && (
          <Col span={span}>
            <Form.Item label="年龄" name="age" rules={[{ required: true, message: '请输入年龄' }]}>
              <InputNumber
                placeholder="请输入年龄"
                disabled={disableArr?.includes('age')}
                min={0}
                precision={0}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        )}

        {!hiddenArr?.includes('sex') && (
          <Col span={span}>
            <Form.Item label="性别" name="sex" rules={[{ required: true, message: '请选择性别' }]}>
              <Select
                placeholder="请选择性别"
                disabled={disableArr?.includes('sex')}
                style={{ width: '100%' }}
                options={[
                  { label: '男', value: 'male' },
                  { label: '女', value: 'female' },
                ]}
              />
            </Form.Item>
          </Col>
        )}

        {!hiddenArr?.includes('phone') && (
          <Col span={span}>
            <Form.Item
              label="手机号"
              name="phone"
              rules={[
                { required: true, message: '请输入手机号' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
              ]}
            >
              <Input
                placeholder="请输入手机号"
                disabled={disableArr?.includes('phone')}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        )}

        {!hiddenArr?.includes('email') && (
          <Col span={span}>
            <Form.Item
              label="邮箱"
              name="email"
              rules={[
                { required: true, message: '请输入邮箱' },
                {
                  pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
                  message: '请输入正确的邮箱',
                },
              ]}
            >
              <Input
                placeholder="请输入邮箱"
                disabled={disableArr?.includes('email')}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        )}

        {!hiddenArr?.includes('address') && (
          <Col span={span}>
            <Form.Item
              label="地址"
              name="address"
              rules={[{ required: true, message: '请输入地址' }]}
            >
              <Input
                placeholder="请输入地址"
                disabled={disableArr?.includes('address')}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        )}

        {!hiddenArr?.includes('address2') && (
          <Col span={span}>
            <Form.Item
              label="地址2"
              name="address2"
              rules={[{ required: true, message: '请输入地址2' }]}
            >
              <Input
                placeholder="请输入地址2"
                disabled={disableArr?.includes('address2')}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        )}

        {!hiddenArr?.includes('highestEducation') && (
          <Col span={span}>
            <Form.Item
              label="最高学历"
              name="highestEducation"
              rules={[{ required: true, message: '请选择最高学历' }]}
            >
              <Select
                placeholder="请选择最高学历"
                disabled={disableArr?.includes('highestEducation')}
                style={{ width: '100%' }}
                options={[
                  { label: '小学', value: 'primary' },
                  { label: '初中', value: 'middle' },
                  { label: '高中', value: 'high' },
                  { label: '大学', value: 'university' },
                ]}
              />
            </Form.Item>
          </Col>
        )}

        {highestEducation === 'university' && (
          <Col span={span}>
            <Form.Item
              label="毕业院校"
              name="graduateSchool"
              rules={[{ required: true, message: '请选择毕业院校' }]}
            >
              <Select
                placeholder="请选择毕业院校"
                disabled={disableArr?.includes('graduateSchool')}
                style={{ width: '100%' }}
                options={[
                  { label: '清华大学', value: 'tsinghua' },
                  { label: '北京大学', value: 'pku' },
                  { label: '复旦大学', value: 'fudan' },
                  { label: '上海交通大学', value: 'sjtu' },
                  { label: '浙江大学', value: 'zju' },
                  { label: '南京大学', value: 'nju' },
                  { label: '武汉大学', value: 'whu' },
                  { label: '中山大学', value: 'sysu' },
                  { label: '华南理工大学', value: 'scut' },
                  { label: '哈尔滨工业大学', value: 'hit' },
                ]}
              />
            </Form.Item>
          </Col>
        )}
      </Row>
    </>
  )
}

export default BaseFormItemList
