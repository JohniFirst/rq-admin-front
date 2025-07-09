import { ForageEnums } from '@/enums/localforage'
import { forage } from '@/utils/localforage'
import { regexps } from '@/utils/regexps'
import { Button, Col, DatePicker, Form, Input, Radio, Row, Select } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import { useEffect } from 'react'

type Step1Props = {
  onNext: () => void
}

type Step1Form = {
  name: string
  email: string
  phone: string
  idCard: string
  address: string
  gender: 'male' | 'female'
  birthday: Dayjs | string
  education: 'primary' | 'middle' | 'high' | 'college' | 'master' | 'doctor'
  school: string
  profession: string
  company: string | null
  position: string
  department: string
}

const Step1: React.FC<Step1Props> = ({ onNext }) => {
  const [form] = Form.useForm()

  const education = Form.useWatch('education', form)

  const span = 8

  useEffect(() => {
    forage.getItem<string>(ForageEnums.SETP1_FORM_DATA).then(res => {
      if (res) {
        const values = JSON.parse(res)
        values.birthday = dayjs(values.birthday)
        form.setFieldsValue(values)
      }
    })
  }, [])

  const handleSubmit = (values: Step1Form) => {
    forage.setItem(ForageEnums.SETP1_FORM_DATA, JSON.stringify(values))

    onNext()
  }

  return (
    <Form
      form={form}
      name="step1"
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      onFinish={handleSubmit}
    >
      <Row>
        <Col span={span}>
          <Form.Item<Step1Form>
            label="姓名"
            name="name"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" maxLength={10} showCount />
          </Form.Item>
        </Col>

        <Col span={span}>
          <Form.Item<Step1Form>
            label="邮箱"
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { pattern: regexps.email, message: '请输入正确的邮箱' },
            ]}
          >
            <Input type="email" placeholder="请输入邮箱" />
          </Form.Item>
        </Col>

        <Col span={span}>
          <Form.Item<Step1Form>
            label="手机号"
            name="phone"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: regexps.phone, message: '请输入正确的手机号' },
            ]}
          >
            <Input type="tel" placeholder="请输入手机号" maxLength={11} />
          </Form.Item>
        </Col>

        <Col span={span}>
          <Form.Item<Step1Form>
            label="身份证号"
            name="idCard"
            rules={[
              { required: true, message: '请输入身份证号' },
              { pattern: regexps.idCard, message: '请输入正确的身份证号' },
            ]}
          >
            <Input type="tel" placeholder="请输入身份证号" maxLength={18} />
          </Form.Item>
        </Col>

        <Col span={span}>
          <Form.Item<Step1Form> label="地址" name="address">
            <Input.TextArea placeholder="请输入地址" maxLength={100} showCount />
          </Form.Item>
        </Col>

        <Col span={span}>
          <Form.Item<Step1Form>
            label="性别"
            name="gender"
            rules={[{ required: true, message: '请选择性别' }]}
          >
            <Radio.Group>
              <Radio value="male">男</Radio>
              <Radio value="female">女</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>

        <Col span={span}>
          <Form.Item<Step1Form>
            label="生日"
            name="birthday"
            rules={[{ required: true, message: '请选择生日' }]}
          >
            <DatePicker placeholder="请选择生日" style={{ width: '100%' }} />
          </Form.Item>
        </Col>

        <Col span={span}>
          <Form.Item<Step1Form>
            label="学历"
            name="education"
            rules={[{ required: true, message: '请选择学历' }]}
          >
            <Select
              placeholder="请选择学历"
              allowClear
              options={[
                { label: '小学', value: 'primary' },
                { label: '初中', value: 'middle' },
                { label: '高中', value: 'high' },
                { label: '大学', value: 'college' },
                { label: '硕士', value: 'master' },
                { label: '博士', value: 'doctor' },
              ]}
            />
          </Form.Item>
        </Col>

        {education && (
          <Col span={span}>
            <Form.Item<Step1Form>
              label="学校"
              name="school"
              rules={[{ required: true, message: '请输入学校' }]}
            >
              <Input placeholder="请输入学校" />
            </Form.Item>
          </Col>
        )}

        {education && (
          <Col span={span}>
            <Form.Item<Step1Form>
              label="专业"
              name="profession"
              rules={[{ required: true, message: '请输入专业' }]}
            >
              <Input placeholder="请输入专业" />
            </Form.Item>
          </Col>
        )}

        <Col span={span}>
          <Form.Item<Step1Form>
            label="公司"
            name="company"
            rules={[{ required: true, message: '请选择公司' }]}
          >
            <Select placeholder="请选择公司" allowClear>
              <Select.Option value="company1">公司1</Select.Option>
              <Select.Option value="company2">公司2</Select.Option>
              <Select.Option value="company3">公司3</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        <Col span={span}>
          <Form.Item<Step1Form>
            label="职位"
            name="position"
            rules={[{ required: true, message: '请输入职位' }]}
          >
            <Input placeholder="请输入职位" />
          </Form.Item>
        </Col>

        <Col span={span}>
          <Form.Item<Step1Form>
            label="部门"
            name="department"
            rules={[{ required: true, message: '请输入部门' }]}
          >
            <Input placeholder="请输入部门" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <Button htmlType="submit" type="primary">
          下一步
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Step1
