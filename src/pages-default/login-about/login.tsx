import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Checkbox, Col, Form, Input, Row, Image } from 'antd'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { getMenuList, handleLogin } from '@/api/system-api'
import { ForageEnums, IsLogin, SessionStorageKeys } from '@/enums/localforage'
import useCustomNavigate from '@/hooks/useCustomNavigate'
import { useAppDispatch } from '@/store/hooks'
import { updateMenu } from '@/store/slice/menu-slice'
import { forage } from '@/utils/localforage'

// import JSEncrypt from "jsencrypt";

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

  &:hover {
    color: #764ba2;
    text-decoration: underline;
  }
`

const RememberMeWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  .ant-checkbox-wrapper {
    color: var(--color-text-secondary);

    &:hover {
      .ant-checkbox-inner {
        border-color: #667eea;
      }
    }
  }

  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #667eea;
    border-color: #667eea;
  }
`

const BottomText = styled.div`
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
  margin-top: 1.5rem;
`

const LoginForm = () => {
  const [form] = Form.useForm<LoginFormValues>()
  const navigate = useCustomNavigate()
  const [isLogin, setIsLogin] = useState(false)
  const dispatch = useAppDispatch()
  const [imageCodeUrl] = useState('')
  const { username } = useParams()

  const handleSubmit = async (values: LoginFormValues) => {
    const token = await handleLogin(values)
    sessionStorage.setItem(`${SessionStorageKeys.IS_LOGIN}`, `${IsLogin.YES}`)

    forage.setItem(ForageEnums.TOKEN, token)

    const menu = await getMenuList()

    dispatch(updateMenu(menu))
    setIsLogin(true)
  }

  useEffect(() => {
    if (username) {
      form.setFieldValue('username', username)
    }
  }, [])

  useEffect(() => {
    if (isLogin) {
      navigate('/dashboard', false)
    }
  }, [isLogin, navigate])

  return (
    <>
      <FormTitle
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        欢迎登录
      </FormTitle>

      <Form
        form={form}
        name="loginForm"
        onFinish={handleSubmit}
        initialValues={{
          remember: true,
          username: 'lisi',
          password: '12345678',
          verificationCode: '1',
        }}
        layout="vertical"
        size="large"
      >
        <StyledFormItem name="username" rules={[{ required: true, message: '请输入您的用户名！' }]}>
          <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
        </StyledFormItem>

        <StyledFormItem name="password" rules={[{ required: true, message: '请输入您的密码！' }]}>
          <Input.Password prefix={<LockOutlined />} placeholder="请输入8-24位字母、数字组合密码" />
        </StyledFormItem>

        <Form.Item name="verificationCode" rules={[{ required: true, message: '请输入验证码' }]}>
          <Row gutter={16} align="middle">
            <Col span={16}>
              <Input type="number" placeholder="请输入验证码" />
            </Col>
            <Col span={8}>
              <Image src={imageCodeUrl} width={100} height={40} />
            </Col>
          </Row>
        </Form.Item>

        <RememberMeWrapper>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>记住我</Checkbox>
          </Form.Item>
          <LinkText to="/login/forgot-password">忘记密码？</LinkText>
        </RememberMeWrapper>

        <Form.Item>
          <StyledButton type="primary" htmlType="submit" block>
            登 录
          </StyledButton>
        </Form.Item>

        <BottomText>
          还没账号？
          <LinkText to="/login/new">立即注册</LinkText>
        </BottomText>
      </Form>
    </>
  )
}

export default LoginForm
