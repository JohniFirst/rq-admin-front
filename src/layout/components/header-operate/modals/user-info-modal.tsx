import {
	MailOutlined,
	PhoneOutlined,
	UploadOutlined,
	UserOutlined,
} from '@ant-design/icons'
import { Form, Input, Modal, Upload, message } from 'antd'
import type { UploadProps } from 'antd'
import type { RcFile } from 'antd/es/upload/interface'
import type React from 'react'
import { useState } from 'react'

interface UserInfoModalProps {
	open: boolean
	onCancel: () => void
	initialValues?: {
		username: string
		email: string
		phone?: string
		avatar?: string
	}
}

const UserInfoModal: React.FC<UserInfoModalProps> = ({
	open,
	onCancel,
	initialValues,
}) => {
	const [form] = Form.useForm()
	const [loading, setLoading] = useState(false)
	const [imageUrl] = useState<string>(initialValues?.avatar || '')

	const beforeUpload = (file: RcFile) => {
		const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
		if (!isJpgOrPng) {
			message.error('只能上传 JPG/PNG 格式的图片!')
		}
		const isLt2M = file.size / 1024 / 1024 < 2
		if (!isLt2M) {
			message.error('图片大小不能超过 2MB!')
		}
		return isJpgOrPng && isLt2M
	}

	const uploadProps: UploadProps = {
		name: 'avatar',
		showUploadList: false,
		beforeUpload,
		customRequest: async ({ file, onSuccess }) => {
			// TODO: 实现文件上传逻辑
			const formData = new FormData()
			formData.append('file', file)
			// 调用上传API
			setTimeout(() => {
				onSuccess?.('ok')
			}, 1000)
		},
		onChange: (info) => {
			if (info.file.status === 'uploading') {
				setLoading(true)
				return
			}
			if (info.file.status === 'done') {
				setLoading(false)
				// 获取上传后的URL
				// setImageUrl(info.file.response.url)
			}
		},
	}

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields()
			// TODO: 实现保存用户信息的逻辑
			console.log('提交的值:', values)
			message.success('保存成功')
			onCancel()
		} catch (error) {
			console.error('表单验证失败:', error)
		}
	}

	return (
		<Modal
			open={open}
			title={
				<div className='text-xl font-semibold text-gray-800 dark:text-gray-100'>
					个人信息
				</div>
			}
			onCancel={onCancel}
			onOk={handleSubmit}
			okText='保存修改'
			cancelText='取消'
			confirmLoading={loading}
			className='dark:bg-gray-800'
			width={520}
			centered
			okButtonProps={{
				className:
					'bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600',
			}}
			cancelButtonProps={{
				className: 'hover:bg-gray-100 dark:hover:bg-gray-700',
			}}
		>
			<Form
				form={form}
				layout='vertical'
				initialValues={initialValues}
				className='mt-6 px-2'
			>
				<div className='flex justify-center mb-8'>
					<Upload {...uploadProps}>
						<div className='relative group'>
							<div className='w-28 h-28 rounded-full border-2 border-gray-200 dark:border-gray-600 overflow-hidden transition-all duration-300 group-hover:border-blue-500'>
								{imageUrl ? (
									<img
										src={imageUrl}
										alt='avatar'
										className='w-full h-full object-cover'
									/>
								) : (
									<div className='w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center'>
										<UserOutlined className='text-3xl text-gray-400 dark:text-gray-500' />
									</div>
								)}
							</div>
							<div className='absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 rounded-full p-2 cursor-pointer transition-all duration-300 transform group-hover:scale-110'>
								<UploadOutlined className='text-white text-lg' />
							</div>
						</div>
					</Upload>
				</div>

				<Form.Item
					name='username'
					label={
						<span className='text-gray-700 dark:text-gray-300'>用户名</span>
					}
					rules={[{ required: true, message: '请输入用户名' }]}
				>
					<Input
						prefix={<UserOutlined className='text-gray-400' />}
						placeholder='请输入用户名'
						className='h-10 text-base'
					/>
				</Form.Item>

				<Form.Item
					name='email'
					label={<span className='text-gray-700 dark:text-gray-300'>邮箱</span>}
					rules={[
						{ required: true, message: '请输入邮箱' },
						{ type: 'email', message: '请输入有效的邮箱地址' },
					]}
				>
					<Input
						prefix={<MailOutlined className='text-gray-400' />}
						placeholder='请输入邮箱'
						className='h-10 text-base'
					/>
				</Form.Item>

				<Form.Item
					name='phone'
					label={
						<span className='text-gray-700 dark:text-gray-300'>手机号</span>
					}
					rules={[{ pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }]}
				>
					<Input
						prefix={<PhoneOutlined className='text-gray-400' />}
						placeholder='请输入手机号'
						className='h-10 text-base'
					/>
				</Form.Item>
			</Form>
		</Modal>
	)
}

export default UserInfoModal
