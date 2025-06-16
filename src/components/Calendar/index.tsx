import type {
	DateSelectArg,
	EventClickArg,
	EventInput,
	EventMountArg,
} from '@fullcalendar/core'
import zhCnLocale from '@fullcalendar/core/locales/zh-cn'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import FullCalendar from '@fullcalendar/react'
import rrulePlugin from '@fullcalendar/rrule'
import timeGridPlugin from '@fullcalendar/timegrid'
import {
	Button,
	Card,
	DatePicker,
	Form,
	Input,
	Modal,
	Radio,
	Space,
	Tag,
	message,
} from 'antd'
import dayjs from 'dayjs'
import type React from 'react'
import { useEffect, useState } from 'react'
import './calendar.css'
import { getEventsList } from '@/api/calendar'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css' // optional for styling
import 'tippy.js/animations/scale.css' // optional for animations
import 'tippy.js/themes/light.css' // optional for themes

type RepeatType = keyof typeof eventRepeatOptions

interface EventFormData {
	title: string
	startDate: dayjs.Dayjs
	endDate: dayjs.Dayjs
	description?: string
	color: string
	repeat: RepeatType
	reminder: boolean
}

interface CustomEventInput extends EventInput {
	daysOfWeek?: number[]
	startTime?: string
	endTime?: string
}

const eventRepeatOptions = {
	none: '不重复',
	daily: '每天',
	weekly: '每周',
}

const Calendar: React.FC = () => {
	const [events, setEvents] = useState<CustomEventInput[]>([
		{
			id: '1',
			title: '非全天时间不重复测试',
			start: '2025-06-12T10:00:00',
			end: '2025-06-12T12:00:00',
			backgroundColor: '#1890ff',
			borderColor: '#1890ff',
			allDay: false,
			extendedProps: {
				reminder: true,
				repeat: 'none',
			},
		},
		{
			id: '2',
			title: '每周重复事件',
			start: '2025-06-12T10:00:00',
			end: '2025-06-12T12:00:00',
			backgroundColor: '#52c41a',
			borderColor: '#52c41a',
			allDay: false,
			rrule: {
				freq: 'weekly',
				dtstart: '2025-06-12T10:00:00',
				count: 5,
				// interval: 2,
				bymonthday: [1],
			},
			exdate: ['2025-06-19T10:00:00'],
			extendedProps: {
				reminder: true,
				repeat: 'weekly',
			},
		},
		{
			id: '3',
			title: '持续事件',
			start: '2025-06-10T00:00:00',
			end: '2025-06-12T23:59:59',
			backgroundColor: '#722ed1',
			borderColor: '#722ed1',
			allDay: true,
			extendedProps: {
				reminder: true,
				repeat: 'none',
			},
			rrule: {
				freq: 'weekly',
				dtstart: '2025-06-10T00:00:00',
			},
			duration: { days: 2 },
		},
		{
			title: '循环事件-非全天事件的测试',
			start: '2025-06-15T09:00:00',
			end: '2025-06-15T13:00:00',
			allDay: false,
			color: 'blue',
			rrule: {
				freq: 'weekly',
				dtstart: '2025-06-15T09:00:00',
			},
			exdate: ['2025-06-22T09:00:00'],
			duration: { hours: 4 },
		},
	])
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [isDetailModalVisible, setIsDetailModalVisible] = useState(false)
	const [selectedEvent, setSelectedEvent] = useState<CustomEventInput | null>()
	const [form] = Form.useForm<EventFormData>()
	const [_selectedDate, setSelectedDate] = useState<DateSelectArg | null>(null)
	const [isEditMode, setIsEditMode] = useState(false)

	// 检查今天的提醒
	useEffect(() => {
		const today = dayjs().startOf('day')
		const todayEvents = events.filter((event) => {
			const eventDate = dayjs(event.start as Date)
			return eventDate.isSame(today, 'day') && event.extendedProps?.reminder
		})

		if (todayEvents.length > 0) {
			Modal.info({
				title: '今日提醒',
				content: (
					<div>
						<p>今天有以下日程：</p>
						<ul>
							{todayEvents.map((event) => (
								<li key={event.id}>
									{event.title} - {dayjs(event.start as Date).format('HH:mm')}
								</li>
							))}
						</ul>
					</div>
				),
				okText: '知道了',
			})
		}
	}, [events])

	useEffect(() => {
		getList()
	}, [])

	const getList = () => {
		getEventsList().then((res) => {
			console.log('events res', res)
		})
	}

	const handleDateSelect = (selectInfo: DateSelectArg) => {
		setSelectedDate(selectInfo)
		form.setFieldsValue({
			startDate: dayjs(selectInfo.start),
			endDate: dayjs(selectInfo.end),
			repeat: 'none',
			reminder: true,
			color: '#1890ff',
		})
		setIsEditMode(false)
		setIsModalVisible(true)
	}

	const handleEventClick = (info: EventClickArg) => {
		setSelectedEvent(
			Object.assign(info.event, info.event.extendedProps) as CustomEventInput,
		)
		setIsDetailModalVisible(true)
	}

	const handleEventDrop = (info: EventClickArg) => {
		const updatedEvents = events.map((event) => {
			if (event.id === info.event.id) {
				const updatedEvent: CustomEventInput = {
					...event,
					start: info.event.start?.toISOString(),
					end: info.event.end?.toISOString(),
				}
				return updatedEvent
			}
			return event
		})
		setEvents(updatedEvents)
		message.success('事件已更新')
	}

	const handleEventResize = (info: EventClickArg) => {
		const updatedEvents = events.map((event) => {
			if (event.id === info.event.id) {
				const updatedEvent: CustomEventInput = {
					...event,
					start: info.event.start?.toISOString(),
					end: info.event.end?.toISOString(),
				}
				return updatedEvent
			}
			return event
		})
		setEvents(updatedEvents)
		message.success('事件时间已调整')
	}

	const handleSubmit = () => {
		form.validateFields().then((values) => {
			const newEvent: CustomEventInput = {
				id: isEditMode ? selectedEvent?.id : Date.now().toString(),
				title: values.title,
				start: values.startDate.toDate(),
				end: values.endDate.toDate(),
				description: values.description,
				backgroundColor: values.color,
				borderColor: values.color,
				allDay:
					values.startDate.isSame(values.startDate.startOf('day')) &&
					values.endDate.isSame(values.endDate.startOf('day')),
				extendedProps: {
					reminder: values.reminder,
				},
			}

			if (isEditMode) {
				const updatedEvents = events.map((event) =>
					event.id === newEvent.id ? newEvent : event,
				)
				setEvents(updatedEvents)
				message.success('事件已更新')
			} else {
				setEvents([...events, newEvent])
				message.success('事件已添加')
			}

			setIsModalVisible(false)
			form.resetFields()
		})
	}

	const handleEdit = () => {
		if (selectedEvent) {
			form.setFieldsValue({
				title: selectedEvent.title,
				startDate: dayjs(selectedEvent.start as Date),
				endDate: dayjs(selectedEvent.end as Date),
				description: selectedEvent.description,
				color: selectedEvent.backgroundColor as string,
				repeat: selectedEvent.extendedProps?.repeat || 'none',
				reminder: selectedEvent.extendedProps?.reminder || false,
			})
			setIsEditMode(true)
			setIsDetailModalVisible(false)
			setIsModalVisible(true)
		}
	}

	const handleDelete = () => {
		if (selectedEvent) {
			Modal.confirm({
				title: '确认删除',
				content: '确定要删除这个事件吗？',
				onOk: () => {
					const updatedEvents = events.filter(
						(event) => event.id !== selectedEvent.id,
					)
					setEvents(updatedEvents)
					setIsDetailModalVisible(false)
					message.success('事件已删除')
				},
			})
		}
	}

	function handleEventDidMount(mountArg: EventMountArg): void {
		const { event, el, view } = mountArg
		const title = event.title || '无标题'
		let start = ''
		if (event.allDay) {
			const startDate = dayjs(event.start as Date).format('YYYY-MM-DD')
			const endDate = dayjs(event.end as Date).format('YYYY-MM-DD')
			start = `${startDate} 至 ${endDate}`
		} else {
			const startTime = dayjs(event.start as Date).format('HH:mm')
			const endTime = dayjs(event.end as Date).format('HH:mm')
			start = `${startTime} 至 ${endTime}`
		}

		tippy(el, {
			content: `
				<div>
					<h4>${title}</h4>
					<p>${start}</p>
				</div>
			`,
			allowHTML: true,
			theme: 'light',
			animation: 'scale',
			placement: view.type === 'dayGridMonth' ? 'auto' : 'left',
		})
	}

	return (
		<Card className='calendar-card'>
			<FullCalendar
				plugins={[
					dayGridPlugin,
					timeGridPlugin,
					interactionPlugin,
					listPlugin,
					rrulePlugin,
				]}
				initialView='dayGridMonth'
				headerToolbar={{
					left: 'prev,next today',
					center: 'title',
					right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
				}}
				locale={zhCnLocale}
				editable={true}
				selectable={true}
				selectMirror={true}
				dayMaxEvents={true}
				weekends={true}
				events={events}
				select={handleDateSelect}
				eventClick={handleEventClick}
				eventDrop={handleEventDrop}
				eventResize={handleEventResize}
				eventDidMount={handleEventDidMount}
				height='auto'
				eventTimeFormat={{
					hour: '2-digit',
					minute: '2-digit',
					meridiem: false,
					hour12: false,
				}}
				eventResizableFromStart={true}
				eventMinHeight={20}
				eventMinWidth={20}
				allDaySlot={true}
				slotMinTime='00:00'
				slotMaxTime='24:00'
				slotDuration='00:30'
				slotLabelInterval='01:00'
				expandRows={true}
				stickyHeaderDates={true}
				nowIndicator={true}
				eventOverlap={false}
				eventConstraint={{
					startTime: '00:00',
					endTime: '23:59',
				}}
				eventStartEditable={true}
				eventDurationEditable={true}
			/>

			<Modal
				title={isEditMode ? '编辑事件' : '添加事件'}
				open={isModalVisible}
				onOk={handleSubmit}
				onCancel={() => {
					setIsModalVisible(false)
					form.resetFields()
				}}
				width={600}
			>
				<Form form={form} layout='vertical'>
					<Form.Item
						name='title'
						label='标题'
						rules={[{ required: true, message: '请输入事件标题' }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						name='startDate'
						label='开始时间'
						rules={[{ required: true, message: '请选择开始时间' }]}
					>
						<DatePicker showTime />
					</Form.Item>
					<Form.Item
						name='endDate'
						label='结束时间'
						rules={[{ required: true, message: '请选择结束时间' }]}
					>
						<DatePicker showTime />
					</Form.Item>
					<Form.Item name='repeat' label='重复'>
						<Radio.Group>
							{Object.entries(eventRepeatOptions).map(([key, value]) => (
								<Radio key={key} value={key}>
									{value}
								</Radio>
							))}
						</Radio.Group>
					</Form.Item>
					<Form.Item name='reminder' label='提醒' valuePropName='checked'>
						<Radio.Group>
							<Radio value={true}>开启</Radio>
							<Radio value={false}>关闭</Radio>
						</Radio.Group>
					</Form.Item>
					<Form.Item name='color' label='事件颜色'>
						<Input type='color' defaultValue='#1890ff' />
					</Form.Item>
					<Form.Item name='description' label='描述'>
						<Input.TextArea />
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				title='事件详情'
				open={isDetailModalVisible}
				onCancel={() => setIsDetailModalVisible(false)}
				footer={
					<div className='event-actions'>
						<Space>
							<Button onClick={handleEdit}>编辑</Button>
							<Button danger onClick={handleDelete}>
								删除
							</Button>
						</Space>
					</div>
				}
			>
				{selectedEvent && (
					<div className='event-detail'>
						<h3>{selectedEvent.title}</h3>
						<p>
							<strong>开始时间：</strong>
							{selectedEvent.start?.toLocaleString()}
						</p>
						<p>
							<strong>结束时间：</strong>
							{selectedEvent.end?.toLocaleString()}
						</p>
						{selectedEvent.description && (
							<p>
								<strong>描述：</strong>
								{selectedEvent.description}
							</p>
						)}
						<p>
							<strong>重复：</strong>
							{
								eventRepeatOptions[
									(selectedEvent.extendedProps?.repeat as RepeatType) ?? 'none'
								]
							}
						</p>
						<p>
							<strong>提醒：</strong>
							{selectedEvent.extendedProps?.reminder ? '开启' : '关闭'}
						</p>
						<div className='event-color'>
							<strong>事件颜色：</strong>
							<Tag color={selectedEvent.backgroundColor as string}>
								{selectedEvent.backgroundColor}
							</Tag>
						</div>
					</div>
				)}
			</Modal>
		</Card>
	)
}

export default Calendar
