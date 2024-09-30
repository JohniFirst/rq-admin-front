import { handleRegister } from '@/api/system-api'
import { Button, Form, Input } from 'antd'
import { useNavigate } from 'react-router-dom'
import login from './login.module.css'

const RegisterForm = () => {
	const [form] = Form.useForm()
	const navigate = useNavigate()

	const handleSubmit = async (values: LoginFormValues) => {
		await handleRegister(values)

		navigate('/login')
	}
	return (
		<section className='w-screen h-screen overflow-hidden'>
			<video id='video-background' autoPlay loop muted>
				<source src='/demo.mp4' type='video/mp4' />
				Your browser does not support the video tag.
			</video>

			<section className={login.formWp}>
				<h2 className={`${login.loginTitle} login-view-transitoin`}>注 册</h2>
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
							登 录
						</Button>
					</Form.Item>

					<section>
						<Button type='link' onClick={() => navigate('/login')}>
							去登录
						</Button>
					</section>
				</Form>
			</section>
		</section>
	)
}

export default RegisterForm
