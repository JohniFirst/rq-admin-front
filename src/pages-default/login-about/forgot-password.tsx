import { handleRegister } from '@/api/system-api'
import { Button, Form, Input } from 'antd'
import { NavLink, useNavigate } from 'react-router-dom'

const ForgotPassword = () => {
	const [form] = Form.useForm()
	const navigate = useNavigate()

	const handleSubmit = async (values: LoginFormValues) => {
		await handleRegister(values)

		navigate('/login')
	}

	return (
		<>
			<h2 className='text-4xl font-bold mb-4 login-view-transitoin'>
				密码找回
			</h2>
			<Form form={form} name='loginForm' onFinish={handleSubmit}>
				<Form.Item
					name='username'
					rules={[{ required: true, message: '请输入您的用户名！' }]}
				>
					<Input placeholder='用户名' />
				</Form.Item>
				<Form.Item
					name='password'
					rules={[{ required: true, message: '请输入您的密码！' }]}
				>
					<Input.Password placeholder='请输入8-24位字母、数字组合密码' />
				</Form.Item>

				<Form.Item>
					<Button type='primary' block htmlType='submit'>
						找回密码
					</Button>
				</Form.Item>

				<section>
					<NavLink to={'/login'}>去登录</NavLink>
				</section>
			</Form>
		</>
	)
}

export default ForgotPassword
