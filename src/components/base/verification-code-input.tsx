import { Col, Form, Image, Input, Row } from 'antd'
import { type SetStateAction, useState } from 'react'

/**
 * Renders a form item for verification code input with an image code.
 * default code filed name is 'verificationCode', can be changed by props
 *
 * @return {JSX.Element} The form item for verification code input.
 */
function VerificationCodeInput() {
	const [code, setCode] = useState('')
	const [imageCodeUrl] = useState('https://example.com/imageCode.jpg') // 假设这是图片验证码的 URL

	const handleCodeChange = (e: {
		target: { value: SetStateAction<string> }
	}) => {
		setCode(e.target.value)
	}

	return (
		<Form.Item
			name='verificationCode'
			rules={[{ required: true, message: '请输入验证码' }]}
		>
			<Row>
				<Col span={16}>
					<Input
						type='text'
						placeholder='请输入验证码'
						maxLength={6}
						onChange={handleCodeChange}
						value={code}
					/>
				</Col>
				<Col span={8}>
					<Image src={imageCodeUrl} width={100} height={40} />
				</Col>
			</Row>
		</Form.Item>
	)
}

export default VerificationCodeInput
