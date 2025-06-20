import SquareInputBox from '@/components/square-input-box/square-input-box'
import { Button, Card, InputNumber, Select, Space, Switch, message } from 'antd'
import type React from 'react'
import { useState } from 'react'

const { Option } = Select

const SquareInputDemo: React.FC = () => {
	const [code1, setCode1] = useState('')
	const [code2, setCode2] = useState('')
	const [code3, setCode3] = useState('')
	const [code4, setCode4] = useState('')
	const [code5, setCode5] = useState('')
	const [code6, setCode6] = useState('')
	const [code7, setCode7] = useState('')
	const [code8, setCode8] = useState('')

	// 配置状态
	const [length, setLength] = useState<number>(6)
	const [size, setSize] = useState<number>(48)
	const [gap, setGap] = useState<number>(8)
	const [borderRadius, setBorderRadius] = useState<number>(8)
	const [type, setType] = useState<'text' | 'number' | 'password'>('text')
	const [disabled, setDisabled] = useState(false)
	const [autoFocus, setAutoFocus] = useState(false)
	const [error, setError] = useState(false)
	const [success, setSuccess] = useState(false)

	// 处理完成回调
	const handleComplete = (value: string, name: string) => {
		message.success(`${name} 输入完成: ${value}`)
		console.log(`${name} completed:`, value)
	}

	// 处理错误验证
	const handleErrorValidation = (value: string) => {
		if (value.length === 6) {
			// 模拟验证逻辑
			const isValid = value === '123456'
			setError(!isValid)
			setSuccess(isValid)

			if (isValid) {
				message.success('验证码正确！')
			} else {
				message.error('验证码错误，请重新输入')
			}
		}
	}

	// 重置所有状态
	const resetAll = () => {
		setCode1('')
		setCode2('')
		setCode3('')
		setCode4('')
		setCode5('')
		setCode6('')
		setCode7('')
		setCode8('')
		setError(false)
		setSuccess(false)
	}

	return (
		<div className='p-6 space-y-6'>
			<h1 className='text-2xl font-bold text-gray-800 mb-6'>验证码输入框组件演示</h1>

			{/* 基础用法 */}
			<Card title='基础用法' className='mb-6'>
				<Space direction='vertical' size='large' className='w-full'>
					<div>
						<h3 className='text-lg font-medium mb-3'>默认样式 (6位数字)</h3>
						<SquareInputBox
							value={code1}
							onChange={setCode1}
							onComplete={(value) => handleComplete(value, '基础用法')}
							autoFocus
						/>
						<p className='text-gray-500 mt-2'>当前值: {code1}</p>
					</div>

					<div>
						<h3 className='text-lg font-medium mb-3'>4位验证码</h3>
						<SquareInputBox
							length={4}
							value={code2}
							onChange={setCode2}
							onComplete={(value) => handleComplete(value, '4位验证码')}
						/>
						<p className='text-gray-500 mt-2'>当前值: {code2}</p>
					</div>

					<div>
						<h3 className='text-lg font-medium mb-3'>8位密码类型</h3>
						<SquareInputBox
							length={8}
							type='password'
							value={code3}
							onChange={setCode3}
							onComplete={(value) => handleComplete(value, '8位密码')}
						/>
						<p className='text-gray-500 mt-2'>当前值: {code3}</p>
					</div>
				</Space>
			</Card>

			{/* 自定义样式 */}
			<Card title='自定义样式' className='mb-6'>
				<Space direction='vertical' size='large' className='w-full'>
					<div>
						<h3 className='text-lg font-medium mb-3'>大尺寸输入框</h3>
						<SquareInputBox
							length={6}
							size={64}
							gap={12}
							borderRadius={12}
							value={code4}
							onChange={setCode4}
							onComplete={(value) => handleComplete(value, '大尺寸')}
						/>
					</div>

					<div>
						<h3 className='text-lg font-medium mb-3'>小尺寸输入框</h3>
						<SquareInputBox
							length={6}
							size={36}
							gap={4}
							borderRadius={4}
							value={code5}
							onChange={setCode5}
							onComplete={(value) => handleComplete(value, '小尺寸')}
						/>
					</div>
				</Space>
			</Card>

			{/* 状态演示 */}
			<Card title='状态演示' className='mb-6'>
				<Space direction='vertical' size='large' className='w-full'>
					<div>
						<h3 className='text-lg font-medium mb-3'>错误状态 (输入123456为正确)</h3>
						<SquareInputBox
							value={code6}
							onChange={(value) => {
								setCode6(value)
								handleErrorValidation(value)
							}}
							error={error}
							success={success}
						/>
						<p className='text-gray-500 mt-2'>当前值: {code6}</p>
					</div>

					<div>
						<h3 className='text-lg font-medium mb-3'>禁用状态</h3>
						<SquareInputBox value='123456' disabled={true} />
					</div>
				</Space>
			</Card>

			{/* 交互式配置 */}
			<Card title='交互式配置' className='mb-6'>
				<div className='grid grid-cols-2 gap-6'>
					<div className='space-y-4'>
						<div>
							<span className='block text-sm font-medium mb-2'>验证码长度</span>
							<InputNumber min={1} max={10} value={length} onChange={(v) => setLength(v ?? 0)} className='w-full' />
						</div>

						<div>
							<span className='block text-sm font-medium mb-2'>输入框大小 (px)</span>
							<InputNumber min={32} max={80} value={size} onChange={(v) => setSize(v ?? 0)} className='w-full' />
						</div>

						<div>
							<span className='block text-sm font-medium mb-2'>间距 (px)</span>
							<InputNumber min={0} max={20} value={gap} onChange={(v) => setGap(v ?? 0)} className='w-full' />
						</div>

						<div>
							<span className='block text-sm font-medium mb-2'>圆角 (px)</span>
							<InputNumber
								min={0}
								max={20}
								value={borderRadius}
								onChange={(v) => setBorderRadius(v ?? 0)}
								className='w-full'
							/>
						</div>
					</div>

					<div className='space-y-4'>
						<div>
							<span className='block text-sm font-medium mb-2'>输入类型</span>
							<Select value={type} onChange={setType} className='w-full'>
								<Option value='text'>文本</Option>
								<Option value='number'>数字</Option>
								<Option value='password'>密码</Option>
							</Select>
						</div>

						<div className='space-y-2'>
							<div className='flex items-center justify-between'>
								<span className='text-sm font-medium'>禁用状态</span>
								<Switch checked={disabled} onChange={setDisabled} />
							</div>

							<div className='flex items-center justify-between'>
								<span className='text-sm font-medium'>自动聚焦</span>
								<Switch checked={autoFocus} onChange={setAutoFocus} />
							</div>

							<div className='flex items-center justify-between'>
								<span className='text-sm font-medium'>错误状态</span>
								<Switch checked={error} onChange={setError} />
							</div>

							<div className='flex items-center justify-between'>
								<span className='text-sm font-medium'>成功状态</span>
								<Switch checked={success} onChange={setSuccess} />
							</div>
						</div>
					</div>
				</div>

				<div className='mt-6'>
					<h3 className='text-lg font-medium mb-3'>配置结果预览</h3>
					<SquareInputBox
						length={length}
						size={size}
						gap={gap}
						borderRadius={borderRadius}
						type={type}
						disabled={disabled}
						autoFocus={autoFocus}
						error={error}
						success={success}
						value={code7}
						onChange={setCode7}
						onComplete={(value) => handleComplete(value, '配置预览')}
					/>
					<p className='text-gray-500 mt-2'>当前值: {code7}</p>
				</div>
			</Card>

			{/* 实际应用场景 */}
			<Card title='实际应用场景' className='mb-6'>
				<Space direction='vertical' size='large' className='w-full'>
					<div>
						<h3 className='text-lg font-medium mb-3'>手机验证码</h3>
						<div className='flex items-center gap-4'>
							<SquareInputBox
								length={6}
								type='number'
								value={code8}
								onChange={setCode8}
								onComplete={(value) => {
									handleComplete(value, '手机验证码')
									message.info('正在验证验证码...')
								}}
								autoFocus
							/>
							<Button type='primary'>发送验证码</Button>
						</div>
						<p className='text-gray-500 mt-2'>当前值: {code8}</p>
					</div>
				</Space>
			</Card>

			{/* 操作按钮 */}
			<Card>
				<Space>
					<Button onClick={resetAll} type='primary'>
						重置所有
					</Button>
					<Button
						onClick={() => {
							console.log('所有验证码状态:', {
								code1,
								code2,
								code3,
								code4,
								code5,
								code6,
								code7,
								code8,
							})
						}}
					>
						查看控制台
					</Button>
				</Space>
			</Card>
		</div>
	)
}

export default SquareInputDemo
