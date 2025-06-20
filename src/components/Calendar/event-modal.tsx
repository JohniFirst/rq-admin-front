import { handleEvents } from '@/api/calendar'
import {
	Card,
	Checkbox,
	Col,
	DatePicker,
	Divider,
	Form,
	Input,
	InputNumber,
	Modal,
	Radio,
	Row,
	Select,
	Tooltip,
	message,
} from 'antd'
import type { FormInstance } from 'antd/es/form'
import { format } from 'date-fns'
import dayjs from 'dayjs'
import type React from 'react'
import { useEffect } from 'react'
import type { RepeatType } from './index'

export interface EventFormData {
	title: string
	startDate: dayjs.Dayjs
	endDate: dayjs.Dayjs
	description?: string
	color: string
	repeat: RepeatType
	reminder: boolean
	interval?: number // 重复间隔
	byweekday?: number[] // 周几
	bymonthday?: number[] // 月几号
	count?: number // 重复次数
	until?: dayjs.Dayjs // 截止日期
	untilType?: 'none' | 'count' | 'until' // 截止方式
}

interface EventModalProps {
	open: boolean
	isEditMode: boolean
	form: FormInstance<EventFormData>
	eventRepeatOptions: Record<string, string>
	events: any[]
	setEvents: (events: any[]) => void
	selectedEvent?: any
	onCancel: () => void
}

const weekdayOptions = [
	{ label: '周日', value: 0 },
	{ label: '周一', value: 1 },
	{ label: '周二', value: 2 },
	{ label: '周三', value: 3 },
	{ label: '周四', value: 4 },
	{ label: '周五', value: 5 },
	{ label: '周六', value: 6 },
]

const EventModal: React.FC<EventModalProps> = ({
	open,
	isEditMode,
	form,
	eventRepeatOptions,
	events,
	setEvents,
	selectedEvent,
	onCancel,
}) => {
	useEffect(() => {
		if (open && isEditMode && selectedEvent) {
			form.setFieldsValue({
				title: selectedEvent.title,
				startDate: dayjs(selectedEvent.start),
				endDate: dayjs(selectedEvent.end),
				description: selectedEvent.description,
				color: selectedEvent.backgroundColor,
				repeat: selectedEvent.extendedProps?.repeat || 'none',
				reminder: selectedEvent.extendedProps?.reminder || false,
			})
		}
		if (open && !isEditMode) {
			form.resetFields()
		}
	}, [open, isEditMode, selectedEvent, form])

	const repeatType = Form.useWatch('repeat', form) || 'none'
	const untilType = Form.useWatch('untilType', form) || 'none'

	const handleOk = () => {
		form
			.validateFields()
			.then(async (values) => {
				let rrule: any = undefined
				if (values.repeat && values.repeat !== 'none') {
					// freq 必须是 rrule 支持的字符串
					const freq =
						values.repeat === 'daily'
							? 'DAILY'
							: values.repeat === 'weekly'
								? 'WEEKLY'
								: values.repeat === 'monthly'
									? 'MONTHLY'
									: values.repeat === 'yearly'
										? 'YEARLY'
										: undefined
					if (freq) {
						rrule = {
							freq,
							dtstart: format(values.startDate.toDate(), 'yyyy-MM-dd HH:mm:ss'),
							interval: values.interval || 1,
						}
						if (values.repeat === 'weekly' && values.byweekday) {
							rrule.byweekday = values.byweekday
						}
						if (values.repeat === 'monthly' && values.bymonthday) {
							rrule.bymonthday = values.bymonthday
						}
						if (values.untilType === 'count' && values.count) {
							rrule.count = values.count
						}
						if (values.untilType === 'until' && values.until) {
							rrule.until = format(values.until.toDate(), 'yyyy-MM-dd HH:mm:ss')
						}
					}
				}
				const newEvent = {
					id: isEditMode ? selectedEvent?.id : Date.now().toString(),
					title: values.title,
					start: format(values.startDate.toDate(), 'yyyy-MM-dd HH:mm:ss'),
					end: format(values.endDate.toDate(), 'yyyy-MM-dd HH:mm:ss'),
					description: values.description,
					backgroundColor: values.color,
					borderColor: values.color,
					allDay:
						values.startDate.isSame(values.startDate.startOf('day')) &&
						values.endDate.isSame(values.endDate.startOf('day')),
					extendedProps: {
						reminder: values.reminder,
						repeat: values.repeat,
					},
					rrule,
				}
				try {
					await handleEvents({ event: JSON.stringify(newEvent) })
					if (isEditMode) {
						const updated = events.map((event) =>
							event.id === newEvent.id ? newEvent : event,
						)
						setEvents(updated)
						message.success('事件已更新')
					} else {
						setEvents([...events, newEvent])
						message.success('事件已添加')
					}
					onCancel()
					form.resetFields()
				} catch (e) {
					message.error('提交到后台失败')
				}
			})
			.catch(() => {
				message.error('请完善表单信息')
			})
	}

	return (
		<Modal
			title={isEditMode ? '编辑事件' : '添加事件'}
			open={open}
			onOk={handleOk}
			onCancel={() => {
				onCancel()
				form.resetFields()
			}}
			width={700}
			bodyStyle={{ padding: 0 }}
		>
			<Card bordered={false} bodyStyle={{ padding: 24 }}>
				<Form form={form} layout='vertical'>
					<Divider orientation='left'>基础信息</Divider>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name='title'
								label='标题'
								rules={[{ required: true, message: '请输入事件标题' }]}
							>
								<Input placeholder='如：团队例会' />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name='color' label='事件颜色'>
								<Input
									type='color'
									style={{
										width: 60,
										height: 32,
										padding: 0,
										border: 'none',
										background: 'none',
									}}
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name='startDate'
								label='开始时间'
								rules={[{ required: true, message: '请选择开始时间' }]}
							>
								<DatePicker showTime style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name='endDate'
								label='结束时间'
								rules={[{ required: true, message: '请选择结束时间' }]}
							>
								<DatePicker showTime style={{ width: '100%' }} />
							</Form.Item>
						</Col>
					</Row>
					<Form.Item
						name='description'
						label='描述'
						rules={[{ required: true, message: '请输入事件描述' }]}
					>
						<Input.TextArea
							placeholder='可填写详细说明'
							autoSize={{ minRows: 2, maxRows: 4 }}
						/>
					</Form.Item>
					<Divider orientation='left'>重复设置</Divider>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item name='repeat' label='重复'>
								<Radio.Group>
									{Object.entries(eventRepeatOptions).map(([key, value]) => (
										<Radio key={key} value={key}>
											{value}
										</Radio>
									))}
								</Radio.Group>
							</Form.Item>
						</Col>
						{repeatType !== 'none' && (
							<Col span={12}>
								<Form.Item name='interval' label='重复间隔'>
									<InputNumber
										min={1}
										defaultValue={1}
										addonAfter='次'
										style={{ width: '100%' }}
									/>
								</Form.Item>
							</Col>
						)}
					</Row>
					{repeatType === 'weekly' && (
						<Form.Item name='byweekday' label='每周哪几天'>
							<Checkbox.Group options={weekdayOptions} />
						</Form.Item>
					)}
					{repeatType === 'monthly' && (
						<Form.Item name='bymonthday' label='每月哪几天'>
							<Select
								mode='multiple'
								style={{ width: '100%' }}
								placeholder='选择日期(1-31)'
							>
								{Array.from({ length: 31 }, (_, i) => (
									<Select.Option key={i + 1} value={i + 1}>
										{i + 1}
									</Select.Option>
								))}
							</Select>
						</Form.Item>
					)}
					{repeatType !== 'none' && (
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item
									name='untilType'
									label='截止方式'
									initialValue='none'
								>
									<Radio.Group>
										<Radio value='none'>无限</Radio>
										<Radio value='count'>按次数</Radio>
										<Radio value='until'>按日期</Radio>
									</Radio.Group>
								</Form.Item>
							</Col>
							{untilType === 'count' && (
								<Col span={12}>
									<Form.Item name='count' label='重复次数'>
										<InputNumber min={1} style={{ width: '100%' }} />
									</Form.Item>
								</Col>
							)}
							{untilType === 'until' && (
								<Col span={12}>
									<Form.Item name='until' label='截止日期'>
										<DatePicker showTime style={{ width: '100%' }} />
									</Form.Item>
								</Col>
							)}
						</Row>
					)}
					<Divider orientation='left'>提醒设置</Divider>
					<Form.Item name='reminder' label='提醒' valuePropName='checked'>
						<Radio.Group>
							<Radio value={true}>开启</Radio>
							<Radio value={false}>关闭</Radio>
						</Radio.Group>
					</Form.Item>
				</Form>
			</Card>
		</Modal>
	)
}

export default EventModal

// 删除交互设计建议：
// 在 DetailModal 中，若为重复事件，删除按钮弹窗应有选项：
// “仅删除本次” => 将 occurrence 日期加入 exdate
// “删除全部” => 删除整个事件
// “本次及后续” => rrule.until 设为 occurrence 前一天
// 可通过 props 传递 occurrence 日期和删除回调，具体实现见 DetailModal 设计
