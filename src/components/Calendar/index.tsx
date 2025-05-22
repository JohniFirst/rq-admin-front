import type { DateSelectArg, EventInput } from '@fullcalendar/core'
import zhCnLocale from '@fullcalendar/core/locales/zh-cn'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import { Card, DatePicker, Form, Input, Modal, Tag, message } from 'antd'
import dayjs from 'dayjs'
import type React from 'react'
import { useState } from 'react'
import './calendar.css'

const Calendar: React.FC = () => {
	const [events, setEvents] = useState<EventInput[]>([])
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [isDetailModalVisible, setIsDetailModalVisible] = useState(false)
	const [selectedEvent, setSelectedEvent] = useState<EventInput | null>(null)
	const [form] = Form.useForm()
	const [_selectedDate, setSelectedDate] = useState<DateSelectArg | null>(null)

	const handleDateSelect = (selectInfo: DateSelectArg) => {
		setSelectedDate(selectInfo)
		form.setFieldsValue({
			startDate: dayjs(selectInfo.start),
			endDate: dayjs(selectInfo.end),
		})
		setIsModalVisible(true)
	}

	const handleEventClick = (info: any) => {
		setSelectedEvent(info.event)
		setIsDetailModalVisible(true)
	}

	const handleEventDrop = (info: any) => {
		const updatedEvents = events.map((event) => {
			if (event.id === info.event.id) {
				return {
					...event,
					start: info.event.start,
					end: info.event.end,
				}
			}
			return event
		})
		setEvents(updatedEvents)
		message.success('事件已更新')
	}

	const handleSubmit = () => {
		form.validateFields().then((values) => {
			const newEvent: EventInput = {
				id: Date.now().toString(),
				title: values.title,
				start: values.startDate.toDate(),
				end: values.endDate.toDate(),
				description: values.description,
				backgroundColor: values.color || '#1890ff',
				borderColor: values.color || '#1890ff',
			}
			setEvents([...events, newEvent])
			setIsModalVisible(false)
			form.resetFields()
			message.success('事件已添加')
		})
	}

	return (
		<Card className='calendar-card'>
			<FullCalendar
				plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
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
				height='auto'
				eventTimeFormat={{
					hour: '2-digit',
					minute: '2-digit',
					meridiem: false,
					hour12: false,
				}}
			/>

			<Modal
				title='添加事件'
				open={isModalVisible}
				onOk={handleSubmit}
				onCancel={() => {
					setIsModalVisible(false)
					form.resetFields()
				}}
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
				footer={null}
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
