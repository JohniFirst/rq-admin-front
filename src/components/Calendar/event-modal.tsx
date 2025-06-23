import { addEvents, editEvents } from '@/api/calendar'
import {
	Alert,
	Card,
	Checkbox,
	Col,
	ColorPicker,
	DatePicker,
	Form,
	Input,
	InputNumber,
	Modal,
	Row,
	Select,
	Switch,
	message,
} from 'antd'
import zhCN from 'antd/es/date-picker/locale/zh_CN'
import dayjs from 'dayjs'
import type React from 'react'
import { useEffect } from 'react'
import { RRule } from 'rrule'

export interface EventFormData {
	title: string
	start: dayjs.Dayjs
	end: dayjs.Dayjs
	description?: string
	color: string
	reminder: boolean
	rrule?: {
		freq?: number | null // 新增freq字段，代表重复类型
		interval?: number // 重复间隔
		byweekday?: number[] // 周几
		bymonthday?: number[] // 月几号
		count?: number // 重复次数
		until?: dayjs.Dayjs // 截止日期
	}
	untilType?: 'none' | 'count' | 'until' // 截止方式
}

interface EventModalProps {
	open: boolean
	isEditMode: boolean
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

// 只保留RRule的枚举，不再定义eventRepeatOptions
export const eventRepeatOptions = [
	{ label: '不重复', value: null },
	{ label: '每天', value: RRule.DAILY },
	{ label: '每周', value: RRule.WEEKLY },
	{ label: '每月', value: RRule.MONTHLY },
	{ label: '每年', value: RRule.YEARLY },
]

const EventModal: React.FC<EventModalProps> = ({ open, isEditMode, selectedEvent, onCancel }) => {
	const [form] = Form.useForm<EventFormData>()

	useEffect(() => {
		if (open && selectedEvent) {
			form.setFieldsValue({
				title: selectedEvent.title,
				start: dayjs(selectedEvent.start),
				end: dayjs(selectedEvent.end),
				description: selectedEvent.description,
				reminder: selectedEvent.extendedProps?.reminder || false,
				rrule: selectedEvent.rrule || { freq: null, interval: 1 },
			})
		}
		// else if (open && !isEditMode) {
		// 	form.setFieldsValue({
		// 		rrule: { freq: null, interval: 1 },
		// 		reminder: false,
		// 	})
		// }
	}, [open, isEditMode, selectedEvent, form])

	const rrule = Form.useWatch('rrule', form) || {}
	const repeatType = rrule.freq
	const untilType = form.getFieldValue('untilType') || 'none'

	const handleOk = () => {
		form
			.validateFields()
			.then(async (values) => {
				let rruleObj: any = undefined
				if (values.rrule && values.rrule.freq !== null) {
					rruleObj = {
						freq: values.rrule.freq,
						dtstart: values.start,
						interval: values.rrule.interval || 1,
					}
					if (values.rrule.freq === RRule.WEEKLY && values.rrule.byweekday) {
						rruleObj.byweekday = values.rrule.byweekday
					}
					if (values.rrule.freq === RRule.MONTHLY && values.rrule.bymonthday) {
						rruleObj.bymonthday = values.rrule.bymonthday
					}
					if (values.untilType === 'count' && values.rrule.count) {
						rruleObj.count = values.rrule.count
					}
					if (values.untilType === 'until' && values.rrule.until) {
						rruleObj.until = values.rrule.until.toDate()
					}
					// 自动加上duration字段
					rruleObj.duration = values.end.diff(values.start, 'second') * 1000
				}

				const newEvent = {
					title: values.title,
					start: values.start,
					end: values.end,
					description: values.description,
					backgroundColor: values.color,
					borderColor: values.color,
					allDay: values.start.isSame(values.start.startOf('day')) && values.end.isSame(values.end.startOf('day')),
					extendedProps: {
						reminder: values.reminder,
					},
					rrule: rruleObj,
				}

				try {
					if (isEditMode && selectedEvent && selectedEvent.id) {
						// @ts-ignore
						newEvent.id = selectedEvent.id
						await editEvents({ event: JSON.stringify(newEvent) })
					} else {
						await addEvents({ event: JSON.stringify(newEvent) })
					}

					message.success(isEditMode ? '事件编辑成功' : '事件添加成功')

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
		>
			<Card styles={{ body: { padding: 24 } }}>
				<Form<EventFormData>
					form={form}
					layout='vertical'
					initialValues={{
						rrule: {
							freq: null,
							interval: 1,
						},
						reminder: false,
						reminderTime: 10,
						untilType: 'none',
					}}
				>
					{/* 更明显的分隔线，用 Alert 替换 Divider */}
					<Alert message='基础信息' type='info' showIcon style={{ marginBottom: 16 }} />
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item name='title' label='标题' rules={[{ required: true, message: '请输入事件标题' }]}>
								<Input placeholder='如：团队例会' />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name='color' label='事件颜色'>
								<ColorPicker defaultValue={'#1890ff'} />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name='start' label='开始时间' rules={[{ required: true, message: '请选择开始时间' }]}>
								<DatePicker showTime style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name='end' label='结束时间' rules={[{ required: true, message: '请选择结束时间' }]}>
								<DatePicker showTime style={{ width: '100%' }} />
							</Form.Item>
						</Col>
					</Row>
					<Form.Item name='description' label='描述' rules={[{ required: true, message: '请输入事件描述' }]}>
						<Input.TextArea placeholder='可填写详细说明' autoSize={{ minRows: 2, maxRows: 4 }} />
					</Form.Item>

					<Alert message='重复设置' type='info' showIcon style={{ margin: '24px 0 16px 0' }} />
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item name={['rrule', 'freq']} label='重复'>
								<Select allowClear placeholder='请选择重复类型'>
									{eventRepeatOptions.map((opt) => (
										<Select.Option key={String(opt.value)} value={opt.value}>
											{opt.label}
										</Select.Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						{repeatType != null && (
							<Col span={12}>
								<Form.Item name={['rrule', 'interval']} label='重复间隔'>
									<InputNumber min={1} addonAfter='次' style={{ width: '100%' }} />
								</Form.Item>
							</Col>
						)}
					</Row>
					{repeatType === RRule.WEEKLY && (
						<Form.Item name={['rrule', 'byweekday']} label='每周哪几天'>
							<Checkbox.Group options={weekdayOptions} />
						</Form.Item>
					)}
					{repeatType === RRule.MONTHLY && (
						<Form.Item name={['rrule', 'bymonthday']} label='每月哪几天'>
							<Select mode='multiple' style={{ width: '100%' }} placeholder='选择日期(1-31)' optionLabelProp='label'>
								{Array.from({ length: 31 }, (_, i) => (
									<Select.Option key={i + 1} value={i + 1} label={i + 1}>
										<span style={{ fontWeight: 600, color: '#d46b08' }}>{i + 1}号</span>
									</Select.Option>
								))}
							</Select>
						</Form.Item>
					)}
					{repeatType != null && (
						<Form.Item name='untilType' label='截止方式'>
							<Select>
								<Select.Option value='none'>无限</Select.Option>
								<Select.Option value='count'>按次数</Select.Option>
								<Select.Option value='until'>按日期</Select.Option>
							</Select>
						</Form.Item>
					)}
					{repeatType != null && untilType === 'count' && (
						<Form.Item name={['rrule', 'count']} label='重复次数'>
							<InputNumber min={1} style={{ width: '100%' }} />
						</Form.Item>
					)}
					{repeatType != null && untilType === 'until' && (
						<Form.Item name={['rrule', 'until']} label='截止日期'>
							<DatePicker showTime style={{ width: '100%' }} locale={zhCN} />
						</Form.Item>
					)}

					<Alert message='提醒设置' type='info' showIcon style={{ margin: '24px 0 16px 0' }} />
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item name='reminder' label='提醒' valuePropName='checked'>
								<Switch checkedChildren='开启' unCheckedChildren='关闭' />
							</Form.Item>
						</Col>

						{Form.useWatch('reminder', form) && (
							<Col span={12}>
								<Form.Item name='reminderTime' label='提醒时机'>
									<Select style={{ width: '100%' }}>
										<Select.Option value={5}>提前5分钟</Select.Option>
										<Select.Option value={10}>提前10分钟</Select.Option>
										<Select.Option value={30}>提前30分钟</Select.Option>
										<Select.Option value={60}>提前1小时</Select.Option>
										<Select.Option value={1440}>提前1天</Select.Option>
									</Select>
								</Form.Item>
							</Col>
						)}
					</Row>
				</Form>
			</Card>
		</Modal>
	)
}

export default EventModal
