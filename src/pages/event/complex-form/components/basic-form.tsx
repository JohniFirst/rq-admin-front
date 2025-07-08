import {
  Col,
  DatePicker,
  Form,
  type FormInstance,
  Input,
  InputNumber,
  Row,
  Select,
  TimePicker,
} from 'antd'
import React from 'react'

const BasicForm: React.FC<{ form?: FormInstance }> = () => {
  const span = 6

  return (
    <Row>
      <Col span={span}>
        <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
          <Input />
        </Form.Item>
      </Col>
      <Col span={span}>
        <Form.Item name="age" label="年龄" rules={[{ required: true, message: '请输入年龄' }]}>
          <InputNumber style={{ width: '100%' }} min={0} precision={0} />
        </Form.Item>
      </Col>
      <Col span={span}>
        <Form.Item name="gender" label="性别" rules={[{ required: true, message: '请输入性别' }]}>
          <Select
            options={[
              { label: '男', value: 'male' },
              { label: '女', value: 'female' },
            ]}
          />
        </Form.Item>
      </Col>
      <Col span={span}>
        <Form.Item
          name="phone"
          label="手机号"
          rules={[
            { required: true, message: '请输入手机号' },
            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
          ]}
        >
          <Input maxLength={11} placeholder="请输入手机号" />
        </Form.Item>
      </Col>
      <Col span={span}>
        <Form.Item
          name="email"
          label="邮箱"
          rules={[
            { required: true, message: '请输入邮箱' },
            {
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: '请输入正确的邮箱',
            },
          ]}
        >
          <Input placeholder="请输入邮箱" />
        </Form.Item>
      </Col>
      <Col span={span}>
        <Form.Item name="address" label="地址" rules={[{ required: true, message: '请输入地址' }]}>
          <Input placeholder="请输入地址" />
        </Form.Item>
      </Col>
      <Col span={span}>
        <Form.Item name="company" label="公司" rules={[{ required: true, message: '请输入公司' }]}>
          <Input />
        </Form.Item>
      </Col>
      <Col span={span}>
        <Form.Item
          name="department"
          label="部门"
          rules={[{ required: true, message: '请输入部门' }]}
        >
          <Input />
        </Form.Item>
      </Col>
      <Col span={span}>
        <Form.Item
          name="entryTime"
          label="入职时间"
          rules={[{ required: true, message: '请输入入职时间' }]}
        >
          <DatePicker format="YYYY-MM-DD" placeholder="请选择入职时间" style={{ width: '100%' }} />
        </Form.Item>
      </Col>
      <Col span={span}>
        <Form.Item name="position" label="职位" rules={[{ required: true, message: '请输入职位' }]}>
          <Input />
        </Form.Item>
      </Col>
      <Col span={span}>
        <Form.Item name="salary" label="薪资" rules={[{ required: true, message: '请输入薪资' }]}>
          <Input />
        </Form.Item>
      </Col>
      <Col span={span}>
        <Form.Item
          name="workTime"
          label="工作时间"
          rules={[{ required: true, message: '请输入工作时间' }]}
        >
          <TimePicker.RangePicker format="HH:mm" />
        </Form.Item>
      </Col>
      <Col span={span}>
        <Form.Item
          name="workAddress"
          label="工作地址"
          rules={[{ required: true, message: '请输入工作地址' }]}
        >
          <Input />
        </Form.Item>
      </Col>
      <Col span={span}>
        <Form.Item
          name="workEmail"
          label="工作邮箱"
          rules={[{ required: true, message: '请输入工作邮箱' }]}
        >
          <Input />
        </Form.Item>
      </Col>
      <Col span={span}>
        <Form.Item
          name="workPhone"
          label="工作手机号"
          rules={[{ required: true, message: '请输入工作手机号' }]}
        >
          <Input />
        </Form.Item>
      </Col>
      <Col span={span}>
        <Form.Item
          name="emergencyContact"
          label="紧急联系人"
          rules={[{ required: true, message: '请输入紧急联系人' }]}
        >
          <Input />
        </Form.Item>
      </Col>
      <Col span={span}>
        <Form.Item name="address" label="住址" rules={[{ required: true, message: '请输入住址' }]}>
          <Input />
        </Form.Item>
      </Col>
      <Col span={span}>
        <Form.Item
          name="nativePlace"
          label="籍贯"
          rules={[{ required: true, message: '请输入籍贯' }]}
        >
          <Input />
        </Form.Item>
      </Col>
      <Col span={span}>
        <Form.Item
          name="education"
          label="学历"
          rules={[{ required: true, message: '请输入学历' }]}
        >
          <Select
            options={[
              { label: '小学', value: 'primary' },
              { label: '初中', value: 'middle' },
              { label: '高中', value: 'high' },
              { label: '大学', value: 'university' },
              { label: '研究生', value: 'postgraduate' },
              { label: '博士', value: 'doctor' },
            ]}
            placeholder="请选择学历"
          />
        </Form.Item>
      </Col>
      <Col span={span}>
        <Form.Item name="major" label="专业" rules={[{ required: true, message: '请输入专业' }]}>
          <Input />
        </Form.Item>
      </Col>
      <Col span={span}>
        <Form.Item
          name="school"
          label="毕业学校"
          rules={[{ required: true, message: '请输入毕业学校' }]}
        >
          <Input />
        </Form.Item>
      </Col>

      <Col span={span}>
        <Form.Item name="nation" label="民族" rules={[{ required: true, message: '请输入民族' }]}>
          <Select
            options={[
              { label: '汉族', value: 'han' },
              { label: '少数民族', value: 'minority' },
              { label: '其他', value: 'other' },
            ]}
            placeholder="请选择民族"
          />
        </Form.Item>
      </Col>
      <Col span={span}>
        <Form.Item
          name="idCard"
          label="身份证号"
          rules={[{ required: true, message: '请输入身份证号' }]}
        >
          <Input />
        </Form.Item>
      </Col>
      <Col span={span}>
        <Form.Item
          name="birthday"
          label="出生日期"
          rules={[{ required: true, message: '请输入出生日期' }]}
        >
          <DatePicker format="YYYY-MM-DD" placeholder="请选择出生日期" style={{ width: '100%' }} />
        </Form.Item>
      </Col>
      <Col span={span}>
        <Form.Item
          name="maritalStatus"
          label="婚姻状况"
          rules={[{ required: true, message: '请输入婚姻状况' }]}
        >
          <Select
            options={[
              { label: '未婚', value: 'single' },
              { label: '已婚', value: 'married' },
              { label: '离异', value: 'divorced' },
            ]}
          />
        </Form.Item>
      </Col>
      <Col span={span}>
        <Form.Item name="height" label="身高" rules={[{ required: true, message: '请输入身高' }]}>
          <InputNumber suffix="cm" style={{ width: '100%' }} min={0} precision={2} />
        </Form.Item>
      </Col>
      <Col span={span}>
        <Form.Item name="weight" label="体重" rules={[{ required: true, message: '请输入体重' }]}>
          <InputNumber suffix="kg" style={{ width: '100%' }} min={0} precision={2} />
        </Form.Item>
      </Col>
      <Col span={span}>
        <Form.Item
          name="bloodType"
          label="血型"
          rules={[{ required: true, message: '请输入血型' }]}
        >
          <Input />
        </Form.Item>
      </Col>
      <Col span={span}>
        <Form.Item
          name="nationality"
          label="国籍"
          rules={[{ required: true, message: '请输入国籍' }]}
        >
          <Select
            options={[
              { label: '中国', value: 'china' },
              { label: '美国', value: 'usa' },
              { label: '英国', value: 'uk' },
              { label: '其他', value: 'other' },
            ]}
          />
        </Form.Item>
      </Col>
      <Col span={span}>
        <Form.Item
          name="politicalStatus"
          label="政治面貌"
          rules={[{ required: true, message: '请输入政治面貌' }]}
        >
          <Select
            options={[
              { label: '中共党员', value: 'communist' },
              { label: '中共预备党员', value: 'communist_candidate' },
              { label: '共青团员', value: 'communist_youth' },
              { label: '群众', value: 'mass' },
            ]}
          />
        </Form.Item>
      </Col>
    </Row>
  )
}

export default BasicForm
