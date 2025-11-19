import { MailOutlined } from '@ant-design/icons'
import { Button, Form, Input } from 'antd'
import { motion } from 'framer-motion'
import { NavLink, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { handleForgotPassword } from '@/api/system-api'

const FormTitle = styled(motion.h2)`
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 2rem;
  text-align: center;
`

const FormDescription = styled.p`
  color: var(--color-text-secondary);
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1rem;
  line-height: 1.6;
`

const StyledFormItem = styled(Form.Item)`
  margin-bottom: 24px;

  .ant-input-affix-wrapper {
    padding: 12px;
    border-radius: 12px;
    border: 2px solid var(--color-border);
    transition: all 0.3s ease;
    background: var(--color-background);

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
          <StyledButton type="primary" htmlType="submit" block>
            发送重置链接
          </StyledButton>
        </Form.Item>

        <BottomText>
          记起密码了？
          <LinkText to="/login">返回登录</LinkText>
        </BottomText>
      </Form>
    </>
  )
}

export default ForgotPassword
