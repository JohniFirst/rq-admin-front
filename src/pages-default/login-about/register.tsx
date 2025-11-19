import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Form, Input, message } from 'antd'
import { motion } from 'framer-motion'
import { NavLink, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { handleRegister } from '@/api/system-api'

import bcrypt from 'bcryptjs'

const FormTitle = styled(motion.h2)`
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 2rem;
  text-align: center;
`

const StyledFormItem = styled(Form.Item)`
  margin-bottom: 24px;

  .ant-input-affix-wrapper {
    padding: 12px;
    border-radius: 12px;
    border: 2px solid var(--color-border);
    transition: all 0.3s ease;
    background: var(--color-background);

    .ant-input-prefix {
      margin-right: 10px;
      display: inline-block;
    }

    &:hover {
      border-color: #667eea;
    }

    &:focus,
    &:focus-within {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    input {
      font-size: 1rem;
      background: transparent;
      color: var(--color-text);
    }

    .anticon {
      color: var(--color-text-secondary);
    }
  }

  .ant-input-password {
    padding: 12px;
    border-radius: 12px;
  }
`

const StyledButton = styled(Button)`
  height: 52px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.0625rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    background: linear-gradient(135deg, #5568d3 0%, #653a8b 100%);
    color: white;
  }

  &:active {
    transform: translateY(0);
  }
`

const LinkText = styled(NavLink)`
  color: #667eea;
  font-weight: 500;
  transition: color 0.3s ease;
  text-decoration: none;
  margin-left: 0.25rem;

  &:hover {
    color: #764ba2;
    text-decoration: underline;
  }
`

const BottomText = styled.div`
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
  margin-top: 1.5rem;
`

const RegisterForm = () => {
  const [form] = Form.useForm<RegisterFormValues>()
  const [messageApi] = message.useMessage()

  const navigate = useNavigate()

  const handleSubmit = async (registerSubmitForm: RegisterFormValues) => {
    console.log('提交的值:', registerSubmitForm)

    const salt = await bcrypt.genSalt(10)

    const encryptedPassword = await bcrypt.hash(registerSubmitForm.password, salt)

    registerSubmitForm.password = encryptedPassword

    delete registerSubmitForm.confirmPassword

    await handleRegister(registerSubmitForm)

    messageApi.success('注册成功！请登录。')

    navigate(`/login?username=${registerSubmitForm.username}`)
  }

  return (
    <>
      <FormTitle
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        创建账号
      </FormTitle>

      <Form<RegisterFormValues>
        form={form}
        name="registerForm"
        onFinish={handleSubmit}
        initialValues={{
          username: 'wangwu',
          nickname: '王五',
          phone: '19324790457',
          email: '1733098850@qq.com',
          password: 'qishiwobuhuai198',
          confirmPassword: 'qishiwobuhuai198',
        }}
        layout="vertical"
        size="large"
      >
        <StyledFormItem name="username" rules={[{ required: true, message: '请输入您的用户名！' }]}>
          <Input prefix={<UserOutlined />} placeholder="请输入用户名" autoComplete="off" />
        </StyledFormItem>

        <StyledFormItem name="nickname" rules={[{ required: true, message: '请输入您的昵称！' }]}>
          <Input prefix={<UserOutlined />} placeholder="请输入昵称" />
        </StyledFormItem>

        <StyledFormItem
          name="phone"
          rules={[
            { required: true, message: '请输入您的手机号！' },
            { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确！' },
          ]}
        >
          <Input maxLength={11} prefix={<UserOutlined />} placeholder="请输入手机号" />
        </StyledFormItem>

        <StyledFormItem
          name="email"
          rules={[
            { required: true, message: '请输入您的邮箱！' },
            { type: 'email', message: '请输入有效的邮箱地址！' },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="请输入邮箱" />
        </StyledFormItem>

        <StyledFormItem
          name="password"
          rules={[
            { required: true, message: '请输入您的密码！' },
            { min: 8, message: '密码长度不能小于8位！' },
            { max: 24, message: '密码长度不能大于24位！' },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="请输入8-24位字母、数字组合密码"
            autoComplete="off"
          />
        </StyledFormItem>

        <StyledFormItem
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { required: true, message: '请确认您的密码！' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('两次输入的密码不一致！'))
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="请再次输入密码" />
        </StyledFormItem>

        <Form.Item>
          <StyledButton type="primary" htmlType="submit" block>
            立即注册
          </StyledButton>
        </Form.Item>

        <BottomText>
          已有账号？
          <LinkText to="/login">立即登录</LinkText>
        </BottomText>
      </Form>
    </>
  )
}

export default RegisterForm
