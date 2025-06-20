import { LockOutlined } from '@ant-design/icons'
import { Form, Input, Modal, message } from 'antd'
import type React from 'react'
import { useState } from 'react'

interface ChangePasswordModalProps {
	open: boolean
	onCancel: () => void
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ open, onCancel }) => {
	const [form] = Form.useForm()
	const [loading, setLoading] = useState(false)

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields()
			setLoading(true)
			// TODO: 实现修改密码的逻辑
			console.log('提交的值:', values)
			message.success('密码修改成功')
			form.resetFields()
			onCancel()
		} catch (error) {
			console.error('表单验证失败:', error)
		} finally {
			setLoading(false)
		}
	}

	return (
		<Modal
			open={open}
			title={<div className='text-xl font-semibold text-gray-800 dark:text-gray-100'>修改密码</div>}
			onCancel={onCancel}
			onOk={handleSubmit}
			okText='确认修改'
			cancelText='取消'
			confirmLoading={loading}
			className='dark:bg-gray-800'
			width={480}
			centered
			okButtonProps={{
				className: 'bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600',
			}}
			cancelButtonProps={{
				className: 'hover:bg-gray-100 dark:hover:bg-gray-700',
			}}
		>
			<div className='mb-6 text-gray-500 dark:text-gray-400 text-sm'>
				为了保证账号安全，请设置一个包含大小写字母和数字的强密码
			</div>
			<Form form={form} layout='vertical' className='px-2'>
				<Form.Item
					name='oldPassword'
					label={<span className='text-gray-700 dark:text-gray-300'>当前密码</span>}
					rules={[{ required: true, message: '请输入当前密码' }]}
				>
					<Input.Password
						prefix={<LockOutlined className='text-gray-400' />}
						placeholder='请输入当前密码'
						className='h-10 text-base'
					/>
				</Form.Item>

				<Form.Item
					name='newPassword'
					label={<span className='text-gray-700 dark:text-gray-300'>新密码</span>}
					rules={[
						{ required: true, message: '请输入新密码' },
						{ min: 6, message: '密码长度不能小于6位' },
						{
							pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d){6,}$/,
							message: '密码必须包含大小写字母和数字',
						},
					]}
					extra={
						<div className='mt-1 text-gray-400 dark:text-gray-500 text-xs'>
							密码长度至少6位，必须包含大小写字母和数字
						</div>
					}
				>
					<Input.Password
						prefix={<LockOutlined className='text-gray-400' />}
						placeholder='请输入新密码'
						className='h-10 text-base'
					/>
				</Form.Item>

				<Form.Item
					name='confirmPassword'
					label={<span className='text-gray-700 dark:text-gray-300'>确认新密码</span>}
					dependencies={['newPassword']}
					rules={[
						{ required: true, message: '请确认新密码' },
						({ getFieldValue }) => ({
							validator(_, value) {
								if (!value || getFieldValue('newPassword') === value) {
									return Promise.resolve()
								}
								return Promise.reject(new Error('两次输入的密码不一致'))
							},
						}),
					]}
				>
					<Input.Password
						prefix={<LockOutlined className='text-gray-400' />}
						placeholder='请确认新密码'
						className='h-10 text-base'
					/>
				</Form.Item>
			</Form>
		</Modal>
	)
}

export default ChangePasswordModal
