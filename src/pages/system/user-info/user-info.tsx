import type { AutoCompleteProps, FormProps } from 'antd'
import { AutoComplete, Button, Form, Input } from 'antd'
import { type FC, useState } from 'react'

type FieldType = {
	nickname?: string
	avator?: string
	phone?: string
	email?: string
}

const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
	console.log('Success:', values)
}

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
	console.log('Failed:', errorInfo)
}

const UserInfo: FC = () => {
	const [options, setOptions] = useState<AutoCompleteProps['options']>([])
	const handleSearch = (value: string) => {
		setOptions(() => {
			if (!value || value.includes('@')) {
				return []
			}
			return ['gmail.com', '163.com', 'qq.com', 'outlook.com'].map(
				(domain) => ({
					label: `${value}@${domain}`,
					value: `${value}@${domain}`,
				}),
			)
		})
	}

	return (
		<div className='custom-container'>
			<Form
				name='basic'
				labelCol={{ span: 8 }}
				wrapperCol={{ span: 16 }}
				style={{ maxWidth: 600 }}
				initialValues={{ remember: true }}
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				autoComplete='off'
			>
				<Form.Item<FieldType>
					label='头像'
					name='avator'
					rules={[{ required: true, message: '请上传头像' }]}
				>
					<Input placeholder='请上传头像' />
				</Form.Item>

				<Form.Item<FieldType>
					label='昵称'
					name='nickname'
					rules={[{ required: true, message: '请输入昵称' }]}
				>
					<Input placeholder='请输入昵称' />
				</Form.Item>

				<Form.Item<FieldType>
					label='手机号'
					name='phone'
					rules={[
						{ required: true, message: '请输入手机号' },
						{
							pattern: /^1[3-9]\d{9}$/,
							message: '请输入有效的手机号格式',
						},
					]}
				>
					<Input placeholder='请输入手机号' />
				</Form.Item>

				<Form.Item<FieldType>
					label='电子邮箱'
					name='email'
					rules={[
						{ required: true, message: '请输入电子邮箱' },
						{
							pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
							message: '请输入有效的电子邮箱格式',
						},
					]}
				>
					<AutoComplete
						placeholder='请输入电子邮箱'
						options={options}
						onSearch={handleSearch}
					/>
				</Form.Item>

				<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
					<Button className='w-40' type='primary' htmlType='submit'>
						修 改
					</Button>
				</Form.Item>
			</Form>
		</div>
	)
}

export default UserInfo
