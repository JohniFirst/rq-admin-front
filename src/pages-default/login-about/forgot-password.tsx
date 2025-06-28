import { MailOutlined } from '@ant-design/icons'
import { Button, Form, Input } from 'antd'
import { motion } from 'framer-motion'
import { NavLink, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { handleForgotPassword } from '@/api/system-api'

const FormTitle = styled(motion.h2)`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 2rem;
  text-align: center;
`

const FormDescription = styled.p`
  color: #6b7280;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1rem;
  line-height: 1.5;
`

const StyledFormItem = styled(Form.Item)`
  margin-bottom: 24px;

  .ant-input-affix-wrapper {
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    transition: all 0.3s ease;

    &:hover,
    &:focus {
      border-color: #4f46e5;
      box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
    }

    input {
      font-size: 1rem;
    }

    .anticon {
      color: #9ca3af;
    }
  }
`

const StyledButton = styled(Button)`
  height: 48px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
  }
`

const LinkText = styled(NavLink)`
  color: #4f46e5;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: #4338ca;
  }
`

const ForgotPassword = () => {
  const [form] = Form.useForm<ForgotPasswordFormValues>()
  const navigate = useNavigate()

  const handleSubmit = async (values: ForgotPasswordFormValues) => {
    await handleForgotPassword(values)
    navigate('/login')
  }

  return (
    <>
      <FormTitle
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        找回密码
      </FormTitle>

      <FormDescription>请输入您的注册邮箱，我们将向您发送重置密码的链接。</FormDescription>

      <Form
        form={form}
        name="forgotPasswordForm"
        onFinish={handleSubmit}
        layout="vertical"
        size="large"
      >
        <StyledFormItem
          name="email"
          rules={[
            { required: true, message: '请输入您的邮箱！' },
            { type: 'email', message: '请输入有效的邮箱地址！' },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="请输入邮箱" />
        </StyledFormItem>

        <Form.Item>
          <StyledButton
            type="primary"
            htmlType="submit"
            block
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            发送重置链接
          </StyledButton>
        </Form.Item>

        <div className="text-center text-gray-600">
          记起密码了？
          <LinkText to="/login" className="ml-1">
            返回登录
          </LinkText>
        </div>
      </Form>
    </>
  )
}

export default ForgotPassword
