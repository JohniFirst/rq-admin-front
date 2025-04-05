import { getMenuList, handleLogin } from '@/api/system-api'
import VerificationCodeInput from '@/components/base/verification-code-input'
import { IsLogin, SessionStorageKeys } from '@/enums/localforage'
import useCustomNavigate from '@/hooks/useCustomNavigate'
import { useAppDispatch } from '@/store/hooks'
import { updateMenu } from '@/store/slice/menu-slice'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input } from 'antd'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
// import JSEncrypt from "jsencrypt";

const FormTitle = styled(motion.h2)`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 2rem;
  text-align: center;
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

  .ant-input-password {
    padding: 12px;
    border-radius: 8px;
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

const RememberMeWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  .ant-checkbox-wrapper {
    color: #4b5563;
  }
`

const LoginForm = () => {
	const [form] = Form.useForm<LoginFormValues>()
	const navigate = useCustomNavigate()
	const [isLogin, setIsLogin] = useState(false)
	const dispatch = useAppDispatch()

	const handleSubmit = async (values: LoginFormValues) => {
		const res = await handleLogin(values)
		console.log('Login Mock Result:', res)
		sessionStorage.setItem(`${SessionStorageKeys.IS_LOGIN}`, `${IsLogin.YES}`)
		const menu = await getMenuList()
		dispatch(updateMenu(menu))
		setIsLogin(true)
	}

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
				name='loginForm'
				onFinish={handleSubmit}
				initialValues={{
					remember: true,
					username: 'zhangsan',
					password: '2',
					verificationCode: '1',
				}}
				layout='vertical'
				size='large'
			>
				<StyledFormItem
					name='username'
					rules={[{ required: true, message: '请输入您的用户名！' }]}
				>
					<Input prefix={<UserOutlined />} placeholder='请输入用户名' />
				</StyledFormItem>

				<StyledFormItem
					name='password'
					rules={[{ required: true, message: '请输入您的密码！' }]}
				>
					<Input.Password
						prefix={<LockOutlined />}
						placeholder='请输入8-24位字母、数字组合密码'
					/>
				</StyledFormItem>

				<VerificationCodeInput />

				<RememberMeWrapper>
					<Form.Item name='remember' valuePropName='checked' noStyle>
						<Checkbox>记住我</Checkbox>
					</Form.Item>
					<LinkText to='/login/forgot-password'>忘记密码？</LinkText>
				</RememberMeWrapper>

				<Form.Item>
					<StyledButton
						type='primary'
						htmlType='submit'
						block
						className='bg-indigo-600 hover:bg-indigo-700'
					>
						登 录
					</StyledButton>
				</Form.Item>

				<div className='text-center text-gray-600'>
					还没账号？
					<LinkText to='/login/new' className='ml-1'>
						立即注册
					</LinkText>
				</div>
			</Form>
		</>
	)
}

export default LoginForm
