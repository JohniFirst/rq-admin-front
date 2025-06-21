import { addEvents, editEvents } from '@/api/calendar'
import {
	Alert,
	Card,
	Checkbox,
	Col,
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
import type { FormInstance } from 'antd/es/form'
import dayjs from 'dayjs'
import type React from 'react'
import { useEffect } from 'react'
import { RRule } from 'rrule'

export interface EventFormData {
	title: string
	startDate: dayjs.Dayjs
	endDate: dayjs.Dayjs
	description?: string
	color: string
	freq?: number | null // 新增freq字段，代表重复类型
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

const EventModal: React.FC<EventModalProps> = ({ open, isEditMode, form, selectedEvent, onCancel }) => {
	useEffect(() => {
		if (open && isEditMode && selectedEvent) {
			form.setFieldsValue({
				title: selectedEvent.title,
				startDate: dayjs(selectedEvent.start),
				endDate: dayjs(selectedEvent.end),
				description: selectedEvent.description,
				color: selectedEvent.backgroundColor,
				freq: typeof selectedEvent.rrule?.freq === 'number' ? selectedEvent.rrule.freq : null,
				reminder: selectedEvent.extendedProps?.reminder || false,
			})
		}
		if (open && !isEditMode) {
			form.setFieldsValue({ freq: null })
			form.resetFields()
		}
	}, [open, isEditMode, selectedEvent, form])

	const repeatType = Form.useWatch('freq', form) // 用freq字段
	const untilType = Form.useWatch('untilType', form) || 'none'

	const handleOk = () => {
		form
			.validateFields()
			.then(async (values) => {
				let rrule: any
				if (values.freq != null) {
					rrule = {
						freq: values.freq,
						dtstart: values.startDate,
						interval: values.interval || 1,
					}
					if (values.freq === RRule.WEEKLY && values.byweekday) {
						rrule.byweekday = values.byweekday
					}
					if (values.freq === RRule.MONTHLY && values.bymonthday) {
						rrule.bymonthday = values.bymonthday
					}
					if (values.untilType === 'count' && values.count) {
						rrule.count = values.count
					}
					if (values.untilType === 'until' && values.until) {
						rrule.until = values.until.toDate()
					}
					// 自动加上duration字段
					rrule.duration = values.endDate.diff(values.startDate, 'second') * 1000
				}

				const newEvent = {
					title: values.title,
					start: values.startDate,
					end: values.endDate,
					description: values.description,
					backgroundColor: values.color,
					borderColor: values.color,
					allDay:
						values.startDate.isSame(values.startDate.startOf('day')) &&
						values.endDate.isSame(values.endDate.startOf('day')),
					extendedProps: {
						reminder: values.reminder,
					},
					rrule,
				}

				try {
					if (isEditMode && selectedEvent && selectedEvent.id) {
						// @ts-ignore
						newEvent.id = selectedEvent.id
						await editEvents({ event: JSON.stringify(newEvent) })
					} else {
						await addEvents({ event: JSON.stringify(newEvent) })
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
		>
			<Card styles={{ body: { padding: 24 } }}>
				<Form form={form} layout='vertical'>
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
								<Input type='color' />
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item name='startDate' label='开始时间' rules={[{ required: true, message: '请选择开始时间' }]}>
								<DatePicker showTime style={{ width: '100%' }} locale={zhCN} />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name='endDate' label='结束时间' rules={[{ required: true, message: '请选择结束时间' }]}>
								<DatePicker showTime style={{ width: '100%' }} locale={zhCN} />
							</Form.Item>
						</Col>
					</Row>
					<Form.Item name='description' label='描述' rules={[{ required: true, message: '请输入事件描述' }]}>
						<Input.TextArea placeholder='可填写详细说明' autoSize={{ minRows: 2, maxRows: 4 }} />
					</Form.Item>
					<Alert message='重复设置' type='info' showIcon style={{ margin: '24px 0 16px 0' }} />
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item name='freq' label='重复' initialValue={null}>
								<Select allowClear placeholder='请选择重复类型'>
									{eventRepeatOptions.map((opt) => (
										<Select.Option key={String(opt.value)} value={opt.value}>
											{opt.label}
										</Select.Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						{repeatType !== null && (
							<Col span={12}>
								<Form.Item name='interval' label='重复间隔'>
									<InputNumber min={1} defaultValue={1} addonAfter='次' style={{ width: '100%' }} />
								</Form.Item>
							</Col>
						)}
					</Row>
					{repeatType === RRule.WEEKLY && (
						<Form.Item name='byweekday' label='每周哪几天'>
							<Checkbox.Group options={weekdayOptions} />
						</Form.Item>
					)}
					{repeatType === RRule.MONTHLY && (
						<Col span={12}>
							<Form.Item name='bymonthday' label='每月哪几天'>
								<DatePicker multiple maxTagCount='responsive' defaultValue={[dayjs('2000-01-01')]} />
							</Form.Item>
						</Col>
					)}
					{repeatType !== null && (
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item name='untilType' label='截止方式' initialValue='none'>
									<Select>
										<Select.Option value='none'>无限</Select.Option>
										<Select.Option value='count'>按次数</Select.Option>
										<Select.Option value='until'>按日期</Select.Option>
									</Select>
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
										<DatePicker showTime style={{ width: '100%' }} locale={zhCN} />
									</Form.Item>
								</Col>
							)}
						</Row>
					)}
					<Alert message='提醒设置' type='info' showIcon style={{ margin: '24px 0 16px 0' }} />
					<Form.Item name='reminder' label='提醒' valuePropName='checked'>
						<Switch checkedChildren='开启' unCheckedChildren='关闭' />
					</Form.Item>
				</Form>
			</Card>
		</Modal>
	)
}

export default EventModal
