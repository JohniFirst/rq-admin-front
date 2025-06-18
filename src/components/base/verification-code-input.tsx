import SquareInputBox from '@/components/square-input-box/square-input-box'
import { Col, Form, Image, Row } from 'antd'
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

	const handleCodeChange = (value: string) => {
		setCode(value)
	}

	const handleCodeComplete = (value: string) => {
		console.log('验证码输入完成:', value)
		// 这里可以添加自动提交逻辑
	}

	return (
		<Form.Item
			name='verificationCode'
			rules={[{ required: true, message: '请输入验证码' }]}
		>
			<Row gutter={16} align='middle'>
				<Col span={16}>
					<SquareInputBox
						length={6}
						type='number'
						value={code}
						onChange={handleCodeChange}
						onComplete={handleCodeComplete}
						autoFocus
						placeholder='请输入验证码'
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
