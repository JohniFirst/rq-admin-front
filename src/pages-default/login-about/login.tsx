import { getMenuList, handleLogin } from '@/api/system-api'
import VerificationCodeInput from '@/components/base/verification-code-input'
import { IsLogin, SessionStorageKeys } from '@/enums/localforage'
import useCustomNavigate from '@/hooks/useCustomNavigate'
import { useAppDispatch } from '@/store/hooks'
import { updateMenu } from '@/store/slice/menu-slice'
import { Button, Checkbox, Form, Input } from 'antd'
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
// import JSEncrypt from "jsencrypt";
import login from './login.module.css'

const LoginForm = () => {
	const [form] = Form.useForm()
	const navigate = useCustomNavigate()
	const [isLogin, setIsLogin] = useState(false)
	const dispatch = useAppDispatch()

	const handleSubmit = async (values: LoginFormValues) => {
		// e.preventDefault();
		// 对密码进行非对称加密
		// const encryptedPassword = await encryptPassword(values.password);
		// 这里可以添加登录逻辑，例如发送请求到后端
		console.log('Encrypted Password:', values)
		// navigate('/dashboard', false)

		const res = await handleLogin(values)

		console.log('Login Mock Result:', res)

		sessionStorage.setItem(`${SessionStorageKeys.IS_LOGIN}`, `${IsLogin.YES}`)

		const menu = await getMenuList()

		dispatch(updateMenu(menu))

		setIsLogin(true)
	}

	// 异步导航，避免异步获取到的路由数据访问不到
	useEffect(() => {
		if (isLogin) {
			navigate('/dashboard', false)
		}
	}, [isLogin])

	return (
		<section className='w-screen h-screen overflow-hidden'>
			<video id='video-background' autoPlay loop muted>
				<source src='/demo.mp4' type='video/mp4' />
				Your browser does not support the video tag.
			</video>

			<section className={login.formWp}>
				<h2
					className={`${login.loginTitle} login-view-transitoin cursor-pointer`}
				>
					<NavLink to='/'>登 录</NavLink>
				</h2>
				<Form
					form={form}
					name='loginForm'
					onFinish={handleSubmit}
					initialValues={{
						remember: true,
						username: 'zhangsan',
						password: 2,
						verificationCode: 1,
					}}
				>
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

					<VerificationCodeInput />

					<Form.Item name='remember' valuePropName='checked'>
						<div className='flex justify-between'>
							<Checkbox>记住我</Checkbox>
							<p>
								还没账号?<NavLink to='/register'>立即注册</NavLink>
							</p>
						</div>
					</Form.Item>

					<Form.Item>
						<Button type='primary' block htmlType='submit'>
							登 录
						</Button>
					</Form.Item>

					<section>
						<Button type='link'>忘记密码？</Button>
					</section>
				</Form>
			</section>
		</section>
	)
}

export default LoginForm
