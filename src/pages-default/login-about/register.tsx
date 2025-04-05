import { handleRegister } from '@/api/system-api'
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Form, Input } from 'antd'
import { motion } from 'framer-motion'
import { NavLink, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

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

const RegisterForm = () => {
	const [form] = Form.useForm<RegisterFormValues>()
	const navigate = useNavigate()

	const handleSubmit = async (values: RegisterFormValues) => {
		await handleRegister(values)
		navigate('/login')
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

			<Form
				form={form}
				name='registerForm'
				onFinish={handleSubmit}
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
					name='email'
					rules={[
						{ required: true, message: '请输入您的邮箱！' },
						{ type: 'email', message: '请输入有效的邮箱地址！' },
					]}
				>
					<Input prefix={<MailOutlined />} placeholder='请输入邮箱' />
				</StyledFormItem>

				<StyledFormItem
					name='password'
					rules={[
						{ required: true, message: '请输入您的密码！' },
						{ min: 8, message: '密码长度不能小于8位！' },
						{ max: 24, message: '密码长度不能大于24位！' },
					]}
				>
					<Input.Password
						prefix={<LockOutlined />}
						placeholder='请输入8-24位字母、数字组合密码'
					/>
				</StyledFormItem>

				<StyledFormItem
					name='confirmPassword'
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
					<Input.Password
						prefix={<LockOutlined />}
						placeholder='请再次输入密码'
					/>
				</StyledFormItem>

				<Form.Item>
					<StyledButton
						type='primary'
						htmlType='submit'
						block
						className='bg-indigo-600 hover:bg-indigo-700'
					>
						立即注册
					</StyledButton>
				</Form.Item>

				<div className='text-center text-gray-600'>
					已有账号？
					<LinkText to='/login' className='ml-1'>
						立即登录
					</LinkText>
				</div>
			</Form>
		</>
	)
}

export default RegisterForm
